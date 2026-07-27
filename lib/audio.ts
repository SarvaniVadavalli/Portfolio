"use client";

declare global {
  interface Window {
    webkitAudioContext?: typeof AudioContext;
  }
}

// Lazy-initialized shared AudioContext instance
let audioCtx: AudioContext | null = null;
let lastHoverTime = 0;

function getAudioContext(): AudioContext | null {
  if (typeof window === "undefined") return null;

  try {
    if (!audioCtx) {
      const AudioContextClass = window.AudioContext || window.webkitAudioContext;
      if (AudioContextClass) {
        audioCtx = new AudioContextClass();
      }
    }
    if (audioCtx && audioCtx.state === "suspended") {
      audioCtx.resume();
    }
    return audioCtx;
  } catch (err) {
    return null;
  }
}

/**
  Standard Button/Link Click Sci-Fi Blip (~110ms)
  Short, pleasant pitch drop from 600Hz -> 180Hz
 */
export const playSynthClick = (): void => {
  const ctx = getAudioContext();
  if (!ctx) return;

  try {
    const now = ctx.currentTime;
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();

    osc.type = "sine";
    osc.frequency.setValueAtTime(600, now);
    osc.frequency.exponentialRampToValueAtTime(180, now + 0.1);

    gain.gain.setValueAtTime(0.035, now);
    gain.gain.exponentialRampToValueAtTime(0.0001, now + 0.11);

    osc.connect(gain);
    gain.connect(ctx.destination);

    osc.start(now);
    osc.stop(now + 0.115);
  } catch (err) {
    // Fail silently
  }
};

/**
  Theme Toggle Power Switch / Mode Shift Sweep (~200ms)
  Ascending synth sweep 220Hz -> 880Hz
 */
export const playThemeToggleSound = (): void => {
  const ctx = getAudioContext();
  if (!ctx) return;

  try {
    const now = ctx.currentTime;
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();

    osc.type = "triangle";
    osc.frequency.setValueAtTime(220, now);
    osc.frequency.exponentialRampToValueAtTime(880, now + 0.18);

    gain.gain.setValueAtTime(0.045, now);
    gain.gain.exponentialRampToValueAtTime(0.0001, now + 0.2);

    osc.connect(gain);
    gain.connect(ctx.destination);

    osc.start(now);
    osc.stop(now + 0.205);
  } catch (err) {
    // Fail silently
  }
};

/**
  Nav Link Hover Tick (~40ms)
  Subliminal soft tick, debounced with 80ms cooldown, skipped if prefers-reduced-motion
 */
export const playHoverTick = (): void => {
  if (typeof window === "undefined") return;

  // Skip if user prefers reduced motion
  if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

  // 80ms cooldown debounce to prevent rapid-fire audio stacking
  const nowMs = Date.now();
  if (nowMs - lastHoverTime < 80) return;
  lastHoverTime = nowMs;

  const ctx = getAudioContext();
  if (!ctx) return;

  try {
    const now = ctx.currentTime;
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();

    osc.type = "sine";
    osc.frequency.setValueAtTime(950, now);
    osc.frequency.exponentialRampToValueAtTime(300, now + 0.035);

    gain.gain.setValueAtTime(0.008, now);
    gain.gain.exponentialRampToValueAtTime(0.0001, now + 0.04);

    osc.connect(gain);
    gain.connect(ctx.destination);

    osc.start(now);
    osc.stop(now + 0.045);
  } catch (err) {
    // Fail silently
  }
};

/**
  Resume Download Confirm/Success Synth Chime (~220ms)
  Dual-note C5 (523Hz) -> C6 (1046Hz) harmonic arpeggio
 */
export const playResumeChime = (): void => {
  const ctx = getAudioContext();
  if (!ctx) return;

  try {
    const now = ctx.currentTime;
    const osc1 = ctx.createOscillator();
    const osc2 = ctx.createOscillator();
    const gain = ctx.createGain();

    osc1.type = "sine";
    osc1.frequency.setValueAtTime(523.25, now);

    osc2.type = "sine";
    osc2.frequency.setValueAtTime(1046.5, now + 0.07);

    gain.gain.setValueAtTime(0.04, now);
    gain.gain.exponentialRampToValueAtTime(0.0001, now + 0.22);

    osc1.connect(gain);
    osc2.connect(gain);
    gain.connect(ctx.destination);

    osc1.start(now);
    osc1.stop(now + 0.12);

    osc2.start(now + 0.07);
    osc2.stop(now + 0.22);
  } catch (err) {
    // Fail silently
  }
};

/**
  Certification Credential Link Unlock Blip (~150ms)
  Quick double-step pitch blip (440Hz -> 880Hz)
 */
export const playUnlockBlip = (): void => {
  const ctx = getAudioContext();
  if (!ctx) return;

  try {
    const now = ctx.currentTime;
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();

    osc.type = "sine";
    osc.frequency.setValueAtTime(440, now);
    osc.frequency.setValueAtTime(880, now + 0.05);

    gain.gain.setValueAtTime(0.035, now);
    gain.gain.exponentialRampToValueAtTime(0.0001, now + 0.15);

    osc.connect(gain);
    gain.connect(ctx.destination);

    osc.start(now);
    osc.stop(now + 0.155);
  } catch (err) {
    // Fail silently
  }
};

// Legacy alias for backwards compatibility
export const playTick = playHoverTick;
