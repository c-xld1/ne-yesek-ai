import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Shield,
  AlertTriangle,
  Lock,
  Ban,
  Eye,
  Clock,
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface SecurityEvent {
  id: string;
  event_type: "failed_login" | "suspicious_activity" | "blocked_ip" | "2fa_enabled";
  user_email?: string;
  ip_address: string;
  description: string;
  severity: "low" | "medium" | "high" | "critical";
  created_at: string;
}

interface BlockedIP {
  id: string;
  ip_address: string;
  reason: string;
  blocked_at: string;
  blocked_until?: string;
}

const AdminSecurity = () => {
  const [events, setEvents] = useState<SecurityEvent[]>([]);
  const [blockedIPs, setBlockedIPs] = useState<BlockedIP[]>([]);
  const [newIP, setNewIP] = useState("");
  const [newReason, setNewReason] = useState("");
  const { toast } = useToast();

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    // Mock data
    setEvents([
      {
        id: "1",
        event_type: "failed_login",
        user_email: "test@example.com",
        ip_address: "192.168.1.100",
        description: "5 başarısız giriş denemesi",
        severity: "high",
        created_at: new Date().toISOString(),
      },
      {
        id: "2",
        event_type: "suspicious_activity",
        user_email: "suspicious@test.com",
        ip_address: "10.0.0.1",
        description: "Kısa sürede çok fazla istek",
        severity: "medium",
        created_at: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
      },
      {
        id: "3",
        event_type: "blocked_ip",
        ip_address: "203.0.113.0",
        description: "IP adresi engellendi",
        severity: "critical",
        created_at: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString(),
      },
    ]);

    setBlockedIPs([
      {
        id: "1",
        ip_address: "203.0.113.0",
        reason: "Spam aktivitesi",
        blocked_at: new Date().toISOString(),
      },
      {
        id: "2",
        ip_address: "198.51.100.0",
        reason: "Brute force saldırısı",
        blocked_at: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString(),
        blocked_until: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(),
      },
    ]);
  };

  const handleBlockIP = () => {
    if (!newIP) {
      toast({ title: "Hata", description: "IP adresi girin", variant: "destructive" });
      return;
    }
    toast({ title: "Başarılı", description: `${newIP} engellendi` });
    setNewIP("");
    setNewReason("");
    fetchData();
  };

  const handleUnblockIP = (id: string) => {
    toast({ title: "Başarılı", description: "IP engellemesi kaldırıldı" });
    fetchData();
  };

  const stats = {
    totalEvents: events.length,
    criticalEvents: events.filter((e) => e.severity === "critical").length,
    blockedIPs: blockedIPs.length,
    failedLogins: events.filter((e) => e.event_type === "failed_login").length,
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold">Güvenlik İzleme</h2>
          <p className="text-gray-600">Güvenlik olayları ve tehdit tespiti</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Toplam Olay</p>
                <p className="text-2xl font-bold text-blue-600">{stats.totalEvents}</p>
              </div>
              <Shield className="h-8 w-8 text-blue-500" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Kritik Olay</p>
                <p className="text-2xl font-bold text-red-600">{stats.criticalEvents}</p>
              </div>
              <AlertTriangle className="h-8 w-8 text-red-500" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Engelli IP</p>
                <p className="text-2xl font-bold text-orange-600">{stats.blockedIPs}</p>
              </div>
              <Ban className="h-8 w-8 text-orange-500" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Başarısız Giriş</p>
                <p className="text-2xl font-bold text-purple-600">{stats.failedLogins}</p>
              </div>
              <Lock className="h-8 w-8 text-purple-500" />
            </div>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="events" className="w-full">
        <TabsList>
          <TabsTrigger value="events">Güvenlik Olayları</TabsTrigger>
          <TabsTrigger value="blocked">Engelli IP'ler</TabsTrigger>
        </TabsList>

        <TabsContent value="events">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Eye className="h-5 w-5" />
                Güvenlik Olayları
              </CardTitle>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Olay</TableHead>
                    <TableHead>Kullanıcı</TableHead>
                    <TableHead>IP Adresi</TableHead>
                    <TableHead>Açıklama</TableHead>
                    <TableHead>Tarih</TableHead>
                    <TableHead>Önem</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {events.map((event) => (
                    <TableRow key={event.id}>
                      <TableCell>
                        <Badge variant="outline">
                          {event.event_type === "failed_login"
                            ? "Başarısız Giriş"
                            : event.event_type === "suspicious_activity"
                            ? "Şüpheli Aktivite"
                            : event.event_type === "blocked_ip"
                            ? "IP Engellendi"
                            : "2FA Etkin"}
                        </Badge>
                      </TableCell>
                      <TableCell>{event.user_email || "-"}</TableCell>
                      <TableCell className="font-mono text-sm">
                        {event.ip_address}
                      </TableCell>
                      <TableCell>{event.description}</TableCell>
                      <TableCell>
                        {new Date(event.created_at).toLocaleDateString("tr-TR", {
                          day: "2-digit",
                          month: "short",
                          hour: "2-digit",
                          minute: "2-digit",
                        })}
                      </TableCell>
                      <TableCell>
                        <Badge
                          className={
                            event.severity === "critical"
                              ? "bg-red-100 text-red-700"
                              : event.severity === "high"
                              ? "bg-orange-100 text-orange-700"
                              : event.severity === "medium"
                              ? "bg-yellow-100 text-yellow-700"
                              : "bg-blue-100 text-blue-700"
                          }
                        >
                          {event.severity === "critical"
                            ? "Kritik"
                            : event.severity === "high"
                            ? "Yüksek"
                            : event.severity === "medium"
                            ? "Orta"
                            : "Düşük"}
                        </Badge>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="blocked">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Ban className="h-5 w-5" />
                Engelli IP Adresleri
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="mb-6 p-4 border rounded-lg">
                <h3 className="font-semibold mb-3">Yeni IP Engelle</h3>
                <div className="flex gap-2">
                  <Input
                    placeholder="IP Adresi (örn: 192.168.1.1)"
                    value={newIP}
                    onChange={(e) => setNewIP(e.target.value)}
                  />
                  <Input
                    placeholder="Sebep"
                    value={newReason}
                    onChange={(e) => setNewReason(e.target.value)}
                  />
                  <Button onClick={handleBlockIP}>
                    <Ban className="h-4 w-4 mr-2" />
                    Engelle
                  </Button>
                </div>
              </div>

              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>IP Adresi</TableHead>
                    <TableHead>Sebep</TableHead>
                    <TableHead>Engellenme Tarihi</TableHead>
                    <TableHead>Bitiş Tarihi</TableHead>
                    <TableHead className="text-right">İşlemler</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {blockedIPs.map((ip) => (
                    <TableRow key={ip.id}>
                      <TableCell className="font-mono font-semibold">
                        {ip.ip_address}
                      </TableCell>
                      <TableCell>{ip.reason}</TableCell>
                      <TableCell>
                        {new Date(ip.blocked_at).toLocaleDateString("tr-TR")}
                      </TableCell>
                      <TableCell>
                        {ip.blocked_until ? (
                          new Date(ip.blocked_until).toLocaleDateString("tr-TR")
                        ) : (
                          <Badge variant="secondary">Kalıcı</Badge>
                        )}
                      </TableCell>
                      <TableCell className="text-right">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleUnblockIP(ip.id)}
                        >
                          Engeli Kaldır
                        </Button>
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

export default AdminSecurity;
