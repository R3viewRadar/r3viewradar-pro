import Link from "next/link";
import Image from "next/image";
import { Star, MapPin, CheckCircle, MessageSquare } from "lucide-react";
import { cn, formatCount, getCategoryLabel, getCategoryIcon } from "@/lib/utils";
import TrustBadge from "./TrustBadge";
import type { Profile } from "@/types";
import type { TrustBadge as TrustBadgeType } from "@/types";

interface ProfileCardProps {
  profile: Profile;
  className?: string;
}

export default function ProfileCard({ profile, className }: ProfileCardProps) {
  const badge: TrustBadgeType =
    profile.trust_score >= 90
      ? "platinum"
      : profile.trust_score >= 75
      ? "elite"
      : profile.trust_score >= 55
      ? "trusted"
      : profile.trust_score >= 30
      ? "basic"
      : "unverified";

  return (
    <Link
      href={`/profile/${profile.slug}`}
      className={cn(
        "group block rounded-2xl border border-border bg-card p-5 transition-all hover:border-cyan-500/30 hover:shadow-lg hover:shadow-cyan-500/5",
        className
      )}
    >
      {/* Header */}
      <div className="flex items-start gap-4">
        {/* Avatar */}
        <div className="relative shrink-0">
          <div className="h-14 w-14 overflow-hidden rounded-xl bg-secondary">
            <Image
              src={profile.avatar_url}
              alt={profile.name}
              width={56}
              height={56}
              className="h-full w-full object-cover"
            />
          </div>
          {profile.verified && (
            <div className="absolute -bottom-1 -right-1 rounded-full bg-background p-0.5">
              <CheckCircle className="h-4 w-4 text-cyan-400" />
            </div>
          )}
        </div>

        {/* Info */}
        <div className="flex-1 min-w-0">
          <div className="flex items-start justify-between gap-2">
            <div>
              <h3 className="font-semibold text-foreground group-hover:text-cyan-400 transition-colors truncate">
                {profile.name}
              </h3>
              <p className="text-sm text-muted-foreground truncate">{profile.title}</p>
            </div>
            <TrustBadge score={profile.trust_score} badge={badge} size="sm" showLabel={false} />
          </div>

          {/* Category + Location */}
          <div className="flex items-center gap-3 mt-2">
            <span className="inline-flex items-center gap-1 text-xs text-muted-foreground">
              <span>{getCategoryIcon(profile.category)}</span>
              {getCategoryLabel(profile.category)}
            </span>
            <span className="inline-flex items-center gap-1 text-xs text-muted-foreground">
              <MapPin className="h-3 w-3" />
              {profile.city}, {profile.state}
            </span>
          </div>
        </div>
      </div>

      {/* Rating + Stats */}
      <div className="mt-4 flex items-center gap-4">
        <div className="flex items-center gap-1.5">
          <div className="flex items-center gap-0.5">
            {Array.from({ length: 5 }).map((_, i) => (
              <Star
                key={i}
                className={cn(
                  "h-3.5 w-3.5",
                  i < Math.round(profile.overall_rating)
                    ? "fill-amber-400 text-amber-400"
                    : "fill-muted text-muted"
                )}
              />
            ))}
          </div>
          <span className="text-sm font-semibold text-foreground">
            {profile.overall_rating.toFixed(1)}
          </span>
          <span className="text-xs text-muted-foreground">
            ({formatCount(profile.review_count)})
          </span>
        </div>

        <span className="text-xs text-muted-foreground">
          {profile.years_experience} yrs exp
        </span>
      </div>

      {/* Specialties */}
      <div className="mt-3 flex flex-wrap gap-1.5">
        {profile.specialties.slice(0, 3).map((spec) => (
          <span
            key={spec}
            className="inline-block rounded-md bg-secondary px-2 py-0.5 text-xs text-muted-foreground"
          >
            {spec}
          </span>
        ))}
        {profile.specialties.length > 3 && (
          <span className="inline-block rounded-md bg-secondary px-2 py-0.5 text-xs text-muted-foreground">
            +{profile.specialties.length - 3}
          </span>
        )}
      </div>

      {/* CTA */}
      <div className="mt-4 flex items-center justify-between">
        <span className="flex items-center gap-1 text-xs text-muted-foreground">
          <MessageSquare className="h-3 w-3" />
          Contact for free
        </span>
        <span className="text-xs font-medium text-cyan-400 group-hover:text-cyan-300 transition-colors">
          View Profile →
        </span>
      </div>
    </Link>
  );
}
