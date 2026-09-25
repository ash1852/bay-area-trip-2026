// 行程的唯一数据源。时间均为当地时间；费用为美元预算，不代表已付款。
const place = (name, lat, lng, extra = {}) => ({ name, lat, lng, ...extra });
const sight = (score, popularity, review) => ({ score, popularity, review });
export const places = {
  hotel: place('Ramada · Oakland Downtown',37.8031,-122.2706,{address:'371 13th Street, Oakland',note:'已订酒店。早餐参考 06:30–09:30，入住时向前台确认；10/10 寄存行李也需确认。'}),
  conference: place('Oakland Marriott · 会议会场',37.8014,-122.2736,{address:'1001 Broadway, Oakland'}),
  wholefoods: place('Whole Foods · Oakland',37.8116,-122.2601,{address:'230 Bay Place, Oakland'}),
  bart12: place('12th St / Oakland BART',37.8037,-122.2716),
  powell: place('Powell St BART',37.7844,-122.4078),
  embarcadero: place('Embarcadero BART',37.7929,-122.3969),
  union: place('Union Square · 联合广场',37.7879,-122.4075,sight(6,'高','购物与城市地标集中；停留价值取决于购物兴趣。')),
  cable: place('California / Van Ness · 缆车终点',37.7904,-122.4228,sight(8,'高','有旧金山特色；排队与拥挤会影响体验。')),
  lombard: place('Lombard Street · 九曲花街',37.8021,-122.4187,sight(7.5,'很高','短距离拍照很合适；坡陡，不必久留。')),
  inout: place('In-N-Out · Fisherman’s Wharf',37.8071,-122.4180,{address:'333 Jefferson Street, San Francisco'}),
  palace: place('Palace of Fine Arts · 艺术宫',37.8029,-122.4485,sight(8.5,'高','建筑与水面倒影适合散步拍照；外部游览即可。')),
  bridge: place('Golden Gate Bridge · 南端',37.8077,-122.4750,sight(9.5,'很高','标志性景观；大风、雾天会影响视野。')),
  chipotle: place('Chipotle · Oakland',37.8040,-122.2710,{address:'1302 Broadway, Oakland'}),
  ferry: place('Ferry Building · 轮渡大厦',37.7955,-122.3937,sight(8,'高','海湾、市集和餐饮集中，周末更热闹。')),
  larkspur: place('Larkspur Ferry Terminal',37.9449,-122.5094),
  muir: place('Muir Woods · 游客中心 / 入口',37.8927962,-122.5724843,sight(9,'高','主环线平缓，古老红杉很有沉浸感；接驳需提前预约。')),
  muircafe: place('Muir Woods Trading Co. Café',37.8933703,-122.5728223,{}),
  gotts: place('Gott’s Roadside · Ferry Building',37.7954,-122.3938,{address:'1 Ferry Building #6'}),
  pier33: place('Pier 33 · 恶魔岛登船码头',37.8065,-122.4056),
  alcatraz: place('Alcatraz · 恶魔岛牢房',37.8266591,-122.4230146,sight(9.5,'很高','音频导览与历史体验突出；岛上需要步行上坡。')),
  alcatrazdock: place('Alcatraz · 岛上码头',37.8266612,-122.4208080,{note:'自带食物只在指定码头区域食用。'}),
  pier39: place('Pier 39 · 海狮',37.8087,-122.4098,sight(7.5,'很高','海狮有趣，周边商业化明显，适合短停。')),
  coit: place('Coit Tower · 科伊特塔',37.8024,-122.4058,sight(8,'高','城市全景与壁画；排队、电梯和上坡需要留时间。')),
  northbeach: place('North Beach · 北滩',37.8003,-122.4091,sight(8,'高','街区氛围、咖啡和意大利餐饮是重点。')),
  chinatown: place('Chinatown · 唐人街',37.7941,-122.4078,sight(8,'高','街道与店铺有特色；傍晚部分商店会关门。')),
  biryani: place('Biryani Kabab · Oakland',37.8031,-122.2709,{address:'377 13th Street, Oakland'}),
  cupcake: place('Cupcakin’ · Swan’s Market',37.8010,-122.2742,{address:'907 Washington Street, Oakland'}),
  painted: place('Painted Ladies · 彩绘女士',37.7763,-122.4329,sight(7.5,'高','草坪与彩色房屋适合短停拍照，主要看外观。')),
  twin: place('Twin Peaks · 双子峰',37.7544,-122.4477,sight(8.5,'高','晴天城市全景很棒；雾天价值明显下降。')),
  souvla: place('Souvla · Mission',37.7603,-122.4214,{address:'758 Valencia Street, San Francisco'}),
  missionbart: place('16th St Mission BART',37.7651,-122.4197),
  lake: place('Lake Merritt · 西岸',37.8054,-122.2596,sight(7,'本地热门','湖边放松与步行方便，适合会议间隙。')),
  jack: place('Jack London Square',37.7955,-122.2770,sight(6.5,'中等','水岸散步舒适，赶车时可直接跳过。')),
  oakstation: place('Oakland Jack London · 火车站',37.7938,-122.2717,{address:'245 2nd Street, Oakland'}),
  merced: place('Merced · Amtrak 车站',37.3075,-120.4826),
  yosemite: place('Yosemite Valley · 仅交通概览',37.7488,-119.5872,{note:'按要求不展示优胜美地园内游览细节。'}),
  deyoung: place('de Young · 展馆入口',37.7715,-122.4686,{...sight(8.5,'高','艺术收藏、建筑与观景塔兼具；两小时适合精选常设展。'),source:'https://www.famsf.org/visit/de-young',approximate:true}),
  deyoungtower: place('de Young · Hamon 观景塔',37.7725,-122.4678,{approximate:true,note:'建筑区域定位；塔内按指示行走，不代表独立街道入口。'}),
  teahouse: place('Japanese Tea Garden · 茶屋',37.7700,-122.4704,{approximate:true,source:'https://www.japaneseteagardensf.com/tea-house',note:'园内区域近似位置；现场按指示寻找茶屋。'}),
  gyros: place('North Beach Gyros · 午餐',37.8005,-122.4102,{address:'561 Columbus Avenue, San Francisco',approximate:true,source:'https://www.northbeachgyro.com/'}),
  chowders: place('Chowders · 早晚餐',37.8081,-122.4095,{approximate:true,address:'Pier 39 入口，Level 1',source:'https://www.pier39.com/attraction/chowders/'}),
  tea: place('Japanese Tea Garden · 日本茶园',37.7702,-122.4701,sight(8,'高','园林精致，适合慢走；面积不大，有单独门票。')),
  lands: place('Lands End / Sutro Baths',37.7798,-122.5135,sight(9,'中高','海岸、遗址与短步道组合很棒；风大，留意路况。')),
  oak: place('OAK · 奥克兰机场 T2',37.7124,-122.2142),
  lax: place('LAX · 洛杉矶机场',33.9416,-118.4085)
};


