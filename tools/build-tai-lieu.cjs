/* Dựng trang tai-lieu.html và bản Word từ MỘT nguồn sạch: docs/tai-lieu-tham-khao.md.
   Chạy: npm run build:tai-lieu  (sửa nội dung thì sửa file .md rồi chạy lại; cả hai file sinh ra đều commit).
   Cấp tiêu đề: # = giai đoạn, ## = mục lớn, ### = tiểu mục. */
const fs=require('node:fs'),path=require('node:path');
const root=path.join(__dirname,'..');
const esc=s=>s.replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;').replace(/"/g,'&quot;');
const plain=t=>t.tokens?t.tokens.map(plain).join(''):(t.text||'');

(async()=>{
  const {marked}=await import('marked');
  const D=require('docx');
  const md=fs.readFileSync(path.join(root,'docs/tai-lieu-tham-khao.md'),'utf8');
  const tokens=marked.lexer(md);

  /* ---------- HTML ---------- */
  let n=0,phase=0,toc=[],open=false;
  const renderer={heading({tokens:tk,depth}){
    const inner=this.parser.parseInline(tk),text=plain({tokens:tk}),id='m'+(++n);
    toc.push({depth,text,id});
    if(depth===1){
      const [k,...rest]=text.split(/:\s+/);phase++;
      const head=`<header class="phase-head"><p class="kicker">${esc(k.replace(/\s*·\s*/,' · ').toUpperCase())}</p><h2 id="${id}">${esc(rest.join(': '))}</h2></header>`;
      const html=(open?'</section>':'')+`<section class="phase" aria-labelledby="${id}">${head}`;open=true;return html;
    }
    return `<h${depth+1} id="${id}">${inner}</h${depth+1}>`;
  }};
  marked.use({renderer,gfm:true});
  let body=marked.parser(tokens);if(open)body+='</section>';
  body=body.replace(/<table>/g,'<div class="table-wrap"><table>').replace(/<\/table>/g,'</table></div>');

  let tocHtml='',inList=false;
  for(const t of toc){
    if(t.depth===3)continue; // mục lục chỉ tới cấp ##, tiểu mục quá dài
    if(t.depth===1){tocHtml+=(inList?'</ol></li>':'')+`<li class="toc-phase"><a href="#${t.id}">${esc(t.text.split(/:\s+/)[0])}</a><ol>`;inList=true;}
    else tocHtml+=`<li><a href="#${t.id}">${esc(t.text)}</a></li>`;
  }
  tocHtml+='</ol></li>';

  const page=`<!doctype html>
<html lang="vi"><head><meta charset="UTF-8"><meta name="viewport" content="width=device-width,initial-scale=1"><meta name="theme-color" content="#1a120b"><title>Tài liệu tham khảo — Đường đến tháng Tám</title>
<link rel="preconnect" href="https://fonts.googleapis.com"><link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link href="https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,500..800;1,500..800&family=Lora:ital,wght@0,400..600;1,400..600&display=swap&subset=vietnamese" rel="stylesheet">
<link rel="stylesheet" href="src/css/tokens.css"><link rel="stylesheet" href="src/css/base.css"><link rel="stylesheet" href="src/css/tai-lieu.css">
</head><body class="doc-page">
<header class="top"><a class="brand" href="index.html">✦ <span>ĐƯỜNG ĐẾN<br><strong>THÁNG TÁM</strong></span></a><nav><a class="dl" href="docs/tai-lieu-tham-khao.docx" download>Tải bản Word (.docx)</a></nav></header>
<div class="doc-layout">
<nav class="toc" aria-label="Mục lục"><details open><summary>Mục lục</summary><ol>${tocHtml}</ol></details></nav>
<main class="paper" id="top"><div class="paper-topline"><span>TÀI LIỆU THAM KHẢO · ĐƯỜNG ĐẾN THÁNG TÁM</span><span>1930 — 1945</span></div>
<h1 class="doc-title">Tài liệu tham khảo</h1><p class="doc-sub">Tổng hợp ba giai đoạn, từ phong trào cách mạng 1930–1931 đến thắng lợi của Cách mạng tháng Tám 1945.</p>
${body}
<p class="back"><a href="#top">↑ Lên đầu trang</a> · <a href="hanh-trinh.html">Về trò chơi</a></p></main></div>
<script>(function(){var d=document.querySelector(".toc details"),m=matchMedia("(max-width:900px)");function f(){d.open=!m.matches}f();m.addEventListener("change",f);})();</script>
</body></html>
`;
  fs.writeFileSync(path.join(root,'tai-lieu.html'),page);

  /* ---------- DOCX ---------- */
  const FONT='Times New Roman',SZ=26;
  const runs=(tk,st={})=>tk.flatMap(t=>{
    if(t.type==='strong')return runs(t.tokens,{...st,bold:true});
    if(t.type==='em')return runs(t.tokens,{...st,italics:true});
    if(t.type==='br')return [new D.TextRun({break:1})];
    if(t.type==='escape'||t.type==='text'||t.type==='codespan'){
      if(t.tokens&&t.type==='text')return runs(t.tokens,st);
      return [new D.TextRun({text:t.text,font:FONT,size:SZ,...st})];
    }
    return t.tokens?runs(t.tokens,st):[new D.TextRun({text:t.raw||'',font:FONT,size:SZ,...st})];
  });
  const H=[null,D.HeadingLevel.HEADING_1,D.HeadingLevel.HEADING_2,D.HeadingLevel.HEADING_3];
  const para=(tk,extra={})=>new D.Paragraph({children:runs(tk),spacing:{after:120,line:300},...extra});
  const listItems=(list,level=0)=>list.items.flatMap(it=>{
    const out=[];
    for(const c of it.tokens){
      if(c.type==='text'||c.type==='paragraph')out.push(para(c.tokens,list.ordered?{numbering:{reference:'num',level}}:{bullet:{level}}));
      else if(c.type==='list')out.push(...listItems(c,Math.min(level+1,2)));
    }
    return out;
  });
  const cell=(c,head)=>new D.TableCell({children:[new D.Paragraph({children:runs(c.tokens,head?{bold:true}:{})})],shading:head?{fill:'EFDFB8',type:D.ShadingType.CLEAR,color:'auto'}:undefined,margins:{top:60,bottom:60,left:100,right:100}});
  const children=[
    new D.Paragraph({heading:D.HeadingLevel.TITLE,alignment:D.AlignmentType.CENTER,spacing:{after:120},children:[new D.TextRun({text:'TÀI LIỆU THAM KHẢO',font:FONT,size:40,bold:true,color:'8A2416'})]}),
    new D.Paragraph({alignment:D.AlignmentType.CENTER,spacing:{after:360},children:[new D.TextRun({text:'Đường đến tháng Tám (1930–1945)',font:FONT,size:28,italics:true})]}),
    new D.TableOfContents('Mục lục',{hyperlink:true,headingStyleRange:'1-2'}),
    new D.Paragraph({children:[new D.PageBreak()]}),
  ];
  for(const t of tokens){
    if(t.type==='heading'){
      children.push(new D.Paragraph({heading:H[t.depth],pageBreakBefore:false,spacing:{before:t.depth===1?360:240,after:120},keepNext:true,children:runs(t.tokens,{bold:true,color:t.depth===3?'2A1B0E':'8A2416'}).map(r=>r)}));
    }else if(t.type==='paragraph')children.push(para(t.tokens));
    else if(t.type==='list')children.push(...listItems(t));
    else if(t.type==='table'){
      children.push(new D.Table({width:{size:100,type:D.WidthType.PERCENTAGE},rows:[
        new D.TableRow({tableHeader:true,children:t.header.map(c=>cell(c,true))}),
        ...t.rows.map(r=>new D.TableRow({children:r.map(c=>cell(c,false))}))]}),new D.Paragraph({spacing:{after:120}}));
    }
  }
  const sty=(id,name,size,color)=>({id,name,basedOn:'Normal',next:'Normal',quickFormat:true,run:{font:FONT,size,bold:true,color},paragraph:{keepNext:true}});
  const doc=new D.Document({
    creator:'Đường đến tháng Tám',title:'Tài liệu tham khảo — Đường đến tháng Tám (1930–1945)',
    features:{updateFields:true},
    styles:{default:{document:{run:{font:FONT,size:SZ}}},paragraphStyles:[sty('Heading1','Heading 1',32,'8A2416'),sty('Heading2','Heading 2',28,'8A2416'),sty('Heading3','Heading 3',26,'2A1B0E')]},
    numbering:{config:[{reference:'num',levels:[0,1,2].map(l=>({level:l,format:'decimal',text:`%${l+1}.`,alignment:D.AlignmentType.LEFT,style:{paragraph:{indent:{left:720+l*360,hanging:360}}}}))}]},
    sections:[{properties:{page:{margin:{top:1134,bottom:1134,left:1417,right:1134}}},footers:{default:new D.Footer({children:[new D.Paragraph({alignment:D.AlignmentType.CENTER,children:[new D.TextRun({children:[D.PageNumber.CURRENT],font:FONT,size:22})]})]})},children}]
  });
  fs.writeFileSync(path.join(root,'docs/tai-lieu-tham-khao.docx'),await D.Packer.toBuffer(doc));
  console.log('OK:',toc.length,'tiêu đề →',phase,'giai đoạn; tai-lieu.html + docs/tai-lieu-tham-khao.docx');
})().catch(e=>{console.error(e);process.exit(1);});
