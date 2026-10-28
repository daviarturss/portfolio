/* =========================================================
   DAVI ARTUR — PORTFÓLIO
   Fonte única de conteúdo do site + cérebro do assistente.
   Edite aqui para atualizar textos, links, skills e respostas.
   ========================================================= */

window.PORTFOLIO = (function () {
  "use strict";

  /* ---------------------------------------------------------
     1) PERFIL
     --------------------------------------------------------- */
  const profile = {
    name: "Davi Artur Silva Sousa",
    shortName: "Davi Artur",
    initials: "DA",
    role: "Profissional de TI em formação",
    tagline: "Transformo curiosidade em soluções — da programação ao atendimento.",
    location: "Torre, Recife — PE",
    locationShort: "Recife · PE",
    email: "Daviarturss27@gmail.com",
    phone: "(81) 99219-2077",
    phoneRaw: "5581992192077",
    github: "https://github.com/daviarturss",
    linkedin: "https://www.linkedin.com/in/daviartur/",
    availability: "Em busca da primeira oportunidade no mercado de TI",
    education: "Análise e Desenvolvimento de Sistemas — Estácio (cursando)",
    english: "Intermediário",
    resumes: [
      {
        label: "Currículo — Desenvolvimento de Software",
        short: "Currículo",
        file: "assets/cv/Curriculo_Davi_Artur_Silva_Sousa.pdf",
        desc: "Versão atualizada: desenvolvimento de software, web e aplicações."
      }
    ],
    socials: [
      { id: "github", label: "GitHub", url: "https://github.com/daviarturss", handle: "daviarturss" },
      { id: "linkedin", label: "LinkedIn", url: "https://www.linkedin.com/in/daviartur/", handle: "in/daviartur" }
    ],
    bio: [
      "Sou Davi Artur, estudante de Análise e Desenvolvimento de Sistemas no Recife e apaixonado por tecnologia. Venho construindo minha base em programação — HTML, CSS, JavaScript e Python na web, e C#/.NET em aplicações desktop — além de Git, banco de dados e ferramentas de inteligência artificial.",
      "Minha trajetória passa pela área administrativa, onde aprendi a lidar com pessoas, sistemas, prazos e detalhes. Levo essas habilidades para o código: organização, comunicação clara e vontade de resolver o problema de verdade.",
      "Hoje busco minha primeira oportunidade em TI para aprender em contexto real e entregar valor desde o primeiro dia, aberto a diferentes frentes da área."
    ],
    pitch:
      "Aprendo rápido, organizo bem e gosto de gente. Se você precisa de alguém que una base técnica, atendimento e vontade de crescer, é comigo."
  };

  /* ---------------------------------------------------------
     2) NÚMEROS / DESTAQUES
     --------------------------------------------------------- */
  const stats = [
    { value: 307, suffix: "", label: "sensores monitorados no HwMon" },
    { value: 58, suffix: "", label: "hardwares mapeados no projeto" },
    { value: 5, suffix: "", label: "linguagens no stack principal" },
    { value: 2, suffix: "", label: "idiomas — PT nativo, EN intermediário" }
  ];

  const highlights = [
    {
      icon: "</>",
      title: "Programação em evolução",
      text: "Soluções com HTML semântico, CSS moderno, JavaScript e Python na web, e C#/.NET em aplicações desktop para Windows — da interface à automação."
    },
    {
      icon: "✦",
      title: "Automação & IA",
      text: "Uso de IA para pesquisar, aprender e acelerar tarefas. Curso de I.A. para Negócios pela Casa Zero."
    },
    {
      icon: "⌘",
      title: "Rotina e organização",
      text: "Vivência com sistemas internos, planilhas, documentação e atendimento ao público."
    },
    {
      icon: "↗",
      title: "Aprendizado contínuo",
      text: "Estudos ativos em React, Node.js e bancos de dados, com projetos próprios para praticar."
    }
  ];

  /* ---------------------------------------------------------
     3) STACK
     --------------------------------------------------------- */
  const skillFilters = [
    { id: "all", label: "Todas" },
    { id: "front", label: "Front-end" },
    { id: "back", label: "Back-end" },
    { id: "tools", label: "Ferramentas" }
  ];

  const skills = [
    { name: "HTML5", cat: "front", level: "Avançado", pct: 85, icon: "</>", color: "#E34F26",
      note: "Estrutura semântica e acessível" },
    { name: "CSS3", cat: "front", level: "Avançado", pct: 80, icon: "{ }", color: "#1572B6",
      note: "Layouts responsivos, grid, animações" },
    { name: "JavaScript", cat: "front", level: "Intermediário", pct: 70, icon: "JS", color: "#F7DF1E",
      note: "DOM, eventos, fetch e Canvas" },
    { name: "Python", cat: "back", level: "Intermediário", pct: 65, icon: "Py", color: "#3776AB",
      note: "Scripts, lógica e automação" },
    { name: "C# / .NET", cat: "back", level: "Intermediário", pct: 60, icon: "C#", color: "#512BD4",
      note: "Apps desktop com WPF e CLI" },
    { name: "React", cat: "front", level: "Em estudo", pct: 35, icon: "R", color: "#61DAFB",
      note: "Componentes e estado" },
    { name: "Node.js", cat: "back", level: "Em estudo", pct: 35, icon: "N", color: "#3C873A",
      note: "APIs e servidores" },
    { name: "Banco de dados", cat: "back", level: "Em estudo", pct: 30, icon: "DB", color: "#A371F7",
      note: "Modelagem e consultas" },
    { name: "Git & GitHub", cat: "tools", level: "Intermediário", pct: 70, icon: "Git", color: "#F05032",
      note: "Versionamento e colaboração" },
    { name: "IA & automação", cat: "tools", level: "Intermediário", pct: 60, icon: "✦", color: "#22D3EE",
      note: "Pesquisa, produtividade e scripts" },
    { name: "Excel / Office", cat: "tools", level: "Avançado", pct: 85, icon: "X", color: "#217346",
      note: "Planilhas, relatórios e documentos" }
  ];

  /* ---------------------------------------------------------
     4) PROJETOS
     --------------------------------------------------------- */
  const projects = [
    {
      id: "pcspec",
      featured: true,
      title: "PcSpec",
      subtitle: "Especificações do PC — clone do CPU-Z em C#/.NET",
      description:
        "Clone funcional do CPU-Z escrito do zero em C#/.NET 10, usando só APIs públicas do Windows: CPUID, SMBIOS, WMI, registro e topologia. Tem app WPF com 7 abas, CLI completa, benchmark próprio single/multi-thread e relatórios em TXT, HTML e JSON. Foi meu principal projeto de aprendizado em C#/.NET e nasceu de um estudo de engenharia reversa do CPU-Z 3.0.1 feito com REA + Ghidra — sem reutilizar código do original.",
      aiNote:
        "Feito com apoio de IA, não sozinho: usei o modelo para estudar as APIs do Windows, revisar trechos e explicar erros enquanto aprendia C#/.NET. A estrutura, a integração e os testes passaram por mim.",
      bullets: [
        "7 abas: Sistema, CPU, Placa-mãe, Memória, Gráficos, Benchmark e Relatório",
        "Camada Core compartilhada entre o app WPF e a CLI",
        "Benchmark com 4 cargas em 1 e N threads e score geométrico"
      ],
      image: "assets/img/pcspec.png",
      imageAlt: "Interface do PcSpec mostrando chips de resumo de CPU, memória, placa-mãe, gráficos e sistema",
      imageW: 1200,
      imageH: 880,
      tags: ["C#", ".NET 10", "WPF", "CLI", "CPUID", "SMBIOS", "Engenharia reversa"],
      metrics: [
        { value: "7", label: "abas no app" },
        { value: "4", label: "cargas no benchmark" },
        { value: "0", label: "drivers de kernel" }
      ],
      link: "https://github.com/daviarturss/pcspec",
      linkLabel: "Ver no GitHub",
      status: "Projeto pessoal",
      year: "2026",
      accent: "cyan"
    },
    {
      id: "hwmon",
      featured: true,
      title: "HwMon",
      subtitle: "Monitor de sensores para Windows",
      description:
        "Um clone funcional do monitoramento do HWiNFO64, escrito do zero em C#/.NET 10. O app WPF lê CPU, GPU, placa-mãe, memória, discos e rede, com filtros, estatísticas em tempo real, alertas por limite e exportação CSV. A CLI cobre list, watch, export e providers.",
      aiNote:
        "Segundo projeto grande em C#/.NET, também com apoio de IA: usei o modelo para entender o WPF, a API de sensores e revisar código. As decisões de arquitetura e os testes foram meus.",
      bullets: [
        "307 sensores coletados em 58 hardwares",
        "Arquitetura em 3 camadas: App WPF, Core e CLI",
        "Alertas só em transições + log CSV por amostra"
      ],
      image: "assets/img/hwmon.png",
      imageAlt: "Interface do HwMon mostrando sensores de CPU, temperaturas e cargas por núcleo",
      tags: ["C#", ".NET 10", "WPF", "CLI", "LibreHardwareMonitor", "CSV"],
      metrics: [
        { value: "307", label: "sensores" },
        { value: "58", label: "hardwares" },
        { value: "3", label: "camadas" }
      ],
      link: "https://github.com/daviarturss/hwmon",
      linkLabel: "Ver no GitHub",
      status: "Projeto pessoal",
      year: "2026"
    },
    {
      id: "portfolio",
      title: "Este portfólio",
      subtitle: "Landing page + assistente com IA",
      description:
        "Site feito com HTML, CSS e JavaScript puros: fundo em Canvas, microinterações, command palette e um assistente que responde sobre mim usando um cérebro local — com opção de IA via Ollama.",
      aiNote:
        "Escrito por mim em HTML, CSS e JavaScript, com IA como apoio para revisar layout, acessibilidade e desempenho — não para gerar o projeto inteiro.",
      bullets: [
        "Zero frameworks e zero build",
        "Fundo animado + acessibilidade e prefers-reduced-motion",
        "Chatbot com fallback offline e IA opcional"
      ],
      image: null,
      tags: ["HTML", "CSS", "JavaScript", "Canvas", "Ollama", "A11y"],
      metrics: [
        { value: "0", label: "dependências no front" },
        { value: "2", label: "modos de chatbot" },
        { value: "100", label: "responsivo" }
      ],
      link: "https://github.com/daviarturss/portfolio",
      linkLabel: "Ver no GitHub",
      status: "Projeto pessoal",
      year: "2026",
      accent: "cyan"
    },
    {
      id: "lab",
      title: "Laboratório React + Node",
      subtitle: "Estudos aplicados",
      description:
        "Experimentos para transformar estudo em prática: componentes, rotas, consumo de API e um backend simples com Node.js. Sem pressa, sem atalho — cada experimento vira aprendizado.",
      aiNote:
        "Estudos com IA como tutora: ela explica conceitos e revisa exercícios, mas o código é escrito e testado por mim.",
      bullets: [
        "Componentização e estado no React",
        "APIs REST com Node.js",
        "Modelagem de dados em banco relacional"
      ],
      image: null,
      tags: ["React", "Node.js", "API REST", "Estudos"],
      metrics: [
        { value: "3", label: "frentes de estudo" },
        { value: "∞", label: "curiosidade" }
      ],
      status: "Em andamento",
      year: "2026",
      accent: "purple",
      link: "https://github.com/daviarturss",
      linkLabel: "Acompanhar no GitHub"
    }
  ];

  /* ---------------------------------------------------------
     5) TRAJETÓRIA
     --------------------------------------------------------- */
  const timeline = [
    {
      type: "work",
      date: "Out 2025 — Mai 2026",
      title: "Consultor de Vendas · Administrativo",
      place: "Atuação administrativa",
      description:
        "Organização de documentos físicos e digitais, suporte à comunicação interna e atendimento ao público. Atualização e controle de registros em sistemas e planilhas, preparação de documentos, apoio a reuniões e demandas operacionais.",
      tags: ["Atendimento", "Sistemas internos", "Excel", "Organização"]
    },
    {
      type: "study",
      date: "Cursando",
      title: "Análise e Desenvolvimento de Sistemas",
      place: "Estácio",
      description:
        "Graduação em andamento com base em lógica de programação, desenvolvimento web, banco de dados e fundamentos de TI.",
      tags: ["ADS", "Lógica", "Desenvolvimento web"]
    },
    {
      type: "course",
      date: "Curso livre",
      title: "I.A. para Negócios",
      place: "Casa Zero",
      description:
        "Formação complementar sobre uso de inteligência artificial aplicada a negócios, produtividade e resolução de problemas.",
      tags: ["Inteligência artificial", "Produtividade"]
    },
    {
      type: "study",
      date: "Concluído em 2018",
      title: "Ensino Médio",
      place: "ETE Porto Digital",
      description:
        "Formação básica com contato com tecnologia, projetos e cultura digital — o ponto de partida da minha curiosidade pela área.",
      tags: ["Tecnologia", "Projetos"]
    }
  ];

  const softSkills = [
    "Proatividade",
    "Comunicação clara",
    "Trabalho em equipe",
    "Organização",
    "Gestão de tempo",
    "Aprendizado rápido",
    "Pensamento analítico",
    "Resolução de problemas",
    "Atenção aos detalhes",
    "Adaptabilidade"
  ];

  /* ---------------------------------------------------------
     6) CÉREBRO DO CHATBOT (modo local, sem API)
     --------------------------------------------------------- */
  const chatSuggestions = [
    "Quem é o Davi?",
    "O que ele sabe fazer?",
    "Fale sobre os projetos",
    "Como entrar em contato?"
  ];

  const intents = [
    {
      id: "greeting",
      patterns: [/^(oi|ola|opa|eai|e ai|salve|hey|bom dia|boa tarde|boa noite|tudo bem|beleza)[\s!.,?]*$/i],
      keywords: ["oi", "ola", "opa", "eai", "bom dia", "boa tarde", "boa noite", "tudo bem"],
      replies: [
        "Oi! 👋 Eu sou o assistente do Davi. Posso falar sobre a formação, a experiência, a stack, os projetos e como falar com ele. O que você quer saber?",
        "Olá! Que bom te ver por aqui. 😄 Pergunte o que quiser sobre o Davi — formação, projetos, habilidades ou contato."
      ],
      suggestions: ["Quem é o Davi?", "Quais são os projetos?", "Ele está disponível?"]
    },
    {
      id: "about",
      patterns: [/quem (e|eh) (o )?davi/i, /fale? sobre (o )?(davi|voce)/i, /se apresenta/i, /resumo (profissional|sobre)/i, /quem (e|eh) voce/i],
      keywords: ["quem e davis", "quem e davi", "sobre davi", "sobre voce", "se apresente", "apresentacao", "resumo profissional"],
      reply:
        "O Davi Artur Silva Sousa é estudante de **Análise e Desenvolvimento de Sistemas** no Recife e está em busca da primeira oportunidade em TI. Ele tem base em **HTML, CSS, JavaScript e Python**, usa Git/GitHub e ferramentas de IA, e traz da área administrativa experiência com atendimento, sistemas, planilhas e organização.\n\nEm uma frase: **base técnica em construção + comunicação e organização de gente que já trabalhou com o público.**",
      suggestions: ["O que ele sabe fazer?", "Qual a experiência dele?", "Como entrar em contato?"]
    },
    {
      id: "name",
      patterns: [/qual (e|eh) (o )?(seu )?nome/i, /nome completo/i],
      keywords: ["nome completo", "seu nome", "qual o nome"],
      reply: "O nome completo dele é **Davi Artur Silva Sousa** — pode chamar de Davi. 🙂",
      suggestions: ["Quem é o Davi?", "Onde ele mora?", "Qual a formação dele?"]
    },
    {
      id: "age",
      patterns: [/quantos anos/i, /qual (a )?idade/i, /data de nascimento/i],
      keywords: ["idade", "quantos anos", "nascimento", "aniversario"],
      reply:
        "Essa informação não está no currículo, então prefiro não chutar. 😅 Se precisar, o contato direto do Davi é **Daviarturss27@gmail.com**.",
      suggestions: ["Como entrar em contato?", "Fale sobre a formação", "Quais são os projetos?"]
    },
    {
      id: "education",
      patterns: [/formacao|faculdade|estud(a|ou|ando)|graduacao|ads|analise e desenvolvimento|estacio|onde estudou/i],
      keywords: ["formacao", "faculdade", "graduacao", "estacio", "ads", "analise e desenvolvimento", "estudando", "estudou", "curso"],
      reply:
        "O Davi cursa **Análise e Desenvolvimento de Sistemas na Estácio** e concluiu o ensino médio na **ETE Porto Digital** em 2018. Também fez o curso **I.A. para Negócios** pela Casa Zero.\n\nEle está sempre estudando por fora: React, Node.js e banco de dados estão no radar atual.",
      suggestions: ["O que ele está estudando agora?", "Ele tem certificados?", "Quais são os projetos?"]
    },
    {
      id: "experience",
      patterns: [/experiencia|ja trabalhou|trabalho|emprego|curriculo profissional|atuou/i],
      keywords: ["experiencia", "trabalhou", "trabalho", "emprego", "atuou", "consultor", "vendas"],
      reply:
        "A experiência profissional dele é como **Consultor de Vendas · Administrativo**, entre **out/2025 e mai/2026**. No dia a dia: organização de documentos físicos e digitais, atualização de registros em sistemas e planilhas, suporte à comunicação interna e atendimento ao público.\n\nÉ uma experiência que rendeu **organização, comunicação e familiaridade com sistemas** — coisas que contam em qualquer vaga de TI.",
      suggestions: ["Ele já mexeu com suporte?", "Quais são as soft skills?", "Ele está disponível?"]
    },
    {
      id: "skills",
      patterns: [/o que (ele |voce |vc )?sabe|sabe fazer|habilidades|stack|tecnologias|conhecimentos|linguagens|ferramentas/i],
      keywords: ["habilidades", "stack", "tecnologias", "conhecimentos", "linguagens", "ferramentas", "o que sabe", "sabe fazer"],
      reply:
        "A stack dele hoje:\n\n**Front-end:** HTML, CSS e JavaScript\n**Back-end:** Python (e estudos em Node.js e banco de dados)\n**Ferramentas:** Git, GitHub, VS Code, Excel/Office\n**Extras:** IA generativa, automação e suporte a sistemas\n\nEle tem prática de projeto próprio — o **HwMon**, em C#/.NET — e este portfólio, feito em HTML/CSS/JS puro.",
      suggestions: ["Fale sobre Python", "E o JavaScript?", "Quais são os projetos?"]
    },
    {
      id: "frontend",
      patterns: [/front.?end|html|css|javascript|js\b|react/i],
      keywords: ["frontend", "front end", "html", "css", "javascript", "react"],
      reply:
        "No front-end ele trabalha com **HTML semântico, CSS moderno (grid, flex, animações) e JavaScript puro** — DOM, eventos, fetch e Canvas. Também está estudando **React**.\n\nEste site é a vitrine: responsivo, com fundo animado, microinterações e acessibilidade.",
      suggestions: ["Fale sobre o portfólio", "E o Python?", "Quais projetos ele tem?"]
    },
    {
      id: "backend",
      patterns: [/back.?end|python|node|banco de dados|sql/i],
      keywords: ["backend", "back end", "python", "node", "banco de dados", "sql"],
      reply:
        "No back-end, a base é **Python** (lógica, scripts e automação). Em aplicações desktop, ele trabalha com **C#/.NET 10 e WPF** — é a stack do PcSpec e do HwMon. Também está estudando **Node.js** e **bancos de dados**, aplicando em pequenos experimentos.\n\nNada de fingir senioridade: é uma base em crescimento, com prática real em projetos.",
      suggestions: ["Fale sobre o HwMon", "O que ele está estudando?", "Ele usa IA?"]
    },
    {
      id: "ai",
      patterns: [/inteligencia artificial|\bia\b|automacao|chatgpt|ollama/i],
      keywords: ["inteligencia artificial", "ia", "automacao", "chatgpt", "ollama", "prompt"],
      reply:
        "Ele usa **IA como ferramenta de trabalho**: pesquisa, aprendizado, organização de tarefas e produtividade. Fez o curso **I.A. para Negócios** pela Casa Zero.\n\nE este próprio assistente é um exemplo: tem um cérebro local e pode usar **Ollama** quando a IA está habilitada. 🤖",
      suggestions: ["Como funciona este chatbot?", "Quais são os projetos?", "Qual a formação dele?"]
    },
    {
      id: "projects",
      patterns: [/projetos|portfolio|portifolio|o que (ele )?construiu|github.*projeto/i],
      keywords: ["projetos", "portfolio", "portifolio", "construiu", "desenvolveu"],
      reply:
        "Os principais projetos:\n\n**1. PcSpec** — clone funcional do CPU-Z em C#/.NET 10, com app WPF de 7 abas, CLI, benchmark próprio e relatórios TXT/HTML/JSON.\n**2. HwMon** — monitor de sensores para Windows em C#/.NET 10, com app WPF, CLI, 307 sensores, alertas e CSV.\n**3. Este portfólio** — HTML/CSS/JS puros, Canvas, command palette e chatbot.\n**4. Laboratório React + Node** — estudos aplicados em componentes, APIs e banco de dados.\n\nEm todos ele usou **IA como apoio de estudo** (pesquisa, revisão e depuração) — não esconde isso. Quer detalhes de qual?",
      suggestions: ["Me fala mais do PcSpec", "Me fala mais do HwMon", "Como foi feito este site?"]
    },
    {
      id: "pcspec",
      patterns: [/pcspec|pc spec|cpu.?z|especificac|smbios|benchmark|ghidra|rea-agents|rea \+ ghidra|engenharia reversa/i],
      keywords: ["pcspec", "cpu-z", "cpuz", "especificacoes", "smbios", "benchmark", "ghidra", "engenharia reversa", "ddr"],
      reply:
        "O **PcSpec** é o mais recente: um clone funcional do **CPU-Z** escrito do zero em **C#/.NET 10**, só com APIs públicas do Windows (CPUID, SMBIOS, WMI e registro).\n\n• App **WPF** com 7 abas e chips de resumo\n• **CLI** com `cpu`, `memory`, `bench`, `report`, `json`\n• **Benchmark** próprio: inteiro, ponto flutuante, memória e SHA-256\n• Relatórios em **TXT, HTML e JSON**, tudo local e sem driver de kernel\n\nFoi o principal projeto de aprendizado dele em **C#/.NET**, com **IA como apoio** para estudar APIs e revisar código — não foi feito 100% sozinho. A ideia surgiu de um estudo de **engenharia reversa do CPU-Z 3.0.1** feito com **REA + Ghidra**, mas o código é independente. Está no GitHub.",
      suggestions: ["Ver o GitHub dele", "Me fala mais do HwMon", "Quais outros projetos?"]
    },
    {
      id: "hwmon",
      patterns: [/hwmon|monitor de sensores|hwinfo|hardware/i],
      keywords: ["hwmon", "hwinfo", "monitor de sensores", "sensores", "hardware", "c#", "dotnet", "wpf"],
      reply:
        "O **HwMon** é um monitor de sensores para Windows escrito em **C#/.NET 10** — um clone funcional do HWiNFO64, sem usar código do original.\n\n• **307 sensores** em **58 hardwares** (CPU, GPU, placa-mãe, RAM, discos, rede)\n• App **WPF** com filtro, pausa, estatísticas e alertas\n• **CLI** com `list`, `watch`, `export` e `providers`\n• Exportação **CSV** e arquitetura em 3 camadas\n\nTambém foi um projeto de aprendizado, com **IA como apoio** para entender WPF e revisar código. Está no GitHub do Davi.",
      suggestions: ["Ver o GitHub dele", "Quais outros projetos?", "Ele sabe C#?"]
    },
    {
      id: "csharp",
      patterns: [/\bc\b|\bcsharp\b|\bc sharp\b|dotnet|\bwpf\b|\bnet 10\b/i],
      keywords: ["csharp", "dotnet", "wpf", "desktop", "aplicativo windows"],
      reply:
        "**Sim — C#/.NET é uma das stacks dele.** Os dois projetos desktop do portfólio são em **C#/.NET 10** com **WPF**:\n\n• **PcSpec** — clone do CPU-Z, app de 7 abas + CLI e benchmark\n• **HwMon** — monitor de sensores, WPF + CLI, 307 sensores\n\nNos dois, a lógica fica em uma camada **Core** compartilhada entre a interface e a linha de comando.",
      suggestions: ["Me fala mais do PcSpec", "Me fala mais do HwMon", "Quais são as habilidades?"]
    },
    {
      id: "portfolio-site",
      patterns: [/este site|esse site|como (foi )?feito|portifolio.*(site|feito)|chatbot.*funciona/i],
      keywords: ["este site", "esse site", "como foi feito", "site", " chatbot", "command palette"],
      reply:
        "Este portfólio foi feito **do zero com HTML, CSS e JavaScript** — sem framework, sem build. Tem fundo em Canvas com partículas, tilt 3D, reveal no scroll, command palette (**Ctrl/Cmd + K**), tema claro/escuro e um assistente com cérebro local + IA opcional via Ollama.",
      suggestions: ["Como funciona o chatbot?", "Ver os projetos", "Como entrar em contato?"]
    },
    {
      id: "chatbot",
      patterns: [/chatbot|assistente|robo|bot\b|voce (e|eh) (um )?(robo|humano|ia)/i],
      keywords: ["chatbot", "assistente", "robo", "bot", "humano", "robô"],
      reply:
        "Sou um **assistente virtual** treinado com as informações do currículo e do portfólio do Davi. Respondo localmente, sem depender de internet, e posso usar IA via Ollama quando está habilitada.\n\nO Davi é humano — eu sou o bot. 😄",
      suggestions: ["O que você sabe sobre ele?", "Quem é o Davi?", "Como entrar em contato?"]
    },
    {
      id: "contact",
      patterns: [/contato|falar com|email|e-mail|telefone|whatsapp|linkedin|github/i],
      keywords: ["contato", "email", "e-mail", "telefone", "whatsapp", "linkedin", "github", "falar com"],
      reply:
        "Você pode falar direto com o Davi:\n\n✉️ **Daviarturss27@gmail.com**\n📱 **(81) 99219-2077**\n💼 [LinkedIn](https://www.linkedin.com/in/daviartur/)\n🐙 [GitHub](https://github.com/daviarturss)\n\nEle está no Recife e aberto a conversas sobre a primeira oportunidade no mercado de TI.",
      suggestions: ["Ele está disponível?", "Baixar o currículo", "Onde ele mora?"]
    },
    {
      id: "email",
      patterns: [/qual (o )?(email|e-mail)/i, /manda(r)? (o )?email/i],
      keywords: ["email", "e-mail", "endereco de email"],
      reply: "O e-mail do Davi é **Daviarturss27@gmail.com**. Pode copiar no botão de contato do site também. ✉️",
      suggestions: ["Qual o telefone?", "Abrir o LinkedIn", "Baixar o currículo"]
    },
    {
      id: "phone",
      patterns: [/telefone|celular|whatsapp|numero/i],
      keywords: ["telefone", "celular", "whatsapp", "numero"],
      reply: "O telefone/WhatsApp dele é **(81) 99219-2077**. 📱",
      suggestions: ["Qual o e-mail?", "Ele está disponível?", "Abrir o LinkedIn"]
    },
    {
      id: "linkedin",
      patterns: [/linkedin/i],
      keywords: ["linkedin"],
      reply: "O LinkedIn do Davi é [linkedin.com/in/daviartur](https://www.linkedin.com/in/daviartur/). 💼",
      suggestions: ["Ver o GitHub", "Baixar o currículo", "Como entrar em contato?"]
    },
    {
      id: "github",
      patterns: [/github/i],
      keywords: ["github", "repositorio", "repos"],
      reply: "O GitHub dele é [github.com/daviarturss](https://github.com/daviarturss). 🐙 Lá ficam os projetos e experimentos.",
      suggestions: ["Fale sobre o HwMon", "Quais são os projetos?", "Baixar o currículo"]
    },
    {
      id: "location",
      patterns: [/onde (ele )?mora|localizacao|cidade|recife|remoto|presencial|hibrido/i],
      keywords: ["onde mora", "localizacao", "cidade", "recife", "remoto", "presencial", "hibrido", "mora"],
      reply:
        "Ele mora no **Recife — PE**, na região da Torre. Sobre modelo de trabalho: está aberto a oportunidades **presenciais na região e remotas** — o ideal é alinhar direto com ele.",
      suggestions: ["Ele está disponível?", "Como entrar em contato?", "Qual a formação dele?"]
    },
    {
      id: "languages",
      patterns: [/idioma|ingles|english|portugues|fala ingles/i],
      keywords: ["idioma", "ingles", "english", "portugues", "lingua"],
      reply:
        "**Português:** nativo.\n**Inglês:** intermediário — leitura técnica e conversação em desenvolvimento.\n\nEle segue praticando, inclusive com conteúdo e documentação em inglês.",
      suggestions: ["Qual a formação dele?", "O que ele está estudando?", "Quais são as soft skills?"]
    },
    {
      id: "availability",
      patterns: [/voces contratam|contratacao|contratando|contratado|disponivel|disponibilidade|oportunidade|vaga|estagio|junior|trabalhar/i],
      keywords: ["disponivel", "disponibilidade", "oportunidade", "vaga", "estagio", "junior", "contratar", "trabalhar"],
      reply:
        "**Sim, ele está disponível!** 🚀 Busca a primeira oportunidade no mercado de TI, aberto a diferentes frentes da área.\n\nO melhor caminho é chamar no e-mail **Daviarturss27@gmail.com** ou no LinkedIn.",
      suggestions: ["Por que contratar o Davi?", "Como entrar em contato?", "Baixar o currículo"]
    },
    {
      id: "salary",
      patterns: [/salario|pretensao|remuneracao|quanto (ele )?quer|pagamento/i],
      keywords: ["salario", "pretensao", "remuneracao", "quanto quer", "pagamento"],
      reply:
        "O currículo não traz pretensão salarial — e isso é melhor alinhar direto com o Davi, considerando a vaga e o modelo de trabalho. 🙂\n\nContato: **Daviarturss27@gmail.com**.",
      suggestions: ["Ele está disponível?", "Como entrar em contato?", "Baixar o currículo"]
    },
    {
      id: "resume",
      patterns: [/curriculo|cv\b|baixar|download/i],
      keywords: ["curriculo", "cv", "baixar", "download"],
      reply:
        "O currículo do Davi está em PDF, atualizado e com foco em **desenvolvimento de software, web e aplicações**:\n\n📄 [Baixar currículo](assets/cv/Curriculo_Davi_Artur_Silva_Sousa.pdf)\n\nEle também pode ser baixado pelos botões do site, na seção inicial e no bloco de contato.",
      suggestions: ["Como entrar em contato?", "Ele está disponível?", "Quais são as habilidades?"]
    },
    {
      id: "softskills",
      patterns: [/soft skills|comportament|diferenciais|qualidades|pontos fortes|trabalho em equipe/i],
      keywords: ["soft skills", "comportamentais", "diferenciais", "qualidades", "pontos fortes", "trabalho em equipe", "equipe"],
      reply:
        "Os pontos fortes dele: **proatividade, comunicação clara, organização, trabalho em equipe, gestão de tempo, aprendizado rápido, pensamento analítico, resolução de problemas, atenção aos detalhes e adaptabilidade.**\n\nVindos, em boa parte, da vivência com atendimento ao público e rotinas administrativas.",
      suggestions: ["Por que contratar o Davi?", "Qual a experiência dele?", "Ele está disponível?"]
    },
    {
      id: "why-hire",
      patterns: [/por que.*(contratar|escolher|devo)/i, /porque.*contratar/i, /por que (te )?contratar/i, /o que (ele )?agrega/i, /diferencial/i],
      keywords: ["por que contratar", "porque contratar", "devo contratar", "escolher", "agrega", "diferencial"],
      reply:
        "Três motivos bem práticos:\n\n**1. Base técnica + vontade real de aprender** — HTML, CSS, JS, Python, Git e projetos próprios como o HwMon.\n**2. Gente que sabe lidar com gente** — atendimento, comunicação e organização vindos da rotina administrativa.\n**3. Entrega com contexto** — ele entende o problema antes de escrever a solução.\n\nÉ um pacote que funciona em diferentes frentes da área de TI.",
      suggestions: ["Ele está disponível?", "Ver os projetos", "Como entrar em contato?"]
    },
    {
      id: "goal",
      patterns: [/objetivo|futuro|carreira|onde quer chegar|plano/i],
      keywords: ["objetivo", "futuro", "carreira", "plano", "quer chegar"],
      reply:
        "O objetivo é entrar na área de TI e crescer como **profissional de tecnologia**, unindo programação, automação e um bom atendimento. No curto prazo: **ingressar no mercado de TI**, aprender em contexto real e transformar estudo em entrega.",
      suggestions: ["Ele está disponível?", "O que ele está estudando?", "Ver os projetos"]
    },
    {
      id: "studying",
      patterns: [/estudando agora|estudos atuais|o que (ele )?esta aprendendo|react|node/i],
      keywords: ["estudando agora", "estudos atuais", "aprendendo", "react", "node", "banco de dados"],
      reply:
        "No momento ele está aprofundando **React**, **Node.js** e **bancos de dados**, além de praticar JavaScript e Python em projetos próprios. Também usa IA para acelerar pesquisa e aprendizado.",
      suggestions: ["Fale sobre o laboratório", "Quais são os projetos?", "Qual a formação dele?"]
    },
    {
      id: "support",
      patterns: [/suporte|help desk|ti|tecnico|manutencao|problema/i],
      keywords: ["suporte", "help desk", "tecnico", "manutencao", "problema", "ti"],
      reply:
        "Ele tem base para **suporte técnico e resolução de problemas**: identificar falhas, apoiar sistemas e processos, atualizar registros internos, mexer com planilhas e documentação — uma das várias frentes em que pode contribuir.\n\nA experiência administrativa rendeu **atendimento e comunicação**, úteis em qualquer área.",
      suggestions: ["Ele está disponível?", "Quais são as soft skills?", "Quais são as habilidades?"]
    },
    {
      id: "tools",
      patterns: [/excel|office|word|powerpoint|windows|vs code/i],
      keywords: ["excel", "office", "word", "powerpoint", "windows", "vs code"],
      reply:
        "Ele tem **informática avançada** e domina o pacote Office — com destaque para **Excel** (planilhas, controle e relatórios), além de Word e PowerPoint. No dia a dia de desenvolvimento, usa **VS Code**, Git e GitHub.",
      suggestions: ["Quais são as habilidades?", "Qual a experiência dele?", "Ele usa IA?"]
    },
    {
      id: "certificates",
      patterns: [/certificado|certificacao|diploma|curso/i],
      keywords: ["certificado", "certificacao", "diploma", "curso"],
      reply:
        "O currículo registra o curso **I.A. para Negócios — Casa Zero**, além da formação em ADS (cursando) e o ensino médio na ETE Porto Digital. Outras certificações podem ser combinadas direto com ele.",
      suggestions: ["Qual a formação dele?", "O que ele está estudando?", "Como entrar em contato?"]
    },
    {
      id: "age-unknown",
      patterns: [/hobby|hobbies|tempo livre|gosta de fazer|curiosidade|musica|jogo|filme/i],
      keywords: ["hobby", "hobbies", "tempo livre", "gosta de fazer", "curiosidade", "musica", "jogo", "filme"],
      reply:
        "Isso não está no currículo — e eu não invento. 😅 O que dá para afirmar: ele gosta de tecnologia, de aprender coisas novas e de transformar ideias em projetos. Quer perguntar outra coisa?",
      suggestions: ["Quais são os projetos?", "O que ele sabe fazer?", "Como entrar em contato?"]
    },
    {
      id: "help",
      patterns: [/o que voce (pode|sabe) (fazer|responder)|ajuda|me ajuda|topicos|perguntas/i],
      keywords: ["ajuda", "topicos", "o que pode responder", "o que voce sabe", "perguntas"],
      reply:
        "Posso responder sobre:\n\n• Quem é o Davi e a formação dele\n• Experiência profissional e soft skills\n• Stack, projetos (PcSpec, HwMon, portfólio) e estudos\n• Contato, currículo, idiomas e disponibilidade\n\nÉ só perguntar em linguagem natural. 🙂",
      suggestions: ["Quem é o Davi?", "Quais são os projetos?", "Ele está disponível?"]
    },
    {
      id: "thanks",
      patterns: [/obrigad|valeu|agradec|thanks|brigad/i],
      keywords: ["obrigado", "obrigada", "valeu", "agradeco", "thanks"],
      replies: [
        "De nada! 😄 Se quiser, posso falar sobre os projetos ou passar o contato do Davi.",
        "Por nada! Qualquer dúvida sobre o Davi, é só chamar. 🚀"
      ],
      suggestions: ["Ver os projetos", "Como entrar em contato?", "Baixar o currículo"]
    },
    {
      id: "bye",
      patterns: [/tchau|ate mais|adeus|falou|bye|ate logo/i],
      keywords: ["tchau", "ate mais", "adeus", "falou", "bye"],
      reply: "Até mais! 👋 Se quiser falar com o Davi de verdade: **Daviarturss27@gmail.com**. Boa sorte por aí!",
      suggestions: ["Como entrar em contato?", "Ver os projetos", "Quem é o Davi?"]
    }
  ];

  const fallback =
    "Ainda não tenho essa informação sobre o Davi — e prefiro não inventar. 😅\n\nPosso falar sobre **formação, experiência, stack, projetos, contato, idiomas e disponibilidade**. Se for algo específico, o melhor caminho é falar direto com ele: **Daviarturss27@gmail.com**.";

  /* ---------------------------------------------------------
     7) PROMPT DO MODO IA (Ollama)
     --------------------------------------------------------- */
  function buildSystemPrompt() {
    return [
      "Você é o assistente virtual do portfólio de Davi Artur Silva Sousa.",
      "Responda em português do Brasil, em 3ª pessoa (fale 'o Davi', nunca 'eu'), com tom simpático, direto e profissional.",
      "Use no máximo 90 palavras. Pode usar **negrito** e links em markdown.",
      "NUNCA invente fatos. Se a informação não estiver abaixo, diga que não está no currículo e sugira o contato.",
      "",
      "FATOS:",
      "- Nome: Davi Artur Silva Sousa. Mora em Torre, Recife — PE.",
      "- Cursa Análise e Desenvolvimento de Sistemas na Estácio. Ensino médio na ETE Porto Digital (2018). Curso I.A. para Negócios pela Casa Zero.",
      "- Experiência: Consultor de Vendas/Administrativo de out/2025 a mai/2026 — documentos, sistemas internos, planilhas, atendimento e comunicação interna.",
      "- Stack: HTML, CSS, JavaScript, Python, C#/.NET (WPF e CLI). Git/GitHub. Estudos em React, Node.js e banco de dados. Excel/Office avançado.",
      "- Projetos: PcSpec (clone do CPU-Z em C#/.NET 10: app WPF com 7 abas, CLI, benchmark single/multi-thread e relatórios TXT/HTML/JSON; nasceu de um estudo de engenharia reversa do CPU-Z 3.0.1 feito com REA + Ghidra); HwMon (monitor de sensores Windows em C#/.NET 10, WPF + CLI, 307 sensores, alertas, CSV); este portfólio (HTML/CSS/JS puro, Canvas, chatbot); laboratório React + Node.",
      "- Transparência sobre IA: os projetos foram feitos por ele com apoio de IA como ferramenta de estudo (pesquisa de APIs, revisão de código e depuração). Nunca diga que ele fez tudo sozinho; também não diga que a IA fez o projeto por ele.",
      "- Soft skills: proatividade, comunicação, organização, trabalho em equipe, aprendizado rápido, resolução de problemas.",
      "- Idiomas: português nativo; inglês intermediário.",
      "- Disponibilidade: em busca da primeira oportunidade no mercado de TI, aberto a diferentes frentes; presencial no Recife ou remoto.",
      "- Contato: Daviarturss27@gmail.com | (81) 99219-2077 | linkedin.com/in/daviartur | github.com/daviarturss.",
      "- Currículo (PDF único): assets/cv/Curriculo_Davi_Artur_Silva_Sousa.pdf.",
      "- Idade e pretensão salarial não constam no currículo.",
      "",
      "Se perguntarem algo fora disso, responda que não tem a informação e indique o e-mail. Não fale sobre assuntos aleatórios; volte ao portfólio."
    ].join("\n");
  }

  return {
    profile,
    stats,
    highlights,
    skills,
    skillFilters,
    projects,
    timeline,
    softSkills,
    chat: {
      suggestions: chatSuggestions,
      intents,
      fallback,
      buildSystemPrompt
    }
  };
})();
