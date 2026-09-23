import { days, places, trip } from './data/itinerary.js';

const $ = id => document.getElementById(id);
const escape = value => String(value ?? '').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const colors = {walk:'#20786e',transit:'#556bc0',train:'#556bc0',ferry:'#b66f32',shuttle:'#b66f32',ride:'#9d577d',flight:'#9d577d'};
const modes = {walk:'步行',transit:'公共交通',train:'火车',ferry:'轮渡',shuttle:'接驳车',ride:'打车',flight:'飞机'};
let day = days[0], mode = 'route', selected, map, routeLayer, markerLayer;
const markers = new Map(), lines = new Map();
const time = event => event.start ? `${event.start}–${event.end}` : '时间待确认';
const point = id => [places[id].lat, places[id].lng];
const location = event => event.at || event.to;
const sum = budget => budget ? Object.values(budget).reduce((a,b)=>a+b,0) : null;
function placeOrder(){
  const ids=[...new Set(day.events.flatMap(e=>e.from?[e.from,e.to]:[e.at]))];
  return new Map(ids.map((id,index)=>[id,index+1]));
}

function writeHash(){
  const params = new URLSearchParams({day:day.id,mode,event:selected.id});
  history.replaceState(null,'',`#${params}`);
}
function readHash(){
  const params = new URLSearchParams(locationHash());
  day = days.find(d=>d.id===params.get('day')) || days[0];
  mode = params.get('mode')==='time' ? 'time' : 'route';
  selected = day.events.find(e=>e.id===params.get('event')) || day.events[0];
}
function locationHash(){ return window.location.hash.slice(1); }

function initMap(){
  if(!window.L){ showMapMessage('地图组件未加载，请刷新页面。下方完整行程仍可查看。'); return; }
  map = L.map('map',{zoomControl:false,scrollWheelZoom:true}).setView([37.81,-122.35],11);
  L.control.zoom({position:'topright'}).addTo(map);
  L.control.scale({position:'bottomleft',imperial:false}).addTo(map);
  let errors = 0;
  const tiles = L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png',{
    maxZoom:19,attribution:'&copy; <a href="https://www.openstreetmap.org/copyright" target="_blank" rel="noopener">OpenStreetMap</a>'
  }).addTo(map);
  tiles.on('tileerror',()=>{if(++errors>=4) showMapMessage('底图暂时无法加载，路线与节点仍可点击；可使用详情中的导航链接。');});
  tiles.on('tileload',()=>{errors=0;$('map-message').hidden=true;});
  routeLayer=L.layerGroup().addTo(map);markerLayer=L.layerGroup().addTo(map);
  map.on('zoomend',()=>{if(selected)renderMap();});
}
function showMapMessage(text){ $('map-message').textContent=text;$('map-message').hidden=false; }

