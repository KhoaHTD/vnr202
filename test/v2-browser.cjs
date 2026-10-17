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
  await eventually(() => client.evaluate("document.readyState === 'complete' && !!window.GameDebug && !!document.querySelector('#app > :not(.loading)')"), 'game page initialized', 15000);
}

async function reload(client) {
  const loaded = client.nextEvent('Page.loadEventFired');
  await client.call('Page.reload');
  await loaded;
}

const exists = (client, selector) => client.evaluate(`!!document.querySelector(${quote(selector)})`);
const state = client => client.evaluate('window.GameDebug.state()');
const view = client => client.evaluate('window.GameDebug.view()');

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

async function dismissReader(client) {
  if (await client.evaluate("!!document.querySelector('#reader[open]')")) await click(client, '#reader-close');
}

async function enterPlay(client) {
  for (let i = 0; i < 5; i++) {
    await dismissReader(client);
    if (await exists(client, '.game-heading')) return;
    if (await exists(client, '[data-action="next-chapter"]')) await click(client, '[data-action="next-chapter"]');
    else if (await exists(client, '[data-action="begin"]')) await click(client, '[data-action="begin"]');
    else await delay(100);
  }
  await eventually(() => exists(client, '.game-heading'), 'play screen after chapter introduction');
}

async function pickPlace(client, cardId, targetId, keyboard = false) {
  const activate = keyboard ? keyboardActivate : click;
  await activate(client, `button[data-card-pick="${cardId}"]`);
  await activate(client, `button[data-target="${targetId}"]`);
  await eventually(async () => {
    const run = await state(client);
    return run.scenes[run.currentSceneId]?.placements[targetId] === cardId;
  }, `${cardId} placed at ${targetId}`);
}

async function drag(client, cardId, targetId, miss = false) {
  // Desktop workbench keeps tray and targets together; read both positions only
  // after bringing their shared workbench into view.
  await client.evaluate("document.querySelector('.workbench').scrollIntoView({block:'center',behavior:'instant'})");
  const positions = await client.evaluate(`(() => {
    const point = selector => {const r=document.querySelector(selector).getBoundingClientRect();return {x:r.x+r.width/2,y:r.y+r.height/2};};
    return {from:point(${quote(`button[data-card-pick="${cardId}"]`)}), to:${miss ? '{x:12,y:150}' : `point(${quote(`button[data-target="${targetId}"]`)})`}};
  })()`);
  const { from, to } = positions;
  await client.call('Input.dispatchMouseEvent', { type: 'mouseMoved', x: from.x, y: from.y });
  await client.call('Input.dispatchMouseEvent', { type: 'mousePressed', x: from.x, y: from.y, button: 'left', buttons: 1, clickCount: 1 });
  for (let i = 1; i <= 16; i++) {
    await client.call('Input.dispatchMouseEvent', { type: 'mouseMoved', x: from.x + (to.x - from.x) * i / 16, y: from.y + (to.y - from.y) * i / 16, button: 'left', buttons: 1 });
    await delay(18);
  }
  await client.call('Input.dispatchMouseEvent', { type: 'mouseReleased', x: to.x, y: to.y, button: 'left', buttons: 0, clickCount: 1 });
  // Let the controller's post-drag synthesized-click suppression expire before
  // sending a distinct click gesture in the next assertion.
  await delay(380);
}

function assignment(scene, outcomes, locked = {}) {
  const answer = {};
  function search(index, used) {
    if (index === scene.targets.length) return true;
    const target = scene.targets[index];
    for (const card of scene.cards) {
      if (used.has(card.id) || (locked[target.id] && locked[target.id] !== card.id)) continue;
      if (scene.evaluations.find(e => e.targetId === target.id && e.cardId === card.id).outcome !== outcomes[index]) continue;
      answer[target.id] = card.id;
      if (search(index + 1, new Set([...used, card.id]))) return true;
    }
    return false;
  }
  assert.ok(search(0, new Set()), `No assignment for ${scene.id}: ${outcomes}`);
  return answer;
}

