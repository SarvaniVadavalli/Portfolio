import React from "react";
import use3DTilt from "@/lib/hooks/use3DTilt";

export interface ProjectCardProps {
  title: string;
  description: string;
  technologies: string[];
  index?: number;
  onClick: () => void;
}

export default function ProjectCard({
  title,
  description,
  technologies,
  index,
  onClick,
}: ProjectCardProps) {
  const cardRef = use3DTilt<HTMLElement>({ maxRotation: 6, hoverLift: "-3px" });

  const handleKeyDown = (e: React.KeyboardEvent<HTMLElement>) => {
    if (e.key === "Enter" || e.key === " ") {
      e.preventDefault();
      onClick();
    }
  };

  return (
    <div style={{ perspective: "1000px" }} className="w-full h-full">
      <article
        ref={cardRef}
        onClick={onClick}
        onKeyDown={handleKeyDown}
        tabIndex={0}
        className="bg-card-bg border border-border-default hover:border-accent-teal focus:border-accent-teal rounded-radius-lg p-space-8 shadow-sm flex flex-col gap-space-6 hover:-translate-y-[3px] focus:-translate-y-[3px] transition-all duration-200 ease-in-out cursor-pointer select-none text-left focus:outline-none focus:ring-2 focus:ring-accent-teal h-full"
        style={{ transformStyle: "preserve-3d" }}
      >
        <div className="flex flex-col gap-space-3 relative" style={{ transform: "translateZ(12px)" }}>
          {index !== undefined && (
            <span className="absolute top-0 right-0 text-text-xs font-mono font-bold text-accent-teal/70 select-none pointer-events-none">
              {String(index + 1).padStart(2, "0")}
            </span>
          )}
          <h3 className="text-text-xl font-bold text-foreground font-sans pr-8">
            {title}
          </h3>
          <p className="text-text-base text-foreground/80 leading-[1.6]">
            {description}
          </p>
        </div>

        {/* Technology Badges */}
        <div className="flex flex-wrap gap-space-2" style={{ transform: "translateZ(18px)" }}>
          {technologies.map((tech) => (
            <span
              key={tech}
              className="px-space-3 py-space-1 bg-background border border-border-default hover:border-accent-teal rounded-radius-sm text-text-xs text-muted cursor-default select-none transition-colors duration-100 ease-in-out"
            >
              {tech}
            </span>
          ))}
        </div>

        {/* Action Button */}
        <div className="flex justify-center mt-auto" style={{ transform: "translateZ(24px)" }}>
          <button
            type="button"
            onClick={(e: React.MouseEvent<HTMLButtonElement>) => {
              e.stopPropagation();
              onClick();
            }}
            className="px-space-6 py-space-2 bg-transparent border border-border-default hover:border-accent-teal hover:text-accent-teal text-foreground font-medium rounded-radius-sm text-text-sm focus:outline-none focus:ring-2 focus:ring-accent-teal transition-colors duration-100 ease-in-out cursor-pointer w-full sm:w-auto"
          >
            View Case Study
          </button>
        </div>
      </article>
    </div>
  );
}
