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

  const homeHero = document.querySelector(".hero");
  const servicePageHero = document.querySelector(".service-page-hero");
  const teamHero = document.querySelector(".team-hero");

  if (homeHero) {
    const heroTimeline = gsap.timeline({
      defaults: { duration: 0.9, ease: "power3.out" },
      onStart: () => document.documentElement.classList.add("motion-ready")
    });

    heroTimeline
      .from(".hero__media", { autoAlpha: 0, scale: 1.08, duration: 1.35 })
      .from(".hero__title", { autoAlpha: 0, yPercent: 14 }, "-=0.9")
      .from(".hero__footer, .hero__scroll", { autoAlpha: 0, yPercent: 25 }, "-=0.62");
  } else if (servicePageHero) {
    const serviceHeroTimeline = gsap.timeline({
      defaults: { duration: 0.9, ease: "power3.out" },
      onStart: () => document.documentElement.classList.add("motion-ready")
    });

    serviceHeroTimeline
      .from(".service-page-hero__media", { autoAlpha: 0, scale: 1.06, duration: 1.3 })
      .from(".service-page-hero h1", { yPercent: 10 }, "-=0.85")
      .from(".service-page-hero__bottom", { yPercent: 25 }, "-=0.6");
  } else if (teamHero) {
    const teamHeroTimeline = gsap.timeline({
      defaults: { duration: 0.9, ease: "power3.out" },
      onStart: () => document.documentElement.classList.add("motion-ready")
    });

    teamHeroTimeline
      .from(".team-hero__media", { autoAlpha: 0, scale: 1.06, duration: 1.3 })
      .from(".team-hero__content .eyebrow", { yPercent: 40 }, "-=0.85")
      .from(".team-hero__content h1", { yPercent: 12 }, "-=0.65")
      .from(".team-hero__content p, .team-hero__scroll", { yPercent: 20 }, "-=0.6");
  } else {
    document.documentElement.classList.add("motion-ready");
  }

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

  if (document.querySelector(".service-grid")) {
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
  }

  revealGroups.forEach(([trigger, targets]) => {
    if (!document.querySelector(trigger)) {
      return;
    }

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

  if (document.querySelector(".service-index")) {
    gsap.from(".service-index__heading > *, .service-index__nav a", {
      scrollTrigger: {
        trigger: ".service-index",
        start: "top 82%",
        once: true
      },
      yPercent: 16,
      duration: 0.72,
      stagger: 0.08,
      ease: "power3.out"
    });
  }

  gsap.utils.toArray(".service-chapter").forEach((chapter) => {
    gsap.from(
      chapter.querySelectorAll(".service-chapter__label, .service-chapter h2, .service-chapter__body"),
      {
        scrollTrigger: {
          trigger: chapter,
          start: "top 78%",
          once: true
        },
        yPercent: 10,
        duration: 0.82,
        stagger: 0.1,
        ease: "power3.out"
      }
    );
  });

  if (document.querySelector(".service-bridge__inner")) {
    gsap.from(".service-bridge__inner > *", {
      scrollTrigger: {
        trigger: ".service-bridge",
        start: "top 80%",
        once: true
      },
      yPercent: 15,
      duration: 0.8,
      stagger: 0.12,
      ease: "power3.out"
    });
  }

  if (document.querySelector(".team-intro")) {
    gsap.from(
      ".team-intro__meta, .team-intro__statement h2, .team-intro__copy p",
      {
        scrollTrigger: {
          trigger: ".team-intro",
          start: "top 82%",
          once: true
        },
        yPercent: 14,
        duration: 0.8,
        stagger: 0.1,
        ease: "power3.out"
      }
    );
  }

  if (document.querySelector(".founder__layout")) {
    gsap.from(".founder__identity, .founder__story > *", {
      scrollTrigger: {
        trigger: ".founder",
        start: "top 80%",
        once: true
      },
      yPercent: 12,
      duration: 0.82,
      stagger: 0.12,
      ease: "power3.out"
    });
  }

  if (document.querySelector(".team-disciplines__list")) {
    gsap.from(".team-disciplines__heading, .team-disciplines__list article", {
      scrollTrigger: {
        trigger: ".team-disciplines",
        start: "top 82%",
        once: true
      },
      yPercent: 12,
      duration: 0.76,
      stagger: 0.08,
      ease: "power3.out"
    });
  }

  if (document.querySelector(".team-principles__layout")) {
    gsap.from(".team-principles__heading, .team-principles__list > div", {
      scrollTrigger: {
        trigger: ".team-principles",
        start: "top 82%",
        once: true
      },
      yPercent: 12,
      duration: 0.76,
      stagger: 0.08,
      ease: "power3.out"
    });
  }

})();
