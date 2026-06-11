-- FitTrack Supabase Schema
-- Run this in your Supabase SQL editor to set up the database

-- User profiles (extends Supabase auth.users)
CREATE TABLE user_profile (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  name TEXT NOT NULL DEFAULT 'Athlete',
  weight_kg REAL NOT NULL DEFAULT 70,
  height_cm REAL NOT NULL DEFAULT 175,
  age INTEGER NOT NULL DEFAULT 25,
  step_goal INTEGER NOT NULL DEFAULT 10000,
  calorie_goal INTEGER NOT NULL DEFAULT 2200,
  water_goal_l REAL NOT NULL DEFAULT 2.5,
  active_goal_min INTEGER NOT NULL DEFAULT 30,
  theme TEXT NOT NULL DEFAULT 'system' CHECK (theme IN ('system', 'light', 'dark')),
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Daily metrics
CREATE TABLE daily_metric (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  date DATE NOT NULL DEFAULT CURRENT_DATE,
  steps INTEGER NOT NULL DEFAULT 0,
  calories INTEGER NOT NULL DEFAULT 0,
  water_l REAL NOT NULL DEFAULT 0,
  active_min INTEGER NOT NULL DEFAULT 0,
  distance_km REAL NOT NULL DEFAULT 0,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  UNIQUE (user_id, date)
);

-- Workout entries
CREATE TABLE workout_entry (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  type TEXT NOT NULL,
  duration_min INTEGER NOT NULL,
  distance_km REAL,
  intensity TEXT CHECK (intensity IN ('easy', 'moderate', 'hard', 'maximum')),
  notes TEXT,
  done_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Water intake
CREATE TABLE water_intake (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  amount_l REAL NOT NULL,
  date DATE NOT NULL DEFAULT CURRENT_DATE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Sleep records
CREATE TABLE sleep_record (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  started_at TIMESTAMPTZ NOT NULL,
  ended_at TIMESTAMPTZ NOT NULL,
  quality TEXT NOT NULL CHECK (quality IN ('poor', 'fair', 'good', 'great')),
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Meal entries
CREATE TABLE meal_entry (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  calories INTEGER NOT NULL,
  date DATE NOT NULL DEFAULT CURRENT_DATE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- User goals
CREATE TABLE user_goal (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  category TEXT NOT NULL,
  title TEXT NOT NULL,
  target REAL NOT NULL,
  current REAL NOT NULL DEFAULT 0,
  unit TEXT NOT NULL,
  period TEXT NOT NULL DEFAULT 'daily' CHECK (period IN ('daily', 'weekly', 'monthly')),
  completed BOOLEAN NOT NULL DEFAULT FALSE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Indexes for performance
CREATE INDEX idx_daily_metric_user_date ON daily_metric(user_id, date);
CREATE INDEX idx_workout_entry_user_date ON workout_entry(user_id, done_at);
CREATE INDEX idx_water_intake_user_date ON water_intake(user_id, date);
CREATE INDEX idx_sleep_record_user_date ON sleep_record(user_id, started_at);
CREATE INDEX idx_meal_entry_user_date ON meal_entry(user_id, date);
CREATE INDEX idx_user_goal_user ON user_goal(user_id);

-- Row Level Security
ALTER TABLE user_profile ENABLE ROW LEVEL SECURITY;
ALTER TABLE daily_metric ENABLE ROW LEVEL SECURITY;
ALTER TABLE workout_entry ENABLE ROW LEVEL SECURITY;
ALTER TABLE water_intake ENABLE ROW LEVEL SECURITY;
ALTER TABLE sleep_record ENABLE ROW LEVEL SECURITY;
ALTER TABLE meal_entry ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_goal ENABLE ROW LEVEL SECURITY;

-- Policies: users can only read/write their own data
CREATE POLICY "Users can manage own profile"
  ON user_profile FOR ALL USING (auth.uid() = id);

CREATE POLICY "Users can manage own metrics"
  ON daily_metric FOR ALL USING (auth.uid() = user_id);

CREATE POLICY "Users can manage own workouts"
  ON workout_entry FOR ALL USING (auth.uid() = user_id);

CREATE POLICY "Users can manage own water intake"
  ON water_intake FOR ALL USING (auth.uid() = user_id);

CREATE POLICY "Users can manage own sleep records"
  ON sleep_record FOR ALL USING (auth.uid() = user_id);

CREATE POLICY "Users can manage own meals"
  ON meal_entry FOR ALL USING (auth.uid() = user_id);

CREATE POLICY "Users can manage own goals"
  ON user_goal FOR ALL USING (auth.uid() = user_id);

-- Auto-update updated_at trigger
CREATE OR REPLACE FUNCTION update_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_user_profile_updated_at
  BEFORE UPDATE ON user_profile FOR EACH ROW EXECUTE FUNCTION update_updated_at();

CREATE TRIGGER update_daily_metric_updated_at
  BEFORE UPDATE ON daily_metric FOR EACH ROW EXECUTE FUNCTION update_updated_at();
