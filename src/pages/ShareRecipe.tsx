
import { useState } from "react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import PremiumHeader from "@/components/PremiumHeader";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Textarea } from "@/components/ui/textarea";
import { Plus, X, Upload, Camera, Video, Sparkles, DollarSign, Users, Crown, Share, ChefHat } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

const ShareRecipe = () => {
  const [ingredients, setIngredients] = useState(["", ""]);
  const [instructions, setInstructions] = useState(["", ""]);
  const [activeTab, setActiveTab] = useState("basic");
  const [isPremiumFeature, setIsPremiumFeature] = useState(false);
  const { toast } = useToast();

  const addIngredient = () => {
    setIngredients([...ingredients, ""]);
  };

  const removeIngredient = (index: number) => {
    setIngredients(ingredients.filter((_, i) => i !== index));
  };

  const updateIngredient = (index: number, value: string) => {
    const updated = [...ingredients];
    updated[index] = value;
    setIngredients(updated);
  };

  const addInstruction = () => {
    setInstructions([...instructions, ""]);
  };

  const removeInstruction = (index: number) => {
    setInstructions(instructions.filter((_, i) => i !== index));
  };

  const updateInstruction = (index: number, value: string) => {
    const updated = [...instructions];
    updated[index] = value;
    setInstructions(updated);
  };

  const handlePremiumFeature = () => {
    toast({
      title: "👑 Premium Özellik",
      description: "Bu özelliği kullanmak için premium üyeliğe geçin!",
    });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 via-white to-orange-50">
      <Navbar />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
        <PremiumHeader
          title="Tarif Paylaş"
          description="Lezzetli tariflerinizi toplulukla paylaşın ve diğer kullanıcıların beğenisini kazanın!"
          emoji="🍳"
          primaryBadge={{
            icon: Share,
            text: "Paylaş",
            animate: true
          }}
          secondaryBadge={{
            icon: ChefHat,
            text: "İçerik Üretici"
          }}
          breadcrumbItems={[
            { label: "Ana Sayfa", href: "/" },
            { label: "Tarif Paylaş", isActive: true }
          ]}
        />

        {/* Creator Economy Notice */}
        <Card className="mb-6 bg-gradient-to-r from-purple-50 to-pink-50 border-purple-200">
          <CardContent className="p-6">
            <h3 className="text-lg font-semibold text-purple-800 mb-2 flex items-center gap-2">
              <Sparkles className="h-5 w-5" />
              İçerik Üreticisi Programı
            </h3>
            <p className="text-purple-700 mb-3">
              Tarifleriniz popüler olursa kazanç elde edin! En çok beğenilen tariflerden %30 gelir payı alın.
            </p>
            <div className="flex items-center gap-4 text-sm text-purple-600">
              <span className="flex items-center gap-1">
                <Users className="h-4 w-4" />
                1000+ takipçi = Aylık bonus
              </span>
              <span className="flex items-center gap-1">
                <DollarSign className="h-4 w-4" />
                Tarif başı 0.50₺ - 15₺
              </span>
              <span className="flex items-center gap-1">
                <Crown className="h-4 w-4" />
                Premium içerik = 2x kazanç
              </span>
            </div>
          </CardContent>
        </Card>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <TabsList className="grid w-full grid-cols-5">
            <TabsTrigger value="basic">Temel Bilgiler</TabsTrigger>
            <TabsTrigger value="media">Medya</TabsTrigger>
            <TabsTrigger value="content">İçerik</TabsTrigger>
            <TabsTrigger value="monetization">Monetizasyon</TabsTrigger>
            <TabsTrigger value="advanced">Gelişmiş</TabsTrigger>
          </TabsList>

          <TabsContent value="basic">
            <Card>
              <CardHeader>
                <CardTitle>Temel Bilgiler</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <label className="block text-sm font-medium mb-2">Tarif Adı *</label>
                  <Input placeholder="Tarifinizin çekici adını yazın..." />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">Kısa Açıklama *</label>
                  <Textarea
                    className="resize-none h-24"
                    placeholder="Tarifinizi özetleyen çekici bir açıklama yazın..."
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                  <div>
                    <label className="block text-sm font-medium mb-2">Pişirme Süresi</label>
                    <Input placeholder="25 dk" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-2">Kaç Kişilik</label>
                    <Input placeholder="4 kişi" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-2">Zorluk</label>
                    <select className="w-full p-2 border border-gray-200 rounded-lg" title="Zorluk Seviyesi Seçiniz">
                      <option>Kolay</option>
                      <option>Orta</option>
                      <option>Zor</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-2">Kalori (100g)</label>
                    <Input placeholder="250 kcal" />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium mb-2">Ana Kategori</label>
                    <select className="w-full p-2 border border-gray-200 rounded-lg" title="Ana Kategori Seçiniz">
                      <option>Ana Yemek</option>
                      <option>Çorba</option>
                      <option>Tatlı</option>
                      <option>Kahvaltı</option>
                      <option>15 Dakikada</option>
                      <option>Vegan</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-2">Alt Kategori</label>
                    <select className="w-full p-2 border border-gray-200 rounded-lg" title="Alt Kategori Seçiniz">
                      <option>Tavuk Yemekleri</option>
                      <option>Et Yemekleri</option>
                      <option>Sebze Yemekleri</option>
                      <option>Deniz Ürünleri</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">Etiketler</label>
                  <Input placeholder="#pratik #lezzetli #ekonomik (virgülle ayırın)" />
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="media">
            <Card>
              <CardHeader>
                <CardTitle>Fotoğraf ve Video</CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div>
                  <label className="block text-sm font-medium mb-2">Ana Fotoğraf *</label>
                  <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center">
                    <Upload className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                    <p className="text-gray-600 mb-2">Yüksek kaliteli fotoğraf yükleyin</p>
                    <p className="text-sm text-gray-500">PNG, JPG (Max 5MB)</p>
                    <input type="file" className="hidden" accept="image/*" title="Ana fotoğraf yükle" />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">Adım Adım Fotoğraflar</label>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    {[1, 2, 3, 4].map((step) => (
                      <div key={step} className="border-2 border-dashed border-gray-200 rounded-lg p-4 text-center">
                        <Camera className="h-8 w-8 text-gray-400 mx-auto mb-2" />
                        <p className="text-xs text-gray-500">Adım {step}</p>
                      </div>
                    ))}
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">Video URL (Opsiyonel)</label>
                  <Input placeholder="YouTube, TikTok veya Instagram video linki..." />
                  <p className="text-xs text-gray-500 mt-1">Video eklemek tarifiinizin görünürlüğünü 5x artırır!</p>
                </div>

                <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                  <h4 className="font-semibold text-yellow-800 mb-2 flex items-center gap-2">
                    <Video className="h-4 w-4" />
                    Video Hikâyesi Özelliği
                  </h4>
                  <p className="text-yellow-700 text-sm mb-3">
                    60 saniye altında video hikâyesi oluşturun ve daha fazla görüntülenme alın!
                  </p>
                  <Button size="sm" className="bg-yellow-500 hover:bg-yellow-600 text-white">
                    Video Hikâyesi Oluştur
                  </Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="content">
            <div className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>Malzemeler</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  {ingredients.map((ingredient, index) => (
                    <div key={index} className="flex gap-2">
                      <Input
                        value={ingredient}
                        onChange={(e) => updateIngredient(index, e.target.value)}
                        placeholder={`${index + 1}. malzeme ve miktarı...`}
                        className="flex-1"
                      />
                      <Button
                        type="button"
                        variant="outline"
                        size="icon"
                        onClick={() => removeIngredient(index)}
                        className="flex-shrink-0"
                      >
                        <X className="h-4 w-4" />
                      </Button>
                    </div>
                  ))}
                  <Button
                    type="button"
                    variant="outline"
                    onClick={addIngredient}
                    className="w-full"
                  >
                    <Plus className="h-4 w-4 mr-2" />
                    Malzeme Ekle
                  </Button>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Yapılışı</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  {instructions.map((instruction, index) => (
                    <div key={index} className="flex gap-2">
                      <span className="bg-food-500 text-white w-8 h-8 rounded-full flex items-center justify-center text-sm font-semibold flex-shrink-0 mt-1">
                        {index + 1}
                      </span>
                      <Textarea
                        value={instruction}
                        onChange={(e) => updateInstruction(index, e.target.value)}
                        placeholder={`${index + 1}. adımı detaylı olarak yazın...`}
                        className="flex-1 resize-none h-20"
                      />
                      <Button
                        type="button"
                        variant="outline"
                        size="icon"
                        onClick={() => removeInstruction(index)}
                        className="flex-shrink-0 mt-1"
                      >
                        <X className="h-4 w-4" />
                      </Button>
                    </div>
                  ))}
                  <Button
                    type="button"
                    variant="outline"
                    onClick={addInstruction}
                    className="w-full"
                  >
                    <Plus className="h-4 w-4 mr-2" />
                    Adım Ekle
                  </Button>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Püf Noktaları ve İpuçları</CardTitle>
                </CardHeader>
                <CardContent>
                  <Textarea
                    className="resize-none h-24"
                    placeholder="Tarifiniz için özel ipuçları, püf noktaları ve alternatif malzemeler..."
                  />
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="monetization">
            <div className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <DollarSign className="h-5 w-5" />
                    Kazanç Ayarları
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="flex items-center gap-2 mb-2">
                        <input type="checkbox" className="rounded" />
                        <span className="text-sm font-medium">Ücretsiz Tarif</span>
                      </label>
                      <p className="text-xs text-gray-500">Herkes görebilir, reklamlardan gelir alırsınız</p>
                    </div>
                    <div>
                      <label className="flex items-center gap-2 mb-2">
                        <input type="checkbox" className="rounded" />
                        <span className="text-sm font-medium">Premium Tarif</span>
                        <Badge className="bg-yellow-100 text-yellow-800">2x Kazanç</Badge>
                      </label>
                      <p className="text-xs text-gray-500">Sadece premium üyeler görebilir</p>
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium mb-2">Affiliate Ürünler</label>
                    <Input placeholder="Kullandığınız ürünlerin linklerini ekleyin..." />
                    <p className="text-xs text-gray-500 mt-1">Satış başına %10-15 komisyon kazanın</p>
                  </div>

                  <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                    <h4 className="font-semibold text-green-800 mb-2">💰 Tahmini Kazanç</h4>
                    <div className="grid grid-cols-3 gap-4 text-sm">
                      <div>
                        <div className="font-bold text-green-700">₺2-8/gün</div>
                        <div className="text-green-600">1K görüntülenme</div>
                      </div>
                      <div>
                        <div className="font-bold text-green-700">₺15-45/gün</div>
                        <div className="text-green-600">10K görüntülenme</div>
                      </div>
                      <div>
                        <div className="font-bold text-green-700">₺75-200/gün</div>
                        <div className="text-green-600">50K görüntülenme</div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Sponsorluk & İşbirlikleri</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium mb-2">Marka İşbirliği</label>
                    <select className="w-full p-2 border border-gray-200 rounded-lg" title="Marka İşbirliği Tercihi">
                      <option>İşbirliği kabul ediyorum</option>
                      <option>Sadece gıda markaları</option>
                      <option>İşbirliği istemiyorum</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium mb-2">Minimum İşbirliği Ücreti</label>
                    <Input placeholder="₺500" />
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="advanced">
            <div className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Crown className="h-5 w-5" />
                    Premium Özellikler
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div
                      className="border rounded-lg p-4 cursor-pointer hover:bg-gray-50"
                      onClick={handlePremiumFeature}
                    >
                      <h4 className="font-semibold mb-2">📊 Detaylı Analitik</h4>
                      <p className="text-sm text-gray-600">Hangi ülkelerden görüntülendiğini görün</p>
                    </div>
                    <div
                      className="border rounded-lg p-4 cursor-pointer hover:bg-gray-50"
                      onClick={handlePremiumFeature}
                    >
                      <h4 className="font-semibold mb-2">🎯 Hedef Kitle</h4>
                      <p className="text-sm text-gray-600">Belirli demografiye göster</p>
                    </div>
                    <div
                      className="border rounded-lg p-4 cursor-pointer hover:bg-gray-50"
                      onClick={handlePremiumFeature}
                    >
                      <h4 className="font-semibold mb-2">📱 Sosyal Medya Auto-Post</h4>
                      <p className="text-sm text-gray-600">Otomatik Instagram/TikTok paylaşımı</p>
                    </div>
                    <div
                      className="border rounded-lg p-4 cursor-pointer hover:bg-gray-50"
                      onClick={handlePremiumFeature}
                    >
                      <h4 className="font-semibold mb-2">🛒 Alışveriş Listesi Auto</h4>
                      <p className="text-sm text-gray-600">Malzemelerden otomatik liste</p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>SEO & Keşfedilebilirlik</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium mb-2">SEO Başlığı</label>
                    <Input placeholder="Arama motorları için optimize edilmiş başlık..." />
                  </div>

                  <div>
                    <label className="block text-sm font-medium mb-2">Meta Açıklama</label>
                    <Textarea className="resize-none h-20" placeholder="Arama sonuçlarında görünecek açıklama..." />
                  </div>

                  <div>
                    <label className="block text-sm font-medium mb-2">Trend Anahtar Kelimeler</label>
                    <Input placeholder="#kolaytarif #hızlıyemek #ekonomik" />
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>

        <div className="flex gap-4 mt-8">
          <Button type="submit" className="gradient-primary text-white flex-1">
            Tarifi Yayınla ve Para Kazanmaya Başla
          </Button>
          <Button type="button" variant="outline">
            Taslak Kaydet
          </Button>
          <Button type="button" variant="outline">
            Önizleme
          </Button>
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default ShareRecipe;
