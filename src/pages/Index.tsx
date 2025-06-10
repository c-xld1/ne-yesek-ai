
import Hero from "@/components/Hero";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import CategoryCard from "@/components/CategoryCard";
import RecipeCard from "@/components/RecipeCard";
import SeasonalRecommendations from "@/components/SeasonalRecommendations";
import VideoStories from "@/components/VideoStories";
import CommunityFeatures from "@/components/CommunityFeatures";
import WeeklyMealPlan from "@/components/WeeklyMealPlan";
import { Button } from "@/components/ui/button";
import { useRecipes } from "@/hooks/useRecipes";
import { useCategories } from "@/hooks/useCategories";
import LoadingSpinner from "@/components/LoadingSpinner";

const Index = () => {
  const { data: recipes, isLoading: recipesLoading } = useRecipes();
  const { data: categories, isLoading: categoriesLoading } = useCategories();

  if (recipesLoading || categoriesLoading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Navbar />
        <div className="flex items-center justify-center h-64">
          <LoadingSpinner />
        </div>
        <Footer />
      </div>
    );
  }

  // Convert Supabase recipe format to component format
  const formattedRecipes = recipes?.slice(0, 8).map(recipe => ({
    id: recipe.id,
    title: recipe.title || 'Başlıksız Tarif',
    image: recipe.image_url || "https://images.unsplash.com/photo-1565299624946-b28f40a0ca4b?w=400&h=300&fit=crop",
    cookingTime: recipe.cooking_time || "Bilinmiyor",
    difficulty: (recipe.difficulty as "Kolay" | "Orta" | "Zor") || "Kolay",
    rating: recipe.rating || 0,
    author: recipe.author_name || "Anonim",
    dblScore: Math.round((recipe.rating || 0) * 20), // Convert 5-star to 100-point scale
    description: recipe.description || "Açıklama mevcut değil."
  })) || [];

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      <Hero />
      
      {/* Popular Recipes Section */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              🔥 Popüler Tarifler
            </h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              En çok beğenilen ve denenen tariflerimiz
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {formattedRecipes.map((recipe) => (
              <RecipeCard key={recipe.id} {...recipe} />
            ))}
          </div>
          
          <div className="text-center mt-8">
            <Button asChild size="lg" className="gradient-primary text-white">
              <a href="/tarifler">Tüm Tarifleri Görüntüle</a>
            </Button>
          </div>
        </div>
      </section>

      {/* Categories Section */}
      <section className="py-12 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              Kategorilere Göz Atın
            </h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Farklı lezzet kategorilerinde tarifler keşfedin
            </p>
          </div>
          
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
            {categories?.slice(0, 6).map((category) => (
              <CategoryCard 
                key={category.id}
                name={category.name} 
                icon={category.icon || "🍽️"} 
                recipeCount={0} // Bu sayı daha sonra gerçek veri ile güncellenecek
              />
            ))}
          </div>
        </div>
      </section>

      {/* Seasonal Recommendations Section */}
      <SeasonalRecommendations />

      {/* Video Stories Section */}
      <VideoStories />

      {/* Community Features Section */}
      <CommunityFeatures />

      {/* Weekly Meal Plan Section */}
      <WeeklyMealPlan />
      
      <Footer />
    </div>
  );
};

export default Index;
