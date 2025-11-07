import React, { useState } from "react";
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

interface RecipeCardProps {
    id: number | string;
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
}

const RecipeCard: React.FC<RecipeCardProps> = ({
    id,
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
    tags = ["Kolay", "Hızlı"]
}) => {
    const navigate = useNavigate();
    const [isLiked, setIsLiked] = useState(false);
    const [isSaved, setIsSaved] = useState(false);

    const handleLike = (e: React.MouseEvent) => {
        e.preventDefault();
        e.stopPropagation();
        setIsLiked(!isLiked);
    };

    const handleSave = (e: React.MouseEvent) => {
        e.preventDefault();
        e.stopPropagation();
        setIsSaved(!isSaved);
    };

    const handleAuthorClick = (e: React.MouseEvent) => {
        e.preventDefault();
        e.stopPropagation();
        if (authorUsername) {
            navigate(`/profil/${authorUsername}`);
        }
    };

    return (
        <motion.div
            className="group cursor-pointer h-full"
            whileHover={{ y: -8 }}
            transition={{ type: "spring", stiffness: 300, damping: 20 }}
            onClick={() => navigate(`/recipe/${id}`)}
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
                                <div className="flex items-center gap-1 bg-black/70 backdrop-blur-md rounded-lg px-2.5 py-1.5 text-white">
                                    <Heart className="h-3.5 w-3.5 fill-red-500 text-red-500" />
                                    <span className="text-xs font-semibold">{likeCount}</span>
                                </div>
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
