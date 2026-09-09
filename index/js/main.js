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

  var igLink = document.querySelector("[data-instagram]");

  if (igLink && cfg && cfg.social) {
    igLink.setAttribute("href", cfg.social.instagram);
  }

  var liLink = document.querySelector("[data-linkedin]");

  if (liLink && cfg && cfg.social) {
    liLink.setAttribute("href", cfg.social.linkedin);
  }

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

  function closeMenu() {
    if (!mobilePanel || !menuToggle) return;

    mobilePanel.classList.remove("open");
    document.body.classList.remove("menu-open");
    menuToggle.setAttribute("aria-expanded", "false");
  }

  if (menuToggle && mobilePanel) {
    menuToggle.addEventListener("click", function () {
      var isOpen = mobilePanel.classList.toggle("open");

      document.body.classList.toggle("menu-open", isOpen);

      menuToggle.setAttribute(
        "aria-expanded",
        String(isOpen)
      );
    });

    mobilePanel.querySelectorAll("a").forEach(function (a) {
      a.addEventListener("click", closeMenu);
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

  /* ---------------- Portfólio ---------------- */

  var portfolioGrid = document.querySelector(
    "[data-portfolio-grid]"
  );

  var projects = Array.isArray(window.IGUANA_PROJECTS)
    ? window.IGUANA_PROJECTS
    : [];

  var categories = ["Todos"].concat(
    Array.from(
      new Set(
        projects.map(function (p) {
          return p.category;
        })
      )
    )
  );

  var filtersEl = document.querySelector(
    "[data-portfolio-filters]"
  );

  function renderProjects(filter) {
    if (!portfolioGrid) return;

    var list = projects.filter(function (p) {
      return filter === "Todos" || p.category === filter;
    });

    portfolioGrid.innerHTML = list
      .map(function (p) {
        return (
          '<article class="project-card">' +
          '<div class="project-thumb">' +
          (p.image
            ? '<img src="' +
              p.image +
              '" alt="Mockup do projeto ' +
              p.title +
              '">'
            : svgIcon("grid", 40) +
              '<span style="position:absolute;bottom:12px;left:12px;">' +
              "Mockup a inserir" +
              "</span>") +
          "</div>" +
          '<div class="project-body">' +
          '<span class="project-category">' +
          p.category +
          "</span>" +
          "<h3>" +
          p.title +
          "</h3>" +
          "<p>" +
          p.description +
          "</p>" +
          '<a class="project-link" href="' +
          p.link +
          '">' +
          "Ver projeto " +
          svgIcon("arrow", 15) +
          "</a>" +
          "</div>" +
          "</article>"
        );
      })
      .join("");
  }

  if (filtersEl) {
    filtersEl.innerHTML = categories
      .map(function (c, i) {
        return (
          '<button type="button" class="filter-btn' +
          (i === 0 ? " active" : "") +
          '" data-filter="' +
          c +
          '">' +
          c +
          "</button>"
        );
      })
      .join("");

    filtersEl.addEventListener("click", function (e) {
      var btn = e.target.closest(".filter-btn");

      if (!btn) return;

      filtersEl
        .querySelectorAll(".filter-btn")
        .forEach(function (b) {
          b.classList.remove("active");
        });

      btn.classList.add("active");

      renderProjects(
        btn.getAttribute("data-filter")
      );
    });
  }

  if (portfolioGrid) {
    renderProjects("Todos");
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

  /* ---------------- Scroll reveal ---------------- */

  var revealTargets =
    document.querySelectorAll(".reveal");

  if ("IntersectionObserver" in window) {
    var io = new IntersectionObserver(
      function (entries) {
        entries.forEach(function (entry) {
          if (entry.isIntersecting) {
            entry.target.classList.add(
              "is-visible"
            );

            io.unobserve(entry.target);
          }
        });
      },
      {
        threshold: 0.15
      }
    );

    revealTargets.forEach(function (t) {
      io.observe(t);
    });
  } else {
    revealTargets.forEach(function (t) {
      t.classList.add("is-visible");
    });
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

      var msg = wrap.querySelector(
        ".field-error-msg"
      );

      if (msg) {
        msg.textContent = message;
      }
    }

    function clearError(field) {
      var wrap = field.closest(".field");

      if (!wrap) return;

      wrap.classList.remove("error");
    }

    form.addEventListener("submit", function (e) {
      e.preventDefault();

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

        /* Validação de e-mail CORRETA */
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

      var data = new FormData(form);

      /*
       * COLOQUE A NOVA ACCESS KEY DO WEB3FORMS AQUI.
       * Não envie a chave pelo chat.
       */
      data.append(
        "access_key",
        "7af392f3-6fda-4b4b-815b-b3d239cba9e5"
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

      /* URL CORRETA DO WEB3FORMS */
      fetch(
        "https://api.web3forms.com/submit",
        {
          method: "POST",
          body: data
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
          console.error(
            "Erro Web3Forms:",
            error
          );

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
})();