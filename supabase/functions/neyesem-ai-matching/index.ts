import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

interface MatchingRequest {
  user_latitude: number;
  user_longitude: number;
  delivery_type: 'instant' | 'scheduled';
  preferred_cuisine?: string;
  max_distance_km?: number;
  user_id?: string;
}

interface ChefScore {
  chef_id: string;
  chef: any;
  distance_km: number;
  score: number;
  reasons: string[];
  estimated_delivery_time: number;
  ai_status: string;
}

function calculateDistance(lat1: number, lon1: number, lat2: number, lon2: number): number {
  const R = 6371;
  const dLat = (lat2 - lat1) * Math.PI / 180;
  const dLon = (lon2 - lon1) * Math.PI / 180;
  const a = Math.sin(dLat/2) * Math.sin(dLat/2) +
    Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) *
    Math.sin(dLon/2) * Math.sin(dLon/2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
  return R * c;
}

function calculateAIScore(chef: any, distance: number, userHistory: any[]): { score: number; reasons: string[] } {
  let score = 100;
  const reasons: string[] = [];

  // Mesafe puanlaması (max 30 puan)
  const distanceScore = Math.max(0, 30 - (distance * 3));
  score += distanceScore;
  if (distance < 2) reasons.push("Size çok yakın");
  else if (distance < 5) reasons.push("Yakın konumda");

  // Güven skoru (max 25 puan)
  const trustScore = (chef.trust_score || 100) / 4;
  score += trustScore;
  if (chef.trust_score >= 90) reasons.push("Güvenilir şef");

  // Rating puanı (max 20 puan)
  const ratingScore = (chef.rating || 0) * 4;
  score += ratingScore;
  if (chef.rating >= 4.5) reasons.push("Yüksek puanlı");

  // Yoğunluk analizi (max 15 puan)
  const loadRatio = (chef.current_daily_orders || 0) / (chef.daily_order_limit || 20);
  if (loadRatio < 0.5) {
    score += 15;
    reasons.push("Şu an müsait");
  } else if (loadRatio < 0.8) {
    score += 8;
  }

  // Hazırlama süresi (max 10 puan)
  const prepScore = Math.max(0, 10 - (chef.avg_prep_time || 30) / 6);
  score += prepScore;
  if (chef.avg_prep_time <= 20) reasons.push("Hızlı hazırlık");

  // Verified bonus
  if (chef.is_verified) {
    score += 10;
    reasons.push("Onaylı şef");
  }

  return { score, reasons };
}

function getAIStatus(chef: any): string {
  const loadRatio = (chef.current_daily_orders || 0) / (chef.daily_order_limit || 20);
  
  if (loadRatio >= 0.9) return "Çok yoğun";
  if (loadRatio >= 0.7) return "Yoğun";
  if (loadRatio < 0.3 && chef.avg_prep_time <= 20) return "Bugün hızlı";
  if (chef.total_orders < 10) return "Yeni şef";
  if (chef.rating >= 4.8) return "Favori";
  return "Müsait";
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
    const supabaseKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
    const supabase = createClient(supabaseUrl, supabaseKey);

    const body: MatchingRequest = await req.json();
    const { user_latitude, user_longitude, delivery_type, max_distance_km = 10, user_id } = body;

    // Aktif, onaylı, kadın şefleri getir
    const { data: chefs, error: chefsError } = await supabase
      .from('chef_profiles')
      .select(`
        *,
        meals(id, name, price, image_url, category, is_available)
      `)
      .eq('is_active', true)
      .eq('is_female', true)
      .not('latitude', 'is', null)
      .not('longitude', 'is', null);

    if (chefsError) throw chefsError;

    // Kullanıcı geçmiş siparişlerini al
    let userHistory: any[] = [];
    if (user_id) {
      const { data: orders } = await supabase
        .from('orders')
        .select('chef_id')
        .eq('customer_id', user_id)
        .order('created_at', { ascending: false })
        .limit(10);
      userHistory = orders || [];
    }

    // Her şef için skor hesapla
    const scoredChefs: ChefScore[] = [];

    for (const chef of chefs || []) {
      const distance = calculateDistance(
        user_latitude, user_longitude,
        chef.latitude, chef.longitude
      );

      if (distance > max_distance_km) continue;

      const { score, reasons } = calculateAIScore(chef, distance, userHistory);
      const aiStatus = getAIStatus(chef);

      // Tahmini teslimat süresi
      const estimatedDeliveryTime = Math.round(
        (chef.avg_prep_time || 30) + (distance * 3) + 10
      );

      scoredChefs.push({
        chef_id: chef.id,
        chef: {
          ...chef,
          meals: chef.meals?.filter((m: any) => m.is_available) || []
        },
        distance_km: Math.round(distance * 10) / 10,
        score,
        reasons,
        estimated_delivery_time: estimatedDeliveryTime,
        ai_status: aiStatus
      });
    }

    // Skora göre sırala
    scoredChefs.sort((a, b) => b.score - a.score);

    // AI önerilerini kaydet
    if (user_id && scoredChefs.length > 0) {
      const recommendations = scoredChefs.slice(0, 5).map(sc => ({
        user_id,
        chef_id: sc.chef_id,
        recommendation_type: 'location_match',
        reason: sc.reasons.join(', '),
        score: sc.score,
        factors: {
          distance_km: sc.distance_km,
          estimated_delivery_time: sc.estimated_delivery_time,
          ai_status: sc.ai_status
        }
      }));

      await supabase.from('ai_recommendations').insert(recommendations);
    }

    return new Response(JSON.stringify({
      success: true,
      total_found: scoredChefs.length,
      chefs: scoredChefs.slice(0, 20),
      user_location: { latitude: user_latitude, longitude: user_longitude }
    }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' }
    });

  } catch (error) {
    console.error('AI Matching error:', error);
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' }
    });
  }
});
