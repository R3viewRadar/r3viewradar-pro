import Link from "next/link";
import {
  LayoutDashboard, Eye, MessageSquare, Star, TrendingUp,
  ArrowRight, Bell, Settings, Shield, ChevronRight
} from "lucide-react";
import { MOCK_PROFILES, MOCK_LEADS, MOCK_REVIEWS } from "@/lib/mock-data";
import { formatRelativeDate } from "@/lib/utils";
import TrustBadge from "@/components/shared/TrustBadge";
import StarRating from "@/components/shared/StarRating";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Dashboard",
  description: "Manage your R3viewRadar profile, leads, and reputation.",
};

// Mock dashboard profile — in production, load from Supabase based on session
const DASHBOARD_PROFILE = MOCK_PROFILES[0];
const DASHBOARD_LEADS = MOCK_LEADS.filter((l) => l.profile_id === DASHBOARD_PROFILE.id);
const DASHBOARD_REVIEWS = MOCK_REVIEWS.filter((r) => r.profile_id === DASHBOARD_PROFILE.id).slice(0, 3);

const ANALYTICS = [
  {
    label: "Profile Views",
    value: "1,284",
    trend: "+18%",
    positive: true,
    icon: Eye,
    color: "text-blue-400 bg-blue-400/10 border-blue-400/20",
  },
  {
    label: "New Leads",
    value: "24",
    trend: "+32%",
    positive: true,
    icon: MessageSquare,
    color: "text-emerald-400 bg-emerald-400/10 border-emerald-400/20",
  },
  {
    label: "Avg. Rating",
    value: "4.9",
    trend: "+0.2",
    positive: true,
    icon: Star,
    color: "text-amber-400 bg-amber-400/10 border-amber-400/20",
  },
  {
    label: "Trust Score",
    value: "94",
    trend: "+3",
    positive: true,
    icon: Shield,
    color: "text-cyan-400 bg-cyan-400/10 border-cyan-400/20",
  },
];

const LEAD_STATUS_COLORS = {
  new: "text-blue-400 bg-blue-400/10 border-blue-400/20",
  contacted: "text-amber-400 bg-amber-400/10 border-amber-400/20",
  converted: "text-emerald-400 bg-emerald-400/10 border-emerald-400/20",
  lost: "text-red-400 bg-red-400/10 border-red-400/20",
};

