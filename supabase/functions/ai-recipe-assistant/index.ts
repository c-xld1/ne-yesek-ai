import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.7.1';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

// Input validation
const validateAction = (action: string): boolean => {
  const validActions = ['improve_recipe', 'suggest_ingredients', 'generate_instructions', 'estimate_times', 'suggest_difficulty'];
  return validActions.includes(action);
};

const validateData = (data: any): { valid: boolean; error?: string } => {
  if (!data || typeof data !== 'object') {
    return { valid: false, error: 'Invalid data format' };
  }
  if (data.title && (typeof data.title !== 'string' || data.title.length > 200)) {
    return { valid: false, error: 'Title must be a string with max 200 characters' };
  }
  if (data.ingredients && (typeof data.ingredients !== 'string' || data.ingredients.length > 1000)) {
    return { valid: false, error: 'Ingredients must be a string with max 1000 characters' };
  }
  if (data.instructions && (typeof data.instructions !== 'string' || data.instructions.length > 2000)) {
    return { valid: false, error: 'Instructions must be a string with max 2000 characters' };
  }
  return { valid: true };
};

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    // Verify authentication
    const authHeader = req.headers.get('Authorization');
    if (!authHeader) {
      return new Response(
        JSON.stringify({ error: 'Authentication required' }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 401 }
      );
    }

    const supabaseClient = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_ANON_KEY') ?? '',
      { global: { headers: { Authorization: authHeader } } }
    );

    const { data: { user }, error: userError } = await supabaseClient.auth.getUser();
    if (userError || !user) {
      return new Response(
        JSON.stringify({ error: 'Invalid authentication' }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 401 }
      );
    }

    const { action, data } = await req.json();

    // Validate action
    if (!validateAction(action)) {
      return new Response(
        JSON.stringify({ error: 'Invalid action' }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 400 }
      );
    }

    // Validate data
    const validation = validateData(data);
    if (!validation.valid) {
      return new Response(
        JSON.stringify({ error: validation.error }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 400 }
      );
    }
    const LOVABLE_API_KEY = Deno.env.get('LOVABLE_API_KEY');

    if (!LOVABLE_API_KEY) {
      throw new Error('LOVABLE_API_KEY is not configured');
    }

    let systemPrompt = '';
    let userPrompt = '';

    switch (action) {
      case 'improve_recipe':
        systemPrompt = 'Tarif uzmanı bir AI asistanısın. Kullanıcının verdiği tarifi analiz edip geliştirmeler öner. Malzeme miktarları, pişirme süreleri ve talimatlar için iyileştirmeler sun. Türkçe yanıt ver.';
        userPrompt = `Şu tarifi geliştir:\n\nBaşlık: ${data.title}\nMalzemeler: ${data.ingredients}\nTalimatlar: ${data.instructions}\n\nDaha profesyonel, detaylı ve lezzetli hale getir.`;
        break;
      
      case 'suggest_ingredients':
        systemPrompt = 'Tarif uzmanı bir AI asistanısın. Verilen tarif için uygun malzemeler öner. Türkçe yanıt ver.';
        userPrompt = `"${data.title}" için hangi malzemeleri önerirsin? Standart bir tarif için gerekli malzemeleri listele.`;
        break;
      
      case 'generate_instructions':
        systemPrompt = 'Tarif uzmanı bir AI asistanısın. Verilen malzemeler için adım adım pişirme talimatları oluştur. Net, anlaşılır ve sıralı adımlar sun. Türkçe yanıt ver.';
        userPrompt = `Şu malzemelerle "${data.title}" nasıl yapılır?\n\nMalzemeler:\n${data.ingredients}\n\nDetaylı adım adım talimatlar oluştur.`;
        break;
      
      case 'estimate_times':
        systemPrompt = 'Tarif uzmanı bir AI asistanısın. Verilen tarif için hazırlık ve pişirme sürelerini tahmin et. Türkçe yanıt ver.';
        userPrompt = `"${data.title}" için hazırlık süresi ve pişirme süresi ne kadar olmalı? Sadece dakika cinsinden sayı ver. Format: "Hazırlık: X dakika, Pişirme: Y dakika"`;
        break;

      case 'suggest_difficulty':
        systemPrompt = 'Tarif uzmanı bir AI asistanısın. Verilen tarif için zorluk seviyesi belirle. Türkçe yanıt ver.';
        userPrompt = `"${data.title}" tarifinin zorluk seviyesi nedir? Sadece "Kolay", "Orta" veya "Zor" olarak yanıt ver.`;
        break;

      default:
        throw new Error('Invalid action');
    }

    const response = await fetch('https://ai.gateway.lovable.dev/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${LOVABLE_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'google/gemini-2.5-flash',
        messages: [
          { role: 'system', content: systemPrompt },
          { role: 'user', content: userPrompt }
        ],
      }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error('AI API error:', response.status, errorText);
      
      if (response.status === 429) {
        return new Response(
          JSON.stringify({ error: 'Rate limit aşıldı. Lütfen birkaç dakika sonra tekrar deneyin.' }),
          { status: 429, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        );
      }
      
      if (response.status === 402) {
        return new Response(
          JSON.stringify({ error: 'AI kredisi yetersiz. Lütfen kredi yükleyin.' }),
          { status: 402, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        );
      }
      
      throw new Error('AI API error');
    }

    const aiResponse = await response.json();
    const suggestion = aiResponse.choices[0].message.content;

    return new Response(
      JSON.stringify({ suggestion }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );

  } catch (error) {
    console.error('Error in ai-recipe-assistant:', error);
    return new Response(
      JSON.stringify({ error: error.message }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});