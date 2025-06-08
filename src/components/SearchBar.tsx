
import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Search, Plus, X, Sparkles, Clock } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

const SearchBar = () => {
  const [ingredients, setIngredients] = useState<string[]>([]);
  const [inputValue, setInputValue] = useState("");
  const [isSearching, setIsSearching] = useState(false);
  const { toast } = useToast();

  const popularIngredients = [
    "Tavuk", "Domates", "Soğan", "Sarımsak", "Pirinç", 
    "Yumurta", "Peynir", "Makarna", "Patates", "Biber"
  ];

  const addIngredient = () => {
    if (inputValue.trim() && !ingredients.includes(inputValue.trim())) {
      setIngredients([...ingredients, inputValue.trim()]);
      setInputValue("");
      toast({
        title: "Malzeme eklendi",
        description: `"${inputValue.trim()}" tarif aramanıza eklendi`,
      });
    }
  };

  const removeIngredient = (ingredient: string) => {
    setIngredients(ingredients.filter(item => item !== ingredient));
  };

  const addPopularIngredient = (ingredient: string) => {
    if (!ingredients.includes(ingredient)) {
      setIngredients([...ingredients, ingredient]);
      toast({
        title: "Malzeme eklendi",
        description: `"${ingredient}" tarif aramanıza eklendi`,
      });
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      addIngredient();
    }
  };

  const handleSearch = async () => {
    if (ingredients.length === 0) return;
    
    setIsSearching(true);
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 2000));
    setIsSearching(false);
    
    toast({
      title: "🎯 Tarifler bulundu!",
      description: `${ingredients.length} malzemeyle ${Math.floor(Math.random() * 20) + 5} tarif bulundu`,
    });
  };

  return (
    <div className="w-full max-w-4xl mx-auto">
      <div className="bg-white rounded-2xl shadow-xl border border-orange-100 p-6 backdrop-blur-sm">
        <div className="flex flex-col sm:flex-row gap-3 mb-4">
          <div className="flex-1 relative">
            <Input
              type="text"
              placeholder="Malzeme ekleyin (örn: domates, soğan, et...)"
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              onKeyPress={handleKeyPress}
              className="h-12 text-lg border-orange-200 focus:border-food-500 focus:ring-food-500 pl-4 pr-12"
            />
            {inputValue && (
              <Button
                onClick={() => setInputValue("")}
                className="absolute right-2 top-1/2 transform -translate-y-1/2 h-8 w-8 p-0"
                variant="ghost"
                size="sm"
              >
                <X className="h-4 w-4" />
              </Button>
            )}
          </div>
          <Button 
            onClick={addIngredient}
            disabled={!inputValue.trim()}
            className="h-12 px-6 gradient-primary text-white hover:opacity-90 transition-all duration-300 hover:scale-105"
          >
            <Plus className="h-5 w-5 mr-2" />
            Ekle
          </Button>
        </div>

        {/* Popular Ingredients */}
        {ingredients.length === 0 && (
          <div className="mb-4">
            <p className="text-sm text-gray-600 mb-2 flex items-center gap-2">
              <Sparkles className="h-4 w-4 text-food-500" />
              Popüler malzemeler:
            </p>
            <div className="flex flex-wrap gap-2">
              {popularIngredients.map((ingredient, index) => (
                <button
                  key={index}
                  onClick={() => addPopularIngredient(ingredient)}
                  className="text-xs px-3 py-1 bg-food-50 text-food-700 rounded-full hover:bg-food-100 transition-colors duration-200 border border-food-200"
                >
                  {ingredient}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Ingredients Tags */}
        {ingredients.length > 0 && (
          <div className="mb-4">
            <p className="text-sm text-gray-600 mb-2">Seçili malzemeler:</p>
            <div className="flex flex-wrap gap-2">
              {ingredients.map((ingredient, index) => (
                <span
                  key={index}
                  className="inline-flex items-center px-3 py-2 rounded-full text-sm bg-food-100 text-food-800 cursor-pointer hover:bg-food-200 transition-all duration-200 border border-food-200 hover:scale-105"
                  onClick={() => removeIngredient(ingredient)}
                >
                  {ingredient}
                  <X className="ml-2 h-3 w-3 text-food-600" />
                </span>
              ))}
            </div>
          </div>
        )}

        <Button 
          size="lg" 
          className="w-full h-12 gradient-primary text-white hover:opacity-90 transition-all duration-300 hover:scale-105"
          disabled={ingredients.length === 0 || isSearching}
          onClick={handleSearch}
        >
          {isSearching ? (
            <>
              <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
              Tarifler aranıyor...
            </>
          ) : (
            <>
              <Search className="mr-2 h-5 w-5" />
              {ingredients.length > 0 ? `${ingredients.length} malzeme ile tarif bul` : 'Tarif Ara'}
            </>
          )}
        </Button>

        <div className="flex items-center justify-center mt-4 text-sm text-gray-500">
          <Clock className="h-4 w-4 mr-1" />
          <span>💡 İpucu: Evinizdeki malzemeleri tek tek ekleyin, AI size en uygun tarifleri bulsun!</span>
        </div>
      </div>
    </div>
  );
};

export default SearchBar;
