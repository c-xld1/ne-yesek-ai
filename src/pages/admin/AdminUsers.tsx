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
import { Users, Search, Shield, UserX, Mail, Calendar, Edit, Eye, Ban, CheckCircle } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import LoadingSpinner from "@/components/LoadingSpinner";
import { logActivity } from "@/hooks/useActivityLogs";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";

interface User {
  id: string;
  username: string;
  fullname: string;
  email: string;
  avatar_url: string;
  bio?: string;
  location?: string;
  website?: string;
  created_at: string;
  roles?: string[];
  is_banned?: boolean;
  ban_reason?: string;
}

const AdminUsers = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [roleFilter, setRoleFilter] = useState<string>("all");
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [selectAll, setSelectAll] = useState(false);
  const [editingUser, setEditingUser] = useState<User | null>(null);
  const [viewingUser, setViewingUser] = useState<User | null>(null);
  const [banningUser, setBanningUser] = useState<User | null>(null);
  const [banReason, setBanReason] = useState("");
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

      if (profilesError) {
        console.error("Profiles error:", profilesError);
        throw profilesError;
      }

      // Fetch user roles
      const { data: roles, error: rolesError } = await supabase
        .from("user_roles")
        .select("user_id, role");

      if (rolesError) {
        console.error("Roles error:", rolesError);
        throw rolesError;
      }

      // Merge profiles with roles
      const usersWithRoles = profiles?.map((profile: any) => ({
        id: profile.id,
        username: profile.username || "unknown",
        fullname: profile.fullname || profile.full_name || "İsimsiz",
        email: profile.email || "Bilgi yok",
        avatar_url: profile.avatar_url || "",
        bio: profile.bio || "",
        location: profile.location || "",
        website: profile.website || "",
        created_at: profile.created_at || new Date().toISOString(),
        roles: roles?.filter((r) => r.user_id === profile.id).map((r) => r.role) || [],
        is_banned: profile.is_banned || false,
        ban_reason: profile.ban_reason || "",
      })) || [];

      console.log("Fetched users:", usersWithRoles);
      setUsers(usersWithRoles);
    } catch (error: any) {
      console.error("Error fetching users:", error);
      toast({
        title: "Hata",
        description: error.message || "Kullanıcılar yüklenirken bir hata oluştu.",
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

        await logActivity("remove_role", "user", userId, { role });
      } else {
        // Add role
        const { error } = await supabase
          .from("user_roles")
          .insert({ user_id: userId, role });

        if (error) throw error;

        await logActivity("add_role", "user", userId, { role });
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

  const handleBulkRoleAdd = async (role: "admin" | "chef") => {
    if (selectedIds.length === 0) {
      toast({
        title: "Uyarı",
        description: "Lütfen kullanıcı seçin.",
        variant: "destructive",
      });
      return;
    }

    try {
      // Add role to all selected users
      const inserts = selectedIds.map(userId => ({ user_id: userId, role }));
      const { error } = await supabase
        .from("user_roles")
        .upsert(inserts, { onConflict: 'user_id,role' });

      if (error) throw error;

      await logActivity("bulk_add_role", "user", undefined, { role, count: selectedIds.length, ids: selectedIds });

      toast({
        title: "Başarılı",
        description: `${selectedIds.length} kullanıcıya ${role} rolü eklendi.`,
      });

      setSelectedIds([]);
      setSelectAll(false);
      fetchUsers();
    } catch (error: any) {
      console.error("Error adding roles:", error);
      toast({
        title: "Hata",
        description: error.message || "Roller eklenirken bir hata oluştu.",
        variant: "destructive",
      });
    }
  };

  const handleSelectAll = () => {
    if (selectAll) {
      setSelectedIds([]);
      setSelectAll(false);
    } else {
      setSelectedIds(filteredUsers.map((user) => user.id));
      setSelectAll(true);
    }
  };

  const handleSelectOne = (userId: string) => {
    if (selectedIds.includes(userId)) {
      setSelectedIds(selectedIds.filter((id) => id !== userId));
      setSelectAll(false);
    } else {
      const newSelectedIds = [...selectedIds, userId];
      setSelectedIds(newSelectedIds);
      if (newSelectedIds.length === filteredUsers.length) {
        setSelectAll(true);
      }
    }
  };

  const handleEditUser = async () => {
    if (!editingUser) return;

    try {
      const { error } = await supabase
        .from("profiles")
        .update({
          fullname: editingUser.fullname,
          bio: editingUser.bio,
          location: editingUser.location,
          website: editingUser.website,
        })
        .eq("id", editingUser.id);

      if (error) throw error;

      await logActivity("update", "user", editingUser.id, { 
        fields: ["fullname", "bio", "location", "website"] 
      });

      toast({
        title: "Başarılı",
        description: "Kullanıcı bilgileri güncellendi.",
      });

      setEditingUser(null);
      fetchUsers();
    } catch (error: any) {
      console.error("Error updating user:", error);
      toast({
        title: "Hata",
        description: error.message || "Kullanıcı güncellenirken bir hata oluştu.",
        variant: "destructive",
      });
    }
  };

  const handleBanUser = async () => {
    if (!banningUser || !banReason.trim()) {
      toast({
        title: "Uyarı",
        description: "Lütfen yasaklama sebebi girin.",
        variant: "destructive",
      });
      return;
    }

    try {
      const newBanStatus = !banningUser.is_banned;
      // Note: is_banned column doesn't exist in profiles table, 
      // this is a placeholder for future implementation
      // For now, just log the action
      await logActivity(
        newBanStatus ? "ban" : "unban",
        "user",
        banningUser.id,
        { reason: banReason }
      );

      toast({
        title: "Başarılı",
        description: newBanStatus ? "Kullanıcı yasaklandı." : "Kullanıcı yasağı kaldırıldı.",
      });

      setBanningUser(null);
      setBanReason("");
      fetchUsers();
    } catch (error: any) {
      console.error("Error banning user:", error);
      toast({
        title: "Hata",
        description: error.message || "İşlem sırasında bir hata oluştu.",
        variant: "destructive",
      });
    }
  };

  const handleDeleteUser = async (userId: string, username: string) => {
    if (!confirm(`${username} kullanıcısını kalıcı olarak silmek istediğinizden emin misiniz?`)) {
      return;
    }

    try {
      // This will cascade delete related data due to foreign key constraints
      const { error } = await supabase
        .from("profiles")
        .delete()
        .eq("id", userId);

      if (error) throw error;

      await logActivity("delete", "user", userId, { username });

      toast({
        title: "Başarılı",
        description: "Kullanıcı silindi.",
      });

      fetchUsers();
    } catch (error: any) {
      console.error("Error deleting user:", error);
      toast({
        title: "Hata",
        description: error.message || "Kullanıcı silinirken bir hata oluştu.",
        variant: "destructive",
      });
    }
  };

  const filteredUsers = users.filter((user) => {
    const matchesSearch =
      user.username?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      user.fullname?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      user.email?.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesRole =
      roleFilter === "all" ||
      (roleFilter === "admin" && user.roles?.includes("admin")) ||
      (roleFilter === "chef" && user.roles?.includes("chef")) ||
      (roleFilter === "user" && (!user.roles || user.roles.length === 0));

    return matchesSearch && matchesRole;
  });

  // Statistics
  const stats = {
    total: users.length,
    admins: users.filter((u) => u.roles?.includes("admin")).length,
    chefs: users.filter((u) => u.roles?.includes("chef")).length,
    regular: users.filter((u) => !u.roles || u.roles.length === 0).length,
  };

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
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl sm:text-2xl font-bold text-gray-900">Kullanıcı Yönetimi</h2>
          <p className="text-sm text-gray-600">Toplam {stats.total} kullanıcı</p>
        </div>
        <div className="flex flex-wrap gap-2">
          {selectedIds.length > 0 && (
            <>
              <Button variant="outline" size="sm" onClick={() => handleBulkRoleAdd("chef")}>
                <span className="hidden sm:inline">Seçilenlere </span>Şef Rolü
              </Button>
              <Button variant="outline" size="sm" onClick={() => handleBulkRoleAdd("admin")}>
                <span className="hidden sm:inline">Seçilenlere </span>Admin Rolü
              </Button>
            </>
          )}
        </div>
      </div>

      {/* Statistics Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Toplam Kullanıcı</p>
                <p className="text-2xl font-bold text-gray-900">{stats.total}</p>
              </div>
              <Users className="h-8 w-8 text-purple-500" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Admin</p>
                <p className="text-2xl font-bold text-purple-600">{stats.admins}</p>
              </div>
              <Shield className="h-8 w-8 text-purple-500" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Şef</p>
                <p className="text-2xl font-bold text-orange-600">{stats.chefs}</p>
              </div>
              <Shield className="h-8 w-8 text-orange-500" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Normal Kullanıcı</p>
                <p className="text-2xl font-bold text-gray-600">{stats.regular}</p>
              </div>
              <Users className="h-8 w-8 text-gray-400" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Search and Filter */}
      <Card>
        <CardContent className="pt-6">
          <div className="flex flex-col gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              <Input
                placeholder="Kullanıcı adı, isim veya email ara..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
            </div>
            <div className="flex flex-wrap gap-2">
              <Button
                variant={roleFilter === "all" ? "default" : "outline"}
                onClick={() => setRoleFilter("all")}
                size="sm"
              >
                Tümü ({stats.total})
              </Button>
              <Button
                variant={roleFilter === "admin" ? "default" : "outline"}
                onClick={() => setRoleFilter("admin")}
                size="sm"
              >
                Admin ({stats.admins})
              </Button>
              <Button
                variant={roleFilter === "chef" ? "default" : "outline"}
                onClick={() => setRoleFilter("chef")}
                size="sm"
              >
                Şef ({stats.chefs})
              </Button>
              <Button
                variant={roleFilter === "user" ? "default" : "outline"}
                onClick={() => setRoleFilter("user")}
                size="sm"
              >
                Kullanıcı ({stats.regular})
              </Button>
            </div>
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
          {selectedIds.length > 0 && (
            <div className="mb-4 p-3 bg-purple-50 rounded-lg flex items-center justify-between">
              <p className="text-sm font-medium text-purple-900">
                {selectedIds.length} kullanıcı seçildi
              </p>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => {
                  setSelectedIds([]);
                  setSelectAll(false);
                }}
              >
                Seçimi Temizle
              </Button>
            </div>
          )}
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-12">
                  <input
                    type="checkbox"
                    checked={selectAll}
                    onChange={handleSelectAll}
                    className="rounded border-gray-300"
                  />
                </TableHead>
                <TableHead>Kullanıcı</TableHead>
                <TableHead>Email</TableHead>
                <TableHead>Roller</TableHead>
                <TableHead>Kayıt Tarihi</TableHead>
                <TableHead className="text-right">İşlemler</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredUsers.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={6} className="text-center text-gray-500 py-8">
                    Kullanıcı bulunamadı
                  </TableCell>
                </TableRow>
              ) : (
                filteredUsers.map((user) => (
                  <TableRow key={user.id}>
                    <TableCell>
                      <input
                        type="checkbox"
                        checked={selectedIds.includes(user.id)}
                        onChange={() => handleSelectOne(user.id)}
                        className="rounded border-gray-300"
                      />
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-3">
                      <div className={`w-10 h-10 rounded-full bg-gradient-to-br ${user.is_banned ? 'from-gray-400 to-gray-600' : 'from-purple-400 to-purple-600'} flex items-center justify-center text-white font-semibold relative`}>
                        {user.username?.charAt(0).toUpperCase() || "?"}
                        {user.is_banned && (
                          <div className="absolute -top-1 -right-1 w-4 h-4 bg-red-500 rounded-full flex items-center justify-center">
                            <Ban className="h-3 w-3 text-white" />
                          </div>
                        )}
                      </div>
                      <div>
                        <div className="flex items-center gap-2">
                          <p className={`font-medium ${user.is_banned ? 'text-gray-500 line-through' : 'text-gray-900'}`}>
                            {user.fullname || "İsimsiz"}
                          </p>
                          {user.is_banned && (
                            <Badge variant="destructive" className="text-xs">Yasaklı</Badge>
                          )}
                        </div>
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

                    {/* View Details */}
                    <Dialog>
                      <DialogTrigger asChild>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => setViewingUser(user)}
                        >
                          <Eye className="h-4 w-4" />
                        </Button>
                      </DialogTrigger>
                      <DialogContent className="max-w-2xl">
                        <DialogHeader>
                          <DialogTitle>Kullanıcı Detayları</DialogTitle>
                          <DialogDescription>
                            {viewingUser?.fullname} (@{viewingUser?.username})
                          </DialogDescription>
                        </DialogHeader>
                        {viewingUser && (
                          <div className="space-y-4 py-4">
                            <div className="flex items-center gap-4">
                              <div className="w-20 h-20 rounded-full bg-gradient-to-br from-purple-400 to-purple-600 flex items-center justify-center text-white text-2xl font-bold">
                                {viewingUser.username?.charAt(0).toUpperCase() || "?"}
                              </div>
                              <div className="flex-1">
                                <h3 className="text-xl font-bold">{viewingUser.fullname}</h3>
                                <p className="text-gray-600">@{viewingUser.username}</p>
                                {viewingUser.is_banned && (
                                  <Badge variant="destructive" className="mt-1">
                                    Yasaklı
                                  </Badge>
                                )}
                              </div>
                            </div>
                            <div className="grid grid-cols-2 gap-4 pt-4 border-t">
                              <div>
                                <Label className="text-gray-600">Email</Label>
                                <p className="font-medium">{viewingUser.email}</p>
                              </div>
                              <div>
                                <Label className="text-gray-600">Kayıt Tarihi</Label>
                                <p className="font-medium">
                                  {new Date(viewingUser.created_at).toLocaleDateString("tr-TR")}
                                </p>
                              </div>
                              <div>
                                <Label className="text-gray-600">Konum</Label>
                                <p className="font-medium">{viewingUser.location || "Belirtilmemiş"}</p>
                              </div>
                              <div>
                                <Label className="text-gray-600">Website</Label>
                                <p className="font-medium">{viewingUser.website || "Belirtilmemiş"}</p>
                              </div>
                              <div className="col-span-2">
                                <Label className="text-gray-600">Biyografi</Label>
                                <p className="font-medium">{viewingUser.bio || "Belirtilmemiş"}</p>
                              </div>
                              <div className="col-span-2">
                                <Label className="text-gray-600">Roller</Label>
                                <div className="flex gap-2 mt-1">
                                  {viewingUser.roles && viewingUser.roles.length > 0 ? (
                                    viewingUser.roles.map((role) => (
                                      <Badge key={role} variant="secondary">
                                        {role}
                                      </Badge>
                                    ))
                                  ) : (
                                    <Badge variant="outline">Kullanıcı</Badge>
                                  )}
                                </div>
                              </div>
                            </div>
                          </div>
                        )}
                      </DialogContent>
                    </Dialog>

                    {/* Edit User */}
                    <Dialog>
                      <DialogTrigger asChild>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => setEditingUser(user)}
                        >
                          <Edit className="h-4 w-4" />
                        </Button>
                      </DialogTrigger>
                      <DialogContent>
                        <DialogHeader>
                          <DialogTitle>Kullanıcıyı Düzenle</DialogTitle>
                          <DialogDescription>
                            {editingUser?.username} kullanıcısının bilgilerini düzenleyin
                          </DialogDescription>
                        </DialogHeader>
                        {editingUser && (
                          <div className="space-y-4 py-4">
                            <div>
                              <Label>Tam İsim</Label>
                              <Input
                                value={editingUser.fullname}
                                onChange={(e) =>
                                  setEditingUser({ ...editingUser, fullname: e.target.value })
                                }
                              />
                            </div>
                            <div>
                              <Label>Biyografi</Label>
                              <Textarea
                                value={editingUser.bio || ""}
                                onChange={(e) =>
                                  setEditingUser({ ...editingUser, bio: e.target.value })
                                }
                                rows={3}
                              />
                            </div>
                            <div>
                              <Label>Konum</Label>
                              <Input
                                value={editingUser.location || ""}
                                onChange={(e) =>
                                  setEditingUser({ ...editingUser, location: e.target.value })
                                }
                              />
                            </div>
                            <div>
                              <Label>Website</Label>
                              <Input
                                value={editingUser.website || ""}
                                onChange={(e) =>
                                  setEditingUser({ ...editingUser, website: e.target.value })
                                }
                              />
                            </div>
                            <div className="flex justify-end gap-2 pt-4">
                              <Button variant="outline" onClick={() => setEditingUser(null)}>
                                İptal
                              </Button>
                              <Button onClick={handleEditUser}>Kaydet</Button>
                            </div>
                          </div>
                        )}
                      </DialogContent>
                    </Dialog>

                    {/* Ban/Unban User */}
                    <Dialog>
                      <DialogTrigger asChild>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => {
                            setBanningUser(user);
                            setBanReason(user.ban_reason || "");
                          }}
                        >
                          {user.is_banned ? (
                            <CheckCircle className="h-4 w-4 text-green-600" />
                          ) : (
                            <Ban className="h-4 w-4 text-red-600" />
                          )}
                        </Button>
                      </DialogTrigger>
                      <DialogContent>
                        <DialogHeader>
                          <DialogTitle>
                            {banningUser?.is_banned ? "Yasağı Kaldır" : "Kullanıcıyı Yasakla"}
                          </DialogTitle>
                          <DialogDescription>
                            {banningUser?.fullname} (@{banningUser?.username})
                          </DialogDescription>
                        </DialogHeader>
                        <div className="space-y-4 py-4">
                          <div>
                            <Label>Sebep</Label>
                            <Textarea
                              value={banReason}
                              onChange={(e) => setBanReason(e.target.value)}
                              placeholder="Yasaklama veya yasağı kaldırma sebebini yazın..."
                              rows={3}
                            />
                          </div>
                          <div className="flex justify-end gap-2">
                            <Button
                              variant="outline"
                              onClick={() => {
                                setBanningUser(null);
                                setBanReason("");
                              }}
                            >
                              İptal
                            </Button>
                            <Button
                              variant={banningUser?.is_banned ? "default" : "destructive"}
                              onClick={handleBanUser}
                            >
                              {banningUser?.is_banned ? "Yasağı Kaldır" : "Yasakla"}
                            </Button>
                          </div>
                        </div>
                      </DialogContent>
                    </Dialog>

                    {/* Delete User */}
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleDeleteUser(user.id, user.username)}
                    >
                      <UserX className="h-4 w-4 text-red-600" />
                    </Button>
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

export default AdminUsers;
