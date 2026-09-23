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
  muir: place('Muir Woods · 红杉森林',37.8913,-122.5808,sight(9,'高','主环线平缓，古老红杉很有沉浸感；接驳需提前预约。')),
  muircafe: place('Muir Woods Trading Co. Café',37.8903,-122.5800,{parentPlace:'muir'}),
  gotts: place('Gott’s Roadside · Ferry Building',37.7954,-122.3938,{address:'1 Ferry Building #6'}),
  pier33: place('Pier 33 · 恶魔岛登船码头',37.8065,-122.4056),
  alcatraz: place('Alcatraz · 恶魔岛牢房',37.8267,-122.4230,sight(9.5,'很高','音频导览与历史体验突出；岛上需要步行上坡。')),
  alcatrazdock: place('Alcatraz · 岛上码头',37.8260,-122.4210,{parentPlace:'alcatraz',note:'自带食物只在指定码头区域食用。'}),
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
  tea: place('Japanese Tea Garden · 日本茶园',37.7702,-122.4701,sight(8,'高','园林精致，适合慢走；面积不大，有单独门票。')),
  lands: place('Lands End / Sutro Baths',37.7798,-122.5135,sight(9,'中高','海岸、遗址与短步道组合很棒；风大，留意路况。')),
  oak: place('OAK · 奥克兰机场 T2',37.7124,-122.2142),
  lax: place('LAX · 洛杉矶机场',33.9416,-118.4085)
};