function allPoints(){ return day.events.flatMap(e=>[e.from,e.to,e.at,...(e.via||[])]).filter(Boolean).map(point); }
function fitDay(){
  if(!map)return;
  const points=allPoints();
  if(points.length)map.fitBounds(L.latLngBounds(points),{paddingTopLeft:[55,85],paddingBottomRight:[55,mode==='time'?180:85],maxZoom:14,animate:false});
}
function renderMap(){
  if(!map)return;
  markerLayer.clearLayers();routeLayer.clearLayers();markers.clear();lines.clear();
  let previousPlace;
  const groups=new Map();
  const addPlace=(id,event)=>{if(!groups.has(id))groups.set(id,[]);if(!groups.get(id).includes(event))groups.get(id).push(event);};
  day.events.forEach(event=>{
    const start=event.from||event.at;
    if(previousPlace && start!==previousPlace){
      L.polyline([point(previousPlace),point(start)],{color:colors.walk,weight:2,opacity:.45,dashArray:'3 8'}).addTo(routeLayer);
    }
    if(event.from){
      const coords=[event.from,...(event.via||[]),event.to].map(point);
      const line=L.polyline(coords,{color:colors[event.mode],weight:4,opacity:.7,dashArray:'7 8'}).addTo(routeLayer);
      line.on('click',()=>selectEvent(event.id,true));
      line.bindTooltip(`${escape(time(event))} · ${escape(modes[event.mode])}<br>${escape(event.title)}<br>路线示意 · 点击查看`,{sticky:true});
      lines.set(event.id,line);addPlace(event.from,event);addPlace(event.to,event);
      previousPlace=event.to;
    }else{addPlace(event.at,event);previousPlace=event.at;}
  });
  let ordinal=0;
  groups.forEach((events,id)=>{
    ordinal++;
    const active=events.includes(selected);
    const relevant=events.find(e=>e.at===id || e.from===id)||events[0];
    const selectedTime=selected.to===id?selected.end:selected.start;
    const fullTime=mode==='time'&&(active||map.getZoom()>=15);
    const label=fullTime?(active?selectedTime:relevant.start)||'待定':String(ordinal);
    const html=`<button type="button" class="pin-button ${fullTime?'time-pin':''} ${active?'active':''}" aria-label="${escape(places[id].name)}，${events.length} 项安排">${escape(label)}${events.length>1?`<small>${events.length}</small>`:''}</button>`;
    const marker=L.marker(point(id),{icon:L.divIcon({className:'pin',html,iconSize:[fullTime?62:34,34],iconAnchor:[fullTime?31:17,17]}),keyboard:false,zIndexOffset:active?10000:0,riseOnHover:true}).addTo(markerLayer);
    marker.bindTooltip(`${escape(relevant.start||'时间待定')} · ${escape(places[id].name)}`,{direction:'top',offset:[0,-15]});
    marker.on('click',()=>{
      if(events.length===1){selectEvent(events[0].id,false);return;}
      const content=document.createElement('div');
      content.innerHTML=`<b>${escape(places[id].name)}</b><div class="popup-events">${events.map(e=>`<button data-event="${escape(e.id)}">${escape(time(e))}<br>${escape(e.title)}</button>`).join('')}</div>`;
      content.querySelectorAll('button').forEach(button=>button.addEventListener('click',()=>{selectEvent(button.dataset.event,false);map.closePopup();}));
      marker.bindPopup(content).openPopup();
    });
    markers.set(id,marker);
  });
  highlightRoute();
}
function highlightRoute(){
  lines.forEach((line,id)=>line.setStyle({weight:id===selected.id?7:4,opacity:id===selected.id?1:.65}));
  lines.get(selected.id)?.bringToFront();
}
function navigationLink(event){
  if(!event.from)return `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(`${places[event.at].name} ${places[event.at].address||''}`)}`;
  const travelmode=event.mode==='walk'?'walking':event.mode==='ride'?'driving':'transit';
  return `https://www.google.com/maps/dir/?api=1&origin=${point(event.from).join(',')}&destination=${point(event.to).join(',')}&travelmode=${travelmode}`;
}
function renderSelection(){
  const e=selected,p=places[location(e)];
  const extraPlace=e.alternativePlace?places[e.alternativePlace]:null;
  $('selection').innerHTML=`<div class="time-label">${escape(time(e))}${e.mode?` · ${escape(modes[e.mode])}`:''}</div><h3>${escape(e.title)}</h3><div class="place-label">${escape(e.from?`${places[e.from].name} → ${p.name}`:p.name)}</div>${e.status?`<span class="tag">${escape(e.status)}</span>`:''}${e.optional?'<span class="tag">可按当天情况省略</span>':''}${e.detail?`<p>${escape(e.detail)}</p>`:''}${p.note?`<p>${escape(p.note)}</p>`:''}${e.cost?`<p><strong>费用：</strong>${escape(e.cost)}</p>`:''}${e.checklist?`<ul>${e.checklist.map(item=>`<li>${escape(item)}</li>`).join('')}</ul>`:''}${p.score?`<div class="rating">推荐 ${p.score}/10 · 热度：${escape(p.popularity)}<br>${escape(p.review)}<br><small>行程推荐分；非实时平台评分</small></div>`:''}<div class="links"><a target="_blank" rel="noopener" href="${navigationLink(e)}">${e.from?'打开交通导航 ↗':'在地图中查看 ↗'}</a>${extraPlace?`<a target="_blank" rel="noopener" href="https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(extraPlace.address)}">备选餐厅位置 ↗</a>`:''}</div>`;
}
function selectEvent(id,focus=true){
  const event=day.events.find(e=>e.id===id);if(!event)return;
  selected=event;renderSelection();renderMap();renderEventList();writeHash();
  const active=$('time-rail').querySelector('[aria-pressed=true]');
  if(active){$('time-rail').scrollLeft=Math.max(0,active.offsetLeft-$('time-rail').offsetLeft-$('time-rail').clientWidth/2+active.clientWidth/2);}
  if(map&&focus){
    if(event.from)map.fitBounds(L.latLngBounds([point(event.from),...(event.via||[]).map(point),point(event.to)]),{paddingTopLeft:[55,90],paddingBottomRight:[55,mode==='time'?190:85],maxZoom:15,animate:false});
    else map.setView(point(event.at),Math.max(map.getZoom(),16),{animate:false});
  }
}
function renderEventList(){
  const ordinals=placeOrder();
  $('list-title').textContent=mode==='time'?'按时间查看安排':'今天的路线与停留';
  $('event-count').textContent=`${day.events.length} 项安排`;
  $('events').innerHTML=day.events.map(e=>`<button class="event ${e.from?'moving':''}" data-event="${e.id}" aria-pressed="${e.id===selected.id}"><span class="event-dot">${e.from?'↗':ordinals.get(e.at)}</span><span class="event-main"><time>${escape(time(e))}</time><span class="event-title">${escape(e.title)}</span>${e.status?`<span class="event-small">${escape(e.status)}</span>`:''}</span></button>`).join('');
  $('time-rail').hidden=mode!=='time';
  $('time-rail').innerHTML=day.events.map(e=>`<button data-event="${e.id}" aria-pressed="${e.id===selected.id}"><b>${e.start||'待定'}</b><span>${escape(e.title)}</span></button>`).join('');
}
function renderDay(){
  $('days').innerHTML=days.map(d=>`<button data-day="${d.id}" ${d.id===day.id?'aria-current="date"':''}><strong>${d.label}</strong><small>${d.weekday}</small></button>`).join('');
  $('day-kicker').textContent=`DAY ${days.indexOf(day)+1} / ${day.weekday} · 当地时间`;
  $('day-title').textContent=day.title;$('day-subtitle').textContent=day.subtitle;
  const total=sum(day.budget);
  $('budget').innerHTML=total===null?'<strong>待核算</strong><span>交通与住宿确定后补全 ↗</span>':`<strong>$${total}</strong><span>今日预算 ↗</span><em>${total>100?`超目标 $${total-100}`:'目标 $100 以内'}</em>`;
  $('day-notes').innerHTML=day.notes.map(note=>`<li>${escape(note)}</li>`).join('');
  document.querySelectorAll('[data-mode]').forEach(button=>button.setAttribute('aria-pressed',button.dataset.mode===mode));
  renderSelection();renderEventList();renderMap();fitDay();writeHash();
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
$('days').addEventListener('click',e=>{const button=e.target.closest('[data-day]');if(!button)return;day=days.find(d=>d.id===button.dataset.day);selected=day.events[0];renderDay();$('schedule').scrollTop=0;});
document.querySelectorAll('[data-mode]').forEach(button=>button.addEventListener('click',()=>{mode=button.dataset.mode;renderDay();}));
for(const id of ['events','time-rail'])$(id).addEventListener('click',e=>{const button=e.target.closest('[data-event]');if(button)selectEvent(button.dataset.event);});
window.addEventListener('hashchange',()=>{readHash();renderDay();});
readHash();initMap();renderDay();
if(mode==='time')selectEvent(selected.id,true);
