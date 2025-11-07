import { Link } from "react-router-dom";
import { Heart, Eye, ArrowRight, Clock, Star, ChefHat, Sparkles } from "lucide-react";
import { useCategories } from "@/hooks/useCategories";
import { useRecipesByCategory } from "@/hooks/useRecipes";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import { Badge } from "@/components/ui/badge";
import ImageWithFallback from "@/components/ImageWithFallback";
import TrendingBadge from "@/components/TrendingBadge";

const CategoryShowcase = () => {
  const { data: categories, isLoading, error } = useCategories();

  if (isLoading) {
    return (
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="space-y-8">
          {[1, 2, 3].map((i) => (
            <div key={i} className="flex flex-col lg:flex-row gap-4 lg:gap-6">
              <div className="w-full lg:w-56 xl:w-64 flex-shrink-0">
                <div className="h-64 lg:h-72 bg-gradient-to-br from-primary/20 to-primary/5 rounded-2xl animate-pulse" />
              </div>
              <div className="flex-1 min-w-0">
                <div className="h-64 lg:h-72 bg-muted/50 rounded-2xl animate-pulse" />
              </div>
            </div>
          ))}
        </div>
      </section>
    );
  }

  if (error) {
    console.error("Kategori yükleme hatası:", error);
    return null;
  }
  
  if (!categories || categories.length === 0) {
    return null;
  }

  return (
    <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-12">
      {/* Section Header */}
      <div className="text-center max-w-3xl mx-auto mb-8">
        <div className="inline-flex items-center gap-2 bg-gradient-to-r from-primary/10 to-primary/5 rounded-full px-4 py-2 mb-4">
          <Sparkles className="h-4 w-4 text-primary animate-pulse" />
          <span className="text-sm font-semibold text-primary">Kategorilere Göre Keşfet</span>
        </div>
        <h2 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-3">
          Lezzet Dünyasına Hoş Geldiniz
        </h2>
        <p className="text-gray-600 text-lg">
          Her kategoriden özenle seçilmiş tariflerle mutfağınızı renklendirin
        </p>
      </div>

      {categories.slice(0, 6).map((category, index) => (
        <CategoryRow key={category.id} category={category} index={index} />
      ))}
    </section>
  );
};

