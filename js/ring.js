/**
 * APEC VIET NAM 2027 — THE CAROUSEL: A TRUE 3D PERSPECTIVE RING
 * 21 member economy horizontal flags on a perspective cylinder facing the camera
 * Updated per user specifications:
 * - Speed doubled (3.8 deg/s)
 * - Inter-card spacing reduced to 1/3 (n = 63 cards, step = 360/63 = 5.7143°)
 * - Clean horizontal flag only, with country name label, no extraneous filler
 */

class PerspectiveRingCarousel {
  constructor(container) {
    this.container = container || document.getElementById('ring-container') || document.body;
    
    // Per user specification:
    // Double card size (164px x 110px standard 3:2 flag), doubled speed (3.8 deg/s)
    // Inter-card spacing reduced to 1/3: n = 63 cards (3x repeat of 21 economies), step = 360/63 = 5.7143°
    this.n = 63;               // 63 cards (3 complete cycles of 21 economies)
    this.step = 360 / this.n;  // 5.7143°
    this.R = 2100;             // Base cylinder radius, dynamically scaled on resize
    this.perspective = 2500;   // Matches cylinder radius
    this.cullAngle = 56;       // Visible field of view
    this.speed = 3.8;          // Doubled speed (3.8 deg/s)
    this.phase = -2;           // Continuous rotation phase
    this.archDrop = 950;       // Upward convex curvature arch height
    
    this.lastTime = performance.now();
    this.isPaused = false;
    this.isHovered = false;
    this.hoveredIndex = -1;
    this.reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    this.initDOM();
    this.initEvents();
    this.animate = this.animate.bind(this);
    requestAnimationFrame(this.animate);
  }

  initDOM() {
    let wrapper = document.getElementById('ring-container');
    if (!wrapper) {
      wrapper = document.createElement('div');
      wrapper.className = 'showcase-wrapper';
      wrapper.id = 'ring-container';
      this.container.appendChild(wrapper);
    }
    this.wrapper = wrapper;

    let showcase = document.getElementById('ring-showcase');
    if (!showcase) {
      showcase = document.createElement('div');
      showcase.className = 'showcase';
      showcase.id = 'ring-showcase';
      this.wrapper.appendChild(showcase);
    }
    this.showcase = showcase;

    let ring = document.getElementById('perspective-ring');
    if (!ring) {
      ring = document.createElement('div');
      ring.className = 'ring';
      ring.id = 'perspective-ring';
      this.showcase.appendChild(ring);
    }
    this.ring = ring;
    this.ring.innerHTML = '';

    this.cards = [];
    const economies = window.APEC_CONFIG.memberEconomies;
    const isVi = document.documentElement.lang === 'vi' || (window.apecApp && window.apecApp.currentLang === 'vi');

    for (let i = 0; i < this.n; i++) {
      const eco = economies[i % economies.length];
      const card = document.createElement('div');
      card.className = 'card flag-card';
      card.dataset.index = i;
      card.dataset.code = eco.id;

      const countryName = isVi ? (eco.nameVi || eco.name) : eco.name;

      card.innerHTML = `
        <div class="flag-card-stage">
          <img src="assets/flags/raw/${eco.id}.png" alt="${eco.name}" class="flag-raw-img" loading="eager" />
          <div class="flag-name-tag">
            <span class="flag-name-label" data-vi="${eco.nameVi || eco.name}" data-en="${eco.name}">${countryName}</span>
          </div>
        </div>
        <div class="card-edge-highlight"></div>
      `;

      // Fallback
      const img = card.querySelector('img');
      if (img) {
        img.onerror = () => card.classList.add('broken');
      }

      // Card hover and click interactions
      card.addEventListener('mouseenter', (e) => {
        this.isHovered = true;
        this.hoveredIndex = i;
        if (window.apecApp && window.apecApp.interaction) {
          window.apecApp.interaction.showTooltip(eco, e.clientX, e.clientY);
        }
      });

      card.addEventListener('mousemove', (e) => {
        if (window.apecApp && window.apecApp.interaction) {
          window.apecApp.interaction.updateTooltipPosition(e.clientX, e.clientY);
        }
      });

      card.addEventListener('mouseleave', () => {
        this.isHovered = false;
        this.hoveredIndex = -1;
        if (window.apecApp && window.apecApp.interaction) {
          window.apecApp.interaction.hideTooltip();
        }
      });

      card.addEventListener('click', () => {
        if (window.apecApp && window.apecApp.interaction) {
          window.apecApp.interaction.openEconomyModal(eco);
        }
      });

      this.ring.appendChild(card);
      this.cards.push(card);
    }
  }

