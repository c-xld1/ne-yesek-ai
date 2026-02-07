import { Button } from "@/components/ui/button";
import { ChefHat, ArrowRight, Play, Sparkles } from "lucide-react";
import { motion } from "framer-motion";
import { useNavigate, Link } from "react-router-dom";
import SearchBar from "./SearchBar";

const Hero = () => {
  const navigate = useNavigate();

  const floatingElements = [
    { emoji: "🍳", delay: 0, x: "10%", y: "20%" },
    { emoji: "🥘", delay: 1, x: "85%", y: "15%" },
    { emoji: "🍕", delay: 2, x: "15%", y: "75%" },
    { emoji: "🥗", delay: 0.5, x: "80%", y: "70%" },
    { emoji: "🍰", delay: 1.5, x: "50%", y: "8%" },
  ];

  return (
    <section className="relative min-h-[90vh] md:min-h-screen flex items-center justify-center overflow-hidden gradient-secondary">
      {/* Modern Background Elements */}
      <div className="absolute inset-0 overflow-hidden">
        {/* Animated Gradient Orbs */}
        <motion.div
          className="absolute -top-20 -left-20 w-72 md:w-96 h-72 md:h-96 bg-gradient-to-br from-primary/15 to-orange-600/10 rounded-full blur-3xl"
          animate={{
            x: [0, 80, 0],
            y: [0, 40, 0],
            scale: [1, 1.15, 1]
          }}
          transition={{ duration: 20, repeat: Infinity, ease: "easeInOut" }}
        />

        <motion.div
          className="absolute -bottom-20 -right-20 w-80 md:w-[500px] h-80 md:h-[500px] bg-gradient-to-br from-blue-400/10 to-purple-600/5 rounded-full blur-3xl"
          animate={{
            x: [0, -60, 0],
            y: [0, -50, 0],
            scale: [1, 1.1, 1]
          }}
          transition={{ duration: 25, repeat: Infinity, ease: "easeInOut" }}
        />

        {/* Floating Food Elements */}
        {floatingElements.map((element, index) => (
          <motion.div
            key={index}
            className="absolute text-3xl md:text-5xl opacity-10 hidden md:block"
            style={{ left: element.x, top: element.y }}
            animate={{
              y: [-15, 15, -15],
              rotate: [-8, 8, -8],
              scale: [0.9, 1.1, 0.9]
            }}
            transition={{
              duration: 5 + element.delay,
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
      <div className="relative z-10 max-w-5xl mx-auto px-4 text-center pt-8 md:pt-0">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className="space-y-6 md:space-y-8"
        >
          {/* Badge */}
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="inline-flex items-center gap-2 bg-primary/10 text-primary px-4 py-2 rounded-full text-sm font-medium"
          >
            <Sparkles className="h-4 w-4" />
            Yapay Zeka Destekli
          </motion.div>

          {/* Main Heading - Visible immediately for LCP */}
          <div className="space-y-4">
            <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold leading-tight text-foreground">
              <span className="text-gradient">Ne Yesek</span>
              <span className="text-foreground">?</span>
            </h1>

            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.8, delay: 0.3 }}
              className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto font-medium leading-relaxed px-4"
            >
              Evinizdeki malzemelerle yapay zeka destekli tarif önerileri alın.
              <span className="text-primary font-semibold"> Dakikalar içinde</span> lezzetli yemekler pişirin!
            </motion.p>
          </div>

          {/* Search Bar */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.6 }}
            className="px-4"
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
            className="flex flex-col sm:flex-row gap-3 justify-center items-center px-4"
          >
            <Link to="/tarifler">
              <Button
                size="lg"
                className="w-full sm:w-auto gradient-primary text-primary-foreground px-8 py-6 rounded-2xl font-semibold text-base shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-0.5 group"
              >
                <ChefHat className="h-5 w-5 mr-2 group-hover:rotate-12 transition-transform" />
                Tarifleri Keşfet
                <ArrowRight className="h-5 w-5 ml-2 group-hover:translate-x-1 transition-transform" />
              </Button>
            </Link>

            <Link to="/neyesem">
              <Button
                variant="outline"
                size="lg"
                className="w-full sm:w-auto border-2 border-primary/30 hover:border-primary/50 text-primary hover:text-primary px-8 py-6 rounded-2xl font-semibold text-base bg-background/80 backdrop-blur-sm hover:bg-background transition-all duration-300 group"
              >
                <Play className="h-5 w-5 mr-2 group-hover:scale-110 transition-transform" />
                Ne Yesem?
              </Button>
            </Link>
          </motion.div>

        </motion.div>
      </div>
    </section>
  );
};

export default Hero;
