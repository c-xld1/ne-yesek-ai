
import { useState } from "react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import VideoStories from "@/components/VideoStories";
import AddVideoStory from "@/components/AddVideoStory";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { TrendingUp, Crown, Calendar, Eye, Heart, MessageCircle } from "lucide-react";

const VideoStoriesPage = () => {
  const [activeFilter, setActiveFilter] = useState("all");

  const filters = [
    { id: "all", label: "🔥 Tüm Hikâyeler", count: 156 },
    { id: "trending", label: "📈 Trend Olanlar", count: 24 },
    { id: "new", label: "✨ Yeni Eklenenler", count: 18 },
    { id: "most-liked", label: "❤️ En Beğenilenler", count: 12 },
    { id: "weekly", label: "👑 Haftanın En İyileri", count: 8 }
  ];

  const categories = [
    "Ana Yemek", "Tatlı", "Vegan", "15 Dakikada", "Kahvaltı", 
    "İçecek", "Fit Tarifler", "Hamur İşi"
  ];

  const featuredStories = [
    {
      id: "1",
      title: "5 Dakikada Çikolatalı Mug Cake",
      creator: "Tatlı Kraliçesi",
      avatar: "https://images.unsplash.com/photo-1494790108755-2616b612b47c?w=100&h=100&fit=crop",
      thumbnail: "https://images.unsplash.com/photo-1578985545062-69928b1d9587?w=300&h=400&fit=crop",
      views: "12.5K",
      likes: 1250,
      comments: 89,
      duration: "45s",
      category: "Tatlı",
      isWeeklyWinner: true
    },
    {
      id: "2",
      title: "60 Saniyede Mükemmel Omlet",
      creator: "Kahvaltı Ustası",
      avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop",
      thumbnail: "https://images.unsplash.com/photo-1525351484163-7529414344d8?w=300&h=400&fit=crop",
      views: "8.9K",
      likes: 890,
      comments: 67,
      duration: "1m",
      category: "Kahvaltı",
      isWeeklyWinner: false
    },
    {
      id: "3",
      title: "Vegan Smoothie Bowl Sanatı",
      creator: "Yeşil Yaşam",
      avatar: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=100&h=100&fit=crop",
      thumbnail: "https://images.unsplash.com/photo-1553530666-ba11a7da3888?w=300&h=400&fit=crop",
      views: "6.7K",
      likes: 670,
      comments: 45,
      duration: "2m",
      category: "Vegan",
      isWeeklyWinner: false
    }
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      
      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-4 flex items-center justify-center gap-3">
            🎬 Tarif Hikâyeleri
            <Badge className="bg-red-100 text-red-800">VİDEO</Badge>
          </h1>
          <p className="text-gray-600 max-w-2xl mx-auto">
            Kısa videolarla en hızlı tarif öğrenme deneyimi! TikTok, YouTube Shorts ve Instagram Reels formatında.
          </p>
        </div>

        {/* Quick Actions */}
        <div className="flex justify-center mb-8">
          <AddVideoStory />
        </div>

        {/* Video Stories Carousel */}
        <VideoStories />

        {/* Filters */}
        <div className="bg-white rounded-xl shadow-sm p-6 mb-8">
          <h3 className="text-lg font-semibold mb-4">📊 Hikâye Filtreleri</h3>
          <div className="flex flex-wrap gap-3">
            {filters.map((filter) => (
              <Button
                key={filter.id}
                variant={activeFilter === filter.id ? "default" : "outline"}
                size="sm"
                onClick={() => setActiveFilter(filter.id)}
                className={activeFilter === filter.id ? "gradient-primary text-white" : ""}
              >
                {filter.label} ({filter.count})
              </Button>
            ))}
          </div>
        </div>

        {/* Featured Stories Grid */}
        <div className="mb-8">
          <h3 className="text-2xl font-bold text-gray-900 mb-6 flex items-center gap-2">
            🏆 Bu Haftanın Kazananları
            <Crown className="h-6 w-6 text-yellow-500" />
          </h3>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {featuredStories.map((story) => (
              <Card key={story.id} className="overflow-hidden hover:shadow-lg transition-shadow cursor-pointer group">
                <div className="relative">
                  <img 
                    src={story.thumbnail} 
                    alt={story.title}
                    className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                  
                  {/* Duration Badge */}
                  <Badge className="absolute top-2 right-2 bg-black bg-opacity-70 text-white">
                    {story.duration}
                  </Badge>
                  
                  {/* Category Badge */}
                  <Badge className="absolute top-2 left-2 bg-food-500 text-white">
                    {story.category}
                  </Badge>
                  
                  {/* Weekly Winner Badge */}
                  {story.isWeeklyWinner && (
                    <Badge className="absolute bottom-2 left-2 bg-yellow-500 text-black flex items-center gap-1">
                      <Crown className="h-3 w-3" />
                      Haftanın Kazananı
                    </Badge>
                  )}
                  
                  {/* Play Overlay */}
                  <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-20 transition-all duration-300 flex items-center justify-center">
                    <div className="bg-white bg-opacity-90 rounded-full p-3 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                      <TrendingUp className="h-6 w-6 text-food-600" />
                    </div>
                  </div>
                </div>
                
                <CardContent className="p-4">
                  <h4 className="font-semibold text-gray-900 mb-2 line-clamp-2">
                    {story.title}
                  </h4>
                  
                  <div className="flex items-center gap-3 mb-3">
                    <Avatar className="w-8 h-8">
                      <AvatarImage src={story.avatar} />
                      <AvatarFallback>{story.creator[0]}</AvatarFallback>
                    </Avatar>
                    <div>
                      <p className="text-sm font-medium text-gray-700">{story.creator}</p>
                    </div>
                  </div>
                  
                  <div className="flex items-center justify-between text-sm text-gray-500">
                    <div className="flex items-center gap-3">
                      <span className="flex items-center gap-1">
                        <Eye className="h-4 w-4" />
                        {story.views}
                      </span>
                      <span className="flex items-center gap-1">
                        <Heart className="h-4 w-4" />
                        {story.likes}
                      </span>
                      <span className="flex items-center gap-1">
                        <MessageCircle className="h-4 w-4" />
                        {story.comments}
                      </span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {/* Categories */}
        <div className="bg-white rounded-xl shadow-sm p-6 mb-8">
          <h3 className="text-lg font-semibold mb-4">🗂️ Kategoriler</h3>
          <div className="flex flex-wrap gap-2">
            {categories.map((category) => (
              <Badge 
                key={category}
                variant="outline"
                className="cursor-pointer hover:bg-food-50 hover:border-food-300"
              >
                {category}
              </Badge>
            ))}
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <Card className="text-center p-6">
            <div className="text-3xl font-bold text-food-600 mb-2">156</div>
            <div className="text-gray-600">Toplam Hikâye</div>
          </Card>
          <Card className="text-center p-6">
            <div className="text-3xl font-bold text-spice-600 mb-2">45K</div>
            <div className="text-gray-600">Toplam İzlenme</div>
          </Card>
          <Card className="text-center p-6">
            <div className="text-3xl font-bold text-green-600 mb-2">1.2K</div>
            <div className="text-gray-600">Bu Hafta Eklenen</div>
          </Card>
          <Card className="text-center p-6">
            <div className="text-3xl font-bold text-purple-600 mb-2">89</div>
            <div className="text-gray-600">Aktif Yaratıcı</div>
          </Card>
        </div>

        {/* Weekly Competition */}
        <Card className="bg-gradient-to-r from-yellow-50 to-orange-50 border-yellow-200 mb-8">
          <CardContent className="p-6 text-center">
            <h3 className="text-2xl font-bold text-gray-900 mb-4 flex items-center justify-center gap-2">
              🏆 Bu Haftanın Yarışması
              <Badge className="bg-yellow-500 text-black">DEVAM EDİYOR</Badge>
            </h3>
            <p className="text-gray-700 mb-4">
              "En Yaratıcı 15 Dakikalık Tarif" temalı yarışmamız devam ediyor!
            </p>
            <div className="flex items-center justify-center gap-4 text-sm text-gray-600">
              <span className="flex items-center gap-1">
                <Calendar className="h-4 w-4" />
                Bitiş: 3 gün kaldı
              </span>
              <span>•</span>
              <span>Katılımcı: 45 kişi</span>
              <span>•</span>
              <span>Ödül: 1000 TL + Özel Rozet</span>
            </div>
          </CardContent>
        </Card>
      </div>

      <Footer />
    </div>
  );
};

export default VideoStoriesPage;
