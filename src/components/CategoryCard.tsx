
import { Card, CardContent } from "@/components/ui/card";
import { TrendingUp, Users } from "lucide-react";

interface CategoryCardProps {
  title: string;
  description: string;
  icon: string;
  recipeCount: number;
  color: string;
}

const CategoryCard = ({ title, description, icon, recipeCount, color }: CategoryCardProps) => {
  return (
    <Card className={`group cursor-pointer overflow-hidden rounded-xl border-0 shadow-md hover:shadow-xl transition-all duration-500 hover:-translate-y-2 ${color}`}>
      <CardContent className="p-6 text-center relative">
        <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
          <TrendingUp className="h-4 w-4 text-food-600" />
        </div>
        
        <div className="text-4xl mb-3 group-hover:scale-125 transition-transform duration-500">
          {icon}
        </div>
        
        <h3 className="font-semibold text-lg text-gray-900 mb-2 group-hover:text-food-700 transition-colors">
          {title}
        </h3>
        
        <p className="text-gray-600 text-sm mb-3 group-hover:text-gray-700">
          {description}
        </p>
        
        <div className="flex items-center justify-center gap-1 text-xs text-gray-500 group-hover:text-food-600">
          <Users className="h-3 w-3" />
          <span className="font-medium">{recipeCount} tarif</span>
        </div>
        
        {/* Hover effect */}
        <div className="absolute inset-0 bg-white/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-xl"></div>
      </CardContent>
    </Card>
  );
};

export default CategoryCard;
