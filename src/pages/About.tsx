
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Card, CardContent } from "@/components/ui/card";
import { Users, Target, Heart, Zap } from "lucide-react";

const About = () => {
  const features = [
    {
      icon: <Zap className="h-8 w-8 text-food-500" />,
      title: "AI Destekli Öneriler",
      description: "Evdeki malzemelerinize göre yapay zeka destekli tarif önerileri alın."
    },
    {
      icon: <Users className="h-8 w-8 text-food-500" />,
      title: "Topluluk Odaklı",
      description: "Binlerce kullanıcının deneyimlediği ve onayladığı tarifler."
    },
    {
      icon: <Target className="h-8 w-8 text-food-500" />,
      title: "DBL Skoru",
      description: "Dakika başına lezzet algoritması ile en verimli tarifleri keşfedin."
    },
    {
      icon: <Heart className="h-8 w-8 text-food-500" />,
      title: "Kolay Kullanım",
      description: "Sade tasarım ve kullanıcı dostu arayüz ile kolayca tarif bulun."
    }
  ];

  const team = [
    {
      name: "Ahmet Yılmaz",
      role: "Kurucu & CEO",
      image: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=face",
      description: "15 yıllık yazılım deneyimi ve yemek tutkusu"
    },
    {
      name: "Elif Kaya",
      role: "Baş Tasarımcı",
      image: "https://images.unsplash.com/photo-1494790108755-2616c4f23456?w=150&h=150&fit=crop&crop=face",
      description: "Kullanıcı deneyimi ve görsel tasarım uzmanı"
    },
    {
      name: "Mehmet Demir",
      role: "AI Uzmanı",
      image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop&crop=face",
      description: "Yapay zeka ve makine öğrenmesi geliştirici"
    }
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      
      <div className="max-w-6xl mx-auto px-4 py-8">
        {/* Hero Bölümü */}
        <div className="text-center mb-16">
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
            <span className="text-gradient">Ne Yesek AI</span> Hakkında
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
            Yemek yapmayı kolaylaştıran, yapay zeka destekli tarif platformu. 
            Evdeki malzemelerinizle en lezzetli tarifleri keşfedin!
          </p>
        </div>

        {/* Misyon */}
        <Card className="mb-16">
          <CardContent className="p-8">
            <div className="text-center mb-8">
              <h2 className="text-3xl font-bold text-gray-900 mb-4">Misyonumuz</h2>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
              <div>
                <p className="text-gray-700 text-lg leading-relaxed mb-4">
                  Ne Yesek AI, herkesin mutfakta kendini rahat hissetmesini ve 
                  evdeki basit malzemelerle lezzetli yemekler yapabilmesini sağlamayı amaçlar.
                </p>
                <p className="text-gray-700 text-lg leading-relaxed">
                  Yapay zeka teknolojisi ile kullanıcılarımıza kişiselleştirilmiş 
                  tarif önerileri sunarak, yemek yapma deneyimini daha keyifli 
                  ve verimli hale getiriyoruz.
                </p>
              </div>
              <div className="text-center">
                <div className="bg-gradient-to-br from-food-50 to-spice-50 rounded-2xl p-8">
                  <div className="text-6xl mb-4">🍳</div>
                  <h3 className="text-2xl font-bold text-gray-900 mb-2">10K+</h3>
                  <p className="text-gray-600">Mutlu Kullanıcı</p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Özellikler */}
        <div className="mb-16">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Neden Ne Yesek AI?</h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Platformumuzun öne çıkan özellikleri ile yemek yapma deneyiminizi 
              bir üst seviyeye taşıyın
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {features.map((feature, index) => (
              <Card key={index} className="text-center hover:shadow-lg transition-shadow">
                <CardContent className="p-6">
                  <div className="mb-4 flex justify-center">
                    {feature.icon}
                  </div>
                  <h3 className="font-semibold text-lg text-gray-900 mb-2">
                    {feature.title}
                  </h3>
                  <p className="text-gray-600 text-sm">
                    {feature.description}
                  </p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {/* Ekip */}
        <div className="mb-16">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Ekibimiz</h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Ne Yesek AI'ı hayata geçiren tutkulu ekibimizle tanışın
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {team.map((member, index) => (
              <Card key={index} className="text-center">
                <CardContent className="p-6">
                  <img
                    src={member.image}
                    alt={member.name}
                    className="w-24 h-24 rounded-full object-cover mx-auto mb-4 border-4 border-food-200"
                  />
                  <h3 className="font-semibold text-lg text-gray-900 mb-1">
                    {member.name}
                  </h3>
                  <p className="text-food-600 font-medium mb-3">
                    {member.role}
                  </p>
                  <p className="text-gray-600 text-sm">
                    {member.description}
                  </p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {/* İstatistikler */}
        <Card className="bg-gradient-to-r from-food-500 to-spice-500 text-white">
          <CardContent className="p-8">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
              <div>
                <div className="text-3xl font-bold mb-2">10K+</div>
                <div className="text-food-100">Tarif</div>
              </div>
              <div>
                <div className="text-3xl font-bold mb-2">50K+</div>
                <div className="text-food-100">Kullanıcı</div>
              </div>
              <div>
                <div className="text-3xl font-bold mb-2">1M+</div>
                <div className="text-food-100">Tarif Görüntüleme</div>
              </div>
              <div>
                <div className="text-3xl font-bold mb-2">95%</div>
                <div className="text-food-100">Kullanıcı Memnuniyeti</div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <Footer />
    </div>
  );
};

export default About;
