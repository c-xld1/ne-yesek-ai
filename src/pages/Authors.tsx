
import { useState } from "react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Search, Filter, Users, ChefHat, Award, Heart, BookOpen, TrendingUp } from "lucide-react";

const Authors = () => {
  const [selectedCategory, setSelectedCategory] = useState("Tümü");
  const [sortBy, setSortBy] = useState("popular");

  const categories = [
    "Tümü", "Profesyonel Şefler", "Ev Aşçıları", "Beslenme Uzmanları", 
    "Pasta Şefleri", "Dünya Mutfakları", "Vegan Uzmanları", "Yeni Üyeler"
  ];

  const authors = [
    {
      id: 1,
      name: "Chef Mehmet Özkan",
      username: "@chef_mehmet",
      avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop",
      title: "Profesyonel Şef & Mutfak Danışmanı",
      specialties: ["Türk Mutfağı", "Et Yemekleri", "Çorbalar"],
      followers: 12450,
      recipes: 89,
      totalLikes: 8924,
      rating: 4.9,
      verified: true,
      level: "Usta Şef",
      description: "25 yıllık deneyimle geleneksel Türk mutfağının inceliklerini paylaşıyorum.",
      achievements: ["En Çok Beğenilen", "Aylık Şef", "Tarif Uzmanı"]
    },
    {
      id: 2,
      name: "Ayşe Demir",
      username: "@ayse_mutfak",
      avatar: "https://images.unsplash.com/photo-1494790108755-2616c4f23456?w=150&h=150&fit=crop",
      title: "Ev Yemekleri Uzmanı",
      specialties: ["Ev Yemekleri", "Tatlılar", "Kahvaltılık"],
      followers: 8760,
      recipes: 156,
      totalLikes: 15230,
      rating: 4.8,
      verified: false,
      level: "Ev Aşçısı",
      description: "Pratik ve lezzetli ev yemeklerini sizlerle paylaşmaktan mutluluk duyuyorum.",
      achievements: ["Haftanın Tarifi", "Trend Yaratıcı"]
    },
    {
      id: 3,
      name: "Dr. Zeynep Yılmaz",
      username: "@dr_zeynep",
      avatar: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=150&h=150&fit=crop",
      title: "Beslenme Uzmanı",
      specialties: ["Sağlıklı Beslenme", "Diyet Tarifleri", "Fit Tarifler"],
      followers: 15200,
      recipes: 67,
      totalLikes: 9876,
      rating: 4.9,
      verified: true,
      level: "Beslenme Uzmanı",
      description: "Sağlıklı yaşam için beslenme önerilerim ve fit tarifleriyle yanınızdayım.",
      achievements: ["Uzman Onayı", "Sağlık Lideri", "En Yararlı"]
    }
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      
      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            👨‍🍳 Yazarlarımız
          </h1>
          <p className="text-gray-600 max-w-2xl mx-auto">
            Deneyimli şeflerden ev aşçılarına, beslenme uzmanlarından pasta şeflerine kadar 
            geniş yazar kadromuzla tanışın
          </p>
        </div>

        {/* Search and Filters */}
        <div className="bg-white rounded-xl shadow-sm p-6 mb-8">
          <div className="flex flex-col lg:flex-row gap-4 items-center justify-between mb-6">
            <div className="flex-1 max-w-md">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                <input
                  type="text"
                  placeholder="Yazar ara..."
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-food-500 focus:border-transparent"
                />
              </div>
            </div>
            <div className="flex items-center gap-4">
              <select 
                value={sortBy} 
                onChange={(e) => setSortBy(e.target.value)}
                className="border border-gray-300 rounded-lg px-3 py-2 text-sm"
              >
                <option value="popular">En Popüler</option>
                <option value="followers">En Çok Takipçi</option>
                <option value="recipes">En Çok Tarif</option>
                <option value="rating">En Yüksek Puan</option>
                <option value="newest">En Yeni</option>
              </select>
              <Button className="gradient-primary text-white">
                <Users className="h-4 w-4 mr-2" />
                Yazar Ol
              </Button>
            </div>
          </div>

          <div className="flex flex-wrap gap-2">
            {categories.map((category) => (
              <Button
                key={category}
                variant={selectedCategory === category ? "default" : "outline"}
                size="sm"
                onClick={() => setSelectedCategory(category)}
                className={selectedCategory === category ? "gradient-primary text-white" : ""}
              >
                {category}
              </Button>
            ))}
          </div>
        </div>

        {/* Authors Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {authors.map((author) => (
            <Card key={author.id} className="overflow-hidden hover:shadow-xl transition-all duration-300 hover:-translate-y-1">
              <CardContent className="p-0">
                {/* Header with gradient background */}
                <div className="bg-gradient-to-r from-food-500 to-food-600 p-6 text-white">
                  <div className="flex items-center gap-4">
                    <Avatar className="w-16 h-16 border-2 border-white">
                      <AvatarImage src={author.avatar} />
                      <AvatarFallback>{author.name[0]}</AvatarFallback>
                    </Avatar>
                    <div className="flex-1">
                      <div className="flex items-center gap-2">
                        <h3 className="text-xl font-bold">{author.name}</h3>
                        {author.verified && (
                          <Award className="h-5 w-5 text-yellow-300" />
                        )}
                      </div>
                      <p className="text-food-100 text-sm">{author.username}</p>
                      <Badge className="bg-white/20 text-white border-white/30 mt-1">
                        {author.level}
                      </Badge>
                    </div>
                  </div>
                </div>

                {/* Content */}
                <div className="p-6">
                  <p className="text-gray-600 font-medium mb-2">{author.title}</p>
                  <p className="text-gray-700 text-sm mb-4">{author.description}</p>

                  {/* Specialties */}
                  <div className="mb-4">
                    <p className="text-sm font-medium text-gray-900 mb-2">Uzmanlık Alanları:</p>
                    <div className="flex flex-wrap gap-1">
                      {author.specialties.map((specialty, index) => (
                        <Badge key={index} variant="secondary" className="text-xs">
                          {specialty}
                        </Badge>
                      ))}
                    </div>
                  </div>

                  {/* Stats */}
                  <div className="grid grid-cols-3 gap-4 mb-4">
                    <div className="text-center">
                      <div className="text-lg font-bold text-gray-900">{author.followers.toLocaleString()}</div>
                      <div className="text-xs text-gray-600">Takipçi</div>
                    </div>
                    <div className="text-center">
                      <div className="text-lg font-bold text-gray-900">{author.recipes}</div>
                      <div className="text-xs text-gray-600">Tarif</div>
                    </div>
                    <div className="text-center">
                      <div className="text-lg font-bold text-gray-900">{author.totalLikes.toLocaleString()}</div>
                      <div className="text-xs text-gray-600">Beğeni</div>
                    </div>
                  </div>

                  {/* Rating */}
                  <div className="flex items-center gap-2 mb-4">
                    <div className="flex text-yellow-400">
                      {[...Array(5)].map((_, i) => (
                        <svg key={i} className="w-4 h-4 fill-current" viewBox="0 0 20 20">
                          <path d="M10 15l-5.878 3.09 1.123-6.545L.489 6.91l6.572-.955L10 0l2.939 5.955 6.572.955-4.756 4.635 1.123 6.545z"/>
                        </svg>
                      ))}
                    </div>
                    <span className="text-sm font-medium text-gray-900">{author.rating}</span>
                  </div>

                  {/* Achievements */}
                  <div className="mb-4">
                    <p className="text-sm font-medium text-gray-900 mb-2">Başarılar:</p>
                    <div className="flex flex-wrap gap-1">
                      {author.achievements.map((achievement, index) => (
                        <Badge key={index} className="bg-yellow-100 text-yellow-800 text-xs">
                          🏆 {achievement}
                        </Badge>
                      ))}
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="flex gap-2">
                    <Button className="flex-1 gradient-primary text-white">
                      Takip Et
                    </Button>
                    <Button variant="outline" size="sm">
                      Profil
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Load More */}
        <div className="text-center mt-12">
          <Button variant="outline" size="lg">
            Daha Fazla Yazar
          </Button>
        </div>

        {/* Become Author Section */}
        <Card className="mt-12 bg-gradient-to-r from-food-50 to-orange-50 border-food-200">
          <CardContent className="p-8 text-center">
            <ChefHat className="h-16 w-16 text-food-500 mx-auto mb-4" />
            <h2 className="text-2xl font-bold text-gray-900 mb-4">
              Siz de Yazar Olmak İster misiniz?
            </h2>
            <p className="text-gray-600 max-w-2xl mx-auto mb-6">
              Mutfak deneyimlerinizi binlerce kişiyle paylaşın, takipçi kazanın ve 
              tariflerinizden gelir elde edin. Platformumuzda içerik üreticisi olarak 
              kazanç elde edebilir, kendi mutfak topluluğunuzu oluşturabilirsiniz.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button className="gradient-primary text-white" size="lg">
                <Users className="h-5 w-5 mr-2" />
                Yazar Başvurusu Yap
              </Button>
              <Button variant="outline" size="lg">
                Daha Fazla Bilgi
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>

      <Footer />
    </div>
  );
};

export default Authors;
