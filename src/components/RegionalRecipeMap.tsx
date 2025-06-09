
import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { MapPin, Globe } from "lucide-react";

const RegionalRecipeMap = () => {
  const [selectedRegion, setSelectedRegion] = useState("");

  const regions = {
    "istanbul": {
      name: "İstanbul",
      specialties: ["Balık Ekmek", "İskender", "Döner"],
      count: 45,
      color: "bg-blue-100 text-blue-800"
    },
    "izmir": {
      name: "İzmir", 
      specialties: ["Boyoz", "Kumru", "Gevrek"],
      count: 32,
      color: "bg-green-100 text-green-800"
    },
    "ankara": {
      name: "Ankara",
      specialties: ["Ankara Tava", "Beypazarı Kurusu"],
      count: 28,
      color: "bg-purple-100 text-purple-800"
    },
    "antalya": {
      name: "Antalya",
      specialties: ["Piyaz", "Hibeş", "Şiş Köfte"],
      count: 35,
      color: "bg-orange-100 text-orange-800"
    },
    "gaziantep": {
      name: "Gaziantep",
      specialties: ["Baklava", "Lahmacun", "Ali Nazik"],
      count: 52,
      color: "bg-red-100 text-red-800"
    },
    "trabzon": {
      name: "Trabzon",
      specialties: ["Hamsi", "Mıhlama", "Vakfıkebir Ekmek"],
      count: 29,
      color: "bg-cyan-100 text-cyan-800"
    }
  };

  const ethnicCuisines = [
    { name: "İtalyan", count: 24, flag: "🇮🇹" },
    { name: "Meksikalı", count: 18, flag: "🇲🇽" },
    { name: "Japon", count: 15, flag: "🇯🇵" },
    { name: "Hint", count: 21, flag: "🇮🇳" },
    { name: "Çin", count: 19, flag: "🇨🇳" },
    { name: "Fransız", count: 16, flag: "🇫🇷" }
  ];

  return (
    <div className="space-y-6">
      {/* Türkiye Haritası - Mockup */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <MapPin className="h-5 w-5" />
            🇹🇷 Yöresel Tarifler Haritası
          </CardTitle>
        </CardHeader>
        <CardContent>
          {/* Harita Mockup */}
          <div className="relative bg-gray-100 rounded-lg p-8 mb-6 min-h-[300px] flex items-center justify-center">
            <div className="text-center">
              <MapPin className="h-16 w-16 mx-auto mb-4 text-gray-400" />
              <p className="text-gray-600 font-medium">İnteraktif Türkiye Haritası</p>
              <p className="text-sm text-gray-500">Bölgelere tıklayarak o yörenin tariflerini keşfedin</p>
            </div>
            
            {/* Bölge Işaretleri */}
            <div className="absolute top-1/4 left-1/3 cursor-pointer" onClick={() => setSelectedRegion("istanbul")}>
              <div className="w-3 h-3 bg-blue-500 rounded-full animate-pulse"></div>
              <div className="text-xs mt-1 font-medium">İstanbul</div>
            </div>
            <div className="absolute top-1/2 left-1/4 cursor-pointer" onClick={() => setSelectedRegion("izmir")}>
              <div className="w-3 h-3 bg-green-500 rounded-full animate-pulse"></div>
              <div className="text-xs mt-1 font-medium">İzmir</div>
            </div>
            <div className="absolute top-1/3 right-1/3 cursor-pointer" onClick={() => setSelectedRegion("gaziantep")}>
              <div className="w-3 h-3 bg-red-500 rounded-full animate-pulse"></div>
              <div className="text-xs mt-1 font-medium">Gaziantep</div>
            </div>
          </div>

          {/* Bölge Listesi */}
          <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
            {Object.entries(regions).map(([key, region]) => (
              <div 
                key={key}
                className={`p-3 rounded-lg border-2 cursor-pointer transition-all duration-200 hover:scale-105 ${
                  selectedRegion === key 
                    ? 'border-food-500 bg-food-50' 
                    : 'border-gray-200 hover:border-gray-300'
                }`}
                onClick={() => setSelectedRegion(selectedRegion === key ? "" : key)}
              >
                <div className="flex items-center justify-between mb-2">
                  <h4 className="font-semibold">{region.name}</h4>
                  <Badge className={region.color}>
                    {region.count}
                  </Badge>
                </div>
                <div className="text-xs text-gray-600">
                  {region.specialties.slice(0, 2).join(", ")}
                  {region.specialties.length > 2 && "..."}
                </div>
              </div>
            ))}
          </div>

          {/* Seçili Bölge Detayı */}
          {selectedRegion && (
            <div className="mt-6 p-4 bg-food-50 rounded-lg border border-food-200">
              <h4 className="font-semibold text-food-800 mb-3">
                📍 {regions[selectedRegion as keyof typeof regions].name} Özel Lezzetleri
              </h4>
              <div className="flex flex-wrap gap-2">
                {regions[selectedRegion as keyof typeof regions].specialties.map((specialty, index) => (
                  <Badge key={index} variant="outline" className="border-food-300 text-food-700">
                    {specialty}
                  </Badge>
                ))}
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Etnik Mutfaklar */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Globe className="h-5 w-5" />
            🌍 Dünya Mutfakları
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
            {ethnicCuisines.map((cuisine, index) => (
              <div key={index} className="p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors cursor-pointer">
                <div className="text-center">
                  <div className="text-2xl mb-2">{cuisine.flag}</div>
                  <h4 className="font-semibold">{cuisine.name}</h4>
                  <p className="text-sm text-gray-600">{cuisine.count} tarif</p>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default RegionalRecipeMap;
