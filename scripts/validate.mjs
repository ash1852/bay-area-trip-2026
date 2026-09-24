import assert from 'node:assert/strict';
import { buildRoute, travelLegs } from '../data/route-model.js';
import { days, places, trip } from '../data/itinerary.js';
const minute = value => {
  assert.match(value,/^(?:[01]\d|2[0-3]):[0-5]\d$/);
  const [h,m]=value.split(':').map(Number);return h*60+m;
};
const seen = new Set();
for(const [id,p] of Object.entries(places)){
  assert.ok(p.name && Number.isFinite(p.lat) && Number.isFinite(p.lng),`地点缺字段：${id}`);
  assert.ok(Math.abs(p.lat)<=90 && Math.abs(p.lng)<=180,`坐标错误：${id}`);
}
for(const day of days){
  assert.match(day.id,/^2026-10-\d\d$/);assert.ok(day.events.length);
  let lastEnd=0;
  for(const e of day.events){
    assert.ok(e.id && !seen.has(e.id),`重复节点：${e.id}`);seen.add(e.id);
    assert.ok(e.title);assert.equal(Boolean(e.at),!e.from,`地点 / 交通字段冲突：${e.id}`);
    for(const id of [e.at,e.from,e.to,e.alternativePlace,...(e.via||[])].filter(Boolean))assert.ok(places[id],`不存在地点：${id}`);
    if(e.from){assert.ok(e.to);assert.ok(['walk','transit','train','ferry','shuttle','ride','flight','cable'].includes(e.mode));}
    assert.equal(e.start===null,e.end===null,`缺失时间一端：${e.id}`);
    if(e.start){const start=minute(e.start),end=minute(e.end);assert.ok(start>=lastEnd,`时间重叠：${e.id}`);assert.ok(end>start,`时间倒置：${e.id}`);lastEnd=end;}
  }
  if(day.budget)for(const value of Object.values(day.budget))assert.ok(Number.isFinite(value)&&value>=0);
}
for(const [,url] of trip.sources)assert.equal(new URL(url).protocol,'https:');
assert.equal(days.length,9);
assert.ok(days.find(d=>d.id==='2026-10-05').events.some(e=>e.start==='19:00'&&e.title==='自由时间'));
assert.ok(days.find(d=>d.id==='2026-10-10').events.some(e=>e.from==='oak'&&e.start==='18:50'));
console.log(`通过：${Object.keys(places).length} 个地点、${days.length} 天、${seen.size} 个节点；时间无重叠，引用与预算有效。`);


// 地点访问模型：不丢事项，移动附着出发地，已估算分段覆盖原窗口。
for(const day of days){
 const m=buildRoute(day,places);
 assert.deepEqual(m.visits.flatMap(v=>v.activities.map(a=>a.id)),day.events.filter(e=>e.at).map(e=>e.id));
 for(const [i,v] of m.visits.entries()){
  assert.ok(m.points.get(v.at).visits.includes(v));
  if(v.outgoing){assert.equal(v.outgoing.from,v.at);assert.equal(v.outgoing.to,m.visits[i+1].at);}
  else assert.equal(i,m.visits.length-1,`中间地点缺少离站交通：${day.id} ${v.at}`);
 }
 for(const e of day.events){
  assert.ok(m.byId.has(m.aliases.get(e.id)));
  if(e.legMinutes){const legs=travelLegs(e);assert.equal(legs[0].start,e.start);assert.equal(legs.at(-1).end,e.end);for(let i=1;i<legs.length;i++)assert.equal(legs[i-1].end,legs[i].start);}
 }
}
const island=buildRoute(days[2],places);
for(const id of ['alcatraz','alcatrazdock','alcatrazyard','alcatraz64'])assert.ok(island.points.has(id));
assert.equal(island.points.get('alcatrazdock').visits.length,3);
assert.ok(island.points.get('bart12').visits.every(v=>v.kind==='transfer'));
assert.equal(buildRoute(days[3],places).points.get('hotel').visits.filter(v=>v.activities.length).length,2);
const bart=island.points.get('bart12').visits[0].outgoing;
assert.equal(bart.mode,'train');assert.equal(bart.start,'09:00');assert.equal(bart.end,'09:35');assert.equal(bart.estimated,true);
console.log('通过：物理地点分点、重复到访、事项完整、离站交通与估算分段。');
