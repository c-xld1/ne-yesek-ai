import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
    User, ChefHat, Heart, BookOpen, Users, Calendar, MapPin,
    Star, Award, Settings, Edit, Share, Trophy, Clock,
    Instagram, Twitter, Youtube, Globe, Plus
} from "lucide-react";
import { motion } from "framer-motion";
import { useCombinedAchievements, useUserStats } from "@/hooks/useAchievements";
import LoadingSpinner from "./LoadingSpinner";

interface UserStats {
    recipes: number;
    followers: number;
    following: number;
    likes?: number;
    totalLikes?: number;
    views?: number;
    totalViews?: number;
    rating?: number;
}

// Type guard to check if stats has likes/views
function hasLikesViews(stats: UserStats): stats is UserStats & { likes: number; views: number } {
    return 'likes' in stats || 'views' in stats;
}

interface Achievement {
    id: string;
    title: string;
    description: string;
    icon: string;
    color: string;
    earned: boolean;
    earnedDate?: string;
}

interface UserProfileProps {
    user?: {
        id: string;
        name: string;
        username: string;
        bio: string;
        avatar: string;
        coverImage: string;
        location: string;
        joinDate: string;
        website?: string;
        socialLinks?: {
            instagram?: string;
            twitter?: string;
            youtube?: string;
        };
    };
    stats?: UserStats;
    isOwnProfile?: boolean;
}

