import type { Profile, Review, Lead, PricingTier, Category } from "@/types";

// ─── Mock Profiles ─────────────────────────────────────────────────────────

export const MOCK_PROFILES: Profile[] = [
  {
    id: "1",
    slug: "sarah-chen-attorney",
    name: "Sarah Chen",
    title: "Attorney at Law",
    category: "lawyer",
    subcategory: "Personal Injury Attorney",
    location: "New York, NY",
    city: "New York",
    state: "NY",
    zip: "10001",
    phone: "(212) 555-0190",
    email: "sarah@chenlaw.com",
    website: "https://chenlaw.com",
    bio: "With over 15 years of experience in personal injury law, I have successfully recovered millions of dollars for my clients. I fight relentlessly for justice and ensure every client receives the compensation they deserve.",
    avatar_url: "https://ui-avatars.com/api/?name=Sarah+Chen&background=0ea5e9&color=fff&size=128",
    verified: true,
    claimed: true,
    trust_score: 94,
    overall_rating: 4.9,
    review_count: 312,
    years_experience: 15,
    specialties: ["Personal Injury", "Medical Malpractice", "Car Accidents", "Workers Compensation"],
    languages: ["English", "Mandarin"],
    education: [
      { institution: "Columbia Law School", degree: "J.D.", year: 2008 },
      { institution: "NYU", degree: "B.A. Political Science", year: 2005 },
    ],
    certifications: ["State Bar of New York", "American Bar Association"],
    social_links: { linkedin: "https://linkedin.com/in/sarahchen" },
    subscription_tier: "business",
    created_at: "2023-01-15T00:00:00Z",
    updated_at: "2024-06-01T00:00:00Z",
  },
  {
    id: "2",
    slug: "marcus-johnson-insurance",
    name: "Marcus Johnson",
    title: "Senior Insurance Advisor",
    category: "insurance",
    subcategory: "Life & Health Insurance Broker",
    location: "Chicago, IL",
    city: "Chicago",
    state: "IL",
    zip: "60601",
    phone: "(312) 555-0147",
    email: "marcus@johnsoninsurance.com",
    website: "https://johnsoninsurance.com",
    bio: "I help families and businesses find the right coverage at the best price. With 12 years in the industry, I specialize in life, health, and business insurance solutions tailored to your specific needs.",
    avatar_url: "https://ui-avatars.com/api/?name=Marcus+Johnson&background=10b981&color=fff&size=128",
    verified: true,
    claimed: true,
    trust_score: 88,
    overall_rating: 4.7,
    review_count: 189,
    years_experience: 12,
    specialties: ["Life Insurance", "Health Insurance", "Business Insurance", "Disability Insurance"],
    languages: ["English", "Spanish"],
    education: [
      { institution: "University of Illinois", degree: "B.S. Finance", year: 2011 },
    ],
    certifications: ["Licensed Insurance Broker (IL)", "Certified Financial Planner (CFP)"],
    social_links: { linkedin: "https://linkedin.com/in/marcusjohnson" },
    subscription_tier: "pro",
    created_at: "2023-03-20T00:00:00Z",
    updated_at: "2024-05-15T00:00:00Z",
  },
  {
    id: "3",
    slug: "diana-park-financial",
    name: "Diana Park",
    title: "Certified Financial Planner",
    category: "finance",
    subcategory: "Wealth Management Advisor",
    location: "San Francisco, CA",
    city: "San Francisco",
    state: "CA",
    zip: "94105",
    phone: "(415) 555-0203",
    email: "diana@parkwealth.com",
    website: "https://parkwealth.com",
    bio: "I help high-net-worth individuals and families build lasting wealth through strategic investment planning, tax optimization, and comprehensive financial planning.",
    avatar_url: "https://ui-avatars.com/api/?name=Diana+Park&background=8b5cf6&color=fff&size=128",
    verified: true,
    claimed: true,
    trust_score: 91,
    overall_rating: 4.8,
    review_count: 247,
    years_experience: 18,
    specialties: ["Wealth Management", "Retirement Planning", "Tax Strategy", "Estate Planning"],
    languages: ["English", "Korean"],
    education: [
      { institution: "Stanford University", degree: "M.B.A.", year: 2006 },
      { institution: "UC Berkeley", degree: "B.S. Economics", year: 2004 },
    ],
    certifications: ["CFP", "CFA", "Series 65"],
    social_links: { linkedin: "https://linkedin.com/in/dianapark", twitter: "https://twitter.com/dianapark" },
    subscription_tier: "business",
    created_at: "2022-11-10T00:00:00Z",
    updated_at: "2024-06-10T00:00:00Z",
  },
  {
    id: "4",
    slug: "james-rodriguez-realestate",
    name: "James Rodriguez",
    title: "Licensed Real Estate Agent",
    category: "real-estate",
    subcategory: "Luxury Property Specialist",
    location: "Miami, FL",
    city: "Miami",
    state: "FL",
    zip: "33101",
    phone: "(305) 555-0178",
    email: "james@rodriguezrealty.com",
    website: "https://rodriguezrealty.com",
    bio: "Top-producing luxury real estate agent in Miami with $250M+ in closed transactions. Specializing in waterfront properties, condos, and high-end residential sales.",
    avatar_url: "https://ui-avatars.com/api/?name=James+Rodriguez&background=f59e0b&color=fff&size=128",
    verified: true,
    claimed: true,
    trust_score: 86,
    overall_rating: 4.6,
    review_count: 156,
    years_experience: 10,
    specialties: ["Luxury Homes", "Waterfront Properties", "Investment Properties", "Condos"],
    languages: ["English", "Spanish", "Portuguese"],
    education: [
      { institution: "University of Miami", degree: "B.B.A. Real Estate", year: 2013 },
    ],
    certifications: ["Florida Real Estate License", "Certified Luxury Home Marketing Specialist"],
    social_links: { linkedin: "https://linkedin.com/in/jamesrodriguez", instagram: "https://instagram.com/jamesrodriguezrealty" } as Profile["social_links"],
    subscription_tier: "pro",
    created_at: "2023-05-01T00:00:00Z",
    updated_at: "2024-05-28T00:00:00Z",
  },
  {
    id: "5",
    slug: "lisa-thompson-attorney",
    name: "Lisa Thompson",
    title: "Family Law Attorney",
    category: "lawyer",
    subcategory: "Family Law Attorney",
    location: "Austin, TX",
    city: "Austin",
    state: "TX",
    zip: "78701",
    phone: "(512) 555-0234",
    email: "lisa@thompsonlaw.com",
    website: "https://thompsonlaw.com",
    bio: "Compassionate family law attorney with 8 years of experience in divorce, child custody, and adoption cases. I provide personalized legal representation with a focus on achieving the best outcomes for families.",
    avatar_url: "https://ui-avatars.com/api/?name=Lisa+Thompson&background=ec4899&color=fff&size=128",
    verified: true,
    claimed: false,
    trust_score: 72,
    overall_rating: 4.5,
    review_count: 98,
    years_experience: 8,
    specialties: ["Divorce", "Child Custody", "Adoption", "Prenuptial Agreements"],
    languages: ["English"],
    education: [
      { institution: "University of Texas School of Law", degree: "J.D.", year: 2016 },
    ],
    certifications: ["State Bar of Texas"],
    social_links: {},
    subscription_tier: "free",
    created_at: "2023-08-15T00:00:00Z",
    updated_at: "2024-04-20T00:00:00Z",
  },
  {
    id: "6",
    slug: "robert-kim-finance",
    name: "Robert Kim",
    title: "Investment Advisor",
    category: "finance",
    subcategory: "Retirement Planning Specialist",
    location: "Seattle, WA",
    city: "Seattle",
    state: "WA",
    zip: "98101",
    phone: "(206) 555-0156",
    email: "robert@kimadvisors.com",
    website: "https://kimadvisors.com",
    bio: "Helping pre-retirees and retirees build secure financial futures through conservative investment strategies and comprehensive retirement income planning.",
    avatar_url: "https://ui-avatars.com/api/?name=Robert+Kim&background=14b8a6&color=fff&size=128",
    verified: false,
    claimed: false,
    trust_score: 55,
    overall_rating: 4.3,
    review_count: 67,
    years_experience: 7,
    specialties: ["Retirement Planning", "401k Rollovers", "Social Security Optimization", "IRAs"],
    languages: ["English", "Korean"],
    education: [
      { institution: "University of Washington", degree: "B.S. Finance", year: 2016 },
    ],
    certifications: ["CFP Candidate", "Series 7", "Series 63"],
    social_links: { linkedin: "https://linkedin.com/in/robertkim" },
    subscription_tier: "free",
    created_at: "2024-01-10T00:00:00Z",
    updated_at: "2024-06-01T00:00:00Z",
  },
];

