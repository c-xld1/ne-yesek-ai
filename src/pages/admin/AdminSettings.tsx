import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Settings, Globe, Tag, FolderTree, Plus, Edit, Trash2 } from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { useToast } from "@/hooks/use-toast";
import LoadingSpinner from "@/components/LoadingSpinner";

interface Category {
  id: string;
  name: string;
  slug: string;
  description?: string;
  icon?: string;
  created_at: string;
}

const AdminSettings = () => {
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(false);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingCategory, setEditingCategory] = useState<Category | null>(null);
  const { toast } = useToast();

  const [categoryForm, setCategoryForm] = useState({
    name: "",
    slug: "",
    description: "",
    icon: "",
  });

  // General Settings State
  const [generalSettings, setGeneralSettings] = useState({
    siteName: "Ne Yesek AI",
    siteDescription: "Yapay zeka destekli yemek tarifi platformu",
    contactEmail: "info@neyesek.ai",
    phone: "",
    address: "",
    facebook: "",
    twitter: "",
    instagram: "",
    youtube: ""
  });

  // Maintenance Mode State
  const [maintenanceMode, setMaintenanceMode] = useState({
    enabled: false,
    message: "Site bakımda. Lütfen daha sonra tekrar deneyiniz.",
    allowedIPs: ""
  });

  const fetchCategories = async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from("categories")
        .select("*")
        .order("name", { ascending: true });

      if (error) throw error;
      setCategories(data || []);
    } catch (error) {
      console.error("Error fetching categories:", error);
      toast({
        title: "Hata",
        description: "Kategoriler yüklenirken bir hata oluştu.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  const handleCategorySubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      if (editingCategory) {
        const { error } = await supabase
          .from("categories")
          .update(categoryForm)
          .eq("id", editingCategory.id);

        if (error) throw error;

        toast({
          title: "Başarılı",
          description: "Kategori güncellendi.",
        });
      } else {
        const { error } = await supabase
          .from("categories")
          .insert([categoryForm]);

        if (error) throw error;

        toast({
          title: "Başarılı",
          description: "Kategori eklendi.",
        });
      }

      setDialogOpen(false);
      resetCategoryForm();
      fetchCategories();
    } catch (error) {
      console.error("Error saving category:", error);
      toast({
        title: "Hata",
        description: "Kategori kaydedilirken bir hata oluştu.",
        variant: "destructive",
      });
    }
  };

  const handleEditCategory = (category: Category) => {
    setEditingCategory(category);
    setCategoryForm({
      name: category.name,
      slug: category.slug,
      description: category.description || "",
      icon: category.icon || "",
    });
    setDialogOpen(true);
  };

  const handleDeleteCategory = async (id: string) => {
    if (!confirm("Bu kategoriyi silmek istediğinizden emin misiniz?")) return;

    try {
      const { error } = await supabase
        .from("categories")
        .delete()
        .eq("id", id);

      if (error) throw error;

      toast({
        title: "Başarılı",
        description: "Kategori silindi.",
      });

      fetchCategories();
    } catch (error) {
      console.error("Error deleting category:", error);
      toast({
        title: "Hata",
        description: "Kategori silinirken bir hata oluştu.",
        variant: "destructive",
      });
    }
  };

  const resetCategoryForm = () => {
    setEditingCategory(null);
    setCategoryForm({
      name: "",
      slug: "",
      description: "",
      icon: "",
    });
  };

  const generateSlug = (name: string) => {
    return name
      .toLowerCase()
      .replace(/ğ/g, "g")
      .replace(/ü/g, "u")
      .replace(/ş/g, "s")
      .replace(/ı/g, "i")
      .replace(/ö/g, "o")
      .replace(/ç/g, "c")
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/^-+|-+$/g, "");
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-gray-900">Genel Ayarlar</h2>
        <p className="text-gray-600">Site genelindeki ayarları yönetin</p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Settings className="h-5 w-5" />
            Ayarlar
          </CardTitle>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="general">
            <TabsList className="grid w-full grid-cols-4 mb-6">
              <TabsTrigger value="general">Genel</TabsTrigger>
              <TabsTrigger value="categories">Kategoriler</TabsTrigger>
              <TabsTrigger value="tags">Etiketler</TabsTrigger>
              <TabsTrigger value="advanced">Gelişmiş</TabsTrigger>
            </TabsList>

            <TabsContent value="general" className="space-y-6">
              <div className="space-y-6">
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Globe className="h-5 w-5" />
                      Site Bilgileri
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="siteName">Site Adı *</Label>
                        <Input
                          id="siteName"
                          value={generalSettings.siteName}
                          onChange={(e) => setGeneralSettings({ ...generalSettings, siteName: e.target.value })}
                          placeholder="Ne Yesek AI"
                        />
                      </div>
                      <div>
                        <Label htmlFor="contactEmail">İletişim E-postası *</Label>
                        <Input
                          id="contactEmail"
                          type="email"
                          value={generalSettings.contactEmail}
                          onChange={(e) => setGeneralSettings({ ...generalSettings, contactEmail: e.target.value })}
                          placeholder="info@neyesek.ai"
                        />
                      </div>
                    </div>
                    <div>
                      <Label htmlFor="siteDescription">Site Açıklaması</Label>
                      <Textarea
                        id="siteDescription"
                        value={generalSettings.siteDescription}
                        onChange={(e) => setGeneralSettings({ ...generalSettings, siteDescription: e.target.value })}
                        placeholder="Sitenizin kısa açıklaması..."
                        rows={3}
                      />
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="phone">Telefon</Label>
                        <Input
                          id="phone"
                          value={generalSettings.phone}
                          onChange={(e) => setGeneralSettings({ ...generalSettings, phone: e.target.value })}
                          placeholder="+90 555 123 45 67"
                        />
                      </div>
                      <div>
                        <Label htmlFor="address">Adres</Label>
                        <Input
                          id="address"
                          value={generalSettings.address}
                          onChange={(e) => setGeneralSettings({ ...generalSettings, address: e.target.value })}
                          placeholder="Şehir, Ülke"
                        />
                      </div>
                    </div>
                    <Button onClick={() => {
                      toast({
                        title: "Başarılı",
                        description: "Site bilgileri güncellendi.",
                      });
                    }}>
                      Kaydet
                    </Button>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle>Sosyal Medya Linkleri</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="facebook">Facebook</Label>
                        <Input
                          id="facebook"
                          value={generalSettings.facebook}
                          onChange={(e) => setGeneralSettings({ ...generalSettings, facebook: e.target.value })}
                          placeholder="https://facebook.com/neyesekai"
                        />
                      </div>
                      <div>
                        <Label htmlFor="twitter">Twitter / X</Label>
                        <Input
                          id="twitter"
                          value={generalSettings.twitter}
                          onChange={(e) => setGeneralSettings({ ...generalSettings, twitter: e.target.value })}
                          placeholder="https://twitter.com/neyesekai"
                        />
                      </div>
                      <div>
                        <Label htmlFor="instagram">Instagram</Label>
                        <Input
                          id="instagram"
                          value={generalSettings.instagram}
                          onChange={(e) => setGeneralSettings({ ...generalSettings, instagram: e.target.value })}
                          placeholder="https://instagram.com/neyesekai"
                        />
                      </div>
                      <div>
                        <Label htmlFor="youtube">YouTube</Label>
                        <Input
                          id="youtube"
                          value={generalSettings.youtube}
                          onChange={(e) => setGeneralSettings({ ...generalSettings, youtube: e.target.value })}
                          placeholder="https://youtube.com/@neyesekai"
                        />
                      </div>
                    </div>
                    <Button onClick={() => {
                      toast({
                        title: "Başarılı",
                        description: "Sosyal medya linkleri güncellendi.",
                      });
                    }}>
                      Kaydet
                    </Button>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle>Bakım Modu</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                      <div>
                        <p className="font-medium text-gray-900">Bakım Modunu Etkinleştir</p>
                        <p className="text-sm text-gray-600">Site ziyaretçilere bakım mesajı gösterecek</p>
                      </div>
                      <Button
                        variant={maintenanceMode.enabled ? "destructive" : "default"}
                        onClick={() => {
                          setMaintenanceMode({ ...maintenanceMode, enabled: !maintenanceMode.enabled });
                          toast({
                            title: maintenanceMode.enabled ? "Bakım modu kapatıldı" : "Bakım modu açıldı",
                            description: maintenanceMode.enabled 
                              ? "Site normal şekilde erişilebilir." 
                              : "Site ziyaretçilere kapalı.",
                          });
                        }}
                      >
                        {maintenanceMode.enabled ? "Devre Dışı Bırak" : "Etkinleştir"}
                      </Button>
                    </div>
                    <div>
                      <Label htmlFor="maintenanceMessage">Bakım Mesajı</Label>
                      <Textarea
                        id="maintenanceMessage"
                        value={maintenanceMode.message}
                        onChange={(e) => setMaintenanceMode({ ...maintenanceMode, message: e.target.value })}
                        placeholder="Ziyaretçilere gösterilecek mesaj..."
                        rows={3}
                      />
                    </div>
                    <div>
                      <Label htmlFor="allowedIPs">İzin Verilen IP Adresleri (virgülle ayırın)</Label>
                      <Input
                        id="allowedIPs"
                        value={maintenanceMode.allowedIPs}
                        onChange={(e) => setMaintenanceMode({ ...maintenanceMode, allowedIPs: e.target.value })}
                        placeholder="192.168.1.1, 10.0.0.1"
                      />
                      <p className="text-xs text-gray-500 mt-1">Bu IP adreslerinden erişim her zaman açık olacak</p>
                    </div>
                    <Button onClick={() => {
                      toast({
                        title: "Başarılı",
                        description: "Bakım modu ayarları güncellendi.",
                      });
                    }}>
                      Kaydet
                    </Button>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>

            <TabsContent value="categories" className="space-y-6">
              <div className="flex justify-between items-center mb-4">
                <div>
                  <h3 className="text-lg font-semibold text-gray-900">Kategori Yönetimi</h3>
                  <p className="text-sm text-gray-600">Tarif kategorilerini yönetin</p>
                </div>
                <Dialog open={dialogOpen} onOpenChange={(open) => {
                  setDialogOpen(open);
                  if (!open) resetCategoryForm();
                }}>
                  <DialogTrigger asChild>
                    <Button>
                      <Plus className="h-4 w-4 mr-2" />
                      Yeni Kategori
                    </Button>
                  </DialogTrigger>
                  <DialogContent>
                    <DialogHeader>
                      <DialogTitle>
                        {editingCategory ? "Kategoriyi Düzenle" : "Yeni Kategori Ekle"}
                      </DialogTitle>
                      <DialogDescription>
                        Kategori bilgilerini girin
                      </DialogDescription>
                    </DialogHeader>
                    <form onSubmit={handleCategorySubmit} className="space-y-4">
                      <div>
                        <Label htmlFor="cat_name">Kategori Adı *</Label>
                        <Input
                          id="cat_name"
                          value={categoryForm.name}
                          onChange={(e) => {
                            const name = e.target.value;
                            setCategoryForm({
                              ...categoryForm,
                              name,
                              slug: editingCategory ? categoryForm.slug : generateSlug(name),
                            });
                          }}
                          placeholder="Türk Mutfağı"
                          required
                        />
                      </div>
                      <div>
                        <Label htmlFor="cat_slug">Slug *</Label>
                        <Input
                          id="cat_slug"
                          value={categoryForm.slug}
                          onChange={(e) => setCategoryForm({ ...categoryForm, slug: e.target.value })}
                          placeholder="turk-mutfagi"
                          required
                        />
                      </div>
                      <div>
                        <Label htmlFor="cat_description">Açıklama</Label>
                        <Textarea
                          id="cat_description"
                          value={categoryForm.description}
                          onChange={(e) => setCategoryForm({ ...categoryForm, description: e.target.value })}
                          placeholder="Kategori açıklaması..."
                          rows={3}
                        />
                      </div>
                      <div>
                        <Label htmlFor="cat_icon">İkon (Emoji veya URL)</Label>
                        <Input
                          id="cat_icon"
                          value={categoryForm.icon}
                          onChange={(e) => setCategoryForm({ ...categoryForm, icon: e.target.value })}
                          placeholder="🍲 veya icon URL"
                        />
                      </div>
                      <DialogFooter>
                        <Button type="button" variant="outline" onClick={() => setDialogOpen(false)}>
                          İptal
                        </Button>
                        <Button type="submit">
                          {editingCategory ? "Güncelle" : "Ekle"}
                        </Button>
                      </DialogFooter>
                    </form>
                  </DialogContent>
                </Dialog>
              </div>

              {loading ? (
                <LoadingSpinner />
              ) : (
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Kategori</TableHead>
                      <TableHead>Slug</TableHead>
                      <TableHead>Açıklama</TableHead>
                      <TableHead className="text-right">İşlemler</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {categories.length === 0 ? (
                      <TableRow>
                        <TableCell colSpan={4} className="text-center text-gray-500 py-8">
                          Henüz kategori eklenmemiş
                        </TableCell>
                      </TableRow>
                    ) : (
                      categories.map((category) => (
                        <TableRow key={category.id}>
                          <TableCell>
                            <div className="flex items-center gap-2">
                              {category.icon && <span className="text-2xl">{category.icon}</span>}
                              <span className="font-medium">{category.name}</span>
                            </div>
                          </TableCell>
                          <TableCell>
                            <code className="text-sm bg-gray-100 px-2 py-1 rounded">
                              {category.slug}
                            </code>
                          </TableCell>
                          <TableCell>
                            <p className="text-sm text-gray-600 max-w-md truncate">
                              {category.description || "-"}
                            </p>
                          </TableCell>
                          <TableCell className="text-right">
                            <div className="flex items-center justify-end gap-2">
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={() => handleEditCategory(category)}
                              >
                                <Edit className="h-4 w-4" />
                              </Button>
                              <Button
                                variant="destructive"
                                size="sm"
                                onClick={() => handleDeleteCategory(category.id)}
                              >
                                <Trash2 className="h-4 w-4" />
                              </Button>
                            </div>
                          </TableCell>
                        </TableRow>
                      ))
                    )}
                  </TableBody>
                </Table>
              )}
            </TabsContent>

            <TabsContent value="tags" className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Tag className="h-5 w-5" />
                    Etiket İstatistikleri
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="bg-blue-50 p-4 rounded-lg">
                      <p className="text-sm text-gray-600">Toplam Etiket</p>
                      <p className="text-2xl font-bold text-blue-600">0</p>
                    </div>
                    <div className="bg-green-50 p-4 rounded-lg">
                      <p className="text-sm text-gray-600">Aktif Kullanılan</p>
                      <p className="text-2xl font-bold text-green-600">0</p>
                    </div>
                    <div className="bg-purple-50 p-4 rounded-lg">
                      <p className="text-sm text-gray-600">En Popüler</p>
                      <p className="text-2xl font-bold text-purple-600">-</p>
                    </div>
                  </div>
                  <div className="mt-6 p-6 bg-gray-50 rounded-lg text-center">
                    <Tag className="h-12 w-12 text-gray-400 mx-auto mb-3" />
                    <p className="text-gray-600 mb-2">Etiket sistemi geliştirme aşamasında</p>
                    <p className="text-sm text-gray-500">
                      Yakında: Popüler etiketler, etiket birleştirme, otomatik öneri
                    </p>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="advanced" className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Settings className="h-5 w-5" />
                    E-posta Ayarları
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="smtpHost">SMTP Sunucusu</Label>
                      <Input
                        id="smtpHost"
                        placeholder="smtp.example.com"
                      />
                    </div>
                    <div>
                      <Label htmlFor="smtpPort">SMTP Port</Label>
                      <Input
                        id="smtpPort"
                        type="number"
                        placeholder="587"
                      />
                    </div>
                    <div>
                      <Label htmlFor="smtpUser">Kullanıcı Adı</Label>
                      <Input
                        id="smtpUser"
                        placeholder="user@example.com"
                      />
                    </div>
                    <div>
                      <Label htmlFor="smtpPassword">Şifre</Label>
                      <Input
                        id="smtpPassword"
                        type="password"
                        placeholder="••••••••"
                      />
                    </div>
                  </div>
                  <Button onClick={() => {
                    toast({
                      title: "Test e-postası gönderildi",
                      description: "E-posta ayarlarınızı kontrol edin.",
                    });
                  }}>
                    Test E-postası Gönder
                  </Button>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Bildirim Ayarları</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-3">
                    <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                      <div>
                        <p className="font-medium">Yeni Sipariş Bildirimi</p>
                        <p className="text-sm text-gray-600">Yeni sipariş geldiğinde e-posta gönder</p>
                      </div>
                      <input type="checkbox" defaultChecked className="h-5 w-5" />
                    </div>
                    <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                      <div>
                        <p className="font-medium">Şef Başvuru Bildirimi</p>
                        <p className="text-sm text-gray-600">Yeni şef başvurusu geldiğinde bildir</p>
                      </div>
                      <input type="checkbox" defaultChecked className="h-5 w-5" />
                    </div>
                    <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                      <div>
                        <p className="font-medium">Yeni Kullanıcı Bildirimi</p>
                        <p className="text-sm text-gray-600">Yeni kullanıcı kaydı bildir</p>
                      </div>
                      <input type="checkbox" className="h-5 w-5" />
                    </div>
                    <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                      <div>
                        <p className="font-medium">Haftalık Özet Raporu</p>
                        <p className="text-sm text-gray-600">Haftalık istatistik raporu gönder</p>
                      </div>
                      <input type="checkbox" defaultChecked className="h-5 w-5" />
                    </div>
                  </div>
                  <Button onClick={() => {
                    toast({
                      title: "Başarılı",
                      description: "Bildirim ayarları güncellendi.",
                    });
                  }}>
                    Kaydet
                  </Button>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>API ve Entegrasyonlar</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <Label htmlFor="googleAnalytics">Google Analytics ID</Label>
                    <Input
                      id="googleAnalytics"
                      placeholder="G-XXXXXXXXXX"
                    />
                  </div>
                  <div>
                    <Label htmlFor="mapboxToken">Mapbox Access Token</Label>
                    <Input
                      id="mapboxToken"
                      placeholder="pk.eyJ1..."
                      type="password"
                    />
                  </div>
                  <div>
                    <Label htmlFor="stripeKey">Stripe Public Key</Label>
                    <Input
                      id="stripeKey"
                      placeholder="pk_live_..."
                      type="password"
                    />
                  </div>
                  <Button onClick={() => {
                    toast({
                      title: "Başarılı",
                      description: "API ayarları güncellendi.",
                    });
                  }}>
                    Kaydet
                  </Button>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Önbellek Yönetimi</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="p-4 bg-gray-50 rounded-lg text-center">
                      <p className="text-sm text-gray-600 mb-2">Sayfa Önbelleği</p>
                      <p className="text-xl font-bold text-gray-900 mb-3">~50 MB</p>
                      <Button variant="outline" size="sm" className="w-full">
                        Temizle
                      </Button>
                    </div>
                    <div className="p-4 bg-gray-50 rounded-lg text-center">
                      <p className="text-sm text-gray-600 mb-2">Resim Önbelleği</p>
                      <p className="text-xl font-bold text-gray-900 mb-3">~120 MB</p>
                      <Button variant="outline" size="sm" className="w-full">
                        Temizle
                      </Button>
                    </div>
                    <div className="p-4 bg-gray-50 rounded-lg text-center">
                      <p className="text-sm text-gray-600 mb-2">API Önbelleği</p>
                      <p className="text-xl font-bold text-gray-900 mb-3">~30 MB</p>
                      <Button variant="outline" size="sm" className="w-full">
                        Temizle
                      </Button>
                    </div>
                  </div>
                  <Button variant="destructive" onClick={() => {
                    toast({
                      title: "Önbellek temizlendi",
                      description: "Tüm önbellekler başarıyla temizlendi.",
                    });
                  }}>
                    Tüm Önbellekleri Temizle
                  </Button>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
};

export default AdminSettings;
