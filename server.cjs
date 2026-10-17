const http=require('node:http'),fs=require('node:fs'),path=require('node:path');
const root=__dirname;
const mime={'.html':'text/html; charset=utf-8','.css':'text/css; charset=utf-8','.js':'text/javascript; charset=utf-8','.md':'text/plain; charset=utf-8','.svg':'image/svg+xml','.webp':'image/webp','.png':'image/png','.mp4':'video/mp4','.webm':'video/webm','.mp3':'audio/mpeg','.m4a':'audio/mp4','.wav':'audio/wav','.ogg':'audio/ogg'};

function byteRange(header,size){
 if(!header)return null;
 const match=/^bytes=(\d*)-(\d*)$/.exec(header);
 if(!match||!size||!match[1]&&!match[2])return false;
 let start,end;
 if(!match[1]){const suffix=Number(match[2]);if(!Number.isSafeInteger(suffix)||suffix<=0)return false;start=Math.max(0,size-suffix);end=size-1;}
 else{start=Number(match[1]);end=match[2]?Number(match[2]):size-1;}
 if(!Number.isSafeInteger(start)||!Number.isSafeInteger(end)||start<0||start>=size||end<start)return false;
 return {start,end:Math.min(end,size-1)};
}

function createGameServer(){return http.createServer(async(req,res)=>{
 if(!['GET','HEAD'].includes(req.method)){res.writeHead(405,{'Allow':'GET, HEAD'}).end();return;}
 let rel;try{rel=decodeURIComponent(new URL(req.url,'http://localhost').pathname);}catch{res.writeHead(400).end();return;}
 const target=path.resolve(root,'.'+(rel==='/'?'/index.html':rel));
 if(!target.startsWith(root+path.sep)){res.writeHead(403).end();return;}
 let stat;try{stat=await fs.promises.stat(target);}catch{res.writeHead(404).end('Not found');return;}
 if(!stat.isFile()){res.writeHead(404).end('Not found');return;}
 const range=byteRange(req.headers.range,stat.size);
 const headers={'Content-Type':mime[path.extname(target).toLowerCase()]||'application/octet-stream','Accept-Ranges':'bytes'};
 if(range===false){res.writeHead(416,{...headers,'Content-Range':`bytes */${stat.size}`,'Content-Length':0}).end();return;}
 const length=range?range.end-range.start+1:stat.size;
 headers['Content-Length']=length;
 if(range)headers['Content-Range']=`bytes ${range.start}-${range.end}/${stat.size}`;
 res.writeHead(range?206:200,headers);
 if(req.method==='HEAD'){res.end();return;}
 const stream=fs.createReadStream(target,range||{});
 stream.on('error',()=>res.destroy());res.on('close',()=>stream.destroy());stream.pipe(res);
});}

if(require.main===module){const port=Number(process.env.GAME_PORT)||5173;createGameServer().listen(port,'127.0.0.1',()=>console.log(`Game: http://127.0.0.1:${port}`));}
module.exports={createGameServer,byteRange};
