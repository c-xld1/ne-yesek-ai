
import { useState } from "react";
import { useSearchParams } from "react-router-dom";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import RecipeCard from "@/components/RecipeCard";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Search, Filter, Grid, List } from "lucide-react";

const Categories = () => {
  const [searchParams] = useSearchParams();
  const kategori = searchParams.get("kategori") || "Tümü";
  const [viewMode, setViewMode] = useState("grid");
  const [sortBy, setSortBy] = useState("popular");

  const categories = [
    { name: "Kahvaltı", count: 150, icon: "🍳" },
    { name: "Ana Yemek", count: 320, icon: "🍽️" },
    { name: "Çorbalar", count: 80, icon: "🍲" },
    { name: "Tatlılar", count: 95, icon: "🧁" },
    { name: "15 Dakikada", count: 65, icon: "⚡" },
    { name: "Vegan", count: 45, icon: "🌱" },
    { name: "Et Yemekleri", count: 89, icon: "🥩" },
    { name: "Deniz Ürünleri", count: 67, icon: "🐟" },
    { name: "Hamur İşleri", count: 73, icon: "🥖" },
    { name: "Salata & Mezeler", count: 54, icon: "🥗" },
    { name: "İçecekler", count: 41, icon: "🥤" },
    { name: "Fit Tarifler", count: 38, icon: "💪" }
  ];

  const recipes = [
    {
      id: "1",
      title: "Tavuk Sote",
      image: "https://images.unsplash.com/photo-1598103442097-8b74394b95c6?w=400&h=300&fit=crop",
      cookingTime: "25 dk",
      difficulty: "Kolay" as const,
      rating: 4.8,
      author: "Chef Ayşe",
      dblScore: 95,
      description: "Evdeki basit malzemelerle hazırlayabileceğiniz nefis tavuk sote tarifi."
    },
    {
      id: "2",
      title: "Mercimek Çorbası",
      image: "https://images.unsplash.com/photo-1547592166-23ac45744acd?w=400&h=300&fit=crop",
      cookingTime: "30 dk",
      difficulty: "Kolay" as const,
      rating: 4.9,
      author: "Zeynep Hanım",
      dblScore: 88,
      description: "Geleneksel Türk mutfağından sıcacık ve tok tutan mercimek çorbası."
    }
  ];

  const currentCategory = categories.find(cat => cat.name === kategori);

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      
      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-4 flex items-center justify-center gap-3">
            {currentCategory?.icon} {kategori} Tarifleri
          </h1>
          <p className="text-gray-600 max-w-2xl mx-auto">
            {currentCategory ? `${currentCategory.count} adet ${kategori.toLowerCase()} tarifi` : "Tüm kategorilerden tarifler"}
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
          {recipes.map((recipe) => (
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