// ─── Mock Reviews ──────────────────────────────────────────────────────────

export const MOCK_REVIEWS: Review[] = [
  {
    id: "r1",
    profile_id: "1",
    author_name: "Michael Torres",
    rating: 5,
    title: "Won my case and changed my life",
    body: "Sarah Chen is an exceptional attorney. She fought tirelessly for my case and secured a settlement that far exceeded my expectations. Her communication was always clear and she kept me informed every step of the way.",
    platform: "google",
    verified: true,
    helpful_count: 47,
    created_at: "2024-05-15T00:00:00Z",
  },
  {
    id: "r2",
    profile_id: "1",
    author_name: "Jennifer Walsh",
    rating: 5,
    title: "Highly professional and results-driven",
    body: "I hired Sarah after a serious car accident and she handled everything professionally. She negotiated a settlement 3x higher than the insurance company's initial offer. Cannot recommend her enough.",
    platform: "yelp",
    verified: true,
    helpful_count: 32,
    created_at: "2024-04-20T00:00:00Z",
  },
  {
    id: "r3",
    profile_id: "1",
    author_name: "David Park",
    rating: 4,
    title: "Great attorney, minor communication delays",
    body: "Sarah is extremely knowledgeable and won my medical malpractice case. There were a few delays in communication but overall she delivered excellent results.",
    platform: "google",
    verified: true,
    helpful_count: 15,
    created_at: "2024-03-10T00:00:00Z",
  },
  {
    id: "r4",
    profile_id: "1",
    author_name: "Amanda Foster",
    rating: 5,
    title: "Best decision I ever made",
    body: "After being dismissed by two other attorneys, Sarah took my case and won. She's relentless, thorough, and genuinely cares about her clients.",
    platform: "avvo",
    verified: true,
    helpful_count: 28,
    created_at: "2024-02-28T00:00:00Z",
  },
  {
    id: "r5",
    profile_id: "2",
    author_name: "Patricia Owens",
    rating: 5,
    title: "Saved our family thousands",
    body: "Marcus found us a life insurance policy that was 40% cheaper than what we had while providing better coverage. His knowledge of the market is outstanding.",
    platform: "google",
    verified: true,
    helpful_count: 22,
    created_at: "2024-05-20T00:00:00Z",
  },
  {
    id: "r6",
    profile_id: "3",
    author_name: "Thomas Brennan",
    rating: 5,
    title: "Transformed our financial future",
    body: "Diana has been managing our family portfolio for 5 years. Our returns have consistently outperformed the market and her tax strategy saved us over $40,000 last year.",
    platform: "google",
    verified: true,
    helpful_count: 41,
    created_at: "2024-05-01T00:00:00Z",
  },
];

