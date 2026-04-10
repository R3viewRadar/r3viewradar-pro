import { notFound } from "next/navigation";
import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import {
  Star, MapPin, Phone, Globe, CheckCircle, Award,
  MessageSquare, ArrowRight, GraduationCap, ExternalLink, Clock
} from "lucide-react";
import TrustBadge from "@/components/shared/TrustBadge";
import StarRating from "@/components/shared/StarRating";
import LeadForm from "@/components/shared/LeadForm";
import { getProfileBySlug, getReviewsByProfileId } from "@/lib/mock-data";
import { generateAISummary } from "@/lib/ai-summary";
import { calculateTrustScore } from "@/lib/trust-score";
import { formatRelativeDate, getPlatformLabel, formatCount, cn } from "@/lib/utils";

interface ProfilePageProps {
  params: { slug: string };
}

export async function generateMetadata({ params }: ProfilePageProps): Promise<Metadata> {
  const profile = getProfileBySlug(params.slug);
  if (!profile) return { title: "Profile Not Found" };
  return {
    title: `${profile.name} — ${profile.subcategory}`,
    description: `${profile.name} is a ${profile.subcategory} based in ${profile.city}, ${profile.state} with a ${profile.trust_score} Trust Score and ${profile.overall_rating}/5 rating from ${profile.review_count} reviews.`,
  };
}

const PLATFORM_COLORS: Record<string, string> = {
  google: "text-blue-400 bg-blue-400/10 border-blue-400/20",
  yelp: "text-red-400 bg-red-400/10 border-red-400/20",
  avvo: "text-orange-400 bg-orange-400/10 border-orange-400/20",
  martindale: "text-purple-400 bg-purple-400/10 border-purple-400/20",
  linkedin: "text-blue-500 bg-blue-500/10 border-blue-500/20",
  trustpilot: "text-emerald-400 bg-emerald-400/10 border-emerald-400/20",
  bbb: "text-blue-600 bg-blue-600/10 border-blue-600/20",
  internal: "text-cyan-400 bg-cyan-400/10 border-cyan-400/20",
};

