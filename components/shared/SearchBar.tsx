"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Search, MapPin, ChevronDown } from "lucide-react";
import type { Category } from "@/types";

const CATEGORIES: { value: Category | ""; label: string }[] = [
  { value: "", label: "All Categories" },
  { value: "lawyer", label: "Legal" },
  { value: "insurance", label: "Insurance" },
  { value: "finance", label: "Finance" },
  { value: "real-estate", label: "Real Estate" },
];

interface SearchBarProps {
  initialQuery?: string;
  initialCategory?: string;
  initialLocation?: string;
  size?: "default" | "large";
  className?: string;
}

export default function SearchBar({
  initialQuery = "",
  initialCategory = "",
  initialLocation = "",
  size = "default",
  className = "",
}: SearchBarProps) {
  const router = useRouter();
  const [query, setQuery] = useState(initialQuery);
  const [category, setCategory] = useState(initialCategory);
  const [location, setLocation] = useState(initialLocation);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    const params = new URLSearchParams();
    if (query) params.set("q", query);
    if (category) params.set("category", category);
    if (location) params.set("location", location);
    router.push(`/search?${params.toString()}`);
  };

  const isLarge = size === "large";

  return (
    <form
      onSubmit={handleSearch}
      className={`flex flex-col sm:flex-row gap-2 ${className}`}
    >
      {/* Category Select */}
      <div className="relative">
        <select
          value={category}
          onChange={(e) => setCategory(e.target.value)}
          className={`h-full w-full sm:w-44 appearance-none rounded-xl border border-border bg-card px-4 pr-8 text-sm font-medium text-foreground focus:border-cyan-500/50 focus:outline-none focus:ring-1 focus:ring-cyan-500/50 ${
            isLarge ? "py-4" : "py-3"
          }`}
        >
          {CATEGORIES.map((c) => (
            <option key={c.value} value={c.value}>
              {c.label}
            </option>
          ))}
        </select>
        <ChevronDown className="pointer-events-none absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
      </div>

      {/* Search Input */}
      <div className="relative flex-1">
        <Search className="absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search by name, specialty, or firm..."
          className={`w-full rounded-xl border border-border bg-card pl-10 pr-4 text-sm text-foreground placeholder:text-muted-foreground focus:border-cyan-500/50 focus:outline-none focus:ring-1 focus:ring-cyan-500/50 ${
            isLarge ? "py-4" : "py-3"
          }`}
        />
      </div>

      {/* Location Input */}
      <div className="relative sm:w-44">
        <MapPin className="absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
        <input
          type="text"
          value={location}
          onChange={(e) => setLocation(e.target.value)}
          placeholder="City or zip..."
          className={`w-full rounded-xl border border-border bg-card pl-10 pr-4 text-sm text-foreground placeholder:text-muted-foreground focus:border-cyan-500/50 focus:outline-none focus:ring-1 focus:ring-cyan-500/50 ${
            isLarge ? "py-4" : "py-3"
          }`}
        />
      </div>

      {/* Submit */}
      <button
        type="submit"
        className={`rounded-xl bg-cyan-500 font-semibold text-black hover:bg-cyan-400 transition-colors whitespace-nowrap ${
          isLarge ? "px-8 py-4 text-base" : "px-6 py-3 text-sm"
        }`}
      >
        Search
      </button>
    </form>
  );
}
