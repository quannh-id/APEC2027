/**
 * APEC VIET NAM 2027 — 3D Scene Architecture
 * Orchestrates Three.js rendering across layered canvases (Sky background & Island foreground),
 * allowing the CSS 3D Perspective Ring Carousel to sit naturally between them.
 */

class ApecScene {
  constructor(skyCanvas, islandCanvas) {
    this.skyCanvas = skyCanvas || document.getElementById('sky-canvas');
    this.islandCanvas = islandCanvas || document.getElementById('island-canvas');
    
    this.onResize = this.onResize.bind(this);

    const heroEl = document.getElementById('hero-section');
    this.width = heroEl ? heroEl.clientWidth : (document.documentElement.clientWidth || window.innerWidth);
    this.height = heroEl ? heroEl.clientHeight : window.innerHeight;
    this.viewportHeight = window.innerHeight;

    this.clock = new THREE.Clock();
    this.time = 0;
    this.isPaused = false;
    this.reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    this.mouseParallax = { x: 0, y: 0, targetX: 0, targetY: 0 };
    this.scrollProgress = 0;
    this.scrollY = 0;

    this.initRenderers();
    this.initCamera();
    this.initLights();
    this.initLayers();
    this.initEvents();

    // Immediate resize synchronization on load so canvas aspect is 100% round on first render
    this.onResize();
  }

  initRenderers() {
    const isMobile = /iPhone|iPad|iPod|Android/i.test(navigator.userAgent);
    const maxPr = isMobile ? 1.5 : Math.min(window.devicePixelRatio, 2.0);

    // 1. Sky Renderer (Layer 01 - Background)
    if (this.skyCanvas) {
      this.skyRenderer = new THREE.WebGLRenderer({
        canvas: this.skyCanvas,
        powerPreference: 'high-performance',
        antialias: true,
        alpha: false
      });
      this.skyRenderer.setPixelRatio(maxPr);
      this.skyRenderer.setSize(this.width, this.viewportHeight);
      this.skyRenderer.outputEncoding = THREE.sRGBEncoding;
    }

    // 2. Island Renderer (Layer 03 - Foreground, with alpha transparency)
    if (this.islandCanvas) {
      this.islandRenderer = new THREE.WebGLRenderer({
        canvas: this.islandCanvas,
        powerPreference: 'high-performance',
        antialias: true,
        alpha: true
      });
      this.islandRenderer.setPixelRatio(maxPr);
      this.islandRenderer.setSize(this.width, this.height);
      this.islandRenderer.outputEncoding = THREE.sRGBEncoding;
      this.islandRenderer.toneMapping = THREE.ACESFilmicToneMapping;
      this.islandRenderer.toneMappingExposure = 1.05;
    }
  }

  initCamera() {
    const cfg = window.APEC_CONFIG.scene;
    this.camera = new THREE.PerspectiveCamera(
      cfg.cameraFov,
      this.width / this.height,
      cfg.cameraNear,
      cfg.cameraFar
    );

    this.cameraBasePos = new THREE.Vector3(cfg.cameraBasePos.x, cfg.cameraBasePos.y, cfg.cameraBasePos.z);
    this.cameraLookAt = new THREE.Vector3(cfg.cameraBaseLookAt.x, cfg.cameraBaseLookAt.y, cfg.cameraBaseLookAt.z);

    this.camera.position.copy(this.cameraBasePos);
    this.camera.lookAt(this.cameraLookAt);

    // Sky Scene (renders on skyRenderer)
    this.skyScene = new THREE.Scene();

    // Island Scene (renders on islandRenderer)
    this.islandScene = new THREE.Scene();
  }

  initLights() {
    const cfg = window.APEC_CONFIG.scene.lighting;

    // Sky sun directional light
    const skySun = new THREE.DirectionalLight(cfg.sunColor, 1.0);
    skySun.position.set(cfg.sunPos.x, cfg.sunPos.y, cfg.sunPos.z);
    this.skyScene.add(skySun);

    // Island lighting
    this.sunLight = new THREE.DirectionalLight(cfg.sunColor, cfg.sunIntensity);
    this.sunLight.position.set(cfg.sunPos.x, cfg.sunPos.y, cfg.sunPos.z);
    this.islandScene.add(this.sunLight);

    this.ambientLight = new THREE.AmbientLight(cfg.ambientColor, cfg.ambientIntensity);
    this.islandScene.add(this.ambientLight);

    this.hemiLight = new THREE.HemisphereLight(cfg.hemiSky, cfg.hemiGround, cfg.hemiIntensity);
    this.islandScene.add(this.hemiLight);
  }