// 每个活动：起止时间、地点、动作、说明。移动活动使用 from + to，地图自动生成路线。
const stop = (start,end,at,title,detail='',extra={}) => ({start,end,at,title,detail,...extra});
const move = (start,end,from,to,mode,title,detail='',extra={}) => ({start,end,from,to,mode,title,detail,...extra});
const breakfast = (end='08:45',start='08:00') => stop(start,end,'hotel','起床 · 酒店早餐','优先蛋白质、水果与适量主食；具体供应内容不保证。早餐时段入住再确认。');
export const days = [
 {id:'2026-10-02',label:'10/02',weekday:'周五',title:'初见旧金山',subtitle:'经典城市地标 · 金门大桥',budget:{food:30,transport:28,tickets:0,groceries:30},notes:['疲劳时先省略 Union Square 或缆车，不压缩跨湾交通时间。','采购食品按实际付款计在今天，10/4 自带午餐不重复计费。'],events:[
 breakfast(),move('08:45','09:15','hotel','wholefoods','walk','步行去超市'),
 stop('09:15','09:50','wholefoods','采购 10/4 午餐与日常零食','全麦饼/面包 $6、常温金枪鱼袋 $8、坚果 $6、水果 $6、能量棒 $4。选可常温保存的密封食品。',{cost:'约 $30',checklist:['全麦主食','金枪鱼常温袋','坚果与水果','10/4 午餐单独留好']}),
 move('09:50','10:25','wholefoods','hotel','walk','回酒店放食品 · 洗手间'),
 move('10:25','11:10','hotel','union','transit','BART 到 Powell · 步行联合广场','先走到 12th St BART，再跨湾至 Powell。预留候车时间。',{via:['bart12','powell']}),
 stop('11:10','11:30','union','联合广场短停'),
 move('11:30','12:20','union','cable','transit','步行 + California 缆车向西','含走到 California / Powell 及候车；以当天运行情况为准。',{cost:'缆车预算 $9'}),
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
 {id:'2026-10-03',label:'10/03',weekday:'周六',title:'红杉森林的一天',subtitle:'轮渡 · Muir Woods · 海湾晚餐',budget:{food:47,transport:35,tickets:15,groceries:0},notes:['去程 12:00、回程 16:00 接驳车都是预约目标，未订。以实际票面重排渡轮。','岛外轮渡时间也需临行核查；Muir Woods 手机信号不可靠，提前存好票券。','在森林总停留约 3 小时包含午餐；实际主环线步行约 2–2.5 小时。'],events:[
 breakfast(),stop('08:45','09:00','hotel','装水 · 零食 · 外套 · 离线票'),
 move('09:00','09:45','hotel','ferry','transit','BART Embarcadero · 轮渡大厦','',{via:['bart12','embarcadero']}),
 stop('09:45','10:20','ferry','周末市集与海湾短逛'),stop('10:20','10:45','ferry','Gate C 候船','登船口以现场信息为准。'),
 move('10:45','11:20','ferry','larkspur','ferry','渡轮 → Larkspur','计划参考班次，出行前再核对。',{status:'待核实',cost:'约 $9.50'}),
 stop('11:20','12:00','larkspur','找接驳站 · 洗手间 · 提前排队'),
 move('12:00','13:00','larkspur','muircafe','shuttle','预约接驳 → Muir Woods','预留 45–60 分钟道路交通。',{status:'待预约',cost:'往返接驳约 $4'}),
 stop('13:00','13:35','muircafe','午餐 · 火鸡三明治 / 汤','根据当日供应补足蛋白质；自带零食应对排队。',{cost:'$18–23'}),
 move('13:35','13:40','muircafe','muir','walk','步行入林'),
 stop('13:40','15:30','muir','红杉主环线 · 悠闲步行','如接驳更早到达，可在午餐后增加森林停留。保持回程余量。',{cost:'成人门票预算 $15',status:'门票未购'}),
 stop('15:30','16:00','muir','洗手间 · 返回接驳站排队'),
 move('16:00','17:00','muir','larkspur','shuttle','接驳返回 Larkspur','必须预约返程时段。',{status:'待预约'}),
 stop('17:00','18:00','larkspur','休息吃零食 · 17:40 开始候船'),
 move('18:00','18:35','larkspur','ferry','ferry','渡轮 → 旧金山','参考计划班次，需核实。',{status:'待核实',cost:'约 $9.50'}),
 move('18:35','18:45','ferry','gotts','walk','步行去晚餐'),
 stop('18:45','19:35','gotts','晚餐 · 鸡肉 / 豆类沙拉','选含足量蛋白质的沙拉，酱汁分开，主食按食量补充。',{cost:'$23–28'}),
 move('19:35','20:30','gotts','hotel','transit','BART 返回酒店','',{via:['embarcadero','bart12']})
 ]},
 {id:'2026-10-04',label:'10/04',weekday:'周日',title:'慢慢逛恶魔岛',subtitle:'留足半天 · 北岸与旧街区',budget:{food:32,transport:18,tickets:59,groceries:0},notes:['目标预订 10:35 Day Tour，不是已确认船票。若没有该班次，以实际票面调整。','岛上保留约 4 小时；返程时间是候船窗口，不代表存在同名固定船班。','若 16:00 后才回大陆，直接跳过 Coit Tower，不压缩恶魔岛。'],events:[
 breakfast('08:40'),stop('08:40','08:50','hotel','打包已采购午餐 · 水 · 外套 · 证件'),
 move('08:50','10:05','hotel','pier33','transit','BART + 步行 Pier 33','Embarcadero 出站后沿海滨步行约 30 分钟。',{via:['bart12','embarcadero']}),
 stop('10:05','10:35','pier33','提前到码头 · 安检排队'),
 move('10:35','10:50','pier33','alcatrazdock','ferry','登船前往恶魔岛','目标去程：10:35；仅从官方渠道订 Day Tour。',{status:'待预约',cost:'往返 + 导览起价 $47.95'}),
 move('10:50','11:15','alcatrazdock','alcatraz','walk','听入岛介绍 · 慢慢走上坡'),
 stop('11:15','12:35','alcatraz','牢房音频导览 · 随时暂停拍照'),
 stop('12:35','13:10','alcatraz','展览与海湾视野 · 慢慢下行'),
 stop('13:10','13:45','alcatrazdock','码头指定区域 · 自带午餐','金枪鱼袋、全麦主食、水果和坚果。支出已计入 10/2 采购。',{cost:'今天不重复计费'}),
 stop('13:45','14:40','alcatraz','开放展区 / 花园 / 海岸视野','按开放区域自由走；如有合适讲解可参加，不保证当天节目。'),
 move('14:40','15:30','alcatrazdock','pier33','ferry','走回码头 · 候船返回','以当天返程船班和队伍为准，这一段包含步行与等待。'),
 move('15:30','15:40','pier33','pier39','walk','步行 Pier 39'),stop('15:40','16:00','pier39','看看海狮'),
 move('16:00','16:40','pier39','coit','transit','步行 + 39 路方向去 Coit Tower'),
 stop('16:40','17:25','coit','科伊特塔 · 有余量再登塔','售票截止可能早于关门。队长或赶不上就看外部景观。',{cost:'登塔预算 $11',optional:true}),
 move('17:25','17:40','coit','northbeach','walk','下坡到 North Beach'),
 stop('17:40','18:00','northbeach','咖啡 / 休息','避免咖啡影响睡眠时可换无咖啡因饮品。',{cost:'$5–7'}),
 move('18:00','18:15','northbeach','chinatown','walk','步行唐人街'),stop('18:15','18:45','chinatown','街区短逛'),
 move('18:45','19:40','chinatown','biryani','transit','BART 返回 Oakland','',{via:['embarcadero','bart12']}),
 stop('19:40','20:30','biryani','晚餐 · 烤肉 + 米饭 + 蔬菜','少油、酱汁适量；营业时间出发前复核。',{cost:'$24–30'}),move('20:30','20:35','biryani','hotel','walk','回酒店')
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
 {id:'2026-10-06',label:'10/06',weekday:'周二',title:'报告日 · 向山谷出发',subtitle:'完整上午参会 · 补给 · 火车',budget:{food:43,transport:57,tickets:0,groceries:50},notes:['17:48–20:47 火车仅为原计划目标，当前未确认可售班次。订票后必须更新这一段。','Merced 酒店与晚到入住需要落实；不能把车站当作已订住宿。','今天的超市采购包含 10/10 午餐，避免临出发找饭。'],events:[
 breakfast('08:05','07:30'),move('08:05','08:15','hotel','conference','walk','步行会场'),stop('08:15','08:30','conference','入场与缓冲'),
 stop('08:30','10:00','conference','上午会议'),stop('10:00','10:30','conference','与主持人确认设备 / 报告顺序'),
 stop('10:30','12:00','conference','报告与完整 session','报告时间、East Hall 2 和顺序需按最终会议程序核对。',{status:'议程待复核'}),
 stop('12:00','12:45','conference','午餐 · 会议 / Biryani Kabab','如不含会议餐，去酒店旁餐厅，选肉类、主食与蔬菜。',{cost:'预留 $25',alternativePlace:'biryani'}),
 move('12:45','13:10','conference','lake','walk','步行到 Lake Merritt'),stop('13:10','13:45','lake','湖边短走','不绕整湖，保持购物和收拾时间。'),
 move('13:45','14:05','lake','wholefoods','walk','步行超市'),
 stop('14:05','14:45','wholefoods','采购 Yosemite 补给 + 10/10 午餐','常温蛋白质袋、全麦饼、坚果、能量棒、水果。用于便携午餐与零食，不替代三天全部正餐。',{cost:'$45–55',checklist:['Yosemite 常温便携食品','火车零食与水','单独留一份 10/10 午餐在酒店','检查食品保质期']}),
 move('14:45','15:15','wholefoods','hotel','walk','回酒店'),
 stop('15:15','15:50','hotel','整理小包 · 留好返程午餐','住宿连续保留时，大箱可留房间。装好电源、保暖层、食品、车票。'),
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
 {id:'2026-10-09',label:'10/09',weekday:'周五',title:'回到 Oakland',subtitle:'交通待订 · 返程后只做简单整理',budget:null,notes:['YARTS 与火车需配套确认，转乘保留余量。','当晚只整理次日行李、午餐和票证，不安排补逛景点。'],events:[
 move(null,null,'yosemite','merced','shuttle','YARTS → Merced','出发时间与接续火车待核实。',{status:'待订 / 待核实'}),
 move(null,null,'merced','oakstation','train','火车 → Oakland','到达时间以实际车票为准。',{status:'待订 / 待核实'}),
 move(null,null,'oakstation','hotel','ride','返回酒店','晚间按到达情况选择打车或公共交通。'),
 stop(null,null,'hotel','15 分钟整理 · 然后休息','拿出 10/6 留的常温午餐；整理次日手提行李、证件和国际段托运需求。')
 ]},
 {id:'2026-10-10',label:'10/10',weekday:'周六',title:'海岸散步 · 飞往洛杉矶',subtitle:'13:15 结束游览 · 16:20 抵达 OAK',budget:{food:27,transport:52,tickets:20,groceries:0},notes:['18:50 从 OAK T2 起飞，不能按 SFO 安排行程。','13:15 是结束游览的硬截止；若茶园延误，舍弃 Lands End。','返程留出酒店取行李、跨湾交通与安检缓冲。Fleet Week 期间交通可能变慢。','LAX 20:15 到达 T1；次日 00:25 从国际航站楼 B 乘 CX881。需自行确认行李提取/托运、转楼与重新安检。'],events:[
 breakfast('08:35'),stop('08:35','08:45','hotel','退房 · 寄存行李','寄存服务入住时提前确认；带上午餐，不假定可以冷藏。'),
 move('08:45','10:15','hotel','tea','transit','BART + Muni → 金门公园','保留约 90 分钟；到达晚于 10:30 时压缩后续景点。',{via:['bart12','powell']}),
 stop('10:15','11:15','tea','日本茶园慢走','门票预算不是已核实价格；周六不套用工作日免费时段。',{cost:'暂留 $20',status:'票价待核实'}),
 move('11:15','11:50','tea','lands','ride','打车去 Lands End Lookout','',{cost:'$20–30'}),
 stop('11:50','12:50','lands','Sutro Baths 观景 · 海岸短走','以观景点和短段步道为主，不走完整海岸长线。',{optional:true}),
 stop('12:50','13:10','lands','自带午餐','使用 10/6 留在酒店的常温食品；费用已计入采购。'),
 stop('13:10','13:15','lands','收拾 · 必须出发回酒店'),
 move('13:15','15:00','lands','hotel','transit','38/38R 方向 + BART 回 Oakland','公交接 BART；如延误明显，及时换打车保护航班时间。',{via:['powell','bart12']}),
 stop('15:00','15:20','hotel','取行李 · 洗手间 · 核对证件'),
 move('15:20','16:20','hotel','oak','transit','BART Coliseum + 机场接驳','导航选择 OAK / Oakland Airport，航站楼 T2。',{via:['bart12']}),
 stop('16:20','17:15','oak','T2 安检 · 找登机口'),
 stop('17:15','17:50','oak','机场晚餐 · Subway / 同类三明治','全麦面包、足量肉类、蔬菜，酱汁适量；营业以当天为准。',{cost:'$18–25'}),
 stop('17:50','18:50','oak','登机口候机 · 登机','以航空公司通知的登机时间和登机口为准。'),
 move('18:50','20:15','oak','lax','flight','WN2620 · OAK → LAX','根据用户提供的航班截图；起降均为当地时间。',{status:'用户已提供航班'}),
 stop('20:15','23:59','lax','转国际航站楼 B · 行李与国际段值机','10/11 00:25 CX881 → HKG；10/12 06:45 到达，09:30 CX970 → 厦门，11:05 到达。确认是否需要提取并重新托运行李。')
 ]}
];

// 同一地点可有多个时间节点，id 在单日内保持稳定即可。
days.forEach(day => day.events.forEach((event,index) => { event.id ||= `${day.id}-${index+1}`; }));
export const trip = {
 title:'湾区慢行', dates:'2026.10.02 — 10.10', updated:'2026-09-23', timezone:'America/Los_Angeles',
 budgetTarget:100,
 disclaimer:'时间为规划目标；交通线是地点间连接示意，不是实时导航或已核实道路轨迹。金额为预算，不含酒店、机票。',
 ratingsNote:'评分是本行程的推荐度 /10；热度与体验为定性参考，不是实时平台评分或游客人数统计。',
 reservations:[
  {when:'现在',title:'恶魔岛 10/4 Day Tour',detail:'目标 10:35；先核实余票。若换班次，整体移动岛上时间并删减大陆景点。',url:'https://alcatrazcitycruises.com/tickets/alcatraz-day-tour'},
  {when:'现在',title:'Muir Woods 10/3 双向接驳',detail:'目标去程 12:00、回程 16:00；门票与接驳分开。订好后核对 Larkspur 轮渡衔接。',url:'https://gomuirwoods.com/'},
  {when:'现在',title:'10/6、10/9 火车与 YARTS',detail:'先查可售班次，再锁定 Merced 酒店与园内住宿；不要使用截图旧班次直接转乘。',url:'https://www.amtrak.com/'},
  {when:'10/1 入住',title:'前台确认早餐与行李',detail:'核实早餐时间、10/10 退房后寄存，确认连续预订期间房间保留。'},
  {when:'10/2',title:'生日 cupcake · 提前问库存',detail:'10/5 中午 Swan’s Market 门店取一个即可。',url:'https://cupcakinbakeshop.com/'},
  {when:'每天前一晚',title:'票券离线保存 · 查交通',detail:'保存电子票、地址与公交路线；查看船班和营业变动。不要将票券二维码上传公开仓库。'},
  {when:'10/9 晚',title:'次日航班准备',detail:'整理午餐、行李与证件；核对 OAK 航站楼和 LAX 国际段托运。'}
 ],
 alternatives:[
  {name:'Oakland Museum of California',score:8,reason:'10/2 下雨或时差严重时的替代；周二闭馆需复核。'},
  {name:'de Young / 植物园 / 温室内部',reason:'10/10 不额外塞入，避免挤占去机场的缓冲。'},
  {name:'Sausalito / Baker Beach / 完整 Presidio 徒步',reason:'本次不额外加入；Muir Woods 的船车衔接与既有海岸景点优先。'}
 ],
 sources:[
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
