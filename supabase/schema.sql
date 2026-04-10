-- ============================================================
-- R3viewRadar — Supabase Database Schema
-- Run this in your Supabase SQL Editor
-- ============================================================

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- ─── Profiles (User Auth Profiles) ────────────────────────────────────────
CREATE TABLE profiles (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  auth_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  email TEXT UNIQUE NOT NULL,
  name TEXT NOT NULL,
  avatar_url TEXT,
  role TEXT DEFAULT 'professional' CHECK (role IN ('professional', 'admin', 'user')),
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- RLS
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users can view all profiles" ON profiles FOR SELECT USING (true);
CREATE POLICY "Users can update their own profile" ON profiles FOR UPDATE USING (auth.uid() = auth_id);

-- ─── Business Profiles ────────────────────────────────────────────────────
CREATE TABLE business_profiles (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  owner_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
  slug TEXT UNIQUE NOT NULL,
  name TEXT NOT NULL,
  title TEXT NOT NULL,
  category TEXT NOT NULL CHECK (category IN ('lawyer', 'insurance', 'finance', 'real-estate')),
  subcategory TEXT NOT NULL,
  bio TEXT,
  location TEXT,
  city TEXT,
  state TEXT,
  zip TEXT,
  phone TEXT,
  email TEXT,
  website TEXT,
  avatar_url TEXT,
  verified BOOLEAN DEFAULT FALSE,
  claimed BOOLEAN DEFAULT FALSE,
  trust_score INTEGER DEFAULT 0,
  overall_rating DECIMAL(3,2) DEFAULT 0,
  review_count INTEGER DEFAULT 0,
  years_experience INTEGER DEFAULT 0,
  specialties TEXT[] DEFAULT '{}',
  languages TEXT[] DEFAULT '{}',
  education JSONB DEFAULT '[]',
  certifications TEXT[] DEFAULT '{}',
  social_links JSONB DEFAULT '{}',
  subscription_tier TEXT DEFAULT 'free' CHECK (subscription_tier IN ('free', 'pro', 'business')),
  stripe_customer_id TEXT,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

CREATE INDEX business_profiles_category_idx ON business_profiles(category);
CREATE INDEX business_profiles_city_state_idx ON business_profiles(city, state);
CREATE INDEX business_profiles_trust_score_idx ON business_profiles(trust_score DESC);
CREATE INDEX business_profiles_slug_idx ON business_profiles(slug);

ALTER TABLE business_profiles ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Anyone can view business profiles" ON business_profiles FOR SELECT USING (true);
CREATE POLICY "Owners can update their profiles" ON business_profiles FOR UPDATE USING (
  auth.uid() = (SELECT auth_id FROM profiles WHERE id = owner_id)
);
CREATE POLICY "Authenticated users can create profiles" ON business_profiles FOR INSERT WITH CHECK (
  auth.uid() IS NOT NULL
);

-- ─── Reviews ──────────────────────────────────────────────────────────────
CREATE TABLE reviews (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  profile_id UUID REFERENCES business_profiles(id) ON DELETE CASCADE,
  author_name TEXT NOT NULL,
  author_avatar TEXT,
  rating INTEGER NOT NULL CHECK (rating BETWEEN 1 AND 5),
  title TEXT,
  body TEXT NOT NULL,
  platform TEXT NOT NULL CHECK (platform IN ('google', 'yelp', 'avvo', 'martindale', 'linkedin', 'trustpilot', 'bbb', 'internal')),
  verified BOOLEAN DEFAULT FALSE,
  helpful_count INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT now()
);

CREATE INDEX reviews_profile_id_idx ON reviews(profile_id);
CREATE INDEX reviews_rating_idx ON reviews(rating);
CREATE INDEX reviews_platform_idx ON reviews(platform);

ALTER TABLE reviews ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Anyone can view reviews" ON reviews FOR SELECT USING (true);
CREATE POLICY "Authenticated users can insert reviews" ON reviews FOR INSERT WITH CHECK (auth.uid() IS NOT NULL);

-- ─── Leads ────────────────────────────────────────────────────────────────
CREATE TABLE leads (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  profile_id UUID REFERENCES business_profiles(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  email TEXT NOT NULL,
  phone TEXT,
  message TEXT NOT NULL,
  service_type TEXT,
  status TEXT DEFAULT 'new' CHECK (status IN ('new', 'contacted', 'converted', 'lost')),
  notes TEXT,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

CREATE INDEX leads_profile_id_idx ON leads(profile_id);
CREATE INDEX leads_status_idx ON leads(status);
CREATE INDEX leads_created_at_idx ON leads(created_at DESC);

ALTER TABLE leads ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Profile owners can view their leads" ON leads FOR SELECT USING (
  auth.uid() = (
    SELECT p.auth_id FROM profiles p
    JOIN business_profiles bp ON bp.owner_id = p.id
    WHERE bp.id = profile_id
  )
);
CREATE POLICY "Anyone can insert leads" ON leads FOR INSERT WITH CHECK (true);
CREATE POLICY "Profile owners can update lead status" ON leads FOR UPDATE USING (
  auth.uid() = (
    SELECT p.auth_id FROM profiles p
    JOIN business_profiles bp ON bp.owner_id = p.id
    WHERE bp.id = profile_id
  )
);

-- ─── Subscriptions ────────────────────────────────────────────────────────
CREATE TABLE subscriptions (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  profile_id UUID REFERENCES business_profiles(id) ON DELETE CASCADE,
  stripe_subscription_id TEXT UNIQUE,
  stripe_customer_id TEXT,
  stripe_price_id TEXT,
  tier TEXT NOT NULL CHECK (tier IN ('free', 'pro', 'business')),
  status TEXT DEFAULT 'active' CHECK (status IN ('active', 'canceled', 'past_due', 'trialing')),
  current_period_start TIMESTAMPTZ,
  current_period_end TIMESTAMPTZ,
  cancel_at_period_end BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

ALTER TABLE subscriptions ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Owners can view their subscriptions" ON subscriptions FOR SELECT USING (
  auth.uid() = (
    SELECT p.auth_id FROM profiles p
    JOIN business_profiles bp ON bp.owner_id = p.id
    WHERE bp.id = profile_id
  )
);

-- ─── Triggers: update timestamps ──────────────────────────────────────────
CREATE OR REPLACE FUNCTION update_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER profiles_updated_at BEFORE UPDATE ON profiles
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();

CREATE TRIGGER business_profiles_updated_at BEFORE UPDATE ON business_profiles
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();

CREATE TRIGGER leads_updated_at BEFORE UPDATE ON leads
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();

CREATE TRIGGER subscriptions_updated_at BEFORE UPDATE ON subscriptions
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();

-- ─── Seed Data ────────────────────────────────────────────────────────────
-- Insert mock profiles for testing
INSERT INTO business_profiles (
  slug, name, title, category, subcategory, city, state, zip,
  phone, email, website, bio, verified, claimed, trust_score,
  overall_rating, review_count, years_experience,
  specialties, languages, certifications
) VALUES
(
  'sarah-chen-attorney', 'Sarah Chen', 'Attorney at Law', 'lawyer',
  'Personal Injury Attorney', 'New York', 'NY', '10001',
  '(212) 555-0190', 'sarah@chenlaw.com', 'https://chenlaw.com',
  'With over 15 years of experience in personal injury law, I have successfully recovered millions of dollars for my clients.',
  TRUE, TRUE, 94, 4.9, 312, 15,
  ARRAY['Personal Injury', 'Medical Malpractice', 'Car Accidents'],
  ARRAY['English', 'Mandarin'],
  ARRAY['State Bar of New York', 'American Bar Association']
),
(
  'marcus-johnson-insurance', 'Marcus Johnson', 'Senior Insurance Advisor', 'insurance',
  'Life & Health Insurance Broker', 'Chicago', 'IL', '60601',
  '(312) 555-0147', 'marcus@johnsoninsurance.com', 'https://johnsoninsurance.com',
  'I help families and businesses find the right coverage at the best price with 12 years in the industry.',
  TRUE, TRUE, 88, 4.7, 189, 12,
  ARRAY['Life Insurance', 'Health Insurance', 'Business Insurance'],
  ARRAY['English', 'Spanish'],
  ARRAY['Licensed Insurance Broker (IL)', 'CFP']
);
