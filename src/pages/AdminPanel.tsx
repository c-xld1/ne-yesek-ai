import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import Navbar from "@/components/Navbar";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Users, ChefHat, FileText, TrendingUp, CheckCircle, XCircle } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

const AdminPanel = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [stats, setStats] = useState({ totalUsers: 0, totalChefs: 0, totalRecipes: 0, totalOrders: 0 });
  const [pendingApplications, setPendingApplications] = useState<any[]>([]);
  const [pendingChefs, setPendingChefs] = useState<any[]>([]);

  useEffect(() => {
    if (!user) { navigate("/giris-yap"); return; }
    checkAdminRole();
  }, [user, navigate]);

  const checkAdminRole = async () => {
    const { data } = await supabase.from("user_roles").select("role").eq("user_id", user?.id).eq("role", "admin").single();
    if (!data) { navigate("/"); return; }
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
      </div>
    </div>
  );
};

export default AdminPanel;
