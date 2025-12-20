import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Users, ChefHat, FileText, ShoppingBag, TrendingUp, DollarSign } from "lucide-react";
import {
  LineChart,
  Line,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";

interface Stats {
  totalUsers: number;
  totalChefs: number;
  totalRecipes: number;
  totalOrders: number;
}

interface ChartData {
  name: string;
  value?: number;
  users?: number;
  orders?: number;
  revenue?: number;
}

const AdminDashboard = () => {
  const [stats, setStats] = useState<Stats>({
    totalUsers: 0,
    totalChefs: 0,
    totalRecipes: 0,
    totalOrders: 0,
  });
  const [loading, setLoading] = useState(true);
  const [userGrowthData, setUserGrowthData] = useState<ChartData[]>([]);
  const [orderTrendData, setOrderTrendData] = useState<ChartData[]>([]);
  const [categoryData, setCategoryData] = useState<ChartData[]>([]);
  const [recentActivities, setRecentActivities] = useState<any[]>([]);

  useEffect(() => {
    fetchStats();
    fetchRealChartData();
    fetchRecentActivities();
    
    // Real-time güncelleme her 30 saniyede bir
    const interval = setInterval(() => {
      fetchStats();
      fetchRealChartData();
    }, 30000);

    return () => clearInterval(interval);
  }, []);

  const fetchStats = async () => {
    try {
      const [users, roles, recipes, orders] = await Promise.all([
        supabase.from("profiles").select("id", { count: "exact" }),
        supabase.from("user_roles").select("role").eq("role", "chef"),
        supabase.from("recipes").select("id", { count: "exact" }),
        supabase.from("orders").select("id", { count: "exact" }),
      ]);

      setStats({
        totalUsers: users.count || 0,
        totalChefs: roles.data?.length || 0,
        totalRecipes: recipes.count || 0,
        totalOrders: orders.count || 0,
      });
    } catch (error) {
      console.error("Error fetching stats:", error);
    } finally {
      setLoading(false);
    }
  };

  const fetchRealChartData = async () => {
    try {
      // Son 7 günlük kullanıcı ve sipariş verileri
      const sevenDaysAgo = new Date();
      sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);

      const { data: dailyData } = await supabase
        .from("profiles")
        .select("created_at")
        .gte("created_at", sevenDaysAgo.toISOString());

      const { data: orderData } = await supabase
        .from("orders")
        .select("created_at")
        .gte("created_at", sevenDaysAgo.toISOString());

      // Günlük gruplama
      const days = ["Paz", "Pzt", "Sal", "Çar", "Per", "Cum", "Cmt"];
      const dailyStats: ChartData[] = Array.from({ length: 7 }, (_, i) => {
        const date = new Date();
        date.setDate(date.getDate() - (6 - i));
        const dayName = days[date.getDay()];
        
        const usersCount = dailyData?.filter(u => {
          const created = new Date(u.created_at);
          return created.toDateString() === date.toDateString();
        }).length || 0;

        const ordersCount = orderData?.filter(o => {
          const created = new Date(o.created_at);
          return created.toDateString() === date.toDateString();
        }).length || 0;

        return { name: dayName, users: usersCount, orders: ordersCount };
      });
      setUserGrowthData(dailyStats);

      // Kategori dağılımı (gerçek veriler)
      const { data: recipesByCategory } = await supabase
        .from("recipes")
        .select("category_id, categories(name)");

      const categoryMap = new Map<string, number>();
      recipesByCategory?.forEach((recipe: any) => {
        const categoryName = recipe.categories?.name || "Diğer";
        categoryMap.set(categoryName, (categoryMap.get(categoryName) || 0) + 1);
      });

      const categories: ChartData[] = Array.from(categoryMap.entries())
        .map(([name, value]) => ({ name, value }))
        .sort((a, b) => (b.value || 0) - (a.value || 0))
        .slice(0, 5);
      setCategoryData(categories);

      // Aylık sipariş trendi (son 6 ay)
      const monthNames = ["Oca", "Şub", "Mar", "Nis", "May", "Haz", "Tem", "Ağu", "Eyl", "Eki", "Kas", "Ara"];
      const monthlyOrders: ChartData[] = Array.from({ length: 6 }, (_, i) => {
        const date = new Date();
        date.setMonth(date.getMonth() - (5 - i));
        return {
          name: monthNames[date.getMonth()],
          orders: Math.floor(Math.random() * 50) + 50, // TODO: Gerçek veri
          revenue: (Math.floor(Math.random() * 10000) + 10000)
        };
      });
      setOrderTrendData(monthlyOrders);

    } catch (error) {
      console.error("Error fetching chart data:", error);
    }
  };

  const fetchRecentActivities = async () => {
    try {
      const { data } = await supabase
        .from("activity_logs")
        .select("*, profiles(username, fullname)")
        .order("created_at", { ascending: false })
        .limit(10);

      setRecentActivities(data || []);
    } catch (error) {
      console.error("Error fetching activities:", error);
    }
  };

  const generateChartData = () => {
    // Bu fonksiyon artık kullanılmıyor - fetchRealChartData kullanılıyor
    const categories: ChartData[] = [
      { name: "Türk Mutfağı", value: 45 },
      { name: "İtalyan", value: 25 },
      { name: "Uzak Doğu", value: 15 },
      { name: "Tatlılar", value: 10 },
      { name: "Diğer", value: 5 },
    ];
    setCategoryData(categories);
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

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* User Growth Chart */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <TrendingUp className="h-5 w-5 text-blue-600" />
              Haftalık Kullanıcı & Sipariş Trendi
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={userGrowthData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Line type="monotone" dataKey="users" stroke="#3b82f6" strokeWidth={2} name="Kullanıcılar" />
                <Line type="monotone" dataKey="orders" stroke="#10b981" strokeWidth={2} name="Siparişler" />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Category Distribution */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <FileText className="h-5 w-5 text-purple-600" />
              Kategori Dağılımı
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={categoryData}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="value"
                >
                  {categoryData.map((entry, index) => {
                    const colors = ["#3b82f6", "#10b981", "#f59e0b", "#ef4444", "#8b5cf6"];
                    return <Cell key={`cell-${index}`} fill={colors[index % colors.length]} />;
                  })}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      {/* Revenue Chart */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <DollarSign className="h-5 w-5 text-green-600" />
            Aylık Sipariş & Gelir Trendi
          </CardTitle>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={orderTrendData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis yAxisId="left" />
              <YAxis yAxisId="right" orientation="right" />
              <Tooltip />
              <Legend />
              <Bar yAxisId="left" dataKey="orders" fill="#8b5cf6" name="Siparişler" />
              <Bar yAxisId="right" dataKey="revenue" fill="#10b981" name="Gelir (₺)" />
            </BarChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

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
              <TrendingUp className="h-5 w-5 text-yellow-600" />
              Son Aktiviteler
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {recentActivities.length === 0 ? (
                <p className="text-sm text-gray-500 text-center py-4">Henüz aktivite yok</p>
              ) : (
                recentActivities.map((activity) => {
                  const getActivityColor = (action: string) => {
                    if (action.includes("create") || action.includes("add")) return "bg-green-500";
                    if (action.includes("delete") || action.includes("ban")) return "bg-red-500";
                    if (action.includes("update") || action.includes("edit")) return "bg-blue-500";
                    if (action.includes("approve")) return "bg-purple-500";
                    return "bg-gray-500";
                  };

                  const getActivityText = (action: string, resourceType: string) => {
                    const actionMap: Record<string, string> = {
                      create: "oluşturuldu",
                      update: "güncellendi",
                      delete: "silindi",
                      add_role: "rol eklendi",
                      remove_role: "rol kaldırıldı",
                      approve: "onaylandı",
                      reject: "reddedildi",
                      ban: "yasaklandı",
                      unban: "yasağı kaldırıldı",
                      publish: "yayınlandı",
                      unpublish: "yayından kaldırıldı",
                      bulk_delete: "toplu silindi",
                    };
                    const resourceMap: Record<string, string> = {
                      user: "Kullanıcı",
                      recipe: "Tarif",
                      blog_post: "Blog",
                      chef_application: "Şef başvurusu",
                      order: "Sipariş",
                      seo_setting: "SEO ayarı",
                    };
                    return `${resourceMap[resourceType] || resourceType} ${actionMap[action] || action}`;
                  };

                  const timeAgo = (date: string) => {
                    const now = new Date();
                    const past = new Date(date);
                    const diffMs = now.getTime() - past.getTime();
                    const diffMins = Math.floor(diffMs / 60000);
                    const diffHours = Math.floor(diffMins / 60);
                    const diffDays = Math.floor(diffHours / 24);

                    if (diffDays > 0) return `${diffDays} gün önce`;
                    if (diffHours > 0) return `${diffHours} saat önce`;
                    if (diffMins > 0) return `${diffMins} dakika önce`;
                    return "Az önce";
                  };

                  return (
                    <div key={activity.id} className="flex items-start gap-3">
                      <div className={`w-2 h-2 rounded-full ${getActivityColor(activity.action)} mt-2`}></div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-gray-900 truncate">
                          {getActivityText(activity.action, activity.resource_type)}
                        </p>
                        <p className="text-xs text-gray-500">
                          {activity.profiles?.fullname || activity.profiles?.username || "Sistem"} • {timeAgo(activity.created_at)}
                        </p>
                      </div>
                    </div>
                  );
                })
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default AdminDashboard;
