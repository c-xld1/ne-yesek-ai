import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
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
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  FileText,
  Download,
  TrendingUp,
  DollarSign,
  Users,
  ChefHat,
  FileSpreadsheet,
  File,
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import LoadingSpinner from "@/components/LoadingSpinner";

interface RevenueReport {
  period: string;
  total_revenue: number;
  total_orders: number;
  avg_order_value: number;
  growth: number;
}

interface UserGrowthReport {
  period: string;
  new_users: number;
  total_users: number;
  growth_rate: number;
}

interface ChefPerformance {
  chef_name: string;
  total_recipes: number;
  total_orders: number;
  revenue: number;
  rating: number;
}

const AdminReports = () => {
  const [loading, setLoading] = useState(false);
  const [dateRange, setDateRange] = useState({
    start: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString().split("T")[0],
    end: new Date().toISOString().split("T")[0],
  });
  const [revenueData, setRevenueData] = useState<RevenueReport[]>([]);
  const [userGrowth, setUserGrowth] = useState<UserGrowthReport[]>([]);
  const [chefPerformance, setChefPerformance] = useState<ChefPerformance[]>([]);
  const { toast } = useToast();

  useEffect(() => {
    fetchReports();
  }, [dateRange]);

  const fetchReports = async () => {
    setLoading(true);

    // Mock data - replace with real Supabase queries
    setRevenueData([
      {
        period: "Ocak 2025",
        total_revenue: 145000,
        total_orders: 892,
        avg_order_value: 162.5,
        growth: 12.5,
      },
      {
        period: "Şubat 2025",
        total_revenue: 168000,
        total_orders: 1023,
        avg_order_value: 164.2,
        growth: 15.9,
      },
      {
        period: "Mart 2025",
        total_revenue: 182000,
        total_orders: 1145,
        avg_order_value: 159.0,
        growth: 8.3,
      },
    ]);

    setUserGrowth([
      { period: "Ocak 2025", new_users: 234, total_users: 3421, growth_rate: 7.3 },
      { period: "Şubat 2025", new_users: 312, total_users: 3733, growth_rate: 9.1 },
      { period: "Mart 2025", new_users: 289, total_users: 4022, growth_rate: 7.7 },
    ]);

    setChefPerformance([
      {
        chef_name: "Ahmet Yılmaz",
        total_recipes: 45,
        total_orders: 892,
        revenue: 145000,
        rating: 4.8,
      },
      {
        chef_name: "Zeynep Demir",
        total_recipes: 38,
        total_orders: 723,
        revenue: 118000,
        rating: 4.7,
      },
      {
        chef_name: "Mehmet Kaya",
        total_recipes: 52,
        total_orders: 654,
        revenue: 98000,
        rating: 4.6,
      },
    ]);

    setLoading(false);
  };

  const handleExport = (format: "excel" | "pdf" | "csv") => {
    toast({
      title: "İndiriliyor",
      description: `Rapor ${format.toUpperCase()} formatında indiriliyor...`,
    });

    // Simulate download
    setTimeout(() => {
      toast({
        title: "Başarılı",
        description: `Rapor ${format.toUpperCase()} olarak indirildi.`,
      });
    }, 1500);
  };

  const stats = {
    totalRevenue: revenueData.reduce((sum, r) => sum + r.total_revenue, 0),
    totalOrders: revenueData.reduce((sum, r) => sum + r.total_orders, 0),
    avgGrowth:
      revenueData.length > 0
        ? revenueData.reduce((sum, r) => sum + r.growth, 0) / revenueData.length
        : 0,
    totalNewUsers: userGrowth.reduce((sum, u) => sum + u.new_users, 0),
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between flex-wrap gap-4">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Raporlama Merkezi</h2>
          <p className="text-gray-600">Detaylı iş raporları ve analizler</p>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" onClick={() => handleExport("excel")}>
            <FileSpreadsheet className="h-4 w-4 mr-2" />
            Excel
          </Button>
          <Button variant="outline" onClick={() => handleExport("pdf")}>
            <File className="h-4 w-4 mr-2" />
            PDF
          </Button>
          <Button variant="outline" onClick={() => handleExport("csv")}>
            <Download className="h-4 w-4 mr-2" />
            CSV
          </Button>
        </div>
      </div>

      {/* Date Range Filter */}
      <Card>
        <CardContent className="pt-6">
          <div className="flex items-end gap-4">
            <div className="flex-1">
              <Label htmlFor="start_date">Başlangıç Tarihi</Label>
              <Input
                id="start_date"
                type="date"
                value={dateRange.start}
                onChange={(e) => setDateRange({ ...dateRange, start: e.target.value })}
              />
            </div>
            <div className="flex-1">
              <Label htmlFor="end_date">Bitiş Tarihi</Label>
              <Input
                id="end_date"
                type="date"
                value={dateRange.end}
                onChange={(e) => setDateRange({ ...dateRange, end: e.target.value })}
              />
            </div>
            <Button onClick={fetchReports} disabled={loading}>
              {loading ? <LoadingSpinner /> : "Raporları Yenile"}
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Summary Statistics */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Toplam Gelir</p>
                <p className="text-2xl font-bold text-green-600">
                  ₺{stats.totalRevenue.toLocaleString()}
                </p>
              </div>
              <DollarSign className="h-8 w-8 text-green-500" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Toplam Sipariş</p>
                <p className="text-2xl font-bold text-blue-600">
                  {stats.totalOrders.toLocaleString()}
                </p>
              </div>
              <FileText className="h-8 w-8 text-blue-500" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Ort. Büyüme</p>
                <p className="text-2xl font-bold text-purple-600">
                  %{stats.avgGrowth.toFixed(1)}
                </p>
              </div>
              <TrendingUp className="h-8 w-8 text-purple-500" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Yeni Kullanıcı</p>
                <p className="text-2xl font-bold text-orange-600">
                  {stats.totalNewUsers.toLocaleString()}
                </p>
              </div>
              <Users className="h-8 w-8 text-orange-500" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Reports Tabs */}
      <Tabs defaultValue="revenue" className="w-full">
        <TabsList>
          <TabsTrigger value="revenue">Gelir Raporu</TabsTrigger>
          <TabsTrigger value="users">Kullanıcı Büyümesi</TabsTrigger>
          <TabsTrigger value="chefs">Şef Performansı</TabsTrigger>
        </TabsList>

        <TabsContent value="revenue">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <DollarSign className="h-5 w-5" />
                Gelir Raporu
              </CardTitle>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Dönem</TableHead>
                    <TableHead>Toplam Gelir</TableHead>
                    <TableHead>Sipariş Sayısı</TableHead>
                    <TableHead>Ort. Sepet Değeri</TableHead>
                    <TableHead>Büyüme</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {revenueData.map((item, index) => (
                    <TableRow key={index}>
                      <TableCell className="font-medium">{item.period}</TableCell>
                      <TableCell>
                        <span className="text-green-600 font-semibold">
                          ₺{item.total_revenue.toLocaleString()}
                        </span>
                      </TableCell>
                      <TableCell>{item.total_orders.toLocaleString()}</TableCell>
                      <TableCell>₺{item.avg_order_value.toFixed(2)}</TableCell>
                      <TableCell>
                        <Badge
                          className={
                            item.growth > 0
                              ? "bg-green-100 text-green-700"
                              : "bg-red-100 text-red-700"
                          }
                        >
                          {item.growth > 0 ? "+" : ""}
                          {item.growth}%
                        </Badge>
                      </TableCell>
                    </TableRow>
                  ))}
                  <TableRow className="bg-gray-50 font-bold">
                    <TableCell>TOPLAM</TableCell>
                    <TableCell className="text-green-600">
                      ₺{stats.totalRevenue.toLocaleString()}
                    </TableCell>
                    <TableCell>{stats.totalOrders.toLocaleString()}</TableCell>
                    <TableCell>
                      ₺
                      {stats.totalOrders > 0
                        ? (stats.totalRevenue / stats.totalOrders).toFixed(2)
                        : 0}
                    </TableCell>
                    <TableCell>-</TableCell>
                  </TableRow>
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="users">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Users className="h-5 w-5" />
                Kullanıcı Büyümesi
              </CardTitle>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Dönem</TableHead>
                    <TableHead>Yeni Kullanıcı</TableHead>
                    <TableHead>Toplam Kullanıcı</TableHead>
                    <TableHead>Büyüme Oranı</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {userGrowth.map((item, index) => (
                    <TableRow key={index}>
                      <TableCell className="font-medium">{item.period}</TableCell>
                      <TableCell>
                        <span className="text-blue-600 font-semibold">
                          +{item.new_users}
                        </span>
                      </TableCell>
                      <TableCell>{item.total_users.toLocaleString()}</TableCell>
                      <TableCell>
                        <Badge className="bg-blue-100 text-blue-700">
                          +{item.growth_rate}%
                        </Badge>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="chefs">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <ChefHat className="h-5 w-5" />
                Şef Performans Raporu
              </CardTitle>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Şef Adı</TableHead>
                    <TableHead>Tarif Sayısı</TableHead>
                    <TableHead>Sipariş Sayısı</TableHead>
                    <TableHead>Gelir</TableHead>
                    <TableHead>Puan</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {chefPerformance.map((chef, index) => (
                    <TableRow key={index}>
                      <TableCell className="font-medium">{chef.chef_name}</TableCell>
                      <TableCell>{chef.total_recipes}</TableCell>
                      <TableCell>{chef.total_orders.toLocaleString()}</TableCell>
                      <TableCell>
                        <span className="text-green-600 font-semibold">
                          ₺{chef.revenue.toLocaleString()}
                        </span>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-1">
                          <span className="text-yellow-500">★</span>
                          <span className="font-semibold">{chef.rating}</span>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default AdminReports;
