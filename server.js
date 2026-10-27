/* =========================================================
   DAVI ARTUR — server.js
   Servidor estático + proxy seguro para o Ollama.
   A chave da API NUNCA chega ao navegador.
   Uso: npm start  →  http://localhost:3000
   ========================================================= */
import http from "node:http";
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const ROOT = path.dirname(fileURLToPath(import.meta.url));

/* ---------- .env (sem dependências) ---------- */
function loadEnv() {
  const file = path.join(ROOT, ".env");
  if (!fs.existsSync(file)) return;
  const text = fs.readFileSync(file, "utf8");
  for (const raw of text.split(/\r?\n/)) {
    const line = raw.trim();
    if (!line || line.startsWith("#")) continue;
    const eq = line.indexOf("=");
    if (eq === -1) continue;
    const key = line.slice(0, eq).trim();
    let value = line.slice(eq + 1).trim();
    if ((value.startsWith('"') && value.endsWith('"')) || (value.startsWith("'") && value.endsWith("'"))) {
      value = value.slice(1, -1);
    }
    if (process.env[key] === undefined) process.env[key] = value;
  }
}
loadEnv();

const PORT = Number(process.env.PORT || 3000);
const OLLAMA_HOST = (process.env.OLLAMA_HOST || "http://localhost:11434").replace(/\/+$/, "");
const OLLAMA_KEY = process.env.OLLAMA_API_KEY || "";
const MODEL = process.env.OLLAMA_MODEL || "gpt-oss:120b";
const IS_CLOUD = /ollama\.com/i.test(OLLAMA_HOST);

const MIME = {
  ".html": "text/html; charset=utf-8",
  ".css": "text/css; charset=utf-8",
  ".js": "text/javascript; charset=utf-8",
  ".mjs": "text/javascript; charset=utf-8",
  ".json": "application/json; charset=utf-8",
  ".svg": "image/svg+xml",
  ".png": "image/png",
  ".jpg": "image/jpeg",
  ".jpeg": "image/jpeg",
  ".webp": "image/webp",
  ".gif": "image/gif",
  ".ico": "image/x-icon",
  ".pdf": "application/pdf",
  ".woff2": "font/woff2",
  ".txt": "text/plain; charset=utf-8",
  ".map": "application/json; charset=utf-8"
};

const rate = new Map();
function rateLimited(ip) {
  const now = Date.now();
  const entry = rate.get(ip) || [];
  const fresh = entry.filter((t) => now - t < 60_000);
  fresh.push(now);
  rate.set(ip, fresh);
  if (rate.size > 500) rate.clear();
  return fresh.length > 20;
}

function ollamaHeaders() {
  const headers = { "Content-Type": "application/json" };
  if (OLLAMA_KEY) headers.Authorization = `Bearer ${OLLAMA_KEY}`;
  return headers;
}

async function ollamaFetch(url, options, timeoutMs = 8000) {
  const ctrl = new AbortController();
  const timer = setTimeout(() => ctrl.abort(), timeoutMs);
  try {
    return await fetch(url, { ...options, signal: ctrl.signal });
  } finally {
    clearTimeout(timer);
  }
}

let healthCache = { at: 0, data: null };
async function health() {
  if (healthCache.data && Date.now() - healthCache.at < 20_000) return healthCache.data;

  let data = { ai: false, provider: IS_CLOUD ? "cloud" : "local", model: MODEL, reason: "" };
  try {
    const res = await ollamaFetch(`${OLLAMA_HOST}/api/tags`, { headers: ollamaHeaders() }, 4500);
    if (res.ok) {
      const info = await res.json().catch(() => ({}));
      const names = Array.isArray(info.models) ? info.models.map((m) => m.name).filter(Boolean) : [];
      data.ai = true;
      data.models = names.slice(0, 40);
      if (!names.includes(MODEL) && names.length) data.reason = `modelo "${MODEL}" não listado; ajuste OLLAMA_MODEL se falhar`;
    } else {
      data.reason = `Ollama respondeu ${res.status}`;
    }
  } catch (err) {
    data.reason = err.name === "AbortError" ? "timeout ao contatar o Ollama" : "Ollama indisponível";
  }
  healthCache = { at: Date.now(), data };
  return data;
}

