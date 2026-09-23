# 湾区慢行 · 行程地图

2026 年 10 月 2–10 日的轻量行程地图。没有框架、后端、数据库、API 密钥或运行时 npm 依赖。

在线地图：https://ash1852.github.io/bay-area-trip-2026/ 。

项目仓库：https://github.com/ash1852/bay-area-trip-2026 。

## 使用

- 选择日期：地图、时间表和预算一起更新。
- **路线模式**：地图展示当天地点、地点之间的虚线连接及交通分类。点击路线或节点可看详情。
- **时间模式**：保留路线，显示时间标签与可横向滚动的时间节点。点击任意时间会定位地图并展示动作、费用、预约状态、评分和导航链接。
- 同一地点多次出现时，点击地图节点选择对应时间，不会丢失早餐、采购、回酒店等重复安排。
- 地图可以拖动、缩放；“查看全日”恢复全日范围。网址片段保存日期、模式与选中节点。
- “预约与出行准备”展示预约、购物、预算、备选景点和来源。

路线是**地点间连接示意**，并非沿道路的精确导航轨迹。公交、轮渡等以票面和当天运营信息为准。详情提供 Google Maps 导航入口。地点坐标为近似位置。评分为个人行程推荐度，非实时游客平台数据。

## 本地运行

在项目目录执行 `python -m http.server 8000`，浏览器打开 `http://localhost:8000`。使用 ES modules，需要 HTTP 服务；不要直接双击 index.html。

运行 `node scripts/validate.mjs` 检查时间冲突、地点引用、费用和关键约束。Node 22+ 即可，不需要 npm install。

如需可直接打开的单文件审阅版，运行 `node scripts/standalone.mjs`，生成 `preview.html`。它包含全部代码与数据，但底图仍需联网。发布和后续修改仍以分离的源码为准，不编辑生成文件。

## GitHub Pages 首次发布

1. 在自己的 GitHub 账号新建公开仓库 `bay-area-trip-2026`，默认分支 `main`。
2. 把本项目文件原样放在仓库根目录（包括 `.github/workflows/pages.yml`）。
3. 仓库 Settings → Pages → Source 选择 **GitHub Actions**。
4. 在 Actions 运行 **Check and deploy itinerary**，或提交一次修改自动运行。
5. 工作流成功后，以 GitHub Pages 设置页/部署记录给出的地址为准。未看到成功状态前不视为已上线。

## 以后怎么改

告诉助手日期、地点、时间或预算的变化；助手读取仓库最新代码，修改对应数据、检查并提交。提交 main 后自动发布。

核心文件：

| 文件 | 职责 |
| --- | --- |
| `data/itinerary.js` | 地点、每日活动、交通、费用、预约与核查来源 |
| `app.js` | 统一渲染地图与时间表、选择与导航 |
| `styles.css` | 桌面与手机布局 |
| `index.html` | 页面结构 |
| `scripts/validate.mjs` | 数据完整性与时间冲突检查 |
| `.github/workflows/pages.yml` | 检查通过后部署 |

普通停留用 `stop(start,end,place,title,detail,extra)`；移动用 `move(start,end,from,to,mode,title,detail,extra)`。`extra` 可含 `cost`（说明文字）、`status`、`optional`、`checklist`、`via`（途经地点 id）。每日 `budget` 是预算汇总，更新支出时同步修改；自带午餐只在采购日计费。节点可显式指定稳定 `id`，否则由日期和序号生成。

## 数据状态

- 当前行程为规划稿。未确认门票、接驳、火车与 Merced 住宿已显式标注；7–9 日园内游览不展示。
- 酒店早餐时段为订房平台参考，入住再确认。
- 10/10 的 OAK → LAX 航班来自用户截图；国际段要核对行李与跨航站楼转乘。
- 六天已列预算合计 $654，不包含 7–9 日、酒店和机票；另建议预留机动费用。
- 本地打包 Leaflet 1.9.4（BSD-2-Clause，许可在 `vendor/LICENSE`）。底图来自 OpenStreetMap，保持页面署名；需要联网，不做离线瓦片缓存或批量下载。
- 没有跟踪脚本。底图请求会发往 OpenStreetMap，导航链接由用户点击后打开。

## 发布边界

只发布 `index.html`、`app.js`、`styles.css`、`data/`、`vendor/` 到 Pages。公开仓库本身同样公开，请勿加入订单、私人邮箱、票券二维码或密钥。
