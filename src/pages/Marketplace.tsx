import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { ShoppingCart, MapPin, Clock, Star, Search } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface Meal {
  id: string;
  name: string;
  description: string;
  price: number;
  chef_id: string;
  category: string;
  image_url?: string;
  servings: number;
  preparation_time?: number;
  chef_profiles: {
    business_name: string;
    city: string;
    rating: number;
  };
}

const Marketplace = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [meals, setMeals] = useState<Meal[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [cart, setCart] = useState<{ [key: string]: number }>({});

  useEffect(() => {
    fetchMeals();
  }, []);

  const fetchMeals = async () => {
    try {
      const { data, error } = await supabase
        .from('meals')
        .select(`
          *,
          chef_profiles:chef_id (
            business_name,
            city,
            rating
          )
        `)
        .eq('is_available', true)
        .order('created_at', { ascending: false });

      if (error) throw error;
      setMeals(data || []);
    } catch (error: any) {
      toast({
        variant: "destructive",
        title: "Hata",
        description: "Yemekler yüklenirken bir hata oluştu."
      });
    } finally {
      setLoading(false);
    }
  };

  const addToCart = (mealId: string) => {
    setCart(prev => ({
      ...prev,
      [mealId]: (prev[mealId] || 0) + 1
    }));
    toast({
      title: "Sepete Eklendi",
      description: "Ürün sepetinize eklendi."
    });
  };

  const filteredMeals = meals.filter(meal =>
    meal.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    meal.description?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    meal.category?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const cartCount = Object.values(cart).reduce((sum, count) => sum + count, 0);

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 via-white to-rose-50">
      <Navbar />

      <div className="container mx-auto px-4 py-8">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-4xl font-bold bg-gradient-to-r from-orange-600 to-rose-600 bg-clip-text text-transparent">
              Ev Yapımı Lezzetler
            </h1>
            <p className="text-muted-foreground mt-2">
              Yerel şeflerimizden taze, evde hazırlanmış yemekler sipariş edin
            </p>
          </div>
          <Button className="bg-gradient-to-r from-orange-500 to-rose-500">
            <ShoppingCart className="mr-2 h-4 w-4" />
            Sepet ({cartCount})
          </Button>
        </div>

        <div className="mb-6">
          <div className="relative max-w-md">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
            <Input
              placeholder="Yemek, şef veya kategori ara..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
        </div>

        {loading ? (
          <div className="text-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-500 mx-auto"></div>
            <p className="mt-4 text-muted-foreground">Yükleniyor...</p>
          </div>
        ) : filteredMeals.length === 0 ? (
          <Card>
            <CardContent className="py-12 text-center">
              <p className="text-muted-foreground">
                {searchTerm ? "Arama sonucu bulunamadı." : "Henüz yemek bulunmuyor."}
              </p>
            </CardContent>
          </Card>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredMeals.map((meal) => (
              <Card key={meal.id} className="hover:shadow-lg transition-shadow">
                <CardHeader>
                  {meal.image_url && (
                    <img
                      src={meal.image_url}
                      alt={meal.name}
                      className="w-full h-48 object-cover rounded-lg mb-4"
                    />
                  )}
                  <CardTitle className="flex justify-between items-start">
                    <span>{meal.name}</span>
                    <span className="text-orange-600 font-bold">₺{meal.price}</span>
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <p className="text-sm text-muted-foreground line-clamp-2">
                    {meal.description}
                  </p>

                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <MapPin className="h-4 w-4" />
                    {meal.chef_profiles?.business_name} • {meal.chef_profiles?.city}
                  </div>

                  <div className="flex items-center gap-4 text-sm">
                    {meal.preparation_time && (
                      <div className="flex items-center gap-1">
                        <Clock className="h-4 w-4" />
                        {meal.preparation_time} dk
                      </div>
                    )}
                    <div className="flex items-center gap-1">
                      <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                      {meal.chef_profiles?.rating || 5.0}
                    </div>
                  </div>

                  {meal.category && (
                    <Badge variant="secondary">{meal.category}</Badge>
                  )}

                  <Button
                    onClick={() => addToCart(meal.id)}
                    className="w-full bg-gradient-to-r from-orange-500 to-rose-500"
                    disabled={!user}
                  >
                    {user ? "Sepete Ekle" : "Giriş Yapın"}
                  </Button>
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

export default Marketplace;