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
    if(L.fams.some(f=>!['Playfair Display','Lora'].includes(f)))fail(`${where}: font ngoài 3 họ: ${L.fams}`);
    if(!L.italics.includes('em'))fail(`${where}: "tháng" phải nghiêng`);
    if(L.cta.height<48)fail(`${where}: nút < 48px`);
    if(L.ctaBg!=='rgb(138, 36, 22)'||L.ctaRadius>2)fail(`${where}: nút phải đỏ son, bo ≤ 2px: ${L.ctaBg} ${L.ctaRadius}px`);
    if(L.cta.bottom>L.vh||L.title.top<0||L.title.left<0||L.title.right>w+1)fail(`${where}: tiêu đề + nút không nằm trọn màn hình đầu (nút đáy ${Math.round(L.cta.bottom)} / ${L.vh}, tiêu đề ${Math.round(L.title.left)}–${Math.round(L.title.right)})`);
    if(L.ctrl.length!==2||L.ctrl.some(([s,l,p])=>s!==40||!l||!p))fail(`${where}: 2 nút điều khiển phải 40px, có aria-label và aria-pressed: ${JSON.stringify(L.ctrl)}`);
    if(L.ls)fail(`${where}: landing không được ghi localStorage`);
    if(L.sx)fail(`${where}: cuộn ngang`);
  }
  await size(1280,900);

  // 4) TRANG GAME (hanh-trinh.html): ghép tình huống – sự kiện. Vào thẳng màn mở chương 1, không đọc/ghi tiến độ.
  await call('Page.navigate',{url:GAME});await wait(700);
  await rules('màn mở chương');
  if(await ev("!!document.querySelector('.sheet')"))fail('Màn mở chương chưa có tờ bản đồ');
  if(!await ev("!!document.querySelector('.chapter-intro')&&!!document.getElementById('mode-class')"))fail('Thiếu màn mở chương 1 hoặc công tắc Lớp học');
  await ev("window.__go=async(i)=>{const D=GAME_DATA,q=s=>document.querySelector(s),w=ms=>new Promise(r=>setTimeout(r,ms));const st=GameDebug.state().stages[i];for(const sl of D.scenes[i].slots){if(st[sl.id].locked)continue;q('.ev[data-card=\"'+sl.correct+'\"]').click();await w(40);q('.slot-drop[data-place=\"'+sl.id+'\"]').click();await w(40);}};window.__put=async(slot,card)=>{const q=s=>document.querySelector(s),w=ms=>new Promise(r=>setTimeout(r,ms));q('.ev[data-card=\"'+card+'\"]').click();await w(40);q('.slot-drop[data-place=\"'+slot+'\"]').click();await w(40);}");
  await click('#chapter-go');

  for(let i=0;i<9;i++){
    if(i===2||i===4){await click('#next');await wait(150);await click('#chapter-go');}
    await wait(1100); // chờ hiệu ứng trượt vào xong
    if(process.env.DBG)console.log('loop',i,await ev("GameDebug.state().index+' '+document.querySelectorAll('.ev').length+' '+!!document.querySelector('.chapter-break')"));
    const st=()=>ev("JSON.parse(JSON.stringify(GameDebug.state().stages["+i+"]))");
    if(i===0){
      await rules('màn chơi');
      await click('#more');if(await ev("document.querySelectorAll('#archive details').length")!==1)fail('Hồ sơ giai đoạn phải chỉ có hồ sơ của chặng hiện tại');
      await ev("document.getElementById('archive').close()");
      await click('#records');if(await ev("document.querySelectorAll('#archive details').length")!==1)fail('Chặng 1: hồ sơ lịch sử không được lộ các giai đoạn sau');
      await ev("document.getElementById('archive').close()");
      if(!await ev("!!document.querySelector('.sheet')&&!document.getElementById('strip').hidden"))fail('Màn chơi thiếu tờ bản đồ hoặc dải album');
      if(await ev("document.querySelectorAll('.ev').length")!==4||await ev("document.querySelectorAll('.slot[data-slot]').length")!==2||await ev("document.querySelectorAll('button.spot').length")!==2)fail('Chặng phải có 4 thẻ, 2 ô, 2 điểm nóng');
      if(await ev("document.getElementById('commit').disabled")!==true)fail('Triển khai phải tắt khi chưa đặt đủ thẻ');
      // sai ở ô A bằng thẻ nhiễu (đặt bằng chạm chọn rồi chạm ô), đúng ở ô B
      await ev("(async()=>{const s=GAME_DATA.scenes[0];await __put('A',s.cards.find(c=>!c.slot).id);await __put('B',s.slots[1].correct);})()");await wait(400);
      await click('#commit');await wait(300);
      const t1=await ev("document.querySelector('.slot[data-slot=\"A\"]').innerText+' '+(document.querySelector('#hints [data-hint-row=\"A\"]')?.innerText||'')");
      if(!/Chưa phù hợp/i.test(t1)||!/năm/.test(t1))fail('Gợi ý nấc 1 thiếu: '+t1);
      if(!await ev("document.querySelector('.slot[data-slot=\"B\"]').classList.contains('is-locked')"))fail('Ô đúng phải khóa');
      if(await ev("document.querySelectorAll('.tray .ev').length")!==3)fail('Thẻ nhiễu phải quay về rổ');
      await ev("document.querySelector('[data-retry=\"A\"]').click()");
      await ev("__put('A',GAME_DATA.scenes[0].slots[0].correct)");await wait(200);
    }else if(i===1){
      await click('#skip');await wait(300);
    }else if(i===2){ // sai 3 lần bằng cách đặt chéo hai thẻ đúng → nấc 1, nấc 2, nấc 3 (hiện đáp án)
      for(let k=0;k<3;k++){
        await ev("(async()=>{const s=GAME_DATA.scenes[2];const open=['A','B'].filter(id=>!GameDebug.state().stages[2][id].locked);const d=s.cards.filter(c=>!c.slot&&!document.querySelector('.tray .ev[data-card=\""+"'+c.id+'"+"\"]')?.classList.contains('is-faded'));for(const id of open){const c=(d.shift()||s.cards.find(c=>c.slot&&c.slot!==id));await __put(id,c.id);}})()");await wait(300);
        await click('#commit');await wait(300);
        if(k===1&&!await ev("document.querySelectorAll('.tray .ev.is-faded').length>=1"))fail('Nấc 2 phải làm mờ thẻ nhiễu');
      }
      const s2=await st();
      if(s2.A.how!=='revealed'||s2.A.pts!==0)fail('Nấc 3 phải hiện đáp án 0 điểm: '+JSON.stringify(s2.A));
      if(!await ev("!!document.querySelector('[data-why=\"A\"]')"))fail('Thiếu nút Vì sao?');
    }else{
      await ev("__go("+i+")");await wait(700);
    }
    if(!await ev("GameDebug.state().stages["+i+"].A.locked&&GameDebug.state().stages["+i+"].B.locked")){await click('#commit');await wait(1300);}
    if(process.env.DBG)console.log('after',i,await ev("JSON.stringify(GameDebug.state().stages["+i+"])"));
    if(i===0){
      await wait(900);
      if(!await ev("!!document.querySelector('.spot.is-lit')"))fail('Đúng mà cảnh không đổi (thiếu điểm nóng sáng)');
      if(await ev("document.querySelector('.ab--ok,.ab--weak')===null"))fail('Thẻ đúng chưa vào album');
      // Ở 360px: không cuộn ngang, vùng bấm ≥ 44px, chữ thân ≥ 16px
      await size(360,780);await wait(300);
      if(await ev('document.documentElement.scrollWidth>innerWidth'))fail('Cuộn ngang ở 360px');
      const small=await ev("[...document.querySelectorAll('button')].filter(b=>b.offsetParent&&(b.getBoundingClientRect().height<44||b.getBoundingClientRect().width<44)).map(b=>b.id||b.className||b.textContent.trim().slice(0,20))");
      if(small.length)fail('Vùng bấm < 44px: '+small.join(', '));
      const tiny=await ev("[...document.querySelectorAll('.brief,.slot-situation,.feedback p,.hint-text p')].filter(p=>p.offsetParent&&parseFloat(getComputedStyle(p).fontSize)<16).map(p=>p.className)");
      if(tiny.length)fail('Chữ thân < 16px: '+tiny.join(','));
      await shot(path.join(__dirname,'..','archive','mobile-check.png'));await size(1280,900);await wait(200);
    }
    await click('#commit');await wait(150); // tiếp tục (khi đã xong chặng)
  }
  await wait(1700);
  const run=await ev("JSON.parse(JSON.stringify(GameDebug.state()))");
  if(await ev('localStorage.length'))fail('Trang game không được ghi localStorage');
  if(!run.finished)fail('Chưa đi hết hành trình');
  const shown=await ev("document.getElementById('final-score').textContent");
  if(shown!=='135')fail('Điểm cuối phải 135 (5 + 10 + 0 + 0 + 120), thấy '+shown);
  if(await ev("document.querySelectorAll('.review li').length")!==5)fail('Danh sách cần ôn phải có 5 mục');
  if(await ev("document.querySelectorAll('.tl-list--full li').length")!==18)fail('Album cuối phải có 18 thẻ');
  await altCheck('màn kết');await rules('màn kết');
  if(await ev("document.querySelectorAll('.route-item.is-done').length")!==9)fail('Màn kết: tuyến 9 chặng phải sáng đủ');
  await shot(path.join(__dirname,'..','archive','end-check.png'));
  await click('#end-records');if(!await ev("document.getElementById('archive').open&&document.querySelectorAll('#archive details').length===9"))fail('Màn kết: phải mở đủ 9 hồ sơ');
  await ev("document.querySelectorAll('#archive details').forEach(d=>d.open=true)");await altCheck('hồ sơ');
  await ev("document.getElementById('archive').close()");

  // 5) CHẾ ĐỘ LỚP HỌC (?mode=class): thẻ đánh số 1–4, sai không tự gợi ý (MC bấm), phiếu ghi điểm
  await call('Page.navigate',{url:GAME+'?mode=class'});await wait(900);
  if(await ev("document.body.dataset.mode")!=='class')fail('?mode=class không bật chế độ Lớp học');
  await ev("window.__put=async(slot,card)=>{const q=s=>document.querySelector(s),w=ms=>new Promise(r=>setTimeout(r,ms));q('.ev[data-card=\"'+card+'\"]').click();await w(40);q('.slot-drop[data-place=\"'+slot+'\"]').click();await w(40);}");
  await click('#chapter-go');await wait(1300);
  const nums=await ev("[...document.querySelectorAll('.tray .ev-n')].map(e=>e.textContent).join('')");
  if(nums!=='1234')fail('Thẻ phải đánh số 1–4: '+nums);
  await ev("(async()=>{const s=GAME_DATA.scenes[0];await __put('A',s.cards.find(c=>!c.slot).id);await __put('B',s.slots[1].correct);})()");await wait(400);
  await click('#commit');await wait(400);
  const cm=await ev("document.querySelector('.slot[data-slot=\"A\"]').innerText+' '+(document.querySelector('#hints [data-hint-row=\"A\"]')?.innerText||'')");
  if(!/Chưa phù hợp/i.test(cm)||/năm \d{4}/.test(cm))fail('Lớp học: không được tự hiện gợi ý: '+cm);
  if(!await ev("!!document.querySelector('[data-hint=\"A\"]')&&!!document.querySelector('[data-reveal=\"A\"]')"))fail('Lớp học: thiếu nút Đọc gợi ý / Hiện đáp án cho MC');
  await click('[data-hint="A"]');await wait(200);
  if(!/năm/.test(await ev("document.querySelector('#hints [data-hint-row=\"A\"]').innerText")))fail('MC bấm Đọc gợi ý mà không có gợi ý thời điểm');
  await click('#sheet-btn');await wait(300);
  if(!await ev("document.getElementById('scoresheet').open&&document.querySelectorAll('.scoretable tbody tr').length===9"))fail('Phiếu ghi điểm phải mở với 9 hàng chặng');
  await ev("(()=>{const i=document.querySelector('input[data-team=\"0\"]');i.value='10';i.dispatchEvent(new Event('input',{bubbles:true}));})()");
  if(await ev("document.querySelector('[data-sum=\"0\"]').textContent")!=='10')fail('Phiếu ghi điểm không tự cộng tổng');
  await ev("document.getElementById('scoresheet').close()");
  await altCheck('lớp học');
  if(errors.length)fail(errors.join(';'));
  console.log('PASS: landing; game ghép tình huống – sự kiện: 4 thẻ/2 ô/2 điểm nóng, gợi ý nấc 1–3, làm mờ, khóa ô, bỏ qua, album, cảnh đổi khi đúng, điểm cuối và danh sách ôn, 360px không cuộn ngang; chế độ Lớp học (thẻ 1–4, MC tự bấm gợi ý, phiếu ghi điểm); không localStorage; quy tắc màu.');
  ws.close();if(chrome)chrome.kill();else await call('Browser.close').catch(()=>{});
})().catch(e=>{console.error(e);process.exit(1);});
