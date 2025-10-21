import { useState } from "react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import BottomNav from "@/components/BottomNav";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { TrendingUp, Clock, Leaf, Heart, DollarSign } from "lucide-react";
import { useRecipes } from "@/hooks/useRecipes";
import RecipeCard from "@/components/RecipeCard";
import { motion } from "framer-motion";

const Discover = () => {
  const [activeFilter, setActiveFilter] = useState<string | null>(null);
  const { data: recipes, isLoading } = useRecipes();

  const filters = [
    { id: "quick", label: "15 dk Altı", icon: Clock },
    { id: "vegan", label: "Vegan", icon: Leaf },
    { id: "budget", label: "Ekonomik", icon: DollarSign },
    { id: "trending", label: "Trend", icon: TrendingUp },
  ];

  const filteredRecipes = recipes?.filter((recipe: any) => {
    if (!activeFilter) return true;
    
    if (activeFilter === "quick") {
      return (recipe.prep_time + recipe.cook_time) <= 15;
    }
    if (activeFilter === "trending") {
      return recipe.is_featured;
    }
    return true;
  });

  return (
    <div className="min-h-screen bg-background pb-20">
      <Navbar />
      
      <div className="container mx-auto px-4 py-8 space-y-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center space-y-4"
        >
          <h1 className="text-4xl font-bold">Keşfet</h1>
          <p className="text-muted-foreground">
            Trend tarifler, yeni şefler ve popüler malzemeler
          </p>
        </motion.div>

        <div className="flex flex-wrap gap-2 justify-center">
          {filters.map((filter) => {
            const Icon = filter.icon;
            return (
              <Button
                key={filter.id}
                variant={activeFilter === filter.id ? "default" : "outline"}
                size="sm"
                onClick={() => setActiveFilter(activeFilter === filter.id ? null : filter.id)}
                className="gap-2"
              >
                <Icon className="h-4 w-4" />
                {filter.label}
              </Button>
            );
          })}
        </div>

        <Tabs defaultValue="trending" className="w-full">
          <TabsList className="w-full justify-start overflow-x-auto">
            <TabsTrigger value="trending">
              <TrendingUp className="h-4 w-4 mr-2" />
              Trend Tarifler
            </TabsTrigger>
            <TabsTrigger value="chefs">
              👨‍🍳 Yeni Şefler
            </TabsTrigger>
            <TabsTrigger value="favorites">
              <Heart className="h-4 w-4 mr-2" />
              Favorilerim
            </TabsTrigger>
          </TabsList>

          <TabsContent value="trending" className="mt-6">
            {isLoading ? (
              <div className="text-center py-12">Yükleniyor...</div>
            ) : (
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredRecipes?.map((recipe: any) => (
                  <RecipeCard 
                    key={recipe.id}
                    id={recipe.id}
                    title={recipe.title}
                    image={recipe.image_url}
                    cookingTime={`${recipe.prep_time + recipe.cook_time} dk`}
                    difficulty={recipe.difficulty}
                    rating={recipe.rating}
                    description={recipe.description}
                  />
                ))}
              </div>
            )}
          </TabsContent>

          <TabsContent value="chefs" className="mt-6">
            <div className="text-center py-12 text-muted-foreground">
              Yakında: Yeni şefler bölümü
            </div>
          </TabsContent>

          <TabsContent value="favorites" className="mt-6">
            <div className="text-center py-12 text-muted-foreground">
              Favorilerinizi görmek için giriş yapın
            </div>
          </TabsContent>
        </Tabs>
      </div>

      <Footer />
      <BottomNav />
    </div>
  );
};

export default Discover;
