'use strict';

// Real Chromium interactions through CDP, using only Node built-ins.
// Never attaches to the user's browser. Starts an isolated browser profile and
// (only if needed) this repository's local server; cleans up only those resources.
// Optional: GAME_BROWSER_PATH, GAME_TEST_BASE_URL, GAME_QA_DIR (screenshots).
const assert = require('node:assert/strict');
const fs = require('node:fs');
const os = require('node:os');
const path = require('node:path');
const { spawn } = require('node:child_process');

const ROOT = path.resolve(__dirname, '..');
const BASE = (process.env.GAME_TEST_BASE_URL || 'http://127.0.0.1:5173').replace(/\/$/, '');
const GAME = BASE + '/hanh-trinh.html';
const delay = ms => new Promise(resolve => setTimeout(resolve, ms));
const quote = value => JSON.stringify(value);
const owned = { server: null, browser: null, profile: null, browserClient: null, clients: [] };
const runtimeErrors = [], failedLocalRequests = [], checks = [];

async function eventually(work, description, timeout = 10000) {
  const until = Date.now() + timeout;
  let lastError;
  while (Date.now() < until) {
    try { const value = await work(); if (value) return value; }
    catch (error) { lastError = error; }
    await delay(100);
  }
  throw new Error(`Timed out: ${description}${lastError ? '\n' + lastError.message : ''}`);
}

async function fetchOk(url) {
  try { const response = await fetch(url, { signal: AbortSignal.timeout(1500) }); return response.ok; }
  catch (_) { return false; }
}

async function ensureServer() {
  if (await fetchOk(GAME)) return;
  if (BASE !== 'http://127.0.0.1:5173') throw new Error(`Server is unavailable: ${BASE}`);
  let failure = '', output = '';
  owned.server = spawn(process.execPath, ['server.cjs'], { cwd: ROOT, windowsHide: true, stdio: ['ignore', 'pipe', 'pipe'] });
  owned.server.on('error', error => { failure = error.message; });
  owned.server.stdout.on('data', chunk => { output += chunk; });
  owned.server.stderr.on('data', chunk => { output += chunk; });
  await eventually(async () => {
    if (failure || owned.server.exitCode !== null) throw new Error(`Could not start local server: ${failure || output}`);
    return fetchOk(GAME);
  }, 'local game server', 10000);
}

function browserExecutable() {
  const candidates = [process.env.GAME_BROWSER_PATH, process.env.CHROME_PATH, process.env.EDGE_PATH];
  if (process.platform === 'win32') {
    for (const directory of [process.env.PROGRAMFILES, process.env['PROGRAMFILES(X86)'], process.env.LOCALAPPDATA].filter(Boolean)) {
      candidates.push(path.join(directory, 'Google/Chrome/Application/chrome.exe'));
      candidates.push(path.join(directory, 'Microsoft/Edge/Application/msedge.exe'));
    }
  } else if (process.platform === 'darwin') {
    candidates.push('/Applications/Google Chrome.app/Contents/MacOS/Google Chrome', '/Applications/Microsoft Edge.app/Contents/MacOS/Microsoft Edge');
  } else {
    candidates.push('/usr/bin/google-chrome', '/usr/bin/google-chrome-stable', '/usr/bin/chromium', '/usr/bin/chromium-browser', '/opt/google/chrome/chrome');
  }
  const found = candidates.find(candidate => candidate && fs.existsSync(candidate));
  if (!found) throw new Error('Chrome/Edge not found. Set GAME_BROWSER_PATH to its executable.');
  return found;
}

