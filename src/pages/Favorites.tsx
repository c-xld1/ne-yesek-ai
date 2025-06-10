
import { useState } from "react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import RecipeCard from "@/components/RecipeCard";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Heart, BookOpen, Users, Grid, List, Filter, Search } from "lucide-react";

const Favorites = () => {
  const [viewMode, setViewMode] = useState("grid");
  const [activeTab, setActiveTab] = useState("recipes");

  const favoriteRecipes = [
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
      savedDate: "2 gün önce"
    },
    {
      id: "2",
      title: "Çikolatalı Kek",
      image: "https://images.unsplash.com/photo-1578985545062-69928b1d9587?w=400&h=300&fit=crop",
      cookingTime: "60 dk",
      difficulty: "Orta" as const,
      rating: 4.9,
      author: "Pasta Şefi",
      dblScore: 88,
      description: "Evde kolayca yapabileceğiniz nemli ve lezzetli çikolatalı kek.",
      savedDate: "1 hafta önce"
    },
    {
      id: "3",
      title: "Mercimek Çorbası",
      image: "https://images.unsplash.com/photo-1547592166-23ac45744acd?w=400&h=300&fit=crop",
      cookingTime: "30 dk",
      difficulty: "Kolay" as const,
      rating: 4.7,
      author: "Zeynep Hanım",
      dblScore: 92,
      description: "Geleneksel Türk mutfağından sıcacık ve tok tutan mercimek çorbası.",
      savedDate: "2 hafta önce"
    }
  ];

  const favoriteAuthors = [
    {
      id: 1,
      name: "Chef Mehmet",
      username: "@chef_mehmet",
      avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=50&h=50&fit=crop",
      followers: 12450,
      recipes: 89,
      specialties: ["Türk Mutfağı", "Et Yemekleri"],
      followedDate: "3 gün önce"
    },
    {
      id: 2,
      name: "Ayşe Demir",
      username: "@ayse_mutfak",
      avatar: "https://images.unsplash.com/photo-1494790108755-2616c4f23456?w=50&h=50&fit=crop",
      followers: 8760,
      recipes: 156,
      specialties: ["Ev Yemekleri", "Tatlılar"],
      followedDate: "1 hafta önce"
    }
  ];

  const savedCollections = [
    {
      id: 1,
      name: "Hızlı Akşam Yemekleri",
      description: "30 dakikada hazır olan nefis yemekler",
      recipeCount: 12,
      thumbnail: "https://images.unsplash.com/photo-1598103442097-8b74394b95c6?w=200&h=200&fit=crop",
      createdDate: "1 ay önce"
    },
    {
      id: 2,
      name: "Sağlıklı Tarifler",
      description: "Fit ve besleyici yemek tarifleri",
      recipeCount: 8,
      thumbnail: "https://images.unsplash.com/photo-1512621776951-a57141f2eefd?w=200&h=200&fit=crop",
      createdDate: "2 hafta önce"
    }
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      
      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-4">
            ❤️ Favorilerim
          </h1>
          <p className="text-gray-600 max-w-2xl mx-auto">
            Beğendiğiniz tarifler, takip ettiğiniz yazarlar ve koleksiyonlarınız
          </p>
        </div>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <div className="flex flex-col lg:flex-row gap-4 items-center justify-between">
            <TabsList className="grid w-full lg:w-auto grid-cols-3">
              <TabsTrigger value="recipes" className="flex items-center gap-2">
                <Heart className="h-4 w-4" />
                Tarifler ({favoriteRecipes.length})
              </TabsTrigger>
              <TabsTrigger value="authors" className="flex items-center gap-2">
                <Users className="h-4 w-4" />
                Yazarlar ({favoriteAuthors.length})
              </TabsTrigger>
              <TabsTrigger value="collections" className="flex items-center gap-2">
                <BookOpen className="h-4 w-4" />
                Koleksiyonlar ({savedCollections.length})
              </TabsTrigger>
            </TabsList>

            <div className="flex items-center gap-2">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                <input
                  type="text"
                  placeholder="Favorilerde ara..."
                  className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg w-64"
                />
              </div>
              <Button variant="outline" size="sm">
                <Filter className="h-4 w-4 mr-2" />
                Filtrele
              </Button>
            </div>
          </div>

          {/* Favorite Recipes */}
          <TabsContent value="recipes" className="space-y-6">
            <div className="flex justify-between items-center">
              <h2 className="text-xl font-semibold text-gray-900">
                Favori Tariflerim
              </h2>
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

            {favoriteRecipes.length > 0 ? (
              <div className={`${
                viewMode === "grid" 
                  ? "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6" 
                  : "space-y-4"
              }`}>
                {favoriteRecipes.map((recipe) => (
                  <div key={recipe.id} className="relative">
                    <RecipeCard {...recipe} />
                    <div className="absolute top-2 right-2">
                      <Button size="sm" variant="secondary" className="h-8 w-8 p-0">
                        <Heart className="h-4 w-4 text-red-500 fill-current" />
                      </Button>
                    </div>
                    <div className="mt-2 text-xs text-gray-500 text-center">
                      Kaydedilme: {recipe.savedDate}
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <Card>
                <CardContent className="p-12 text-center">
                  <Heart className="h-16 w-16 text-gray-300 mx-auto mb-4" />
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">
                    Henüz favori tarifiniz yok
                  </h3>
                  <p className="text-gray-600 mb-4">
                    Beğendiğiniz tarifleri favorilere ekleyerek kolayca bulabilirsiniz
                  </p>
                  <Button className="gradient-primary text-white">
                    Tarifleri Keşfet
                  </Button>
                </CardContent>
              </Card>
            )}
          </TabsContent>

          {/* Favorite Authors */}
          <TabsContent value="authors" className="space-y-6">
            <h2 className="text-xl font-semibold text-gray-900">
              Takip Ettiğim Yazarlar
            </h2>

            {favoriteAuthors.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {favoriteAuthors.map((author) => (
                  <Card key={author.id} className="hover:shadow-lg transition-shadow">
                    <CardContent className="p-6">
                      <div className="flex items-center gap-4 mb-4">
                        <img 
                          src={author.avatar} 
                          alt={author.name}
                          className="w-12 h-12 rounded-full object-cover"
                        />
                        <div className="flex-1">
                          <h3 className="font-semibold text-gray-900">{author.name}</h3>
                          <p className="text-sm text-gray-600">{author.username}</p>
                        </div>
                        <Button size="sm" variant="outline">
                          Takip Ediliyor
                        </Button>
                      </div>
                      
                      <div className="grid grid-cols-2 gap-4 mb-4">
                        <div className="text-center">
                          <div className="text-lg font-bold text-gray-900">{author.followers.toLocaleString()}</div>
                          <div className="text-xs text-gray-600">Takipçi</div>
                        </div>
                        <div className="text-center">
                          <div className="text-lg font-bold text-gray-900">{author.recipes}</div>
                          <div className="text-xs text-gray-600">Tarif</div>
                        </div>
                      </div>

                      <div className="mb-4">
                        <div className="flex flex-wrap gap-1">
                          {author.specialties.map((specialty, index) => (
                            <Badge key={index} variant="secondary" className="text-xs">
                              {specialty}
                            </Badge>
                          ))}
                        </div>
                      </div>

                      <div className="text-xs text-gray-500 text-center">
                        Takip edilme: {author.followedDate}
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            ) : (
              <Card>
                <CardContent className="p-12 text-center">
                  <Users className="h-16 w-16 text-gray-300 mx-auto mb-4" />
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">
                    Henüz kimseyi takip etmiyorsunuz
                  </h3>
                  <p className="text-gray-600 mb-4">
                    Favori yazarlarınızı takip ederek yeni tariflerini kaçırmayın
                  </p>
                  <Button className="gradient-primary text-white">
                    Yazarları Keşfet
                  </Button>
                </CardContent>
              </Card>
            )}
          </TabsContent>

          {/* Collections */}
          <TabsContent value="collections" className="space-y-6">
            <div className="flex justify-between items-center">
              <h2 className="text-xl font-semibold text-gray-900">
                Tarif Koleksiyonlarım
              </h2>
              <Button className="gradient-primary text-white">
                <BookOpen className="h-4 w-4 mr-2" />
                Yeni Koleksiyon
              </Button>
            </div>

            {savedCollections.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {savedCollections.map((collection) => (
                  <Card key={collection.id} className="hover:shadow-lg transition-shadow cursor-pointer">
                    <CardContent className="p-0">
                      <img 
                        src={collection.thumbnail} 
                        alt={collection.name}
                        className="w-full h-40 object-cover rounded-t-lg"
                      />
                      <div className="p-4">
                        <h3 className="font-semibold text-gray-900 mb-2">{collection.name}</h3>
                        <p className="text-gray-600 text-sm mb-3">{collection.description}</p>
                        <div className="flex justify-between items-center text-sm">
                          <span className="text-gray-500">{collection.recipeCount} tarif</span>
                          <span className="text-gray-500">{collection.createdDate}</span>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            ) : (
              <Card>
                <CardContent className="p-12 text-center">
                  <BookOpen className="h-16 w-16 text-gray-300 mx-auto mb-4" />
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">
                    Henüz koleksiyonunuz yok
                  </h3>
                  <p className="text-gray-600 mb-4">
                    Tarifleri kategorilere ayırarak düzenli tutun
                  </p>
                  <Button className="gradient-primary text-white">
                    İlk Koleksiyonunuzu Oluşturun
                  </Button>
                </CardContent>
              </Card>
            )}
          </TabsContent>
        </Tabs>
      </div>

      <Footer />
    </div>
  );
};

export default Favorites;
