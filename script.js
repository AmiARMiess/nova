/* ============================================================
   Nova — Landing Page Scripts
   ============================================================ */
(function () {
  "use strict";

  const prefersReducedMotion = window.matchMedia(
    "(prefers-reduced-motion: reduce)"
  ).matches;

  /* ---------- Navbar: scroll state ---------- */
  const navbar = document.getElementById("navbar");

  const onScroll = () => {
    navbar.classList.toggle("scrolled", window.scrollY > 24);
  };
  window.addEventListener("scroll", onScroll, { passive: true });
  onScroll();

  /* ---------- Mobile menu ---------- */
  const navToggle = document.getElementById("navToggle");
  const navLinks = document.getElementById("navLinks");

  const closeMenu = () => {
    navToggle.classList.remove("open");
    navLinks.classList.remove("open");
    navToggle.setAttribute("aria-expanded", "false");
  };

  navToggle.addEventListener("click", () => {
    const isOpen = navLinks.classList.toggle("open");
    navToggle.classList.toggle("open", isOpen);
    navToggle.setAttribute("aria-expanded", String(isOpen));
  });

  navLinks.querySelectorAll("a").forEach((link) =>
    link.addEventListener("click", closeMenu)
  );

  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape") closeMenu();
  });

  /* ---------- Scroll-reveal animations ---------- */
  const revealEls = document.querySelectorAll(".reveal");

  if (prefersReducedMotion || !("IntersectionObserver" in window)) {
    revealEls.forEach((el) => el.classList.add("visible"));
  } else {
    const revealObserver = new IntersectionObserver(
      (entries, observer) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("visible");
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.15, rootMargin: "0px 0px -40px 0px" }
    );

    revealEls.forEach((el) => revealObserver.observe(el));
  }

  /* ---------- Animated counters ---------- */
  const counters = document.querySelectorAll("[data-count]");

  const animateCounter = (el) => {
    const target = Number(el.dataset.count) || 0;
    const prefix = el.dataset.prefix || "";
    const duration = 1600;
    const start = performance.now();

    const tick = (now) => {
      const progress = Math.min((now - start) / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3); // easeOutCubic
      const value = Math.round(target * eased);
      el.textContent = prefix + value.toLocaleString("en-US");
      if (progress < 1) requestAnimationFrame(tick);
    };

    requestAnimationFrame(tick);
  };

  if (prefersReducedMotion || !("IntersectionObserver" in window)) {
    counters.forEach((el) => {
      el.textContent =
        (el.dataset.prefix || "") +
        (Number(el.dataset.count) || 0).toLocaleString("en-US");
    });
  } else {
    const counterObserver = new IntersectionObserver(
      (entries, observer) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            animateCounter(entry.target);
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.5 }
    );

    counters.forEach((el) => counterObserver.observe(el));
  }

  /* ---------- Feature card cursor glow ---------- */
  document.querySelectorAll(".feature-card").forEach((card) => {
    card.addEventListener("pointermove", (e) => {
      const rect = card.getBoundingClientRect();
      card.style.setProperty("--mx", `${e.clientX - rect.left}px`);
      card.style.setProperty("--my", `${e.clientY - rect.top}px`);
    });
  });

  /* ---------- Button ripple effect ---------- */
  document.querySelectorAll(".btn").forEach((btn) => {
    btn.addEventListener("click", (e) => {
      if (prefersReducedMotion) return;

      const rect = btn.getBoundingClientRect();
      const size = Math.max(rect.width, rect.height);
      const ripple = document.createElement("span");
      ripple.className = "ripple";
      ripple.style.width = ripple.style.height = `${size}px`;
      ripple.style.left = `${e.clientX - rect.left - size / 2}px`;
      ripple.style.top = `${e.clientY - rect.top - size / 2}px`;

      btn.appendChild(ripple);
      ripple.addEventListener("animationend", () => ripple.remove());
    });
  });

  /* ---------- Pricing: billing toggle ---------- */
  const billingSwitch = document.getElementById("billingSwitch");
  const labelMonthly = document.getElementById("labelMonthly");
  const labelAnnual = document.getElementById("labelAnnual");
  const amounts = document.querySelectorAll(".price .amount");

  billingSwitch.addEventListener("click", () => {
    const isAnnual = billingSwitch.getAttribute("aria-checked") !== "true";
    billingSwitch.setAttribute("aria-checked", String(isAnnual));

    labelMonthly.classList.toggle("active", !isAnnual);
    labelAnnual.classList.toggle("active", isAnnual);

    amounts.forEach((el) => {
      const price = isAnnual ? el.dataset.annual : el.dataset.monthly;
      el.textContent = `$${price}`;
    });
  });

  /* ---------- FAQ accordion ---------- */
  document.querySelectorAll(".faq-item").forEach((item) => {
    const question = item.querySelector(".faq-question");
    const answer = item.querySelector(".faq-answer");

    question.addEventListener("click", () => {
      const isOpen = item.classList.contains("open");

      // close others (single-open accordion)
      document.querySelectorAll(".faq-item.open").forEach((openItem) => {
        if (openItem !== item) {
          openItem.classList.remove("open");
          openItem
            .querySelector(".faq-question")
            .setAttribute("aria-expanded", "false");
          openItem.querySelector(".faq-answer").style.maxHeight = null;
        }
      });

      item.classList.toggle("open", !isOpen);
      question.setAttribute("aria-expanded", String(!isOpen));
      answer.style.maxHeight = isOpen ? null : answer.scrollHeight + "px";
    });
  });

  /* ---------- CTA form (demo validation) ---------- */
  const ctaForm = document.getElementById("ctaForm");
  const emailInput = document.getElementById("emailInput");
  const ctaNote = document.getElementById("ctaNote");
  const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

  ctaForm.addEventListener("submit", (e) => {
    e.preventDefault();
    const email = emailInput.value.trim();

    if (!emailPattern.test(email)) {
      emailInput.classList.add("error");
      ctaNote.classList.remove("success");
      ctaNote.textContent = "Please enter a valid email address.";
      emailInput.focus();
      return;
    }

    emailInput.classList.remove("error");
    ctaNote.classList.add("success");
    ctaNote.textContent =
      "🎉 You're in! Check your inbox to activate your free trial.";
    ctaForm.reset();
  });

  emailInput.addEventListener("input", () => {
    emailInput.classList.remove("error");
  });

  /* ---------- Footer year ---------- */
  const yearEl = document.getElementById("year");
  if (yearEl) yearEl.textContent = String(new Date().getFullYear());
})();
