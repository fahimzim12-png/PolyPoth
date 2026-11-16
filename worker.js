// Cloudflare Worker: keeps your Gemini API key secret. Do NOT put the key in any website file.
// Settings > Variables: GEMINI_API_KEY (secret), ALLOWED_ORIGIN (e.g. https://USERNAME.github.io), optional GEMINI_MODEL.
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
export default{async fetch(req,env){
const o=env.ALLOWED_ORIGIN||"*",h={"Access-Control-Allow-Origin":o,"Access-Control-Allow-Headers":"Content-Type","Access-Control-Allow-Methods":"POST,OPTIONS","Content-Type":"application/json"};
if(req.method==="OPTIONS")return new Response(null,{headers:h});
if(req.method!=="POST")return new Response(JSON.stringify({error:"POST only"}),{status:405,headers:h});
try{const {messages}=await req.json();
const contents=(messages||[]).slice(-8).map(x=>({role:x.role==="model"?"model":"user",parts:[{text:String(x.text||"").slice(0,400)}]}));
if(!contents.length||contents[contents.length-1].role!=="user")return new Response(JSON.stringify({error:"Bad request"}),{status:400,headers:h});
const model=env.GEMINI_MODEL||"gemini-2.5-flash";
const r=await fetch(`https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent`,{method:"POST",headers:{"Content-Type":"application/json","x-goog-api-key":env.GEMINI_API_KEY},
body:JSON.stringify({systemInstruction:{parts:[{text:KB}]},contents,generationConfig:{maxOutputTokens:400,temperature:0.3}})});
const j=await r.json();const reply=j.candidates?.[0]?.content?.parts?.map(p=>p.text).join("")||"";
return new Response(JSON.stringify(reply?{reply}:{error:"No answer available right now."}),{headers:h});
}catch(e){return new Response(JSON.stringify({error:"Server error"}),{status:500,headers:h})}}};
