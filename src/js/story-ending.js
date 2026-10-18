(function(root,factory){if(typeof module==='object'&&module.exports)module.exports=factory();else root.StoryEnding=factory();})(typeof globalThis!=='undefined'?globalThis:this,function(){
 'use strict';
 const MEDIA=Object.freeze({
  flag:'ending/[Thái Triển] Cờ nước CHXHCN Việt Nam tung bay - bản sáng hơn.mp4',
  speech:'ending/Toàn văn Chủ tịch Hồ Chí Minh đọc Tuyên ngôn Độc lập ngày 2-9-1945 - Báo VietNamNet.mp4',
  anthem:'ending/QUỐC CA VIỆT NAM (Tiến Quân Ca) - Quốc ca nước Cộng Hòa Xã Hội Chủ Nghĩa Việt Nam.mp3'
 });
 const TIMING=Object.freeze({blackout:2000,flagReveal:1800,speechReveal:1200,crossfade:3,fadeOut:1500});
 function anthemLevel(remaining){if(!Number.isFinite(remaining))return 0;const x=Math.max(0,Math.min(1,1-remaining/TIMING.crossfade));return x*x*(3-2*x);}
 const icons={pause:'<path d="M8 5v14M16 5v14"/>',play:'<path d="m8 5 11 7-11 7V5Z"/>',sound:'<path d="M3 9h4l5-4v14l-5-4H3zm13-2q7 5 0 10"/>',mute:'<path d="M3 9h4l5-4v14l-5-4H3zm13 0 5 6m0-6-5 6"/>'};
 const icon=name=>`<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">${icons[name]}</svg>`;

 function create({onFinish=()=>{},media=MEDIA}={}){
  let root,flag,speech,anthem,message,status,controls,pauseButton,muteButton,timeline,currentTimeLabel,durationLabel;
  let active=false,phase='idle',elapsed=0,ready=false,paused=false,hiddenPause=false,blocked=false,muted=false;
  let context=null,speechGain=null,anthemGain=null,speechSource=null,anthemSource=null;
  let musicStarted=false,musicStartedAt=null,buffering=false,priming=false,token=0,raf=0,last=0,controlsTimer=0;
  let speechLevel=0,musicLevel=0,loadingTime=0;
  const cleanupListeners=[];
  function listen(target,event,fn){target.addEventListener(event,fn);cleanupListeners.push(()=>target.removeEventListener(event,fn));}
  function isPaused(){return paused||hiddenPause||blocked;}
  function formatTime(seconds){if(!Number.isFinite(seconds)||seconds<0)return '0:00';const whole=Math.floor(seconds);return `${Math.floor(whole/60)}:${String(whole%60).padStart(2,'0')}`;}
  function updateTimeline(){
   if(!timeline||!speech)return;
   const duration=Number.isFinite(speech.duration)?speech.duration:0,current=Number.isFinite(speech.currentTime)?speech.currentTime:0;
   if(duration>0){timeline.max=String(duration);timeline.value=String(Math.min(current,duration));timeline.style.setProperty('--progress',`${Math.min(100,current/duration*100)}%`);}
   currentTimeLabel.textContent=formatTime(current);durationLabel.textContent=formatTime(duration);
   timeline.disabled=!active||blocked||duration<=0||(phase!=='speech'&&phase!=='anthem');
  }
  function setPhase(value){phase=value;elapsed=0;root.dataset.phase=value;updateTimeline();root.dispatchEvent(new CustomEvent('endingphasechange',{detail:{phase:value}}));}
  function showMessage(text){status.textContent=text;message.hidden=false;}
  function hideMessage(){message.hidden=true;status.textContent='';}
  function showControls(){if(!active||phase==='closing')return;root.classList.add('show-controls');clearTimeout(controlsTimer);controlsTimer=setTimeout(()=>root.classList.remove('show-controls'),2400);}
  function buttons(){pauseButton.innerHTML=icon(paused?'play':'pause');pauseButton.setAttribute('aria-label',paused?'Tiếp tục đoạn kết':'Tạm dừng đoạn kết');muteButton.innerHTML=icon(muted?'mute':'sound');muteButton.setAttribute('aria-label',muted?'Bật âm thanh':'Tắt âm thanh');muteButton.setAttribute('aria-pressed',String(muted));}
  function prepare(){
   if(root)return;
   root=document.createElement('dialog');root.id='ending-screen';root.className='ending-screen';root.tabIndex=-1;root.setAttribute('aria-label','Ngày độc lập');root.setAttribute('autofocus','');
   root.innerHTML=`<div class="ending-shade" aria-hidden="true"></div><video class="ending-flag" id="ending-flag" muted loop playsinline preload="metadata" tabindex="-1" aria-hidden="true" disablepictureinpicture></video><div class="ending-foreground"><video class="ending-speech" id="ending-speech" playsinline preload="metadata" tabindex="-1" aria-label="Chủ tịch Hồ Chí Minh đọc Tuyên ngôn Độc lập" disablepictureinpicture></video></div><audio id="ending-anthem" preload="metadata"></audio><div class="ending-exit" aria-hidden="true"></div><div class="ending-message" hidden><p role="status"></p></div><div class="ending-controls"><button type="button" class="ending-icon" data-ending-action="pause" aria-label="Tạm dừng đoạn kết">${icon('pause')}</button><button type="button" class="ending-icon" data-ending-action="mute" aria-label="Tắt âm thanh" aria-pressed="false">${icon('sound')}</button><button type="button" class="ending-leave" data-ending-action="finish">Xem kết quả</button></div><div class="ending-timeline"><span class="ending-time" data-time-current>0:00</span><input type="range" min="0" max="0" step="0.1" value="0" aria-label="Tua video đoạn kết" disabled><span class="ending-time" data-time-duration>0:00</span></div>`;
   document.body.append(root);flag=root.querySelector('#ending-flag');speech=root.querySelector('#ending-speech');anthem=root.querySelector('#ending-anthem');message=root.querySelector('.ending-message');status=message.querySelector('p');controls=root.querySelector('.ending-controls');pauseButton=controls.querySelector('[data-ending-action="pause"]');muteButton=controls.querySelector('[data-ending-action="mute"]');timeline=root.querySelector('.ending-timeline input');currentTimeLabel=root.querySelector('[data-time-current]');durationLabel=root.querySelector('[data-time-duration]');
   flag.muted=true;flag.volume=0;
   flag.src=new URL(media.flag,document.baseURI).href;speech.src=new URL(media.speech,document.baseURI).href;anthem.src=new URL(media.anthem,document.baseURI).href;
   listen(root,'pointermove',showControls);listen(root,'pointerdown',showControls);
   listen(root,'cancel',event=>{event.preventDefault();finish();});
   listen(root,'keydown',event=>{if(blocked&&(event.code==='Space'||event.code==='Enter')){event.preventDefault();unlockPlayback();return;}if(event.code==='Space'&&(event.target===root||event.target===speech)){event.preventDefault();togglePause();}});
   listen(root,'click',event=>{const action=event.target.closest('[data-ending-action]')?.dataset.endingAction;if(action==='pause')togglePause();else if(action==='mute'){muted=!muted;applyMix();buttons();}else if(action==='finish')finish();else if(blocked)unlockPlayback();});
   listen(timeline,'input',()=>seekSpeech(Number(timeline.value)));
   listen(speech,'loadedmetadata',updateTimeline);listen(speech,'durationchange',updateTimeline);
   listen(speech,'timeupdate',()=>{syncMusic();updateTimeline();});listen(speech,'seeked',()=>{syncMusic(true);updateTimeline();});
   listen(speech,'waiting',()=>{if(active&&phase==='speech'){buffering=true;if(musicStarted)anthem.pause();}});
   listen(speech,'playing',()=>{if(active&&phase==='speech'){buffering=false;if(musicStarted&&!isPaused())play(anthem);}});
   listen(speech,'ended',()=>{if(active&&phase==='speech'){buffering=false;setPhase('anthem');speechLevel=0;musicLevel=1;startMusic();if(!isPaused()&&anthem.paused)play(anthem);applyMix();}});
   listen(anthem,'ended',()=>{if(active&&phase==='anthem')finish();});
   for(const item of [flag,speech,anthem])listen(item,'error',()=>{if(active&&!priming)block('Chưa mở được đoạn phim hoặc âm thanh. Bạn có thể thử lại hoặc xem kết quả.');});
   listen(document,'visibilitychange',()=>{if(!active)return;hiddenPause=document.hidden;if(hiddenPause)pauseMedia();else if(!isPaused())resumeMedia();last=performance.now();});
   listen(window,'pagehide',()=>{if(active)stop(false);});
  }
  function setupAudio(){
   if(context)return;
   const Audio=window.AudioContext||window.webkitAudioContext;
   if(!Audio){speech.volume=0;anthem.volume=0;return;}
   context=new Audio();speechGain=context.createGain();anthemGain=context.createGain();speechGain.gain.value=0;anthemGain.gain.value=0;
   speechSource=context.createMediaElementSource(speech);anthemSource=context.createMediaElementSource(anthem);
   speechSource.connect(speechGain).connect(context.destination);anthemSource.connect(anthemGain).connect(context.destination);
  }
  function gain(node,media,value){if(node&&context){node.gain.setTargetAtTime(value,context.currentTime,.02);}else media.volume=value;}
  function applyMix(){if(!speech)return;const master=muted?0:phase==='closing'?Math.max(0,1-elapsed/TIMING.fadeOut):1;gain(speechGain,speech,speechLevel*master);gain(anthemGain,anthem,musicLevel*master);}
  function pauseMedia(){flag.pause();speech.pause();anthem.pause();}
  function block(text){if(!active||phase==='closing')return;blocked=true;pauseMedia();showMessage(text);updateTimeline();showControls();}
  async function play(item){try{await item.play();return true;}catch(error){if(active&&error.name!=='AbortError')block(error.name==='NotAllowedError'?'Chạm để tiếp tục phát hình và âm thanh.':'Chưa phát được đoạn phim hoặc âm thanh.');return false;}}
  async function prime(item,generation){await item.play();if(token!==generation||!active)return;item.pause();item.currentTime=0;}
  async function primeAll(generation){
   priming=true;
   try{
    // Both play requests are made synchronously within the final-answer/preview gesture.
    // Gains are zero, so unlocking the media never leaks the first words into the blackout.
    const resumed=context?context.resume():Promise.resolve();
    const speechPrimed=prime(speech,generation),anthemPrimed=prime(anthem,generation),flagPlaying=flag.play();
    await Promise.all([resumed,speechPrimed,anthemPrimed,flagPlaying]);
    if(token!==generation||!active)return;
    ready=true;blocked=false;hideMessage();if(isPaused())pauseMedia();
   }catch(error){if(token===generation&&active)block(error.name==='NotAllowedError'?'Chạm để phát đoạn kết và âm thanh.':'Chưa mở được đoạn phim hoặc âm thanh. Bạn có thể thử lại hoặc xem kết quả.');}
   finally{if(token===generation)priming=false;}
  }
  function start(){
   if(active)return;prepare();active=true;ready=false;paused=false;hiddenPause=document.hidden;blocked=false;buffering=false;musicStarted=false;musicStartedAt=null;speechLevel=0;musicLevel=0;loadingTime=0;elapsed=0;
   const generation=++token;flag.currentTime=0;speech.currentTime=0;anthem.currentTime=0;hideMessage();buttons();setupAudio();applyMix();
   root.classList.remove('is-open','show-controls');root.dataset.phase='idle';root.showModal();root.focus({preventScroll:true});root.getBoundingClientRect();setPhase('blackout');root.classList.add('is-open');
   last=performance.now();primeAll(generation);raf=requestAnimationFrame(tick);
  }
  function startMusic(){
   if(!active||musicStarted)return;musicStarted=true;musicStartedAt=speech.currentTime;
   // No sound from this file is played before the last three seconds of the speech.
   anthem.currentTime=0;if(!isPaused()&&!buffering)play(anthem);
  }
  function seekSpeech(time){
   if(!active||phase==='closing'||!Number.isFinite(speech.duration)||phase!=='speech'&&phase!=='anthem')return;
   if(phase==='anthem'){anthem.pause();anthem.currentTime=0;musicStarted=false;musicStartedAt=null;musicLevel=0;setPhase('speech');speechLevel=1;}
   speech.currentTime=Math.max(0,Math.min(speech.duration,time));
   if(!isPaused())play(speech);
   syncMusic(true);applyMix();updateTimeline();showControls();
  }
  function syncMusic(force=false){
   if(!active||phase!=='speech'||(!force&&isPaused())||speech.seeking)return;
   const remaining=speech.duration-speech.currentTime;
   if(!Number.isFinite(remaining))return;
   if(remaining>TIMING.crossfade){
    if(musicStarted){musicStarted=false;musicStartedAt=null;musicLevel=0;anthem.pause();anthem.currentTime=0;applyMix();}
    return;
   }
   startMusic();musicLevel=anthemLevel(remaining);applyMix();
  }
  function resumeMedia(){
   if(!active||isPaused())return;if(context&&context.state!=='running')context.resume().catch(()=>block('Chạm để tiếp tục âm thanh.'));
   play(flag);if(phase==='speech'){play(speech);if(musicStarted&&!buffering)play(anthem);}else if(phase==='anthem')play(anthem);
  }
  function togglePause(){if(!active||phase==='closing')return;paused=!paused;if(paused)pauseMedia();else resumeMedia();buttons();showControls();last=performance.now();}
  function unlockPlayback(){
   blocked=false;paused=false;buttons();hideMessage();
   updateTimeline();
   if(!ready){primeAll(token);}else{resumeMedia();}
   last=performance.now();
  }
  function finish(){if(!active||phase==='closing')return;blocked=false;paused=false;hiddenPause=false;hideMessage();root.classList.remove('show-controls');setPhase('closing');last=performance.now();}
  function stop(notify=true){
   if(!active)return;active=false;token++;cancelAnimationFrame(raf);clearTimeout(controlsTimer);speechLevel=0;musicLevel=0;applyMix();pauseMedia();phase='idle';root.dataset.phase='idle';root.classList.remove('is-open','show-controls');if(root.open)root.close();
   if(notify)onFinish();
  }
  function tick(now){
   if(!active)return;const dt=Math.max(0,now-last);last=now;
   if(!isPaused()&&!document.hidden){
    elapsed+=dt;loadingTime+=dt;
    if(phase==='blackout'&&elapsed>=TIMING.blackout&&ready){setPhase('flag');}
    else if(phase==='flag'&&elapsed>=TIMING.flagReveal){setPhase('speech');speechLevel=1;applyMix();play(speech);}
    else if(phase==='speech')syncMusic();
    else if(phase==='closing'){applyMix();if(elapsed>=TIMING.fadeOut){stop();return;}}
    if(!ready&&!blocked&&loadingTime>5000)showMessage('Đang mở đoạn kết…');
   }
   raf=requestAnimationFrame(tick);
  }
  function state(){return {active,phase,ready,paused:isPaused(),blocked,muted,elapsed,speechTime:speech?.currentTime||0,speechDuration:Number.isFinite(speech?.duration)?speech.duration:null,anthemTime:anthem?.currentTime||0,anthemDuration:Number.isFinite(anthem?.duration)?anthem.duration:null,musicStarted,musicStartedAt,speechLevel,musicLevel,flagMuted:flag?.muted??true,audioState:context?.state||'media'};}
  function destroy(){stop(false);cleanupListeners.splice(0).forEach(fn=>fn());if(context)context.close().catch(()=>{});root?.remove();root=null;}
  return Object.freeze({prepare,start,finish,state,isActive:()=>active,destroy});
 }
 return Object.freeze({MEDIA,TIMING,anthemLevel,create});
});
