import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Globe, Plus, Edit, Trash2, Search } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import LoadingSpinner from "@/components/LoadingSpinner";

interface SEOSettings {
  id: string;
  page_key: string;
  page_title: string;
  meta_title?: string;
  meta_description?: string;
  meta_keywords?: string;
  og_title?: string;
  og_description?: string;
  og_image?: string;
  robots_index: boolean;
  robots_follow: boolean;
  created_at: string;
}

const SEOAdmin = () => {
  const [settings, setSettings] = useState<SEOSettings[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<SEOSettings | null>(null);
  const { toast } = useToast();

  const [formData, setFormData] = useState({
    page_key: "",
    page_title: "",
    meta_title: "",
    meta_description: "",
    meta_keywords: "",
    og_title: "",
    og_description: "",
    og_image: "",
    robots_index: true,
    robots_follow: true,
  });

  useEffect(() => {
    fetchSettings();
  }, []);

  const fetchSettings = async () => {
    try {
      const { data, error } = await supabase
        .from("seo_settings")
        .select("*")
        .order("created_at", { ascending: false });

      if (error) throw error;
      setSettings(data || []);
    } catch (error) {
      console.error("Error fetching SEO settings:", error);
      toast({
        title: "Hata",
        description: "SEO ayarları yüklenirken bir hata oluştu.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      if (editingItem) {
        // Update existing
        const { error } = await supabase
          .from("seo_settings")
          .update(formData)
          .eq("id", editingItem.id);

        if (error) throw error;

        toast({
          title: "Başarılı",
          description: "SEO ayarları güncellendi.",
        });
      } else {
        // Create new
        const { error } = await supabase
          .from("seo_settings")
          .insert([formData]);

        if (error) throw error;

        toast({
          title: "Başarılı",
          description: "SEO ayarları eklendi.",
        });
      }

      setDialogOpen(false);
      resetForm();
      fetchSettings();
    } catch (error: any) {
      console.error("Error saving SEO settings:", error);
      toast({
        title: "Hata",
        description: error.message || "SEO ayarları kaydedilirken bir hata oluştu.",
        variant: "destructive",
      });
    }
  };

  const handleEdit = (item: SEOSettings) => {
    setEditingItem(item);
    setFormData({
      page_key: item.page_key,
      page_title: item.page_title,
      meta_title: item.meta_title || "",
      meta_description: item.meta_description || "",
      meta_keywords: item.meta_keywords || "",
      og_title: item.og_title || "",
      og_description: item.og_description || "",
      og_image: item.og_image || "",
      robots_index: item.robots_index,
      robots_follow: item.robots_follow,
    });
    setDialogOpen(true);
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Bu SEO ayarını silmek istediğinizden emin misiniz?")) return;

    try {
      const { error } = await supabase
        .from("seo_settings")
        .delete()
        .eq("id", id);

      if (error) throw error;

      toast({
        title: "Başarılı",
        description: "SEO ayarı silindi.",
      });

      fetchSettings();
    } catch (error) {
      console.error("Error deleting SEO setting:", error);
      toast({
        title: "Hata",
        description: "SEO ayarı silinirken bir hata oluştu.",
        variant: "destructive",
      });
    }
  };

  const resetForm = () => {
    setEditingItem(null);
    setFormData({
      page_key: "",
      page_title: "",
      meta_title: "",
      meta_description: "",
      meta_keywords: "",
      og_title: "",
      og_description: "",
      og_image: "",
      robots_index: true,
      robots_follow: true,
    });
  };

  const filteredSettings = settings.filter((item) =>
    item.page_key.toLowerCase().includes(searchQuery.toLowerCase()) ||
    item.page_title.toLowerCase().includes(searchQuery.toLowerCase())
  );

  if (loading) return <LoadingSpinner />;

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-purple-50 p-6">
      <div className="max-w-7xl mx-auto">
        <div className="mb-8 flex items-center justify-between">
          <div>
            <h1 className="text-4xl font-bold text-gray-900 mb-2">SEO Yönetimi</h1>
            <p className="text-gray-600">
              Arama motoru optimizasyonu ayarlarını yönetin
            </p>
          </div>
          <Dialog open={dialogOpen} onOpenChange={(open) => {
            setDialogOpen(open);
            if (!open) resetForm();
          }}>
            <DialogTrigger asChild>
              <Button className="bg-gradient-to-r from-purple-600 to-blue-600">
                <Plus className="h-4 w-4 mr-2" />
                Yeni SEO Ayarı
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
              <DialogHeader>
                <DialogTitle>
                  {editingItem ? "SEO Ayarını Düzenle" : "Yeni SEO Ayarı"}
                </DialogTitle>
                <DialogDescription>
                  Sayfa için SEO meta etiketlerini yapılandırın
                </DialogDescription>
              </DialogHeader>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="page_key">Sayfa Anahtarı *</Label>
                    <Input
                      id="page_key"
                      value={formData.page_key}
                      onChange={(e) => setFormData({ ...formData, page_key: e.target.value })}
                      placeholder="home, about, recipes, etc."
                      required
                      disabled={!!editingItem}
                    />
                  </div>
                  <div>
                    <Label htmlFor="page_title">Sayfa Başlığı *</Label>
                    <Input
                      id="page_title"
                      value={formData.page_title}
                      onChange={(e) => setFormData({ ...formData, page_title: e.target.value })}
                      placeholder="Ana Sayfa"
                      required
                    />
                  </div>
                </div>

                <div>
                  <Label htmlFor="meta_title">Meta Title</Label>
                  <Input
                    id="meta_title"
                    value={formData.meta_title}
                    onChange={(e) => setFormData({ ...formData, meta_title: e.target.value })}
                    placeholder="50-60 karakter önerilir"
                  />
                </div>

                <div>
                  <Label htmlFor="meta_description">Meta Description</Label>
                  <Textarea
                    id="meta_description"
                    value={formData.meta_description}
                    onChange={(e) => setFormData({ ...formData, meta_description: e.target.value })}
                    placeholder="150-160 karakter önerilir"
                    rows={3}
                  />
                </div>

                <div>
                  <Label htmlFor="meta_keywords">Meta Keywords</Label>
                  <Input
                    id="meta_keywords"
                    value={formData.meta_keywords}
                    onChange={(e) => setFormData({ ...formData, meta_keywords: e.target.value })}
                    placeholder="tarif, yemek, mutfak"
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="og_title">Open Graph Title</Label>
                    <Input
                      id="og_title"
                      value={formData.og_title}
                      onChange={(e) => setFormData({ ...formData, og_title: e.target.value })}
                      placeholder="Sosyal medya için başlık"
                    />
                  </div>
                  <div>
                    <Label htmlFor="og_image">Open Graph Image URL</Label>
                    <Input
                      id="og_image"
                      value={formData.og_image}
                      onChange={(e) => setFormData({ ...formData, og_image: e.target.value })}
                      placeholder="https://..."
                    />
                  </div>
                </div>

                <div>
                  <Label htmlFor="og_description">Open Graph Description</Label>
                  <Textarea
                    id="og_description"
                    value={formData.og_description}
                    onChange={(e) => setFormData({ ...formData, og_description: e.target.value })}
                    placeholder="Sosyal medya için açıklama"
                    rows={2}
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="flex items-center space-x-2">
                    <Switch
                      id="robots_index"
                      checked={formData.robots_index}
                      onCheckedChange={(checked) => setFormData({ ...formData, robots_index: checked })}
                    />
                    <Label htmlFor="robots_index">Robots Index</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Switch
                      id="robots_follow"
                      checked={formData.robots_follow}
                      onCheckedChange={(checked) => setFormData({ ...formData, robots_follow: checked })}
                    />
                    <Label htmlFor="robots_follow">Robots Follow</Label>
                  </div>
                </div>

                <DialogFooter>
                  <Button type="button" variant="outline" onClick={() => setDialogOpen(false)}>
                    İptal
                  </Button>
                  <Button type="submit">
                    {editingItem ? "Güncelle" : "Ekle"}
                  </Button>
                </DialogFooter>
              </form>
            </DialogContent>
          </Dialog>
        </div>

        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle className="flex items-center gap-2">
                <Globe className="h-5 w-5 text-purple-600" />
                SEO Ayarları
              </CardTitle>
              <div className="relative w-72">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                <Input
                  placeholder="Sayfa ara..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Sayfa</TableHead>
                  <TableHead>Meta Title</TableHead>
                  <TableHead>Meta Description</TableHead>
                  <TableHead>Robots</TableHead>
                  <TableHead className="text-right">İşlemler</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredSettings.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={5} className="text-center text-gray-500 py-8">
                      SEO ayarı bulunamadı
                    </TableCell>
                  </TableRow>
                ) : (
                  filteredSettings.map((item) => (
                    <TableRow key={item.id}>
                      <TableCell>
                        <div>
                          <p className="font-medium text-gray-900">{item.page_title}</p>
                          <p className="text-sm text-gray-500">{item.page_key}</p>
                        </div>
                      </TableCell>
                      <TableCell>
                        <p className="text-sm text-gray-700 max-w-xs truncate">
                          {item.meta_title || "-"}
                        </p>
                      </TableCell>
                      <TableCell>
                        <p className="text-sm text-gray-700 max-w-md truncate">
                          {item.meta_description || "-"}
                        </p>
                      </TableCell>
                      <TableCell>
                        <div className="flex gap-2">
                          {item.robots_index && (
                            <span className="text-xs bg-green-100 text-green-700 px-2 py-1 rounded">
                              Index
                            </span>
                          )}
                          {item.robots_follow && (
                            <span className="text-xs bg-blue-100 text-blue-700 px-2 py-1 rounded">
                              Follow
                            </span>
                          )}
                        </div>
                      </TableCell>
                      <TableCell className="text-right">
                        <div className="flex items-center justify-end gap-2">
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleEdit(item)}
                          >
                            <Edit className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="destructive"
                            size="sm"
                            onClick={() => handleDelete(item.id)}
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
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default SEOAdmin;
