const canvas=document.getElementById("world"),ctx=canvas.getContext("2d");
let state={day:1,time:0,selected:null,location:"class",x:470,y:330,hp:100,energy:100,score:0,items:[],quests:{},flags:{},photos:0,minutes:0};
const TIMES=["08:00","09:00","10:00","11:00","12:00","13:00","14:00"];
const LOC_ORDER=["class","gym","volley","canteen","averroes","vista"];
let keys={},running=false,nearby=null,activeTab="quests",dialogueQueue=[],dialogueIndex=0,dialogueCallback=null;

function el(id){return document.getElementById(id)}
function show(id){document.querySelectorAll(".screen").forEach(s=>s.classList.remove("active"));el(id).classList.add("active")}
function toast(t){const x=el("toast");x.textContent=t;x.classList.add("show");clearTimeout(window._toast);window._toast=setTimeout(()=>x.classList.remove("show"),1700)}
function save(){localStorage.setItem("tesldSave",JSON.stringify(state));toast("DAY SAVED")}
function load(){const s=localStorage.getItem("tesldSave");if(!s)return false;state=JSON.parse(s);return true}
function fresh(){state={day:1,time:0,selected:null,location:"class",x:470,y:330,hp:100,energy:100,score:0,items:[],quests:{},flags:{},photos:0,minutes:0};}
function getChar(){return CHARACTERS[state.selected]||CHARACTERS[9]}
function ability(){return getChar()[4]}
function questCount(){return Object.values(state.quests).filter(q=>q.done).length}

el("newGameBtn").onclick=()=>{fresh();show("selectScreen");renderCharacters()}
el("continueBtn").onclick=()=>{if(load()&&state.selected!==null){startDay(true)}else{toast("No saved day yet")}}
el("howBtn").onclick=()=>openDialogue("TESL D SYSTEM",["Explore the campus, talk to classmates, solve quests and use what you learn to make better choices on later days.","The day moves through time slots. Some people only appear in certain places at certain times.","Press M for the map, Q for quests and I for items. You can restart a day to try a different route."],null)
el("backTitleBtn").onclick=()=>show("titleScreen");
el("menuBtn").onclick=()=>el("menu").classList.remove("hidden");
el("resumeBtn").onclick=()=>el("menu").classList.add("hidden");
el("saveBtn").onclick=()=>{save();el("menu").classList.add("hidden")};
el("restartDayBtn").onclick=()=>{el("menu").classList.add("hidden");restartDay()};
el("menuTitleBtn").onclick=()=>{el("menu").classList.add("hidden");show("titleScreen")};
el("nextDayBtn").onclick=()=>{state.day++;state.time=0;state.location="class";state.x=470;state.y=330;state.hp=100;state.energy=100;state.items=[];state.quests={};state.flags={};state.photos=0;save();startDay(true)};
el("titleFromEndBtn").onclick=()=>show("titleScreen");

document.querySelectorAll(".tab").forEach(t=>t.onclick=()=>{document.querySelectorAll(".tab").forEach(x=>x.classList.remove("active"));t.classList.add("active");activeTab=t.dataset.tab;renderSide()});

function renderCharacters(){
 const grid=el("characterGrid");grid.innerHTML="";
 CHARACTERS.forEach((c,i)=>{
  const d=document.createElement("div");d.className="char-card";
  d.innerHTML=`<div class="char-art"><div class="char-head ${c[1]==="M"?"male":"female"}"></div><div class="char-body"></div></div><div class="char-name">${c[0]}</div><div class="char-role">${c[2]}</div><div class="char-ability">${c[4]}</div>`;
  d.onclick=()=>{state.selected=i;startDay(false)};grid.appendChild(d);
 });
}
function startDay(continuing){
 if(state.selected===null)state.selected=9;
 state.location=state.location||"class";state.x=state.x||470;state.y=state.y||330;
 state.hp=state.hp||100;state.energy=state.energy||100;running=true;show("gameScreen");updateHUD();renderSide();requestAnimationFrame(loop);
 if(!continuing){toast(`Playing as ${getChar()[0]}`);setTimeout(()=>npcDialogue(findNPC("Dr Noor Hayati")),450)}
}
function restartDay(){state.time=0;state.location="class";state.x=470;state.y=330;state.hp=100;state.energy=100;state.items=[];state.quests={};state.flags={};state.photos=0;state.score=0;startDay(true);toast("DAY RESTARTED")}

