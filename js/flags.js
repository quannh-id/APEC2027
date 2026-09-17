/**
 * APEC VIET NAM 2027 — Layer 02: 21 APEC Member Economies Curved 3D Marquee System
 * Continuous conveyor ribbon behind the Phu Quoc sphere matching summit reference layout
 */

class FlagOrbitSystem {
  constructor(scene, camera) {
    this.scene = scene;
    this.camera = camera;
    this.group = new THREE.Group();
    this.scene.add(this.group);

    this.flags = [];
    this.flagMeshes = [];
    this.time = 0;
    this.scrollOffset = 0;
    this.marqueeSpeed = 1.0;
    this.targetMarqueeSpeed = 1.0;
    this.hoveredFlag = null;

    // Drag interaction state
    this.isDragging = false;
    this.prevDragX = 0;
    this.dragVelocity = 0;

    this.initMarqueeParams();
    this.initFlags();
    this.initDragListeners();
  }

  initMarqueeParams() {
    const mq = window.APEC_CONFIG.scene.marquee;
    this.cardWidth = mq.cardWidth;
    this.cardHeight = mq.cardHeight;
    this.spacing = mq.spacing;
    this.curveRadius = mq.curveRadius;
    this.zBase = mq.zBase;
    this.yBase = mq.yBase;
    this.baseSpeed = mq.speed;
    this.totalLength = window.APEC_CONFIG.memberEconomies.length * this.spacing;
  }

  initFlags() {
    const economies = window.APEC_CONFIG.memberEconomies;
    const textureLoader = new THREE.TextureLoader();

    // Standard 3:2 ratio plane geometry with cloth subdivision
    const segX = 20;
    const segY = 16;
    const flagGeo = new THREE.PlaneGeometry(this.cardWidth, this.cardHeight, segX, segY);

    economies.forEach((eco, index) => {
      const texture = textureLoader.load(eco.flagUrl);
      texture.generateMipmaps = true;
      texture.minFilter = THREE.LinearMipmapLinearFilter;

      const flagMat = new THREE.ShaderMaterial({
        side: THREE.DoubleSide,
        transparent: true,
        uniforms: {
          uTexture: { value: texture },
          uTime: { value: 0 },
          uIndex: { value: index },
          uHover: { value: 0.0 },
          uSunDir: { value: new THREE.Vector3(0.6, 0.8, 0.4).normalize() }
        },
        vertexShader: `
          uniform float uTime;
          uniform float uIndex;
          uniform float uHover;
          varying vec2 vUv;
          varying vec3 vNormal;
          varying vec3 vWorldPos;

          void main() {
            vUv = uv;
            vec3 pos = position;

            // Subtle cloth wave ripple across horizontal card
            float wave = sin(uTime * 1.8 + pos.x * 2.2 + uIndex * 0.6) * 0.045 * (1.0 - uHover * 0.6);
            pos.z += wave;

            vec4 worldPosition = modelMatrix * vec4(pos, 1.0);
            vWorldPos = worldPosition.xyz;
            vNormal = normalize(normalMatrix * normal);
            gl_Position = projectionMatrix * viewMatrix * worldPosition;
          }
        `,
        fragmentShader: `
          uniform sampler2D uTexture;
          uniform float uHover;
          uniform vec3 uSunDir;
          varying vec2 vUv;
          varying vec3 vNormal;
          varying vec3 vWorldPos;

          void main() {
            vec2 uvCoord = gl_FrontFacing ? vUv : vec2(1.0 - vUv.x, vUv.y);
            vec4 tex = texture2D(uTexture, uvCoord);
            if (tex.a < 0.03) discard;

            vec3 norm = normalize(vNormal);
            if (!gl_FrontFacing) norm = -norm;

            float diff = max(0.0, dot(norm, uSunDir)) * 0.28 + 0.72;

            vec3 viewDir = normalize(cameraPosition - vWorldPos);
            vec3 halfVec = normalize(uSunDir + viewDir);
            float spec = pow(max(0.0, dot(norm, halfVec)), 16.0) * 0.22;

            vec3 color = tex.rgb * diff + vec3(1.0, 0.95, 0.85) * spec;
            color += vec3(0.08, 0.12, 0.16) * uHover;

            gl_FragColor = vec4(color, tex.a);
          }
        `
      });

      const mesh = new THREE.Mesh(flagGeo, flagMat);
      mesh.userData = {
        economy: eco,
        index: index,
        baseSlot: index * this.spacing,
        currentHover: 0,
        targetHover: 0,
        currentPos: new THREE.Vector3(),
        isFlagCard: true
      };

      this.flags.push(mesh);
      this.flagMeshes.push(mesh);
      this.group.add(mesh);
    });
  }

