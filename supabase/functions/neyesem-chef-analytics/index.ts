import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

const LOVABLE_API_KEY = Deno.env.get('LOVABLE_API_KEY');

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
    const supabaseKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
    const supabase = createClient(supabaseUrl, supabaseKey);

    const { chef_id } = await req.json();

    // Şef bilgilerini al
    const { data: chef, error: chefError } = await supabase
      .from('chef_profiles')
      .select('*')
      .eq('id', chef_id)
      .single();

    if (chefError) throw chefError;

    // Son 30 günlük siparişleri al
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

    const { data: orders } = await supabase
      .from('orders')
      .select('*, order_items(*, meals(name, price, category))')
      .eq('chef_id', chef_id)
      .gte('created_at', thirtyDaysAgo.toISOString());

    // Yemek satış analizi
    const mealSales: Record<string, { count: number; revenue: number; name: string }> = {};
    let totalRevenue = 0;

    for (const order of orders || []) {
      totalRevenue += order.total_amount || 0;
      for (const item of order.order_items || []) {
        const mealId = item.meal_id;
        const mealName = item.meals?.name || 'Bilinmiyor';
        if (!mealSales[mealId]) {
          mealSales[mealId] = { count: 0, revenue: 0, name: mealName };
        }
        mealSales[mealId].count += item.quantity;
        mealSales[mealId].revenue += item.price * item.quantity;
      }
    }

    // En çok satan ürünler
    const topProducts = Object.entries(mealSales)
      .map(([id, data]) => ({ id, ...data }))
      .sort((a, b) => b.revenue - a.revenue)
      .slice(0, 5);

    // Günlük satış dağılımı
    const dailySales: Record<string, number> = {};
    for (const order of orders || []) {
      const day = new Date(order.created_at).toLocaleDateString('tr-TR', { weekday: 'long' });
      dailySales[day] = (dailySales[day] || 0) + 1;
    }

    // En iyi gün
    const bestDay = Object.entries(dailySales).sort((a, b) => b[1] - a[1])[0];

    // Saatlik dağılım
    const hourlySales: Record<number, number> = {};
    for (const order of orders || []) {
      const hour = new Date(order.created_at).getHours();
      hourlySales[hour] = (hourlySales[hour] || 0) + 1;
    }

    // En iyi saat aralığı
    const bestHour = Object.entries(hourlySales)
      .sort((a, b) => b[1] - a[1])[0];

    // Yorumları al
    const { data: reviews } = await supabase
      .from('reviews')
      .select('rating, comment, created_at')
      .eq('chef_id', chef_id)
      .order('created_at', { ascending: false })
      .limit(20);

    const avgRating = reviews?.length 
      ? reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length 
      : 0;

    // AI analizi için prompt oluştur
    const analysisData = {
      totalOrders: orders?.length || 0,
      totalRevenue,
      avgOrderValue: orders?.length ? totalRevenue / orders.length : 0,
      topProducts,
      bestDay,
      bestHour: bestHour ? `${bestHour[0]}:00 - ${parseInt(bestHour[0]) + 1}:00` : null,
      avgRating,
      reviewCount: reviews?.length || 0,
      trustScore: chef.trust_score
    };

    // AI ile önerileri oluştur
    let aiInsights = [];
    
    if (LOVABLE_API_KEY) {
      try {
        const aiResponse = await fetch('https://ai.gateway.lovable.dev/v1/chat/completions', {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${LOVABLE_API_KEY}`,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            model: 'google/gemini-2.5-flash',
            messages: [
              {
                role: 'system',
                content: `Sen bir yemek satış danışmanısın. Evden yemek satan kadın şeflere iş önerileri veriyorsun. 
                Kısa, net ve uygulanabilir öneriler ver. Türkçe yanıt ver. Her öneri bir cümle olsun.
                JSON formatında yanıt ver: { "insights": ["öneri1", "öneri2", ...], "weeklyEarningEstimate": number }`
              },
              {
                role: 'user',
                content: `Şef verileri: ${JSON.stringify(analysisData)}. 
                Bu şef için 5 adet iş önerisi ve haftalık tahmini kazanç hesapla.`
              }
            ]
          })
        });

        const aiData = await aiResponse.json();
        const content = aiData.choices?.[0]?.message?.content;
        
        if (content) {
          try {
            const parsed = JSON.parse(content.replace(/```json\n?|\n?```/g, ''));
            aiInsights = parsed.insights || [];
          } catch {
            aiInsights = [
              "En çok satan ürünlerinize odaklanın",
              "Yoğun saatlerde stok bulundurun",
              "Müşteri yorumlarına hızlı yanıt verin"
            ];
          }
        }
      } catch (e) {
        console.error('AI error:', e);
      }
    }

    // Varsayılan öneriler
    if (aiInsights.length === 0) {
      aiInsights = [];
      
      if (topProducts.length > 0) {
        aiInsights.push(`"${topProducts[0].name}" en çok satan ürününüz, stokta tutun`);
      }
      
      if (bestDay) {
        aiInsights.push(`${bestDay[0]} günü en yoğun gününüz, bu gün için hazırlıklı olun`);
      }
      
      if (bestHour) {
        aiInsights.push(`${bestHour[0]}:00 civarı en çok sipariş alıyorsunuz`);
      }
      
      if (avgRating < 4.5 && reviews && reviews.length > 0) {
        aiInsights.push("Müşteri memnuniyetini artırmak için yorumları inceleyin");
      }
      
      aiInsights.push("Günlük limit ayarlayarak kaliteyi koruyun");
    }

    // Haftalık kazanç tahmini
    const weeklyEstimate = Math.round((totalRevenue / 4) * 1.1);

    return new Response(JSON.stringify({
      success: true,
      analytics: {
        overview: {
          totalOrders: orders?.length || 0,
          totalRevenue,
          avgOrderValue: Math.round((orders?.length ? totalRevenue / orders.length : 0) * 100) / 100,
          avgRating: Math.round(avgRating * 10) / 10,
          trustScore: chef.trust_score
        },
        topProducts,
        salesByDay: dailySales,
        salesByHour: hourlySales,
        bestDay: bestDay ? { day: bestDay[0], orders: bestDay[1] } : null,
        bestHour: bestHour ? { hour: parseInt(bestHour[0]), orders: bestHour[1] } : null,
        aiInsights,
        weeklyEarningEstimate: weeklyEstimate,
        recentReviews: reviews?.slice(0, 5) || []
      }
    }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' }
    });

  } catch (error) {
    console.error('Chef Analytics error:', error);
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' }
    });
  }
});
