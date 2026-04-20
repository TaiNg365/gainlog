
import { useState, useEffect, useRef, useCallback } from "react";
import { getLogs, saveLog, getBodyScans, saveBodyScan, getMachines, addMachine, getSetting, setSetting } from './supabase.js';

const C = {
  bg:"#090910", sur:"#111118", card:"#15151e", bdr:"#1c1c2c",
  acc:"#c8f135", red:"#ff4d6d", blu:"#4cc9f0", pur:"#9b5de5",
  org:"#ff9f1c", mut:"#3a3a5a", txt:"#e8e8f0", sub:"#6a6a8a",
  gld:"#ffd700", grn:"#00e096"
};

const APP_CSS = `
*{box-sizing:border-box;margin:0;padding:0;}
body{background:#090910;color:#e8e8f0;font-family:'DM Sans',sans-serif;min-height:100vh;}
.app{max-width:430px;margin:0 auto;min-height:100vh;display:flex;flex-direction:column;}
.hdr{padding:12px 18px 0;background:#090910;position:sticky;top:0;z-index:50;border-bottom:1px solid #1c1c2c;}
.htop{display:flex;justify-content:space-between;align-items:center;margin-bottom:8px;}
.logo{font-family:'Bebas Neue',sans-serif;font-size:24px;letter-spacing:2px;color:#c8f135;line-height:1;}
.lsub{font-size:9px;color:#6a6a8a;letter-spacing:1px;text-transform:uppercase;}
.hbtns{display:flex;gap:7px;}
.icb{background:#1c1c2c;border:none;color:#e8e8f0;border-radius:50%;width:34px;height:34px;font-size:15px;cursor:pointer;display:flex;align-items:center;justify-content:center;}
.icb:active{opacity:.7;}
.tabs{display:flex;overflow-x:auto;padding-bottom:0;}
.tabs::-webkit-scrollbar{display:none;}
.tab{flex-shrink:0;padding:7px 11px;border:none;background:transparent;color:#6a6a8a;font-family:'DM Sans',sans-serif;font-size:10px;font-weight:600;cursor:pointer;border-bottom:2px solid transparent;white-space:nowrap;}
.tab.on{color:#c8f135;border-bottom-color:#c8f135;}
.pg{flex:1;overflow-y:auto;padding:12px 18px 90px;}
.pg::-webkit-scrollbar{display:none;}
.card{background:#15151e;border:1px solid #1c1c2c;border-radius:13px;padding:13px;margin-bottom:9px;}
.ct{font-family:'Bebas Neue',sans-serif;font-size:16px;letter-spacing:1.5px;color:#c8f135;margin-bottom:9px;}
.cl{font-size:9px;color:#6a6a8a;text-transform:uppercase;letter-spacing:1px;margin-bottom:4px;margin-top:8px;}
.inp{width:100%;background:#111118;border:1px solid #1c1c2c;border-radius:9px;padding:8px 11px;color:#e8e8f0;font-family:'DM Sans',sans-serif;font-size:13px;outline:none;}
.inp:focus{border-color:#c8f13544;}
.inp::placeholder{color:#3a3a5a;}
select.inp option{background:#111118;}
.btn{border:none;border-radius:9px;padding:9px 14px;font-family:'DM Sans',sans-serif;font-weight:600;font-size:12px;cursor:pointer;}
.btn:active{opacity:.85;}
.bacc{background:#c8f135;color:#0a0a0f;}
.bgh{background:#1c1c2c;color:#e8e8f0;}
.bfull{width:100%;margin-top:9px;}
.row{display:flex;gap:7px;}
.divider{height:1px;background:#1c1c2c;margin:9px 0;}
.sinp{background:#111118;border:1px solid #1c1c2c;border-radius:6px;padding:6px 3px;color:#e8e8f0;font-family:'JetBrains Mono',monospace;font-size:11px;text-align:center;outline:none;width:100%;}
.sinp:focus{border-color:#c8f13544;}
.srow{display:grid;grid-template-columns:20px 1fr 1fr 26px 22px;gap:4px;align-items:center;margin-bottom:4px;}
.snum{font-family:'JetBrains Mono',monospace;font-size:10px;color:#3a3a5a;text-align:center;}
.sdone{width:24px;height:24px;border-radius:50%;border:2px solid #1c1c2c;background:transparent;cursor:pointer;display:flex;align-items:center;justify-content:center;font-size:11px;}
.sdone.ck{background:#c8f135;border-color:#c8f135;color:#0a0a0f;}
.chip{display:inline-flex;align-items:center;background:#1c1c2c;border-radius:99px;padding:2px 8px;font-size:9px;color:#6a6a8a;font-weight:500;}
.chip.g{background:#c8f13518;color:#c8f135;}
.chip.b{background:#4cc9f018;color:#4cc9f0;}
.chip.r{background:#ff4d6d18;color:#ff4d6d;}
.chip.gold{background:#ffd70018;color:#ffd700;}
.aib{background:linear-gradient(135deg,#0d0d1a,#111320);border:1px solid #c8f13530;border-radius:13px;padding:13px;margin-bottom:9px;}
.aihdr{display:flex;align-items:center;gap:7px;margin-bottom:9px;}
.aidot{width:6px;height:6px;border-radius:50%;background:#c8f135;animation:pulse 1.5s infinite;}
@keyframes pulse{0%,100%{opacity:1;}50%{opacity:.3;}}
.aitl{font-family:'Bebas Neue',sans-serif;font-size:14px;letter-spacing:1.5px;color:#c8f135;}
.aitxt{font-size:11px;color:#6a6a8a;line-height:1.75;}
.aitxt b{color:#e8e8f0;}
.ldots{display:flex;gap:4px;padding:5px 0;justify-content:center;}
.ldot{width:5px;height:5px;border-radius:50%;background:#c8f135;animation:bnc .8s infinite;}
.ldot:nth-child(2){animation-delay:.15s;}
.ldot:nth-child(3){animation-delay:.3s;}
@keyframes bnc{0%,80%,100%{transform:translateY(0);}40%{transform:translateY(-5px);}}
.twrap{position:relative;width:120px;height:120px;margin:0 auto 11px;}
.tsvg{transform:rotate(-90deg);}
.tnum{position:absolute;top:50%;left:50%;transform:translate(-50%,-50%);font-family:'Bebas Neue',sans-serif;font-size:36px;letter-spacing:2px;color:#c8f135;}
.tlbl{position:absolute;bottom:12px;left:50%;transform:translateX(-50%);font-size:8px;color:#6a6a8a;letter-spacing:1px;text-transform:uppercase;}
.prog{height:4px;background:#1c1c2c;border-radius:99px;overflow:hidden;margin:5px 0;}
.progf{height:100%;background:#c8f135;border-radius:99px;transition:width .3s;}
.wgr{display:flex;gap:5px;flex-wrap:wrap;margin:7px 0;}
.wg{width:30px;height:38px;border:2px solid #1c1c2c;border-radius:3px 3px 6px 6px;cursor:pointer;overflow:hidden;display:flex;align-items:flex-end;}
.wg.f{border-color:#4cc9f0;}
.wgf{width:100%;background:#4cc9f055;transition:height .3s;}
.wg.f .wgf{height:100%;background:#4cc9f0;}
.li{background:#111118;border-radius:9px;padding:9px 11px;margin-bottom:5px;border-left:3px solid #c8f13540;}
.li.pr{border-left-color:#ffd700;}
.li.ss{border-left-color:#4cc9f0;}
.lid{font-size:8px;color:#3a3a5a;font-family:'JetBrains Mono',monospace;}
.lim{font-weight:600;font-size:12px;margin:2px 0;}
.lis{font-size:10px;color:#6a6a8a;}
.lin{font-size:9px;color:#3a3a5a;margin-top:2px;font-style:italic;}
.prg{display:grid;grid-template-columns:1fr 1fr;gap:7px;}
.prc{background:#111118;border-radius:11px;padding:11px;border:1px solid #ffd70030;position:relative;overflow:hidden;}
.prc::before{content:'';position:absolute;top:0;right:0;width:32px;height:32px;background:radial-gradient(circle,#ffd70018,transparent);border-radius:0 11px 0 32px;}
.pre{font-size:9px;color:#6a6a8a;margin-bottom:2px;}
.prw{font-family:'Bebas Neue',sans-serif;font-size:20px;color:#ffd700;}
.prd{font-size:9px;color:#3a3a5a;}
.prdt{font-size:8px;color:#3a3a5a;font-family:'JetBrains Mono',monospace;margin-top:2px;}
.stabs{display:flex;gap:4px;margin-bottom:9px;overflow-x:auto;}
.stabs::-webkit-scrollbar{display:none;}
.stab{flex-shrink:0;padding:5px 9px;border:1px solid transparent;background:#1c1c2c;color:#6a6a8a;font-family:'DM Sans',sans-serif;font-size:9px;font-weight:600;border-radius:7px;cursor:pointer;}
.stab.on{background:#c8f13518;color:#c8f135;border-color:#c8f13540;}
.pex{display:flex;justify-content:space-between;align-items:center;padding:4px 0;border-bottom:1px solid #1c1c2c44;}
.pex:last-child{border:none;}
.pexn{font-size:10px;font-weight:500;flex:1;padding-right:7px;}
.pexs{font-size:9px;font-family:'JetBrains Mono',monospace;text-align:right;}
.sep{font-size:8px;color:#6a6a8a;text-align:center;padding:4px 0;border-top:1px solid #1c1c2c;margin-top:3px;letter-spacing:1px;}
.bnav{position:fixed;bottom:0;left:50%;transform:translateX(-50%);width:100%;max-width:430px;background:#111118;border-top:1px solid #1c1c2c;display:flex;z-index:50;}
.bnt{flex:1;padding:7px 2px 11px;border:none;background:transparent;color:#3a3a5a;font-size:17px;cursor:pointer;display:flex;flex-direction:column;align-items:center;gap:2px;}
.bnt.on{color:#c8f135;}
.bnl{font-size:7px;font-weight:600;letter-spacing:.5px;text-transform:uppercase;}
.toast{position:fixed;top:14px;left:50%;transform:translateX(-50%);background:#15151e;border:1px solid #c8f13550;border-radius:9px;padding:8px 14px;font-size:11px;font-weight:500;z-index:999;animation:sld .3s ease;max-width:280px;text-align:center;}
@keyframes sld{from{opacity:0;transform:translateX(-50%) translateY(-6px);}to{opacity:1;transform:translateX(-50%) translateY(0);}}
.mcard{background:#111118;border-radius:9px;padding:9px 11px;border:1px solid #1c1c2c;}
.mval{font-family:'Bebas Neue',sans-serif;font-size:20px;line-height:1;margin-bottom:1px;}
.mlbl{font-size:8px;color:#6a6a8a;text-transform:uppercase;letter-spacing:.7px;}
.mdelta{font-size:9px;margin-top:2px;font-weight:600;}
.mgrid{display:grid;grid-template-columns:1fr 1fr;gap:7px;margin-bottom:9px;}
.sring{position:relative;width:100px;height:100px;margin:0 auto 9px;}
.srsvg{transform:rotate(-90deg);}
.srnum{position:absolute;top:50%;left:50%;transform:translate(-50%,-50%);font-family:'Bebas Neue',sans-serif;font-size:28px;color:#c8f135;line-height:1;}
.srlbl{position:absolute;bottom:10px;left:50%;transform:translateX(-50%);font-size:7px;color:#6a6a8a;letter-spacing:1px;white-space:nowrap;}
.srow2{display:flex;justify-content:space-between;align-items:center;padding:5px 0;border-bottom:1px solid #1c1c2c18;}
.srow2:last-child{border:none;}
.slbl{font-size:10px;color:#6a6a8a;}
.sval{font-family:'JetBrains Mono',monospace;font-size:11px;color:#e8e8f0;font-weight:600;}
.upz{border:2px dashed #1c1c2c;border-radius:11px;padding:22px;text-align:center;cursor:pointer;background:#111118;}
.upz:hover{border-color:#c8f13550;}
.upz input{display:none;}
.afbtn{width:100%;background:#111118;border:1px solid #1c1c2c;border-radius:11px;padding:11px 13px;display:flex;align-items:center;gap:10px;cursor:pointer;margin-bottom:7px;text-align:left;}
.afbtn:active{opacity:.8;}
.afbtn.on{border-color:#c8f13540;background:#c8f13505;}
.aftl{font-size:12px;font-weight:600;color:#e8e8f0;margin-bottom:1px;}
.afsu{font-size:9px;color:#6a6a8a;}
.ares{background:#111118;border:1px solid #1c1c2c;border-radius:11px;padding:13px;margin-top:8px;}
.aretxt{font-size:11px;color:#6a6a8a;line-height:1.8;white-space:pre-wrap;}
.aretxt b{color:#e8e8f0;}
.ecard{background:#111118;border-radius:9px;padding:11px;margin-bottom:7px;border:1px solid #1c1c2c;}
.edate{font-size:8px;color:#3a3a5a;font-family:'JetBrains Mono',monospace;margin-bottom:5px;}
.escore{font-family:'Bebas Neue',sans-serif;font-size:18px;color:#c8f135;}
.tbar{display:flex;align-items:flex-end;gap:4px;height:50px;margin-top:7px;}
.tcol{flex:1;display:flex;flex-direction:column;align-items:center;gap:2px;}
.tseg{width:100%;border-radius:2px;transition:height .3s;}
.tv{font-size:6px;color:#3a3a5a;}
.mi-grid{display:grid;grid-template-columns:1fr 1fr;gap:7px;}
.mi-wrap{display:flex;flex-direction:column;gap:3px;}
.mi-lbl{font-size:9px;color:#6a6a8a;letter-spacing:.4px;}
.mi-inp{background:#111118;border:1px solid #1c1c2c;border-radius:7px;padding:7px 9px;color:#e8e8f0;font-family:'JetBrains Mono',monospace;font-size:12px;outline:none;width:100%;}
.mi-inp:focus{border-color:#c8f13544;}
`;




