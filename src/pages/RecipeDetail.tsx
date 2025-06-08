
import { useParams } from "react-router-dom";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Clock, Users, Star, Heart, Share2, PlayCircle } from "lucide-react";

const RecipeDetail = () => {
  const { id } = useParams();

  // Örnek tarif verisi - gerçek uygulamada API'den gelecek
  const recipe = {
    id: id,
    title: "Nefis Tavuk Sote",
    image: "https://images.unsplash.com/photo-1598103442097-8b74394b95c6?w=800&h=600&fit=crop",
    cookingTime: "25 dk",
    difficulty: "Kolay",
    servings: 4,
    rating: 4.8,
    author: "Chef Ayşe",
    dblScore: 95,
    description: "Evdeki basit malzemelerle hazırlayabileceğiniz nefis tavuk sote tarifi. Hem lezzetli hem de pratik!",
    ingredients: [
      "500g tavuk göğsü",
      "2 adet domates",
      "1 adet soğan",
      "2 diş sarımsak",
      "1 adet biber",
      "2 yemek kaşığı zeytinyağı",
      "Tuz, karabiber",
      "1 tatlı kaşığı kırmızı pul biber"
    ],
    instructions: [
      "Tavuk göğsünü küp küp doğrayın.",
      "Soğan ve sarımsakları ince doğrayın.",
      "Tava da zeytinyağını ısıtın.",
      "Önce tavukları kavurun.",
      "Soğan ve sarımsakları ekleyin.",
      "Domates ve biberi ekleyip pişirin.",
      "Baharatları ekleyip karıştırın.",
      "5 dakika daha pişirdikten sonra servis yapın."
    ],
    videoUrl: "https://www.youtube.com/embed/dQw4w9WgXcQ",
    tips: "Tavukların suyunu çekmesi için orta ateşte pişirin. Domatesleri çok erken eklemeyin."
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      
      <div className="max-w-4xl mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Sol taraf - Görsel ve video */}
          <div className="space-y-6">
            <div className="relative rounded-xl overflow-hidden">
              <img 
                src={recipe.image} 
                alt={recipe.title}
                className="w-full h-80 object-cover"
              />
              <div className="absolute top-4 right-4 bg-food-500 text-white px-3 py-1 rounded-full font-semibold">
                DBL: {recipe.dblScore}
              </div>
            </div>
            
            {recipe.videoUrl && (
              <Card>
                <CardContent className="p-4">
                  <div className="flex items-center gap-2 mb-3">
                    <PlayCircle className="h-5 w-5 text-food-600" />
                    <h3 className="font-semibold">Video Tarif</h3>
                  </div>
                  <div className="aspect-video rounded-lg overflow-hidden">
                    <iframe
                      src={recipe.videoUrl}
                      className="w-full h-full"
                      allowFullScreen
                      title="Tarif Videosu"
                    />
                  </div>
                </CardContent>
              </Card>
            )}
          </div>

          {/* Sağ taraf - Tarif detayları */}
          <div className="space-y-6">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 mb-4">{recipe.title}</h1>
              <p className="text-gray-600 mb-4">{recipe.description}</p>
              
              <div className="flex items-center gap-4 mb-4">
                <div className="flex items-center gap-1">
                  <Clock className="h-4 w-4 text-gray-500" />
                  <span className="text-sm">{recipe.cookingTime}</span>
                </div>
                <div className="flex items-center gap-1">
                  <Users className="h-4 w-4 text-gray-500" />
                  <span className="text-sm">{recipe.servings} kişilik</span>
                </div>
                <div className="flex items-center gap-1">
                  <Star className="h-4 w-4 text-yellow-500" />
                  <span className="text-sm">{recipe.rating}</span>
                </div>
              </div>

              <div className="flex gap-3">
                <Button className="gradient-primary text-white flex-1">
                  <Heart className="h-4 w-4 mr-2" />
                  Favoriye Ekle
                </Button>
                <Button variant="outline">
                  <Share2 className="h-4 w-4" />
                </Button>
              </div>
            </div>

            <Card>
              <CardContent className="p-6">
                <h3 className="font-semibold text-lg mb-4">Malzemeler</h3>
                <ul className="space-y-2">
                  {recipe.ingredients.map((ingredient, index) => (
                    <li key={index} className="flex items-center gap-2">
                      <div className="w-2 h-2 bg-food-500 rounded-full"></div>
                      <span>{ingredient}</span>
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <h3 className="font-semibold text-lg mb-4">Yapılışı</h3>
                <ol className="space-y-3">
                  {recipe.instructions.map((step, index) => (
                    <li key={index} className="flex gap-3">
                      <span className="bg-food-500 text-white w-6 h-6 rounded-full flex items-center justify-center text-sm font-semibold flex-shrink-0">
                        {index + 1}
                      </span>
                      <span>{step}</span>
                    </li>
                  ))}
                </ol>
              </CardContent>
            </Card>

            {recipe.tips && (
              <Card className="bg-gradient-to-r from-food-50 to-spice-50">
                <CardContent className="p-6">
                  <h3 className="font-semibold text-lg mb-3">💡 Püf Noktası</h3>
                  <p className="text-gray-700">{recipe.tips}</p>
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
