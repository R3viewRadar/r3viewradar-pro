// ─── Core Domain Types ────────────────────────────────────────────────────────

export type Category = "lawyer" | "insurance" | "finance" | "real-estate";

export type SubscriptionTier = "free" | "pro" | "business";

export interface Profile {
  id: string;
  slug: string;
  name: string;
  title: string;
  category: Category;
  subcategory: string;
  location: string;
  city: string;
  state: string;
  zip: string;
  phone: string;
  email: string;
  website: string;
  bio: string;
  avatar_url: string;
  verified: boolean;
  claimed: boolean;
  trust_score: number;
  overall_rating: number;
  review_count: number;
  years_experience: number;
  specialties: string[];
  languages: string[];
  education: Education[];
  certifications: string[];
  social_links: SocialLinks;
  subscription_tier: SubscriptionTier;
  created_at: string;
  updated_at: string;
}

export interface Education {
  institution: string;
  degree: string;
  year: number;
}

export interface SocialLinks {
  linkedin?: string;
  twitter?: string;
  facebook?: string;
}

export interface Review {
  id: string;
  profile_id: string;
  author_name: string;
  author_avatar?: string;
  rating: number;
  title: string;
  body: string;
  platform: ReviewPlatform;
  verified: boolean;
  helpful_count: number;
  created_at: string;
}

export type ReviewPlatform =
  | "google"
  | "yelp"
  | "avvo"
  | "martindale"
  | "linkedin"
  | "trustpilot"
  | "bbb"
  | "internal";

export interface Lead {
  id: string;
  profile_id: string;
  name: string;
  email: string;
  phone: string;
  message: string;
  service_type: string;
  status: LeadStatus;
  created_at: string;
}

export type LeadStatus = "new" | "contacted" | "converted" | "lost";

export interface TrustScore {
  overall: number;
  breakdown: {
    review_volume: number;
    rating_quality: number;
    platform_diversity: number;
    verified_credentials: number;
    response_rate: number;
  };
  badge: TrustBadge;
}

export type TrustBadge = "unverified" | "basic" | "trusted" | "elite" | "platinum";

export interface SearchFilters {
  query: string;
  category?: Category;
  location?: string;
  min_rating?: number;
  min_trust_score?: number;
  verified_only?: boolean;
  sort_by?: SortOption;
}

export type SortOption = "relevance" | "rating" | "trust_score" | "review_count" | "newest";

export interface SearchResult {
  profiles: Profile[];
  total: number;
  page: number;
  per_page: number;
  filters: SearchFilters;
}

export interface PricingTier {
  id: SubscriptionTier;
  name: string;
  price_monthly: number;
  price_annual: number;
  description: string;
  features: string[];
  cta: string;
  highlighted: boolean;
  stripe_price_id_monthly?: string;
  stripe_price_id_annual?: string;
}

export interface AnalyticsData {
  profile_views: number;
  lead_count: number;
  review_count: number;
  trust_score: number;
  view_trend: number; // percentage change
  lead_trend: number;
  monthly_views: MonthlyDataPoint[];
}

export interface MonthlyDataPoint {
  month: string;
  views: number;
  leads: number;
}

export interface DashboardData {
  profile: Profile;
  analytics: AnalyticsData;
  recent_leads: Lead[];
  recent_reviews: Review[];
}
