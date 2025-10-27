import { useState, useEffect } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Card, CardContent } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { MessageCircle, Send, Edit2, Trash2, Loader2 } from "lucide-react";
import { formatDistanceToNow } from "date-fns";
import { tr } from "date-fns/locale";

interface Comment {
  id: string;
  content: string;
  created_at: string;
  updated_at: string;
  user_id: string;
  profiles?: {
    fullname: string;
    username: string;
    avatar_url?: string;
  };
}

interface RecipeCommentsProps {
  recipeId: string;
}

export const RecipeComments = ({ recipeId }: RecipeCommentsProps) => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [comments, setComments] = useState<Comment[]>([]);
  const [newComment, setNewComment] = useState("");
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editText, setEditText] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    loadComments();
  }, [recipeId]);

  const loadComments = async () => {
    setIsLoading(true);
    try {
      const { data, error } = await supabase
        .from('recipe_comments')
        .select('*')
        .eq('recipe_id', recipeId)
        .order('created_at', { ascending: false });

      if (error) throw error;

      // Fetch profile data separately for each comment
      const commentsWithProfiles = await Promise.all(
        (data || []).map(async (comment) => {
          const { data: profile } = await supabase
            .from('profiles')
            .select('fullname, username, avatar_url')
            .eq('id', comment.user_id)
            .single();

          return {
            ...comment,
            profiles: profile || undefined
          };
        })
      );

      setComments(commentsWithProfiles as Comment[]);
    } catch (error) {
      console.error('Error loading comments:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSubmit = async () => {
    if (!user) {
      toast({
        variant: "destructive",
        title: "Giriş Gerekli",
        description: "Yorum yapmak için giriş yapmalısınız.",
      });
      return;
    }

    if (!newComment.trim()) {
      toast({
        variant: "destructive",
        title: "Boş Yorum",
        description: "Lütfen bir yorum yazın.",
      });
      return;
    }

    setIsSubmitting(true);
    try {
      const { error } = await supabase
        .from('recipe_comments')
        .insert({
          recipe_id: recipeId,
          user_id: user.id,
          content: newComment.trim()
        });

      if (error) throw error;

      setNewComment("");
      loadComments();
      toast({
        title: "Yorum Eklendi",
        description: "Yorumunuz başarıyla eklendi.",
      });
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Hata",
        description: "Yorum eklenirken hata oluştu.",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleEdit = async (commentId: string) => {
    if (!editText.trim()) return;

    try {
      const { error } = await supabase
        .from('recipe_comments')
        .update({ content: editText.trim() })
        .eq('id', commentId);

      if (error) throw error;

      setEditingId(null);
      setEditText("");
      loadComments();
      toast({
        title: "Yorum Güncellendi",
        description: "Yorumunuz başarıyla güncellendi.",
      });
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Hata",
        description: "Yorum güncellenirken hata oluştu.",
      });
    }
  };

  const handleDelete = async (commentId: string) => {
    if (!confirm("Yorumu silmek istediğinizden emin misiniz?")) return;

    try {
      const { error } = await supabase
        .from('recipe_comments')
        .delete()
        .eq('id', commentId);

      if (error) throw error;

      loadComments();
      toast({
        title: "Yorum Silindi",
        description: "Yorumunuz başarıyla silindi.",
      });
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Hata",
        description: "Yorum silinirken hata oluştu.",
      });
    }
  };

  return (
    <Card className="bg-white/80 backdrop-blur-sm shadow-xl border border-orange-100 rounded-3xl overflow-hidden">
      <CardContent className="p-8">
        <h3 className="text-2xl font-bold text-gray-800 mb-6 flex items-center gap-2">
          <MessageCircle className="h-6 w-6 text-orange-500" />
          Yorumlar ({comments.length})
        </h3>

        {user && (
          <div className="mb-6">
            <Textarea
              placeholder="Yorumunuzu yazın..."
              value={newComment}
              onChange={(e) => setNewComment(e.target.value)}
              rows={3}
              className="mb-3"
            />
            <Button
              onClick={handleSubmit}
              disabled={isSubmitting || !newComment.trim()}
              className="bg-gradient-to-r from-orange-500 to-red-500"
            >
              {isSubmitting ? (
                <Loader2 className="h-4 w-4 animate-spin mr-2" />
              ) : (
                <Send className="h-4 w-4 mr-2" />
              )}
              Yorum Yap
            </Button>
          </div>
        )}

        <div className="space-y-4">
          {isLoading ? (
            <div className="flex justify-center py-8">
              <Loader2 className="h-8 w-8 animate-spin text-orange-500" />
            </div>
          ) : comments.length === 0 ? (
            <p className="text-center text-gray-500 py-8">
              Henüz yorum yapılmamış. İlk yorumu siz yapın!
            </p>
          ) : (
            comments.map((comment) => (
              <div
                key={comment.id}
                className="p-4 bg-gradient-to-r from-orange-50/50 to-orange-100/30 rounded-2xl border border-orange-100"
              >
                <div className="flex items-start gap-3">
                  <Avatar>
                    <AvatarImage src={comment.profiles?.avatar_url} />
                    <AvatarFallback>
                      {comment.profiles?.fullname?.[0] || 'U'}
                    </AvatarFallback>
                  </Avatar>
                  <div className="flex-1">
                    <div className="flex items-center justify-between mb-1">
                      <div>
                        <p className="font-semibold text-gray-800">
                          {comment.profiles?.fullname || 'Kullanıcı'}
                        </p>
                        <p className="text-sm text-gray-500">
                          {formatDistanceToNow(new Date(comment.created_at), {
                            addSuffix: true,
                            locale: tr
                          })}
                        </p>
                      </div>
                      {user?.id === comment.user_id && (
                        <div className="flex gap-2">
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => {
                              setEditingId(comment.id);
                              setEditText(comment.content);
                            }}
                          >
                            <Edit2 className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleDelete(comment.id)}
                          >
                            <Trash2 className="h-4 w-4 text-red-500" />
                          </Button>
                        </div>
                      )}
                    </div>

                    {editingId === comment.id ? (
                      <div className="mt-2">
                        <Textarea
                          value={editText}
                          onChange={(e) => setEditText(e.target.value)}
                          rows={2}
                          className="mb-2"
                        />
                        <div className="flex gap-2">
                          <Button
                            size="sm"
                            onClick={() => handleEdit(comment.id)}
                          >
                            Kaydet
                          </Button>
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => {
                              setEditingId(null);
                              setEditText("");
                            }}
                          >
                            İptal
                          </Button>
                        </div>
                      </div>
                    ) : (
                      <p className="text-gray-700 mt-2">{comment.content}</p>
                    )}
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default RecipeComments;