// ── Helpers
const uid = () => Math.random().toString(36).slice(2, 8);
const fmt = (s) => Math.floor(s/60).toString().padStart(2,"0") + ":" + (s%60).toString().padStart(2,"0");
const today = () => new Date().toLocaleDateString("en-GB", {day:"2-digit", month:"short", year:"numeric"});
const getKey = () => localStorage.getItem("gkey") || "";

// ── Gemini API helper
async function gemini(prompt, maxTok=500) {
  const k = getKey();
  if (!k) return "Add your Gemini API key in the Setup tab first.";
  const r = await fetch("https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=" + k, {
    method:"POST", headers:{"Content-Type":"application/json"},
    body: JSON.stringify({contents:[{parts:[{text:prompt}]}], generationConfig:{maxOutputTokens:maxTok}})
  });
  const d = await r.json();
  if (d.error) return "API error: " + d.error.message;
  return d?.candidates?.[0]?.content?.parts?.[0]?.text || "No response.";
}

async function geminiPDF(base64, prompt) {
  const k = getKey();
  if (!k) return null;
  const r = await fetch("https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=" + k, {
    method:"POST", headers:{"Content-Type":"application/json"},
    body: JSON.stringify({contents:[{parts:[{inline_data:{mime_type:"application/pdf",data:base64}},{text:prompt}]}]})
  });
  const d = await r.json();
  const txt = d?.candidates?.[0]?.content?.parts?.[0]?.text || "{}";
  return JSON.parse(txt.replace(/```json|```/g,"").trim());
}

// ── Static data
const MACHINES = [
  "Smith Machine (Bench)","Smith Machine (Squat)","Smith Machine (Hip Thrust)",
  "Lat Pulldown","Row Machine","Seated Cable Row","Cable Chest Fly (High)",
  "Cable Chest Fly (Mid)","Cable Chest Fly (Low)","Cable Curl","Cable Lat Pullover",
  "Cable Rope Curl (Drop Set)","Overhead Rope Triceps","Cable Crunch Machine",
  "Chest Press Machine","Incline Chest Press Machine","Pec Deck Machine",
  "Triceps Extension Machine","Seated Triceps Press","Machine Shoulder Press",
  "Hack Squat Machine","Leg Press Machine","Leg Extension Machine",
  "Lying Hamstring Curl","Seated Calf Raise","Calf Extension Machine",
  "Glute Kickback Machine","Hip Thrust Machine","Hip Abduction Machine",
  "Hip Adduction Machine","Rear Delt Fly Machine","Preacher Curl Machine",
  "Ab Crunch Machine","Rotary Torso Machine","Dumbbells","EZ Bar","Barbell"
];

