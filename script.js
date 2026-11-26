const C={velvet:"#240046",amethyst:"#5A189A",gold:"#FF9E00"};
const $=id=>document.getElementById(id);
$("heart").onclick=()=>{const g=$("about");if(g.showModal)g.showModal();else g.setAttribute("open","")};
$("closeAbout").onclick=()=>$("about").close();
$("about").addEventListener("click",e=>{if(e.target===$("about"))$("about").close()});
function show(n){["main","timer","done"].forEach(s=>$("s-"+s).classList.toggle("on",s===n))}

/* ---------- the pixel cabinet, drawn by code on an 80x108 grid ---------- */
const GW=80,GH=108,VEL=[36,0,70],AME=[90,24,154],GOLD=[255,158,0],MID=[16,0,43];
const cv=$("cv"),cx=cv.getContext("2d"),img=cx.createImageData(GW,GH),base=new Uint8ClampedArray(GW*GH*4);
let buf=base;
const mk=()=>Array.from({length:GH},()=>new Uint8Array(GW));
const RG=[[0,1,24,43],[2,3,18,49],[4,5,13,54],[6,7,9,58],[8,9,6,61],[10,95,4,63],[96,99,2,65],[100,105,6,61]];
const m0=mk();RG.forEach(([a,b,x0,x1])=>{for(let y=a;y<=b;y++)for(let x=x0;x<=x1;x++)m0[y][x]=1});
const er=m=>{const o=mk();for(let y=1;y<GH-1;y++)for(let x=1;x<GW-1;x++)if(m[y][x]&&m[y-1][x]&&m[y+1][x]&&m[y][x-1]&&m[y][x+1])o[y][x]=1;return o};
const m1=er(er(m0)),m2=er(er(m1));
function px(x,y,c){const i=(y*GW+x)*4;buf[i]=c[0];buf[i+1]=c[1];buf[i+2]=c[2];buf[i+3]=255}
function rect(x,y,w,h,c){for(let j=0;j<h;j++)for(let i=0;i<w;i++)px(x+i,y+j,c)}
for(let y=0;y<GH;y++)for(let x=0;x<GW;x++){const c=m2[y][x]?VEL:m1[y][x]?AME:m0[y][x]?GOLD:null;if(c)px(x,y,c)}
rect(10,10,48,10,GOLD);rect(12,12,44,6,MID);                       /* sign */
[24,44,64].forEach(y=>{rect(9,y,50,17,GOLD);rect(11,y+2,46,13,MID);px(12,y+3,AME);px(13,y+3,AME);px(12,y+4,AME)}); /* reel frames */
[[7,23],[60,23],[7,81],[60,81]].forEach(([x,y])=>rect(x,y,2,2,GOLD));/* bolts */
rect(28,84,12,3,GOLD);rect(30,85,8,1,MID);                          /* coin slot */
[12,18,46,52].forEach(x=>{rect(x,84,5,5,GOLD);[[0,0],[4,0],[0,4],[4,4]].forEach(([a,b])=>px(x+a,84+b,VEL));rect(x+1,85,3,3,AME)});
rect(22,89,24,6,GOLD);rect(24,90,20,4,MID);                         /* tray */
rect(64,50,6,10,GOLD);rect(65,51,4,8,AME);                          /* lever mount */
let phase=0,lvr=0;
function render(){
  img.data.set(base);buf=img.data;
  for(let i=0;i<8;i++)rect(19+i*4,8,2,2,((i+phase)&1)?GOLD:MID);
  const ky=34+Math.round(11*lvr);
  rect(66,ky+8,2,Math.max(0,50-ky),GOLD);
  [[2,4],[1,6],[0,8],[0,8],[0,8],[0,8],[1,6],[2,4]].forEach(([o,w],j)=>rect(63+o,ky+j,w,1,GOLD));
  rect(66,ky+3,2,2,AME);
  buf=base;cx.putImageData(img,0,0);
}
render();setInterval(()=>{phase^=1;render()},500);
function leverAnim(){const t0=performance.now();(function f(n){const p=Math.min((n-t0)/500,1);lvr=Math.sin(p*Math.PI);render();if(p<1)requestAnimationFrame(f)})(t0)}
const rcx=$("rcv").getContext("2d"),ri=rcx.createImageData(40,40);
function drawRing(f){for(let y=0;y<40;y++)for(let x=0;x<40;x++){const dx=x+.5-20,dy=y+.5-20,d=Math.hypot(dx,dy),i=(y*40+x)*4;if(d<14||d>19){ri.data[i+3]=0;continue}const a=((Math.atan2(dy,dx)+Math.PI/2+2*Math.PI)%(2*Math.PI))/(2*Math.PI),c=a<=f?GOLD:VEL;ri.data[i]=c[0];ri.data[i+1]=c[1];ri.data[i+2]=c[2];ri.data[i+3]=255}rcx.putImageData(ri,0,0)}
drawRing(1);

/* reel windows sit on the frames */
const wins=[...document.querySelectorAll(".win")],strips=[...document.querySelectorAll(".strip")];
[26,46,66].forEach((y,i)=>{const s=wins[i].style;s.left=(11/80*100)+"%";s.top=(y/108*100)+"%";s.width=(46/80*100)+"%";s.height=(13/108*100)+"%"});

