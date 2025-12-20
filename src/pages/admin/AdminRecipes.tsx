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
  DialogFooter,
} from "@/components/ui/dialog";
import { Checkbox } from "@/components/ui/checkbox";
import { FileText, Search, Eye, Trash2, Check, X, Clock, Star } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import LoadingSpinner from "@/components/LoadingSpinner";
import { useNavigate } from "react-router-dom";
import { logActivity } from "@/hooks/useActivityLogs";

interface Recipe {
  id: string;
  title: string;
  description: string;
  image_url: string;
  prep_time: number;
  cook_time: number;
  servings: number;
  difficulty: string;
  category?: string;
  category_id?: string;
  rating: number;
  created_at: string;
  user_id: string;
  profiles?: {
    username: string;
    fullname: string;
  };
}

const AdminRecipes = () => {
  const [recipes, setRecipes] = useState<Recipe[]>([]);
  const [categories, setCategories] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedRecipe, setSelectedRecipe] = useState<Recipe | null>(null);
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [selectAll, setSelectAll] = useState(false);
  const [difficultyFilter, setDifficultyFilter] = useState<string>("all");
  const [categoryFilter, setCategoryFilter] = useState<string>("all");
  const [dateFilter, setDateFilter] = useState<string>("all");
  const { toast } = useToast();
  const navigate = useNavigate();

  useEffect(() => {
    fetchRecipes();
    fetchCategories();
  }, []);

  const fetchCategories = async () => {
    try {
      const { data, error } = await supabase
        .from("categories")
        .select("*")
        .order("name");

      if (error) throw error;
      setCategories(data || []);
    } catch (error) {
      console.error("Error fetching categories:", error);
    }
  };

  const fetchRecipes = async () => {
    try {
      const { data, error } = await supabase
        .from("recipes")
        .select(`
          *,
          profiles!recipes_user_id_fkey(username, fullname),
          categories!recipes_category_id_fkey(name, id)
        `)
        .order("created_at", { ascending: false });

      if (error) throw error;
      
      // Map category name to category field
      const recipesWithCategory = data?.map((recipe: any) => ({
        ...recipe,
        category: recipe.categories?.name || "Kategori Yok",
        category_id: recipe.categories?.id || null,
      }));
      
      setRecipes(recipesWithCategory || []);
    } catch (error) {
      console.error("Error fetching recipes:", error);
      toast({
        title: "Hata",
        description: "Tarifler yüklenirken bir hata oluştu.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (recipeId: string) => {
    if (!confirm("Bu tarifi silmek istediğinizden emin misiniz?")) return;

    try {
      const { error } = await supabase
        .from("recipes")
        .delete()
        .eq("id", recipeId);

      if (error) throw error;

      await logActivity("delete", "recipe", recipeId);

      toast({
        title: "Başarılı",
        description: "Tarif başarıyla silindi.",
      });

      fetchRecipes();
    } catch (error: any) {
      console.error("Error deleting recipe:", error);
      toast({
        title: "Hata",
        description: error.message || "Tarif silinirken bir hata oluştu.",
        variant: "destructive",
      });
    }
  };

  const handleBulkDelete = async () => {
    if (selectedIds.length === 0) {
      toast({
        title: "Uyarı",
        description: "Lütfen silmek için tarif seçin.",
        variant: "destructive",
      });
      return;
    }

    if (!confirm(`${selectedIds.length} tarifi silmek istediğinizden emin misiniz?`)) return;

    try {
      const { error } = await supabase
        .from("recipes")
        .delete()
        .in("id", selectedIds);

      if (error) throw error;

      await logActivity("bulk_delete", "recipe", undefined, { count: selectedIds.length, ids: selectedIds });

      toast({
        title: "Başarılı",
        description: `${selectedIds.length} tarif başarıyla silindi.`,
      });

      setSelectedIds([]);
      setSelectAll(false);
      fetchRecipes();
    } catch (error: any) {
      console.error("Error bulk deleting recipes:", error);
      toast({
        title: "Hata",
        description: error.message || "Tarifler silinirken bir hata oluştu.",
        variant: "destructive",
      });
    }
  };

  const handleSelectAll = () => {
    if (selectAll) {
      setSelectedIds([]);
    } else {
      setSelectedIds(filteredRecipes.map((r) => r.id));
    }
    setSelectAll(!selectAll);
  };

  const handleSelectOne = (id: string) => {
    if (selectedIds.includes(id)) {
      setSelectedIds(selectedIds.filter((selectedId) => selectedId !== id));
    } else {
      setSelectedIds([...selectedIds, id]);
    }
  };

  const filteredRecipes = recipes.filter((recipe) => {
    // Arama filtresi
    const matchesSearch =
      recipe.title?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      recipe.category?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      recipe.profiles?.username?.toLowerCase().includes(searchQuery.toLowerCase());

    // Zorluk filtresi
    const matchesDifficulty =
      difficultyFilter === "all" ||
      recipe.difficulty?.toLowerCase() === difficultyFilter.toLowerCase();

    // Kategori filtresi
    const matchesCategory =
      categoryFilter === "all" || recipe.category_id === categoryFilter;

    // Tarih filtresi
    const matchesDate = () => {
      if (dateFilter === "all") return true;
      const recipeDate = new Date(recipe.created_at);
      const now = new Date();
      
      if (dateFilter === "today") {
        return recipeDate.toDateString() === now.toDateString();
      } else if (dateFilter === "week") {
        const weekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
        return recipeDate >= weekAgo;
      } else if (dateFilter === "month") {
        const monthAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
        return recipeDate >= monthAgo;
      }
      return true;
    };

    return matchesSearch && matchesDifficulty && matchesCategory && matchesDate();
  });

  // İstatistikler
  const stats = {
    total: recipes.length,
    filtered: filteredRecipes.length,
    easy: recipes.filter((r) => r.difficulty?.toLowerCase() === "kolay").length,
    medium: recipes.filter((r) => r.difficulty?.toLowerCase() === "orta").length,
    hard: recipes.filter((r) => r.difficulty?.toLowerCase() === "zor").length,
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-96">
        <LoadingSpinner text="Tarifler yükleniyor..." />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Tarif Yönetimi</h2>
          <p className="text-gray-600">
            {stats.filtered} / {stats.total} tarif gösteriliyor
          </p>
        </div>
        <div className="flex gap-2">
          {selectedIds.length > 0 && (
            <Button variant="destructive" onClick={handleBulkDelete}>
              <Trash2 className="h-4 w-4 mr-2" />
              Seçilenleri Sil ({selectedIds.length})
            </Button>
          )}
          <Button onClick={() => navigate("/tarif-paylas")}>
            <FileText className="h-4 w-4 mr-2" />
            Yeni Tarif Ekle
          </Button>
        </div>
      </div>

      {/* Statistics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Toplam</p>
                <p className="text-2xl font-bold text-gray-900">{stats.total}</p>
              </div>
              <FileText className="h-8 w-8 text-purple-500" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Kolay</p>
                <p className="text-2xl font-bold text-green-600">{stats.easy}</p>
              </div>
              <Check className="h-8 w-8 text-green-500" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Orta</p>
                <p className="text-2xl font-bold text-yellow-600">{stats.medium}</p>
              </div>
              <Clock className="h-8 w-8 text-yellow-500" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Zor</p>
                <p className="text-2xl font-bold text-red-600">{stats.hard}</p>
              </div>
              <Star className="h-8 w-8 text-red-500" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Filters */}
      <Card>
        <CardContent className="pt-6">
          <div className="space-y-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              <Input
                placeholder="Tarif adı, kategori veya yazar ara..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
            </div>
            
            <div className="flex flex-wrap gap-2">
              {/* Zorluk Filtreleri */}
              <div className="flex gap-2 items-center">
                <span className="text-sm text-gray-600 font-medium">Zorluk:</span>
                <Button
                  variant={difficultyFilter === "all" ? "default" : "outline"}
                  size="sm"
                  onClick={() => setDifficultyFilter("all")}
                >
                  Tümü
                </Button>
                <Button
                  variant={difficultyFilter === "kolay" ? "default" : "outline"}
                  size="sm"
                  onClick={() => setDifficultyFilter("kolay")}
                >
                  Kolay ({stats.easy})
                </Button>
                <Button
                  variant={difficultyFilter === "orta" ? "default" : "outline"}
                  size="sm"
                  onClick={() => setDifficultyFilter("orta")}
                >
                  Orta ({stats.medium})
                </Button>
                <Button
                  variant={difficultyFilter === "zor" ? "default" : "outline"}
                  size="sm"
                  onClick={() => setDifficultyFilter("zor")}
                >
                  Zor ({stats.hard})
                </Button>
              </div>

              {/* Tarih Filtreleri */}
              <div className="flex gap-2 items-center border-l pl-2">
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

              {/* Kategori Filtresi */}
              {categories.length > 0 && (
                <div className="flex gap-2 items-center border-l pl-2">
                  <span className="text-sm text-gray-600 font-medium">Kategori:</span>
                  <select
                    value={categoryFilter}
                    onChange={(e) => setCategoryFilter(e.target.value)}
                    className="text-sm border rounded px-2 py-1"
                  >
                    <option value="all">Tümü</option>
                    {categories.map((cat) => (
                      <option key={cat.id} value={cat.id}>
                        {cat.name}
                      </option>
                    ))}
                  </select>
                </div>
              )}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Recipes Table */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <FileText className="h-5 w-5" />
            Tarif Listesi
          </CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-12">
                  <Checkbox
                    checked={selectAll}
                    onCheckedChange={handleSelectAll}
                  />
                </TableHead>
                <TableHead>Tarif</TableHead>
                <TableHead>Yazar</TableHead>
                <TableHead>Kategori</TableHead>
                <TableHead>Zorluk</TableHead>
                <TableHead>Puan</TableHead>
                <TableHead>Süre</TableHead>
                <TableHead className="text-right">İşlemler</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredRecipes.map((recipe) => (
                <TableRow key={recipe.id}>
                  <TableCell>
                    <Checkbox
                      checked={selectedIds.includes(recipe.id)}
                      onCheckedChange={() => handleSelectOne(recipe.id)}
                    />
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-3">
                      <img
                        src={recipe.image_url || "/placeholder.jpg"}
                        alt={recipe.title}
                        className="w-12 h-12 rounded-lg object-cover"
                      />
                      <div>
                        <p className="font-medium text-gray-900">{recipe.title}</p>
                        <p className="text-sm text-gray-500 truncate max-w-xs">
                          {recipe.description}
                        </p>
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div>
                      <p className="font-medium text-gray-900">
                        {recipe.profiles?.fullname || "İsimsiz"}
                      </p>
                      <p className="text-sm text-gray-500">@{recipe.profiles?.username}</p>
                    </div>
                  </TableCell>
                  <TableCell>
                    <Badge variant="outline">{recipe.category}</Badge>
                  </TableCell>
                  <TableCell>
                    <Badge
                      variant="secondary"
                      className={
                        recipe.difficulty === "easy"
                          ? "bg-green-100 text-green-700"
                          : recipe.difficulty === "medium"
                          ? "bg-yellow-100 text-yellow-700"
                          : "bg-red-100 text-red-700"
                      }
                    >
                      {recipe.difficulty === "easy"
                        ? "Kolay"
                        : recipe.difficulty === "medium"
                        ? "Orta"
                        : "Zor"}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-1">
                      <Star className="h-4 w-4 text-yellow-500 fill-yellow-500" />
                      <span className="font-medium">{recipe.rating?.toFixed(1) || "0.0"}</span>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-1 text-gray-600">
                      <Clock className="h-4 w-4" />
                      {(recipe.prep_time || 0) + (recipe.cook_time || 0)} dk
                    </div>
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex items-center justify-end gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => navigate(`/tarif/${recipe.id}`)}
                      >
                        <Eye className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="destructive"
                        size="sm"
                        onClick={() => handleDelete(recipe.id)}
                      >
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

export default AdminRecipes;
