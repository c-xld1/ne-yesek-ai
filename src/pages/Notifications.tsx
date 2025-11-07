import { useState } from "react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import LoadingSpinner from "@/components/LoadingSpinner";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Bell, Heart, MessageCircle, User, ChefHat, Award,
  Settings, Check, X, Trash2
} from "lucide-react";
import { 
  useNotifications, 
  useUnreadNotificationCount, 
  useMarkNotificationAsRead, 
  useMarkAllNotificationsAsRead,
  useDeleteNotification 
} from "@/hooks/useNotifications";
import { useToast } from "@/hooks/use-toast";

const Notifications = () => {
  const [activeTab, setActiveTab] = useState("all");
  const { toast } = useToast();
  
  // Fetch notifications based on active tab
  const { data: notifications = [], isLoading } = useNotifications(activeTab);
  const { data: unreadCount = 0 } = useUnreadNotificationCount();
  const markAsReadMutation = useMarkNotificationAsRead();
  const markAllAsReadMutation = useMarkAllNotificationsAsRead();
  const deleteNotificationMutation = useDeleteNotification();

  const markAsRead = async (id: string) => {
    try {
      await markAsReadMutation.mutateAsync(id);
      toast({
        title: "✓ İşaretlendi",
        description: "Bildirim okundu olarak işaretlendi",
      });
    } catch (error) {
      toast({
        title: "Hata",
        description: "Bildirim işaretlenemedi",
        variant: "destructive",
      });
    }
  };

  const markAllAsRead = async () => {
    try {
      await markAllAsReadMutation.mutateAsync();
      toast({
        title: "✓ Tümü İşaretlendi",
        description: "Tüm bildirimler okundu olarak işaretlendi",
      });
    } catch (error) {
      toast({
        title: "Hata",
        description: "Bildirimler işaretlenemedi",
        variant: "destructive",
      });
    }
  };

  const deleteNotification = async (id: string) => {
    try {
      await deleteNotificationMutation.mutateAsync(id);
      toast({
        title: "✓ Silindi",
        description: "Bildirim silindi",
      });
    } catch (error) {
      toast({
        title: "Hata",
        description: "Bildirim silinemedi",
        variant: "destructive",
      });
    }
  };

  const getIconForType = (type: string) => {
    switch (type) {
      case 'like': return Heart;
      case 'comment': return MessageCircle;
      case 'follow': return User;
      case 'recipe': return ChefHat;
      case 'achievement': return Award;
      default: return Bell;
    }
  };

  const getColorForType = (type: string) => {
    switch (type) {
      case 'like': return "text-red-500";
      case 'comment': return "text-blue-500";
      case 'follow': return "text-green-500";
      case 'recipe': return "text-orange-500";
      case 'achievement': return "text-yellow-500";
      default: return "text-gray-500";
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 via-white to-orange-50">
      <Navbar />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-4">
            🔔 Bildirimler
          </h1>
          <p className="text-gray-600">
            Size özel güncellemeler ve etkileşimler
          </p>
        </div>

        <div className="mb-6 flex justify-between items-center">
          <div className="flex items-center gap-2">
            <h2 className="text-xl font-semibold text-gray-900">
              Bildirimleriniz
            </h2>
            {unreadCount > 0 && (
              <Badge className="bg-red-500 text-white">
                {unreadCount} okunmamış
              </Badge>
            )}
          </div>
          <div className="flex gap-2">
            {unreadCount > 0 && (
              <Button variant="outline" onClick={markAllAsRead} disabled={markAllAsReadMutation.isPending}>
                <Check className="h-4 w-4 mr-2" />
                Tümünü Okundu İşaretle
              </Button>
            )}
            <Button variant="outline" onClick={() => window.location.href = '/ayarlar'}>
              <Settings className="h-4 w-4 mr-2" />
              Bildirim Ayarları
            </Button>
          </div>
        </div>

        {isLoading ? (
          <div className="flex justify-center py-16">
            <LoadingSpinner />
          </div>
        ) : (
          <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
            <TabsList className="grid w-full grid-cols-5">
              <TabsTrigger value="all">Tümü</TabsTrigger>
              <TabsTrigger value="like">Beğeniler</TabsTrigger>
              <TabsTrigger value="comment">Yorumlar</TabsTrigger>
              <TabsTrigger value="follow">Takipçiler</TabsTrigger>
              <TabsTrigger value="system">Sistem</TabsTrigger>
            </TabsList>

            <TabsContent value={activeTab} className="space-y-4">
              {notifications.length === 0 ? (
                <Card>
                  <CardContent className="p-12 text-center">
                    <Bell className="h-16 w-16 text-gray-300 mx-auto mb-4" />
                    <h3 className="text-lg font-semibold text-gray-900 mb-2">
                      Henüz bildiriminiz yok
                    </h3>
                    <p className="text-gray-600">
                      Yeni etkileşimler ve güncellemeler burada görünecek
                    </p>
                  </CardContent>
                </Card>
              ) : (
                notifications.map((notification) => {
                  const IconComponent = getIconForType(notification.type);
                  const iconColor = getColorForType(notification.type);
                  
                  return (
                    <Card key={notification.id} className={`transition-all hover:shadow-md ${!notification.read ? 'ring-2 ring-orange-200 bg-orange-50' : ''}`}>
                      <CardContent className="p-6">
                        <div className="flex items-start gap-4">
                          <div className="flex-shrink-0">
                            {notification.avatar ? (
                              <Avatar className="w-12 h-12">
                                <AvatarImage src={notification.avatar} />
                                <AvatarFallback>{notification.title[0]}</AvatarFallback>
                              </Avatar>
                            ) : (
                              <div className="w-12 h-12 bg-gray-100 rounded-full flex items-center justify-center">
                                <IconComponent className={`h-6 w-6 ${iconColor}`} />
                              </div>
                            )}
                          </div>

                          <div className="flex-1 min-w-0">
                            <div className="flex items-center gap-2 mb-1">
                              <h3 className="font-semibold text-gray-900">{notification.title}</h3>
                              {!notification.read && (
                                <div className="w-2 h-2 bg-orange-500 rounded-full"></div>
                              )}
                            </div>
                            <p className="text-gray-600 text-sm mb-2">{notification.message}</p>
                            <p className="text-gray-400 text-xs">{notification.time}</p>
                          </div>

                          <div className="flex items-center gap-2">
                            {!notification.read && (
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => markAsRead(notification.id)}
                                disabled={markAsReadMutation.isPending}
                              >
                                <Check className="h-4 w-4" />
                              </Button>
                            )}
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => deleteNotification(notification.id)}
                              disabled={deleteNotificationMutation.isPending}
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  );
                })
              )}
            </TabsContent>
          </Tabs>
        )}
      </div>

      <Footer />
    </div>
  );
};

export default Notifications;
