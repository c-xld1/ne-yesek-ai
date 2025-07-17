import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Bell, Heart, MessageCircle, UserPlus, Star, Clock, Check, X } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

interface Notification {
    id: string;
    type: 'like' | 'comment' | 'follow' | 'recipe' | 'award';
    title: string;
    message: string;
    time: string;
    isRead: boolean;
    avatar?: string;
    recipeImage?: string;
    userId?: string;
}

const NotificationCenter = () => {
    const [notifications, setNotifications] = useState<Notification[]>([
        {
            id: '1',
            type: 'like',
            title: 'Yeni beğeni',
            message: 'Ayşe H. "Tavuk Sote" tarifini beğendi',
            time: '2 dk önce',
            isRead: false,
            avatar: 'https://images.unsplash.com/photo-1494790108755-2616b612b47c?w=100&h=100&fit=crop',
            recipeImage: 'https://images.unsplash.com/photo-1598103442097-8b74394b95c6?w=100&h=100&fit=crop'
        },
        {
            id: '2',
            type: 'comment',
            title: 'Yeni yorum',
            message: 'Mehmet K. "Çikolatalı Kek" tarifine yorum yaptı',
            time: '5 dk önce',
            isRead: false,
            avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop',
            recipeImage: 'https://images.unsplash.com/photo-1578985545062-69928b1d9587?w=100&h=100&fit=crop'
        },
        {
            id: '3',
            type: 'follow',
            title: 'Yeni takipçi',
            message: 'Zeynep M. sizi takip etmeye başladı',
            time: '10 dk önce',
            isRead: false,
            avatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=100&h=100&fit=crop'
        },
        {
            id: '4',
            type: 'award',
            title: 'Başarı rozeti',
            message: '"Yeni Şef" rozetini kazandınız!',
            time: '1 saat önce',
            isRead: true,
            avatar: '⭐'
        },
        {
            id: '5',
            type: 'recipe',
            title: 'Yeni tarif önerisi',
            message: 'Sizin için özel seçilen: "Künefe"',
            time: '2 saat önce',
            isRead: true,
            recipeImage: 'https://images.unsplash.com/photo-1551024506-0bccd828d307?w=100&h=100&fit=crop'
        }
    ]);

    const [isOpen, setIsOpen] = useState(false);

    const unreadCount = notifications.filter(n => !n.isRead).length;

    const markAsRead = (id: string) => {
        setNotifications(notifications.map(n =>
            n.id === id ? { ...n, isRead: true } : n
        ));
    };

    const markAllAsRead = () => {
        setNotifications(notifications.map(n => ({ ...n, isRead: true })));
    };

    const removeNotification = (id: string) => {
        setNotifications(notifications.filter(n => n.id !== id));
    };

    const getNotificationIcon = (type: string) => {
        switch (type) {
            case 'like': return <Heart className="h-4 w-4 text-red-500" />;
            case 'comment': return <MessageCircle className="h-4 w-4 text-blue-500" />;
            case 'follow': return <UserPlus className="h-4 w-4 text-green-500" />;
            case 'award': return <Star className="h-4 w-4 text-yellow-500" />;
            case 'recipe': return <Bell className="h-4 w-4 text-purple-500" />;
            default: return <Bell className="h-4 w-4 text-gray-500" />;
        }
    };

    return (
        <div className="relative">
            {/* Notification Bell */}
            <Button
                variant="ghost"
                size="icon"
                className="relative"
                onClick={() => setIsOpen(!isOpen)}
            >
                <Bell className="h-5 w-5" />
                {unreadCount > 0 && (
                    <motion.div
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center"
                    >
                        {unreadCount}
                    </motion.div>
                )}
            </Button>

            {/* Notification Panel */}
            <AnimatePresence>
                {isOpen && (
                    <motion.div
                        initial={{ opacity: 0, y: -10, scale: 0.95 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: -10, scale: 0.95 }}
                        transition={{ duration: 0.2 }}
                        className="absolute right-0 top-full mt-2 w-96 bg-white rounded-2xl shadow-2xl border border-gray-100 z-50 max-h-96 overflow-hidden"
                    >
                        {/* Header */}
                        <div className="p-4 border-b border-gray-100 bg-gradient-to-r from-orange-50 to-orange-100">
                            <div className="flex items-center justify-between">
                                <h3 className="font-bold text-gray-800">Bildirimler</h3>
                                <div className="flex gap-2">
                                    {unreadCount > 0 && (
                                        <Button
                                            variant="ghost"
                                            size="sm"
                                            onClick={markAllAsRead}
                                            className="text-xs"
                                        >
                                            Tümünü Okundu Yap
                                        </Button>
                                    )}
                                    <Button
                                        variant="ghost"
                                        size="icon"
                                        onClick={() => setIsOpen(false)}
                                        className="h-6 w-6"
                                    >
                                        <X className="h-4 w-4" />
                                    </Button>
                                </div>
                            </div>
                        </div>

                        {/* Notifications List */}
                        <div className="max-h-80 overflow-y-auto">
                            {notifications.length === 0 ? (
                                <div className="p-8 text-center text-gray-500">
                                    <Bell className="h-12 w-12 mx-auto mb-4 text-gray-300" />
                                    <p>Henüz bildirim yok</p>
                                </div>
                            ) : (
                                notifications.map((notification, index) => (
                                    <motion.div
                                        key={notification.id}
                                        initial={{ opacity: 0, x: -20 }}
                                        animate={{ opacity: 1, x: 0 }}
                                        transition={{ delay: index * 0.1 }}
                                        className={`p-4 border-b border-gray-50 hover:bg-gray-50 transition-colors cursor-pointer ${!notification.isRead ? 'bg-blue-50/50' : ''
                                            }`}
                                        onClick={() => markAsRead(notification.id)}
                                    >
                                        <div className="flex items-start gap-3">
                                            {/* Icon or Avatar */}
                                            <div className="relative">
                                                {notification.avatar && notification.avatar !== '⭐' ? (
                                                    <Avatar className="h-10 w-10">
                                                        <AvatarImage src={notification.avatar} />
                                                        <AvatarFallback>U</AvatarFallback>
                                                    </Avatar>
                                                ) : notification.avatar === '⭐' ? (
                                                    <div className="h-10 w-10 bg-yellow-100 rounded-full flex items-center justify-center text-xl">
                                                        ⭐
                                                    </div>
                                                ) : (
                                                    <div className="h-10 w-10 bg-gray-100 rounded-full flex items-center justify-center">
                                                        {getNotificationIcon(notification.type)}
                                                    </div>
                                                )}

                                                {/* Notification type icon overlay */}
                                                <div className="absolute -bottom-1 -right-1 bg-white rounded-full p-1 shadow-sm">
                                                    {getNotificationIcon(notification.type)}
                                                </div>
                                            </div>

                                            {/* Content */}
                                            <div className="flex-1 min-w-0">
                                                <div className="flex items-start justify-between">
                                                    <div className="flex-1">
                                                        <p className="text-sm font-semibold text-gray-800">
                                                            {notification.title}
                                                        </p>
                                                        <p className="text-sm text-gray-600 mt-1">
                                                            {notification.message}
                                                        </p>
                                                        <div className="flex items-center gap-2 mt-2">
                                                            <Clock className="h-3 w-3 text-gray-400" />
                                                            <span className="text-xs text-gray-400">
                                                                {notification.time}
                                                            </span>
                                                            {!notification.isRead && (
                                                                <Badge className="bg-blue-500 text-white text-xs px-2 py-0">
                                                                    Yeni
                                                                </Badge>
                                                            )}
                                                        </div>
                                                    </div>

                                                    {/* Recipe image if available */}
                                                    {notification.recipeImage && (
                                                        <img
                                                            src={notification.recipeImage}
                                                            alt="Recipe"
                                                            className="h-12 w-12 rounded-lg object-cover ml-3"
                                                        />
                                                    )}

                                                    {/* Remove button */}
                                                    <Button
                                                        variant="ghost"
                                                        size="icon"
                                                        className="h-6 w-6 ml-2 opacity-0 group-hover:opacity-100 transition-opacity"
                                                        onClick={(e) => {
                                                            e.stopPropagation();
                                                            removeNotification(notification.id);
                                                        }}
                                                    >
                                                        <X className="h-3 w-3" />
                                                    </Button>
                                                </div>
                                            </div>
                                        </div>
                                    </motion.div>
                                ))
                            )}
                        </div>

                        {/* Footer */}
                        {notifications.length > 0 && (
                            <div className="p-3 border-t border-gray-100 bg-gray-50 text-center">
                                <Button variant="ghost" size="sm" className="text-xs text-gray-600">
                                    Tüm bildirimleri görüntüle
                                </Button>
                            </div>
                        )}
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
};

export default NotificationCenter;
