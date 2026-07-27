"use client";

import React, { useState, useEffect, useRef } from "react";
import { useScroll, useTransform, motion, MotionValue } from "framer-motion";
import ProjectCard from "../projects/ProjectCard";
import ProjectModal, { Project } from "../projects/ProjectModal";
import ScrollReveal from "../shared/ScrollReveal";

const cubicBezier = (x1: number, y1: number, x2: number, y2: number) => {
  return (x: number): number => {
    if (x === 0 || x === 1) return x;
    let t = x;
    for (let i = 0; i < 8; i++) {
      const currentX = 3 * (1 - t) * (1 - t) * t * x1 + 3 * (1 - t) * t * t * x2 + t * t * t;
      const currentSlope = 3 * (1 - t) * (1 - t) * x1 + 6 * (1 - t) * t * (x2 - x1) + 3 * t * t * (1 - x2);
      if (Math.abs(currentSlope) < 1e-6) break;
      t -= (currentX - x) / currentSlope;
    }
    return 3 * (1 - t) * (1 - t) * t * y1 + 3 * (1 - t) * t * t * y2 + t * t * t;
  };
};

const standardEase = cubicBezier(0.4, 0, 0.2, 1);

export interface CardWrapperProps {
  project: Project;
  index: number;
  totalCards: number;
  scrollYProgress: MotionValue<number>;
  reducedMotion: boolean;
  onClick: () => void;
}

function CardWrapper({ project, index, totalCards, scrollYProgress, reducedMotion, onClick }: CardWrapperProps) {
  const targetScale = 1 - (totalCards - 1 - index) * 0.03;
  const start = index / totalCards;

  const scale = useTransform(
    scrollYProgress,
    [start, 1],
    [1, targetScale],
    { ease: standardEase }
  );

  const cardScale = reducedMotion ? 1 : scale;

  return (
    <motion.div
      style={{
        scale: cardScale,
        top: `calc(var(--sticky-top) + ${index * 24}px)`,
        zIndex: index + 10,
      }}
      className="sticky h-[45vh] w-full flex items-start justify-center origin-top top-[var(--sticky-top)] [--sticky-top:96px] md:[--sticky-top:128px]"
    >
      <ProjectCard
        title={project.title}
        description={project.description}
        technologies={project.technologies}
        index={index}
        onClick={onClick}
      />
    </motion.div>
  );
}

const PROJECTS: Project[] = [
  {
    title: "UniMeet",
    description:
      "A full-stack university collaboration and faculty appointment platform that simplifies scheduling and communication across academic departments.",
    technologies: ["React", "Node.js", "Express", "MongoDB", "Tailwind CSS"],
    github: "https://github.com/SarvaniVadavalli/UniMeet",
    problem:
      "Scheduling appointments between students and university faculty is plagued by back-and-forth emails, calendar mismatches, and fragmented communication tools.",
    motivation:
      "Aimed to solve real-world scheduling friction I observed daily at my university using full-stack web technologies.",
    solution:
      "An appointment scheduling system with live availability sync, automated email confirmations, and collaborative dashboards for faculty and students.",
    architecture:
      "React frontend, Node.js, Express, MongoDB, and integration with calendar synchronization endpoints.",
    challenges:
      "Syncing real-time changes to faculty calendars without conflicts.",
    keyDecisions:
      "Utilized MongoDB transaction locks during the booking window to prevent double-booking on simultaneous clicks.",
    results:
      "Booked 200+ simulated appointments with zero scheduling conflicts; simplified faculty dashboard navigation.",
    lessonsLearned:
      "Handling concurrency is complex; testing database race conditions early in application design prevents critical scheduling bugs.",
  },
  {
    title: "Deepfake Image Detection",
    description:
      "An AI-powered computer vision application that detects manipulated images using deep learning, TensorFlow, and OpenCV.",
    technologies: ["Python", "TensorFlow", "OpenCV", "NumPy"],
    github: "https://github.com/SarvaniVadavalli/Deep-Fake-Project",
    problem:
      "The rapid rise of realistic generative image models makes it incredibly easy to spread misinformation, making fast, reliable detection of manipulated media a critical security gap.",
    motivation:
      "Driven by curiosity about generative adversarial networks (GANs) and how computer vision can protect digital media integrity.",
    solution:
      "A deep learning pipeline that extracts frequency-domain features from uploaded images to detect artifacts left by generative models.",
    architecture:
      "Python-based pipeline using TensorFlow for model inference and OpenCV for image preprocessing and visualization.",
    challenges:
      "Detecting deepfakes across a wide variety of compressed formats that destroy high-frequency artifacts.",
    keyDecisions:
      "Leveraged error level analysis (ELA) preprocessing to highlight compression differences prior to feeding the images to the convolutional neural network.",
    results:
      "Achieved 94.2% test accuracy on public deepfake datasets; processed inference within 120ms.",
    lessonsLearned:
      "Generalization is hard; models trained on one GAN dataset frequently fail on newer diffusion-based generators.",
  },
  {
    title: "Hospital Management System",
    description:
      "A MySQL-based relational database project designed to manage core hospital operations, normalize schemas, and coordinate medical workflows.",
    technologies: ["MySQL", "SQL"],
    github: "https://github.com/SarvaniVadavalli/DBMS-Hospital-Management",
    problem:
      "Hospital record management often suffers from data redundancy, inconsistent staff scheduling, and billing errors when built on un-normalized flat storage systems.",
    motivation:
      "I wanted to design a robust relational schema from the ground up, applying E-R modeling, mapping constraints, and database normalization rules up to 3NF/BCNF.",
    solution:
      "A normalized MySQL database that registers patients, structures doctor and nurse staff hierarchies, schedules conflict-free appointments, manages multi-medicine prescriptions, and automates billing.",
    architecture:
      "Relational database architecture built on MySQL. Leverages structured foreign key relations, constraints, and views to automate operations like bed allocation and billing.",
    challenges:
      "Ensuring referential integrity and preventing data anomalies across overlapping tables for staff roles, doctor appointments, and prescription details.",
    keyDecisions:
      "Deconstructed unified patient and booking schemas into normalized 3NF tables, utilizing SQL triggers to auto-verify bed availability before finalizing patient admissions.",
    results:
      "Achieved zero data redundancies across the schema; optimized query execution plan speeds for multi-table joins on appointments and patient billing records.",
    lessonsLearned:
      "A clean relational schema design is the foundation of secure and clean application logic; handling constraints at the database engine level simplifies application code.",
  },
];

