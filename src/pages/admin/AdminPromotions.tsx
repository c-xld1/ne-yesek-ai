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
import { Percent, Plus, Edit, Trash2, Gift, Tag } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import LoadingSpinner from "@/components/LoadingSpinner";

interface Promotion {
  id: string;
  code: string;
  type: "percentage" | "fixed" | "free_delivery";
  value: number;
  min_order?: number;
  max_discount?: number;
  usage_limit?: number;
  usage_count: number;
  valid_from: string;
  valid_until: string;
  is_active: boolean;
  created_at: string;
}

const AdminPromotions = () => {
  const [promotions, setPromotions] = useState<Promotion[]>([]);
  const [loading, setLoading] = useState(false);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingPromo, setEditingPromo] = useState<Promotion | null>(null);
  const { toast } = useToast();

  const [promoForm, setPromoForm] = useState<{
    code: string;
    type: "percentage" | "fixed" | "free_delivery";
    value: number;
    min_order: number;
    max_discount: number;
    usage_limit: number;
    valid_from: string;
    valid_until: string;
    is_active: boolean;
  }>({
    code: "",
    type: "percentage",
    value: 10,
    min_order: 0,
    max_discount: 0,
    usage_limit: 100,
    valid_from: new Date().toISOString().split("T")[0],
    valid_until: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split("T")[0],
    is_active: true,
  });

  useEffect(() => {
    fetchPromotions();
  }, []);

  const fetchPromotions = async () => {
    // Mock data - replace with real Supabase query when table is created
    setPromotions([
      {
        id: "1",
        code: "YENI10",
        type: "percentage",
        value: 10,
        min_order: 50,
        usage_limit: 1000,
        usage_count: 234,
        valid_from: "2025-01-01",
        valid_until: "2025-12-31",
        is_active: true,
        created_at: new Date().toISOString(),
      },
      {
        id: "2",
        code: "ILKSIPARISIM",
        type: "fixed",
        value: 25,
        min_order: 100,
        usage_limit: 500,
        usage_count: 127,
        valid_from: "2025-01-01",
        valid_until: "2025-12-31",
        is_active: true,
        created_at: new Date().toISOString(),
      },
      {
        id: "3",
        code: "UCRETSIZ",
        type: "free_delivery",
        value: 0,
        min_order: 75,
        usage_limit: 2000,
        usage_count: 892,
        valid_from: "2025-01-01",
        valid_until: "2025-12-31",
        is_active: true,
        created_at: new Date().toISOString(),
      },
    ]);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    toast({
      title: "Başarılı",
      description: editingPromo ? "Promosyon güncellendi." : "Promosyon oluşturuldu.",
    });
    setDialogOpen(false);
    resetForm();
    fetchPromotions();
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Bu promosyonu silmek istediğinizden emin misiniz?")) return;
    toast({
      title: "Başarılı",
      description: "Promosyon silindi.",
    });
    fetchPromotions();
  };

  const handleEdit = (promo: Promotion) => {
    setEditingPromo(promo);
    setPromoForm({
      code: promo.code,
      type: promo.type,
      value: promo.value,
      min_order: promo.min_order || 0,
      max_discount: promo.max_discount || 0,
      usage_limit: promo.usage_limit || 0,
      valid_from: promo.valid_from,
      valid_until: promo.valid_until,
      is_active: promo.is_active,
    });
    setDialogOpen(true);
  };

  const resetForm = () => {
    setEditingPromo(null);
    setPromoForm({
      code: "",
      type: "percentage",
      value: 10,
      min_order: 0,
      max_discount: 0,
      usage_limit: 100,
      valid_from: new Date().toISOString().split("T")[0],
      valid_until: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split("T")[0],
      is_active: true,
    });
  };

  const generateCode = () => {
    const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
    const code = Array.from({ length: 8 }, () => chars[Math.floor(Math.random() * chars.length)]).join("");
    setPromoForm({ ...promoForm, code });
  };

  const stats = {
    total: promotions.length,
    active: promotions.filter((p) => p.is_active).length,
    totalUsage: promotions.reduce((sum, p) => sum + p.usage_count, 0),
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Promosyon Yönetimi</h2>
          <p className="text-gray-600">Kupon kodları ve indirim kampanyaları</p>
        </div>
        <Dialog open={dialogOpen} onOpenChange={(open) => {
          setDialogOpen(open);
          if (!open) resetForm();
        }}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="h-4 w-4 mr-2" />
              Yeni Promosyon
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>
                {editingPromo ? "Promosyonu Düzenle" : "Yeni Promosyon Oluştur"}
              </DialogTitle>
              <DialogDescription>
                Kampanya detaylarını girin
              </DialogDescription>
            </DialogHeader>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="code">Kupon Kodu *</Label>
                  <div className="flex gap-2">
                    <Input
                      id="code"
                      value={promoForm.code}
                      onChange={(e) => setPromoForm({ ...promoForm, code: e.target.value.toUpperCase() })}
                      placeholder="KAMPANYA2025"
                      required
                    />
                    <Button type="button" variant="outline" onClick={generateCode}>
                      Oluştur
                    </Button>
                  </div>
                </div>
                <div>
                  <Label htmlFor="type">İndirim Türü *</Label>
                  <Select
                    value={promoForm.type}
                    onValueChange={(value: any) => setPromoForm({ ...promoForm, type: value })}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="percentage">Yüzde İndirim (%)</SelectItem>
                      <SelectItem value="fixed">Sabit Tutar (₺)</SelectItem>
                      <SelectItem value="free_delivery">Ücretsiz Teslimat</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              {promoForm.type !== "free_delivery" && (
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="value">
                      {promoForm.type === "percentage" ? "İndirim Yüzdesi" : "İndirim Tutarı"} *
                    </Label>
                    <Input
                      id="value"
                      type="number"
                      value={promoForm.value}
                      onChange={(e) => setPromoForm({ ...promoForm, value: Number(e.target.value) })}
                      required
                    />
                  </div>
                  {promoForm.type === "percentage" && (
                    <div>
                      <Label htmlFor="max_discount">Maks. İndirim (₺)</Label>
                      <Input
                        id="max_discount"
                        type="number"
                        value={promoForm.max_discount}
                        onChange={(e) => setPromoForm({ ...promoForm, max_discount: Number(e.target.value) })}
                        placeholder="0 = Sınırsız"
                      />
                    </div>
                  )}
                </div>
              )}

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="min_order">Min. Sipariş Tutarı (₺)</Label>
                  <Input
                    id="min_order"
                    type="number"
                    value={promoForm.min_order}
                    onChange={(e) => setPromoForm({ ...promoForm, min_order: Number(e.target.value) })}
                  />
                </div>
                <div>
                  <Label htmlFor="usage_limit">Kullanım Limiti</Label>
                  <Input
                    id="usage_limit"
                    type="number"
                    value={promoForm.usage_limit}
                    onChange={(e) => setPromoForm({ ...promoForm, usage_limit: Number(e.target.value) })}
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="valid_from">Başlangıç Tarihi *</Label>
                  <Input
                    id="valid_from"
                    type="date"
                    value={promoForm.valid_from}
                    onChange={(e) => setPromoForm({ ...promoForm, valid_from: e.target.value })}
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="valid_until">Bitiş Tarihi *</Label>
                  <Input
                    id="valid_until"
                    type="date"
                    value={promoForm.valid_until}
                    onChange={(e) => setPromoForm({ ...promoForm, valid_until: e.target.value })}
                    required
                  />
                </div>
              </div>

              <div className="flex items-center gap-2">
                <input
                  type="checkbox"
                  id="is_active"
                  checked={promoForm.is_active}
                  onChange={(e) => setPromoForm({ ...promoForm, is_active: e.target.checked })}
                  className="h-4 w-4"
                />
                <Label htmlFor="is_active">Aktif</Label>
              </div>

              <DialogFooter>
                <Button type="button" variant="outline" onClick={() => setDialogOpen(false)}>
                  İptal
                </Button>
                <Button type="submit">
                  {editingPromo ? "Güncelle" : "Oluştur"}
                </Button>
              </DialogFooter>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      {/* Statistics */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Toplam Promosyon</p>
                <p className="text-2xl font-bold text-blue-600">{stats.total}</p>
              </div>
              <Gift className="h-8 w-8 text-blue-500" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Aktif Kampanya</p>
                <p className="text-2xl font-bold text-green-600">{stats.active}</p>
              </div>
              <Tag className="h-8 w-8 text-green-500" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Toplam Kullanım</p>
                <p className="text-2xl font-bold text-purple-600">{stats.totalUsage}</p>
              </div>
              <Percent className="h-8 w-8 text-purple-500" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Promotions Table */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Percent className="h-5 w-5" />
            Kampanyalar
          </CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Kod</TableHead>
                <TableHead>Tür</TableHead>
                <TableHead>Değer</TableHead>
                <TableHead>Min. Sipariş</TableHead>
                <TableHead>Kullanım</TableHead>
                <TableHead>Geçerlilik</TableHead>
                <TableHead>Durum</TableHead>
                <TableHead className="text-right">İşlemler</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {promotions.map((promo) => (
                <TableRow key={promo.id}>
                  <TableCell>
                    <code className="bg-gray-100 px-2 py-1 rounded font-mono font-bold">
                      {promo.code}
                    </code>
                  </TableCell>
                  <TableCell>
                    <Badge variant="outline">
                      {promo.type === "percentage"
                        ? "Yüzde"
                        : promo.type === "fixed"
                        ? "Sabit"
                        : "Ücretsiz Teslimat"}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    {promo.type === "percentage" ? (
                      <span>%{promo.value}</span>
                    ) : promo.type === "fixed" ? (
                      <span>₺{promo.value}</span>
                    ) : (
                      <span>-</span>
                    )}
                  </TableCell>
                  <TableCell>₺{promo.min_order || 0}</TableCell>
                  <TableCell>
                    <span className="text-sm">
                      {promo.usage_count} / {promo.usage_limit || "∞"}
                    </span>
                  </TableCell>
                  <TableCell>
                    <div className="text-sm">
                      <p>{new Date(promo.valid_from).toLocaleDateString("tr-TR")}</p>
                      <p className="text-gray-500">
                        {new Date(promo.valid_until).toLocaleDateString("tr-TR")}
                      </p>
                    </div>
                  </TableCell>
                  <TableCell>
                    <Badge className={promo.is_active ? "bg-green-100 text-green-700" : "bg-gray-100 text-gray-700"}>
                      {promo.is_active ? "Aktif" : "Pasif"}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex items-center justify-end gap-2">
                      <Button variant="outline" size="sm" onClick={() => handleEdit(promo)}>
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button variant="destructive" size="sm" onClick={() => handleDelete(promo.id)}>
                        <Trash2 className="h-4 w-4" />
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

export default AdminPromotions;
