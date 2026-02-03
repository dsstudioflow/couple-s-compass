-- Add is_gifted column to home_items table
ALTER TABLE public.home_items
ADD COLUMN is_gifted boolean NOT NULL DEFAULT false;