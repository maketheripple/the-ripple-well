/* THE RIPPLE WELL — HOME BASE CLEAN BASELINE
   WebGL/water overlay removed. Approved Impact Ripples remain. */
(() => {
  "use strict";
  const SUPABASE_URL = "https://vazgkkrrjgoowwywamot.supabase.co";
  const SUPABASE_KEY = "sb_publishable_gf0D7JmbBlm6jR07qYkIQ_YZN301F-";
  const layer = document.getElementById("impact-ripples-layer");
  if (!layer) return;

  function hash(value) { let h=2166136261; for (let i=0;i<value.length;i++) h=Math.imul(h^value.charCodeAt(i),16777619); return h>>>0; }
  function rand(id, min, max) { return min + (hash(String(id)) % 10000) / 10000 * (max-min); }
  function sizeClass(size) {
    switch(String(size||"medium").toLowerCase()) {
      case "small": return "small"; case "large": return "large"; case "x-large": case "extra-large": return "extra-large"; default: return "medium";
    }
  }
  function addRipple(data, index) {
    const el=document.createElement("div");
    el.className=`impact-ripple impact-size-${sizeClass(data.size)}`;
    el.style.left=`${rand(data.id+"x",12,88)}%`;
    el.style.top=`${rand(data.id+"y",18,88)}%`;
    el.style.setProperty("--rotation",`${rand(data.id+"r",-28,28)}deg`);
    el.style.setProperty("--secondary-rotation",`${rand(data.id+"s",-18,18)}deg`);
    el.style.setProperty("--float-time",`${rand(data.id+"f",13,21)}s`);
    el.style.setProperty("--pulse-time",`${rand(data.id+"p",5.5,8.5)}s`);
    el.title = data.name ? data.name : "Impact Ripple";
    el.addEventListener("click",()=>{
      const message=(data.message||"").replace(/</g,"&lt;").replace(/>/g,"&gt;");
      const name=(data.name||"Anonymous").replace(/</g,"&lt;").replace(/>/g,"&gt;");
      const existing=document.getElementById("impact-ripple-preview"); if(existing) existing.remove();
      const box=document.createElement("div"); box.id="impact-ripple-preview";
      box.innerHTML=`<div class="irp-box"><button class="irp-close" aria-label="Close">×</button><div class="irp-label">IMPACT RIPPLE</div><p>“${message}”</p><small>${name}</small></div>`;
      document.body.appendChild(box); box.querySelector(".irp-close").onclick=()=>box.remove(); box.onclick=e=>{if(e.target===box)box.remove()};
    });
    layer.appendChild(el);
  }
  const style=document.createElement("style");
  style.textContent=`.impact-size-small{width:90px;height:45px}.impact-size-medium{width:130px;height:65px}.impact-size-large{width:175px;height:88px}.impact-size-extra-large{width:230px;height:115px}#impact-ripple-preview{position:fixed;inset:0;z-index:3000;display:grid;place-items:center;background:rgba(0,5,10,.68);backdrop-filter:blur(6px)}.irp-box{position:relative;width:min(620px,86vw);padding:42px;border:1px solid rgba(91,226,249,.45);background:rgba(2,13,22,.92);box-shadow:0 0 45px rgba(46,198,229,.16);text-align:center;color:#eefaff}.irp-label{font-size:12px;letter-spacing:.25em;opacity:.7}.irp-box p{font-size:22px;line-height:1.55}.irp-box small{opacity:.7}.irp-close{position:absolute;right:14px;top:10px;border:0;background:none;color:#fff;font-size:28px;cursor:pointer}`;
  document.head.appendChild(style);
  fetch(`${SUPABASE_URL}/rest/v1/ripple_submissions?select=id,created_at,message,name,region,country,status,size&status=eq.approved&order=created_at.asc`,{headers:{apikey:SUPABASE_KEY,Authorization:`Bearer ${SUPABASE_KEY}`}})
    .then(r=>r.ok?r.json():Promise.reject(new Error(`Supabase ${r.status}`)))
    .then(rows=>rows.forEach(addRipple))
    .catch(err=>console.warn("Impact Ripples could not be loaded:",err));
})();