const LOGS0 = [
  {id:"h1",date:"16 Jun 2025",machine:"Smith Machine (Bench)",sets:[{reps:6,weight:75},{reps:6,weight:75},{reps:6,weight:75},{reps:6,weight:75}],superset:false,supersetWith:"",notes:"4x6",isPR:false},
  {id:"h2",date:"16 Jun 2025",machine:"Chest Press Machine",sets:[{reps:15,weight:85},{reps:15,weight:85},{reps:15,weight:85}],superset:false,supersetWith:"",notes:"",isPR:false},
  {id:"h3",date:"16 Jun 2025",machine:"Pec Deck Machine",sets:[{reps:15,weight:110},{reps:15,weight:110},{reps:15,weight:110}],superset:false,supersetWith:"",notes:"",isPR:false},
  {id:"h4",date:"16 Jun 2025",machine:"Triceps Extension Machine",sets:[{reps:12,weight:95},{reps:12,weight:95},{reps:12,weight:95}],superset:false,supersetWith:"",notes:"",isPR:false},
  {id:"h5",date:"17 Jun 2025",machine:"Lat Pulldown",sets:[{reps:11,weight:100},{reps:11,weight:100},{reps:11,weight:100},{reps:11,weight:100}],superset:false,supersetWith:"",notes:"",isPR:false},
  {id:"h6",date:"17 Jun 2025",machine:"Row Machine",sets:[{reps:11,weight:85},{reps:11,weight:85},{reps:11,weight:85}],superset:false,supersetWith:"",notes:"",isPR:false},
  {id:"h7",date:"17 Jun 2025",machine:"Seated Cable Row",sets:[{reps:13,weight:100},{reps:13,weight:100},{reps:13,weight:100}],superset:false,supersetWith:"",notes:"",isPR:false},
  {id:"h8",date:"18 Jun 2025",machine:"Hack Squat Machine",sets:[{reps:12,weight:55},{reps:12,weight:55},{reps:12,weight:55}],superset:false,supersetWith:"",notes:"",isPR:false},
  {id:"h9",date:"18 Jun 2025",machine:"Leg Extension Machine",sets:[{reps:15,weight:70},{reps:15,weight:70},{reps:15,weight:70}],superset:false,supersetWith:"",notes:"",isPR:false},
  {id:"h10",date:"18 Jun 2025",machine:"Lying Hamstring Curl",sets:[{reps:12,weight:65},{reps:12,weight:65},{reps:12,weight:65}],superset:false,supersetWith:"",notes:"",isPR:false},
  {id:"h11",date:"20 Jun 2025",machine:"Chest Press Machine",sets:[{reps:15,weight:100},{reps:15,weight:100},{reps:15,weight:100}],superset:true,supersetWith:"Pec Deck Machine",notes:"Power superset",isPR:false},
  {id:"h12",date:"20 Jun 2025",machine:"Pec Deck Machine",sets:[{reps:15,weight:100},{reps:15,weight:100},{reps:15,weight:100}],superset:true,supersetWith:"Chest Press Machine",notes:"",isPR:false},
  {id:"h13",date:"07 Jul 2025",machine:"Chest Press Machine",sets:[{reps:12,weight:90},{reps:12,weight:90},{reps:12,weight:90}],superset:false,supersetWith:"",notes:"Weight up from 85lb",isPR:true},
  {id:"h14",date:"07 Jul 2025",machine:"Pec Deck Machine",sets:[{reps:12,weight:115},{reps:12,weight:115},{reps:12,weight:115}],superset:false,supersetWith:"",notes:"PR",isPR:true},
  {id:"h15",date:"07 Jul 2025",machine:"Triceps Extension Machine",sets:[{reps:10,weight:110},{reps:10,weight:110},{reps:10,weight:110}],superset:false,supersetWith:"",notes:"PR",isPR:true},
  {id:"h16",date:"08 Jul 2025",machine:"Lat Pulldown",sets:[{reps:15,weight:100},{reps:15,weight:100},{reps:15,weight:100},{reps:15,weight:100}],superset:false,supersetWith:"",notes:"4x15 milestone",isPR:true},
  {id:"h17",date:"08 Jul 2025",machine:"Row Machine",sets:[{reps:12,weight:90},{reps:12,weight:90},{reps:12,weight:90}],superset:false,supersetWith:"",notes:"Weight increase",isPR:true},
  {id:"h18",date:"09 Jul 2025",machine:"Lying Hamstring Curl",sets:[{reps:12,weight:75},{reps:12,weight:75},{reps:12,weight:75}],superset:false,supersetWith:"",notes:"PR",isPR:true},
  {id:"h19",date:"09 Jul 2025",machine:"Leg Extension Machine",sets:[{reps:12,weight:75},{reps:12,weight:75},{reps:12,weight:75}],superset:false,supersetWith:"",notes:"PR",isPR:true},
  {id:"h20",date:"11 Jul 2025",machine:"Triceps Extension Machine",sets:[{reps:15,weight:115},{reps:15,weight:115},{reps:15,weight:115}],superset:false,supersetWith:"",notes:"Power day PR",isPR:true},
];

const PLANS = [
  {id:"p1",day:"Mon",name:"Upper Push",color:C.acc,exercises:[
    {name:"Barbell Bench Press (Smith)",sets:"4x6→9",weight:"75lb/side"},
    {name:"Seated Overhead DB Press",sets:"4x8→12",weight:"35lb ea"},
    {name:"Incline DB Press",sets:"3x8→12",weight:"50lb ea"},
    {name:"Cable Chest Fly (High)",sets:"3x15",weight:"25lb/side"},
    {name:"Machine Shoulder Press",sets:"3x12→15",weight:"55lb"},
    {name:"── Evening ──",sets:"",weight:""},
    {name:"Chest Press Machine",sets:"3x10→15",weight:"85→90lb"},
    {name:"Pec Deck Machine",sets:"3x10→15",weight:"110→115lb"},
    {name:"Triceps Extension Machine",sets:"3x12→15",weight:"95→110lb"},
    {name:"Incline Walk",sets:"15 min",weight:""},
  ]},
  {id:"p2",day:"Tue",name:"Upper Pull",color:C.blu,exercises:[
    {name:"Deadlift (Smith Machine)",sets:"4x6→10",weight:"75lb/side"},
    {name:"Lat Pulldown",sets:"4x11→15",weight:"100lb"},
    {name:"Row Machine",sets:"3x11→15",weight:"85→90lb"},
    {name:"Barbell Curl",sets:"3x10→15",weight:"50lb"},
    {name:"── Evening ──",sets:"",weight:""},
    {name:"Seated Cable Row",sets:"3x13→15",weight:"100lb"},
    {name:"Rear Delt Fly Machine",sets:"3x13→15",weight:"70lb"},
    {name:"Cable Rope Curl (Drop Set)",sets:"3x12",weight:"42.5→30lb"},
    {name:"Incline Walk",sets:"15 min",weight:""},
  ]},
  {id:"p3",day:"Wed",name:"Lower Body",color:C.red,exercises:[
    {name:"Back Squat (Smith Machine)",sets:"4x6→8",weight:"85lb/side"},
    {name:"Romanian Deadlift (Smith)",sets:"4x8",weight:"65lb/side"},
    {name:"Hip Thrust Machine",sets:"4x12",weight:"80lb"},
    {name:"── Evening ──",sets:"",weight:""},
    {name:"Hack Squat Machine",sets:"3x12",weight:"55lb/side"},
    {name:"Leg Extension Machine",sets:"3x15",weight:"70→75lb"},
    {name:"Lying Hamstring Curl",sets:"3x12→15",weight:"65→75lb"},
    {name:"Glute Kickback Machine",sets:"3x12→15",weight:"40→45lb"},
    {name:"Cardio Bike",sets:"15 min",weight:""},
  ]},
  {id:"p4",day:"Thu",name:"Arms + Core",color:C.org,exercises:[
    {name:"Close-Grip Bench Press (Smith)",sets:"4x8→12",weight:"55lb/side"},
    {name:"Barbell Curl",sets:"4x10→15",weight:"50lb"},
    {name:"Triceps Rope Pushdown",sets:"3x12→15",weight:"42→45lb"},
    {name:"── Evening Core ──",sets:"",weight:""},
    {name:"Cable Crunch Machine",sets:"3x15",weight:"85→90lb"},
    {name:"Ab Crunch Machine",sets:"3x14→15",weight:"110→120lb"},
    {name:"Rotary Torso Machine",sets:"3x15",weight:"115→120lb"},
    {name:"HIIT Bike Sprint",sets:"15 min",weight:""},
  ]},
  {id:"p5",day:"Fri",name:"Upper Power",color:C.pur,exercises:[
    {name:"Incline Barbell Press SS",sets:"4x6→8",weight:"65lb/side"},
    {name:"Barbell Bent-Over Row SS",sets:"4x8→12",weight:"35lb/side"},
    {name:"Cable Chest Fly SS",sets:"3x15",weight:"20lb/side"},
    {name:"── Evening ──",sets:"",weight:""},
    {name:"Pec Deck Machine SS",sets:"3x15",weight:"100→105lb"},
    {name:"Machine Row",sets:"3x15",weight:"80→90lb"},
    {name:"Triceps Extension Machine",sets:"3x15",weight:"100→115lb"},
    {name:"StairMaster",sets:"15 min",weight:""},
  ]},
  {id:"p6",day:"Sat",name:"Lower Body II",color:"#ff6b6b",exercises:[
    {name:"Hack Squat Machine",sets:"4x8",weight:"60lb/side"},
    {name:"Sumo Deadlift (Smith)",sets:"4x10",weight:"55lb/side"},
    {name:"Hip Thrust (Smith)",sets:"4x12",weight:"55lb/side"},
    {name:"Leg Press Machine",sets:"4x12",weight:"70lb/side"},
    {name:"── Evening Core ──",sets:"",weight:""},
    {name:"Cable Crunch Machine",sets:"4x15",weight:"95lb"},
    {name:"Plank Hold",sets:"3x45 sec",weight:"BW"},
    {name:"Bicycle",sets:"15 min",weight:""},
  ]},
  {id:"p7",day:"Sun",name:"Chest + Pump",color:"#4ecdc4",exercises:[
    {name:"Smith Chest Press SS",sets:"3x10→12",weight:"70lb/side"},
    {name:"Incline DB Press",sets:"3x12",weight:"50lb ea"},
    {name:"Pec Deck Machine",sets:"3x15",weight:"90lb"},
    {name:"EZ Bar Curl",sets:"3x12",weight:"50lb"},
    {name:"── Evening ──",sets:"",weight:""},
    {name:"Rear Delt Fly Machine",sets:"3x12",weight:"70lb"},
    {name:"Preacher Curl Machine",sets:"3x12",weight:"80lb"},
    {name:"Incline Walk",sets:"1 session",weight:""},
  ]},
];

const BODY0 = [{
  id:"b0", date:"01 Dec 2024", source:"Starfit (Example)",
  score:81, weight:193.3, bodyFat:19.5, muscle:145.1, skeletalMuscle:89.3,
  protein:16.1, bodyWater:59.0, inorganicSalt:5.4,
  bmi:25.6, visceralFat:6, bmr:1894, bodyAge:50,
  fatFreeMass:155.6, subcutaneousFat:14.0, smi:9.2, whr:0.93,
  notes:"Example report — replace with your actual scan"
}];

