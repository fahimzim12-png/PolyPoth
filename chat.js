// PolyPoth AI assistant widget. Set WORKER_URL after deploying worker.js (see README).
(function(){
const WORKER_URL="https://YOUR-WORKER.YOUR-SUBDOMAIN.workers.dev";
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
try{const r=await fetch(WORKER_URL,{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({messages:hist.slice(-8)})});
const j=await r.json();const a=j.reply||j.error||"Sorry, something went wrong.";w.textContent=a;hist.push({role:"model",text:a});}
catch(x){w.textContent="Couldn't reach the assistant. Please try again later."}};
})();
