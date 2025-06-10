
import { useState } from "react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Search, Plus, MessageCircle, ThumbsUp, ThumbsDown, User, Clock, Award } from "lucide-react";

const QnA = () => {
  const [selectedCategory, setSelectedCategory] = useState("Tümü");
  const [sortBy, setSortBy] = useState("newest");

  const categories = [
    "Tümü", "Pişirme Teknikleri", "Malzeme Soruları", "Ekipman", 
    "Beslenme", "Başlangıç Soruları", "Sorun Giderme", "Tarif İstekleri"
  ];

  const questions = [
    {
      id: 1,
      title: "Kek yapışıyor, nasıl çözerim?",
      content: "Her kek yaptığımda kalıba yapışıyor ve güzel çıkmıyor. Ne yapabilirim?",
      author: {
        name: "Ayşe K.",
        avatar: "https://images.unsplash.com/photo-1494790108755-2616c4f23456?w=50&h=50&fit=crop",
        reputation: 156
      },
      category: "Sorun Giderme",
      answers: 8,
      likes: 23,
      views: 340,
      date: "2 saat önce",
      solved: true,
      bestAnswer: {
        content: "Kalıbı tereyağıyla iyice yağlayın, sonra un serpin. Ayrıca pişirme kağıdı kullanmayı deneyin.",
        author: "Chef Mehmet",
        likes: 45
      }
    },
    {
      id: 2,
      title: "Mercimek çorbası tuzsuz çıktı, nasıl düzeltebilirim?",
      content: "Çorbayı pişirdim ama çok tuzsuz oldu. Sonradan tuz ekliyorum ama tadı güzel olmuyor.",
      author: {
        name: "Zeynep M.",
        avatar: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=50&h=50&fit=crop",
        reputation: 89
      },
      category: "Pişirme Teknikleri",
      answers: 5,
      likes: 18,
      views: 267,
      date: "4 saat önce",
      solved: false
    },
    {
      id: 3,
      title: "Hangi yağ daha sağlıklı?",
      content: "Zeytinyağı mı, ayçiçek yağı mı yoksa tereyağı mı daha sağlıklı? Hangi yemekte hangisini kullanmalıyım?",
      author: {
        name: "Fatma Y.",
        avatar: "https://images.unsplash.com/photo-1544725176-7c40e5a71c5e?w=50&h=50&fit=crop",
        reputation: 234
      },
      category: "Beslenme",
      answers: 12,
      likes: 56,
      views: 789,
      date: "1 gün önce",
      solved: true,
      bestAnswer: {
        content: "Zeytinyağı soğuk yemeklerde, ayçiçek yağı kızartmalarda, tereyağı ise hamur işlerinde tercih edilmeli.",
        author: "Beslenme Uzmanı",
        likes: 78
      }
    }
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      
      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            ❓ Soru & Cevap
          </h1>
          <p className="text-gray-600 max-w-2xl mx-auto">
            Mutfakla ilgili sorularınızı sorun, deneyimli yemek severlerden cevap alın
          </p>
        </div>

        {/* Search and Ask Question */}
        <div className="bg-white rounded-xl shadow-sm p-6 mb-8">
          <div className="flex flex-col lg:flex-row gap-4 items-center justify-between mb-6">
            <div className="flex-1 max-w-md">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                <input
                  type="text"
                  placeholder="Sorularda ara..."
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-food-500 focus:border-transparent"
                />
              </div>
            </div>
            <Button className="gradient-primary text-white">
              <Plus className="h-4 w-4 mr-2" />
              Soru Sor
            </Button>
          </div>

          <div className="flex flex-col lg:flex-row gap-4 items-center justify-between">
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
            
            <div className="flex items-center gap-2">
              <span className="text-sm text-gray-600">Sırala:</span>
              <select 
                value={sortBy} 
                onChange={(e) => setSortBy(e.target.value)}
                className="border border-gray-300 rounded-lg px-3 py-2 text-sm"
              >
                <option value="newest">En Yeni</option>
                <option value="popular">En Popüler</option>
                <option value="unanswered">Cevaplanmamış</option>
                <option value="solved">Çözülmüş</option>
              </select>
            </div>
          </div>
        </div>

        {/* Questions List */}
        <div className="space-y-6">
          {questions.map((question) => (
            <Card key={question.id} className="hover:shadow-lg transition-shadow">
              <CardContent className="p-6">
                <div className="flex items-start gap-4">
                  <Avatar className="w-12 h-12">
                    <AvatarImage src={question.author.avatar} />
                    <AvatarFallback>{question.author.name[0]}</AvatarFallback>
                  </Avatar>
                  
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      <h3 className="text-xl font-semibold text-gray-900 hover:text-food-600 cursor-pointer">
                        {question.title}
                      </h3>
                      {question.solved && (
                        <Badge className="bg-green-100 text-green-800">
                          <Award className="h-3 w-3 mr-1" />
                          Çözüldü
                        </Badge>
                      )}
                      <Badge className="bg-food-100 text-food-800">
                        {question.category}
                      </Badge>
                    </div>
                    
                    <p className="text-gray-600 mb-4">{question.content}</p>
                    
                    <div className="flex items-center gap-6 text-sm text-gray-500 mb-4">
                      <div className="flex items-center gap-1">
                        <User className="h-4 w-4" />
                        <span className="font-medium">{question.author.name}</span>
                        <span className="text-food-600">({question.author.reputation} puan)</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <Clock className="h-4 w-4" />
                        {question.date}
                      </div>
                      <div className="flex items-center gap-1">
                        <MessageCircle className="h-4 w-4" />
                        {question.answers} cevap
                      </div>
                      <div className="flex items-center gap-1">
                        <ThumbsUp className="h-4 w-4" />
                        {question.likes}
                      </div>
                      <span>{question.views} görüntülenme</span>
                    </div>

                    {question.bestAnswer && (
                      <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                        <div className="flex items-center gap-2 mb-2">
                          <Award className="h-4 w-4 text-green-600" />
                          <span className="text-sm font-medium text-green-800">En İyi Cevap</span>
                        </div>
                        <p className="text-gray-700 text-sm mb-2">{question.bestAnswer.content}</p>
                        <div className="flex items-center gap-2 text-xs text-gray-500">
                          <span>{question.bestAnswer.author}</span>
                          <span>•</span>
                          <span className="flex items-center gap-1">
                            <ThumbsUp className="h-3 w-3" />
                            {question.bestAnswer.likes}
                          </span>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        <div className="text-center mt-12">
          <Button variant="outline" size="lg">
            Daha Fazla Soru Yükle
          </Button>
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default QnA;
