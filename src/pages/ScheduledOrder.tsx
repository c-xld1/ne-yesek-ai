import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Calendar } from "@/components/ui/calendar";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { CalendarDays, Clock, MapPin, Star } from "lucide-react";
import { getUserLocation, calculateDistance } from "@/utils/locationUtils";

const ScheduledOrder = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [date, setDate] = useState<Date>();
  const [time, setTime] = useState("");
  const [servings, setServings] = useState("4");
  const [mealDescription, setMealDescription] = useState("");
  const [specialRequests, setSpecialRequests] = useState("");
  const [deliveryAddress, setDeliveryAddress] = useState("");
  const [availableChefs, setAvailableChefs] = useState<any[]>([]);
  const [selectedChef, setSelectedChef] = useState("");
  const [loading, setLoading] = useState(false);
  const [userLocation, setUserLocation] = useState<{ lat: number; lng: number } | null>(null);

  useEffect(() => {
    if (!user) {
      navigate("/giris-yap");
      return;
    }
    initLocation();
  }, [user, navigate]);

  useEffect(() => {
    if (date && userLocation) {
      fetchAvailableChefs();
    }
  }, [date, userLocation]);

  const initLocation = async () => {
    const location = await getUserLocation();
    setUserLocation(location);
  };

  const fetchAvailableChefs = async () => {
    if (!date) return;

    const dayOfWeek = date.getDay();
    const { data, error } = await supabase
      .from("chef_profiles")
      .select(`
        *,
        chef_availability!inner(*)
      `)
      .eq("is_active", true)
      .eq("chef_availability.day_of_week", dayOfWeek)
      .eq("chef_availability.is_active", true);

    if (error) {
      console.error("Error fetching chefs:", error);
      return;
    }

    let chefsWithDistance = (data || []).map((chef: any) => {
      const distance = userLocation && chef.latitude && chef.longitude
        ? calculateDistance(userLocation.lat, userLocation.lng, chef.latitude, chef.longitude)
        : 999;
      return { ...chef, distance };
    });

    chefsWithDistance.sort((a, b) => (a.distance || 999) - (b.distance || 999));
    setAvailableChefs(chefsWithDistance.filter(c => (c.distance || 999) < 50));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!date || !time || !selectedChef || !mealDescription) {
      toast({
        title: "Eksik Bilgi",
        description: "Lütfen tüm alanları doldurun",
        variant: "destructive",
      });
      return;
    }

    setLoading(true);

    try {
      const estimatedAmount = parseInt(servings) * 50; // Rough estimate

      const { error } = await supabase.from("scheduled_orders").insert([{
        customer_id: user!.id,
        chef_id: selectedChef,
        meal_description: mealDescription,
        servings: parseInt(servings),
        scheduled_date: date.toISOString().split('T')[0],
        scheduled_time: time,
        total_amount: estimatedAmount,
        special_requests: specialRequests,
        delivery_address: deliveryAddress,
        status: "pending",
      }]);

      if (error) throw error;

      toast({
        title: "Randevu Talebi Gönderildi! 📅",
        description: "Şef en kısa sürede geri dönüş yapacak",
      });

      navigate("/");
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

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 via-white to-rose-50">
      <Navbar />

      <div className="container mx-auto px-4 py-8 max-w-4xl">
        <div className="mb-8">
          <h1 className="text-4xl font-bold bg-gradient-to-r from-orange-600 to-rose-600 bg-clip-text text-transparent">
            📅 Randevulu Sipariş
          </h1>
          <p className="text-muted-foreground mt-2">
            Özel etkinlikleriniz için önceden sipariş verin
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Tarih ve Saat Seçimi</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <Label>Tarih Seçin *</Label>
                  <Calendar
                    mode="single"
                    selected={date}
                    onSelect={setDate}
                    disabled={(date) => date < new Date()}
                    className="rounded-md border mt-2"
                  />
                </div>
                
                <div className="space-y-4">
                  <div>
                    <Label htmlFor="time">Saat *</Label>
                    <Input
                      id="time"
                      type="time"
                      value={time}
                      onChange={(e) => setTime(e.target.value)}
                      required
                    />
                  </div>

                  <div>
                    <Label htmlFor="servings">Kişi Sayısı *</Label>
                    <Input
                      id="servings"
                      type="number"
                      min="1"
                      value={servings}
                      onChange={(e) => setServings(e.target.value)}
                      required
                    />
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Sipariş Detayları</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label htmlFor="meal">Yemek Açıklaması *</Label>
                <Textarea
                  id="meal"
                  placeholder="Örn: 4 kişilik kısır, sarma, kek menüsü"
                  value={mealDescription}
                  onChange={(e) => setMealDescription(e.target.value)}
                  rows={3}
                  required
                />
              </div>

              <div>
                <Label htmlFor="special">Özel İstekler</Label>
                <Textarea
                  id="special"
                  placeholder="Alerji, diyet tercihleri vb."
                  value={specialRequests}
                  onChange={(e) => setSpecialRequests(e.target.value)}
                  rows={2}
                />
              </div>

              <div>
                <Label htmlFor="address">Teslimat Adresi *</Label>
                <Input
                  id="address"
                  placeholder="Tam adresiniz"
                  value={deliveryAddress}
                  onChange={(e) => setDeliveryAddress(e.target.value)}
                  required
                />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Şef Seçimi ({availableChefs.length} müsait)</CardTitle>
            </CardHeader>
            <CardContent>
              {availableChefs.length === 0 ? (
                <p className="text-muted-foreground text-center py-4">
                  {date ? "Bu tarihte müsait şef bulunamadı" : "Önce tarih seçin"}
                </p>
              ) : (
                <div className="space-y-3">
                  {availableChefs.map((chef) => (
                    <div
                      key={chef.id}
                      className={`p-4 border rounded-lg cursor-pointer transition-all ${
                        selectedChef === chef.id
                          ? "border-orange-500 bg-orange-50"
                          : "hover:border-orange-300"
                      }`}
                      onClick={() => setSelectedChef(chef.id)}
                    >
                      <div className="flex justify-between items-start">
                        <div>
                          <h3 className="font-semibold">{chef.business_name}</h3>
                          <div className="flex items-center gap-2 text-sm text-muted-foreground mt-1">
                            <MapPin className="h-3 w-3" />
                            {chef.city} • {chef.distance?.toFixed(1)} km
                          </div>
                        </div>
                        <div className="flex items-center gap-1">
                          <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                          {chef.rating || 5.0}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>

          <Button
            type="submit"
            className="w-full bg-gradient-to-r from-orange-500 to-rose-500"
            disabled={loading || !selectedChef}
          >
            {loading ? "Gönderiliyor..." : "Randevu Talebi Gönder"}
          </Button>
        </form>
      </div>

      <Footer />
    </div>
  );
};

export default ScheduledOrder;
