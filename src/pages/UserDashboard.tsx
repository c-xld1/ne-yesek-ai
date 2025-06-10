
import { useState } from "react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Progress } from "@/components/ui/progress";
import { 
  User, Heart, BookOpen, MessageCircle, Trophy, Settings, 
  Calendar, ChefHat, Star, TrendingUp, Award, Target 
} from "lucide-react";

const UserDashboard = () => {
  const [activeTab, setActiveTab] = useState("overview");

  const userStats = {
    recipesShared: 23,
    totalLikes: 456,
    followers: 89,
    following: 34,
    reputation: 1250,
    level: "Mutfak Ustası",
    nextLevel: "Şef",
    progressToNext: 65
  };

  const recentActivity = [
    {
      type: "recipe_liked",
      content: "Tavuk Sote tarifiniz 15 kişi tarafından beğenildi",
      time: "2 saat önce",
      icon: Heart,
      color: "text-red-500"
    },
    {
      type: "recipe_shared",
      content: "Yeni tarif paylaştınız: Mercimek Çorbası",
      time: "1 gün önce",
      icon: ChefHat,
      color: "text-green-500"
    },
    {
      type: "follower",
      content: "Chef Ayşe sizi takip etmeye başladı",
      time: "2 gün önce",
      icon: User,
      color: "text-blue-500"
    }
  ];

  const favoriteRecipes = [
    {
      id: 1,
      title: "Tavuk Sote",
      image: "https://images.unsplash.com/photo-1598103442097-8b74394b95c6?w=300&h=200&fit=crop",
      author: "Chef Mehmet",
      rating: 4.8,
      saves: 234
    },
    {
      id: 2,
      title: "Çikolatalı Kek",
      image: "https://images.unsplash.com/photo-1578985545062-69928b1d9587?w=300&h=200&fit=crop",
      author: "Pasta Şefi",
      rating: 4.9,
      saves: 189
    }
  ];

  const achievements = [
    {
      title: "İlk Tarif",
      description: "İlk tarifinizi paylaştınız",
      icon: ChefHat,
      earned: true,
      date: "15 Şubat 2024"
    },
    {
      title: "Popüler Tarif",
      description: "Tarifiniz 100+ beğeni aldı",
      icon: Heart,
      earned: true,
      date: "20 Şubat 2024"
    },
    {
      title: "Sosyal Kelebek",
      description: "50+ kişiyi takip edin",
      icon: User,
      earned: false,
      progress: 68
    },
    {
      title: "Tarif Ustası",
      description: "25 tarif paylaşın",
      icon: Trophy,
      earned: false,
      progress: 92
    }
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      
      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-4">
            🏠 Kontrol Paneli
          </h1>
          <p className="text-gray-600">
            Mutfak yolculuğunuzu takip edin ve yeni hedefler belirleyin
          </p>
        </div>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <TabsList className="grid w-full grid-cols-4 lg:w-auto lg:grid-cols-6">
            <TabsTrigger value="overview">Genel</TabsTrigger>
            <TabsTrigger value="recipes">Tariflerim</TabsTrigger>
            <TabsTrigger value="favorites">Favoriler</TabsTrigger>
            <TabsTrigger value="activity">Aktivite</TabsTrigger>
            <TabsTrigger value="achievements">Başarılar</TabsTrigger>
            <TabsTrigger value="settings">Ayarlar</TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-6">
            {/* User Profile Summary */}
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center gap-6">
                  <Avatar className="w-20 h-20">
                    <AvatarImage src="https://images.unsplash.com/photo-1494790108755-2616c4f23456?w=80&h=80&fit=crop" />
                    <AvatarFallback>AY</AvatarFallback>
                  </Avatar>
                  <div className="flex-1">
                    <h2 className="text-2xl font-bold text-gray-900">Ayşe Yılmaz</h2>
                    <p className="text-gray-600">@ayse_chef</p>
                    <div className="flex items-center gap-2 mt-2">
                      <Badge className="bg-food-100 text-food-800">{userStats.level}</Badge>
                      <span className="text-sm text-gray-500">{userStats.reputation} puan</span>
                    </div>
                  </div>
                  <Button variant="outline">
                    <Settings className="h-4 w-4 mr-2" />
                    Profili Düzenle
                  </Button>
                </div>
              </CardContent>
            </Card>

            {/* Stats Cards */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
              <Card>
                <CardContent className="p-4 text-center">
                  <ChefHat className="h-8 w-8 text-food-500 mx-auto mb-2" />
                  <div className="text-2xl font-bold text-gray-900">{userStats.recipesShared}</div>
                  <div className="text-sm text-gray-600">Paylaşılan Tarif</div>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="p-4 text-center">
                  <Heart className="h-8 w-8 text-red-500 mx-auto mb-2" />
                  <div className="text-2xl font-bold text-gray-900">{userStats.totalLikes}</div>
                  <div className="text-sm text-gray-600">Toplam Beğeni</div>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="p-4 text-center">
                  <User className="h-8 w-8 text-blue-500 mx-auto mb-2" />
                  <div className="text-2xl font-bold text-gray-900">{userStats.followers}</div>
                  <div className="text-sm text-gray-600">Takipçi</div>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="p-4 text-center">
                  <Trophy className="h-8 w-8 text-yellow-500 mx-auto mb-2" />
                  <div className="text-2xl font-bold text-gray-900">{userStats.reputation}</div>
                  <div className="text-sm text-gray-600">Reputasyon</div>
                </CardContent>
              </Card>
            </div>

            {/* Level Progress */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Target className="h-5 w-5" />
                  Seviye İlerlemesi
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex justify-between items-center">
                    <span className="font-medium">{userStats.level}</span>
                    <span className="text-sm text-gray-600">{userStats.nextLevel}</span>
                  </div>
                  <Progress value={userStats.progressToNext} className="h-3" />
                  <p className="text-sm text-gray-600">
                    {userStats.nextLevel} seviyesine ulaşmak için %{100 - userStats.progressToNext} daha!
                  </p>
                </div>
              </CardContent>
            </Card>

            {/* Recent Activity */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <TrendingUp className="h-5 w-5" />
                  Son Aktiviteler
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {recentActivity.map((activity, index) => (
                    <div key={index} className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                      <activity.icon className={`h-5 w-5 ${activity.color}`} />
                      <div className="flex-1">
                        <p className="text-sm text-gray-900">{activity.content}</p>
                        <p className="text-xs text-gray-500">{activity.time}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="favorites">
            <Card>
              <CardHeader>
                <CardTitle>Favori Tariflerim</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {favoriteRecipes.map((recipe) => (
                    <div key={recipe.id} className="border rounded-lg overflow-hidden hover:shadow-md transition-shadow">
                      <img src={recipe.image} alt={recipe.title} className="w-full h-32 object-cover" />
                      <div className="p-3">
                        <h4 className="font-semibold text-gray-900">{recipe.title}</h4>
                        <p className="text-sm text-gray-600">by {recipe.author}</p>
                        <div className="flex items-center justify-between mt-2">
                          <div className="flex items-center gap-1">
                            <Star className="h-4 w-4 text-yellow-500" />
                            <span className="text-sm">{recipe.rating}</span>
                          </div>
                          <span className="text-xs text-gray-500">{recipe.saves} kayıt</span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="achievements">
            <Card>
              <CardHeader>
                <CardTitle>Başarılarım</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {achievements.map((achievement, index) => (
                    <div key={index} className={`p-4 border rounded-lg ${achievement.earned ? 'bg-green-50 border-green-200' : 'bg-gray-50 border-gray-200'}`}>
                      <div className="flex items-center gap-3 mb-2">
                        <achievement.icon className={`h-6 w-6 ${achievement.earned ? 'text-green-600' : 'text-gray-400'}`} />
                        <div className="flex-1">
                          <h4 className="font-semibold text-gray-900">{achievement.title}</h4>
                          <p className="text-sm text-gray-600">{achievement.description}</p>
                        </div>
                        {achievement.earned && <Award className="h-5 w-5 text-yellow-500" />}
                      </div>
                      {achievement.earned ? (
                        <p className="text-xs text-green-600">Kazanıldı: {achievement.date}</p>
                      ) : (
                        <div className="space-y-1">
                          <Progress value={achievement.progress} className="h-2" />
                          <p className="text-xs text-gray-500">%{achievement.progress} tamamlandı</p>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>

      <Footer />
    </div>
  );
};

export default UserDashboard;
