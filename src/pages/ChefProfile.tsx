import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import NeYesemHeader from "@/components/NeYesemHeader";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Separator } from "@/components/ui/separator";
import {
  Star, MapPin, Clock, Zap, Calendar, Award,
  Search, ShoppingCart, TrendingUp, Phone, Mail,
  CheckCircle, DollarSign, Truck, MessageSquare,
  ChefHat, Heart, Share2
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface ChefProfile {
  id: string;
  slug: string;
  business_name: string;
  full_name: string;
  bio: string;
  city: string;
  district: string;
  phone: string;
  email: string;
  avatar_url?: string;
  cover_image?: string;
  average_rating: number;
  total_reviews: number;
  total_orders: number;
  minimum_order: number;
  delivery_fee: number;
  preparation_time: number;
  is_verified: boolean;
  is_active: boolean;
  specialties: string[];
  badges: string[];
}

interface MenuItem {
  id: string;
  slug: string;
  name: string;
  description: string;
  category: string;
  price: number;
  image_url?: string;
  portion_size: string;
  prep_time: number;
  average_rating: number;
  instant_delivery: boolean;
  scheduled_delivery: boolean;
}

interface Review {
  id: string;
  user_name: string;
  user_avatar?: string;
  rating: number;
  comment: string;
  created_at: string;
  helpful_count: number;
}

interface Promotion {
  id: string;
  title: string;
  description: string;
  discount: number;
  code: string;
  valid_until: string;
}

const ChefDashboard = () => {
  const { slug } = useParams<{ slug: string }>();
  const navigate = useNavigate();
  const { toast } = useToast();

  const [chef, setChef] = useState<ChefProfile | null>(null);
  const [menuItems, setMenuItems] = useState<MenuItem[]>([]);
  const [reviews, setReviews] = useState<Review[]>([]);
  const [promotions, setPromotions] = useState<Promotion[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string>("all");
  const [cart, setCart] = useState<MenuItem[]>([]);

  useEffect(() => {
    fetchChefData();
  }, [slug]);

  const fetchChefData = async () => {
    try {
      // Mock data for now
      const mockChef: ChefProfile = {
        id: "1",
        slug: slug || "ahmet-usta",
        business_name: "Ahmet Usta'nın Mutfağı",
        full_name: "Ahmet Yılmaz",
        bio: "20 yıllık deneyimimle geleneksel Türk mutfağının en lezzetli tariflerini evinize getiriyorum. Taze malzemeler, hijyenik ortam ve özenle hazırlanmış yemekler...",
        city: "İstanbul",
        district: "Kadıköy",
        phone: "+90 532 123 45 67",
        email: "ahmet@example.com",
        avatar_url: "https://images.unsplash.com/photo-1577219491135-ce391730fb2c?w=200&h=200&fit=crop",
        cover_image: "https://images.unsplash.com/photo-1556910103-1c02745aae4d?w=1200&h=400&fit=crop",
        average_rating: 4.8,
        total_reviews: 234,
        total_orders: 1542,
        minimum_order: 50,
        delivery_fee: 15,
        preparation_time: 45,
        is_verified: true,
        is_active: true,
        specialties: ["Türk Mutfağı", "Et Yemekleri", "Köfte", "Izgara"],
        badges: ["Süper Şef", "Hızlı Teslimat", "En Çok Tercih Edilen"]
      };

      const mockMenuItems: MenuItem[] = [
        {
          id: "1",
          slug: "ev-yapimi-kofte",
          name: "Ev Yapımı Köfte",
          description: "Özel baharatlarla marine edilmiş, ızgarada pişirilmiş köfte, patates kızartması ve salata ile",
          category: "et",
          price: 85.00,
          image_url: "https://images.unsplash.com/photo-1529042410759-befb1204b468?w=400&h=300&fit=crop",
          portion_size: "1 porsiyon (6 adet)",
          prep_time: 30,
          average_rating: 4.9,
          instant_delivery: true,
          scheduled_delivery: true
        },
        {
          id: "2",
          slug: "karisik-izgara",
          name: "Karışık Izgara",
          description: "Tavuk, köfte, et, sucuk ve sebzeler",
          category: "et",
          price: 135.00,
          image_url: "https://images.unsplash.com/photo-1555939594-58d7cb561ad1?w=400&h=300&fit=crop",
          portion_size: "2 kişilik",
          prep_time: 40,
          average_rating: 4.8,
          instant_delivery: true,
          scheduled_delivery: true
        },
        {
          id: "3",
          slug: "tavuk-sote",
          name: "Tavuk Sote",
          description: "Tereyağında sotelemiş tavuk göğsü, mantarlı ve sebzeli",
          category: "tavuk",
          price: 75.00,
          image_url: "https://images.unsplash.com/photo-1598103442097-8b74394b95c6?w=400&h=300&fit=crop",
          portion_size: "1 porsiyon",
          prep_time: 25,
          average_rating: 4.7,
          instant_delivery: true,
          scheduled_delivery: false
        }
      ];

      const mockReviews: Review[] = [
        {
          id: "1",
          user_name: "Ayşe K.",
          user_avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Ayse",
          rating: 5,
          comment: "Köfteler muhteşemdi! Tam kıvamında ve lezzeti harika. Kesinlikle tekrar sipariş vereceğim.",
          created_at: "2024-01-15",
          helpful_count: 12
        },
        {
          id: "2",
          user_name: "Mehmet S.",
          user_avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Mehmet",
          rating: 4,
          comment: "Teslimat hızlıydı, yemekler sıcak geldi. Porsiyonlar doyurucuydu.",
          created_at: "2024-01-10",
          helpful_count: 8
        }
      ];

      const mockPromotions: Promotion[] = [
        {
          id: "1",
          title: "İlk Siparişe %20 İndirim",
          description: "Benden ilk siparişinizde %20 indirim kazanın!",
          discount: 20,
          code: "ILKSIPARIS20",
          valid_until: "2025-12-31"
        }
      ];

      setChef(mockChef);
      setMenuItems(mockMenuItems);
      setReviews(mockReviews);
      setPromotions(mockPromotions);
    } catch (error) {
      console.error("Error fetching chef data:", error);
    } finally {
      setLoading(false);
    }
  };

  const filteredMenuItems = menuItems.filter(item => {
    const matchesSearch = item.name.toLocaleLowerCase('tr-TR').includes(searchQuery.toLocaleLowerCase('tr-TR')) ||
                         item.description.toLocaleLowerCase('tr-TR').includes(searchQuery.toLocaleLowerCase('tr-TR'));
    const matchesCategory = selectedCategory === "all" || item.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const instantDeliveryItems = filteredMenuItems.filter(item => item.instant_delivery);
  const scheduledDeliveryItems = filteredMenuItems.filter(item => item.scheduled_delivery);

  const addToCart = (item: MenuItem) => {
    setCart([...cart, item]);
    toast({
      title: "Sepete Eklendi ✓",
      description: `${item.name} sepetinize eklendi`,
    });
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-white">
        <Navbar />
        <div className="container mx-auto px-4 py-20 text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-4 border-orange-500 mx-auto"></div>
          <p className="mt-4 text-gray-600 text-lg font-medium">Şef bilgileri yükleniyor...</p>
        </div>
        <Footer />
      </div>
    );
  }

  if (!chef) {
    return (
      <div className="min-h-screen bg-white">
        <Navbar />
        <div className="container mx-auto px-4 py-20 text-center">
          <p className="text-gray-600 text-lg">Şef bulunamadı</p>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white">
      <Navbar />
      
      {/* Yemeksepeti Style - Ultra Clean Header */}
      <div className="bg-white border-b">
        <div className="max-w-5xl mx-auto px-4 py-4">
          <div className="flex items-center gap-4">
            {/* Simple Avatar */}
            <div className="w-16 h-16 rounded-lg overflow-hidden bg-gray-100 flex-shrink-0">
              {chef.avatar_url ? (
                <img src={chef.avatar_url} alt={chef.business_name} className="w-full h-full object-cover" />
              ) : (
                <div className="w-full h-full flex items-center justify-center bg-orange-500 text-white text-xl font-bold">
                  {chef.business_name.charAt(0)}
                </div>
              )}
            </div>

            {/* Simple Info */}
            <div className="flex-1">
              <div className="flex items-center gap-2 mb-1">
                <h1 className="text-xl font-semibold text-gray-900">{chef.business_name}</h1>
                {chef.is_verified && (
                  <CheckCircle className="h-4 w-4 text-blue-500" />
                )}
              </div>
              <div className="flex items-center gap-2 text-sm text-gray-500">
                <span className="flex items-center gap-1">
                  <MapPin className="h-3 w-3" />
                  {chef.district}, {chef.city}
                </span>
                <span>•</span>
                <span className="flex items-center gap-1">
                  <Star className="h-3 w-3 fill-orange-400 text-orange-400" />
                  {chef.average_rating}
                </span>
                <span>•</span>
                <span>{chef.total_orders} sipariş</span>
              </div>
            </div>
          </div>

            {/* Page header actions - contact / follow / order */}
            <div className="flex items-center justify-between mt-3">
              <div className="flex items-center gap-4 text-sm text-gray-600">
                <a href={`tel:${chef.phone}`} className="flex items-center gap-2 hover:underline">
                  <Phone className="h-4 w-4 text-gray-500" />
                  <span>{chef.phone}</span>
                </a>
                <a href={`mailto:${chef.email}`} className="flex items-center gap-2 hover:underline">
                  <Mail className="h-4 w-4 text-gray-500" />
                  <span>{chef.email}</span>
                </a>
                <div className="hidden sm:flex items-center gap-2 text-xs text-gray-500">
                  <span className="px-2 py-1 bg-gray-100 rounded">Min sipariş: {chef.minimum_order} ₺</span>
                  <span className="px-2 py-1 bg-gray-100 rounded">Servis: {chef.delivery_fee} ₺</span>
                  <span className="px-2 py-1 bg-gray-100 rounded">Hazırlık: {chef.preparation_time} dk</span>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <Button variant="ghost" size="sm" className="h-8 w-8 p-0 flex items-center justify-center">
                  <Heart className="h-4 w-4 text-gray-600" />
                </Button>
                <Button variant="ghost" size="sm" className="h-8 w-8 p-0 flex items-center justify-center">
                  <Share2 className="h-4 w-4 text-gray-600" />
                </Button>
                <Button size="sm" className="bg-orange-500 hover:bg-orange-600 text-white h-8 px-4">
                  Sipariş Ver
                </Button>
              </div>
            </div>
        </div>
      </div>

      {/* Main Content - Yemeksepeti Style */}
      <div className="max-w-5xl mx-auto px-4 py-6">
        
        {/* Simple Category Tabs - Yemeksepeti Style */}
        <Tabs defaultValue="all" className="w-full">
          <div className="border-b mb-6">
            <TabsList className="bg-transparent h-auto p-0 space-x-6">
              <TabsTrigger 
                value="all" 
                onClick={() => setSelectedCategory("all")}
                className="bg-transparent border-b-2 border-transparent data-[state=active]:border-orange-500 data-[state=active]:bg-transparent rounded-none px-2 py-3 text-sm font-medium"
              >
                Tüm Yemekler
              </TabsTrigger>
              <TabsTrigger 
                value="instant"
                className="bg-transparent border-b-2 border-transparent data-[state=active]:border-orange-500 data-[state=active]:bg-transparent rounded-none px-2 py-3 text-sm font-medium"
              >
                Hızlı Teslimat
              </TabsTrigger>
              <TabsTrigger 
                value="scheduled"
                className="bg-transparent border-b-2 border-transparent data-[state=active]:border-orange-500 data-[state=active]:bg-transparent rounded-none px-2 py-3 text-sm font-medium"
              >
                Randevulu
              </TabsTrigger>
            </TabsList>
          </div>

          {/* All Items - Yemeksepeti Grid Style */}
          <TabsContent value="all">
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
              {filteredMenuItems.map((item) => (
                <div key={item.id} className="bg-white border border-gray-200 rounded-lg overflow-hidden hover:shadow-md transition-shadow cursor-pointer group">
                  {/* Image */}
                  <div className="relative aspect-square overflow-hidden bg-gray-100">
                    {item.image_url ? (
                      <img
                        src={item.image_url}
                        alt={item.name}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center">
                        <span className="text-4xl">🍽️</span>
                      </div>
                    )}
                  </div>
                  
                  {/* Content */}
                  <div className="p-3">
                    <h3 className="font-medium text-sm text-gray-900 line-clamp-2 mb-1 min-h-[2.5rem]">
                      {item.name}
                    </h3>
                    
                    <div className="flex items-center gap-1 text-xs text-gray-500 mb-2">
                      <Clock className="h-3 w-3" />
                      <span>{item.prep_time} dk</span>
                      <span>•</span>
                      <span>{item.portion_size}</span>
                    </div>

                    <div className="flex items-center justify-between">
                      <span className="text-base font-semibold text-gray-900">
                        {item.price.toFixed(2)} ₺
                      </span>
                      <Button
                        onClick={() => addToCart(item)}
                        size="sm"
                        className="bg-orange-500 hover:bg-orange-600 h-7 px-3 text-xs"
                      >
                        Ekle
                      </Button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </TabsContent>

          {/* Instant Delivery - Same Clean Grid */}
          <TabsContent value="instant">
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
              {instantDeliveryItems.map((item) => (
                <div key={item.id} className="bg-white border border-gray-200 rounded-lg overflow-hidden hover:shadow-md transition-shadow cursor-pointer">
                  <div className="relative aspect-square overflow-hidden bg-gray-100">
                    {item.image_url && (
                      <img src={item.image_url} alt={item.name} className="w-full h-full object-cover" />
                    )}
                    <Badge className="absolute top-2 left-2 bg-green-500 text-xs">
                      <Zap className="h-3 w-3" />
                    </Badge>
                  </div>
                  <div className="p-3">
                    <h3 className="font-medium text-sm text-gray-900 line-clamp-2 mb-1 min-h-[2.5rem]">{item.name}</h3>
                    <div className="flex items-center gap-1 text-xs text-gray-500 mb-2">
                      <Clock className="h-3 w-3" />
                      <span>{item.prep_time} dk</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-base font-semibold text-gray-900">{item.price.toFixed(2)} ₺</span>
                      <Button onClick={() => addToCart(item)} size="sm" className="bg-orange-500 hover:bg-orange-600 h-7 px-3 text-xs">
                        Ekle
                      </Button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </TabsContent>

          {/* Scheduled Delivery - Same Clean Grid */}
          <TabsContent value="scheduled">
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
              {scheduledDeliveryItems.map((item) => (
                <div key={item.id} className="bg-white border border-gray-200 rounded-lg overflow-hidden hover:shadow-md transition-shadow cursor-pointer">
                  <div className="relative aspect-square overflow-hidden bg-gray-100">
                    {item.image_url && (
                      <img src={item.image_url} alt={item.name} className="w-full h-full object-cover" />
                    )}
                    <Badge className="absolute top-2 left-2 bg-blue-500 text-xs">
                      <Calendar className="h-3 w-3" />
                    </Badge>
                  </div>
                  <div className="p-3">
                    <h3 className="font-medium text-sm text-gray-900 line-clamp-2 mb-1 min-h-[2.5rem]">{item.name}</h3>
                    <div className="flex items-center gap-1 text-xs text-gray-500 mb-2">
                      <Clock className="h-3 w-3" />
                      <span>{item.prep_time} dk</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-base font-semibold text-gray-900">{item.price.toFixed(2)} ₺</span>
                      <Button onClick={() => addToCart(item)} size="sm" className="bg-orange-500 hover:bg-orange-600 h-7 px-3 text-xs">
                        Ekle
                      </Button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </TabsContent>
        </Tabs>

        {/* Reviews Section */}
        <Card className="mt-8 border-0 bg-white/80">
          <CardContent className="p-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-bold flex items-center gap-2">
                <MessageSquare className="h-5 w-5 text-orange-600" />
                Değerlendirmeler
              </h2>
              <Button variant="outline" size="sm">Yorum Yaz</Button>
            </div>

            <div className="space-y-3">
              {reviews.map((review) => (
                <Card key={review.id} className="bg-gray-50/50 border-0">
                  <CardContent className="p-4">
                    <div className="flex gap-3">
                      <Avatar className="h-10 w-10">
                        <AvatarImage src={review.user_avatar} alt={review.user_name} />
                        <AvatarFallback className="text-sm">{review.user_name.charAt(0)}</AvatarFallback>
                      </Avatar>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between mb-1">
                          <p className="font-semibold text-sm">{review.user_name}</p>
                        </div>
                        <div className="flex items-center gap-2 text-xs text-gray-500 mb-2">
                          <div className="flex">
                            {Array.from({ length: 5 }).map((_, i) => (
                              <Star
                                key={i}
                                className={`h-3 w-3 ${
                                  i < review.rating
                                    ? "fill-yellow-400 text-yellow-400"
                                    : "text-gray-300"
                                }`}
                              />
                            ))}
                          </div>
                          <span>•</span>
                          <span>{new Date(review.created_at).toLocaleDateString('tr-TR')}</span>
                        </div>
                        <p className="text-gray-700 text-sm mb-2">{review.comment}</p>
                        <Button variant="ghost" size="sm" className="text-xs h-7 px-2">
                          Yararlı ({review.helpful_count})
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      <Footer />
    </div>
  );
};

export default ChefDashboard;
