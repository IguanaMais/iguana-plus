/* MAPA DE EDIÇÃO — INTERAÇÕES GERAIS
 * Conteúdo: js/data.js e js/config.js. Este arquivo conecta esses dados ao HTML.
 * Procure os blocos: Mobile menu, Serviços, Formulário de contato e Chat Iguana+.
 * Validação/envio: bloco "Formulário de contato"; atendimento: assets/data/chat.json.
 * Carrossel e animações ficam em js/portfolio.js e js/motion.js.
 */
(function () {
  "use strict";

  var cfg = window.IGUANA_CONFIG;

  /* ---------------- WhatsApp links ---------------- */

  document.querySelectorAll("[data-whatsapp]").forEach(function (el) {
    var key = el.getAttribute("data-whatsapp") || "default";

    if (window.getWhatsAppLink) {
      el.setAttribute("href", window.getWhatsAppLink(key));
    }

    el.setAttribute("target", "_blank");
    el.setAttribute("rel", "noopener noreferrer");
  });

  /* ---------------- E-mail ---------------- */

  document.querySelectorAll("[data-email]").forEach(function (el) {
    if (cfg && cfg.email) {
      el.setAttribute("href", "mailto:" + cfg.email);

      if (el.hasAttribute("data-email-text")) {
        el.textContent = cfg.email;
      }
    }
  });

  /* ---------------- Redes sociais ---------------- */

  ["instagram", "linkedin"].forEach(function (network) {
    document.querySelectorAll("[data-" + network + "]").forEach(function (link) {
      var url = cfg && cfg.social && cfg.social[network];
      if (url && /^https:\/\//.test(url)) link.href = url;
      else link.hidden = true;
    });
  });

  /* ---------------- Header on scroll ---------------- */

  var header = document.querySelector(".site-header");

  function onScroll() {
    if (!header) return;

    if (window.scrollY > 24) {
      header.classList.add("scrolled");
    } else {
      header.classList.remove("scrolled");
    }
  }

  onScroll();

  window.addEventListener("scroll", onScroll, {
    passive: true
  });

  /* ---------------- Mobile menu ---------------- */

  var menuToggle = document.querySelector(".menu-toggle");
  var mobilePanel = document.querySelector(".mobile-panel");

  function closeMenu(restoreFocus) {
    if (!mobilePanel || !menuToggle) return;
    mobilePanel.classList.remove("open");
    mobilePanel.inert = true;
    document.body.classList.remove("menu-open");
    menuToggle.setAttribute("aria-expanded", "false");
    menuToggle.setAttribute("aria-label", "Abrir menu");
    if (restoreFocus === true) menuToggle.focus();
  }
  if (menuToggle && mobilePanel) {
    menuToggle.addEventListener("click", function () {
      var isOpen = !mobilePanel.classList.contains("open");
      closeMenu();
      if (isOpen) {
        closeChat(false);
        mobilePanel.inert = false;
        mobilePanel.classList.add("open");
        document.body.classList.add("menu-open");
        menuToggle.setAttribute("aria-expanded", "true");
        menuToggle.setAttribute("aria-label", "Fechar menu");
        mobilePanel.querySelector("a").focus();
      }
    });
    mobilePanel.querySelectorAll("a").forEach(function (a) {
      a.addEventListener("click", function () {
        closeMenu(true);
        if (a.hash) {
          var target = document.querySelector(a.hash);
          if (target) { target.tabIndex = -1; target.focus({preventScroll: true}); }
        }
      });
    });
    window.addEventListener("resize", function () {
      if (window.innerWidth > 880) closeMenu();
    });
    document.addEventListener("keydown", function (event) {
      if (!mobilePanel.classList.contains("open")) return;
      if (event.key === "Escape") closeMenu(true);
      if (event.key === "Tab") {
        var links = [menuToggle].concat(Array.from(mobilePanel.querySelectorAll("a")));
        var first = links[0], last = links[links.length - 1];
        if (event.shiftKey && document.activeElement === first) { event.preventDefault(); last.focus(); }
        else if (!event.shiftKey && document.activeElement === last) { event.preventDefault(); first.focus(); }
      }
    });
  }

  /* ---------------- Hero title word reveal ---------------- */

  var heroTitle = document.querySelector(".hero-title");

  if (heroTitle) {
    var text = heroTitle.textContent.trim();
    var words = text.split(" ");

    heroTitle.innerHTML = words
      .map(function (w, i) {
        return (
          '<span class="word" style="animation-delay:' +
          (0.05 + i * 0.045).toFixed(3) +
          "s\">" +
          w +
          "</span>"
        );
      })
      .join(" ");
  }

  /* ---------------- Ícones ---------------- */

  var ICONS = {
    code:
      '<path d="M8 3l-5 9 5 9M16 3l5 9-5 9M11 21l2-18"/>',

    bot:
      '<rect x="3" y="8" width="18" height="12" rx="2"/>' +
      '<circle cx="8.5" cy="14" r="1.2"/>' +
      '<circle cx="15.5" cy="14" r="1.2"/>' +
      '<path d="M12 8V4M9 4h6"/>',

    compass:
      '<circle cx="12" cy="12" r="9"/>' +
      '<path d="M15.5 8.5l-2 5-5 2 2-5z"/>',

    "line-chart":
      '<path d="M3 3v18h18M7 15l4-5 3 3 5-7"/>',

    search:
      '<circle cx="11" cy="11" r="7"/>' +
      '<path d="M21 21l-4.3-4.3"/>',

    tag:
      '<path d="M20.6 12.6l-8-8H4v8.6l8 8a2 2 0 0 0 2.8 0l5.8-5.8a2 2 0 0 0 0-2.8z"/>' +
      '<circle cx="8.5" cy="8.5" r="1.2"/>',

    grid:
      '<rect x="3" y="3" width="8" height="8" rx="1"/>' +
      '<rect x="13" y="3" width="8" height="8" rx="1"/>' +
      '<rect x="3" y="13" width="8" height="8" rx="1"/>' +
      '<rect x="13" y="13" width="8" height="8" rx="1"/>',

    arrow:
      '<path d="M5 12h14M13 6l6 6-6 6"/>'
  };

  function svgIcon(name, size) {
    return (
      '<svg width="' +
      (size || 20) +
      '" height="' +
      (size || 20) +
      '" viewBox="0 0 24 24" fill="none" ' +
      'stroke="currentColor" stroke-width="1.6" ' +
      'stroke-linecap="round" stroke-linejoin="round">' +
      (ICONS[name] || "") +
      "</svg>"
    );
  }

  /* ---------------- Serviços ---------------- */

  var servicesGrid = document.querySelector(
    "[data-services-grid]"
  );

  if (
    servicesGrid &&
    Array.isArray(window.IGUANA_SERVICES)
  ) {
    servicesGrid.innerHTML = window.IGUANA_SERVICES
      .map(function (s) {
        return (
          '<article class="service-card">' +
          '<div class="service-icon">' +
          svgIcon(s.icon, 22) +
          "</div>" +
          "<h3>" +
          s.title +
          "</h3>" +
          "<p>" +
          s.description +
          "</p>" +
          "</article>"
        );
      })
      .join("");
  }

  /* ---------------- Como funciona ---------------- */

  var processEl = document.querySelector(
    "[data-process]"
  );

  if (
    processEl &&
    Array.isArray(window.IGUANA_PROCESS)
  ) {
    processEl.innerHTML = window.IGUANA_PROCESS
      .map(function (s) {
        return (
          '<div class="process-step">' +
          '<span class="process-number">' +
          s.number +
          "</span>" +
          "<h3>" +
          s.title +
          "</h3>" +
          "<p>" +
          s.description +
          "</p>" +
          "</div>"
        );
      })
      .join("");
  }

  /* ---------------- Estatísticas ---------------- */

  var trustGrid = document.querySelector(
    "[data-trust-grid]"
  );

  if (
    trustGrid &&
    cfg &&
    Array.isArray(cfg.stats)
  ) {
    trustGrid.innerHTML = cfg.stats
      .map(function (s) {
        return (
          '<div class="trust-stat">' +
          '<div class="value">' +
          s.value +
          "</div>" +
          '<div class="label">' +
          s.label +
          "</div>" +
          "</div>"
        );
      })
      .join("");
  }

  /* ---------------- Formulário de contato ---------------- */

  var form = document.querySelector(
    "[data-contact-form]"
  );

  if (form) {
    var statusEl = form.querySelector(
      ".form-status"
    );

    function setError(field, message) {
      var wrap = field.closest(".field");

      if (!wrap) return;

      wrap.classList.add("error");
      field.setAttribute("aria-invalid", "true");

      var msg = wrap.querySelector(
        ".field-error-msg"
      );

      if (msg) {
        msg.textContent = message;
        msg.id = field.id + "-error";
        field.setAttribute("aria-describedby", msg.id);
      }
    }

    function clearError(field) {
      var wrap = field.closest(".field");

      if (!wrap) return;

      wrap.classList.remove("error");
      field.removeAttribute("aria-invalid");
      field.removeAttribute("aria-describedby");
    }

    var sending = false;
    var submitButton = form.querySelector("[type=submit]");
    form.addEventListener("input", function (event) { clearError(event.target); });
    form.addEventListener("submit", function (e) {
      e.preventDefault();
      if (sending || form.elements.botcheck.checked) return;

      var valid = true;

      var fields =
        form.querySelectorAll("[required]");

      fields.forEach(function (field) {
        clearError(field);

        var value = field.value.trim();

        if (!value) {
          setError(
            field,
            "Campo obrigatório."
          );

          valid = false;
          return;
        }

        if (field.type === "tel" && !/^(?:55)?[1-9][0-9][0-9]{8,9}$/.test(value.replace(/[\s()+.-]/g, ""))) {
          setError(field, "Informe um telefone com DDD (10 ou 11 dígitos; +55 opcional).");
          valid = false;
        }
        /* Validação de e-mail */
        if (field.type === "email") {
          var emailOk =
            /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(
              value
            );

          if (!emailOk) {
            setError(
              field,
              "Informe um e-mail válido."
            );

            valid = false;
          }
        }
      });

      if (statusEl) {
        statusEl.classList.remove(
          "visible",
          "success",
          "error-msg"
        );
      }

      if (!valid) {
        form.querySelector("[aria-invalid=true]").focus();
        if (statusEl) {
          statusEl.textContent =
            "Verifique os campos destacados antes de enviar.";

          statusEl.classList.add(
            "visible",
            "error-msg"
          );
        }

        return;
      }

      /* ---------------- Web3Forms ---------------- */

      sending = true;
      submitButton.disabled = true;
      form.setAttribute("aria-busy", "true");
      var controller = new AbortController();
      var timeout = setTimeout(function () { controller.abort(); }, 15000);
      var data = new FormData(form);
      data.set("replyto", form.elements.email.value.trim());

      data.append(
        "access_key",
        cfg.formAccessKey
      );

      data.append(
        "subject",
        "Novo Lead - Iguana+"
      );

      data.append(
        "from_name",
        "Site Iguana+"
      );

      if (statusEl) {
        statusEl.textContent =
          "Enviando...";

        statusEl.classList.add(
          "visible",
          "success"
        );
      }

      fetch(
        "https://api.web3forms.com/submit",
        {
          method: "POST",
          body: data,
          signal: controller.signal
        }
      )
        .then(function (response) {
          if (!response.ok) {
            throw new Error(
              "Erro HTTP: " +
              response.status
            );
          }

          return response.json();
        })

        .then(function (result) {
          if (result.success) {
            if (statusEl) {
              statusEl.textContent =
                "Mensagem enviada com sucesso! A equipe Iguana+ entrará em contato em breve.";

              statusEl.classList.remove(
                "error-msg"
              );

              statusEl.classList.add(
                "visible",
                "success"
              );
            }

            form.reset();
          } else {
            throw new Error(
              result.message ||
              "Erro ao enviar formulário."
            );
          }
        })

        .catch(function (error) {


          if (statusEl) {
            statusEl.textContent =
              "Não foi possível enviar sua mensagem. Tente novamente ou fale conosco pelo WhatsApp.";

            statusEl.classList.remove(
              "success"
            );

            statusEl.classList.add(
              "visible",
              "error-msg"
            );
          }
        }).finally(function () {
          clearTimeout(timeout);
          sending = false;
          submitButton.disabled = false;
          form.removeAttribute("aria-busy");
        });
    });
  }

/* ---------------- Ano no footer ---------------- */

  var yearEl = document.querySelector(
    "[data-year]"
  );

  if (yearEl) {
    yearEl.textContent =
      new Date().getFullYear();
  }


  /* ---------------- Chat Iguana+ ---------------- */
  // EDITAR: mensagens no JSON, mantendo inicio e os destinos válidos. JSON não aceita comentários.

  var chatToggle = document.getElementById("chat-toggle");
  var chatWidget = document.getElementById("chat-widget");
  var chatClose = document.getElementById("chat-close");
  var chatMessages = document.getElementById("chat-messages");
  var chatOptions = document.getElementById("chat-options");

  var chatData = null;
  var chatLoading = false;

  function carregarChat() {
    if (chatLoading) return;
    chatLoading = true;
    chatMessages.textContent = "Carregando atendimento…";
    var controller = new AbortController();
    var timeout = setTimeout(function () { controller.abort(); }, 10000);
    fetch("assets/data/chat.json", { signal: controller.signal })
      .then(function (response) {
        if (!response.ok) {
          throw new Error("Não foi possível carregar o chat.");
        }

        return response.json();
      })
      .then(function (data) {
        if (!data.inicio || !Array.isArray(data.inicio.opcoes)) throw new Error("Chat inválido");
        chatData = data;
        mostrarChat("inicio");
      })
      .catch(function (error) {


        if (chatMessages) {
          chatMessages.innerHTML =
            "<p>Não foi possível carregar o atendimento. Fale com a equipe pelo WhatsApp.</p>";
          chatOptions.replaceChildren();
          var fallback = document.createElement("a");
          fallback.className = "chat-option";
          fallback.textContent = "Falar no WhatsApp";
          fallback.href = window.getWhatsAppLink("default");
          fallback.target = "_blank";
          fallback.rel = "noopener noreferrer";
          chatOptions.appendChild(fallback);
        }
      }).finally(function () { chatLoading = false; clearTimeout(timeout); });
  }

  function mostrarChat(chave) {
    if (!chatData || !chatData[chave]) return;

    var hadFocus = chatWidget.contains(document.activeElement);
    var bloco = chatData[chave];

    chatMessages.innerHTML = "";
    chatOptions.innerHTML = "";

    if (bloco.mensagem) {
      var mensagem = document.createElement("div");

      mensagem.className = "chat-message";
      mensagem.textContent = bloco.mensagem;

      chatMessages.appendChild(mensagem);
    }

    if (Array.isArray(bloco.opcoes)) {
      bloco.opcoes.forEach(function (opcao) {
        var button = document.createElement("button");

        button.type = "button";
        button.className = "chat-option";
        button.textContent = opcao.texto;

        button.addEventListener("click", function () {

          if (opcao.destino) {
            mostrarChat(opcao.destino);
          }

          if (opcao.resposta) {
            mostrarResposta(opcao.resposta);
          }

          if (opcao.acao === "whatsapp") {
            abrirWhatsApp();
          }

        });

        chatOptions.appendChild(button);
      });
    }
    chatMessages.scrollTop = 0;
    if (hadFocus && chatOptions.firstElementChild) chatOptions.firstElementChild.focus();
  }

  function mostrarResposta(resposta) {
    var mensagem = document.createElement("div");

    mensagem.className = "chat-message";
    mensagem.textContent = resposta;

    chatMessages.appendChild(mensagem);

    chatMessages.scrollTop = chatMessages.scrollHeight;
  }

  function abrirWhatsApp() {
    if (window.getWhatsAppLink) {
      window.open(
        window.getWhatsAppLink("default"),
        "_blank",
        "noopener,noreferrer"
      );
    }
  }

  function closeChat(restoreFocus) {
    if (!chatWidget || !chatToggle) return;
    chatWidget.classList.remove("open");
    chatWidget.setAttribute("aria-hidden", "true");
    chatWidget.inert = true;
    chatToggle.setAttribute("aria-expanded", "false");
    chatToggle.setAttribute("aria-label", "Abrir chat");
    if (restoreFocus !== false) chatToggle.focus();
  }
  if (chatToggle && chatWidget) {
    chatToggle.addEventListener("click", function () {
      if (chatWidget.classList.contains("open")) { closeChat(); return; }
      chatWidget.classList.add("open");
      chatWidget.inert = false;
      chatWidget.setAttribute("aria-hidden", "false");
      chatToggle.setAttribute("aria-expanded", "true");
      chatToggle.setAttribute("aria-label", "Fechar chat");
      chatClose.focus();
      if (!chatData) carregarChat();
      else mostrarChat("inicio");
    });
    chatClose.addEventListener("click", function () { closeChat(); });
    document.addEventListener("keydown", function (event) {
      if (event.key === "Escape" && chatWidget.classList.contains("open")) closeChat();
    });
  }
})();
