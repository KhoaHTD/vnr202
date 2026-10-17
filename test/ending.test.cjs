'use strict';
const test=require('node:test'),assert=require('node:assert/strict'),fs=require('node:fs'),path=require('node:path');
const {MEDIA,TIMING,anthemLevel}=require('../src/js/story-ending');
const {byteRange}=require('../server.cjs');

test('the ending references the three supplied files without replacing them',()=>{
 for(const file of Object.values(MEDIA))assert.ok(fs.statSync(path.join(__dirname,'..',file)).isFile(),file);
 assert.match(MEDIA.flag,/\.mp4$/);assert.match(MEDIA.speech,/\.mp4$/);assert.match(MEDIA.anthem,/\.mp3$/);
});
test('the cinematic has a two-second blackout and a three-second music overlap',()=>{
 assert.equal(TIMING.blackout,2000);assert.equal(TIMING.crossfade,3);assert.ok(TIMING.flagReveal>1000);assert.ok(TIMING.speechReveal>1000);
});
test('the anthem stays silent before the last three seconds, increases smoothly, and reaches full level at the end',()=>{
 assert.equal(anthemLevel(422),0);assert.equal(anthemLevel(3),0);assert.equal(anthemLevel(1.5),.5);assert.equal(anthemLevel(0),1);assert.equal(anthemLevel(-1),1);assert.equal(anthemLevel(NaN),0);assert.equal(anthemLevel(Infinity),0);
 let last=0;for(let remaining=3;remaining>=0;remaining-=.01){const level=anthemLevel(remaining);assert.ok(level>=last&&level>=0&&level<=1);last=level;}
});
test('byte ranges support video headers, open-ended seeks, suffixes, and clamping',()=>{
 assert.equal(byteRange(undefined,12000),null);assert.deepEqual(byteRange('bytes=0-31',12000),{start:0,end:31});assert.deepEqual(byteRange('bytes=10000-',12000),{start:10000,end:11999});assert.deepEqual(byteRange('bytes=-32',12000),{start:11968,end:11999});assert.deepEqual(byteRange('bytes=11990-99999',12000),{start:11990,end:11999});assert.deepEqual(byteRange('bytes=-99999',12000),{start:0,end:11999});
});
test('invalid, empty, out-of-bounds and multiple byte ranges are rejected',()=>{
 for(const range of ['bytes=12000-','bytes=90-40','bytes=-0','bytes=-','bytes=0-3,9-12','items=0-2','bytes=999999999999999999999-'])assert.equal(byteRange(range,12000),false,range);assert.equal(byteRange('bytes=0-',0),false);
});
