
import { useState, useEffect } from "react";
import { useInfiniteQuery } from "@tanstack/react-query";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import RecipeCard from "@/components/RecipeCard";
import SearchBar from "@/components/SearchBar";
import AdvancedSearch from "@/components/AdvancedSearch";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Filter, Grid, List, Clock, Users, Star, ChefHat } from "lucide-react";
import LoadingSpinner from "@/components/LoadingSpinner";
import { useInView } from "react-intersection-observer";

interface Recipe {
  id: string;
  title: string;
  image: string;
  cookingTime: string;
  difficulty: "Kolay" | "Orta" | "Zor";
  rating: number;
  author: string;
  dblScore: number;
  description: string;
  category?: string;
  likes?: number;
  views?: number;
}

const mockRecipes: Recipe[] = [
  {
    id: "1",
    title: "Kremalı Mantarlı Tavuk",
    image: "https://images.unsplash.com/photo-1598103442097-8b74394b95c6?w=400&h=300&fit=crop",
    cookingTime: "35 dk",
    difficulty: "Orta",
    rating: 4.9,
    author: "Chef Mehmet",
    dblScore: 98,
    description: "Restaurant kalitesinde kremalı mantarlı tavuk tarifi.",
    category: "Ana Yemek",
    likes: 1247,
    views: 8950
  },
  {
    id: "2",
    title: "Ev Yapımı Pizza",
    image: "https://images.unsplash.com/photo-1565299624946-b28f40a0ca4b?w=400&h=300&fit=crop",
    cookingTime: "45 dk",
    difficulty: "Kolay",
    rating: 4.8,
    author: "Pizza Ustası",
    dblScore: 95,
    description: "Evde kolayca yapabileceğiniz nefis pizza tarifi.",
    category: "Ana Yemek",
    likes: 856,
    views: 6240
  },
  // ... daha fazla tarif
];

const fetchRecipes = async ({ pageParam = 0 }) => {
  // API çağrısı simülasyonu
  await new Promise(resolve => setTimeout(resolve, 1000));
  
  const startIndex = pageParam * 10;
  const endIndex = startIndex + 10;
  const paginatedRecipes = mockRecipes.slice(startIndex, endIndex);
  
  return {
    recipes: paginatedRecipes,
    nextPage: endIndex < mockRecipes.length ? pageParam + 1 : undefined,
    hasNextPage: endIndex < mockRecipes.length
  };
};

