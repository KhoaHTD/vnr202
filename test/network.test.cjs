const test=require('node:test'),assert=require('node:assert/strict'),C=require('../src/js/network-core');
const solve=i=>{const t=C.build(i);t.forEach(v=>v.rotation=0);if(i===1){t[11].rotation=3;t[13].rotation=1;}return t;};
test('all three starts need interaction and all three have a feasible solution',()=>{for(let i=0;i<3;i++){assert.equal(C.trace(i,C.build(i)).success,false);assert.equal(C.trace(i,solve(i)).success,true);}});
test('adjacent rows cannot wrap into each other',()=>{assert.equal(C.neighbor(4,1),null);assert.equal(C.neighbor(5,3),null);assert.equal(C.neighbor(0,0),null);});
test('a one-sided connector does not transmit',()=>{const t=solve(0);t[11].rotation=2;assert.equal(C.trace(0,t).success,false);});
test('reaching the goal through public territory is still unsuitable',()=>{const t=solve(1);t[11].rotation=0;t[12].rotation=0;t[13].rotation=0;const r=C.trace(1,t);assert.deepEqual(r.reached,[14]);assert.deepEqual(r.exposed,[12]);assert.equal(r.success,false);assert.match(C.reason(1,r),/công khai/);});
test('both branches must deliver',()=>{const t=solve(2);t[19].rotation=1;const r=C.trace(2,t);assert.equal(r.reached.length,1);assert.equal(r.success,false);});
test('cyclic networks terminate without revisiting nodes',()=>{const t=solve(0);for(const tile of t)tile.base=[0,1,2,3];const r=C.trace(0,t);assert.equal(r.visited.length,25);assert.equal(new Set(r.visited).size,25);});
test('first attempt retained; correction has a distinct score',()=>{assert.equal(C.score([]),0);assert.equal(C.score([{success:false}]),0);assert.equal(C.score([{success:true}]),100);assert.equal(C.score([{success:false},{success:true}]),70);});
