(() => {
 'use strict';
 const D=window.StoryData,C=window.StoryCore,W=window.AugustWorld;
 const $=id=>document.getElementById(id),app=$('app'),reader=$('reader');
 const esc=s=>String(s??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
 const paths={back:'<path d="M20 12H4m6-6-6 6 6 6"/>',arrow:'<path d="M4 12h16m-6-6 6 6-6 6"/>',close:'<path d="m6 6 12 12M18 6 6 18"/>',book:'<path d="M12 5C9 3 6 3 3 4v15c3-1 6-1 9 1 3-2 6-2 9-1V4c-3-1-6-1-9 1v15"/>',bulb:'<path d="M9 18h6m-5 3h4M8 14a6 6 0 1 1 8 0l-1 2H9zM12 2V0M4 5 2 3m18 2 2-2"/>',check:'<path d="m4 12 5 5L20 6"/>'};
 const icon=name=>`<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">${paths[name]}</svg>`;
 const key=chapter=>'thang-tam:story:1:'+D.chapters[chapter].id;
 let storageError=false;
 function read(chapter){try{return C.restore(D,localStorage.getItem(key(chapter)));}catch{storageError=true;return null;}}
 const chapterId=new URL(location.href).searchParams.get('giai-doan');
 const chapter=document.body.dataset.page==='game'?D.chapters.findIndex(c=>c.id===chapterId):-1;
 let run=chapter<0?null:read(chapter)||C.create(D,chapter),selected=null,retrying=false,focusBeforeModal=null;
 let clock=0,last=performance.now(),savedAt=last,paintAt=0,effect=null,presented=null;
 const reduced=matchMedia('(prefers-reduced-motion: reduce)'),stacked=matchMedia('(max-width:960px)');
 const question=()=>run&&C.question(D,run);
 const ending=window.StoryEnding.create({onFinish:()=>{render('result-title');window.scrollTo({top:0,behavior:'instant'});}});
 function persist(){if(!run)return;try{localStorage.setItem(key(run.chapter),JSON.stringify(run));}catch{storageError=true;}}
 function announce(text){$('announcer').textContent='';requestAnimationFrame(()=>$('announcer').textContent=text);}
 function heading(){
  $('top').innerHTML=`${run?`<a class="back-link" href="index.html">${icon('back')}<span>Chọn giai đoạn</span></a>`:'<span></span>'}<div class="tools">${run?`<span class="score" aria-label="${C.score(D,run)} trên ${C.maxScore(D,run.chapter)} điểm"><strong>${C.score(D,run)}</strong><span>/ ${C.maxScore(D,run.chapter)}</span></span><button class="icon-button" data-action="book" aria-label="Đọc bối cảnh">${icon('book')}</button>`:''}<button class="icon-button" data-action="help" aria-label="Mở hướng dẫn" aria-haspopup="dialog">${icon('bulb')}</button></div>`;
 }
 function menu(){
  app.className='chapter-menu';
  app.innerHTML=`<h1>Đường đến<br>tháng Tám</h1><div class="chapter-grid">${D.chapters.map((ch,i)=>{const saved=read(i);return `<a class="chapter-card ${i===2?'main-chapter':''}" href="hanh-trinh.html?giai-doan=${ch.id}" aria-label="${ch.period}: ${ch.title}. ${saved?.finished?'Xem kết quả':saved?'Tiếp tục':'Bắt đầu'}"><canvas data-chapter="${i}" width="960" height="540" aria-hidden="true"></canvas><div class="chapter-copy"><span class="chapter-period">${ch.period}</span><h2>${ch.title}</h2><div class="chapter-bottom">${saved?`<span>${saved.finished?'Xem kết quả':'Tiếp tục'}</span>`:''}${icon('arrow')}</div></div></a>`;}).join('')}</div>`;
  app.querySelectorAll('[data-chapter]').forEach(canvas=>W.draw(canvas,D.chapters[Number(canvas.dataset.chapter)].scene,1,0));
 }
 function illustration(){return `<section class="scene-visual" aria-label="Cảnh pixel: ${esc(question().title)}"><canvas id="world" width="960" height="700" aria-hidden="true"></canvas><div class="signal-notice" id="signal-notice" role="status" ${run.signal.phase==='warning'?'':'hidden'}>Thời cơ sắp xuất hiện…</div><button id="signal" class="signal" data-action="catch" aria-label="Nắm thời cơ; có thể nhấn Space" ${run.signal.phase==='flying'?'':'hidden'}><svg viewBox="0 0 64 48" aria-hidden="true" shape-rendering="crispEdges"><path fill="#fff0ad" d="M8 8h48v32H8z"/><path fill="#b57743" d="M8 8h48v4H8zM8 36h48v4H8zM8 12h4v24H8zM52 12h4v24h-4z"/><path fill="#d5ac60" d="m12 12 20 12 20-12v5L32 29 12 17z"/><path fill="#b44e3d" d="M28 24h8v8h-8z"/></svg></button></section>`;}
 function signalFeedback(){
  const s=run.signal;
  if(s.phase==='idle')return `<div class="timing-step"><p>Đã nhận định thời cơ. Giờ hãy đón tín hiệu trong cảnh bên trái.</p><button class="primary" data-action="signal-start">Đón thời cơ ${icon('arrow')}</button></div>`;
  if(s.phase==='warning'||s.phase==='flying')return '<p class="timing-step" role="status">Chạm tín hiệu khi nó bay qua cảnh, hoặc nhấn Space.</p>';
  if(s.phase==='missed')return '<div class="feedback unfit" role="status"><h3>Thời cơ đã vụt qua</h3><p>Bạn vẫn được đón lại để tiếp tục. Phần thời cơ của lượt này không cộng điểm.</p><button class="secondary" data-action="signal-retry">Đón lại tín hiệu</button></div>';
  return `<div class="timing-step"><p>${s.missed?'Đã nắm thời cơ · Không cộng điểm sau khi thử lại.':'Đã nắm thời cơ · +100 điểm.'}</p><button class="primary" data-action="next">Tiếp tục ${icon('arrow')}</button></div>`;
 }
 function play(){
  const q=question(),qs=D.forChapter(run.chapter),attempts=C.attempts(run,q),lastChoice=q.options.find(o=>o.id===attempts.at(-1)),done=C.resolved(D,run);
  const feedback=done||!!lastChoice&&!retrying,choice=feedback?lastChoice?.id:selected;
  if(run.chapter===2&&run.index===qs.length-1)ending.prepare();
  app.className='play-shell';
  app.innerHTML=`<div class="play-grid"><div class="visual-column">${illustration()}</div><section class="story-panel" aria-labelledby="scene-title"><div class="question-progress"><span>${D.chapters[run.chapter].period}</span><span>Câu ${run.index+1} / ${qs.length}</span></div><progress value="${run.index+(done?1:0)}" max="${qs.length}" aria-label="Tiến độ câu hỏi"></progress><h1 id="scene-title" tabindex="-1">${esc(q.title)}</h1><p class="narrative">${esc(q.story)}</p><form id="answer-form"><fieldset ${feedback?'disabled':''}><legend>${esc(q.prompt)}</legend><div class="choices">${q.options.map((o,i)=>`<label class="choice ${feedback&&o.id===choice?(done?'suitable':'unfit'):''} ${!feedback&&attempts.includes(o.id)?'excluded':''}"><input type="radio" name="choice" value="${o.id}" ${choice===o.id?'checked':''} ${!feedback&&attempts.includes(o.id)?'disabled':''}><span class="choice-letter" aria-hidden="true">${String.fromCharCode(65+i)}</span><span class="choice-text">${esc(o.text)}</span>${feedback&&o.id===choice&&done?`<span class="choice-mark" aria-label="Phù hợp">${icon('check')}</span>`:''}</label>`).join('')}</div></fieldset>${feedback?'':`<div class="answer-actions"><button class="primary" type="submit" ${selected===null?'disabled':''}>Xác nhận</button></div>`}</form>${feedback?`<div class="feedback ${done?'suitable':'unfit'}" role="status"><div class="feedback-head"><h2 id="feedback-title" tabindex="-1">${done?'Phù hợp':'Chưa phù hợp'}</h2>${done?`<span class="feedback-score">${attempts.length===1?'+100 điểm':'Không cộng điểm sau khi thử lại'}</span>`:''}</div><p>${esc(lastChoice.why)}</p>${done?(C.requiresSignal(D,run)?'':`<button class="primary" data-action="next">${run.index===qs.length-1?(run.chapter===2?'Xem đoạn kết':'Xem kết quả'):'Tiếp tục'} ${icon('arrow')}</button>`):'<button class="secondary" data-action="retry">Chọn lại · Câu này không cộng điểm</button>'}</div>`:''}${done&&C.requiresSignal(D,run)?signalFeedback():''}${storageError?'<p class="storage-note" role="status">Chưa lưu được tiến độ trên trình duyệt này. Hãy giữ trang mở để tiếp tục.</p>':''}</section></div>`;
  draw();updateSignal();
 }
 function results(){
  const rows=C.review(D,run),firstFits=rows.filter(r=>r.points>0).length,ch=D.chapters[run.chapter];
  app.className='play-shell results-shell';
  app.innerHTML=`<div class="play-grid"><div class="visual-column">${illustration()}</div><section class="story-panel result-panel" aria-labelledby="result-title"><span class="result-period">${ch.period}</span><h1 id="result-title" tabindex="-1">${run.chapter===2?'Ngày độc lập':'Khép lại một chặng'}</h1><p class="narrative">${esc(ch.closing)}</p><div class="result-score"><strong>${C.score(D,run)}</strong><span>/ ${C.maxScore(D,run.chapter)} điểm</span></div><p class="score-breakdown">${firstFits}/${rows.length} câu phù hợp ngay lần đầu${run.chapter===2?`<br>Thời cơ: ${run.signal.missed?'0':'100'}/100 điểm`:''}</p><details class="review"><summary>Xem lại câu trả lời</summary><div class="review-list">${rows.map((row,i)=>`<details class="review-item"><summary><span>Câu ${i+1} · ${row.points?'Phù hợp lần đầu':'Cần xem lại'}</span><strong>${row.points}/100</strong></summary><h2>${esc(row.question.prompt)}</h2><p><b>Lựa chọn đầu:</b> ${esc(row.first.text)}</p><p>${esc(row.first.why)}</p>${row.points?'':`<p><b>Phương án phù hợp:</b> ${esc(row.question.options.find(o=>o.id===row.question.answer).text)}</p><p>${esc(row.question.options.find(o=>o.id===row.question.answer).why)}</p>`}</details>`).join('')}</div></details><div class="result-actions">${run.chapter!==2?'<a class="primary" href="hanh-trinh.html?giai-doan=1939-1945">Đến 1939–1945 '+icon('arrow')+'</a>':'<a class="primary" href="index.html">Chọn giai đoạn '+icon('arrow')+'</a>'}${run.chapter===2?'<button class="text-button" data-action="replay-ending">Xem lại đoạn kết</button>':''}<button class="text-button" data-action="restart">Chơi lại giai đoạn này</button></div></section></div>`;
  draw();
 }
 function render(focus){const presentation=run?run.chapter+':'+run.index+':'+run.finished:'menu';heading();if(!run)menu();else if(run.finished)results();else play();app.classList.toggle('scene-enter',presentation!==presented);presented=presentation;document.body.dataset.tension=run&&!run.finished&&C.requiresSignal(D,run)?run.signal.phase:'idle';if(focus){$(focus)?.focus({preventScroll:true});if(focus==='feedback-title')$(focus)?.scrollIntoView({block:'nearest',behavior:'instant'});}}
 function draw(){
  const canvas=$('world');if(!canvas||!run)return;
  const q=question(),same=D.forChapter(run.chapter).filter(other=>other.scene===q.scene);
  const completed=same.filter(other=>C.attempts(run,other).at(-1)===other.answer).length;
  const frame=run.finished?2:Math.min(2,Math.floor(completed/same.length*2));
  let motion=null;
  if(effect&&!reduced.matches){const p=Math.min(1,effect.elapsed/1100);motion={from:[135,205],to:[335,205],progress:p,carry:q.scene===6,taskId:q.scene===6?'rice':'story'};}
  const variant=q.id==='c3-uprising-force'?2:0;
  W.draw(canvas,q.scene,frame,reduced.matches?0:clock,motion,!stacked.matches,variant);
 }
 function updateSignal(){
  const signal=$('signal'),notice=$('signal-notice');if(!signal)return;
  const s=run.signal,active=!run.finished&&C.requiresSignal(D,run);
  signal.hidden=!active||s.phase!=='flying';notice.hidden=!active||s.phase!=='warning';
  if(!signal.hidden){signal.style.left=(-14+s.elapsed/5000*128)+'%';signal.style.top=(23+(reduced.matches?0:Math.sin(s.elapsed/5000*Math.PI*4)*3))+'%';}
 }
 function open(title,html){focusBeforeModal=document.activeElement;reader.innerHTML=`<div class="dialog-head"><h2 id="reader-title" tabindex="-1">${esc(title)}</h2><button class="icon-button" data-action="close" aria-label="Đóng">${icon('close')}</button></div>${html}`;if(!reader.open)reader.showModal();reader.scrollTop=0;$('reader-title').focus();}
 reader.addEventListener('close',()=>{last=performance.now();if(focusBeforeModal?.isConnected)focusBeforeModal.focus({preventScroll:true});});
 function help(){open('Cách chơi',`<ol class="help-steps"><li>Đọc dẫn truyện và câu hỏi bên phải. Chọn một phương án, rồi bấm <b>Xác nhận</b>.</li><li>Phù hợp ngay lần đầu: <b>+100 điểm</b>. Nếu chưa phù hợp, đọc giải thích và chọn lại; câu ấy không cộng điểm.</li><li>Hoàn thành câu hỏi để mở cảnh tiếp theo. Có thể dùng Tab và các phím mũi tên để chọn, Enter để xác nhận.</li>${run?.chapter===2?'<li>Sau câu hỏi ở Tân Trào, bấm <b>Đón thời cơ</b>. Chạm tín hiệu bay qua trong 5 giây, hoặc nhấn Space: +100 điểm nếu bắt được lượt đầu. Bỏ lỡ được thử lại với 0 điểm.</li>':''}</ol><p>Mỗi giai đoạn có tiến độ và điểm riêng. Đọc bối cảnh không trừ điểm. Mở hộp đọc hoặc rời tab sẽ tạm dừng tín hiệu.</p>${run?'<button class="text-button" data-action="restart">Chơi lại giai đoạn này</button>':''}`);}
 document.addEventListener('change',e=>{if(!e.target.matches('input[name="choice"]')||!run)return;selected=e.target.value;app.querySelector('button[type="submit"]').disabled=false;});
 document.addEventListener('submit',e=>{
  if(e.target.id!=='answer-form')return;e.preventDefault();if(selected===null||reader.open)return;
  const outcome=C.answer(D,run,selected);if(!outcome.accepted)return;
  retrying=false;selected=null;if(outcome.suitable)effect={elapsed:0};persist();render('feedback-title');
  announce(outcome.suitable?(outcome.points?'Phù hợp. Cộng 100 điểm.':'Phù hợp. Không cộng điểm sau khi thử lại.'):'Chưa phù hợp. Hãy xem giải thích và chọn lại.');
  if(outcome.suitable&&run.chapter===2&&run.index===D.forChapter(2).length-1){C.next(D,run);persist();ending.start();}
 });
 document.addEventListener('click',e=>{
  const button=e.target.closest('[data-action]');if(!button)return;const action=button.dataset.action;
  if(action==='close'){reader.close();return;}
  if(action==='help'){help();return;}
  if(action==='book'&&run){const reading=D.readings[question().scene];open(reading[0],reading.slice(1).map(p=>`<p>${esc(p)}</p>`).join(''));return;}
  if(action==='retry'){selected=null;retrying=true;render();app.querySelector('input[name="choice"]:not(:disabled)')?.focus({preventScroll:true});return;}
  if(action==='next'&&run){if(!C.next(D,run))return;selected=null;retrying=false;effect=null;persist();if(run.finished&&run.chapter===2){ending.start();return;}render(run.finished?'result-title':'scene-title');window.scrollTo({top:0,behavior:'instant'});return;}
  if(action==='replay-ending'&&run?.finished&&run.chapter===2){ending.start();return;}
  if(action==='signal-start'&&C.startSignal(D,run)||action==='signal-retry'&&C.retrySignal(run)){persist();render();announce('Thời cơ sắp xuất hiện.');return;}
  if(action==='catch'&&!reader.open&&!document.hidden&&C.catchSignal(run)){persist();render();announce(run.signal.missed?'Đã nắm thời cơ. Không cộng điểm sau khi thử lại.':'Đã nắm thời cơ. Cộng 100 điểm.');app.querySelector('[data-action="next"]')?.focus({preventScroll:true});return;}
  if(action==='restart'&&run){open('Chơi lại giai đoạn này?',`<p>Điểm và câu trả lời của lượt ${D.chapters[run.chapter].period} sẽ được thay bằng lượt mới. Các giai đoạn khác được giữ.</p><div class="dialog-actions"><button class="primary" data-action="confirm-restart">Chơi lại</button><button class="secondary" data-action="close">Giữ lượt này</button></div>`);return;}
  if(action==='confirm-restart'&&run){run=C.create(D,run.chapter);selected=null;retrying=false;effect=null;reader.close();persist();render('scene-title');return;}
 });
 document.addEventListener('keydown',e=>{if(e.code==='Space'&&run?.signal.phase==='flying'&&!reader.open&&!document.hidden){e.preventDefault();$('signal')?.click();}});
 document.addEventListener('visibilitychange',()=>{last=performance.now();persist();});window.addEventListener('pagehide',persist);
 window.addEventListener('resize',draw);
 function tick(now){
  const dt=Math.max(0,now-last);last=now;
  if(!reader.open&&!document.hidden&&!ending.isActive()){clock+=dt;if(effect){effect.elapsed+=dt;if(effect.elapsed>=1100)effect=null;}if(run&&!run.finished){const changed=C.tick(D,run,dt);if(changed){persist();render();if(changed==='flying'){announce('Tín hiệu đang bay qua. Chạm hoặc nhấn Space để nắm thời cơ.');$('signal')?.focus({preventScroll:true});}if(changed==='missed')announce('Thời cơ đã qua. Bạn được thử lại, phần này không cộng điểm.');}}}
  if(!ending.isActive()&&now-paintAt>70){draw();paintAt=now;}updateSignal();
  if(run&&!ending.isActive()&&now-savedAt>1000){persist();savedAt=now;}requestAnimationFrame(tick);
 }
 window.StoryDebug=Object.freeze({state:()=>run?JSON.parse(JSON.stringify(run)):null,view:()=>ending.isActive()?'ending':!run?'menu':run.finished?'results':'question',ending:()=>ending.state()});
 render();requestAnimationFrame(tick);
})();
