# R3viewRadar — Professional Reputation Search Engine

> Search Reputation. Find Trust.

A premium reputation search and lead generation platform for lawyers, insurance agents, financial advisors, and real estate professionals.

## Tech Stack

- **Next.js 14** (App Router, Server Components)
- **TypeScript** (strict mode)
- **Tailwind CSS** + **shadcn/ui**
- **Supabase** (Auth + PostgreSQL)
- **Stripe** (Subscriptions)
- **OpenAI** (AI-powered summaries)
- **Vercel** (Deployment)

## Quick Start

### 1. Clone and Install

```bash
git clone https://github.com/R3viewRadar/r3viewradar-pro.git
cd r3viewradar-pro
npm install
```

### 2. Configure Environment

```bash
cp .env.example .env.local
# Edit .env.local with your credentials
```

### 3. Run Development Server

```bash
npm run dev
# Open http://localhost:3000
```

## Features

| Feature | Free | Pro | Business |
|---|---|---|---|
| Profile listing | ✅ | ✅ | ✅ |
| Trust Score | ✅ | ✅ | ✅ |
| Lead form | 5/mo | Unlimited | Unlimited |
| AI Summary | ❌ | ✅ | ✅ |
| Priority placement | ❌ | ✅ | ✅ |
| Analytics dashboard | ❌ | ✅ | ✅ |
| Custom profile URL | ❌ | ❌ | ✅ |
| API access | ❌ | ❌ | ✅ |

## Project Structure

```
r3viewradar-pro/
├── app/
│   ├── page.tsx              # Homepage
│   ├── search/page.tsx       # Search results
│   ├── profile/[slug]/       # Dynamic profile pages
│   ├── dashboard/page.tsx    # Protected dashboard
│   ├── pricing/page.tsx      # Pricing tiers
│   ├── login/page.tsx        # Auth pages
│   ├── signup/page.tsx
│   └── api/                  # API routes
│       ├── leads/route.ts
│       └── profiles/route.ts
├── components/
│   └── shared/               # Reusable components
│       ├── Navbar.tsx
│       ├── Footer.tsx
│       ├── SearchBar.tsx
│       ├── ProfileCard.tsx
│       ├── TrustBadge.tsx
│       ├── StarRating.tsx
│       └── LeadForm.tsx
├── lib/
│   ├── utils.ts              # Utility functions
│   ├── trust-score.ts        # Trust Score algorithm
│   ├── mock-data.ts          # Seed/mock data
│   ├── supabase.ts           # Supabase client
│   ├── ai-summary.ts         # OpenAI integration
│   └── stripe.ts             # Stripe integration
├── types/
│   └── index.ts              # TypeScript types
├── supabase/
│   └── schema.sql            # Database schema
└── .env.example              # Environment variables template
```

## Database Setup (Supabase)

1. Create a project at [supabase.com](https://supabase.com)
2. Go to **SQL Editor**
3. Run `supabase/schema.sql`
4. Copy your project URL and anon key to `.env.local`

## Deployment (Vercel)

### Option 1: Import from GitHub (Recommended)

1. Push your code to GitHub
2. Go to [vercel.com/new](https://vercel.com/new)
3. Import your repository
4. Set **Framework Preset**: Next.js
5. Add environment variables from `.env.example`
6. Click **Deploy**

### Option 2: Vercel CLI

```bash
npm install -g vercel
vercel login
vercel --prod
```

## GitHub Setup

```bash
git init
git add -A
git commit -m "Initial commit: R3viewRadar MVP"
git branch -M main
git remote add origin https://github.com/YOUR_USERNAME/r3viewradar-pro.git
git push -u origin main
```

## Connecting Real APIs

### Supabase
Replace the mock data in `lib/mock-data.ts` with Supabase queries:
```ts
const { data } = await supabase.from('business_profiles').select('*');
```

### Stripe
Configure webhooks at `https://your-domain.com/api/stripe/webhook`

### OpenAI
Add your API key — AI summaries will automatically activate.

## Trust Score Algorithm

The Trust Score (0-100) is calculated from:
- **Review Volume** (25 pts) — how many reviews
- **Rating Quality** (25 pts) — average rating weighted by recency
- **Platform Diversity** (20 pts) — reviews across multiple platforms
- **Verified Credentials** (20 pts) — licenses, certifications, claimed profile
- **Response Rate** (10 pts) — how quickly they respond to leads

## License

MIT License — see LICENSE for details.
