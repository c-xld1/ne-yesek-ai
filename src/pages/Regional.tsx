
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import RegionalRecipeMap from "@/components/RegionalRecipeMap";

const Regional = () => {
  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      
      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            🗺️ Yöresel Lezzetler
          </h1>
          <p className="text-gray-600 max-w-2xl mx-auto">
            Türkiye'nin dört bir yanından özgün yöresel tarifler ve dünya mutfaklarından seçmeler.
          </p>
        </div>

        <RegionalRecipeMap />
      </div>

      <Footer />
    </div>
  );
};

export default Regional;
