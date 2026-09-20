/* THE RIPPLE WELL — HOME BASE
   v65 — Mobile polish paired with Home Base index v65; ripple logic unchanged
   Make a Ripple submission form added.
   Approved Impact Ripples remain. */
(() => {
  "use strict";

  const SUPABASE_URL = "https://vazgkkrrjgoowwywamot.supabase.co";
  const SUPABASE_KEY = "sb_publishable_gf0gD7JmbBlm6jR07qYkIQ_YZN301F-";
  const layer = document.getElementById("impact-ripples-layer");

  /* ---------------------------------------------------------
     TEST MODE
     THIS FILE IS A DEDICATED TEST BUILD. It always shows ONE enhanced
     Impact Ripple only. It does not load Supabase ripples.
  --------------------------------------------------------- */
  const TEST_IMPACT_RIPPLE = true;

  /* ---------------------------------------------------------
     RIPPLE PLACEMENT ZONES
     Impact Ripples may use the open side margins and lower page space.
     Super-Impact Ripples stay within the central Well.
  --------------------------------------------------------- */
  const IMPACT_X_MIN = 5;
  const IMPACT_X_MAX = 95;
  const IMPACT_Y_MIN = 34;
  const IMPACT_Y_MAX = 92;

  const SUPER_X_MIN = 22;
  const SUPER_X_MAX = 78;
  const SUPER_Y_MIN = 46;
  const SUPER_Y_MAX = 88;

  /* Keep the visible ripple footprints separated. */
  const placedRippleFootprints = [];
  const RIPPLE_SEPARATION = 1.12;

  /* On mobile, never use the old overlap-producing fallback. */
  const IS_MOBILE_RIPPLE_LAYOUT = window.matchMedia("(max-width:760px)").matches;
  const MAX_RIPPLE_PLACEMENT_ATTEMPTS = IS_MOBILE_RIPPLE_LAYOUT ? 500 : 80;

  function rippleFootprint(size, isSuper) {
    const dimensions = { small: [90,45], medium: [130,65], large: [175,88], "extra-large": [230,115] };
    const [w,h] = dimensions[sizeClass(size)] || dimensions.medium;
    const scale = isSuper ? 8.7 : 2;
    return { halfW: w * scale * 0.5 * RIPPLE_SEPARATION, halfH: h * scale * 0.5 * RIPPLE_SEPARATION };
  }

  function footprintsOverlap(a,b) {
    return Math.abs(a.x-b.x) < a.halfW+b.halfW && Math.abs(a.y-b.y) < a.halfH+b.halfH;
  }

  function chooseRipplePosition(data,xMin,xMax,yMin,yMax,isSuper) {
    const rect = layer ? layer.getBoundingClientRect() : {width:window.innerWidth,height:window.innerHeight};
    const fp = rippleFootprint(data.size,isSuper);
    const suffix = isSuper ? "super" : "normal";
    for (let attempt=0; attempt<MAX_RIPPLE_PLACEMENT_ATTEMPTS; attempt++) {
      const x = rand(data.id+suffix+"x"+attempt,xMin,xMax)/100*rect.width;
      const y = rand(data.id+suffix+"y"+attempt,yMin,yMax)/100*rect.height;
      const candidate={x,y,halfW:fp.halfW,halfH:fp.halfH};
      if (!placedRippleFootprints.some(existing=>footprintsOverlap(candidate,existing))) {
        placedRippleFootprints.push(candidate);
        return {x:x/rect.width*100,y:y/rect.height*100};
      }
    }

    /*
       Mobile rule: if there is genuinely no room left, skip this ripple.
       This guarantees that Impact and Super-Impact Ripples never overlap.
       Desktop keeps the original fallback behavior unchanged.
    */
    if (IS_MOBILE_RIPPLE_LAYOUT) {
      console.warn(`No non-overlapping position available for ${suffix} ripple ${data.id}; ripple skipped on mobile.`);
      return null;
    }

    const x=rand(data.id+suffix+"fallbackX",xMin,xMax)/100*rect.width;
    const y=rand(data.id+suffix+"fallbackY",yMin,yMax)/100*rect.height;
    placedRippleFootprints.push({x,y,halfW:fp.halfW,halfH:fp.halfH});
    return {x:x/rect.width*100,y:y/rect.height*100};
  }

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
    let position = chooseRipplePosition(data, IMPACT_X_MIN, IMPACT_X_MAX, IMPACT_Y_MIN, IMPACT_Y_MAX, false);
    if (TEST_IMPACT_RIPPLE && data.testPosition) {
      position = { x: 50, y: 58 };
    }
    if (!position) return;
    hitbox.style.left = `${position.x}%`;
    hitbox.style.top = `${position.y}%`;
    hitbox.style.setProperty("--rotation", `${rand(data.id + "r", -28, 28)}deg`);

    const el = document.createElement("div");
    el.className = `impact-ripple${TEST_IMPACT_RIPPLE ? " impact-ripple-test" : ""}`;
    el.style.setProperty("--secondary-rotation", `${rand(data.id + "s", -10, 10)}deg`);
    el.title = data.name ? data.name : "Impact Ripple";

    /*
       Tiny raindrop impact point.
       This is deliberately restrained: a brief pinpoint disturbance at the
       center, followed by the existing outward water wave.
    */
    const impactDrop = document.createElement("span");
    impactDrop.className = "impact-drop";
    el.appendChild(impactDrop);

    /* Test-only splash crown: small droplets kick upward at the instant of impact. */
    if (TEST_IMPACT_RIPPLE) {
      const splash = document.createElement("span");
      splash.className = "impact-splash";
      for (let i = 0; i < 9; i++) {
        const droplet = document.createElement("span");
        droplet.className = "impact-splash-drop";
        droplet.style.setProperty("--splash-angle", `${-82 + i * 20 + rand(data.id + "sa" + i, -5, 5)}deg`);
        droplet.style.setProperty("--splash-distance", `${rand(data.id + "sd" + i, 18, 38)}px`);
        droplet.style.setProperty("--splash-size", `${rand(data.id + "ss" + i, 2.2, 4.4)}px`);
        droplet.style.setProperty("--splash-delay", `${rand(data.id + "sl" + i, 0, 55)}ms`);
        splash.appendChild(droplet);
      }
      el.appendChild(splash);
    }

    /* Build organic water rings instead of geometric CSS ovals. */
    const svg = document.createElementNS("http://www.w3.org/2000/svg", "svg");
    svg.setAttribute("viewBox", "0 0 200 100");
    svg.setAttribute("preserveAspectRatio", "none");
    svg.setAttribute("aria-hidden", "true");
    svg.classList.add("impact-wave-svg");

    const makeWavePath = (id, scale, phase) => {
      const points = [];
      const count = 72;

      /*
         Deliberately exaggerated organic deformation.
         The ring remains a water-like ellipse, but its edge has
         visible peaks, valleys, bulges, and compressed sections.
      */
      for (let i = 0; i < count; i++) {
        const a = (Math.PI * 2 * i) / count;

        const low =
          Math.sin(a * 3 + phase) * rand(id + "low" + i, 5.5, 9.5);

        const mid =
          Math.sin(a * 5 - phase * 1.35) * rand(id + "mid" + i, 3.0, 6.5);

        const high =
          Math.sin(a * 9 + phase * .72) * rand(id + "high" + i, 1.2, 3.4);

        const irregular =
          Math.sin(a * 13 - phase * 1.9) * rand(id + "fine" + i, .4, 1.6);

        const deformation = low + mid + high + irregular;

        /* Independent X/Y deformation prevents a smooth oval. */
        const x = (82 + deformation) * scale;
        const y = (34 + deformation * rand(id + "ratio" + i, .42, .72)) * scale;

        points.push([
          100 + Math.cos(a) * x,
          50 + Math.sin(a) * y
        ]);
      }

      /*
         Re-center the finished organic shape around the exact raindrop
         impact point. Because the deformation uses different random
         amplitudes around the circumference, the raw shape can otherwise
         develop a slight visual/geometry offset.
      */
      let centerX = 0;
      let centerY = 0;

      for (const point of points) {
        centerX += point[0];
        centerY += point[1];
      }

      centerX /= points.length;
      centerY /= points.length;

      for (const point of points) {
        point[0] += 100 - centerX;
        point[1] += 50 - centerY;
      }

      /*
         Smooth the polygon with quadratic midpoint curves.
         This keeps the peaks/valleys organic rather than jagged.
      */
      const path = [];
      const midpoint = (a, b) => [
        (a[0] + b[0]) / 2,
        (a[1] + b[1]) / 2
      ];

      const firstMid = midpoint(points[0], points[1]);
      path.push(`M${firstMid[0].toFixed(2)},${firstMid[1].toFixed(2)}`);

      for (let i = 1; i <= points.length; i++) {
        const current = points[i % points.length];
        const next = points[(i + 1) % points.length];
        const mid = midpoint(current, next);

        path.push(
          `Q${current[0].toFixed(2)},${current[1].toFixed(2)} ` +
          `${mid[0].toFixed(2)},${mid[1].toFixed(2)}`
        );
      }

      path.push("Z");
      return path.join(" ");
    };

    const waveOuter = document.createElementNS("http://www.w3.org/2000/svg", "path");
    waveOuter.classList.add("impact-wave", "impact-wave-outer");
    waveOuter.setAttribute("d", makeWavePath(data.id + "outer", 1, rand(data.id + "phase1", 0, 6.28)));

    svg.appendChild(waveOuter);

    /*
       Build several separate wave rings. Each ring uses the same organic
       water shape, but starts later and at a different size so the result
       reads as one raindrop creating a sequence of expanding ripples.
    */
    const waveGroup = document.createElementNS("http://www.w3.org/2000/svg", "g");
    const waveRings = [];
    const ringScales = TEST_IMPACT_RIPPLE ? [.48, .64, .80, .96] : [.54, .72, .90];
    const sharedRingPhase = rand(data.id + "sharedRingPhase", 0, 6.28);

    ringScales.forEach((scale, index) => {
      const pathData = makeWavePath(
        data.id + "sharedRingContour",
        scale,
        sharedRingPhase
      );

      /*
         Three visual layers make the disturbance read as water rather than
         a graphic outline: a soft reflected glow, a broken water crest,
         and tiny bright surface highlights. All three share the same path.
      */
      const ringGlow = document.createElementNS("http://www.w3.org/2000/svg", "path");
      ringGlow.classList.add("impact-wave", "impact-wave-glow");
      ringGlow.setAttribute("d", pathData);
      waveGroup.appendChild(ringGlow);

      const ring = document.createElementNS("http://www.w3.org/2000/svg", "path");
      ring.classList.add("impact-wave", "impact-wave-inner");
      ring.setAttribute("d", pathData);
      waveGroup.appendChild(ring);

      const ringShimmer = document.createElementNS("http://www.w3.org/2000/svg", "path");
      ringShimmer.classList.add("impact-wave", "impact-wave-shimmer");
      ringShimmer.setAttribute("d", pathData);
      waveGroup.appendChild(ringShimmer);

      waveRings.push({ ring, ringGlow, ringShimmer });
    });

    svg.appendChild(waveGroup);
    el.appendChild(svg);

    /*
       Give every Impact Ripple its own rhythm.
       Each ripple starts at a different point in the cycle and uses a
       slightly different duration, while preserving the existing motion.
    */
    const rippleDelay = TEST_IMPACT_RIPPLE ? 0 : -rand(data.id + "delay", 0, 11000);
    const rippleDuration = TEST_IMPACT_RIPPLE ? 2400 : rand(data.id + "duration", 9800, 13200);

    impactDrop.animate(
      TEST_IMPACT_RIPPLE ? [
        { transform: "translate(-50%,-50%) scale(.05)", opacity: 0 },
        { transform: "translate(-50%,-50%) scale(1)", opacity: 1, offset: .08 },
        { transform: "translate(-50%,-50%) scale(1.7)", opacity: .65, offset: .18 },
        { transform: "translate(-50%,-50%) scale(2.2)", opacity: 0, offset: .34 },
        { transform: "translate(-50%,-50%) scale(2.2)", opacity: 0 }
      ] : [
        { transform: "translate(-50%,-50%) scale(.15)", opacity: 0 },
        { transform: "translate(-50%,-50%) scale(.28)", opacity: .78, offset: .055 },
        { transform: "translate(-50%,-50%) scale(.52)", opacity: .34, offset: .085 },
        { transform: "translate(-50%,-50%) scale(.78)", opacity: 0, offset: .13 },
        { transform: "translate(-50%,-50%) scale(1)", opacity: 0 }
      ],
      {
        duration: rippleDuration,
        easing: "ease-out",
        iterations: Infinity,
        delay: rippleDelay,
        fill: "both"
      }
    );

    /*
       Each ring expands independently. The staggered delays create the
       visual sequence: impact -> first ring -> second ring -> third ring.
       Every ring still inherits the same irregular, organic geometry.
    */
    waveRings.forEach(({ ring, ringGlow, ringShimmer }, index) => {
      /*
         Keep every visual layer on the exact same organic contour. Only
         scale changes, so the rings stay concentric and cannot cross.
      */
      const ringDelay = rippleDelay + index * (rippleDuration * (TEST_IMPACT_RIPPLE ? .105 : .16));
      const ringDuration = rippleDuration * (TEST_IMPACT_RIPPLE ? .78 : .56);

      [ring, ringGlow, ringShimmer].forEach(part => {
        part.style.transformOrigin = "50% 50%";
        part.style.transformBox = "view-box";
      });

      const expansion = TEST_IMPACT_RIPPLE ? [
        { transform: "scale(.24)", opacity: 0 },
        { transform: "scale(.38)", opacity: .96, offset: .08 },
        { transform: "scale(.58)", opacity: .86, offset: .24 },
        { transform: "scale(.78)", opacity: .62, offset: .48 },
        { transform: "scale(1.00)", opacity: .28, offset: .72 },
        { transform: "scale(1.16)", opacity: 0, offset: 1 }
      ] : [
        { transform: "scale(.46)", opacity: 0 },
        { transform: "scale(.54)", opacity: .82, offset: .10 },
        { transform: "scale(.70)", opacity: .72, offset: .28 },
        { transform: "scale(.88)", opacity: .48, offset: .50 },
        { transform: "scale(1.08)", opacity: .10, offset: .74 },
        { transform: "scale(1.10)", opacity: 0, offset: 1 }
      ];

      [ring, ringGlow, ringShimmer].forEach(part => {
        part.animate(expansion, {
          duration: ringDuration,
          easing: "cubic-bezier(.10,.65,.25,1)",
          iterations: Infinity,
          delay: ringDelay,
          fill: "both"
        });
      });

      /*
         The main crest is intentionally broken: real water does not form a
         perfectly continuous luminous circle. The dash pattern leaves dark
         gaps while the highlight fragments drift around the surface.
      */
      ring.animate(
        [
          { strokeDashoffset: "0", opacity: .40 },
          { strokeDashoffset: "-11", opacity: .76, offset: .20 },
          { strokeDashoffset: "-25", opacity: .50, offset: .42 },
          { strokeDashoffset: "-41", opacity: .82, offset: .61 },
          { strokeDashoffset: "-57", opacity: .20, offset: .80 },
          { strokeDashoffset: "-73", opacity: 0 }
        ],
        { duration: ringDuration, easing: "ease-out", iterations: Infinity, delay: ringDelay }
      );

      /* Soft reflected light sits underneath the crest instead of replacing it. */
      ringGlow.animate(
        [
          { strokeDashoffset: "8", opacity: .05 },
          { strokeDashoffset: "-10", opacity: .15, offset: .24 },
          { strokeDashoffset: "-38", opacity: .09, offset: .50 },
          { strokeDashoffset: "-61", opacity: .13, offset: .70 },
          { strokeDashoffset: "-84", opacity: 0 }
        ],
        { duration: ringDuration * 1.08, easing: "ease-out", iterations: Infinity, delay: ringDelay }
      );

      /* Tiny moonlit glints briefly catch on different parts of the wave. */
      ringShimmer.animate(
        [
          { strokeDashoffset: "0", opacity: 0 },
          { strokeDashoffset: "-9", opacity: .08, offset: .28 },
          { strokeDashoffset: "-21", opacity: .34, offset: .42 },
          { strokeDashoffset: "-33", opacity: .05, offset: .54 },
          { strokeDashoffset: "-49", opacity: .22, offset: .70 },
          { strokeDashoffset: "-67", opacity: 0 }
        ],
        { duration: ringDuration * .92, easing: "ease-in-out", iterations: Infinity, delay: ringDelay + index * 170 }
      );
    });

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
     SUPER-IMPACT RIPPLES
     An invisible rock hitting the Well: a stronger central impact,
     broader blue water waves, restrained gold outer rims, and the
     contributing organization's logo at the point of impact.
  --------------------------------------------------------- */
  function addSuperImpactRipple(data) {
    const hitbox = document.createElement("div");
    hitbox.className = `impact-hitbox super-impact-hitbox impact-size-${sizeClass(data.size)}`;
    const position = chooseRipplePosition(data, SUPER_X_MIN, SUPER_X_MAX, SUPER_Y_MIN, SUPER_Y_MAX, true);
    if (!position) return;
    hitbox.style.left = `${position.x}%`;
    hitbox.style.top = `${position.y}%`;
    hitbox.style.setProperty("--rotation", `${rand(data.id + "r", -10, 10)}deg`);

    const el = document.createElement("div");
    el.className = "impact-ripple super-impact-ripple";
    el.title = data.organization_name || "Super-Impact Ripple";

    const svg = document.createElementNS("http://www.w3.org/2000/svg", "svg");
    svg.setAttribute("viewBox", "0 0 240 120");
    svg.setAttribute("preserveAspectRatio", "none");
    svg.setAttribute("aria-hidden", "true");
    svg.classList.add("super-impact-wave-svg");

    const makeSuperPath = (id, scale, phase) => {
      const points = [];
      const count = 96;
      for (let i = 0; i < count; i++) {
        const a = (Math.PI * 2 * i) / count;
        const low = Math.sin(a * 3 + phase) * rand(id + "low" + i, 4.0, 7.0);
        const mid = Math.sin(a * 5 - phase * 1.15) * rand(id + "mid" + i, 2.0, 4.5);
        const high = Math.sin(a * 9 + phase * .65) * rand(id + "high" + i, .8, 2.2);
        const deformation = low + mid + high;
        const x = (98 + deformation) * scale;
        const y = (40 + deformation * rand(id + "ratio" + i, .42, .66)) * scale;
        points.push([120 + Math.cos(a) * x, 60 + Math.sin(a) * y]);
      }
      let cx = 0, cy = 0;
      points.forEach(p => { cx += p[0]; cy += p[1]; });
      cx /= points.length; cy /= points.length;
      points.forEach(p => { p[0] += 120 - cx; p[1] += 60 - cy; });
      const midpoint = (a,b) => [(a[0]+b[0])/2,(a[1]+b[1])/2];
      const path = [];
      const first = midpoint(points[0], points[1]);
      path.push(`M${first[0].toFixed(2)},${first[1].toFixed(2)}`);
      for (let i=1; i<=points.length; i++) {
        const current = points[i % points.length];
        const next = points[(i+1) % points.length];
        const mid = midpoint(current,next);
        path.push(`Q${current[0].toFixed(2)},${current[1].toFixed(2)} ${mid[0].toFixed(2)},${mid[1].toFixed(2)}`);
      }
      path.push("Z");
      return path.join(" ");
    };

    const group = document.createElementNS("http://www.w3.org/2000/svg", "g");
    group.classList.add("super-impact-wave-group");
    const phase = rand(data.id + "superPhase", 0, 6.28);
    const rings = [];
    const scales = [.48, .67, .86, 1.04];

    scales.forEach((scale, index) => {
      const d = makeSuperPath(data.id + "superContour", scale, phase);
      const glow = document.createElementNS("http://www.w3.org/2000/svg", "path");
      glow.classList.add("super-impact-wave", "super-impact-wave-glow");
      glow.setAttribute("d", d);
      const blue = document.createElementNS("http://www.w3.org/2000/svg", "path");
      blue.classList.add("super-impact-wave", "super-impact-wave-blue");
      blue.setAttribute("d", d);
      const gold = document.createElementNS("http://www.w3.org/2000/svg", "path");
      gold.classList.add("super-impact-wave", "super-impact-wave-gold");
      gold.setAttribute("d", d);
      group.append(glow, blue, gold);
      rings.push({glow, blue, gold, index});
    });
    svg.appendChild(group);
    el.appendChild(svg);

    const impact = document.createElement("span");
    impact.className = "super-impact-hit";
    el.appendChild(impact);

    if (data.organization_logo) {
      const logoWrap = document.createElement("span");
      logoWrap.className = "super-impact-logo-wrap";
      const logo = document.createElement("img");
      logo.className = "super-impact-logo";
      logo.src = data.organization_logo;
      logo.alt = `${data.organization_name || "Organization"} logo`;
      logoWrap.appendChild(logo);
      el.appendChild(logoWrap);
    }

    /* A full rock-impact cycle lasts about 7 seconds. The long pause between
       cycles makes the event feel earned rather than like a breathing animation. */
    const cycle = rand(data.id + "superCycle", 6800, 8200);
    const delay = -rand(data.id + "superDelay", 0, 9000);

    impact.animate([
      {transform:"translate(-50%,-50%) scale(.15)",opacity:0},
      {transform:"translate(-50%,-50%) scale(1)",opacity:1,offset:.035},
      {transform:"translate(-50%,-50%) scale(1.8)",opacity:.72,offset:.075},
      {transform:"translate(-50%,-50%) scale(2.5)",opacity:0,offset:.16},
      {transform:"translate(-50%,-50%) scale(2.5)",opacity:0}
    ],{duration:cycle,easing:"cubic-bezier(.1,.55,.2,1)",iterations:Infinity,delay,fill:"both"});

    rings.forEach(({glow,blue,gold,index}) => {
      const ringDelay = delay + index * (cycle * .105);
      const ringDuration = cycle * .72;
      [glow,blue,gold].forEach(part => {
        part.style.transformOrigin = "50% 50%";
        part.style.transformBox = "view-box";
        part.animate([
          {transform:"scale(.34)",opacity:0},
          {transform:"scale(.50)",opacity:1,offset:.08},
          {transform:"scale(.70)",opacity:.82,offset:.28},
          {transform:"scale(.91)",opacity:.48,offset:.54},
          {transform:"scale(1.10)",opacity:.14,offset:.80},
          {transform:"scale(1.17)",opacity:0}
        ],{duration:ringDuration,easing:"cubic-bezier(.12,.62,.22,1)",iterations:Infinity,delay:ringDelay,fill:"both"});
      });
      blue.animate([
        {strokeDashoffset:"0",opacity:.20},{strokeDashoffset:"-10",opacity:.92,offset:.16},
        {strokeDashoffset:"-43",opacity:.66,offset:.40},{strokeDashoffset:"-76",opacity:.30,offset:.68},
        {strokeDashoffset:"-108",opacity:0}
      ],{duration:ringDuration,easing:"ease-out",iterations:Infinity,delay:ringDelay});
      gold.animate([
        {strokeDashoffset:"-12",opacity:.10},{strokeDashoffset:"-38",opacity:.92,offset:.20},
        {strokeDashoffset:"-72",opacity:.68,offset:.42},{strokeDashoffset:"-108",opacity:.34,offset:.68},
        {strokeDashoffset:"-145",opacity:0}
      ],{duration:ringDuration,easing:"ease-out",iterations:Infinity,delay:ringDelay + 45});
    });

    if (data.organization_logo) {
      const logoWrap = el.querySelector(".super-impact-logo-wrap");
      logoWrap.animate([
        {transform:"translate(-50%,-50%) scale(.78)",opacity:0},
        {transform:"translate(-50%,-50%) scale(1)",opacity:1,offset:.045},
        {transform:"translate(-50%,-50%) scale(1.04)",opacity:.92,offset:.12},
        {transform:"translate(-50%,-50%) scale(1.12)",opacity:.50,offset:.28},
        {transform:"translate(-50%,-50%) scale(1.10)",opacity:0,offset:.48},
        {transform:"translate(-50%,-50%) scale(1.10)",opacity:0}
      ],{duration:cycle,easing:"ease-out",iterations:Infinity,delay,fill:"both"});
    }

    hitbox.addEventListener("click", () => {
      const existing = document.getElementById("impact-ripple-preview");
      if (existing) existing.remove();
      const box = document.createElement("div");
      box.id = "impact-ripple-preview";
      const org = (data.organization_name || "Organization").replace(/</g,"&lt;").replace(/>/g,"&gt;");
      const message = (data.message || "").replace(/</g,"&lt;").replace(/>/g,"&gt;");
      const logoMarkup = data.organization_logo
        ? `<img class="irp-org-logo" src="${String(data.organization_logo).replace(/"/g,"&quot;")}" alt="${org} logo">`
        : "";
      box.innerHTML = `<div class="irp-box"><button class="irp-close" aria-label="Close">×</button><div class="irp-label">SUPER-IMPACT RIPPLE</div>${logoMarkup}<p>${org}</p>${message ? `<small>“${message}”</small>` : ""}</div>`;
      document.body.appendChild(box);
      box.querySelector(".irp-close").onclick=()=>box.remove();
      box.onclick=e=>{if(e.target===box)box.remove();};
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

    /* Organic Impact Ripple — JS-driven traveling water wave */
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

    /*
       The raindrop itself is almost invisible — just enough to suggest a
       small drop striking the water before the ripple spreads.
    */
    .impact-drop{
      position:absolute;
      left:50%;
      top:50%;
      width:5px;
      height:5px;
      border-radius:50%;
      background:rgba(210,248,255,.9);
      box-shadow:
        0 0 3px rgba(126,231,248,.55),
        0 0 7px rgba(72,208,235,.22);
      pointer-events:none;
      opacity:0;
      transform:translate(-50%,-50%) scale(.15);
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

    /* Test-only splash crown — used only with ?testRipple=1. */
    .impact-ripple-test .impact-splash{
      position:absolute;left:50%;top:50%;width:1px;height:1px;
      transform:translate(-50%,-50%);pointer-events:none;z-index:4;
    }
    .impact-ripple-test .impact-splash-drop{
      position:absolute;left:0;top:0;width:var(--splash-size);height:var(--splash-size);
      border-radius:50%;background:rgba(214,250,255,.92);
      box-shadow:0 0 5px rgba(91,224,247,.72),0 0 10px rgba(91,224,247,.28);
      transform:rotate(var(--splash-angle)) translateY(0) scale(.2);
      opacity:0;
      animation:impactSplashDrop 2.4s cubic-bezier(.16,.66,.28,1) infinite;
      animation-delay:var(--splash-delay);
    }
    @keyframes impactSplashDrop{
      0%,7%{opacity:0;transform:rotate(var(--splash-angle)) translateY(0) scale(.2)}
      12%{opacity:.95;transform:rotate(var(--splash-angle)) translateY(0) scale(1)}
      30%{opacity:.78;transform:rotate(var(--splash-angle)) translateY(calc(var(--splash-distance) * -.48)) scale(.82)}
      54%{opacity:.32;transform:rotate(var(--splash-angle)) translateY(calc(var(--splash-distance) * -.88)) scale(.58)}
      72%,100%{opacity:0;transform:rotate(var(--splash-angle)) translateY(calc(var(--splash-distance) * -1.12)) scale(.35)}
    }

    /* Permanent boundary is intentionally almost invisible. */
    .impact-wave-outer{
      stroke:rgba(93,225,247,.028);
      stroke-width:1.2;
      stroke-linecap:round;
      stroke-dasharray:5 34 2 51 8 42;
      opacity:.16;
      filter:blur(.7px);
    }

    /*
       Water-surface treatment: the glow is wider and softer than the crest,
       so the eye reads reflected light around the wave rather than a line.
    */
    .impact-wave-glow{
      stroke:rgba(78,214,238,.32);
      stroke-width:4.2;
      stroke-linecap:round;
      stroke-linejoin:round;
      stroke-dasharray:8 10 4 31 12 24 6 38;
      opacity:.10;
      filter:blur(2.2px) drop-shadow(0 0 4px rgba(74,214,239,.22));
    }

    /* Main irregular water crest: broken, translucent, and uneven. */
    .impact-wave-inner{
      stroke:rgba(121,231,247,.88);
      stroke-width:1.05;
      stroke-linecap:round;
      stroke-linejoin:round;
      stroke-dasharray:2 9 13 5 3 21 7 15 2 28 8 6 19 11;
      opacity:1;
      filter:drop-shadow(0 0 1.8px rgba(74,214,239,.10));
    }

    /* Very small bright fragments imitate moonlight catching individual wave crests. */
    .impact-wave-shimmer{
      stroke:rgba(205,249,255,.92);
      stroke-width:1.35;
      stroke-linecap:round;
      stroke-linejoin:round;
      stroke-dasharray:1 34 5 58 2 27 7 71;
      opacity:0;
      filter:drop-shadow(0 0 2.5px rgba(176,244,255,.34));
    }



    /* =========================================================
       CLICK-RIPPLE — SMALL, DIRECT WATER RESPONSE
    ========================================================= */
    .click-ripple{
      position:absolute;
      width:58px;
      height:29px;
      margin:0;
      border:1px solid rgba(121,231,247,.82);
      border-radius:50%;
      transform:translate(-50%,-50%) rotate(var(--click-rotation,0deg)) scale(.10);
      opacity:0;
      pointer-events:none;
      z-index:6;
      box-shadow:
        0 0 3px rgba(111,231,249,.45),
        0 0 9px rgba(70,210,240,.10);
      animation:clickRippleWave .82s cubic-bezier(.10,.68,.3,1) forwards;
    }
    .click-ripple::before{
      content:"";
      position:absolute;
      left:50%;
      top:50%;
      width:5px;
      height:5px;
      border-radius:50%;
      transform:translate(-50%,-50%);
      background:rgba(215,249,255,.9);
      box-shadow:0 0 4px rgba(121,231,247,.45);
      opacity:.85;
    }
    .click-ripple::after{
      content:"";
      position:absolute;
      inset:7px 12px;
      border:1px solid rgba(190,245,255,.38);
      border-radius:50%;
      opacity:.55;
    }
    @keyframes clickRippleWave{
      0%{transform:translate(-50%,-50%) rotate(var(--click-rotation,0deg)) scale(.10);opacity:0}
      15%{opacity:.92}
      42%{opacity:.72}
      100%{transform:translate(-50%,-50%) rotate(var(--click-rotation,0deg)) scale(1.25);opacity:0}
    }

    /* Test-only richer water treatment. Normal Impact Ripples are untouched. */
    .impact-ripple-test .impact-wave-outer{
      stroke:rgba(104,224,247,.26);stroke-width:2.2;
      stroke-dasharray:4 12 9 18 3 24;
      filter:blur(1.6px) drop-shadow(0 0 5px rgba(65,214,241,.22));
    }
    .impact-ripple-test .impact-wave-glow{
      stroke:rgba(83,220,245,.42);stroke-width:5.4;
      stroke-dasharray:7 8 3 17 10 21 5 28;
      filter:blur(2.7px) drop-shadow(0 0 7px rgba(65,214,241,.30));
    }
    .impact-ripple-test .impact-wave-inner{
      stroke:rgba(137,239,251,.94);stroke-width:1.35;
      stroke-dasharray:3 7 11 4 4 17 8 12 2 24 7 5;
      filter:drop-shadow(0 0 2.4px rgba(74,214,239,.20));
    }
    .impact-ripple-test .impact-wave-shimmer{
      stroke:rgba(225,252,255,.98);stroke-width:1.65;
      stroke-dasharray:1 22 5 39 2 19 7 54;
      filter:drop-shadow(0 0 3px rgba(190,248,255,.44));
    }

    /* =========================================================
       SUPER-IMPACT — INVISIBLE ROCK / BLUE WATER + GOLD RIM
    ========================================================= */
    .super-impact-hitbox{z-index:12;}
    .super-impact-ripple{width:870%;height:870%;transform:translate(-50%,-50%);}
    .super-impact-wave-svg{position:absolute;inset:0;width:100%;height:100%;overflow:visible;}
    .super-impact-wave{fill:none;vector-effect:non-scaling-stroke;stroke-linecap:round;stroke-linejoin:round;}
    .super-impact-wave-glow{stroke:rgba(70,210,240,.28);stroke-width:5.5;stroke-dasharray:10 22 6 34 14 30;opacity:.12;filter:blur(3px) drop-shadow(0 0 7px rgba(61,204,236,.28));}
    .super-impact-wave-blue{stroke:rgba(111,231,249,.94);stroke-width:1.55;stroke-dasharray:3 8 10 5 5 25 9 16 3 31 11 7 22 12;opacity:1;filter:drop-shadow(0 0 2px rgba(77,214,241,.28));}
    .super-impact-wave-gold{stroke:rgba(255,221,105,.98);stroke-width:1.35;stroke-dasharray:2 13 8 22 3 16 11 27;opacity:.95;filter:drop-shadow(0 0 3px rgba(255,210,92,.58)) drop-shadow(0 0 7px rgba(238,195,76,.32));}
    .super-impact-hit{position:absolute;left:50%;top:50%;width:9px;height:9px;border-radius:50%;transform:translate(-50%,-50%);background:radial-gradient(circle,rgba(255,255,255,1) 0%,rgba(210,248,255,.98) 28%,rgba(75,210,239,.78) 58%,transparent 100%);box-shadow:0 0 5px rgba(255,255,255,.9),0 0 14px rgba(70,208,239,.8),0 0 26px rgba(255,211,82,.26);opacity:0;pointer-events:none;}
    .super-impact-logo-wrap{position:absolute;left:50%;top:50%;width:30%;height:30%;transform:translate(-50%,-50%);display:flex;align-items:center;justify-content:center;z-index:8;pointer-events:none;opacity:0;}
    .super-impact-logo-wrap::before{content:"";position:absolute;inset:-16%;border-radius:50%;background:radial-gradient(circle,rgba(210,247,255,.22),rgba(255,215,94,.08) 42%,transparent 72%);filter:blur(4px);}
    .super-impact-logo{position:relative;width:100%;height:100%;object-fit:contain;opacity:.96;filter:drop-shadow(0 0 4px rgba(255,255,255,.78)) drop-shadow(0 0 10px rgba(75,211,240,.58)) drop-shadow(0 0 15px rgba(255,211,82,.24));}

    #impact-ripple-preview{position:fixed;inset:0;z-index:3000;display:grid;place-items:center;background:rgba(0,5,10,.68);backdrop-filter:blur(6px)}
    .irp-box{position:relative;width:min(620px,86vw);padding:42px;border:1px solid rgba(91,226,249,.45);background:rgba(2,13,22,.92);box-shadow:0 0 45px rgba(46,198,229,.16);text-align:center;color:#eefaff}
    .irp-org-logo{display:block;width:min(100px,42vw);height:min(110px,24vw);object-fit:contain;margin:0 auto 20px;filter:drop-shadow(0 0 5px rgba(255,255,255,.7)) drop-shadow(0 0 12px rgba(75,211,240,.35)) drop-shadow(0 0 14px rgba(255,211,82,.10));}
    .irp-label{font-size:12px;letter-spacing:.25em;opacity:.7}
    .irp-box p{font-size:22px;line-height:1.55}
    .irp-box small{opacity:.7}
    .irp-close{position:absolute;right:14px;top:10px;border:0;background:none;color:#fff;font-size:28px;cursor:pointer}

    #make-ripple-modal{position:fixed;inset:0;z-index:2900;display:flex;align-items:center;justify-content:center;padding:30px;background:rgba(0,5,12,.78);backdrop-filter:blur(10px);opacity:0;visibility:hidden;pointer-events:none;transition:opacity .3s ease,visibility .3s ease;overflow-y:auto}
    #make-ripple-modal.open{opacity:1;visibility:visible;pointer-events:auto}
    .make-ripple-box{position:relative;width:min(680px,92vw);max-height:calc(100vh - 60px);overflow-y:auto;padding:48px 48px 42px;border:1px solid rgba(91,226,249,.38);border-radius:14px;background:linear-gradient(145deg,rgba(3,19,30,.98),rgba(1,9,17,.98));box-shadow:0 0 60px rgba(46,198,229,.14),inset 0 0 40px rgba(38,163,190,.04);color:#eefaff}
    .make-ripple-close{position:absolute;right:10px;top:14px;width:40px;height:40px;border:1px solid rgba(110,225,246,.35);border-radius:50%;background:rgba(2,15,25,.45);color:#eefaff;font:28px/1 Arial,sans-serif;cursor:pointer}
    .make-ripple-close:hover{border-color:#63e6ff;box-shadow:0 0 16px rgba(70,224,250,.28)}
    .make-ripple-kicker{text-align:center;font-size:11px;letter-spacing:.34em;color:#9cebf8;opacity:.75;margin-bottom:12px}
    .make-ripple-box h2{margin:0;text-align:center;font-size:clamp(28px,4vw,42px);font-weight:400;letter-spacing:.08em;color:#eefaff;text-shadow:0 0 10px rgba(92,210,255,.24)}
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
    .make-ripple-cancel{border:1px solid rgba(100,220,230,.25);background:rgba(2,15,25,.4);color:rgba(238,250,255,.72)}
    .make-ripple-cancel:hover{border-color:rgba(100,220,230,.5);color:#eefaff}
    .make-ripple-submit{border:1px solid rgba(82,229,255,.85);background:rgba(8,55,68,.55);color:#eefaff;box-shadow:0 0 10px rgba(50,211,243,.1)}
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
     CLICK RIPPLES — DIRECT WATER INTERACTION
     A click creates a small, restrained disturbance at the point touched.
     This is intentionally much smaller and shorter-lived than an Impact
     Ripple so the three ripple types remain visually distinct.
  --------------------------------------------------------- */
  function createClickRipple(event) {
    const homebaseSky = document.getElementById("homebase-sky");
    if (!homebaseSky) return;

    /* Ignore clicks on existing database ripples. Their own click handler
       is reserved for opening the message/company information popup. */
    if (event.target.closest && event.target.closest(".impact-hitbox, .super-impact-hitbox")) {
      return;
    }

    /* Do not create a ripple when the click lands on visible page content. */
    if (event.target.closest && event.target.closest(".hero-title, a, button, input, textarea, label")) {
      return;
    }

    const rect = homebaseSky.getBoundingClientRect();
    const x = event.clientX - rect.left;
    const y = event.clientY - rect.top;

    /* Keep click-ripples below the title with an additional buffer equal
       to two full heights of the "THE RIPPLE WELL" title. This keeps the
       upper title area clear while allowing the lower Well to remain interactive. */
    const heroTitle = document.querySelector(".hero-title");
    if (heroTitle) {
      const titleRect = heroTitle.getBoundingClientRect();
      const titleBottom = titleRect.bottom - rect.top;
      const clickMinY = titleBottom + (titleRect.height * 2);
      if (y < clickMinY) return;
    }

    /* The click-ripple is only a water interaction. Keep it below the
       hero title and other intentional foreground content. */
    const ripple = document.createElement("span");
    ripple.className = "click-ripple";
    ripple.style.left = `${x}px`;
    ripple.style.top = `${y}px`;
    ripple.style.setProperty("--click-rotation", `${rand(`${x}:${y}`, -8, 8)}deg`);

    homebaseSky.appendChild(ripple);

    window.setTimeout(() => ripple.remove(), 900);
  }

  const homebaseSky = document.getElementById("homebase-sky");
  if (homebaseSky) {
    homebaseSky.addEventListener("click", createClickRipple);
  }

  /* ---------------------------------------------------------
     LOAD APPROVED IMPACT RIPPLES
  --------------------------------------------------------- */
  if (TEST_IMPACT_RIPPLE) {
    /* One isolated test ripple. No Supabase records are loaded in test mode. */
    addRipple({
      id: "TEST-IMPACT-001",
      message: "Enhanced Impact Ripple animation test",
      name: "Test Ripple",
      size: "large",
      type: "impact",
      testPosition: true
    });
    console.info("The Ripple Well: TEST IMPACT RIPPLE MODE active — one enhanced Impact Ripple only.");
  } else {
    fetch(`${SUPABASE_URL}/rest/v1/ripple_submissions?select=id,created_at,message,name,region,country,status,size,type&status=eq.approved&order=created_at.asc`, {
      headers: {
        apikey: SUPABASE_KEY,
        Authorization: `Bearer ${SUPABASE_KEY}`
      }
    })
      .then(response => response.ok ? response.json() : Promise.reject(new Error(`Supabase ${response.status}`)))
      .then(rows => rows.filter(row => row.type !== "super-impact").forEach(addRipple))
      .catch(error => console.warn("Impact Ripples could not be loaded:", error));

    /* ---------------------------------------------------------
       LOAD APPROVED SUPER-IMPACT RIPPLES
    --------------------------------------------------------- */
    fetch(`${SUPABASE_URL}/rest/v1/ripple_submissions?select=id,created_at,message,name,region,country,status,size,type,sir_id,organization_name,organization_address,organization_logo&status=eq.approved&type=eq.super-impact&order=created_at.asc`, {
      headers: {
        apikey: SUPABASE_KEY,
        Authorization: `Bearer ${SUPABASE_KEY}`
      }
    })
      .then(response => response.ok ? response.json() : Promise.reject(new Error(`Supabase Super-Impact ${response.status}`)))
      .then(rows => rows.forEach(addSuperImpactRipple))
      .catch(error => console.warn("Super-Impact Ripples could not be loaded:", error));
  }
})();
