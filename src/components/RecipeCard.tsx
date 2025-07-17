import React, { useState } from "react";
import { motion } from "framer-motion";
import { Heart, MessageCircle, Share2, Clock, ChefHat, Star, Eye, Bookmark } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import SocialShare from "./SocialShare";

interface RecipeCardProps {
    id: number | string;
    title: string;
    image?: string;
    cookingTime?: string;
    difficulty?: string;
    rating?: number;
    author?: string;
    authorAvatar?: string;
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
    description,
    viewCount = 1250,
    likeCount = 89,
    commentCount = 12,
    isPopular = false,
    tags = ["Kolay", "Hızlı"]
}) => {
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

    return (
        <motion.div
            className="group cursor-pointer"
            whileHover={{ y: -4 }}
            transition={{ type: "spring", stiffness: 400, damping: 25 }}
        >
            <div className="bg-white rounded-2xl shadow-card border border-gray-100/50 overflow-hidden transition-all duration-300 hover:shadow-card-hover hover:border-orange-200/50">
                {/* Header with Author Info */}
                <div className="p-4 pb-2">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                            <Avatar className="h-10 w-10 ring-2 ring-orange-100">
                                <AvatarImage src={authorAvatar} />
                                <AvatarFallback className="bg-gradient-to-r from-orange-400 to-orange-500 text-white text-sm font-semibold">
                                    {author?.charAt(0) || 'C'}
                                </AvatarFallback>
                            </Avatar>
                            <div>
                                <p className="font-semibold text-gray-900 text-sm">{author}</p>
                                <p className="text-xs text-gray-500">{cookingTime}</p>
                            </div>
                        </div>

                        {isPopular && (
                            <div className="flex items-center gap-1 bg-gradient-to-r from-orange-500 to-orange-600 text-white px-2 py-1 rounded-full text-xs font-medium">
                                <Star className="h-3 w-3 fill-current" />
                                Popüler
                            </div>
                        )}
                    </div>
                </div>

                {/* Image */}
                {image && (
                    <div className="relative overflow-hidden mx-4 rounded-xl">
                        <motion.img
                            src={image}
                            alt={title}
                            className="w-full h-48 object-cover transition-transform duration-500 group-hover:scale-105"
                            whileHover={{ scale: 1.05 }}
                        />

                        {/* Overlay Actions */}
                        <div className="absolute top-3 right-3 flex gap-2">
                            <motion.button
                                whileTap={{ scale: 0.9 }}
                                onClick={handleSave}
                                className={`p-2 rounded-full backdrop-blur-md transition-all duration-200 ${isSaved
                                    ? 'bg-orange-500 text-white shadow-glow'
                                    : 'bg-white/80 text-gray-700 hover:bg-white'
                                    }`}
                            >
                                <Bookmark className={`h-4 w-4 ${isSaved ? 'fill-current' : ''}`} />
                            </motion.button>
                        </div>

                        {/* Tags */}
                        <div className="absolute bottom-3 left-3 flex gap-2">
                            {tags.slice(0, 2).map((tag, index) => (
                                <span
                                    key={index}
                                    className="bg-white/90 backdrop-blur-sm text-gray-700 px-2 py-1 rounded-full text-xs font-medium"
                                >
                                    {tag}
                                </span>
                            ))}
                        </div>
                    </div>
                )}

                {/* Content */}
                <div className="p-4 pt-3">
                    <h3 className="font-bold text-gray-900 text-lg mb-2 line-clamp-2 group-hover:text-orange-600 transition-colors duration-200">
                        {title}
                    </h3>

                    {description && (
                        <p className="text-gray-600 text-sm mb-3 line-clamp-2">
                            {description}
                        </p>
                    )}

                    {/* Stats */}
                    <div className="flex items-center justify-between text-sm text-gray-500 mb-3">
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
                    <div className="flex items-center justify-between border-t border-gray-100 pt-3">
                        <div className="flex items-center gap-4">
                            <motion.button
                                whileTap={{ scale: 0.95 }}
                                onClick={handleLike}
                                className={`flex items-center gap-2 transition-all duration-200 ${isLiked
                                    ? 'text-red-500'
                                    : 'text-gray-500 hover:text-red-500'
                                    }`}
                            >
                                <Heart className={`h-5 w-5 ${isLiked ? 'fill-current' : ''}`} />
                                <span className="text-sm font-medium">{likeCount + (isLiked ? 1 : 0)}</span>
                            </motion.button>

                            <button className="flex items-center gap-2 text-gray-500 hover:text-blue-500 transition-colors duration-200">
                                <MessageCircle className="h-5 w-5" />
                                <span className="text-sm font-medium">{commentCount}</span>
                            </button>
                        </div>

                        <SocialShare
                            recipe={{
                                id: id.toString(),
                                title,
                                image: image || "https://images.unsplash.com/photo-1565299624946-b28f40a0ca4b?w=400&h=300&fit=crop",
                                description: description || "Lezzetli tarif",
                                author,
                                cookingTime: cookingTime || "30 dk",
                                difficulty: difficulty || "Kolay",
                                rating
                            }}
                        />
                    </div>
                </div>
            </div>
        </motion.div>
    );
};

export default RecipeCard;
