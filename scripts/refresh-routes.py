"""Refresh only walk / taxi road geometry. Cached paths are reused unless --force.
Uses the FOSSGIS public OSRM service at <= 1 request/sec, no browser-time API.
Transit paths are reviewed separately; this never substitutes car routing for transit.
"""
import json, subprocess, pathlib, time, urllib.request, sys
ROOT=pathlib.Path(__file__).resolve().parents[1]
TARGET=ROOT/'data/route-paths.js'
prefix='export const routePaths = '
data=json.loads(TARGET.read_text().split(prefix,1)[1].strip().removesuffix(';')) if TARGET.exists() else {}
source="import {days,places} from './data/itinerary.js';import {buildRoute} from './data/route-model.js';console.log(JSON.stringify({places,legs:days.flatMap(d=>buildRoute(d,places).visits.flatMap(v=>v.outgoing?[v.outgoing]:[]))}));"
trip=json.loads(subprocess.check_output(['node','--input-type=module','-e',source],cwd=ROOT))
places=trip['places']; seen=set();failed=[]
# Indoor areas have no reliable routable entrance network; keep their honest schematic.
indoor={('deyoung','deyoungtower'),('deyoungtower','tea'),('tea','teahouse'),('teahouse','tea'),('ferry','gotts')}
for e in trip['legs']:
 key=f"{e['mode']}:{e['from']}:{e['to']}"
 if key in seen or e['mode'] not in ['walk','ride'] or (e['from'],e['to']) in indoor:continue
 seen.add(key)
 endpoints=[[places[p]['lat'],places[p]['lng']] for p in [e['from'],e['to']]]
 if '--force' not in sys.argv and data.get(key,{}).get('endpoints')==endpoints:continue
 profile='foot' if e['mode']=='walk' else 'car'
 coords=';'.join(f'{p[1]},{p[0]}' for p in endpoints)
 url=f'https://routing.openstreetmap.de/routed-{profile}/route/v1/driving/{coords}?overview=full&geometries=geojson'
 try:
  req=urllib.request.Request(url,headers={'User-Agent':'bay-area-trip-2026/1.0 (public itinerary route maintenance)','Referer':'https://ash1852.github.io/bay-area-trip-2026/'})
  result=json.load(urllib.request.urlopen(req,timeout=45));r=result['routes'][0]
  if max(w['distance'] for w in result['waypoints'])>120:raise ValueError('endpoint snapped too far from location')
  points=[[round(y,6),round(x,6)] for x,y in r['geometry']['coordinates']]
  data[key]={'endpoints':endpoints,'points':points,'kind':'road','label':'沿步道 / 街道' if profile=='foot' else '沿道路 · 驾车参考','note':'依据 OpenStreetMap 路网计算；起终点至道路的短连接为近似，开放情况以现场为准。','source':'https://routing.openstreetmap.de/about.html','updated':'2026-09-25','meters':round(r['distance'])}
  TARGET.write_text('// Cached route geometry; regenerate walk/taxi paths with scripts/refresh-routes.py.\n'+prefix+'{\n'+',\n'.join(json.dumps(k)+':'+json.dumps(v,ensure_ascii=False,separators=(',',':')) for k,v in sorted(data.items()))+'\n}'+';\n')
  print(key,len(points),round(r['distance']),flush=True)
 except Exception as ex:failed.append(key);print('UNAVAILABLE',key,str(ex),flush=True)
 time.sleep(1.1)
print('Unavailable routes:',failed)