function findNPC(name){return NPCS.find(n=>n.name===name)}
function npcsHere(){return NPCS.filter(n=>n.loc===state.location)}
function currentQuest(id){return state.quests[id]||{step:0,done:false}}
function advanceQuest(id){
 if(!state.quests[id])state.quests[id]={step:0,done:false};
 const q=state.quests[id],data=QUESTS[id];q.step++;
 if(q.step>=data.steps.length){q.done=true;state.score+=250;if(data.reward)state.items.push(data.reward);toast(`${data.title} COMPLETE +250`)}
 else toast(`${data.title}: step ${q.step+1}/${data.steps.length}`);
 renderSide();
}
function npcDialogue(npc){
 if(!npc)return;
 const id=npc.route, q=QUESTS[id];
 if(q){
  const qstate=currentQuest(id);
  if(!qstate.done && qstate.step===0){
   openDialogue(npc.name,[npc.lines[0],q.desc,`Objective: ${q.steps[0]}`],[{text:"HELP",fn:()=>{advanceQuest(id);closeDialogue()}},{text:"NOT NOW",fn:closeDialogue}],npc);
   return;
  }
  if(!qstate.done){
   const line=q.steps[Math.min(qstate.step,q.steps.length-1)];
   openDialogue(npc.name,[npc.lines[1]||npc.lines[0],`Current objective: ${line}`],null,npc);
   return;
  }
 }
 const generic=npc.lines||["Hey."];
 openDialogue(npc.name,[generic[Math.floor(Math.random()*generic.length)]],null,npc);
}
function openDialogue(speaker,lines,choices,npc){
 dialogueQueue=lines;dialogueIndex=0;dialogueCallback=null;el("dialogue").classList.remove("hidden");
 el("dialogueSpeaker").textContent=speaker;el("dialogueTime").textContent=TIMES[state.time];
 drawPortrait(npc?npc:findNPC(speaker));renderDialogue(choices);
}
function renderDialogue(choices){
 el("dialogueText").textContent=dialogueQueue[dialogueIndex]||"";
 const cc=el("dialogueChoices");cc.innerHTML="";
 if(choices){el("dialogueNext").style.display="none";choices.forEach(c=>{const b=document.createElement("button");b.className="choice";b.textContent=c.text;b.onclick=c.fn;cc.appendChild(b)})}
 else{el("dialogueNext").style.display="block"}
}
el("dialogueNext").onclick=()=>{dialogueIndex++;if(dialogueIndex>=dialogueQueue.length)closeDialogue();else renderDialogue(null)}
function closeDialogue(){el("dialogue").classList.add("hidden");el("dialogueChoices").innerHTML="";el("dialogueNext").style.display="block"}
function drawPortrait(npc){
 const p=el("dialoguePortrait");p.innerHTML="";
 if(!npc)return;
 p.innerHTML=`<div class="phead"></div><div class="pbody"></div><div class="phair ${npc.name==="Dr Noor Hayati"?"male":""}"></div>`;
}
function completeTaskFor(id){
 if(!QUESTS[id])return;
 const q=currentQuest(id);
 if(q.done)return;
 if(id==="farisha"){if(state.photos>=5){state.quests[id]={step:2,done:false};advanceQuest(id)}}
}
function interact(){
 if(nearby){npcDialogue(nearby);return}
 const obj=worldObjects().find(o=>distance(state.x,state.y,o.x,o.y)<40);
 if(obj){handleObject(obj);return}
}
function distance(a,b){return Math.hypot(a-b,0)}
function worldObjects(){
 const objs=[];
 if(state.location==="class"){objs.push({type:"notes",x:610,y:220,name:"Missing notes"},{type:"desk",x:300,y:220,name:"Desk"})}
 if(state.location==="canteen"){objs.push({type:"popia",x:120,y:240,name:"Popia tray"},{type:"pink",x:820,y:250,name:"Pink item"},{type:"snack",x:460,y:250,name:"Snack"})}
 if(state.location==="volley"){for(let i=0;i<6;i++)objs.push({type:"photo",x:100+i*130,y:150+(i%2)*120,name:"Photo Moment"})}
 if(state.location==="averroes")objs.push({type:"file",x:450,y:260,name:"Presentation file"},{type:"stage",x:740,y:210,name:"Stage"})
 if(state.location==="vista")objs.push({type:"phone",x:400,y:240,name:"Phone"})
 return objs;
}
function handleObject(o){
 if(o.type==="photo"){if(!state.flags["photo"+o.x]){state.flags["photo"+o.x]=true;state.photos++;state.score+=50;toast(`📸 PHOTO MOMENT ${state.photos}/5`);completeTaskFor("farisha")}}
 else if(o.type==="notes"){state.flags.notes=true;state.score+=75;toast("FOUND WISHA'S NOTES")}
 else if(o.type==="pink"){state.flags.pink=true;toast("FOUND SOMETHING PINK")}
 else if(o.type==="snack"){state.flags.snack=true;state.items.push("Snack");toast("SNACK ACQUIRED")}
 else if(o.type==="popia"){state.items.push("Popia Pisang");state.score+=25;toast("POPIA PISANG")}
 else if(o.type==="file"){state.flags.file=true;state.score+=75;toast("PRESENTATION FILE FOUND")}
 else if(o.type==="phone"){state.flags.phone=true;toast("PHONE PASSWORD DISCOVERED")}
}

