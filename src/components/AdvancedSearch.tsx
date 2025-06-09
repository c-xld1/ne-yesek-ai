
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Search, Filter, Clock, Users, Zap, Leaf, Baby, DollarSign, Cloud, Sun, CloudRain } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

const AdvancedSearch = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedFilters, setSelectedFilters] = useState<string[]>([]);
  const [weatherFilter, setWeatherFilter] = useState("");
  const { toast } = useToast();

  const filterOptions = [
    { id: "vegan", label: "Vegan", icon: Leaf, color: "bg-green-100 text-green-800" },
    { id: "quick", label: "15 Dakikada", icon: Zap, color: "bg-yellow-100 text-yellow-800" },
    { id: "kids", label: "Çocuk Menüsü", icon: Baby, color: "bg-pink-100 text-pink-800" },
    { id: "budget", label: "Az Bütçe", icon: DollarSign, color: "bg-blue-100 text-blue-800" },
    { id: "single", label: "1 Malzemeli", icon: Clock, color: "bg-purple-100 text-purple-800" },
    { id: "fit", label: "Fit", icon: Users, color: "bg-orange-100 text-orange-800" }
  ];

  const weatherOptions = [
    { id: "sunny", label: "Güneşliyse Serinletici", icon: Sun, color: "bg-yellow-100 text-yellow-800" },
    { id: "rainy", label: "Yağmurluysa Sıcak", icon: CloudRain, color: "bg-blue-100 text-blue-800" },
    { id: "cloudy", label: "Bulutluysa Hafif", icon: Cloud, color: "bg-gray-100 text-gray-800" }
  ];

  const toggleFilter = (filterId: string) => {
    setSelectedFilters(prev => 
      prev.includes(filterId) 
        ? prev.filter(id => id !== filterId)
        : [...prev, filterId]
    );
  };

  const handleSearch = () => {
    toast({
      title: "🔍 Akıllı arama yapılıyor",
      description: `${selectedFilters.length} filtre ile ${searchTerm || 'tüm tarifler'} aranıyor...`,
    });
  };

  const clearFilters = () => {
    setSelectedFilters([]);
    setWeatherFilter("");
    setSearchTerm("");
  };

  return (
    <Card className="mb-8">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Search className="h-5 w-5" />
          Akıllı Tarif Arama
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Ana Arama */}
        <div className="flex gap-3">
          <Input
            placeholder="Malzeme, tarif adı veya kategori ara..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="flex-1"
          />
          <Button onClick={handleSearch} className="gradient-primary text-white">
            <Search className="h-4 w-4 mr-2" />
            Ara
          </Button>
        </div>

        {/* Filtreler */}
        <div>
          <h4 className="font-semibold mb-3 flex items-center gap-2">
            <Filter className="h-4 w-4" />
            Hızlı Filtreler
          </h4>
          <div className="flex flex-wrap gap-2">
            {filterOptions.map((filter) => (
              <Badge
                key={filter.id}
                className={`cursor-pointer transition-all duration-200 hover:scale-105 ${
                  selectedFilters.includes(filter.id) 
                    ? filter.color 
                    : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                }`}
                onClick={() => toggleFilter(filter.id)}
              >
                <filter.icon className="h-3 w-3 mr-1" />
                {filter.label}
              </Badge>
            ))}
          </div>
        </div>

        {/* Hava Durumu Filtreleri */}
        <div>
          <h4 className="font-semibold mb-3">🌤️ Hava Durumuna Göre Öneriler</h4>
          <div className="flex flex-wrap gap-2">
            {weatherOptions.map((weather) => (
              <Badge
                key={weather.id}
                className={`cursor-pointer transition-all duration-200 hover:scale-105 ${
                  weatherFilter === weather.id 
                    ? weather.color 
                    : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                }`}
                onClick={() => setWeatherFilter(weatherFilter === weather.id ? "" : weather.id)}
              >
                <weather.icon className="h-3 w-3 mr-1" />
                {weather.label}
              </Badge>
            ))}
          </div>
        </div>

        {/* Seçili Filtreler */}
        {(selectedFilters.length > 0 || weatherFilter) && (
          <div className="border-t pt-4">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-medium">Aktif Filtreler:</span>
              <Button variant="ghost" size="sm" onClick={clearFilters}>
                Temizle
              </Button>
            </div>
            <div className="flex flex-wrap gap-2">
              {selectedFilters.map((filterId) => {
                const filter = filterOptions.find(f => f.id === filterId);
                return filter ? (
                  <Badge key={filterId} className={filter.color}>
                    <filter.icon className="h-3 w-3 mr-1" />
                    {filter.label}
                  </Badge>
                ) : null;
              })}
              {weatherFilter && (
                <Badge className={weatherOptions.find(w => w.id === weatherFilter)?.color}>
                  {weatherOptions.find(w => w.id === weatherFilter)?.label}
                </Badge>
              )}
            </div>
          </div>
        )}

        {/* Popüler Aramalar */}
        <div>
          <h4 className="font-semibold mb-3">🔥 Popüler Aramalar</h4>
          <div className="flex flex-wrap gap-2">
            {["tavuk sote", "mercimek çorbası", "çikolatalı kek", "kahvaltı", "vegan"].map((term) => (
              <Badge 
                key={term}
                variant="outline" 
                className="cursor-pointer hover:bg-gray-100"
                onClick={() => setSearchTerm(term)}
              >
                {term}
              </Badge>
            ))}
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default AdvancedSearch;
