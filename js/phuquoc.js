/**
 * APEC VIET NAM 2027 — Layer 03: Central Phu Quoc Fish-Eye World
 * Miniature planet-like curved floating world showcasing the central APEC Summit dome venue
 */

class PhuQuocWorld {
  constructor(scene) {
    this.scene = scene;
    this.group = new THREE.Group();
    this.scene.add(this.group);

    // Central Phu Quoc World configuration
    const cfg = window.APEC_CONFIG.scene.phuquoc;
    this.baseY = (cfg && cfg.groupY !== undefined) ? cfg.groupY : -1.2;

    this.group.scale.set(0.36, 0.36, 0.36);
    this.group.position.set(0, this.baseY, 0);

    this.time = 0;
    this.hoverIntensity = 0;
    this.targetHoverIntensity = 0;

    this.initWorldMesh();
    this.initVenueBeacon();
    this.initAtmosphericGlow();
  }

  initWorldMesh() {
    const textureLoader = new THREE.TextureLoader();
    const fisheyeTexture = textureLoader.load('assets/phuquoc-fisheye.jpg');
    fisheyeTexture.generateMipmaps = true;
    fisheyeTexture.minFilter = THREE.LinearMipmapLinearFilter;

    const segments = 96;
    const cfg = window.APEC_CONFIG.scene.phuquoc;
    const radius = cfg.radius;
    const geo = new THREE.PlaneGeometry(radius * 2, radius * 2, segments, segments);

    // Convex spherical curvature
    const pos = geo.attributes.position;
    for (let i = 0; i < pos.count; i++) {
      const x = pos.getX(i);
      const y = pos.getY(i);
      const distSq = (x * x + y * y) / (radius * radius);
      if (distSq <= 1.0) {
        const z = Math.sqrt(Math.max(0, 1.0 - distSq * 0.94)) * 3.2 - 3.2;
        pos.setZ(i, z);
      } else {
        pos.setZ(i, -3.2);
      }
    }
    geo.computeVertexNormals();

    this.worldMaterial = new THREE.ShaderMaterial({
      transparent: true,
      uniforms: {
        uTexture: { value: fisheyeTexture },
        uTime: { value: 0 },
        uHover: { value: 0 },
        uSunDir: { value: new THREE.Vector3(0.5, 0.7, 0.4).normalize() }
      },
      vertexShader: `
        varying vec2 vUv;
        varying vec3 vNormal;
        varying vec3 vWorldPosition;

        void main() {
          vUv = uv;
          vNormal = normalize(normalMatrix * normal);
          vec4 worldPos = modelMatrix * vec4(position, 1.0);
          vWorldPosition = worldPos.xyz;
          gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
        }
      `,
      fragmentShader: `
        uniform sampler2D uTexture;
        uniform float uTime;
        uniform float uHover;
        uniform vec3 uSunDir;
        varying vec2 vUv;
        varying vec3 vNormal;
        varying vec3 vWorldPosition;

        void main() {
          vec2 center = vec2(0.5, 0.5);
          float dist = length(vUv - center);

          // Soft feathered alpha falloff at planet rim blending into sky
          float alpha = smoothstep(0.498, 0.465, dist);
          if (alpha <= 0.001) discard;

          vec4 texColor = texture2D(uTexture, vUv);

          // Ocean specular highlight
          vec3 viewDir = normalize(cameraPosition - vWorldPosition);
          vec3 halfVector = normalize(uSunDir + viewDir);
          float NdotH = max(0.0, dot(vNormal, halfVector));
          float spec = pow(NdotH, 20.0) * 0.28;

          vec3 col = texColor.rgb + vec3(1.0, 0.94, 0.8) * spec;

          // Dome venue glow (UV ~ (0.543, 0.531))
          vec2 venueUv = vec2(0.543, 0.531);
          float venueDist = length(vUv - venueUv);
          float venueGlow = smoothstep(0.14, 0.0, venueDist) * (0.15 + 0.25 * uHover);
          col += vec3(1.0, 0.82, 0.45) * venueGlow;

          // Contrast boost on hover
          col = mix(col, pow(col, vec3(0.94)) * 1.05, uHover * 0.4);

          gl_FragColor = vec4(col, alpha);
        }
      `
    });

    this.mesh = new THREE.Mesh(geo, this.worldMaterial);
    this.mesh.position.set(0, cfg.yOffset, cfg.zOffset);
    this.mesh.rotation.x = cfg.rotationX;

    this.group.add(this.mesh);
  }