  updateLanguage(lang) {
    const isVi = lang === 'vi';
    this.cards.forEach(card => {
      const label = card.querySelector('.flag-name-label');
      if (label) {
        label.textContent = isVi ? (label.dataset.vi || label.dataset.en) : label.dataset.en;
      }
    });
  }

  initEvents() {
    // Reset timestamp on visibility change so background tab does not jump
    document.addEventListener('visibilitychange', () => {
      if (!document.hidden) {
        this.lastTime = performance.now();
      }
    });

    // prefers-reduced-motion listener: freeze phase when matches
    window.matchMedia('(prefers-reduced-motion: reduce)').addEventListener('change', (e) => {
      this.reducedMotion = e.matches;
    });

    // Responsive scaling for mobile & smaller viewports
    this.onResize = this.onResize.bind(this);
    window.addEventListener('resize', this.onResize);
    this.onResize();
  }

  onResize() {
    const vw = window.innerWidth;
    const vh = window.innerHeight;

    // Keep fixed radius R, perspective, and arch curvature across all screens
    // Linear pitch = R * (2*PI / 63) = 208px (card 164px + fixed 44px gap)
    // This ensures inter-card spacing is strictly constant and never squeezes together when window shrinks
    this.R = 2100;
    this.perspective = 2500;
    this.archDrop = 950;

    // Dynamically adjust cull angle to viewport width to hide off-screen cards cleanly
    const maxVisibleX = vw * 0.5 + 240;
    const sinAngle = Math.min(0.88, maxVisibleX / this.R);
    this.cullAngle = Math.max(22, Math.min(56, Math.ceil(Math.asin(sinAngle) * (180 / Math.PI) + 4)));

    if (this.ring) {
      this.ring.style.perspective = `${this.perspective}px`;
      this.ring.style.perspectiveOrigin = `50% 540px`;
    }

    if (vw < 768) {
      const targetY = Math.round(vh * 0.44 - 540);
      this.showcase.style.transform = `translateY(${targetY}px)`;
      this.showcase.style.transformOrigin = '50% 540px';
    } else {
      this.showcase.style.transform = 'none';
    }
  }

  togglePause() {
    this.isPaused = !this.isPaused;
    return this.isPaused;
  }

  animate(t) {
    const dt = Math.min((t - this.lastTime) / 1000, 0.1);
    this.lastTime = t;

    // phase -= speed * dt (continuous, never resets). Freeze phase when
    // matchMedia('(prefers-reduced-motion: reduce)') matches
    if (!this.reducedMotion && !this.isPaused) {
      this.phase -= this.speed * dt;
    }

    const R = this.R;
    const step = this.step;
    const cullAngle = this.cullAngle;
    const phase = this.phase;
    const archDrop = this.archDrop;

    for (let i = 0; i < this.n; i++) {
      const el = this.cards[i];
      if (!el) continue;

      // signed angle: -180..180
      const a = ((i * step + phase) % 360 + 540) % 360 - 180;

      // cull back half only when safely offscreen
      if (Math.abs(a) > cullAngle) {
        el.style.visibility = 'hidden';
        continue;
      } else {
        el.style.visibility = 'visible';
      }

      const r = (a * Math.PI) / 180;
      const c = Math.cos(r);

      // Upward convex arch: peak at center (ty=0), slopes downwards at sides (ty > 0)
      const tx = R * Math.sin(r);
      const tz = R * (1 - c);
      const ty = archDrop * (1 - c);
      const ry = -a;

      // Bank angle tangent to upward arch: dy/dx = (archDrop / R) * tan(r)
      const slope = (archDrop / R) * Math.tan(r);
      const rz = Math.atan(slope) * (180 / Math.PI);

      // filter: edges dim, front bright
      let brightness = 0.84 + 0.5 * (1 / Math.max(0.001, c) - 1);
      if (this.isHovered && this.hoveredIndex === i) {
        brightness *= 1.15;
      }

      // Smooth off-screen edge fade so cards transition seamlessly
      let opacity = 1.0;
      const fadeStart = cullAngle - 8;
      if (Math.abs(a) > fadeStart) {
        opacity = Math.max(0, (cullAngle - Math.abs(a)) / 8);
      }

      el.style.transform = `translate3d(${tx.toFixed(2)}px, ${ty.toFixed(2)}px, ${tz.toFixed(2)}px) rotateY(${ry.toFixed(2)}deg) rotateZ(${rz.toFixed(2)}deg)`;
      el.style.filter = `brightness(${brightness.toFixed(3)})`;
      el.style.opacity = opacity.toFixed(3);
    }

    requestAnimationFrame(this.animate);
  }
}

window.PerspectiveRingCarousel = PerspectiveRingCarousel;
