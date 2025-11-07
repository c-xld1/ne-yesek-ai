import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import { Search, Save, RefreshCw, Globe, Image, Code, TrendingUp } from "lucide-react";
import LoadingSpinner from "@/components/LoadingSpinner";

interface SEOSetting {
  id: string;
  page_key: string;
  page_title: string;
  meta_title: string;
  meta_description: string;
  meta_keywords: string;
  og_title: string;
  og_description: string;
  og_image: string;
  twitter_title: string;
  twitter_description: string;
  twitter_image: string;
  canonical_url: string;
  robots_index: boolean;
  robots_follow: boolean;
  priority: number;
  changefreq: string;
}

const SEOAdmin = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [selectedPage, setSelectedPage] = useState<string>("home");
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    if (!user) {
      navigate("/giris-yap");
    }
  }, [user, navigate]);

  // Fetch SEO settings
  const { data: seoSettings, isLoading } = useQuery({
    queryKey: ["seo-settings"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("seo_settings")
        .select("*")
        .order("page_key");

      if (error) throw error;
      return data as SEOSetting[];
    },
  });

  // Update SEO setting
  const updateMutation = useMutation({
    mutationFn: async (setting: Partial<SEOSetting>) => {
      const { error } = await supabase
        .from("seo_settings")
        .update(setting)
        .eq("page_key", selectedPage);

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["seo-settings"] });
      toast({
        title: "SEO Ayarları Güncellendi",
        description: "Değişiklikler başarıyla kaydedildi.",
      });
    },
    onError: () => {
      toast({
        variant: "destructive",
        title: "Hata",
        description: "SEO ayarları güncellenirken hata oluştu.",
      });
    },
  });

  const currentSetting = seoSettings?.find((s) => s.page_key === selectedPage);
  const filteredSettings = seoSettings?.filter((s) =>
    s.page_title.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    
    const updatedSetting: Partial<SEOSetting> = {
      meta_title: formData.get("meta_title") as string,
      meta_description: formData.get("meta_description") as string,
      meta_keywords: formData.get("meta_keywords") as string,
      og_title: formData.get("og_title") as string,
      og_description: formData.get("og_description") as string,
      og_image: formData.get("og_image") as string,
      twitter_title: formData.get("twitter_title") as string,
      twitter_description: formData.get("twitter_description") as string,
      twitter_image: formData.get("twitter_image") as string,
      canonical_url: formData.get("canonical_url") as string,
      robots_index: formData.get("robots_index") === "on",
      robots_follow: formData.get("robots_follow") === "on",
      priority: parseFloat(formData.get("priority") as string),
      changefreq: formData.get("changefreq") as string,
    };

    updateMutation.mutate(updatedSetting);
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-orange-50 via-white to-orange-50">
        <Navbar />
        <div className="flex items-center justify-center h-96">
          <LoadingSpinner text="SEO ayarları yükleniyor..." />
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 via-white to-orange-50">
      <Navbar />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-12 h-12 bg-gradient-to-r from-orange-500 to-red-500 rounded-xl flex items-center justify-center">
              <Globe className="h-6 w-6 text-white" />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-gray-900">SEO Yönetimi</h1>
              <p className="text-gray-600">Sayfa meta bilgilerini ve arama motoru ayarlarını yönetin</p>
            </div>
          </div>

          {/* Search */}
          <div className="relative max-w-md">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
            <Input
              placeholder="Sayfa ara..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Page List */}
          <Card className="lg:col-span-1">
            <CardHeader>
              <CardTitle className="text-lg">Sayfalar</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              {filteredSettings?.map((setting) => (
                <button
                  key={setting.page_key}
                  onClick={() => setSelectedPage(setting.page_key)}
                  className={`w-full text-left px-4 py-3 rounded-lg transition-colors ${
                    selectedPage === setting.page_key
                      ? "bg-orange-100 text-orange-900 font-semibold"
                      : "hover:bg-gray-100 text-gray-700"
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span>{setting.page_title}</span>
                    {setting.robots_index && (
                      <Badge variant="outline" className="text-xs">
                        <TrendingUp className="h-3 w-3 mr-1" />
                        İndeksli
                      </Badge>
                    )}
                  </div>
                </button>
              ))}
            </CardContent>
          </Card>

          {/* SEO Form */}
          <Card className="lg:col-span-3">
            {currentSetting ? (
              <form onSubmit={handleSubmit}>
                <CardHeader>
                  <CardTitle className="flex items-center justify-between">
                    <span>{currentSetting.page_title} - SEO Ayarları</span>
                    <Button type="submit" disabled={updateMutation.isPending}>
                      {updateMutation.isPending ? (
                        <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
                      ) : (
                        <Save className="h-4 w-4 mr-2" />
                      )}
                      Kaydet
                    </Button>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <Tabs defaultValue="meta" className="w-full">
                    <TabsList className="grid w-full grid-cols-4">
                      <TabsTrigger value="meta">Meta Tags</TabsTrigger>
                      <TabsTrigger value="og">Open Graph</TabsTrigger>
                      <TabsTrigger value="twitter">Twitter</TabsTrigger>
                      <TabsTrigger value="advanced">Gelişmiş</TabsTrigger>
                    </TabsList>

                    {/* Meta Tags */}
                    <TabsContent value="meta" className="space-y-4">
                      <div>
                        <Label htmlFor="meta_title">Meta Başlık</Label>
                        <Input
                          id="meta_title"
                          name="meta_title"
                          defaultValue={currentSetting.meta_title}
                          maxLength={60}
                        />
                        <p className="text-xs text-gray-500 mt-1">Maksimum 60 karakter</p>
                      </div>

                      <div>
                        <Label htmlFor="meta_description">Meta Açıklama</Label>
                        <Textarea
                          id="meta_description"
                          name="meta_description"
                          defaultValue={currentSetting.meta_description}
                          rows={3}
                          maxLength={160}
                        />
                        <p className="text-xs text-gray-500 mt-1">Maksimum 160 karakter</p>
                      </div>

                      <div>
                        <Label htmlFor="meta_keywords">Anahtar Kelimeler</Label>
                        <Textarea
                          id="meta_keywords"
                          name="meta_keywords"
                          defaultValue={currentSetting.meta_keywords}
                          rows={2}
                          placeholder="kelime1, kelime2, kelime3"
                        />
                        <p className="text-xs text-gray-500 mt-1">Virgülle ayırın</p>
                      </div>
                    </TabsContent>

                    {/* Open Graph */}
                    <TabsContent value="og" className="space-y-4">
                      <div>
                        <Label htmlFor="og_title">OG Başlık</Label>
                        <Input
                          id="og_title"
                          name="og_title"
                          defaultValue={currentSetting.og_title}
                        />
                      </div>

                      <div>
                        <Label htmlFor="og_description">OG Açıklama</Label>
                        <Textarea
                          id="og_description"
                          name="og_description"
                          defaultValue={currentSetting.og_description}
                          rows={3}
                        />
                      </div>

                      <div>
                        <Label htmlFor="og_image">OG Görsel URL</Label>
                        <Input
                          id="og_image"
                          name="og_image"
                          defaultValue={currentSetting.og_image}
                          type="url"
                          placeholder="https://..."
                        />
                        {currentSetting.og_image && (
                          <img
                            src={currentSetting.og_image}
                            alt="OG Preview"
                            className="mt-2 w-full max-w-sm rounded-lg border"
                          />
                        )}
                      </div>
                    </TabsContent>

                    {/* Twitter */}
                    <TabsContent value="twitter" className="space-y-4">
                      <div>
                        <Label htmlFor="twitter_title">Twitter Başlık</Label>
                        <Input
                          id="twitter_title"
                          name="twitter_title"
                          defaultValue={currentSetting.twitter_title}
                        />
                      </div>

                      <div>
                        <Label htmlFor="twitter_description">Twitter Açıklama</Label>
                        <Textarea
                          id="twitter_description"
                          name="twitter_description"
                          defaultValue={currentSetting.twitter_description}
                          rows={3}
                        />
                      </div>

                      <div>
                        <Label htmlFor="twitter_image">Twitter Görsel URL</Label>
                        <Input
                          id="twitter_image"
                          name="twitter_image"
                          defaultValue={currentSetting.twitter_image}
                          type="url"
                          placeholder="https://..."
                        />
                        {currentSetting.twitter_image && (
                          <img
                            src={currentSetting.twitter_image}
                            alt="Twitter Preview"
                            className="mt-2 w-full max-w-sm rounded-lg border"
                          />
                        )}
                      </div>
                    </TabsContent>

                    {/* Advanced */}
                    <TabsContent value="advanced" className="space-y-4">
                      <div>
                        <Label htmlFor="canonical_url">Canonical URL</Label>
                        <Input
                          id="canonical_url"
                          name="canonical_url"
                          defaultValue={currentSetting.canonical_url}
                          type="url"
                          placeholder="https://neyesek.ai/..."
                        />
                      </div>

                      <div className="grid grid-cols-2 gap-4">
                        <div className="flex items-center justify-between p-4 border rounded-lg">
                          <Label htmlFor="robots_index" className="cursor-pointer">
                            Index (İndeksleme)
                          </Label>
                          <Switch
                            id="robots_index"
                            name="robots_index"
                            defaultChecked={currentSetting.robots_index}
                          />
                        </div>

                        <div className="flex items-center justify-between p-4 border rounded-lg">
                          <Label htmlFor="robots_follow" className="cursor-pointer">
                            Follow (Takip)
                          </Label>
                          <Switch
                            id="robots_follow"
                            name="robots_follow"
                            defaultChecked={currentSetting.robots_follow}
                          />
                        </div>
                      </div>

                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <Label htmlFor="priority">Öncelik (Sitemap)</Label>
                          <Input
                            id="priority"
                            name="priority"
                            type="number"
                            step="0.1"
                            min="0"
                            max="1"
                            defaultValue={currentSetting.priority}
                          />
                          <p className="text-xs text-gray-500 mt-1">0.0 - 1.0 arası</p>
                        </div>

                        <div>
                          <Label htmlFor="changefreq">Güncelleme Sıklığı</Label>
                          <select
                            id="changefreq"
                            name="changefreq"
                            defaultValue={currentSetting.changefreq}
                            className="w-full px-3 py-2 border rounded-md"
                          >
                            <option value="always">Her Zaman</option>
                            <option value="hourly">Saatlik</option>
                            <option value="daily">Günlük</option>
                            <option value="weekly">Haftalık</option>
                            <option value="monthly">Aylık</option>
                            <option value="yearly">Yıllık</option>
                            <option value="never">Hiç</option>
                          </select>
                        </div>
                      </div>
                    </TabsContent>
                  </Tabs>
                </CardContent>
              </form>
            ) : (
              <CardContent className="text-center py-12">
                <Globe className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <p className="text-gray-600">Bir sayfa seçin</p>
              </CardContent>
            )}
          </Card>
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default SEOAdmin;
