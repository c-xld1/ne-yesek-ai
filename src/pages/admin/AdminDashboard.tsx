import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Users, ChefHat, FileText, ShoppingBag, TrendingUp, DollarSign } from "lucide-react";

interface Stats {
  totalUsers: number;
  totalChefs: number;
  totalRecipes: number;
  totalOrders: number;
}

const AdminDashboard = () => {
  const [stats, setStats] = useState<Stats>({
    totalUsers: 0,
    totalChefs: 0,
    totalRecipes: 0,
    totalOrders: 0,
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchStats();
  }, []);

  const fetchStats = async () => {
    try {
      const [users, chefs, recipes, orders] = await Promise.all([
        supabase.from("profiles").select("id", { count: "exact" }),
        supabase.from("chef_profiles").select("id", { count: "exact" }),
        supabase.from("recipes").select("id", { count: "exact" }),
        supabase.from("orders").select("id", { count: "exact" }),
      ]);

      setStats({
        totalUsers: users.count || 0,
        totalChefs: chefs.count || 0,
        totalRecipes: recipes.count || 0,
        totalOrders: orders.count || 0,
      });
    } catch (error) {
      console.error("Error fetching stats:", error);
    } finally {
      setLoading(false);
    }
  };

  const statCards = [
    {
      title: "Toplam Kullanıcı",
      value: stats.totalUsers,
      icon: Users,
      gradient: "from-blue-500 to-blue-600",
      bgGradient: "from-blue-50 to-blue-100",
    },
    {
      title: "Toplam Şef",
      value: stats.totalChefs,
      icon: ChefHat,
      gradient: "from-orange-500 to-orange-600",
      bgGradient: "from-orange-50 to-orange-100",
    },
    {
      title: "Toplam Tarif",
      value: stats.totalRecipes,
      icon: FileText,
      gradient: "from-green-500 to-green-600",
      bgGradient: "from-green-50 to-green-100",
    },
    {
      title: "Toplam Sipariş",
      value: stats.totalOrders,
      icon: ShoppingBag,
      gradient: "from-purple-500 to-purple-600",
      bgGradient: "from-purple-50 to-purple-100",
    },
  ];

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Welcome Banner */}
      <div className="bg-gradient-to-r from-purple-600 to-purple-800 rounded-lg p-6 text-white">
        <h2 className="text-2xl font-bold mb-2">Admin Paneline Hoş Geldiniz 👋</h2>
        <p className="text-purple-100">
          Ne Yesek AI platformunun tüm yönetim araçlarına buradan ulaşabilirsiniz.
        </p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {statCards.map((stat) => {
          const Icon = stat.icon;
          return (
            <Card key={stat.title} className="overflow-hidden border-none shadow-md hover:shadow-lg transition-shadow">
              <CardContent className={`p-6 bg-gradient-to-br ${stat.bgGradient}`}>
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600 mb-1">{stat.title}</p>
                    <p className="text-3xl font-bold text-gray-900">{stat.value.toLocaleString()}</p>
                  </div>
                  <div className={`p-3 rounded-xl bg-gradient-to-br ${stat.gradient} shadow-lg`}>
                    <Icon className="h-6 w-6 text-white" />
                  </div>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <TrendingUp className="h-5 w-5 text-green-600" />
              Hızlı İşlemler
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            <div className="p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors cursor-pointer">
              <p className="font-medium text-gray-900">Yeni Blog Yazısı</p>
              <p className="text-sm text-gray-500">Blog içeriği oluştur</p>
            </div>
            <div className="p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors cursor-pointer">
              <p className="font-medium text-gray-900">Şef Başvuruları</p>
              <p className="text-sm text-gray-500">Bekleyen başvuruları incele</p>
            </div>
            <div className="p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors cursor-pointer">
              <p className="font-medium text-gray-900">SEO Ayarları</p>
              <p className="text-sm text-gray-500">Sayfa SEO'larını yönet</p>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <DollarSign className="h-5 w-5 text-yellow-600" />
              Son Aktiviteler
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <div className="flex items-start gap-3">
                <div className="w-2 h-2 rounded-full bg-blue-500 mt-2"></div>
                <div>
                  <p className="text-sm font-medium text-gray-900">Yeni kullanıcı kaydı</p>
                  <p className="text-xs text-gray-500">5 dakika önce</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <div className="w-2 h-2 rounded-full bg-green-500 mt-2"></div>
                <div>
                  <p className="text-sm font-medium text-gray-900">Yeni tarif eklendi</p>
                  <p className="text-xs text-gray-500">15 dakika önce</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <div className="w-2 h-2 rounded-full bg-orange-500 mt-2"></div>
                <div>
                  <p className="text-sm font-medium text-gray-900">Şef başvurusu</p>
                  <p className="text-xs text-gray-500">1 saat önce</p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default AdminDashboard;
