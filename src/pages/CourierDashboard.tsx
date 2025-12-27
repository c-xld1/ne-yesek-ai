import React, { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Switch } from '@/components/ui/switch';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { motion } from 'framer-motion';
import {
  MapPin, Navigation, Package, Clock, DollarSign, Star,
  Phone, CheckCircle, XCircle, Truck, User, AlertTriangle
} from 'lucide-react';
import { toast } from 'sonner';

interface CourierRoute {
  id: string;
  order_id: string;
  pickup_latitude: number;
  pickup_longitude: number;
  delivery_latitude: number;
  delivery_longitude: number;
  estimated_pickup_time: string;
  estimated_delivery_time: string;
  distance_km: number;
  status: string;
  route_order: number;
  orders?: {
    id: string;
    total_amount: number;
    delivery_address: string;
    notes: string;
    status: string;
    chef_profiles?: {
      business_name: string;
      phone: string;
      address: string;
    };
  };
}

const CourierDashboard: React.FC = () => {
  const { user } = useAuth();
  const [courierProfile, setCourierProfile] = useState<any>(null);
  const [activeRoutes, setActiveRoutes] = useState<CourierRoute[]>([]);
  const [completedToday, setCompletedToday] = useState(0);
  const [loading, setLoading] = useState(true);
  const [isOnline, setIsOnline] = useState(false);

  useEffect(() => {
    if (user) {
      loadCourierData();
    }
  }, [user]);

  const loadCourierData = async () => {
    try {
      // Kurye profilini al
      const { data: profile } = await supabase
        .from('couriers')
        .select('*')
        .eq('user_id', user?.id)
        .single();

      if (profile) {
        setCourierProfile(profile);
        setIsOnline(profile.status === 'available');

        // Aktif rotaları al
        const { data: routes } = await supabase
          .from('courier_routes')
          .select(`
            *,
            orders (
              id, total_amount, delivery_address, notes, status,
              chef_profiles (business_name, phone, address)
            )
          `)
          .eq('courier_id', profile.id)
          .in('status', ['assigned', 'picking_up', 'delivering'])
          .order('route_order', { ascending: true });

        setActiveRoutes(routes || []);

        // Bugün tamamlananları say
        const today = new Date().toISOString().split('T')[0];
        const { count } = await supabase
          .from('courier_routes')
          .select('*', { count: 'exact', head: true })
          .eq('courier_id', profile.id)
          .eq('status', 'completed')
          .gte('created_at', today);

        setCompletedToday(count || 0);
      }
    } catch (error) {
      console.error('Error loading courier data:', error);
    } finally {
      setLoading(false);
    }
  };

  const toggleOnlineStatus = async () => {
    const newStatus = isOnline ? 'offline' : 'available';
    
    const { error } = await supabase
      .from('couriers')
      .update({ status: newStatus })
      .eq('id', courierProfile.id);

    if (!error) {
      setIsOnline(!isOnline);
      toast.success(isOnline ? 'Çevrimdışı oldunuz' : 'Çevrimiçi oldunuz');
    }
  };

  const updateRouteStatus = async (routeId: string, newStatus: string) => {
    const { error } = await supabase
      .from('courier_routes')
      .update({ 
        status: newStatus,
        ...(newStatus === 'picked_up' && { actual_pickup_time: new Date().toISOString() }),
        ...(newStatus === 'completed' && { actual_delivery_time: new Date().toISOString() })
      })
      .eq('id', routeId);

    if (!error) {
      toast.success('Durum güncellendi');
      loadCourierData();
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'assigned': return <Badge variant="secondary">Atandı</Badge>;
      case 'picking_up': return <Badge className="bg-blue-500">Alınıyor</Badge>;
      case 'delivering': return <Badge className="bg-yellow-500">Teslim Ediliyor</Badge>;
      case 'completed': return <Badge className="bg-green-500">Tamamlandı</Badge>;
      default: return <Badge variant="outline">{status}</Badge>;
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
          <p className="mt-4 text-muted-foreground">Yükleniyor...</p>
        </div>
        <Footer />
      </div>
    );
  }

  if (!courierProfile) {
    return (
      <div className="min-h-screen bg-background">
        <Navbar />
        <div className="container mx-auto px-4 py-20 text-center">
          <Truck className="w-16 h-16 mx-auto text-muted-foreground mb-4" />
          <h1 className="text-2xl font-bold mb-2">Kurye Profili Bulunamadı</h1>
          <p className="text-muted-foreground">Kurye olarak kayıtlı değilsiniz.</p>
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
                <Truck className="w-8 h-8 text-primary" />
                Kurye Paneli
              </h1>
              <p className="text-muted-foreground mt-1">
                Merhaba, {courierProfile.fullname}!
              </p>
            </div>
            
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2">
                <span className="text-sm text-muted-foreground">Durum:</span>
                <Switch 
                  checked={isOnline} 
                  onCheckedChange={toggleOnlineStatus}
                />
                <Badge variant={isOnline ? 'default' : 'secondary'}>
                  {isOnline ? 'Çevrimiçi' : 'Çevrimdışı'}
                </Badge>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Quick Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          <Card>
            <CardContent className="p-4">
              <Package className="w-8 h-8 text-blue-500 mb-2" />
              <p className="text-2xl font-bold">{activeRoutes.length}</p>
              <p className="text-sm text-muted-foreground">Aktif Teslimat</p>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4">
              <CheckCircle className="w-8 h-8 text-green-500 mb-2" />
              <p className="text-2xl font-bold">{completedToday}</p>
              <p className="text-sm text-muted-foreground">Bugün Tamamlanan</p>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4">
              <Star className="w-8 h-8 text-yellow-500 mb-2" />
              <p className="text-2xl font-bold">{courierProfile.trust_score || 100}</p>
              <p className="text-sm text-muted-foreground">Güven Skoru</p>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4">
              <Clock className="w-8 h-8 text-primary mb-2" />
              <p className="text-2xl font-bold">{courierProfile.avg_delivery_time || 25} dk</p>
              <p className="text-sm text-muted-foreground">Ort. Teslimat</p>
            </CardContent>
          </Card>
        </div>

        {/* Active Routes */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Navigation className="w-5 h-5" />
              Aktif Teslimatlar
            </CardTitle>
          </CardHeader>
          <CardContent>
            {activeRoutes.length > 0 ? (
              <div className="space-y-4">
                {activeRoutes.map((route, index) => (
                  <motion.div
                    key={route.id}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.1 }}
                    className="p-4 border rounded-lg"
                  >
                    <div className="flex items-start justify-between mb-3">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center font-bold text-primary">
                          {route.route_order}
                        </div>
                        <div>
                          <p className="font-medium">
                            {route.orders?.chef_profiles?.business_name || 'Şef'}
                          </p>
                          <p className="text-sm text-muted-foreground">
                            Sipariş #{route.order_id.slice(0, 8)}
                          </p>
                        </div>
                      </div>
                      {getStatusBadge(route.status)}
                    </div>

                    <div className="grid md:grid-cols-2 gap-4 mb-4">
                      <div className="flex items-start gap-2">
                        <MapPin className="w-4 h-4 text-green-500 mt-1" />
                        <div>
                          <p className="text-sm font-medium">Alım Noktası</p>
                          <p className="text-sm text-muted-foreground">
                            {route.orders?.chef_profiles?.address || 'Adres bilgisi yok'}
                          </p>
                        </div>
                      </div>
                      <div className="flex items-start gap-2">
                        <MapPin className="w-4 h-4 text-red-500 mt-1" />
                        <div>
                          <p className="text-sm font-medium">Teslimat Adresi</p>
                          <p className="text-sm text-muted-foreground">
                            {route.orders?.delivery_address || 'Adres bilgisi yok'}
                          </p>
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-4 text-sm text-muted-foreground">
                        <span className="flex items-center gap-1">
                          <Navigation className="w-4 h-4" />
                          {route.distance_km?.toFixed(1)} km
                        </span>
                        <span className="flex items-center gap-1">
                          <DollarSign className="w-4 h-4" />
                          ₺{route.orders?.total_amount?.toFixed(2)}
                        </span>
                      </div>

                      <div className="flex gap-2">
                        {route.status === 'assigned' && (
                          <Button 
                            size="sm" 
                            onClick={() => updateRouteStatus(route.id, 'picking_up')}
                          >
                            Yola Çıktım
                          </Button>
                        )}
                        {route.status === 'picking_up' && (
                          <Button 
                            size="sm" 
                            onClick={() => updateRouteStatus(route.id, 'delivering')}
                          >
                            Aldım
                          </Button>
                        )}
                        {route.status === 'delivering' && (
                          <Button 
                            size="sm" 
                            className="bg-green-500 hover:bg-green-600"
                            onClick={() => updateRouteStatus(route.id, 'completed')}
                          >
                            Teslim Ettim
                          </Button>
                        )}
                        {route.orders?.chef_profiles?.phone && (
                          <Button 
                            variant="outline" 
                            size="sm"
                            onClick={() => window.open(`tel:${route.orders?.chef_profiles?.phone}`)}
                          >
                            <Phone className="w-4 h-4" />
                          </Button>
                        )}
                      </div>
                    </div>

                    {route.orders?.notes && (
                      <div className="mt-3 p-2 bg-yellow-50 dark:bg-yellow-900/20 rounded text-sm">
                        <AlertTriangle className="w-4 h-4 inline mr-1 text-yellow-600" />
                        <span className="text-yellow-700 dark:text-yellow-400">
                          Not: {route.orders.notes}
                        </span>
                      </div>
                    )}
                  </motion.div>
                ))}
              </div>
            ) : (
              <div className="text-center py-12">
                <Package className="w-16 h-16 mx-auto text-muted-foreground mb-4" />
                <p className="text-lg font-medium">Aktif teslimat yok</p>
                <p className="text-muted-foreground">
                  {isOnline 
                    ? 'Yeni siparişler geldiğinde burada görünecek'
                    : 'Sipariş almak için çevrimiçi olun'}
                </p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
      
      <Footer />
    </div>
  );
};

export default CourierDashboard;