  initLayers() {
    // Layer 01: Sky and Atmosphere in skyScene
    this.sky = new ApecSky(this.skyScene);

    // Layer 03: Central Phu Quoc Fish-Eye World in islandScene
    this.phuquoc = new PhuQuocWorld(this.islandScene);

    // Legacy compatibility stub so other controllers don't throw errors
    this.flags = {
      group: { scale: { set: () => {} }, position: { y: 0, z: 0 } },
      targetOrbitSpeed: 1.0,
      setHoveredFlag: () => {},
      flagMeshes: [],
      update: () => {}
    };
  }

  initEvents() {
    window.addEventListener('resize', this.onResize.bind(this));

    // Visibility change handler
    document.addEventListener('visibilitychange', () => {
      this.isPaused = document.hidden;
      if (!this.isPaused) {
        this.clock.start();
      }
    });

    // prefers-reduced-motion listener
    const motionQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
    motionQuery.addEventListener('change', (e) => {
      this.reducedMotion = e.matches;
    });
  }

  onResize() {
    const heroEl = document.getElementById('hero-section');
    this.width = heroEl ? heroEl.clientWidth : (document.documentElement.clientWidth || window.innerWidth);
    this.height = heroEl ? heroEl.clientHeight : window.innerHeight;
    this.viewportHeight = window.innerHeight;

    this.camera.aspect = this.width / this.height;

    if (this.width < 768) {
      this.camera.fov = 58;
      this.cameraBasePos.z = 23.5;
    } else if (this.width < 1200) {
      this.camera.fov = 48;
      this.cameraBasePos.z = 20.0;
    } else {
      this.camera.fov = window.APEC_CONFIG.scene.cameraFov;
      this.cameraBasePos.z = window.APEC_CONFIG.scene.cameraBasePos.z;
    }

    this.camera.updateProjectionMatrix();

    const isMobile = /iPhone|iPad|iPod|Android/i.test(navigator.userAgent);
    const maxPr = isMobile ? 1.5 : Math.min(window.devicePixelRatio || 1, 2.0);

    if (this.skyRenderer) {
      this.skyRenderer.setPixelRatio(maxPr);
      this.skyRenderer.setSize(this.width, this.viewportHeight);
    }
    if (this.islandRenderer) {
      this.islandRenderer.setPixelRatio(maxPr);
      this.islandRenderer.setSize(this.width, this.height);
    }
  }

  setMouseParallax(nx, ny) {
    this.mouseParallax.targetX = nx;
    this.mouseParallax.targetY = ny;
  }

  setScroll(scrollY) {
    this.scrollY = scrollY;
    const heroEl = document.getElementById('hero-section');
    const heroHeight = heroEl ? heroEl.clientHeight : window.innerHeight;
    this.scrollProgress = Math.max(0, Math.min(1.0, scrollY / (heroHeight * 0.85)));
  }

  setScrollProgress(progress) {
    this.scrollProgress = Math.max(0, Math.min(1, progress));
  }

  updateCameraDrift(delta) {
    if (this.reducedMotion) {
      this.camera.position.copy(this.cameraBasePos);
      this.camera.lookAt(this.cameraLookAt);
      return;
    }

    // 1–3% subtle continuous camera drift
    const driftTime = this.time * 0.35;
    const driftX = Math.sin(driftTime * 0.8) * 0.28;
    const driftY = Math.cos(driftTime * 0.6) * 0.16;
    const breathingZ = Math.sin(driftTime * 0.4) * 0.35;

    // Smooth mouse parallax lerp
    this.mouseParallax.x += (this.mouseParallax.targetX - this.mouseParallax.x) * 0.05;
    this.mouseParallax.y += (this.mouseParallax.targetY - this.mouseParallax.y) * 0.05;

    this.camera.position.x = this.cameraBasePos.x + driftX + this.mouseParallax.x * 0.8;
    this.camera.position.y = this.cameraBasePos.y + driftY + this.mouseParallax.y * 0.5;
    this.camera.position.z = this.cameraBasePos.z + breathingZ;

    const currentLookAt = this.cameraLookAt.clone();
    currentLookAt.x += this.mouseParallax.x * 0.2;
    currentLookAt.y += this.mouseParallax.y * 0.15;
    this.camera.lookAt(currentLookAt);
  }

  render() {
    if (this.isPaused) return;

    const delta = Math.min(this.clock.getDelta(), 0.1);
    this.time += delta;

    this.updateCameraDrift(delta);

    // Update 3D layers
    if (this.sky) {
      this.sky.update(delta, this.mouseParallax);
    }
    if (this.phuquoc) {
      this.phuquoc.update(delta, this.mouseParallax);
    }

    // Render background sky canvas
    if (this.skyRenderer) {
      this.skyRenderer.render(this.skyScene, this.camera);
    }

    // Render foreground island canvas
    if (this.islandRenderer) {
      this.islandRenderer.render(this.islandScene, this.camera);
    }
  }
}

window.ApecScene = ApecScene;
