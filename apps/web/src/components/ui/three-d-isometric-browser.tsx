'use client';

import React, { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';

interface ThreeDIsometricBrowserProps {
  className?: string;
}

export function ThreeDIsometricBrowser({ className = '' }: ThreeDIsometricBrowserProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [activeLayer, setActiveLayer] = useState<'all' | 'chrome' | 'dom' | 'cdp'>('all');
  const activeLayerRef = useRef<'all' | 'chrome' | 'dom' | 'cdp'>('all');
  const [fps, setFps] = useState<number>(120);

  useEffect(() => {
    activeLayerRef.current = activeLayer;
  }, [activeLayer]);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    // Dimensions
    const width = container.clientWidth || 800;
    const height = container.clientHeight || 520;
    const initialAspect = width / height;

    // Scene & Camera
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(45, initialAspect, 0.1, 100);

    // Root Group for 3D Isometric Orientation & Mouse/Touch Parallax
    const worldGroup = new THREE.Group();
    scene.add(worldGroup);

    // Responsive Distance and Scale calculation
    const updateScalingAndDistance = (w: number, h: number) => {
      const asp = w / h;
      if (asp < 1.0) {
        worldGroup.scale.set(0.68, 0.68, 0.68);
        camera.position.set(0, 0, 5.0);
      } else {
        worldGroup.scale.set(1.0, 1.0, 1.0);
        camera.position.set(0, 0, 5.4);
      }
      camera.aspect = asp;
      camera.updateProjectionMatrix();
    };

    updateScalingAndDistance(width, height);
    camera.lookAt(0, 0, 0);

    // High Performance WebGL Renderer
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

    // Base Isometric Euler Angles
    const baseRotX = 0.38;
    const baseRotY = -0.48;
    const baseRotZ = 0.08;

    worldGroup.rotation.x = baseRotX;
    worldGroup.rotation.y = baseRotY;
    worldGroup.rotation.z = baseRotZ;

    // Safe Canvas 2D Rounded Rectangle Helper (Safari iOS compatible)
    const drawRoundRect = (
      ctx: CanvasRenderingContext2D,
      x: number,
      y: number,
      w: number,
      h: number,
      r: number
    ) => {
      if (typeof ctx.roundRect === 'function') {
        ctx.beginPath();
        ctx.roundRect(x, y, w, h, r);
      } else {
        ctx.beginPath();
        ctx.moveTo(x + r, y);
        ctx.lineTo(x + w - r, y);
        ctx.quadraticCurveTo(x + w, y, x + w, y + r);
        ctx.lineTo(x + w, y + h - r);
        ctx.quadraticCurveTo(x + w, y + h, x + w - r, y + h);
        ctx.lineTo(x + r, y + h);
        ctx.quadraticCurveTo(x, y + h, x, y + h - r);
        ctx.lineTo(x, y + r);
        ctx.quadraticCurveTo(x, y, x + r, y);
        ctx.closePath();
      }
    };

    // Helper to generate dynamic 2D canvas textures
    const createLayerTexture = (type: 'chrome' | 'dom' | 'cdp'): THREE.CanvasTexture => {
      const canvas = document.createElement('canvas');
      canvas.width = 1024;
      canvas.height = 640;
      const ctx = canvas.getContext('2d')!;

      // Background Base Glass
      ctx.fillStyle = 'rgba(12, 12, 16, 0.94)';
      ctx.fillRect(0, 0, 1024, 640);

      // Outer Border Frame
      ctx.strokeStyle = 'rgba(255, 255, 255, 0.22)';
      ctx.lineWidth = 4;
      ctx.strokeRect(4, 4, 1016, 632);

      if (type === 'chrome') {
        // --- LAYER 3: BROWSER CHROME & SECURITY HUD ---
        // Header Tab Bar
        ctx.fillStyle = 'rgba(24, 24, 27, 0.98)';
        ctx.fillRect(4, 4, 1016, 80);

        // Window Controls (Traffic Lights)
        ctx.fillStyle = 'rgba(255, 255, 255, 0.4)';
        ctx.beginPath();
        ctx.arc(36, 44, 8, 0, Math.PI * 2);
        ctx.arc(64, 44, 8, 0, Math.PI * 2);
        ctx.arc(92, 44, 8, 0, Math.PI * 2);
        ctx.fill();

        // Active Tab
        ctx.fillStyle = 'rgba(39, 39, 42, 0.95)';
        drawRoundRect(ctx, 120, 16, 260, 68, 8);
        ctx.fill();
        ctx.fillStyle = '#ffffff';
        ctx.font = 'bold 20px monospace';
        ctx.fillText('GhostBrowser Engine 2.4', 135, 52);

        // Omnibox / URL Bar
        ctx.fillStyle = 'rgba(18, 18, 22, 0.98)';
        ctx.strokeStyle = 'rgba(255, 255, 255, 0.35)';
        ctx.lineWidth = 2;
        drawRoundRect(ctx, 400, 20, 580, 48, 8);
        ctx.fill();
        ctx.stroke();

        // Green Lock Dot
        ctx.fillStyle = '#10b981';
        ctx.beginPath();
        ctx.arc(424, 44, 6, 0, Math.PI * 2);
        ctx.fill();

        ctx.fillStyle = 'rgba(255, 255, 255, 0.95)';
        ctx.font = '17px monospace';
        ctx.fillText('https://engine.ghostbrowser.internal/cdp/0x9c3e...4e3f', 442, 50);

        // Security Merkle Proof Stamp on body
        ctx.strokeStyle = 'rgba(255, 255, 255, 0.16)';
        ctx.strokeRect(40, 115, 944, 480);

        ctx.fillStyle = '#ffffff';
        ctx.font = 'bold 28px sans-serif';
        ctx.fillText('W3C C14N MERKLE ROOT VALIDATED', 60, 165);

        ctx.fillStyle = 'rgba(161, 161, 170, 0.9)';
        ctx.font = '18px monospace';
        ctx.fillText('Canonical SHA-256: 0x9c3e218b76df4390a1824b277d130e994e3f191b', 60, 205);
        ctx.fillText('CDP Session: isolated-worker-4402 | Chrome v134.0.6998', 60, 235);
        ctx.fillText('Zero-Click Execution: 1-Action Cryptographic Handshake Active', 60, 265);

        // Simulated DOM Wireframe Execution Nodes
        for (let i = 0; i < 3; i++) {
          ctx.fillStyle = 'rgba(39, 39, 42, 0.55)';
          ctx.strokeStyle = 'rgba(255, 255, 255, 0.2)';
          drawRoundRect(ctx, 60 + i * 310, 310, 280, 240, 8);
          ctx.fill();
          ctx.stroke();

          ctx.fillStyle = '#ffffff';
          ctx.font = 'bold 16px monospace';
          ctx.fillText(`EXEC_NODE_0${i + 1}`, 80 + i * 310, 345);

          ctx.fillStyle = 'rgba(161, 161, 170, 0.85)';
          ctx.font = '14px sans-serif';
          ctx.fillText('Synthetic User Event', 80 + i * 310, 380);
          ctx.fillText('State: IMMUTABLE_VERIFIED', 80 + i * 310, 410);
          ctx.fillText('Payload: C14N Canonical', 80 + i * 310, 440);
        }
      } else if (type === 'dom') {
        // --- LAYER 2: HEADLESS DOM LAYOUT ENGINE ---
        ctx.fillStyle = 'rgba(24, 24, 27, 0.8)';
        ctx.fillRect(4, 4, 1016, 50);

        ctx.fillStyle = 'rgba(255, 255, 255, 0.9)';
        ctx.font = 'bold 18px monospace';
        ctx.fillText('HEADLESS CHROMIUM DOM ACCESSIBILITY TREE', 30, 34);

        // DOM Hierarchy Tree
        const nodes = [
          { tag: '<html>', depth: 0, y: 100 },
          { tag: '<head> (manifest, w3c-meta, csp)', depth: 1, y: 145 },
          { tag: '<body> (sandbox: strict)', depth: 1, y: 190 },
          { tag: '<main class="checkout-vault">', depth: 2, y: 235 },
          { tag: '<form action="/checkout" method="POST">', depth: 3, y: 280 },
          { tag: '<input id="guest_email" value="authed@user.eth">', depth: 4, y: 325 },
          { tag: '<button id="submit_order" role="execute">', depth: 4, y: 370 },
          { tag: '<footer class="canonical-signature">', depth: 2, y: 420 },
        ];

        nodes.forEach((n) => {
          ctx.fillStyle = 'rgba(255, 255, 255, 0.12)';
          ctx.fillRect(40 + n.depth * 40, n.y - 18, 620, 30);

          ctx.fillStyle = '#38bdf8'; // light sky blue highlight
          ctx.font = '16px monospace';
          ctx.fillText(n.tag, 50 + n.depth * 40, n.y + 4);
        });

        // Bounding Box Overlays
        ctx.strokeStyle = '#38bdf8';
        ctx.lineWidth = 2;
        ctx.setLineDash([4, 4]);
        ctx.strokeRect(720, 90, 260, 490);
        ctx.setLineDash([]);

        ctx.fillStyle = '#ffffff';
        ctx.font = 'bold 15px monospace';
        ctx.fillText('SEMANTIC BOUNDS', 740, 130);
        ctx.fillStyle = 'rgba(161, 161, 170, 0.9)';
        ctx.fillText('W: 1440px | H: 900px', 740, 165);
        ctx.fillText('FCP: 240ms | LCP: 480ms', 740, 200);
        ctx.fillText('DOM Nodes: 1,420', 740, 235);
        ctx.fillText('Target: (X:820, Y:340)', 740, 270);
        ctx.fillText('Proof Leaf: #04 (DOM)', 740, 305);
      } else {
        // --- LAYER 1: CDP WEBSOCKET PROTOCOL SUBSTRATE ---
        ctx.fillStyle = 'rgba(18, 18, 24, 0.95)';
        ctx.fillRect(4, 4, 1016, 50);

        ctx.fillStyle = '#ffffff';
        ctx.font = 'bold 18px monospace';
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
          ctx.fillStyle = 'rgba(255, 255, 255, 0.05)';
          ctx.fillRect(60, 85 + idx * 80, 900, 60);
          ctx.strokeStyle = 'rgba(255, 255, 255, 0.22)';
          ctx.strokeRect(60, 85 + idx * 80, 900, 60);

          ctx.fillStyle = '#10b981';
          ctx.fillRect(75, 107 + idx * 80, 8, 16);

          ctx.fillStyle = '#e4e4e7';
          ctx.font = '15px monospace';
          ctx.fillText(`FRAME #${1000 + idx} -> ${frame}`, 95, 122 + idx * 80);
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
      opacity: 0.94,
      side: THREE.DoubleSide,
      depthWrite: false,
    });
    const cdpMesh = new THREE.Mesh(planeGeo, cdpMat);
    cdpMesh.position.z = -0.85;
    cdpMesh.renderOrder = 1;
    worldGroup.add(cdpMesh);

    // Glowing wireframe edge outline for CDP layer
    const edgeGeo = new THREE.EdgesGeometry(planeGeo);
    const cdpEdgeMat = new THREE.LineBasicMaterial({
      color: 0x00f0ff,
      transparent: true,
      opacity: 0.6,
    });
    cdpMesh.add(new THREE.LineSegments(edgeGeo, cdpEdgeMat));

    // 2. DOM Tree Plane (Middle Layer)
    const domTex = createLayerTexture('dom');
    const domMat = new THREE.MeshBasicMaterial({
      map: domTex,
      transparent: true,
      opacity: 0.92,
      side: THREE.DoubleSide,
      depthWrite: false,
    });
    const domMesh = new THREE.Mesh(planeGeo, domMat);
    domMesh.position.z = 0.0;
    domMesh.renderOrder = 2;
    worldGroup.add(domMesh);

    const domEdgeMat = new THREE.LineBasicMaterial({
      color: 0x38bdf8,
      transparent: true,
      opacity: 0.6,
    });
    domMesh.add(new THREE.LineSegments(edgeGeo, domEdgeMat));

    // 3. Chrome Shell Plane (Top Layer)
    const chromeTex = createLayerTexture('chrome');
    const chromeMat = new THREE.MeshBasicMaterial({
      map: chromeTex,
      transparent: true,
      opacity: 0.96,
      side: THREE.DoubleSide,
      depthWrite: false,
    });
    const chromeMesh = new THREE.Mesh(planeGeo, chromeMat);
    chromeMesh.position.z = 0.85;
    chromeMesh.renderOrder = 3;
    worldGroup.add(chromeMesh);

    const chromeEdgeMat = new THREE.LineBasicMaterial({
      color: 0x10b981,
      transparent: true,
      opacity: 0.7,
    });
    chromeMesh.add(new THREE.LineSegments(edgeGeo, chromeEdgeMat));

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
      opacity: 0.45,
    });

    strutPositions.forEach(([x, y]) => {
      const points = [
        new THREE.Vector3(x, y, -0.85),
        new THREE.Vector3(x, y, 0.85),
      ];
      const geometry = new THREE.BufferGeometry().setFromPoints(points);
      const line = new THREE.Line(geometry, strutMaterial);
      line.renderOrder = 4;
      worldGroup.add(line);
    });

    // 5. Reactive WebGL Particle Swarm (Surrounding the browser)
    const particleCount = 1000;
    const particleGeo = new THREE.BufferGeometry();
    const particlePositions = new Float32Array(particleCount * 3);
    const particleBasePositions = new Float32Array(particleCount * 3);
    const particleSpeeds = new Float32Array(particleCount);

    for (let i = 0; i < particleCount; i++) {
      const r = 2.2 + Math.random() * 3.2;
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

    // Particle Texture with Glow
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
      size: 0.08,
      map: particleTexture,
      transparent: true,
      opacity: 0.75,
      blending: THREE.AdditiveBlending,
      depthWrite: false,
    });

    const particles = new THREE.Points(particleGeo, particleMat);
    particles.renderOrder = 5;
    scene.add(particles);

    // Mouse & Touch Tracking State
    let mouseX = 0;
    let mouseY = 0;
    let targetRotX = baseRotX;
    let targetRotY = baseRotY;

    const handleMouseMove = (e: MouseEvent) => {
      const rect = container.getBoundingClientRect();
      const x = ((e.clientX - rect.left) / rect.width) * 2 - 1;
      const y = -(((e.clientY - rect.top) / rect.height) * 2 - 1);
      mouseX = Math.max(-1, Math.min(1, x));
      mouseY = Math.max(-1, Math.min(1, y));

      targetRotX = baseRotX - mouseY * 0.22;
      targetRotY = baseRotY + mouseX * 0.32;
    };

    // Touch event listener for mobile/iPhone
    const handleTouchMove = (e: TouchEvent) => {
      if (e.touches.length > 0) {
        const touch = e.touches[0];
        const rect = container.getBoundingClientRect();
        const x = ((touch.clientX - rect.left) / rect.width) * 2 - 1;
        const y = -(((touch.clientY - rect.top) / rect.height) * 2 - 1);
        mouseX = Math.max(-1, Math.min(1, x));
        mouseY = Math.max(-1, Math.min(1, y));

        targetRotX = baseRotX - mouseY * 0.22;
        targetRotY = baseRotY + mouseX * 0.32;
      }
    };

    // Gyroscope tracking for mobile orientation
    const handleDeviceOrientation = (e: DeviceOrientationEvent) => {
      if (e.beta !== null && e.gamma !== null) {
        targetRotX = baseRotX + (e.beta - 45) * 0.004;
        targetRotY = baseRotY + e.gamma * 0.004;
      }
    };

    window.addEventListener('mousemove', handleMouseMove);
    container.addEventListener('touchmove', handleTouchMove, { passive: true });
    if (window.DeviceOrientationEvent) {
      window.addEventListener('deviceorientation', handleDeviceOrientation);
    }

    // Resize Handler with Dynamic Distance Refit
    const handleResize = () => {
      if (!container) return;
      const w = container.clientWidth || 800;
      const h = container.clientHeight || 520;
      updateScalingAndDistance(w, h);
      renderer.setSize(w, h);
    };

    window.addEventListener('resize', handleResize);

    // Animation Loop
    let animationFrameId: number;
    const clock = new THREE.Clock();
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

      // Smooth Parallax Slerp
      worldGroup.rotation.x += (targetRotX - worldGroup.rotation.x) * 0.05;
      worldGroup.rotation.y += (targetRotY - worldGroup.rotation.y) * 0.05;

      // Subtle organic breathing float
      worldGroup.position.y = Math.sin(elapsed * 1.2) * 0.05;

      // Dynamic Layer Distance based on activeLayerRef
      const currentLayer = activeLayerRef.current;
      const targetCdpZ = currentLayer === 'all' ? -0.85 : currentLayer === 'cdp' ? 0.0 : -2.0;
      const targetDomZ = 0.0;
      const targetChromeZ = currentLayer === 'all' ? 0.85 : currentLayer === 'chrome' ? 0.0 : 2.0;

      cdpMesh.position.z += (targetCdpZ - cdpMesh.position.z) * 0.08;
      domMesh.position.z += (targetDomZ - domMesh.position.z) * 0.08;
      chromeMesh.position.z += (targetChromeZ - chromeMesh.position.z) * 0.08;

      cdpMesh.visible = currentLayer === 'all' || currentLayer === 'cdp';
      domMesh.visible = currentLayer === 'all' || currentLayer === 'dom';
      chromeMesh.visible = currentLayer === 'all' || currentLayer === 'chrome';

      // Animate Particles with Swirl & Mouse/Touch Repulsion
      const pos = particleGeo.attributes.position.array as Float32Array;
      for (let i = 0; i < particleCount; i++) {
        const idx = i * 3;
        const bx = particleBasePositions[idx];
        const by = particleBasePositions[idx + 1];
        const bz = particleBasePositions[idx + 2];
        const spd = particleSpeeds[i];

        // Gentle orbital drift
        const angle = elapsed * 0.12 * spd;
        const cosA = Math.cos(angle);
        const sinA = Math.sin(angle);
        const rotX = bx * cosA - bz * sinA;
        const rotZ = bx * sinA + bz * cosA;
        const curY = by + Math.sin(elapsed * 1.4 + i) * 0.1;

        // Cursor Repulsion in projected space
        const dx = rotX - mouseX * 2.2;
        const dy = curY - mouseY * 1.8;
        const distSq = dx * dx + dy * dy;

        if (distSq < 1.4) {
          const force = (1.4 - distSq) * 0.4;
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
      container.removeEventListener('touchmove', handleTouchMove);
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
  }, []);

  return (
    <div className={`relative w-full rounded-2xl border border-zinc-800/80 bg-zinc-950/70 p-3 sm:p-5 backdrop-blur-xl shadow-2xl overflow-hidden ${className}`}>
      {/* Top HUD Bar with scrollable tabs on mobile */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 border-b border-zinc-800/80 pb-3 mb-2">
        <div className="flex items-center gap-2">
          <div className="h-2 w-2 rounded-full bg-emerald-400 animate-pulse" />
          <span className="font-mono text-xs font-semibold uppercase tracking-wider text-zinc-300">
            Exploded 3D Browser &bull; WebGL
          </span>
          <span className="rounded bg-zinc-900 px-2 py-0.5 font-mono text-[10px] text-zinc-400 border border-zinc-800">
            {fps} FPS
          </span>
        </div>

        {/* Layer Selector Filters - horizontally scrollable on mobile */}
        <div className="flex items-center gap-1 overflow-x-auto max-w-full pb-1 sm:pb-0 rounded-lg border border-zinc-800 bg-zinc-900/90 p-1">
          <button
            onClick={() => setActiveLayer('all')}
            className={`whitespace-nowrap rounded px-2.5 py-1 font-mono text-xs font-medium transition-all ${
              activeLayer === 'all'
                ? 'bg-white text-black shadow-sm font-semibold'
                : 'text-zinc-400 hover:text-zinc-200'
            }`}
          >
            All Layers
          </button>
          <button
            onClick={() => setActiveLayer('chrome')}
            className={`whitespace-nowrap rounded px-2.5 py-1 font-mono text-xs font-medium transition-all ${
              activeLayer === 'chrome'
                ? 'bg-white text-black shadow-sm font-semibold'
                : 'text-zinc-400 hover:text-zinc-200'
            }`}
          >
            Security Chrome
          </button>
          <button
            onClick={() => setActiveLayer('dom')}
            className={`whitespace-nowrap rounded px-2.5 py-1 font-mono text-xs font-medium transition-all ${
              activeLayer === 'dom'
                ? 'bg-white text-black shadow-sm font-semibold'
                : 'text-zinc-400 hover:text-zinc-200'
            }`}
          >
            DOM Layout
          </button>
          <button
            onClick={() => setActiveLayer('cdp')}
            className={`whitespace-nowrap rounded px-2.5 py-1 font-mono text-xs font-medium transition-all ${
              activeLayer === 'cdp'
                ? 'bg-white text-black shadow-sm font-semibold'
                : 'text-zinc-400 hover:text-zinc-200'
            }`}
          >
            CDP Pipeline
          </button>
        </div>
      </div>

      {/* 3D WebGL Canvas Viewport with touch-action */}
      <div
        ref={containerRef}
        className="relative h-[380px] sm:h-[460px] md:h-[540px] w-full cursor-grab active:cursor-grabbing rounded-xl bg-gradient-to-b from-zinc-950 via-black to-zinc-950 border border-zinc-900 touch-pan-y"
      />

      {/* Bottom Technical Spec Footer with responsive wrapping */}
      <div className="mt-2.5 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-1 text-[10px] sm:text-[11px] font-mono text-zinc-500 border-t border-zinc-900/80 pt-2">
        <div className="flex items-center gap-3">
          <span>PARALLAX: TOUCH / MOUSE</span>
          <span>&bull;</span>
          <span>Z-EXPLODED (&plusmn;0.85m)</span>
        </div>
        <div className="flex items-center gap-2 text-zinc-400">
          <span>1,000 NODES</span>
          <span>&bull;</span>
          <span className="text-emerald-400">CDP 9222 ACTIVE</span>
        </div>
      </div>
    </div>
  );
}
