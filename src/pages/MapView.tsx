import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { MapPin, Search, Star, Navigation, Filter } from "lucide-react";

interface Chef {
  id: string;
  business_name: string;
  city: string | null;
  district?: string;
  average_rating?: number;
  total_reviews?: number;
  minimum_order_amount?: number;
  delivery_radius: number | null;
  avatar_url?: string;
  is_available: boolean | null;
  address?: string | null;
  latitude?: number | null;
  longitude?: number | null;
}

const MapView = () => {
  const navigate = useNavigate();
  const [chefs, setChefs] = useState<Chef[]>([]);
  const [selectedChef, setSelectedChef] = useState<Chef | null>(null);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [userLocation, setUserLocation] = useState<{ lat: number; lng: number } | null>(null);

  useEffect(() => {
    fetchChefs();
    getUserLocation();
  }, []);

  const getUserLocation = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setUserLocation({
            lat: position.coords.latitude,
            lng: position.coords.longitude,
          });
        },
        (error) => {
          console.error("Location error:", error);
        }
      );
    }
  };

  const fetchChefs = async () => {
    try {
      const { data } = await supabase
        .from("chef_profiles")
        .select("*")
        .eq("is_active", true);

      // Map data to Chef interface with defaults
      const mappedChefs: Chef[] = (data || []).map((chef: any) => ({
        id: chef.id,
        business_name: chef.business_name,
        city: chef.city,
        district: chef.district || "",
        average_rating: chef.rating || 0,
        total_reviews: chef.total_orders || 0,
        minimum_order_amount: chef.min_order_amount || 0,
        delivery_radius: chef.delivery_radius,
        avatar_url: chef.avatar_url,
        is_available: chef.is_available,
        address: chef.address,
        latitude: chef.latitude,
        longitude: chef.longitude,
      }));

      setChefs(mappedChefs);
    } catch (error) {
      console.error("Error fetching chefs:", error);
    } finally {
      setLoading(false);
    }
  };

  const filteredChefs = chefs.filter(chef =>
    chef.business_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    (chef.city || "").toLowerCase().includes(searchQuery.toLowerCase()) ||
    (chef.district || "").toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />

      <div className="relative">
        {/* Search Bar Overlay */}
        <div className="absolute top-4 left-1/2 transform -translate-x-1/2 z-10 w-full max-w-md px-4">
          <Card className="shadow-lg">
            <CardContent className="p-3">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                <Input
                  type="text"
                  placeholder="Şef veya bölge ara..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10 border-0 focus-visible:ring-0"
                />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Map Placeholder */}
        <div className="relative bg-gradient-to-br from-blue-50 to-gray-100 h-[500px] flex items-center justify-center">
          <div className="text-center">
            <MapPin className="h-16 w-16 mx-auto text-orange-500 mb-4" />
            <h2 className="text-xl font-semibold text-gray-700 mb-2">Harita Görünümü</h2>
            <p className="text-gray-500">Yakınımdaki şefler haritada gösterilecek</p>
            {userLocation && (
              <p className="text-sm text-gray-400 mt-2">
                Konumunuz: {userLocation.lat.toFixed(4)}, {userLocation.lng.toFixed(4)}
              </p>
            )}
          </div>

          {/* Location Button */}
          <button
            onClick={getUserLocation}
            className="absolute bottom-4 right-4 bg-white p-3 rounded-full shadow-lg hover:shadow-xl transition-shadow"
            title="Konumumu Bul"
          >
            <Navigation className="h-5 w-5 text-orange-500" />
          </button>
        </div>

        {/* Chefs List */}
        <div className="max-w-7xl mx-auto px-4 py-8">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold text-gray-900">
              Yakınımdaki Şefler ({filteredChefs.length})
            </h2>
            <Button variant="outline" size="sm">
              <Filter className="h-4 w-4 mr-2" />
              Filtrele
            </Button>
          </div>

          {loading ? (
            <div className="text-center py-12">
              <div className="animate-spin rounded-full h-12 w-12 border-b-4 border-orange-500 mx-auto"></div>
              <p className="mt-4 text-gray-600">Şefler yükleniyor...</p>
            </div>
          ) : filteredChefs.length === 0 ? (
            <Card className="text-center py-12">
              <CardContent>
                <p className="text-gray-500">Şef bulunamadı</p>
              </CardContent>
            </Card>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredChefs.map((chef) => (
                <Card
                  key={chef.id}
                  className="cursor-pointer hover:shadow-lg transition-shadow"
                  onClick={() => navigate(`/sef/${chef.id}`)}
                >
                  <CardContent className="p-4">
                    <div className="flex items-start gap-4">
                      <div className="w-16 h-16 rounded-lg overflow-hidden bg-gray-100 flex-shrink-0">
                        {chef.avatar_url ? (
                          <img
                            src={chef.avatar_url}
                            alt={chef.business_name}
                            className="w-full h-full object-cover"
                          />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center bg-orange-500 text-white text-xl font-bold">
                            {chef.business_name.charAt(0)}
                          </div>
                        )}
                      </div>

                      <div className="flex-1 min-w-0">
                        <h3 className="font-semibold text-gray-900 mb-1 truncate">
                          {chef.business_name}
                        </h3>
                        <div className="flex items-center gap-2 text-sm text-gray-500 mb-2">
                          <MapPin className="h-3 w-3" />
                          <span className="truncate">
                            {chef.district}, {chef.city}
                          </span>
                        </div>
                        <div className="flex items-center gap-3 mb-2">
                          <div className="flex items-center gap-1">
                            <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                            <span className="text-sm font-medium">{chef.average_rating}</span>
                            <span className="text-xs text-gray-400">({chef.total_reviews})</span>
                          </div>
                          {chef.is_available && (
                            <Badge variant="secondary" className="text-xs">Müsait</Badge>
                          )}
                        </div>
                        <div className="flex items-center justify-between text-xs text-gray-500">
                          <span>Min: {chef.minimum_order_amount} ₺</span>
                          <span>Teslimat: {chef.delivery_radius} km</span>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default MapView;
