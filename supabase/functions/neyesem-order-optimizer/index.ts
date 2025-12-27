import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

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

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
    const supabaseKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
    const supabase = createClient(supabaseUrl, supabaseKey);

    const { action, order_id, chef_id, delivery_latitude, delivery_longitude } = await req.json();

    if (action === 'assign_courier') {
      // En uygun kuryeyi bul
      const result = await assignOptimalCourier(supabase, order_id, chef_id, delivery_latitude, delivery_longitude);
      return new Response(JSON.stringify(result), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      });
    }

    if (action === 'optimize_route') {
      // Kurye rotasını optimize et
      const result = await optimizeCourierRoute(supabase, order_id);
      return new Response(JSON.stringify(result), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      });
    }

    if (action === 'predict_delay') {
      // Gecikme riski tahmin et
      const result = await predictDelayRisk(supabase, order_id);
      return new Response(JSON.stringify(result), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      });
    }

    if (action === 'group_orders') {
      // Aynı bölgedeki siparişleri grupla
      const result = await groupNearbyOrders(supabase);
      return new Response(JSON.stringify(result), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      });
    }

    return new Response(JSON.stringify({ error: 'Invalid action' }), {
      status: 400,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' }
    });

  } catch (error) {
    console.error('Order Optimizer error:', error);
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' }
    });
  }
});

async function assignOptimalCourier(
  supabase: any, 
  orderId: string, 
  chefId: string, 
  deliveryLat: number, 
  deliveryLon: number
) {
  // Şef konumunu al
  const { data: chef } = await supabase
    .from('chef_profiles')
    .select('latitude, longitude')
    .eq('id', chefId)
    .single();

  if (!chef?.latitude || !chef?.longitude) {
    return { success: false, error: 'Chef location not found' };
  }

  // Müsait kuryeleri al
  const { data: couriers } = await supabase
    .from('couriers')
    .select('*')
    .eq('status', 'available')
    .eq('is_active', true)
    .lt('current_load', supabase.raw('max_load'));

  if (!couriers || couriers.length === 0) {
    return { success: false, error: 'No available couriers' };
  }

  // Her kurye için skor hesapla
  const scoredCouriers = couriers.map((courier: any) => {
    const distanceToChef = calculateDistance(
      courier.current_latitude, courier.current_longitude,
      chef.latitude, chef.longitude
    );

    const distanceToCustomer = calculateDistance(
      chef.latitude, chef.longitude,
      deliveryLat, deliveryLon
    );

    // Skorlama faktörleri
    let score = 100;
    
    // Mesafe puanı (yakın olan tercih edilir)
    score -= distanceToChef * 5;
    
    // Yük durumu (az yüklü tercih edilir)
    score -= (courier.current_load / courier.max_load) * 20;
    
    // Güven skoru
    score += (courier.trust_score || 0) / 5;
    
    // Ortalama teslimat süresi (hızlı olan tercih edilir)
    score -= (courier.avg_delivery_time || 25) / 5;

    const estimatedTime = Math.round(
      (distanceToChef * 3) + // Şefe gitme süresi
      15 + // Bekleme süresi
      (distanceToCustomer * 3) // Müşteriye gitme süresi
    );

    return {
      courier,
      score,
      distanceToChef: Math.round(distanceToChef * 10) / 10,
      distanceToCustomer: Math.round(distanceToCustomer * 10) / 10,
      estimatedTime
    };
  });

  // En iyi kuryeyi seç
  scoredCouriers.sort((a: any, b: any) => b.score - a.score);
  const bestCourier = scoredCouriers[0];

  if (!bestCourier) {
    return { success: false, error: 'Could not find suitable courier' };
  }

  // Siparişe kurye ata
  await supabase
    .from('orders')
    .update({
      courier_id: bestCourier.courier.id,
      ai_assigned: true,
      estimated_delivery_time: new Date(Date.now() + bestCourier.estimatedTime * 60000).toISOString(),
      ai_notes: `En uygun kurye: ${bestCourier.courier.fullname}. Şefe ${bestCourier.distanceToChef}km, müşteriye ${bestCourier.distanceToCustomer}km.`
    })
    .eq('id', orderId);

  // Kurye yükünü güncelle
  await supabase
    .from('couriers')
    .update({
      current_load: bestCourier.courier.current_load + 1,
      status: bestCourier.courier.current_load + 1 >= bestCourier.courier.max_load ? 'busy' : 'available'
    })
    .eq('id', bestCourier.courier.id);

  // Rota oluştur
  await supabase.from('courier_routes').insert({
    courier_id: bestCourier.courier.id,
    order_id: orderId,
    pickup_latitude: chef.latitude,
    pickup_longitude: chef.longitude,
    delivery_latitude: deliveryLat,
    delivery_longitude: deliveryLon,
    estimated_pickup_time: new Date(Date.now() + (bestCourier.distanceToChef * 3) * 60000).toISOString(),
    estimated_delivery_time: new Date(Date.now() + bestCourier.estimatedTime * 60000).toISOString(),
    distance_km: bestCourier.distanceToChef + bestCourier.distanceToCustomer,
    status: 'assigned'
  });

  return {
    success: true,
    courier: bestCourier.courier,
    estimatedTime: bestCourier.estimatedTime,
    score: bestCourier.score
  };
}

