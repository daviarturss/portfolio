import fs from 'node:fs';
const env = Object.fromEntries(
  fs.readFileSync(new URL('./.env', import.meta.url), 'utf8')
    .split(/\r?\n/).filter(l => l.trim() && !l.startsWith('#'))
    .map(l => l.split('=').map(s => s.trim()))
);
const res = await fetch(`${env.OLLAMA_HOST}/api/tags`, {
  headers: { Authorization: `Bearer ${env.OLLAMA_API_KEY}` }
});
const data = await res.json();
for (const m of data.models) console.log(m.name.padEnd(28), (m.capabilities || []).join(','));
