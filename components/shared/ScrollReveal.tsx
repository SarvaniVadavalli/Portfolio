"use client";

import React from "react";

export interface ScrollRevealProps {
  children?: React.ReactNode;
  className?: string;
  type?: string;
  delay?: number | string;
}

export default function ScrollReveal({ children, className = "" }: ScrollRevealProps) {
  return <div className={className}>{children}</div>;
}
