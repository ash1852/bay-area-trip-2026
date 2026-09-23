// 纯展示模型：行程仍只在 itinerary.js 维护，不复制时间或费用。
export const nodeTypes = {
  place: {label:'景点 / 地点', icon:'●', color:'#207568'},
  activity: {label:'事物 / 活动', icon:'◆', color:'#a86109'},
  transfer: {label:'中转', icon:'↗', color:'#315eb3'},
  transport: {label:'具体交通', icon:'▰', color:'#8651ad'}
};
export const minutes = value => value == null ? null : value.split(':').reduce((h,m)=>Number(h)*60+Number(m));
export function duration(node){
  if(!node.start || !node.end)return '时长待确认';
  const n=minutes(node.end)-minutes(node.start);
  return `${n>=60?`${Math.floor(n/60)} 小时 `:''}${n%60 || n<60?`${n%60} 分钟`:''}`.trim();
}
export function buildHierarchy(day,places){
  const area=id=>places[id].parentPlace || id;
  const parents=[];
  for(const event of day.events){
    const internal=event.from && area(event.from)===area(event.to);
    const kind=event.from&&!internal?'transfer':'place';
    const at=area(event.at||event.from);
    let parent=parents.at(-1);
    const continues=parent && parent.kind===kind && (kind==='transfer'?parent.to===event.from:parent.at===at);
    if(!continues){
      parent={id:`${event.id}-${kind}`,kind,start:event.start,end:event.end,children:[],sourceIds:[],...(kind==='place'?{at,title:places[at].name}:{from:event.from,to:event.to,title:''})};
      parents.push(parent);
    }
    parent.end=event.end;parent.sourceIds.push(event.id);
    if(kind==='place'){
      parent.children.push({...event,id:event.id,kind:'activity',parentId:parent.id});
    }else{
      parent.to=event.to;
      const route=[event.from,...(event.via||[]),event.to];
      const legs=event.legs || (event.via?.length===2 && event.mode==='transit' ? route.slice(1).map((to,i)=>({from:route[i],to,mode:i===1?'train':((i===0&&event.from==='bridge')||(i===2&&event.to==='painted')?'transit':'walk'),title:i===1?'BART · 跨湾乘车（含候车）':i===0?'前往车站':event.to==='painted'?'Muni / 步行到目的地':'出站后步行'})) : [event]);
      legs.forEach((leg,i)=>parent.children.push({...event,...leg,id:legs.length===1?event.id:`${event.id}-leg-${i+1}`,sourceId:event.id,kind:'transport',parentId:parent.id,start:legs.length===1?event.start:leg.start??null,end:legs.length===1?event.end:leg.end??null,via:legs.length===1?event.via:leg.via,cost:legs.length===1?event.cost:leg.cost,status:legs.length===1?event.status:'分段时间待细化',detail:legs.length===1?event.detail:[event.detail,'属于同一中转预留窗口，分段时间待细化；以当天导航为准。'].filter(Boolean).join(' ')}));
      parent.title=`${places[parent.from].name} → ${places[parent.to].name}`;
    }
  }
  for(const p of parents.filter(p=>p.kind==='transfer')){
    const sources=day.events.filter(e=>p.sourceIds.includes(e.id));
    p.detail=sources.map(e=>`${e.title}${e.detail?'：'+e.detail:''}`).join('；');
    p.status=[...new Set(sources.map(e=>e.status).filter(Boolean))].join(' / ');
    p.cost=[...new Set(sources.map(e=>e.cost).filter(Boolean))].join('；');
  }
  const nodes=new Map();
  const aliases=new Map();
  parents.forEach((p,i)=>{p.number=i+1;nodes.set(p.id,p);p.children.forEach(c=>nodes.set(c.id,c));p.sourceIds.forEach(id=>aliases.set(id,nodes.has(id)?id:p.id));});
  return {parents,nodes,aliases};
}
