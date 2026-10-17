'use strict';
const test=require('node:test'),assert=require('node:assert/strict'),fs=require('node:fs'),path=require('node:path');
const {createGameServer}=require('../server.cjs'),{MEDIA}=require('../src/js/story-ending');

test('the local server streams the original media with MIME, HEAD and seekable range responses',async t=>{
 const server=createGameServer();await new Promise(resolve=>server.listen(0,'127.0.0.1',resolve));t.after(()=>new Promise(resolve=>{server.close(resolve);server.closeAllConnections();}));
 const base='http://127.0.0.1:'+server.address().port;
 for(const [kind,file] of Object.entries(MEDIA)){
  const size=fs.statSync(path.join(__dirname,'..',file)).size,url=base+'/'+encodeURI(file),type=kind==='anthem'?'audio/mpeg':'video/mp4';
  const head=await fetch(url,{method:'HEAD'});assert.equal(head.status,200);assert.equal(head.headers.get('content-type'),type);assert.equal(Number(head.headers.get('content-length')),size);assert.equal(head.headers.get('accept-ranges'),'bytes');assert.equal((await head.arrayBuffer()).byteLength,0);
  const response=await fetch(url,{headers:{Range:'bytes=0-31'}});assert.equal(response.status,206);assert.equal(response.headers.get('content-range'),`bytes 0-31/${size}`);assert.equal(response.headers.get('content-type'),type);const first=Buffer.from(await response.arrayBuffer());assert.equal(first.length,32);
  const fd=fs.openSync(path.join(__dirname,'..',file),'r'),expected=Buffer.alloc(32);fs.readSync(fd,expected,0,32,0);fs.closeSync(fd);assert.deepEqual(first,expected);
  const suffix=await fetch(url,{headers:{Range:'bytes=-16'}});assert.equal(suffix.status,206);assert.equal(suffix.headers.get('content-range'),`bytes ${size-16}-${size-1}/${size}`);assert.equal((await suffix.arrayBuffer()).byteLength,16);
  const invalid=await fetch(url,{headers:{Range:`bytes=${size}-`}});assert.equal(invalid.status,416);assert.equal(invalid.headers.get('content-range'),`bytes */${size}`);
 }
 const html=await fetch(base+'/');assert.equal(html.status,200);assert.match(html.headers.get('content-type'),/text\/html/);assert.match(await html.text(),/story-ending\.js/);
 const blocked=await fetch(base+'/%2e%2e%2fpackage.json');assert.equal(blocked.status,403);
});
