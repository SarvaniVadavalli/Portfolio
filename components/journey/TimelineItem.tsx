"use client";

import React, { useEffect, useRef, useState } from "react";
import ScrollReveal from "../shared/ScrollReveal";

export interface TimelineHighlight {
  label: string;
  value: string;
}

export interface TimelineItemProps {
  year: string;
  title: string;
  subtitle: string;
  description: string;
  highlight?: TimelineHighlight;
  technologies?: string[];
  narrative?: string;
}

export default function TimelineItem({
  year,
  title,
  subtitle,
  description,
  highlight,
  technologies,
  narrative,
}: TimelineItemProps) {
  const ref = useRef<HTMLLIElement | null>(null);
  const [isActive, setIsActive] = useState<boolean>(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        setIsActive(entry.isIntersecting);
      },
      {
        threshold: 0.1,
        rootMargin: "-25% 0px -25% 0px",
      }
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  return (
    <li ref={ref} className="relative pl-space-6 md:pl-space-8 group">
      {/* Active rail segment behind the dot */}
      <div
        className={`absolute left-0 -translate-x-1/2 top-0 bottom-0 w-[1.5px] transition-colors duration-300 ${
          isActive ? "bg-accent-teal/55" : "bg-transparent"
        }`}
        aria-hidden="true"
      />

      {/* Subtle Accent Timeline Dot */}
      <div
        className={`absolute left-0 -translate-x-1/2 top-[28px] w-[12px] h-[12px] rounded-full border transition-all duration-300 z-10 group-hover:scale-125 group-hover:border-accent-teal group-hover:bg-accent-teal/80 ${
          isActive
            ? "bg-accent-teal border-accent-teal"
            : "bg-background border-border-default"
        }`}
        aria-hidden="true"
      />

      {/* Timeline Card Wrapper */}
      <ScrollReveal type="card">
        <div className="flex flex-col gap-1.5 w-full">
          {/* Narrative Line Above Card */}
          {narrative && (
            <div className="font-mono text-[11px] md:text-text-xs text-muted/50 italic pl-1 select-none tracking-normal truncate w-full max-w-[60ch]">
              &quot;{narrative}&quot;
            </div>
          )}

          {/* Card Body */}
          <div className="bg-card-bg border border-border-default hover:border-accent-teal rounded-radius-lg p-space-6 md:p-space-8 shadow-sm flex flex-col gap-space-2 text-left cursor-default select-none transition-colors duration-100 ease-in-out">
            <span className="text-text-lg font-bold text-accent-teal tracking-wider">
              {year}
            </span>
            <div className="flex flex-col">
              <h3 className="text-text-lg font-bold text-foreground font-sans">
                {title}
              </h3>
              <span className="text-text-sm text-muted">{subtitle}</span>
            </div>
            <p className="text-text-base text-foreground/80 leading-[1.6] max-w-[60ch]">
              {description}
            </p>

            {highlight && (
              <div className="mt-space-2 text-text-base font-medium text-muted">
                {highlight.label}:{" "}
                <span className="text-accent-teal font-bold">
                  {highlight.value}
                </span>
              </div>
            )}

            {technologies && technologies.length > 0 && (
              <div className="flex flex-wrap gap-space-2 mt-space-3">
                {technologies.map((tech) => (
                  <span
                    key={tech}
                    className="px-space-3 py-space-1 bg-background border border-border-default hover:border-accent-teal rounded-radius-sm text-text-sm text-muted cursor-default select-none transition-colors duration-100 ease-in-out"
                  >
                    {tech}
                  </span>
                ))}
              </div>
            )}
          </div>
        </div>
      </ScrollReveal>
    </li>
  );
}
