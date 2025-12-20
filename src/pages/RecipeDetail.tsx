import { useParams, useNavigate } from "react-router-dom";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  Heart, Share2, BookmarkPlus, Clock, Users,
  ChefHat, Star, MessageCircle, Eye, ThumbsUp, Edit2, Trash2,
  Sparkles, TrendingUp, Flame, Award
} from "lucide-react";
import { useRecipeById } from "@/hooks/useRecipes";
import LoadingSpinner from "@/components/LoadingSpinner";
import RecipeSocial from "@/components/RecipeSocial";
import RecipeComments from "@/components/RecipeComments";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { useState } from "react";

const RecipeDetail = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { user } = useAuth();
  const { toast } = useToast();
  const { data: recipe, isLoading, error } = useRecipeById(id || "");
  const [isFavorited, setIsFavorited] = useState(false);
  const [isBookmarked, setIsBookmarked] = useState(false);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-orange-50 via-white to-orange-50">
        <Navbar />
        <div className="flex items-center justify-center h-64">
          <LoadingSpinner text="Tarif yükleniyor..." />
        </div>
        <Footer />
      </div>
    );
  }

  if (error || !recipe) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-orange-50 via-white to-orange-50">
        <Navbar />
        <div className="flex items-center justify-center h-64 px-4">
          <div className="text-center bg-white rounded-2xl p-8 shadow-lg border border-red-100">
            <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <span className="text-red-500 text-2xl">😔</span>
            </div>
            <p className="text-red-600 font-semibold text-lg">Tarif bulunamadı</p>
            <p className="text-red-400 text-sm mt-2">Aradığınız tarif mevcut değil veya kaldırılmış olabilir</p>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  const handleEdit = () => {
    navigate(`/tarif-paylas?edit=${id}`);
  };

  const handleDelete = async () => {
    if (!confirm("Bu tarifi silmek istediğinizden emin misiniz?")) return;

    try {
      const { error } = await supabase
        .from('recipes')
        .delete()
        .eq('id', id);

      if (error) throw error;

      toast({
        title: "Tarif Silindi",
        description: "Tarif başarıyla silindi.",
      });
      navigate("/tarifler");
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Hata",
        description: "Tarif silinirken hata oluştu.",
      });
    }
  };

  // Mock data for missing fields
  const recipeIngredients = [
    "2 adet büyük patates",
    "1 büyük soğan",
    "2 diş sarımsak",
    "1 çay bardağı zeytinyağı",
    "Tuz ve karabiber",
    "Taze dereotu"
  ];

  const recipeInstructions = [
    "Patatesleri yıkayıp küp şeklinde doğrayın",
    "Soğanı julien şeklinde kesin",
    "Tavada zeytinyağını ısıtın",
    "Önce soğanları kavurun",
    "Patatesleri ekleyip karıştırın",
    "Baharatları ekleyip servis edin"
  ];

  const recipeTags = ["kolay", "hızlı", "ekonomik", "sebzeli"];

  // Extract ingredient names for affiliate links
  const ingredientNames = recipeIngredients.filter(Boolean);

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 via-white to-orange-50">
      <Navbar />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
        {/* Modern Enhanced Header */}
        <div className="bg-white rounded-2xl shadow-xl overflow-hidden mb-6 border border-gray-100 group">
          <div className="relative h-56 md:h-72 overflow-hidden">
            <img
              src={recipe.image_url || "https://images.unsplash.com/photo-1565299624946-b28f40a0ca4b?w=800&h=400&fit=crop"}
              alt={recipe.title || "Tarif Görseli"}
              className="w-full h-full object-cover transform group-hover:scale-105 transition-transform duration-700"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/30 to-transparent" />
            
            {/* Trending Badge */}
            {(recipe.rating || 0) > 4.5 && (
              <div className="absolute top-4 left-4">
                <Badge className="bg-gradient-to-r from-orange-500 to-red-500 text-white border-0 shadow-lg backdrop-blur-sm flex items-center gap-1.5 px-3 py-1.5">
                  <Flame className="h-3.5 w-3.5 animate-pulse" />
                  <span className="font-semibold">Popüler</span>
                </Badge>
              </div>
            )}

            {/* Enhanced Action Buttons */}
            <div className="absolute top-4 right-4 flex gap-2">
              <Button
                size="sm"
                onClick={() => setIsFavorited(!isFavorited)}
                className={`backdrop-blur-sm border-0 shadow-lg transition-all duration-300 p-2 ${
                  isFavorited 
                    ? 'bg-red-500 text-white hover:bg-red-600' 
                    : 'bg-white/90 text-gray-700 hover:bg-white'
                }`}
              >
                <Heart className={`h-4 w-4 ${isFavorited ? 'fill-white' : ''}`} />
              </Button>
              <Button
                size="sm"
                onClick={() => setIsBookmarked(!isBookmarked)}
                className={`backdrop-blur-sm border-0 shadow-lg transition-all duration-300 p-2 ${
                  isBookmarked 
                    ? 'bg-orange-500 text-white hover:bg-orange-600' 
                    : 'bg-white/90 text-gray-700 hover:bg-white'
                }`}
              >
                <BookmarkPlus className={`h-4 w-4 ${isBookmarked ? 'fill-white' : ''}`} />
              </Button>
              <Button
                size="sm"
                className="bg-white/90 backdrop-blur-sm text-gray-700 hover:bg-white border-0 shadow-lg p-2"
              >
                <Share2 className="h-4 w-4" />
              </Button>
              {user?.id === recipe.user_id && (
                <>
                  <Button
                    size="sm"
                    onClick={handleEdit}
                    className="bg-white/90 backdrop-blur-sm text-gray-700 hover:bg-white border-0 shadow-lg p-2"
                  >
                    <Edit2 className="h-4 w-4" />
                  </Button>
                  <Button
                    size="sm"
                    onClick={handleDelete}
                    variant="destructive"
                    className="shadow-lg p-2"
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </>
              )}
            </div>

            {/* Enhanced Title with Animation */}
            <div className="absolute bottom-4 left-4 right-4">
              <div className="flex items-center gap-2 mb-2">
                <Sparkles className="h-5 w-5 text-yellow-400 animate-pulse" />
                <span className="text-yellow-400 text-xs font-semibold uppercase tracking-wide">Özel Tarif</span>
              </div>
              <h1 className="text-2xl md:text-3xl font-bold text-white mb-1 drop-shadow-lg">
                {recipe.title || "Başlıksız Tarif"}
              </h1>
              {recipe.description && (
                <p className="text-white/80 text-sm drop-shadow-md line-clamp-1">
                  {recipe.description}
                </p>
              )}
            </div>
          </div>

          <div className="p-5">
            {/* Enhanced Meta Grid with Gradients */}
            <div className="grid grid-cols-4 gap-3 mb-4">
              <div className="text-center bg-gradient-to-br from-orange-50 to-orange-100 rounded-xl p-3 hover:shadow-md transition-shadow cursor-pointer group">
                <Clock className="h-5 w-5 text-orange-500 mx-auto mb-1 group-hover:scale-110 transition-transform" />
                <div className="text-xs text-gray-500">Süre</div>
                <div className="font-semibold text-sm text-gray-800">{recipe.cook_time || 30}dk</div>
              </div>
              <div className="text-center bg-gradient-to-br from-blue-50 to-blue-100 rounded-xl p-3 hover:shadow-md transition-shadow cursor-pointer group">
                <Users className="h-5 w-5 text-blue-500 mx-auto mb-1 group-hover:scale-110 transition-transform" />
                <div className="text-xs text-gray-500">Porsiyon</div>
                <div className="font-semibold text-sm text-gray-800">4</div>
              </div>
              <div className="text-center bg-gradient-to-br from-purple-50 to-purple-100 rounded-xl p-3 hover:shadow-md transition-shadow cursor-pointer group">
                <ChefHat className="h-5 w-5 text-purple-500 mx-auto mb-1 group-hover:scale-110 transition-transform" />
                <div className="text-xs text-gray-500">Zorluk</div>
                <div className="font-semibold text-sm text-gray-800">{recipe.difficulty || "Kolay"}</div>
              </div>
              <div className="text-center bg-gradient-to-br from-yellow-50 to-yellow-100 rounded-xl p-3 hover:shadow-md transition-shadow cursor-pointer group">
                <Star className="h-5 w-5 text-yellow-500 mx-auto mb-1 fill-yellow-500 group-hover:scale-110 transition-transform" />
                <div className="text-xs text-gray-500">Puan</div>
                <div className="font-semibold text-sm text-gray-800">{recipe.rating?.toFixed(1) || "4.5"}</div>
              </div>
            </div>

            {/* Enhanced Author Section */}
            <div className="flex items-center justify-between bg-gradient-to-r from-orange-50 via-orange-100/50 to-transparent rounded-xl p-4 border border-orange-100">
              <div className="flex items-center gap-3">
                <div className="relative">
                  <Avatar className="w-10 h-10 ring-2 ring-orange-200">
                    <AvatarImage src={`https://ui-avatars.com/api/?name=${recipe.author_name}&background=random&color=fff`} />
                    <AvatarFallback className="bg-orange-500 text-white text-sm font-semibold">
                      {recipe.author_name?.charAt(0) || 'A'}
                    </AvatarFallback>
                  </Avatar>
                  <div className="absolute -bottom-1 -right-1 w-5 h-5 bg-gradient-to-r from-orange-500 to-red-500 rounded-full flex items-center justify-center border-2 border-white">
                    <Award className="h-2.5 w-2.5 text-white" />
                  </div>
                </div>
                <div>
                  <div className="font-semibold text-sm text-gray-800 flex items-center gap-1.5">
                    {recipe.author_name || "Ne Yesek AI"}
                    <Sparkles className="h-3 w-3 text-orange-500" />
                  </div>
                  <div className="text-xs text-gray-500">Sertifikalı Şef</div>
                </div>
              </div>

              <div className="flex items-center gap-4 text-xs text-gray-600">
                <div className="flex items-center gap-1 hover:text-orange-500 transition-colors cursor-pointer">
                  <Eye className="h-3.5 w-3.5" />
                  <span className="hidden sm:inline font-semibold">{Math.floor(Math.random() * 1000 + 100)}</span>
                </div>
                <div className="flex items-center gap-1 hover:text-orange-500 transition-colors cursor-pointer">
                  <ThumbsUp className="h-3.5 w-3.5" />
                  <span className="hidden sm:inline font-semibold">{Math.floor((recipe.rating || 0) * 20)}</span>
                </div>
                <div className="flex items-center gap-1 hover:text-orange-500 transition-colors cursor-pointer">
                  <MessageCircle className="h-3.5 w-3.5" />
                  <span className="hidden sm:inline font-semibold">{Math.floor(Math.random() * 50)}</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Enhanced Ingredients */}
          <div className="lg:col-span-1">
            <Card className="bg-white shadow-xl border border-gray-100 rounded-2xl overflow-hidden hover:shadow-2xl transition-shadow">
              <CardContent className="p-5">
                <h2 className="text-lg font-bold text-gray-800 mb-4 flex items-center gap-2">
                  <div className="w-8 h-8 bg-gradient-to-r from-orange-500 to-red-500 rounded-lg flex items-center justify-center">
                    <ChefHat className="h-4 w-4 text-white" />
                  </div>
                  Malzemeler
                  <Badge className="ml-auto bg-orange-100 text-orange-700 hover:bg-orange-200 text-xs">
                    {recipeIngredients.length} adet
                  </Badge>
                </h2>
                <div className="space-y-2">
                  {recipeIngredients.length > 0 ? (
                    recipeIngredients.map((ingredient: any, index: number) => (
                      <div
                        key={index}
                        className="flex items-center gap-2.5 p-2.5 bg-gradient-to-r from-orange-50 to-transparent rounded-xl hover:from-orange-100 hover:to-orange-50 transition-all duration-300 border border-orange-100/50 hover:border-orange-200 group cursor-pointer"
                      >
                        <div className="w-6 h-6 bg-gradient-to-r from-orange-500 to-orange-600 text-white rounded-full flex items-center justify-center text-xs font-semibold flex-shrink-0 group-hover:scale-110 transition-transform">
                          {index + 1}
                        </div>
                        <span className="text-sm text-gray-700 group-hover:text-gray-900 font-medium">
                          {typeof ingredient === 'string' ? ingredient : ingredient?.name || ingredient?.item || 'Malzeme'}
                        </span>
                      </div>
                    ))
                  ) : (
                    <p className="text-gray-500 text-sm italic">Malzeme bilgisi mevcut değil.</p>
                  )}
                </div>
              </CardContent>
            </Card>

            {/* Enhanced Tags */}
            {recipeTags.length > 0 && (
              <Card className="mt-4 bg-white shadow-xl border border-gray-100 rounded-2xl overflow-hidden hover:shadow-2xl transition-shadow">
                <CardContent className="p-5">
                  <h3 className="text-base font-bold text-gray-800 mb-3 flex items-center gap-2">
                    <Sparkles className="h-4 w-4 text-orange-500" />
                    Etiketler
                  </h3>
                  <div className="flex flex-wrap gap-2">
                    {recipeTags.map((tag: string, index: number) => (
                      <Badge
                        key={index}
                        className="bg-gradient-to-r from-orange-500 to-orange-600 text-white hover:from-orange-600 hover:to-orange-700 px-3 py-1.5 text-xs rounded-full shadow-md hover:shadow-lg transition-all duration-300 hover:scale-105 cursor-pointer"
                      >
                        #{tag}
                      </Badge>
                    ))}
                  </div>
                </CardContent>
              </Card>
            )}
          </div>

          {/* Enhanced Instructions */}
          <div className="lg:col-span-2">
            <Card className="bg-white shadow-xl border border-gray-100 rounded-2xl overflow-hidden hover:shadow-2xl transition-shadow">
              <CardContent className="p-5">
                <h2 className="text-lg font-bold text-gray-800 mb-4 flex items-center gap-2">
                  <div className="w-8 h-8 bg-gradient-to-r from-orange-500 to-red-500 rounded-lg flex items-center justify-center">
                    <Star className="h-4 w-4 text-white fill-white" />
                  </div>
                  Yapılışı
                  <Badge className="ml-auto bg-orange-100 text-orange-700 hover:bg-orange-200 text-xs">
                    {recipeInstructions.length} adım
                  </Badge>
                </h2>
                <div className="space-y-3">
                  {recipeInstructions.length > 0 ? (
                    recipeInstructions.map((instruction: any, index: number) => (
                      <div
                        key={index}
                        className="flex gap-3 p-4 bg-gradient-to-r from-orange-50 via-orange-50/50 to-transparent rounded-xl border border-orange-100 hover:border-orange-200 hover:shadow-md transition-all duration-300 group"
                      >
                        <div className="w-8 h-8 bg-gradient-to-r from-orange-500 to-orange-600 text-white rounded-full flex items-center justify-center text-sm font-bold flex-shrink-0 group-hover:scale-110 transition-transform shadow-md">
                          {index + 1}
                        </div>
                        <div className="flex-1">
                          <p className="text-gray-700 leading-relaxed text-sm group-hover:text-gray-900">
                            {typeof instruction === 'string' ? instruction : instruction?.step || instruction?.description || 'Adım açıklaması mevcut değil'}
                          </p>
                        </div>
                      </div>
                    ))
                  ) : (
                    <p className="text-gray-500 text-sm italic">Yapılış bilgisi mevcut değil.</p>
                  )}
                </div>
              </CardContent>
            </Card>

            {/* Compact Content */}
            {recipe.content && (
              <Card className="mt-4 bg-white shadow-lg border border-gray-100 rounded-2xl overflow-hidden">
                <CardContent className="p-5">
                  <h3 className="text-base font-bold text-gray-800 mb-3">Detaylı Bilgi</h3>
                  <div className="prose prose-sm prose-orange max-w-none text-gray-700">
                    {recipe.content}
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Compact Comments */}
            {id && (
              <div className="mt-4">
                <RecipeComments recipeId={id} />
              </div>
            )}
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default RecipeDetail;
