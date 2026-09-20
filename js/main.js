/**
 * APEC VIET NAM 2027 — Application Core
 * Application initialization, state management, scroll handling, and bilingual support
 */

class ApecApp {
  constructor() {
    this.currentLang = 'vi';
    this.audioEnabled = false;
    this.audioContext = null;

    this.init();
  }

  init() {
    window.apecApp = this;

    // 1. Initialize 3D Dual-Canvas Scene (Sky background & Island foreground)
    const skyCanvas = document.getElementById('sky-canvas');
    const islandCanvas = document.getElementById('island-canvas');
    this.scene = new ApecScene(skyCanvas, islandCanvas);

    // 2. Initialize The Centrepiece: True 3D Perspective Ring Carousel
    const ringContainer = document.getElementById('ring-container') || document.getElementById('hero-section');
    this.ringCarousel = new PerspectiveRingCarousel(ringContainer);

    // 3. Initialize Interactions
    this.interaction = new InteractionController(this.scene);

    // 4. Initialize Intro Sequence
    this.intro = new IntroSequencer(this.scene);
    this.intro.play();

    // 5. Bind UI Controls & Smooth Scroll GSAP Transitions
    this.bindUIControls();
    this.initSmoothScrollAndGSAP();
    this.initHeaderScroll();

    // 6. Start Render Loop
    this.animate = this.animate.bind(this);
    requestAnimationFrame(this.animate);

    // 7. Multi-Stage Layout & Canvas Synchronization (Eliminates Initial Right Gap & Aspect Shift)
    this.initLayoutSync();
  }

  initLayoutSync() {
    const sync = () => {
      if (this.scene && this.scene.onResize) {
        this.scene.onResize();
      }
      if (this.ringCarousel && this.ringCarousel.onResize) {
        this.ringCarousel.onResize();
      }
      if (typeof ScrollTrigger !== 'undefined') {
        ScrollTrigger.refresh();
      }
    };

    // Stage 1: Immediate synchronization on constructor completion
    sync();

    // Stage 2: Next frame when DOM render tree is active
    requestAnimationFrame(sync);

    // Stage 3: Window load event when all external stylesheets and Google Fonts have arrived
    if (document.readyState === 'complete') {
      sync();
    } else {
      window.addEventListener('load', sync, { once: true });
    }

    // Stage 4: Staggered timers to catch any delayed CSS reflows or scrollbar appearances
    setTimeout(sync, 50);
    setTimeout(sync, 250);
    setTimeout(sync, 600);
  }

  bindUIControls() {
    // Language Switcher
    const langBtns = document.querySelectorAll('.lang-btn');
    langBtns.forEach(btn => {
      btn.addEventListener('click', (e) => {
        const lang = e.currentTarget.dataset.lang;
        this.setLanguage(lang);
      });
    });

    // Mobile Menu Toggle
    const mobileMenuBtn = document.getElementById('mobile-menu-toggle');
    const mobileNav = document.getElementById('mobile-nav-drawer');
    if (mobileMenuBtn && mobileNav) {
      mobileMenuBtn.addEventListener('click', () => {
        mobileNav.classList.toggle('active');
        mobileMenuBtn.classList.toggle('active');
      });
    }

    // Destination Category Pills Click State
    const destPills = document.querySelectorAll('.destination-pill');
    destPills.forEach(pill => {
      pill.addEventListener('click', (e) => {
        e.preventDefault();
        destPills.forEach(p => p.classList.remove('is-active'));
        pill.classList.add('is-active');
      });
    });

    // Multimedia Category Filter Tabs
    const mediaPills = document.querySelectorAll('.media-pill');
    const mediaCards = document.querySelectorAll('.media-card');
    mediaPills.forEach(pill => {
      pill.addEventListener('click', () => {
        const cat = pill.dataset.category;
        mediaPills.forEach(p => p.classList.remove('is-active'));
        pill.classList.add('is-active');

        mediaCards.forEach(card => {
          if (cat === 'all' || card.dataset.mediaType === cat) {
            card.classList.remove('is-hidden');
          } else {
            card.classList.add('is-hidden');
          }
        });
      });
    });
  }

  initHeaderScroll() {
    const header = document.querySelector('.main-header');
    if (!header) return;

    const onScroll = () => {
      const scrollY = (this.lenis && typeof this.lenis.scroll === 'number')
        ? this.lenis.scroll
        : (window.scrollY || document.documentElement.scrollTop || 0);

      if (scrollY > 30) {
        header.classList.remove('is-transparent');
      } else {
        header.classList.add('is-transparent');
      }
    };

    window.addEventListener('scroll', onScroll, { passive: true });
    if (this.lenis) {
      this.lenis.on('scroll', onScroll);
    }
    onScroll();
  }

