"use client";

import React, { useEffect, useState } from "react";
import { SECTIONS, Section } from "../../lib/constants";
import { playTick } from "../../lib/audio";
import SoundToggle from "../shared/SoundToggle";

export default function SiteNav() {
  const navItems: Section[] = SECTIONS.filter((section) => section.inNav);
  const [activeSection, setActiveSection] = useState<string>("");
  const [scrollOffset, setScrollOffset] = useState<number>(0);

  useEffect(() => {
    const main = document.querySelector("main");
    if (!main) return;

    const handleScroll = () => {
      setScrollOffset(main.scrollTop);
    };

    main.addEventListener("scroll", handleScroll, { passive: true });
    return () => main.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    const observerOptions: IntersectionObserverInit = {
      root: null,
      rootMargin: "-25% 0px -65% 0px", // Detect active section when it occupies middle of viewport
      threshold: 0.05,
    };

    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          setActiveSection(entry.target.id);
        }
      });
    }, observerOptions);

    SECTIONS.forEach((section) => {
      const el = document.getElementById(section.id);
      if (el) observer.observe(el);
    });

    return () => observer.disconnect();
  }, []);

  const vh = typeof window !== "undefined" ? window.innerHeight : 800;

  return (
    <nav className="fixed top-space-4 left-1/2 -translate-x-1/2 w-[90%] max-w-[800px] h-[54px] bg-card-bg/65 backdrop-blur-md border border-border-default/60 rounded-[20px] shadow-md z-z-sticky-nav font-sans flex items-center justify-between px-space-6 transition-all duration-300">
      <a
        id="nav-logo"
        href="#hero"
        onClick={playTick}
        className="font-clash font-bold text-text-lg tracking-tighter text-foreground focus:outline-none focus:ring-2 focus:ring-accent-teal focus:ring-offset-2 rounded-radius-sm"
        style={{
          opacity: 0.45 + Math.min(1, scrollOffset / (vh * 0.45)) * 0.55,
        }}
      >
        Sarvani Vadavalli
      </a>
      <ul className="flex items-center gap-x-space-4 md:gap-x-space-6 h-full">
        {navItems.map((item) => (
          <li key={item.id} className="relative py-2 flex items-center h-full">
            <a
              href={`#${item.id}`}
              onClick={playTick}
              className={`text-text-sm font-mono font-medium tracking-[0.02em] transition-colors duration-100 focus:outline-none focus:ring-2 focus:ring-accent-teal focus:ring-offset-2 rounded-radius-sm ${
                activeSection === item.id
                  ? "text-foreground font-semibold"
                  : "text-muted hover:text-foreground"
              }`}
            >
              {item.label}
            </a>
            {/* Underline transition */}
            <span
              className={`absolute bottom-1 left-0 right-0 h-[2px] bg-accent-teal transition-all duration-200 origin-left scale-x-0 ${
                activeSection === item.id ? "scale-x-100" : ""
              }`}
            />
          </li>
        ))}
        <li className="relative py-2 flex items-center h-full">
          <a
            href="/resume.pdf"
            target="_blank"
            rel="noopener noreferrer"
            onClick={playTick}
            className="text-text-sm font-mono font-medium tracking-[0.02em] text-muted hover:text-foreground transition-colors duration-100 focus:outline-none focus:ring-2 focus:ring-accent-teal focus:ring-offset-2 rounded-radius-sm cursor-pointer"
          >
            Resume
          </a>
        </li>
        <li className="flex items-center h-full pl-3 ml-1 border-l border-border-default/30">
          <SoundToggle />
        </li>
      </ul>
    </nav>
  );
}
