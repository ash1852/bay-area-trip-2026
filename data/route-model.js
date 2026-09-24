// 地图只展示物理地点；一次到访由现场事项及离开此处的交通组成。
export const minute=value=>value==null?null:value.split(':').reduce((h,m)=>Number(h)*60+Number(m));
const clock=n=>`${String(Math.floor(n/60)).padStart(2,'0')}:${String(n%60).padStart(2,'0')}`;
export function duration(e){return e.start&&e.end?`${minute(e.end)-minute(e.start)} 分钟`:'时长待确认';}
export function travelLegs(e){
 if(e.legs)return e.legs.map((leg,i)=>({...e,...leg,id:`${e.id}-leg-${i}`,sourceId:e.id,via:undefined}));
 const ids=[e.from,...(e.via||[]),e.to];
 if(ids.length===2)return [{...e,sourceId:e.id}];
 let cursor=minute(e.start);
 return ids.slice(1).map((to,i)=>{
  const length=e.legMinutes?.[i],known=cursor!==null&&Number.isFinite(length);
  const start=known?clock(cursor):(i===0?e.start:null),end=known?clock(cursor+length):(i===ids.length-2?e.end:null);
  if(known)cursor+=length;
  return {...e,id:`${e.id}-leg-${i}`,sourceId:e.id,from:ids[i],to,via:undefined,mode:e.legModes?.[i]||e.mode,start,end,estimated:known,title:e.legModes?.[i]==='train'?'BART · 乘车与候车':e.legModes?.[i]==='walk'?'步行至下一站':e.title,cost:i===0?e.cost:null,detail:[e.detail,`整段预留 ${e.start||'待定'}–${e.end||'待定'}；分段时间${known?'为规划估算，非已确认班次':'待核实'}。`].filter(Boolean).join(' ')};
 });
}
export function buildRoute(day,places){
 const visits=[],aliases=new Map();
 let current;
 function arrive(at,time,id){
  if(current?.at===at)return current;
  current={id:`${id}@${at}`,at,arrival:time,activities:[],outgoing:null};visits.push(current);return current;
 }
 for(const e of day.events){
  if(!e.from){const v=arrive(e.at,e.start,e.id);v.activities.push(e);aliases.set(e.id,v.id);continue;}
  const legs=travelLegs(e);
  for(const leg of legs){
   const v=arrive(leg.from,leg.start,leg.id);v.outgoing=leg;
   if(!aliases.has(e.id))aliases.set(e.id,v.id);
   arrive(leg.to,leg.end,`${leg.id}-arrival`);
  }
 }
 const points=new Map();
 visits.forEach((v,i)=>{
  v.number=i+1;v.start=v.activities[0]?.start||v.outgoing?.start||v.arrival;
  v.end=v.outgoing?.start||v.activities.at(-1)?.end||v.arrival;
  v.kind=places[v.at].role==='transfer'||!v.activities.length?'transfer':'visit';
  if(!points.has(v.at))points.set(v.at,{id:v.at,visits:[],kind:'transfer'});
  const p=points.get(v.at);p.visits.push(v);if(v.kind==='visit')p.kind='visit';
 });
 // 兼容旧活动链接以及此前的一级节点链接。
 for(const [id,visit] of [...aliases]){aliases.set(`${id}-place`,visit);aliases.set(`${id}-transfer`,visit);}
 return {visits,points,aliases,byId:new Map(visits.map(v=>[v.id,v]))};
}
