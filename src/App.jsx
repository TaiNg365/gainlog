
import { useState, useEffect, useRef, useCallback } from "react";
import { getLogs, saveLog, getBodyScans, saveBodyScan, getMachines, addMachine, getSetting, setSetting, getCardioLogs, saveCardioLog } from './supabase.js';

const C = {
  bg:"#090910", sur:"#111118", card:"#15151e", bdr:"#1c1c2c",
  acc:"#c8f135", red:"#ff4d6d", blu:"#4cc9f0", pur:"#9b5de5",
  org:"#ff9f1c", mut:"#3a3a5a", txt:"#e8e8f0", sub:"#6a6a8a",
  gld:"#ffd700", grn:"#00e096"
};

const APP_CSS = `
*{box-sizing:border-box;margin:0;padding:0;}
body{background:#090910;color:#e8e8f0;font-family:'DM Sans',sans-serif;min-height:100vh;font-size:15px;}
.app{max-width:430px;margin:0 auto;min-height:100vh;display:flex;flex-direction:column;}
.hdr{padding:12px 18px 12px;background:#090910;position:sticky;top:0;z-index:50;border-bottom:1px solid #1c1c2c;}
.htop{display:flex;justify-content:space-between;align-items:center;margin-bottom:8px;}
.logo{font-family:'Bebas Neue',sans-serif;font-size:30px;letter-spacing:3px;color:#c8f135;line-height:1;}
.lsub{font-size:11px;color:#6a6a8a;letter-spacing:1px;text-transform:uppercase;}
.hbtns{display:flex;gap:7px;}
.icb{background:#1c1c2c;border:none;color:#e8e8f0;border-radius:50%;width:34px;height:34px;font-size:17px;cursor:pointer;display:flex;align-items:center;justify-content:center;}
.icb:active{opacity:.7;}
.tabs{display:flex;overflow-x:auto;padding-bottom:0;}
.tabs::-webkit-scrollbar{display:none;}
.tab{flex-shrink:0;padding:9px 13px;border:none;background:transparent;color:#6a6a8a;font-family:'DM Sans',sans-serif;font-size:13px;font-weight:600;cursor:pointer;border-bottom:2px solid transparent;white-space:nowrap;}
.tab.on{color:#c8f135;border-bottom-color:#c8f135;}
.pg{flex:1;overflow-y:auto;padding:12px 18px 30px;}
.pg::-webkit-scrollbar{display:none;}
.card{background:#15151e;border:1px solid #1c1c2c;border-radius:13px;padding:16px;margin-bottom:12px;}
.ct{font-family:'Bebas Neue',sans-serif;font-size:21px;letter-spacing:2px;color:#c8f135;margin-bottom:11px;}
.cl{font-size:11px;color:#6a6a8a;text-transform:uppercase;letter-spacing:1px;margin-bottom:4px;margin-top:8px;}
.inp{width:100%;background:#111118;border:1px solid #1c1c2c;border-radius:9px;padding:8px 11px;color:#e8e8f0;font-family:'DM Sans',sans-serif;font-size:15px;outline:none;}
.inp:focus{border-color:#c8f13544;}
.inp::placeholder{color:#3a3a5a;}
select.inp option{background:#111118;}
.btn{border:none;border-radius:9px;padding:9px 14px;font-family:'DM Sans',sans-serif;font-weight:600;font-size:14px;cursor:pointer;}
.btn:active{opacity:.85;}
.bacc{background:#c8f135;color:#0a0a0f;}
.bgh{background:#1c1c2c;color:#e8e8f0;}
.bfull{width:100%;margin-top:9px;}
.row{display:flex;gap:7px;}
.divider{height:1px;background:#1c1c2c;margin:9px 0;}
.sinp{background:#111118;border:1px solid #1c1c2c;border-radius:6px;padding:6px 3px;color:#e8e8f0;font-family:'JetBrains Mono',monospace;font-size:13px;text-align:center;outline:none;width:100%;}
.sinp:focus{border-color:#c8f13544;}
.srow{display:grid;grid-template-columns:20px 1fr 1fr 26px 22px;gap:4px;align-items:center;margin-bottom:4px;}
.snum{font-family:'JetBrains Mono',monospace;font-size:13px;color:#3a3a5a;text-align:center;}
.sdone{width:24px;height:24px;border-radius:50%;border:2px solid #1c1c2c;background:transparent;cursor:pointer;display:flex;align-items:center;justify-content:center;font-size:13px;}
.sdone.ck{background:#c8f135;border-color:#c8f135;color:#0a0a0f;}
.chip{display:inline-flex;align-items:center;background:#1c1c2c;border-radius:99px;padding:2px 8px;font-size:11px;color:#6a6a8a;font-weight:500;}
.chip.g{background:#c8f13518;color:#c8f135;}
.chip.b{background:#4cc9f018;color:#4cc9f0;}
.chip.r{background:#ff4d6d18;color:#ff4d6d;}
.chip.gold{background:#ffd70018;color:#ffd700;}
.aib{background:linear-gradient(135deg,#0d0d1a,#111320);border:1px solid #c8f13530;border-radius:13px;padding:16px;margin-bottom:12px;}
.aihdr{display:flex;align-items:center;gap:7px;margin-bottom:9px;}
.aidot{width:6px;height:6px;border-radius:50%;background:#c8f135;animation:pulse 1.5s infinite;}
@keyframes pulse{0%,100%{opacity:1;}50%{opacity:.3;}}
.aitl{font-family:'Bebas Neue',sans-serif;font-size:16px;letter-spacing:1.5px;color:#c8f135;}
.aitxt{font-size:13px;color:#6a6a8a;line-height:1.75;}
.aitxt b{color:#e8e8f0;}
.ldots{display:flex;gap:4px;padding:5px 0;justify-content:center;}
.ldot{width:5px;height:5px;border-radius:50%;background:#c8f135;animation:bnc .8s infinite;}
.ldot:nth-child(2){animation-delay:.15s;}
.ldot:nth-child(3){animation-delay:.3s;}
@keyframes bnc{0%,80%,100%{transform:translateY(0);}40%{transform:translateY(-5px);}}
.twrap{position:relative;width:150px;height:150px;margin:0 auto 14px;}
.tsvg{transform:rotate(-90deg);}
.tnum{position:absolute;top:50%;left:50%;transform:translate(-50%,-50%);font-family:'Bebas Neue',sans-serif;font-size:44px;letter-spacing:2px;color:#c8f135;}
.tlbl{position:absolute;bottom:12px;left:50%;transform:translateX(-50%);font-size:10px;color:#6a6a8a;letter-spacing:1px;text-transform:uppercase;}
.prog{height:4px;background:#1c1c2c;border-radius:99px;overflow:hidden;margin:5px 0;}
.progf{height:100%;background:#c8f135;border-radius:99px;transition:width .3s;}
.wgr{display:flex;gap:5px;flex-wrap:wrap;margin:7px 0;}
.wg{width:30px;height:38px;border:2px solid #1c1c2c;border-radius:3px 3px 6px 6px;cursor:pointer;overflow:hidden;display:flex;align-items:flex-end;}
.wg.f{border-color:#4cc9f0;}
.wgf{width:100%;background:#4cc9f055;transition:height .3s;}
.wg.f .wgf{height:100%;background:#4cc9f0;}
.li{background:#111118;border-radius:9px;padding:11px 14px;margin-bottom:5px;border-left:3px solid #c8f13540;}
.li.pr{border-left-color:#ffd700;}
.li.ss{border-left-color:#4cc9f0;}
.lid{font-size:10px;color:#3a3a5a;font-family:'JetBrains Mono',monospace;}
.lim{font-weight:600;font-size:14px;margin:2px 0;}
.lis{font-size:13px;color:#6a6a8a;}
.lin{font-size:11px;color:#3a3a5a;margin-top:2px;font-style:italic;}
.prg{display:grid;grid-template-columns:1fr 1fr;gap:7px;}
.prc{background:#111118;border-radius:11px;padding:11px;border:1px solid #ffd70030;position:relative;overflow:hidden;}
.prc::before{content:'';position:absolute;top:0;right:0;width:32px;height:32px;background:radial-gradient(circle,#ffd70018,transparent);border-radius:0 11px 0 32px;}
.pre{font-size:11px;color:#6a6a8a;margin-bottom:2px;}
.prw{font-family:'Bebas Neue',sans-serif;font-size:22px;color:#ffd700;}
.prd{font-size:11px;color:#3a3a5a;}
.prdt{font-size:10px;color:#3a3a5a;font-family:'JetBrains Mono',monospace;margin-top:2px;}
.stabs{display:flex;gap:4px;margin-bottom:9px;overflow-x:auto;}
.stabs::-webkit-scrollbar{display:none;}
.stab{flex-shrink:0;padding:5px 9px;border:1px solid transparent;background:#1c1c2c;color:#6a6a8a;font-family:'DM Sans',sans-serif;font-size:11px;font-weight:600;border-radius:7px;cursor:pointer;}
.stab.on{background:#c8f13518;color:#c8f135;border-color:#c8f13540;}
.pex{display:flex;justify-content:space-between;align-items:center;padding:4px 0;border-bottom:1px solid #1c1c2c44;}
.pex:last-child{border:none;}
.pexn{font-size:13px;font-weight:500;flex:1;padding-right:7px;}
.pexs{font-size:11px;font-family:'JetBrains Mono',monospace;text-align:right;}
.sep{font-size:10px;color:#6a6a8a;text-align:center;padding:4px 0;border-top:1px solid #1c1c2c;margin-top:3px;letter-spacing:1px;}
.bnav{display:none;}
.bnt{display:none;}
.bnl{display:none;}
.toast{position:fixed;top:14px;left:50%;transform:translateX(-50%);background:#15151e;border:1px solid #c8f13550;border-radius:9px;padding:8px 14px;font-size:13px;font-weight:500;z-index:999;animation:sld .3s ease;max-width:280px;text-align:center;}
@keyframes sld{from{opacity:0;transform:translateX(-50%) translateY(-6px);}to{opacity:1;transform:translateX(-50%) translateY(0);}}
.mcard{background:#111118;border-radius:9px;padding:11px 14px;border:1px solid #1c1c2c;}
.mval{font-family:'Bebas Neue',sans-serif;font-size:22px;line-height:1;margin-bottom:1px;}
.mlbl{font-size:10px;color:#6a6a8a;text-transform:uppercase;letter-spacing:.7px;}
.mdelta{font-size:11px;margin-top:2px;font-weight:600;}
.mgrid{display:grid;grid-template-columns:1fr 1fr;gap:7px;margin-bottom:9px;}
.sring{position:relative;width:100px;height:100px;margin:0 auto 9px;}
.srsvg{transform:rotate(-90deg);}
.srnum{position:absolute;top:50%;left:50%;transform:translate(-50%,-50%);font-family:'Bebas Neue',sans-serif;font-size:28px;color:#c8f135;line-height:1;}
.srlbl{position:absolute;bottom:10px;left:50%;transform:translateX(-50%);font-size:9px;color:#6a6a8a;letter-spacing:1px;white-space:nowrap;}
.srow2{display:flex;justify-content:space-between;align-items:center;padding:5px 0;border-bottom:1px solid #1c1c2c18;}
.srow2:last-child{border:none;}
.slbl{font-size:13px;color:#6a6a8a;}
.sval{font-family:'JetBrains Mono',monospace;font-size:13px;color:#e8e8f0;font-weight:600;}
.upz{border:2px dashed #1c1c2c;border-radius:11px;padding:22px;text-align:center;cursor:pointer;background:#111118;}
.upz:hover{border-color:#c8f13550;}
.upz input{display:none;}
.afbtn{width:100%;background:#111118;border:1px solid #1c1c2c;border-radius:11px;padding:13px 16px;display:flex;align-items:center;gap:10px;cursor:pointer;margin-bottom:7px;text-align:left;}
.afbtn:active{opacity:.8;}
.afbtn.on{border-color:#c8f13540;background:#c8f13505;}
.aftl{font-size:14px;font-weight:600;color:#e8e8f0;margin-bottom:1px;}
.afsu{font-size:11px;color:#6a6a8a;}
.ares{background:#111118;border:1px solid #1c1c2c;border-radius:11px;padding:13px;margin-top:8px;}
.aretxt{font-size:13px;color:#6a6a8a;line-height:1.8;white-space:pre-wrap;}
.aretxt b{color:#e8e8f0;}
.ecard{background:#111118;border-radius:9px;padding:11px;margin-bottom:7px;border:1px solid #1c1c2c;}
.edate{font-size:10px;color:#3a3a5a;font-family:'JetBrains Mono',monospace;margin-bottom:5px;}
.escore{font-family:'Bebas Neue',sans-serif;font-size:20px;color:#c8f135;}
.tbar{display:flex;align-items:flex-end;gap:4px;height:50px;margin-top:7px;}
.tcol{flex:1;display:flex;flex-direction:column;align-items:center;gap:2px;}
.tseg{width:100%;border-radius:2px;transition:height .3s;}
.tv{font-size:9px;color:#3a3a5a;}
.mi-grid{display:grid;grid-template-columns:1fr 1fr;gap:7px;}
.mi-wrap{display:flex;flex-direction:column;gap:3px;}
.mi-lbl{font-size:11px;color:#6a6a8a;letter-spacing:.4px;}
.mi-inp{background:#111118;border:1px solid #1c1c2c;border-radius:7px;padding:7px 9px;color:#e8e8f0;font-family:'JetBrains Mono',monospace;font-size:14px;outline:none;width:100%;}
.mi-inp:focus{border-color:#c8f13544;}
.cal-summary{background:linear-gradient(135deg,#0d1a0d,#111811);border:1px solid #c8f13530;border-radius:13px;padding:16px;margin-bottom:12px;}
.cal-ring{display:flex;align-items:center;justify-content:center;gap:16px;margin:8px 0;}
.cal-circle{width:80px;height:80px;border-radius:50%;border:4px solid #1c1c2c;display:flex;flex-direction:column;align-items:center;justify-content:center;background:#111118;}
.cal-val{font-family:'Bebas Neue',sans-serif;font-size:22px;line-height:1;}
.cal-lbl{font-size:9px;color:#6a6a8a;text-transform:uppercase;letter-spacing:.5px;}
.cardio-item{background:#111118;border-radius:9px;padding:10px 12px;margin-bottom:6px;border-left:3px solid #4cc9f060;}
.mach-wrap{position:relative;}
.mach-search{width:100%;background:#111118;border:1px solid #1c1c2c;border-radius:9px;padding:8px 11px 8px 32px;color:#e8e8f0;font-family:'DM Sans',sans-serif;font-size:15px;outline:none;}
.mach-search:focus{border-color:#c8f13544;}
.mach-search::placeholder{color:#3a3a5a;}
.mach-icon{position:absolute;left:10px;top:50%;transform:translateY(-50%);font-size:15px;pointer-events:none;}
.mach-dropdown{position:absolute;top:calc(100% + 4px);left:0;right:0;background:#15151e;border:1px solid #c8f13540;border-radius:10px;z-index:100;max-height:220px;overflow-y:auto;box-shadow:0 8px 24px #00000080;}
.mach-dropdown::-webkit-scrollbar{width:4px;}
.mach-dropdown::-webkit-scrollbar-thumb{background:#1c1c2c;border-radius:4px;}
.mach-opt{padding:9px 12px;font-size:14px;color:#e8e8f0;cursor:pointer;border-bottom:1px solid #1c1c2c22;display:flex;align-items:center;justify-content:space-between;}
.mach-opt:last-child{border-bottom:none;}
.mach-opt:hover{background:#c8f13512;}
.mach-opt.selected{background:#c8f13518;color:#c8f135;}
.mach-opt.add-new{color:#c8f135;font-style:italic;}
.mach-none{padding:12px;font-size:13px;color:#6a6a8a;text-align:center;}
.hamburger{background:none;border:none;cursor:pointer;display:flex;flex-direction:column;gap:5px;padding:4px;justify-content:center;}
.hbar{width:22px;height:2px;background:#c8f135;border-radius:2px;transition:all .3s;}
.sidenav-overlay{position:fixed;top:0;left:0;right:0;bottom:0;background:#000000aa;z-index:150;animation:fadeIn .2s ease;}
@keyframes fadeIn{from{opacity:0;}to{opacity:1;}}
.sidenav{position:fixed;top:0;left:0;bottom:0;width:260px;background:#0d0d15;border-right:1px solid #1c1c2c;z-index:160;display:flex;flex-direction:column;animation:slideIn .25s ease;}
@keyframes slideIn{from{transform:translateX(-100%);}to{transform:translateX(0);}}
.sidenav-logo{padding:22px 20px 16px;border-bottom:1px solid #1c1c2c;}
.sidenav-items{flex:1;overflow-y:auto;padding:10px 0;}
.sidenav-items::-webkit-scrollbar{display:none;}
.navitem{display:flex;align-items:center;gap:16px;padding:16px 22px;cursor:pointer;border:none;background:transparent;width:100%;text-align:left;transition:background .15s;}
.navitem:hover{background:#1c1c2c;}
.navitem.active{background:#c8f13512;border-left:3px solid #c8f135;}
.navitem:not(.active){border-left:3px solid transparent;}
.navicon{font-size:26px;width:32px;text-align:center;flex-shrink:0;}
.navlbl{font-family:'DM Sans',sans-serif;font-size:17px;font-weight:600;color:#e8e8f0;}
.navitem.active .navlbl{color:#c8f135;}
.navsub{font-size:13px;color:#6a6a8a;margin-top:1px;}
.navitem.active .navsub{color:#c8f13580;}
.sidenav-footer{padding:14px 20px;border-top:1px solid #1c1c2c;}
.cam-modal{position:fixed;top:0;left:0;right:0;bottom:0;background:#000000ee;z-index:200;display:flex;flex-direction:column;align-items:center;justify-content:center;padding:20px;}
.cam-box{background:#15151e;border-radius:18px;width:100%;max-width:390px;overflow:hidden;border:1px solid #1c1c2c;}
.cam-header{padding:14px 16px;border-bottom:1px solid #1c1c2c;display:flex;align-items:center;justify-content:space-between;}
.cam-title{font-family:'Bebas Neue',sans-serif;font-size:20px;letter-spacing:1.5px;color:#c8f135;}
.cam-close{background:none;border:none;color:#6a6a8a;font-size:22px;cursor:pointer;line-height:1;}
.cam-body{padding:16px;}
.cam-preview{width:100%;border-radius:12px;overflow:hidden;background:#111118;margin-bottom:12px;min-height:160px;display:flex;align-items:center;justify-content:center;}
.cam-preview img{width:100%;border-radius:12px;display:block;}
.cam-trigger{width:100%;border:2px dashed #1c1c2c;border-radius:12px;padding:28px;text-align:center;cursor:pointer;background:#111118;margin-bottom:12px;}
.cam-trigger:hover{border-color:#c8f13550;}
.cam-trigger input{display:none;}
.cam-result{background:#111118;border-radius:10px;padding:12px;margin-bottom:12px;border:1px solid #1c1c2c;}
.cam-conf-high{color:#c8f135;}
.cam-conf-med{color:#ff9f1c;}
.cam-conf-low{color:#ff4d6d;}
`;




