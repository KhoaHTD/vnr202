/* ============================================================
   bgm.js: nhạc nền theo cảnh (landing, 3 chương, màn trùm). Gắn window.BGM.
   - Chỉ phát khi người chơi bật loa (setEnabled). Bật/tắt nhớ trong phiên qua sessionStorage 'sound' (chung với landing).
   - play(key): đổi bài bằng crossfade; đang phát đúng bài thì giữ nguyên. Khi loa tắt vẫn nhớ bài cần phát để bật lên là có.
   - Thiếu file hoặc trình duyệt chặn tự phát: bỏ qua yên lặng.
   Nguồn và giấy phép từng bài: docs/am-thanh.md
   ============================================================ */
(function(){
  const DIR='assets/audio/bgm/';
  const TRACKS={landing:'landing.mp3','chuong-1':'chuong-1.mp3','chuong-2':'chuong-2.mp3','chuong-3':'chuong-3.mp3','tran-dau-cuoi':'tran-dau-cuoi.mp3'};
  const VOLUME=.35,FADE=1200;
  const session={
    get:k=>{try{return sessionStorage.getItem(k);}catch{return null;}},
    set:(k,v)=>{try{sessionStorage.setItem(k,v);}catch{/* chỉ mất phần nhớ trong phiên */}}
  };
  let enabled=session.get('sound')==='1',want=null,cur=null; // cur = {key, el}

  // Âm lượng chạy từ giá trị hiện tại tới `to` trong `ms`; xong thì gọi done
  function ramp(el,to,ms,done){
    cancelAnimationFrame(el._ramp);
    const from=el.volume,t0=performance.now();
    if(ms<=0){el.volume=to;done&&done();return;}
    const step=t=>{const k=Math.min(1,(t-t0)/ms);el.volume=from+(to-from)*k;if(k<1)el._ramp=requestAnimationFrame(step);else done&&done();};
    el._ramp=requestAnimationFrame(step);
  }
  function fadeOut(track,ms){if(!track)return;const el=track.el;ramp(el,0,ms,()=>{el.pause();el.removeAttribute('src');el.load();});}
  function start(key){
    if(!TRACKS[key])return;
    const el=new Audio(DIR+TRACKS[key]);el.loop=true;el.preload='auto';el.volume=0;
    cur={key,el};
    const p=el.play();if(p&&p.catch)p.catch(()=>{/* thiếu file hoặc bị chặn tự phát */});
    ramp(el,VOLUME,FADE);
  }
  function play(key){
    want=key;
    if(!enabled||(cur&&cur.key===key))return;
    fadeOut(cur,FADE);cur=null;start(key);
  }
  function stop(ms=FADE){want=null;fadeOut(cur,ms);cur=null;}
  function setEnabled(on){
    enabled=!!on;session.set('sound',enabled?'1':'0');
    if(!enabled){fadeOut(cur,250);cur=null;return;}
    if(want&&!cur)start(want);
  }
  window.BGM=Object.freeze({play,stop,setEnabled,isEnabled:()=>enabled});
})();
