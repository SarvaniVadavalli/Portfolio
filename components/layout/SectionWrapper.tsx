import React from "react";

export interface SectionWrapperProps {
  id: string;
  title: string;
}

export default function SectionWrapper({ id, title }: SectionWrapperProps) {
  return (
    <section
      id={id}
      className="w-full min-h-[100dvh] snap-start flex flex-col justify-center items-center border border-dashed border-border-default py-space-16 md:py-space-24"
    >
      <div className="container mx-auto flex flex-col items-center justify-center text-center px-space-6 tablet:px-0">
        <h2 className="text-text-3xl font-semibold text-foreground mb-space-4">
          {title}
        </h2>
        <p className="text-text-base text-muted">
          Placeholder section for ID:{" "}
          <code className="bg-card-bg px-space-2 py-space-1 rounded-radius-sm text-accent-teal">
            {id}
          </code>
        </p>
      </div>
    </section>
  );
}
