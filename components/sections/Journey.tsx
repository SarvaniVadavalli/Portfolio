"use client";

import React, { useEffect, useState, useRef } from "react";
import ScrollReveal from "../shared/ScrollReveal";

export interface JourneyHighlight {
  label: string;
  value: string;
}

export interface JourneyItem {
  year: string;
  title: string;
  subtitle: string;
  description: string;
  highlight?: JourneyHighlight;
  narrative?: string;
  type: string;
  stage: string;
  stat: string;
  org: string;
  technologies?: string[];
}

const JOURNEY_ITEMS: JourneyItem[] = [
  {
    year: "2024 – Present",
    title: "B.Tech Computer Science (AI & ML)",
    subtitle: "SRM University AP",
    description:
      "Focused on Artificial Intelligence, Machine Learning, Software Engineering, and problem solving.",
    highlight: { label: "CGPA", value: "9.11" },
    narrative: "I wanted to understand the math behind predictions, not just import libraries.",
    type: "education",
    stage: "Academics",
    stat: "CGPA 9.11",
    org: "SRM AP",
  },
  {
    year: "2025 – Present",
    title:
      "Research Intern – Video Compression & Decompression for AD/ADAS Systems Monitoring",
    subtitle: "Ongoing Research Internship",
    description:
      "Currently undergoing foundational training and technical preparation for a research project focused on AI-assisted low-latency video compression and decompression for Autonomous Driving (AD) and Advanced Driver Assistance Systems (ADAS). Building expertise in computer vision, deep learning, video processing, and real-time AI systems before beginning the implementation phase.",
    technologies: [
      "Python",
      "TensorFlow",
      "Keras",
      "Computer Vision",
      "Video Codecs",
      "Autonomous Driving (AD)",
      "Advanced Driver Assistance Systems (ADAS)",
    ],
    narrative: "AD/ADAS video research taught me that models are useless if they can't run in real-time.",
    type: "research",
    stage: "Research",
    stat: "Training Complete",
    org: "ADAS Internship",
  },
  {
    year: "2025",
    title: "MongoDB Certified Associate Developer",
    subtitle: "Professional Certification",
    description:
      "Completed MongoDB Associate Developer certification focused on modern database development and application design.",
    narrative: "Getting certified was my way of proving I could build production-ready schemas.",
    type: "certification",
    stage: "Certification",
    stat: "MongoDB Certified",
    org: "MongoDB Inc",
  },
  {
    year: "2025",
    title: "Hackathons & Team Projects",
    subtitle: "Competitions",
    description:
      "Participated in hackathons while collaborating on AI and full-stack software projects under real development constraints.",
    narrative: "Under pressure, I learned to value working software and clear communication over perfection.",
    type: "competition",
    stage: "Competition",
    stat: "Collaborations",
    org: "Hackathons",
  },
];

export interface JourneyCardProps {
  item: JourneyItem;
  activeIndex: number;
  idx: number;
  getMilestoneIcon: (type: string) => React.ReactNode;
}

