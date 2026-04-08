import { clsx, type ClassValue } from "clsx";

/**
 * Merge Tailwind classes with clsx.
 * Usage: cn("px-4", isActive && "bg-blue-500", extra)
 */
export function cn(...inputs: ClassValue[]) {
  return clsx(inputs);
}

/**
 * Format a number with tabular-nums for stable display.
 */
export function tabular(n: number | string): React.CSSProperties {
  return {
    fontVariantNumeric: "tabular-nums",
    fontFeatureSettings: "'tnum' on, 'lnum' on",
    fontFamily: "'JetBrains Mono', monospace",
    letterSpacing: "-0.03em",
  };
}

/**
 * Format a duration in hours to human-readable string.
 * e.g. 2.5 → "2h 30m"
 */
export function formatDuration(hrs: number): string {
  const h = Math.floor(hrs);
  const m = Math.round((hrs - h) * 60);
  if (h === 0) return `${m}m`;
  if (m === 0) return `${h}h`;
  return `${h}h ${m}m`;
}

/**
 * Format miles → string
 */
export function formatMiles(mi: number): string {
  return `${mi.toLocaleString("en-US", { maximumFractionDigits: 0 })} mi`;
}

/**
 * Format price string
 */
export function formatPrice(price: string | number | null | undefined): string {
  if (!price || price === "N/A" || price === "Free") return price?.toString() ?? "—";
  return `$${price}`;
}
