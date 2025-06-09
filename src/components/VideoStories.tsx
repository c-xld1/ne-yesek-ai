
import { useState, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Heart, MessageCircle, Bookmark, Share2, Play, ChevronLeft, ChevronRight, Plus } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface VideoStory {
  id: string;
  title: string;
  videoUrl: string;
  thumbnail: string;
  username: string;
  userAvatar: string;
  category: string;
  cookingTime?: string;
  ingredients?: string[];
  likes: number;
  comments: number;
  isLiked: boolean;
  isSaved: boolean;
}

const VideoStories = () => {
  const [selectedStory, setSelectedStory] = useState<VideoStory | null>(null);
  const [stories, setStories] = useState<VideoStory[]>([
    {
      id: "1",
      title: "60 Saniyede Tavuk Sote",
      videoUrl: "https://www.youtube.com/embed/dQw4w9WgXcQ",
      thumbnail: "https://images.unsplash.com/photo-1598103442097-8b74394b95c6?w=200&h=200&fit=crop",
      username: "Chef Ayşe",
      userAvatar: "https://images.unsplash.com/photo-1494790108755-2616b612b47c?w=100&h=100&fit=crop",
      category: "Ana Yemek",
      cookingTime: "25 dk",
      ingredients: ["Tavuk göğsü", "Soğan", "Domates", "Biber"],
      likes: 245,
      comments: 32,
      isLiked: false,
      isSaved: false
    },
    {
      id: "2",
      title: "Çikolatalı Kurabiye Sırları",
      videoUrl: "https://www.youtube.com/embed/dQw4w9WgXcQ",
      thumbnail: "https://images.unsplash.com/photo-1578985545062-69928b1d9587?w=200&h=200&fit=crop",
      username: "Pasta Şefi",
      userAvatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop",
      category: "Tatlı",
      cookingTime: "45 dk",
      ingredients: ["Un", "Çikolata", "Tereyağı", "Şeker"],
      likes: 189,
      comments: 28,
      isLiked: false,
      isSaved: false
    },
    {
      id: "3",
      title: "Vegan Mercimek Köftesi",
      videoUrl: "https://www.youtube.com/embed/dQw4w9WgXcQ",
      thumbnail: "https://images.unsplash.com/photo-1547592166-23ac45744acd?w=200&h=200&fit=crop",
      username: "Vegan Chef",
      userAvatar: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=100&h=100&fit=crop",
      category: "Vegan",
      cookingTime: "30 dk",
      ingredients: ["Kırmızı mercimek", "Bulgur", "Soğan", "Maydanoz"],
      likes: 156,
      comments: 19,
      isLiked: false,
      isSaved: false
    },
    {
      id: "4",
      title: "5 Dakikada Smoothie",
      videoUrl: "https://www.youtube.com/embed/dQw4w9WgXcQ",
      thumbnail: "https://images.unsplash.com/photo-1553530666-ba11a7da3888?w=200&h=200&fit=crop",
      username: "Fit Guru",
      userAvatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&h=100&fit=crop",
      category: "İçecek",
      cookingTime: "5 dk",
      ingredients: ["Muz", "Çilek", "Yoğurt", "Bal"],
      likes: 98,
      comments: 15,
      isLiked: false,
      isSaved: false
    },
    {
      id: "5",
      title: "Pratik Kahvaltı Tabağı",
      videoUrl: "https://www.youtube.com/embed/dQw4w9WgXcQ",
      thumbnail: "https://images.unsplash.com/photo-1525351484163-7529414344d8?w=200&h=200&fit=crop",
      username: "Sabah Şefi",
      userAvatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=100&h=100&fit=crop",
      category: "Kahvaltı",
      cookingTime: "15 dk",
      ingredients: ["Yumurta", "Peynir", "Domates", "Salatalık"],
      likes: 167,
      comments: 23,
      isLiked: false,
      isSaved: false
    }
  ]);
  
  const scrollRef = useRef<HTMLDivElement>(null);
  const { toast } = useToast();

  const scrollLeft = () => {
    if (scrollRef.current) {
      scrollRef.current.scrollBy({ left: -200, behavior: 'smooth' });
    }
  };

  const scrollRight = () => {
    if (scrollRef.current) {
      scrollRef.current.scrollBy({ left: 200, behavior: 'smooth' });
    }
  };

  const handleLike = (storyId: string) => {
    setStories(prev => prev.map(story => 
      story.id === storyId 
        ? { 
            ...story, 
            isLiked: !story.isLiked,
            likes: story.isLiked ? story.likes - 1 : story.likes + 1
          }
        : story
    ));
    
    if (selectedStory && selectedStory.id === storyId) {
      setSelectedStory(prev => prev ? {
        ...prev,
        isLiked: !prev.isLiked,
        likes: prev.isLiked ? prev.likes - 1 : prev.likes + 1
      } : null);
    }

    toast({
      title: stories.find(s => s.id === storyId)?.isLiked ? "💔 Beğeni geri alındı" : "❤️ Video beğenildi",
      description: stories.find(s => s.id === storyId)?.isLiked ? "Videodan beğeninizi geri aldınız" : "Bu videoyu beğendiniz!",
    });
  };

  const handleSave = (storyId: string) => {
    setStories(prev => prev.map(story => 
      story.id === storyId 
        ? { ...story, isSaved: !story.isSaved }
        : story
    ));

    if (selectedStory && selectedStory.id === storyId) {
      setSelectedStory(prev => prev ? {
        ...prev,
        isSaved: !prev.isSaved
      } : null);
    }

    toast({
      title: stories.find(s => s.id === storyId)?.isSaved ? "🗂️ Kaydetmeden çıkarıldı" : "🔖 Video kaydedildi",
      description: stories.find(s => s.id === storyId)?.isSaved ? "Video kayıtlarınızdan çıkarıldı" : "Video kayıtlarınıza eklendi!",
    });
  };

  const handleAddStory = () => {
    toast({
      title: "📹 Tarif Hikâyesi Ekle",
      description: "TikTok veya YouTube Shorts linkinizi paylaşın!",
    });
  };

  return (
    <section className="bg-white border-b border-gray-100 py-4">
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
            🎬 Tarif Hikâyeleri
            <Badge className="bg-red-100 text-red-800">YENİ</Badge>
          </h3>
          <Button onClick={handleAddStory} size="sm" className="gradient-primary text-white">
            <Plus className="h-4 w-4 mr-1" />
            Hikâye Ekle
          </Button>
        </div>

        <div className="relative">
          <Button
            variant="outline"
            size="icon"
            className="absolute left-0 top-1/2 -translate-y-1/2 z-10 bg-white shadow-md"
            onClick={scrollLeft}
          >
            <ChevronLeft className="h-4 w-4" />
          </Button>

          <div 
            ref={scrollRef}
            className="flex gap-4 overflow-x-auto scrollbar-hide px-8"
            style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
          >
            {stories.map((story) => (
              <div
                key={story.id}
                className="flex-shrink-0 cursor-pointer group"
                onClick={() => setSelectedStory(story)}
              >
                <div className="relative">
                  {/* Video Thumbnail */}
                  <div className="w-20 h-28 rounded-xl overflow-hidden border-2 border-gradient-to-r from-food-400 to-spice-400 group-hover:scale-105 transition-transform duration-200">
                    <img 
                      src={story.thumbnail} 
                      alt={story.title}
                      className="w-full h-full object-cover"
                    />
                    <div className="absolute inset-0 bg-black bg-opacity-20 flex items-center justify-center">
                      <Play className="h-6 w-6 text-white" />
                    </div>
                  </div>
                  
                  {/* User Avatar */}
                  <Avatar className="absolute -bottom-2 left-1/2 -translate-x-1/2 w-8 h-8 border-2 border-white">
                    <AvatarImage src={story.userAvatar} />
                    <AvatarFallback>{story.username[0]}</AvatarFallback>
                  </Avatar>
                  
                  {/* Category Badge */}
                  <Badge className="absolute top-1 left-1 text-xs bg-black bg-opacity-70 text-white">
                    {story.category}
                  </Badge>
                </div>
                
                <p className="text-xs text-center mt-3 font-medium text-gray-700 max-w-20 truncate">
                  {story.username}
                </p>
              </div>
            ))}
          </div>

          <Button
            variant="outline"
            size="icon"
            className="absolute right-0 top-1/2 -translate-y-1/2 z-10 bg-white shadow-md"
            onClick={scrollRight}
          >
            <ChevronRight className="h-4 w-4" />
          </Button>
        </div>

        {/* Video Modal */}
        <Dialog open={!!selectedStory} onOpenChange={() => setSelectedStory(null)}>
          <DialogContent className="max-w-md p-0 bg-black">
            {selectedStory && (
              <div className="relative">
                {/* Video Player */}
                <div className="aspect-[9/16] bg-black">
                  <iframe
                    src={selectedStory.videoUrl}
                    className="w-full h-full"
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                    allowFullScreen
                  />
                </div>

                {/* Overlay Content */}
                <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black via-black/50 to-transparent p-4 text-white">
                  {/* User Info */}
                  <div className="flex items-center gap-3 mb-3">
                    <Avatar className="w-10 h-10 border-2 border-white">
                      <AvatarImage src={selectedStory.userAvatar} />
                      <AvatarFallback>{selectedStory.username[0]}</AvatarFallback>
                    </Avatar>
                    <div>
                      <p className="font-semibold">{selectedStory.username}</p>
                      <p className="text-sm opacity-90">{selectedStory.cookingTime}</p>
                    </div>
                  </div>

                  {/* Title */}
                  <h4 className="font-bold text-lg mb-2">{selectedStory.title}</h4>

                  {/* Ingredients */}
                  {selectedStory.ingredients && (
                    <div className="mb-3">
                      <p className="text-sm opacity-90 mb-1">Malzemeler:</p>
                      <div className="flex flex-wrap gap-1">
                        {selectedStory.ingredients.slice(0, 3).map((ingredient, index) => (
                          <Badge key={index} className="text-xs bg-white/20 text-white border-white/30">
                            {ingredient}
                          </Badge>
                        ))}
                        {selectedStory.ingredients.length > 3 && (
                          <Badge className="text-xs bg-white/20 text-white border-white/30">
                            +{selectedStory.ingredients.length - 3} daha
                          </Badge>
                        )}
                      </div>
                    </div>
                  )}

                  {/* Action Buttons */}
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleLike(selectedStory.id)}
                        className={`text-white hover:bg-white/20 ${selectedStory.isLiked ? 'text-red-400' : ''}`}
                      >
                        <Heart className={`h-5 w-5 mr-1 ${selectedStory.isLiked ? 'fill-current' : ''}`} />
                        {selectedStory.likes}
                      </Button>
                      
                      <Button variant="ghost" size="sm" className="text-white hover:bg-white/20">
                        <MessageCircle className="h-5 w-5 mr-1" />
                        {selectedStory.comments}
                      </Button>
                      
                      <Button variant="ghost" size="sm" className="text-white hover:bg-white/20">
                        <Share2 className="h-5 w-5" />
                      </Button>
                    </div>

                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleSave(selectedStory.id)}
                      className={`text-white hover:bg-white/20 ${selectedStory.isSaved ? 'text-blue-400' : ''}`}
                    >
                      <Bookmark className={`h-5 w-5 ${selectedStory.isSaved ? 'fill-current' : ''}`} />
                    </Button>
                  </div>
                </div>

                {/* Category Badge */}
                <Badge className="absolute top-4 left-4 bg-food-500 text-white">
                  {selectedStory.category}
                </Badge>
              </div>
            )}
          </DialogContent>
        </Dialog>
      </div>
    </section>
  );
};

export default VideoStories;
