/* ============================================================
   LUAN T. GAION — portfolio
   One rAF loop drives every scroll-linked effect:
     · --p per section (0..1) for parallax, drift and line draws
     · ambient background layers parked when off screen
     · chrome tone, progress bar, reveal fallback
   ============================================================ */
(() => {
  'use strict';

  /* ================= 1 · YOU ========================================
     No email or phone lives here on purpose. Anyone arriving from the CV
     already has both, so publishing them again on a public page adds
     nothing for that reader and exposes them to every scraper. LinkedIn
     is the contact instead: reachable, but revocable and controlled.  */
  const ME = {
    linkedin:   'https://www.linkedin.com/in/luan-tenca-gaion/',
    lookingFor: 'Part-time roles',
    field:      'Artificial intelligence · Software engineering',
    based:      'Sydney, Australia',
    timeZone:   'Australia/Sydney',
    github:     '',   /* 'https://github.com/your-handle' */
    resume:     ''    /* 'assets/Luan_Gaion_CV.pdf'       */
  };

  /* ================= 2 · CAPABILITIES ==============================
     The only place skills and spoken languages appear.            */
  const STACK = [
    { title: 'Programming',  items: [['Python'], ['Java'], ['JavaScript'], ['R']] },
    { title: 'Technologies', items: [['React'], ['Node.js'], ['SQL'], ['PL/SQL'], ['Git'], ['Agile / Scrum']] },
    { title: 'Spoken',       items: [['English', 'IELTS Academic 7.0'], ['Portuguese', 'Native']] }
  ];

  /* ================= 3 · PROJECTS ================================== */
  /* The playground index. Experiments live on their own page, so this array is
     read only there — the builder no-ops on the portfolio. An entry with no
     `link` renders inert rather than as a dead link, the same way an unset
     LinkedIn does in the contact block. */
  const EXPERIMENTS = [
    {
      name: 'Naruto Fangame',
      year: '2026',
      kind: 'Game',
      link: ''    /* a URL turns the row into a link; empty shows 'In progress' */
    }
  ];

  const PROJECTS = [
    {
      name: 'Creme de la Web',
      year: '2024',
      kind: 'Entertainment platform',
      role: 'Front-end developer',
      stack: ['React', 'Tailwind CSS', 'JavaScript'],
      summary: 'A responsive entertainment platform bringing videos, games and social interaction into one place.',
      prose: [
        'Creme de la Web is a responsive entertainment platform built with React and Tailwind CSS. Videos, games and social interaction sit side by side in a single interface that adapts from desktop down to phone.',
        'The build leans on a component-driven front end: one shared set of UI pieces and one layout system, so every section stays consistent as its content changes.'
      ],
      highlights: [
        'Responsive, mobile-first layout built with Tailwind CSS',
        'Component-driven React front end',
        'Video, games and social features in one interface'
      ],
      link: 'https://www.cremedelaweb.com.br/'
    },
    {
      name: 'All Talents Challenge',
      year: '2023',
      kind: 'Recruitment platform',
      role: 'Full-stack developer',
      stack: ['Angular', 'TypeScript', 'Web', 'Mobile'],
      summary: 'A web and mobile recruitment platform built to improve access to job opportunities.',
      prose: [
        'All Talents Challenge is a recruitment platform developed with Angular and delivered for both web and mobile, with one goal: make job opportunities easier to reach for the people who need them.',
        'The work covered the flow end to end — how listings are structured, how candidates move through them, and how the same experience holds together on a small screen.'
      ],
      highlights: [
        'Angular application delivered for web and mobile',
        'Designed around widening access to job opportunities',
        'Shared candidate flow across both platforms'
      ],
      link: ''
    },
    {
      name: 'Innovation Challenge',
      year: '2022',
      kind: 'Data solution · with Scania',
      role: 'Java developer',
      stack: ['Java', 'Data analysis'],
      summary: 'A data-driven Java solution developed in partnership with Scania for urban mobility analysis.',
      prose: [
        'Built in partnership with Scania, this Java solution analyses urban mobility data — turning raw movement records into something a decision can be made from.',
        'Working with an industry partner set the terms: a real problem statement, real constraints, and a result that had to stand up to the people who live with the domain every day.'
      ],
      highlights: [
        'Delivered in partnership with Scania',
        'Java solution for urban mobility analysis',
        'Data-driven approach to a live industry problem'
      ],
      link: ''
    },
    {
      name: 'Digital Care Challenge',
      year: '2021',
      kind: 'Accessibility application',
      role: 'Java developer',
      stack: ['Java', 'Accessibility'],
      summary: 'An accessibility-focused Java application designed to support workplace inclusion.',
      prose: [
        'Digital Care Challenge is a Java application built around accessibility, designed to support inclusion in the workplace.',
        'Accessibility was the brief rather than a finishing touch, which meant it shaped decisions from the first screen onward instead of being retrofitted at the end.'
      ],
      highlights: [
        'Accessibility-focused Java application',
        'Designed to support workplace inclusion',
        'Accessibility treated as the starting requirement'
      ],
      link: ''
    },
    {
      name: 'RoboCup',
      year: '2019',
      kind: 'Robotics',
      role: 'Hardware and software',
      stack: ['Arduino', 'Robotics', 'Smartphone control'],
      summary: 'An Arduino-based rescue robot, driven from a smartphone, for emergency response simulations.',
      prose: [
        'A rescue robot built on Arduino and controlled from a smartphone, made for emergency response simulations.',
        'The first project on this list where the code had to survive contact with hardware: motors, sensors and a live control link, all of which had to behave under competition conditions.'
      ],
      highlights: [
        'Arduino-based rescue robot',
        'Smartphone-driven control link',
        'Built for emergency response simulations'
      ],
      link: ''
    }
  ];

  /* ================= 4 · HELPERS =================================== */
  const $  = (s, r = document) => r.querySelector(s);
  const $$ = (s, r = document) => [...r.querySelectorAll(s)];
  const pad = n => String(n).padStart(2, '0');
  const esc = s => String(s).replace(/[<>]/g, c => (c === '<' ? '&lt;' : '&gt;'));
  const clamp = (v, a, b) => (v < a ? a : v > b ? b : v);
  const reduced = matchMedia('(prefers-reduced-motion: reduce)').matches;

  /* ================= 5 · BUILD ===================================== */

  /* hero stats — every number is derived, so they cannot drift out of
     date, and none of them repeat prose found elsewhere */
  function buildStats() {
    const host = $('#stats');
    if (!host) return;
    const years = new Date().getFullYear() -
                  Math.min(...PROJECTS.map(p => +p.year));
    const tools = new Set();
    STACK.slice(0, 2).forEach(c => c.items.forEach(([n]) => tools.add(n)));
    const rows = [
      [PROJECTS.length, 'Selected projects'],
      [years,           'Years building'],
      [2,               'Degrees'],
      [tools.size,      'Tools in the stack']
    ];
    host.innerHTML = rows.map(([n, l]) =>
      `<div class="st"><dt data-count="${n}">0</dt><dd>${l}</dd></div>`).join('');
  }

  function buildStack() {
    const host = $('#stackCols');
    if (host) host.innerHTML = STACK.map(c =>
      `<div class="col"><h3>${c.title}</h3><ul>` +
      c.items.map(([n, sub]) =>
        `<li>${esc(n)}${sub ? `<small>${esc(sub)}</small>` : ''}</li>`).join('') +
      `</ul></div>`).join('');
  }

  function buildWork() {
    const host = $('#workIndex');
    if (!host) return;
    host.innerHTML = PROJECTS.map((p, i) =>
      `<li class="iw" style="--i:${i + 1}">` +
      `<button type="button" data-i="${i}" aria-label="${esc(p.name)}, ${esc(p.year)}. Read more.">` +
      `<span class="i-num">${pad(i + 1)}</span>` +
      `<span class="i-main"><span class="i-name">${esc(p.name)}</span>` +
      `<span class="i-kind">${esc(p.year)} &middot; ${esc(p.kind)}</span></span>` +
      `<span class="i-go"><svg viewBox="0 0 40 16"><use href="#i-arr"/></svg></span>` +
      `</button></li>`).join('');

    const c = $('#workCount');
    if (c) c.textContent = pad(PROJECTS.length);

    host.addEventListener('click', e => {
      const b = e.target.closest('button[data-i]');
      if (b) open(+b.dataset.i);
    });
  }

  function buildPlayground() {
    const host = $('#pgIndex');
    if (!host) return;
    host.innerHTML = EXPERIMENTS.map((x, i) => {
      const meta =
        `<span class="i-num">${pad(i + 1)}</span>` +
        `<span class="i-main"><span class="i-name">${esc(x.name)}</span>` +
        `<span class="i-kind">${esc(x.year)} &middot; ${esc(x.kind)}</span></span>`;
      const body = x.link
        ? `<a href="${esc(x.link)}" aria-label="${esc(x.name)}, open">${meta}` +
          `<span class="i-go"><svg viewBox="0 0 40 16"><use href="#i-arr"/></svg></span></a>`
        : `<div class="idle">${meta}<span class="i-soon">In progress</span></div>`;
      return `<li class="iw" style="--i:${i + 1}">${body}</li>`;
    }).join('');

    const c = $('#pgCount');
    if (c) c.textContent = pad(EXPERIMENTS.length);
  }

  function buildContact() {
    const spec = $('#spec');
    if (spec) {
      spec.innerHTML =
        `<dt>Looking for</dt><dd>${esc(ME.lookingFor)}</dd>` +
        `<dt>Field</dt><dd>${esc(ME.field)}</dd>` +
        `<dt>Based</dt><dd>${esc(ME.based)}</dd>` +
        `<dt>Local time</dt><dd><span class="live"><i></i><span id="clock">--:--</span></span></dd>`;
      startClock();
    }

    /* the one action of the section. It shows the platform, not the handle:
       the URL adds nothing a reader needs and only clutters the line. */
    const reply = $('#reply');
    if (reply) {
      reply.innerHTML = ME.linkedin
        ? `<a class="copy" href="${ME.linkedin}" target="_blank" rel="noopener noreferrer" ` +
          `aria-label="LinkedIn profile — opens in a new tab">` +
          `<span class="copy-v">LinkedIn</span><span class="copy-a">Open</span></a>`
        : `<div class="copy is-empty"><span class="copy-v">LinkedIn</span>` +
          `<span class="copy-a">Set in site.js</span></div>`;
    }

    /* secondary links: only the ones that actually exist */
    const host = $('#elsewhere');
    if (host) {
      const arrow = '<svg viewBox="0 0 20 20" aria-hidden="true"><use href="#i-diag"/></svg>';
      const rows = [
        ME.github && ['GitHub', ME.github],
        ME.resume && ['Download CV', ME.resume]
      ].filter(Boolean);
      host.innerHTML = rows.map(([label, href]) => {
        const ext = href.startsWith('http')
          ? ` target="_blank" rel="noopener noreferrer" aria-label="${label} — opens in a new tab"`
          : '';
        return `<li><a href="${href}"${ext}>${label}${arrow}</a></li>`;
      }).join('');
    }
  }

  /* A live clock in your timezone. It tells a recruiter abroad whether it
     is a civil hour to reach out, and quietly shows the page is kept up. */
  function startClock() {
    const el = $('#clock');
    if (!el) return;
    const fmt = new Intl.DateTimeFormat('en-GB', {
      hour: '2-digit', minute: '2-digit', hour12: false, timeZone: ME.timeZone
    });
    const tick = () => { el.textContent = fmt.format(new Date()); };
    tick();
    setInterval(tick, 15000);
  }

  function buildRail() {
    const host = $('#rail');
    if (host) host.innerHTML = $$('.sec').map(s =>
      `<a href="#${s.id}" data-for="${s.id}"><i></i>${s.dataset.idx}</a>`).join('');
  }

  /* split the hero name into per-character masks */
  function splitTitle() {
    $$('[data-split]').forEach((line, li) => {
      const text = line.textContent.trim();
      line.setAttribute('aria-hidden', 'true');
      line.innerHTML = [...text].map((ch, i) =>
        `<span class="ch" style="--c:${li * 5 + i}"><i>${esc(ch)}</i></span>`).join('');
    });
  }

  /* animated backdrops register here so the one rAF loop drives them */
  const ANIM = [];

  /* ================= 5b · BACKDROPS ================================
     Each section gets one large geometric structure. Built here rather
     than in markup so the counts stay tunable in one place.        */
  const BACKDROP = {
    /* rings streaming out of the centre, evenly phased */
    portal(el) {
      const n = 9, dur = 11;
      el.innerHTML = Array.from({ length: n }, (_, i) =>
        `<span style="animation-delay:${(-dur / n * i).toFixed(2)}s"></span>`).join('');
    },

    /* a single plane; the perspective and motion live in CSS */
    grid(el) { el.innerHTML = '<i></i>'; },

    /* Wireframe funnel on a canvas. The spokes genuinely revolve around
       the funnel's axis and twist with depth, so it reads as a vortex
       turning in space. A 2-D rotation cannot do this: the rings are
       perspective ellipses, so spinning the whole thing in the plane just
       tumbles it. Rebuilding the geometry each frame is the honest way. */
    vortex(el) {
      const cvs = document.createElement('canvas');
      el.appendChild(cvs);
      const ctx = cvs.getContext('2d');

      const TAU = Math.PI * 2;
      const K = 0.34;          /* how flat the rings sit (perspective squash) */
      const RINGS = 13, SPOKES = 34, SEG = 26;
      const SWIRL = 2.4;       /* radians of twist between rim and throat */

      let w = 0, h = 0, cx = 0, cy = 0, rMin = 0, rMax = 0, rise = 0;
      let phase = 0, last = performance.now();

      function resize() {
        const r = el.getBoundingClientRect();
        const dpr = Math.min(window.devicePixelRatio || 1, 2);
        w = Math.max(1, Math.round(r.width));
        h = Math.max(1, Math.round(r.height));
        cvs.width = Math.round(w * dpr);
        cvs.height = Math.round(h * dpr);
        cvs.style.width = w + 'px';
        cvs.style.height = h + 'px';
        ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
        /* scale the funnel to the box so it works at any viewport */
        cx = w / 2;
        cy = h * 0.54;
        rMax = Math.max(w, h) * 0.62;
        rMin = Math.max(8, rMax * 0.035);
        rise = h * 0.16;
      }

      const rAt = t => rMin * Math.pow(rMax / rMin, t);
      const yAt = t => cy + (1 - t) * rise;

      function draw(now, running) {
        const dt = Math.min(64, now - last);
        last = now;
        if (running) phase += dt * 0.00018;

        ctx.clearRect(0, 0, w, h);
        ctx.strokeStyle = getComputedStyle(el).color;
        ctx.lineWidth = 1;

        for (let i = 0; i <= RINGS; i++) {
          const t = i / RINGS, r = rAt(t), y = yAt(t);
          ctx.globalAlpha = 0.20 + t * 0.55;
          ctx.beginPath();
          ctx.ellipse(cx, y, r, r * K, 0, 0, TAU);
          ctx.stroke();
        }

        for (let sp = 0; sp < SPOKES; sp++) {
          const a0 = (sp / SPOKES) * TAU + phase;
          ctx.globalAlpha = 0.42;
          ctx.beginPath();
          for (let i = 0; i <= SEG; i++) {
            const t = i / SEG, r = rAt(t), y = yAt(t);
            const a = a0 + (1 - t) * SWIRL;     /* deeper = more twist */
            const x = cx + Math.cos(a) * r;
            const yy = y + Math.sin(a) * r * K;
            if (i) ctx.lineTo(x, yy); else ctx.moveTo(x, yy);
          }
          ctx.stroke();
        }
        ctx.globalAlpha = 1;
      }

      resize();
      ANIM.push({ resize, draw, sec: el.closest('.sec') });
    },

    /* rings expanding from the centre. No sweep arm: a straight hairline
       crossing the spec rows read as a rendering glitch, not as design. */
    signal(el) {
      const n = 4, dur = 13;
      el.innerHTML = Array.from({ length: n }, (_, i) =>
        `<span style="animation-delay:${(-dur / n * i).toFixed(2)}s"></span>`).join('');
    }
  };

  function buildBackdrops() {
    $$('[data-bg]').forEach(el => {
      const fn = BACKDROP[el.dataset.bg];
      if (fn) fn(el);
    });
  }

  /* ================= 6 · SCROLL ENGINE =============================
     Everything scroll-linked runs from one rAF pass.               */
  const SECS = $$('.sec');
  const TRACKED = $$('[data-track]');

  function toneAt(y) {
    for (const s of SECS) {
      const b = s.getBoundingClientRect();
      if (b.top <= y && b.bottom > y) return s.classList.contains('inv') ? 'ink' : 'paper';
    }
    return 'paper';
  }

  /* Two different scroll signals, because two kinds of effect need them:

     --p  "how far through its own range"  — 0 while the element still owns
          the screen, 1 once it has been scrolled past. A section sitting at
          the top of the document reads 0, which is what the hero needs so it
          starts fully opaque.
     --v  "how far across the viewport"    — 0 as it enters from the bottom,
          1 as it leaves past the top. Used for drift and line-draws that
          should move while the section is being read. */
  function progressOf(el) {
    const r = el.getBoundingClientRect();
    const len = el.offsetHeight - innerHeight;
    /* Only treat this as a long scroll range when there genuinely is one.
       A section a few pixels taller than the viewport (the hero is 803px in
       an 800px window) would otherwise run 0 -> 1 across three pixels and
       everything keyed to --p would snap instead of animate. */
    if (len > innerHeight * 0.25) return clamp(-r.top / len, 0, 1);
    return clamp(-r.top / (r.height || 1), 0, 1);
  }
  function viewportOf(el) {
    const r = el.getBoundingClientRect();
    return clamp((innerHeight - r.top) / (innerHeight + r.height), 0, 1);
  }

  const root = document.documentElement;
  const bar  = $('#progBar');

  function frame() {
    /* per-section progress */
    for (const el of TRACKED) {
      el.style.setProperty('--p', progressOf(el).toFixed(4));
      el.style.setProperty('--v', viewportOf(el).toFixed(4));
    }

    /* progress bar + chrome tone */
    if (bar) {
      const max = root.scrollHeight - innerHeight;
      bar.style.width = (max > 0 ? (scrollY / max) * 100 : 0) + '%';
    }
    root.dataset.top = toneAt(30);
    root.dataset.mid = toneAt(innerHeight / 2);

    /* reveal fallback: a fast jump or deep link must never strand a
       section at opacity 0. The same pass parks the ambient background
       animations of sections that are off screen. */
    for (const s of SECS) {
      const r = s.getBoundingClientRect();
      if (!s.classList.contains('in') && r.top < innerHeight * 0.94) s.classList.add('in');
      s.classList.toggle('vis', r.bottom > -200 && r.top < innerHeight + 200);
    }

    /* timeline entries light in sequence as the spine draws */
    for (const li of $$('[data-tl]')) {
      if (!li.classList.contains('lit') &&
          li.getBoundingClientRect().top < innerHeight * 0.86) li.classList.add('lit');
    }

    /* canvas backdrops: drawn from this same loop. Off-screen ones skip
       the draw entirely; `reduced` freezes the phase but still paints. */
    if (ANIM.length) {
      const now = performance.now();
      for (const a of ANIM) {
        if (!a.sec.classList.contains('vis')) continue;
        /* with reduced motion the phase never advances, so one painted
           frame is the whole animation — no point redrawing it */
        if (reduced && a.painted) continue;
        a.draw(now, !reduced);
        a.painted = true;
      }
    }

    requestAnimationFrame(frame);
  }

  /* ================= 7 · COUNT-UP =================================== */
  function counters() {
    const nums = $$('[data-count]');
    if (!nums.length) return;
    if (reduced) { nums.forEach(n => { n.textContent = pad(+n.dataset.count); }); return; }
    const io = new IntersectionObserver((es, obs) => {
      es.forEach(e => {
        if (!e.isIntersecting) return;
        obs.unobserve(e.target);
        const target = +e.target.dataset.count, t0 = performance.now(), dur = 1100;
        const step = now => {
          const k = clamp((now - t0) / dur, 0, 1);
          const eased = 1 - Math.pow(1 - k, 3);
          e.target.textContent = pad(Math.round(target * eased));
          if (k < 1) requestAnimationFrame(step);
        };
        requestAnimationFrame(step);
      });
    }, { threshold: 0.5 });
    nums.forEach(n => io.observe(n));
  }

  /* ================= 8 · REVEALS + RAIL ============================= */
  function observe() {
    const secs = $$('[data-io]');
    if (!('IntersectionObserver' in window)) {
      secs.forEach(s => s.classList.add('in'));
    } else {
      const io = new IntersectionObserver((es, obs) => {
        es.forEach(e => {
          if (!e.isIntersecting) return;
          e.target.classList.add('in');
          obs.unobserve(e.target);
        });
      }, { rootMargin: '0px 0px -12% 0px', threshold: 0.06 });
      secs.forEach(s => io.observe(s));
    }

    const links = $$('#rail a');
    if (!links.length || !('IntersectionObserver' in window)) return;
    const active = new IntersectionObserver(es => {
      es.forEach(e => {
        if (!e.isIntersecting) return;
        links.forEach(a => a.classList.toggle('on', a.dataset.for === e.target.id));
      });
    }, { rootMargin: '-50% 0px -50% 0px' });
    SECS.forEach(s => active.observe(s));
  }

  /* ================= 8b · THEME =====================================
     The inline script in <head> already set the theme before first paint.
     This only wires the toggle and keeps following the system setting for
     as long as the visitor has not made a choice of their own.        */
  function initTheme() {
    const root = document.documentElement;
    const btn  = $('#themeBtn');
    const meta = document.querySelector('meta[name="theme-color"]');

    const apply = t => {
      root.dataset.theme = t;
      const dark = t === 'dark';
      if (meta) meta.setAttribute('content', dark ? '#0A0A0A' : '#FFFFFF');
      if (btn) {
        btn.setAttribute('aria-pressed', String(dark));
        btn.setAttribute('aria-label', dark ? 'Switch to light theme' : 'Switch to dark theme');
      }
    };

    /* Dark is the house theme, so the site opens dark regardless of the OS
       setting. A visitor who toggles gets their choice remembered. */
    let stored = null;
    try { stored = localStorage.getItem('theme'); } catch (_) {}
    apply(stored || 'dark');

    if (btn) btn.addEventListener('click', () => {
      const next = root.dataset.theme === 'dark' ? 'light' : 'dark';
      try { localStorage.setItem('theme', next); } catch (_) {}
      apply(next);
      /* the canvas backdrop reads its colour per frame, but a parked one
         holds a stale frame — force it to repaint in the new tone */
      ANIM.forEach(a => { a.painted = false; });
    });
  }

  /* ================= 9 · CURSOR ==================================== */
  function cursor() {
    const dot = $('#cursor');
    if (!dot || reduced || !matchMedia('(hover:hover) and (pointer:fine)').matches) return;
    let x = innerWidth / 2, y = innerHeight / 2, cx = x, cy = y, raf = 0, tone = '';

    /* Controls in the fixed header do not just enlarge the dot: the dot
       merges into them, becoming a filled pill behind the label. It drops
       below the header's z-index so the text sits on top, and the label
       flips to the section's background tone to stay readable on it. */
    let magnet = null;

    const loop = () => {
      if (magnet) {
        const r = magnet.getBoundingClientRect();
        /* snap harder than the free cursor so it feels captured */
        cx += (r.left + r.width / 2 - cx) * 0.3;
        cy += (r.top + r.height / 2 - cy) * 0.3;
        dot.style.width  = Math.round(r.width + 26) + 'px';
        dot.style.height = Math.round(r.height + 18) + 'px';
      } else {
        cx += (x - cx) * 0.2;
        cy += (y - cy) * 0.2;
      }
      dot.style.transform = `translate3d(${cx}px,${cy}px,0) translate(-50%,-50%)`;
      const t = toneAt(cy);
      if (t !== tone) { tone = t; root.dataset.cur = t; }
      raf = requestAnimationFrame(loop);
    };

    addEventListener('pointermove', e => {
      x = e.clientX; y = e.clientY;
      dot.classList.add('show');
      if (!raf) raf = requestAnimationFrame(loop);
    }, { passive: true });

    document.addEventListener('pointerover', e => {
      const mag = e.target.closest('.chrome a, .chrome button');
      if (mag !== magnet) {
        if (magnet) magnet.classList.remove('magnet');
        magnet = mag;
        if (magnet) magnet.classList.add('magnet');
        else { dot.style.width = ''; dot.style.height = ''; }
        dot.classList.toggle('merged', !!magnet);
        /* the playground gets a squared pill, so the difference is legible
           at a glance and not only while the letters are churning */
        dot.classList.toggle('merged-pg', !!(magnet && magnet.classList.contains('pg-link')));
      }
      dot.classList.toggle('big', !magnet && !!e.target.closest('a,button'));
    });

    document.addEventListener('pointerleave', () => {
      dot.classList.remove('show');
      if (magnet) { magnet.classList.remove('magnet'); magnet = null; }
      dot.classList.remove('merged', 'merged-pg');
      dot.style.width = ''; dot.style.height = '';
    });
  }

  /* ================= 9b · SCRAMBLE ===================================
     The Playground link looks like its neighbours at rest; on hover the
     letters resolve out of noise. It only works cleanly because the nav
     is set in JetBrains Mono — every glyph is the same width, so nothing
     shifts while the characters churn. */
  function scramble() {
    const el = $('.pg-link');
    if (!el || reduced) return;
    const label = el.dataset.label || el.textContent;
    const pool = '!<>-_\/[]{}=+*^?#';
    let raf = 0;

    const stop = () => { cancelAnimationFrame(raf); raf = 0; el.textContent = label; };

    el.addEventListener('pointerenter', () => {
      if (raf) return;
      /* Every character starts as noise and they resolve left to right.
         Stepped every other frame: at 60fps a fresh glyph each frame reads
         as a blur, at 30 it reads as characters. Budget ~27 updates, so
         ~54 frames, so ~0.9s — long enough to read, short enough that the
         label is settled before a pointer normally moves on. */
      const q = [...label].map((ch, i) => ({
        ch,
        end: Math.round(Math.random() * 5) + 8 + i * 1.5,
        r: ''
      }));
      let f = 0, tick = 0;
      const step = () => {
        if (tick++ % 2) { raf = requestAnimationFrame(step); return; }
        let out = '', done = 0;
        for (const it of q) {
          if (f >= it.end) { out += it.ch; done++; }
          else {
            if (!it.r || Math.random() < 0.75) it.r = pool[Math.floor(Math.random() * pool.length)];
            out += it.r;
          }
        }
        el.textContent = out;
        if (done === q.length) { raf = 0; return; }
        f++;
        raf = requestAnimationFrame(step);
      };
      step();
    });

    /* never leave the nav showing noise if the pointer darts away */
    el.addEventListener('pointerleave', stop);
    el.addEventListener('blur', stop);
  }

  /* ================= 10 · PROJECT OVERLAY ========================== */
  const ov = $('#ov');
  let idx = -1, lastFocus = null;

  function render(i) {
    const p = PROJECTS[i];
    if (!p) return;
    idx = i;
    const meta = $('#ovIndex');
    meta.textContent = `${pad(i + 1)} / ${pad(PROJECTS.length)}`;
    meta.setAttribute('aria-label', `Project ${i + 1} of ${PROJECTS.length}`);
    $('#ovTitle').textContent = p.name;
    $('#ovSum').textContent   = p.summary;
    $('#ovYear').textContent  = p.year;
    $('#ovKind').textContent  = p.kind;
    $('#ovRole').textContent  = p.role;
    $('#ovProse').innerHTML   = p.prose.map(t => `<p>${t}</p>`).join('');
    $('#ovStack').innerHTML   = p.stack.map(s => `<li>${esc(s)}</li>`).join('');
    $('#ovHi').innerHTML      = p.highlights.map(h => `<li>${esc(h)}</li>`).join('');
    $('#ovLink').innerHTML = p.link
      ? `<a class="ov-cta" href="${p.link}" target="_blank" rel="noopener noreferrer" ` +
        `aria-label="Visit ${esc(p.name)} — opens in a new tab">` +
        `<span>Visit project</span><svg viewBox="0 0 20 20" aria-hidden="true"><use href="#i-diag"/></svg></a>`
      : `<p class="ov-note">Case study coming soon</p>`;
    const prev = $('#ovPrev'), next = $('#ovNext');
    prev.disabled = i === 0;
    next.disabled = i === PROJECTS.length - 1;
    prev.querySelector('.n').textContent = i > 0 ? PROJECTS[i - 1].name : '—';
    next.querySelector('.n').textContent = i < PROJECTS.length - 1 ? PROJECTS[i + 1].name : '—';
    $('#ovScroll').scrollTop = 0;
  }

  function open(i) {
    if (!ov) return;
    lastFocus = document.activeElement;
    ov.hidden = false;
    ov.classList.add('open');
    lock(true);
    render(i);
    requestAnimationFrame(() => $('.ov-close', ov).focus());
  }

  function close() {
    if (!ov || ov.hidden) return;
    ov.classList.remove('open');
    ov.hidden = true;
    lock(false);
    const back = $(`#workIndex button[data-i="${idx}"]`) ||
                 (lastFocus && lastFocus.isConnected && lastFocus !== document.body ? lastFocus : null);
    if (back) back.focus({ preventScroll: true });
  }

  function lock(on) {
    if (on) {
      const w = innerWidth - root.clientWidth;
      root.style.overflow = 'hidden';
      if (w > 0) root.style.paddingRight = w + 'px';
      document.body.classList.add('locked');
    } else {
      root.style.overflow = '';
      root.style.paddingRight = '';
      document.body.classList.remove('locked');
    }
  }

  function wire() {
    if (!ov) return;
    $$('[data-close]', ov).forEach(el => el.addEventListener('click', close));
    $('#ovPrev').addEventListener('click', () => idx > 0 && render(idx - 1));
    $('#ovNext').addEventListener('click', () => idx < PROJECTS.length - 1 && render(idx + 1));
    document.addEventListener('keydown', e => {
      if (ov.hidden) return;
      if (e.key === 'Escape')      { close(); return; }
      if (e.key === 'ArrowLeft'  && idx > 0)                   { render(idx - 1); return; }
      if (e.key === 'ArrowRight' && idx < PROJECTS.length - 1) { render(idx + 1); return; }
      if (e.key !== 'Tab') return;
      const f = $$('a[href],button:not([disabled]),[tabindex]:not([tabindex="-1"])', ov)
        .filter(el => el.offsetParent !== null);
      if (!f.length) return;
      const first = f[0], last = f[f.length - 1];
      if (e.shiftKey && document.activeElement === first) { e.preventDefault(); last.focus(); }
      else if (!e.shiftKey && document.activeElement === last) { e.preventDefault(); first.focus(); }
    });
  }

  /* ================= 11 · BOOT ===================================== */
  buildStats(); buildStack(); buildWork(); buildPlayground(); buildContact(); buildRail(); buildBackdrops();
  splitTitle(); observe(); counters(); cursor(); wire(); initTheme(); scramble();

  const y = new Date().getFullYear();
  const yr = $('#yr');
  if (yr) yr.textContent = y;

  /* canvas backdrops re-measure once webfonts land and on any resize */
  const remeasure = () => {
    ANIM.forEach(a => { a.resize(); a.painted = false; });
  };
  addEventListener('resize', remeasure);
  if (document.fonts && document.fonts.ready) document.fonts.ready.then(remeasure);

  requestAnimationFrame(() => { $('#hero') && $('#hero').classList.add('in'); });
  requestAnimationFrame(frame);
})();
