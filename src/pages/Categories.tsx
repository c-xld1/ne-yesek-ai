
import { useState } from "react";
import { useSearchParams } from "react-router-dom";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import RecipeCard from "@/components/RecipeCard";
import { Button } from "@/components/ui/button";
import { Search, Filter, Grid, List } from "lucide-react";
import { useRecipes } from "@/hooks/useRecipes";
import { useCategories } from "@/hooks/useCategories";
import { useRecipeStats } from "@/hooks/useRecipeStats";
import LoadingSpinner from "@/components/LoadingSpinner";

const Categories = () => {
  const [searchParams] = useSearchParams();
  const kategori = searchParams.get("kategori") || "Tümü";
  const [viewMode, setViewMode] = useState("grid");
  const [sortBy, setSortBy] = useState("popular");

  const { data: recipes, isLoading: recipesLoading, error } = useRecipes();
  const { data: categories, isLoading: categoriesLoading } = useCategories();
  const { data: recipeStats } = useRecipeStats();

  const isLoading = recipesLoading || categoriesLoading;

  if (isLoading) {
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

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Navbar />
        <div className="flex items-center justify-center h-64">
          <p className="text-red-500">Tarifler yüklenirken hata oluştu: {error.message}</p>
        </div>
        <Footer />
      </div>
    );
  }

  // Filter recipes by category if needed
  let filteredRecipes = recipes || [];
  
  if (kategori !== "Tümü") {
    const selectedCategory = categories?.find(cat => cat.name === kategori);
    if (selectedCategory) {
      filteredRecipes = filteredRecipes.filter(recipe => recipe.category_id === selectedCategory.id);
    }
  }

  // Sort recipes
  filteredRecipes = filteredRecipes.sort((a, b) => {
    switch (sortBy) {
      case "rating":
        return (b.rating || 0) - (a.rating || 0);
      case "newest":
        return new Date(b.created_at).getTime() - new Date(a.created_at).getTime();
      case "cooktime":
        // For now, we'll just sort by rating since cooking_time is text
        return (b.rating || 0) - (a.rating || 0);
      default: // popular
        return (b.rating || 0) - (a.rating || 0);
    }
  });

  // Convert to component format
  const formattedRecipes = filteredRecipes.map(recipe => ({
    id: recipe.id,
    title: recipe.title || 'Başlıksız Tarif',
    image: recipe.image_url || "https://images.unsplash.com/photo-1565299624946-b28f40a0ca4b?w=400&h=300&fit=crop",
    cookingTime: recipe.cooking_time || "Bilinmiyor",
    difficulty: (recipe.difficulty as "Kolay" | "Orta" | "Zor") || "Kolay",
    rating: recipe.rating || 0,
    author: recipe.author_name || "Anonim",
    dblScore: Math.round((recipe.rating || 0) * 20),
    description: recipe.description || "Açıklama mevcut değil."
  }));

  const currentCategory = categories?.find(cat => cat.name === kategori);
  const categoryIcon = currentCategory?.icon || "📖";

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      
      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-4 flex items-center justify-center gap-3">
            {categoryIcon} {kategori} Tarifleri
          </h1>
          <p className="text-gray-600 max-w-2xl mx-auto">
            {formattedRecipes.length} adet {kategori.toLowerCase()} tarifi
          </p>
        </div>

        {/* Filters */}
        <div className="bg-white rounded-xl shadow-sm p-6 mb-8">
          <div className="flex flex-col lg:flex-row gap-4 items-center justify-between">
            <div className="flex items-center gap-4">
              <select 
                value={sortBy} 
                onChange={(e) => setSortBy(e.target.value)}
                className="border border-gray-300 rounded-lg px-3 py-2 text-sm"
              >
                <option value="popular">En Popüler</option>
                <option value="rating">En Yüksek Puan</option>
                <option value="newest">En Yeni</option>
                <option value="cooktime">Hazırlık Süresi</option>
              </select>
            </div>
            
            <div className="flex items-center gap-2">
              <Button
                variant={viewMode === "grid" ? "default" : "outline"}
                size="sm"
                onClick={() => setViewMode("grid")}
              >
                <Grid className="h-4 w-4" />
              </Button>
              <Button
                variant={viewMode === "list" ? "default" : "outline"}
                size="sm"
                onClick={() => setViewMode("list")}
              >
                <List className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </div>

        {/* Recipes Grid */}
        <div className={`${
          viewMode === "grid" 
            ? "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6" 
            : "space-y-4"
        }`}>
          {formattedRecipes.map((recipe) => (
            <RecipeCard key={recipe.id} {...recipe} />
          ))}
        </div>

        {/* Load More */}
        <div className="text-center mt-12">
          <Button variant="outline" size="lg">
            Daha Fazla Tarif Yükle
          </Button>
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default Categories;
