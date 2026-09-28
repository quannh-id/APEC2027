/**
 * APEC VIET NAM 2027 — Application Core (Version 2 for index-2.html)
 * Lightweight & Specialized for Hero Version 2:
 * - Omits Flags Ring and Island Sphere
 * - Preserves glowing Podium Stage
 * - Features Interactive 3D Tilt News Card on Podium
 * - Preserves 100% full site functionality (Bilingual, Lenis, ScrollTrigger, Modals, Filters)
 */

class ApecAppV2 {
  constructor() {
    this.currentLang = 'vi';
    this.init();
  }

  init() {
    window.apecApp = this;

    // 1. Initialize Background Sky Canvas Only (No Sphere, No Flags Ring)
    this.initSkyScene();

    // 2. Initialize 3D Panorama Swiper Slider on Podium
    this.initPanoramaSwiper();

    // 3. Bind UI Controls (Language, Mobile Drawer, Filters)
    this.bindUIControls();

    // 4. Initialize Smooth Scrolling & GSAP Background Transitions
    this.initSmoothScrollAndGSAP();
    this.initHeaderScroll();

    // 5. Initialize Economy Modal Interactions
    this.initEconomyInteractions();

    // 6. Start Lightweight Render Loop for Sky
    this.animate = this.animate.bind(this);
    requestAnimationFrame(this.animate);
  }

  initSkyScene() {
    const skyCanvas = document.getElementById('sky-canvas');
    if (!skyCanvas || typeof THREE === 'undefined' || typeof ApecSky === 'undefined') {
      return;
    }

    const width = window.innerWidth;
    const height = window.innerHeight;

    this.skyScene = new THREE.Scene();

    const cfg = (window.APEC_CONFIG && window.APEC_CONFIG.scene) ? window.APEC_CONFIG.scene : {
      cameraFov: 42,
      cameraNear: 0.1,
      cameraFar: 1000,
      cameraBasePos: { x: 0, y: 1.5, z: 18.5 },
      cameraBaseLookAt: { x: 0, y: 0.2, z: 0 },
      lighting: {
        sunColor: 0xfffaed,
        sunIntensity: 1.45,
        sunPos: { x: 12, y: 18, z: 15 },
        ambientColor: 0x93c5fd,
        ambientIntensity: 0.85,
        hemiSky: 0xdbeafe,
        hemiGround: 0xbfdbfe,
        hemiIntensity: 0.65
      }
    };

    this.camera = new THREE.PerspectiveCamera(cfg.cameraFov, width / height, cfg.cameraNear, cfg.cameraFar);
    this.camera.position.set(cfg.cameraBasePos.x, cfg.cameraBasePos.y, cfg.cameraBasePos.z);
    this.camera.lookAt(cfg.cameraBaseLookAt.x, cfg.cameraBaseLookAt.y, cfg.cameraBaseLookAt.z);

    // Directional Sun
    const sunLight = new THREE.DirectionalLight(cfg.lighting.sunColor, cfg.lighting.sunIntensity);
    sunLight.position.set(cfg.lighting.sunPos.x, cfg.lighting.sunPos.y, cfg.lighting.sunPos.z);
    this.skyScene.add(sunLight);

    // Ambient Lighting
    const ambientLight = new THREE.AmbientLight(cfg.lighting.ambientColor, cfg.lighting.ambientIntensity);
    this.skyScene.add(ambientLight);

    // Three.js Sky Renderer
    const isMobile = /iPhone|iPad|iPod|Android/i.test(navigator.userAgent);
    const maxPr = isMobile ? 1.5 : Math.min(window.devicePixelRatio || 1, 2.0);

    this.skyRenderer = new THREE.WebGLRenderer({
      canvas: skyCanvas,
      powerPreference: 'high-performance',
      antialias: true,
      alpha: false
    });
    this.skyRenderer.setPixelRatio(maxPr);
    this.skyRenderer.setSize(width, height);
    this.skyRenderer.outputEncoding = THREE.sRGBEncoding;

    // Atmospheric Clouds & Sky Dome
    this.sky = new ApecSky(this.skyScene);
    this.clock = new THREE.Clock();
    this.mouseParallax = { x: 0, y: 0, targetX: 0, targetY: 0 };

    window.addEventListener('resize', () => {
      const w = window.innerWidth;
      const h = window.innerHeight;
      this.camera.aspect = w / h;
      this.camera.updateProjectionMatrix();
      if (this.skyRenderer) {
        this.skyRenderer.setSize(w, h);
      }
    });

    window.addEventListener('mousemove', (e) => {
      const nx = (e.clientX / window.innerWidth - 0.5) * 2;
      const ny = -(e.clientY / window.innerHeight - 0.5) * 2;
      this.mouseParallax.targetX = nx;
      this.mouseParallax.targetY = ny;
    }, { passive: true });
  }

