"use client";

import React, { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

export interface Project {
  title: string;
  description: string;
  technologies: string[];
  problem: string;
  solution: string;
  motivation: string;
  architecture: string;
  challenges: string;
  keyDecisions: string;
  results: string;
  lessonsLearned: string;
  github: string;
}

export interface ProjectModalProps {
  project: Project | null;
  isOpen: boolean;
  onClose: () => void;
}

export default function ProjectModal({ project, isOpen, onClose }: ProjectModalProps) {
  const [reducedMotion, setReducedMotion] = useState<boolean>(false);

  useEffect(() => {
    if (typeof window === "undefined") return;
    const mediaQuery = window.matchMedia("(prefers-reduced-motion: reduce)");
    setReducedMotion(mediaQuery.matches);
    const handler = (e: MediaQueryListEvent) => setReducedMotion(e.matches);
    mediaQuery.addEventListener("change", handler);
    return () => mediaQuery.removeEventListener("change", handler);
  }, []);

  useEffect(() => {
    if (!isOpen) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", handleKeyDown);

    // Prevent body scrolling
    const main = document.querySelector("main");
    if (main) {
      main.style.overflow = "hidden";
    }

    return () => {
      window.removeEventListener("keydown", handleKeyDown);
      if (main) {
        main.style.overflow = "";
      }
    };
  }, [isOpen, onClose]);

  return (
    <AnimatePresence>
      {isOpen && project && (
        <div className="fixed inset-0 z-[200] flex items-center justify-center p-space-4 md:p-space-8">
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: reducedMotion ? 0.1 : 0.25, ease: "easeInOut" }}
            style={{
              backdropFilter: reducedMotion ? "none" : "blur(8px)",
              WebkitBackdropFilter: reducedMotion ? "none" : "blur(8px)",
            }}
            className="absolute inset-0 bg-background/60"
            onClick={onClose}
            aria-hidden="true"
          />

          {/* Modal Container */}
          <motion.div
            role="dialog"
            aria-modal="true"
            aria-labelledby="modal-title"
            initial={reducedMotion ? { opacity: 0 } : { opacity: 0, scale: 0.96 }}
            animate={reducedMotion ? { opacity: 1 } : { opacity: 1, scale: 1 }}
            exit={reducedMotion ? { opacity: 0 } : { opacity: 0, scale: 0.96 }}
            transition={{ duration: reducedMotion ? 0.1 : 0.25, ease: "easeOut" }}
            className="relative w-full max-w-[760px] max-h-[85vh] overflow-y-auto bg-card-bg border border-border-default rounded-radius-xl p-space-6 md:p-space-8 shadow-lg z-[210] scrollbar-thin text-left"
          >
            {/* Header */}
            <div className="flex items-start justify-between border-b border-border-default/45 pb-space-4 mb-space-6">
              <div>
                <h2
                  id="modal-title"
                  className="text-text-2xl font-bold text-foreground font-sans"
                >
                  {project.title}
                </h2>
                <div className="text-text-xs text-accent-teal/80 font-mono mt-space-1 tracking-wider uppercase font-semibold">
                  Case Study
                </div>
              </div>
              <button
                onClick={onClose}
                className="p-space-2 text-muted hover:text-foreground hover:bg-border-default/20 rounded-radius-sm transition-colors duration-100 cursor-pointer focus:outline-none focus:ring-2 focus:ring-accent-teal"
                aria-label="Close Case Study"
              >
                <svg
                  className="w-5 h-5"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1.5"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M6 18L18 6M6 6l12 12"
                  />
                </svg>
              </button>
            </div>

            {/* Content sections */}
            <div className="flex flex-col gap-space-6 text-left">
              {/* Emphasized Problem & Solution */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-space-4">
                <div className="bg-accent-teal/[0.03] border border-accent-teal/20 rounded-radius-md p-space-4 flex flex-col gap-space-2">
                  <span className="text-text-xs font-bold text-accent-teal font-mono tracking-wider uppercase">
                    Problem
                  </span>
                  <p className="text-text-sm text-foreground/95 leading-[1.6]">
                    {project.problem}
                  </p>
                </div>
                <div className="bg-accent-teal/[0.03] border border-accent-teal/20 rounded-radius-md p-space-4 flex flex-col gap-space-2">
                  <span className="text-text-xs font-bold text-accent-teal font-mono tracking-wider uppercase">
                    Solution
                  </span>
                  <p className="text-text-sm text-foreground/95 leading-[1.6]">
                    {project.solution}
                  </p>
                </div>
              </div>

              <div className="h-[1px] bg-border-default/45" />

              {/* Detailed Narrative grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-space-6 text-text-sm">
                <div className="flex flex-col gap-space-1">
                  <h4 className="font-bold text-foreground font-sans">
                    Motivation
                  </h4>
                  <p className="text-foreground/80 leading-[1.6]">
                    {project.motivation}
                  </p>
                </div>

                <div className="flex flex-col gap-space-1">
                  <h4 className="font-bold text-foreground font-sans">
                    Architecture
                  </h4>
                  <p className="text-foreground/80 leading-[1.6]">
                    {project.architecture}
                  </p>
                </div>

                <div className="flex flex-col gap-space-1">
                  <h4 className="font-bold text-foreground font-sans">
                    Challenges
                  </h4>
                  <p className="text-foreground/80 leading-[1.6]">
                    {project.challenges}
                  </p>
                </div>

                <div className="flex flex-col gap-space-1">
                  <h4 className="font-bold text-foreground font-sans">
                    Key Decision
                  </h4>
                  <p className="text-foreground/80 leading-[1.6]">
                    {project.keyDecisions}
                  </p>
                </div>

                <div className="flex flex-col gap-space-1">
                  <h4 className="font-bold text-foreground font-sans">Results</h4>
                  <p className="text-foreground/80 leading-[1.6]">
                    {project.results}
                  </p>
                </div>

                <div className="flex flex-col gap-space-1">
                  <h4 className="font-bold text-foreground font-sans">
                    Lessons Learned
                  </h4>
                  <p className="text-foreground/80 leading-[1.6]">
                    {project.lessonsLearned}
                  </p>
                </div>
              </div>

              <div className="h-[1px] bg-border-default/45" />

              {/* Technologies Tag List */}
              <div className="flex flex-col gap-space-2">
                <h4 className="text-text-sm font-bold text-foreground font-sans">
                  Technologies Used
                </h4>
                <div className="flex flex-wrap gap-space-2">
                  {project.technologies.map((tech) => (
                    <span
                      key={tech}
                      className="px-space-3 py-space-1 bg-background border border-border-default rounded-radius-sm text-text-xs text-muted font-mono"
                    >
                      {tech}
                    </span>
                  ))}
                </div>
              </div>

              {/* Links Section */}
              <div className="flex items-center justify-between border-t border-border-default/45 pt-space-6 mt-space-2">
                <span className="text-text-xs text-muted font-sans font-medium">
                  Source code available on GitHub
                </span>
                <a
                  href={project.github}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-space-6 py-space-2 bg-transparent border border-border-default hover:border-accent-teal hover:text-accent-teal text-foreground font-medium rounded-radius-sm text-text-sm focus:outline-none focus:ring-2 focus:ring-accent-teal focus:ring-offset-2 transition-colors duration-100 ease-in-out cursor-pointer inline-flex items-center justify-center text-center"
                >
                  Repository
                </a>
              </div>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
