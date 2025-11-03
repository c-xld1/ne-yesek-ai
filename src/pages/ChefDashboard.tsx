import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import Navbar from "@/components/Navbar";
import BottomNav from "@/components/BottomNav";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Plus, Edit, Trash2, DollarSign, Package, TrendingUp, Sparkles } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { supabase as supabaseClient } from "@/integrations/supabase/client";

const ChefDashboard = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [chefProfile, setChefProfile] = useState<any>(null);
  const [meals, setMeals] = useState<any[]>([]);
  const [orders, setOrders] = useState<any[]>([]);
  const [stats, setStats] = useState({ totalOrders: 0, totalRevenue: 0, avgRating: 0 });
  const [showMealForm, setShowMealForm] = useState(false);
  const [editingMeal, setEditingMeal] = useState<any>(null);
  const [aiLoading, setAiLoading] = useState(false);
  const [mealForm, setMealForm] = useState({
    name: "",
    description: "",
    price: "",
    category: "",
    preparation_time: "",
    servings: "1",
    ingredients: "",
    allergens: "",
    is_vegetarian: false,
    is_vegan: false,
    is_available: true,
    stock_quantity: "",
  });

  useEffect(() => {
    if (!user) {
      navigate("/giris-yap");
      return;
    }
    fetchChefData();
  }, [user, navigate]);

  const fetchChefData = async () => {
    const { data: profile } = await supabase
      .from("chef_profiles")
      .select("*")
      .eq("user_id", user?.id)
      .single();

    if (!profile) {
      navigate("/");
      toast({
        title: "Yetkisiz Erişim",
        description: "Şef hesabı bulunamadı",
        variant: "destructive",
      });
      return;
    }

    setChefProfile(profile);

    const { data: mealsData } = await supabase
      .from("meals")
      .select("*")
      .eq("chef_id", profile.id)
      .order("created_at", { ascending: false });

    setMeals(mealsData || []);

    const { data: ordersData } = await supabase
      .from("orders")
      .select("*, order_items(*)")
      .eq("chef_id", profile.id)
      .order("created_at", { ascending: false });

    setOrders(ordersData || []);

    const totalRevenue = ordersData?.reduce((sum, order) => sum + Number(order.total_amount), 0) || 0;
    setStats({
      totalOrders: ordersData?.length || 0,
      totalRevenue,
      avgRating: Number(profile.rating) || 0,
    });
  };

  const handleSaveMeal = async (e: React.FormEvent) => {
    e.preventDefault();

    const mealData = {
      chef_id: chefProfile.id,
      name: mealForm.name,
      description: mealForm.description,
      price: parseFloat(mealForm.price),
      category: mealForm.category,
      preparation_time: parseInt(mealForm.preparation_time),
      servings: parseInt(mealForm.servings),
      ingredients: mealForm.ingredients.split(",").map(i => i.trim()),
      allergens: mealForm.allergens.split(",").map(a => a.trim()).filter(Boolean),
      is_vegetarian: mealForm.is_vegetarian,
      is_vegan: mealForm.is_vegan,
      is_available: mealForm.is_available,
      stock_quantity: mealForm.stock_quantity ? parseInt(mealForm.stock_quantity) : null,
    };

    if (editingMeal) {
      const { error } = await supabase
        .from("meals")
        .update(mealData)
        .eq("id", editingMeal.id);

      if (error) {
        toast({ title: "Hata", description: error.message, variant: "destructive" });
        return;
      }
      toast({ title: "Başarılı", description: "Yemek güncellendi" });
    } else {
      const { error } = await supabase.from("meals").insert([mealData]);

      if (error) {
        toast({ title: "Hata", description: error.message, variant: "destructive" });
        return;
      }
      toast({ title: "Başarılı", description: "Yemek eklendi" });
    }

    setShowMealForm(false);
    setEditingMeal(null);
    resetMealForm();
    fetchChefData();
  };

  const resetMealForm = () => {
    setMealForm({
      name: "",
      description: "",
      price: "",
      category: "",
      preparation_time: "",
      servings: "1",
      ingredients: "",
      allergens: "",
      is_vegetarian: false,
      is_vegan: false,
      is_available: true,
      stock_quantity: "",
    });
  };

  const handleEditMeal = (meal: any) => {
    setEditingMeal(meal);
    setMealForm({
      name: meal.name,
      description: meal.description || "",
      price: meal.price.toString(),
      category: meal.category || "",
      preparation_time: meal.preparation_time?.toString() || "",
      servings: meal.servings?.toString() || "1",
      ingredients: meal.ingredients?.join(", ") || "",
      allergens: meal.allergens?.join(", ") || "",
      is_vegetarian: meal.is_vegetarian || false,
      is_vegan: meal.is_vegan || false,
      is_available: meal.is_available,
      stock_quantity: meal.stock_quantity?.toString() || "",
    });
    setShowMealForm(true);
  };

  const handleDeleteMeal = async (id: string) => {
    if (!confirm("Bu yemeği silmek istediğinizden emin misiniz?")) return;

    const { error } = await supabase.from("meals").delete().eq("id", id);

    if (error) {
      toast({ title: "Hata", description: error.message, variant: "destructive" });
      return;
    }

    toast({ title: "Başarılı", description: "Yemek silindi" });
    fetchChefData();
  };

  const handleAIAssist = async (type: 'description' | 'pricing') => {
    if (!mealForm.name || !mealForm.ingredients) {
      toast({ title: "Eksik Bilgi", description: "Önce yemek adı ve malzemeleri girin", variant: "destructive" });
      return;
    }

    setAiLoading(true);
    try {
      const action = type === 'description' ? 'description_writer' : 'pricing_suggestion';
      const { data, error } = await supabaseClient.functions.invoke('chef-ai-assistant', {
        body: {
          action,
          context: {
            meal_name: mealForm.name,
            ingredients: mealForm.ingredients,
            servings: mealForm.servings,
            city: chefProfile?.city,
          }
        }
      });

      if (error) throw error;

      if (type === 'description') {
        setMealForm({ ...mealForm, description: data.response });
      } else {
        const priceMatch = data.response.match(/\d+/);
        if (priceMatch) {
          setMealForm({ ...mealForm, price: priceMatch[0] });
        }
      }
      
      toast({ title: "✨ AI Önerisi Eklendi" });
    } catch (error: any) {
      toast({ title: "Hata", description: error.message, variant: "destructive" });
    } finally {
      setAiLoading(false);
    }
  };

  const handleUpdateOrderStatus = async (orderId: string, newStatus: string) => {
    const { error } = await supabase
      .from("orders")
      .update({ status: newStatus })
      .eq("id", orderId);

    if (error) {
      toast({ title: "Hata", description: error.message, variant: "destructive" });
      return;
    }

    toast({ title: "Başarılı", description: "Sipariş durumu güncellendi" });
    fetchChefData();
  };

  return (
    <div className="min-h-screen bg-background pb-20">
      <Navbar />

      <div className="container mx-auto px-4 py-6 space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold">Şef Paneli</h1>
            <p className="text-muted-foreground">Hoş geldiniz, {chefProfile?.business_name}</p>
          </div>
          <Button onClick={() => navigate("/profil")}>Profili Görüntüle</Button>
        </div>

        <div className="grid md:grid-cols-3 gap-4">
          <Card className="p-6">
            <div className="flex items-center gap-4">
              <div className="p-3 bg-primary/10 rounded-lg">
                <Package className="h-6 w-6 text-primary" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Toplam Sipariş</p>
                <p className="text-2xl font-bold">{stats.totalOrders}</p>
              </div>
            </div>
          </Card>

          <Card className="p-6">
            <div className="flex items-center gap-4">
              <div className="p-3 bg-green-500/10 rounded-lg">
                <DollarSign className="h-6 w-6 text-green-500" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Toplam Kazanç</p>
                <p className="text-2xl font-bold">{stats.totalRevenue.toFixed(2)} ₺</p>
              </div>
            </div>
          </Card>

          <Card className="p-6">
            <div className="flex items-center gap-4">
              <div className="p-3 bg-yellow-500/10 rounded-lg">
                <TrendingUp className="h-6 w-6 text-yellow-500" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Ortalama Puan</p>
                <p className="text-2xl font-bold">{stats.avgRating.toFixed(1)} ⭐</p>
              </div>
            </div>
          </Card>
        </div>

        <Tabs defaultValue="meals">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="meals">Menülerim</TabsTrigger>
            <TabsTrigger value="orders">Siparişler</TabsTrigger>
          </TabsList>

          <TabsContent value="meals" className="space-y-4">
            <div className="flex justify-between items-center">
              <h2 className="text-xl font-semibold">Yemek Menüsü</h2>
              <Button onClick={() => { setShowMealForm(true); setEditingMeal(null); resetMealForm(); }}>
                <Plus className="h-4 w-4 mr-2" />
                Yeni Yemek Ekle
              </Button>
            </div>

            {showMealForm && (
              <Card className="p-6">
                <form onSubmit={handleSaveMeal} className="space-y-4">
                  <div className="grid md:grid-cols-2 gap-4">
                    <div>
                      <Label>Yemek Adı *</Label>
                      <Input
                        value={mealForm.name}
                        onChange={(e) => setMealForm({ ...mealForm, name: e.target.value })}
                        required
                      />
                    </div>
                    <div>
                      <div className="flex justify-between items-center mb-2">
                        <Label>Fiyat (₺) *</Label>
                        <Button
                          type="button"
                          size="sm"
                          variant="outline"
                          onClick={() => handleAIAssist('pricing')}
                          disabled={aiLoading}
                        >
                          <Sparkles className="h-3 w-3 mr-1" />
                          {aiLoading ? 'AI Çalışıyor...' : 'AI Fiyat'}
                        </Button>
                      </div>
                      <Input
                        type="number"
                        step="0.01"
                        value={mealForm.price}
                        onChange={(e) => setMealForm({ ...mealForm, price: e.target.value })}
                        required
                      />
                    </div>
                    <div>
                      <Label>Kategori</Label>
                      <Input
                        value={mealForm.category}
                        onChange={(e) => setMealForm({ ...mealForm, category: e.target.value })}
                        placeholder="Örn: Ana Yemek, Çorba, Tatlı"
                      />
                    </div>
                    <div>
                      <Label>Hazırlık Süresi (dk)</Label>
                      <Input
                        type="number"
                        value={mealForm.preparation_time}
                        onChange={(e) => setMealForm({ ...mealForm, preparation_time: e.target.value })}
                      />
                    </div>
                    <div>
                      <Label>Kişi Sayısı</Label>
                      <Input
                        type="number"
                        value={mealForm.servings}
                        onChange={(e) => setMealForm({ ...mealForm, servings: e.target.value })}
                      />
                    </div>
                    <div>
                      <Label>Stok Miktarı</Label>
                      <Input
                        type="number"
                        value={mealForm.stock_quantity}
                        onChange={(e) => setMealForm({ ...mealForm, stock_quantity: e.target.value })}
                        placeholder="Boş bırakılırsa sınırsız"
                      />
                    </div>
                  </div>

                  <div>
                    <div className="flex justify-between items-center mb-2">
                      <Label>Açıklama</Label>
                      <Button
                        type="button"
                        size="sm"
                        variant="outline"
                        onClick={() => handleAIAssist('description')}
                        disabled={aiLoading}
                      >
                        <Sparkles className="h-3 w-3 mr-1" />
                        {aiLoading ? 'AI Çalışıyor...' : 'AI Öner'}
                      </Button>
                    </div>
                    <Textarea
                      value={mealForm.description}
                      onChange={(e) => setMealForm({ ...mealForm, description: e.target.value })}
                      rows={3}
                    />
                  </div>

                  <div>
                    <Label>Malzemeler (virgülle ayırın)</Label>
                    <Textarea
                      value={mealForm.ingredients}
                      onChange={(e) => setMealForm({ ...mealForm, ingredients: e.target.value })}
                      placeholder="Örn: domates, soğan, zeytinyağı"
                      rows={2}
                    />
                  </div>

                  <div>
                    <Label>Alerjenler (virgülle ayırın)</Label>
                    <Input
                      value={mealForm.allergens}
                      onChange={(e) => setMealForm({ ...mealForm, allergens: e.target.value })}
                      placeholder="Örn: gluten, süt"
                    />
                  </div>

                  <div className="flex gap-6">
                    <div className="flex items-center gap-2">
                      <Switch
                        checked={mealForm.is_vegetarian}
                        onCheckedChange={(checked) => setMealForm({ ...mealForm, is_vegetarian: checked })}
                      />
                      <Label>Vejetaryen</Label>
                    </div>
                    <div className="flex items-center gap-2">
                      <Switch
                        checked={mealForm.is_vegan}
                        onCheckedChange={(checked) => setMealForm({ ...mealForm, is_vegan: checked })}
                      />
                      <Label>Vegan</Label>
                    </div>
                    <div className="flex items-center gap-2">
                      <Switch
                        checked={mealForm.is_available}
                        onCheckedChange={(checked) => setMealForm({ ...mealForm, is_available: checked })}
                      />
                      <Label>Aktif</Label>
                    </div>
                  </div>

                  <div className="flex gap-2">
                    <Button type="submit">{editingMeal ? "Güncelle" : "Kaydet"}</Button>
                    <Button
                      type="button"
                      variant="outline"
                      onClick={() => { setShowMealForm(false); setEditingMeal(null); resetMealForm(); }}
                    >
                      İptal
                    </Button>
                  </div>
                </form>
              </Card>
            )}

            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
              {meals.map((meal) => (
                <Card key={meal.id} className="p-4">
                  <div className="space-y-3">
                    <div className="flex justify-between items-start">
                      <div>
                        <h3 className="font-semibold">{meal.name}</h3>
                        <p className="text-sm text-muted-foreground">{meal.category}</p>
                      </div>
                      <div className="flex gap-1">
                        <Button size="sm" variant="ghost" onClick={() => handleEditMeal(meal)}>
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button size="sm" variant="ghost" onClick={() => handleDeleteMeal(meal.id)}>
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                    <p className="text-lg font-bold text-primary">{meal.price} ₺</p>
                    <div className="flex gap-2 text-xs">
                      {meal.is_vegetarian && <span className="px-2 py-1 bg-green-100 text-green-700 rounded">Vejetaryen</span>}
                      {meal.is_vegan && <span className="px-2 py-1 bg-green-100 text-green-700 rounded">Vegan</span>}
                      {!meal.is_available && <span className="px-2 py-1 bg-red-100 text-red-700 rounded">Stokta Yok</span>}
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="orders" className="space-y-4">
            <h2 className="text-xl font-semibold">Siparişlerim</h2>

            {orders.length === 0 ? (
              <Card className="p-8 text-center text-muted-foreground">
                Henüz sipariş yok
              </Card>
            ) : (
              <div className="space-y-4">
                {orders.map((order) => (
                  <Card key={order.id} className="p-4">
                    <div className="flex justify-between items-start">
                      <div className="space-y-2">
                        <div className="flex items-center gap-2">
                          <span className="font-semibold">Sipariş #{order.id.slice(0, 8)}</span>
                          <span className={`px-2 py-1 text-xs rounded ${
                            order.status === 'pending' ? 'bg-yellow-100 text-yellow-700' :
                            order.status === 'preparing' ? 'bg-blue-100 text-blue-700' :
                            order.status === 'ready' ? 'bg-green-100 text-green-700' :
                            'bg-gray-100 text-gray-700'
                          }`}>
                            {order.status === 'pending' ? 'Bekliyor' :
                             order.status === 'preparing' ? 'Hazırlanıyor' :
                             order.status === 'ready' ? 'Hazır' :
                             order.status === 'delivered' ? 'Teslim Edildi' : order.status}
                          </span>
                        </div>
                        <p className="text-sm text-muted-foreground">
                          {new Date(order.created_at).toLocaleDateString('tr-TR')} - {order.delivery_type}
                        </p>
                        <p className="text-lg font-bold">{order.total_amount} ₺</p>
                      </div>
                      <div className="flex gap-2">
                        {order.status === 'pending' && (
                          <Button size="sm" onClick={() => handleUpdateOrderStatus(order.id, 'preparing')}>
                            Hazırlanıyor
                          </Button>
                        )}
                        {order.status === 'preparing' && (
                          <Button size="sm" onClick={() => handleUpdateOrderStatus(order.id, 'ready')}>
                            Hazır
                          </Button>
                        )}
                        {order.status === 'ready' && (
                          <Button size="sm" onClick={() => handleUpdateOrderStatus(order.id, 'delivered')}>
                            Teslim Edildi
                          </Button>
                        )}
                      </div>
                    </div>
                  </Card>
                ))}
              </div>
            )}
          </TabsContent>
        </Tabs>
      </div>

      <BottomNav />
    </div>
  );
};

export default ChefDashboard;
