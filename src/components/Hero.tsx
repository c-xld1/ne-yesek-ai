
import { Button } from "@/components/ui/button";
import { Search, Sparkles, ChefHat, Clock } from "lucide-react";
import SearchBar from "./SearchBar";

const Hero = () => {
  return (
    <section className="relative overflow-hidden bg-gradient-to-br from-orange-50 via-red-50 to-yellow-50 py-20 px-4">
      {/* Enhanced Background Pattern */}
      <div className="absolute inset-0 opacity-20">
        <div className="absolute top-10 left-10 w-20 h-20 rounded-full bg-food-300 animate-float"></div>
        <div className="absolute top-32 right-20 w-16 h-16 rounded-full bg-spice-300 animate-float" style={{animationDelay: '1s'}}></div>
        <div className="absolute bottom-20 left-1/4 w-12 h-12 rounded-full bg-food-400 animate-float" style={{animationDelay: '2s'}}></div>
        <div className="absolute top-1/2 right-1/3 w-8 h-8 rounded-full bg-spice-400 animate-float" style={{animationDelay: '0.5s'}}></div>
      </div>

      <div className="max-w-7xl mx-auto text-center relative z-10">
        <div className="animate-fadeIn">
          <div className="flex justify-center mb-6">
            <div className="bg-white/80 backdrop-blur-sm rounded-full p-3 shadow-lg">
              <ChefHat className="h-12 w-12 text-food-600" />
            </div>
          </div>

          <h1 className="text-4xl md:text-6xl font-bold text-gray-900 mb-6">
            <span className="text-gradient flex items-center justify-center gap-2">
              Evde ne var?
              <Sparkles className="h-8 w-8 md:h-12 md:w-12 text-yellow-500 animate-pulse" />
            </span><br />
            <span className="text-3xl md:text-5xl">Yapay zeka söylesin!</span>
          </h1>
          
          <p className="text-xl text-gray-600 mb-8 max-w-3xl mx-auto leading-relaxed">
            Evdeki malzemelerinizi yazın, yapay zeka size en lezzetli tarifleri önersin. 
            <span className="font-semibold text-food-700">Ne Yesek AI</span> ile yemek yapmak hiç bu kadar kolay olmamıştı!
          </p>

          <div className="max-w-2xl mx-auto mb-8">
            <SearchBar />
          </div>

          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-8">
            <Button size="lg" className="gradient-primary text-white hover:opacity-90 transition-all duration-300 px-8 py-3 hover:scale-105">
              <Search className="mr-2 h-5 w-5" />
              Tarif Bul
            </Button>
            <Button size="lg" variant="outline" className="border-food-300 text-food-700 hover:bg-food-50 px-8 py-3 hover:scale-105 transition-all duration-300">
              <Clock className="mr-2 h-5 w-5" />
              Bugün Ne Yesek?
            </Button>
          </div>

          {/* Trust indicators */}
          <div className="flex flex-wrap justify-center gap-6 text-sm text-gray-600 mb-8">
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
              <span>🤖 AI Destekli</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 bg-blue-500 rounded-full animate-pulse"></div>
              <span>⚡ Anında Sonuç</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 bg-purple-500 rounded-full animate-pulse"></div>
              <span>🥘 50K+ Tarif</span>
            </div>
          </div>
        </div>

        {/* Enhanced Stats */}
        <div className="grid grid-cols-3 gap-8 mt-16 pt-8 border-t border-orange-200/50">
          <div className="text-center group hover:scale-105 transition-transform duration-300">
            <div className="text-3xl font-bold text-food-600 group-hover:text-food-700">10K+</div>
            <div className="text-gray-600">Tarif</div>
          </div>
          <div className="text-center group hover:scale-105 transition-transform duration-300">
            <div className="text-3xl font-bold text-food-600 group-hover:text-food-700">50K+</div>
            <div className="text-gray-600">Kullanıcı</div>
          </div>
          <div className="text-center group hover:scale-105 transition-transform duration-300">
            <div className="text-3xl font-bold text-food-600 group-hover:text-food-700">AI</div>
            <div className="text-gray-600">Destekli</div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;
