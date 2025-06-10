import { useState } from "react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  Bell, Heart, MessageCircle, User, ChefHat, Award, 
  Settings, Check, X, Trash2 
} from "lucide-react";

const Notifications = () => {
  const [activeTab, setActiveTab] = useState("all");

  const notifications = [
    {
      id: 1,
      type: "like",
      title: "Tarifiniz beğenildi",
      message: "Chef Mehmet 'Tavuk Sote' tarifinizi beğendi",
      time: "2 saat önce",
      read: false,
      avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=50&h=50&fit=crop",
      icon: Heart,
      color: "text-red-500"
    },
    {
      id: 2,
      type: "comment",
      title: "Yeni yorum",
      message: "Ayşe Hanım tarifinize yorum yaptı: 'Harika görünüyor, deneyeceğim!'",
      time: "4 saat önce",
      read: false,
      avatar: "https://images.unsplash.com/photo-1494790108755-2616c4f23456?w=50&h=50&fit=crop",
      icon: MessageCircle,
      color: "text-blue-500"
    },
    {
      id: 3,
      type: "follow",
      title: "Yeni takipçi",
      message: "Zeynep Kaya sizi takip etmeye başladı",
      time: "1 gün önce",
      read: true,
      avatar: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=50&h=50&fit=crop",
      icon: User,
      color: "text-green-500"
    },
    {
      id: 4,
      type: "recipe",
      title: "Tarif onaylandı",
      message: "'Mercimek Çorbası' tarifiniz onaylandı ve yayınlandı",
      time: "2 gün önce",
      read: true,
      avatar: null,
      icon: ChefHat,
      color: "text-orange-500"
    },
    {
      id: 5,
      type: "achievement",
      title: "Başarı kazandınız",
      message: "'İlk 100 Beğeni' rozetini kazandınız",
      time: "3 gün önce",
      read: true,
      avatar: null,
      icon: Award,
      color: "text-yellow-500"
    }
  ];

  const unreadCount = notifications.filter(n => !n.read).length;

  const markAsRead = (id: number) => {
    // Notification'ı okundu olarak işaretle
    console.log(`Marking notification ${id} as read`);
  };

  const markAllAsRead = () => {
    console.log("Marking all notifications as read");
  };

  const deleteNotification = (id: number) => {
    console.log(`Deleting notification ${id}`);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      
      <div className="max-w-4xl mx-auto px-4 py-8">
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
            <Button variant="outline" onClick={markAllAsRead}>
              <Check className="h-4 w-4 mr-2" />
              Tümünü Okundu İşaretle
            </Button>
            <Button variant="outline">
              <Settings className="h-4 w-4 mr-2" />
              Bildirim Ayarları
            </Button>
          </div>
        </div>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <TabsList className="grid w-full grid-cols-5">
            <TabsTrigger value="all">Tümü</TabsTrigger>
            <TabsTrigger value="likes">Beğeniler</TabsTrigger>
            <TabsTrigger value="comments">Yorumlar</TabsTrigger>
            <TabsTrigger value="follows">Takipçiler</TabsTrigger>
            <TabsTrigger value="system">Sistem</TabsTrigger>
          </TabsList>

          <TabsContent value="all" className="space-y-4">
            {notifications.map((notification) => (
              <Card key={notification.id} className={`transition-all hover:shadow-md ${!notification.read ? 'ring-2 ring-food-200 bg-food-50' : ''}`}>
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
                          <notification.icon className={`h-6 w-6 ${notification.color}`} />
                        </div>
                      )}
                    </div>
                    
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1">
                        <h3 className="font-semibold text-gray-900">{notification.title}</h3>
                        {!notification.read && (
                          <div className="w-2 h-2 bg-food-500 rounded-full"></div>
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
                        >
                          <Check className="h-4 w-4" />
                        </Button>
                      )}
                      <Button 
                        variant="ghost" 
                        size="sm"
                        onClick={() => deleteNotification(notification.id)}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </TabsContent>

          <TabsContent value="likes">
            <div className="space-y-4">
              {notifications.filter(n => n.type === 'like').map((notification) => (
                <Card key={notification.id} className={`transition-all hover:shadow-md ${!notification.read ? 'ring-2 ring-food-200 bg-food-50' : ''}`}>
                  <CardContent className="p-6">
                    <div className="flex items-start gap-4">
                      <Avatar className="w-12 h-12">
                        <AvatarImage src={notification.avatar} />
                        <AvatarFallback>{notification.title[0]}</AvatarFallback>
                      </Avatar>
                      <div className="flex-1">
                        <h3 className="font-semibold text-gray-900">{notification.title}</h3>
                        <p className="text-gray-600 text-sm">{notification.message}</p>
                        <p className="text-gray-400 text-xs mt-1">{notification.time}</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="comments">
            <div className="space-y-4">
              {notifications.filter(n => n.type === 'comment').map((notification) => (
                <Card key={notification.id} className={`transition-all hover:shadow-md ${!notification.read ? 'ring-2 ring-food-200 bg-food-50' : ''}`}>
                  <CardContent className="p-6">
                    <div className="flex items-start gap-4">
                      <Avatar className="w-12 h-12">
                        <AvatarImage src={notification.avatar} />
                        <AvatarFallback>{notification.title[0]}</AvatarFallback>
                      </Avatar>
                      <div className="flex-1">
                        <h3 className="font-semibold text-gray-900">{notification.title}</h3>
                        <p className="text-gray-600 text-sm">{notification.message}</p>
                        <p className="text-gray-400 text-xs mt-1">{notification.time}</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>
        </Tabs>

        {/* Empty State */}
        {notifications.length === 0 && (
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
        )}
      </div>

      <Footer />
    </div>
  );
};

export default Notifications;
