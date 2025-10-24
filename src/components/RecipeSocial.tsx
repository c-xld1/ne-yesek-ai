import { useState, useEffect } from "react";
import { Heart, MessageCircle, Share2, Bookmark } from "lucide-react";
import { Button } from "./ui/button";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

interface RecipeSocialProps {
  recipeId: string;
  initialLikes?: number;
  showComments?: boolean;
}

const RecipeSocial = ({ recipeId, initialLikes = 0, showComments = false }: RecipeSocialProps) => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [isLiked, setIsLiked] = useState(false);
  const [isFavorited, setIsFavorited] = useState(false);
  const [likesCount, setLikesCount] = useState(initialLikes);

  useEffect(() => {
    if (user) {
      checkUserInteractions();
    }
  }, [user, recipeId]);

  const checkUserInteractions = async () => {
    if (!user) return;

    const { data: favoriteData } = await supabase
      .from("recipe_favorites")
      .select("id")
      .eq("user_id", user.id)
      .eq("recipe_id", recipeId)
      .single();

    setIsFavorited(!!favoriteData);
  };

  const handleLike = async () => {
    if (!user) {
      toast({ title: "Giriş Yapın", description: "Beğenmek için giriş yapmalısınız" });
      return;
    }

    const newLikesCount = isLiked ? likesCount - 1 : likesCount + 1;
    setIsLiked(!isLiked);
    setLikesCount(newLikesCount);

    const { error } = await supabase
      .from("recipes")
      .update({ likes: newLikesCount })
      .eq("id", recipeId);

    if (error) {
      console.error("Error updating likes:", error);
      setIsLiked(isLiked);
      setLikesCount(likesCount);
    }
  };

  const handleFavorite = async () => {
    if (!user) {
      toast({ title: "Giriş Yapın", description: "Kaydetmek için giriş yapmalısınız" });
      return;
    }

    if (isFavorited) {
      const { error } = await supabase
        .from("recipe_favorites")
        .delete()
        .eq("user_id", user.id)
        .eq("recipe_id", recipeId);

      if (!error) {
        setIsFavorited(false);
        toast({ title: "Favorilerden Çıkarıldı" });
      }
    } else {
      const { error } = await supabase
        .from("recipe_favorites")
        .insert([{ user_id: user.id, recipe_id: recipeId }]);

      if (!error) {
        setIsFavorited(true);
        toast({ title: "Favorilere Eklendi" });
      }
    }
  };

  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: "Tarif Paylaş",
          url: window.location.origin + `/tarif/${recipeId}`,
        });
      } catch (error) {
        console.log("Share cancelled");
      }
    } else {
      navigator.clipboard.writeText(window.location.origin + `/tarif/${recipeId}`);
      toast({ title: "Link Kopyalandı" });
    }
  };

  return (
    <div className="flex items-center gap-4">
      <Button
        variant="ghost"
        size="sm"
        className="gap-2"
        onClick={handleLike}
      >
        <Heart className={`h-5 w-5 ${isLiked ? 'fill-red-500 text-red-500' : ''}`} />
        <span>{likesCount}</span>
      </Button>

      {showComments && (
        <Button variant="ghost" size="sm" className="gap-2">
          <MessageCircle className="h-5 w-5" />
          <span>Yorum</span>
        </Button>
      )}

      <Button
        variant="ghost"
        size="sm"
        onClick={handleFavorite}
      >
        <Bookmark className={`h-5 w-5 ${isFavorited ? 'fill-current' : ''}`} />
      </Button>

      <Button variant="ghost" size="sm" onClick={handleShare}>
        <Share2 className="h-5 w-5" />
      </Button>
    </div>
  );
};

export default RecipeSocial;
