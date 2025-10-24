import { useEffect, useRef, useState } from "react";
import Navbar from "@/components/Navbar";
import BottomNav from "@/components/BottomNav";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Navigation, Phone, Star, Clock } from "lucide-react";
import mapboxgl from 'mapbox-gl';
import 'mapbox-gl/dist/mapbox-gl.css';
import { supabase } from "@/integrations/supabase/client";

const MapView = () => {
  const mapContainer = useRef<HTMLDivElement>(null);
  const map = useRef<mapboxgl.Map | null>(null);
  const [selectedChef, setSelectedChef] = useState<any>(null);
  const [chefs, setChefs] = useState<any[]>([]);
  const [mapboxToken, setMapboxToken] = useState("");
  const [loadingToken, setLoadingToken] = useState(true);

  useEffect(() => {
    const fetchChefs = async () => {
      const { data } = await supabase
        .from('chef_profiles')
        .select(`
          *,
          profiles!chef_profiles_user_id_fkey(username, fullname, avatar_url)
        `)
        .eq('is_active', true);

      if (data) setChefs(data);
    };

    const fetchMapboxToken = async () => {
      const { data } = await supabase.functions.invoke('get-mapbox-token');
      if (data?.token) {
        setMapboxToken(data.token);
      }
      setLoadingToken(false);
    };

    fetchChefs();
    fetchMapboxToken();
  }, []);

  const initializeMap = () => {
    if (!mapContainer.current || !mapboxToken) return;

    mapboxgl.accessToken = mapboxToken;
    
    map.current = new mapboxgl.Map({
      container: mapContainer.current,
      style: 'mapbox://styles/mapbox/streets-v12',
      center: [35.2433, 38.9637], // Türkiye merkezi
      zoom: 6,
    });

    map.current.addControl(new mapboxgl.NavigationControl());

    // Add chef markers
    chefs.forEach((chef) => {
      if (chef.latitude && chef.longitude) {
        const el = document.createElement('div');
        el.className = 'chef-marker';
        el.style.backgroundColor = chef.is_available ? '#22c55e' : '#ef4444';
        el.style.width = '30px';
        el.style.height = '30px';
        el.style.borderRadius = '50%';
        el.style.cursor = 'pointer';
        el.style.border = '3px solid white';
        el.style.boxShadow = '0 2px 4px rgba(0,0,0,0.3)';

        new mapboxgl.Marker(el)
          .setLngLat([chef.longitude, chef.latitude])
          .addTo(map.current!);

        el.addEventListener('click', () => {
          setSelectedChef(chef);
          map.current?.flyTo({
            center: [chef.longitude, chef.latitude],
            zoom: 14
          });
        });
      }
    });
  };

  useEffect(() => {
    if (mapboxToken && chefs.length > 0) {
      initializeMap();
    }

    return () => {
      map.current?.remove();
    };
  }, [mapboxToken, chefs]);

  return (
    <div className="min-h-screen bg-background pb-20">
      <Navbar />
      
      <div className="container mx-auto px-4 py-6 space-y-4">
        <div className="space-y-4">
          <h1 className="text-3xl font-bold">Yakınımdaki Şefler</h1>
          
          {loadingToken ? (
            <Card className="p-4">
              <p className="text-sm text-muted-foreground">Harita yükleniyor...</p>
            </Card>
          ) : !mapboxToken ? (
            <Card className="p-4 space-y-3">
              <p className="text-sm text-muted-foreground">
                Harita özelliği henüz yapılandırılmamış. Lütfen yöneticiyle iletişime geçin.
              </p>
            </Card>
          ) : null}

          <div className="flex gap-3">
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 rounded-full bg-green-500 border-2 border-white" />
              <span className="text-sm">Müsait</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 rounded-full bg-yellow-500 border-2 border-white" />
              <span className="text-sm">Randevulu</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 rounded-full bg-red-500 border-2 border-white" />
              <span className="text-sm">Kapalı</span>
            </div>
          </div>
        </div>

        <div className="grid lg:grid-cols-3 gap-4">
          <div className="lg:col-span-2">
            <div
              ref={mapContainer}
              className="w-full h-[500px] rounded-lg border shadow-sm"
            />
          </div>

          <div className="space-y-4">
            {selectedChef ? (
              <Card className="p-6 space-y-4">
                <div className="flex items-start gap-3">
                  <img
                    src={selectedChef.profiles?.avatar_url || "/placeholder.svg"}
                    alt={selectedChef.business_name}
                    className="w-16 h-16 rounded-full object-cover"
                  />
                  <div className="flex-1">
                    <h3 className="font-semibold text-lg">
                      {selectedChef.business_name}
                    </h3>
                    <p className="text-sm text-muted-foreground">
                      {selectedChef.profiles?.fullname}
                    </p>
                    <div className="flex items-center gap-1 mt-1">
                      <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                      <span className="text-sm font-medium">
                        {selectedChef.rating || "Yeni"}
                      </span>
                    </div>
                  </div>
                </div>

                <p className="text-sm text-muted-foreground">
                  {selectedChef.description}
                </p>

                <div className="space-y-2 text-sm">
                  <div className="flex items-center gap-2">
                    <Navigation className="h-4 w-4" />
                    <span>{selectedChef.city}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Phone className="h-4 w-4" />
                    <span>{selectedChef.phone}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Clock className="h-4 w-4" />
                    <span>
                      {selectedChef.is_available ? "Şu an müsait" : "Randevulu"}
                    </span>
                  </div>
                </div>

                <Button 
                  className="w-full"
                  onClick={() => window.location.href = `/sef/${selectedChef.id}`}
                >
                  Menüyü Gör
                </Button>
              </Card>
            ) : (
              <Card className="p-6 text-center text-muted-foreground">
                Haritadan bir şef seçin
              </Card>
            )}
          </div>
        </div>
      </div>

      <BottomNav />
    </div>
  );
};

export default MapView;
