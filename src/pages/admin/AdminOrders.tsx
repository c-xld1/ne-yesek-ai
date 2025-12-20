import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
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
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";
import { ShoppingBag, Calendar, DollarSign, Eye, CheckCircle, Clock, Truck, Package } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import LoadingSpinner from "@/components/LoadingSpinner";
import { logActivity } from "@/hooks/useActivityLogs";

interface Order {
  id: string;
  customer_id: string;
  chef_id: string;
  total_amount: number;
  status: string;
  delivery_type: string;
  created_at: string;
  profiles?: {
    username?: string;
    fullname?: string;
  };
}

const AdminOrders = () => {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [dateFilter, setDateFilter] = useState<"all" | "today" | "week" | "month">("all");
  const [viewingOrder, setViewingOrder] = useState<Order | null>(null);
  const { toast } = useToast();

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    try {
      const { data, error } = await supabase
        .from("orders")
        .select("*")
        .order("created_at", { ascending: false })
        .limit(100);

      if (error) throw error;

      // Fetch customer profiles separately
      const customerIds = [...new Set(data?.map((o) => o.customer_id).filter(Boolean))];
      const { data: profiles } = await supabase
        .from("profiles")
        .select("id, username, fullname")
        .in("id", customerIds);

      // Merge data
      const ordersWithProfiles = data?.map((order: any) => {
        const profile = profiles?.find((p) => p.id === order.customer_id);
        return {
          ...order,
          profiles: profile ? { username: profile.username, fullname: profile.fullname } : undefined,
        };
      });

      setOrders(ordersWithProfiles || []);
    } catch (error) {
      console.error("Error fetching orders:", error);
      toast({
        title: "Hata",
        description: "Siparişler yüklenirken bir hata oluştu.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleStatusChange = async (orderId: string, newStatus: string) => {
    try {
      const { error } = await supabase
        .from("orders")
        .update({ status: newStatus })
        .eq("id", orderId);

      if (error) throw error;

      await logActivity("update_status", "order", orderId, { newStatus });

      toast({
        title: "Başarılı",
        description: "Sipariş durumu güncellendi.",
      });

      fetchOrders();
    } catch (error: any) {
      console.error("Error updating status:", error);
      toast({
        title: "Hata",
        description: error.message || "Durum güncellenirken bir hata oluştu.",
        variant: "destructive",
      });
    }
  };

  const statusColors: Record<string, string> = {
    pending: "bg-yellow-100 text-yellow-700",
    confirmed: "bg-blue-100 text-blue-700",
    preparing: "bg-purple-100 text-purple-700",
    ready: "bg-green-100 text-green-700",
    delivered: "bg-gray-100 text-gray-700",
    cancelled: "bg-red-100 text-red-700",
  };

  const statusLabels: Record<string, string> = {
    pending: "Bekliyor",
    confirmed: "Onaylandı",
    preparing: "Hazırlanıyor",
    ready: "Hazır",
    delivered: "Teslim Edildi",
    cancelled: "İptal Edildi",
  };

  const filteredOrders = orders.filter((order) => {
    const matchesStatus = statusFilter === "all" || order.status === statusFilter;
    
    const matchesDate = () => {
      if (dateFilter === "all") return true;
      const orderDate = new Date(order.created_at);
      const now = new Date();
      if (dateFilter === "today") return orderDate.toDateString() === now.toDateString();
      if (dateFilter === "week") {
        const weekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
        return orderDate >= weekAgo;
      }
      if (dateFilter === "month") {
        const monthAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
        return orderDate >= monthAgo;
      }
      return true;
    };
    
    return matchesStatus && matchesDate();
  });

  const stats = {
    total: orders.length,
    filtered: filteredOrders.length,
    pending: orders.filter(o => o.status === "pending").length,
    confirmed: orders.filter(o => o.status === "confirmed").length,
    preparing: orders.filter(o => o.status === "preparing").length,
    ready: orders.filter(o => o.status === "ready").length,
    delivered: orders.filter(o => o.status === "delivered").length,
    cancelled: orders.filter(o => o.status === "cancelled").length,
    totalRevenue: orders
      .filter(o => o.status === "delivered")
      .reduce((sum, o) => sum + (o.total_amount || 0), 0),
    todayRevenue: orders
      .filter(o => {
        const orderDate = new Date(o.created_at);
        const today = new Date();
        return o.status === "delivered" && orderDate.toDateString() === today.toDateString();
      })
      .reduce((sum, o) => sum + (o.total_amount || 0), 0),
    weekRevenue: orders
      .filter(o => {
        const orderDate = new Date(o.created_at);
        const weekAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000);
        return o.status === "delivered" && orderDate >= weekAgo;
      })
      .reduce((sum, o) => sum + (o.total_amount || 0), 0)
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-96">
        <LoadingSpinner text="Siparişler yükleniyor..." />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Sipariş Yönetimi</h2>
          <p className="text-gray-600">
            {stats.filtered} / {stats.total} sipariş gösteriliyor • {stats.pending} bekliyor
          </p>
        </div>
      </div>

      {/* Revenue Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Bugün</p>
                <p className="text-2xl font-bold text-green-600">
                  ₺{stats.todayRevenue.toLocaleString('tr-TR', { minimumFractionDigits: 2 })}
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
                <p className="text-sm font-medium text-gray-600">Bu Hafta</p>
                <p className="text-2xl font-bold text-blue-600">
                  ₺{stats.weekRevenue.toLocaleString('tr-TR', { minimumFractionDigits: 2 })}
                </p>
              </div>
              <Calendar className="h-8 w-8 text-blue-500" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Toplam Gelir</p>
                <p className="text-2xl font-bold text-purple-600">
                  ₺{stats.totalRevenue.toLocaleString('tr-TR', { minimumFractionDigits: 2 })}
                </p>
              </div>
              <ShoppingBag className="h-8 w-8 text-purple-500" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Teslim Edildi</p>
                <p className="text-2xl font-bold text-gray-600">{stats.delivered}</p>
              </div>
              <CheckCircle className="h-8 w-8 text-gray-500" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Status Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
        <Card>
          <CardContent className="pt-6">
            <div className="text-center">
              <p className="text-sm text-gray-600">Bekleyen</p>
              <p className="text-2xl font-bold text-yellow-600">{stats.pending}</p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="text-center">
              <p className="text-sm text-gray-600">Onaylandı</p>
              <p className="text-2xl font-bold text-blue-600">{stats.confirmed}</p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="text-center">
              <p className="text-sm text-gray-600">Hazırlanıyor</p>
              <p className="text-2xl font-bold text-purple-600">{stats.preparing}</p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="text-center">
              <p className="text-sm text-gray-600">Hazır</p>
              <p className="text-2xl font-bold text-green-600">{stats.ready}</p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="text-center">
              <p className="text-sm text-gray-600">İptal Edildi</p>
              <p className="text-2xl font-bold text-red-600">{stats.cancelled}</p>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Filters */}
      <Card>
        <CardContent className="pt-6">
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
                variant={statusFilter === "pending" ? "default" : "outline"}
                size="sm"
                onClick={() => setStatusFilter("pending")}
              >
                <Clock className="h-4 w-4 mr-1" />
                Bekleyen ({stats.pending})
              </Button>
              <Button
                variant={statusFilter === "preparing" ? "default" : "outline"}
                size="sm"
                onClick={() => setStatusFilter("preparing")}
              >
                <Package className="h-4 w-4 mr-1" />
                Hazırlanıyor ({stats.preparing})
              </Button>
              <Button
                variant={statusFilter === "ready" ? "default" : "outline"}
                size="sm"
                onClick={() => setStatusFilter("ready")}
              >
                <CheckCircle className="h-4 w-4 mr-1" />
                Hazır ({stats.ready})
              </Button>
              <Button
                variant={statusFilter === "delivered" ? "default" : "outline"}
                size="sm"
                onClick={() => setStatusFilter("delivered")}
              >
                <Truck className="h-4 w-4 mr-1" />
                Teslim ({stats.delivered})
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
          </div>
        </CardContent>
      </Card>

      {/* Orders Table */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <ShoppingBag className="h-5 w-5" />
            Sipariş Listesi
          </CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Sipariş No</TableHead>
                <TableHead>Müşteri</TableHead>
                <TableHead>Tutar</TableHead>
                <TableHead>Teslimat</TableHead>
                <TableHead>Durum</TableHead>
                <TableHead>Tarih</TableHead>
                <TableHead className="text-right">İşlemler</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {orders.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={7} className="text-center text-gray-500 py-8">
                    Sipariş bulunamadı
                  </TableCell>
                </TableRow>
              ) : (
                filteredOrders.map((order) => (
                  <TableRow key={order.id}>
                    <TableCell className="font-mono text-sm">
                      #{order.id.substring(0, 8)}
                    </TableCell>
                    <TableCell>
                      <div>
                        <p className="font-medium text-gray-900">
                          {order.profiles?.fullname || "İsimsiz"}
                        </p>
                        <p className="text-sm text-gray-500">@{order.profiles?.username}</p>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-1 font-medium text-gray-900">
                        <DollarSign className="h-4 w-4" />
                        ₺{order.total_amount?.toLocaleString() || 0}
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge variant="outline">
                        {order.delivery_type === "instant" ? "Hızlı" : "Randevulu"}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <Badge
                        variant="secondary"
                        className={statusColors[order.status] || "bg-gray-100 text-gray-700"}
                      >
                        {statusLabels[order.status] || order.status}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2 text-gray-600">
                        <Calendar className="h-4 w-4" />
                        {new Date(order.created_at).toLocaleDateString("tr-TR")}
                      </div>
                    </TableCell>
                    <TableCell className="text-right">
                      <Select
                        value={order.status}
                        onValueChange={(value) => handleStatusChange(order.id, value)}
                      >
                        <SelectTrigger className="w-[140px]">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="pending">Bekliyor</SelectItem>
                          <SelectItem value="confirmed">Onaylandı</SelectItem>
                          <SelectItem value="preparing">Hazırlanıyor</SelectItem>
                          <SelectItem value="ready">Hazır</SelectItem>
                          <SelectItem value="delivered">Teslim Edildi</SelectItem>
                          <SelectItem value="cancelled">İptal Edildi</SelectItem>
                        </SelectContent>
                      </Select>
                    </TableCell>
                    <TableCell className="text-right">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => setViewingOrder(order)}
                      >
                        <Eye className="h-4 w-4 mr-2" />
                        Detaylar
                      </Button>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* Order Details Dialog */}
      <Dialog open={!!viewingOrder} onOpenChange={() => setViewingOrder(null)}>
        <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Sipariş Detayları</DialogTitle>
            <DialogDescription>
              Sipariş No: #{viewingOrder?.id.substring(0, 8)}
            </DialogDescription>
          </DialogHeader>
          {viewingOrder && (
            <div className="space-y-6">
              {/* Order Timeline */}
              <div className="border-l-2 border-gray-200 pl-4 space-y-4">
                <div className="relative">
                  <div className={`absolute -left-6 w-4 h-4 rounded-full ${
                    viewingOrder.status === "pending" ? "bg-yellow-500" : "bg-gray-300"
                  }`} />
                  <div>
                    <p className="font-semibold">Sipariş Alındı</p>
                    <p className="text-sm text-gray-500">
                      {new Date(viewingOrder.created_at).toLocaleString("tr-TR")}
                    </p>
                  </div>
                </div>
                <div className="relative">
                  <div className={`absolute -left-6 w-4 h-4 rounded-full ${
                    ["confirmed", "preparing", "ready", "delivered"].includes(viewingOrder.status) 
                      ? "bg-blue-500" : "bg-gray-300"
                  }`} />
                  <div>
                    <p className="font-semibold">Onaylandı</p>
                    <p className="text-sm text-gray-500">
                      {["confirmed", "preparing", "ready", "delivered"].includes(viewingOrder.status)
                        ? "Tamamlandı" : "Bekleniyor"}
                    </p>
                  </div>
                </div>
                <div className="relative">
                  <div className={`absolute -left-6 w-4 h-4 rounded-full ${
                    ["preparing", "ready", "delivered"].includes(viewingOrder.status)
                      ? "bg-purple-500" : "bg-gray-300"
                  }`} />
                  <div>
                    <p className="font-semibold">Hazırlanıyor</p>
                    <p className="text-sm text-gray-500">
                      {["preparing", "ready", "delivered"].includes(viewingOrder.status)
                        ? "Tamamlandı" : "Bekleniyor"}
                    </p>
                  </div>
                </div>
                <div className="relative">
                  <div className={`absolute -left-6 w-4 h-4 rounded-full ${
                    ["ready", "delivered"].includes(viewingOrder.status)
                      ? "bg-green-500" : "bg-gray-300"
                  }`} />
                  <div>
                    <p className="font-semibold">Hazır</p>
                    <p className="text-sm text-gray-500">
                      {["ready", "delivered"].includes(viewingOrder.status)
                        ? "Tamamlandı" : "Bekleniyor"}
                    </p>
                  </div>
                </div>
                <div className="relative">
                  <div className={`absolute -left-6 w-4 h-4 rounded-full ${
                    viewingOrder.status === "delivered" ? "bg-gray-500" : "bg-gray-300"
                  }`} />
                  <div>
                    <p className="font-semibold">Teslim Edildi</p>
                    <p className="text-sm text-gray-500">
                      {viewingOrder.status === "delivered" ? "Tamamlandı" : "Bekleniyor"}
                    </p>
                  </div>
                </div>
              </div>

              {/* Order Info */}
              <div className="border-t pt-4">
                <h3 className="font-semibold mb-3">Sipariş Bilgileri</h3>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-sm font-medium text-gray-600">Müşteri</label>
                    <p className="text-base">
                      {viewingOrder.profiles?.fullname || "İsimsiz"}
                      <span className="text-gray-500 text-sm ml-2">
                        @{viewingOrder.profiles?.username}
                      </span>
                    </p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-600">Toplam Tutar</label>
                    <p className="text-base font-semibold text-green-600">
                      ₺{viewingOrder.total_amount?.toLocaleString('tr-TR', { minimumFractionDigits: 2 })}
                    </p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-600">Teslimat Türü</label>
                    <p className="text-base">
                      {viewingOrder.delivery_type === "instant" ? "Hızlı Teslimat" : "Randevulu Teslimat"}
                    </p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-600">Durum</label>
                    <Badge className={statusColors[viewingOrder.status]}>
                      {statusLabels[viewingOrder.status]}
                    </Badge>
                  </div>
                </div>
              </div>

              {/* Payment Status */}
              <div className="border-t pt-4">
                <h3 className="font-semibold mb-3">Ödeme Durumu</h3>
                <div className="flex items-center gap-2">
                  <CheckCircle className="h-5 w-5 text-green-500" />
                  <span className="text-sm">Ödeme Tamamlandı</span>
                </div>
              </div>

              {/* Admin Notes */}
              <div className="border-t pt-4">
                <h3 className="font-semibold mb-2">Admin Notları</h3>
                <Textarea
                  placeholder="Sipariş hakkında notlar ekleyin..."
                  rows={3}
                  className="mb-2"
                />
                <Button size="sm">Not Kaydet</Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default AdminOrders;
