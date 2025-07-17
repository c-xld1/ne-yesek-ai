
import React from "react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Card, CardContent } from "@/components/ui/card";
import { Users, Target, Heart, Zap, Award, Sparkles } from "lucide-react";

const About = () => {
  const features = [
    {
      icon: <Zap className="h-8 w-8 text-orange-500" />,
      title: "AI Destekli Öneriler",
      description: "Evdeki malzemelerinize göre yapay zeka destekli tarif önerileri alın.",
      color: "from-orange-500 to-orange-600"
    },
    {
      icon: <Users className="h-8 w-8 text-blue-500" />,
      title: "Topluluk Odaklı",
      description: "Binlerce kullanıcının deneyimlediği ve onayladığı tarifler.",
      color: "from-blue-500 to-blue-600"
    },
    {
      icon: <Target className="h-8 w-8 text-green-500" />,
      title: "DBL Skoru",
      description: "Dakika başına lezzet algoritması ile en verimli tarifleri keşfedin.",
      color: "from-green-500 to-green-600"
    },
    {
      icon: <Heart className="h-8 w-8 text-pink-500" />,
      title: "Kolay Kullanım",
      description: "Sade tasarım ve kullanıcı dostu arayüz ile kolayca tarif bulun.",
      color: "from-pink-500 to-pink-600"
    }
  ];

  const team = [
    {
      name: "Ahmet Yılmaz",
      role: "Kurucu & CEO",
      image: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=face",
      description: "15 yıllık yazılım deneyimi ve yemek tutkusu",
      badge: "Kurucu"
    },
    {
      name: "Elif Kaya",
      role: "Baş Tasarımcı",
      image: "https://images.unsplash.com/photo-1494790108755-2616c4f23456?w=150&h=150&fit=crop&crop=face",
      description: "Kullanıcı deneyimi ve görsel tasarım uzmanı",
      badge: "Tasarımcı"
    },
    {
      name: "Mehmet Demir",
      role: "AI Uzmanı",
      image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop&crop=face",
      description: "Yapay zeka ve makine öğrenmesi geliştirici",
      badge: "AI Uzmanı"
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 via-white to-orange-50">
      <Navbar />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
        {/* Hero Bölümü - Modern Design */}
        <div className="text-center mb-20">
          <div className="mb-8">
            <span className="inline-block p-3 bg-gradient-to-r from-orange-500 to-orange-600 rounded-2xl text-white text-2xl mb-6">
              🍳
            </span>
          </div>
          <h1 className="text-5xl md:text-6xl font-bold mb-8">
            <span className="bg-gradient-to-r from-orange-600 to-orange-500 bg-clip-text text-transparent">
              Ne Yesek AI
            </span>
            <span className="text-gray-900"> Hakkında</span>
          </h1>
          <p className="text-xl text-gray-600 max-w-4xl mx-auto leading-relaxed font-medium">
            Yemek yapmayı kolaylaştıran, yapay zeka destekli tarif platformu.
            Evdeki malzemelerinizle en lezzetli tarifleri keşfedin!
          </p>
        </div>

        {/* Misyon - Modern Card */}
        <Card className="mb-20 border-0 shadow-xl bg-white/80 backdrop-blur-sm">
          <CardContent className="p-12">
            <div className="text-center mb-12">
              <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-r from-orange-500 to-orange-600 rounded-2xl mb-6">
                <Target className="h-8 w-8 text-white" />
              </div>
              <h2 className="text-4xl font-bold bg-gradient-to-r from-gray-900 to-gray-700 bg-clip-text text-transparent mb-4">
                Misyonumuz
              </h2>
            </div>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
              <div className="space-y-6">
                <p className="text-gray-700 text-lg leading-relaxed">
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
                <div className="bg-gradient-to-br from-orange-500 to-orange-600 rounded-3xl p-10 text-white shadow-xl">
                  <div className="text-7xl mb-6">🍳</div>
                  <h3 className="text-3xl font-bold mb-3">10K+</h3>
                  <p className="text-orange-100 text-lg font-medium">Mutlu Kullanıcı</p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Özellikler - Modern Grid */}
        <div className="mb-20">
          <div className="text-center mb-16">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-r from-blue-500 to-blue-600 rounded-2xl mb-6">
              <Sparkles className="h-8 w-8 text-white" />
            </div>
            <h2 className="text-4xl font-bold bg-gradient-to-r from-gray-900 to-gray-700 bg-clip-text text-transparent mb-6">
              Neden Ne Yesek AI?
            </h2>
            <p className="text-gray-600 text-lg max-w-3xl mx-auto leading-relaxed">
              Platformumuzun öne çıkan özellikleri ile yemek yapma deneyiminizi
              bir üst seviyeye taşıyın
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {features.map((feature, index) => (
              <Card key={index} className="group text-center hover:shadow-2xl transition-all duration-300 hover:-translate-y-2 border-0 bg-white/80 backdrop-blur-sm">
                <CardContent className="p-8">
                  <div className="mb-6 flex justify-center">
                    <div className={`p-4 rounded-2xl bg-gradient-to-r ${feature.color} shadow-lg group-hover:scale-110 transition-transform duration-300`}>
                      {React.cloneElement(feature.icon, { className: "h-8 w-8 text-white" })}
                    </div>
                  </div>
                  <h3 className="font-bold text-xl text-gray-900 mb-4">
                    {feature.title}
                  </h3>
                  <p className="text-gray-600 leading-relaxed">
                    {feature.description}
                  </p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {/* Ekip - Modern Design */}
        <div className="mb-20">
          <div className="text-center mb-16">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-r from-purple-500 to-purple-600 rounded-2xl mb-6">
              <Users className="h-8 w-8 text-white" />
            </div>
            <h2 className="text-4xl font-bold bg-gradient-to-r from-gray-900 to-gray-700 bg-clip-text text-transparent mb-6">
              Ekibimiz
            </h2>
            <p className="text-gray-600 text-lg max-w-3xl mx-auto leading-relaxed">
              Ne Yesek AI'ı hayata geçiren tutkulu ekibimizle tanışın
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
            {team.map((member, index) => (
              <Card key={index} className="group text-center hover:shadow-2xl transition-all duration-300 hover:-translate-y-2 border-0 bg-white/80 backdrop-blur-sm">
                <CardContent className="p-8">
                  <div className="relative mb-6">
                    <img
                      src={member.image}
                      alt={member.name}
                      className="w-28 h-28 rounded-2xl object-cover mx-auto shadow-lg group-hover:scale-105 transition-transform duration-300"
                    />
                    <div className="absolute -top-2 -right-2 bg-gradient-to-r from-orange-500 to-orange-600 text-white text-xs font-bold px-3 py-1 rounded-full shadow-lg">
                      {member.badge}
                    </div>
                  </div>
                  <h3 className="font-bold text-xl text-gray-900 mb-2">
                    {member.name}
                  </h3>
                  <p className="text-orange-600 font-semibold mb-4 text-lg">
                    {member.role}
                  </p>
                  <p className="text-gray-600 leading-relaxed">
                    {member.description}
                  </p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {/* İstatistikler - Modern Design */}
        <Card className="bg-gradient-to-r from-orange-500 to-orange-600 text-white border-0 shadow-2xl">
          <CardContent className="p-12">
            <div className="text-center mb-8">
              <h3 className="text-3xl font-bold text-white mb-2">Rakamlarla Ne Yesek AI</h3>
              <p className="text-orange-100 text-lg">Güvenilir ve sürekli büyüyen platformumuz</p>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
              <div className="group">
                <div className="text-4xl font-bold mb-3 group-hover:scale-110 transition-transform duration-300">10K+</div>
                <div className="text-orange-100 text-lg font-medium">Tarif</div>
              </div>
              <div className="group">
                <div className="text-4xl font-bold mb-3 group-hover:scale-110 transition-transform duration-300">50K+</div>
                <div className="text-orange-100 text-lg font-medium">Kullanıcı</div>
              </div>
              <div className="group">
                <div className="text-4xl font-bold mb-3 group-hover:scale-110 transition-transform duration-300">1M+</div>
                <div className="text-orange-100 text-lg font-medium">Tarif Görüntüleme</div>
              </div>
              <div className="group">
                <div className="text-4xl font-bold mb-3 group-hover:scale-110 transition-transform duration-300">95%</div>
                <div className="text-orange-100 text-lg font-medium">Kullanıcı Memnuniyeti</div>
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
