"""Import reviewed geometry only; never import or overwrite itinerary times.
Usage: python scripts/import-transit.py /path/to/downloads
Expected files and origins:
muni.source — https://muni-gtfs.apps.sfmta.com/data/muni_gtfs-current.zip
golden.source — https://realtime.goldengate.org/gtfsstatic/GTFSTransitData.zip
bart-gis.source — https://maps.hayward-ca.gov/arcgis/rest/services/PublicWorks/BicycleNetwork_public/MapServer/1/query?where=1%3D1&outFields=*&outSR=4326&f=geojson
Recheck route choices and dataset validity on future refreshes.
"""
import json,csv,io,zipfile,math,heapq,collections,pathlib,sys,subprocess
ROOT=pathlib.Path(__file__).resolve().parents[1]
INPUT=pathlib.Path(sys.argv[1]) if len(sys.argv)>1 else pathlib.Path('/tmp')
p=json.loads(subprocess.check_output(['node','--input-type=module','-e',"import {places} from './data/itinerary.js';console.log(JSON.stringify(places));"],cwd=ROOT));result={}
def coord(x):return [p[x]['lat'],p[x]['lng']]
def dist(a,b):return math.hypot((a[0]-b[0])*111320,(a[1]-b[1])*87900)
def add(mode,a,b,points,label,note,source):
 result[f'{mode}:{a}:{b}']={'endpoints':[coord(a),coord(b)],'points':[[round(x,6),round(y,6)] for x,y in points],'kind':'transit','label':label,'note':note,'source':source,'updated':'2026-09-25'}
# GIS polylines -> graph; join only geometry endpoints within 25 m.
f=json.load(open(INPUT/'bart-gis.source'))['features'];g=collections.defaultdict(dict);ends=[]
for feature in f:
 geom=feature['geometry'];lines=geom['coordinates'] if geom['type']=='MultiLineString' else [geom['coordinates']]
 for line in lines:
  line=[(round(y,6),round(x,6)) for x,y in line];ends.extend([line[0],line[-1]])
  for a,b in zip(line,line[1:]):g[a][b]=g[b][a]=dist(a,b)
for a in ends:
 for b in ends:
  if a!=b and dist(a,b)<25:g[a][b]=g[b][a]=dist(a,b)
def path(a,b):
 start=min(g,key=lambda x:dist(x,coord(a)));end=min(g,key=lambda x:dist(x,coord(b)))
 q=[(0,start)];best={start:0};prev={}
 while q:
  d,u=heapq.heappop(q)
  if u==end:break
  if d>best[u]:continue
  for v,w in g[u].items():
   nd=d+w
   if nd<best.get(v,float('inf')):best[v]=nd;prev[v]=u;heapq.heappush(q,(nd,v))
 out=[end]
 while out[-1]!=start:out.append(prev[out[-1]])
 return out[::-1]
for a,b in [('bart12','embarcadero'),('embarcadero','bart12'),('bart12','powell'),('powell','bart12'),('missionbart','bart12'),('bart12','coliseum')]:
 pts=path(a,b);print('BART',a,b,len(pts),round(sum(dist(a,b)for a,b in zip(pts,pts[1:]))));add('train',a,b,pts,'BART · 沿轨道','Caltrans 轨道 GIS（Hayward 市发布）；跨湾段沿海底隧道。历史底图仅用于线路走向，不确认班次或实时运营。','https://maps.hayward-ca.gov/arcgis/rest/services/PublicWorks/BicycleNetwork_public/MapServer/1')

def gtfs(name):
 z=zipfile.ZipFile(INPUT/(name+'.source'));read=lambda f:list(csv.DictReader(io.TextIOWrapper(z.open(f),encoding='utf-8-sig')))
 routes=collections.defaultdict(set)
 for t in read('trips.txt'):routes[t['route_id']].add(t['shape_id'])
 shapes=collections.defaultdict(list)
 for r in read('shapes.txt'):shapes[r['shape_id']].append((int(r['shape_pt_sequence']),[float(r['shape_pt_lat']),float(r['shape_pt_lon'])]))
 return routes,{k:[x[1] for x in sorted(v)]for k,v in shapes.items()},z

def slice_shape(routes,shapes,rid,a,b):
 candidates=[]
 for sid in sorted(routes[rid]):
  line=shapes[sid];i=min(range(len(line)),key=lambda n:dist(line[n],coord(a)));j=min(range(len(line)),key=lambda n:dist(line[n],coord(b)))
  if i>=j:continue
  seg=line[i:j+1];length=sum(dist(x,y)for x,y in zip(seg,seg[1:]));score=dist(coord(a),seg[0])+dist(coord(b),seg[-1])+length*.02
  candidates.append((score,sid,seg))
 _,sid,seg=min(candidates);print(rid,a,b,sid,'access',round(dist(coord(a),seg[0])),round(dist(coord(b),seg[-1])));return seg
routes,shapes,z=gtfs('muni')
license=z.read('SFMTA_Transit_Data_License_Agreement.txt').decode();(ROOT/'vendor/SFMTA-LICENSE.txt').write_text(license)
for rid,a,b,mode in [('CA','californiaPowell','cable','cable'),('49','cable','lombard','transit'),('30','inout','palace','transit'),('28','palace','bridge','transit'),('5','powell','painted','transit'),('N','powell','deyoung','transit'),('N','tea','powell','transit')]:
 pts=slice_shape(routes,shapes,rid,a,b);add(mode,a,b,pts,f'Muni {rid} · 官方线路参考','SFMTA GTFS 2026/7–8 线路形状，仅用于走向；10 月运行需复核。两端虚线为步行接入示意，不代表实际站台入口。','https://www.sfmta.com/reports/gtfs-transit-data')
routes,shapes,z=gtfs('golden')
for a,b in [('ferry','larkspur'),('larkspur','ferry')]:
 pts=slice_shape(routes,shapes,'LSSF-271',a,b);add('ferry',a,b,pts,'Larkspur 渡轮 · 官方航线参考','Golden Gate Transit/Ferry GTFS（2026/9–12）；航线形状并非船只实时航迹，停靠口以现场为准。','https://realtime.goldengate.org/gtfsstatic/GTFSTransitData.zip')
target=ROOT/'data/route-paths.js';prefix='export const routePaths = '
current=json.loads(target.read_text().split(prefix,1)[1].strip().removesuffix(';')) if target.exists() else {}
current.update(result)
target.write_text('// Cached route geometry; see scripts/refresh-routes.py and scripts/import-transit.py.\n'+prefix+'{\n'+',\n'.join(json.dumps(k)+':'+json.dumps(v,ensure_ascii=False,separators=(',',':')) for k,v in sorted(current.items()))+'\n}'+';\n')
