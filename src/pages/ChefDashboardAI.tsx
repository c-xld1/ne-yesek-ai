import React, { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { useNeYesemAI } from '@/hooks/useNeYesemAI';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { motion } from 'framer-motion';
import {
  TrendingUp, TrendingDown, DollarSign, ShoppingBag, Star, Clock,
  Calendar, Users, ChefHat, Sparkles, AlertCircle, CheckCircle,
  BarChart3, PieChart, Lightbulb, Target, Wallet, Package
} from 'lucide-react';

interface Analytics {
  overview: {
    totalOrders: number;
    totalRevenue: number;
    avgOrderValue: number;
    avgRating: number;
    trustScore: number;
  };
  topProducts: { id: string; name: string; count: number; revenue: number }[];
  salesByDay: Record<string, number>;
  salesByHour: Record<string, number>;
  bestDay: { day: string; orders: number } | null;
  bestHour: { hour: number; orders: number } | null;
  aiInsights: string[];
  weeklyEarningEstimate: number;
  recentReviews: any[];
}

const ChefDashboardAI: React.FC = () => {
  const { user } = useAuth();
  const { getChefAnalytics } = useNeYesemAI();
  const [chefProfile, setChefProfile] = useState<any>(null);
  const [analytics, setAnalytics] = useState<Analytics | null>(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('overview');

  useEffect(() => {
    if (user) {
      loadChefData();
    }
  }, [user]);

  const loadChefData = async () => {
    try {
      // Şef profilini al
      const { data: profile } = await supabase
        .from('chef_profiles')
        .select('*')
        .eq('user_id', user?.id)
        .single();

      if (profile) {
        setChefProfile(profile);
        
        // AI analitiğini al
        const analyticsData = await getChefAnalytics(profile.id);
        if (analyticsData) {
          setAnalytics(analyticsData);
        }
      }
    } catch (error) {
      console.error('Error loading chef data:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background">
        <Navbar />
        <div className="container mx-auto px-4 py-20 text-center">
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
            className="rounded-full h-16 w-16 border-4 border-primary border-t-transparent mx-auto"
          />
          <p className="mt-4 text-muted-foreground">AI analizi yükleniyor...</p>
        </div>
        <Footer />
      </div>
    );
  }

  if (!chefProfile) {
    return (
      <div className="min-h-screen bg-background">
        <Navbar />
        <div className="container mx-auto px-4 py-20 text-center">
          <ChefHat className="w-16 h-16 mx-auto text-muted-foreground mb-4" />
          <h1 className="text-2xl font-bold mb-2">Şef Profili Bulunamadı</h1>
          <p className="text-muted-foreground mb-4">Önce şef başvurusu yapmanız gerekiyor.</p>
          <Button onClick={() => window.location.href = '/sef-basvuru'}>
            Şef Başvurusu Yap
          </Button>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-muted/30 to-background">
      <Navbar />
      
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
              <h1 className="text-3xl font-bold flex items-center gap-3">
                <Sparkles className="w-8 h-8 text-primary" />
                AI Destekli Şef Paneli
              </h1>
              <p className="text-muted-foreground mt-1">
                Merhaba, {chefProfile.business_name}! İşte AI destekli iş analiziniz.
              </p>
            </div>
            
            <div className="flex items-center gap-3">
              <Badge variant={chefProfile.is_verified ? 'default' : 'secondary'}>
                {chefProfile.is_verified ? '✓ Onaylı Şef' : 'Onay Bekliyor'}
              </Badge>
              <Badge variant="outline">
                Güven Skoru: {chefProfile.trust_score || 100}
              </Badge>
            </div>
          </div>
        </motion.div>

        {/* Quick Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}>
            <Card>
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <DollarSign className="w-8 h-8 text-green-500" />
                  <TrendingUp className="w-4 h-4 text-green-500" />
                </div>
                <p className="text-2xl font-bold mt-2">
                  ₺{analytics?.overview.totalRevenue.toLocaleString() || 0}
                </p>
                <p className="text-sm text-muted-foreground">Toplam Kazanç</p>
              </CardContent>
            </Card>
          </motion.div>

          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}>
            <Card>
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <ShoppingBag className="w-8 h-8 text-blue-500" />
                  <span className="text-sm text-muted-foreground">30 gün</span>
                </div>
                <p className="text-2xl font-bold mt-2">
                  {analytics?.overview.totalOrders || 0}
                </p>
                <p className="text-sm text-muted-foreground">Toplam Sipariş</p>
              </CardContent>
            </Card>
          </motion.div>

          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}>
            <Card>
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <Star className="w-8 h-8 text-yellow-500" />
                  <span className="text-sm text-muted-foreground">Ortalama</span>
                </div>
                <p className="text-2xl font-bold mt-2">
                  {analytics?.overview.avgRating.toFixed(1) || '0.0'}
                </p>
                <p className="text-sm text-muted-foreground">Müşteri Puanı</p>
              </CardContent>
            </Card>
          </motion.div>

          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }}>
            <Card className="border-primary/50 bg-primary/5">
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <Target className="w-8 h-8 text-primary" />
                  <Sparkles className="w-4 h-4 text-primary" />
                </div>
                <p className="text-2xl font-bold mt-2">
                  ₺{analytics?.weeklyEarningEstimate.toLocaleString() || 0}
                </p>
                <p className="text-sm text-muted-foreground">Haftalık Tahmin</p>
              </CardContent>
            </Card>
          </motion.div>
        </div>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <TabsList className="grid grid-cols-4 w-full max-w-xl">
            <TabsTrigger value="overview">Genel</TabsTrigger>
            <TabsTrigger value="insights">AI Önerileri</TabsTrigger>
            <TabsTrigger value="products">Ürünler</TabsTrigger>
            <TabsTrigger value="reviews">Yorumlar</TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-6">
            <div className="grid md:grid-cols-2 gap-6">
              {/* Best Day */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Calendar className="w-5 h-5" />
                    En İyi Gününüz
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  {analytics?.bestDay ? (
                    <div className="text-center py-4">
                      <p className="text-4xl font-bold text-primary">
                        {analytics.bestDay.day}
                      </p>
                      <p className="text-muted-foreground mt-2">
                        {analytics.bestDay.orders} sipariş
                      </p>
                      <p className="text-sm text-muted-foreground mt-4">
                        💡 Bu gün için stok hazırlayın
                      </p>
                    </div>
                  ) : (
                    <p className="text-center text-muted-foreground py-4">
                      Henüz yeterli veri yok
                    </p>
                  )}
                </CardContent>
              </Card>

              {/* Best Hour */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Clock className="w-5 h-5" />
                    En Yoğun Saat
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  {analytics?.bestHour ? (
                    <div className="text-center py-4">
                      <p className="text-4xl font-bold text-primary">
                        {analytics.bestHour.hour}:00
                      </p>
                      <p className="text-muted-foreground mt-2">
                        {analytics.bestHour.orders} sipariş
                      </p>
                      <p className="text-sm text-muted-foreground mt-4">
                        💡 Bu saatte aktif olun
                      </p>
                    </div>
                  ) : (
                    <p className="text-center text-muted-foreground py-4">
                      Henüz yeterli veri yok
                    </p>
                  )}
                </CardContent>
              </Card>
            </div>

            {/* Daily Order Limit */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Package className="w-5 h-5" />
                  Günlük Sipariş Durumu
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex justify-between text-sm">
                    <span>Bugünkü siparişler</span>
                    <span className="font-medium">
                      {chefProfile.current_daily_orders || 0} / {chefProfile.daily_order_limit || 20}
                    </span>
                  </div>
                  <Progress 
                    value={((chefProfile.current_daily_orders || 0) / (chefProfile.daily_order_limit || 20)) * 100} 
                  />
                  <p className="text-sm text-muted-foreground">
                    {chefProfile.current_daily_orders >= chefProfile.daily_order_limit 
                      ? '⚠️ Günlük limite ulaştınız. Yarın tekrar aktif olacaksınız.'
                      : `✅ ${(chefProfile.daily_order_limit || 20) - (chefProfile.current_daily_orders || 0)} sipariş daha alabilirsiniz.`
                    }
                  </p>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="insights" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Lightbulb className="w-5 h-5 text-yellow-500" />
                  AI Destekli İş Önerileri
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {analytics?.aiInsights && analytics.aiInsights.length > 0 ? (
                    analytics.aiInsights.map((insight, index) => (
                      <motion.div
                        key={index}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: index * 0.1 }}
                        className="flex items-start gap-3 p-4 bg-muted/50 rounded-lg"
                      >
                        <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
                          <Sparkles className="w-4 h-4 text-primary" />
                        </div>
                        <div>
                          <p className="font-medium">{insight}</p>
                        </div>
                      </motion.div>
                    ))
                  ) : (
                    <p className="text-center text-muted-foreground py-8">
                      Daha fazla sipariş aldıkça AI size özel öneriler sunacak.
                    </p>
                  )}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="products" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <BarChart3 className="w-5 h-5" />
                  En Çok Satan Ürünler
                </CardTitle>
              </CardHeader>
              <CardContent>
                {analytics?.topProducts && analytics.topProducts.length > 0 ? (
                  <div className="space-y-4">
                    {analytics.topProducts.map((product, index) => (
                      <div key={product.id} className="flex items-center gap-4">
                        <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center font-bold text-primary">
                          {index + 1}
                        </div>
                        <div className="flex-1">
                          <p className="font-medium">{product.name}</p>
                          <p className="text-sm text-muted-foreground">
                            {product.count} satış • ₺{product.revenue.toLocaleString()}
                          </p>
                        </div>
                        <Badge variant="secondary">
                          {Math.round((product.revenue / (analytics?.overview.totalRevenue || 1)) * 100)}%
                        </Badge>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-center text-muted-foreground py-8">
                    Henüz satış verisi yok
                  </p>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="reviews" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Star className="w-5 h-5 text-yellow-500" />
                  Son Müşteri Yorumları
                </CardTitle>
              </CardHeader>
              <CardContent>
                {analytics?.recentReviews && analytics.recentReviews.length > 0 ? (
                  <div className="space-y-4">
                    {analytics.recentReviews.map((review, index) => (
                      <div key={index} className="p-4 bg-muted/50 rounded-lg">
                        <div className="flex items-center gap-2 mb-2">
                          {[...Array(5)].map((_, i) => (
                            <Star 
                              key={i} 
                              className={`w-4 h-4 ${i < review.rating ? 'text-yellow-500 fill-yellow-500' : 'text-muted'}`} 
                            />
                          ))}
                          <span className="text-sm text-muted-foreground ml-2">
                            {new Date(review.created_at).toLocaleDateString('tr-TR')}
                          </span>
                        </div>
                        {review.comment && (
                          <p className="text-sm">{review.comment}</p>
                        )}
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-center text-muted-foreground py-8">
                    Henüz yorum yok
                  </p>
                )}
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
      
      <Footer />
    </div>
  );
};

export default ChefDashboardAI;
