// Kiểm tra logic game bằng DOM giả lập (không cần trình duyệt). Chạy: node test-logic.cjs
const vm=require('node:vm'),fs=require('node:fs'),assert=require('node:assert/strict');
const KEY='august-game-v1';

// Tạo một môi trường trình duyệt giả tối thiểu cho mỗi lần chạy.
function boot({storage={},strip=false}={}){
  const elements=new Map();let cards=[],checks=[],details=[];
  class Element{
    constructor(id=''){this.id=id;this.dataset={};this.disabled=(id==='commit');this.attrs={};this.textContent='';this.html='';const cls=new Set();this.classList={add:c=>cls.add(c),remove:c=>cls.delete(c),contains:c=>cls.has(c)};}
    set innerHTML(s){this.html=s;for(const m of s.matchAll(/id="([^"]+)"/g))elements.set(m[1],new Element(m[1]));if(s.includes('data-card='))cards=[0,1,2].map(i=>{const e=new Element();e.dataset.card=String(i);return e;});if(s.includes('data-good='))checks=['true','false'].map(v=>{const e=new Element();e.dataset.good=v;return e;});if(s.includes('<details>'))details=Array.from({length:9},()=>new Element());}
    get innerHTML(){return this.html;}
    setAttribute(k,v){this.attrs[k]=String(v);} removeAttribute(k){delete this.attrs[k];}
    insertAdjacentHTML(_,s){this.html+=s;}
    querySelectorAll(s){return s==='[data-card]'?cards:s==='[data-good]'?checks:s==='details'?details:[];}
    querySelector(){return new Element();}
    addEventListener(_,f){this.onclick=f;}
    click(){if(!this.disabled)this.onclick?.({currentTarget:this,target:this,preventDefault(){}});}
    focus(){} scrollIntoView(){} showModal(){this.open=true;} close(){this.open=false;}
  }
  const get=id=>{if(!elements.has(id))elements.set(id,new Element(id));return elements.get(id);};
  const context={window:{scrollTo(){}},document:{body:{dataset:{}},getElementById:get,querySelector:()=>new Element(),createTextNode:s=>s,addEventListener(){},removeEventListener(){}},localStorage:{getItem:k=>storage[k]||null,setItem:(k,v)=>storage[k]=v},confirm:()=>true,console};
  vm.createContext(context);
  vm.runInContext(fs.readFileSync('content.js','utf8'),context);
  if(strip){ // bỏ hẳn mọi trường image: game phải chạy bình thường
    const D=context.window.GAME_DATA;delete D.homeImage;delete D.endingImage;
    D.chapters.forEach(c=>delete c.image);D.scenes.forEach(s=>delete s.image);D.records.forEach(r=>r.length=2);
  }
  vm.runInContext(fs.readFileSync('ui.js','utf8'),context);
  vm.runInContext(fs.readFileSync('game.js','utf8'),context);
  const saved=()=>JSON.parse(storage[KEY]);
  return {get,saved,cards:()=>cards,checks:()=>checks,storage};
}

// Chơi trọn 9 chặng. Ở chặng 8 chọn thẻ bẫy trước rồi chọn lại.
function playthrough(opts){
  const g=boot(opts),{get,saved}=g;
  get('start').click();get('chapter-go').click();
  for(let i=0;i<9;i++){
    if(i===2||i===4){
      g.checks()[1].click();assert.match(get('check-feedback').textContent,/Thử nghĩ/);
      g.checks()[0].click();assert.match(get('check-feedback').textContent,/Đúng/);
      get('next').click();assert.match(get('app').innerHTML,/chapter-intro/);get('chapter-go').click();
    }
    const cards=g.cards();
    assert.equal(cards.length,3);assert.equal(get('commit').disabled,true);
    cards[0].click();cards[1].click();
    // Thẻ thứ 3 bị khóa chọn nhưng KHÔNG bị disabled (không làm mờ)
    assert.equal(cards[2].attrs['aria-disabled'],'true');assert.equal(cards[2].disabled,false);
    if(i===7){
      const before={...saved().stats};
      cards[1].click();cards[2].click(); // chọn [0, 2]: thẻ 2 là bẫy "Chỉ cần Nhật đầu hàng"
      get('commit').click();
      assert.equal(saved().index,7,'chọn sai ở chặng 8 không được qua chặng');
      assert.deepEqual(saved().mistakes,['7-2'],'thẻ bẫy phải được ghi vào state.mistakes');
      assert.deepEqual(saved().stats,before,'lần chọn sai không được cộng điểm');
      assert.match(get('feedback').innerHTML,/Đảng đã chọn khác/);
      assert.match(get('feedback').innerHTML,/Lựa chọn của lịch sử: <b>Lực lượng đã chuẩn bị/);
      assert.match(cards[2].innerHTML,/Sai lầm lịch sử/);
      assert.equal(get('commit').textContent,'Xem lại và chọn lại');
      get('commit').click(); // gỡ khóa, chọn lại
      assert.equal(cards[0].disabled,false);assert.equal(get('commit').disabled,true);
      cards[0].click();cards[1].click();
      get('commit').click();
      assert.equal(saved().stats.ready,before.ready+2,'lần chọn đúng cộng đúng 2 điểm Chuẩn bị');
      assert.deepEqual(saved().mistakes,['7-2'],'không ghi trùng sai lầm');
    }else get('commit').click();
    assert.equal(saved().index,i+1);
    if(i!==7)assert.match(get('feedback').innerHTML,/class="deltas"/);
    get('commit').click(); // tiếp tục
  }
  const end=saved();
  assert.equal(end.history.length,9);assert.equal(end.finished,true);
  assert.ok(Object.values(end.stats).every(Number.isFinite));
  assert.match(get('app').innerHTML,/Bạn đã mắc 1 sai lầm/);
  return g;
}

// 1) Chơi đủ, có ảnh giữ chỗ
const g=playthrough();
// Lưu và tiếp tục: chạy lại game.js với cùng storage
const again=boot({storage:g.storage});again.get('resume').click();
assert.match(again.get('app').innerHTML,/Độc lập là thành quả/);
again.get('records').click();assert.equal(again.get('archive').open,true);

// 2) Bỏ hết trường image: không lỗi
playthrough({strip:true});

// 3) Save cũ chưa có mistakes: coi như mảng rỗng
const old=boot({storage:{[KEY]:JSON.stringify({index:3,stats:{people:4,base:4,reach:2,ready:0},history:[0,1,2].map(s=>({scene:s,picks:[0,1]})),finished:false})}});
old.get('resume').click();old.cards()[0].click();old.cards()[1].click();old.get('commit').click();
assert.deepEqual(old.saved().mistakes,[]);assert.equal(old.saved().index,4);

console.log('PASS: 9 chặng; thẻ thứ 3 không bị làm mờ; thẻ bẫy ghi vào mistakes; chặng 8 chọn lại, không cộng điểm lần sai; nhãn thay đổi chỉ số; câu hỏi cuối chương; màn mở chương; save/resume; save cũ không có mistakes; thiếu trường image. DOM giả lập, chưa kiểm tra bằng mắt.');
