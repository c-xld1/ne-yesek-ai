import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";
import { MessageSquare, Search, Eye, Trash2, Edit, Plus, Heart, Calendar, X } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import LoadingSpinner from "@/components/LoadingSpinner";
import { useNavigate } from "react-router-dom";
import { logActivity } from "@/hooks/useActivityLogs";

interface BlogPost {
  id: string;
  title: string;
  slug: string;
  excerpt: string;
  content: string;
  image_url: string;
  author_id: string;
  category: string;
  tags: string[];
  published: boolean;
  view_count: number;
  like_count: number;
  comment_count: number;
  created_at: string;
  profiles?: {
    username?: string;
    full_name?: string;
    fullname?: string;
  };
}

const AdminBlog = () => {
  const [posts, setPosts] = useState<BlogPost[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [selectAll, setSelectAll] = useState(false);
  const [statusFilter, setStatusFilter] = useState<"all" | "published" | "draft">("all");
  const [categoryFilter, setCategoryFilter] = useState("all");
  const [dateFilter, setDateFilter] = useState<"all" | "today" | "week" | "month">("all");
  const [categories, setCategories] = useState<string[]>([]);
  const [previewPost, setPreviewPost] = useState<BlogPost | null>(null);
  const [editingPost, setEditingPost] = useState<BlogPost | null>(null);
  const { toast } = useToast();
  const navigate = useNavigate();

  useEffect(() => {
    fetchPosts();
    fetchCategories();
  }, []);

  const fetchPosts = async () => {
    try {
      const { data, error } = await supabase
        .from("blog_posts")
        .select("*")
        .order("created_at", { ascending: false });

      if (error) throw error;

      // Fetch profiles separately
      const authorIds = [...new Set(data?.map((p) => p.author_id).filter(Boolean))];
      const { data: profiles } = await supabase
        .from("profiles")
        .select("id, username, fullname")
        .in("id", authorIds);

      // Merge data
      const postsWithProfiles = data?.map((post: any) => {
        const profile = profiles?.find((p) => p.id === post.author_id);
        return {
          ...post,
          profiles: profile ? { username: profile.username, fullname: profile.fullname } : undefined,
        };
      });

      setPosts(postsWithProfiles || []);
    } catch (error) {
      console.error("Error fetching posts:", error);
      toast({
        title: "Hata",
        description: "Blog yazıları yüklenirken bir hata oluştu.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const fetchCategories = async () => {
    try {
      // Extract unique categories from all posts
      const uniqueCategories = [...new Set(posts.map(p => p.category).filter(Boolean))];
      setCategories(uniqueCategories);
    } catch (error) {
      console.error("Error fetching categories:", error);
    }
  };

  useEffect(() => {
    if (posts.length > 0) {
      fetchCategories();
    }
  }, [posts]);

  const handleDelete = async (postId: string) => {
    if (!confirm("Bu blog yazısını silmek istediğinizden emin misiniz?")) return;

    try {
      const { error } = await supabase
        .from("blog_posts")
        .delete()
        .eq("id", postId);

      if (error) throw error;

      await logActivity("delete", "blog_post", postId);

      toast({
        title: "Başarılı",
        description: "Blog yazısı başarıyla silindi.",
      });

      fetchPosts();
    } catch (error: any) {
      console.error("Error deleting post:", error);
      toast({
        title: "Hata",
        description: error.message || "Blog yazısı silinirken bir hata oluştu.",
        variant: "destructive",
      });
    }
  };

  const handleTogglePublish = async (postId: string, currentStatus: boolean) => {
    try {
      const { error } = await supabase
        .from("blog_posts")
        .update({ published: !currentStatus })
        .eq("id", postId);

      if (error) throw error;

      await logActivity(currentStatus ? "unpublish" : "publish", "blog_post", postId);

      toast({
        title: "Başarılı",
        description: `Blog yazısı ${!currentStatus ? "yayınlandı" : "taslak olarak kaydedildi"}.`,
      });

      fetchPosts();
    } catch (error: any) {
      console.error("Error toggling publish:", error);
      toast({
        title: "Hata",
        description: error.message || "İşlem sırasında bir hata oluştu.",
        variant: "destructive",
      });
    }
  };

  const handleBulkDelete = async () => {
    if (selectedIds.length === 0) {
      toast({
        title: "Uyarı",
        description: "Lütfen silmek için blog yazısı seçin.",
        variant: "destructive",
      });
      return;
    }

    if (!confirm(`${selectedIds.length} blog yazısını silmek istediğinizden emin misiniz?`)) {
      return;
    }

    try {
      const { error } = await supabase
        .from("blog_posts")
        .delete()
        .in("id", selectedIds);

      if (error) throw error;

      await logActivity("bulk_delete", "blog_post", undefined, { count: selectedIds.length, ids: selectedIds });

      toast({
        title: "Başarılı",
        description: `${selectedIds.length} blog yazısı başarıyla silindi.`,
      });

      setSelectedIds([]);
      setSelectAll(false);
      fetchPosts();
    } catch (error: any) {
      console.error("Error bulk deleting posts:", error);
      toast({
        title: "Hata",
        description: error.message || "Blog yazıları silinirken bir hata oluştu.",
        variant: "destructive",
      });
    }
  };

  const handleSelectAll = () => {
    if (selectAll) {
      setSelectedIds([]);
      setSelectAll(false);
    } else {
      setSelectedIds(filteredPosts.map((post) => post.id));
      setSelectAll(true);
    }
  };

  const handleSelectOne = (postId: string) => {
    if (selectedIds.includes(postId)) {
      setSelectedIds(selectedIds.filter((id) => id !== postId));
      setSelectAll(false);
    } else {
      const newSelectedIds = [...selectedIds, postId];
      setSelectedIds(newSelectedIds);
      if (newSelectedIds.length === filteredPosts.length) {
        setSelectAll(true);
      }
    }
  };

  const filteredPosts = posts.filter((post) => {
    const matchesSearch = post.title?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      post.category?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      post.profiles?.username?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      post.excerpt?.toLowerCase().includes(searchQuery.toLowerCase());
    
    const matchesStatus = statusFilter === "all" ||
      (statusFilter === "published" && post.published) ||
      (statusFilter === "draft" && !post.published);
    
    const matchesCategory = categoryFilter === "all" || post.category === categoryFilter;
    
    const matchesDate = () => {
      if (dateFilter === "all") return true;
      const postDate = new Date(post.created_at);
      const now = new Date();
      if (dateFilter === "today") return postDate.toDateString() === now.toDateString();
      if (dateFilter === "week") {
        const weekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
        return postDate >= weekAgo;
      }
      if (dateFilter === "month") {
        const monthAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
        return postDate >= monthAgo;
      }
      return true;
    };
    
    return matchesSearch && matchesStatus && matchesCategory && matchesDate();
  });

  const stats = {
    total: posts.length,
    filtered: filteredPosts.length,
    published: posts.filter(p => p.published).length,
    draft: posts.filter(p => !p.published).length,
    totalViews: posts.reduce((sum, p) => sum + (p.view_count || 0), 0),
    totalLikes: posts.reduce((sum, p) => sum + (p.like_count || 0), 0)
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-96">
        <LoadingSpinner text="Blog yazıları yükleniyor..." />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Blog Yönetimi</h2>
          <p className="text-gray-600">
            {stats.filtered} / {stats.total} yazı gösteriliyor • {stats.published} yayında • {stats.draft} taslak
          </p>
        </div>
        <div className="flex gap-2">
          {selectedIds.length > 0 && (
            <Button variant="destructive" onClick={handleBulkDelete}>
              <Trash2 className="h-4 w-4 mr-2" />
              Seçilenleri Sil ({selectedIds.length})
            </Button>
          )}
          <Button onClick={() => navigate("/admin/blog/new")}>
            <Plus className="h-4 w-4 mr-2" />
            Yeni Yazı Ekle
          </Button>
        </div>
      </div>

      {/* Statistics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Toplam Yazı</p>
                <p className="text-2xl font-bold text-gray-900">{stats.total}</p>
              </div>
              <MessageSquare className="h-8 w-8 text-blue-500" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Yayında</p>
                <p className="text-2xl font-bold text-green-600">{stats.published}</p>
              </div>
              <Eye className="h-8 w-8 text-green-500" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Taslak</p>
                <p className="text-2xl font-bold text-orange-600">{stats.draft}</p>
              </div>
              <Edit className="h-8 w-8 text-orange-500" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Toplam Görüntülenme</p>
                <p className="text-2xl font-bold text-purple-600">{stats.totalViews.toLocaleString()}</p>
              </div>
              <Heart className="h-8 w-8 text-purple-500" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Advanced Filters */}
      <Card>
        <CardContent className="pt-6">
          <div className="space-y-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              <Input
                placeholder="Başlık, kategori, yazar veya özet ara..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
            </div>

            {/* Filter Controls */}
            <div className="flex flex-wrap gap-4">
              {/* Status Filter */}
              <div className="flex gap-2 items-center">
                <span className="text-sm text-gray-600 font-medium">Durum:</span>
                <Button
                  variant={statusFilter === "all" ? "default" : "outline"}
                  size="sm"
                  onClick={() => setStatusFilter("all")}
                >
                  Tümü
                </Button>
                <Button
                  variant={statusFilter === "published" ? "default" : "outline"}
                  size="sm"
                  onClick={() => setStatusFilter("published")}
                >
                  Yayında ({stats.published})
                </Button>
                <Button
                  variant={statusFilter === "draft" ? "default" : "outline"}
                  size="sm"
                  onClick={() => setStatusFilter("draft")}
                >
                  Taslak ({stats.draft})
                </Button>
              </div>

              {/* Date Filter */}
              <div className="flex gap-2 items-center border-l pl-4">
                <span className="text-sm text-gray-600 font-medium">Tarih:</span>
                <Button
                  variant={dateFilter === "all" ? "default" : "outline"}
                  size="sm"
                  onClick={() => setDateFilter("all")}
                >
                  Tümü
                </Button>
                <Button
                  variant={dateFilter === "today" ? "default" : "outline"}
                  size="sm"
                  onClick={() => setDateFilter("today")}
                >
                  Bugün
                </Button>
                <Button
                  variant={dateFilter === "week" ? "default" : "outline"}
                  size="sm"
                  onClick={() => setDateFilter("week")}
                >
                  Bu Hafta
                </Button>
                <Button
                  variant={dateFilter === "month" ? "default" : "outline"}
                  size="sm"
                  onClick={() => setDateFilter("month")}
                >
                  Bu Ay
                </Button>
              </div>

              {/* Category Filter */}
              <div className="flex gap-2 items-center border-l pl-4">
                <span className="text-sm text-gray-600 font-medium">Kategori:</span>
                <select
                  value={categoryFilter}
                  onChange={(e) => setCategoryFilter(e.target.value)}
                  className="border rounded-md px-3 py-1.5 text-sm"
                >
                  <option value="all">Tümü</option>
                  {categories.map((cat) => (
                    <option key={cat} value={cat}>{cat}</option>
                  ))}
                </select>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Blog Posts Table */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <MessageSquare className="h-5 w-5" />
            Blog Yazıları
          </CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-12">
                  <Checkbox
                    checked={selectAll}
                    onCheckedChange={handleSelectAll}
                  />
                </TableHead>
                <TableHead>Yazı</TableHead>
                <TableHead>Yazar</TableHead>
                <TableHead>Kategori</TableHead>
                <TableHead>Durum</TableHead>
                <TableHead>İstatistikler</TableHead>
                <TableHead>Tarih</TableHead>
                <TableHead className="text-right">İşlemler</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredPosts.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={8} className="text-center text-gray-500 py-8">
                    Blog yazısı bulunamadı
                  </TableCell>
                </TableRow>
              ) : (
                filteredPosts.map((post) => (
                  <TableRow key={post.id}>
                    <TableCell>
                      <Checkbox
                        checked={selectedIds.includes(post.id)}
                        onCheckedChange={() => handleSelectOne(post.id)}
                      />
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-3">
                        <img
                          src={post.image_url || "/placeholder.jpg"}
                          alt={post.title}
                          className="w-12 h-12 rounded-lg object-cover"
                        />
                        <div className="max-w-xs">
                          <p className="font-medium text-gray-900 truncate">{post.title}</p>
                          <p className="text-sm text-gray-500 truncate">{post.excerpt}</p>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div>
                        <p className="font-medium text-gray-900">
                          {post.profiles?.full_name || post.profiles?.fullname || "İsimsiz"}
                        </p>
                        <p className="text-sm text-gray-500">@{post.profiles?.username || "anonim"}</p>
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge variant="outline">{post.category}</Badge>
                    </TableCell>
                    <TableCell>
                      <Badge
                        variant="secondary"
                        className={
                          post.published
                            ? "bg-green-100 text-green-700"
                            : "bg-gray-100 text-gray-700"
                        }
                      >
                        {post.published ? "Yayında" : "Taslak"}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-3 text-sm text-gray-600">
                        <div className="flex items-center gap-1">
                          <Eye className="h-4 w-4" />
                          {post.view_count || 0}
                        </div>
                        <div className="flex items-center gap-1">
                          <Heart className="h-4 w-4" />
                          {post.like_count || 0}
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2 text-gray-600">
                        <Calendar className="h-4 w-4" />
                        {new Date(post.created_at).toLocaleDateString("tr-TR")}
                      </div>
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex items-center justify-end gap-2">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => setPreviewPost(post)}
                          title="Önizleme"
                        >
                          <Eye className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => setEditingPost(post)}
                          title="Düzenle"
                        >
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button
                          variant={post.published ? "secondary" : "default"}
                          size="sm"
                          onClick={() => handleTogglePublish(post.id, post.published)}
                        >
                          {post.published ? "Taslak Yap" : "Yayınla"}
                        </Button>
                        <Button
                          variant="destructive"
                          size="sm"
                          onClick={() => handleDelete(post.id)}
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

      {/* Preview Dialog */}
      <Dialog open={!!previewPost} onOpenChange={() => setPreviewPost(null)}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="text-2xl">{previewPost?.title}</DialogTitle>
            <DialogDescription>
              <div className="flex items-center gap-4 mt-2">
                <Badge variant={previewPost?.published ? "default" : "secondary"}>
                  {previewPost?.published ? "Yayında" : "Taslak"}
                </Badge>
                <span className="text-sm text-gray-500">
                  {previewPost?.category}
                </span>
                <span className="text-sm text-gray-500">
                  {new Date(previewPost?.created_at || "").toLocaleDateString("tr-TR")}
                </span>
              </div>
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            {previewPost?.image_url && (
              <img
                src={previewPost.image_url}
                alt={previewPost.title}
                className="w-full h-64 object-cover rounded-lg"
              />
            )}
            <div className="prose max-w-none">
              <p className="text-lg text-gray-600 italic">{previewPost?.excerpt}</p>
              <div className="whitespace-pre-wrap mt-4">{previewPost?.content}</div>
            </div>
            {previewPost?.tags && previewPost.tags.length > 0 && (
              <div className="flex flex-wrap gap-2">
                {previewPost.tags.map((tag, index) => (
                  <Badge key={index} variant="outline">{tag}</Badge>
                ))}
              </div>
            )}
            <div className="flex items-center gap-4 pt-4 border-t">
              <div className="flex items-center gap-1">
                <Eye className="h-4 w-4 text-gray-500" />
                <span className="text-sm text-gray-600">{previewPost?.view_count || 0} görüntülenme</span>
              </div>
              <div className="flex items-center gap-1">
                <Heart className="h-4 w-4 text-gray-500" />
                <span className="text-sm text-gray-600">{previewPost?.like_count || 0} beğeni</span>
              </div>
              <div className="flex items-center gap-1">
                <MessageSquare className="h-4 w-4 text-gray-500" />
                <span className="text-sm text-gray-600">{previewPost?.comment_count || 0} yorum</span>
              </div>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Edit Dialog */}
      <Dialog open={!!editingPost} onOpenChange={() => setEditingPost(null)}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Blog Yazısını Düzenle</DialogTitle>
            <DialogDescription>
              Yazı bilgilerini güncelleyip kaydedin.
            </DialogDescription>
          </DialogHeader>
          {editingPost && (
            <div className="space-y-4">
              <div>
                <label className="text-sm font-medium">Başlık</label>
                <Input
                  value={editingPost.title}
                  onChange={(e) => setEditingPost({ ...editingPost, title: e.target.value })}
                  placeholder="Yazı başlığı"
                />
              </div>
              <div>
                <label className="text-sm font-medium">Özet</label>
                <Textarea
                  value={editingPost.excerpt}
                  onChange={(e) => setEditingPost({ ...editingPost, excerpt: e.target.value })}
                  placeholder="Kısa özet"
                  rows={2}
                />
              </div>
              <div>
                <label className="text-sm font-medium">İçerik</label>
                <Textarea
                  value={editingPost.content}
                  onChange={(e) => setEditingPost({ ...editingPost, content: e.target.value })}
                  placeholder="Yazı içeriği"
                  rows={12}
                  className="font-mono text-sm"
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium">Kategori</label>
                  <Input
                    value={editingPost.category}
                    onChange={(e) => setEditingPost({ ...editingPost, category: e.target.value })}
                    placeholder="Kategori"
                  />
                </div>
                <div>
                  <label className="text-sm font-medium">Görsel URL</label>
                  <Input
                    value={editingPost.image_url}
                    onChange={(e) => setEditingPost({ ...editingPost, image_url: e.target.value })}
                    placeholder="https://..."
                  />
                </div>
              </div>
              <div>
                <label className="text-sm font-medium">Etiketler (virgülle ayırın)</label>
                <Input
                  value={editingPost.tags?.join(", ") || ""}
                  onChange={(e) => setEditingPost({ 
                    ...editingPost, 
                    tags: e.target.value.split(",").map(t => t.trim()).filter(Boolean)
                  })}
                  placeholder="tarif, yemek, sağlıklı"
                />
              </div>
              <div className="flex items-center gap-2">
                <Checkbox
                  checked={editingPost.published}
                  onCheckedChange={(checked) => setEditingPost({ ...editingPost, published: !!checked })}
                />
                <label className="text-sm font-medium">Yayınla</label>
              </div>
              <div className="flex justify-end gap-2">
                <Button variant="outline" onClick={() => setEditingPost(null)}>
                  İptal
                </Button>
                <Button onClick={async () => {
                  try {
                    const { error } = await supabase
                      .from("blog_posts")
                      .update({
                        title: editingPost.title,
                        excerpt: editingPost.excerpt,
                        content: editingPost.content,
                        category: editingPost.category,
                        image_url: editingPost.image_url,
                        tags: editingPost.tags,
                        published: editingPost.published
                      })
                      .eq("id", editingPost.id);

                    if (error) throw error;

                    await logActivity("update", "blog_post", editingPost.id, {
                      fields: ["title", "content", "category", "published"]
                    });

                    toast({
                      title: "Başarılı",
                      description: "Blog yazısı güncellendi.",
                    });

                    setEditingPost(null);
                    fetchPosts();
                  } catch (error: any) {
                    toast({
                      title: "Hata",
                      description: error.message || "Güncelleme başarısız.",
                      variant: "destructive",
                    });
                  }
                }}>
                  Kaydet
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default AdminBlog;
