/**
 * Ollama Free API Integration
 * https://github.com/mfoud444/ollamafreeapi
 * 
 * Bu servis ücretsiz Ollama API'si ile iletişim kurar.
 * Yemek açıklamaları, fiyatlandırma önerileri ve menü optimizasyonu için AI desteği sağlar.
 */

export interface OllamaResponse {
  response: string;
  done: boolean;
  context?: number[];
  model?: string;
}

export interface AIGenerateRequest {
  model: string;
  prompt: string;
  stream?: boolean;
  temperature?: number;
  max_tokens?: number;
}

class OllamaAIService {
  // Ücretsiz Ollama API endpoint (proxy gerekebilir)
  private baseURL = 'https://api.ollama.ai/api'; // Bu URL değişebilir
  
  // Kullanılabilir modeller
  readonly MODELS = {
    LLAMA3_8B: 'llama3:8b-instruct',
    LLAMA3_70B: 'llama3.3:70b',
    MISTRAL_7B: 'mistral:7b-v0.2',
    DEEPSEEK_7B: 'deepseek-r1:7b',
    QWEN_7B: 'qwen:7b-chat',
  };

  /**
   * Yemek açıklaması oluşturur
   */
  async generateMealDescription(mealName: string, ingredients: string[]): Promise<string> {
    const prompt = `Sen bir profesyonel şef ve yemek yazarısın. Aşağıdaki yemek için çekici, lezzetli ve kısa bir açıklama yaz (maksimum 2-3 cümle):

Yemek Adı: ${mealName}
Malzemeler: ${ingredients.join(', ')}

Açıklama Türkçe olmalı ve müşteriyi cezbetmelidir. Sadece açıklamayı yaz, başka bir şey yazma.`;

    try {
      const response = await this.generateText(prompt, this.MODELS.LLAMA3_8B);
      return response.trim();
    } catch (error) {
      console.error('AI açıklama hatası:', error);
      return `${mealName} - Taze malzemelerle özenle hazırlanmış, lezzetli bir yemek.`;
    }
  }

  /**
   * Yemek fiyatı önerir
   */
  async suggestPricing(mealName: string, ingredients: string[], portionSize: string): Promise<number> {
    const prompt = `Sen bir yemek işletmesi danışmanısın. Aşağıdaki bilgilere göre Türkiye'de makul bir fiyat öner:

Yemek: ${mealName}
Malzemeler: ${ingredients.join(', ')}
Porsiyon: ${portionSize}

Sadece rakam olarak fiyatı TL cinsinden yaz (örn: 45). Başka açıklama yazma.`;

    try {
      const response = await this.generateText(prompt, this.MODELS.LLAMA3_8B, 0.3);
      const price = parseFloat(response.replace(/[^\d.]/g, ''));
      return isNaN(price) ? 35 : Math.max(15, Math.min(price, 150));
    } catch (error) {
      console.error('AI fiyat hatası:', error);
      return 35; // Varsayılan fiyat
    }
  }

  /**
   * Menü optimizasyon önerileri
   */
  async getMenuOptimization(meals: any[]): Promise<string> {
    const mealList = meals.slice(0, 10).map(m => `- ${m.name} (${m.price}₺)`).join('\n');
    
    const prompt = `Sen bir restoran danışmanısın. Aşağıdaki menüye bakarak 3 kısa öneri ver:

Mevcut Menü:
${mealList}

Öneriler kısa ve uygulanabilir olmalı. Numaralı liste şeklinde yaz.`;

    try {
      const response = await this.generateText(prompt, this.MODELS.LLAMA3_8B);
      return response.trim();
    } catch (error) {
      console.error('AI optimizasyon hatası:', error);
      return '1. Daha fazla vejetaryen seçenek ekleyin\n2. Mevsimlik ürünler kullanın\n3. Combo menüler oluşturun';
    }
  }

