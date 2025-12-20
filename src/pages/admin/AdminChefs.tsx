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
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
} from "@/components/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ChefHat, Check, X, Eye, Calendar, Mail } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import LoadingSpinner from "@/components/LoadingSpinner";
import { logActivity } from "@/hooks/useActivityLogs";

interface ChefApplication {
  id: string;
  user_id: string;
  fullname: string;
  phone: string;
  address: string;
  city: string;
  district?: string;
  cuisine_type: string;
  experience_years?: number;
  business_description?: string;
  sample_menu?: any;
  identity_document_url?: string;
  residence_document_url?: string;
  video_url?: string;
  status: string;
  admin_notes?: string;
  created_at: string;
  profiles?: {
    username: string;
    email?: string;
  };
}

const AdminChefs = () => {
  const [applications, setApplications] = useState<ChefApplication[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedApp, setSelectedApp] = useState<ChefApplication | null>(null);
  const [statusFilter, setStatusFilter] = useState<"all" | "pending" | "approved" | "rejected">("all");
  const [dateFilter, setDateFilter] = useState<"all" | "today" | "week" | "month">("all");
  const [viewingApp, setViewingApp] = useState<ChefApplication | null>(null);
  const { toast } = useToast();

  useEffect(() => {
    fetchApplications();
  }, []);

  const fetchApplications = async () => {
    try {
      const { data, error } = await supabase
        .from("chef_applications")
        .select("*")
        .order("created_at", { ascending: false });

      if (error) throw error;

      // Fetch profiles separately
      const userIds = [...new Set(data?.map((a) => a.user_id).filter(Boolean))];
      const { data: profiles } = await supabase
        .from("profiles")
        .select("id, username")
        .in("id", userIds);

      // Merge data
      const applicationsWithProfiles = data?.map((app: any) => {
        const profile = profiles?.find((p) => p.id === app.user_id);
        return {
          ...app,
          profiles: profile ? { username: profile.username } : undefined,
        };
      });

      setApplications(applicationsWithProfiles || []);
    } catch (error) {
      console.error("Error fetching applications:", error);
      toast({
        title: "Hata",
        description: "Başvurular yüklenirken bir hata oluştu.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleStatusChange = async (
    applicationId: string,
    userId: string,
    newStatus: "approved" | "rejected"
  ) => {
    try {
      // Update application status
      const { error: updateError } = await supabase
        .from("chef_applications")
        .update({ status: newStatus })
        .eq("id", applicationId);

      if (updateError) throw updateError;

      // If approved, add chef role
      if (newStatus === "approved") {
        const { error: roleError } = await supabase
          .from("user_roles")
          .insert({ user_id: userId, role: "chef" })
          .select()
          .single();

        if (roleError && roleError.code !== "23505") {
          // Ignore duplicate key error
          throw roleError;
        }
      }

      await logActivity(
        newStatus === "approved" ? "approve" : "reject",
        "chef_application",
        applicationId,
        { userId }
      );

      toast({
        title: "Başarılı",
        description: `Başvuru ${newStatus === "approved" ? "onaylandı" : "reddedildi"}.`,
      });

      fetchApplications();
      setSelectedApp(null);
    } catch (error: any) {
      console.error("Error updating status:", error);
      toast({
        title: "Hata",
        description: error.message || "İşlem sırasında bir hata oluştu.",
        variant: "destructive",
      });
    }
  };

  const pendingApps = applications.filter((app) => app.status === "pending");
  const approvedApps = applications.filter((app) => app.status === "approved");
  const rejectedApps = applications.filter((app) => app.status === "rejected");

  const filteredApplications = applications.filter((app) => {
    const matchesStatus = statusFilter === "all" || app.status === statusFilter;
    
    const matchesDate = () => {
      if (dateFilter === "all") return true;
      const appDate = new Date(app.created_at);
      const now = new Date();
      if (dateFilter === "today") return appDate.toDateString() === now.toDateString();
      if (dateFilter === "week") {
        const weekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
        return appDate >= weekAgo;
      }
      if (dateFilter === "month") {
        const monthAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
        return appDate >= monthAgo;
      }
      return true;
    };
    
    return matchesStatus && matchesDate();
  });

  const stats = {
    total: applications.length,
    filtered: filteredApplications.length,
    pending: applications.filter(a => a.status === "pending").length,
    approved: applications.filter(a => a.status === "approved").length,
    rejected: applications.filter(a => a.status === "rejected").length
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-96">
        <LoadingSpinner text="Başvurular yükleniyor..." />
      </div>
    );
  }

  const ApplicationTable = ({ apps }: { apps: ChefApplication[] }) => (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Başvuran</TableHead>
          <TableHead>Uzmanlık</TableHead>
          <TableHead>Deneyim</TableHead>
          <TableHead>Tarih</TableHead>
          <TableHead>Durum</TableHead>
          <TableHead className="text-right">İşlemler</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {apps.length === 0 ? (
          <TableRow>
            <TableCell colSpan={6} className="text-center text-gray-500 py-8">
              Başvuru bulunamadı
            </TableCell>
          </TableRow>
        ) : (
          apps.map((app) => (
            <TableRow key={app.id}>
              <TableCell>
                <div>
                  <p className="font-medium text-gray-900">{app.fullname}</p>
                  <p className="text-sm text-gray-500">@{app.profiles?.username}</p>
                </div>
              </TableCell>
              <TableCell>{app.cuisine_type}</TableCell>
              <TableCell>{app.experience_years || 0} yıl</TableCell>
              <TableCell>
                <div className="flex items-center gap-2 text-gray-600">
                  <Calendar className="h-4 w-4" />
                  {new Date(app.created_at).toLocaleDateString("tr-TR")}
                </div>
              </TableCell>
              <TableCell>
                <Badge
                  variant="secondary"
                  className={
                    app.status === "approved"
                      ? "bg-green-100 text-green-700"
                      : app.status === "rejected"
                      ? "bg-red-100 text-red-700"
                      : "bg-yellow-100 text-yellow-700"
                  }
                >
                  {app.status === "approved"
                    ? "Onaylandı"
                    : app.status === "rejected"
                    ? "Reddedildi"
                    : "Bekliyor"}
                </Badge>
              </TableCell>
              <TableCell className="text-right">
                <div className="flex items-center justify-end gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setViewingApp(app)}
                  >
                    <Eye className="h-4 w-4 mr-2" />
                    Detaylar
                  </Button>
                  <Dialog>
                    <DialogTrigger asChild>
                      <Button
                        variant="default"
                        size="sm"
                        onClick={() => setSelectedApp(app)}
                      >
                        İşlem Yap
                      </Button>
                  </DialogTrigger>
                  <DialogContent className="max-w-2xl">
                    <DialogHeader>
                      <DialogTitle>Şef Başvuru Detayı</DialogTitle>
                      <DialogDescription>
                        {app.fullname} tarafından gönderilen başvuru
                      </DialogDescription>
                    </DialogHeader>
                    <div className="space-y-4 py-4">
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <p className="text-sm font-medium text-gray-500">İsim</p>
                          <p className="text-gray-900">{app.fullname}</p>
                        </div>
                        <div>
                          <p className="text-sm font-medium text-gray-500">Kullanıcı Adı</p>
                          <p className="text-gray-900">@{app.profiles?.username}</p>
                        </div>
                        <div>
                          <p className="text-sm font-medium text-gray-500">Telefon</p>
                          <p className="text-gray-900">{app.phone}</p>
                        </div>
                        <div>
                          <p className="text-sm font-medium text-gray-500">Mutfak Türü</p>
                          <p className="text-gray-900">{app.cuisine_type}</p>
                        </div>
                        <div>
                          <p className="text-sm font-medium text-gray-500">Deneyim</p>
                          <p className="text-gray-900">{app.experience_years || 0} yıl</p>
                        </div>
                        <div>
                          <p className="text-sm font-medium text-gray-500">Başvuru Tarihi</p>
                          <p className="text-gray-900">
                            {new Date(app.created_at).toLocaleDateString("tr-TR")}
                          </p>
                        </div>
                      </div>
                      <div>
                        <p className="text-sm font-medium text-gray-500 mb-2">Adres</p>
                        <p className="text-gray-900 bg-gray-50 p-4 rounded-lg">
                          {app.address}, {app.district && `${app.district}, `}{app.city}
                        </p>
                      </div>
                      {app.business_description && (
                        <div>
                          <p className="text-sm font-medium text-gray-500 mb-2">İşletme Açıklaması</p>
                          <p className="text-gray-900 bg-gray-50 p-4 rounded-lg">{app.business_description}</p>
                        </div>
                      )}
                    </div>
                    {app.status === "pending" && (
                      <DialogFooter className="gap-2">
                        <Button
                          variant="destructive"
                          onClick={() => handleStatusChange(app.id, app.user_id, "rejected")}
                        >
                          <X className="h-4 w-4 mr-2" />
                          Reddet
                        </Button>
                        <Button
                          onClick={() => handleStatusChange(app.id, app.user_id, "approved")}
                        >
                          <Check className="h-4 w-4 mr-2" />
                          Onayla
                        </Button>
                      </DialogFooter>
                    )}
                  </DialogContent>
                </Dialog>
                </div>
              </TableCell>
            </TableRow>
          ))
        )}
      </TableBody>
    </Table>
  );

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Şef Yönetimi</h2>
          <p className="text-gray-600">
            {stats.filtered} / {stats.total} başvuru gösteriliyor • {stats.pending} bekliyor
          </p>
        </div>
      </div>

      {/* Statistics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Toplam Başvuru</p>
                <p className="text-2xl font-bold text-gray-900">{stats.total}</p>
              </div>
              <ChefHat className="h-8 w-8 text-blue-500" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Bekleyen</p>
                <p className="text-2xl font-bold text-yellow-600">{stats.pending}</p>
              </div>
              <Calendar className="h-8 w-8 text-yellow-500" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Onaylanan</p>
                <p className="text-2xl font-bold text-green-600">{stats.approved}</p>
              </div>
              <Check className="h-8 w-8 text-green-500" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Reddedilen</p>
                <p className="text-2xl font-bold text-red-600">{stats.rejected}</p>
              </div>
              <X className="h-8 w-8 text-red-500" />
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
                Bekleyen ({stats.pending})
              </Button>
              <Button
                variant={statusFilter === "approved" ? "default" : "outline"}
                size="sm"
                onClick={() => setStatusFilter("approved")}
              >
                Onaylanan ({stats.approved})
              </Button>
              <Button
                variant={statusFilter === "rejected" ? "default" : "outline"}
                size="sm"
                onClick={() => setStatusFilter("rejected")}
              >
                Reddedilen ({stats.rejected})
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

      {/* Applications Table */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <ChefHat className="h-5 w-5" />
            Şef Başvuruları
          </CardTitle>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="all">
            <TabsList className="grid w-full grid-cols-4 mb-6">
              <TabsTrigger value="all">
                Tümü ({stats.filtered})
              </TabsTrigger>
              <TabsTrigger value="pending">
                Bekleyen ({stats.pending})
              </TabsTrigger>
              <TabsTrigger value="approved">
                Onaylanan ({stats.approved})
              </TabsTrigger>
              <TabsTrigger value="rejected">
                Reddedilen ({stats.rejected})
              </TabsTrigger>
            </TabsList>
            <TabsContent value="all">
              <ApplicationTable apps={filteredApplications} />
            </TabsContent>
            <TabsContent value="pending">
              <ApplicationTable apps={filteredApplications.filter(a => a.status === "pending")} />
            </TabsContent>
            <TabsContent value="approved">
              <ApplicationTable apps={filteredApplications.filter(a => a.status === "approved")} />
            </TabsContent>
            <TabsContent value="rejected">
              <ApplicationTable apps={filteredApplications.filter(a => a.status === "rejected")} />
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>

      {/* Viewing Application Details Dialog */}
      <Dialog open={!!viewingApp} onOpenChange={() => setViewingApp(null)}>
        <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Başvuru Detayları</DialogTitle>
            <DialogDescription>
              {viewingApp?.fullname} - @{viewingApp?.profiles?.username}
            </DialogDescription>
          </DialogHeader>
          {viewingApp && (
            <div className="space-y-6">
              {/* Basic Info */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium text-gray-600">Ad Soyad</label>
                  <p className="text-base">{viewingApp.fullname}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-600">Telefon</label>
                  <p className="text-base">{viewingApp.phone}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-600">Şehir</label>
                  <p className="text-base">{viewingApp.city}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-600">İlçe</label>
                  <p className="text-base">{viewingApp.district || "-"}</p>
                </div>
              </div>

              {/* Professional Info */}
              <div className="border-t pt-4">
                <h3 className="font-semibold mb-3">Profesyonel Bilgiler</h3>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-sm font-medium text-gray-600">Mutfak Türü</label>
                    <p className="text-base">{viewingApp.cuisine_type}</p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-600">Deneyim (Yıl)</label>
                    <p className="text-base">{viewingApp.experience_years || "Belirtilmemiş"}</p>
                  </div>
                </div>
              </div>

              {/* Business Description */}
              {viewingApp.business_description && (
                <div className="border-t pt-4">
                  <h3 className="font-semibold mb-2">İşletme Açıklaması</h3>
                  <p className="text-sm text-gray-700 whitespace-pre-wrap">{viewingApp.business_description}</p>
                </div>
              )}

              {/* Sample Menu */}
              {viewingApp.sample_menu && (
                <div className="border-t pt-4">
                  <h3 className="font-semibold mb-2">Örnek Menü</h3>
                  <pre className="text-sm bg-gray-50 p-3 rounded-lg overflow-auto">
                    {JSON.stringify(viewingApp.sample_menu, null, 2)}
                  </pre>
                </div>
              )}

              {/* Documents */}
              <div className="border-t pt-4">
                <h3 className="font-semibold mb-3">Belgeler</h3>
                <div className="space-y-2">
                  {viewingApp.identity_document_url && (
                    <div>
                      <label className="text-sm font-medium text-gray-600">Kimlik Belgesi</label>
                      <a
                        href={viewingApp.identity_document_url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-blue-600 hover:underline block"
                      >
                        Belgeyi Görüntüle
                      </a>
                    </div>
                  )}
                  {viewingApp.residence_document_url && (
                    <div>
                      <label className="text-sm font-medium text-gray-600">İkametgah Belgesi</label>
                      <a
                        href={viewingApp.residence_document_url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-blue-600 hover:underline block"
                      >
                        Belgeyi Görüntüle
                      </a>
                    </div>
                  )}
                  {viewingApp.video_url && (
                    <div>
                      <label className="text-sm font-medium text-gray-600">Tanıtım Videosu</label>
                      <a
                        href={viewingApp.video_url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-blue-600 hover:underline block"
                      >
                        Videoyu İzle
                      </a>
                    </div>
                  )}
                </div>
              </div>

              {/* Admin Notes */}
              {viewingApp.admin_notes && (
                <div className="border-t pt-4">
                  <h3 className="font-semibold mb-2">Admin Notları</h3>
                  <p className="text-sm text-gray-700 whitespace-pre-wrap bg-yellow-50 p-3 rounded-lg">
                    {viewingApp.admin_notes}
                  </p>
                </div>
              )}

              {/* Status */}
              <div className="border-t pt-4">
                <div className="flex items-center justify-between">
                  <div>
                    <label className="text-sm font-medium text-gray-600">Durum</label>
                    <div className="mt-1">
                      <Badge
                        className={
                          viewingApp.status === "approved"
                            ? "bg-green-100 text-green-700"
                            : viewingApp.status === "rejected"
                            ? "bg-red-100 text-red-700"
                            : "bg-yellow-100 text-yellow-700"
                        }
                      >
                        {viewingApp.status === "approved"
                          ? "Onaylandı"
                          : viewingApp.status === "rejected"
                          ? "Reddedildi"
                          : "Bekliyor"}
                      </Badge>
                    </div>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-600">Başvuru Tarihi</label>
                    <p className="text-base">{new Date(viewingApp.created_at).toLocaleDateString("tr-TR")}</p>
                  </div>
                </div>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default AdminChefs;
