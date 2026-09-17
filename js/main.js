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

    // 5. Bind UI Controls
    this.bindUIControls();
    this.bindScrollHandling();

    // 6. Start Render Loop
    this.animate = this.animate.bind(this);
    requestAnimationFrame(this.animate);
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

    // Smooth Scroll explore CTA
    const ctaBtn = document.getElementById('explore-cta-btn');
    if (ctaBtn) {
      ctaBtn.addEventListener('click', (e) => {
        e.preventDefault();
        const nextSec = document.getElementById('summit-pillars');
        if (nextSec) {
          nextSec.scrollIntoView({ behavior: 'smooth' });
        }
      });
    }

    // Mobile Menu Toggle
    const mobileMenuBtn = document.getElementById('mobile-menu-toggle');
    const mobileNav = document.getElementById('mobile-nav-drawer');
    if (mobileMenuBtn && mobileNav) {
      mobileMenuBtn.addEventListener('click', () => {
        mobileNav.classList.toggle('active');
        mobileMenuBtn.classList.toggle('active');
      });
    }
  }

  bindScrollHandling() {
    let ticking = false;

    window.addEventListener('scroll', () => {
      if (!ticking) {
        window.requestAnimationFrame(() => {
          const scrollY = window.scrollY;
          const heroHeight = window.innerHeight;
          const progress = Math.min(1.0, scrollY / (heroHeight * 0.8));

          // Send scroll progression to 3D scene
          this.scene.setScrollProgress(progress);

          // Hero content subtle parallax fade
          const heroContent = document.querySelector('.hero-content');
          if (heroContent) {
            heroContent.style.transform = `translate3d(0, ${-scrollY * 0.35}px, 0)`;
            heroContent.style.opacity = Math.max(0, 1 - progress * 1.5);
          }

          ticking = false;
        });
        ticking = true;
      }
    }, { passive: true });
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
        el.textContent = text;
      }
    });

    // Update flag name labels on perspective ring carousel
    if (this.ringCarousel && this.ringCarousel.updateLanguage) {
      this.ringCarousel.updateLanguage(lang);
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