/* ---------- API ---------- */
async function handleChat(req, res) {
  const ip = req.socket.remoteAddress || "unknown";
  if (rateLimited(ip)) {
    sendJSON(res, 429, { error: "Muitas mensagens em pouco tempo. Aguarde um minuto." });
    return;
  }
  if (IS_CLOUD && !OLLAMA_KEY) {
    sendJSON(res, 503, { error: "OLLAMA_API_KEY não configurada no .env" });
    return;
  }

  let payload;
  try {
    payload = await readJSON(req, 220_000);
  } catch (err) {
    sendJSON(res, 400, { error: "Corpo inválido" });
    return;
  }

  const messages = payload && payload.messages;
  if (!Array.isArray(messages) || messages.length === 0 || messages.length > 24) {
    sendJSON(res, 400, { error: "Lista de mensagens inválida" });
    return;
  }
  let total = 0;
  for (const m of messages) {
    if (!m || !["system", "user", "assistant"].includes(m.role) || typeof m.content !== "string") {
      sendJSON(res, 400, { error: "Formato de mensagem inválido" });
      return;
    }
    if (m.content.length > 4000) {
      sendJSON(res, 400, { error: "Mensagem muito longa" });
      return;
    }
    total += m.content.length;
  }
  if (total > 20_000) {
    sendJSON(res, 400, { error: "Conversa muito longa" });
    return;
  }

  const ctrl = new AbortController();
  const clientClosed = () => { try { ctrl.abort(); } catch (e) {} };
  req.on("close", clientClosed);
  const timer = setTimeout(() => { try { ctrl.abort(); } catch (e) {} }, 75_000);

  try {
    const upstream = await fetch(`${OLLAMA_HOST}/api/chat`, {
      method: "POST",
      headers: ollamaHeaders(),
      body: JSON.stringify({
        model: MODEL,
        messages,
        stream: true,
        options: { temperature: 0.55, top_p: 0.9, num_predict: 420 }
      }),
      signal: ctrl.signal
    });

    if (!upstream.ok || !upstream.body) {
      const text = await upstream.text().catch(() => "");
      let friendly = "";
      try {
        const j = JSON.parse(text);
        friendly = j.error || "";
      } catch (e) {
        friendly = text.slice(0, 300);
      }
      const status = upstream.status === 402 ? 402 : 502;
      sendJSON(res, status, {
        error: friendly || `Ollama respondeu ${upstream.status}. Verifique o modelo e os créditos.`
      });
      return;
    }

    res.writeHead(200, {
      "Content-Type": "text/event-stream; charset=utf-8",
      "Cache-Control": "no-cache, no-transform",
      Connection: "keep-alive",
      "X-Accel-Buffering": "no"
    });
    res.write(": conectado\n\n");

    const reader = upstream.body.getReader();
    const decoder = new TextDecoder();
    let buffer = "";

    while (true) {
      const { done, value } = await reader.read();
      if (done) break;
      buffer += decoder.decode(value, { stream: true });
      const lines = buffer.split("\n");
      buffer = lines.pop() || "";

      for (const line of lines) {
        const trimmed = line.trim();
        if (!trimmed) continue;
        try {
          const json = JSON.parse(trimmed);
          if (json.error) {
            res.write(`data: ${JSON.stringify({ error: json.error })}\n\n`);
            res.end();
            return;
          }
          const token = json.message && json.message.content;
          if (token) res.write(`data: ${JSON.stringify({ t: token })}\n\n`);
          if (json.done) {
            res.write("data: [DONE]\n\n");
            res.end();
            return;
          }
        } catch (e) {
          /* linha parcial — ignora */
        }
      }
    }

    res.write("data: [DONE]\n\n");
    res.end();
  } catch (err) {
    const message = err.name === "AbortError"
      ? "Tempo esgotado falando com o Ollama."
      : "Não foi possível falar com o Ollama.";
    if (!res.headersSent) sendJSON(res, 502, { error: message });
    else { try { res.write(`data: ${JSON.stringify({ error: message })}\n\n`); res.end(); } catch (e) {} }
  } finally {
    clearTimeout(timer);
    req.off("close", clientClosed);
  }
}

/* ---------- helpers ---------- */
function sendJSON(res, status, obj) {
  const body = JSON.stringify(obj);
  res.writeHead(status, {
    "Content-Type": "application/json; charset=utf-8",
    "Cache-Control": "no-store",
    "Content-Length": Buffer.byteLength(body)
  });
  res.end(body);
}

