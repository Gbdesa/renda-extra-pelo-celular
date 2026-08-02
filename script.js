/* ==========================================================================
   RENDA EXTRA PELO CELULAR — LANDING PAGE
   JavaScript puro, sem dependências externas.
   ========================================================================== */

(function () {
  "use strict";

  /* ---------- Ano no rodapé ---------- */
  var yearEl = document.getElementById("year");
  if (yearEl) yearEl.textContent = new Date().getFullYear();

  /* ---------- Header: sombra/blur ao rolar ---------- */
  var header = document.getElementById("siteHeader");
  function onScrollHeader() {
    if (!header) return;
    if (window.scrollY > 8) {
      header.classList.add("scrolled");
    } else {
      header.classList.remove("scrolled");
    }
  }
  document.addEventListener("scroll", onScrollHeader, { passive: true });
  onScrollHeader();

  /* ---------- Scroll reveal (Intersection Observer) ---------- */
  var revealEls = document.querySelectorAll(".reveal");
  var prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  if (prefersReducedMotion || !("IntersectionObserver" in window)) {
    revealEls.forEach(function (el) { el.classList.add("in-view"); });
  } else {
    var revealObserver = new IntersectionObserver(
      function (entries) {
        entries.forEach(function (entry) {
          if (entry.isIntersecting) {
            entry.target.classList.add("in-view");
            revealObserver.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.14, rootMargin: "0px 0px -40px 0px" }
    );
    revealEls.forEach(function (el) { revealObserver.observe(el); });
  }

  /* ---------- Contador animado do saldo no mockup do hero ---------- */
  var balanceEl = document.getElementById("balanceCounter");
  var graphLine = document.getElementById("graphLine");

  function formatBRL(value) {
    return "R$ " + value.toFixed(2).replace(".", ",").replace(/\B(?=(\d{3})+(?!\d))/g, ".");
  }

  function animateBalance() {
    if (!balanceEl) return;
    var target = 100;
    var duration = 1800;
    var start = null;

    function step(timestamp) {
      if (!start) start = timestamp;
      var progress = Math.min((timestamp - start) / duration, 1);
      var eased = 1 - Math.pow(1 - progress, 3); /* ease-out cubic */
      var current = eased * target;
      balanceEl.textContent = formatBRL(current);
      if (progress < 1) {
        window.requestAnimationFrame(step);
      } else {
        balanceEl.textContent = formatBRL(target);
      }
    }
    window.requestAnimationFrame(step);
  }

  var phoneMock = document.querySelector(".phone-mock");
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

      /* fecha os outros itens abertos (comportamento estilo FAQ premium) */
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

  /* ---------- Smooth anchor scroll (fallback para navegadores sem CSS scroll-behavior) ---------- */
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
