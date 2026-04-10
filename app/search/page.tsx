"use client";

import { useSearchParams } from "next/navigation";
import { Suspense } from "react";
import { SlidersHorizontal } from "lucide-react";
import SearchBar from "@/components/shared/SearchBar";
import ProfileCard from "@/components/shared/ProfileCard";
import { searchProfiles, MOCK_PROFILES } from "@/lib/mock-data";
import type { Category } from "@/types";

const SORT_OPTIONS = [
  { value: "relevance", label: "Most Relevant" },
  { value: "trust_score", label: "Trust Score" },
  { value: "rating", label: "Highest Rated" },
  { value: "review_count", label: "Most Reviewed" },
];

const RATING_FILTERS = [
  { value: "4.5", label: "4.5+ Stars" },
  { value: "4.0", label: "4.0+ Stars" },
  { value: "3.5", label: "3.5+ Stars" },
];

const CATEGORIES = [
  { value: "", label: "All Categories" },
  { value: "lawyer", label: "⚖️ Legal" },
  { value: "insurance", label: "🛡️ Insurance" },
  { value: "finance", label: "📊 Finance" },
  { value: "real-estate", label: "🏠 Real Estate" },
];

function SearchResults() {
  const searchParams = useSearchParams();
  const query = searchParams.get("q") ?? "";
  const category = (searchParams.get("category") ?? "") as Category | "";
  const location = searchParams.get("location") ?? "";
  const minRatingStr = searchParams.get("min_rating") ?? "0";
  const minRating = parseFloat(minRatingStr);
  const verifiedOnly = searchParams.get("verified") === "true";
  const sortBy = searchParams.get("sort") ?? "relevance";

  // Search with or without filters
  let results = category
    ? searchProfiles(query, category as Category, location)
    : searchProfiles(query, undefined, location);

  // If no query and no category, show all profiles
  if (!query && !category) {
    results = [...MOCK_PROFILES];
  }

  // Apply rating filter
  if (minRating > 0) {
    results = results.filter((p) => p.overall_rating >= minRating);
  }

  // Apply verified filter
  if (verifiedOnly) {
    results = results.filter((p) => p.verified);
  }

  // Sort
  if (sortBy === "trust_score") {
    results.sort((a, b) => b.trust_score - a.trust_score);
  } else if (sortBy === "rating") {
    results.sort((a, b) => b.overall_rating - a.overall_rating);
  } else if (sortBy === "review_count") {
    results.sort((a, b) => b.review_count - a.review_count);
  }

  function buildFilterUrl(params: Record<string, string>): string {
    const base: Record<string, string> = {};
    if (query) base.q = query;
    if (category) base.category = category;
    if (location) base.location = location;
    const merged = { ...base, ...params };
    // Remove empty values
    Object.keys(merged).forEach((k) => {
      if (!merged[k]) delete merged[k];
    });
    return `/search?${new URLSearchParams(merged).toString()}`;
  }

  return (
    <div className="container py-8">
      {/* Top Search Bar */}
      <div className="mb-8">
        <SearchBar
          initialQuery={query}
          initialCategory={category}
          initialLocation={location}
        />
      </div>

      <div className="flex flex-col lg:flex-row gap-8">
        {/* ─── Sidebar Filters ──────────────────────────────────────────── */}
        <aside className="w-full lg:w-64 shrink-0">
          <div className="rounded-2xl border border-border bg-card p-5 space-y-6">
            <div className="flex items-center gap-2 font-semibold text-foreground">
              <SlidersHorizontal className="h-4 w-4 text-cyan-400" />
              Filters
            </div>

            {/* Category */}
            <div>
              <p className="text-xs font-medium text-muted-foreground uppercase tracking-widest mb-3">
                Category
              </p>
              <div className="space-y-1.5">
                {CATEGORIES.map((cat) => (
                  <a
                    key={cat.value}
                    href={buildFilterUrl({ category: cat.value })}
                    className={`flex items-center justify-between rounded-lg px-3 py-2 text-sm transition-colors ${
                      category === cat.value
                        ? "bg-cyan-500/10 text-cyan-400 border border-cyan-500/20"
                        : "text-muted-foreground hover:bg-secondary hover:text-foreground"
                    }`}
                  >
                    {cat.label}
                  </a>
                ))}
              </div>
            </div>

            {/* Rating */}
            <div>
              <p className="text-xs font-medium text-muted-foreground uppercase tracking-widest mb-3">
                Minimum Rating
              </p>
              <div className="space-y-1.5">
                {RATING_FILTERS.map((r) => (
                  <a
                    key={r.value}
                    href={buildFilterUrl({ min_rating: minRatingStr === r.value ? "" : r.value })}
                    className={`block rounded-lg px-3 py-2 text-sm transition-colors ${
                      minRatingStr === r.value
                        ? "bg-cyan-500/10 text-cyan-400 border border-cyan-500/20"
                        : "text-muted-foreground hover:bg-secondary hover:text-foreground"
                    }`}
                  >
                    {r.label}
                  </a>
                ))}
              </div>
            </div>

            {/* Verified only */}
            <div>
              <a
                href={buildFilterUrl({ verified: verifiedOnly ? "" : "true" })}
                className={`flex items-center gap-2 rounded-lg px-3 py-2 text-sm transition-colors ${
                  verifiedOnly
                    ? "bg-cyan-500/10 text-cyan-400 border border-cyan-500/20"
                    : "text-muted-foreground hover:bg-secondary hover:text-foreground"
                }`}
              >
                <div
                  className={`h-4 w-4 rounded border ${
                    verifiedOnly ? "bg-cyan-500 border-cyan-500" : "border-border"
                  } flex items-center justify-center`}
                >
                  {verifiedOnly && (
                    <span className="text-black text-[10px] font-bold">✓</span>
                  )}
                </div>
                Verified Only
              </a>
            </div>
          </div>
        </aside>

        {/* ─── Results ──────────────────────────────────────────────────── */}
        <div className="flex-1 min-w-0">
          {/* Results Header */}
          <div className="flex items-center justify-between mb-5">
            <p className="text-sm text-muted-foreground">
              <span className="font-semibold text-foreground">{results.length}</span>{" "}
              professionals found
              {query && ` for "${query}"`}
              {location && ` near ${location}`}
            </p>

            {/* Sort */}
            <select
              value={sortBy}
              onChange={(e) => {
                window.location.href = buildFilterUrl({ sort: e.target.value });
              }}
              className="rounded-lg border border-border bg-card px-3 py-1.5 text-sm text-foreground focus:outline-none focus:ring-1 focus:ring-cyan-500/50"
            >
              {SORT_OPTIONS.map((opt) => (
                <option key={opt.value} value={opt.value}>
                  {opt.label}
                </option>
              ))}
            </select>
          </div>

          {/* Empty State */}
          {results.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-20 text-center">
              <div className="text-4xl mb-4">🔍</div>
              <h3 className="font-semibold text-foreground mb-2">No results found</h3>
              <p className="text-sm text-muted-foreground max-w-sm">
                Try adjusting your filters or search for a different keyword, category, or location.
              </p>
              <a
                href="/search"
                className="mt-4 text-sm text-cyan-400 hover:text-cyan-300 transition-colors"
              >
                Clear all filters
              </a>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {results.map((profile) => (
                <ProfileCard key={profile.id} profile={profile} />
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default function SearchPage() {
  return (
    <Suspense
      fallback={
        <div className="container py-8">
          <div className="animate-pulse space-y-6">
            <div className="h-12 bg-secondary rounded-xl" />
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {[1, 2, 3, 4].map((i) => (
                <div key={i} className="h-48 bg-card border border-border rounded-2xl" />
              ))}
            </div>
          </div>
        </div>
      }
    >
      <SearchResults />
    </Suspense>
  );
}
