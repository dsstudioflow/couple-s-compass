-- Add individual income fields to couple_profiles
ALTER TABLE public.couple_profiles
ADD COLUMN user_income numeric DEFAULT 0,
ADD COLUMN partner_income numeric DEFAULT 0;