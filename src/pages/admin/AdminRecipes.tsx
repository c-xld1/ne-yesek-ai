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
import { FileText, Search, Eye, Trash2, Check, X, Clock, Star } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import LoadingSpinner from "@/components/LoadingSpinner";
import { useNavigate } from "react-router-dom";

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
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedRecipe, setSelectedRecipe] = useState<Recipe | null>(null);
  const { toast } = useToast();
  const navigate = useNavigate();

  useEffect(() => {
    fetchRecipes();
  }, []);

  const fetchRecipes = async () => {
    try {
      const { data, error } = await supabase
        .from("recipes")
        .select(`
          *,
          profiles!recipes_user_id_fkey(username, fullname),
          categories!recipes_category_id_fkey(name)
        `)
        .order("created_at", { ascending: false });

      if (error) throw error;
      
      // Map category name to category field
      const recipesWithCategory = data?.map((recipe: any) => ({
        ...recipe,
        category: recipe.categories?.name || "Kategori Yok",
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

  const filteredRecipes = recipes.filter(
    (recipe) =>
      recipe.title?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      recipe.category?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      recipe.profiles?.username?.toLowerCase().includes(searchQuery.toLowerCase())
  );

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
          <p className="text-gray-600">Toplam {recipes.length} tarif</p>
        </div>
        <Button onClick={() => navigate("/tarif-paylas")}>
          <FileText className="h-4 w-4 mr-2" />
          Yeni Tarif Ekle
        </Button>
      </div>

      {/* Search */}
      <Card>
        <CardContent className="pt-6">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
            <Input
              placeholder="Tarif adı, kategori veya yazar ara..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10"
            />
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
