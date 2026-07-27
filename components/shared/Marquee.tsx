"use client";

import React, { useEffect, useRef, useState } from "react";

export interface MarqueeProps {
  direction?: "left" | "right";
  gradientDirection?: "teal-to-blue" | "blue-to-teal";
  phrases?: string[] | null;
  cursorReactive?: boolean;
}

export default function Marquee({
  direction = "left",
  gradientDirection = "teal-to-blue",
  phrases = null,
  cursorReactive = false,
}: MarqueeProps) {
  const [reducedMotion, setReducedMotion] = useState<boolean>(false);
  const trackWrapperRef = useRef<HTMLDivElement | null>(null);
  const xRef = useRef<number>(direction === "left" ? 0 : -50);
  const currentSpeedRef = useRef<number>(0.024);
  const mouseRef = useRef<{ y: number | null }>({ y: null });
  const hoveredWordRef = useRef<HTMLElement | null>(null);

  // Check prefers-reduced-motion
  useEffect(() => {
    const mediaQuery = window.matchMedia("(prefers-reduced-motion: reduce)");
    setReducedMotion(mediaQuery.matches);
    const handler = (e: MediaQueryListEvent) => setReducedMotion(e.matches);
    mediaQuery.addEventListener("change", handler);
    return () => mediaQuery.removeEventListener("change", handler);
  }, []);

  const isKeyWord = (word: string): boolean => {
    if (!word) return false;
    const clean = word.toUpperCase().replace(/[^A-Z]/g, "");
    return ["EXECUTION", "BUILD", "TERMINAL", "RECEIPTS"].includes(clean);
  };

  const handleWordMouseEnter = (e: React.MouseEvent<HTMLSpanElement>): void => {
    const target = e.currentTarget;
    hoveredWordRef.current = target;
    target.classList.add("is-hovered", "animate-glow-pulse");

    if (target.classList.contains("marquee-word-key")) {
      target.classList.remove("marquee-gradient-blue-teal");
      target.classList.add("marquee-gradient-teal-blue");
    }
  };

  const handleWordMouseLeave = (e: React.MouseEvent<HTMLSpanElement>): void => {
    const target = e.currentTarget;
    if (hoveredWordRef.current === target) {
      hoveredWordRef.current = null;
    }
    target.classList.remove("is-hovered", "animate-glow-pulse");
    target.style.transform = "";
    target.style.zIndex = "";

    if (target.classList.contains("marquee-word-key")) {
      target.classList.remove("marquee-gradient-teal-blue");
      target.classList.add("marquee-gradient-blue-teal");
    }
  };

  const isDefaultGradient = gradientDirection === "teal-to-blue";
  const defaultTextClass = isDefaultGradient
    ? "marquee-gradient-teal-blue"
    : "marquee-gradient-blue-teal";

  const renderTrack = () => (
    <div className="flex whitespace-nowrap shrink-0 leading-[1.4]">
      {Array(phrases ? 3 : 5)
        .fill(null)
        .map((_, groupIdx) => (
          <span key={groupIdx} className="flex items-center font-semibold">
            {phrases ? (
              phrases.map((p, idx) => (
                <span key={idx} className="flex items-center">
                  {p.split(" ").map((word, wordIdx) => {
                    const isKey = isKeyWord(word);
                    const restingClass = isKey
                      ? "marquee-gradient-blue-teal font-black marquee-word-key marquee-glow"
                      : "text-muted/60 font-semibold";
                    return (
                      <span
                        key={wordIdx}
                        className={`marquee-word mx-1 cursor-pointer inline-block pointer-events-auto ${restingClass}`}
                        onMouseEnter={handleWordMouseEnter}
                        onMouseLeave={handleWordMouseLeave}
                      >
                        {word}
                      </span>
                    );
                  })}
                  <span className="text-accent-teal/70 text-[18px] md:text-[22px] font-black mx-8 select-none pointer-events-none">
                    •
                  </span>
                </span>
              ))
            ) : (
              <>
                <span className={`mx-4 ${defaultTextClass} marquee-glow`}>
                  AI/ML
                </span>
                <span className="text-accent-teal/70 text-[18px] md:text-[22px] font-black mx-8 select-none">
                  •
                </span>
                <span className="mx-4 text-accent-glow/65">COMPUTER VISION</span>
                <span className="text-accent-teal/70 text-[18px] md:text-[22px] font-black mx-8 select-none">
                  •
                </span>
                <span className={`mx-4 ${defaultTextClass} marquee-glow`}>
                  FULL-STACK
                </span>
                <span className="text-accent-teal/70 text-[18px] md:text-[22px] font-black mx-8 select-none">
                  •
                </span>
                <span className="mx-4 text-accent-glow/65">ALWAYS SHIPPING</span>
                <span className="text-accent-teal/70 text-[18px] md:text-[22px] font-black mx-8 select-none">
                  •
                </span>
              </>
            )}
          </span>
        ))}
    </div>
  );

  useEffect(() => {
    const trackWrapper = trackWrapperRef.current;
    if (!trackWrapper) return;

    let rAFId: number | null = null;
    const baseSpeed = 0.024;
    const maxSpeed = 0.09;
    const proximityRange = 400;
    const directionFactor = direction === "left" ? -1 : 1;

    const handleMouseMove = (e: MouseEvent) => {
      mouseRef.current.y = e.clientY;
    };
    window.addEventListener("mousemove", handleMouseMove);

    const animate = () => {
      let targetSpeed = baseSpeed;
      if (mouseRef.current.y !== null && cursorReactive && !reducedMotion) {
        const rect = trackWrapper.getBoundingClientRect();
        const centerY = rect.top + rect.height / 2;
        const dist = Math.abs(mouseRef.current.y - centerY);
        if (dist < proximityRange) {
          const factor = 1 - dist / proximityRange;
          targetSpeed = baseSpeed + (maxSpeed - baseSpeed) * factor;
        }
      }

      if (reducedMotion) {
        currentSpeedRef.current = 0;
      } else {
        currentSpeedRef.current =
          currentSpeedRef.current +
          (targetSpeed - currentSpeedRef.current) * 0.08;
      }

      xRef.current += currentSpeedRef.current * directionFactor;

      if (direction === "left") {
        if (xRef.current <= -50) xRef.current = 0;
      } else {
        if (xRef.current >= 0) xRef.current = -50;
      }

      trackWrapper.style.transform = `translate3d(${xRef.current}%, 0, 0)`;

      if (hoveredWordRef.current && !reducedMotion) {
        const containerWidth = trackWrapper.offsetWidth;
        const Tx = (xRef.current / 100) * containerWidth;
        hoveredWordRef.current.style.transform = `translate3d(${-Tx}px, 0, 0) scale(1.08)`;
        hoveredWordRef.current.style.zIndex = "30";
      }

      rAFId = requestAnimationFrame(animate);
    };

    rAFId = requestAnimationFrame(animate);

    return () => {
      if (rAFId !== null) {
        cancelAnimationFrame(rAFId);
      }
      window.removeEventListener("mousemove", handleMouseMove);
    };
  }, [direction, cursorReactive, reducedMotion]);

  return (
    <div
      className="w-full overflow-hidden select-none pointer-events-none relative z-20 font-mono text-[15px] tablet:text-[16px] md:text-[18px] tracking-[0.09em] h-[72px] md:h-[88px] py-4 md:py-5 flex items-center border-t border-b border-border-default/10 bg-transparent"
      aria-hidden="true"
    >
      <div
        ref={trackWrapperRef}
        className="flex w-max"
        style={{ willChange: "transform" }}
      >
        {renderTrack()}
        {renderTrack()}
      </div>

      <style
        dangerouslySetInnerHTML={{
          __html: `
        .marquee-gradient-teal-blue {
          background: linear-gradient(to right, #14B8A6, #0EA5E9);
          -webkit-background-clip: text;
          background-clip: text;
          -webkit-text-fill-color: transparent;
          color: transparent;
        }
        .marquee-gradient-blue-teal {
          background: linear-gradient(to right, #0EA5E9, #14B8A6);
          -webkit-background-clip: text;
          background-clip: text;
          -webkit-text-fill-color: transparent;
          color: transparent;
        }
        .marquee-glow {
          filter: drop-shadow(0 0 8px rgba(224, 242, 254, 0.15));
        }
        .marquee-word {
          position: relative;
          display: inline-block;
          transition: transform 200ms cubic-bezier(0.16, 1, 0.3, 1), filter 200ms ease-out;
        }
        @keyframes glow-pulse {
          0%, 100% {
            filter: drop-shadow(0 0 8px rgba(224, 242, 254, 0.25));
          }
          50% {
            filter: drop-shadow(0 0 16px rgba(224, 242, 254, 0.6));
          }
        }
        .animate-glow-pulse {
          animation: glow-pulse 1500ms ease-in-out infinite;
        }
        @media (prefers-reduced-motion: reduce) {
          .marquee-word:hover {
            transform: none !important;
          }
          .animate-glow-pulse {
            animation: none !important;
          }
        }
      `,
        }}
      />
    </div>
  );
}
