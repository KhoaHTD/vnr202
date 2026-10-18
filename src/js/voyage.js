/* ============================================================
   voyage.js: chuyển cảnh "Hành quân trên bản đồ" (khoảng 2,7 giây, bấm để bỏ qua).
   Tờ chặng cũ thu về ghim → camera kéo lùi, mực son chạy từ địa danh cũ sang mới, thẻ điện tín gõ chữ →
   camera lao vào điểm mới, ghim đóng xuống → mực loang mở ra tờ chặng mới ngay tại ghim.
   Dùng lại bản đồ thật của ui.js (GameUI.journeyMap, GameUI.placeAt) và MAP_DATA. Không tự lưu gì.
   Voyage.run({D, run, from, to, sheet, chapterCard, onSwap, sfx}) → Promise, resolve khi lớp phủ đã gỡ.
   from = số chặng cũ (null nếu mở đầu game), to = số chặng mới, onSwap() dựng tờ mới (gọi khi lớp phủ đã che kín).
   ============================================================ */
window.Voyage=(()=>{
const easeIO=t=>t<.5?4*t*t*t:1-Math.pow(-2*t+2,3)/2,easeO=t=>1-Math.pow(1-t,3),clamp=(v,a,b)=>Math.max(a,Math.min(b,v));
const ZOOM=150; // bề rộng khung nhìn khi áp sát một điểm (đơn vị bản đồ)

function run(o){
  const {D,run:R,from,to,sheet,chapterCard,onSwap,sfx}=o,UI=window.GameUI,M=window.MAP_DATA;
  return new Promise(resolve=>{
    let skipped=false,swapped=false,finished=false;
    const swap=()=>{if(!swapped){swapped=true;onSwap();}};
    const A=innerWidth/innerHeight;
    const ov=document.createElement('div');ov.className='voyage';ov.setAttribute('aria-hidden','true');
    ov.innerHTML=`<div class="voyage-bg"></div><div class="voyage-map">${UI.journeyMap(D,R,{size:'full',chapter:99})}</div><div class="voyage-card"><span class="vc-stamp">Hành trình</span><b class="vc-l1"></b><i class="vc-l2"></i></div>`;
    const live=document.createElement('p');live.className='sr-only';live.setAttribute('aria-live','polite');
    document.body.append(ov,live);
    const bg=ov.querySelector('.voyage-bg'),mapEl=ov.querySelector('.voyage-map'),svg=ov.querySelector('svg'),card=ov.querySelector('.voyage-card');
    const l1=ov.querySelector('.vc-l1'),l2=ov.querySelector('.vc-l2');

    const P=to!=null?UI.placeAt(D,to):[M.W/2,M.H/2],F=from!=null?UI.placeAt(D,from):null;
    const vb0=svg.getAttribute('viewBox').split(' ').map(Number);
    const fullW=Math.max(vb0[2],vb0[3]*A),fullC=[vb0[0]+vb0[2]/2,vb0[1]+vb0[3]/2];
    const dist=F?Math.hypot(P[0]-F[0],P[1]-F[1]):0,near=dist<70;

    // Đường mực: cung cong cùng công thức với bản đồ chính
    const ctrl=F?[(F[0]+P[0])/2-(P[1]-F[1])*.13,(F[1]+P[1])/2+(P[0]-F[0])*.13]:null;
    svg.insertAdjacentHTML('beforeend',
      `<path class="vg-trail" fill="none" d="${F&&dist>1?`M${F[0]} ${F[1]}Q${ctrl[0]} ${ctrl[1]} ${P[0]} ${P[1]}`:'M0 0'}"/>`
      +(F?`<g class="vg-pin vg-from"><circle class="jm-ring" r="14"/><text class="jm-num" y="5" text-anchor="middle">${from+1}</text></g>`:'')
      +`<g class="vg-pin vg-to" style="opacity:0"><circle class="jm-ring" r="14"/><text class="jm-num" y="5" text-anchor="middle">${to+1}</text></g>`
      +`<circle class="vg-pen" r="8" style="opacity:0"/>`);
    const trail=svg.querySelector('.vg-trail'),gFrom=svg.querySelector('.vg-from'),gTo=svg.querySelector('.vg-to'),pen=svg.querySelector('.vg-pen');
    const len=trail.getTotalLength?trail.getTotalLength():0;
    if(len){trail.style.strokeDasharray=len;trail.style.strokeDashoffset=len;}

    // Camera: viewBox theo tỉ lệ màn hình; ghim, ngòi bút và nét mực giữ cỡ cố định trên màn hình bất kể độ phóng
    const isl=[...svg.querySelectorAll('.jm-isl circle')];
    let camW=ZOOM;
    const setCam=(cx,cy,w)=>{
      camW=w;const h=w/A;svg.setAttribute('viewBox',`${(cx-w/2).toFixed(2)} ${(cy-h/2).toFixed(2)} ${w.toFixed(2)} ${h.toFixed(2)}`);
      const ppu=innerWidth/w,k=(18/ppu)/14;
      if(F)gFrom.setAttribute('transform',`translate(${F[0]} ${F[1]}) scale(${k})`);
      gTo.setAttribute('transform',`translate(${P[0]} ${P[1]}) scale(${k})`);
      trail.style.strokeWidth=(5/ppu).toFixed(3);pen.setAttribute('r',(9/ppu).toFixed(3));
      svg.style.setProperty('--u',(1/ppu).toFixed(5));isl.forEach(c=>c.setAttribute('r',(3.2/ppu).toFixed(3))); // nét, chữ và đảo giữ cỡ cố định trên màn hình
    };
    const tween=(ms,fn)=>new Promise(res=>{
      const t0=performance.now(),total=ms*(api.slow||1),f=now=>{if(skipped){fn(1);res();return;}const k=Math.min(1,(now-t0)/total);fn(k);k<1?requestAnimationFrame(f):res();};
      requestAnimationFrame(f);
    });

    // Bỏ qua: bấm, chạm, Enter, Space, Esc
    const onSkip=e=>{if(e.type==='keydown'){if(!/^(Enter| |Escape)$/.test(e.key))return;e.preventDefault();e.stopPropagation();}if(e.type==='pointerdown'){const kill=ev=>{ev.stopPropagation();ev.preventDefault();};addEventListener('click',kill,true);setTimeout(()=>removeEventListener('click',kill,true),600);}skipped=true;};
    addEventListener('pointerdown',onSkip,true);addEventListener('keydown',onSkip,true);

    // Thẻ điện tín: gõ chữ
    const place=D.scenes[to].place.name,sc=D.scenes[to];
    const line1=`CHẶNG ${to+1} · ${sc.date} · ${place.toUpperCase()}`,line2=chapterCard?`CHƯƠNG ${sc.chapter+1} · ${D.chapters[sc.chapter].name.toUpperCase()}`:sc.title;
    live.textContent=`Đang tới ${place}`;
    const type=(el,txt,k)=>{el.textContent=txt.slice(0,Math.round(txt.length*clamp(k,0,1)));};

    (async()=>{
      // A. Tờ cũ thu về ghim, bản đồ hiện dần phía sau
      setCam((F||fullC)[0],(F||fullC)[1],F?ZOOM:fullW);
      let clone=null;
      if(sheet&&F){
        const r=sheet.getBoundingClientRect();
        clone=sheet.cloneNode(true);clone.removeAttribute('id');clone.querySelectorAll('[id]').forEach(e=>e.removeAttribute('id'));
        clone.classList.add('voyage-sheet');clone.style.cssText=`left:${r.left}px;top:${r.top}px;width:${r.width}px;height:${r.height}px`;
        ov.appendChild(clone);
        const dx=innerWidth/2-(r.left+r.width/2),dy=innerHeight/2-(r.top+r.height/2);
        clone.animate([{transform:'none',opacity:1},{transform:`translate(${dx*.7}px,${dy*.7}px) scale(.22) rotate(-5deg)`,opacity:1,offset:.7},{transform:`translate(${dx}px,${dy}px) scale(.02) rotate(-9deg)`,opacity:0}],{duration:560,easing:'cubic-bezier(.55,0,.35,1)',fill:'forwards'});
      }
      await tween(F?560:380,k=>{bg.style.opacity=mapEl.style.opacity=easeO(Math.min(1,k*1.7));});
      if(clone)clone.remove();
      bg.style.opacity=mapEl.style.opacity=1;

      // B. Camera kéo lùi, mực son chạy, thẻ điện tín
      const mid=F?[(F[0]+P[0])/2,(F[1]+P[1])/2]:fullC;
      const w1=chapterCard?fullW:near?Math.max(ZOOM*1.5,dist*2.4):clamp(dist*2.5,300,fullW);
      const c0=F||fullC,w0=F?ZOOM:fullW;
      card.classList.add('is-on');
      await tween(F&&!near?1000:F?620:700,k=>{
        const z=easeIO(clamp(k/.55,0,1));
        setCam(c0[0]+(mid[0]-c0[0])*z,c0[1]+(mid[1]-c0[1])*z,w0+(w1-w0)*z);
        if(len){
          const d=easeIO(clamp((k-.12)/.76,0,1));
          trail.style.strokeDashoffset=len*(1-d);
          const pt=trail.getPointAtLength(len*d);pen.setAttribute('cx',pt.x);pen.setAttribute('cy',pt.y);pen.style.opacity=d>0&&d<1?1:0;
        }
        type(l1,line1,(k-.15)/.5);type(l2,line2,(k-.5)/.4);
      });
      trail.style.strokeDashoffset=0;pen.style.opacity=0;type(l1,line1,1);type(l2,line2,1);

      // C. Camera lao vào điểm mới, ghim đóng xuống
      let stamped=false;
      await tween(560,k=>{
        const z=easeIO(k);
        setCam(mid[0]+(P[0]-mid[0])*z,mid[1]+(P[1]-mid[1])*z,w1+(ZOOM-w1)*z);
        if(k>=.8&&!stamped){stamped=true;gTo.style.opacity=1;gTo.classList.add('vg-stamp');if(!skipped&&sfx)sfx();}
      });
      gTo.style.opacity=1;
      if(!skipped)await new Promise(r=>setTimeout(r,220));

      // D. Dựng tờ mới bên dưới, mực loang mở ra từ ghim (tâm màn hình)
      swap();
      await new Promise(r=>requestAnimationFrame(()=>requestAnimationFrame(r)));
      card.classList.remove('is-on');
      const Rend=Math.hypot(innerWidth,innerHeight)*.75;
      await tween(680,k=>{
        const r=easeIO(k)*Rend,m=`radial-gradient(circle at 50% 50%, transparent ${r}px, #000 ${r+70+r*.12}px)`;
        ov.style.webkitMaskImage=ov.style.maskImage=m;
      });
      finished=true;
      removeEventListener('pointerdown',onSkip,true);removeEventListener('keydown',onSkip,true);
      ov.remove();live.remove();resolve();
    })();
  });
}
const api={run,slow:1}; // slow: hệ số làm chậm để quay thử (mặc định 1)
return api;
})();
