/* Dựng bản đồ Việt Nam cho trò chơi: đọc dữ liệu Natural Earth (public domain), chiếu Mercator, đơn giản hóa, ghi ra src/js/map-data.js.
   Chạy tay một lần (không chạy lúc chơi):
     node tools/build-map.cjs <thư-mục-chứa-geojson>
   Thư mục cần có: ne_10m_admin_0_countries.geojson, ne_10m_rivers_lake_centerlines.geojson, ne_10m_lakes.geojson
   Tải từ https://github.com/nvkelso/natural-earth-vector/tree/master/geojson (Natural Earth, public domain). */
const fs=require('fs'),path=require('path');
const {geoMercator,geoPath}=require('d3-geo');
const dir=process.argv[2];if(!dir){console.error('Thiếu thư mục dữ liệu');process.exit(1);}
const read=f=>JSON.parse(fs.readFileSync(path.join(dir,f),'utf8'));

const LON=[100,116.5],LAT=[6.5,24],W=800;
const proj=geoMercator();
// chiếu khung để lấy tỉ lệ rồi cố định kích thước
const frame={type:'MultiPoint',coordinates:[[LON[0],LAT[0]],[LON[1],LAT[1]]]}; // hai góc khung (tránh vòng đa giác bị d3 hiểu là phần bù)
proj.fitWidth(W,frame);
const H=Math.round(geoPath(proj).bounds(frame)[1][1]-geoPath(proj).bounds(frame)[0][1]);
proj.translate([proj.translate()[0],proj.translate()[1]-geoPath(proj).bounds(frame)[0][1]]);
proj.clipExtent([[-2,-2],[W+2,H+2]]);
const gp=geoPath(proj).digits?geoPath(proj).digits(1):geoPath(proj);

const inFrame=g=>{let ok=false;const walk=a=>{if(typeof a[0]==='number'){if(a[0]>LON[0]&&a[0]<LON[1]&&a[1]>LAT[0]&&a[1]<LAT[1])ok=true;}else a.forEach(walk);};walk(g.coordinates||[]);return ok;};
const round=d=>d.replace(/-?\d+\.\d+/g,m=>String(Math.round(parseFloat(m)*10)/10));

// Douglas–Peucker trên tọa độ địa lý (độ), dung sai tol (độ)
function dp(pts,tol){
  if(pts.length<3)return pts;
  const keep=new Uint8Array(pts.length);keep[0]=keep[pts.length-1]=1;
  const st=[[0,pts.length-1]];
  while(st.length){
    const [a,b]=st.pop();let m=0,idx=-1;
    const [x1,y1]=pts[a],[x2,y2]=pts[b],dx=x2-x1,dy=y2-y1,L=dx*dx+dy*dy;
    for(let i=a+1;i<b;i++){
      const [x,y]=pts[i];let t=L?((x-x1)*dx+(y-y1)*dy)/L:0;t=Math.max(0,Math.min(1,t));
      const ex=x1+t*dx-x,ey=y1+t*dy-y,d=ex*ex+ey*ey;if(d>m){m=d;idx=i;}
    }
    if(m>tol*tol&&idx>0){keep[idx]=1;st.push([a,idx],[idx,b]);}
  }
  return pts.filter((_,i)=>keep[i]);
}
const simp=(g,tol)=>{
  const ring=r=>{const o=dp(r,tol);return o.length>=4||g.type==='LineString'||g.type==='MultiLineString'?o:r;};
  const f=a=>g.type==='LineString'?ring(a):a.map(ring);
  switch(g.type){
    case 'Polygon':return {type:g.type,coordinates:g.coordinates.map(ring)};
    case 'MultiPolygon':return {type:g.type,coordinates:g.coordinates.map(p=>p.map(ring))};
    case 'LineString':return {type:g.type,coordinates:ring(g.coordinates)};
    case 'MultiLineString':return {type:g.type,coordinates:g.coordinates.map(ring)};
  }return g;
};
const countries=read('ne_10m_admin_0_countries.geojson').features;
const NB={China:'Trung Quốc',Laos:'Lào',Cambodia:'Campuchia',Thailand:'Thái Lan',Myanmar:'Myanma',Malaysia:'Malaysia',Philippines:'Philippines',Taiwan:'Đài Loan',Indonesia:'Indonesia',Brunei:'Brunei'};
const vn=countries.find(f=>f.properties.NAME==='Vietnam');
const nb=countries.filter(f=>NB[f.properties.NAME]&&inFrame(f.geometry)).map(f=>({name:NB[f.properties.NAME],d:round(gp(simp(f.geometry,.03)))}));

