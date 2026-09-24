import { days, places, trip } from './data/itinerary.js';
import { buildRoute, duration } from './data/route-model.js';
const $=id=>document.getElementById(id);
const escape=value=>String(value??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const modes={walk:'步行',transit:'公交 / 换乘',train:'轨道交通',ferry:'轮渡',shuttle:'接驳车',ride:'打车',flight:'飞机',cable:'缆车'};
const colors={visit:'#237b65',transfer:'#406cc3'};
const transportName=e=>e.mode==='train'?(e.title.includes('BART')?'BART':'Amtrak 火车'):modes[e.mode];
const point=id=>[places[id].lat,places[id].lng];
const time=e=>`${e.start||'待确认'}–${e.end||'待确认'}`;
const sum=budget=>budget?Object.values(budget).reduce((a,b)=>a+b,0):null;
let day=days[0],mode='route',selected,model,map,routeLayer,markerLayer,panel='overview';
const mobile=()=>matchMedia('(max-width:760px)').matches;
function writeHash(){history.replaceState(null,'',`#${new URLSearchParams({day:day.id,mode,event:selected.id})}`);}
function readHash(){const p=new URLSearchParams(location.hash.slice(1));day=days.find(d=>d.id===p.get('day'))||days[0];mode=p.get('mode')==='time'?'time':'route';model=buildRoute(day,places);selected=model.byId.get(p.get('event'))||model.byId.get(model.aliases.get(p.get('event')))||model.visits[0];}
function initMap(){
 if(!window.L){$('map-message').hidden=false;$('map-message').textContent='地图未加载，可点“今日计划”查看行程。';return;}
 map=L.map('map',{zoomControl:false}).setView([37.81,-122.35],11);L.control.zoom({position:'topright'}).addTo(map);L.control.scale({position:'bottomleft',imperial:false}).addTo(map);
 let errors=0;const tiles=L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png',{maxZoom:19,attribution:'&copy; <a href="https://www.openstreetmap.org/copyright" target="_blank" rel="noopener">OpenStreetMap</a>'}).addTo(map);
 tiles.on('tileerror',()=>{if(++errors>=4){$('map-message').hidden=false;$('map-message').textContent='底图暂时未加载，地点和事项仍可查看。';}});tiles.on('tileload',()=>{$('map-message').hidden=true;errors=0;});
 routeLayer=L.layerGroup().addTo(map);markerLayer=L.layerGroup().addTo(map);
}
function fitDay(){if(map)map.fitBounds([...model.points.keys()].map(point),{paddingTopLeft:[32,80],paddingBottomRight:[32,90],maxZoom:15,animate:false});}
function focusVisit(v){
 if(!map)return;const zoom=Math.max(map.getZoom(),['alcatraz','alcatrazdock','alcatrazyard','alcatraz64'].includes(v.at)?17:15);
 const shift=mobile()?map.getSize().y*.25:0;map.setView(map.unproject(map.project(point(v.at),zoom).add([0,shift]),zoom),zoom,{animate:false});
}
function renderMap(){
 if(!map)return;routeLayer.clearLayers();markerLayer.clearLayers();
 for(const v of model.visits){if(!v.outgoing)continue;const leg=v.outgoing;
  const line=L.polyline([point(leg.from),point(leg.to)],{color:v.id===selected.id?'#174f90':'#708d92',weight:v.id===selected.id?4:2,opacity:v.id===selected.id?.95:.55,dashArray:'5 7'}).addTo(routeLayer);
  line.on('click',()=>selectVisit(v.id,false));line.bindTooltip(`${escape(transportName(leg))} · ${escape(time(leg))}`,{sticky:true});
 }
 for(const p of model.points.values()){
  const active=p.id===selected.at;const n=p.visits[0].number;
  const html=`<button class="map-dot ${active?'active':''}" style="--point:${colors[p.kind]}" data-place="${p.id}" aria-label="${escape(places[p.id].name)}，${p.kind==='visit'?'游览地点':'中转地点'}，${p.visits.length} 次到访" aria-pressed="${active}"><span>${n}</span></button>`;
  const marker=L.marker(point(p.id),{icon:L.divIcon({className:'dot-hit',html,iconSize:[40,40],iconAnchor:[20,20]}),keyboard:false,zIndexOffset:active?1000:0}).addTo(markerLayer);
  marker.bindTooltip(escape(places[p.id].name),{direction:'top',offset:[0,-10]});
  const element=marker.getElement();L.DomEvent.disableClickPropagation(element);element.querySelector('button').addEventListener('click',()=>selectVisit(p.visits.some(v=>v.id===selected.id)?selected.id:p.visits[0].id));
 }
}
function navigationLink(e){return e.from?`https://www.google.com/maps/dir/?api=1&origin=${point(e.from).join(',')}&destination=${point(e.to).join(',')}&travelmode=${e.mode==='walk'?'walking':e.mode==='ride'?'driving':'transit'}`:`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(places[e.at].name+' '+(places[e.at].address||''))}`;}
function activityHTML(e){return `<li class="activity-item"><time>${escape(time(e))}</time><h4>${escape(e.title)}</h4>${e.status?`<span class="tag">${escape(e.status)}</span>`:''}${e.detail?`<p>${escape(e.detail)}</p>`:''}${e.cost?`<p>费用：${escape(e.cost)}</p>`:''}${e.checklist?`<ul>${e.checklist.map(x=>`<li>${escape(x)}</li>`).join('')}</ul>`:''}${e.alternativePlace?`<a href="${navigationLink({at:e.alternativePlace})}" target="_blank" rel="noopener">备选用餐地点 ↗</a>`:''}</li>`;}
function travelHTML(v){
 const e=v.outgoing;if(!e)return '<div class="end-note">此处为当天最后一站，无后续交通安排。</div>';
 const next=model.visits[model.visits.indexOf(v)+1];
 return `<section class="departure"><div class="departure-label">前往下一站 · ${escape(transportName(e))}</div><h4>${escape(places[e.to].name)}</h4><div class="travel-times"><span>出发<strong>${e.start||'待确认'}</strong></span><span class="travel-arrow">→<small>${duration(e)}</small></span><span>到达<strong>${e.end||'待确认'}</strong></span></div>${e.estimated?'<span class="tag">分段规划估算 · 非确认班次</span>':''}${e.status?`<span class="tag">${escape(e.status)}</span>`:''}<p>${escape(e.title)}</p>${e.detail?`<p>${escape(e.detail)}</p>`:''}${v.kind==='transfer'&&v.activities.length?`<p>本站候车与准备：${v.activities.map(a=>escape(`${time(a)} ${a.title}${a.detail?'；'+a.detail:''}`)).join('；')}</p>`:''}${e.cost?`<p>费用：${escape(e.cost)}</p>`:''}<div class="links"><a href="${navigationLink(e)}" target="_blank" rel="noopener">打开交通导航 ↗</a>${next?`<button data-visit="${next.id}">查看下一站 →</button>`:''}</div></section>`;
}
function renderSelection(){
 const v=selected,p=places[v.at],same=model.points.get(v.at).visits;
 $('selection').innerHTML=`<div class="place-heading"><span class="type-badge" style="color:${colors[v.kind]}">● ${v.kind==='visit'?'游览 / 停留地点':'中转地点'}</span><h3>${escape(p.name)}</h3>${p.approximate?'<small>位置为区域近似定位，实际入口以现场为准</small>':''}</div>${same.length>1?`<nav class="visit-switch" aria-label="选择本站到访时段">${same.map((x,i)=>`<button data-visit="${x.id}" aria-pressed="${x.id===v.id}">${x.start||'待定'} · 第 ${i+1} 次</button>`).join('')}</nav>`:''}${v.kind==='visit'?`<ol class="activity-list">${v.activities.map(activityHTML).join('')}</ol>`:''}${travelHTML(v)}${p.note?`<p class="place-note">${escape(p.note)}</p>`:''}${p.score&&v.kind==='visit'?`<p class="rating">推荐 ${p.score}/10 · 热度 ${escape(p.popularity)}<br>${escape(p.review)}<br><small>行程推荐分，非实时平台评分</small></p>`:''}${p.source?`<a class="source-link" href="${p.source}" target="_blank" rel="noopener">查看地点官方说明 ↗</a>`:''}`;
 const index=model.visits.indexOf(v);$('visit-position').textContent=`第 ${index+1} / ${model.visits.length} 站`;$('previous').disabled=index===0;$('next').disabled=index===model.visits.length-1;
}
function renderEventList(){
 $('list-title').textContent='按时间走 · 每站的事项与下一程';$('event-count').textContent=`${model.points.size} 个地点`;
 $('events').innerHTML=model.visits.map(v=>`<button class="stop-row" data-visit="${v.id}" aria-pressed="${selected.id===v.id}"><span class="stop-dot" style="background:${colors[v.kind]}">${v.number}</span><span><time>${v.start||'时间待定'}</time><b>${escape(places[v.at].name)}</b><small>${v.outgoing?`${escape(transportName(v.outgoing))} → ${escape(places[v.outgoing.to].name)}`:'当天最后一站'}</small></span><span>›</span></button>`).join('');
}
function setPanel(value,open=true){panel=value;$('schedule').dataset.panel=value;$('schedule').dataset.open=String(open);$('overview').setAttribute('aria-expanded',String(open&&value==='overview'));}
function selectVisit(id,focus=true){const v=model.byId.get(id);if(!v)return;selected=v;renderSelection();renderEventList();renderMap();writeHash();setPanel('detail');$('panel-body').scrollTop=0;if(focus)focusVisit(v);}
function renderDay(){
 $('days').innerHTML=days.map(d=>`<button data-day="${d.id}" ${d.id===day.id?'aria-current="date"':''}><strong>${d.label}</strong><small>${d.weekday}</small></button>`).join('');
 $('day-kicker').textContent=`DAY ${days.indexOf(day)+1} / ${day.weekday} · 当地时间`;$('day-title').textContent=day.title;$('day-subtitle').textContent=day.subtitle;
 const total=sum(day.budget);$('budget').innerHTML=total==null?'预算待核算 ↗':`预算 $${total} ↗${total>100?` · 超目标 $${total-100}`:''}`;
 $('day-notes').innerHTML=day.notes.map(n=>`<li>${escape(n)}</li>`).join('');$('overview').textContent=`今日计划 · ${day.label}`;
 document.querySelectorAll('[data-mode]').forEach(b=>b.setAttribute('aria-pressed',b.dataset.mode===mode));renderSelection();renderEventList();renderMap();fitDay();writeHash();
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
$('fit').addEventListener('click',()=>{if(mobile())setPanel(panel,false);fitDay();});
$('overview').addEventListener('click',()=>{setPanel('overview');$('panel-body').scrollTop=0;});
$('sheet-close').addEventListener('click',()=>setPanel(panel,false));
$('sheet-list').addEventListener('click',()=>setPanel('overview'));
$('days').addEventListener('click',e=>{const b=e.target.closest('[data-day]');if(!b)return;day=days.find(d=>d.id===b.dataset.day);model=buildRoute(day,places);selected=model.visits[0];renderDay();setPanel('overview',!mobile()||mode==='time');});
document.querySelectorAll('[data-mode]').forEach(b=>b.addEventListener('click',()=>{mode=b.dataset.mode;document.querySelectorAll('[data-mode]').forEach(x=>x.setAttribute('aria-pressed',x===b));setPanel('overview',mode==='time'||!mobile());writeHash();}));
for(const id of ['events','selection'])$(id).addEventListener('click',e=>{const b=e.target.closest('[data-visit]');if(b)selectVisit(b.dataset.visit);});
for(const [id,delta] of [['previous',-1],['next',1]])$(id).addEventListener('click',()=>{const v=model.visits[model.visits.indexOf(selected)+delta];if(v)selectVisit(v.id);});
document.addEventListener('keydown',e=>{if(e.key==='Escape'&&!$('guide').open)setPanel(panel,false);});
let touchStart;
$('sheet-head').addEventListener('touchstart',e=>{touchStart=e.touches[0].clientY;},{passive:true});
$('sheet-head').addEventListener('touchend',e=>{if(touchStart!==undefined&&e.changedTouches[0].clientY-touchStart>55)setPanel(panel,false);touchStart=undefined;},{passive:true});
window.addEventListener('hashchange',()=>{readHash();renderDay();selectVisit(selected.id);});
readHash();initMap();renderDay();setPanel('overview',!mobile()||mode==='time');
