"use client";

import React, { useEffect, useState, useRef } from "react";
import use3DTilt from "@/lib/hooks/use3DTilt";
import GlitchDecodeText from "../shared/GlitchDecodeText";

export interface SkillGroup {
  category: string;
  skills: string[];
}

const CARD_DATA: SkillGroup[] = [
  {
    category: "Languages",
    skills: ["Python", "JavaScript", "C++", "SQL", "HTML", "CSS"],
  },
  {
    category: "Machine Learning & AI",
    skills: ["TensorFlow", "OpenCV", "Scikit-learn", "NumPy", "Pandas", "Matplotlib"],
  },
  {
    category: "Web & Backend",
    skills: ["React", "Tailwind CSS", "Vite", "React Router", "Axios", "Node.js", "Express.js", "JWT", "bcrypt"],
  },
  {
    category: "Database",
    skills: ["MongoDB", "Mongoose", "MySQL"],
  },
  {
    category: "Tools",
    skills: ["Git", "GitHub", "VS Code", "Postman", "MongoDB Compass"],
  },
];

export interface SkillCardProps {
  category: string;
  index: number;
  cardDelay: number;
  hasRevealed: boolean;
  reducedMotion: boolean;
}

function SkillCard({ category, index, cardDelay, hasRevealed, reducedMotion }: SkillCardProps) {
  const cardRef = use3DTilt<HTMLDivElement>({ maxRotation: 3, hoverLift: "0px" });

  const getCategoryTag = (cat: string): string => {
    switch (cat) {
      case "Languages":
        return "Languages";
      case "Machine Learning & AI":
        return "ML_AI";
      case "Web & Backend":
        return "Web_Backend";
      case "Database":
        return "Database";
      case "Tools":
        return "Tools";
      default:
        return cat.replace(/\s+/g, "_");
    }
  };

  const accentColor = index === 0
    ? "#14B8A6"
    : index === 1
    ? "#13B0A5"
    : index === 2
    ? "#0EA5E9"
    : index === 3
    ? "#0EA5E9"
    : "#A5BFCF";

  const renderChips = (skillsList: string[], startIndex = 0) => {
    return skillsList.map((skill, offsetIndex) => {
      const chipIndex = startIndex + offsetIndex;
      const chipDelay = cardDelay + 150 + chipIndex * 50;
      const chipStyle: React.CSSProperties = reducedMotion ? {} : {
        opacity: hasRevealed ? 1 : 0,
        transform: hasRevealed ? "translateY(0)" : "translateY(10px)",
        transition: "opacity 600ms cubic-bezier(0.16, 1, 0.3, 1), transform 600ms cubic-bezier(0.16, 1, 0.3, 1)",
        transitionDelay: hasRevealed ? `${chipDelay}ms` : "0ms",
        willChange: "opacity, transform",
      };
      return (
        <span
          key={skill}
          style={chipStyle}
          className="skill-chip px-3 py-1.5 md:px-space-4 md:py-space-2 bg-background border border-border-default rounded-radius-sm text-text-sm md:text-text-base text-muted cursor-default select-none"
        >
          {skill}
        </span>
      );
    });
  };

  return (
    <div style={{ perspective: "1000px" }} className="w-full">
      <div
        ref={cardRef}
        className="bg-card-bg rounded-radius-lg p-space-6 md:p-space-8 flex flex-col gap-space-4 md:gap-space-6 shadow-sm relative overflow-hidden skills-card w-full h-auto"
        style={{
          transformStyle: "preserve-3d",
          ["--card-accent" as string]: accentColor,
          ["--card-accent-glow" as string]: index === 4 ? "rgba(224, 242, 254, 0.12)" : `${accentColor}1a`,
        }}
      >
        {index === 0 && (
          <div className="flex gap-1.5 pointer-events-none select-none mb-1 shrink-0" style={{ transform: "translateZ(8px)" }}>
            <div className="w-2 h-2 rounded-full bg-foreground/10" />
            <div className="w-2 h-2 rounded-full bg-foreground/10" />
            <div className="w-2 h-2 rounded-full bg-foreground/10" />
          </div>
        )}

        {index === 1 && (
          <svg
            className="absolute inset-0 w-full h-full pointer-events-none select-none opacity-[0.12] z-0"
            style={{
              transform: "translateZ(2px)",
              color: "var(--card-accent)",
            }}
            xmlns="http://www.w3.org/2000/svg"
          >
            <line x1="20%" y1="30%" x2="45%" y2="55%" stroke="currentColor" strokeWidth="1" />
            <line x1="45%" y1="55%" x2="80%" y2="40%" stroke="currentColor" strokeWidth="1" />
            <line x1="45%" y1="55%" x2="60%" y2="80%" stroke="currentColor" strokeWidth="1" />
            <line x1="20%" y1="30%" x2="30%" y2="75%" stroke="currentColor" strokeWidth="1" />

            <circle cx="20%" cy="30%" r="3" fill="currentColor" />
            <circle cx="45%" cy="55%" r="4" fill="currentColor" />
            <circle cx="80%" cy="40%" r="2.5" fill="currentColor" />
            <circle cx="60%" cy="80%" r="3" fill="currentColor" />
            <circle cx="30%" cy="75%" r="3" fill="currentColor" />
          </svg>
        )}

        {index === 2 && (
          <div
            className="flex items-center gap-3 pointer-events-none select-none border-b border-border-default/10 pb-2.5 w-full mb-1 shrink-0"
            style={{ transform: "translateZ(8px)" }}
          >
            <div className="flex gap-1 shrink-0">
              <div className="w-1.5 h-1.5 rounded-full bg-foreground/10" />
              <div className="w-1.5 h-1.5 rounded-full bg-foreground/10" />
              <div className="w-1.5 h-1.5 rounded-full bg-foreground/10" />
            </div>
            <div className="flex-grow bg-background/30 border border-border-default/10 rounded px-2 py-0.5 text-[10px] font-mono text-muted/30 text-center tracking-normal truncate">
              localhost:3000
            </div>
          </div>
        )}

        {index === 4 && (
          <div
            className="flex items-center gap-4 pointer-events-none select-none border-b border-border-default/10 pb-2.5 w-full mb-1 shrink-0"
            style={{ transform: "translateZ(8px)" }}
          >
            <div className="flex gap-2.5 shrink-0">
              <div className="w-5 h-5 rounded border border-border-default/20 flex items-center justify-center bg-background/20">
                <svg className="w-3 h-3 text-muted/30" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <rect x="3" y="3" width="18" height="18" rx="2" />
                  <line x1="9" y1="3" x2="9" y2="21" />
                </svg>
              </div>
              <div className="w-5 h-5 rounded border border-border-default/20 flex items-center justify-center bg-background/20">
                <svg className="w-3 h-3 text-muted/30" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5" />
                </svg>
              </div>
              <div className="w-5 h-5 rounded border border-border-default/20 flex items-center justify-center bg-background/20">
                <svg className="w-3 h-3 text-muted/30" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <circle cx="12" cy="12" r="10" />
                  <line x1="12" y1="8" x2="12" y2="16" />
                  <line x1="8" y1="12" x2="16" y2="12" />
                </svg>
              </div>
            </div>
            <div className="h-4 w-[1px] bg-border-default/15" />
            <div className="text-[10px] font-mono text-muted/30 tracking-wider uppercase">Workspace</div>
          </div>
        )}

        <h3
          className="font-mono text-text-xs md:text-text-sm font-bold tracking-[0.1em] uppercase mb-space-4 flex items-center gap-1.5 shrink-0"
          style={{
            transform: "translateZ(12px)",
            color: "var(--card-accent)",
          }}
        >
          <span className="select-none mr-2 font-semibold">0{index + 1} —</span>
          <span>&lt;{getCategoryTag(category)} /&gt;</span>
          {index === 3 && (
            <svg className="w-3.5 h-3.5 text-accent-blue opacity-80" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
              <ellipse cx="12" cy="5" rx="9" ry="3" />
              <path d="M3 5v14c0 1.66 4 3 9 3s9-1.34 9-3V5" />
              <path d="M3 12c0 1.66 4 3 9 3s9-1.34 9-3" />
            </svg>
          )}
        </h3>

        <div className="flex flex-wrap gap-2 md:gap-space-3 z-10" style={{ transform: "translateZ(18px)" }}>
          {renderChips(CARD_DATA[index].skills, 0)}
        </div>
      </div>
    </div>
  );
}

