/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    // ─── ADLER NOIR Design System ─────────────────────────────────────
    extend: {
      colors: {
        // True Black OLED base
        noir: {
          0: "#000000",     // Tier 1 — OLED background
          1: "#09090b",     // Tier 2 — Card/module surface
          2: "#18181b",     // Tier 3 — Popovers/modals
          3: "#27272a",     // Borders / dividers
          4: "#3f3f46",     // Subtle separators
          5: "#52525b",     // Disabled / muted
          6: "#71717a",     // Secondary text
          7: "#a1a1aa",     // Tertiary / icon default
          8: "#d4d4d8",     // Body text
          9: "#fafafa",     // Primary text
        },
        // Accent — Electric Blue (subtle glow)
        accent: {
          DEFAULT: "#3b82f6",
          50: "rgba(59,130,246,0.06)",
          100: "rgba(59,130,246,0.10)",
          200: "rgba(59,130,246,0.20)",
          300: "rgba(59,130,246,0.40)",
        },
        // Alert — Amber (system alerts only)
        alert: {
          DEFAULT: "#f59e0b",
          glow: "rgba(245,158,11,0.15)",
        },
        // Success
        success: {
          DEFAULT: "#22c55e",
          glow: "rgba(34,197,94,0.12)",
        },
      },

      // ─── Typography ─────────────────────────────────────────────────
      fontFamily: {
        sans: [
          "Inter",
          "-apple-system",
          "BlinkMacSystemFont",
          "'Helvetica Neue'",
          "Arial",
          "sans-serif",
        ],
        mono: [
          "'JetBrains Mono'",
          "'Fira Code'",
          "'Cascadia Code'",
          "monospace",
        ],
      },
      fontSize: {
        "2xs": ["0.625rem", { lineHeight: "0.875rem" }],
      },
      letterSpacing: {
        tightest: "-0.03em",
        tight: "-0.02em",
        wide: "0.02em",
      },

      // ─── Border Radius ───────────────────────────────────────────────
      borderRadius: {
        sm:  "6px",   // Internal elements (buttons, inputs)
        md:  "8px",   // Small containers
        lg:  "10px",  // Primary containers / cards
        xl:  "14px",  // Large panels
        full: "9999px",
      },

      // ─── Shadows / Glows ────────────────────────────────────────────
      boxShadow: {
        // Tier 2 cards
        "card":  "0 0 0 1px #27272a, 0 1px 3px rgba(0,0,0,0.6)",
        // Tier 3 modals
        "modal": "0 0 0 1px #27272a, 0 8px 32px rgba(0,0,0,0.8)",
        // Subtle glow (focus / active)
        glow:    "0 0 0 3px rgba(59,130,246,0.15)",
        "glow-sm": "0 0 0 2px rgba(59,130,246,0.10)",
        // Liquid glass refraction (Tier 3)
        glass: "0 0 0 1px rgba(255,255,255,0.06), 0 8px 32px rgba(0,0,0,0.6), inset 0 1px 0 rgba(255,255,255,0.05)",
        // Inner glow for hover lift
        "lift": "0 0 0 1px #27272a, 0 4px 16px rgba(0,0,0,0.5)",
      },

      // ─── Animations ─────────────────────────────────────────────────
      transitionTimingFunction: {
        spring: "cubic-bezier(0.34, 1.56, 0.64, 1)",   // Spring overshoot
        "spring-in": "cubic-bezier(0.34, 1.20, 0.64, 1)",
        "spring-out": "cubic-bezier(0.22, 1.0, 0.36, 1)",
        "ease-smooth": "cubic-bezier(0.4, 0, 0.2, 1)",
      },
      keyframes: {
        // Squish on press
        squish: {
          "0%":   { transform: "scale(1)" },
          "40%":  { transform: "scale(0.97, 1.02)" },
          "70%":  { transform: "scale(0.99, 1.01)" },
          "100%": { transform: "scale(1)" },
        },
        // Spring pop
        "spring-pop": {
          "0%":   { transform: "scale(0.92)", opacity: "0" },
          "60%":  { transform: "scale(1.03)" },
          "80%":  { transform: "scale(0.98)" },
          "100%": { transform: "scale(1)", opacity: "1" },
        },
        // Fade + slide up (entering)
        "slide-up": {
          "0%":   { transform: "translateY(8px)", opacity: "0" },
          "100%": { transform: "translateY(0)", opacity: "1" },
        },
        // Pulse glow (active indicator)
        "pulse-glow": {
          "0%, 100%": { boxShadow: "0 0 0 0 rgba(59,130,246,0)" },
          "50%":      { boxShadow: "0 0 0 6px rgba(59,130,246,0.15)" },
        },
        // Shimmer (loading skeleton)
        shimmer: {
          "0%":   { backgroundPosition: "-400px 0" },
          "100%": { backgroundPosition: "400px 0" },
        },
        // Subtle float ambient
        float: {
          "0%, 100%": { transform: "translateY(0px)" },
          "50%":      { transform: "translateY(-3px)" },
        },
      },
      animation: {
        "squish":     "squish 0.35s cubic-bezier(0.34, 1.56, 0.64, 1) both",
        "spring-pop": "spring-pop 0.4s cubic-bezier(0.34, 1.20, 0.64, 1) both",
        "slide-up":   "slide-up 0.25s cubic-bezier(0.22, 1.0, 0.36, 1) both",
        "pulse-glow": "pulse-glow 2.5s ease-in-out infinite",
        shimmer:      "shimmer 1.6s ease-in-out infinite",
        float:        "float 4s ease-in-out infinite",
      },

      // ─── Spacing / Layout ────────────────────────────────────────────
      spacing: {
        "card": "24px",   // Internal card padding
        "bento": "16px",  // Bento grid gap
      },
      backdropBlur: {
        xs: "2px",
      },

      // ─── Z-Index ─────────────────────────────────────────────────────
      zIndex: {
        card:  "10",
        modal: "50",
        toast: "60",
        tooltip: "70",
      },
    },
  },
  plugins: [],
};
