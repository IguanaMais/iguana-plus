/* MAPA DE EDIÇÃO — CARROSSEL
 * Para adicionar fotos, edite IGUANA_PROJECTS em js/data.js (não este arquivo).
 * Layout/tamanho/blur das imagens: css/styles.css > "Carrossel com imagem em foco".
 * select(): define imagem principal, imagens laterais e indicadores.
 * go(): troca o projeto ao clicar nos botões, nas bolinhas ou nas imagens laterais.
 * O carrossel não avança sozinho e respeita a preferência de movimento reduzido.
 */
(function () {
  "use strict";
  var carousel = document.querySelector("[data-carousel]");
  if (!carousel) return;
  var track = carousel.querySelector("[data-carousel-track]");
  var controls = carousel.querySelector("[data-carousel-controls]");
  var dots = carousel.querySelector("[data-carousel-dots]");
  var status = carousel.querySelector("[data-carousel-status]");
  var previous = carousel.querySelector("[data-carousel-prev]");
  var next = carousel.querySelector("[data-carousel-next]");
  var reduced = window.matchMedia("(prefers-reduced-motion: reduce)");
  var projects = (window.IGUANA_PROJECTS || []).filter(function (project) {
    return typeof project.image === "string" && project.image.trim();
  });
  var active = 0;
  var slides = [];
  var indicators = [];
  if (!projects.length) {
    var empty = document.createElement("p");
    empty.className = "portfolio-empty";
    empty.textContent = "Novos projetos em breve.";
    track.appendChild(empty);
    track.removeAttribute("tabindex");
    return;
  }
  projects.forEach(function (project, index) {
    var slide = document.createElement("div");
    slide.className = "portfolio-slide";
    slide.setAttribute("role", "group");
    slide.setAttribute("aria-roledescription", "slide");
    slide.setAttribute("aria-label", (index + 1) + " de " + projects.length);
    var image = document.createElement("img");
    image.src = project.image;
    image.alt = project.title || "Projeto Iguana+";
    image.loading = index < 2 ? "eager" : "lazy";
    image.decoding = "async";
    image.draggable = false;
    if (/^https?:\/\//.test(project.link || "")) {
      var link = document.createElement("a");
      link.href = project.link;
      link.target = "_blank";
      link.rel = "noopener noreferrer";
      link.setAttribute("aria-label", "Ver projeto: " + image.alt);
      link.appendChild(image);
      slide.appendChild(link);
    } else slide.appendChild(image);
    image.addEventListener("error", function () {
      var message = document.createElement("p");
      message.className = "portfolio-empty";
      message.textContent = "Imagem indisponível: " + image.alt;
      image.replaceWith(message);
    }, { once: true });
    slide.addEventListener("click", function (event) {
      if (active !== index) { event.preventDefault(); go(index); }
    });
    track.appendChild(slide);
    slides.push(slide);
    var dot = document.createElement("button");
    dot.type = "button";
    dot.className = "portfolio-dot";
    dot.setAttribute("aria-label", "Mostrar projeto " + (index + 1) + ": " + image.alt);
    dot.addEventListener("click", function () { go(index); });
    dots.appendChild(dot);
    indicators.push(dot);
  });
  controls.hidden = projects.length < 2;
  track.classList.toggle("is-single", projects.length === 1);

  function select(index) {
    active = index;
    slides.forEach(function (slide, i) {
      var offset = i - index;
      slide.classList.toggle("is-active", offset === 0);
      slide.classList.toggle("is-prev", offset === -1);
      slide.classList.toggle("is-next", offset === 1);
      slide.classList.toggle("is-far-prev", offset < -1);
      slide.classList.toggle("is-far-next", offset > 1);
      slide.hidden = Math.abs(offset) > 2;
      var link = slide.querySelector("a");
      if (link) link.tabIndex = i === index ? 0 : -1;
      indicators[i].setAttribute("aria-pressed", String(i === index));
    });
    previous.disabled = projects.length < 2 || index === 0;
    next.disabled = projects.length < 2 || index === projects.length - 1;
    status.textContent = "Projeto " + (index + 1) + " de " + projects.length + ": " + (projects[index].title || "Iguana+");
  }
  function go(index, instant) {
    index = Math.max(0, Math.min(projects.length - 1, index));
    select(index);
    track.dataset.instant = instant || reduced.matches || document.documentElement.classList.contains("motion-paused") ? "true" : "false";
  }
  previous.addEventListener("click", function () { go(active - 1); });
  next.addEventListener("click", function () { go(active + 1); });
  track.addEventListener("keydown", function (event) {
    var index = active;
    if (event.key === "ArrowRight") index++;
    else if (event.key === "ArrowLeft") index--;
    else if (event.key === "Home") index = 0;
    else if (event.key === "End") index = projects.length - 1;
    else return;
    event.preventDefault();
    go(index);
  });
  track.addEventListener("click", function (event) {
    if (projects.length < 2) return;
    var activeSlide = slides[active];
    var bounds = activeSlide.getBoundingClientRect();
    if (event.clientX < bounds.left && active > 0) go(active - 1);
    if (event.clientX > bounds.right && active < projects.length - 1) go(active + 1);
  });
  window.addEventListener("resize", function () { go(active, true); });
  select(0);
})();
