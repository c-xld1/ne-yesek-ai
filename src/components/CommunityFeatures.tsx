
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Heart, MessageCircle, Bookmark, UserPlus, Trophy, Star, Flame, Crown } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface CommunityFeaturesProps {
  recipeId: string;
  initialLikes?: number;
  initialComments?: number;
  initialBookmarks?: number;
}

const CommunityFeatures = ({ 
  recipeId, 
  initialLikes = 0, 
  initialComments = 0, 
  initialBookmarks = 0 
}: CommunityFeaturesProps) => {
  const [likes, setLikes] = useState(initialLikes);
  const [comments, setComments] = useState(initialComments);
  const [bookmarks, setBookmarks] = useState(initialBookmarks);
  const [isLiked, setIsLiked] = useState(false);
  const [isBookmarked, setIsBookmarked] = useState(false);
  const [isFollowing, setIsFollowing] = useState(false);
  const { toast } = useToast();

  const userBadges = [
    { name: "Tatlı Ustası", icon: Trophy, color: "bg-pink-100 text-pink-800" },
    { name: "Et Tiryakisi", icon: Flame, color: "bg-red-100 text-red-800" },
    { name: "Haftanın Şefi", icon: Crown, color: "bg-yellow-100 text-yellow-800" },
    { name: "Yeni Başlayan", icon: Star, color: "bg-blue-100 text-blue-800" }
  ];

  const handleLike = () => {
    setIsLiked(!isLiked);
    setLikes(isLiked ? likes - 1 : likes + 1);
    toast({
      title: isLiked ? "💔 Beğeni geri alındı" : "❤️ Tarif beğenildi",
      description: isLiked ? "Tariften beğeninizi geri aldınız" : "Bu tarifi beğendiniz!",
    });
  };

  const handleBookmark = () => {
    setIsBookmarked(!isBookmarked);
    setBookmarks(isBookmarked ? bookmarks - 1 : bookmarks + 1);
    toast({
      title: isBookmarked ? "🗂️ Favorilerden çıkarıldı" : "🔖 Favorilere eklendi",
      description: isBookmarked ? "Tarif favorilerinizden çıkarıldı" : "Tarif favorilerinize eklendi!",
    });
  };

  const handleFollow = () => {
    setIsFollowing(!isFollowing);
    toast({
      title: isFollowing ? "👋 Takibi bıraktınız" : "👥 Takip ediyorsunuz",
      description: isFollowing ? "Artık bu şefi takip etmiyorsunuz" : "Bu şefi takip etmeye başladınız!",
    });
  };

  return (
    <Card className="mb-6">
      <CardContent className="p-6">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-4">
            <Button
              variant={isLiked ? "default" : "outline"}
              size="sm"
              onClick={handleLike}
              className={isLiked ? "bg-red-500 hover:bg-red-600 text-white" : ""}
            >
              <Heart className={`h-4 w-4 mr-1 ${isLiked ? 'fill-current' : ''}`} />
              {likes} Beğeni
            </Button>
            <Button variant="outline" size="sm">
              <MessageCircle className="h-4 w-4 mr-1" />
              {comments} Yorum
            </Button>
            <Button
              variant={isBookmarked ? "default" : "outline"}
              size="sm"
              onClick={handleBookmark}
              className={isBookmarked ? "bg-blue-500 hover:bg-blue-600 text-white" : ""}
            >
              <Bookmark className={`h-4 w-4 mr-1 ${isBookmarked ? 'fill-current' : ''}`} />
              {bookmarks}
            </Button>
          </div>
          <Button
            variant={isFollowing ? "default" : "outline"}
            size="sm"
            onClick={handleFollow}
            className={isFollowing ? "bg-green-500 hover:bg-green-600 text-white" : ""}
          >
            <UserPlus className="h-4 w-4 mr-1" />
            {isFollowing ? "Takip Ediliyor" : "Takip Et"}
          </Button>
        </div>

        {/* Kullanıcı Rozetleri */}
        <div className="flex flex-wrap gap-2 mb-4">
          {userBadges.slice(0, 2).map((badge, index) => (
            <Badge key={index} className={`${badge.color} flex items-center gap-1`}>
              <badge.icon className="h-3 w-3" />
              {badge.name}
            </Badge>
          ))}
        </div>

        {/* Tarif Savaşları */}
        <div className="bg-gradient-to-r from-orange-50 to-red-50 p-4 rounded-lg">
          <h4 className="font-semibold text-lg mb-2 flex items-center gap-2">
            ⚔️ Bu Haftanın Tarif Savaşı
          </h4>
          <p className="text-sm text-gray-600 mb-3">
            "Tavuk Sote" vs "Etli Pilav" - Hangi tarif daha lezzetli?
          </p>
          <div className="flex gap-2">
            <Button size="sm" className="bg-orange-500 hover:bg-orange-600 text-white">
              Tavuk Sote'ye Oy Ver (245)
            </Button>
            <Button size="sm" variant="outline">
              Etli Pilav'a Oy Ver (189)
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default CommunityFeatures;
