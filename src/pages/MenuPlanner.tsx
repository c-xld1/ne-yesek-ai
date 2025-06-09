
import { useState } from "react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Plus, Utensils, Clock, Users, Star, Shuffle } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

const MenuPlanner = () => {
  const [selectedCombos, setSelectedCombos] = useState<string[]>([]);
  const { toast } = useToast();

  const menuCombinations = [
    {
      id: "combo1",
      title: "Geleneksel Türk Menüsü",
      description: "Klasik lezzetlerin mükemmel uyumu",
      items: [
        { type: "Çorba", name: "Mercimek Çorbası", time: "30 dk", image: "https://images.unsplash.com/photo-1547592166-23ac45744acd?w=200&h=150&fit=crop" },
        { type: "Ana Yemek", name: "Köfte + Pilav", time: "45 dk", image: "https://images.unsplash.com/photo-1529042410759-befb1204b468?w=200&h=150&fit=crop" },
        { type: "Tatlı", name: "Sütlaç", time: "60 dk", image: "https://images.unsplash.com/photo-1578985545062-69928b1d9587?w=200&h=150&fit=crop" }
      ],
      totalTime: "135 dk",
      servings: 4,
      cost: "95 TL",
      rating: 4.8,
      difficulty: "Orta"
    },
    {
      id: "combo2", 
      title: "Hızlı Akşam Yemeği",
      description: "15 dakikada hazır pratik menü",
      items: [
        { type: "Ana Yemek", name: "Tavuk Sote", time: "15 dk", image: "https://images.unsplash.com/photo-1598103442097-8b74394b95c6?w=200&h=150&fit=crop" },
        { type: "Yan Yemek", name: "Yoğurt + Salata", time: "5 dk", image: "https://images.unsplash.com/photo-1512621776951-a57141f2eefd?w=200&h=150&fit=crop" }
      ],
      totalTime: "20 dk",
      servings: 2,
      cost: "45 TL", 
      rating: 4.6,
      difficulty: "Kolay"
    },
    {
      id: "combo3",
      title: "Misafir Menüsü",
      description: "Özel günler için şık sunum",
      items: [
        { type: "Meze", name: "Muhammara + Humus", time: "20 dk", image: "https://images.unsplash.com/photo-1512621776951-a57141f2eefd?w=200&h=150&fit=crop" },
        { type: "Ana Yemek", name: "Kuzu Tandır", time: "180 dk", image: "https://images.unsplash.com/photo-1529042410759-befb1204b468?w=200&h=150&fit=crop" },
        { type: "Tatlı", name: "Baklava", time: "90 dk", image: "https://images.unsplash.com/photo-1578985545062-69928b1d9587?w=200&h=150&fit=crop" }
      ],
      totalTime: "290 dk",
      servings: 6,
      cost: "180 TL",
      rating: 4.9,
      difficulty: "Zor"
    }
  ];

  const customMenuBuilder = [
    {
      category: "Çorba",
      options: [
        { name: "Mercimek Çorbası", time: "30 dk", difficulty: "Kolay" },
        { name: "Domates Çorbası", time: "25 dk", difficulty: "Kolay" },
        { name: "Tavuk Çorbası", time: "45 dk", difficulty: "Orta" }
      ]
    },
    {
      category: "Ana Yemek", 
      options: [
        { name: "Tavuk Sote", time: "25 dk", difficulty: "Kolay" },
        { name: "Köfte", time: "30 dk", difficulty: "Orta" },
        { name: "Balık", time: "20 dk", difficulty: "Kolay" }
      ]
    },
    {
      category: "Yan Yemek",
      options: [
        { name: "Pilav", time: "25 dk", difficulty: "Kolay" },
        { name: "Bulgur", time: "20 dk", difficulty: "Kolay" },
        { name: "Makarna", time: "15 dk", difficulty: "Kolay" }
      ]
    },
    {
      category: "Tatlı",
      options: [
        { name: "Sütlaç", time: "60 dk", difficulty: "Orta" },
        { name: "Meyve", time: "5 dk", difficulty: "Kolay" },
        { name: "Dondurma", time: "0 dk", difficulty: "Kolay" }
      ]
    }
  ];

  const toggleCombo = (comboId: string) => {
    setSelectedCombos(prev => 
      prev.includes(comboId) 
        ? prev.filter(id => id !== comboId)
        : [...prev, comboId]
    );
  };

  const generateRandomMenu = () => {
    toast({
      title: "🎲 Rastgele menü oluşturuluyor",
      description: "Size özel rastgele bir menü kombinasyonu hazırlanıyor...",
    });
  };

  const createShoppingList = () => {
    toast({
      title: "🛒 Alışveriş listesi oluşturuluyor",
      description: "Seçili menüler için malzeme listesi hazırlanıyor...",
    });
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      
      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4 flex items-center justify-center gap-3">
            <Utensils className="h-8 w-8 text-food-600" />
            🍽️ Menü Oluşturucu
          </h1>
          <p className="text-gray-600 max-w-2xl mx-auto text-lg">
            Mükemmel menü kombinasyonları oluşturun veya hazır önerilerimizden seçin
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Ana İçerik */}
          <div className="lg:col-span-3 space-y-8">
            {/* Hızlı Aksiyonlar */}
            <Card>
              <CardContent className="p-6">
                <div className="flex flex-wrap gap-4 justify-center">
                  <Button onClick={generateRandomMenu} className="gradient-primary text-white">
                    <Shuffle className="h-4 w-4 mr-2" />
                    Rastgele Menü Oluştur
                  </Button>
                  <Button variant="outline">
                    <Plus className="h-4 w-4 mr-2" />
                    Özel Menü Yap
                  </Button>
                  <Button variant="outline" onClick={createShoppingList}>
                    🛒 Alışveriş Listesi Oluştur
                  </Button>
                </div>
              </CardContent>
            </Card>

            {/* Hazır Menü Kombinasyonları */}
            <div>
              <h2 className="text-2xl font-bold text-gray-900 mb-6">🎯 Hazır Menü Kombinasyonları</h2>
              <div className="space-y-6">
                {menuCombinations.map((combo) => (
                  <Card key={combo.id} className={`cursor-pointer transition-all duration-200 ${selectedCombos.includes(combo.id) ? 'ring-2 ring-food-500 bg-food-50' : 'hover:shadow-lg'}`}>
                    <CardContent className="p-6">
                      <div className="flex items-start justify-between mb-4">
                        <div>
                          <h3 className="text-xl font-semibold text-gray-900 mb-2">{combo.title}</h3>
                          <p className="text-gray-600 mb-3">{combo.description}</p>
                          <div className="flex items-center gap-4 text-sm text-gray-500">
                            <div className="flex items-center gap-1">
                              <Clock className="h-4 w-4" />
                              {combo.totalTime}
                            </div>
                            <div className="flex items-center gap-1">
                              <Users className="h-4 w-4" />
                              {combo.servings} kişi
                            </div>
                            <div className="flex items-center gap-1">
                              <Star className="h-4 w-4 text-yellow-500" />
                              {combo.rating}
                            </div>
                            <Badge className={
                              combo.difficulty === "Kolay" ? "bg-green-100 text-green-800" :
                              combo.difficulty === "Orta" ? "bg-yellow-100 text-yellow-800" :
                              "bg-red-100 text-red-800"
                            }>
                              {combo.difficulty}
                            </Badge>
                          </div>
                        </div>
                        <div className="text-right">
                          <div className="text-2xl font-bold text-food-600 mb-1">{combo.cost}</div>
                          <Button
                            variant={selectedCombos.includes(combo.id) ? "default" : "outline"}
                            onClick={() => toggleCombo(combo.id)}
                          >
                            {selectedCombos.includes(combo.id) ? "✓ Seçildi" : "Seç"}
                          </Button>
                        </div>
                      </div>

                      {/* Menü Öğeleri */}
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        {combo.items.map((item, index) => (
                          <div key={index} className="bg-white p-4 rounded-lg border border-gray-200">
                            <img 
                              src={item.image} 
                              alt={item.name}
                              className="w-full h-24 object-cover rounded-lg mb-3"
                            />
                            <div className="text-center">
                              <Badge variant="outline" className="mb-2 text-xs">
                                {item.type}
                              </Badge>
                              <h4 className="font-medium text-sm mb-1">{item.name}</h4>
                              <p className="text-xs text-gray-500">{item.time}</p>
                            </div>
                          </div>
                        ))}
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>

            {/* Özel Menü Oluşturucu */}
            <Card>
              <CardHeader>
                <CardTitle>🎨 Kendi Menünüzü Oluşturun</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                  {customMenuBuilder.map((category, index) => (
                    <div key={index} className="space-y-3">
                      <h4 className="font-semibold text-gray-900 border-b border-gray-200 pb-2">
                        {category.category}
                      </h4>
                      {category.options.map((option, optionIndex) => (
                        <div key={optionIndex} className="p-3 bg-gray-50 rounded-lg hover:bg-gray-100 cursor-pointer transition-colors">
                          <h5 className="font-medium text-sm">{option.name}</h5>
                          <div className="flex items-center gap-2 text-xs text-gray-500 mt-1">
                            <Clock className="h-3 w-3" />
                            {option.time}
                            <Badge className="text-xs" variant="outline">
                              {option.difficulty}
                            </Badge>
                          </div>
                        </div>
                      ))}
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Seçili Menüler */}
            <Card>
              <CardHeader>
                <CardTitle>📋 Seçili Menüler</CardTitle>
              </CardHeader>
              <CardContent>
                {selectedCombos.length === 0 ? (
                  <p className="text-gray-500 text-sm text-center py-4">
                    Henüz menü seçilmedi
                  </p>
                ) : (
                  <div className="space-y-3">
                    {selectedCombos.map((comboId) => {
                      const combo = menuCombinations.find(c => c.id === comboId);
                      return combo ? (
                        <div key={comboId} className="p-3 bg-food-50 rounded-lg border border-food-200">
                          <h5 className="font-medium text-food-800 text-sm">{combo.title}</h5>
                          <p className="text-food-600 text-xs">{combo.cost} - {combo.totalTime}</p>
                        </div>
                      ) : null;
                    })}
                    <Button className="w-full gradient-primary text-white mt-4">
                      Alışveriş Listesi Oluştur
                    </Button>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Menü İpuçları */}
            <Card className="bg-gradient-to-br from-blue-50 to-cyan-50">
              <CardHeader>
                <CardTitle className="text-blue-800">💡 Menü İpuçları</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3 text-sm text-blue-700">
                  <p>• Çorba ile ana yemek arasında 10 dk ara verin</p>
                  <p>• Ağır ana yemekten sonra hafif tatlı tercih edin</p>
                  <p>• Misafir menüsünde önceden hazırlanabilir tarifler seçin</p>
                  <p>• Malzeme listesini önceden hazırlayın</p>
                </div>
              </CardContent>
            </Card>

            {/* Popüler Kombinasyonlar */}
            <Card>
              <CardHeader>
                <CardTitle>🔥 Popüler Bu Hafta</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  {[
                    "Köfte + Pilav + Ayran",
                    "Balık + Salata + Bulgur",
                    "Tavuk Sote + Makarna",
                    "Çorba + Et + Tatlı"
                  ].map((combo, index) => (
                    <div key={index} className="text-sm p-2 hover:bg-gray-50 rounded cursor-pointer">
                      {index + 1}. {combo}
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

export default MenuPlanner;
