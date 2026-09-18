/* THE RIPPLE WELL — HOME BASE
   v43 — Restored organic traveling Impact Ripple
   Make a Ripple submission form added.
   Approved Impact Ripples remain. */
(() => {
  "use strict";

  const SUPABASE_URL = "https://vazgkkrrjgoowwywamot.supabase.co";
  const SUPABASE_KEY = "sb_publishable_gf0gD7JmbBlm6jR07qYkIQ_YZN301F-";
  const layer = document.getElementById("impact-ripples-layer");

  /* ---------------------------------------------------------
     IMPACT RIPPLES
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

  function addRipple(data) {
    const hitbox = document.createElement("div");
    hitbox.className = `impact-hitbox impact-size-${sizeClass(data.size)}`;
    hitbox.style.left = `${rand(data.id + "x", 12, 88)}%`;
    hitbox.style.top = `${rand(data.id + "y", 18, 88)}%`;
    hitbox.style.setProperty("--rotation", `${rand(data.id + "r", -28, 28)}deg`);

    const el = document.createElement("div");
    el.className = "impact-ripple";
    el.style.setProperty("--secondary-rotation", `${rand(data.id + "s", -18, 18)}deg`);
    el.title = data.name ? data.name : "Impact Ripple";

    /* Build organic water rings instead of geometric CSS ovals. */
    const svg = document.createElementNS("http://www.w3.org/2000/svg", "svg");
    svg.setAttribute("viewBox", "0 0 200 100");
    svg.setAttribute("preserveAspectRatio", "none");
    svg.setAttribute("aria-hidden", "true");
    svg.classList.add("impact-wave-svg");

    const makeWavePath = (id, scale, phase) => {
      const points = [];
      const count = 40;
      for (let i = 0; i < count; i++) {
        const a = (Math.PI * 2 * i) / count;
        const n =
          Math.sin(a * 3 + phase) * rand(id + "a" + i, 1.2, 3.2) +
          Math.sin(a * 7 + phase * 1.7) * rand(id + "b" + i, .45, 1.45) +
          Math.sin(a * 11 - phase * .8) * rand(id + "c" + i, .18, .75);
        const rx = 82 * scale + n;
        const ry = 34 * scale + n * .55;
        points.push([100 + Math.cos(a) * rx, 50 + Math.sin(a) * ry]);
      }
      return points.map((p, i) => `${i ? "L" : "M"}${p[0].toFixed(2)},${p[1].toFixed(2)}`).join(" ") + " Z";
    };

    const waveOuter = document.createElementNS("http://www.w3.org/2000/svg", "path");
    waveOuter.classList.add("impact-wave", "impact-wave-outer");
    waveOuter.setAttribute("d", makeWavePath(data.id + "outer", 1, rand(data.id + "phase1", 0, 6.28)));

    const waveInner = document.createElementNS("http://www.w3.org/2000/svg", "path");
    waveInner.classList.add("impact-wave", "impact-wave-inner");
    waveInner.setAttribute("d", makeWavePath(data.id + "inner", .78, rand(data.id + "phase2", 0, 6.28)));

    svg.appendChild(waveOuter);

    /* Animate the irregular wave through an SVG group so its expansion
       is reliable across browsers. */
    const waveGroup = document.createElementNS("http://www.w3.org/2000/svg", "g");
    waveGroup.classList.add("impact-wave-group");
    waveGroup.appendChild(waveInner);
    svg.appendChild(waveGroup);

    el.appendChild(svg);

    hitbox.addEventListener("click", () => {
      const message = (data.message || "").replace(/</g, "&lt;").replace(/>/g, "&gt;");
      const name = (data.name || "Anonymous").replace(/</g, "&lt;").replace(/>/g, "&gt;");
      const existing = document.getElementById("impact-ripple-preview");
      if (existing) existing.remove();

      const box = document.createElement("div");
      box.id = "impact-ripple-preview";
      box.innerHTML = `<div class="irp-box"><button class="irp-close" aria-label="Close">×</button><div class="irp-label">IMPACT RIPPLE</div><p>“${message}”</p><small>${name}</small></div>`;
      document.body.appendChild(box);
      box.querySelector(".irp-close").onclick = () => box.remove();
      box.onclick = event => {
        if (event.target === box) box.remove();
      };
    });

    hitbox.appendChild(el);
    if (layer) layer.appendChild(hitbox);
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
    /* Impact Ripple size presets */
    .impact-size-small{width:90px;height:45px}
    .impact-size-medium{width:130px;height:65px}
    .impact-size-large{width:175px;height:88px}
    .impact-size-extra-large{width:230px;height:115px}

    /* Impact Ripple hit area is ~50% of the visible ripple.
       The visual remains full-size and the interaction area stays small. */
    .impact-hitbox{
      position:absolute;
      width:clamp(90px,12vw,190px);
      height:clamp(45px,6vw,95px);
      transform:translate(-50%,-50%) rotate(var(--rotation,0deg)) scale(.5);
      pointer-events:auto;
      cursor:pointer;
      overflow:visible;
    }
    .impact-hitbox.impact-size-small{width:90px;height:45px}
    .impact-hitbox.impact-size-medium{width:130px;height:65px}
    .impact-hitbox.impact-size-large{width:175px;height:88px}
    .impact-hitbox.impact-size-extra-large{width:230px;height:115px}

    /* Organic Impact Ripple — one clearly visible traveling water wave */
    .impact-ripple{
      position:absolute;
      left:50%;
      top:50%;
      width:200%;
      height:200%;
      transform:translate(-50%,-50%);
      pointer-events:none;
      animation:none;
      opacity:1;
    }

    .impact-wave-svg{
      position:absolute;
      inset:0;
      width:100%;
      height:100%;
      overflow:visible;
      transform:rotate(var(--secondary-rotation,0deg));
    }

    .impact-wave{
      fill:none;
      vector-effect:non-scaling-stroke;
      transform-box:fill-box;
      transform-origin:center;
    }

    /* Permanent boundary is effectively invisible. */
    .impact-wave-outer{
      stroke:rgba(93,225,247,.012);
      stroke-width:.8;
      opacity:.16;
    }

    /* Irregular traveling wave — this is the main visible disturbance. */
    .impact-wave-inner{
      stroke:rgba(93,225,247,.88);
      stroke-width:1.35;
      stroke-linecap:round;
      stroke-linejoin:round;
      opacity:0;
    }

    .impact-wave-group{
      transform-box:fill-box;
      transform-origin:center;
      animation:impactWave 11s cubic-bezier(.18,.65,.25,1) infinite;
    }

    @keyframes impactWave{
      0%{
        transform:scale(.34);
        opacity:0;
      }
      12%{
        transform:scale(.42);
        opacity:0;
      }
      20%{
        transform:scale(.50);
        opacity:.82;
      }
      32%{
        transform:scale(.66);
        opacity:.94;
      }
      48%{
        transform:scale(.84);
        opacity:.76;
      }
      64%{
        transform:scale(1.00);
        opacity:.48;
      }
      78%{
        transform:scale(1.14);
        opacity:.20;
      }
      92%{
        transform:scale(1.27);
        opacity:.035;
      }
      100%{
        transform:scale(1.34);
        opacity:0;
      }
    }

    #impact-ripple-preview{position:fixed;inset:0;z-index:3000;display:grid;place-items:center;background:rgba(0,5,10,.68);backdrop-filter:blur(6px)}
    .irp-box{position:relative;width:min(620px,86vw);padding:42px;border:1px solid rgba(91,226,249,.45);background:rgba(2,13,22,.92);box-shadow:0 0 45px rgba(46,198,229,.16);text-align:center;color:#eefaff}
    .irp-label{font-size:12px;letter-spacing:.25em;opacity:.7}
    .irp-box p{font-size:22px;line-height:1.55}
    .irp-box small{opacity:.7}
    .irp-close{position:absolute;right:14px;top:10px;border:0;background:none;color:#fff;font-size:28px;cursor:pointer}

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
  --------------------------------------------------------- */
  fetch(`${SUPABASE_URL}/rest/v1/ripple_submissions?select=id,created_at,message,name,region,country,status,size&status=eq.approved&order=created_at.asc`, {
    headers: {
      apikey: SUPABASE_KEY,
      Authorization: `Bearer ${SUPABASE_KEY}`
    }
  })
    .then(response => response.ok ? response.json() : Promise.reject(new Error(`Supabase ${response.status}`)))
    .then(rows => rows.forEach(addRipple))
    .catch(error => console.warn("Impact Ripples could not be loaded:", error));
})();
