
import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Snowflake, Sun, Leaf, Cloud, Calendar, Gift, Sparkles } from "lucide-react";
import RecipeCard from "./RecipeCard";

const SeasonalRecommendations = () => {
  const [currentSeason, setCurrentSeason] = useState("winter");
  const [specialDay, setSpecialDay] = useState("kurban");

  // Mevsimsel öneriler
  const seasonalContent = {
    winter: {
      title: "❄️ Kış Sıcaklığı",
      description: "Soğuk kış günlerinde içinizi ısıtacak tarifler",
      icon: Snowflake,
      color: "from-blue-50 to-cyan-50",
      recipes: [
        {
          id: "winter-1",
          title: "Sıcak Mercimek Çorbası",
          image: "https://images.unsplash.com/photo-1547592166-23ac45744acd?w=400&h=300&fit=crop",
          cookingTime: "30 dk",
          difficulty: "Kolay" as const,
          rating: 4.9,
          author: "Kış Aşçısı",
          dblScore: 88,
          description: "Kışın vazgeçilmez sıcak çorbası"
        }
      ]
    },
    summer: {
      title: "☀️ Yaz Serinliği", 
      description: "Sıcak yaz günlerinde serinletici tarifler",
      icon: Sun,
      color: "from-yellow-50 to-orange-50",
      recipes: []
    },
    spring: {
      title: "🌸 Bahar Tazeliği",
      description: "Baharın taze renklerini sofranıza taşıyın",
      icon: Leaf,
      color: "from-green-50 to-emerald-50",
      recipes: []
    },
    autumn: {
      title: "🍂 Sonbahar Lezzetleri",
      description: "Sonbaharın bereketli malzemeleriyle",
      icon: Cloud,
      color: "from-amber-50 to-orange-50",
      recipes: []
    }
  };

  // Özel günler
  const specialDays = {
    kurban: {
      title: "🐄 Kurban Bayramı Özel",
      description: "Et yemekleri ve bayram tatlıları",
      icon: Gift,
      recipes: [
        {
          id: "kurban-1",
          title: "Kurban Kavurma",
          image: "https://images.unsplash.com/photo-1529042410759-befb1204b468?w=400&h=300&fit=crop",
          cookingTime: "90 dk",
          difficulty: "Orta" as const,
          rating: 4.8,
          author: "Bayram Şefi",
          dblScore: 95,
          description: "Geleneksel kurban kavurması tarifi"
        }
      ]
    },
    asure: {
      title: "🍲 Aşure Günü",
      description: "Bereket ve paylaşım günü özel tarifleri",
      icon: Sparkles,
      recipes: [
        {
          id: "asure-1", 
          title: "Geleneksel Aşure",
          image: "https://images.unsplash.com/photo-1578985545062-69928b1d9587?w=400&h=300&fit=crop",
          cookingTime: "120 dk",
          difficulty: "Orta" as const,
          rating: 4.7,
          author: "Gelenek Koruyucusu",
          dblScore: 90,
          description: "10 Muharrem aşure tarifi"
        }
      ]
    },
    ramazan: {
      title: "🌙 Ramazan Özel",
      description: "İftar ve sahur önerileri",
      icon: Calendar,
      recipes: []
    }
  };

  useEffect(() => {
    // Gerçek tarih kontrolü
    const now = new Date();
    const month = now.getMonth();
    
    if (month >= 11 || month <= 1) setCurrentSeason("winter");
    else if (month >= 2 && month <= 4) setCurrentSeason("spring");
    else if (month >= 5 && month <= 7) setCurrentSeason("summer");
    else setCurrentSeason("autumn");

    // Özel günler kontrolü (örnek)
    if (month === 6) setSpecialDay("kurban"); // Temmuz - Kurban Bayramı örneği
  }, []);

  const season = seasonalContent[currentSeason as keyof typeof seasonalContent];
  const special = specialDays[specialDay as keyof typeof specialDays];

  return (
    <div className="space-y-8">
      {/* Mevsimsel Öneriler */}
      <Card className={`bg-gradient-to-r ${season.color}`}>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <season.icon className="h-6 w-6" />
            {season.title}
          </CardTitle>
          <p className="text-gray-600">{season.description}</p>
        </CardHeader>
        <CardContent>
          {season.recipes.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {season.recipes.map((recipe) => (
                <RecipeCard key={recipe.id} {...recipe} />
              ))}
            </div>
          ) : (
            <div className="text-center py-8 text-gray-500">
              <season.icon className="h-12 w-12 mx-auto mb-3 opacity-50" />
              <p>Bu mevsim için özel tarifler hazırlanıyor...</p>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Özel Gün Önerileri */}
      <Card className="bg-gradient-to-r from-purple-50 to-pink-50">
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="flex items-center gap-2">
                <special.icon className="h-6 w-6" />
                {special.title}
              </CardTitle>
              <p className="text-gray-600">{special.description}</p>
            </div>
            <Badge className="bg-purple-100 text-purple-800">
              Özel Gün
            </Badge>
          </div>
        </CardHeader>
        <CardContent>
          {special.recipes.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {special.recipes.map((recipe) => (
                <RecipeCard key={recipe.id} {...recipe} />
              ))}
            </div>
          ) : (
            <div className="text-center py-8 text-gray-500">
              <special.icon className="h-12 w-12 mx-auto mb-3 opacity-50" />
              <p>Bu özel gün için tarifler hazırlanıyor...</p>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Tematik Akımlar */}
      <Card>
        <CardHeader>
          <CardTitle>🔥 Popüler Akımlar</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="p-4 bg-yellow-50 rounded-lg border border-yellow-200">
              <h4 className="font-semibold mb-2">👵 Annemin Tarifi</h4>
              <p className="text-sm text-gray-600">Nostaljik anne tarifleri akımı</p>
              <Button size="sm" className="mt-2" variant="outline">
                Keşfet
              </Button>
            </div>
            <div className="p-4 bg-blue-50 rounded-lg border border-blue-200">
              <h4 className="font-semibold mb-2">🏠 Karantina Yemekleri</h4>
              <p className="text-sm text-gray-600">Evde yapılabilir kolay tarifler</p>
              <Button size="sm" className="mt-2" variant="outline">
                Keşfet
              </Button>
            </div>
            <div className="p-4 bg-green-50 rounded-lg border border-green-200">
              <h4 className="font-semibold mb-2">💕 Yemekle Gelen Hikayeler</h4>
              <p className="text-sm text-gray-600">Duygusal anılar ve tarifler</p>
              <Button size="sm" className="mt-2" variant="outline">
                Keşfet
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default SeasonalRecommendations;
