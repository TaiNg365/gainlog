"use client";
import { useState, useEffect, useRef } from "react";
import { getLogs, saveLog, getBodyScans, saveBodyScan, getMachines, addMachine, getSetting, setSetting, getCardioLogs, saveCardioLog } from './supabase.js';

// ── Colors
const C = {
  bg:"#090910", sur:"#111118", card:"#15151e", bdr:"#1c1c2c",
  acc:"#c8f135", red:"#ff4d6d", blu:"#4cc9f0", pur:"#9b5de5",
  org:"#ff9f1c", mut:"#3a3a5a", txt:"#e8e8f0", sub:"#6a6a8a",
  gld:"#ffd700", grn:"#00e096"
};

// ── CSS
const APP_CSS = `
*{box-sizing:border-box;margin:0;padding:0;}
body{background:#090910;color:#e8e8f0;font-family:'DM Sans',sans-serif;font-size:15px;min-height:100vh;}
.app{max-width:430px;margin:0 auto;min-height:100vh;display:flex;flex-direction:column;}
.hdr{padding:14px 18px 14px;background:#090910;position:sticky;top:0;z-index:50;border-bottom:1px solid #1c1c2c;}
.htop{display:flex;justify-content:space-between;align-items:center;}
.logo{font-family:'Bebas Neue',sans-serif;font-size:30px;letter-spacing:3px;color:#c8f135;line-height:1;}
.lsub{font-size:11px;color:#6a6a8a;letter-spacing:1px;text-transform:uppercase;margin-top:2px;}
.hbtns{display:flex;gap:8px;align-items:center;}
.hamburger{background:none;border:none;cursor:pointer;display:flex;flex-direction:column;gap:5px;padding:6px;justify-content:center;}
.hbar{width:24px;height:2px;background:#c8f135;border-radius:2px;}
.icb{background:#1c1c2c;border:none;color:#e8e8f0;border-radius:50%;width:38px;height:38px;font-size:16px;cursor:pointer;display:flex;align-items:center;justify-content:center;position:relative;flex-shrink:0;}
.icb:active{opacity:.7;}
.wbadge{position:absolute;top:-3px;right:-3px;background:#4cc9f0;color:#0a0a0f;border-radius:99px;min-width:16px;height:16px;padding:0 3px;font-size:8px;font-weight:700;display:flex;align-items:center;justify-content:center;line-height:1;}
.pg{flex:1;overflow-y:auto;padding:14px 18px 30px;}
.pg::-webkit-scrollbar{display:none;}
.card{background:#15151e;border:1px solid #1c1c2c;border-radius:14px;padding:16px;margin-bottom:12px;}
.ct{font-family:'Bebas Neue',sans-serif;font-size:20px;letter-spacing:2px;color:#c8f135;margin-bottom:11px;}
.cl{font-size:11px;color:#6a6a8a;text-transform:uppercase;letter-spacing:1px;margin-bottom:5px;margin-top:10px;}
.inp{width:100%;background:#111118;border:1px solid #1c1c2c;border-radius:10px;padding:12px 14px;color:#e8e8f0;font-family:'DM Sans',sans-serif;font-size:15px;outline:none;}
.inp:focus{border-color:#c8f13560;}
.inp::placeholder{color:#3a3a5a;}
select.inp option{background:#111118;}
.btn{border:none;border-radius:10px;padding:12px 16px;font-family:'DM Sans',sans-serif;font-weight:600;font-size:15px;cursor:pointer;transition:opacity .15s;}
.btn:active{opacity:.8;}
.bacc{background:#c8f135;color:#0a0a0f;}
.bgh{background:#1c1c2c;color:#e8e8f0;}
.bred{background:#ff4d6d20;color:#ff4d6d;border:1px solid #ff4d6d40;}
.bfull{width:100%;margin-top:10px;}
.row{display:flex;gap:8px;}
.divider{height:1px;background:#1c1c2c;margin:12px 0;}
.sinp{background:#111118;border:1px solid #1c1c2c;border-radius:8px;padding:10px 4px;color:#e8e8f0;font-family:'JetBrains Mono',monospace;font-size:14px;text-align:center;outline:none;width:100%;}
.sinp:focus{border-color:#c8f13560;}
.srow{display:grid;grid-template-columns:24px 1fr 1fr 30px 24px;gap:5px;align-items:center;margin-bottom:6px;}
.snum{font-family:'JetBrains Mono',monospace;font-size:11px;color:#3a3a5a;text-align:center;}
.sdone{width:28px;height:28px;border-radius:50%;border:2px solid #1c1c2c;background:transparent;cursor:pointer;display:flex;align-items:center;justify-content:center;font-size:13px;transition:all .15s;}
.sdone.ck{background:#c8f135;border-color:#c8f135;color:#0a0a0f;}
.chip{display:inline-flex;align-items:center;background:#1c1c2c;border-radius:99px;padding:4px 10px;font-size:11px;color:#6a6a8a;font-weight:500;}
.chip.g{background:#c8f13520;color:#c8f135;}
.chip.b{background:#4cc9f020;color:#4cc9f0;}
.chip.r{background:#ff4d6d20;color:#ff4d6d;}
.chip.gold{background:#ffd70020;color:#ffd700;}
.aib{background:linear-gradient(135deg,#0d0d1a,#111320);border:1px solid #c8f13530;border-radius:14px;padding:16px;margin-bottom:12px;}
.aihdr{display:flex;align-items:center;gap:8px;margin-bottom:10px;}
.aidot{width:7px;height:7px;border-radius:50%;background:#c8f135;animation:pulse 1.5s infinite;flex-shrink:0;}
@keyframes pulse{0%,100%{opacity:1;}50%{opacity:.3;}}
.aitl{font-family:'Bebas Neue',sans-serif;font-size:17px;letter-spacing:1.5px;color:#c8f135;}
.aitxt{font-size:13px;color:#6a6a8a;line-height:1.7;}
.ldots{display:flex;gap:5px;padding:6px 0;justify-content:center;}
.ldot{width:6px;height:6px;border-radius:50%;background:#c8f135;animation:bnc .8s infinite;}
.ldot:nth-child(2){animation-delay:.15s;}
.ldot:nth-child(3){animation-delay:.3s;}
@keyframes bnc{0%,80%,100%{transform:translateY(0);}40%{transform:translateY(-6px);}}
.twrap{position:relative;width:160px;height:160px;margin:0 auto 14px;}
.tsvg{transform:rotate(-90deg);}
.tnum{position:absolute;top:50%;left:50%;transform:translate(-50%,-50%);font-family:'Bebas Neue',sans-serif;font-size:48px;letter-spacing:2px;color:#c8f135;line-height:1;}
.tlbl{position:absolute;bottom:14px;left:50%;transform:translateX(-50%);font-size:10px;color:#6a6a8a;letter-spacing:1px;text-transform:uppercase;}
.prog{height:5px;background:#1c1c2c;border-radius:99px;overflow:hidden;margin:6px 0;}
.progf{height:100%;background:#c8f135;border-radius:99px;transition:width .3s;}
.li{background:#111118;border-radius:10px;padding:12px 14px;margin-bottom:7px;border-left:3px solid #c8f13540;}
.li.pr{border-left-color:#ffd700;}
.li.ss{border-left-color:#4cc9f0;}
.lid{font-size:10px;color:#3a3a5a;font-family:'JetBrains Mono',monospace;}
.lim{font-weight:600;font-size:14px;margin:3px 0;}
.lis{font-size:12px;color:#6a6a8a;}
.prg{display:grid;grid-template-columns:1fr 1fr;gap:9px;}
.prc{background:#111118;border-radius:12px;padding:13px;border:1px solid #ffd70030;position:relative;overflow:hidden;}
.prc::before{content:'';position:absolute;top:0;right:0;width:36px;height:36px;background:radial-gradient(circle,#ffd70018,transparent);border-radius:0 12px 0 36px;}
.pre{font-size:11px;color:#6a6a8a;margin-bottom:3px;}
.prw{font-family:'Bebas Neue',sans-serif;font-size:24px;color:#ffd700;}
.prdt{font-size:10px;color:#3a3a5a;font-family:'JetBrains Mono',monospace;margin-top:3px;}
.stabs{display:flex;gap:5px;margin-bottom:11px;overflow-x:auto;flex-wrap:wrap;}
.stab{padding:6px 12px;border:1px solid transparent;background:#1c1c2c;color:#6a6a8a;font-family:'DM Sans',sans-serif;font-size:11px;font-weight:600;border-radius:8px;cursor:pointer;}
.stab.on{background:#c8f13520;color:#c8f135;border-color:#c8f13540;}
.pex{display:flex;justify-content:space-between;align-items:center;padding:6px 0;border-bottom:1px solid #1c1c2c40;}
.pex:last-child{border:none;}
.pexn{font-size:12px;font-weight:500;flex:1;padding-right:8px;}
.pexs{font-size:11px;font-family:'JetBrains Mono',monospace;text-align:right;}
.sep{font-size:10px;color:#6a6a8a;text-align:center;padding:5px 0;border-top:1px solid #1c1c2c;margin-top:4px;letter-spacing:1px;}
.toast{position:fixed;top:16px;left:50%;transform:translateX(-50%);background:#15151e;border:1px solid #c8f13560;border-radius:10px;padding:10px 16px;font-size:13px;font-weight:500;z-index:999;animation:sld .3s ease;max-width:300px;text-align:center;white-space:nowrap;}
@keyframes sld{from{opacity:0;transform:translateX(-50%) translateY(-8px);}to{opacity:1;transform:translateX(-50%) translateY(0);}}
.mcard{background:#111118;border-radius:10px;padding:12px 14px;border:1px solid #1c1c2c;}
.mval{font-family:'Bebas Neue',sans-serif;font-size:24px;line-height:1;margin-bottom:2px;}
.mlbl{font-size:10px;color:#6a6a8a;text-transform:uppercase;letter-spacing:.7px;}
.mdelta{font-size:11px;margin-top:3px;font-weight:600;}
.mgrid{display:grid;grid-template-columns:1fr 1fr;gap:9px;margin-bottom:11px;}
.sring{position:relative;width:110px;height:110px;margin:0 auto 11px;}
.srsvg{transform:rotate(-90deg);}
.srnum{position:absolute;top:50%;left:50%;transform:translate(-50%,-50%);font-family:'Bebas Neue',sans-serif;font-size:32px;color:#c8f135;line-height:1;}
.srlbl{position:absolute;bottom:11px;left:50%;transform:translateX(-50%);font-size:8px;color:#6a6a8a;letter-spacing:1px;white-space:nowrap;}
.srow2{display:flex;justify-content:space-between;align-items:center;padding:7px 0;border-bottom:1px solid #1c1c2c20;}
.srow2:last-child{border:none;}
.slbl{font-size:12px;color:#6a6a8a;}
.sval{font-family:'JetBrains Mono',monospace;font-size:13px;color:#e8e8f0;font-weight:600;}
.upz{border:2px dashed #1c1c2c;border-radius:12px;padding:26px;text-align:center;cursor:pointer;background:#111118;}
.upz:hover{border-color:#c8f13560;}
.upz input{display:none;}
.afbtn{width:100%;background:#111118;border:1px solid #1c1c2c;border-radius:12px;padding:13px 15px;display:flex;align-items:center;gap:12px;cursor:pointer;margin-bottom:9px;text-align:left;}
.afbtn.on{border-color:#c8f13540;background:#c8f13508;}
.aftl{font-size:14px;font-weight:600;color:#e8e8f0;margin-bottom:2px;}
.afsu{font-size:11px;color:#6a6a8a;}
.cardio-item{background:#111118;border-radius:10px;padding:12px 14px;margin-bottom:8px;border-left:3px solid #4cc9f060;}
.mach-wrap{position:relative;}
.mach-search{width:100%;background:#111118;border:1px solid #1c1c2c;border-radius:10px;padding:12px 14px 12px 38px;color:#e8e8f0;font-family:'DM Sans',sans-serif;font-size:15px;outline:none;}
.mach-search:focus{border-color:#c8f13560;}
.mach-search::placeholder{color:#3a3a5a;}
.mach-icon{position:absolute;left:12px;top:50%;transform:translateY(-50%);font-size:14px;pointer-events:none;}
.mach-clear{position:absolute;right:10px;top:50%;transform:translateY(-50%);background:none;border:none;color:#6a6a8a;font-size:18px;cursor:pointer;line-height:1;}
.mach-dropdown{position:absolute;top:calc(100% + 5px);left:0;right:0;background:#15151e;border:1px solid #c8f13540;border-radius:12px;z-index:100;max-height:240px;overflow-y:auto;box-shadow:0 8px 24px #00000080;}
.mach-dropdown::-webkit-scrollbar{width:4px;}
.mach-dropdown::-webkit-scrollbar-thumb{background:#1c1c2c;border-radius:4px;}
.mach-opt{padding:11px 14px;font-size:14px;color:#e8e8f0;cursor:pointer;border-bottom:1px solid #1c1c2c20;display:flex;align-items:center;justify-content:space-between;}
.mach-opt:last-child{border-bottom:none;}
.mach-opt:hover,.mach-opt:active{background:#c8f13510;}
.mach-opt.sel{background:#c8f13518;color:#c8f135;}
.mach-add{color:#c8f135;font-style:italic;}
.mach-none{padding:14px;font-size:13px;color:#6a6a8a;text-align:center;}
.sidenav-overlay{position:fixed;top:0;left:0;right:0;bottom:0;background:#000000bb;z-index:150;animation:fadeIn .2s ease;}
@keyframes fadeIn{from{opacity:0;}to{opacity:1;}}
.sidenav{position:fixed;top:0;left:0;bottom:0;width:270px;background:#0d0d15;border-right:1px solid #1c1c2c;z-index:160;display:flex;flex-direction:column;animation:slideIn .25s ease;}
@keyframes slideIn{from{transform:translateX(-100%);}to{transform:translateX(0);}}
.sidenav-logo{padding:24px 22px 18px;border-bottom:1px solid #1c1c2c;}
.sidenav-items{flex:1;overflow-y:auto;padding:8px 0;}
.sidenav-items::-webkit-scrollbar{display:none;}
.navitem{display:flex;align-items:center;gap:16px;padding:16px 22px;cursor:pointer;border:none;background:transparent;width:100%;text-align:left;border-left:3px solid transparent;}
.navitem:hover{background:#1c1c2c;}
.navitem.active{background:#c8f13510;border-left-color:#c8f135;}
.navicon{font-size:24px;width:32px;text-align:center;flex-shrink:0;}
.navlbl{font-family:'DM Sans',sans-serif;font-size:17px;font-weight:600;color:#e8e8f0;}
.navitem.active .navlbl{color:#c8f135;}
.navsub{font-size:12px;color:#6a6a8a;margin-top:1px;}
.sidenav-footer{padding:16px 22px;border-top:1px solid #1c1c2c;}
.water-panel{background:#15151e;border-bottom:1px solid #1c1c2c;padding:14px 18px;}
.cam-modal{position:fixed;top:0;left:0;right:0;bottom:0;background:#000000ee;z-index:200;display:flex;flex-direction:column;align-items:center;justify-content:center;padding:20px;}
.cam-box{background:#15151e;border-radius:18px;width:100%;max-width:400px;overflow:hidden;border:1px solid #1c1c2c;}
.cam-hdr{padding:16px 18px;border-bottom:1px solid #1c1c2c;display:flex;align-items:center;justify-content:space-between;}
.cam-title{font-family:'Bebas Neue',sans-serif;font-size:20px;letter-spacing:1.5px;color:#c8f135;}
.cam-close{background:none;border:none;color:#6a6a8a;font-size:24px;cursor:pointer;line-height:1;}
.cam-body{padding:18px;}
.cam-trigger{width:100%;border:2px dashed #1c1c2c;border-radius:12px;padding:30px;text-align:center;cursor:pointer;background:#111118;margin-bottom:14px;}
.cam-trigger input{display:none;}
.cam-result{background:#111118;border-radius:12px;padding:14px;margin-bottom:14px;border:1px solid #1c1c2c;}
.mi-grid{display:grid;grid-template-columns:1fr 1fr;gap:9px;}
.mi-wrap{display:flex;flex-direction:column;gap:4px;}
.mi-lbl{font-size:11px;color:#6a6a8a;letter-spacing:.4px;}
.mi-inp{background:#111118;border:1px solid #1c1c2c;border-radius:8px;padding:9px 11px;color:#e8e8f0;font-family:'JetBrains Mono',monospace;font-size:13px;outline:none;width:100%;}
.mi-inp:focus{border-color:#c8f13560;}
.ai-result{background:#111118;border-radius:12px;padding:14px;margin-top:10px;border:1px solid #1c1c2c;}
.ai-result-title{font-size:13px;color:#c8f135;font-weight:600;margin-bottom:8px;}
.ai-result-text{font-size:14px;color:#e8e8f0;line-height:1.8;}
.tbar{display:flex;align-items:flex-end;gap:5px;height:60px;margin-top:9px;}
.tcol{flex:1;display:flex;flex-direction:column;align-items:center;gap:3px;}
.tseg{width:100%;border-radius:3px;transition:height .3s;}
.tv{font-size:7px;color:#3a3a5a;}
.ecard{background:#111118;border-radius:10px;padding:13px;margin-bottom:9px;border:1px solid #1c1c2c;}
`;

