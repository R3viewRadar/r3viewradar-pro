import Link from "next/link";
import { ArrowRight, Star, Shield, CheckCircle, TrendingUp, Users, Award } from "lucide-react";
import SearchBar from "@/components/shared/SearchBar";
import ProfileCard from "@/components/shared/ProfileCard";
import TrustBadge from "@/components/shared/TrustBadge";
import { MOCK_PROFILES, CATEGORIES } from "@/lib/mock-data";

const STATS = [
  { value: "58,000+", label: "Professionals Listed", icon: Users },
  { value: "1.2M+", label: "Reviews Aggregated", icon: Star },
  { value: "99.9%", label: "Verified Profiles", icon: CheckCircle },
  { value: "4.8/5", label: "User Satisfaction", icon: Award },
];

const TRUST_SCORE_STEPS = [
  { label: "Review Volume", desc: "How many verified reviews across all platforms" },
  { label: "Rating Quality", desc: "Average score weighted by recency and platform authority" },
  { label: "Platform Diversity", desc: "Reviews from Google, Yelp, Avvo, LinkedIn & more" },
  { label: "Credentials Verified", desc: "Licenses, certifications, and bar memberships" },
  { label: "Response Rate", desc: "How quickly they respond to leads and inquiries" },
];

export default function HomePage() {
  const featuredProfiles = MOCK_PROFILES.filter((p) => p.trust_score >= 85).slice(0, 3);

  return (
    <div className="flex flex-col">
      {/* ─── Hero ─────────────────────────────────────────────────────────── */}
      <section className="relative overflow-hidden py-20 md:py-28">
        {/* Background glow */}
        <div className="absolute inset-0 -z-10">
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[500px] bg-cyan-500/5 blur-[120px] rounded-full" />
          <div className="absolute bottom-0 right-0 w-[400px] h-[300px] bg-blue-500/5 blur-[100px] rounded-full" />
        </div>

        <div className="container">
          <div className="mx-auto max-w-4xl text-center">
            <div className="inline-flex items-center gap-2 rounded-full border border-cyan-500/20 bg-cyan-500/5 px-4 py-1.5 text-sm text-cyan-400 mb-6">
              <Shield className="h-3.5 w-3.5" />
              Trusted by 500,000+ Americans
            </div>

            <h1 className="text-4xl font-extrabold tracking-tight sm:text-5xl md:text-6xl lg:text-7xl text-balance">
              Search Reputation.{" "}
              <span className="gradient-text">Find Trust.</span>
            </h1>

            <p className="mt-6 text-lg text-muted-foreground max-w-2xl mx-auto text-balance">
              The first reputation search engine built for legal, insurance, financial, and real estate professionals.
              Aggregated reviews. Verified credentials. One Trust Score.
            </p>

            {/* Search Bar */}
            <div className="mt-10">
              <SearchBar size="large" className="max-w-3xl mx-auto" />
            </div>

            {/* Quick category shortcuts */}
            <div className="flex flex-wrap justify-center gap-2 mt-6">
              {CATEGORIES.map((cat) => (
                <Link
                  key={cat.id}
                  href={`/search?category=${cat.id}`}
                  className="inline-flex items-center gap-1.5 rounded-full border border-border bg-card px-4 py-2 text-sm text-muted-foreground hover:border-cyan-500/30 hover:text-foreground transition-all"
                >
                  <span>{cat.icon}</span>
                  {cat.label}
                </Link>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ─── Stats ────────────────────────────────────────────────────────── */}
      <section className="border-y border-border bg-card/50 py-10">
        <div className="container">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {STATS.map((stat) => (
              <div key={stat.label} className="text-center">
                <div className="flex justify-center mb-2">
                  <stat.icon className="h-5 w-5 text-cyan-400" />
                </div>
                <p className="text-2xl font-bold text-foreground">{stat.value}</p>
                <p className="text-sm text-muted-foreground">{stat.label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ─── Categories ───────────────────────────────────────────────────── */}
      <section className="py-20">
        <div className="container">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-foreground">Browse by Category</h2>
            <p className="mt-3 text-muted-foreground">
              Find the right professional for your specific needs
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {CATEGORIES.map((cat) => (
              <Link
                key={cat.id}
                href={`/search?category=${cat.id}`}
                className={`group rounded-2xl border bg-gradient-to-br p-6 transition-all hover:scale-[1.02] ${cat.color}`}
              >
                <div className="text-3xl mb-3">{cat.icon}</div>
                <h3 className="font-bold text-foreground text-lg">{cat.label}</h3>
                <p className="text-sm text-muted-foreground mt-1">{cat.description}</p>
                <div className="flex items-center justify-between mt-4">
                  <span className="text-xs font-medium text-muted-foreground">{cat.count} professionals</span>
                  <ArrowRight className="h-4 w-4 text-muted-foreground group-hover:text-foreground group-hover:translate-x-1 transition-all" />
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* ─── Featured Listings ─────────────────────────────────────────────── */}
      <section className="py-20 bg-card/30">
        <div className="container">
          <div className="flex items-center justify-between mb-10">
            <div>
              <h2 className="text-3xl font-bold text-foreground">Top Rated Professionals</h2>
              <p className="mt-2 text-muted-foreground">Highest Trust Scores this week</p>
            </div>
            <Link
              href="/search"
              className="flex items-center gap-1.5 text-sm font-medium text-cyan-400 hover:text-cyan-300 transition-colors"
            >
              View all <ArrowRight className="h-4 w-4" />
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {featuredProfiles.map((profile) => (
              <ProfileCard key={profile.id} profile={profile} />
            ))}
          </div>
        </div>
      </section>

      {/* ─── Trust Score Explainer ─────────────────────────────────────────── */}
      <section className="py-20">
        <div className="container">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            {/* Left */}
            <div>
              <div className="inline-flex items-center gap-2 rounded-full border border-cyan-500/20 bg-cyan-500/5 px-4 py-1.5 text-sm text-cyan-400 mb-6">
                <TrendingUp className="h-3.5 w-3.5" />
                Our Trust Score System
              </div>
              <h2 className="text-3xl font-bold text-foreground mb-4 text-balance">
                One score that tells the whole story
              </h2>
              <p className="text-muted-foreground leading-relaxed mb-8">
                Our proprietary Trust Score aggregates data from dozens of review platforms, credential verifications, 
                and response metrics into a single 0-100 score. No more guessing who to trust.
              </p>

              <div className="space-y-4">
                {TRUST_SCORE_STEPS.map((step, i) => (
                  <div key={step.label} className="flex items-start gap-4">
                    <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-cyan-500/10 border border-cyan-500/20 text-xs font-bold text-cyan-400">
                      {i + 1}
                    </div>
                    <div>
                      <p className="font-medium text-foreground text-sm">{step.label}</p>
                      <p className="text-xs text-muted-foreground mt-0.5">{step.desc}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Right - Score Card Visual */}
            <div className="relative">
              <div className="rounded-2xl border border-border bg-card p-8 text-center">
                <p className="text-sm font-medium text-muted-foreground mb-4">Sample Trust Score</p>
                <div className="relative mx-auto mb-6 h-40 w-40">
                  <svg className="h-full w-full -rotate-90" viewBox="0 0 120 120">
                    <circle cx="60" cy="60" r="50" fill="none" stroke="hsl(220 15% 14%)" strokeWidth="10" />
                    <circle
                      cx="60" cy="60" r="50" fill="none"
                      stroke="hsl(192 85% 42%)" strokeWidth="10"
                      strokeDasharray={`${2 * Math.PI * 50 * 0.92} ${2 * Math.PI * 50 * 0.08}`}
                      strokeLinecap="round"
                    />
                  </svg>
                  <div className="absolute inset-0 flex flex-col items-center justify-center">
                    <span className="text-4xl font-black text-foreground">92</span>
                    <span className="text-xs text-muted-foreground">/ 100</span>
                  </div>
                </div>
                <TrustBadge score={92} badge="platinum" size="lg" className="mx-auto mb-6" />
                <div className="grid grid-cols-2 gap-3 text-left">
                  {["Review Volume", "Rating Quality", "Platform Diversity", "Verified Credentials"].map((item, i) => (
                    <div key={item} className="flex items-center gap-2">
                      <div className="h-1.5 w-1.5 rounded-full bg-cyan-400" />
                      <span className="text-xs text-muted-foreground">{item}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ─── CTA ──────────────────────────────────────────────────────────── */}
      <section className="py-20 border-t border-border">
        <div className="container">
          <div className="rounded-2xl bg-gradient-to-br from-cyan-500/10 via-blue-500/5 to-transparent border border-cyan-500/20 p-12 text-center">
            <h2 className="text-3xl font-bold text-foreground mb-4">
              Are you a professional?
            </h2>
            <p className="text-muted-foreground mb-8 max-w-md mx-auto">
              Claim your profile, showcase your reputation, and start capturing leads from clients actively searching for your services.
            </p>
            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              <Link
                href="/signup"
                className="rounded-xl bg-cyan-500 px-8 py-3 text-sm font-semibold text-black hover:bg-cyan-400 transition-colors"
              >
                Get Listed Free
              </Link>
              <Link
                href="/pricing"
                className="rounded-xl border border-border bg-secondary px-8 py-3 text-sm font-medium hover:bg-white/5 transition-colors"
              >
                View Pricing
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
