
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Check, Star, Crown, Zap } from "lucide-react";

const PremiumPlans = () => {
  const plans = [
    {
      name: "Ücretsiz",
      price: "0",
      period: "Hep ücretsiz",
      features: [
        "Temel tarif erişimi",
        "5 favori tarif",
        "Topluluk yorumları",
        "Reklamlarla birlikte",
        "Temel arama"
      ],
      buttonText: "Mevcut Plan",
      buttonVariant: "outline" as const,
      popular: false
    },
    {
      name: "Premium",
      price: "29",
      period: "aylık",
      features: [
        "Sınırsız tarif erişimi",
        "Reklamsız deneyim",
        "Haftalık menü planlama",
        "Akıllı alışveriş listesi",
        "Video tariflere tam erişim",
        "Kişisel beslenme günlüğü",
        "Gelişmiş arama ve filtreler",
        "Öncelikli destek"
      ],
      buttonText: "Premium'a Geç",
      buttonVariant: "default" as const,
      popular: true
    },
    {
      name: "Pro Chef",
      price: "99",
      period: "aylık",
      features: [
        "Premium'un tüm özellikleri",
        "Kendi tarif kanalın",
        "Gelir paylaşım sistemi",
        "Analitik dashboard",
        "Özel içerik üretici araçları",
        "Marka ortaklık fırsatları",
        "1-1 mentörlük desteği",
        "Özel etkinlik davetleri"
      ],
      buttonText: "Pro Chef Ol",
      buttonVariant: "default" as const,
      popular: false
    }
  ];

  return (
    <section className="py-16 bg-gradient-to-b from-gray-50 to-white">
      <div className="max-w-7xl mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-gray-900 mb-4">
            🎯 Size Uygun Planı Seçin
          </h2>
          <p className="text-gray-600 max-w-2xl mx-auto">
            Mutfak deneyiminizi bir üst seviyeye taşıyacak özelliklerle dolu paketlerimizi keşfedin
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {plans.map((plan, index) => (
            <Card key={index} className={`relative ${plan.popular ? 'ring-2 ring-food-500 shadow-2xl scale-105' : 'shadow-md'}`}>
              {plan.popular && (
                <Badge className="absolute -top-3 left-1/2 transform -translate-x-1/2 bg-food-500 text-white">
                  <Star className="h-3 w-3 mr-1" />
                  En Popüler
                </Badge>
              )}
              
              <CardHeader className="text-center pb-4">
                <div className="flex justify-center mb-4">
                  {plan.name === "Ücretsiz" && <Zap className="h-8 w-8 text-gray-500" />}
                  {plan.name === "Premium" && <Crown className="h-8 w-8 text-food-500" />}
                  {plan.name === "Pro Chef" && <Star className="h-8 w-8 text-purple-500" />}
                </div>
                <CardTitle className="text-xl font-semibold">{plan.name}</CardTitle>
                <div className="mt-4">
                  <span className="text-4xl font-bold text-gray-900">₺{plan.price}</span>
                  <span className="text-gray-600 ml-2">/{plan.period}</span>
                </div>
              </CardHeader>
              
              <CardContent className="space-y-6">
                <ul className="space-y-3">
                  {plan.features.map((feature, featureIndex) => (
                    <li key={featureIndex} className="flex items-start gap-3">
                      <Check className="h-4 w-4 text-green-500 mt-1 flex-shrink-0" />
                      <span className="text-sm text-gray-700">{feature}</span>
                    </li>
                  ))}
                </ul>
                
                <Button 
                  variant={plan.buttonVariant}
                  className={`w-full ${plan.popular ? 'gradient-primary text-white' : ''}`}
                  disabled={plan.name === "Ücretsiz"}
                >
                  {plan.buttonText}
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Additional Benefits */}
        <div className="mt-16 bg-gradient-to-r from-food-50 to-spice-50 rounded-2xl p-8">
          <div className="text-center mb-8">
            <h3 className="text-2xl font-bold text-gray-900 mb-4">
              💎 Premium Üyeliğin Avantajları
            </h3>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="text-center">
              <div className="bg-white rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl">🚫</span>
              </div>
              <h4 className="font-semibold mb-2">Reklamsız Deneyim</h4>
              <p className="text-sm text-gray-600">Hiç reklam görmeden tarifleri keşfedin</p>
            </div>
            
            <div className="text-center">
              <div className="bg-white rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl">📱</span>
              </div>
              <h4 className="font-semibold mb-2">Akıllı Özellikler</h4>
              <p className="text-sm text-gray-600">AI destekli menü planlama ve alışveriş listesi</p>
            </div>
            
            <div className="text-center">
              <div className="bg-white rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl">💰</span>
              </div>
              <h4 className="font-semibold mb-2">Para Kazanın</h4>
              <p className="text-sm text-gray-600">Pro Chef planıyla içerik üretip gelir elde edin</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default PremiumPlans;
