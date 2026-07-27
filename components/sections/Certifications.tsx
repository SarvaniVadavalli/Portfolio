"use client";

import React, { useEffect, useState, useRef } from "react";

export interface CertificationItem {
  title: string;
  issuer: string;
  date: string;
  credentialUrl: string;
}

export interface StatusItem {
  title: string;
  subtext: string;
}

const CERTIFICATIONS: CertificationItem[] = [
  {
    title: "MongoDB Certified Associate Developer",
    issuer: "MongoDB",
    date: "2025",
    credentialUrl: "https://drive.google.com/file/d/1FPTSwaMGOmLnJ9-PTwd5SJB_L25wFf9h/view?usp=drive_link",
  },
  {
    title: "IBM Introduction to Computer Vision",
    issuer: "IBM (via Coursera)",
    date: "2026",
    credentialUrl: "https://www.coursera.org/account/accomplishments/verify/KUNV0NDU1MM7",
  },
  {
    title: "Natural Language Processing with Classification and Vector Spaces",
    issuer: "DeepLearning.AI (via Coursera)",
    date: "2026",
    credentialUrl: "https://www.coursera.org/account/accomplishments/verify/HNG3Z2YM23OA",
  },
];

const STATUS_ITEMS: StatusItem[] = [
  {
    title: "Machine Learning",
    subtext: "Supervised & unsupervised learning, model training, and evaluation.",
  },
  {
    title: "Full-Stack Development",
    subtext: "Building scalable web applications using the MERN stack.",
  },
  {
    title: "Computer Vision (OpenCV)",
    subtext: "Image processing, feature extraction, and vision-based applications.",
  },
  {
    title: "Data Structures & Algorithms",
    subtext: "Core data structures, algorithms, and optimization techniques.",
  },
  {
    title: "Problem Solving",
    subtext: "Strengthening algorithmic thinking through coding challenges and competitive programming.",
  },
];

const SOCIAL_LINKS = {
  github: "https://github.com/SarvaniVadavalli",
  leetcode: "https://leetcode.com/u/SarvaniVadavalli/",
};

