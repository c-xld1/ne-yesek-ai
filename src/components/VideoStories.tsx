import { useState, useRef, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { ChevronLeft, ChevronRight, Eye, Sparkles, TrendingUp, Clock } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useVideoStories, type VideoStory as DatabaseVideoStory } from "@/hooks/useVideoStories";
import LoadingSpinner from "@/components/LoadingSpinner";
import VideoStoryModal from "@/components/VideoStoryModal";
import { motion } from "framer-motion";

/**
 * VideoStory arayüzü, veritabanı modeli üzerine UI için gerekli özellikleri ekler
 */
interface VideoStory extends DatabaseVideoStory {
    username?: string;
    userAvatar?: string;
    isLiked?: boolean;
    isSaved?: boolean;
    userGroup?: string; // Kullanıcı grubu bilgisi
}

/**
 * VideoStories - Instagram/YouTube Shorts tarzı video hikayeleri bileşeni
 */
const VideoStories = () => {
    // API hookları
    const { stories: dbStories, loading, error, incrementViews, incrementLikes } = useVideoStories();
    const { toast } = useToast();

    // Referanslar
    const scrollRef = useRef<HTMLDivElement>(null);

    // State tanımlamaları - tümü bileşenin başında olmalı (React Hook kuralları)
    const [selectedStory, setSelectedStory] = useState<VideoStory | null>(null);
    const [currentStoryIndex, setCurrentStoryIndex] = useState(0);
    const [isVideoLoaded, setIsVideoLoaded] = useState(false);
    const [touchStartX, setTouchStartX] = useState(0);
    const [touchEndX, setTouchEndX] = useState(0);
    const [touchStartY, setTouchStartY] = useState(0);
    const [touchEndY, setTouchEndY] = useState(0);
    const [isDragging, setIsDragging] = useState(false);
    const [dragOffset, setDragOffset] = useState(0);
    const [localStories, setLocalStories] = useState<VideoStory[]>([]);
    const [showCommentForm, setShowCommentForm] = useState(false);
    const [commentText, setCommentText] = useState("");
    const [isSubmittingComment, setIsSubmittingComment] = useState(false);

    // Veri kaynağı belirle - API verisi veya fallback
    const sourceStories = error ? [] : dbStories;

    // API verilerini component formatına dönüştür (localStories state'ine) - sadece bir kere
    useEffect(() => {
        if (sourceStories && sourceStories.length > 0) {
            // Veritabanı hikayelerini bileşen formatına dönüştür
            const formattedStories = sourceStories.map(story => ({
                ...story,
                username: "Chef AI", // Default kullanıcı adı
                userAvatar: "https://images.unsplash.com/photo-1494790108755-2616b612b47c?w=100&h=100&fit=crop",
                isLiked: false,
                isSaved: false,
                userGroup: (story as any).user_group || (story.is_featured ? "Premium" : "Herkes") // Kullanıcı grubu atanması
            }));
            setLocalStories(formattedStories);
        } else if (!loading && !localStories.length) {
            // Eğer veri yoksa örnek verilerle doldur
            const fallbackStories: VideoStory[] = Array(5).fill(0).map((_, i) => ({
                id: `fallback-${i}`,
                title: `Örnek Tarif ${i + 1}`,
                description: "Supabase bağlantısı olmadığında gösterilen örnek video",
                video_url: "https://player.vimeo.com/progressive_redirect/playback/863059736/rendition/720p/file.mp4",
                thumbnail_url: "https://images.unsplash.com/photo-1505935428862-770b6f24f629?w=800&h=1200&fit=crop",
                created_at: new Date().toISOString(),
                views: Math.floor(Math.random() * 1000),
                likes: Math.floor(Math.random() * 100),
                is_featured: i % 3 === 0,
                username: "Chef AI",
                userAvatar: "https://images.unsplash.com/photo-1494790108755-2616b612b47c?w=100&h=100&fit=crop",
                isLiked: false,
                isSaved: false,
                userGroup: i % 3 === 0 ? "Premium" : "Herkes",
                duration: 90,
                recipe_id: null,
                updated_at: new Date().toISOString(),
                user_id: null
            }));
            setLocalStories(fallbackStories);
        }
    }, [sourceStories, loading]); // sourceStories veya loading değiştiğinde bu işlemi yap

    // Geçerli hikayeleri belirle
    const stories: VideoStory[] = localStories.length > 0 ? localStories : [];

    // Yükleniyor durumu
    if (loading) {
        return (
            <section className="bg-gradient-to-r from-orange-50 via-white to-orange-50 border-b border-orange-100 py-8">
                <div className="max-w-7xl mx-auto px-4">
                    <div className="flex items-center justify-center py-12">
                        <LoadingSpinner text="Video hikayeler yükleniyor..." />
                    </div>
                </div>
            </section>
        );
    }

    // Hata durumu ama fallback verilerle devam et
    if (error) {
        console.warn('Supabase bağlantı sorunu, test verileriyle devam ediliyor:', error);
    }

    // Kaydırma işlemleri
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

    // Hikaye tıklama işleyicisi
    const handleStoryClick = async (story: VideoStory) => {
        setSelectedStory(story);
        setCurrentStoryIndex(stories.findIndex(s => s.id === story.id));
        setIsVideoLoaded(false);

        // Görüntülenme sayısını artır (güvenli çağrı)
        try {
            await incrementViews(story.id);
        } catch (err) {
            console.warn('Views artırılamadı (offline mode):', err);
        }

        // Mobilde body scroll'u engelle
        if (typeof window !== 'undefined') {
            document.body.style.overflow = 'hidden';
        }
    };

    // Modal kapatma işleyicisi
    const closeModal = () => {
        setSelectedStory(null);
        // Body scroll'u geri aç
        if (typeof window !== 'undefined') {
            document.body.style.overflow = 'unset';
        }
    };

    // Sonraki hikaye işleyicisi
    const nextStory = async () => {
        if (currentStoryIndex < stories.length - 1) {
            const nextIndex = currentStoryIndex + 1;
            setCurrentStoryIndex(nextIndex);
            setSelectedStory(stories[nextIndex]);
            setIsVideoLoaded(false);
            try {
                await incrementViews(stories[nextIndex].id);
            } catch (err) {
                console.warn('Views artırılamadı (offline mode):', err);
            }
        }
    };

    // Önceki hikaye işleyicisi
    const prevStory = () => {
        if (currentStoryIndex > 0) {
            const prevIndex = currentStoryIndex - 1;
            setCurrentStoryIndex(prevIndex);
            setSelectedStory(stories[prevIndex]);
            setIsVideoLoaded(false);
        }
    };

    // Dokunma kontrolleri (kaydırma navigasyonu için)
    const handleTouchStart = (e: React.TouchEvent) => {
        setTouchStartX(e.touches[0].clientX);
        setTouchStartY(e.touches[0].clientY);
    };

    const handleTouchEnd = () => {
        const deltaX = touchEndX - touchStartX;
        const deltaY = touchEndY - touchStartY;

        // Yatay kaydırma dikey kaydırmadan daha belirginse navigasyon yap
        if (Math.abs(deltaX) > Math.abs(deltaY) && Math.abs(deltaX) > 50) {
            if (deltaX > 0) {
                prevStory();
            } else {
                nextStory();
            }
        }
    };

    const handleTouchMove = (e: React.TouchEvent) => {
        setTouchEndX(e.touches[0].clientX);
        setTouchEndY(e.touches[0].clientY);
    };

    // Beğenme işleyicisi
    const handleLike = async (storyId: string) => {
        const storyIndex = stories.findIndex(s => s.id === storyId);
        if (storyIndex === -1) return;

        const story = stories[storyIndex];

        // Zaten beğenilmişse işlem yapmıyoruz - beğeni geri çekme özelliği kaldırıldı
        if (story.isLiked) {
            toast({
                title: "❤️ Zaten Beğenildi",
                description: "Bu videoyu daha önce beğendiniz",
                variant: "default"
            });
            return;
        }

        // Local state güncellemesi önce yapılır (hızlı UI feedback)
        if (selectedStory && selectedStory.id === storyId) {
            setSelectedStory(prev => prev ? {
                ...prev,
                isLiked: true,
                likes: (prev.likes || 0) + 1
            } : null);
        }

        // Global state güncellemesi - localStories state'ini güncelleyerek tüm bileşene yay
        setLocalStories(prevStories => {
            return prevStories.map(s =>
                s.id === storyId
                    ? { ...s, isLiked: true, likes: (s.likes || 0) + 1 }
                    : s
            );
        });

        // Veritabanı güncelleme (güvenli çağrı)
        try {
            await incrementLikes(storyId);
        } catch (err) {
            console.warn('Likes işlemi başarısız (offline mode):', err);
        }

        toast({
            title: "❤️ Video beğenildi",
            description: "Bu videoyu beğendiniz!",
            variant: "default"
        });
    };

    // Kaydetme işleyicisi (favorilere ekleme)
    const handleSave = (storyId: string) => {
        const storyIndex = stories.findIndex(s => s.id === storyId);
        if (storyIndex === -1) return;

        const story = stories[storyIndex];
        const newIsSaved = !story.isSaved;

        // Local state güncellemesi önce yapılır (hızlı UI feedback)
        if (selectedStory && selectedStory.id === storyId) {
            setSelectedStory(prev => prev ? {
                ...prev,
                isSaved: newIsSaved
            } : null);
        }

        // Global state güncellemesi - localStories state'ini güncelleyerek tüm bileşene yay
        setLocalStories(prevStories => {
            return prevStories.map(s =>
                s.id === storyId
                    ? { ...s, isSaved: newIsSaved }
                    : s
            );
        });

        // Backend API çağrısı burada yapılabilir (şu an mevcut değil)
        // Örn: newIsSaved ? saveVideoToFavorites(storyId) : removeVideoFromFavorites(storyId)
        console.log(`Video ${newIsSaved ? 'favorilere eklendi' : 'favorilerden çıkarıldı'} - backend API henüz mevcut değil`);

        toast({
            title: newIsSaved ? "🔖 Video kaydedildi" : "🗂️ Kaydetmeden çıkarıldı",
            description: newIsSaved ? "Video kayıtlarınıza eklendi!" : "Video kayıtlarınızdan çıkarıldı",
            variant: "default"
        });
    };

    // Yeni hikaye ekleme işleyicisi
    const handleAddStory = () => {
        toast({
            title: "📹 Tarif Hikâyesi Ekle",
            description: "TikTok veya YouTube Shorts linkinizi paylaşın!",
        });
    };

    // Yorum işleyicisi
    const handleCommentClick = () => {
        // Modal içinde yorum formunu göster/gizle
        setShowCommentForm(!showCommentForm);
    };

    // Yorum gönderme işleyicisi
    const submitComment = async () => {
        if (!commentText.trim()) {
            toast({
                title: "⚠️ Boş Yorum",
                description: "Lütfen bir yorum yazın",
                variant: "destructive",
            });
            return;
        }

        const recipeId = selectedStory?.recipe_id;
        const videoTitle = selectedStory?.title;

        // Yükleniyor durumu göster
        setIsSubmittingComment(true);

        try {
            // API çağrısını simüle et (gerçek implementasyonda burada bir fetch veya supabase çağrısı olacak)
            await new Promise(resolve => setTimeout(resolve, 800));

            // Burada yorum backend'e gönderilecek (şu an için sadece simülasyon)
            console.log(`Yorum gönderildi: "${commentText}" - Tarif: ${recipeId}, Video: ${videoTitle}`);

            // Başarılı bildirim göster
            toast({
                title: "💬 Yorum Gönderildi",
                description: "Yorumunuz başarıyla kaydedildi!",
                variant: "default",
            });

            // Yorum formunu temizle ve kapat
            setCommentText("");
            setShowCommentForm(false);
        } catch (err) {
            toast({
                title: "⚠️ Yorum Gönderilemedi",
                description: "Lütfen daha sonra tekrar deneyin",
                variant: "destructive",
            });
            console.error("Yorum gönderme hatası:", err);
        } finally {
            setIsSubmittingComment(false);
        }
    };

    return (
        <>
            <section className="relative py-12 overflow-hidden">
                {/* Background gradients */}
                <div className="absolute inset-0 bg-gradient-to-br from-orange-50 via-white to-orange-50" />
                <div className="absolute top-0 left-0 w-96 h-96 bg-orange-200/20 rounded-full blur-3xl" />
                <div className="absolute bottom-0 right-0 w-96 h-96 bg-primary/10 rounded-full blur-3xl" />
                
                <div className="max-w-7xl mx-auto px-4 relative z-10">
                    {/* Header */}
                    <motion.div
                        initial={{ opacity: 0, y: -20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="flex items-center justify-between mb-8"
                    >
                        <div className="flex items-center gap-4">
                            <div className="relative">
                                <h3 className="text-3xl font-bold flex items-center gap-3">
                                    <span className="bg-gradient-to-r from-primary via-orange-600 to-orange-500 bg-clip-text text-transparent">
                                        Tarif Hikâyeleri
                                    </span>
                                    <Sparkles className="h-6 w-6 text-primary animate-pulse" />
                                </h3>
                                <div className="absolute -bottom-2 left-0 w-24 h-1 bg-gradient-to-r from-primary to-orange-400 rounded-full" />
                            </div>
                            <Badge className="bg-gradient-to-r from-primary to-orange-600 text-white text-xs font-semibold px-3 py-1.5 rounded-full shadow-lg hover:shadow-xl transition-shadow">
                                <TrendingUp className="h-3 w-3 mr-1" />
                                Popüler
                            </Badge>
                        </div>
                        
                        <div className="hidden sm:flex items-center gap-3">
                            <div className="flex items-center gap-2 text-sm bg-white/80 backdrop-blur-sm px-4 py-2.5 rounded-full border border-orange-200 shadow-sm">
                                <Eye className="h-4 w-4 text-primary" />
                                <span className="font-bold text-primary">
                                    {stories.reduce((acc, story) => acc + (story.views || 0), 0).toLocaleString()}
                                </span>
                                <span className="text-muted-foreground">görüntüleme</span>
                            </div>
                            <div className="flex items-center gap-2 text-sm bg-white/80 backdrop-blur-sm px-4 py-2.5 rounded-full border border-orange-200 shadow-sm">
                                <Clock className="h-4 w-4 text-primary" />
                                <span className="text-muted-foreground">{stories.length} hikaye</span>
                            </div>
                        </div>
                    </motion.div>

                    {/* Stories Grid */}
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 0.2 }}
                        className="relative group/arrows"
                    >
                        {/* Navigation Buttons */}
                        <Button
                            variant="ghost"
                            size="icon"
                            className="absolute left-0 top-1/2 -translate-y-1/2 z-10 bg-white hover:bg-white shadow-xl rounded-full w-12 h-12 opacity-0 group-hover/arrows:opacity-100 transition-all duration-300 border-2 border-orange-100 hover:border-primary hover:shadow-2xl hover:scale-110"
                            onClick={scrollLeft}
                        >
                            <ChevronLeft className="h-6 w-6 text-foreground" />
                        </Button>

                        <div
                            ref={scrollRef}
                            className="flex gap-4 overflow-x-auto scrollbar-hide px-8 py-2 [&::-webkit-scrollbar]:hidden [-ms-overflow-style]:none [scrollbar-width]:none"
                        >
                            {stories.map((story, index) => (
                                <motion.div
                                    key={story.id}
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ delay: index * 0.1 }}
                                    className="flex-shrink-0 cursor-pointer group"
                                    onClick={() => handleStoryClick(story)}
                                >
                                    <div className="relative">
                                        {/* Story Card */}
                                        <div className="w-36 h-56 rounded-2xl overflow-hidden border-2 border-border group-hover:border-primary/50 transition-all duration-300 relative bg-gradient-to-br from-background to-muted shadow-lg group-hover:shadow-2xl group-hover:scale-105">
                                            <img
                                                src={story.thumbnail_url || "https://images.unsplash.com/photo-1565299624946-b28f40a0ca4b?w=300&h=500&fit=crop"}
                                                alt={story.title}
                                                className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                                            />
                                            <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-black/20 opacity-80 group-hover:opacity-60 transition-opacity"></div>

                                            {/* Duration Badge */}
                                            <motion.div
                                                whileHover={{ scale: 1.1 }}
                                                className="absolute bottom-3 right-3 bg-black/80 backdrop-blur-md text-white text-xs px-2.5 py-1 rounded-full font-bold shadow-lg border border-white/30"
                                            >
                                                <Clock className="h-3 w-3 inline mr-1" />
                                                {story.duration ? `${Math.floor(story.duration / 60)}:${(story.duration % 60).toString().padStart(2, '0')}` : '1:30'}
                                            </motion.div>

                                            {/* Views Counter */}
                                            <motion.div
                                                whileHover={{ scale: 1.1 }}
                                                className="absolute top-3 left-3 flex items-center gap-1.5 bg-black/70 backdrop-blur-md text-white text-xs px-3 py-1.5 rounded-full font-bold shadow-lg border border-white/20"
                                            >
                                                <Eye className="h-3.5 w-3.5" />
                                                <span>{(story.views || 0).toLocaleString()}</span>
                                            </motion.div>

                                            {/* Featured Badge */}
                                            {story.is_featured && (
                                                <motion.div
                                                    initial={{ scale: 0 }}
                                                    animate={{ scale: 1 }}
                                                    className="absolute top-3 right-3"
                                                >
                                                    <Badge className="bg-gradient-to-r from-primary to-orange-600 text-primary-foreground text-xs px-2.5 py-0.5 rounded-full shadow-lg border-0 animate-pulse">
                                                        <Sparkles className="h-3 w-3 inline mr-1" />
                                                        Öne Çıkan
                                                    </Badge>
                                                </motion.div>
                                            )}

                                            {/* Title & User Info */}
                                            <div className="absolute bottom-0 left-0 right-0 p-4 bg-gradient-to-t from-black/90 to-transparent">
                                                <h4 className="text-white text-sm font-bold line-clamp-2 drop-shadow-lg mb-2">
                                                    {story.title}
                                                </h4>
                                                <div className="flex items-center gap-2">
                                                    <Avatar className="h-5 w-5 border border-white/50">
                                                        <AvatarImage src={story.userAvatar} />
                                                        <AvatarFallback className="text-xs bg-primary text-primary-foreground">
                                                            {story.username?.[0] || "U"}
                                                        </AvatarFallback>
                                                    </Avatar>
                                                    <span className="text-white/90 text-xs font-medium drop-shadow-md">
                                                        {story.username || "Chef AI"}
                                                    </span>
                                                    {story.userGroup === 'Premium' && (
                                                        <Badge className="bg-yellow-500/90 text-white text-xs px-1.5 py-0 rounded-full border-0">
                                                            ⭐
                                                        </Badge>
                                                    )}
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </motion.div>
                            ))}
                        </div>

                        <Button
                            variant="ghost"
                            size="icon"
                            className="absolute right-0 top-1/2 -translate-y-1/2 z-10 bg-white hover:bg-white shadow-xl rounded-full w-12 h-12 opacity-0 group-hover/arrows:opacity-100 transition-all duration-300 border-2 border-orange-100 hover:border-primary hover:shadow-2xl hover:scale-110"
                            onClick={scrollRight}
                        >
                            <ChevronRight className="h-6 w-6 text-foreground" />
                        </Button>
                    </motion.div>
                </div>
            </section>

            {/* Video Story Modal */}
            <VideoStoryModal
                isOpen={!!selectedStory}
                onClose={closeModal}
                story={selectedStory || stories[0]}
                onLike={handleLike}
                onNext={nextStory}
                onPrev={prevStory}
                hasNext={currentStoryIndex < stories.length - 1}
                hasPrev={currentStoryIndex > 0}
            />
        </>
    );
};

export default VideoStories;
