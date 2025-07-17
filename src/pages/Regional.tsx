
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import RegionalRecipeMap from "@/components/RegionalRecipeMap";
import PremiumHeader from "@/components/PremiumHeader";
import { MapPin, ChefHat, Globe, Bookmark, TrendingUp, Filter, UtensilsCrossed, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardFooter, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { motion } from "framer-motion";
import { useEffect, useState } from "react";

const Regional = () => {
  const [activeRegion, setActiveRegion] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [selectedWorldCuisine, setSelectedWorldCuisine] = useState<string | null>(null);

  // Lokasyon tabanlı şehir aktif etme
  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          // Gerçek uygulamada API ile koordinatları şehre çevirebiliriz
          // Şimdilik örnek olarak İstanbul'u aktif edelim
          setActiveRegion("istanbul");
        },
        (error) => {
          console.log("Konum alınamadı:", error);
          // Varsayılan olarak İstanbul'u aktif et
          setActiveRegion("istanbul");
        }
      );
    } else {
      // Varsayılan olarak İstanbul'u aktif et
      setActiveRegion("istanbul");
    }
  }, []);

  // Popüler bölgeler (örnek veriler)
  const popularRegions = [
    { id: "akdeniz", name: "Akdeniz", recipeCount: 124 },
    { id: "karadeniz", name: "Karadeniz", recipeCount: 98 },
    { id: "ege", name: "Ege", recipeCount: 156 },
    { id: "ic-anadolu", name: "İç Anadolu", recipeCount: 112 },
    { id: "dogu-anadolu", name: "Doğu Anadolu", recipeCount: 87 },
  ];

  // Dünya mutfakları verileri
  const worldCuisines = [
    {
      name: "İtalyan",
      count: 24,
      flag: "🇮🇹",
      color: "from-green-500 to-red-500",
      specialties: ["Pizza", "Makarna", "Risotto"]
    },
    {
      name: "Meksikalı",
      count: 18,
      flag: "🇲🇽",
      color: "from-green-500 to-red-500",
      specialties: ["Taco", "Burrito", "Guacamole"]
    },
    {
      name: "Japon",
      count: 15,
      flag: "🇯🇵",
      color: "from-red-500 to-white",
      specialties: ["Sushi", "Ramen", "Tempura"]
    },
    {
      name: "Hint",
      count: 21,
      flag: "🇮🇳",
      color: "from-orange-500 to-green-500",
      specialties: ["Körili Tavuk", "Tandır", "Naan"]
    },
    {
      name: "Çin",
      count: 19,
      flag: "🇨🇳",
      color: "from-red-500 to-yellow-400",
      specialties: ["Dim Sum", "Pekin Ördeği", "Chow Mein"]
    },
    {
      name: "Fransız",
      count: 16,
      flag: "🇫🇷",
      color: "from-blue-500 to-red-500",
      specialties: ["Kruvasan", "Ratatouille", "Soufflé"]
    }
  ];

  // Bölge seçimi
  const handleRegionSelect = (regionId: string) => {
    setIsLoading(true);
    setActiveRegion(regionId);
    // Gerçek uygulamada burada Supabase'den veri çekilebilir
    setTimeout(() => setIsLoading(false), 800);
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-orange-50 to-white">
      <Navbar />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
        <PremiumHeader
          title="Yöresel Lezzetler"
          description="Türkiye'nin dört bir yanından özgün yöresel tarifler ve dünya mutfaklarından seçmeler ile damak zevkinizi zenginleştirin."
          emoji="🗺️"
          breadcrumbItems={[
            { label: "Ana Sayfa", href: "/", isActive: false },
            { label: "Yöresel Lezzetler", isActive: true }
          ]}
        />

        {/* Tabs Navigation */}
        <Tabs defaultValue="turkish" className="mb-8">
          <TabsList className="grid grid-cols-2 w-full max-w-md mx-auto mb-8 h-12 bg-white border border-orange-200 rounded-full shadow-sm">
            <TabsTrigger
              value="turkish"
              className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-orange-500 data-[state=active]:to-amber-500 data-[state=active]:text-white data-[state=active]:shadow-md rounded-full transition-all duration-300 font-medium"
            >
              <MapPin className="h-4 w-4 mr-2" />
              🇹🇷 Türk Mutfağı
            </TabsTrigger>
            <TabsTrigger
              value="world"
              className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-orange-500 data-[state=active]:to-amber-500 data-[state=active]:text-white data-[state=active]:shadow-md rounded-full transition-all duration-300 font-medium"
            >
              <Globe className="h-4 w-4 mr-2" />
              🌍 Dünya Mutfağı
            </TabsTrigger>
          </TabsList>

          <TabsContent value="turkish" className="rounded-2xl border border-orange-200 bg-white/50 backdrop-blur-sm p-6 shadow-lg">
            {/* Türk Mutfağı Header */}
            <div className="mb-8">
              <div className="text-center mb-6">
                <div className="flex items-center justify-center gap-3 mb-4">
                  <div className="relative">
                    <MapPin className="h-8 w-8 text-orange-500" />
                    <div className="absolute inset-0 animate-ping rounded-full bg-orange-400/20"></div>
                  </div>
                  <h3 className="text-3xl font-bold text-gray-900 flex items-center gap-2">
                    🇹🇷 Türk Mutfağı
                    <Badge className="bg-orange-100 text-orange-700 border-orange-300 text-sm">
                      81 İl
                    </Badge>
                  </h3>
                </div>
                <p className="text-gray-600 max-w-3xl mx-auto text-lg leading-relaxed mb-6">
                  Anadolu'nun binlerce yıllık mutfak kültürü ve 7 coğrafi bölgenin eşsiz lezzetleri.
                  Her bölgenin kendine özgü tarif hazinelerini ve geleneksel tatlarını keşfedin.
                </p>

                {/* İstatistik Kartları */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 max-w-2xl mx-auto mb-6">
                  <div className="bg-gradient-to-br from-orange-50 to-amber-50 rounded-xl p-4 border border-orange-200">
                    <div className="flex items-center justify-center gap-2 mb-2">
                      <UtensilsCrossed className="h-5 w-5 text-orange-500" />
                      <span className="font-bold text-orange-700 text-lg">650+</span>
                    </div>
                    <p className="text-orange-600 text-sm font-medium">Yöresel Tarif</p>
                  </div>
                  <div className="bg-gradient-to-br from-orange-50 to-amber-50 rounded-xl p-4 border border-orange-200">
                    <div className="flex items-center justify-center gap-2 mb-2">
                      <MapPin className="h-5 w-5 text-orange-500" />
                      <span className="font-bold text-orange-700 text-lg">7</span>
                    </div>
                    <p className="text-orange-600 text-sm font-medium">Coğrafi Bölge</p>
                  </div>
                  <div className="bg-gradient-to-br from-orange-50 to-amber-50 rounded-xl p-4 border border-orange-200">
                    <div className="flex items-center justify-center gap-2 mb-2">
                      <TrendingUp className="h-5 w-5 text-orange-500" />
                      <span className="font-bold text-orange-700 text-lg">81</span>
                    </div>
                    <p className="text-orange-600 text-sm font-medium">Şehir Mutfağı</p>
                  </div>
                </div>
              </div>
            </div>

            {isLoading ? (
              <div className="flex justify-center items-center h-96">
                <div className="flex flex-col items-center gap-4">
                  <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-orange-500"></div>
                  <p className="text-orange-600 font-medium">Yöresel lezzetler yükleniyor...</p>
                </div>
              </div>
            ) : (
              <RegionalRecipeMap activeRegion={activeRegion} onRegionSelect={handleRegionSelect} />
            )}
          </TabsContent>

          <TabsContent value="world" className="rounded-2xl border border-orange-200 bg-white/50 backdrop-blur-sm p-6 shadow-lg min-h-[600px]">
            <div className="mb-8">
              <div className="text-center mb-6">
                <h3 className="text-2xl font-bold text-gray-900 mb-2 flex items-center justify-center gap-2">
                  <Globe className="h-6 w-6 text-orange-500" />
                  🌍 Dünya Mutfakları
                </h3>
                <p className="text-gray-600 max-w-2xl mx-auto">
                  Farklı kültürlerden dünya lezzetlerini keşfedin ve damak zevkinizi zenginleştirin
                </p>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {worldCuisines.map((cuisine, index) => (
                <motion.div
                  key={index}
                  className="group relative overflow-hidden rounded-2xl border border-orange-200 bg-white transition-all duration-300 hover:shadow-xl hover:border-orange-300 cursor-pointer"
                  whileHover={{ y: -8, scale: 1.02 }}
                  transition={{ type: "spring", stiffness: 400, damping: 17 }}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  style={{ animationDelay: `${index * 0.1}s` }}
                >
                  {/* Gradient Overlay */}
                  <div className={`absolute inset-0 bg-gradient-to-br ${cuisine.color} opacity-5 group-hover:opacity-10 transition-opacity duration-300`}></div>

                  <div className="relative p-6">
                    <div className="flex justify-between items-start mb-4">
                      <Badge className="bg-orange-50 text-orange-600 border border-orange-200 hover:bg-orange-100 px-3 py-1 rounded-full text-sm font-medium">
                        {cuisine.count} tarif
                      </Badge>
                      <div className="text-4xl transform group-hover:scale-110 transition-transform duration-300">{cuisine.flag}</div>
                    </div>

                    <h4 className="font-bold text-lg text-gray-900 mb-4 group-hover:text-orange-600 transition-colors duration-300 flex items-center gap-2">
                      <span className="text-2xl">{cuisine.flag}</span>
                      {cuisine.name} Mutfağı
                    </h4>

                    <div className="space-y-3 mb-6">
                      {cuisine.specialties.map((specialty, i) => (
                        <div key={i} className="flex items-center gap-3 text-sm text-gray-600 group-hover:text-gray-700 transition-colors duration-300">
                          <div className="w-2 h-2 rounded-full bg-orange-400 opacity-60"></div>
                          <span className="font-medium">{specialty}</span>
                        </div>
                      ))}
                    </div>

                    <div className="pt-4 border-t border-gray-100">
                      <Button
                        variant="ghost"
                        onClick={() => setSelectedWorldCuisine(selectedWorldCuisine === cuisine.name ? null : cuisine.name)}
                        className="w-full justify-between px-4 py-3 text-orange-600 hover:text-white hover:bg-gradient-to-r hover:from-orange-500 hover:to-amber-500 rounded-xl transition-all duration-300 font-medium group"
                      >
                        <span>Tarifleri Keşfet</span>
                        <ArrowRight className="h-4 w-4 group-hover:translate-x-1 transition-transform duration-300" />
                      </Button>
                    </div>
                  </div>

                  <div className="h-1 w-full bg-gradient-to-r from-orange-400 to-amber-400"></div>
                </motion.div>
              ))}
            </div>

            {/* Seçilen Dünya Mutfağı Tarifleri */}
            {selectedWorldCuisine && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                className="mt-8"
              >
                <Card className="overflow-hidden border-orange-200 shadow-lg">
                  <CardHeader className="bg-gradient-to-r from-orange-50 to-amber-50 border-b border-orange-200">
                    <CardTitle className="flex items-center justify-between text-orange-800">
                      <div className="flex items-center gap-3">
                        <Globe className="h-5 w-5 text-orange-500" />
                        <span className="text-2xl">
                          {worldCuisines.find(c => c.name === selectedWorldCuisine)?.flag}
                        </span>
                        {selectedWorldCuisine} Mutfağı Tarifleri
                      </div>
                      <Badge className="bg-orange-100 text-orange-700 border-orange-300">
                        {worldCuisines.find(c => c.name === selectedWorldCuisine)?.count} Tarif
                      </Badge>
                    </CardTitle>
                    <CardDescription className="text-orange-600/80">
                      {selectedWorldCuisine} mutfağından popüler tarifler ve geleneksel lezzetler
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="p-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                      {/* Örnek tarifler */}
                      {worldCuisines.find(c => c.name === selectedWorldCuisine)?.specialties.map((specialty, index) => (
                        <motion.div
                          key={index}
                          initial={{ opacity: 0, scale: 0.9 }}
                          animate={{ opacity: 1, scale: 1 }}
                          transition={{ delay: index * 0.1, duration: 0.3 }}
                        >
                          <Card className="overflow-hidden border border-orange-200 hover:shadow-lg transition-all duration-300 cursor-pointer group">
                            <div className="relative h-48 bg-gradient-to-br from-orange-100 to-amber-100 flex items-center justify-center">
                              <div className="text-6xl opacity-30">
                                {worldCuisines.find(c => c.name === selectedWorldCuisine)?.flag}
                              </div>
                              <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                            </div>
                            <CardContent className="p-4">
                              <h4 className="font-bold text-lg text-gray-900 mb-2 group-hover:text-orange-600 transition-colors">
                                {specialty}
                              </h4>
                              <p className="text-gray-600 text-sm mb-3">
                                Geleneksel {selectedWorldCuisine.toLowerCase()} mutfağından özgün {specialty.toLowerCase()} tarifi
                              </p>
                              <div className="flex items-center justify-between text-sm text-gray-500">
                                <span className="flex items-center gap-1">
                                  ⏱️ {20 + index * 5} dk
                                </span>
                                <span className="flex items-center gap-1">
                                  ⭐ 4.{5 + index}
                                </span>
                                <span className="flex items-center gap-1">
                                  👤 {Math.floor(Math.random() * 50) + 20}
                                </span>
                              </div>
                            </CardContent>
                          </Card>
                        </motion.div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            )}
          </TabsContent>
        </Tabs>
      </div>

      <Footer />
    </div>
  );
};

export default Regional;