  initVenueBeacon() {
    // Precise anchor on the central convention dome
    const ringGeo = new THREE.RingGeometry(0.35, 0.48, 64);
    this.ringMat = new THREE.MeshBasicMaterial({
      color: 0xffd154,
      transparent: true,
      opacity: 0.85,
      side: THREE.DoubleSide,
      blending: THREE.AdditiveBlending,
      depthWrite: false
    });
    this.venueRing = new THREE.Mesh(ringGeo, this.ringMat);
    this.venueRing.position.set(0.9, 0.65, 0.05);
    this.mesh.add(this.venueRing);

    // Central pulsing beacon sprite
    const canvas = document.createElement('canvas');
    canvas.width = 128;
    canvas.height = 128;
    const ctx = canvas.getContext('2d');
    const grad = ctx.createRadialGradient(64, 64, 0, 64, 64, 64);
    grad.addColorStop(0, 'rgba(255, 245, 170, 1.0)');
    grad.addColorStop(0.3, 'rgba(255, 195, 60, 0.7)');
    grad.addColorStop(0.65, 'rgba(240, 130, 25, 0.2)');
    grad.addColorStop(1, 'rgba(240, 130, 25, 0)');
    ctx.fillStyle = grad;
    ctx.fillRect(0, 0, 128, 128);

    const glowTex = new THREE.CanvasTexture(canvas);
    const glowMat = new THREE.SpriteMaterial({
      map: glowTex,
      transparent: true,
      opacity: 0.9,
      blending: THREE.AdditiveBlending,
      depthWrite: false
    });
    this.venueGlow = new THREE.Sprite(glowMat);
    this.venueGlow.position.set(0.9, 0.65, 0.1);
    this.venueGlow.scale.set(1.4, 1.4, 1);
    this.mesh.add(this.venueGlow);
  }

  initAtmosphericGlow() {
    // Soft outer atmosphere aura encircling Phu Quoc world
    const cfg = window.APEC_CONFIG.scene.phuquoc;
    const auraGeo = new THREE.RingGeometry(cfg.radius * 0.95, cfg.radius * 1.35, 64);
    const auraMat = new THREE.ShaderMaterial({
      transparent: true,
      depthWrite: false,
      blending: THREE.AdditiveBlending,
      side: THREE.DoubleSide,
      uniforms: {
        uColor: { value: new THREE.Color(0x38bdf8) }
      },
      vertexShader: `
        varying vec2 vUv;
        void main() {
          vUv = uv;
          gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
        }
      `,
      fragmentShader: `
        varying vec2 vUv;
        uniform vec3 uColor;
        void main() {
          float d = length(vUv - vec2(0.5));
          // Very soft Gaussian aura fade
          float alpha = smoothstep(0.5, 0.35, d) * smoothstep(0.15, 0.38, d) * 0.32;
          gl_FragColor = vec4(uColor, alpha);
        }
      `
    });

    this.auraMesh = new THREE.Mesh(auraGeo, auraMat);
    this.auraMesh.position.set(0, cfg.yOffset, cfg.zOffset - 0.2);
    this.auraMesh.rotation.x = cfg.rotationX;
    this.group.add(this.auraMesh);
  }

  setHover(isHovered) {
    this.targetHoverIntensity = isHovered ? 1.0 : 0.0;
  }

  update(delta, mouseParallax) {
    this.time += delta;

    this.hoverIntensity += (this.targetHoverIntensity - this.hoverIntensity) * 0.08;
    this.worldMaterial.uniforms.uTime.value = this.time;
    this.worldMaterial.uniforms.uHover.value = this.hoverIntensity;

    // Levitation breathing
    const levitation = Math.sin(this.time * 1.15) * 0.12;
    const cfg = window.APEC_CONFIG.scene.phuquoc;
    this.mesh.position.y = cfg.yOffset + levitation;
    this.auraMesh.position.y = cfg.yOffset + levitation;

    // Pulse animation
    const pulse = 1.0 + Math.sin(this.time * 2.8) * 0.2;
    const ringProgress = (this.time * 0.75) % 1.0;
    const ringScale = 0.9 + ringProgress * 0.8;
    const ringOpacity = Math.max(0, 1.0 - ringProgress) * 0.75;

    this.venueRing.scale.set(ringScale, ringScale, 1);
    this.ringMat.opacity = ringOpacity * (1.0 + this.hoverIntensity * 0.5);
    this.venueGlow.scale.set(1.5 * pulse, 1.5 * pulse, 1);

    if (mouseParallax) {
      this.group.position.x = mouseParallax.x * 0.8;
      this.group.position.y = this.baseY + mouseParallax.y * 0.6;
      this.group.rotation.y = mouseParallax.x * 0.025;
    }
  }
}

window.PhuQuocWorld = PhuQuocWorld;
