import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { MapPin, Clock, Star, Filter } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { calculateDistance, getEstimatedDeliveryTime, getUserLocation } from "@/utils/locationUtils";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

interface ReadyMeal {
  id: string;
  name: string;
  description: string;
  price: number;
  servings: number;
  preparation_time: number;
  category: string;
  ready_until: string;
  chef_profiles: {
    id: string;
    business_name: string;
    city: string;
    latitude: number;
    longitude: number;
    rating: number;
  };
  distance?: number;
}

const InstantDelivery = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [meals, setMeals] = useState<ReadyMeal[]>([]);
  const [loading, setLoading] = useState(true);
  const [userLocation, setUserLocation] = useState<{ lat: number; lng: number } | null>(null);
  const [sortBy, setSortBy] = useState<"distance" | "rating" | "newest">("distance");

  useEffect(() => {
    initLocation();
  }, []);

  useEffect(() => {
    if (userLocation) {
      fetchReadyMeals();
    }
  }, [userLocation, sortBy]);

  const initLocation = async () => {
    const location = await getUserLocation();
    if (location) {
      setUserLocation(location);
    } else {
      toast({
        title: "Konum Erişimi",
        description: "Sana en yakın yemekleri göstermek için konumunu paylaş",
        variant: "destructive",
      });
      setLoading(false);
    }
  };

  const fetchReadyMeals = async () => {
    try {
      const { data, error } = await supabase
        .from("meals")
        .select(`
          *,
          chef_profiles:chef_id (
            id,
            business_name,
            city,
            latitude,
            longitude,
            rating
          )
        `)
        .eq("ready_now", true)
        .eq("is_available", true)
        .gte("ready_until", new Date().toISOString());

      if (error) throw error;

      let mealsWithDistance = (data || []).map((meal: any) => {
        const distance = userLocation && meal.chef_profiles?.latitude && meal.chef_profiles?.longitude
          ? calculateDistance(
              userLocation.lat,
              userLocation.lng,
              meal.chef_profiles.latitude,
              meal.chef_profiles.longitude
            )
          : 999;
        return { ...meal, distance };
      });

      // Sort based on selection
      if (sortBy === "distance") {
        mealsWithDistance.sort((a, b) => (a.distance || 999) - (b.distance || 999));
      } else if (sortBy === "rating") {
        mealsWithDistance.sort((a, b) => (b.chef_profiles?.rating || 0) - (a.chef_profiles?.rating || 0));
      } else {
        mealsWithDistance.sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());
      }

      setMeals(mealsWithDistance.filter(m => (m.distance || 999) < 50)); // Max 50km radius
    } catch (error: any) {
      toast({
        variant: "destructive",
        title: "Hata",
        description: error.message,
      });
    } finally {
      setLoading(false);
    }
  };

  const handleOrder = async (meal: ReadyMeal) => {
    if (!user) {
      toast({
        title: "Giriş Gerekli",
        description: "Sipariş vermek için giriş yapmalısınız",
        variant: "destructive",
      });
      return;
    }

    try {
      const { data: order, error } = await supabase
        .from("orders")
        .insert([{
          customer_id: user.id,
          chef_id: meal.chef_profiles.id,
          total_amount: meal.price,
          delivery_type: "instant",
          status: "pending",
        }])
        .select()
        .single();

      if (error) throw error;

      await supabase.from("order_items").insert([{
        order_id: order.id,
        meal_id: meal.id,
        quantity: 1,
        price: meal.price,
      }]);

      toast({
        title: "Sipariş Oluşturuldu! 🎉",
        description: `${meal.chef_profiles.business_name} siparişinizi hazırlayacak`,
      });
    } catch (error: any) {
      toast({
        variant: "destructive",
        title: "Hata",
        description: error.message,
      });
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 via-white to-rose-50">
      <Navbar />

      <div className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-4xl font-bold bg-gradient-to-r from-orange-600 to-rose-600 bg-clip-text text-transparent">
            🍽️ Hemen Teslimat
          </h1>
          <p className="text-muted-foreground mt-2">
            Sana en yakın hazır yemekler - hemen teslim!
          </p>
        </div>

        <div className="flex justify-between items-center mb-6">
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <MapPin className="h-4 w-4" />
            <span>{userLocation ? "Konumunuza göre sıralandı" : "Konum bekleniyor..."}</span>
          </div>
          
          <Select value={sortBy} onValueChange={(v: any) => setSortBy(v)}>
            <SelectTrigger className="w-[180px]">
              <Filter className="h-4 w-4 mr-2" />
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="distance">En Yakın</SelectItem>
              <SelectItem value="rating">En Beğenilen</SelectItem>
              <SelectItem value="newest">En Yeni</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {loading ? (
          <div className="text-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-500 mx-auto"></div>
            <p className="mt-4 text-muted-foreground">Yükleniyor...</p>
          </div>
        ) : meals.length === 0 ? (
          <Card>
            <CardContent className="py-12 text-center">
              <p className="text-muted-foreground">Şu anda hazır yemek bulunmuyor.</p>
              <p className="text-sm text-muted-foreground mt-2">Daha sonra tekrar kontrol edin!</p>
            </CardContent>
          </Card>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {meals.map((meal) => (
              <Card key={meal.id} className="hover:shadow-lg transition-shadow">
                <CardHeader>
                  <div className="flex justify-between items-start mb-2">
                    <CardTitle className="text-lg">{meal.name}</CardTitle>
                    <Badge variant="secondary" className="bg-green-100 text-green-700">
                      Hazır
                    </Badge>
                  </div>
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <MapPin className="h-4 w-4" />
                    <span>{meal.chef_profiles?.business_name}</span>
                  </div>
                </CardHeader>
                
                <CardContent className="space-y-4">
                  <p className="text-sm text-muted-foreground line-clamp-2">
                    {meal.description}
                  </p>

                  <div className="flex justify-between items-center text-sm">
                    <div className="flex items-center gap-1">
                      <Clock className="h-4 w-4" />
                      {meal.distance ? getEstimatedDeliveryTime(meal.distance) : "-"}
                    </div>
                    <div className="flex items-center gap-1">
                      <span>{meal.distance?.toFixed(1)} km</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                      {meal.chef_profiles?.rating || 5.0}
                    </div>
                  </div>

                  <div className="flex items-center justify-between pt-2 border-t">
                    <span className="text-2xl font-bold text-orange-600">₺{meal.price}</span>
                    <Button
                      onClick={() => handleOrder(meal)}
                      className="bg-gradient-to-r from-orange-500 to-rose-500"
                    >
                      Sipariş Ver
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>

      <Footer />
    </div>
  );
};

export default InstantDelivery;
