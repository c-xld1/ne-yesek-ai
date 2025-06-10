
import { useState } from "react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import Hero from "@/components/Hero";
import CategoryCard from "@/components/CategoryCard";
import RecipeCard from "@/components/RecipeCard";
import VideoStories from "@/components/VideoStories";
import SeasonalRecommendations from "@/components/SeasonalRecommendations";
import WeeklyMealPlan from "@/components/WeeklyMealPlan";
import PremiumPlans from "@/components/PremiumPlans";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { 
  ChefHat, Crown, Utensils, Clock, Users, TrendingUp, 
  Sparkles, Calendar, Eye, MessageCircle, Heart, ArrowRight
} from "lucide-react";

const Index = () => {
  const [activeSection, setActiveSection] = useState("trending");

  const categories = [
    { title: "Kahvaltı", description: "Güne enerjik başlayın", icon: "🍳", recipeCount: 150, color: "bg-gradient-to-br from-yellow-100 to-orange-100" },
    { title: "Ana Yemek", description: "Doyurucu ana yemekler", icon: "🍽️", recipeCount: 320, color: "bg-gradient-to-br from-red-100 to-pink-100" },
    { title: "Çorbalar", description: "Sıcacık çorba tarifleri", icon: "🍲", recipeCount: 80, color: "bg-gradient-to-br from-green-100 to-teal-100" },
    { title: "Tatlılar", description: "Ağızda dağılan lezzetler", icon: "🧁", recipeCount: 95, color: "bg-gradient-to-br from-purple-100 to-pink-100" },
    { title: "15 Dakikada", description: "Hızlı ve pratik tarifler", icon: "⚡", recipeCount: 65, color: "bg-gradient-to-br from-blue-100 to-cyan-100" },
    { title: "Vegan", description: "Bitkisel beslenme", icon: "🌱", recipeCount: 45, color: "bg-gradient-to-br from-green-100 to-lime-100" },
  ];

  const featuredRecipes = [
    {
      id: "1",
      title: "Kremalı Mantarlı Tavuk",
      image: "https://images.unsplash.com/photo-1598103442097-8b74394b95c6?w=400&h=300&fit=crop",
      cookingTime: "35 dk",
      difficulty: "Orta" as const,
      rating: 4.9,
      author: "Chef Mehmet",
      dblScore: 98,
      description: "Restaurant kalitesinde kremalı mantarlı tavuk tarifi."
    },
    {
      id: "2",
      title: "Ev Yapımı Pizza",
      image: "https://images.unsplash.com/photo-1565299624946-b28f40a0ca4b?w=400&h=300&fit=crop",
      cookingTime: "45 dk",
      difficulty: "Kolay" as const,
      rating: 4.8,
      author: "Pizza Ustası",
      dblScore: 95,
      description: "Evde kolayca yapabileceğiniz nefis pizza tarifi."
    }
  ];

  // Yeni eklenen blog içerikleri
  const blogPosts = [
    {
      id: 1,
      title: "2024'ün En Trend Yemek Akımları",
      excerpt: "Bu yıl mutfaklarda hangi trendler öne çıkıyor? Fermente gıdalardan sürdürülebilir beslenmeye kadar...",
      image: "https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=300&h=200&fit=crop",
      author: {
        name: "Chef Ayşe Demir",
        avatar: "https://images.unsplash.com/photo-1494790108755-2616c4f23456?w=50&h=50&fit=crop"
      },
      category: "Trend Tarifler",
      date: "15 Şubat 2024",
      readTime: "5 dk",
      views: 2340,
      likes: 156,
      comments: 23
    },
    {
      id: 2,
      title: "Evde Fermente Gıda Yapımı: Başlangıç Rehberi",
      excerpt: "Sağlığınıza faydalı fermente gıdaları evde nasıl yaparsınız? Kombucha'dan kimchiye pratik tarifler...",
      image: "https://images.unsplash.com/photo-1571091718767-18b5b1457add?w=300&h=200&fit=crop",
      author: {
        name: "Dr. Mehmet Özkan",
        avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=50&h=50&fit=crop"
      },
      category: "Sağlıklı Yaşam",
      date: "12 Şubat 2024",
      readTime: "8 dk",
      views: 1890,
      likes: 98,
      comments: 45
    },
    {
      id: 3,
      title: "Mutfak Ekipmanları: 2024'te Neye Yatırım Yapmalı?",
      excerpt: "Mutfağınızı yenilemek mi istiyorsunuz? İşte bu yıl öne çıkan mutfak aletleri ve tavsiyeleri...",
      image: "https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=300&h=200&fit=crop",
      author: {
        name: "Zeynep Çelik",
        avatar: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=50&h=50&fit=crop"
      },
      category: "Ekipman İncelemeleri",
      date: "10 Şubat 2024",
      readTime: "6 dk",
      views: 1567,
      likes: 89,
      comments: 12
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 via-white to-yellow-50">
      <Navbar />
      
      {/* Hero Section */}
      <Hero />

      {/* Ne Yesek AI Section - Yeniden tasarlandı */}
      <section className="py-16">
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">
              🤖 Ne Yesek AI
            </h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Yapay zeka destekli önerilerle bugün ne pişireceğinizi kolayca bulun
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            <Card className="hover:shadow-xl transition-all duration-300 hover:-translate-y-1 border-0 bg-gradient-to-br from-blue-50 to-cyan-50">
              <CardContent className="p-8 text-center">
                <div className="w-16 h-16 bg-blue-500 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Utensils className="h-8 w-8 text-white" />
                </div>
                <h3 className="text-xl font-semibold mb-2">Tarif Bul</h3>
                <p className="text-gray-600 mb-4">Elinizdeki malzemelerle ne yapabileceğinizi keşfedin</p>
                <Button className="gradient-primary text-white w-full">
                  Tarifleri Keşfet
                </Button>
              </CardContent>
            </Card>

            <Card className="hover:shadow-xl transition-all duration-300 hover:-translate-y-1 border-0 bg-gradient-to-br from-green-50 to-emerald-50">
              <CardContent className="p-8 text-center">
                <div className="w-16 h-16 bg-green-500 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Sparkles className="h-8 w-8 text-white" />
                </div>
                <h3 className="text-xl font-semibold mb-2">Bugün Ne Yesek?</h3>
                <p className="text-gray-600 mb-4">AI'dan size özel yemek önerisi alın</p>
                <Button className="gradient-primary text-white w-full">
                  Öneri Al
                </Button>
              </CardContent>
            </Card>

            <Card className="hover:shadow-xl transition-all duration-300 hover:-translate-y-1 border-0 bg-gradient-to-br from-purple-50 to-pink-50">
              <CardContent className="p-8 text-center">
                <div className="w-16 h-16 bg-purple-500 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Clock className="h-8 w-8 text-white" />
                </div>
                <h3 className="text-xl font-semibold mb-2">Yeni Öneri Al</h3>
                <p className="text-gray-600 mb-4">Farklı lezzetler denemek için yeni öneriler</p>
                <Button className="gradient-primary text-white w-full">
                  Yenile
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Categories */}
      <section className="py-16 bg-white/50">
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              🍴 Kategoriler
            </h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Size uygun tarif kategorisini seçin ve lezzetli tarifleri keşfedin
            </p>
          </div>
          
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
            {categories.map((category, index) => (
              <CategoryCard key={index} {...category} />
            ))}
          </div>
        </div>
      </section>

      {/* Bu Haftanın Tarif Savaşı - Yeniden tasarlandı */}
      <section className="py-16">
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              ⚔️ Bu Haftanın Tarif Savaşı
            </h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              En popüler tarifler yarışıyor! Favori tarifinize oy verin
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <Card className="relative overflow-hidden border-2 border-red-200 bg-gradient-to-br from-red-50 to-pink-50">
              <div className="absolute top-4 left-4 z-10">
                <Badge className="bg-red-500 text-white">
                  <Crown className="h-3 w-3 mr-1" />
                  Şampiyon
                </Badge>
              </div>
              <CardContent className="p-0">
                <img 
                  src="https://images.unsplash.com/photo-1598103442097-8b74394b95c6?w=500&h=300&fit=crop"
                  alt="Kremalı Mantarlı Tavuk"
                  className="w-full h-64 object-cover"
                />
                <div className="p-6">
                  <h3 className="text-xl font-bold text-gray-900 mb-2">Kremalı Mantarlı Tavuk</h3>
                  <p className="text-gray-600 mb-4">Restaurant kalitesinde kremalı mantarlı tavuk tarifi.</p>
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-4 text-sm text-gray-600">
                      <span className="flex items-center gap-1">
                        <Heart className="h-4 w-4 text-red-500" />
                        1,247
                      </span>
                      <span className="flex items-center gap-1">
                        <MessageCircle className="h-4 w-4" />
                        89
                      </span>
                    </div>
                    <div className="text-right">
                      <div className="text-2xl font-bold text-red-600">67%</div>
                      <div className="text-xs text-gray-500">oy oranı</div>
                    </div>
                  </div>
                  <Button className="w-full bg-red-500 hover:bg-red-600 text-white">
                    Bu Tarife Oy Ver
                  </Button>
                </div>
              </CardContent>
            </Card>

            <Card className="relative overflow-hidden border-2 border-blue-200 bg-gradient-to-br from-blue-50 to-cyan-50">
              <div className="absolute top-4 left-4 z-10">
                <Badge className="bg-blue-500 text-white">
                  <TrendingUp className="h-3 w-3 mr-1" />
                  Rakip
                </Badge>
              </div>
              <CardContent className="p-0">
                <img 
                  src="https://images.unsplash.com/photo-1565299624946-b28f40a0ca4b?w=500&h=300&fit=crop"
                  alt="Ev Yapımı Pizza"
                  className="w-full h-64 object-cover"
                />
                <div className="p-6">
                  <h3 className="text-xl font-bold text-gray-900 mb-2">Ev Yapımı Pizza</h3>
                  <p className="text-gray-600 mb-4">Evde kolayca yapabileceğiniz nefis pizza tarifi.</p>
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-4 text-sm text-gray-600">
                      <span className="flex items-center gap-1">
                        <Heart className="h-4 w-4 text-red-500" />
                        856
                      </span>
                      <span className="flex items-center gap-1">
                        <MessageCircle className="h-4 w-4" />
                        64
                      </span>
                    </div>
                    <div className="text-right">
                      <div className="text-2xl font-bold text-blue-600">33%</div>
                      <div className="text-xs text-gray-500">oy oranı</div>
                    </div>
                  </div>
                  <Button className="w-full bg-blue-500 hover:bg-blue-600 text-white">
                    Bu Tarife Oy Ver
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>

          <div className="text-center mt-8">
            <p className="text-gray-600 mb-4">
              Toplam <span className="font-bold text-food-600">2,847</span> oy kullanıldı
            </p>
            <Button variant="outline" size="lg">
              Tüm Savaşları Görüntüle
            </Button>
          </div>
        </div>
      </section>

      {/* Featured Recipes */}
      <section className="py-16 bg-white/50">
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              ⭐ Öne Çıkan Tarifler
            </h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Bu haftanın en beğenilen ve en çok yapılan tarifleri
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {featuredRecipes.map((recipe) => (
              <RecipeCard key={recipe.id} {...recipe} />
            ))}
          </div>
        </div>
      </section>

      {/* Video Stories */}
      <section className="py-16">
        <div className="max-w-7xl mx-auto px-4">
          <VideoStories />
        </div>
      </section>

      {/* Seasonal Recommendations */}
      <section className="py-16 bg-white/50">
        <div className="max-w-7xl mx-auto px-4">
          <SeasonalRecommendations />
        </div>
      </section>

      {/* Premium Plans */}
      <section className="py-16">
        <div className="max-w-7xl mx-auto px-4">
          <PremiumPlans />
        </div>
      </section>

      {/* Blog Section - Yeni eklenen */}
      <section className="py-16 bg-white/50">
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              📝 Son Blog Yazıları
            </h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Mutfak dünyasından en güncel haberler, ipuçları ve uzman görüşleri
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
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
                  <p className="text-gray-600 text-sm mb-4 line-clamp-3">
                    {post.excerpt}
                  </p>
                  
                  <div className="flex items-center gap-3 mb-4">
                    <Avatar className="w-6 h-6">
                      <AvatarImage src={post.author.avatar} />
                      <AvatarFallback>{post.author.name[0]}</AvatarFallback>
                    </Avatar>
                    <div className="flex-1">
                      <p className="font-medium text-xs">{post.author.name}</p>
                      <div className="flex items-center gap-2 text-xs text-gray-500">
                        <span>{post.date}</span>
                        <span>•</span>
                        <span>{post.readTime}</span>
                      </div>
                    </div>
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

          <div className="text-center mt-8">
            <Button variant="outline" size="lg" className="flex items-center gap-2">
              Tüm Blog Yazıları
              <ArrowRight className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default Index;
