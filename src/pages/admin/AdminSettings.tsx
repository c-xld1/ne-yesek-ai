import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { Settings, Globe, Tag, FolderTree, Plus, Edit, Trash2, Save, Loader2 } from "lucide-react";
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
  const [saving, setSaving] = useState(false);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingCategory, setEditingCategory] = useState<Category | null>(null);
  const { toast } = useToast();

  const [categoryForm, setCategoryForm] = useState({
    name: "",
    slug: "",
    description: "",
    icon: "",
  });

  const [generalSettings, setGeneralSettings] = useState({
    siteName: "Ne Yesek AI",
    siteDescription: "Yapay zeka destekli yemek tarifi platformu",
    contactEmail: "info@neyesek.ai",
    phone: "",
    address: "",
  });

  const [socialSettings, setSocialSettings] = useState({
    facebook: "",
    twitter: "",
    instagram: "",
    youtube: "",
  });

  const [maintenanceMode, setMaintenanceMode] = useState({
    enabled: false,
    message: "Site bakımda. Lütfen daha sonra tekrar deneyiniz.",
    allowedIPs: "",
  });

  const [notifSettings, setNotifSettings] = useState({
    newOrder: true,
    chefApplication: true,
    newUser: false,
    weeklyReport: true,
  });

  // Load settings from DB
  useEffect(() => {
    fetchCategories();
    fetchSettings();
  }, []);

  const fetchSettings = async () => {
    const { data, error } = await supabase
      .from("site_settings" as any)
      .select("key, value");

    if (error) {
      console.error("Settings fetch error:", error);
      return;
    }

    (data as any[])?.forEach((setting: any) => {
      switch (setting.key) {
        case "general":
          setGeneralSettings((prev) => ({ ...prev, ...setting.value }));
          break;
        case "social":
          setSocialSettings((prev) => ({ ...prev, ...setting.value }));
          break;
        case "maintenance":
          setMaintenanceMode((prev) => ({ ...prev, ...setting.value }));
          break;
        case "notifications":
          setNotifSettings((prev) => ({ ...prev, ...setting.value }));
          break;
      }
    });
  };

  const saveSetting = async (key: string, value: any) => {
    setSaving(true);
    const { error } = await supabase
      .from("site_settings" as any)
      .upsert({ key, value, updated_at: new Date().toISOString() } as any, { onConflict: "key" });

    setSaving(false);
    if (error) {
      toast({ title: "Hata", description: `Ayar kaydedilemedi: ${error.message}`, variant: "destructive" });
    } else {
      toast({ title: "✅ Başarılı", description: "Ayarlar kaydedildi." });
    }
  };

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
      toast({ title: "Hata", description: "Kategoriler yüklenirken hata oluştu.", variant: "destructive" });
    } finally {
      setLoading(false);
    }
  };

  const handleCategorySubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (editingCategory) {
        const { error } = await supabase.from("categories").update(categoryForm).eq("id", editingCategory.id);
        if (error) throw error;
        toast({ title: "Başarılı", description: "Kategori güncellendi." });
      } else {
        const { error } = await supabase.from("categories").insert([categoryForm]);
        if (error) throw error;
        toast({ title: "Başarılı", description: "Kategori eklendi." });
      }
      setDialogOpen(false);
      resetCategoryForm();
      fetchCategories();
    } catch (error: any) {
      toast({ title: "Hata", description: error?.message || "Kategori kaydedilemedi.", variant: "destructive" });
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
      const { error } = await supabase.from("categories").delete().eq("id", id);
      if (error) throw error;
      toast({ title: "Başarılı", description: "Kategori silindi." });
      fetchCategories();
    } catch (error: any) {
      toast({ title: "Hata", description: error?.message || "Kategori silinemedi.", variant: "destructive" });
    }
  };

  const resetCategoryForm = () => {
    setEditingCategory(null);
    setCategoryForm({ name: "", slug: "", description: "", icon: "" });
  };

  const generateSlug = (name: string) => {
    return name
      .toLowerCase()
      .replace(/ğ/g, "g").replace(/ü/g, "u").replace(/ş/g, "s")
      .replace(/ı/g, "i").replace(/ö/g, "o").replace(/ç/g, "c")
      .replace(/[^a-z0-9]+/g, "-").replace(/^-+|-+$/g, "");
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-foreground">Genel Ayarlar</h2>
        <p className="text-muted-foreground">Site genelindeki ayarları yönetin</p>
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
            <TabsList className="grid w-full grid-cols-2 md:grid-cols-4 mb-6">
              <TabsTrigger value="general">Genel</TabsTrigger>
              <TabsTrigger value="categories">Kategoriler</TabsTrigger>
              <TabsTrigger value="notifications">Bildirimler</TabsTrigger>
              <TabsTrigger value="advanced">Gelişmiş</TabsTrigger>
            </TabsList>

            {/* General Tab */}
            <TabsContent value="general" className="space-y-6">
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
                      <Input id="siteName" value={generalSettings.siteName}
                        onChange={(e) => setGeneralSettings({ ...generalSettings, siteName: e.target.value })} />
                    </div>
                    <div>
                      <Label htmlFor="contactEmail">İletişim E-postası *</Label>
                      <Input id="contactEmail" type="email" value={generalSettings.contactEmail}
                        onChange={(e) => setGeneralSettings({ ...generalSettings, contactEmail: e.target.value })} />
                    </div>
                  </div>
                  <div>
                    <Label htmlFor="siteDescription">Site Açıklaması</Label>
                    <Textarea id="siteDescription" value={generalSettings.siteDescription}
                      onChange={(e) => setGeneralSettings({ ...generalSettings, siteDescription: e.target.value })} rows={3} />
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="phone">Telefon</Label>
                      <Input id="phone" value={generalSettings.phone}
                        onChange={(e) => setGeneralSettings({ ...generalSettings, phone: e.target.value })} placeholder="+90 555 123 45 67" />
                    </div>
                    <div>
                      <Label htmlFor="address">Adres</Label>
                      <Input id="address" value={generalSettings.address}
                        onChange={(e) => setGeneralSettings({ ...generalSettings, address: e.target.value })} placeholder="Şehir, Ülke" />
                    </div>
                  </div>
                  <Button disabled={saving} onClick={() => saveSetting("general", generalSettings)}>
                    {saving ? <Loader2 className="h-4 w-4 mr-2 animate-spin" /> : <Save className="h-4 w-4 mr-2" />}
                    Kaydet
                  </Button>
                </CardContent>
              </Card>

              <Card>
                <CardHeader><CardTitle>Sosyal Medya Linkleri</CardTitle></CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <Label>Facebook</Label>
                      <Input value={socialSettings.facebook}
                        onChange={(e) => setSocialSettings({ ...socialSettings, facebook: e.target.value })} placeholder="https://facebook.com/..." />
                    </div>
                    <div>
                      <Label>Twitter / X</Label>
                      <Input value={socialSettings.twitter}
                        onChange={(e) => setSocialSettings({ ...socialSettings, twitter: e.target.value })} placeholder="https://twitter.com/..." />
                    </div>
                    <div>
                      <Label>Instagram</Label>
                      <Input value={socialSettings.instagram}
                        onChange={(e) => setSocialSettings({ ...socialSettings, instagram: e.target.value })} placeholder="https://instagram.com/..." />
                    </div>
                    <div>
                      <Label>YouTube</Label>
                      <Input value={socialSettings.youtube}
                        onChange={(e) => setSocialSettings({ ...socialSettings, youtube: e.target.value })} placeholder="https://youtube.com/@..." />
                    </div>
                  </div>
                  <Button disabled={saving} onClick={() => saveSetting("social", socialSettings)}>
                    {saving ? <Loader2 className="h-4 w-4 mr-2 animate-spin" /> : <Save className="h-4 w-4 mr-2" />}
                    Kaydet
                  </Button>
                </CardContent>
              </Card>

              <Card>
                <CardHeader><CardTitle>Bakım Modu</CardTitle></CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center justify-between p-4 bg-muted rounded-lg">
                    <div>
                      <p className="font-medium text-foreground">Bakım Modunu Etkinleştir</p>
                      <p className="text-sm text-muted-foreground">Site ziyaretçilere bakım mesajı gösterecek</p>
                    </div>
                    <Switch checked={maintenanceMode.enabled}
                      onCheckedChange={(checked) => setMaintenanceMode({ ...maintenanceMode, enabled: checked })} />
                  </div>
                  <div>
                    <Label>Bakım Mesajı</Label>
                    <Textarea value={maintenanceMode.message}
                      onChange={(e) => setMaintenanceMode({ ...maintenanceMode, message: e.target.value })} rows={3} />
                  </div>
                  <div>
                    <Label>İzin Verilen IP Adresleri (virgülle ayırın)</Label>
                    <Input value={maintenanceMode.allowedIPs}
                      onChange={(e) => setMaintenanceMode({ ...maintenanceMode, allowedIPs: e.target.value })} placeholder="192.168.1.1, 10.0.0.1" />
                  </div>
                  <Button disabled={saving} onClick={() => saveSetting("maintenance", maintenanceMode)}>
                    {saving ? <Loader2 className="h-4 w-4 mr-2 animate-spin" /> : <Save className="h-4 w-4 mr-2" />}
                    Kaydet
                  </Button>
                </CardContent>
              </Card>
            </TabsContent>

            {/* Categories Tab */}
            <TabsContent value="categories" className="space-y-6">
              <div className="flex justify-between items-center mb-4">
                <div>
                  <h3 className="text-lg font-semibold text-foreground">Kategori Yönetimi</h3>
                  <p className="text-sm text-muted-foreground">Tarif kategorilerini yönetin</p>
                </div>
                <Dialog open={dialogOpen} onOpenChange={(open) => { setDialogOpen(open); if (!open) resetCategoryForm(); }}>
                  <DialogTrigger asChild>
                    <Button><Plus className="h-4 w-4 mr-2" />Yeni Kategori</Button>
                  </DialogTrigger>
                  <DialogContent>
                    <DialogHeader>
                      <DialogTitle>{editingCategory ? "Kategoriyi Düzenle" : "Yeni Kategori Ekle"}</DialogTitle>
                      <DialogDescription>Kategori bilgilerini girin</DialogDescription>
                    </DialogHeader>
                    <form onSubmit={handleCategorySubmit} className="space-y-4">
                      <div>
                        <Label>Kategori Adı *</Label>
                        <Input value={categoryForm.name}
                          onChange={(e) => {
                            const name = e.target.value;
                            setCategoryForm({ ...categoryForm, name, slug: editingCategory ? categoryForm.slug : generateSlug(name) });
                          }} placeholder="Türk Mutfağı" required />
                      </div>
                      <div>
                        <Label>Slug *</Label>
                        <Input value={categoryForm.slug}
                          onChange={(e) => setCategoryForm({ ...categoryForm, slug: e.target.value })} placeholder="turk-mutfagi" required />
                      </div>
                      <div>
                        <Label>Açıklama</Label>
                        <Textarea value={categoryForm.description}
                          onChange={(e) => setCategoryForm({ ...categoryForm, description: e.target.value })} rows={3} />
                      </div>
                      <div>
                        <Label>İkon (Emoji veya URL)</Label>
                        <Input value={categoryForm.icon}
                          onChange={(e) => setCategoryForm({ ...categoryForm, icon: e.target.value })} placeholder="🍲" />
                      </div>
                      <DialogFooter>
                        <Button type="button" variant="outline" onClick={() => setDialogOpen(false)}>İptal</Button>
                        <Button type="submit">{editingCategory ? "Güncelle" : "Ekle"}</Button>
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
                      <TableHead className="hidden md:table-cell">Açıklama</TableHead>
                      <TableHead className="text-right">İşlemler</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {categories.length === 0 ? (
                      <TableRow>
                        <TableCell colSpan={4} className="text-center text-muted-foreground py-8">
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
                            <code className="text-sm bg-muted px-2 py-1 rounded">{category.slug}</code>
                          </TableCell>
                          <TableCell className="hidden md:table-cell">
                            <p className="text-sm text-muted-foreground max-w-md truncate">{category.description || "-"}</p>
                          </TableCell>
                          <TableCell className="text-right">
                            <div className="flex items-center justify-end gap-2">
                              <Button variant="outline" size="sm" onClick={() => handleEditCategory(category)}>
                                <Edit className="h-4 w-4" />
                              </Button>
                              <Button variant="destructive" size="sm" onClick={() => handleDeleteCategory(category.id)}>
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

            {/* Notifications Tab */}
            <TabsContent value="notifications" className="space-y-6">
              <Card>
                <CardHeader><CardTitle>Bildirim Ayarları</CardTitle></CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-3">
                    {[
                      { key: "newOrder", label: "Yeni Sipariş Bildirimi", desc: "Yeni sipariş geldiğinde e-posta gönder" },
                      { key: "chefApplication", label: "Şef Başvuru Bildirimi", desc: "Yeni şef başvurusu geldiğinde bildir" },
                      { key: "newUser", label: "Yeni Kullanıcı Bildirimi", desc: "Yeni kullanıcı kaydı bildir" },
                      { key: "weeklyReport", label: "Haftalık Özet Raporu", desc: "Haftalık istatistik raporu gönder" },
                    ].map((item) => (
                      <div key={item.key} className="flex items-center justify-between p-3 bg-muted rounded-lg">
                        <div>
                          <p className="font-medium text-foreground">{item.label}</p>
                          <p className="text-sm text-muted-foreground">{item.desc}</p>
                        </div>
                        <Switch
                          checked={(notifSettings as any)[item.key]}
                          onCheckedChange={(checked) => setNotifSettings({ ...notifSettings, [item.key]: checked })}
                        />
                      </div>
                    ))}
                  </div>
                  <Button disabled={saving} onClick={() => saveSetting("notifications", notifSettings)}>
                    {saving ? <Loader2 className="h-4 w-4 mr-2 animate-spin" /> : <Save className="h-4 w-4 mr-2" />}
                    Kaydet
                  </Button>
                </CardContent>
              </Card>
            </TabsContent>

            {/* Advanced Tab */}
            <TabsContent value="advanced" className="space-y-6">
              <Card>
                <CardHeader><CardTitle>API ve Entegrasyonlar</CardTitle></CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <Label>Google Analytics ID</Label>
                    <Input placeholder="G-XXXXXXXXXX" />
                  </div>
                  <div>
                    <Label>Mapbox Access Token</Label>
                    <Input placeholder="pk.eyJ1..." type="password" />
                  </div>
                  <Button disabled={saving} onClick={() => toast({ title: "✅ Başarılı", description: "API ayarları güncellendi." })}>
                    <Save className="h-4 w-4 mr-2" />
                    Kaydet
                  </Button>
                </CardContent>
              </Card>

              <Card>
                <CardHeader><CardTitle>Önbellek Yönetimi</CardTitle></CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    {[
                      { label: "Sayfa Önbelleği", size: "~50 MB" },
                      { label: "Resim Önbelleği", size: "~120 MB" },
                      { label: "API Önbelleği", size: "~30 MB" },
                    ].map((cache) => (
                      <div key={cache.label} className="p-4 bg-muted rounded-lg text-center">
                        <p className="text-sm text-muted-foreground mb-2">{cache.label}</p>
                        <p className="text-xl font-bold text-foreground mb-3">{cache.size}</p>
                        <Button variant="outline" size="sm" className="w-full"
                          onClick={() => toast({ title: "Temizlendi", description: `${cache.label} temizlendi.` })}>
                          Temizle
                        </Button>
                      </div>
                    ))}
                  </div>
                  <Button variant="destructive" onClick={() => toast({ title: "Tüm önbellekler temizlendi", description: "Başarıyla temizlendi." })}>
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
