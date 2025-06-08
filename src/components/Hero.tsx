
import { Button } from "@/components/ui/button";
import { Search, Sparkles, ChefHat, Clock, Zap, Users, Award } from "lucide-react";
import SearchBar from "./SearchBar";
import AnimatedCounter from "./AnimatedCounter";
import TrendingBadge from "./TrendingBadge";

const Hero = () => {
  return (
    <section className="relative overflow-hidden bg-gradient-to-br from-orange-50 via-red-50 to-yellow-50 py-20 px-4">
      {/* Enhanced Background Pattern */}
      <div className="absolute inset-0 opacity-20">
        <div className="absolute top-10 left-10 w-20 h-20 rounded-full bg-food-300 animate-float"></div>
        <div className="absolute top-32 right-20 w-16 h-16 rounded-full bg-spice-300 animate-float" style={{animationDelay: '1s'}}></div>
        <div className="absolute bottom-20 left-1/4 w-12 h-12 rounded-full bg-food-400 animate-float" style={{animationDelay: '2s'}}></div>
        <div className="absolute top-1/2 right-1/3 w-8 h-8 rounded-full bg-spice-400 animate-float" style={{animationDelay: '0.5s'}}></div>
        
        {/* New floating elements */}
        <div className="absolute top-1/4 left-1/2 w-6 h-6 rounded-full bg-yellow-400 animate-float" style={{animationDelay: '1.5s'}}></div>
        <div className="absolute bottom-1/3 right-1/4 w-10 h-10 rounded-full bg-pink-300 animate-float" style={{animationDelay: '2.5s'}}></div>
      </div>

      <div className="max-w-7xl mx-auto text-center relative z-10">
        <div className="animate-fadeIn">
          <div className="flex justify-center mb-6">
            <div className="bg-white/80 backdrop-blur-sm rounded-full p-3 shadow-lg hover:scale-110 transition-transform duration-300">
              <ChefHat className="h-12 w-12 text-food-600 animate-pulse" />
            </div>
          </div>

          {/* Trending Badge */}
          <div className="flex justify-center mb-4">
            <TrendingBadge type="hot" pulse />
          </div>

          <h1 className="text-4xl md:text-6xl font-bold text-gray-900 mb-6">
            <span className="text-gradient flex items-center justify-center gap-2 hover:scale-105 transition-transform duration-300">
              Evde ne var?
              <Sparkles className="h-8 w-8 md:h-12 md:w-12 text-yellow-500 animate-pulse" />
            </span><br />
            <span className="text-3xl md:text-5xl bg-gradient-to-r from-food-600 to-spice-600 bg-clip-text text-transparent">
              Yapay zeka söylesin!
            </span>
          </h1>
          
          <p className="text-xl text-gray-600 mb-8 max-w-3xl mx-auto leading-relaxed">
            Evdeki malzemelerinizi yazın, yapay zeka size en lezzetli tarifleri önersin. 
            <span className="font-semibold text-food-700 hover:text-food-800 transition-colors cursor-pointer">Ne Yesek AI</span> ile yemek yapmak hiç bu kadar kolay olmamıştı!
          </p>

          <div className="max-w-2xl mx-auto mb-8">
            <SearchBar />
          </div>

          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-8">
            <Button size="lg" className="gradient-primary text-white hover:opacity-90 transition-all duration-300 px-8 py-3 hover:scale-105 hover:shadow-xl group">
              <Search className="mr-2 h-5 w-5 group-hover:animate-pulse" />
              Tarif Bul
            </Button>
            <Button size="lg" variant="outline" className="border-food-300 text-food-700 hover:bg-food-50 px-8 py-3 hover:scale-105 transition-all duration-300 hover:shadow-lg group">
              <Clock className="mr-2 h-5 w-5 group-hover:animate-spin" />
              Bugün Ne Yesek?
            </Button>
          </div>

          {/* Enhanced Trust indicators */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm text-gray-600 mb-8">
            <div className="flex items-center justify-center gap-2 bg-white/50 backdrop-blur-sm rounded-lg p-3 hover:scale-105 transition-transform duration-300">
              <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
              <span>🤖 AI Destekli</span>
            </div>
            <div className="flex items-center justify-center gap-2 bg-white/50 backdrop-blur-sm rounded-lg p-3 hover:scale-105 transition-transform duration-300">
              <Zap className="h-4 w-4 text-yellow-500" />
              <span>⚡ Anında Sonuç</span>
            </div>
            <div className="flex items-center justify-center gap-2 bg-white/50 backdrop-blur-sm rounded-lg p-3 hover:scale-105 transition-transform duration-300">
              <Award className="h-4 w-4 text-purple-500" />
              <span>🥘 50K+ Tarif</span>
            </div>
            <div className="flex items-center justify-center gap-2 bg-white/50 backdrop-blur-sm rounded-lg p-3 hover:scale-105 transition-transform duration-300">
              <Users className="h-4 w-4 text-blue-500" />
              <span>👨‍👩‍👧‍👦 Aile Dostu</span>
            </div>
          </div>
        </div>

        {/* Enhanced Stats with Animated Counters */}
        <div className="grid grid-cols-3 gap-8 mt-16 pt-8 border-t border-orange-200/50">
          <div className="text-center group hover:scale-105 transition-transform duration-300 bg-white/30 backdrop-blur-sm rounded-lg p-4">
            <div className="text-3xl font-bold text-food-600 group-hover:text-food-700">
              <AnimatedCounter end={10000} suffix="+" />
            </div>
            <div className="text-gray-600">Tarif</div>
          </div>
          <div className="text-center group hover:scale-105 transition-transform duration-300 bg-white/30 backdrop-blur-sm rounded-lg p-4">
            <div className="text-3xl font-bold text-food-600 group-hover:text-food-700">
              <AnimatedCounter end={50000} suffix="+" />
            </div>
            <div className="text-gray-600">Kullanıcı</div>
          </div>
          <div className="text-center group hover:scale-105 transition-transform duration-300 bg-white/30 backdrop-blur-sm rounded-lg p-4">
            <div className="text-3xl font-bold text-food-600 group-hover:text-food-700 flex items-center justify-center gap-2">
              <Sparkles className="h-8 w-8 text-yellow-500 animate-pulse" />
              AI
            </div>
            <div className="text-gray-600">Destekli</div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;
