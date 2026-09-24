const KEY='experienceLabDataV2';
const defaults={xp:240,level:3,streak:5,tasks:[true,true,false,false],activityClicks:0};
function getData(){try{return {...defaults,...JSON.parse(localStorage.getItem(KEY)||'{}')}}catch(e){return {...defaults}}}
function saveData(d){localStorage.setItem(KEY,JSON.stringify(d));}
function levelFor(xp){return Math.max(1,Math.floor(xp/100)+1)}
function syncProfile(){const d=getData();d.level=levelFor(d.xp);document.querySelectorAll('[data-xp]').forEach(e=>e.textContent=d.xp+' XP');document.querySelectorAll('[data-level]').forEach(e=>e.textContent='Cấp '+d.level);document.querySelectorAll('[data-streak]').forEach(e=>e.textContent=d.streak+' ngày');saveData(d)}
function setupTasks(){const d=getData();document.querySelectorAll('.task-check').forEach((e,i)=>{e.checked=!!d.tasks[i];e.onchange=()=>{const old=d.tasks[i];d.tasks[i]=e.checked;if(e.checked&&!old)d.xp+=25;if(!e.checked&&old)d.xp=Math.max(0,d.xp-25);saveData(d);renderTasks();syncProfile()}});renderTasks()}
function renderTasks(){const d=getData(),done=d.tasks.filter(Boolean).length,total=d.tasks.length,pct=Math.round(done/total*100);const p=document.getElementById('missionProgress');if(p)p.style.width=pct+'%';const t=document.getElementById('missionPct');if(t)t.textContent=pct+'%';document.querySelectorAll('.task-check').forEach((e,i)=>{const s=e.closest('.task')?.querySelector('.task-status');if(s)s.textContent=d.tasks[i]?'Đã hoàn thành':'Chưa hoàn thành'})}
function joinActivity(name){const d=getData();d.activityClicks++;d.xp+=10;saveData(d);syncProfile();alert('Đã ghi nhận hoạt động “'+name+'”. Bạn nhận +10 XP!')}
document.addEventListener('DOMContentLoaded',()=>{syncProfile();setupTasks()});