  initPanoramaSwiper() {
    const swiperEl = document.querySelector('.hero-panorama-swiper');
    if (!swiperEl || typeof Swiper === 'undefined') return;

    // Authentic UI Initiative Panorama Algorithm (https://panorama-slider.uiinitiative.com/)
    // Slides do not overlap, sit side-by-side, and curve inward into a smooth cylindrical panorama
    const panoramaRotate = 20; // Rotation angle in degrees
    const panoramaDepth = 120; // Depth perspective offset
    const o = (panoramaRotate * Math.PI) / 180 / 2;
    const a = 1 / (180 / panoramaRotate);

    const updatePanorama = (swiper) => {
      const slides = swiper.slides;
      if (!slides || !slides.length) return;

      for (let d = 0; d < slides.length; d += 1) {
        const slide = slides[d];
        const progress = slide.progress;
        if (typeof progress === 'undefined') continue;

        const slideSize = (swiper.slidesSizesGrid && swiper.slidesSizesGrid[d])
          ? swiper.slidesSizesGrid[d]
          : slide.offsetWidth;

        const v = progress; // centeredSlides is true
        const S = 1 - Math.cos(v * a * Math.PI);
        const C = v * (slideSize / 3) * S;
        const c = v * panoramaRotate;
        const m = (slideSize * 0.5 / Math.sin(o)) * S - panoramaDepth;

        slide.style.transform = `translateX(${C}px) translateZ(${m}px) rotateY(${c}deg)`;
      }
    };

    this.heroSwiper = new Swiper('.hero-panorama-swiper', {
      slidesPerView: 'auto',
      centeredSlides: true,
      spaceBetween: 24,
      grabCursor: true,
      loop: true,
      speed: 650,
      slideToClickedSlide: false,
      watchSlidesProgress: true,
      touchRatio: 1.15,
      longSwipesRatio: 0.15,
      threshold: 5,
      autoplay: {
        delay: 5000,
        disableOnInteraction: true,
      },
      keyboard: {
        enabled: true,
      },
      navigation: {
        nextEl: '.hero-swiper-next',
        prevEl: '.hero-swiper-prev',
      },
      pagination: {
        el: '.hero-swiper-pagination',
        clickable: true,
      },
      on: {
        init: function () {
          updatePanorama(this);
        },
        progress: function () {
          updatePanorama(this);
        },
        setTransition: function (swiper, duration) {
          const d = typeof duration === 'number' ? duration : 0;
          swiper.slides.forEach((slide) => {
            slide.style.transitionDuration = `${d}ms`;
          });
        },
        transitionEnd: function () {
          if (this.slides) {
            this.slides.forEach((slide) => {
              slide.style.transitionDuration = '0ms';
            });
          }
        },
        resize: function () {
          updatePanorama(this);
        },
      }
    });
  }

  bindUIControls() {
    // Language Dropdown Selector (6 languages)
    const langDropdown = document.getElementById('header-lang-dropdown');
    const langDropdownBtn = document.getElementById('lang-dropdown-btn');
    const langDropdownItems = document.querySelectorAll('.lang-dropdown-item');
    const currentFlagEl = document.getElementById('lang-flag-current');
    const currentNameEl = document.getElementById('lang-name-current');

    if (langDropdownBtn && langDropdown) {
      langDropdownBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        const isOpen = langDropdown.classList.toggle('is-open');
        langDropdownBtn.setAttribute('aria-expanded', isOpen);
      });

      langDropdownItems.forEach(item => {
        item.addEventListener('click', (e) => {
          e.stopPropagation();
          const lang = item.dataset.lang;
          const flagSvg = item.querySelector('.lang-flag-box')?.innerHTML || '';
          const nameText = item.querySelector('.lang-item-label')?.textContent.trim() || '';

          if (currentFlagEl && flagSvg) currentFlagEl.innerHTML = flagSvg;
          if (currentNameEl && nameText) currentNameEl.textContent = nameText;

          langDropdownItems.forEach(i => {
            const isMatch = i.dataset.lang === lang;
            i.classList.toggle('active', isMatch);
            i.setAttribute('aria-selected', isMatch);
          });

          this.setLanguage(lang);
          langDropdown.classList.remove('is-open');
          langDropdownBtn.setAttribute('aria-expanded', 'false');
        });
      });

