const config = {
  content: [
    "./app/**/*.{js,jsx}",
    "./pages/**/*.{js,jsx}",
    "./components/**/*.{js,jsx}",
  ],
  theme: {
    extend: {
      colors: {
        // REDESIGN.md Section 2 Cool Gradient System
        "accent-blue": "#0EA5E9",
        "accent-teal": "#14B8A6",
        "accent-glow": "#E0F2FE",
        "accent-deep": "#0F766E",
        // Deprecated original amber values (commented out for reference/revert only)
        // "amber-core": "#E8A94D",
        // "amber-light": "#F4C878",
        // "amber-deep": "#B9752E",

        background: "#0A0A0F",
        foreground: "#F5F5F7",
        muted: "#9CA3AF",
        "border-default": "rgba(156, 163, 175, 0.16)",
        "border-active": "rgba(20, 184, 166, 0.4)",
        error: "#EF4444",
        "card-bg": "#111118",
      },
      spacing: {
        "space-1": "4px",
        "space-2": "8px",
        "space-3": "12px",
        "space-4": "16px",
        "space-6": "24px",
        "space-8": "32px",
        "space-12": "48px",
        "space-16": "64px",
        "space-24": "96px",
        "space-32": "128px",
      },
      fontSize: {
        "text-xs": ["12px", "16px"],
        "text-sm": ["14px", "20px"],
        "text-base": ["16px", "24px"],
        "text-lg": ["20px", "28px"],
        "text-xl": ["25px", "32px"],
        "text-2xl": ["31px", "38px"],
        "text-3xl": ["39px", "46px"],
        "text-4xl": ["49px", "56px"],
        "text-5xl": ["61px", "68px"],
        "text-6xl": ["76px", "82px"],
        "text-7xl": ["95px", "100px"],
      },
      borderRadius: {
        "radius-sm": "6px",
        "radius-md": "12px",
        "radius-lg": "16px",
        "radius-xl": "24px",
      },
      boxShadow: {
        "shadow-sm": "0 1px 2px rgba(0,0,0,0.3)",
        "shadow-md": "0 4px 12px rgba(0,0,0,0.4)",
        "shadow-lg": "0 12px 32px rgba(0,0,0,0.5)",
        "glow-accent-sm": "0 0 8px rgba(20, 184, 166, 0.25)",
        // Deprecated amber glow (commented out for reference/revert only)
        // "glow-amber-sm": "0 0 8px rgba(232,169,77,0.25)",
      },
      blur: {
        "blur-card-hover": "4px",
        "blur-modal-backdrop": "8px",
      },
      opacity: {
        "opacity-disabled": "0.4",
        "opacity-muted-bg": "0.06",
        "opacity-muted-bg-active": "0.18",
        "opacity-overlay": "0.6",
      },
      zIndex: {
        "z-base": "0",
        "z-neural-canvas": "1",
        "z-sticky-nav": "100",
        "z-sound-toggle": "100",
        "z-modal-backdrop": "200",
        "z-modal-content": "210",
        "z-toast": "300",
      },
      transitionDuration: {
        "motion-instant": "100ms",
        "motion-fast": "200ms",
        "motion-snap": "400ms",
        "motion-modal": "250ms",
      },
      screens: {
        mobile: "375px",
        tablet: "768px",
        laptop: "1024px",
        desktop: "1280px",
      },
      container: {
        center: true,
        padding: {
          DEFAULT: "24px",
          tablet: "0px",
          laptop: "0px",
          desktop: "0px",
        },
        screens: {
          tablet: "688px",
          laptop: "960px",
          desktop: "1200px",
        },
      },
      fontFamily: {
        sans: ["var(--font-sans)", "system-ui", "sans-serif"],
        clash: [
          "var(--font-clash)",
          "var(--font-sans)",
          "system-ui",
          "sans-serif",
        ],
        serif: ["var(--font-serif)", "Georgia", "serif"],
        mono: ["var(--font-mono)", "monospace"],
      },
    },
  },
  plugins: [],
};

export default config;
