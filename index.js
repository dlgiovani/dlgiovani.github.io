import { jsx, jsxs, Fragment } from "react/jsx-runtime";
import { PassThrough } from "node:stream";
import { createReadableStreamFromReadable } from "@react-router/node";
import { ServerRouter, UNSAFE_withComponentProps, Outlet, UNSAFE_withErrorBoundaryProps, isRouteErrorResponse, Meta, Links, ScrollRestoration, Scripts, useLocation, useNavigate } from "react-router";
import { isbot } from "isbot";
import { renderToPipeableStream } from "react-dom/server";
import { useState, useEffect, useRef } from "react";
const streamTimeout = 5e3;
function handleRequest(request, responseStatusCode, responseHeaders, routerContext, loadContext) {
  return new Promise((resolve, reject) => {
    let shellRendered = false;
    let userAgent = request.headers.get("user-agent");
    let readyOption = userAgent && isbot(userAgent) || routerContext.isSpaMode ? "onAllReady" : "onShellReady";
    let timeoutId = setTimeout(
      () => abort(),
      streamTimeout + 1e3
    );
    const { pipe, abort } = renderToPipeableStream(
      /* @__PURE__ */ jsx(ServerRouter, { context: routerContext, url: request.url }),
      {
        [readyOption]() {
          shellRendered = true;
          const body = new PassThrough({
            final(callback) {
              clearTimeout(timeoutId);
              timeoutId = void 0;
              callback();
            }
          });
          const stream = createReadableStreamFromReadable(body);
          responseHeaders.set("Content-Type", "text/html");
          pipe(body);
          resolve(
            new Response(stream, {
              headers: responseHeaders,
              status: responseStatusCode
            })
          );
        },
        onShellError(error) {
          reject(error);
        },
        onError(error) {
          responseStatusCode = 500;
          if (shellRendered) {
            console.error(error);
          }
        }
      }
    );
  });
}
const entryServer = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  default: handleRequest,
  streamTimeout
}, Symbol.toStringTag, { value: "Module" }));
const en = {
  home: {
    title: "Giovani Drosda Lima - Full Stack Developer",
    description: "Full Stack Developer specializing in web applications, integrations, and business solutions. 8+ years of experience.",
    whoami: "Giovani Drosda Lima",
    readme: {
      title: "Giovani Drosda Lima",
      subtitle: "Full Stack Developer",
      experience: "years of experience building web applications",
      specialization: "Specialized in integrations, dashboards, and business solutions",
      location: "Based in Brazil 🇧🇷"
    },
    stats: {
      commits: "commits and counting...",
      processes: "WebApps integrations\nReact dashboards\nAPI development\nBusiness solutions"
    },
    navigation: {
      title: "Navigate through the directory structure above to explore:",
      hint: "ls -la ~/",
      about: "Personal background and journey",
      work: "Projects and professional experience",
      skills: "Technical expertise and tools",
      contact: "Get in touch"
    }
  },
  about: {
    title: "About - Giovani Drosda Lima",
    description: "Learn about Giovani's journey as a Full Stack Developer, from starting in 2017 to specializing in web applications and business solutions.",
    personal: {
      title: "About Me",
      intro: "Hey! I'm Giovani, a passionate Full Stack Developer from Brazil.",
      journey: "My Journey",
      specialization: "Started coding in 2017 and fell in love with the web platform's potential:\n- Runs anywhere with internet access\n- Instant deployment and updates\n- Universal accessibility\n\nI've specialized in building web applications that solve real business problems,\nfocusing on integrations, dashboards, and solutions that help businesses grow."
    },
    philosophy: {
      title: "Why Web Development?",
      content: "The web is the most democratic platform ever created. With just a browser\nand internet connection, anyone can access powerful applications that were\nonce limited to expensive desktop software.",
      beliefs: [
        "Building solutions that actually matter",
        "Clean, maintainable code",
        "User-first design thinking",
        "Continuous learning and adaptation"
      ]
    },
    currentFocus: {
      title: "Current Focus Areas:",
      areas: [
        "Modern React applications with TypeScript",
        "API integrations and microservices",
        "Business intelligence dashboards",
        "Performance optimization and scalability"
      ]
    },
    quickStats: {
      title: "Quick Stats:",
      coding: "Coding since: 2017",
      location: "Location: Brazil",
      focus: "Focus: Web Applications & Integrations",
      goal: "Goal: Building solutions that make a difference"
    }
  },
  work: {
    title: "Work & Projects - Giovani Drosda Lima",
    description: "Explore Giovani's professional work, projects, and contributions in web development, integrations, and business solutions.",
    experience: {
      title: "Professional Experience",
      role: "Full Stack Developer (2017 - Present)",
      bullets: [
        "Specialized in React, Node.js, and modern web technologies",
        "Built 50+ web applications for various industries",
        "Developed integration solutions for business automation",
        "Created dashboards for data visualization and analytics"
      ],
      achievements: {
        title: "Key Achievements:",
        items: [
          "Reduced manual processes by 80% through custom integrations",
          "Built scalable applications serving 10k+ daily active users",
          "Implemented CI/CD pipelines improving deployment efficiency by 60%",
          "Led technical decisions for multiple high-impact projects"
        ]
      }
    },
    projects: {
      realEstate: {
        title: "Real Estate Platform",
        stack: "Stack: React, Node.js, PostgreSQL, AWS",
        description: "A comprehensive platform for real estate management featuring:",
        features: [
          "Property listings with advanced search",
          "CRM for lead management",
          "Integration with multiple property sources",
          "Automated reporting and analytics",
          "Mobile-responsive design"
        ],
        impact: "Impact: 300% increase in lead conversion rates"
      }
    },
    integrations: {
      title: "Integration Expertise:",
      items: [
        "Payment Gateways (Stripe, PayPal, PagSeguro)",
        "CRM Systems (HubSpot, Salesforce, Pipedrive)",
        "E-commerce Platforms (Shopify, WooCommerce)",
        "Communication APIs (WhatsApp, Email, SMS)",
        "Business Intelligence Tools",
        "Custom API development and consumption"
      ]
    },
    technologies: {
      title: "Featured Technologies:",
      frontend: "React, TypeScript, Next.js\nTailwind CSS, Material-UI",
      backend: "Node.js, Python, PostgreSQL\nREST APIs, GraphQL",
      tools: "Docker, AWS, Vercel\nGit, CI/CD Pipelines",
      integrations: "Payment Gateways\nCRM & Business Tools"
    }
  },
  skills: {
    title: "Skills & Expertise - Giovani Drosda Lima",
    description: "Technical skills and expertise of Giovani Drosda Lima: React, TypeScript, Node.js, integrations, and full-stack development.",
    commands: {
      which: "which skills",
      cat: "cat /usr/local/bin/fullstack-developer",
      npm: "npm list --global | head -20",
      docker: "docker images | grep 'tools'",
      systemctl: "systemctl status integrations.service",
      ps: "ps aux | grep 'soft-skills'"
    },
    categories: {
      languages: "Core Languages",
      frontend: "frontend-frameworks/",
      backend: "backend-frameworks/",
      tools: "tools/",
      integrations: "API Integration Specialist",
      softSkills: [
        "problem-solving --priority=high",
        "communication --language=en,pt",
        "team-collaboration --remote=true",
        "continuous-learning --autodidact=true",
        "client-focused --business-first=true"
      ]
    },
    learning: {
      title: "Currently Learning:",
      items: [
        "📚 Advanced React patterns and performance optimization",
        "🔬 AI/ML integration in web applications",
        "🏗️ Microservices architecture with Docker",
        "📊 Advanced data visualization techniques"
      ]
    },
    legend: "Legend: ████████████ Expert | ███████▒▒▒▒▒ Advanced | ██████▒▒▒▒▒▒ Intermediate | ███▒▒▒▒▒▒▒▒▒ Beginner"
  },
  contact: {
    title: "Contact - Giovani Drosda Lima",
    description: "Get in touch with Giovani Drosda Lima. Available for freelance projects, consultations, and full-stack development opportunities.",
    availability: {
      title: "Current Availability: Open 🟢",
      status: "Status: Available for new projects",
      looking: [
        "Full-stack development projects",
        "API integrations and automation",
        "Business dashboard development",
        "Technical consulting",
        "Long-term partnerships"
      ],
      timezone: "Timezone: America/Sao_Paulo (GMT-3)",
      response: "Response time: Usually within 24 hours"
    },
    channels: {
      whatsapp: {
        title: "WhatsApp",
        description: "Quick response • Direct message"
      },
      email: {
        title: "Email",
        description: "Professional • Detailed discussions"
      },
      github: {
        title: "GitHub",
        description: "Code samples • Open source"
      },
      linkedin: {
        title: "LinkedIn",
        description: "Professional network • Career"
      }
    },
    inquiry: {
      title: "When reaching out, please include:",
      include: [
        "Brief description of your project",
        "Timeline and budget range (if applicable)",
        "Preferred communication method",
        "Any specific technologies required"
      ],
      response: [
        "Project feasibility assessment",
        "Estimated timeline and approach",
        "Next steps for collaboration"
      ]
    },
    promise: {
      title: "Quick Response Promise:",
      whatsapp: "🚀 WhatsApp: Usually within 2-4 hours",
      email: "📧 Email: Within 24 hours",
      linkedin: "💼 LinkedIn: Within 48 hours",
      github: "🐙 GitHub: For technical discussions"
    }
  },
  navigation: {
    readme: "README.md",
    about: "about/",
    work: "work/",
    skills: "skills/",
    contact: "contact/"
  },
  common: {
    languages: {
      en: "English",
      pt: "Português",
      fr: "Français"
    },
    expert: "Expert",
    advanced: "Advanced",
    intermediate: "Intermediate",
    beginner: "Beginner"
  },
  terminal: {
    commands: {
      help: "Show available commands",
      about: "Go to about page",
      work: "Go to work page",
      skills: "Go to skills page",
      contact: "Go to contact page",
      weather: "Get weather for a city (weather [city])",
      time: "Show current time",
      giofetch: "Show system information",
      clear: "Clear command history",
      pwd: "Show current directory",
      whoami: "Show current user",
      echo: "Display text (echo [text])",
      date: "Show current date",
      fortune: "Get a random developer quote",
      theme: "Change terminal theme (theme [theme-name])"
    },
    outputs: {
      navigatingTo: "Navigating to {0} page...",
      fetchingWeather: "Fetching weather for {0}...",
      weatherUsage: "Usage: weather [city]\nExample: weather london",
      weatherError: "Error: Could not fetch weather for {0}",
      commandNotFound: "Command not found: {0}\nType 'help' for available commands.",
      typeHelp: "Type 'help' for available commands.",
      availableCommands: "Available commands:",
      tryCommands: "💡 Try typing commands like: help, giofetch, weather london, time"
    }
  }
};
const pt = {
  home: {
    title: "Giovani Drosda Lima - Desenvolvedor Full Stack",
    description: "Desenvolvedor Full Stack especializado em aplicações web, integrações e soluções de negócio. 8+ anos de experiência.",
    whoami: "Giovani Drosda Lima",
    readme: {
      title: "Giovani Drosda Lima",
      subtitle: "Desenvolvedor Full Stack",
      experience: "anos de experiência construindo aplicações web",
      specialization: "Especializado em integrações, dashboards e soluções de negócio",
      location: "Baseado no Brasil 🇧🇷"
    },
    stats: {
      commits: "commits e contando...",
      processes: "WebApps integrações\nDashboards React\nDesenvolvimento de APIs\nSoluções de negócio"
    },
    navigation: {
      title: "Navegue pela estrutura de diretórios acima para explorar:",
      hint: "ls -la ~/",
      about: "Histórico pessoal e jornada",
      work: "Projetos e experiência profissional",
      skills: "Expertise técnica e ferramentas",
      contact: "Entre em contato"
    }
  },
  about: {
    title: "Sobre - Giovani Drosda Lima",
    description: "Conheça a jornada do Giovani como Desenvolvedor Full Stack, desde o início em 2017 até a especialização em aplicações web e soluções de negócio.",
    personal: {
      title: "Sobre Mim",
      intro: "Olá! Sou o Giovani, um Desenvolvedor Full Stack apaixonado do Brasil.",
      journey: "Minha Jornada",
      specialization: "Comecei a programar em 2017 e me apaixonei pelo potencial da plataforma web:\n- Funciona em qualquer lugar com acesso à internet\n- Deploy e atualizações instantâneas\n- Acessibilidade universal\n\nMe especializei em construir aplicações web que resolvem problemas reais de negócio,\nfocando em integrações, dashboards e soluções que ajudam empresas a crescer."
    },
    philosophy: {
      title: "Por que Desenvolvimento Web?",
      content: "A web é a plataforma mais democrática já criada. Com apenas um navegador\ne conexão à internet, qualquer pessoa pode acessar aplicações poderosas que antes\neram limitadas a software desktop caro.",
      beliefs: [
        "Construir soluções que realmente importam",
        "Código limpo e maintível",
        "Pensamento focado no usuário",
        "Aprendizado e adaptação contínuos"
      ]
    },
    currentFocus: {
      title: "Áreas de Foco Atuais:",
      areas: [
        "Aplicações React modernas com TypeScript",
        "Integrações de API e microserviços",
        "Dashboards de business intelligence",
        "Otimização de performance e escalabilidade"
      ]
    },
    quickStats: {
      title: "Estatísticas Rápidas:",
      coding: "Programando desde: 2017",
      location: "Localização: Brasil",
      focus: "Foco: Aplicações Web & Integrações",
      goal: "Objetivo: Construir soluções que fazem diferença"
    }
  },
  work: {
    title: "Trabalho & Projetos - Giovani Drosda Lima",
    description: "Explore o trabalho profissional, projetos e contribuições do Giovani em desenvolvimento web, integrações e soluções de negócio.",
    experience: {
      title: "Experiência Profissional",
      role: "Desenvolvedor Full Stack (2017 - Presente)",
      bullets: [
        "Especializado em React, Node.js e tecnologias web modernas",
        "Construí 50+ aplicações web para várias indústrias",
        "Desenvolvi soluções de integração para automação de negócios",
        "Criei dashboards para visualização de dados e analytics"
      ],
      achievements: {
        title: "Principais Conquistas:",
        items: [
          "Reduzi processos manuais em 80% através de integrações customizadas",
          "Construí aplicações escaláveis servindo 10k+ usuários ativos diários",
          "Implementei pipelines CI/CD melhorando eficiência de deploy em 60%",
          "Liderei decisões técnicas para múltiplos projetos de alto impacto"
        ]
      }
    },
    projects: {
      realEstate: {
        title: "Plataforma Imobiliária",
        stack: "Stack: React, Node.js, PostgreSQL, AWS",
        description: "Uma plataforma abrangente para gestão imobiliária com:",
        features: [
          "Listagens de propriedades com busca avançada",
          "CRM para gestão de leads",
          "Integração com múltiplas fontes de propriedades",
          "Relatórios automatizados e analytics",
          "Design responsivo mobile"
        ],
        impact: "Impacto: 300% de aumento nas taxas de conversão de leads"
      }
    },
    integrations: {
      title: "Expertise em Integrações:",
      items: [
        "Gateways de Pagamento (Stripe, PayPal, PagSeguro)",
        "Sistemas CRM (HubSpot, Salesforce, Pipedrive)",
        "Plataformas E-commerce (Shopify, WooCommerce)",
        "APIs de Comunicação (WhatsApp, Email, SMS)",
        "Ferramentas de Business Intelligence",
        "Desenvolvimento e consumo de APIs customizadas"
      ]
    },
    technologies: {
      title: "Tecnologias em Destaque:",
      frontend: "React, TypeScript, Next.js\nTailwind CSS, Material-UI",
      backend: "Node.js, Python, PostgreSQL\nREST APIs, GraphQL",
      tools: "Docker, AWS, Vercel\nGit, Pipelines CI/CD",
      integrations: "Gateways de Pagamento\nCRM & Ferramentas de Negócio"
    }
  },
  skills: {
    title: "Habilidades & Expertise - Giovani Drosda Lima",
    description: "Habilidades técnicas e expertise do Giovani Drosda Lima: React, TypeScript, Node.js, integrações e desenvolvimento full-stack.",
    commands: {
      which: "which skills",
      cat: "cat /usr/local/bin/fullstack-developer",
      npm: "npm list --global | head -20",
      docker: "docker images | grep 'tools'",
      systemctl: "systemctl status integrations.service",
      ps: "ps aux | grep 'soft-skills'"
    },
    categories: {
      languages: "Linguagens Principais",
      frontend: "frontend-frameworks/",
      backend: "backend-frameworks/",
      tools: "tools/",
      integrations: "Especialista em Integração de APIs",
      softSkills: [
        "resolução-problemas --prioridade=alta",
        "comunicação --idioma=pt,en",
        "colaboração-equipe --remoto=true",
        "aprendizado-continuo --autodidata=true",
        "foco-cliente --negócio-primeiro=true"
      ]
    },
    learning: {
      title: "Atualmente Aprendendo:",
      items: [
        "📚 Padrões React avançados e otimização de performance",
        "🔬 Integração IA/ML em aplicações web",
        "🏗️ Arquitetura de microserviços com Docker",
        "📊 Técnicas avançadas de visualização de dados"
      ]
    },
    legend: "Legenda: ████████████ Expert | ███████▒▒▒▒▒ Avançado | ██████▒▒▒▒▒▒ Intermediário | ███▒▒▒▒▒▒▒▒▒ Iniciante"
  },
  contact: {
    title: "Contato - Giovani Drosda Lima",
    description: "Entre em contato com Giovani Drosda Lima. Disponível para projetos freelance, consultoria e oportunidades de desenvolvimento full-stack.",
    availability: {
      title: "Disponibilidade Atual: Aberto 🟢",
      status: "Status: Disponível para novos projetos",
      looking: [
        "Projetos de desenvolvimento full-stack",
        "Integrações de API e automação",
        "Desenvolvimento de dashboards de negócio",
        "Consultoria técnica",
        "Parcerias de longo prazo"
      ],
      timezone: "Fuso horário: America/Sao_Paulo (GMT-3)",
      response: "Tempo de resposta: Geralmente em até 24 horas"
    },
    channels: {
      whatsapp: {
        title: "WhatsApp",
        description: "Resposta rápida • Mensagem direta"
      },
      email: {
        title: "E-mail",
        description: "Profissional • Discussões detalhadas"
      },
      github: {
        title: "GitHub",
        description: "Exemplos de código • Open source"
      },
      linkedin: {
        title: "LinkedIn",
        description: "Rede profissional • Carreira"
      }
    },
    inquiry: {
      title: "Ao entrar em contato, por favor inclua:",
      include: [
        "Breve descrição do seu projeto",
        "Cronograma e faixa de orçamento (se aplicável)",
        "Método de comunicação preferido",
        "Quaisquer tecnologias específicas necessárias"
      ],
      response: [
        "Avaliação de viabilidade do projeto",
        "Cronograma estimado e abordagem",
        "Próximos passos para colaboração"
      ]
    },
    promise: {
      title: "Promessa de Resposta Rápida:",
      whatsapp: "🚀 WhatsApp: Geralmente em 2-4 horas",
      email: "📧 E-mail: Em até 24 horas",
      linkedin: "💼 LinkedIn: Em até 48 horas",
      github: "🐙 GitHub: Para discussões técnicas"
    }
  },
  navigation: {
    readme: "README.md",
    about: "sobre/",
    work: "trabalho/",
    skills: "habilidades/",
    contact: "contato/"
  },
  common: {
    languages: {
      en: "English",
      pt: "Português",
      fr: "Français"
    },
    expert: "Expert",
    advanced: "Avançado",
    intermediate: "Intermediário",
    beginner: "Iniciante"
  },
  terminal: {
    commands: {
      help: "Mostrar comandos disponíveis",
      about: "Ir para página sobre",
      work: "Ir para página trabalho",
      skills: "Ir para página habilidades",
      contact: "Ir para página contato",
      weather: "Obter clima de uma cidade (weather [cidade])",
      time: "Mostrar hora atual",
      giofetch: "Mostrar informações do sistema",
      clear: "Limpar histórico de comandos",
      pwd: "Mostrar diretório atual",
      whoami: "Mostrar usuário atual",
      echo: "Exibir texto (echo [texto])",
      date: "Mostrar data atual",
      fortune: "Obter uma frase aleatória de desenvolvedor",
      theme: "Mudar tema do terminal (theme [nome-do-tema])"
    },
    outputs: {
      navigatingTo: "Navegando para página {0}...",
      fetchingWeather: "Buscando clima para {0}...",
      weatherUsage: "Uso: weather [cidade]\nExemplo: weather london",
      weatherError: "Erro: Não foi possível obter clima para {0}",
      commandNotFound: "Comando não encontrado: {0}\nDigite 'help' para comandos disponíveis.",
      typeHelp: "Digite 'help' para comandos disponíveis.",
      availableCommands: "Comandos disponíveis:",
      tryCommands: "💡 Experimente comandos como: help, giofetch, weather london, time"
    }
  }
};
const fr = {
  home: {
    title: "Giovani Drosda Lima - Développeur Full Stack",
    description: "Développeur Full Stack spécialisé dans les applications web, intégrations et solutions d'affaires. 8+ années d'expérience.",
    whoami: "Giovani Drosda Lima",
    readme: {
      title: "Giovani Drosda Lima",
      subtitle: "Développeur Full Stack",
      experience: "années d'expérience dans le développement d'applications web",
      specialization: "Spécialisé en intégrations, tableaux de bord et solutions d'affaires",
      location: "Basé au Brésil 🇧🇷"
    },
    stats: {
      commits: "commits et plus...",
      processes: "Intégrations WebApps\nTableaux de bord React\nDéveloppement d'API\nSolutions d'affaires"
    },
    navigation: {
      title: "Naviguez dans la structure de répertoires ci-dessus pour explorer :",
      hint: "ls -la ~/",
      about: "Parcours personnel et professionnel",
      work: "Projets et expérience professionnelle",
      skills: "Expertise technique et outils",
      contact: "Entrer en contact"
    }
  },
  about: {
    title: "À propos - Giovani Drosda Lima",
    description: "Découvrez le parcours de Giovani en tant que Développeur Full Stack, depuis ses débuts en 2017 jusqu'à sa spécialisation dans les applications web et solutions d'affaires.",
    personal: {
      title: "À propos de moi",
      intro: "Salut ! Je suis Giovani, un Développeur Full Stack passionné du Brésil.",
      journey: "Mon Parcours",
      specialization: "J'ai commencé à programmer en 2017 et suis tombé amoureux du potentiel de la plateforme web :\n- Fonctionne partout avec un accès Internet\n- Déploiement et mises à jour instantanés\n- Accessibilité universelle\n\nJe me suis spécialisé dans la création d'applications web qui résolvent de vrais problèmes d'affaires,\nen me concentrant sur les intégrations, tableaux de bord et solutions qui aident les entreprises à croître."
    },
    philosophy: {
      title: "Pourquoi le Développement Web ?",
      content: "Le web est la plateforme la plus démocratique jamais créée. Avec juste un navigateur\net une connexion Internet, n'importe qui peut accéder à des applications puissantes qui étaient\nautrefois limitées à des logiciels de bureau coûteux.",
      beliefs: [
        "Créer des solutions qui comptent vraiment",
        "Code propre et maintenable",
        "Pensée orientée utilisateur",
        "Apprentissage et adaptation continus"
      ]
    },
    currentFocus: {
      title: "Domaines de Focus Actuels :",
      areas: [
        "Applications React modernes avec TypeScript",
        "Intégrations d'API et microservices",
        "Tableaux de bord de business intelligence",
        "Optimisation de performance et évolutivité"
      ]
    },
    quickStats: {
      title: "Statistiques Rapides :",
      coding: "Programmation depuis : 2017",
      location: "Localisation : Brésil",
      focus: "Focus : Applications Web & Intégrations",
      goal: "Objectif : Créer des solutions qui font la différence"
    }
  },
  work: {
    title: "Travail & Projets - Giovani Drosda Lima",
    description: "Explorez le travail professionnel, projets et contributions de Giovani en développement web, intégrations et solutions d'affaires.",
    experience: {
      title: "Expérience Professionnelle",
      role: "Développeur Full Stack (2017 - Présent)",
      bullets: [
        "Spécialisé en React, Node.js et technologies web modernes",
        "Créé 50+ applications web pour diverses industries",
        "Développé des solutions d'intégration pour l'automatisation d'affaires",
        "Créé des tableaux de bord pour visualisation de données et analytics"
      ],
      achievements: {
        title: "Réalisations Clés :",
        items: [
          "Réduit les processus manuels de 80% grâce à des intégrations personnalisées",
          "Créé des applications évolutives servant 10k+ utilisateurs actifs quotidiens",
          "Implémenté des pipelines CI/CD améliorant l'efficacité de déploiement de 60%",
          "Dirigé les décisions techniques pour plusieurs projets à fort impact"
        ]
      }
    },
    projects: {
      realEstate: {
        title: "Plateforme Immobilière",
        stack: "Stack : React, Node.js, PostgreSQL, AWS",
        description: "Une plateforme complète pour la gestion immobilière avec :",
        features: [
          "Listes de propriétés avec recherche avancée",
          "CRM pour gestion des prospects",
          "Intégration avec multiples sources de propriétés",
          "Rapports automatisés et analytics",
          "Design réactif mobile"
        ],
        impact: "Impact : 300% d'augmentation des taux de conversion de prospects"
      }
    },
    integrations: {
      title: "Expertise en Intégrations :",
      items: [
        "Passerelles de Paiement (Stripe, PayPal, PagSeguro)",
        "Systèmes CRM (HubSpot, Salesforce, Pipedrive)",
        "Plateformes E-commerce (Shopify, WooCommerce)",
        "APIs de Communication (WhatsApp, Email, SMS)",
        "Outils de Business Intelligence",
        "Développement et consommation d'APIs personnalisées"
      ]
    },
    technologies: {
      title: "Technologies Vedettes :",
      frontend: "React, TypeScript, Next.js\nTailwind CSS, Material-UI",
      backend: "Node.js, Python, PostgreSQL\nREST APIs, GraphQL",
      tools: "Docker, AWS, Vercel\nGit, Pipelines CI/CD",
      integrations: "Passerelles de Paiement\nCRM & Outils d'Affaires"
    }
  },
  skills: {
    title: "Compétences & Expertise - Giovani Drosda Lima",
    description: "Compétences techniques et expertise de Giovani Drosda Lima : React, TypeScript, Node.js, intégrations et développement full-stack.",
    commands: {
      which: "which skills",
      cat: "cat /usr/local/bin/fullstack-developer",
      npm: "npm list --global | head -20",
      docker: "docker images | grep 'tools'",
      systemctl: "systemctl status integrations.service",
      ps: "ps aux | grep 'soft-skills'"
    },
    categories: {
      languages: "Langages Principaux",
      frontend: "frontend-frameworks/",
      backend: "backend-frameworks/",
      tools: "tools/",
      integrations: "Spécialiste en Intégration d'APIs",
      softSkills: [
        "résolution-problèmes --priorité=haute",
        "communication --langue=fr,pt,en",
        "collaboration-équipe --distant=true",
        "apprentissage-continu --autodidacte=true",
        "orienté-client --affaires-premier=true"
      ]
    },
    learning: {
      title: "Actuellement en Apprentissage :",
      items: [
        "📚 Modèles React avancés et optimisation de performance",
        "🔬 Intégration IA/ML dans applications web",
        "🏗️ Architecture microservices avec Docker",
        "📊 Techniques avancées de visualisation de données"
      ]
    },
    legend: "Légende : ████████████ Expert | ███████▒▒▒▒▒ Avancé | ██████▒▒▒▒▒▒ Intermédiaire | ███▒▒▒▒▒▒▒▒▒ Débutant"
  },
  contact: {
    title: "Contact - Giovani Drosda Lima",
    description: "Entrez en contact avec Giovani Drosda Lima. Disponible pour projets freelance, consultations et opportunités de développement full-stack.",
    availability: {
      title: "Disponibilité Actuelle : Ouvert 🟢",
      status: "Statut : Disponible pour nouveaux projets",
      looking: [
        "Projets de développement full-stack",
        "Intégrations d'API et automatisation",
        "Développement de tableaux de bord d'affaires",
        "Consultation technique",
        "Partenariats à long terme"
      ],
      timezone: "Fuseau horaire : America/Sao_Paulo (GMT-3)",
      response: "Temps de réponse : Généralement sous 24 heures"
    },
    channels: {
      whatsapp: {
        title: "WhatsApp",
        description: "Réponse rapide • Message direct"
      },
      email: {
        title: "Courriel",
        description: "Professionnel • Discussions détaillées"
      },
      github: {
        title: "GitHub",
        description: "Exemples de code • Open source"
      },
      linkedin: {
        title: "LinkedIn",
        description: "Réseau professionnel • Carrière"
      }
    },
    inquiry: {
      title: "Lors du contact, veuillez inclure :",
      include: [
        "Brève description de votre projet",
        "Calendrier et fourchette budgétaire (si applicable)",
        "Méthode de communication préférée",
        "Technologies spécifiques requises"
      ],
      response: [
        "Évaluation de faisabilité du projet",
        "Calendrier estimé et approche",
        "Prochaines étapes pour collaboration"
      ]
    },
    promise: {
      title: "Promesse de Réponse Rapide :",
      whatsapp: "🚀 WhatsApp : Généralement sous 2-4 heures",
      email: "📧 Courriel : Sous 24 heures",
      linkedin: "💼 LinkedIn : Sous 48 heures",
      github: "🐙 GitHub : Pour discussions techniques"
    }
  },
  navigation: {
    readme: "README.md",
    about: "à-propos/",
    work: "travail/",
    skills: "compétences/",
    contact: "contact/"
  },
  common: {
    languages: {
      en: "English",
      pt: "Português",
      fr: "Français"
    },
    expert: "Expert",
    advanced: "Avancé",
    intermediate: "Intermédiaire",
    beginner: "Débutant"
  },
  terminal: {
    commands: {
      help: "Afficher les commandes disponibles",
      about: "Aller à la page à propos",
      work: "Aller à la page travail",
      skills: "Aller à la page compétences",
      contact: "Aller à la page contact",
      weather: "Obtenir la météo d'une ville (weather [ville])",
      time: "Afficher l'heure actuelle",
      giofetch: "Afficher les informations système",
      clear: "Effacer l'historique des commandes",
      pwd: "Afficher le répertoire actuel",
      whoami: "Afficher l'utilisateur actuel",
      echo: "Afficher du texte (echo [texte])",
      date: "Afficher la date actuelle",
      fortune: "Obtenir une citation aléatoire de développeur",
      theme: "Changer le thème du terminal (theme [nom-du-thème])"
    },
    outputs: {
      navigatingTo: "Navigation vers la page {0}...",
      fetchingWeather: "Récupération de la météo pour {0}...",
      weatherUsage: "Usage : weather [ville]\nExemple : weather london",
      weatherError: "Erreur : Impossible d'obtenir la météo pour {0}",
      commandNotFound: "Commande non trouvée : {0}\nTapez 'help' pour les commandes disponibles.",
      typeHelp: "Tapez 'help' pour les commandes disponibles.",
      availableCommands: "Commandes disponibles :",
      tryCommands: "💡 Essayez des commandes comme : help, giofetch, weather london, time"
    }
  }
};
const translations = {
  en,
  pt,
  fr
};
const defaultLanguage = "en";
const supportedLanguages = ["en", "pt", "fr"];
function getTranslation(lang) {
  return translations[lang] || translations[defaultLanguage];
}
function detectLanguage(pathname) {
  const segments = pathname.split("/").filter(Boolean);
  const firstSegment = segments[0];
  if (firstSegment && supportedLanguages.includes(firstSegment)) {
    return firstSegment;
  }
  return defaultLanguage;
}
const pathTranslations = {
  en: {
    "/": "/",
    "/about": "/about",
    "/work": "/work",
    "/skills": "/skills",
    "/contact": "/contact"
  },
  pt: {
    "/": "/pt",
    "/about": "/pt/sobre",
    "/work": "/pt/trabalho",
    "/skills": "/pt/habilidades",
    "/contact": "/pt/contato"
  },
  fr: {
    "/": "/fr",
    "/about": "/fr/à-propos",
    "/work": "/fr/travail",
    "/skills": "/fr/compétences",
    "/contact": "/fr/contact"
  }
};
function getLocalizedPath(path, lang) {
  return pathTranslations[lang][path] || path;
}
function removeLanguagePrefix(pathname) {
  for (const [lang, paths] of Object.entries(pathTranslations)) {
    for (const [basePath, translatedPath] of Object.entries(paths)) {
      if (pathname === translatedPath) {
        return basePath;
      }
    }
  }
  return pathname;
}
const links = () => [{
  rel: "preconnect",
  href: "https://fonts.googleapis.com"
}, {
  rel: "preconnect",
  href: "https://fonts.gstatic.com",
  crossOrigin: "anonymous"
}, {
  rel: "stylesheet",
  href: "https://fonts.googleapis.com/css2?family=JetBrains+Mono:ital,wght@0,400;0,500;0,700;1,400&display=swap"
}];
function Layout({
  children
}) {
  const currentPath = typeof window !== "undefined" ? window.location.pathname : "/";
  const basePath = removeLanguagePrefix(currentPath);
  const currentLang = detectLanguage(currentPath);
  const langMap = {
    "en": "en-US",
    "pt": "pt-BR",
    "fr": "fr-CA"
  };
  return /* @__PURE__ */ jsxs("html", {
    lang: langMap[currentLang] || "en-US",
    children: [/* @__PURE__ */ jsxs("head", {
      children: [/* @__PURE__ */ jsx("meta", {
        charSet: "utf-8"
      }), /* @__PURE__ */ jsx("meta", {
        name: "viewport",
        content: "width=device-width, initial-scale=1"
      }), /* @__PURE__ */ jsx("meta", {
        name: "theme-color",
        content: "#0a0a0a"
      }), /* @__PURE__ */ jsx("meta", {
        name: "description",
        content: "Giovani Drosda Lima - Full Stack Developer specializing in web applications, integrations, and business solutions"
      }), /* @__PURE__ */ jsx("meta", {
        name: "author",
        content: "Giovani Drosda Lima"
      }), /* @__PURE__ */ jsx("meta", {
        property: "og:type",
        content: "website"
      }), /* @__PURE__ */ jsx("meta", {
        property: "og:site_name",
        content: "Giovani Drosda Lima - Developer Portfolio"
      }), /* @__PURE__ */ jsx("meta", {
        name: "twitter:card",
        content: "summary"
      }), /* @__PURE__ */ jsx("link", {
        rel: "canonical",
        href: `https://dlgiovani.github.io${getLocalizedPath(basePath, currentLang)}`
      }), supportedLanguages.map((lang) => /* @__PURE__ */ jsx("link", {
        rel: "alternate",
        hrefLang: langMap[lang],
        href: `https://dlgiovani.github.io${getLocalizedPath(basePath, lang)}`
      }, lang)), /* @__PURE__ */ jsx("link", {
        rel: "alternate",
        hrefLang: "x-default",
        href: `https://dlgiovani.github.io${getLocalizedPath(basePath, "en")}`
      }), /* @__PURE__ */ jsx("script", {
        type: "application/ld+json",
        dangerouslySetInnerHTML: {
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "Person",
            name: "Giovani Drosda Lima",
            jobTitle: "Full Stack Developer",
            url: "https://dlgiovani.github.io",
            sameAs: ["https://github.com/dlgiovani", "https://linkedin.com/in/giovani-drosda-lima"],
            knowsAbout: ["React", "TypeScript", "Node.js", "Full Stack Development"],
            address: {
              "@type": "PostalAddress",
              addressCountry: "BR"
            }
          })
        }
      }), /* @__PURE__ */ jsx(Meta, {}), /* @__PURE__ */ jsx(Links, {})]
    }), /* @__PURE__ */ jsxs("body", {
      className: "bg-[--color-terminal-bg] text-[--color-terminal-text]",
      children: [children, /* @__PURE__ */ jsx(ScrollRestoration, {}), /* @__PURE__ */ jsx(Scripts, {})]
    })]
  });
}
const root = UNSAFE_withComponentProps(function App() {
  return /* @__PURE__ */ jsx(Outlet, {});
});
const ErrorBoundary = UNSAFE_withErrorBoundaryProps(function ErrorBoundary2({
  error
}) {
  let message = "Oops!";
  let details = "An unexpected error occurred.";
  let stack;
  if (isRouteErrorResponse(error)) {
    message = error.status === 404 ? "404" : "Error";
    details = error.status === 404 ? "The requested page could not be found." : error.statusText || details;
  }
  return /* @__PURE__ */ jsxs("main", {
    className: "pt-16 p-4 container mx-auto",
    children: [/* @__PURE__ */ jsx("h1", {
      children: message
    }), /* @__PURE__ */ jsx("p", {
      children: details
    }), stack]
  });
});
const route0 = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  ErrorBoundary,
  Layout,
  default: root,
  links
}, Symbol.toStringTag, { value: "Module" }));
async function fetchWeatherData(city) {
  try {
    const response = await fetch(
      `https://wttr.in/${encodeURIComponent(city)}?format="%C+%t+%h+%w+%p+%P"`
    );
    if (!response.ok) {
      throw new Error("Weather API error");
    }
    const data = await response.text();
    const cleanData = data.replace(/"/g, "").trim();
    const parts = cleanData.split(" ");
    if (parts.length >= 5) {
      const [condition, temp, humidity, wind, pressure, precipitation] = parts;
      return `Weather in ${city}:
Condition: ${condition}
Temperature: ${temp}
Humidity: ${humidity}
Wind: ${wind}
Pressure: ${pressure}
Precipitation: ${precipitation || "N/A"}`;
    }
    return `Weather in ${city}: ${cleanData}`;
  } catch (error) {
    return `Weather data temporarily unavailable for ${city}.
Try: weather london, weather tokyo, weather "new york"

Alternative: weather uses wttr.in service which may be down.
The command is functional - try again later!`;
  }
}
function LanguageSwitcher() {
  const location = useLocation();
  const navigate = useNavigate();
  const [isOpen, setIsOpen] = useState(false);
  const currentLang = detectLanguage(location.pathname);
  const currentPath = removeLanguagePrefix(location.pathname);
  const t = getTranslation(currentLang);
  const handleLanguageChange = (lang) => {
    const newPath = getLocalizedPath(currentPath, lang);
    navigate(newPath);
    setIsOpen(false);
  };
  return /* @__PURE__ */ jsxs("div", { className: "relative", children: [
    /* @__PURE__ */ jsxs(
      "button",
      {
        onClick: () => setIsOpen(!isOpen),
        className: "flex items-center gap-2 px-3 py-1 border border-[--color-terminal-secondary] rounded hover:border-[--color-terminal-text] transition-colors focus:outline-none focus:ring-2 focus:ring-[--color-terminal-text] focus:ring-opacity-50",
        "aria-label": "Change language",
        "aria-expanded": isOpen,
        children: [
          /* @__PURE__ */ jsx("span", { className: "text-[--color-terminal-accent]", children: "🌐" }),
          /* @__PURE__ */ jsx("span", { className: "text-xs font-mono", children: t.common.languages[currentLang] }),
          /* @__PURE__ */ jsx(
            "span",
            {
              className: `text-[--color-terminal-secondary] transition-transform ${isOpen ? "rotate-180" : ""}`,
              children: "▼"
            }
          )
        ]
      }
    ),
    isOpen && /* @__PURE__ */ jsxs(Fragment, { children: [
      /* @__PURE__ */ jsx(
        "div",
        {
          className: "fixed inset-0 z-10",
          onClick: () => setIsOpen(false)
        }
      ),
      /* @__PURE__ */ jsx("div", { className: "absolute top-full right-0 mt-1 z-20 bg-[--color-terminal-bg] border border-[--color-terminal-secondary] rounded shadow-lg min-w-[140px]", children: supportedLanguages.map((lang) => /* @__PURE__ */ jsx(
        "button",
        {
          onClick: () => handleLanguageChange(lang),
          className: `w-full px-3 py-2 text-left text-xs font-mono hover:bg-[--color-terminal-text]/10 transition-colors first:rounded-t last:rounded-b ${currentLang === lang ? "text-[--color-terminal-text] bg-[--color-terminal-text]/5" : "text-[--color-terminal-secondary]"}`,
          disabled: currentLang === lang,
          children: /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-2", children: [
            /* @__PURE__ */ jsxs("span", { children: [
              lang === "en" && "🇺🇸",
              lang === "pt" && "🇧🇷",
              lang === "fr" && "🇨🇦"
            ] }),
            /* @__PURE__ */ jsx("span", { children: t.common.languages[lang] }),
            currentLang === lang && /* @__PURE__ */ jsx("span", { className: "ml-auto text-[--color-terminal-accent]", children: "✓" })
          ] })
        },
        lang
      )) })
    ] })
  ] });
}
const themes = {
  default: {
    name: "default",
    displayName: "Default Dark",
    isDark: true,
    colors: {
      bg: "#0a0a0a",
      text: "#e5e5e5",
      secondary: "#a3a3a3",
      accent: "#22d3ee",
      error: "#ef4444",
      cursor: "#22d3ee",
      link: "#60a5fa",
      linkHover: "#93c5fd",
      border: "#404040"
    }
  },
  catppuccin: {
    name: "catppuccin",
    displayName: "Catppuccin Mocha",
    isDark: true,
    colors: {
      bg: "#1e1e2e",
      text: "#cdd6f4",
      secondary: "#a6adc8",
      accent: "#89b4fa",
      error: "#f38ba8",
      cursor: "#f9e2af",
      link: "#74c7ec",
      linkHover: "#89b4fa",
      border: "#313244"
    }
  },
  dracula: {
    name: "dracula",
    displayName: "Dracula",
    isDark: true,
    colors: {
      bg: "#282a36",
      text: "#f8f8f2",
      secondary: "#6272a4",
      accent: "#8be9fd",
      error: "#ff5555",
      cursor: "#50fa7b",
      link: "#bd93f9",
      linkHover: "#ff79c6",
      border: "#44475a"
    }
  },
  gruvbox: {
    name: "gruvbox",
    displayName: "Gruvbox Dark",
    isDark: true,
    colors: {
      bg: "#282828",
      text: "#fbf1c7",
      secondary: "#bdae93",
      accent: "#fabd2f",
      error: "#fb4934",
      cursor: "#fe8019",
      link: "#83a598",
      linkHover: "#8ec07c",
      border: "#504945"
    }
  },
  nord: {
    name: "nord",
    displayName: "Nord",
    isDark: true,
    colors: {
      bg: "#2e3440",
      text: "#d8dee9",
      secondary: "#81a1c1",
      accent: "#88c0d0",
      error: "#bf616a",
      cursor: "#a3be8c",
      link: "#5e81ac",
      linkHover: "#81a1c1",
      border: "#4c566a"
    }
  },
  solarized: {
    name: "solarized",
    displayName: "Solarized Dark",
    isDark: true,
    colors: {
      bg: "#002b36",
      text: "#839496",
      secondary: "#586e75",
      accent: "#268bd2",
      error: "#dc322f",
      cursor: "#b58900",
      link: "#2aa198",
      linkHover: "#859900",
      border: "#073642"
    }
  },
  monokai: {
    name: "monokai",
    displayName: "Monokai",
    isDark: true,
    colors: {
      bg: "#272822",
      text: "#f8f8f2",
      secondary: "#75715e",
      accent: "#a6e22e",
      error: "#f92672",
      cursor: "#fd971f",
      link: "#66d9ef",
      linkHover: "#ae81ff",
      border: "#49483e"
    }
  },
  tokyo: {
    name: "tokyo",
    displayName: "Tokyo Night",
    isDark: true,
    colors: {
      bg: "#24283b",
      text: "#a9b1d6",
      secondary: "#9aa5ce",
      accent: "#7aa2f7",
      error: "#f7768e",
      cursor: "#bb9af7",
      link: "#2ac3de",
      linkHover: "#7dcfff",
      border: "#32344a"
    }
  },
  cyberpunk: {
    name: "cyberpunk",
    displayName: "Cyberpunk",
    isDark: true,
    colors: {
      bg: "#0d001a",
      text: "#00ff9f",
      secondary: "#ff0080",
      accent: "#ffff00",
      error: "#ff073a",
      cursor: "#00ff9f",
      link: "#ff0080",
      linkHover: "#ffff00",
      border: "#660066"
    }
  },
  matrix: {
    name: "matrix",
    displayName: "Matrix",
    isDark: true,
    colors: {
      bg: "#000000",
      text: "#00ff00",
      secondary: "#008000",
      accent: "#00ff00",
      error: "#ff0000",
      cursor: "#00ff00",
      link: "#00ff00",
      linkHover: "#ffffff",
      border: "#003300"
    }
  },
  light: {
    name: "light",
    displayName: "Light Terminal",
    isDark: false,
    colors: {
      bg: "#ffffff",
      text: "#2d3748",
      secondary: "#718096",
      accent: "#3182ce",
      error: "#e53e3e",
      cursor: "#3182ce",
      link: "#2b6cb0",
      linkHover: "#2c5282",
      border: "#e2e8f0"
    }
  },
  solarizedLight: {
    name: "solarizedLight",
    displayName: "Solarized Light",
    isDark: false,
    colors: {
      bg: "#fdf6e3",
      text: "#657b83",
      secondary: "#93a1a1",
      accent: "#268bd2",
      error: "#dc322f",
      cursor: "#b58900",
      link: "#2aa198",
      linkHover: "#859900",
      border: "#eee8d5"
    }
  }
};
const defaultTheme = themes.default;
function getTheme(name) {
  return themes[name] || defaultTheme;
}
function applyTheme(theme) {
  const root2 = document.documentElement;
  root2.style.setProperty("--color-terminal-bg", theme.colors.bg);
  root2.style.setProperty("--color-terminal-text", theme.colors.text);
  root2.style.setProperty("--color-terminal-secondary", theme.colors.secondary);
  root2.style.setProperty("--color-terminal-accent", theme.colors.accent);
  root2.style.setProperty("--color-terminal-error", theme.colors.error);
  root2.style.setProperty("--color-terminal-cursor", theme.colors.cursor);
  root2.style.setProperty("--color-terminal-link", theme.colors.link);
  root2.style.setProperty("--color-terminal-link-hover", theme.colors.linkHover);
  root2.style.setProperty("--color-terminal-border", theme.colors.border);
  document.documentElement.style.colorScheme = theme.isDark ? "dark" : "light";
  const themeColorMeta = document.querySelector('meta[name="theme-color"]');
  if (themeColorMeta) {
    themeColorMeta.setAttribute("content", theme.colors.bg);
  }
}
function getStoredTheme() {
  if (typeof window !== "undefined") {
    return localStorage.getItem("terminal-theme") || "default";
  }
  return "default";
}
function setStoredTheme(themeName) {
  if (typeof window !== "undefined") {
    localStorage.setItem("terminal-theme", themeName);
  }
}
function ThemeSwitcher() {
  const [currentTheme, setCurrentTheme] = useState("default");
  const [isOpen, setIsOpen] = useState(false);
  useEffect(() => {
    const storedTheme = getStoredTheme();
    setCurrentTheme(storedTheme);
    applyTheme(getTheme(storedTheme));
  }, []);
  const handleThemeChange = (themeName) => {
    setCurrentTheme(themeName);
    setStoredTheme(themeName);
    applyTheme(getTheme(themeName));
    setIsOpen(false);
  };
  const currentThemeObj = getTheme(currentTheme);
  return /* @__PURE__ */ jsxs("div", { className: "relative", children: [
    /* @__PURE__ */ jsx(
      "button",
      {
        onClick: () => setIsOpen(!isOpen),
        className: "text-[--color-terminal-secondary] hover:text-[--color-terminal-text] transition-colors text-xs focus:outline-none focus:ring-2 focus:ring-[--color-terminal-text] focus:ring-opacity-50 rounded px-2 py-1",
        "aria-label": "Switch terminal theme",
        "aria-expanded": isOpen,
        "aria-haspopup": "true",
        type: "button",
        children: /* @__PURE__ */ jsxs("span", { className: "flex items-center gap-1", children: [
          /* @__PURE__ */ jsx(
            "span",
            {
              className: "w-3 h-3 rounded border border-[--color-terminal-secondary]",
              style: { backgroundColor: currentThemeObj.colors.bg },
              "aria-hidden": "true"
            }
          ),
          /* @__PURE__ */ jsx("span", { className: "hidden sm:inline", children: currentThemeObj.displayName }),
          /* @__PURE__ */ jsx("span", { className: "sm:hidden", children: "Theme" }),
          /* @__PURE__ */ jsx("span", { className: `transition-transform ${isOpen ? "rotate-180" : ""}`, children: "▼" })
        ] })
      }
    ),
    isOpen && /* @__PURE__ */ jsx(
      "div",
      {
        className: "absolute top-full right-0 mt-1 bg-[--color-terminal-bg] border border-[--color-terminal-secondary] rounded shadow-lg z-50 min-w-48",
        role: "menu",
        "aria-label": "Theme selection menu",
        children: /* @__PURE__ */ jsx("div", { className: "py-1", children: Object.values(themes).map((theme) => /* @__PURE__ */ jsxs(
          "button",
          {
            onClick: () => handleThemeChange(theme.name),
            className: `w-full px-3 py-2 text-left text-xs hover:bg-[--color-terminal-text]/5 transition-colors flex items-center gap-2 ${currentTheme === theme.name ? "text-[--color-terminal-text] bg-[--color-terminal-text]/10" : "text-[--color-terminal-secondary]"}`,
            role: "menuitem",
            type: "button",
            children: [
              /* @__PURE__ */ jsx(
                "span",
                {
                  className: "w-4 h-4 rounded border border-[--color-terminal-secondary] flex-shrink-0",
                  style: { backgroundColor: theme.colors.bg },
                  "aria-hidden": "true"
                }
              ),
              /* @__PURE__ */ jsx("span", { className: "flex-1", children: theme.displayName }),
              currentTheme === theme.name && /* @__PURE__ */ jsx("span", { className: "text-[--color-terminal-accent]", "aria-label": "Current theme", children: "✓" })
            ]
          },
          theme.name
        )) })
      }
    ),
    isOpen && /* @__PURE__ */ jsx(
      "div",
      {
        className: "fixed inset-0 z-40",
        onClick: () => setIsOpen(false),
        "aria-hidden": "true"
      }
    )
  ] });
}
function InteractiveTerminal({ children }) {
  const navigate = useNavigate();
  const location = useLocation();
  const [currentPath, setCurrentPath] = useState("~");
  const [commandHistory, setCommandHistory] = useState([]);
  const [currentCommand, setCurrentCommand] = useState("");
  const [historyIndex, setHistoryIndex] = useState(-1);
  const [isDesktop, setIsDesktop] = useState(false);
  const inputRef = useRef(null);
  const currentLang = detectLanguage(location.pathname);
  const basePath = removeLanguagePrefix(location.pathname);
  const t = getTranslation(currentLang);
  useEffect(() => {
    const checkDesktop = () => {
      setIsDesktop(window.innerWidth >= 768);
    };
    checkDesktop();
    window.addEventListener("resize", checkDesktop);
    return () => window.removeEventListener("resize", checkDesktop);
  }, []);
  useEffect(() => {
    const pathMap = {
      "/": "~",
      "/about": "~/about",
      "/work": "~/work",
      "/skills": "~/skills",
      "/contact": "~/contact"
    };
    setCurrentPath(pathMap[basePath] || "~");
  }, [basePath]);
  useEffect(() => {
    if (isDesktop && inputRef.current) {
      inputRef.current.focus();
    }
  }, [isDesktop]);
  const executeCommand = async (cmd) => {
    const trimmedCmd = cmd.trim().toLowerCase();
    const parts = trimmedCmd.split(" ");
    const command = parts[0];
    const args = parts.slice(1);
    let output = "";
    switch (command) {
      case "help":
        output = `${t.terminal.outputs.availableCommands}:
${Object.entries(t.terminal.commands).map(([cmd2, desc]) => `  ${cmd2.padEnd(10)} - ${desc}`).join("\n")}`;
        break;
      case "about":
        navigate(getLocalizedPath("/about", currentLang));
        output = t.terminal.outputs.navigatingTo.replace("{0}", "about");
        break;
      case "work":
        navigate(getLocalizedPath("/work", currentLang));
        output = t.terminal.outputs.navigatingTo.replace("{0}", "work");
        break;
      case "skills":
        navigate(getLocalizedPath("/skills", currentLang));
        output = t.terminal.outputs.navigatingTo.replace("{0}", "skills");
        break;
      case "contact":
        navigate(getLocalizedPath("/contact", currentLang));
        output = t.terminal.outputs.navigatingTo.replace("{0}", "contact");
        break;
      case "weather":
        if (args.length === 0) {
          output = t.terminal.outputs.weatherUsage;
        } else {
          const city = args.join(" ");
          try {
            output = t.terminal.outputs.fetchingWeather.replace("{0}", city);
            const weather = await fetchWeatherData(city);
            output = weather;
          } catch (error) {
            output = t.terminal.outputs.weatherError.replace("{0}", city);
          }
        }
        break;
      case "time":
        const now = /* @__PURE__ */ new Date();
        output = `${now.toLocaleDateString()} ${now.toLocaleTimeString()}
Timezone: ${Intl.DateTimeFormat().resolvedOptions().timeZone}
UTC: ${now.toISOString()}`;
        break;
      case "giofetch":
        const yearExp = (/* @__PURE__ */ new Date()).getFullYear() - 2017;
        output = `                    ..                    
                 .PPPPP.                  giovani@portfolio
               .PP.   .PP.                ─────────────────
              .P'       'P.               OS: Web Platform
             .P'         'P.              Host: dlgiovani.github.io  
            .P'           'P.             Kernel: React Router v7
           .P'             'P.            Uptime: ${yearExp} years
          .P'               'P.           Packages: TypeScript, Tailwind
         .P'                 'P.          Shell: Interactive Terminal
        .PPPPPPPPPPPPPPPPPPPPP.           Resolution: Responsive
       .P'                   'P.          Terminal: JetBrains Mono
      .P'                     'P.         CPU: Full Stack Developer
     .P'                       'P.        Memory: 8+ years experience
    .P'                         'P.       Disk: React, Node.js, APIs
   .PPPPPPPPPPPPPPPPPPPPPPPPPPPPP.        Location: Brazil 🇧🇷
                                          Languages: EN, PT, FR`;
        break;
      case "pwd":
        output = currentPath === "~" ? "/home/giovani" : `/home/giovani${currentPath.slice(1)}`;
        break;
      case "whoami":
        output = "giovani";
        break;
      case "echo":
        output = args.length > 0 ? args.join(" ") : "";
        break;
      case "date":
        const dateNow = /* @__PURE__ */ new Date();
        output = dateNow.toLocaleDateString("en-US", {
          weekday: "long",
          year: "numeric",
          month: "long",
          day: "numeric"
        });
        break;
      case "fortune":
        const quotes = [
          "The best error message is the one that never shows up. - Thomas Fuchs",
          "Code is like humor. When you have to explain it, it's bad. - Cory House",
          "First, solve the problem. Then, write the code. - John Johnson",
          "Experience is the name everyone gives to their mistakes. - Oscar Wilde",
          "In order to be irreplaceable, one must always be different. - Coco Chanel",
          "Java is to JavaScript what car is to Carpet. - Chris Heilmann",
          "Knowledge is power. - France is bacon",
          "Sometimes it pays to stay in bed on Monday, rather than spending the rest of the week debugging Monday's code. - Dan Salomon",
          "Perfection is achieved not when there is nothing more to add, but rather when there is nothing more to take away. - Antoine de Saint-Exupery",
          "Code never lies, comments sometimes do. - Ron Jeffries",
          "Simplicity is the ultimate sophistication. - Leonardo da Vinci",
          "Make it work, make it right, make it fast. - Kent Beck",
          "The computer was born to solve problems that did not exist before. - Bill Gates"
        ];
        const randomQuote = quotes[Math.floor(Math.random() * quotes.length)];
        output = randomQuote;
        break;
      case "theme":
        if (args.length === 0) {
          const themeList = Object.values(themes).map((t2) => `  ${t2.name.padEnd(12)} - ${t2.displayName}`).join("\n");
          output = `Available themes:
${themeList}

Usage: theme [theme-name]
Example: theme catppuccin`;
        } else {
          const themeName = args[0];
          if (themes[themeName]) {
            applyTheme(getTheme(themeName));
            setStoredTheme(themeName);
            output = `Theme changed to: ${themes[themeName].displayName}`;
          } else {
            output = `Theme '${themeName}' not found. Type 'theme' to see available themes.`;
          }
        }
        break;
      case "clear":
        setCommandHistory([]);
        return;
      case "":
        return;
      default:
        output = t.terminal.outputs.commandNotFound.replace("{0}", command);
    }
    const newEntry = {
      command: cmd,
      output,
      timestamp: /* @__PURE__ */ new Date()
    };
    setCommandHistory((prev) => [...prev, newEntry]);
  };
  const handleKeyDown = (e) => {
    if (e.key === "Enter") {
      executeCommand(currentCommand);
      setCurrentCommand("");
      setHistoryIndex(-1);
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      const commands = commandHistory.map((h) => h.command);
      if (commands.length > 0) {
        const newIndex = historyIndex === -1 ? commands.length - 1 : Math.max(0, historyIndex - 1);
        setHistoryIndex(newIndex);
        setCurrentCommand(commands[newIndex]);
      }
    } else if (e.key === "ArrowDown") {
      e.preventDefault();
      const commands = commandHistory.map((h) => h.command);
      if (historyIndex !== -1) {
        const newIndex = historyIndex < commands.length - 1 ? historyIndex + 1 : -1;
        setHistoryIndex(newIndex);
        setCurrentCommand(newIndex === -1 ? "" : commands[newIndex]);
      }
    }
  };
  return /* @__PURE__ */ jsxs(
    "div",
    {
      className: "min-h-screen bg-[--color-terminal-bg] text-[--color-terminal-text] p-4 font-mono",
      role: "main",
      "aria-label": "Interactive terminal portfolio",
      children: [
        /* @__PURE__ */ jsxs("header", { className: "mb-6 border-b border-[--color-terminal-secondary] pb-4", children: [
          /* @__PURE__ */ jsxs("div", { className: "flex items-center justify-between mb-2", children: [
            /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-2", children: [
              /* @__PURE__ */ jsxs("div", { className: "flex gap-1", role: "presentation", "aria-label": "Terminal window controls", children: [
                /* @__PURE__ */ jsx("div", { className: "w-3 h-3 rounded-full bg-[--color-terminal-error]", "aria-label": "Close" }),
                /* @__PURE__ */ jsx("div", { className: "w-3 h-3 rounded-full bg-[--color-terminal-accent]", "aria-label": "Minimize" }),
                /* @__PURE__ */ jsx("div", { className: "w-3 h-3 rounded-full bg-[--color-terminal-text]", "aria-label": "Maximize" })
              ] }),
              /* @__PURE__ */ jsxs("span", { className: "text-[--color-terminal-secondary] text-xs", role: "status", children: [
                "giovani@portfolio: ",
                currentPath
              ] })
            ] }),
            /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-3", children: [
              /* @__PURE__ */ jsx(ThemeSwitcher, {}),
              /* @__PURE__ */ jsx(LanguageSwitcher, {})
            ] })
          ] }),
          /* @__PURE__ */ jsxs("nav", { className: "space-y-1", role: "navigation", "aria-label": "Site navigation", children: [
            /* @__PURE__ */ jsx("div", { className: "terminal-prompt", "aria-hidden": "true", children: /* @__PURE__ */ jsx("span", { children: "ls -la" }) }),
            /* @__PURE__ */ jsxs("ul", { className: "ml-2 space-y-1 text-[--color-terminal-secondary] list-none", children: [
              /* @__PURE__ */ jsx(TerminalNavItem, { href: getLocalizedPath("/", currentLang), label: t.navigation.readme, current: basePath === "/" }),
              /* @__PURE__ */ jsx(TerminalNavItem, { href: getLocalizedPath("/about", currentLang), label: t.navigation.about, current: basePath === "/about" }),
              /* @__PURE__ */ jsx(TerminalNavItem, { href: getLocalizedPath("/work", currentLang), label: t.navigation.work, current: basePath === "/work" }),
              /* @__PURE__ */ jsx(TerminalNavItem, { href: getLocalizedPath("/skills", currentLang), label: t.navigation.skills, current: basePath === "/skills" }),
              /* @__PURE__ */ jsx(TerminalNavItem, { href: getLocalizedPath("/contact", currentLang), label: t.navigation.contact, current: basePath === "/contact" })
            ] })
          ] })
        ] }),
        isDesktop && /* @__PURE__ */ jsxs(
          "section",
          {
            className: "mb-6 space-y-2",
            "aria-label": "Terminal command interface",
            children: [
              /* @__PURE__ */ jsx(
                "div",
                {
                  className: "command-history",
                  role: "log",
                  "aria-label": "Command history",
                  "aria-live": "polite",
                  children: commandHistory.map((entry2, index) => /* @__PURE__ */ jsxs("div", { className: "mb-2", children: [
                    /* @__PURE__ */ jsx("div", { className: "terminal-prompt", "aria-label": `Command: ${entry2.command}`, children: /* @__PURE__ */ jsx("span", { children: entry2.command }) }),
                    /* @__PURE__ */ jsx(
                      "div",
                      {
                        className: "ml-2 text-[--color-terminal-secondary] whitespace-pre-line",
                        role: "status",
                        "aria-label": "Command output",
                        children: entry2.output
                      }
                    )
                  ] }, index))
                }
              ),
              /* @__PURE__ */ jsx("div", { className: "terminal-prompt", children: /* @__PURE__ */ jsx(
                "input",
                {
                  ref: inputRef,
                  type: "text",
                  value: currentCommand,
                  onChange: (e) => setCurrentCommand(e.target.value),
                  onKeyDown: handleKeyDown,
                  className: "terminal-command-input",
                  placeholder: t.terminal.outputs.typeHelp,
                  autoComplete: "off",
                  spellCheck: false,
                  "aria-label": "Terminal command input",
                  "aria-describedby": "command-help",
                  role: "textbox"
                }
              ) })
            ]
          }
        ),
        /* @__PURE__ */ jsx("main", { className: "max-w-4xl", role: "main", "aria-label": "Portfolio content", children: typeof children === "function" ? children({ t }) : children }),
        /* @__PURE__ */ jsxs(
          "footer",
          {
            className: "mt-16 pt-4 border-t border-[--color-terminal-secondary] text-[--color-terminal-secondary] text-xs",
            role: "contentinfo",
            "aria-label": "Site footer",
            children: [
              /* @__PURE__ */ jsx("div", { className: "terminal-prompt", "aria-hidden": "true", children: /* @__PURE__ */ jsx("span", { children: 'echo "© 2025 Giovani Drosda Lima"' }) }),
              /* @__PURE__ */ jsx("div", { className: "ml-2", children: "© 2025 Giovani Drosda Lima" }),
              isDesktop && /* @__PURE__ */ jsx(
                "div",
                {
                  className: "ml-2 mt-2 text-[--color-terminal-secondary] opacity-60",
                  id: "command-help",
                  "aria-label": "Terminal usage tip",
                  children: t.terminal.outputs.tryCommands
                }
              )
            ]
          }
        )
      ]
    }
  );
}
function TerminalNavItem({ href, label, current }) {
  return /* @__PURE__ */ jsxs("li", { className: `terminal-tree ${current ? "text-[--color-terminal-text] font-bold" : "text-[--color-terminal-secondary]"}`, children: [
    /* @__PURE__ */ jsx(
      "a",
      {
        href,
        className: `terminal-link hover:text-[--color-terminal-text] transition-colors focus:outline-none focus:ring-2 focus:ring-[--color-terminal-text] focus:ring-opacity-50 rounded ${current ? "text-[--color-terminal-text]" : ""}`,
        "aria-current": current ? "page" : void 0,
        children: label
      }
    ),
    current && /* @__PURE__ */ jsx("span", { className: "terminal-cursor ml-1", "aria-hidden": "true" })
  ] });
}
function TypingText({
  text,
  speed = 50,
  delay = 0,
  showCursor = true,
  className = ""
}) {
  const [displayedText, setDisplayedText] = useState("");
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isTyping, setIsTyping] = useState(false);
  const timeoutRef = useRef(null);
  useEffect(() => {
    timeoutRef.current = setTimeout(() => {
      setIsTyping(true);
    }, delay);
    return () => {
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
    };
  }, [delay]);
  useEffect(() => {
    if (!isTyping) return;
    if (currentIndex < text.length) {
      timeoutRef.current = setTimeout(() => {
        setDisplayedText(text.substring(0, currentIndex + 1));
        setCurrentIndex(currentIndex + 1);
      }, speed);
      return () => {
        if (timeoutRef.current) clearTimeout(timeoutRef.current);
      };
    }
  }, [currentIndex, text, speed, isTyping]);
  return /* @__PURE__ */ jsxs(
    "span",
    {
      className,
      role: "text",
      "aria-label": currentIndex >= text.length ? text : "Loading content",
      children: [
        displayedText,
        showCursor && (isTyping && currentIndex < text.length) && /* @__PURE__ */ jsx("span", { className: "terminal-cursor", "aria-hidden": "true" })
      ]
    }
  );
}
function CommandOutput({ command, output, delay = 0, className = "" }) {
  return /* @__PURE__ */ jsxs(
    "div",
    {
      className: `space-y-2 ${className}`,
      role: "group",
      "aria-label": `Terminal command: ${command}`,
      children: [
        /* @__PURE__ */ jsx("div", { className: "terminal-prompt", role: "text", "aria-label": `Executing command: ${command}`, children: /* @__PURE__ */ jsx(TypingText, { text: command, delay }) }),
        /* @__PURE__ */ jsx(
          "div",
          {
            className: "ml-2 text-[--color-terminal-secondary]",
            role: "status",
            "aria-label": "Command output",
            "aria-live": "polite",
            children: /* @__PURE__ */ jsx(
              TypingText,
              {
                text: output,
                delay: delay + command.length * 50 + 500,
                showCursor: false
              }
            )
          }
        )
      ]
    }
  );
}
function meta$4({
  location
}) {
  const lang = detectLanguage(location.pathname);
  const t = getTranslation(lang);
  return [{
    title: t.home.title
  }, {
    name: "description",
    content: t.home.description
  }, {
    property: "og:title",
    content: t.home.title
  }, {
    property: "og:description",
    content: t.home.description
  }, {
    property: "og:url",
    content: "https://dlgiovani.github.io"
  }, {
    property: "og:locale",
    content: lang === "en" ? "en_US" : lang === "pt" ? "pt_BR" : "fr_CA"
  }];
}
const home = UNSAFE_withComponentProps(function Home() {
  const currentYear = (/* @__PURE__ */ new Date()).getFullYear();
  const yearsOfExperience = currentYear - 2017;
  return /* @__PURE__ */ jsx(InteractiveTerminal, {
    children: ({
      t
    }) => /* @__PURE__ */ jsxs("div", {
      className: "space-y-8",
      children: [/* @__PURE__ */ jsxs("div", {
        className: "space-y-4",
        children: [/* @__PURE__ */ jsx(CommandOutput, {
          command: "whoami",
          output: t.home.whoami,
          delay: 0
        }), /* @__PURE__ */ jsx(CommandOutput, {
          command: "cat README.md",
          output: `# ${t.home.readme.title}

## ${t.home.readme.subtitle}

> ${yearsOfExperience} ${t.home.readme.experience}
> ${t.home.readme.specialization}
> ${t.home.readme.location}`,
          delay: 2e3
        })]
      }), /* @__PURE__ */ jsxs("div", {
        className: "space-y-4",
        children: [/* @__PURE__ */ jsx(CommandOutput, {
          command: "git log --oneline --since='2017' --author='Giovani' | wc -l",
          output: `${Math.floor(yearsOfExperience * 365 * 0.7)} ${t.home.stats.commits}`,
          delay: 5e3
        }), /* @__PURE__ */ jsx(CommandOutput, {
          command: "ps aux | grep 'currently_working_on'",
          output: t.home.stats.processes,
          delay: 7e3
        })]
      }), /* @__PURE__ */ jsxs("div", {
        className: "mt-12 p-4 border border-[--color-terminal-secondary] rounded",
        children: [/* @__PURE__ */ jsx("div", {
          className: "terminal-prompt mb-2",
          children: /* @__PURE__ */ jsx("span", {
            children: t.home.navigation.hint
          })
        }), /* @__PURE__ */ jsxs("div", {
          className: "ml-2 text-[--color-terminal-secondary] space-y-1",
          children: [/* @__PURE__ */ jsx("div", {
            children: t.home.navigation.title
          }), /* @__PURE__ */ jsxs("div", {
            className: "ml-4 space-y-1",
            children: [/* @__PURE__ */ jsxs("div", {
              children: ["• ", /* @__PURE__ */ jsx("span", {
                className: "text-[--color-terminal-text]",
                children: t.navigation.about
              }), " - ", t.home.navigation.about]
            }), /* @__PURE__ */ jsxs("div", {
              children: ["• ", /* @__PURE__ */ jsx("span", {
                className: "text-[--color-terminal-text]",
                children: t.navigation.work
              }), " - ", t.home.navigation.work]
            }), /* @__PURE__ */ jsxs("div", {
              children: ["• ", /* @__PURE__ */ jsx("span", {
                className: "text-[--color-terminal-text]",
                children: t.navigation.skills
              }), " - ", t.home.navigation.skills]
            }), /* @__PURE__ */ jsxs("div", {
              children: ["• ", /* @__PURE__ */ jsx("span", {
                className: "text-[--color-terminal-text]",
                children: t.navigation.contact
              }), " - ", t.home.navigation.contact]
            })]
          })]
        })]
      })]
    })
  });
});
const route1 = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  default: home,
  meta: meta$4
}, Symbol.toStringTag, { value: "Module" }));
function meta$3({
  location
}) {
  const lang = detectLanguage(location.pathname);
  const t = getTranslation(lang);
  return [{
    title: t.about.title
  }, {
    name: "description",
    content: t.about.description
  }, {
    property: "og:title",
    content: t.about.title
  }, {
    property: "og:description",
    content: t.about.description
  }, {
    property: "og:locale",
    content: lang === "en" ? "en_US" : lang === "pt" ? "pt_BR" : "fr_CA"
  }];
}
const about = UNSAFE_withComponentProps(function About() {
  return /* @__PURE__ */ jsx(InteractiveTerminal, {
    children: ({
      t
    }) => /* @__PURE__ */ jsxs("div", {
      className: "space-y-8",
      children: [/* @__PURE__ */ jsx(CommandOutput, {
        command: "cd ~/about && cat personal.md",
        output: `# ${t.about.personal.title}

${t.about.personal.intro}

## ${t.about.personal.journey}

${t.about.personal.specialization}`,
        delay: 0
      }), /* @__PURE__ */ jsx(CommandOutput, {
        command: "cat philosophy.txt",
        output: `${t.about.philosophy.title}

${t.about.philosophy.content}

${t.about.philosophy.beliefs.map((belief) => `• ${belief}`).join("\n")}`,
        delay: 3e3
      }), /* @__PURE__ */ jsx(CommandOutput, {
        command: "cat current-focus.log",
        output: `${t.about.currentFocus.title}

${t.about.currentFocus.areas.map((area, i) => `[2024-2025] ${area}`).join("\n")}

Always exploring new technologies while maintaining production reliability.`,
        delay: 6e3
      }), /* @__PURE__ */ jsxs("div", {
        className: "mt-12 p-4 border border-[--color-terminal-secondary] rounded",
        children: [/* @__PURE__ */ jsx("div", {
          className: "text-[--color-terminal-accent]",
          children: t.about.quickStats.title
        }), /* @__PURE__ */ jsxs("div", {
          className: "ml-4 text-[--color-terminal-secondary] space-y-1 mt-2",
          children: [/* @__PURE__ */ jsxs("div", {
            children: ["📅 ", t.about.quickStats.coding]
          }), /* @__PURE__ */ jsxs("div", {
            children: ["🌍 ", t.about.quickStats.location]
          }), /* @__PURE__ */ jsxs("div", {
            children: ["💼 ", t.about.quickStats.focus]
          }), /* @__PURE__ */ jsxs("div", {
            children: ["🎯 ", t.about.quickStats.goal]
          })]
        })]
      })]
    })
  });
});
const route2 = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  default: about,
  meta: meta$3
}, Symbol.toStringTag, { value: "Module" }));
function meta$2({
  location
}) {
  const currentLang = detectLanguage(location.pathname);
  const t = getTranslation(currentLang);
  return [{
    title: t.work.title
  }, {
    name: "description",
    content: t.work.description
  }, {
    property: "og:title",
    content: t.work.title
  }, {
    property: "og:description",
    content: t.work.description
  }];
}
const work = UNSAFE_withComponentProps(function Work() {
  return /* @__PURE__ */ jsx(InteractiveTerminal, {
    children: ({
      t
    }) => /* @__PURE__ */ jsxs("div", {
      className: "space-y-8",
      children: [/* @__PURE__ */ jsx(CommandOutput, {
        command: "ls -la ~/work/",
        output: `total 42
drwxr-xr-x  5 giovani staff   160 Jan  1 12:00 .
drwxr-xr-x  8 giovani staff   256 Jan  1 12:00 ..
-rw-r--r--  1 giovani staff  2048 Jan  1 12:00 experience.md
drwxr-xr-x  4 giovani staff   128 Jan  1 12:00 projects/
drwxr-xr-x  3 giovani staff    96 Jan  1 12:00 integrations/`,
        delay: 0
      }), /* @__PURE__ */ jsx(CommandOutput, {
        command: "cat experience.md",
        output: `# ${t.work.experience.title}

## ${t.work.experience.role}
${t.work.experience.bullets.map((bullet) => `• ${bullet}`).join("\n")}

## ${t.work.experience.achievements.title}
${t.work.experience.achievements.items.map((item) => `• ${item}`).join("\n")}`,
        delay: 2e3
      }), /* @__PURE__ */ jsx(CommandOutput, {
        command: "ls projects/",
        output: `real-estate-platform/
business-dashboard/
inventory-management/
payment-integrations/
analytics-suite/`,
        delay: 5e3
      }), /* @__PURE__ */ jsx(CommandOutput, {
        command: "head -n 20 projects/real-estate-platform/README.md",
        output: `# ${t.work.projects.realEstate.title}
${t.work.projects.realEstate.stack}

${t.work.projects.realEstate.description}
${t.work.projects.realEstate.features.map((feature) => `• ${feature}`).join("\n")}

${t.work.projects.realEstate.impact}`,
        delay: 7e3
      }), /* @__PURE__ */ jsx(CommandOutput, {
        command: "cat integrations/overview.txt",
        output: `${t.work.integrations.title}

${t.work.integrations.items.map((item) => `• ${item}`).join("\n")}`,
        delay: 1e4
      }), /* @__PURE__ */ jsxs("div", {
        className: "mt-12 p-4 border border-[--color-terminal-secondary] rounded",
        children: [/* @__PURE__ */ jsx("div", {
          className: "text-[--color-terminal-accent]",
          children: t.work.technologies.title
        }), /* @__PURE__ */ jsxs("div", {
          className: "ml-4 text-[--color-terminal-secondary] grid grid-cols-2 gap-4 mt-2",
          children: [/* @__PURE__ */ jsxs("div", {
            children: [/* @__PURE__ */ jsx("div", {
              className: "text-[--color-terminal-text]",
              children: "Frontend:"
            }), /* @__PURE__ */ jsx("div", {
              className: "whitespace-pre-line",
              children: t.work.technologies.frontend
            })]
          }), /* @__PURE__ */ jsxs("div", {
            children: [/* @__PURE__ */ jsx("div", {
              className: "text-[--color-terminal-text]",
              children: "Backend:"
            }), /* @__PURE__ */ jsx("div", {
              className: "whitespace-pre-line",
              children: t.work.technologies.backend
            })]
          }), /* @__PURE__ */ jsxs("div", {
            children: [/* @__PURE__ */ jsx("div", {
              className: "text-[--color-terminal-text]",
              children: "Tools:"
            }), /* @__PURE__ */ jsx("div", {
              className: "whitespace-pre-line",
              children: t.work.technologies.tools
            })]
          }), /* @__PURE__ */ jsxs("div", {
            children: [/* @__PURE__ */ jsx("div", {
              className: "text-[--color-terminal-text]",
              children: "Integrations:"
            }), /* @__PURE__ */ jsx("div", {
              className: "whitespace-pre-line",
              children: t.work.technologies.integrations
            })]
          })]
        })]
      })]
    })
  });
});
const route3 = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  default: work,
  meta: meta$2
}, Symbol.toStringTag, { value: "Module" }));
function meta$1({
  location
}) {
  const currentLang = detectLanguage(location.pathname);
  const t = getTranslation(currentLang);
  return [{
    title: t.skills.title
  }, {
    name: "description",
    content: t.skills.description
  }, {
    property: "og:title",
    content: t.skills.title
  }, {
    property: "og:description",
    content: t.skills.description
  }];
}
const skills = UNSAFE_withComponentProps(function Skills() {
  return /* @__PURE__ */ jsx(InteractiveTerminal, {
    children: ({
      t
    }) => /* @__PURE__ */ jsxs("div", {
      className: "space-y-8",
      children: [/* @__PURE__ */ jsx(CommandOutput, {
        command: t.skills.commands.which,
        output: "/usr/local/bin/fullstack-developer",
        delay: 0
      }), /* @__PURE__ */ jsx(CommandOutput, {
        command: t.skills.commands.cat,
        output: `#!/bin/bash
# Full Stack Developer Skills v8.0

# ${t.skills.categories.languages}
javascript --version    # ████████████ ${t.common.expert}
typescript --version    # ███████████▒ ${t.common.advanced}  
python --version        # ████████▒▒▒▒ ${t.common.intermediate}
html5 --version         # ████████████ ${t.common.expert}
css3 --version          # ███████████▒ ${t.common.advanced}`,
        delay: 1e3
      }), /* @__PURE__ */ jsx(CommandOutput, {
        command: t.skills.commands.npm,
        output: `${t.skills.categories.frontend}
├── react@19.0.0          # ████████████ ${t.common.expert}
├── next.js@15.0.0        # ███████████▒ ${t.common.advanced}
├── vue@3.0.0             # ██████▒▒▒▒▒▒ ${t.common.beginner}
└── tailwindcss@4.0.0     # ████████████ ${t.common.expert}

${t.skills.categories.backend}
├── node.js@22.0.0        # ███████████▒ ${t.common.advanced}
├── express@5.0.0         # ███████████▒ ${t.common.advanced}  
├── fastapi@0.110.0       # ████████▒▒▒▒ ${t.common.intermediate}
└── postgresql@16.0.0     # ██████████▒▒ ${t.common.advanced}`,
        delay: 3e3
      }), /* @__PURE__ */ jsx(CommandOutput, {
        command: t.skills.commands.docker,
        output: `${t.skills.categories.tools}
tools/git                latest    ████████████ ${t.common.expert}
tools/docker             latest    ████████▒▒▒▒ ${t.common.intermediate}
tools/aws                latest    ███████▒▒▒▒▒ ${t.common.intermediate}
tools/vercel             latest    ███████████▒ ${t.common.advanced}
tools/figma              latest    ██████▒▒▒▒▒▒ ${t.common.beginner}`,
        delay: 5e3
      }), /* @__PURE__ */ jsx(CommandOutput, {
        command: t.skills.commands.systemctl,
        output: `● integrations.service - ${t.skills.categories.integrations}
   Loaded: loaded (/etc/systemd/system/integrations.service; enabled)
   Active: active (running) since 2017-01-01 00:00:00 UTC; 8y ago
   
   Specialties:
   ✓ Payment Gateways (Stripe, PayPal, PagSeguro)
   ✓ CRM Systems (HubSpot, Salesforce, Pipedrive) 
   ✓ Communication APIs (WhatsApp Business, Email)
   ✓ E-commerce Platforms (Shopify, WooCommerce)
   ✓ Business Intelligence & Analytics
   ✓ Custom REST/GraphQL API development`,
        delay: 7e3
      }), /* @__PURE__ */ jsx(CommandOutput, {
        command: t.skills.commands.ps,
        output: `giovani  1001  0.5  1.2  ${t.skills.categories.softSkills[0]}
giovani  1002  0.3  0.8  ${t.skills.categories.softSkills[1]}
giovani  1003  0.2  0.6  ${t.skills.categories.softSkills[2]}
giovani  1004  0.4  1.0  ${t.skills.categories.softSkills[3]}
giovani  1005  0.1  0.4  ${t.skills.categories.softSkills[4]}`,
        delay: 9e3
      }), /* @__PURE__ */ jsxs("div", {
        className: "mt-12 space-y-6",
        children: [/* @__PURE__ */ jsxs("div", {
          className: "p-4 border border-[--color-terminal-secondary] rounded",
          children: [/* @__PURE__ */ jsx("div", {
            className: "text-[--color-terminal-accent] mb-2",
            children: "Skill Progression:"
          }), /* @__PURE__ */ jsx("div", {
            className: "text-[--color-terminal-secondary] space-y-1 text-xs",
            children: /* @__PURE__ */ jsx("div", {
              children: t.skills.legend
            })
          })]
        }), /* @__PURE__ */ jsxs("div", {
          className: "p-4 border border-[--color-terminal-secondary] rounded",
          children: [/* @__PURE__ */ jsx("div", {
            className: "text-[--color-terminal-accent] mb-2",
            children: t.skills.learning.title
          }), /* @__PURE__ */ jsx("div", {
            className: "ml-4 text-[--color-terminal-secondary] space-y-1",
            children: t.skills.learning.items.map((item) => /* @__PURE__ */ jsx("div", {
              children: item
            }, item))
          })]
        })]
      })]
    })
  });
});
const route4 = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  default: skills,
  meta: meta$1
}, Symbol.toStringTag, { value: "Module" }));
function meta({
  location
}) {
  const currentLang = detectLanguage(location.pathname);
  const t = getTranslation(currentLang);
  return [{
    title: t.contact.title
  }, {
    name: "description",
    content: t.contact.description
  }, {
    property: "og:title",
    content: t.contact.title
  }, {
    property: "og:description",
    content: t.contact.description
  }];
}
const contact = UNSAFE_withComponentProps(function Contact() {
  const handleContactClick = (type) => {
    const urls = {
      whatsapp: "https://api.whatsapp.com/send/?phone=5541984486463&text=Hi%20Giovani!%20I%20found%20your%20portfolio%20and%20would%20like%20to%20connect.&utm_source=portfolio",
      email: "mailto:contatogiovanidl@gmail.com?subject=Portfolio%20Contact&body=Hi%20Giovani,%0A%0AI%20found%20your%20portfolio%20and%20would%20like%20to%20connect.%0A%0A&utm_source=portfolio",
      github: "https://github.com/dlgiovani?utm_source=portfolio",
      linkedin: "https://www.linkedin.com/in/giovani-drosda-lima/?utm_source=portfolio"
    };
    window.open(urls[type], "_blank");
  };
  return /* @__PURE__ */ jsx(InteractiveTerminal, {
    children: ({
      t
    }) => /* @__PURE__ */ jsxs("div", {
      className: "space-y-8",
      children: [/* @__PURE__ */ jsx(CommandOutput, {
        command: "whoami && echo 'Status: Available for new projects'",
        output: `giovani
${t.contact.availability.status}`,
        delay: 0
      }), /* @__PURE__ */ jsx(CommandOutput, {
        command: "cat ~/contact/availability.txt",
        output: `# ${t.contact.availability.title}

Looking for:
${t.contact.availability.looking.map((item) => `• ${item}`).join("\n")}

${t.contact.availability.timezone}
${t.contact.availability.response}`,
        delay: 2e3
      }), /* @__PURE__ */ jsxs("div", {
        className: "mt-8 space-y-2",
        children: [/* @__PURE__ */ jsx("div", {
          className: "terminal-prompt",
          children: /* @__PURE__ */ jsx("span", {
            children: "cat ~/contact/quick-links.txt"
          })
        }), /* @__PURE__ */ jsxs("div", {
          className: "ml-2 text-[--color-terminal-secondary] space-y-1",
          children: [/* @__PURE__ */ jsx("div", {
            children: "Quick Contact Links:"
          }), /* @__PURE__ */ jsxs("div", {
            className: "space-y-1 mt-2",
            children: [/* @__PURE__ */ jsxs("div", {
              children: [/* @__PURE__ */ jsx("span", {
                className: "text-[--color-terminal-accent]",
                children: "📱 WhatsApp:"
              }), " ", /* @__PURE__ */ jsx("a", {
                href: "https://api.whatsapp.com/send/?phone=5541984486463&text=Hi%20Giovani!%20I%20found%20your%20portfolio%20and%20would%20like%20to%20connect.&utm_source=portfolio",
                target: "_blank",
                rel: "noopener noreferrer",
                className: "terminal-link hover:text-[--color-terminal-text] transition-colors underline focus:outline-none focus:ring-2 focus:ring-[--color-terminal-text] focus:ring-opacity-50 rounded",
                "aria-label": "Contact via WhatsApp",
                children: "+55 41 9 8448-6463"
              })]
            }), /* @__PURE__ */ jsxs("div", {
              children: [/* @__PURE__ */ jsx("span", {
                className: "text-[--color-terminal-accent]",
                children: "📧 Email:"
              }), " ", /* @__PURE__ */ jsx("a", {
                href: "mailto:contatogiovanidl@gmail.com?subject=Portfolio%20Contact&body=Hi%20Giovani,%0A%0AI%20found%20your%20portfolio%20and%20would%20like%20to%20connect.%0A%0A&utm_source=portfolio",
                className: "terminal-link hover:text-[--color-terminal-text] transition-colors underline focus:outline-none focus:ring-2 focus:ring-[--color-terminal-text] focus:ring-opacity-50 rounded",
                "aria-label": "Send email",
                children: "contatogiovanidl@gmail.com"
              })]
            }), /* @__PURE__ */ jsxs("div", {
              children: [/* @__PURE__ */ jsx("span", {
                className: "text-[--color-terminal-accent]",
                children: "🐙 GitHub:"
              }), " ", /* @__PURE__ */ jsx("a", {
                href: "https://github.com/dlgiovani?utm_source=portfolio",
                target: "_blank",
                rel: "noopener noreferrer",
                className: "terminal-link hover:text-[--color-terminal-text] transition-colors underline focus:outline-none focus:ring-2 focus:ring-[--color-terminal-text] focus:ring-opacity-50 rounded",
                "aria-label": "Visit GitHub profile",
                children: "github.com/dlgiovani"
              })]
            }), /* @__PURE__ */ jsxs("div", {
              children: [/* @__PURE__ */ jsx("span", {
                className: "text-[--color-terminal-accent]",
                children: "💼 LinkedIn:"
              }), " ", /* @__PURE__ */ jsx("a", {
                href: "https://www.linkedin.com/in/giovani-drosda-lima/?utm_source=portfolio",
                target: "_blank",
                rel: "noopener noreferrer",
                className: "terminal-link hover:text-[--color-terminal-text] transition-colors underline focus:outline-none focus:ring-2 focus:ring-[--color-terminal-text] focus:ring-opacity-50 rounded",
                "aria-label": "Visit LinkedIn profile",
                children: "linkedin.com/in/giovani-drosda-lima"
              })]
            })]
          })]
        })]
      }), /* @__PURE__ */ jsx(CommandOutput, {
        command: "ls ~/contact/channels/",
        output: `whatsapp.link
email.addr
github.url  
linkedin.url`,
        delay: 4e3
      }), /* @__PURE__ */ jsx("div", {
        className: "space-y-4 mt-8",
        children: /* @__PURE__ */ jsxs("div", {
          className: "grid grid-cols-1 md:grid-cols-2 gap-4",
          children: [/* @__PURE__ */ jsxs("button", {
            onClick: () => handleContactClick("whatsapp"),
            className: "p-4 border border-[--color-terminal-secondary] rounded hover:border-[--color-terminal-text] hover:bg-[--color-terminal-text]/5 transition-all text-left group",
            "aria-label": "Contact via WhatsApp",
            type: "button",
            children: [/* @__PURE__ */ jsx("div", {
              className: "terminal-prompt mb-2",
              children: /* @__PURE__ */ jsx("span", {
                children: "cat whatsapp.link"
              })
            }), /* @__PURE__ */ jsxs("div", {
              className: "ml-2 text-[--color-terminal-secondary] group-hover:text-[--color-terminal-text]",
              children: [/* @__PURE__ */ jsxs("div", {
                className: "text-[--color-terminal-accent]",
                children: ["📱 ", t.contact.channels.whatsapp.title]
              }), /* @__PURE__ */ jsx("div", {
                className: "text-xs",
                children: t.contact.channels.whatsapp.description
              }), /* @__PURE__ */ jsx("div", {
                className: "text-xs mt-1",
                children: "+55 41 9 8448-6463"
              })]
            })]
          }), /* @__PURE__ */ jsxs("button", {
            onClick: () => handleContactClick("email"),
            className: "p-4 border border-[--color-terminal-secondary] rounded hover:border-[--color-terminal-text] hover:bg-[--color-terminal-text]/5 transition-all text-left group",
            "aria-label": "Send email",
            type: "button",
            children: [/* @__PURE__ */ jsx("div", {
              className: "terminal-prompt mb-2",
              children: /* @__PURE__ */ jsx("span", {
                children: "cat email.addr"
              })
            }), /* @__PURE__ */ jsxs("div", {
              className: "ml-2 text-[--color-terminal-secondary] group-hover:text-[--color-terminal-text]",
              children: [/* @__PURE__ */ jsxs("div", {
                className: "text-[--color-terminal-accent]",
                children: ["📧 ", t.contact.channels.email.title]
              }), /* @__PURE__ */ jsx("div", {
                className: "text-xs",
                children: t.contact.channels.email.description
              }), /* @__PURE__ */ jsx("div", {
                className: "text-xs mt-1",
                children: "contatogiovanidl@gmail.com"
              })]
            })]
          }), /* @__PURE__ */ jsxs("button", {
            onClick: () => handleContactClick("github"),
            className: "p-4 border border-[--color-terminal-secondary] rounded hover:border-[--color-terminal-text] hover:bg-[--color-terminal-text]/5 transition-all text-left group",
            "aria-label": "Visit GitHub profile",
            type: "button",
            children: [/* @__PURE__ */ jsx("div", {
              className: "terminal-prompt mb-2",
              children: /* @__PURE__ */ jsx("span", {
                children: "cat github.url"
              })
            }), /* @__PURE__ */ jsxs("div", {
              className: "ml-2 text-[--color-terminal-secondary] group-hover:text-[--color-terminal-text]",
              children: [/* @__PURE__ */ jsxs("div", {
                className: "text-[--color-terminal-accent]",
                children: ["🐙 ", t.contact.channels.github.title]
              }), /* @__PURE__ */ jsx("div", {
                className: "text-xs",
                children: t.contact.channels.github.description
              }), /* @__PURE__ */ jsx("div", {
                className: "text-xs mt-1",
                children: "github.com/dlgiovani"
              })]
            })]
          }), /* @__PURE__ */ jsxs("button", {
            onClick: () => handleContactClick("linkedin"),
            className: "p-4 border border-[--color-terminal-secondary] rounded hover:border-[--color-terminal-text] hover:bg-[--color-terminal-text]/5 transition-all text-left group",
            "aria-label": "Visit LinkedIn profile",
            type: "button",
            children: [/* @__PURE__ */ jsx("div", {
              className: "terminal-prompt mb-2",
              children: /* @__PURE__ */ jsx("span", {
                children: "cat linkedin.url"
              })
            }), /* @__PURE__ */ jsxs("div", {
              className: "ml-2 text-[--color-terminal-secondary] group-hover:text-[--color-terminal-text]",
              children: [/* @__PURE__ */ jsxs("div", {
                className: "text-[--color-terminal-accent]",
                children: ["💼 ", t.contact.channels.linkedin.title]
              }), /* @__PURE__ */ jsx("div", {
                className: "text-xs",
                children: t.contact.channels.linkedin.description
              }), /* @__PURE__ */ jsx("div", {
                className: "text-xs mt-1",
                children: "linkedin.com/in/giovani-drosda-lima"
              })]
            })]
          })]
        })
      }), /* @__PURE__ */ jsx(CommandOutput, {
        command: "cat project-inquiry.template",
        output: `${t.contact.inquiry.title}

${t.contact.inquiry.include.map((item) => `• ${item}`).join("\n")}

I'll respond with:
${t.contact.inquiry.response.map((item) => `• ${item}`).join("\n")}`,
        delay: 6e3
      }), /* @__PURE__ */ jsxs("div", {
        className: "mt-12 p-4 border border-[--color-terminal-secondary] rounded",
        children: [/* @__PURE__ */ jsx("div", {
          className: "text-[--color-terminal-accent] mb-2",
          children: t.contact.promise.title
        }), /* @__PURE__ */ jsxs("div", {
          className: "text-[--color-terminal-secondary] space-y-1",
          children: [/* @__PURE__ */ jsx("div", {
            children: t.contact.promise.whatsapp
          }), /* @__PURE__ */ jsx("div", {
            children: t.contact.promise.email
          }), /* @__PURE__ */ jsx("div", {
            children: t.contact.promise.linkedin
          }), /* @__PURE__ */ jsx("div", {
            children: t.contact.promise.github
          })]
        })]
      })]
    })
  });
});
const route5 = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  default: contact,
  meta
}, Symbol.toStringTag, { value: "Module" }));
const route6 = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  default: home,
  meta: meta$4
}, Symbol.toStringTag, { value: "Module" }));
const route7 = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  default: about,
  meta: meta$3
}, Symbol.toStringTag, { value: "Module" }));
const route8 = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  default: work,
  meta: meta$2
}, Symbol.toStringTag, { value: "Module" }));
const route9 = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  default: skills,
  meta: meta$1
}, Symbol.toStringTag, { value: "Module" }));
const route10 = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  default: contact,
  meta
}, Symbol.toStringTag, { value: "Module" }));
const route11 = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  default: home,
  meta: meta$4
}, Symbol.toStringTag, { value: "Module" }));
const route12 = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  default: about,
  meta: meta$3
}, Symbol.toStringTag, { value: "Module" }));
const route13 = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  default: work,
  meta: meta$2
}, Symbol.toStringTag, { value: "Module" }));
const route14 = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  default: skills,
  meta: meta$1
}, Symbol.toStringTag, { value: "Module" }));
const route15 = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  default: contact,
  meta
}, Symbol.toStringTag, { value: "Module" }));
async function loader({}) {
  const portfolioData = {
    "@context": "https://schema.org",
    "@type": "Person",
    "name": "Giovani Drosda Lima",
    "jobTitle": "Full Stack Developer",
    "description": "Full Stack Developer specializing in web applications, integrations, and business solutions with 8+ years of experience.",
    "url": "https://dlgiovani.github.io",
    "sameAs": ["https://github.com/dlgiovani", "https://linkedin.com/in/giovani-drosda-lima"],
    "address": {
      "@type": "PostalAddress",
      "addressCountry": "BR"
    },
    "knowsAbout": ["React", "TypeScript", "Node.js", "Full Stack Development", "API Integration", "Business Solutions", "Web Applications", "JavaScript", "Python", "PostgreSQL"],
    "hasOccupation": {
      "@type": "Occupation",
      "name": "Full Stack Developer",
      "occupationLocation": {
        "@type": "Country",
        "name": "Brazil"
      },
      "skills": ["React Development", "TypeScript", "Node.js", "API Integration", "Database Design", "Business Solutions"]
    },
    "contactPoint": {
      "@type": "ContactPoint",
      "telephone": "+5541984486463",
      "contactType": "professional",
      "email": "contatogiovanidl@gmail.com"
    },
    "experience": {
      "yearsActive": "2017-present",
      "projectsCompleted": "50+",
      "specialization": "Web Applications and Business Integrations"
    },
    "availability": {
      "status": "available",
      "timezone": "America/Sao_Paulo",
      "responseTime": "within 24 hours"
    }
  };
  return Response.json(portfolioData, {
    headers: {
      "Content-Type": "application/ld+json",
      "Cache-Control": "public, max-age=3600"
    }
  });
}
const route16 = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  loader
}, Symbol.toStringTag, { value: "Module" }));
const serverManifest = { "entry": { "module": "/assets/entry.client-uzEDDBYw.js", "imports": ["/assets/chunk-PVWAREVJ-D7LgcLjQ.js"], "css": [] }, "routes": { "root": { "id": "root", "parentId": void 0, "path": "", "index": void 0, "caseSensitive": void 0, "hasAction": false, "hasLoader": false, "hasClientAction": false, "hasClientLoader": false, "hasClientMiddleware": false, "hasErrorBoundary": true, "module": "/assets/root-DMIr1ucD.js", "imports": ["/assets/chunk-PVWAREVJ-D7LgcLjQ.js", "/assets/index-BhFB9p4H.js"], "css": ["/assets/root-B1B4Y401.css"], "clientActionModule": void 0, "clientLoaderModule": void 0, "clientMiddlewareModule": void 0, "hydrateFallbackModule": void 0 }, "routes/home": { "id": "routes/home", "parentId": "root", "path": void 0, "index": true, "caseSensitive": void 0, "hasAction": false, "hasLoader": false, "hasClientAction": false, "hasClientLoader": false, "hasClientMiddleware": false, "hasErrorBoundary": false, "module": "/assets/home-CwycDtVv.js", "imports": ["/assets/chunk-PVWAREVJ-D7LgcLjQ.js", "/assets/TypingText-B71FtNii.js", "/assets/index-BhFB9p4H.js"], "css": [], "clientActionModule": void 0, "clientLoaderModule": void 0, "clientMiddlewareModule": void 0, "hydrateFallbackModule": void 0 }, "routes/about": { "id": "routes/about", "parentId": "root", "path": "about", "index": void 0, "caseSensitive": void 0, "hasAction": false, "hasLoader": false, "hasClientAction": false, "hasClientLoader": false, "hasClientMiddleware": false, "hasErrorBoundary": false, "module": "/assets/about-FdC3bGnT.js", "imports": ["/assets/chunk-PVWAREVJ-D7LgcLjQ.js", "/assets/TypingText-B71FtNii.js", "/assets/index-BhFB9p4H.js"], "css": [], "clientActionModule": void 0, "clientLoaderModule": void 0, "clientMiddlewareModule": void 0, "hydrateFallbackModule": void 0 }, "routes/work": { "id": "routes/work", "parentId": "root", "path": "work", "index": void 0, "caseSensitive": void 0, "hasAction": false, "hasLoader": false, "hasClientAction": false, "hasClientLoader": false, "hasClientMiddleware": false, "hasErrorBoundary": false, "module": "/assets/work-ChaVWvwV.js", "imports": ["/assets/chunk-PVWAREVJ-D7LgcLjQ.js", "/assets/TypingText-B71FtNii.js", "/assets/index-BhFB9p4H.js"], "css": [], "clientActionModule": void 0, "clientLoaderModule": void 0, "clientMiddlewareModule": void 0, "hydrateFallbackModule": void 0 }, "routes/skills": { "id": "routes/skills", "parentId": "root", "path": "skills", "index": void 0, "caseSensitive": void 0, "hasAction": false, "hasLoader": false, "hasClientAction": false, "hasClientLoader": false, "hasClientMiddleware": false, "hasErrorBoundary": false, "module": "/assets/skills-D76zaSPg.js", "imports": ["/assets/chunk-PVWAREVJ-D7LgcLjQ.js", "/assets/TypingText-B71FtNii.js", "/assets/index-BhFB9p4H.js"], "css": [], "clientActionModule": void 0, "clientLoaderModule": void 0, "clientMiddlewareModule": void 0, "hydrateFallbackModule": void 0 }, "routes/contact": { "id": "routes/contact", "parentId": "root", "path": "contact", "index": void 0, "caseSensitive": void 0, "hasAction": false, "hasLoader": false, "hasClientAction": false, "hasClientLoader": false, "hasClientMiddleware": false, "hasErrorBoundary": false, "module": "/assets/contact-Cqy52Co-.js", "imports": ["/assets/chunk-PVWAREVJ-D7LgcLjQ.js", "/assets/TypingText-B71FtNii.js", "/assets/index-BhFB9p4H.js"], "css": [], "clientActionModule": void 0, "clientLoaderModule": void 0, "clientMiddlewareModule": void 0, "hydrateFallbackModule": void 0 }, "routes/pt/home": { "id": "routes/pt/home", "parentId": "root", "path": "pt", "index": void 0, "caseSensitive": void 0, "hasAction": false, "hasLoader": false, "hasClientAction": false, "hasClientLoader": false, "hasClientMiddleware": false, "hasErrorBoundary": false, "module": "/assets/home-B2uqDNKS.js", "imports": ["/assets/home-CwycDtVv.js", "/assets/chunk-PVWAREVJ-D7LgcLjQ.js", "/assets/TypingText-B71FtNii.js", "/assets/index-BhFB9p4H.js"], "css": [], "clientActionModule": void 0, "clientLoaderModule": void 0, "clientMiddlewareModule": void 0, "hydrateFallbackModule": void 0 }, "routes/pt/about": { "id": "routes/pt/about", "parentId": "root", "path": "pt/sobre", "index": void 0, "caseSensitive": void 0, "hasAction": false, "hasLoader": false, "hasClientAction": false, "hasClientLoader": false, "hasClientMiddleware": false, "hasErrorBoundary": false, "module": "/assets/about-DETUnjQK.js", "imports": ["/assets/about-FdC3bGnT.js", "/assets/chunk-PVWAREVJ-D7LgcLjQ.js", "/assets/TypingText-B71FtNii.js", "/assets/index-BhFB9p4H.js"], "css": [], "clientActionModule": void 0, "clientLoaderModule": void 0, "clientMiddlewareModule": void 0, "hydrateFallbackModule": void 0 }, "routes/pt/work": { "id": "routes/pt/work", "parentId": "root", "path": "pt/trabalho", "index": void 0, "caseSensitive": void 0, "hasAction": false, "hasLoader": false, "hasClientAction": false, "hasClientLoader": false, "hasClientMiddleware": false, "hasErrorBoundary": false, "module": "/assets/work-DkLWMH44.js", "imports": ["/assets/work-ChaVWvwV.js", "/assets/chunk-PVWAREVJ-D7LgcLjQ.js", "/assets/TypingText-B71FtNii.js", "/assets/index-BhFB9p4H.js"], "css": [], "clientActionModule": void 0, "clientLoaderModule": void 0, "clientMiddlewareModule": void 0, "hydrateFallbackModule": void 0 }, "routes/pt/skills": { "id": "routes/pt/skills", "parentId": "root", "path": "pt/habilidades", "index": void 0, "caseSensitive": void 0, "hasAction": false, "hasLoader": false, "hasClientAction": false, "hasClientLoader": false, "hasClientMiddleware": false, "hasErrorBoundary": false, "module": "/assets/skills-Czhd7PAd.js", "imports": ["/assets/skills-D76zaSPg.js", "/assets/chunk-PVWAREVJ-D7LgcLjQ.js", "/assets/TypingText-B71FtNii.js", "/assets/index-BhFB9p4H.js"], "css": [], "clientActionModule": void 0, "clientLoaderModule": void 0, "clientMiddlewareModule": void 0, "hydrateFallbackModule": void 0 }, "routes/pt/contact": { "id": "routes/pt/contact", "parentId": "root", "path": "pt/contato", "index": void 0, "caseSensitive": void 0, "hasAction": false, "hasLoader": false, "hasClientAction": false, "hasClientLoader": false, "hasClientMiddleware": false, "hasErrorBoundary": false, "module": "/assets/contact-WxuBUqkk.js", "imports": ["/assets/contact-Cqy52Co-.js", "/assets/chunk-PVWAREVJ-D7LgcLjQ.js", "/assets/TypingText-B71FtNii.js", "/assets/index-BhFB9p4H.js"], "css": [], "clientActionModule": void 0, "clientLoaderModule": void 0, "clientMiddlewareModule": void 0, "hydrateFallbackModule": void 0 }, "routes/fr/home": { "id": "routes/fr/home", "parentId": "root", "path": "fr", "index": void 0, "caseSensitive": void 0, "hasAction": false, "hasLoader": false, "hasClientAction": false, "hasClientLoader": false, "hasClientMiddleware": false, "hasErrorBoundary": false, "module": "/assets/home-CwmHXKbC.js", "imports": ["/assets/home-CwycDtVv.js", "/assets/chunk-PVWAREVJ-D7LgcLjQ.js", "/assets/TypingText-B71FtNii.js", "/assets/index-BhFB9p4H.js"], "css": [], "clientActionModule": void 0, "clientLoaderModule": void 0, "clientMiddlewareModule": void 0, "hydrateFallbackModule": void 0 }, "routes/fr/about": { "id": "routes/fr/about", "parentId": "root", "path": "fr/à-propos", "index": void 0, "caseSensitive": void 0, "hasAction": false, "hasLoader": false, "hasClientAction": false, "hasClientLoader": false, "hasClientMiddleware": false, "hasErrorBoundary": false, "module": "/assets/about-dUn7AEsH.js", "imports": ["/assets/about-FdC3bGnT.js", "/assets/chunk-PVWAREVJ-D7LgcLjQ.js", "/assets/TypingText-B71FtNii.js", "/assets/index-BhFB9p4H.js"], "css": [], "clientActionModule": void 0, "clientLoaderModule": void 0, "clientMiddlewareModule": void 0, "hydrateFallbackModule": void 0 }, "routes/fr/work": { "id": "routes/fr/work", "parentId": "root", "path": "fr/travail", "index": void 0, "caseSensitive": void 0, "hasAction": false, "hasLoader": false, "hasClientAction": false, "hasClientLoader": false, "hasClientMiddleware": false, "hasErrorBoundary": false, "module": "/assets/work-IYDemOak.js", "imports": ["/assets/work-ChaVWvwV.js", "/assets/chunk-PVWAREVJ-D7LgcLjQ.js", "/assets/TypingText-B71FtNii.js", "/assets/index-BhFB9p4H.js"], "css": [], "clientActionModule": void 0, "clientLoaderModule": void 0, "clientMiddlewareModule": void 0, "hydrateFallbackModule": void 0 }, "routes/fr/skills": { "id": "routes/fr/skills", "parentId": "root", "path": "fr/compétences", "index": void 0, "caseSensitive": void 0, "hasAction": false, "hasLoader": false, "hasClientAction": false, "hasClientLoader": false, "hasClientMiddleware": false, "hasErrorBoundary": false, "module": "/assets/skills-8W3QEALe.js", "imports": ["/assets/skills-D76zaSPg.js", "/assets/chunk-PVWAREVJ-D7LgcLjQ.js", "/assets/TypingText-B71FtNii.js", "/assets/index-BhFB9p4H.js"], "css": [], "clientActionModule": void 0, "clientLoaderModule": void 0, "clientMiddlewareModule": void 0, "hydrateFallbackModule": void 0 }, "routes/fr/contact": { "id": "routes/fr/contact", "parentId": "root", "path": "fr/contact", "index": void 0, "caseSensitive": void 0, "hasAction": false, "hasLoader": false, "hasClientAction": false, "hasClientLoader": false, "hasClientMiddleware": false, "hasErrorBoundary": false, "module": "/assets/contact-DZ5j96Fa.js", "imports": ["/assets/contact-Cqy52Co-.js", "/assets/chunk-PVWAREVJ-D7LgcLjQ.js", "/assets/TypingText-B71FtNii.js", "/assets/index-BhFB9p4H.js"], "css": [], "clientActionModule": void 0, "clientLoaderModule": void 0, "clientMiddlewareModule": void 0, "hydrateFallbackModule": void 0 }, "routes/api/portfolio": { "id": "routes/api/portfolio", "parentId": "root", "path": "api/portfolio", "index": void 0, "caseSensitive": void 0, "hasAction": false, "hasLoader": true, "hasClientAction": false, "hasClientLoader": false, "hasClientMiddleware": false, "hasErrorBoundary": false, "module": "/assets/portfolio-l0sNRNKZ.js", "imports": [], "css": [], "clientActionModule": void 0, "clientLoaderModule": void 0, "clientMiddlewareModule": void 0, "hydrateFallbackModule": void 0 } }, "url": "/assets/manifest-1914496d.js", "version": "1914496d", "sri": void 0 };
const assetsBuildDirectory = "build/client";
const basename = "/";
const future = { "unstable_middleware": false, "unstable_optimizeDeps": false, "unstable_splitRouteModules": false, "unstable_subResourceIntegrity": false, "unstable_viteEnvironmentApi": false };
const ssr = true;
const isSpaMode = false;
const prerender = [];
const routeDiscovery = { "mode": "lazy", "manifestPath": "/__manifest" };
const publicPath = "/";
const entry = { module: entryServer };
const routes = {
  "root": {
    id: "root",
    parentId: void 0,
    path: "",
    index: void 0,
    caseSensitive: void 0,
    module: route0
  },
  "routes/home": {
    id: "routes/home",
    parentId: "root",
    path: void 0,
    index: true,
    caseSensitive: void 0,
    module: route1
  },
  "routes/about": {
    id: "routes/about",
    parentId: "root",
    path: "about",
    index: void 0,
    caseSensitive: void 0,
    module: route2
  },
  "routes/work": {
    id: "routes/work",
    parentId: "root",
    path: "work",
    index: void 0,
    caseSensitive: void 0,
    module: route3
  },
  "routes/skills": {
    id: "routes/skills",
    parentId: "root",
    path: "skills",
    index: void 0,
    caseSensitive: void 0,
    module: route4
  },
  "routes/contact": {
    id: "routes/contact",
    parentId: "root",
    path: "contact",
    index: void 0,
    caseSensitive: void 0,
    module: route5
  },
  "routes/pt/home": {
    id: "routes/pt/home",
    parentId: "root",
    path: "pt",
    index: void 0,
    caseSensitive: void 0,
    module: route6
  },
  "routes/pt/about": {
    id: "routes/pt/about",
    parentId: "root",
    path: "pt/sobre",
    index: void 0,
    caseSensitive: void 0,
    module: route7
  },
  "routes/pt/work": {
    id: "routes/pt/work",
    parentId: "root",
    path: "pt/trabalho",
    index: void 0,
    caseSensitive: void 0,
    module: route8
  },
  "routes/pt/skills": {
    id: "routes/pt/skills",
    parentId: "root",
    path: "pt/habilidades",
    index: void 0,
    caseSensitive: void 0,
    module: route9
  },
  "routes/pt/contact": {
    id: "routes/pt/contact",
    parentId: "root",
    path: "pt/contato",
    index: void 0,
    caseSensitive: void 0,
    module: route10
  },
  "routes/fr/home": {
    id: "routes/fr/home",
    parentId: "root",
    path: "fr",
    index: void 0,
    caseSensitive: void 0,
    module: route11
  },
  "routes/fr/about": {
    id: "routes/fr/about",
    parentId: "root",
    path: "fr/à-propos",
    index: void 0,
    caseSensitive: void 0,
    module: route12
  },
  "routes/fr/work": {
    id: "routes/fr/work",
    parentId: "root",
    path: "fr/travail",
    index: void 0,
    caseSensitive: void 0,
    module: route13
  },
  "routes/fr/skills": {
    id: "routes/fr/skills",
    parentId: "root",
    path: "fr/compétences",
    index: void 0,
    caseSensitive: void 0,
    module: route14
  },
  "routes/fr/contact": {
    id: "routes/fr/contact",
    parentId: "root",
    path: "fr/contact",
    index: void 0,
    caseSensitive: void 0,
    module: route15
  },
  "routes/api/portfolio": {
    id: "routes/api/portfolio",
    parentId: "root",
    path: "api/portfolio",
    index: void 0,
    caseSensitive: void 0,
    module: route16
  }
};
export {
  serverManifest as assets,
  assetsBuildDirectory,
  basename,
  entry,
  future,
  isSpaMode,
  prerender,
  publicPath,
  routeDiscovery,
  routes,
  ssr
};
