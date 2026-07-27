"use client";

import { useEffect } from "react";
import {
  playSynthClick,
  playThemeToggleSound,
  playHoverTick,
  playResumeChime,
  playUnlockBlip,
} from "../../lib/audio";

export default function SciFiAudioProvider() {
  useEffect(() => {
    if (typeof window === "undefined") return;

    // Global Click Listener for All Interactive Elements
    const handleGlobalClick = (e: MouseEvent) => {
      const target = (e.target as HTMLElement)?.closest(
        'button, a, [role="button"], input[type="button"], input[type="submit"], summary'
      ) as HTMLElement | null;

      if (!target) return;

      const href = (target as HTMLAnchorElement).href || "";
      const text = (target.textContent || "").toLowerCase();
      const ariaLabel = (target.getAttribute("aria-label") || "").toLowerCase();

      // 1. Theme Toggle (Power Switch / Mode Shift Sweep)
      if (
        ariaLabel.includes("theme") ||
        ariaLabel.includes("dark") ||
        ariaLabel.includes("light") ||
        target.dataset.themeToggle !== undefined
      ) {
        playThemeToggleSound();
        return;
      }

      // 2. Resume Download Button (Confirm / Success Chime)
      if (
        href.includes("resume") ||
        text.includes("resume") ||
        ariaLabel.includes("resume")
      ) {
        playResumeChime();
        return;
      }

      // 3. Credential / Certificate Links (Unlock Blip)
      if (
        text.includes("credential") ||
        text.includes("certificate") ||
        ariaLabel.includes("credential") ||
        href.includes("coursera") ||
        href.includes("credential")
      ) {
        playUnlockBlip();
        return;
      }

      // 4. Default for all other Buttons and Links (Short Synth Blip)
      playSynthClick();
    };

    // Global Mouseover Listener for Nav Link Hover Ticks
    const handleGlobalMouseOver = (e: MouseEvent) => {
      const navLink = (e.target as HTMLElement)?.closest(
        'nav a, header a, [data-nav-link], .nav-item'
      );

      if (navLink) {
        playHoverTick();
      }
    };

    window.addEventListener("click", handleGlobalClick, { capture: true, passive: true });
    window.addEventListener("mouseover", handleGlobalMouseOver, { capture: true, passive: true });

    return () => {
      window.removeEventListener("click", handleGlobalClick, { capture: true });
      window.removeEventListener("mouseover", handleGlobalMouseOver, { capture: true });
    };
  }, []);

  return null;
}
