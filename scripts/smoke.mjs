import { JSDOM } from 'jsdom';
import { readdirSync } from 'node:fs';
import path from 'node:path';

const assetsDir = path.resolve('dist/assets');
const jsFile = readdirSync(assetsDir).find((f) => f.endsWith('.js') && f.startsWith('index'));
if (!jsFile) throw new Error('未找到构建产物 dist/assets/index-*.js');
const jsPath = path.join(assetsDir, jsFile);

const dom = new JSDOM('<!doctype html><html><body><div id="root"></div></body></html>', {
  url: 'http://localhost/',
  pretendToBeVisual: true
});
const { window } = dom;

function setGlobal(name, val) {
  try {
    Object.defineProperty(globalThis, name, { value: val, configurable: true, writable: true });
  } catch {
    globalThis[name] = val;
  }
}
setGlobal('window', window);
setGlobal('document', window.document);
setGlobal('navigator', window.navigator);
setGlobal('HTMLElement', window.HTMLElement);
setGlobal('Element', window.Element);
setGlobal('Node', window.Node);
setGlobal('MutationObserver', window.MutationObserver);
setGlobal('Event', window.Event);
setGlobal('EventTarget', window.EventTarget);
setGlobal('customElements', window.customElements);
setGlobal('localStorage', window.localStorage);
setGlobal('requestAnimationFrame', window.requestAnimationFrame?.bind(window) || ((cb) => setTimeout(cb, 0)));
setGlobal('cancelAnimationFrame', window.cancelAnimationFrame?.bind(window) || ((id) => clearTimeout(id)));
setGlobal('self', window);
setGlobal('getComputedStyle', window.getComputedStyle.bind(window));

await import('file://' + jsPath);
await new Promise((r) => setTimeout(r, 400));

const html = window.document.getElementById('root').innerHTML;
const checks = {
  ROOT_LEN: html.length,
  含标题墨阅: html.includes('墨阅'),
  含搜索框: html.includes('搜索'),
  含书卡: html.includes('book-card') || html.includes('鲁迅')
};
console.log(JSON.stringify(checks, null, 2));
console.log('SNIPPET:', html.slice(0, 200).replace(/\n/g, ' '));
if (!checks.含标题墨阅 || html.length < 50) {
  console.error('SMOKE_FAIL');
  process.exit(1);
}
console.log('SMOKE_OK');
