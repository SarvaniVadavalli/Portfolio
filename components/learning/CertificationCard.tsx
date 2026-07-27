import React from "react";

export interface CertificationCardProps {
  title: string;
  issuer: string;
  subtitle: string;
  description: string;
  credentialUrl: string;
}

export default function CertificationCard({
  title,
  issuer,
  subtitle,
  description,
  credentialUrl,
}: CertificationCardProps) {
  return (
    <article className="bg-card-bg border border-border-default hover:border-amber-core rounded-radius-lg p-space-6 shadow-sm flex flex-col gap-space-4 transition-colors duration-100 ease-in-out text-left cursor-default select-none group">
      <div className="flex flex-col gap-space-2">
        <div className="flex flex-col gap-space-1">
          <span className="text-text-xs font-semibold text-amber-core uppercase tracking-wider block">
            {issuer}
          </span>
          <h4 className="text-text-xl md:text-text-2xl font-bold text-foreground font-sans">
            <span className="relative inline-block pb-[2px]">
              {title}
              <span className="absolute left-0 bottom-0 w-full h-[1.5px] bg-amber-core origin-left scale-x-0 group-hover:scale-x-100 transition-transform duration-150 ease-in-out" />
            </span>
          </h4>
          <span className="text-text-xs text-muted font-sans font-medium block">
            {subtitle}
          </span>
        </div>
        <p className="text-text-base text-foreground/80 leading-[1.6]">
          {description}
        </p>
      </div>

      <div className="flex justify-start mt-auto">
        <a
          href={credentialUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="px-space-6 py-space-2 bg-transparent border border-border-default hover:border-amber-core hover:text-amber-core text-foreground font-semibold rounded-radius-sm text-text-sm focus:outline-none focus:ring-2 focus:ring-amber-core focus:ring-offset-2 inline-flex items-center justify-center text-center cursor-pointer w-full sm:w-auto active:scale-[0.98] transition-all duration-100 ease-in-out"
        >
          View Credential
        </a>
      </div>
    </article>
  );
}
