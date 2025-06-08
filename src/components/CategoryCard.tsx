
import { Card, CardContent } from "@/components/ui/card";

interface CategoryCardProps {
  title: string;
  description: string;
  icon: string;
  recipeCount: number;
  color: string;
}

const CategoryCard = ({ title, description, icon, recipeCount, color }: CategoryCardProps) => {
  return (
    <Card className={`group cursor-pointer overflow-hidden rounded-xl border-0 shadow-md hover:shadow-xl transition-all duration-300 ${color}`}>
      <CardContent className="p-6 text-center">
        <div className="text-4xl mb-3 group-hover:scale-110 transition-transform duration-300">
          {icon}
        </div>
        <h3 className="font-semibold text-lg text-gray-900 mb-2">
          {title}
        </h3>
        <p className="text-gray-600 text-sm mb-3">
          {description}
        </p>
        <div className="text-xs text-gray-500">
          {recipeCount} tarif
        </div>
      </CardContent>
    </Card>
  );
};

export default CategoryCard;