export default async function ProfilePage({ params }: ProfilePageProps) {
  const profile = getProfileBySlug(params.slug);
  if (!profile) notFound();

  const reviews = getReviewsByProfileId(profile.id);
  const trustScore = calculateTrustScore(profile, reviews);
  const aiSummary = await generateAISummary(profile, reviews);

  const badge = trustScore.badge;

  return (
    <div className="container py-8">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* ─── Left Column ──────────────────────────────────────────────── */}
        <div className="lg:col-span-2 space-y-6">
          {/* Profile Header */}
          <div className="rounded-2xl border border-border bg-card p-6">
            <div className="flex flex-col sm:flex-row gap-6">
              {/* Avatar */}
              <div className="relative shrink-0">
                <div className="h-24 w-24 overflow-hidden rounded-2xl bg-secondary">
                  <Image
                    src={profile.avatar_url}
                    alt={profile.name}
                    width={96}
                    height={96}
                    className="h-full w-full object-cover"
                  />
                </div>
                {profile.verified && (
                  <div className="absolute -bottom-1.5 -right-1.5 rounded-full bg-background p-1">
                    <CheckCircle className="h-5 w-5 text-cyan-400" />
                  </div>
                )}
              </div>

              {/* Info */}
              <div className="flex-1">
                <div className="flex flex-wrap items-start justify-between gap-3">
                  <div>
                    <h1 className="text-2xl font-bold text-foreground flex items-center gap-2 flex-wrap">
                      {profile.name}
                      {profile.verified && (
                        <span className="text-xs font-medium text-cyan-400 bg-cyan-500/10 border border-cyan-500/20 px-2 py-0.5 rounded-full">
                          Verified
                        </span>
                      )}
                    </h1>
                    <p className="text-muted-foreground mt-0.5">{profile.title}</p>
                    <p className="text-sm text-muted-foreground mt-1">{profile.subcategory}</p>
                  </div>
                  <TrustBadge score={trustScore.overall} badge={badge} size="md" />
                </div>

                {/* Rating */}
                <div className="flex items-center gap-3 mt-3">
                  <StarRating rating={profile.overall_rating} showValue size="md" />
                  <span className="text-sm text-muted-foreground">
                    ({formatCount(profile.review_count)} reviews)
                  </span>
                  <span className="text-sm text-muted-foreground">
                    · {profile.years_experience} yrs experience
                  </span>
                </div>

                {/* Location + Contact */}
                <div className="flex flex-wrap items-center gap-4 mt-3">
                  <span className="flex items-center gap-1.5 text-sm text-muted-foreground">
                    <MapPin className="h-3.5 w-3.5" />
                    {profile.city}, {profile.state} {profile.zip}
                  </span>
                  <a
                    href={`tel:${profile.phone}`}
                    className="flex items-center gap-1.5 text-sm text-cyan-400 hover:text-cyan-300 transition-colors"
                  >
                    <Phone className="h-3.5 w-3.5" />
                    {profile.phone}
                  </a>
                  {profile.website && (
                    <a
                      href={profile.website}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground transition-colors"
                    >
                      <Globe className="h-3.5 w-3.5" />
                      Website
                      <ExternalLink className="h-3 w-3" />
                    </a>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* AI Summary */}
          <div className="rounded-2xl border border-cyan-500/20 bg-cyan-500/5 p-6">
            <div className="flex items-center gap-2 mb-3">
              <div className="flex h-5 w-5 items-center justify-center rounded bg-cyan-500/20">
                <Award className="h-3 w-3 text-cyan-400" />
              </div>
              <span className="text-xs font-semibold text-cyan-400 uppercase tracking-widest">
                AI-Powered Summary
              </span>
            </div>
            <p className="text-sm text-muted-foreground leading-relaxed">{aiSummary}</p>
          </div>

          {/* About */}
          <div className="rounded-2xl border border-border bg-card p-6">
            <h2 className="text-lg font-semibold text-foreground mb-4">About</h2>
            <p className="text-sm text-muted-foreground leading-relaxed">{profile.bio}</p>

            {/* Specialties */}
            <div className="mt-5">
              <h3 className="text-sm font-medium text-foreground mb-3">Specialties</h3>
              <div className="flex flex-wrap gap-2">
                {profile.specialties.map((spec) => (
                  <span
                    key={spec}
                    className="rounded-lg bg-secondary border border-border px-3 py-1 text-sm text-muted-foreground"
                  >
                    {spec}
                  </span>
                ))}
              </div>
            </div>

            {/* Education */}
            {profile.education.length > 0 && (
              <div className="mt-5">
                <h3 className="text-sm font-medium text-foreground mb-3 flex items-center gap-2">
                  <GraduationCap className="h-4 w-4 text-muted-foreground" />
                  Education
                </h3>
                <div className="space-y-2">
                  {profile.education.map((edu) => (
                    <div key={edu.institution} className="flex items-center justify-between">
                      <div>
                        <p className="text-sm font-medium text-foreground">{edu.degree}</p>
                        <p className="text-xs text-muted-foreground">{edu.institution}</p>
                      </div>
                      <span className="text-xs text-muted-foreground">{edu.year}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Certifications */}
            {profile.certifications.length > 0 && (
              <div className="mt-5">
                <h3 className="text-sm font-medium text-foreground mb-3 flex items-center gap-2">
                  <Award className="h-4 w-4 text-muted-foreground" />
                  Licenses & Certifications
                </h3>
                <div className="flex flex-wrap gap-2">
                  {profile.certifications.map((cert) => (
                    <span
                      key={cert}
                      className="inline-flex items-center gap-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 px-3 py-1 text-xs text-emerald-400"
                    >
                      <CheckCircle className="h-3 w-3" />
                      {cert}
                    </span>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Trust Score Breakdown */}
          <div className="rounded-2xl border border-border bg-card p-6">
            <div className="flex items-center justify-between mb-5">
              <h2 className="text-lg font-semibold text-foreground">Trust Score Breakdown</h2>
              <TrustBadge score={trustScore.overall} badge={badge} size="sm" />
            </div>
            <div className="space-y-4">
              {Object.entries(trustScore.breakdown).map(([key, value]) => {
                const labels: Record<string, { label: string; max: number }> = {
                  review_volume: { label: "Review Volume", max: 25 },
                  rating_quality: { label: "Rating Quality", max: 25 },
                  platform_diversity: { label: "Platform Diversity", max: 20 },
                  verified_credentials: { label: "Verified Credentials", max: 20 },
                  response_rate: { label: "Response Rate", max: 10 },
                };
                const info = labels[key];
                if (!info) return null;
                const pct = (value / info.max) * 100;

                return (
                  <div key={key}>
                    <div className="flex items-center justify-between text-sm mb-1.5">
                      <span className="text-muted-foreground">{info.label}</span>
                      <span className="font-medium text-foreground">
                        {value}/{info.max}
                      </span>
                    </div>
                    <div className="h-2 w-full rounded-full bg-secondary overflow-hidden">
                      <div
                        className="h-full rounded-full bg-cyan-500 transition-all"
                        style={{ width: `${pct}%` }}
                      />
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Reviews */}
          <div className="rounded-2xl border border-border bg-card p-6">
            <h2 className="text-lg font-semibold text-foreground mb-5">
              Reviews ({formatCount(profile.review_count)})
            </h2>

            {reviews.length === 0 ? (
              <p className="text-sm text-muted-foreground text-center py-8">
                No reviews yet.
              </p>
            ) : (
              <div className="space-y-5">
                {reviews.map((review) => (
                  <div
                    key={review.id}
                    className="rounded-xl border border-border p-4"
                  >
                    <div className="flex items-start justify-between gap-3 mb-3">
                      <div>
                        <div className="flex items-center gap-2">
                          <p className="text-sm font-semibold text-foreground">
                            {review.author_name}
                          </p>
                          {review.verified && (
                            <CheckCircle className="h-3.5 w-3.5 text-cyan-400" />
                          )}
                        </div>
                        <div className="flex items-center gap-2 mt-1">
                          <StarRating rating={review.rating} size="sm" />
                          <span
                            className={cn(
                              "text-[10px] font-medium rounded-full border px-2 py-0.5",
                              PLATFORM_COLORS[review.platform] ?? "text-muted-foreground"
                            )}
                          >
                            {getPlatformLabel(review.platform)}
                          </span>
                        </div>
                      </div>
                      <span className="flex items-center gap-1 text-xs text-muted-foreground whitespace-nowrap">
                        <Clock className="h-3 w-3" />
                        {formatRelativeDate(review.created_at)}
                      </span>
                    </div>

                    {review.title && (
                      <p className="text-sm font-medium text-foreground mb-1">
                        {review.title}
                      </p>
                    )}
                    <p className="text-sm text-muted-foreground leading-relaxed">
                      {review.body}
                    </p>

                    {review.helpful_count > 0 && (
                      <p className="text-xs text-muted-foreground mt-3">
                        {review.helpful_count} people found this helpful
                      </p>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* ─── Right Column ─────────────────────────────────────────────── */}
        <div className="space-y-5">
          {/* Lead Form */}
          <div className="rounded-2xl border border-border bg-card p-6 sticky top-20">
            <div className="flex items-center gap-2 mb-5">
              <MessageSquare className="h-4 w-4 text-cyan-400" />
              <h2 className="font-semibold text-foreground">
                Contact {profile.name.split(" ")[0]}
              </h2>
            </div>
            <LeadForm
              profileId={profile.id}
              profileName={profile.name}
              serviceOptions={profile.specialties}
            />
          </div>

          {/* Claim Profile */}
          {!profile.claimed && (
            <div className="rounded-2xl border border-dashed border-border p-5 text-center">
              <p className="text-sm font-medium text-foreground mb-1">
                Is this your profile?
              </p>
              <p className="text-xs text-muted-foreground mb-3">
                Claim it to manage your information and respond to reviews.
              </p>
              <Link
                href="/signup"
                className="inline-flex items-center gap-1.5 rounded-lg bg-cyan-500 px-4 py-2 text-sm font-semibold text-black hover:bg-cyan-400 transition-colors"
              >
                Claim Profile
                <ArrowRight className="h-3.5 w-3.5" />
              </Link>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