class CDP {
  constructor(ws) {
    this.ws = ws; this.sequence = 0; this.pending = new Map(); this.listeners = new Map();
    ws.addEventListener('message', event => {
      const message = JSON.parse(event.data);
      if (message.id) {
        const pending = this.pending.get(message.id);
        if (!pending) return;
        clearTimeout(pending.timer); this.pending.delete(message.id);
        if (message.error) pending.reject(new Error(JSON.stringify(message.error)));
        else pending.resolve(message.result || {});
      } else for (const handler of this.listeners.get(message.method) || []) handler(message.params);
    });
    ws.addEventListener('close', () => {
      for (const pending of this.pending.values()) { clearTimeout(pending.timer); pending.reject(new Error('CDP connection closed')); }
      this.pending.clear();
    });
  }
  static async connect(url) {
    const socket = new WebSocket(url);
    await new Promise((resolve, reject) => {
      const timer = setTimeout(() => { socket.close(); reject(new Error('CDP WebSocket connection timeout')); }, 10000);
      socket.addEventListener('open', () => { clearTimeout(timer); resolve(); }, { once: true });
      socket.addEventListener('error', () => { clearTimeout(timer); reject(new Error('CDP WebSocket connection failed')); }, { once: true });
    });
    return new CDP(socket);
  }
  on(event, handler) {
    const handlers = this.listeners.get(event) || []; handlers.push(handler); this.listeners.set(event, handlers);
  }
  nextEvent(event, timeout = 15000) {
    return new Promise((resolve, reject) => {
      const remove = handler => this.listeners.set(event, (this.listeners.get(event) || []).filter(item => item !== handler));
      const handler = payload => { clearTimeout(timer); remove(handler); resolve(payload); };
      const timer = setTimeout(() => { remove(handler); reject(new Error(`Browser event timed out: ${event}`)); }, timeout);
      this.on(event, handler);
    });
  }
  call(method, params = {}) {
    return new Promise((resolve, reject) => {
      const id = ++this.sequence;
      const timer = setTimeout(() => { this.pending.delete(id); reject(new Error(`CDP timed out: ${method}`)); }, 10000);
      this.pending.set(id, { resolve, reject, timer });
      this.ws.send(JSON.stringify({ id, method, params }));
    });
  }
  async evaluate(expression) {
    const result = await this.call('Runtime.evaluate', { expression, returnByValue: true, awaitPromise: true });
    if (result.exceptionDetails) throw new Error(result.exceptionDetails.exception?.description || result.exceptionDetails.text);
    return result.result.value;
  }
  close() { if (this.ws.readyState < WebSocket.CLOSING) this.ws.close(); }
}

async function launchBrowser() {
  const executable = browserExecutable();
  owned.profile = fs.mkdtempSync(path.join(os.tmpdir(), 'august-v2-browser-'));
  const args = ['--headless=new', '--disable-gpu', '--no-first-run', '--no-default-browser-check', '--disable-background-networking', '--disable-extensions', '--remote-debugging-port=0', `--user-data-dir=${owned.profile}`, 'about:blank'];
  if (process.platform === 'linux') args.push('--no-sandbox');
  let endpoint = null, launchError = '', stderr = '';
  owned.browser = spawn(executable, args, { windowsHide: true, stdio: ['ignore', 'ignore', 'pipe'] });
  owned.browser.on('error', error => { launchError = error.message; });
  owned.browser.stderr.on('data', chunk => {
    stderr = (stderr + chunk).slice(-12000);
    const found = stderr.match(/DevTools listening on (ws:\/\/[^\s]+)/);
    if (found) endpoint = found[1];
  });
  await eventually(() => {
    if (launchError || owned.browser.exitCode !== null) throw new Error(`Could not launch isolated browser: ${launchError || stderr}`);
    if (endpoint) return endpoint;
    const activePort = path.join(owned.profile, 'DevToolsActivePort');
    if (fs.existsSync(activePort)) {
      const [port, route] = fs.readFileSync(activePort, 'utf8').trim().split(/\r?\n/);
      if (/^\d+$/.test(port) && route?.startsWith('/devtools/browser/')) return `ws://127.0.0.1:${port}${route}`;
    }
    return false;
  }, 'isolated Chrome/Edge debugging endpoint', 15000).then(value => { endpoint = value; });
  owned.browserClient = await CDP.connect(endpoint);
  return new URL(endpoint).origin.replace(/^ws:/, 'http:');
}

