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

interface ChefApplication {
  id: string;
  user_id: string;
  fullname: string;
  specialty: string;
  experience_years: number;
  bio: string;
  status: string;
  created_at: string;
  profiles?: {
    username: string;
    email: string;
  };
}

const AdminChefs = () => {
  const [applications, setApplications] = useState<ChefApplication[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedApp, setSelectedApp] = useState<ChefApplication | null>(null);
  const { toast } = useToast();

  useEffect(() => {
    fetchApplications();
  }, []);

  const fetchApplications = async () => {
    try {
      const { data, error } = await supabase
        .from("chef_applications")
        .select(`
          *,
          profiles!chef_applications_user_id_fkey(username, email)
        `)
        .order("created_at", { ascending: false });

      if (error) throw error;
      setApplications(data || []);
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
              <TableCell>{app.specialty}</TableCell>
              <TableCell>{app.experience_years} yıl</TableCell>
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
                <Dialog>
                  <DialogTrigger asChild>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setSelectedApp(app)}
                    >
                      <Eye className="h-4 w-4 mr-2" />
                      Detay
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
                          <p className="text-sm font-medium text-gray-500">Email</p>
                          <p className="text-gray-900">{app.profiles?.email}</p>
                        </div>
                        <div>
                          <p className="text-sm font-medium text-gray-500">Uzmanlık</p>
                          <p className="text-gray-900">{app.specialty}</p>
                        </div>
                        <div>
                          <p className="text-sm font-medium text-gray-500">Deneyim</p>
                          <p className="text-gray-900">{app.experience_years} yıl</p>
                        </div>
                        <div>
                          <p className="text-sm font-medium text-gray-500">Başvuru Tarihi</p>
                          <p className="text-gray-900">
                            {new Date(app.created_at).toLocaleDateString("tr-TR")}
                          </p>
                        </div>
                      </div>
                      <div>
                        <p className="text-sm font-medium text-gray-500 mb-2">Biyografi</p>
                        <p className="text-gray-900 bg-gray-50 p-4 rounded-lg">{app.bio}</p>
                      </div>
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
            {pendingApps.length} bekleyen başvuru
          </p>
        </div>
      </div>

      {/* Tabs */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <ChefHat className="h-5 w-5" />
            Şef Başvuruları
          </CardTitle>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="pending">
            <TabsList className="grid w-full grid-cols-3 mb-6">
              <TabsTrigger value="pending">
                Bekleyen ({pendingApps.length})
              </TabsTrigger>
              <TabsTrigger value="approved">
                Onaylanan ({approvedApps.length})
              </TabsTrigger>
              <TabsTrigger value="rejected">
                Reddedilen ({rejectedApps.length})
              </TabsTrigger>
            </TabsList>
            <TabsContent value="pending">
              <ApplicationTable apps={pendingApps} />
            </TabsContent>
            <TabsContent value="approved">
              <ApplicationTable apps={approvedApps} />
            </TabsContent>
            <TabsContent value="rejected">
              <ApplicationTable apps={rejectedApps} />
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
};

export default AdminChefs;
