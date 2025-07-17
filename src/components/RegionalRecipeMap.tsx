import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { MapPin, Globe, ChefHat, UtensilsCrossed, Clock, Users, ArrowRight, Heart, Timer, Bookmark, Star, PlusCircle, InfoIcon, TrendingUp, MapPinned } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { Skeleton } from "@/components/ui/skeleton";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";
import { useRegionalData } from "@/hooks/useRegionalData";
import RecipeCard from "./RecipeCard";
import "./RegionalRecipeMap.css";

interface RegionalRecipeMapProps {
  activeRegion?: string | null;
  onRegionSelect?: (regionId: string) => void;
}

const RegionalRecipeMap = ({ activeRegion, onRegionSelect }: RegionalRecipeMapProps) => {
  const [selectedRegion, setSelectedRegion] = useState("");
  const [isMapLoaded, setIsMapLoaded] = useState(false);
  const [hoveredRegion, setHoveredRegion] = useState("");
  const [selectedCity, setSelectedCity] = useState("");
  const [selectedGeographicRegion, setSelectedGeographicRegion] = useState("");

  // Supabase verileri için hook kullanımı
  const { regions: fetchedRegions, ethnicCuisines: fetchedCuisines, isLoading: isDataLoading, error } = useRegionalData();

  // ActiveRegion prop değiştiğinde seçili bölgeyi güncelle
  useEffect(() => {
    if (activeRegion) {
      setSelectedRegion(activeRegion);
    }
  }, [activeRegion]);

  // Haritanın yüklenme efekti
  useEffect(() => {
    const timer = setTimeout(() => {
      setIsMapLoaded(true);
    }, 1000);

    return () => clearTimeout(timer);
  }, []);

  // Bölge renkleri ve şehir eşleşmeleri
  const regionColors = {
    "marmara": {
      name: "Marmara Bölgesi",
      color: "#3b82f6", // Mavi
      hoverColor: "#2563eb",
      selectedColor: "#1d4ed8",
      cities: ["istanbul", "edirne", "kirklareli", "tekirdag", "kocaeli", "sakarya", "yalova", "balikesir", "bilecik", "bursa", "canakkale"]
    },
    "ege": {
      name: "Ege Bölgesi",
      color: "#10b981", // Yeşil
      hoverColor: "#059669",
      selectedColor: "#047857",
      cities: ["izmir", "aydin", "mugla", "manisa", "denizli", "usak", "kutahya", "afyonkarahisar"]
    },
    "akdeniz": {
      name: "Akdeniz Bölgesi",
      color: "#f59e0b", // Sarı/Turuncu
      hoverColor: "#d97706",
      selectedColor: "#b45309",
      cities: ["antalya", "mersin", "adana", "osmaniye", "hatay", "kahramanmaras", "isparta", "burdur"]
    },
    "ic_anadolu": {
      name: "İç Anadolu Bölgesi",
      color: "#8b5cf6", // Mor
      hoverColor: "#7c3aed",
      selectedColor: "#6d28d9",
      cities: ["ankara", "eskisehir", "konya", "kayseri", "sivas", "aksaray", "karaman", "kirikkale", "kirsehir", "nevsehir", "nigde", "yozgat", "cankiri"]
    },
    "karadeniz": {
      name: "Karadeniz Bölgesi",
      color: "#06b6d4", // Cyan
      hoverColor: "#0891b2",
      selectedColor: "#0e7490",
      cities: ["samsun", "ordu", "giresun", "trabzon", "rize", "artvin", "gumushane", "bayburt", "amasya", "tokat", "sinop", "corum", "kastamonu", "bartin", "karabuk", "zonguldak", "duzce", "bolu"]
    },
    "dogu_anadolu": {
      name: "Doğu Anadolu Bölgesi",
      color: "#ef4444", // Kırmızı
      hoverColor: "#dc2626",
      selectedColor: "#b91c1c",
      cities: ["erzurum", "erzincan", "agri", "kars", "igdir", "ardahan", "van", "bitlis", "mus", "bingol", "elazig", "tunceli", "malatya", "hakkari"]
    },
    "guneydogu_anadolu": {
      name: "Güneydoğu Anadolu Bölgesi",
      color: "#f97316", // Turuncu
      hoverColor: "#ea580c",
      selectedColor: "#c2410c",
      cities: ["gaziantep", "sanliurfa", "diyarbakir", "mardin", "batman", "siirt", "sirnak", "adiyaman", "kilis"]
    }
  };

  // TR kodu ile şehir isimlerini eşleştiren mapping
  const trCodeToCity = {
    "TR01": "adana", "TR02": "adiyaman", "TR03": "afyonkarahisar", "TR04": "agri", "TR05": "amasya",
    "TR06": "ankara", "TR07": "antalya", "TR08": "artvin", "TR09": "aydin", "TR10": "balikesir",
    "TR11": "bilecik", "TR12": "bingol", "TR13": "bitlis", "TR14": "bolu", "TR15": "burdur",
    "TR16": "bursa", "TR17": "canakkale", "TR18": "cankiri", "TR19": "corum", "TR20": "denizli",
    "TR21": "diyarbakir", "TR22": "edirne", "TR23": "elazig", "TR24": "erzincan", "TR25": "erzurum",
    "TR26": "eskisehir", "TR27": "gaziantep", "TR28": "giresun", "TR29": "gumushane", "TR30": "hakkari",
    "TR31": "hatay", "TR32": "isparta", "TR33": "mersin", "TR34": "istanbul", "TR35": "izmir",
    "TR36": "kars", "TR37": "kastamonu", "TR38": "kayseri", "TR39": "kirklareli", "TR40": "kirsehir",
    "TR41": "kocaeli", "TR42": "konya", "TR43": "kutahya", "TR44": "malatya", "TR45": "manisa",
    "TR46": "kahramanmaras", "TR47": "mardin", "TR48": "mugla", "TR49": "mus", "TR50": "nevsehir",
    "TR51": "nigde", "TR52": "ordu", "TR53": "rize", "TR54": "sakarya", "TR55": "samsun",
    "TR56": "siirt", "TR57": "sinop", "TR58": "sivas", "TR59": "tekirdag", "TR60": "tokat",
    "TR61": "trabzon", "TR62": "tunceli", "TR63": "sanliurfa", "TR64": "usak", "TR65": "van",
    "TR66": "yozgat", "TR67": "zonguldak", "TR68": "aksaray", "TR69": "bayburt", "TR70": "karaman",
    "TR71": "kirikkale", "TR72": "batman", "TR73": "sirnak", "TR74": "bartin", "TR75": "ardahan",
    "TR76": "igdir", "TR77": "yalova", "TR78": "karabuk", "TR79": "kilis", "TR80": "osmaniye",
    "TR81": "duzce"
  };

  // Şehrin hangi bölgeye ait olduğunu bulan fonksiyon
  const getCityRegion = (cityId: string) => {
    // TR kodu ile şehir ismini al
    const cityName = trCodeToCity[cityId] || cityId.toLowerCase();

    for (const [regionKey, regionData] of Object.entries(regionColors)) {
      if (regionData.cities.includes(cityName)) {
        return regionData;
      }
    }
    return null; // Bölge bulunamazsa
  };

  // Şehir tarif sayısını hesaplayan fonksiyon
  const getCityRecipeCount = (cityName: string) => {
    // Bölgelerdeki şehir verilerini kontrol et
    const cityKey = cityName.toLowerCase();
    if (regions[cityKey]) {
      return regions[cityKey].count;
    }

    // Şehir adına göre sabit sayılar (gerçekçi görünmesi için)
    const cityRecipeCounts: Record<string, number> = {
      'istanbul': 45, 'ankara': 28, 'izmir': 32, 'antalya': 35, 'bursa': 25, 'adana': 30,
      'gaziantep': 52, 'konya': 22, 'trabzon': 29, 'kayseri': 20, 'eskisehir': 18,
      'samsun': 24, 'denizli': 19, 'malatya': 26, 'erzurum': 21, 'van': 17,
      'diyarbakir': 23, 'sanliurfa': 27, 'mersin': 31, 'hatay': 33, 'manisa': 16,
      'kocaeli': 22, 'sakarya': 15, 'tekirdag': 14, 'balikesir': 18, 'edirne': 12,
      'aydin': 19, 'mugla': 24, 'afyonkarahisar': 16, 'yalova': 11, 'bilecik': 10,
      'canakkale': 17, 'kirklareli': 13, 'kutahya': 15, 'usak': 12, 'isparta': 14,
      'burdur': 10, 'kahramanmaras': 22, 'osmaniye': 13, 'sivas': 18, 'tokat': 16,
      'amasya': 14, 'corum': 15, 'sinop': 12, 'kastamonu': 13, 'bartin': 9,
      'karabuk': 11, 'zonguldak': 15, 'bolu': 12, 'duzce': 10, 'giresun': 13,
      'ordu': 17, 'rize': 14, 'artvin': 11, 'gumushane': 9, 'bayburt': 8,
      'nevsehir': 13, 'aksaray': 12, 'nigde': 11, 'karaman': 10, 'kirikkale': 9,
      'kirsehir': 10, 'yozgat': 12, 'cankiri': 8, 'erzincan': 12, 'agri': 10,
      'kars': 11, 'ardahan': 8, 'igdir': 9, 'bitlis': 10, 'mus': 9, 'bingol': 8,
      'elazig': 14, 'tunceli': 7, 'hakkari': 8, 'mardin': 16, 'batman': 12,
      'siirt': 10, 'sirnak': 9, 'adiyaman': 13, 'kilis': 11
    };

    return cityRecipeCounts[cityKey] || Math.floor(Math.random() * 20) + 10;
  };

  // Örnek veri tanımları - hook verileri yoksa kullanılacak
  const defaultRegions = {
    "istanbul": {
      name: "İstanbul",
      specialties: ["Balık Ekmek", "İskender", "Döner"],
      count: 45,
      color: "bg-orange-100 text-orange-800 border-orange-200"
    },
    "izmir": {
      name: "İzmir",
      specialties: ["Boyoz", "Kumru", "Gevrek"],
      count: 32,
      color: "bg-orange-100 text-orange-800 border-orange-200"
    },
    "ankara": {
      name: "Ankara",
      specialties: ["Ankara Tava", "Beypazarı Kurusu"],
      count: 28,
      color: "bg-orange-100 text-orange-800 border-orange-200"
    },
    "antalya": {
      name: "Antalya",
      specialties: ["Piyaz", "Hibeş", "Şiş Köfte"],
      count: 35,
      color: "bg-orange-100 text-orange-800 border-orange-200"
    },
    "gaziantep": {
      name: "Gaziantep",
      specialties: ["Baklava", "Lahmacun", "Ali Nazik"],
      count: 52,
      color: "bg-orange-100 text-orange-800 border-orange-200"
    },
    "trabzon": {
      name: "Trabzon",
      specialties: ["Hamsi", "Mıhlama", "Vakfıkebir Ekmek"],
      count: 29,
      color: "bg-orange-100 text-orange-800 border-orange-200"
    }
  };

  const defaultEthnicCuisines = [
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

  // Coğrafi bölgeler verileri
  const geographicRegions = [
    {
      id: "marmara",
      name: "Marmara",
      recipeCount: 234,
      color: "#3b82f6",
      dotColor: "bg-blue-500"
    },
    {
      id: "ege",
      name: "Ege",
      recipeCount: 198,
      color: "#10b981",
      dotColor: "bg-emerald-500"
    },
    {
      id: "akdeniz",
      name: "Akdeniz",
      recipeCount: 156,
      color: "#f59e0b",
      dotColor: "bg-amber-500"
    },
    {
      id: "ic_anadolu",
      name: "İç Anadolu",
      recipeCount: 143,
      color: "#8b5cf6",
      dotColor: "bg-purple-500"
    },
    {
      id: "karadeniz",
      name: "Karadeniz",
      recipeCount: 128,
      color: "#06b6d4",
      dotColor: "bg-cyan-500"
    },
    {
      id: "dogu_anadolu",
      name: "Doğu Anadolu",
      recipeCount: 87,
      color: "#ef4444",
      dotColor: "bg-red-500"
    },
    {
      id: "guneydogu_anadolu",
      name: "Güneydoğu Anadolu",
      recipeCount: 112,
      color: "#f97316",
      dotColor: "bg-orange-500"
    }
  ];

  // Bölge seçim fonksiyonu
  const handleGeographicRegionSelect = (regionId: string) => {
    const newSelectedRegion = regionId === selectedGeographicRegion ? "" : regionId;
    setSelectedGeographicRegion(newSelectedRegion);
    setSelectedCity("");
    setSelectedRegion("");

    // Haritadaki tüm şehirleri güncellemek için
    setTimeout(() => {
      const svgElement = document.getElementById('turkey-svg-map') as HTMLObjectElement;
      if (svgElement && svgElement.contentDocument) {
        const svgDoc = svgElement.contentDocument;
        const allPaths = svgDoc.querySelectorAll("path[id]");

        if (newSelectedRegion) {
          // Seçilen bölgenin şehirlerini aktif renkte göster
          const selectedRegionData = regionColors[newSelectedRegion];
          if (selectedRegionData) {
            allPaths.forEach(path => {
              const cityId = path.id;
              const cityName = trCodeToCity[cityId];

              if (selectedRegionData.cities.includes(cityName)) {
                // Bu şehir seçilen bölgede ise aktif renkte göster
                path.setAttribute('fill', selectedRegionData.selectedColor);
                path.setAttribute('stroke-width', '1');
                path.setAttribute('stroke', '#ffffff');
              } else {
                // Diğer şehirleri normal renkte göster
                const cityRegionData = getCityRegion(cityId);
                const cityBaseColor = cityRegionData ? cityRegionData.color : '#f97316';
                path.setAttribute('fill', cityBaseColor);
                path.setAttribute('stroke-width', '0.5');
                path.setAttribute('stroke', '#ffffff');
              }
            });
          }
        } else {
          // Hiçbir bölge seçili değilse tümünü normal renkte göster
          allPaths.forEach(path => {
            const cityId = path.id;
            const cityRegionData = getCityRegion(cityId);
            const cityBaseColor = cityRegionData ? cityRegionData.color : '#f97316';
            path.setAttribute('fill', cityBaseColor);
            path.setAttribute('stroke-width', '0.5');
            path.setAttribute('stroke', '#ffffff');
          });
        }
      }
    }, 100);

    if (onRegionSelect) {
      onRegionSelect(newSelectedRegion);
    }
  };

  // Örnek tarif verileri
  const generateSampleRecipes = (cityName: string, regionName: string) => {
    const recipes = [
      {
        id: `${cityName}-1`,
        title: `${cityName} Özel Kebabı`,
        image: "https://images.unsplash.com/photo-1565299624946-b28f40a0ca4b?w=400&h=300&fit=crop",
        cookingTime: "45 dk",
        difficulty: "Orta",
        rating: 4.5,
        author: "Chef Ahmet",
        description: `${cityName} yöresine özgü geleneksel kebap tarifi`,
        viewCount: Math.floor(Math.random() * 2000) + 500,
        likeCount: Math.floor(Math.random() * 150) + 20,
        commentCount: Math.floor(Math.random() * 30) + 5,
        tags: [regionName, "Geleneksel"]
      },
      {
        id: `${cityName}-2`,
        title: `${cityName} Pidesi`,
        image: "https://images.unsplash.com/photo-1571997478779-2adcbbe9ab2f?w=400&h=300&fit=crop",
        cookingTime: "30 dk",
        difficulty: "Kolay",
        rating: 4.3,
        author: "Usta Fatma",
        description: `Geleneksel ${cityName} pidesi tarifi`,
        viewCount: Math.floor(Math.random() * 1500) + 300,
        likeCount: Math.floor(Math.random() * 120) + 15,
        commentCount: Math.floor(Math.random() * 25) + 3,
        tags: [regionName, "Hamur İşi"]
      },
      {
        id: `${cityName}-3`,
        title: `${cityName} Tatlısı`,
        image: "https://images.unsplash.com/photo-1551024506-0bccd828d307?w=400&h=300&fit=crop",
        cookingTime: "60 dk",
        difficulty: "Zor",
        rating: 4.7,
        author: "Pastane Usta",
        description: `${cityName} yöresinin meşhur tatlısı`,
        viewCount: Math.floor(Math.random() * 1200) + 400,
        likeCount: Math.floor(Math.random() * 100) + 25,
        commentCount: Math.floor(Math.random() * 20) + 8,
        tags: [regionName, "Tatlı"]
      }
    ];
    return recipes;
  };

  // Hook verilerini veya varsayılan verileri kullan
  const regions = Object.keys(fetchedRegions || {}).length > 0 ? fetchedRegions : defaultRegions;
  const ethnicCuisines = (fetchedCuisines || []).length > 0 ? fetchedCuisines : defaultEthnicCuisines;

  // Veri yüklenirken gösterilecek
  if (isDataLoading) {
    return (
      <div className="space-y-8">
        <Card className="overflow-hidden border-orange-100">
          <CardHeader className="bg-gradient-to-r from-orange-50 to-amber-50 border-b border-orange-100">
            <CardTitle className="flex items-center gap-2 text-orange-800">
              <MapPinned className="h-5 w-5 text-orange-500" />
              🇹🇷 Yöresel Tarifler Haritası
            </CardTitle>
            <CardDescription className="text-orange-600/80">
              Veriler yükleniyor...
            </CardDescription>
          </CardHeader>
          <CardContent className="p-8">
            <div className="flex flex-col items-center justify-center gap-6">
              <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-orange-500"></div>
              <p className="text-orange-700">Yöresel tarif verileri yükleniyor...</p>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  // Hata durumunu göster
  if (error) {
    return (
      <div className="space-y-8">
        <Card className="overflow-hidden border-red-200">
          <CardHeader className="bg-red-50 border-b border-red-200">
            <CardTitle className="flex items-center gap-2 text-red-800">
              <InfoIcon className="h-5 w-5 text-red-500" />
              Veri Yükleme Hatası
            </CardTitle>
            <CardDescription className="text-red-600">
              Yöresel tarif verileri yüklenirken bir hata oluştu
            </CardDescription>
          </CardHeader>
          <CardContent className="p-6">
            <p className="text-red-700">{error}</p>
            <Button variant="outline" className="mt-4 text-red-600 border-red-200">
              Tekrar Dene
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="space-y-8 region-map-container">
      {/* Coğrafi Bölgeler Section - Yeniden Tasarlandı */}
      <div className="mb-8">
        <div className="text-center mb-6">
          <h2 className="text-3xl font-bold text-gray-900 mb-3 flex items-center justify-center gap-3">
            <div className="w-8 h-8 bg-gradient-to-r from-orange-500 to-amber-500 rounded-full flex items-center justify-center">
              <MapPinned className="h-5 w-5 text-white" />
            </div>
            Coğrafi Bölgeler
          </h2>
          <p className="text-gray-600 max-w-3xl mx-auto text-lg leading-relaxed">
            Türkiye'nin 7 coğrafi bölgesindeki eşsiz yöresel lezzetleri keşfedin. Her bölgenin kendine özgü mutfak kültürü ve geleneksel tatları sizi bekliyor.
          </p>
        </div>

        {/* Desktop Grid */}
        <div className="hidden lg:grid grid-cols-7 gap-4">
          {geographicRegions.map((region, index) => (
            <motion.div
              key={region.id}
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1, duration: 0.5 }}
              whileHover={{ y: -8 }}
            >
              <Card
                className={`overflow-hidden transition-all duration-300 cursor-pointer group enhanced-card h-32 ${selectedGeographicRegion === region.id
                  ? 'ring-2 ring-orange-500 shadow-xl bg-gradient-to-br from-orange-50 to-amber-50 border-orange-300'
                  : 'hover:shadow-xl hover:border-orange-300 border-orange-100'
                  }`}
                onClick={() => handleGeographicRegionSelect(region.id)}
              >
                <CardContent className="p-4 h-full flex flex-col justify-between">
                  <div className="flex items-center gap-2 mb-2">
                    <div
                      className={`w-3 h-3 rounded-full ${region.dotColor} ring-2 ring-white shadow-sm flex-shrink-0`}
                    />
                    <h3 className={`font-bold text-xs transition-colors duration-300 leading-tight ${selectedGeographicRegion === region.id
                      ? 'text-orange-700'
                      : 'text-gray-900 group-hover:text-orange-600'
                      }`}>
                      {region.name}
                    </h3>
                  </div>
                  <div className="text-center">
                    <Badge
                      variant="outline"
                      className={`text-xs font-semibold transition-all duration-300 ${selectedGeographicRegion === region.id
                        ? 'bg-orange-100 text-orange-800 border-orange-400'
                        : 'bg-orange-50 text-orange-700 border-orange-200 group-hover:bg-orange-100'
                        }`}
                    >
                      {region.recipeCount}
                    </Badge>
                  </div>
                </CardContent>
                <div
                  className={`h-1 transition-all duration-300 region-color-bar ${selectedGeographicRegion === region.id ? 'opacity-100' : 'opacity-60 group-hover:opacity-100'
                    }`}
                  data-region-color={region.color}
                ></div>
              </Card>
            </motion.div>
          ))}
        </div>

        {/* Mobile Horizontal Scroll */}
        <div className="lg:hidden">
          <div className="flex gap-4 overflow-x-auto pb-4 scrollbar-hide snap-x snap-mandatory">
            {geographicRegions.map((region, index) => (
              <motion.div
                key={region.id}
                initial={{ opacity: 0, x: 50 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.1, duration: 0.5 }}
                className="flex-shrink-0 snap-start"
              >
                <Card
                  className={`overflow-hidden transition-all duration-300 cursor-pointer group enhanced-card w-40 h-32 ${selectedGeographicRegion === region.id
                    ? 'ring-2 ring-orange-500 shadow-xl bg-gradient-to-br from-orange-50 to-amber-50 border-orange-300'
                    : 'hover:shadow-xl hover:border-orange-300 border-orange-100'
                    }`}
                  onClick={() => handleGeographicRegionSelect(region.id)}
                >
                  <CardContent className="p-4 h-full flex flex-col justify-between">
                    <div className="flex items-center gap-2 mb-2">
                      <div
                        className={`w-4 h-4 rounded-full ${region.dotColor} ring-2 ring-white shadow-sm flex-shrink-0`}
                      />
                      <h3 className={`font-bold text-sm transition-colors duration-300 leading-tight ${selectedGeographicRegion === region.id
                        ? 'text-orange-700'
                        : 'text-gray-900 group-hover:text-orange-600'
                        }`}>
                        {region.name}
                      </h3>
                    </div>
                    <div className="text-center">
                      <Badge
                        variant="outline"
                        className={`text-xs font-semibold transition-all duration-300 ${selectedGeographicRegion === region.id
                          ? 'bg-orange-100 text-orange-800 border-orange-400'
                          : 'bg-orange-50 text-orange-700 border-orange-200 group-hover:bg-orange-100'
                          }`}
                      >
                        {region.recipeCount} tarif
                      </Badge>
                    </div>
                  </CardContent>
                  <div
                    className={`h-1 transition-all duration-300 region-color-bar ${selectedGeographicRegion === region.id ? 'opacity-100' : 'opacity-60 group-hover:opacity-100'
                      }`}
                    data-region-color={region.color}
                  ></div>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </div>

      {/* Türkiye Haritası - Interaktif */}
      <Card className="overflow-hidden border-orange-100">
        <CardHeader className="bg-gradient-to-r from-orange-50 to-amber-50 border-b border-orange-100">
          <CardTitle className="flex items-center gap-2 text-orange-800">
            <MapPinned className="h-5 w-5 text-orange-500" />
            🇹🇷 Yöresel Tarifler Haritası
          </CardTitle>
          <CardDescription className="text-orange-600/80">
            Türkiye'nin farklı bölgelerindeki zengin mutfak kültürlerini keşfedin
          </CardDescription>
        </CardHeader>

        <CardContent className="p-6">
          {/* Gerçek İnteraktif Türkiye Haritası */}
          <div className="relative bg-gradient-to-b from-orange-50 to-amber-50 rounded-xl p-4 mb-6 min-h-[400px] flex items-center justify-center border border-orange-100 shadow-inner overflow-hidden">
            {/* Animasyonlu dekoratif elementler */}
            <div className="absolute top-0 left-0 w-full h-full">
              <div className="absolute top-1/4 left-1/4 w-32 h-32 bg-orange-200 rounded-full opacity-20 blur-2xl animate-pulse"></div>
              <div className="absolute bottom-1/3 right-1/3 w-24 h-24 bg-amber-300 rounded-full opacity-20 blur-xl animate-pulse region-pulse-delay-1"></div>
              <div className="absolute top-1/2 right-1/4 w-40 h-40 bg-orange-300 rounded-full opacity-10 blur-3xl animate-pulse region-pulse-delay-2"></div>
            </div>

            {!isMapLoaded ? (
              <div className="flex flex-col items-center justify-center gap-4">
                <Skeleton className="h-16 w-16 rounded-full bg-orange-200/50" />
                <Skeleton className="h-4 w-48 rounded-full bg-orange-200/50" />
                <Skeleton className="h-3 w-64 rounded-full bg-orange-200/50" />
              </div>
            ) : (
              <div className="relative w-full h-full">
                <div className="text-center mb-4">
                  <div className="relative inline-flex">
                    <MapPin className="h-12 w-12 mx-auto mb-2 text-orange-400" />
                    <div className="absolute inset-0 animate-ping rounded-full bg-orange-400/20"></div>
                  </div>
                  <p className="text-orange-800 font-medium text-xl">İnteraktif Türkiye Haritası</p>
                  <p className="text-orange-600/70 mb-4">Bölgelere tıklayarak o yörenin tariflerini keşfedin</p>
                </div>

                {/* SVG Türkiye Haritası */}
                <div className="relative w-full h-[500px] mx-auto turkey-map-container">
                  <object
                    type="image/svg+xml"
                    data="/tr.svg"
                    className="w-full h-full"
                    id="turkey-svg-map"
                    onLoad={(e) => {
                      const svgDoc = e.currentTarget.contentDocument;
                      if (!svgDoc) return;

                      // Tüm illeri içeren bir dizi (path elemanlarının parent g elemanları)
                      const allCities = Array.from(svgDoc.querySelectorAll("path[id]")).map(path => path.id);

                      // Şehir popup bilgisi için
                      const createTooltip = () => {
                        const tooltip = document.createElement('div');
                        tooltip.className = 'city-tooltip';
                        tooltip.style.cssText = `
                          position: absolute;
                          background: white;
                          color: #7c2d12;
                          padding: 5px 10px;
                          border-radius: 4px;
                          font-size: 12px;
                          pointer-events: none;
                          opacity: 0;
                          transition: opacity 0.3s ease;
                          z-index: 100;
                          box-shadow: 0 2px 10px rgba(0,0,0,0.1);
                          border: 1px solid #fdba74;
                        `;
                        document.body.appendChild(tooltip);
                        return tooltip;
                      };

                      const tooltip = createTooltip();

                      // Mousemove listener'larını saklamak için Map kullanacağız
                      const mouseListeners = new Map();

                      // İlleri etkileşimli hale getir
                      allCities.forEach(cityId => {
                        const path = svgDoc.getElementById(cityId);
                        if (path) {
                          const cityName = trCodeToCity[cityId] || path.getAttribute('name') || cityId.replace('TR', '').replace(/\d+/g, '');
                          const regionData = getCityRegion(cityId);

                          // Başlangıç stillerini ayarla
                          path.style.cursor = 'pointer';
                          const baseColor = regionData ? regionData.color : '#f97316';
                          path.setAttribute('fill', baseColor);
                          path.setAttribute('stroke', '#ffffff');
                          path.setAttribute('stroke-width', '0.5');

                          // Title attribute ekle (tooltip için) - tarif sayısı ile birlikte
                          const recipeCount = getCityRecipeCount(cityName);
                          const titleText = `${cityName.charAt(0).toUpperCase() + cityName.slice(1)} - ${recipeCount} Tarif`;
                          path.setAttribute('title', titleText);

                          // Şehir üzerine gelindiğinde
                          path.addEventListener('mouseenter', (event) => {
                            const hoverColor = regionData ? regionData.hoverColor : '#fb923c';
                            path.setAttribute('fill', hoverColor);
                            path.setAttribute('stroke-width', '1');

                            // Tooltip göster ve pozisyonla
                            tooltip.innerHTML = `📍 ${titleText}`;
                            tooltip.style.opacity = '1';
                            tooltip.style.left = `${event.pageX + 10}px`;
                            tooltip.style.top = `${event.pageY - 30}px`;

                            // Mouse pozisyonuna göre tooltip konumunu güncelle
                            const updateTooltipPosition = (e: MouseEvent) => {
                              tooltip.style.left = `${e.pageX + 10}px`;
                              tooltip.style.top = `${e.pageY - 30}px`;
                            };

                            document.addEventListener('mousemove', updateTooltipPosition);

                            // Listener'ı Map'te sakla
                            mouseListeners.set(cityId, updateTooltipPosition);
                          });

                          // Şehir üzerinden çıkıldığında
                          path.addEventListener('mouseleave', () => {
                            // Seçili şehir değilse normal renge döndür
                            if (selectedRegion !== cityName.toLowerCase()) {
                              path.setAttribute('fill', baseColor);
                              path.setAttribute('stroke-width', '0.5');
                            }

                            // Tooltip gizle
                            tooltip.style.opacity = '0';

                            // Mousemove listener'ını temizle
                            const listener = mouseListeners.get(cityId);
                            if (listener) {
                              document.removeEventListener('mousemove', listener);
                              mouseListeners.delete(cityId);
                            }
                          });

                          // Şehre tıklandığında
                          path.addEventListener('click', () => {
                            // Coğrafi bölge seçimini temizle
                            setSelectedGeographicRegion("");

                            // Diğer şehirleri normale döndür
                            allCities.forEach(c => {
                              const cityPath = svgDoc.getElementById(c);
                              if (cityPath) {
                                const cityRegionData = getCityRegion(c);
                                const cityBaseColor = cityRegionData ? cityRegionData.color : '#f97316';
                                cityPath.setAttribute('fill', cityBaseColor);
                                cityPath.setAttribute('stroke-width', '0.5');
                              }
                            });

                            // Seçilen şehri vurgula
                            const selectedColor = regionData ? regionData.selectedColor : '#ea580c';
                            path.setAttribute('fill', selectedColor);
                            path.setAttribute('stroke-width', '1');
                            setSelectedRegion(cityName.toLowerCase());
                            setHoveredRegion(cityName);

                            // Şehir tariflerini göster (modal yerine state ile)
                            setSelectedCity(cityName);
                            setSelectedRegion(cityName.toLowerCase());
                          });
                        }
                      });
                    }}
                  />

                  {/* Seçili bölge/il göstergesi */}
                  {selectedRegion && (
                    <div className="absolute top-2 left-2 bg-gradient-to-r from-orange-500 to-orange-600 text-white px-4 py-1.5 rounded-full text-sm shadow-md flex items-center gap-2 animate-fadeIn">
                      <MapPin className="h-4 w-4" />
                      <span className="font-medium">
                        {hoveredRegion || selectedRegion.charAt(0).toUpperCase() + selectedRegion.slice(1)}
                      </span>
                    </div>
                  )}

                  {/* Bilgilendirme yazısı */}
                  <div className="absolute bottom-2 right-2 bg-white/80 backdrop-blur-sm text-orange-800 px-3 py-1.5 rounded-lg text-xs shadow-sm border border-orange-100">
                    <div className="flex items-center gap-1.5">
                      <InfoIcon className="h-3.5 w-3.5 text-orange-500" />
                      81 ilin tümü etkileşimlidir
                    </div>
                  </div>
                </div>

                {/* Bölge Renkleri Legend'ı */}
                <div className="mt-4 p-4 bg-white/90 backdrop-blur-sm rounded-lg border border-orange-100 shadow-sm">
                  <h4 className="text-sm font-medium text-orange-900 mb-3 flex items-center gap-2">
                    <MapPinned className="h-4 w-4" />
                    Coğrafi Bölgeler
                  </h4>
                  <div className="grid grid-cols-2 lg:grid-cols-4 gap-2">
                    {Object.entries(regionColors).map(([key, regionData]) => (
                      <div key={key} className="flex items-center gap-2 text-xs">
                        <div
                          className={`w-4 h-4 rounded-sm border border-gray-200 region-color-indicator region-color-indicator-${key}`}
                        // style={{ backgroundColor: regionData.color }} kaldırıldı
                        ></div>
                        <span className="text-gray-700 font-medium">{regionData.name}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Seçili Şehir Tarifleri - RecipeCard ile */}
      {selectedCity && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <Card className="overflow-hidden border-orange-200 shadow-lg">
            <CardHeader className="bg-gradient-to-r from-orange-50 to-amber-50 border-b border-orange-200">
              <CardTitle className="flex items-center justify-between text-orange-800">
                <div className="flex items-center gap-2">
                  <ChefHat className="h-5 w-5 text-orange-500" />
                  {selectedCity.charAt(0).toUpperCase() + selectedCity.slice(1)} Yöresel Tarifleri
                </div>
                <Badge className="bg-orange-100 text-orange-700 border-orange-300">
                  {getCityRecipeCount(selectedCity)} Tarif
                </Badge>
              </CardTitle>
              <CardDescription className="text-orange-600/80">
                {selectedCity} iline özel geleneksel lezzetler ve özgün tarifler
              </CardDescription>
            </CardHeader>
            <CardContent className="p-6">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {generateSampleRecipes(selectedCity, hoveredRegion || selectedCity).map((recipe, index) => (
                  <motion.div
                    key={recipe.id}
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: index * 0.1, duration: 0.3 }}
                  >
                    <RecipeCard
                      id={recipe.id}
                      title={recipe.title}
                      image={recipe.image}
                      cookingTime={recipe.cookingTime}
                      difficulty={recipe.difficulty}
                      rating={recipe.rating}
                      author={recipe.author}
                      description={recipe.description}
                      viewCount={recipe.viewCount}
                      likeCount={recipe.likeCount}
                      commentCount={recipe.commentCount}
                      tags={recipe.tags}
                      isPopular={index < 2}
                    />
                  </motion.div>
                ))}
              </div>
            </CardContent>
          </Card>
        </motion.div>
      )}

      {/* Seçili Coğrafi Bölgedeki Tüm Şehir Tarifleri */}
      {selectedGeographicRegion && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <Card className="overflow-hidden border-orange-200 shadow-lg">
            <CardHeader className="bg-gradient-to-r from-orange-50 to-amber-50 border-b border-orange-200">
              <CardTitle className="flex items-center justify-between text-orange-800">
                <div className="flex items-center gap-2">
                  <MapPinned className="h-5 w-5 text-orange-500" />
                  {geographicRegions.find(r => r.id === selectedGeographicRegion)?.name} Bölgesi Tarifleri
                </div>
                <Badge className="bg-orange-100 text-orange-700 border-orange-300">
                  {geographicRegions.find(r => r.id === selectedGeographicRegion)?.recipeCount} Tarif
                </Badge>
              </CardTitle>
              <CardDescription className="text-orange-600/80">
                {geographicRegions.find(r => r.id === selectedGeographicRegion)?.name} bölgesindeki tüm şehirlerin yöresel lezzetleri
              </CardDescription>
            </CardHeader>
            <CardContent className="p-6">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {regionColors[selectedGeographicRegion]?.cities.slice(0, 9).map((city, index) => {
                  const recipes = generateSampleRecipes(city, geographicRegions.find(r => r.id === selectedGeographicRegion)?.name || "");
                  return recipes.slice(0, 1).map((recipe, recipeIndex) => (
                    <motion.div
                      key={`${city}-${recipeIndex}`}
                      initial={{ opacity: 0, scale: 0.9 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ delay: index * 0.1, duration: 0.3 }}
                    >
                      <RecipeCard
                        id={recipe.id}
                        title={recipe.title}
                        image={recipe.image}
                        cookingTime={recipe.cookingTime}
                        difficulty={recipe.difficulty}
                        rating={recipe.rating}
                        author={recipe.author}
                        description={recipe.description}
                        viewCount={recipe.viewCount}
                        likeCount={recipe.likeCount}
                        commentCount={recipe.commentCount}
                        tags={recipe.tags}
                        isPopular={index < 3}
                      />
                    </motion.div>
                  ));
                })}
              </div>
            </CardContent>
          </Card>
        </motion.div>
      )}
    </div>
  );
};

export default RegionalRecipeMap;
