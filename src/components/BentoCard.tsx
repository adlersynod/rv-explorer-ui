import { cn } from "../lib/utils";
import { ReactNode } from "react";

interface BentoCardProps {
  children: ReactNode;
  className?: string;
  style?: React.CSSProperties;
  /** Hover lift effect */
  hoverLift?: boolean;
  /** Press squish on click */
  pressSquish?: boolean;
  onClick?: () => void;
}

export function BentoCard({
  children,
  className,
  style,
  hoverLift = false,
  pressSquish = false,
  onClick,
}: BentoCardProps) {
  return (
    <div
      className={cn(
        "surface-tier-2",
        "card-pad",
        hoverLift && "spring-hover",
        pressSquish && "press-squish",
        className
      )}
      style={{
        borderRadius: "10px",
        ...style,
      }}
      onClick={onClick}
      role={onClick ? "button" : undefined}
      tabIndex={onClick ? 0 : undefined}
      onKeyDown={
        onClick
          ? (e) => {
              if (e.key === "Enter" || e.key === " ") {
                e.preventDefault();
                onClick();
              }
            }
          : undefined
      }
    >
      {children}
    </div>
  );
}

interface BentoGridProps {
  children: ReactNode;
  cols?: 1 | 2 | 3 | 4;
  className?: string;
  minCellWidth?: string;
}

export function BentoGrid({ children, cols = 2, className, minCellWidth }: BentoGridProps) {
  return (
    <div
      className={cn("bento-grid", className)}
      style={{
        gridTemplateColumns: minCellWidth
          ? `repeat(auto-fit, minmax(${minCellWidth}, 1fr))`
          : cols === 1
          ? "1fr"
          : cols === 2
          ? "repeat(auto-fit, minmax(280px, 1fr))"
          : "repeat(auto-fit, minmax(220px, 1fr))",
      }}
    >
      {children}
    </div>
  );
}
