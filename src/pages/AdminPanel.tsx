
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Progress } from "@/components/ui/progress";
import { 
  Users, ChefHat, MessageSquare, TrendingUp, Settings, 
  Shield, DollarSign, BarChart3, Eye, Flag, Ban, 
  CheckCircle, XCircle, AlertTriangle, Calendar,
  Search, Filter, Download, Upload, Bell
} from "lucide-react";

const AdminPanel = () => {
  const [activeTab, setActiveTab] = useState("dashboard");

  const stats = {
    totalUsers: 15420,
    totalRecipes: 8965,
    totalRevenue: 125340,
    activeUsers: 2341,
    pendingReviews: 23,
    reportedContent: 5,
    monthlyGrowth: 15.4
  };

  const recentUsers = [
    {
      id: 1,
      name: "Ayşe Yılmaz",
      email: "ayse@example.com",
      joinDate: "2024-02-15",
      status: "active",
      recipes: 5,
      avatar: "https://images.unsplash.com/photo-1494790108755-2616c4f23456?w=50&h=50&fit=crop"
    },
    {
      id: 2,
      name: "Mehmet Kaya",
      email: "mehmet@example.com",
      joinDate: "2024-02-14",
      status: "pending",
      recipes: 0,
      avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=50&h=50&fit=crop"
    }
  ];

  const pendingRecipes = [
    {
      id: 1,
      title: "Ev Yapımı Mantı",
      author: "Chef Ayşe",
      submittedDate: "2024-02-15",
      category: "Ana Yemek",
      status: "pending",
      views: 0
    },
    {
      id: 2,
      title: "Çikolatalı Sufle",
      author: "Pasta Şefi",
      submittedDate: "2024-02-14",
      category: "Tatlı",
      status: "pending",
      views: 0
    }
  ];

  const reportedContent = [
    {
      id: 1,
      type: "recipe",
      title: "Şüpheli Tarif İçeriği",
      reportedBy: "Kullanıcı123",
      reason: "Uygunsuz içerik",
      date: "2024-02-15",
      status: "pending"
    },
    {
      id: 2,
      type: "comment",
      title: "Spam Yorum",
      reportedBy: "ModeratorUser",
      reason: "Spam",
      date: "2024-02-14",
      status: "reviewing"
    }
  ];

  const systemHealth = {
    serverStatus: "online",
    databaseStatus: "online",
    apiResponseTime: "124ms",
    uptime: "99.9%",
    activeConnections: 1247,
    memoryUsage: 68,
    cpuUsage: 45,
    diskUsage: 32
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Admin Header */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Ne Yesek AI - Admin Panel</h1>
              <p className="text-gray-600">Sistem yönetimi ve kontrol paneli</p>
            </div>
            <div className="flex items-center gap-4">
              <Button variant="outline" size="sm">
                <Bell className="h-4 w-4 mr-2" />
                Bildirimler (3)
              </Button>
              <Button variant="outline" size="sm">
                <Download className="h-4 w-4 mr-2" />
                Rapor İndir
              </Button>
              <Avatar className="w-8 h-8">
                <AvatarImage src="https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=50&h=50&fit=crop" />
                <AvatarFallback>AD</AvatarFallback>
              </Avatar>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-8">
        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <TabsList className="grid w-full grid-cols-8">
            <TabsTrigger value="dashboard">Dashboard</TabsTrigger>
            <TabsTrigger value="users">Kullanıcılar</TabsTrigger>
            <TabsTrigger value="recipes">Tarifler</TabsTrigger>
            <TabsTrigger value="content">İçerik</TabsTrigger>
            <TabsTrigger value="revenue">Gelirler</TabsTrigger>
            <TabsTrigger value="reports">Raporlar</TabsTrigger>
            <TabsTrigger value="system">Sistem</TabsTrigger>
            <TabsTrigger value="settings">Ayarlar</TabsTrigger>
          </TabsList>

          {/* Dashboard Tab */}
          <TabsContent value="dashboard" className="space-y-6">
            {/* Key Metrics */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-gray-600">Toplam Kullanıcı</p>
                      <p className="text-3xl font-bold text-gray-900">{stats.totalUsers.toLocaleString()}</p>
                    </div>
                    <Users className="h-8 w-8 text-blue-500" />
                  </div>
                  <div className="mt-4 flex items-center text-sm">
                    <TrendingUp className="h-4 w-4 text-green-500 mr-1" />
                    <span className="text-green-600">+{stats.monthlyGrowth}%</span>
                    <span className="text-gray-500 ml-1">bu ay</span>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-gray-600">Toplam Tarif</p>
                      <p className="text-3xl font-bold text-gray-900">{stats.totalRecipes.toLocaleString()}</p>
                    </div>
                    <ChefHat className="h-8 w-8 text-orange-500" />
                  </div>
                  <div className="mt-4 flex items-center text-sm">
                    <span className="text-blue-600">{stats.pendingReviews}</span>
                    <span className="text-gray-500 ml-1">onay bekliyor</span>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-gray-600">Aylık Gelir</p>
                      <p className="text-3xl font-bold text-gray-900">₺{stats.totalRevenue.toLocaleString()}</p>
                    </div>
                    <DollarSign className="h-8 w-8 text-green-500" />
                  </div>
                  <div className="mt-4 flex items-center text-sm">
                    <TrendingUp className="h-4 w-4 text-green-500 mr-1" />
                    <span className="text-green-600">+12.5%</span>
                    <span className="text-gray-500 ml-1">geçen aya göre</span>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-gray-600">Aktif Kullanıcı</p>
                      <p className="text-3xl font-bold text-gray-900">{stats.activeUsers.toLocaleString()}</p>
                    </div>
                    <Eye className="h-8 w-8 text-purple-500" />
                  </div>
                  <div className="mt-4 flex items-center text-sm">
                    <span className="text-gray-500">şu anda çevrimiçi</span>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Charts and Analytics */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle>Haftalık Kullanıcı Aktivitesi</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="h-64 bg-gray-100 rounded-lg flex items-center justify-center">
                    <BarChart3 className="h-16 w-16 text-gray-400" />
                    <p className="text-gray-500 ml-4">Grafik Yükleniyor...</p>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Gelir Analizi</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="h-64 bg-gray-100 rounded-lg flex items-center justify-center">
                    <TrendingUp className="h-16 w-16 text-gray-400" />
                    <p className="text-gray-500 ml-4">Grafik Yükleniyor...</p>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Quick Actions */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <AlertTriangle className="h-5 w-5 text-orange-500" />
                    Bekleyen İşlemler
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="flex justify-between items-center">
                    <span className="text-sm">Tarif Onayları</span>
                    <Badge variant="secondary">{stats.pendingReviews}</Badge>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm">Şikayet Edilenler</span>
                    <Badge variant="destructive">{stats.reportedContent}</Badge>
                  </div>
                  <Button className="w-full mt-4" variant="outline">
                    Tümünü Görüntüle
                  </Button>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Shield className="h-5 w-5 text-blue-500" />
                    Sistem Durumu
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="flex justify-between items-center">
                    <span className="text-sm">Server</span>
                    <Badge className="bg-green-100 text-green-800">Çevrimiçi</Badge>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm">Veritabanı</span>
                    <Badge className="bg-green-100 text-green-800">Normal</Badge>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm">Uptime</span>
                    <span className="text-sm font-medium">{systemHealth.uptime}</span>
                  </div>
                  <Button className="w-full mt-4" variant="outline">
                    Detayları Görüntüle
                  </Button>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Calendar className="h-5 w-5 text-purple-500" />
                    Bugün Yapılacaklar
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="text-sm space-y-2">
                    <div className="flex items-center gap-2">
                      <input type="checkbox" className="rounded" />
                      <span>Haftalık rapor hazırla</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <input type="checkbox" className="rounded" />
                      <span>Yeni kullanıcı onayları</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <input type="checkbox" className="rounded" />
                      <span>Sistem backup kontrolü</span>
                    </div>
                  </div>
                  <Button className="w-full mt-4" variant="outline">
                    Görev Ekle
                  </Button>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* Users Tab */}
          <TabsContent value="users" className="space-y-6">
            <div className="flex justify-between items-center">
              <h2 className="text-2xl font-bold text-gray-900">Kullanıcı Yönetimi</h2>
              <div className="flex gap-2">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                  <input
                    type="text"
                    placeholder="Kullanıcı ara..."
                    className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg"
                  />
                </div>
                <Button variant="outline">
                  <Filter className="h-4 w-4 mr-2" />
                  Filtrele
                </Button>
                <Button className="gradient-primary text-white">
                  <Upload className="h-4 w-4 mr-2" />
                  Toplu İşlem
                </Button>
              </div>
            </div>

            <Card>
              <CardContent className="p-0">
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Kullanıcı</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Kayıt Tarihi</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Tarif Sayısı</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Durum</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">İşlemler</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-200">
                      {recentUsers.map((user) => (
                        <tr key={user.id}>
                          <td className="px-6 py-4">
                            <div className="flex items-center gap-3">
                              <Avatar className="w-8 h-8">
                                <AvatarImage src={user.avatar} />
                                <AvatarFallback>{user.name[0]}</AvatarFallback>
                              </Avatar>
                              <div>
                                <p className="font-medium text-gray-900">{user.name}</p>
                                <p className="text-sm text-gray-500">{user.email}</p>
                              </div>
                            </div>
                          </td>
                          <td className="px-6 py-4 text-sm text-gray-500">{user.joinDate}</td>
                          <td className="px-6 py-4 text-sm text-gray-900">{user.recipes}</td>
                          <td className="px-6 py-4">
                            <Badge className={user.status === 'active' ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'}>
                              {user.status === 'active' ? 'Aktif' : 'Beklemede'}
                            </Badge>
                          </td>
                          <td className="px-6 py-4">
                            <div className="flex gap-2">
                              <Button size="sm" variant="outline">Görüntüle</Button>
                              <Button size="sm" variant="outline">Düzenle</Button>
                              <Button size="sm" variant="destructive">Engelle</Button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* System Tab */}
          <TabsContent value="system" className="space-y-6">
            <h2 className="text-2xl font-bold text-gray-900">Sistem Monitoring</h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="font-medium text-gray-900">CPU Kullanımı</h3>
                    <Badge className="bg-blue-100 text-blue-800">{systemHealth.cpuUsage}%</Badge>
                  </div>
                  <Progress value={systemHealth.cpuUsage} className="h-2" />
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="font-medium text-gray-900">Bellek Kullanımı</h3>
                    <Badge className="bg-yellow-100 text-yellow-800">{systemHealth.memoryUsage}%</Badge>
                  </div>
                  <Progress value={systemHealth.memoryUsage} className="h-2" />
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="font-medium text-gray-900">Disk Kullanımı</h3>
                    <Badge className="bg-green-100 text-green-800">{systemHealth.diskUsage}%</Badge>
                  </div>
                  <Progress value={systemHealth.diskUsage} className="h-2" />
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="font-medium text-gray-900">Aktif Bağlantı</h3>
                    <Badge className="bg-purple-100 text-purple-800">{systemHealth.activeConnections}</Badge>
                  </div>
                  <p className="text-sm text-gray-600">Anlık kullanıcı sayısı</p>
                </CardContent>
              </Card>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle>Sistem Servisleri</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="flex justify-between items-center">
                    <span>Web Server</span>
                    <Badge className="bg-green-100 text-green-800">Çalışıyor</Badge>
                  </div>
                  <div className="flex justify-between items-center">
                    <span>Database</span>
                    <Badge className="bg-green-100 text-green-800">Çalışıyor</Badge>
                  </div>
                  <div className="flex justify-between items-center">
                    <span>Redis Cache</span>
                    <Badge className="bg-green-100 text-green-800">Çalışıyor</Badge>
                  </div>
                  <div className="flex justify-between items-center">
                    <span>File Storage</span>
                    <Badge className="bg-green-100 text-green-800">Çalışıyor</Badge>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Son Sistem Logları</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span>Database backup completed</span>
                      <span className="text-gray-500">10:30</span>
                    </div>
                    <div className="flex justify-between">
                      <span>User authentication service restarted</span>
                      <span className="text-gray-500">09:15</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Cache cleared successfully</span>
                      <span className="text-gray-500">08:45</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default AdminPanel;
