import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const openAIApiKey = Deno.env.get('OPENAI_API_KEY');

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { action, context } = await req.json();

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
      
      default:
        throw new Error("Invalid action");
    }

    console.log("Sending request to OpenAI:", { action, context });

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
      throw new Error(`OpenAI API error: ${response.status}`);
    }

    const data = await response.json();
    const aiResponse = data.choices[0].message.content;

    console.log("AI Response:", aiResponse);

    return new Response(JSON.stringify({ response: aiResponse }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  } catch (error) {
    console.error('Error in chef-ai-assistant:', error);
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});
