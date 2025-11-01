-- Video görüntülenme sayısını artır
CREATE OR REPLACE FUNCTION increment_story_views(story_id uuid)
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  UPDATE video_stories
  SET views = COALESCE(views, 0) + 1
  WHERE id = story_id;
END;
$$;

-- Video beğeni sayısını artır
CREATE OR REPLACE FUNCTION increment_story_likes(story_id uuid)
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  UPDATE video_stories
  SET likes = COALESCE(likes, 0) + 1
  WHERE id = story_id;
END;
$$;