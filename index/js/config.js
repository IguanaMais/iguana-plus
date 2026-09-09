/**
 * IGUANA+ — Configuração central
 * -------------------------------------------------
 * Edite apenas este arquivo para atualizar contatos,
 * números de credibilidade e links de redes sociais
 * em todo o site.
 */

window.IGUANA_CONFIG = {
  // Apenas dígitos, com código do país. Ex: 55 + DDD + número.
  whatsappNumber: "5511934363816",

  whatsappMessages: {
    default: "Olá! Conheci a Iguana+ pelo site e gostaria de saber mais sobre os serviços.",
    contato: "Olá! Vim pelo site da Iguana+ e quero conversar sobre um projeto.",
  },

  email: "iguana.empresarial@gmail.com",

  social: {
    instagram: "https://instagram.com/iguanamais/", // placeholder — substituir
    linkedin: "https://linkedin.com/company/iguanaplus", // placeholder — substituir
  },

  // Números de credibilidade — editáveis, sem inventar dados reais.
  stats: [
    { value: "+10", label: "projetos desenvolvidos" },
    { value: "+5", label: "soluções digitais entregues" },
    { value: "100%", label: "foco no cliente" },
  ],
};

window.getWhatsAppLink = function (messageKey) {
  const cfg = window.IGUANA_CONFIG;
  const msg = cfg.whatsappMessages[messageKey] || cfg.whatsappMessages.default;
  return `https://wa.me/${cfg.whatsappNumber}?text=${encodeURIComponent(msg)}`;
};