async function optimizeCourierRoute(supabase: any, courierId: string) {
  // Kuryenin aktif rotalarını al
  const { data: routes } = await supabase
    .from('courier_routes')
    .select('*, orders(chef_id, chef_profiles(latitude, longitude))')
    .eq('courier_id', courierId)
    .in('status', ['assigned', 'picking_up']);

  if (!routes || routes.length <= 1) {
    return { success: true, message: 'No optimization needed', routes };
  }

  // Basit nearest neighbor algoritması ile rota optimize et
  const { data: courier } = await supabase
    .from('couriers')
    .select('current_latitude, current_longitude')
    .eq('id', courierId)
    .single();

  let currentLat = courier?.current_latitude || 0;
  let currentLon = courier?.current_longitude || 0;
  const optimizedOrder: any[] = [];
  const remaining = [...routes];

  while (remaining.length > 0) {
    let nearestIndex = 0;
    let nearestDistance = Infinity;

    remaining.forEach((route, index) => {
      const dist = calculateDistance(
        currentLat, currentLon,
        route.pickup_latitude, route.pickup_longitude
      );
      if (dist < nearestDistance) {
        nearestDistance = dist;
        nearestIndex = index;
      }
    });

    const nearest = remaining.splice(nearestIndex, 1)[0];
    optimizedOrder.push(nearest);
    currentLat = nearest.delivery_latitude;
    currentLon = nearest.delivery_longitude;
  }

  // Rota sırasını güncelle
  for (let i = 0; i < optimizedOrder.length; i++) {
    await supabase
      .from('courier_routes')
      .update({ route_order: i + 1 })
      .eq('id', optimizedOrder[i].id);
  }

  return {
    success: true,
    optimizedRoutes: optimizedOrder.map((r, i) => ({
      ...r,
      route_order: i + 1
    }))
  };
}

async function predictDelayRisk(supabase: any, orderId: string) {
  const { data: order } = await supabase
    .from('orders')
    .select(`
      *,
      chef_profiles(avg_prep_time, current_daily_orders, daily_order_limit),
      couriers(current_load, avg_delivery_time, status)
    `)
    .eq('id', orderId)
    .single();

  if (!order) {
    return { success: false, error: 'Order not found' };
  }

  let riskScore = 0;
  const riskFactors: string[] = [];

  // Şef yoğunluğu riski
  const chefLoadRatio = (order.chef_profiles?.current_daily_orders || 0) / 
                        (order.chef_profiles?.daily_order_limit || 20);
  if (chefLoadRatio > 0.8) {
    riskScore += 30;
    riskFactors.push("Şef çok yoğun");
  } else if (chefLoadRatio > 0.6) {
    riskScore += 15;
    riskFactors.push("Şef yoğun");
  }

  // Kurye durumu riski
  if (order.couriers?.current_load >= 3) {
    riskScore += 25;
    riskFactors.push("Kurye çok yüklü");
  }

  // Saat bazlı risk (öğle ve akşam yoğunluğu)
  const hour = new Date().getHours();
  if ((hour >= 12 && hour <= 14) || (hour >= 19 && hour <= 21)) {
    riskScore += 15;
    riskFactors.push("Yoğun saat dilimi");
  }

  // Siparişi güncelle
  await supabase
    .from('orders')
    .update({
      delay_risk_score: riskScore,
      ai_notes: riskFactors.length > 0 
        ? `Gecikme riski: ${riskFactors.join(', ')}`
        : 'Düşük gecikme riski'
    })
    .eq('id', orderId);

  return {
    success: true,
    riskScore,
    riskLevel: riskScore >= 50 ? 'high' : riskScore >= 25 ? 'medium' : 'low',
    riskFactors
  };
}

async function groupNearbyOrders(supabase: any) {
  // Bekleyen siparişleri al
  const { data: pendingOrders } = await supabase
    .from('orders')
    .select('*, chef_profiles(latitude, longitude)')
    .eq('status', 'preparing')
    .is('courier_id', null);

  if (!pendingOrders || pendingOrders.length < 2) {
    return { success: true, groups: [], message: 'Not enough orders to group' };
  }

  // Siparişleri grupla (2km içindeki siparişler)
  const groups: any[][] = [];
  const assigned = new Set<string>();

  for (const order of pendingOrders) {
    if (assigned.has(order.id)) continue;

    const group = [order];
    assigned.add(order.id);

    for (const other of pendingOrders) {
      if (assigned.has(other.id)) continue;

      const distance = calculateDistance(
        order.delivery_latitude, order.delivery_longitude,
        other.delivery_latitude, other.delivery_longitude
      );

      if (distance <= 2) {
        group.push(other);
        assigned.add(other.id);
      }
    }

    if (group.length > 1) {
      groups.push(group);
    }
  }

  return {
    success: true,
    totalOrders: pendingOrders.length,
    groupCount: groups.length,
    groups: groups.map(g => ({
      orderCount: g.length,
      orderIds: g.map((o: any) => o.id)
    }))
  };
}