// ── Helpers
const uid = () => Math.random().toString(36).slice(2,8);
const fmt = (s) => Math.floor(s/60).toString().padStart(2,"0") + ":" + (s%60).toString().padStart(2,"0");
const today = () => new Date().toLocaleDateString("en-GB",{day:"2-digit",month:"short",year:"numeric"});
const nowTime = () => new Date().toLocaleTimeString("en-GB",{hour:"2-digit",minute:"2-digit"});
const sortDates = (dates) => [...dates].sort((a,b) => {
  const months = {Jan:1,Feb:2,Mar:3,Apr:4,May:5,Jun:6,Jul:7,Aug:8,Sep:9,Oct:10,Nov:11,Dec:12};
  const pa=a.split(" "), pb=b.split(" ");
  return new Date(pb[2],(months[pb[1]]||1)-1,parseInt(pb[0])) - new Date(pa[2],(months[pa[1]]||1)-1,parseInt(pa[0]));
});

const renderAI = (text) => {
  if (!text) return null;
  return text.split("\n").map((line, i) => {
    const parts = line.split("**");
    return (
      <span key={i}>
        {parts.map((p, j) => j % 2 === 1 ? <b key={j} style={{color:"#c8f135"}}>{p}</b> : p)}
        {i < text.split("\n").length - 1 && <br/>}
      </span>
    );
  });
};

// ── AI Provider config
const AI_PROVIDERS = {
  gemini:{name:"Google Gemini",icon:"🟢",models:["gemini-2.5-flash","gemini-3.1-pro-preview","gemini-2.0-flash","gemini-2.0-flash-lite"],defaultModel:"gemini-2.5-flash",placeholder:"AIza...",docsUrl:"aistudio.google.com",color:"#4285f4"},
  claude:{name:"Anthropic Claude",icon:"🟠",models:["claude-haiku-4-5-20251001","claude-sonnet-4-6"],defaultModel:"claude-haiku-4-5-20251001",placeholder:"sk-ant-...",docsUrl:"console.anthropic.com",color:"#d97706"},
  gpt:{name:"OpenAI GPT",icon:"⚫",models:["gpt-4o-mini","gpt-4o"],defaultModel:"gpt-4o-mini",placeholder:"sk-...",docsUrl:"platform.openai.com",color:"#10a37f"}
};

async function callAI(prompt, maxTok=500, provider="gemini", apiKey="", model="") {
  if (!apiKey) return "Add your API key in Setup first.";
  const mdl = model || AI_PROVIDERS[provider]?.defaultModel;
  try {
    if (provider === "gemini") {
      const r = await fetch("https://generativelanguage.googleapis.com/v1beta/models/"+mdl+":generateContent?key="+apiKey, {
        method:"POST", headers:{"Content-Type":"application/json"},
        body: JSON.stringify({contents:[{parts:[{text:prompt}]}], generationConfig:{maxOutputTokens:maxTok}})
      });
      const d = await r.json();
      if (d.error) return "Gemini error: "+d.error.message;
      return d?.candidates?.[0]?.content?.parts?.[0]?.text || "No response.";
    }
    if (provider === "claude") {
      const r = await fetch("https://api.anthropic.com/v1/messages", {
        method:"POST",
        headers:{"Content-Type":"application/json","x-api-key":apiKey,"anthropic-version":"2023-06-01","anthropic-dangerous-direct-browser-access":"true"},
        body: JSON.stringify({model:mdl, max_tokens:maxTok, messages:[{role:"user",content:prompt}]})
      });
      const d = await r.json();
      if (d.error) return "Claude error: "+d.error.message;
      return d?.content?.[0]?.text || "No response.";
    }
    if (provider === "gpt") {
      const r = await fetch("https://api.openai.com/v1/chat/completions", {
        method:"POST",
        headers:{"Content-Type":"application/json","Authorization":"Bearer "+apiKey},
        body: JSON.stringify({model:mdl, max_tokens:maxTok, messages:[{role:"user",content:prompt}]})
      });
      const d = await r.json();
      if (d.error) return "GPT error: "+d.error.message;
      return d?.choices?.[0]?.message?.content || "No response.";
    }
  } catch(e) { return "Network error: "+e.message; }
  return "Unknown provider.";
}

async function callAIPDF(base64, prompt, apiKey) {
  if (!apiKey) return null;
  const r = await fetch("https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key="+apiKey, {
    method:"POST", headers:{"Content-Type":"application/json"},
    body: JSON.stringify({contents:[{parts:[{inline_data:{mime_type:"application/pdf",data:base64}},{text:prompt}]}]})
  });
  const d = await r.json();
  const txt = d?.candidates?.[0]?.content?.parts?.[0]?.text || "{}";
  return JSON.parse(txt.replace(/```json|```/g,"").trim());
}

const MACHINES = [
  // Free Weights & Dumbbells
  "Dumbbells","Barbell","EZ Bar",
  "DB Overhead Press","DB Lateral Raise","DB Front Raise",
  "DB Curl","DB Hammer Curl","DB Tricep Kickback",
  "DB Row","DB Romanian Deadlift","DB Chest Press",
  "DB Incline Press","DB Fly","DB Shoulder Press",
  "DB Goblet Squat","DB Lunge","DB Step Up",
  "DB Hip Thrust","DB Shrug","DB Wrist Curl",
  // Bodyweight
  "Pull-ups","Push-ups","Dips","Chin-ups",
  "Plank","Side Plank","Glute Bridge","Hip Thrust (BW)",
  // Machines
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

const CARDIO_MACHINES = [
  "Treadmill","Incline Treadmill","Cardio Bike (Upright)","Cardio Bike (Recumbent)",
  "Elliptical","StairMaster / StairClimber","Rowing Machine","Ski Erg",
  "Jacob's Ladder","Assault Bike","HIIT Bike","Incline Walk","Swimming",
  "Jump Rope","Cardio Other"
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
    const v = Number(s.weight) * Number(s.reps);
    if (!m[l.machine] || v > m[l.machine].vol)
      m[l.machine] = {machine:l.machine, weight:s.weight, reps:s.reps, vol:v, date:l.date};
  }));
  return Object.values(m).sort((a,b) => b.weight - a.weight);
}

function Ldots() {
  return <div className="ldots"><div className="ldot"/><div className="ldot"/><div className="ldot"/></div>;
}

function ScoreRing({score}) {
  const r=46, circ=2*Math.PI*r;
  const col = score>=80 ? "#00e096" : score>=60 ? "#c8f135" : "#ff9f1c";
  return (
    <div className="sring">
      <svg className="srsvg" width="110" height="110" viewBox="0 0 110 110">
        <circle cx="55" cy="55" r={r} fill="none" stroke="#1c1c2c" strokeWidth="8"/>
        <circle cx="55" cy="55" r={r} fill="none" stroke={col} strokeWidth="8"
          strokeDasharray={circ} strokeDashoffset={circ - circ*Math.min(score/100,1)}
          strokeLinecap="round" style={{transition:"stroke-dashoffset .6s"}}/>
      </svg>
      <div className="srnum" style={{color:col}}>{score}</div>
      <div className="srlbl">BODY SCORE / 100</div>
    </div>
  );
}

function MetricCard({label, value, unit, prev, lowerBetter, color}) {
  const d = prev!=null ? (Number(value)-Number(prev)).toFixed(1) : null;
  const dc = !d ? "#6a6a8a" : parseFloat(d)===0 ? "#6a6a8a" : (parseFloat(d)<0)===lowerBetter ? "#c8f135" : "#ff4d6d";
  return (
    <div className="mcard">
      <div className="mval" style={{color:color||"#e8e8f0"}}>{value}<span style={{fontSize:13,color:"#6a6a8a"}}>{unit}</span></div>
      <div className="mlbl">{label}</div>
      {d && <div className="mdelta" style={{color:dc}}>{parseFloat(d)>0?"+":""}{d}{unit}</div>}
    </div>
  );
}

function TrendChart({data, metricKey, color}) {
  const vals = data.map(e => e[metricKey]||0).filter(v=>v>0);
  if (vals.length < 2) return <div style={{fontSize:12,color:"#6a6a8a",padding:"8px 0"}}>Need 2+ scans for trend</div>;
  const min=Math.min(...vals), max=Math.max(...vals);
  return (
    <div className="tbar">
      {data.filter(e=>e[metricKey]>0).map((e,i) => {
        const h = max===min ? 30 : 5+((e[metricKey]-min)/(max-min))*52;
        return (
          <div key={i} className="tcol">
            <div className="tseg" style={{height:h, background:i===data.length-1?color:"#1c1c2c"}}/>
            <div className="tv">{e[metricKey]}</div>
            <div style={{fontSize:6,color:"#3a3a5a"}}>{(e.date||"").split(" ").slice(0,2).join(" ")}</div>
          </div>
        );
      })}
    </div>
  );
}

