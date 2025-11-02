import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { ChefHat, Upload, Loader2 } from "lucide-react";

const ChefApplication = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const navigate = useNavigate();
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const [formData, setFormData] = useState({
    fullname: "",
    phone: "",
    address: "",
    city: "",
    district: "",
    cuisine_type: "",
    experience_years: "",
    business_description: "",
    sample_menu: ""
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData(prev => ({
      ...prev,
      [e.target.name]: e.target.value
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!user) {
      toast({
        variant: "destructive",
        title: "Hata",
        description: "Başvuru yapmak için giriş yapmalısınız."
      });
      navigate("/giris-yap");
      return;
    }

    setIsSubmitting(true);

    try {
      const { error } = await supabase
        .from('chef_applications')
        .insert({
          user_id: user.id,
          fullname: formData.fullname,
          phone: formData.phone,
          address: formData.address,
          city: formData.city,
          district: formData.district || null,
          cuisine_type: formData.cuisine_type,
          experience_years: formData.experience_years ? parseInt(formData.experience_years) : null,
          business_description: formData.business_description,
          sample_menu: formData.sample_menu ? JSON.parse(formData.sample_menu) : null,
          status: 'pending'
        });

      if (error) throw error;

      toast({
        title: "Başarılı! 🎉",
        description: "Başvurunuz alındı. En kısa sürede değerlendirip size dönüş yapacağız."
      });

      navigate("/");
    } catch (error: any) {
      toast({
        variant: "destructive",
        title: "Hata",
        description: error.message || "Başvuru gönderilirken bir hata oluştu."
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 via-white to-rose-50">
      <Navbar />
      
      <div className="container mx-auto px-4 py-12 max-w-3xl">
        <Card>
          <CardHeader className="text-center">
            <div className="flex justify-center mb-4">
              <div className="p-4 bg-gradient-to-r from-orange-500 to-rose-500 rounded-full">
                <ChefHat className="h-12 w-12 text-white" />
              </div>
            </div>
            <CardTitle className="text-3xl">Şef Başvurusu</CardTitle>
            <CardDescription className="text-lg mt-2">
              Evden hazırladığınız lezzetli yemekleri satmaya başlayın!
            </CardDescription>
          </CardHeader>

          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="fullname">Ad Soyad *</Label>
                  <Input
                    id="fullname"
                    name="fullname"
                    value={formData.fullname}
                    onChange={handleChange}
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="phone">Telefon *</Label>
                  <Input
                    id="phone"
                    name="phone"
                    type="tel"
                    value={formData.phone}
                    onChange={handleChange}
                    required
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="address">Adres *</Label>
                <Input
                  id="address"
                  name="address"
                  value={formData.address}
                  onChange={handleChange}
                  required
                />
              </div>

              <div className="grid md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="city">Şehir *</Label>
                  <Input
                    id="city"
                    name="city"
                    value={formData.city}
                    onChange={handleChange}
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="district">İlçe</Label>
                  <Input
                    id="district"
                    name="district"
                    value={formData.district}
                    onChange={handleChange}
                  />
                </div>
              </div>

              <div className="grid md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="cuisine_type">Mutfak Türü *</Label>
                  <Input
                    id="cuisine_type"
                    name="cuisine_type"
                    placeholder="Örn: Ev Yemekleri, Pasta & Tatlı, İtalyan"
                    value={formData.cuisine_type}
                    onChange={handleChange}
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="experience_years">Deneyim (Yıl)</Label>
                  <Input
                    id="experience_years"
                    name="experience_years"
                    type="number"
                    min="0"
                    value={formData.experience_years}
                    onChange={handleChange}
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="business_description">İşinizi Tanıtın *</Label>
                <Textarea
                  id="business_description"
                  name="business_description"
                  rows={4}
                  placeholder="Hangi yemekleri yapıyorsunuz? Size özel bir hikayeniz var mı?"
                  value={formData.business_description}
                  onChange={handleChange}
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="sample_menu">Örnek Menü (JSON formatında - opsiyonel)</Label>
                <Textarea
                  id="sample_menu"
                  name="sample_menu"
                  rows={3}
                  placeholder='{"yemekler": ["Mantı", "Kuru Fasulye", "Pilav"]}'
                  value={formData.sample_menu}
                  onChange={handleChange}
                />
                <p className="text-xs text-muted-foreground">
                  Henüz dosya yükleme sistemi aktif değil. Sadece metin girişi yapabilirsiniz.
                </p>
              </div>

              <div className="bg-orange-50 p-4 rounded-lg">
                <h3 className="font-semibold mb-2 flex items-center gap-2">
                  <Upload className="h-4 w-4" />
                  Belgeler (Yakında Aktif Olacak)
                </h3>
                <ul className="text-sm text-muted-foreground space-y-1">
                  <li>• Kimlik belgesi</li>
                  <li>• İkamet belgesi</li>
                  <li>• Örnek menü fotoğrafları</li>
                  <li>• Tanıtım videosu (opsiyonel)</li>
                </ul>
              </div>

              <Button
                type="submit"
                className="w-full bg-gradient-to-r from-orange-500 to-rose-500"
                disabled={isSubmitting}
              >
                {isSubmitting ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Gönderiliyor...
                  </>
                ) : (
                  "Başvuruyu Gönder"
                )}
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>

      <Footer />
    </div>
  );
};

export default ChefApplication;