export default function Projects() {
  const [activeProject, setActiveProject] = useState<Project | null>(null);
  const [modalOpen, setModalOpen] = useState<boolean>(false);
  const [reducedMotion, setReducedMotion] = useState<boolean>(false);
  const [, setMounted] = useState<boolean>(false);

  const containerRef = useRef<HTMLDivElement | null>(null);
  const mainRef = useRef<HTMLElement | null>(null);

  useEffect(() => {
    mainRef.current = document.querySelector("main");
    setMounted(true);
  }, []);

  useEffect(() => {
    const mediaQuery = window.matchMedia("(prefers-reduced-motion: reduce)");
    setReducedMotion(mediaQuery.matches);
    const listener = (e: MediaQueryListEvent) => setReducedMotion(e.matches);
    mediaQuery.addEventListener("change", listener);
    return () => mediaQuery.removeEventListener("change", listener);
  }, []);

  const { scrollYProgress } = useScroll({
    container: mainRef,
    target: containerRef,
    offset: ["start start", "end end"],
  });

  const handleOpenModal = (project: Project) => {
    setActiveProject(project);
    setModalOpen(true);
  };

  const handleCloseModal = () => {
    setModalOpen(false);
  };

  return (
    <section
      id="projects"
      aria-label="Featured Projects"
      className="w-full min-h-[100dvh] snap-start flex flex-col justify-center border-b border-border-default py-space-12 md:py-space-16 relative"
    >
      <div className="container mx-auto px-space-4 md:px-space-8">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-space-8 items-start">
          <div className="col-span-1 md:col-span-6 lg:col-span-5 flex flex-col justify-start mb-space-8 md:mb-0 md:sticky md:top-32">
            <ScrollReveal delay="0">
              <span className="text-text-xs font-bold tracking-[0.1em] text-accent-teal uppercase mb-space-4 block">
                PROJECTS
              </span>
            </ScrollReveal>
            <ScrollReveal delay="120">
              <h2 className="text-text-3xl md:text-text-5xl font-serif font-semibold text-foreground tracking-tight mb-space-6">
                Featured Projects.
              </h2>
            </ScrollReveal>
            <ScrollReveal delay="220">
              <p className="text-text-base text-foreground/80 leading-[1.6] max-w-[62ch] font-medium">
                Selected AI and software products built to solve real-world
                problems through thoughtful engineering.
              </p>
            </ScrollReveal>
          </div>

          <div
            ref={containerRef}
            className="col-span-1 md:col-span-6 lg:col-span-7 flex flex-col gap-space-12 relative"
          >
            {PROJECTS.map((project, index) => (
              <CardWrapper
                key={project.title}
                project={project}
                index={index}
                totalCards={PROJECTS.length}
                scrollYProgress={scrollYProgress}
                reducedMotion={reducedMotion}
                onClick={() => handleOpenModal(project)}
              />
            ))}
          </div>
        </div>
      </div>

      <ProjectModal
        project={activeProject}
        isOpen={modalOpen}
        onClose={handleCloseModal}
      />
    </section>
  );
}
