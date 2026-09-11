/**
 * IGUANA+ — Dados de conteúdo
 * -------------------------------------------------
 * Portfólio: adicione novos projetos incluindo um novo
 * objeto no array abaixo. O carrossel se ajusta automaticamente.
 * Substitua "image" por um caminho real quando tiver o
 * mockup/screenshot do projeto. Apenas itens com imagem aparecem.
 */

/* EDITAR: FOTOS DO PORTFÓLIO
 * 1. Salve sua foto em assets/img/ (prefira nomes sem espaços ou acentos).
 * 2. Copie este exemplo para dentro da lista abaixo, separando objetos com vírgula:
 *    { id: "meu-projeto", title: "Nome do projeto",
 *      image: "assets/img/minha-foto.jpg", link: "https://endereco-do-projeto.com" },
 * 3. Use image: null para ocultar um item; link: "#" para foto sem link externo.
 * A ordem da lista é a ordem das fotos. title é usado para acessibilidade.
 * category e description são dados opcionais; não aparecem sobre as imagens.
 * Com uma foto, os controles ficam ocultos. A partir de duas, surgem automaticamente.
 */
window.IGUANA_PROJECTS = [
  {
    id: "projeto-01",
    title: "Site Institucional — Exemplo ilustrativo",
    category: "Desenvolvimento Web",
    description:
      "Desenvolvimento de site institucional responsivo com foco em apresentação da marca e geração de contatos.",
    image: null, // placeholder — inserir screenshot/mockup real
    link: "#",
  },
  {
  id: "projeto-02",
  title: "Landing Page — Exemplo ilustrativo",
  category: "Landing Pages",
  description:
    "Página de conversão criada para campanha de lançamento, com formulário integrado e foco em performance.",
  image: "assets/img/folder_barbearia.jpg",
  link: "#",
  },
  {
    id: "projeto-03",
    title: "Sistema Interno — Exemplo ilustrativo",
    category: "Sistemas",
    description:
      "Sistema web sob medida para organizar processos internos e centralizar informações da operação.",
    image: null,
    link: "#",
  },
  {
    id: "projeto-04",
    title: "Automação de Atendimento — Exemplo ilustrativo",
    category: "Automação",
    description:
      "Fluxo de automação para reduzir tarefas repetitivas e agilizar respostas da equipe.",
    image: null,
    link: "#",
  },
  {
    id: "projeto-05",
    title: "Chatbot de Vendas — Exemplo ilustrativo",
    category: "Chatbots",
    description:
      "Chatbot para qualificação de leads e primeiro atendimento, integrado ao WhatsApp.",
    image: null,
    link: "#",
  },
  {
    id: "projeto-06",
    title: "Site Institucional — Exemplo ilustrativo",
    category: "Desenvolvimento Web",
    description:
      "Redesign de site institucional com nova identidade visual e estrutura otimizada para SEO.",
    image: null,
    link: "#",
  },
];

// EDITAR: títulos, descrições e ícones dos cartões de Serviços. Ícones disponíveis em js/main.js > ICONS.
window.IGUANA_SERVICES = [
  {
    icon: "code",
    title: "Desenvolvimento Web",
    description:
      "Sites modernos, rápidos e responsivos que fortalecem a presença digital da sua empresa.",
  },
  {
    icon: "bot",
    title: "Chatbots & Automação",
    description:
      "Automatize atendimentos, processos e tarefas repetitivas para ganhar tempo e eficiência.",
  },
  /*{
    icon: "compass",
    title: "Consultoria",
    description:
      "Analisamos seu negócio para identificar oportunidades, gargalos e caminhos de crescimento.",
  },*/
  {
    icon: "line-chart",
    title: "Consultoria Financeira",
    description:
      "Transforme números em informações úteis para tomar decisões financeiras mais inteligentes.",
  },
  {
    icon: "search",
    title: "Análise de Mercado",
    description:
      "Entenda seu mercado, concorrentes, oportunidades e posicionamento.",
  },
  {
    icon: "tag",
    title: "Precificação",
    description:
      "Encontre preços mais estratégicos considerando custos, margem, mercado e posicionamento.",
  },
  {
    icon: "grid",
    title: "Análise SWOT",
    description:
      "Identifique forças, fraquezas, oportunidades e ameaças para construir estratégias mais eficientes.",
  },
];

// EDITAR: números, títulos e textos da seção "Da ideia à solução".
window.IGUANA_PROCESS = [
  {
    number: "01",
    title: "Entendemos",
    description: "Conhecemos o negócio, seus objetivos e seus principais desafios.",
  },
  {
    number: "02",
    title: "Analisamos",
    description: "Identificamos oportunidades e definimos a melhor estratégia.",
  },
  {
    number: "03",
    title: "Desenvolvemos",
    description: "Transformamos a estratégia em uma solução digital.",
  },
  {
    number: "04",
    title: "Evoluímos",
    description: "Acompanhamos os resultados e identificamos novas oportunidades.",
  },
];
