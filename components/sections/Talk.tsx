"use client";

import React, { useEffect, useState, useRef } from "react";

export interface ContactItem {
  label: string;
  value: string;
  copyValue: string;
  description: string;
  href: string;
  isExternal: boolean;
}

const CONTACT_ITEMS: ContactItem[] = [
  {
    label: "Email",
    value: "sarvanikutti@gmail.com",
    copyValue: "sarvanikutti@gmail.com",
    description: "Best way to reach me",
    href: "mailto:sarvanikutti@gmail.com",
    isExternal: false,
  },
  {
    label: "LinkedIn",
    value: "linkedin.com/in/sarvani-vadavalli-94a501324",
    copyValue: "https://www.linkedin.com/in/sarvani-vadavalli-94a501324/",
    description: "Professional network",
    href: "https://www.linkedin.com/in/sarvani-vadavalli-94a501324/",
    isExternal: true,
  },
  {
    label: "GitHub",
    value: "github.com/SarvaniVadavalli",
    copyValue: "https://github.com/SarvaniVadavalli",
    description: "Projects & open-source work",
    href: "https://github.com/SarvaniVadavalli",
    isExternal: true,
  },
];

export default function Talk() {
  const sectionRef = useRef<HTMLElement | null>(null);
  const [inView, setInView] = useState<boolean>(false);
  const [copiedLabel, setCopiedLabel] = useState<string | null>(null);
  const [reducedMotion, setReducedMotion] = useState<boolean>(false);
  const [mouseParallax, setMouseParallax] = useState<{ x: number; y: number }>({ x: 0, y: 0 });

  // IntersectionObserver for staggered entrance animation
  useEffect(() => {
    const el = sectionRef.current;
    if (!el) return;

    let resetTimeout: ReturnType<typeof setTimeout> | null = null;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          if (resetTimeout) {
            clearTimeout(resetTimeout);
            resetTimeout = null;
          }
          setInView(true);
        } else {
          if (!resetTimeout) {
            resetTimeout = setTimeout(() => {
              setInView(false);
              resetTimeout = null;
            }, 400);
          }
        }
      },
      { threshold: 0.1 }
    );

    observer.observe(el);
    return () => {
      observer.disconnect();
      if (resetTimeout) clearTimeout(resetTimeout);
    };
  }, []);

  // Check prefers-reduced-motion
  useEffect(() => {
    const mediaQuery = window.matchMedia("(prefers-reduced-motion: reduce)");
    setReducedMotion(mediaQuery.matches);
    const handler = (e: MediaQueryListEvent) => setReducedMotion(e.matches);
    mediaQuery.addEventListener("change", handler);
    return () => mediaQuery.removeEventListener("change", handler);
  }, []);

  // Reactive background particle mouse tracking
  const handleSectionMouseMove = (e: React.MouseEvent<HTMLElement>) => {
    if (reducedMotion || !sectionRef.current) return;
    const rect = sectionRef.current.getBoundingClientRect();
    const normalizedX = (e.clientX - rect.left) / rect.width - 0.5; // [-0.5, 0.5]
    const normalizedY = (e.clientY - rect.top) / rect.height - 0.5; // [-0.5, 0.5]
    setMouseParallax({
      x: normalizedX * 24, // Max ~12px parallax offset
      y: normalizedY * 24,
    });
  };

  const handleSectionMouseLeave = () => {
    setMouseParallax({ x: 0, y: 0 });
  };

  // Copy to clipboard handler
  const handleCopy = (item: ContactItem) => {
    if (typeof navigator !== "undefined" && navigator.clipboard) {
      navigator.clipboard.writeText(item.copyValue).then(() => {
        setCopiedLabel(item.label);
        setTimeout(() => {
          setCopiedLabel(null);
        }, 1500);
      }).catch(() => {
        // Fallback
        setCopiedLabel(item.label);
        setTimeout(() => setCopiedLabel(null), 1500);
      });
    } else {
      setCopiedLabel(item.label);
      setTimeout(() => setCopiedLabel(null), 1500);
    }
  };

  const getRevealStyle = (stepIndex: number): React.CSSProperties => {
    if (reducedMotion) return {};
    return {
      opacity: inView ? 1 : 0,
      transform: inView ? "translateY(0)" : "translateY(16px)",
      transition: "opacity 400ms cubic-bezier(0.16, 1, 0.3, 1), transform 400ms cubic-bezier(0.16, 1, 0.3, 1)",
      transitionDelay: `${stepIndex * 110}ms`,
      willChange: "opacity, transform",
    };
  };

  return (
    <section
      ref={sectionRef}
      id="talk"
      aria-label="Contact"
      onMouseMove={handleSectionMouseMove}
      onMouseLeave={handleSectionMouseLeave}
      className="w-full min-h-[100dvh] snap-start flex flex-col justify-center border-b border-border-default py-space-16 md:py-space-24 relative overflow-hidden"
    >
      {/* Background Reactive Ambient Nodes (Bottom-Left) */}
      <div
        className="absolute bottom-0 left-0 w-[380px] h-[380px] pointer-events-none z-0 opacity-40 transition-transform duration-500 ease-out select-none"
        style={{
          transform: `translate3d(${mouseParallax.x}px, ${mouseParallax.y}px, 0)`,
        }}
        aria-hidden="true"
      >
        <svg
          viewBox="0 0 400 400"
          className="w-full h-full"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          {/* Faint connecting lines */}
          <line x1="60" y1="320" x2="140" y2="240" stroke="#14B8A6" strokeWidth="0.75" strokeDasharray="3 3" opacity="0.4" />
          <line x1="140" y1="240" x2="220" y2="300" stroke="#0EA5E9" strokeWidth="0.75" opacity="0.3" />
          <line x1="140" y1="240" x2="110" y2="150" stroke="#14B8A6" strokeWidth="0.75" opacity="0.35" />
          <line x1="220" y1="300" x2="290" y2="220" stroke="#14B8A6" strokeWidth="0.75" strokeDasharray="4 4" opacity="0.25" />

          {/* Node dots */}
          <circle cx="60" cy="320" r="3" fill="#14B8A6" opacity="0.6" />
          <circle cx="140" cy="240" r="4" fill="#0EA5E9" opacity="0.7" />
          <circle cx="220" cy="300" r="3.5" fill="#14B8A6" opacity="0.5" />
          <circle cx="110" cy="150" r="2.5" fill="#E0F2FE" opacity="0.6" />
          <circle cx="290" cy="220" r="3" fill="#14B8A6" opacity="0.4" />

          {/* Soft Glow Radial Gradient */}
          <circle cx="140" cy="240" r="60" fill="url(#talkGlow)" />
          <defs>
            <radialGradient id="talkGlow" cx="0" cy="0" r="1" gradientUnits="userSpaceOnUse" gradientTransform="translate(140 240) rotate(90) scale(60)">
              <stop stopColor="#14B8A6" stopOpacity="0.12" />
              <stop offset="1" stopColor="#14B8A6" stopOpacity="0" />
            </radialGradient>
          </defs>
        </svg>
      </div>

      <div className="container mx-auto px-space-4 md:px-space-8 relative z-10">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-space-8 items-start">
          {/* Left Column: Label, Heading, Intro, Quote */}
          <div className="col-span-1 md:col-span-6 lg:col-span-5 flex flex-col justify-start mb-space-8 md:mb-0">
            <div style={getRevealStyle(0)}>
              <span className="text-text-xs font-bold tracking-[0.1em] text-accent-teal uppercase mb-space-4 block">
                TALK
              </span>
            </div>
            <div style={getRevealStyle(1)}>
              <h2 className="text-text-3xl md:text-text-5xl font-serif font-semibold text-foreground tracking-tight mb-space-6">
                Let&apos;s Build
                <br />
                Something
                <br />
                <span className="text-accent-teal">Together.</span>
              </h2>
            </div>
            <div style={getRevealStyle(2)}>
              <p className="text-text-base text-muted font-sans leading-[1.6] max-w-[62ch] mb-space-8">
                Whether you&apos;re looking for an AI engineer, software
                developer, research intern, or simply want to discuss
                technology, I&apos;d be excited to connect and explore new
                opportunities together.
              </p>
            </div>
            <div style={getRevealStyle(3)}>
              <p className="text-text-sm text-muted/70 font-sans italic border-l border-accent-teal/40 pl-space-4 leading-relaxed max-w-[62ch]">
                Every project is another step toward becoming a better engineer.
              </p>
            </div>
          </div>

          {/* Right Column: Interactive Contact Cards Container */}
          <div className="col-span-1 md:col-span-6 lg:col-span-7">
            <div className="bg-card-bg border border-border-default hover:border-accent-teal/60 rounded-radius-lg p-space-8 shadow-sm flex flex-col gap-space-8 transition-all duration-200 select-none">
              
              {/* Contact Rows Stack */}
              <div className="flex flex-col gap-space-4">
                {CONTACT_ITEMS.map((item, idx) => {
                  const isCopied = copiedLabel === item.label;

                  return (
                    <div
                      key={item.label}
                      style={getRevealStyle(4 + idx)}
                      className="relative group"
                    >
                      {/* Copy Toast Tooltip */}
                      {isCopied && (
                        <div className="absolute -top-3 right-4 z-30 bg-accent-teal text-background font-mono text-[11px] font-bold px-2.5 py-0.5 rounded-full shadow-md animate-toast-fade">
                          Copied!
                        </div>
                      )}

                      <div
                        tabIndex={0}
                        role="button"
                        aria-label={`Copy ${item.label} (${item.value})`}
                        onClick={() => handleCopy(item)}
                        onKeyDown={(e) => {
                          if (e.key === "Enter" || e.key === " ") {
                            e.preventDefault();
                            handleCopy(item);
                          }
                        }}
                        className={`flex items-center justify-between p-space-4 bg-card-bg hover:bg-background border rounded-radius-md transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-accent-teal focus:ring-offset-2 cursor-pointer active:scale-[0.98] ${
                          isCopied
                            ? "border-accent-teal shadow-[0_0_14px_rgba(20,184,166,0.25)]"
                            : "border-border-default/40 hover:border-accent-teal/60 hover:-translate-y-[2px] hover:shadow-[0_0_16px_rgba(20,184,166,0.15)]"
                        }`}
                      >
                        {/* Text Info Column */}
                        <div className="flex flex-col gap-space-1 text-left flex-grow pr-4">
                          <span className="text-text-xs font-semibold text-accent-teal uppercase tracking-wider block">
                            {item.label}
                          </span>
                          <span className="text-text-base font-bold text-foreground font-sans group-hover:text-accent-teal transition-colors duration-200">
                            {item.value}
                          </span>
                          <span className="text-text-xs text-muted/80 font-sans block">
                            {item.description}
                          </span>
                        </div>

                        {/* Action Icons Column */}
                        <div className="flex items-center gap-2 shrink-0">
                          {/* Copy / Check Icon Indicator */}
                          <div
                            title={isCopied ? "Copied!" : "Click text to copy"}
                            className="p-1.5 rounded-md text-muted group-hover:text-accent-teal transition-colors duration-200"
                          >
                            {isCopied ? (
                              <svg
                                className="w-4 h-4 text-accent-teal animate-check-bounce"
                                fill="none"
                                viewBox="0 0 24 24"
                                stroke="currentColor"
                                strokeWidth="2.5"
                                strokeLinecap="round"
                                strokeLinejoin="round"
                              >
                                <polyline points="20 6 9 17 4 12" />
                              </svg>
                            ) : (
                              <svg
                                className="w-4 h-4 text-muted/60 group-hover:text-accent-teal transition-colors duration-200"
                                fill="none"
                                viewBox="0 0 24 24"
                                stroke="currentColor"
                                strokeWidth="1.8"
                                strokeLinecap="round"
                                strokeLinejoin="round"
                              >
                                <rect x="9" y="9" width="13" height="13" rx="2" ry="2" />
                                <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1" />
                              </svg>
                            )}
                          </div>

                          {/* External Link Icon for LinkedIn / GitHub */}
                          {item.isExternal && (
                            <a
                              href={item.href}
                              target="_blank"
                              rel="noopener noreferrer"
                              title={`Open ${item.label} in new tab`}
                              onClick={(e) => e.stopPropagation()}
                              className="p-1.5 rounded-md text-muted hover:text-accent-teal hover:bg-accent-teal/10 transition-all duration-200"
                            >
                              <svg
                                className="w-4 h-4 text-muted group-hover:text-accent-teal transition-colors duration-200"
                                viewBox="0 0 24 24"
                                fill="none"
                                stroke="currentColor"
                                strokeWidth="2"
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                aria-hidden="true"
                              >
                                <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6" />
                                <polyline points="15 3 21 3 21 9" />
                                <line x1="10" y1="14" x2="21" y2="3" />
                              </svg>
                            </a>
                          )}
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* Bottom Call to Action Section */}
              <div className="border-t border-border-default/40 pt-space-6 flex flex-col gap-space-4">
                {/* Live Status Indicator */}
                <div style={getRevealStyle(7)} className="flex items-center gap-2 select-none">
                  <div className="relative flex items-center justify-center w-3 h-3">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-accent-teal opacity-75" />
                    <span className="relative inline-flex rounded-full h-2 w-2 bg-accent-teal shadow-[0_0_8px_rgba(20,184,166,0.9)]" />
                  </div>
                  <span className="font-mono text-[12px] font-semibold tracking-wide text-foreground/90 uppercase">
                    Currently open to opportunities
                  </span>
                </div>

                <div style={getRevealStyle(8)} className="flex flex-col gap-space-4">
                  <p className="text-text-lg font-medium text-muted font-sans text-left">
                    Interested in working together?
                  </p>

                  <div className="flex flex-col sm:flex-row gap-space-4 w-full">
                    {/* Email Button with Shine-Sweep Effect */}
                    <a
                      href="mailto:sarvanikutti@gmail.com"
                      className="talk-shine-button w-full sm:w-1/2 py-space-3 bg-gradient-to-r from-accent-blue to-accent-teal text-background font-semibold rounded-radius-sm shadow-sm hover:shadow-md focus:outline-none focus:ring-2 focus:ring-accent-teal focus:ring-offset-2 transition-all duration-200 ease-in-out inline-flex items-center justify-center text-center cursor-pointer text-text-sm hover:scale-[1.02] active:scale-[0.98] relative overflow-hidden"
                    >
                      <span className="relative z-10">Email Me</span>
                    </a>

                    {/* LinkedIn Button with Shine-Sweep Effect */}
                    <a
                      href="https://www.linkedin.com/in/sarvani-vadavalli-94a501324"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="talk-shine-button w-full sm:w-1/2 py-space-3 bg-transparent border border-border-default hover:border-accent-teal text-foreground hover:text-accent-teal font-semibold rounded-radius-sm focus:outline-none focus:ring-2 focus:ring-accent-teal focus:ring-offset-2 transition-all duration-200 ease-in-out inline-flex items-center justify-center text-center cursor-pointer text-text-sm hover:scale-[1.02] active:scale-[0.98] relative overflow-hidden"
                    >
                      <span className="relative z-10">Connect on LinkedIn</span>
                    </a>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer className="absolute bottom-space-6 left-0 right-0 text-center text-text-xs text-muted/60 font-sans pointer-events-auto w-full">
        <div className="container mx-auto px-space-4 md:px-space-8 flex flex-col sm:flex-row items-center justify-between gap-space-4 border-t border-border-default/20 pt-space-6">
          <p className="text-left font-medium">© {new Date().getFullYear()} Sarvani Vadavalli. All rights reserved.</p>
          <div className="flex gap-space-6 font-semibold">
            <a
              href="https://github.com/SarvaniVadavalli"
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-accent-teal transition-colors duration-100 relative group"
            >
              GitHub
              <span className="absolute left-0 bottom-0 w-full h-[1px] bg-accent-teal origin-left scale-x-0 group-hover:scale-x-100 transition-transform duration-100 ease-in-out" />
            </a>
            <a
              href="https://www.linkedin.com/in/sarvani-vadavalli-94a501324"
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-accent-teal transition-colors duration-100 relative group"
            >
              LinkedIn
              <span className="absolute left-0 bottom-0 w-full h-[1px] bg-accent-teal origin-left scale-x-0 group-hover:scale-x-100 transition-transform duration-100 ease-in-out" />
            </a>
          </div>
        </div>
      </footer>

      {/* Inline styles for Toast animation & Shine-Sweep effect */}
      <style dangerouslySetInnerHTML={{ __html: `
        @keyframes toast-fade {
          0% {
            opacity: 0;
            transform: translateY(4px);
          }
          15% {
            opacity: 1;
            transform: translateY(0);
          }
          85% {
            opacity: 1;
            transform: translateY(0);
          }
          100% {
            opacity: 0;
            transform: translateY(-4px);
          }
        }
        .animate-toast-fade {
          animation: toast-fade 1200ms cubic-bezier(0.16, 1, 0.3, 1) forwards;
        }

        @keyframes check-bounce {
          0% {
            transform: scale(0.6);
          }
          50% {
            transform: scale(1.2);
          }
          100% {
            transform: scale(1);
          }
        }
        .animate-check-bounce {
          animation: check-bounce 250ms cubic-bezier(0.16, 1, 0.3, 1) forwards;
        }

        /* Shine-sweep button effect */
        .talk-shine-button::after {
          content: "";
          position: absolute;
          top: -50%;
          left: -75%;
          width: 50%;
          height: 200%;
          background: linear-gradient(
            120deg,
            transparent 0%,
            rgba(255, 255, 255, 0.28) 50%,
            transparent 100%
          );
          transform: rotate(25deg);
          transition: none;
          pointer-events: none;
        }

        .talk-shine-button:hover::after {
          animation: shine-sweep 600ms ease-out forwards;
        }

        @keyframes shine-sweep {
          0% {
            left: -75%;
          }
          100% {
            left: 125%;
          }
        }

        @media (prefers-reduced-motion: reduce) {
          .talk-shine-button:hover::after {
            animation: none !important;
          }
          .talk-shine-button:hover {
            transform: none !important;
          }
          .animate-ping {
            animation: none !important;
          }
        }
      ` }} />
    </section>
  );
}
