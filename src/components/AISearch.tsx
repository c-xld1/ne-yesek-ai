import { useState } from "react";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Card } from "./ui/card";
import { Search, Mic, Image, Loader2, Sparkles } from "lucide-react";
import { motion } from "framer-motion";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";

const AISearch = () => {
  const [ingredients, setIngredients] = useState("");
  const [isSearching, setIsSearching] = useState(false);
  const [results, setResults] = useState<any[]>([]);
  const { toast } = useToast();

  const handleSearch = async () => {
    if (!ingredients.trim()) {
      toast({
        title: "Malzeme Girin",
        description: "Lütfen en az bir malzeme girin",
        variant: "destructive",
      });
      return;
    }

    setIsSearching(true);
    try {
      const { data, error } = await supabase.functions.invoke('ai-recipe-suggest', {
        body: { ingredients: ingredients, preferences: "" }
      });

      if (error) throw error;

      setResults(data?.recipes || []);
      
      if (data?.recipes?.length === 0) {
        toast({
          title: "Tarif Bulunamadı",
          description: "Bu malzemelerle uygun tarif bulunamadı",
        });
      }
    } catch (error) {
      console.error('AI search error:', error);
      toast({
        title: "Hata",
        description: "Tarif arama sırasında bir hata oluştu",
        variant: "destructive",
      });
    } finally {
      setIsSearching(false);
    }
  };

  const handleRandomRecipe = async () => {
    setIsSearching(true);
    try {
      const { data, error } = await supabase
        .from('recipes')
        .select('*')
        .limit(1)
        .order('created_at', { ascending: false });

      if (error) throw error;

      if (data && data.length > 0) {
        window.location.href = `/tarif/${data[0].id}`;
      }
    } catch (error) {
      console.error('Random recipe error:', error);
    } finally {
      setIsSearching(false);
    }
  };

  return (
    <div className="w-full max-w-4xl mx-auto space-y-6">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center space-y-4"
      >
        <div className="inline-flex items-center gap-2 px-4 py-2 bg-primary/10 rounded-full">
          <Sparkles className="h-5 w-5 text-primary" />
          <span className="text-sm font-medium text-primary">AI Destekli Tarif Arama</span>
        </div>
        
        <h2 className="text-3xl md:text-4xl font-bold">
          Elindekilerle Ne Yapabilirim?
        </h2>
        <p className="text-muted-foreground">
          Malzemelerinizi yazın, AI size en uygun tarifleri bulsun
        </p>
      </motion.div>

      <Card className="p-6 space-y-4">
        <div className="flex gap-2">
          <Input
            placeholder="Örn: tavuk, pirinç, domates..."
            value={ingredients}
            onChange={(e) => setIngredients(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
            className="flex-1"
          />
          <Button
            onClick={handleSearch}
            disabled={isSearching}
            className="gap-2"
          >
            {isSearching ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              <Search className="h-4 w-4" />
            )}
            Ara
          </Button>
        </div>

        <div className="flex gap-2 justify-center">
          <Button variant="outline" size="sm" className="gap-2">
            <Mic className="h-4 w-4" />
            Sesle Gir
          </Button>
          <Button variant="outline" size="sm" className="gap-2">
            <Image className="h-4 w-4" />
            Fotoğraf Yükle
          </Button>
          <Button 
            variant="outline" 
            size="sm"
            onClick={handleRandomRecipe}
            disabled={isSearching}
          >
            🎲 Bugün Ne Yesek?
          </Button>
        </div>
      </Card>

      {results.length > 0 && (
        <div className="grid md:grid-cols-2 gap-4">
          {results.map((recipe, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
            >
              <Card className="p-4 hover:shadow-lg transition-shadow">
                <div className="flex items-start justify-between mb-2">
                  <h3 className="font-semibold text-lg">{recipe.title}</h3>
                  <span className="text-sm font-bold text-primary">{recipe.compatibility}% uyumlu</span>
                </div>
                <p className="text-sm text-muted-foreground mb-3">{recipe.description}</p>
                {recipe.missing_ingredients && recipe.missing_ingredients.length > 0 && (
                  <p className="text-xs text-orange-600 mb-2">
                    Eksik malzeme: {recipe.missing_ingredients.join(", ")}
                  </p>
                )}
                <div className="flex gap-2 text-xs text-muted-foreground">
                  <span>⏱️ {recipe.prep_time + recipe.cook_time} dk</span>
                  <span>🍽️ {recipe.servings} kişilik</span>
                  <span>📊 {recipe.difficulty}</span>
                </div>
              </Card>
            </motion.div>
          ))}
        </div>
      )}
    </div>
  );
};

export default AISearch;
