import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import ChefsList from "@/components/ChefsList";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Search, ChefHat, Filter } from "lucide-react";

interface Chef {
  id: string;
  business_name: string;
  bio?: string;
  city: string;
  average_rating: number;
  total_reviews: number;
  badges?: string[];
  specialty?: string[];
  average_prep_time?: number;
  minimum_order_amount?: number;
  is_accepting_orders?: boolean;
  order_count?: number;
  profiles?: {
    username: string;
    avatar_url?: string;
  };
}

const Chefs = () => {
  const navigate = useNavigate();
  const [chefs, setChefs] = useState<Chef[]>([]);
  const [filteredChefs, setFilteredChefs] = useState<Chef[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    fetchChefs();
  }, []);

  useEffect(() => {
    filterChefs();
  }, [searchQuery, chefs]);

  const fetchChefs = async () => {
    try {
      const { data: chefsData } = await supabase
        .from("chef_profiles")
        .select("*")
        .eq("is_active", true)
        .order("rating", { ascending: false });

      if (chefsData) {
        const formattedChefs = chefsData.map((chef: any) => ({
          id: chef.id,
          business_name: chef.business_name,
          bio: chef.description,
          city: chef.city || "Bilinmiyor",
          average_rating: chef.rating || 0,
          total_reviews: chef.total_orders || 0,
        }));
        setChefs(formattedChefs);
        setFilteredChefs(formattedChefs);
      }
    } catch (error) {
      console.error("Error:", error);
    } finally {
      setLoading(false);
    }
  };

  const filterChefs = () => {
    if (!searchQuery) {
      setFilteredChefs(chefs);
      return;
    }

    const filtered = chefs.filter(
      (chef) =>
        chef.business_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        chef.city?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        chef.bio?.toLowerCase().includes(searchQuery.toLowerCase())
    );
    setFilteredChefs(filtered);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-white">
        <Navbar />
        <div className="container mx-auto px-4 py-20 text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-4 border-orange-500 mx-auto"></div>
          <p className="mt-4 text-gray-600 text-lg font-medium">Şefler yükleniyor...</p>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white">
      <Navbar />

      <div className="container mx-auto px-4 py-6 md:py-8 pb-24 md:pb-8">
        {/* Header */}
        <div className="mb-6 md:mb-8">
          <div className="flex items-center gap-3 mb-3 md:mb-4">
            <ChefHat className="h-6 w-6 md:h-8 md:w-8 text-orange-500" />
            <h1 className="text-2xl md:text-3xl lg:text-4xl font-bold text-gray-900">
              Tüm Şefler
            </h1>
          </div>
          <p className="text-sm md:text-base text-gray-600">
            Deneyimli şeflerimizden ev yapımı lezzetleri keşfedin
          </p>
        </div>

        {/* Search Bar */}
        <div className="mb-6 md:mb-8">
          <div className="relative w-full md:max-w-2xl">
            <Search className="absolute left-3 md:left-4 top-1/2 -translate-y-1/2 h-4 w-4 md:h-5 md:w-5 text-gray-400" />
            <Input
              placeholder="Şef adı, şehir veya mutfak türü ara..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10 md:pl-12 h-10 md:h-12 text-sm md:text-base rounded-lg md:rounded-xl border-2 focus:border-orange-500"
            />
          </div>
        </div>

        {/* Results Count */}
        <div className="mb-4 md:mb-6">
          <p className="text-sm md:text-base text-gray-600">
            <span className="font-semibold text-gray-900">{filteredChefs.length}</span> şef bulundu
          </p>
        </div>

        {/* Chefs List */}
        {filteredChefs.length > 0 ? (
          <ChefsList chefs={filteredChefs} />
        ) : (
          <div className="text-center py-12 md:py-20">
            <ChefHat className="h-12 w-12 md:h-16 md:w-16 text-gray-300 mx-auto mb-3 md:mb-4" />
            <h3 className="text-lg md:text-xl font-bold text-gray-700 mb-2">
              Şef Bulunamadı
            </h3>
            <p className="text-sm md:text-base text-gray-500 mb-4">
              Arama kriterlerinize uygun şef bulunamadı
            </p>
            <Button
              onClick={() => setSearchQuery("")}
              className="bg-orange-500 hover:bg-orange-600"
            >
              Aramayı Temizle
            </Button>
          </div>
        )}
      </div>

      <Footer />
    </div>
  );
};

export default Chefs;
