import { useState, useEffect } from "react";
import Navbar from "@/components/Navbar";
import Hero from "@/components/Hero";
import RecipeCard from "@/components/RecipeCard";
import CategoryCard from "@/components/CategoryCard";
import SkeletonCard from "@/components/SkeletonCard";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { RefreshCw, TrendingUp, Award, Video } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import ProgressBar from "@/components/ProgressBar";
import FloatingActionButton from "@/components/FloatingActionButton";
import BackToTop from "@/components/BackToTop";

const Index = () => {
  const [isLoading, setIsLoading] = useState(true);
  const [featuredRecipes, setFeaturedRecipes] = useState<any[]>([]);
  const { toast } = useToast();

  // Sample data - Bu veriler ileride API'den gelecek
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
    }
  ];

  useEffect(() => {
    // Simulate loading
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

  return (
    <div className="min-h-screen bg-white">
      <ProgressBar />
      <Navbar />
      <Hero />
      
      {/* Bugün Ne Yesek Bölümü */}
      <section className="py-16 px-4 bg-gradient-to-r from-food-50 to-spice-50">
        <div className="max-w-7xl mx-auto text-center">
          <div className="bg-white rounded-2xl shadow-xl p-8 border border-orange-100 hover:shadow-2xl transition-shadow duration-300">
            <h2 className="text-3xl font-bold text-gray-900 mb-4 flex items-center justify-center gap-2">
              🤖 Bugün Ne Yesek AI?
              <TrendingUp className="h-6 w-6 text-food-600" />
            </h2>
            <p className="text-gray-600 mb-6 max-w-2xl mx-auto">
              Yapay zeka, bulunduğunuz konum, hava durumu ve saate göre size özel tarif önerisi hazırlıyor!
            </p>
            <div className="bg-gradient-to-r from-food-500 to-spice-500 text-white rounded-xl p-6 mb-6 hover:scale-105 transition-transform duration-300">
              <h3 className="text-xl font-semibold mb-2 flex items-center justify-center gap-2">
                <Award className="h-5 w-5" />
                Bugünün Önerisi
              </h3>
              <p className="text-food-100">
                "İstanbul'da soğuk bir akşam... Sıcak bir mercimek çorbası ve yanında tereyağlı ekmek nasıl olur? 🍲"
              </p>
            </div>
            <Button 
              size="lg" 
              className="gradient-primary text-white hover:opacity-90 hover:scale-105 transition-all duration-300"
              onClick={handleNewSuggestion}
            >
              <RefreshCw className="mr-2 h-4 w-4" />
              Yeni Öneri Al
            </Button>
          </div>
        </div>
      </section>

      {/* Öne Çıkan Tarifler */}
      <section className="py-16 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4 flex items-center justify-center gap-2">
              ⭐ Haftanın Yıldız Tarifleri
              <Award className="h-6 w-6 text-yellow-500 animate-pulse" />
            </h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Toplumumuzun en çok beğendiği ve yüksek DBL skoruna sahip tarifler
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {isLoading ? (
              Array(4).fill(0).map((_, index) => (
                <SkeletonCard key={index} />
              ))
            ) : (
              featuredRecipes.map((recipe, index) => (
                <RecipeCard key={recipe.id} {...recipe} />
              ))
            )}
          </div>
        </div>
      </section>

      {/* Kategoriler */}
      <section className="py-16 px-4 bg-gray-50">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              🗂️ Tarif Kategorileri
            </h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Aradığınız tarifi kolayca bulun
            </p>
          </div>
          
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
            {categories.map((category, index) => (
              <CategoryCard key={index} {...category} />
            ))}
          </div>
        </div>
      </section>

      {/* Video Tarifler */}
      <section className="py-16 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4 flex items-center justify-center gap-2">
              📱 Videolu Tarifler
              <Video className="h-6 w-6 text-red-500" />
            </h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Adım adım video rehberiyle öğrenin
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[1, 2, 3].map((i) => (
              <div key={i} className="bg-gradient-to-br from-gray-100 to-gray-200 rounded-xl aspect-[9/16] flex items-center justify-center hover:scale-105 transition-transform duration-300 cursor-pointer group">
                <div className="text-center text-gray-500 group-hover:text-gray-700">
                  <div className="text-4xl mb-2">📺</div>
                  <p className="font-medium">Video {i}</p>
                  <p className="text-sm mt-1">Yakında...</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <FloatingActionButton />
      <BackToTop />
      <Footer />
    </div>
  );
};

export default Index;
