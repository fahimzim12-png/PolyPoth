// PolyPoth AI assistant widget. Set WORKER_URL after deploying worker.js (see README).
(function(){
const GEMINI_KEY="PASTE_YOUR_GEMINI_KEY_HERE"; // direct mode (key is visible to visitors, see README)
const MODEL="gemini-2.5-flash"; // change if Google retires this name
const WORKER_URL=""; // optional: use worker.js instead of the direct key
const KB=`You are the PolyPoth website assistant. Answer ONLY about PolyPoth pavers and the company, using the facts below.
Be concise, friendly and formal. If something is not in the facts, say you don't have that information and suggest contacting the PolyPoth team. Never invent numbers, certifications, test results, prices or customers.
If asked about price, quotes, investment or financials, say these are discussed directly with the team.
FACTS:
- PolyPoth (Bangladesh) turns suitable industrial plastic waste (HDPE and LDPE factory offcuts) into paving blocks. Tagline: "A Paving Block with a Receipt".
- Mix per sq ft: 1.80 kg recycled PE (30%), 4.20 kg sand (70%), 0.03 kg basalt fibre (about 0.5%, for reinforcement).
- Development TARGETS (not yet certified results): compressive strength 20 MPa for light-traffic use; water absorption below 1.5%; UV and temperature durability testing planned. Lab validation (BUET) and BSTI certification are in progress, not completed.
- Suitable for light traffic: pathways, courtyards, driveways.
- Traceability: factory waste-stream assessment, collection and weighing of accepted PE, material identification and batch registration, production and quality-control record, then a QR-linked recovery report. The QR is batch-level or order-level, not on every paver.
- Customers: developers, contractors, commercial property owners, municipalities and public-project contractors; also homeowners.
- The website's sample batch record (PP-0001) is demo data.
- Plan: a Learning Centre for children from waste-picker families is planned for Year 4; gradual expansion to Nepal, India and Bhutan from Year 5. No child takes part in collection or factory work.`;
const css=`#pp-fab{position:fixed;right:18px;bottom:18px;background:var(--g,#1b5e3b);color:#fff;border:0;border-radius:99px;padding:12px 18px;font-size:.95rem;cursor:pointer;z-index:20;box-shadow:0 4px 14px #0003}
#pp-box{position:fixed;right:18px;bottom:72px;width:min(380px,calc(100vw - 36px));height:min(520px,70vh);background:var(--card,#fff);color:var(--ink,#1f2a24);border:1px solid var(--line,#dbe6de);border-radius:14px;display:none;flex-direction:column;z-index:20;box-shadow:0 8px 30px #0003;overflow:hidden}
#pp-box.open{display:flex}#pp-h{background:var(--g,#1b5e3b);color:#fff;padding:12px 14px;font-weight:600}
#pp-m{flex:1;overflow-y:auto;padding:12px;display:flex;flex-direction:column;gap:8px}
.pp-b{padding:8px 12px;border-radius:12px;max-width:88%;white-space:pre-wrap;font-size:.92rem;line-height:1.45}
.pp-u{align-self:flex-end;background:var(--g2,#2e7d5b);color:#fff}.pp-a{align-self:flex-start;background:var(--bg,#f6faf7);border:1px solid var(--line,#dbe6de)}
#pp-f{display:flex;gap:6px;padding:10px;border-top:1px solid var(--line,#dbe6de)}
#pp-i{flex:1;padding:9px;border-radius:8px;border:1px solid var(--line,#dbe6de);background:var(--bg,#fff);color:inherit;font:inherit}
#pp-f button{background:var(--g,#1b5e3b);color:#fff;border:0;border-radius:8px;padding:0 14px;cursor:pointer}`;
const st=document.createElement("style");st.textContent=css;document.head.appendChild(st);
const fab=document.createElement("button");fab.id="pp-fab";fab.textContent="Ask about PolyPoth";
const box=document.createElement("div");box.id="pp-box";
box.innerHTML='<div id="pp-h">PolyPoth Assistant</div><div id="pp-m"></div><form id="pp-f"><input id="pp-i" maxlength="400" placeholder="Ask about our pavers…" autocomplete="off"><button>Send</button></form>';
document.body.append(fab,box);
const m=box.querySelector("#pp-m"),f=box.querySelector("#pp-f"),inp=box.querySelector("#pp-i");
let hist=[];
function add(t,c){const d=document.createElement("div");d.className="pp-b "+c;d.textContent=t;m.appendChild(d);m.scrollTop=m.scrollHeight;return d}
add("Hi! Ask me anything about PolyPoth pavers: materials, strength targets, traceability or the QR record.","pp-a");
fab.onclick=()=>{box.classList.toggle("open");if(box.classList.contains("open"))inp.focus()};
f.onsubmit=async e=>{e.preventDefault();const q=inp.value.trim();if(!q)return;inp.value="";
add(q,"pp-u");hist.push({role:"user",text:q});const w=add("Thinking…","pp-a");
try{let a;
if(WORKER_URL){const r=await fetch(WORKER_URL,{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({messages:hist.slice(-8)})});const j=await r.json();a=j.reply||j.error;}
else{if(GEMINI_KEY.startsWith("PASTE"))throw new Error("add your key in chat.js");
const r=await fetch("https://generativelanguage.googleapis.com/v1beta/models/"+MODEL+":generateContent",{method:"POST",headers:{"Content-Type":"application/json","x-goog-api-key":GEMINI_KEY},
body:JSON.stringify({systemInstruction:{parts:[{text:KB}]},contents:hist.slice(-8).map(x=>({role:x.role,parts:[{text:x.text}]})),generationConfig:{maxOutputTokens:400,temperature:0.3}})});
const j=await r.json();if(!r.ok)throw new Error((j.error&&j.error.message)||r.status);
a=((j.candidates&&j.candidates[0]&&j.candidates[0].content&&j.candidates[0].content.parts)||[]).map(p=>p.text).join("");}
a=a||"Sorry, I could not find an answer.";w.textContent=a;hist.push({role:"model",text:a});}
catch(x){w.textContent="Could not reach the assistant ("+x.message+").";hist.pop()}};
})();
