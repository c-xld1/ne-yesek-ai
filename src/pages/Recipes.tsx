
import { useState } from "react";
import { useSearchParams } from "react-router-dom";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import RecipeCard from "@/components/RecipeCard";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Search, Filter, Grid, List } from "lucide-react";
import { useRecipes, useSearchRecipes } from "@/hooks/useRecipes";
import LoadingSpinner from "@/components/LoadingSpinner";

const Recipes = () => {
  const [searchParams] = useSearchParams();
  const search = searchParams.get("search") || "";
  const [searchTerm, setSearchTerm] = useState(search);
  const [viewMode, setViewMode] = useState("grid");
  const [sortBy, setSortBy] = useState("newest");

  const { data: allRecipes, isLoading: loadingAll, error: errorAll } = useRecipes();
  const { data: searchRecipes, isLoading: loadingSearch, error: errorSearch } = useSearchRecipes(searchTerm);
  const recipes = searchTerm.trim() ? searchRecipes : allRecipes;
  const isLoading = searchTerm.trim() ? loadingSearch : loadingAll;
  const error = searchTerm.trim() ? errorSearch : errorAll;

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

  // Sıralama uygulanacak tarif listesi
  const filteredRecipes = recipes || [];

  // Sort recipes
  const sortedRecipes = (filteredRecipes || []).slice().sort((a, b) => {
    switch (sortBy) {
      case "rating":
        return (b.rating || 0) - (a.rating || 0);
      case "newest":
        return new Date(b.created_at).getTime() - new Date(a.created_at).getTime();
      case "oldest":
        return new Date(a.created_at).getTime() - new Date(b.created_at).getTime();
      default:
        return 0;
    }
  });

  // Convert to component format
  const formattedRecipes = sortedRecipes.map(recipe => ({
    id: recipe.id,
    title: recipe.title || 'Başlıksız Tarif',
    image: recipe.image_url || "https://images.unsplash.com/photo-1565299624946-b28f40a0ca4b?w=400&h=300&fit=crop",
    cookingTime: recipe.cooking_time != null ? recipe.cooking_time.toString() : "Bilinmiyor",
    difficulty: (recipe.difficulty as "Kolay" | "Orta" | "Zor") || "Kolay",
    rating: recipe.rating || 0,
    author: recipe.author_name || "Anonim",
    dblScore: Math.round((recipe.rating || 0) * 20),
    description: recipe.description || "Açıklama mevcut değil."
  }));

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />

      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            📖 Tüm Tarifler
          </h1>
          <p className="text-gray-600 max-w-2xl mx-auto">
            {formattedRecipes.length} adet lezzetli tarif sizi bekliyor
          </p>
        </div>

        {/* Search and Filter Bar */}
        <div className="bg-white rounded-xl shadow-sm p-6 mb-8">
          <div className="flex flex-col lg:flex-row gap-4 items-center">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              <Input
                type="text"
                placeholder="Tarif, yazar veya malzeme ara..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>

            <div className="flex items-center gap-4">
              <select
                aria-label="Sırala"
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="border border-gray-300 rounded-lg px-3 py-2 text-sm"
              >
                <option value="newest">En Yeni</option>
                <option value="oldest">En Eski</option>
                <option value="rating">En Yüksek Puan</option>
              </select>

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
        </div>

        {/* Results */}
        {formattedRecipes.length === 0 ? (
          <div className="text-center py-12">
            <h3 className="text-lg font-semibold text-gray-900 mb-2">
              Aradığınız kriterlere uygun tarif bulunamadı
            </h3>
            <p className="text-gray-600">
              Farklı anahtar kelimeler deneyin veya filtreleri değiştirin
            </p>
          </div>
        ) : (
          <div className={`${viewMode === "grid"
              ? "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6"
              : "space-y-4"
            }`}>
            {formattedRecipes.map((recipe) => (
              <RecipeCard key={recipe.id} {...recipe} />
            ))}
          </div>
        )}
      </div>

      <Footer />
    </div>
  );
};

export default Recipes;
