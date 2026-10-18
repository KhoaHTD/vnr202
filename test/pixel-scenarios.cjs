// Appended to the isolated CDP harness by the preview QA runner.
async function screenshotDraft(c,name){const dir=path.join(ROOT,'.qa','pixel');fs.mkdirSync(dir,{recursive:true});const shot=await c.call('Page.captureScreenshot',{format:'png'});fs.writeFileSync(path.join(dir,name+'.png'),Buffer.from(shot.data,'base64'));}
(async()=>{try{
 await ensureServer();const endpoint=await launchBrowser(),c=await newPage(endpoint,1440,1000);await navigate(c,BASE+'/pixel-draft.html');await screenshotDraft(c,'intro');await click(c,'#start');
 await click(c,'[data-job="2"]');assert.equal((await state(c)).lost[2],true);await click(c,'#retry');
 for(let i=0;i<3;i++)await click(c,`[data-job="${i}"]`);
 await eventually(async()=>(await state(c)).phase==='flying','flying opportunity');
 await click(c,'#help');const frozen=(await state(c)).phaseTime;await delay(800);assert.equal((await state(c)).phaseTime,frozen,'help did not pause timer');await screenshotDraft(c,'help');await click(c,'#resume');
 await eventually(async()=>(await state(c)).phase==='miss','opportunity leaves after five seconds',7000);assert.equal((await state(c)).lost[3],true);await screenshotDraft(c,'miss');await click(c,'#retry');
 await eventually(async()=>(await state(c)).phase==='flying'&&(await state(c)).phaseTime>1800,'opportunity visible');await screenshotDraft(c,'opportunity');await click(c,'#opportunity');
 await eventually(async()=>(await state(c)).phase==='victory','victory',6000);await click(c,'#continue-history');await screenshotDraft(c,'declaration');await click(c,'#view-score');assert.equal((await state(c)).points,200);assert.ok(await exists(c,'#results details'));await screenshotDraft(c,'results');
 const m=await newPage(endpoint,390,844);await navigate(m,BASE+'/pixel-draft.html');await click(m,'#start');await click(m,'[data-job="0"]');await screenshotDraft(m,'mobile');assert.equal(await m.evaluate('document.documentElement.scrollWidth>innerWidth'),false);await click(m,'#help');assert.ok(await m.evaluate('document.querySelector("#resume").getBoundingClientRect().bottom<=innerHeight'));await screenshotDraft(m,'mobile-help');
 assert.deepEqual(runtimeErrors,[]);assert.deepEqual(failedLocalRequests,[]);console.log('PASS: ordering feedback; 5-second expiry; help pause; retry earns no points; both historical ending frames; review; mobile layout. Screenshots .qa/pixel');
}catch(e){console.error(e);process.exitCode=1;}finally{await cleanup();}})();
