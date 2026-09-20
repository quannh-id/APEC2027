/**
 * APEC VIET NAM 2027 — Interactive Controller
 * Raycasting, cursor parallax, flag hover labels, and modal inspection
 */

class InteractionController {
  constructor(apecScene) {
    this.scene = apecScene;
    this.raycaster = new THREE.Raycaster();
    this.mouse = new THREE.Vector2(-999, -999);
    this.hoveredFlag = null;

    // DOM UI elements
    this.tooltipEl = document.getElementById('flag-tooltip');
    this.tooltipName = document.getElementById('tooltip-economy-name');
    this.tooltipSub = document.getElementById('tooltip-economy-sub');
    this.tooltipFlagImg = document.getElementById('tooltip-flag-thumb');
    this.modalEl = document.getElementById('economy-modal');
    this.modalBackdrop = document.getElementById('modal-backdrop');

    this.initMouseEvents();
    this.initTouchEvents();
    this.initModalEvents();
  }

  initMouseEvents() {
    window.addEventListener('mousemove', (e) => {
      // Normalized coordinates (-1 to 1)
      const nx = (e.clientX / window.innerWidth) * 2 - 1;
      const ny = -(e.clientY / window.innerHeight) * 2 + 1;

      this.mouse.x = nx;
      this.mouse.y = ny;

      // Pass parallax to 3D scene (gentle 2-5px / 5-20px depth response)
      this.scene.setMouseParallax(nx, ny);

      // Check raycast
      this.checkRaycast(e.clientX, e.clientY);

      // Check proximity to Phu Quoc center
      const distToCenter = Math.hypot(nx, ny + 0.35); // center is slightly lower
      this.scene.phuquoc.setHover(distToCenter < 0.45);
    });

    window.addEventListener('click', (e) => {
      // Ignore click if clicking UI buttons or links
      if (e.target.closest('button') || e.target.closest('a') || e.target.closest('.interactive-nav')) {
        return;
      }

      if (this.hoveredFlag) {
        this.openEconomyModal(this.hoveredFlag.userData.economy);
      }
    });

    window.addEventListener('mouseleave', () => {
      this.scene.setMouseParallax(0, 0);
      this.hideTooltip();
      this.scene.flags.setHoveredFlag(null);
      this.scene.phuquoc.setHover(false);
    });
  }

  initTouchEvents() {
    let startX = 0;
    let startY = 0;

    window.addEventListener('touchstart', (e) => {
      if (e.touches.length > 0) {
        startX = e.touches[0].clientX;
        startY = e.touches[0].clientY;
        const nx = (startX / window.innerWidth) * 2 - 1;
        const ny = -(startY / window.innerHeight) * 2 + 1;
        this.mouse.x = nx;
        this.mouse.y = ny;
        this.checkRaycast(startX, startY);
      }
    }, { passive: true });

    window.addEventListener('touchmove', (e) => {
      if (e.touches.length > 0) {
        const cx = e.touches[0].clientX;
        const cy = e.touches[0].clientY;
        const nx = (cx / window.innerWidth) * 2 - 1;
        const ny = -(cy / window.innerHeight) * 2 + 1;
        this.scene.setMouseParallax(nx * 0.7, ny * 0.7);
      }
    }, { passive: true });
  }

  checkRaycast(screenX, screenY) {
    if (!this.scene.flags || !Array.isArray(this.scene.flags.flagMeshes) || !this.scene.flags.flagMeshes.length) return;

    this.raycaster.setFromCamera(this.mouse, this.scene.camera);
    const intersects = this.raycaster.intersectObjects(this.scene.flags.flagMeshes, false);

    if (intersects.length > 0) {
      const hit = intersects[0].object;
      if (hit !== this.hoveredFlag) {
        this.hoveredFlag = hit;
        this.scene.flags.setHoveredFlag(hit);
        this.showTooltip(hit.userData.economy, screenX, screenY);
        document.body.style.cursor = 'pointer';
      } else {
        this.updateTooltipPosition(screenX, screenY);
      }
    } else {
      if (this.hoveredFlag) {
        this.hoveredFlag = null;
        this.scene.flags.setHoveredFlag(null);
        this.hideTooltip();
        document.body.style.cursor = 'default';
      }
    }
  }

