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
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-6 text-center">
                <Globe className="h-16 w-16 text-blue-500 mx-auto mb-4" />
                <h3 className="text-lg font-semibold text-gray-900 mb-2">
                  Site Genel Ayarları
                </h3>
                <p className="text-gray-600 mb-4">
                  Site adı, açıklaması, logo ve genel yapılandırma ayarları buradan yönetilecek.
                </p>
                <p className="text-sm text-gray-500">
                  Yakında eklenecek: Site başlığı, meta açıklama, iletişim bilgileri, sosyal medya linkleri
                </p>
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
              <div className="bg-green-50 border border-green-200 rounded-lg p-6 text-center">
                <Tag className="h-16 w-16 text-green-500 mx-auto mb-4" />
                <h3 className="text-lg font-semibold text-gray-900 mb-2">
                  Etiket Yönetimi
                </h3>
                <p className="text-gray-600 mb-4">
                  İçerikleriniz için etiketleri buradan yönetebilirsiniz.
                </p>
                <p className="text-sm text-gray-500">
                  Yakında eklenecek: Popüler etiketler, etiket birleştirme, toplu işlemler
                </p>
              </div>
            </TabsContent>

            <TabsContent value="advanced" className="space-y-6">
              <div className="bg-orange-50 border border-orange-200 rounded-lg p-6 text-center">
                <Settings className="h-16 w-16 text-orange-500 mx-auto mb-4" />
                <h3 className="text-lg font-semibold text-gray-900 mb-2">
                  Gelişmiş Ayarlar
                </h3>
                <p className="text-gray-600 mb-4">
                  API anahtarları, entegrasyonlar ve gelişmiş yapılandırma seçenekleri.
                </p>
                <p className="text-sm text-gray-500">
                  Yakında eklenecek: API yönetimi, webhook ayarları, önbellek yönetimi
                </p>
              </div>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
};

export default AdminSettings;