async function screenshot(client, name) {
  if (!process.env.GAME_QA_DIR) return;
  const directory = path.resolve(process.env.GAME_QA_DIR);
  fs.mkdirSync(directory, { recursive: true });
  const result = await client.call('Page.captureScreenshot', { format: 'png', captureBeyondViewport: true });
  fs.writeFileSync(path.join(directory, name + '.png'), Buffer.from(result.data, 'base64'));
}

async function noOverflow(client, label) {
  const layout = await client.evaluate('({scroll:document.documentElement.scrollWidth,width:innerWidth})');
  assert.ok(layout.scroll <= layout.width + 1, `${label}: horizontal overflow (${layout.scroll}/${layout.width})`);
}

async function desktopJourney(endpoint) {
  const client = await newPage(endpoint, 1440, 1100);
  await navigate(client, BASE + '/index.html');
  assert.equal(await exists(client, '.home-hero a[href="hanh-trinh.html"]'), true);
  await noOverflow(client, 'Desktop landing');
  await screenshot(client, 'landing-1440');
  await click(client, '.home-hero a[href="hanh-trinh.html"]');
  await eventually(() => exists(client, '[data-action="begin"]'), 'first chapter introduction');
  await enterPlay(client);
  await screenshot(client, 'play-1440');

  for (const [index, scene] of data.scenes.entries()) {
    await enterPlay(client);
    assert.equal((await state(client)).currentSceneId, scene.id);
    const initial = assignment(scene, index === 1 ? ['suitable', 'needs-review'] : ['suitable', 'suitable']);
    const [a, b] = scene.targets.map(target => target.id);
    if (index === 0) {
      assert.equal(await client.evaluate('document.querySelector("#commit").disabled'), true);
      await drag(client, initial[a], a);
      await eventually(async () => (await state(client)).scenes[scene.id].placements[a] === initial[a], 'real mouse drag placement');
      checks.push('real CDP mouse drag places a card');
      const beforeMiss = JSON.stringify((await state(client)).scenes[scene.id]);
      await drag(client, initial[b], b, true);
      assert.equal(JSON.stringify((await state(client)).scenes[scene.id]), beforeMiss, 'Missed drop changed logical state');
      checks.push('dropping outside targets preserves arrangement and score');
      await pickPlace(client, initial[b], b);
      await pickPlace(client, initial[a], b);
      assert.equal((await state(client)).scenes[scene.id].placements[a], initial[b], 'Occupied targets did not swap');
      await pickPlace(client, initial[a], a);
      assert.deepEqual((await state(client)).scenes[scene.id].placements, initial);
      const snapshot = (await state(client)).scenes[scene.id];
      await reload(client);
      await eventually(() => exists(client, '.game-heading'), 'resume arranged scene after reload');
      assert.deepEqual((await state(client)).scenes[scene.id], snapshot, 'Reload lost placements or card order');
      checks.push('swap and reload preserve layout, shuffled order and unsubmitted state');
    } else for (const [targetId, cardId] of Object.entries(initial)) await pickPlace(client, cardId, targetId);
    await click(client, '#commit');
    await eventually(async () => (await state(client)).scenes[scene.id].submissions.length === 1, `first submission ${scene.id}`);
    if (index === 1) {
      const run = await state(client), slot = run.scenes[scene.id].slots[a];
      assert.equal(slot.firstOutcome, 'suitable');
      assert.equal(run.scenes[scene.id].slots[b].firstOutcome, 'needs-review');
      assert.equal(await client.evaluate(`document.querySelector('button[data-target="${a}"]').disabled`), true);
      assert.equal(await client.evaluate(`document.querySelector('button[data-card-pick="${initial[a]}"]').disabled`), true);
      assert.equal(await client.evaluate('document.querySelector("#commit").disabled'), true, 'Repeated unchanged submission remains enabled');
      await screenshot(client, 'mixed-feedback-1440');
      await click(client, `[data-feedback="${b}"] [data-action="why"]`);
      await eventually(() => exists(client, '#reader[open]'), 'contextual explanation dialog');
      const explanation = await client.evaluate('document.querySelector("#reader-content").textContent');
      const expected = scene.evaluations.find(e => e.targetId === b && e.cardId === initial[b]);
      assert.ok(explanation.includes(expected.reasonDetail), 'Why dialog does not explain the actual chosen pair');
      await screenshot(client, 'explanation-1440');
      await dismissReader(client);
      const solution = assignment(scene, ['suitable', 'suitable'], { [a]: initial[a] });
      await pickPlace(client, solution[b], b);
      await click(client, '#commit');
      await eventually(async () => (await state(client)).scenes[scene.id].submissions.length === 2, 'adjusted submission');
      assert.equal(core.score(data, await state(client)), 35);
      checks.push('specific explanation, locked suitable task, duplicate guard and 5-point correction');
    }
    const beforeNext = await state(client);
    assert.equal(beforeNext.scenes[scene.id].slots[a].finalOutcome, 'suitable');
    assert.equal(beforeNext.scenes[scene.id].slots[b].finalOutcome, 'suitable');
    await click(client, '#commit');
    if (index < data.scenes.length - 1) await eventually(async () => (await state(client)).currentSceneId !== scene.id, `advance from ${scene.id}`);
  }
  await eventually(() => exists(client, '.result-header'), 'final results after 9 scenes');
  const finished = await state(client), totals = core.summary(data, finished);
  assert.equal(finished.finished, true);
  assert.equal(totals.score, 175);
  assert.equal(totals.firstSuitable, 17);
  assert.equal(totals.corrected, 1);
  assert.equal(totals.reviewCount, 1);
  assert.ok((await client.evaluate('document.querySelector(".result-score").textContent')).replace(/\s/g, '').startsWith('175/180'));
  await screenshot(client, 'results-1440');
  await click(client, '[data-action="review"]');
  await eventually(() => exists(client, '.review-list'), 'review after results');
  assert.equal(await client.evaluate('document.querySelectorAll("[data-review-item]").length'), 1);
  await click(client, '[data-review-item] > summary');
  const reviewText = await client.evaluate('document.querySelector(".review-body").textContent');
  assert.ok(reviewText.includes('Vì sao lựa chọn ban đầu chưa phù hợp?'));
  assert.ok(reviewText.includes('Cách đáp ứng nhiệm vụ'));
  await screenshot(client, 'review-1440');
  const unchanged = JSON.stringify(await state(client));
  await click(client, '[data-action="practice"]');
  await eventually(() => exists(client, '.practice-banner'), 'practice started separately');
  const practiceScene = data.scenes.find(scene => scene.id === 's02');
  for (const [targetId, cardId] of Object.entries(assignment(practiceScene, ['suitable', 'suitable']))) await pickPlace(client, cardId, targetId);
  await click(client, '#commit');
  await click(client, '#commit');
  await eventually(() => exists(client, '.review-list'), 'return from completed practice');
  assert.equal(JSON.stringify(await state(client)), unchanged, 'Practice changed the scored run');
  checks.push('all9 scenes complete at175/180; initial-choice review persists after correction; practice preserves original score');
  await reload(client);
  await eventually(() => exists(client, '.result-header'), 'finished results restored after reload');
  assert.equal(core.score(data, await state(client)), 175);
  assert.equal(await view(client), 'results');
  checks.push('finished session restores results');
  return client;
}

