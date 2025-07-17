import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import type { Database } from '@/integrations/supabase/types';

export type VideoStory = Database['public']['Tables']['video_stories']['Row'];

// Test verileri - veritabanı boşsa eklenecek
const sampleVideoStories = [
    {
        title: "Karnıyarık Nasıl Yapılır?",
        description: "Geleneksel karnıyarık tarifimizi adım adım öğrenin. Patlıcanın doğru şekilde hazırlanmasından servisine kadar!",
        video_url: "https://www.youtube.com/embed/dQw4w9WgXcQ",
        thumbnail_url: "https://images.unsplash.com/photo-1565299624946-b28f40a0ca4b?w=400&h=600&fit=crop",
        duration: 90,
        views: 1520,
        likes: 89,
        is_featured: true,
        author_id: null // Will be set to a sample user ID when creating
    },
    {
        title: "Çikolatalı Kek Mucizesi",
        description: "Islak çikolatalı kek tarifimizle herkesi büyüleyin.",
        video_url: "https://www.youtube.com/embed/dQw4w9WgXcQ",
        thumbnail_url: "https://images.unsplash.com/photo-1578985545062-69928b1d9587?w=400&h=600&fit=crop",
        duration: 85,
        views: 2876,
        likes: 198,
        is_featured: true,
        author_id: null // Will be set to a sample user ID when creating
    },
    {
        title: "Hızlı Kahvaltı İpuçları",
        description: "Sabahları zamansızlık yaşayanlar için pratik öneriler.",
        video_url: "https://www.youtube.com/embed/dQw4w9WgXcQ",
        thumbnail_url: "https://images.unsplash.com/photo-1533089860892-a7c6f0a88666?w=400&h=600&fit=crop",
        duration: 60,
        views: 2150,
        likes: 156,
        is_featured: false,
        author_id: null // Will be set to a sample user ID when creating
    },
];

export const useVideoStories = () => {
    const [stories, setStories] = useState<VideoStory[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    // Debug logs removed

    // Veritabanına test verileri ekle (sadece tablo boşsa)
    const seedTestData = async () => {
        try {
            // Önce mevcut kayıtları kontrol et
            const { count, error: countError } = await supabase
                .from('video_stories')
                .select('*', { count: 'exact', head: true });

            if (countError) {
                console.error('Video stories count kontrolü başarısız:', countError);
                return false;
            }

            // Eğer hiç kayıt yoksa test verilerini ekle
            if (count === 0) {
                // Video stories tablosu boş, test verileri ekleniyor...

                // Author_id null olarak ekle (migration'da nullable yaptık)
                const videosToInsert = sampleVideoStories.map(video => ({
                    title: video.title,
                    description: video.description,
                    video_url: video.video_url,
                    thumbnail_url: video.thumbnail_url,
                    duration: video.duration,
                    views: video.views,
                    likes: video.likes,
                    is_featured: video.is_featured,
                    author_id: null, // Null olarak ekle, daha sonra profile'lar oluştuğunda güncellenebilir
                    is_published: true, // Yayında olması için
                    published_at: new Date().toISOString() // Şu anki zaman
                }));

                // Video stories tablosu boş, test verileri ekleniyor
                const { error: insertError } = await supabase
                    .from('video_stories')
                    .insert(videosToInsert);

                if (insertError) {
                    console.error('Video stories ekleme hatası:', insertError);
                    throw insertError;
                }

                // Test verileri başarıyla eklendi
                return true;
            } else {
                // Video stories tablosunda zaten kayıt var
            }

            return false;
        } catch (err) {
            console.error('Test verileri eklenirken hata:', err);
            return false;
        }
    };

    const fetchStories = async () => {
        try {
            setLoading(true);
                // Test verileri başarıyla eklendi

            // Check if supabase client is properly configured
            if (!supabase) {
                // Video stories tablosunda zaten kayıt var
            }

            // Check if database is empty and seed if needed
            const seeded = await seedTestData();

            const { data, error: fetchError } = await supabase
                .from('video_stories')
                .select('*')
                .order('created_at', { ascending: false });

            if (fetchError) {
                throw fetchError;
            }

            if (seeded) {
                console.log('Test verileri eklendi ve başarıyla yüklendi.');
            }

            setStories(data || []);
        } catch (err) {
            const errorMessage = err instanceof Error ? err.message : 'Video hikayeleri yüklenirken hata oluştu';
            setError(errorMessage);
            console.error('Video hikayeleri yüklenirken hata:', err);

            // Set empty array to trigger fallback in component
            setStories([]);
        } finally {
            setLoading(false);
        }
    };

    const getFeaturedStories = async () => {
        try {
            const { data, error: fetchError } = await supabase
                .from('video_stories')
                .select('*')
                .eq('is_featured', true)
                .order('views', { ascending: false })
                .limit(10);

            if (fetchError) {
                throw fetchError;
            }

            return data || [];
        } catch (err) {
            console.error('Öne çıkan video hikayeleri yüklenirken hata:', err);
            return [];
        }
    };

    const incrementViews = async (storyId: string) => {
        try {
            // First get current views
            const { data: currentStory } = await supabase
                .from('video_stories')
                .select('views')
                .eq('id', storyId)
                .single();

            const currentViews = currentStory?.views || 0;

            const { error: updateError } = await supabase
                .from('video_stories')
                .update({ views: currentViews + 1 })
                .eq('id', storyId);

            if (updateError) {
                throw updateError;
            }

            // Update local state
            setStories(prev =>
                prev.map(story =>
                    story.id === storyId
                        ? { ...story, views: currentViews + 1 }
                        : story
                )
            );
        } catch (err) {
            console.error('Görüntülenme sayısı artırılırken hata:', err);
        }
    };

    const incrementLikes = async (storyId: string) => {
        try {
            // First get current likes
            const { data: currentStory } = await supabase
                .from('video_stories')
                .select('likes')
                .eq('id', storyId)
                .single();

            const currentLikes = currentStory?.likes || 0;

            const { error: updateError } = await supabase
                .from('video_stories')
                .update({ likes: currentLikes + 1 })
                .eq('id', storyId);

            if (updateError) {
                throw updateError;
            }

            // Update local state
            setStories(prev =>
                prev.map(story =>
                    story.id === storyId
                        ? { ...story, likes: currentLikes + 1 }
                        : story
                )
            );
        } catch (err) {
            console.error('Beğeni sayısı artırılırken hata:', err);
        }
    };

    const searchStories = async (query: string) => {
        try {
            const { data, error: searchError } = await supabase
                .from('video_stories')
                .select('*')
                .or(`title.ilike.%${query}%,description.ilike.%${query}%`)
                .order('views', { ascending: false });

            if (searchError) {
                throw searchError;
            }

            return data || [];
        } catch (err) {
            console.error('Video hikayeleri aranırken hata:', err);
            return [];
        }
    };

    useEffect(() => {
        const initialize = async () => {
        // useVideoStories initializing and fetching stories
            await fetchStories();

            // useVideoStories initialization complete
        };

        initialize();
    }, []);

    return {
        stories,
        loading,
        error,
        fetchStories,
        getFeaturedStories,
        incrementViews,
        incrementLikes,
        searchStories,
    };
};
