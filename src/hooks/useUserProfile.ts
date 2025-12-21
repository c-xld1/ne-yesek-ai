import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

export const useUserProfile = (username: string | undefined) => {
  return useQuery({
    queryKey: ["user-profile", username],
    queryFn: async () => {
      if (!username) {
        throw new Error("Username is required");
      }

      console.log("🔍 Fetching profile for username:", username);

      // First, get basic profile info
      const { data, error } = await supabase
        .from("profiles")
        .select("*")
        .eq("username", username)
        .single();

      console.log("📊 Profile query result:", { data, error });

      if (error) {
        console.error("❌ Error fetching user profile:", error);
        throw error;
      }

      // Get stats separately to avoid relation issues
      let recipesCount = 0;
      let followersCount = 0;
      let followingCount = 0;

      // Count recipes
      const recipeResult = await supabase
        .from("recipes")
        .select("id", { count: "exact", head: true })
        .eq("user_id", data.id);
      recipesCount = recipeResult.count || 0;

      // Count followers
      const followerResult = await supabase
        .from("follows")
        .select("id", { count: "exact", head: true })
        .eq("following_id", data.id);
      followersCount = followerResult.count || 0;

      // Count following
      const followingResult = await supabase
        .from("follows")
        .select("id", { count: "exact", head: true })
        .eq("follower_id", data.id);
      followingCount = followingResult.count || 0;

      console.log("✅ Profile loaded successfully:", {
        username: data.username,
        id: data.id,
        stats: { recipesCount, followersCount, followingCount }
      });

      return {
        ...data,
        stats: {
          recipes: recipesCount,
          followers: followersCount,
          following: followingCount,
          totalLikes: (data as any).total_likes || 0,
        },
      };
    },
    enabled: !!username,
  });
};

export const useUserRecipes = (userId: string | undefined) => {
  return useQuery({
    queryKey: ["user-recipes", userId],
    queryFn: async () => {
      if (!userId) {
        throw new Error("User ID is required");
      }

      // Use type assertion to avoid infinite type depth
      // @ts-ignore - Type depth limitation
      const result: any = await supabase
        .from("recipes")
        .select("id, title, description, image_url, cooking_time, difficulty, rating, category_id, author_id")
        .eq("author_id", userId)
        .order("created_at", { ascending: false});

      const { data, error } = result;

      if (error) {
        console.error("Error fetching user recipes:", error);
        throw error;
      }

      // Fetch related data separately
      const recipesWithDetails = await Promise.all(
        (data || []).map(async (recipe: any) => {
          // Fetch category
          let categoryName = "Genel";
          if (recipe.category_id) {
            const categoryResult: any = await supabase
              .from("categories")
              .select("name")
              .eq("id", recipe.category_id)
              .single();
            if (categoryResult.data) categoryName = categoryResult.data.name;
          }

          // Fetch author profile
          let author = "Anonim";
          let authorUsername = "";
          let authorAvatar = "";
          if (recipe.author_id) {
            const profileResult: any = await supabase
              .from("profiles")
              .select("username, fullname, avatar_url")
              .eq("id", recipe.author_id)
              .single();
            if (profileResult.data) {
              author = profileResult.data.fullname || profileResult.data.username;
              authorUsername = profileResult.data.username;
              authorAvatar = profileResult.data.avatar_url;
            }
          }

          return {
            id: recipe.id,
            title: recipe.title,
            description: recipe.description,
            image: recipe.image_url || "https://images.unsplash.com/photo-1546548970-71785318a17b?w=400&h=300&fit=crop",
            cookingTime: recipe.cooking_time ? `${recipe.cooking_time} dk` : "30 dk",
            difficulty: recipe.difficulty || "Orta",
            rating: recipe.rating || 4.5,
            author,
            authorUsername,
            authorAvatar,
            category: categoryName,
          };
        })
      );

      return recipesWithDetails;
    },
    enabled: !!userId,
  });
};

export const useUserFavorites = (userId: string | undefined) => {
  return useQuery({
    queryKey: ["user-favorites", userId],
    queryFn: async () => {
      if (!userId) {
        throw new Error("User ID is required");
      }

      const { data, error } = await supabase
        .from("recipe_favorites")
        .select(`
          recipe_id,
          recipes:recipe_id (
            id,
            title,
            description,
            image_url,
            cooking_time,
            difficulty,
            rating,
            categories:category_id (
              name
            ),
            profile:profiles!recipes_author_id_fkey (
              username,
              fullname,
              avatar_url
            )
          )
        `)
        .eq("user_id", userId)
        .order("created_at", { ascending: false });

      if (error) {
        console.error("Error fetching user favorites:", error);
        throw error;
      }

      return (data as any[])
        .filter((fav) => fav.recipes)
        .map((fav: any) => ({
          id: fav.recipes.id,
          title: fav.recipes.title,
          description: fav.recipes.description,
          image: fav.recipes.image_url || "https://images.unsplash.com/photo-1546548970-71785318a17b?w=400&h=300&fit=crop",
          cookingTime: fav.recipes.cooking_time ? `${fav.recipes.cooking_time} dk` : "30 dk",
          difficulty: fav.recipes.difficulty || "Orta",
          rating: fav.recipes.rating || 4.5,
          author: fav.recipes.profile?.fullname || fav.recipes.profile?.username || "Anonim",
          authorUsername: fav.recipes.profile?.username,
          authorAvatar: fav.recipes.profile?.avatar_url,
          category: fav.recipes.categories?.name || "Genel",
        }));
    },
    enabled: !!userId,
  });
};
