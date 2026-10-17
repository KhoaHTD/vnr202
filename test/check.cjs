// Kiểm tra trong trình duyệt thật qua Chrome DevTools Protocol.
// Cần server đang chạy (node server.cjs) và Chrome mở cổng gỡ lỗi 9223.
// Nếu chưa có Chrome ở cổng 9223, script tự mở Chrome headless (đường dẫn macOS) rồi đóng lại khi xong.
const fs=require('node:fs'),os=require('node:os'),path=require('node:path'),{spawn}=require('node:child_process');
const PORT=9223,URL='http://localhost:5173',GAME=URL+'/hanh-trinh.html';
const CHROME='/Applications/Google Chrome.app/Contents/MacOS/Google Chrome';
const wait=ms=>new Promise(r=>setTimeout(r,ms));

async function targets(){try{return await(await fetch(`http://127.0.0.1:${PORT}/json`)).json();}catch{return null;}}

(async()=>{
  let chrome=null,list=await targets();
  if(!list){
    chrome=spawn(CHROME,['--headless=new','--disable-gpu','--no-first-run',`--remote-debugging-port=${PORT}`,`--user-data-dir=${fs.mkdtempSync(path.join(os.tmpdir(),'chk-'))}`,'about:blank'],{stdio:'ignore'});
    for(let i=0;i<40&&!(list=await targets());i++)await wait(250);
  }
  const ws=new WebSocket(list.find(t=>t.type==='page').webSocketDebuggerUrl);await new Promise(r=>ws.onopen=r);
  let id=0;const pending=new Map(),errors=[];
  ws.onmessage=e=>{const d=JSON.parse(e.data);if(d.id){const p=pending.get(d.id);pending.delete(d.id);d.error?p.reject(d.error):p.resolve(d.result);}if(d.method==='Runtime.exceptionThrown')errors.push(d.params.exceptionDetails.text+' '+(d.params.exceptionDetails.exception?.description||''));};
  const call=(method,params={})=>new Promise((resolve,reject)=>{pending.set(++id,{resolve,reject});ws.send(JSON.stringify({id,method,params}));});
  const ev=async expression=>{const r=await call('Runtime.evaluate',{expression,returnByValue:true});if(r.exceptionDetails)throw Error(JSON.stringify(r.exceptionDetails));return r.result.value;};
  const click=sel=>ev(`document.querySelector(${JSON.stringify(sel)}).click()`);
  const size=(w,h)=>call('Emulation.setDeviceMetricsOverride',{width:w,height:h,deviceScaleFactor:1,mobile:w<600});
  const shot=async file=>fs.writeFileSync(file,Buffer.from((await call('Page.captureScreenshot',{captureBeyondViewport:true})).data,'base64'));
  const fail=msg=>{throw Error(msg);};

  // 1) Mọi image.src trong content.js trỏ tới file có thật
  const vm=require('node:vm'),ctx={window:{}};vm.createContext(ctx);vm.runInContext(fs.readFileSync(path.join(__dirname,'..','src','js','content.js'),'utf8'),ctx);
  const G=ctx.window.GAME_DATA,imgs=[G.endingImage,...G.chapters.map(c=>c.image),...G.scenes.map(s=>s.image),...G.records.map(r=>r[2])].filter(i=>i&&i.src);
  const missing=imgs.filter(i=>!fs.existsSync(path.join(__dirname,'..',i.src))).map(i=>i.src);
  if(missing.length)fail('Ảnh không tồn tại: '+missing.join(', '));
  const noAltData=imgs.filter(i=>!i.alt).map(i=>i.src);if(noAltData.length)fail('Ảnh thiếu alt trong content.js: '+noAltData.join(', '));

  await call('Runtime.enable');await call('Page.enable');await size(1280,900);
  // Mọi <img> đang hiển thị phải có alt; gọi ở nhiều màn khác nhau
  const altCheck=async where=>{const bad=await ev("[...document.querySelectorAll('img')].filter(i=>!i.alt&&i.closest('#app,#archive')).map(i=>i.src)");if(bad.length)fail(`Ảnh thiếu alt (${where}): `+bad.join(', '));};
  // Quy tắc 2 lớp vật liệu (vòng 6): đỏ son chỉ trên tờ bản đồ, vàng đèn chỉ trên nền phòng, chữ uốn cung có bản chữ thường
  const rules=async where=>{
    const bad=await ev(`(()=>{const out=[],ACC='rgb(138, 36, 22)',LAMP='rgb(217, 164, 65)';
      const onSheet=e=>!!e.closest('.sheet,dialog');
      for(const e of document.querySelectorAll('body *')){
        if(!e.offsetParent&&getComputedStyle(e).position!=='fixed')continue;
        const cs=getComputedStyle(e);
        const hasText=[...e.childNodes].some(n=>n.nodeType===3&&n.textContent.trim());
        if(hasText&&cs.color===ACC&&!onSheet(e))out.push('chữ đỏ son trên nền phòng: '+(e.className||e.tagName)+' "'+e.textContent.trim().slice(0,30)+'"');
        if(onSheet(e)){for(const k of ['color','backgroundColor','borderTopColor','borderLeftColor','fill','stroke'])if(cs[k]===LAMP)out.push('--lamp trên tờ bản đồ ('+k+'): '+(e.className&&e.className.baseVal!==undefined?e.className.baseVal:e.className||e.tagName));}
      }
      for(const t of document.querySelectorAll('textPath')){const svg=t.closest('svg'),sr=svg.parentElement.querySelector('.sr-only');
        if(svg.getAttribute('aria-hidden')!=='true')out.push('SVG chữ uốn cung thiếu aria-hidden');
        if(!sr||sr.textContent.trim()!==t.textContent.trim())out.push('chữ uốn cung thiếu bản chữ thường: '+t.textContent);}
      return out;})()`);
    if(bad.length)fail(`Quy tắc màu/chữ (${where}): `+bad.join(' | '));
  };
  // 2) Không có transition nào áp lên thuộc tính bố cục (cả landing lẫn trang game)
  const layoutTransitions=async page=>{await call('Page.navigate',{url:page});await wait(700);return ev(`(()=>{const bad=[],LAYOUT=/(^|[ ,])(all|width|height|top|left|right|bottom|margin[a-z-]*|padding[a-z-]*|grid-template[a-z-]*|inset|flex-basis|font-size)([ ,]|$)/;
    // Đọc cssText vì khi transition dùng var(), trình duyệt để trống transitionProperty
    let seen=0;const walk=rules=>{for(const r of rules){if(r.cssRules)walk(r.cssRules);if(!r.style)continue;
      for(const m of r.style.cssText.matchAll(/transition(?:-property)?:\\s*([^;]+)/g)){seen++;const props=m[1].split(',').map(x=>x.trim().split(/\\s+/)[0]);if(props.some(p=>LAYOUT.test(' '+p+' ')))bad.push(r.selectorText+' → '+m[1]);}}};
    for(const sh of document.styleSheets){try{walk(sh.cssRules);}catch{}}return seen?bad:['(không đọc được quy tắc transition nào)'];})()`);};
  for(const page of [URL,GAME]){const lt=await layoutTransitions(page);if(lt.length)fail('Transition trên thuộc tính bố cục ('+page+'): '+lt.join(' | '));}

  // 3) LANDING (index.html): cảnh intro.pptx (ảnh mít tinh + sao đen + cờ + THÁNG TÁM). Chữ thấy được chỉ gồm tiêu đề và nút; không còn cờ/WebGL/hiệu ứng cũ;
  //    ba họ font; chữ nghiêng chỉ ở "tháng"; nút đỏ son cao ≥ 48px; vừa trọn một màn hình ở 1440×900, 1366×768, 390×844
  //    (sau khi bỏ qua intro bằng một phím bất kỳ); 2 nút điều khiển 40px có aria; không đụng localStorage.
  const skip=()=>ev("dispatchEvent(new KeyboardEvent('keydown',{key:'x',bubbles:true}))");
  await call('Page.navigate',{url:URL});await wait(300);await ev('localStorage.clear()');
  for(const [w,h] of [[1440,900],[1366,768],[390,844]]){
    await size(w,h);await call('Page.reload');for(let k=0;k<80&&!await ev("document.readyState==='complete'&&!!document.querySelector('.hero')");k++)await wait(50);await wait(900);await skip();await wait(400);
    const L=JSON.parse(await ev(`(()=>{const q=s=>document.querySelector(s),r=s=>q(s)?.getBoundingClientRect();
      const text=q('.hero').innerText.replace(/\\s+/g,' ').trim();
      const fams=[...new Set([...document.querySelectorAll('.hero *')].filter(e=>e.offsetParent&&e.textContent.trim()&&!e.closest('svg')).map(e=>getComputedStyle(e).fontFamily.split(',')[0].replace(/["']/g,'')))];
      const italics=[...document.querySelectorAll('.hero *')].filter(e=>getComputedStyle(e).fontStyle==='italic'&&e.textContent.trim()&&!e.closest('svg')).map(e=>e.tagName.toLowerCase());
      const gone=['canvas','.flag-slot','.grain','.key-light','.red-bounce','.rule','.masthead','.eyebrow','.tagline','.hero-meta','.brand','#records','#resume','#start'].filter(s=>q(s));
      const cs=getComputedStyle(q('.cta')),oldTokens=['--bg','--ivory','--red','--emblem-yellow','--pole','--key-light'].filter(t=>getComputedStyle(document.documentElement).getPropertyValue(t).trim());
      const three=performance.getEntriesByType('resource').some(e=>/three|flags3d|yearcard/.test(e.name));
      return JSON.stringify({text,fams,italics,gone,oldTokens,three,img:!!q('.backdrop img[alt]')&&q('.backdrop img').alt.length>10,href:q('.cta').getAttribute('href'),ctaBg:cs.backgroundColor,ctaRadius:parseFloat(cs.borderTopLeftRadius),cta:r('.cta'),title:r('.title'),ctrl:[...document.querySelectorAll('.controls button')].map(b=>[Math.round(b.offsetWidth),b.getAttribute('aria-label'),b.getAttribute('aria-pressed')]),ls:localStorage.length,vh:innerHeight,sx:document.documentElement.scrollWidth>innerWidth});})()`));
    const where=`landing ${w}×${h}`;
    if(!/^Đường đến\s+tháng Tám\s+Bắt đầu hành trình$/i.test(L.text))fail(`${where}: nội dung landing sai: "${L.text}"`);
    if(!L.img||L.href!=='hanh-trinh.html')fail(`${where}: thiếu ảnh có alt hoặc nút không trỏ tới hanh-trinh.html`);
    if(L.gone.length)fail(`${where}: còn phần đã xoá: ${L.gone}`);
    if(L.oldTokens.length||L.three)fail(`${where}: còn token/mã của bản cũ: ${L.oldTokens} ${L.three}`);
    if(L.fams.some(f=>!['Newsreader','Be Vietnam Pro','Space Mono'].includes(f)))fail(`${where}: font ngoài 3 họ: ${L.fams}`);
    if(!L.italics.includes('em'))fail(`${where}: "tháng" phải nghiêng`);
    if(L.cta.height<48)fail(`${where}: nút < 48px`);
    if(L.ctaBg!=='rgb(138, 36, 22)'||L.ctaRadius>2)fail(`${where}: nút phải đỏ son, bo ≤ 2px: ${L.ctaBg} ${L.ctaRadius}px`);
    if(L.cta.bottom>L.vh||L.title.top<0||L.title.left<0||L.title.right>w+1)fail(`${where}: tiêu đề + nút không nằm trọn màn hình đầu (nút đáy ${Math.round(L.cta.bottom)} / ${L.vh}, tiêu đề ${Math.round(L.title.left)}–${Math.round(L.title.right)})`);
    if(L.ctrl.length!==2||L.ctrl.some(([s,l,p])=>s!==40||!l||!p))fail(`${where}: 2 nút điều khiển phải 40px, có aria-label và aria-pressed: ${JSON.stringify(L.ctrl)}`);
    if(L.ls)fail(`${where}: landing không được ghi localStorage`);
    if(L.sx)fail(`${where}: cuộn ngang`);
  }
  await size(1280,900);

  // 4) TRANG GAME (hanh-trinh.html): vào thẳng màn mở chương 1, không đọc/ghi tiến độ
  await call('Page.navigate',{url:GAME});await wait(700);
  await rules('màn mở chương');
  if(await ev("!!document.querySelector('.sheet')"))fail('Màn mở chương chưa có tờ bản đồ');
  if(!await ev("!!document.querySelector('.chapter-intro')"))fail('Thiếu màn mở chương 1');
  await click('#chapter-go');

  for(let i=0;i<9;i++){
    if(i===2||i===4){await click('[data-good="false"]');if(!await ev("document.querySelector('.check .stamp')?.textContent==='Chưa đúng'"))fail('Thiếu dấu CHƯA ĐÚNG');await click('#next');await wait(100);await click('#chapter-go');}
    await wait(1100); // chờ hiệu ứng trượt vào xong
    if(i===0){await rules('màn chơi');if(!await ev("!!document.querySelector('.sheet')&&!document.getElementById('strip').hidden"))fail('Màn chơi thiếu tờ bản đồ hoặc dải lực lượng');const comp=await ev("document.getElementById('compass-btn').getAttribute('aria-label')");if(!/trên 4 điều kiện/.test(comp))fail('La bàn thiếu aria-label: '+comp);await click('#compass-btn');if(await ev("document.getElementById('compass-panel').hidden"))fail('Bấm la bàn không mở bảng 4 hướng');await click('#compass-btn');if(await ev("document.querySelectorAll('.route-item.is-now').length")!==1)fail('Tuyến phải có đúng 1 mốc đang ở');}
    await click('[data-card="0"]');await click('[data-card="1"]');
    // Thẻ thứ 3 không được làm mờ khi đã chọn đủ 2 thẻ
    if(await ev("getComputedStyle(document.querySelector('[data-card=\"2\"]')).opacity")!=='1')fail('Thẻ thứ 3 bị làm mờ');
    if(i===7){
      await click('[data-card="1"]');await click('[data-card="2"]');
      if(await ev("!!document.querySelector('.stamp')"))fail('Thẻ bẫy bị lộ trước khi triển khai');
      await click('#commit');await wait(400);
      if(!await ev("document.querySelector('[data-card=\"2\"] .stamp')?.textContent.includes('Sai lầm')"))fail('Thiếu dấu SAI LẦM LỊCH SỬ');
      if(!await ev("document.getElementById('feedback').textContent.includes('Đảng đã chọn khác')"))fail('Thiếu phản hồi chọn sai');
      await size(360,780);await shot(path.join(__dirname,'..','archive','mobile-check.png'));await size(1280,900);
      await click('#commit'); // Xem lại và chọn lại
      await click('[data-card="0"]');await click('[data-card="1"]');
    }
    await click('#commit');await wait(150);
    if(i===0){
      if(!await ev("!!document.querySelector('.deltas .delta')"))fail('Thiếu nhãn thay đổi chỉ số');
      // Ở 360px: không cuộn ngang, vùng bấm ≥ 44px, chữ thân ≥ 16px
      await size(360,780);await wait(200);
      if(await ev('document.documentElement.scrollWidth>innerWidth'))fail('Cuộn ngang ở 360px');
      const small=await ev("[...document.querySelectorAll('button')].filter(b=>b.offsetParent&&(b.getBoundingClientRect().height<44||b.getBoundingClientRect().width<44)).map(b=>b.id||b.className||b.textContent.trim().slice(0,20))");
      if(small.length)fail('Vùng bấm < 44px: '+small.join(', '));
      const tiny=await ev("[...document.querySelectorAll('.briefing p,.feedback p:not(.deltas)')].filter(p=>parseFloat(getComputedStyle(p).fontSize)<16).length");
      if(tiny)fail('Chữ thân < 16px');
      await size(1280,900);
    }
    await click('#commit');await wait(150); // tiếp tục
  }
  const progress=await ev("JSON.parse(JSON.stringify(GameDebug.state()))");
  if(await ev('localStorage.length'))fail('Trang game không được ghi localStorage');
  if(progress.history.length!==9||!progress.finished)fail('Chưa đi hết hành trình');
  if(JSON.stringify(progress.mistakes)!=='["7-2"]')fail('state.mistakes sai: '+JSON.stringify(progress.mistakes));
  await wait(400);await altCheck('màn kết');await rules('màn kết');
  if(await ev("document.querySelectorAll('.route-item.is-done').length")!==9)fail('Màn kết: tuyến 9 chặng phải sáng đủ');
  if(!await ev("!!document.querySelector('.compass-label')"))fail('Màn kết: la bàn phải chỉ Tháng Tám');
  await shot(path.join(__dirname,'..','archive','end-check.png'));
  await click('#records');if(!await ev("document.getElementById('archive').open"))fail('Không mở được hồ sơ');
  await ev("document.querySelectorAll('#archive details').forEach(d=>d.open=true)");await altCheck('hồ sơ');
  if(errors.length)fail(errors.join(';'));
  console.log('PASS: landing intro.pptx (nội dung đúng, không còn cờ/WebGL/hiệu ứng cũ, 3 họ font, nút đỏ son ≥ 48px, vừa 1 màn hình ở 1440×900/1366×768/390×844, 2 nút điều khiển 40px có aria, không localStorage); game vào thẳng chương 1, không lưu tiến độ; 2 lớp vật liệu (không chữ đỏ son trên nền phòng, không --lamp trên tờ bản đồ, chữ uốn cung có bản chữ thường); tuyến 9 chặng; la bàn; ảnh trong content.js có thật và có alt; mọi <img> có alt; không có transition trên thuộc tính bố cục; 9 chặng, màn mở chương, thẻ bẫy chỉ lộ sau khi triển khai, chọn lại ở chặng 8, mistakes, dấu CHƯA ĐÚNG, nhãn chỉ số, 360px (không cuộn ngang, vùng bấm ≥ 44px, chữ thân ≥ 16px), hồ sơ, không lỗi runtime');
  ws.close();if(chrome)chrome.kill();else await call('Browser.close').catch(()=>{});
})().catch(e=>{console.error(e);process.exit(1);});
