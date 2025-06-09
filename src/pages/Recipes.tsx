import { useState } from "react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import RecipeCard from "@/components/RecipeCard";
import AdvancedSearch from "@/components/AdvancedSearch";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Search, Filter, SlidersHorizontal, Grid, List } from "lucide-react";

const Recipes = () => {
  const [selectedCategory, setSelectedCategory] = useState("Tümü");
  const [viewMode, setViewMode] = useState("grid");
  const [sortBy, setSortBy] = useState("popular");

  const categories = [
    "Tümü", "Ana Yemek", "Çorba", "Tatlı", "Kahvaltı", "15 Dakikada", 
    "Vegan", "Et Yemekleri", "Deniz Ürünleri", "Hamur İşleri", "Salata", "İçecekler"
  ];

  const sortOptions = [
    { value: "popular", label: "En Popüler" },
    { value: "rating", label: "En Yüksek Puan" },
    { value: "newest", label: "En Yeni" },
    { value: "cooktime", label: "Hazırlık Süresi" },
    { value: "difficulty", label: "Zorluk Derecesi" }
  ];

  // Örnek tarif verileri
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
      description: "Evdeki basit malzemelerle hazırlayabileceğiniz nefis tavuk sote tarifi.",
      category: "Ana Yemek"
    },
    {
      title: "Mercimek Çorbası",
      image: "https://images.unsplash.com/photo-1547592166-23ac45744acd?w=400&h=300&fit=crop",
      cookingTime: "30 dk",
      difficulty: "Kolay" as const,
      rating: 4.9,
      author: "Zeynep Hanım",
      dblScore: 88,
      description: "Geleneksel Türk mutfağından sıcacık ve tok tutan mercimek çorbası.",
      category: "Çorba"
    },
    {
      title: "Köfte ve Pilav",
      image: "https://images.unsplash.com/photo-1529042410759-befb1204b468?w=400&h=300&fit=crop",
      cookingTime: "45 dk",
      difficulty: "Orta" as const,
      rating: 4.7,
      author: "Mehmet Usta",
      dblScore: 92,
      description: "Ev yapımı köfte ve tereyağlı pilavın mükemmel uyumu.",
      category: "Ana Yemek"
    },
    {
      title: "Çikolatalı Kek",
      image: "https://images.unsplash.com/photo-1578985545062-69928b1d9587?w=400&h=300&fit=crop",
      cookingTime: "60 dk",
      difficulty: "Orta" as const,
      rating: 4.6,
      author: "Pasta Şefi",
      dblScore: 85,
      description: "Evde kolayca yapabileceğiniz nemli ve lezzetli çikolatalı kek.",
      category: "Tatlı"
    },
    {
      title: "Avokado Toast",
      image: "https://images.unsplash.com/photo-1541519227354-08fa5d50c44d?w=400&h=300&fit=crop",
      cookingTime: "10 dk",
      difficulty: "Kolay" as const,
      rating: 4.5,
      author: "Sağlık Uzmanı",
      dblScore: 78,
      description: "Sağlıklı ve lezzetli kahvaltı için mükemmel avokado toast.",
      category: "Kahvaltı"
    },
    {
      title: "Hızlı Omlet",
      image: "https://images.unsplash.com/photo-1506084868230-bb9d95c24759?w=400&h=300&fit=crop",
      cookingTime: "8 dk",
      difficulty: "Kolay" as const,
      rating: 4.4,
      author: "Pratik Chef",
      dblScore: 82,
      description: "15 dakikada hazır olan pratik ve lezzetli omlet tarifi.",
      category: "15 Dakikada"
    },
    {
      title: "Vegan Buddha Bowl",
      image: "https://images.unsplash.com/photo-1512621776951-a57141f2eefd?w=400&h=300&fit=crop",
      cookingTime: "20 dk",
      difficulty: "Kolay" as const,
      rating: 4.7,
      author: "Vegan Chef",
      dblScore: 89,
      description: "Besleyici ve renkli vegan buddha bowl tarifi.",
      category: "Vegan"
    },
    {
      title: "Domates Çorbası",
      image: "https://images.unsplash.com/photo-1547592180-85f173990554?w=400&h=300&fit=crop",
      cookingTime: "25 dk",
      difficulty: "Kolay" as const,
      rating: 4.6,
      author: "Ana Chef",
      dblScore: 84,
      description: "Taze domates ve baharatlarla hazırlanan nefis çorba.",
      category: "Çorba"
    }
  ];

  const filteredRecipes = recipes.filter(recipe => {
    const matchesCategory = selectedCategory === "Tümü" || recipe.category === selectedCategory;
    return matchesCategory;
  });

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      
      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-4">
            🍽️ Tüm Tarifler
          </h1>
          <p className="text-gray-600 max-w-2xl mx-auto">
            Binlerce lezzetli tarif arasından size en uygun olanı bulun
          </p>
        </div>

        {/* Gelişmiş Arama */}
        <AdvancedSearch />

        {/* Filtreler ve Görünüm */}
        <div className="bg-white rounded-xl shadow-sm p-6 mb-8">
          <div className="flex flex-col lg:flex-row gap-4 items-center justify-between mb-6">
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2">
                <SlidersHorizontal className="h-4 w-4 text-gray-500" />
                <span className="text-sm font-medium">Sıralama:</span>
              </div>
              <select 
                value={sortBy} 
                onChange={(e) => setSortBy(e.target.value)}
                className="border border-gray-300 rounded-lg px-3 py-2 text-sm"
              >
                {sortOptions.map(option => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
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

          {/* Kategori Filtreleri */}
          <div className="flex flex-wrap gap-2">
            {categories.map((category) => (
              <Button
                key={category}
                variant={selectedCategory === category ? "default" : "outline"}
                size="sm"
                onClick={() => setSelectedCategory(category)}
                className={selectedCategory === category ? "gradient-primary text-white" : ""}
              >
                {category}
              </Button>
            ))}
          </div>
        </div>

        {/* Aktif Filtreler */}
        <div className="mb-6">
          <div className="flex items-center justify-between">
            <p className="text-gray-600">
              <span className="font-semibold">{filteredRecipes.length}</span> tarif bulundu
              {selectedCategory !== "Tümü" && (
                <Badge className="ml-2 bg-food-100 text-food-800">
                  {selectedCategory}
                </Badge>
              )}
            </p>
            {selectedCategory !== "Tümü" && (
              <Button variant="ghost" size="sm" onClick={() => setSelectedCategory("Tümü")}>
                Filtreleri Temizle
              </Button>
            )}
          </div>
        </div>

        {/* Tarifler */}
        <div className={`${
          viewMode === "grid" 
            ? "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6" 
            : "space-y-4"
        }`}>
          {filteredRecipes.map((recipe, index) => (
            <RecipeCard key={index} {...recipe} />
          ))}
        </div>

        {/* Daha Fazla Yükle */}
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

export default Recipes;
