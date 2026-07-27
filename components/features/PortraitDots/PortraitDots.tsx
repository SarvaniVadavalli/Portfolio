"use client";

import React, { useEffect, useRef, useState } from "react";

export interface MouseCoords {
  x: number;
  y: number;
}

export default function PortraitDots() {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const [mouseCoords, setMouseCoords] = useState<MouseCoords>({ x: 0, y: 0 });
  const [isHovered, setIsHovered] = useState<boolean>(false);
  const [reducedMotion, setReducedMotion] = useState<boolean>(false);

  // Check prefers-reduced-motion
  useEffect(() => {
    const mediaQuery = window.matchMedia("(prefers-reduced-motion: reduce)");
    setReducedMotion(mediaQuery.matches);
    const handler = (e: MediaQueryListEvent) => setReducedMotion(e.matches);
    mediaQuery.addEventListener("change", handler);
    return () => mediaQuery.removeEventListener("change", handler);
  }, []);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>): void => {
    if (reducedMotion) return;
    const rect = e.currentTarget.getBoundingClientRect();
    // Calculate normalized coordinates [-0.5, 0.5]
    const x = (e.clientX - rect.left) / rect.width - 0.5;
    const y = (e.clientY - rect.top) / rect.height - 0.5;
    setMouseCoords({ x, y });
  };

  const handleMouseEnter = (): void => setIsHovered(true);
  const handleMouseLeave = (): void => {
    setIsHovered(false);
    setMouseCoords({ x: 0, y: 0 });
  };

  // Parallax tilt angles and translation shift offsets
  const tiltX = -mouseCoords.y * 14;  // Up to 7 deg pitch tilt
  const tiltY = mouseCoords.x * 14;   // Up to 7 deg yaw tilt
  const shiftX = mouseCoords.x * 10;  // Up to 5px translation X
  const shiftY = mouseCoords.y * 10;  // Up to 5px translation Y

  // Dynamic light beam/shadow offset shifts opposite to the direction of the tilt
  const shadowX = -mouseCoords.x * 18;
  const shadowY = -mouseCoords.y * 18;

  const imageTransform = !reducedMotion && isHovered
    ? `perspective(1000px) rotateX(${tiltX}deg) rotateY(${tiltY}deg) translate3d(${shiftX}px, ${shiftY}px, 15px) scale(1.02)`
    : "perspective(1000px) rotateX(0deg) rotateY(0deg) translate3d(0px, 0px, 0px) scale(1)";

  const shadowFilter = !reducedMotion && isHovered
    ? `url(#duotone-filter) drop-shadow(${shadowX}px ${shadowY}px 24px rgba(20, 184, 166, 0.32))`
    : "url(#duotone-filter) drop-shadow(0px 0px 12px rgba(14, 165, 233, 0.15))";

  return (
    <div
      ref={containerRef}
      className="w-full h-full relative flex items-center justify-center select-none"
      onMouseMove={handleMouseMove}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      style={{
        perspective: "1000px",
        willChange: "transform",
      }}
    >
      {/* SVG Duotone Filter Definition (Hidden) */}
      <svg
        xmlns="http://www.w3.org/2000/svg"
        style={{ position: "absolute", width: 0, height: 0, pointerEvents: "none" }}
        aria-hidden="true"
      >
        <defs>
          <filter id="duotone-filter">
            <feColorMatrix
              type="matrix"
              values="0.299 0.587 0.114 0 0
                      0.299 0.587 0.114 0 0
                      0.299 0.587 0.114 0 0
                      0     0     0     1 0"
            />
            <feComponentTransfer>
              <feFuncR type="table" tableValues="0.04 0.03 0.02 0.04 0.56" />
              <feFuncG type="table" tableValues="0.04 0.08 0.29 0.51 0.88" />
              <feFuncB type="table" tableValues="0.06 0.13 0.44 0.55 0.90" />
            </feComponentTransfer>
          </filter>
        </defs>
      </svg>

      {/* The Duotone Portrait Frame Container */}
      <div
        className="w-full h-full max-w-[480px] max-h-[60vh] relative flex items-center justify-center overflow-hidden transition-all duration-300 ease-out"
        style={{
          maskImage: "radial-gradient(circle, rgba(0,0,0,1) 60%, rgba(0,0,0,0) 100%)",
          WebkitMaskImage: "radial-gradient(circle, rgba(0,0,0,1) 60%, rgba(0,0,0,0) 100%)",
          willChange: "transform",
        }}
      >
        {/* Photo Image Element */}
        <img
          src="/portrait-source.jpg"
          alt="Sarvani Vadavalli Portrait"
          className="w-full h-full object-cover object-center relative z-10 transition-all duration-200 ease-out"
          style={{
            transform: imageTransform,
            filter: shadowFilter,
            opacity: isHovered ? 0.90 : 0.82,
            willChange: "transform, filter, opacity",
          }}
        />

        {/* Ambient Gradient Sweep Motion Overlay */}
        {!reducedMotion && (
          <div
            className="absolute inset-0 z-20 pointer-events-none mix-blend-color-dodge transition-opacity duration-300"
            style={{
              background: "linear-gradient(135deg, rgba(14, 165, 233, 0.08) 0%, rgba(20, 184, 166, 0.08) 50%, rgba(224, 242, 254, 0.05) 100%)",
              animation: "sweep-gradient 8s ease-in-out infinite alternate",
              opacity: isHovered ? 1.0 : 0.65,
            }}
          />
        )}
      </div>

      {/* Embed Inline Keyframes for CSS gradient animation */}
      <style
        dangerouslySetInnerHTML={{
          __html: `
        @keyframes sweep-gradient {
          0% {
            transform: scale(1.0) rotate(0deg);
          }
          100% {
            transform: scale(1.18) rotate(4deg);
          }
        }
      `,
        }}
      />
    </div>
  );
}
