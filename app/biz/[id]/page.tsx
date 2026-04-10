"use client";

import { useParams, useSearchParams } from "next/navigation";
import { Suspense, useEffect, useState } from "react";
import Link from "next/link";
import {
  ArrowLeft, Star, MapPin, Phone, Globe, Navigation, Clock,
  MessageSquare, CheckCircle, Quote, Loader2, ExternalLink
} from "lucide-react";

interface PlaceReview {
  author: string;
  rating: number;
  text: string;
  time_ago: string;
}

interface PlaceDetail {
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
  is_open: boolean | null;
  lat: number;
  lng: number;
  review_summary: string;
  top_reviews: PlaceReview[];
}

function BusinessDetail() {
  const params = useParams<{ id: string }>();
  const searchParams = useSearchParams();
  const name = searchParams.get("name") ?? "Business";
  const lat = searchParams.get("lat") ?? "";
  const lng = searchParams.get("lng") ?? "";

  const [place, setPlace] = useState<PlaceDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchPlace = async () => {
      setLoading(true);
      try {
        // Search for this specific business by name + coordinates
        const sp = new URLSearchParams();
        sp.set("q", name);
        if (lat) sp.set("lat", lat);
        if (lng) sp.set("lng", lng);
        sp.set("limit", "1");
        sp.set("radius", "2");

        const res = await fetch(`/api/search?${sp.toString()}`);
        if (!res.ok) throw new Error("Failed to load");
        const data = await res.json();
        if (data.results?.length > 0) {
          setPlace(data.results[0]);
        } else {
          setError("Business not found.");
        }
      } catch {
        setError("Failed to load business details.");
      } finally {
        setLoading(false);
      }
    };
    fetchPlace();
  }, [name, lat, lng]);

  if (loading) {
    return (
      <div className="container py-20 flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="h-8 w-8 animate-spin text-cyan-400 mx-auto mb-4" />
          <p className="text-sm text-muted-foreground">Loading {name}...</p>
        </div>
      </div>
    );
  }

  if (error || !place) {
    return (
      <div className="container py-20 text-center">
        <p className="text-lg font-semibold text-foreground mb-2">Not Found</p>
        <p className="text-sm text-muted-foreground mb-4">{error}</p>
        <Link href="/search" className="text-sm text-cyan-400 hover:text-cyan-300 transition-colors">
          Back to search
        </Link>
      </div>
    );
  }

  function ensureProtocol(url: string): string {
    if (!url) return "";
    if (url.startsWith("http")) return url;
    return `https://${url}`;
  }

  return (
    <div className="container py-8 max-w-4xl">
      {/* Back link */}
      <Link
        href="/search"
        className="inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground transition-colors mb-6"
      >
        <ArrowLeft className="h-4 w-4" />
        Back to results
      </Link>

      {/* Business Header */}
      <div className="rounded-2xl border border-border bg-card p-6 mb-6">
        <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold text-foreground">{place.name}</h1>
            {place.category && (
              <p className="text-sm text-muted-foreground mt-1">{place.category}</p>
            )}
            <div className="flex flex-wrap items-center gap-4 mt-3">
              <span className="flex items-center gap-1.5 text-sm text-muted-foreground">
                <MapPin className="h-4 w-4 shrink-0" />
                {place.address}
              </span>
              {place.hours_status && (
                <span className={`flex items-center gap-1 text-sm ${
                  place.is_open ? "text-emerald-400" : place.is_open === false ? "text-red-400" : "text-muted-foreground"
                }`}>
                  <Clock className="h-4 w-4" />
                  {place.hours_status}
                </span>
              )}
            </div>
          </div>

          {/* Rating Badge */}
          {place.rating > 0 && (
            <div className="flex flex-col items-center shrink-0 bg-secondary rounded-xl px-5 py-3 border border-border">
              <span className="text-3xl font-black text-foreground">{place.rating.toFixed(1)}</span>
              <div className="flex items-center gap-0.5 mt-1">
                {Array.from({ length: 5 }).map((_, i) => (
                  <Star key={i} className={`h-4 w-4 ${i < Math.round(place.rating) ? "fill-amber-400 text-amber-400" : "fill-muted text-muted"}`} />
                ))}
              </div>
              <span className="text-xs text-muted-foreground mt-1">{place.review_count.toLocaleString()} reviews</span>
            </div>
          )}
        </div>

        {/* Action Buttons */}
        <div className="flex items-center gap-3 mt-5 pt-5 border-t border-border flex-wrap">
          {place.maps_url && (
            <a
              href={place.lat && place.lng ? `https://www.google.com/maps/dir/?api=1&destination=${place.lat},${place.lng}` : place.maps_url}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 px-4 py-2.5 rounded-xl bg-cyan-500 text-black text-sm font-semibold select-none [-webkit-tap-highlight-color:transparent] active:opacity-80 hover:bg-cyan-400 transition-colors"
            >
              <Navigation className="h-4 w-4 pointer-events-none" />
              <span className="pointer-events-none">Get Directions</span>
            </a>
          )}
          {place.phone && (
            <a
              href={`tel:${place.phone.replace(/[^+\d]/g, "")}`}
              className="inline-flex items-center gap-1.5 px-4 py-2.5 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-sm font-semibold select-none [-webkit-tap-highlight-color:transparent] active:opacity-80 hover:bg-emerald-500/20 transition-colors"
            >
              <Phone className="h-4 w-4 pointer-events-none" />
              <span className="pointer-events-none">{place.phone}</span>
            </a>
          )}
          {place.website && (
            <a
              href={ensureProtocol(place.website)}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 px-4 py-2.5 rounded-xl border border-border bg-secondary text-foreground text-sm font-semibold select-none [-webkit-tap-highlight-color:transparent] active:opacity-80 hover:border-cyan-500/20 transition-colors"
            >
              <Globe className="h-4 w-4 pointer-events-none" />
              <span className="pointer-events-none">Visit Website</span>
              <ExternalLink className="h-3 w-3 pointer-events-none text-muted-foreground" />
            </a>
          )}
        </div>
      </div>

      {/* Review Summary */}
      {place.review_summary && (
        <div className="rounded-2xl border border-cyan-500/20 bg-cyan-500/5 p-6 mb-6">
          <div className="flex items-center gap-2 mb-3">
            <MessageSquare className="h-4 w-4 text-cyan-400" />
            <span className="text-xs font-semibold text-cyan-400 uppercase tracking-widest">Review Summary</span>
          </div>
          <p className="text-sm text-muted-foreground leading-relaxed">{place.review_summary}</p>
        </div>
      )}

      {/* Reviews */}
      {place.top_reviews && place.top_reviews.length > 0 && (
        <div className="rounded-2xl border border-border bg-card p-6">
          <h2 className="text-lg font-semibold text-foreground mb-5 flex items-center gap-2">
            <Star className="h-5 w-5 text-amber-400" />
            Reviews
          </h2>
          <div className="space-y-4">
            {place.top_reviews.map((review, i) => (
              <div key={i} className="rounded-xl border border-border p-4">
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-2">
                    <div className="w-8 h-8 rounded-full bg-secondary flex items-center justify-center text-xs font-bold text-foreground">
                      {review.author.charAt(0).toUpperCase()}
                    </div>
                    <div>
                      <p className="text-sm font-semibold text-foreground">{review.author}</p>
                      {review.time_ago && (
                        <p className="text-[10px] text-muted-foreground">{review.time_ago}</p>
                      )}
                    </div>
                  </div>
                  <div className="flex items-center gap-0.5">
                    {Array.from({ length: 5 }).map((_, j) => (
                      <Star key={j} className={`h-3.5 w-3.5 ${j < review.rating ? "fill-amber-400 text-amber-400" : "fill-muted text-muted"}`} />
                    ))}
                  </div>
                </div>
                <p className="text-sm text-muted-foreground leading-relaxed">{review.text}</p>
              </div>
            ))}
          </div>

          {place.maps_url && (
            <a
              href={place.maps_url}
              target="_blank"
              rel="noopener noreferrer"
              className="block mt-4 text-center text-sm text-cyan-400 hover:text-cyan-300 transition-colors"
            >
              View all {place.review_count.toLocaleString()} reviews on Google
              <ExternalLink className="inline h-3 w-3 ml-1" />
            </a>
          )}
        </div>
      )}
    </div>
  );
}

export default function BizPage() {
  return (
    <Suspense fallback={
      <div className="container py-20 flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-cyan-400" />
      </div>
    }>
      <BusinessDetail />
    </Suspense>
  );
}
