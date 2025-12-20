
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import PremiumHeader from "@/components/PremiumHeader";
import RecipeCard from "@/components/RecipeCard";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Heart, BookOpen, Users, Grid, List, Filter, Search, Star } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import LoadingSpinner from "@/components/LoadingSpinner";

interface FavoriteRecipe {
  id: string;
  recipe_id: string;
  created_at: string;
  recipes?: {
    id: string;
    title: string;
    description: string;
    image_url: string;
    cooking_time: number;
    difficulty: string;
    author_id: string;
    profiles?: {
      username: string;
      fullname: string;
    };
  };
}

const Favorites = () => {
  const { user, loading: authLoading } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [viewMode, setViewMode] = useState("grid");
  const [activeTab, setActiveTab] = useState("recipes");
  const [loading, setLoading] = useState(false);
  const [favorites, setFavorites] = useState<FavoriteRecipe[]>([]);
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    if (!authLoading && !user) {
      toast({
        title: "Giriş Gerekli",
        description: "Favorilerinizi görmek için giriş yapmalısınız.",
        variant: "destructive",
      });
      navigate("/giris-yap");
      return;
    }

    if (user) {
      fetchFavorites();
    }
  }, [user, authLoading]);

  const fetchFavorites = async () => {
    setLoading(true);
    try {
      // Fetch favorite recipes with recipe details
      const { data, error } = await supabase
        .from("recipe_favorites" as any)
        .select(`
          id,
          recipe_id,
          created_at,
          recipes:recipe_id (
            id,
            title,
            description,
            image_url,
            cooking_time,
            difficulty,
            author_id,
            profiles:author_id (
              username,
              fullname
            )
          )
        `)
        .eq("user_id", user?.id)
        .order("created_at", { ascending: false });

      if (error) throw error;
      setFavorites((data as any) || []);
    } catch (error: any) {
      console.error("Favoriler yüklenirken hata:", error);
      toast({
        title: "Hata",
        description: "Favoriler yüklenemedi",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleRemoveFavorite = async (recipeId: string) => {
    try {
      const { error } = await supabase
        .from("recipe_favorites" as any)
        .delete()
        .eq("user_id", user?.id)
        .eq("recipe_id", recipeId);

      if (error) throw error;

      toast({
        title: "Başarılı",
        description: "Tarif favorilerden kaldırıldı",
      });
      fetchFavorites();
    } catch (error: any) {
      toast({
        title: "Hata",
        description: "İşlem başarısız",
        variant: "destructive",
      });
    }
  };

  const getTimeSince = (date: string) => {
    const now = new Date();
    const past = new Date(date);
    const diffMs = now.getTime() - past.getTime();
    const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));
    
    if (diffDays === 0) return "Bugün";
    if (diffDays === 1) return "Dün";
    if (diffDays < 7) return `${diffDays} gün önce`;
    if (diffDays < 30) return `${Math.floor(diffDays / 7)} hafta önce`;
    return `${Math.floor(diffDays / 30)} ay önce`;
  };

  const filteredFavorites = favorites.filter((fav) =>
    fav.recipes?.title.toLowerCase().includes(searchTerm.toLowerCase())
  );




  if (authLoading || loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-orange-50 via-white to-orange-50">
        <Navbar />
        <div className="flex items-center justify-center h-96">
          <LoadingSpinner />
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 via-white to-orange-50">
      <Navbar />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
        <PremiumHeader
          title="Favorilerim"
          description="Beğendiğiniz tarifler, takip ettiğiniz yazarlar ve koleksiyonlarınız"
          emoji="❤️"
          primaryBadge={{
            icon: Heart,
            text: "Favoriler",
            animate: true
          }}
          secondaryBadge={{
            icon: Star,
            text: "Kişisel Koleksiyon"
          }}
          breadcrumbItems={[
            { label: "Ana Sayfa", href: "/" },
            { label: "Favorilerim", isActive: true }
          ]}
        />

        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <div className="flex flex-col lg:flex-row gap-4 items-center justify-between">
            <TabsList className="grid w-full lg:w-auto grid-cols-1">
              <TabsTrigger value="recipes" className="flex items-center gap-2">
                <Heart className="h-4 w-4" />
                Favori Tarifler ({filteredFavorites.length})
              </TabsTrigger>
            </TabsList>

            <div className="flex items-center gap-2">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                <input
                  type="text"
                  placeholder="Favorilerde ara..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg w-64"
                />
              </div>
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

            {filteredFavorites.length > 0 ? (
              <div className={`${viewMode === "grid"
                ? "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6"
                : "space-y-4"
                }`}>
                {filteredFavorites.map((favorite) => {
                  const recipe = favorite.recipes;
                  if (!recipe) return null;
                  
                  return (
                    <div key={favorite.id} className="relative group">
                      <RecipeCard
                        id={recipe.id}
                        title={recipe.title}
                        image={recipe.image_url || "https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=400&h=300&fit=crop"}
                        cookingTime={`${recipe.cooking_time} dk`}
                        difficulty={recipe.difficulty as "Kolay" | "Orta" | "Zor"}
                        rating={0}
                        author={recipe.profiles?.fullname || recipe.profiles?.username || "Anonim"}
                        description={recipe.description}
                      />
                      <div className="absolute top-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity">
                        <Button 
                          size="sm" 
                          variant="destructive" 
                          className="h-8 w-8 p-0 shadow-lg"
                          onClick={() => handleRemoveFavorite(recipe.id)}
                        >
                          <Heart className="h-4 w-4 fill-current" />
                        </Button>
                      </div>
                      <div className="mt-2 text-xs text-gray-500 text-center">
                        Kaydedilme: {getTimeSince(favorite.created_at)}
                      </div>
                    </div>
                  );
                })}
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
                  <Button 
                    className="gradient-primary text-white"
                    onClick={() => navigate("/tarifler")}
                  >
                    Tarifleri Keşfet
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
