// PolyPoth assistant: Gemini (if key set) with automatic fallback to a built-in FAQ that always works.
(function(){
const CFG=window.PP_CONFIG||{};
const KB=`You are the PolyPoth website assistant. Answer ONLY about PolyPoth pavers and the company, using these facts. Be concise, friendly and formal. If something is not covered, say you do not have that information and suggest contacting the PolyPoth team. Never invent numbers, certifications, test results, prices or customers. For price, quotes, investment or financials, say these are discussed directly with the team. Reply in the language the user writes in.
FACTS: PolyPoth (Bangladesh) turns suitable industrial plastic waste (HDPE and LDPE factory offcuts) into paving blocks. Tagline: "A Paving Block with a Receipt". Mix per sq ft: 1.80 kg recycled PE (30%), 4.20 kg sand (70%), 0.03 kg basalt fibre (about 0.5%, reinforcement). Development TARGETS, not yet certified results: compressive strength 20 MPa for light-traffic use; water absorption below 1.5%; UV and temperature durability testing planned. BUET lab validation and BSTI certification are in progress, not completed. Suitable for light traffic: pathways, courtyards, driveways. Traceability: factory waste-stream assessment, collection and weighing of accepted PE, material identification and batch registration, production and quality-control record, then a QR-linked recovery report. The QR is batch-level or order-level, not on every paver. Customers: developers, contractors, commercial property owners, municipalities, public-project contractors, also homeowners. The website sample batch PP-0001 is demo data. Plan: Learning Centre for children of waste-picker families in Year 4 (no child takes part in collection or factory work); gradual expansion to Nepal, India and Bhutan from Year 5.`;
const FAQ=[
[["strength","mpa","strong","durab","bearing","load","shokti","kotha"],"Our development target is a compressive strength of 20 MPa for light-traffic use (pathways, courtyards, driveways). This is a target; independent lab validation is in progress."],
[["absorb","water","rain","wet","pani"],"The water absorption target is below 1.5%. UV and temperature durability testing is also planned. These are targets pending lab validation."],
[["made","material","mix","composition","ingredient","sand","basalt","fibre","fiber","ki diye"],"Per sq ft: 1.80 kg recycled PE (HDPE and LDPE, 30%), 4.20 kg sand (70%) and 0.03 kg basalt fibre (about 0.5%) for reinforcement."],
[["qr","scan","trace","batch","receipt","record","source"],"Every batch gets a QR-linked recovery record: factory assessment, weighing of accepted plastic, batch registration, production and quality-control record. Scanning shows where the plastic came from. The QR is batch-level or order-level, not on each paver."],
[["certif","bsti","iso","standard","test","lab","buet","approved"],"BUET lab validation and BSTI certification are in progress and not yet completed. We only state development targets until results are available."],
[["use","where","suitable","driveway","courtyard","path","traffic","road","application","truck","vehicle"],"PolyPoth pavers are designed for light-traffic applications: pathways, courtyards and driveways."],
[["price","cost","quote","rate","buy","order","taka","dam","koto"],"Pricing and quotes are discussed directly with the PolyPoth team. Please use the contact details on this site."],
[["plastic","waste","recycl","environment","sustain","circular","pollution"],"PolyPoth recovers suitable industrial plastic waste (HDPE and LDPE factory offcuts) that would otherwise be hard to recover, and turns it into paving blocks, with a documented record of where it came from."],
[["school","learning","child","children","education","community"],"We plan a Learning Centre for children from waste-picker families in Year 4. No child takes part in plastic collection or factory work."],
[["nepal","india","bhutan","expand","country","global"],"We plan gradual international expansion from Year 5, starting with Nepal, then India and Bhutan."],
[["customer","who","developer","contractor","municipal","government","homeowner"],"Our main customers are developers, contractors, commercial property owners, municipalities and public-project contractors. Homeowners and plot owners are a secondary market."],
[["what is","polypoth","about","company","tagline"],"PolyPoth (Bangladesh) turns industrial plastic waste into durable paving blocks. Our tagline: \"A Paving Block with a Receipt\", because every batch comes with a QR-linked recovery record."]];
function localAnswer(q){q=q.toLowerCase();let best=null,sc=0;
for(const [k,a] of FAQ){let s=0;for(const w of k)if(q.includes(w))s++;if(s>sc){sc=s;best=a}}
return best||"I don't have that information yet. I can help with materials, strength targets, uses, traceability and the QR record, or you can contact the PolyPoth team."}
window.__ppLocal=localAnswer;
async function gemini(hist){
if(!CFG.GEMINI_KEY)throw new Error("no key set");
let err;
for(const m of (CFG.MODELS||["gemini-2.5-flash"])){
try{const r=await fetch("https://generativelanguage.googleapis.com/v1beta/models/"+m+":generateContent",{method:"POST",headers:{"Content-Type":"application/json","x-goog-api-key":CFG.GEMINI_KEY},
body:JSON.stringify({systemInstruction:{parts:[{text:KB}]},contents:hist.slice(-8).map(x=>({role:x.role,parts:[{text:x.text}]})),generationConfig:{maxOutputTokens:500,temperature:0.3}})});
const j=await r.json();
if(!r.ok){err=new Error((j.error&&j.error.message)||r.status);if(r.status===404)continue;throw err}
const t=((j.candidates&&j.candidates[0]&&j.candidates[0].content&&j.candidates[0].content.parts)||[]).map(p=>p.text).join("");
if(t)return t;err=new Error("empty reply")}catch(e){err=e;if(!/not found|404/i.test(e.message))throw e}}
throw err||new Error("failed")}
const css=`#pp-fab{position:fixed;right:18px;bottom:18px;background:#1b5e3b;color:#fff;border:0;border-radius:99px;padding:12px 18px;font-size:.95rem;cursor:pointer;z-index:20;box-shadow:0 4px 14px #0003}
#pp-box{position:fixed;right:18px;bottom:72px;width:min(380px,calc(100vw - 36px));height:min(540px,72vh);background:var(--card,#fff);color:var(--ink,#1f2a24);border:1px solid var(--line,#dbe6de);border-radius:14px;display:none;flex-direction:column;z-index:20;box-shadow:0 8px 30px #0003;overflow:hidden}
#pp-box.open{display:flex}#pp-h{background:#1b5e3b;color:#fff;padding:10px 14px;font-weight:600}#pp-s{font-weight:400;font-size:.75rem;opacity:.85}
#pp-m{flex:1;overflow-y:auto;padding:12px;display:flex;flex-direction:column;gap:8px}
.pp-b{padding:8px 12px;border-radius:12px;max-width:88%;white-space:pre-wrap;font-size:.92rem;line-height:1.45}
.pp-u{align-self:flex-end;background:#2e7d5b;color:#fff}.pp-a{align-self:flex-start;background:var(--bg,#f6faf7);border:1px solid var(--line,#dbe6de)}
#pp-c{display:flex;flex-wrap:wrap;gap:6px;padding:0 12px 8px}#pp-c button{font-size:.78rem;border:1px solid var(--line,#dbe6de);background:var(--card,#fff);color:inherit;border-radius:99px;padding:4px 10px;cursor:pointer}
#pp-f{display:flex;gap:6px;padding:10px;border-top:1px solid var(--line,#dbe6de)}
#pp-i{flex:1;padding:9px;border-radius:8px;border:1px solid var(--line,#dbe6de);background:var(--bg,#fff);color:inherit;font:inherit}
#pp-f button{background:#1b5e3b;color:#fff;border:0;border-radius:8px;padding:0 14px;cursor:pointer}`;
const st=document.createElement("style");st.textContent=css;document.head.appendChild(st);
const fab=document.createElement("button");fab.id="pp-fab";fab.textContent="Ask about PolyPoth";
const box=document.createElement("div");box.id="pp-box";
box.innerHTML='<div id="pp-h">PolyPoth Assistant<div id="pp-s"></div></div><div id="pp-m"></div><div id="pp-c"></div><form id="pp-f"><input id="pp-i" maxlength="400" placeholder="Ask about our pavers…" autocomplete="off"><button>Send</button></form>';
document.body.append(fab,box);
const m=box.querySelector("#pp-m"),f=box.querySelector("#pp-f"),inp=box.querySelector("#pp-i"),sEl=box.querySelector("#pp-s"),ch=box.querySelector("#pp-c");
sEl.textContent=CFG.GEMINI_KEY?"AI mode (Gemini)":"Quick answers mode";
let hist=[];
function add(t,c){const d=document.createElement("div");d.className="pp-b "+c;d.textContent=t;m.appendChild(d);m.scrollTop=m.scrollHeight;return d}
add("Hi! Ask me anything about PolyPoth pavers: materials, strength targets, uses or the QR record.","pp-a");
async function ask(q){add(q,"pp-u");hist.push({role:"user",text:q});const w=add("Thinking…","pp-a");let a;
try{a=await gemini(hist);sEl.textContent="AI mode (Gemini)"}
catch(e){console.warn("Gemini unavailable:",e.message);a=localAnswer(q);sEl.textContent="Quick answers mode"+(CFG.GEMINI_KEY?" (AI offline: "+String(e.message).slice(0,60)+")":"")}
w.textContent=a;hist.push({role:"model",text:a});m.scrollTop=m.scrollHeight}
["What is it made of?","What is the strength target?","How does the QR record work?","Where can I use it?"].forEach(t=>{const b=document.createElement("button");b.type="button";b.textContent=t;b.onclick=()=>ask(t);ch.appendChild(b)});
fab.onclick=()=>{box.classList.toggle("open");if(box.classList.contains("open"))inp.focus()};
f.onsubmit=e=>{e.preventDefault();const q=inp.value.trim();if(!q)return;inp.value="";ask(q)};
})();
