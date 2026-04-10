import Link from "next/link";
import { Shield } from "lucide-react";

const FOOTER_LINKS = {
  Product: [
    { label: "Search", href: "/search" },
    { label: "Pricing", href: "/pricing" },
    { label: "Get Listed", href: "/signup" },
    { label: "Dashboard", href: "/dashboard" },
  ],
  Categories: [
    { label: "Legal Professionals", href: "/search?category=lawyer" },
    { label: "Insurance Advisors", href: "/search?category=insurance" },
    { label: "Financial Advisors", href: "/search?category=finance" },
    { label: "Real Estate Agents", href: "/search?category=real-estate" },
  ],
  Company: [
    { label: "About", href: "/about" },
    { label: "Contact", href: "/contact" },
    { label: "Privacy Policy", href: "/privacy" },
    { label: "Terms of Service", href: "/terms" },
  ],
};

export default function Footer() {
  return (
    <footer className="border-t border-border bg-background">
      <div className="container py-12 md:py-16">
        <div className="grid grid-cols-2 gap-8 md:grid-cols-4">
          {/* Brand */}
          <div className="col-span-2 md:col-span-1">
            <Link href="/" className="flex items-center gap-2 mb-4">
              <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-cyan-500/10 border border-cyan-500/30">
                <Shield className="h-3.5 w-3.5 text-cyan-400" />
              </div>
              <span className="text-base font-bold">
                R3view<span className="text-cyan-400">Radar</span>
              </span>
            </Link>
            <p className="text-sm text-muted-foreground leading-relaxed max-w-xs">
              The trusted reputation search engine for legal, insurance, financial, and real estate professionals.
            </p>
          </div>

          {/* Links */}
          {Object.entries(FOOTER_LINKS).map(([category, links]) => (
            <div key={category}>
              <h3 className="text-sm font-semibold text-foreground mb-3">{category}</h3>
              <ul className="space-y-2">
                {links.map((link) => (
                  <li key={link.href}>
                    <Link
                      href={link.href}
                      className="text-sm text-muted-foreground hover:text-foreground transition-colors"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="mt-12 pt-6 border-t border-border flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-xs text-muted-foreground">
            &copy; {new Date().getFullYear()} R3viewRadar. All rights reserved.
          </p>
          <p className="text-xs text-muted-foreground">
            Search Reputation. Find Trust.
          </p>
        </div>
      </div>
    </footer>
  );
}
