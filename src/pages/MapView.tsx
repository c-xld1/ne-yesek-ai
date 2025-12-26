import { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { MapPin, Search, Star, Navigation, Filter, ChefHat, Clock, Phone } from "lucide-react";
import mapboxgl from "mapbox-gl";
import "mapbox-gl/dist/mapbox-gl.css";

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
  phone?: string | null;
  description?: string | null;
}

const MapView = () => {
  const navigate = useNavigate();
  const mapContainer = useRef<HTMLDivElement>(null);
  const map = useRef<mapboxgl.Map | null>(null);
  const markersRef = useRef<mapboxgl.Marker[]>([]);
  
  const [chefs, setChefs] = useState<Chef[]>([]);
  const [selectedChef, setSelectedChef] = useState<Chef | null>(null);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [userLocation, setUserLocation] = useState<{ lat: number; lng: number } | null>(null);
  const [mapToken, setMapToken] = useState<string | null>(null);
  const [mapLoaded, setMapLoaded] = useState(false);

  useEffect(() => {
    fetchMapboxToken();
    fetchChefs();
    getUserLocation();
  }, []);

  const fetchMapboxToken = async () => {
    try {
      const { data, error } = await supabase.functions.invoke("get-mapbox-token");
      if (error) throw error;
      if (data?.token) {
        setMapToken(data.token);
      }
    } catch (error) {
      console.error("Error fetching mapbox token:", error);
    }
  };

  useEffect(() => {
    if (!mapContainer.current || !mapToken || map.current) return;

    mapboxgl.accessToken = mapToken;

    const defaultCenter: [number, number] = userLocation 
      ? [userLocation.lng, userLocation.lat] 
      : [28.9784, 41.0082]; // Istanbul default

    map.current = new mapboxgl.Map({
      container: mapContainer.current,
      style: "mapbox://styles/mapbox/streets-v12",
      center: defaultCenter,
      zoom: 12,
    });

    map.current.addControl(new mapboxgl.NavigationControl(), "top-right");
    
    map.current.on("load", () => {
      setMapLoaded(true);
    });

    return () => {
      markersRef.current.forEach(marker => marker.remove());
      map.current?.remove();
      map.current = null;
    };
  }, [mapToken, userLocation]);

  useEffect(() => {
    if (!map.current || !mapLoaded) return;

    // Clear existing markers
    markersRef.current.forEach(marker => marker.remove());
    markersRef.current = [];

    // Add user location marker
    if (userLocation) {
      const userMarker = new mapboxgl.Marker({ color: "#3b82f6" })
        .setLngLat([userLocation.lng, userLocation.lat])
        .setPopup(new mapboxgl.Popup().setHTML("<strong>Konumunuz</strong>"))
        .addTo(map.current);
      markersRef.current.push(userMarker);
    }

    // Add chef markers
    const filteredChefs = chefs.filter(chef => 
      chef.latitude && chef.longitude &&
      (chef.business_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
       (chef.city || "").toLowerCase().includes(searchQuery.toLowerCase()))
    );

    filteredChefs.forEach((chef) => {
      if (!chef.latitude || !chef.longitude || !map.current) return;

      const el = document.createElement("div");
      el.className = "chef-marker";
      el.innerHTML = `
        <div style="
          width: 40px;
          height: 40px;
          background: linear-gradient(135deg, #f97316, #ea580c);
          border-radius: 50%;
          border: 3px solid white;
          box-shadow: 0 4px 12px rgba(0,0,0,0.3);
          display: flex;
          align-items: center;
          justify-content: center;
          cursor: pointer;
          transition: transform 0.2s;
        ">
          <span style="font-size: 18px;">👨‍🍳</span>
        </div>
      `;
      el.style.cursor = "pointer";

      el.addEventListener("mouseenter", () => {
        el.firstElementChild?.setAttribute("style", 
          el.firstElementChild.getAttribute("style") + "transform: scale(1.2);"
        );
      });
      el.addEventListener("mouseleave", () => {
        el.firstElementChild?.setAttribute("style", 
          el.firstElementChild.getAttribute("style")?.replace("transform: scale(1.2);", "") || ""
        );
      });

      const popup = new mapboxgl.Popup({ offset: 25, closeButton: false })
        .setHTML(`
          <div style="padding: 8px; min-width: 200px;">
            <h3 style="font-weight: bold; font-size: 14px; margin-bottom: 4px;">${chef.business_name}</h3>
            <div style="display: flex; align-items: center; gap: 4px; color: #666; font-size: 12px; margin-bottom: 4px;">
              <span>⭐ ${chef.average_rating?.toFixed(1) || "4.5"}</span>
              <span>•</span>
              <span>${chef.city || "İstanbul"}</span>
            </div>
            <div style="color: #666; font-size: 12px;">
              Min: ₺${chef.minimum_order_amount || 0}
            </div>
          </div>
        `);

      const marker = new mapboxgl.Marker(el)
        .setLngLat([chef.longitude, chef.latitude])
        .setPopup(popup)
        .addTo(map.current);

      el.addEventListener("click", () => {
        setSelectedChef(chef);
      });

      markersRef.current.push(marker);
    });
  }, [chefs, mapLoaded, searchQuery, userLocation]);

  const getUserLocation = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const loc = {
            lat: position.coords.latitude,
            lng: position.coords.longitude,
          };
          setUserLocation(loc);
          if (map.current) {
            map.current.flyTo({ center: [loc.lng, loc.lat], zoom: 13 });
          }
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

      const mappedChefs: Chef[] = (data || []).map((chef: any) => ({
        id: chef.id,
        business_name: chef.business_name,
        city: chef.city,
        district: chef.district || "",
        average_rating: chef.rating || 4.5,
        total_reviews: chef.total_orders || 0,
        minimum_order_amount: chef.min_order_amount || 0,
        delivery_radius: chef.delivery_radius,
        avatar_url: chef.avatar_url,
        is_available: chef.is_available,
        address: chef.address,
        latitude: chef.latitude,
        longitude: chef.longitude,
        phone: chef.phone,
        description: chef.description,
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

  const flyToChef = (chef: Chef) => {
    if (chef.latitude && chef.longitude && map.current) {
      map.current.flyTo({
        center: [chef.longitude, chef.latitude],
        zoom: 15,
        duration: 1500,
      });
      setSelectedChef(chef);
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      <div className="relative">
        {/* Search Bar Overlay */}
        <div className="absolute top-4 left-1/2 transform -translate-x-1/2 z-10 w-full max-w-md px-4">
          <Card className="shadow-lg border-0 bg-background/95 backdrop-blur-sm">
            <CardContent className="p-3">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  type="text"
                  placeholder="Şef veya bölge ara..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10 border-0 focus-visible:ring-0 bg-transparent"
                />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Map Container */}
        <div className="relative h-[500px]">
          {mapToken ? (
            <div ref={mapContainer} className="absolute inset-0" />
          ) : (
            <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-secondary/5 flex items-center justify-center">
              <div className="text-center">
                <div className="animate-spin rounded-full h-12 w-12 border-4 border-primary border-t-transparent mx-auto mb-4" />
                <p className="text-muted-foreground">Harita yükleniyor...</p>
              </div>
            </div>
          )}

          {/* Location Button */}
          <button
            onClick={getUserLocation}
            className="absolute bottom-4 right-4 bg-background p-3 rounded-full shadow-lg hover:shadow-xl transition-all z-10 border"
            title="Konumumu Bul"
          >
            <Navigation className="h-5 w-5 text-primary" />
          </button>

          {/* Selected Chef Card */}
          {selectedChef && (
            <Card className="absolute bottom-4 left-4 right-20 max-w-md z-10 shadow-xl border-0 bg-background/95 backdrop-blur-sm">
              <CardContent className="p-4">
                <div className="flex items-start gap-4">
                  <div className="w-16 h-16 rounded-xl overflow-hidden bg-muted flex-shrink-0">
                    {selectedChef.avatar_url ? (
                      <img
                        src={selectedChef.avatar_url}
                        alt={selectedChef.business_name}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-primary to-primary/80 text-primary-foreground text-xl font-bold">
                        {selectedChef.business_name.charAt(0)}
                      </div>
                    )}
                  </div>

                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between">
                      <div>
                        <h3 className="font-bold text-foreground truncate">
                          {selectedChef.business_name}
                        </h3>
                        <div className="flex items-center gap-2 text-sm text-muted-foreground">
                          <MapPin className="h-3 w-3" />
                          <span className="truncate">
                            {selectedChef.district ? `${selectedChef.district}, ` : ""}{selectedChef.city}
                          </span>
                        </div>
                      </div>
                      <button
                        onClick={() => setSelectedChef(null)}
                        className="text-muted-foreground hover:text-foreground"
                      >
                        ✕
                      </button>
                    </div>

                    <div className="flex items-center gap-3 mt-2">
                      <div className="flex items-center gap-1">
                        <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                        <span className="text-sm font-medium">{selectedChef.average_rating?.toFixed(1)}</span>
                      </div>
                      {selectedChef.is_available && (
                        <Badge variant="secondary" className="text-xs bg-green-100 text-green-700">Müsait</Badge>
                      )}
                    </div>

                    <div className="flex gap-2 mt-3">
                      <Button
                        size="sm"
                        className="flex-1"
                        onClick={() => navigate(`/sef/${selectedChef.id}`)}
                      >
                        <ChefHat className="h-4 w-4 mr-1" />
                        Profile Git
                      </Button>
                      {selectedChef.phone && (
                        <Button size="sm" variant="outline">
                          <Phone className="h-4 w-4" />
                        </Button>
                      )}
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}
        </div>

        {/* Chefs List */}
        <div className="max-w-7xl mx-auto px-4 py-8">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold text-foreground">
              Yakınımdaki Şefler ({filteredChefs.length})
            </h2>
            <Button variant="outline" size="sm">
              <Filter className="h-4 w-4 mr-2" />
              Filtrele
            </Button>
          </div>

          {loading ? (
            <div className="text-center py-12">
              <div className="animate-spin rounded-full h-12 w-12 border-b-4 border-primary mx-auto"></div>
              <p className="mt-4 text-muted-foreground">Şefler yükleniyor...</p>
            </div>
          ) : filteredChefs.length === 0 ? (
            <Card className="text-center py-12">
              <CardContent>
                <ChefHat className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                <p className="text-muted-foreground">Şef bulunamadı</p>
              </CardContent>
            </Card>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredChefs.map((chef) => (
                <Card
                  key={chef.id}
                  className={`cursor-pointer transition-all hover:shadow-lg ${
                    selectedChef?.id === chef.id ? "ring-2 ring-primary" : ""
                  }`}
                  onClick={() => flyToChef(chef)}
                >
                  <CardContent className="p-4">
                    <div className="flex items-start gap-4">
                      <div className="w-16 h-16 rounded-xl overflow-hidden bg-muted flex-shrink-0">
                        {chef.avatar_url ? (
                          <img
                            src={chef.avatar_url}
                            alt={chef.business_name}
                            className="w-full h-full object-cover"
                          />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-primary to-primary/80 text-primary-foreground text-xl font-bold">
                            {chef.business_name.charAt(0)}
                          </div>
                        )}
                      </div>

                      <div className="flex-1 min-w-0">
                        <h3 className="font-semibold text-foreground mb-1 truncate">
                          {chef.business_name}
                        </h3>
                        <div className="flex items-center gap-2 text-sm text-muted-foreground mb-2">
                          <MapPin className="h-3 w-3" />
                          <span className="truncate">
                            {chef.district ? `${chef.district}, ` : ""}{chef.city}
                          </span>
                        </div>
                        <div className="flex items-center gap-3 mb-2">
                          <div className="flex items-center gap-1">
                            <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                            <span className="text-sm font-medium">{chef.average_rating?.toFixed(1)}</span>
                            <span className="text-xs text-muted-foreground">({chef.total_reviews})</span>
                          </div>
                          {chef.is_available && (
                            <Badge variant="secondary" className="text-xs">Müsait</Badge>
                          )}
                        </div>
                        <div className="flex items-center justify-between text-xs text-muted-foreground">
                          <span>Min: ₺{chef.minimum_order_amount}</span>
                          <span>Teslimat: {chef.delivery_radius || 5} km</span>
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
