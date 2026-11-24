"use client";

import React, { useEffect, useRef } from "react";
import * as THREE from "three";

interface GhostParallaxCanvasProps {
  className?: string;
  scrollProgress?: number; // 0 to 1
}

export function GhostParallaxCanvas({ className = "", scrollProgress = 0 }: GhostParallaxCanvasProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const progressRef = useRef(scrollProgress);
  progressRef.current = scrollProgress;

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    let width = container.clientWidth || window.innerWidth;
    let height = container.clientHeight || window.innerHeight;

    // Scene & Fog (Deep Obsidian)
    const scene = new THREE.Scene();
    scene.fog = new THREE.FogExp2(0x050508, 0.06);

    // Camera
    const camera = new THREE.PerspectiveCamera(50, width / height, 0.1, 100);
    camera.position.set(0, 0, 7.5);

    // High performance WebGL Renderer
    const renderer = new THREE.WebGLRenderer({
      antialias: true,
      alpha: true,
      powerPreference: "high-performance",
    });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.2;
    container.appendChild(renderer.domElement);

    // Lighting (Cyber Cyan & Electric Emerald)
    const ambientLight = new THREE.AmbientLight(0x09090b, 1.5);
    scene.add(ambientLight);

    const emeraldLight = new THREE.PointLight(0x10b981, 2.4, 25);
    emeraldLight.position.set(3, 3, 5);
    scene.add(emeraldLight);

    const cyanLight = new THREE.PointLight(0x06b6d4, 2.0, 25);
    cyanLight.position.set(-3, -2, 5);
    scene.add(cyanLight);

    const deepAccent = new THREE.PointLight(0x0284c7, 1.2, 18);
    deepAccent.position.set(0, -4, 3);
    scene.add(deepAccent);

    // Root World Group for Parallax
    const worldGroup = new THREE.Group();
    scene.add(worldGroup);

    // 1. FLOATING TRANSLUCENT CHROMIUM VIEWPORTS
    const createBrowserViewport = (w: number, h: number, z: number, color: number) => {
      const group = new THREE.Group();

      // Translucent Glass Surface
      const planeGeo = new THREE.PlaneGeometry(w, h);
      const glassMat = new THREE.MeshStandardMaterial({
        color: 0x09090b,
        metalness: 0.8,
        roughness: 0.15,
        transparent: true,
        opacity: 0.75,
        side: THREE.DoubleSide,
      });
      const glassMesh = new THREE.Mesh(planeGeo, glassMat);
      group.add(glassMesh);

      // Glowing Perimeter Wireframe Border
      const edges = new THREE.EdgesGeometry(planeGeo);
      const borderMat = new THREE.LineBasicMaterial({
        color: color,
        transparent: true,
        opacity: 0.6,
      });
      const borderMesh = new THREE.LineSegments(edges, borderMat);
      group.add(borderMesh);

      group.position.z = z;
      return group;
    };

    const viewportCenter = createBrowserViewport(4.2, 2.6, 0, 0x10b981);
    worldGroup.add(viewportCenter);

    const viewportLeft = createBrowserViewport(3.0, 1.8, -1.5, 0x06b6d4);
    viewportLeft.position.set(-3.2, 1.2, -1.5);
    viewportLeft.rotation.y = 0.25;
    worldGroup.add(viewportLeft);

    const viewportRight = createBrowserViewport(3.0, 1.8, -1.8, 0x10b981);
    viewportRight.position.set(3.4, -1.0, -1.8);
    viewportRight.rotation.y = -0.3;
    worldGroup.add(viewportRight);

    // 2. CONCENTRIC CDP WEBSOCKET TELEMETRY RINGS
    const ringMat1 = new THREE.MeshStandardMaterial({
      color: 0x06b6d4,
      metalness: 0.9,
      roughness: 0.1,
      transparent: true,
      opacity: 0.7,
    });

    const ringMat2 = new THREE.MeshStandardMaterial({
      color: 0x10b981,
      metalness: 0.9,
      roughness: 0.1,
      transparent: true,
      opacity: 0.5,
    });

    const telemetryRing1 = new THREE.Mesh(new THREE.TorusGeometry(3.6, 0.025, 16, 120), ringMat1);
    telemetryRing1.rotation.x = Math.PI * 0.28;
    worldGroup.add(telemetryRing1);

    const telemetryRing2 = new THREE.Mesh(new THREE.TorusGeometry(4.4, 0.02, 16, 120), ringMat2);
    telemetryRing2.rotation.y = Math.PI * 0.35;
    worldGroup.add(telemetryRing2);

    const telemetryRing3 = new THREE.Mesh(new THREE.TorusGeometry(5.2, 0.015, 16, 120), ringMat1);
    telemetryRing3.rotation.x = -Math.PI * 0.32;
    telemetryRing3.rotation.y = -Math.PI * 0.15;
    worldGroup.add(telemetryRing3);

    // 3. 4-LEAF MERKLE LATTICE CUBE (Cryptographic Core)
    const cubeGroup = new THREE.Group();
    const cubeSize = 1.3;

    // Outer Wireframe Lattice
    const outerCubeGeo = new THREE.BoxGeometry(cubeSize, cubeSize, cubeSize);
    const outerEdges = new THREE.EdgesGeometry(outerCubeGeo);
    const outerWire = new THREE.LineSegments(
      outerEdges,
      new THREE.LineBasicMaterial({ color: 0x10b981, transparent: true, opacity: 0.85 })
    );
    cubeGroup.add(outerWire);

    // Inner Translucent Core
    const innerCubeGeo = new THREE.BoxGeometry(cubeSize * 0.65, cubeSize * 0.65, cubeSize * 0.65);
    const innerMat = new THREE.MeshStandardMaterial({
      color: 0x06b6d4,
      metalness: 0.9,
      roughness: 0.2,
      transparent: true,
      opacity: 0.45,
    });
    const innerMesh = new THREE.Mesh(innerCubeGeo, innerMat);
    cubeGroup.add(innerMesh);

    // 4 Corner Leaf Pips
    const pipGeo = new THREE.SphereGeometry(0.08, 16, 16);
    const pipMat = new THREE.MeshBasicMaterial({ color: 0x10b981 });
    const leafOffsets = [
      [1, 1, 1],
      [-1, 1, -1],
      [1, -1, -1],
      [-1, -1, 1],
    ];
    leafOffsets.forEach(([x, y, z]) => {
      const pip = new THREE.Mesh(pipGeo, pipMat);
      pip.position.set((x * cubeSize) / 2, (y * cubeSize) / 2, (z * cubeSize) / 2);
      cubeGroup.add(pip);
    });

    cubeGroup.position.set(0, 0, 0.4);
    worldGroup.add(cubeGroup);

    // 4. DATA PACKET PARTICLES (Emerald & Cyan Nodes)
    const particleCount = 220;
    const particleGeometry = new THREE.BufferGeometry();
    const positions = new Float32Array(particleCount * 3);
    const colors = new Float32Array(particleCount * 3);

    const cEmerald = new THREE.Color(0x10b981);
    const cCyan = new THREE.Color(0x06b6d4);

    for (let i = 0; i < particleCount; i++) {
      positions[i * 3] = (Math.random() - 0.5) * 18;
      positions[i * 3 + 1] = (Math.random() - 0.5) * 18;
      positions[i * 3 + 2] = (Math.random() - 0.5) * 12;

      const c = Math.random() > 0.5 ? cEmerald : cCyan;
      colors[i * 3] = c.r;
      colors[i * 3 + 1] = c.g;
      colors[i * 3 + 2] = c.b;
    }

    particleGeometry.setAttribute("position", new THREE.BufferAttribute(positions, 3));
    particleGeometry.setAttribute("color", new THREE.BufferAttribute(colors, 3));

    const particleMaterial = new THREE.PointsMaterial({
      size: 0.055,
      vertexColors: true,
      transparent: true,
      opacity: 0.7,
      blending: THREE.AdditiveBlending,
    });

    const particleSystem = new THREE.Points(particleGeometry, particleMaterial);
    worldGroup.add(particleSystem);

    // Mouse Interaction
    let targetMouseX = 0;
    let targetMouseY = 0;
    let mouseX = 0;
    let mouseY = 0;

    const onMouseMove = (e: MouseEvent) => {
      targetMouseX = (e.clientX / window.innerWidth - 0.5) * 2;
      targetMouseY = (e.clientY / window.innerHeight - 0.5) * 2;
    };

    window.addEventListener("mousemove", onMouseMove);

    // Resize
    const onResize = () => {
      if (!container) return;
      width = container.clientWidth || window.innerWidth;
      height = container.clientHeight || window.innerHeight;
      camera.aspect = width / height;
      camera.updateProjectionMatrix();
      renderer.setSize(width, height);
    };

    window.addEventListener("resize", onResize);

    // Animation Loop with Scroll-Driven 3D Camera Path
    let animationFrameId: number;

    const animate = () => {
      // Smooth mouse lerp
      mouseX += (targetMouseX - mouseX) * 0.05;
      mouseY += (targetMouseY - mouseY) * 0.05;

      // Telemetry rings rotation
      telemetryRing1.rotation.z += 0.003;
      telemetryRing2.rotation.x += 0.002;
      telemetryRing3.rotation.y += 0.0025;

      // Merkle lattice cube rotation
      cubeGroup.rotation.x += 0.005;
      cubeGroup.rotation.y += 0.007;

      // Floating data particles
      const posAttr = particleGeometry.attributes.position as THREE.BufferAttribute;
      for (let i = 0; i < particleCount; i++) {
        let y = posAttr.getY(i) + 0.0035;
        if (y > 9) y = -9;
        posAttr.setY(i, y);
      }
      posAttr.needsUpdate = true;

      // DYNAMIC 3D CAMERA SCROLL CONTROLLER
      const p = progressRef.current; // 0 to 1

      // 0.00 - 0.25 (Hero): Frontal focus on Chromium Viewport & Merkle Cube
      // 0.25 - 0.50 (Pipeline): Lateral sweep along telemetry rings
      // 0.50 - 0.75 (Scopes): Oblique exploded multi-viewport angle
      // 0.75 - 1.00 (Engine/Metrics): Majestic isometric zoom-out of full autonomous swarm

      let targetCamX = mouseX * 0.5;
      let targetCamY = -mouseY * 0.5;
      let targetCamZ = 7.5;
      let targetRotX = 0;
      let targetRotY = 0;

      if (p <= 0.25) {
        const localP = p / 0.25;
        targetCamZ = 7.5 - localP * 1.2;
        targetCamY = -mouseY * 0.5 + localP * 0.4;
      } else if (p <= 0.5) {
        const localP = (p - 0.25) / 0.25;
        targetCamX = 2.2 * localP + mouseX * 0.4;
        targetCamY = 0.4 - localP * 2.0;
        targetCamZ = 6.3 - localP * 0.8;
        targetRotX = localP * 0.25;
        targetRotY = -localP * 0.35;
      } else if (p <= 0.75) {
        const localP = (p - 0.5) / 0.25;
        targetCamX = 2.2 - localP * 4.2 + mouseX * 0.4;
        targetCamY = -1.6 - localP * 1.2;
        targetCamZ = 5.5 + localP * 1.8;
        targetRotX = 0.25 - localP * 0.15;
        targetRotY = -0.35 + localP * 0.55;
      } else {
        const localP = (p - 0.75) / 0.25;
        targetCamX = -2.0 + localP * 2.0 + mouseX * 0.4;
        targetCamY = -2.8 + localP * 0.8;
        targetCamZ = 7.3 + localP * 2.0;
        targetRotX = 0.1;
        targetRotY = 0.2 - localP * 0.2;
      }

      camera.position.x += (targetCamX - camera.position.x) * 0.08;
      camera.position.y += (targetCamY - camera.position.y) * 0.08;
      camera.position.z += (targetCamZ - camera.position.z) * 0.08;

      worldGroup.rotation.x += (targetRotX - worldGroup.rotation.x) * 0.08;
      worldGroup.rotation.y += (targetRotY - worldGroup.rotation.y) * 0.08;

      renderer.render(scene, camera);
      animationFrameId = requestAnimationFrame(animate);
    };

    animate();

    return () => {
      window.removeEventListener("mousemove", onMouseMove);
      window.removeEventListener("resize", onResize);
      cancelAnimationFrame(animationFrameId);
      if (container.contains(renderer.domElement)) {
        container.removeChild(renderer.domElement);
      }
      renderer.dispose();
    };
  }, []);

  return (
    <div
      ref={containerRef}
      className={`pointer-events-none fixed inset-0 z-0 overflow-hidden ${className}`}
    />
  );
}
