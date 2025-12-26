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
  TrendingUp,
  Heart,
  Share2,
  Award,
  CheckCircle,
  MessageCircle,
  Info,
  Package,
  Zap,
  Calendar,
  ThumbsUp,
  ThumbsDown,
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";

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

interface Review {
  id: string;
  user_name: string;
  rating: number;
  comment: string;
  date: string;
  helpful_count: number;
  verified_purchase: boolean;
}

interface QnA {
  id: string;
  question: string;
  answer?: string;
  user_name: string;
  date: string;
  helpful_count: number;
}

const FoodDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const { toast } = useToast();
  const { addToCart, getCartCount, cart } = useCart();

  const [selectedSeller, setSelectedSeller] = useState<Seller | null>(null);
  const [quantity, setQuantity] = useState(1);
  const [isFavorite, setIsFavorite] = useState(false);

  // Mock data - gerçek uygulamada API'den gelecek
  const foodItem = {
    id: id || "1",
    name: "Ev Yapımı Mantı",
    category: "Ana Yemek",
    image_url: "https://images.unsplash.com/photo-1626645738196-c2a7c87a8f58?w=800&h=600&fit=crop",
    images: [
      "https://images.unsplash.com/photo-1626645738196-c2a7c87a8f58?w=800&h=600&fit=crop",
      "https://images.unsplash.com/photo-1604908176997-125f25cc6f3d?w=800&h=600&fit=crop",
      "https://images.unsplash.com/photo-1630409346732-b9b0c4ce3b72?w=800&h=600&fit=crop",
    ],
    description: "El açması hamur ile hazırlanan, yoğurt ve tereyağlı sos ile servis edilen geleneksel Türk mantısı. Taze malzemelerle hazırlanır.",
    average_rating: 4.8,
    total_reviews: 156,
    portion_size: "1 Porsiyon (300g)",
    ingredients: ["Un", "Et", "Yumurta", "Yoğurt", "Tereyağı", "Baharatlar"],
    allergens: ["Gluten", "Süt Ürünleri"],
    nutritional_info: {
      calories: 450,
      protein: 25,
      carbs: 55,
      fat: 15,
    },
  };

  const sellers: Seller[] = [
    {
      id: "1",
      chef_name: "Ayşe Ana'nın Mutfağı",
      chef_id: "chef1",
      price: 85.0,
      rating: 4.9,
      reviews_count: 234,
      city: "İstanbul",
      prep_time: 30,
      min_order: 50,
      delivery_types: ["instant", "scheduled"],
      badges: ["Yeni Üye", "Hızlı Teslimat"],
      avatar_url: "https://api.dicebear.com/7.x/avataaars/svg?seed=ayse",
    },
    {
      id: "2",
      chef_name: "Zeynep'in Sofrası",
      chef_id: "chef2",
      price: 89.9,
      rating: 4.8,
      reviews_count: 189,
      city: "Ankara",
      prep_time: 40,
      delivery_types: ["instant", "scheduled"],
      badges: ["Çok Satan", "Doğrulanmış Şef"],
      avatar_url: "https://api.dicebear.com/7.x/avataaars/svg?seed=zeynep",
    },
    {
      id: "3",
      chef_name: "Mehmet Usta",
      chef_id: "chef3",
      price: 95.0,
      rating: 4.7,
      reviews_count: 145,
      city: "İzmir",
      prep_time: 35,
      delivery_types: ["scheduled"],
      badges: ["Doğrulanmış Şef"],
      avatar_url: "https://api.dicebear.com/7.x/avataaars/svg?seed=mehmet",
    },
  ];

  const reviews: Review[] = [
    {
      id: "1",
      user_name: "Fatma K.",
      rating: 5,
      comment: "Harika bir lezzet! Mantılar çok nefis, yoğurt sosu da mükemmeldi. Kesinlikle tekrar sipariş vereceğim.",
      date: "2025-11-05",
      helpful_count: 24,
      verified_purchase: true,
    },
    {
      id: "2",
      user_name: "Ahmet Y.",
      rating: 4,
      comment: "Güzel bir ürün. Hamuru biraz daha ince olabilirdi ama genel olarak memnunum.",
      date: "2025-11-02",
      helpful_count: 12,
      verified_purchase: true,
    },
    {
      id: "3",
      user_name: "Elif S.",
      rating: 5,
      comment: "Ev yapımı lezzeti hissedilen harika bir mantı. Porsiyonu da oldukça doyurucu.",
      date: "2025-10-28",
      helpful_count: 18,
      verified_purchase: true,
    },
  ];

  const qnas: QnA[] = [
    {
      id: "1",
      question: "Mantılar dondurulmuş mu geliyor yoksa taze mi?",
      answer: "Mantılarımız sipariş anında hazırlanıp taze olarak gönderilmektedir. Dondurulmuş değildir.",
      user_name: "Mehmet A.",
      date: "2025-11-01",
      helpful_count: 45,
    },
    {
      id: "2",
      question: "Vegan versiyonu var mı?",
      answer: "Maalesef şu anda vegan versiyonumuz bulunmamaktadır. Ancak talepler doğrultusunda yakında menümüze ekleyeceğiz.",
      user_name: "Ayşe K.",
      date: "2025-10-25",
      helpful_count: 23,
    },
  ];

  const similarProducts = [
    {
      id: "2",
      name: "Kayseri Mantısı",
      price: 78.0,
      image: "https://images.unsplash.com/photo-1604908176997-125f25cc6f3d?w=300&h=200&fit=crop",
      rating: 4.7,
    },
    {
      id: "3",
      name: "Su Böreği",
      price: 65.0,
      image: "https://images.unsplash.com/photo-1612871689223-90e56e44c6d7?w=300&h=200&fit=crop",
      rating: 4.6,
    },
    {
      id: "4",
      name: "Erişte",
      price: 55.0,
      image: "https://images.unsplash.com/photo-1551183053-bf91a1d81141?w=300&h=200&fit=crop",
      rating: 4.5,
    },
  ];

  useEffect(() => {
    if (sellers.length > 0) {
      setSelectedSeller(sellers[0]); // En uygun fiyatlıyı seç
    }
  }, []);

  const handleAddToCart = () => {
    if (!selectedSeller) return;
    
    addToCart({
      id: foodItem.id + "-" + selectedSeller.id,
      name: foodItem.name,
      description: foodItem.description,
      price: selectedSeller.price,
      image_url: foodItem.image_url,
      chef_id: selectedSeller.chef_id,
      chef_name: selectedSeller.chef_name,
      prep_time: selectedSeller.prep_time,
      category: foodItem.category,
    }, quantity);
  };

  const [selectedImage, setSelectedImage] = useState(0);

  return (
    <div className="min-h-screen bg-white">
      <Navbar />
      
      {/* NeYesem Header */}
      <NeYesemHeader
        showSearch={false}
        showMapButton={false}
        showFilterButton={false}
        showCartButton={true}
        cart={[]}
      />

      <div className="container mx-auto px-4 py-6 max-w-7xl">
        {/* Breadcrumb */}
        <div className="flex items-center gap-2 text-sm text-gray-600 mb-6">
          <button onClick={() => navigate("/neyesem")} className="hover:text-orange-600">
            Ne Yesem
          </button>
          <span>/</span>
          <span className="text-gray-900">{foodItem.name}</span>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Sol Taraf - Görseller */}
          <div className="lg:col-span-1">
            <div className="sticky top-20">
              {/* Ana Görsel */}
              <div className="relative mb-4 rounded-xl overflow-hidden border">
                <img
                  src={foodItem.images[selectedImage]}
                  alt={foodItem.name}
                  className="w-full h-96 object-cover"
                />
                <Button
                  variant="ghost"
                  size="icon"
                  className="absolute top-4 right-4 bg-white/90 hover:bg-white rounded-full"
                  onClick={() => setIsFavorite(!isFavorite)}
                >
                  <Heart className={`h-5 w-5 ${isFavorite ? "fill-red-500 text-red-500" : ""}`} />
                </Button>
                <Button
                  variant="ghost"
                  size="icon"
                  className="absolute top-4 right-16 bg-white/90 hover:bg-white rounded-full"
                >
                  <Share2 className="h-5 w-5" />
                </Button>
              </div>

              {/* Küçük Görseller */}
              <div className="grid grid-cols-3 gap-2">
                {foodItem.images.map((img, idx) => (
                  <button
                    key={idx}
                    onClick={() => setSelectedImage(idx)}
                    className={`rounded-lg overflow-hidden border-2 transition-all ${
                      selectedImage === idx ? "border-orange-500" : "border-gray-200"
                    }`}
                  >
                    <img src={img} alt={`${foodItem.name} ${idx + 1}`} className="w-full h-24 object-cover" />
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Orta - Ürün Detayları */}
          <div className="lg:col-span-2">
            {/* Ürün Başlığı */}
            <div className="mb-6">
              <h1 className="text-3xl font-bold text-gray-900 mb-2">{foodItem.name}</h1>
              <div className="flex items-center gap-4 flex-wrap">
                <div className="flex items-center gap-2">
                  <div className="flex items-center gap-1 bg-orange-50 px-3 py-1 rounded-lg">
                    <Star className="h-5 w-5 fill-orange-400 text-orange-400" />
                    <span className="font-bold text-orange-700">{foodItem.average_rating}</span>
                  </div>
                  <span className="text-gray-600">({foodItem.total_reviews} değerlendirme)</span>
                </div>
                <Badge variant="secondary" className="gap-1">
                  <Package className="h-3.5 w-3.5" />
                  {foodItem.portion_size}
                </Badge>
              </div>
            </div>

            <Separator className="my-6" />

            {/* Buybox - Ürünün Diğer Satıcıları */}
            <Card className="mb-6">
              <CardContent className="p-6">
                <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
                  <ChefHat className="h-5 w-5 text-orange-500" />
                  Ürünü Satın Alabileceğiniz Şefler ({sellers.length})
                </h2>

                <div className="space-y-3">
                  {sellers.map((seller) => (
                    <div
                      key={seller.id}
                      className={`p-4 rounded-lg border-2 transition-all cursor-pointer ${
                        selectedSeller?.id === seller.id
                          ? "border-orange-500 bg-orange-50"
                          : "border-gray-200 hover:border-gray-300"
                      }`}
                      onClick={() => setSelectedSeller(seller)}
                    >
                      <div className="flex items-start justify-between gap-4">
                        <div className="flex items-start gap-3 flex-1">
                          <Avatar className="h-12 w-12">
                            <AvatarImage src={seller.avatar_url} />
                            <AvatarFallback>{seller.chef_name[0]}</AvatarFallback>
                          </Avatar>

                          <div className="flex-1">
                            <div className="flex items-center gap-2 mb-1">
                              <h3 className="font-bold text-gray-900">{seller.chef_name}</h3>
                              {seller.badges && seller.badges.includes("Doğrulanmış Şef") && (
                                <CheckCircle className="h-4 w-4 text-green-500" />
                              )}
                            </div>

                            <div className="flex items-center gap-3 text-sm text-gray-600 mb-2">
                              <div className="flex items-center gap-1">
                                <Star className="h-3.5 w-3.5 fill-orange-400 text-orange-400" />
                                <span className="font-medium">{seller.rating}</span>
                                <span className="text-gray-400">({seller.reviews_count})</span>
                              </div>
                              <span>•</span>
                              <div className="flex items-center gap-1">
                                <MapPin className="h-3.5 w-3.5" />
                                {seller.city}
                              </div>
                              <span>•</span>
                              <div className="flex items-center gap-1">
                                <Clock className="h-3.5 w-3.5" />
                                {seller.prep_time} dk
                              </div>
                            </div>

                            {seller.badges && (
                              <div className="flex gap-1 flex-wrap">
                                {seller.badges.map((badge) => (
                                  <Badge key={badge} variant="secondary" className="text-xs">
                                    {badge}
                                  </Badge>
                                ))}
                              </div>
                            )}

                            <div className="flex items-center gap-2 mt-2">
                              {seller.delivery_types.includes("instant") && (
                                <Badge className="bg-green-500 text-white text-xs gap-1">
                                  <Zap className="h-3 w-3" />
                                  Hızlı
                                </Badge>
                              )}
                              {seller.delivery_types.includes("scheduled") && (
                                <Badge className="bg-blue-500 text-white text-xs gap-1">
                                  <Calendar className="h-3 w-3" />
                                  Randevulu
                                </Badge>
                              )}
                            </div>
                          </div>
                        </div>

                        <div className="text-right">
                          <div className="text-2xl font-bold text-orange-600 mb-1">₺{seller.price.toFixed(2)}</div>
                          {seller.min_order && (
                            <p className="text-xs text-gray-500">Min. ₺{seller.min_order}</p>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>

                {selectedSeller && (
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
                        className="flex-1 bg-orange-500 hover:bg-orange-600 h-12 text-lg font-bold"
                        onClick={handleAddToCart}
                      >
                        <ShoppingCart className="h-5 w-5 mr-2" />
                        Sepete Ekle - ₺{(selectedSeller.price * quantity).toFixed(2)}
                      </Button>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Tabs - Değerlendirmeler, S&C, Bilgiler */}
            <Tabs defaultValue="description" className="w-full">
              <TabsList className="grid w-full grid-cols-4">
                <TabsTrigger value="description">Açıklama</TabsTrigger>
                <TabsTrigger value="reviews">Değerlendirmeler ({reviews.length})</TabsTrigger>
                <TabsTrigger value="qna">Soru & Cevap ({qnas.length})</TabsTrigger>
                <TabsTrigger value="info">Bilgiler</TabsTrigger>
              </TabsList>

              <TabsContent value="description" className="mt-6">
                <Card>
                  <CardContent className="p-6">
                    <h3 className="text-xl font-bold mb-4">Ürün Açıklaması</h3>
                    <p className="text-gray-700 leading-relaxed mb-6">{foodItem.description}</p>

                    <h4 className="font-bold mb-2">İçindekiler:</h4>
                    <div className="flex flex-wrap gap-2">
                      {foodItem.ingredients.map((ing) => (
                        <Badge key={ing} variant="outline">
                          {ing}
                        </Badge>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="reviews" className="mt-6">
                <Card>
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between mb-6">
                      <h3 className="text-xl font-bold">Ürün Değerlendirmeleri</h3>
                      <Button variant="outline">Değerlendirme Yaz</Button>
                    </div>

                    <div className="space-y-4">
                      {reviews.map((review) => (
                        <div key={review.id} className="pb-4 border-b last:border-0">
                          <div className="flex items-start justify-between mb-2">
                            <div>
                              <div className="flex items-center gap-2 mb-1">
                                <span className="font-bold">{review.user_name}</span>
                                {review.verified_purchase && (
                                  <Badge variant="secondary" className="text-xs gap-1">
                                    <CheckCircle className="h-3 w-3" />
                                    Onaylı Alıcı
                                  </Badge>
                                )}
                              </div>
                              <div className="flex items-center gap-2">
                                <div className="flex">
                                  {[...Array(5)].map((_, i) => (
                                    <Star
                                      key={i}
                                      className={`h-4 w-4 ${
                                        i < review.rating ? "fill-orange-400 text-orange-400" : "text-gray-300"
                                      }`}
                                    />
                                  ))}
                                </div>
                                <span className="text-sm text-gray-500">{review.date}</span>
                              </div>
                            </div>
                          </div>
                          <p className="text-gray-700 mb-3">{review.comment}</p>
                          <div className="flex items-center gap-4 text-sm">
                            <button className="flex items-center gap-1 text-gray-600 hover:text-orange-600">
                              <ThumbsUp className="h-4 w-4" />
                              Faydalı ({review.helpful_count})
                            </button>
                            <button className="flex items-center gap-1 text-gray-600 hover:text-orange-600">
                              <ThumbsDown className="h-4 w-4" />
                              Faydalı Değil
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="qna" className="mt-6">
                <Card>
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between mb-6">
                      <h3 className="text-xl font-bold">Soru & Cevap</h3>
                      <Button variant="outline">
                        <MessageCircle className="h-4 w-4 mr-2" />
                        Soru Sor
                      </Button>
                    </div>

                    <div className="space-y-4">
                      {qnas.map((qna) => (
                        <div key={qna.id} className="pb-4 border-b last:border-0">
                          <div className="bg-orange-50 p-4 rounded-lg mb-3">
                            <div className="flex items-start gap-2">
                              <MessageCircle className="h-5 w-5 text-orange-500 flex-shrink-0 mt-0.5" />
                              <div className="flex-1">
                                <p className="font-medium text-gray-900">{qna.question}</p>
                                <div className="text-xs text-gray-500 mt-1">
                                  {qna.user_name} - {qna.date}
                                </div>
                              </div>
                            </div>
                          </div>
                          {qna.answer && (
                            <div className="pl-7">
                              <p className="text-gray-700 mb-2">{qna.answer}</p>
                              <button className="flex items-center gap-1 text-sm text-gray-600 hover:text-orange-600">
                                <ThumbsUp className="h-3 w-3" />
                                Faydalı ({qna.helpful_count})
                              </button>
                            </div>
                          )}
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="info" className="mt-6">
                <Card>
                  <CardContent className="p-6">
                    <h3 className="text-xl font-bold mb-4">Ürün Bilgileri</h3>

                    <div className="space-y-4">
                      <div>
                        <h4 className="font-bold mb-2">Besin Değerleri (100g)</h4>
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                          <div className="bg-gray-50 p-3 rounded-lg text-center">
                            <div className="text-2xl font-bold text-orange-600">
                              {foodItem.nutritional_info.calories}
                            </div>
                            <div className="text-sm text-gray-600">Kalori</div>
                          </div>
                          <div className="bg-gray-50 p-3 rounded-lg text-center">
                            <div className="text-2xl font-bold text-orange-600">
                              {foodItem.nutritional_info.protein}g
                            </div>
                            <div className="text-sm text-gray-600">Protein</div>
                          </div>
                          <div className="bg-gray-50 p-3 rounded-lg text-center">
                            <div className="text-2xl font-bold text-orange-600">
                              {foodItem.nutritional_info.carbs}g
                            </div>
                            <div className="text-sm text-gray-600">Karbonhidrat</div>
                          </div>
                          <div className="bg-gray-50 p-3 rounded-lg text-center">
                            <div className="text-2xl font-bold text-orange-600">
                              {foodItem.nutritional_info.fat}g
                            </div>
                            <div className="text-sm text-gray-600">Yağ</div>
                          </div>
                        </div>
                      </div>

                      <Separator />

                      <div>
                        <h4 className="font-bold mb-2 flex items-center gap-2">
                          <Info className="h-5 w-5 text-orange-500" />
                          Alerjen Uyarısı
                        </h4>
                        <div className="flex gap-2">
                          {foodItem.allergens.map((allergen) => (
                            <Badge key={allergen} variant="destructive">
                              {allergen}
                            </Badge>
                          ))}
                        </div>
                      </div>

                      <Separator />

                      <div>
                        <h4 className="font-bold mb-2">Kategori</h4>
                        <Badge variant="outline" className="text-base px-4 py-2">
                          {foodItem.category}
                        </Badge>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>

            {/* Benzer Ürünler */}
            <div className="mt-8">
              <h3 className="text-2xl font-bold mb-4">Benzer Ürünler</h3>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                {similarProducts.map((product) => (
                  <Card
                    key={product.id}
                    className="cursor-pointer hover:shadow-lg transition-all"
                    onClick={() => navigate(`/neyesem/urun/${product.id}`)}
                  >
                    <img
                      src={product.image}
                      alt={product.name}
                      className="w-full h-40 object-cover rounded-t-xl"
                    />
                    <CardContent className="p-3">
                      <h4 className="font-bold text-sm mb-1 line-clamp-1">{product.name}</h4>
                      <div className="flex items-center justify-between">
                        <span className="text-lg font-bold text-orange-600">₺{product.price}</span>
                        <div className="flex items-center gap-1">
                          <Star className="h-3 w-3 fill-orange-400 text-orange-400" />
                          <span className="text-xs font-medium">{product.rating}</span>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default FoodDetail;