      document.addEventListener('click', (e) => {
        if (!langDropdown.contains(e.target)) {
          langDropdown.classList.remove('is-open');
          langDropdownBtn.setAttribute('aria-expanded', 'false');
        }
      });

      document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && langDropdown.classList.contains('is-open')) {
          langDropdown.classList.remove('is-open');
          langDropdownBtn.setAttribute('aria-expanded', 'false');
          langDropdownBtn.focus();
        }
      });
    }

    // Global Header Search Modal Controls
    const searchBtn = document.getElementById('header-search-btn');
    const searchModal = document.getElementById('header-search-modal');
    const searchBackdrop = document.getElementById('search-modal-backdrop');
    const searchCloseBtn = document.getElementById('search-close-btn');
    const searchClearBtn = document.getElementById('search-clear-btn');
    const searchInput = document.getElementById('header-search-input');
    const searchEmptyHint = document.getElementById('search-empty-hint');
    const searchResultsList = document.getElementById('search-results-list');
    const searchTagChips = document.querySelectorAll('.search-tag-chip');

    const openSearch = () => {
      if (!searchModal) return;
      searchModal.classList.add('active');
      searchModal.setAttribute('aria-hidden', 'false');
      document.body.style.overflow = 'hidden';
      setTimeout(() => searchInput?.focus(), 80);
    };

    const closeSearch = () => {
      if (!searchModal) return;
      searchModal.classList.remove('active');
      searchModal.setAttribute('aria-hidden', 'true');
      document.body.style.overflow = '';
      if (searchInput) searchInput.value = '';
      if (searchClearBtn) searchClearBtn.style.display = 'none';
      if (searchResultsList) {
        searchResultsList.innerHTML = '';
        searchResultsList.style.display = 'none';
      }
      if (searchEmptyHint) searchEmptyHint.style.display = 'flex';
    };

    if (searchBtn) searchBtn.addEventListener('click', openSearch);
    if (searchBackdrop) searchBackdrop.addEventListener('click', closeSearch);
    if (searchCloseBtn) searchCloseBtn.addEventListener('click', closeSearch);

    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && searchModal && searchModal.classList.contains('active')) {
        closeSearch();
      }
    });

    const performSearch = (keyword) => {
      const q = keyword.trim().toLowerCase();
      if (!q) {
        if (searchClearBtn) searchClearBtn.style.display = 'none';
        if (searchResultsList) {
          searchResultsList.innerHTML = '';
          searchResultsList.style.display = 'none';
        }
        if (searchEmptyHint) searchEmptyHint.style.display = 'flex';
        return;
      }

      if (searchClearBtn) searchClearBtn.style.display = 'flex';
      if (searchEmptyHint) searchEmptyHint.style.display = 'none';

      // Index and search page content
      const searchableElements = [
        ...document.querySelectorAll('.hero-featured-news-card, .news-card, .opinion-card, .timeline-item, .dest-card, .stat-card')
      ];

      const matches = [];
      const seenTitles = new Set();

      searchableElements.forEach(el => {
        const titleEl = el.querySelector('h2, h3, h4, .featured-title-link, .news-card-title, .dest-card-title');
        const descEl = el.querySelector('p, .featured-card-excerpt, .news-card-excerpt');
        const title = titleEl ? titleEl.textContent.trim() : '';
        const desc = descEl ? descEl.textContent.trim() : '';
        const categoryEl = el.querySelector('.featured-live-badge, .news-badge, .opinion-badge, .dest-pill');
        const category = categoryEl ? categoryEl.textContent.trim() : 'APEC 2027';

        if (title && (title.toLowerCase().includes(q) || desc.toLowerCase().includes(q))) {
          if (!seenTitles.has(title)) {
            seenTitles.add(title);
            let targetId = el.id;
            if (!targetId) {
              const link = el.querySelector('a[href^="#"]');
              if (link) targetId = link.getAttribute('href').replace('#', '');
            }
            matches.push({ title, category, targetId });
          }
        }
      });

      // Default high-level sections match
      const sectionKeywords = [
        { title: 'Tổng quan Diễn đàn Hợp tác Kinh tế Châu Á - Thái Bình Dương', category: 'TỔNG QUAN', targetId: 'about', keywords: ['apec', 'tong quan', 'overview', 'about'] },
        { title: 'Việt Nam và Năm APEC 2027: Dấu ấn 3 thập kỷ hội nhập', category: 'VIỆT NAM & APEC', targetId: 'vietnam', keywords: ['viet nam', '2027', 'hoi nhap', 'kinh te'] },
        { title: 'Đảo Ngọc Phú Quốc — Điểm hẹn tương lai APEC 2027', category: 'ĐIỂM ĐẾN PHÚ QUỐC', targetId: 'destination', keywords: ['phu quoc', 'diem den', 'destination', 'dao ngoc'] },
        { title: 'Hội nghị thượng đỉnh Doanh nghiệp APEC CEO Summit 2027', category: 'SỰ KIỆN', targetId: 'news', keywords: ['ceo summit', 'doanh nghiep', 'hoi nghi'] },
        { title: 'Kỳ họp Hội đồng Tư vấn Kinh doanh APEC (ABAC 2027)', category: 'ABAC', targetId: 'news', keywords: ['abac', 'kinh doanh', 'paperless', 'so hoa'] }
      ];

      sectionKeywords.forEach(sec => {
        if (!seenTitles.has(sec.title)) {
          if (sec.title.toLowerCase().includes(q) || sec.keywords.some(k => k.includes(q) || q.includes(k))) {
            seenTitles.add(sec.title);
            matches.push(sec);
          }
        }
      });

      if (searchResultsList) {
        searchResultsList.innerHTML = '';
        if (matches.length === 0) {
          searchResultsList.innerHTML = `
            <li style="padding: 24px 16px; text-align: center; color: #64748b; font-size: 13.5px;">
              Không tìm thấy kết quả phù hợp cho "<strong>${keyword.replace(/</g, '&lt;')}</strong>". Vui lòng thử từ khóa khác.
            </li>
          `;
        } else {
          matches.slice(0, 6).forEach(m => {
            const li = document.createElement('li');
            li.innerHTML = `
              <a href="#${m.targetId || 'hero-section'}" class="search-result-item">
                <span class="search-result-category">${m.category}</span>
                <span class="search-result-title">${m.title}</span>
              </a>
            `;
            li.querySelector('a').addEventListener('click', () => {
              closeSearch();
            });
            searchResultsList.appendChild(li);
          });
        }
        searchResultsList.style.display = 'flex';
      }
    };

    if (searchInput) {
      searchInput.addEventListener('input', (e) => {
        performSearch(e.target.value);
      });
    }

    if (searchClearBtn && searchInput) {
      searchClearBtn.addEventListener('click', () => {
        searchInput.value = '';
        performSearch('');
        searchInput.focus();
      });
    }

    searchTagChips.forEach(chip => {
      chip.addEventListener('click', () => {
        const kw = chip.dataset.keyword || chip.textContent.replace('#', '').trim();
        if (searchInput) {
          searchInput.value = kw;
          performSearch(kw);
          searchInput.focus();
        }
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
    }

    // 2. Universal Smooth Scroll for in-page anchors
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

    // 3. GSAP Background Transition
    if (typeof gsap !== 'undefined' && typeof ScrollTrigger !== 'undefined') {
      const heroEl = document.getElementById('hero-section');
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
  }

  initEconomyInteractions() {
    const modal = document.getElementById('economy-modal');
    const backdrop = document.getElementById('modal-backdrop');
    const closeBtn = document.getElementById('close-modal-btn');

    this.interaction = {
      openEconomyModal: (eco) => {
        if (!modal || !backdrop) return;
        this.currentEco = eco;

        const isVi = this.currentLang === 'vi';
        const nameEl = document.getElementById('modal-name');
        const officialEl = document.getElementById('modal-official');
        const regionEl = document.getElementById('modal-region');
        const yearEl = document.getElementById('modal-year');
        const flagEl = document.getElementById('modal-flag');
        const statusEl = document.getElementById('modal-status');
        const themeEl = document.getElementById('modal-theme');

        if (nameEl) nameEl.textContent = isVi ? (eco.nameVi || eco.name) : eco.name;
        if (officialEl) officialEl.textContent = eco.official || eco.name;
        if (regionEl) regionEl.textContent = isVi ? (eco.regionVi || eco.region) : eco.region;
        if (yearEl) yearEl.textContent = eco.joinedYear || '1989';
        if (flagEl) flagEl.src = `assets/flags/raw/${eco.id}.png`;
        if (statusEl) {
          statusEl.textContent = eco.isHost
            ? (isVi ? 'Nền kinh tế Chủ nhà (Host Economy)' : 'Host Economy')
            : (isVi ? 'Nền kinh tế Thành viên' : 'Member Economy');
        }
        if (themeEl) {
          themeEl.textContent = isVi
            ? (eco.themeVi || 'Đối tác cùng kiến tạo tương lai phát triển bền vững và bao trùm.')
            : (eco.themeEn || 'Partner in creating a sustainable and inclusive future.');
        }

        modal.classList.add('is-open');
        backdrop.classList.add('is-open');
      },
      closeModal: () => {
        if (modal) modal.classList.remove('is-open');
        if (backdrop) backdrop.classList.remove('is-open');
      },
      updateModalLanguage: () => {
        if (this.currentEco && modal && modal.classList.contains('is-open')) {
          this.interaction.openEconomyModal(this.currentEco);
        }
      }
    };

    if (closeBtn) closeBtn.addEventListener('click', () => this.interaction.closeModal());
    if (backdrop) backdrop.addEventListener('click', () => this.interaction.closeModal());
  }

  setLanguage(lang) {
    this.currentLang = lang;
    document.documentElement.lang = lang;

    // Update active button state for buttons and dropdown items
    document.querySelectorAll('.lang-btn, .lang-dropdown-item').forEach(b => {
      const isMatch = b.dataset.lang === lang;
      b.classList.toggle('active', isMatch);
      if (b.hasAttribute('aria-selected')) {
        b.setAttribute('aria-selected', isMatch);
      }
    });

    // Sync trigger display (flag + name)
    const matchedItem = document.querySelector(`.lang-dropdown-item[data-lang="${lang}"]`);
    if (matchedItem) {
      const flagSvg = matchedItem.querySelector('.lang-flag-box')?.innerHTML;
      const nameText = matchedItem.querySelector('.lang-item-label')?.textContent.trim();
      const currentFlagEl = document.getElementById('lang-flag-current');
      const currentNameEl = document.getElementById('lang-name-current');
      if (currentFlagEl && flagSvg) currentFlagEl.innerHTML = flagSvg;
      if (currentNameEl && nameText) currentNameEl.textContent = nameText;
    }

    // Update text content with data-i18n attributes
    const elements = document.querySelectorAll('[data-i18n-vi]');
    elements.forEach(el => {
      let text = '';
      if (lang === 'vi') {
        text = el.getAttribute('data-i18n-vi');
      } else {
        text = el.getAttribute(`data-i18n-${lang}`) || el.getAttribute('data-i18n-en') || el.getAttribute('data-i18n-vi');
      }
      if (text) {
        if (text.includes('<br>') || text.includes('<span')) {
          el.innerHTML = text;
        } else {
          el.textContent = text;
        }
      }
    });

    // Update member economy pills in roster
    document.querySelectorAll('.economy-pill-name').forEach(el => {
      const text = lang === 'vi' ? el.getAttribute('data-vi') : el.getAttribute('data-en');
      if (text) el.textContent = text;
    });

    // Update search placeholder according to current language
    const searchInput = document.getElementById('header-search-input');
    if (searchInput) {
      const phMap = {
        vi: 'Tìm kiếm tin tức, sự kiện, chủ đề APEC 2027...',
        en: 'Search news, events, topics APEC 2027...',
        fr: 'Rechercher des actualités, événements APEC 2027...',
        zh: '搜索 APEC 2027 新闻、活动和专题...',
        es: 'Buscar noticias, eventos y temas de APEC 2027...',
        ru: 'Поиск новостей, событий и тем АТЭС 2027...'
      };
      searchInput.placeholder = phMap[lang] || phMap.en;
    }

    // Update open modal content if currently active
    if (this.interaction && this.interaction.updateModalLanguage) {
      this.interaction.updateModalLanguage();
    }

    // Update buttons / placeholders
    const cta = document.getElementById('explore-cta-btn');
    if (cta) {
      cta.innerHTML = lang === 'vi'
        ? '<span>KHÁM PHÁ APEC 2027</span> <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><path d="M5 12h14M12 5l7 7-7 7"/></svg>'
        : '<span>EXPLORE APEC 2027</span> <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><path d="M5 12h14M12 5l7 7-7 7"/></svg>';
    }
  }

  animate() {
    if (this.sky && this.clock) {
      const delta = Math.min(this.clock.getDelta(), 0.1);
      this.mouseParallax.x += (this.mouseParallax.targetX - this.mouseParallax.x) * 0.05;
      this.mouseParallax.y += (this.mouseParallax.targetY - this.mouseParallax.y) * 0.05;
      this.sky.update(delta, this.mouseParallax);
    }
    if (this.skyRenderer && this.skyScene && this.camera) {
      this.skyRenderer.render(this.skyScene, this.camera);
    }
    requestAnimationFrame(this.animate);
  }
}

// Bootstrap on DOM ready for index-2.html
document.addEventListener('DOMContentLoaded', () => {
  window.apecApp = new ApecAppV2();
});