export default function DashboardPage() {
  return (
    <div className="container py-8">
      <div className="flex flex-col lg:flex-row gap-8">
        {/* ─── Sidebar ──────────────────────────────────────────────────── */}
        <aside className="w-full lg:w-56 shrink-0">
          <div className="rounded-2xl border border-border bg-card p-4">
            <nav className="space-y-1">
              {[
                { label: "Overview", icon: LayoutDashboard, href: "/dashboard", active: true },
                { label: "Profile", icon: Settings, href: "/dashboard/profile" },
                { label: "Leads", icon: MessageSquare, href: "/dashboard/leads" },
                { label: "Reviews", icon: Star, href: "/dashboard/reviews" },
                { label: "Analytics", icon: TrendingUp, href: "/dashboard/analytics" },
                { label: "Notifications", icon: Bell, href: "/dashboard/notifications" },
              ].map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors ${
                    item.active
                      ? "bg-cyan-500/10 text-cyan-400"
                      : "text-muted-foreground hover:bg-secondary hover:text-foreground"
                  }`}
                >
                  <item.icon className="h-4 w-4" />
                  {item.label}
                </Link>
              ))}
            </nav>

            {/* Upgrade CTA */}
            <div className="mt-6 pt-4 border-t border-border">
              <div className="rounded-xl bg-gradient-to-br from-cyan-500/10 to-blue-500/5 border border-cyan-500/20 p-4 text-center">
                <p className="text-xs font-semibold text-cyan-400 mb-1">Free Plan</p>
                <p className="text-xs text-muted-foreground mb-3">
                  Upgrade to Pro to unlock unlimited leads and AI summaries.
                </p>
                <Link
                  href="/pricing"
                  className="block rounded-lg bg-cyan-500 px-3 py-1.5 text-xs font-semibold text-black hover:bg-cyan-400 transition-colors"
                >
                  Upgrade Now
                </Link>
              </div>
            </div>
          </div>
        </aside>

        {/* ─── Main Content ─────────────────────────────────────────────── */}
        <div className="flex-1 min-w-0 space-y-6">
          {/* Welcome Header */}
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-foreground">
                Welcome back, {DASHBOARD_PROFILE.name.split(" ")[0]}
              </h1>
              <p className="text-sm text-muted-foreground mt-1">
                Here's how your profile is performing
              </p>
            </div>
            <TrustBadge
              score={DASHBOARD_PROFILE.trust_score}
              badge="platinum"
              size="md"
            />
          </div>

          {/* Analytics Cards */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            {ANALYTICS.map((stat) => (
              <div
                key={stat.label}
                className="rounded-2xl border border-border bg-card p-4"
              >
                <div className={`inline-flex h-9 w-9 items-center justify-center rounded-xl border mb-3 ${stat.color}`}>
                  <stat.icon className="h-4 w-4" />
                </div>
                <p className="text-2xl font-bold text-foreground">{stat.value}</p>
                <p className="text-xs text-muted-foreground mt-0.5">{stat.label}</p>
                <p className={`text-xs font-medium mt-1 ${stat.positive ? "text-emerald-400" : "text-red-400"}`}>
                  {stat.trend} this month
                </p>
              </div>
            ))}
          </div>

          {/* Recent Leads + Reviews */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Leads */}
            <div className="rounded-2xl border border-border bg-card p-5">
              <div className="flex items-center justify-between mb-4">
                <h2 className="font-semibold text-foreground">Recent Leads</h2>
                <Link
                  href="/dashboard/leads"
                  className="flex items-center gap-1 text-xs text-cyan-400 hover:text-cyan-300 transition-colors"
                >
                  View all <ChevronRight className="h-3 w-3" />
                </Link>
              </div>

              {DASHBOARD_LEADS.length === 0 ? (
                <div className="py-8 text-center">
                  <MessageSquare className="h-8 w-8 text-muted-foreground/30 mx-auto mb-2" />
                  <p className="text-sm text-muted-foreground">No leads yet</p>
                  <p className="text-xs text-muted-foreground/60 mt-1">
                    Upgrade to Pro to capture unlimited leads
                  </p>
                </div>
              ) : (
                <div className="space-y-3">
                  {DASHBOARD_LEADS.map((lead) => (
                    <div
                      key={lead.id}
                      className="flex items-start justify-between gap-3 rounded-xl border border-border p-3"
                    >
                      <div className="min-w-0">
                        <p className="text-sm font-medium text-foreground truncate">
                          {lead.name}
                        </p>
                        <p className="text-xs text-muted-foreground truncate">
                          {lead.service_type}
                        </p>
                        <p className="text-xs text-muted-foreground mt-0.5">
                          {formatRelativeDate(lead.created_at)}
                        </p>
                      </div>
                      <span
                        className={`shrink-0 rounded-full border px-2 py-0.5 text-[10px] font-medium capitalize ${
                          LEAD_STATUS_COLORS[lead.status]
                        }`}
                      >
                        {lead.status}
                      </span>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Recent Reviews */}
            <div className="rounded-2xl border border-border bg-card p-5">
              <div className="flex items-center justify-between mb-4">
                <h2 className="font-semibold text-foreground">Recent Reviews</h2>
                <Link
                  href="/dashboard/reviews"
                  className="flex items-center gap-1 text-xs text-cyan-400 hover:text-cyan-300 transition-colors"
                >
                  View all <ChevronRight className="h-3 w-3" />
                </Link>
              </div>

              {DASHBOARD_REVIEWS.length === 0 ? (
                <div className="py-8 text-center">
                  <Star className="h-8 w-8 text-muted-foreground/30 mx-auto mb-2" />
                  <p className="text-sm text-muted-foreground">No reviews yet</p>
                </div>
              ) : (
                <div className="space-y-3">
                  {DASHBOARD_REVIEWS.map((review) => (
                    <div key={review.id} className="rounded-xl border border-border p-3">
                      <div className="flex items-center justify-between gap-2 mb-1">
                        <p className="text-sm font-medium text-foreground">{review.author_name}</p>
                        <StarRating rating={review.rating} size="sm" />
                      </div>
                      <p className="text-xs text-muted-foreground line-clamp-2">{review.body}</p>
                      <p className="text-[10px] text-muted-foreground/60 mt-1.5 capitalize">
                        via {review.platform} · {formatRelativeDate(review.created_at)}
                      </p>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Profile Completion */}
          <div className="rounded-2xl border border-border bg-card p-5">
            <div className="flex items-center justify-between mb-4">
              <h2 className="font-semibold text-foreground">Profile Strength</h2>
              <span className="text-sm font-semibold text-cyan-400">87%</span>
            </div>
            <div className="h-2 w-full rounded-full bg-secondary mb-4">
              <div className="h-full rounded-full bg-cyan-500" style={{ width: "87%" }} />
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {[
                { label: "Add profile photo", done: true },
                { label: "Complete bio", done: true },
                { label: "Add specialties", done: true },
                { label: "Link social profiles", done: false },
                { label: "Add certifications", done: true },
                { label: "Connect review platforms", done: false },
              ].map((item) => (
                <div key={item.label} className="flex items-center gap-2 text-sm">
                  <div className={`h-4 w-4 rounded-full border flex items-center justify-center ${item.done ? "bg-emerald-500 border-emerald-500" : "border-border"}`}>
                    {item.done && <span className="text-white text-[8px] font-bold">✓</span>}
                  </div>
                  <span className={item.done ? "text-muted-foreground line-through" : "text-foreground"}>
                    {item.label}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