function getPRs(logs) {
  const m = {};
  logs.forEach(l => l.sets.forEach(s => {
    const v = s.weight * s.reps;
    if (!m[l.machine] || v > m[l.machine].vol)
      m[l.machine] = {machine:l.machine, weight:s.weight, reps:s.reps, vol:v, date:l.date};
  }));
  return Object.values(m).sort((a,b) => b.weight - a.weight);
}

// ── Sub-components
function Ldots() {
  return <div className="ldots"><div className="ldot"/><div className="ldot"/><div className="ldot"/></div>;
}

function AIResult({text}) {
  if (!text) return null;
  return <div className="aretxt" dangerouslySetInnerHTML={{__html: text.replace(/\*\*(.*?)\*\*/g,"<b>$1</b>").replace(/\n/g,"<br/>") }}/>;
}

function ScoreRing({score}) {
  const r=42, circ=2*Math.PI*r, pct=Math.min(score/100,1);
  const col = score>=80 ? C.grn : score>=60 ? C.acc : C.org;
  return (
    <div className="sring">
      <svg className="srsvg" width="100" height="100" viewBox="0 0 100 100">
        <circle cx="50" cy="50" r={r} fill="none" stroke={C.bdr} strokeWidth="7"/>
        <circle cx="50" cy="50" r={r} fill="none" stroke={col} strokeWidth="7"
          strokeDasharray={circ} strokeDashoffset={circ - circ*pct} strokeLinecap="round"
          style={{transition:"stroke-dashoffset .6s"}}/>
      </svg>
      <div className="srnum" style={{color:col}}>{score}</div>
      <div className="srlbl">BODY SCORE / 100</div>
    </div>
  );
}

function TrendChart({data, metricKey, color}) {
  const vals = data.map(e => e[metricKey]||0).filter(v=>v>0);
  if (vals.length < 2) return <div style={{fontSize:10,color:C.sub,padding:"6px 0"}}>Need 2+ scans for trend</div>;
  const min=Math.min(...vals), max=Math.max(...vals);
  return (
    <div className="tbar">
      {data.filter(e=>e[metricKey]>0).map((e,i) => {
        const h = max===min ? 25 : 4+((e[metricKey]-min)/(max-min))*44;
        return (
          <div key={i} className="tcol">
            <div className="tseg" style={{height:h, background:i===data.length-1?color:C.bdr}}/>
            <div className="tv">{e[metricKey]}</div>
            <div style={{fontSize:5,color:C.mut}}>{e.date.split(" ").slice(0,2).join(" ")}</div>
          </div>
        );
      })}
    </div>
  );
}

function MetricCard({label, value, unit, prev, lowerBetter, color}) {
  const d = prev!=null ? (value-prev).toFixed(1) : null;
  const dc = !d ? C.sub : parseFloat(d)===0 ? C.sub : (parseFloat(d)<0)===lowerBetter ? C.acc : C.red;
  return (
    <div className="mcard">
      <div className="mval" style={{color:color||C.txt}}>{value}<span style={{fontSize:10,color:C.sub}}>{unit}</span></div>
      <div className="mlbl">{label}</div>
      {d && <div className="mdelta" style={{color:dc}}>{parseFloat(d)>0?"+":""}{d}{unit}</div>}
    </div>
  );
}

