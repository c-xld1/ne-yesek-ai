
import { useParams } from "react-router-dom";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import RecipeCard from "@/components/RecipeCard";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { MapPin, Calendar, Star, Award, Users, Heart } from "lucide-react";

const Profile = () => {
  const { username } = useParams();

  // Örnek kullanıcı verisi
  const user = {
    username: username,
    name: "Chef Ayşe Demir",
    avatar: "https://images.unsplash.com/photo-1494790108755-2616c4f23456?w=150&h=150&fit=crop&crop=face",
    location: "İstanbul, Türkiye",
    joinDate: "Mart 2023",
    bio: "Yemek yapmayı seviyorum ve tarifleri paylaşmaktan mutluluk duyuyorum. Geleneksel Türk mutfağı uzmanıyım.",
    stats: {
      recipes: 24,
      followers: 1250,
      following: 186,
      totalLikes: 3420
    },
    badges: [
      { name: "Çorba Ustası", icon: "🍲", color: "bg-blue-500" },
      { name: "Tatlı Şampiyonu", icon: "🧁", color: "bg-pink-500" },
      { name: "Haftanın Kahramanı", icon: "⭐", color: "bg-yellow-500" },
      { name: "Topluluk Lideri", icon: "👑", color: "bg-purple-500" }
    ]
  };

  // Örnek kullanıcı tarifleri
  const userRecipes = [
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
      author: "Chef Ayşe",
      dblScore: 88,
      description: "Geleneksel Türk mutfağından sıcacık ve tok tutan mercimek çorbası."
    },
    {
      title: "Ev Böreği",
      image: "https://images.unsplash.com/photo-1565299624946-b28f40a0ca4b?w=400&h=300&fit=crop",
      cookingTime: "45 dk",
      difficulty: "Orta" as const,
      rating: 4.7,
      author: "Chef Ayşe",
      dblScore: 92,
      description: "Anne elinden çıkmış gibi nefis ev böreği tarifi."
    }
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      
      <div className="max-w-6xl mx-auto px-4 py-8">
        {/* Profil Header */}
        <Card className="mb-8">
          <CardContent className="p-8">
            <div className="flex flex-col md:flex-row gap-6">
              <div className="flex-shrink-0">
                <img
                  src={user.avatar}
                  alt={user.name}
                  className="w-32 h-32 rounded-full object-cover border-4 border-food-200"
                />
              </div>
              
              <div className="flex-1">
                <div className="flex flex-col md:flex-row md:items-start md:justify-between mb-4">
                  <div>
                    <h1 className="text-3xl font-bold text-gray-900 mb-2">{user.name}</h1>
                    <p className="text-gray-600 mb-2">@{user.username}</p>
                    <div className="flex items-center gap-4 text-sm text-gray-500 mb-4">
                      <div className="flex items-center gap-1">
                        <MapPin className="h-4 w-4" />
                        {user.location}
                      </div>
                      <div className="flex items-center gap-1">
                        <Calendar className="h-4 w-4" />
                        {user.joinDate} tarihinde katıldı
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex gap-2">
                    <Button className="gradient-primary text-white">
                      <Users className="h-4 w-4 mr-2" />
                      Takip Et
                    </Button>
                    <Button variant="outline">
                      <Heart className="h-4 w-4" />
                    </Button>
                  </div>
                </div>

                <p className="text-gray-700 mb-6">{user.bio}</p>

                {/* İstatistikler */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
                  <div className="text-center">
                    <div className="text-2xl font-bold text-food-600">{user.stats.recipes}</div>
                    <div className="text-sm text-gray-600">Tarif</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-food-600">{user.stats.followers}</div>
                    <div className="text-sm text-gray-600">Takipçi</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-food-600">{user.stats.following}</div>
                    <div className="text-sm text-gray-600">Takip</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-food-600">{user.stats.totalLikes}</div>
                    <div className="text-sm text-gray-600">Beğeni</div>
                  </div>
                </div>

                {/* Rozetler */}
                <div>
                  <h3 className="font-semibold text-lg mb-3 flex items-center gap-2">
                    <Award className="h-5 w-5 text-food-600" />
                    Rozetler
                  </h3>
                  <div className="flex flex-wrap gap-2">
                    {user.badges.map((badge, index) => (
                      <div
                        key={index}
                        className={`${badge.color} text-white px-3 py-1 rounded-full text-sm font-medium flex items-center gap-1`}
                      >
                        <span>{badge.icon}</span>
                        <span>{badge.name}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Tarif Sekmeleri */}
        <div className="mb-6">
          <div className="border-b border-gray-200">
            <nav className="flex space-x-8">
              <button className="border-b-2 border-food-500 text-food-600 pb-2 font-medium">
                Tarifleri ({user.stats.recipes})
              </button>
              <button className="text-gray-500 hover:text-gray-700 pb-2">
                Favoriler
              </button>
              <button className="text-gray-500 hover:text-gray-700 pb-2">
                Koleksiyonlar
              </button>
            </nav>
          </div>
        </div>

        {/* Tarifler Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {userRecipes.map((recipe, index) => (
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

export default Profile;
