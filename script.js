 /* ==========================================================================
   RENDA EXTRA PELO CELULAR — LANDING PAGE
   JavaScript puro, sem dependências externas.
   ========================================================================== */

(function () {
  "use strict";

  /* ----------------------------------------------------------------------
     LINK DE CHECKOUT — ÚNICO PONTO DE EDIÇÃO
     Se o link de checkout mudar, troque APENAS o valor abaixo.
     ---------------------------------------------------------------------- */
  var CHECKOUT_URL = "https://pay.cakto.com.br/9wv4sd7_1015912";

  document.querySelectorAll(".js-checkout-link").forEach(function (link) {
    link.setAttribute("href", CHECKOUT_URL);
  });

  /* ---------------------------------------------------------------------
     Dispara o evento InitiateCheckout do Meta Pixel antes de redirecionar.
     Um pequeno atraso garante que o evento seja enviado antes da navegação
     (o Pixel usa beacon/fetch assíncrono, então a troca de página pode
     cortar a requisição se não houver essa margem).
     --------------------------------------------------------------------- */
  document.querySelectorAll(".js-checkout-link").forEach(function (link) {
    link.addEventListener("click", function (e) {
      e.preventDefault();
      var destination = link.getAttribute("href") || CHECKOUT_URL;

      if (typeof fbq === "function") {
        fbq("track", "InitiateCheckout");
      }

      window.setTimeout(function () {
        window.location.href = destination;
      }, 180);
    });
  });

  /* ---------- Ano no rodapé ---------- */
  var yearEl = document.getElementById("year");
  if (yearEl) yearEl.textContent = new Date().getFullYear();

  /* ---------- Header: sombra ao rolar ---------- */
  var header = document.getElementById("siteHeader");
  function onScrollHeader() {
    if (!header) return;
    if (window.scrollY > 8) header.classList.add("scrolled");
    else header.classList.remove("scrolled");
  }
  document.addEventListener("scroll", onScrollHeader, { passive: true });
  onScrollHeader();

  /* ---------- Contador animado do saldo no mockup do hero ---------- */
  var balanceEl = document.getElementById("balanceCounter");
  var prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  function formatBRL(value) {
    return "R$ " + value.toFixed(2).replace(".", ",").replace(/\B(?=(\d{3})+(?!\d))/g, ".");
  }

  function animateBalance() {
    if (!balanceEl) return;
    var target = 227;
    var duration = 1800;
    var start = null;

    function step(timestamp) {
      if (!start) start = timestamp;
      var progress = Math.min((timestamp - start) / duration, 1);
      var eased = 1 - Math.pow(1 - progress, 3);
      balanceEl.textContent = formatBRL(eased * target);
      if (progress < 1) {
        window.requestAnimationFrame(step);
      } else {
        balanceEl.textContent = formatBRL(target);
      }
    }
    window.requestAnimationFrame(step);
  }

  var phoneMock = document.querySelector(".phone-mock--hero");
  if (phoneMock) {
    if (prefersReducedMotion || !("IntersectionObserver" in window)) {
      animateBalance();
    } else {
      var counterObserver = new IntersectionObserver(
        function (entries) {
          entries.forEach(function (entry) {
            if (entry.isIntersecting) {
              animateBalance();
              counterObserver.unobserve(entry.target);
            }
          });
        },
        { threshold: 0.5 }
      );
      counterObserver.observe(phoneMock);
    }
  }

  /* ---------- Accordion FAQ ---------- */
  var accordionItems = document.querySelectorAll(".accordion-item");
  accordionItems.forEach(function (item) {
    var trigger = item.querySelector(".accordion-trigger");
    if (!trigger) return;
    trigger.addEventListener("click", function () {
      var isOpen = item.classList.contains("open");
      accordionItems.forEach(function (other) {
        if (other !== item) {
          other.classList.remove("open");
          var otherTrigger = other.querySelector(".accordion-trigger");
          if (otherTrigger) otherTrigger.setAttribute("aria-expanded", "false");
        }
      });
      item.classList.toggle("open", !isOpen);
      trigger.setAttribute("aria-expanded", String(!isOpen));
    });
  });

  /* ---------- Smooth anchor scroll ---------- */
  document.querySelectorAll('a[href^="#"]').forEach(function (anchor) {
    anchor.addEventListener("click", function (e) {
      var targetId = this.getAttribute("href");
      if (targetId.length < 2) return;
      var targetEl = document.querySelector(targetId);
      if (!targetEl) return;
      e.preventDefault();
      targetEl.scrollIntoView({ behavior: prefersReducedMotion ? "auto" : "smooth", block: "start" });
    });
  });
})();