const CategoryRow = ({ category, index }: { category: any; index: number }) => {
  const { data: recipes, isLoading, error } = useRecipesByCategory(category.id);
  
  const gradients = [
    "from-orange-500 via-orange-600 to-red-600",
    "from-purple-500 via-purple-600 to-pink-600",
    "from-blue-500 via-blue-600 to-cyan-600",
    "from-green-500 via-green-600 to-emerald-600",
    "from-yellow-500 via-amber-600 to-orange-600",
    "from-pink-500 via-rose-600 to-red-600",
  ];
  
  const gradient = gradients[index % gradients.length];

  if (error) {
    console.error(`Kategori ${category.name} tarifleri yüklenemedi:`, error);
    return null;
  }

  // Tarifler yüklenirken skeleton göster
  if (isLoading) {
    return (
      <div className="flex flex-col lg:flex-row gap-4 lg:gap-6">
        <div className="w-full lg:w-56 xl:w-64 flex-shrink-0">
          <div className="h-64 lg:h-72 bg-gradient-to-br from-primary/20 to-primary/5 rounded-2xl animate-pulse" />
        </div>
        <div className="flex-1 min-w-0">
          <div className="h-64 lg:h-72 bg-muted/50 rounded-2xl animate-pulse" />
        </div>
      </div>
    );
  }

  // Tarif yoksa kategoriyi gösterme
  if (!recipes || recipes.length === 0) {
    return null;
  }

  return (
    <div className="group flex flex-col lg:flex-row gap-4 lg:gap-6">
      {/* Left: Category Card */}
      <div className="w-full lg:w-48 xl:w-56 flex-shrink-0">
        <Link to="/tarifler">
          <div className={`relative h-80 bg-gradient-to-br ${gradient} rounded-2xl p-5 text-white overflow-hidden transition-all duration-500 hover:shadow-2xl hover:-translate-y-3 group/card`}>
            {/* Simple Background Pattern */}
            <div className="absolute inset-0 opacity-10">
              <div className="absolute top-0 right-0 w-32 h-32 bg-white rounded-full -translate-y-1/2 translate-x-1/2" />
              <div className="absolute bottom-0 left-0 w-24 h-24 bg-white rounded-full translate-y-1/2 -translate-x-1/2" />
            </div>

            <div className="relative h-full flex flex-col justify-between">
              <div>
                {/* Icon */}
                <div className="w-12 h-12 bg-white/20 backdrop-blur-sm rounded-xl flex items-center justify-center mb-4 transition-transform duration-300 group-hover/card:scale-110 shadow-lg">
                  <ChefHat className="h-6 w-6" />
                </div>
                
                {/* Title */}
                <h3 className="text-lg font-bold mb-2 leading-tight">
                  {category.name}
                </h3>
                
                {/* Description - Hidden on small cards */}
                <p className="text-white/80 text-xs leading-snug line-clamp-2 mb-3">
                  {category.description || "Tarifler keşfedin"}
                </p>
              </div>
              
              {/* Stats & CTA */}
              <div className="space-y-2.5">
                {/* Compact Stats */}
                <div className="bg-white/20 backdrop-blur-sm rounded-lg px-3 py-2 border border-white/20">
                  <div className="flex items-center gap-1.5 mb-1.5">
                    <Star className="h-3.5 w-3.5 fill-current" />
                    <span className="text-sm font-bold">{recipes.length} Tarif</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <Eye className="h-3.5 w-3.5" />
                    <span className="text-xs">1.2k+</span>
                  </div>
                </div>
                
                {/* Minimal CTA */}
                <div className="flex items-center justify-center gap-1.5 bg-white/15 backdrop-blur-sm rounded-lg px-3 py-2.5 border border-white/20 transition-all duration-300 hover:bg-white/25 group/link">
                  <span className="font-semibold text-xs">Tümünü Gör</span>
                  <ArrowRight className="h-3.5 w-3.5 transition-transform duration-300 group-hover/link:translate-x-0.5" />
                </div>
              </div>
            </div>
          </div>
        </Link>
      </div>

      {/* Right: Recipe Carousel */}
      <div className="flex-1 min-w-0">
        <Carousel
          opts={{
            align: "start",
            loop: false,
          }}
          className="w-full"
        >
          <CarouselContent className="-ml-3 lg:-ml-4">
            {recipes.slice(0, 15).map((recipe, idx) => (
              <CarouselItem key={recipe.id} className="pl-3 lg:pl-4 basis-[85%] sm:basis-1/2 lg:basis-1/3 xl:basis-1/4">
                <Link to={`/tarif/${recipe.id}`}>
                  <div className="group/card relative rounded-2xl overflow-hidden h-80 shadow-lg hover:shadow-2xl transition-all duration-500 hover:-translate-y-3 border border-gray-100">
                    <ImageWithFallback
                      src={recipe.image_url || "https://images.unsplash.com/photo-1565299624946-b28f40a0ca4b?w=400&h=300&fit=crop"}
                      alt={recipe.title || "Tarif"}
                      className="w-full h-full object-cover transition-transform duration-700 group-hover/card:scale-110"
                    />
                    
                    {/* Base Gradient */}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/95 via-black/60 to-transparent" />
                    
                    {/* Hover Gradient */}
                    <div className="absolute inset-0 bg-gradient-to-t from-primary/95 via-primary/50 to-transparent opacity-0 group-hover/card:opacity-100 transition-opacity duration-500" />
                    
                    {/* Top Section - Badges */}
                    <div className="absolute top-4 left-4 right-4 flex items-start justify-between z-10">
                      <div className="flex flex-col gap-2">
                        {idx === 0 && <TrendingBadge />}
                        <Badge className="bg-black/60 backdrop-blur-md text-white border-white/20 text-xs font-semibold shadow-lg w-fit">
                          <Clock className="h-3 w-3 mr-1" />
                          {recipe.prep_time || "30"} dk
                        </Badge>
                      </div>

                      {/* Hover Stats */}
                      <div className="flex flex-col gap-2 opacity-0 group-hover/card:opacity-100 transition-all duration-500 translate-x-2 group-hover/card:translate-x-0">
                        <div className="flex items-center gap-1.5 bg-black/70 backdrop-blur-md rounded-full px-3 py-1.5 text-white shadow-lg">
                          <Heart className="h-3.5 w-3.5 fill-red-500 text-red-500" />
                          <span className="text-xs font-bold">{recipe.likes || 0}</span>
                        </div>
                        <div className="flex items-center gap-1.5 bg-black/70 backdrop-blur-md rounded-full px-3 py-1.5 text-white shadow-lg">
                          <Eye className="h-3.5 w-3.5" />
                          <span className="text-xs font-bold">{recipe.views || 0}</span>
                        </div>
                      </div>
                    </div>
                    
                    {/* Bottom Content */}
                    <div className="absolute inset-x-0 bottom-0 p-5 flex flex-col z-10">
                      {/* Rating - Shows on Hover */}
                      <div className="flex items-center gap-1 mb-3 opacity-0 group-hover/card:opacity-100 transition-all duration-500 transform translate-y-2 group-hover/card:translate-y-0">
                        {[...Array(5)].map((_, i) => (
                          <Star
                            key={i}
                            className={`h-4 w-4 transition-transform duration-300 ${
                              i < Math.floor(recipe.rating || 4.5)
                                ? "fill-yellow-400 text-yellow-400 scale-100"
                                : "text-white/30 scale-90"
                            }`}
                          />
                        ))}
                        <span className="text-sm text-white font-bold ml-1.5 drop-shadow-lg">
                          {recipe.rating || "4.5"}
                        </span>
                      </div>

                      {/* Title */}
                      <h4 className="font-bold text-xl mb-3 line-clamp-2 text-white drop-shadow-2xl group-hover/card:text-yellow-300 transition-colors duration-300 leading-tight">
                        {recipe.title || "Başlıksız Tarif"}
                      </h4>
                      
                      {/* Author & Difficulty */}
                      <div className="flex items-center justify-between gap-3">
                        <div className="flex items-center gap-2.5 flex-1 min-w-0">
                          <div className="w-9 h-9 bg-white/25 backdrop-blur-md rounded-full flex items-center justify-center ring-2 ring-white/40 shadow-xl flex-shrink-0">
                            <span className="text-sm font-bold text-white">
                              {(recipe.author_name || "AN").charAt(0).toUpperCase()}
                            </span>
                          </div>
                          <span className="text-sm text-white/95 font-semibold drop-shadow truncate">
                            {recipe.author_name || "Anonim"}
                          </span>
                        </div>

                        <Badge className="bg-white/25 backdrop-blur-md text-white border-white/40 text-xs font-semibold shadow-lg flex-shrink-0">
                          {recipe.difficulty || "Kolay"}
                        </Badge>
                      </div>

                      {/* Arrow Icon - Bottom Right */}
                      <div className="absolute bottom-5 right-5 opacity-0 group-hover/card:opacity-100 transition-all duration-300 transform translate-x-2 group-hover/card:translate-x-0">
                        <div className="bg-white/30 backdrop-blur-md rounded-full p-2.5 shadow-xl border border-white/40">
                          <ArrowRight className="h-5 w-5 text-white" />
                        </div>
                      </div>
                    </div>
                  </div>
                </Link>
              </CarouselItem>
            ))}
          </CarouselContent>
          <CarouselPrevious className="hidden lg:flex -left-6 xl:-left-12 h-10 w-10 border-border/50 bg-background/80 backdrop-blur-sm hover:bg-background" />
          <CarouselNext className="hidden lg:flex -right-6 xl:-right-12 h-10 w-10 border-border/50 bg-background/80 backdrop-blur-sm hover:bg-background" />
        </Carousel>
      </div>
    </div>
  );
};

export default CategoryShowcase;
