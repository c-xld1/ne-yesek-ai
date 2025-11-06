import { useParams, Navigate } from "react-router-dom";
import { motion } from "framer-motion";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import RecipeCard from "@/components/RecipeCard";
import UserProfileCard from "@/components/UserProfileCard";
import LoadingSpinner from "@/components/LoadingSpinner";
import { useAuth } from "@/contexts/AuthContext";
import { useUserProfile, useUserRecipes, useUserFavorites } from "@/hooks/useUserProfile";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { MapPin, Calendar, Star, Award, Users, Heart, Settings, Share2, MessageCircle, ChefHat } from "lucide-react";

const Profile = () => {
  const { username } = useParams();
  const { user: currentUser } = useAuth();

  // Eğer /profil route'u kullanılmışsa ve kullanıcı giriş yapmışsa, kendi profil sayfasına yönlendir
  if (!username && currentUser?.username) {
    return <Navigate to={`/profil/${currentUser.username}`} replace />;
  }

  // Eğer username yoksa ve kullanıcı giriş yapmamışsa, login sayfasına yönlendir
  if (!username && !currentUser) {
    return <Navigate to="/giris-yap" replace />;
  }

  // Kullanıcının kendi profilini mi görüntülüyor
  const isOwnProfile = username === currentUser?.username;

  // Gerçek kullanıcı verisini Supabase'den çek
  const { data: profileData, isLoading: profileLoading, error: profileError } = useUserProfile(username);
  const { data: userRecipes = [], isLoading: recipesLoading } = useUserRecipes(profileData?.id);
  const { data: userFavorites = [], isLoading: favoritesLoading } = useUserFavorites(profileData?.id);

  // Yükleniyor durumu
  if (profileLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-orange-50 via-white to-orange-50">
        <Navbar />
        <div className="flex items-center justify-center min-h-[60vh]">
          <LoadingSpinner />
        </div>
        <Footer />
      </div>
    );
  }

  // Profil bulunamadı
  if (profileError || !profileData) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-orange-50 via-white to-orange-50">
        <Navbar />
        <div className="flex items-center justify-center min-h-[60vh]">
          <div className="text-center max-w-md mx-auto px-4">
            <div className="bg-white rounded-lg shadow-lg p-8">
              <div className="text-6xl mb-4">🔍</div>
              <h2 className="text-2xl font-bold text-gray-800 mb-3">Kullanıcı Bulunamadı</h2>
              <p className="text-gray-600 mb-4">
                <span className="font-semibold">@{username}</span> kullanıcısı mevcut değil.
              </p>
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-4">
                <p className="text-sm text-blue-800">
                  💡 <strong>İpucu:</strong> Kullanıcı profili oluşturmak için önce kayıt olup, 
                  ayarlar sayfasından kullanıcı adınızı belirleyin.
                </p>
              </div>
              {profileError && (
                <details className="text-left bg-gray-50 rounded p-3 mt-3">
                  <summary className="cursor-pointer text-sm text-gray-600 font-medium">
                    Teknik Detaylar
                  </summary>
                  <pre className="text-xs mt-2 text-red-600 overflow-auto">
                    {JSON.stringify(profileError, null, 2)}
                  </pre>
                </details>
              )}
              <div className="mt-6 space-x-3">
                <Button 
                  variant="default" 
                  onClick={() => window.location.href = '/'}
                >
                  Ana Sayfaya Dön
                </Button>
                {currentUser ? (
                  <Button 
                    variant="outline" 
                    onClick={() => window.location.href = `/profil/${currentUser.username}`}
                  >
                    Profilime Git
                  </Button>
                ) : (
                  <Button 
                    variant="outline" 
                    onClick={() => window.location.href = '/kayit-ol'}
                  >
                    Kayıt Ol
                  </Button>
                )}
              </div>
            </div>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  const user = {
    id: profileData.id,
    username: profileData.username,
    name: profileData.fullname || profileData.username,
    avatar: profileData.avatar_url || "https://images.unsplash.com/photo-1494790108755-2616c4f23456?w=150&h=150&fit=crop&crop=face",
    coverImage: (profileData as any).cover_image || "https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=800&h=300&fit=crop",
    location: (profileData as any).location || "",
    joinDate: new Date(profileData.created_at).toLocaleDateString('tr-TR', { year: 'numeric', month: 'long' }),
    bio: profileData.bio || "",
    website: (profileData as any).website || (profileData as any).website_url || "",
    socialLinks: {
      instagram: (profileData as any).instagram || "",
      twitter: (profileData as any).twitter || "",
      youtube: (profileData as any).youtube || "",
    },
    stats: profileData.stats,
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 via-white to-purple-50">
      <Navbar />

      {/* Enhanced Background Elements */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <motion.div
          className="absolute -top-40 -right-40 w-96 h-96 bg-gradient-to-br from-orange-400/20 to-pink-600/10 rounded-full blur-3xl"
          animate={{
            x: [0, 50, 0],
            y: [0, 30, 0],
            scale: [1, 1.2, 1],
            rotate: [0, 90, 0]
          }}
          transition={{ duration: 20, repeat: Infinity, ease: "easeInOut" }}
        />
        <motion.div
          className="absolute top-1/4 -left-20 w-80 h-80 bg-gradient-to-br from-blue-400/15 to-purple-600/10 rounded-full blur-3xl"
          animate={{
            x: [0, -30, 0],
            y: [0, 50, 0],
            scale: [1, 1.3, 1],
            rotate: [0, -90, 0]
          }}
          transition={{ duration: 25, repeat: Infinity, ease: "easeInOut" }}
        />
        <motion.div
          className="absolute bottom-20 right-1/4 w-64 h-64 bg-gradient-to-br from-green-400/10 to-teal-600/10 rounded-full blur-3xl"
          animate={{
            x: [0, 40, 0],
            y: [0, -40, 0],
            scale: [1, 1.15, 1]
          }}
          transition={{ duration: 18, repeat: Infinity, ease: "easeInOut" }}
        />
      </div>

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 sm:py-8">
        {/* Modern Profile Card with enhanced animations */}
        <motion.div
          initial={{ opacity: 0, y: 40, scale: 0.95 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          transition={{ duration: 0.7, ease: "easeOut" }}
          className="mb-8"
        >
          <UserProfileCard
            user={{
              id: user.id,
              name: user.name,
              username: user.username,
              bio: user.bio,
              avatar: user.avatar,
              coverImage: user.coverImage,
              location: user.location,
              joinDate: user.joinDate,
              website: user.website,
              socialLinks: user.socialLinks,
            }}
            stats={{
              recipes: user.stats.recipes,
              followers: user.stats.followers,
              following: user.stats.following,
              totalLikes: user.stats.totalLikes,
              views: 0,
              rating: 0,
            }}
            isOwnProfile={isOwnProfile}
          />
        </motion.div>

        {/* Enhanced Tabs Section */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.2, ease: "easeOut" }}
        >
          <Tabs defaultValue="recipes" className="w-full">
            <TabsList className="grid w-full grid-cols-3 bg-white/90 backdrop-blur-md border-2 border-orange-100/50 shadow-lg rounded-xl h-14">
              <TabsTrigger 
                value="recipes" 
                className="flex items-center gap-2 data-[state=active]:bg-gradient-to-r data-[state=active]:from-orange-500 data-[state=active]:to-orange-600 data-[state=active]:text-white rounded-lg transition-all duration-300"
              >
                <ChefHat className="h-5 w-5" />
                <span className="hidden sm:inline">Tarifler</span>
                <span className="font-semibold">({user.stats.recipes})</span>
              </TabsTrigger>
              <TabsTrigger 
                value="favorites" 
                className="flex items-center gap-2 data-[state=active]:bg-gradient-to-r data-[state=active]:from-pink-500 data-[state=active]:to-rose-600 data-[state=active]:text-white rounded-lg transition-all duration-300"
              >
                <Heart className="h-5 w-5" />
                <span className="hidden sm:inline">Favoriler</span>
              </TabsTrigger>
              <TabsTrigger 
                value="collections" 
                className="flex items-center gap-2 data-[state=active]:bg-gradient-to-r data-[state=active]:from-purple-500 data-[state=active]:to-indigo-600 data-[state=active]:text-white rounded-lg transition-all duration-300"
              >
                <Star className="h-5 w-5" />
                <span className="hidden sm:inline">Koleksiyonlar</span>
              </TabsTrigger>
            </TabsList>

            <TabsContent value="recipes" className="mt-8">
              {recipesLoading ? (
                <div className="flex justify-center py-16">
                  <LoadingSpinner />
                </div>
              ) : userRecipes.length === 0 ? (
                <motion.div
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.5 }}
                  className="text-center py-16"
                >
                  <div className="bg-gradient-to-br from-orange-100 to-orange-50 w-24 h-24 rounded-full flex items-center justify-center mx-auto mb-6 shadow-lg">
                    <ChefHat className="h-12 w-12 text-orange-500" />
                  </div>
                  <h3 className="text-xl font-semibold text-gray-800 mb-2">Henüz Tarif Yok</h3>
                  <p className="text-gray-500 mb-6">
                    {isOwnProfile 
                      ? "İlk tarifini paylaşarak başla!"
                      : "Bu kullanıcı henüz tarif paylaşmamış."}
                  </p>
                  {isOwnProfile && (
                    <Button
                      onClick={() => window.location.href = '/tarif-paylas'}
                      className="bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700"
                    >
                      <ChefHat className="h-4 w-4 mr-2" />
                      Tarif Paylaş
                    </Button>
                  )}
                </motion.div>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 auto-rows-fr">
                  {userRecipes.map((recipe: any, index: number) => (
                    <motion.div
                      key={recipe.id}
                      initial={{ opacity: 0, y: 30 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: index * 0.1, duration: 0.5 }}
                      whileHover={{ y: -8, transition: { duration: 0.2 } }}
                      className="h-full"
                    >
                      <div className="relative overflow-hidden rounded-xl shadow-md hover:shadow-2xl transition-all duration-300 bg-white h-full flex flex-col">
                        <RecipeCard
                          id={recipe.id}
                          title={recipe.title}
                          image={recipe.image}
                          cookingTime={recipe.cookingTime}
                          difficulty={recipe.difficulty}
                          rating={recipe.rating}
                          author={recipe.author}
                          authorUsername={recipe.authorUsername}
                          authorAvatar={recipe.authorAvatar}
                          description={recipe.description}
                        />
                      </div>
                    </motion.div>
                  ))}
                </div>
              )}
            </TabsContent>

            <TabsContent value="favorites" className="mt-8">
              {favoritesLoading ? (
                <div className="flex justify-center py-16">
                  <LoadingSpinner />
                </div>
              ) : userFavorites.length === 0 ? (
                <motion.div
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.5 }}
                  className="text-center py-16"
                >
                  <div className="bg-gradient-to-br from-pink-100 to-rose-50 w-24 h-24 rounded-full flex items-center justify-center mx-auto mb-6 shadow-lg">
                    <Heart className="h-12 w-12 text-pink-500" />
                  </div>
                  <h3 className="text-xl font-semibold text-gray-800 mb-2">Favori Yok</h3>
                  <p className="text-gray-500 mb-6">
                    {isOwnProfile
                      ? "Beğendiğin tarifleri favorilerine ekle!"
                      : "Bu kullanıcı henüz favori eklememış."}
                  </p>
                  {isOwnProfile && (
                    <Button
                      onClick={() => window.location.href = '/tarifler'}
                      variant="outline"
                      className="border-pink-500 text-pink-600 hover:bg-pink-50"
                    >
                      <Heart className="h-4 w-4 mr-2" />
                      Tarifleri Keşfet
                    </Button>
                  )}
                </motion.div>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 auto-rows-fr">
                  {userFavorites.map((recipe: any, index: number) => (
                    <motion.div
                      key={recipe.id}
                      initial={{ opacity: 0, y: 30 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: index * 0.1, duration: 0.5 }}
                      whileHover={{ y: -8, transition: { duration: 0.2 } }}
                      className="h-full"
                    >
                      <div className="relative overflow-hidden rounded-xl shadow-md hover:shadow-2xl transition-all duration-300 bg-white h-full flex flex-col">
                        <div className="absolute top-3 right-3 z-10">
                          <div className="bg-pink-500 text-white p-2 rounded-full shadow-lg">
                            <Heart className="h-4 w-4 fill-current" />
                          </div>
                        </div>
                        <RecipeCard
                          id={recipe.id}
                          title={recipe.title}
                          image={recipe.image}
                          cookingTime={recipe.cookingTime}
                          difficulty={recipe.difficulty}
                          rating={recipe.rating}
                          author={recipe.author}
                          authorUsername={recipe.authorUsername}
                          authorAvatar={recipe.authorAvatar}
                          description={recipe.description}
                        />
                      </div>
                    </motion.div>
                  ))}
                </div>
              )}
            </TabsContent>

            <TabsContent value="collections" className="mt-8">
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.5 }}
                className="text-center py-16"
              >
                <div className="bg-gradient-to-br from-purple-100 to-indigo-50 w-24 h-24 rounded-full flex items-center justify-center mx-auto mb-6 shadow-lg">
                  <Star className="h-12 w-12 text-purple-500" />
                </div>
                <h3 className="text-xl font-semibold text-gray-800 mb-2">Koleksiyon Özelliği Yakında</h3>
                <p className="text-gray-500 mb-4">
                  Tariflerinizi koleksiyonlar halinde düzenleyebileceksiniz.
                </p>
                <div className="inline-flex items-center gap-2 bg-purple-50 text-purple-700 px-4 py-2 rounded-full text-sm font-medium">
                  <span className="animate-pulse">🚧</span>
                  Geliştirme Aşamasında
                </div>
              </motion.div>
            </TabsContent>
          </Tabs>
        </motion.div>
      </div>

      <Footer />
    </div>
  );
};

export default Profile;
