import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';

export interface Achievement {
  id: string;
  key: string;
  title: string;
  description: string;
  icon: string;
  color: string;
  requirement_type: string;
  requirement_value: number;
  points: number;
  order_index: number;
  earned: boolean;
  earnedDate?: string;
}

// Tüm başarı tanımlarını çek
export const useAchievementDefinitions = () => {
  return useQuery({
    queryKey: ['achievement-definitions'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('achievement_definitions' as any)
        .select('*')
        .eq('is_active', true)
        .order('order_index', { ascending: true });

      if (error) {
        console.error('Error fetching achievement definitions:', error);
        throw error;
      }

      return data || [];
    },
  });
};

// Kullanıcının başarılarını çek
export const useUserAchievements = (userId?: string) => {
  return useQuery({
    queryKey: ['user-achievements', userId],
    queryFn: async () => {
      if (!userId) return [];

      const { data, error } = await supabase
        .from('user_achievements' as any)
        .select('*')
        .eq('user_id', userId);

      if (error) {
        console.error('Error fetching user achievements:', error);
        throw error;
      }

      return data || [];
    },
    enabled: !!userId,
  });
};

// Kullanıcının başarılarını tanımlarla birleştir
export const useCombinedAchievements = (userId?: string) => {
  const { data: definitions, isLoading: definitionsLoading } = useAchievementDefinitions();
  const { data: userAchievements, isLoading: userLoading } = useUserAchievements(userId);

  const isLoading = definitionsLoading || userLoading;

  const achievements: Achievement[] = (definitions || []).map((def: any) => {
    const userAchievement = userAchievements?.find((ua: any) => ua.achievement_key === def.key);
    
    return {
      id: def.id,
      key: def.key,
      title: def.title,
      description: def.description,
      icon: def.icon,
      color: def.color,
      requirement_type: def.requirement_type,
      requirement_value: def.requirement_value,
      points: def.points,
      order_index: def.order_index,
      earned: !!userAchievement,
      earnedDate: userAchievement?.earned_at,
    };
  });

  const earnedAchievements = achievements.filter(a => a.earned);
  const nextAchievement = achievements.find(a => !a.earned);
  const totalPoints = earnedAchievements.reduce((sum, a) => sum + a.points, 0);

  return {
    achievements,
    earnedAchievements,
    nextAchievement,
    totalPoints,
    isLoading,
  };
};

// Kullanıcı istatistiklerini çek (başarı ilerlemesi için)
export const useUserStats = (userId?: string) => {
  return useQuery({
    queryKey: ['user-stats', userId],
    queryFn: async () => {
      if (!userId) return null;

      // Tarif sayısı
      const { count: recipeCount } = await supabase
        .from('recipes')
        .select('*', { count: 'exact', head: true })
        .eq('user_id', userId)
        .eq('is_draft', false);

      // Takipçi sayısı
      const { count: followerCount } = await supabase
        .from('follows' as any)
        .select('*', { count: 'exact', head: true })
        .eq('followed_id', userId);

      // Takip edilen sayısı
      const { count: followingCount } = await supabase
        .from('follows' as any)
        .select('*', { count: 'exact', head: true })
        .eq('follower_id', userId);

      // Toplam beğeni ve görüntüleme
      const { data: recipes } = await supabase
        .from('recipes')
        .select('id, views')
        .eq('user_id', userId)
        .eq('is_draft', false);

      // Toplam beğeni sayısını recipe_favorites tablosundan çek
      const recipeIds = (recipes || []).map((r: any) => r.id);
      let totalLikes = 0;
      
      if (recipeIds.length > 0) {
        const { count } = await supabase
          .from('recipe_favorites')
          .select('*', { count: 'exact', head: true })
          .in('recipe_id', recipeIds);
        totalLikes = count || 0;
      }

      const totalViews = recipes?.reduce((sum: number, r: any) => sum + (r.views || 0), 0) || 0;

      return {
        recipes: recipeCount || 0,
        followers: followerCount || 0,
        following: followingCount || 0,
        totalLikes: totalLikes || 0,
        totalViews,
      };
    },
    enabled: !!userId,
  });
};

// Başarı kontrolünü manuel tetikle
export const checkUserAchievements = async (userId: string) => {
  try {
    const { data, error } = await supabase.rpc('check_and_award_achievements' as any, {
      p_user_id: userId
    });

    if (error) {
      console.error('Error checking achievements:', error);
      return false;
    }

    return true;
  } catch (error) {
    console.error('Error in checkUserAchievements:', error);
    return false;
  }
};