const Recipes = () => {
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const [showAdvancedSearch, setShowAdvancedSearch] = useState(false);
  const [activeTab, setActiveTab] = useState("all");
  const { ref, inView } = useInView();

  const {
    data,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    isLoading,
    error
  } = useInfiniteQuery({
    queryKey: ['recipes'],
    queryFn: fetchRecipes,
    getNextPageParam: (lastPage) => lastPage.nextPage,
    initialPageParam: 0,
  });

  useEffect(() => {
    if (inView && hasNextPage) {
      fetchNextPage();
    }
  }, [inView, fetchNextPage, hasNextPage]);

  const allRecipes = data?.pages.flatMap(page => page.recipes) || [];

  const categories = [
    { id: "all", label: "🍽️ Tümü", count: allRecipes.length },
    { id: "main", label: "🥘 Ana Yemek", count: 45 },
    { id: "dessert", label: "🧁 Tatlı", count: 32 },
    { id: "soup", label: "🍲 Çorba", count: 28 },
    { id: "breakfast", label: "🍳 Kahvaltı", count: 35 },
    { id: "vegan", label: "🌱 Vegan", count: 22 }
  ];

  const sortOptions = [
    { id: "popular", label: "En Popüler", icon: Star },
    { id: "newest", label: "En Yeni", icon: Clock },
    { id: "rating", label: "En Yüksek Puan", icon: ChefHat },
    { id: "quick", label: "En Hızlı", icon: Clock }
  ];

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Navbar />
        <div className="flex items-center justify-center min-h-[60vh]">
          <LoadingSpinner />
        </div>
        <Footer />
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Navbar />
        <div className="max-w-7xl mx-auto px-4 py-8">
          <div className="text-center">
            <h1 className="text-2xl font-bold text-red-600 mb-4">Bir hata oluştu</h1>
            <p className="text-gray-600">Tarifler yüklenirken bir sorun yaşandı.</p>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      
      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            🍽️ Tüm Tarifler
          </h1>
          <p className="text-gray-600 max-w-2xl mx-auto">
            Binlerce lezzetli tarif arasından size en uygun olanını bulun
          </p>
        </div>

        {/* Search Section */}
        <div className="mb-8">
          <SearchBar />
          <div className="mt-4 flex items-center justify-between">
            <Button
              variant="outline"
              onClick={() => setShowAdvancedSearch(!showAdvancedSearch)}
              className="flex items-center gap-2"
            >
              <Filter className="h-4 w-4" />
              Gelişmiş Arama
            </Button>
            
            <div className="flex items-center gap-2">
              <Button
                variant={viewMode === "grid" ? "default" : "outline"}
                size="sm"
                onClick={() => setViewMode("grid")}
              >
                <Grid className="h-4 w-4" />
              </Button>
              <Button
                variant={viewMode === "list" ? "default" : "outline"}
                size="sm"
                onClick={() => setViewMode("list")}
              >
                <List className="h-4 w-4" />
              </Button>
            </div>
          </div>
          
          {showAdvancedSearch && (
            <div className="mt-4">
              <AdvancedSearch />
            </div>
          )}
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
          <Card>
            <CardContent className="p-4 text-center">
              <div className="text-2xl font-bold text-food-600">{allRecipes.length}</div>
              <div className="text-sm text-gray-600">Toplam Tarif</div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4 text-center">
              <div className="text-2xl font-bold text-spice-600">156</div>
              <div className="text-sm text-gray-600">Bu Hafta Eklenen</div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4 text-center">
              <div className="text-2xl font-bold text-green-600">4.8</div>
              <div className="text-sm text-gray-600">Ortalama Puan</div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4 text-center">
              <div className="text-2xl font-bold text-purple-600">25</div>
              <div className="text-sm text-gray-600">Dakika Ort. Süre</div>
            </CardContent>
          </Card>
        </div>

        {/* Filters */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="mb-8">
          <div className="flex flex-col lg:flex-row gap-4">
            <TabsList className="grid grid-cols-3 lg:grid-cols-6 lg:w-auto">
              {categories.map((category) => (
                <TabsTrigger key={category.id} value={category.id} className="text-xs lg:text-sm">
                  {category.label}
                </TabsTrigger>
              ))}
            </TabsList>
            
            <div className="flex flex-wrap gap-2">
              {sortOptions.map((option) => (
                <Button key={option.id} variant="outline" size="sm">
                  <option.icon className="h-4 w-4 mr-1" />
                  {option.label}
                </Button>
              ))}
            </div>
          </div>

          {categories.map((category) => (
            <TabsContent key={category.id} value={category.id} className="mt-6">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-xl font-semibold">
                  {category.label} ({category.count} tarif)
                </h2>
                <Badge variant="secondary">
                  {category.count} sonuç
                </Badge>
              </div>
            </TabsContent>
          ))}
        </Tabs>

        {/* Recipes Grid */}
        <div className={`grid gap-6 mb-8 ${
          viewMode === "grid" 
            ? "grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4" 
            : "grid-cols-1"
        }`}>
          {allRecipes.map((recipe) => (
            <RecipeCard key={recipe.id} {...recipe} />
          ))}
        </div>

        {/* Loading indicator for infinite scroll */}
        <div ref={ref} className="flex justify-center py-8">
          {isFetchingNextPage && <LoadingSpinner />}
          {!hasNextPage && allRecipes.length > 0 && (
            <p className="text-gray-500">Tüm tarifler yüklendi</p>
          )}
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default Recipes;
