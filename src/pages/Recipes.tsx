
import { useState } from "react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import RecipeCard from "@/components/RecipeCard";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Search, Filter } from "lucide-react";

const Recipes = () => {
  const [selectedCategory, setSelectedCategory] = useState("Tümü");
  const [searchTerm, setSearchTerm] = useState("");

  const categories = ["Tümü", "Ana Yemek", "Çorba", "Tatlı", "Kahvaltı", "15 Dakikada", "Vegan"];

  // Örnek tarif verileri
  const recipes = [
    {
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
    const matchesSearch = recipe.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         recipe.description.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesCategory && matchesSearch;
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

        {/* Arama ve Filtreler */}
        <div className="bg-white rounded-xl shadow-sm p-6 mb-8">
          <div className="flex flex-col md:flex-row gap-4 mb-6">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
              <Input
                placeholder="Tarif ara..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
            <Button variant="outline" className="md:w-auto">
              <Filter className="h-4 w-4 mr-2" />
              Gelişmiş Filtre
            </Button>
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

        {/* Sonuçlar */}
        <div className="mb-6">
          <p className="text-gray-600">
            <span className="font-semibold">{filteredRecipes.length}</span> tarif bulundu
          </p>
        </div>

        {/* Tarifler Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
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
