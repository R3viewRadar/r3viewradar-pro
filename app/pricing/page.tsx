import type { Metadata } from "next";
import Link from "next/link";
import { Check, Zap } from "lucide-react";
import { PRICING_TIERS } from "@/lib/mock-data";

export const metadata: Metadata = {
  title: "Pricing",
  description: "Simple, transparent pricing for professionals ready to grow their reputation.",
};

const FAQS = [
  {
    q: "Can I cancel anytime?",
    a: "Yes. Cancel anytime from your dashboard. You'll keep access until the end of your billing period.",
  },
  {
    q: "Is my profile visible without a paid plan?",
    a: "Yes, all profiles are publicly listed. Paid plans unlock better placement, more features, and more leads.",
  },
  {
    q: "Do you offer refunds?",
    a: "We offer a 14-day money-back guarantee on all paid plans, no questions asked.",
  },
  {
    q: "Can I upgrade or downgrade?",
    a: "Yes, you can change your plan at any time. Changes take effect at the next billing cycle.",
  },
];

export default function PricingPage() {
  return (
    <div className="py-16">
      <div className="container">
        {/* Header */}
        <div className="text-center mb-14">
          <div className="inline-flex items-center gap-2 rounded-full border border-cyan-500/20 bg-cyan-500/5 px-4 py-1.5 text-sm text-cyan-400 mb-5">
            <Zap className="h-3.5 w-3.5" />
            Simple, transparent pricing
          </div>
          <h1 className="text-4xl font-extrabold text-foreground mb-4">
            Grow your reputation.
            <br />
            <span className="gradient-text">Generate more leads.</span>
          </h1>
          <p className="text-muted-foreground max-w-xl mx-auto">
            Start free. Upgrade when you're ready to capture more leads and stand out from the competition.
          </p>
        </div>

        {/* Pricing Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-5xl mx-auto">
          {PRICING_TIERS.map((tier) => (
            <div
              key={tier.id}
              className={`relative rounded-2xl border p-7 flex flex-col ${
                tier.highlighted
                  ? "border-cyan-500/50 bg-gradient-to-b from-cyan-500/10 to-transparent shadow-lg shadow-cyan-500/10"
                  : "border-border bg-card"
              }`}
            >
              {tier.highlighted && (
                <div className="absolute -top-3.5 left-1/2 -translate-x-1/2">
                  <span className="rounded-full bg-cyan-500 px-4 py-1 text-xs font-bold text-black">
                    Most Popular
                  </span>
                </div>
              )}

              {/* Tier Header */}
              <div className="mb-6">
                <h2 className="text-lg font-bold text-foreground">{tier.name}</h2>
                <p className="text-sm text-muted-foreground mt-1">{tier.description}</p>
              </div>

              {/* Price */}
              <div className="mb-6">
                <div className="flex items-end gap-1">
                  <span className="text-4xl font-extrabold text-foreground">
                    ${tier.price_monthly}
                  </span>
                  {tier.price_monthly > 0 && (
                    <span className="text-muted-foreground mb-1.5 text-sm">/month</span>
                  )}
                </div>
                {tier.price_monthly > 0 && tier.price_annual < tier.price_monthly && (
                  <p className="text-xs text-emerald-400 mt-1">
                    ${tier.price_annual}/mo billed annually · Save{" "}
                    {Math.round((1 - tier.price_annual / tier.price_monthly) * 100)}%
                  </p>
                )}
              </div>

              {/* Features */}
              <ul className="space-y-3 flex-1 mb-8">
                {tier.features.map((feature) => (
                  <li key={feature} className="flex items-start gap-3 text-sm">
                    <Check
                      className={`h-4 w-4 shrink-0 mt-0.5 ${
                        tier.highlighted ? "text-cyan-400" : "text-emerald-400"
                      }`}
                    />
                    <span className="text-muted-foreground">{feature}</span>
                  </li>
                ))}
              </ul>

              {/* CTA */}
              <Link
                href={tier.id === "free" ? "/signup" : `/signup?plan=${tier.id}`}
                className={`block text-center rounded-xl py-3 text-sm font-semibold transition-colors ${
                  tier.highlighted
                    ? "bg-cyan-500 text-black hover:bg-cyan-400"
                    : "border border-border bg-secondary hover:bg-white/5"
                }`}
              >
                {tier.cta}
              </Link>
            </div>
          ))}
        </div>

        {/* Feature Comparison Note */}
        <p className="text-center text-sm text-muted-foreground mt-8">
          All plans include a basic profile listing. No credit card required for Starter.
        </p>

        {/* FAQ */}
        <div className="mt-20 max-w-2xl mx-auto">
          <h2 className="text-2xl font-bold text-foreground text-center mb-10">
            Frequently Asked Questions
          </h2>
          <div className="space-y-5">
            {FAQS.map((faq) => (
              <div
                key={faq.q}
                className="rounded-xl border border-border bg-card p-5"
              >
                <h3 className="font-semibold text-foreground mb-2">{faq.q}</h3>
                <p className="text-sm text-muted-foreground">{faq.a}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Bottom CTA */}
        <div className="mt-16 text-center">
          <p className="text-muted-foreground mb-4">
            Still have questions?{" "}
            <a href="mailto:hello@r3viewradar.com" className="text-cyan-400 hover:text-cyan-300 transition-colors">
              Talk to us
            </a>
          </p>
        </div>
      </div>
    </div>
  );
}
