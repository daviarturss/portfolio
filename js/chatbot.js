/* =========================================================
   DAVI ARTUR — chatbot.js
   Assistente com dois modos:
   1) cérebro local (intenções + base do currículo) — sempre funciona
   2) IA via Ollama (proxy /api/chat) — usa quando disponível
   ========================================================= */
(function () {
  "use strict";

  const DATA = window.PORTFOLIO;
  const $ = (sel, ctx) => (ctx || document).querySelector(sel);
  const $$ = (sel, ctx) => Array.from((ctx || document).querySelectorAll(sel));

  const panel = $("#chat-panel");
  const fab = $("#chat-fab");
  const body = $("#chat-body");
  const form = $("#chat-form");
  const input = $("#chat-input");
  const sendBtn = $("#chat-send");
  const closeBtn = $("#chat-close");
  const clearBtn = $("#chat-clear");
  const suggestionsEl = $("#chat-suggestions");
  const modeEl = $("#chat-mode");
  const modeDot = $("#chat-mode-dot");
  if (!panel || !body || !form || !input || !sendBtn) return;

  const introHTML = body.innerHTML;
  const history = [];
  let busy = false;
  let opened = false;
  let aiReady = false;
  let aiFailed = false;
  let aiModel = "";
  let abortCtrl = null;
  let lastSuggestions = DATA.chat.suggestions.slice();

  /* ---------------- utilidades ---------------- */
  const wait = (ms) => new Promise((r) => setTimeout(r, ms));
  const escapeHTML = (s) =>
    String(s).replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]));

  function md(text) {
    let s = escapeHTML(text);
    s = s.replace(/\[([^\]]+)\]\((https?:\/\/[^\s)]+|mailto:[^\s)]+|assets\/[^\s)]+|#[^\s)]+)\)/g,
      (_, label, href) => `<a href="${href}"${/^https?:/.test(href) ? ' target="_blank" rel="noopener noreferrer"' : ""}>${label}</a>`);
    s = s.replace(/\*\*([^*]+)\*\*/g, "<strong>$1</strong>");
    s = s.replace(/`([^`]+)`/g, "<code>$1</code>");
    s = s.replace(/\n/g, "<br />");
    return s;
  }

  function normalize(text) {
    return String(text)
      .toLowerCase()
      .normalize("NFD").replace(/[\u0300-\u036f]/g, "")
      .replace(/\bvc\b/g, "voce")
      .replace(/\bpq\b/g, "porque")
      .replace(/\bq\b/g, "que")
      .replace(/\btd\b/g, "tudo")
      .replace(/\bblz\b/g, "beleza")
      .replace(/[^a-z0-9\s]/g, " ")
      .replace(/\s+/g, " ")
      .trim();
  }

  const STOP = new Set(("a o e eh de da do das dos em no na nos nas um uma uns umas para pra por com sem sobre entre " +
    "que qual quais quem como onde quando porque seu sua seus suas dele dela me te se ja nao sim tambem muito mais " +
    "voce voces eu ele ela nos nos fala fale falar conta conte queria quero saber gostaria pode poderia tem tens ter " +
    "foi ser sou e sao esta estao aqui ali isso isto aquilo the of and to in is are").split(/\s+/));

  function tokens(text) {
    return normalize(text).split(" ").filter((t) => t && !STOP.has(t) && t.length > 1);
  }

  /* ---------------- cérebro local ---------------- */
  function pickReply(intent) {
    if (Array.isArray(intent.replies)) return intent.replies[Math.floor(Math.random() * intent.replies.length)];
    return intent.reply || DATA.chat.fallback;
  }

  function localAnswer(text) {
    const hay = normalize(text);
    const words = new Set(tokens(text));

    let best = null;
    let bestScore = 0;

    for (const intent of DATA.chat.intents) {
      let score = 0;

      if (intent.patterns) {
        for (const re of intent.patterns) {
          if (re.test(hay)) { score += 6; break; }
        }
      }

      if (intent.keywords) {
        for (const raw of intent.keywords) {
          const kw = normalize(raw);
          if (!kw) continue;
          if (kw.includes(" ")) {
            if (hay.includes(kw)) score += 5;
          } else if (words.has(kw)) {
            score += 3;
          } else if (kw.length >= 4) {
            for (const w of words) {
              if (w.startsWith(kw) || kw.startsWith(w)) { score += 1; break; }
            }
          }
        }
      }

      if (score > bestScore) {
        bestScore = score;
        best = intent;
      }
    }

    if (best && bestScore >= 3) {
      return {
        reply: pickReply(best),
        suggestions: best.suggestions || DATA.chat.suggestions
      };
    }

    return {
      reply: DATA.chat.fallback,
      suggestions: ["O que ele sabe fazer?", "Fale sobre os projetos", "Como entrar em contato?"]
    };
  }

  /* ---------------- UI ---------------- */
  function scrollToBottom(behavior) {
    body.scrollTo({ top: body.scrollHeight, behavior: behavior || "smooth" });
  }

  function addMessage(role, text, opts) {
    const el = document.createElement("div");
    el.className = `chat-msg is-${role}`;
    if (opts && opts.html) el.innerHTML = text;
    else el.innerHTML = md(text);
    body.appendChild(el);
    scrollToBottom();
    return el;
  }

  function showTyping() {
    const el = document.createElement("div");
    el.className = "chat-msg is-bot";
    el.innerHTML = `<span class="chat-typing" aria-label="digitando"><span></span><span></span><span></span></span>`;
    body.appendChild(el);
    scrollToBottom();
    return el;
  }

  function setSuggestions(list) {
    lastSuggestions = (list && list.length ? list : DATA.chat.suggestions).slice(0, 4);
    suggestionsEl.innerHTML = lastSuggestions
      .map((s) => `<button type="button">${escapeHTML(s)}</button>`)
      .join("");
  }

  function setMode(kind) {
    if (kind === "ai") {
      modeEl.textContent = aiModel ? `IA · ${aiModel}` : "IA conectada";
      modeDot.classList.remove("is-offline");
      modeDot.title = "Respostas geradas por IA (Ollama)";
    } else if (kind === "offline") {
      modeEl.textContent = "modo local · IA indisponível";
      modeDot.classList.add("is-offline");
      modeDot.title = "Usando o cérebro local do assistente";
    } else {
      modeEl.textContent = "cérebro local";
      modeDot.classList.add("is-offline");
      modeDot.title = "Respostas baseadas no currículo, sem IA externa";
    }
  }

  function open() {
    panel.classList.add("is-open");
    panel.setAttribute("aria-hidden", "false");
    fab?.setAttribute("aria-expanded", "true");
    fab?.classList.remove("has-badge");
    if (!opened) {
      opened = true;
      setSuggestions(lastSuggestions);
    }
    setTimeout(() => input.focus({ preventScroll: true }), 160);
    scrollToBottom("auto");
  }

  function close() {
    panel.classList.remove("is-open");
    panel.setAttribute("aria-hidden", "true");
    fab?.setAttribute("aria-expanded", "false");
    fab?.focus({ preventScroll: true });
  }

  function toggle() {
    panel.classList.contains("is-open") ? close() : open();
  }

  function clearChat() {
    if (abortCtrl) { try { abortCtrl.abort(); } catch (e) {} }
    history.length = 0;
    busy = false;
    sendBtn.disabled = false;
    body.innerHTML = introHTML;
    setSuggestions(DATA.chat.suggestions);
    setMode(aiFailed ? "offline" : aiReady ? "ai" : "local");
    scrollToBottom("auto");
    input.focus({ preventScroll: true });
  }

  /* ---------------- IA (Ollama via proxy) ---------------- */
  async function checkAI() {
    if (location.protocol === "file:") {
      setMode("local");
      return;
    }
    const ctrl = new AbortController();
    const timer = setTimeout(() => ctrl.abort(), 2600);
    try {
      const res = await fetch("api/health", { signal: ctrl.signal, cache: "no-store" });
      clearTimeout(timer);
      if (!res.ok) throw new Error("health " + res.status);
      const info = await res.json();
      if (info && info.ai) {
        aiReady = true;
        aiModel = info.model || "";
        setMode("ai");
      } else {
        setMode("local");
      }
    } catch (e) {
      clearTimeout(timer);
      aiReady = false;
      setMode("local");
    }
  }

  async function streamAI(onChunk) {
    abortCtrl = new AbortController();
    const messages = [
      { role: "system", content: DATA.chat.buildSystemPrompt() },
      ...history.slice(-12)
    ];

    const res = await fetch("api/chat", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ messages }),
      signal: abortCtrl.signal
    });

    if (!res.ok) {
      let detail = "";
      try { detail = (await res.json()).error || ""; } catch (e) {}
      throw new Error(detail || `HTTP ${res.status}`);
    }
    if (!res.body) throw new Error("Sem stream");

    const reader = res.body.getReader();
    const decoder = new TextDecoder();
    let buffer = "";
    let full = "";
    let finished = false;

    while (!finished) {
      const { done, value } = await reader.read();
      if (done) break;
      buffer += decoder.decode(value, { stream: true });
      const parts = buffer.split("\n\n");
      buffer = parts.pop() || "";

      for (const part of parts) {
        const line = part.split("\n").find((l) => l.startsWith("data:"));
        if (!line) continue;
        const payload = line.slice(5).trim();
        if (payload === "[DONE]") { finished = true; break; }
        try {
          const json = JSON.parse(payload);
          if (json.error) throw new Error(json.error);
          if (json.t) {
            full += json.t;
            onChunk(full);
          }
        } catch (err) {
          if (err instanceof SyntaxError) continue;
          throw err;
        }
      }
    }

    return full;
  }

  /* ---------------- envio ---------------- */
  async function send(text) {
    const value = String(text || "").trim();
    if (!value || busy) return;

    busy = true;
    sendBtn.disabled = true;
    body.setAttribute("aria-busy", "true");
    addMessage("user", value);
    history.push({ role: "user", content: value });
    input.value = "";
    autoresize();
    suggestionsEl.innerHTML = "";

    const local = localAnswer(value);
    const typing = showTyping();

    try {
      if (aiReady && !aiFailed) {
        await wait(220);
        typing.remove();

        const bubble = addMessage("bot", "", { html: true });
        let got = false;
        try {
          const full = await streamAI((partial) => {
            got = true;
            bubble.innerHTML = md(partial) + '<span class="stream-caret"></span>';
            scrollToBottom("auto");
          });
          if (!full.trim()) throw new Error("resposta vazia");
          bubble.innerHTML = md(full);
          history.push({ role: "assistant", content: full });
          got = true;
        } catch (err) {
          console.warn("[chat] IA indisponível:", err.message);
          aiFailed = true;
          setMode("offline");
          if (!got) {
            bubble.remove();
            const fallback = addMessage("bot", local.reply);
            fallback.style.animation = "none";
            history.push({ role: "assistant", content: local.reply });
          } else {
            bubble.innerHTML += "<br /><br /><em>(conexão interrompida — continue pelo cérebro local)</em>";
          }
        }
        setSuggestions(local.suggestions);
      } else {
        await wait(420 + Math.random() * 380);
        typing.remove();
        addMessage("bot", local.reply);
        history.push({ role: "assistant", content: local.reply });
        setSuggestions(local.suggestions);
      }
    } catch (err) {
      typing.remove();
      addMessage("bot", "Tive um problema para responder agora. 😕 Você pode tentar de novo ou falar direto: **Daviarturss27@gmail.com**.");
      console.error("[chat]", err);
    } finally {
      busy = false;
      sendBtn.disabled = false;
      body.removeAttribute("aria-busy");
      scrollToBottom();
      if (panel.classList.contains("is-open")) input.focus({ preventScroll: true });
    }
  }

  /* ---------------- eventos ---------------- */
  function autoresize() {
    input.style.height = "auto";
    input.style.height = Math.min(input.scrollHeight, 92) + "px";
  }

  fab?.addEventListener("click", toggle);
  closeBtn?.addEventListener("click", close);
  clearBtn?.addEventListener("click", clearChat);

  form.addEventListener("submit", (e) => {
    e.preventDefault();
    send(input.value);
  });

  input.addEventListener("input", autoresize);
  input.addEventListener("keydown", (e) => {
    if (e.key === "Enter" && !e.shiftKey && !e.isComposing) {
      e.preventDefault();
      send(input.value);
    }
  });

  suggestionsEl.addEventListener("click", (e) => {
    const btn = e.target.closest("button");
    if (btn) send(btn.textContent);
  });

  document.addEventListener("keydown", (e) => {
    const tag = (e.target.tagName || "").toLowerCase();
    const typing = tag === "input" || tag === "textarea" || tag === "select" || e.target.isContentEditable;
    const paletteOpen = !!document.querySelector("#palette.is-open");

    if (e.key === "Escape" && panel.classList.contains("is-open") && !paletteOpen) {
      close();
    }
    if (e.key === "/" && !typing && !paletteOpen) {
      e.preventDefault();
      open();
    }
  });

  document.querySelector("[data-chat-contact]")?.addEventListener("click", () => {
    setTimeout(close, 160);
  });

  window.PortfolioChat = { open, close, toggle, send };

  /* ---------------- boot ---------------- */
  setSuggestions(DATA.chat.suggestions);
  setMode("local");
  checkAI();
})();