export default function Certifications() {
  const sectionRef = useRef<HTMLElement | null>(null);
  const [inView, setInView] = useState<boolean>(false);

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
      { threshold: 0.05 }
    );

    observer.observe(el);
    return () => {
      observer.disconnect();
      if (resetTimeout) clearTimeout(resetTimeout);
    };
  }, []);

  const getRevealStyle = (index: number): React.CSSProperties => {
    const reducedMotion = typeof window !== "undefined" && window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reducedMotion) return {};
    return {
      opacity: inView ? 1 : 0,
      transform: inView ? "translateY(0)" : "translateY(16px)",
      transition: "opacity 350ms cubic-bezier(0.4, 0, 0.2, 1), transform 350ms cubic-bezier(0.4, 0, 0.2, 1)",
      transitionDelay: `${index * 90}ms`,
      willChange: "opacity, transform",
    };
  };

  return (
    <section
      ref={sectionRef}
      id="certifications"
      aria-label="Certifications and Currently Learning"
      className="w-full min-h-[100dvh] snap-start flex flex-col justify-center border-b border-border-default py-space-12 md:py-space-16 relative"
    >
      <div className="container mx-auto px-space-4 md:px-space-8 flex flex-col gap-space-8">
        <div className="flex flex-col justify-start max-w-[62ch]">
          <div style={getRevealStyle(0)}>
            <span className="text-text-xs font-bold tracking-[0.1em] text-accent-teal uppercase mb-space-4 block">
              CERTIFICATIONS &amp; LEARNING
            </span>
          </div>
          <div style={getRevealStyle(1)}>
            <h2 className="text-text-3xl md:text-text-5xl font-serif font-semibold text-foreground tracking-tight mb-space-6">
              Credentials &amp; Learning.
            </h2>
          </div>
          <div style={getRevealStyle(2)}>
            <p className="text-text-base text-muted font-sans leading-[1.6]">
              I verify my skills through professional certifications and continuous self-guided learning.
              Here is a record of my credentials, active experiments, and where to find my code.
            </p>
          </div>
        </div>

        <div className="w-full flex flex-col lg:flex-row gap-space-6 items-stretch">
          <div className="w-full lg:w-[55%] flex">
            <article className="bg-card-bg border border-border-default hover:border-accent-teal rounded-radius-lg p-space-6 md:p-space-8 shadow-sm flex flex-col justify-between w-full cursor-default select-none text-left transition-all duration-[250ms] ease-in-out">
              <div className="flex flex-col gap-space-4 w-full">
                <div style={getRevealStyle(3)} className="flex items-center gap-space-3 mb-space-2">
                  <svg
                    className="w-5 h-5 text-accent-teal"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="1.8"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    aria-hidden="true"
                  >
                    <path d="M12 15a3 3 0 1 0 0-6 3 3 0 0 0 0 6Z" />
                    <path d="M8.003 14v7l4-2 4 2v-7" />
                    <path d="M20 12c0-4.418-3.582-8-8-8S4 7.582 4 12c0 1.956.702 3.748 1.867 5.13L5 19.5l2.37-.79A7.954 7.954 0 0 0 12 20c4.418 0 8-3.582 8-8Z" />
                  </svg>
                  <span className="text-text-base md:text-text-lg font-bold text-foreground font-sans">
                    Certifications
                  </span>
                </div>

                <div className="flex flex-col gap-space-4 my-space-1">
                  {CERTIFICATIONS.map((cert, idx) => (
                    <div
                      key={cert.title}
                      style={getRevealStyle(4 + idx)}
                      className="p-space-4 bg-background/35 border border-border-default rounded-radius-sm flex flex-col gap-space-2 text-left"
                    >
                      <div className="flex flex-col gap-0.5">
                        <h4 className="text-text-base font-bold text-foreground leading-snug">
                          {cert.title}
                        </h4>
                        <span className="text-text-xs text-muted/75 font-mono">
                          {cert.issuer} • {cert.date}
                        </span>
                      </div>
                      <div>
                        <a
                          href={cert.credentialUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-text-sm text-accent-teal hover:text-accent-teal/80 transition-colors duration-150 inline-flex items-center gap-1 font-mono font-medium"
                        >
                          View credential <span className="text-xs">→</span>
                        </a>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </article>
          </div>

          <div className="w-full lg:w-[45%] flex">
            <article className="bg-card-bg border border-border-default hover:border-accent-teal rounded-radius-lg p-space-6 md:p-space-8 shadow-sm flex flex-col justify-between w-full cursor-default select-none text-left transition-all duration-[250ms] ease-in-out">
              <div className="flex flex-col gap-space-4 w-full">
                <div style={getRevealStyle(7)} className="flex items-center gap-space-3 mb-space-2">
                  <svg
                    className="w-5 h-5 text-accent-teal animate-pulse-slow"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="1.8"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    aria-hidden="true"
                  >
                    <path d="M15 14c.2-1 .7-1.7 1.5-2.5 1-.9 1.5-2.2 1.5-3.5A5 5 0 0 0 8 8c0 1 .3 2.2 1.5 3.5.7.7 1.3 1.5 1.5 2.5" />
                    <path d="M9 18h6" />
                    <path d="M10 22h4" />
                  </svg>
                  <span className="text-text-base md:text-text-lg font-bold text-foreground font-sans">
                    Right now
                  </span>
                </div>

                <div className="flex flex-col gap-space-3 md:gap-[14px] my-space-1">
                  {STATUS_ITEMS.map((item, idx) => (
                    <div key={idx} style={getRevealStyle(8 + idx)} className="flex gap-space-3 items-start py-0.5">
                      <span
                        className="w-2 h-2 rounded-full mt-2 shrink-0 transition-all duration-300 bg-accent-teal shadow-glow-accent-sm animate-pulse-slow"
                      />
                      <div className="flex flex-col gap-0.5">
                        <span className="text-text-base font-normal text-foreground leading-snug">
                          {item.title}
                        </span>
                        <span className="text-text-xs text-muted/75 font-sans leading-relaxed">
                          {item.subtext}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div style={getRevealStyle(13)} className="border-t border-border-default/45 pt-space-4 mt-space-6 flex justify-between items-center text-[11px] text-muted/65 font-mono w-full">
                <span>updated this week</span>
              </div>
            </article>
          </div>
        </div>

        <div style={getRevealStyle(14)} className="w-full">
          <div className="flex justify-center items-center gap-space-4 mt-space-2">
            <a
              href={SOCIAL_LINKS.github}
              target="_blank"
              rel="noopener noreferrer"
              className="px-space-5 py-space-2 bg-transparent border border-border-default hover:border-accent-teal text-muted hover:text-foreground rounded-full text-text-sm font-mono font-medium transition-all duration-200 flex items-center gap-2"
            >
              <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24" aria-hidden="true">
                <path fillRule="evenodd" clipRule="evenodd" d="M12 2C6.477 2 2 6.477 2 12c0 4.42 2.865 8.167 6.839 9.49.5.092.682-.217.682-.482 0-.237-.008-.866-.013-1.7-2.782.603-3.369-1.34-3.369-1.34-.454-1.156-1.11-1.464-1.11-1.464-.908-.62.069-.608.069-.608 1.003.07 1.531 1.03 1.531 1.03.892 1.529 2.341 1.087 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.11-4.555-4.943 0-1.091.39-1.984 1.029-2.683-.103-.253-.446-1.27.098-2.647 0 0 .84-.269 2.75 1.025A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.294 2.747-1.025 2.747-1.025.546 1.377.203 2.394.1 2.647.64.699 1.028 1.592 1.028 2.683 0 3.842-2.339 4.687-4.566 4.935.359.309.678.919.678 1.852 0 1.336-.012 2.415-.012 2.743 0 .267.18.577.688.479C19.138 20.164 22 16.418 22 12c0-5.523-4.477-10-10-10z" />
              </svg>
              GitHub
            </a>
            <a
              href={SOCIAL_LINKS.leetcode}
              target="_blank"
              rel="noopener noreferrer"
              className="px-space-5 py-space-2 bg-transparent border border-border-default hover:border-accent-teal text-muted hover:text-foreground rounded-full text-text-sm font-mono font-medium transition-all duration-200 flex items-center gap-2"
            >
              <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24" aria-hidden="true">
                <path d="M13.483 0a1.374 1.374 0 0 0-.961.414l-9.77 9.77a1.375 1.375 0 0 0 0 1.945l1.9 1.9a1.375 1.375 0 0 0 1.945 0L16.48 4.31a1.375 1.375 0 0 0 0-1.945l-1.9-1.9A1.374 1.374 0 0 0 13.483 0zm-5.116 11.583a1.375 1.375 0 0 0-1.945 0L1.414 16.59a1.375 1.375 0 0 0 0 1.945l1.9 1.9a1.375 1.375 0 0 0 1.945 0l5.108-5.11a1.375 1.375 0 0 0 0-1.945zm6.549 1.375a1.375 1.375 0 0 0-1.945 0l-5.11 5.108a1.375 1.375 0 0 0 0 1.945l1.9 1.9a1.375 1.375 0 0 0 1.945 0l5.11-5.108a1.375 1.375 0 0 0 0-1.945z" />
              </svg>
              LeetCode
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}