function JourneyCard({ item, activeIndex, idx, getMilestoneIcon }: JourneyCardProps) {
  const [isExpanded, setIsExpanded] = useState<boolean>(false);
  const isActive = idx === activeIndex;

  const isLongDescription = item.description.length > 180;

  useEffect(() => {
    if (!isActive) {
      setIsExpanded(false);
    }
  }, [isActive]);

  return (
    <div
      className="flex-shrink-0 transition-all duration-300 origin-center"
      style={{
        width: "var(--slide-width)",
        marginRight: "var(--slide-gap)",
        opacity: isActive ? 1 : 0.45,
        transform: isActive ? "scale(1)" : "scale(0.95)",
      }}
    >
      <div className="flex flex-col gap-1.5 w-full max-w-full">
        {item.narrative && (
          <div className="font-mono text-[11px] md:text-text-xs text-muted/50 italic pl-1 select-none tracking-normal w-full">
            &quot;{item.narrative}&quot;
          </div>
        )}

        <div
          className={`bg-card-bg border rounded-radius-lg p-space-6 md:p-space-8 shadow-sm flex flex-col gap-3 text-left w-full transition-all duration-300 relative select-none ${
            isExpanded
              ? "h-auto max-h-[800px] overflow-visible border-accent-teal"
              : "h-[340px] md:h-[360px] max-h-[340px] md:max-h-[360px] overflow-hidden border-border-default hover:border-accent-teal"
          }`}
        >
          <div className="absolute top-space-6 right-space-6 md:top-space-8 md:right-space-8 shrink-0">
            {getMilestoneIcon(item.type)}
          </div>

          <span className="text-text-lg font-bold text-accent-teal tracking-wider shrink-0">
            {item.year}
          </span>
          <div className="flex flex-col shrink-0 max-w-[85%] mb-1">
            <h3 className="text-text-lg md:text-xl font-bold text-foreground font-sans whitespace-normal leading-snug">
              {item.title}
            </h3>
            <span className="text-text-sm text-muted mt-0.5 whitespace-normal">{item.subtitle}</span>
          </div>

          <div className={`flex-grow flex flex-col gap-3 ${
            isExpanded ? "overflow-visible" : "overflow-hidden"
          }`}>
            <div className="relative">
              <p className={`text-text-base text-foreground/80 leading-[1.6] ${
                isLongDescription && !isExpanded ? "journey-desc-collapsed" : ""
              }`}>
                {item.description}
              </p>
              {isLongDescription && !isExpanded && (
                <div className="absolute bottom-0 left-0 right-0 h-4 bg-gradient-to-t from-card-bg to-transparent pointer-events-none" />
              )}
            </div>

            {item.highlight && (
              <div className="text-text-base font-medium text-muted shrink-0">
                {item.highlight.label}:{" "}
                <span className="text-accent-teal font-bold">
                  {item.highlight.value}
                </span>
              </div>
            )}

            {item.technologies && item.technologies.length > 0 && (
              <div className="flex flex-wrap gap-space-2 mt-1 shrink-0">
                {item.technologies.map((tech) => (
                  <span
                    key={tech}
                    className="px-space-3 py-space-1 bg-background border border-border-default rounded-radius-sm text-text-sm text-muted cursor-default select-none"
                  >
                    {tech}
                  </span>
                ))}
              </div>
            )}
          </div>

          {isLongDescription && (
            <button
              onClick={(e: React.MouseEvent<HTMLButtonElement>) => {
                e.stopPropagation();
                setIsExpanded(!isExpanded);
              }}
              className="mt-1 text-left font-mono text-[10px] md:text-[11px] text-accent-teal hover:underline tracking-wider uppercase shrink-0 w-fit pointer-events-auto"
            >
              {isExpanded ? "[ Show less ]" : "[ Read more ]"}
            </button>
          )}
        </div>
      </div>
    </div>
  );
}

