/* =========================================================
   DAVI ARTUR — main.js
   Interações do site (sem dependências).
   ========================================================= */
(function () {
  "use strict";

  const DATA = window.PORTFOLIO;
  const $ = (sel, ctx) => (ctx || document).querySelector(sel);
  const $$ = (sel, ctx) => Array.from((ctx || document).querySelectorAll(sel));
  const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  const finePointer = window.matchMedia("(pointer: fine)").matches;
  const icon = (name, cls) =>
    `<svg class="icon ${cls || ""}" aria-hidden="true"><use href="#i-${name}"/></svg>`;
  const esc = (s) =>
    String(s).replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]));
  const norm = (s) =>
    String(s).toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "");

  let toastTimer;
  function toast(message) {
    const el = $("#toast");
    if (!el) return;
    el.textContent = message;
    el.classList.add("is-visible");
    clearTimeout(toastTimer);
    toastTimer = setTimeout(() => el.classList.remove("is-visible"), 2800);
  }
  window.portfolioToast = toast;

  /* ---------------------------------------------------------
     Tema
     --------------------------------------------------------- */
  function initTheme() {
    const root = document.documentElement;
    const btn = $("#theme-toggle");
    const meta = $('meta[name="theme-color"]');
    let saved = null;
    try { saved = localStorage.getItem("davi-theme"); } catch (e) {}

    const initial = saved || "dark";
    apply(initial);

    function apply(theme) {
      root.setAttribute("data-theme", theme);
      if (meta) meta.setAttribute("content", theme === "light" ? "#f4f7fc" : "#070a12");
      if (btn) {
        btn.setAttribute("aria-label", theme === "light" ? "Mudar para tema escuro" : "Mudar para tema claro");
        btn.setAttribute("title", theme === "light" ? "Tema escuro" : "Tema claro");
      }
      window.dispatchEvent(new CustomEvent("themechange", { detail: { theme } }));
    }

    if (btn) {
      btn.addEventListener("click", () => {
        const next = root.getAttribute("data-theme") === "dark" ? "light" : "dark";
        apply(next);
        try { localStorage.setItem("davi-theme", next); } catch (e) {}
        toast(next === "dark" ? "Tema escuro ativado" : "Tema claro ativado");
      });
    }
  }

  /* ---------------------------------------------------------
     Fundo em Canvas
     --------------------------------------------------------- */
  function initBackground() {
    const canvas = $("#bg-canvas");
    if (!canvas) return { setMatrix() {}, refresh() {} };
    const ctx = canvas.getContext("2d");
    let w = 0, h = 0, dpr = 1;
    let particles = [];
    let raf = null;
    let matrixUntil = 0;
    const mouse = { x: -9999, y: -9999, active: false };

    const palettes = {
      dark: ["#58a6ff", "#22d3ee", "#a371f7", "#3fb950", "#f7df1e"],
      light: ["#2563eb", "#0891b2", "#7c3aed", "#1a7f37", "#b45309"]
    };
    const matrixColors = ["#3fb950", "#4fd18b", "#22d3ee", "#2ea043"];

    const theme = () => document.documentElement.getAttribute("data-theme") || "dark";
    const isMatrix = () => performance.now() < matrixUntil;
    const colors = () => (isMatrix() ? matrixColors : palettes[theme()] || palettes.dark);

    function resize() {
      const rect = canvas.getBoundingClientRect();
      w = rect.width;
      h = rect.height;
      dpr = Math.min(window.devicePixelRatio || 1, 2);
      canvas.width = Math.round(w * dpr);
      canvas.height = Math.round(h * dpr);
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      seed();
    }

    function seed() {
      const target = Math.max(26, Math.min(88, Math.round((w * h) / 20000)));
      particles = Array.from({ length: target }, () => ({
        x: Math.random() * w,
        y: Math.random() * h,
        vx: (Math.random() - 0.5) * 0.22,
        vy: (Math.random() - 0.5) * 0.22,
        r: 0.8 + Math.random() * 1.6,
        c: Math.floor(Math.random() * 5),
        a: 0.25 + Math.random() * 0.4
      }));
    }

    function draw() {
      ctx.clearRect(0, 0, w, h);
      const cols = colors();
      const linkDist = 136;

      for (let i = 0; i < particles.length; i++) {
        const p = particles[i];
        p.x += p.vx;
        p.y += p.vy;
        if (p.x < -20) p.x = w + 20;
        if (p.x > w + 20) p.x = -20;
        if (p.y < -20) p.y = h + 20;
        if (p.y > h + 20) p.y = -20;

        if (mouse.active) {
          const dx = p.x - mouse.x;
          const dy = p.y - mouse.y;
          const d2 = dx * dx + dy * dy;
          if (d2 < 15000 && d2 > 0.01) {
            const force = (1 - d2 / 15000) * 0.35;
            const d = Math.sqrt(d2);
            p.x += (dx / d) * force;
            p.y += (dy / d) * force;
          }
        }

        const color = cols[p.c % cols.length];
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
        ctx.fillStyle = hexA(color, p.a);
        ctx.fill();

        for (let j = i + 1; j < particles.length; j++) {
          const q = particles[j];
          const dx = p.x - q.x;
          const dy = p.y - q.y;
          const dist = Math.sqrt(dx * dx + dy * dy);
          if (dist < linkDist) {
            const alpha = (1 - dist / linkDist) * (isMatrix() ? 0.22 : 0.1);
            ctx.beginPath();
            ctx.moveTo(p.x, p.y);
            ctx.lineTo(q.x, q.y);
            ctx.strokeStyle = hexA(color, alpha);
            ctx.lineWidth = 0.7;
            ctx.stroke();
          }
        }
      }

      if (mouse.active) {
        const g = ctx.createRadialGradient(mouse.x, mouse.y, 0, mouse.x, mouse.y, 220);
        g.addColorStop(0, isMatrix() ? "rgba(63,185,80,0.06)" : "rgba(34,211,238,0.05)");
        g.addColorStop(1, "rgba(0,0,0,0)");
        ctx.fillStyle = g;
        ctx.fillRect(mouse.x - 220, mouse.y - 220, 440, 440);
      }

      raf = requestAnimationFrame(draw);
    }

    function hexA(hex, alpha) {
      const n = parseInt(hex.slice(1), 16);
      return `rgba(${(n >> 16) & 255},${(n >> 8) & 255},${n & 255},${alpha})`;
    }

    function start() {
      if (reduced) {
        ctx.clearRect(0, 0, w, h);
        const cols = colors();
        particles.forEach((p, i) => {
          ctx.beginPath();
          ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
          ctx.fillStyle = hexA(cols[p.c % cols.length], 0.35);
          ctx.fill();
          for (let j = i + 1; j < particles.length; j++) {
            const q = particles[j];
            const dist = Math.hypot(p.x - q.x, p.y - q.y);
            if (dist < 136) {
              ctx.beginPath();
              ctx.moveTo(p.x, p.y);
              ctx.lineTo(q.x, q.y);
              ctx.strokeStyle = hexA(cols[p.c % cols.length], 0.08);
              ctx.stroke();
            }
          }
        });
        return;
      }
      stop();
      raf = requestAnimationFrame(draw);
    }

    function stop() {
      if (raf) cancelAnimationFrame(raf);
      raf = null;
    }

    let resizeTimer;
    window.addEventListener("resize", () => {
      clearTimeout(resizeTimer);
      resizeTimer = setTimeout(() => {
        resize();
        if (reduced) start();
      }, 150);
    });

    window.addEventListener("pointermove", (e) => {
      if (!finePointer) return;
      mouse.x = e.clientX;
      mouse.y = e.clientY;
      mouse.active = true;
    }, { passive: true });

    window.addEventListener("pointerleave", () => { mouse.active = false; });
    document.addEventListener("visibilitychange", () => {
      if (document.hidden) stop();
      else if (!reduced) start();
    });

    window.addEventListener("themechange", () => {
      if (reduced) start();
    });

    resize();
    start();

    return {
      setMatrix(ms) {
        matrixUntil = performance.now() + (ms || 6000);
        setTimeout(() => { if (!reduced) start(); }, (ms || 6000) + 60);
      },
      refresh() { resize(); }
    };
  }

  /* ---------------------------------------------------------
     Header, progresso, navegação
     --------------------------------------------------------- */
  function initHeader() {
    const header = $("#site-header");
    const progress = $("#scroll-progress");
    const nav = $("#nav");
    const toggle = $("#menu-toggle");
    const links = $$("[data-nav]");
    const sections = links
      .map((a) => document.getElementById(a.dataset.nav))
      .filter(Boolean);

    let ticking = false;
    function onScroll() {
      const top = window.scrollY || document.documentElement.scrollTop;
      if (header) header.classList.toggle("is-scrolled", top > 8);
      const max = document.documentElement.scrollHeight - window.innerHeight;
      if (progress) progress.style.width = `${max > 0 ? Math.min(100, (top / max) * 100) : 0}%`;

      let current = "";
      const offset = window.innerHeight * 0.32;
      sections.forEach((sec) => {
        if (sec.getBoundingClientRect().top <= offset) current = sec.id;
      });
      links.forEach((a) => a.classList.toggle("is-active", a.dataset.nav === current));
      ticking = false;
    }

    window.addEventListener("scroll", () => {
      if (!ticking) {
        ticking = true;
        requestAnimationFrame(onScroll);
      }
    }, { passive: true });
    onScroll();

    function closeMenu() {
      if (!nav) return;
      nav.classList.remove("is-open");
      if (toggle) {
        toggle.setAttribute("aria-expanded", "false");
        toggle.setAttribute("aria-label", "Abrir menu");
      }
      document.body.classList.remove("is-locked");
    }

    if (toggle && nav) {
      toggle.addEventListener("click", () => {
        const open = !nav.classList.contains("is-open");
        nav.classList.toggle("is-open", open);
        toggle.setAttribute("aria-expanded", String(open));
        toggle.setAttribute("aria-label", open ? "Fechar menu" : "Abrir menu");
        document.body.classList.toggle("is-locked", open && window.innerWidth <= 920);
      });
    }

    $$("#nav a").forEach((a) => a.addEventListener("click", closeMenu));
    document.addEventListener("keydown", (e) => {
      if (e.key === "Escape") closeMenu();
    });
    window.addEventListener("resize", () => {
      if (window.innerWidth > 920) closeMenu();
    });
  }

  /* ---------------------------------------------------------
     Render: marquee, sobre, stack, projetos, trajetória
     --------------------------------------------------------- */
  function renderMarquee() {
    const track = $("#marquee-track");
    if (!track) return;
    const items = DATA.skills
      .map((s) => `<span class="marquee-item" style="--c:${s.color}"><i></i>${esc(s.name)}</span>`)
      .join("");
    track.innerHTML = items + items;
  }

  function renderHighlights() {
    const el = $("#highlights");
    if (!el) return;
    el.innerHTML = DATA.highlights
      .map(
        (h) => `
        <article class="highlight-card">
          <span class="highlight-icon" aria-hidden="true">${esc(h.icon)}</span>
          <h4>${esc(h.title)}</h4>
          <p>${esc(h.text)}</p>
        </article>`
      )
      .join("");
  }

  function renderStats() {
    const el = $("#stats-row");
    if (!el) return;
    el.innerHTML = DATA.stats
      .map(
        (s) => `
        <div class="stat">
          <div class="stat-value" data-count="${Number(s.value)}" data-suffix="${esc(s.suffix || "")}">0</div>
          <div class="stat-label">${esc(s.label)}</div>
        </div>`
      )
      .join("");
  }

  function renderSkills() {
    const filters = $("#skill-filters");
    const grid = $("#skills-grid");
    if (!grid) return;

    if (filters) {
      filters.innerHTML = DATA.skillFilters
        .map(
          (f, i) => `
          <button class="filter-btn ${i === 0 ? "is-active" : ""}" type="button" role="tab"
            aria-selected="${i === 0}" data-filter="${f.id}">${esc(f.label)}</button>`
        )
        .join("");
    }

    grid.innerHTML = DATA.skills
      .map(
        (s) => `
        <article class="skill-card" data-cat="${esc(s.cat)}" style="--tech:${esc(s.color)};--pct:${Number(s.pct)}%">
          <div class="skill-top">
            <span class="skill-icon" aria-hidden="true">${esc(s.icon)}</span>
            <span class="skill-level">${esc(s.level)}</span>
          </div>
          <h3>${esc(s.name)}</h3>
          <p class="skill-note">${esc(s.note)}</p>
          <div class="skill-bar" role="presentation"><span></span></div>
        </article>`
      )
      .join("");

    if (!filters) return;
    filters.addEventListener("click", (e) => {
      const btn = e.target.closest("[data-filter]");
      if (!btn) return;
      $$(".filter-btn", filters).forEach((b) => {
        const active = b === btn;
        b.classList.toggle("is-active", active);
        b.setAttribute("aria-selected", String(active));
      });
      const cat = btn.dataset.filter;
      $$(".skill-card", grid).forEach((card) => {
        const show = cat === "all" || card.dataset.cat === cat;
        card.classList.toggle("is-hidden", !show);
      });
    });
  }

  function renderProjects() {
    const grid = $("#projects-grid");
    if (!grid) return;

    grid.innerHTML = DATA.projects
      .map((p) => {
        const isFeatured = !!p.featured;
        const statusClass = /andamento/i.test(p.status) ? "is-progress" : "";
        const tags = p.tags.map((t) => `<span>${esc(t)}</span>`).join("");
        const bullets = (p.bullets || []).map((b) => `<li>${esc(b)}</li>`).join("");
        const metrics = p.metrics
          .map((m) => `<div><b>${esc(m.value)}</b><small>${esc(m.label)}</small></div>`)
          .join("");
        const link = p.link
          ? `<a class="project-link" href="${esc(p.link)}" target="_blank" rel="noopener noreferrer">
               ${esc(p.linkLabel || "Ver projeto")} ${icon("external")}
             </a>`
          : "";

        let visual = "";
        if (p.image) {
          visual = `<div class="project-visual">
              <img src="${esc(p.image)}" alt="${esc(p.imageAlt || p.title)}" loading="lazy" width="1180" height="820" />
            </div>`;
        } else {
          const glyph = p.id === "portfolio" ? "&lt;/&gt;" : "R + N";
          const caption = p.id === "portfolio" ? "HTML · CSS · JS" : "REACT · NODE";
          visual = `<div class="project-art" aria-hidden="true">
              <span>${glyph}</span>
              <small>${caption}</small>
            </div>`;
        }

        const body = `
          <div class="project-body">
            <div class="project-top">
              <span class="project-badge ${statusClass}">${esc(p.status)}</span>
              <span class="project-year">${esc(p.year)}</span>
            </div>
            <h3>${esc(p.title)}</h3>
            <p class="project-subtitle">${esc(p.subtitle)}</p>
            <p class="project-desc">${esc(p.description)}</p>
            ${bullets ? `<ul class="project-bullets">${bullets}</ul>` : ""}
            <div class="project-tags">${tags}</div>
            ${metrics ? `<div class="project-metrics">${metrics}</div>` : ""}
            ${link}
          </div>`;

        return `<article class="project-card ${isFeatured ? "project-card--featured" : ""}" id="projeto-${esc(p.id)}">
            ${isFeatured ? body + visual : visual + body}
          </article>`;
      })
      .join("");
  }

  function renderTimeline() {
    const list = $("#timeline-list");
    const soft = $("#soft-skills");
    if (list) {
      list.innerHTML = DATA.timeline
        .map(
          (t) => `
          <li class="timeline-item" data-type="${esc(t.type)}">
            <span class="timeline-date">${esc(t.date)}</span>
            <div class="timeline-card">
              <h3>${esc(t.title)}</h3>
              <p class="timeline-place">${esc(t.place)}</p>
              <p>${esc(t.description)}</p>
              <div class="timeline-tags">${t.tags.map((tag) => `<span>${esc(tag)}</span>`).join("")}</div>
            </div>
          </li>`
        )
        .join("");
    }
    if (soft) {
      soft.innerHTML = DATA.softSkills.map((s) => `<span>${esc(s)}</span>`).join("");
    }
  }

  /* ---------------------------------------------------------
     Janela de código
     --------------------------------------------------------- */
  const FILES = {
    profile: [
      `<span class="tok-com">// quem está por trás do código</span>`,
      `<span class="tok-key">const</span> <span class="tok-prop">davi</span> <span class="tok-punc">=</span> <span class="tok-punc">{</span>`,
      `  <span class="tok-prop">nome</span><span class="tok-punc">:</span> <span class="tok-str">"Davi Artur Silva Sousa"</span><span class="tok-punc">,</span>`,
      `  <span class="tok-prop">cargo</span><span class="tok-punc">:</span> <span class="tok-str">"Desenvolvedor em formação"</span><span class="tok-punc">,</span>`,
      `  <span class="tok-prop">base</span><span class="tok-punc">:</span> <span class="tok-str">"Recife · PE"</span><span class="tok-punc">,</span>`,
      `  <span class="tok-prop">formacao</span><span class="tok-punc">:</span> <span class="tok-str">"ADS · Estácio"</span><span class="tok-punc">,</span>`,
      `  <span class="tok-prop">stack</span><span class="tok-punc">:</span> <span class="tok-punc">[</span><span class="tok-str">"HTML"</span><span class="tok-punc">,</span> <span class="tok-str">"CSS"</span><span class="tok-punc">,</span> <span class="tok-str">"JS"</span><span class="tok-punc">,</span> <span class="tok-str">"Python"</span><span class="tok-punc">],</span>`,
      `  <span class="tok-prop">estudando</span><span class="tok-punc">:</span> <span class="tok-punc">[</span><span class="tok-str">"React"</span><span class="tok-punc">,</span> <span class="tok-str">"Node"</span><span class="tok-punc">,</span> <span class="tok-str">"Banco de dados"</span><span class="tok-punc">],</span>`,
      `  <span class="tok-prop">disponivel</span><span class="tok-punc">:</span> <span class="tok-bool">true</span><span class="tok-punc">,</span>`,
      `<span class="tok-punc">};</span>`,
      ``,
      `<span class="tok-key">export default</span> <span class="tok-prop">davi</span><span class="tok-punc">;</span>`
    ],
    skills: [
      `<span class="tok-punc">{</span>`,
      `  <span class="tok-prop">"frontend"</span><span class="tok-punc">:</span> <span class="tok-punc">[</span><span class="tok-str">"HTML5"</span><span class="tok-punc">,</span> <span class="tok-str">"CSS3"</span><span class="tok-punc">,</span> <span class="tok-str">"JavaScript"</span><span class="tok-punc">],</span>`,
      `  <span class="tok-prop">"backend"</span><span class="tok-punc">:</span> <span class="tok-punc">[</span><span class="tok-str">"Python"</span><span class="tok-punc">,</span> <span class="tok-str">"Node.js (estudos)"</span><span class="tok-punc">],</span>`,
      `  <span class="tok-prop">"tools"</span><span class="tok-punc">:</span> <span class="tok-punc">[</span><span class="tok-str">"Git"</span><span class="tok-punc">,</span> <span class="tok-str">"GitHub"</span><span class="tok-punc">,</span> <span class="tok-str">"VS Code"</span><span class="tok-punc">,</span> <span class="tok-str">"Excel"</span><span class="tok-punc">],</span>`,
      `  <span class="tok-prop">"extras"</span><span class="tok-punc">:</span> <span class="tok-punc">[</span><span class="tok-str">"IA generativa"</span><span class="tok-punc">,</span> <span class="tok-str">"Automação"</span><span class="tok-punc">,</span> <span class="tok-str">"Suporte T.I."</span><span class="tok-punc">],</span>`,
      `  <span class="tok-prop">"idiomas"</span><span class="tok-punc">:</span> <span class="tok-punc">{</span>`,
      `    <span class="tok-prop">"portugues"</span><span class="tok-punc">:</span> <span class="tok-str">"nativo"</span><span class="tok-punc">,</span>`,
      `    <span class="tok-prop">"ingles"</span><span class="tok-punc">:</span> <span class="tok-str">"intermediário"</span>`,
      `  <span class="tok-punc">},</span>`,
      `  <span class="tok-prop">"curiosidade"</span><span class="tok-punc">:</span> <span class="tok-str">"∞"</span><span class="tok-punc">,</span>`,
      `  <span class="tok-prop">"disponivel"</span><span class="tok-punc">:</span> <span class="tok-bool">true</span>`,
      `<span class="tok-punc">}</span>`
    ],
    goal: [
      `<span class="tok-key"># objetivo</span>`,
      ``,
      `Entrar na área de TI para crescer como`,
      `desenvolvedor — unindo front-end, automação`,
      `e um bom atendimento.`,
      ``,
      `<span class="tok-tag">- [x]</span> Base em HTML, CSS e JS`,
      `<span class="tok-tag">- [x]</span> Projetos próprios no GitHub`,
      `<span class="tok-tag">- [ ]</span> Primeira oportunidade em TI`,
      ``,
      `<span class="tok-com">&gt; "Aprender rápido faz parte do processo."</span>`
    ]
  };

  function renderCode(key) {
    const wrap = $("#code-lines");
    if (!wrap) return;
    const lines = FILES[key] || FILES.profile;
    wrap.innerHTML = lines
      .map((line, i) => `<div class="code-line" style="--i:${i}">${line || " "}</div>`)
      .join("");
  }

  function initCodeTabs() {
    renderCode("profile");
    $$(".code-tab").forEach((tab) => {
      tab.addEventListener("click", () => {
        $$(".code-tab").forEach((t) => {
          const active = t === tab;
          t.classList.toggle("is-active", active);
          t.setAttribute("aria-selected", String(active));
        });
        renderCode(tab.dataset.file);
      });
    });
  }

  /* ---------------------------------------------------------
     Texto digitado (hero)
     --------------------------------------------------------- */
  function initTypedRole() {
    const el = $("#typed-role");
    if (!el) return;
    const roles = [
      "Desenvolvedor web em formação",
      "Front-end com HTML, CSS e JS",
      "Python & automação",
      "Suporte técnico e Help Desk",
      "IA aplicada ao dia a dia"
    ];
    if (reduced) { el.textContent = roles[0]; return; }

    let roleIndex = 0, charIndex = 0, deleting = false;
    function tick() {
      const current = roles[roleIndex];
      if (!deleting) {
        charIndex++;
        el.textContent = current.slice(0, charIndex);
        if (charIndex === current.length) {
          deleting = true;
          setTimeout(tick, 1900);
          return;
        }
        setTimeout(tick, 55 + Math.random() * 45);
      } else {
        charIndex--;
        el.textContent = current.slice(0, charIndex);
        if (charIndex === 0) {
          deleting = false;
          roleIndex = (roleIndex + 1) % roles.length;
          setTimeout(tick, 280);
          return;
        }
        setTimeout(tick, 26);
      }
    }
    setTimeout(tick, 500);
  }

  /* ---------------------------------------------------------
     Reveal + contadores
     --------------------------------------------------------- */
  function initReveal() {
    const items = $$("[data-reveal]");
    if (reduced || !("IntersectionObserver" in window)) {
      items.forEach((el) => el.classList.add("is-visible"));
      return;
    }
    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("is-visible");
            io.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.1, rootMargin: "0px 0px -40px 0px" }
    );
    items.forEach((el) => io.observe(el));
  }

  function initCounters() {
    const nums = $$("[data-count]");
    if (!nums.length) return;
    if (reduced || !("IntersectionObserver" in window)) {
      nums.forEach((n) => { n.textContent = n.dataset.count + (n.dataset.suffix || ""); });
      return;
    }
    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting) return;
          const el = entry.target;
          const target = Number(el.dataset.count) || 0;
          const suffix = el.dataset.suffix || "";
          const start = performance.now();
          const duration = 1100;
          function step(now) {
            const p = Math.min(1, (now - start) / duration);
            const eased = 1 - Math.pow(1 - p, 3);
            el.textContent = Math.round(target * eased) + (p === 1 ? suffix : "");
            if (p < 1) requestAnimationFrame(step);
          }
          requestAnimationFrame(step);
          io.unobserve(el);
        });
      },
      { threshold: 0.5 }
    );
    nums.forEach((n) => io.observe(n));
  }

  /* ---------------------------------------------------------
     Tilt 3D
     --------------------------------------------------------- */
  function initTilt() {
    if (!finePointer || reduced) return;
    $$(".tilt").forEach((el) => {
      let raf = null;
      el.addEventListener("pointermove", (e) => {
        const rect = el.getBoundingClientRect();
        const px = (e.clientX - rect.left) / rect.width;
        const py = (e.clientY - rect.top) / rect.height;
        const rx = (0.5 - py) * 6;
        const ry = (px - 0.5) * 7;
        el.style.setProperty("--mx", `${px * 100}%`);
        el.style.setProperty("--my", `${py * 100}%`);
        if (raf) cancelAnimationFrame(raf);
        raf = requestAnimationFrame(() => {
          el.style.transform = `perspective(1100px) rotateX(${rx.toFixed(2)}deg) rotateY(${ry.toFixed(2)}deg) translateY(-2px)`;
        });
      });
      el.addEventListener("pointerleave", () => {
        if (raf) cancelAnimationFrame(raf);
        el.style.transform = "";
      });
    });
  }

  /* ---------------------------------------------------------
     Cursor glow
     --------------------------------------------------------- */
  function initCursor() {
    if (!finePointer || reduced) return;
    const glow = $("#cursor-glow");
    if (!glow) return;
    let tx = window.innerWidth / 2, ty = window.innerHeight / 2;
    let x = tx, y = ty, raf = null;
    function loop() {
      x += (tx - x) * 0.12;
      y += (ty - y) * 0.12;
      glow.style.transform = `translate3d(${x}px, ${y}px, 0)`;
      raf = requestAnimationFrame(loop);
    }
    window.addEventListener("pointermove", (e) => {
      tx = e.clientX;
      ty = e.clientY;
      glow.classList.add("is-on");
    }, { passive: true });
    loop();
  }

  /* ---------------------------------------------------------
     Copiar / formulário / details
     --------------------------------------------------------- */
  async function copyText(text) {
    try {
      await navigator.clipboard.writeText(text);
      return true;
    } catch (e) {
      const ta = document.createElement("textarea");
      ta.value = text;
      ta.setAttribute("readonly", "");
      ta.style.position = "fixed";
      ta.style.opacity = "0";
      document.body.appendChild(ta);
      ta.select();
      let ok = false;
      try { ok = document.execCommand("copy"); } catch (err) { ok = false; }
      document.body.removeChild(ta);
      return ok;
    }
  }

  function initCopyButtons() {
    $$("[data-copy]").forEach((btn) => {
      btn.addEventListener("click", async () => {
        const ok = await copyText(btn.dataset.copy);
        toast(ok ? "E-mail copiado! ✉️" : "Não foi possível copiar — use o link ao lado.");
      });
    });
  }

  function initContactForm() {
    const form = $("#contact-form");
    if (!form) return;
    form.addEventListener("submit", (e) => {
      e.preventDefault();
      const name = $("#field-name");
      const email = $("#field-email");
      const message = $("#field-message");
      const fields = [name, email, message];
      let ok = true;

      fields.forEach((f) => {
        const valid = f.value.trim().length > 0 && (f.type !== "email" || /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(f.value));
        f.setAttribute("aria-invalid", String(!valid));
        f.style.borderColor = valid ? "" : "rgba(255,123,114,.65)";
        if (!valid) ok = false;
      });

      if (!ok) {
        toast("Confere os campos destacados, por favor.");
        fields.find((f) => f.getAttribute("aria-invalid") === "true")?.focus();
        return;
      }

      const subject = `Contato pelo portfólio — ${name.value.trim()}`;
      const body = `Nome: ${name.value.trim()}\nE-mail: ${email.value.trim()}\n\n${message.value.trim()}`;
      window.location.href = `mailto:Daviarturss27@gmail.com?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
      toast("Abrindo seu app de e-mail... ✉️");
    });

    $$("#contact-form input, #contact-form textarea").forEach((f) => {
      f.addEventListener("input", () => {
        if (f.getAttribute("aria-invalid") === "true" && f.value.trim()) {
          f.setAttribute("aria-invalid", "false");
          f.style.borderColor = "";
        }
      });
    });
  }

  function initDetails() {
    const menu = $(".resume-menu");
    if (!menu) return;
    document.addEventListener("click", (e) => {
      if (menu.open && !menu.contains(e.target)) menu.removeAttribute("open");
    });
    document.addEventListener("keydown", (e) => {
      if (e.key === "Escape" && menu.open) menu.removeAttribute("open");
    });
    $$("a", menu).forEach((a) =>
      a.addEventListener("click", () => setTimeout(() => menu.removeAttribute("open"), 120))
    );
  }

  /* ---------------------------------------------------------
     Command palette
     --------------------------------------------------------- */
  function initPalette(bg) {
    const overlay = $("#palette");
    const input = $("#palette-input");
    const list = $("#palette-list");
    const openBtn = $("#palette-open");
    if (!overlay || !input || !list) return;

    const commands = [
      { group: "Seções", label: "Início", hint: "topo", icon: "terminal", run: () => go("#inicio") },
      { group: "Seções", label: "Sobre", hint: "quem é o Davi", icon: "message", run: () => go("#sobre") },
      { group: "Seções", label: "Stack", hint: "tecnologias", icon: "code", run: () => go("#stack") },
      { group: "Seções", label: "Projetos", hint: "o que eu construí", icon: "briefcase", run: () => go("#projetos") },
      { group: "Seções", label: "Trajetória", hint: "experiência e formação", icon: "graduation", run: () => go("#trajetoria") },
      { group: "Seções", label: "Contato", hint: "falar comigo", icon: "mail", run: () => go("#contato") },
      { group: "Ações", label: "Abrir assistente", hint: "chat", icon: "sparkles", run: () => window.PortfolioChat?.open() },
      { group: "Ações", label: "Alternar tema", hint: "claro / escuro", icon: "sun", run: () => $("#theme-toggle")?.click() },
      { group: "Ações", label: "Copiar e-mail", hint: "Daviarturss27@gmail.com", icon: "copy", run: async () => {
          const ok = await copyText("Daviarturss27@gmail.com");
          toast(ok ? "E-mail copiado!" : "Copie manualmente: Daviarturss27@gmail.com");
        } },
      { group: "Ações", label: "Modo matrix", hint: "easter egg", icon: "terminal", run: () => matrix() },
      { group: "Currículos", label: "Baixar CV — Suporte T.I.", hint: "PDF", icon: "download", run: () => { window.location.href = "assets/cv/Curriculo_Davi_Suporte_TI.pdf"; } },
      { group: "Currículos", label: "Baixar CV — Administrativo", hint: "PDF", icon: "download", run: () => { window.location.href = "assets/cv/Curriculo_Davi_Administrativo.pdf"; } },
      { group: "Links", label: "GitHub", hint: "github.com/daviarturss", icon: "github", run: () => window.open("https://github.com/daviarturss", "_blank", "noopener") },
      { group: "Links", label: "LinkedIn", hint: "in/daviartur", icon: "linkedin", run: () => window.open("https://www.linkedin.com/in/daviartur/", "_blank", "noopener") }
    ];

    let filtered = commands.slice();
    let active = 0;

    function go(hash) {
      close();
      const target = document.querySelector(hash);
      if (target) target.scrollIntoView({ behavior: reduced ? "auto" : "smooth", block: "start" });
      else window.location.hash = hash;
    }

    function matrix() {
      bg.setMatrix(6500);
      toast("🟢 Modo matrix ativado por 6 segundos");
    }

    function render() {
      if (!filtered.length) {
        list.innerHTML = `<li class="palette-empty">Nenhum comando encontrado.</li>`;
        return;
      }
      list.innerHTML = filtered
        .map((c, i) => {
          const cls = i === active ? "is-active" : "";
          return `<li role="option" aria-selected="${i === active}">
            <button type="button" class="palette-item ${cls}" data-index="${i}">
              <span class="palette-item-icon">${icon(c.icon)}</span>
              <span>${esc(c.label)}</span>
              <small>${esc(c.hint)}</small>
            </button>
          </li>`;
        })
        .join("");
    }

    function open() {
      overlay.classList.add("is-open");
      overlay.setAttribute("aria-hidden", "false");
      document.body.classList.add("is-locked");
      input.value = "";
      filtered = commands.slice();
      active = 0;
      render();
      setTimeout(() => input.focus(), 30);
    }

    function close() {
      overlay.classList.remove("is-open");
      overlay.setAttribute("aria-hidden", "true");
      document.body.classList.remove("is-locked");
    }

    function runIndex(i) {
      const cmd = filtered[i];
      if (!cmd) return;
      close();
      setTimeout(() => cmd.run(), 80);
    }

    input.addEventListener("input", () => {
      const q = norm(input.value.trim());
      filtered = commands.filter((c) => {
        const hay = norm(`${c.label} ${c.hint} ${c.group}`);
        return !q || hay.includes(q);
      });
      active = 0;
      render();
    });

    input.addEventListener("keydown", (e) => {
      if (e.key === "ArrowDown") {
        e.preventDefault();
        active = (active + 1) % Math.max(1, filtered.length);
        render();
        list.querySelector(".is-active")?.scrollIntoView({ block: "nearest" });
      } else if (e.key === "ArrowUp") {
        e.preventDefault();
        active = (active - 1 + filtered.length) % Math.max(1, filtered.length);
        render();
        list.querySelector(".is-active")?.scrollIntoView({ block: "nearest" });
      } else if (e.key === "Enter") {
        e.preventDefault();
        runIndex(active);
      }
    });

    list.addEventListener("click", (e) => {
      const btn = e.target.closest("[data-index]");
      if (btn) runIndex(Number(btn.dataset.index));
    });
    list.addEventListener("pointermove", (e) => {
      const btn = e.target.closest("[data-index]");
      if (!btn) return;
      const i = Number(btn.dataset.index);
      if (i !== active) {
        active = i;
        $$(".palette-item", list).forEach((b, idx) => b.classList.toggle("is-active", idx === active));
      }
    });

    openBtn?.addEventListener("click", open);
    overlay.addEventListener("click", (e) => {
      if (e.target.hasAttribute("data-palette-close")) close();
    });
    document.addEventListener("keydown", (e) => {
      const isMod = e.metaKey || e.ctrlKey;
      if (isMod && e.key.toLowerCase() === "k") {
        e.preventDefault();
        overlay.classList.contains("is-open") ? close() : open();
      } else if (e.key === "Escape" && overlay.classList.contains("is-open")) {
        close();
      }
    });

    window.PortfolioPalette = { open, close };
  }

  /* ---------------------------------------------------------
     Easter egg: logo 3x
     --------------------------------------------------------- */
  function initEasterEgg(bg) {
    const logo = $("[data-logo]");
    if (!logo) return;
    let count = 0, timer;
    logo.addEventListener("click", (e) => {
      count++;
      clearTimeout(timer);
      timer = setTimeout(() => { count = 0; }, 900);
      if (count >= 3) {
        e.preventDefault();
        count = 0;
        bg.setMatrix(6500);
        toast("🟢 Modo matrix ativado. Bem-vindo à matrix, neo.");
      }
    });
  }

  /* ---------------------------------------------------------
     Init
     --------------------------------------------------------- */
  function init() {
    const bg = initBackground();
    initTheme();
    initHeader();
    renderMarquee();
    renderHighlights();
    renderStats();
    renderSkills();
    renderProjects();
    renderTimeline();
    initCodeTabs();
    initTypedRole();
    initReveal();
    initCounters();
    initTilt();
    initCursor();
    initCopyButtons();
    initContactForm();
    initDetails();
    initPalette(bg);
    initEasterEgg(bg);

    const year = $("#year");
    if (year) year.textContent = String(new Date().getFullYear());

    // Pequeno atraso para o badge do chat chamar atenção
    setTimeout(() => $("#chat-fab")?.classList.add("has-badge"), 6000);
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", init);
  } else {
    init();
  }
})();