  showTooltip(economy, screenX, screenY) {
    if (!this.tooltipEl) return;

    const isVi = document.documentElement.lang === 'vi';
    this.tooltipName.textContent = isVi ? (economy.nameVi || economy.name) : economy.name;
    this.tooltipSub.textContent = economy.host 
      ? (isVi ? 'NỀN KINH TẾ CHỦ NHÀ APEC 2027' : 'APEC 2027 HOST ECONOMY')
      : (isVi ? 'NỀN KINH TẾ THÀNH VIÊN APEC' : 'APEC MEMBER ECONOMY');

    if (this.tooltipFlagImg) {
      this.tooltipFlagImg.src = `assets/flags/raw/${economy.id}.png`;
    }

    this.tooltipEl.classList.add('visible');
    this.updateTooltipPosition(screenX, screenY);
  }

  updateTooltipPosition(screenX, screenY) {
    if (!this.tooltipEl) return;
    
    // Position slightly above cursor with screen boundary safety
    const pad = 24;
    let x = screenX;
    let y = screenY - pad;

    const rect = this.tooltipEl.getBoundingClientRect();
    if (x + rect.width / 2 > window.innerWidth - 20) {
      x = window.innerWidth - rect.width / 2 - 20;
    } else if (x - rect.width / 2 < 20) {
      x = rect.width / 2 + 20;
    }

    if (y - rect.height < 60) {
      y = screenY + pad + rect.height;
    }

    this.tooltipEl.style.transform = `translate3d(${x}px, ${y}px, 0)`;
  }

  hideTooltip() {
    if (this.tooltipEl) {
      this.tooltipEl.classList.remove('visible');
    }
  }

  initModalEvents() {
    const closeBtn = document.getElementById('close-modal-btn');
    const backdrop = document.getElementById('modal-backdrop') || this.modalBackdrop;

    if (closeBtn) {
      closeBtn.addEventListener('click', (e) => {
        e.preventDefault();
        e.stopPropagation();
        this.closeEconomyModal();
      });
    }
    if (backdrop) {
      backdrop.addEventListener('click', (e) => {
        e.preventDefault();
        e.stopPropagation();
        this.closeEconomyModal();
      });
    }

    window.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && this.modalEl && this.modalEl.classList.contains('active')) {
        this.closeEconomyModal();
      }
    });
  }

  openEconomyModal(economy) {
    if (!this.modalEl) return;
    this.currentModalEconomy = economy;

    const isVi = document.documentElement.lang === 'vi';
    const flagEl = document.getElementById('modal-flag');
    if (flagEl) {
      flagEl.src = `assets/flags/raw/${economy.id}.png`;
      flagEl.alt = isVi ? (economy.nameVi || economy.name) : economy.name;
    }
    document.getElementById('modal-name').textContent = isVi ? (economy.nameVi || economy.name) : economy.name;
    document.getElementById('modal-official').textContent = isVi ? (economy.officialNameVi || economy.officialName) : economy.officialName;
    document.getElementById('modal-region').textContent = isVi ? (economy.regionVi || economy.region) : economy.region;
    document.getElementById('modal-year').textContent = economy.joinYear;
    document.getElementById('modal-status').textContent = economy.host 
      ? (isVi ? 'Nền kinh tế Chủ nhà (Host Economy)' : 'Host Economy') 
      : (isVi ? 'Nền kinh tế Thành viên (Member Economy)' : 'Member Economy');
    document.getElementById('modal-theme').textContent = isVi ? (economy.themeVi || economy.theme) : economy.theme;

    this.modalEl.classList.add('active');
    if (this.modalBackdrop) {
      this.modalBackdrop.classList.add('active');
    }
    document.body.classList.add('modal-open');
  }

  updateModalLanguage() {
    if (this.modalEl && this.modalEl.classList.contains('active') && this.currentModalEconomy) {
      this.openEconomyModal(this.currentModalEconomy);
    }
  }

  closeEconomyModal() {
    if (!this.modalEl) return;
    this.modalEl.classList.remove('active');
    if (this.modalBackdrop) {
      this.modalBackdrop.classList.remove('active');
    }
    document.body.classList.remove('modal-open');
  }
}

window.InteractionController = InteractionController;
