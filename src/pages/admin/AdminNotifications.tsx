import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
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
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Bell, Plus, Send, Clock, CheckCircle, Users, Mail } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import LoadingSpinner from "@/components/LoadingSpinner";

interface NotificationTemplate {
  id: string;
  title: string;
  body: string;
  type: "info" | "success" | "warning" | "error";
  target_audience: "all" | "users" | "chefs" | "premium";
  created_at: string;
}

interface NotificationHistory {
  id: string;
  title: string;
  body: string;
  sent_to: number;
  delivered: number;
  opened: number;
  clicked: number;
  sent_at: string;
  status: "sending" | "sent" | "failed";
}

const AdminNotifications = () => {
  const [templates, setTemplates] = useState<NotificationTemplate[]>([]);
  const [history, setHistory] = useState<NotificationHistory[]>([]);
  const [loading, setLoading] = useState(false);
  const [dialogOpen, setDialogOpen] = useState(false);
  const { toast } = useToast();

  const [notificationForm, setNotificationForm] = useState({
    title: "",
    body: "",
    type: "info" as const,
    target_audience: "all" as const,
    schedule_time: "",
  });

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    // Mock data - replace with real Supabase queries when tables are created
    setTemplates([
      {
        id: "1",
        title: "Yeni Tarif Bildirimi",
        body: "{{chef_name}} yeni bir tarif paylaştı: {{recipe_title}}",
        type: "info",
        target_audience: "all",
        created_at: new Date().toISOString(),
      },
      {
        id: "2",
        title: "Sipariş Onayı",
        body: "Siparişiniz onaylandı ve hazırlanıyor. Sipariş No: {{order_id}}",
        type: "success",
        target_audience: "users",
        created_at: new Date().toISOString(),
      },
      {
        id: "3",
        title: "Premium Hatırlatması",
        body: "Premium üyeliğiniz {{days}} gün içinde sona erecek!",
        type: "warning",
        target_audience: "premium",
        created_at: new Date().toISOString(),
      },
    ]);

    setHistory([
      {
        id: "1",
        title: "Yeni Özellikler!",
        body: "Artık AI ile tarif önerisi alabilirsiniz",
        sent_to: 5234,
        delivered: 5180,
        opened: 3421,
        clicked: 1876,
        sent_at: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
        status: "sent",
      },
      {
        id: "2",
        title: "Haftalık İndirim",
        body: "HAFTA20 kodu ile %20 indirim",
        sent_to: 2891,
        delivered: 2870,
        opened: 1923,
        clicked: 1245,
        sent_at: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(),
        status: "sent",
      },
    ]);
  };

  const handleSendNotification = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    // Simulate sending notification
    setTimeout(() => {
      toast({
        title: "Başarılı",
        description: notificationForm.schedule_time
          ? "Bildirim planlandı"
          : "Bildirim gönderildi",
      });
      setLoading(false);
      setDialogOpen(false);
      resetForm();
      fetchData();
    }, 2000);
  };

  const resetForm = () => {
    setNotificationForm({
      title: "",
      body: "",
      type: "info",
      target_audience: "all",
      schedule_time: "",
    });
  };

  const stats = {
    totalSent: history.reduce((sum, h) => sum + h.sent_to, 0),
    totalDelivered: history.reduce((sum, h) => sum + h.delivered, 0),
    totalOpened: history.reduce((sum, h) => sum + h.opened, 0),
    totalClicked: history.reduce((sum, h) => sum + h.clicked, 0),
    openRate: history.length > 0
      ? Math.round(
          (history.reduce((sum, h) => sum + h.opened, 0) /
            history.reduce((sum, h) => sum + h.delivered, 0)) *
            100
        )
      : 0,
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Bildirim Yönetimi</h2>
          <p className="text-gray-600">Push notification ve e-posta kampanyaları</p>
        </div>
        <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="h-4 w-4 mr-2" />
              Yeni Bildirim Gönder
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>Yeni Bildirim Gönder</DialogTitle>
              <DialogDescription>
                Hedef kitleyi seçin ve bildirim içeriğini yazın
              </DialogDescription>
            </DialogHeader>
            <form onSubmit={handleSendNotification} className="space-y-4">
              <div>
                <Label htmlFor="title">Başlık *</Label>
                <Input
                  id="title"
                  value={notificationForm.title}
                  onChange={(e) =>
                    setNotificationForm({ ...notificationForm, title: e.target.value })
                  }
                  placeholder="Bildirim başlığı"
                  required
                />
              </div>

              <div>
                <Label htmlFor="body">Mesaj *</Label>
                <Textarea
                  id="body"
                  value={notificationForm.body}
                  onChange={(e) =>
                    setNotificationForm({ ...notificationForm, body: e.target.value })
                  }
                  placeholder="Bildirim içeriği"
                  rows={4}
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="type">Bildirim Tipi</Label>
                  <Select
                    value={notificationForm.type}
                    onValueChange={(value: any) =>
                      setNotificationForm({ ...notificationForm, type: value })
                    }
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="info">Bilgi</SelectItem>
                      <SelectItem value="success">Başarı</SelectItem>
                      <SelectItem value="warning">Uyarı</SelectItem>
                      <SelectItem value="error">Hata</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label htmlFor="target">Hedef Kitle *</Label>
                  <Select
                    value={notificationForm.target_audience}
                    onValueChange={(value: any) =>
                      setNotificationForm({ ...notificationForm, target_audience: value })
                    }
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">Tüm Kullanıcılar</SelectItem>
                      <SelectItem value="users">Sadece Kullanıcılar</SelectItem>
                      <SelectItem value="chefs">Sadece Şefler</SelectItem>
                      <SelectItem value="premium">Premium Üyeler</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div>
                <Label htmlFor="schedule_time">Planlama (Opsiyonel)</Label>
                <Input
                  id="schedule_time"
                  type="datetime-local"
                  value={notificationForm.schedule_time}
                  onChange={(e) =>
                    setNotificationForm({
                      ...notificationForm,
                      schedule_time: e.target.value,
                    })
                  }
                />
                <p className="text-xs text-gray-500 mt-1">
                  Boş bırakırsanız hemen gönderilir
                </p>
              </div>

              <DialogFooter>
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setDialogOpen(false)}
                >
                  İptal
                </Button>
                <Button type="submit" disabled={loading}>
                  {loading ? (
                    <>
                      <LoadingSpinner />
                      Gönderiliyor...
                    </>
                  ) : (
                    <>
                      <Send className="h-4 w-4 mr-2" />
                      {notificationForm.schedule_time ? "Planla" : "Gönder"}
                    </>
                  )}
                </Button>
              </DialogFooter>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      {/* Statistics */}
      <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Toplam Gönderim</p>
                <p className="text-2xl font-bold text-blue-600">{stats.totalSent}</p>
              </div>
              <Send className="h-8 w-8 text-blue-500" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Teslim Edildi</p>
                <p className="text-2xl font-bold text-green-600">{stats.totalDelivered}</p>
              </div>
              <CheckCircle className="h-8 w-8 text-green-500" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Açıldı</p>
                <p className="text-2xl font-bold text-purple-600">{stats.totalOpened}</p>
              </div>
              <Mail className="h-8 w-8 text-purple-500" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Tıklandı</p>
                <p className="text-2xl font-bold text-orange-600">{stats.totalClicked}</p>
              </div>
              <Users className="h-8 w-8 text-orange-500" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Açılma Oranı</p>
                <p className="text-2xl font-bold text-indigo-600">{stats.openRate}%</p>
              </div>
              <Bell className="h-8 w-8 text-indigo-500" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Tabs */}
      <Tabs defaultValue="history" className="w-full">
        <TabsList>
          <TabsTrigger value="history">Gönderim Geçmişi</TabsTrigger>
          <TabsTrigger value="templates">Şablonlar</TabsTrigger>
        </TabsList>

        <TabsContent value="history">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Clock className="h-5 w-5" />
                Bildirim Geçmişi
              </CardTitle>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Başlık</TableHead>
                    <TableHead>Gönderildi</TableHead>
                    <TableHead>Teslim</TableHead>
                    <TableHead>Açıldı</TableHead>
                    <TableHead>Tıklandı</TableHead>
                    <TableHead>Tarih</TableHead>
                    <TableHead>Durum</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {history.map((item) => (
                    <TableRow key={item.id}>
                      <TableCell>
                        <div>
                          <p className="font-medium">{item.title}</p>
                          <p className="text-sm text-gray-500 truncate max-w-xs">
                            {item.body}
                          </p>
                        </div>
                      </TableCell>
                      <TableCell>{item.sent_to.toLocaleString()}</TableCell>
                      <TableCell>
                        {item.delivered.toLocaleString()}
                        <span className="text-xs text-gray-500 ml-1">
                          ({Math.round((item.delivered / item.sent_to) * 100)}%)
                        </span>
                      </TableCell>
                      <TableCell>
                        {item.opened.toLocaleString()}
                        <span className="text-xs text-gray-500 ml-1">
                          ({Math.round((item.opened / item.delivered) * 100)}%)
                        </span>
                      </TableCell>
                      <TableCell>
                        {item.clicked.toLocaleString()}
                        <span className="text-xs text-gray-500 ml-1">
                          ({Math.round((item.clicked / item.opened) * 100)}%)
                        </span>
                      </TableCell>
                      <TableCell>
                        {new Date(item.sent_at).toLocaleDateString("tr-TR", {
                          day: "2-digit",
                          month: "short",
                          hour: "2-digit",
                          minute: "2-digit",
                        })}
                      </TableCell>
                      <TableCell>
                        <Badge
                          className={
                            item.status === "sent"
                              ? "bg-green-100 text-green-700"
                              : item.status === "sending"
                              ? "bg-blue-100 text-blue-700"
                              : "bg-red-100 text-red-700"
                          }
                        >
                          {item.status === "sent"
                            ? "Gönderildi"
                            : item.status === "sending"
                            ? "Gönderiliyor"
                            : "Başarısız"}
                        </Badge>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="templates">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Bell className="h-5 w-5" />
                Bildirim Şablonları
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {templates.map((template) => (
                  <div
                    key={template.id}
                    className="p-4 border rounded-lg hover:border-purple-300 transition-colors"
                  >
                    <div className="flex items-start justify-between gap-4">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-2">
                          <h3 className="font-semibold">{template.title}</h3>
                          <Badge
                            variant="outline"
                            className={
                              template.type === "info"
                                ? "border-blue-500 text-blue-700"
                                : template.type === "success"
                                ? "border-green-500 text-green-700"
                                : template.type === "warning"
                                ? "border-yellow-500 text-yellow-700"
                                : "border-red-500 text-red-700"
                            }
                          >
                            {template.type}
                          </Badge>
                          <Badge variant="secondary">
                            {template.target_audience === "all"
                              ? "Tümü"
                              : template.target_audience === "users"
                              ? "Kullanıcılar"
                              : template.target_audience === "chefs"
                              ? "Şefler"
                              : "Premium"}
                          </Badge>
                        </div>
                        <p className="text-sm text-gray-600">{template.body}</p>
                      </div>
                      <Button size="sm" variant="outline">
                        Kullan
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default AdminNotifications;
