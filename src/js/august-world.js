/* Pixel-native scene painter. Fictional composite layouts; named sites are interpretive sketches. */
(function(root){'use strict';let g,scene=0,frame=0,tick=0,city=0;
    const R=(x,y,w,h,col)=>{g.fillStyle=col;g.fillRect(Math.round(x),Math.round(y),Math.round(w),Math.round(h));};
    const P=(pts,col)=>{g.fillStyle=col;g.beginPath();pts.forEach((p,i)=>i?g.lineTo(...p):g.moveTo(...p));g.closePath();g.fill();};
    function star(x,y,r=5){const p=[];for(let k=0;k<10;k++){const a=k*Math.PI/5-Math.PI/2,q=k%2?r*.4:r;p.push([Math.round(x+Math.cos(a)*q),Math.round(y+Math.sin(a)*q)]);}P(p,'#f5d383');}
    function person(x,y,seed=0,action='stand',flag=false){
      g.save();g.translate(Math.round(x),Math.round(y+(action==='walk'?Math.sin(tick/130+seed)*1.4:0)));R(-5,13,13,2,'#7b795c55');
      const shirt=['#b7b797','#718d88','#b18a6b','#d7c49d','#858b9c'][seed%5],pants=['#40565b','#5b6157','#4a546b'][seed%3];
      const walking=action==='walk';R(-3,7,3,walking?8:7,pants);R(1,7,3,walking?6:7,pants);R(-4,14,4,2,'#394d4d');R(1,walking?12:14,4,2,'#394d4d');
      R(-4,0,9,8,shirt);R(-3,-6,6,6,'#c49b78');R(-4,-8,8,3,'#414c43');
      if(seed%3===0){R(-6,-6,12,2,'#d4c99f');R(-4,-8,8,2,'#e8dab0');R(-2,-10,4,2,'#e8dab0');}
      R(-6,2,2,action==='talk'?3:6,'#c49b78');
      if(action==='talk'||action==='pass'){R(5,2,7,2,'#c49b78');if(action==='pass')R(9,-1,9,6,'#eee0b2');}else if(action==='read'){R(5,2,2,3,'#c49b78');R(-2,2,10,7,'#eee0b2');R(3,3,1,5,'#b7ab85');}else R(5,2,2,6,'#c49b78');
      if(action==='carry'){R(-7,1,15,10,'#ad945f');R(-6,4,13,1,'#d0b67b');R(7,2,2,6,'#c49b78');}
      if(flag){R(7,-24,1,39,'#756045');R(8,-24,20,13,'#b64e3d');star(18,-17,4);}
      g.restore();
    }
    function tree(x,y,s=1){R(x-2*s,y-18*s,4*s,38*s,'#747a57');R(x-17*s,y-37*s,35*s,29*s,'#608762');R(x-24*s,y-28*s,48*s,17*s,'#608762');R(x-10*s,y-44*s,23*s,18*s,'#729668');R(x+7*s,y-20*s,17*s,11*s,'#4c7658');}
    function house(x,y,w=90,h=70,col='#d8c89c'){R(x+4,y+h,w,5,'#7a795a40');R(x,y,w,h,col);R(x+w-6,y,6,h,'#b1ad85');P([[x-6,y],[x+3,y-21],[x+w-3,y-21],[x+w+7,y]],'#9d634c');R(x-6,y,w+13,4,'#785c49');for(let r=0;r<3;r++)for(let k=0;k<w/10;k++)R(x+k*10+(r%2)*4,y-17+r*6,6,1,'#bf835c');R(x+w*.42,y+17,20,h-17,'#415d58');for(const wx of [x+9,x+w-25]){R(wx,y+18,15,23,'#82977a');R(wx+6,y+18,2,23,'#536e5e');R(wx,y+28,15,2,'#536e5e');}R(x-3,y+h,w+6,3,'#beb18b');}
    function base(forest=false,dark=false){R(0,0,480,270,dark?'#9cb5ae':'#b7d1c7');R(0,90,480,60,forest?'#7e9e78':'#a6bb9c');for(let k=0;k<6;k++)P([[k*90-20,120],[k*90+25,85+(k%3)*8],[k*90+95,120]],forest?'#668865':'#97b096');R(0,145,480,125,forest?'#8f9d72':'#b3b17e');P([[0,205],[200,167],[480,216],[480,270],[0,270]],forest?'#b7ac82':'#cdbc93');R(58,32,74,5,'#dce5d2');R(76,26,39,6,'#dce5d2');R(343,45,65,6,'#dce5d2');}
    function crowd(count,x=115,y=184,cols=10,flags=false){const p=[];for(let i=0;i<count;i++)p.push({x:x+(i%cols)*22,y:y+Math.floor(i/cols)*21,i});p.sort((a,b)=>a.y-b.y).forEach(p=>person(p.x,p.y,p.i,'stand',flags&&p.i%13===0));}
    function meeting(){base(true);tree(25,150,1.4);tree(450,150,1.6);P([[110,96],[129,68],[330,68],[360,96]],'#8a8b61');R(120,96,8,92,'#796e4d');R(338,96,8,92,'#796e4d');R(128,102,210,68,'#6b7d5d');R(135,145,190,42,'#afa57d');R(164,154,135,9,'#8d7856');R(174,162,5,24,'#77674b');R(285,162,5,24,'#77674b');
      if(frame===0)person(94,180,1,'carry');else {for(let i=0;i<6;i++)person(145+i*32,148+(i%2)*18,i,frame===1&&i===2?'talk':'read');if(frame===2)person(380,194,2,'carry');}R(219,153,17,4,'#e0d1a2');}
    function admin(){
      if(city===1){R(106,115,268,62,'#b99561');R(112,105,256,11,'#b88b58');R(127,79,226,28,'#ac654b');for(let k=0;k<5;k++){P([[120+k*46,80],[133+k*46,67],[159+k*46,80]],'#8c654e');R(132+k*46,83,19,24,'#d5af70');R(137+k*46,90,9,17,'#596555');}for(let k=0;k<3;k++)R(175+k*49,132,27,45,'#566251');R(99,177,282,5,'#c1a776');return;}
      if(city===2){R(114,91,252,84,'#d8d0a8');R(108,83,264,10,'#8a7a63');R(133,66,214,17,'#a88c6b');R(211,57,58,10,'#d0c39a');for(let row=0;row<2;row++)for(let k=0;k<9;k++){R(127+k*26,99+row*34,13,23,'#58756b');R(131+k*26,99+row*34,2,23,'#a3ac87');}R(214,133,53,42,'#4b655e');R(104,175,272,6,'#b8ac87');return;}
      R(115,96,250,77,'#dfd2a7');R(122,85,236,12,'#a89372');R(158,72,164,13,'#bcaa82');for(let i=0;i<6;i++){R(138+i*38,103,10,57,'#eee0b7');R(154+i*38,109,16,36,'#647e75');}R(212,112,56,54,'#536b62');R(106,170,268,7,'#b4a27d');R(100,177,280,5,'#cbbc91');}

function draw(canvas,sceneIndex,stage,clock=0,animation=null,mobile=false,variant=0){const H=mobile?350:270;if(canvas.width!==960||canvas.height!==H*2){canvas.width=960;canvas.height=H*2;}g=canvas.getContext('2d');g.setTransform(2,0,0,2,0,0);g.imageSmoothingEnabled=false;scene=sceneIndex;frame=stage;tick=clock;city=variant;

      g.imageSmoothingEnabled=false;base();
      if(scene===0){
        if(frame===0){R(24,112,143,68,'#b8b69c');R(42,54,18,65,'#8a8f7d');P([[17,111],[63,88],[97,111],[133,88],[175,111]],'#747f76');R(82,139,35,41,'#576d66');house(330,118,95,63);for(let i=0;i<8;i++)person(70+(i%10)*25,195,i);tree(464,190);}
        else if(frame===1){house(36,109,107,73);house(323,107,115,75);tree(278,148);R(168,188,120,7,'#99805c');R(179,195,5,25,'#7b6a4e');R(274,195,5,25,'#7b6a4e');person(191,180,1,'read');person(225,181,3,'talk');person(260,181,4,'read');person(176,219,2,'read');person(216,223,3);person(252,221,0,'read');person(304,216,5,'carry');}
        else{house(155,101,177,86,'#c7bd93');R(216,119,68,53,'#536e61');R(218,121,64,49,'#85916d');person(229,151,1,'read');person(259,152,3,'talk');person(335,207,4,'carry');tree(62,187,1.4);}
      }else if(scene===1){
        if(frame<2){house(25,100,110,80);house(328,94,115,89);R(169,180,122,9,'#9c815b');R(177,189,6,25,'#7f6c4f');R(279,189,6,25,'#7f6c4f');R(225,174,27,6,'#e8dbb0');person(210,171,1,'read');person(177,198,3,'pass');if(frame)for(let i=0;i<10;i++)person(315+(i%4)*25,194+Math.floor(i/4)*23,i,i%2?'read':'talk');}
        else{admin();crowd(40,110,182,12,false);}
      }else if(scene===2)meeting();
      else if(scene===3){house(27,105,110,80);house(339,98,103,87);tree(289,156);const count=frame===0?5:frame===1?14:21;for(let i=0;i<count;i++){let x=115+(i%9)*25,y=187+Math.floor(i/9)*25;if(frame===2){x=70+(i%12)*28;y=190+Math.floor(i/12)*35;}person(x,y,i,frame===0?'talk':frame===1?(i%3?'read':'talk'):(i%4?'walk':'carry'));}}
      else if(scene===4){base(true);for(let i=0;i<7;i++)tree(i*78,137,1.2);house(220,123,98,44,'#c5bd90');if(frame===0){person(95,200,0,'carry');person(125,198,3,'carry');person(270,193,4,'read');}else{for(let i=0;i<7;i++)person(63+i*22,195,i,'stand',frame===2&&i===0);for(let i=0;i<5;i++)person(275+i*25,213,i+1,i%2?'carry':'read');}}
      else if(scene===5){base(false,true);house(28,105,125,78,'#c9be96');house(325,102,125,81,'#c9be96');if(frame===0){crowd(7,170,205,7);person(350,181,4);}else if(frame===1){person(230,203,2,'walk');person(170,219,1);person(325,193,5,'stand');R(102,128,22,55,'#56645b');}else{R(172,160,110,7,'#987e59');person(188,172,2,'pass');person(220,173,3,'read');person(265,174,5,'talk');person(314,220,1,'walk');}}
      else if(scene===6){
        R(24,103,175,87,'#ccc199');P([[15,104],[41,73],[179,73],[210,104]],'#987250');R(17,103,190,5,'#735d47');R(73,130,75,60,'#4a5a4b');if(frame===0){R(74,131,73,59,'#8b7955');for(let i=0;i<6;i++)R(76+i*12,132,2,56,'#ab9369');R(100,156,22,4,'#554e3e');}
        else{R(59,133,14,55,'#8e7a55');for(let i=0;i<6;i++){R(86+(i%3)*20,152+Math.floor(i/3)*17,19,16,'#b39860');R(87+(i%3)*20,157+Math.floor(i/3)*17,16,2,'#d2b77c');}}
        R(343,188,90,7,'#9a825c');R(350,195,5,20,'#816e50');R(421,195,5,20,'#816e50');tree(456,147);
        if(frame===0){person(166,208,1);for(let i=0;i<7;i++)person(318+i%4*27,215+Math.floor(i/4)*20,i);}
        if(frame===1){person(77,185,0,'talk');person(128,194,3,'carry');person(192,204,2,'carry');person(253,214,4,'carry');person(321,213,1,'pass');person(364,211,6,'stand');person(404,215,3,'stand');}
        if(frame===2){person(122,199,3,'carry');person(211,207,2,'carry');person(350,204,1,'pass');person(380,212,6,'carry');person(422,234,0,'carry');R(350,179,28,9,'#c6ad75');}
      }else if(scene===7){house(175,107,129,74,'#d4c99f');tree(53,159);tree(432,162);if(frame===0){person(213,184,3);person(286,190,1);}else if(frame===1){crowd(22,94,197,11,true);}else{person(178,185,2,'read');person(213,185,4,'talk');person(267,186,1,'carry');person(320,211,0,'walk');person(360,215,5,'carry');R(303,97,2,63,'#7b674a');R(305,97,29,17,'#b9503c');star(320,105,5);}}
      else if(scene===8){if(frame===0){P([[98,104],[133,69],[347,69],[382,104]],'#8a7857');R(114,104,252,65,'#8a8b68');for(let i=0;i<5;i++)R(125+i*55,103,5,78,'#726447');crowd(22,139,187,10,true);}
        else{house(32,107,120,78);house(335,98,115,85);crowd(frame===1?24:32,105,193,11,true);if(frame===1){person(374,191,1,'read');}else{person(65,213,1,'walk');person(398,212,2,'pass');}}}
      else if(scene===9){admin();if(frame===0){for(let i=0;i<18;i++)person(40+i%9*44,207+Math.floor(i/9)*26,i,'walk',i%7===0);}else{crowd(frame===1?44:50,76,188,14,true);if(frame===2){R(328,60,2,47,'#786348');R(330,60,35,22,'#b74737');star(347,70,7);}}}
      else if(scene===10){R(0,95,480,77,'#9daf8f');for(let i=0;i<5;i++){tree(30+i*105,121,.8);}R(168,145,143,32,'#bd4637');R(168,138,143,9,'#e8c76d');R(183,130,113,10,'#d5b75e');R(232,50,3,81,'#827255');R(235,50,48,31,'#bd4637');star(259,65,9);person(240,124,3,'talk');R(226,126,29,22,'#9b7052');R(254,111,1,22,'#4d5e58');R(252,109,5,3,'#4d5e58');crowd(frame===0?40:frame===1?25:55,60,192,17,true);}

if(mobile){R(0,270,480,80,'#c3b48c');tree(24,304,1.2);tree(454,308,1.1);}
if(animation?.targets)animation.targets.forEach((p,i)=>person(p[0],p[1]+18,i+2));
if(animation&&animation.from&&animation.to){const p=Math.max(0,Math.min(1,animation.progress));const x=animation.from[0]+(animation.to[0]-animation.from[0])*p,y=animation.from[1]+(animation.to[1]-animation.from[1])*p;person(x,y,animation.seed||2,animation.carry?(/message|news|order|press|restore/.test(animation.taskId||'')?'read':'carry'):'walk');}
}
root.AugustWorld={draw};})(window);
