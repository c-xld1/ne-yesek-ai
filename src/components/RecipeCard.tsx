
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Clock, Star, User } from "lucide-react";

interface RecipeCardProps {
  title: string;
  image: string;
  cookingTime: string;
  difficulty: "Kolay" | "Orta" | "Zor";
  rating: number;
  author: string;
  dblScore?: number;
  description: string;
}

const RecipeCard = ({ 
  title, 
  image, 
  cookingTime, 
  difficulty, 
  rating, 
  author, 
  dblScore,
  description 
}: RecipeCardProps) => {
  const getDifficultyColor = (diff: string) => {
    switch (diff) {
      case "Kolay": return "bg-green-100 text-green-800";
      case "Orta": return "bg-yellow-100 text-yellow-800";
      case "Zor": return "bg-red-100 text-red-800";
      default: return "bg-gray-100 text-gray-800";
    }
  };

  return (
    <Card className="group overflow-hidden rounded-xl border-0 shadow-md hover:shadow-xl transition-all duration-300 bg-white">
      {/* Image */}
      <div className="relative overflow-hidden">
        <img 
          src={image} 
          alt={title}
          className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-300"
        />
        <div className="absolute top-3 left-3">
          <span className={`px-2 py-1 rounded-full text-xs font-medium ${getDifficultyColor(difficulty)}`}>
            {difficulty}
          </span>
        </div>
        {dblScore && (
          <div className="absolute top-3 right-3 bg-food-600 text-white px-2 py-1 rounded-full text-xs font-bold">
            DBL: {dblScore}
          </div>
        )}
      </div>

      <CardContent className="p-4">
        <h3 className="font-semibold text-lg text-gray-900 mb-2 line-clamp-2 group-hover:text-food-600 transition-colors">
          {title}
        </h3>
        
        <p className="text-gray-600 text-sm mb-3 line-clamp-2">
          {description}
        </p>

        {/* Meta Info */}
        <div className="flex items-center justify-between text-sm text-gray-500 mb-3">
          <div className="flex items-center gap-1">
            <Clock className="h-4 w-4" />
            <span>{cookingTime}</span>
          </div>
          <div className="flex items-center gap-1">
            <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
            <span>{rating}</span>
          </div>
        </div>

        {/* Author */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <User className="h-4 w-4 text-gray-400" />
            <span className="text-sm text-gray-600">{author}</span>
          </div>
          <Button size="sm" variant="ghost" className="text-food-600 hover:text-food-700 hover:bg-food-50">
            Tarife Git →
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default RecipeCard;
