-- Add missing columns to recipes table
ALTER TABLE public.recipes ADD COLUMN IF NOT EXISTS content TEXT;
ALTER TABLE public.recipes ADD COLUMN IF NOT EXISTS rating DECIMAL(3,2) DEFAULT 0;