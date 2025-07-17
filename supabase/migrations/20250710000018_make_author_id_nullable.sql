-- Allow video_stories to have nullable author_id for testing purposes
ALTER TABLE public.video_stories 
ALTER COLUMN author_id DROP NOT NULL;
