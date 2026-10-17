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
const data = require('../src/js/v2-content.js');
const core = require('../src/js/v2-core.js');

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
  await eventually(() => client.evaluate("document.readyState === 'complete' && !!window.AugustDebug && !!document.querySelector('#world')"), 'game page initialized', 15000);
}

async function reload(client) {
  const loaded = client.nextEvent('Page.loadEventFired');
  await client.call('Page.reload');
  await loaded;
}

const exists = (client, selector) => client.evaluate(`!!document.querySelector(${quote(selector)})`);
const state = client => client.evaluate('window.AugustDebug.state()');
const view = client => client.evaluate('window.AugustDebug.view()');

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

const AD=require('../src/js/august-content'),AC=require('../src/js/august-core');
async function shot(c,name){const dir=path.join(ROOT,'.qa','august');fs.mkdirSync(dir,{recursive:true});const r=await c.call('Page.captureScreenshot',{format:'png'});fs.writeFileSync(path.join(dir,name+'.png'),Buffer.from(r.data,'base64'));}
async function idle(c){await eventually(async()=>!(await state(c)).animation,'animation completed',12000);}
async function hold(c,selector,keyboard=false){if(keyboard){await c.evaluate(`document.querySelector(${quote(selector)}).focus()`);await c.call('Input.dispatchKeyEvent',{type:'keyDown',key:'Enter',code:'Enter',windowsVirtualKeyCode:13});await delay(1150);await c.call('Input.dispatchKeyEvent',{type:'keyUp',key:'Enter',code:'Enter',windowsVirtualKeyCode:13});}else{const p=await rectangle(c,selector);await c.call('Input.dispatchMouseEvent',{type:'mousePressed',x:p.x,y:p.y,button:'left',clickCount:1});await delay(1150);await c.call('Input.dispatchMouseEvent',{type:'mouseReleased',x:p.x,y:p.y,button:'left',clickCount:1});}await idle(c);}
async function taskWork(c,t,keyboard=false){
 if(t.kind==='hold'){await hold(c,`[data-task="${t.id}"]`,keyboard);return;}
 await click(c,`[data-task="${t.id}"]`);
 if(t.kind==='carry'){await click(c,'[data-object="receiver"]');await idle(c);}
 if(t.kind==='gather')for(let i=0;i<t.people.length;i++){await click(c,`[data-object="${i}"]`);await idle(c);}
}
async function assertNoOverlap(c){const overlap=await c.evaluate(`(()=>{const a=[...document.querySelectorAll('.spot:not([disabled])')].map(e=>({id:e.dataset.task,r:e.getBoundingClientRect()}));const stage=document.querySelector('.stage').getBoundingClientRect();for(const e of a)if(e.r.bottom>stage.bottom||e.r.top<stage.top||e.r.left<stage.left||e.r.right>stage.right)return [e.id,'outside scene'];for(let i=0;i<a.length;i++)for(let j=i+1;j<a.length;j++){const x=a[i].r,y=a[j].r;if(Math.min(x.right,y.right)-Math.max(x.left,y.left)>2&&Math.min(x.bottom,y.bottom)-Math.max(x.top,y.top)>2)return [a[i].id,a[j].id];}return null;})()`);assert.equal(overlap,null,'overlapping/clipped task controls: '+overlap);}
(async()=>{let c;try{
 const reviewOnly=process.argv.includes('--review-only');
 await ensureServer();const endpoint=await launchBrowser();c=await newPage(endpoint,1440,1000);await navigate(c,BASE+'/');await shot(c,'home');await navigate(c,GAME);await click(c,'[data-action="begin"]');
 if(reviewOnly){const fixture=AC.create(AD);for(let i=0;i<AD.scenes.length;i++){if(i===0)AC.act(AD,fixture,'roots-restore');for(const t of AD.scenes[i].tasks){if(t.kind==='signal'){AC.tick(AD,fixture,7500);AC.retry(fixture);AC.tick(AD,fixture,2500);}AC.act(AD,fixture,t.id);}AC.next(AD,fixture);}assert.ok(AC.restore(AD,fixture));await navigate(c,BASE+'/');await c.evaluate(`sessionStorage.setItem('august-pixel:journey:1',${quote(JSON.stringify({run:fixture,seen:[0,1,2]}))})`);const loaded=c.nextEvent('Page.loadEventFired');await c.call('Page.navigate',{url:GAME});await loaded;await eventually(async()=>(await state(c)).view==='results','fixture results');}
 if(!reviewOnly){
 await click(c,'[data-task="roots-restore"]');assert.ok(await c.evaluate('document.querySelector("#reader").open'));await shot(c,'feedback');await click(c,'[data-action="retry"]');
 for(let i=0;i<AD.scenes.length;i++){
  if((await state(c)).view==='chapter')await click(c,'[data-action="begin"]');
  assert.equal((await state(c)).run.index,i);console.log('Scene',i+1,AD.scenes[i].id);await assertNoOverlap(c);await shot(c,'scene-'+String(i+1).padStart(2,'0'));
  if(i===8){
   for(const t of AD.scenes[i].tasks.filter(t=>t.kind!=='signal'))await taskWork(c,t);
   await eventually(async()=>(await state(c)).run.signal.phase==='flying','flying signal');await click(c,'[data-action="help"]');const elapsed=(await state(c)).run.signal.elapsed;await delay(600);assert.equal((await state(c)).run.signal.elapsed,elapsed,'help did not pause');await shot(c,'signal-help');await click(c,'[data-action="close"]');
   await eventually(async()=>(await state(c)).run.signal.phase==='missed','missed signal',7000);await click(c,'#reader [data-action="retry-signal"]');
   await eventually(async()=>{const s=(await state(c)).run.signal;return s.phase==='flying'&&s.elapsed>1600;},'visible retry signal');await shot(c,'signal');await key(c,' ');await idle(c);
  }else for(const t of AD.scenes[i].tasks)await taskWork(c,t,i===2);
  if(i===3){await reload(c);await eventually(()=>exists(c,'[data-action="next"]'),'restored scene');}
  if(i===10){await eventually(()=>c.evaluate('!document.querySelector("[data-action=finish]").disabled'),'ending ready',5000);await shot(c,'independence');await click(c,'[data-action="finish"]');}else await click(c,'[data-action="next"]');
 }}
 assert.equal((await state(c)).run.finished,true);assert.equal(AC.score(AD,(await state(c)).run),2200);assert.equal(await c.evaluate('document.querySelectorAll(".cause").length'),6);await shot(c,'results');
 await click(c,'.review-item summary');assert.equal(await exists(c,'[data-action="source"],.sources'),false);await click(c,'.review-item [data-action="record"]');await eventually(()=>c.evaluate('document.querySelector("#reader").open'),'historical reading');assert.equal(await c.evaluate('/D[123]:P[0-9]+|Tư liệu nhóm|Mã P|duyệt chuyên môn/.test(document.querySelector("#reader").innerText)'),false);await shot(c,'historical-reading');await key(c,'Escape');
 const before=JSON.stringify((await state(c)).run);await click(c,'.review-item [data-action="practice"]');await taskWork(c,AD.scenes[0].tasks[0]);await taskWork(c,AD.scenes[0].tasks[1]);await click(c,'[data-action="next"]');assert.equal(JSON.stringify((await state(c)).run),before,'practice modified score/history');
 await click(c,'[data-action="filter"][data-value="all"]');await c.call('Emulation.setDeviceMetricsOverride',{width:390,height:844,deviceScaleFactor:1,mobile:true});
 for(let i=0;i<10;i++){await click(c,`.review-item:has([data-scene="${i}"]) summary`);await click(c,`.review-item[open] [data-action="practice"][data-scene="${i}"]`);await assertNoOverlap(c);assert.equal(await c.evaluate('document.documentElement.scrollWidth>innerWidth'),false);await shot(c,'mobile-scene-'+(i+1));await click(c,'[data-action="back-results"]');}
 const m=await newPage(endpoint,390,844);await navigate(m,BASE+'/');await shot(m,'mobile-home');assert.equal(await m.evaluate('document.querySelector(".title-screen .primary").getBoundingClientRect().bottom>document.querySelector(".stage").getBoundingClientRect().bottom'),false);await navigate(m,GAME);await click(m,'[data-action="begin"]');await assertNoOverlap(m);await shot(m,'mobile-start');await taskWork(m,AD.scenes[0].tasks[0]);
 const p=await rectangle(m,'[data-task="roots-restore"]');await m.call('Emulation.setTouchEmulationEnabled',{enabled:true,maxTouchPoints:1});await m.call('Input.dispatchTouchEvent',{type:'touchStart',touchPoints:[{x:p.x,y:p.y,id:0}]});await delay(250);await m.call('Input.dispatchTouchEvent',{type:'touchCancel',touchPoints:[]});assert.equal((await state(m)).run.scenes.roots.events.length,1,'cancelled touch recorded attempt');await m.call('Emulation.setTouchEmulationEnabled',{enabled:false});await taskWork(m,AD.scenes[0].tasks[1]);await click(m,'[data-action="next"]');await click(m,'[data-action="begin"]');await assertNoOverlap(m);await shot(m,'mobile-voices');await click(m,'[data-action="help"]');await shot(m,'mobile-help');assert.equal(await m.evaluate('document.documentElement.scrollWidth>innerWidth'),false);
 await m.call('Emulation.setDeviceMetricsOverride',{width:360,height:780,deviceScaleFactor:1,mobile:true});assert.equal(await m.evaluate('document.documentElement.scrollWidth>innerWidth'),false);await key(m,'Escape');await assertNoOverlap(m);
 assert.deepEqual(runtimeErrors,[]);assert.deepEqual(failedLocalRequests,[]);console.log(reviewOnly?'PASS: review-only fixtures, historical reading, practice isolation, all ten interactive mobile scenes and cancelled touch.':'PASS: 11 scenes, gathering/carrying/holding, keyboard, cancel touch, timing/help pause, missed retry zero points, 2200/2400, persistence, historical reading, independent practice and mobile layouts.');
}catch(e){if(c)await shot(c,'failure').catch(()=>{});console.error(e);process.exitCode=1;}finally{await cleanup();}})();



