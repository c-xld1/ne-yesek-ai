import React, { useRef } from "react";
import { Button } from "@/components/ui/button";
import { ChevronLeft, ChevronRight } from "lucide-react";

interface Category {
  id: string;
  label: string;
  icon: string;
  count?: number;
}

interface CategorySliderProps {
  categories: Category[];
  selectedCategory: string | null;
  onSelectCategory: (categoryId: string) => void;
}

const CategorySlider: React.FC<CategorySliderProps> = ({
  categories,
  selectedCategory,
  onSelectCategory,
}) => {
  const scrollContainerRef = useRef<HTMLDivElement>(null);

  const scroll = (direction: "left" | "right") => {
    if (scrollContainerRef.current) {
      const scrollAmount = 300;
      scrollContainerRef.current.scrollBy({
        left: direction === "left" ? -scrollAmount : scrollAmount,
        behavior: "smooth",
      });
    }
  };

  return (
    <div className="relative group">
      {/* Left Arrow */}
      <Button
        variant="ghost"
        size="sm"
        className="absolute left-0 top-1/2 -translate-y-1/2 z-10 bg-white hover:bg-white shadow-sm opacity-0 group-hover:opacity-100 transition-opacity h-8 w-8 p-0 rounded-full"
        onClick={() => scroll("left")}
      >
        <ChevronLeft className="h-4 w-4" />
      </Button>

      {/* Categories Container */}
      <div
        ref={scrollContainerRef}
        className="flex gap-2 overflow-x-auto scrollbar-hide py-1 scroll-smooth"
        style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
      >
        {/* All Categories Button */}
        <button
          onClick={() => onSelectCategory("all")}
          className={`flex flex-col items-center justify-center min-w-[80px] h-20 rounded-lg border transition-all hover:scale-105 ${
            selectedCategory === "all" || selectedCategory === null
              ? "border-orange-500 bg-orange-50 shadow-sm"
              : "border-gray-200 bg-white hover:border-orange-200"
          }`}
        >
          <span className="text-2xl mb-0.5">🍽️</span>
          <span className="text-xs font-medium text-gray-700">Tümü</span>
        </button>

        {/* Category Items */}
        {categories.map((category) => (
          <button
            key={category.id}
            onClick={() => onSelectCategory(category.id)}
            className={`flex flex-col items-center justify-center min-w-[80px] h-20 rounded-lg border transition-all hover:scale-105 ${
              selectedCategory === category.id
                ? "border-orange-500 bg-orange-50 shadow-sm"
                : "border-gray-200 bg-white hover:border-orange-200"
            }`}
          >
            <span className="text-2xl mb-0.5">{category.icon}</span>
            <span className="text-xs font-medium text-gray-700 text-center px-1.5 line-clamp-1">
              {category.label}
            </span>
            {category.count && category.count > 0 && (
              <span className="text-[10px] text-gray-500">
                {category.count}
              </span>
            )}
          </button>
        ))}
      </div>

      {/* Right Arrow */}
      <Button
        variant="ghost"
        size="sm"
        className="absolute right-0 top-1/2 -translate-y-1/2 z-10 bg-white hover:bg-white shadow-sm opacity-0 group-hover:opacity-100 transition-opacity h-8 w-8 p-0 rounded-full"
        onClick={() => scroll("right")}
      >
        <ChevronRight className="h-4 w-4" />
      </Button>
    </div>
  );
};

export default CategorySlider;