export default function Journey() {
  const [activeIndex, setActiveIndex] = useState<number>(0);
  const touchStart = useRef<number>(0);
  const touchEnd = useRef<number>(0);

  const handlePrev = (): void => {
    setActiveIndex((prev) => Math.max(0, prev - 1));
  };

  const handleNext = (): void => {
    setActiveIndex((prev) => Math.min(JOURNEY_ITEMS.length - 1, prev + 1));
  };

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "ArrowLeft") {
        handlePrev();
      } else if (e.key === "ArrowRight") {
        handleNext();
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);

  const handleTouchStart = (e: React.TouchEvent<HTMLDivElement>) => {
    touchStart.current = e.targetTouches[0].clientX;
  };

  const handleTouchMove = (e: React.TouchEvent<HTMLDivElement>) => {
    touchEnd.current = e.targetTouches[0].clientX;
  };

  const handleTouchEnd = () => {
    if (!touchStart.current || !touchEnd.current) return;
    const distance = touchStart.current - touchEnd.current;
    const isLeftSwipe = distance > 50;
    const isRightSwipe = distance < -50;
    if (isLeftSwipe) {
      handleNext();
    } else if (isRightSwipe) {
      handlePrev();
    }
    touchStart.current = 0;
    touchEnd.current = 0;
  };

  const getMilestoneIcon = (type: string): React.ReactNode => {
    const baseClass = "w-5 h-5 text-accent-teal/70";
    switch (type) {
      case "education":
        return (
          <svg className={baseClass} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.5">
            <path strokeLinecap="round" strokeLinejoin="round" d="M4.263 10.185a.75.75 0 000 1.15l8.16 5.34a.75.75 0 00.835 0l8.16-5.34a.75.75 0 000-1.15L13.258 4.86a.75.75 0 00-.835 0L4.263 10.185z" />
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 15.75v5.25M3 10.5v5.25a3 3 0 003 3h12a3 3 0 003-3V10.5" />
          </svg>
        );
      case "research":
      case "internship":
        return (
          <svg className={baseClass} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.5">
            <path strokeLinecap="round" strokeLinejoin="round" d="M18 18.72a9.094 9.094 0 003.741-.479 3 3 0 00-4.682-2.72m.94 3.198l.001.031c0 .225-.012.447-.037.666A11.944 11.944 0 0112 21c-2.17 0-4.207-.576-5.963-1.584A6.062 6.062 0 016 18.719m12 0a5.971 5.971 0 00-.941-3.197m0 0A5.995 5.995 0 0012 12.75a5.995 5.995 0 00-5.058 2.772m0 0a3 3 0 00-4.681 2.72 8.986 8.986 0 003.74.477m.94-3.197a5.971 5.971 0 00-.94 3.197M15 6.75a3 3 0 11-6 0 3 3 0 016 0zm6 3a2.25 2.25 0 11-4.5 0 2.25 2.25 0 014.5 0zm-13.5 0a2.25 2.25 0 11-4.5 0 2.25 2.25 0 014.5 0z" />
          </svg>
        );
      case "certification":
        return (
          <svg className={baseClass} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.5">
            <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75M21 12c0 1.268-.63 2.39-1.593 3.068a3.745 3.745 0 01-1.043 3.296 3.745 3.745 0 01-3.296 1.043A3.745 3.745 0 0112 21c-1.268 0-2.39-.63-3.068-1.593a3.746 3.746 0 01-3.296-1.043 3.745 3.745 0 01-1.043-3.296A3.745 3.745 0 013 12c0-1.268.63-2.39 1.593-3.068a3.745 3.745 0 011.043-3.296 3.746 3.746 0 013.296-1.043A3.746 3.746 0 0112 3c1.268 0 2.39.63 3.068 1.593a3.746 3.746 0 013.296 1.043 3.746 3.746 0 011.043 3.296A3.745 3.745 0 0121 12z" />
          </svg>
        );
      default:
        return (
          <svg className={baseClass} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.5">
            <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 13.5l10.5-11.25L12 10.5h8.25L9.75 21.75 12 13.5H3.75z" />
          </svg>
        );
    }
  };

  const activeItem = JOURNEY_ITEMS[activeIndex];

  return (
    <section
      id="journey"
      aria-label="My Journey"
      className="w-full min-h-[100dvh] snap-start flex flex-col justify-center border-b border-border-default pt-space-24 pb-space-12 md:pt-space-32 md:pb-space-16 relative"
    >
      <div className="container mx-auto px-space-4 md:px-space-8">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-space-8 items-start">
          <div className="col-span-1 md:col-span-6 lg:col-span-5 flex flex-col justify-start mb-space-8 md:mb-0">
            <ScrollReveal delay="0">
              <span className="text-text-xs font-bold tracking-[0.1em] text-accent-teal uppercase mb-space-4 block">
                JOURNEY
              </span>
            </ScrollReveal>
            <ScrollReveal delay="120">
              <h2 className="text-text-3xl md:text-text-5xl font-serif font-semibold text-foreground tracking-tight mb-space-6">
                My Journey.
              </h2>
            </ScrollReveal>
            <ScrollReveal delay="220">
              <p className="text-text-base text-foreground/80 leading-[1.6] max-w-[62ch] font-medium">
                Every project, certification, and challenge has shaped the
                engineer I am today. This timeline highlights the milestones
                that continue to define my growth.
              </p>
            </ScrollReveal>

            <div
              key={`ticker-${activeIndex}`}
              className="hidden md:block font-mono text-[11px] text-muted/40 mt-6 tracking-wide select-none animate-ghost-fade"
            >
              &gt; currently: <span className="text-accent-teal font-medium">{activeItem.stage}</span> · <span className="text-accent-teal font-medium">{activeItem.stat}</span> · <span className="text-accent-teal font-semibold">{activeItem.org}</span>
            </div>
          </div>

          <div className="col-span-1 md:col-span-6 lg:col-span-7 flex flex-col items-center relative w-full">
            <div
              key={`ghost-${activeIndex}`}
              className="hidden sm:block absolute -right-4 -top-20 text-[180px] md:text-[280px] font-mono font-bold select-none pointer-events-none text-foreground/[0.035] leading-none z-0 animate-ghost-fade"
              style={{ transform: "translateZ(-10px)" }}
            >
              0{activeIndex + 1}
            </div>

            <div className="w-full max-w-full lg:max-w-[640px] mx-auto relative z-10">
              <button
                onClick={handlePrev}
                disabled={activeIndex === 0}
                className="hidden md:flex items-center justify-center w-10 h-10 rounded-full border border-border-default hover:border-accent-teal disabled:opacity-0 disabled:pointer-events-none text-accent-teal bg-card-bg/50 transition-all duration-200 shrink-0 absolute left-[-52px] top-1/2 -translate-y-1/2 z-20 shadow-sm"
                aria-label="Previous milestone"
              >
                <svg className="w-5 h-5 transform rotate-180" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                  <path d="M5 12h14M12 5l7 7-7 7" />
                </svg>
              </button>

              <div
                className="overflow-hidden w-full pointer-events-auto"
                onTouchStart={handleTouchStart}
                onTouchMove={handleTouchMove}
                onTouchEnd={handleTouchEnd}
              >
                <div
                  className="flex items-start transition-transform duration-300 ease-out"
                  style={{ transform: `translate3d(calc(-${activeIndex} * (var(--slide-width) + var(--slide-gap))), 0, 0)` }}
                >
                  {JOURNEY_ITEMS.map((item, idx) => (
                    <JourneyCard
                      key={item.title}
                      item={item}
                      activeIndex={activeIndex}
                      idx={idx}
                      getMilestoneIcon={getMilestoneIcon}
                    />
                  ))}
                </div>
              </div>

              <button
                onClick={handleNext}
                disabled={activeIndex === JOURNEY_ITEMS.length - 1}
                className="hidden md:flex items-center justify-center w-10 h-10 rounded-full border border-border-default hover:border-accent-teal disabled:opacity-0 disabled:pointer-events-none text-accent-teal bg-card-bg/50 transition-all duration-200 shrink-0 absolute right-[-52px] top-1/2 -translate-y-1/2 z-20 shadow-sm"
                aria-label="Next milestone"
              >
                <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                  <path d="M5 12h14M12 5l7 7-7 7" />
                </svg>
              </button>
            </div>

            <div className="flex md:hidden items-center justify-center gap-8 mt-4 shrink-0 relative z-10">
              <button
                onClick={handlePrev}
                disabled={activeIndex === 0}
                className="flex items-center justify-center w-9 h-9 rounded-full border border-border-default hover:border-accent-teal disabled:opacity-0 disabled:pointer-events-none text-accent-teal bg-card-bg/50 transition-all duration-200"
                aria-label="Previous milestone"
              >
                <svg className="w-4 h-4 transform rotate-180" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                  <path d="M5 12h14M12 5l7 7-7 7" />
                </svg>
              </button>
              <button
                onClick={handleNext}
                disabled={activeIndex === JOURNEY_ITEMS.length - 1}
                className="flex items-center justify-center w-9 h-9 rounded-full border border-border-default hover:border-accent-teal disabled:opacity-0 disabled:pointer-events-none text-accent-teal bg-card-bg/50 transition-all duration-200"
                aria-label="Next milestone"
              >
                <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                  <path d="M5 12h14M12 5l7 7-7 7" />
                </svg>
              </button>
            </div>

            <div className="relative w-full max-w-[280px] flex items-center justify-between mx-auto mt-8 mb-2 pointer-events-auto z-10">
              <div className="absolute left-0 right-0 top-1/2 -translate-y-1/2 h-[1px] bg-border-default pointer-events-none" />

              <div
                className="absolute left-0 top-1/2 -translate-y-1/2 h-[1.5px] bg-accent-teal transition-all duration-300 pointer-events-none"
                style={{ width: `${(activeIndex / (JOURNEY_ITEMS.length - 1)) * 100}%` }}
              />

              {JOURNEY_ITEMS.map((item, idx) => (
                <button
                  key={idx}
                  onClick={() => setActiveIndex(idx)}
                  className={`relative z-10 w-3 h-3 rounded-full border transition-all duration-300 ${
                    idx <= activeIndex
                      ? "bg-accent-teal border-accent-teal scale-110 shadow-[0_0_8px_rgba(20,184,166,0.6)]"
                      : "bg-background border-border-default hover:border-accent-teal/55"
                  }`}
                  aria-label={`Go to slide ${idx + 1}`}
                />
              ))}
            </div>

            <div className="font-mono text-[10px] text-muted/40 text-center tracking-widest select-none z-10">
              0{activeIndex + 1} / 0{JOURNEY_ITEMS.length}
            </div>

          </div>
        </div>
      </div>

      <style dangerouslySetInnerHTML={{ __html: `
        #journey {
          --slide-width: 100%;
          --slide-gap: 0px;
        }
        @media (min-width: 768px) {
          #journey {
            --slide-width: 70%;
            --slide-gap: 24px;
          }
        }
        @media (min-width: 1024px) {
          #journey {
            --slide-width: 480px;
            --slide-gap: 24px;
          }
        }
        .journey-card-body::-webkit-scrollbar {
          width: 3px;
        }
        .journey-card-body::-webkit-scrollbar-track {
          background: transparent;
        }
        .journey-card-body::-webkit-scrollbar-thumb {
          background: var(--color-border-default);
          border-radius: 9px;
        }
        .journey-card-body::-webkit-scrollbar-thumb:hover {
          background: var(--color-accent-teal);
        }
        .journey-desc-collapsed {
          display: -webkit-box;
          -webkit-line-clamp: 3;
          -webkit-box-orient: vertical;
          overflow: hidden;
        }
        @keyframes ghost-fade {
          from { opacity: 0; transform: scale(0.97) translateZ(-10px); }
          to { opacity: 1; transform: scale(1) translateZ(-10px); }
        }
        .animate-ghost-fade {
          animation: ghost-fade 300ms cubic-bezier(0.16, 1, 0.3, 1) forwards;
        }
      ` }} />
    </section>
  );
}