async function newPage(endpoint, width, height) {
  const { targetId } = await owned.browserClient.call('Target.createTarget', { url: 'about:blank' });
  const target = await eventually(async () => {
    const response = await fetch(endpoint + '/json/list');
    return (await response.json()).find(item => item.id === targetId && item.webSocketDebuggerUrl);
  }, 'new isolated page');
  const client = await CDP.connect(target.webSocketDebuggerUrl);
  owned.clients.push(client);
  client.on('Runtime.exceptionThrown', event => runtimeErrors.push(event.exceptionDetails.exception?.description || event.exceptionDetails.text));
  client.on('Network.responseReceived', event => {
    if (event.response.url.startsWith(BASE + '/') && event.response.status >= 400 && !event.response.url.endsWith('/favicon.ico')) {
      failedLocalRequests.push(`${event.response.status} ${event.response.url}`);
    }
  });
  await Promise.all([client.call('Page.enable'), client.call('Runtime.enable'), client.call('Network.enable')]);
  // Verify the promised local-font fallback and avoid depending on a third-party
  // font service in a functional test. GAME_TEST_LIVE_FONTS=1 allows visual QA
  // with the downloaded typefaces when internet access is available.
  if (process.env.GAME_TEST_LIVE_FONTS !== '1') {
    await client.call('Network.setBlockedURLs', { urls: ['*fonts.googleapis.com*', '*fonts.gstatic.com*'] });
  }
  await client.call('Emulation.setDeviceMetricsOverride', { width, height, deviceScaleFactor: 1, mobile: width < 600 });
  await client.call('Emulation.setEmulatedMedia', { features: [{ name: 'prefers-reduced-motion', value: 'reduce' }] });
  return client;
}

async function navigate(client, url) {
  const loaded = client.nextEvent('Page.loadEventFired');
  await client.call('Page.navigate', { url });
  await loaded;
  await eventually(() => client.evaluate("document.readyState === 'complete' && !!window.StoryDebug"), 'game page initialized', 15000);
}

async function reload(client) {
  const loaded = client.nextEvent('Page.loadEventFired');
  await client.call('Page.reload');
  await loaded;
}

const exists = (client, selector) => client.evaluate(`!!document.querySelector(${quote(selector)})`);
const state = client => client.evaluate('window.StoryDebug.state()');
const view = client => client.evaluate('window.StoryDebug.view()');

async function rectangle(client, selector) {
  return client.evaluate(`(() => {
    const element = document.querySelector(${quote(selector)});
    if (!element) throw new Error('Missing selector: ' + ${quote(selector)});
    element.scrollIntoView({block:'center', inline:'nearest', behavior:'instant'});
    const r = element.getBoundingClientRect();
    return {x:r.x+r.width/2,y:r.y+r.height/2,width:r.width,height:r.height,disabled:!!element.disabled};
  })()`);
}

async function click(client, selector) {
  const rect = await rectangle(client, selector);
  assert.ok(rect.width > 0 && rect.height > 0 && !rect.disabled, `Cannot click ${selector}`);
  await client.call('Input.dispatchMouseEvent', { type: 'mouseMoved', x: rect.x, y: rect.y });
  await client.call('Input.dispatchMouseEvent', { type: 'mousePressed', x: rect.x, y: rect.y, button: 'left', clickCount: 1 });
  await client.call('Input.dispatchMouseEvent', { type: 'mouseReleased', x: rect.x, y: rect.y, button: 'left', clickCount: 1 });
}

async function key(client, name) {
  const code = name === ' ' ? 'Space' : name;
  const virtual = { Enter: 13, Escape: 27, Tab: 9, ' ': 32 }[name];
  await client.call('Input.dispatchKeyEvent', { type: 'keyDown', key: name, code, windowsVirtualKeyCode: virtual, nativeVirtualKeyCode: virtual, text: name === 'Enter' ? '\r' : name === ' ' ? ' ' : undefined });
  await client.call('Input.dispatchKeyEvent', { type: 'keyUp', key: name, code, windowsVirtualKeyCode: virtual, nativeVirtualKeyCode: virtual });
}

async function keyboardActivate(client, selector, keyName = 'Enter') {
  await client.evaluate(`(() => { const element=document.querySelector(${quote(selector)}); if(!element) throw new Error('Missing focus target'); element.focus(); })()`);
  assert.equal(await client.evaluate(`document.activeElement === document.querySelector(${quote(selector)})`), true, `Cannot focus ${selector}`);
  await key(client, keyName);
}