async function mobileKeyboard(endpoint) {
  const client = await newPage(endpoint, 390, 844);
  await navigate(client, BASE + '/index.html');
  await noOverflow(client, '390px landing');
  await screenshot(client, 'landing-390');
  await click(client, '.home-hero a[href="hanh-trinh.html"]');
  await eventually(() => exists(client, '[data-action="begin"]'), 'mobile chapter introduction');
  await enterPlay(client);
  await noOverflow(client, '390px play');
  const scene = data.scenes[0], initial = assignment(scene, ['suitable', 'suitable']);
  const [a, b] = scene.targets.map(target => target.id);
  // A cancelled native touch gesture must leave no ghost or logical placement.
  await client.call('Emulation.setTouchEmulationEnabled', { enabled: true, maxTouchPoints: 1 });
  const beforeCancel = JSON.stringify(await state(client));
  const origin = await rectangle(client, `button[data-card-pick="${initial[a]}"]`);
  await client.call('Input.dispatchTouchEvent', { type: 'touchStart', touchPoints: [{ x: origin.x, y: origin.y, id: 0 }] });
  await client.call('Input.dispatchTouchEvent', { type: 'touchMove', touchPoints: [{ x: origin.x + 24, y: origin.y - 24, id: 0 }] });
  await eventually(() => exists(client, '.drag-ghost'), 'touch starts a visible drag gesture', 2000);
  await client.call('Input.dispatchTouchEvent', { type: 'touchCancel', touchPoints: [] });
  assert.equal(JSON.stringify(await state(client)), beforeCancel, 'Cancelled touch changed logical state');
  assert.equal(await exists(client, '.drag-ghost'), false, 'Cancelled touch left a drag ghost');
  await client.call('Emulation.setTouchEmulationEnabled', { enabled: false });
  await keyboardActivate(client, `button[data-card-pick="${initial[a]}"]`);
  await key(client, 'Escape');
  assert.equal(await client.evaluate('document.querySelectorAll("[data-card-pick][aria-pressed=true]").length'), 0, 'Escape did not cancel selection');
  await pickPlace(client, initial[a], a, true);
  // Exercise Space as well as Enter on native buttons.
  await keyboardActivate(client, `button[data-card-pick="${initial[b]}"]`, ' ');
  await keyboardActivate(client, `button[data-target="${b}"]`, ' ');
  assert.deepEqual((await state(client)).scenes[scene.id].placements, initial);
  await keyboardActivate(client, '#commit');
  await eventually(async () => core.score(data, await state(client)) === 20, 'keyboard-only matching and submission');
  await noOverflow(client, '390px feedback');
  await screenshot(client, 'feedback-390');
  await click(client, '[data-feedback] [data-action="why"]');
  await noOverflow(client, '390px explanation');
  await screenshot(client, 'explanation-390');
  await dismissReader(client);
  const missingLabels = await client.evaluate("[...document.querySelectorAll('button')].filter(b=>b.offsetParent&&!b.textContent.trim()&&!b.getAttribute('aria-label')).length");
  assert.equal(missingLabels, 0, 'Visible icon button lacks an accessible name');
  await client.call('Emulation.setDeviceMetricsOverride', { width: 360, height: 780, deviceScaleFactor: 1, mobile: true });
  await noOverflow(client, '360px feedback');
  await client.call('Emulation.setDeviceMetricsOverride', { width: 1440, height: 900, deviceScaleFactor: 1, mobile: false });
  await client.call('Emulation.setPageScaleFactor', { pageScaleFactor: 2 });
  await noOverflow(client, '200% page-scale desktop');
  checks.push('390/360px layouts, native touch cancellation, keyboard Enter/Space/Escape, labelled icon buttons and reduced-motion playback');
  return client;
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

(async () => {
  try {
    await ensureServer();
    const endpoint = await launchBrowser();
    await desktopJourney(endpoint);
    await mobileKeyboard(endpoint);
    assert.deepEqual(runtimeErrors, [], 'Browser runtime exceptions');
    assert.deepEqual([...new Set(failedLocalRequests)], [], 'Missing local assets');
    console.log('PASS: ' + checks.join('; ') + '; no runtime exceptions or missing local assets.');
    console.log('Touchscreen hardware and human playtesting are not covered by this automated run.');
  } catch (error) {
    if (owned.clients.length) await screenshot(owned.clients.at(-1), 'failure').catch(() => {});
    console.error('FAIL:', error.stack || error.message || error);
    process.exitCode = 1;
  } finally { await cleanup(); }
})().catch(error => { console.error(error); process.exitCode = 1; });