// ── Helpers
const uid = () => Math.random().toString(36).slice(2, 8);
const fmt = (s) => Math.floor(s/60).toString().padStart(2,"0") + ":" + (s%60).toString().padStart(2,"0");
const today = () => new Date().toLocaleDateString("en-GB", {day:"2-digit", month:"short", year:"numeric"});
// ── AI Provider Config
const AI_PROVIDERS = {
  gemini: {
    name: "Google Gemini",
    icon: "🟢",
    models: ["gemini-2.5-flash", "gemini-3.1-pro-preview", "gemini-3-flash-preview", "gemini-2.0-flash", "gemini-2.0-flash-lite", "gemini-2.5-flash-lite"],
    defaultModel: "gemini-2.5-flash",
    placeholder: "AIza...",
    docsUrl: "aistudio.google.com",
    color: "#4285f4"
  },
  claude: {
    name: "Anthropic Claude",
    icon: "🟠",
    models: ["claude-haiku-4-5-20251001", "claude-sonnet-4-6"],
    defaultModel: "claude-haiku-4-5-20251001",
    placeholder: "sk-ant-...",
    docsUrl: "console.anthropic.com",
    color: "#d97706"
  },
  gpt: {
    name: "OpenAI GPT",
    icon: "⚫",
    models: ["gpt-4o-mini", "gpt-4o"],
    defaultModel: "gpt-4o-mini",
    placeholder: "sk-...",
    docsUrl: "platform.openai.com",
    color: "#10a37f"
  }
};

// ── Universal AI call
async function callAI(prompt, maxTok=500, provider="gemini", apiKey="", model="") {
  if (!apiKey) return "Add your API key in the Setup tab first.";
  const mdl = model || AI_PROVIDERS[provider]?.defaultModel;

  try {
    if (provider === "gemini") {
      const r = await fetch("https://generativelanguage.googleapis.com/v1beta/models/" + mdl + ":generateContent?key=" + apiKey, {
        method:"POST", headers:{"Content-Type":"application/json"},
        body: JSON.stringify({contents:[{parts:[{text:prompt}]}], generationConfig:{maxOutputTokens:maxTok}})
      });
      const d = await r.json();
      if (d.error) return "Gemini error: " + d.error.message;
      return d?.candidates?.[0]?.content?.parts?.[0]?.text || "No response.";
    }

    if (provider === "claude") {
      const r = await fetch("https://api.anthropic.com/v1/messages", {
        method:"POST",
        headers:{"Content-Type":"application/json","x-api-key":apiKey,"anthropic-version":"2023-06-01","anthropic-dangerous-direct-browser-access":"true"},
        body: JSON.stringify({model:mdl, max_tokens:maxTok, messages:[{role:"user",content:prompt}]})
      });
      const d = await r.json();
      if (d.error) return "Claude error: " + d.error.message;
      return d?.content?.[0]?.text || "No response.";
    }

    if (provider === "gpt") {
      const r = await fetch("https://api.openai.com/v1/chat/completions", {
        method:"POST",
        headers:{"Content-Type":"application/json","Authorization":"Bearer " + apiKey},
        body: JSON.stringify({model:mdl, max_tokens:maxTok, messages:[{role:"user",content:prompt}]})
      });
      const d = await r.json();
      if (d.error) return "GPT error: " + d.error.message;
      return d?.choices?.[0]?.message?.content || "No response.";
    }

    return "Unknown provider.";
  } catch(e) {
    return "Network error. Check your connection.";
  }
}

// ── PDF parsing (Gemini only - best at document parsing)
async function callAIPDF(base64, prompt, apiKey) {
  if (!apiKey) return null;
  const r = await fetch("https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=" + apiKey, {
    method:"POST", headers:{"Content-Type":"application/json"},
    body: JSON.stringify({contents:[{parts:[{inline_data:{mime_type:"application/pdf",data:base64}},{text:prompt}]}]})
  });
  const d = await r.json();
  const txt = d?.candidates?.[0]?.content?.parts?.[0]?.text || "{}";
  return JSON.parse(txt.replace(/```json|```/g,"").trim());
}

