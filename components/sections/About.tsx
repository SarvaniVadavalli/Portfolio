"use client";

import React, { useEffect, useState, useRef } from "react";
import Marquee from "../shared/Marquee";

export default function About() {
  const [reducedMotion, setReducedMotion] = useState<boolean>(false);
  const [hasRevealed, setHasRevealed] = useState<boolean>(false);
  const [isDrifting, setIsDrifting] = useState<boolean>(false);
  const aboutRef = useRef<HTMLElement | null>(null);

  useEffect(() => {
    const mediaQuery = window.matchMedia("(prefers-reduced-motion: reduce)");
    const motionHandler = (e: MediaQueryListEvent) => setReducedMotion(e.matches);
    mediaQuery.addEventListener("change", motionHandler);
    setReducedMotion(mediaQuery.matches);

    let resetTimeout: ReturnType<typeof setTimeout> | null = null;
    const el = aboutRef.current;
    if (el) {
      const observer = new IntersectionObserver(
        ([entry]) => {
          if (entry.isIntersecting) {
            if (resetTimeout) {
              clearTimeout(resetTimeout);
              resetTimeout = null;
            }
            setHasRevealed(true);
          } else {
            if (!resetTimeout) {
              resetTimeout = setTimeout(() => {
                setHasRevealed(false);
                setIsDrifting(false);
                resetTimeout = null;
              }, 400);
            }
          }
        },
        {
          threshold: 0.2,
        }
      );
      observer.observe(el);
      return () => {
        mediaQuery.removeEventListener("change", motionHandler);
        observer.disconnect();
        if (resetTimeout) clearTimeout(resetTimeout);
      };
    }

    return () => mediaQuery.removeEventListener("change", motionHandler);
  }, []);

  useEffect(() => {
    if (hasRevealed && !reducedMotion) {
      const timer = setTimeout(() => {
        setIsDrifting(true);
      }, 900);
      return () => clearTimeout(timer);
    }
  }, [hasRevealed, reducedMotion]);

  const getTransitionStyle = (index: number): React.CSSProperties => {
    if (reducedMotion) return {};
    return {
      opacity: hasRevealed ? 1 : 0,
      transform: hasRevealed ? "translateY(0)" : "translateY(15px)",
      transition: "opacity 600ms cubic-bezier(0.16, 1, 0.3, 1), transform 600ms cubic-bezier(0.16, 1, 0.3, 1)",
      transitionDelay: hasRevealed ? `${index * 100}ms` : "0ms",
      willChange: "opacity, transform",
    };
  };

  return (
    <section
      ref={aboutRef}
      id="about"
      aria-label="About"
      className="w-full min-h-[100dvh] snap-start flex flex-col justify-center border-b border-border-default py-space-16 md:py-space-24 relative"
      style={{
        opacity: 1,
        willChange: "opacity",
      }}
    >
      <div className="absolute top-0 left-0 -translate-y-1/2 w-full z-20 flex items-center justify-center pointer-events-none">
        <Marquee />
      </div>

      <div className="container mx-auto px-space-4 md:px-space-8">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-space-8 items-start">
          <div className="col-span-1 md:col-span-6 lg:col-span-5 flex flex-col justify-start mb-space-8 md:mb-0">
            <div style={getTransitionStyle(0)}>
              <span className="font-mono text-text-xs font-bold tracking-[0.1em] text-accent-teal uppercase mb-space-4 block">
                &lt;About /&gt;
              </span>
            </div>
            <div style={getTransitionStyle(1)} className="mt-space-2">
              <h2 className={`text-text-2xl md:text-text-4xl font-serif font-semibold text-foreground leading-[1.15] mb-space-6 transition-transform duration-[7s] ${
                isDrifting && !reducedMotion ? "animate-headline-drift" : ""
              }`}>
                Building practical AI solutions through thoughtful engineering.
              </h2>
            </div>
          </div>

          <div className="col-span-1 md:col-span-6 lg:col-span-7 flex flex-col gap-space-6 max-w-[62ch] text-left pt-space-2 md:pt-space-6 lg:pt-space-8">
            <p style={getTransitionStyle(2)} className="text-text-lg text-foreground/80 leading-[1.65]">
              I got into <span className="text-accent-teal">AI and ML</span> because I think that&apos;s where <span className="text-accent-teal">the future of software</span> is heading — and honestly, being a developer, someone who actually builds things with code, is just genuinely exciting to me.
            </p>
            <p style={getTransitionStyle(3)} className="text-text-lg text-foreground/80 leading-[1.65]">
              What I care about most is turning ideas into <span className="text-accent-teal">real, working applications</span>. The technical side comes naturally. The creative side — <span className="text-accent-teal">design, execution</span>, making something feel finished — is what challenges me the most. I like that. It&apos;s the part I&apos;m actively getting better at.
            </p>
            <ul className="relative flex flex-col gap-y-2.5 font-mono text-text-sm md:text-text-base text-muted/90 mt-space-6 border-t border-border-default/40 pt-space-6 pl-4">
              <div style={getTransitionStyle(4)} className="absolute left-[3px] top-[26px] bottom-[8px] w-[1.5px] bg-accent-teal/30 pointer-events-none" />
              <li style={getTransitionStyle(4)} className="flex items-start pl-3 relative">
                <span className="text-accent-teal font-semibold select-none shrink-0 w-[48px] md:w-[54px]">01 —</span>
                <span className="flex-grow">think in AI/ML, build in software</span>
              </li>
              <li style={getTransitionStyle(5)} className="flex items-start pl-3 relative">
                <span className="text-accent-teal font-semibold select-none shrink-0 w-[48px] md:w-[54px]">02 —</span>
                <span className="flex-grow">ideas mean nothing until they run</span>
              </li>
              <li className="flex items-start pl-3 relative" style={getTransitionStyle(6)}>
                <span className="text-accent-teal font-semibold select-none shrink-0 w-[48px] md:w-[54px]">03 —</span>
                <span className="flex-grow">design &amp; execution are the hard part — and the fun part</span>
              </li>
            </ul>
          </div>
        </div>
      </div>

      <style dangerouslySetInnerHTML={{ __html: `
        @keyframes headline-drift {
          0%, 100% {
            transform: translateY(0px);
          }
          50% {
            transform: translateY(-3px);
          }
        }
        .animate-headline-drift {
          animation: headline-drift 7s ease-in-out infinite;
        }
      ` }} />
    </section>
  );
}