// 细分地点使用区域中心近似坐标；园内实际通行与开放情况以官方地图和现场为准。
Object.assign(places, {
 alcatrazyard: place('Alcatraz · 放风场',37.8270715,-122.4237067,{approximate:true,source:'https://www.nps.gov/places/000/alcatraz-recreation-yard.htm',note:'牢房西侧放风场；有台阶，现场关闭时保留牢房周边活动。'}),
 alcatraz64: place('Alcatraz · 64 号楼展区',37.8267075,-122.4217048,{approximate:true,source:'https://www.nps.gov/places/000/alcatraz-building-64.htm',note:'码头附近的兵营建筑，展览、放映和书店按当日开放情况选择。'}),
 muirshuttle: place('Muir Woods · 接驳站',37.8922302,-122.5716451,{role:'transfer'}),
 muircathedral: place('Muir Woods · Cathedral Grove',37.8982635,-122.5756648,{approximate:true,source:'https://www.nps.gov/places/000/cathedral-grove.htm',note:'静音红杉林区域；沿主步道往返，点位为区域示意。'}),
 californiaPowell: place('California / Powell · 缆车站',37.7918,-122.4090,{role:'transfer',approximate:true}),
 coliseum: place('Coliseum · BART 换乘站',37.7537,-122.1970,{role:'transfer',approximate:true})
});
for(const id of ['bart12','powell','embarcadero','missionbart','larkspur','pier33','oakstation','coliseum','californiaPowell','cable'])places[id].role='transfer';

