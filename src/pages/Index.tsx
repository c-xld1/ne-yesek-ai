import Hero from "@/components/Hero";
import Navbar from "../components/Navbar.tsx";
import Footer from "@/components/Footer";
import BottomNav from "@/components/BottomNav";
import VideoStories from "@/components/VideoStories";
import RecipeCard from "@/components/RecipeCard";
import { Newsletter } from "@/components/Newsletter";
import { useFeaturedRecipes } from "@/hooks/useRecipes";
import { useCategories } from "@/hooks/useCategories";
import { useTestData } from "@/hooks/useTestData";
import LoadingSpinner from "@/components/LoadingSpinner";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { ArrowRight, Star, TrendingUp, Database, CheckCircle, XCircle } from "lucide-react";

const Index = () => {
  const { data: featuredRecipes, isLoading: recipesLoading, error: recipesError } = useFeaturedRecipes();
  const { data: categories, isLoading: categoriesLoading } = useCategories();
  const testData = useTestData();


  // Format recipes for RecipeCard component
  const formattedRecipes = featuredRecipes?.map(recipe => ({
    id: recipe.id,
    title: recipe.title || 'Başlıksız Tarif',
    image: recipe.image_url || "https://images.unsplash.com/photo-1565299624946-b28f40a0ca4b?w=400&h=300&fit=crop",
    cookingTime: String(recipe.cook_time || "Bilinmiyor"),
    difficulty: (recipe.difficulty as "Kolay" | "Orta" | "Zor") || "Kolay",
    rating: recipe.rating || 0,
    author: recipe.author_name || "Ne Yesek AI",
    dblScore: Math.round((recipe.rating || 0) * 20),
    description: recipe.description || "Açıklama mevcut değil.",
    category: recipe.category_name || "Genel"
  })) || [];

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 via-white to-orange-50 pb-20">
      <Navbar />

      {/* Test Data Status - Development Only */}
      {process.env.NODE_ENV === 'development' && (
        <div className="bg-gray-100 border-b border-gray-200 p-4">
          <div className="max-w-7xl mx-auto">
            <div className="flex items-center gap-4 text-sm">
              <Database className="h-4 w-4" />
              <span className="font-medium">Database Status:</span>
              {testData.connected ? (
                <div className="flex items-center gap-4">
                  <div className="flex items-center gap-1 text-green-600">
                    <CheckCircle className="h-4 w-4" />
                    <span>Connected</span>
                  </div>
                  <span>Recipes: {testData.recipes}</span>
                  <span>Profiles: {testData.profiles}</span>
                  <span>Categories: {testData.categories}</span>
                </div>
              ) : (
                <div className="flex items-center gap-2 text-red-600">
                  <XCircle className="h-4 w-4" />
                  <span>{testData.error || 'Connecting...'}</span>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      <Hero />
      <VideoStories />

      {/* Featured Recipes Section */}
      {formattedRecipes.length > 0 && (
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <div className="text-center mb-12">
            <div className="inline-flex items-center gap-2 bg-gradient-to-r from-orange-500 to-orange-600 text-white px-6 py-2 rounded-full mb-4 text-sm font-semibold">
              <Star className="h-4 w-4" />
              Öne Çıkan Tarifler
            </div>
            <h2 className="text-4xl font-bold bg-gradient-to-r from-orange-600 to-orange-500 bg-clip-text text-transparent mb-4">
              En Popüler Lezzetler
            </h2>
            <p className="text-gray-600 text-lg max-w-2xl mx-auto">
              Toplumun en çok sevdiği ve denediği tarifleri keşfedin
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-12">
            {formattedRecipes.slice(0, 6).map((recipe) => (
              <div key={recipe.id} className="transform hover:scale-105 transition-all duration-300">
                <RecipeCard {...recipe} />
              </div>
            ))}
          </div>

          <div className="text-center">
            <Link to="/recipes">
              <Button
                size="lg"
                className="bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 text-white font-semibold px-8 py-4 rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105"
              >
                Tüm Tarifleri Gör
                <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
            </Link>
          </div>
        </section>
      )}


      {/* Categories Preview */}
      {categories && categories.length > 0 && (
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 bg-white/30 backdrop-blur-sm">
          <div className="text-center mb-12">
            <div className="inline-flex items-center gap-2 bg-gradient-to-r from-orange-500 to-orange-600 text-white px-6 py-2 rounded-full mb-4 text-sm font-semibold">
              <TrendingUp className="h-4 w-4" />
              Kategoriler
            </div>
            <h2 className="text-4xl font-bold bg-gradient-to-r from-orange-600 to-orange-500 bg-clip-text text-transparent mb-4">
              Lezzet Kategorileri
            </h2>
            <p className="text-gray-600 text-lg max-w-2xl mx-auto">
              Farklı kategorilerdeki tarifleri keşfedin
            </p>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-6">
            {categories.slice(0, 6).map((category: any) => (
              <Link
                key={category.id}
                to={`/recipes?category=${category.slug || category.id}`}
                className="group"
              >
                <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 text-center shadow-lg border border-orange-100 hover:shadow-xl hover:scale-105 transition-all duration-300 group-hover:bg-gradient-to-br group-hover:from-orange-50 group-hover:to-orange-100">
                  <div className="text-3xl mb-3">
                    {category.emoji || '🍽️'}
                  </div>
                  <h3 className="font-semibold text-gray-800 group-hover:text-orange-700 transition-colors">
                    {category.name || category.title || 'Kategori'}
                  </h3>
                  <p className="text-sm text-gray-500 mt-1">
                    {category.description || 'Lezzetli tarifler'}
                  </p>
                </div>
              </Link>
            ))}
          </div>
        </section>
      )}

      {/* Error State for Recipes */}
      {recipesError && (
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <div className="text-center bg-white/80 backdrop-blur-sm rounded-2xl p-8 shadow-lg border border-red-100">
            <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <span className="text-red-500 text-2xl">⚠️</span>
            </div>
            <p className="text-red-600 font-semibold text-lg">Tarifler yüklenirken hata oluştu</p>
            <p className="text-red-400 text-sm mt-2">Lütfen daha sonra tekrar deneyin</p>
          </div>
        </section>
      )}

      {/* Newsletter - Only on home page */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <Newsletter />
      </section>

      <Footer />
      <BottomNav />
    </div>
  );
};

export default Index;
