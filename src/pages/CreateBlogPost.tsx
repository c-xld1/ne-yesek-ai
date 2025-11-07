import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { useCreateBlogPost } from "@/hooks/useBlogPosts";
import Navbar from "@/components/Navbar";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { useToast } from "@/hooks/use-toast";
import { ArrowLeft, Save, Eye, EyeOff } from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

const CATEGORIES = [
  "Yemek Tarifleri",
  "Sağlıklı Beslenme",
  "Mutfak İpuçları",
  "Dünya Mutfakları",
  "Tatlılar",
  "Diğer"
];

const CreateBlogPost = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { toast } = useToast();
  const createMutation = useCreateBlogPost();

  const [formData, setFormData] = useState({
    title: "",
    excerpt: "",
    content: "",
    category: "",
    image_url: "",
    tags: "",
    featured: false,
    published: true,
  });

  const [showPreview, setShowPreview] = useState(false);

  // Simple markdown to HTML converter for preview
  const renderMarkdown = (text: string) => {
    let html = text
      // Headers
      .replace(/^### (.*$)/gim, '<h3 class="text-lg font-semibold mt-4 mb-2">$1</h3>')
      .replace(/^## (.*$)/gim, '<h2 class="text-xl font-bold mt-6 mb-3">$1</h2>')
      .replace(/^# (.*$)/gim, '<h1 class="text-2xl font-bold mt-8 mb-4">$1</h1>')
      // Bold
      .replace(/\*\*(.*?)\*\*/g, '<strong class="font-semibold">$1</strong>')
      // Italic
      .replace(/\*(.*?)\*/g, '<em class="italic">$1</em>')
      // Lists
      .replace(/^\- (.*$)/gim, '<li class="ml-4">$1</li>')
      // Line breaks
      .replace(/\n\n/g, '<br/><br/>')
      .replace(/\n/g, '<br/>');
    
    // Wrap lists
    html = html.replace(/(<li.*<\/li>)/g, '<ul class="list-disc ml-6 space-y-1">$1</ul>');
    
    return html;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!user) {
      toast({
        title: "Hata",
        description: "Giriş yapmalısınız",
        variant: "destructive",
      });
      return;
    }

    if (!formData.title || !formData.excerpt || !formData.content || !formData.category) {
      toast({
        title: "Hata",
        description: "Lütfen tüm zorunlu alanları doldurun",
        variant: "destructive",
      });
      return;
    }

    try {
      await createMutation.mutateAsync({
        ...formData,
        tags: formData.tags ? formData.tags.split(",").map(t => t.trim()) : [],
      });

      toast({
        title: "✅ Başarılı",
        description: "Blog yazısı oluşturuldu",
      });

      navigate("/blog");
    } catch (error: any) {
      toast({
        title: "Hata",
        description: error.message || "Blog yazısı oluşturulamadı",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="min-h-screen bg-background pb-20">
      <Navbar />
      <div className="container mx-auto px-4 py-6 max-w-4xl">
        <Button
          variant="ghost"
          onClick={() => navigate("/blog")}
          className="mb-4"
        >
          <ArrowLeft className="h-4 w-4 mr-2" />
          Geri Dön
        </Button>

        <Card className="p-6">
          <h1 className="text-3xl font-bold mb-6">Yeni Blog Yazısı</h1>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <Label htmlFor="title">Başlık *</Label>
              <Input
                id="title"
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                placeholder="Blog yazısı başlığı"
                required
              />
            </div>

            <div>
              <Label htmlFor="excerpt">Özet *</Label>
              <Textarea
                id="excerpt"
                value={formData.excerpt}
                onChange={(e) => setFormData({ ...formData, excerpt: e.target.value })}
                placeholder="Kısa özet (1-2 cümle)"
                rows={3}
                required
              />
            </div>

            <div>
              <div className="flex items-center justify-between mb-2">
                <Label htmlFor="content">İçerik *</Label>
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() => setShowPreview(!showPreview)}
                >
                  {showPreview ? (
                    <>
                      <EyeOff className="h-4 w-4 mr-2" />
                      Düzenle
                    </>
                  ) : (
                    <>
                      <Eye className="h-4 w-4 mr-2" />
                      Önizle
                    </>
                  )}
                </Button>
              </div>

              <Tabs value={showPreview ? "preview" : "edit"} className="w-full">
                <TabsList className="grid w-full grid-cols-2">
                  <TabsTrigger value="edit" onClick={() => setShowPreview(false)}>
                    Düzenle
                  </TabsTrigger>
                  <TabsTrigger value="preview" onClick={() => setShowPreview(true)}>
                    Önizleme
                  </TabsTrigger>
                </TabsList>
                
                <TabsContent value="edit" className="mt-2">
                  <Textarea
                    id="content"
                    value={formData.content}
                    onChange={(e) => setFormData({ ...formData, content: e.target.value })}
                    placeholder="Blog yazısı içeriği (Markdown destekler)"
                    rows={15}
                    required
                  />
                  <p className="text-sm text-muted-foreground mt-1">
                    Markdown formatını kullanabilirsiniz (#, ##, ###, **bold**, *italic*, - liste)
                  </p>
                </TabsContent>
                
                <TabsContent value="preview" className="mt-2">
                  <div className="min-h-[400px] p-4 border rounded-md bg-muted/30">
                    {formData.content ? (
                      <div 
                        className="prose prose-sm max-w-none"
                        dangerouslySetInnerHTML={{ __html: renderMarkdown(formData.content) }}
                      />
                    ) : (
                      <p className="text-muted-foreground text-center py-12">
                        İçerik yazın önizleme burada görünecek
                      </p>
                    )}
                  </div>
                </TabsContent>
              </Tabs>
            </div>

            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="category">Kategori *</Label>
                <Select
                  value={formData.category}
                  onValueChange={(value) => setFormData({ ...formData, category: value })}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Kategori seçin" />
                  </SelectTrigger>
                  <SelectContent>
                    {CATEGORIES.map((cat) => (
                      <SelectItem key={cat} value={cat}>
                        {cat}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label htmlFor="image_url">Görsel URL</Label>
                <Input
                  id="image_url"
                  type="url"
                  value={formData.image_url}
                  onChange={(e) => setFormData({ ...formData, image_url: e.target.value })}
                  placeholder="https://example.com/image.jpg"
                />
              </div>
            </div>

            <div>
              <Label htmlFor="tags">Etiketler</Label>
              <Input
                id="tags"
                value={formData.tags}
                onChange={(e) => setFormData({ ...formData, tags: e.target.value })}
                placeholder="tarif, sağlıklı, kolay (virgülle ayırın)"
              />
              <p className="text-sm text-muted-foreground mt-1">
                Etiketleri virgülle ayırın
              </p>
            </div>

            <div className="flex items-center justify-between p-4 border rounded-lg">
              <div className="space-y-0.5">
                <Label htmlFor="featured">Öne Çıkan Yazı</Label>
                <p className="text-sm text-muted-foreground">
                  Ana sayfada öne çıksın mı?
                </p>
              </div>
              <Switch
                id="featured"
                checked={formData.featured}
                onCheckedChange={(checked) => setFormData({ ...formData, featured: checked })}
              />
            </div>

            <div className="flex items-center justify-between p-4 border rounded-lg">
              <div className="space-y-0.5">
                <Label htmlFor="published">Yayınla</Label>
                <p className="text-sm text-muted-foreground">
                  Hemen yayınlansın mı?
                </p>
              </div>
              <Switch
                id="published"
                checked={formData.published}
                onCheckedChange={(checked) => setFormData({ ...formData, published: checked })}
              />
            </div>

            <Button
              type="submit"
              disabled={createMutation.isPending}
              className="w-full"
            >
              <Save className="h-4 w-4 mr-2" />
              {createMutation.isPending ? "Kaydediliyor..." : "Kaydet ve Yayınla"}
            </Button>
          </form>
        </Card>
      </div>
    </div>
  );
};

export default CreateBlogPost;
