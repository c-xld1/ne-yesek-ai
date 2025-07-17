import { useParams } from "react-router-dom";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  Heart, Share2, BookmarkPlus, Clock, Users,
  ChefHat, Star, MessageCircle, Eye, ThumbsUp
} from "lucide-react";
import { useRecipeById } from "@/hooks/useRecipes";
import LoadingSpinner from "@/components/LoadingSpinner";

const RecipeDetail = () => {
  const { id } = useParams<{ id: string }>();
  const { data: recipe, isLoading, error } = useRecipeById(id || "");

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
        {/* Header */}
        <div className="bg-white/80 backdrop-blur-sm rounded-3xl shadow-xl overflow-hidden mb-8 border border-orange-100">
          <div className="relative h-64 md:h-96">
            <img
              src={recipe.image_url || "https://images.unsplash.com/photo-1565299624946-b28f40a0ca4b?w=800&h=400&fit=crop"}
              alt={recipe.title || "Tarif Görseli"}
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />

            {/* Action Buttons */}
            <div className="absolute top-6 right-6 flex gap-3">
              <Button size="sm" className="bg-white/90 backdrop-blur-sm text-gray-700 hover:bg-white border-0 shadow-lg">
                <Heart className="h-4 w-4 mr-2" />
                Favorile
              </Button>
              <Button size="sm" className="bg-white/90 backdrop-blur-sm text-gray-700 hover:bg-white border-0 shadow-lg">
                <Share2 className="h-4 w-4 mr-2" />
                Paylaş
              </Button>
              <Button size="sm" className="bg-white/90 backdrop-blur-sm text-gray-700 hover:bg-white border-0 shadow-lg">
                <BookmarkPlus className="h-4 w-4 mr-2" />
                Kaydet
              </Button>
            </div>

            {/* Title Overlay */}
            <div className="absolute bottom-6 left-6 right-6">
              <h1 className="text-4xl md:text-5xl font-bold text-white mb-2 drop-shadow-lg">
                {recipe.title || "Başlıksız Tarif"}
              </h1>
              <p className="text-white/90 text-lg drop-shadow-md">
                {recipe.description}
              </p>
            </div>
          </div>

          <div className="p-8">
            {/* Recipe Meta Info */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-8">
              <div className="text-center bg-orange-50/50 rounded-2xl p-4">
                <Clock className="h-6 w-6 text-orange-500 mx-auto mb-2" />
                <div className="text-sm text-gray-500">Pişirme</div>
                <div className="font-semibold text-gray-800">{recipe.cooking_time || "Bilinmiyor"}</div>
              </div>
              <div className="text-center bg-orange-50/50 rounded-2xl p-4">
                <Users className="h-6 w-6 text-orange-500 mx-auto mb-2" />
                <div className="text-sm text-gray-500">Porsiyon</div>
                <div className="font-semibold text-gray-800">4 kişi</div>
              </div>
              <div className="text-center bg-orange-50/50 rounded-2xl p-4">
                <ChefHat className="h-6 w-6 text-orange-500 mx-auto mb-2" />
                <div className="text-sm text-gray-500">Zorluk</div>
                <div className="font-semibold text-gray-800">{recipe.difficulty || "Kolay"}</div>
              </div>
              <div className="text-center bg-orange-50/50 rounded-2xl p-4">
                <Star className="h-6 w-6 text-orange-500 mx-auto mb-2" />
                <div className="text-sm text-gray-500">Puan</div>
                <div className="font-semibold text-gray-800">{recipe.rating?.toFixed(1) || "N/A"}</div>
              </div>
            </div>

            {/* Author & Meta */}
            <div className="flex items-center justify-between bg-gradient-to-r from-orange-50 to-orange-100/50 rounded-2xl p-6 border border-orange-200">
              <div className="flex items-center gap-4">
                <Avatar className="w-14 h-14 ring-4 ring-orange-200">
                  <AvatarImage src={`https://ui-avatars.com/api/?name=${recipe.author_name}&background=random&color=fff`} />
                  <AvatarFallback className="bg-orange-500 text-white font-semibold">
                    {recipe.author_name?.charAt(0) || 'A'}
                  </AvatarFallback>
                </Avatar>
                <div>
                  <div className="font-semibold text-gray-800">{recipe.author_name || "Ne Yesek AI"}</div>
                  <div className="text-sm text-gray-500">Tarif Sahibi</div>
                </div>
              </div>

              <div className="flex items-center gap-6 text-sm text-gray-600">
                <div className="flex items-center gap-2">
                  <Eye className="h-4 w-4" />
                  {Math.floor(Math.random() * 1000 + 100)} görüntülenme
                </div>
                <div className="flex items-center gap-2">
                  <ThumbsUp className="h-4 w-4" />
                  {Math.floor((recipe.rating || 0) * 20)} beğeni
                </div>
                <div className="flex items-center gap-2">
                  <MessageCircle className="h-4 w-4" />
                  {Math.floor(Math.random() * 50)} yorum
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Ingredients */}
          <div className="lg:col-span-1">
            <Card className="bg-white/80 backdrop-blur-sm shadow-xl border border-orange-100 rounded-3xl overflow-hidden">
              <CardContent className="p-8">
                <h2 className="text-2xl font-bold text-gray-800 mb-6 flex items-center gap-2">
                  <ChefHat className="h-6 w-6 text-orange-500" />
                  Malzemeler
                </h2>
                <div className="space-y-4">
                  {recipeIngredients.length > 0 ? (
                    recipeIngredients.map((ingredient: any, index: number) => (
                      <div
                        key={index}
                        className="flex items-center gap-3 p-3 bg-orange-50/50 rounded-2xl border border-orange-100 hover:bg-orange-100/50 transition-colors"
                      >
                        <div className="w-8 h-8 bg-orange-500 text-white rounded-full flex items-center justify-center text-sm font-semibold">
                          {index + 1}
                        </div>
                        <span className="text-gray-700">
                          {typeof ingredient === 'string' ? ingredient : ingredient?.name || ingredient?.item || 'Malzeme'}
                        </span>
                      </div>
                    ))
                  ) : (
                    <p className="text-gray-500 italic">Malzeme bilgisi mevcut değil.</p>
                  )}
                </div>
              </CardContent>
            </Card>

            {/* Tags */}
            {recipeTags.length > 0 && (
              <Card className="mt-6 bg-white/80 backdrop-blur-sm shadow-xl border border-orange-100 rounded-3xl overflow-hidden">
                <CardContent className="p-8">
                  <h3 className="text-xl font-bold text-gray-800 mb-4">Etiketler</h3>
                  <div className="flex flex-wrap gap-2">
                    {recipeTags.map((tag: string, index: number) => (
                      <Badge
                        key={index}
                        className="bg-gradient-to-r from-orange-500 to-orange-600 text-white hover:from-orange-600 hover:to-orange-700 px-3 py-1 rounded-full"
                      >
                        {tag}
                      </Badge>
                    ))}
                  </div>
                </CardContent>
              </Card>
            )}
          </div>

          {/* Instructions */}
          <div className="lg:col-span-2">
            <Card className="bg-white/80 backdrop-blur-sm shadow-xl border border-orange-100 rounded-3xl overflow-hidden">
              <CardContent className="p-8">
                <h2 className="text-2xl font-bold text-gray-800 mb-6 flex items-center gap-2">
                  <Star className="h-6 w-6 text-orange-500" />
                  Yapılışı
                </h2>
                <div className="space-y-6">
                  {recipeInstructions.length > 0 ? (
                    recipeInstructions.map((instruction: any, index: number) => (
                      <div
                        key={index}
                        className="flex gap-4 p-6 bg-gradient-to-r from-orange-50/50 to-orange-100/30 rounded-2xl border border-orange-100"
                      >
                        <div className="w-10 h-10 bg-gradient-to-r from-orange-500 to-orange-600 text-white rounded-full flex items-center justify-center text-lg font-bold shrink-0">
                          {index + 1}
                        </div>
                        <div className="flex-1">
                          <p className="text-gray-700 leading-relaxed text-lg">
                            {typeof instruction === 'string' ? instruction : instruction?.step || instruction?.description || 'Adım açıklaması mevcut değil'}
                          </p>
                        </div>
                      </div>
                    ))
                  ) : (
                    <p className="text-gray-500 italic">Yapılış bilgisi mevcut değil.</p>
                  )}
                </div>
              </CardContent>
            </Card>

            {/* Content */}
            {recipe.content && (
              <Card className="mt-6 bg-white/80 backdrop-blur-sm shadow-xl border border-orange-100 rounded-3xl overflow-hidden">
                <CardContent className="p-8">
                  <h3 className="text-xl font-bold text-gray-800 mb-4">Detaylı Bilgi</h3>
                  <div className="prose prose-orange max-w-none text-gray-700">
                    {recipe.content}
                  </div>
                </CardContent>
              </Card>
            )}
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default RecipeDetail;
