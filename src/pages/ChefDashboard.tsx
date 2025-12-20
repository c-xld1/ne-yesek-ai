import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import Navbar from "@/components/Navbar";
import BottomNav from "@/components/BottomNav";
import PremiumHeader from "@/components/PremiumHeader";
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { 
  Plus, Edit, Trash2, DollarSign, Package, TrendingUp, Sparkles, 
  ChefHat, Clock, Star, Eye, Heart, MessageSquare, Users, 
  Calendar, Settings, BarChart3, Award, Zap, Filter, Search,
  Download, Upload, Image as ImageIcon, Camera, Send, Bell
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { supabase as supabaseClient } from "@/integrations/supabase/client";
import { motion, AnimatePresence } from "framer-motion";
import { ollamaAI } from "@/lib/ollamaAI";
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Progress } from "@/components/ui/progress";

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
  const [searchQuery, setSearchQuery] = useState("");
  const [filterCategory, setFilterCategory] = useState("all");
  const [sortBy, setSortBy] = useState("recent");
  const [showAnalytics, setShowAnalytics] = useState(false);
  const [selectedMealForPreview, setSelectedMealForPreview] = useState<any>(null);
  const [uploadingImage, setUploadingImage] = useState(false);
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
    image_url: "",
    gallery: [] as string[],
    portion_size: "",
    tags: [] as string[],
    discount_price: "",
    min_notice_hours: "2",
  });
  const [businessHours, setBusinessHours] = useState({
    monday: { open: "09:00", close: "18:00", closed: false },
    tuesday: { open: "09:00", close: "18:00", closed: false },
    wednesday: { open: "09:00", close: "18:00", closed: false },
    thursday: { open: "09:00", close: "18:00", closed: false },
    friday: { open: "09:00", close: "18:00", closed: false },
    saturday: { open: "10:00", close: "16:00", closed: false },
    sunday: { open: "00:00", close: "00:00", closed: true },
  });
  const [chefSettings, setChefSettings] = useState({
    is_accepting_orders: true,
    min_order_amount: "50",
    service_radius: "10",
    auto_accept_orders: false,
    instant_delivery_available: true,
    scheduled_delivery_available: true,
    notification_sound: true,
    notification_email: true,
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
      .eq("id", user?.id)
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

    const totalRevenue = ordersData?.reduce((sum, order) => sum + Number(order.total_amount || 0), 0) || 0;
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

  // AI Yardım Fonksiyonu
  const handleAIAssist = async (type: 'description' | 'pricing' | 'tags' | 'optimization') => {
    if (!mealForm.name && type !== 'optimization') {
      toast({
        title: "Hata",
        description: "Lütfen önce yemek adını girin",
        variant: "destructive",
      });
      return;
    }

    setAiLoading(true);

    try {
      if (type === 'description') {
        const ingredients = mealForm.ingredients.split(',').map(i => i.trim()).filter(Boolean);
        if (ingredients.length === 0) {
          toast({
            title: "Bilgi",
            description: "Daha iyi açıklama için malzemeleri de girin",
          });
        }
        const description = await ollamaAI.generateMealDescription(mealForm.name, ingredients);
        setMealForm({ ...mealForm, description });
        toast({
          title: "✨ AI Açıklama Oluşturuldu",
          description: "Yemek açıklaması AI tarafından yazıldı",
        });
      } else if (type === 'pricing') {
        const ingredients = mealForm.ingredients.split(',').map(i => i.trim()).filter(Boolean);
        const portionSize = mealForm.portion_size || `${mealForm.servings} kişilik`;
        const price = await ollamaAI.suggestPricing(mealForm.name, ingredients, portionSize);
        setMealForm({ ...mealForm, price: price.toString() });
        toast({
          title: "💰 AI Fiyat Önerisi",
          description: `Önerilen fiyat: ${price}₺`,
        });
      } else if (type === 'tags') {
        const tags = await ollamaAI.generateTags(mealForm.name, mealForm.description);
        setMealForm({ ...mealForm, tags });
        toast({
          title: "🏷️ AI Etiketler Oluşturuldu",
          description: `${tags.length} etiket eklendi`,
        });
      } else if (type === 'optimization') {
        const suggestions = await ollamaAI.getMenuOptimization(meals);
        toast({
          title: "🎯 Menü Optimizasyon Önerileri",
          description: suggestions,
          duration: 10000,
        });
      }
    } catch (error) {
      toast({
        title: "Hata",
        description: "AI yardımı şu anda kullanılamıyor",
        variant: "destructive",
      });
    } finally {
      setAiLoading(false);
    }
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
      image_url: "",
      gallery: [],
      portion_size: "",
      tags: [],
      discount_price: "",
      min_notice_hours: "2",
    });
  };

  const handleUpdateChefProfile = async () => {
    const { error } = await supabase
      .from("chef_profiles")
      .update({
        is_available: chefSettings.is_accepting_orders,
        min_order_amount: parseFloat(chefSettings.min_order_amount),
        delivery_radius: parseInt(chefSettings.service_radius),
      })
      .eq("id", chefProfile.id);

    if (error) {
      toast({ title: "Hata", description: error.message, variant: "destructive" });
      return;
    }

    toast({ title: "Başarılı", description: "Ayarlar güncellendi" });
    fetchChefData();
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
      image_url: meal.image_url || "",
      gallery: meal.gallery || [],
      portion_size: meal.portion_size || "",
      tags: meal.tags || [],
      discount_price: meal.discount_price?.toString() || "",
      min_notice_hours: meal.min_notice_hours?.toString() || "",
    });
    setShowMealForm(true);
  };

  const handleToggleAvailability = async (id: string, checked: boolean) => {
    const { error } = await supabase.from("meals").update({ is_available: checked }).eq("id", id);

    if (error) {
      toast({ title: "Hata", description: error.message, variant: "destructive" });
      return;
    }

    toast({ title: "Başarılı", description: `Yemek ${checked ? 'aktif' : 'pasif'} hale getirildi` });
    fetchChefData();
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

  // Filtreleme ve arama
  const filteredMeals = meals.filter(meal => {
    const matchesSearch = meal.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         meal.description?.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = filterCategory === "all" || meal.category === filterCategory;
    return matchesSearch && matchesCategory;
  });

  // Sıralama
  const sortedMeals = [...filteredMeals].sort((a, b) => {
    switch (sortBy) {
      case "recent": return new Date(b.created_at).getTime() - new Date(a.created_at).getTime();
      case "price-high": return b.price - a.price;
      case "price-low": return a.price - b.price;
      case "popular": return (b.orders_count || 0) - (a.orders_count || 0);
      default: return 0;
    }
  });

  // Kategorileri çıkar
  const categories = Array.from(new Set(meals.map(m => m.category).filter(Boolean)));

  return (
    <>
      <div className="min-h-screen bg-gradient-to-br from-orange-50 via-white to-rose-50 pb-20">
        <Navbar />

        <div className="container mx-auto px-4 py-8">
          <PremiumHeader
            title={`Hoş geldin, ${chefProfile?.business_name || 'Şef'}! 👨‍🍳`}
            description="İşletmeni tek ekrandan yönet, performansını takip et ve müşterilerinle etkileşime geç."
            emoji="🔥"
            primaryBadge={{
              icon: ChefHat,
              text: "Premium Şef",
              animate: true
            }}
            secondaryBadge={{
              icon: Award,
              text: `${stats.avgRating.toFixed(1)} ⭐ Puan`
            }}
            breadcrumbItems={[
              { label: "Ana Sayfa", href: "/" },
              { label: "Şef Paneli", isActive: true }
            ]}
            className="mb-6"
          />
        </div>

      {/* Quick Actions Bar - Responsive */}
      <div className="container mx-auto px-4 mb-6">
        <div className="bg-white rounded-2xl shadow-lg p-4 border border-orange-100">
          <div className="flex flex-wrap gap-3 justify-center md:justify-start">
            <Button 
              size="sm"
              onClick={() => { setShowMealForm(true); setEditingMeal(null); resetMealForm(); }}
              className="bg-gradient-to-r from-orange-500 to-rose-500 hover:from-orange-600 hover:to-rose-600"
            >
              <Plus className="h-4 w-4 mr-2" />
              Yeni Yemek
            </Button>
            <Button 
              size="sm"
              variant="outline"
              onClick={() => user?.username ? navigate(`/profil/${user.username}`) : navigate("/profil")}
              className="border-orange-300 hover:bg-orange-50"
            >
              <Eye className="h-4 w-4 mr-2" />
              Profili Görüntüle
            </Button>
            <Button 
              size="sm"
              variant="outline"
              onClick={() => setShowAnalytics(!showAnalytics)}
              className="border-blue-300 hover:bg-blue-50"
            >
              <BarChart3 className="h-4 w-4 mr-2" />
              Analitik
            </Button>
            <Button 
              size="sm"
              variant="outline"
              className="border-green-300 hover:bg-green-50"
            >
              <Download className="h-4 w-4 mr-2" />
              Rapor İndir
            </Button>
            <Button 
              size="sm"
              variant="outline"
              className="border-purple-300 hover:bg-purple-50"
            >
              <Bell className="h-4 w-4 mr-2" />
              Bildirimler
              {orders.filter(o => o.status === 'pending').length > 0 && (
                <Badge className="ml-2 bg-red-500 text-white text-xs">
                  {orders.filter(o => o.status === 'pending').length}
                </Badge>
              )}
            </Button>
            <Button 
              size="sm"
              variant="outline"
              className="border-amber-300 hover:bg-amber-50"
            >
              <Settings className="h-4 w-4 mr-2" />
              Ayarlar
            </Button>
          </div>
        </div>
      </div>

      {/* Enhanced Stats Cards with Animation - Responsive Grid */}
      <div className="container mx-auto px-4 mb-8">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
          >
            <Card className="bg-gradient-to-br from-orange-500 to-orange-600 text-white border-0 shadow-lg hover:shadow-xl transition-shadow">
              <CardContent className="p-6">
                <div className="flex items-center justify-between mb-2">
                  <Package className="h-8 w-8 opacity-80" />
                  <Badge variant="secondary" className="bg-white/20 text-white border-0">
                    Bugün: {orders.filter(o => new Date(o.created_at).toDateString() === new Date().toDateString()).length}
                  </Badge>
                </div>
                <div className="text-3xl font-bold mb-1">{stats.totalOrders}</div>
                <div className="text-sm opacity-90">Toplam Sipariş</div>
              </CardContent>
            </Card>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
          >
            <Card className="bg-gradient-to-br from-green-500 to-emerald-600 text-white border-0 shadow-lg hover:shadow-xl transition-shadow">
              <CardContent className="p-6">
                <div className="flex items-center justify-between mb-2">
                  <DollarSign className="h-8 w-8 opacity-80" />
                  <Badge variant="secondary" className="bg-white/20 text-white border-0">
                    +{((stats.totalRevenue / 1000) * 15).toFixed(0)}% Bu Ay
                  </Badge>
                </div>
                <div className="text-3xl font-bold mb-1">{stats.totalRevenue.toFixed(2)} ₺</div>
                <div className="text-sm opacity-90">Toplam Kazanç</div>
              </CardContent>
            </Card>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
          >
            <Card className="bg-gradient-to-br from-blue-500 to-indigo-600 text-white border-0 shadow-lg hover:shadow-xl transition-shadow">
              <CardContent className="p-6">
                <div className="flex items-center justify-between mb-2">
                  <Star className="h-8 w-8 opacity-80" />
                  <Badge variant="secondary" className="bg-white/20 text-white border-0">
                    {meals.length} Yemek
                  </Badge>
                </div>
                <div className="text-3xl font-bold mb-1">{stats.avgRating.toFixed(1)} ⭐</div>
                <div className="text-sm opacity-90">Ortalama Puan</div>
              </CardContent>
            </Card>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
          >
            <Card className="bg-gradient-to-br from-purple-500 to-pink-600 text-white border-0 shadow-lg hover:shadow-xl transition-shadow">
              <CardContent className="p-6">
                <div className="flex items-center justify-between mb-2">
                  <Users className="h-8 w-8 opacity-80" />
                  <Badge variant="secondary" className="bg-white/20 text-white border-0">
                    <Zap className="h-3 w-3 mr-1" /> Aktif
                  </Badge>
                </div>
                <div className="text-3xl font-bold mb-1">{Math.floor(stats.totalOrders * 0.7)}</div>
                <div className="text-sm opacity-90">Tekrar Eden Müşteri</div>
              </CardContent>
            </Card>
          </motion.div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-6">

        {/* AI Features Info Card */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-6"
        >
          <Card className="border-2 border-purple-200 bg-gradient-to-r from-purple-50 via-pink-50 to-orange-50">
            <CardContent className="p-4">
              <div className="flex items-start gap-3">
                <div className="p-2 bg-purple-100 rounded-lg">
                  <Sparkles className="h-5 w-5 text-purple-600" />
                </div>
                <div className="flex-1">
                  <h3 className="font-semibold text-gray-900 mb-1 flex items-center gap-2">
                    🤖 AI Asistan Aktif
                    <Badge className="bg-green-500 text-white text-xs animate-pulse">BETA</Badge>
                  </h3>
                  <p className="text-sm text-gray-600">
                    Yemek açıklamaları, fiyat önerileri, etiket oluşturma ve menü optimizasyonu için AI desteği kullanılabilir. 
                    Ollama Free API ile desteklenmektedir.
                  </p>
                  <div className="flex flex-wrap gap-2 mt-2">
                    <Badge variant="outline" className="text-xs bg-white">
                      <Sparkles className="h-3 w-3 mr-1" />
                      Açıklama Yazma
                    </Badge>
                    <Badge variant="outline" className="text-xs bg-white">
                      <DollarSign className="h-3 w-3 mr-1" />
                      Fiyat Önerisi
                    </Badge>
                    <Badge variant="outline" className="text-xs bg-white">
                      <Package className="h-3 w-3 mr-1" />
                      Etiket Oluşturma
                    </Badge>
                    <Badge variant="outline" className="text-xs bg-white">
                      <BarChart3 className="h-3 w-3 mr-1" />
                      Menü Analizi
                    </Badge>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Enhanced Tabs with Icons - Responsive */}
        <Tabs defaultValue="meals" className="space-y-6">
          <div className="bg-white rounded-xl shadow-lg border border-gray-200 p-2 overflow-x-auto">
            <TabsList className="w-full md:w-auto justify-start bg-transparent h-auto p-0 gap-2 flex-nowrap min-w-max">
              <TabsTrigger 
                value="meals" 
                className="rounded-lg data-[state=active]:bg-gradient-to-r data-[state=active]:from-orange-500 data-[state=active]:to-rose-500 data-[state=active]:text-white px-3 md:px-6 py-2 md:py-3 transition-all text-sm md:text-base whitespace-nowrap"
              >
                <Package className="h-3 w-3 md:h-4 md:w-4 mr-1 md:mr-2" />
                <span className="hidden sm:inline">Menülerim</span>
                <span className="sm:hidden">Menü</span>
              </TabsTrigger>
              <TabsTrigger 
                value="orders"
                className="rounded-lg data-[state=active]:bg-gradient-to-r data-[state=active]:from-blue-500 data-[state=active]:to-indigo-500 data-[state=active]:text-white px-3 md:px-6 py-2 md:py-3 transition-all text-sm md:text-base whitespace-nowrap"
              >
                <Bell className="h-3 w-3 md:h-4 md:w-4 mr-1 md:mr-2" />
                <span className="hidden sm:inline">Siparişler</span>
                <span className="sm:hidden">Sipariş</span>
                {orders.filter(o => o.status === 'pending').length > 0 && (
                  <Badge className="ml-1 md:ml-2 bg-red-500 text-white text-xs">
                    {orders.filter(o => o.status === 'pending').length}
                  </Badge>
                )}
              </TabsTrigger>
              <TabsTrigger 
                value="analytics"
                className="rounded-lg data-[state=active]:bg-gradient-to-r data-[state=active]:from-purple-500 data-[state=active]:to-pink-500 data-[state=active]:text-white px-3 md:px-6 py-2 md:py-3 transition-all text-sm md:text-base whitespace-nowrap"
              >
                <BarChart3 className="h-3 w-3 md:h-4 md:w-4 mr-1 md:mr-2" />
                <span className="hidden sm:inline">Analitik</span>
                <span className="sm:hidden">İstatistik</span>
              </TabsTrigger>
              <TabsTrigger 
                value="calendar"
                className="rounded-lg data-[state=active]:bg-gradient-to-r data-[state=active]:from-green-500 data-[state=active]:to-emerald-500 data-[state=active]:text-white px-3 md:px-6 py-2 md:py-3 transition-all text-sm md:text-base whitespace-nowrap"
              >
                <Calendar className="h-3 w-3 md:h-4 md:w-4 mr-1 md:mr-2" />
                Takvim
              </TabsTrigger>
              <TabsTrigger 
                value="settings"
                className="rounded-lg data-[state=active]:bg-gradient-to-r data-[state=active]:from-gray-600 data-[state=active]:to-gray-700 data-[state=active]:text-white px-3 md:px-6 py-2 md:py-3 transition-all text-sm md:text-base whitespace-nowrap"
              >
                <Settings className="h-3 w-3 md:h-4 md:w-4 mr-1 md:mr-2" />
                Ayarlar
              </TabsTrigger>
            </TabsList>
          </div>

          <TabsContent value="meals" className="space-y-6">
            {/* Enhanced Header with Search and Filters */}
            <Card className="border-2 border-orange-100 bg-gradient-to-r from-white to-orange-50">
              <CardContent className="p-6">
                <div className="flex flex-col lg:flex-row gap-4 items-start lg:items-center justify-between">
                  <div>
                    <h2 className="text-2xl font-bold text-gray-900 mb-2 flex items-center gap-2">
                      <ChefHat className="text-orange-500" />
                      Yemek Menüsü
                    </h2>
                    <p className="text-sm text-gray-600">
                      {filteredMeals.length} yemek bulundu • {meals.filter(m => m.is_available).length} aktif
                    </p>
                  </div>
                  <div className="flex flex-wrap gap-2 w-full lg:w-auto">
                    <Button 
                      variant="outline"
                      onClick={() => handleAIAssist('optimization')}
                      disabled={aiLoading || meals.length === 0}
                      className="border-purple-300 hover:bg-purple-50 flex-1 sm:flex-none"
                      size="sm"
                    >
                      <Sparkles className="h-4 w-4 mr-2" />
                      {aiLoading ? 'Analiz...' : 'AI Menü Analizi'}
                    </Button>
                    <Button 
                      onClick={() => { setShowMealForm(true); setEditingMeal(null); resetMealForm(); }}
                      className="bg-gradient-to-r from-orange-500 to-rose-500 hover:from-orange-600 hover:to-rose-600 shadow-lg hover:shadow-xl transition-all flex-1 sm:flex-none"
                      size="sm"
                    >
                      <Plus className="h-4 w-4 mr-2" />
                      Yeni Yemek
                    </Button>
                  </div>
                </div>

                {/* Search and Filter Bar - Fully Responsive */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 mt-6">
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                    <Input
                      placeholder="Yemek ara..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="pl-10 border-orange-200 focus:border-orange-400"
                    />
                  </div>
                  <Select value={filterCategory} onValueChange={setFilterCategory}>
                    <SelectTrigger className="border-orange-200 focus:border-orange-400">
                      <Filter className="h-4 w-4 mr-2" />
                      <SelectValue placeholder="Kategori" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">Tüm Kategoriler</SelectItem>
                      {categories.map(cat => (
                        <SelectItem key={cat} value={cat}>{cat}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <Select value={sortBy} onValueChange={setSortBy}>
                    <SelectTrigger className="border-orange-200 focus:border-orange-400">
                      <TrendingUp className="h-4 w-4 mr-2" />
                      <SelectValue placeholder="Sırala" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="recent">En Yeni</SelectItem>
                      <SelectItem value="price-high">Fiyat (Yüksek)</SelectItem>
                      <SelectItem value="price-low">Fiyat (Düşük)</SelectItem>
                      <SelectItem value="popular">Popüler</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </CardContent>
            </Card>

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

                  <div className="grid md:grid-cols-2 gap-4">
                    <div>
                      <Label>Porsiyon Boyutu</Label>
                      <Input
                        value={mealForm.portion_size}
                        onChange={(e) => setMealForm({ ...mealForm, portion_size: e.target.value })}
                        placeholder="Örn: 1 kişilik, 2-3 kişilik"
                      />
                    </div>
                    <div>
                      <Label>İndirimli Fiyat (₺)</Label>
                      <Input
                        type="number"
                        step="0.01"
                        value={mealForm.discount_price}
                        onChange={(e) => setMealForm({ ...mealForm, discount_price: e.target.value })}
                        placeholder="Boş bırakılırsa indirim yok"
                      />
                    </div>
                  </div>

                  <div>
                    <div className="flex justify-between items-center mb-2">
                      <Label>Etiketler (virgülle ayırın)</Label>
                      <Button
                        type="button"
                        size="sm"
                        variant="outline"
                        onClick={() => handleAIAssist('tags')}
                        disabled={aiLoading || !mealForm.name}
                        className="border-purple-300 hover:bg-purple-50"
                      >
                        <Sparkles className="h-3 w-3 mr-1" />
                        {aiLoading ? 'AI Çalışıyor...' : 'AI Etiket'}
                      </Button>
                    </div>
                    <Input
                      value={mealForm.tags.join(", ")}
                      onChange={(e) => setMealForm({ ...mealForm, tags: e.target.value.split(",").map(t => t.trim()) })}
                      placeholder="Örn: sağlıklı, diyet, baharatlı"
                    />
                    <p className="text-xs text-muted-foreground mt-1">
                      AI yemek adı ve açıklamasına göre otomatik etiketler oluşturabilir
                    </p>
                  </div>

                  <div>
                    <Label>Görsel URL</Label>
                    <Input
                      type="url"
                      value={mealForm.image_url}
                      onChange={(e) => setMealForm({ ...mealForm, image_url: e.target.value })}
                      placeholder="https://..."
                    />
                    <p className="text-xs text-muted-foreground mt-1">
                      Yemeğinizin fotoğrafının URL'sini girin
                    </p>
                  </div>

                  <div>
                    <Label>Minimum Sipariş Önceden Haber Süresi (saat)</Label>
                    <Input
                      type="number"
                      value={mealForm.min_notice_hours}
                      onChange={(e) => setMealForm({ ...mealForm, min_notice_hours: e.target.value })}
                    />
                    <p className="text-xs text-muted-foreground mt-1">
                      Randevulu siparişler için kaç saat önceden haber verilmeli
                    </p>
                  </div>

                  <div className="flex gap-6 flex-wrap">
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

            {/* Enhanced Meal Grid with Animation - Fully Responsive */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 md:gap-6">
              {sortedMeals.map((meal, index) => (
                <motion.div
                  key={meal.id}
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.9 }}
                  transition={{ delay: index * 0.05 }}
                >
                    <Card className="overflow-hidden hover:shadow-2xl transition-all duration-300 border-2 border-transparent hover:border-orange-300 group relative">
                      {/* Overlay Badge */}
                      {meal.ready_now && (
                        <Badge className="absolute top-2 left-2 bg-red-500 text-white z-10 animate-pulse">
                          <Zap className="h-3 w-3 mr-1" />
                          Hemen Teslimat
                        </Badge>
                      )}
                      {meal.discount_price && (
                        <Badge className="absolute top-2 right-2 bg-green-500 text-white z-10">
                          %{Math.round((1 - meal.discount_price / meal.price) * 100)} İndirim
                        </Badge>
                      )}

                      <div className="relative h-48 bg-gray-100 overflow-hidden">
                        {meal.image_url ? (
                          <img 
                            src={meal.image_url} 
                            alt={meal.name} 
                            className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300" 
                          />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-orange-100 via-rose-50 to-purple-100">
                            <ChefHat className="text-6xl text-orange-300" />
                          </div>
                        )}
                          <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                      </div>

                      {/* Card Content */}
                      <CardHeader className="space-y-3">
                        <CardTitle className="flex justify-between items-start">
                          <div className="flex-1">
                            <h3 className="text-xl font-bold text-gray-900 group-hover:text-orange-600 transition-colors">
                              {meal.name}
                            </h3>
                            <div className="flex gap-2 mt-2 flex-wrap">
                              {meal.tags?.map((tag, idx) => (
                                <Badge key={idx} variant="outline" className="text-xs">
                                  {tag}
                                </Badge>
                              ))}
                              {!meal.tags?.length && meal.category && (
                                <Badge variant="outline" className="text-xs">{meal.category}</Badge>
                              )}
                            </div>
                          </div>
                        </CardTitle>
                        <CardDescription className="line-clamp-2 text-gray-600">
                          {meal.description || "Lezzetli bir yemek deneyimi için hazırlandı."}
                        </CardDescription>
                      </CardHeader>

                      <CardContent className="space-y-4">
                        {/* Price Section */}
                        <div className="flex items-baseline gap-2">
                          {meal.discount_price ? (
                            <>
                              <span className="text-3xl font-bold text-orange-600">{meal.discount_price} ₺</span>
                              <span className="text-lg text-gray-400 line-through">{meal.price} ₺</span>
                            </>
                          ) : (
                            <span className="text-3xl font-bold text-orange-600">{meal.price} ₺</span>
                          )}
                          {meal.portion_size && (
                            <span className="text-sm text-gray-500">/ {meal.portion_size}</span>
                          )}
                          {!meal.portion_size && meal.servings && (
                            <span className="text-sm text-gray-500">/ {meal.servings} kişilik</span>
                          )}
                        </div>

                        {/* Stats Grid */}
                        <div className="grid grid-cols-3 gap-3 pt-3 border-t">
                          <div className="text-center">
                            <div className="flex items-center justify-center gap-1 text-yellow-500 mb-1">
                              <Star className="h-4 w-4 fill-current" />
                              <span className="font-semibold">4.8</span>
                            </div>
                            <p className="text-xs text-gray-500">Puan</p>
                          </div>
                          <div className="text-center border-x">
                            <div className="flex items-center justify-center gap-1 text-blue-500 mb-1">
                              <Eye className="h-4 w-4" />
                              <span className="font-semibold">{Math.floor(Math.random() * 200)}</span>
                            </div>
                            <p className="text-xs text-gray-500">Görüntüleme</p>
                          </div>
                          <div className="text-center">
                            <div className="flex items-center justify-center gap-1 text-green-500 mb-1">
                              <Heart className="h-4 w-4 fill-current" />
                              <span className="font-semibold">{Math.floor(Math.random() * 100)}</span>
                            </div>
                            <p className="text-xs text-gray-500">Favori</p>
                          </div>
                        </div>

                        {/* Preparation Time Badge */}
                        {meal.preparation_time && (
                          <div className="flex items-center gap-2 text-sm text-gray-600">
                            <Clock className="h-4 w-4" />
                            <span>{meal.preparation_time} dakika hazırlık</span>
                          </div>
                        )}

                        {/* Action Buttons */}
                        <div className="flex gap-2 pt-2">
                          <Button
                            variant="outline"
                            size="sm"
                            className="flex-1 hover:bg-orange-50 hover:border-orange-300 transition-colors"
                            onClick={() => handleEditMeal(meal)}
                          >
                            <Settings className="h-4 w-4 mr-1" />
                            Düzenle
                          </Button>
                          <Button
                            variant="outline"
                            size="sm"
                            className="flex-1 hover:bg-red-50 hover:border-red-300 hover:text-red-600 transition-colors"
                            onClick={() => handleDeleteMeal(meal.id)}
                          >
                            <Trash2 className="h-4 w-4 mr-1" />
                            Sil
                          </Button>
                        </div>
                      </CardContent>
                    

                      {/* Footer Section */}
                      <CardFooter className="flex flex-col gap-3 pt-4 border-t bg-gray-50/50">
                        <div className="flex items-center justify-between w-full">
                          <div className="flex gap-2 flex-wrap">
                            {meal.is_vegetarian && (
                              <Badge variant="secondary" className="text-xs bg-green-100 text-green-700">
                                🌱 Vejetaryen
                              </Badge>
                            )}
                            {meal.is_vegan && (
                              <Badge variant="secondary" className="text-xs bg-emerald-100 text-emerald-700">
                                🥗 Vegan
                              </Badge>
                            )}
                            {!meal.is_available && (
                              <Badge variant="destructive" className="text-xs">
                                Stokta Yok
                              </Badge>
                            )}
                          </div>
                          <div className="flex items-center gap-2">
                            <span className="text-xs font-medium text-gray-600">
                              {meal.is_available ? 'Aktif' : 'Pasif'}
                            </span>
                            <Switch
                              checked={meal.is_available}
                              onCheckedChange={(checked) => handleToggleAvailability(meal.id, checked)}
                            />
                          </div>
                        </div>
                        
                        <div className="flex items-center gap-2 w-full pt-2 border-t">
                          <Switch
                            checked={meal.ready_now || false}
                            onCheckedChange={async (checked) => {
                              const ready_until = checked ? new Date(Date.now() + 4 * 60 * 60 * 1000).toISOString() : null;
                              await supabase.from("meals").update({ ready_now: checked, ready_until }).eq("id", meal.id);
                              fetchChefData();
                            }}
                          />
                          <Zap className="h-4 w-4 text-orange-500" />
                          <span className="text-xs font-medium text-gray-700">Hemen Teslimat Aktif</span>
                        </div>
                      </CardFooter>
                    </Card>
                  </motion.div>
                ))}
            </div>
          </TabsContent>

          {/* Analytics Tab */}
          <TabsContent value="analytics" className="space-y-6">
            <Card className="p-6">
              <CardHeader className="px-0 pt-0">
                <CardTitle className="flex items-center gap-2 text-2xl">
                  <BarChart3 className="h-6 w-6 text-purple-500" />
                  İşletme Analitikleri
                </CardTitle>
                <CardDescription>
                  Performansınızı takip edin ve iş kararlarınızı veriye dayandırın
                </CardDescription>
              </CardHeader>
              <CardContent className="px-0">
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
                  <motion.div
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: 0.1 }}
                  >
                    <Card className="bg-gradient-to-br from-blue-50 to-blue-100 border-blue-200 hover:shadow-xl transition-shadow cursor-pointer">
                      <CardContent className="p-4">
                        <div className="flex items-center justify-between mb-2">
                          <Users className="h-6 w-6 text-blue-600" />
                          <Badge variant="secondary" className="bg-blue-600 text-white text-xs">
                            +12%
                          </Badge>
                        </div>
                        <p className="text-2xl md:text-3xl font-bold text-blue-900">245</p>
                        <p className="text-xs md:text-sm text-blue-700">Toplam Müşteri</p>
                      </CardContent>
                    </Card>
                  </motion.div>

                  <motion.div
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: 0.2 }}
                  >
                    <Card className="bg-gradient-to-br from-green-50 to-green-100 border-green-200 hover:shadow-xl transition-shadow cursor-pointer">
                      <CardContent className="p-4">
                        <div className="flex items-center justify-between mb-2">
                          <TrendingUp className="h-6 w-6 text-green-600" />
                          <Badge variant="secondary" className="bg-green-600 text-white text-xs">
                            +8%
                          </Badge>
                        </div>
                        <p className="text-2xl md:text-3xl font-bold text-green-900">₺{stats.totalRevenue.toFixed(0)}</p>
                        <p className="text-xs md:text-sm text-green-700">Bu Ay Gelir</p>
                      </CardContent>
                    </Card>
                  </motion.div>

                  <motion.div
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: 0.3 }}
                  >
                    <Card className="bg-gradient-to-br from-orange-50 to-orange-100 border-orange-200 hover:shadow-xl transition-shadow cursor-pointer">
                      <CardContent className="p-4">
                        <div className="flex items-center justify-between mb-2">
                          <Award className="h-6 w-6 text-orange-600" />
                          <Badge variant="secondary" className="bg-orange-600 text-white text-xs">
                            Top 5%
                          </Badge>
                        </div>
                        <p className="text-2xl md:text-3xl font-bold text-orange-900">{stats.avgRating.toFixed(1)}</p>
                        <p className="text-xs md:text-sm text-orange-700">Ortalama Puan</p>
                      </CardContent>
                    </Card>
                  </motion.div>

                  <motion.div
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: 0.4 }}
                  >
                    <Card className="bg-gradient-to-br from-purple-50 to-purple-100 border-purple-200 hover:shadow-xl transition-shadow cursor-pointer">
                      <CardContent className="p-4">
                        <div className="flex items-center justify-between mb-2">
                          <Heart className="h-6 w-4 text-purple-600 fill-current" />
                          <Badge variant="secondary" className="bg-purple-600 text-white text-xs">
                            +15%
                          </Badge>
                        </div>
                        <p className="text-2xl md:text-3xl font-bold text-purple-900">89%</p>
                        <p className="text-xs md:text-sm text-purple-700">Müşteri Memnuniyeti</p>
                      </CardContent>
                    </Card>
                  </motion.div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 md:gap-6">
                  <Card className="shadow-lg hover:shadow-xl transition-shadow">
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2">
                        <TrendingUp className="h-5 w-5 text-orange-500" />
                        En Popüler Yemekler
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-3">
                        {meals.slice(0, 5).map((meal, idx) => (
                          <div key={meal.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                            <div className="flex items-center gap-3">
                              <Badge className="bg-orange-100 text-orange-700">{idx + 1}</Badge>
                              <div>
                                <p className="font-medium">{meal.name}</p>
                                <p className="text-sm text-gray-500">{Math.floor(Math.random() * 50) + 20} sipariş</p>
                              </div>
                            </div>
                            <div className="flex items-center gap-1 text-yellow-500">
                              <Star className="h-4 w-4 fill-current" />
                              <span className="font-semibold">4.{8 - idx}</span>
                            </div>
                          </div>
                        ))}
                      </div>
                    </CardContent>
                  </Card>

                  <Card className="shadow-lg hover:shadow-xl transition-shadow">
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2">
                        <BarChart3 className="h-5 w-5 text-purple-500" />
                        Haftalık Performans
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-4">
                        <div>
                          <div className="flex justify-between mb-2">
                            <span className="text-sm font-medium">Sipariş Tamamlama Oranı</span>
                            <span className="text-sm font-bold text-green-600">94%</span>
                          </div>
                          <Progress value={94} className="h-2" />
                        </div>
                        <div>
                          <div className="flex justify-between mb-2">
                            <span className="text-sm font-medium">Teslimat Zamanında</span>
                            <span className="text-sm font-bold text-blue-600">89%</span>
                          </div>
                          <Progress value={89} className="h-2" />
                        </div>
                        <div>
                          <div className="flex justify-between mb-2">
                            <span className="text-sm font-medium">Müşteri İadesi</span>
                            <span className="text-sm font-bold text-orange-600">3%</span>
                          </div>
                          <Progress value={3} className="h-2" />
                        </div>
                        <div>
                          <div className="flex justify-between mb-2">
                            <span className="text-sm font-medium">Yeni Müşteriler</span>
                            <span className="text-sm font-bold text-purple-600">67%</span>
                          </div>
                          <Progress value={67} className="h-2" />
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </CardContent>
            </Card>
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
                            Kabul Et
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

          <TabsContent value="calendar" className="space-y-4">
            <h2 className="text-xl font-semibold">Çalışma Takvimim</h2>
            <Card className="p-6">
              <p className="text-muted-foreground">Çalışma saatlerinizi ayarlayın. Müşteriler sadece aktif olduğunuz günlerde randevu alabilir.</p>
              <div className="mt-6 space-y-4">
                {['Pazartesi', 'Salı', 'Çarşamba', 'Perşembe', 'Cuma', 'Cumartesi', 'Pazar'].map((day, index) => (
                  <div key={index} className="flex items-center gap-4 p-3 border rounded-lg">
                    <Switch />
                    <span className="font-medium w-24">{day}</span>
                    <Input type="time" className="w-32" placeholder="09:00" />
                    <span>-</span>
                    <Input type="time" className="w-32" placeholder="18:00" />
                  </div>
                ))}
              </div>
            </Card>
          </TabsContent>

          <TabsContent value="scheduled" className="space-y-4">
            <h2 className="text-xl font-semibold">Randevulu Siparişler</h2>
            <Card className="p-6">
              <p className="text-muted-foreground text-center py-8">Yakında aktif olacak</p>
            </Card>
          </TabsContent>

          <TabsContent value="settings" className="space-y-6">
            <h2 className="text-xl font-semibold">Şef Ayarları</h2>

            {/* İşletme Bilgileri */}
            <Card>
              <CardHeader>
                <CardTitle>İşletme Bilgileri</CardTitle>
                <CardDescription>İşletmeniz hakkında temel bilgiler</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <Label>İşletme Adı</Label>
                    <Input
                      value={chefProfile?.business_name || ""}
                      onChange={(e) => setChefProfile({ ...chefProfile, business_name: e.target.value })}
                    />
                  </div>
                  <div>
                    <Label>Telefon</Label>
                    <Input
                      value={chefProfile?.phone || ""}
                      onChange={(e) => setChefProfile({ ...chefProfile, phone: e.target.value })}
                      placeholder="+90 5XX XXX XX XX"
                    />
                  </div>
                  <div className="md:col-span-2">
                    <Label>Adres</Label>
                    <Input
                      value={chefProfile?.address || ""}
                      onChange={(e) => setChefProfile({ ...chefProfile, address: e.target.value })}
                    />
                  </div>
                  <div>
                    <Label>Şehir</Label>
                    <Input
                      value={chefProfile?.city || ""}
                      onChange={(e) => setChefProfile({ ...chefProfile, city: e.target.value })}
                    />
                  </div>
                  <div>
                    <Label>İlçe</Label>
                    <Input
                      value={chefProfile?.district || ""}
                      onChange={(e) => setChefProfile({ ...chefProfile, district: e.target.value })}
                    />
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Çalışma Saatleri */}
            <Card>
              <CardHeader>
                <CardTitle>Çalışma Saatleri</CardTitle>
                <CardDescription>Müşterilerin sipariş verebileceği saatler</CardDescription>
              </CardHeader>
              <CardContent className="space-y-3">
                {Object.entries(businessHours).map(([day, hours]) => (
                  <div key={day} className="flex items-center gap-3 p-3 border rounded-lg">
                    <Switch
                      checked={!hours.closed}
                      onCheckedChange={(checked) =>
                        setBusinessHours({
                          ...businessHours,
                          [day]: { ...hours, closed: !checked },
                        })
                      }
                    />
                    <span className="font-medium w-24 capitalize">{day === 'monday' ? 'Pazartesi' : day === 'tuesday' ? 'Salı' : day === 'wednesday' ? 'Çarşamba' : day === 'thursday' ? 'Perşembe' : day === 'friday' ? 'Cuma' : day === 'saturday' ? 'Cumartesi' : 'Pazar'}</span>
                    {!hours.closed && (
                      <>
                        <Input
                          type="time"
                          className="w-32"
                          value={hours.open}
                          onChange={(e) =>
                            setBusinessHours({
                              ...businessHours,
                              [day]: { ...hours, open: e.target.value },
                            })
                          }
                        />
                        <span>-</span>
                        <Input
                          type="time"
                          className="w-32"
                          value={hours.close}
                          onChange={(e) =>
                            setBusinessHours({
                              ...businessHours,
                              [day]: { ...hours, close: e.target.value },
                            })
                          }
                        />
                      </>
                    )}
                    {hours.closed && <span className="text-sm text-muted-foreground">Kapalı</span>}
                  </div>
                ))}
              </CardContent>
            </Card>

            {/* Sipariş Ayarları */}
            <Card>
              <CardHeader>
                <CardTitle>Sipariş Ayarları</CardTitle>
                <CardDescription>Sipariş alma ve teslimat ayarları</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <Label>Sipariş Kabul Et</Label>
                    <p className="text-sm text-muted-foreground">Yeni siparişleri kabul et</p>
                  </div>
                  <Switch
                    checked={chefSettings.is_accepting_orders}
                    onCheckedChange={(checked) =>
                      setChefSettings({ ...chefSettings, is_accepting_orders: checked })
                    }
                  />
                </div>

                <div className="flex items-center justify-between">
                  <div>
                    <Label>Otomatik Kabul</Label>
                    <p className="text-sm text-muted-foreground">Siparişleri otomatik olarak kabul et</p>
                  </div>
                  <Switch
                    checked={chefSettings.auto_accept_orders}
                    onCheckedChange={(checked) =>
                      setChefSettings({ ...chefSettings, auto_accept_orders: checked })
                    }
                  />
                </div>

                <div className="flex items-center justify-between">
                  <div>
                    <Label>Hızlı Teslimat</Label>
                    <p className="text-sm text-muted-foreground">Anında teslimat seçeneği</p>
                  </div>
                  <Switch
                    checked={chefSettings.instant_delivery_available}
                    onCheckedChange={(checked) =>
                      setChefSettings({ ...chefSettings, instant_delivery_available: checked })
                    }
                  />
                </div>

                <div className="flex items-center justify-between">
                  <div>
                    <Label>Randevulu Teslimat</Label>
                    <p className="text-sm text-muted-foreground">İleri tarihli siparişler</p>
                  </div>
                  <Switch
                    checked={chefSettings.scheduled_delivery_available}
                    onCheckedChange={(checked) =>
                      setChefSettings({ ...chefSettings, scheduled_delivery_available: checked })
                    }
                  />
                </div>

                <div className="grid md:grid-cols-2 gap-4 pt-4 border-t">
                  <div>
                    <Label>Minimum Sipariş Tutarı (₺)</Label>
                    <Input
                      type="number"
                      value={chefSettings.min_order_amount}
                      onChange={(e) =>
                        setChefSettings({ ...chefSettings, min_order_amount: e.target.value })
                      }
                    />
                  </div>
                  <div>
                    <Label>Teslimat Yarıçapı (km)</Label>
                    <Input
                      type="number"
                      value={chefSettings.service_radius}
                      onChange={(e) =>
                        setChefSettings({ ...chefSettings, service_radius: e.target.value })
                      }
                    />
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Bildirim Ayarları */}
            <Card>
              <CardHeader>
                <CardTitle>Bildirim Ayarları</CardTitle>
                <CardDescription>Nasıl bildirim almak istediğinizi seçin</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <Label>Ses Bildirimi</Label>
                    <p className="text-sm text-muted-foreground">Yeni sipariş geldiğinde ses çal</p>
                  </div>
                  <Switch
                    checked={chefSettings.notification_sound}
                    onCheckedChange={(checked) =>
                      setChefSettings({ ...chefSettings, notification_sound: checked })
                    }
                  />
                </div>

                <div className="flex items-center justify-between">
                  <div>
                    <Label>E-posta Bildirimi</Label>
                    <p className="text-sm text-muted-foreground">Siparişler için e-posta gönder</p>
                  </div>
                  <Switch
                    checked={chefSettings.notification_email}
                    onCheckedChange={(checked) =>
                      setChefSettings({ ...chefSettings, notification_email: checked })
                    }
                  />
                </div>
              </CardContent>
            </Card>

            {/* İstatistikler ve Raporlar */}
            <Card>
              <CardHeader>
                <CardTitle>İstatistikler ve Raporlar</CardTitle>
                <CardDescription>Performans ve kazanç raporları</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <div className="p-4 bg-orange-50 rounded-lg">
                    <p className="text-sm text-gray-600">Bugünkü Sipariş</p>
                    <p className="text-2xl font-bold text-orange-600">
                      {orders.filter(o => new Date(o.created_at).toDateString() === new Date().toDateString()).length}
                    </p>
                  </div>
                  <div className="p-4 bg-green-50 rounded-lg">
                    <p className="text-sm text-gray-600">Bugünkü Kazanç</p>
                    <p className="text-2xl font-bold text-green-600">
                      {orders
                        .filter(o => new Date(o.created_at).toDateString() === new Date().toDateString())
                        .reduce((sum, o) => sum + Number(o.total_amount), 0)
                        .toFixed(2)} ₺
                    </p>
                  </div>
                  <div className="p-4 bg-blue-50 rounded-lg">
                    <p className="text-sm text-gray-600">Toplam Yemek</p>
                    <p className="text-2xl font-bold text-blue-600">{meals.length}</p>
                  </div>
                  <div className="p-4 bg-purple-50 rounded-lg">
                    <p className="text-sm text-gray-600">Ortalama Puan</p>
                    <p className="text-2xl font-bold text-purple-600">{stats.avgRating.toFixed(1)} ⭐</p>
                  </div>
                </div>
                <div className="pt-4 border-t space-y-2">
                  <Button variant="outline" className="w-full">
                    <TrendingUp className="h-4 w-4 mr-2" />
                    Detaylı Rapor İndir (PDF)
                  </Button>
                  <Button variant="outline" className="w-full">
                    <Package className="h-4 w-4 mr-2" />
                    Aylık Özet Gör
                  </Button>
                </div>
              </CardContent>
            </Card>

            <div className="flex gap-2">
              <Button onClick={handleUpdateChefProfile} className="bg-orange-500 hover:bg-orange-600">
                Ayarları Kaydet
              </Button>
              <Button variant="outline" onClick={fetchChefData}>
                İptal
              </Button>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
    <BottomNav />
    </>
  );
};

export default ChefDashboard;
