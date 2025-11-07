import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import Navbar from "@/components/Navbar";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Users, ChefHat, FileText, TrendingUp, CheckCircle, XCircle, BookOpen, Plus, Edit, Trash, Globe } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

const AdminPanel = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [stats, setStats] = useState({ totalUsers: 0, totalChefs: 0, totalRecipes: 0, totalOrders: 0 });
  const [pendingApplications, setPendingApplications] = useState<any[]>([]);
  const [pendingChefs, setPendingChefs] = useState<any[]>([]);
  const [blogPosts, setBlogPosts] = useState<any[]>([]);

  useEffect(() => {
    if (!user) { navigate("/giris-yap"); return; }
    checkAdminRole();
  }, [user, navigate]);

  const checkAdminRole = async () => {
    console.log("Current User ID:", user?.id);
    console.log("Copy this ID and run in Supabase SQL Editor:");
    console.log(`INSERT INTO user_roles (user_id, role) VALUES ('${user?.id}', 'admin') ON CONFLICT (user_id, role) DO NOTHING;`);
    
    const { data, error } = await supabase
      .from("user_roles")
      .select("role")
      .eq("user_id", user?.id)
      .eq("role", "admin")
      .single();
    
    if (error) {
      console.error("Admin check error:", error);
      toast({
        variant: "destructive",
        title: "Yetkisiz Erişim",
        description: `Admin rolü bulunamadı. Kullanıcı ID'nizi konsola yazdırdık.`,
      });
      // Geçici olarak yönlendirmeyi kaldıralım - development için
      // navigate("/"); 
      // return;
    }
    
    if (!data) {
      toast({
        variant: "destructive",
        title: "Yetkisiz Erişim",
        description: "Bu sayfaya erişim yetkiniz yok.",
      });
      // navigate("/"); 
      // return;
    }
    
    fetchData();
  };

  const fetchData = async () => {
    const [u, c, r, o] = await Promise.all([
      supabase.from("profiles").select("id", { count: "exact" }),
      supabase.from("chef_profiles").select("id", { count: "exact" }),
      supabase.from("recipes").select("id", { count: "exact" }),
      supabase.from("orders").select("id", { count: "exact" }),
    ]);
    setStats({ totalUsers: u.count || 0, totalChefs: c.count || 0, totalRecipes: r.count || 0, totalOrders: o.count || 0 });
    
    const { data: applications } = await supabase
      .from("chef_applications")
      .select("*")
      .eq("status", "pending")
      .order("created_at", { ascending: false });
    setPendingApplications(applications || []);

    // Fetch blog posts
    const { data: posts } = await supabase
      .from("blog_posts")
      .select(`
        *,
        profiles!blog_posts_author_id_fkey(username, fullname)
      `)
      .order("created_at", { ascending: false })
      .limit(10);
    setBlogPosts(posts || []);
  };

  const handleApproveApplication = async (application: any) => {
    try {
      // Create chef profile
      const { data: chefProfile, error: profileError } = await supabase
        .from("chef_profiles")
        .insert([{
          user_id: application.user_id,
          business_name: application.fullname,
          address: application.address,
          city: application.city,
          phone: application.phone,
          description: application.business_description,
          is_active: true,
        }])
        .select()
        .single();

      if (profileError) throw profileError;

      // Add chef role
      await supabase.from("user_roles").insert([{ user_id: application.user_id, role: "chef" }]);

      // Update application status
      await supabase.from("chef_applications").update({ status: "approved" }).eq("id", application.id);

      toast({ title: "✅ Başvuru Onaylandı", description: "Şef hesabı oluşturuldu" });
      fetchData();
    } catch (error: any) {
      toast({ title: "Hata", description: error.message, variant: "destructive" });
    }
  };

  const handleRejectApplication = async (id: string) => {
    const { error } = await supabase.from("chef_applications").update({ status: "rejected" }).eq("id", id);
    if (error) {
      toast({ title: "Hata", description: error.message, variant: "destructive" });
      return;
    }
    toast({ title: "❌ Başvuru Reddedildi" });
    fetchData();
  };

  const handleDeleteBlogPost = async (id: string) => {
    if (!confirm("Bu blog yazısını silmek istediğinizden emin misiniz?")) return;
    
    const { error } = await supabase.from("blog_posts").delete().eq("id", id);
    if (error) {
      toast({ title: "Hata", description: error.message, variant: "destructive" });
      return;
    }
    toast({ title: "✅ Blog yazısı silindi" });
    fetchData();
  };

  const handleTogglePublish = async (post: any) => {
    const { error } = await supabase
      .from("blog_posts")
      .update({ published: !post.published })
      .eq("id", post.id);
    
    if (error) {
      toast({ title: "Hata", description: error.message, variant: "destructive" });
      return;
    }
    toast({ title: post.published ? "📝 Taslağa alındı" : "✅ Yayınlandı" });
    fetchData();
  };

  return (
    <div className="min-h-screen bg-background pb-20">
      <Navbar />
      <div className="container mx-auto px-4 py-6 space-y-6">
        <h1 className="text-3xl font-bold">Admin Paneli</h1>
        <div className="grid md:grid-cols-4 gap-4">
          <Card className="p-6"><Users className="h-6 w-6 mb-2" /><p className="text-2xl font-bold">{stats.totalUsers}</p><p className="text-sm">Kullanıcı</p></Card>
          <Card className="p-6"><ChefHat className="h-6 w-6 mb-2" /><p className="text-2xl font-bold">{stats.totalChefs}</p><p className="text-sm">Şef</p></Card>
          <Card className="p-6"><FileText className="h-6 w-6 mb-2" /><p className="text-2xl font-bold">{stats.totalRecipes}</p><p className="text-sm">Tarif</p></Card>
          <Card className="p-6"><TrendingUp className="h-6 w-6 mb-2" /><p className="text-2xl font-bold">{stats.totalOrders}</p><p className="text-sm">Sipariş</p></Card>
        </div>

        {/* Quick Actions */}
        <Card className="p-6">
          <h2 className="text-xl font-semibold mb-4">Hızlı İşlemler</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <Button
              variant="outline"
              className="h-auto flex-col gap-2 p-4"
              onClick={() => navigate("/admin/seo")}
            >
              <Globe className="h-6 w-6" />
              <span className="text-sm">SEO Yönetimi</span>
            </Button>
            <Button
              variant="outline"
              className="h-auto flex-col gap-2 p-4"
              onClick={() => navigate("/blog/yeni")}
            >
              <Plus className="h-6 w-6" />
              <span className="text-sm">Yeni Blog Yazısı</span>
            </Button>
            <Button
              variant="outline"
              className="h-auto flex-col gap-2 p-4"
              onClick={() => navigate("/tarif-paylas")}
            >
              <FileText className="h-6 w-6" />
              <span className="text-sm">Yeni Tarif</span>
            </Button>
            <Button
              variant="outline"
              className="h-auto flex-col gap-2 p-4"
              onClick={() => navigate("/admin/istatistikler")}
            >
              <TrendingUp className="h-6 w-6" />
              <span className="text-sm">İstatistikler</span>
            </Button>
          </div>
        </Card>

        <Tabs defaultValue="applications" className="w-full">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="applications">Şef Başvuruları</TabsTrigger>
            <TabsTrigger value="blog">Blog Yönetimi</TabsTrigger>
          </TabsList>

          <TabsContent value="applications">
            <Card className="p-6">
              <h2 className="text-xl font-semibold mb-4">Şef Başvuruları ({pendingApplications.length})</h2>
              {pendingApplications.length === 0 ? (
                <p className="text-muted-foreground text-center py-8">Bekleyen başvuru yok</p>
              ) : (
                <div className="space-y-4">
                  {pendingApplications.map(app => (
                    <div key={app.id} className="p-4 border rounded-lg space-y-3">
                      <div className="flex justify-between items-start">
                        <div>
                          <h3 className="font-semibold text-lg">{app.fullname}</h3>
                          <p className="text-sm text-muted-foreground">{app.phone}</p>
                          <p className="text-sm text-muted-foreground">{app.city}, {app.district || ''}</p>
                        </div>
                        <Badge>{app.cuisine_type}</Badge>
                      </div>
                      <div>
                        <p className="text-sm"><span className="font-semibold">Deneyim:</span> {app.experience_years || 0} yıl</p>
                        <p className="text-sm mt-2">{app.business_description}</p>
                      </div>
                      <div className="flex gap-2 pt-2">
                        <Button size="sm" onClick={() => handleApproveApplication(app)} className="bg-green-600 hover:bg-green-700">
                          <CheckCircle className="h-4 w-4 mr-1" />
                          Onayla
                        </Button>
                        <Button size="sm" variant="destructive" onClick={() => handleRejectApplication(app.id)}>
                          <XCircle className="h-4 w-4 mr-1" />
                          Reddet
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </Card>
          </TabsContent>

          <TabsContent value="blog">
            <Card className="p-6">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-semibold">Blog Yazıları ({blogPosts.length})</h2>
                <Button onClick={() => navigate("/blog/yeni")}>
                  <Plus className="h-4 w-4 mr-2" />
                  Yeni Yazı
                </Button>
              </div>
              {blogPosts.length === 0 ? (
                <p className="text-muted-foreground text-center py-8">Henüz blog yazısı yok</p>
              ) : (
                <div className="space-y-4">
                  {blogPosts.map(post => (
                    <div key={post.id} className="p-4 border rounded-lg space-y-3">
                      <div className="flex justify-between items-start gap-4">
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-1">
                            <h3 className="font-semibold text-lg">{post.title}</h3>
                            {post.featured && <Badge variant="secondary">Öne Çıkan</Badge>}
                            <Badge variant={post.published ? "default" : "outline"}>
                              {post.published ? "Yayında" : "Taslak"}
                            </Badge>
                          </div>
                          <p className="text-sm text-muted-foreground">{post.excerpt}</p>
                          <div className="flex gap-4 mt-2 text-sm text-muted-foreground">
                            <span>Kategori: {post.category}</span>
                            <span>Yazar: {post.profiles?.fullname || post.profiles?.username}</span>
                            <span>👁 {post.view_count || 0}</span>
                            <span>❤️ {post.like_count || 0}</span>
                            <span>💬 {post.comment_count || 0}</span>
                          </div>
                        </div>
                        <div className="flex gap-2">
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => handleTogglePublish(post)}
                          >
                            {post.published ? "📝" : "✅"}
                          </Button>
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => navigate(`/blog/${post.slug}`)}
                          >
                            <BookOpen className="h-4 w-4" />
                          </Button>
                          <Button
                            size="sm"
                            variant="destructive"
                            onClick={() => handleDeleteBlogPost(post.id)}
                          >
                            <Trash className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default AdminPanel;
