import { Link } from "react-router-dom";
import { Heart, Eye, ArrowRight } from "lucide-react";
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

const CategoryShowcase = () => {
  const { data: categories, isLoading, error } = useCategories();

  if (isLoading) {
    return (
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="space-y-8">
          {[1, 2, 3].map((i) => (
            <div key={i} className="flex flex-col lg:flex-row gap-4 lg:gap-6">
              <div className="w-full lg:w-72 xl:w-80 flex-shrink-0">
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
    <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-8">
      {categories.slice(0, 6).map((category) => (
        <CategoryRow key={category.id} category={category} />
      ))}
    </section>
  );
};

const CategoryRow = ({ category }: { category: any }) => {
  const { data: recipes, isLoading, error } = useRecipesByCategory(category.id);

  if (error) {
    console.error(`Kategori ${category.name} tarifleri yüklenemedi:`, error);
    return null;
  }

  // Tarifler yüklenirken skeleton göster
  if (isLoading) {
    return (
      <div className="flex flex-col lg:flex-row gap-4 lg:gap-6">
        <div className="w-full lg:w-72 xl:w-80 flex-shrink-0">
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
      <div className="w-full lg:w-72 xl:w-80 flex-shrink-0">
        <Link to={`/recipes?category=${category.slug || category.id}`}>
          <div className="relative h-64 lg:h-72 bg-gradient-to-br from-primary via-primary-600 to-primary-700 rounded-2xl p-6 lg:p-8 text-primary-foreground overflow-hidden transition-all duration-300 hover:shadow-glow hover:-translate-y-1">
            {/* Background Pattern */}
            <div className="absolute inset-0 opacity-10">
              <div className="absolute top-0 right-0 w-32 h-32 bg-background rounded-full -translate-y-1/2 translate-x-1/2" />
              <div className="absolute bottom-0 left-0 w-24 h-24 bg-background rounded-full translate-y-1/2 -translate-x-1/2" />
            </div>

            <div className="relative h-full flex flex-col justify-between">
              <div>
                <div className="w-12 h-12 lg:w-14 lg:h-14 bg-background/20 backdrop-blur-sm rounded-xl flex items-center justify-center mb-4 lg:mb-6 transition-transform duration-300 group-hover:scale-110">
                  <Heart className="h-6 w-6 lg:h-7 lg:w-7" />
                </div>
                <h3 className="text-xl lg:text-2xl font-bold mb-2 lg:mb-3">{category.name}</h3>
                <p className="text-primary-foreground/90 text-xs lg:text-sm leading-relaxed line-clamp-2">
                  {category.description || "Lezzetli tarifler keşfedin"}
                </p>
              </div>
              
              <div className="space-y-3">
                <div className="flex items-center gap-2 flex-wrap">
                  <div className="inline-flex items-center gap-1.5 bg-background/20 backdrop-blur-sm rounded-lg px-3 py-1.5">
                    <span className="text-sm lg:text-base font-semibold">{recipes.length}+</span>
                    <span className="text-xs lg:text-sm opacity-90">Tarif</span>
                  </div>
                  <div className="inline-flex items-center gap-1 text-xs lg:text-sm opacity-80">
                    <Eye className="h-3.5 w-3.5 lg:h-4 lg:w-4" />
                    <span>1.2k</span>
                  </div>
                </div>
                
                <div className="flex items-center gap-2 text-sm lg:text-base font-semibold group/link">
                  <span>Tümünü Gör</span>
                  <ArrowRight className="h-4 w-4 transition-transform duration-300 group-hover/link:translate-x-1" />
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
            {recipes.slice(0, 10).map((recipe) => (
              <CarouselItem key={recipe.id} className="pl-3 lg:pl-4 basis-[85%] sm:basis-1/2 lg:basis-1/3">
                <Link to={`/recipe/${recipe.id}`}>
                  <div className="group/card relative rounded-xl lg:rounded-2xl overflow-hidden h-64 lg:h-72 shadow-card hover:shadow-card-hover transition-all duration-300 hover:-translate-y-1">
                    <img
                      src={recipe.image_url || "https://images.unsplash.com/photo-1565299624946-b28f40a0ca4b?w=400&h=300&fit=crop"}
                      alt={recipe.title || "Tarif"}
                      className="w-full h-full object-cover transition-transform duration-500 group-hover/card:scale-110"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/50 to-black/10" />
                    
                    <div className="absolute inset-0 p-4 lg:p-6 flex flex-col justify-end">
                      <h4 className="font-bold text-lg lg:text-xl mb-2 lg:mb-3 line-clamp-2 text-white drop-shadow-lg">
                        {recipe.title || "Başlıksız Tarif"}
                      </h4>
                      
                      <div className="flex items-center gap-2 lg:gap-3">
                        <div className="flex items-center gap-2">
                          <div className="w-7 h-7 lg:w-8 lg:h-8 bg-background/30 backdrop-blur-sm rounded-full flex items-center justify-center ring-2 ring-background/20">
                            <span className="text-xs font-semibold text-white">
                              {(recipe.author_name || "AN").charAt(0).toUpperCase()}
                            </span>
                          </div>
                          <span className="text-xs lg:text-sm text-white/95 font-medium">
                            {recipe.author_name || "Anonim"}
                          </span>
                        </div>
                      </div>
                    </div>

                    <div className="absolute top-3 right-3 lg:top-4 lg:right-4">
                      <Badge className="bg-black/40 backdrop-blur-md text-white border-0 text-xs">
                        iStock
                      </Badge>
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