// ─── Mock Leads ────────────────────────────────────────────────────────────

export const MOCK_LEADS: Lead[] = [
  {
    id: "l1",
    profile_id: "1",
    name: "Kevin Brown",
    email: "kevin@email.com",
    phone: "(212) 555-0123",
    message: "I was in a car accident last month and need legal advice. The other driver was at fault but their insurance is offering a low settlement.",
    service_type: "Car Accident",
    status: "new",
    created_at: "2024-06-10T14:23:00Z",
  },
  {
    id: "l2",
    profile_id: "1",
    name: "Sandra Lee",
    email: "sandra.lee@gmail.com",
    phone: "(718) 555-0167",
    message: "I believe I have a medical malpractice case. My doctor missed a diagnosis that led to serious complications.",
    service_type: "Medical Malpractice",
    status: "contacted",
    created_at: "2024-06-09T09:15:00Z",
  },
  {
    id: "l3",
    profile_id: "1",
    name: "Raymond Ellis",
    email: "r.ellis@outlook.com",
    phone: "(646) 555-0189",
    message: "Slip and fall accident at a restaurant. I have medical bills and missed 3 weeks of work.",
    service_type: "Personal Injury",
    status: "converted",
    created_at: "2024-06-07T16:45:00Z",
  },
];

// ─── Pricing Tiers ─────────────────────────────────────────────────────────

