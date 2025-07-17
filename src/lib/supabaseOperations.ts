import { supabase } from '@/integrations/supabase/client';
import type { Database } from '@/integrations/supabase/types';

// Demo modu: gerçek bir supabase bağlantısı olmadığında veya hata durumunda mock veri kullan
const isDemoMode = !import.meta.env.VITE_SUPABASE_URL || !import.meta.env.VITE_SUPABASE_ANON_KEY;

// Demo modu - gerçek bir supabase bağlantısı olmadığında veya hata durumunda kullanılır

/**
 * Gerçek bir Supabase bağlantısı yoksa demo/sahte verilerle çalış
 * Bu mockDb objesi, supabase fonksiyonlarının olmadığı durumlarda test verileri döndürmek için kullanılır
 */
const mockDb = {
    recipes: Array(10).fill(0).map((_, i) => ({
        id: `demo-${i}`,
        title: `Demo Tarif ${i + 1}`,
        description: "Test verisi olarak gösterilen tarif",
        content: "Bu bir demo içeriktir. Supabase bağlantısı kurulduğunda gerçek veriler görünecektir.",
        image_url: `https://picsum.photos/seed/recipe${i}/800/600`,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
    })),
    categories: ['Ana Yemek', 'Tatlı', 'Çorba', 'Kahvaltı', 'Aperatif'].map((name, i) => ({
        id: `cat-${i}`,
        name,
        slug: name.toLowerCase().replace(/\s+/g, '-'),
        description: `${name} kategorisi açıklaması`,
        image_url: `https://picsum.photos/seed/cat${i}/400/300`
    })),
    profiles: Array(5).fill(0).map((_, i) => ({
        id: `user-${i}`,
        username: `user${i}`,
        full_name: `Demo Kullanıcı ${i}`,
        avatar_url: `https://i.pravatar.cc/150?u=user${i}`
    }))
};

// Tarif işlemleri
export const addRecipe = async (recipeData: Database['public']['Tables']['recipes']['Insert']) => {
    if (isDemoMode) {
        console.log('Demo modunda tarif eklendi:', recipeData);
        return { id: `demo-${Date.now()}`, ...recipeData };
    }

    const { data, error } = await supabase
        .from('recipes')
        .insert(recipeData)
        .select()
        .single();

    if (error) throw error;
    return data;
};

export const updateRecipe = async (id: string, updates: Partial<Database['public']['Tables']['recipes']['Update']>) => {
    if (isDemoMode) {
        console.log(`Demo modunda tarif güncellendi. ID: ${id}, Güncellemeler:`, updates);
        return { id, ...updates };
    }

    const { data, error } = await supabase
        .from('recipes')
        .update(updates)
        .eq('id', id)
        .select()
        .single();

    if (error) throw error;
    return data;
};

export const getRecipe = async (id: string) => {
    if (isDemoMode) {
        const demoRecipe = mockDb.recipes.find(r => r.id === id) || mockDb.recipes[0];
        return demoRecipe;
    }

    const { data, error } = await supabase
        .from('recipes')
        .select()
        .eq('id', id)
        .single();

    if (error) throw error;
    return data;
};

export const getAllRecipes = async () => {
    if (isDemoMode) {
        return mockDb.recipes;
    }

    const { data, error } = await supabase
        .from('recipes')
        .select()
        .order('created_at', { ascending: false });

    if (error) throw error;
    return data;
};

// Profil işlemleri
export const upsertProfile = async (profileData: Database['public']['Tables']['profiles']['Insert']) => {
    if (isDemoMode) {
        console.log('Demo modunda profil güncellendi:', profileData);
        return { id: profileData.id, ...profileData };
    }

    const { data, error } = await supabase
        .from('profiles')
        .upsert(profileData)
        .select()
        .single();

    if (error) throw error;
    return data;
};

export const getProfile = async (userId: string) => {
    if (isDemoMode) {
        const demoProfile = mockDb.profiles.find(p => p.id === userId) || mockDb.profiles[0];
        return { ...demoProfile, id: userId };
    }

    const { data, error } = await supabase
        .from('profiles')
        .select()
        .eq('id', userId)
        .single();

    if (error) throw error;
    return data;
};

// Video hikaye işlemleri
export const addVideoStory = async (videoData: Database['public']['Tables']['video_stories']['Insert']) => {
    if (isDemoMode) {
        console.log('Demo modunda video hikaye eklendi:', videoData);
        return { id: `demo-video-${Date.now()}`, ...videoData };
    }

    const { data, error } = await supabase
        .from('video_stories')
        .insert(videoData)
        .select()
        .single();

    if (error) throw error;
    return data;
};

export const getAllVideoStories = async () => {
    if (isDemoMode) {
        // Demo video hikayeleri
        return Array(8).fill(0).map((_, i) => ({
            id: `demo-video-${i}`,
            title: `Demo Video ${i + 1}`,
            description: "Test video hikayesi",
            video_url: "https://player.vimeo.com/progressive_redirect/playback/863059736/rendition/720p/file.mp4",
            thumbnail_url: `https://picsum.photos/seed/video${i}/800/1200`,
            created_at: new Date().toISOString(),
            views: Math.floor(Math.random() * 1000),
            likes: Math.floor(Math.random() * 100),
            is_featured: i % 3 === 0
        }));
    }

    const { data, error } = await supabase
        .from('video_stories')
        .select()
        .order('created_at', { ascending: false });

    if (error) throw error;
    return data;
};

// Kategori işlemleri
export const getAllCategories = async () => {
    if (isDemoMode) {
        return mockDb.categories;
    }

    const { data, error } = await supabase
        .from('categories')
        .select()
        .order('name', { ascending: true });

    if (error) throw error;
    return data;
};
