import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';

interface AIMatchedChef {
  chef_id: string;
  chef: any;
  distance_km: number;
  score: number;
  reasons: string[];
  estimated_delivery_time: number;
  ai_status: string;
}

interface UserLocation {
  latitude: number;
  longitude: number;
}

export const useNeYesemAI = () => {
  const [loading, setLoading] = useState(false);
  const [matchedChefs, setMatchedChefs] = useState<AIMatchedChef[]>([]);
  const [userLocation, setUserLocation] = useState<UserLocation | null>(null);
  const [locationError, setLocationError] = useState<string | null>(null);

  // Kullanıcı konumunu al
  const getUserLocation = (): Promise<UserLocation> => {
    return new Promise((resolve, reject) => {
      if (!navigator.geolocation) {
        reject(new Error('Tarayıcınız konum özelliğini desteklemiyor'));
        return;
      }

      navigator.geolocation.getCurrentPosition(
        (position) => {
          const location = {
            latitude: position.coords.latitude,
            longitude: position.coords.longitude
          };
          setUserLocation(location);
          resolve(location);
        },
        (error) => {
          // Varsayılan konum (İstanbul merkez)
          const defaultLocation = { latitude: 41.0082, longitude: 28.9784 };
          setUserLocation(defaultLocation);
          setLocationError('Konum alınamadı, varsayılan konum kullanılıyor');
          resolve(defaultLocation);
        },
        { enableHighAccuracy: true, timeout: 10000, maximumAge: 300000 }
      );
    });
  };

  // AI ile şef eşleştir
  const matchChefs = async (deliveryType: 'instant' | 'scheduled' = 'instant', maxDistance: number = 10) => {
    setLoading(true);
    try {
      let location = userLocation;
      if (!location) {
        location = await getUserLocation();
      }

      const { data: { user } } = await supabase.auth.getUser();

      const response = await fetch(
        `https://yjxhkseraraumuxsmyxw.supabase.co/functions/v1/neyesem-ai-matching`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            user_latitude: location.latitude,
            user_longitude: location.longitude,
            delivery_type: deliveryType,
            max_distance_km: maxDistance,
            user_id: user?.id
          })
        }
      );

      const result = await response.json();
      
      if (result.success) {
        setMatchedChefs(result.chefs || []);
        return result.chefs;
      } else {
        console.error('AI matching error:', result.error);
        return [];
      }
    } catch (error) {
      console.error('AI matching error:', error);
      return [];
    } finally {
      setLoading(false);
    }
  };

  // Şef analitiğini al
  const getChefAnalytics = async (chefId: string) => {
    try {
      const { data: { session } } = await supabase.auth.getSession();
      
      const response = await fetch(
        `https://yjxhkseraraumuxsmyxw.supabase.co/functions/v1/neyesem-chef-analytics`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${session?.access_token}`
          },
          body: JSON.stringify({ chef_id: chefId })
        }
      );

      const result = await response.json();
      return result.success ? result.analytics : null;
    } catch (error) {
      console.error('Chef analytics error:', error);
      return null;
    }
  };

  // Güven skoru hesapla
  const calculateTrustScore = async (entityType: 'chef' | 'courier', entityId: string) => {
    try {
      const { data: { session } } = await supabase.auth.getSession();
      
      const response = await fetch(
        `https://yjxhkseraraumuxsmyxw.supabase.co/functions/v1/neyesem-trust-score`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${session?.access_token}`
          },
          body: JSON.stringify({ entity_type: entityType, entity_id: entityId })
        }
      );

      const result = await response.json();
      return result.success ? result : null;
    } catch (error) {
      console.error('Trust score error:', error);
      return null;
    }
  };

  // Sipariş optimizasyonu
  const optimizeOrder = async (action: string, orderId?: string, chefId?: string, deliveryLat?: number, deliveryLon?: number) => {
    try {
      const { data: { session } } = await supabase.auth.getSession();
      
      const response = await fetch(
        `https://yjxhkseraraumuxsmyxw.supabase.co/functions/v1/neyesem-order-optimizer`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${session?.access_token}`
          },
          body: JSON.stringify({
            action,
            order_id: orderId,
            chef_id: chefId,
            delivery_latitude: deliveryLat,
            delivery_longitude: deliveryLon
          })
        }
      );

      const result = await response.json();
      return result;
    } catch (error) {
      console.error('Order optimizer error:', error);
      return { success: false, error: 'İşlem başarısız' };
    }
  };

  return {
    loading,
    matchedChefs,
    userLocation,
    locationError,
    getUserLocation,
    matchChefs,
    getChefAnalytics,
    calculateTrustScore,
    optimizeOrder
  };
};
