import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Textarea } from "@/components/ui/textarea";
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog";
import {
    Share2, Instagram, Twitter, Facebook, MessageSquare, Copy,
    MessageCircle, Heart, Bookmark, Camera, Send, Sparkles
} from "lucide-react";
import { motion } from "framer-motion";
import { useToast } from "@/hooks/use-toast";

interface SocialShareProps {
    recipe: {
        id: string;
        title: string;
        image: string;
        description: string;
        author: string;
        cookingTime: string;
        difficulty: string;
        rating: number;
    };
    isOpen?: boolean;
    onClose?: () => void;
}

const SocialShare = ({ recipe, isOpen = false, onClose }: SocialShareProps) => {
    const [shareText, setShareText] = useState(
        `${recipe.title} tarifini denedim! ${recipe.cookingTime} sürede hazır olan bu ${recipe.difficulty.toLowerCase()} tarif çok lezzetli! 🍳✨`
    );
    const [selectedPlatforms, setSelectedPlatforms] = useState<string[]>([]);
    const { toast } = useToast();

    const shareUrl = `https://neyesek.ai/tarif/${recipe.id}`;

    const socialPlatforms = [
        {
            name: "Instagram",
            icon: Instagram,
            color: "bg-gradient-to-r from-purple-500 to-pink-500",
            action: () => {
                // Instagram web paylaşımı (Stories)
                navigator.clipboard.writeText(`${shareText}\n\n${shareUrl}`);
                toast({
                    title: "Instagram için hazırlandı!",
                    description: "Metin kopyalandı. Instagram'da yapıştırabilirsin.",
                });
            }
        },
        {
            name: "WhatsApp",
            icon: MessageSquare,
            color: "bg-green-500",
            action: () => {
                const text = encodeURIComponent(`${shareText}\n\n${shareUrl}`);
                window.open(`https://wa.me/?text=${text}`, '_blank');
            }
        },
        {
            name: "Twitter",
            icon: Twitter,
            color: "bg-blue-500",
            action: () => {
                const text = encodeURIComponent(shareText);
                const url = encodeURIComponent(shareUrl);
                window.open(`https://twitter.com/intent/tweet?text=${text}&url=${url}`, '_blank');
            }
        },
        {
            name: "Facebook",
            icon: Facebook,
            color: "bg-blue-600",
            action: () => {
                const url = encodeURIComponent(shareUrl);
                window.open(`https://www.facebook.com/sharer/sharer.php?u=${url}`, '_blank');
            }
        }
    ];

    const copyToClipboard = () => {
        navigator.clipboard.writeText(`${shareText}\n\n${shareUrl}`);
        toast({
            title: "Kopyalandı!",
            description: "Tarif linki panoya kopyalandı.",
        });
    };

    const generateStoryImage = () => {
        toast({
            title: "Story tasarımı oluşturuluyor!",
            description: "Instagram Story için özel tasarım hazırlanıyor...",
        });
        // Bu özellik geliştirilecek - story template generator
    };

    return (
        <Dialog open={isOpen} onOpenChange={onClose}>
            <DialogTrigger asChild>
                <Button variant="ghost" size="icon" className="hover:bg-orange-50">
                    <Share2 className="h-4 w-4" />
                </Button>
            </DialogTrigger>

            <DialogContent className="max-w-md bg-white/95 backdrop-blur-sm border-0 shadow-2xl">
                <DialogHeader>
                    <DialogTitle className="text-center flex items-center gap-2 justify-center">
                        <Sparkles className="h-5 w-5 text-orange-500" />
                        Tarifi Paylaş
                    </DialogTitle>
                </DialogHeader>

                <div className="space-y-6">
                    {/* Recipe Preview */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="bg-gradient-to-r from-orange-50 to-orange-100 rounded-2xl p-4"
                    >
                        <div className="flex gap-3">
                            <img
                                src={recipe.image}
                                alt={recipe.title}
                                className="w-16 h-16 rounded-xl object-cover"
                            />
                            <div className="flex-1">
                                <h3 className="font-bold text-gray-800 text-sm">{recipe.title}</h3>
                                <p className="text-xs text-gray-600 line-clamp-2">{recipe.description}</p>
                                <div className="flex gap-2 mt-2">
                                    <Badge className="bg-orange-500 text-white text-xs">
                                        {recipe.cookingTime}
                                    </Badge>
                                    <Badge className="bg-gray-500 text-white text-xs">
                                        {recipe.difficulty}
                                    </Badge>
                                </div>
                            </div>
                        </div>
                    </motion.div>

                    {/* Share Text Editor */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.1 }}
                        className="space-y-3"
                    >
                        <label className="text-sm font-semibold text-gray-700">Paylaşım Metni</label>
                        <Textarea
                            value={shareText}
                            onChange={(e) => setShareText(e.target.value)}
                            placeholder="Tarifle ilgili düşüncelerini yaz..."
                            className="resize-none border-orange-200 focus:border-orange-400 rounded-xl"
                            rows={3}
                        />
                        <div className="text-xs text-gray-500 text-right">
                            {shareText.length}/280 karakter
                        </div>
                    </motion.div>

                    {/* Social Platforms */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.2 }}
                        className="space-y-3"
                    >
                        <label className="text-sm font-semibold text-gray-700">Nerede Paylaş?</label>
                        <div className="grid grid-cols-2 gap-3">
                            {socialPlatforms.map((platform, index) => (
                                <motion.button
                                    key={platform.name}
                                    initial={{ opacity: 0, scale: 0.8 }}
                                    animate={{ opacity: 1, scale: 1 }}
                                    transition={{ delay: 0.3 + index * 0.1 }}
                                    onClick={platform.action}
                                    className={`${platform.color} text-white p-3 rounded-xl flex items-center gap-2 hover:scale-105 transition-all duration-200 shadow-lg hover:shadow-xl`}
                                >
                                    <platform.icon className="h-5 w-5" />
                                    <span className="text-sm font-semibold">{platform.name}</span>
                                </motion.button>
                            ))}
                        </div>
                    </motion.div>

                    {/* Special Actions */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.4 }}
                        className="grid grid-cols-2 gap-3"
                    >
                        <Button
                            onClick={generateStoryImage}
                            className="bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white rounded-xl"
                        >
                            <Camera className="h-4 w-4 mr-2" />
                            Story Oluştur
                        </Button>
                        <Button
                            onClick={copyToClipboard}
                            variant="outline"
                            className="border-orange-200 hover:bg-orange-50 rounded-xl"
                        >
                            <Copy className="h-4 w-4 mr-2" />
                            Linki Kopyala
                        </Button>
                    </motion.div>

                    {/* Engagement Stats Preview */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.5 }}
                        className="bg-gray-50 rounded-xl p-3"
                    >
                        <div className="flex items-center justify-between text-sm">
                            <div className="flex items-center gap-4">
                                <div className="flex items-center gap-1 text-red-500">
                                    <Heart className="h-4 w-4" />
                                    <span>{Math.floor(recipe.rating * 42)}</span>
                                </div>
                                <div className="flex items-center gap-1 text-blue-500">
                                    <MessageSquare className="h-4 w-4" />
                                    <span>{Math.floor(recipe.rating * 12)}</span>
                                </div>
                                <div className="flex items-center gap-1 text-yellow-500">
                                    <Bookmark className="h-4 w-4" />
                                    <span>{Math.floor(recipe.rating * 8)}</span>
                                </div>
                            </div>
                            <span className="text-gray-500 text-xs">Beklenen etkileşim</span>
                        </div>
                    </motion.div>
                </div>
            </DialogContent>
        </Dialog>
    );
};

export default SocialShare;
