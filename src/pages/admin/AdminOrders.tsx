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
import { ShoppingBag, Calendar, DollarSign } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import LoadingSpinner from "@/components/LoadingSpinner";

interface Order {
  id: string;
  customer_id: string;
  chef_id: string;
  total_amount: number;
  status: string;
  delivery_type: string;
  created_at: string;
  profiles?: {
    username: string;
    fullname: string;
  };
}

const AdminOrders = () => {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    try {
      const { data, error } = await supabase
        .from("orders")
        .select(`
          *,
          profiles!orders_customer_id_fkey(username, fullname)
        `)
        .order("created_at", { ascending: false })
        .limit(100);

      if (error) throw error;
      setOrders(data || []);
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
          <p className="text-gray-600">Toplam {orders.length} sipariş</p>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="pt-6">
            <div className="text-center">
              <p className="text-sm text-gray-600">Bekleyen</p>
              <p className="text-2xl font-bold text-yellow-600">
                {orders.filter((o) => o.status === "pending").length}
              </p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="text-center">
              <p className="text-sm text-gray-600">Hazırlanıyor</p>
              <p className="text-2xl font-bold text-purple-600">
                {orders.filter((o) => o.status === "preparing").length}
              </p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="text-center">
              <p className="text-sm text-gray-600">Tamamlanan</p>
              <p className="text-2xl font-bold text-green-600">
                {orders.filter((o) => o.status === "delivered").length}
              </p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="text-center">
              <p className="text-sm text-gray-600">Toplam Ciro</p>
              <p className="text-2xl font-bold text-blue-600">
                ₺{orders.reduce((sum, o) => sum + (o.total_amount || 0), 0).toLocaleString()}
              </p>
            </div>
          </CardContent>
        </Card>
      </div>

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
                orders.map((order) => (
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

export default AdminOrders;
