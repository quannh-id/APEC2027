/**
 * APEC VIET NAM 2027 — Cinematic Intro Sequencer
 * Choreographs the 0.0s -> 4.5s grand entrance sequence matching summit guidelines
 */

class IntroSequencer {
  constructor(apecScene) {
    this.scene = apecScene;
    this.isComplete = false;
    this.heroUI = document.querySelector('.hero-content');
    this.navUI = document.querySelector('.main-header');
    this.overlayEl = document.getElementById('intro-curtain');
    this.skipBtn = document.getElementById('skip-intro-btn');

    if (this.skipBtn) {
      this.skipBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        this.fastForward();
      });
    }

    // Allow user click anywhere during intro to jump right into interactive experience
    if (this.overlayEl) {
      this.overlayEl.addEventListener('click', () => {
        this.fastForward();
      });
    }
  }

  play() {
    if (this.scene.reducedMotion) {
      this.fastForward();
      return;
    }

    // Safety timeout: ensure intro completes even if tab loses focus or GSAP pauses
    this.fallbackTimer = setTimeout(() => {
      if (!this.isComplete) {
        this.fastForward();
      }
    }, 4800);

    const tl = gsap.timeline({
      onComplete: () => {
        this.fastForward();
      }
    });

    document.body.classList.add('in-intro');

    // 0.0s - 0.6s: Dark curtain dissolves swiftly
    tl.to(this.overlayEl, {
      opacity: 0,
      duration: 0.6,
      ease: 'power2.inOut',
      onComplete: () => {
        if (this.overlayEl) {
          this.overlayEl.style.display = 'none';
          this.overlayEl.style.pointerEvents = 'none';
        }
      }
    }, 0.0);

    // 0.4s - 1.4s: Central Phu Quoc rises and expands smoothly to 1/3 scale
    if (this.scene.phuquoc && this.scene.phuquoc.group) {
      gsap.fromTo(this.scene.phuquoc.group.scale, 
        { x: 0.24, y: 0.24, z: 0.24 },
        { x: 0.36, y: 0.36, z: 0.36, duration: 1.2, ease: 'power2.out', delay: 0.2 }
      );
    }

    // 0.2s - 0.8s: 21 economy perspective ring resolves gracefully
    const ringEl = document.getElementById('ring-container');
    if (ringEl) {
      gsap.fromTo(ringEl,
        { opacity: 0, scale: 0.96 },
        { opacity: 1, scale: 1.0, duration: 0.8, ease: 'power2.out', delay: 0.2 }
      );
    }

    // 0.4s - 1.0s: Hero typography resolves
    if (this.heroUI) {
      gsap.fromTo(this.heroUI,
        { opacity: 0, y: 15 },
        { opacity: 1, y: 0, duration: 0.8, ease: 'power2.out', delay: 0.4 }
      );
    }
  }

  fastForward() {
    this.isComplete = true;
    if (this.fallbackTimer) clearTimeout(this.fallbackTimer);

    document.body.classList.remove('in-intro');

    if (this.overlayEl) {
      this.overlayEl.style.display = 'none';
    }

    if (this.scene.camera) {
      this.scene.camera.position.copy(this.scene.cameraBasePos);
      this.scene.camera.lookAt(this.scene.cameraLookAt);
    }

    if (this.scene.phuquoc && this.scene.phuquoc.group) {
      const cfg = window.APEC_CONFIG.scene.phuquoc;
      const targetY = (cfg && cfg.groupY !== undefined) ? cfg.groupY : -3.2;
      this.scene.phuquoc.group.scale.set(0.36, 0.36, 0.36);
      this.scene.phuquoc.group.position.set(0, targetY, 0);
    }

    const ringEl = document.getElementById('ring-container');
    if (ringEl) {
      ringEl.style.opacity = '1';
      ringEl.style.transform = '';
    }

    if (this.navUI) {
      this.navUI.style.opacity = '1';
      this.navUI.style.transform = 'translateY(0)';
    }

    if (this.heroUI) {
      this.heroUI.style.opacity = '1';
      this.heroUI.style.transform = 'translateY(0)';
    }
  }
}

window.IntroSequencer = IntroSequencer;
