
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import SeasonalRecommendations from "@/components/SeasonalRecommendations";

const Seasonal = () => {
  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      
      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            🌿 Mevsimsel Tarifler
          </h1>
          <p className="text-gray-600 max-w-2xl mx-auto">
            Mevsimlerin en taze lezzetlerini keşfedin. Her mevsime özel, doğal ve sağlıklı tarifler.
          </p>
        </div>

        <SeasonalRecommendations />
      </div>

      <Footer />
    </div>
  );
};

export default Seasonal;
