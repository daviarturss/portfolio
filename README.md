# Portfólio — Davi Artur Silva Sousa

Meu portfólio pessoal: uma landing page feita do zero com **HTML, CSS e JavaScript puro**, com fundo animado, microinterações e um assistente virtual que responde perguntas sobre mim usando a base do meu currículo.

Eu construí este site como parte da minha transição para a área de TI. Ele é, ao mesmo tempo, minha vitrine profissional e meu laboratório de estudo: cada seção foi uma oportunidade de praticar layout responsivo, acessibilidade, manipulação de DOM, Canvas e integração com uma API de IA.

> **Status:** disponível para ingressar no mercado de TI, aberto a diferentes frentes da área.

---

## Sumário

- [Projetos em destaque](#projetos-em-destaque)
- [Como usei IA neste projeto](#como-usei-ia-neste-projeto)
- [Funcionalidades](#funcionalidades)
- [Stack e decisões técnicas](#stack-e-decisões-técnicas)
- [Estrutura de arquivos](#estrutura-de-arquivos)
- [Como rodar](#como-rodar)
- [O assistente e como ensiná-lo](#o-assistente-e-como-ensiná-lo)
- [IA opcional com Ollama](#ia-opcional-com-ollama)
- [Personalização](#personalização)
- [Deploy](#deploy)
- [Acessibilidade e desempenho](#acessibilidade-e-desempenho)
- [Sobre o currículo](#sobre-o-currículo)
- [Segurança](#segurança)
- [Contato](#contato)

---

## Projetos em destaque

O site apresenta quatro trabalhos. Dois deles são aplicações desktop em C#/.NET que desenvolvi para estudar, na prática, como o software conversa com o hardware.

**Transparência:** os quatro foram construídos por mim, com **IA como ferramenta de estudo** — para pesquisar APIs, revisar trechos, explicar erros e discutir alternativas. Não apresento nenhum deles como trabalho 100% solo, nem como algo gerado automaticamente: as decisões, a integração e os testes passaram por mim.

### PcSpec

Clone funcional do CPU-Z escrito do zero em **C#/.NET 10**, usando apenas APIs públicas do Windows: `CPUID`, SMBIOS, WMI, registro e topologia de processadores. Tem app WPF com sete abas (Sistema, CPU, Placa-mãe, Memória, Gráficos, Benchmark e Relatório), uma CLI completa (`info`, `cpu`, `memory`, `bench`, `report`, `json`, `smbios`) e benchmark próprio com quatro cargas em 1 e N threads. Gera relatórios em TXT, HTML autocontido e JSON. Não instala driver de kernel, não lê a memória de outro processo e não faz acesso à rede.

Foi meu principal projeto de aprendizado em **C#/.NET**: usei IA para estudar as APIs do Windows, revisar trechos e destravar erros, e testei cada parte rodando o app no Windows.

O projeto nasceu de um estudo de **engenharia reversa do CPU-Z 3.0.1**, no qual usei duas ferramentas de terceiros — **REA (Reverse Engineer Anything)** para a análise assistida do binário e **Ghidra 12.2** para o descompilado. O código do PcSpec é independente: a engenharia reversa serviu para entender *o que* o programa original lia e *como* organizava a interface, não para reaproveitar implementação. O dossiê dessa análise está fora deste repositório.

→ [github.com/daviarturss/pcspec](https://github.com/daviarturss/pcspec)

### HwMon

Monitor de sensores para Windows, também em **C#/.NET 10**, inspirado no HWiNFO64. Lê CPU, GPU, placa-mãe, memória, discos e rede via LibreHardwareMonitorLib — **307 sensores em 58 hardwares** — com filtros, estatísticas em tempo real, alertas por limite e exportação CSV. A CLI cobre `list`, `watch`, `export` e `providers`.

Segundo projeto grande em C#/.NET e WPF, também com IA como apoio de estudo e revisão de código.

→ [github.com/daviarturss/hwmon](https://github.com/daviarturss/hwmon)

Os outros dois são este portfólio e um laboratório de estudos com React + Node.

---

## Como usei IA neste projeto

Quero ser transparente sobre isso desde o começo, porque faz parte de como eu trabalho hoje.

**Usei inteligência artificial como ferramenta de estudo e de apoio à elaboração do projeto.** Na prática, ela foi usada para:

- **Apoiar a estruturação do código** — discutir organização de arquivos, padrões de CSS, alternativas para o fundo em Canvas e para o streaming de respostas.
- **Revisar e explicar conceitos** — entender por que uma solução funcionava, comparar abordagens e corrigir erros de sintaxe ou de lógica.
- **Ajudar a redigir textos** — rascunhos de descrições de projetos, mensagens do assistente e este README, sempre revisados e ajustados por mim para refletir o que eu realmente sei e fiz.
- **Acelerar tarefas repetitivas** — geração de variações de markup e de estilos que eu depois testei e adaptei.

O que a IA **não** fez: inventar experiência profissional, criar projetos fictícios ou substituir o aprendizado. Os fatos sobre formação, experiência e contato vêm do meu currículo. O código foi lido, executado, testado no navegador e ajustado por mim — inclusive quando a primeira versão não funcionava.

Esse uso é coerente com o que já faço no dia a dia e com o curso **I.A. para Negócios (Casa Zero)**: IA como ferramenta de produtividade e pesquisa, não como atalho para fingir conhecimento.

> Se em algum momento eu não souber explicar uma linha deste projeto, ela não deveria estar aqui. É esse o critério que estou usando.

---

## Funcionalidades

### Página e experiência

- **Fundo animado em Canvas** — partículas conectadas por linhas, com reação suave ao movimento do mouse.
- **Camadas visuais** — aurora com gradientes em movimento, grid com máscara radial e textura de ruído.
- **Tema escuro e claro** — alternância com persistência em `localStorage`; o escuro é o padrão.
- **Hero com janela de código** — três arquivos (`profile.js`, `skills.json`, `objetivo.md`) navegáveis por abas, com syntax highlight feito à mão.
- **Efeito de digitação** — o cargo no hero alterna entre cinco variações.
- **Tilt 3D** na janela de código, com brilho que segue o cursor.
- **Scroll reveal** e **contadores animados** disparados por `IntersectionObserver`.
- **Barra de progresso de leitura** e navegação com seção ativa destacada.
- **Marquee** com as tecnologias, que pausa no hover.
- **Filtros de stack** por categoria (front-end, back-end, ferramentas).
- **Timeline** de formação e experiência com marcadores por tipo.
- **Formulário de contato** que valida os campos e abre o app de e-mail com a mensagem pronta (sem backend, sem armazenar dados).
- **Botão de copiar e-mail** com toast de confirmação.
- **Command palette** (`Ctrl`/`Cmd` + `K`) para navegar, trocar tema, copiar contato, baixar CV e abrir o assistente.
- **Menu mobile** acessível, com `aria-expanded` e fechamento por `Esc`.
- **Easter egg:** clicar três vezes no logo ativa o "modo matrix" por alguns segundos.

### Assistente virtual

- Responde sobre formação, experiência, stack, projetos, idiomas, disponibilidade e contato.
- **Dois modos:** cérebro local (sempre funciona) e IA via Ollama (quando configurada).
- **Streaming** das respostas da IA, com indicador de digitação.
- **Fallback automático:** se a IA falhar, a resposta local assume sem quebrar a conversa.
- **Sugestões de perguntas** que mudam conforme o assunto.
- **Sanitização** de todo texto renderizado e links em markdown limitados a `http`, `mailto`, `#` e `assets/`.
- Atalho `/` para abrir o chat de qualquer lugar da página.

---

## Stack e decisões técnicas

| Camada | Escolha | Por quê |
|---|---|---|
| Marcação | HTML5 semântico | Estrutura clara, boa base para acessibilidade e SEO |
| Estilo | CSS puro com custom properties | Controle total, tema claro/escuro sem dependências |
| Comportamento | JavaScript vanilla (ES2020) | Praticar a base antes de frameworks |
| Fundo | Canvas 2D | Partículas leves, sem biblioteca de animação |
| Servidor | Node.js `http` nativo | Zero dependências, apenas estáticos + proxy |
| IA (opcional) | Ollama (`/api/chat`) | Rodar local ou na nuvem, com a chave só no servidor |

**Sem build, sem `node_modules` no front-end.** Os scripts são carregados com tags `<script>` clássicas justamente para que o site também abra via `file://` durante o desenvolvimento.

Decisões que vale explicar:

- **A chave da IA nunca vai para o navegador.** O front chama `/api/chat`; o `server.js` conversa com o Ollama e devolve um stream. Isso evita expor credenciais no DevTools.
- **O cérebro local vem primeiro.** O site não depende de IA para funcionar: se não houver servidor, internet ou créditos, o assistente continua respondendo com a base de intenções.
- **Tema escuro por padrão.** A identidade visual foi desenhada para fundo escuro; o claro é uma alternativa completa, não um remendo.

---

## Estrutura de arquivos

```
portfolio/
├── index.html            # marcação completa da página
├── css/
│   └── style.css         # tokens, layout, animações, responsivo, chat
├── js/
│   ├── data.js           # TODO o conteúdo + cérebro do assistente
│   ├── main.js           # fundo, tema, renderização, palette, interações
│   └── chatbot.js        # intenções locais + streaming via Ollama
├── assets/
│   ├── cv/               # currículo em PDF (arquivo único)
│   └── img/              # screenshots do PcSpec e do HwMon + imagem de Open Graph
├── server.js             # servidor estático + proxy /api/chat
├── package.json
├── .env.example
├── .env                  # chave real (ignorada pelo Git)
└── favicon.svg
```

O arquivo mais importante para editar conteúdo é **`js/data.js`**. Ele concentra perfil, habilidades, projetos, trajetória, números, sugestões do chat, intenções e o prompt do modo IA.

---

## Como rodar

Requisitos: **Node.js 20 ou superior** (uso `fetch` nativo).

```bash
# na pasta do projeto
npm start
```

Depois abra **http://localhost:3000**.

Para desenvolver com recarga automática do servidor:

```bash
npm run dev
```

Se a porta 3000 estiver ocupada, no PowerShell:

```powershell
$env:PORT=3001; npm start
```

Também é possível abrir `index.html` direto no navegador (`file://`). Nesse caso tudo funciona **exceto** a IA, porque não existe servidor para fazer o proxy — o assistente usa apenas o cérebro local, o que é o comportamento esperado.

---

## O assistente e como ensiná-lo

O assistente tem duas camadas:

1. **Cérebro local (`js/data.js`)** — uma lista de intenções com padrões regex, palavras-chave e respostas. Funciona offline e é o que garante que o chat nunca fique mudo.
2. **IA via Ollama** — quando disponível, recebe o histórico da conversa e um *system prompt* com os fatos do meu currículo. Usei o prompt para restringir o modelo ao escopo do portfólio e proibir invenções.

### Ensinar uma resposta nova (modo local)

Abra `js/data.js` e adicione um item em `chat.intents`:

```js
{
  id: "certificados-extras",
  patterns: [/certificado|bootcamp/i],
  keywords: ["certificado", "certificacao", "bootcamp"],
  reply:
    "Além do curso **I.A. para Negócios**, também concluí ...",
  suggestions: ["Qual a formação dele?", "Quais são os projetos?", "Como entrar em contato?"]
}
```

Regras que sigo ao editar:

- Escrever as `keywords` **sem acento** (o motor normaliza o texto antes de comparar).
- Usar `patterns` para frases específicas e `keywords` para sinônimos soltos.
- Manter respostas curtas, em terceira pessoa, com fatos verificáveis.
- Sempre oferecer 2–3 `suggestions` para continuar a conversa.

### Atualizar o que a IA sabe

O modo IA não lê o arquivo de intenções: ele recebe o texto de `buildSystemPrompt()`, na mesma `data.js`. Ao adicionar um fato novo, coloque nos dois lugares — na intenção local e no prompt — para os dois modos ficarem consistentes.

---

## IA opcional com Ollama

Configure o `.env` a partir do `.env.example`:

```env
OLLAMA_HOST=https://ollama.com
OLLAMA_API_KEY=sua-chave-aqui
OLLAMA_MODEL=gpt-oss:120b
PORT=3000
```

**Ollama na nuvem:** crie a chave em [ollama.com](https://ollama.com) e confira se a conta tem créditos. Sem créditos, a API responde `402` e o assistente cai automaticamente no modo local — foi o que aconteceu durante o desenvolvimento.

**Ollama local:**

```env
OLLAMA_HOST=http://localhost:11434
OLLAMA_API_KEY=
OLLAMA_MODEL=llama3.1
```

```bash
ollama serve
ollama pull llama3.1
```

Para verificar o que o servidor está enxergando:

```
GET http://localhost:3000/api/health
```

A resposta indica se a IA está ativa, qual provedor e modelo estão em uso e, se houver problema, o motivo. Há cache de 20 segundos e limite de 20 mensagens por minuto por IP.

> **Atenção:** o health check consulta apenas a lista de modelos (`/api/tags`). Ele pode dizer que a IA está disponível e ainda assim a geração falhar por falta de créditos (`402`). Por isso o chat só exibe "IA · modelo" **depois** da primeira resposta bem-sucedida; até lá, mostra "cérebro local".

**Se a IA não responder,** nesta ordem: confira `OLLAMA_HOST`, a validade da chave, se o modelo existe na conta (`/api/tags`) e se há créditos. O chat mostra "cérebro local" no cabeçalho quando está no modo offline.

---

## Personalização

- **Textos, links, CVs, projetos e stack:** `js/data.js`.
- **Cores e gradientes:** bloco `:root` e `[data-theme="light"]` no início de `css/style.css`.
- **Fontes:** `Space Grotesk` (títulos), `Inter` (texto) e `JetBrains Mono` (código), via Google Fonts.
- **Imagem de compartilhamento:** `assets/img/og.png` (1200×630), referenciada nas metatags Open Graph.
- **Currículo:** é um PDF único em `assets/cv/Curriculo_Davi_Artur_Silva_Sousa.pdf`. Para atualizar, substitua o arquivo; se mudar o nome, ajuste `data.js` (bloco `resumes`) e os links de download em `index.html`.
- **Novo projeto:** acrescente um objeto em `projects` com `title`, `subtitle`, `description`, `bullets`, `tags`, `metrics` e, se quiser, `image`, `imageW`/`imageH` e `link`.

---

## Deploy

Por ser estático + um servidor Node, funciona bem em qualquer plataforma que rode Node:

- **Render / Railway / Fly.io:** comando `npm start`, porta vinda de `process.env.PORT` (já suportado).
- **Vercel / Netlify:** para publicar só o site, aponte para a raiz como estático. Nesse caso, o proxy `/api/chat` não existe e o assistente fica no modo local — o que é aceitável, mas perde a IA.
- **Hospedagem própria:** mantenha o `.env` fora do repositório e use HTTPS.

Antes de publicar, troque a imagem Open Graph por uma versão definitiva e confira os links de currículo.

---

## Acessibilidade e desempenho

- Estrutura semântica com `header`, `main`, `section`, `nav`, `footer` e hierarquia de títulos.
- Link "pular para o conteúdo", foco visível e rótulos `aria-*` nos controles.
- `aria-live` na conversa do assistente para leitores de tela.
- Respeito a `prefers-reduced-motion`: animações são desligadas e o fundo vira um quadro estático.
- Contraste pensado para os dois temas; o chat mantém área de toque confortável no mobile.
- Sem bibliotecas no front, imagens com `loading="lazy"` e fontes carregadas de forma assíncrona (`media="print"` + `onload`), sem bloquear o primeiro paint.
- O Canvas limita o `devicePixelRatio` a 1.25, desenha a **60 fps** com orçamento de partículas, usa menos partículas em telas pequenas e **pausa quando a aba ou a janela perde o foco**.
- Animações de destaque usam `transform`/`opacity` (compostas pela GPU). O pulso de disponibilidade virou anel animado em vez de `box-shadow`, e o gradiente dos títulos é estático — os dois custavam repaint contínuo.
- Os desfoques pesados saíram de cards, header, botões e do painel do chat; sobrou apenas na paleta de comandos, onde o efeito é realmente visível. O fundo aurora passou a usar só gradientes suaves, sem `filter: blur()`, e as camadas foram unidas em um único wrapper animado.
- Servidor com **gzip** (CSS de ~64 KB cai para ~13 KB, JS de ~37 KB para ~10 KB), `ETag`/`Last-Modified` com resposta `304` e `Cache-Control: no-cache` nos assets — o navegador revalida a cada visita, e os links de CSS/JS usam `?v=` para garantir a versão nova.
- Sem loops de `requestAnimationFrame` permanentes: cursor, tilt, scroll e marquee só trabalham quando há interação ou quando estão visíveis, e existe um modo `perf-low` automático para máquinas que não sustentam 60 fps.

Números do último teste local (1600×900, Edge headless): o site parado caiu de ~21% de CPU do renderer + ~21% da GPU para ~14% + ~10%; em rede 4G simulada, o total inicial caiu de ~149 KB para ~41 KB e o primeiro paint de ~2,7 s para ~2,2 s. Em máquina com GPU integrada ou muitos apps abertos, a diferença tende a ser mais perceptível que esses números.

---

## Sobre o currículo

O site disponibiliza **um único currículo em PDF**, na versão mais recente:

- **Desenvolvimento de Software / Web e Aplicações** — formação em ADS na Estácio, projetos (PcSpec, HwMon, este portfólio), stack em HTML, CSS, JavaScript, C#/.NET e Python, curso de I.A. para Negócios e experiência administrativa.

Antes eu mantinha duas versões (suporte técnico e administrativo). Removi as duas porque elas ficaram desatualizadas em relação ao que passei a construir: hoje o currículo é centrado em desenvolvimento e os projetos falam por si.

Dois pontos que ajustei de propósito, mantendo o que é consistente com o PDF:

- **Instituição:** **Estácio (ADS, cursando)**, conforme o currículo atual.
- **Inglês:** **intermediário**, exatamente como está no currículo — prefiro o mais conservador até ter como comprovar o contrário.

O PDF mostra que busco **estágio em Desenvolvimento de Software**; no site mantive a formulação mais ampla ("disponível para ingressar no mercado de TI, aberto a diferentes frentes"), porque não quero limitar conversas a uma única função.

Se algum dado mudar, o lugar de corrigir é `js/data.js` — e, por consequência, o prompt da IA.

---

## Segurança

- `.env` está no `.gitignore`. **Nunca** comite a chave.
- A chave é lida só no servidor e enviada ao Ollama no cabeçalho `Authorization`.
- O proxy valida método, tamanho do corpo, formato das mensagens e limite de tokens por requisição.
- Caminhos estáticos são normalizados e bloqueados fora da raiz do projeto.
- Cabeçalhos `X-Content-Type-Options` e `Referrer-Policy` ativos.
- Se você recebeu uma chave por chat, e-mail ou print, **rotacione** — trate como comprometida.

---

## Contato

- **E-mail:** Daviarturss27@gmail.com
- **Telefone / WhatsApp:** (81) 99219-2077
- **LinkedIn:** [in/daviartur](https://www.linkedin.com/in/daviartur/)
- **GitHub:** [github.com/daviarturss](https://github.com/daviarturss)
- **Localização:** Torre, Recife — PE

---

Feito à mão, sem template. Se algo aqui te ajudar a aprender também, ótimo — é meio para isso que eu deixo o código aberto.
