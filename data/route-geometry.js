// Geometry is separate from itinerary times. Missing or moved endpoints fall back safely.
export function routeGeometry(leg,places,paths){
 const endpoints=[leg.from,leg.to].map(id=>[places[id].lat,places[id].lng]);
 const route=paths[`${leg.mode}:${leg.from}:${leg.to}`];
 const valid=route?.points?.length>=2&&route.endpoints.every((p,i)=>p.every((n,j)=>Math.abs(n-endpoints[i][j])<0.000001));
 if(!valid)return {kind:'schematic',label:'路线示意 · 尚无可靠轨迹',note:leg.mode==='flight'?'仅表示起降机场，不是实际飞行航路。':'此段保留地点连接示意；室内、海上及未确认交通以现场或导航为准。',segments:[{points:endpoints,schematic:true}]};
 const segments=[];
 const gap=(a,b)=>Math.hypot(a[0]-b[0],a[1]-b[1]);
 if(gap(endpoints[0],route.points[0])>0.00003)segments.push({points:[endpoints[0],route.points[0]],schematic:true});
 segments.push({points:route.points,schematic:false});
 if(gap(route.points.at(-1),endpoints[1])>0.00003)segments.push({points:[route.points.at(-1),endpoints[1]],schematic:true});
 return {...route,segments};
}
