
import { Button } from "@/components/ui/button";
import { Search } from "lucide-react";
import SearchBar from "./SearchBar";

const Hero = () => {
  return (
    <section className="relative overflow-hidden bg-gradient-to-br from-orange-50 via-red-50 to-yellow-50 py-20 px-4">
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-20">
        <div className="absolute top-10 left-10 w-20 h-20 rounded-full bg-food-300 animate-float"></div>
        <div className="absolute top-32 right-20 w-16 h-16 rounded-full bg-spice-300 animate-float" style={{animationDelay: '1s'}}></div>
        <div className="absolute bottom-20 left-1/4 w-12 h-12 rounded-full bg-food-400 animate-float" style={{animationDelay: '2s'}}></div>
      </div>

      <div className="max-w-7xl mx-auto text-center relative z-10">
        <div className="animate-fadeIn">
          <h1 className="text-4xl md:text-6xl font-bold text-gray-900 mb-6">
            <span className="text-gradient">Evde ne var?</span><br />
            <span className="text-3xl md:text-5xl">Yapay zeka söylesin!</span>
          </h1>
          
          <p className="text-xl text-gray-600 mb-8 max-w-3xl mx-auto">
            Evdeki malzemelerinizi yazın, yapay zeka size en lezzetli tarifleri önersin. 
            Ne Yesek AI ile yemek yapmak hiç bu kadar kolay olmamıştı!
          </p>

          <div className="max-w-2xl mx-auto mb-8">
            <SearchBar />
          </div>

          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <Button size="lg" className="gradient-primary text-white hover:opacity-90 transition-opacity px-8 py-3">
              <Search className="mr-2 h-5 w-5" />
              Tarif Bul
            </Button>
            <Button size="lg" variant="outline" className="border-food-300 text-food-700 hover:bg-food-50 px-8 py-3">
              Bugün Ne Yesek?
            </Button>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-3 gap-8 mt-16 pt-8 border-t border-orange-200/50">
          <div className="text-center">
            <div className="text-3xl font-bold text-food-600">10K+</div>
            <div className="text-gray-600">Tarif</div>
          </div>
          <div className="text-center">
            <div className="text-3xl font-bold text-food-600">50K+</div>
            <div className="text-gray-600">Kullanıcı</div>
          </div>
          <div className="text-center">
            <div className="text-3xl font-bold text-food-600">AI</div>
            <div className="text-gray-600">Destekli</div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;
