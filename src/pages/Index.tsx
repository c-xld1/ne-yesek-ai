
import Navbar from "@/components/Navbar";
import Hero from "@/components/Hero";
import RecipeCard from "@/components/RecipeCard";
import CategoryCard from "@/components/CategoryCard";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";

const Index = () => {
  // Sample data - Bu veriler ileride API'den gelecek
  const featuredRecipes = [
    {
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
      title: "Mercimek Çorbası",
      image: "https://images.unsplash.com/photo-1547592166-23ac45744acd?w=400&h=300&fit=crop",
      cookingTime: "30 dk",
      difficulty: "Kolay" as const,
      rating: 4.9,
      author: "Zeynep Hanım",
      dblScore: 88,
      description: "Geleneksel Türk mutfağından sıcacık ve tok tutan mercimek çorbası."
    },
    {
      title: "Köfte ve Pilav",
      image: "https://images.unsplash.com/photo-1529042410759-befb1204b468?w=400&h=300&fit=crop",
      cookingTime: "45 dk",
      difficulty: "Orta" as const,
      rating: 4.7,
      author: "Mehmet Usta",
      dblScore: 92,
      description: "Ev yapımı köfte ve tereyağlı pilavın mükemmel uyumu."
    },
    {
      title: "Çikolatalı Kek",
      image: "https://images.unsplash.com/photo-1578985545062-69928b1d9587?w=400&h=300&fit=crop",
      cookingTime: "60 dk",
      difficulty: "Orta" as const,
      rating: 4.6,
      author: "Pasta Şefi",
      dblScore: 85,
      description: "Evde kolayca yapabileceğiniz nemli ve lezzetli çikolatalı kek."
    }
  ];

  const categories = [
    {
      title: "Kahvaltı",
      description: "Güne enerjik başlayın",
      icon: "🍳",
      recipeCount: 150,
      color: "bg-gradient-to-br from-yellow-50 to-orange-50"
    },
    {
      title: "Ana Yemek",
      description: "Doyurucu ana yemekler",
      icon: "🍽️",
      recipeCount: 320,
      color: "bg-gradient-to-br from-red-50 to-pink-50"
    },
    {
      title: "Çorbalar",
      description: "Sıcacık ve besleyici",
      icon: "🍲",
      recipeCount: 80,
      color: "bg-gradient-to-br from-green-50 to-emerald-50"
    },
    {
      title: "Tatlılar",
      description: "Tatlı son dokunuş",
      icon: "🧁",
      recipeCount: 95,
      color: "bg-gradient-to-br from-purple-50 to-pink-50"
    },
    {
      title: "15 Dakikada",
      description: "Hızlı ve pratik",
      icon: "⚡",
      recipeCount: 65,
      color: "bg-gradient-to-br from-blue-50 to-cyan-50"
    },
    {
      title: "Vegan",
      description: "Bitkisel ve sağlıklı",
      icon: "🌱",
      recipeCount: 45,
      color: "bg-gradient-to-br from-green-50 to-lime-50"
    }
  ];

  return (
    <div className="min-h-screen bg-white">
      <Navbar />
      <Hero />
      
      {/* Bugün Ne Yesek Bölümü */}
      <section className="py-16 px-4 bg-gradient-to-r from-food-50 to-spice-50">
        <div className="max-w-7xl mx-auto text-center">
          <div className="bg-white rounded-2xl shadow-lg p-8 border border-orange-100">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              🤖 Bugün Ne Yesek AI?
            </h2>
            <p className="text-gray-600 mb-6 max-w-2xl mx-auto">
              Yapay zeka, bulunduğunuz konum, hava durumu ve saate göre size özel tarif önerisi hazırlıyor!
            </p>
            <div className="bg-gradient-to-r from-food-500 to-spice-500 text-white rounded-xl p-6 mb-6">
              <h3 className="text-xl font-semibold mb-2">Bugünün Önerisi</h3>
              <p className="text-food-100">
                "İstanbul'da soğuk bir akşam... Sıcak bir mercimek çorbası ve yanında tereyağlı ekmek nasıl olur? 🍲"
              </p>
            </div>
            <Button size="lg" className="gradient-primary text-white hover:opacity-90">
              Yeni Öneri Al
            </Button>
          </div>
        </div>
      </section>

      {/* Öne Çıkan Tarifler */}
      <section className="py-16 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              ⭐ Haftanın Yıldız Tarifleri
            </h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Toplumumuzun en çok beğendiği ve yüksek DBL skoruna sahip tarifler
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {featuredRecipes.map((recipe, index) => (
              <RecipeCard key={index} {...recipe} />
            ))}
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
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              📱 Videolu Tarifler
            </h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Adım adım video rehberiyle öğrenin
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-gray-100 rounded-xl aspect-[9/16] flex items-center justify-center">
              <div className="text-center text-gray-500">
                <div className="text-4xl mb-2">📺</div>
                <p>Video 1</p>
              </div>
            </div>
            <div className="bg-gray-100 rounded-xl aspect-[9/16] flex items-center justify-center">
              <div className="text-center text-gray-500">
                <div className="text-4xl mb-2">📺</div>
                <p>Video 2</p>
              </div>
            </div>
            <div className="bg-gray-100 rounded-xl aspect-[9/16] flex items-center justify-center">
              <div className="text-center text-gray-500">
                <div className="text-4xl mb-2">📺</div>
                <p>Video 3</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default Index;
