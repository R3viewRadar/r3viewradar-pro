import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";
import type { Category, TrustBadge } from "@/types";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatRating(rating: number): string {
  return rating.toFixed(1);
}

export function formatCount(count: number): string {
  if (count >= 1000) return `${(count / 1000).toFixed(1)}k`;
  return count.toString();
}

export function slugify(text: string): string {
  return text
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

export function getCategoryLabel(category: Category): string {
  const labels: Record<Category, string> = {
    lawyer: "Legal",
    insurance: "Insurance",
    finance: "Financial",
    "real-estate": "Real Estate",
  };
  return labels[category];
}

export function getCategoryIcon(category: Category): string {
  const icons: Record<Category, string> = {
    lawyer: "⚖️",
    insurance: "🛡️",
    finance: "📊",
    "real-estate": "🏠",
  };
  return icons[category];
}

export function getTrustBadgeLabel(badge: TrustBadge): string {
  const labels: Record<TrustBadge, string> = {
    unverified: "Unverified",
    basic: "Basic",
    trusted: "Trusted",
    elite: "Elite",
    platinum: "Platinum",
  };
  return labels[badge];
}

export function getTrustBadgeColor(badge: TrustBadge): string {
  const colors: Record<TrustBadge, string> = {
    unverified: "text-gray-400 border-gray-600",
    basic: "text-blue-400 border-blue-600",
    trusted: "text-emerald-400 border-emerald-600",
    elite: "text-violet-400 border-violet-600",
    platinum: "text-amber-400 border-amber-500",
  };
  return colors[badge];
}

export function formatDate(dateString: string): string {
  return new Date(dateString).toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
}

export function formatRelativeDate(dateString: string): string {
  const date = new Date(dateString);
  const now = new Date();
  const diffMs = now.getTime() - date.getTime();
  const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));

  if (diffDays === 0) return "Today";
  if (diffDays === 1) return "Yesterday";
  if (diffDays < 7) return `${diffDays} days ago`;
  if (diffDays < 30) return `${Math.floor(diffDays / 7)} weeks ago`;
  if (diffDays < 365) return `${Math.floor(diffDays / 30)} months ago`;
  return `${Math.floor(diffDays / 365)} years ago`;
}

export function getPlatformLabel(platform: string): string {
  const labels: Record<string, string> = {
    google: "Google",
    yelp: "Yelp",
    avvo: "Avvo",
    martindale: "Martindale",
    linkedin: "LinkedIn",
    trustpilot: "Trustpilot",
    bbb: "BBB",
    internal: "R3viewRadar",
  };
  return labels[platform] ?? platform;
}
