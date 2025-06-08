
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Clock, Star, User, Heart, Share2, BookOpen, ChefHat } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { Link } from "react-router-dom";

interface RecipeCardProps {
  title: string;
  image: string;
  cookingTime: string;
  difficulty: "Kolay" | "Orta" | "Zor";
  rating: number;
  author: string;
  dblScore?: number;
  description: string;
  id?: string;
}

const RecipeCard = ({ 
  title, 
  image, 
  cookingTime, 
  difficulty, 
  rating, 
  author, 
  dblScore,
  description,
  id = "1"
}: RecipeCardProps) => {
  const [isFavorited, setIsFavorited] = useState(false);
  const [isSharing, setIsSharing] = useState(false);
  const { toast } = useToast();

  const getDifficultyColor = (diff: string) => {
    switch (diff) {
      case "Kolay": return "bg-green-100 text-green-800 border-green-200";
      case "Orta": return "bg-yellow-100 text-yellow-800 border-yellow-200";
      case "Zor": return "bg-red-100 text-red-800 border-red-200";
      default: return "bg-gray-100 text-gray-800 border-gray-200";
    }
  };

  const handleFavorite = () => {
    setIsFavorited(!isFavorited);
    toast({
      title: isFavorited ? "Favorilerden çıkarıldı" : "Favorilere eklendi",
      description: `"${title}" ${isFavorited ? 'favorilerden çıkarıldı' : 'favorilerinize eklendi'}`,
    });
  };

  const handleShare = async () => {
    setIsSharing(true);
    try {
      if (navigator.share) {
        await navigator.share({
          title: title,
          text: description,
          url: window.location.href,
        });
      } else {
        await navigator.clipboard.writeText(window.location.href);
        toast({
          title: "Link kopyalandı",
          description: "Tarif linki panoya kopyalandı",
        });
      }
    } catch (error) {
      console.log('Share failed:', error);
    } finally {
      setIsSharing(false);
    }
  };

  return (
    <Card className="group overflow-hidden rounded-xl border-0 shadow-md hover:shadow-2xl transition-all duration-500 bg-white hover:-translate-y-2">
      {/* Image */}
      <div className="relative overflow-hidden">
        <img 
          src={image} 
          alt={title}
          className="w-full h-48 object-cover group-hover:scale-110 transition-transform duration-500"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
        
        <div className="absolute top-3 left-3">
          <span className={`px-3 py-1 rounded-full text-xs font-medium border backdrop-blur-sm ${getDifficultyColor(difficulty)}`}>
            {difficulty}
          </span>
        </div>
        
        {dblScore && (
          <div className="absolute top-3 right-3 bg-food-600 text-white px-3 py-1 rounded-full text-xs font-bold shadow-lg">
            DBL: {dblScore}
          </div>
        )}

        {/* Action buttons overlay */}
        <div className="absolute top-3 right-3 flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300" style={{marginTop: dblScore ? '35px' : '0'}}>
          <Button
            size="sm"
            variant="ghost"
            className="bg-white/80 backdrop-blur-sm hover:bg-white text-gray-700 h-8 w-8 p-0"
            onClick={handleFavorite}
          >
            <Heart className={`h-4 w-4 ${isFavorited ? 'fill-red-500 text-red-500' : ''}`} />
          </Button>
          <Button
            size="sm"
            variant="ghost"
            className="bg-white/80 backdrop-blur-sm hover:bg-white text-gray-700 h-8 w-8 p-0"
            onClick={handleShare}
            disabled={isSharing}
          >
            <Share2 className="h-4 w-4" />
          </Button>
        </div>
      </div>

      <CardContent className="p-4">
        <div className="flex items-start justify-between mb-2">
          <h3 className="font-semibold text-lg text-gray-900 line-clamp-2 group-hover:text-food-600 transition-colors flex-1">
            {title}
          </h3>
          <div className="flex items-center gap-1 ml-2">
            <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
            <span className="text-sm font-medium">{rating}</span>
          </div>
        </div>
        
        <p className="text-gray-600 text-sm mb-4 line-clamp-2 leading-relaxed">
          {description}
        </p>

        {/* Meta Info */}
        <div className="flex items-center justify-between text-sm text-gray-500 mb-4">
          <div className="flex items-center gap-1">
            <Clock className="h-4 w-4" />
            <span>{cookingTime}</span>
          </div>
          <div className="flex items-center gap-1">
            <ChefHat className="h-4 w-4" />
            <span className="text-xs">{author}</span>
          </div>
        </div>

        {/* Author and Action */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-food-100 rounded-full flex items-center justify-center">
              <User className="h-4 w-4 text-food-600" />
            </div>
            <span className="text-sm text-gray-600 font-medium">{author}</span>
          </div>
          <Link to={`/tarif/${id}`}>
            <Button size="sm" className="gradient-primary text-white hover:opacity-90 transition-all duration-300 hover:scale-105">
              <BookOpen className="h-3 w-3 mr-1" />
              Tarife Git
            </Button>
          </Link>
        </div>
      </CardContent>
    </Card>
  );
};

export default RecipeCard;
