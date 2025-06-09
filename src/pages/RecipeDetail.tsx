
import { useParams } from "react-router-dom";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import CommunityFeatures from "@/components/CommunityFeatures";
import CalorieCalculator from "@/components/CalorieCalculator";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Clock, Users, Star, Heart, Share2, PlayCircle, Volume2, Lightbulb, ChefHat, Eye } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

const RecipeDetail = () => {
  const { id } = useParams();
  const { toast } = useToast();

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
    tips: "Tavukların suyunu çekmesi için orta ateşte pişirin. Domatesleri çok erken eklemeyin.",
    story: "Bu tarifi babaannemden öğrendim. Her pazar akşamları tüm aile bir araya geldiğimizde mutlaka yapar, evimiz mis gibi kokar, herkes mutfağa üşüşürdü. Şimdi ben de çocuklarıma aynı lezzeti yaşatmaya çalışıyorum.",
    alternatives: {
      "Yoğurt": ["Krema", "Labne", "Süt"],
      "Zeytinyağı": ["Tereyağı", "Ayçiçek yağı", "Mısır yağı"],
      "Tavuk": ["Hindi", "Biftek", "Kuzu eti"]
    },
    tags: ["#kolay", "#pratik", "#aile", "#protein", "#tavuk"]
  };

  const comments = [
    {
      id: 1,
      user: "Fatma Hanım",
      rating: 5,
      comment: "Harika bir tarif! Ailem çok beğendi, kesinlikle tekrar yapacağım.",
      date: "2 gün önce",
      helpful: 12
    },
    {
      id: 2,
      user: "Ahmet Bey", 
      rating: 4,
      comment: "Lezzetli oldu ama biraz daha baharat ekledim.",
      date: "1 hafta önce",
      helpful: 8
    }
  ];

  const userPhotos = [
    "https://images.unsplash.com/photo-1598103442097-8b74394b95c6?w=200&h=200&fit=crop",
    "https://images.unsplash.com/photo-1529042410759-befb1204b468?w=200&h=200&fit=crop",
    "https://images.unsplash.com/photo-1547592166-23ac45744acd?w=200&h=200&fit=crop"
  ];

  const relatedRecipes = [
    {
      id: "2",
      title: "Tavuk Şiş",
      image: "https://images.unsplash.com/photo-1529042410759-befb1204b468?w=300&h=200&fit=crop",
      rating: 4.7,
      cookingTime: "30 dk"
    },
    {
      id: "3", 
      title: "Tavuk Çorbası",
      image: "https://images.unsplash.com/photo-1547592166-23ac45744acd?w=300&h=200&fit=crop",
      rating: 4.6,
      cookingTime: "40 dk"
    }
  ];

  const handleVoiceNarration = () => {
    toast({
      title: "🔊 Sesli anlatım başlatılıyor",
      description: "Tarif adım adım sesli olarak anlatılacak...",
    });
  };

  const handleCostCalculation = () => {
    toast({
      title: "💰 Maliyet hesaplanıyor",
      description: "Bu tarif yaklaşık 42 TL'ye mal oluyor",
    });
  };

  const handleMadeToday = () => {
    toast({
      title: "✅ Bugün yaptım işaretlendi",
      description: "Bu tarifi bugün yaptığınız kaydedildi!",
    });
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      
      <div className="max-w-6xl mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Sol taraf - Ana içerik */}
          <div className="lg:col-span-2 space-y-6">
            {/* Görsel */}
            <div className="relative rounded-xl overflow-hidden">
              <img 
                src={recipe.image} 
                alt={recipe.title}
                className="w-full h-80 object-cover"
              />
              <div className="absolute top-4 right-4 bg-food-500 text-white px-3 py-1 rounded-full font-semibold">
                DBL: {recipe.dblScore}
              </div>
              <div className="absolute bottom-4 left-4 bg-black/50 backdrop-blur-sm text-white px-3 py-1 rounded-full text-sm flex items-center gap-1">
                <Eye className="h-3 w-3" />
                1,250 görüntülenme
              </div>
            </div>

            {/* Başlık ve bilgiler */}
            <Card>
              <CardContent className="p-6">
                <h1 className="text-3xl font-bold text-gray-900 mb-4">{recipe.title}</h1>
                <p className="text-gray-600 mb-4">{recipe.description}</p>
                
                <div className="flex items-center gap-6 mb-4">
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

                {/* Etiketler */}
                <div className="flex flex-wrap gap-2 mb-4">
                  {recipe.tags.map((tag, index) => (
                    <Badge key={index} variant="outline" className="hover:bg-gray-100 cursor-pointer">
                      {tag}
                    </Badge>
                  ))}
                </div>

                <div className="flex gap-3">
                  <Button className="gradient-primary text-white flex-1">
                    <Heart className="h-4 w-4 mr-2" />
                    Favoriye Ekle
                  </Button>
                  <Button variant="outline" onClick={handleMadeToday}>
                    ✅ Bugün Yaptım
                  </Button>
                  <Button variant="outline">
                    <Share2 className="h-4 w-4" />
                  </Button>
                </div>
              </CardContent>
            </Card>

            {/* Topluluk Özellikleri */}
            <CommunityFeatures recipeId={recipe.id} initialLikes={156} initialComments={23} />

            {/* Tarif Hikayesi */}
            {recipe.story && (
              <Card className="bg-gradient-to-r from-amber-50 to-orange-50">
                <CardContent className="p-6">
                  <h3 className="font-semibold text-lg mb-3 flex items-center gap-2">
                    💕 Tarifin Hikayesi
                  </h3>
                  <p className="text-gray-700 italic">{recipe.story}</p>
                </CardContent>
              </Card>
            )}

            {/* Malzemeler */}
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="font-semibold text-lg">🛒 Malzemeler</h3>
                  <Button variant="outline" size="sm" onClick={handleCostCalculation}>
                    💰 Maliyet Hesapla
                  </Button>
                </div>
                <ul className="space-y-3">
                  {recipe.ingredients.map((ingredient, index) => (
                    <li key={index} className="flex items-center gap-3 hover:bg-gray-50 p-2 rounded cursor-pointer">
                      <div className="w-2 h-2 bg-food-500 rounded-full"></div>
                      <span className="flex-1">{ingredient}</span>
                      <Button variant="ghost" size="sm" className="text-xs">
                        + Listeye Ekle
                      </Button>
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>

            {/* Malzeme Alternatifleri */}
            <Card>
              <CardContent className="p-6">
                <h3 className="font-semibold text-lg mb-4">🔄 Malzeme Alternatifleri</h3>
                <div className="space-y-3">
                  {Object.entries(recipe.alternatives).map(([ingredient, alternatives], index) => (
                    <div key={index} className="p-3 bg-gray-50 rounded-lg">
                      <span className="font-medium">{ingredient} yerine:</span>
                      <div className="flex flex-wrap gap-2 mt-2">
                        {alternatives.map((alt, altIndex) => (
                          <Badge key={altIndex} variant="outline" className="bg-white">
                            {alt}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Yapılışı */}
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="font-semibold text-lg">👨‍🍳 Yapılışı</h3>
                  <Button variant="outline" size="sm" onClick={handleVoiceNarration}>
                    <Volume2 className="h-4 w-4 mr-2" />
                    Sesli Anlatım
                  </Button>
                </div>
                <ol className="space-y-4">
                  {recipe.instructions.map((step, index) => (
                    <li key={index} className="flex gap-4">
                      <span className="bg-food-500 text-white w-8 h-8 rounded-full flex items-center justify-center text-sm font-semibold flex-shrink-0">
                        {index + 1}
                      </span>
                      <span className="pt-1">{step}</span>
                    </li>
                  ))}
                </ol>
              </CardContent>
            </Card>

            {/* Püf Noktası */}
            {recipe.tips && (
              <Card className="bg-gradient-to-r from-blue-50 to-cyan-50">
                <CardContent className="p-6">
                  <h3 className="font-semibold text-lg mb-3 flex items-center gap-2">
                    <Lightbulb className="h-5 w-5 text-blue-600" />
                    💡 Püf Noktası
                  </h3>
                  <p className="text-gray-700">{recipe.tips}</p>
                </CardContent>
              </Card>
            )}

            {/* Video */}
            {recipe.videoUrl && (
              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center gap-2 mb-4">
                    <PlayCircle className="h-5 w-5 text-food-600" />
                    <h3 className="font-semibold text-lg">📱 Video Tarif</h3>
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

            {/* Kullanıcı Fotoğrafları */}
            <Card>
              <CardContent className="p-6">
                <h3 className="font-semibold text-lg mb-4">📸 Diğer Kullanıcılar Böyle Yaptı</h3>
                <div className="grid grid-cols-3 gap-4">
                  {userPhotos.map((photo, index) => (
                    <div key={index} className="aspect-square rounded-lg overflow-hidden hover:scale-105 transition-transform cursor-pointer">
                      <img src={photo} alt={`Kullanıcı fotoğrafı ${index + 1}`} className="w-full h-full object-cover" />
                    </div>
                  ))}
                </div>
                <Button variant="outline" className="w-full mt-4">
                  + Kendi Fotoğrafımı Ekle
                </Button>
              </CardContent>
            </Card>

            {/* Yorumlar */}
            <Card>
              <CardContent className="p-6">
                <h3 className="font-semibold text-lg mb-4">💬 Yorumlar ({comments.length})</h3>
                <div className="space-y-4">
                  {comments.map((comment) => (
                    <div key={comment.id} className="border-b border-gray-100 pb-4 last:border-b-0">
                      <div className="flex items-center justify-between mb-2">
                        <div className="flex items-center gap-2">
                          <div className="w-8 h-8 bg-gray-300 rounded-full flex items-center justify-center">
                            👤
                          </div>
                          <span className="font-medium">{comment.user}</span>
                          <div className="flex">
                            {Array(comment.rating).fill(0).map((_, i) => (
                              <Star key={i} className="h-3 w-3 fill-yellow-400 text-yellow-400" />
                            ))}
                          </div>
                        </div>
                        <span className="text-sm text-gray-500">{comment.date}</span>
                      </div>
                      <p className="text-gray-700 mb-2">{comment.comment}</p>
                      <Button variant="ghost" size="sm" className="text-xs">
                        👍 Yararlı ({comment.helpful})
                      </Button>
                    </div>
                  ))}
                </div>
                <Button variant="outline" className="w-full mt-4">
                  Yorum Ekle
                </Button>
              </CardContent>
            </Card>

            {/* Önerilen Tarifler */}
            <Card>
              <CardContent className="p-6">
                <h3 className="font-semibold text-lg mb-4">🍽️ Benzer Tarifler</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {relatedRecipes.map((related) => (
                    <div key={related.id} className="flex gap-3 p-3 bg-gray-50 rounded-lg hover:bg-gray-100 cursor-pointer">
                      <img src={related.image} alt={related.title} className="w-16 h-16 rounded-lg object-cover" />
                      <div className="flex-1">
                        <h4 className="font-medium">{related.title}</h4>
                        <div className="flex items-center gap-2 text-sm text-gray-600">
                          <Star className="h-3 w-3 fill-yellow-400 text-yellow-400" />
                          {related.rating}
                          <Clock className="h-3 w-3" />
                          {related.cookingTime}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Sağ taraf - Sidebar */}
          <div className="space-y-6">
            {/* Kalori Hesaplayıcı */}
            <CalorieCalculator />

            {/* Tarif Sahibi Profili */}
            <Card>
              <CardContent className="p-6">
                <h3 className="font-semibold text-lg mb-4">👨‍🍳 Tarif Sahibi</h3>
                <div className="text-center">
                  <div className="w-16 h-16 bg-gradient-to-br from-food-100 to-spice-100 rounded-full flex items-center justify-center mx-auto mb-3">
                    <ChefHat className="h-8 w-8 text-food-600" />
                  </div>
                  <h4 className="font-semibold">{recipe.author}</h4>
                  <p className="text-sm text-gray-600 mb-3">89 tarif, 2,450 puan</p>
                  <div className="flex justify-center mb-4">
                    <Badge className="bg-yellow-100 text-yellow-800">
                      👑 Haftanın Şefi
                    </Badge>
                  </div>
                  <Button variant="outline" className="w-full">
                    Profili Görüntüle
                  </Button>
                </div>
              </CardContent>
            </Card>

            {/* Diğer Tarifleri */}
            <Card>
              <CardContent className="p-6">
                <h3 className="font-semibold text-lg mb-4">{recipe.author}'nin Diğer Tarifleri</h3>
                <div className="space-y-3">
                  {["Tavuk Şiş", "Pilav", "Salata"].map((title, index) => (
                    <div key={index} className="flex items-center gap-3 p-2 hover:bg-gray-50 rounded cursor-pointer">
                      <div className="w-10 h-10 bg-gray-200 rounded"></div>
                      <span className="text-sm">{title}</span>
                    </div>
                  ))}
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