// 每个活动：起止时间、地点、动作、说明。移动活动使用 from + to，地图自动生成路线。
const stop = (start,end,at,title,detail='',extra={}) => ({start,end,at,title,detail,...extra});
const move = (start,end,from,to,mode,title,detail='',extra={}) => ({start,end,from,to,mode,title,detail,...extra});
const breakfast = (end='08:45',start='08:00') => stop(start,end,'hotel','起床 · 酒店早餐','优先蛋白质、水果与适量主食；具体供应内容不保证。早餐时段入住再确认。');
export const days = [
 {id:'2026-10-02',label:'10/02',weekday:'周五',title:'旧街区 · 恶魔岛夜游',subtitle:'白天慢逛 · 17:55 夜游目标',budget:{food:55,transport:90,tickets:70.65,groceries:0},notes:['09/25 官方购票页实查：10/2 的 17:55、18:30、19:05 均显示可选；17:55 提示余票较少。尚未订票，优先选 17:55。','上午不赶景点，08:00 起床；Coit Tower 若排队过长只看壁画和山顶，不挤占晚餐及登船。','返岛码头 20:20 后的船班尚未从官方返程表核实：20:20–21:00 是候船和航行预留窗口，不是船班。付款前请向官方确认能在 21:00 前回 Pier 33；否则本日 22:00 回酒店的目标不能成立，需重新选择返程或夜游安排。','为保护晚归时间，夜游后预算打车回 Oakland；全日约 $216，明显超出 $100，主要是夜游票和跨湾晚间打车。若确认早一班返程、公共交通能在 22:00 前到酒店，可省约 $50–65。','夜游不是原白天四小时自由游的完全替代：外围道路可能关闭，优先牢房音频与现场夜间节目；岛内细分时间为弹性估算。'],events:[
 breakfast(),stop('08:45','10:15','hotel','休息 · 熟悉交通 · 保存船票','确认早餐时段、10/10 行李寄存；设置 Clipper / BART 付款方式，带身份证明、防风外套和水。未收到有效票券与确认号不视为预订成功。'),
 move('10:15','11:15','hotel','chinatown','transit','BART → Embarcadero · 步行唐人街','含跨湾候车和步行缓冲；具体发车以当天导航为准。',{via:['bart12','embarcadero'],legMinutes:[10,30,20]}),
 stop('11:15','12:00','chinatown','唐人街 · Grant Avenue 与街巷','商店营业时段游览，慢慢走，不专门排长队。'),
 move('12:00','12:20','chinatown','gyros','walk','步行 North Beach Gyros'),
 stop('12:20','13:15','gyros','午餐 · 鸡肉饭盘 / 卷饼','鸡肉、蔬菜与适量米饭 / 饼，酱汁分开；按食量加肉。店方列周五 11:00 起营业。',{cost:'含税及服务预算 $22–28'}),
 move('13:15','13:20','gyros','northbeach','walk','步行 Washington Square'),
 stop('13:20','13:50','northbeach','北滩街区 · 坐下休息','广场与意式街景；想喝咖啡可顺路购买，不另排队。',{cost:'可选饮品 $5–7'}),
 move('13:50','14:20','northbeach','coit','walk','缓步上 Telegraph Hill','上坡留 30 分钟，不必赶。'),
 stop('14:20','15:10','coit','Coit Tower · 壁画与登塔','官方季节开放 10:00–18:00。电梯可能停运，登塔或需爬楼；排队超过 20 分钟则仅看免费壁画和园区视野。',{cost:'登塔预留 $11；现场确认',optional:true}),
 move('15:10','15:45','coit','pier39','walk','下坡到 Pier 39','35 分钟含休息与路口等待。'),
 stop('15:45','16:15','pier39','海狮与海湾 · 短逛'),
 move('16:15','16:20','pier39','chowders','walk','走到码头入口 Chowders'),
 stop('16:20','17:05','chowders','登岛前吃早晚餐','选海鲜三明治或含蛋白质的沙拉；想尝 clam chowder 可选小杯配主食，不只喝汤。菜单供应现场确认；不额外安排炸物。',{cost:'含税预算 $20–26'}),
 move('17:05','17:20','chowders','pier33','walk','沿海滨步行 Pier 33'),
 stop('17:20','17:55','pier33','验票 · 洗手间 · 排队登船','提前 35 分钟抵达；确认当晚回程表和最后登船时间，优先选可在 21:00 前返回大陆的班次。'),
 move('17:55','18:25','pier33','alcatrazdock','ferry','17:55 Night Tour · 绕岛与讲解','17:55 是官方实际可选的出发时刻；航行与靠岸 30 分钟为规划估算。',{status:'09/25 可选 · 未订',cost:'成人 $59.65，往返及音频导览'}),
 stop('18:25','18:35','alcatrazdock','入岛说明 · 核对夜间节目','查看节目地点、道路开放与回程队伍；夜游以工作人员安排为准。'),
 move('18:35','18:55','alcatrazdock','alcatraz','walk','跟随导览上坡至牢房','约 400 米、累计上升约 40 米；沿途讲解结束时间可能变动。'),
 stop('18:55','19:55','alcatraz','牢房音频导览 · 暂停拍照','先领中文音频。约 60 分钟预留；不为追赶次要展区中断核心导览。'),
 stop('19:55','20:00','alcatraz','夜间节目 / 夜景 · 机动选择','长讲座不能保证参加完整；以当晚节目表和回程班次取舍。'),
 move('20:00','20:05','alcatraz','alcatrazyard','walk','开放时走到放风场','这是条件节点：夜间关闭则在牢房允许区域拍照，并直接沿开放道路下山。'),
 stop('20:05','20:10','alcatrazyard','放风场与夜景 · 仅开放时','不承诺夜间开放；不绕行封闭外围道路。',{optional:true,status:'现场开放决定'}),
 move('20:10','20:20','alcatrazyard','alcatrazdock','walk','沿开放路线下行码头','不要等到最后一刻排队；如现场要求更早候船，提前结束外围拍照。'),
 move('20:20','21:00','alcatrazdock','pier33','ferry','候船 + 回到 Pier 33 · 待核实窗口','不是 20:20 固定开船；官方表读取未成功，需预订前核实实际返程班次。须能在 21:00 前抵达大陆才采用后续时间表。',{status:'返程船班待官方确认'}),
 move('21:00','22:00','pier33','hotel','ride','打车返回 Oakland · 含候车缓冲','以 21:00 前回码头为前提；预计 45–60 分钟含叫车，拥堵时可能更久。若官方回程无法满足，不可直接套用此时间。',{cost:'打车预留 $60–80；非实时报价',status:'条件估算 · 22:00 目标'})
 ]},
 {id:'2026-10-03',label:'10/03',weekday:'周六',title:'红杉森林的一天',subtitle:'轮渡 · Muir Woods · 海湾晚餐',budget:{food:47,transport:35,tickets:15,groceries:10},notes:['09/24 官方接驳页面曾查到去程 12:00、回程 16:00 可选，均未订；余票会变化，以实际票面重排渡轮。','轮渡按官方 2026 年 4 月起周末表：SF 10:45 → Larkspur 11:20，返程 18:00 → 18:35；临行复核服务变动。Muir Woods 手机信号不可靠，离线保存票券。','在森林总停留约 3 小时包含午餐；本表主环线及静坐约 1 小时 50 分钟；提前到达可延长。'],events:[
 breakfast(),stop('08:45','09:00','hotel','装水 · 零食 · 外套 · 离线票'),
 move('09:00','09:45','hotel','ferry','transit','BART Embarcadero · 轮渡大厦','',{via:['bart12','embarcadero']}),
 stop('09:45','10:20','ferry','市集 · 购买当天备用零食','买常温坚果 / 能量棒与水果，装水；用于接驳延误或返程候船，不取代午餐。',{cost:'预留 $10'}),stop('10:20','10:45','ferry','Gate C 候船','登船口以现场信息为准。'),
 move('10:45','11:20','ferry','larkspur','ferry','渡轮 → Larkspur','计划参考班次，出行前再核对。',{status:'待核实',cost:'约 $9.50'}),
 stop('11:20','12:00','larkspur','找接驳站 · 洗手间 · 提前排队'),
 move('12:00','13:00','larkspur','muircafe','shuttle','预约接驳 → Muir Woods','预留 45–60 分钟道路交通。',{status:'待预约',cost:'往返接驳约 $4',via:['muirshuttle'],legModes:['shuttle','walk'],legMinutes:[55,5]}),
 stop('13:00','13:35','muircafe','午餐 · 火鸡三明治 / 汤','根据当日供应补足蛋白质；自带零食应对排队。',{cost:'$18–23'}),
 move('13:35','13:40','muircafe','muir','walk','步行入林'),
 stop('13:40','15:30','muir','红杉主环线 · 悠闲步行','如接驳更早到达，可在午餐后增加森林停留。保持回程余量。',{cost:'成人门票预算 $15',status:'门票未购'}),
 stop('15:30','16:00','muir','洗手间 · 返回接驳站排队'),
 move('16:00','17:00','muirshuttle','larkspur','shuttle','接驳返回 Larkspur','必须预约返程时段。',{status:'待预约'}),
 stop('17:00','18:00','larkspur','休息吃零食 · 17:40 开始候船'),
 move('18:00','18:35','larkspur','ferry','ferry','渡轮 → 旧金山','参考计划班次，需核实。',{status:'待核实',cost:'约 $9.50'}),
 move('18:35','18:45','ferry','gotts','walk','步行去晚餐'),
 stop('18:45','19:35','gotts','晚餐 · 鸡肉 / 豆类沙拉','选含足量蛋白质的沙拉，酱汁分开，主食按食量补充。',{cost:'$23–28'}),
 move('19:35','20:30','gotts','hotel','transit','BART 返回酒店','',{via:['embarcadero','bart12']})
 ]},
 {id:'2026-10-04',label:'10/04',weekday:'周日',title:'旧金山城市经典',subtitle:'经典城市地标 · 金门大桥',budget:{food:35,transport:30,tickets:0,groceries:0},notes:['08:00 起床，上午留出休息和整理时间；不再为恶魔岛采购便携午餐。','10/2–4 金门公园举办 Hardly Strictly Bluegrass，公交可能拥挤；本日不进入公园。','若缆车候车超过 25 分钟，改公交到九曲花街；保护午餐与大桥停留。'],events:[
 breakfast(),stop('08:45','10:25','hotel','休息 · 洗衣 / 整理 · 出门准备','今天不早起；补水、带防风外套。'),
 move('10:25','11:10','hotel','union','transit','BART 到 Powell · 步行联合广场','先走到 12th St BART，再跨湾至 Powell。预留候车时间。',{via:['bart12','powell']}),
 stop('11:10','11:30','union','联合广场短停'),
 move('11:30','12:20','union','cable','transit','步行 + California 缆车向西','含走到 California / Powell 及候车；以当天运行情况为准。',{cost:'缆车预算 $9',via:['californiaPowell'],legModes:['walk','cable'],legMinutes:[25,25]}),
 move('12:20','12:55','cable','lombard','transit','公交 + 步行去九曲花街','可参考 49 路方向，当天导航确认换乘。'),
 stop('12:55','13:25','lombard','九曲花街 · 沿坡向下看'),
 move('13:25','13:45','lombard','inout','walk','步行去渔人码头'),
 stop('13:45','14:30','inout','体验美式汉堡午餐','Double-Double、薯条和水。今天安排一次当地快餐体验。',{cost:'$10–13'}),
 move('14:30','15:15','inout','palace','transit','公交 30 路方向 + 步行'),
 stop('15:15','15:55','palace','艺术宫 · 湖边散步拍照'),
 move('15:55','16:30','palace','bridge','transit','公交 28 路方向到大桥南端'),
 stop('16:30','17:45','bridge','金门大桥 · 南端观景与短走','走一段桥面后原路返回，不安排全程过桥。带防风外套。'),
 move('17:45','19:15','bridge','chipotle','transit','公交 + BART 返回 Oakland','90 分钟交通缓冲；实际换乘看当天导航。',{via:['powell','bart12']}),
 stop('19:15','20:00','chipotle','晚餐 · 高蛋白饭碗','鸡肉、豆类、米饭和蔬菜；酱汁适量，可按饥饿程度加肉。',{cost:'$17–22'}),
 move('20:00','20:10','chipotle','hotel','walk','回酒店休息')
 ]},
 {id:'2026-10-05',label:'10/05',weekday:'周一',title:'会议与小小庆生',subtitle:'完整上午参会 · 晚上留给自己',budget:{food:56,transport:55,tickets:0,groceries:0},notes:['19:00 后不安排活动，生日晚上自行支配。','双子峰看天气：雾大时跳过，省下两段打车费用或缩短路线。','会议是否含午餐待确认；预算先按自费计算。'],events:[
 breakfast('08:05','07:30'),move('08:05','08:15','hotel','conference','walk','步行会场'),
 stop('08:15','08:30','conference','领 badge / 找会场','注册开放时间待核实；如需提前领取，以会议信息为准。'),
 stop('08:30','10:00','conference','完整参加上午会议'),stop('10:00','10:30','conference','会间休息 · 熟悉会场'),stop('10:30','12:00','conference','继续参加会议'),
 stop('12:00','12:40','conference','会议午餐 / 附近饭碗','若会议不含午餐，去 1302 Broadway 的 Chipotle；步行数分钟。',{cost:'预留 $18',alternativePlace:'chipotle'}),
 move('12:40','13:05','conference','cupcake','walk','步行 Cupcakin’ · 取一个小蛋糕','可提前确认单个 cupcake 库存。',{cost:'约 $6'}),
 move('13:05','13:20','cupcake','hotel','walk','回酒店 · 吃蛋糕 / 放东西','不假定房间有冰箱，奶油蛋糕尽快吃。'),
 move('13:20','14:25','hotel','painted','transit','BART + Muni 前往 Alamo Square','',{via:['bart12','powell']}),
 stop('14:25','15:00','painted','彩绘女士 · 草坪与合影'),
 move('15:00','15:30','painted','twin','ride','打车到双子峰','大雾时跳过这个点，直接去 Mission。',{cost:'两段打车合计约 $35–55'}),
 stop('15:30','16:15','twin','双子峰全景','风大，拍照后适当休息。',{optional:true}),
 move('16:15','16:45','twin','souvla','ride','打车到 Mission'),
 stop('16:45','17:45','souvla','生日早晚餐 · 烤鸡与沙拉','半只烤鸡加配菜 / 沙拉，费用含预计税费及服务支出。',{cost:'$30–36'}),
 move('17:45','19:00','souvla','hotel','transit','步行 16th St Mission BART · 回酒店','',{via:['missionbart','bart12']}),
 stop('19:00','22:00','hotel','自由时间','晚上不再安排景点或演讲准备。')
 ]},
 {id:'2026-10-06',label:'10/06',weekday:'周二',title:'报告日 · 向山谷出发',subtitle:'完整上午参会 · 补给 · 火车',budget:{food:43,transport:57,tickets:0,groceries:45},notes:['17:48–20:47 火车仅为原计划目标，当前未确认可售班次。订票后必须更新这一段。','Merced 酒店与晚到入住需要落实；不能把车站当作已订住宿。','今天购买 Yosemite 补给，并留一小份常温蛋白零食给 10/10；返程日在茶屋吃午餐。'],events:[
 breakfast('08:05','07:30'),move('08:05','08:15','hotel','conference','walk','步行会场'),stop('08:15','08:30','conference','入场与缓冲'),
 stop('08:30','10:00','conference','上午会议'),stop('10:00','10:30','conference','与主持人确认设备 / 报告顺序'),
 stop('10:30','12:00','conference','报告与完整 session','报告时间、East Hall 2 和顺序需按最终会议程序核对。',{status:'议程待复核'}),
 stop('12:00','12:45','conference','午餐 · 会议 / Biryani Kabab','如不含会议餐，去酒店旁餐厅，选肉类、主食与蔬菜。',{cost:'预留 $25',alternativePlace:'biryani'}),
 move('12:45','13:10','conference','lake','walk','步行到 Lake Merritt'),stop('13:10','13:45','lake','湖边短走','不绕整湖，保持购物和收拾时间。'),
 move('13:45','14:05','lake','wholefoods','walk','步行超市'),
 stop('14:05','14:45','wholefoods','采购 Yosemite 补给 + 返程备用零食','常温蛋白质袋、全麦饼、坚果、能量棒、水果。用于便携午餐与零食，不替代三天全部正餐。',{cost:'约 $45',checklist:['Yosemite 常温便携食品','火车零食与水','留一份常温蛋白零食供 10/10 使用','检查食品保质期']}),
 move('14:45','15:15','wholefoods','hotel','walk','回酒店'),
 stop('15:15','15:50','hotel','整理小包 · 留好备用零食','住宿连续保留时，大箱可留房间。装好电源、保暖层、食品、车票。'),
 move('15:50','15:55','hotel','chipotle','walk','步行去早晚餐'),stop('15:55','16:35','chipotle','出发前吃饱','鸡肉豆类饭碗，按食量补足主食。',{cost:'$17–22'}),
 move('16:35','16:55','chipotle','jack','ride','打车到 Jack London Square','',{cost:'$10–15'}),
 stop('16:55','17:10','jack','水岸短停','路况延误时跳过，直接到车站。',{optional:true}),
 move('17:10','17:20','jack','oakstation','walk','步行 Amtrak 车站'),stop('17:20','17:48','oakstation','候车 · 核对站台'),
 move('17:48','20:47','oakstation','merced','train','火车 → Merced · 目标班次','未确认班次与票价；先订火车与 Merced 住宿，再固定出发日安排。',{status:'时间待核实',cost:'预算 $35–60'}),
 stop('20:47','22:00','merced','接续住宿 · 入住地点待确定','地图定位目前仅为 Merced 车站。酒店、接驳方式和入住时间尚未落实。',{status:'住宿待落实'})
 ]},
 {id:'2026-10-07',label:'10/07',weekday:'周三',title:'进入优胜美地',subtitle:'仅保留园外交通概览',budget:null,notes:['园内具体游览不在这份地图展示。YARTS 班次、上车点与住宿待确认。'],events:[
 move(null,null,'merced','yosemite','shuttle','Merced → Yosemite · 早班目标','此前希望约 07:00 到达；未确认班表，不把目标写成承诺。Merced Transpo 与 Amtrak 站不是同一上车点，以票面为准。',{status:'待订 / 待核实'})
 ]},
 {id:'2026-10-08',label:'10/08',weekday:'周四',title:'优胜美地',subtitle:'园内游览按要求不展开',budget:null,notes:['此页保留日期入口；不展示园内路线或编造住宿安排。'],events:[stop(null,null,'yosemite','园内行程另行安排','地图只显示山谷概览位置。')]},
 {id:'2026-10-09',label:'10/09',weekday:'周五',title:'回到 Oakland',subtitle:'交通待订 · 返程后只做简单整理',budget:null,notes:['YARTS 与火车需配套确认，转乘保留余量。','当晚只整理次日行李、备用零食和票证，不安排补逛景点。'],events:[
 move(null,null,'yosemite','merced','shuttle','YARTS → Merced','出发时间与接续火车待核实。',{status:'待订 / 待核实'}),
 move(null,null,'merced','oakstation','train','火车 → Oakland','到达时间以实际车票为准。',{status:'待订 / 待核实'}),
 move(null,null,'oakstation','hotel','ride','返回酒店','晚间按到达情况选择打车或公共交通。'),
 stop(null,null,'hotel','15 分钟整理 · 然后休息','拿出 10/6 留的常温蛋白零食；整理次日手提行李、证件和国际段托运需求。')
 ]},
 {id:'2026-10-10',label:'10/10',weekday:'周六',title:'de Young · 茶园与抹茶',subtitle:'14:00 离开公园 · 16:50 抵达 OAK 目标',budget:{food:58,transport:32,tickets:40,groceries:0},notes:['08:00 起床；de Young 两小时包含入场和观景塔，常设展为主，不叠加大型特展。','茶园 + 茶屋留约 90 分钟，抹茶与轻午餐在同一段完成；不安排三文鱼。14:00 必须离开公园。','18:50 OAK T2 起飞，目标 16:50 到机场；按首段无托运行李规划。若改为托运，需提前离开公园并重排。','午餐约 $33、机场晚餐约 $25；交通 $32，门票保守预留 $40，共约 $130。茶园准确票价以官方结账为准，预留 $20 不是已核实售价；学生证若适用 de Young 学生票可省 $9。','若到馆晚于 10:30，先省去观景塔，12:15 仍离馆；茶屋队伍超过 15 分钟就缩短园内拍照、简化点餐，不能延后 14:00。','返酒店预留 90 分钟；出园即查看导航，若预计晚于 15:30 到酒店，及时换车（额外约 $40–70），避免把延误推给机场。','LAX 20:15 到 T1；10/11 00:25 从国际航站楼 B 乘 CX881。自行确认国际段行李托运、转楼与重新安检。'],events:[
 breakfast('08:35'),stop('08:35','08:45','hotel','退房 · 寄存行李 · 带学生证','提前确认寄存；带 10/6 备的小份常温蛋白零食应对饥饿，不是自带完整午餐，园内按饮食规定食用。'),
 move('08:45','10:15','hotel','deyoung','transit','BART + Muni → de Young','12th St → Powell，换乘 N-Judah 至 9th Ave / Irving 后步行入园；90 分钟含等车与步行，具体班次当天导航。',{via:['bart12','powell'],legModes:['walk','train','transit'],legMinutes:[10,30,50]}),
 stop('10:15','10:30','deyoung','入馆 · 存包 / 洗手间 · 领取地图','10:15 为预计到达，不是已存在的预约时隙。按官方实际售票选 10/10 常设展 General Admission。',{cost:'成人 $20；有效学生证 $11',status:'未购票'}),
 stop('10:30','11:50','deyoung','常设展 · 选重点慢看','美国艺术、纺织及其他文化收藏中选感兴趣的展厅，不追求看完全部。'),
 move('11:50','11:55','deyoung','deyoungtower','walk','馆内前往 Hamon Tower','位置为建筑区域近似点；实际以馆内指示为准。'),
 stop('11:55','12:15','deyoungtower','观景塔 · 金门公园全景','含等电梯；若人多或上午到馆晚，省略塔，保证茶园时间。',{optional:true}),
 move('12:15','12:25','deyoungtower','tea','walk','步行至日本茶园入口','10 分钟含出馆及步行。'),
 stop('12:25','12:35','tea','入园 · 门票与地图','周六没有工作日早间免费时段；可现场购票。若提前在线购票，按官网实际可选时隙及入场条款选择，不把 12:25 当作预约班次。',{cost:'保守预留 $20，实际票价待结账确认',status:'未购票'}),
 stop('12:35','13:05','tea','日式庭园 · 池塘、石灯笼与园路','园内慢走与拍照，按现场地图行走。'),
 move('13:05','13:10','tea','teahouse','walk','步行茶屋'),
 stop('13:10','13:55','teahouse','坐下喝抹茶 · 轻午餐','官方菜单：抹茶 $10.50、乌冬 $10.25、毛豆 $4.75，税前合计 $25.50；预留 $33 含税及小费。抹茶仅堂食。不安排三文鱼；蛋白不足可出园后吃自备蛋白零食。45 分钟含排队。',{cost:'约 $33；菜单可能调整'}),
 move('13:55','14:00','teahouse','tea','walk','回入口 · 洗手间 · 准备离园'),
 move('14:00','15:30','tea','hotel','transit','Muni + BART 返回 Oakland','步行至 9th / Irving，N-Judah → Powell，BART → 12th St。保留 90 分钟，出发即查看预计到达。',{via:['powell','bart12'],legModes:['transit','train','walk'],legMinutes:[50,30,10]}),
 stop('15:30','15:50','hotel','取行李 · 核对证件与登机牌'),
 move('15:50','16:50','hotel','oak','transit','BART Coliseum + 机场接驳','到 OAK T2；60 分钟含候车与换乘。若公共交通预测超过 16:50，改打车（额外约 $30–50）。',{via:['bart12','coliseum'],legModes:['walk','train','shuttle'],legMinutes:[10,30,20]}),
 stop('16:50','17:30','oak','T2 安检 · 找登机口','首段按无托运行李；手机提前完成值机。'),
 stop('17:30','18:00','oak','机场晚餐 · 三明治 / 蛋白质饭碗','安检后选营业中的餐厅，全麦主食、肉类与蔬菜；不为指定店铺绕到远端。',{cost:'预留 $25'}),
 stop('18:00','18:50','oak','登机口候机 · 登机','以航司实际登机时间为准；如提前登机，先带走晚餐。'),
 move('18:50','20:15','oak','lax','flight','WN2620 · OAK → LAX','依据用户航班截图；起降均为当地时间。',{status:'用户已提供航班'}),
 stop('20:15','23:59','lax','转国际航站楼 B · 国际段值机和行李','10/11 00:25 CX881 → HKG；后续 CX970 → 厦门。确认是否需提取并重新托运行李。')
 ]}
];

