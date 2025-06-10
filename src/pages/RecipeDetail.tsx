
import { useParams } from "react-router-dom";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { 
  Heart, Share2, BookmarkPlus, Clock, Users, 
  ChefHat, Star, MessageCircle, Eye 
} from "lucide-react";
import { useRecipeById } from "@/hooks/useRecipes";
import LoadingSpinner from "@/components/LoadingSpinner";

const RecipeDetail = () => {
  const { id } = useParams<{ id: string }>();
  const { data: recipe, isLoading, error } = useRecipeById(id || "");

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Navbar />
        <div className="flex items-center justify-center h-64">
          <LoadingSpinner />
        </div>
        <Footer />
      </div>
    );
  }

  if (error || !recipe) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Navbar />
        <div className="flex items-center justify-center h-64">
          <p className="text-red-500">Tarif bulunamadı veya yüklenirken hata oluştu</p>
        </div>
        <Footer />
      </div>
    );
  }

  // Parse JSON data
  const ingredients = Array.isArray(recipe.ingredients) ? recipe.ingredients : [];
  const instructions = Array.isArray(recipe.instructions) ? recipe.instructions : [];

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      
      <div className="max-w-4xl mx-auto px-4 py-8">
        {/* Header */}
        <div className="bg-white rounded-xl shadow-sm overflow-hidden mb-8">
          <div className="relative h-64 md:h-80">
            <img 
              src={recipe.image_url || "https://images.unsplash.com/photo-1565299624946-b28f40a0ca4b?w=800&h=400&fit=crop"} 
              alt={recipe.title || "Tarif Görseli"}
              className="w-full h-full object-cover"
            />
            <div className="absolute top-4 right-4 flex gap-2">
              <Button size="sm" variant="secondary" className="bg-white/90">
                <Heart className="h-4 w-4" />
              </Button>
              <Button size="sm" variant="secondary" className="bg-white/90">
                <Share2 className="h-4 w-4" />
              </Button>
              <Button size="sm" variant="secondary" className="bg-white/90">
                <BookmarkPlus className="h-4 w-4" />
              </Button>
            </div>
          </div>
          
          <div className="p-6">
            <div className="flex items-start justify-between mb-4">
              <div>
                <h1 className="text-3xl font-bold text-gray-900 mb-2">
                  {recipe.title || "Başlıksız Tarif"}
                </h1>
                <p className="text-gray-600">{recipe.description}</p>
              </div>
              <Badge className="bg-food-100 text-food-800">
                {recipe.difficulty || "Kolay"}
              </Badge>
            </div>

            {/* Author & Meta */}
            <div className="flex items-center justify-between border-t pt-4">
              <div className="flex items-center gap-3">
                <Avatar>
                  <AvatarImage src={`https://ui-avatars.com/api/?name=${recipe.author_name}&background=random`} />
                  <AvatarFallback>{recipe.author_name?.[0] || "A"}</AvatarFallback>
                </Avatar>
                <div>
                  <p className="font-medium text-gray-900">{recipe.author_name || "Anonim"}</p>
                  <p className="text-sm text-gray-500">
                    {new Date(recipe.created_at).toLocaleDateString('tr-TR')}
                  </p>
                </div>
              </div>
              
              <div className="flex items-center gap-4 text-sm text-gray-500">
                <div className="flex items-center gap-1">
                  <Clock className="h-4 w-4" />
                  {recipe.cooking_time || "Bilinmiyor"}
                </div>
                <div className="flex items-center gap-1">
                  <Star className="h-4 w-4 text-yellow-500" />
                  {recipe.rating?.toFixed(1) || "0.0"}
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-8">
            {/* Ingredients */}
            <Card>
              <CardContent className="p-6">
                <h2 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
                  <ChefHat className="h-5 w-5 text-food-500" />
                  Malzemeler
                </h2>
                {ingredients.length > 0 ? (
                  <ul className="space-y-2">
                    {ingredients.map((ingredient: any, index: number) => (
                      <li key={index} className="flex items-center gap-3">
                        <div className="w-2 h-2 bg-food-500 rounded-full"></div>
                        <span>{typeof ingredient === 'string' ? ingredient : ingredient.name || 'Malzeme'}</span>
                      </li>
                    ))}
                  </ul>
                ) : (
                  <p className="text-gray-500">Malzeme listesi mevcut değil</p>
                )}
              </CardContent>
            </Card>

            {/* Instructions */}
            <Card>
              <CardContent className="p-6">
                <h2 className="text-xl font-bold text-gray-900 mb-4">
                  👩‍🍳 Hazırlanışı
                </h2>
                {instructions.length > 0 ? (
                  <ol className="space-y-4">
                    {instructions.map((instruction: any, index: number) => (
                      <li key={index} className="flex gap-4">
                        <div className="flex-shrink-0 w-8 h-8 bg-food-500 text-white rounded-full flex items-center justify-center font-semibold text-sm">
                          {index + 1}
                        </div>
                        <p className="pt-1 text-gray-700">
                          {typeof instruction === 'string' ? instruction : instruction.text || 'Adım açıklaması'}
                        </p>
                      </li>
                    ))}
                  </ol>
                ) : (
                  <p className="text-gray-500">Hazırlanış talimatları mevcut değil</p>
                )}
              </CardContent>
            </Card>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Recipe Stats */}
            <Card>
              <CardContent className="p-6">
                <h3 className="font-semibold text-gray-900 mb-4">Tarif Bilgileri</h3>
                <div className="space-y-3">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Zorluk</span>
                    <span className="font-medium">{recipe.difficulty || "Kolay"}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Süre</span>
                    <span className="font-medium">{recipe.cooking_time || "Bilinmiyor"}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Puan</span>
                    <span className="font-medium flex items-center gap-1">
                      <Star className="h-4 w-4 text-yellow-500" />
                      {recipe.rating?.toFixed(1) || "0.0"}
                    </span>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Actions */}
            <Card>
              <CardContent className="p-6">
                <h3 className="font-semibold text-gray-900 mb-4">İşlemler</h3>
                <div className="space-y-3">
                  <Button className="w-full gradient-primary text-white">
                    <Heart className="h-4 w-4 mr-2" />
                    Favorilere Ekle
                  </Button>
                  <Button variant="outline" className="w-full">
                    <BookmarkPlus className="h-4 w-4 mr-2" />
                    Koleksiyona Ekle
                  </Button>
                  <Button variant="outline" className="w-full">
                    <Share2 className="h-4 w-4 mr-2" />
                    Paylaş
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default RecipeDetail;
