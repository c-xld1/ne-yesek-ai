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
import { MessageSquare, Search, Eye, Trash2, Edit, Plus, Heart, Calendar } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import LoadingSpinner from "@/components/LoadingSpinner";
import { useNavigate } from "react-router-dom";

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
    username: string;
    full_name: string;
  };
}

const AdminBlog = () => {
  const [posts, setPosts] = useState<BlogPost[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const { toast } = useToast();
  const navigate = useNavigate();

  useEffect(() => {
    fetchPosts();
  }, []);

  const fetchPosts = async () => {
    try {
      const { data, error } = await supabase
        .from("blog_posts")
        .select(`
          *,
          profiles!blog_posts_author_id_fkey(username, full_name)
        `)
        .order("created_at", { ascending: false });

      if (error) throw error;
      setPosts(data || []);
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

  const handleDelete = async (postId: string) => {
    if (!confirm("Bu blog yazısını silmek istediğinizden emin misiniz?")) return;

    try {
      const { error } = await supabase
        .from("blog_posts")
        .delete()
        .eq("id", postId);

      if (error) throw error;

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

  const filteredPosts = posts.filter(
    (post) =>
      post.title?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      post.category?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      post.profiles?.username?.toLowerCase().includes(searchQuery.toLowerCase())
  );

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
            Toplam {posts.length} yazı • {posts.filter((p) => p.published).length} yayında
          </p>
        </div>
        <Button onClick={() => navigate("/blog/yeni")}>
          <Plus className="h-4 w-4 mr-2" />
          Yeni Yazı Ekle
        </Button>
      </div>

      {/* Search */}
      <Card>
        <CardContent className="pt-6">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
            <Input
              placeholder="Başlık, kategori veya yazar ara..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10"
            />
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
                  <TableCell colSpan={7} className="text-center text-gray-500 py-8">
                    Blog yazısı bulunamadı
                  </TableCell>
                </TableRow>
              ) : (
                filteredPosts.map((post) => (
                  <TableRow key={post.id}>
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
                          {post.profiles?.full_name || "İsimsiz"}
                        </p>
                        <p className="text-sm text-gray-500">@{post.profiles?.username}</p>
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
                          onClick={() => navigate(`/blog/${post.slug}`)}
                        >
                          <Eye className="h-4 w-4" />
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
    </div>
  );
};

export default AdminBlog;
