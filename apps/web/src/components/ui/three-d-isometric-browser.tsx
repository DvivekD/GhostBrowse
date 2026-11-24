'use client';

import React, { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';

interface ThreeDIsometricBrowserProps {
  className?: string;
}

export function ThreeDIsometricBrowser({ className = '' }: ThreeDIsometricBrowserProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [activeLayer, setActiveLayer] = useState<'all' | 'chrome' | 'dom' | 'cdp'>('all');
  const [fps, setFps] = useState<number>(120);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    // Dimensions
    const width = container.clientWidth || 800;
    const height = container.clientHeight || 540;

    // Scene, Camera, Renderer
    const scene = new THREE.Scene();
    scene.fog = new THREE.FogExp2(0x09090b, 0.08);

    const camera = new THREE.PerspectiveCamera(45, width / height, 0.1, 100);
    camera.position.set(4.2, 3.2, 5.5);

    const renderer = new THREE.WebGLRenderer({
      antialias: true,
      alpha: true,
      powerPreference: 'high-performance',
    });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.2;
    container.appendChild(renderer.domElement);

    // Root Group for Mouse Parallax
    const worldGroup = new THREE.Group();
    scene.add(worldGroup);

    // Initial Isometric Orientation
    worldGroup.rotation.x = 0.48;
    worldGroup.rotation.y = -0.58;
    worldGroup.rotation.z = 0.28;

    // Helper to generate dynamic 2D canvas textures
    const createLayerTexture = (type: 'chrome' | 'dom' | 'cdp'): THREE.CanvasTexture => {
      const canvas = document.createElement('canvas');
      canvas.width = 1024;
      canvas.height = 640;
      const ctx = canvas.getContext('2d')!;

      // Background
      ctx.fillStyle = 'rgba(12, 12, 16, 0.88)';
      ctx.fillRect(0, 0, 1024, 640);

      // Outer Border
      ctx.strokeStyle = 'rgba(255, 255, 255, 0.18)';
      ctx.lineWidth = 3;
      ctx.strokeRect(4, 4, 1016, 632);

      if (type === 'chrome') {
        // --- LAYER 3: BROWSER CHROME & SECURITY HUD ---
        // Header Tab Bar
        ctx.fillStyle = 'rgba(24, 24, 27, 0.95)';
        ctx.fillRect(4, 4, 1016, 80);

        // Window Controls (Traffic Lights)
        ctx.fillStyle = 'rgba(255, 255, 255, 0.25)';
        ctx.beginPath();
        ctx.arc(36, 44, 8, 0, Math.PI * 2);
        ctx.arc(64, 44, 8, 0, Math.PI * 2);
        ctx.arc(92, 44, 8, 0, Math.PI * 2);
        ctx.fill();

        // Active Tab
        ctx.fillStyle = 'rgba(39, 39, 42, 0.9)';
        ctx.roundRect?.(120, 16, 260, 68, [8, 8, 0, 0]);
        ctx.fill();
        ctx.fillStyle = '#ffffff';
        ctx.font = 'bold 20px "Geist Mono", "Helvetica Neue", monospace';
        ctx.fillText('GhostBrowser Engine 2.4', 140, 52);

        // Omnibox / URL Bar
        ctx.fillStyle = 'rgba(18, 18, 22, 0.95)';
        ctx.strokeStyle = 'rgba(255, 255, 255, 0.3)';
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.roundRect?.(400, 20, 580, 48, 8);
        ctx.fill();
        ctx.stroke();

        // Lock Icon + Merkle Hash Omnibox
        ctx.fillStyle = '#10b981'; // subtle green security lock dot
        ctx.beginPath();
        ctx.arc(424, 44, 6, 0, Math.PI * 2);
        ctx.fill();

        ctx.fillStyle = 'rgba(255, 255, 255, 0.9)';
        ctx.font = '18px "Geist Mono", monospace';
        ctx.fillText('https://engine.ghostbrowser.internal/cdp/0x9c3e...4e3f', 442, 50);

        // Security Merkle Proof Stamp on body
        ctx.strokeStyle = 'rgba(255, 255, 255, 0.12)';
        ctx.strokeRect(40, 120, 944, 460);

        ctx.fillStyle = '#ffffff';
        ctx.font = '600 28px "Helvetica Neue", sans-serif';
        ctx.fillText('W3C C14N MERKLE ROOT VALIDATED', 60, 170);

        ctx.fillStyle = 'rgba(161, 161, 170, 0.8)';
        ctx.font = '18px "Geist Mono", monospace';
        ctx.fillText('Canonical SHA-256: 0x9c3e218b76df4390a1824b277d130e994e3f191b', 60, 210);
        ctx.fillText('CDP Session: isolated-worker-4402 | Chrome v134.0.6998', 60, 240);
        ctx.fillText('Zero-Click Execution: 1-Action Cryptographic Handshake Active', 60, 270);

        // Simulated DOM Wireframe Cards
        for (let i = 0; i < 3; i++) {
          ctx.fillStyle = 'rgba(39, 39, 42, 0.4)';
          ctx.strokeStyle = 'rgba(255, 255, 255, 0.15)';
          ctx.beginPath();
          ctx.roundRect?.(60 + i * 310, 310, 280, 230, 8);
          ctx.fill();
          ctx.stroke();

          ctx.fillStyle = '#ffffff';
          ctx.font = '16px "Geist Mono", monospace';
          ctx.fillText(`EXEC_NODE_0${i + 1}`, 80 + i * 310, 345);

          ctx.fillStyle = 'rgba(161, 161, 170, 0.7)';
          ctx.font = '14px "Helvetica Neue", sans-serif';
          ctx.fillText('Synthetic User Event', 80 + i * 310, 380);
          ctx.fillText('State: IMMUTABLE_VERIFIED', 80 + i * 310, 410);
        }
      } else if (type === 'dom') {
        // --- LAYER 2: HEADLESS DOM LAYOUT ENGINE ---
        ctx.fillStyle = 'rgba(24, 24, 27, 0.7)';
        ctx.fillRect(4, 4, 1016, 50);

        ctx.fillStyle = 'rgba(255, 255, 255, 0.8)';
        ctx.font = 'bold 18px "Geist Mono", monospace';
        ctx.fillText('HEADLESS CHROMIUM DOM ACCESSIBILITY TREE', 30, 34);

        // DOM Hierarchy Tree
        const nodes = [
          { tag: '<html>', depth: 0, y: 100 },
          { tag: '<head> (manifest, w3c-meta, csp)', depth: 1, y: 140 },
          { tag: '<body> (sandbox: strict)', depth: 1, y: 180 },
          { tag: '<main class="checkout-vault">', depth: 2, y: 220 },
          { tag: '<form action="/checkout" method="POST">', depth: 3, y: 260 },
          { tag: '<input id="guest_email" value="authed@user.eth">', depth: 4, y: 300 },
          { tag: '<button id="submit_order" role="execute">', depth: 4, y: 340 },
          { tag: '<footer class="canonical-signature">', depth: 2, y: 390 },
        ];

        nodes.forEach((n) => {
          ctx.fillStyle = 'rgba(255, 255, 255, 0.15)';
          ctx.fillRect(40 + n.depth * 40, n.y - 18, 620, 28);

          ctx.fillStyle = '#38bdf8'; // light sky blue highlight
          ctx.font = '16px "Geist Mono", monospace';
          ctx.fillText(n.tag, 50 + n.depth * 40, n.y);
        });

        // Bounding Box Overlays
        ctx.strokeStyle = '#38bdf8';
        ctx.lineWidth = 1.5;
        ctx.setLineDash([4, 4]);
        ctx.strokeRect(720, 100, 260, 480);
        ctx.setLineDash([]);

        ctx.fillStyle = '#ffffff';
        ctx.font = '15px "Geist Mono", monospace';
        ctx.fillText('SEMANTIC BOUNDS', 740, 130);
        ctx.fillStyle = 'rgba(161, 161, 170, 0.8)';
        ctx.fillText('W: 1440px | H: 900px', 740, 160);
        ctx.fillText('FCP: 240ms | LCP: 480ms', 740, 190);
        ctx.fillText('DOM Nodes: 1,420', 740, 220);
        ctx.fillText('Click Target: (X:820, Y:340)', 740, 250);
      } else {
        // --- LAYER 1: CDP WEBSOCKET PROTOCOL SUBSTRATE ---
        ctx.fillStyle = 'rgba(18, 18, 24, 0.9)';
        ctx.fillRect(4, 4, 1016, 50);

        ctx.fillStyle = '#ffffff';
        ctx.font = 'bold 18px "Geist Mono", monospace';
        ctx.fillText('CHROME DEVTOOLS PROTOCOL (CDP) WEBSOCKET PIPELINE', 30, 34);

        // Protocol Grid Matrix
        ctx.strokeStyle = 'rgba(255, 255, 255, 0.08)';
        ctx.lineWidth = 1;
        for (let x = 40; x < 1000; x += 40) {
          ctx.beginPath();
          ctx.moveTo(x, 60);
          ctx.lineTo(x, 600);
          ctx.stroke();
        }
        for (let y = 60; y < 600; y += 40) {
          ctx.beginPath();
          ctx.moveTo(40, y);
          ctx.lineTo(984, y);
          ctx.stroke();
        }

        // Live CDP Frames
        const cdpFrames = [
          '{"method": "Page.enable", "id": 1001, "params": {}}',
          '{"method": "Network.setExtraHTTPHeaders", "id": 1002, "status": "200_OK"}',
          '{"method": "Runtime.evaluate", "expr": "document.querySelector(\'#cart\').click()"}',
          '{"method": "DOM.getDocument", "depth": -1, "peer": "127.0.0.1:9222"}',
          '{"method": "Security.enable", "protocol": "TLS_1_3_X25519"}',
          '{"method": "Target.createTarget", "url": "https://stripe.com/checkout"}',
        ];

        cdpFrames.forEach((frame, idx) => {
          ctx.fillStyle = 'rgba(255, 255, 255, 0.04)';
          ctx.fillRect(60, 90 + idx * 75, 900, 55);
          ctx.strokeStyle = 'rgba(255, 255, 255, 0.2)';
          ctx.strokeRect(60, 90 + idx * 75, 900, 55);

          ctx.fillStyle = '#10b981';
          ctx.fillRect(75, 110 + idx * 75, 8, 16);

          ctx.fillStyle = '#e4e4e7';
          ctx.font = '15px "Geist Mono", monospace';
          ctx.fillText(`FRAME #${1000 + idx} -> ${frame}`, 95, 125 + idx * 75);
        });
      }

      const texture = new THREE.CanvasTexture(canvas);
      texture.minFilter = THREE.LinearFilter;
      texture.magFilter = THREE.LinearFilter;
      return texture;
    };

    // Layer Geometry (aspect ratio 1.6 : 1)
    const planeGeo = new THREE.PlaneGeometry(3.6, 2.25);

    // 1. CDP Substrate Plane (Bottom Layer)
    const cdpTex = createLayerTexture('cdp');
    const cdpMat = new THREE.MeshBasicMaterial({
      map: cdpTex,
      transparent: true,
      opacity: 0.9,
      side: THREE.DoubleSide,
    });
    const cdpMesh = new THREE.Mesh(planeGeo, cdpMat);
    cdpMesh.position.z = -0.9;
    worldGroup.add(cdpMesh);

    // 2. DOM Tree Plane (Middle Layer)
    const domTex = createLayerTexture('dom');
    const domMat = new THREE.MeshBasicMaterial({
      map: domTex,
      transparent: true,
      opacity: 0.88,
      side: THREE.DoubleSide,
    });
    const domMesh = new THREE.Mesh(planeGeo, domMat);
    domMesh.position.z = 0.0;
    worldGroup.add(domMesh);

    // 3. Chrome Shell Plane (Top Layer)
    const chromeTex = createLayerTexture('chrome');
    const chromeMat = new THREE.MeshBasicMaterial({
      map: chromeTex,
      transparent: true,
      opacity: 0.95,
      side: THREE.DoubleSide,
    });
    const chromeMesh = new THREE.Mesh(planeGeo, chromeMat);
    chromeMesh.position.z = 0.9;
    worldGroup.add(chromeMesh);

    // 4 Corner Connecting Laser Struts
    const halfW = 3.6 / 2;
    const halfH = 2.25 / 2;
    const strutPositions = [
      [-halfW, -halfH],
      [halfW, -halfH],
      [halfW, halfH],
      [-halfW, halfH],
    ];

    const strutMaterial = new THREE.LineBasicMaterial({
      color: 0xffffff,
      transparent: true,
      opacity: 0.35,
    });

    strutPositions.forEach(([x, y]) => {
      const points = [
        new THREE.Vector3(x, y, -0.9),
        new THREE.Vector3(x, y, 0.9),
      ];
      const geometry = new THREE.BufferGeometry().setFromPoints(points);
      const line = new THREE.Line(geometry, strutMaterial);
      worldGroup.add(line);
    });

    // 5. Reactive WebGL Particle Swarm
    const particleCount = 1200;
    const particleGeo = new THREE.BufferGeometry();
    const particlePositions = new Float32Array(particleCount * 3);
    const particleBasePositions = new Float32Array(particleCount * 3);
    const particleSpeeds = new Float32Array(particleCount);

    for (let i = 0; i < particleCount; i++) {
      const r = 2.8 + Math.random() * 3.5;
      const theta = Math.random() * Math.PI * 2;
      const phi = (Math.random() - 0.5) * Math.PI * 0.9;

      const px = r * Math.cos(theta) * Math.cos(phi);
      const py = r * Math.sin(phi);
      const pz = r * Math.sin(theta) * Math.cos(phi);

      particlePositions[i * 3] = px;
      particlePositions[i * 3 + 1] = py;
      particlePositions[i * 3 + 2] = pz;

      particleBasePositions[i * 3] = px;
      particleBasePositions[i * 3 + 1] = py;
      particleBasePositions[i * 3 + 2] = pz;

      particleSpeeds[i] = 0.4 + Math.random() * 0.8;
    }

    particleGeo.setAttribute('position', new THREE.BufferAttribute(particlePositions, 3));

    // Particle Material with Soft Glow
    const particleCanvas = document.createElement('canvas');
    particleCanvas.width = 32;
    particleCanvas.height = 32;
    const pCtx = particleCanvas.getContext('2d')!;
    const pGrad = pCtx.createRadialGradient(16, 16, 0, 16, 16, 16);
    pGrad.addColorStop(0, 'rgba(255, 255, 255, 1)');
    pGrad.addColorStop(0.3, 'rgba(228, 228, 231, 0.8)');
    pGrad.addColorStop(1, 'rgba(255, 255, 255, 0)');
    pCtx.fillStyle = pGrad;
    pCtx.fillRect(0, 0, 32, 32);

    const particleTexture = new THREE.CanvasTexture(particleCanvas);
    const particleMat = new THREE.PointsMaterial({
      size: 0.09,
      map: particleTexture,
      transparent: true,
      opacity: 0.75,
      blending: THREE.AdditiveBlending,
      depthWrite: false,
    });

    const particles = new THREE.Points(particleGeo, particleMat);
    scene.add(particles);

    // Mouse Tracking State
    let mouseX = 0;
    let mouseY = 0;
    let targetRotX = 0.48;
    let targetRotY = -0.58;

    const handleMouseMove = (e: MouseEvent) => {
      const rect = container.getBoundingClientRect();
      const x = ((e.clientX - rect.left) / rect.width) * 2 - 1;
      const y = -(((e.clientY - rect.top) / rect.height) * 2 - 1);
      mouseX = x;
      mouseY = y;

      // Map mouse to gentle Euler tilt
      targetRotX = 0.48 - y * 0.28;
      targetRotY = -0.58 + x * 0.38;
    };

    // Gyroscope tracking for mobile devices
    const handleDeviceOrientation = (e: DeviceOrientationEvent) => {
      if (e.beta !== null && e.gamma !== null) {
        targetRotX = 0.48 + (e.beta - 45) * 0.005;
        targetRotY = -0.58 + e.gamma * 0.005;
      }
    };

    window.addEventListener('mousemove', handleMouseMove);
    if (window.DeviceOrientationEvent) {
      window.addEventListener('deviceorientation', handleDeviceOrientation);
    }

    // Resize Handler
    const handleResize = () => {
      if (!container) return;
      const w = container.clientWidth || 800;
      const h = container.clientHeight || 540;
      camera.aspect = w / h;
      camera.updateProjectionMatrix();
      renderer.setSize(w, h);
    };

    window.addEventListener('resize', handleResize);

    // Animation Loop
    let animationFrameId: number;
    let clock = new THREE.Clock();
    let frameCount = 0;
    let lastFpsTime = performance.now();

    const animate = () => {
      animationFrameId = requestAnimationFrame(animate);

      const elapsed = clock.getElapsedTime();

      // FPS Measurement
      frameCount++;
      const now = performance.now();
      if (now - lastFpsTime >= 1000) {
        setFps(Math.round((frameCount * 1000) / (now - lastFpsTime)));
        frameCount = 0;
        lastFpsTime = now;
      }

      // Smooth Slerp Parallax Lerp
      worldGroup.rotation.x += (targetRotX - worldGroup.rotation.x) * 0.05;
      worldGroup.rotation.y += (targetRotY - worldGroup.rotation.y) * 0.05;

      // Subtle breathing motion on Z
      worldGroup.position.y = Math.sin(elapsed * 1.2) * 0.06;

      // Dynamic Layer Distance based on activeLayer state
      const targetCdpZ = activeLayer === 'all' ? -0.9 : activeLayer === 'cdp' ? 0.0 : -1.8;
      const targetDomZ = activeLayer === 'all' ? 0.0 : activeLayer === 'dom' ? 0.0 : 0.0;
      const targetChromeZ = activeLayer === 'all' ? 0.9 : activeLayer === 'chrome' ? 0.0 : 1.8;

      cdpMesh.position.z += (targetCdpZ - cdpMesh.position.z) * 0.08;
      domMesh.position.z += (targetDomZ - domMesh.position.z) * 0.08;
      chromeMesh.position.z += (targetChromeZ - chromeMesh.position.z) * 0.08;

      cdpMesh.visible = activeLayer === 'all' || activeLayer === 'cdp';
      domMesh.visible = activeLayer === 'all' || activeLayer === 'dom';
      chromeMesh.visible = activeLayer === 'all' || activeLayer === 'chrome';

      // Animate Particles with Swirl & Mouse Repulsion
      const pos = particleGeo.attributes.position.array as Float32Array;
      for (let i = 0; i < particleCount; i++) {
        const idx = i * 3;
        const bx = particleBasePositions[idx];
        const by = particleBasePositions[idx + 1];
        const bz = particleBasePositions[idx + 2];
        const spd = particleSpeeds[i];

        // Gentle orbital drift
        const angle = elapsed * 0.15 * spd;
        const cosA = Math.cos(angle);
        const sinA = Math.sin(angle);
        const rotX = bx * cosA - bz * sinA;
        const rotZ = bx * sinA + bz * cosA;
        const curY = by + Math.sin(elapsed * 1.5 + i) * 0.12;

        // Mouse Repulsion in projected space
        const dx = rotX - mouseX * 2.5;
        const dy = curY - mouseY * 2.0;
        const distSq = dx * dx + dy * dy;

        if (distSq < 1.6) {
          const force = (1.6 - distSq) * 0.45;
          pos[idx] = rotX + (dx / Math.sqrt(distSq + 0.001)) * force;
          pos[idx + 1] = curY + (dy / Math.sqrt(distSq + 0.001)) * force;
          pos[idx + 2] = rotZ;
        } else {
          pos[idx] = rotX;
          pos[idx + 1] = curY;
          pos[idx + 2] = rotZ;
        }
      }
      particleGeo.attributes.position.needsUpdate = true;

      // Render Scene
      renderer.render(scene, camera);
    };

    animate();

    return () => {
      cancelAnimationFrame(animationFrameId);
      window.removeEventListener('mousemove', handleMouseMove);
      if (window.DeviceOrientationEvent) {
        window.removeEventListener('deviceorientation', handleDeviceOrientation);
      }
      window.removeEventListener('resize', handleResize);
      renderer.dispose();
      planeGeo.dispose();
      cdpTex.dispose();
      domTex.dispose();
      chromeTex.dispose();
      particleTexture.dispose();
      particleGeo.dispose();
      if (container.contains(renderer.domElement)) {
        container.removeChild(renderer.domElement);
      }
    };
  }, [activeLayer]);

  return (
    <div className={`relative w-full rounded-2xl border border-zinc-800/80 bg-zinc-950/60 p-4 backdrop-blur-xl shadow-2xl overflow-hidden ${className}`}>
      {/* Top HUD Bar */}
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-zinc-800/80 pb-3 mb-2">
        <div className="flex items-center gap-2">
          <div className="h-2 w-2 rounded-full bg-emerald-400 animate-pulse" />
          <span className="font-mono text-xs font-semibold uppercase tracking-wider text-zinc-300">
            Exploded 3D Browser Canvas &bull; WebGL
          </span>
          <span className="rounded bg-zinc-900 px-2 py-0.5 font-mono text-[11px] text-zinc-400 border border-zinc-800">
            {fps} FPS
          </span>
        </div>

        {/* Layer Selector Filters */}
        <div className="flex items-center gap-1.5 rounded-lg border border-zinc-800 bg-zinc-900/80 p-1">
          <button
            onClick={() => setActiveLayer('all')}
            className={`rounded px-2.5 py-1 font-mono text-xs font-medium transition-all ${
              activeLayer === 'all'
                ? 'bg-white text-black shadow-sm font-semibold'
                : 'text-zinc-400 hover:text-zinc-200'
            }`}
          >
            All Layers (Exploded)
          </button>
          <button
            onClick={() => setActiveLayer('chrome')}
            className={`rounded px-2.5 py-1 font-mono text-xs font-medium transition-all ${
              activeLayer === 'chrome'
                ? 'bg-white text-black shadow-sm font-semibold'
                : 'text-zinc-400 hover:text-zinc-200'
            }`}
          >
            Security Chrome
          </button>
          <button
            onClick={() => setActiveLayer('dom')}
            className={`rounded px-2.5 py-1 font-mono text-xs font-medium transition-all ${
              activeLayer === 'dom'
                ? 'bg-white text-black shadow-sm font-semibold'
                : 'text-zinc-400 hover:text-zinc-200'
            }`}
          >
            DOM Layout
          </button>
          <button
            onClick={() => setActiveLayer('cdp')}
            className={`rounded px-2.5 py-1 font-mono text-xs font-medium transition-all ${
              activeLayer === 'cdp'
                ? 'bg-white text-black shadow-sm font-semibold'
                : 'text-zinc-400 hover:text-zinc-200'
            }`}
          >
            CDP Pipeline
          </button>
        </div>
      </div>

      {/* 3D WebGL Canvas Viewport */}
      <div
        ref={containerRef}
        className="relative h-[480px] md:h-[580px] w-full cursor-grab active:cursor-grabbing rounded-xl bg-gradient-to-b from-zinc-950/80 via-black to-zinc-950/90"
      />

      {/* Bottom Technical Spec Footer */}
      <div className="mt-3 flex flex-wrap items-center justify-between text-[11px] font-mono text-zinc-500 border-t border-zinc-900 pt-2">
        <div className="flex items-center gap-4">
          <span>PARALLAX: MOUSE &bull; GYRO ENABLED</span>
          <span>DEPTH: Z-AXIS EXPLODED (&plusmn;0.9m)</span>
        </div>
        <div className="flex items-center gap-2 text-zinc-400">
          <span>PARTICLES: 1,200 REACTIVE NODES</span>
          <span>&bull;</span>
          <span>CDP PROTOCOL: ACTIVE</span>
        </div>
      </div>
    </div>
  );
}
