import { useState, useEffect } from "react";
import Navbar from "@/components/Navbar";
import Hero from "@/components/Hero";
import RecipeCard from "@/components/RecipeCard";
import CategoryCard from "@/components/CategoryCard";
import SkeletonCard from "@/components/SkeletonCard";
import Footer from "@/components/Footer";
import CommunityFeatures from "@/components/CommunityFeatures";
import PremiumPlans from "@/components/PremiumPlans";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { RefreshCw, TrendingUp, Award, Crown, Calendar, Eye, Heart, MessageCircle } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import ProgressBar from "@/components/ProgressBar";
import FloatingActionButton from "@/components/FloatingActionButton";
import BackToTop from "@/components/BackToTop";
import VideoStories from "@/components/VideoStories";
import { Link } from "react-router-dom";

const Index = () => {
  const [isLoading, setIsLoading] = useState(true);
  const [featuredRecipes, setFeaturedRecipes] = useState<any[]>([]);
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

  const blogPosts = [
    {
      id: 1,
      title: "2024'ün En Trend Yemek Akımları",
      excerpt: "Bu yıl mutfaklarda hangi trendler öne çıkıyor? Fermente gıdalardan sürdürülebilir beslenmeye kadar...",
      image: "https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=300&h=200&fit=crop",
      author: "Chef Ayşe Demir",
      date: "15 Şubat 2024",
      readTime: "5 dk",
      views: 2340,
      likes: 156,
      comments: 23,
      category: "Trend Tarifler"
    },
    {
      id: 2,
      title: "Evde Fermente Gıda Yapımı",
      excerpt: "Sağlığınıza faydalı fermente gıdaları evde nasıl yaparsınız? Kombucha'dan kimchiye pratik tarifler...",
      image: "https://images.unsplash.com/photo-1571091718767-18b5b1457add?w=300&h=200&fit=crop",
      author: "Dr. Mehmet Özkan",
      date: "12 Şubat 2024",
      readTime: "8 dk",
      views: 1890,
      likes: 98,
      comments: 45,
      category: "Sağlıklı Yaşam"
    },
    {
      id: 3,
      title: "Mutfak Ekipmanları Rehberi",
      excerpt: "Mutfağınızı yenilemek mi istiyorsunuz? İşte bu yıl öne çıkan mutfak aletleri ve tavsiyeleri...",
      image: "https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=300&h=200&fit=crop",
      author: "Zeynep Çelik",
      date: "10 Şubat 2024",
      readTime: "6 dk",
      views: 1567,
      likes: 89,
      comments: 12,
      category: "Ekipman İncelemeleri"
    }
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

  const handleRecipeSearch = () => {
    toast({
      title: "🔍 Tarif aranıyor",
      description: "Size uygun tarifler bulunuyor...",
    });
  };

  const handleTodayMenu = () => {
    toast({
      title: "📅 Bugünün menüsü hazırlanıyor",
      description: "Özel öneriler geliyor...",
    });
  };

  return (
    <div className="min-h-screen bg-white">
      <ProgressBar />
      <Navbar />
      <Hero />
      
      {/* Video Stories Section */}
      <VideoStories />
      
      <div className="max-w-7xl mx-auto px-4 py-8 space-y-16">
        {/* Bugün Ne Yesek AI - Updated with working buttons */}
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
              <div className="flex flex-col sm:flex-row gap-3 justify-center">
                <Button onClick={handleRecipeSearch} className="gradient-primary text-white">
                  🔍 Tarif Bul
                </Button>
                <Button onClick={handleTodayMenu} variant="outline">
                  📅 Bugün Ne Yesek?
                </Button>
                <Button onClick={handleNewSuggestion} variant="outline">
                  <RefreshCw className="mr-2 h-4 w-4" />
                  Yeni Öneri Al
                </Button>
              </div>
            </div>
          </div>
        </section>

        {/* Recipe Battle - Redesigned */}
        <section className="bg-gradient-to-br from-purple-50 to-pink-50 p-8 rounded-2xl">
          <div className="text-center mb-8">
            <h2 className="text-3xl font-bold text-gray-900 mb-4 flex items-center justify-center gap-2">
              ⚔️ Bu Haftanın Tarif Savaşı
              <Badge className="bg-red-500 text-white animate-pulse">CANLI</Badge>
            </h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              İki popüler tarif karşı karşıya! Hangisinin daha lezzetli olduğunu sen karar ver.
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto">
            <Card className="group hover:shadow-xl transition-all duration-300 hover:-translate-y-2">
              <div className="relative">
                <img 
                  src="https://images.unsplash.com/photo-1598103442097-8b74394b95c6?w=400&h=250&fit=crop"
                  alt="Tavuk Sote"
                  className="w-full h-48 object-cover rounded-t-lg"
                />
                <Badge className="absolute top-3 left-3 bg-blue-500 text-white">
                  🔵 Mavi Takım
                </Badge>
                <div className="absolute top-3 right-3 bg-black/50 text-white px-2 py-1 rounded text-sm">
                  %64 oy
                </div>
              </div>
              <CardContent className="p-6">
                <h3 className="font-bold text-lg mb-2">Geleneksel Tavuk Sote</h3>
                <p className="text-gray-600 text-sm mb-4">Chef Ayşe'nin klasik tarifi</p>
                <Button className="w-full bg-blue-500 hover:bg-blue-600 text-white">
                  Bu Tarife Oy Ver! 🗳️
                </Button>
              </CardContent>
            </Card>

            <Card className="group hover:shadow-xl transition-all duration-300 hover:-translate-y-2">
              <div className="relative">
                <img 
                  src="https://images.unsplash.com/photo-1547592166-23ac45744acd?w=400&h=250&fit=crop"
                  alt="Mercimek Çorbası"
                  className="w-full h-48 object-cover rounded-t-lg"
                />
                <Badge className="absolute top-3 left-3 bg-red-500 text-white">
                  🔴 Kırmızı Takım
                </Badge>
                <div className="absolute top-3 right-3 bg-black/50 text-white px-2 py-1 rounded text-sm">
                  %36 oy
                </div>
              </div>
              <CardContent className="p-6">
                <h3 className="font-bold text-lg mb-2">Baharatlı Mercimek Çorbası</h3>
                <p className="text-gray-600 text-sm mb-4">Zeynep Hanım'ın özel karışımı</p>
                <Button className="w-full bg-red-500 hover:bg-red-600 text-white">
                  Bu Tarife Oy Ver! 🗳️
                </Button>
              </CardContent>
            </Card>
          </div>

          <div className="text-center mt-8">
            <Badge className="bg-yellow-500 text-black px-4 py-2">
              ⏰ Savaş bitimine 2 gün 14 saat kaldı
            </Badge>
            <p className="text-sm text-gray-600 mt-2">
              Toplam {1247} kişi oy kullandı • Kazanan tarif öne çıkarılacak!
            </p>
          </div>
        </section>

        {/* Premium Plans */}
        <PremiumPlans />

        {/* Community Features */}
        <CommunityFeatures recipeId="featured" initialLikes={245} initialComments={67} />

        {/* Top Chefs */}
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

        {/* Featured Recipes */}
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

        {/* Categories */}
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

        {/* Blog Section */}
        <section>
          <div className="flex items-center justify-between mb-8">
            <h2 className="text-3xl font-bold text-gray-900 flex items-center gap-2">
              📝 Mutfak Blogu
            </h2>
            <Link to="/blog">
              <Button variant="outline">
                Tüm Yazıları Gör
              </Button>
            </Link>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {blogPosts.map((post) => (
              <Card key={post.id} className="overflow-hidden hover:shadow-lg transition-shadow cursor-pointer">
                <div className="relative">
                  <img 
                    src={post.image} 
                    alt={post.title}
                    className="w-full h-48 object-cover"
                  />
                  <Badge className="absolute top-3 left-3 bg-food-500 text-white text-xs">
                    {post.category}
                  </Badge>
                </div>
                
                <CardContent className="p-6">
                  <h3 className="font-semibold text-lg text-gray-900 mb-2 line-clamp-2">
                    {post.title}
                  </h3>
                  <p className="text-gray-600 text-sm mb-4 line-clamp-2">
                    {post.excerpt}
                  </p>
                  
                  <div className="flex items-center justify-between text-xs text-gray-500 mb-3">
                    <span className="flex items-center gap-1">
                      <Calendar className="h-3 w-3" />
                      {post.date}
                    </span>
                    <span>{post.readTime} okuma</span>
                  </div>

                  <div className="flex items-center justify-between text-xs text-gray-500">
                    <div className="flex items-center gap-3">
                      <span className="flex items-center gap-1">
                        <Eye className="h-3 w-3" />
                        {post.views}
                      </span>
                      <span className="flex items-center gap-1">
                        <Heart className="h-3 w-3" />
                        {post.likes}
                      </span>
                      <span className="flex items-center gap-1">
                        <MessageCircle className="h-3 w-3" />
                        {post.comments}
                      </span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </section>
      </div>

      <FloatingActionButton />
      <BackToTop />
      <Footer />
    </div>
  );
};

export default Index;