  initSmoothScrollAndGSAP() {
    // 1. Initialize Lenis Smooth Scroll
    if (typeof Lenis !== 'undefined') {
      this.lenis = new Lenis({
        duration: 1.25,
        easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
        smoothWheel: true,
        wheelMultiplier: 1.0,
        touchMultiplier: 1.5,
      });

      // Synchronize Lenis with GSAP ScrollTrigger
      if (typeof gsap !== 'undefined' && typeof ScrollTrigger !== 'undefined') {
        gsap.registerPlugin(ScrollTrigger);
        this.lenis.on('scroll', ScrollTrigger.update);
        gsap.ticker.add((time) => {
          this.lenis.raf(time * 1000);
        });
        gsap.ticker.lagSmoothing(0);
      } else {
        const raf = (time) => {
          this.lenis.raf(time);
          requestAnimationFrame(raf);
        };
        requestAnimationFrame(raf);
      }

      // Forward Lenis scroll updates to 3D scene
      this.lenis.on('scroll', (e) => {
        if (this.scene && this.scene.setScroll) {
          this.scene.setScroll(e.scroll);
        }
      });
    } else {
      // Fallback scroll handling if Lenis not loaded
      window.addEventListener('scroll', () => {
        if (this.scene && this.scene.setScroll) {
          this.scene.setScroll(window.scrollY);
        }
      }, { passive: true });
    }

    // 2. Universal Smooth Scroll for all in-page anchor links (CTA, scroll indicator, nav)
    const smoothLinks = document.querySelectorAll('a[href^="#"]');
    smoothLinks.forEach(link => {
      link.addEventListener('click', (e) => {
        const targetId = link.getAttribute('href');
        if (!targetId || targetId === '#') return;
        const targetEl = document.querySelector(targetId);
        if (targetEl) {
          e.preventDefault();
          if (this.lenis) {
            this.lenis.scrollTo(targetEl, { offset: -20, duration: 1.4 });
          } else {
            targetEl.scrollIntoView({ behavior: 'smooth', block: 'start' });
          }
        }
      });
    });

    // 3. GSAP ScrollTrigger: Transition Background only
    if (typeof gsap !== 'undefined' && typeof ScrollTrigger !== 'undefined') {
      const heroEl = document.getElementById('hero-section');

      // Seamless Background Transition: Hero sky -> Next section white
      gsap.to('.page-bg-next', {
        opacity: 1,
        ease: 'none',
        scrollTrigger: {
          trigger: heroEl,
          start: 'top top',
          end: 'bottom top',
          scrub: true,
        }
      });
    }

    // Support automated test URL query parameter (e.g. ?scroll=600)
    const urlParams = new URLSearchParams(window.location.search);
    if (urlParams.has('scroll')) {
      const scrollY = parseInt(urlParams.get('scroll'), 10);
      setTimeout(() => {
        if (this.lenis) {
          this.lenis.scrollTo(scrollY, { immediate: true });
        } else {
          window.scrollTo(0, scrollY);
        }
        if (typeof ScrollTrigger !== 'undefined') ScrollTrigger.update();
        if (this.scene && this.scene.setScroll) this.scene.setScroll(scrollY);
      }, 300);
    }
  }

  setLanguage(lang) {
    this.currentLang = lang;
    document.documentElement.lang = lang;

    // Update active button state
    document.querySelectorAll('.lang-btn').forEach(b => {
      b.classList.toggle('active', b.dataset.lang === lang);
    });

    // Update text content with data-i18n attributes
    const elements = document.querySelectorAll('[data-i18n-vi]');
    elements.forEach(el => {
      const text = lang === 'vi' ? el.getAttribute('data-i18n-vi') : el.getAttribute('data-i18n-en');
      if (text) {
        if (text.includes('<br>') || text.includes('<span')) {
          el.innerHTML = text;
        } else {
          el.textContent = text;
        }
      }
    });

    // Update flag name labels on perspective ring carousel
    if (this.ringCarousel && this.ringCarousel.updateLanguage) {
      this.ringCarousel.updateLanguage(lang);
    }

    // Update member economy pills in roster
    document.querySelectorAll('.economy-pill-name').forEach(el => {
      const text = lang === 'vi' ? el.getAttribute('data-vi') : el.getAttribute('data-en');
      if (text) el.textContent = text;
    });

    // Update open modal content if currently active
    if (this.interaction && this.interaction.updateModalLanguage) {
      this.interaction.updateModalLanguage();
    }

    // Update buttons / placeholders
    const cta = document.getElementById('explore-cta-btn');
    if (cta) {
      cta.innerHTML = lang === 'vi' 
        ? '<span>KHÁM PHÁ APEC 2027</span> <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M5 12h14M12 5l7 7-7 7"/></svg>'
        : '<span>EXPLORE APEC 2027</span> <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M5 12h14M12 5l7 7-7 7"/></svg>';
    }
  }

  animate() {
    this.scene.render();
    requestAnimationFrame(this.animate);
  }
}

// Bootstrap on DOM ready
document.addEventListener('DOMContentLoaded', () => {
  window.apecApp = new ApecApp();
});
