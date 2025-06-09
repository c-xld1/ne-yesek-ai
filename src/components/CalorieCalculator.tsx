
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Calculator, Zap, Target, TrendingUp } from "lucide-react";

const CalorieCalculator = () => {
  const [servings, setServings] = useState(1);
  const [currentCalories] = useState(320); // Base recipe calories

  const nutritionInfo = {
    calories: currentCalories * servings,
    protein: 25 * servings,
    carbs: 35 * servings,
    fat: 12 * servings,
    fiber: 8 * servings
  };

  const dailyTargets = {
    calories: 2000,
    protein: 150,
    carbs: 300,
    fat: 65
  };

  const getPercentage = (current: number, target: number) => {
    return Math.round((current / target) * 100);
  };

  const getColorByPercentage = (percentage: number) => {
    if (percentage < 25) return "bg-red-100 text-red-800";
    if (percentage < 50) return "bg-yellow-100 text-yellow-800";
    if (percentage < 75) return "bg-blue-100 text-blue-800";
    return "bg-green-100 text-green-800";
  };

  return (
    <Card className="mb-6">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Calculator className="h-5 w-5" />
          Kalori & Besin Değeri Hesaplayıcısı
        </CardTitle>
      </CardHeader>
      <CardContent>
        {/* Porsiyon Ayarlayıcısı */}
        <div className="mb-6">
          <label className="block text-sm font-medium mb-2">Porsiyon Sayısı</label>
          <div className="flex items-center gap-3">
            <Button 
              variant="outline" 
              size="sm"
              onClick={() => setServings(Math.max(1, servings - 1))}
            >
              -
            </Button>
            <Input
              type="number"
              value={servings}
              onChange={(e) => setServings(Math.max(1, parseInt(e.target.value) || 1))}
              className="w-20 text-center"
              min="1"
            />
            <Button 
              variant="outline" 
              size="sm"
              onClick={() => setServings(servings + 1)}
            >
              +
            </Button>
            <span className="text-sm text-gray-600 ml-2">kişi için</span>
          </div>
        </div>

        {/* Besin Değerleri */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
          <div className="text-center p-4 bg-orange-50 rounded-lg border border-orange-200">
            <Zap className="h-6 w-6 mx-auto mb-2 text-orange-600" />
            <div className="font-bold text-xl text-orange-800">{nutritionInfo.calories}</div>
            <div className="text-sm text-orange-600">Kalori</div>
          </div>
          <div className="text-center p-4 bg-blue-50 rounded-lg border border-blue-200">
            <div className="font-bold text-xl text-blue-800">{nutritionInfo.protein}g</div>
            <div className="text-sm text-blue-600">Protein</div>
          </div>
          <div className="text-center p-4 bg-green-50 rounded-lg border border-green-200">
            <div className="font-bold text-xl text-green-800">{nutritionInfo.carbs}g</div>
            <div className="text-sm text-green-600">Karbonhidrat</div>
          </div>
          <div className="text-center p-4 bg-purple-50 rounded-lg border border-purple-200">
            <div className="font-bold text-xl text-purple-800">{nutritionInfo.fat}g</div>
            <div className="text-sm text-purple-600">Yağ</div>
          </div>
        </div>

        {/* Günlük Hedef Karşılaştırması */}
        <div className="bg-gray-50 p-4 rounded-lg">
          <h4 className="font-semibold mb-3 flex items-center gap-2">
            <Target className="h-4 w-4" />
            Günlük Hedef Oranı
          </h4>
          <div className="space-y-3">
            {[
              { name: "Kalori", current: nutritionInfo.calories, target: dailyTargets.calories, unit: "" },
              { name: "Protein", current: nutritionInfo.protein, target: dailyTargets.protein, unit: "g" },
              { name: "Karbonhidrat", current: nutritionInfo.carbs, target: dailyTargets.carbs, unit: "g" },
              { name: "Yağ", current: nutritionInfo.fat, target: dailyTargets.fat, unit: "g" }
            ].map((item) => {
              const percentage = getPercentage(item.current, item.target);
              return (
                <div key={item.name} className="flex items-center justify-between">
                  <span className="text-sm font-medium">{item.name}</span>
                  <div className="flex items-center gap-2">
                    <Badge className={getColorByPercentage(percentage)}>
                      %{percentage}
                    </Badge>
                    <span className="text-sm text-gray-600">
                      {item.current}{item.unit} / {item.target}{item.unit}
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Ek Bilgiler */}
        <div className="mt-4 p-3 bg-blue-50 rounded-lg border border-blue-200">
          <div className="flex items-center gap-2 mb-2">
            <TrendingUp className="h-4 w-4 text-blue-600" />
            <span className="text-sm font-medium text-blue-800">Beslenme İpuçları</span>
          </div>
          <p className="text-sm text-blue-700">
            Bu tarif protein açısından zengin ve günlük kalori ihtiyacınızın %{getPercentage(nutritionInfo.calories, dailyTargets.calories)}'ini karşılıyor.
            {nutritionInfo.fiber > 5 && " Ayrıca lif açısından da faydalı bir seçenek."}
          </p>
        </div>
      </CardContent>
    </Card>
  );
};

export default CalorieCalculator;
