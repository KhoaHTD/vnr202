(() => {
 'use strict';
 const $=id=>document.getElementById(id),canvas=$('world'),ctx=canvas.getContext('2d');
 const labels=['Vận động','Tập hợp','Phối hợp','Nắm thời cơ'];
 const explanations=[
  'Vận động giúp tập hợp sự tham gia của quần chúng. Màn chơi dùng sự xuất hiện của các nhóm dân để biểu đạt quá trình này, không tái dựng một sự kiện cụ thể.',
  'Trong mô hình này, cần vận động trước khi tập hợp. Người dân phải được kết nối với phong trào; bấm tập hợp ngay khi chưa chuẩn bị chưa đáp ứng điều kiện của màn chơi.',
  'Trong mô hình này, cần có lực lượng đã tập hợp để phối hợp hành động. Thứ tự ba thao tác là cách giản lược cho bản nháp, không phải một công thức lịch sử cố định.',
  'Bạn chưa nắm được tín hiệu trong lượt đầu. Màn chơi diễn đạt việc chủ động nắm thời cơ trên cơ sở lực lượng đã chuẩn bị. Khoảng 5 giây chỉ là quy ước gameplay, không phải độ dài thời cơ trong lịch sử.'
 ];
 let state,guide=false,last=performance.now(),clock=0,phaseTime=0,noticeTime=0,feedback=false;
 function reset(){state={phase:'intro',done:0,points:0,lost:[false,false,false,false],reasons:[null,null,null,null]};guide=false;feedback=false;phaseTime=0;clock=0;noticeTime=0;$('help').setAttribute('aria-expanded','false');for(const id of ['guide','feedback','opportunity','ending','results','notice'])$(id).hidden=true;$('intro').hidden=false;$('hotspots').hidden=true;$('stage').classList.add('locked');$('points').innerHTML='000 <small>ĐIỂM</small>';$('title').textContent='Trước giờ lịch sử.';$('era').textContent='THÁNG 8 · 1945';$('progress').textContent='CHUẨN BỊ / 01';$('hint').textContent='Một hành trình bắt đầu từ những con người.';document.querySelectorAll('[data-job]').forEach((b,i)=>{b.disabled=false;b.classList.remove('done');b.querySelector('span:last-child').textContent=labels[i];});}
 function notice(text,time=2400){$('notice').textContent=text;$('notice').hidden=false;noticeTime=time;}
 function setGuide(open){guide=open;$('guide').hidden=!open;$('help').setAttribute('aria-expanded',String(open));$('help').setAttribute('aria-label',open?'Ẩn hướng dẫn':'Bật hướng dẫn');if(open)$('resume').focus();else $('help').focus();last=performance.now();}
 function fail(title,message,task){state.lost[task]=true;if(!state.reasons[task])state.reasons[task]=message;feedback=true;$('feedback-title').textContent=title;$('feedback-text').textContent=message;$('feedback').hidden=false;$('retry').focus();}
 function score(task){if(!state.lost[task])state.points+=100;$('points').innerHTML=String(state.points).padStart(3,'0')+' <small>ĐIỂM</small>';}
 function job(i){if(state.phase!=='prepare'||guide||feedback||i<state.done)return;if(i!==state.done){fail('Chưa phù hợp.',i===1?'Người dân chưa được vận động. Hãy kết nối với họ trước khi tập hợp.':'Lực lượng chưa tập hợp. Hãy chuẩn bị trước khi phối hợp hành động.',i);return;}score(i);state.done++;const b=document.querySelector(`[data-job="${i}"]`);b.classList.add('done');b.disabled=true;b.querySelector('span:last-child').textContent='Đã '+labels[i].toLowerCase();notice(['Người dân đang tham gia.','Lực lượng đã tập hợp.','Các nhóm đã sẵn sàng.'][i]);$('hint').textContent=['Những nhóm người bắt đầu kết nối.','Cùng nhau, sức mạnh lớn hơn.','Quan sát khu phố.'][i];if(state.done===3){state.phase='warning';phaseTime=0;$('progress').textContent='THỜI CƠ / 02';$('title').textContent='Khoảnh khắc đang đến.';notice('Thời cơ sắp xuất hiện…',2500);}}
 function catchSignal(){if(state.phase!=='flying'||guide||feedback||document.hidden)return;score(3);state.phase='march';phaseTime=0;$('opportunity').hidden=true;$('hotspots').hidden=true;notice('Đã nắm thời cơ.',2200);$('hint').textContent='Lực lượng cùng hành động.';$('title').textContent='Cùng đứng lên.';$('progress').textContent='HÀNH ĐỘNG / 03';}
 function nextEnding(){if(state.phase==='victory'){state.phase='declaration';phaseTime=0;$('era').textContent='2 / 9 / 1945';$('title').textContent='Một nước Việt Nam mới.';$('ending').innerHTML='<span class="overline">NGÀY 2 THÁNG 9 NĂM 1945</span><h2>Nước Việt Nam<br>Dân chủ Cộng hòa ra đời.</h2><p>Độc lập là thành quả của cả một hành trình.</p><button class="primary" id="view-score">Xem hành trình của bạn →</button>';$('view-score').onclick=showResults;} }
 function showResults(){state.phase='results';$('ending').hidden=true;$('results').hidden=false;$('results').innerHTML=`<h2>Hành trình của bạn</h2><p class="total">${state.points} <small>/ 400 điểm</small></p>${labels.map((label,i)=>`<details><summary>${label}<span>${state.lost[i]?'Đã thử lại · 0 điểm':'Phù hợp lần đầu · 100 điểm'} ↓</span></summary><p>${state.reasons[i]||explanations[i]}</p>${state.reasons[i]?`<p>${explanations[i]}</p>`:''}</details>`).join('')}<p style="color:#a9bbb2;font-size:12px;line-height:1.6">Bản nháp tương tác. Cảnh, nhân vật và trình tự thao tác là minh họa giản lược; chưa phải bản nội dung lịch sử hoàn chỉnh.</p>`;$('results').scrollIntoView({behavior:matchMedia('(prefers-reduced-motion: reduce)').matches?'instant':'smooth'});}
 $('start').onclick=()=>{$('intro').hidden=true;$('hotspots').hidden=false;$('stage').classList.remove('locked');state.phase='prepare';$('hint').textContent='Chạm vào một hoạt động trong khu phố.';document.querySelector('[data-job="0"]').focus();};
 document.querySelectorAll('[data-job]').forEach(b=>b.onclick=()=>job(Number(b.dataset.job)));
 $('help').onclick=()=>setGuide(!guide);$('resume').onclick=()=>setGuide(false);
 $('retry').onclick=()=>{feedback=false;$('feedback').hidden=true;if(state.phase==='miss'){state.phase='warning';phaseTime=0;notice('Thời cơ sắp xuất hiện…',2500);$('opportunity').hidden=true;$('help').focus();}else document.querySelector(`[data-job="${state.done}"]`)?.focus();};
 $('opportunity').onclick=catchSignal;
 $('restart').onclick=()=>{if(state.phase==='intro'||state.phase==='results'||confirm('Bắt đầu lượt mới và đặt lại điểm?')){reset();window.scrollTo({top:0,behavior:'instant'});}};
 document.addEventListener('keydown',e=>{if(e.key==='Escape'&&guide){setGuide(false);return;}if(e.code==='Space'&&state.phase==='flying'&&!guide&&!feedback&&!['BUTTON','A','INPUT'].includes(document.activeElement.tagName)){e.preventDefault();catchSignal();}else if(e.code==='Space'&&state.phase==='flying'&&!guide&&!feedback&&document.activeElement===$('help')){e.preventDefault();catchSignal();}});
 document.addEventListener('visibilitychange',()=>{last=performance.now();});
 // Pixel-native artwork: rectilinear buildings, sprites and foliage rendered at
 // integer coordinates. No external artwork, remote fonts or decorative UI particles.
 const rect=(x,y,w,h,c)=>{ctx.fillStyle=c;ctx.fillRect(Math.round(x),Math.round(y),Math.round(w),Math.round(h));};
 const poly=(points,c)=>{ctx.fillStyle=c;ctx.beginPath();points.forEach(([x,y],i)=>i?ctx.lineTo(Math.round(x),Math.round(y)):ctx.moveTo(Math.round(x),Math.round(y)));ctx.closePath();ctx.fill();};
 function person(x,y,seed=0,walking=false,flag=false,scale=2){const s=scale,bob=walking?Math.floor(Math.sin(clock/130+seed)*1.5):0;ctx.save();ctx.translate(Math.round(x),Math.round(y+bob));const r=(a,b,w,h,c)=>rect(a*s,b*s,w*s,h*s,c);r(-5,13,12,2,'#615e4e40');const pants=['#3d5054','#4a5551','#465879'][seed%3],shirt=['#d5c49d','#a09d80','#b28365','#76958a','#b7bb91'][seed%5];const step=walking?Math.round(Math.sin(clock/130+seed)*2):0;r(-3,8,3,6+step,pants);r(1,8,3,6-step,pants);r(-4,13+step,4,2,'#3a4542');r(1,13-step,4,2,'#3a4542');r(-4,0,9,9,shirt);r(-6,2,2,7,'#bb8f69');r(5,2,2,7,'#bb8f69');r(-3,-6,6,6,'#c99b73');r(-4,-8,8,3,'#3e4541');if(seed%3===0){r(-6,-6,12,2,'#dbcca0');r(-4,-8,8,2,'#e7d6ab');r(-2,-10,4,2,'#e7d6ab');}if(flag){r(7,-22,1,35,'#72533d');r(8,-22,18,12,'#b94736');star(17*s,-16*s,4*s,'#f0cd74');}ctx.restore();}
 function star(x,y,r,c){const p=[];for(let i=0;i<10;i++){const a=-Math.PI/2+i*Math.PI/5,q=i%2?r*.4:r;p.push([x+Math.cos(a)*q,y+Math.sin(a)*q]);}poly(p,c);}
 function tree(x,y,s=1){rect(x-4*s,y-32*s,8*s,55*s,'#6b7050');rect(x-24*s,y-57*s,47*s,40*s,'#537b5b');rect(x-35*s,y-45*s,66*s,25*s,'#537b5b');rect(x-18*s,y-66*s,37*s,26*s,'#648d61');rect(x-26*s,y-42*s,24*s,18*s,'#739665');rect(x+8*s,y-36*s,25*s,14*s,'#426951');}
 function house(x,y,w,h,variant=0){rect(x+8,y+h,w,8,'#736e5540');rect(x,y,w,h,variant===1?'#dacb99':'#e5d6ad');rect(x+w-12,y,12,h,'#b8b185');rect(x,y+h-12,w,12,'#b9b18a');poly([[x-10,y],[x+4,y-35],[x+w-4,y-35],[x+w+13,y]],'#9c614b');rect(x-10,y-2,w+23,7,'#745547');for(let row=0;row<4;row++)for(let col=0;col<Math.floor(w/14);col++)rect(x+col*14+row%2*5,y-30+row*8,9,2,'#bd7c57');rect(x+Math.floor(w*.4),y+24,28,h-24,'#56635c');rect(x+Math.floor(w*.4)+3,y+27,21,h-27,'#344e4d');for(const wx of [x+12,x+w-32]){rect(wx,y+23,20,32,'#657a6a');rect(wx+3,y+26,14,24,'#a6b797');rect(wx+9,y+26,2,24,'#58695c');rect(wx+3,y+36,14,2,'#58695c');}rect(x-4,y+h,w+8,5,'#c3b991');}
 function draw(){const mobile=matchMedia('(max-width:700px)').matches,W=mobile?480:960,H=mobile?600:540;if(canvas.width!==W||canvas.height!==H){canvas.width=W;canvas.height=H;}ctx.imageSmoothingEnabled=false;const ground=mobile?270:240;
 rect(0,0,W,H,'#b7cec1');rect(0,0,W,ground*.6,'#b9d4cf');rect(0,ground*.6,W,ground*.4,'#b6c8a8');
 // Distant skyline, cloud bands and garden plots establish the neighborhood.
 for(let i=0;i<8;i++){const x=i*W/7;rect(x,ground-72-(i%3)*9,W/7-7,90,'#91ac99');poly([[x-4,ground-72-(i%3)*9],[x+25,ground-94-(i%3)*9],[x+W/7,ground-72-(i%3)*9]],'#7e9b8c');}
 rect(W*.12,65,W*.15,10,'#dbe5cf');rect(W*.15,57,W*.09,8,'#dbe5cf');rect(W*.64,85,W*.2,8,'#dbe5cf');rect(W*.7,77,W*.11,8,'#dbe5cf');
 rect(0,ground,W,H-ground,'#a1ad7c');poly([[0,ground+105],[W*.4,ground+45],[W,ground+140],[W,H],[0,H]],'#c7b68a');poly([[0,H-65],[W*.45,ground+98],[W,H-110],[W,H],[0,H]],'#cdbb91');
 const buildingW=mobile?120:175,buildingH=mobile?85:105,hy=ground-70;
 house(W*.06,hy,buildingW,buildingH,0);house(W*.42,hy-22,buildingW*.9,buildingH+8,1);house(W*.78,hy-48,buildingW,buildingH+20,0);
 // Clothes drying, benches, baskets and shared courtyard belong to daily life.
 rect(W*.08,hy+buildingH+18,5,36,'#756c50');rect(W*.32,hy+buildingH+18,5,36,'#756c50');rect(W*.08,hy+buildingH+19,W*.24,2,'#7c795c');for(let j=0;j<3;j++)rect(W*.12+j*W*.055,hy+buildingH+20,14,19,['#e1d3a2','#718d85','#ad7f64'][j]);
 rect(W*.52,ground+115,54,7,'#837854');rect(W*.53,ground+122,5,16,'#74684c');rect(W*.6,ground+122,5,16,'#74684c');
 for(let i=0;i<4;i++){rect(W*.88+i*8,ground+115+i%2*5,14,13,'#a88e5f');rect(W*.88+i*8,ground+117+i%2*5,14,2,'#ceb782');}
 tree(W*.015,ground+60,1.3);tree(W*.72,ground+28,mobile?.85:1.1);tree(W*.98,H-52,1.4);tree(W*.03,H-40,1.5);
 for(let k=0;k<6;k++){const x=(k*149+67)%W;rect(x,H-25-(k%2)*15,30,3,'#879766');rect(x+8,H-32-(k%2)*15,3,8,'#879766');}
 const moving=['march','victory','declaration','results'].includes(state.phase),count=state.done===0?8:state.done===1?19:34;
 let people=[];for(let i=0;i<count;i++){
  let x,y;
  if(state.done<2){x=W*(.14+((i*37)%73)/100);y=ground+80+(i*41)%130;}else{x=W*.26+(i%9)*(mobile?24:40);y=ground+130+Math.floor(i/9)*27;}
  if(moving){const t=Math.min(phaseTime/3500,1);x+=(W*.15)*t;y-=35*t;}
  const walk=state.done===1||state.phase==='march';if(walk){x+=Math.sin(clock/1500+i)*9;y+=Math.cos(clock/1900+i)*4;}
  people.push({x,y,i,walk});}
 people.sort((a,b)=>a.y-b.y).forEach(p=>person(p.x,p.y,p.i,p.walk,state.done>=3&&p.i%11===0,mobile?1.7:2));
 if(state.phase==='declaration'||state.phase==='results'){
  const px=W*.48,py=ground+70;rect(px-3,55,6,py-55,'#6d6451');rect(px+3,55,70,45,'#bb4636');star(px+38,77,12,'#f0cb70');rect(px-48,py,96,34,'#b5a57c');rect(px-60,py+34,120,10,'#a9956f');person(px,py-27,1,false,false,2);rect(px-18,py-18,36,24,'#7c6450');
 }
 }
 function tick(now){const dt=now-last;last=now;const paused=guide||feedback||document.hidden;if(!paused){clock+=dt;phaseTime+=dt;if(noticeTime>0){noticeTime-=dt;if(noticeTime<=0)$('notice').hidden=true;}
  if(state.phase==='warning'&&phaseTime>=2500){state.phase='flying';phaseTime=0;$('opportunity').hidden=false;$('notice').hidden=true;$('opportunity').focus({preventScroll:true});}
  if(state.phase==='flying'){const t=phaseTime/5000;$('opportunity').style.left=(-16+t*132)+'%';$('opportunity').style.top=(24+Math.sin(t*Math.PI*4)*3.2)+'%';if(t>=1){state.phase='miss';$('opportunity').hidden=true;fail('Thời cơ đã qua.','Tín hiệu đã rời khu phố. Thử lại để tiếp tục hành trình; mục này không còn được điểm.',3);}}
  if(state.phase==='march'&&phaseTime>=4000){state.phase='victory';$('ending').hidden=false;$('ending').innerHTML='<span class="overline">THÁNG TÁM NĂM 1945</span><h2>Tổng khởi nghĩa<br>thắng lợi.</h2><p>Sự chuẩn bị. Sức mạnh quần chúng. Thời cơ.</p><button class="primary" id="continue-history">Ngày độc lập →</button>';$('continue-history').onclick=nextEnding;$('continue-history').focus();$('hint').textContent='Hành trình đi tới ngày độc lập.';}
 }draw();requestAnimationFrame(tick);}
 window.PixelDraft=Object.freeze({state:()=>JSON.parse(JSON.stringify({...state,guide,feedback,phaseTime})),duration:5000});
 reset();requestAnimationFrame(tick);
})();
