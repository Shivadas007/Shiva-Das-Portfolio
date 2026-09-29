/**
 * Three.js 3D Interactive Environments
 * Hero Celestial Object, Skill Constellation Radar, Background Dust, and Project Orbs
 */

import * as THREE from 'three';
import { portfolioConfig } from './config.js';

// Fallback to window.THREE if loaded via CDN
const ThreeLib = typeof THREE !== 'undefined' ? THREE : (window.THREE || null);

export class SceneManager {
  constructor() {
    this.mouse = { x: 0, y: 0, targetX: 0, targetY: 0 };
    this.isReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    
    // Bind mouse tracking
    window.addEventListener('mousemove', (e) => {
      this.mouse.targetX = (e.clientX / window.innerWidth) * 2 - 1;
      this.mouse.targetY = -(e.clientY / window.innerHeight) * 2 + 1;
    }, { passive: true });
    
    this.initBackgroundDust();
    this.initHeroObject();
    this.initConstellation();
    this.initProjectCanvases();
  }

  /* ========================================================================
     1. BACKGROUND DUST PARTICLES
     ======================================================================== */
  initBackgroundDust() {
    const canvas = document.getElementById('bg-canvas');
    if (!canvas || !ThreeLib) return;

    const renderer = new ThreeLib.WebGLRenderer({ canvas, alpha: true, antialias: false, powerPreference: 'low-power' });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 1.5));
    renderer.setSize(window.innerWidth, window.innerHeight);

    const scene = new ThreeLib.Scene();
    const camera = new ThreeLib.PerspectiveCamera(60, window.innerWidth / window.innerHeight, 1, 1000);
    camera.position.z = 400;

    const particleCount = this.isReducedMotion ? 40 : 120;
    const geometry = new ThreeLib.BufferGeometry();
    const positions = new Float32Array(particleCount * 3);
    const colors = new Float32Array(particleCount * 3);

    const color1 = new ThreeLib.Color('#00f0ff');
    const color2 = new ThreeLib.Color('#ff007f');
    const color3 = new ThreeLib.Color('#38bdf8');

    for (let i = 0; i < particleCount; i++) {
      positions[i * 3] = (Math.random() - 0.5) * 1200;
      positions[i * 3 + 1] = (Math.random() - 0.5) * 1200;
      positions[i * 3 + 2] = (Math.random() - 0.5) * 600;

      const c = Math.random() < 0.4 ? color1 : (Math.random() < 0.7 ? color2 : color3);
      colors[i * 3] = c.r;
      colors[i * 3 + 1] = c.g;
      colors[i * 3 + 2] = c.b;
    }

    geometry.setAttribute('position', new ThreeLib.BufferAttribute(positions, 3));
    geometry.setAttribute('color', new ThreeLib.BufferAttribute(colors, 3));

    // Particle sprite
    const pMaterial = new ThreeLib.PointsMaterial({
      size: 2.5,
      vertexColors: true,
      transparent: true,
      opacity: 0.35,
      blending: ThreeLib.AdditiveBlending
    });

    const particles = new ThreeLib.Points(geometry, pMaterial);
    scene.add(particles);

    const animate = () => {
      requestAnimationFrame(animate);
      if (!this.isReducedMotion) {
        particles.rotation.y += 0.0003;
        particles.rotation.x += 0.0001;
      }
      renderer.render(scene, camera);
    };
    animate();

    window.addEventListener('resize', () => {
      camera.aspect = window.innerWidth / window.innerHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(window.innerWidth, window.innerHeight);
    }, { passive: true });
  }

  /* ========================================================================
     2. HERO 3D CELESTIAL ORBITAL OBJECT
     ======================================================================== */
  initHeroObject() {
    const canvas = document.getElementById('hero-three-canvas');
    if (!canvas || !ThreeLib) return;

    const container = canvas.parentElement;
    const width = container.clientWidth || 500;
    const height = container.clientHeight || 500;

    const renderer = new ThreeLib.WebGLRenderer({ canvas, alpha: true, antialias: true, powerPreference: 'high-performance' });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.setSize(width, height);

    const scene = new ThreeLib.Scene();
    const camera = new ThreeLib.PerspectiveCamera(45, width / height, 0.1, 1000);
    camera.position.z = 24;

    const heroGroup = new ThreeLib.Group();
    scene.add(heroGroup);

    // 1. Central Core Sphere
    const sphereGeo = new ThreeLib.SphereGeometry(4.8, 64, 64);
    const sphereMat = new ThreeLib.MeshPhysicalMaterial({
      color: new ThreeLib.Color('#030810'),
      emissive: new ThreeLib.Color('#002b40'),
      emissiveIntensity: 0.4,
      roughness: 0.25,
      metalness: 0.85,
      clearcoat: 1.0,
      clearcoatRoughness: 0.1
    });
    const coreSphere = new ThreeLib.Mesh(sphereGeo, sphereMat);
    heroGroup.add(coreSphere);

    // 2. Inner Pulsing Energy Glow Sphere
    const innerGeo = new ThreeLib.SphereGeometry(3.2, 32, 32);
    const innerMat = new ThreeLib.MeshBasicMaterial({
      color: new ThreeLib.Color('#ff007f'),
      transparent: true,
      opacity: 0.25,
      blending: ThreeLib.AdditiveBlending
    });
    const innerSphere = new ThreeLib.Mesh(innerGeo, innerMat);
    heroGroup.add(innerSphere);

    // 3. Central "SD" Text Monogram Mesh (Fixed on front facing camera, slow blinking)
    const createMonogramSprite = () => {
      const textCanvas = document.createElement('canvas');
      textCanvas.width = 512;
      textCanvas.height = 512;
      const ctx = textCanvas.getContext('2d');

      ctx.fillStyle = '#ffffff';
      ctx.font = '900 170px "Space Grotesk", "Syne", sans-serif';
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.shadowColor = '#00f0ff';
      ctx.shadowBlur = 35;
      ctx.fillText('SD', 256, 256);

      const texture = new ThreeLib.CanvasTexture(textCanvas);
      texture.needsUpdate = true;
      const spriteMat = new ThreeLib.SpriteMaterial({
        map: texture,
        transparent: true,
        blending: ThreeLib.AdditiveBlending,
        opacity: 0.95
      });
      const sprite = new ThreeLib.Sprite(spriteMat);
      sprite.scale.set(6.2, 6.2, 1);
      // Place directly in scene in front of core sphere so it stays anchored on front facing user
      sprite.position.set(0, 0, 5.0);
      return sprite;
    };
    const sdSprite = createMonogramSprite();
    scene.add(sdSprite);

    // 4. Orbital Rings
    const createOrbitalRing = (radius, tube, colorHex, rx, ry, rz) => {
      const ringGroup = new ThreeLib.Group();
      ringGroup.rotation.set(rx, ry, rz);

      // Torus ring
      const torusGeo = new ThreeLib.TorusGeometry(radius, tube, 16, 120);
      const torusMat = new ThreeLib.MeshBasicMaterial({
        color: new ThreeLib.Color(colorHex),
        transparent: true,
        opacity: 0.75,
        blending: ThreeLib.AdditiveBlending
      });
      const torus = new ThreeLib.Mesh(torusGeo, torusMat);
      ringGroup.add(torus);

      // Orbiting satellite bead
      const beadGeo = new ThreeLib.SphereGeometry(0.35, 16, 16);
      const beadMat = new ThreeLib.MeshBasicMaterial({
        color: new ThreeLib.Color('#ffffff'),
        blending: ThreeLib.AdditiveBlending
      });
      const bead = new ThreeLib.Mesh(beadGeo, beadMat);
      bead.position.x = radius;
      ringGroup.add(bead);

      return { group: ringGroup, torus, bead, radius };
    };

    // Ring 1: Cyan, inclined ~25 deg
    const ring1 = createOrbitalRing(7.2, 0.035, '#00f0ff', 0.45, 0.2, 0.1);
    heroGroup.add(ring1.group);

    // Ring 2: Magenta, inclined -35 deg
    const ring2 = createOrbitalRing(8.4, 0.035, '#ff007f', -0.65, 0.4, 0.35);
    heroGroup.add(ring2.group);

    // Ring 3: Electric Blue / Purple, inclined 60 deg
    const ring3 = createOrbitalRing(9.6, 0.03, '#00b4d8', 1.05, -0.3, 0.8);
    heroGroup.add(ring3.group);

    // 5. Surrounding Swarm Particles
    const swarmCount = 180;
    const swarmGeo = new ThreeLib.BufferGeometry();
    const swarmPos = new Float32Array(swarmCount * 3);
    const swarmCols = new Float32Array(swarmCount * 3);
    const cCyan = new ThreeLib.Color('#00f0ff');
    const cMag = new ThreeLib.Color('#ff007f');

    for (let i = 0; i < swarmCount; i++) {
      const u = Math.random();
      const v = Math.random();
      const theta = u * 2.0 * Math.PI;
      const phi = Math.acos(2.0 * v - 1.0);
      const r = 6.0 + Math.random() * 5.0;

      swarmPos[i * 3] = r * Math.sin(phi) * Math.cos(theta);
      swarmPos[i * 3 + 1] = r * Math.sin(phi) * Math.sin(theta);
      swarmPos[i * 3 + 2] = r * Math.cos(phi);

      const col = Math.random() > 0.5 ? cCyan : cMag;
      swarmCols[i * 3] = col.r;
      swarmCols[i * 3 + 1] = col.g;
      swarmCols[i * 3 + 2] = col.b;
    }
    swarmGeo.setAttribute('position', new ThreeLib.BufferAttribute(swarmPos, 3));
    swarmGeo.setAttribute('color', new ThreeLib.BufferAttribute(swarmCols, 3));

    const swarmMat = new ThreeLib.PointsMaterial({
      size: 0.18,
      vertexColors: true,
      transparent: true,
      opacity: 0.7,
      blending: ThreeLib.AdditiveBlending
    });
    const swarm = new ThreeLib.Points(swarmGeo, swarmMat);
    heroGroup.add(swarm);

    // 6. Dual Point Lights
    const cyanLight = new ThreeLib.PointLight('#00f0ff', 50, 40);
    cyanLight.position.set(10, 8, 12);
    scene.add(cyanLight);

    const magLight = new ThreeLib.PointLight('#ff007f', 40, 40);
    magLight.position.set(-10, -8, 10);
    scene.add(magLight);

    const ambientLight = new ThreeLib.AmbientLight('#040c18', 2.0);
    scene.add(ambientLight);

    // Animation Loop with smooth mouse parallax
    let clock = new ThreeLib.Clock();
    const animateHero = () => {
      requestAnimationFrame(animateHero);
      const delta = clock.getDelta();
      const time = clock.getElapsedTime();

      // Smooth mouse lerp
      this.mouse.x += (this.mouse.targetX - this.mouse.x) * 0.05;
      this.mouse.y += (this.mouse.targetY - this.mouse.y) * 0.05;

      // Parallax rotation for orbital group
      heroGroup.rotation.y = time * 0.15 + this.mouse.x * 0.35;
      heroGroup.rotation.x = this.mouse.y * 0.25;

      // Slow breathing blink for SD monogram anchored in front
      const sdOpacity = 0.55 + Math.sin(time * 1.8) * 0.42; // gentle pulsing blink between 0.55 and 0.97
      sdSprite.material.opacity = sdOpacity;
      // Slight parallax offset so it floats perfectly in front with depth
      sdSprite.position.x = this.mouse.x * 0.6;
      sdSprite.position.y = this.mouse.y * 0.5;

      // Inner sphere pulsing
      const pulse = 1.0 + Math.sin(time * 2.5) * 0.06;
      innerSphere.scale.set(pulse, pulse, pulse);

      // Rotate orbital rings
      ring1.group.rotation.z += 0.008;
      ring2.group.rotation.z -= 0.006;
      ring3.group.rotation.z += 0.004;

      // Rotate particle swarm
      swarm.rotation.y += 0.003;

      renderer.render(scene, camera);
    };
    animateHero();

    // Resize Handler
    const handleResize = () => {
      const w = container.clientWidth || 500;
      const h = container.clientHeight || 500;
      camera.aspect = w / h;
      camera.updateProjectionMatrix();
      renderer.setSize(w, h);
    };
    window.addEventListener('resize', handleResize, { passive: true });
  }

  /* ========================================================================
     3. SKILL CONSTELLATION ORBITAL RADAR
     ======================================================================== */
  initConstellation() {
    const canvas = document.getElementById('constellation-three-canvas');
    if (!canvas || !ThreeLib) return;

    const container = canvas.parentElement;
    const width = container.clientWidth || 900;
    const height = container.clientHeight || 680;

    const renderer = new ThreeLib.WebGLRenderer({ canvas, alpha: true, antialias: true });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.setSize(width, height);

    const scene = new ThreeLib.Scene();
    const camera = new ThreeLib.PerspectiveCamera(48, width / height, 1, 2000);
    // Adjusted camera distance and elevation to make the constellation fill the box prominently
    camera.position.set(0, -35, 410);
    camera.lookAt(0, 0, 0);

    const constellationGroup = new ThreeLib.Group();
    scene.add(constellationGroup);

    // 1. Concentric and Elliptical Orbital Tracks (Enlarged to fit full box width & height)
    const orbits = [
      { r: 110, color: '#00f0ff', op: 0.35, tilt: 0.1 },
      { r: 180, color: '#ff007f', op: 0.3, tilt: -0.15 },
      { r: 250, color: '#00f0ff', op: 0.25, tilt: 0.05 },
      { r: 310, color: '#8a2be2', op: 0.2, tilt: -0.08 }
    ];

    orbits.forEach((orb) => {
      const curve = new ThreeLib.EllipseCurve(0, 0, orb.r, orb.r * 0.45, 0, 2 * Math.PI, false, 0);
      const points = curve.getPoints(120);
      const geo = new ThreeLib.BufferGeometry().setFromPoints(points);
      const mat = new ThreeLib.LineBasicMaterial({
        color: new ThreeLib.Color(orb.color),
        transparent: true,
        opacity: orb.op
      });
      const line = new ThreeLib.Line(geo, mat);
      line.rotation.x = -0.55 + orb.tilt;
      constellationGroup.add(line);
    });

    // 2. Rotating Radar Scanner Beam (Enlarged gradient sector)
    const radarGeo = new ThreeLib.RingGeometry(0, 320, 64, 1, 0, Math.PI * 0.35);
    const radarMat = new ThreeLib.ShaderMaterial({
      transparent: true,
      side: ThreeLib.DoubleSide,
      blending: ThreeLib.AdditiveBlending,
      uniforms: {
        color: { value: new ThreeLib.Color('#00f0ff') }
      },
      vertexShader: `
        varying vec2 vUv;
        void main() {
          vUv = uv;
          gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
        }
      `,
      fragmentShader: `
        uniform vec3 color;
        varying vec2 vUv;
        void main() {
          float alpha = smoothstep(0.0, 1.0, vUv.x) * 0.18;
          gl_FragColor = vec4(color, alpha);
        }
      `
    });
    const radarMesh = new ThreeLib.Mesh(radarGeo, radarMat);
    radarMesh.rotation.x = -0.55;
    constellationGroup.add(radarMesh);

    // 3. Central Core Glowing Hub
    const coreGeo = new ThreeLib.SphereGeometry(16, 32, 32);
    const coreMat = new ThreeLib.MeshBasicMaterial({
      color: new ThreeLib.Color('#00f0ff'),
      transparent: true,
      opacity: 0.18,
      blending: ThreeLib.AdditiveBlending
    });
    const core = new ThreeLib.Mesh(coreGeo, coreMat);
    constellationGroup.add(core);

    // 4. Interactive 3D Skill Node Markers
    // Non-overlapping distinct radii scaled up (from 105 to 330) to fill the canvas beautifully
    const nodeMeshes = [];
    const skillList = portfolioConfig.skills;
    const domSkillCards = document.querySelectorAll('.skill-node-card');

    // Each planet has a strictly separated orbital track radius (from 105 to 330)
    // Synchronized angular velocity (0.08 rad/s) preserving 45° (PI/4) angular separation so planets NEVER overlap!
    const planetParams = [
      { r: 105, angleOffset: 0.0,             color: '#00f0ff', size: 3.8, hasMoon: false }, // Node 01
      { r: 138, angleOffset: (Math.PI * 2) * 0.125, color: '#ff007f', size: 4.0, hasMoon: true },  // Node 02
      { r: 170, angleOffset: (Math.PI * 2) * 0.250, color: '#00f0ff', size: 4.6, hasMoon: false }, // Node 03
      { r: 202, angleOffset: (Math.PI * 2) * 0.375, color: '#38bdf8', size: 4.2, hasMoon: true },  // Node 04
      { r: 234, angleOffset: (Math.PI * 2) * 0.500, color: '#ff007f', size: 3.9, hasMoon: false }, // Node 05
      { r: 266, angleOffset: (Math.PI * 2) * 0.625, color: '#00f0ff', size: 4.8, hasMoon: true },  // Node 06
      { r: 298, angleOffset: (Math.PI * 2) * 0.750, color: '#8a2be2', size: 3.6, hasMoon: false }, // Node 07
      { r: 330, angleOffset: (Math.PI * 2) * 0.875, color: '#00f0ff', size: 4.4, hasMoon: true }   // Node 08
    ];

    skillList.forEach((sk, idx) => {
      const p = planetParams[idx];
      const nodeGroup = new ThreeLib.Group();
      
      // Node planet mesh
      const dotGeo = new ThreeLib.SphereGeometry(p.size, 16, 16);
      const dotMat = new ThreeLib.MeshBasicMaterial({
        color: new ThreeLib.Color(p.color),
        blending: ThreeLib.AdditiveBlending
      });
      const dotMesh = new ThreeLib.Mesh(dotGeo, dotMat);
      nodeGroup.add(dotMesh);

      // Outer glowing atmosphere ring
      const ringGeo = new ThreeLib.RingGeometry(p.size + 2.5, p.size + 4.2, 32);
      const ringMat = new ThreeLib.MeshBasicMaterial({
        color: new ThreeLib.Color(p.color),
        transparent: true,
        opacity: 0.6,
        side: ThreeLib.DoubleSide
      });
      const ringMesh = new ThreeLib.Mesh(ringGeo, ringMat);
      nodeGroup.add(ringMesh);

      // Optional orbiting moon
      let moon = null;
      if (p.hasMoon) {
        const moonGeo = new ThreeLib.SphereGeometry(1.2, 8, 8);
        const moonMat = new ThreeLib.MeshBasicMaterial({ color: new ThreeLib.Color('#ffffff') });
        moon = new ThreeLib.Mesh(moonGeo, moonMat);
        moon.position.x = p.size + 7;
        nodeGroup.add(moon);
      }

      // Connecting line geometry to center
      const linePositions = new Float32Array(6);
      const lineGeo = new ThreeLib.BufferGeometry();
      lineGeo.setAttribute('position', new ThreeLib.BufferAttribute(linePositions, 3));
      const lineMat = new ThreeLib.LineBasicMaterial({
        color: new ThreeLib.Color(p.color),
        transparent: true,
        opacity: 0.18
      });
      const lineMesh = new ThreeLib.Line(lineGeo, lineMat);
      constellationGroup.add(lineMesh);

      constellationGroup.add(nodeGroup);
      nodeMeshes.push({
        group: nodeGroup,
        domEl: domSkillCards[idx] || null,
        data: sk,
        params: p,
        line: lineMesh,
        ring: ringMesh,
        moon: moon
      });
    });

    // 5. Orbiting Technical Satellites with distinctive solar wings & communications
    const createSatellite = (trackRadius, speed, colorHex, tilt, initialAngle) => {
      const satGroup = new ThreeLib.Group();
      
      // Satellite central body bus
      const bodyGeo = new ThreeLib.BoxGeometry(3.5, 2.2, 2.2);
      const bodyMat = new ThreeLib.MeshBasicMaterial({ color: new ThreeLib.Color('#e0f2fe') });
      const body = new ThreeLib.Mesh(bodyGeo, bodyMat);
      satGroup.add(body);

      // Gold insulation foil core detail
      const foilGeo = new ThreeLib.BoxGeometry(1.6, 2.3, 2.3);
      const foilMat = new ThreeLib.MeshBasicMaterial({ color: new ThreeLib.Color('#f59e0b') });
      const foil = new ThreeLib.Mesh(foilGeo, foilMat);
      satGroup.add(foil);

      // Solar array wings
      const panelGeo = new ThreeLib.BoxGeometry(9.5, 0.3, 2.8);
      const panelMat = new ThreeLib.MeshBasicMaterial({ color: new ThreeLib.Color(colorHex) });
      const panel = new ThreeLib.Mesh(panelGeo, panelMat);
      satGroup.add(panel);

      // High-gain parabolic antenna dish
      const dishGeo = new ThreeLib.ConeGeometry(1.4, 1.6, 12, 1, true);
      const dishMat = new ThreeLib.MeshBasicMaterial({
        color: new ThreeLib.Color('#00f0ff'),
        side: ThreeLib.DoubleSide
      });
      const dish = new ThreeLib.Mesh(dishGeo, dishMat);
      dish.rotation.z = Math.PI * 0.5;
      dish.position.x = 2.6;
      satGroup.add(dish);

      // Pulsing telemetry radar beacon
      const beaconGeo = new ThreeLib.SphereGeometry(0.9, 12, 12);
      const beaconMat = new ThreeLib.MeshBasicMaterial({
        color: new ThreeLib.Color(colorHex),
        transparent: true,
        opacity: 0.95
      });
      const beacon = new ThreeLib.Mesh(beaconGeo, beaconMat);
      beacon.position.y = 1.8;
      satGroup.add(beacon);

      constellationGroup.add(satGroup);
      return { group: satGroup, radius: trackRadius, speed, tilt, beacon, currentAngle: initialAngle };
    };

    // Dedicated non-overlapping satellite orbital paths (between enlarged skill orbits: r=122, 186, 250, 314)
    const satellites = [
      createSatellite(122, 0.22, '#00f0ff', 0.25, 1.2),
      createSatellite(186, -0.18, '#ff007f', -0.30, 3.4),
      createSatellite(250, 0.15, '#38bdf8', 0.15, 0.5),
      createSatellite(314, -0.12, '#00f0ff', -0.20, 4.8)
    ];

    // 6. Realistic 3D Tumbling Asteroids & Planetary Small Debris Objects
    // Distributed on individual non-overlapping orbital bands with varying tilt, speeds, and shapes
    const spaceObjects = [];
    const debrisGroup = new ThreeLib.Group();
    constellationGroup.add(debrisGroup);

    // Band 1: Inner micro-asteroids (r: 152-159)
    // Band 2: Mid rocky asteroids (r: 216-224)
    // Band 3: Outer floating space debris & scrap metal fragments (r: 280-288)
    const debrisConfigs = [
      { count: 18, minR: 152, maxR: 159, minSize: 1.2, maxSize: 2.5, color: '#64748b', speed: 0.09 },
      { count: 24, minR: 216, maxR: 224, minSize: 1.5, maxSize: 3.5, color: '#94a3b8', speed: -0.07 },
      { count: 20, minR: 280, maxR: 288, minSize: 1.0, maxSize: 2.8, color: '#475569', speed: 0.06 }
    ];

    debrisConfigs.forEach((cfg, bandIdx) => {
      for (let i = 0; i < cfg.count; i++) {
        const size = cfg.minSize + Math.random() * (cfg.maxSize - cfg.minSize);
        // Vary geometries: dodecahedron, icosahedron, tetrahedrons for realistic space debris
        let geo;
        const geoType = i % 3;
        if (geoType === 0) {
          geo = new ThreeLib.DodecahedronGeometry(size, 0);
        } else if (geoType === 1) {
          geo = new ThreeLib.IcosahedronGeometry(size, 0);
        } else {
          geo = new ThreeLib.TetrahedronGeometry(size, 0);
        }

        const isScrapMetal = Math.random() > 0.65;
        const mat = new ThreeLib.MeshBasicMaterial({
          color: new ThreeLib.Color(isScrapMetal ? '#00f0ff' : cfg.color),
          wireframe: Math.random() > 0.5
        });

        const mesh = new ThreeLib.Mesh(geo, mat);
        debrisGroup.add(mesh);

        const trackRadius = cfg.minR + Math.random() * (cfg.maxR - cfg.minR);
        const startAngle = (i / cfg.count) * Math.PI * 2 + Math.random() * 0.3;
        const zElevation = (Math.random() - 0.5) * 22;

        spaceObjects.push({
          mesh,
          radius: trackRadius,
          angle: startAngle,
          speed: cfg.speed * (0.8 + Math.random() * 0.4),
          z: zElevation,
          rotX: (Math.random() - 0.5) * 0.04,
          rotY: (Math.random() - 0.5) * 0.04,
          rotZ: (Math.random() - 0.5) * 0.04
        });
      }
    });

    // 7. High-speed Shooting Meteors with trailing light lines
    const createMeteor = () => {
      const meteorGroup = new ThreeLib.Group();
      const headGeo = new ThreeLib.SphereGeometry(1.6, 8, 8);
      const headMat = new ThreeLib.MeshBasicMaterial({ color: new ThreeLib.Color('#ffffff') });
      const head = new ThreeLib.Mesh(headGeo, headMat);
      meteorGroup.add(head);

      const tailGeo = new ThreeLib.BufferGeometry();
      const tailPoints = [
        new ThreeLib.Vector3(0, 0, 0),
        new ThreeLib.Vector3(-45, -25, 0)
      ];
      tailGeo.setFromPoints(tailPoints);
      const tailMat = new ThreeLib.LineBasicMaterial({
        color: new ThreeLib.Color('#00f0ff'),
        transparent: true,
        opacity: 0.75
      });
      const tail = new ThreeLib.Line(tailGeo, tailMat);
      meteorGroup.add(tail);

      constellationGroup.add(meteorGroup);
      return {
        group: meteorGroup,
        active: false,
        reset() {
          this.group.position.set(
            180 + Math.random() * 150,
            120 + Math.random() * 100,
            (Math.random() - 0.5) * 80
          );
          this.speedX = -(180 + Math.random() * 120);
          this.speedY = -(100 + Math.random() * 70);
          this.active = true;
          this.group.visible = true;
        }
      };
    };

    const meteors = [createMeteor(), createMeteor()];
    let meteorCooldown = 0;

    // 8. Star Dust Background Particles
    const starCount = 120;
    const starGeo = new ThreeLib.BufferGeometry();
    const starPos = new Float32Array(starCount * 3);
    for (let i = 0; i < starCount; i++) {
      starPos[i * 3] = (Math.random() - 0.5) * 650;
      starPos[i * 3 + 1] = (Math.random() - 0.5) * 380;
      starPos[i * 3 + 2] = (Math.random() - 0.5) * 220;
    }
    starGeo.setAttribute('position', new ThreeLib.BufferAttribute(starPos, 3));
    const starMat = new ThreeLib.PointsMaterial({
      size: 2,
      color: new ThreeLib.Color('#00f0ff'),
      transparent: true,
      opacity: 0.35,
      blending: ThreeLib.AdditiveBlending
    });
    const starPoints = new ThreeLib.Points(starGeo, starMat);
    constellationGroup.add(starPoints);

    // Animation Loop
    let clock = new ThreeLib.Clock();
    const tempVec = new ThreeLib.Vector3();
    let baseSystemTime = 0;

    const animateConstellation = () => {
      requestAnimationFrame(animateConstellation);
      const delta = clock.getDelta();
      const time = clock.getElapsedTime();
      baseSystemTime += delta * (this.isReducedMotion ? 0.02 : 0.08); // Shared angular progression

      // Rotate radar sweep
      radarMesh.rotation.z = -time * 0.8;

      // Animate Tumbling Asteroids & Planetary Small Debris Objects
      spaceObjects.forEach(obj => {
        obj.angle += delta * obj.speed;
        const x = Math.cos(obj.angle) * obj.radius;
        const y = Math.sin(obj.angle) * (obj.radius * 0.45);
        obj.mesh.position.set(x, y - 20, obj.z);

        // Continuous tumbling on 3 axes
        obj.mesh.rotation.x += obj.rotX;
        obj.mesh.rotation.y += obj.rotY;
        obj.mesh.rotation.z += obj.rotZ;
      });

      // Animate Technical Satellites with distinctive solar wings and telemetry pings
      satellites.forEach(sat => {
        sat.currentAngle += delta * sat.speed;
        const sx = Math.cos(sat.currentAngle) * sat.radius;
        const sy = Math.sin(sat.currentAngle) * (sat.radius * 0.45);
        const sz = Math.sin(sat.currentAngle * 2) * 20;
        sat.group.position.set(sx, sy - 20, sz);
        sat.group.rotation.z = sat.currentAngle + Math.PI * 0.5 + sat.tilt;

        // Satellite radar beacon ping
        const bPulse = 0.5 + Math.sin(time * 5) * 0.5;
        sat.beacon.scale.set(1 + bPulse * 0.8, 1 + bPulse * 0.8, 1 + bPulse * 0.8);
      });

      // Animate Meteors
      meteorCooldown += delta;
      if (meteorCooldown > 3.2) {
        meteorCooldown = 0;
        const availableMeteor = meteors.find(m => !m.active) || meteors[0];
        availableMeteor.reset();
      }

      meteors.forEach(m => {
        if (m.active) {
          m.group.position.x += m.speedX * delta;
          m.group.position.y += m.speedY * delta;
          if (m.group.position.x < -300 || m.group.position.y < -200) {
            m.active = false;
            m.group.visible = false;
          }
        }
      });

      // Orbit each skill planet at their strictly separated radius & fixed phase offset
      // Since they share the synchronized baseSystemTime and separated offsets, they will NEVER overlap or collide!
      const isMobile = window.innerWidth <= 768;
      const scaleFactor = isMobile ? 0.65 : 1.0;

      nodeMeshes.forEach((item, index) => {
        const currentAngle = baseSystemTime + item.params.angleOffset;
        const rad = item.params.r * scaleFactor;
        const x = Math.cos(currentAngle) * rad;
        // Projected elliptic plane
        const y = Math.sin(currentAngle) * (rad * 0.45);
        const z = Math.sin(currentAngle * 2) * 12;

        item.group.position.set(x, y - 20, z);

        // Moon rotation
        if (item.moon) {
          const mTime = time * 2.5 + index;
          item.moon.position.x = Math.cos(mTime) * (item.params.size + 6);
          item.moon.position.y = Math.sin(mTime) * (item.params.size + 6);
        }

        // Pulse atmosphere ring
        const pulse = 1.0 + Math.sin(time * 3 + index) * 0.15;
        item.ring.scale.set(pulse, pulse, 1);

        // Update line to center
        const positions = item.line.geometry.attributes.position.array;
        positions[0] = 0;
        positions[1] = 0;
        positions[2] = 0;
        positions[3] = x;
        positions[4] = y - 20;
        positions[5] = z;
        item.line.geometry.attributes.position.needsUpdate = true;

        // Position corresponding DOM card so it follows its dedicated planet
        if (item.domEl && container) {
          item.group.getWorldPosition(tempVec);
          tempVec.project(camera);

          const screenX = (tempVec.x * 0.5 + 0.5) * container.clientWidth;
          const screenY = (-(tempVec.y * 0.5) + 0.5) * container.clientHeight;

          // Keep card cleanly bounded within container
          const boundedX = Math.max(85, Math.min(container.clientWidth - 85, screenX));
          const boundedY = Math.max(38, Math.min(container.clientHeight - 38, screenY));

          item.domEl.style.left = `${boundedX}px`;
          item.domEl.style.top = `${boundedY}px`;
        }
      });

      // Subtle scene tilt from mouse
      constellationGroup.rotation.y = this.mouse.x * 0.08;
      constellationGroup.rotation.x = -this.mouse.y * 0.05;

      renderer.render(scene, camera);
    };
    animateConstellation();

    // Resize
    window.addEventListener('resize', () => {
      const w = container.clientWidth || 900;
      const h = container.clientHeight || 600;
      camera.aspect = w / h;
      camera.updateProjectionMatrix();
      renderer.setSize(w, h);
    }, { passive: true });
  }

  /* ========================================================================
     4. PROJECT CARD MINI CANVASES
     ======================================================================== */
  initProjectCanvases() {
    const canvases = document.querySelectorAll('.project-canvas');
    if (!canvases.length || !ThreeLib) return;

    canvases.forEach((canvas, index) => {
      const project = portfolioConfig.projects[index];
      if (!project) return;

      const renderer = new ThreeLib.WebGLRenderer({ canvas, alpha: true, antialias: true });
      renderer.setPixelRatio(Math.min(window.devicePixelRatio, 1.5));
      renderer.setSize(canvas.clientWidth || 280, canvas.clientHeight || 220);

      const scene = new ThreeLib.Scene();
      const camera = new ThreeLib.PerspectiveCamera(45, (canvas.clientWidth || 280) / (canvas.clientHeight || 220), 0.1, 100);
      camera.position.z = 10;

      const group = new ThreeLib.Group();
      scene.add(group);

      // Create distinctive visual celestial bodies for each card
      // Card 01: Magenta / Cyan double orb with nested ring
      if (index === 0) {
        const sphereGeo = new ThreeLib.SphereGeometry(2.3, 32, 32);
        const sphereMat = new ThreeLib.MeshBasicMaterial({
          color: new ThreeLib.Color('#8a2be2'),
          transparent: true,
          opacity: 0.65,
          blending: ThreeLib.AdditiveBlending
        });
        const orb = new ThreeLib.Mesh(sphereGeo, sphereMat);
        group.add(orb);

        const ringGeo = new ThreeLib.RingGeometry(2.8, 2.95, 48);
        const ringMat = new ThreeLib.MeshBasicMaterial({
          color: new ThreeLib.Color('#ff007f'),
          side: ThreeLib.DoubleSide,
          transparent: true,
          opacity: 0.8
        });
        const ring = new ThreeLib.Mesh(ringGeo, ringMat);
        group.add(ring);

        const satGeo = new ThreeLib.SphereGeometry(0.7, 16, 16);
        const satMat = new ThreeLib.MeshBasicMaterial({
          color: new ThreeLib.Color('#00f0ff'),
          transparent: true,
          opacity: 0.75
        });
        const sat = new ThreeLib.Mesh(satGeo, satMat);
        sat.position.set(-1.8, 1.8, 0);
        group.add(sat);
      }
      // Card 02: Deep void orb with magenta companion satellite and cyan ring
      else if (index === 1) {
        const sphereGeo = new ThreeLib.SphereGeometry(2.1, 32, 32);
        const sphereMat = new ThreeLib.MeshBasicMaterial({
          color: new ThreeLib.Color('#061c36'),
          transparent: true,
          opacity: 0.8
        });
        const orb = new ThreeLib.Mesh(sphereGeo, sphereMat);
        group.add(orb);

        const ringGeo = new ThreeLib.RingGeometry(2.6, 2.75, 48);
        const ringMat = new ThreeLib.MeshBasicMaterial({
          color: new ThreeLib.Color('#00f0ff'),
          side: ThreeLib.DoubleSide,
          transparent: true,
          opacity: 0.75
        });
        const ring = new ThreeLib.Mesh(ringGeo, ringMat);
        group.add(ring);

        const satGeo = new ThreeLib.SphereGeometry(0.65, 16, 16);
        const satMat = new ThreeLib.MeshBasicMaterial({
          color: new ThreeLib.Color('#ff007f'),
          transparent: true,
          opacity: 0.8
        });
        const sat = new ThreeLib.Mesh(satGeo, satMat);
        sat.position.set(-1.4, 2.1, 0);
        group.add(sat);
      }
      // Card 03: Purple glowing sphere with electric cyan orbit ring
      else if (index === 2) {
        const sphereGeo = new ThreeLib.SphereGeometry(2.4, 32, 32);
        const sphereMat = new ThreeLib.MeshBasicMaterial({
          color: new ThreeLib.Color('#4c1d95'),
          transparent: true,
          opacity: 0.7,
          blending: ThreeLib.AdditiveBlending
        });
        const orb = new ThreeLib.Mesh(sphereGeo, sphereMat);
        group.add(orb);

        const ringGeo = new ThreeLib.RingGeometry(2.9, 3.05, 48);
        const ringMat = new ThreeLib.MeshBasicMaterial({
          color: new ThreeLib.Color('#00f0ff'),
          side: ThreeLib.DoubleSide,
          transparent: true,
          opacity: 0.95
        });
        const ring = new ThreeLib.Mesh(ringGeo, ringMat);
        group.add(ring);

        const outerGlowGeo = new ThreeLib.RingGeometry(3.3, 3.4, 48);
        const outerGlowMat = new ThreeLib.MeshBasicMaterial({
          color: new ThreeLib.Color('#00f0ff'),
          side: ThreeLib.DoubleSide,
          transparent: true,
          opacity: 0.4
        });
        const outerRing = new ThreeLib.Mesh(outerGlowGeo, outerGlowMat);
        group.add(outerRing);
      }
      // Card 04: Electric blue planetary orb with magenta orbital trajectory
      else {
        const sphereGeo = new ThreeLib.SphereGeometry(2.2, 32, 32);
        const sphereMat = new ThreeLib.MeshBasicMaterial({
          color: new ThreeLib.Color('#0284c7'),
          transparent: true,
          opacity: 0.7,
          blending: ThreeLib.AdditiveBlending
        });
        const orb = new ThreeLib.Mesh(sphereGeo, sphereMat);
        group.add(orb);

        const ringGeo = new ThreeLib.RingGeometry(2.7, 2.85, 48);
        const ringMat = new ThreeLib.MeshBasicMaterial({
          color: new ThreeLib.Color('#ff007f'),
          side: ThreeLib.DoubleSide,
          transparent: true,
          opacity: 0.8
        });
        const ring = new ThreeLib.Mesh(ringGeo, ringMat);
        group.add(ring);

        const satGeo = new ThreeLib.SphereGeometry(0.75, 16, 16);
        const satMat = new ThreeLib.MeshBasicMaterial({
          color: new ThreeLib.Color('#00f0ff'),
          transparent: true,
          opacity: 0.7
        });
        const sat = new ThreeLib.Mesh(satGeo, satMat);
        sat.position.set(-1.8, 1.9, 0);
        group.add(sat);
      }

      // Add gentle rotation
      let speed = 0.01;
      const cardParent = canvas.closest('.project-card');
      if (cardParent) {
        cardParent.addEventListener('mouseenter', () => { speed = 0.035; });
        cardParent.addEventListener('mouseleave', () => { speed = 0.01; });
      }

      const animateCard = () => {
        requestAnimationFrame(animateCard);
        group.rotation.z += speed;
        renderer.render(scene, camera);
      };
      animateCard();
    });
  }
}
