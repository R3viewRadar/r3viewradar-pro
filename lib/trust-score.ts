import type { Profile, Review, TrustScore, TrustBadge } from "@/types";

/**
 * Calculates a Trust Score (0-100) for a professional profile.
 * Based on review volume, rating quality, platform diversity, verified credentials, and response rate.
 */
export function calculateTrustScore(
  profile: Partial<Profile>,
  reviews: Review[]
): TrustScore {
  // 1. Review Volume Score (0-25)
  const reviewCount = reviews.length;
  const reviewVolumeScore = Math.min(25, Math.round((reviewCount / 50) * 25));

  // 2. Rating Quality Score (0-25)
  const avgRating =
    reviews.length > 0
      ? reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length
      : 0;
  const ratingQualityScore = Math.round((avgRating / 5) * 25);

  // 3. Platform Diversity Score (0-20)
  const uniquePlatforms = new Set(reviews.map((r) => r.platform)).size;
  const platformDiversityScore = Math.min(20, uniquePlatforms * 4);

  // 4. Verified Credentials Score (0-20)
  let credentialScore = 0;
  if (profile.verified) credentialScore += 10;
  if (profile.claimed) credentialScore += 5;
  if ((profile.years_experience ?? 0) > 5) credentialScore += 3;
  if ((profile.certifications?.length ?? 0) > 0) credentialScore += 2;
  const verifiedCredentialsScore = Math.min(20, credentialScore);

  // 5. Response Rate Score (0-10) — placeholder, real impl uses response data
  const responseRateScore = profile.claimed ? 8 : 3;

  const overall = Math.min(
    100,
    reviewVolumeScore +
      ratingQualityScore +
      platformDiversityScore +
      verifiedCredentialsScore +
      responseRateScore
  );

  return {
    overall,
    breakdown: {
      review_volume: reviewVolumeScore,
      rating_quality: ratingQualityScore,
      platform_diversity: platformDiversityScore,
      verified_credentials: verifiedCredentialsScore,
      response_rate: responseRateScore,
    },
    badge: getTrustBadge(overall),
  };
}

function getTrustBadge(score: number): TrustBadge {
  if (score >= 90) return "platinum";
  if (score >= 75) return "elite";
  if (score >= 55) return "trusted";
  if (score >= 30) return "basic";
  return "unverified";
}

export function getTrustScoreColor(score: number): string {
  if (score >= 90) return "text-amber-400";
  if (score >= 75) return "text-violet-400";
  if (score >= 55) return "text-emerald-400";
  if (score >= 30) return "text-blue-400";
  return "text-gray-400";
}

export function getTrustScoreBg(score: number): string {
  if (score >= 90) return "bg-amber-400/10 border-amber-500/30";
  if (score >= 75) return "bg-violet-400/10 border-violet-500/30";
  if (score >= 55) return "bg-emerald-400/10 border-emerald-500/30";
  if (score >= 30) return "bg-blue-400/10 border-blue-500/30";
  return "bg-gray-400/10 border-gray-500/30";
}
