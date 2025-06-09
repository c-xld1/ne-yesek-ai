
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Plus, Youtube, Video, Instagram, Clock, Users } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

const AddVideoStory = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [formData, setFormData] = useState({
    title: "",
    videoUrl: "",
    category: "",
    cookingTime: "",
    servings: "",
    ingredients: "",
    description: ""
  });
  const { toast } = useToast();

  const categories = [
    "Ana Yemek", "Tatlı", "Çorba", "Kahvaltı", "Vegan", 
    "Fit", "İçecek", "Atıştırmalık", "Hamur İşi", "Salata"
  ];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.title || !formData.videoUrl || !formData.category) {
      toast({
        title: "❌ Eksik Bilgi",
        description: "Lütfen zorunlu alanları doldurun",
      });
      return;
    }

    // Video URL validation
    const isValidUrl = formData.videoUrl.includes('youtube.com/shorts') || 
                      formData.videoUrl.includes('tiktok.com') || 
                      formData.videoUrl.includes('instagram.com/reel');
    
    if (!isValidUrl) {
      toast({
        title: "❌ Geçersiz Link",
        description: "YouTube Shorts, TikTok veya Instagram Reels linki ekleyin",
      });
      return;
    }

    toast({
      title: "🎉 Tarif Hikâyesi Eklendi!",
      description: "Videonuz onay bekliyor. 24 saat içinde yayınlanacak.",
    });

    setFormData({
      title: "",
      videoUrl: "",
      category: "",
      cookingTime: "",
      servings: "",
      ingredients: "",
      description: ""
    });
    setIsOpen(false);
  };

  const getPlatformIcon = (url: string) => {
    if (url.includes('youtube.com')) return <Youtube className="h-4 w-4 text-red-600" />;
    if (url.includes('tiktok.com')) return <Video className="h-4 w-4 text-black" />;
    if (url.includes('instagram.com')) return <Instagram className="h-4 w-4 text-pink-600" />;
    return <Video className="h-4 w-4 text-gray-600" />;
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button className="gradient-primary text-white">
          <Plus className="h-4 w-4 mr-2" />
          Tarif Hikâyesi Ekle
        </Button>
      </DialogTrigger>
      
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            🎬 Yeni Tarif Hikâyesi Ekle
            <Badge className="bg-red-100 text-red-800">Video</Badge>
          </DialogTitle>
        </DialogHeader>

        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Video Bilgileri</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-2">
                  Video Başlığı *
                </label>
                <Input
                  value={formData.title}
                  onChange={(e) => setFormData({...formData, title: e.target.value})}
                  placeholder="60 saniyede tavuk sote nasıl yapılır?"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">
                  Video Linki *
                </label>
                <div className="relative">
                  <Input
                    value={formData.videoUrl}
                    onChange={(e) => setFormData({...formData, videoUrl: e.target.value})}
                    placeholder="YouTube Shorts, TikTok veya Instagram Reels linki..."
                    className="pl-10"
                    required
                  />
                  <div className="absolute left-3 top-1/2 -translate-y-1/2">
                    {getPlatformIcon(formData.videoUrl)}
                  </div>
                </div>
                <p className="text-xs text-gray-500 mt-1">
                  Desteklenen platformlar: YouTube Shorts, TikTok, Instagram Reels
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-2">
                    Kategori *
                  </label>
                  <select 
                    value={formData.category}
                    onChange={(e) => setFormData({...formData, category: e.target.value})}
                    className="w-full p-2 border border-gray-200 rounded-lg"
                    required
                  >
                    <option value="">Seçin...</option>
                    {categories.map(cat => (
                      <option key={cat} value={cat}>{cat}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">
                    Pişirme Süresi
                  </label>
                  <div className="relative">
                    <Clock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                    <Input
                      value={formData.cookingTime}
                      onChange={(e) => setFormData({...formData, cookingTime: e.target.value})}
                      placeholder="25 dk"
                      className="pl-10"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">
                    Kaç Kişilik
                  </label>
                  <div className="relative">
                    <Users className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                    <Input
                      value={formData.servings}
                      onChange={(e) => setFormData({...formData, servings: e.target.value})}
                      placeholder="4 kişi"
                      className="pl-10"
                    />
                  </div>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">
                  Ana Malzemeler (virgülle ayırın)
                </label>
                <Input
                  value={formData.ingredients}
                  onChange={(e) => setFormData({...formData, ingredients: e.target.value})}
                  placeholder="tavuk göğsü, soğan, domates, biber"
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">
                  Kısa Açıklama
                </label>
                <textarea
                  value={formData.description}
                  onChange={(e) => setFormData({...formData, description: e.target.value})}
                  className="w-full p-3 border border-gray-200 rounded-lg resize-none h-20"
                  placeholder="Videonuzda anlatılan tarif hakkında kısa bilgi..."
                />
              </div>

              <div className="bg-blue-50 p-4 rounded-lg">
                <h4 className="font-semibold text-blue-900 mb-2">📋 İçerik Kuralları</h4>
                <ul className="text-sm text-blue-700 space-y-1">
                  <li>• Video süresi 15 saniye - 3 dakika arası olmalı</li>
                  <li>• Tarif net ve anlaşılır şekilde anlatılmalı</li>
                  <li>• Başka kaynaklardan alınan videolar kaynak belirtilmeli</li>
                  <li>• Uygunsuz içerik paylaşımı hesap kapatılmasına neden olur</li>
                </ul>
              </div>

              <div className="flex gap-3">
                <Button type="submit" className="gradient-primary text-white flex-1">
                  Hikâyeyi Paylaş
                </Button>
                <Button 
                  type="button" 
                  variant="outline"
                  onClick={() => setIsOpen(false)}
                >
                  İptal
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      </DialogContent>
    </Dialog>
  );
};

export default AddVideoStory;
