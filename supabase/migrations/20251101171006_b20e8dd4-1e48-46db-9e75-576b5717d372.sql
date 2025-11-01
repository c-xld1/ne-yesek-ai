-- Mevcut fonksiyonları güncelle - search_path ekle
DROP FUNCTION IF EXISTS increment_story_views(uuid);
DROP FUNCTION IF EXISTS increment_story_likes(uuid);

-- Video görüntülenme sayısını artır - güvenli versiyon
CREATE OR REPLACE FUNCTION increment_story_views(story_id uuid)
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  UPDATE video_stories
  SET views = COALESCE(views, 0) + 1
  WHERE id = story_id;
END;
$$;

-- Video beğeni sayısını artır - güvenli versiyon
CREATE OR REPLACE FUNCTION increment_story_likes(story_id uuid)
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  UPDATE video_stories
  SET likes = COALESCE(likes, 0) + 1
  WHERE id = story_id;
END;
$$;