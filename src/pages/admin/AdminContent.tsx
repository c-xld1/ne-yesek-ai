import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Layout,
  Image as ImageIcon,
  HelpCircle,
  FileText,
  Plus,
  Edit,
  Trash2,
  Eye,
  EyeOff,
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface Banner {
  id: string;
  title: string;
  image_url: string;
  link_url?: string;
  position: "hero" | "sidebar" | "footer";
  is_active: boolean;
  order: number;
}

interface FAQ {
  id: string;
  question: string;
  answer: string;
  category: string;
  order: number;
  is_published: boolean;
}

interface PageContent {
  id: string;
  page: "about" | "terms" | "privacy" | "help";
  content: string;
  updated_at: string;
}

const AdminContent = () => {
  const [banners, setBanners] = useState<Banner[]>([]);
  const [faqs, setFaqs] = useState<FAQ[]>([]);
  const [loading, setLoading] = useState(false);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<any>(null);
  const [activeTab, setActiveTab] = useState("banners");
  const { toast } = useToast();

  const [bannerForm, setBannerForm] = useState({
    title: "",
    image_url: "",
    link_url: "",
    position: "hero" as const,
    is_active: true,
    order: 0,
  });

  const [faqForm, setFaqForm] = useState({
    question: "",
    answer: "",
    category: "genel",
    order: 0,
    is_published: true,
  });

  const [pageContent, setPageContent] = useState<PageContent[]>([]);
  const [selectedPage, setSelectedPage] = useState<"about" | "terms" | "privacy" | "help">("about");
  const [contentEditor, setContentEditor] = useState("");

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    // Mock data - replace with real Supabase queries
    setBanners([
      {
        id: "1",
        title: "Yaz Kampanyası",
        image_url: "https://placehold.co/1200x400",
        link_url: "/kampanyalar",
        position: "hero",
        is_active: true,
        order: 1,
      },
      {
        id: "2",
        title: "Premium Üyelik",
        image_url: "https://placehold.co/300x250",
        link_url: "/premium",
        position: "sidebar",
        is_active: true,
        order: 1,
      },
    ]);

    setFaqs([
      {
        id: "1",
        question: "Siparişimi nasıl takip edebilirim?",
        answer: "Profil sayfanızdan 'Siparişlerim' bölümüne giderek siparişinizi takip edebilirsiniz.",
        category: "siparis",
        order: 1,
        is_published: true,
      },
      {
        id: "2",
        question: "Premium üyeliğin avantajları nelerdir?",
        answer: "Premium üyelikle reklamsız deneyim, özel tarifler ve öncelikli destek alırsınız.",
        category: "uyelik",
        order: 1,
        is_published: true,
      },
    ]);

    setPageContent([
      {
        id: "1",
        page: "about",
        content: "# Hakkımızda\n\nNe Yesek AI, yapay zeka destekli tarif önerisi platformudur...",
        updated_at: new Date().toISOString(),
      },
      {
        id: "2",
        page: "terms",
        content: "# Kullanım Koşulları\n\nBu platform kullanım koşulları...",
        updated_at: new Date().toISOString(),
      },
    ]);
  };

  const handleSaveBanner = async (e: React.FormEvent) => {
    e.preventDefault();
    toast({
      title: "Başarılı",
      description: editingItem ? "Banner güncellendi" : "Banner oluşturuldu",
    });
    setDialogOpen(false);
    setEditingItem(null);
    resetBannerForm();
    fetchData();
  };

  const handleSaveFAQ = async (e: React.FormEvent) => {
    e.preventDefault();
    toast({
      title: "Başarılı",
      description: editingItem ? "FAQ güncellendi" : "FAQ oluşturuldu",
    });
    setDialogOpen(false);
    setEditingItem(null);
    resetFaqForm();
    fetchData();
  };

  const handleSavePageContent = async () => {
    toast({
      title: "Başarılı",
      description: "Sayfa içeriği kaydedildi",
    });
  };

  const resetBannerForm = () => {
    setBannerForm({
      title: "",
      image_url: "",
      link_url: "",
      position: "hero",
      is_active: true,
      order: 0,
    });
  };

  const resetFaqForm = () => {
    setFaqForm({
      question: "",
      answer: "",
      category: "genel",
      order: 0,
      is_published: true,
    });
  };

  const handleDeleteBanner = async (id: string) => {
    if (!confirm("Bu banner'ı silmek istediğinizden emin misiniz?")) return;
    toast({ title: "Başarılı", description: "Banner silindi" });
    fetchData();
  };

  const handleDeleteFAQ = async (id: string) => {
    if (!confirm("Bu FAQ'ı silmek istediğinizden emin misiniz?")) return;
    toast({ title: "Başarılı", description: "FAQ silindi" });
    fetchData();
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">İçerik Yönetimi</h2>
          <p className="text-gray-600">Banner, FAQ ve sayfa içeriklerini yönetin</p>
        </div>
      </div>

      {/* Statistics */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Aktif Banner</p>
                <p className="text-2xl font-bold text-blue-600">
                  {banners.filter((b) => b.is_active).length}
                </p>
              </div>
              <Layout className="h-8 w-8 text-blue-500" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Toplam FAQ</p>
                <p className="text-2xl font-bold text-green-600">{faqs.length}</p>
              </div>
              <HelpCircle className="h-8 w-8 text-green-500" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Yayınlı FAQ</p>
                <p className="text-2xl font-bold text-purple-600">
                  {faqs.filter((f) => f.is_published).length}
                </p>
              </div>
              <Eye className="h-8 w-8 text-purple-500" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Sayfa İçerikleri</p>
                <p className="text-2xl font-bold text-orange-600">{pageContent.length}</p>
              </div>
              <FileText className="h-8 w-8 text-orange-500" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Content Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList>
          <TabsTrigger value="banners">Banner Yönetimi</TabsTrigger>
          <TabsTrigger value="faq">FAQ</TabsTrigger>
          <TabsTrigger value="pages">Sayfa İçerikleri</TabsTrigger>
        </TabsList>

        <TabsContent value="banners">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="flex items-center gap-2">
                  <ImageIcon className="h-5 w-5" />
                  Banner Yönetimi
                </CardTitle>
                <Dialog open={dialogOpen && activeTab === "banners"} onOpenChange={setDialogOpen}>
                  <DialogTrigger asChild>
                    <Button onClick={() => setEditingItem(null)}>
                      <Plus className="h-4 w-4 mr-2" />
                      Yeni Banner
                    </Button>
                  </DialogTrigger>
                  <DialogContent>
                    <DialogHeader>
                      <DialogTitle>
                        {editingItem ? "Banner Düzenle" : "Yeni Banner"}
                      </DialogTitle>
                    </DialogHeader>
                    <form onSubmit={handleSaveBanner} className="space-y-4">
                      <div>
                        <Label htmlFor="banner_title">Başlık *</Label>
                        <Input
                          id="banner_title"
                          value={bannerForm.title}
                          onChange={(e) =>
                            setBannerForm({ ...bannerForm, title: e.target.value })
                          }
                          required
                        />
                      </div>
                      <div>
                        <Label htmlFor="image_url">Görsel URL *</Label>
                        <Input
                          id="image_url"
                          value={bannerForm.image_url}
                          onChange={(e) =>
                            setBannerForm({ ...bannerForm, image_url: e.target.value })
                          }
                          placeholder="https://..."
                          required
                        />
                      </div>
                      <div>
                        <Label htmlFor="link_url">Link URL (Opsiyonel)</Label>
                        <Input
                          id="link_url"
                          value={bannerForm.link_url}
                          onChange={(e) =>
                            setBannerForm({ ...bannerForm, link_url: e.target.value })
                          }
                          placeholder="/sayfa"
                        />
                      </div>
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <Label htmlFor="position">Konum</Label>
                          <Select
                            value={bannerForm.position}
                            onValueChange={(value: any) =>
                              setBannerForm({ ...bannerForm, position: value })
                            }
                          >
                            <SelectTrigger>
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="hero">Ana Sayfa Üst</SelectItem>
                              <SelectItem value="sidebar">Kenar Çubuğu</SelectItem>
                              <SelectItem value="footer">Alt Kısım</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                        <div>
                          <Label htmlFor="order">Sıra</Label>
                          <Input
                            id="order"
                            type="number"
                            value={bannerForm.order}
                            onChange={(e) =>
                              setBannerForm({
                                ...bannerForm,
                                order: Number(e.target.value),
                              })
                            }
                          />
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <input
                          type="checkbox"
                          id="is_active_banner"
                          checked={bannerForm.is_active}
                          onChange={(e) =>
                            setBannerForm({ ...bannerForm, is_active: e.target.checked })
                          }
                          className="h-4 w-4"
                        />
                        <Label htmlFor="is_active_banner">Aktif</Label>
                      </div>
                      <DialogFooter>
                        <Button type="button" variant="outline" onClick={() => setDialogOpen(false)}>
                          İptal
                        </Button>
                        <Button type="submit">Kaydet</Button>
                      </DialogFooter>
                    </form>
                  </DialogContent>
                </Dialog>
              </div>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Önizleme</TableHead>
                    <TableHead>Başlık</TableHead>
                    <TableHead>Konum</TableHead>
                    <TableHead>Sıra</TableHead>
                    <TableHead>Durum</TableHead>
                    <TableHead className="text-right">İşlemler</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {banners.map((banner) => (
                    <TableRow key={banner.id}>
                      <TableCell>
                        <img
                          src={banner.image_url}
                          alt={banner.title}
                          className="w-20 h-12 object-cover rounded"
                        />
                      </TableCell>
                      <TableCell className="font-medium">{banner.title}</TableCell>
                      <TableCell>
                        <Badge variant="outline">
                          {banner.position === "hero"
                            ? "Ana Üst"
                            : banner.position === "sidebar"
                            ? "Kenar"
                            : "Alt"}
                        </Badge>
                      </TableCell>
                      <TableCell>{banner.order}</TableCell>
                      <TableCell>
                        <Badge
                          className={
                            banner.is_active
                              ? "bg-green-100 text-green-700"
                              : "bg-gray-100 text-gray-700"
                          }
                        >
                          {banner.is_active ? "Aktif" : "Pasif"}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-right">
                        <div className="flex items-center justify-end gap-2">
                          <Button variant="outline" size="sm">
                            <Edit className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="destructive"
                            size="sm"
                            onClick={() => handleDeleteBanner(banner.id)}
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="faq">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="flex items-center gap-2">
                  <HelpCircle className="h-5 w-5" />
                  Sıkça Sorulan Sorular
                </CardTitle>
                <Dialog open={dialogOpen && activeTab === "faq"} onOpenChange={setDialogOpen}>
                  <DialogTrigger asChild>
                    <Button onClick={() => setEditingItem(null)}>
                      <Plus className="h-4 w-4 mr-2" />
                      Yeni FAQ
                    </Button>
                  </DialogTrigger>
                  <DialogContent>
                    <DialogHeader>
                      <DialogTitle>{editingItem ? "FAQ Düzenle" : "Yeni FAQ"}</DialogTitle>
                    </DialogHeader>
                    <form onSubmit={handleSaveFAQ} className="space-y-4">
                      <div>
                        <Label htmlFor="question">Soru *</Label>
                        <Input
                          id="question"
                          value={faqForm.question}
                          onChange={(e) =>
                            setFaqForm({ ...faqForm, question: e.target.value })
                          }
                          required
                        />
                      </div>
                      <div>
                        <Label htmlFor="answer">Cevap *</Label>
                        <Textarea
                          id="answer"
                          value={faqForm.answer}
                          onChange={(e) =>
                            setFaqForm({ ...faqForm, answer: e.target.value })
                          }
                          rows={4}
                          required
                        />
                      </div>
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <Label htmlFor="category">Kategori</Label>
                          <Select
                            value={faqForm.category}
                            onValueChange={(value) =>
                              setFaqForm({ ...faqForm, category: value })
                            }
                          >
                            <SelectTrigger>
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="genel">Genel</SelectItem>
                              <SelectItem value="siparis">Sipariş</SelectItem>
                              <SelectItem value="uyelik">Üyelik</SelectItem>
                              <SelectItem value="odeme">Ödeme</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                        <div>
                          <Label htmlFor="faq_order">Sıra</Label>
                          <Input
                            id="faq_order"
                            type="number"
                            value={faqForm.order}
                            onChange={(e) =>
                              setFaqForm({ ...faqForm, order: Number(e.target.value) })
                            }
                          />
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <input
                          type="checkbox"
                          id="is_published"
                          checked={faqForm.is_published}
                          onChange={(e) =>
                            setFaqForm({ ...faqForm, is_published: e.target.checked })
                          }
                          className="h-4 w-4"
                        />
                        <Label htmlFor="is_published">Yayınla</Label>
                      </div>
                      <DialogFooter>
                        <Button type="button" variant="outline" onClick={() => setDialogOpen(false)}>
                          İptal
                        </Button>
                        <Button type="submit">Kaydet</Button>
                      </DialogFooter>
                    </form>
                  </DialogContent>
                </Dialog>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {faqs.map((faq) => (
                  <div key={faq.id} className="p-4 border rounded-lg">
                    <div className="flex items-start justify-between gap-4">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-2">
                          <h3 className="font-semibold">{faq.question}</h3>
                          <Badge variant="outline">{faq.category}</Badge>
                          {faq.is_published ? (
                            <Badge className="bg-green-100 text-green-700">Yayında</Badge>
                          ) : (
                            <Badge className="bg-gray-100 text-gray-700">Taslak</Badge>
                          )}
                        </div>
                        <p className="text-sm text-gray-600">{faq.answer}</p>
                      </div>
                      <div className="flex items-center gap-2">
                        <Button variant="outline" size="sm">
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="destructive"
                          size="sm"
                          onClick={() => handleDeleteFAQ(faq.id)}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="pages">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <FileText className="h-5 w-5" />
                Sayfa İçerikleri
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div>
                  <Label htmlFor="page_select">Sayfa Seçin</Label>
                  <Select value={selectedPage} onValueChange={(v: any) => setSelectedPage(v)}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="about">Hakkımızda</SelectItem>
                      <SelectItem value="terms">Kullanım Koşulları</SelectItem>
                      <SelectItem value="privacy">Gizlilik Politikası</SelectItem>
                      <SelectItem value="help">Yardım</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label htmlFor="content_editor">İçerik (Markdown)</Label>
                  <Textarea
                    id="content_editor"
                    value={
                      pageContent.find((p) => p.page === selectedPage)?.content || ""
                    }
                    onChange={(e) => setContentEditor(e.target.value)}
                    rows={15}
                    className="font-mono text-sm"
                    placeholder="Markdown formatında içerik yazın..."
                  />
                </div>
                <Button onClick={handleSavePageContent}>
                  <FileText className="h-4 w-4 mr-2" />
                  İçeriği Kaydet
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default AdminContent;
