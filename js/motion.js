/* MAPA DE EDIÇÃO — ANIMAÇÕES
 * enter(): distância (px), duração (ms) e curva da entrada de cada bloco.
 * enterBlock(): intervalo entre os cartões; Math.min limita o atraso acumulado.
 * IntersectionObserver: repete a entrada ao retornar às seções e pausa mascotes fora da tela.
 * updateNavigation(): identifica a seção atual e destaca seu link no menu.
 * Flutuação das iguanas: CSS > @keyframes iguana-float (altura) e "6s" (duração).
 * syncPause(): botão do rodapé e acessibilidade; preserve o suporte a movimento reduzido.
 */
(function () {
  "use strict";

  var reduced = window.matchMedia("(prefers-reduced-motion: reduce)");
  var running = new Set();
  var pauseButton = document.querySelector("[data-motion-toggle]");
  var paused = false;
  function syncPause() {
    document.documentElement.classList.toggle("motion-paused", paused || reduced.matches);
    if (pauseButton) {
      pauseButton.textContent = reduced.matches ? "Movimento reduzido ativo" : paused ? "Ativar animações" : "Pausar animações";
      pauseButton.setAttribute("aria-pressed", String(paused || reduced.matches));
      pauseButton.disabled = reduced.matches;
    }
    if (paused || reduced.matches) running.forEach(function (animation) { animation.cancel(); });
  }
  if (pauseButton) pauseButton.addEventListener("click", function () { paused = !paused; syncPause(); });
  syncPause();

  // O conteúdo permanece visível mesmo sem suporte a animações ou JavaScript.
  function enter(element, delay, distance) {
    if (paused || reduced.matches || !element.animate) return;
    var animation = element.animate([
      { opacity: 0, transform: "translateY(" + (distance || 28) + "px)" },
      { opacity: 1, transform: "translateY(0)" }
    ], {
      duration: 720,
      delay: delay || 0,
      easing: "cubic-bezier(.22, 1, .36, 1)",
      fill: "backwards"
    });
    running.add(animation);
    animation.onfinish = animation.oncancel = function () { running.delete(animation); };
  }

  function enterBlock(block) {
    var cards = block.querySelectorAll(".service-card, .process-step, .trust-stat");
    if (cards.length) {
      cards.forEach(function (card, index) { enter(card, Math.min(index, 5) * 85); });
    } else {
      enter(block);
    }
  }

  if ("IntersectionObserver" in window) {
    var observer = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (!entry.isIntersecting) return;
        enterBlock(entry.target);
      });
    }, { threshold: 0, rootMargin: "0px 0px -32px 0px" });
    document.querySelectorAll(".reveal").forEach(function (block) { observer.observe(block); });
    var mascots = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) { entry.target.classList.toggle("mascot-in-view", entry.isIntersecting); });
    });
    document.querySelectorAll(".hero-visual, .about-visual").forEach(function (mascot) { mascots.observe(mascot); });
  }

  // Atualiza o indicador do menu durante rolagem manual e navegação por âncoras.
  var sections = Array.from(document.querySelectorAll("main > section[id]"));
  var links = document.querySelectorAll(".nav-links a, .mobile-panel a[href^='#']");
  var header = document.querySelector(".site-header");
  var scheduled = false;
  var destination = null;

  function updateNavigation() {
    scheduled = false;
    var line = (header ? header.getBoundingClientRect().height : 80) + 48;
    var active = sections[0];
    sections.forEach(function (section) {
      if (section.getBoundingClientRect().top <= line) active = section;
    });
    if (window.scrollY + window.innerHeight >= document.documentElement.scrollHeight - 4) {
      active = sections[sections.length - 1];
    }
    links.forEach(function (link) {
      if (active && link.hash === "#" + active.id) link.setAttribute("aria-current", "location");
      else link.removeAttribute("aria-current");
    });
    if (destination) {
      var top = destination.getBoundingClientRect().top;
      if (top >= -4 && top <= line) {
        var title = destination.querySelector("h1, h2");
        if (title) enter(title, 0, 16);
        destination = null;
      }
    }
  }

  function schedule() {
    if (!scheduled) { scheduled = true; window.requestAnimationFrame(updateNavigation); }
  }
  document.addEventListener("click", function (event) {
    var link = event.target.closest("a[href^='#']");
    if (!link || !link.hash || event.defaultPrevented || event.button !== 0 || event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return;
    var target = document.getElementById(link.hash.slice(1));
    if (!target || target.tagName !== "SECTION") return;
    destination = target;
    schedule();
  });
  window.addEventListener("scroll", schedule, { passive: true });
  window.addEventListener("resize", schedule);
  window.addEventListener("hashchange", schedule);
  window.addEventListener("wheel", function () { destination = null; }, { passive: true });
  window.addEventListener("touchstart", function () { destination = null; }, { passive: true });
  updateNavigation();

  reduced.addEventListener("change", syncPause);
})();