export const PRICING_TIERS: PricingTier[] = [
  {
    id: "free",
    name: "Starter",
    price_monthly: 0,
    price_annual: 0,
    description: "Get your basic profile listed and start building your reputation.",
    features: [
      "Basic profile listing",
      "Up to 10 reviews displayed",
      "R3viewRadar Trust Score",
      "Contact form (5 leads/month)",
      "1 category listing",
    ],
    cta: "Get Started Free",
    highlighted: false,
  },
  {
    id: "pro",
    name: "Professional",
    price_monthly: 49,
    price_annual: 39,
    description: "Everything you need to stand out and capture more leads.",
    features: [
      "Everything in Starter",
      "Unlimited reviews displayed",
      "Priority placement in search",
      "Unlimited leads",
      "AI-generated profile summary",
      "Review monitoring alerts",
      "Analytics dashboard",
      "3 category listings",
      "Verified badge",
    ],
    cta: "Start 14-Day Free Trial",
    highlighted: true,
    stripe_price_id_monthly: "price_pro_monthly_placeholder",
    stripe_price_id_annual: "price_pro_annual_placeholder",
  },
  {
    id: "business",
    name: "Business",
    price_monthly: 149,
    price_annual: 119,
    description: "Full-featured reputation management for established professionals.",
    features: [
      "Everything in Professional",
      "Featured homepage placement",
      "Custom profile URL",
      "Lead CRM integration",
      "Competitor benchmarking",
      "White-label lead forms",
      "API access",
      "Dedicated account manager",
      "Unlimited category listings",
    ],
    cta: "Contact Sales",
    highlighted: false,
    stripe_price_id_monthly: "price_business_monthly_placeholder",
    stripe_price_id_annual: "price_business_annual_placeholder",
  },
];

// ─── Category Data ─────────────────────────────────────────────────────────

export const CATEGORIES = [
  {
    id: "lawyer" as Category,
    label: "Legal",
    icon: "⚖️",
    description: "Find attorneys, lawyers & legal advisors",
    count: "12,400+",
    color: "from-blue-500/20 to-blue-600/5 border-blue-500/20",
    subcategories: ["Personal Injury", "Family Law", "Criminal Defense", "Business Law", "Immigration", "Real Estate Law"],
  },
  {
    id: "insurance" as Category,
    label: "Insurance",
    icon: "🛡️",
    description: "Compare insurance brokers & agents",
    count: "8,900+",
    color: "from-emerald-500/20 to-emerald-600/5 border-emerald-500/20",
    subcategories: ["Life Insurance", "Health Insurance", "Auto Insurance", "Home Insurance", "Business Insurance", "Disability Insurance"],
  },
  {
    id: "finance" as Category,
    label: "Finance",
    icon: "📊",
    description: "Connect with financial advisors & planners",
    count: "15,200+",
    color: "from-violet-500/20 to-violet-600/5 border-violet-500/20",
    subcategories: ["Wealth Management", "Retirement Planning", "Tax Planning", "Investment Advisory", "Debt Management", "Estate Planning"],
  },
  {
    id: "real-estate" as Category,
    label: "Real Estate",
    icon: "🏠",
    description: "Find top real estate agents & brokers",
    count: "22,100+",
    color: "from-amber-500/20 to-amber-600/5 border-amber-500/20",
    subcategories: ["Buyer's Agent", "Seller's Agent", "Commercial", "Luxury Properties", "Investment Properties", "Property Management"],
  },
];

// ─── Helper functions ──────────────────────────────────────────────────────

export function getProfileBySlug(slug: string): Profile | undefined {
  return MOCK_PROFILES.find((p) => p.slug === slug);
}

export function getReviewsByProfileId(profileId: string): Review[] {
  return MOCK_REVIEWS.filter((r) => r.profile_id === profileId);
}

export function getLeadsByProfileId(profileId: string): Lead[] {
  return MOCK_LEADS.filter((l) => l.profile_id === profileId);
}

export function searchProfiles(
  query: string,
  category?: Category,
  location?: string
): Profile[] {
  return MOCK_PROFILES.filter((p) => {
    const matchesQuery =
      !query ||
      p.name.toLowerCase().includes(query.toLowerCase()) ||
      p.subcategory.toLowerCase().includes(query.toLowerCase()) ||
      p.specialties.some((s) => s.toLowerCase().includes(query.toLowerCase()));

    const matchesCategory = !category || p.category === category;

    const matchesLocation =
      !location ||
      p.city.toLowerCase().includes(location.toLowerCase()) ||
      p.state.toLowerCase().includes(location.toLowerCase()) ||
      p.zip.includes(location);

    return matchesQuery && matchesCategory && matchesLocation;
  });
}