  initDragListeners() {
    window.addEventListener('mousedown', (e) => {
      if (e.button === 0 && !e.target.closest('button') && !e.target.closest('a')) {
        this.isDragging = true;
        this.prevDragX = e.clientX;
        this.dragVelocity = 0;
      }
    });

    window.addEventListener('mousemove', (e) => {
      if (this.isDragging) {
        const deltaX = e.clientX - this.prevDragX;
        this.prevDragX = e.clientX;
        this.scrollOffset -= deltaX * 0.025;
        this.dragVelocity = -deltaX * 0.025;
      }
    });

    window.addEventListener('mouseup', () => {
      this.isDragging = false;
    });

    // Touch drag support
    window.addEventListener('touchstart', (e) => {
      if (e.touches.length === 1) {
        this.isDragging = true;
        this.prevDragX = e.touches[0].clientX;
        this.dragVelocity = 0;
      }
    }, { passive: true });

    window.addEventListener('touchmove', (e) => {
      if (this.isDragging && e.touches.length === 1) {
        const deltaX = e.touches[0].clientX - this.prevDragX;
        this.prevDragX = e.touches[0].clientX;
        this.scrollOffset -= deltaX * 0.025;
        this.dragVelocity = -deltaX * 0.025;
      }
    }, { passive: true });

    window.addEventListener('touchend', () => {
      this.isDragging = false;
    });
  }

  setHoveredFlag(mesh) {
    if (this.hoveredFlag === mesh) return;

    if (this.hoveredFlag) {
      this.hoveredFlag.userData.targetHover = 0;
    }

    this.hoveredFlag = mesh;

    if (mesh) {
      mesh.userData.targetHover = 1.0;
      this.targetMarqueeSpeed = window.APEC_CONFIG.scene.marquee.hoverDecelFactor;
    } else {
      this.targetMarqueeSpeed = 1.0;
    }
  }

  update(delta, mouseParallax, reducedMotion) {
    // Speed lerp
    this.marqueeSpeed += (this.targetMarqueeSpeed - this.marqueeSpeed) * 0.08;

    // Advance continuous marquee conveyor if not actively dragging
    if (!this.isDragging && !reducedMotion) {
      this.scrollOffset += this.baseSpeed * this.marqueeSpeed * delta;
      // Apply momentum decay from drag
      if (Math.abs(this.dragVelocity) > 0.001) {
        this.scrollOffset += this.dragVelocity;
        this.dragVelocity *= 0.92;
      }
    }

    this.time += delta;
    const L = this.totalLength;
    const R = this.curveRadius;

    this.flags.forEach((mesh) => {
      const idx = mesh.userData.index;

      // Hover lerp
      mesh.userData.currentHover += (mesh.userData.targetHover - mesh.userData.currentHover) * 0.12;
      const hover = mesh.userData.currentHover;

      mesh.material.uniforms.uTime.value = this.time;
      mesh.material.uniforms.uHover.value = hover;

      // Calculate position along circular marquee track
      // s wrapped symmetrically between -L/2 and +L/2
      let s = (mesh.userData.baseSlot + this.scrollOffset) % L;
      if (s < 0) s += L;
      s -= L / 2;

      // Concave cylindrical arc (matching reference image)
      const angle = s / R;
      const x = R * Math.sin(angle);
      // z is placed behind the sphere (zBase < 0) and curves further backward towards the edges
      const z = this.zBase - R * (1.0 - Math.cos(angle)) + hover * 1.1;
      const y = this.yBase + Math.cos(angle * 0.6) * 0.15 + hover * 0.2;

      mesh.position.set(x, y, z);
      mesh.userData.currentPos.copy(mesh.position);

      // Orientation: cards face inward along the curve
      mesh.rotation.y = -angle * (1.0 - hover * 0.8);
      mesh.rotation.x = -0.05;

      // Scale boost on hover
      const scale = 1.0 + hover * 0.18;
      mesh.scale.set(scale, scale, 1.0);

      // Frustum/range culling: fade cards smoothly at extreme edges
      const distFromCenter = Math.abs(x);
      const edgeFade = THREE.MathUtils.smoothstep(22.0, 16.0, distFromCenter);
      mesh.material.opacity = Math.max(0.15, edgeFade);
    });

    // Gentle mouse parallax on the marquee ribbon
    if (mouseParallax) {
      this.group.position.x = mouseParallax.x * 0.85;
      this.group.position.y = mouseParallax.y * 0.6;
    }
  }
}

window.FlagOrbitSystem = FlagOrbitSystem;
