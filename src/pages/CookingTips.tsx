
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import PremiumHeader from "@/components/PremiumHeader";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Lightbulb, Book, Play, Star, Clock, ChefHat } from "lucide-react";

const CookingTips = () => {
  const tipCategories = [
    {
      title: "Temel Teknikler",
      icon: ChefHat,
      tips: [
        {
          title: "Soğan Doğranan Nasıl Doğranır?",
          description: "Gözyaşı dökmeden soğan doğramanın püf noktaları",
          difficulty: "Kolay",
          duration: "2 dk",
          views: 1245
        },
        {
          title: "Tavuk Nasıl Mühürlenir?",
          description: "Tavuğun suyunu kaçırmadan pişirme teknikleri",
          difficulty: "Orta",
          duration: "5 dk",
          views: 892
        }
      ]
    },
    {
      title: "Pişirme Sırları",
      icon: Star,
      tips: [
        {
          title: "Pilav Neden Lapa Olur?",
          description: "Mükemmel pilav için bilmeniz gerekenler",
          difficulty: "Kolay",
          duration: "3 dk",
          views: 2156
        },
        {
          title: "Et Nasıl Yumuşatılır?",
          description: "Sert eti yumuşatmanın doğal yolları",
          difficulty: "Orta",
          duration: "4 dk",
          views: 1678
        }
      ]
    }
  ];

  const glossaryTerms = [
    {
      term: "Kavurmak",
      definition: "Yiyeceği az yağda veya yağsız olarak sürekli karıştırarak pişirmek",
      category: "Pişirme"
    },
    {
      term: "Sote",
      definition: "Küçük parçalara kesilmiş sebze veya etin hızlıca tavada pişirilmesi",
      category: "Pişirme"
    },
    {
      term: "Blanşirmek",
      definition: "Sebzeleri kaynar suya kısa süre daldırıp buzlu suya almak",
      category: "Hazırlık"
    },
    {
      term: "Maruzlamak",
      description: "Etler doğrayıp baharatlarla bekletmek",
      category: "Hazırlık"
    }
  ];
  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 via-white to-orange-50">
      <Navbar />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
        {/* Premium Header */}
        <PremiumHeader
          title="Yemek Püf Noktaları"
          description="Mutfakta ustalaşmanız için gerekli tüm teknikler, sırlar ve püf noktaları burada!"
          emoji="🍳"
          primaryBadge={{
            icon: Lightbulb,
            text: "Öğren",
            animate: true
          }}
          secondaryBadge={{
            icon: ChefHat,
            text: "Mutfak Sırları"
          }}
          breadcrumbItems={[
            { label: "Ana Sayfa", href: "/" },
            { label: "Yemek Püf Noktaları", isActive: true }
          ]}
        />

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Ana İçerik */}
          <div className="lg:col-span-2 space-y-8">
            {/* Kategoriler */}
            {tipCategories.map((category, categoryIndex) => (
              <Card key={categoryIndex}>
                <CardHeader>
                  <CardTitle className="flex items-center gap-3">
                    <category.icon className="h-6 w-6 text-food-600" />
                    {category.title}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {category.tips.map((tip, tipIndex) => (
                      <div key={tipIndex} className="p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors cursor-pointer">
                        <div className="flex items-start justify-between mb-3">
                          <h3 className="font-semibold text-lg text-gray-900">{tip.title}</h3>
                          <Badge className={
                            tip.difficulty === "Kolay" ? "bg-green-100 text-green-800" :
                              tip.difficulty === "Orta" ? "bg-yellow-100 text-yellow-800" :
                                "bg-red-100 text-red-800"
                          }>
                            {tip.difficulty}
                          </Badge>
                        </div>
                        <p className="text-gray-600 mb-3">{tip.description}</p>
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-4 text-sm text-gray-500">
                            <div className="flex items-center gap-1">
                              <Clock className="h-4 w-4" />
                              {tip.duration}
                            </div>
                            <div className="flex items-center gap-1">
                              <Play className="h-4 w-4" />
                              {tip.views} izlenme
                            </div>
                          </div>
                          <Button size="sm" className="gradient-primary text-white">
                            <Play className="h-4 w-4 mr-1" />
                            İzle
                          </Button>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            ))}

            {/* Öne Çıkan Video */}
            <Card className="bg-gradient-to-r from-purple-50 to-pink-50">
              <CardContent className="p-8">
                <div className="text-center">
                  <h2 className="text-2xl font-bold mb-4">🎬 Bu Haftanın Öne Çıkan Videosu</h2>
                  <div className="bg-gray-200 rounded-xl p-12 mb-6">
                    <Play className="h-16 w-16 mx-auto text-gray-400 mb-4" />
                    <h3 className="font-semibold text-lg mb-2">Mükemmel Omlet Yapma Sanatı</h3>
                    <p className="text-gray-600">Şef Ayşe'den profesyonel omlet teknikleri</p>
                  </div>
                  <Button size="lg" className="gradient-primary text-white">
                    <Play className="h-5 w-5 mr-2" />
                    Şimdi İzle
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Mutfak Sözlüğü */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Book className="h-5 w-5" />
                  📚 Mutfak Sözlüğü
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {glossaryTerms.map((item, index) => (
                    <div key={index} className="border-b border-gray-100 pb-3 last:border-b-0">
                      <div className="flex items-center justify-between mb-1">
                        <h4 className="font-semibold text-food-700">{item.term}</h4>
                        <Badge variant="outline" className="text-xs">
                          {item.category}
                        </Badge>
                      </div>
                      <p className="text-sm text-gray-600">{item.definition}</p>
                    </div>
                  ))}
                </div>
                <Button variant="outline" className="w-full mt-4">
                  Tüm Terimleri Gör
                </Button>
              </CardContent>
            </Card>

            {/* Günün İpucu */}
            <Card className="bg-gradient-to-br from-yellow-50 to-orange-50">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-orange-800">
                  <Lightbulb className="h-5 w-5" />
                  💡 Günün İpucu
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-orange-700 font-medium mb-3">
                  "Baklayı temizlerken tuzlu su kullanın"
                </p>
                <p className="text-sm text-orange-600">
                  Baklaları temizlerken tuzlu su kullanırsanız, hem daha temiz olur hem de rengi açık kalır.
                </p>
              </CardContent>
            </Card>

            {/* Popüler İpuçları */}
            <Card>
              <CardHeader>
                <CardTitle>🔥 En Popüler İpuçları</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {[
                    "Soğan doğrark nasıl gözyaşı dökülmez?",
                    "Pilav lapa olmadan nasıl pişirilir?",
                    "Tavuk eti nasıl yumuşatılır?",
                    "Yoğurt neden kesilir, nasıl önlenir?"
                  ].map((tip, index) => (
                    <div key={index} className="p-2 hover:bg-gray-50 rounded cursor-pointer text-sm">
                      {index + 1}. {tip}
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

export default CookingTips;
