// 生成可直接双击打开的审阅版；维护仍只改源码，不改生成文件。
import { readFile, writeFile } from 'node:fs/promises';
const root=new URL('../',import.meta.url);
const read=path=>readFile(new URL(path,root),'utf8');
const [html,css,leafletCss,leafletJs,data,app]=await Promise.all(['index.html','styles.css','vendor/leaflet.css','vendor/leaflet.js','data/itinerary.js','app.js'].map(read));
const bundled=html.replace('<link rel="stylesheet" href="vendor/leaflet.css"><link rel="stylesheet" href="styles.css">',`<style>${leafletCss}\n${css}</style>`)
 .replace('<script src="vendor/leaflet.js" defer></script><script src="app.js" type="module"></script>',`<script>${leafletJs.replace(/\/\/# sourceMappingURL=.*$/gm,'')}</script><script type="module">${data.replace(/export const /g,'const ')}\n${app.replace(/^import .*?;\n/,'')}</script>`);
const output=process.argv[2]||new URL('../preview.html',import.meta.url);
await writeFile(output,bundled);console.log('Standalone HTML saved:',String(output));