// 同一地点可有多个时间节点，id 在单日内保持稳定即可。
days.forEach(day => day.events.forEach((event,index) => { event.id ||= `${day.id}-${index+1}`; }));

// 细分仍在唯一数据源完成；保留原时段边界与其他活动的稳定 id。
const refine = (dayId,eventId,items) => {
 const day=days.find(d=>d.id===dayId),index=day.events.findIndex(e=>e.id===eventId);
 items.forEach((e,i)=>{e.id=i===0?eventId:`${eventId}-detail-${i}`;e.status ||= '细分时间为规划估算';});
 day.events.splice(index,1,...items);
};
refine('2026-10-03','2026-10-03-11',[
 stop('13:40','13:50','muir','入口 · 核对步道与门票','领取地图，查看当天主步道开放情况。',{cost:'成人门票预算 $15',status:'门票未购'}),
 move('13:50','14:20','muir','muircathedral','walk','沿 Redwood Creek 主步道深入红杉林','边走边看；30 分钟为规划预留。'),
 stop('14:20','14:50','muircathedral','Cathedral Grove · 安静看红杉'),
 move('14:50','15:30','muircathedral','muir','walk','沿主步道返回入口','边走边拍照；以入口地图为准，不延误 16:00 接驳。')
]);
refine('2026-10-03','2026-10-03-12',[
 move('15:30','15:40','muir','muirshuttle','walk','入口洗手间 · 返回接驳站'),
 stop('15:40','16:00','muirshuttle','提前排队等接驳')
]);
// 几何位置依据 OpenStreetMap 对应实体校准；坐标为点位或建筑中心，不代表入口。
for(const [id,osm] of Object.entries({alcatraz:'way/128245373',alcatrazdock:'node/1526523486',alcatrazyard:'way/151291054',alcatraz64:'way/24617219',muir:'node/1250312226',muircafe:'node/2910193095',muircathedral:'node/369172769',muirshuttle:'node/6456312203'}))places[id].coordinateSource=`https://www.openstreetmap.org/${osm}`;
// 已有 via 仅代表换乘锚点。分段用时是规划分配，不是已查到的车次。
const legPlans={
 'hotel>union':[5,30,10], 'hotel>ferry':[5,30,10], 'gotts>hotel':[10,35,10],
 'hotel>pier33':[10,35,30], 'bridge>chipotle':[45,35,10], 'chinatown>biryani':[15,30,10],
 'hotel>painted':[5,30,30], 'souvla>hotel':[15,45,15], 'hotel>tea':[5,30,55], 'lands>hotel':[60,35,10]
};
for(const day of days)for(const event of day.events){
 if(event.via && !event.legMinutes)event.legMinutes=legPlans[`${event.from}>${event.to}`];
 if(event.via?.length===2 && !event.legModes)event.legModes=[['bridge','lands'].includes(event.from)?'transit':'walk','train',['painted','tea'].includes(event.to)?'transit':'walk'];
}

