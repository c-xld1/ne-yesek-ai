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
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Users, Search, Shield, UserX, Mail, Calendar } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import LoadingSpinner from "@/components/LoadingSpinner";

interface User {
  id: string;
  username: string;
  fullname: string;
  email: string;
  avatar_url: string;
  created_at: string;
  roles?: string[];
}

const AdminUsers = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const { toast } = useToast();

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      // Fetch profiles
      const { data: profiles, error: profilesError } = await supabase
        .from("profiles")
        .select("*")
        .order("created_at", { ascending: false });

      if (profilesError) throw profilesError;

      // Fetch user roles
      const { data: roles, error: rolesError } = await supabase
        .from("user_roles")
        .select("user_id, role");

      if (rolesError) throw rolesError;

      // Merge data - profiles table should have email field
      const usersWithRoles = profiles?.map((profile: any) => ({
        ...profile,
        email: profile.email || "N/A",
        roles: roles?.filter((r) => r.user_id === profile.id).map((r) => r.role) || [],
      }));

      setUsers(usersWithRoles || []);
    } catch (error) {
      console.error("Error fetching users:", error);
      toast({
        title: "Hata",
        description: "Kullanıcılar yüklenirken bir hata oluştu.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleRoleToggle = async (userId: string, role: "admin" | "chef", currentlyHas: boolean) => {
    try {
      if (currentlyHas) {
        // Remove role
        const { error } = await supabase
          .from("user_roles")
          .delete()
          .eq("user_id", userId)
          .eq("role", role);

        if (error) throw error;
      } else {
        // Add role
        const { error } = await supabase
          .from("user_roles")
          .insert({ user_id: userId, role });

        if (error) throw error;
      }

      toast({
        title: "Başarılı",
        description: `Rol ${currentlyHas ? "kaldırıldı" : "eklendi"}.`,
      });

      fetchUsers();
    } catch (error: any) {
      console.error("Error updating role:", error);
      toast({
        title: "Hata",
        description: error.message || "Rol güncellenirken bir hata oluştu.",
        variant: "destructive",
      });
    }
  };

  const filteredUsers = users.filter(
    (user) =>
      user.username?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      user.fullname?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      user.email?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  if (loading) {
    return (
      <div className="flex items-center justify-center h-96">
        <LoadingSpinner text="Kullanıcılar yükleniyor..." />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Kullanıcı Yönetimi</h2>
          <p className="text-gray-600">Toplam {users.length} kullanıcı</p>
        </div>
      </div>

      {/* Search */}
      <Card>
        <CardContent className="pt-6">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
            <Input
              placeholder="Kullanıcı adı, isim veya email ara..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10"
            />
          </div>
        </CardContent>
      </Card>

      {/* Users Table */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Users className="h-5 w-5" />
            Kullanıcı Listesi
          </CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Kullanıcı</TableHead>
                <TableHead>Email</TableHead>
                <TableHead>Roller</TableHead>
                <TableHead>Kayıt Tarihi</TableHead>
                <TableHead className="text-right">İşlemler</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredUsers.map((user) => (
                <TableRow key={user.id}>
                  <TableCell>
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-gradient-to-br from-purple-400 to-purple-600 flex items-center justify-center text-white font-semibold">
                        {user.username?.charAt(0).toUpperCase() || "?"}
                      </div>
                      <div>
                        <p className="font-medium text-gray-900">{user.fullname || "İsimsiz"}</p>
                        <p className="text-sm text-gray-500">@{user.username}</p>
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2 text-gray-600">
                      <Mail className="h-4 w-4" />
                      {user.email}
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex gap-2 flex-wrap">
                      {user.roles && user.roles.length > 0 ? (
                        user.roles.map((role) => (
                          <Badge
                            key={role}
                            variant="secondary"
                            className={
                              role === "admin"
                                ? "bg-purple-100 text-purple-700"
                                : role === "chef"
                                ? "bg-orange-100 text-orange-700"
                                : "bg-gray-100 text-gray-700"
                            }
                          >
                            {role}
                          </Badge>
                        ))
                      ) : (
                        <Badge variant="outline">Kullanıcı</Badge>
                      )}
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2 text-gray-600">
                      <Calendar className="h-4 w-4" />
                      {new Date(user.created_at).toLocaleDateString("tr-TR")}
                    </div>
                  </TableCell>
                  <TableCell className="text-right">
                    <Dialog>
                      <DialogTrigger asChild>
                        <Button variant="outline" size="sm">
                          <Shield className="h-4 w-4 mr-2" />
                          Roller
                        </Button>
                      </DialogTrigger>
                      <DialogContent>
                        <DialogHeader>
                          <DialogTitle>Rol Yönetimi</DialogTitle>
                          <DialogDescription>
                            {user.fullname} (@{user.username}) için roller
                          </DialogDescription>
                        </DialogHeader>
                        <div className="space-y-4 py-4">
                          <div className="flex items-center justify-between p-4 border rounded-lg">
                            <div>
                              <p className="font-medium">Admin</p>
                              <p className="text-sm text-gray-500">Tam yönetim yetkisi</p>
                            </div>
                            <Button
                              variant={user.roles?.includes("admin") ? "destructive" : "default"}
                              size="sm"
                              onClick={() =>
                                handleRoleToggle(
                                  user.id,
                                  "admin",
                                  user.roles?.includes("admin") || false
                                )
                              }
                            >
                              {user.roles?.includes("admin") ? "Kaldır" : "Ekle"}
                            </Button>
                          </div>
                          <div className="flex items-center justify-between p-4 border rounded-lg">
                            <div>
                              <p className="font-medium">Şef</p>
                              <p className="text-sm text-gray-500">Tarif ve içerik yönetimi</p>
                            </div>
                            <Button
                              variant={user.roles?.includes("chef") ? "destructive" : "default"}
                              size="sm"
                              onClick={() =>
                                handleRoleToggle(
                                  user.id,
                                  "chef",
                                  user.roles?.includes("chef") || false
                                )
                              }
                            >
                              {user.roles?.includes("chef") ? "Kaldır" : "Ekle"}
                            </Button>
                          </div>
                        </div>
                      </DialogContent>
                    </Dialog>
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

export default AdminUsers;