const RIVERS={Hong:'Sông Hồng',Da:'Sông Đà',Ca:'Sông Cả',Mekong:'Sông Mê Kông',Lancang:'Sông Mê Kông',Ba:'Sông Ba',Srepok:'Sông Srêpôk',Krong:'Sông Krông',Kong:'Sông Kông','Tonle Sap':'Sông Tông Lê Sáp'};
const rivers=read('ne_10m_rivers_lake_centerlines.geojson').features.filter(f=>RIVERS[f.properties.name]&&inFrame(f.geometry))
  .map(f=>({name:RIVERS[f.properties.name],major:/Hong|Mekong|Lancang/.test(f.properties.name),d:round(gp(simp(f.geometry,.02)))})).filter(r=>r.d);
const lakes=read('ne_10m_lakes.geojson').features.filter(f=>/Tonl/.test(f.properties.name||'')&&inFrame(f.geometry)).map(f=>round(gp(simp(f.geometry,.02))));

// Lưới kinh vĩ độ 2°
const grat=[],ticks={lon:[],lat:[]};
for(let lon=LON[0]+0;lon<=LON[1];lon+=2){const a=proj([lon,LAT[0]]),b=proj([lon,LAT[1]]);grat.push(`M${a[0].toFixed(1)} ${a[1].toFixed(1)}L${b[0].toFixed(1)} ${b[1].toFixed(1)}`);ticks.lon.push({v:lon,x:+a[0].toFixed(1)});}
for(let lat=8;lat<=24;lat+=2){const a=proj([LON[0],lat]),b=proj([LON[1],lat]);grat.push(`M${a[0].toFixed(1)} ${a[1].toFixed(1)}L${b[0].toFixed(1)} ${b[1].toFixed(1)}`);ticks.lat.push({v:lat,y:+a[1].toFixed(1)});}

// Hoàng Sa và Trường Sa: cụm đảo vẽ tay theo tọa độ (lat, lon), không phụ thuộc phân loại của Natural Earth
const ISLANDS={
  hoangSa:{label:'Q. Hoàng Sa',at:[16.5,112.0],pts:[[16.54,111.62],[16.58,111.72],[16.45,111.55],[16.67,112.33],[16.50,112.27],[16.03,112.33],[16.08,112.58],[15.78,111.68],[16.23,112.53]]},
  truongSa:{label:'Q. Trường Sa',at:[9.0,113.5],pts:[[8.65,111.92],[8.84,112.22],[9.22,112.88],[9.37,113.52],[9.88,114.25],[10.38,114.30],[10.37,114.62],[10.18,114.45],[8.88,113.05],[10.75,115.82],[8.65,114.40],[10.91,115.34],[9.55,113.88]]}
};
const px=(lat,lon)=>{const p=proj([lon,lat]);return [+p[0].toFixed(1),+p[1].toFixed(1)];};
const isl={};for(const [k,v] of Object.entries(ISLANDS))isl[k]={label:v.label,at:px(...v.at),pts:v.pts.map(p=>px(...p))};

const k=proj.scale(),[tx,ty]=proj.translate();
const out={W,H,lon:LON,lat:LAT,k:+k.toFixed(3),tx:+tx.toFixed(3),ty:+ty.toFixed(3),vn:round(gp(simp(vn.geometry,.012))),nb,rivers,lakes,grat:grat.join(''),ticks,isl};
const js=`/* Sinh tự động bởi tools/build-map.cjs từ Natural Earth (public domain). Không sửa tay. */
window.MAP_DATA=${JSON.stringify(out)};
/* Chiếu (vĩ độ, kinh độ) → tọa độ SVG của bản đồ (Mercator, cùng tham số đã dùng để dựng) */
window.MAP_DATA.project=function(lat,lon){const d=window.MAP_DATA,r=Math.PI/180;return [d.tx+d.k*lon*r,d.ty-d.k*Math.log(Math.tan(Math.PI/4+lat*r/2))];};
`;
fs.writeFileSync(path.join(__dirname,'../src/js/map-data.js'),js);
console.log('OK',W+'x'+H,(js.length/1024).toFixed(0)+' KB','sông:',rivers.length,'láng giềng:',nb.length);
