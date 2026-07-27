"use client";

import { useEffect, useRef } from "react";

export interface Use3DTiltOptions {
  maxRotation?: number;
  hoverLift?: string;
}

/**
 * A hook that applies a subtle 3D tilt effect to a DOM element on mouse hover and move.
 * Uses a ref and direct style updates for maximum performance, avoiding React re-renders.
 */
export default function use3DTilt<T extends HTMLElement = HTMLDivElement>(
  options: Use3DTiltOptions = {}
): React.RefObject<T | null> {
  const cardRef = useRef<T | null>(null);
  const { maxRotation = 6, hoverLift = "0px" } = options;

  useEffect(() => {
    const card = cardRef.current;
    if (!card) return;

    // Safety checks for SSR and media queries
    if (typeof window === "undefined") return;

    const hasHover = window.matchMedia("(hover: hover)").matches;
    const prefersReducedMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)"
    ).matches;

    // Disable 3D tilt completely on touch devices or if reduced motion is requested
    if (!hasHover || prefersReducedMotion) {
      return;
    }

    let rAFId: number | null = null;
    let resetTimeoutId: ReturnType<typeof setTimeout> | null = null;

    const handleMouseMove = (e: MouseEvent) => {
      if (rAFId) {
        cancelAnimationFrame(rAFId);
      }

      rAFId = requestAnimationFrame(() => {
        const rect = card.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;

        const centerX = rect.width / 2;
        const centerY = rect.height / 2;

        const normalizedX = (x - centerX) / centerX;
        const normalizedY = (y - centerY) / centerY;

        // Calculate rotation angles
        const rotateX = normalizedY * maxRotation;
        const rotateY = -normalizedX * maxRotation;

        // Track cursor position directly with no transition easing
        card.style.transition = "none";
        card.style.transform = `translateY(${hoverLift}) rotateX(${rotateX.toFixed(2)}deg) rotateY(${rotateY.toFixed(2)}deg)`;
      });
    };

    const handleMouseEnter = () => {
      if (resetTimeoutId) {
        clearTimeout(resetTimeoutId);
        resetTimeoutId = null;
      }
      card.style.transition = "none";
    };

    const handleMouseLeave = () => {
      if (rAFId) {
        cancelAnimationFrame(rAFId);
        rAFId = null;
      }

      if (resetTimeoutId) {
        clearTimeout(resetTimeoutId);
      }

      // Smooth ease back to flat resting state over duration-fast (200ms)
      card.style.transition = "transform 200ms cubic-bezier(0.4, 0, 0.2, 1)";
      card.style.transform = `translateY(0px) rotateX(0deg) rotateY(0deg)`;

      // After transition finishes, clean up inline styles to let standard CSS hover/focus classes apply
      resetTimeoutId = setTimeout(() => {
        if (card && !card.matches(":hover")) {
          card.style.transition = "";
          card.style.transform = "";
        }
      }, 200);
    };

    card.addEventListener("mousemove", handleMouseMove);
    card.addEventListener("mouseenter", handleMouseEnter);
    card.addEventListener("mouseleave", handleMouseLeave);

    return () => {
      if (rAFId) {
        cancelAnimationFrame(rAFId);
      }
      if (resetTimeoutId) {
        clearTimeout(resetTimeoutId);
      }
      card.removeEventListener("mousemove", handleMouseMove);
      card.removeEventListener("mouseenter", handleMouseEnter);
      card.removeEventListener("mouseleave", handleMouseLeave);
    };
  }, [maxRotation, hoverLift]);

  return cardRef;
}
