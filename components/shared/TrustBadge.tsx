import { ShieldCheck } from "lucide-react";
import { cn } from "@/lib/utils";
import { getTrustScoreColor, getTrustScoreBg } from "@/lib/trust-score";
import { getTrustBadgeColor } from "@/lib/utils";
import type { TrustBadge as TrustBadgeType } from "@/types";

interface TrustBadgeProps {
  score: number;
  badge: TrustBadgeType;
  size?: "sm" | "md" | "lg";
  showLabel?: boolean;
  className?: string;
}

export default function TrustBadge({
  score,
  badge,
  size = "md",
  showLabel = true,
  className,
}: TrustBadgeProps) {
  const colorClass = getTrustBadgeColor(badge);
  const bgClass = getTrustScoreBg(score);

  const sizeClasses = {
    sm: "text-xs px-2 py-0.5 gap-1",
    md: "text-sm px-2.5 py-1 gap-1.5",
    lg: "text-base px-3 py-1.5 gap-2",
  };

  const iconSizes = {
    sm: "h-3 w-3",
    md: "h-3.5 w-3.5",
    lg: "h-4 w-4",
  };

  return (
    <div
      className={cn(
        "inline-flex items-center rounded-full border font-semibold",
        bgClass,
        colorClass,
        sizeClasses[size],
        className
      )}
    >
      <ShieldCheck className={iconSizes[size]} />
      <span>{score}</span>
      {showLabel && (
        <span className="capitalize opacity-80">
          {badge === "platinum"
            ? "Platinum"
            : badge === "elite"
            ? "Elite"
            : badge === "trusted"
            ? "Trusted"
            : badge === "basic"
            ? "Basic"
            : "Unverified"}
        </span>
      )}
    </div>
  );
}
