(function(root,factory){if(typeof module==='object'&&module.exports)module.exports=factory();else root.StoryCore=factory();})(typeof globalThis!=='undefined'?globalThis:this,function(){
 'use strict';
 const create=(D,chapter)=>({version:D.version,chapter,index:0,finished:false,answers:{},signal:{phase:'idle',warning:0,elapsed:0,missed:false}});
 const question=(D,r)=>D.forChapter(r.chapter)[r.index];
 const attempts=(r,q)=>r.answers[q.id]||[];
 const resolved=(D,r)=>{const q=question(D,r);return attempts(r,q).at(-1)===q.answer;};
 function answer(D,r,id){const q=question(D,r);if(r.finished||!q||resolved(D,r)||!q.options.some(o=>o.id===id)||attempts(r,q).includes(id))return {accepted:false};const list=r.answers[q.id]||=([]);list.push(id);return {accepted:true,suitable:id===q.answer,points:list.length===1&&id===q.answer?D.points:0};}
 const requiresSignal=(D,r)=>r.chapter===2&&question(D,r).id===D.opportunityAfter;
 const canNext=(D,r)=>!r.finished&&resolved(D,r)&&(!requiresSignal(D,r)||r.signal.phase==='caught');
 function next(D,r){if(!canNext(D,r))return false;if(r.index===D.forChapter(r.chapter).length-1)r.finished=true;else r.index++;return true;}
 function startSignal(D,r){if(!requiresSignal(D,r)||!resolved(D,r)||r.signal.phase!=='idle')return false;r.signal.phase='warning';return true;}
 function tick(D,r,ms){if(!Number.isFinite(ms)||ms<0||!requiresSignal(D,r)||!resolved(D,r))return null;const s=r.signal,previous=s.phase;if(s.phase==='warning'){s.warning+=ms;if(s.warning>=2500){s.elapsed=s.warning-2500;s.warning=2500;s.phase='flying';}}else if(s.phase==='flying')s.elapsed+=ms;if(s.phase==='flying'&&s.elapsed>=5000){s.elapsed=5000;s.phase='missed';s.missed=true;}return previous===s.phase?null:s.phase;}
 function catchSignal(r){if(r.signal.phase!=='flying')return false;r.signal.phase='caught';return true;}
 function retrySignal(r){if(r.signal.phase!=='missed')return false;r.signal.phase='warning';r.signal.warning=0;r.signal.elapsed=0;return true;}
 const maxScore=(D,chapter)=>D.forChapter(chapter).length*D.points+(chapter===2?D.opportunityPoints:0);
 const score=(D,r)=>D.forChapter(r.chapter).reduce((n,q)=>n+(attempts(r,q)[0]===q.answer?D.points:0),0)+(r.chapter===2&&r.signal.phase==='caught'&&!r.signal.missed?D.opportunityPoints:0);
 const review=(D,r)=>D.forChapter(r.chapter).map(q=>({question:q,first:q.options.find(o=>o.id===attempts(r,q)[0])||null,attempts:attempts(r,q).slice(),points:attempts(r,q)[0]===q.answer?D.points:0}));
 function restore(D,raw){try{
  const input=typeof raw==='string'?JSON.parse(raw):raw;
  if(!input||input.version!==D.version||!Number.isInteger(input.chapter)||!D.chapters[input.chapter]||!Number.isInteger(input.index)||input.index<0||input.index>=D.forChapter(input.chapter).length||typeof input.finished!=='boolean'||!input.answers||typeof input.answers!=='object'||Array.isArray(input.answers))return null;
  const r=create(D,input.chapter),qs=D.forChapter(input.chapter);
  if(Object.keys(input.answers).some(id=>!qs.slice(0,input.index+1).some(q=>q.id===id)))return null;
  for(let i=0;i<=input.index;i++){r.index=i;const list=input.answers[qs[i].id]||[];if(!Array.isArray(list)||list.length>4)return null;for(const id of list)if(!answer(D,r,id).accepted)return null;if(i<input.index&&!resolved(D,r))return null;}
  const s=input.signal;
  if(!s||!['idle','warning','flying','missed','caught'].includes(s.phase)||typeof s.missed!=='boolean'||!Number.isFinite(s.warning)||s.warning<0||s.warning>2500||!Number.isFinite(s.elapsed)||s.elapsed<0||s.elapsed>5000)return null;
  if(s.phase==='idle'&&(s.warning!==0||s.elapsed!==0||s.missed))return null;
  if(s.phase==='warning'&&(s.warning>=2500||s.elapsed!==0))return null;
  if(['flying','caught','missed'].includes(s.phase)&&s.warning!==2500)return null;
  if(['flying','caught'].includes(s.phase)&&s.elapsed>=5000)return null;
  if(s.phase==='missed'&&(!s.missed||s.elapsed!==5000))return null;
  const signalIndex=qs.findIndex(q=>q.id===D.opportunityAfter);
  if(s.phase!=='idle'&&(r.chapter!==2||input.index<signalIndex||attempts(r,qs[signalIndex]).at(-1)!==qs[signalIndex].answer))return null;
  if(r.chapter===2&&input.index>signalIndex&&s.phase!=='caught')return null;
  r.signal={...s};if(input.finished&&(input.index!==qs.length-1||!canNext(D,r)))return null;r.finished=input.finished;return r;
 }catch{return null;}}
 return {create,question,attempts,resolved,answer,requiresSignal,canNext,next,startSignal,tick,catchSignal,retrySignal,maxScore,score,review,restore};
});