async function stopChild(child) {
  if (!child || child.exitCode !== null) return;
  child.kill();
  await Promise.race([new Promise(resolve => child.once('exit', resolve)), delay(2000)]);
}

async function cleanup() {
  for (const client of owned.clients) client.close();
  if (owned.browserClient) {
    await owned.browserClient.call('Browser.close').catch(() => {});
    owned.browserClient.close();
  }
  await stopChild(owned.browser);
  await stopChild(owned.server);
  if (owned.profile) {
    const tempRoot = path.resolve(os.tmpdir());
    const resolved = path.resolve(owned.profile);
    if (path.dirname(resolved) !== tempRoot || !path.basename(resolved).startsWith('august-v2-browser-')) {
      throw new Error('Refusing cleanup outside the isolated temporary browser profile');
    }
    for (let i = 0; i < 8; i++) {
      try { fs.rmSync(resolved, { recursive: true, force: true }); break; }
      catch (error) { if (i === 7) console.warn(`Temporary profile still in use: ${resolved}: ${error.message}`); else await delay(200); }
    }
  }
}


const D=require('../src/js/story-content'),C=require('../src/js/story-core');
async function shot(c,name){const dir=path.join(ROOT,'.qa','story');fs.mkdirSync(dir,{recursive:true});const r=await c.call('Page.captureScreenshot',{format:'png'});fs.writeFileSync(path.join(dir,name+'.png'),Buffer.from(r.data,'base64'));}
async function goto(c,url){await navigate(c,url);await eventually(()=>c.evaluate('!!window.StoryDebug'),'story initialized');}
const snapshot=c=>c.evaluate('window.StoryDebug.state()');
async function clean(c){assert.equal(await c.evaluate('/D[123]:P[0-9]+|Tư liệu nhóm|Mã P|duyệt chuyên môn|OOXML|Comment IDs/.test(document.body.textContent)'),false);assert.equal(await c.evaluate('document.documentElement.scrollWidth>innerWidth'),false);}
async function choose(c,id,keyboard=false){await click(c,'input[name="choice"][value="'+id+'"]');if(keyboard)await keyboardActivate(c,'button[type="submit"]');else await click(c,'button[type="submit"]');}
async function timing(c){
 await click(c,'[data-action="signal-start"]');assert.equal((await snapshot(c)).signal.phase,'warning');
 await click(c,'[data-action="help"]');const warning=(await snapshot(c)).signal.warning;await delay(350);assert.equal((await snapshot(c)).signal.warning,warning);await click(c,'[data-action="close"]');
 await eventually(async()=>(await snapshot(c)).signal.phase==='flying','signal flight');
 await eventually(async()=>(await snapshot(c)).signal.phase==='missed','signal missed',6500);assert.equal((await snapshot(c)).signal.missed,true);
 await click(c,'[data-action="signal-retry"]');await eventually(async()=>{const s=(await snapshot(c)).signal;return s.phase==='flying'&&s.elapsed>1700;},'retry signal visible');await shot(c,'opportunity');await key(c,' ');assert.equal((await snapshot(c)).signal.phase,'caught');
}
(async()=>{let c;try{
 await ensureServer();const endpoint=await launchBrowser();c=await newPage(endpoint,1600,1080);await goto(c,BASE+'/');assert.equal(await c.evaluate('document.querySelectorAll(".chapter-card").length'),3);await clean(c);await shot(c,'chapter-select');
 await click(c,'a[href="hanh-trinh.html?giai-doan=1939-1945"]');await eventually(async()=>(await snapshot(c))?.chapter===2,'main chapter directly');assert.equal((await snapshot(c)).index,0);assert.equal(await c.evaluate('document.querySelector("button[type=submit]").disabled'),true);
 let q=D.forChapter(2)[0];await choose(c,q.options.find(o=>o.id!==q.answer).id);assert.ok(await c.evaluate('document.querySelector(".feedback").innerText.includes("Chưa phù hợp")'));await shot(c,'unsuitable');await reload(c);await eventually(()=>exists(c,'[data-action="retry"]'),'restore first answer');assert.equal(C.score(D,await snapshot(c)),0);await click(c,'[data-action="retry"]');assert.equal(await c.evaluate('document.querySelectorAll("input[name=choice]:disabled").length'),1);await choose(c,q.answer,true);assert.equal(C.score(D,await snapshot(c)),0);await click(c,'[data-action="next"]');
 for(let i=1;i<18;i++){
  q=D.forChapter(2)[i];assert.equal((await snapshot(c)).index,i);await clean(c);
  if(i===2){await shot(c,'main-question');await click(c,'[data-action="book"]');await clean(c);await shot(c,'reading');await key(c,'Escape');}
  await choose(c,q.answer,i===3);
  assert.equal((await snapshot(c)).answers[q.id].at(-1),q.answer);
  if(q.id===D.opportunityAfter)await timing(c);
  if(i===12){const before=await snapshot(c);await reload(c);await eventually(()=>exists(c,'[data-action="next"]'),'resume suitable answer');assert.deepEqual(await snapshot(c),before);}
  if(i===17){assert.equal(await c.evaluate('window.StoryDebug.view()'),'ending');await click(c,'[data-ending-action="finish"]');await eventually(()=>c.evaluate('window.StoryDebug.view()==="results"'),'ending to results',5000);}else await click(c,'[data-action="next"]');
 }
 assert.equal((await snapshot(c)).finished,true);assert.equal(C.score(D,await snapshot(c)),1700);await clean(c);await shot(c,'main-results');await click(c,'.review>summary');await click(c,'.review-item summary');assert.ok(await c.evaluate('document.querySelector(".review-item[open]").innerText.includes("Phương án phù hợp")'));await shot(c,'review');
 const mainSaved=await c.evaluate('localStorage.getItem("thang-tam:story:1:1939-1945")');
 for(let chapter=0;chapter<2;chapter++){
  await goto(c,BASE+'/');await click(c,'a[href="hanh-trinh.html?giai-doan='+D.chapters[chapter].id+'"]');await eventually(async()=>(await snapshot(c))?.chapter===chapter,'short chapter entry');
  for(let i=0;i<4;i++){assert.equal((await snapshot(c)).index,i);await choose(c,D.forChapter(chapter)[i].answer);await click(c,'[data-action="next"]');}assert.equal((await snapshot(c)).finished,true);assert.equal(C.score(D,await snapshot(c)),400);
 }
 assert.equal(await c.evaluate('localStorage.getItem("thang-tam:story:1:1939-1945")'),mainSaved,'short chapters overwrote main save');
 await goto(c,GAME);assert.equal(await c.evaluate('window.StoryDebug.view()'),'menu');await clean(c);
 const m=await newPage(endpoint,390,844);await goto(m,BASE+'/');await m.evaluate('localStorage.removeItem("thang-tam:story:1:1939-1945")');await reload(m);await clean(m);await shot(m,'mobile-select');await click(m,'a[href="hanh-trinh.html?giai-doan=1939-1945"]');await eventually(async()=>(await snapshot(m))?.chapter===2,'mobile direct chapter');await clean(m);await shot(m,'mobile-question');
 await choose(m,D.forChapter(2)[0].answer);await clean(m);await shot(m,'mobile-feedback');await click(m,'[data-action="help"]');await clean(m);await shot(m,'mobile-help');await key(m,'Escape');
 await m.call('Emulation.setDeviceMetricsOverride',{width:360,height:780,deviceScaleFactor:1,mobile:true});await clean(m);
 await click(m,'[data-action="help"]');await click(m,'[data-action="restart"]');await click(m,'[data-action="confirm-restart"]');assert.equal((await snapshot(m)).index,0);assert.equal((await snapshot(m)).finished,false);assert.equal(C.score(D,await snapshot(m)),0);await clean(m);
 assert.deepEqual(runtimeErrors,[]);assert.deepEqual(failedLocalRequests,[]);console.log('PASS: independent stage selection; all 26 questions; per-option feedback; zero after correction; 1700/1900 main result with missed timing; 400/400 short results; persistence; optional reading; keyboard; 390/360px mobile; no runtime errors.');
}catch(e){if(c)await shot(c,'failure').catch(()=>{});console.error(e);process.exitCode=1;}finally{await cleanup();}})();