export default function Skills() {
  const [reducedMotion, setReducedMotion] = useState<boolean>(false);
  const [hasRevealed, setHasRevealed] = useState<boolean>(false);
  const skillsRef = useRef<HTMLElement | null>(null);

  useEffect(() => {
    const mediaQuery = window.matchMedia("(prefers-reduced-motion: reduce)");
    const motionHandler = (e: MediaQueryListEvent) => setReducedMotion(e.matches);
    mediaQuery.addEventListener("change", motionHandler);
    setReducedMotion(mediaQuery.matches);

    let resetTimeout: ReturnType<typeof setTimeout> | null = null;
    const el = skillsRef.current;
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

  const getTransitionStyle = (delayMs: number): React.CSSProperties => {
    if (reducedMotion) return {};
    return {
      opacity: hasRevealed ? 1 : 0,
      transform: hasRevealed ? "translateY(0)" : "translateY(15px)",
      transition: "opacity 600ms cubic-bezier(0.16, 1, 0.3, 1), transform 600ms cubic-bezier(0.16, 1, 0.3, 1)",
      transitionDelay: hasRevealed ? `${delayMs}ms` : "0ms",
      willChange: "opacity, transform",
    };
  };

  return (
    <section
      ref={skillsRef}
      id="skills"
      aria-label="Skills"
      className="w-full min-h-[100dvh] snap-start flex flex-col justify-center border-b border-border-default py-space-12 md:py-space-16 relative"
    >
      <div className="absolute top-0 left-0 -translate-y-1/2 w-full z-20 flex items-center justify-center pointer-events-none">
        <GlitchDecodeText
          text="IDEAS ARE CHEAP. EXECUTION ISN'T."
          trigger={hasRevealed}
        />
      </div>

      <div className="container mx-auto px-space-4 md:px-space-8">
        <div className="mb-space-12 flex flex-col justify-start">
          <div style={getTransitionStyle(0)}>
            <span className="font-mono text-text-xs font-bold tracking-[0.1em] text-accent-teal uppercase mb-space-4 block">
              &lt;Skills /&gt;
            </span>
          </div>
          <div style={getTransitionStyle(100)} className="mt-space-2">
            <h2 className="text-text-3xl md:text-text-5xl font-serif font-semibold text-foreground tracking-tight">
              Technologies I work with.
            </h2>
          </div>
        </div>

        <div className="grid grid-cols-12 gap-space-6 md:gap-space-8 items-start">
          {CARD_DATA.map((group, index) => {
            const cardDelay = 200 + index * 300;

            let gridClass = "col-span-12";
            if (index === 0) {
              gridClass += " md:col-span-6 lg:col-span-4";
            } else if (index === 1) {
              gridClass += " md:col-span-6 lg:col-span-4";
            } else if (index === 2) {
              gridClass += " md:col-span-6 lg:col-span-4";
            } else if (index === 3) {
              gridClass += " md:col-span-6 lg:col-span-4 lg:col-start-3";
            } else if (index === 4) {
              gridClass += " md:col-span-6 md:col-start-4 lg:col-span-4 lg:col-start-7";
            }

            return (
              <div
                key={group.category}
                className={gridClass}
                style={getTransitionStyle(cardDelay)}
              >
                <SkillCard
                  category={group.category}
                  index={index}
                  cardDelay={cardDelay}
                  hasRevealed={hasRevealed}
                  reducedMotion={reducedMotion}
                />
              </div>
            );
          })}
        </div>
      </div>

      <style
        dangerouslySetInnerHTML={{
          __html: `
        .skills-card {
          border: 1px solid var(--color-border-default);
          transition: border-color 200ms ease-out, box-shadow 200ms ease-out;
        }
        .skills-card:hover {
          border-color: var(--card-accent) !important;
          box-shadow: 0 0 16px var(--card-accent-glow) !important;
        }
        .skill-chip {
          position: relative;
          background-color: var(--color-background);
          border: 1px solid var(--color-border-default);
          color: var(--color-muted);
          transition: 
            color 150ms cubic-bezier(0.16, 1, 0.3, 1), 
            border-color 150ms cubic-bezier(0.16, 1, 0.3, 1), 
            box-shadow 150ms cubic-bezier(0.16, 1, 0.3, 1), 
            transform 150ms cubic-bezier(0.16, 1, 0.3, 1),
            background-image 150ms cubic-bezier(0.16, 1, 0.3, 1);
        }
        .skill-chip:hover {
          transform: scale(1.03);
          color: var(--color-foreground);
          border-color: transparent;
          background-image: 
            linear-gradient(var(--color-background), var(--color-background)), 
            linear-gradient(135deg, #0ea5e9, #14b8a6);
          background-origin: border-box;
          background-clip: padding-box, border-box;
          box-shadow: 0 0 12px rgba(224, 242, 254, 0.25);
        }
        @media (prefers-reduced-motion: reduce) {
          .skill-chip:hover {
            transform: none !important;
          }
        }
      `,
        }}
      />
    </section>
  );
}