function readJSON(req, limit) {
  return new Promise((resolve, reject) => {
    let size = 0;
    const chunks = [];
    req.on("data", (chunk) => {
      size += chunk.length;
      if (size > limit) { reject(new Error("too large")); req.destroy(); return; }
      chunks.push(chunk);
    });
    req.on("end", () => {
      try { resolve(JSON.parse(Buffer.concat(chunks).toString("utf8"))); }
      catch (e) { reject(e); }
    });
    req.on("error", reject);
  });
}

/* ---------- estáticos ---------- */
function serveStatic(req, res, pathname) {
  let decoded;
  try { decoded = decodeURIComponent(pathname); } catch (e) { return notFound(res); }
  if (decoded === "/") decoded = "/index.html";
  if (decoded.includes("\0")) return notFound(res);

  const rel = decoded.replace(/^\/+/, "");
  if (rel.split("/").some((part) => part.startsWith(".")) || rel.startsWith("node_modules/")) {
    return notFound(res);
  }

  const file = path.resolve(ROOT, rel);
  const relative = path.relative(ROOT, file);
  if (relative.startsWith("..") || path.isAbsolute(relative)) return notFound(res);

  let stat;
  try { stat = fs.statSync(file); } catch (e) { return notFound(res); }
  if (stat.isDirectory()) return serveStatic(req, res, path.posix.join(pathname, "index.html"));

  const ext = path.extname(file).toLowerCase();
  const type = MIME[ext] || "application/octet-stream";
  const cache = ext === ".html" ? "no-cache" : "public, max-age=3600";

  res.writeHead(200, {
    "Content-Type": type,
    "Content-Length": stat.size,
    "Cache-Control": cache,
    "X-Content-Type-Options": "nosniff",
    "Referrer-Policy": "strict-origin-when-cross-origin"
  });

  if (req.method === "HEAD") { res.end(); return; }
  fs.createReadStream(file).pipe(res);
}

function notFound(res) {
  const body = `<!doctype html><html lang="pt-BR"><meta charset="utf-8"><title>404</title>
<style>body{font-family:system-ui;background:#070a12;color:#e8eef8;display:grid;place-items:center;height:100vh;margin:0}
a{color:#22d3ee}</style><div style="text-align:center"><h1 style="font-size:72px;margin:0">404</h1>
<p>Página não encontrada.</p><a href="/">Voltar ao início</a></div></html>`;
  res.writeHead(404, { "Content-Type": "text/html; charset=utf-8", "Content-Length": Buffer.byteLength(body) });
  res.end(body);
}

/* ---------- servidor ---------- */
const server = http.createServer(async (req, res) => {
  let pathname = "/";
  try {
    const url = new URL(req.url || "/", `http://${req.headers.host || "localhost"}`);
    pathname = url.pathname;
  } catch (e) {
    return sendJSON(res, 400, { error: "URL inválida" });
  }

  if (pathname === "/api/health") {
    if (req.method !== "GET") return sendJSON(res, 405, { error: "Método não permitido" });
    return sendJSON(res, 200, await health());
  }

  if (pathname === "/api/chat") {
    if (req.method !== "POST") return sendJSON(res, 405, { error: "Método não permitido" });
    return handleChat(req, res);
  }

  if (req.method !== "GET" && req.method !== "HEAD") {
    return sendJSON(res, 405, { error: "Método não permitido" });
  }

  serveStatic(req, res, pathname);
});

server.on("error", (err) => {
  if (err.code === "EADDRINUSE") {
    console.error(`\n  Porta ${PORT} ocupada. Rode: set PORT=3001 && npm start\n`);
  } else {
    console.error("Erro no servidor:", err);
  }
  process.exit(1);
});

server.listen(PORT, () => {
  console.log("\n  Portfólio do Davi Artur");
  console.log(`  → http://localhost:${PORT}`);
  console.log(`  → IA: ${IS_CLOUD ? "Ollama Cloud" : "Ollama local"} · modelo ${MODEL} · chave ${OLLAMA_KEY ? "configurada" : "não configurada"}`);
  console.log("  → Ctrl+C para parar\n");
});

for (const signal of ["SIGINT", "SIGTERM"]) {
  process.on(signal, () => {
    server.close(() => process.exit(0));
    setTimeout(() => process.exit(0), 1500).unref();
  });
}
