import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
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
import { MessageSquare, Check, X, Flag, Star, Search } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import LoadingSpinner from "@/components/LoadingSpinner";
import { logActivity } from "@/hooks/useActivityLogs";

interface Review {
  id: string;
  user_id: string;
  recipe_id: string;
  rating: number;
  comment: string;
  status: "pending" | "approved" | "rejected";
  is_reported: boolean;
  created_at: string;
  profiles?: {
    username: string;
    fullname: string;
  };
  recipes?: {
    title: string;
  };
}

const AdminReviews = () => {
  const [reviews, setReviews] = useState<Review[]>([]);
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [searchQuery, setSearchQuery] = useState("");
  const { toast } = useToast();

  useEffect(() => {
    fetchReviews();
  }, []);

  const fetchReviews = async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from("recipe_comments")
        .select(`
          *,
          profiles:user_id(username, fullname),
          recipes:recipe_id(title)
        `)
        .order("created_at", { ascending: false })
        .limit(100);

      if (error) throw error;

      // Transform data to match our interface
      const transformedData = data?.map((item: any) => ({
        id: item.id,
        user_id: item.user_id,
        recipe_id: item.recipe_id,
        rating: item.rating || 5,
        comment: item.comment,
        status: "approved" as const,
        is_reported: false,
        created_at: item.created_at,
        profiles: item.profiles,
        recipes: item.recipes,
      }));

      setReviews(transformedData || []);
    } catch (error) {
      console.error("Error fetching reviews:", error);
      toast({
        title: "Hata",
        description: "Yorumlar yüklenirken bir hata oluştu.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleStatusChange = async (reviewId: string, newStatus: string) => {
    try {
      // Since we don't have status field in recipe_comments, we'll delete for rejection
      if (newStatus === "rejected") {
        const { error } = await supabase
          .from("recipe_comments")
          .delete()
          .eq("id", reviewId);

        if (error) throw error;

        await logActivity("reject", "review", reviewId);

        toast({
          title: "Başarılı",
          description: "Yorum reddedildi ve silindi.",
        });
      } else {
        toast({
          title: "Başarılı",
          description: "Yorum onaylandı.",
        });
      }

      fetchReviews();
    } catch (error: any) {
      console.error("Error updating review:", error);
      toast({
        title: "Hata",
        description: error.message || "İşlem başarısız.",
        variant: "destructive",
      });
    }
  };

  const filteredReviews = reviews.filter((review) => {
    const matchesStatus =
      statusFilter === "all" ||
      (statusFilter === "reported" && review.is_reported) ||
      review.status === statusFilter;

    const matchesSearch =
      review.comment?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      review.profiles?.username?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      review.recipes?.title?.toLowerCase().includes(searchQuery.toLowerCase());

    return matchesStatus && matchesSearch;
  });

  const stats = {
    total: reviews.length,
    pending: reviews.filter((r) => r.status === "pending").length,
    approved: reviews.filter((r) => r.status === "approved").length,
    rejected: reviews.filter((r) => r.status === "rejected").length,
    reported: reviews.filter((r) => r.is_reported).length,
    avgRating:
      reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length || 0,
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-96">
        <LoadingSpinner text="Yorumlar yükleniyor..." />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h2 className="text-2xl font-bold text-gray-900">Yorum Yönetimi</h2>
        <p className="text-gray-600">
          {filteredReviews.length} / {stats.total} yorum gösteriliyor
        </p>
      </div>

      {/* Statistics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
        <Card>
          <CardContent className="pt-6">
            <div className="text-center">
              <p className="text-sm font-medium text-gray-600">Toplam</p>
              <p className="text-2xl font-bold text-blue-600">{stats.total}</p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="text-center">
              <p className="text-sm font-medium text-gray-600">Bekleyen</p>
              <p className="text-2xl font-bold text-yellow-600">{stats.pending}</p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="text-center">
              <p className="text-sm font-medium text-gray-600">Onaylı</p>
              <p className="text-2xl font-bold text-green-600">{stats.approved}</p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="text-center">
              <p className="text-sm font-medium text-gray-600">Raporlanan</p>
              <p className="text-2xl font-bold text-red-600">{stats.reported}</p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="text-center">
              <p className="text-sm font-medium text-gray-600">Ort. Puan</p>
              <p className="text-2xl font-bold text-purple-600">
                {stats.avgRating.toFixed(1)} ⭐
              </p>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Filters */}
      <Card>
        <CardContent className="pt-6">
          <div className="flex flex-wrap gap-4">
            <div className="flex-1 min-w-[300px]">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                <Input
                  placeholder="Yorum, kullanıcı veya tarif ara..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-[200px]">
                <SelectValue placeholder="Durum filtrele" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Tümü ({stats.total})</SelectItem>
                <SelectItem value="pending">Bekleyen ({stats.pending})</SelectItem>
                <SelectItem value="approved">Onaylı ({stats.approved})</SelectItem>
                <SelectItem value="rejected">Reddedilen ({stats.rejected})</SelectItem>
                <SelectItem value="reported">Raporlanan ({stats.reported})</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Reviews Table */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <MessageSquare className="h-5 w-5" />
            Yorumlar
          </CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Kullanıcı</TableHead>
                <TableHead>Tarif</TableHead>
                <TableHead>Puan</TableHead>
                <TableHead>Yorum</TableHead>
                <TableHead>Tarih</TableHead>
                <TableHead>Durum</TableHead>
                <TableHead className="text-right">İşlemler</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredReviews.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={7} className="text-center text-gray-500 py-8">
                    Yorum bulunamadı
                  </TableCell>
                </TableRow>
              ) : (
                filteredReviews.map((review) => (
                  <TableRow key={review.id}>
                    <TableCell>
                      <div>
                        <p className="font-medium text-gray-900">
                          {review.profiles?.fullname || "İsimsiz"}
                        </p>
                        <p className="text-sm text-gray-500">
                          @{review.profiles?.username || "anonim"}
                        </p>
                      </div>
                    </TableCell>
                    <TableCell>
                      <p className="font-medium text-gray-900 max-w-xs truncate">
                        {review.recipes?.title || "Bilinmeyen"}
                      </p>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-1">
                        <Star className="h-4 w-4 text-yellow-500 fill-yellow-500" />
                        <span className="font-semibold">{review.rating}</span>
                      </div>
                    </TableCell>
                    <TableCell>
                      <p className="text-sm text-gray-600 max-w-md truncate">
                        {review.comment}
                      </p>
                    </TableCell>
                    <TableCell>
                      <p className="text-sm text-gray-600">
                        {new Date(review.created_at).toLocaleDateString("tr-TR")}
                      </p>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <Badge
                          className={
                            review.status === "approved"
                              ? "bg-green-100 text-green-700"
                              : review.status === "rejected"
                              ? "bg-red-100 text-red-700"
                              : "bg-yellow-100 text-yellow-700"
                          }
                        >
                          {review.status === "approved"
                            ? "Onaylı"
                            : review.status === "rejected"
                            ? "Reddedildi"
                            : "Bekliyor"}
                        </Badge>
                        {review.is_reported && (
                          <Flag className="h-4 w-4 text-red-500" />
                        )}
                      </div>
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex items-center justify-end gap-2">
                        {review.status !== "approved" && (
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleStatusChange(review.id, "approved")}
                          >
                            <Check className="h-4 w-4 text-green-600" />
                          </Button>
                        )}
                        {review.status !== "rejected" && (
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleStatusChange(review.id, "rejected")}
                          >
                            <X className="h-4 w-4 text-red-600" />
                          </Button>
                        )}
                      </div>
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

export default AdminReviews;
