"use client";

import React, { useEffect, useRef, useState } from "react";

export interface NeuralNode {
  x: number;
  y: number;
  vx: number;
  vy: number;
  baseVx: number;
  baseVy: number;
  radius: number;
  drawX: number;
  drawY: number;
  influence: number;
  opacity: number;
  theta: number;
  orbitSpeed: number;
  focusWeight: number;
  pulseIntensity: number;
  sweepHighlight: number;
}

export interface LetterPosition {
  x: number;
  y: number;
  el: HTMLElement;
}

export interface SectionParam {
  nodeCount: number;
  connDist: number;
  speedFactor: number;
  cursorStrength: number;
  pushRadius: number;
  centerpieceOpacity: number;
  isClustered?: number;
  isGitHubGravitated?: number;
}

export default function NeuralBackground() {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const activeSectionRef = useRef<string>("hero");
  const [reducedMotion, setReducedMotion] = useState<boolean>(false);

  // Track the active section via IntersectionObserver
  useEffect(() => {
    const sections = [
      "hero",
      "about",
      "skills",
      "journey",
      "projects",
      "github",
      "learning",
      "talk",
    ];
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            activeSectionRef.current = entry.target.id;
          }
        });
      },
      {
        root: null,
        rootMargin: "-45% 0px -45% 0px", // Detect active section in the viewport center
        threshold: 0.05,
      }
    );

    sections.forEach((id) => {
      const el = document.getElementById(id);
      if (el) observer.observe(el);
    });

    return () => observer.disconnect();
  }, []);

  // Track reduced motion setting
  useEffect(() => {
    const mediaQuery = window.matchMedia("(prefers-reduced-motion: reduce)");
    const motionHandler = (e: MediaQueryListEvent) => setReducedMotion(e.matches);
    mediaQuery.addEventListener("change", motionHandler);

    setTimeout(() => {
      setReducedMotion(mediaQuery.matches);
    }, 0);

    return () => mediaQuery.removeEventListener("change", motionHandler);
  }, []);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let animationId: number | null = null;
    let isTouchDevice = false;

    if (typeof window !== "undefined") {
      isTouchDevice = "ontouchstart" in window || navigator.maxTouchPoints > 0;
    }

    const mouse: { x: number | null; y: number | null } = { x: null, y: null };

    // Headline letters tracking cache
    let letterPositions: LetterPosition[] = [];
    const updateLetterCache = () => {
      if (typeof document === "undefined") return;
      const letters = document.querySelectorAll<HTMLElement>(".hero-hover-letter");
      const canvasRect = canvas.getBoundingClientRect();
      letterPositions = Array.from(letters).map((el) => {
        const rect = el.getBoundingClientRect();
        return {
          x: rect.left - canvasRect.left + rect.width / 2,
          y: rect.top - canvasRect.top + rect.height / 2,
          el: el,
        };
      });
    };

    // Physics parameters for section personalities
    const SECTION_PARAMS: Record<string, SectionParam> = {
      hero: {
        nodeCount: 24,
        connDist: 220,
        speedFactor: 0.9,
        cursorStrength: 1.4,
        pushRadius: 240,
        centerpieceOpacity: 1.0,
      },
      about: {
        nodeCount: 24,
        connDist: 180,
        speedFactor: 0.35,
        cursorStrength: 0.4,
        pushRadius: 180,
        centerpieceOpacity: 0.0,
      },
      skills: {
        nodeCount: 28,
        connDist: 180,
        speedFactor: 0.45,
        cursorStrength: 0.4,
        pushRadius: 180,
        centerpieceOpacity: 0.0,
        isClustered: 1.0,
      },
      journey: {
        nodeCount: 28,
        connDist: 180,
        speedFactor: 0.4,
        cursorStrength: 0.4,
        pushRadius: 180,
        centerpieceOpacity: 0.0,
      },
      projects: {
        nodeCount: 32,
        connDist: 220,
        speedFactor: 1.2,
        cursorStrength: 1.0,
        pushRadius: 200,
        centerpieceOpacity: 0.0,
      },
      github: {
        nodeCount: 32,
        connDist: 190,
        speedFactor: 0.6,
        cursorStrength: 0.6,
        pushRadius: 190,
        centerpieceOpacity: 0.0,
        isGitHubGravitated: 1.0,
      },
      learning: {
        nodeCount: 28,
        connDist: 180,
        speedFactor: 0.45,
        cursorStrength: 0.5,
        pushRadius: 180,
        centerpieceOpacity: 0.0,
      },
      talk: {
        nodeCount: 18,
        connDist: 150,
        speedFactor: 0.3,
        cursorStrength: 0.3,
        pushRadius: 150,
        centerpieceOpacity: 0.0,
      },
    };

    // First engagement signature pulse variables
    let pulseActive = false;
    let pulseStartTime = 0;
    let pulseTriggered = false;

    const triggerEngagementPulse = () => {
      if (pulseTriggered) return;
      if (typeof window !== "undefined") {
        if (sessionStorage.getItem("hero_pulse_triggered_m13") === "true") {
          pulseTriggered = true;
          return;
        }
        sessionStorage.setItem("hero_pulse_triggered_m13", "true");
      }
      pulseTriggered = true;
      pulseActive = true;
      pulseStartTime = Date.now();
    };

    const handleFirstEngagement = () => {
      triggerEngagementPulse();
      window.removeEventListener("mousemove", handleFirstEngagement);
      window.removeEventListener("touchstart", handleFirstEngagement);
      window.removeEventListener("wheel", handleFirstEngagement);
    };

    window.addEventListener("mousemove", handleFirstEngagement);
    window.addEventListener("touchstart", handleFirstEngagement);
    window.addEventListener("wheel", handleFirstEngagement);

    const handleMouseMove = (e: MouseEvent) => {
      mouse.x = e.clientX;
      mouse.y = e.clientY;
    };

    const handleMouseLeave = () => {
      mouse.x = null;
      mouse.y = null;
    };

    window.addEventListener("mousemove", handleMouseMove);
    window.addEventListener("mouseleave", handleMouseLeave);

    // Nodes system
    const MAX_NODES = 100;
    const nodes: NeuralNode[] = [];

    // Scroll offset tracking
    let scrollOffset = 0;
    let lastScrollY = 0;
    let scrollVelocity = 0;
    let lastScrollTime = 0;

    const handleScroll = () => {
      lastScrollTime = Date.now();
      const main = document.querySelector("main");
      if (!main) return;
      const currentScrollY = main.scrollTop;
      scrollOffset = currentScrollY;
      scrollVelocity = Math.min(
        2.0,
        scrollVelocity + Math.abs(currentScrollY - lastScrollY) * 0.04
      );
      lastScrollY = currentScrollY;
    };

    const mainContainer = document.querySelector("main");
    if (mainContainer) {
      mainContainer.addEventListener("scroll", handleScroll, { passive: true });
    }

    const getMinSpacedPoint = (
      existingNodes: NeuralNode[],
      minDistance: number,
      width: number,
      height: number
    ): { x: number; y: number } => {
      const margin = 20;
      const safeW = Math.max(10, width - margin * 2);
      const safeH = Math.max(10, height - margin * 2);
      let attempts = 0;
      while (attempts < 100) {
        const x = margin + Math.random() * safeW;
        const y = margin + Math.random() * safeH;

        let valid = true;
        for (const node of existingNodes) {
          const dx = node.x - x;
          const dy = node.y - y;
          if (Math.sqrt(dx * dx + dy * dy) < minDistance) {
            valid = false;
            break;
          }
        }
        if (valid) return { x, y };
        attempts++;
      }
      return {
        x: margin + Math.random() * safeW,
        y: margin + Math.random() * safeH,
      };
    };

    const initNodes = () => {
      if (canvas.width <= 10 || canvas.height <= 10) return;
      nodes.length = 0;
      const isDesktop = canvas.width >= 1024;
      const minSpacing = isDesktop ? 65 : 45;

      const centerX = canvas.width * 0.5;
      const centerY = canvas.height * 0.5;
      const scale = canvas.width < 768 ? 0.6 : 1.0;

      const activeSec = activeSectionRef.current || "hero";
      const initialNodeCount = SECTION_PARAMS[activeSec]?.nodeCount || 24;

      const boundaryMargin = 30;
      for (let i = 0; i < MAX_NODES; i++) {
        let x: number, y: number;
        const theta = (i % 8) * (Math.PI / 4) + Math.random() * 0.2;
        const orbitSpeed = 0.0003 * (i < 8 ? 1 : -1.2);

        if (i < 16) {
          const R_base = i < 8 ? 120 : 220;
          const R = R_base * scale;
          x = centerX + R * Math.cos(theta);
          y = centerY + R * Math.sin(theta);
        } else if (i < 56) {
          const angle = Math.random() * Math.PI * 2;
          const radius = (Math.random() * 200 + 80) * scale;
          x = centerX + radius * Math.cos(angle);
          y = centerY + radius * Math.sin(angle);
        } else {
          const pt = getMinSpacedPoint(
            nodes,
            minSpacing,
            canvas.width,
            canvas.height
          );
          x = pt.x;
          y = pt.y;
        }

        x = Math.max(boundaryMargin, Math.min(canvas.width - boundaryMargin, x));
        y = Math.max(boundaryMargin, Math.min(canvas.height - boundaryMargin, y));

        nodes.push({
          x,
          y,
          vx: (Math.random() - 0.5) * 0.12,
          vy: (Math.random() - 0.5) * 0.12,
          baseVx: (Math.random() - 0.5) * 0.12,
          baseVy: (Math.random() - 0.5) * 0.12,
          radius: Math.random() * 1.3 + 1.1,
          drawX: x,
          drawY: y,
          influence: 0,
          opacity: i < initialNodeCount ? 1.0 : 0.0,
          theta,
          orbitSpeed,
          focusWeight: 0,
          pulseIntensity: 0,
          sweepHighlight: 0,
        });
      }
    };

    const resizeCanvas = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
      initNodes();
      updateLetterCache();
    };
    resizeCanvas();
    setTimeout(updateLetterCache, 400);

    let resizeTimeout: ReturnType<typeof setTimeout> | null = null;
    const handleResize = () => {
      if (resizeTimeout) clearTimeout(resizeTimeout);
      resizeTimeout = setTimeout(resizeCanvas, 150);
    };
    window.addEventListener("resize", handleResize);

    // Easing transition variables
    let currentSpeedFactor = 1.0;
    let currentConnDist = 180;
    let currentCursorStrength = 1.0;
    let currentPushRadius = 200;
    let currentHeroRightBias = 0.0;

    let lastFocusTime = Date.now();
    let focusNodeIndex = 0;

    const draw = () => {
      if (!canvas.width || !canvas.height) return;

      const nodeColorRGB = "20, 184, 166";
      const lineColorRGB = "14, 165, 233";
      const glowColorRGB = "224, 242, 254";

      const isDesktop = canvas.width >= 1024;
      const vh = canvas.height;
      const s = scrollOffset / vh;

      let nodeCount = 0;
      let connDist = 0;
      let speedFactor = 0;
      let cursorStrength = 0;
      let pushRadius = 0;
      let centerpieceOpacity = 0;
      let isClustered = 0;
      let isGitHubGravitated = 0;

      const keys = [
        "hero",
        "about",
        "skills",
        "journey",
        "projects",
        "github",
        "learning",
        "talk",
      ];
      keys.forEach((key, index) => {
        const weight = Math.max(0, 1 - Math.abs(s - index));
        if (weight > 0) {
          const p = SECTION_PARAMS[key];
          nodeCount += (p.nodeCount || 0) * weight;
          connDist += (p.connDist || 0) * weight;
          speedFactor += (p.speedFactor || 0) * weight;
          cursorStrength += (p.cursorStrength || 0) * weight;
          pushRadius += (p.pushRadius || 0) * weight;
          centerpieceOpacity += (p.centerpieceOpacity || 0) * weight;
          isClustered += (p.isClustered || 0) * weight;
          isGitHubGravitated += (p.isGitHubGravitated || 0) * weight;
        }
      });

      ctx.clearRect(0, 0, canvas.width, canvas.height);

      const centerX = canvas.width * 0.5;
      const centerY = canvas.height * 0.5;

      const targetHeroRightBias = activeSectionRef.current === "hero" ? 1.0 : 0.0;
      currentHeroRightBias +=
        (targetHeroRightBias - currentHeroRightBias) * 0.04;

      const shiftX = isDesktop ? currentHeroRightBias * (canvas.width * 0.22) : 0;
      const activeCenterX = centerX + shiftX;

      const heroOpacity = Math.max(0, 1 - scrollOffset / (vh * 0.8));
      if (heroOpacity > 0.01) {
        const spotX = activeCenterX;
        const spotY = centerY;
        const innerRadius = 0;
        const outerRadius = Math.max(canvas.width * 0.4, 400);

        const radialGlow = ctx.createRadialGradient(
          spotX,
          spotY,
          innerRadius,
          spotX,
          spotY,
          outerRadius
        );

        radialGlow.addColorStop(0, `rgba(${glowColorRGB}, ${0.025 * heroOpacity})`);
        radialGlow.addColorStop(
          0.3,
          `rgba(${glowColorRGB}, ${0.008 * heroOpacity})`
        );
        radialGlow.addColorStop(1, `rgba(${glowColorRGB}, 0)`);

        ctx.fillStyle = radialGlow;
        ctx.beginPath();
        ctx.arc(spotX, spotY, outerRadius, 0, Math.PI * 2);
        ctx.fill();
      }

      const scale = canvas.width < 768 ? 0.6 : 1.0;

      let pulseRadius = -1;
      let pulseOpacity = 0;
      if (pulseActive) {
        const elapsed = Date.now() - pulseStartTime;
        const duration = 1500;
        if (elapsed < duration) {
          const t = elapsed / duration;
          pulseRadius = t * Math.max(canvas.width, canvas.height) * 1.2;
          pulseOpacity = Math.sin(t * Math.PI) * 0.15;
        } else {
          pulseActive = false;
        }
      }

      if (centerpieceOpacity > 0.01) {
        const now = Date.now();
        if (now - lastFocusTime > 3500) {
          lastFocusTime = now;
          focusNodeIndex = Math.floor(Math.random() * 16);
        }
      }

      currentSpeedFactor += (speedFactor - currentSpeedFactor) * 0.05;
      currentConnDist += (connDist - currentConnDist) * 0.05;
      currentCursorStrength += (cursorStrength - currentCursorStrength) * 0.05;
      currentPushRadius += (pushRadius - currentPushRadius) * 0.05;

      const clusterCenters = isDesktop
        ? [
            { x: canvas.width * 0.25, y: canvas.height * 0.5 },
            { x: canvas.width * 0.5, y: canvas.height * 0.5 },
            { x: canvas.width * 0.75, y: canvas.height * 0.5 },
          ]
        : [
            { x: canvas.width * 0.5, y: canvas.height * 0.35 },
            { x: canvas.width * 0.5, y: canvas.height * 0.55 },
            { x: canvas.width * 0.5, y: canvas.height * 0.75 },
          ];

      if (!reducedMotion) {
        const minAllowedSpacing = isDesktop ? 90 : 60;
        for (let i = 0; i < nodes.length; i++) {
          if (nodes[i].opacity <= 0.005) continue;
          for (let j = i + 1; j < nodes.length; j++) {
            if (nodes[j].opacity <= 0.005) continue;

            const dx = nodes[i].x - nodes[j].x;
            const dy = nodes[i].y - nodes[j].y;
            const dist = Math.sqrt(dx * dx + dy * dy);

            if (dist < minAllowedSpacing) {
              const force = (minAllowedSpacing - dist) * 0.00015;
              if (dist > 0) {
                const pushX = (dx / dist) * force;
                const pushY = (dy / dist) * force;

                nodes[i].vx += pushX;
                nodes[i].vy += pushY;
                nodes[j].vx -= pushX;
                nodes[j].vy -= pushY;
              }
            }
          }
        }
      }

      nodes.forEach((node, idx) => {
        const targetOpacity = idx < nodeCount ? 1.0 : 0.0;

        let falloff = 1.0;
        if (idx >= 16 && centerpieceOpacity > 0.01) {
          const distToCenter = Math.sqrt(
            (node.x - activeCenterX) ** 2 + (node.y - centerY) ** 2
          );
          const decayStart = 280 * scale;
          const decayEnd = 650 * scale;
          const factor = Math.max(
            0,
            Math.min(1, (distToCenter - decayStart) / (decayEnd - decayStart))
          );
          const maxReduction = 0.75;
          falloff = 1 - factor * maxReduction * centerpieceOpacity;
        }
        node.opacity += (targetOpacity * falloff - node.opacity) * 0.05;

        const isFocused = idx === focusNodeIndex && centerpieceOpacity > 0.01;
        node.focusWeight += ((isFocused ? 1.0 : 0.0) - node.focusWeight) * 0.05;

        let pulseIntensity = 0;
        if (pulseRadius > 0) {
          const dist = Math.sqrt(
            (node.x - activeCenterX) ** 2 + (node.y - centerY) ** 2
          );
          const dDiff = Math.abs(dist - pulseRadius);
          if (dDiff < 150) {
            pulseIntensity = (1 - dDiff / 150) * pulseOpacity;
          }
        }
        node.pulseIntensity = pulseIntensity;

        if (node.opacity <= 0.005) return;

        if (idx < 16 && centerpieceOpacity > 0.005) {
          node.theta += node.orbitSpeed * currentSpeedFactor;
          const R_base = idx < 8 ? 120 : 220;
          const breathe = Math.sin(Date.now() * 0.0008 + idx) * 4;
          const R = (R_base + breathe) * scale;

          const orbitX = activeCenterX + R * Math.cos(node.theta);
          const orbitY = centerY + R * Math.sin(node.theta);

          const pull = centerpieceOpacity * 0.08;
          node.x += (orbitX - node.x) * pull;
          node.y += (orbitY - node.y) * pull;
          node.vx += ((orbitX - node.x) * 0.01 - node.vx) * pull;
          node.vy += ((orbitY - node.y) * 0.01 - node.vy) * pull;
        }

        if (!reducedMotion) {
          if (isClustered > 0.005 && idx >= 16) {
            const cluster = clusterCenters[idx % 3];
            const clusterPull = isClustered * 0.025;
            node.vx += (cluster.x - node.x) * clusterPull;
            node.vy += (cluster.y - node.y) * clusterPull;
          }

          if (isGitHubGravitated > 0.005 && isDesktop) {
            const targetX = canvas.width * 0.75;
            const targetY = canvas.height * 0.5;
            const dx = targetX - node.x;
            const dy = targetY - node.y;
            const dist = Math.sqrt(dx * dx + dy * dy);
            if (dist > 80) {
              node.vx += (dx / dist) * 0.0006 * isGitHubGravitated;
              node.vy += (dy / dist) * 0.0006 * isGitHubGravitated;
            }
          }

          const targetVx = node.baseVx * currentSpeedFactor;
          const targetVy = node.baseVy * currentSpeedFactor;
          node.vx += (targetVx - node.vx) * 0.04;
          node.vy += (targetVy - node.vy) * 0.04;

          const speed = Math.sqrt(node.vx * node.vx + node.vy * node.vy);
          const maxSpeed = 0.2 * currentSpeedFactor;
          if (speed > maxSpeed) {
            node.vx = (node.vx / speed) * maxSpeed;
            node.vy = (node.vy / speed) * maxSpeed;
          }

          node.x += node.vx * (1 + scrollVelocity * 1.5);
          node.y += node.vy * (1 + scrollVelocity * 1.5);
        }

        const scrollParallaxY = scrollOffset * 0.15;
        let drawX = node.x;
        let drawY = node.y - scrollParallaxY;
        const wrapHeight = canvas.height + 100;
        drawY = ((drawY + 50) % wrapHeight + wrapHeight) % wrapHeight - 50;

        if (mouse.x !== null && mouse.y !== null && !reducedMotion) {
          const dx = drawX - mouse.x;
          const dy = drawY - mouse.y;
          const cursorDistance = Math.sqrt(dx * dx + dy * dy);
          if (cursorDistance < currentPushRadius) {
            const targetInfluence = 1;
            if (node.influence < targetInfluence) {
              node.influence = Math.min(1, node.influence + 0.08);
            }
            const force =
              cursorStrength * (1 - cursorDistance / currentPushRadius);
            if (cursorDistance > 0) {
              drawX += (dx / cursorDistance) * force * 15;
              drawY += (dy / cursorDistance) * force * 15;
            }
          } else {
            node.influence = Math.max(0, node.influence - 0.02);
          }
        } else {
          node.influence = Math.max(0, node.influence - 0.02);
        }

        const boundaryMargin = 30;
        if (node.x < boundaryMargin) {
          node.x = boundaryMargin;
          node.vx = Math.abs(node.vx);
        }
        if (node.x > canvas.width - boundaryMargin) {
          node.x = canvas.width - boundaryMargin;
          node.vx = -Math.abs(node.vx);
        }
        if (node.y < boundaryMargin) {
          node.y = boundaryMargin;
          node.vy = Math.abs(node.vy);
        }
        if (node.y > canvas.height - boundaryMargin) {
          node.y = canvas.height - boundaryMargin;
          node.vy = -Math.abs(node.vy);
        }

        const drawMargin = 30;
        node.drawX = Math.max(drawMargin, Math.min(canvas.width - drawMargin, drawX));
        node.drawY = Math.max(drawMargin, Math.min(canvas.height - drawMargin, drawY));
      });

      const drawConnectionsForSubset = (startIndex: number, endIndex: number) => {
        ctx.lineWidth = 0.7;

        const bins: { x1: number; y1: number; x2: number; y2: number }[][] = Array.from(
          { length: 5 },
          () => []
        );
        const binAlphas = [0.03, 0.07, 0.12, 0.18, 0.26];

        for (let i = startIndex; i < endIndex; i++) {
          if (i >= nodes.length || nodes[i].opacity <= 0.005) continue;
          for (let j = i + 1; j < nodes.length; j++) {
            if (nodes[j].opacity <= 0.005) continue;

            const dx = nodes[i].drawX - nodes[j].drawX;
            const dy = nodes[i].drawY - nodes[j].drawY;
            const dist = Math.sqrt(dx * dx + dy * dy);

            const lineInfluence = Math.max(
              nodes[i].influence,
              nodes[j].influence
            );
            const linePulse = Math.max(
              nodes[i].pulseIntensity || 0,
              nodes[j].pulseIntensity || 0
            );
            const maxConnDist = currentConnDist + lineInfluence * 50;

            if (dist < maxConnDist) {
              const connectionOpacity = nodes[i].opacity * nodes[j].opacity;
              let alpha =
                (1 - dist / maxConnDist) *
                (0.09 + lineInfluence * 0.14) *
                connectionOpacity;

              let cursorGlow = 0;
              if (mouse.x !== null && mouse.y !== null && !reducedMotion) {
                const midX = (nodes[i].drawX + nodes[j].drawX) / 2;
                const midY = (nodes[i].drawY + nodes[j].drawY) / 2;
                const cursorDist = Math.sqrt(
                  (midX - mouse.x) * (midX - mouse.x) +
                    (midY - mouse.y) * (midY - mouse.y)
                );
                if (cursorDist < 180) {
                  cursorGlow = (1 - cursorDist / 180) * 0.16 * centerpieceOpacity;
                }
              }
              alpha += cursorGlow;

              if (linePulse > 0) {
                alpha += linePulse * 0.25;
              }

              if (centerpieceOpacity > 0.01 && i < 16 && j < 16) {
                const partnerIndex = (focusNodeIndex + 5) % 16;
                const isAttentionLink =
                  (i === focusNodeIndex && j === partnerIndex) ||
                  (j === focusNodeIndex && i === partnerIndex);
                if (isAttentionLink) {
                  const focusAlpha =
                    0.08 * Math.max(nodes[i].focusWeight, nodes[j].focusWeight);
                  alpha = Math.max(alpha, focusAlpha);
                }
              }

              if (centerpieceOpacity > 0.01 && (i >= 16 || j >= 16)) {
                const dist1 = Math.sqrt(
                  (nodes[i].x - activeCenterX) ** 2 + (nodes[i].y - centerY) ** 2
                );
                const dist2 = Math.sqrt(
                  (nodes[j].x - activeCenterX) ** 2 + (nodes[j].y - centerY) ** 2
                );
                const avgDist = (dist1 + dist2) / 2;
                const decayStart = 280 * scale;
                const decayEnd = 650 * scale;
                const factor = Math.max(
                  0,
                  Math.min(1, (avgDist - decayStart) / (decayEnd - decayStart))
                );
                const lineFalloff = 1 - factor * 0.8 * centerpieceOpacity;
                alpha *= lineFalloff;
              }

              if (alpha > 0.005) {
                let binIdx = 0;
                let minDist = Math.abs(alpha - binAlphas[0]);
                for (let k = 1; k < binAlphas.length; k++) {
                  const d = Math.abs(alpha - binAlphas[k]);
                  if (d < minDist) {
                    minDist = d;
                    binIdx = k;
                  }
                }
                bins[binIdx].push({
                  x1: nodes[i].drawX,
                  y1: nodes[i].drawY,
                  x2: nodes[j].drawX,
                  y2: nodes[j].drawY,
                });
              }
            }
          }
        }

        bins.forEach((lines, binIdx) => {
          if (lines.length === 0) return;
          ctx.strokeStyle = `rgba(${lineColorRGB}, ${binAlphas[binIdx]})`;
          ctx.beginPath();
          lines.forEach((line) => {
            ctx.moveTo(line.x1, line.y1);
            ctx.lineTo(line.x2, line.y2);
          });
          ctx.stroke();
        });
      };

      const drawCursorConnections = () => {
        if (
          mouse.x !== null &&
          mouse.y !== null &&
          !isTouchDevice &&
          !reducedMotion
        ) {
          const bins: { x: number; y: number }[][] = Array.from(
            { length: 4 },
            () => []
          );
          const binAlphas = [0.03, 0.07, 0.12, 0.18];

          nodes.forEach((node, idx) => {
            if (node.opacity <= 0.005) return;
            const dx = node.drawX - (mouse.x as number);
            const dy = node.drawY - (mouse.y as number);
            const dist = Math.sqrt(dx * dx + dy * dy);

            const maxCursorDist = 200;
            if (dist < maxCursorDist) {
              let alpha =
                (1 - dist / maxCursorDist) *
                0.05 *
                node.opacity *
                currentCursorStrength;

              if (idx < 16 && centerpieceOpacity > 0.01) {
                alpha += (1 - dist / maxCursorDist) * 0.06 * centerpieceOpacity;
              }

              if (alpha > 0.005) {
                let binIdx = 0;
                let minDist = Math.abs(alpha - binAlphas[0]);
                for (let k = 1; k < binAlphas.length; k++) {
                  const d = Math.abs(alpha - binAlphas[k]);
                  if (d < minDist) {
                    minDist = d;
                    binIdx = k;
                  }
                }
                bins[binIdx].push({
                  x: node.drawX,
                  y: node.drawY,
                });
              }
            }
          });

          bins.forEach((lines, binIdx) => {
            if (lines.length === 0) return;
            ctx.strokeStyle = `rgba(${lineColorRGB}, ${binAlphas[binIdx]})`;
            ctx.beginPath();
            lines.forEach((line) => {
              ctx.moveTo(line.x, line.y);
              ctx.lineTo(mouse.x as number, mouse.y as number);
            });
            ctx.stroke();
          });
        }
      };

      const drawHeadlineConnections = () => {
        if (
          activeSectionRef.current === "hero" &&
          mouse.x !== null &&
          mouse.y !== null &&
          !isTouchDevice &&
          !reducedMotion
        ) {
          if (letterPositions.length === 0) {
            updateLetterCache();
          }

          const litLetters: { letter: LetterPosition; dist: number }[] = [];
          letterPositions.forEach((letter) => {
            const dx = letter.x - (mouse.x as number);
            const dy = letter.y - (mouse.y as number);
            const dist = Math.sqrt(dx * dx + dy * dy);

            if (dist < 160) {
              litLetters.push({
                letter,
                dist,
              });
            } else {
              letter.el.style.color = "";
              letter.el.style.transform = "";
            }
          });

          litLetters.sort((a, b) => a.dist - b.dist);
          const activeConnections = litLetters.slice(0, 3);

          activeConnections.forEach((conn) => {
            const { letter, dist } = conn;
            const intensity = 1 - dist / 160;

            letter.el.style.color = "var(--color-accent-glow)";
            letter.el.style.transform = "translateY(-3px)";

            const alpha = intensity * 0.12;
            ctx.strokeStyle = `rgba(${glowColorRGB}, ${alpha})`;
            ctx.lineWidth = 0.7;
            ctx.beginPath();
            ctx.moveTo(mouse.x as number, mouse.y as number);
            ctx.lineTo(letter.x, letter.y);
            ctx.stroke();
          });

          litLetters.slice(3).forEach((conn) => {
            conn.letter.el.style.color = "";
            conn.letter.el.style.transform = "";
          });
        } else {
          letterPositions.forEach((letter) => {
            if (letter.el) {
              letter.el.style.color = "";
              letter.el.style.transform = "";
            }
          });
        }
      };

      const drawNodesForSubset = (startIndex: number, endIndex: number) => {
        for (let i = startIndex; i < endIndex; i++) {
          if (i >= nodes.length || nodes[i].opacity <= 0.005) continue;
          const node = nodes[i];

          const ns = node.focusWeight || 0;
          const pulse = node.pulseIntensity || 0;

          let cursorGlow = 0;
          if (
            mouse.x !== null &&
            mouse.y !== null &&
            i < 16 &&
            centerpieceOpacity > 0.01
          ) {
            const dx = node.drawX - mouse.x;
            const dy = node.drawY - mouse.y;
            const dist = Math.sqrt(dx * dx + dy * dy);
            if (dist < 150) {
              cursorGlow = (1 - dist / 150) * 0.06 * centerpieceOpacity;
            }
          }

          ctx.beginPath();
          ctx.arc(
            node.drawX,
            node.drawY,
            node.radius * (2.2 + ns * 0.4),
            0,
            Math.PI * 2
          );
          ctx.fillStyle = `rgba(${glowColorRGB}, ${(0.05 + node.influence * 0.04 + ns * 0.04 + pulse * 0.12 + cursorGlow) * node.opacity})`;
          ctx.fill();

          ctx.beginPath();
          ctx.arc(
            node.drawX,
            node.drawY,
            node.radius * (1 + ns * 0.2),
            0,
            Math.PI * 2
          );
          ctx.fillStyle = `rgba(${nodeColorRGB}, ${(0.12 + node.influence * 0.07 + ns * 0.08 + pulse * 0.18 + cursorGlow) * node.opacity})`;
          ctx.fill();
        }
      };

      const hasSpotlight = centerpieceOpacity > 0.01;
      if (isDesktop && hasSpotlight) {
        drawConnectionsForSubset(16, nodes.length);
        drawNodesForSubset(16, nodes.length);

        drawConnectionsForSubset(0, 16);
        drawCursorConnections();
        drawHeadlineConnections();
        drawNodesForSubset(0, 16);
      } else {
        drawConnectionsForSubset(0, nodes.length);
        drawCursorConnections();
        drawHeadlineConnections();
        drawNodesForSubset(0, nodes.length);
      }

      scrollVelocity *= 0.95;
    };

    const loop = () => {
      const isScrolling = Date.now() - lastScrollTime < 450;
      if (!isScrolling) {
        draw();
      }
      animationId = requestAnimationFrame(loop);
    };

    const startLoop = () => {
      if (!animationId) {
        loop();
      }
    };

    const stopLoop = () => {
      if (animationId) {
        cancelAnimationFrame(animationId);
        animationId = null;
      }
    };

    if (reducedMotion) {
      draw();
      stopLoop();
    } else {
      startLoop();
    }

    return () => {
      stopLoop();
      window.removeEventListener("mousemove", handleFirstEngagement);
      window.removeEventListener("touchstart", handleFirstEngagement);
      window.removeEventListener("wheel", handleFirstEngagement);
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("mouseleave", handleMouseLeave);
      window.removeEventListener("resize", handleResize);
      if (mainContainer) {
        mainContainer.removeEventListener("scroll", handleScroll);
      }
    };
  }, [reducedMotion]);

  return (
    <canvas
      ref={canvasRef}
      className="fixed inset-0 z-0 w-full h-full pointer-events-none bg-background"
      style={{ display: "block" }}
    />
  );
}
