import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { motion } from 'framer-motion';
import {
  MapPin, Clock, Phone, ChefHat, Truck, CheckCircle,
  Package, Navigation, AlertCircle, Star, MessageCircle
} from 'lucide-react';

interface OrderStatus {
  id: string;
  status: string;
  notes: string;
  created_at: string;
}

const OrderTracking: React.FC = () => {
  const { orderId } = useParams<{ orderId: string }>();
  const [order, setOrder] = useState<any>(null);
  const [statusLogs, setStatusLogs] = useState<OrderStatus[]>([]);
  const [courier, setCourier] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (orderId) {
      loadOrderData();
      
      // Realtime subscription
      const subscription = supabase
        .channel(`order-${orderId}`)
        .on('postgres_changes', {
          event: 'UPDATE',
          schema: 'public',
          table: 'orders',
          filter: `id=eq.${orderId}`
        }, () => {
          loadOrderData();
        })
        .subscribe();

      return () => {
        subscription.unsubscribe();
      };
    }
  }, [orderId]);

  const loadOrderData = async () => {
    try {
      // Sipariş bilgilerini al
      const { data: orderData } = await supabase
        .from('orders')
        .select(`
          *,
          chef_profiles (id, business_name, phone, address, rating),
          order_items (*, meals (name, image_url))
        `)
        .eq('id', orderId)
        .single();

      if (orderData) {
        setOrder(orderData);

        // Kurye bilgilerini al
        if (orderData.courier_id) {
          const { data: courierData } = await supabase
            .from('couriers')
            .select('*')
            .eq('id', orderData.courier_id)
            .single();
          setCourier(courierData);
        }

        // Durum loglarını al
        const { data: logs } = await supabase
          .from('order_status_logs')
          .select('*')
          .eq('order_id', orderId)
          .order('created_at', { ascending: true });

        setStatusLogs(logs || []);
      }
    } catch (error) {
      console.error('Error loading order:', error);
    } finally {
      setLoading(false);
    }
  };

  const getStatusProgress = (status: string) => {
    switch (status) {
      case 'pending': return 10;
      case 'confirmed': return 25;
      case 'preparing': return 45;
      case 'ready': return 60;
      case 'picked_up': return 75;
      case 'delivering': return 90;
      case 'delivered': return 100;
      case 'cancelled': return 0;
      default: return 0;
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'pending': return 'Onay Bekleniyor';
      case 'confirmed': return 'Onaylandı';
      case 'preparing': return 'Hazırlanıyor';
      case 'ready': return 'Hazır';
      case 'picked_up': return 'Kurye Aldı';
      case 'delivering': return 'Yolda';
      case 'delivered': return 'Teslim Edildi';
      case 'cancelled': return 'İptal Edildi';
      default: return status;
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'pending': return <Clock className="w-5 h-5" />;
      case 'confirmed': return <CheckCircle className="w-5 h-5" />;
      case 'preparing': return <ChefHat className="w-5 h-5" />;
      case 'ready': return <Package className="w-5 h-5" />;
      case 'picked_up': return <Truck className="w-5 h-5" />;
      case 'delivering': return <Navigation className="w-5 h-5" />;
      case 'delivered': return <CheckCircle className="w-5 h-5 text-green-500" />;
      case 'cancelled': return <AlertCircle className="w-5 h-5 text-red-500" />;
      default: return <Clock className="w-5 h-5" />;
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
          <p className="mt-4 text-muted-foreground">Sipariş bilgileri yükleniyor...</p>
        </div>
        <Footer />
      </div>
    );
  }

  if (!order) {
    return (
      <div className="min-h-screen bg-background">
        <Navbar />
        <div className="container mx-auto px-4 py-20 text-center">
          <AlertCircle className="w-16 h-16 mx-auto text-muted-foreground mb-4" />
          <h1 className="text-2xl font-bold mb-2">Sipariş Bulunamadı</h1>
          <p className="text-muted-foreground">Bu sipariş mevcut değil veya erişim izniniz yok.</p>
        </div>
        <Footer />
      </div>
    );
  }

  const progress = getStatusProgress(order.status);

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-muted/30 to-background">
      <Navbar />
      
      <div className="container mx-auto px-4 py-8 max-w-3xl">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-8"
        >
          <h1 className="text-2xl font-bold mb-2">Sipariş Takibi</h1>
          <p className="text-muted-foreground">
            Sipariş No: #{order.id.slice(0, 8).toUpperCase()}
          </p>
        </motion.div>

        {/* Status Card */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
        >
          <Card className="mb-6 overflow-hidden">
            <div className={`p-6 text-center text-white ${
              order.status === 'delivered' ? 'bg-green-500' :
              order.status === 'cancelled' ? 'bg-red-500' :
              'bg-primary'
            }`}>
              <motion.div
                animate={{ scale: [1, 1.1, 1] }}
                transition={{ duration: 2, repeat: Infinity }}
                className="w-16 h-16 mx-auto mb-4 bg-white/20 rounded-full flex items-center justify-center"
              >
                {getStatusIcon(order.status)}
              </motion.div>
              <h2 className="text-2xl font-bold">{getStatusText(order.status)}</h2>
              {order.estimated_delivery_time && order.status !== 'delivered' && (
                <p className="mt-2 opacity-90">
                  Tahmini teslimat: {new Date(order.estimated_delivery_time).toLocaleTimeString('tr-TR', { hour: '2-digit', minute: '2-digit' })}
                </p>
              )}
            </div>
            
            <CardContent className="p-4">
              <Progress value={progress} className="h-2" />
              <div className="flex justify-between mt-2 text-xs text-muted-foreground">
                <span>Onay</span>
                <span>Hazırlık</span>
                <span>Yolda</span>
                <span>Teslim</span>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* AI Notes */}
        {order.ai_notes && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
          >
            <Card className="mb-6 border-primary/50 bg-primary/5">
              <CardContent className="p-4">
                <div className="flex items-start gap-3">
                  <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center">
                    <Star className="w-4 h-4 text-primary" />
                  </div>
                  <div>
                    <p className="font-medium text-sm">AI Bilgilendirme</p>
                    <p className="text-sm text-muted-foreground">{order.ai_notes}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        )}

        {/* Chef Info */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          <Card className="mb-6">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <ChefHat className="w-5 h-5" />
                Şef Bilgileri
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium">{order.chef_profiles?.business_name}</p>
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <MapPin className="w-4 h-4" />
                    <span>{order.chef_profiles?.address || 'Adres bilgisi yok'}</span>
                  </div>
                </div>
                {order.chef_profiles?.phone && (
                  <Button 
                    variant="outline" 
                    size="sm"
                    onClick={() => window.open(`tel:${order.chef_profiles.phone}`)}
                  >
                    <Phone className="w-4 h-4 mr-2" />
                    Ara
                  </Button>
                )}
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Courier Info */}
        {courier && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
          >
            <Card className="mb-6">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Truck className="w-5 h-5" />
                  Kurye Bilgileri
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center">
                      <Truck className="w-6 h-6 text-primary" />
                    </div>
                    <div>
                      <p className="font-medium">{courier.fullname}</p>
                      <div className="flex items-center gap-2 text-sm text-muted-foreground">
                        <Star className="w-4 h-4 text-yellow-500" />
                        <span>Güven Skoru: {courier.trust_score}</span>
                      </div>
                    </div>
                  </div>
                  <div className="flex gap-2">
                    {courier.phone && (
                      <Button 
                        variant="outline" 
                        size="sm"
                        onClick={() => window.open(`tel:${courier.phone}`)}
                      >
                        <Phone className="w-4 h-4" />
                      </Button>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        )}

        {/* Order Items */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
        >
          <Card className="mb-6">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Package className="w-5 h-5" />
                Sipariş Detayları
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {order.order_items?.map((item: any) => (
                  <div key={item.id} className="flex items-center gap-3">
                    <img 
                      src={item.meals?.image_url || 'https://images.unsplash.com/photo-1504674900247-0877df9cc836?w=100&h=100&fit=crop'}
                      alt={item.meals?.name}
                      className="w-12 h-12 rounded-lg object-cover"
                    />
                    <div className="flex-1">
                      <p className="font-medium">{item.meals?.name}</p>
                      <p className="text-sm text-muted-foreground">x{item.quantity}</p>
                    </div>
                    <p className="font-medium">₺{(item.price * item.quantity).toFixed(2)}</p>
                  </div>
                ))}
              </div>
              
              <div className="border-t mt-4 pt-4">
                <div className="flex justify-between font-bold">
                  <span>Toplam</span>
                  <span>₺{order.total_amount?.toFixed(2)}</span>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Delivery Address */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
        >
          <Card className="mb-6">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <MapPin className="w-5 h-5" />
                Teslimat Adresi
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p>{order.delivery_address || 'Adres bilgisi yok'}</p>
              {order.notes && (
                <p className="text-sm text-muted-foreground mt-2">
                  <strong>Not:</strong> {order.notes}
                </p>
              )}
            </CardContent>
          </Card>
        </motion.div>

        {/* Status Timeline */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
        >
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Clock className="w-5 h-5" />
                Sipariş Geçmişi
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {statusLogs.map((log, index) => (
                  <div key={log.id} className="flex gap-4">
                    <div className="flex flex-col items-center">
                      <div className={`w-3 h-3 rounded-full ${
                        index === statusLogs.length - 1 ? 'bg-primary' : 'bg-muted'
                      }`} />
                      {index < statusLogs.length - 1 && (
                        <div className="w-0.5 h-full bg-muted" />
                      )}
                    </div>
                    <div className="pb-4">
                      <p className="font-medium">{getStatusText(log.status)}</p>
                      <p className="text-sm text-muted-foreground">
                        {new Date(log.created_at).toLocaleString('tr-TR')}
                      </p>
                      {log.notes && (
                        <p className="text-sm text-muted-foreground mt-1">{log.notes}</p>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>
      
      <Footer />
    </div>
  );
};

export default OrderTracking;
