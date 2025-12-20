import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { Heart, MessageCircle, Share2, Clock, ChefHat, Star, Eye, Bookmark, ArrowRight, Sparkles } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import SocialShare from "./SocialShare";
import RecipeSocial from "./RecipeSocial";
import ImageWithFallback from "./ImageWithFallback";
import TrendingBadge from "./TrendingBadge";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { useToast } from "@/hooks/use-toast";

interface RecipeCardProps {
    id: number | string;
    slug?: string;
    title: string;
    image?: string;
    cookingTime?: string;
    difficulty?: string;
    rating?: number;
    author?: string;
    authorAvatar?: string;
    authorUsername?: string;
    description?: string;
    viewCount?: number;
    likeCount?: number;
    commentCount?: number;
    isPopular?: boolean;
    isMinimal?: boolean;
    tags?: string[];
    viewMode?: "grid" | "list";
}

const RecipeCard: React.FC<RecipeCardProps> = ({
    id,
    slug,
    title,
    image,
    cookingTime,
    difficulty,
    rating = 4.5,
    author = "Chef Ahmet",
    authorAvatar,
    authorUsername,
    description,
    viewCount = 1250,
    likeCount = 89,
    commentCount = 12,
    isPopular = false,
    tags = ["Kolay", "Hızlı"],
    viewMode = "grid"
}) => {
    const navigate = useNavigate();
    const { user } = useAuth();
    const { toast } = useToast();
    const [isLiked, setIsLiked] = useState(false);
    const [isSaved, setIsSaved] = useState(false);
    const [currentLikeCount, setCurrentLikeCount] = useState(likeCount);

    // Check if recipe is liked and saved
    useEffect(() => {
        const checkUserInteractions = async () => {
            if (!user) return;

            // Convert id to string to ensure UUID compatibility
            const recipeId = String(id);

            try {
                // Check if liked
                const { data: likeData, error: likeError } = await supabase
                    .from("likes" as any)
                    .select("id")
                    .eq("user_id", user.id)
                    .eq("recipe_id", recipeId)
                    .maybeSingle();

                if (likeError) {
                    console.error("Check like error:", likeError);
                } else if (likeData) {
                    setIsLiked(true);
                }

                // Check if saved
                const { data: favoriteData, error: favoriteError } = await supabase
                    .from("recipe_favorites" as any)
                    .select("id")
                    .eq("user_id", user.id)
                    .eq("recipe_id", recipeId)
                    .maybeSingle();

                if (favoriteError) {
                    console.error("Check favorite error:", favoriteError);
                } else if (favoriteData) {
                    setIsSaved(true);
                }
            } catch (error) {
                console.error("Check interactions error:", error);
            }
        };

        checkUserInteractions();
    }, [user, id]);

    const handleLike = async (e: React.MouseEvent) => {
        e.preventDefault();
        e.stopPropagation();

        if (!user) {
            toast({
                title: "Giriş Gerekli",
                description: "Tarifi beğenmek için giriş yapmalısınız",
                variant: "destructive",
            });
            navigate("/giris-yap");
            return;
        }

        // Convert id to string to ensure UUID compatibility
        const recipeId = String(id);

        try {
            if (isLiked) {
                // Unlike
                const { error } = await supabase
                    .from("likes" as any)
                    .delete()
                    .eq("user_id", user.id)
                    .eq("recipe_id", recipeId);

                if (error) {
                    console.error("Unlike error:", error);
                    throw error;
                }

                setIsLiked(false);
                setCurrentLikeCount(prev => Math.max(0, prev - 1));
                toast({
                    title: "Beğeni Kaldırıldı",
                    description: "Tarif beğenilerinizden çıkarıldı",
                });
            } else {
                // Like
                const { error } = await supabase
                    .from("likes" as any)
                    .insert({
                        user_id: user.id,
                        recipe_id: recipeId,
                        comment_id: null
                    });

                if (error) {
                    console.error("Like error:", error);
                    throw error;
                }

                setIsLiked(true);
                setCurrentLikeCount(prev => prev + 1);
                toast({
                    title: "Beğenildi",
                    description: "Tarif beğenilerinize eklendi",
                });
            }
        } catch (error: any) {
            console.error("handleLike error:", error);
            toast({
                title: "Hata",
                description: error?.message || "Beğeni işlemi başarısız oldu",
                variant: "destructive",
            });
        }
    };

    const handleSave = async (e: React.MouseEvent) => {
        e.preventDefault();
        e.stopPropagation();

        if (!user) {
            toast({
                title: "Giriş Gerekli",
                description: "Tarifi kaydetmek için giriş yapmalısınız",
                variant: "destructive",
            });
            navigate("/giris-yap");
            return;
        }

        // Convert id to string to ensure UUID compatibility
        const recipeId = String(id);

        try {
            if (isSaved) {
                // Remove from favorites
                const { error } = await supabase
                    .from("recipe_favorites" as any)
                    .delete()
                    .eq("user_id", user.id)
                    .eq("recipe_id", recipeId);

                if (error) {
                    console.error("Remove favorite error:", error);
                    throw error;
                }

                setIsSaved(false);
                toast({
                    title: "Favorilerden Kaldırıldı",
                    description: "Tarif favorilerinizden çıkarıldı",
                });
            } else {
                // Add to favorites
                const { error } = await supabase
                    .from("recipe_favorites" as any)
                    .insert({
                        user_id: user.id,
                        recipe_id: recipeId,
                    });

                if (error) {
                    console.error("Add favorite error:", error);
                    throw error;
                }

                setIsSaved(true);
                toast({
                    title: "Favorilere Eklendi",
                    description: "Tarif favorilerinize eklendi",
                });
            }
        } catch (error: any) {
            console.error("handleSave error:", error);
            toast({
                title: "Hata",
                description: error?.message || "Favori işlemi başarısız oldu",
                variant: "destructive",
            });
        }
    };

    const handleAuthorClick = (e: React.MouseEvent) => {
        e.preventDefault();
        e.stopPropagation();
        if (authorUsername) {
            navigate(`/profil/${authorUsername}`);
        }
    };

    const handleCardClick = (e: React.MouseEvent) => {
        // Ignore clicks on interactive elements
        const target = e.target as HTMLElement;
        if (
            target.closest('button') ||
            target.closest('a') ||
            target.tagName === 'BUTTON' ||
            target.tagName === 'A'
        ) {
            return;
        }

        // Use slug if available, otherwise use id
        const recipeUrl = slug ? `/tarif/${slug}` : `/tarif/${id}`;
        navigate(recipeUrl);
    };

    // List View
    if (viewMode === "list") {
        return (
            <motion.div
                className="group"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ type: "spring", stiffness: 300, damping: 20 }}
            >
                <div className="bg-white rounded-2xl shadow-md border border-gray-100 overflow-hidden hover:shadow-xl hover:border-orange-200 transition-all duration-300">
                    <div className="flex flex-col sm:flex-row gap-0">
                        {/* Image Section */}
                        {image && (
                            <div 
                                className="relative w-full sm:w-80 h-56 sm:h-auto flex-shrink-0 cursor-pointer overflow-hidden"
                                onClick={(e) => {
                                    // Only navigate if not clicking on interactive elements
                                    const target = e.target as HTMLElement;
                                    if (!target.closest('button') && !target.closest('a')) {
                                        handleCardClick(e);
                                    }
                                }}
                            >
                                <ImageWithFallback
                                    src={image}
                                    alt={title}
                                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                                />
                                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent" />
                                <div className="absolute inset-0 bg-gradient-to-r from-orange-500/20 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                                
                                {/* Badges */}
                                <div className="absolute top-3 left-3 flex flex-col gap-2">
                                    {isPopular && <TrendingBadge />}
                                    {tags.slice(0, 2).map((tag, index) => (
                                        <Badge
                                            key={index}
                                            className="bg-white/20 backdrop-blur-md text-white border-white/30 text-xs font-semibold shadow-lg"
                                        >
                                            {tag}
                                        </Badge>
                                    ))}
                                </div>

                                {/* Time Badge */}
                                <div className="absolute bottom-3 left-3">
                                    <div className="flex items-center gap-1.5 bg-black/70 backdrop-blur-md text-white text-sm px-3 py-1.5 rounded-lg shadow-lg">
                                        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                                        </svg>
                                        <span className="font-medium">{cookingTime}</span>
                                    </div>
                                </div>

                                {/* View Count */}
                                <div className="absolute top-3 right-3">
                                    <div className="flex items-center gap-1 bg-black/70 backdrop-blur-md text-white text-xs px-2.5 py-1 rounded-lg">
                                        <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                                        </svg>
                                        <span className="font-semibold">{viewCount}</span>
                                    </div>
                                </div>
                            </div>
                        )}

                        {/* Content Section */}
                        <div className="flex-1 p-6 flex flex-col">
                            {/* Header */}
                            <div 
                                className="cursor-pointer mb-4"
                                onClick={(e) => {
                                    const target = e.target as HTMLElement;
                                    if (!target.closest('button') && !target.closest('a')) {
                                        handleCardClick(e);
                                    }
                                }}
                            >
                                <h3 className="font-bold text-2xl text-gray-900 mb-2 line-clamp-2 group-hover:text-orange-600 transition-colors leading-tight">
                                    {title}
                                </h3>
                                {description && (
                                    <p className="text-gray-600 text-sm leading-relaxed line-clamp-3">
                                        {description}
                                    </p>
                                )}
                            </div>

                            {/* Stats Row */}
                            <div className="flex items-center gap-5 mb-4 text-sm">
                                <div className="flex items-center gap-1.5 text-gray-600">
                                    <svg className="w-4 h-4 text-orange-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                                    </svg>
                                    <span className="font-medium">{cookingTime}</span>
                                </div>
                                <div className="flex items-center gap-1.5 text-gray-600">
                                    <svg className="w-4 h-4 text-green-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                                    </svg>
                                    <span className="font-medium">{difficulty}</span>
                                </div>
                                <div className="flex items-center gap-1.5 text-gray-600">
                                    <svg className="w-4 h-4 fill-orange-400 text-orange-400" viewBox="0 0 24 24">
                                        <path d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z" />
                                    </svg>
                                    <span className="font-bold text-gray-900">{rating}</span>
                                    <span className="text-xs text-gray-400">/5.0</span>
                                </div>
                            </div>

                            {/* Author Info */}
                            <div 
                                className="flex items-center gap-3 mb-5 pb-4 border-b border-gray-100 cursor-pointer hover:bg-gray-50 -mx-2 px-2 py-2 rounded-lg transition-colors"
                                onClick={handleAuthorClick}
                            >
                                <Avatar className="h-10 w-10 ring-2 ring-orange-100">
                                    <AvatarImage src={authorAvatar} alt={author} />
                                    <AvatarFallback className="bg-gradient-to-br from-orange-400 to-red-400 text-white font-semibold">
                                        {author?.charAt(0).toUpperCase()}
                                    </AvatarFallback>
                                </Avatar>
                                <div className="flex-1 min-w-0">
                                    <p className="text-sm font-semibold text-gray-900 truncate">{author}</p>
                                    <p className="text-xs text-gray-500">Tarif Yazarı</p>
                                </div>
                            </div>

                            {/* Action Buttons */}
                            <div className="flex items-center justify-between mt-auto">
                                <div className="flex items-center gap-2">
                                    {/* Like Button */}
                                    <motion.button
                                        whileTap={{ scale: 0.9 }}
                                        onClick={handleLike}
                                        className={`flex items-center gap-2 px-4 py-2.5 rounded-xl font-medium transition-all ${
                                            isLiked
                                                ? 'bg-red-50 text-red-600 ring-2 ring-red-200'
                                                : 'bg-gray-50 text-gray-700 hover:bg-gray-100'
                                        }`}
                                    >
                                        <svg className={`w-5 h-5 ${isLiked ? 'fill-current' : ''}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                                        </svg>
                                        <span className="font-semibold">{currentLikeCount}</span>
                                    </motion.button>

                                    {/* Comment Button */}
                                    <motion.button
                                        whileTap={{ scale: 0.9 }}
                                        onClick={(e) => {
                                            e.stopPropagation();
                                            handleCardClick(e);
                                        }}
                                        className="flex items-center gap-2 px-4 py-2.5 rounded-xl font-medium bg-gray-50 text-gray-700 hover:bg-gray-100 transition-all"
                                    >
                                        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                                        </svg>
                                        <span className="font-semibold">{commentCount}</span>
                                    </motion.button>

                                    {/* Save Button */}
                                    <motion.button
                                        whileTap={{ scale: 0.9 }}
                                        onClick={handleSave}
                                        className={`flex items-center gap-2 px-4 py-2.5 rounded-xl font-medium transition-all ${
                                            isSaved
                                                ? 'bg-orange-50 text-orange-600 ring-2 ring-orange-200'
                                                : 'bg-gray-50 text-gray-700 hover:bg-gray-100'
                                        }`}
                                    >
                                        <svg className={`w-5 h-5 ${isSaved ? 'fill-current' : ''}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z" />
                                        </svg>
                                        {isSaved && <span className="text-sm font-medium">Kaydedildi</span>}
                                    </motion.button>
                                </div>

                                {/* Share Button */}
                                <motion.button
                                    whileTap={{ scale: 0.9 }}
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        // Share functionality can be added here
                                    }}
                                    className="p-2.5 rounded-xl bg-gray-50 text-gray-700 hover:bg-gray-100 transition-all"
                                >
                                    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z" />
                                    </svg>
                                </motion.button>
                            </div>
                        </div>
                    </div>
                </div>
            </motion.div>
        );
    }

    // Grid View (Default)
    return (
        <motion.div
            className="group cursor-pointer h-full"
            whileHover={{ y: -8 }}
            transition={{ type: "spring", stiffness: 300, damping: 20 }}
            onClick={(e) => {
                const target = e.target as HTMLElement;
                if (!target.closest('button') && !target.closest('a')) {
                    handleCardClick(e);
                }
            }}
        >
            <div className="bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden transition-all duration-500 hover:shadow-2xl hover:border-orange-200 h-full flex flex-col relative">
                {/* Trending Badge */}
                {isPopular && (
                    <div className="absolute top-4 left-4 z-20">
                        <TrendingBadge />
                    </div>
                )}

                {/* Image Section */}
                {image && (
                    <div className="relative overflow-hidden aspect-video">
                        <ImageWithFallback
                            src={image}
                            alt={title}
                            className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                        />

                        {/* Gradient Overlays */}
                        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent" />
                        <div className="absolute inset-0 bg-gradient-to-t from-orange-500/90 via-orange-500/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

                        {/* Top Right Actions */}
                        <div className="absolute top-3 right-3 flex flex-col gap-2 z-10">
                            <motion.button
                                whileTap={{ scale: 0.9 }}
                                onClick={handleSave}
                                className={`p-2.5 rounded-full backdrop-blur-md transition-all duration-300 shadow-lg ${
                                    isSaved
                                        ? 'bg-orange-500 text-white ring-2 ring-white/50'
                                        : 'bg-white/90 text-gray-700 hover:bg-white hover:scale-110'
                                }`}
                            >
                                <Bookmark className={`h-4 w-4 ${isSaved ? 'fill-current' : ''}`} />
                            </motion.button>

                            {/* Stats on Hover */}
                            <motion.div
                                initial={{ opacity: 0, y: -10 }}
                                animate={{ opacity: 0, y: -10 }}
                                whileHover={{ opacity: 1, y: 0 }}
                                className="opacity-0 group-hover:opacity-100 transition-all duration-500 flex flex-col gap-2"
                            >
                                <motion.button
                                    whileTap={{ scale: 0.9 }}
                                    onClick={handleLike}
                                    className="flex items-center gap-1 bg-black/70 backdrop-blur-md rounded-lg px-2.5 py-1.5 text-white hover:bg-black/80 transition-colors"
                                >
                                    <Heart className={`h-3.5 w-3.5 ${isLiked ? 'fill-red-500 text-red-500' : ''}`} />
                                    <span className="text-xs font-semibold">{currentLikeCount}</span>
                                </motion.button>
                                <div className="flex items-center gap-1 bg-black/70 backdrop-blur-md rounded-lg px-2.5 py-1.5 text-white">
                                    <Eye className="h-3.5 w-3.5" />
                                    <span className="text-xs font-semibold">{viewCount}</span>
                                </div>
                            </motion.div>
                        </div>

                        {/* Bottom Tags */}
                        <div className="absolute bottom-3 left-3 flex gap-2 z-10">
                            {tags.slice(0, 2).map((tag, index) => (
                                <Badge
                                    key={index}
                                    className="bg-white/20 backdrop-blur-md text-white border-white/30 text-xs font-semibold shadow-lg"
                                >
                                    {tag}
                                </Badge>
                            ))}
                        </div>

                        {/* Time Badge */}
                        <div className="absolute top-3 left-3 z-10">
                            {!isPopular && (
                                <Badge className="bg-black/60 backdrop-blur-md text-white border-white/20 text-xs shadow-lg">
                                    <Clock className="h-3 w-3 mr-1" />
                                    {cookingTime}
                                </Badge>
                            )}
                        </div>
                    </div>
                )}

                {/* Content */}
                <div className="p-4 pt-3 flex-grow flex flex-col">
                    <h3 className="font-bold text-gray-900 text-lg mb-2 line-clamp-2 group-hover:text-orange-600 transition-colors duration-200">
                        {title}
                    </h3>

                    {description && (
                        <p className="text-gray-600 text-sm mb-3 line-clamp-2 flex-grow">
                            {description}
                        </p>
                    )}

                    {/* Stats */}
                    <div className="flex items-center justify-between text-sm text-gray-500 mb-3 mt-auto">
                        <div className="flex items-center gap-4">
                            <div className="flex items-center gap-1">
                                <Clock className="h-4 w-4" />
                                <span>{cookingTime}</span>
                            </div>
                            <div className="flex items-center gap-1">
                                <ChefHat className="h-4 w-4" />
                                <span>{difficulty}</span>
                            </div>
                            <div className="flex items-center gap-1">
                                <Star className="h-4 w-4 fill-orange-400 text-orange-400" />
                                <span>{rating}</span>
                            </div>
                        </div>

                        <div className="flex items-center gap-1 text-gray-400">
                            <Eye className="h-4 w-4" />
                            <span>{viewCount}</span>
                        </div>
                    </div>

                    {/* Social Actions */}
                    <div className="border-t border-gray-100 pt-3 mt-auto flex-shrink-0">
                        <RecipeSocial recipeId={id.toString()} initialLikes={likeCount} showComments={true} />
                    </div>
                </div>
            </div>
        </motion.div>
    );
};

export default RecipeCard;
