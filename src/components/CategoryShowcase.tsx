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
  const { data: categories, isLoading } = useCategories();

  if (isLoading) return null;
  if (!categories || categories.length === 0) return null;

  return (
    <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-12">
      {categories.slice(0, 6).map((category) => (
        <CategoryRow key={category.id} category={category} />
      ))}
    </section>
  );
};

const CategoryRow = ({ category }: { category: any }) => {
  const { data: recipes, isLoading } = useRecipesByCategory(category.id);

  if (isLoading || !recipes || recipes.length === 0) return null;

  return (
    <div className="flex flex-col lg:flex-row gap-6 items-stretch">
      {/* Left: Category Card */}
      <div className="lg:w-80 flex-shrink-0">
        <Link to={`/recipes?category=${category.slug || category.id}`}>
          <div className="h-full bg-gradient-to-br from-purple-500 via-purple-600 to-pink-500 rounded-3xl p-8 text-white hover:shadow-2xl transition-all duration-300 hover:scale-105 flex flex-col justify-between min-h-[280px]">
            <div>
              <div className="w-16 h-16 bg-white/20 backdrop-blur-sm rounded-2xl flex items-center justify-center mb-6">
                <Heart className="h-8 w-8" />
              </div>
              <h3 className="text-2xl font-bold mb-3">{category.name}</h3>
              <p className="text-white/90 text-sm leading-relaxed mb-6">
                {category.description || "Lezzetli tarifler"}
              </p>
            </div>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Badge variant="secondary" className="bg-white/20 backdrop-blur-sm text-white border-0">
                  {recipes.length}+ Tarif
                </Badge>
                <div className="flex items-center gap-1 text-sm text-white/80">
                  <Eye className="h-4 w-4" />
                  1.2k
                </div>
              </div>
              <div className="flex items-center gap-2 text-sm font-semibold">
                Görüntüle
                <ArrowRight className="h-4 w-4" />
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
          <CarouselContent className="-ml-4">
            {recipes.slice(0, 10).map((recipe) => (
              <CarouselItem key={recipe.id} className="pl-4 basis-full sm:basis-1/2 lg:basis-1/3">
                <Link to={`/recipe/${recipe.id}`}>
                  <div className="group relative rounded-2xl overflow-hidden h-[280px] shadow-lg hover:shadow-2xl transition-all duration-300 hover:scale-105">
                    <img
                      src={recipe.image_url || "https://images.unsplash.com/photo-1565299624946-b28f40a0ca4b?w=400&h=300&fit=crop"}
                      alt={recipe.title || "Tarif"}
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent" />
                    <div className="absolute bottom-0 left-0 right-0 p-6 text-white">
                      <h4 className="font-bold text-xl mb-2 line-clamp-2">
                        {recipe.title || "Başlıksız Tarif"}
                      </h4>
                      <div className="flex items-center gap-3 text-sm">
                        <div className="flex items-center gap-1">
                          <div className="w-8 h-8 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center">
                            <span className="text-xs font-medium">
                              {(recipe.author_name || "AN").charAt(0)}
                            </span>
                          </div>
                          <span className="text-white/90">
                            {recipe.author_name || "Anonim"}
                          </span>
                        </div>
                      </div>
                      <div className="absolute top-4 right-4">
                        <Badge className="bg-black/50 backdrop-blur-sm text-white border-0">
                          iStock
                        </Badge>
                      </div>
                    </div>
                  </div>
                </Link>
              </CarouselItem>
            ))}
          </CarouselContent>
          <CarouselPrevious className="hidden lg:flex -left-12" />
          <CarouselNext className="hidden lg:flex -right-12" />
        </Carousel>
      </div>
    </div>
  );
};

export default CategoryShowcase;
