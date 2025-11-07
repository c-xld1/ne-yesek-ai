import { useParams, useNavigate } from "react-router-dom";
import { useState } from "react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Textarea } from "@/components/ui/textarea";
import LoadingSpinner from "@/components/LoadingSpinner";
import { useBlogPost, useBlogComments, useLikeBlogPost } from "@/hooks/useBlogPosts";
import { useAuth } from "@/contexts/AuthContext";
import { useToast } from "@/hooks/use-toast";
import { ArrowLeft, Calendar, User, Heart, MessageCircle, Eye, Share2 } from "lucide-react";

const BlogDetail = () => {
  const { slug } = useParams<{ slug: string }>();
  const navigate = useNavigate();
  const { user } = useAuth();
  const { toast } = useToast();
  
  const { data: post, isLoading: postLoading } = useBlogPost(slug || "");
  const { data: comments = [], isLoading: commentsLoading } = useBlogComments(post?.id || "");
  const likeMutation = useLikeBlogPost();

  const [newComment, setNewComment] = useState("");

  // Simple markdown to HTML converter
  const renderMarkdown = (text: string) => {
    let html = text
      // Headers
      .replace(/^### (.*$)/gim, '<h3 class="text-xl font-semibold mt-6 mb-3">$1</h3>')
      .replace(/^## (.*$)/gim, '<h2 class="text-2xl font-bold mt-8 mb-4">$1</h2>')
      .replace(/^# (.*$)/gim, '<h1 class="text-3xl font-bold mt-10 mb-5">$1</h1>')
      // Bold
      .replace(/\*\*(.*?)\*\*/g, '<strong class="font-semibold">$1</strong>')
      // Italic
      .replace(/\*(.*?)\*/g, '<em class="italic">$1</em>')
      // Lists
      .replace(/^\- (.*$)/gim, '<li class="ml-4 mb-2">$1</li>')
      // Paragraphs
      .replace(/\n\n/g, '</p><p class="mb-4">')
      .replace(/\n/g, '<br/>');
    
    // Wrap in paragraph
    html = '<p class="mb-4">' + html + '</p>';
    
    // Wrap lists
    html = html.replace(/(<li.*<\/li>)/g, '<ul class="list-disc ml-6 space-y-2 my-4">$1</ul>');
    
    return html;
  };

  const handleLike = async () => {
    if (!user) {
      toast({
        title: "Giriş Gerekli",
        description: "Beğenmek için giriş yapmalısınız",
        variant: "destructive",
      });
      return;
    }

    try {
      await likeMutation.mutateAsync(post?.id || "");
    } catch (error: any) {
      toast({
        title: "Hata",
        description: error.message,
        variant: "destructive",
      });
    }
  };

  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title: post?.title,
        text: post?.excerpt,
        url: window.location.href,
      });
    } else {
      navigator.clipboard.writeText(window.location.href);
      toast({
        title: "✅ Bağlantı Kopyalandı",
        description: "Blog bağlantısı panoya kopyalandı",
      });
    }
  };

  if (postLoading) {
    return (
      <div className="min-h-screen bg-background">
        <Navbar />
        <div className="flex items-center justify-center py-20">
          <LoadingSpinner />
        </div>
      </div>
    );
  }

  if (!post) {
    return (
      <div className="min-h-screen bg-background">
        <Navbar />
        <div className="container mx-auto px-4 py-12 text-center">
          <h1 className="text-2xl font-bold mb-4">Blog yazısı bulunamadı</h1>
          <Button onClick={() => navigate("/blog")}>
            <ArrowLeft className="h-4 w-4 mr-2" />
            Bloga Dön
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background pb-20">
      <Navbar />
      
      <div className="container mx-auto px-4 py-6 max-w-4xl">
        <Button
          variant="ghost"
          onClick={() => navigate("/blog")}
          className="mb-4"
        >
          <ArrowLeft className="h-4 w-4 mr-2" />
          Blaga Dön
        </Button>

        <article>
          {/* Header Image */}
          {post.image && (
            <img
              src={post.image}
              alt={post.title}
              className="w-full h-[400px] object-cover rounded-xl mb-6"
            />
          )}

          {/* Title and Meta */}
          <div className="mb-8">
            <Badge className="mb-4">{post.category}</Badge>
            <h1 className="text-4xl font-bold mb-4">{post.title}</h1>
            <p className="text-xl text-muted-foreground mb-6">{post.excerpt}</p>

            <div className="flex items-center gap-6 text-sm text-muted-foreground">
              <div className="flex items-center gap-2">
                <Avatar className="h-8 w-8">
                  <AvatarImage src={post.author.avatar} />
                  <AvatarFallback>{post.author.name[0]}</AvatarFallback>
                </Avatar>
                <span className="font-medium">{post.author.name}</span>
              </div>
              <div className="flex items-center gap-1">
                <Calendar className="h-4 w-4" />
                <span>{post.date}</span>
              </div>
              <div className="flex items-center gap-1">
                <Eye className="h-4 w-4" />
                <span>{post.views}</span>
              </div>
              <span>{post.readTime} okuma</span>
            </div>
          </div>

          {/* Content */}
          <Card className="p-8 mb-8">
            <div
              className="prose prose-lg max-w-none"
              dangerouslySetInnerHTML={{ __html: renderMarkdown(post.content) }}
            />
          </Card>

          {/* Tags */}
          {post.tags && post.tags.length > 0 && (
            <div className="flex flex-wrap gap-2 mb-8">
              {post.tags.map((tag) => (
                <Badge key={tag} variant="secondary">
                  #{tag}
                </Badge>
              ))}
            </div>
          )}

          {/* Actions */}
          <div className="flex items-center gap-4 mb-8 pb-8 border-b">
            <Button
              variant="outline"
              onClick={handleLike}
              disabled={likeMutation.isPending}
              className="flex items-center gap-2"
            >
              <Heart className="h-4 w-4" />
              Beğen ({post.likes})
            </Button>
            <Button
              variant="outline"
              onClick={handleShare}
              className="flex items-center gap-2"
            >
              <Share2 className="h-4 w-4" />
              Paylaş
            </Button>
            <div className="ml-auto flex items-center gap-2 text-muted-foreground">
              <MessageCircle className="h-4 w-4" />
              <span>{post.comments} Yorum</span>
            </div>
          </div>

          {/* Comments Section */}
          <div className="space-y-6">
            <h2 className="text-2xl font-bold">Yorumlar ({comments.length})</h2>

            {/* Add Comment */}
            {user ? (
              <Card className="p-4">
                <Textarea
                  placeholder="Yorumunuzu yazın..."
                  value={newComment}
                  onChange={(e) => setNewComment(e.target.value)}
                  rows={3}
                  className="mb-3"
                />
                <Button disabled className="w-full">
                  Yorum Yap (Yakında)
                </Button>
              </Card>
            ) : (
              <Card className="p-6 text-center">
                <p className="text-muted-foreground mb-4">
                  Yorum yapmak için giriş yapmalısınız
                </p>
                <Button onClick={() => navigate("/giris-yap")}>
                  Giriş Yap
                </Button>
              </Card>
            )}

            {/* Comments List */}
            {commentsLoading ? (
              <LoadingSpinner />
            ) : comments.length === 0 ? (
              <Card className="p-12 text-center">
                <MessageCircle className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
                <p className="text-muted-foreground">Henüz yorum yapılmamış</p>
              </Card>
            ) : (
              <div className="space-y-4">
                {comments.map((comment: any) => (
                  <Card key={comment.id} className="p-4">
                    <div className="flex items-start gap-3">
                      <Avatar>
                        <AvatarImage src={comment.profiles?.avatar_url} />
                        <AvatarFallback>
                          {comment.profiles?.fullname?.[0] || comment.profiles?.username?.[0] || "?"}
                        </AvatarFallback>
                      </Avatar>
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          <span className="font-medium">
                            {comment.profiles?.fullname || comment.profiles?.username}
                          </span>
                          <span className="text-sm text-muted-foreground">
                            {new Date(comment.created_at).toLocaleDateString("tr-TR")}
                          </span>
                        </div>
                        <p className="text-sm">{comment.content}</p>
                      </div>
                    </div>
                  </Card>
                ))}
              </div>
            )}
          </div>
        </article>
      </div>

      <Footer />
    </div>
  );
};

export default BlogDetail;
