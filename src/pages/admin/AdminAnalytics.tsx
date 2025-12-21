import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  BarChart3,
  TrendingUp,
  Users,
  Eye,
  Heart,
  ShoppingBag,
  MapPin,
  Clock,
  Search,
} from "lucide-react";
import LoadingSpinner from "@/components/LoadingSpinner";

interface AnalyticsData {
  totalViews: number;
  totalUsers: number;
  totalRecipes: number;
  totalOrders: number;
  topRecipes: Array<{ id: string; title: string; views: number }>;
  topSearchTerms: Array<{ term: string; count: number }>;
  userGrowth: Array<{ date: string; count: number }>;
  popularCategories: Array<{ name: string; count: number }>;
}

const AdminAnalytics = () => {
  const [loading, setLoading] = useState(true);
  const [analytics, setAnalytics] = useState<AnalyticsData>({
    totalViews: 0,
    totalUsers: 0,
    totalRecipes: 0,
    totalOrders: 0,
    topRecipes: [],
    topSearchTerms: [],
    userGrowth: [],
    popularCategories: [],
  });

  useEffect(() => {
    fetchAnalytics();
  }, []);

  const fetchAnalytics = async () => {
    setLoading(true);
    try {
      // Fetch users count
      const { count: usersCount } = await supabase
        .from("profiles")
        .select("*", { count: "exact", head: true });

      // Fetch recipes count
      const { count: recipesCount } = await supabase
        .from("recipes")
        .select("*", { count: "exact", head: true });

      // Fetch orders count
      const { count: ordersCount } = await supabase
        .from("orders")
        .select("*", { count: "exact", head: true });

      // Fetch top viewed recipes
      const { data: topRecipes } = await supabase
        .from("recipes")
        .select("id, title, views")
        .order("views", { ascending: false })
        .limit(10);

      // Fetch user growth (last 30 days)
      const { data: users } = await supabase
        .from("profiles")
        .select("created_at")
        .order("created_at", { ascending: false })
        .limit(1000);

      // Group by date
      const growthMap = new Map<string, number>();
      users?.forEach((user) => {
        const date = new Date(user.created_at).toLocaleDateString("tr-TR");
        growthMap.set(date, (growthMap.get(date) || 0) + 1);
      });

      const userGrowth = Array.from(growthMap.entries())
        .map(([date, count]) => ({ date, count }))
        .slice(0, 30)
        .reverse();

      // Fetch recipe categories
      const { data: recipes } = await supabase
        .from("recipes")
        .select("category_id, categories(name)")
        .limit(1000);

      const categoryMap = new Map<string, number>();
      recipes?.forEach((recipe: any) => {
        const name = recipe.categories?.name || "Diğer";
        categoryMap.set(name, (categoryMap.get(name) || 0) + 1);
      });

      const popularCategories = Array.from(categoryMap.entries())
        .map(([name, count]) => ({ name, count }))
        .sort((a, b) => b.count - a.count)
        .slice(0, 10);

      setAnalytics({
        totalViews: topRecipes?.reduce((sum, r: any) => sum + (r.views || 0), 0) || 0,
        totalUsers: usersCount || 0,
        totalRecipes: recipesCount || 0,
        totalOrders: ordersCount || 0,
        topRecipes:
          topRecipes?.map((r: any) => ({
            id: r.id,
            title: r.title,
            views: r.views || 0,
          })) || [],
        topSearchTerms: [
          { term: "tavuk", count: 245 },
          { term: "makarna", count: 198 },
          { term: "çorba", count: 156 },
          { term: "tatlı", count: 143 },
          { term: "salata", count: 129 },
        ],
        userGrowth,
        popularCategories,
      });
    } catch (error) {
      console.error("Error fetching analytics:", error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-96">
        <LoadingSpinner text="Analitikler yükleniyor..." />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h2 className="text-2xl font-bold text-gray-900">Analitik & Raporlar</h2>
        <p className="text-gray-600">Detaylı istatistikler ve trendler</p>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Toplam Görüntüleme</p>
                <p className="text-2xl font-bold text-blue-600">
                  {analytics.totalViews.toLocaleString()}
                </p>
              </div>
              <Eye className="h-8 w-8 text-blue-500" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Toplam Kullanıcı</p>
                <p className="text-2xl font-bold text-green-600">
                  {analytics.totalUsers.toLocaleString()}
                </p>
              </div>
              <Users className="h-8 w-8 text-green-500" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Toplam Tarif</p>
                <p className="text-2xl font-bold text-purple-600">
                  {analytics.totalRecipes.toLocaleString()}
                </p>
              </div>
              <Heart className="h-8 w-8 text-purple-500" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Toplam Sipariş</p>
                <p className="text-2xl font-bold text-orange-600">
                  {analytics.totalOrders.toLocaleString()}
                </p>
              </div>
              <ShoppingBag className="h-8 w-8 text-orange-500" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Tabs */}
      <Card>
        <CardContent className="pt-6">
          <Tabs defaultValue="popular">
            <TabsList className="w-full grid grid-cols-2 sm:grid-cols-4 mb-6">
              <TabsTrigger value="popular" className="text-xs sm:text-sm">Popüler</TabsTrigger>
              <TabsTrigger value="search" className="text-xs sm:text-sm">Arama</TabsTrigger>
              <TabsTrigger value="growth" className="text-xs sm:text-sm">Büyüme</TabsTrigger>
              <TabsTrigger value="categories" className="text-xs sm:text-sm">Kategori</TabsTrigger>
            </TabsList>

            <TabsContent value="popular" className="space-y-4">
              <div className="flex items-center gap-2 mb-4">
                <TrendingUp className="h-5 w-5 text-blue-500" />
                <h3 className="text-lg font-semibold">En Çok Görüntülenen Tarifler</h3>
              </div>
              <div className="space-y-3">
                {analytics.topRecipes.map((recipe, index) => (
                  <div
                    key={recipe.id}
                    className="flex items-center justify-between p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
                  >
                    <div className="flex items-center gap-3">
                      <div className="flex items-center justify-center w-8 h-8 rounded-full bg-blue-100 text-blue-600 font-bold">
                        {index + 1}
                      </div>
                      <span className="font-medium">{recipe.title}</span>
                    </div>
                    <div className="flex items-center gap-2 text-gray-600">
                      <Eye className="h-4 w-4" />
                      <span className="font-semibold">{recipe.views.toLocaleString()}</span>
                    </div>
                  </div>
                ))}
              </div>
            </TabsContent>

            <TabsContent value="search" className="space-y-4">
              <div className="flex items-center gap-2 mb-4">
                <Search className="h-5 w-5 text-green-500" />
                <h3 className="text-lg font-semibold">Popüler Arama Terimleri</h3>
              </div>
              <div className="space-y-3">
                {analytics.topSearchTerms.map((term, index) => (
                  <div
                    key={term.term}
                    className="flex items-center justify-between p-3 bg-gray-50 rounded-lg"
                  >
                    <div className="flex items-center gap-3">
                      <div className="flex items-center justify-center w-8 h-8 rounded-full bg-green-100 text-green-600 font-bold">
                        {index + 1}
                      </div>
                      <span className="font-medium">{term.term}</span>
                    </div>
                    <span className="text-gray-600 font-semibold">
                      {term.count} arama
                    </span>
                  </div>
                ))}
              </div>
            </TabsContent>

            <TabsContent value="growth" className="space-y-4">
              <div className="flex items-center gap-2 mb-4">
                <Users className="h-5 w-5 text-purple-500" />
                <h3 className="text-lg font-semibold">Son 30 Gün Kullanıcı Büyümesi</h3>
              </div>
              <div className="space-y-2">
                {analytics.userGrowth.map((day) => (
                  <div
                    key={day.date}
                    className="flex items-center justify-between p-3 bg-gray-50 rounded-lg"
                  >
                    <div className="flex items-center gap-2">
                      <Clock className="h-4 w-4 text-gray-500" />
                      <span className="text-sm">{day.date}</span>
                    </div>
                    <span className="font-semibold text-purple-600">+{day.count}</span>
                  </div>
                ))}
              </div>
            </TabsContent>

            <TabsContent value="categories" className="space-y-4">
              <div className="flex items-center gap-2 mb-4">
                <BarChart3 className="h-5 w-5 text-orange-500" />
                <h3 className="text-lg font-semibold">Popüler Kategoriler</h3>
              </div>
              <div className="space-y-3">
                {analytics.popularCategories.map((category, index) => (
                  <div
                    key={category.name}
                    className="flex items-center justify-between p-3 bg-gray-50 rounded-lg"
                  >
                    <div className="flex items-center gap-3">
                      <div className="flex items-center justify-center w-8 h-8 rounded-full bg-orange-100 text-orange-600 font-bold">
                        {index + 1}
                      </div>
                      <span className="font-medium">{category.name}</span>
                    </div>
                    <div className="flex items-center gap-4">
                      <div className="w-32 h-2 bg-gray-200 rounded-full overflow-hidden">
                        <div
                          className="h-full bg-orange-500"
                          style={{
                            width: `${(category.count / analytics.popularCategories[0].count) * 100}%`,
                          }}
                        />
                      </div>
                      <span className="font-semibold text-orange-600 min-w-[3rem] text-right">
                        {category.count}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
};

export default AdminAnalytics;
