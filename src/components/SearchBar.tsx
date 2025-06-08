
import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Search, Plus } from "lucide-react";

const SearchBar = () => {
  const [ingredients, setIngredients] = useState<string[]>([]);
  const [inputValue, setInputValue] = useState("");

  const addIngredient = () => {
    if (inputValue.trim() && !ingredients.includes(inputValue.trim())) {
      setIngredients([...ingredients, inputValue.trim()]);
      setInputValue("");
    }
  };

  const removeIngredient = (ingredient: string) => {
    setIngredients(ingredients.filter(item => item !== ingredient));
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      addIngredient();
    }
  };

  return (
    <div className="w-full max-w-4xl mx-auto">
      <div className="bg-white rounded-2xl shadow-lg border border-orange-100 p-6">
        <div className="flex flex-col sm:flex-row gap-3 mb-4">
          <div className="flex-1">
            <Input
              type="text"
              placeholder="Malzeme ekleyin (örn: domates, soğan, et...)"
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              onKeyPress={handleKeyPress}
              className="h-12 text-lg border-orange-200 focus:border-food-500 focus:ring-food-500"
            />
          </div>
          <Button 
            onClick={addIngredient}
            className="h-12 px-6 gradient-primary text-white hover:opacity-90"
          >
            <Plus className="h-5 w-5 mr-2" />
            Ekle
          </Button>
        </div>

        {/* Ingredients Tags */}
        {ingredients.length > 0 && (
          <div className="flex flex-wrap gap-2 mb-4">
            {ingredients.map((ingredient, index) => (
              <span
                key={index}
                className="inline-flex items-center px-3 py-1 rounded-full text-sm bg-food-100 text-food-800 cursor-pointer hover:bg-food-200 transition-colors"
                onClick={() => removeIngredient(ingredient)}
              >
                {ingredient}
                <span className="ml-2 text-food-600">×</span>
              </span>
            ))}
          </div>
        )}

        <Button 
          size="lg" 
          className="w-full h-12 gradient-primary text-white hover:opacity-90 transition-opacity"
          disabled={ingredients.length === 0}
        >
          <Search className="mr-2 h-5 w-5" />
          {ingredients.length > 0 ? `${ingredients.length} malzeme ile tarif bul` : 'Tarif Ara'}
        </Button>

        <p className="text-sm text-gray-500 mt-3 text-center">
          💡 İpucu: Evinizdeki malzemeleri tek tek ekleyin, AI size en uygun tarifleri bulsun!
        </p>
      </div>
    </div>
  );
};

export default SearchBar;
