import { useState, useRef, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import {
    Heart, MessageCircle, Bookmark, ChevronLeft,
    ChevronRight, X, Users, Eye, ArrowRight
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useVideoStories, type VideoStory as DatabaseVideoStory } from "@/hooks/useVideoStories";
import LoadingSpinner from "@/components/LoadingSpinner";

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
            <section className="bg-gradient-to-r from-orange-50 via-white to-orange-50 border-b border-orange-100 py-8">
                <div className="max-w-7xl mx-auto px-4">
                    <div className="flex items-center justify-between mb-8">
                        <div className="flex items-center gap-4">
                            <h3 className="text-2xl font-bold text-gray-900 flex items-center gap-3">
                                <span className="bg-gradient-to-r from-orange-600 to-orange-500 bg-clip-text text-transparent">
                                    Tarif Hikâyeleri
                                </span>
                                <Badge className="bg-gradient-to-r from-orange-500 to-orange-400 text-white text-xs font-semibold px-3 py-1 rounded-full shadow-md animate-pulse">
                                    Yeni
                                </Badge>
                            </h3>
                            <div className="hidden sm:flex items-center gap-2 text-sm text-gray-600 bg-white/80 backdrop-blur-sm px-4 py-2 rounded-full border border-orange-100 shadow-sm">
                                <Eye className="h-4 w-4 text-orange-500" />
                                <span className="font-semibold text-orange-600">
                                    {stories.reduce((acc, story) => acc + (story.views || 0), 0).toLocaleString()}
                                </span>
                                <span>görüntüleme</span>
                            </div>
                        </div>
                    </div>

                    {/* Hikayeler Listesi */}
                    <div className="relative group/arrows">
                        {/* Sol ok - Modern tasarım */}
                        <Button
                            variant="ghost"
                            size="icon"
                            className="absolute left-0 top-1/2 -translate-y-1/2 z-10 bg-white/95 hover:bg-white shadow-lg rounded-full w-10 h-10 opacity-0 group-hover/arrows:opacity-100 transition-all duration-300 border border-orange-100 hover:border-orange-200 hover:shadow-xl"
                            onClick={scrollLeft}
                        >
                            <ChevronLeft className="h-5 w-5 text-gray-700" />
                        </Button>

                        {/* Hikayeler listesi */}
                        <div
                            ref={scrollRef}
                            className="flex gap-3 overflow-x-auto scrollbar-hide px-8 [&::-webkit-scrollbar]:hidden [-ms-overflow-style]:none [scrollbar-width]:none"
                        >
                            {stories.map((story) => (
                                <div
                                    key={story.id}
                                    className="flex-shrink-0 cursor-pointer group active:scale-95 transition-transform duration-200"
                                    onClick={() => handleStoryClick(story)}
                                >
                                    <div className="relative">
                                        {/* Video Thumbnail - Modern tasarım */}
                                        <div className="w-32 h-44 rounded-2xl overflow-hidden border-2 border-gray-100 group-hover:border-orange-300 group-hover:shadow-xl transition-all duration-300 relative story-pulse bg-gradient-to-br from-orange-50 to-white">
                                            <img
                                                src={story.thumbnail_url || "https://images.unsplash.com/photo-1565299624946-b28f40a0ca4b?w=300&h=400&fit=crop"}
                                                alt={story.title}
                                                className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                                            />
                                            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-90 group-hover:opacity-75 transition-opacity"></div>

                                            {/* Video Süresi - Modern tasarım */}
                                            <div className="absolute bottom-3 right-3 bg-black/90 backdrop-blur-sm text-white text-xs px-2 py-1 rounded-lg font-semibold shadow-lg border border-white/20">
                                                {story.duration ? `${Math.floor(story.duration / 60)}:${(story.duration % 60).toString().padStart(2, '0')}` : '1:30'}
                                            </div>

                                            {/* Görüntülenme sayacı - Modern tasarım */}
                                            <div className="absolute top-3 right-3 bg-white/90 backdrop-blur-sm text-gray-800 text-xs px-2 py-1 rounded-lg font-semibold flex items-center gap-1.5 shadow-lg">
                                                <Eye className="h-3 w-3 text-orange-500" />
                                                <span>{(story.views || 0) > 1000 ? `${((story.views || 0) / 1000).toFixed(1)}k` : (story.views || 0)}</span>
                                            </div>

                                            {/* Play Button - Yeni ekleme */}
                                            <div className="absolute inset-0 flex items-center justify-center">
                                                <div className="w-12 h-12 bg-white/90 backdrop-blur-sm rounded-full flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform duration-300">
                                                    <div className="w-0 h-0 border-l-[8px] border-l-orange-500 border-t-[6px] border-t-transparent border-b-[6px] border-b-transparent ml-1"></div>
                                                </div>
                                            </div>

                                            {/* İçerik başlığı */}
                                            <div className="absolute bottom-0 left-0 right-0 px-3 py-3 pointer-events-none">
                                                <p className="text-white text-sm font-semibold truncate leading-tight drop-shadow-lg">
                                                    {story.title}
                                                </p>
                                            </div>
                                        </div>

                                        {/* Kullanıcı Avatarı - Modern tasarım */}
                                        <Avatar className="absolute -bottom-4 left-1/2 -translate-x-1/2 w-10 h-10 border-3 border-white shadow-lg ring-2 ring-orange-100">
                                            <AvatarImage src={story.userAvatar} />
                                            <AvatarFallback className="bg-gradient-to-br from-orange-400 to-orange-500 text-white text-sm font-bold">
                                                {(story.username || 'C')[0]}
                                            </AvatarFallback>
                                        </Avatar>

                                        {/* Öne çıkan rozeti - Modern tasarım */}
                                        {story.is_featured && (
                                            <Badge className="absolute top-3 left-3 text-xs bg-gradient-to-r from-yellow-400 to-orange-400 text-white px-2 py-1 rounded-full shadow-lg border border-yellow-300/50 font-semibold">
                                                ✨ Öne Çıkan
                                            </Badge>
                                        )}
                                    </div>

                                    {/* Kullanıcı adı - Modern stil */}
                                    <p className="text-sm text-center mt-5 font-semibold text-gray-800 max-w-32 truncate">
                                        {story.username}
                                    </p>
                                </div>
                            ))}
                        </div>

                        {/* Sağ ok - Modern tasarım */}
                        <Button
                            variant="ghost"
                            size="icon"
                            className="absolute right-0 top-1/2 -translate-y-1/2 z-10 bg-white/95 hover:bg-white shadow-lg rounded-full w-10 h-10 opacity-0 group-hover/arrows:opacity-100 transition-all duration-300 border border-orange-100 hover:border-orange-200 hover:shadow-xl"
                            onClick={scrollRight}
                        >
                            <ChevronRight className="h-5 w-5 text-gray-700" />
                        </Button>
                    </div>

                    {/* Video Modal - Basit Dialog ile değiştirildi */}
                    {/* Modal işlevselliği şu an devre dışı - gelecekte eklenecek */}
                </div>
            </section>
        </>
    );
};

export default VideoStories;
