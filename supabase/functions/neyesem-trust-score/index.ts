import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

interface TrustFactors {
  rating_score: number;
  completion_rate: number;
  on_time_rate: number;
  response_rate: number;
  verification_bonus: number;
  cancellation_penalty: number;
  review_sentiment: number;
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
    const supabaseKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
    const supabase = createClient(supabaseUrl, supabaseKey);

    const { entity_type, entity_id, recalculate_all } = await req.json();

    if (recalculate_all) {
      // Tüm şeflerin güven skorlarını yeniden hesapla
      const { data: chefs } = await supabase
        .from('chef_profiles')
        .select('id')
        .eq('is_active', true);

      const results = [];
      for (const chef of chefs || []) {
        const score = await calculateChefTrustScore(supabase, chef.id);
        results.push({ chef_id: chef.id, score });
      }

      return new Response(JSON.stringify({ 
        success: true, 
        updated: results.length,
        results 
      }), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      });
    }

    // Tek bir entity için hesapla
    let score = 0;
    let factors: TrustFactors | null = null;

    if (entity_type === 'chef') {
      const result = await calculateChefTrustScore(supabase, entity_id);
      score = result.score;
      factors = result.factors;
    } else if (entity_type === 'courier') {
      const result = await calculateCourierTrustScore(supabase, entity_id);
      score = result.score;
      factors = result.factors;
    }

    // Güven skorunu kaydet
    await supabase.from('trust_scores').insert({
      entity_type,
      entity_id,
      score,
      factors
    });

    return new Response(JSON.stringify({ 
      success: true, 
      entity_type,
      entity_id,
      score,
      factors,
      label: getTrustLabel(score)
    }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' }
    });

  } catch (error) {
    console.error('Trust Score error:', error);
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' }
    });
  }
});

async function calculateChefTrustScore(supabase: any, chefId: string) {
  // Şef bilgilerini al
  const { data: chef } = await supabase
    .from('chef_profiles')
    .select('*')
    .eq('id', chefId)
    .single();

  // Son 90 günlük siparişleri al
  const ninetyDaysAgo = new Date();
  ninetyDaysAgo.setDate(ninetyDaysAgo.getDate() - 90);

  const { data: orders } = await supabase
    .from('orders')
    .select('status, created_at, estimated_delivery_time, actual_delivery_time')
    .eq('chef_id', chefId)
    .gte('created_at', ninetyDaysAgo.toISOString());

  // Yorumları al
  const { data: reviews } = await supabase
    .from('reviews')
    .select('rating, comment')
    .eq('chef_id', chefId);

  const totalOrders = orders?.length || 0;
  const completedOrders = orders?.filter((o: any) => o.status === 'delivered')?.length || 0;
  const cancelledOrders = orders?.filter((o: any) => o.status === 'cancelled')?.length || 0;

  // Zamanında teslimat oranı
  const onTimeOrders = orders?.filter((o: any) => {
    if (!o.actual_delivery_time || !o.estimated_delivery_time) return true;
    return new Date(o.actual_delivery_time) <= new Date(o.estimated_delivery_time);
  })?.length || 0;

  // Faktörleri hesapla
  const factors: TrustFactors = {
    rating_score: Math.min(25, (chef?.rating || 0) * 5),
    completion_rate: totalOrders > 0 ? Math.min(25, (completedOrders / totalOrders) * 25) : 20,
    on_time_rate: totalOrders > 0 ? Math.min(20, (onTimeOrders / totalOrders) * 20) : 15,
    response_rate: 15, // Varsayılan
    verification_bonus: chef?.is_verified ? 10 : 0,
    cancellation_penalty: Math.min(15, cancelledOrders * 3),
    review_sentiment: calculateReviewSentiment(reviews || [])
  };

  const score = Math.max(0, Math.min(100,
    factors.rating_score +
    factors.completion_rate +
    factors.on_time_rate +
    factors.response_rate +
    factors.verification_bonus -
    factors.cancellation_penalty +
    factors.review_sentiment
  ));

  // Şefin güven skorunu güncelle
  await supabase
    .from('chef_profiles')
    .update({ trust_score: Math.round(score) })
    .eq('id', chefId);

  return { score: Math.round(score), factors };
}

async function calculateCourierTrustScore(supabase: any, courierId: string) {
  const { data: courier } = await supabase
    .from('couriers')
    .select('*')
    .eq('id', courierId)
    .single();

  const { data: routes } = await supabase
    .from('courier_routes')
    .select('*')
    .eq('courier_id', courierId)
    .eq('status', 'completed');

  const totalDeliveries = routes?.length || 0;
  const onTimeDeliveries = routes?.filter((r: any) => {
    if (!r.actual_delivery_time || !r.estimated_delivery_time) return true;
    return new Date(r.actual_delivery_time) <= new Date(r.estimated_delivery_time);
  })?.length || 0;

  const factors: TrustFactors = {
    rating_score: 20,
    completion_rate: totalDeliveries > 0 ? Math.min(25, (totalDeliveries / 100) * 25) : 10,
    on_time_rate: totalDeliveries > 0 ? Math.min(30, (onTimeDeliveries / totalDeliveries) * 30) : 20,
    response_rate: 15,
    verification_bonus: 5,
    cancellation_penalty: 0,
    review_sentiment: 5
  };

  const score = Math.max(0, Math.min(100,
    factors.rating_score +
    factors.completion_rate +
    factors.on_time_rate +
    factors.response_rate +
    factors.verification_bonus
  ));

  await supabase
    .from('couriers')
    .update({ trust_score: Math.round(score) })
    .eq('id', courierId);

  return { score: Math.round(score), factors };
}

function calculateReviewSentiment(reviews: any[]): number {
  if (reviews.length === 0) return 5;
  
  const avgRating = reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length;
  
  // Basit sentiment: rating bazlı
  if (avgRating >= 4.5) return 10;
  if (avgRating >= 4) return 7;
  if (avgRating >= 3.5) return 5;
  if (avgRating >= 3) return 2;
  return 0;
}

function getTrustLabel(score: number): string {
  if (score >= 90) return "Çok Güvenilir";
  if (score >= 75) return "Güvenilir";
  if (score >= 60) return "İyi";
  if (score >= 40) return "Orta";
  return "Gelişmeli";
}
