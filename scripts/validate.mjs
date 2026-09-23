import assert from 'node:assert/strict';
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
    if(e.from){assert.ok(e.to);assert.ok(['walk','transit','train','ferry','shuttle','ride','flight'].includes(e.mode));}
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