// ── Main App
export default function App() {
  const [tab, setTab] = useState("workout");
  // Inject CSS on mount
  useEffect(() => {
    const el = document.getElementById("gainlog-styles");
    if (!el) {
      const style = document.createElement("style");
      style.id = "gainlog-styles";
      style.textContent = APP_CSS;
      document.head.appendChild(style);
    }
  }, []);

  // Load data from Supabase on mount
  useEffect(() => {
    async function loadData() {
      setSyncing(true);
      try {
        const [dbLogs, dbScans, dbMachines] = await Promise.all([
          getLogs(), getBodyScans(), getMachines()
        ]);
        if (dbLogs.length > 0) setLogs(dbLogs);
        if (dbScans.length > 0) setBodyLog(dbScans);
        if (dbMachines.length > 0) setMachines(dbMachines);
        setDbReady(true);
      } catch(e) {
        console.error('Failed to load from Supabase:', e);
      }
      setSyncing(false);
    }
    loadData();
  }, []);
  const [logs, setLogs] = useState(LOGS0);
  const [machines, setMachines] = useState(MACHINES);
  const [bodyLog, setBodyLog] = useState(BODY0);
  const [glasses, setGlasses] = useState(3);
  const [toast, setToast] = useState(null);
  const [planIdx, setPlanIdx] = useState(0);
  const [histFilter, setHistFilter] = useState("all");
  const [bodyTab, setBodyTab] = useState("overview");

  // Workout form
  const [machine, setMachine] = useState("");
  const [newMach, setNewMach] = useState("");
  const [isSuper, setIsSuper] = useState(false);
  const [superWith, setSuperWith] = useState("");
  const [sets, setSets] = useState([{id:uid(),reps:"",weight:"",done:false}]);
  const [wNotes, setWNotes] = useState("");

  // Timer
  const [timerSec, setTimerSec] = useState(90);
  const [timerMax, setTimerMax] = useState(90);
  const [timerOn, setTimerOn] = useState(false);
  const timerRef = useRef(null);

  // AI states
  const [aiSug, setAiSug] = useState(null);
  const [aiSugL, setAiSugL] = useState(false);
  const [aiPlan, setAiPlan] = useState(null);
  const [aiPlanL, setAiPlanL] = useState(false);
  const [aiScan, setAiScan] = useState(null);
  const [aiScanL, setAiScanL] = useState(false);
  const [aiNutr, setAiNutr] = useState(null);
  const [aiNutrL, setAiNutrL] = useState(false);
  const [aiPlat, setAiPlat] = useState(null);
  const [aiPlatL, setAiPlatL] = useState(false);
  const [aiAge, setAiAge] = useState(null);
  const [aiAgeL, setAiAgeL] = useState(false);
  const [openFeat, setOpenFeat] = useState("");

  // Setup
  const [apiKey, setApiKey] = useState(() => localStorage.getItem("gkey") || "");
  const [apiInput, setApiInput] = useState(() => localStorage.getItem("gkey") || "");

  // Body manual
  const [manEntry, setManEntry] = useState(null);
  const [newMachInp, setNewMachInp] = useState("");
  const [parsing, setParsing] = useState(false);
  const fileRef = useRef(null);

  const prs = getPRs(logs);
  const latest = bodyLog[bodyLog.length-1];
  const prev = bodyLog.length > 1 ? bodyLog[bodyLog.length-2] : null;

  const showToast = (msg) => { setToast(msg); setTimeout(() => setToast(null), 2600); };

  // Timer
  useEffect(() => {
    if (timerOn) {
      timerRef.current = setInterval(() => {
        setTimerSec(s => {
          if (s<=1) { clearInterval(timerRef.current); setTimerOn(false); showToast("Rest done — next set!"); return timerMax; }
          return s-1;
        });
      }, 1000);
    } else clearInterval(timerRef.current);
    return () => clearInterval(timerRef.current);
  }, [timerOn]);

  const startTimer = (sec) => { setTimerMax(sec); setTimerSec(sec); setTimerOn(true); };

  // Context builder
  const ctx = () => {
    const hist = logs.slice(0,20).map(l => {
      const ss = l.sets.map(s => s.reps + "x" + s.weight + "lb").join(", ");
      return l.date + " | " + l.machine + " | " + ss + (l.isPR?" [PR]":"") + (l.superset?" [SS]":"");
    }).join("; ");
    const prStr = prs.slice(0,8).map(p => p.machine + ":" + p.weight + "lb x" + p.reps).join(", ");
    const body = latest
      ? "Weight:" + latest.weight + "lb Fat:" + latest.bodyFat + "% Muscle:" + latest.muscle + "lb SkelMuscle:" + latest.skeletalMuscle + "lb BMI:" + latest.bmi + " Score:" + latest.score + "/100 BodyAge:" + latest.bodyAge + " BMR:" + latest.bmr + "kcal ViscFat:" + latest.visceralFat + " WHR:" + latest.whr
      : "No scan";
    const scans = bodyLog.map(b => b.date + ":score=" + b.score + " wt=" + b.weight + "lb fat=" + b.bodyFat + "% muscle=" + b.muscle + "lb age=" + b.bodyAge).join(" | ");
    const mach = machines.slice(0,20).join(", ");
    return {hist, prStr, body, scans, mach};
  };

  // AI calls
  const callSug = async () => {
    setAiSugL(true); setAiSug(null);
    const {hist, prStr, body, mach} = ctx();
    const p = "You are a hypertrophy coach for a 51yr old male training 7 days/week twice daily. Available machines: " + mach + ". Body scan: " + body + ". PRs: " + prStr + ". Hydration: " + glasses + "/8. History: " + hist + ". Give: 1) One specific progressive overload suggestion with exact machine, current and target weight. 2) One superset recommendation using available machines. 3) One body composition insight from the scan. 4) Hydration/nutrition tip based on BMR. Under 130 words. Use lb.";
    try { setAiSug(await gemini(p, 350)); } catch(e) { setAiSug("Error. Check API key."); }
    setAiSugL(false);
  };

  const callPlan = async () => {
    setAiPlanL(true); setAiPlan(null);
    const {prStr, body, mach} = ctx();
    const p = "You are an expert hypertrophy coach. Generate a personalised weekly workout plan (Mon-Sun) for a 51yr old male training twice daily. ONLY use these machines: " + mach + ". Body scan: " + body + ". Current PRs to build from: " + prStr + ". For each day list 6-8 exercises with sets x reps @ weight based on PRs. Include rest times. Note deload if needed. Max 400 words.";
    try { setAiPlan(await gemini(p, 700)); } catch(e) { setAiPlan("Error. Check API key."); }
    setAiPlanL(false);
  };

  const callScan = async () => {
    setAiScanL(true); setAiScan(null);
    const {scans, body, prStr} = ctx();
    const p = "You are a body composition expert. Analyse this athlete's Starfit scan history. Scan history: " + scans + ". Latest: " + body + ". PRs: " + prStr + ". Provide: 1) Trend — is muscle increasing, fat decreasing, rate of change? 2) What the numbers mean for a 51yr old hypertrophy athlete. 3) Which metrics need most attention. 4) How gym performance correlates with body changes. Specific with numbers. Under 200 words.";
    try { setAiScan(await gemini(p, 400)); } catch(e) { setAiScan("Error. Check API key."); }
    setAiScanL(false);
  };

  const callNutr = async () => {
    setAiNutrL(true); setAiNutr(null);
    const {body} = ctx();
    const p = "You are a sports nutritionist. Based on body data for a 51yr old male hypertrophy athlete: " + body + ". Hydration: " + glasses + "/8. Provide: 1) Daily calorie target (BMR + hypertrophy surplus). 2) Protein target in grams. 3) Carb and fat split. 4) Meal timing for twice-daily training. 5) Key supplements for muscle building at 51 (creatine, protein etc). Specific numbers. Under 200 words.";
    try { setAiNutr(await gemini(p, 400)); } catch(e) { setAiNutr("Error. Check API key."); }
    setAiNutrL(false);
  };

  const callPlat = async () => {
    setAiPlatL(true); setAiPlat(null);
    const {hist, prStr, scans} = ctx();
    const p = "You are a strength coach. Detect plateaus in this workout history. History: " + hist + ". PRs: " + prStr + ". Body scans: " + scans + ". Provide: 1) Which machines show plateau (same weight/reps 3+ sessions). 2) Exercises making great progress. 3) Whether a deload week is recommended. 4) Specific strategies to break plateaus (drop sets, supersets, rep range changes). 5) Recovery recommendation. Reference actual weights. Under 200 words.";
    try { setAiPlat(await gemini(p, 400)); } catch(e) { setAiPlat("Error. Check API key."); }
    setAiPlatL(false);
  };

  const callAge = async () => {
    setAiAgeL(true); setAiAge(null);
    const {scans, body, prStr} = ctx();
    const p = "You are a longevity and fitness expert. Analyse body age vs chronological age. Chronological age: 51, Male. Scan history: " + scans + ". Latest: " + body + ". PRs: " + prStr + ". Provide: 1) Body age trend across scans — improving or worsening? 2) What drives the body age score. 3) Specific changes to reduce body age further. 4) How strength compares to expected for age. 5) Realistic target body age in 6 months. Encouraging but honest. Under 200 words.";
    try { setAiAge(await gemini(p, 400)); } catch(e) { setAiAge("Error. Check API key."); }
    setAiAgeL(false);
  };

  // Log workout
  const logWorkout = () => {
    const m = machine==="__new" ? newMach : machine;
    if (!m) { showToast("Pick a machine first"); return; }
    const valid = sets.filter(s => s.reps && s.weight);
    if (!valid.length) { showToast("Add at least one set"); return; }
    const currentPR = prs.find(p => p.machine===m);
    const maxVol = Math.max(...valid.map(s => Number(s.weight)*Number(s.reps)));
    const isPR = !currentPR || maxVol > currentPR.vol;
    const entry = {id:uid(), date:today(), machine:m, sets:valid.map(s=>({...s,done:true})), superset:isSuper, supersetWith:isSuper?superWith:"", notes:wNotes, isPR};
    if (machine==="__new" && newMach && !machines.includes(newMach)) setMachines(p=>[...p,newMach]);
    setLogs(p=>[entry,...p]);
    saveLog(entry).catch(e => console.error('Save log error:', e));
    setSets([{id:uid(),reps:"",weight:"",done:false}]);
    setMachine(""); setNewMach(""); setWNotes(""); setIsSuper(false); setSuperWith("");
    showToast(isPR ? "New PR! Great work!" : "Logged: " + m);
  };

  // Starfit PDF upload
  const handlePDF = async (file) => {
    if (!file) return;
    setParsing(true); showToast("Reading Starfit PDF...");
    try {
      const b64 = await new Promise((res,rej) => {
        const r = new FileReader();
        r.onload = () => res(r.result.split(",")[1]);
        r.onerror = rej;
        r.readAsDataURL(file);
      });
      const prompt = "Extract ALL metrics from this Starfit body composition report. Return ONLY valid JSON with these fields: date (DD Mon YYYY from Testing Time), score, weight, bodyFat, muscle, skeletalMuscle, protein, bodyWater, inorganicSalt, bmi, visceralFat, bmr, bodyAge, fatFreeMass, subcutaneousFat, smi, whr, weightControl, fatControl, muscleControl, targetWeight. Use 0 for missing fields. Return ONLY the JSON object, nothing else.";
      const parsed = await geminiPDF(b64, prompt);
      if (parsed) {
        const entry = {
          id:uid(), date:parsed.date||today(), source:"Starfit PDF",
          score:parsed.score||0, weight:parsed.weight||0, bodyFat:parsed.bodyFat||0,
          muscle:parsed.muscle||0, skeletalMuscle:parsed.skeletalMuscle||0,
          protein:parsed.protein||0, bodyWater:parsed.bodyWater||0, inorganicSalt:parsed.inorganicSalt||0,
          bmi:parsed.bmi||0, visceralFat:parsed.visceralFat||0, bmr:parsed.bmr||0,
          bodyAge:parsed.bodyAge||0, fatFreeMass:parsed.fatFreeMass||0,
          subcutaneousFat:parsed.subcutaneousFat||0, smi:parsed.smi||0, whr:parsed.whr||0, notes:""
        };
        setBodyLog(p=>[...p,entry]);
        saveBodyScan(entry).catch(e => console.error('Save scan error:', e));
        showToast("Starfit report imported!");
        setBodyTab("overview");
      }
    } catch(e) { showToast("Could not read PDF. Try manual entry."); }
    setParsing(false);
  };

  const tPct = ((timerMax-timerSec)/timerMax)*100;
  const R=52, CIRC=2*Math.PI*R;
  const filtered = histFilter==="pr" ? logs.filter(l=>l.isPR) : histFilter==="ss" ? logs.filter(l=>l.superset) : logs;

  const feat = (id,icon,title,sub,loading,result,onRun,runLabel) => (
    <>
      <button className={"afbtn"+(openFeat===id?" on":"")} onClick={()=>setOpenFeat(openFeat===id?"":id)}>
        <span style={{fontSize:22,flexShrink:0}}>{icon}</span>
        <div style={{flex:1}}>
          <div className="aftl">{title}</div>
          <div className="afsu">{sub}</div>
        </div>
        <span style={{color:C.acc,fontSize:14}}>{openFeat===id?"▲":"▶"}</span>
      </button>
      {openFeat===id && (
        <div className="ares">
          <button className="btn bacc bfull" style={{marginTop:0}} onClick={onRun} disabled={loading}>
            {loading ? "Thinking..." : runLabel}
          </button>
          {loading && <div style={{marginTop:8}}><Ldots/></div>}
          {result && <div style={{marginTop:10}}><AIResult text={result}/></div>}
        </div>
      )}
    </>
  );

  return (
    <div className="app">
      {toast && <div className="toast">{toast}</div>}

      <div className="hdr">
        <div className="htop">
          <div>
            <div className="logo">GAINLOG</div>
            <div className="lsub">{syncing ? "⟳ Syncing..." : dbReady ? "☁ Synced" : "Hypertrophy Tracker"}</div>
          </div>
          <div className="hbtns">
            <button className="icb" onClick={()=>{setGlasses(g=>Math.min(g+1,8));showToast("Water logged!");}}>💧</button>
            <button className="icb" onClick={async()=>{
              showToast("Generating report...");
              const {body,prStr} = ctx();
              const sum = await gemini("Write 3 motivating sentences for a hypertrophy athlete. " + body + " PRs: " + prStr + ". Note body composition and strongest lifts.", 200);
              const pr10 = prs.slice(0,10);
              const rec = logs.slice(0,15);
              const prRows = pr10.map((p,i)=>"<tr><td>"+(i+1)+"</td><td>"+p.machine+"</td><td>"+p.weight+"lb</td><td>"+p.reps+"</td><td>"+p.date+"</td></tr>").join("");
              const lRows = rec.map(l=>"<tr><td>"+l.date+"</td><td>"+l.machine+"</td><td>"+l.sets.map(s=>s.reps+"x"+s.weight+"lb").join(", ")+"</td><td>"+(l.isPR?"<b style='color:#ffd700'>PR</b> ":"")+(l.superset?"<b style='color:#4cc9f0'>SS</b>":"")+"</td></tr>").join("");
              const html = "<!DOCTYPE html><html><head><meta charset='utf-8'/><title>GAINLOG</title><style>body{font-family:Arial;max-width:780px;margin:0 auto;padding:24px;color:#111;}h1{font-size:26px;letter-spacing:3px;margin-bottom:2px;}.sub{font-size:10px;color:#888;letter-spacing:1px;margin-bottom:18px;}h2{font-size:13px;font-weight:700;border-bottom:2px solid #c8f135;padding-bottom:3px;margin:16px 0 7px;}.ai{background:#f9f9e8;border-left:4px solid #c8f135;padding:10px 13px;border-radius:3px;font-size:11px;line-height:1.7;margin-bottom:16px;}table{width:100%;border-collapse:collapse;font-size:10px;margin-bottom:14px;}th{background:#111;color:#fff;padding:5px 7px;text-align:left;}td{padding:4px 7px;border-bottom:1px solid #eee;}tr:nth-child(even) td{background:#f9f9f9;}.ft{font-size:8px;color:#bbb;text-align:center;margin-top:20px;padding-top:12px;border-top:1px solid #eee;}</style></head><body><h1>GAINLOG</h1><div class='sub'>Report generated " + new Date().toLocaleDateString("en-GB",{day:"2-digit",month:"long",year:"numeric"}) + "</div><h2>AI Summary</h2><div class='ai'>" + sum.replace(/\n/g,"<br/>") + "</div><h2>Personal Records</h2><table><tr><th>#</th><th>Machine</th><th>Weight</th><th>Reps</th><th>Date</th></tr>" + prRows + "</table><h2>Recent Sessions</h2><table><tr><th>Date</th><th>Machine</th><th>Sets</th><th>Badges</th></tr>" + lRows + "</table><div class='ft'>GAINLOG — Hypertrophy Tracker</div></body></html>";
              const w = window.open("","_blank");
              if (w) { w.document.write(html); w.document.close(); setTimeout(()=>w.print(),800); }
              showToast("Report ready — Print > Save as PDF");
            }}>📄</button>
          </div>
        </div>
        <div className="tabs">
          {[["workout","🏋️ Log"],["ai","🤖 AI"],["plan","📋 Plan"],["records","🏆 PRs"],["history","📊 Hist"],["body","🧬 Body"],["settings","⚙️ Setup"]].map(([k,l])=>(
            <button key={k} className={"tab"+(tab===k?" on":"")} onClick={()=>setTab(k)}>{l}</button>
          ))}
        </div>
      </div>

      <div className="pg">

        {/* WORKOUT */}
        {tab==="workout" && (
          <>
            <div className="aib">
              <div className="aihdr">
                <div className="aidot"/>
                <div className="aitl">AI Coach</div>
                {latest && <span className="chip b" style={{marginLeft:"auto",fontSize:8}}>Starfit Active</span>}
              </div>
              {aiSugL && <Ldots/>}
              {aiSug && <div className="aitxt" dangerouslySetInnerHTML={{__html:aiSug.replace(/\*\*(.*?)\*\*/g,"<b>$1</b>").replace(/\n/g,"<br/>")}}/>}
              {!aiSug && !aiSugL && <div className="aitxt">{latest ? "Starfit data loaded — AI knows your body fat (" + latest.bodyFat + "%), muscle (" + latest.muscle + "lb) and BMR (" + latest.bmr + "kcal)." : "Upload Starfit PDF in Body tab for full body-aware suggestions."}</div>}
              <button className="btn bacc bfull" onClick={callSug} disabled={aiSugL}>{aiSugL?"Thinking...":"Get AI Suggestion"}</button>
            </div>

            <div className="card">
              <div className="ct">Rest Timer</div>
              <div className="twrap">
                <svg className="tsvg" width="120" height="120" viewBox="0 0 120 120">
                  <circle cx="60" cy="60" r={R} fill="none" stroke={C.bdr} strokeWidth="6"/>
                  <circle cx="60" cy="60" r={R} fill="none" stroke={C.acc} strokeWidth="6"
                    strokeDasharray={CIRC} strokeDashoffset={CIRC-(CIRC*tPct/100)}
                    strokeLinecap="round" style={{transition:"stroke-dashoffset .5s"}}/>
                </svg>
                <div className="tnum">{fmt(timerSec)}</div>
                <div className="tlbl">REST</div>
              </div>
              <div className="row" style={{marginBottom:7}}>
                {[60,90,120,180].map(s=>(
                  <button key={s} className="btn bgh" style={{flex:1,padding:"6px 2px",fontSize:10}} onClick={()=>startTimer(s)}>{s}s</button>
                ))}
              </div>
              <div className="row">
                <button className="btn bacc" style={{flex:1}} onClick={()=>setTimerOn(v=>!v)}>{timerOn?"Pause":"Start"}</button>
                <button className="btn bgh" style={{flex:1}} onClick={()=>{setTimerOn(false);setTimerSec(timerMax);}}>Reset</button>
              </div>
            </div>

            <div className="card">
              <div className="ct">Log Exercise</div>
              <div className="cl" style={{marginTop:0}}>Machine</div>
              <select className="inp" value={machine} onChange={e=>{setMachine(e.target.value);setNewMach("");}}>
                <option value="">Select machine...</option>
                {machines.map(m=><option key={m} value={m}>{m}</option>)}
                <option value="__new">+ Add new machine</option>
              </select>
              {machine==="__new" && <input className="inp" style={{marginTop:6}} placeholder="Machine name..." value={newMach} onChange={e=>setNewMach(e.target.value)}/>}
              <div className="divider"/>
              <div className="row" style={{alignItems:"center",marginBottom:7}}>
                <div style={{flex:1}}><div style={{fontWeight:600,fontSize:12}}>Superset</div><div style={{fontSize:9,color:C.sub}}>Pair with another exercise</div></div>
                <button className={"btn "+(isSuper?"bacc":"bgh")} style={{padding:"4px 11px",fontSize:10}} onClick={()=>setIsSuper(v=>!v)}>{isSuper?"ON":"OFF"}</button>
              </div>
              {isSuper && (
                <select className="inp" value={superWith} onChange={e=>setSuperWith(e.target.value)}>
                  <option value="">Paired with...</option>
                  {machines.filter(m=>m!==(machine==="__new"?newMach:machine)).map(m=><option key={m} value={m}>{m}</option>)}
                </select>
              )}
              <div className="divider"/>
              <div style={{display:"grid",gridTemplateColumns:"20px 1fr 1fr 26px 22px",gap:4,marginBottom:4}}>
                {["","Reps","Weight(lb)","",""].map((h,i)=><span key={i} style={{fontSize:8,color:C.sub,textAlign:"center",textTransform:"uppercase",letterSpacing:".7px"}}>{h}</span>)}
              </div>
              {sets.map((s,i)=>(
                <div key={s.id} className="srow">
                  <span className="snum">{i+1}</span>
                  <input className="sinp" type="number" placeholder="10" value={s.reps} onChange={e=>setSets(p=>p.map((x,j)=>j===i?{...x,reps:e.target.value}:x))}/>
                  <input className="sinp" type="number" placeholder="85" value={s.weight} onChange={e=>setSets(p=>p.map((x,j)=>j===i?{...x,weight:e.target.value}:x))}/>
                  <button className={"sdone"+(s.done?" ck":"")} onClick={()=>{
                    const was = !sets[i].done;
                    setSets(p=>p.map((x,j)=>j===i?{...x,done:!x.done}:x));
                    if (was) { startTimer(timerMax); showToast("Set "+(i+1)+" done! Resting..."); }
                  }}>{s.done?"✓":""}</button>
                  <button style={{background:"none",border:"none",color:C.red,fontSize:14,cursor:"pointer"}} onClick={()=>setSets(p=>p.filter((_,j)=>j!==i))}>×</button>
                </div>
              ))}
              <button className="btn bgh bfull" style={{fontSize:11}} onClick={()=>setSets(p=>[...p,{id:uid(),reps:"",weight:"",done:false}])}>+ Add Set</button>
              <div className="divider"/>
              <div className="cl" style={{marginTop:0}}>Notes</div>
              <input className="inp" placeholder="e.g. increase weight next week..." value={wNotes} onChange={e=>setWNotes(e.target.value)}/>
              <button className="btn bacc bfull" onClick={logWorkout}>Log Exercise ✓</button>
            </div>
          </>
        )}

        {/* AI HUB */}
        {tab==="ai" && (
          <>
            <div style={{fontFamily:"'Bebas Neue',sans-serif",fontSize:19,letterSpacing:2,marginBottom:3}}>AI Coach Hub</div>
            <div style={{fontSize:9,color:C.sub,marginBottom:11}}>Powered by Gemini Pro · All features free with your key</div>
            {!apiKey && (
              <div style={{background:"#ff4d6d11",border:"1px solid #ff4d6d33",borderRadius:10,padding:"9px 12px",marginBottom:10,fontSize:11,color:C.red}}>
                ⚠️ Add your Gemini API key in Setup tab to use AI features
              </div>
            )}
            {feat("plan","📋","Generate Weekly Workout Plan","Full 7-day plan tailored to your body scan + machines",aiPlanL,aiPlan,callPlan,"Generate My Plan")}
            {feat("scan","📊","Analyse Body Scan Progress","Detect trends across Starfit scans + gym correlation",aiScanL,aiScan,callScan,"Analyse My Scans")}
            {feat("nutr","🥗","Nutrition & Calorie Targets","Personalised macros based on your BMR and body fat %",aiNutrL,aiNutr,callNutr,"Get Nutrition Plan")}
            {feat("plateau","📉","Plateau & Deload Detection","Find stagnating exercises + deload recommendations",aiPlatL,aiPlat,callPlat,"Detect Plateaus")}
            {feat("age","🧬","Body Age vs Real Age Analysis","Track biological age trend + how to reduce it",aiAgeL,aiAge,callAge,"Analyse Body Age")}
          </>
        )}

        {/* PLAN */}
        {tab==="plan" && (
          <>
            <div style={{fontFamily:"'Bebas Neue',sans-serif",fontSize:19,letterSpacing:2,marginBottom:3}}>Weekly Plan</div>
            <div style={{fontSize:9,color:C.sub,marginBottom:9}}>Based on Jun–Jul 2025 programme</div>
            <div className="stabs">
              {PLANS.map((p,i)=>(
                <button key={p.id} className={"stab"+(planIdx===i?" on":"")}
                  style={{color:planIdx===i?p.color:C.sub,borderColor:planIdx===i?p.color+"50":"transparent",background:planIdx===i?p.color+"18":C.bdr}}
                  onClick={()=>setPlanIdx(i)}>{p.day}</button>
              ))}
            </div>
            <div className="card">
              <div className="ct" style={{color:PLANS[planIdx].color}}>{PLANS[planIdx].name}</div>
              {PLANS[planIdx].exercises.map((ex,i)=>(
                ex.name.startsWith("──") ?
                  <div key={i} className="sep">{ex.name}</div> :
                  <div key={i} className="pex">
                    <div className="pexn">{ex.name}</div>
                    <div style={{textAlign:"right",flexShrink:0}}>
                      <div className="pexs" style={{color:PLANS[planIdx].color}}>{ex.sets}</div>
                      <div style={{fontSize:8,color:C.mut}}>{ex.weight}</div>
                    </div>
                  </div>
              ))}
            </div>
          </>
        )}

        {/* PRs */}
        {tab==="records" && (
          <>
            <div style={{fontFamily:"'Bebas Neue',sans-serif",fontSize:19,letterSpacing:2,marginBottom:3}}>Personal Records</div>
            <div style={{fontSize:9,color:C.sub,marginBottom:10}}>{prs.length} machines tracked</div>
            <div className="prg">
              {prs.slice(0,20).map((p,i)=>(
                <div key={i} className="prc">
                  {i<3 && <div style={{position:"absolute",top:7,right:9,fontSize:12}}>🏆</div>}
                  <div className="pre">{p.machine}</div>
                  <div className="prw">{p.weight}<span style={{fontSize:11,color:C.sub}}> lb</span></div>
                  <div className="prd">{p.reps} reps</div>
                  <div className="prdt">{p.date}</div>
                </div>
              ))}
            </div>
          </>
        )}

        {/* HISTORY */}
        {tab==="history" && (
          <>
            <div style={{fontFamily:"'Bebas Neue',sans-serif",fontSize:19,letterSpacing:2,marginBottom:7}}>History</div>
            <div className="stabs">
              {[["all","All"],["pr","PRs"],["ss","Supersets"]].map(([k,l])=>(
                <button key={k} className={"stab"+(histFilter===k?" on":"")} onClick={()=>setHistFilter(k)}>{l}</button>
              ))}
            </div>
            <div style={{fontSize:9,color:C.sub,marginBottom:7}}>{filtered.length} sessions</div>
            {filtered.map(l=>(
              <div key={l.id} className={"li"+(l.isPR?" pr":l.superset?" ss":"")}>
                <div className="lid">{l.date}</div>
                <div className="lim">{l.machine} {l.isPR&&"🏆"}</div>
                {l.superset && <div style={{fontSize:8,color:C.blu,marginBottom:2}}>⚡ SS w/ {l.supersetWith}</div>}
                <div className="lis">{l.sets.map((s,i)=>(i+1)+": "+s.reps+"x"+s.weight+"lb").join(" · ")}</div>
                {l.notes && <div className="lin">{l.notes}</div>}
              </div>
            ))}
          </>
        )}

        {/* BODY */}
        {tab==="body" && (
          <>
            <div style={{fontFamily:"'Bebas Neue',sans-serif",fontSize:19,letterSpacing:2,marginBottom:3}}>🧬 Body Composition</div>
            <div style={{fontSize:9,color:C.sub,marginBottom:9}}>Starfit · {bodyLog.length} scan{bodyLog.length!==1?"s":""}</div>
            <div className="stabs">
              {[["overview","Overview"],["trends","Trends"],["scans","All Scans"],["water","Hydration"],["upload","Upload PDF"]].map(([k,l])=>(
                <button key={k} className={"stab"+(bodyTab===k?" on":"")} onClick={()=>setBodyTab(k)}>{l}</button>
              ))}
            </div>

            {bodyTab==="overview" && latest && (
              <>
                <div className="card" style={{textAlign:"center"}}>
                  <ScoreRing score={latest.score}/>
                  <div style={{fontSize:10,color:C.sub}}>{latest.date} · {latest.source}</div>
                  {latest.notes && <div style={{fontSize:9,color:C.mut,fontStyle:"italic",marginTop:3}}>{latest.notes}</div>}
                </div>
                <div className="mgrid">
                  <MetricCard label="Weight" value={latest.weight} unit=" lb" prev={prev?.weight} lowerBetter={true} color={C.blu}/>
                  <MetricCard label="Body Fat" value={latest.bodyFat} unit="%" prev={prev?.bodyFat} lowerBetter={true} color={C.red}/>
                  <MetricCard label="Muscle Mass" value={latest.muscle} unit=" lb" prev={prev?.muscle} lowerBetter={false} color={C.acc}/>
                  <MetricCard label="Skeletal Muscle" value={latest.skeletalMuscle} unit=" lb" prev={prev?.skeletalMuscle} lowerBetter={false} color={C.grn}/>
                </div>
                <div className="card">
                  <div className="ct">Body Metrics</div>
                  {[["BMI",latest.bmi,""],["BMR",latest.bmr," kcal"],["Body Age",latest.bodyAge," yrs"],["Fat-Free Mass",latest.fatFreeMass," lb"],["Visceral Fat",latest.visceralFat,""],["WHR",latest.whr,""],["Subcutaneous Fat",latest.subcutaneousFat,"%"],["SMI",latest.smi," kg/m²"],["Protein",latest.protein,"%"],["Body Water",latest.bodyWater,"%"]].map(([l,v,u])=>v?(
                    <div key={l} className="srow2"><span className="slbl">{l}</span><span className="sval">{v}{u}</span></div>
                  ):null)}
                </div>
              </>
            )}

            {bodyTab==="trends" && (
              <>
                {[{key:"weight",label:"Weight (lb)",lowerBetter:true,color:C.blu},{key:"bodyFat",label:"Body Fat %",lowerBetter:true,color:C.red},{key:"muscle",label:"Muscle (lb)",lowerBetter:false,color:C.acc},{key:"score",label:"Body Score",lowerBetter:false,color:C.grn}].map(m=>(
                  <div key={m.key} className="card">
                    <div style={{fontSize:10,fontWeight:600,color:m.color,marginBottom:5}}>{m.label}</div>
                    <TrendChart data={bodyLog} metricKey={m.key} color={m.color}/>
                  </div>
                ))}
              </>
            )}

            {bodyTab==="scans" && bodyLog.slice().reverse().map(e=>(
              <div key={e.id} className="ecard">
                <div className="edate">{e.date} · {e.source}</div>
                <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:5}}>
                  <div className="escore">{e.score}<span style={{fontSize:10,color:C.sub}}>/100</span></div>
                  <span className="chip gold">{e.weight} lb</span>
                </div>
                <div style={{display:"grid",gridTemplateColumns:"1fr 1fr 1fr",gap:4}}>
                  {[["Fat",e.bodyFat,"%",C.red],["Muscle",e.muscle,"lb",C.acc],["BMR",e.bmr,"kcal",C.sub]].map(([l,v,u,col])=>(
                    <div key={l} style={{background:C.card,borderRadius:5,padding:"4px 7px",textAlign:"center"}}>
                      <div style={{fontSize:11,fontWeight:700,color:col}}>{v}{u}</div>
                      <div style={{fontSize:7,color:C.mut,textTransform:"uppercase"}}>{l}</div>
                    </div>
                  ))}
                </div>
              </div>
            ))}

            {bodyTab==="water" && (
              <div className="card">
                <div className="ct">Hydration Today</div>
                <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:5}}>
                  <span style={{fontSize:12}}>{glasses} / 8 glasses</span>
                  <span className={"chip"+(glasses>=8?" g":glasses>=5?" b":" r")}>{glasses>=8?"Great!":glasses>=5?"Good":"Drink more"}</span>
                </div>
                <div className="prog"><div className="progf" style={{width:(glasses/8*100)+"%"}}/></div>
                <div className="wgr">
                  {Array.from({length:8},(_,i)=>(
                    <div key={i} className={"wg"+(i<glasses?" f":"")} onClick={()=>setGlasses(i<glasses?i:i+1)}>
                      <div className="wgf" style={{height:i<glasses?"100%":"0%"}}/>
                    </div>
                  ))}
                </div>
                {latest?.bmr>0 && (
                  <div style={{background:C.sur,borderRadius:9,padding:"9px 11px",marginTop:7,fontSize:10,color:C.sub,lineHeight:1.6}}>
                    💡 Your BMR is <b style={{color:C.txt}}>{latest.bmr} kcal/day</b>. For hypertrophy aim for <b style={{color:C.acc}}>3–4L water</b> daily.
                  </div>
                )}
              </div>
            )}

            {bodyTab==="upload" && (
              <>
                <div className="card">
                  <div className="ct">Import Starfit PDF</div>
                  <div style={{fontSize:11,color:C.sub,marginBottom:11,lineHeight:1.6}}>Upload your Starfit PDF report. Gemini AI extracts all metrics automatically.</div>
                  {parsing ? (
                    <div style={{textAlign:"center",padding:"14px 0"}}><Ldots/><div style={{fontSize:11,color:C.sub,marginTop:7}}>Reading your report...</div></div>
                  ) : (
                    <div className="upz" onClick={()=>fileRef.current?.click()}>
                      <input ref={fileRef} type="file" accept=".pdf,application/pdf" onChange={e=>handlePDF(e.target.files?.[0])}/>
                      <div style={{fontSize:28,marginBottom:7}}>📊</div>
                      <div style={{fontSize:12,fontWeight:600,marginBottom:3}}>Tap to upload Starfit PDF</div>
                      <div style={{fontSize:10,color:C.sub}}>AI extracts all body composition metrics</div>
                    </div>
                  )}
                </div>
                <div className="card">
                  <div className="ct">Manual Entry</div>
                  {manEntry===null ? (
                    <button className="btn bgh bfull" style={{marginTop:0}} onClick={()=>setManEntry({date:today(),score:"",weight:"",bodyFat:"",muscle:"",skeletalMuscle:"",bmi:"",bmr:"",bodyAge:"",visceralFat:"",fatFreeMass:"",whr:""})}>+ Enter Manually</button>
                  ) : (
                    <>
                      <div className="mi-grid">
                        {[["date","Date","text"],["score","Body Score","number"],["weight","Weight (lb)","number"],["bodyFat","Body Fat %","number"],["muscle","Muscle (lb)","number"],["skeletalMuscle","Skeletal Muscle (lb)","number"],["bmi","BMI","number"],["bmr","BMR (kcal)","number"],["bodyAge","Body Age","number"],["visceralFat","Visceral Fat","number"],["fatFreeMass","Fat-Free Mass (lb)","number"],["whr","WHR","number"]].map(([f,l,t])=>(
                          <div key={f} className="mi-wrap">
                            <label className="mi-lbl">{l}</label>
                            <input className="mi-inp" type={t} placeholder={t==="text"?"DD Mon YYYY":"0"} value={manEntry[f]||""} onChange={e=>setManEntry(p=>({...p,[f]:e.target.value}))}/>
                          </div>
                        ))}
                      </div>
                      <div className="row" style={{marginTop:9}}>
                        <button className="btn bacc" style={{flex:1}} onClick={()=>{
                          const e2 = {id:uid(),date:manEntry.date||today(),source:"Manual",score:+manEntry.score||0,weight:+manEntry.weight||0,bodyFat:+manEntry.bodyFat||0,muscle:+manEntry.muscle||0,skeletalMuscle:+manEntry.skeletalMuscle||0,bmi:+manEntry.bmi||0,bmr:+manEntry.bmr||0,bodyAge:+manEntry.bodyAge||0,visceralFat:+manEntry.visceralFat||0,fatFreeMass:+manEntry.fatFreeMass||0,whr:+manEntry.whr||0,protein:0,bodyWater:0,inorganicSalt:0,subcutaneousFat:0,smi:0,notes:""};
                          setBodyLog(p=>[...p,e2]); saveBodyScan(e2).catch(console.error); setManEntry(null); showToast("Saved!"); setBodyTab("overview");
                        }}>Save</button>
                        <button className="btn bgh" style={{flex:1}} onClick={()=>setManEntry(null)}>Cancel</button>
                      </div>
                    </>
                  )}
                </div>
                <div className="card">
                  <div className="ct">Gym Machines</div>
                  <div style={{display:"flex",flexWrap:"wrap",gap:4,marginBottom:9}}>
                    {machines.map(m=><span key={m} className="chip">{m}</span>)}
                  </div>
                  <div className="row">
                    <input className="inp" placeholder="Add a machine..." value={newMachInp} onChange={e=>setNewMachInp(e.target.value)} style={{flex:1}}/>
                    <button className="btn bacc" onClick={()=>{if(newMachInp&&!machines.includes(newMachInp)){setMachines(p=>[...p,newMachInp]);setNewMachInp("");showToast("Added!");}}}>Add</button>
                  </div>
                </div>
              </>
            )}
          </>
        )}

        {/* SETTINGS */}
        {tab==="settings" && (
          <>
            <div style={{fontFamily:"'Bebas Neue',sans-serif",fontSize:19,letterSpacing:2,marginBottom:3}}>Setup</div>
            <div style={{fontSize:9,color:C.sub,marginBottom:11}}>Configure Gemini AI</div>
            <div className="card">
              <div className="ct">Gemini API Key</div>
              <div style={{fontSize:11,color:C.sub,lineHeight:1.7,marginBottom:11}}>
                Stored only on this device. Get it free from <span style={{color:C.acc}}>aistudio.google.com</span> → Get API Key. You have Gemini Pro so all AI is free!
              </div>
              {apiKey ? (
                <div style={{background:C.sur,borderRadius:9,padding:"9px 11px",marginBottom:9,border:"1px solid #c8f13540"}}>
                  <div style={{fontSize:9,color:C.acc,marginBottom:2}}>✅ KEY ACTIVE</div>
                  <div style={{fontFamily:"'JetBrains Mono',monospace",fontSize:10,color:C.sub,wordBreak:"break-all"}}>{apiKey.slice(0,8)+"••••••••••••••••"+apiKey.slice(-4)}</div>
                </div>
              ) : (
                <div style={{background:"#ff4d6d11",borderRadius:9,padding:"9px 11px",marginBottom:9,border:"1px solid #ff4d6d33"}}>
                  <div style={{fontSize:10,color:C.red}}>⚠️ No API key — AI features won't work</div>
                </div>
              )}
              <div className="cl" style={{marginTop:0}}>Paste your Gemini API Key</div>
              <input className="inp" type="password" placeholder="AIza..." value={apiInput} onChange={e=>setApiInput(e.target.value)}/>
              <button className="btn bacc bfull" onClick={()=>{
                if (!apiInput.trim()) { showToast("Paste your key first"); return; }
                localStorage.setItem("gkey", apiInput.trim());
                setApiKey(apiInput.trim());
                showToast("✅ Key saved! AI is ready.");
              }}>Save API Key</button>
              {apiKey && <button className="btn bgh bfull" style={{marginTop:5}} onClick={()=>{localStorage.removeItem("gkey");setApiKey("");setApiInput("");showToast("Key removed");}}>Remove Key</button>}
            </div>
            <div className="card">
              <div className="ct">How to Get Your Key</div>
              {[["1","Go to aistudio.google.com"],["2","Sign in with Google"],["3","Click 'Get API Key' in left menu"],["4","Click 'Create API key'"],["5","Copy and paste it above"]].map(([n,t])=>(
                <div key={n} style={{display:"flex",gap:9,alignItems:"center",marginBottom:8}}>
                  <div style={{width:22,height:22,borderRadius:"50%",background:C.acc,color:"#0a0a0f",display:"flex",alignItems:"center",justifyContent:"center",fontWeight:700,fontSize:10,flexShrink:0}}>{n}</div>
                  <div style={{fontSize:11,color:C.txt}}>{t}</div>
                </div>
              ))}
            </div>
            <div className="card">
              <div className="ct">AI Features (all free)</div>
              {[["⚡","Quick Suggestion","Workout advice based on history + body scan"],["📋","Generate Weekly Plan","Full personalised 7-day programme"],["📊","Scan Analysis","Trend detection across Starfit scans"],["🥗","Nutrition Targets","Macros based on your BMR and goals"],["📉","Plateau Detection","Find stagnating exercises + deload advice"],["🧬","Body Age Analysis","Track biological age + how to reduce it"],["📄","PDF Report","AI-written export of your full progress"]].map(([ic,t,d])=>(
                <div key={t} style={{display:"flex",gap:9,padding:"7px 0",borderBottom:"1px solid "+C.bdr+"40",alignItems:"flex-start"}}>
                  <span style={{fontSize:16}}>{ic}</span>
                  <div style={{flex:1}}>
                    <div style={{fontSize:11,fontWeight:600}}>{t}</div>
                    <div style={{fontSize:9,color:C.sub}}>{d}</div>
                  </div>
                  <span className="chip g" style={{fontSize:8,flexShrink:0}}>Free</span>
                </div>
              ))}
            </div>
          </>
        )}

      </div>

      <div className="bnav">
        {[["workout","🏋️","Log"],["ai","🤖","AI"],["records","🏆","PRs"],["body","🧬","Body"],["settings","⚙️","Setup"]].map(([k,ic,lb])=>(
          <button key={k} className={"bnt"+(tab===k?" on":"")} onClick={()=>setTab(k)}>
            <span style={{fontSize:16}}>{ic}</span>
            <span className="bnl">{lb}</span>
          </button>
        ))}
      </div>
    </div>
  );
}
