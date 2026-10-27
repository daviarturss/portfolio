import fs from 'node:fs';
const env = Object.fromEntries(
  fs.readFileSync(new URL('./.env', import.meta.url), 'utf8')
    .split(/\r?\n/).filter(l => l.trim() && !l.startsWith('#'))
    .map(l => l.split('=').map(s => s.trim()))
);

const system = `Você é o assistente do portfólio de Davi Artur Silva Sousa, estudante de ADS no Recife.
Responda em português do Brasil, curto e simpático, apenas com base nos fatos:
- Cursando Análise e Desenvolvimento de Sistemas (3º período)
- Conhecimentos: HTML, CSS, JavaScript, Python, Git/GitHub, React/Node em estudo
- Experiência: consultor de vendas administrativo (out/2025 a mai/2026)
- Busca oportunidade em TI (desenvolvimento ou suporte)
Se não souber, diga que não tem essa informação.`;

async function test(model) {
  const t0 = Date.now();
  const res = await fetch(`${env.OLLAMA_HOST}/api/chat`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${env.OLLAMA_API_KEY}` },
    body: JSON.stringify({
      model,
      stream: false,
      options: { temperature: 0.5, num_predict: 220 },
      messages: [
        { role: 'system', content: system },
        { role: 'user', content: 'Oi! Quem é o Davi e o que ele sabe fazer? Fala rápido.' }
      ]
    })
  });
  const ms = Date.now() - t0;
  const text = await res.text();
  console.log('=====', model, res.status, ms + 'ms');
  try {
    const j = JSON.parse(text);
    console.log(j.message?.content ?? text.slice(0, 400));
    console.log('tokens:', j.eval_count, '| done:', j.done_reason);
  } catch { console.log(text.slice(0, 400)); }
}

await Promise.all([test('gpt-oss:120b'), test('minimax-m3.1-flash')]);
