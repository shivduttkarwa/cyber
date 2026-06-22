(() => {
  "use strict";

  const header = document.querySelector(".site-header");
  const loader = document.querySelector(".page-loader");
  const year = document.querySelector("#current-year");
  const navigation = document.querySelector("#primaryNavigation");
  const menuButton = document.querySelector(".navbar-toggler");
  const desktopMenu = window.matchMedia("(min-width: 992px)");
  const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  let closeMenuTimer;
  const loaderStartedAt = performance.now();
  const loaderMinimumDuration = 2200;
  let loaderHasExited = !loader;
  const loaderExitCallbacks = [];

  const signalLoaderExit = () => {
    if (loaderHasExited) {
      return;
    }

    loaderHasExited = true;
    loaderExitCallbacks.splice(0).forEach((callback) => callback());
  };

  const whenLoaderExits = (callback) => {
    if (loaderHasExited) {
      callback();
      return;
    }

    loaderExitCallbacks.push(callback);
  };

  const hideLoader = () => {
    if (!loader || loader.classList.contains("is-hidden")) {
      signalLoaderExit();
      return;
    }

    loader.classList.add("is-hidden");
    document.body.classList.remove("is-loading");
    signalLoaderExit();
    window.setTimeout(() => loader.remove(), 550);
  };

  if (loader) {
    if (reduceMotion) {
      hideLoader();
    } else {
      const completeLoader = () => {
        if (loader.classList.contains("is-complete")) {
          return;
        }

        const elapsed = performance.now() - loaderStartedAt;
        const remaining = Math.max(0, loaderMinimumDuration - elapsed);

        window.setTimeout(() => {
          loader.classList.add("is-complete");
          signalLoaderExit();
          window.setTimeout(hideLoader, 760);
        }, remaining);
      };

      if (document.readyState === "complete") {
        window.setTimeout(completeLoader, 900);
      } else {
        window.addEventListener(
          "load",
          () => {
            window.setTimeout(completeLoader, 520);
          },
          { once: true }
        );
      }

      window.setTimeout(completeLoader, 2600);
    }
  }

  if (year) {
    year.textContent = new Date().getFullYear();
  }

  const updateHeader = () => {
    header?.classList.toggle("is-scrolled", window.scrollY > window.innerHeight * 0.02);
  };

  updateHeader();
  window.addEventListener("scroll", updateHeader, { passive: true });

  const finishMenuClose = () => {
    if (!navigation || !menuButton) {
      return;
    }

    navigation.classList.remove("is-closing");
    navigation.setAttribute("aria-hidden", "true");
    document.documentElement.classList.remove("menu-open");
  };

  const openMenu = () => {
    if (!navigation || !menuButton || desktopMenu.matches) {
      return;
    }

    window.clearTimeout(closeMenuTimer);
    navigation.classList.remove("is-closing");
    document.documentElement.classList.add("menu-open");
    navigation.setAttribute("aria-hidden", "false");
    menuButton.setAttribute("aria-expanded", "true");
    menuButton.setAttribute("aria-label", "Close navigation");

    requestAnimationFrame(() => {
      navigation.classList.add("is-open");
    });
  };

  const closeMenu = (immediate = false) => {
    if (!navigation || !menuButton) {
      return;
    }

    window.clearTimeout(closeMenuTimer);
    navigation.classList.remove("is-open");
    menuButton.setAttribute("aria-expanded", "false");
    menuButton.setAttribute("aria-label", "Open navigation");

    if (immediate || reduceMotion || desktopMenu.matches) {
      finishMenuClose();
      return;
    }

    navigation.classList.add("is-closing");
    closeMenuTimer = window.setTimeout(finishMenuClose, 720);
  };

  if (navigation && menuButton) {
    menuButton.addEventListener("click", () => {
      if (navigation.classList.contains("is-open")) {
        closeMenu();
      } else {
        openMenu();
      }
    });

    navigation.querySelectorAll("a").forEach((link) => {
      link.addEventListener("click", () => closeMenu());
    });

    document.addEventListener("keydown", (event) => {
      if (event.key === "Escape" && navigation.classList.contains("is-open")) {
        closeMenu();
        menuButton.focus();
      }
    });

    desktopMenu.addEventListener("change", (event) => {
      if (event.matches) {
        closeMenu(true);
        navigation.setAttribute("aria-hidden", "false");
      } else {
        navigation.setAttribute("aria-hidden", "true");
      }
    });

    navigation.setAttribute("aria-hidden", desktopMenu.matches ? "false" : "true");
  }

  if (reduceMotion || !window.gsap || !window.ScrollTrigger) {
    document.documentElement.classList.add("motion-ready");
    return;
  }

  gsap.registerPlugin(ScrollTrigger);

  /*
   * Semantic animation API:
   * data-anim="fade|fade-up|fade-down|from-left|from-right|scale|clip"
   * data-anim-group="fade-up" applies one animation type to direct children.
   * data-hero-item="media|fade|fade-up|fade-down|from-left|from-right|scale"
   */
  const CSAnimations = {
    defaults: {
      duration: 0.78,
      ease: "power3.out",
      batchStagger: 0.09,
      wordStagger: 0.045
    },

    number(value, fallback) {
      const parsed = Number.parseFloat(value);
      return Number.isFinite(parsed) ? parsed : fallback;
    },

    expandGroups() {
      document.querySelectorAll("[data-anim-group]").forEach((group) => {
        const selector = group.dataset.animSelector || ":scope > *";
        const type = group.dataset.animGroup || "fade-up";
        const duration = group.dataset.animDuration;
        const stagger = group.dataset.animStagger;

        group.querySelectorAll(selector).forEach((item) => {
          item.dataset.anim ||= type;
          if (duration && !item.dataset.animDuration) {
            item.dataset.animDuration = duration;
          }
          if (stagger && !item.dataset.animBatchStagger) {
            item.dataset.animBatchStagger = stagger;
          }
        });
      });
    },

    prepare(item) {
      const type = item.dataset.anim || "fade-up";

      const states = {
        fade: { autoAlpha: 0 },
        "fade-up": { autoAlpha: 0, y: 30 },
        "fade-down": { autoAlpha: 0, y: -24 },
        "from-left": { autoAlpha: 0, x: -38 },
        "from-right": { autoAlpha: 0, x: 38 },
        scale: { autoAlpha: 0, scale: 0.96 },
        clip: { clipPath: "inset(0 0 100% 0)" }
      };

      gsap.set(item, {
        ...(states[type] || states["fade-up"]),
        willChange: type === "clip" ? "clip-path" : "transform, opacity"
      });
    },

    animate(item, batchIndex = 0) {
      if (item.dataset.animComplete === "true") {
        return;
      }

      const type = item.dataset.anim || "fade-up";
      const duration = this.number(item.dataset.animDuration, this.defaults.duration);
      const stagger = this.number(
        item.dataset.animBatchStagger,
        this.defaults.batchStagger
      );
      const delay = this.number(item.dataset.animDelay, 0) + batchIndex * stagger;
      const ease = item.dataset.animEase || this.defaults.ease;

      item.classList.add("anim-start");

      const finalState =
        type === "clip"
          ? { clipPath: "inset(0 0 0% 0)" }
          : { autoAlpha: 1, x: 0, y: 0, scale: 1 };

      gsap.to(item, {
        ...finalState,
        duration,
        delay,
        ease,
        onComplete: () => {
          gsap.set(item, {
            clearProps: "transform,opacity,visibility,clipPath,willChange"
          });
          item.dataset.animComplete = "true";
          item.classList.add("anim-complete");
        }
      });
    },

    initBatch() {
      this.expandGroups();

      const items = [
        ...document.querySelectorAll("[data-anim]:not([data-hero-item])")
      ];

      if (!items.length) {
        return;
      }

      items.forEach((item) => this.prepare(item));

      ScrollTrigger.batch(items, {
        start: "top 88%",
        once: true,
        interval: 0.12,
        batchMax: 8,
        onEnter: (batch) => {
          batch.forEach((item, index) => this.animate(item, index));
        }
      });
    },

    heroState(type) {
      const states = {
        media: { autoAlpha: 0, scale: 1.08 },
        fade: { autoAlpha: 0 },
        "fade-up": { autoAlpha: 0, y: 28 },
        "fade-down": { autoAlpha: 0, y: -18 },
        "from-left": { autoAlpha: 0, x: -32 },
        "from-right": { autoAlpha: 0, x: 32 },
        scale: { autoAlpha: 0, scale: 0.96 }
      };

      return states[type] || states["fade-up"];
    },

    initHero() {
      const hero = document.querySelector("[data-anim-hero]");
      const items = [...document.querySelectorAll("[data-hero-item]")];

      if (!hero || !items.length) {
        document.documentElement.classList.add("motion-ready");
        return;
      }

      const timeline = gsap.timeline({
        paused: true,
        defaults: { ease: "power3.out" },
        onStart: () => {
          document.documentElement.classList.add("motion-ready");
          hero.classList.add("anim-start");
        },
        onComplete: () => hero.classList.add("anim-complete")
      });

      items.forEach((item, index) => {
        const type = item.dataset.heroItem || "fade-up";
        const at = this.number(item.dataset.heroAt, index * 0.16);
        const duration = this.number(
          item.dataset.heroDuration,
          type === "media" ? 1.35 : 0.82
        );
        const ease = item.dataset.heroEase || "power3.out";

        gsap.set(item, {
          ...this.heroState(type),
          willChange: "transform, opacity"
        });

        timeline.to(
          item,
          {
            autoAlpha: 1,
            x: 0,
            y: 0,
            scale: 1,
            duration,
            ease,
            onComplete: () => {
              gsap.set(item, {
                clearProps: "transform,opacity,visibility,willChange"
              });
            }
          },
          at
        );
      });

      const play = () => timeline.play(0);

      whenLoaderExits(play);
    },

    initParallax() {
      document.querySelectorAll("[data-anim-parallax]").forEach((item) => {
        const distance = this.number(item.dataset.animParallax, 7);
        const trigger = item.closest("section") || item;

        gsap.fromTo(
          item,
          { yPercent: -distance },
          {
            yPercent: distance,
            ease: "none",
            scrollTrigger: {
              trigger,
              start: "top bottom",
              end: "bottom top",
              scrub: 1
            }
          }
        );
      });
    },

    init() {
      this.initHero();
      this.initBatch();
      this.initParallax();
      ScrollTrigger.refresh();
    }
  };

  window.CSAnimations = CSAnimations;
  CSAnimations.init();

})();