export default function App() {
  // ── ALL STATE DECLARATIONS FIRST ──────────────────────────────────────────
  const [tab, setTab] = useState("workout");
  const [navOpen, setNavOpen] = useState(false);
  const [waterOpen, setWaterOpen] = useState(false);
  const [toast, setToast] = useState(null);
  const [dbReady, setDbReady] = useState(false);
  const [syncing, setSyncing] = useState(false);

  // Data
  const [logs, setLogs] = useState(() => {
    try { const l = JSON.parse(localStorage.getItem("gl_logs")||"[]"); return l.length>0?l:LOGS0; } catch(e) { return LOGS0; }
  });
  const [machines, setMachines] = useState(MACHINES);
  const [bodyLog, setBodyLog] = useState(() => {
    try { const b = JSON.parse(localStorage.getItem("gl_body")||"null"); return b&&b.length>0?b:BODY0; } catch(e) { return BODY0; }
  });
  const [cardioLogs, setCardioLogs] = useState(() => {
    try { const c = JSON.parse(localStorage.getItem("gl_cardio")||"[]"); return c; } catch(e) { return []; }
  });
  const [savedPlans, setSavedPlans] = useState(() => {
    try { return JSON.parse(localStorage.getItem("gl_plans")||"[]"); } catch(e) { return []; }
  });

  // Water
  const [waterMl, setWaterMl] = useState(() => {
    try { const w = JSON.parse(localStorage.getItem("gl_water")||"null"); return w?.waterMl||0; } catch(e) { return 0; }
  });
  const [waterGoal, setWaterGoal] = useState(() => {
    try { const w = JSON.parse(localStorage.getItem("gl_water")||"null"); return w?.waterGoal||3000; } catch(e) { return 3000; }
  });
  const [waterCustom, setWaterCustom] = useState("");

  // Plan
  const [activePlanIdx, setActivePlanIdx] = useState(0);
  const [editingPlan, setEditingPlan] = useState(false);
  const [editPlanData, setEditPlanData] = useState(null);
  const [planSelectOpen, setPlanSelectOpen] = useState(false);
  const [selectedSessionPlan, setSelectedSessionPlan] = useState(null);

  // Workout form
  const [machine, setMachine] = useState("");
  const [machSearch, setMachSearch] = useState("");
  const [machOpen, setMachOpen] = useState(false);
  const [newMach, setNewMach] = useState("");
  const [isSuper, setIsSuper] = useState(false);
  const [superWith, setSuperWith] = useState("");
  const [superSearch, setSuperSearch] = useState("");
  const [superOpen, setSuperOpen] = useState(false);
  const [sets, setSets] = useState([{id:uid(),reps:"",weight:"",done:false}]);
  const [superSets, setSuperSets] = useState([{id:uid(),reps:"",weight:"",done:false}]);
  const [wNotes, setWNotes] = useState("");

  // Timer
  const [timerSec, setTimerSec] = useState(90);
  const [timerMax, setTimerMax] = useState(90);
  const [timerOn, setTimerOn] = useState(false);

  // Cardio
  const [cardioTab, setCardioTab] = useState("log");
  const [cardioMachine, setCardioMachine] = useState("");
  const [cardioDuration, setCardioDuration] = useState("");
  const [cardioCalDisplay, setCardioCalDisplay] = useState("");
  const [cardioNotes, setCardioNotes] = useState("");


  // AI
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


  // AI Setup
  const [aiProvider, setAiProvider] = useState("gemini");
  const [aiModel, setAiModel] = useState("");
  const [apiKey, setApiKey] = useState("");
  const [apiInput, setApiInput] = useState("");

  // Body
  const [bodyTab, setBodyTab] = useState("overview");
  const [manEntry, setManEntry] = useState(null);
  const [parsing, setParsing] = useState(false);

  // Camera
  const [camOpen, setCamOpen] = useState(false);
  const [camPhoto, setCamPhoto] = useState(null);
  const [camDetecting, setCamDetecting] = useState(false);
  const [camResult, setCamResult] = useState(null);
  const [camEdit, setCamEdit] = useState("");

  // History
  const [histFilter, setHistFilter] = useState("all");
  const [newMachInp, setNewMachInp] = useState("");
  const [dailyTab, setDailyTab] = useState("today");
  const [savingPlan, setSavingPlan] = useState(null);
  const [planNameInput, setPlanNameInput] = useState("");


  // ── ALL REFS ───────────────────────────────────────────────────────────────
  const timerRef = useRef(null);
  const timerStartRef = useRef(null);
  const timerSecAtStartRef = useRef(null);
  const machSearchRef = useRef(null);
  const superSearchRef = useRef(null);
  const fileRef = useRef(null);
  const cameraRef = useRef(null);

  // ── ALL EFFECTS ────────────────────────────────────────────────────────────
  // Inject CSS
  useEffect(() => {
    if (!document.getElementById("gl-css")) {
      const s = document.createElement("style");
      s.id = "gl-css";
      s.textContent = APP_CSS;
      document.head.appendChild(s);
      const fl = document.createElement("link");
      fl.rel = "stylesheet";
      fl.href = "https://fonts.googleapis.com/css2?family=Bebas+Neue&family=DM+Sans:wght@400;500;600&family=JetBrains+Mono:wght@400;600&display=swap";
      document.head.appendChild(fl);
    }
  }, []);

  // Persist to localStorage
  useEffect(() => { try { localStorage.setItem("gl_logs", JSON.stringify(logs)); } catch(e) {} }, [logs]);
  useEffect(() => { try { localStorage.setItem("gl_cardio", JSON.stringify(cardioLogs)); } catch(e) {} }, [cardioLogs]);
  useEffect(() => { try { localStorage.setItem("gl_body", JSON.stringify(bodyLog)); } catch(e) {} }, [bodyLog]);
  useEffect(() => { try { localStorage.setItem("gl_water", JSON.stringify({waterMl,waterGoal})); } catch(e) {} }, [waterMl, waterGoal]);
  useEffect(() => { try { localStorage.setItem("gl_plans", JSON.stringify(savedPlans)); } catch(e) {} }, [savedPlans]);


  // Load from Supabase
  useEffect(() => {
    async function load() {
      setSyncing(true);
      try {
        const [dbLogs, dbScans, dbMachines, dbCardio, savedKey, savedProv, savedMdl] = await Promise.all([
          getLogs(), getBodyScans(), getMachines(), getCardioLogs(),
          getSetting("ai_key"), getSetting("ai_provider"), getSetting("ai_model")
        ]);
        if (dbLogs.length > 0) { setLogs(dbLogs); localStorage.setItem("gl_logs", JSON.stringify(dbLogs)); }
        if (dbScans.length > 0) { setBodyLog(dbScans); localStorage.setItem("gl_body", JSON.stringify(dbScans)); }
        if (dbMachines.length > 0) setMachines(dbMachines);
        if (dbCardio.length > 0) { setCardioLogs(dbCardio); localStorage.setItem("gl_cardio", JSON.stringify(dbCardio)); }
        if (savedKey) { setApiKey(savedKey); setApiInput(savedKey); }
        if (savedProv) setAiProvider(savedProv);
        if (savedMdl) setAiModel(savedMdl);
        setDbReady(true);

      } catch(e) { console.error("Supabase sync failed:", e); setDbReady(true); }
      setSyncing(false);
    }
    load();
  }, []);

  // Close machine dropdown on outside click
  useEffect(() => {
    const h = (e) => {
      if (machSearchRef.current && !machSearchRef.current.contains(e.target)) setMachOpen(false);
      if (superSearchRef.current && !superSearchRef.current.contains(e.target)) setSuperOpen(false);
    };
    document.addEventListener("mousedown", h);
    document.addEventListener("touchstart", h);
    return () => { document.removeEventListener("mousedown", h); document.removeEventListener("touchstart", h); };
  }, []);

  // Timer (date-based, works in background)
  useEffect(() => {
    if (timerOn) {
      timerStartRef.current = Date.now();
      timerSecAtStartRef.current = timerSec;
      // Note: iOS Safari doesn't support web notifications
      // Timer updates browser tab title so countdown shows when switching tabs
      timerRef.current = setInterval(() => {
        const elapsed = Math.floor((Date.now() - timerStartRef.current) / 1000);
        const remaining = timerSecAtStartRef.current - elapsed;
        if (remaining <= 0) {
          clearInterval(timerRef.current);
          setTimerOn(false);
          setTimerSec(timerMax);
          document.title = "GAINLOG";
          showToast("✅ Rest done — next set!");
          // Vibrate
          if (navigator.vibrate) navigator.vibrate([300,100,300,100,300]);
          // iOS Safari blocks web notifications - vibration is the only reliable method
          // Strong triple vibrate pattern so it's felt through pocket
          if (navigator.vibrate) navigator.vibrate([400,150,400,150,400]);
        } else {
          setTimerSec(remaining);
          // Update page title so it shows in background tab
          const mins = Math.floor(remaining/60).toString().padStart(2,"0");
          const secs = (remaining%60).toString().padStart(2,"0");
          document.title = "⏱ "+mins+":"+secs+" — GAINLOG";
        }
      }, 500);
    } else {
      clearInterval(timerRef.current);
      document.title = "GAINLOG";
    }
    return () => { clearInterval(timerRef.current); document.title = "GAINLOG"; };
  }, [timerOn]);

  // Visibility change - sync timer when coming back from background
  useEffect(() => {
    const h = () => {
      if (!document.hidden && timerOn && timerStartRef.current) {
        const elapsed = Math.floor((Date.now() - timerStartRef.current) / 1000);
        const remaining = timerSecAtStartRef.current - elapsed;
        if (remaining <= 0) { clearInterval(timerRef.current); setTimerOn(false); setTimerSec(timerMax); showToast("✅ Rest done!"); }
        else setTimerSec(remaining);
      }
    };
    document.addEventListener("visibilitychange", h);
    return () => document.removeEventListener("visibilitychange", h);
  }, [timerOn, timerMax]);

  // ── HELPERS & CALLBACKS ───────────────────────────────────────────────────
  const showToast = (msg) => { setToast(msg); setTimeout(() => setToast(null), 2800); };
  const startTimer = (sec) => { setTimerMax(sec); setTimerSec(sec); setTimerOn(true); };
  const ai = (p, t=500) => callAI(p, t, aiProvider, apiKey, aiModel);

  // Group logs + cardio by date, sorted by time within each day
  const getDayLog = (dateStr) => {
    const w = logs.filter(l => l.date === dateStr)
      .sort((a,b) => (a.time||"00:00").localeCompare(b.time||"00:00"));
    const c = cardioLogs.filter(l => l.date === dateStr)
      .sort((a,b) => (a.time||"00:00").localeCompare(b.time||"00:00"));
    const all = [
      ...w.map(x=>({...x,type:"workout"})),
      ...c.map(x=>({...x,type:"cardio"}))
    ].sort((a,b) => (a.time||"00:00").localeCompare(b.time||"00:00"));
    const totalVol = w.reduce((s,l)=>s+l.sets.reduce((ss,set)=>ss+(Number(set.weight)*Number(set.reps)),0),0);
    const cardioMin = c.reduce((s,l)=>s+(Number(l.duration)||0),0);
    const calDisplay = c.reduce((s,l)=>s+(Number(l.calDisplay)||0),0);
    // Gym time = from first to last logged entry
    const times = all.filter(x=>x.time).map(x=>x.time);
    let gymTime = null;
    if (times.length >= 2) {
      const first = times[0], last = times[times.length-1];
      const [fh,fm] = first.split(":").map(Number);
      const [lh,lm] = last.split(":").map(Number);
      const diffMin = (lh*60+lm) - (fh*60+fm);
      if (diffMin > 0) gymTime = diffMin >= 60 ? Math.floor(diffMin/60)+"h "+(diffMin%60)+"m" : diffMin+"m";
    }
    return {date:dateStr, workouts:w, cardio:c, all, total:w.length+c.length, totalVol, cardioMin, calDisplay, gymTime};
  };

  const getAllDates = () => {
    const dates = new Set([...logs.map(l=>l.date), ...cardioLogs.map(l=>l.date)]);
    return sortDates([...dates]);
  };

  const saveLogAsNewPlan = async (dateStr, planName) => {
    const dayData = getDayLog(dateStr);
    if (dayData.total === 0) return;
    const exercises = dayData.workouts.map(w => ({
      name: w.machine,
      sets: w.sets.length + "x" + (w.sets[0]?.reps||"?"),
      weight: (w.sets[0]?.weight||"?") + "lb"
    }));
    if (dayData.cardio.length > 0) {
      dayData.cardio.forEach(c => exercises.push({name: c.machine + " (cardio)", sets: c.duration + " min", weight: c.calDisplay ? c.calDisplay + " cal" : ""}));
    }
    const newPlan = {
      id: uid(), name: planName || "Plan from "+dateStr, color: "#c8f135",
      source: "logged", createdAt: new Date().toISOString(), rawText: "",
      days: [{day: "Day 1", name: planName || dateStr, exercises}]
    };
    savePlansToStorage([...savedPlans, newPlan]);
    return newPlan;
  };
  const latest = bodyLog[bodyLog.length-1];
  const prev = bodyLog.length > 1 ? bodyLog[bodyLog.length-2] : null;
  const prs = getPRs(logs);
  const filtered = histFilter==="pr" ? logs.filter(l=>l.isPR) : histFilter==="ss" ? logs.filter(l=>l.superset) : logs;
  const tPct = timerMax > 0 ? ((timerMax-timerSec)/timerMax)*100 : 0;
  const R=68, CIRC=2*Math.PI*R;

  const ctx = () => {
    const hist = logs.slice(0,20).map(l => l.date+" | "+l.machine+" | "+l.sets.map(s=>s.reps+"x"+s.weight+"lb").join(", ")+(l.isPR?" [PR]":"")).join("; ");
    const prStr = prs.slice(0,8).map(p => p.machine+":"+p.weight+"lb x"+p.reps).join(", ");
    const body = latest ? "Weight:"+latest.weight+"lb Fat:"+latest.bodyFat+"% Muscle:"+latest.muscle+"lb BMR:"+latest.bmr+"kcal BodyAge:"+latest.bodyAge : "No scan";
    const scans = bodyLog.map(b => b.date+":score="+b.score+" wt="+b.weight+"lb fat="+b.bodyFat+"% muscle="+b.muscle+"lb age="+b.bodyAge).join(" | ");
    const mach = machines.slice(0,20).join(", ");
    return {hist, prStr, body, scans, mach};
  };

  const savePlansToStorage = (plans) => { setSavedPlans(plans); };



  // Workout logging
  const logWorkout = () => {
    const m = machine==="__new" ? newMach : machine;
    if (!m) { showToast("Pick a machine/exercise first"); return; }
    const valid = sets.filter(s => s.reps && s.weight);
    if (!valid.length) { showToast("Add at least one set"); return; }
    const currentPR = prs.find(p => p.machine===m);
    const maxVol = Math.max(...valid.map(s => Number(s.weight)*Number(s.reps)));
    const isPR = !currentPR || maxVol > currentPR.vol;
    const entry = {id:uid(), date:today(), time:nowTime(), machine:m, sets:valid.map(s=>({...s,done:true})), superset:isSuper, supersetWith:isSuper?superWith:"", supersetSets:isSuper?superSets.filter(s=>s.reps&&s.weight).map(s=>({...s,done:true})):[], notes:wNotes, isPR};
    if (machine==="__new" && newMach && !machines.includes(newMach)) { setMachines(p=>[...p,newMach]); addMachine(newMach).catch(()=>{}); }
    const newLogs = [entry, ...logs];
    setLogs(newLogs);
    saveLog(entry).catch(()=>{});


    setSets([{id:uid(),reps:"",weight:"",done:false}]);
    setSuperSets([{id:uid(),reps:"",weight:"",done:false}]);
    setMachine(""); setMachSearch(""); setNewMach(""); setWNotes(""); setIsSuper(false); setSuperWith(""); setSuperSearch(""); setSuperOpen(false);
    showToast(isPR ? "🏆 New PR!" : "✅ Logged: "+m);
  };

  // AI calls
  const callSug = async () => {
    setAiSugL(true); setAiSug(null);
    const {hist, prStr, body, mach} = ctx();
    const todayLogs = logs.filter(l=>l.date===today());
    const todaySummary = todayLogs.length>0 ? todayLogs.map(l=>l.machine+": "+l.sets.map(s=>s.reps+"x"+s.weight+"lb").join(", ")).join(" | ") : "Nothing logged today yet";
    const p = [
      "You are an expert hypertrophy coach for a 51yr old male training 7 days/week twice daily.",
      "Body: "+body+". Today so far: "+todaySummary+". PRs: "+prStr+".",
      "History: "+hist+". Equipment: "+mach+". Hydration: "+waterMl+"ml/"+waterGoal+"ml.",
      "Give SPECIFIC advice with exact numbers:",
      "1. Progressive overload: which machine, current→target weight and why",
      "2. Superset combo: Machine A + Machine B, exact sets/reps",
      "3. Body composition insight based on fat% and muscle mass",
      "4. Today's priority session based on what's been logged",
      "Use **bold** for key numbers. 150 words max."
    ].join(" ");
    try { setAiSug(await ai(p, 400)); } catch(e) { setAiSug("Error. Check API key in Setup."); }
    setAiSugL(false);
  };

  const callPlan = async () => {
    setAiPlanL(true); setAiPlan(null);
    const {prStr, body, mach} = ctx();
    const p = "Expert hypertrophy coach. Generate a personalised Mon-Sun workout plan for 51yr old male, twice daily. Use ONLY: "+mach+". Body: "+body+". PRs: "+prStr+". List each day with 6-8 exercises, exact sets x reps @ weight. Include rest times. Use **bold** for weights. 400 words max.";
    try { setAiPlan(await ai(p, 700)); } catch(e) { setAiPlan("Error. Check API key."); }
    setAiPlanL(false);
  };

  const callScan = async () => {
    setAiScanL(true); setAiScan(null);
    const {scans, body, prStr} = ctx();
    const p = "Body composition expert. Analyse scan history: "+scans+". Latest: "+body+". PRs: "+prStr+". Give: 1) Trend analysis with specific numbers 2) What metrics need attention 3) How gym performance correlates 4) 6-month projection. Use **bold** for key numbers. 200 words max.";
    try { setAiScan(await ai(p, 500)); } catch(e) { setAiScan("Error."); }
    setAiScanL(false);
  };

  const callNutr = async () => {
    setAiNutrL(true); setAiNutr(null);
    const {body} = ctx();
    const p = "Sports nutritionist. Body data for 51yr old male hypertrophy athlete: "+body+". Hydration: "+waterMl+"ml/"+waterGoal+"ml. Give: 1) Daily calorie target with exact numbers 2) Protein in grams 3) Carb/fat split 4) Meal timing for twice-daily training 5) Key supplements. Use **bold** for numbers. 200 words max.";
    try { setAiNutr(await ai(p, 500)); } catch(e) { setAiNutr("Error."); }
    setAiNutrL(false);
  };

  const callPlat = async () => {
    setAiPlatL(true); setAiPlat(null);
    const {hist, prStr, scans} = ctx();
    const p = "Strength coach. Detect plateaus. History: "+hist+". PRs: "+prStr+". Scans: "+scans+". Give: 1) Stagnating exercises with evidence 2) Progressing exercises 3) Deload recommendation 4) Plateau-breaking strategies with exact weights. Use **bold** for key data. 200 words max.";
    try { setAiPlat(await ai(p, 500)); } catch(e) { setAiPlat("Error."); }
    setAiPlatL(false);
  };

  const callAge = async () => {
    setAiAgeL(true); setAiAge(null);
    const {scans, body, prStr} = ctx();
    const p = "Longevity and fitness expert. Chronological age: 51, Male. Scans: "+scans+". Latest: "+body+". PRs: "+prStr+". Give: 1) Body age trend 2) What drives the score 3) Specific changes to reduce body age 4) Strength vs expected for age 5) Realistic 6-month target. Use **bold** for numbers. 200 words max.";
    try { setAiAge(await ai(p, 500)); } catch(e) { setAiAge("Error."); }
    setAiAgeL(false);
  };





  const saveAIPlanAsCustom = () => {
    if (!aiPlan) return;
    const newPlan = {id:uid(), name:"AI Plan "+new Date().toLocaleDateString("en-GB",{day:"2-digit",month:"short"}), color:"#9b5de5", source:"ai", createdAt:new Date().toISOString(), rawText:aiPlan, days:["Mon","Tue","Wed","Thu","Fri","Sat","Sun"].map((d,i)=>({day:d,name:"Day "+(i+1),exercises:[]}))};
    savePlansToStorage([...savedPlans, newPlan]);
    showToast("Plan saved to Plan tab!");
  };

  // PDF parsing
  const handlePDF = async (file) => {
    if (!file) return;
    setParsing(true); showToast("Reading Starfit PDF...");
    try {
      const b64 = await new Promise((res,rej) => { const r = new FileReader(); r.onload=()=>res(r.result.split(",")[1]); r.onerror=rej; r.readAsDataURL(file); });
      const geminiKey = apiKey;
      const prompt = "Extract ALL metrics from this Starfit body composition report. Return ONLY valid JSON: {date,score,weight,bodyFat,muscle,skeletalMuscle,protein,bodyWater,inorganicSalt,bmi,visceralFat,bmr,bodyAge,fatFreeMass,subcutaneousFat,smi,whr}. Use 0 for missing. Return ONLY the JSON object.";
      const parsed = await callAIPDF(b64, prompt, geminiKey);
      if (parsed) {
        const entry = {id:uid(), date:parsed.date||today(), source:"Starfit PDF", score:parsed.score||0, weight:parsed.weight||0, bodyFat:parsed.bodyFat||0, muscle:parsed.muscle||0, skeletalMuscle:parsed.skeletalMuscle||0, protein:parsed.protein||0, bodyWater:parsed.bodyWater||0, inorganicSalt:parsed.inorganicSalt||0, bmi:parsed.bmi||0, visceralFat:parsed.visceralFat||0, bmr:parsed.bmr||0, bodyAge:parsed.bodyAge||0, fatFreeMass:parsed.fatFreeMass||0, subcutaneousFat:parsed.subcutaneousFat||0, smi:parsed.smi||0, whr:parsed.whr||0, notes:""};
        setBodyLog(p=>[...p,entry]);
        saveBodyScan(entry).catch(()=>{});
        showToast("Starfit report imported!");
        setBodyTab("overview");
      }
    } catch(e) { showToast("Could not read PDF. Try manual entry."); }
    setParsing(false);
  };

  // Camera machine detection
  const detectMachine = async (imageBase64) => {
    setCamDetecting(true); setCamResult(null);
    const promptParts = ["You are a gym equipment expert.", "Identify the gym machine in this image.", "Return ONLY a JSON object: {name, confidence, description, muscleGroup}", "confidence is high/medium/low. No other text."];
    const prompt = promptParts.join(" ");
    try {
      let responseText = "";
      if (aiProvider==="gemini" && apiKey) {
        const r = await fetch("https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key="+apiKey, {method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({contents:[{parts:[{inline_data:{mime_type:"image/jpeg",data:imageBase64}},{text:prompt}]}]})});
        const d = await r.json(); responseText = d?.candidates?.[0]?.content?.parts?.[0]?.text || "{}";
      } else if (aiProvider==="claude" && apiKey) {
        const r = await fetch("https://api.anthropic.com/v1/messages", {method:"POST",headers:{"Content-Type":"application/json","x-api-key":apiKey,"anthropic-version":"2023-06-01","anthropic-dangerous-direct-browser-access":"true"},body:JSON.stringify({model:"claude-haiku-4-5-20251001",max_tokens:200,messages:[{role:"user",content:[{type:"image",source:{type:"base64",media_type:"image/jpeg",data:imageBase64}},{type:"text",text:prompt}]}]})});
        const d = await r.json(); responseText = d?.content?.[0]?.text || "{}";
      } else if (aiProvider==="gpt" && apiKey) {
        const r = await fetch("https://api.openai.com/v1/chat/completions", {method:"POST",headers:{"Content-Type":"application/json","Authorization":"Bearer "+apiKey},body:JSON.stringify({model:"gpt-4o-mini",max_tokens:200,messages:[{role:"user",content:[{type:"image_url",image_url:{url:"data:image/jpeg;base64,"+imageBase64}},{type:"text",text:prompt}]}]})});
        const d = await r.json(); responseText = d?.choices?.[0]?.message?.content || "{}";
      } else {
        setCamResult({name:"No AI key",confidence:"low",description:"Add an API key in Setup first.",muscleGroup:""});
        setCamDetecting(false); return;
      }
      const parsed = JSON.parse(responseText.replace(/```json|```/g,"").trim());
      setCamResult(parsed); setCamEdit(parsed.name||"");
    } catch(e) { setCamResult({name:"Detection failed",confidence:"low",description:"Could not analyse image.",muscleGroup:""}); setCamEdit(""); }
    setCamDetecting(false);
  };

  const handleCameraCapture = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => { const b64 = reader.result.split(",")[1]; setCamPhoto(reader.result); detectMachine(b64); };
    reader.readAsDataURL(file);
  };

  const confirmMachine = () => {
    const name = camEdit.trim();
    if (!name) { showToast("Enter a machine name"); return; }
    if (!machines.includes(name)) { setMachines(p=>[...p,name]); addMachine(name).catch(()=>{}); }
    setMachine(name); setMachSearch(name); setMachOpen(false);
    setCamOpen(false); setCamPhoto(null); setCamResult(null); setCamEdit("");
    showToast("✅ "+name+" added!");
  };

  const feat = (id, icon, title, sub, loading, result, onRun, label) => (
    <>
      <button className={"afbtn"+(openFeat===id?" on":"")} onClick={()=>setOpenFeat(openFeat===id?"":id)}>
        <span style={{fontSize:24,flexShrink:0}}>{icon}</span>
        <div style={{flex:1}}>
          <div className="aftl">{title}</div>
          <div className="afsu">{sub}</div>
        </div>
        <span style={{color:"#c8f135",fontSize:16}}>{openFeat===id?"▲":"▶"}</span>
      </button>
      {openFeat===id && (
        <div style={{background:"#111118",border:"1px solid #1c1c2c",borderRadius:12,padding:14,marginTop:-4,marginBottom:10}}>
          <button className="btn bacc bfull" style={{marginTop:0}} onClick={onRun} disabled={loading}>
            {loading ? "⟳ Thinking..." : label}
          </button>
          {loading && <div style={{marginTop:10}}><Ldots/></div>}
          {result && (
            <div className="ai-result">
              <div className="ai-result-text">{renderAI(result)}</div>
            </div>
          )}
        </div>
      )}
    </>
  );

  // ── RENDER ─────────────────────────────────────────────────────────────────
  return (
    <div className="app">
      {toast && <div className="toast">{toast}</div>}

      {/* Header */}
      <div className="hdr">
        <div className="htop">
          <div>
            <div className="logo">GAINLOG</div>
            <div className="lsub">{syncing ? "⟳ Syncing..." : dbReady ? "☁ Synced" : "Hypertrophy Tracker"}</div>
          </div>
          <div className="hbtns">
            <button className="hamburger" onClick={()=>setNavOpen(true)}>
              <div className="hbar"/><div className="hbar"/><div className="hbar"/>
            </button>
            <button className="icb" onClick={()=>setWaterOpen(v=>!v)}>
              💧
              <span className="wbadge">{waterMl>=1000?(waterMl/1000).toFixed(1)+"L":waterMl+"ml"}</span>
            </button>
            <button className="icb" onClick={async()=>{
              showToast("Generating report...");
              const {body,prStr} = ctx();
              const sum = await ai("Write 3 motivating sentences for hypertrophy athlete. "+body+" PRs: "+prStr+". Note composition and lifts.",200);
              const prRows = prs.slice(0,10).map((p,i)=>"<tr><td>"+(i+1)+"</td><td>"+p.machine+"</td><td>"+p.weight+"lb</td><td>"+p.reps+"</td><td>"+p.date+"</td></tr>").join("");
              const lRows = logs.slice(0,15).map(l=>"<tr><td>"+l.date+"</td><td>"+l.machine+"</td><td>"+l.sets.map(s=>s.reps+"x"+s.weight+"lb").join(", ")+"</td><td>"+(l.isPR?"PR ":"")+(l.superset?"SS":"")+"</td></tr>").join("");
              const html = "<!DOCTYPE html><html><head><meta charset='utf-8'/><title>GAINLOG</title><style>body{font-family:Arial;max-width:780px;margin:0 auto;padding:24px;}h1{font-size:26px;letter-spacing:3px;color:#c8f135;}table{width:100%;border-collapse:collapse;font-size:11px;}th{background:#111;color:#fff;padding:5px 7px;text-align:left;}td{padding:4px 7px;border-bottom:1px solid #eee;}</style></head><body><h1>GAINLOG</h1><p>"+sum+"</p><h2>PRs</h2><table><tr><th>#</th><th>Machine</th><th>Weight</th><th>Reps</th><th>Date</th></tr>"+prRows+"</table><h2>Recent</h2><table><tr><th>Date</th><th>Machine</th><th>Sets</th><th>Flags</th></tr>"+lRows+"</table></body></html>";
              const w = window.open("","_blank"); if(w){w.document.write(html);w.document.close();setTimeout(()=>w.print(),800);}
            }}>📄</button>
          </div>
        </div>
      </div>

      {/* Water Panel */}
      {waterOpen && (
        <div className="water-panel">
          <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:8}}>
            <div style={{fontSize:14,fontWeight:600}}>💧 Hydration Today</div>
            <div style={{display:"flex",alignItems:"center",gap:8}}>
              <span style={{fontFamily:"'JetBrains Mono',monospace",fontSize:14,color:waterMl>=waterGoal?"#c8f135":"#4cc9f0",fontWeight:700}}>
                {waterMl>=1000?(waterMl/1000).toFixed(2)+"L":waterMl+"ml"}
              </span>
              <span style={{fontSize:11,color:"#6a6a8a"}}>/ {waterGoal/1000}L</span>
            </div>
          </div>
          <div className="prog" style={{marginBottom:10}}>
            <div className="progf" style={{width:Math.min(waterMl/waterGoal*100,100)+"%",background:waterMl>=waterGoal?"#c8f135":"#4cc9f0"}}/>
          </div>
          <div style={{display:"flex",gap:6,marginBottom:10}}>
            {[150,250,350,500,750,1000].map(ml=>(
              <button key={ml} onClick={()=>{setWaterMl(w=>w+ml);showToast("+"+ml+"ml");}}
                style={{flex:1,padding:"9px 2px",background:"#111118",border:"1px solid #1c1c2c",borderRadius:9,color:ml>=500?"#c8f135":"#4cc9f0",cursor:"pointer",textAlign:"center",fontSize:10,fontWeight:700}}>
                {ml>=1000?ml/1000+"L":ml}<div style={{fontSize:8,color:"#6a6a8a"}}>{ml>=1000?"L":"ml"}</div>
              </button>
            ))}
          </div>
          <div style={{display:"flex",gap:8,marginBottom:10}}>
            <input className="inp" type="number" placeholder="Custom ml..." value={waterCustom} onChange={e=>setWaterCustom(e.target.value)} style={{flex:1,padding:"10px 12px",fontSize:14}}/>
            <button className="btn bacc" style={{padding:"10px 16px"}} onClick={()=>{const ml=parseInt(waterCustom);if(!ml||ml<=0)return;setWaterMl(w=>w+ml);setWaterCustom("");showToast("+"+ml+"ml");}}>Add</button>
          </div>
          <div style={{display:"flex",gap:6,marginBottom:10}}>
            {[2000,2500,3000,3500,4000].map(g=>(
              <button key={g} onClick={()=>setWaterGoal(g)} style={{flex:1,padding:"6px 2px",background:waterGoal===g?"#c8f13520":"#111118",border:"1px solid "+(waterGoal===g?"#c8f13540":"#1c1c2c"),borderRadius:8,color:waterGoal===g?"#c8f135":"#6a6a8a",cursor:"pointer",fontSize:10,fontWeight:600}}>
                {g/1000}L
              </button>
            ))}
          </div>
          <div style={{display:"flex",gap:8}}>
            <button className="btn bgh" style={{flex:1}} onClick={()=>{setWaterMl(0);showToast("Reset!");}}>Reset</button>
            <button className="btn bgh" style={{padding:"12px 16px"}} onClick={()=>setWaterOpen(false)}>✕</button>
          </div>
        </div>
      )}

      {/* Page content */}
      <div className="pg">

        {/* ── WORKOUT TAB ── */}
        {tab==="workout" && (
          <>
            {/* AI Coach */}
            <div className="aib">
              <div className="aihdr">
                <div className="aidot"/>
                <div className="aitl">AI Coach</div>
                {latest && <span className="chip b" style={{marginLeft:"auto"}}>Starfit Active</span>}
              </div>
              {!aiSug && !aiSugL && (
                <div className="aitxt" style={{marginBottom:10}}>
                  {latest ? "Body fat "+latest.bodyFat+"%, muscle "+latest.muscle+"lb, BMR "+latest.bmr+"kcal. Tap for personalised advice." : "Upload Starfit PDF in Body tab for full AI coaching."}
                </div>
              )}
              <button className="btn bacc bfull" style={{marginBottom:aiSug||aiSugL?10:0}} onClick={callSug} disabled={aiSugL}>
                {aiSugL ? "⟳ Thinking..." : "🤖 Get AI Suggestion"}
              </button>
              {aiSugL && <Ldots/>}
              {aiSug && (
                <div className="ai-result">
                  <div className="ai-result-title">AI Recommendation</div>
                  <div className="ai-result-text">{renderAI(aiSug)}</div>
                  <button className="btn bgh bfull" style={{marginTop:10,fontSize:13}} onClick={()=>setAiSug(null)}>Clear</button>
                </div>
              )}
}
            </div>

            {/* Today's Plan selector */}
            <div className="card" style={{padding:"13px 15px"}}>
              <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:planSelectOpen||selectedSessionPlan?10:0}}>
                <div style={{fontSize:14,fontWeight:600}}>📋 Today's Plan</div>
                <button onClick={()=>setPlanSelectOpen(v=>!v)} style={{background:selectedSessionPlan?"#c8f13520":"#1c1c2c",border:"1px solid "+(selectedSessionPlan?"#c8f13540":"#1c1c2c"),borderRadius:8,padding:"5px 12px",fontSize:12,color:selectedSessionPlan?"#c8f135":"#6a6a8a",cursor:"pointer",fontWeight:600}}>
                  {selectedSessionPlan ? selectedSessionPlan.name : "Select Plan"}
                </button>
              </div>
              {planSelectOpen && (
                <div style={{background:"#111118",borderRadius:10,padding:10}}>
                  <div style={{fontSize:10,color:"#6a6a8a",marginBottom:7,textTransform:"uppercase",letterSpacing:1}}>Built-in Plans</div>
                  {PLANS.map((p,i)=>(
                    <div key={p.id} onClick={()=>{setSelectedSessionPlan({...p,type:"builtin"});setPlanSelectOpen(false);}} style={{padding:"9px 11px",borderRadius:8,cursor:"pointer",marginBottom:4,background:selectedSessionPlan?.id===p.id?"#c8f13512":"#15151e",border:"1px solid "+(selectedSessionPlan?.id===p.id?"#c8f13540":"#1c1c2c")}}>
                      <span style={{fontSize:13,fontWeight:600,color:p.color}}>{p.day}</span>
                      <span style={{fontSize:12,color:"#e8e8f0",marginLeft:8}}>{p.name}</span>
                    </div>
                  ))}
                  {savedPlans.length>0 && (
                    <>
                      <div style={{fontSize:10,color:"#6a6a8a",marginBottom:7,marginTop:10,textTransform:"uppercase",letterSpacing:1}}>Saved Plans</div>
                      {savedPlans.map(p=>(
                        <div key={p.id} onClick={()=>{setSelectedSessionPlan({...p,type:"saved"});setPlanSelectOpen(false);}} style={{padding:"9px 11px",borderRadius:8,cursor:"pointer",marginBottom:4,background:selectedSessionPlan?.id===p.id?"#c8f13512":"#15151e",border:"1px solid "+(selectedSessionPlan?.id===p.id?"#c8f13540":"#1c1c2c")}}>
                          <span style={{fontSize:13,fontWeight:600,color:"#9b5de5"}}>{p.name}</span>
                        </div>
                      ))}
                    </>
                  )}
                  <button className="btn bgh bfull" style={{marginTop:8,fontSize:12}} onClick={()=>{setSelectedSessionPlan(null);setPlanSelectOpen(false);}}>Clear</button>
                </div>
              )}
              {selectedSessionPlan && !planSelectOpen && (
                <div>
                  <div style={{fontSize:11,color:"#6a6a8a",marginBottom:7}}>Tap to pre-fill exercise:</div>
                  <div style={{display:"flex",flexWrap:"wrap",gap:5}}>
                    {(selectedSessionPlan.exercises||[]).filter(ex=>ex.name&&!ex.name.startsWith("──")).map((ex,i)=>(
                      <button key={i} onClick={()=>{setMachine(machines.includes(ex.name)?"":ex.name==="__new"?"__new":machines.includes(ex.name)?ex.name:"__new");setNewMach(ex.name);setMachSearch(ex.name);setMachOpen(false);}}
                        style={{background:"#1c1c2c",border:"none",borderRadius:7,padding:"5px 10px",fontSize:12,color:"#e8e8f0",cursor:"pointer"}}>
                        {ex.name.length>24?ex.name.slice(0,22)+"…":ex.name}
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Rest Timer */}
            <div className="card">
              <div className="ct">Rest Timer</div>
              <div className="twrap">
                <svg className="tsvg" width="160" height="160" viewBox="0 0 160 160">
                  <circle cx="80" cy="80" r={R} fill="none" stroke="#1c1c2c" strokeWidth="8"/>
                  <circle cx="80" cy="80" r={R} fill="none" stroke="#c8f135" strokeWidth="8"
                    strokeDasharray={CIRC} strokeDashoffset={CIRC-(CIRC*tPct/100)}
                    strokeLinecap="round" style={{transition:"stroke-dashoffset .5s"}}/>
                </svg>
                <div className="tnum">{fmt(timerSec)}</div>
                <div className="tlbl">REST</div>
              </div>
              <div className="row" style={{marginBottom:10}}>
                {[60,90,120,180].map(s=>(
                  <button key={s} className="btn bgh" style={{flex:1,padding:"10px 2px",fontSize:13}} onClick={()=>startTimer(s)}>{s}s</button>
                ))}
              </div>
              <div className="row">
                <button className="btn bacc" style={{flex:1}} onClick={()=>setTimerOn(v=>!v)}>{timerOn?"Pause":"Start"}</button>
                <button className="btn bgh" style={{flex:1}} onClick={()=>{setTimerOn(false);setTimerSec(timerMax);}}>Reset</button>
              </div>
            </div>

            {/* Log Exercise */}
            <div className="card">
              <div className="ct">Log Exercise</div>

              {/* Machine/Exercise search */}
              <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:6}}>
                <div className="cl" style={{margin:0}}>Machine / Exercise</div>
                <button onClick={()=>{setCamOpen(true);setCamPhoto(null);setCamResult(null);setCamEdit("");}}
                  style={{background:"#c8f13520",border:"1px solid #c8f13540",borderRadius:8,padding:"4px 11px",fontSize:12,color:"#c8f135",cursor:"pointer",fontWeight:600}}>
                  📷 Scan Machine
                </button>
              </div>
              <div className="mach-wrap" ref={machSearchRef}>
                <span className="mach-icon">🔍</span>
                <input className="mach-search" placeholder={machine&&machine!=="__new"?machine:"Search or select exercise..."} value={machSearch}
                  onChange={e=>{setMachSearch(e.target.value);setMachOpen(true);}}
                  onFocus={()=>setMachOpen(true)}/>
                {(machine||machSearch) && (
                  <button className="mach-clear" onClick={()=>{setMachine("");setMachSearch("");setNewMach("");setMachOpen(false);}}>×</button>
                )}
                {machOpen && (
                  <div className="mach-dropdown">
                    {(() => {
                      const q = machSearch.toLowerCase();
                      const filtered2 = machines.filter(m=>m.toLowerCase().includes(q));
                      return (
                        <>
                          {filtered2.length===0 && q && <div className="mach-none">No matches for "{machSearch}"</div>}
                          {filtered2.map(m=>(
                            <div key={m} className={"mach-opt"+(machine===m?" sel":"")} onClick={()=>{setMachine(m);setMachSearch("");setMachOpen(false);}}>
                              <span>{m}</span>
                              {machine===m && <span>✓</span>}
                            </div>
                          ))}
                          {machSearch && !machines.find(m=>m.toLowerCase()===machSearch.toLowerCase()) && (
                            <div className="mach-opt mach-add" onClick={()=>{setMachine("__new");setNewMach(machSearch);setMachSearch("");setMachOpen(false);}}>
                              + Add "{machSearch}"
                            </div>
                          )}
                          {!machSearch && (
                            <div className="mach-opt mach-add" onClick={()=>{setMachine("__new");setMachSearch("");setMachOpen(false);}}>
                              + Add new exercise
                            </div>
                          )}
                        </>
                      );
                    })()}
                  </div>
                )}
              </div>
              {machine==="__new" && (
                <input className="inp" style={{marginTop:8}} placeholder="Exercise name..." value={newMach} onChange={e=>setNewMach(e.target.value)}/>
              )}

              <div className="divider"/>

              {/* Superset toggle */}
              <div className="row" style={{alignItems:"center",marginBottom:10}}>
                <div style={{flex:1}}>
                  <div style={{fontWeight:600,fontSize:14}}>Superset</div>
                  <div style={{fontSize:12,color:"#6a6a8a"}}>Pair with another exercise</div>
                </div>
                <button className={"btn "+(isSuper?"bacc":"bgh")} style={{padding:"6px 14px",fontSize:13}} onClick={()=>setIsSuper(v=>!v)}>{isSuper?"ON":"OFF"}</button>
              </div>

              {/* ① Main sets - FIRST */}
              <div style={{fontSize:12,color:"#6a6a8a",fontWeight:600,marginBottom:8}}>
                {isSuper ? "① "+(machine==="__new"?newMach:machine||"Main Exercise")+" sets:" : "Sets:"}
              </div>
              <div style={{display:"grid",gridTemplateColumns:"24px 1fr 1fr 30px 24px",gap:5,marginBottom:6}}>
                {["","Reps","Weight(lb)","",""].map((h,i)=><span key={i} style={{fontSize:10,color:"#6a6a8a",textAlign:"center",textTransform:"uppercase",letterSpacing:".7px"}}>{h}</span>)}
              </div>
              {sets.map((s,i)=>(
                <div key={s.id} className="srow">
                  <span className="snum">{i+1}</span>
                  <input className="sinp" type="number" placeholder="10" value={s.reps} onChange={e=>setSets(p=>p.map((x,j)=>j===i?{...x,reps:e.target.value}:x))}/>
                  <input className="sinp" type="number" placeholder="85" value={s.weight} onChange={e=>setSets(p=>p.map((x,j)=>j===i?{...x,weight:e.target.value}:x))}/>
                  <button className={"sdone"+(s.done?" ck":"")} onClick={()=>{
                    const was = !s.done;
                    setSets(p=>p.map((x,j)=>j===i?{...x,done:!x.done}:x));
                    if (was) {
                      if (isSuper) { showToast("✅ Set "+(i+1)+" done! Now do: "+(superWith||"paired exercise")); }
                      else { startTimer(timerMax); showToast("Set "+(i+1)+" done! Resting..."); }
                    }
                  }}>{s.done?"✓":""}</button>
                  <button style={{background:"none",border:"none",color:"#ff4d6d",fontSize:16,cursor:"pointer"}} onClick={()=>setSets(p=>p.filter((_,j)=>j!==i))}>×</button>
                </div>
              ))}
              <button className="btn bgh bfull" style={{fontSize:13}} onClick={()=>{
                const last = sets[sets.length-1];
                setSets(p=>[...p,{id:uid(),reps:last?.reps||"",weight:last?.weight||"",done:false}]);
              }}>+ Add Set</button>

              {/* ② Superset - SECOND */}
              {isSuper && (
                <div style={{background:"#111118",borderRadius:12,padding:14,border:"1px solid #4cc9f040",marginTop:14}}>
                  <div style={{fontSize:13,color:"#4cc9f0",fontWeight:700,marginBottom:10}}>⚡ ② Paired Exercise</div>
                  <div className="cl" style={{marginTop:0,color:"#4cc9f0"}}>Paired Exercise</div>
                  <div className="mach-wrap" ref={superSearchRef}>
                    <span className="mach-icon" style={{color:"#4cc9f0"}}>🔍</span>
                    <input className="mach-search" style={{borderColor:superWith?"#4cc9f040":"#1c1c2c"}}
                      placeholder={superWith||"Search or select paired exercise..."}
                      value={superSearch}
                      onChange={e=>{setSuperSearch(e.target.value);setSuperOpen(true);}}
                      onFocus={()=>setSuperOpen(true)}/>
                    {(superWith||superSearch) && (
                      <button className="mach-clear" onClick={()=>{setSuperWith("");setSuperSearch("");setSuperOpen(false);}}>×</button>
                    )}
                    {superOpen && (
                      <div className="mach-dropdown">
                        {(() => {
                          const q = superSearch.toLowerCase();
                          const mainMach = machine==="__new" ? newMach : machine;
                          const filtered2 = machines.filter(m=>m!==mainMach&&m.toLowerCase().includes(q));
                          return (
                            <>
                              {filtered2.length===0 && q && <div className="mach-none">No matches for "{superSearch}"</div>}
                              {filtered2.map(m=>(
                                <div key={m} className={"mach-opt"+(superWith===m?" sel":"")} onClick={()=>{setSuperWith(m);setSuperSearch("");setSuperOpen(false);}}>
                                  <span>{m}</span>
                                  {superWith===m && <span>✓</span>}
                                </div>
                              ))}
                              {superSearch && !machines.find(m=>m.toLowerCase()===superSearch.toLowerCase()) && (
                                <div className="mach-opt mach-add" onClick={()=>{
                                  if (!machines.includes(superSearch)) { setMachines(p=>[...p,superSearch]); addMachine(superSearch).catch(()=>{}); }
                                  setSuperWith(superSearch); setSuperSearch(""); setSuperOpen(false);
                                }}>+ Add "{superSearch}"</div>
                              )}
                            </>
                          );
                        })()}
                      </div>
                    )}
                  </div>
                  <div style={{marginBottom:12}}/>
                  <div style={{fontSize:12,color:"#6a6a8a",marginBottom:8}}>
                    Sets for <b style={{color:"#4cc9f0"}}>{superWith||"paired exercise"}</b>:
                  </div>
                  <div style={{display:"grid",gridTemplateColumns:"24px 1fr 1fr 30px 24px",gap:5,marginBottom:6}}>
                    {["","Reps","Weight(lb)","",""].map((h,i)=><span key={i} style={{fontSize:10,color:"#6a6a8a",textAlign:"center",textTransform:"uppercase",letterSpacing:".7px"}}>{h}</span>)}
                  </div>
                  {superSets.map((s,i)=>(
                    <div key={s.id} className="srow">
                      <span className="snum">{i+1}</span>
                      <input className="sinp" type="number" placeholder="10" value={s.reps} onChange={e=>setSuperSets(p=>p.map((x,j)=>j===i?{...x,reps:e.target.value}:x))}/>
                      <input className="sinp" type="number" placeholder="45" value={s.weight} onChange={e=>setSuperSets(p=>p.map((x,j)=>j===i?{...x,weight:e.target.value}:x))}/>
                      <button className={"sdone"+(s.done?" ck":"")} onClick={()=>{
                        const was = !s.done;
                        setSuperSets(p=>p.map((x,j)=>j===i?{...x,done:!x.done}:x));
                        if (was) { startTimer(timerMax); showToast("⚡ Superset "+(i+1)+" done! Resting..."); }
                      }}>{s.done?"✓":""}</button>
                      <button style={{background:"none",border:"none",color:"#ff4d6d",fontSize:16,cursor:"pointer"}} onClick={()=>setSuperSets(p=>p.filter((_,j)=>j!==i))}>×</button>
                    </div>
                  ))}
                  <button className="btn bgh bfull" style={{fontSize:13,borderColor:"#4cc9f040",color:"#4cc9f0"}} onClick={()=>{
                    const last = superSets[superSets.length-1];
                    setSuperSets(p=>[...p,{id:uid(),reps:last?.reps||"",weight:last?.weight||"",done:false}]);
                  }}>+ Add Paired Set</button>
                  <div style={{fontSize:12,color:"#6a6a8a",marginTop:10,background:"#15151e",borderRadius:8,padding:"8px 11px"}}>
                    💡 Complete main set → paired set → then timer starts.
                  </div>
                </div>
              )}

              <div className="divider"/>
              <div className="cl" style={{marginTop:0}}>Notes (optional)</div>
              <input className="inp" placeholder="e.g. increase weight next week..." value={wNotes} onChange={e=>setWNotes(e.target.value)}/>
              <button className="btn bacc bfull" onClick={logWorkout}>Log Exercise ✓</button>
            </div>
          </>
        )}

        {/* ── CARDIO TAB ── */}
        {tab==="cardio" && (
          <>
            <div style={{fontFamily:"'Bebas Neue',sans-serif",fontSize:22,letterSpacing:2,marginBottom:3}}>🏃 Cardio</div>
            <div style={{fontSize:12,color:"#6a6a8a",marginBottom:12}}>Log cardio · track calories · AI estimate</div>

            {/* Today summary */}
            {(()=>{
              const td = today();
              const tw = logs.filter(l=>l.date===td);
              const tc = cardioLogs.filter(l=>l.date===td);
              const calTotal = tc.reduce((s,c)=>s+(Number(c.calDisplay)||0),0);
              if (tw.length===0 && tc.length===0) return null;
              return (
                <div style={{background:"linear-gradient(135deg,#0d1a0d,#111811)",border:"1px solid #c8f13530",borderRadius:14,padding:16,marginBottom:12}}>
                  <div style={{fontSize:13,fontWeight:600,color:"#c8f135",marginBottom:12}}>Today's Calorie Burn</div>
                  <div style={{display:"flex",gap:10,marginBottom:14}}>
                    <div style={{flex:1,background:"#15151e",borderRadius:12,padding:"12px 8px",textAlign:"center",border:"2px solid #4cc9f050"}}>
                      <div style={{fontFamily:"'Bebas Neue',sans-serif",fontSize:28,color:"#4cc9f0",lineHeight:1}}>{tw.length}</div>
                      <div style={{fontSize:11,color:"#6a6a8a",marginTop:3}}>Exercises</div>
                    </div>
                    <div style={{flex:1,background:"#15151e",borderRadius:12,padding:"12px 8px",textAlign:"center",border:"2px solid #ff4d6d50"}}>
                      <div style={{fontFamily:"'Bebas Neue',sans-serif",fontSize:28,color:"#ff4d6d",lineHeight:1}}>{tc.reduce((s,c)=>s+(Number(c.duration)||0),0)}</div>
                      <div style={{fontSize:11,color:"#6a6a8a",marginTop:3}}>Cardio min</div>
                    </div>
                    <div style={{flex:1,background:"#15151e",borderRadius:12,padding:"12px 8px",textAlign:"center",border:"2px solid #c8f13550"}}>
                      <div style={{fontFamily:"'Bebas Neue',sans-serif",fontSize:28,color:"#c8f135",lineHeight:1}}>{calTotal||"—"}</div>
                      <div style={{fontSize:11,color:"#6a6a8a",marginTop:3}}>Cal display</div>
                    </div>
                  </div>
                </div>
              );
            })()}

            <div className="stabs">
              {[["log","Log Cardio"],["history","History"]].map(([k,l])=>(
                <button key={k} className={"stab"+(cardioTab===k?" on":"")} onClick={()=>setCardioTab(k)}>{l}</button>
              ))}
            </div>

            {cardioTab==="log" && (
              <div className="card">
                <div className="ct">Log Cardio Session</div>
                <div className="cl" style={{marginTop:0}}>Machine / Activity</div>
                <select className="inp" value={cardioMachine} onChange={e=>setCardioMachine(e.target.value)}>
                  <option value="">Select cardio machine...</option>
                  {CARDIO_MACHINES.map(m=><option key={m} value={m}>{m}</option>)}
                </select>
                <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:10,marginTop:10}}>
                  <div>
                    <div className="cl" style={{marginTop:0}}>Duration (min)</div>
                    <input className="inp" type="number" placeholder="15" value={cardioDuration} onChange={e=>setCardioDuration(e.target.value)}/>
                  </div>
                  <div>
                    <div className="cl" style={{marginTop:0}}>Calories (display)</div>
                    <input className="inp" type="number" placeholder="150" value={cardioCalDisplay} onChange={e=>setCardioCalDisplay(e.target.value)}/>
                  </div>
                </div>
                <div className="cl">Notes (optional)</div>
                <input className="inp" placeholder="e.g. incline 8, speed 3.5..." value={cardioNotes} onChange={e=>setCardioNotes(e.target.value)}/>
                <button className="btn bacc bfull" onClick={()=>{
                  if (!cardioMachine) { showToast("Pick a cardio machine"); return; }
                  if (!cardioDuration) { showToast("Enter duration"); return; }
                  const entry = {id:uid(), date:today(), time:nowTime(), machine:cardioMachine, duration:Number(cardioDuration), calDisplay:Number(cardioCalDisplay)||0, notes:cardioNotes, type:"cardio"};
                  const newCardio = [entry, ...cardioLogs];
                  setCardioLogs(newCardio);
                  saveCardioLog(entry).catch(()=>{});


                  setCardioMachine(""); setCardioDuration(""); setCardioCalDisplay(""); setCardioNotes("");
                  showToast("✅ Cardio logged!");
                  setCardioTab("history");
                }}>Log Cardio ✓</button>
                <div style={{marginTop:12,background:"#111118",borderRadius:10,padding:"10px 13px",fontSize:13,color:"#6a6a8a",lineHeight:1.6}}>
                  💡 Log calories from the machine display, then tap <b style={{color:"#c8f135"}}>AI Estimate</b> for accurate total burn.
                </div>
              </div>
            )}

            {cardioTab==="history" && (
              <>
                <div style={{fontSize:12,color:"#6a6a8a",marginBottom:9}}>{cardioLogs.length} sessions logged</div>
                {cardioLogs.length===0 ? (
                  <div style={{textAlign:"center",padding:"28px 0",color:"#3a3a5a",fontSize:14}}>No cardio logged yet</div>
                ) : cardioLogs.map(l=>(
                  <div key={l.id} className="cardio-item">
                    <div style={{fontSize:11,color:"#3a3a5a",fontFamily:"'JetBrains Mono',monospace"}}>{l.date}</div>
                    <div style={{fontWeight:600,fontSize:15,margin:"3px 0"}}>{l.machine}</div>
                    <div style={{display:"flex",gap:8,marginTop:5}}>
                      <span className="chip b">⏱ {l.duration} min</span>
                      {l.calDisplay>0 && <span className="chip g">🔥 {l.calDisplay} cal</span>}
                    </div>
                    {l.notes && <div style={{fontSize:12,color:"#3a3a5a",marginTop:4,fontStyle:"italic"}}>{l.notes}</div>}
                  </div>
                ))}
              </>
            )}
          </>
        )}

        {/* ── DAILY LOG TAB ── */}
        {tab==="daily" && (
          <>
            <div style={{fontFamily:"'Bebas Neue',sans-serif",fontSize:22,letterSpacing:2,marginBottom:3}}>📅 Daily Log</div>
            <div style={{fontSize:12,color:"#6a6a8a",marginBottom:12}}>Activities grouped by day · tap to save as plan</div>

            {getAllDates().length === 0 ? (
              <div style={{textAlign:"center",padding:"40px 0",color:"#3a3a5a"}}>
                <div style={{fontSize:36,marginBottom:12}}>📋</div>
                <div style={{fontSize:15,fontWeight:600,marginBottom:6}}>No sessions logged yet</div>
                <div style={{fontSize:13}}>Start logging workouts and cardio to see your daily activity here</div>
              </div>
            ) : getAllDates().map(dateStr => {
              const day = getDayLog(dateStr);
              const isToday2 = dateStr === today();
              return (
                <div key={dateStr} className="card" style={{marginBottom:14,border:isToday2?"1px solid #c8f13540":"1px solid #1c1c2c"}}>
                  {/* Day header */}
                  <div style={{display:"flex",justifyContent:"space-between",alignItems:"flex-start",marginBottom:12}}>
                    <div>
                      <div style={{fontFamily:"'Bebas Neue',sans-serif",fontSize:18,letterSpacing:1.5,color:isToday2?"#c8f135":"#e8e8f0"}}>
                        {isToday2 ? "Today" : dateStr}
                      </div>
                      <div style={{display:"flex",gap:6,marginTop:5,flexWrap:"wrap"}}>
                        {day.workouts.length > 0 && (
                          <span className="chip b" style={{fontSize:11}}>🏋️ {day.workouts.length} exercises</span>
                        )}
                        {day.cardioMin > 0 && (
                          <span className="chip r" style={{fontSize:11}}>🏃 {day.cardioMin} min</span>
                        )}
                        {day.gymTime && (
                          <span className="chip" style={{fontSize:11,background:"#9b5de520",color:"#9b5de5"}}>⏱ {day.gymTime} in gym</span>
                        )}
                        {day.totalVol > 0 && (
                          <span className="chip" style={{fontSize:11}}>⚡ {day.totalVol.toLocaleString()} lb</span>
                        )}

                      </div>
                    </div>
                    <button
                      onClick={()=>setSavingPlan(dateStr)}
                      style={{background:"#c8f13518",border:"1px solid #c8f13540",borderRadius:8,padding:"5px 10px",fontSize:11,color:"#c8f135",cursor:"pointer",fontWeight:600,flexShrink:0,marginLeft:8}}>
                      💾 Save as Plan
                    </button>
                  </div>

                  {/* Save as plan prompt */}
                  {savingPlan === dateStr && (
                    <div style={{background:"#111118",borderRadius:10,padding:12,marginBottom:12,border:"1px solid #c8f13540"}}>
                      <div style={{fontSize:12,color:"#c8f135",fontWeight:600,marginBottom:8}}>Save "{dateStr}" as a plan</div>
                      <input className="inp" style={{marginBottom:8}} placeholder="Plan name (e.g. Upper Push Day)..." value={planNameInput} onChange={e=>setPlanNameInput(e.target.value)}/>
                      <div style={{display:"flex",gap:8}}>
                        <button className="btn bacc" style={{flex:1,fontSize:12}} onClick={async()=>{
                          await saveLogAsNewPlan(dateStr, planNameInput||("Session "+dateStr));
                          setSavingPlan(null); setPlanNameInput(""); showToast("Plan saved!");
                        }}>Save Plan</button>
                        <button className="btn bgh" style={{flex:1,fontSize:12}} onClick={()=>{setSavingPlan(null);setPlanNameInput("");}}>Cancel</button>
                      </div>
                    </div>
                  )}

                  {/* Timeline of activities */}
                  <div style={{position:"relative",paddingLeft:32}}>
                    {/* Vertical timeline line */}
                    <div style={{position:"absolute",left:10,top:6,bottom:6,width:2,background:"#1c1c2c",borderRadius:2}}/>

                    {day.all.map((item,idx)=>(
                      <div key={item.id} style={{position:"relative",marginBottom:idx<day.all.length-1?14:0}}>
                        {/* Timeline dot */}
                        <div style={{position:"absolute",left:-26,top:4,width:12,height:12,borderRadius:"50%",background:item.type==="cardio"?"#4cc9f0":item.isPR?"#ffd700":"#c8f135",border:"2px solid #090910",flexShrink:0}}/>

                        {/* Activity card */}
                        <div style={{background:"#0d0d15",borderRadius:10,padding:"10px 13px",border:"1px solid "+(item.type==="cardio"?"#4cc9f020":item.isPR?"#ffd70020":"#1c1c2c")}}>
                          <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:4}}>
                            <div style={{fontWeight:600,fontSize:14,color:item.isPR?"#ffd700":item.type==="cardio"?"#4cc9f0":"#e8e8f0"}}>
                              {item.machine}
                              {item.isPR && " 🏆"}
                              {item.superset && " ⚡"}
                            </div>
                            <div style={{fontFamily:"'JetBrains Mono',monospace",fontSize:11,color:"#6a6a8a",flexShrink:0,marginLeft:8}}>
                              {item.time||""}
                            </div>
                          </div>

                          {item.type==="workout" && (
                            <>
                              <div style={{fontSize:12,color:"#6a6a8a",marginBottom:item.superset?4:0}}>
                                {item.sets.map((s,i)=>(
                                  <span key={i} style={{marginRight:8}}>
                                    <span style={{color:"#3a3a5a"}}>{i+1}: </span>
                                    <span style={{color:"#e8e8f0",fontFamily:"'JetBrains Mono',monospace"}}>{s.reps}×{s.weight}lb</span>
                                  </span>
                                ))}
                              </div>
                              {item.superset && item.supersetWith && (
                                <div style={{fontSize:11,color:"#4cc9f0",marginTop:3}}>
                                  ⚡ SS with {item.supersetWith}
                                  {item.supersetSets?.length>0 && (
                                    <span style={{color:"#6a6a8a",marginLeft:6}}>
                                      {item.supersetSets.map((s,i)=>`${s.reps}×${s.weight}lb`).join(" · ")}
                                    </span>
                                  )}
                                </div>
                              )}
                              {item.notes && <div style={{fontSize:11,color:"#3a3a5a",marginTop:3,fontStyle:"italic"}}>{item.notes}</div>}
                            </>
                          )}

                          {item.type==="cardio" && (
                            <div style={{display:"flex",gap:8,marginTop:2}}>
                              <span style={{fontSize:12,color:"#6a6a8a"}}>⏱ {item.duration} min</span>
                              {item.calDisplay>0 && <span style={{fontSize:12,color:"#6a6a8a"}}>🔥 {item.calDisplay} cal</span>}
                              {item.notes && <span style={{fontSize:12,color:"#3a3a5a",fontStyle:"italic"}}>{item.notes}</span>}
                            </div>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>

                  {/* Day footer */}
                  <div style={{marginTop:10,display:"flex",flexDirection:"column",gap:6}}>

                    {day.gymTime && (
                      <div style={{padding:"8px 12px",background:"#0d0d1a",borderRadius:9,border:"1px solid #9b5de520",fontSize:13,color:"#9b5de5",display:"flex",justifyContent:"space-between",alignItems:"center"}}>
                        <span>⏱ Total time in gym</span>
                        <span style={{fontFamily:"'JetBrains Mono',monospace",fontWeight:700,fontSize:16}}>{day.gymTime}</span>
                      </div>
                    )}
                    {day.workouts.filter(w=>w.isPR).length>0 && (
                      <div style={{padding:"8px 12px",background:"#ffd70008",borderRadius:9,border:"1px solid #ffd70020",fontSize:13,color:"#ffd700"}}>
                        🏆 {day.workouts.filter(w=>w.isPR).length} new personal record{day.workouts.filter(w=>w.isPR).length>1?"s":""}!
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </>
        )}

        {/* ── AI HUB TAB ── */}
        {tab==="ai" && (
          <>
            <div style={{fontFamily:"'Bebas Neue',sans-serif",fontSize:22,letterSpacing:2,marginBottom:3}}>AI Coach Hub</div>
            <div style={{fontSize:12,color:"#6a6a8a",marginBottom:12}}>Powered by {AI_PROVIDERS[aiProvider]?.name}</div>
            {!apiKey && (
              <div style={{background:"#ff4d6d12",border:"1px solid #ff4d6d30",borderRadius:11,padding:"11px 14px",marginBottom:12,fontSize:13,color:"#ff4d6d"}}>
                ⚠️ Add your API key in Setup tab to use AI features
              </div>
            )}
            {feat("plan","📋","Generate Weekly Plan","Full 7-day programme tailored to your body scan + machines",aiPlanL,aiPlan,callPlan,"Generate My Plan")}
            {aiPlan && !aiPlanL && (
              <button className="btn bacc bfull" style={{marginTop:-4,marginBottom:12}} onClick={saveAIPlanAsCustom}>
                💾 Save This Plan to Plan Tab
              </button>
            )}
            {feat("scan","📊","Analyse Body Scans","Detect trends + gym correlation across Starfit scans",aiScanL,aiScan,callScan,"Analyse My Scans")}
            {feat("nutr","🥗","Nutrition Targets","Personalised macros based on your BMR and body fat",aiNutrL,aiNutr,callNutr,"Get Nutrition Plan")}
            {feat("plateau","📉","Plateau Detection","Find stagnating exercises + deload recommendations",aiPlatL,aiPlat,callPlat,"Detect Plateaus")}
            {feat("age","🧬","Body Age Analysis","Track biological age trend + how to reduce it",aiAgeL,aiAge,callAge,"Analyse Body Age")}
          </>
        )}

        {/* ── PLAN TAB ── */}
        {tab==="plan" && !editingPlan && (
          <>
            <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:12}}>
              <div style={{fontFamily:"'Bebas Neue',sans-serif",fontSize:22,letterSpacing:2}}>My Plans</div>
              <button className="btn bacc" style={{fontSize:13,padding:"7px 14px"}} onClick={()=>{
                const p = {id:uid(),name:"New Plan",color:"#c8f135",source:"manual",createdAt:new Date().toISOString(),rawText:"",
                  days:["Mon","Tue","Wed","Thu","Fri","Sat","Sun"].map((d,i)=>({day:d,name:"Day "+(i+1),exercises:[{name:"",sets:"",weight:""}]}))};
                setEditPlanData(p); setEditingPlan(true);
              }}>+ New Plan</button>
            </div>

            <div style={{fontSize:11,color:"#6a6a8a",textTransform:"uppercase",letterSpacing:1,marginBottom:8}}>Built-in Programme</div>
            <div className="stabs" style={{marginBottom:8}}>
              {PLANS.map((p,i)=>(
                <button key={p.id} className={"stab"+(activePlanIdx===i?" on":"")}
                  style={{color:activePlanIdx===i?p.color:"#6a6a8a",borderColor:activePlanIdx===i?p.color+"50":"transparent",background:activePlanIdx===i?p.color+"18":"#1c1c2c"}}
                  onClick={()=>setActivePlanIdx(i)}>{p.day}</button>
              ))}
            </div>
            <div className="card" style={{marginBottom:16}}>
              <div className="ct" style={{color:PLANS[activePlanIdx].color}}>{PLANS[activePlanIdx].name}</div>
              {PLANS[activePlanIdx].exercises.map((ex,i)=>(
                ex.name.startsWith("──") ? <div key={i} className="sep">{ex.name}</div> :
                <div key={i} className="pex">
                  <div className="pexn">{ex.name}</div>
                  <div style={{textAlign:"right",flexShrink:0}}>
                    <div className="pexs" style={{color:PLANS[activePlanIdx].color}}>{ex.sets}</div>
                    <div style={{fontSize:10,color:"#3a3a5a"}}>{ex.weight}</div>
                  </div>
                </div>
              ))}
            </div>

            {savedPlans.length>0 && (
              <>
                <div style={{fontSize:11,color:"#6a6a8a",textTransform:"uppercase",letterSpacing:1,marginBottom:8}}>Your Plans ({savedPlans.length})</div>
                {savedPlans.map((plan,pi)=>(
                  <div key={plan.id} className="card" style={{marginBottom:10}}>
                    <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:10}}>
                      <div style={{fontFamily:"'Bebas Neue',sans-serif",fontSize:17,letterSpacing:1.5,color:plan.color||"#9b5de5"}}>{plan.name}</div>
                      <div style={{display:"flex",gap:6}}>
                        <button className="btn bgh" style={{fontSize:12,padding:"5px 11px"}} onClick={()=>{setEditPlanData({...plan});setEditingPlan(true);}}>Edit</button>
                        <button className="btn bred" style={{fontSize:12,padding:"5px 11px"}} onClick={()=>{if(window.confirm("Delete this plan?")){savePlansToStorage(savedPlans.filter((_,i)=>i!==pi));}}}>Del</button>
                      </div>
                    </div>
                    {plan.rawText ? (
                      <div style={{fontSize:13,color:"#6a6a8a",lineHeight:1.7}}>{renderAI(plan.rawText)}</div>
                    ) : (
                      plan.days?.map((day,di)=>(
                        day.exercises?.filter(ex=>ex.name).length>0 && (
                          <div key={di} style={{marginBottom:9}}>
                            <div style={{fontSize:11,color:plan.color||"#c8f135",fontWeight:700,marginBottom:5,textTransform:"uppercase",letterSpacing:1}}>{day.day} — {day.name}</div>
                            {day.exercises.filter(ex=>ex.name).map((ex,ei)=>(
                              <div key={ei} className="pex">
                                <div className="pexn">{ex.name}</div>
                                <div style={{textAlign:"right",flexShrink:0}}>
                                  <div style={{fontSize:11,fontFamily:"'JetBrains Mono',monospace",color:plan.color||"#c8f135"}}>{ex.sets}</div>
                                  <div style={{fontSize:10,color:"#3a3a5a"}}>{ex.weight}</div>
                                </div>
                              </div>
                            ))}
                          </div>
                        )
                      ))
                    )}
                  </div>
                ))}
              </>
            )}
            {savedPlans.length===0 && (
              <div style={{textAlign:"center",padding:"20px 0",color:"#3a3a5a",fontSize:14}}>No saved plans yet. Generate one with AI or tap + New Plan.</div>
            )}
          </>
        )}

        {/* Plan Editor */}
        {tab==="plan" && editingPlan && editPlanData && (
          <>
            <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:14}}>
              <div style={{fontFamily:"'Bebas Neue',sans-serif",fontSize:20,letterSpacing:2}}>
                {savedPlans.find(p=>p.id===editPlanData.id)?"Edit Plan":"New Plan"}
              </div>
              <div style={{display:"flex",gap:8}}>
                <button className="btn bacc" style={{fontSize:13,padding:"7px 14px"}} onClick={()=>{
                  const exists = savedPlans.findIndex(p=>p.id===editPlanData.id);
                  if (exists>=0) { const u=[...savedPlans]; u[exists]=editPlanData; savePlansToStorage(u); }
                  else savePlansToStorage([...savedPlans, editPlanData]);
                  setEditingPlan(false); setEditPlanData(null); showToast("Plan saved!");
                }}>Save</button>
                <button className="btn bgh" style={{fontSize:13,padding:"7px 14px"}} onClick={()=>{setEditingPlan(false);setEditPlanData(null);}}>Cancel</button>
              </div>
            </div>
            <div className="card">
              <div className="cl" style={{marginTop:0}}>Plan Name</div>
              <input className="inp" value={editPlanData.name} onChange={e=>setEditPlanData(p=>({...p,name:e.target.value}))} placeholder="e.g. My Hypertrophy Plan"/>
            </div>
            {editPlanData.rawText ? (
              <div className="card">
                <div className="ct">AI Generated Plan</div>
                <div style={{fontSize:13,color:"#6a6a8a",lineHeight:1.7,marginBottom:10}}>{renderAI(editPlanData.rawText)}</div>
                <button className="btn bgh bfull" style={{fontSize:13}} onClick={()=>setEditPlanData(p=>({...p,rawText:"",days:["Mon","Tue","Wed","Thu","Fri","Sat","Sun"].map((d,i)=>({day:d,name:"Day "+(i+1),exercises:[{name:"",sets:"",weight:""}]}))}))}>
                  Convert to Editable Format
                </button>
              </div>
            ) : (
              editPlanData.days?.map((day,di)=>(
                <div key={di} className="card">
                  <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:10}}>
                    <div style={{fontFamily:"'Bebas Neue',sans-serif",fontSize:16,letterSpacing:1,color:"#c8f135"}}>{day.day}</div>
                    <input className="inp" style={{width:160,fontSize:13,padding:"6px 10px"}} value={day.name}
                      onChange={e=>{const d=[...editPlanData.days];d[di]={...d[di],name:e.target.value};setEditPlanData(p=>({...p,days:d}));}}
                      placeholder="Session name"/>
                  </div>
                  {day.exercises.map((ex,ei)=>(
                    <div key={ei} style={{display:"grid",gridTemplateColumns:"1fr 70px 70px 24px",gap:5,marginBottom:7,alignItems:"center"}}>
                      <input className="sinp" value={ex.name} placeholder="Exercise name"
                        onChange={e=>{const d=[...editPlanData.days];d[di].exercises[ei]={...d[di].exercises[ei],name:e.target.value};setEditPlanData(p=>({...p,days:d}));}}/>
                      <input className="sinp" value={ex.sets} placeholder="3x12"
                        onChange={e=>{const d=[...editPlanData.days];d[di].exercises[ei]={...d[di].exercises[ei],sets:e.target.value};setEditPlanData(p=>({...p,days:d}));}}/>
                      <input className="sinp" value={ex.weight} placeholder="85lb"
                        onChange={e=>{const d=[...editPlanData.days];d[di].exercises[ei]={...d[di].exercises[ei],weight:e.target.value};setEditPlanData(p=>({...p,days:d}));}}/>
                      <button style={{background:"none",border:"none",color:"#ff4d6d",fontSize:16,cursor:"pointer"}}
                        onClick={()=>{const d=[...editPlanData.days];d[di].exercises=d[di].exercises.filter((_,i)=>i!==ei);setEditPlanData(p=>({...p,days:d}));}}>×</button>
                    </div>
                  ))}
                  <button className="btn bgh bfull" style={{fontSize:12,marginTop:5}}
                    onClick={()=>{const d=[...editPlanData.days];d[di].exercises=[...d[di].exercises,{name:"",sets:"",weight:""}];setEditPlanData(p=>({...p,days:d}));}}>
                    + Add Exercise
                  </button>
                </div>
              ))
            )}
          </>
        )}

        {/* ── PRs TAB ── */}
        {tab==="records" && (
          <>
            <div style={{fontFamily:"'Bebas Neue',sans-serif",fontSize:22,letterSpacing:2,marginBottom:3}}>Personal Records</div>
            <div style={{fontSize:12,color:"#6a6a8a",marginBottom:12}}>{prs.length} exercises tracked</div>
            <div className="prg">
              {prs.slice(0,20).map((p,i)=>(
                <div key={i} className="prc">
                  {i<3 && <div style={{position:"absolute",top:8,right:10,fontSize:14}}>🏆</div>}
                  <div className="pre">{p.machine}</div>
                  <div className="prw">{p.weight}<span style={{fontSize:13,color:"#6a6a8a"}}> lb</span></div>
                  <div style={{fontSize:11,color:"#6a6a8a"}}>{p.reps} reps</div>
                  <div className="prdt">{p.date}</div>
                </div>
              ))}
            </div>
          </>
        )}

        {/* ── HISTORY TAB ── */}
        {tab==="history" && (
          <>
            <div style={{fontFamily:"'Bebas Neue',sans-serif",fontSize:22,letterSpacing:2,marginBottom:12}}>History</div>
            <div className="stabs">
              {[["all","All"],["pr","PRs"],["ss","Supersets"]].map(([k,l])=>(
                <button key={k} className={"stab"+(histFilter===k?" on":"")} onClick={()=>setHistFilter(k)}>{l}</button>
              ))}
            </div>
            <div style={{fontSize:12,color:"#6a6a8a",marginBottom:9}}>{filtered.length} sessions</div>
            {filtered.map(l=>(
              <div key={l.id} className={"li"+(l.isPR?" pr":l.superset?" ss":"")}>
                <div className="lid">{l.date}</div>
                <div className="lim">{l.machine} {l.isPR&&"🏆"}</div>
                {l.superset && <div style={{fontSize:11,color:"#4cc9f0",marginBottom:3}}>⚡ SS w/ {l.supersetWith}</div>}
                <div className="lis">{l.sets.map((s,i)=>(i+1)+": "+s.reps+"x"+s.weight+"lb").join(" · ")}</div>
                {l.notes && <div style={{fontSize:11,color:"#3a3a5a",marginTop:3,fontStyle:"italic"}}>{l.notes}</div>}
              </div>
            ))}
          </>
        )}

        {/* ── BODY TAB ── */}
        {tab==="body" && (
          <>
            <div style={{fontFamily:"'Bebas Neue',sans-serif",fontSize:22,letterSpacing:2,marginBottom:3}}>🧬 Body Composition</div>
            <div style={{fontSize:12,color:"#6a6a8a",marginBottom:12}}>Starfit · {bodyLog.length} scan{bodyLog.length!==1?"s":""}</div>
            <div className="stabs">
              {[["overview","Overview"],["trends","Trends"],["scans","All Scans"],["water","Hydration"],["upload","Upload PDF"]].map(([k,l])=>(
                <button key={k} className={"stab"+(bodyTab===k?" on":"")} onClick={()=>setBodyTab(k)}>{l}</button>
              ))}
            </div>

            {bodyTab==="overview" && latest && (
              <>
                <div className="card" style={{textAlign:"center"}}>
                  <ScoreRing score={latest.score}/>
                  <div style={{fontSize:12,color:"#6a6a8a"}}>{latest.date} · {latest.source}</div>
                </div>
                <div className="mgrid">
                  <MetricCard label="Weight" value={latest.weight} unit=" lb" prev={prev?.weight} lowerBetter={true} color="#4cc9f0"/>
                  <MetricCard label="Body Fat" value={latest.bodyFat} unit="%" prev={prev?.bodyFat} lowerBetter={true} color="#ff4d6d"/>
                  <MetricCard label="Muscle Mass" value={latest.muscle} unit=" lb" prev={prev?.muscle} lowerBetter={false} color="#c8f135"/>
                  <MetricCard label="Skeletal Muscle" value={latest.skeletalMuscle} unit=" lb" prev={prev?.skeletalMuscle} lowerBetter={false} color="#00e096"/>
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
                {[{key:"weight",label:"Weight (lb)",lowerBetter:true,color:"#4cc9f0"},{key:"bodyFat",label:"Body Fat %",lowerBetter:true,color:"#ff4d6d"},{key:"muscle",label:"Muscle (lb)",lowerBetter:false,color:"#c8f135"},{key:"score",label:"Body Score",lowerBetter:false,color:"#00e096"}].map(m=>(
                  <div key={m.key} className="card">
                    <div style={{fontSize:13,fontWeight:600,color:m.color,marginBottom:7}}>{m.label}</div>
                    <TrendChart data={bodyLog} metricKey={m.key} color={m.color}/>
                  </div>
                ))}
              </>
            )}

            {bodyTab==="scans" && bodyLog.slice().reverse().map(e=>(
              <div key={e.id} className="ecard">
                <div style={{fontSize:10,color:"#3a3a5a",fontFamily:"'JetBrains Mono',monospace",marginBottom:5}}>{e.date} · {e.source}</div>
                <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:7}}>
                  <div style={{fontFamily:"'Bebas Neue',sans-serif",fontSize:22,color:"#c8f135"}}>{e.score}<span style={{fontSize:13,color:"#6a6a8a"}}>/100</span></div>
                  <span className="chip gold">{e.weight} lb</span>
                </div>
                <div style={{display:"grid",gridTemplateColumns:"1fr 1fr 1fr",gap:5}}>
                  {[["Fat",e.bodyFat,"%","#ff4d6d"],["Muscle",e.muscle,"lb","#c8f135"],["BMR",e.bmr,"kcal","#6a6a8a"]].map(([l,v,u,col])=>(
                    <div key={l} style={{background:"#15151e",borderRadius:7,padding:"6px 8px",textAlign:"center"}}>
                      <div style={{fontSize:13,fontWeight:700,color:col}}>{v}{u}</div>
                      <div style={{fontSize:9,color:"#3a3a5a",textTransform:"uppercase"}}>{l}</div>
                    </div>
                  ))}
                </div>
              </div>
            ))}

            {bodyTab==="water" && (
              <div className="card">
                <div className="ct">Hydration Today</div>
                <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:8}}>
                  <span style={{fontFamily:"'JetBrains Mono',monospace",fontSize:20,color:waterMl>=waterGoal?"#c8f135":"#4cc9f0",fontWeight:700}}>
                    {waterMl>=1000?(waterMl/1000).toFixed(2)+"L":waterMl+"ml"}
                  </span>
                  <span style={{fontSize:13,color:"#6a6a8a"}}>goal: {waterGoal/1000}L</span>
                </div>
                <div className="prog"><div className="progf" style={{width:Math.min(waterMl/waterGoal*100,100)+"%",background:waterMl>=waterGoal?"#c8f135":"#4cc9f0"}}/></div>
                <div style={{fontSize:12,color:"#6a6a8a",marginBottom:12,marginTop:5}}>{Math.round(waterMl/waterGoal*100)}% · {Math.max(waterGoal-waterMl,0)}ml remaining</div>
                <div style={{display:"grid",gridTemplateColumns:"1fr 1fr 1fr",gap:7,marginBottom:12}}>
                  {[150,250,350,500,750,1000].map(ml=>(
                    <button key={ml} onClick={()=>{setWaterMl(w=>w+ml);showToast("+"+ml+"ml");}}
                      style={{padding:"11px 4px",background:"#111118",border:"1px solid #1c1c2c",borderRadius:10,color:ml>=500?"#c8f135":"#4cc9f0",cursor:"pointer",textAlign:"center",fontWeight:700}}>
                      <div style={{fontSize:16,fontFamily:"'JetBrains Mono',monospace"}}>{ml>=1000?ml/1000+"L":ml}</div>
                      <div style={{fontSize:10,color:"#6a6a8a"}}>{ml>=1000?"litre":"ml"}</div>
                    </button>
                  ))}
                </div>
                <div style={{display:"flex",gap:8,marginBottom:12}}>
                  <input className="inp" type="number" placeholder="Custom ml..." value={waterCustom} onChange={e=>setWaterCustom(e.target.value)} style={{flex:1}}/>
                  <button className="btn bacc" onClick={()=>{const ml=parseInt(waterCustom);if(!ml||ml<=0)return;setWaterMl(w=>w+ml);setWaterCustom("");showToast("+"+ml+"ml");}}>Add</button>
                </div>
                <button className="btn bgh bfull" onClick={()=>{setWaterMl(0);showToast("Reset!");}}>Reset Today</button>
              </div>
            )}

            {bodyTab==="upload" && (
              <>
                <div className="card">
                  <div className="ct">Import Starfit PDF</div>
                  <div style={{fontSize:13,color:"#6a6a8a",marginBottom:12,lineHeight:1.6}}>Upload your Starfit PDF. Gemini AI extracts all metrics automatically.</div>
                  {parsing ? (
                    <div style={{textAlign:"center",padding:"16px 0"}}><Ldots/><div style={{fontSize:13,color:"#6a6a8a",marginTop:8}}>Reading your report...</div></div>
                  ) : (
                    <label className="upz" onClick={()=>fileRef.current?.click()}>
                      <input ref={fileRef} type="file" accept=".pdf,application/pdf" onChange={e=>handlePDF(e.target.files?.[0])}/>
                      <div style={{fontSize:36,marginBottom:8}}>📊</div>
                      <div style={{fontSize:14,fontWeight:600,marginBottom:4}}>Tap to upload Starfit PDF</div>
                      <div style={{fontSize:12,color:"#6a6a8a"}}>AI extracts all body composition metrics</div>
                    </label>
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
                      <div className="row" style={{marginTop:12}}>
                        <button className="btn bacc" style={{flex:1}} onClick={()=>{
                          const e2={id:uid(),date:manEntry.date||today(),source:"Manual",score:+manEntry.score||0,weight:+manEntry.weight||0,bodyFat:+manEntry.bodyFat||0,muscle:+manEntry.muscle||0,skeletalMuscle:+manEntry.skeletalMuscle||0,bmi:+manEntry.bmi||0,bmr:+manEntry.bmr||0,bodyAge:+manEntry.bodyAge||0,visceralFat:+manEntry.visceralFat||0,fatFreeMass:+manEntry.fatFreeMass||0,whr:+manEntry.whr||0,protein:0,bodyWater:0,inorganicSalt:0,subcutaneousFat:0,smi:0,notes:""};
                          setBodyLog(p=>[...p,e2]); saveBodyScan(e2).catch(()=>{}); setManEntry(null); showToast("Saved!"); setBodyTab("overview");
                        }}>Save</button>
                        <button className="btn bgh" style={{flex:1}} onClick={()=>setManEntry(null)}>Cancel</button>
                      </div>
                    </>
                  )}
                </div>
                <div className="card">
                  <div className="ct">Gym Machines</div>
                  <div style={{display:"flex",flexWrap:"wrap",gap:5,marginBottom:12}}>
                    {machines.map(m=><span key={m} className="chip" style={{fontSize:11}}>{m}</span>)}
                  </div>
                  <div className="row">
                    <input className="inp" placeholder="Add exercise/machine..." value={newMachInp} onChange={e=>setNewMachInp(e.target.value)} style={{flex:1}}/>
                    <button className="btn bacc" onClick={()=>{if(newMachInp&&!machines.includes(newMachInp)){setMachines(p=>[...p,newMachInp]);addMachine(newMachInp).catch(()=>{});setNewMachInp("");showToast("Added!");}}}>Add</button>
                  </div>
                </div>
              </>
            )}
          </>
        )}

        {/* ── SETUP TAB ── */}
        {tab==="settings" && (
          <>
            <div style={{fontFamily:"'Bebas Neue',sans-serif",fontSize:22,letterSpacing:2,marginBottom:3}}>Setup</div>
            <div style={{fontSize:12,color:"#6a6a8a",marginBottom:12}}>AI provider · saved to cloud via Supabase</div>

            {apiKey ? (
              <div style={{background:"#c8f13510",borderRadius:12,padding:"12px 15px",marginBottom:12,border:"1px solid #c8f13540",display:"flex",alignItems:"center",gap:10}}>
                <span style={{fontSize:20}}>{AI_PROVIDERS[aiProvider]?.icon}</span>
                <div>
                  <div style={{fontSize:13,color:"#c8f135",fontWeight:600}}>✅ {AI_PROVIDERS[aiProvider]?.name} Active</div>
                  <div style={{fontFamily:"'JetBrains Mono',monospace",fontSize:11,color:"#6a6a8a"}}>{apiKey.slice(0,8)+"••••••••"+apiKey.slice(-4)}</div>
                </div>
                <span className="chip b" style={{marginLeft:"auto"}}>☁ Cloud</span>
              </div>
            ) : (
              <div style={{background:"#ff4d6d12",borderRadius:12,padding:"12px 15px",marginBottom:12,border:"1px solid #ff4d6d30"}}>
                <div style={{fontSize:13,color:"#ff4d6d"}}>⚠️ No API key — AI features won't work</div>
              </div>
            )}

            <div className="card">
              <div className="ct">Choose AI Provider</div>
              <div style={{display:"flex",flexDirection:"column",gap:8}}>
                {Object.entries(AI_PROVIDERS).map(([key,prov])=>(
                  <button key={key} onClick={()=>{setAiProvider(key);setAiModel(prov.defaultModel);setApiInput("");}}
                    style={{background:aiProvider===key?prov.color+"18":"#111118",border:"1px solid "+(aiProvider===key?prov.color+"60":"#1c1c2c"),borderRadius:12,padding:"13px 15px",display:"flex",alignItems:"center",gap:12,cursor:"pointer",textAlign:"left"}}>
                    <span style={{fontSize:24}}>{prov.icon}</span>
                    <div style={{flex:1}}>
                      <div style={{fontSize:14,fontWeight:600,color:aiProvider===key?prov.color:"#e8e8f0"}}>{prov.name}</div>
                      <div style={{fontSize:12,color:"#6a6a8a"}}>{prov.docsUrl}</div>
                    </div>
                    {aiProvider===key && <div style={{width:9,height:9,borderRadius:"50%",background:prov.color,flexShrink:0}}/>}
                  </button>
                ))}
              </div>
            </div>

            <div className="card">
              <div className="ct">Model</div>
              <div style={{display:"flex",flexDirection:"column",gap:6}}>
                {AI_PROVIDERS[aiProvider]?.models.map(m=>(
                  <button key={m} onClick={()=>setAiModel(m)}
                    style={{background:(aiModel||AI_PROVIDERS[aiProvider]?.defaultModel)===m?"#c8f13518":"#111118",border:"1px solid "+((aiModel||AI_PROVIDERS[aiProvider]?.defaultModel)===m?"#c8f13540":"#1c1c2c"),borderRadius:9,padding:"10px 14px",display:"flex",alignItems:"center",justifyContent:"space-between",cursor:"pointer"}}>
                    <span style={{fontFamily:"'JetBrains Mono',monospace",fontSize:13,color:(aiModel||AI_PROVIDERS[aiProvider]?.defaultModel)===m?"#c8f135":"#e8e8f0"}}>{m}</span>
                    {m===AI_PROVIDERS[aiProvider]?.defaultModel && <span className="chip g" style={{fontSize:9}}>recommended</span>}
                  </button>
                ))}
              </div>
            </div>

            <div className="card">
              <div className="ct">API Key</div>
              <div style={{fontSize:13,color:"#6a6a8a",lineHeight:1.7,marginBottom:12}}>
                Get your key from <span style={{color:AI_PROVIDERS[aiProvider]?.color}}>{AI_PROVIDERS[aiProvider]?.docsUrl}</span>
              </div>
              <div className="cl" style={{marginTop:0}}>Paste your {AI_PROVIDERS[aiProvider]?.name} key</div>
              <input className="inp" type="password" placeholder={AI_PROVIDERS[aiProvider]?.placeholder} value={apiInput} onChange={e=>setApiInput(e.target.value)}/>
              <button className="btn bacc bfull" onClick={async()=>{
                if (!apiInput.trim()) { showToast("Paste your key first"); return; }
                setApiKey(apiInput.trim());
                await setSetting("ai_key", apiInput.trim());
                await setSetting("ai_provider", aiProvider);
                await setSetting("ai_model", aiModel||AI_PROVIDERS[aiProvider]?.defaultModel);
                showToast("✅ Key saved to cloud!");
              }}>Save to Cloud ☁</button>
              {apiKey && <button className="btn bgh bfull" style={{marginTop:8}} onClick={()=>{setSetting("ai_key","").catch(()=>{}); setApiKey(""); setApiInput(""); showToast("Key removed");}}>Remove Key</button>}
            </div>

            <div className="card">
              <div className="ct">How to Get Your Key</div>
              {aiProvider==="gemini" && [["1","Go to aistudio.google.com"],["2","Sign in with Google"],["3","Click 'Get API Key'"],["4","Click 'Create API key'"],["5","Copy and paste above (free!)"]].map(([n,t])=>(
                <div key={n} style={{display:"flex",gap:10,alignItems:"center",marginBottom:10}}>
                  <div style={{width:24,height:24,borderRadius:"50%",background:"#4285f4",color:"#fff",display:"flex",alignItems:"center",justifyContent:"center",fontWeight:700,fontSize:12,flexShrink:0}}>{n}</div>
                  <div style={{fontSize:13}}>{t}</div>
                </div>
              ))}
              {aiProvider==="claude" && [["1","Go to console.anthropic.com"],["2","Sign up / log in"],["3","Click 'API Keys'"],["4","Click 'Create Key'"],["5","Copy and paste above"],["💰","~$0.001 per suggestion"]].map(([n,t])=>(
                <div key={n} style={{display:"flex",gap:10,alignItems:"center",marginBottom:10}}>
                  <div style={{width:24,height:24,borderRadius:"50%",background:"#d97706",color:"#fff",display:"flex",alignItems:"center",justifyContent:"center",fontWeight:700,fontSize:12,flexShrink:0}}>{n}</div>
                  <div style={{fontSize:13}}>{t}</div>
                </div>
              ))}
              {aiProvider==="gpt" && [["1","Go to platform.openai.com"],["2","Sign up / log in"],["3","Click 'API Keys'"],["4","Click 'Create new secret key'"],["5","Copy and paste above"],["💰","~$0.002 per suggestion"]].map(([n,t])=>(
                <div key={n} style={{display:"flex",gap:10,alignItems:"center",marginBottom:10}}>
                  <div style={{width:24,height:24,borderRadius:"50%",background:"#10a37f",color:"#fff",display:"flex",alignItems:"center",justifyContent:"center",fontWeight:700,fontSize:12,flexShrink:0}}>{n}</div>
                  <div style={{fontSize:13}}>{t}</div>
                </div>
              ))}
            </div>
          </>
        )}

      </div>{/* end .pg */}

      {/* ── SIDE NAV ── */}
      {navOpen && (
        <>
          <div className="sidenav-overlay" onClick={()=>setNavOpen(false)}/>
          <div className="sidenav">
            <div className="sidenav-logo">
              <div style={{fontFamily:"'Bebas Neue',sans-serif",fontSize:32,letterSpacing:3,color:"#c8f135",lineHeight:1}}>GAINLOG</div>
              <div style={{fontSize:12,color:"#6a6a8a",letterSpacing:1,textTransform:"uppercase",marginTop:3}}>
                {syncing?"⟳ Syncing...":dbReady?"☁ Synced":"Hypertrophy Tracker"}
              </div>
            </div>
            <div className="sidenav-items">
              {[
                ["workout","🏋️","Log Workout","Track sets, reps & weight"],
                ["cardio","🏃","Cardio","Log cardio + calorie burn"],
                ["daily","📅","Daily Log","Activities grouped by day"],
                ["ai","🤖","AI Coach","Smart suggestions & plans"],
                ["plan","📋","My Plans","Weekly programmes"],
                ["records","🏆","Personal Records","Your best lifts"],
                ["history","📊","History","All past sessions"],
                ["body","🧬","Body Comp","Starfit scans & trends"],
                ["settings","⚙️","Setup","AI provider & key"],
              ].map(([k,ic,lb,sub])=>(
                <button key={k} className={"navitem"+(tab===k?" active":"")} onClick={()=>{setTab(k);setNavOpen(false);}}>
                  <span className="navicon">{ic}</span>
                  <div>
                    <div className="navlbl">{lb}</div>
                    <div className="navsub">{sub}</div>
                  </div>
                </button>
              ))}
            </div>
            <div className="sidenav-footer">
              <div style={{fontSize:12,color:"#3a3a5a",marginBottom:5}}>
                {latest?"Body score: "+latest.score+"/100 · "+latest.weight+"lb":"No body scan yet"}
              </div>
              <div style={{fontSize:12,color:"#3a3a5a"}}>{prs.length} PRs · {logs.length} sessions logged</div>
            </div>
          </div>
        </>
      )}

      {/* ── CAMERA MODAL ── */}
      {camOpen && (
        <div className="cam-modal" onClick={e=>{if(e.target===e.currentTarget)setCamOpen(false);}}>
          <div className="cam-box">
            <div className="cam-hdr">
              <div className="cam-title">📷 Scan Machine</div>
              <button className="cam-close" onClick={()=>setCamOpen(false)}>×</button>
            </div>
            <div className="cam-body" style={{maxHeight:"70vh",overflowY:"auto"}}>
              {camPhoto ? (
                <div style={{width:"100%",borderRadius:12,overflow:"hidden",marginBottom:14}}>
                  <img src={camPhoto} alt="captured" style={{width:"100%",display:"block",borderRadius:12}}/>
                </div>
              ) : (
                <label className="cam-trigger">
                  <input ref={cameraRef} type="file" accept="image/*" capture="environment" onChange={handleCameraCapture}/>
                  <div style={{fontSize:40,marginBottom:10}}>📷</div>
                  <div style={{fontSize:14,fontWeight:600,marginBottom:5}}>Take a photo of the machine</div>
                  <div style={{fontSize:12,color:"#6a6a8a"}}>AI will identify it automatically</div>
                </label>
              )}
              {camDetecting && (
                <div style={{textAlign:"center",padding:"14px 0"}}>
                  <Ldots/>
                  <div style={{fontSize:13,color:"#6a6a8a",marginTop:8}}>Analysing machine...</div>
                </div>
              )}
              {camResult && !camDetecting && (
                <div className="cam-result">
                  <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:10}}>
                    <div style={{fontSize:13,fontWeight:600}}>AI Detection</div>
                    <span style={{fontSize:11,fontWeight:600,color:camResult.confidence==="high"?"#c8f135":camResult.confidence==="medium"?"#ff9f1c":"#ff4d6d"}}>
                      {camResult.confidence==="high"?"✅ High":camResult.confidence==="medium"?"⚠️ Medium":"❓ Low"} confidence
                    </span>
                  </div>
                  {camResult.description && <div style={{fontSize:12,color:"#6a6a8a",marginBottom:8,lineHeight:1.5}}>{camResult.description}</div>}
                  {camResult.muscleGroup && <div style={{fontSize:12,color:"#4cc9f0",marginBottom:12}}>💪 Targets: {camResult.muscleGroup}</div>}
                  <div style={{fontSize:12,color:"#6a6a8a",marginBottom:6,textTransform:"uppercase",letterSpacing:".5px"}}>Machine name — edit if needed:</div>
                  <input className="inp" value={camEdit} onChange={e=>setCamEdit(e.target.value)} placeholder="Machine name..." style={{marginBottom:12}}/>
                  <div style={{display:"flex",gap:8}}>
                    <button className="btn bacc" style={{flex:1}} onClick={confirmMachine}>✓ Add Machine</button>
                    <button className="btn bgh" style={{flex:1}} onClick={()=>{setCamPhoto(null);setCamResult(null);setCamEdit("");}}>Retake</button>
                  </div>
                </div>
              )}
              {!camPhoto && !camDetecting && (
                <div style={{fontSize:11,color:"#3a3a5a",textAlign:"center",marginTop:10}}>
                  Works best with full machine visible · good lighting
                </div>
              )}
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
