import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.7.1';

const openAIApiKey = Deno.env.get('OPENAI_API_KEY');

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

// Input validation
const validateAction = (action: string): boolean => {
  const validActions = ['menu_suggestion', 'pricing_suggestion', 'description_writer'];
  return validActions.includes(action);
};

const validateContext = (context: any, action: string): { valid: boolean; error?: string } => {
  if (!context || typeof context !== 'object') {
    return { valid: false, error: 'Invalid context format' };
  }

  const stringFields = ['city', 'cuisine_type', 'meal_name', 'ingredients'];
  for (const field of stringFields) {
    if (context[field] && (typeof context[field] !== 'string' || context[field].length > 500)) {
      return { valid: false, error: `${field} must be a string with max 500 characters` };
    }
  }

  if (context.servings && (!Number.isInteger(context.servings) || context.servings < 1 || context.servings > 100)) {
    return { valid: false, error: 'Servings must be an integer between 1 and 100' };
  }

  return { valid: true };
};

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    // Verify authentication - chef functions should be restricted to chefs only
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

    const { action, context } = await req.json();

    // Validate action
    if (!validateAction(action)) {
      return new Response(
        JSON.stringify({ error: 'Invalid action' }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 400 }
      );
    }

    // Validate context
    const validation = validateContext(context, action);
    if (!validation.valid) {
      return new Response(
        JSON.stringify({ error: validation.error }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 400 }
      );
    }

    if (!openAIApiKey) {
      return new Response(
        JSON.stringify({ error: 'OpenAI API not configured' }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 500 }
      );
    }

    let systemPrompt = "";
    let userPrompt = "";

    switch (action) {
      case "menu_suggestion":
        systemPrompt = "Sen bir mutfak danışmanısın. Kullanıcının bölgesine ve mevsime göre popüler olabilecek yemek önerileri sun. Türk mutfağına odaklan.";
        userPrompt = `Bölge: ${context.city}, Mevsim: ${context.season || 'Şu an'}, Mutfak Türü: ${context.cuisine_type}. Hangi yemekleri menüye eklemeliyim? 5 öneri ver.`;
        break;
      
      case "pricing_suggestion":
        systemPrompt = "Sen bir fiyatlandırma uzmanısın. Malzeme maliyetleri ve piyasa fiyatlarını göz önünde bulundurarak uygun fiyat öner.";
        userPrompt = `Yemek: ${context.meal_name}, Malzemeler: ${context.ingredients}, Kişi sayısı: ${context.servings}. Ne kadar fiyat koymalıyım?`;
        break;
      
      case "description_writer":
        systemPrompt = "Sen yaratıcı bir içerik yazarısın. Yemek için çekici ve iştah açıcı açıklamalar yaz.";
        userPrompt = `Yemek adı: ${context.meal_name}, Malzemeler: ${context.ingredients}. Bu yemek için etkileyici bir açıklama yaz (max 100 kelime).`;
        break;
    }

    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${openAIApiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'gpt-4o-mini',
        messages: [
          { role: 'system', content: systemPrompt },
          { role: 'user', content: userPrompt }
        ],
        temperature: 0.7,
        max_tokens: 500,
      }),
    });

    if (!response.ok) {
      const error = await response.text();
      console.error("OpenAI API error:", error);
      return new Response(
        JSON.stringify({ error: `OpenAI API error: ${response.status}` }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 500 }
      );
    }

    const data = await response.json();
    const aiResponse = data.choices[0].message.content;

    return new Response(JSON.stringify({ response: aiResponse }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  } catch (error) {
    console.error('Error in chef-ai-assistant:', error);
    return new Response(JSON.stringify({ error: 'Internal server error' }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});