  /**
   * Yemek etiketleri önerir
   */
  async generateTags(mealName: string, description: string): Promise<string[]> {
    const prompt = `Aşağıdaki yemek için 3-5 adet kısa Türkçe etiket öner (örn: sağlıklı, baharatlı, ev yapımı):

Yemek: ${mealName}
Açıklama: ${description}

Sadece etiketleri virgülle ayırarak yaz. Başka bir şey yazma.`;

    try {
      const response = await this.generateText(prompt, this.MODELS.LLAMA3_8B);
      return response.split(',').map(tag => tag.trim()).filter(tag => tag.length > 0).slice(0, 5);
    } catch (error) {
      console.error('AI etiket hatası:', error);
      return ['ev yapımı', 'lezzetli', 'taze'];
    }
  }

  /**
   * Müşteri yorumuna otomatik cevap
   */
  async generateReviewResponse(review: string, rating: number): Promise<string> {
    const sentiment = rating >= 4 ? 'olumlu' : rating >= 3 ? 'nötr' : 'olumsuz';
    
    const prompt = `Sen bir restoran sahibisin. Müşteri yorumuna profesyonel ve samimi bir cevap yaz:

Yorum: "${review}"
Puan: ${rating}/5 (${sentiment})

Cevabın kısa (2-3 cümle), samimi ve profesyonel olmalı. Türkçe yaz.`;

    try {
      const response = await this.generateText(prompt, this.MODELS.LLAMA3_8B);
      return response.trim();
    } catch (error) {
      console.error('AI cevap hatası:', error);
      return rating >= 4 
        ? 'Güzel yorumunuz için teşekkür ederiz! Sizleri tekrar ağırlamaktan mutluluk duyarız.'
        : 'Geri bildiriminiz için teşekkürler. Deneyiminizi iyileştirmek için çalışıyoruz.';
    }
  }

  /**
   * Genel metin üretimi
   */
  private async generateText(prompt: string, model: string = this.MODELS.LLAMA3_8B, temperature: number = 0.7): Promise<string> {
    // Mock implementation - Gerçek API entegrasyonu için bu bölümü düzenleyin
    // Ollama API'nin gerçek endpoint'i kullanılmalı
    
    // Şimdilik basit simülasyon:
    return new Promise((resolve) => {
      setTimeout(() => {
        // Bu simüle edilmiş bir yanıt - gerçek API'de değiştirilecek
        if (prompt.includes('açıklama')) {
          resolve('Özenle seçilmiş taze malzemelerle hazırlanan, damak zevkinize hitap eden lezzetli bir yemek.');
        } else if (prompt.includes('fiyat')) {
          resolve('45');
        } else if (prompt.includes('etiket')) {
          resolve('sağlıklı, ev yapımı, lezzetli');
        } else if (prompt.includes('optimizasyon')) {
          resolve('1. Mevsimlik ürünleri menüye ekleyin\n2. Popüler yemekleri ön plana çıkarın\n3. Combo menüler oluşturun');
        } else {
          resolve('Değerli geri bildiriminiz için teşekkür ederiz!');
        }
      }, 1500); // API çağrısını simüle et
    });

    /* Gerçek API entegrasyonu için:
    try {
      const response = await fetch(`${this.baseURL}/generate`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          model,
          prompt,
          stream: false,
          temperature,
        }),
      });

      if (!response.ok) {
        throw new Error(`API Error: ${response.status}`);
      }

      const data: OllamaResponse = await response.json();
      return data.response;
    } catch (error) {
      console.error('Ollama API Error:', error);
      throw error;
    }
    */
  }

  /**
   * Streaming yanıt (gelecek için)
   */
  async *streamText(prompt: string, model: string = this.MODELS.LLAMA3_8B): AsyncGenerator<string> {
    // Streaming implementasyonu
    yield* [];
  }
}

// Singleton instance
export const ollamaAI = new OllamaAIService();
