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
  Database,
  Download,
  Upload,
  Clock,
  CheckCircle,
  AlertCircle,
  HardDrive,
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface Backup {
  id: string;
  filename: string;
  size: number;
  type: "manual" | "automatic";
  status: "completed" | "in_progress" | "failed";
  created_at: string;
}

const AdminBackup = () => {
  const [backups, setBackups] = useState<Backup[]>([]);
  const [loading, setLoading] = useState(false);
  const [autoBackup, setAutoBackup] = useState({
    enabled: true,
    frequency: "daily",
    time: "03:00",
    retention_days: 30,
  });
  const { toast } = useToast();

  useEffect(() => {
    fetchBackups();
  }, []);

  const fetchBackups = async () => {
    // Mock data
    setBackups([
      {
        id: "1",
        filename: "backup_2025_11_08_03_00.sql",
        size: 45678901,
        type: "automatic",
        status: "completed",
        created_at: new Date().toISOString(),
      },
      {
        id: "2",
        filename: "backup_manual_2025_11_07.sql",
        size: 44123456,
        type: "manual",
        status: "completed",
        created_at: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString(),
      },
      {
        id: "3",
        filename: "backup_2025_11_06_03_00.sql",
        size: 43987654,
        type: "automatic",
        status: "completed",
        created_at: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
      },
    ]);
  };

  const handleCreateBackup = async () => {
    setLoading(true);
    toast({ title: "Yedekleme Başlatıldı", description: "Veritabanı yedekleniyor..." });

    setTimeout(() => {
      setLoading(false);
      toast({ title: "Başarılı", description: "Yedekleme tamamlandı" });
      fetchBackups();
    }, 3000);
  };

  const handleDownload = (backup: Backup) => {
    toast({ title: "İndiriliyor", description: `${backup.filename} indiriliyor...` });
  };

  const handleRestore = (backup: Backup) => {
    if (!confirm(`${backup.filename} ile geri yüklemek istediğinizden emin misiniz? Mevcut veriler kaybolacak!`)) return;
    toast({ title: "Geri Yükleme Başlatıldı", description: "Veritabanı geri yükleniyor..." });
  };

  const handleSaveSettings = () => {
    toast({ title: "Başarılı", description: "Otomatik yedekleme ayarları kaydedildi" });
  };

  const stats = {
    total: backups.length,
    totalSize: backups.reduce((sum, b) => sum + b.size, 0),
    lastBackup: backups[0],
    successful: backups.filter((b) => b.status === "completed").length,
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold">Yedekleme Sistemi</h2>
          <p className="text-gray-600">Veritabanı yedekleme ve geri yükleme</p>
        </div>
        <Button onClick={handleCreateBackup} disabled={loading}>
          <Database className="h-4 w-4 mr-2" />
          {loading ? "Yedekleniyor..." : "Manuel Yedekle"}
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Toplam Yedek</p>
                <p className="text-2xl font-bold text-blue-600">{stats.total}</p>
              </div>
              <Database className="h-8 w-8 text-blue-500" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Toplam Boyut</p>
                <p className="text-2xl font-bold text-green-600">
                  {(stats.totalSize / 1024 / 1024).toFixed(0)} MB
                </p>
              </div>
              <HardDrive className="h-8 w-8 text-green-500" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Başarılı</p>
                <p className="text-2xl font-bold text-purple-600">{stats.successful}</p>
              </div>
              <CheckCircle className="h-8 w-8 text-purple-500" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Son Yedek</p>
                <p className="text-sm font-bold text-orange-600">
                  {stats.lastBackup
                    ? new Date(stats.lastBackup.created_at).toLocaleDateString("tr-TR")
                    : "Yok"}
                </p>
              </div>
              <Clock className="h-8 w-8 text-orange-500" />
            </div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Otomatik Yedekleme Ayarları</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="flex items-center gap-2">
              <input
                type="checkbox"
                id="auto_backup"
                checked={autoBackup.enabled}
                onChange={(e) => setAutoBackup({ ...autoBackup, enabled: e.target.checked })}
                className="h-4 w-4"
              />
              <Label htmlFor="auto_backup">Otomatik Yedeklemeyi Etkinleştir</Label>
            </div>
            <div>
              <Label htmlFor="frequency">Sıklık</Label>
              <select
                id="frequency"
                value={autoBackup.frequency}
                onChange={(e) => setAutoBackup({ ...autoBackup, frequency: e.target.value })}
                className="w-full border rounded px-3 py-2"
              >
                <option value="hourly">Her Saat</option>
                <option value="daily">Günlük</option>
                <option value="weekly">Haftalık</option>
              </select>
            </div>
            <div>
              <Label htmlFor="time">Saat</Label>
              <Input
                id="time"
                type="time"
                value={autoBackup.time}
                onChange={(e) => setAutoBackup({ ...autoBackup, time: e.target.value })}
              />
            </div>
            <div>
              <Label htmlFor="retention">Saklama Süresi (Gün)</Label>
              <Input
                id="retention"
                type="number"
                value={autoBackup.retention_days}
                onChange={(e) =>
                  setAutoBackup({ ...autoBackup, retention_days: Number(e.target.value) })
                }
              />
            </div>
          </div>
          <Button onClick={handleSaveSettings} className="mt-4">
            Ayarları Kaydet
          </Button>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Yedek Geçmişi</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Dosya Adı</TableHead>
                <TableHead>Boyut</TableHead>
                <TableHead>Tür</TableHead>
                <TableHead>Tarih</TableHead>
                <TableHead>Durum</TableHead>
                <TableHead className="text-right">İşlemler</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {backups.map((backup) => (
                <TableRow key={backup.id}>
                  <TableCell className="font-mono text-sm">{backup.filename}</TableCell>
                  <TableCell>{(backup.size / 1024 / 1024).toFixed(2)} MB</TableCell>
                  <TableCell>
                    <Badge variant="outline">
                      {backup.type === "manual" ? "Manuel" : "Otomatik"}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    {new Date(backup.created_at).toLocaleDateString("tr-TR", {
                      day: "2-digit",
                      month: "short",
                      hour: "2-digit",
                      minute: "2-digit",
                    })}
                  </TableCell>
                  <TableCell>
                    <Badge
                      className={
                        backup.status === "completed"
                          ? "bg-green-100 text-green-700"
                          : backup.status === "in_progress"
                          ? "bg-blue-100 text-blue-700"
                          : "bg-red-100 text-red-700"
                      }
                    >
                      {backup.status === "completed"
                        ? "Tamamlandı"
                        : backup.status === "in_progress"
                        ? "Devam Ediyor"
                        : "Başarısız"}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex items-center justify-end gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleDownload(backup)}
                      >
                        <Download className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="secondary"
                        size="sm"
                        onClick={() => handleRestore(backup)}
                      >
                        <Upload className="h-4 w-4" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
};

export default AdminBackup;
