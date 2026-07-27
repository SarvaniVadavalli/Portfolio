"use client";

import React, { useEffect, useState, useRef } from "react";

export default function CustomCursor() {
  const [isHovered, setIsHovered] = useState<boolean>(false);
  const [, setReducedMotion] = useState<boolean>(false);
  const cursorRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    // Initialize position and opacity directly to prevent React state re-renders from overriding them
    if (cursorRef.current) {
      cursorRef.current.style.opacity = "0";
      cursorRef.current.style.transform = "translate3d(-100px, -100px, 0) translate(-50%, -50%)";
    }

    const hasHover = window.matchMedia("(any-hover: hover)").matches;
    if (!hasHover) return;

    const mediaQuery = window.matchMedia("(prefers-reduced-motion: reduce)");
    setReducedMotion(mediaQuery.matches);
    const motionHandler = (e: MediaQueryListEvent) => setReducedMotion(e.matches);
    mediaQuery.addEventListener("change", motionHandler);

    const handleMouseMove = (e: MouseEvent) => {
      if (cursorRef.current) {
        cursorRef.current.style.transform = `translate3d(${e.clientX}px, ${e.clientY}px, 0) translate(-50%, -50%)`;
        if (cursorRef.current.style.opacity === "0" || cursorRef.current.style.opacity === "") {
          cursorRef.current.style.opacity = "1";
        }
      }
    };

    const handleMouseLeave = () => {
      if (cursorRef.current) {
        cursorRef.current.style.opacity = "0";
      }
    };

    const handleMouseEnter = () => {
      if (cursorRef.current) {
        cursorRef.current.style.opacity = "1";
      }
    };

    const handleMouseOver = (e: MouseEvent) => {
      const target = e.target as HTMLElement | null;
      if (!target) return;

      const isInteractive =
        target.tagName === "A" ||
        target.tagName === "BUTTON" ||
        target.tagName === "INPUT" ||
        target.tagName === "TEXTAREA" ||
        target.tagName === "SELECT" ||
        target.closest("a") ||
        target.closest("button") ||
        target.closest("[role='button']") ||
        target.closest(".project-card") ||
        target.closest(".interactive-element");

      const nextHover = !!isInteractive;
      setIsHovered((prev) => (prev !== nextHover ? nextHover : prev));
    };

    window.addEventListener("mousemove", handleMouseMove);
    document.addEventListener("mouseleave", handleMouseLeave);
    document.addEventListener("mouseenter", handleMouseEnter);
    window.addEventListener("mouseover", handleMouseOver);

    // Hide default cursor across the body viewport
    const style = document.createElement("style");
    style.id = "custom-cursor-style";
    style.innerHTML = `
      *, body, a, button, [role='button'], input, textarea, select {
        cursor: none !important;
      }
    `;
    document.head.appendChild(style);
    return () => {
      mediaQuery.removeEventListener("change", motionHandler);
      window.removeEventListener("mousemove", handleMouseMove);
      document.removeEventListener("mouseleave", handleMouseLeave);
      document.removeEventListener("mouseenter", handleMouseEnter);
      window.removeEventListener("mouseover", handleMouseOver);
      const el = document.getElementById("custom-cursor-style");
      if (el) document.head.removeChild(el);
    };
  }, []);

  return (
    <div
      ref={cursorRef}
      className="fixed top-0 left-0 pointer-events-none z-[9999] opacity-0"
      style={{
        width: "32px",
        height: "32px",
        transform: "translate3d(-100px, -100px, 0) translate(-50%, -50%)",
      }}
    >
      <div
        className="w-full h-full transition-all duration-200 ease-out"
        style={{
          transform: isHovered ? "scale(1.28)" : "scale(1)",
          filter: isHovered
            ? "drop-shadow(0 0 8px rgba(20, 184, 166, 0.8))"
            : "drop-shadow(0 0 4px rgba(20, 184, 166, 0.45))",
        }}
      >
        <svg
          viewBox="0 0 24 24"
          className="w-full h-full"
          style={{ display: "block" }}
        >
          <defs>
            <linearGradient id="tealBlueGradient" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#0ea5e9" />
              <stop offset="100%" stopColor="#14b8a6" />
            </linearGradient>
          </defs>
          <path
            d="M4.5 3v15.25l3.85-3.85 2.8 6.7 1.8-.75-2.8-6.7h5.4L4.5 3z"
            fill="url(#tealBlueGradient)"
            stroke={isHovered ? "#e0f2fe" : "rgba(20, 184, 166, 0.5)"}
            strokeWidth={isHovered ? "1.5" : "1"}
            style={{
              transition: "stroke 250ms ease, stroke-width 250ms ease, fill 200ms ease",
            }}
          />
        </svg>
      </div>
    </div>
  );
}
