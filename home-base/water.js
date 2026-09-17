/* THE RIPPLE WELL — HOME BASE
   Make the Ripple submission form + Impact/Super-Impact Ripples.
   Super-Impact uses type = "super-impact". Contribution amounts remain private. */
(() => {
  "use strict";

  const SUPABASE_URL = "https://vazgkkrrjgoowwywamot.supabase.co";
  const SUPABASE_KEY = "sb_publishable_gf0D7JmbBlm6jR07qYkIQ_YZN301F-";
  const layer = document.getElementById("impact-ripples-layer");

  /* ---------------------------------------------------------
     IMPACT + SUPER-IMPACT RIPPLES
  --------------------------------------------------------- */
  function hash(value) {
    let h = 2166136261;
    for (let i = 0; i < value.length; i++) {
      h = Math.imul(h ^ value.charCodeAt(i), 16777619);
    }
    return h >>> 0;
  }

  function rand(id, min, max) {
    return min + (hash(String(id)) % 10000) / 10000 * (max - min);
  }

  function sizeClass(size) {
    switch (String(size || "medium").toLowerCase()) {
      case "small": return "small";
      case "large": return "large";
      case "x-large":
      case "extra-large": return "extra-large";
      default: return "medium";
    }
  }

  function escapeRipple(value) {
    return String(value || "")
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;")
      .replace(/'/g, "&#039;");
  }

  function showRipplePreview(data, isSuperImpact) {
    const existing = document.getElementById("impact-ripple-preview");
    if (existing) existing.remove();

    const box = document.createElement("div");
    box.id = "impact-ripple-preview";

    if (isSuperImpact) {
      const organization = escapeRipple(data.organization_name || "Supporting Organization");
      const address = escapeRipple(data.organization_address || "");
      const logo = String(data.organization_logo || "").trim();

      box.innerHTML = `
        <div class="irp-box super-irp-box">
          <button class="irp-close" aria-label="Close">×</button>
          <div class="super-irp-kicker">SUPER-IMPACT RIPPLE</div>
          ${logo ? `<img class="super-irp-logo" src="${escapeRipple(logo)}" alt="${organization}">` : ""}
          <h3 class="super-irp-organization">${organization}</h3>
          ${address ? `<div class="super-irp-address">${address}</div>` : ""}
          <div class="super-irp-id">${escapeRipple(data.sir_id || "SUPER-IMPACT")}</div>
          <p class="super-irp-message">“${escapeRipple(data.message || "A ripple of positive impact.")}”</p>
        </div>
      `;
    } else {
      const message = escapeRipple(data.message || "");
      const name = escapeRipple(data.name || "Anonymous");

      box.innerHTML = `
        <div class="irp-box">
          <button class="irp-close" aria-label="Close">×</button>
          <div class="irp-label">IMPACT RIPPLE</div>
          <p>“${message}”</p>
          <small>${name}</small>
        </div>
      `;
    }

    document.body.appendChild(box);
    box.querySelector(".irp-close").onclick = () => box.remove();
    box.onclick = event => {
      if (event.target === box) box.remove();
    };
  }

  function addImpactRipple(data) {
    const el = document.createElement("div");
    el.className = `impact-ripple impact-size-${sizeClass(data.size)}`;
    el.style.left = `${rand(data.id + "x", 12, 88)}%`;
    el.style.top = `${rand(data.id + "y", 18, 88)}%`;
    el.style.setProperty("--rotation", `${rand(data.id + "r", -28, 28)}deg`);
    el.style.setProperty("--secondary-rotation", `${rand(data.id + "s", -18, 18)}deg`);
    el.style.setProperty("--float-time", `${rand(data.id + "f", 13, 21)}s`);
    el.style.setProperty("--pulse-time", `${rand(data.id + "p", 5.5, 8.5)}s`);
    el.title = data.name ? data.name : "Impact Ripple";

    el.addEventListener("click", () => showRipplePreview(data, false));

    if (layer) layer.appendChild(el);
  }

  function addSuperImpactRipple(data) {
    const el = document.createElement("div");
    el.className = "impact-ripple super-impact-ripple";

    el.style.left = `${rand(data.id + "sx", 18, 82)}%`;
    el.style.top = `${rand(data.id + "sy", 20, 84)}%`;
    el.style.setProperty("--rotation", `${rand(data.id + "sr", -18, 18)}deg`);
    el.style.setProperty("--super-float-time", `${rand(data.id + "sf", 18, 27)}s`);
    el.style.setProperty("--super-pulse-time", `${rand(data.id + "sp", 100, 120)}s`);

    el.title = data.organization_name
      ? `Super-Impact Ripple — ${data.organization_name}`
      : "Super-Impact Ripple";

    const logo = String(data.organization_logo || "").trim();

    if (logo) {
      const img = document.createElement("img");
      img.className = "super-impact-logo";
      img.src = logo;
      img.alt = data.organization_name
        ? `${data.organization_name} logo`
        : "Supporting organization logo";
      img.loading = "lazy";
      img.addEventListener("error", () => img.remove());
      el.appendChild(img);
    }

    el.addEventListener("click", () => showRipplePreview(data, true));

    if (layer) layer.appendChild(el);
  }

  /* ---------------------------------------------------------
     MAKE THE RIPPLE FORM
  --------------------------------------------------------- */
  function escapeHtml(value) {
    return String(value || "")
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;")
      .replace(/'/g, "&#039;");
  }

  function createMakeRippleModal() {
    if (document.getElementById("make-ripple-modal")) return;

    const modal = document.createElement("div");
    modal.id = "make-ripple-modal";
    modal.setAttribute("aria-hidden", "true");
    modal.innerHTML = `
      <div class="make-ripple-box" role="dialog" aria-modal="true" aria-labelledby="make-ripple-title">
        <button class="make-ripple-close" type="button" aria-label="Close Make the Ripple form">×</button>
        <div class="make-ripple-kicker">MAKE THE RIPPLE</div>
        <h2 id="make-ripple-title">Leave a Message For the Well</h2>
        <p class="make-ripple-intro">Share a message of hope, encouragement, kindness, or support. Your ripple may become part of the Ripple Well.</p>

        <form id="make-ripple-form">
          <label for="ripple-message">Your Message <span>*</span></label>
          <textarea id="ripple-message" name="message" rows="6" maxlength="1000" required placeholder="Write your message here..."></textarea>

          <label for="ripple-name">Your Name <small>(optional)</small></label>
          <input id="ripple-name" name="name" type="text" maxlength="120" placeholder="Anonymous">

          <label for="ripple-region">Province / State <small>(optional)</small></label>
          <input id="ripple-region" name="region" type="text" maxlength="100" placeholder="Ontario">

          <p class="make-ripple-note">Messages are reviewed before they appear in the Ripple Well.</p>

          <div class="make-ripple-actions">
            <button class="make-ripple-cancel" type="button">Cancel</button>
            <button class="make-ripple-submit" type="submit">Submit My Ripple</button>
          </div>
          <div id="make-ripple-status" class="make-ripple-status" role="status" aria-live="polite"></div>
        </form>
      </div>
    `;

    document.body.appendChild(modal);

    const close = () => {
      modal.classList.remove("open");
      modal.setAttribute("aria-hidden", "true");
      document.body.style.overflow = "";
    };

    const open = () => {
      modal.classList.add("open");
      modal.setAttribute("aria-hidden", "false");
      document.body.style.overflow = "hidden";
      window.setTimeout(() => document.getElementById("ripple-message")?.focus(), 120);
    };

    modal.querySelector(".make-ripple-close").addEventListener("click", close);
    modal.querySelector(".make-ripple-cancel").addEventListener("click", close);
    modal.addEventListener("click", event => {
      if (event.target === modal) close();
    });

    document.addEventListener("keydown", event => {
      if (event.key === "Escape" && modal.classList.contains("open")) close();
    });

    const form = document.getElementById("make-ripple-form");
    const status = document.getElementById("make-ripple-status");
    const submitButton = form.querySelector(".make-ripple-submit");

    form.addEventListener("submit", async event => {
      event.preventDefault();

      const message = document.getElementById("ripple-message").value.trim();
      const name = document.getElementById("ripple-name").value.trim();
      const region = document.getElementById("ripple-region").value.trim();

      if (!message) return;

      submitButton.disabled = true;
      status.className = "make-ripple-status is-loading";
      status.textContent = "Sending your ripple…";

      try {
        const response = await fetch(`${SUPABASE_URL}/rest/v1/ripple_submissions`, {
          method: "POST",
          headers: {
            apikey: SUPABASE_KEY,
            Authorization: `Bearer ${SUPABASE_KEY}`,
            "Content-Type": "application/json",
            Prefer: "return=minimal"
          },
          body: JSON.stringify({
            message,
            name: name || null,
            region: region || null,
            status: "pending"
          })
        });

        if (!response.ok) {
          let detail = `Supabase ${response.status}`;
          try {
            const errorData = await response.json();
            if (errorData?.message) detail += `: ${errorData.message}`;
          } catch (_) {}
          throw new Error(detail);
        }

        form.reset();
        status.className = "make-ripple-status is-success";
        status.textContent = "Thank you for making a ripple. Your message has been submitted for review.";
      } catch (error) {
        console.warn("Make the Ripple submission failed:", error);
        status.className = "make-ripple-status is-error";
        status.textContent = "We couldn't submit your ripple right now. Please try again in a moment.";
      } finally {
        submitButton.disabled = false;
      }
    });

    return { open, close };
  }

  const style = document.createElement("style");
  style.textContent = `
    .impact-size-small{width:90px;height:45px}
    .impact-size-medium{width:130px;height:65px}
    .impact-size-large{width:175px;height:88px}
    .impact-size-extra-large{width:230px;height:115px}

    /* SUPER-IMPACT RIPPLES */
    .super-impact-ripple{
      width:320px;
      height:160px;
      position:absolute;
      transform:translate(-50%,-50%) rotate(var(--rotation));
      border:2px solid rgba(217,190,101,.9);
      border-radius:50%;
      background:radial-gradient(ellipse at center,rgba(55,213,241,.10) 0%,rgba(55,213,241,.035) 38%,transparent 69%);
      box-shadow:0 0 8px rgba(217,190,101,.75),0 0 22px rgba(217,190,101,.38),0 0 42px rgba(47,207,237,.24),inset 0 0 18px rgba(217,190,101,.18);
      opacity:.86;
      cursor:pointer;
      animation:superRippleFloat var(--super-float-time) ease-in-out infinite,superRipplePulse var(--super-pulse-time) ease-in-out infinite;
    }

    .super-impact-ripple::before,
    .super-impact-ripple::after{
      content:"";
      position:absolute;
      border-radius:50%;
      pointer-events:none;
    }

    .super-impact-ripple::before{
      inset:9px 18px;
      border:1px solid rgba(81,224,247,.55);
    }

    .super-impact-ripple::after{
      inset:24px 38px;
      border:1px solid rgba(217,190,101,.36);
    }

    .super-impact-logo{
      position:absolute;
      left:50%;
      top:50%;
      width:25%;
      height:25%;
      object-fit:contain;
      transform:translate(-50%,-50%);
      filter:drop-shadow(0 0 6px rgba(255,255,255,.65)) drop-shadow(0 0 13px rgba(217,190,101,.55));
      pointer-events:none;
      z-index:2;
    }

    @keyframes superRippleFloat{
      0%,100%{transform:translate(-50%,-50%) rotate(var(--rotation))}
      50%{transform:translate(-50%,-54%) rotate(var(--rotation))}
    }

    @keyframes superRipplePulse{
      0%,88%{box-shadow:0 0 8px rgba(217,190,101,.75),0 0 22px rgba(217,190,101,.38),0 0 42px rgba(47,207,237,.24),inset 0 0 18px rgba(217,190,101,.18)}
      94%{box-shadow:0 0 15px rgba(217,190,101,.95),0 0 38px rgba(217,190,101,.62),0 0 72px rgba(47,207,237,.48),inset 0 0 28px rgba(217,190,101,.30)}
      100%{box-shadow:0 0 8px rgba(217,190,101,.75),0 0 22px rgba(217,190,101,.38),0 0 42px rgba(47,207,237,.24),inset 0 0 18px rgba(217,190,101,.18)}
    }

    #impact-ripple-preview{position:fixed;inset:0;z-index:3000;display:grid;place-items:center;background:rgba(0,5,10,.68);backdrop-filter:blur(6px)}
    .irp-box{position:relative;width:min(620px,86vw);padding:42px;border:1px solid rgba(91,226,249,.45);background:rgba(2,13,22,.92);box-shadow:0 0 45px rgba(46,198,229,.16);text-align:center;color:#eefaff}
    .irp-label{font-size:12px;letter-spacing:.25em;opacity:.7}
    .irp-box p{font-size:22px;line-height:1.55}
    .irp-box small{opacity:.7}
    .irp-close{position:absolute;right:14px;top:10px;border:0;background:none;color:#fff;font-size:28px;cursor:pointer}

    .super-irp-box{
      border-color:rgba(217,190,101,.65);
      box-shadow:0 0 45px rgba(217,190,101,.16),0 0 75px rgba(46,198,229,.10);
    }

    .super-irp-kicker{
      font-size:12px;
      letter-spacing:.28em;
      color:#d9be65;
      margin-bottom:20px;
    }

    .super-irp-logo{
      display:block;
      width:min(150px,34vw);
      height:90px;
      object-fit:contain;
      margin:0 auto 16px;
      filter:drop-shadow(0 0 8px rgba(255,255,255,.45)) drop-shadow(0 0 18px rgba(217,190,101,.35));
    }

    .super-irp-organization{
      margin:0;
      font-size:27px;
      font-weight:400;
      letter-spacing:.06em;
      color:#f2df9a;
    }

    .super-irp-address{
      margin-top:8px;
      color:rgba(238,250,255,.58);
      font-size:13px;
      line-height:1.5;
    }

    .super-irp-id{
      margin-top:14px;
      color:rgba(217,190,101,.72);
      font-size:11px;
      letter-spacing:.18em;
    }

    .super-irp-message{
      margin-top:26px;
    }

    #make-ripple-modal{position:fixed;inset:0;z-index:2900;display:flex;align-items:center;justify-content:center;padding:30px;background:rgba(0,5,12,.78);backdrop-filter:blur(10px);opacity:0;visibility:hidden;pointer-events:none;transition:opacity .3s ease,visibility .3s ease;overflow-y:auto}
    #make-ripple-modal.open{opacity:1;visibility:visible;pointer-events:auto}
    .make-ripple-box{position:relative;width:min(680px,92vw);max-height:calc(100vh - 60px);overflow-y:auto;padding:48px 48px 42px;border:1px solid rgba(91,226,249,.38);border-radius:14px;background:linear-gradient(145deg,rgba(3,19,30,.98),rgba(1,9,17,.98));box-shadow:0 0 60px rgba(46,198,229,.14),inset 0 0 40px rgba(38,163,190,.04);color:#eefaff}
    .make-ripple-close{position:absolute;right:18px;top:14px;width:40px;height:40px;border:1px solid rgba(110,225,246,.35);border-radius:50%;background:rgba(2,15,25,.45);color:#eefaff;font:28px/1 Arial,sans-serif;cursor:pointer}
    .make-ripple-close:hover{border-color:#63e6ff;box-shadow:0 0 16px rgba(70,224,250,.28)}
    .make-ripple-kicker{text-align:center;font-size:11px;letter-spacing:.34em;color:#9cebf8;opacity:.75;margin-bottom:12px}
    .make-ripple-box h2{margin:0;text-align:center;font-size:clamp(28px,4vw,42px);font-weight:400;letter-spacing:.08em;color:#eefaff;text-shadow:0 0 18px rgba(92,218,255,.24)}
    .make-ripple-intro{max-width:560px;margin:20px auto 32px;text-align:center;font-size:17px;line-height:1.7;color:rgba(238,250,255,.78)}
    #make-ripple-form{display:flex;flex-direction:column;gap:12px}
    #make-ripple-form label{margin-top:8px;font-size:13px;letter-spacing:.13em;text-transform:uppercase;color:#b9a76f}
    #make-ripple-form label span{color:#9cebf8}
    #make-ripple-form label small{font-size:11px;letter-spacing:.04em;text-transform:none;color:rgba(238,250,255,.5)}
    #make-ripple-form textarea,#make-ripple-form input{width:100%;border:1px solid rgba(125,215,235,.25);border-radius:7px;background:rgba(0,8,15,.65);color:#eefaff;padding:14px 15px;font:16px/1.5 Georgia,"Times New Roman",serif;outline:none;transition:.2s ease}
    #make-ripple-form textarea{resize:vertical;min-height:145px}
    #make-ripple-form textarea:focus,#make-ripple-form input:focus{border-color:rgba(99,230,255,.75);box-shadow:0 0 16px rgba(70,224,250,.12)}
    #make-ripple-form textarea::placeholder,#make-ripple-form input::placeholder{color:rgba(238,250,255,.35)}
    .make-ripple-note{margin:8px 0 8px;text-align:center;font-size:13px;line-height:1.5;color:rgba(238,250,255,.48)}
    .make-ripple-actions{display:flex;justify-content:center;gap:14px;margin-top:10px}
    .make-ripple-actions button{padding:12px 22px;border-radius:25px;cursor:pointer;letter-spacing:.1em;text-transform:uppercase;font-size:12px;transition:.2s ease}
    .make-ripple-cancel{border:1px solid rgba(180,220,230,.25);background:rgba(2,15,25,.4);color:rgba(238,250,255,.72)}
    .make-ripple-cancel:hover{border-color:rgba(180,220,230,.5);color:#eefaff}
    .make-ripple-submit{border:1px solid rgba(82,229,255,.85);background:rgba(8,55,68,.55);color:#eefaff;box-shadow:0 0 18px rgba(50,211,243,.1)}
    .make-ripple-submit:hover:not(:disabled){background:rgba(16,75,88,.7);box-shadow:0 0 24px rgba(50,211,243,.24)}
    .make-ripple-submit:disabled{opacity:.55;cursor:wait}
    .make-ripple-status{min-height:22px;margin-top:10px;text-align:center;font-size:14px;line-height:1.5}
    .make-ripple-status.is-loading{color:rgba(238,250,255,.62)}
    .make-ripple-status.is-success{color:#b9e9b0}
    .make-ripple-status.is-error{color:#ffb5a8}

    @media(max-width:760px){
      #make-ripple-modal{padding:15px}
      .make-ripple-box{width:96vw;max-height:calc(100vh - 30px);padding:42px 22px 28px;border-radius:10px}
      .make-ripple-intro{font-size:15px;margin-bottom:24px}
      .make-ripple-actions{flex-direction:column-reverse}
      .make-ripple-actions button{width:100%}
    }
  `;
  document.head.appendChild(style);

  const makeRippleButton = document.getElementById("make-ripple-button");
  const makeRippleModal = createMakeRippleModal();
  if (makeRippleButton && makeRippleModal) {
    makeRippleButton.addEventListener("click", makeRippleModal.open);
  }

  /* ---------------------------------------------------------
     LOAD APPROVED IMPACT RIPPLES
     Keep this query identical to the original working loader.
  --------------------------------------------------------- */
  fetch(`${SUPABASE_URL}/rest/v1/ripple_submissions?select=id,created_at,message,name,region,country,status,size&status=eq.approved&order=created_at.asc`, {
    headers: {
      apikey: SUPABASE_KEY,
      Authorization: `Bearer ${SUPABASE_KEY}`
    }
  })
    .then(response => response.ok ? response.json() : Promise.reject(new Error(`Supabase Impact ${response.status}`)))
    .then(rows => {
      console.log("[Ripple Well] Approved Impact Ripples:", rows.length);
      rows.forEach(addImpactRipple);
    })
    .catch(error => console.warn("[Ripple Well] Impact Ripples could not be loaded:", error));

  /* ---------------------------------------------------------
     LOAD APPROVED SUPER-IMPACT RIPPLES
     Super-Impact is identified by type = "super-impact".
     Contribution amounts are deliberately NOT requested.
  --------------------------------------------------------- */
  fetch(`${SUPABASE_URL}/rest/v1/ripple_submissions?select=id,created_at,message,name,region,country,status,size,type,sir_id,organization_name,organization_address,organization_logo&status=eq.approved&type=eq.super-impact&order=created_at.asc`, {
    headers: {
      apikey: SUPABASE_KEY,
      Authorization: `Bearer ${SUPABASE_KEY}`
    }
  })
    .then(response => response.ok ? response.json() : Promise.reject(new Error(`Supabase Super-Impact ${response.status}`)))
    .then(rows => {
      console.log("[Ripple Well] Approved Super-Impact Ripples:", rows.length, rows);
      rows.forEach(addSuperImpactRipple);
    })
    .catch(error => console.warn("[Ripple Well] Super-Impact Ripples could not be loaded:", error));

})();
