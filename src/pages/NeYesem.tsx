import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import FilterSidebar from "@/components/FilterSidebar";
import CategorySlider from "@/components/CategorySlider";
import PromotionSlider from "@/components/PromotionSlider";
import BannerSlider from "@/components/BannerSlider";
import PopularChefsSlider from "@/components/PopularChefsSlider";
import FeaturedDishesSlider from "@/components/FeaturedDishesSlider";
import AdBanner from "@/components/AdBanner";
import CartDropdown from "@/components/CartDropdown";
import NeYesemHeader from "@/components/NeYesemHeader";
import NeYesemHeroStats from "@/components/NeYesemHeroStats";
import NeYesemQuickActions from "@/components/NeYesemQuickActions";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { motion } from "framer-motion";
import { 
  ShoppingCart, Search, Filter, X, Sparkles,
  ChefHat, TrendingUp, Clock, Star, MapPin, Zap, Calendar, Heart, ArrowRight
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";

// Mock Data
const mockBanners = [
  { id: "1", image_url: "https://images.unsplash.com/photo-1504674900247-0877df9cc836?w=1200&h=400&fit=crop", title: "Ev Yapımı Lezzetler", subtitle: "200+ ev şefinden taze yemekler kapınızda", cta: "Keşfet" },
  { id: "2", image_url: "https://images.unsplash.com/photo-1476224203421-9ac39bcb3327?w=1200&h=400&fit=crop", title: "Taze ve Sağlıklı", subtitle: "Organik malzemelerle hazırlanan özel tarifler", cta: "Sipariş Ver" },
  { id: "3", image_url: "https://images.unsplash.com/photo-1455619452474-d2be8b1e70cd?w=1200&h=400&fit=crop", title: "Şeflerimizden Özel Tarifler", subtitle: "Profesyonel lezzetler ev sıcaklığında", cta: "Şefleri Gör" },
];

const mockPromotions = [
  {
    id: "1",
    title: "İlk Siparişe %30 İndirim",
    description: "Yeni üyelere özel ilk siparişinizde %30 indirim kazanın!",
    discount: 30,
    code: "ILKSIPARIS30",
    valid_until: "2025-12-31",
    type: "percentage" as const,
  },
  {
    id: "2",
    title: "Hafta İçi Fırsatı",
    description: "Pazartesi-Cuma arası tüm siparişlerde %15 indirim",
    discount: 15,
    code: "HAFTAICI15",
    valid_until: "2025-12-31",
    type: "percentage" as const,
  },
  {
    id: "3",
    title: "Ücretsiz Teslimat",
    description: "150 TL ve üzeri siparişlerde kargo bedava!",
    discount: 100,
    valid_until: "2025-12-31",
    type: "gift" as const,
  },
];

const categories = [
  { id: "tavuk", label: "Tavuk", icon: "🍗", count: 45 },
  { id: "et", label: "Et", icon: "🥩", count: 38 },
  { id: "köfte", label: "Köfte", icon: "🍖", count: 28 },
  { id: "balık", label: "Balık", icon: "🐟", count: 22 },
  { id: "vegan", label: "Vegan", icon: "🥗", count: 31 },
  { id: "tatlı", label: "Tatlı", icon: "🍰", count: 42 },
  { id: "çorba", label: "Çorba", icon: "🍲", count: 19 },
  { id: "makarna", label: "Makarna", icon: "🍝", count: 25 },
  { id: "pizza", label: "Pizza", icon: "🍕", count: 15 },
  { id: "burger", label: "Burger", icon: "🍔", count: 18 },
];

interface Chef {
  id: string;
  business_name: string;
  bio?: string;
  city: string;
  average_rating: number;
  total_reviews: number;
  badges?: string[];
  specialty?: string[];
  average_prep_time?: number;
  minimum_order_amount?: number;
  is_accepting_orders?: boolean;
  order_count?: number;
  profiles?: {
    username: string;
    avatar_url?: string;
  };
}

interface MenuItem {
  id: string;
  slug?: string;
  name: string;
  description: string;
  category: string;
  price: number;
  image_url: string;
  portion_size: string;
  prep_time: number;
  average_rating: number;
  order_count?: number;
  instant_delivery?: boolean;
  scheduled_delivery?: boolean;
  chef_profiles?: {
    id?: string;
    slug?: string;
    business_name: string;
    city: string;
  };
}

const NeYesem = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();
  
  const [chefs, setChefs] = useState<Chef[]>([]);
  const [menuItems, setMenuItems] = useState<MenuItem[]>([]);
  const [filteredItems, setFilteredItems] = useState<MenuItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [showFilters, setShowFilters] = useState(false);
  const [showCartDropdown, setShowCartDropdown] = useState(false);
  const [cart, setCart] = useState<MenuItem[]>([]);
  const [filters, setFilters] = useState({
    categories: [] as string[],
    priceRange: [0, 500] as [number, number],
    deliveryTypes: [] as string[],
    selectedChef: null as string | null,
    rating: 0,
    distance: 10,
  });

  useEffect(() => {
    fetchData();
  }, []);

  useEffect(() => {
    filterItems();
  }, [searchQuery, selectedCategory, filters, menuItems]);

  const fetchData = async () => {
    try {
      // Fetch chefs - simplified
      const { data: chefsData } = await supabase
        .from("chef_profiles")
        .select("*")
        .eq("is_verified", true)
        .eq("is_active", true)
        .limit(20);

      if (chefsData) {
        setChefs(chefsData as any);
      }

      // Mock menu items
      const mockMenuItems: MenuItem[] = [
        {
          id: "1",
          slug: "izgara-tavuk",
          name: "Izgara Tavuk",
          description: "Özel baharatlarla marine edilmiş, fırında pişirilmiş tavuk göğsü",
          category: "tavuk",
          price: 89.90,
          image_url: "https://images.unsplash.com/photo-1598103442097-8b74394b95c6?w=400&h=300&fit=crop",
          portion_size: "1 porsiyon",
          prep_time: 30,
          average_rating: 4.8,
          order_count: 127,
          instant_delivery: true,
          scheduled_delivery: true,
          chef_profiles: { id: "1", slug: "zeynep-mutfak", business_name: "Zeynep'in Mutfağı", city: "İstanbul" }
        },
        {
          id: "2",
          slug: "etli-kuru-fasulye",
          name: "Etli Kuru Fasulye",
          description: "Geleneksel tarif ile pişirilmiş, pilav ile servis edilir",
          category: "et",
          price: 75.00,
          image_url: "https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=400&h=300&fit=crop",
          portion_size: "1 porsiyon",
          prep_time: 45,
          average_rating: 4.9,
          order_count: 203,
          instant_delivery: false,
          scheduled_delivery: true,
          chef_profiles: { id: "2", slug: "ayse-ana-sofrasi", business_name: "Ayşe Ana'nın Sofrası", city: "Ankara" }
        },
        {
          id: "3",
          slug: "izmir-kofte",
          name: "İzmir Köfte",
          description: "Ev yapımı köfte, patates ve domates ile fırında pişirilir",
          category: "köfte",
          price: 95.00,
          image_url: "https://images.unsplash.com/photo-1529042410759-befb1204b468?w=400&h=300&fit=crop",
          portion_size: "4 adet",
          prep_time: 35,
          average_rating: 4.7,
          order_count: 156,
          instant_delivery: true,
          scheduled_delivery: true,
          chef_profiles: { business_name: "Mehmet Usta", city: "İzmir" }
        },
        {
          id: "4",
          name: "Vegan Buddha Bowl",
          description: "Kinoa, nohut, avokado ve taze sebzelerle hazırlanmış besleyici kase",
          category: "vegan",
          price: 68.00,
          image_url: "https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=400&h=300&fit=crop",
          portion_size: "1 kase",
          prep_time: 20,
          average_rating: 4.6,
          order_count: 89,
          instant_delivery: true,
          scheduled_delivery: false,
          chef_profiles: { business_name: "Yeşil Mutfak", city: "İstanbul" }
        },
        {
          id: "5",
          name: "Karışık Izgara",
          description: "Tavuk, köfte, et, sucuk ve sebzeler",
          category: "et",
          price: 135.00,
          image_url: "https://images.unsplash.com/photo-1555939594-58d7cb561ad1?w=400&h=300&fit=crop",
          portion_size: "2 kişilik",
          prep_time: 40,
          average_rating: 4.9,
          order_count: 312,
          instant_delivery: true,
          scheduled_delivery: true,
          chef_profiles: { business_name: "Mangal Keyfi", city: "Bursa" }
        },
        {
          id: "6",
          name: "Fırın Sütlaç",
          description: "Fırında pişirilmiş, üzeri karamelize geleneksel sütlaç",
          category: "tatlı",
          price: 45.00,
          image_url: "https://images.unsplash.com/photo-1488477181946-6428a0291777?w=400&h=300&fit=crop",
          portion_size: "1 kase",
          prep_time: 15,
          average_rating: 4.8,
          order_count: 178,
          instant_delivery: true,
          scheduled_delivery: false,
          chef_profiles: { business_name: "Tatlı Dünya", city: "İstanbul" }
        },
      ];

      setMenuItems(mockMenuItems);
      setFilteredItems(mockMenuItems);

    } catch (error) {
      console.error("Error:", error);
    } finally {
      setLoading(false);
    }
  };

  const filterItems = () => {
    let filtered = [...menuItems];

    // Delivery type filter
    if (filters.deliveryTypes.length > 0) {
      filtered = filtered.filter(item => {
        if (filters.deliveryTypes.includes("hizli") && item.instant_delivery) return true;
        if (filters.deliveryTypes.includes("randevulu") && item.scheduled_delivery) return true;
        return false;
      });
    }

    if (searchQuery) {
      const normalizeText = (text: string) => 
        text.toLocaleLowerCase('tr-TR').normalize('NFC');
      
      const normalizedQuery = normalizeText(searchQuery);
      
      filtered = filtered.filter(item =>
        normalizeText(item.name).includes(normalizedQuery) ||
        normalizeText(item.description || '').includes(normalizedQuery) ||
        normalizeText(item.chef_profiles?.business_name || '').includes(normalizedQuery)
      );
    }

    if (selectedCategory) {
      filtered = filtered.filter(item => item.category === selectedCategory);
    }

    if (filters.categories.length > 0) {
      filtered = filtered.filter(item => filters.categories.includes(item.category));
    }

    filtered = filtered.filter(item => 
      item.price >= filters.priceRange[0] && item.price <= filters.priceRange[1]
    );

    if (filters.rating > 0) {
      filtered = filtered.filter(item => item.average_rating >= filters.rating);
    }

    setFilteredItems(filtered);
  };

  const addToCart = (item: MenuItem) => {
    setCart([...cart, item]);
    toast({
      title: "Sepete Eklendi ✓",
      description: `${item.name} sepetinize eklendi`,
    });
  };

  const removeFromCart = (itemId: string) => {
    // Remove all instances of this item
    setCart(cart.filter(item => item.id !== itemId));
    toast({
      title: "Sepetten Çıkarıldı",
      description: "Ürün sepetinizden kaldırıldı",
    });
  };

  const updateCartQuantity = (itemId: string, newQuantity: number) => {
    const itemsOfType = cart.filter(item => item.id === itemId);
    const currentQuantity = itemsOfType.length;
    
    if (newQuantity > currentQuantity) {
      // Add more items
      const itemToAdd = itemsOfType[0];
      const itemsToAdd = Array(newQuantity - currentQuantity).fill(itemToAdd);
      setCart([...cart, ...itemsToAdd]);
    } else if (newQuantity < currentQuantity) {
      // Remove items
      const itemsToRemove = currentQuantity - newQuantity;
      let removed = 0;
      const newCart = cart.filter(item => {
        if (item.id === itemId && removed < itemsToRemove) {
          removed++;
          return false;
        }
        return true;
      });
      setCart(newCart);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-orange-50 via-background to-red-50/30">
        <Navbar />
        <div className="container mx-auto px-4 py-20 text-center">
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
            className="rounded-full h-16 w-16 border-4 border-primary border-t-transparent mx-auto"
          />
          <p className="mt-4 text-muted-foreground text-lg font-medium">Lezzetler yükleniyor...</p>
        </div>
        <Footer />
      </div>
    );
  }

  const popularChefs = chefs.slice(0, 8);
  const featuredDishes = menuItems.slice(0, 6);

  const handleFilterDeliveryType = (type: string) => {
    const newTypes = filters.deliveryTypes.includes(type)
      ? filters.deliveryTypes.filter(t => t !== type)
      : [...filters.deliveryTypes, type];
    setFilters({ ...filters, deliveryTypes: newTypes });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50/50 via-background to-red-50/30">
      <Navbar />
      
      {/* NeYesem Header Component */}
      <NeYesemHeader
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
        cart={cart}
        showCartDropdown={showCartDropdown}
        onCartToggle={() => setShowCartDropdown(!showCartDropdown)}
        onCartClose={() => setShowCartDropdown(false)}
        onRemoveItem={removeFromCart}
        onUpdateQuantity={updateCartQuantity}
        onShowFilters={() => setShowFilters(true)}
        filterCount={filters.categories.length + filters.deliveryTypes.length + (filters.rating > 0 ? 1 : 0)}
      />

      {/* Hero Banner Slider */}
      <section className="border-b bg-gradient-to-b from-background to-muted/30">
        <div className="max-w-7xl mx-auto px-4 py-6">
          <BannerSlider banners={mockBanners} />
        </div>
      </section>

      {/* Stats Section */}
      <section className="border-b bg-background/50 backdrop-blur-sm">
        <div className="max-w-7xl mx-auto px-4 py-6">
          <NeYesemHeroStats />
        </div>
      </section>

      <div className="flex max-w-7xl mx-auto">
        {/* Filter Sidebar - Left Side */}
        <div className="hidden lg:block lg:w-80 flex-shrink-0 border-r sticky top-0 h-[100vh] bg-background/50 backdrop-blur-sm">
          <FilterSidebar
            isOpen={true}
            onClose={() => {}}
            filters={filters}
            onFilterChange={setFilters}
            chefs={chefs}
          />
        </div>

        {/* Main Content */}
        <div className="flex-1 min-w-0 px-4 lg:px-8 py-6 space-y-8">
        
        {/* Quick Actions */}
        <section>
          <NeYesemQuickActions onFilterDeliveryType={handleFilterDeliveryType} />
        </section>

        {/* Promotions Slider */}
        <section>
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl md:text-2xl font-bold text-foreground flex items-center gap-2">
              <Sparkles className="h-5 w-5 text-primary" />
              Kampanyalar
            </h2>
            <Button variant="ghost" size="sm" className="text-primary hover:text-primary/80 gap-1">
              Tümü <ArrowRight className="h-4 w-4" />
            </Button>
          </div>
          <PromotionSlider promotions={mockPromotions} />
        </section>

        {/* Categories Slider */}
        <section>
          <div className="mb-4">
            <h2 className="text-xl md:text-2xl font-bold text-foreground">
              Kategoriler
            </h2>
            <p className="text-sm text-muted-foreground mt-1">Ne yemek istersin?</p>
          </div>
          <CategorySlider 
            categories={categories} 
            selectedCategory={selectedCategory}
            onSelectCategory={(id) => setSelectedCategory(id === "all" ? null : id)}
          />
        </section>

        {/* Active Filters Display */}
        {(filters.categories.length > 0 || filters.rating > 0 || selectedCategory || filters.deliveryTypes.length > 0) && (
          <section className="animate-fadeIn">
            <div className="flex flex-wrap gap-2 items-center">
              <span className="text-sm font-medium text-gray-600">Aktif Filtreler:</span>
              {selectedCategory && (
                <Badge variant="secondary" className="px-3 py-1 text-xs">
                  {categories.find(c => c.id === selectedCategory)?.icon} {categories.find(c => c.id === selectedCategory)?.label}
                  <button onClick={() => setSelectedCategory(null)} className="ml-2">×</button>
                </Badge>
              )}
              {filters.categories.map(cat => (
                <Badge key={cat} variant="secondary" className="px-3 py-1 text-xs">
                  {categories.find(c => c.id === cat)?.icon} {categories.find(c => c.id === cat)?.label}
                  <button 
                    onClick={() => setFilters({...filters, categories: filters.categories.filter(c => c !== cat)})}
                    className="ml-2"
                  >
                    ×
                  </button>
                </Badge>
              ))}
              {filters.deliveryTypes.includes("hizli") && (
                <Badge variant="secondary" className="px-3 py-1 text-xs gap-1">
                  <Zap className="h-3 w-3" /> Hızlı
                  <button onClick={() => setFilters({...filters, deliveryTypes: filters.deliveryTypes.filter(t => t !== "hizli")})} className="ml-2">×</button>
                </Badge>
              )}
              {filters.deliveryTypes.includes("randevulu") && (
                <Badge variant="secondary" className="px-3 py-1 text-xs gap-1">
                  <Calendar className="h-3 w-3" /> Randevulu
                  <button onClick={() => setFilters({...filters, deliveryTypes: filters.deliveryTypes.filter(t => t !== "randevulu")})} className="ml-2">×</button>
                </Badge>
              )}
              {filters.rating > 0 && (
                <Badge variant="secondary" className="px-3 py-1 text-xs gap-1">
                  <Star className="h-3 w-3" /> {filters.rating}+
                  <button onClick={() => setFilters({...filters, rating: 0})} className="ml-2">×</button>
                </Badge>
              )}
              <Button
                variant="ghost"
                size="sm"
                onClick={() => {
                  setSelectedCategory(null);
                  setFilters({
                    categories: [],
                    priceRange: [0, 500],
                    deliveryTypes: [],
                    selectedChef: null,
                    rating: 0,
                    distance: 10,
                  });
                }}
                className="text-xs text-orange-600 hover:text-orange-700"
              >
                Tümünü Temizle
              </Button>
            </div>
          </section>
        )}

        {/* Ad Banner 1 */}
        <section className="animate-fadeIn">
          <AdBanner
            title="Mutfak Ekipmanlarında %50'ye Varan İndirim"
            description="Profesyonel mutfak araç gereçlerinde özel fırsatlar sizleri bekliyor!"
            imageUrl="https://images.unsplash.com/photo-1556910103-1c02745aae4d?w=1200&h=400&fit=crop"
            link="https://example.com"
            sponsor="MutfakDünyası"
          />
        </section>

        {/* Popular Chefs Slider */}
        {popularChefs.length > 0 && (
          <section>
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl md:text-2xl font-bold text-foreground flex items-center gap-2">
                <TrendingUp className="h-5 w-5 text-primary" />
                Popüler Şefler
              </h2>
              <Button 
                variant="ghost" 
                size="sm"
                onClick={() => navigate('/sefler')}
                className="text-primary hover:text-primary/80 gap-1"
              >
                Tümü <ArrowRight className="h-4 w-4" />
              </Button>
            </div>
            <PopularChefsSlider chefs={popularChefs} />
          </section>
        )}

        {/* Ad Banner 2 */}
        <section>
          <AdBanner
            title="Organik Baharatlar ve Özel Soslar"
            description="Yemeklerinize lezzet katacak özel ürünler şimdi çok uygun fiyatlarla!"
            imageUrl="https://images.unsplash.com/photo-1596040033229-a0b4b4493b67?w=1200&h=400&fit=crop"
            link="https://example.com"
            sponsor="BaharatSepeti"
          />
        </section>

        {/* Featured Dishes Slider */}
        <section>
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl md:text-2xl font-bold text-foreground flex items-center gap-2">
              <Star className="h-5 w-5 text-primary fill-primary" />
              Öne Çıkan Yemekler
            </h2>
          </div>
          <FeaturedDishesSlider dishes={featuredDishes} onAddToCart={addToCart} />
        </section>

        {/* Ad Banner 3 */}
        <section>
          <AdBanner
            title="Premium Gıda Ürünleri İlk Siparişte %30 İndirim"
            description="Taze ve organik gıda ürünleri kapınıza kadar geliyor!"
            imageUrl="https://images.unsplash.com/photo-1542838132-92c53300491e?w=1200&h=400&fit=crop"
            link="https://example.com"
            sponsor="TazeMarket"
          />
        </section>

        {/* All Menu Items Grid */}
        <section>
          <div className="flex items-center justify-between mb-5">
            <div>
              <h2 className="text-xl md:text-2xl font-bold text-foreground">
                Tüm Yemekler
              </h2>
              <p className="text-sm text-muted-foreground">
                {filteredItems.length} sonuç bulundu
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5">
            {filteredItems.map((item, index) => (
              <motion.div
                key={item.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.05 }}
              >
                <Card 
                  className="group hover:shadow-xl transition-all duration-300 overflow-hidden border border-border/50 rounded-2xl bg-card cursor-pointer hover:-translate-y-1"
                  onClick={() => navigate(`/neyesem/urun/${item.slug || item.id}`)}
                >
                  <div className="relative h-48 overflow-hidden">
                    <img
                      src={item.image_url}
                      alt={item.name}
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                    />
                    
                    {/* Gradient overlay */}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                    
                    {/* Favorite button */}
                    <button 
                      onClick={(e) => e.stopPropagation()}
                      className="absolute top-3 right-3 p-2 rounded-full bg-background/80 backdrop-blur-sm hover:bg-background transition-colors opacity-0 group-hover:opacity-100"
                    >
                      <Heart className="h-4 w-4 text-muted-foreground hover:text-red-500 transition-colors" />
                    </button>
                    
                    {/* Top Badges */}
                    <div className="absolute top-3 left-3 flex gap-1.5">
                      {item.order_count && item.order_count > 100 && (
                        <Badge className="bg-red-500 text-white text-xs px-2 py-1 shadow-lg">
                          <TrendingUp className="h-3 w-3 mr-1" /> Popüler
                        </Badge>
                      )}
                      {item.average_rating >= 4.7 && (
                        <Badge className="bg-primary text-primary-foreground text-xs px-2 py-1 gap-1 shadow-lg">
                          <Star className="h-3 w-3 fill-current" />
                          {item.average_rating}
                        </Badge>
                      )}
                    </div>

                    {/* Delivery Type Badges */}
                    <div className="absolute bottom-3 left-3 flex gap-1.5">
                      {item.instant_delivery && (
                        <Badge className="bg-green-500 text-white text-xs px-2 py-1 gap-1 shadow-lg">
                          <Zap className="h-3 w-3" /> Hızlı
                        </Badge>
                      )}
                      {item.scheduled_delivery && (
                        <Badge className="bg-blue-500 text-white text-xs px-2 py-1 gap-1 shadow-lg">
                          <Calendar className="h-3 w-3" /> Randevulu
                        </Badge>
                      )}
                    </div>

                    {/* Price Badge */}
                    <div className="absolute bottom-3 right-3 bg-background/95 backdrop-blur-sm px-3 py-1.5 rounded-xl shadow-lg">
                      <span className="text-lg font-bold text-primary">₺{item.price}</span>
                    </div>
                  </div>

                  <CardContent className="p-4">
                    <h3 className="font-bold text-base text-foreground mb-2 line-clamp-1">
                      {item.name}
                    </h3>
                    
                    {item.chef_profiles && (
                      <div 
                        className="flex items-center gap-2 mb-2 text-xs text-muted-foreground hover:text-primary cursor-pointer transition-colors"
                        onClick={(e) => {
                          e.stopPropagation();
                          navigate(`/sef/${item.chef_profiles?.slug || item.chef_profiles?.id}`);
                        }}
                      >
                        <div className="flex items-center gap-1 flex-1 min-w-0">
                          <ChefHat className="h-3.5 w-3.5 text-primary" />
                          <span className="truncate font-medium">{item.chef_profiles.business_name}</span>
                        </div>
                        <div className="flex items-center gap-0.5">
                          <MapPin className="h-3 w-3" />
                          <span>{item.chef_profiles.city}</span>
                        </div>
                      </div>
                    )}

                    <p className="text-muted-foreground text-xs mb-3 line-clamp-2">
                      {item.description}
                    </p>

                    <div className="flex items-center gap-2 mb-3">
                      <Badge variant="secondary" className="text-xs px-2 py-0.5">
                        {categories.find(c => c.id === item.category)?.icon}
                      </Badge>
                      <Badge variant="outline" className="text-xs gap-1 px-2 py-0.5">
                        <Clock className="h-3 w-3" />
                        {item.prep_time}dk
                      </Badge>
                    </div>

                    <Button
                      onClick={(e) => {
                        e.stopPropagation();
                        addToCart(item);
                      }}
                      className="w-full bg-primary hover:bg-primary/90 h-10 rounded-xl text-sm font-semibold gap-2"
                    >
                      <ShoppingCart className="h-4 w-4" />
                      Sepete Ekle
                    </Button>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>

          {filteredItems.length === 0 && (
            <Card className="p-12 text-center border-dashed">
              <div className="text-gray-300 mb-4">
                <Search className="h-16 w-16 mx-auto" />
              </div>
              <h3 className="text-lg font-bold text-gray-700 mb-2">
                Sonuç Bulunamadı
              </h3>
              <p className="text-gray-500 text-sm mb-4">
                Arama kriterlerinize uygun yemek bulunamadı
              </p>
              <Button
                size="sm"
                onClick={() => {
                  setSearchQuery("");
                  setSelectedCategory(null);
                  setFilters({
                    categories: [],
                    priceRange: [0, 500],
                    deliveryTypes: [],
                    selectedChef: null,
                    rating: 0,
                    distance: 10,
                  });
                }}
                className="bg-orange-500 hover:bg-orange-600"
              >
                Filtreleri Temizle
              </Button>
            </Card>
          )}
        </section>

        </div>
      </div>

      {/* Mobile Filter Sidebar */}
      <div className="lg:hidden">
        <FilterSidebar
          isOpen={showFilters}
          onClose={() => setShowFilters(false)}
          filters={filters}
          onFilterChange={setFilters}
          chefs={chefs}
        />
      </div>

      {/* Floating Cart Button - Minimalist */}
      {cart.length > 0 && (
        <div className="fixed bottom-6 right-6 z-40">
          <Button
            className="h-14 w-14 rounded-full shadow-xl bg-orange-500 hover:bg-orange-600 relative hover:scale-105 transition-transform"
            onClick={() => toast({ 
              title: "Sepetiniz", 
              description: `${cart.length} ürün sepetinizde`,
              duration: 2000
            })}
          >
            <ShoppingCart className="h-5 w-5" />
            <Badge className="absolute -top-2 -right-2 bg-red-500 h-6 w-6 rounded-full flex items-center justify-center text-xs font-bold shadow-md">
              {cart.length}
            </Badge>
          </Button>
        </div>
      )}

      <Footer />
    </div>
  );
};

export default NeYesem;
