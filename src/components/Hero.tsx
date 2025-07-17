import { Button } from "@/components/ui/button";
import { Search, Sparkles, ChefHat, Clock, Zap, Users, Award, ArrowRight, Play } from "lucide-react";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import SearchBar from "./SearchBar";

const Hero = () => {
  const navigate = useNavigate();

  const floatingElements = [
    { emoji: "🍳", delay: 0, x: "10%", y: "20%" },
    { emoji: "🥘", delay: 1, x: "85%", y: "15%" },
    { emoji: "🍕", delay: 2, x: "20%", y: "70%" },
    { emoji: "🥗", delay: 0.5, x: "75%", y: "65%" },
    { emoji: "🍰", delay: 1.5, x: "50%", y: "10%" },
    { emoji: "🥖", delay: 2.5, x: "90%", y: "45%" },
  ];

  const stats = [
    { icon: ChefHat, count: "10K+", label: "Tarif", color: "from-orange-500 to-orange-600" },
    { icon: Users, count: "50K+", label: "Kullanıcı", color: "from-blue-500 to-blue-600" },
    { icon: Clock, count: "1M+", label: "Dakika", color: "from-green-500 to-green-600" },
    { icon: Award, count: "95%", label: "Memnuniyet", color: "from-purple-500 to-purple-600" },
  ];

  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden bg-gradient-to-br from-orange-50 via-white to-orange-50">
      {/* Modern Background Elements */}
      <div className="absolute inset-0 overflow-hidden">
        {/* Animated Gradient Orbs */}
        <motion.div
          className="absolute -top-20 -left-20 w-80 h-80 bg-gradient-to-br from-orange-400/20 to-orange-600/10 rounded-full blur-3xl"
          animate={{
            x: [0, 100, 0],
            y: [0, 50, 0],
            scale: [1, 1.2, 1]
          }}
          transition={{ duration: 20, repeat: Infinity, ease: "easeInOut" }}
        />

        <motion.div
          className="absolute -bottom-20 -right-20 w-96 h-96 bg-gradient-to-br from-blue-400/15 to-purple-600/10 rounded-full blur-3xl"
          animate={{
            x: [0, -80, 0],
            y: [0, -60, 0],
            scale: [1, 1.1, 1]
          }}
          transition={{ duration: 25, repeat: Infinity, ease: "easeInOut" }}
        />

        {/* Floating Food Elements */}
        {floatingElements.map((element, index) => (
          <motion.div
            key={index}
            className="absolute text-4xl opacity-20"
            style={{ left: element.x, top: element.y }}
            animate={{
              y: [-20, 20, -20],
              rotate: [-10, 10, -10],
              scale: [0.8, 1.2, 0.8]
            }}
            transition={{
              duration: 6 + element.delay,
              repeat: Infinity,
              ease: "easeInOut",
              delay: element.delay
            }}
          >
            {element.emoji}
          </motion.div>
        ))}
      </div>

      {/* Main Content */}
      <div className="relative z-10 max-w-7xl mx-auto px-4 text-center">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className="space-y-8"
        >
          {/* Main Heading */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.3 }}
            className="space-y-6"
          >
            <h1 className="text-5xl md:text-7xl lg:text-8xl font-bold leading-tight">
              <span className="bg-gradient-to-r from-orange-600 via-orange-500 to-orange-400 bg-clip-text text-transparent">
                Ne Yesek
              </span>
            </h1>

            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.8, delay: 0.5 }}
              className="text-xl md:text-2xl text-gray-600 max-w-3xl mx-auto font-medium leading-relaxed"
            >
              Evinizdeki malzemelerle yapay zeka destekli tarif önerileri alın.
              <span className="text-orange-600 font-semibold">Dakikalar içinde</span> lezzetli yemekler pişirin!
            </motion.p>
          </motion.div>

          {/* Search Bar */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.6 }}
          >
            <SearchBar
              placeholder="Bugün ne pişirelim? 🍳"
              onSearch={(query) => {
                const params = new URLSearchParams({ arama: query });
                navigate(`/tarifler?${params.toString()}`);
              }}
            />
          </motion.div>

          {/* Action Buttons */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.7 }}
            className="flex flex-col sm:flex-row gap-4 justify-center items-center"
          >
            <Button
              size="lg"
              className="bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 text-white px-8 py-4 rounded-2xl font-semibold text-lg shadow-lg hover:shadow-xl transition-all duration-300 group"
            >
              <ChefHat className="h-5 w-5 mr-2 group-hover:rotate-12 transition-transform" />
              Hemen Başla
              <ArrowRight className="h-5 w-5 ml-2 group-hover:translate-x-1 transition-transform" />
            </Button>

            <Button
              variant="outline"
              size="lg"
              className="border-2 border-orange-200 hover:border-orange-300 text-orange-600 hover:text-orange-700 px-8 py-4 rounded-2xl font-semibold text-lg bg-white/80 backdrop-blur-sm hover:bg-white transition-all duration-300 group"
            >
              <Play className="h-5 w-5 mr-2 group-hover:scale-110 transition-transform" />
              Demo İzle
            </Button>
          </motion.div>

        </motion.div>
      </div>
    </section>
  );
};

export default Hero;
