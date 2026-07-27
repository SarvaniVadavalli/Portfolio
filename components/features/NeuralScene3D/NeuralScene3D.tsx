"use client";

import React, { useEffect, useRef } from "react";
import * as THREE from "three";

export default function NeuralScene3D() {
  const containerRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    // 1. Check client environment
    if (typeof window === "undefined") return;

    // 2. Mobile / Tablet Check (Disable 3D entirely on viewports < 768px for battery/perf)
    const isMobile = window.innerWidth < 768 || window.matchMedia("(max-width: 768px)").matches;
    if (isMobile) return;

    // 3. Reduced Motion Check
    const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    // 4. Setup Scene, Camera, and WebGL Renderer
    const container = containerRef.current;
    if (!container) return;

    const width = container.clientWidth;
    const height = container.clientHeight;

    const scene = new THREE.Scene();

    // Setup camera with reasonable field of view and z position
    const camera = new THREE.PerspectiveCamera(60, width / height, 0.1, 100);
    camera.position.z = 25;

    // WebGLRenderer with alpha transparent background so underlying 2D neural network can show through
    const renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    container.appendChild(renderer.domElement);

    // 5. Generate 3D Neural Net Geometry
    const group = new THREE.Group();
    scene.add(group);

    const nodeCount = 80;
    const pointsArray: THREE.Vector3[] = [];
    const positions: number[] = [];

    for (let i = 0; i < nodeCount; i++) {
      let x = (Math.random() - 0.5) * 44;
      while (Math.abs(x) < 6.5) {
        x = (Math.random() - 0.5) * 44;
      }

      let y = (Math.random() - 0.5) * 26;
      if (x > 6.5) {
        while (y > -5.0 && y < 8.0) {
          y = (Math.random() - 0.5) * 26;
        }
      }

      const z = (Math.random() - 0.5) * 16;

      pointsArray.push(new THREE.Vector3(x, y, z));
      positions.push(x, y, z);
    }

    // Nodes (Points)
    const pointsGeometry = new THREE.BufferGeometry();
    pointsGeometry.setAttribute("position", new THREE.Float32BufferAttribute(positions, 3));

    const pointsMaterial = new THREE.PointsMaterial({
      color: 0x14b8a6,
      size: 0.15,
      transparent: true,
      opacity: 0.16,
    });
    const pointCloud = new THREE.Points(pointsGeometry, pointsMaterial);
    group.add(pointCloud);

    // Connections (Lines)
    const linePositions: number[] = [];
    const maxConnectionDistance = 7.0;

    for (let i = 0; i < nodeCount; i++) {
      for (let j = i + 1; j < nodeCount; j++) {
        const dist = pointsArray[i].distanceTo(pointsArray[j]);
        if (dist < maxConnectionDistance) {
          linePositions.push(pointsArray[i].x, pointsArray[i].y, pointsArray[i].z);
          linePositions.push(pointsArray[j].x, pointsArray[j].y, pointsArray[j].z);
        }
      }
    }

    const linesGeometry = new THREE.BufferGeometry();
    linesGeometry.setAttribute("position", new THREE.Float32BufferAttribute(linePositions, 3));
    const linesMaterial = new THREE.LineBasicMaterial({
      color: 0x14b8a6,
      transparent: true,
      opacity: 0.045,
    });
    const lineSegments = new THREE.LineSegments(linesGeometry, linesMaterial);
    group.add(lineSegments);

    // 6. State variables for interactive physics/drifts
    let targetMouseX = 0;
    let targetMouseY = 0;
    let mouseX = 0;
    let mouseY = 0;

    let targetScrollY = 0;
    let scrollY = 0;
    let scrollVelocity = 0;
    let lastScrollTop = 0;

    const handleMouseMove = (e: MouseEvent) => {
      targetMouseX = (e.clientX / window.innerWidth - 0.5) * 2;
      targetMouseY = (e.clientY / window.innerHeight - 0.5) * 2;
    };

    const mainContainer = document.querySelector("main");
    const handleScroll = () => {
      if (!mainContainer) return;
      const scrollTop = mainContainer.scrollTop;
      const delta = scrollTop - lastScrollTop;
      scrollVelocity += delta * 0.00025;
      lastScrollTop = scrollTop;
      targetScrollY = scrollTop * 0.00012;
    };

    if (!prefersReducedMotion) {
      window.addEventListener("mousemove", handleMouseMove, { passive: true });
      if (mainContainer) {
        mainContainer.addEventListener("scroll", handleScroll, { passive: true });
      }
    }

    // 7. Animation Loop
    let animationFrameId: number | null = null;
    let idleRotationY = 0;

    const animate = () => {
      animationFrameId = requestAnimationFrame(animate);

      const targetColor = 0x14b8a6;
      pointsMaterial.color.setHex(targetColor);
      linesMaterial.color.setHex(targetColor);

      if (!prefersReducedMotion) {
        idleRotationY += 0.00035;

        mouseX += (targetMouseX - mouseX) * 0.05;
        mouseY += (targetMouseY - mouseY) * 0.05;

        scrollY += (targetScrollY - scrollY) * 0.05;
        scrollY += scrollVelocity;
        scrollVelocity *= 0.92;

        group.rotation.y = idleRotationY + scrollY + mouseX * 0.08;
        group.rotation.x = mouseY * 0.05;
      }

      renderer.render(scene, camera);
    };

    animate();

    // 8. Handle Window Resizing
    const handleResize = () => {
      if (!container) return;
      const w = container.clientWidth;
      const h = container.clientHeight;
      camera.aspect = w / h;
      camera.updateProjectionMatrix();
      renderer.setSize(w, h);
    };

    window.addEventListener("resize", handleResize, { passive: true });

    return () => {
      if (animationFrameId !== null) {
        cancelAnimationFrame(animationFrameId);
      }
      window.removeEventListener("resize", handleResize);
      window.removeEventListener("mousemove", handleMouseMove);
      if (mainContainer) {
        mainContainer.removeEventListener("scroll", handleScroll);
      }
      if (container && renderer.domElement.parentNode === container) {
        container.removeChild(renderer.domElement);
      }

      pointsGeometry.dispose();
      pointsMaterial.dispose();
      linesGeometry.dispose();
      linesMaterial.dispose();
      renderer.dispose();
    };
  }, []);

  return (
    <div
      ref={containerRef}
      className="fixed inset-0 w-full h-full pointer-events-none z-[2]"
      style={{ mixBlendMode: "screen" }}
    />
  );
}
