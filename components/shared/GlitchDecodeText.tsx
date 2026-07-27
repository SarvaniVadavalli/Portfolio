"use client";

import React, { useEffect, useState, useRef } from "react";

const CHARS = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789!@#$%^&*()_+-=[]{}|;:,.<>/?";

export interface GlitchDecodeTextProps {
  text?: string;
  trigger?: boolean;
}

export default function GlitchDecodeText({
  text = "IDEAS ARE CHEAP. EXECUTION ISN'T.",
  trigger = false,
}: GlitchDecodeTextProps) {
  const [displayText, setDisplayText] = useState<string[]>([]);
  const [resolvedIndices, setResolvedIndices] = useState<Set<number>>(new Set());

  const textLength = text.length;
  const animationRef = useRef<number | null>(null);
  const shuffledIndicesRef = useRef<number[]>([]);
  const startTimeRef = useRef<number | null>(null);
  const duration = 1000; // 1 second reveal time

  const shuffle = (array: number[]): number[] => {
    const copy = [...array];
    for (let i = copy.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [copy[i], copy[j]] = [copy[j], copy[i]];
    }
    return copy;
  };

  useEffect(() => {
    if (trigger) {
      // 1. Initialize shuffled indices for non-space characters
      const nonSpaceIndices: number[] = [];
      for (let i = 0; i < textLength; i++) {
        if (text[i] !== " ") {
          nonSpaceIndices.push(i);
        }
      }
      shuffledIndicesRef.current = shuffle(nonSpaceIndices);

      // 2. Start animation loop
      startTimeRef.current = null;
      setResolvedIndices(new Set());

      const animate = (timestamp: number) => {
        if (!startTimeRef.current) startTimeRef.current = timestamp;
        const elapsed = timestamp - startTimeRef.current;
        const progress = Math.min(elapsed / duration, 1);

        const numToResolve = Math.floor(progress * nonSpaceIndices.length);
        const newResolved = new Set<number>();

        for (let i = 0; i < numToResolve; i++) {
          newResolved.add(shuffledIndicesRef.current[i]);
        }
        setResolvedIndices(newResolved);

        const currentChars: string[] = [];
        for (let i = 0; i < textLength; i++) {
          if (text[i] === " ") {
            currentChars.push(" ");
          } else if (newResolved.has(i) || progress === 1) {
            currentChars.push(text[i]);
          } else {
            const randomChar = CHARS[Math.floor(Math.random() * CHARS.length)];
            currentChars.push(randomChar);
          }
        }
        setDisplayText(currentChars);

        if (progress < 1) {
          animationRef.current = requestAnimationFrame(animate);
        }
      };

      animationRef.current = requestAnimationFrame(animate);
    } else {
      if (animationRef.current !== null) {
        cancelAnimationFrame(animationRef.current);
      }

      // Scrambled initial state when trigger is false (out of view)
      const initialScrambled: string[] = [];
      for (let i = 0; i < textLength; i++) {
        if (text[i] === " ") {
          initialScrambled.push(" ");
        } else {
          initialScrambled.push(CHARS[Math.floor(Math.random() * CHARS.length)]);
        }
      }
      setDisplayText(initialScrambled);
      setResolvedIndices(new Set());
    }

    return () => {
      if (animationRef.current !== null) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, [trigger, text, textLength]);

  return (
    <div
      className="w-full flex items-center justify-center font-mono text-[18px] sm:text-[20px] md:text-[25px] font-bold tracking-[0.09em] h-[72px] md:h-[88px] border-t border-b border-border-default/10 bg-transparent py-4 select-none pointer-events-none"
      aria-hidden="true"
    >
      <div className="flex items-center justify-center">
        {displayText.map((char, index) => {
          const isSpace = char === " ";
          const isResolved = resolvedIndices.has(index);

          if (isSpace) {
            return (
              <span key={index} className="w-[1ch] inline-block">
                &nbsp;
              </span>
            );
          }

          return (
            <span
              key={index}
              className={isResolved ? "resolved-char" : "scrambling-char"}
            >
              {char}
            </span>
          );
        })}
      </div>

      <style
        dangerouslySetInnerHTML={{
          __html: `
        .resolved-char {
          background: linear-gradient(135deg, #14B8A6, #0EA5E9);
          -webkit-background-clip: text;
          background-clip: text;
          -webkit-text-fill-color: transparent;
          color: transparent;
          filter: drop-shadow(0 0 6px rgba(224, 242, 254, 0.25));
          display: inline-block;
          animation: character-lock 150ms ease-out;
        }
        .scrambling-char {
          color: rgba(245, 245, 247, 0.4);
          display: inline-block;
        }
        @keyframes character-lock {
          0% {
            transform: scale(1.2);
            filter: drop-shadow(0 0 12px rgba(224, 242, 254, 0.8));
          }
          100% {
            transform: scale(1);
            filter: drop-shadow(0 0 6px rgba(224, 242, 254, 0.25));
          }
        }
      `,
        }}
      />
    </div>
  );
}
