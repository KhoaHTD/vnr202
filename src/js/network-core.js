/* Fictional routing puzzles. Historical context lives in v2-content, never in the geometry. */
(function(root,factory){if(typeof module==='object'&&module.exports)module.exports=factory();else root.NetworkCore=factory();})(typeof globalThis!=='undefined'?globalThis:this,function(){
  'use strict';
  const W=5,H=5,delta=[-W,1,W,-1],names=['Bắc','Đông','Nam','Tây'];
  const levels=[
    {id:'relay',title:'Nối lại.',year:'1932–1935',tag:'KHÔI PHỤC',brief:'Nối đầu mối với cơ sở.',record:'r02',scene:'s02',source:10,goals:[14],exposed:[],paths:[[10,11,6,7,8,13,14]],turns:[]},
    {id:'shelter',title:'Giữ kín.',year:'1939–1941',tag:'THÍCH ỨNG',brief:'Đưa tin đến cơ sở. Tránh ô công khai.',record:'r05',scene:'s05',source:10,goals:[14],exposed:[12],paths:[[10,11,6,7,8,13,14],[11,12,13]],turns:[]},
    {id:'together',title:'Cùng đến.',year:'1941–1945',tag:'MỞ RỘNG',brief:'Một mạng nối tới cả hai cơ sở.',record:'r06',scene:'s06',source:10,goals:[4,24],exposed:[],paths:[[10,11,12,7,8,9,4],[12,17,18,19,24]],turns:[]}
  ];
  const neighbor=(i,d)=>{const n=i+delta[d];return n<0||n>=W*H||((d===1||d===3)&&Math.floor(n/W)!==Math.floor(i/W))?null:n;};
  function build(index){
    const l=levels[index],ports=Array.from({length:25},()=>[]);
    l.paths.forEach(path=>path.slice(1).forEach((b,j)=>{const a=path[j],d=[0,1,2,3].find(d=>neighbor(a,d)===b);if(!ports[a].includes(d))ports[a].push(d);if(!ports[b].includes((d+2)%4))ports[b].push((d+2)%4);}));
    // Unused pieces are deliberate decoys, not decoration. Fixed endpoints cannot turn.
    return ports.map((p,i)=>({base:p.length?p:(i%3===0?[0,2]:[0,1]),rotation:i===l.source||l.goals.includes(i)?0:(i*7+index+1)%4,fixed:i===l.source||l.goals.includes(i)}));
  }
  const ports=t=>t.base.map(d=>(d+t.rotation)%4);
  function trace(index,tiles){
    const l=levels[index],visited=[l.source],edges=[],queue=[l.source];
    while(queue.length){const a=queue.shift();for(const d of ports(tiles[a])){const b=neighbor(a,d);if(b===null||!ports(tiles[b]).includes((d+2)%4))continue;if(!edges.some(e=>e[0]===b&&e[1]===a))edges.push([a,b]);if(!visited.includes(b)){visited.push(b);queue.push(b);}}}
    const reached=l.goals.filter(i=>visited.includes(i)),exposed=l.exposed.filter(i=>visited.includes(i));
    return {visited,edges,reached,exposed,success:reached.length===l.goals.length&&!exposed.length};
  }
  function reason(index,r){const l=levels[index];if(r.exposed.length)return 'Tuyến đã đi qua ô công khai. Trong tình huống này, hoạt động cần chuyển sang bí mật; hãy tìm đường vòng qua các ô còn lại.';if(r.reached.length<l.goals.length)return l.goals.length===2?'Mạng chưa nối tới cả hai cơ sở. Một nhánh thông chưa đủ: cần dùng nút chia ba để đưa tin tới hai đầu mối.':'Đường truyền bị ngắt trước cơ sở. Hai đoạn liền nhau chỉ nối được khi cửa ra của đoạn trước khớp cửa vào của đoạn sau.';return 'Các đầu mối đã được nối và tuyến đáp ứng điều kiện của màn chơi.';}
  function score(attempts){if(!attempts.length||!attempts.at(-1).success)return 0;return attempts[0].success?100:70;}
  return {W,H,names,levels,neighbor,build,ports,trace,reason,score};
});
