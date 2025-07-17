import { useParams } from "react-router-dom";
import { motion } from "framer-motion";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import RecipeCard from "@/components/RecipeCard";
import UserProfileCard from "@/components/UserProfileCard";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { MapPin, Calendar, Star, Award, Users, Heart, Settings, Share2, MessageCircle, ChefHat } from "lucide-react";

const Profile = () => {
  const { username } = useParams();

  // Örnek kullanıcı verisi
  const user = {
    username: username || 'chef',
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
    }
  };

  // Örnek kullanıcı tarifleri
  const userRecipes = [
    {
      id: "1",
      title: "Tavuk Sote",
      image: "https://images.unsplash.com/photo-1598103442097-8b74394b95c6?w=400&h=300&fit=crop",
      cookingTime: "25 dk",
      difficulty: "Kolay" as const,
      rating: 4.8,
      author: "Chef Ayşe",
      description: "Evdeki basit malzemelerle hazırlayabileceğiniz nefis tavuk sote tarifi.",
      category: "Ana Yemek"
    },
    {
      id: "2",
      title: "Mercimek Çorbası",
      image: "https://images.unsplash.com/photo-1547592166-23ac45744acd?w=400&h=300&fit=crop",
      cookingTime: "30 dk",
      difficulty: "Kolay" as const,
      rating: 4.7,
      author: "Chef Ayşe",
      description: "Geleneksel Türk mutfağından sıcacık mercimek çorbası.",
      category: "Çorba"
    },
    {
      id: "3",
      title: "Çikolatalı Kek",
      image: "https://images.unsplash.com/photo-1578985545062-69928b1d9587?w=400&h=300&fit=crop",
      cookingTime: "60 dk",
      difficulty: "Orta" as const,
      rating: 4.9,
      author: "Chef Ayşe",
      description: "Evde kolayca yapabileceğiniz nemli çikolatalı kek.",
      category: "Tatlı"
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 via-white to-orange-50">
      <Navbar />

      {/* Background Elements */}
      <div className="absolute inset-0 overflow-hidden">
        <motion.div
          className="absolute top-20 right-20 w-72 h-72 bg-gradient-to-br from-orange-400/10 to-orange-600/5 rounded-full blur-3xl"
          animate={{
            x: [0, 30, 0],
            y: [0, 20, 0],
            scale: [1, 1.1, 1]
          }}
          transition={{ duration: 18, repeat: Infinity, ease: "easeInOut" }}
        />
        <motion.div
          className="absolute bottom-20 left-20 w-80 h-80 bg-gradient-to-br from-blue-400/10 to-purple-600/5 rounded-full blur-3xl"
          animate={{
            x: [0, -25, 0],
            y: [0, -30, 0],
            scale: [1, 1.2, 1]
          }}
          transition={{ duration: 22, repeat: Infinity, ease: "easeInOut" }}
        />
      </div>

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
        {/* Modern Profile Card */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="mb-8"
        >
          <UserProfileCard
            user={{
              id: '1',
              name: user.name,
              username: user.username,
              bio: user.bio,
              avatar: user.avatar,
              coverImage: 'https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=800&h=300&fit=crop',
              location: user.location,
              joinDate: user.joinDate,
              website: 'https://neyesek.ai',
              socialLinks: {
                instagram: '@' + user.username,
                youtube: user.name,
                twitter: '@' + user.username
              }
            }}
            stats={{
              recipes: user.stats.recipes,
              followers: user.stats.followers,
              following: user.stats.following,
              likes: user.stats.totalLikes,
              views: 45800,
              rating: 4.8
            }}
            isOwnProfile={true}
          />
        </motion.div>

        {/* User Recipes Section */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
        >
          <Tabs defaultValue="recipes" className="w-full">
            <TabsList className="grid w-full grid-cols-3 bg-white/80 backdrop-blur-sm border border-orange-100">
              <TabsTrigger value="recipes" className="flex items-center gap-2">
                <ChefHat className="h-4 w-4" />
                Tarifler ({user.stats.recipes})
              </TabsTrigger>
              <TabsTrigger value="favorites" className="flex items-center gap-2">
                <Heart className="h-4 w-4" />
                Favoriler
              </TabsTrigger>
              <TabsTrigger value="collections" className="flex items-center gap-2">
                <Star className="h-4 w-4" />
                Koleksiyonlar
              </TabsTrigger>
            </TabsList>

            <TabsContent value="recipes" className="mt-8">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {userRecipes.map((recipe, index) => (
                  <motion.div
                    key={recipe.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.1 }}
                    className="transform hover:scale-105 transition-all duration-300"
                  >
                    <RecipeCard
                      id={recipe.id}
                      title={recipe.title}
                      image={recipe.image}
                      cookingTime={recipe.cookingTime}
                      difficulty={recipe.difficulty}
                      rating={recipe.rating}
                      author={recipe.author}
                      description={recipe.description}
                    />
                  </motion.div>
                ))}
              </div>
            </TabsContent>

            <TabsContent value="favorites" className="mt-8">
              <div className="text-center py-12">
                <Heart className="h-16 w-16 mx-auto text-gray-300 mb-4" />
                <p className="text-gray-500">Henüz favori tarif eklenmemiş</p>
              </div>
            </TabsContent>

            <TabsContent value="collections" className="mt-8">
              <div className="text-center py-12">
                <Star className="h-16 w-16 mx-auto text-gray-300 mb-4" />
                <p className="text-gray-500">Henüz koleksiyon oluşturulmamış</p>
              </div>
            </TabsContent>
          </Tabs>
        </motion.div>
      </div>

      <Footer />
    </div>
  );
};

export default Profile;
