
import { useState, useEffect } from "react";
import Navbar from "@/components/Navbar";
import Hero from "@/components/Hero";
import RecipeCard from "@/components/RecipeCard";
import CategoryCard from "@/components/CategoryCard";
import SkeletonCard from "@/components/SkeletonCard";
import Footer from "@/components/Footer";
import CommunityFeatures from "@/components/CommunityFeatures";
import AdvancedSearch from "@/components/AdvancedSearch";
import WeeklyMealPlan from "@/components/WeeklyMealPlan";
import SeasonalRecommendations from "@/components/SeasonalRecommendations";
import RegionalRecipeMap from "@/components/RegionalRecipeMap";
import ShoppingList from "@/components/ShoppingList";
import { Button } from "@/components/ui/button";
import { RefreshCw, TrendingUp, Award, Video, Crown, Users, Star } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import ProgressBar from "@/components/ProgressBar";
import FloatingActionButton from "@/components/FloatingActionButton";
import BackToTop from "@/components/BackToTop";

const Index = () => {
  const [isLoading, setIsLoading] = useState(true);
  const [featuredRecipes, setFeaturedRecipes] = useState<any[]>([]);
  const [activeTab, setActiveTab] = useState("recipes");
  const { toast } = useToast();

  // Sample data
  const recipeData = [
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
      isPopular: true,
      viewCount: 1250
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
      description: "Geleneksel Türk mutfağından sıcacık ve tok tutan mercimek çorbası.",
      viewCount: 980
    },
    {
      id: "3",
      title: "Köfte ve Pilav",
      image: "https://images.unsplash.com/photo-1529042410759-befb1204b468?w=400&h=300&fit=crop",
      cookingTime: "45 dk",
      difficulty: "Orta" as const,
      rating: 4.7,
      author: "Mehmet Usta",
      dblScore: 92,
      description: "Ev yapımı köfte ve tereyağlı pilavın mükemmel uyumu.",
      isPopular: true,
      viewCount: 1560
    },
    {
      id: "4",
      title: "Çikolatalı Kek",
      image: "https://images.unsplash.com/photo-1578985545062-69928b1d9587?w=400&h=300&fit=crop",
      cookingTime: "60 dk",
      difficulty: "Orta" as const,
      rating: 4.6,
      author: "Pasta Şefi",
      dblScore: 85,
      description: "Evde kolayca yapabileceğiniz nemli ve lezzetli çikolatalı kek.",
      viewCount: 742
    }
  ];

  const categories = [
    {
      title: "Kahvaltı",
      description: "Güne enerjik başlayın",
      icon: "🍳",
      recipeCount: 150,
      color: "bg-gradient-to-br from-yellow-50 to-orange-50 hover:from-yellow-100 hover:to-orange-100"
    },
    {
      title: "Ana Yemek", 
      description: "Doyurucu ana yemekler",
      icon: "🍽️",
      recipeCount: 320,
      color: "bg-gradient-to-br from-red-50 to-pink-50 hover:from-red-100 hover:to-pink-100"
    },
    {
      title: "Çorbalar",
      description: "Sıcacık ve besleyici", 
      icon: "🍲",
      recipeCount: 80,
      color: "bg-gradient-to-br from-green-50 to-emerald-50 hover:from-green-100 hover:to-emerald-100"
    },
    {
      title: "Tatlılar",
      description: "Tatlı son dokunuş",
      icon: "🧁", 
      recipeCount: 95,
      color: "bg-gradient-to-br from-purple-50 to-pink-50 hover:from-purple-100 hover:to-pink-100"
    },
    {
      title: "15 Dakikada",
      description: "Hızlı ve pratik",
      icon: "⚡",
      recipeCount: 65,
      color: "bg-gradient-to-br from-blue-50 to-cyan-50 hover:from-blue-100 hover:to-cyan-100"
    },
    {
      title: "Vegan",
      description: "Bitkisel ve sağlıklı",
      icon: "🌱",
      recipeCount: 45,
      color: "bg-gradient-to-br from-green-50 to-lime-50 hover:from-green-100 hover:to-lime-100"
    },
    {
      title: "Et Yemekleri",
      description: "Protein deposu", 
      icon: "🥩",
      recipeCount: 89,
      color: "bg-gradient-to-br from-red-50 to-orange-50 hover:from-red-100 hover:to-orange-100"
    },
    {
      title: "Deniz Ürünleri",
      description: "Okyanusun lezzetleri",
      icon: "🐟",
      recipeCount: 67,
      color: "bg-gradient-to-br from-blue-50 to-cyan-50 hover:from-blue-100 hover:to-cyan-100"
    },
    {
      title: "Hamur İşleri",
      description: "El emeği göz nuru",
      icon: "🥖",
      recipeCount: 73,
      color: "bg-gradient-to-br from-amber-50 to-yellow-50 hover:from-amber-100 hover:to-yellow-100"
    },
    {
      title: "Salata & Mezeler",
      description: "Taze ve renkli",
      icon: "🥗",
      recipeCount: 54,
      color: "bg-gradient-to-br from-green-50 to-emerald-50 hover:from-green-100 hover:to-emerald-100"
    },
    {
      title: "İçecekler",
      description: "Serinletici ve sıcak",
      icon: "🥤",
      recipeCount: 41,
      color: "bg-gradient-to-br from-purple-50 to-pink-50 hover:from-purple-100 hover:to-pink-100"
    },
    {
      title: "Fit Tarifler",
      description: "Sağlıklı yaşam",
      icon: "💪",
      recipeCount: 38,
      color: "bg-gradient-to-br from-green-50 to-lime-50 hover:from-green-100 hover:to-lime-100"
    }
  ];

  const topChefs = [
    { name: "Chef Ayşe", points: 2450, badge: "👑 Haftanın Şefi", recipes: 89 },
    { name: "Mehmet Usta", points: 2340, badge: "🔥 Et Tiryakisi", recipes: 76 },
    { name: "Zeynep Hanım", points: 2190, badge: "🧁 Tatlı Ustası", recipes: 65 },
    { name: "Pasta Şefi", points: 1980, badge: "⭐ Yeni Yetenek", recipes: 54 },
    { name: "Vegan Chef", points: 1850, badge: "🌱 Yeşil Guru", recipes: 48 }
  ];

  useEffect(() => {
    const timer = setTimeout(() => {
      setFeaturedRecipes(recipeData);
      setIsLoading(false);
    }, 1500);
    return () => clearTimeout(timer);
  }, []);

  const handleNewSuggestion = () => {
    toast({
      title: "🤖 Yeni öneri hazırlanıyor",
      description: "Konum ve hava durumu analiz ediliyor...",
    });
  };

  const navigationTabs = [
    { id: "recipes", label: "🏠 Ana Sayfa", icon: Award },
    { id: "search", label: "🔍 Gelişmiş Arama", icon: TrendingUp },
    { id: "meal-plan", label: "📅 Haftalık Plan", icon: Video },
    { id: "seasonal", label: "🍂 Mevsimsel", icon: RefreshCw },
    { id: "regional", label: "🗺️ Yöresel", icon: Users },
    { id: "shopping", label: "🛒 Market Listesi", icon: Star }
  ];

  return (
    <div className="min-h-screen bg-white">
      <ProgressBar />
      <Navbar />
      <Hero />
      
      {/* Navigation Tabs */}
      <section className="bg-white sticky top-16 z-40 border-b border-gray-200 shadow-sm">
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex overflow-x-auto scrollbar-hide">
            {navigationTabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center gap-2 px-6 py-4 whitespace-nowrap font-medium transition-all duration-200 border-b-2 ${
                  activeTab === tab.id
                    ? 'border-food-500 text-food-600 bg-food-50'
                    : 'border-transparent text-gray-600 hover:text-gray-900 hover:bg-gray-50'
                }`}
              >
                <tab.icon className="h-4 w-4" />
                {tab.label}
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* Tab Content */}
      <div className="max-w-7xl mx-auto px-4 py-8">
        {activeTab === "recipes" && (
          <div className="space-y-16">
            {/* Bugün Ne Yesek AI */}
            <section className="bg-gradient-to-r from-food-50 to-spice-50 p-8 rounded-2xl">
              <div className="text-center">
                <div className="bg-white rounded-2xl shadow-xl p-8 border border-orange-100">
                  <h2 className="text-3xl font-bold text-gray-900 mb-4 flex items-center justify-center gap-2">
                    🤖 Bugün Ne Yesek AI?
                    <TrendingUp className="h-6 w-6 text-food-600" />
                  </h2>
                  <p className="text-gray-600 mb-6 max-w-2xl mx-auto">
                    Yapay zeka, bulunduğunuz konum, hava durumu ve saate göre size özel tarif önerisi hazırlıyor!
                  </p>
                  <div className="bg-gradient-to-r from-food-500 to-spice-500 text-white rounded-xl p-6 mb-6">
                    <h3 className="text-xl font-semibold mb-2 flex items-center justify-center gap-2">
                      <Award className="h-5 w-5" />
                      Bugünün Önerisi
                    </h3>
                    <p className="text-food-100">
                      "İstanbul'da soğuk bir akşam... Sıcak bir mercimek çorbası ve yanında tereyağlı ekmek nasıl olur? 🍲"
                    </p>
                  </div>
                  <Button onClick={handleNewSuggestion} className="gradient-primary text-white">
                    <RefreshCw className="mr-2 h-4 w-4" />
                    Yeni Öneri Al
                  </Button>
                </div>
              </div>
            </section>

            {/* Topluluk Özellikleri */}
            <CommunityFeatures recipeId="featured" initialLikes={245} initialComments={67} />

            {/* En Çok Puan Alanlar */}
            <section>
              <h2 className="text-3xl font-bold text-gray-900 mb-8 text-center flex items-center justify-center gap-2">
                🏆 Haftanın Şefleri
                <Crown className="h-6 w-6 text-yellow-500" />
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
                {topChefs.map((chef, index) => (
                  <div key={index} className={`p-4 rounded-xl border-2 ${index === 0 ? 'border-yellow-400 bg-yellow-50' : 'border-gray-200 bg-white'}`}>
                    <div className="text-center">
                      <div className={`w-12 h-12 mx-auto mb-3 rounded-full flex items-center justify-center ${index === 0 ? 'bg-yellow-400' : 'bg-gray-200'}`}>
                        <span className="text-xl">{index === 0 ? '👑' : '👨‍🍳'}</span>
                      </div>
                      <h4 className="font-semibold">{chef.name}</h4>
                      <p className="text-sm text-gray-600">{chef.points} puan</p>
                      <p className="text-xs text-gray-500">{chef.recipes} tarif</p>
                      <div className="mt-2">
                        <span className="text-xs bg-gray-100 text-gray-700 px-2 py-1 rounded-full">
                          {chef.badge}
                        </span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </section>

            {/* Öne Çıkan Tarifler */}
            <section>
              <h2 className="text-3xl font-bold text-gray-900 mb-8 text-center flex items-center justify-center gap-2">
                ⭐ Haftanın Yıldız Tarifleri
                <Award className="h-6 w-6 text-yellow-500" />
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {isLoading ? (
                  Array(4).fill(0).map((_, index) => <SkeletonCard key={index} />)
                ) : (
                  featuredRecipes.map((recipe) => <RecipeCard key={recipe.id} {...recipe} />)
                )}
              </div>
            </section>

            {/* Kategoriler */}
            <section className="bg-gray-50 -mx-4 px-4 py-16">
              <h2 className="text-3xl font-bold text-gray-900 mb-8 text-center">
                🗂️ Tarif Kategorileri
              </h2>
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                {categories.map((category, index) => (
                  <CategoryCard key={index} {...category} />
                ))}
              </div>
            </section>
          </div>
        )}

        {activeTab === "search" && <AdvancedSearch />}
        {activeTab === "meal-plan" && <WeeklyMealPlan />}
        {activeTab === "seasonal" && <SeasonalRecommendations />}
        {activeTab === "regional" && <RegionalRecipeMap />}
        {activeTab === "shopping" && <ShoppingList />}
      </div>

      <FloatingActionButton />
      <BackToTop />
      <Footer />
    </div>
  );
};

export default Index;
