import { days, places, trip } from './data/itinerary.js';
import { buildHierarchy, nodeTypes, duration } from './data/hierarchy.js';

const $=id=>document.getElementById(id);
const escape=value=>String(value??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const modes={walk:'步行',transit:'公共交通',train:'轨道交通',ferry:'轮渡',shuttle:'接驳车',ride:'打车',flight:'飞机'};
let day=days[0],mode='route',selected,model,map,routeLayer,markerLayer;
const expanded=new Set();
const point=id=>[places[id].lat,places[id].lng];
const sum=budget=>budget?Object.values(budget).reduce((a,b)=>a+b,0):null;
const time=e=>e.start?`${e.start}–${e.end}`:'时间待确认';
const color=e=>nodeTypes[e.kind].color;
const shortName=id=>places[id].name.split(' · ').at(-1);
const mapTitle=e=>e.kind==='place'?shortName(e.at):e.kind==='transfer'?`${shortName(e.from)} → ${shortName(e.to)}`:e.title;
const visible=()=>model.parents.flatMap(p=>expanded.has(p.id)?[p,...p.children]:[p]);
const route=e=>e.children?e.children.flatMap(route):e.from?[e.from,...(e.via||[]),e.to].map(point):[point(e.at)];
const nodePoint=e=>e.kind==='place'?point(e.at):e.from?route(e)[Math.floor((route(e).length-1)/2)].map((v,i)=>(v+route(e)[Math.ceil((route(e).length-1)/2)][i])/2):point(e.at);
function writeHash(){history.replaceState(null,'',`#${new URLSearchParams({day:day.id,mode,event:selected.id,open:[...expanded].join(',')})}`);}
function readHash(){
  const p=new URLSearchParams(window.location.hash.slice(1));day=days.find(d=>d.id===p.get('day'))||days[0];mode=p.get('mode')==='time'?'time':'route';model=buildHierarchy(day,places);expanded.clear();
  (p.get('open')||'').split(',').forEach(id=>{if(model.nodes.get(id)?.children)expanded.add(id);});
  selected=model.nodes.get(p.get('event'))||model.nodes.get(model.aliases.get(p.get('event')))||model.parents[0];
  if(selected.parentId)expanded.add(selected.parentId);
}
function initMap(){
  if(!window.L){showMapMessage('地图组件未加载，请刷新。完整行程仍可展开查看。');return;}
  map=L.map('map',{zoomControl:false,scrollWheelZoom:true}).setView([37.81,-122.35],11);
  L.control.zoom({position:'topright'}).addTo(map);L.control.scale({position:'bottomleft',imperial:false}).addTo(map);
  let errors=0;const tiles=L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png',{maxZoom:19,attribution:'&copy; <a href="https://www.openstreetmap.org/copyright" target="_blank" rel="noopener">OpenStreetMap</a>'}).addTo(map);
  tiles.on('tileerror',()=>{if(++errors>=4)showMapMessage('底图暂时无法加载；路线与节点仍可点击，也可打开详情中的导航。');});
  tiles.on('tileload',()=>{errors=0;$('map-message').hidden=true;});
  routeLayer=L.layerGroup().addTo(map);markerLayer=L.layerGroup().addTo(map);
  map.on('zoomend',()=>{if(selected)renderMap();});
}
function showMapMessage(text){$('map-message').textContent=text;$('map-message').hidden=false;}
function fitDay(){if(map)map.fitBounds(L.latLngBounds(day.events.flatMap(e=>[e.from,e.to,e.at,...(e.via||[])]).filter(Boolean).map(point)),{paddingTopLeft:[85,100],paddingBottomRight:[85,mode==='time'?210:130],maxZoom:14,animate:false});}
function expandButton(p,compact=false){return `<button class="expand" data-toggle="${p.id}" aria-expanded="${expanded.has(p.id)}" aria-label="${expanded.has(p.id)?'收起':'展开'}${escape(p.title)}的${p.kind==='place'?'活动':'交通'}">${expanded.has(p.id)?'−':'+'}${compact?'':`<small>${p.children.length}</small>`}</button>`;}
function renderMap(){
  if(!map)return;routeLayer.clearLayers();markerLayer.clearLayers();
  for(const p of model.parents){
    if(p.kind!=='transfer')continue;
    for(const id of [p.from,p.to]) L.circleMarker(point(id),{radius:3,color:color(p),weight:1,fillOpacity:1}).addTo(routeLayer).bindTooltip(escape(places[id].name));
    const children=expanded.has(p.id)?p.children:[p];
    for(const e of children){
      L.polyline(route(e),{color:color(e),weight:selected.id===e.id?6:3,opacity:.8,dashArray:'6 8'}).addTo(routeLayer).on('click',()=>selectEvent(e.id,false)).bindTooltip(`${escape(time(e))} · ${escape(duration(e))}<br>${escape(e.title)}`,{sticky:true});
    }
  }
  // 像素避让仅移动标签，连线仍指向实际坐标；同址不同停留不会相互覆盖。
  const used=[],positions=new Map();
  const branch=selected.parentId||selected.id;
  const ordered=visible().sort((a,b)=>Number(b.id===branch||b.parentId===branch)-Number(a.id===branch||a.parentId===branch));
  for(const e of ordered){
    const origin=map.latLngToLayerPoint(nodePoint(e));let pos=origin;
    const parentPos=positions.get(e.parentId);
    const childIndex=e.parentId?model.nodes.get(e.parentId).children.findIndex(c=>c.id===e.id):0;
    const base=parentPos?parentPos.add([childIndex%2===0?-70:70,55*(Math.floor(childIndex/2)+1)]):origin;
    for(let ring=0;ring<30;ring++){
      let found=false;
      for(let k=0;k<(ring?8:1);k++){
        const candidate=base.add([Math.cos(k*Math.PI/4)*ring*74,Math.sin(k*Math.PI/4)*ring*57]);
        if(!used.some(q=>Math.abs(q.x-candidate.x)<138&&Math.abs(q.y-candidate.y)<53)){pos=candidate;found=true;break;}
      }
      if(found)break;
    }
    used.push(pos);positions.set(e.id,pos);
    if(parentPos)L.polyline([map.layerPointToLatLng(parentPos),map.layerPointToLatLng(pos)],{color:color(e),weight:2,opacity:.65,interactive:false}).addTo(markerLayer);
    if(pos.distanceTo(origin)>8)L.polyline([map.layerPointToLatLng(origin),map.layerPointToLatLng(pos)],{color:color(e),weight:1,opacity:.6,interactive:false,dashArray:'2 4'}).addTo(markerLayer);
    const parent=e.children;const label=mode==='time'?(e.start||'待定'):(parent?`${e.kind==='place'?'地点':'中转'} ${e.number}`:nodeTypes[e.kind].label);
    const html=`<div class="map-node node-${e.kind} ${selected.id===e.id?'is-selected':''}" style="--node:${color(e)}" data-node="${e.id}"><button class="node-select" data-event="${e.id}" aria-label="${escape(nodeTypes[e.kind].label+'：'+e.title)}" aria-pressed="${selected.id===e.id}"><b>${nodeTypes[e.kind].icon} ${escape(label)}</b><span>${escape(mapTitle(e))}</span></button>${parent?expandButton(e,true):''}</div>`;
    const marker=L.marker(map.layerPointToLatLng(pos),{icon:L.divIcon({className:'hierarchy-pin',html,iconSize:[130,44],iconAnchor:[65,22]}),keyboard:false,zIndexOffset:selected.id===e.id?10000:parent?100:200}).addTo(markerLayer);
    const element=marker.getElement();L.DomEvent.disableClickPropagation(element);L.DomEvent.disableScrollPropagation(element);
    element.querySelector('[data-event]').addEventListener('click',()=>selectEvent(e.id,false));
    element.querySelector('[data-toggle]')?.addEventListener('click',()=>toggleParent(e.id));
    marker.bindTooltip(`${escape(nodeTypes[e.kind].label)} · ${escape(e.title)}<br>${escape(time(e))} · ${escape(duration(e))}`,{direction:'top',offset:[0,-20]});
  }
}
function navigationLink(e){
  if(!e.from)return `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(`${places[e.at].name} ${places[e.at].address||''}`)}`;
  return `https://www.google.com/maps/dir/?api=1&origin=${point(e.from).join(',')}&destination=${point(e.to).join(',')}&travelmode=${e.mode==='walk'?'walking':e.mode==='ride'?'driving':'transit'}`;
}
function renderSelection(){
  const e=selected,p=places[e.at||e.to],parent=model.nodes.get(e.parentId),isPlace=e.kind==='place';
  $('selection').style.setProperty('--node',color(e));
  $('selection').innerHTML=`<span class="type-badge">${nodeTypes[e.kind].icon} ${nodeTypes[e.kind].label} · ${parent?'二级':'一级'}</span><div class="time-label">${escape(time(e))} · ${escape(duration(e))}${e.mode?` · ${modes[e.mode]}`:''}</div><h3>${escape(e.title)}</h3>${e.from?`<div class="transfer-facts"><span>从 <b>${escape(places[e.from].name)}</b></span><span>到 <b>${escape(places[e.to].name)}</b></span><span>出发 ${e.start||'待定'} → 到达 ${e.end||'待定'}</span></div>`:`<div class="place-label">${escape(p.name)}</div>`}${parent?`<button class="parent-link" data-event="${parent.id}">↑ 所属${parent.kind==='place'?'地点':'中转'}：${escape(parent.title)}</button>`:''}${e.children?`<div class="selection-expand">${expandButton(e)}<span>${expanded.has(e.id)?'已展开':'点击 + 展开'} ${e.children.length} 项${isPlace?'活动':'具体交通'}</span></div>${e.kind==='transfer'?'<p class="estimate-note">起止时间为原行程规划窗口，包含已预留的候车与步行；不是已确认的车次时刻。</p>':''}`:''}${e.status?`<span class="tag">${escape(e.status)}</span>`:''}${e.optional?'<span class="tag">可按当天情况省略</span>':''}${e.detail?`<p>${escape(e.detail)}</p>`:''}${p.note?`<p>${escape(p.note)}</p>`:''}${e.cost?`<p><strong>费用：</strong>${escape(e.cost)}</p>`:''}${e.checklist?`<ul>${e.checklist.map(item=>`<li>${escape(item)}</li>`).join('')}</ul>`:''}${p.score&&(isPlace||e.kind==='activity')?`<div class="rating">推荐 ${p.score}/10 · 热度：${escape(p.popularity)}<br>${escape(p.review)}<br><small>行程推荐分；非实时平台评分</small></div>`:''}<div class="links"><a target="_blank" rel="noopener" href="${navigationLink(e)}">${e.from?'打开交通导航 ↗':'在地图中查看 ↗'}</a>${e.alternativePlace?`<a target="_blank" rel="noopener" href="https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(places[e.alternativePlace].address)}">备选餐厅位置 ↗</a>`:''}</div>`;
}
function row(e){return `<div class="node-row node-${e.kind}" style="--node:${color(e)}"><button class="event" data-event="${e.id}" aria-pressed="${selected.id===e.id}"><span class="event-dot">${nodeTypes[e.kind].icon}</span><span class="event-main"><small class="type-label">${nodeTypes[e.kind].label}${e.children?` · ${e.number}`:''}</small><time>${escape(time(e))} · ${escape(duration(e))}</time><span class="event-title">${escape(e.title)}</span>${e.status?`<span class="event-small">${escape(e.status)}</span>`:''}</span></button>${e.children?expandButton(e):''}</div>`;}
function renderEventList(){
  $('list-title').textContent=mode==='time'?'按时间查看层级安排':'今天的地点与中转';$('event-count').textContent=`${model.parents.length} 个一级节点`;
  $('events').innerHTML=model.parents.map(p=>`<section class="node-group">${row(p)}${expanded.has(p.id)?`<div class="node-children" aria-label="${escape(p.title)}的子节点">${p.children.map(row).join('')}</div>`:''}</section>`).join('');
  $('time-rail').hidden=mode!=='time';
  $('time-rail').innerHTML=visible().map(e=>`<div class="rail-node ${e.parentId?'rail-child':''}" style="--node:${color(e)}"><button data-event="${e.id}" aria-pressed="${selected.id===e.id}"><b>${e.start||'待定'} · ${nodeTypes[e.kind].icon}</b><span>${escape(e.title)}</span></button>${e.children?expandButton(e,true):''}</div>`).join('');
}
function refresh(){renderSelection();renderEventList();renderMap();writeHash();const active=$('time-rail').querySelector('[aria-pressed=true]');if(active)$('time-rail').scrollLeft=Math.max(0,active.parentElement.offsetLeft-$('time-rail').offsetLeft-$('time-rail').clientWidth/2+active.parentElement.clientWidth/2);}
function focusNode(e){if(!map)return;if(e.from)map.fitBounds(L.latLngBounds(route(e)),{paddingTopLeft:[90,95],paddingBottomRight:[90,mode==='time'?210:130],maxZoom:15,animate:false});else {const center=expanded.has(e.id)?map.unproject(map.project(point(e.at),16).add([0,map.getSize().y/2-110]),16):point(e.at);map.setView(center,16,{animate:false});}}
function selectEvent(id,focus=true){const e=model.nodes.get(id);if(!e)return;selected=e;if(e.parentId)expanded.add(e.parentId);refresh();if(focus)focusNode(e.parentId?model.nodes.get(e.parentId):e);}
function toggleParent(id){const p=model.nodes.get(id);if(!p?.children)return;if(expanded.has(id)){expanded.delete(id);if(selected.parentId===id)selected=p;}else{expanded.add(id);selected=p;}refresh();if(expanded.has(id))focusNode(p);}
function renderDay(){
  $('days').innerHTML=days.map(d=>`<button data-day="${d.id}" ${d.id===day.id?'aria-current="date"':''}><strong>${d.label}</strong><small>${d.weekday}</small></button>`).join('');
  $('day-kicker').textContent=`DAY ${days.indexOf(day)+1} / ${day.weekday} · 当地时间`;$('day-title').textContent=day.title;$('day-subtitle').textContent=day.subtitle;
  const total=sum(day.budget);$('budget').innerHTML=total===null?'<strong>待核算</strong><span>交通与住宿确定后补全 ↗</span>':`<strong>$${total}</strong><span>今日预算 ↗</span><em>${total>100?`超目标 $${total-100}`:'目标 $100 以内'}</em>`;
  $('day-notes').innerHTML=day.notes.map(n=>`<li>${escape(n)}</li>`).join('');
  document.querySelectorAll('[data-mode]').forEach(b=>b.setAttribute('aria-pressed',b.dataset.mode===mode));refresh();fitDay();
}
function openDialog(title,html){$('dialog-title').textContent=title;$('guide-content').innerHTML=html;$('guide').showModal();}
function budgetTable(){
 const labels={food:'餐饮',transport:'交通',tickets:'景点门票',groceries:'采购（仅购买日计入）'};
 if(!day.budget)return '<p>这天的交通、住宿与用餐尚未确定，不能用 $0 表示预算。</p>';
 return `<table><thead><tr><th>类别</th><th>预计美元</th></tr></thead><tbody>${Object.entries(day.budget).map(([key,value])=>`<tr><td>${labels[key]}</td><td>$${value}</td></tr>`).join('')}<tr><th>合计</th><th>$${sum(day.budget)}</th></tr></tbody></table><p>不含酒店与机票。餐厅金额为含税费的估算范围，交通与门票需以下单金额为准。采购的午餐在食用当天不重复计费。</p>`;
}
$('budget').addEventListener('click',()=>openDialog(`${day.label} · 预算明细`,budgetTable()));
$('guide-open').addEventListener('click',()=>openDialog('预约与出行准备',`
  <p>${escape(trip.disclaimer)}</p><h3>提前做的事</h3>${trip.reservations.map(r=>`<div class="guide-item"><small>${escape(r.when)}</small><b>${escape(r.title)}</b><p>${escape(r.detail)}</p>${r.url?`<a href="${r.url}" target="_blank" rel="noopener">打开官方渠道 ↗</a>`:''}</div>`).join('')}
  <h3>各日预算</h3><table><thead><tr><th>日期</th><th>预计美元</th></tr></thead><tbody>${days.map(d=>`<tr><td>${d.label} · ${escape(d.title)}</td><td>${d.budget?'$'+sum(d.budget):'待核算'}</td></tr>`).join('')}</tbody></table><p>已有预算六天合计 $${days.reduce((n,d)=>n+(sum(d.budget)||0),0)}，另留 $50–70 机动。7–9 日未计入，不能当成全程总价。</p>
  <h3>备选与舍弃</h3>${trip.alternatives.map(a=>`<p><b>${escape(a.name)}${a.score?` · 推荐 ${a.score}/10`:''}</b><br>${escape(a.reason)}</p>`).join('')}
  <h3>评分说明</h3><p>${escape(trip.ratingsNote)}</p>
  <h3>核查来源</h3><p>营业、票价、班次可能变化，请在预约和出发前查看；链接不表示已订票。</p><ul>${trip.sources.map(([name,url])=>`<li><a href="${url}" target="_blank" rel="noopener">${escape(name)} ↗</a></li>`).join('')}</ul><p>数据更新：${trip.updated} · 时间：${trip.timezone}</p>`));
$('guide-close').addEventListener('click',()=>$('guide').close());
$('guide').addEventListener('click',e=>{if(e.target===$('guide')){const r=$('guide').getBoundingClientRect();if(e.clientX<r.left||e.clientX>r.right||e.clientY<r.top||e.clientY>r.bottom)$('guide').close();}});
$('fit').addEventListener('click',fitDay);
$('days').addEventListener('click',e=>{const b=e.target.closest('[data-day]');if(!b)return;day=days.find(d=>d.id===b.dataset.day);model=buildHierarchy(day,places);expanded.clear();selected=model.parents[0];renderDay();$('schedule').scrollTop=0;});
document.querySelectorAll('[data-mode]').forEach(b=>b.addEventListener('click',()=>{mode=b.dataset.mode;renderDay();}));
for(const id of ['events','time-rail','selection'])$(id).addEventListener('click',e=>{const toggle=e.target.closest('[data-toggle]');if(toggle){toggleParent(toggle.dataset.toggle);return;}const b=e.target.closest('[data-event]');if(b)selectEvent(b.dataset.event);});
window.addEventListener('hashchange',()=>{readHash();renderDay();});
readHash();initMap();renderDay();if(selected.parentId)focusNode(model.nodes.get(selected.parentId));