/* ---------- prompts ---------- */
const ADJ=["sleepy","dramatic","glittery","suspiciously fancy","tiny but furious","haunted","extremely polite","jelly-filled","moonlit","overconfident","soggy","royal","jetpack-wearing","bored","enchanted","sweaty"];
const THING=["goose","wizard","potato","octopus","grandma","cactus","dragon","mailbox","snail","pirate","cupcake","ghost","giraffe","raccoon","teapot","mushroom"];
const DO=["doing taxes","riding a unicycle","winning a beauty pageant","fighting a sandwich","running for mayor","learning ballet","walking a pet cloud","hosting a tea party","getting a haircut","escaping a bathtub","baking at midnight","stuck in an elevator","starting a rock band","moving into a shoe","having an identity crisis","meeting their twin"];
const LISTS=[ADJ,THING,DO];
const DONE=["Your masterpiece is… questionable. Perfect.","Pencils down! The art world is shaking.","Hideous. Iconic. Frame it.","That was unhinged. We love it.","A cursed little treasure. Well done."];
const pick=a=>a[Math.floor(Math.random()*a.length)];

const current=["?","?","?"];
function spinReel(i,target,dur){
  const items=[current[i]];
  for(let k=0;k<18;k++)items.push(pick(LISTS[i]));
  items.push(target);
  const s=strips[i],h=wins[i].clientHeight;
  s.innerHTML=items.map(t=>"<div style='height:"+h+"px'>"+t+"</div>").join("");
  s.style.transition="none";s.style.transform="translateY(0)";void s.offsetHeight;
  s.style.transition="transform "+dur+"ms cubic-bezier(.2,.8,.2,1)";
  s.style.transform="translateY("+(-(items.length-1)*h)+"px)";
  current[i]=target;
  return new Promise(res=>setTimeout(()=>{
    wins[i].classList.add("flash");setTimeout(()=>wins[i].classList.remove("flash"),360);res();
  },dur));
}

let mins=3,prompt="",end=0,total=0,tick=null,busy=false;
$("pills").addEventListener("click",e=>{
  const p=e.target.closest(".pill");if(!p)return;
  mins=+p.dataset.min;document.querySelectorAll(".pill").forEach(x=>x.classList.toggle("sel",x===p));
});
async function pull(){
  if(busy)return;busy=true;
  $("pull").disabled=true;$("result").classList.remove("on");
  leverAnim();
  $("cab").classList.add("spin");
  const t=[pick(ADJ),pick(THING),pick(DO)];
  await Promise.all([spinReel(0,t[0],1500),spinReel(1,t[1],2200),spinReel(2,t[2],2900)]);
  $("cab").classList.remove("spin");
  prompt=(/^[aeiou]/.test(t[0])?"An ":"A ")+t[0]+" "+t[1]+" "+t[2]+".";
  $("slipText").textContent=prompt;$("result").classList.add("on");
  $("pull").textContent="PULL AGAIN";$("pull").disabled=false;busy=false;
  $("result").scrollIntoView({behavior:"smooth",block:"nearest"});
}
$("pull").onclick=pull;$("lever").onclick=pull;

/* ---------- timer (no pause) ---------- */
$("start").onclick=()=>{total=mins*60000;end=Date.now()+total;save();runTimer()};
function save(){try{localStorage.setItem("doodleslot",JSON.stringify({end,total,prompt}))}catch(e){}}
function clear(){try{localStorage.removeItem("doodleslot")}catch(e){}}
function fmt(ms){const s=Math.ceil(ms/1000);return Math.floor(s/60)+":"+String(s%60).padStart(2,"0")}
function runTimer(){
  $("timerPrompt").textContent=prompt;show("timer");clearInterval(tick);
  const upd=()=>{
    const rem=Math.max(0,end-Date.now());
    $("clock").textContent=fmt(rem);
    drawRing(rem/total);
    $("ring").classList.toggle("low",rem<=10000);
    if(rem<=0){clearInterval(tick);finish()}
  };
  upd();tick=setInterval(upd,200);
}
function finish(){
  clear();$("doneMsg").textContent=pick(DONE);show("done");
  for(let i=0;i<36;i++){
    const d=document.createElement("div");d.className="conf";
    d.style.left=Math.random()*100+"vw";
    d.style.background=[C.gold,C.amethyst,C.velvet][i%3];
    d.style.animationDuration=(1.5+Math.random()*1.5)+"s";
    d.style.animationDelay=Math.random()*.6+"s";
    document.body.appendChild(d);setTimeout(()=>d.remove(),4000);
  }
}
$("back").onclick=()=>{$("result").classList.remove("on");$("pull").textContent="PULL THE LEVER";show("main")};

try{
  const s=JSON.parse(localStorage.getItem("doodleslot")||"null");
  if(s&&s.end>Date.now()){end=s.end;total=s.total;prompt=s.prompt;runTimer()}
  else if(s){clear()}
}catch(e){}