const UserProfileCard = ({
    user = {
        id: '1',
        name: 'Chef Ayşe',
        username: 'chefayse',
        bio: 'Geleneksel Türk mutfağını modern tarzda sunmayı seven bir aşçıyım. Ev yapımı lezzetlerin sırrını paylaşıyorum! 👩‍🍳✨',
        avatar: 'https://images.unsplash.com/photo-1494790108755-2616b612b47c?w=150&h=150&fit=crop',
        coverImage: 'https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=800&h=300&fit=crop',
        location: 'İstanbul, Türkiye',
        joinDate: 'Ocak 2023',
        website: 'https://chefayse.com',
        socialLinks: {
            instagram: '@chefayse',
            youtube: 'Chef Ayşe',
            twitter: '@chefayse'
        }
    },
    stats,
    isOwnProfile = true
}: UserProfileProps) => {

    const [isFollowing, setIsFollowing] = useState(false);
    const [activeTab, setActiveTab] = useState("overview");

    // Gerçek veritabanından başarıları ve istatistikleri çek
    const { achievements, earnedAchievements, nextAchievement, totalPoints, isLoading: achievementsLoading } = useCombinedAchievements(user.id);
    const { data: userStats, isLoading: statsLoading } = useUserStats(user.id);

    // Stats prop'u varsa onu kullan, yoksa veritabanından çekilen verileri kullan
    const displayStats = stats || userStats || {
        recipes: 0,
        followers: 0,
        following: 0,
        likes: 0,
        views: 0,
        rating: 0
    };

    const formatNumber = (num: number) => {
        if (num >= 1000000) return (num / 1000000).toFixed(1) + 'M';
        if (num >= 1000) return (num / 1000).toFixed(1) + 'K';
        return num.toString();
    };

    return (
        <div className="max-w-4xl mx-auto">
            <Card className="overflow-hidden bg-white/80 backdrop-blur-sm shadow-2xl border border-orange-100">
                {/* Cover Image */}
                <div className="relative h-48 bg-gradient-to-r from-orange-400 to-orange-600 overflow-hidden">
                    <img
                        src={user.coverImage}
                        alt="Cover"
                        className="w-full h-full object-cover mix-blend-overlay"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />

                    {/* Profile Actions */}
                    <div className="absolute top-4 right-4 flex gap-2">
                        {isOwnProfile ? (
                            <>
                                <Button size="sm" variant="secondary" className="bg-white/90 backdrop-blur-sm">
                                    <Edit className="h-4 w-4 mr-1" />
                                    Düzenle
                                </Button>
                                <Button size="sm" variant="secondary" className="bg-white/90 backdrop-blur-sm">
                                    <Settings className="h-4 w-4" />
                                </Button>
                            </>
                        ) : (
                            <>
                                <Button
                                    size="sm"
                                    onClick={() => setIsFollowing(!isFollowing)}
                                    className={isFollowing
                                        ? "bg-gray-600 hover:bg-gray-700 text-white"
                                        : "bg-orange-500 hover:bg-orange-600 text-white"
                                    }
                                >
                                    <Users className="h-4 w-4 mr-1" />
                                    {isFollowing ? 'Takibi Bırak' : 'Takip Et'}
                                </Button>
                                <Button size="sm" variant="secondary" className="bg-white/90 backdrop-blur-sm">
                                    <Share className="h-4 w-4" />
                                </Button>
                            </>
                        )}
                    </div>
                </div>

                <CardContent className="relative px-6 pb-6">
                    {/* Profile Info */}
                    <div className="flex flex-col md:flex-row gap-6 -mt-16 relative z-10">
                        {/* Avatar and Basic Info */}
                        <div className="flex flex-col items-center md:items-start">
                            <Avatar className="h-32 w-32 border-4 border-white shadow-xl">
                                <AvatarImage src={user.avatar} />
                                <AvatarFallback className="text-xl font-bold">
                                    {user.name.split(' ').map(n => n[0]).join('')}
                                </AvatarFallback>
                            </Avatar>

                            <div className="mt-4 text-center md:text-left">
                                <h1 className="text-2xl font-bold text-gray-800">{user.name}</h1>
                                <p className="text-gray-600">@{user.username}</p>

                                {/* Rating */}
                                <div className="flex items-center gap-1 mt-2 justify-center md:justify-start">
                                    <Star className="h-4 w-4 text-yellow-500 fill-current" />
                                    <span className="font-semibold text-gray-800">{stats.rating}</span>
                                    <span className="text-gray-500 text-sm">(Ortalama puan)</span>
                                </div>
                            </div>
                        </div>

                        {/* Stats Grid */}
                        <div className="flex-1 grid grid-cols-2 md:grid-cols-5 gap-4 mt-6 md:mt-0">
                            {[
                                { label: 'Tarif', value: displayStats.recipes, icon: ChefHat, color: 'text-orange-500' },
                                { label: 'Takipçi', value: displayStats.followers, icon: Users, color: 'text-blue-500' },
                                { label: 'Takip', value: displayStats.following, icon: Heart, color: 'text-red-500' },
                                { label: 'Beğeni', value: displayStats.totalLikes || (hasLikesViews(displayStats) ? displayStats.likes : 0) || 0, icon: Heart, color: 'text-pink-500' },
                                { label: 'Görüntüleme', value: displayStats.totalViews || (hasLikesViews(displayStats) ? displayStats.views : 0) || 0, icon: Clock, color: 'text-purple-500' }
                            ].map((stat, index) => (
                                <motion.div
                                    key={stat.label}
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ delay: index * 0.1 }}
                                    className="text-center p-3 bg-gray-50 rounded-xl"
                                >
                                    <stat.icon className={`h-5 w-5 mx-auto mb-1 ${stat.color}`} />
                                    <div className="font-bold text-lg text-gray-800">
                                        {formatNumber(stat.value)}
                                    </div>
                                    <div className="text-sm text-gray-600">{stat.label}</div>
                                </motion.div>
                            ))}
                        </div>
                    </div>

                    {/* Bio and Details */}
                    <div className="mt-6 space-y-4">
                        <p className="text-gray-700 leading-relaxed">{user.bio}</p>

                        <div className="flex flex-wrap gap-4 text-sm text-gray-600">
                            <div className="flex items-center gap-1">
                                <MapPin className="h-4 w-4" />
                                {user.location}
                            </div>
                            <div className="flex items-center gap-1">
                                <Calendar className="h-4 w-4" />
                                {user.joinDate} tarihinde katıldı
                            </div>
                            {user.website && (
                                <div className="flex items-center gap-1">
                                    <Globe className="h-4 w-4" />
                                    <a href={user.website} className="text-orange-500 hover:underline">
                                        Website
                                    </a>
                                </div>
                            )}
                        </div>

                        {/* Social Links */}
                        {user.socialLinks && (
                            <div className="flex gap-3">
                                {user.socialLinks.instagram && (
                                    <Button variant="ghost" size="sm" className="text-pink-500">
                                        <Instagram className="h-4 w-4 mr-1" />
                                        {user.socialLinks.instagram}
                                    </Button>
                                )}
                                {user.socialLinks.twitter && (
                                    <Button variant="ghost" size="sm" className="text-blue-500">
                                        <Twitter className="h-4 w-4 mr-1" />
                                        {user.socialLinks.twitter}
                                    </Button>
                                )}
                                {user.socialLinks.youtube && (
                                    <Button variant="ghost" size="sm" className="text-red-500">
                                        <Youtube className="h-4 w-4 mr-1" />
                                        {user.socialLinks.youtube}
                                    </Button>
                                )}
                            </div>
                        )}
                    </div>

                    {/* Achievements Section */}
                    <div className="mt-8">
                        <div className="flex items-center gap-2 mb-4">
                            <Trophy className="h-5 w-5 text-yellow-500" />
                            <h3 className="text-lg font-bold text-gray-800">Başarılar</h3>
                            {achievementsLoading ? (
                                <Badge className="bg-gray-100 text-gray-500 ml-auto">Yükleniyor...</Badge>
                            ) : (
                                <>
                                    <Badge className="bg-yellow-100 text-yellow-800 ml-auto">
                                        {earnedAchievements.length}/{achievements.length}
                                    </Badge>
                                    {totalPoints > 0 && (
                                        <Badge className="bg-orange-100 text-orange-800">
                                            {totalPoints} Puan
                                        </Badge>
                                    )}
                                </>
                            )}
                        </div>

                        {achievementsLoading ? (
                            <div className="flex justify-center py-8">
                                <LoadingSpinner />
                            </div>
                        ) : (
                            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                                {earnedAchievements.slice(0, 8).map((achievement) => (
                                    <motion.div
                                        key={achievement.id}
                                        whileHover={{ scale: 1.05 }}
                                        className="bg-gradient-to-br from-yellow-50 to-yellow-100 p-3 rounded-xl text-center border border-yellow-200 cursor-pointer"
                                        title={achievement.description}
                                    >
                                        <div className="text-2xl mb-1">{achievement.icon}</div>
                                        <div className="text-sm font-semibold text-gray-800">{achievement.title}</div>
                                        <div className="text-xs text-gray-600">
                                            {achievement.earnedDate ? new Date(achievement.earnedDate).toLocaleDateString('tr-TR', { 
                                                month: 'short', 
                                                year: 'numeric' 
                                            }) : ''}
                                        </div>
                                    </motion.div>
                                ))}

                                {nextAchievement && (
                                    <motion.div
                                        whileHover={{ scale: 1.05 }}
                                        className="bg-gray-100 p-3 rounded-xl text-center border-2 border-dashed border-gray-300 cursor-pointer"
                                        title={nextAchievement.description}
                                    >
                                        <div className="text-2xl mb-1 opacity-50">{nextAchievement.icon}</div>
                                        <div className="text-sm font-semibold text-gray-600">{nextAchievement.title}</div>
                                        <div className="text-xs text-gray-500">Yakında</div>
                                    </motion.div>
                                )}

                                {achievements.length === 0 && !achievementsLoading && (
                                    <div className="col-span-full text-center py-8 text-gray-500">
                                        Henüz başarı yok. Tarif paylaşmaya başla!
                                    </div>
                                )}
                            </div>
                        )}
                    </div>
                </CardContent>
            </Card>
        </div>
    );
};

export default UserProfileCard;
