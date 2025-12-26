import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { useCart } from "@/contexts/CartContext";
import { supabase } from "@/integrations/supabase/client";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import NeYesemHeader from "@/components/NeYesemHeader";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Separator } from "@/components/ui/separator";
import {
  Star,
  ShoppingCart,
  ChefHat,
  Clock,
  MapPin,
  Heart,
  Share2,
  CheckCircle,
  MessageCircle,
  Info,
  Package,
  Zap,
  Calendar,
  ThumbsUp,
  ThumbsDown,
  Loader2,
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface Meal {
  id: string;
  name: string;
  description: string | null;
  price: number;
  image_url: string | null;
  category: string | null;
  preparation_time: number | null;
  servings: number | null;
  ingredients: string[] | null;
  allergens: string[] | null;
  is_vegan: boolean | null;
  is_vegetarian: boolean | null;
  ready_now: boolean | null;
  chef_profiles: {
    id: string;
    business_name: string;
    city: string | null;
    rating: number | null;
    total_orders: number | null;
    min_order_amount: number | null;
    phone: string | null;
    description: string | null;
  };
}

interface Seller {
  id: string;
  chef_name: string;
  chef_id: string;
  price: number;
  rating: number;
  reviews_count: number;
  city: string;
  prep_time: number;
  min_order?: number;
  delivery_types: string[];
  badges?: string[];
  avatar_url?: string;
}

interface SimilarMeal {
  id: string;
  name: string;
  price: number;
  image_url: string | null;
  rating: number;
}

const FoodDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const { toast } = useToast();
  const { addToCart, getCartCount, cart } = useCart();

  const [meal, setMeal] = useState<Meal | null>(null);
  const [similarMeals, setSimilarMeals] = useState<SimilarMeal[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedSeller, setSelectedSeller] = useState<Seller | null>(null);
  const [quantity, setQuantity] = useState(1);
  const [isFavorite, setIsFavorite] = useState(false);
  const [selectedImage, setSelectedImage] = useState(0);

  useEffect(() => {
    if (id) {
      fetchMealData();
    }
  }, [id]);

  const fetchMealData = async () => {
    try {
      setLoading(true);
      
      // Fetch meal with chef info
      const { data: mealData, error } = await supabase
        .from("meals")
        .select(`
          *,
          chef_profiles!inner(
            id,
            business_name,
            city,
            rating,
            total_orders,
            min_order_amount,
            phone,
            description
          )
        `)
        .eq("id", id)
        .maybeSingle();

      if (error) throw error;

      if (mealData) {
        setMeal(mealData as Meal);
        
        // Create seller from the chef
        const seller: Seller = {
          id: mealData.chef_profiles.id,
          chef_name: mealData.chef_profiles.business_name,
          chef_id: mealData.chef_profiles.id,
          price: Number(mealData.price),
          rating: mealData.chef_profiles.rating || 4.5,
          reviews_count: mealData.chef_profiles.total_orders || 0,
          city: mealData.chef_profiles.city || "İstanbul",
          prep_time: mealData.preparation_time || 30,
          min_order: mealData.chef_profiles.min_order_amount || 0,
          delivery_types: mealData.ready_now ? ["instant", "scheduled"] : ["scheduled"],
          badges: ["Doğrulanmış Şef"],
        };
        setSelectedSeller(seller);

        // Fetch similar meals (same category)
        const { data: similarData } = await supabase
          .from("meals")
          .select(`
            id,
            name,
            price,
            image_url,
            chef_profiles(rating)
          `)
          .eq("category", mealData.category)
          .neq("id", id)
          .eq("is_available", true)
          .limit(6);

        if (similarData) {
          setSimilarMeals(similarData.map((m: any) => ({
            id: m.id,
            name: m.name,
            price: Number(m.price),
            image_url: m.image_url,
            rating: m.chef_profiles?.rating || 4.5,
          })));
        }
      }
    } catch (error) {
      console.error("Error fetching meal:", error);
      toast({
        title: "Hata",
        description: "Yemek bilgileri yüklenirken bir hata oluştu.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleAddToCart = () => {
    if (!selectedSeller || !meal) return;
    
    addToCart({
      id: meal.id,
      name: meal.name,
      description: meal.description || "",
      price: Number(meal.price),
      image_url: meal.image_url || "",
      chef_id: selectedSeller.chef_id,
      chef_name: selectedSeller.chef_name,
      prep_time: meal.preparation_time || 30,
      category: meal.category || "",
    }, quantity);
  };

  // Generate image array from main image
  const images = meal?.image_url 
    ? [meal.image_url, meal.image_url, meal.image_url] 
    : ["https://images.unsplash.com/photo-1504674900247-0877df9cc836?w=800&h=600&fit=crop"];

  if (loading) {
    return (
      <div className="min-h-screen bg-background">
        <Navbar />
        <div className="container mx-auto px-4 py-20 text-center">
          <Loader2 className="h-12 w-12 animate-spin mx-auto text-primary" />
          <p className="mt-4 text-muted-foreground">Yemek bilgileri yükleniyor...</p>
        </div>
        <Footer />
      </div>
    );
  }

  if (!meal) {
    return (
      <div className="min-h-screen bg-background">
        <Navbar />
        <div className="container mx-auto px-4 py-20 text-center">
          <h1 className="text-2xl font-bold mb-4">Yemek Bulunamadı</h1>
          <p className="text-muted-foreground mb-6">Aradığınız yemek mevcut değil.</p>
          <Button onClick={() => navigate("/neyesem")}>Ne Yesem'e Dön</Button>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      
      <NeYesemHeader
        showSearch={false}
        showMapButton={false}
        showFilterButton={false}
        showCartButton={true}
        cart={[]}
      />

      <div className="container mx-auto px-4 py-6 max-w-7xl">
        {/* Breadcrumb */}
        <div className="flex items-center gap-2 text-sm text-muted-foreground mb-6">
          <button onClick={() => navigate("/neyesem")} className="hover:text-primary">
            Ne Yesem
          </button>
          <span>/</span>
          <span className="text-foreground">{meal.name}</span>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Sol Taraf - Görseller */}
          <div className="lg:col-span-1">
            <div className="sticky top-20">
              <div className="relative mb-4 rounded-xl overflow-hidden border">
                <img
                  src={images[selectedImage]}
                  alt={meal.name}
                  className="w-full h-96 object-cover"
                />
                <Button
                  variant="ghost"
                  size="icon"
                  className="absolute top-4 right-4 bg-background/90 hover:bg-background rounded-full"
                  onClick={() => setIsFavorite(!isFavorite)}
                >
                  <Heart className={`h-5 w-5 ${isFavorite ? "fill-red-500 text-red-500" : ""}`} />
                </Button>
                <Button
                  variant="ghost"
                  size="icon"
                  className="absolute top-4 right-16 bg-background/90 hover:bg-background rounded-full"
                >
                  <Share2 className="h-5 w-5" />
                </Button>
              </div>

              <div className="grid grid-cols-3 gap-2">
                {images.map((img, idx) => (
                  <button
                    key={idx}
                    onClick={() => setSelectedImage(idx)}
                    className={`rounded-lg overflow-hidden border-2 transition-all ${
                      selectedImage === idx ? "border-primary" : "border-border"
                    }`}
                  >
                    <img src={img} alt={`${meal.name} ${idx + 1}`} className="w-full h-24 object-cover" />
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Orta ve Sağ - Ürün Detayları */}
          <div className="lg:col-span-2">
            {/* Ürün Başlığı */}
            <div className="mb-6">
              <h1 className="text-3xl font-bold text-foreground mb-2">{meal.name}</h1>
              <div className="flex items-center gap-4 flex-wrap">
                <div className="flex items-center gap-2">
                  <div className="flex items-center gap-1 bg-primary/10 px-3 py-1 rounded-lg">
                    <Star className="h-5 w-5 fill-primary text-primary" />
                    <span className="font-bold text-primary">{meal.chef_profiles.rating?.toFixed(1) || "4.5"}</span>
                  </div>
                  <span className="text-muted-foreground">({meal.chef_profiles.total_orders || 0} sipariş)</span>
                </div>
                <Badge variant="secondary" className="gap-1">
                  <Package className="h-3.5 w-3.5" />
                  {meal.servings || 1} Porsiyon
                </Badge>
                {meal.is_vegan && (
                  <Badge className="bg-green-500 text-white">Vegan</Badge>
                )}
                {meal.is_vegetarian && !meal.is_vegan && (
                  <Badge className="bg-green-600 text-white">Vejetaryen</Badge>
                )}
              </div>
            </div>

            <Separator className="my-6" />

            {/* Şef Bilgisi */}
            {selectedSeller && (
              <Card className="mb-6">
                <CardContent className="p-6">
                  <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
                    <ChefHat className="h-5 w-5 text-primary" />
                    Şef Bilgileri
                  </h2>

                  <div className="p-4 rounded-lg border-2 border-primary bg-primary/5">
                    <div className="flex items-start justify-between gap-4">
                      <div className="flex items-start gap-3 flex-1">
                        <Avatar className="h-12 w-12">
                          <AvatarImage src={selectedSeller.avatar_url} />
                          <AvatarFallback className="bg-primary text-primary-foreground">
                            {selectedSeller.chef_name[0]}
                          </AvatarFallback>
                        </Avatar>

                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-1">
                            <h3 className="font-bold text-foreground">{selectedSeller.chef_name}</h3>
                            <CheckCircle className="h-4 w-4 text-green-500" />
                          </div>

                          <div className="flex items-center gap-3 text-sm text-muted-foreground mb-2">
                            <div className="flex items-center gap-1">
                              <Star className="h-3.5 w-3.5 fill-primary text-primary" />
                              <span className="font-medium">{selectedSeller.rating.toFixed(1)}</span>
                              <span className="text-muted-foreground">({selectedSeller.reviews_count})</span>
                            </div>
                            <span>•</span>
                            <div className="flex items-center gap-1">
                              <MapPin className="h-3.5 w-3.5" />
                              {selectedSeller.city}
                            </div>
                            <span>•</span>
                            <div className="flex items-center gap-1">
                              <Clock className="h-3.5 w-3.5" />
                              {selectedSeller.prep_time} dk
                            </div>
                          </div>

                          <div className="flex gap-1 flex-wrap">
                            {selectedSeller.badges?.map((badge) => (
                              <Badge key={badge} variant="secondary" className="text-xs">
                                {badge}
                              </Badge>
                            ))}
                          </div>

                          <div className="flex items-center gap-2 mt-2">
                            {selectedSeller.delivery_types.includes("instant") && (
                              <Badge className="bg-green-500 text-white text-xs gap-1">
                                <Zap className="h-3 w-3" />
                                Hızlı Teslimat
                              </Badge>
                            )}
                            {selectedSeller.delivery_types.includes("scheduled") && (
                              <Badge className="bg-blue-500 text-white text-xs gap-1">
                                <Calendar className="h-3 w-3" />
                                Randevulu
                              </Badge>
                            )}
                          </div>
                        </div>
                      </div>

                      <div className="text-right">
                        <div className="text-2xl font-bold text-primary mb-1">₺{Number(meal.price).toFixed(2)}</div>
                        {selectedSeller.min_order && selectedSeller.min_order > 0 && (
                          <p className="text-xs text-muted-foreground">Min. ₺{selectedSeller.min_order}</p>
                        )}
                      </div>
                    </div>
                  </div>

                  <div className="mt-6 pt-6 border-t">
                    <div className="flex items-center gap-4">
                      <div className="flex items-center border rounded-lg">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => setQuantity(Math.max(1, quantity - 1))}
                          className="h-10 px-3"
                        >
                          -
                        </Button>
                        <span className="px-4 font-bold">{quantity}</span>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => setQuantity(quantity + 1)}
                          className="h-10 px-3"
                        >
                          +
                        </Button>
                      </div>

                      <Button
                        size="lg"
                        className="flex-1 h-12 text-lg font-bold"
                        onClick={handleAddToCart}
                      >
                        <ShoppingCart className="h-5 w-5 mr-2" />
                        Sepete Ekle - ₺{(Number(meal.price) * quantity).toFixed(2)}
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Tabs */}
            <Tabs defaultValue="description" className="w-full">
              <TabsList className="grid w-full grid-cols-3">
                <TabsTrigger value="description">Açıklama</TabsTrigger>
                <TabsTrigger value="ingredients">Malzemeler</TabsTrigger>
                <TabsTrigger value="info">Bilgiler</TabsTrigger>
              </TabsList>

              <TabsContent value="description" className="mt-6">
                <Card>
                  <CardContent className="p-6">
                    <h3 className="text-xl font-bold mb-4">Ürün Açıklaması</h3>
                    <p className="text-muted-foreground leading-relaxed">
                      {meal.description || "Bu yemek hakkında detaylı bilgi bulunmamaktadır."}
                    </p>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="ingredients" className="mt-6">
                <Card>
                  <CardContent className="p-6">
                    <h3 className="text-xl font-bold mb-4">Malzemeler</h3>
                    {meal.ingredients && meal.ingredients.length > 0 ? (
                      <div className="flex flex-wrap gap-2">
                        {meal.ingredients.map((ing, idx) => (
                          <Badge key={idx} variant="outline" className="px-3 py-1">
                            {ing}
                          </Badge>
                        ))}
                      </div>
                    ) : (
                      <p className="text-muted-foreground">Malzeme bilgisi bulunmamaktadır.</p>
                    )}
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="info" className="mt-6">
                <Card>
                  <CardContent className="p-6">
                    <h3 className="text-xl font-bold mb-4">Ürün Bilgileri</h3>

                    <div className="space-y-4">
                      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                        <div className="bg-muted p-3 rounded-lg text-center">
                          <div className="text-2xl font-bold text-primary">
                            {meal.preparation_time || 30}
                          </div>
                          <div className="text-sm text-muted-foreground">Dakika</div>
                        </div>
                        <div className="bg-muted p-3 rounded-lg text-center">
                          <div className="text-2xl font-bold text-primary">
                            {meal.servings || 1}
                          </div>
                          <div className="text-sm text-muted-foreground">Porsiyon</div>
                        </div>
                        <div className="bg-muted p-3 rounded-lg text-center">
                          <div className="text-2xl font-bold text-primary">
                            {meal.category || "Ana Yemek"}
                          </div>
                          <div className="text-sm text-muted-foreground">Kategori</div>
                        </div>
                        <div className="bg-muted p-3 rounded-lg text-center">
                          <div className="text-2xl font-bold text-primary">
                            {meal.ready_now ? "Evet" : "Hayır"}
                          </div>
                          <div className="text-sm text-muted-foreground">Hızlı Teslimat</div>
                        </div>
                      </div>

                      {meal.allergens && meal.allergens.length > 0 && (
                        <>
                          <Separator />
                          <div>
                            <h4 className="font-bold mb-2 flex items-center gap-2">
                              <Info className="h-5 w-5 text-destructive" />
                              Alerjen Uyarısı
                            </h4>
                            <div className="flex gap-2 flex-wrap">
                              {meal.allergens.map((allergen, idx) => (
                                <Badge key={idx} variant="destructive">
                                  {allergen}
                                </Badge>
                              ))}
                            </div>
                          </div>
                        </>
                      )}
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>

            {/* Benzer Ürünler */}
            {similarMeals.length > 0 && (
              <div className="mt-8">
                <h3 className="text-2xl font-bold mb-4">Benzer Yemekler</h3>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                  {similarMeals.map((product) => (
                    <Card
                      key={product.id}
                      className="cursor-pointer hover:shadow-lg transition-all"
                      onClick={() => navigate(`/neyesem/urun/${product.id}`)}
                    >
                      <img
                        src={product.image_url || "https://images.unsplash.com/photo-1504674900247-0877df9cc836?w=300&h=200&fit=crop"}
                        alt={product.name}
                        className="w-full h-40 object-cover rounded-t-xl"
                      />
                      <CardContent className="p-3">
                        <h4 className="font-bold text-sm mb-1 line-clamp-1">{product.name}</h4>
                        <div className="flex items-center justify-between">
                          <span className="text-lg font-bold text-primary">₺{product.price.toFixed(2)}</span>
                          <div className="flex items-center gap-1">
                            <Star className="h-3 w-3 fill-primary text-primary" />
                            <span className="text-xs font-medium">{product.rating.toFixed(1)}</span>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default FoodDetail;
