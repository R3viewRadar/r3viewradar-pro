"use client";

import { useSearchParams } from "next/navigation";
import { Suspense, useEffect, useState } from "react";
import Link from "next/link";
import {
  SlidersHorizontal, Star, MapPin, Phone, Globe,
  Navigation, Clock, Loader2, AlertCircle
} from "lucide-react";
import SearchBar from "@/components/shared/SearchBar";

interface SearchResult {
  id: string;
  name: string;
  address: string;
  category: string;
  rating: number;
  review_count: number;
  phone: string;
  website: string;
  maps_url: string;
  hours_status: string;
  distance_miles: number;
  distance_label: string;
  is_open: boolean | null;
}

interface SearchResponse {
  results: SearchResult[];
  total: number;
  query: string;
  source: string;
}

const SORT_OPTIONS = [
  { value: "relevance", label: "Most Relevant" },
  { value: "rating", label: "Highest Rated" },
  { value: "distance", label: "Nearest" },
  { value: "review_count", label: "Most Reviewed" },
];

const RADIUS_OPTIONS = [
  { value: "5", label: "5 miles" },
  { value: "10", label: "10 miles" },
  { value: "25", label: "25 miles" },
  { value: "50", label: "50 miles" },
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
  const category = searchParams.get("category") ?? "";
  const location = searchParams.get("location") ?? "";
  const lat = searchParams.get("lat") ?? "";
  const lng = searchParams.get("lng") ?? "";
  const sortBy = searchParams.get("sort") ?? "relevance";
  const radius = searchParams.get("radius") ?? "25";

  const [results, setResults] = useState<SearchResult[]>([]);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [source, setSource] = useState("");

  // Fetch results from API
  useEffect(() => {
    if (!query && !category) {
      setResults([]);
      setTotal(0);
      return;
    }

    const fetchResults = async () => {
      setLoading(true);
      setError("");
      try {
        const params = new URLSearchParams();
        if (query) params.set("q", query);
        if (category) params.set("category", category);
        if (lat) params.set("lat", lat);
        if (lng) params.set("lng", lng);
        if (location) params.set("location", location);
        params.set("sort", sortBy);
        params.set("radius", radius);

        const res = await fetch(`/api/search?${params.toString()}`);
        if (!res.ok) throw new Error("Search failed");

        const data: SearchResponse = await res.json();
        setResults(data.results);
        setTotal(data.total);
        setSource(data.source);
      } catch {
        setError("Search failed. Please try again.");
        setResults([]);
      } finally {
        setLoading(false);
      }
    };

    fetchResults();
  }, [query, category, location, lat, lng, sortBy, radius]);

  function buildFilterUrl(params: Record<string, string>): string {
    const base: Record<string, string> = {};
    if (query) base.q = query;
    if (category) base.category = category;
    if (location) base.location = location;
    if (lat) base.lat = lat;
    if (lng) base.lng = lng;
    if (radius !== "25") base.radius = radius;
    const merged = { ...base, ...params };
    Object.keys(merged).forEach((k) => {
      if (!merged[k]) delete merged[k];
    });
    return `/search?${new URLSearchParams(merged).toString()}`;
  }

  return (
    <div className="container py-8">
      {/* Search Bar */}
      <div className="mb-8">
        <SearchBar
          initialQuery={query}
          initialCategory={category}
          initialLocation={location || (lat ? "My Location" : "")}
        />
      </div>

      <div className="flex flex-col lg:flex-row gap-8">
        {/* ─── Sidebar ──────────────────────────────────────────────────── */}
        <aside className="w-full lg:w-64 shrink-0 space-y-4">
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
                    className={`flex items-center rounded-lg px-3 py-2 text-sm transition-colors ${
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

            {/* Radius */}
            <div>
              <p className="text-xs font-medium text-muted-foreground uppercase tracking-widest mb-3">
                Search Radius
              </p>
              <div className="space-y-1.5">
                {RADIUS_OPTIONS.map((r) => (
                  <a
                    key={r.value}
                    href={buildFilterUrl({ radius: r.value })}
                    className={`block rounded-lg px-3 py-2 text-sm transition-colors ${
                      radius === r.value
                        ? "bg-cyan-500/10 text-cyan-400 border border-cyan-500/20"
                        : "text-muted-foreground hover:bg-secondary hover:text-foreground"
                    }`}
                  >
                    {r.label}
                  </a>
                ))}
              </div>
            </div>
          </div>
        </aside>

        {/* ─── Results ──────────────────────────────────────────────────── */}
        <div className="flex-1 min-w-0">
          {/* Header */}
          <div className="flex items-center justify-between mb-5">
            <div>
              <p className="text-sm text-muted-foreground">
                {loading ? (
                  <span className="flex items-center gap-2">
                    <Loader2 className="h-3.5 w-3.5 animate-spin" />
                    Searching...
                  </span>
                ) : (
                  <>
                    <span className="font-semibold text-foreground">{total}</span>{" "}
                    results found
                    {query && ` for "${query}"`}
                    {(location || lat) && ` near ${location || "your location"}`}
                  </>
                )}
              </p>
              {source === "google_places" && !loading && total > 0 && (
                <p className="text-[10px] text-emerald-400/60 mt-0.5">
                  Live results from Google Places
                </p>
              )}
            </div>

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

          {/* Error */}
          {error && (
            <div className="flex items-center gap-3 rounded-xl bg-red-500/10 border border-red-500/20 px-4 py-3 mb-5">
              <AlertCircle className="h-4 w-4 text-red-400 shrink-0" />
              <p className="text-sm text-red-400">{error}</p>
            </div>
          )}

          {/* Loading Skeletons */}
          {loading && (
            <div className="space-y-3">
              {[1, 2, 3, 4, 5].map((i) => (
                <div key={i} className="rounded-2xl border border-border bg-card p-5 animate-pulse">
                  <div className="flex gap-4">
                    <div className="w-8 h-8 rounded-lg bg-secondary" />
                    <div className="flex-1 space-y-2">
                      <div className="h-4 bg-secondary rounded w-48" />
                      <div className="h-3 bg-secondary rounded w-72" />
                      <div className="h-3 bg-secondary rounded w-32" />
                    </div>
                    <div className="w-16 h-6 bg-secondary rounded" />
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Empty State */}
          {!loading && !error && total === 0 && (query || category) && (
            <div className="flex flex-col items-center justify-center py-20 text-center">
              <div className="text-4xl mb-4">🔍</div>
              <h3 className="font-semibold text-foreground mb-2">No results found</h3>
              <p className="text-sm text-muted-foreground max-w-sm">
                Try a different search term, broader category, or increase the search radius.
              </p>
              <a
                href="/search"
                className="mt-4 text-sm text-cyan-400 hover:text-cyan-300 transition-colors"
              >
                Clear all filters
              </a>
            </div>
          )}

          {/* No Query State */}
          {!loading && !query && !category && (
            <div className="flex flex-col items-center justify-center py-20 text-center">
              <div className="text-4xl mb-4">🏢</div>
              <h3 className="font-semibold text-foreground mb-2">
                Search for professionals
              </h3>
              <p className="text-sm text-muted-foreground max-w-sm">
                Enter a name, specialty, or firm in the search bar above.
                Use the category filter to narrow results.
              </p>
            </div>
          )}

          {/* Result Cards */}
          {!loading && results.length > 0 && (
            <div className="space-y-3">
              {results.map((result, idx) => (
                <div
                  key={result.id}
                  className="group rounded-2xl border border-border bg-card p-5 transition-all hover:border-cyan-500/20 hover:shadow-lg hover:shadow-cyan-500/5"
                >
                  <div className="flex items-start gap-4">
                    {/* Rank */}
                    <div className="w-8 h-8 rounded-lg bg-secondary flex items-center justify-center text-xs font-bold text-muted-foreground shrink-0">
                      {idx + 1}
                    </div>

                    {/* Info */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between gap-3">
                        <div className="min-w-0">
                          <h3 className="font-semibold text-foreground group-hover:text-cyan-400 transition-colors truncate">
                            {result.name}
                          </h3>
                          <div className="flex flex-wrap items-center gap-x-3 gap-y-1 mt-1">
                            {result.category && (
                              <span className="text-xs text-muted-foreground">
                                {result.category}
                              </span>
                            )}
                            <span className="flex items-center gap-1 text-xs text-muted-foreground">
                              <MapPin className="h-3 w-3 shrink-0" />
                              {result.address}
                            </span>
                          </div>
                        </div>

                        {/* Distance */}
                        {result.distance_label && (
                          <span className="text-xs font-semibold text-muted-foreground bg-secondary px-2.5 py-1 rounded-md shrink-0">
                            {result.distance_label}
                          </span>
                        )}
                      </div>

                      {/* Rating + Hours */}
                      <div className="flex items-center gap-4 mt-2">
                        {result.rating > 0 && (
                          <div className="flex items-center gap-1.5">
                            <div className="flex items-center gap-0.5">
                              {Array.from({ length: 5 }).map((_, i) => (
                                <Star
                                  key={i}
                                  className={`h-3.5 w-3.5 ${
                                    i < Math.round(result.rating)
                                      ? "fill-amber-400 text-amber-400"
                                      : "fill-muted text-muted"
                                  }`}
                                />
                              ))}
                            </div>
                            <span className="text-sm font-semibold text-foreground">
                              {result.rating.toFixed(1)}
                            </span>
                            <span className="text-xs text-muted-foreground">
                              ({result.review_count.toLocaleString()})
                            </span>
                          </div>
                        )}
                        {result.hours_status && (
                          <span
                            className={`flex items-center gap-1 text-xs ${
                              result.is_open
                                ? "text-emerald-400"
                                : result.is_open === false
                                ? "text-red-400"
                                : "text-muted-foreground"
                            }`}
                          >
                            <Clock className="h-3 w-3" />
                            {result.hours_status}
                          </span>
                        )}
                      </div>

                      {/* Action Buttons */}
                      <div className="flex items-center gap-2 mt-3 flex-wrap">
                        {result.maps_url && (
                          <a
                            href={result.maps_url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center gap-1 px-2.5 py-1.5 rounded-md bg-cyan-500/10 border border-cyan-500/20 text-cyan-400 text-xs font-semibold hover:bg-cyan-500/20 transition-all"
                          >
                            <Navigation className="h-3 w-3" />
                            Directions
                          </a>
                        )}
                        {result.phone && (
                          <a
                            href={`tel:${result.phone.replace(/[^+\d]/g, "")}`}
                            className="inline-flex items-center gap-1 px-2.5 py-1.5 rounded-md bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs font-semibold hover:bg-emerald-500/20 transition-all"
                          >
                            <Phone className="h-3 w-3" />
                            {result.phone}
                          </a>
                        )}
                        {result.website && (
                          <a
                            href={result.website}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center gap-1 px-2.5 py-1.5 rounded-md bg-secondary border border-border text-foreground text-xs font-semibold hover:border-cyan-500/20 transition-all"
                          >
                            <Globe className="h-3 w-3" />
                            Website
                          </a>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
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
          <div className="flex items-center justify-center py-20">
            <Loader2 className="h-6 w-6 animate-spin text-cyan-400" />
          </div>
        </div>
      }
    >
      <SearchResults />
    </Suspense>
  );
}
