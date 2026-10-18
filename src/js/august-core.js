(function(root,factory){if(typeof module==='object'&&module.exports)module.exports=factory();else root.AugustCore=factory();})(typeof globalThis!=='undefined'?globalThis:this,function(){
 'use strict';
 const create=D=>({version:1,contentVersion:D.version,index:0,finished:false,scenes:{},signal:{phase:'idle',elapsed:0,warning:0}});
 function state(D,r,i=r.index){const s=D.scenes[i];return r.scenes[s.id]||(r.scenes[s.id]={events:[]});}
 const task=(D,r,id)=>D.scenes[r.index].tasks.find(t=>t.id===id);
 const done=(D,r,id)=>state(D,r).events.some(e=>e.taskId===id&&e.outcome==='suitable');
 function check(D,r,id){const t=task(D,r,id);if(r.finished||!t)return {ok:false,reason:'invalid'};if(done(D,r,id))return {ok:false,reason:'completed'};const missing=t.requires.filter(id=>!done(D,r,id));if(missing.length)return {ok:false,reason:'prerequisite',missing};if(t.kind==='signal'&&r.signal.phase!=='flying')return {ok:false,reason:'inactive'};return {ok:true};}
 function act(D,r,id){const c=check(D,r,id);if(!c.ok&&c.reason!=='prerequisite')return c;const e={taskId:id,outcome:c.ok?'suitable':'needs-review',reason:c.ok?'completed':'prerequisite'};state(D,r).events.push(e);if(c.ok&&task(D,r,id).kind==='signal')r.signal.phase='caught';return {ok:c.ok,event:{...e}};}
 function completed(D,r){return D.scenes[r.index].tasks.every(t=>done(D,r,t.id));}
 function next(D,r){if(r.finished||!completed(D,r))return false;if(r.index===D.scenes.length-1)r.finished=true;else r.index++;r.signal={phase:'idle',elapsed:0,warning:0};return true;}
 function tick(D,r,ms){if(r.finished||!Number.isFinite(ms)||ms<0)return null;const t=D.scenes[r.index].tasks.find(t=>t.kind==='signal');if(!t||done(D,r,t.id)||!t.requires.every(id=>done(D,r,id)))return null;
  if(r.signal.phase==='idle')r.signal.phase='warning';
  if(r.signal.phase==='warning'){r.signal.warning+=ms;if(r.signal.warning>=2500){const excess=r.signal.warning-2500;r.signal.warning=2500;r.signal.phase='flying';r.signal.elapsed=Math.min(5000,excess);}}
  else if(r.signal.phase==='flying')r.signal.elapsed=Math.min(5000,r.signal.elapsed+ms);
  if(r.signal.phase==='flying'&&r.signal.elapsed>=5000){r.signal.phase='missed';const e={taskId:t.id,outcome:'needs-review',reason:'missed'};state(D,r).events.push(e);return e;}return null;
 }
 function retry(r){if(r.signal.phase==='missed'){r.signal={phase:'warning',warning:0,elapsed:0};return true;}return false;}
 function review(D,r){return D.scenes.flatMap((s,i)=>s.tasks.map(t=>{const es=(r.scenes[s.id]?.events||[]).filter(e=>e.taskId===t.id),first=es[0];return {sceneId:s.id,sceneIndex:i,taskId:t.id,first:first?{...first}:null,attempts:es.length,completed:es.some(e=>e.outcome==='suitable'),points:first?.outcome==='suitable'?100:0};}));}
 const score=(D,r)=>review(D,r).reduce((n,e)=>n+e.points,0);
 function restore(D,raw){try{const input=typeof raw==='string'?JSON.parse(raw):raw;if(!input||input.version!==1||input.contentVersion!==D.version||!Number.isInteger(input.index)||input.index<0||input.index>=D.scenes.length||typeof input.finished!=='boolean'||!input.scenes||typeof input.scenes!=='object'||Array.isArray(input.scenes))return null;
  const r=create(D);for(let i=0;i<=input.index;i++){r.index=i;const es=input.scenes[D.scenes[i].id]?.events||[];if(!Array.isArray(es)||es.length>600)return null;for(const e of es){if(!e||!['taskId','outcome','reason'].every(k=>typeof e[k]==='string'))return null;const t=task(D,r,e.taskId);if(!t)return null;if(t.kind==='signal'){if(!t.requires.every(id=>done(D,r,id))||done(D,r,t.id))return null;if(e.reason==='missed'&&e.outcome==='needs-review'){state(D,r).events.push({...e});r.signal.phase='missed';continue;}r.signal.phase='flying';}const a=act(D,r,e.taskId);if(!a.event||a.event.outcome!==e.outcome||a.event.reason!==e.reason)return null;}
   if(i<input.index&&!completed(D,r))return null;
  }
  if(Object.keys(input.scenes).some(id=>!D.scenes.slice(0,input.index+1).some(s=>s.id===id)))return null;
  if(input.finished&&(input.index!==D.scenes.length-1||!completed(D,r)))return null;r.finished=input.finished;
  const sig=input.signal;if(!sig||!['idle','warning','flying','missed','caught'].includes(sig.phase)||!Number.isFinite(sig.elapsed)||sig.elapsed<0||sig.elapsed>5000||!Number.isFinite(sig.warning)||sig.warning<0||sig.warning>2500)return null;
  const st=D.scenes[r.index].tasks.find(t=>t.kind==='signal');if(st){const ready=st.requires.every(id=>done(D,r,id)),last=state(D,r).events.filter(e=>e.taskId===st.id).at(-1);if(sig.phase==='caught'&&!done(D,r,st.id)||sig.phase==='missed'&&last?.reason!=='missed'||['warning','flying'].includes(sig.phase)&&(!ready||done(D,r,st.id))||sig.phase==='flying'&&(sig.warning!==2500||sig.elapsed>=5000))return null;}else if(sig.phase!=='idle')return null;
  r.signal={...sig};return r;
 }catch{return null;}}
 return {create,state,done,check,act,completed,next,tick,retry,review,score,restore};
});