function travel(dir){
 const dest={up:"gym",down:"volley",left:"class",right:"canteen"}[dir];
 if(dest&&state.location==="class"){state.location=dest;state.x=470;state.y=330;timePass(15);toast(LOCATIONS[dest].name)}
 else if(state.location==="gym"&&dir==="down"){state.location="volley";state.x=470;state.y=330;timePass(15);toast(LOCATIONS.volley.name)}
 else if(state.location==="volley"&&dir==="up"){state.location="gym";state.x=470;state.y=330;timePass(15);toast(LOCATIONS.gym.name)}
 else if(state.location==="canteen"&&dir==="left"){state.location="class";state.x=470;state.y=330;timePass(15);toast(LOCATIONS.class.name)}
 else if(state.location==="class"&&dir==="left"){state.location="averroes";state.x=470;state.y=330;timePass(15);toast(LOCATIONS.averroes.name)}
 else if(state.location==="averroes"&&dir==="right"){state.location="class";state.x=470;state.y=330;timePass(15);toast(LOCATIONS.class.name)}
}
function timePass(min){state.minutes+=min;if(state.minutes>=60){state.minutes=0;state.time=Math.min(state.time+1,TIMES.length-1);if(state.time===TIMES.length-1)endDay()}updateHUD();renderSide()}
function updateHUD(){
 el("hudName").textContent=getChar()[0];el("hudDay").textContent=state.day;el("hudTime").textContent=TIMES[state.time];el("hudLocation").textContent=LOCATIONS[state.location].name;
 el("hpBar").style.width=Math.max(0,state.hp)+"%";el("energyBar").style.width=Math.max(0,state.energy)+"%";
}
function renderSide(){
 const box=el("sideContent");
 if(activeTab==="quests"){
  const ids=Object.keys(QUESTS);box.innerHTML=`<div class="panel-content">${ids.map(id=>{const q=QUESTS[id],s=currentQuest(id),n=NPCS.find(x=>x.route===id);if(!n)return"";return `<div class="quest"><h4>${q.title} ${s.done?'<span class="check">✓</span>':''}</h4><p>${q.desc}</p><p style="margin-top:6px">${s.done?"Completed":q.steps[Math.min(s.step,q.steps.length-1)]}</p></div>`}).join("")}</div>`;
 }else if(activeTab==="inventory"){
  box.innerHTML=`<div class="panel-content"><p class="small">Permanent discoveries can carry into later days.</p>${state.items.length?state.items.map(i=>`<div class="item-row"><span>◆ ${i}</span><span>✓</span></div>`).join(""):'<p class="small">Your pockets are empty.</p>'}<div class="item-row"><span>📸 Photo Moments</span><b>${state.photos}/5</b></div></div>`;
 }else{
  box.innerHTML=`<div class="panel-content"><div class="map-card">${LOC_ORDER.map(k=>`<div class="map-node ${state.location===k?"current":""} ${k==="vista"&&state.day<2?"":"unlocked"}">${LOCATIONS[k].name}<br><span style="opacity:.7">${LOCATIONS[k].desc}</span></div>`).join("")}</div><p class="small" style="margin-top:12px">Use the campus connections to move between locations. Vista Angkasa becomes available on Day 2.</p></div>`;
 }
}
function maybeStartQuest(){
 if(state.flags.notes&&currentQuest("wisha").step===1){state.quests.wisha.step=2;toast("RETURN TO WISHA")}
 if(state.flags.snack&&currentQuest("zul").step===1){state.quests.zul.step=2;toast("RETURN TO ZUL")}
 if(state.flags.pink&&currentQuest("hanaan").step===1){state.quests.hanaan.step=2;toast("RETURN TO HANAAN")}
 if(state.flags.file&&currentQuest("caer").step===1){state.quests.caer.step=2;toast("RETURN TO CAER")}
}
function endDay(){
 running=false;
 const q=questCount(), title=q>=4?"TESL D LEGEND":q>=2?"PRODUCTIVE CHAOS":"YOU SURVIVED";
 el("endingTitle").textContent=title;
 el("endingBody").textContent=q>=3?"You solved enough of the class puzzle to uncover a bigger mystery. Tomorrow, people will remember what happened today.":"The bell rings. You made it through the day, but there are still secrets around campus.";
 el("endingStats").innerHTML=`<div class="ending-stat"><b>${state.score}</b><br>Score</div><div class="ending-stat"><b>${q}</b><br>Quests</div><div class="ending-stat"><b>${state.photos}/5</b><br>Photos</div>`;
 save();show("endingScreen");
}
function distance2(a,b){return Math.hypot(a.x-b.x,a.y-b.y)}
function movement(){
 let dx=0,dy=0;if(keys.a||keys.arrowleft)dx--;if(keys.d||keys.arrowright)dx++;if(keys.w||keys.arrowup)dy--;if(keys.s||keys.arrowdown)dy++;
 if(dx||dy){const len=Math.hypot(dx,dy);dx/=len;dy/=len;state.x+=dx*2.5;state.y+=dy*2.5;state.energy=Math.max(0,state.energy-.015)}
 state.x=Math.max(35,Math.min(925,state.x));state.y=Math.max(120,Math.min(540,state.y));
 nearby=null;let best=999;
 npcsHere().forEach(n=>{const d=distance2({x:state.x,y:state.y},{x:n.x,y:n.y});if(d<55&&d<best){best=d;nearby=n}});
 maybeStartQuest();updateHUD();
}
function drawBackground(){
 const L=state.location, w=960,h=600;
 ctx.fillStyle=LOCATIONS[L].colour;ctx.fillRect(0,0,w,h);
 // unique environment art per location
 if(L==="class"){
  ctx.fillStyle="#d8cbb7";ctx.fillRect(0,95,w,310);ctx.fillStyle="#75606e";ctx.fillRect(0,405,w,195);
  ctx.fillStyle="#382c38";ctx.fillRect(40,125,260,95);ctx.fillStyle="#e8d9df";ctx.fillRect(55,140,230,65);
  ctx.fillStyle="#4b3448";ctx.font="bold 22px Nunito";ctx.fillText("TESL D",130,178);ctx.font="13px Nunito";ctx.fillText("LANGUAGE • LEARNING • TEACHING",95,197);
  for(let r=0;r<2;r++)for(let c=0;c<4;c++){ctx.fillStyle="#7b4c63";ctx.fillRect(340+c*135,235+r*110,90,48);ctx.fillStyle="#cda9bd";ctx.fillRect(350+c*135,245+r*110,70,25)}
  ctx.fillStyle="#f0d8a5";ctx.fillRect(720,120,180,30);ctx.fillStyle="#503a4e";ctx.fillText("NOTICE BOARD",755,142);
 } else if(L==="gym"){
  ctx.fillStyle="#d5d0cb";ctx.fillRect(0,80,w,360);ctx.fillStyle="#22202a";ctx.fillRect(0,440,w,160);
  ctx.strokeStyle="#a15f82";ctx.lineWidth=4;for(let x=80;x<900;x+=180)ctx.strokeRect(x,190,120,190);
  ctx.fillStyle="#e4b86b";ctx.fillRect(80,120,150,12);ctx.fillRect(730,120,150,12);ctx.fillStyle="#4d394c";ctx.fillRect(120,105,20,90);ctx.fillRect(790,105,20,90);
  ctx.fillStyle="#8d607a";ctx.fillRect(450,105,60,18);ctx.fillRect(470,123,20,80);
  ctx.fillStyle="#5b4255";ctx.fillRect(30,380,130,35);ctx.fillRect(800,380,130,35);
 } else if(L==="volley"){
  ctx.fillStyle="#84a56e";ctx.fillRect(0,70,w,530);ctx.fillStyle="#d8b59c";ctx.fillRect(130,150,700,330);ctx.fillStyle="#e9dfd3";ctx.fillRect(150,170,660,290);
  ctx.strokeStyle="#9c6980";ctx.lineWidth=4;ctx.strokeRect(150,170,660,290);ctx.beginPath();ctx.moveTo(480,170);ctx.lineTo(480,460);ctx.stroke();ctx.strokeStyle="#fff";ctx.lineWidth=2;ctx.beginPath();ctx.moveTo(150,315);ctx.lineTo(810,315);ctx.stroke();
  ctx.fillStyle="#333";ctx.fillRect(472,155,16,325);ctx.fillStyle="#eee";ctx.fillRect(200,300,560,6);
  for(let x=0;x<w;x+=70){ctx.fillStyle="#416348";ctx.beginPath();ctx.arc(x,120,35,0,Math.PI*2);ctx.fill()}
 } else if(L==="canteen"){
  ctx.fillStyle="#dbc7b1";ctx.fillRect(0,80,w,520);ctx.fillStyle="#705047";ctx.fillRect(0,100,w,85);
  ["FIFI • POPIA","NASI & MEE","DRINKS","SNACKS"].forEach((t,i)=>{ctx.fillStyle=["#8d4e67","#5e6c55","#527080","#8a6543"][i];ctx.fillRect(35+i*230,125,195,150);ctx.fillStyle="#f7e5d0";ctx.font="bold 16px Nunito";ctx.fillText(t,65+i*230,150)});
  for(let r=0;r<2;r++)for(let c=0;c<3;c++){ctx.fillStyle="#68465a";ctx.fillRect(100+c*280,340+r*105,170,18);ctx.fillRect(145+c*280,358+r*105,12,55);ctx.fillRect(215+c*280,358+r*105,12,55)}
 } else if(L==="averroes"){
  ctx.fillStyle="#3c3342";ctx.fillRect(0,70,w,530);ctx.fillStyle="#66586d";ctx.fillRect(120,105,720,330);ctx.fillStyle="#2a202c";ctx.fillRect(210,170,540,200);ctx.fillStyle="#c88bb5";ctx.fillRect(300,200,360,100);ctx.fillStyle="#f6e8ef";ctx.font="bold 30px Nunito";ctx.fillText("AVERROES HALL",390,255);ctx.fillStyle="#5c465b";ctx.fillRect(0,440,w,160);
  for(let i=0;i<8;i++){ctx.fillStyle="#8c657f";ctx.fillRect(100+i*105,475,75,25);ctx.fillRect(110+i*105,505,12,50);ctx.fillRect(155+i*105,505,12,50)}
 } else {
  ctx.fillStyle="#66758c";ctx.fillRect(0,80,w,520);ctx.fillStyle="#343949";ctx.fillRect(130,100,700,400);ctx.fillStyle="#8d7891";ctx.fillRect(170,130,620,330);
  for(let r=0;r<3;r++)for(let c=0;c<4;c++){ctx.fillStyle="#272b38";ctx.fillRect(205+c*145,165+r*90,95,55);ctx.fillStyle="#6c5970";ctx.fillRect(220+c*145,185+r*90,65,4)}
  ctx.fillStyle="#b9a0b9";ctx.font="bold 20px Nunito";ctx.fillText("VISTA ANGKASA",380,120);
 }
 // foreground floor
 ctx.fillStyle="#17121988";ctx.fillRect(0,500,w,100);
}
function drawWorld(){
 drawBackground();
 const objs=worldObjects();
 objs.forEach(o=>{
  if(o.type==="photo"&&state.flags["photo"+o.x])return;
  let colour=o.type==="photo"?"#efc3df":o.type==="notes"?"#d9c8e6":o.type==="pink"?"#ff72bd":o.type==="snack"?"#e5b96b":o.type==="popia"?"#d99d58":o.type==="file"?"#9ab3df":"#c89bcb";
  ctx.fillStyle=colour;ctx.beginPath();ctx.roundRect(o.x-12,o.y-12,24,24,5);ctx.fill();ctx.fillStyle="#fff";ctx.font="10px DM Mono";ctx.fillText(o.type==="photo"?"📸":"◆",o.x-8,o.y+4);
 });
 npcsHere().forEach(n=>drawNPC(n));
 drawPlayer();
 if(nearby){ctx.fillStyle="#fff";ctx.font="bold 12px Nunito";ctx.textAlign="center";ctx.fillText("E / ENTER",nearby.x,nearby.y-42);ctx.textAlign="left"}
}
function drawNPC(n){
 const idx=CHARACTERS.findIndex(c=>c[0]===n.name), c=CHARACTERS[idx]||["","M","",""];
 ctx.fillStyle="#dca47f";ctx.beginPath();ctx.arc(n.x,n.y-24,17,0,Math.PI*2);ctx.fill();
 ctx.fillStyle=c[1]==="F"?"#eadfe5":"#1b1718";ctx.beginPath();ctx.arc(n.x,n.y-34,c[1]==="F"?21:18,Math.PI,Math.PI*2);ctx.fill();
 ctx.fillStyle="#70264d";ctx.fillRect(n.x-22,n.y-8,44,34);ctx.fillStyle="#f4d7e8";ctx.font="bold 10px Nunito";ctx.textAlign="center";ctx.fillText(n.name,n.x,n.y+45);ctx.textAlign="left";
}
function drawPlayer(){
 const c=getChar();ctx.fillStyle="#dca47f";ctx.beginPath();ctx.arc(state.x,state.y-25,18,0,Math.PI*2);ctx.fill();
 ctx.fillStyle=c[1]==="F"?"#eadfe5":"#1b1718";ctx.beginPath();ctx.arc(state.x,state.y-34,c[1]==="F"?22:18,Math.PI,Math.PI*2);ctx.fill();
 ctx.fillStyle="#70264d";ctx.fillRect(state.x-23,state.y-8,46,34);ctx.fillStyle="#f4d7e8";ctx.font="bold 11px Nunito";ctx.textAlign="center";ctx.fillText(c[0],state.x,state.y+45);ctx.textAlign="left";
}
function loop(){if(!running)return;movement();drawWorld();requestAnimationFrame(loop)}
addEventListener("keydown",e=>{
 const k=e.key.toLowerCase();keys[k]=true;
 if(k==="e"||k==="enter")interact();
 if(k==="q"){activeTab="quests";document.querySelectorAll(".tab").forEach(t=>t.classList.toggle("active",t.dataset.tab==="quests"));renderSide()}
 if(k==="i"){activeTab="inventory";document.querySelectorAll(".tab").forEach(t=>t.classList.toggle("active",t.dataset.tab==="inventory"));renderSide()}
 if(k==="m"){activeTab="map";document.querySelectorAll(".tab").forEach(t=>t.classList.toggle("active",t.dataset.tab==="map"));renderSide()}
 if(k==="escape")el("menu").classList.toggle("hidden");
});
addEventListener("keyup",e=>keys[e.key.toLowerCase()]=false);
renderCharacters();
