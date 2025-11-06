import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import Navbar from "@/components/Navbar";
import BottomNav from "@/components/BottomNav";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Star, MapPin, Clock, Phone, ShoppingCart, Heart } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

const ChefProfile = () => {
  const { id } = useParams();
  const { user } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [chef, setChef] = useState<any>(null);
  const [meals, setMeals] = useState<any[]>([]);
  const [cart, setCart] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchChefData();
  }, [id]);

  const fetchChefData = async () => {
    const { data: chefData } = await supabase
      .from("chef_profiles")
      .select(`
        *,
        profiles!chef_profiles_user_id_fkey(username, fullname, avatar_url, bio)
      `)
      .eq("id", id)
      .single();

    if (chefData) {
      setChef(chefData);

      const { data: mealsData } = await supabase
        .from("meals")
        .select("*")
        .eq("chef_id", chefData.id)
        .eq("is_available", true);

      setMeals(mealsData || []);
    }

    setLoading(false);
  };

  const addToCart = (meal: any) => {
    const existing = cart.find(item => item.id === meal.id);
    if (existing) {
      setCart(cart.map(item =>
        item.id === meal.id ? { ...item, quantity: item.quantity + 1 } : item
      ));
    } else {
      setCart([...cart, { ...meal, quantity: 1 }]);
    }
    toast({ title: "Sepete Eklendi", description: meal.name });
  };

  const removeFromCart = (mealId: string) => {
    setCart(cart.filter(item => item.id !== mealId));
  };

  const updateQuantity = (mealId: string, delta: number) => {
    setCart(cart.map(item => {
      if (item.id === mealId) {
        const newQty = item.quantity + delta;
        return newQty > 0 ? { ...item, quantity: newQty } : item;
      }
      return item;
    }).filter(item => item.quantity > 0));
  };

  const getTotalPrice = () => {
    return cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
  };

  const handleCheckout = async () => {
    if (!user) {
      navigate("/giris-yap");
      return;
    }

    if (cart.length === 0) {
      toast({ title: "Sepet Boş", description: "Lütfen sipariş ekleyin", variant: "destructive" });
      return;
    }

    const totalAmount = getTotalPrice();

    const { data: orderData, error: orderError } = await supabase
      .from("orders")
      .insert([{
        customer_id: user.id,
        chef_id: chef.id,
        total_amount: totalAmount,
        delivery_type: "hemen",
        status: "pending",
      }])
      .select()
      .single();

    if (orderError) {
      toast({ title: "Hata", description: orderError.message, variant: "destructive" });
      return;
    }

    const orderItems = cart.map(item => ({
      order_id: orderData.id,
      meal_id: item.id,
      quantity: item.quantity,
      price: item.price,
    }));

    const { error: itemsError } = await supabase
      .from("order_items")
      .insert(orderItems);

    if (itemsError) {
      toast({ title: "Hata", description: itemsError.message, variant: "destructive" });
      return;
    }

    toast({ title: "Sipariş Alındı!", description: "Siparişiniz başarıyla oluşturuldu" });
    setCart([]);
    if (user?.username) {
      navigate(`/profil/${user.username}`);
    } else {
      navigate("/profil");
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background">
        <Navbar />
        <div className="container mx-auto px-4 py-12 text-center">Yükleniyor...</div>
      </div>
    );
  }

  if (!chef) {
    return (
      <div className="min-h-screen bg-background">
        <Navbar />
        <div className="container mx-auto px-4 py-12 text-center">Şef bulunamadı</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background pb-20">
      <Navbar />

      <div className="container mx-auto px-4 py-6 space-y-6">
        <Card className="p-6">
          <div className="flex gap-6 items-start">
            <img
              src={chef.profiles?.avatar_url || "/placeholder.svg"}
              alt={chef.business_name}
              className="w-24 h-24 rounded-full object-cover"
            />
            <div className="flex-1">
              <div className="flex items-start justify-between">
                <div>
                  <h1 className="text-2xl font-bold">{chef.business_name}</h1>
                  <p className="text-muted-foreground">{chef.profiles?.fullname}</p>
                </div>
                <div className="flex items-center gap-2">
                  <Star className="h-5 w-5 fill-yellow-400 text-yellow-400" />
                  <span className="font-semibold">{chef.rating || "Yeni"}</span>
                </div>
              </div>

              <p className="mt-3 text-sm">{chef.description || chef.profiles?.bio}</p>

              <div className="mt-4 flex flex-wrap gap-3 text-sm">
                <div className="flex items-center gap-1">
                  <MapPin className="h-4 w-4" />
                  {chef.city}
                </div>
                <div className="flex items-center gap-1">
                  <Phone className="h-4 w-4" />
                  {chef.phone}
                </div>
                <div className="flex items-center gap-1">
                  <Clock className="h-4 w-4" />
                  {chef.is_available ? "Şu an müsait" : "Randevulu"}
                </div>
              </div>

              <div className="mt-4 flex gap-2">
                {chef.min_order_amount > 0 && (
                  <Badge variant="outline">Min. Sipariş: {chef.min_order_amount} ₺</Badge>
                )}
                <Badge variant="outline">{chef.delivery_radius} km teslimat</Badge>
              </div>
            </div>
          </div>
        </Card>

        <Tabs defaultValue="menu">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="menu">Menü</TabsTrigger>
            <TabsTrigger value="cart">Sepet ({cart.length})</TabsTrigger>
          </TabsList>

          <TabsContent value="menu" className="space-y-4">
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
              {meals.map((meal) => (
                <Card key={meal.id} className="p-4 space-y-3">
                  {meal.image_url && (
                    <img
                      src={meal.image_url}
                      alt={meal.name}
                      className="w-full h-40 object-cover rounded"
                    />
                  )}
                  <div>
                    <h3 className="font-semibold">{meal.name}</h3>
                    <p className="text-sm text-muted-foreground line-clamp-2">{meal.description}</p>
                  </div>
                  <div className="flex items-center gap-2 text-xs text-muted-foreground">
                    {meal.preparation_time && <span>⏱️ {meal.preparation_time} dk</span>}
                    {meal.servings && <span>🍽️ {meal.servings} kişilik</span>}
                  </div>
                  <div className="flex gap-2">
                    {meal.is_vegetarian && <Badge variant="secondary">Vejetaryen</Badge>}
                    {meal.is_vegan && <Badge variant="secondary">Vegan</Badge>}
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-lg font-bold text-primary">{meal.price} ₺</span>
                    <Button size="sm" onClick={() => addToCart(meal)}>
                      <ShoppingCart className="h-4 w-4 mr-1" />
                      Ekle
                    </Button>
                  </div>
                </Card>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="cart" className="space-y-4">
            {cart.length === 0 ? (
              <Card className="p-8 text-center text-muted-foreground">
                Sepetiniz boş
              </Card>
            ) : (
              <>
                <div className="space-y-3">
                  {cart.map((item) => (
                    <Card key={item.id} className="p-4">
                      <div className="flex justify-between items-center">
                        <div>
                          <h3 className="font-semibold">{item.name}</h3>
                          <p className="text-sm text-muted-foreground">{item.price} ₺</p>
                        </div>
                        <div className="flex items-center gap-3">
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => updateQuantity(item.id, -1)}
                          >
                            -
                          </Button>
                          <span className="font-semibold">{item.quantity}</span>
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => updateQuantity(item.id, 1)}
                          >
                            +
                          </Button>
                          <Button
                            size="sm"
                            variant="destructive"
                            onClick={() => removeFromCart(item.id)}
                          >
                            Sil
                          </Button>
                        </div>
                      </div>
                    </Card>
                  ))}
                </div>

                <Card className="p-6">
                  <div className="space-y-4">
                    <div className="flex justify-between text-lg font-bold">
                      <span>Toplam:</span>
                      <span>{getTotalPrice().toFixed(2)} ₺</span>
                    </div>
                    <Button className="w-full" size="lg" onClick={handleCheckout}>
                      Siparişi Tamamla
                    </Button>
                  </div>
                </Card>
              </>
            )}
          </TabsContent>
        </Tabs>
      </div>

      <BottomNav />
    </div>
  );
};

export default ChefProfile;
