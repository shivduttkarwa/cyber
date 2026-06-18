(() => {
  "use strict";

  const header = document.querySelector(".site-header");
  const year = document.querySelector("#current-year");
  const navigation = document.querySelector("#primaryNavigation");
  const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  if (year) {
    year.textContent = new Date().getFullYear();
  }

  const updateHeader = () => {
    header?.classList.toggle("is-scrolled", window.scrollY > window.innerHeight * 0.02);
  };

  updateHeader();
  window.addEventListener("scroll", updateHeader, { passive: true });

  document.querySelectorAll("#primaryNavigation .nav-link").forEach((link) => {
    link.addEventListener("click", () => {
      if (window.bootstrap && navigation?.classList.contains("show")) {
        bootstrap.Collapse.getOrCreateInstance(navigation).hide();
      }
    });
  });

  if (reduceMotion || !window.gsap || !window.ScrollTrigger) {
    document.documentElement.classList.add("motion-ready");
    return;
  }

  gsap.registerPlugin(ScrollTrigger);

  const heroTimeline = gsap.timeline({
    defaults: { duration: 0.9, ease: "power3.out" },
    onStart: () => document.documentElement.classList.add("motion-ready")
  });

  heroTimeline
    .from(".hero__media", { autoAlpha: 0, scale: 1.08, duration: 1.35 })
    .from(".hero__title", { autoAlpha: 0, yPercent: 14 }, "-=0.9")
    .from(".hero__footer, .hero__scroll", { autoAlpha: 0, yPercent: 25 }, "-=0.62");

  gsap.utils.toArray(".section-heading, .process__intro, .about__top").forEach((heading) => {
    gsap.from(heading, {
      scrollTrigger: {
        trigger: heading,
        start: "top 84%",
        once: true
      },
      autoAlpha: 0,
      yPercent: 20,
      duration: 0.8,
      ease: "power3.out"
    });
  });

  const revealGroups = [
    [".about", ".about__statement h2, .about__intro, .about__principle"],
    [".project-grid", ".project-card"],
    [".process-list", ".process-step"],
    [".why-panel", ".why-panel__heading, .why-panel__list li"]
  ];

  gsap.from(".service-card", {
    scrollTrigger: {
      trigger: ".service-grid",
      start: "top 82%",
      once: true
    },
    autoAlpha: 0,
    duration: 0.72,
    ease: "power3.out"
  });

  revealGroups.forEach(([trigger, targets]) => {
    gsap.from(targets, {
      scrollTrigger: {
        trigger,
        start: "top 82%",
        once: true
      },
      autoAlpha: 0,
      yPercent: 12,
      duration: 0.72,
      stagger: 0.1,
      ease: "power3.out"
    });
  });

  gsap.from(".contact-card", {
    scrollTrigger: {
      trigger: ".contact-card",
      start: "top 84%",
      once: true
    },
    autoAlpha: 0,
    yPercent: 8,
    scale: 0.985,
    duration: 0.9,
    ease: "power3.out"
  });
})();