export const trip = {
 title:'湾区慢行', dates:'2026.10.02 — 10.10', updated:'2026-09-25', timezone:'America/Los_Angeles',
 budgetTarget:100,
 disclaimer:'时间为规划目标；交通线是地点间连接示意，不是实时导航或已核实道路轨迹。金额为预算，不含酒店、机票。',
 ratingsNote:'评分是本行程的推荐度 /10；热度与体验为定性参考，不是实时平台评分或游客人数统计。',
 reservations:[
  {when:'优先办理',title:'恶魔岛 10/2 · 17:55 Night Tour',detail:'09/25 官方实查可选且余票较少，成人 $59.65。先确认回程可在 21:00 前到 Pier 33，再付款；目前尚未订票。17:20 到码头。夜游后打车，22:00 回酒店是条件目标。',url:'https://alcatrazcitycruises.com/tickets/alcatraz-night-tour'},
  {when:'出发前 / 当天',title:'10/10 de Young 与日本茶园',detail:'de Young 计划 10:15 到馆（不是预约时隙），买常设展成人 $20 / 有效学生证 $11；茶园预计 12:25 入园，可现场买票，准确票价以结账为准。茶屋 13:10 排队堂食抹茶与轻午餐，14:00 离园。',url:'https://www.famsf.org/visit/de-young'},
  {when:'现在',title:'Muir Woods 10/3 双向接驳',detail:'目标去程 12:00、回程 16:00；门票与接驳分开。订好后核对 Larkspur 轮渡衔接。',url:'https://gomuirwoods.com/'},
  {when:'现在',title:'10/6、10/9 火车与 YARTS',detail:'先查可售班次，再锁定 Merced 酒店与园内住宿；不要使用截图旧班次直接转乘。',url:'https://www.amtrak.com/'},
  {when:'10/1 入住',title:'前台确认早餐与行李',detail:'核实早餐时间、10/10 退房后寄存，确认连续预订期间房间保留。'},
  {when:'10/2',title:'生日 cupcake · 提前问库存',detail:'10/5 中午 Swan’s Market 门店取一个即可。',url:'https://cupcakinbakeshop.com/'},
  {when:'每天前一晚',title:'票券离线保存 · 查交通',detail:'保存电子票、地址与公交路线；查看船班和营业变动。不要将票券二维码上传公开仓库。'},
  {when:'10/9 晚',title:'次日航班准备',detail:'整理备用零食、行李与证件；核对 OAK 航站楼和 LAX 国际段托运。'}
 ],
 alternatives:[
  {name:'Oakland Museum of California',score:8,reason:'10/2 下雨或时差严重时的替代；周二闭馆需复核。'},
  {name:'Lands End / Sutro Baths',score:9,reason:'10/10 让位给 de Young 与茶园抹茶；本版不安排，避免压缩去机场缓冲。'},
  {name:'加州科学院',score:9,reason:'适合留 3–4 小时，本版没有安排；不与 de Young 和茶园同时塞进航班日。'},
  {name:'植物园 / 温室内部',reason:'本版未安排；公园当天仅选 de Young 和日本茶园。'},
  {name:'Sausalito / Baker Beach / 完整 Presidio 徒步',reason:'本次不额外加入；Muir Woods 的船车衔接与既有海岸景点优先。'}
 ],
 sources:[
  ['恶魔岛夜游 · 09/25 官方可售班次实查','https://alcatrazcitycruises.com/tickets/alcatraz-night-tour'],
  ['de Young 票价与开放时间','https://www.famsf.org/visit/de-young-tickets-hours'],
  ['茶屋官方菜单','https://www.japaneseteagardensf.com/_files/ugd/889599_dec4f88512db4d7c99ec8d5a647459f0.pdf'],
  ['North Beach Gyros','https://www.northbeachgyro.com/'],
  ['Chowders','https://www.pier39.com/attraction/chowders/'],
  ['10/2–4 公园活动交通提醒','https://www.sfmta.com/travel-updates/hardly-strictly-bluegrass-october-2-4-2026'],
  ['恶魔岛具体地点与无障碍路线','https://www.nps.gov/alca/planyourvisit/accessibility.htm'],
  ['Muir Woods 主步道','https://www.nps.gov/goga/planyourvisit/muir-woods-main-trail.htm'],
  ['酒店','https://www.wyndhamhotels.com/ramada/oakland-california/ramada-oakland-downtown-city-center/overview'],
  ['早餐时间参考（订房平台，待前台确认）','https://www.booking.com/hotel/us/hotel-13th-street-oakland.html'],
  ['会议程序','https://conf.researchr.org/program/splash-issta-2026/program-splash-issta-2026/Detailed-Table'],
  ['Muir Woods 接驳','https://gomuirwoods.com/muir/shuttleInfo'],
  ['Golden Gate Ferry','https://www.goldengate.org/ferry/'],
  ['恶魔岛船班','https://alcatrazcitycruises.com/plan-your-visit/schedule/'],
  ['恶魔岛饮食规定','https://www.nps.gov/alca/planyourvisit/wheretoeat.htm'],
  ['Coit Tower','https://www.sfrecpark.org/Facilities/Facility/Details/Coit-Tower-290'],
  ['茶园票价与时间','https://gggp.org/visit/admissions-hours/'],
  ['Amtrak','https://www.amtrak.com/'],['YARTS','https://yarts.com/'],
  ['Whole Foods Oakland','https://www.wholefoodsmarket.com/stores/oakland'],
  ['Cupcakin’','https://cupcakinbakeshop.com/'],['Souvla Mission','https://www.souvla.com/location/souvla-the-mission/'],
  ['Gott’s Ferry Building','https://www.gotts.com/location/sfferrybuilding/'],['Biryani Kabab','https://www.thebiryanikabab.com/'],
  ['In-N-Out','https://locations.in-n-out.com/154'],['Chipotle Oakland','https://locations.chipotle.com/ca/oakland/1302-broadway']
 ]
};
