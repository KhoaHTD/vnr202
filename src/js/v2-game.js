/* One controller and placement path for pointer, click, touch and keyboard. */
(() => {
  'use strict';
  const D=window.V2_DATA,C=window.V2Core,U=window.V2UI,A=window.V2Art;
  if(!D||!C||!U||!A){document.getElementById('app').textContent='Chưa tải được bàn chơi. Hãy tải lại trang.';return;}
  const app=document.getElementById('app'),reader=document.getElementById('reader');
  const KEY='august-game:v2:session',UIKEY='august-game:v2:view',PREF='august-game:v2:preferences';
  let storageWarning=false,toastTimer,lastModalFocus=null,audio=null,selected=null,hint='',drag=null,suppressClick=0,sourceReturn=null;
  const store={get(k){try{return sessionStorage.getItem(k);}catch{storageWarning=true;return null;}},set(k,v){try{sessionStorage.setItem(k,v);}catch{storageWarning=true;}}};
  function readJSON(k){try{return JSON.parse(store.get(k));}catch{return null;}}
  const preferences=readJSON(PREF)||{};
  let sound=preferences.sound===true;
  let run=C.restore(D,store.get(KEY)),practice=null,view='intro',chapterSummaryId=null,reviewChapter=null,filter='needs',reviewReturn='results',reviewScroll=0,reviewOpen=[];
  if(document.body.dataset.page==='game'){
    if(!run)run=C.createRun(D);
    const savedView=readJSON(UIKEY);
    if(run.finished)view='results';
    else if(savedView?.runId===run.runId&&['intro','play','chapter-summary','review'].includes(savedView.view)){
      view=savedView.view;chapterSummaryId=savedView.chapterSummaryId;reviewChapter=savedView.reviewChapter;filter=savedView.filter||'needs';reviewReturn=savedView.reviewReturn||'chapter-summary';
      if(view==='chapter-summary'&&!D.chapters.some(c=>c.id===chapterSummaryId))view='intro';
    }
  } else view='home';
  const activeRun=()=>practice||run;
  const activeScene=()=>U.sceneBy(D,activeRun().currentSceneId);
  const save=()=>{if(run)store.set(KEY,JSON.stringify(run));store.set(UIKEY,JSON.stringify({runId:run?.runId,view:practice?'review':view,chapterSummaryId,reviewChapter,filter,reviewReturn}));};
  function announce(message){const e=document.getElementById('announcer');e.textContent='';requestAnimationFrame(()=>{e.textContent=message;});}
  function toast(message){const e=document.getElementById('toast');e.textContent=message;e.hidden=false;clearTimeout(toastTimer);toastTimer=setTimeout(()=>e.hidden=true,3500);}
  function tone(kind){if(!sound)return;try{audio=audio||new(window.AudioContext||window.webkitAudioContext)();audio.resume().catch(()=>{});const oscillator=audio.createOscillator(),gain=audio.createGain(),now=audio.currentTime;oscillator.type='sine';oscillator.frequency.setValueAtTime(kind==='suitable'?660:kind==='place'?390:440,now);gain.gain.setValueAtTime(.025,now);gain.gain.exponentialRampToValueAtTime(.0001,now+.16);oscillator.connect(gain);gain.connect(audio.destination);oscillator.start();oscillator.stop(now+.17);oscillator.onended=()=>{oscillator.disconnect();gain.disconnect();};}catch{}}
  function render({focus=null,scroll=false,animate=false}={}){
    document.getElementById('header').innerHTML=U.header(sound);
    document.getElementById('reader-close').innerHTML=U.icon('close');
    if(view==='home')app.innerHTML=U.home(D,run);
    else if(view==='intro')app.innerHTML=U.intro(D,run);
    else if(view==='play')app.innerHTML=U.play(D,activeRun(),selected,hint,animate);
    else if(view==='chapter-summary')app.innerHTML=U.chapterSummary(D,run,chapterSummaryId);
    else if(view==='results')app.innerHTML=U.results(D,run);
    else if(view==='review'){
      app.innerHTML=U.review(D,run,filter,reviewChapter,reviewReturn==='chapter-summary'?'Trở về chương':'Trở về kết quả');
      app.querySelectorAll('[data-review-item]').forEach(e=>e.open=reviewOpen.includes(e.dataset.reviewItem));
    }
    save();
    if(scroll)window.scrollTo({top:0,behavior:'instant'});
    if(focus){const el=app.querySelector(focus);if(el)el.focus({preventScroll:true});}
  }
  function modal(html,kicker='TÌM HIỂU THÊM'){
    stopDrag();
    if(!reader.open)lastModalFocus=document.activeElement;
    document.getElementById('reader-kicker').textContent=kicker;
    document.getElementById('reader-content').innerHTML=html;
    if(!reader.open)reader.showModal();
    reader.scrollTop=0;
    const title=reader.querySelector('#reader-title');if(title){title.tabIndex=-1;title.focus();}
  }
  function closeModal(){if(reader.open)reader.close();}
  reader.addEventListener('close',()=>{stopDrag();lastModalFocus?.isConnected?lastModalFocus.focus({preventScroll:true}):app.focus({preventScroll:true});});
  document.getElementById('reader-close').addEventListener('click',closeModal);
  reader.addEventListener('click',e=>{if(e.target===reader){const r=reader.getBoundingClientRect();if(e.clientX<r.left||e.clientX>r.right||e.clientY<r.top||e.clientY>r.bottom)closeModal();}});
  function textModal(title,body,kicker){modal(`<h2 id="reader-title">${U.esc(title)}</h2>${body}`,kicker);}
  function record(id){
    const rec=D.records.find(r=>r.id===id);if(!rec)return;
    textModal(rec.title,rec.body.split('\n\n').map(p=>`<p>${U.esc(p)}</p>`).join('')+U.sourceLinks(D,rec.sourceRefs),'HỒ SƠ LỊCH SỬ');
  }
  async function source(ref){
    const match=/^(D[123]):(P\d{3})$/.exec(ref),item=match&&D.sources.find(s=>s.id===match[1]);
    if(!item)return;
    const previous={html:document.getElementById('reader-content').innerHTML,kicker:document.getElementById('reader-kicker').textContent,scroll:reader.scrollTop};
    try{
      const response=await fetch(item.extract);if(!response.ok)throw new Error('source unavailable');
      const text=(await response.text()).replace(/\r\n/g,'\n'),marker=`## ${match[2]}\n`,start=text.indexOf(marker);
      if(start<0)throw new Error('paragraph missing');
      const rest=text.slice(start+marker.length),next=rest.search(/\n##? /),paragraph=(next<0?rest:rest.slice(0,next)).replace(/\n\nComment IDs:[\s\S]*/,'').trim();
      sourceReturn=previous;
      textModal(`Đoạn ${match[2]} · Tư liệu nhóm`,`<p>${U.esc(paragraph)}</p><p class="source-note">${U.esc(item.file.split('/').at(-1))}. Mã đoạn dùng để tra cứu, không phải số trang.</p><div class="actions"><button class="button" data-action="source-back">${U.icon('back',16)}Trở về phần giải thích</button><a class="text-button" href="${U.esc(item.extract)}" target="_blank" rel="noopener">Mở bản trích đầy đủ</a></div>`,'NGUỒN · '+ref);
    }catch{toast('Chưa mở được đoạn nguồn. Bạn có thể tìm mã đoạn trong tài liệu nhóm.');}
  }
  function archive(){textModal('Những trang tư liệu.',`<p>Mở một hồ sơ để đọc sâu hơn về giai đoạn và những kết nối trong trò chơi.</p>${D.records.map((r,i)=>`<details class="archive-entry"><summary>${String(i+1).padStart(2,'0')} · ${U.esc(r.title)}</summary>${r.body.split('\n\n').map(p=>`<p>${U.esc(p)}</p>`).join('')}${U.sourceLinks(D,r.sourceRefs)}</details>`).join('')}<p class="source-note">Nội dung biên soạn từ tài liệu nhóm. Cảnh minh họa không thay thế tư liệu lịch sử.</p>`,'TỦ HỒ SƠ · 1930—1945');}
  function why(targetId){
    const r=activeRun(),s=activeScene(),state=C.getSceneState(D,r),slot=state.slots[targetId];if(!slot?.finalCardId)return;
    const t=s.targets.find(t=>t.id===targetId),e=U.evaluation(s,targetId,slot.finalCardId);
    const suggestions=e.suggestedCardIds.map(id=>s.cards.find(c=>c.id===id)?.label).filter(Boolean);
    textModal(e.outcome==='suitable'?'Kết nối phù hợp.':'Cùng xem lại kết nối này.',`<p><span class="reader-label">Nhiệm vụ:</span> ${U.esc(t.label)}<br><span class="reader-label">Bạn đã đặt:</span> ${U.esc(U.cardName(s,slot.finalCardId))}</p><p>${U.esc(e.reasonDetail)}</p>${suggestions.length?`<h3>Phương án đáp ứng nhiệm vụ</h3><p>${suggestions.map(U.esc).join(' · ')}</p>`:''}${U.sourceLinks(D,e.sourceRefs)}<div class="actions"><button class="button primary" data-action="close">${e.outcome==='suitable'?'Trở về bàn chơi':'Điều chỉnh lựa chọn'}</button><button class="text-button" data-action="record" data-id="${s.recordId}">Đọc tư liệu</button></div>`,'HIỂU TỪ LỰA CHỌN');
  }
  function tutorial(){
    preferences.tutorialSeen=true;store.set(PREF,JSON.stringify({...preferences,sound}));
    modal(`<h2 id="reader-title">Thử một kết nối nhỏ.</h2><p>Đặt tờ tư liệu vào tủ hồ sơ. Thao tác này không tính điểm.</p><div class="tutorial-board"><button class="tutorial-token" data-tutorial-token>${U.icon('book',28)}<span>Tờ tư liệu</span></button><button class="tutorial-drop" data-tutorial-drop>Tủ hồ sơ<br><span>Thả hoặc chọn để đặt</span></button></div><p id="tutorial-feedback">Kéo tờ tư liệu, hoặc chọn nó rồi chọn tủ hồ sơ.</p><div class="actions"><button class="button primary" data-action="close">Bắt đầu chơi ${U.icon('arrow')}</button><button class="text-button" data-action="close">Bỏ qua hướng dẫn</button></div>`,'LÀM QUEN · KHÔNG TÍNH ĐIỂM');
  }
  function tutorialDone(){const target=reader.querySelector('[data-tutorial-drop]');if(!target)return;target.classList.add('done');target.innerHTML=`${U.icon('check',24)}Đã cất vào hồ sơ`;reader.querySelector('[data-tutorial-token]').disabled=true;reader.querySelector('#tutorial-feedback').textContent='Đúng cách thao tác rồi. Trên bàn chơi, hãy bấm “Triển khai” để xem hoạt động có phù hợp.';announce('Đã đặt tờ tư liệu vào tủ hồ sơ.');tone('place');}
  function place(cardId,targetId){
    const result=C.place(D,activeRun(),cardId,targetId);
    if(!result.ok){toast('Nhiệm vụ này đã hoàn thành. Hãy chọn phần còn lại.');return;}
    selected=null;hint='Đã đặt hoạt động. Bạn vẫn có thể đổi trước khi triển khai.';
    save();render({focus:`[data-target="${targetId}"]`});announce(`Đã đặt ${U.cardName(activeScene(),cardId)}.`);tone('place');
  }
  function openReview(chapterId=null){
    reviewReturn=view==='chapter-summary'?'chapter-summary':'results';reviewChapter=chapterId;filter=C.summary(D,run).reviewCount?'needs':'all';reviewOpen=[];selected=null;view='review';render({scroll:true});
  }
  function beginPractice(sceneId){
    reviewScroll=window.scrollY;reviewOpen=[...app.querySelectorAll('[data-review-item][open]')].map(e=>e.dataset.reviewItem);
    practice=C.createRun(D,{mode:'practice',sceneId});selected=null;hint='';view='play';render({scroll:true});
  }
  function backReview(){practice=null;selected=null;hint='';view='review';render();window.scrollTo({top:reviewScroll,behavior:'instant'});}
  function next(){
    const oldScene=activeScene(),result=C.next(D,activeRun());if(!result.ok){toast('Hãy triển khai một lần trước khi đi tiếp.');return;}
    selected=null;hint='';
    if(practice){const pts=C.score(D,practice);backReview();toast(`Đã ôn tập: ${pts}/20 điểm luyện tập. Điểm lượt đầu được giữ nguyên.`);return;}
    if(result.finished)view='results';
    else if(result.chapterEnded){chapterSummaryId=oldScene.chapterId;view='chapter-summary';}
    else view='play';
    render({scroll:true,focus:view==='play'?'[data-card-pick]':null});
  }
  function restart(){
    if(run&&!run.finished){textModal('Bắt đầu một lượt mới?',`<p>Tiến độ lượt đang chơi sẽ được thay bằng lượt mới. Bạn có thể tiếp tục lượt hiện tại để giữ các lựa chọn.</p><div class="actions"><button class="button primary" data-action="confirm-restart">Bắt đầu lượt mới</button><button class="button quiet" data-action="close">Tiếp tục lượt hiện tại</button></div>`);return;}
    fresh();
  }
  function fresh(){run=C.createRun(D);practice=null;view='intro';selected=null;hint='';save();if(document.body.dataset.page==='home')location.href='hanh-trinh.html';else{closeModal();render({scroll:true});}}
  function clickAction(action,id){
    switch(action){
      case 'help':modal(U.help(),'CÁCH CHƠI');break;
      case 'scoring':modal(U.scoring(),'ĐIỂM SỐ');break;
      case 'archive':archive();break;
      case 'record':record(id);break;
      case 'source':source(id);break;
      case 'source-back':if(sourceReturn){const prev=sourceReturn;sourceReturn=null;modal(prev.html,prev.kicker);reader.scrollTop=prev.scroll;}break;
      case 'close':closeModal();break;
      case 'tutorial':tutorial();break;
      case 'sound':sound=!sound;preferences.sound=sound;store.set(PREF,JSON.stringify(preferences));document.getElementById('header').innerHTML=U.header(sound);document.querySelector('[data-action="sound"]').focus();if(sound)tone('place');else audio?.suspend().catch(()=>{});announce('Âm thanh: '+(sound?'bật':'tắt'));break;
      case 'restart':restart();break;
      case 'confirm-restart':fresh();break;
      case 'begin':view='play';render({scroll:true});if(!preferences.tutorialSeen)tutorial();break;
      case 'next-chapter':view='intro';render({scroll:true});break;
      case 'context':{const s=activeScene(),r=D.records.find(r=>r.id===s.recordId);textModal(s.title,`<p>${U.esc(s.contextShort)}</p><h3>Điều cần khám phá</h3><p>${U.esc(s.learningObjective)}</p>${r.body.split('\n\n').map(p=>`<p>${U.esc(p)}</p>`).join('')}${U.sourceLinks(D,r.sourceRefs)}`,'BỐI CẢNH · '+s.period);break;}
      case 'chapter-info':{const c=D.chapters.find(c=>c.id===id);textModal(c.name,`<p>${U.esc(c.caption)}</p><p>${U.esc(c.lesson)}</p>${D.scenes.filter(s=>s.chapterId===id).map(s=>`<button class="text-button" data-action="record" data-id="${s.recordId}">${U.esc(s.title)} ${U.icon('arrow',15)}</button><br>`).join('')}`,'GIAI ĐOẠN · '+c.years);break;}
      case 'target-info':{const t=activeScene().targets.find(t=>t.id===id);textModal(t.label,`<p>${U.esc(t.detail)}</p>`,'NHIỆM VỤ');break;}
      case 'card-info':{const card=activeScene().cards.find(c=>c.id===id);textModal(card.label,`<div class="reader-art">${A.card(id)}</div><p>${U.esc(card.detail)}</p>`,'HOẠT ĐỘNG');break;}
      case 'return-card':{const result=C.returnCard(D,activeRun(),id);if(result.ok){selected=null;hint='Đã đưa hoạt động về khay.';render({focus:`[data-card-pick="${id}"]`});announce(hint);}break;}
      case 'why':why(id);break;
      case 'submit':{const result=C.submit(D,activeRun());if(!result.ok){toast(result.reason==='unchanged'?'Hãy điều chỉnh một lựa chọn trước khi triển khai lại.':'Hãy bố trí đủ hai hoạt động.');return;}selected=null;const count=result.results.filter(r=>r.outcome==='suitable').length;hint=count===result.results.length?'Các hoạt động đã đáp ứng nhiệm vụ.': 'Một số kết nối cần xem lại. Bạn có thể mở “Vì sao?”.';render({animate:count>0,focus:'#commit:not(:disabled)'});announce(`${hint} Điểm hiện tại: ${C.score(D,activeRun())}.`);tone(count?'suitable':'place');break;}
      case 'next':next();break;
      case 'review':openReview();break;
      case 'review-chapter':openReview(id);break;
      case 'leave-review':view=reviewReturn;reviewChapter=null;render({scroll:true});break;
      case 'filter':filter=id;reviewOpen=[];render({focus:`[data-action="filter"][data-id="${id}"]`});break;
      case 'practice':beginPractice(id);break;
      case 'back-review':backReview();break;
    }
  }
  document.addEventListener('click',event=>{
    if(Date.now()<suppressClick&&event.target.closest('[data-card-pick],[data-target],[data-tutorial-token],[data-tutorial-drop]')){event.preventDefault();return;}
    const action=event.target.closest('[data-action]');if(action&&!action.disabled){clickAction(action.dataset.action,action.dataset.id);return;}
    const tutorialToken=event.target.closest('[data-tutorial-token]');if(tutorialToken&&!tutorialToken.disabled){tutorialToken.classList.toggle('selected');reader.querySelector('[data-tutorial-drop]').classList.toggle('selected',tutorialToken.classList.contains('selected'));return;}
    if(event.target.closest('[data-tutorial-drop]')){if(reader.querySelector('[data-tutorial-token].selected'))tutorialDone();else toast('Chọn tờ tư liệu trước, rồi chọn tủ hồ sơ.');return;}
    if(view!=='play'||reader.open)return;
    const pick=event.target.closest('[data-card-pick]');if(pick&&!pick.disabled){selected=selected===pick.dataset.cardPick?null:pick.dataset.cardPick;hint=selected?'Đã chọn hoạt động. Chọn nhiệm vụ để đặt.':'';render({focus:`[data-card-pick="${pick.dataset.cardPick}"]`});announce(hint||'Đã hủy chọn hoạt động.');return;}
    const target=event.target.closest('[data-target]');if(target&&!target.disabled){if(selected)place(selected,target.dataset.target);else toast('Chọn một hoạt động trong khay, rồi chọn nhiệm vụ.');}
  });
  function stopDrag(){
    if(!drag)return null;const previous=drag;drag=null;cancelAnimationFrame(previous.frame);previous.ghost?.remove();
    try{if(previous.element.hasPointerCapture(previous.pointerId))previous.element.releasePointerCapture(previous.pointerId);}catch{}
    document.body.classList.remove('is-dragging');document.querySelectorAll('.is-hover,.can-receive').forEach(e=>e.classList.remove('is-hover','can-receive'));return previous;
  }
  function dragTick(){
    if(!drag?.active)return;
    const scrollAmount=drag.y<75?-Math.ceil((75-drag.y)/5):drag.y>innerHeight-75?Math.ceil((drag.y-innerHeight+75)/5):0;
    if(scrollAmount&&!drag.tutorial)window.scrollBy(0,Math.max(-17,Math.min(17,scrollAmount)));
    document.querySelectorAll('.is-hover').forEach(e=>e.classList.remove('is-hover'));
    const el=document.elementFromPoint(drag.x,drag.y),target=el?.closest(drag.tutorial?'[data-tutorial-drop]':'[data-target]');
    if(target&&!target.disabled)target.classList.add('is-hover');
    drag.frame=requestAnimationFrame(dragTick);
  }
  document.addEventListener('pointerdown',event=>{
    if(event.button!==0||drag)return;
    const tutorialEl=event.target.closest('[data-tutorial-token]'),pick=event.target.closest('[data-card-pick]'),element=tutorialEl||pick;
    if(!element||element.disabled||(!tutorialEl&&(view!=='play'||reader.open)))return;
    drag={pointerId:event.pointerId,element,cardId:pick?.dataset.cardPick,tutorial:!!tutorialEl,startX:event.clientX,startY:event.clientY,x:event.clientX,y:event.clientY,active:false,frame:0};
    try{element.setPointerCapture(event.pointerId);}catch{}
  });
  document.addEventListener('pointermove',event=>{
    if(!drag||event.pointerId!==drag.pointerId)return;drag.x=event.clientX;drag.y=event.clientY;
    if(!drag.active&&Math.hypot(drag.x-drag.startX,drag.y-drag.startY)>7){
      drag.active=true;drag.ghost=document.createElement('div');drag.ghost.className='drag-ghost';drag.ghost.setAttribute('aria-hidden','true');drag.ghost.innerHTML=drag.tutorial?`${U.icon('book',40)}Tờ tư liệu`:`${A.card(drag.cardId)}${U.esc(U.cardName(activeScene(),drag.cardId))}`;
      // A modal is in the top layer; append its ghost inside it, not behind it.
      (drag.tutorial?reader:document.body).appendChild(drag.ghost);document.body.classList.add('is-dragging');
      if(!drag.tutorial)document.querySelectorAll('[data-target]:not(:disabled)').forEach(e=>e.classList.add('can-receive'));
      dragTick();
    }
    if(drag.active){event.preventDefault();drag.ghost.style.transform=`translate(${Math.max(0,Math.min(innerWidth-150,drag.x-75))}px,${drag.y-45}px)`;}
  },{passive:false});
  document.addEventListener('pointerup',event=>{
    if(!drag||event.pointerId!==drag.pointerId)return;
    const previous=drag,el=previous.active?document.elementFromPoint(event.clientX,event.clientY):null,target=el?.closest(previous.tutorial?'[data-tutorial-drop]':'[data-target]');
    stopDrag();if(!previous.active)return;
    suppressClick=Date.now()+350;
    if(target&&!target.disabled){if(previous.tutorial)tutorialDone();else place(previous.cardId,target.dataset.target);}
    else {announce('Thẻ đã trở về vị trí trước khi kéo.');if(!previous.tutorial)toast('Đặt thẻ vào một trong hai nhiệm vụ trên bản đồ.');}
  });
  document.addEventListener('pointercancel',()=>stopDrag());
  window.addEventListener('blur',()=>stopDrag());window.addEventListener('resize',()=>stopDrag());
  document.addEventListener('visibilitychange',()=>{if(document.hidden)stopDrag();});
  document.addEventListener('keydown',event=>{if(event.key==='Escape'&&!reader.open){if(drag){stopDrag();event.preventDefault();}if(selected){selected=null;hint='';render();announce('Đã hủy chọn hoạt động.');}}});
  window.GameDebug=Object.freeze({state:()=>run?JSON.parse(JSON.stringify(run)):null,view:()=>view});
  render();
  if(storageWarning)toast('Trình duyệt không giữ được phiên. Tải lại trang có thể mất tiến độ.');
})();
