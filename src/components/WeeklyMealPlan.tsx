
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Calendar, RefreshCw, Download, Share2, ChefHat, Clock, Users } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

const WeeklyMealPlan = () => {
  const [isGenerating, setIsGenerating] = useState(false);
  const [currentWeek, setCurrentWeek] = useState(1);
  const { toast } = useToast();

  const weeklyPlan = {
    "Pazartesi": {
      breakfast: "Avokado Toast + Yumurta",
      lunch: "Mercimek Çorbası + Salata", 
      dinner: "Tavuk Sote + Pilav"
    },
    "Salı": {
      breakfast: "Yoğurt + Granola + Meyve",
      lunch: "Köfte + Makarna",
      dinner: "Balık + Sebze"
    },
    "Çarşamba": {
      breakfast: "Omlet + Peynir + Domates",
      lunch: "Etli Nohut + Bulgur",
      dinner: "Tavuk Çorbası + Ekmek"
    },
    "Perşembe": {
      breakfast: "Smoothie Bowl",
      lunch: "Kıymalı Börek + Ayran",
      dinner: "Sebzeli Makarna"
    },
    "Cuma": {
      breakfast: "Sucuklu Yumurta + Simit",
      lunch: "İskender Kebap",
      dinner: "Ton Balıklı Salata"
    },
    "Cumartesi": {
      breakfast: "Krep + Reçel + Çay",
      lunch: "Lahmacun + Ayran",
      dinner: "Mantı + Yoğurt"
    },
    "Pazar": {
      breakfast: "Serpme Kahvaltı",
      lunch: "Pide + Salata",
      dinner: "Kuru Fasulye + Pilav"
    }
  };

  const generateNewPlan = async () => {
    setIsGenerating(true);
    // Simulate AI generation
    await new Promise(resolve => setTimeout(resolve, 2000));
    setIsGenerating(false);
    setCurrentWeek(currentWeek + 1);
    toast({
      title: "🤖 Yeni plan hazırlandı!",
      description: "AI size özel yeni haftalık yemek planını oluşturdu",
    });
  };

  const downloadPlan = () => {
    toast({
      title: "📥 Plan indiriliyor",
      description: "Haftalık yemek planınız PDF olarak hazırlanıyor...",
    });
  };

  const sharePlan = () => {
    toast({
      title: "📤 Plan paylaşılıyor",
      description: "Yemek planınız WhatsApp'a gönderiliyor...",
    });
  };

  return (
    <Card className="mb-8">
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2">
            <Calendar className="h-5 w-5" />
            Haftalık AI Yemek Planı (Hafta {currentWeek})
          </CardTitle>
          <div className="flex gap-2">
            <Button variant="outline" size="sm" onClick={downloadPlan}>
              <Download className="h-4 w-4 mr-1" />
              İndir
            </Button>
            <Button variant="outline" size="sm" onClick={sharePlan}>
              <Share2 className="h-4 w-4 mr-1" />
              Paylaş
            </Button>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        {/* AI Önerisi */}
        <div className="bg-gradient-to-r from-blue-50 to-purple-50 p-4 rounded-lg mb-6">
          <h4 className="font-semibold flex items-center gap-2 mb-2">
            <ChefHat className="h-4 w-4" />
            🤖 AI Önerisi
          </h4>
          <p className="text-sm text-gray-700">
            Bu hafta mevsimsel malzemeler ve beslenme dengesi gözetilerek hazırlandı. 
            Protein, vitamin ve mineral ihtiyaçlarınız karşılanıyor.
          </p>
        </div>

        {/* Haftalık Plan */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-6">
          {Object.entries(weeklyPlan).map(([day, meals]) => (
            <Card key={day} className="border border-gray-200">
              <CardContent className="p-4">
                <h4 className="font-semibold text-center mb-3 text-food-700">{day}</h4>
                <div className="space-y-3">
                  <div className="bg-yellow-50 p-2 rounded">
                    <div className="text-xs text-yellow-700 font-medium mb-1">KAHVALTI</div>
                    <div className="text-sm">{meals.breakfast}</div>
                  </div>
                  <div className="bg-blue-50 p-2 rounded">
                    <div className="text-xs text-blue-700 font-medium mb-1">ÖĞLE</div>
                    <div className="text-sm">{meals.lunch}</div>
                  </div>
                  <div className="bg-purple-50 p-2 rounded">
                    <div className="text-xs text-purple-700 font-medium mb-1">AKŞAM</div>
                    <div className="text-sm">{meals.dinner}</div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Plan Bilgileri */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
          <div className="text-center p-4 bg-green-50 rounded-lg">
            <Users className="h-6 w-6 mx-auto mb-2 text-green-600" />
            <div className="font-semibold text-green-800">4 Kişilik</div>
            <div className="text-sm text-green-600">Ortalama portion</div>
          </div>
          <div className="text-center p-4 bg-blue-50 rounded-lg">
            <Clock className="h-6 w-6 mx-auto mb-2 text-blue-600" />
            <div className="font-semibold text-blue-800">45 dk/öğün</div>
            <div className="text-sm text-blue-600">Ortalama hazırlık</div>
          </div>
          <div className="text-center p-4 bg-purple-50 rounded-lg">
            <ChefHat className="h-6 w-6 mx-auto mb-2 text-purple-600" />
            <div className="font-semibold text-purple-800">Dengeli</div>
            <div className="text-sm text-purple-600">Beslenme planı</div>
          </div>
        </div>

        {/* Yeni Plan Oluştur */}
        <div className="text-center">
          <Button 
            onClick={generateNewPlan}
            disabled={isGenerating}
            className="gradient-primary text-white hover:opacity-90"
          >
            {isGenerating ? (
              <>
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                AI Yeni Plan Hazırlıyor...
              </>
            ) : (
              <>
                <RefreshCw className="h-4 w-4 mr-2" />
                Yeni Haftalık Plan Oluştur
              </>
            )}
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default WeeklyMealPlan;
