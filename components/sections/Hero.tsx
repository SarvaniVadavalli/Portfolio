"use client";

import React, { useEffect, useState, useRef } from "react";
import PortraitDots from "../features/PortraitDots/PortraitDots";

export default function Hero() {
  const [isLoaded, setIsLoaded] = useState<boolean>(false);
  const [shouldFade, setShouldFade] = useState<boolean>(false);
  const [isIntersecting, setIsIntersecting] = useState<boolean>(true);
  const heroRef = useRef<HTMLElement | null>(null);

  useEffect(() => {
    // Check if opacity fade has already been played in this session
    const played = sessionStorage.getItem("hero_fade_played") === "true";
    if (!played) {
      setShouldFade(true);
      sessionStorage.setItem("hero_fade_played", "true");
    }
    setIsLoaded(true);

    const el = heroRef.current;
    if (!el) return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        setIsIntersecting(entry.isIntersecting);
      },
      { threshold: 0.05 }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  return (
    <section
      ref={heroRef}
      id="hero"
      aria-label="Introduction"
      className={`w-full min-h-[100dvh] snap-start flex flex-col justify-center items-center relative pt-[56px] md:pt-[64px] pb-space-16 md:pb-space-24 overflow-hidden transition-opacity duration-150 ease-out ${
        shouldFade && !isLoaded ? "opacity-0" : "opacity-100"
      }`}
    >
      <div className="absolute inset-0 z-0 pointer-events-none overflow-hidden select-none">
        <div className="absolute top-[-25%] right-[-15%] w-[60%] h-[110%] bg-[#0EA5E9]/[0.05] blur-[80px] md:blur-[100px] rounded-full rotate-[-35deg]" />
        <div className="absolute top-[15%] right-[5%] w-[50%] h-[70%] bg-[#14B8A6]/[0.045] blur-[90px] md:blur-[110px] rounded-full" />
      </div>

      <div className="container mx-auto px-space-6 md:px-space-12 flex flex-col md:flex-row gap-y-12 items-center justify-center flex-grow w-full max-w-[1240px] z-10 relative">
        <div className="w-full md:w-[44%] flex flex-col justify-center text-center md:text-left items-center md:items-start select-none">
          <h1
            id="hero-title"
            aria-label="Sarvani Vadavalli"
            className="font-clash font-bold text-text-6xl md:text-text-7xl tracking-tighter mb-space-6 leading-[0.9] text-center md:text-left premium-hero-title"
          >
            <span aria-hidden="true" className="block">
              {"Sarvani".split("").map((char, index) => (
                <span
                  key={index}
                  className="hero-hover-letter inline-block transition-all duration-100 ease-out"
                >
                  {char}
                </span>
              ))}
            </span>
            <span aria-hidden="true" className="block mt-2 premium-hero-title-accent">
              {"Vadavalli".split("").map((char, index) => (
                <span
                  key={index}
                  className="hero-hover-letter inline-block transition-all duration-100 ease-out"
                >
                  {char}
                </span>
              ))}
            </span>
          </h1>

          <p className="text-text-base md:text-text-lg font-sans font-medium text-foreground/80 max-w-[500px] text-center md:text-left leading-[1.55] mt-space-2">
            AI &amp; Software Engineer building intelligent systems through machine
            learning, computer vision, and thoughtful engineering.
          </p>

          <div className="flex items-center gap-2 mt-space-4 select-none opacity-80 hover:opacity-100 transition-opacity duration-150">
            <span
              className="w-1.5 h-1.5 rounded-full bg-[#14B8A6] block shadow-[0_0_10px_rgba(20,184,166,0.8)] animate-pulse-slow"
              aria-hidden="true"
            />
            <span className="font-mono text-[11px] font-semibold uppercase tracking-wider text-muted/90">
              Open to opportunities
            </span>
          </div>
        </div>

        <div className="w-full md:w-[56%] h-[380px] sm:h-[520px] md:h-[60vh] relative overflow-hidden flex items-center justify-center">
          <PortraitDots />
        </div>
      </div>

      <a
        href="#about"
        onClick={(e) => {
          e.preventDefault();
          const aboutEl = document.getElementById("about");
          if (aboutEl) {
            aboutEl.scrollIntoView({ behavior: "smooth" });
          }
        }}
        aria-label="Scroll to About section"
        className={`absolute bottom-space-6 md:bottom-space-8 left-1/2 -translate-x-1/2 text-muted hover:text-foreground transition-all duration-300 pointer-events-auto cursor-pointer p-2 z-20 select-none ${
          isIntersecting ? "animate-scroll-cue" : ""
        }`}
      >
        <svg
          width="24"
          height="24"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.5"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <polyline points="7 13 12 18 17 13" />
          <line x1="12" y1="18" x2="12" y2="6" />
        </svg>
      </a>
    </section>
  );
}