// ── Static data
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
  const html = (text || "").split("\n").join("<br/>").replace(/\*\*(.*?)\*\*/g,"<b>$1</b>");
  return <div className="aretxt" dangerouslySetInnerHTML={{__html: html}}/>;
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
  if (vals.length < 2) return <div style={{fontSize:13,color:C.sub,padding:"6px 0"}}>Need 2+ scans for trend</div>;
  const min=Math.min(...vals), max=Math.max(...vals);
  return (
    <div className="tbar">
      {data.filter(e=>e[metricKey]>0).map((e,i) => {
        const h = max===min ? 25 : 4+((e[metricKey]-min)/(max-min))*44;
        return (
          <div key={i} className="tcol">
            <div className="tseg" style={{height:h, background:i===data.length-1?color:C.bdr}}/>
            <div className="tv">{e[metricKey]}</div>
            <div style={{fontSize:9,color:C.mut}}>{e.date.split(" ").slice(0,2).join(" ")}</div>
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
      <div className="mval" style={{color:color||C.txt}}>{value}<span style={{fontSize:13,color:C.sub}}>{unit}</span></div>
      <div className="mlbl">{label}</div>
      {d && <div className="mdelta" style={{color:dc}}>{parseFloat(d)>0?"+":""}{d}{unit}</div>}
    </div>
  );
}

// ── Main App
export default function App() {
  const [tab, setTab] = useState("workout");
  const [dbReady, setDbReady] = useState(false);
  const [syncing, setSyncing] = useState(false);
  const [waterOpen, setWaterOpen] = useState(false);
  const [navOpen, setNavOpen] = useState(false);

  const [logs, setLogs] = useState(() => {
    try { const l = JSON.parse(localStorage.getItem("gl_logs")||"[]"); return l.length>0?l:LOGS0; } catch(e) { return LOGS0; }
  });
  const [machines, setMachines] = useState(MACHINES);
  const [bodyLog, setBodyLog] = useState(() => {
    try { const b = JSON.parse(localStorage.getItem("gl_body")||"null"); return b&&b.length>0?b:BODY0; } catch(e) { return BODY0; }
  });
  const [waterMl, setWaterMl] = useState(() => {
    try { const w = JSON.parse(localStorage.getItem("gl_water")||"null"); return w?.waterMl||0; } catch(e) { return 0; }
  });
  const [waterGoal, setWaterGoal] = useState(() => {
    try { const w = JSON.parse(localStorage.getItem("gl_water")||"null"); return w?.waterGoal||3000; } catch(e) { return 3000; }
  });
  const [waterCustom, setWaterCustom] = useState("");
  const [toast, setToast] = useState(null);
  const [planIdx, setPlanIdx] = useState(0);
  const [histFilter, setHistFilter] = useState("all");
  const [cardioLogs, setCardioLogs] = useState(() => {
    try { const c = JSON.parse(localStorage.getItem("gl_cardio")||"[]"); return c.length>0?c:[]; } catch(e) { return []; }
  });
  const [cardioTab, setCardioTab] = useState("log");
  const [cardioMachine, setCardioMachine] = useState("");
  const [cardioDuration, setCardioDuration] = useState("");
  const [cardioCalDisplay, setCardioCalDisplay] = useState("");
  const [cardioNotes, setCardioNotes] = useState("");
  const [aiCalEst, setAiCalEst] = useState(null);
  const [aiCalLoading, setAiCalLoading] = useState(false);
  const [savedPlans, setSavedPlans] = useState(() => {
    try { return JSON.parse(localStorage.getItem("gainlog_plans") || "[]"); } catch(e) { return []; }
  });
  const [activePlanIdx, setActivePlanIdx] = useState(0);
  const [editingPlan, setEditingPlan] = useState(false);
  const [editPlanData, setEditPlanData] = useState(null);
  const [planSelectOpen, setPlanSelectOpen] = useState(false);
  const [selectedSessionPlan, setSelectedSessionPlan] = useState(null);
  const [liveCalEst, setLiveCalEst] = useState(null);
  const [liveCalLoading, setLiveCalLoading] = useState(false);
  const [bodyTab, setBodyTab] = useState("overview");

  // Workout form
  const [machine, setMachine] = useState("");
  const [newMach, setNewMach] = useState("");
  const [isSuper, setIsSuper] = useState(false);
  const [superWith, setSuperWith] = useState("");
  const [superSets, setSuperSets] = useState([{id:uid(),reps:"",weight:"",done:false}]);
  const [sets, setSets] = useState([{id:uid(),reps:"",weight:"",done:false}]);
  const [wNotes, setWNotes] = useState("");

  // Timer
  const [timerSec, setTimerSec] = useState(90);
  const [timerMax, setTimerMax] = useState(90);
  const [timerOn, setTimerOn] = useState(false);
  const timerRef = useRef(null);
  const timerStartRef = useRef(null);
  const timerSecAtStartRef = useRef(null);

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
  const [aiProvider, setAiProvider] = useState("gemini");
  const [aiModel, setAiModel] = useState("");
  const [apiKey, setApiKey] = useState("");
  const [apiInput, setApiInput] = useState("");

  // Body manual
  const [manEntry, setManEntry] = useState(null);
  const [newMachInp, setNewMachInp] = useState("");
  const [machSearch, setMachSearch] = useState("");
  const [machOpen, setMachOpen] = useState(false);
  const machSearchRef = useRef(null);
  const [camOpen, setCamOpen] = useState(false);
  const [camPhoto, setCamPhoto] = useState(null);
  const [camDetecting, setCamDetecting] = useState(false);
  const [camResult, setCamResult] = useState(null);
  const [camEdit, setCamEdit] = useState("");
  const [parsing, setParsing] = useState(false);
  const fileRef = useRef(null);
  const cameraRef = useRef(null);
  const videoRef = useRef(null);
  const canvasRef = useRef(null);

  const prs = getPRs(logs);
  const latest = bodyLog[bodyLog.length-1];
  const prev = bodyLog.length > 1 ? bodyLog[bodyLog.length-2] : null;

  const showToast = (msg) => { setToast(msg); setTimeout(() => setToast(null), 2600); };

  // ── Effects (all state declared above) ──────────────────────────────────
  // Close machine dropdown on outside click
  useEffect(() => {
    const handler = (e) => {
      if (machSearchRef.current && !machSearchRef.current.contains(e.target)) {
        setMachOpen(false);
      }
    };
    document.addEventListener("mousedown", handler);
    document.addEventListener("touchstart", handler);
    return () => { document.removeEventListener("mousedown", handler); document.removeEventListener("touchstart", handler); };
  }, []);

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

  // ── Persist data to localStorage every time it changes
  useEffect(() => {
    try { localStorage.setItem("gl_logs", JSON.stringify(logs)); } catch(e) {}
  }, [logs]);

  useEffect(() => {
    try { localStorage.setItem("gl_cardio", JSON.stringify(cardioLogs)); } catch(e) {}
  }, [cardioLogs]);

  useEffect(() => {
    try { localStorage.setItem("gl_body", JSON.stringify(bodyLog)); } catch(e) {}
  }, [bodyLog]);

  useEffect(() => {
    try { localStorage.setItem("gl_water", JSON.stringify({waterMl, waterGoal})); } catch(e) {}
  }, [waterMl, waterGoal]);

  // Load data - Supabase first, localStorage as fallback
  useEffect(() => {
    // Load from localStorage immediately (instant, no flicker)
    try {
      const localLogs = JSON.parse(localStorage.getItem("gl_logs") || "[]");
      const localCardio = JSON.parse(localStorage.getItem("gl_cardio") || "[]");
      const localBody = JSON.parse(localStorage.getItem("gl_body") || "null");
      const localWater = JSON.parse(localStorage.getItem("gl_water") || "null");
      if (localLogs.length > 0) setLogs(localLogs);
      if (localCardio.length > 0) setCardioLogs(localCardio);
      if (localBody && localBody.length > 0) setBodyLog(localBody);
      if (localWater) { setWaterMl(localWater.waterMl||0); setWaterGoal(localWater.waterGoal||3000); }
    } catch(e) {}

    // Then sync with Supabase in background
    async function loadData() {
      setSyncing(true);
      try {
        const [dbLogs, dbScans, dbMachines, dbCardio, savedKey, savedProvider, savedModel] = await Promise.all([
          getLogs(), getBodyScans(), getMachines(), getCardioLogs(),
          getSetting("ai_key"), getSetting("ai_provider"), getSetting("ai_model")
        ]);
        // Only override local data if Supabase has MORE records
        if (dbLogs.length > 0) { setLogs(dbLogs); localStorage.setItem("gl_logs", JSON.stringify(dbLogs)); }
        if (dbScans.length > 0) { setBodyLog(dbScans); localStorage.setItem("gl_body", JSON.stringify(dbScans)); }
        if (dbMachines.length > 0) setMachines(dbMachines);
        if (dbCardio.length > 0) { setCardioLogs(dbCardio); localStorage.setItem("gl_cardio", JSON.stringify(dbCardio)); }
        if (savedKey) { setApiKey(savedKey); setApiInput(savedKey); }
        if (savedProvider) setAiProvider(savedProvider);
        if (savedModel) setAiModel(savedModel);
        setDbReady(true);
      } catch(e) {
        console.error('Supabase sync failed, using local data:', e);
        setDbReady(true);
      }
      setSyncing(false);
    }
    loadData();
  }, []);
  // Timer - uses Date-based approach so it works when app is backgrounded
  useEffect(() => {
    if (timerOn) {
      timerStartRef.current = Date.now();
      timerSecAtStartRef.current = timerSec;
      timerRef.current = setInterval(() => {
        const elapsed = Math.floor((Date.now() - timerStartRef.current) / 1000);
        const remaining = timerSecAtStartRef.current - elapsed;
        if (remaining <= 0) {
          clearInterval(timerRef.current);
          setTimerOn(false);
          setTimerSec(timerMax);
          showToast("✅ Rest done — next set!");
          // Vibrate if supported
          if (navigator.vibrate) navigator.vibrate([200, 100, 200]);
        } else {
          setTimerSec(remaining);
        }
      }, 500);
    } else {
      clearInterval(timerRef.current);
    }
    return () => clearInterval(timerRef.current);
  }, [timerOn]);

  // Resume timer correctly after coming back from background
  useEffect(() => {
    const handleVisibility = () => {
      if (!document.hidden && timerOn && timerStartRef.current) {
        const elapsed = Math.floor((Date.now() - timerStartRef.current) / 1000);
        const remaining = timerSecAtStartRef.current - elapsed;
        if (remaining <= 0) {
          clearInterval(timerRef.current);
          setTimerOn(false);
          setTimerSec(timerMax);
          showToast("✅ Rest done — next set!");
        } else {
          setTimerSec(remaining);
        }
      }
    };
    document.addEventListener("visibilitychange", handleVisibility);
    return () => document.removeEventListener("visibilitychange", handleVisibility);
  }, [timerOn, timerMax]);

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
  const ai = (p, t=400) => callAI(p, t, aiProvider, apiKey, aiModel);

  const savePlansToStorage = (plans) => {
    try { localStorage.setItem("gainlog_plans", JSON.stringify(plans)); } catch(e) {}
    setSavedPlans(plans);
  };

  // Live calorie estimate - runs after each log
  const updateLiveCalEst = async (newLogs, newCardio) => {
    if (!apiKey) return;
    setLiveCalLoading(true);
    const todayDate = today();
    const todayW = newLogs.filter(l => l.date === todayDate);
    const todayC = newCardio.filter(l => l.date === todayDate);
    if (todayW.length === 0 && todayC.length === 0) { setLiveCalLoading(false); return; }
    const bodyData = latest ? "Weight:" + latest.weight + "lb Fat:" + latest.bodyFat + "% BMR:" + latest.bmr + "kcal" : "No scan";
    const wSum = todayW.length > 0 ? todayW.map(l => l.machine + " " + l.sets.length + "sets").join(", ") : "None";
    const cSum = todayC.length > 0 ? todayC.map(c => c.machine + " " + c.duration + "min" + (c.calDisplay?" "+c.calDisplay+"cal":"")).join(", ") : "None";
    const p = "Quick calorie burn estimate for 51yr old male athlete. Body: " + bodyData + ". Strength: " + wSum + ". Cardio: " + cSum + ". Give ONLY a single line like: 'Est. burn: ~420 kcal (280 strength + 140 cardio)'. Max 20 words.";
    try { setLiveCalEst(await ai(p, 60)); } catch(e) {}
    setLiveCalLoading(false);
  };

  // ── AI Calorie Estimator
  const callCalorieEstimate = async () => {
    setAiCalLoading(true); setAiCalEst(null);
    const todayDate = today();
    const todayWorkouts = logs.filter(l => l.date === todayDate);
    const todayCardio = cardioLogs.filter(l => l.date === todayDate);
    const bodyData = latest ? "Weight: " + latest.weight + "lb, Body Fat: " + latest.bodyFat + "%, Muscle: " + latest.muscle + "lb, BMR: " + latest.bmr + "kcal" : "No body scan data";

    const workoutSummary = todayWorkouts.length > 0
      ? todayWorkouts.map(l => l.machine + ": " + l.sets.length + " sets, " + l.sets.map(s => s.reps + "x" + s.weight + "lb").join(", ")).join(" | ")
      : "No strength training today";

    const cardioSummary = todayCardio.length > 0
      ? todayCardio.map(c => c.machine + " " + c.duration + "min" + (c.calDisplay ? " (" + c.calDisplay + " cal shown on machine)" : "")).join(" | ")
      : "No cardio today";

    const p = [
      "You are a sports science calorie expenditure expert.",
      "Calculate today's total calorie burn for: 51yr old male, 7x/week training.",
      "Body: " + bodyData + " (BMR is the baseline daily burn at rest).",
      "STRENGTH SESSION: " + workoutSummary,
      "CARDIO SESSION: " + cardioSummary,
      "For each section give SPECIFIC numbers:",
      "**Strength burn:** calculate using MET values for resistance training (~5-6 METs), duration estimate based on sets×reps×rest time",
      "**Cardio burn:** compare machine display calories vs your estimate (machines overestimate by 20-30%)",
      "**Total exercise calories:** strength + cardio",
      "**Total day calories:** BMR + exercise burn",
      "**Hypertrophy target:** to gain muscle at 51, needs BMR×1.55 + 300-500 surplus",
      "**Food needed:** total target minus calories already burned",
      "Give exact numbers. Use **bold** for totals. Under 200 words."
    ].join(" ");

    try { setAiCalEst(await ai(p, 400)); } catch(e) { setAiCalEst("Error. Check API key in Setup."); }
    setAiCalLoading(false);
  };

  const callSug = async () => {
    setAiSugL(true); setAiSug(null);
    const {hist, prStr, body, mach} = ctx();
    const p = "You are a hypertrophy coach for a 51yr old male training 7 days/week twice daily. Available machines: " + mach + ". Body scan: " + body + ". PRs: " + prStr + ". Hydration: " + waterMl + "ml hydration. History: " + hist + ". Give: 1) One specific progressive overload suggestion with exact machine, current and target weight. 2) One superset recommendation using available machines. 3) One body composition insight from the scan. 4) Hydration/nutrition tip based on BMR. Under 130 words. Use lb.";
    try { setAiSug(await ai(p, 350)); } catch(e) { setAiSug("Error. Check API key."); }
    setAiSugL(false);
  };

  const callPlan = async () => {
    setAiPlanL(true); setAiPlan(null);
    const {prStr, body, mach} = ctx();
    const p = "You are an expert hypertrophy coach. Generate a personalised weekly workout plan (Mon-Sun) for a 51yr old male training twice daily. ONLY use these machines: " + mach + ". Body scan: " + body + ". Current PRs to build from: " + prStr + ". For each day list 6-8 exercises with sets x reps @ weight based on PRs. Format each day as: DAY: Exercise - sets x reps @ weight. Include rest times. Note deload if needed. Max 400 words.";
    try { setAiPlan(await ai(p, 700)); } catch(e) { setAiPlan("Error. Check API key."); }
    setAiPlanL(false);
  };

  const saveAIPlanAsCustom = () => {
    if (!aiPlan) return;
    const newPlan = {
      id: uid(),
      name: "AI Plan " + new Date().toLocaleDateString("en-GB",{day:"2-digit",month:"short"}),
      color: C.pur,
      source: "ai",
      createdAt: new Date().toISOString(),
      rawText: aiPlan,
      days: [
        {day:"Mon",name:"Day 1",exercises:[]},
        {day:"Tue",name:"Day 2",exercises:[]},
        {day:"Wed",name:"Day 3",exercises:[]},
        {day:"Thu",name:"Day 4",exercises:[]},
        {day:"Fri",name:"Day 5",exercises:[]},
        {day:"Sat",name:"Day 6",exercises:[]},
        {day:"Sun",name:"Day 7",exercises:[]},
      ]
    };
    savePlansToStorage([...savedPlans, newPlan]);
    showToast("Plan saved! Edit it in the Plan tab.");
  };

  const callScan = async () => {
    setAiScanL(true); setAiScan(null);
    const {scans, body, prStr} = ctx();
    const p = "You are a body composition expert. Analyse this athlete's Starfit scan history. Scan history: " + scans + ". Latest: " + body + ". PRs: " + prStr + ". Provide: 1) Trend — is muscle increasing, fat decreasing, rate of change? 2) What the numbers mean for a 51yr old hypertrophy athlete. 3) Which metrics need most attention. 4) How gym performance correlates with body changes. Specific with numbers. Under 200 words.";
    try { setAiScan(await ai(p, 400)); } catch(e) { setAiScan("Error. Check API key."); }
    setAiScanL(false);
  };

  const callNutr = async () => {
    setAiNutrL(true); setAiNutr(null);
    const {body} = ctx();
    const p = "You are a sports nutritionist. Based on body data for a 51yr old male hypertrophy athlete: " + body + ". Hydration: " + waterMl + "ml hydration. Provide: 1) Daily calorie target (BMR + hypertrophy surplus). 2) Protein target in grams. 3) Carb and fat split. 4) Meal timing for twice-daily training. 5) Key supplements for muscle building at 51 (creatine, protein etc). Specific numbers. Under 200 words.";
    try { setAiNutr(await ai(p, 400)); } catch(e) { setAiNutr("Error. Check API key."); }
    setAiNutrL(false);
  };

  const callPlat = async () => {
    setAiPlatL(true); setAiPlat(null);
    const {hist, prStr, scans} = ctx();
    const p = "You are a strength coach. Detect plateaus in this workout history. History: " + hist + ". PRs: " + prStr + ". Body scans: " + scans + ". Provide: 1) Which machines show plateau (same weight/reps 3+ sessions). 2) Exercises making great progress. 3) Whether a deload week is recommended. 4) Specific strategies to break plateaus (drop sets, supersets, rep range changes). 5) Recovery recommendation. Reference actual weights. Under 200 words.";
    try { setAiPlat(await ai(p, 400)); } catch(e) { setAiPlat("Error. Check API key."); }
    setAiPlatL(false);
  };

  const callAge = async () => {
    setAiAgeL(true); setAiAge(null);
    const {scans, body, prStr} = ctx();
    const p = "You are a longevity and fitness expert. Analyse body age vs chronological age. Chronological age: 51, Male. Scan history: " + scans + ". Latest: " + body + ". PRs: " + prStr + ". Provide: 1) Body age trend across scans — improving or worsening? 2) What drives the body age score. 3) Specific changes to reduce body age further. 4) How strength compares to expected for age. 5) Realistic target body age in 6 months. Encouraging but honest. Under 200 words.";
    try { setAiAge(await ai(p, 400)); } catch(e) { setAiAge("Error. Check API key."); }
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
    const entry = {id:uid(), date:today(), machine:m, sets:valid.map(s=>({...s,done:true})), superset:isSuper, supersetWith:isSuper?superWith:"", supersetSets:isSuper?superSets.filter(s=>s.reps&&s.weight).map(s=>({...s,done:true})):[], notes:wNotes, isPR};
    if (machine==="__new" && newMach && !machines.includes(newMach)) setMachines(p=>[...p,newMach]);
    const newLogs = [entry, ...logs];
    setLogs(newLogs);
    saveLog(entry).catch(e => console.error('Save log error:', e));
    updateLiveCalEst(newLogs, cardioLogs);
    setSets([{id:uid(),reps:"",weight:"",done:false}]);
    setSuperSets([{id:uid(),reps:"",weight:"",done:false}]);
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
      const geminiKey = aiProvider === "gemini" ? apiKey : (await getSetting("ai_key_gemini") || apiKey);
      const parsed = await callAIPDF(b64, prompt, geminiKey);
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

  // ── Camera machine detection
  const detectMachine = async (imageBase64) => {
    setCamDetecting(true); setCamResult(null);
    const providerToUse = aiProvider;
    const keyToUse = apiKey;
    const promptParts = [
      "You are a gym equipment expert.",
      "Look at this image and identify the gym machine shown.",
      "Return ONLY a JSON object with: name, confidence (high/medium/low), description, muscleGroup.",
      "Example: {name:Lat Pulldown,confidence:high,description:Cable machine for back,muscleGroup:Back}",
      "No extra text. JSON only."
    ];
    const prompt = promptParts.join(" ");

    try {
      let responseText = "";

      if (providerToUse === "gemini" && keyToUse) {
        const r = await fetch("https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=" + keyToUse, {
          method:"POST", headers:{"Content-Type":"application/json"},
          body: JSON.stringify({contents:[{parts:[{inline_data:{mime_type:"image/jpeg",data:imageBase64}},{text:prompt}]}]})
        });
        const d = await r.json();
        responseText = d?.candidates?.[0]?.content?.parts?.[0]?.text || "{}";
      } else if (providerToUse === "claude" && keyToUse) {
        const r = await fetch("https://api.anthropic.com/v1/messages", {
          method:"POST",
          headers:{"Content-Type":"application/json","x-api-key":keyToUse,"anthropic-version":"2023-06-01","anthropic-dangerous-direct-browser-access":"true"},
          body: JSON.stringify({model:"claude-haiku-4-5-20251001", max_tokens:200, messages:[{role:"user",content:[{type:"image",source:{type:"base64",media_type:"image/jpeg",data:imageBase64}},{type:"text",text:prompt}]}]})
        });
        const d = await r.json();
        responseText = d?.content?.[0]?.text || "{}";
      } else if (providerToUse === "gpt" && keyToUse) {
        const r = await fetch("https://api.openai.com/v1/chat/completions", {
          method:"POST",
          headers:{"Content-Type":"application/json","Authorization":"Bearer " + keyToUse},
          body: JSON.stringify({model:"gpt-4o-mini", max_tokens:200, messages:[{role:"user",content:[{type:"image_url",image_url:{url:"data:image/jpeg;base64,"+imageBase64}},{type:"text",text:prompt}]}]})
        });
        const d = await r.json();
        responseText = d?.choices?.[0]?.message?.content || "{}";
      } else {
        setCamResult({name:"No AI key", confidence:"low", description:"Add an API key in Setup tab first.", muscleGroup:""});
        setCamDetecting(false);
        return;
      }

      const clean = responseText.replace(/```json|```/g,"").trim();
      const parsed = JSON.parse(clean);
      setCamResult(parsed);
      setCamEdit(parsed.name || "");
    } catch(e) {
      setCamResult({name:"Detection failed", confidence:"low", description:"Could not analyse image. Try again.", muscleGroup:""});
      setCamEdit("");
    }
    setCamDetecting(false);
  };

  const handleCameraCapture = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => {
      const base64 = reader.result.split(",")[1];
      setCamPhoto(reader.result);
      detectMachine(base64);
    };
    reader.readAsDataURL(file);
  };

  const confirmMachine = () => {
    const name = camEdit.trim();
    if (!name) { showToast("Enter a machine name"); return; }
    if (!machines.includes(name)) {
      setMachines(p=>[...p, name]);
      addMachine(name).catch(console.error);
    }
    setMachine(name);
    setMachSearch("");
    setMachOpen(false);
    setCamOpen(false);
    setCamPhoto(null);
    setCamResult(null);
    setCamEdit("");
    showToast("✅ " + name + " added!");
  };

  const tPct = ((timerMax-timerSec)/timerMax)*100;
  const R=62, CIRC=2*Math.PI*R;
  const filtered = histFilter==="pr" ? logs.filter(l=>l.isPR) : histFilter==="ss" ? logs.filter(l=>l.superset) : logs;

  const feat = (id,icon,title,sub,loading,result,onRun,runLabel) => (
    <>
      <button className={"afbtn"+(openFeat===id?" on":"")} onClick={()=>setOpenFeat(openFeat===id?"":id)}>
        <span style={{fontSize:24,flexShrink:0}}>{icon}</span>
        <div style={{flex:1}}>
          <div className="aftl">{title}</div>
          <div className="afsu">{sub}</div>
        </div>
        <span style={{color:C.acc,fontSize:16}}>{openFeat===id?"▲":"▶"}</span>
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
            <button className="hamburger" onClick={()=>setNavOpen(true)} aria-label="Menu">
              <div className="hbar"/>
              <div className="hbar"/>
              <div className="hbar"/>
            </button>
            <button className="icb" style={{position:"relative"}} onClick={()=>setWaterOpen(v=>!v)}>
              💧
              <span style={{position:"absolute",top:-2,right:-2,background:waterMl>=waterGoal?"#c8f135":"#4cc9f0",color:"#0a0a0f",borderRadius:"50%",minWidth:14,height:14,padding:"0 2px",fontSize:9,fontWeight:700,display:"flex",alignItems:"center",justifyContent:"center",lineHeight:1,whiteSpace:"nowrap"}}>
                {waterMl>=1000?(waterMl/1000).toFixed(1)+"L":waterMl+"ml"}
              </span>
            </button>
            <button className="icb" onClick={async()=>{
              showToast("Generating report...");
              const {body,prStr} = ctx();
              const sum = await ai("Write 3 motivating sentences for a hypertrophy athlete. " + body + " PRs: " + prStr + ". Note body composition and strongest lifts.", 200);
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

      </div>

      {/* Water quick panel */}
      {waterOpen && (
        <div style={{background:"#15151e",borderBottom:"1px solid #1c1c2c",padding:"12px 18px"}}>
          <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:8}}>
            <div style={{fontSize:14,fontWeight:600,color:"#e8e8f0"}}>💧 Hydration Today</div>
            <div style={{display:"flex",alignItems:"center",gap:6}}>
              <span style={{fontFamily:"'JetBrains Mono',monospace",fontSize:14,color:waterMl>=waterGoal?"#c8f135":"#4cc9f0",fontWeight:700}}>
                {waterMl>=1000?(waterMl/1000).toFixed(2)+"L":waterMl+"ml"}
              </span>
              <span style={{fontSize:13,color:"#6a6a8a"}}>/ {waterGoal>=1000?(waterGoal/1000)+"L":waterGoal+"ml"}</span>
              <span style={{fontSize:11,color:waterMl>=waterGoal?"#c8f135":waterMl>=waterGoal*0.6?"#4cc9f0":"#ff4d6d",background:waterMl>=waterGoal?"#c8f13518":waterMl>=waterGoal*0.6?"#4cc9f018":"#ff4d6d18",padding:"2px 7px",borderRadius:99,fontWeight:600}}>
                {waterMl>=waterGoal?"Great! 💪":waterMl>=waterGoal*0.6?"Good":"Drink more"}
              </span>
            </div>
          </div>
          {/* Progress bar */}
          <div style={{height:5,background:"#1c1c2c",borderRadius:99,overflow:"hidden",marginBottom:12}}>
            <div style={{height:"100%",background:waterMl>=waterGoal?"#c8f135":"#4cc9f0",borderRadius:99,width:Math.min(waterMl/waterGoal*100,100)+"%",transition:"width .3s"}}/>
          </div>
          {/* Quick add buttons */}
          <div style={{fontSize:11,color:"#6a6a8a",textTransform:"uppercase",letterSpacing:1,marginBottom:6}}>Quick Add</div>
          <div style={{display:"flex",gap:6,marginBottom:10}}>
            {[150,250,350,500,750,1000].map(ml=>(
              <button key={ml} onClick={()=>{setWaterMl(w=>w+ml);showToast("+" + ml + "ml logged!");}}
                style={{flex:1,padding:"7px 2px",background:"#111118",border:"1px solid #1c1c2c",borderRadius:8,color:ml>=500?"#c8f135":"#4cc9f0",fontSize:11,fontWeight:600,cursor:"pointer",lineHeight:1.3,textAlign:"center"}}>
                <div style={{fontSize:13}}>{ml>=1000?(ml/1000)+"L":ml}</div>
                <div style={{fontSize:9,color:"#6a6a8a"}}>{ml>=1000?"litre":"ml"}</div>
              </button>
            ))}
          </div>
          {/* Custom amount */}
          <div style={{fontSize:11,color:"#6a6a8a",textTransform:"uppercase",letterSpacing:1,marginBottom:6}}>Custom Amount (ml)</div>
          <div style={{display:"flex",gap:7,marginBottom:10}}>
            <input className="inp" type="number" placeholder="e.g. 330" value={waterCustom}
              onChange={e=>setWaterCustom(e.target.value)}
              style={{flex:1,padding:"7px 10px",fontSize:15}}/>
            <button className="btn bacc" style={{padding:"7px 14px",fontSize:14}} onClick={()=>{
              const ml = parseInt(waterCustom);
              if (!ml || ml<=0) { showToast("Enter a valid amount"); return; }
              setWaterMl(w=>w+ml);
              setWaterCustom("");
              showToast("+" + ml + "ml logged!");
            }}>Add</button>
          </div>
          {/* Goal setting */}
          <div style={{fontSize:11,color:"#6a6a8a",textTransform:"uppercase",letterSpacing:1,marginBottom:6}}>Daily Goal</div>
          <div style={{display:"flex",gap:5,marginBottom:10}}>
            {[2000,2500,3000,3500,4000].map(g=>(
              <button key={g} onClick={()=>{setWaterGoal(g);showToast("Goal set to "+(g/1000)+"L");}}
                style={{flex:1,padding:"5px 2px",background:waterGoal===g?"#c8f13518":"#111118",border:"1px solid "+(waterGoal===g?"#c8f13540":"#1c1c2c"),borderRadius:7,color:waterGoal===g?"#c8f135":"#6a6a8a",fontSize:11,fontWeight:600,cursor:"pointer"}}>
                {g/1000}L
              </button>
            ))}
          </div>
          {/* Reset and close */}
          <div style={{display:"flex",gap:7}}>
            <button className="btn bgh" style={{flex:1,fontSize:13}} onClick={()=>{setWaterMl(0);showToast("Water reset for today");}}>
              Reset Today
            </button>
            <button className="btn bgh" style={{padding:"9px 14px",fontSize:14}} onClick={()=>setWaterOpen(false)}>✕</button>
          </div>
        </div>
      )}

      <div className="pg">

        {/* WORKOUT */}
        {tab==="workout" && (
          <>
            <div className="aib">
              <div className="aihdr">
                <div className="aidot"/>
                <div className="aitl">AI Coach</div>
                {latest && <span className="chip b" style={{marginLeft:"auto",fontSize:10}}>Starfit Active</span>}
              </div>
              {aiSugL && <Ldots/>}
              {aiSug && <div className="aitxt" dangerouslySetInnerHTML={{__html:aiSug.replace(/\*\*(.*?)\*\*/g,"<b>$1</b>").replace(/\\n/g,"<br/>")}}/>}
              {!aiSug && !aiSugL && <div className="aitxt">{latest ? "Starfit data loaded — AI knows your body fat (" + latest.bodyFat + "%), muscle (" + latest.muscle + "lb) and BMR (" + latest.bmr + "kcal)." : "Upload Starfit PDF in Body tab for full body-aware suggestions."}</div>}
              <button className="btn bacc bfull" onClick={callSug} disabled={aiSugL}>{aiSugL?"Thinking...":"Get AI Suggestion"}</button>
              {(liveCalEst || liveCalLoading) && (
                <div style={{marginTop:8,background:"#0d1a0d",borderRadius:8,padding:"7px 10px",fontSize:13,color:liveCalLoading?C.sub:C.grn,display:"flex",alignItems:"center",gap:6}}>
                  <span>{liveCalLoading?"⟳":"🔥"}</span>
                  <span>{liveCalLoading?"Updating calorie estimate...":liveCalEst}</span>
                </div>
              )}
            </div>

            {/* Plan Session Selector */}
            {(savedPlans.length > 0 || PLANS.length > 0) && (
              <div className="card" style={{padding:"11px 13px"}}>
                <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:selectedSessionPlan?8:0}}>
                  <div style={{fontSize:13,fontWeight:600,color:C.txt}}>📋 Today's Plan</div>
                  <button onClick={()=>setPlanSelectOpen(v=>!v)}
                    style={{background:selectedSessionPlan?"#c8f13518":C.bdr,border:"1px solid "+(selectedSessionPlan?"#c8f13540":C.bdr),borderRadius:7,padding:"4px 10px",fontSize:13,color:selectedSessionPlan?C.acc:C.sub,cursor:"pointer",fontWeight:600}}>
                    {selectedSessionPlan ? selectedSessionPlan.name : "Select Plan"}
                  </button>
                </div>
                {planSelectOpen && (
                  <div style={{background:C.sur,borderRadius:9,padding:8,marginTop:7}}>
                    <div style={{fontSize:11,color:C.sub,marginBottom:6,textTransform:"uppercase",letterSpacing:1}}>Built-in Plans</div>
                    {PLANS.map((p,i)=>(
                      <div key={p.id} onClick={()=>{setSelectedSessionPlan({...p,type:"builtin",idx:i});setPlanSelectOpen(false);}}
                        style={{padding:"7px 9px",borderRadius:7,cursor:"pointer",marginBottom:3,background:selectedSessionPlan?.id===p.id?"#c8f13512":C.card,border:"1px solid "+(selectedSessionPlan?.id===p.id?"#c8f13540":C.bdr)}}>
                        <span style={{fontSize:13,fontWeight:600,color:p.color}}>{p.day}</span>
                        <span style={{fontSize:13,color:C.txt,marginLeft:7}}>{p.name}</span>
                      </div>
                    ))}
                    {savedPlans.length > 0 && <>
                      <div style={{fontSize:11,color:C.sub,marginBottom:6,marginTop:9,textTransform:"uppercase",letterSpacing:1}}>Saved Plans</div>
                      {savedPlans.map(p=>(
                        <div key={p.id} onClick={()=>{setSelectedSessionPlan({...p,type:"saved"});setPlanSelectOpen(false);}}
                          style={{padding:"7px 9px",borderRadius:7,cursor:"pointer",marginBottom:3,background:selectedSessionPlan?.id===p.id?"#c8f13512":C.card,border:"1px solid "+(selectedSessionPlan?.id===p.id?"#c8f13540":C.bdr)}}>
                          <span style={{fontSize:13,fontWeight:600,color:C.pur}}>{p.name}</span>
                        </div>
                      ))}
                    </>}
                    <button className="btn bgh bfull" style={{marginTop:6,fontSize:13}} onClick={()=>{setSelectedSessionPlan(null);setPlanSelectOpen(false);}}>Clear Selection</button>
                  </div>
                )}
                {selectedSessionPlan && !planSelectOpen && (
                  <div style={{marginTop:4}}>
                    <div style={{fontSize:11,color:C.sub,marginBottom:5}}>Tap an exercise to pre-fill the machine:</div>
                    <div style={{display:"flex",flexWrap:"wrap",gap:4}}>
                      {(selectedSessionPlan.type==="builtin" ? selectedSessionPlan.exercises : (selectedSessionPlan.days?.[0]?.exercises||[]))
                        .filter(ex=>ex.name&&!ex.name.startsWith("──"))
                        .map((ex,i)=>(
                          <button key={i} onClick={()=>{
                            const mName = ex.name;
                            if (machines.includes(mName)) { setMachine(mName); setMachSearch(mName); }
                            else { setMachine("__new"); setNewMach(mName); }
                          }}
                          style={{background:C.bdr,border:"none",borderRadius:6,padding:"4px 8px",fontSize:11,color:C.txt,cursor:"pointer",fontWeight:500}}>
                            {ex.name.length>22?ex.name.slice(0,20)+"…":ex.name}
                          </button>
                        ))}
                    </div>
                  </div>
                )}
              </div>
            )}

            <div className="card">
              <div className="ct">Rest Timer</div>
              <div className="twrap">
                <svg className="tsvg" width="150" height="150" viewBox="0 0 150 150">
                  <circle cx="75" cy="75" r={R} fill="none" stroke={C.bdr} strokeWidth="7"/>
                  <circle cx="75" cy="75" r={R} fill="none" stroke={C.acc} strokeWidth="7"
                    strokeDasharray={CIRC} strokeDashoffset={CIRC-(CIRC*tPct/100)}
                    strokeLinecap="round" style={{transition:"stroke-dashoffset .5s"}}/>
                </svg>
                <div className="tnum">{fmt(timerSec)}</div>
                <div className="tlbl">REST</div>
              </div>
              <div className="row" style={{marginBottom:7}}>
                {[60,90,120,180].map(s=>(
                  <button key={s} className="btn bgh" style={{flex:1,padding:"6px 2px",fontSize:13}} onClick={()=>startTimer(s)}>{s}s</button>
                ))}
              </div>
              <div className="row">
                <button className="btn bacc" style={{flex:1}} onClick={()=>setTimerOn(v=>!v)}>{timerOn?"Pause":"Start"}</button>
                <button className="btn bgh" style={{flex:1}} onClick={()=>{setTimerOn(false);setTimerSec(timerMax);}}>Reset</button>
              </div>
            </div>

            <div className="card">
              <div className="ct">Log Exercise</div>
              <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginTop:0,marginBottom:4}}>
                <div className="cl" style={{margin:0}}>Machine / Exercise</div>
                <button onClick={()=>{setCamOpen(true);setCamPhoto(null);setCamResult(null);setCamEdit("");}}
                  style={{background:"#c8f13518",border:"1px solid #c8f13540",borderRadius:7,padding:"3px 9px",fontSize:13,color:"#c8f135",cursor:"pointer",display:"flex",alignItems:"center",gap:4,fontWeight:600}}>
                  📷 Scan Machine
                </button>
              </div>

              {/* Searchable machine picker */}
              <div className="mach-wrap" ref={machSearchRef}>
                {/* Selected machine display / search input */}
                <div style={{position:"relative"}}>
                  <span className="mach-icon">🔍</span>
                  <input
                    className="mach-search"
                    placeholder={machine ? machine : "Search or select machine..."}
                    value={machSearch}
                    onChange={e => { setMachSearch(e.target.value); setMachOpen(true); }}
                    onFocus={() => setMachOpen(true)}
                  />
                  {machine && (
                    <button onClick={()=>{setMachine("");setNewMach("");setMachSearch("");}}
                      style={{position:"absolute",right:10,top:"50%",transform:"translateY(-50%)",background:"none",border:"none",color:"#6a6a8a",fontSize:18,cursor:"pointer",lineHeight:1}}>×</button>
                  )}
                </div>

                {/* Dropdown list */}
                {machOpen && (
                  <div className="mach-dropdown">
                    {(() => {
                      const q = machSearch.toLowerCase();
                      const filtered = machines.filter(m => m.toLowerCase().includes(q));
                      return (
                        <>
                          {filtered.length === 0 && q && (
                            <div className="mach-none">No machines match "{machSearch}"</div>
                          )}
                          {filtered.map(m => (
                            <div key={m} className={"mach-opt" + (machine===m?" selected":"")}
                              onClick={() => { setMachine(m); setNewMach(""); setMachSearch(""); setMachOpen(false); }}>
                              <span>{m}</span>
                              {machine===m && <span style={{fontSize:13}}>✓</span>}
                            </div>
                          ))}
                          {/* Add new option shown when search text doesn't match any machine */}
                          {machSearch && !machines.find(m=>m.toLowerCase()===machSearch.toLowerCase()) && (
                            <div className="mach-opt add-new"
                              onClick={() => { setMachine("__new"); setNewMach(machSearch); setMachSearch(""); setMachOpen(false); }}>
                              + Add "{machSearch}" as new machine
                            </div>
                          )}
                          {/* Always show add new at bottom if no search */}
                          {!machSearch && (
                            <div className="mach-opt add-new"
                              onClick={() => { setMachine("__new"); setMachSearch(""); setMachOpen(false); }}>
                              + Add new machine
                            </div>
                          )}
                        </>
                      );
                    })()}
                  </div>
                )}
              </div>

              {/* New machine name input */}
              {machine==="__new" && (
                <input className="inp" style={{marginTop:6}} placeholder="Type machine name..."
                  value={newMach} onChange={e=>setNewMach(e.target.value)}/>
              )}
              <div className="divider"/>
              <div className="row" style={{alignItems:"center",marginBottom:7}}>
                <div style={{flex:1}}><div style={{fontWeight:600,fontSize:14}}>Superset</div><div style={{fontSize:11,color:C.sub}}>Pair with another exercise</div></div>
                <button className={"btn "+(isSuper?"bacc":"bgh")} style={{padding:"4px 11px",fontSize:13}} onClick={()=>setIsSuper(v=>!v)}>{isSuper?"ON":"OFF"}</button>
              </div>
              {isSuper && (
                <div style={{background:C.sur,borderRadius:10,padding:"11px 13px",border:"1px solid #4cc9f030",marginTop:4}}>
                  <div style={{fontSize:11,color:C.blu,fontWeight:600,marginBottom:7}}>⚡ Superset — Paired Exercise</div>
                  <div className="cl" style={{marginTop:0,color:C.blu}}>Paired Exercise</div>
                  <select className="inp" style={{borderColor:"#4cc9f040",marginBottom:8}} value={superWith} onChange={e=>setSuperWith(e.target.value)}>
                    <option value="">Select paired exercise...</option>
                    {machines.filter(m=>m!==(machine==="__new"?newMach:machine)).map(m=><option key={m} value={m}>{m}</option>)}
                  </select>
                  <div style={{fontSize:11,color:C.sub,marginBottom:7}}>Sets for <b style={{color:C.blu}}>{superWith||"paired exercise"}</b>:</div>
                  <div style={{display:"grid",gridTemplateColumns:"20px 1fr 1fr 26px 22px",gap:4,marginBottom:4}}>
                    {["","Reps","Weight(lb)","",""].map((h,i)=><span key={i} style={{fontSize:9,color:C.sub,textAlign:"center",textTransform:"uppercase",letterSpacing:".7px"}}>{h}</span>)}
                  </div>
                  {superSets.map((s,i)=>(
                    <div key={s.id} className="srow">
                      <span className="snum">{i+1}</span>
                      <input className="sinp" type="number" placeholder="10" value={s.reps}
                        onChange={e=>setSuperSets(p=>p.map((x,j)=>j===i?{...x,reps:e.target.value}:x))}/>
                      <input className="sinp" type="number" placeholder="45" value={s.weight}
                        onChange={e=>setSuperSets(p=>p.map((x,j)=>j===i?{...x,weight:e.target.value}:x))}/>
                      <button className={"sdone"+(s.done?" ck":"")} onClick={()=>{
                        const was = !superSets[i].done;
                        setSuperSets(p=>p.map((x,j)=>j===i?{...x,done:!x.done}:x));
                        if (was) {
                          startTimer(timerMax);
                          showToast("⚡ Superset "+(i+1)+" complete! Resting...");
                        }
                      }}>{s.done?"✓":""}</button>
                      <button style={{background:"none",border:"none",color:C.red,fontSize:14,cursor:"pointer"}}
                        onClick={()=>setSuperSets(p=>p.filter((_,j)=>j!==i))}>×</button>
                    </div>
                  ))}
                  <button className="btn bgh bfull" style={{fontSize:11,marginTop:4,borderColor:"#4cc9f040",color:C.blu}} onClick={()=>{
                    const last = superSets[superSets.length-1];
                    setSuperSets(p=>[...p,{id:uid(),reps:last?.reps||"",weight:last?.weight||"",done:false}]);
                  }}>+ Add Paired Set</button>
                  <div style={{fontSize:10,color:C.sub,marginTop:7,background:C.card,borderRadius:7,padding:"6px 9px"}}>
                    💡 Complete one set of each exercise back-to-back, then rest. Timer starts after both sets are done.
                  </div>
                </div>
              )}
              <div className="divider"/>
              <div style={{display:"grid",gridTemplateColumns:"20px 1fr 1fr 26px 22px",gap:4,marginBottom:4}}>
                {["","Reps","Weight(lb)","",""].map((h,i)=><span key={i} style={{fontSize:10,color:C.sub,textAlign:"center",textTransform:"uppercase",letterSpacing:".7px"}}>{h}</span>)}
              </div>
              {sets.map((s,i)=>(
                <div key={s.id} className="srow">
                  <span className="snum">{i+1}</span>
                  <input className="sinp" type="number" placeholder="10" value={s.reps} onChange={e=>setSets(p=>p.map((x,j)=>j===i?{...x,reps:e.target.value}:x))}/>
                  <input className="sinp" type="number" placeholder="85" value={s.weight} onChange={e=>setSets(p=>p.map((x,j)=>j===i?{...x,weight:e.target.value}:x))}/>
                  <button className={"sdone"+(s.done?" ck":"")} onClick={()=>{
                    const was = !sets[i].done;
                    setSets(p=>p.map((x,j)=>j===i?{...x,done:!x.done}:x));
                    if (was) {
                      if (isSuper) {
                        showToast("Set "+(i+1)+" done! Now do paired set...");
                      } else {
                        startTimer(timerMax);
                        showToast("Set "+(i+1)+" done! Resting...");
                      }
                    }
                  }}>{s.done?"✓":""}</button>
                  <button style={{background:"none",border:"none",color:C.red,fontSize:16,cursor:"pointer"}} onClick={()=>setSets(p=>p.filter((_,j)=>j!==i))}>×</button>
                </div>
              ))}
              <button className="btn bgh bfull" style={{fontSize:13}} onClick={()=>setSets(p=>[...p,{id:uid(),reps:"",weight:"",done:false}])}>+ Add Set</button>
              <div className="divider"/>
              <div className="cl" style={{marginTop:0}}>Notes</div>
              <input className="inp" placeholder="e.g. increase weight next week..." value={wNotes} onChange={e=>setWNotes(e.target.value)}/>
              <button className="btn bacc bfull" onClick={logWorkout}>Log Exercise ✓</button>
            </div>
          </>
        )}

        {/* CARDIO */}
        {tab==="cardio" && (
          <>
            <div style={{fontFamily:"'Bebas Neue',sans-serif",fontSize:19,letterSpacing:2,marginBottom:3}}>🏃 Cardio</div>
            <div style={{fontSize:11,color:C.sub,marginBottom:9}}>Log cardio · track calories · AI estimate</div>

            {/* Daily calorie summary */}
            {(() => {
              const todayDate = today();
              const todayStrength = logs.filter(l => l.date === todayDate);
              const todayCardio = cardioLogs.filter(l => l.date === todayDate);
              const cardioCalTotal = todayCardio.reduce((s, c) => s + (Number(c.calDisplay) || 0), 0);
              const hasData = todayStrength.length > 0 || todayCardio.length > 0;
              return hasData ? (
                <div className="cal-summary">
                  <div style={{fontSize:13,fontWeight:600,color:C.acc,marginBottom:8}}>Today's Calorie Burn</div>
                  <div style={{display:"flex",gap:10,justifyContent:"space-between",margin:"8px 0"}}>
                    <div style={{flex:1,background:C.card,borderRadius:12,padding:"11px 8px",textAlign:"center",border:"2px solid "+C.blu+"50"}}>
                      <div style={{fontFamily:"'Bebas Neue',sans-serif",fontSize:26,color:C.blu,lineHeight:1}}>{todayStrength.length}</div>
                      <div style={{fontSize:10,color:C.sub,marginTop:2}}>Exercises</div>
                    </div>
                    <div style={{flex:1,background:C.card,borderRadius:12,padding:"11px 8px",textAlign:"center",border:"2px solid "+C.red+"50"}}>
                      <div style={{fontFamily:"'Bebas Neue',sans-serif",fontSize:26,color:C.red,lineHeight:1}}>{todayCardio.reduce((s,c)=>s+(Number(c.duration)||0),0)}</div>
                      <div style={{fontSize:10,color:C.sub,marginTop:2}}>Cardio min</div>
                    </div>
                    <div style={{flex:1,background:C.card,borderRadius:12,padding:"11px 8px",textAlign:"center",border:"2px solid "+C.acc+"50"}}>
                      <div style={{fontFamily:"'Bebas Neue',sans-serif",fontSize:26,color:C.acc,lineHeight:1}}>{cardioCalTotal || "—"}</div>
                      <div style={{fontSize:10,color:C.sub,marginTop:2}}>Cal display</div>
                    </div>
                  </div>
                  <button className="btn bacc bfull" style={{marginTop:4}} onClick={callCalorieEstimate} disabled={aiCalLoading}>
                    {aiCalLoading ? "Estimating..." : "🤖 AI Estimate Total Burn"}
                  </button>
                  {aiCalLoading && <div style={{marginTop:8}}><div className="ldots"><div className="ldot"/><div className="ldot"/><div className="ldot"/></div></div>}
                  {aiCalEst && (
                    <div style={{background:"#111118",borderRadius:10,padding:"13px",marginTop:9,border:"1px solid #1c1c2c"}}>
                      <div style={{fontSize:12,color:"#c8f135",fontWeight:600,marginBottom:7}}>📊 Calorie Breakdown</div>
                      <div style={{fontSize:13,color:"#e8e8f0",lineHeight:1.8,whiteSpace:"pre-wrap"}} dangerouslySetInnerHTML={{__html:(aiCalEst||"").split("\n").join("<br/>").replace(/\*\*(.*?)\*\*/g,"<b style='color:#c8f135'>$1</b>")}}/>
                      <button onClick={()=>setAiCalEst(null)} style={{marginTop:9,width:"100%",background:"#1c1c2c",border:"none",borderRadius:8,padding:"8px",color:"#6a6a8a",fontSize:12,cursor:"pointer"}}>Clear</button>
                    </div>
                </div>
              ) : null;
            })()}

            {/* Sub tabs */}
            <div className="stabs">
              {[["log","Log Cardio"],["history","History"]].map(([k,l])=>(
                <button key={k} className={"stab"+(cardioTab===k?" on":"")} onClick={()=>setCardioTab(k)}>{l}</button>
              ))}
            </div>

            {/* Log cardio form */}
            {cardioTab==="log" && (
              <div className="card">
                <div className="ct">Log Cardio Session</div>

                <div className="cl" style={{marginTop:0}}>Machine / Activity</div>
                <select className="inp" value={cardioMachine} onChange={e=>setCardioMachine(e.target.value)}>
                  <option value="">Select cardio machine...</option>
                  {CARDIO_MACHINES.map(m=><option key={m} value={m}>{m}</option>)}
                </select>

                <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:8,marginTop:8}}>
                  <div>
                    <div className="cl" style={{marginTop:0}}>Duration (minutes)</div>
                    <input className="inp" type="number" placeholder="15" value={cardioDuration}
                      onChange={e=>setCardioDuration(e.target.value)}/>
                  </div>
                  <div>
                    <div className="cl" style={{marginTop:0}}>Calories (on machine)</div>
                    <input className="inp" type="number" placeholder="150" value={cardioCalDisplay}
                      onChange={e=>setCardioCalDisplay(e.target.value)}/>
                  </div>
                </div>

                <div className="cl">Notes (optional)</div>
                <input className="inp" placeholder="e.g. incline 8, speed 3.5..." value={cardioNotes}
                  onChange={e=>setCardioNotes(e.target.value)}/>

                <button className="btn bacc bfull" onClick={()=>{
                  if (!cardioMachine) { showToast("Pick a cardio machine"); return; }
                  if (!cardioDuration) { showToast("Enter duration"); return; }
                  const entry = {
                    id: uid(), date: today(), machine: cardioMachine,
                    duration: Number(cardioDuration),
                    calDisplay: Number(cardioCalDisplay) || 0,
                    notes: cardioNotes, type: "cardio"
                  };
                  const newCardio = [entry, ...cardioLogs];
                  setCardioLogs(newCardio);
                  saveCardioLog(entry).catch(console.error);
                  updateLiveCalEst(logs, newCardio);
                  setCardioMachine(""); setCardioDuration(""); setCardioCalDisplay(""); setCardioNotes("");
                  showToast("✅ Cardio logged!");
                  setCardioTab("history");
                }}>Log Cardio ✓</button>

                <div style={{marginTop:12,background:C.sur,borderRadius:9,padding:"9px 11px",fontSize:13,color:C.sub,lineHeight:1.6}}>
                  💡 Log your cardio calories from the machine display, then use <b style={{color:C.acc}}>AI Estimate</b> at the top to get a more accurate total burn including your strength session.
                </div>
              </div>
            )}

            {/* Cardio history */}
            {cardioTab==="history" && (
              <>
                <div style={{fontSize:11,color:C.sub,marginBottom:7}}>{cardioLogs.length} sessions logged</div>
                {cardioLogs.length === 0 ? (
                  <div style={{textAlign:"center",padding:"24px 0",color:C.mut,fontSize:14}}>No cardio logged yet</div>
                ) : cardioLogs.map(l=>(
                  <div key={l.id} className="cardio-item">
                    <div style={{fontSize:10,color:C.mut,fontFamily:"'JetBrains Mono',monospace"}}>{l.date}</div>
                    <div style={{fontWeight:600,fontSize:15,margin:"2px 0"}}>{l.machine}</div>
                    <div style={{display:"flex",gap:10,marginTop:4}}>
                      <span className="chip b">⏱ {l.duration} min</span>
                      {l.calDisplay > 0 && <span className="chip g">🔥 {l.calDisplay} cal</span>}
                    </div>
                    {l.notes && <div style={{fontSize:11,color:C.mut,marginTop:3,fontStyle:"italic"}}>{l.notes}</div>}
                  </div>
                ))}
              </>
            )}
          </>
        )}

        {/* AI HUB */}
        {tab==="ai" && (
          <>
            <div style={{fontFamily:"'Bebas Neue',sans-serif",fontSize:19,letterSpacing:2,marginBottom:3}}>AI Coach Hub</div>
            <div style={{fontSize:11,color:C.sub,marginBottom:11}}>Powered by Gemini Pro · All features free with your key</div>
            {!apiKey && (
              <div style={{background:"#ff4d6d11",border:"1px solid #ff4d6d33",borderRadius:10,padding:"9px 12px",marginBottom:10,fontSize:13,color:C.red}}>
                ⚠️ Add your Gemini API key in Setup tab to use AI features
              </div>
            )}
            {feat("plan","📋","Generate Weekly Workout Plan","Full 7-day plan tailored to your body scan + machines",aiPlanL,aiPlan,callPlan,"Generate My Plan")}
            {aiPlan && !aiPlanL && (
              <button className="btn bacc bfull" style={{marginTop:-4,marginBottom:8}} onClick={saveAIPlanAsCustom}>
                💾 Save This Plan to Plan Tab
              </button>
            )}
            {feat("scan","📊","Analyse Body Scan Progress","Detect trends across Starfit scans + gym correlation",aiScanL,aiScan,callScan,"Analyse My Scans")}
            {feat("nutr","🥗","Nutrition & Calorie Targets","Personalised macros based on your BMR and body fat %",aiNutrL,aiNutr,callNutr,"Get Nutrition Plan")}
            {feat("plateau","📉","Plateau & Deload Detection","Find stagnating exercises + deload recommendations",aiPlatL,aiPlat,callPlat,"Detect Plateaus")}
            {feat("age","🧬","Body Age vs Real Age Analysis","Track biological age trend + how to reduce it",aiAgeL,aiAge,callAge,"Analyse Body Age")}
          </>
        )}

        {/* PLAN */}
        {tab==="plan" && !editingPlan && (
          <>
            <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:3}}>
              <div style={{fontFamily:"'Bebas Neue',sans-serif",fontSize:19,letterSpacing:2}}>My Plans</div>
              <button className="btn bacc" style={{fontSize:13,padding:"5px 11px"}} onClick={()=>{
                const newPlan = {id:uid(),name:"New Plan",color:C.acc,source:"manual",createdAt:new Date().toISOString(),rawText:"",
                  days:["Mon","Tue","Wed","Thu","Fri","Sat","Sun"].map((d,i)=>({day:d,name:"Day "+(i+1),exercises:[{name:"",sets:"",weight:""}]}))};
                setEditPlanData(newPlan); setEditingPlan(true);
              }}>+ New Plan</button>
            </div>
            <div style={{fontSize:11,color:C.sub,marginBottom:9}}>Built-in + your saved plans</div>

            {/* Built-in plans */}
            <div style={{fontSize:11,color:C.sub,textTransform:"uppercase",letterSpacing:1,marginBottom:6}}>Built-in Programme (Jun–Jul 2025)</div>
            <div className="stabs" style={{marginBottom:6}}>
              {PLANS.map((p,i)=>(
                <button key={p.id} className={"stab"+(activePlanIdx===i?" on":"")}
                  style={{color:activePlanIdx===i?p.color:C.sub,borderColor:activePlanIdx===i?p.color+"50":"transparent",background:activePlanIdx===i?p.color+"18":C.bdr}}
                  onClick={()=>setActivePlanIdx(i)}>{p.day}</button>
              ))}
            </div>
            <div className="card" style={{marginBottom:14}}>
              <div className="ct" style={{color:PLANS[activePlanIdx].color}}>{PLANS[activePlanIdx].name}</div>
              {PLANS[activePlanIdx].exercises.map((ex,i)=>(
                ex.name.startsWith("──") ?
                  <div key={i} className="sep">{ex.name}</div> :
                  <div key={i} className="pex">
                    <div className="pexn">{ex.name}</div>
                    <div style={{textAlign:"right",flexShrink:0}}>
                      <div className="pexs" style={{color:PLANS[activePlanIdx].color}}>{ex.sets}</div>
                      <div style={{fontSize:10,color:C.mut}}>{ex.weight}</div>
                    </div>
                  </div>
              ))}
            </div>

            {/* Saved plans */}
            {savedPlans.length > 0 && <>
              <div style={{fontSize:11,color:C.sub,textTransform:"uppercase",letterSpacing:1,marginBottom:6}}>Your Saved Plans ({savedPlans.length})</div>
              {savedPlans.map((plan,pi)=>(
                <div key={plan.id} className="card" style={{marginBottom:9}}>
                  <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:8}}>
                    <div style={{fontFamily:"'Bebas Neue',sans-serif",fontSize:17,letterSpacing:1.5,color:plan.color||C.pur}}>{plan.name}</div>
                    <div style={{display:"flex",gap:5}}>
                      <button className="btn bgh" style={{fontSize:13,padding:"4px 9px"}} onClick={()=>{setEditPlanData({...plan});setEditingPlan(true);}}>Edit</button>
                      <button style={{background:"#ff4d6d18",border:"1px solid #ff4d6d40",borderRadius:7,padding:"4px 9px",fontSize:13,color:C.red,cursor:"pointer"}}
                        onClick={()=>{if(window.confirm("Delete this plan?")){savePlansToStorage(savedPlans.filter((_,i)=>i!==pi));}}}>Del</button>
                    </div>
                  </div>
                  {plan.rawText ? (
                    <div style={{fontSize:13,color:C.sub,lineHeight:1.7,whiteSpace:"pre-wrap"}}
                      dangerouslySetInnerHTML={{__html:(plan.rawText||"").split("\n").join("<br/>")}}/>
                  ) : (
                    plan.days?.map((day,di)=>(
                      day.exercises?.filter(ex=>ex.name).length > 0 && (
                        <div key={di} style={{marginBottom:7}}>
                          <div style={{fontSize:11,color:plan.color||C.acc,fontWeight:700,marginBottom:4,textTransform:"uppercase",letterSpacing:1}}>{day.day} — {day.name}</div>
                          {day.exercises.filter(ex=>ex.name).map((ex,ei)=>(
                            <div key={ei} className="pex">
                              <div className="pexn">{ex.name}</div>
                              <div style={{textAlign:"right",flexShrink:0}}>
                                <div style={{fontSize:11,fontFamily:"'JetBrains Mono',monospace",color:plan.color||C.acc}}>{ex.sets}</div>
                                <div style={{fontSize:10,color:C.mut}}>{ex.weight}</div>
                              </div>
                            </div>
                          ))}
                        </div>
                      )
                    ))
                  )}
                </div>
              ))}
            </>}
            {savedPlans.length === 0 && (
              <div style={{textAlign:"center",padding:"18px 0",color:C.mut,fontSize:13}}>
                No saved plans yet. Generate one with AI or tap + New Plan.
              </div>
            )}
          </>
        )}

        {/* PLAN EDITOR */}
        {tab==="plan" && editingPlan && editPlanData && (
          <>
            <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:11}}>
              <div style={{fontFamily:"'Bebas Neue',sans-serif",fontSize:20,letterSpacing:2}}>
                {editPlanData.id && savedPlans.find(p=>p.id===editPlanData.id) ? "Edit Plan" : "New Plan"}
              </div>
              <div style={{display:"flex",gap:6}}>
                <button className="btn bacc" style={{fontSize:13,padding:"5px 11px"}} onClick={()=>{
                  const exists = savedPlans.findIndex(p=>p.id===editPlanData.id);
                  if (exists>=0) {
                    const updated = [...savedPlans];
                    updated[exists] = editPlanData;
                    savePlansToStorage(updated);
                  } else {
                    savePlansToStorage([...savedPlans, editPlanData]);
                  }
                  setEditingPlan(false); setEditPlanData(null);
                  showToast("Plan saved!");
                }}>Save</button>
                <button className="btn bgh" style={{fontSize:13,padding:"5px 11px"}} onClick={()=>{setEditingPlan(false);setEditPlanData(null);}}>Cancel</button>
              </div>
            </div>

            <div className="card">
              <div className="cl" style={{marginTop:0}}>Plan Name</div>
              <input className="inp" value={editPlanData.name} onChange={e=>setEditPlanData(p=>({...p,name:e.target.value}))} placeholder="e.g. My Hypertrophy Plan"/>
            </div>

            {editPlanData.rawText ? (
              <div className="card">
                <div className="ct">AI Generated Plan</div>
                <div style={{fontSize:13,color:C.sub,lineHeight:1.7,whiteSpace:"pre-wrap",marginBottom:9}}
                  dangerouslySetInnerHTML={{__html:(editPlanData.rawText||"").split("\n").join("<br/>")}}/>
                <button className="btn bgh bfull" style={{fontSize:13}} onClick={()=>setEditPlanData(p=>({...p,rawText:"",days:["Mon","Tue","Wed","Thu","Fri","Sat","Sun"].map((d,i)=>({day:d,name:"Day "+(i+1),exercises:[{name:"",sets:"",weight:""}]}))}))}>
                  Convert to Editable Format
                </button>
              </div>
            ) : (
              editPlanData.days?.map((day, di)=>(
                <div key={di} className="card">
                  <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:8}}>
                    <div style={{fontFamily:"'Bebas Neue',sans-serif",fontSize:16,letterSpacing:1,color:C.acc}}>{day.day}</div>
                    <input className="inp" style={{width:160,fontSize:13,padding:"4px 8px"}} value={day.name}
                      onChange={e=>{const d=[...editPlanData.days];d[di]={...d[di],name:e.target.value};setEditPlanData(p=>({...p,days:d}));}}
                      placeholder="Session name"/>
                  </div>
                  {day.exercises.map((ex, ei)=>(
                    <div key={ei} style={{display:"grid",gridTemplateColumns:"1fr 70px 70px 22px",gap:4,marginBottom:5,alignItems:"center"}}>
                      <input className="sinp" value={ex.name} placeholder="Exercise name"
                        onChange={e=>{const d=[...editPlanData.days];d[di].exercises[ei]={...d[di].exercises[ei],name:e.target.value};setEditPlanData(p=>({...p,days:d}));}}/>
                      <input className="sinp" value={ex.sets} placeholder="3x12"
                        onChange={e=>{const d=[...editPlanData.days];d[di].exercises[ei]={...d[di].exercises[ei],sets:e.target.value};setEditPlanData(p=>({...p,days:d}));}}/>
                      <input className="sinp" value={ex.weight} placeholder="85lb"
                        onChange={e=>{const d=[...editPlanData.days];d[di].exercises[ei]={...d[di].exercises[ei],weight:e.target.value};setEditPlanData(p=>({...p,days:d}));}}/>
                      <button style={{background:"none",border:"none",color:C.red,fontSize:16,cursor:"pointer"}}
                        onClick={()=>{const d=[...editPlanData.days];d[di].exercises=d[di].exercises.filter((_,i)=>i!==ei);setEditPlanData(p=>({...p,days:d}));}}>×</button>
                    </div>
                  ))}
                  <button className="btn bgh bfull" style={{fontSize:13,marginTop:4}}
                    onClick={()=>{const d=[...editPlanData.days];d[di].exercises=[...d[di].exercises,{name:"",sets:"",weight:""}];setEditPlanData(p=>({...p,days:d}));}}>
                    + Add Exercise
                  </button>
                </div>
              ))
            )}
          </>
        )}

        {/* PRs */}
        {tab==="records" && (
          <>
            <div style={{fontFamily:"'Bebas Neue',sans-serif",fontSize:19,letterSpacing:2,marginBottom:3}}>Personal Records</div>
            <div style={{fontSize:11,color:C.sub,marginBottom:10}}>{prs.length} machines tracked</div>
            <div className="prg">
              {prs.slice(0,20).map((p,i)=>(
                <div key={i} className="prc">
                  {i<3 && <div style={{position:"absolute",top:7,right:9,fontSize:14}}>🏆</div>}
                  <div className="pre">{p.machine}</div>
                  <div className="prw">{p.weight}<span style={{fontSize:13,color:C.sub}}> lb</span></div>
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
            <div style={{fontSize:11,color:C.sub,marginBottom:7}}>{filtered.length} sessions</div>
            {filtered.map(l=>(
              <div key={l.id} className={"li"+(l.isPR?" pr":l.superset?" ss":"")}>
                <div className="lid">{l.date}</div>
                <div className="lim">{l.machine} {l.isPR&&"🏆"}</div>
                {l.superset && <div style={{fontSize:10,color:C.blu,marginBottom:2}}>⚡ SS w/ {l.supersetWith}</div>}
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
            <div style={{fontSize:11,color:C.sub,marginBottom:9}}>Starfit · {bodyLog.length} scan{bodyLog.length!==1?"s":""}</div>
            <div className="stabs">
              {[["overview","Overview"],["trends","Trends"],["scans","All Scans"],["water","Hydration"],["upload","Upload PDF"]].map(([k,l])=>(
                <button key={k} className={"stab"+(bodyTab===k?" on":"")} onClick={()=>setBodyTab(k)}>{l}</button>
              ))}
            </div>

            {bodyTab==="overview" && latest && (
              <>
                <div className="card" style={{textAlign:"center"}}>
                  <ScoreRing score={latest.score}/>
                  <div style={{fontSize:13,color:C.sub}}>{latest.date} · {latest.source}</div>
                  {latest.notes && <div style={{fontSize:11,color:C.mut,fontStyle:"italic",marginTop:3}}>{latest.notes}</div>}
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
                    <div style={{fontSize:13,fontWeight:600,color:m.color,marginBottom:5}}>{m.label}</div>
                    <TrendChart data={bodyLog} metricKey={m.key} color={m.color}/>
                  </div>
                ))}
              </>
            )}

            {bodyTab==="scans" && bodyLog.slice().reverse().map(e=>(
              <div key={e.id} className="ecard">
                <div className="edate">{e.date} · {e.source}</div>
                <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:5}}>
                  <div className="escore">{e.score}<span style={{fontSize:13,color:C.sub}}>/100</span></div>
                  <span className="chip gold">{e.weight} lb</span>
                </div>
                <div style={{display:"grid",gridTemplateColumns:"1fr 1fr 1fr",gap:4}}>
                  {[["Fat",e.bodyFat,"%",C.red],["Muscle",e.muscle,"lb",C.acc],["BMR",e.bmr,"kcal",C.sub]].map(([l,v,u,col])=>(
                    <div key={l} style={{background:C.card,borderRadius:5,padding:"4px 7px",textAlign:"center"}}>
                      <div style={{fontSize:13,fontWeight:700,color:col}}>{v}{u}</div>
                      <div style={{fontSize:9,color:C.mut,textTransform:"uppercase"}}>{l}</div>
                    </div>
                  ))}
                </div>
              </div>
            ))}

            {bodyTab==="water" && (
              <div className="card">
                <div className="ct">Hydration Today</div>
                <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:6}}>
                  <span style={{fontFamily:"'JetBrains Mono',monospace",fontSize:20,fontWeight:700,color:waterMl>=waterGoal?"#c8f135":"#4cc9f0"}}>
                    {waterMl>=1000?(waterMl/1000).toFixed(2)+"L":waterMl+"ml"}
                  </span>
                  <span style={{fontSize:13,color:"#6a6a8a"}}>goal: {waterGoal/1000}L</span>
                </div>
                <div className="prog"><div className="progf" style={{width:Math.min(waterMl/waterGoal*100,100)+"%",background:waterMl>=waterGoal?"#c8f135":"#4cc9f0"}}/></div>
                <div style={{fontSize:13,color:"#6a6a8a",marginBottom:10,marginTop:4}}>{Math.round(waterMl/waterGoal*100)}% of daily goal · {Math.max(waterGoal-waterMl,0)}ml remaining</div>
                <div style={{fontSize:11,color:"#6a6a8a",textTransform:"uppercase",letterSpacing:1,marginBottom:6}}>Quick Add</div>
                <div style={{display:"grid",gridTemplateColumns:"1fr 1fr 1fr",gap:6,marginBottom:10}}>
                  {[150,250,350,500,750,1000].map(ml=>(
                    <button key={ml} onClick={()=>{setWaterMl(w=>w+ml);showToast("+"+ml+"ml");}}
                      style={{padding:"9px 4px",background:"#111118",border:"1px solid #1c1c2c",borderRadius:9,color:ml>=500?"#c8f135":"#4cc9f0",cursor:"pointer",textAlign:"center"}}>
                      <div style={{fontSize:16,fontWeight:700,fontFamily:"'JetBrains Mono',monospace"}}>{ml>=1000?ml/1000+"L":ml}</div>
                      <div style={{fontSize:10,color:"#6a6a8a"}}>{ml>=1000?"litre":"ml"}</div>
                    </button>
                  ))}
                </div>
                <div style={{display:"flex",gap:7,marginBottom:10}}>
                  <input className="inp" type="number" placeholder="Custom ml..." value={waterCustom} onChange={e=>setWaterCustom(e.target.value)} style={{flex:1}}/>
                  <button className="btn bacc" onClick={()=>{const ml=parseInt(waterCustom);if(!ml||ml<=0)return;setWaterMl(w=>w+ml);setWaterCustom("");showToast("+"+ml+"ml");}}>Add</button>
                </div>
                {latest?.bmr>0 && (
                  <div style={{background:"#111118",borderRadius:9,padding:"9px 11px",fontSize:13,color:"#6a6a8a",lineHeight:1.6}}>
                    💡 BMR <b style={{color:"#e8e8f0"}}>{latest.bmr}kcal</b> · For hypertrophy at your size aim for <b style={{color:"#c8f135"}}>{waterGoal/1000}L+</b> daily. Tap 💧 header button to log quickly from any screen.
                  </div>
                )}
                <button className="btn bgh bfull" style={{marginTop:8,fontSize:13}} onClick={()=>{setWaterMl(0);showToast("Reset!");}}>Reset Today</button>
              </div>
            )}

            {bodyTab==="upload" && (
              <>
                <div className="card">
                  <div className="ct">Import Starfit PDF</div>
                  <div style={{fontSize:13,color:C.sub,marginBottom:11,lineHeight:1.6}}>Upload your Starfit PDF report. Gemini AI extracts all metrics automatically.</div>
                  {parsing ? (
                    <div style={{textAlign:"center",padding:"14px 0"}}><Ldots/><div style={{fontSize:13,color:C.sub,marginTop:7}}>Reading your report...</div></div>
                  ) : (
                    <div className="upz" onClick={()=>fileRef.current?.click()}>
                      <input ref={fileRef} type="file" accept=".pdf,application/pdf" onChange={e=>handlePDF(e.target.files?.[0])}/>
                      <div style={{fontSize:30,marginBottom:7}}>📊</div>
                      <div style={{fontSize:14,fontWeight:600,marginBottom:3}}>Tap to upload Starfit PDF</div>
                      <div style={{fontSize:13,color:C.sub}}>AI extracts all body composition metrics</div>
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
            <div style={{fontSize:11,color:C.sub,marginBottom:11}}>AI provider · saved to cloud via Supabase</div>

            {/* Status banner */}
            {apiKey ? (
              <div style={{background:"#c8f13510",borderRadius:10,padding:"10px 13px",marginBottom:9,border:"1px solid #c8f13540",display:"flex",alignItems:"center",gap:9}}>
                <span style={{fontSize:20}}>{AI_PROVIDERS[aiProvider]?.icon}</span>
                <div>
                  <div style={{fontSize:13,color:C.acc,fontWeight:600}}>✅ {AI_PROVIDERS[aiProvider]?.name} Active</div>
                  <div style={{fontFamily:"'JetBrains Mono',monospace",fontSize:11,color:C.sub}}>{apiKey.slice(0,8)+"••••••••"+apiKey.slice(-4)}</div>
                </div>
                <span className="chip b" style={{marginLeft:"auto",fontSize:10}}>☁ Cloud</span>
              </div>
            ) : (
              <div style={{background:"#ff4d6d11",borderRadius:10,padding:"10px 13px",marginBottom:9,border:"1px solid #ff4d6d33"}}>
                <div style={{fontSize:13,color:C.red}}>⚠️ No AI key — add one below to activate all AI features</div>
              </div>
            )}

            {/* Provider selector */}
            <div className="card">
              <div className="ct">Choose AI Provider</div>
              <div style={{display:"flex",flexDirection:"column",gap:7}}>
                {Object.entries(AI_PROVIDERS).map(([key, prov]) => (
                  <button key={key} onClick={()=>{setAiProvider(key); setAiModel(prov.defaultModel); setApiInput("");}}
                    style={{background:aiProvider===key ? prov.color+"18" : C.sur, border:"1px solid "+(aiProvider===key ? prov.color+"60" : C.bdr), borderRadius:10, padding:"11px 13px", display:"flex", alignItems:"center", gap:10, cursor:"pointer", textAlign:"left"}}>
                    <span style={{fontSize:24}}>{prov.icon}</span>
                    <div style={{flex:1}}>
                      <div style={{fontSize:14,fontWeight:600,color:aiProvider===key ? prov.color : C.txt}}>{prov.name}</div>
                      <div style={{fontSize:11,color:C.sub}}>{prov.docsUrl}</div>
                    </div>
                    {aiProvider===key && <div style={{width:8,height:8,borderRadius:"50%",background:prov.color,flexShrink:0}}/>}
                  </button>
                ))}
              </div>
            </div>

            {/* Model selector */}
            <div className="card">
              <div className="ct">Model</div>
              <div style={{fontSize:13,color:C.sub,marginBottom:8}}>Pick the model for {AI_PROVIDERS[aiProvider]?.name}</div>
              <div style={{display:"flex",flexDirection:"column",gap:5}}>
                {AI_PROVIDERS[aiProvider]?.models.map(m => (
                  <button key={m} onClick={()=>setAiModel(m)}
                    style={{background:(aiModel||AI_PROVIDERS[aiProvider]?.defaultModel)===m ? C.acc+"18" : C.sur, border:"1px solid "+((aiModel||AI_PROVIDERS[aiProvider]?.defaultModel)===m ? C.acc+"60" : C.bdr), borderRadius:8, padding:"8px 12px", display:"flex", alignItems:"center", justifyContent:"space-between", cursor:"pointer"}}>
                    <span style={{fontFamily:"'JetBrains Mono',monospace",fontSize:13,color:(aiModel||AI_PROVIDERS[aiProvider]?.defaultModel)===m ? C.acc : C.txt}}>{m}</span>
                    {m===AI_PROVIDERS[aiProvider]?.defaultModel && <span className="chip g" style={{fontSize:9}}>recommended</span>}
                  </button>
                ))}
              </div>
            </div>

            {/* API Key input */}
            <div className="card">
              <div className="ct">API Key</div>
              <div style={{fontSize:13,color:C.sub,lineHeight:1.7,marginBottom:10}}>
                Get your free key from <span style={{color:AI_PROVIDERS[aiProvider]?.color}}>{AI_PROVIDERS[aiProvider]?.docsUrl}</span>
                {aiProvider==="gemini" && " → Get API Key (free with Gemini Pro)"}
                {aiProvider==="claude" && " → API Keys → Create Key"}
                {aiProvider==="gpt" && " → API Keys → Create new secret key"}
              </div>
              <div className="cl" style={{marginTop:0}}>Paste your {AI_PROVIDERS[aiProvider]?.name} key</div>
              <input className="inp" type="password" placeholder={AI_PROVIDERS[aiProvider]?.placeholder} value={apiInput} onChange={e=>setApiInput(e.target.value)}/>
              <button className="btn bacc bfull" onClick={async ()=>{
                if (!apiInput.trim()) { showToast("Paste your key first"); return; }
                setApiKey(apiInput.trim());
                await setSetting("ai_key", apiInput.trim());
                await setSetting("ai_provider", aiProvider);
                await setSetting("ai_model", aiModel || AI_PROVIDERS[aiProvider]?.defaultModel);
                showToast("✅ Key saved to cloud!");
              }}>Save to Cloud ☁</button>
              {apiKey && <button className="btn bgh bfull" style={{marginTop:5}} onClick={()=>{setSetting("ai_key","").catch(()=>{}); setApiKey(""); setApiInput(""); showToast("Key removed");}}>Remove Key</button>}
            </div>

            {/* How to get key */}
            <div className="card">
              <div className="ct">How to get your key</div>
              {aiProvider==="gemini" && [["1","Go to aistudio.google.com"],["2","Sign in with your Google account"],["3","Click 'Get API Key' in left menu"],["4","Click 'Create API key'"],["5","Copy and paste above — it's free!"]].map(([n,t])=>(
                <div key={n} style={{display:"flex",gap:9,alignItems:"center",marginBottom:8}}>
                  <div style={{width:22,height:22,borderRadius:"50%",background:"#4285f4",color:"#fff",display:"flex",alignItems:"center",justifyContent:"center",fontWeight:700,fontSize:13,flexShrink:0}}>{n}</div>
                  <div style={{fontSize:13,color:C.txt}}>{t}</div>
                </div>
              ))}
              {aiProvider==="claude" && [["1","Go to console.anthropic.com"],["2","Sign up / log in"],["3","Click 'API Keys' in left menu"],["4","Click 'Create Key'"],["5","Copy and paste above"],["💰","~$0.001 per suggestion (very cheap)"]].map(([n,t])=>(
                <div key={n} style={{display:"flex",gap:9,alignItems:"center",marginBottom:8}}>
                  <div style={{width:22,height:22,borderRadius:"50%",background:"#d97706",color:"#fff",display:"flex",alignItems:"center",justifyContent:"center",fontWeight:700,fontSize:13,flexShrink:0}}>{n}</div>
                  <div style={{fontSize:13,color:C.txt}}>{t}</div>
                </div>
              ))}
              {aiProvider==="gpt" && [["1","Go to platform.openai.com"],["2","Sign up / log in"],["3","Click 'API Keys' in left menu"],["4","Click 'Create new secret key'"],["5","Copy and paste above"],["💰","~$0.002 per suggestion"]].map(([n,t])=>(
                <div key={n} style={{display:"flex",gap:9,alignItems:"center",marginBottom:8}}>
                  <div style={{width:22,height:22,borderRadius:"50%",background:"#10a37f",color:"#fff",display:"flex",alignItems:"center",justifyContent:"center",fontWeight:700,fontSize:13,flexShrink:0}}>{n}</div>
                  <div style={{fontSize:13,color:C.txt}}>{t}</div>
                </div>
              ))}
            </div>

            {/* Features list */}
            <div className="card">
              <div className="ct">AI Features</div>
              {[["⚡","Quick Suggestion","Workout advice based on history + body scan"],["📋","Weekly Plan","Full personalised 7-day programme"],["📊","Scan Analysis","Trend detection across Starfit scans"],["🥗","Nutrition Targets","Macros based on your BMR and goals"],["📉","Plateau Detection","Find stagnating exercises + deload advice"],["🧬","Body Age Analysis","Track biological age + how to reduce it"],["📄","PDF Report","AI-written export of your full progress"]].map(([ic,t,d])=>(
                <div key={t} style={{display:"flex",gap:9,padding:"7px 0",borderBottom:"1px solid "+C.bdr+"40",alignItems:"flex-start"}}>
                  <span style={{fontSize:17}}>{ic}</span>
                  <div style={{flex:1}}>
                    <div style={{fontSize:13,fontWeight:600}}>{t}</div>
                    <div style={{fontSize:11,color:C.sub}}>{d}</div>
                  </div>
                  <span className="chip" style={{fontSize:10,flexShrink:0,background:AI_PROVIDERS[aiProvider]?.color+"18",color:AI_PROVIDERS[aiProvider]?.color}}>{AI_PROVIDERS[aiProvider]?.icon}</span>
                </div>
              ))}
            </div>
          </>
        )}

      </div>

      {/* Camera Modal */}
      {camOpen && (
        <div className="cam-modal" onClick={e=>{if(e.target===e.currentTarget){setCamOpen(false);}}}>
          <div className="cam-box">
            <div className="cam-header">
              <div className="cam-title">📷 Scan Machine</div>
              <button className="cam-close" onClick={()=>setCamOpen(false)}>×</button>
            </div>
            <div className="cam-body">

              {/* Photo preview or trigger */}
              {camPhoto ? (
                <div className="cam-preview">
                  <img src={camPhoto} alt="captured"/>
                </div>
              ) : (
                <label className="cam-trigger">
                  <input ref={cameraRef} type="file" accept="image/*" capture="environment" onChange={handleCameraCapture}/>
                  <div style={{fontSize:36,marginBottom:8}}>📷</div>
                  <div style={{fontSize:15,fontWeight:600,color:"#e8e8f0",marginBottom:4}}>Take a photo of the machine</div>
                  <div style={{fontSize:13,color:"#6a6a8a"}}>AI will identify it automatically</div>
                </label>
              )}

              {/* Detecting state */}
              {camDetecting && (
                <div style={{textAlign:"center",padding:"12px 0"}}>
                  <div className="ldots"><div className="ldot"/><div className="ldot"/><div className="ldot"/></div>
                  <div style={{fontSize:13,color:"#6a6a8a",marginTop:6}}>Analysing machine...</div>
                </div>
              )}

              {/* Detection result */}
              {camResult && !camDetecting && (
                <div className="cam-result">
                  <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:8}}>
                    <div style={{fontSize:13,fontWeight:600,color:"#e8e8f0"}}>AI Detection</div>
                    <span className={"cam-conf-"+(camResult.confidence||"low")} style={{fontSize:11,fontWeight:600,textTransform:"uppercase",letterSpacing:1}}>
                      {camResult.confidence==="high"?"✅ High":camResult.confidence==="medium"?"⚠️ Medium":"❓ Low"} confidence
                    </span>
                  </div>
                  {camResult.description && (
                    <div style={{fontSize:13,color:"#6a6a8a",marginBottom:8,lineHeight:1.5}}>{camResult.description}</div>
                  )}
                  {camResult.muscleGroup && (
                    <div style={{fontSize:11,color:"#4cc9f0",marginBottom:10}}>💪 Targets: {camResult.muscleGroup}</div>
                  )}
                  <div style={{fontSize:13,color:"#6a6a8a",marginBottom:5,letterSpacing:".5px",textTransform:"uppercase"}}>Machine name — edit if needed:</div>
                  <input
                    className="inp"
                    value={camEdit}
                    onChange={e=>setCamEdit(e.target.value)}
                    placeholder="Machine name..."
                    style={{marginBottom:10}}
                  />
                  <div style={{display:"flex",gap:7}}>
                    <button className="btn bacc" style={{flex:1}} onClick={confirmMachine}>
                      ✓ Add This Machine
                    </button>
                    <button className="btn bgh" style={{flex:1}} onClick={()=>{setCamPhoto(null);setCamResult(null);setCamEdit("");}}>
                      Retake
                    </button>
                  </div>
                </div>
              )}

              {/* Try again with different photo */}
              {camPhoto && !camDetecting && !camResult && (
                <button className="btn bgh bfull" onClick={()=>{setCamPhoto(null);setCamResult(null);setCamEdit("");}}>
                  Try Again
                </button>
              )}

              {/* tip */}
              {!camPhoto && !camDetecting && (
                <div style={{fontSize:11,color:"#3a3a5a",textAlign:"center",marginTop:8}}>
                  Works best with the full machine visible · good lighting
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Side Navigation */}
      {navOpen && (
        <>
          <div className="sidenav-overlay" onClick={()=>setNavOpen(false)}/>
          <div className="sidenav">
            <div className="sidenav-logo">
              <div style={{fontFamily:"'Bebas Neue',sans-serif",fontSize:30,letterSpacing:3,color:"#c8f135",lineHeight:1}}>GAINLOG</div>
              <div style={{fontSize:13,color:"#6a6a8a",letterSpacing:1,textTransform:"uppercase",marginTop:2}}>
                {syncing ? "⟳ Syncing..." : dbReady ? "☁ Synced" : "Hypertrophy Tracker"}
              </div>
            </div>
            <div className="sidenav-items">
              {[
                ["workout","🏋️","Log Workout","Track sets, reps & weight"],
                ["cardio","🏃","Cardio","Log cardio + calorie burn"],
                ["ai","🤖","AI Coach","Smart suggestions & plans"],
                ["plan","📋","My Plans","Weekly programmes"],
                ["records","🏆","Personal Records","Your best lifts"],
                ["history","📊","History","All past sessions"],
                ["body","🧬","Body Comp","Starfit scans & trends"],
                ["settings","⚙️","Setup","AI provider & key"],
              ].map(([k,ic,lb,sub])=>(
                <button key={k} className={"navitem"+(tab===k?" active":"")}
                  onClick={()=>{setTab(k);setNavOpen(false);}}>
                  <span className="navicon">{ic}</span>
                  <div>
                    <div className="navlbl">{lb}</div>
                    <div className="navsub">{sub}</div>
                  </div>
                </button>
              ))}
            </div>
            <div className="sidenav-footer">
              <div style={{fontSize:13,color:"#3a3a5a",marginBottom:4}}>
                {latest ? "Body score: "+latest.score+"/100 · "+latest.weight+"lb" : "No body scan yet"}
              </div>
              <div style={{fontSize:13,color:"#3a3a5a"}}>
                {prs.length} PRs tracked · {logs.length} sessions logged
              </div>
            </div>
          </div>
        </>
      )}
      <div className="bnav"/>
    </div>
  );
}
