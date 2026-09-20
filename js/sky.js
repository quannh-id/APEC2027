/**
 * APEC VIET NAM 2027 — Layer 01: Sky & Atmosphere
 * Cinematic tropical Phu Quoc environment with drifting clouds and natural lighting
 */

class ApecSky {
  constructor(scene) {
    this.scene = scene;
    this.group = new THREE.Group();
    this.scene.add(this.group);
    
    this.cloudMeshes = [];
    this.time = 0;
    
    this.initSkyDome();
    this.initClouds();
    this.initAtmosphericHaze();
  }

  initSkyDome() {
    const skyGeo = new THREE.SphereGeometry(400, 32, 24);
    
    const skyMat = new THREE.ShaderMaterial({
      side: THREE.BackSide,
      depthWrite: false,
      uniforms: {
        uTime: { value: 0 },
        uSunPos: { value: new THREE.Vector3(0.55, 0.45, -0.7).normalize() }
      },
      vertexShader: `
        varying vec3 vWorldPosition;
        void main() {
          vec4 worldPosition = modelMatrix * vec4(position, 1.0);
          vWorldPosition = worldPosition.xyz;
          gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
        }
      `,
      fragmentShader: `
        uniform vec3 uSunPos;
        uniform float uTime;
        varying vec3 vWorldPosition;

        void main() {
          vec3 dir = normalize(vWorldPosition);
          float y = clamp(dir.y * 1.25 + 0.12, 0.0, 1.0);
          
          // Bright, radiant diplomatic tropical sky matching Image 2
          vec3 zenithColor = vec3(0.08, 0.48, 0.88); // Vibrant tropical daytime sky
          vec3 midSkyColor = vec3(0.25, 0.66, 0.95); // Bright cerulean sky
          vec3 horizonColor = vec3(0.80, 0.92, 0.99); // Soft light blue horizon
          vec3 sunriseGlow = vec3(1.0, 0.98, 0.92); // Radiant sunlight
          
          vec3 sky = mix(horizonColor, midSkyColor, smoothstep(0.0, 0.45, y));
          sky = mix(sky, zenithColor, smoothstep(0.45, 1.0, y));
          
          // Sunlight directional glow on upper-right
          float sunDot = max(0.0, dot(dir, uSunPos));
          float sunGlow = pow(sunDot, 10.0) * 0.5 + pow(sunDot, 3.0) * 0.3;
          sky = mix(sky, sunriseGlow, clamp(sunGlow, 0.0, 0.85));

          gl_FragColor = vec4(sky, 1.0);
        }
      `
    });

    this.skyMesh = new THREE.Mesh(skyGeo, skyMat);
    this.group.add(this.skyMesh);
  }

  initClouds() {
    const textureLoader = new THREE.TextureLoader();
    
    // Texture configuration: High-fidelity linear filtering & anisotropy to eliminate aliasing/pixelation
    const configureTexture = (tex) => {
      tex.minFilter = THREE.LinearFilter;
      tex.magFilter = THREE.LinearFilter;
      tex.generateMipmaps = false;
      if (this.scene && this.scene.skyRenderer && this.scene.skyRenderer.capabilities) {
        tex.anisotropy = Math.min(16, this.scene.skyRenderer.capabilities.getMaxAnisotropy());
      }
      tex.needsUpdate = true;
      return tex;
    };

    const cloudUrls = [
      'assets/clouds/cloud_1.png',
      'assets/clouds/cloud_2.png',
      'assets/clouds/cloud_3.png'
    ];

    const cloudTextures = cloudUrls.map(url => {
      const tex = textureLoader.load(url, (loadedTex) => {
        configureTexture(loadedTex);
      });
      return configureTexture(tex);
    });

    const cloudConfigs = [
      { count: 8, z: -55, scaleRange: [32, 55], yRange: [-8, 6], speed: 0.007, opacity: 0.85 },
      { count: 10, z: -95, scaleRange: [45, 75], yRange: [-6, 10], speed: 0.004, opacity: 0.75 },
      { count: 12, z: -140, scaleRange: [60, 110], yRange: [-4, 15], speed: 0.0025, opacity: 0.65 }
    ];

    cloudConfigs.forEach((layer, layerIdx) => {
      for (let i = 0; i < layer.count; i++) {
        const tex = cloudTextures[(i + layerIdx) % cloudTextures.length];
        const mat = new THREE.MeshBasicMaterial({
          map: tex,
          transparent: true,
          opacity: layer.opacity * (0.8 + Math.random() * 0.4),
          depthWrite: false,
          depthTest: false,
          blending: THREE.NormalBlending
        });

        const scaleW = layer.scaleRange[0] + Math.random() * (layer.scaleRange[1] - layer.scaleRange[0]);
        const scaleH = scaleW * (0.42 + Math.random() * 0.15);
        const geo = new THREE.PlaneGeometry(scaleW, scaleH);
        const mesh = new THREE.Mesh(geo, mat);

        const x = (Math.random() - 0.5) * 130;
        const y = layer.yRange[0] + Math.random() * (layer.yRange[1] - layer.yRange[0]);
        const z = layer.z + (Math.random() - 0.5) * 18;

        mesh.position.set(x, y, z);
        mesh.userData = {
          speed: layer.speed * (0.8 + Math.random() * 0.4),
          baseX: x,
          baseY: y,
          layerZ: z,
          wrapWidth: 140
        };

        this.cloudMeshes.push(mesh);
        this.group.add(mesh);
      }
    });
  }

  initAtmosphericHaze() {
    const canvas = document.createElement('canvas');
    canvas.width = 256;
    canvas.height = 256;
    const ctx = canvas.getContext('2d');
    const grad = ctx.createRadialGradient(128, 128, 0, 128, 128, 128);
    grad.addColorStop(0, 'rgba(255, 248, 225, 0.7)');
    grad.addColorStop(0.3, 'rgba(255, 235, 175, 0.35)');
    grad.addColorStop(0.7, 'rgba(255, 220, 140, 0.1)');
    grad.addColorStop(1, 'rgba(255, 220, 140, 0)');
    ctx.fillStyle = grad;
    ctx.fillRect(0, 0, 256, 256);

    const sunTex = new THREE.CanvasTexture(canvas);
    const sunMat = new THREE.SpriteMaterial({
      map: sunTex,
      transparent: true,
      opacity: 0.75,
      blending: THREE.AdditiveBlending,
      depthWrite: false
    });
    const sunSprite = new THREE.Sprite(sunMat);
    sunSprite.position.set(22, 18, -45);
    sunSprite.scale.set(38, 38, 1);
    this.group.add(sunSprite);
    this.sunSprite = sunSprite;
  }

  update(delta, mouseParallax) {
    this.time += delta;

    this.cloudMeshes.forEach(mesh => {
      mesh.position.x += mesh.userData.speed * 60 * delta;
      if (mesh.position.x > mesh.userData.wrapWidth / 2) {
        mesh.position.x = -mesh.userData.wrapWidth / 2;
      }
      mesh.position.y = mesh.userData.baseY + Math.sin(this.time * 0.3 + mesh.position.x * 0.05) * 0.18;
    });

    if (mouseParallax) {
      this.group.position.x = mouseParallax.x * 0.55;
      this.group.position.y = mouseParallax.y * 0.35;
    }
  }
}

window.ApecSky = ApecSky;
