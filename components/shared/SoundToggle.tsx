"use client";

import React, { useState, useEffect } from "react";
import { playTick } from "../../lib/audio";

export interface SoundToggleProps {
  isHero?: boolean;
}

export default function SoundToggle({ isHero = false }: SoundToggleProps) {
  const [isEnabled, setIsEnabled] = useState<boolean>(false);

  useEffect(() => {
    // Sound is strictly opt-in and off by default
    const stored = localStorage.getItem("sound_enabled") === "true";
    setIsEnabled(stored);
  }, []);

  const toggleSound = (): void => {
    const nextState = !isEnabled;
    setIsEnabled(nextState);
    localStorage.setItem("sound_enabled", String(nextState));

    // Instantly play a procedural feedback tick if enabled (with minor debounce)
    if (nextState) {
      setTimeout(() => {
        playTick();
      }, 50);
    }
  };

  return (
    <div className="flex items-center gap-x-2 select-none">
      <button
        onClick={toggleSound}
        type="button"
        aria-label={isEnabled ? "Mute sounds" : "Unmute sounds"}
        className="relative flex items-center h-[18px] w-8 rounded-full bg-[#16161a] border border-[#2e2e34]/70 transition-colors duration-200 focus:outline-none focus:ring-1 hover:border-accent-teal focus:ring-accent-teal active:scale-[0.98] cursor-pointer"
      >
        <span
          className={`absolute h-2.5 w-2.5 rounded-full transition-all duration-200 ease-in-out ${
            isEnabled
              ? "left-[16px] bg-accent-teal shadow-[0_0_6px_rgba(20,184,166,0.4)]"
              : "left-[4px] bg-[#5e5e64]"
          }`}
        />
      </button>
    </div>
  );
}
