import React, { useState } from 'react';
import { Search, X, ChefHat } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';

interface SearchBarProps {
  placeholder?: string;
  onSearch?: (query: string) => void;
}

const SearchBar: React.FC<SearchBarProps> = ({
  placeholder = "Bugün ne pişirelim? 🍳",
  onSearch
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedIngredients, setSelectedIngredients] = useState<string[]>([]);
  const [isExpanded, setIsExpanded] = useState(false);
  // Popüler malzemeler listesi
  const popularIngredients = [
    "🍗 Tavuk", "🥩 Et", "🐟 Balık", "🍅 Domates",
    "🧄 Sarımsak", "🧅 Soğan", "🥔 Patates", "🥕 Havuç"
  ];
  // Popüler malzemelerin sadece isimleri (emojisiz)
  const cleanPopular = popularIngredients.map(i => i.split(' ').slice(1).join(' '));
  // Öneriler: yazılan sorguya göre filtrele
  const suggestions = searchQuery.trim()
    ? cleanPopular.filter(s => s.toLowerCase().includes(searchQuery.toLowerCase()) && !selectedIngredients.includes(s))
    : [];


  const handleIngredientSelect = (ingredient: string) => {
    const parts = ingredient.split(' ');
    const cleanIngredient = parts.slice(1).join(' ');
    if (!selectedIngredients.includes(cleanIngredient)) {
      setSelectedIngredients([...selectedIngredients, cleanIngredient]);
    }
  };

  const handleIngredientRemove = (ingredient: string) => {
    setSelectedIngredients(selectedIngredients.filter(item => item !== ingredient));
  };

  const handleSearch = () => {
    // Birleştirilen sorgu
    const fullQuery = [searchQuery, ...selectedIngredients].filter(Boolean).join(' ');
    // Basit hata düzeltme: Levenshtein ile en yakın popüler eşleşmeyi bul
    const levenshtein = (a: string, b: string) => {
      const dp: number[][] = Array(a.length + 1).fill(null).map(() => Array(b.length + 1).fill(0));
      for (let i = 0; i <= a.length; i++) dp[i][0] = i;
      for (let j = 0; j <= b.length; j++) dp[0][j] = j;
      for (let i = 1; i <= a.length; i++) for (let j = 1; j <= b.length; j++) {
        dp[i][j] = Math.min(
          dp[i - 1][j] + 1,
          dp[i][j - 1] + 1,
          dp[i - 1][j - 1] + (a[i - 1] === b[j - 1] ? 0 : 1)
        );
      }
      return dp[a.length][b.length];
    };
    const corrected = fullQuery.split(' ').map(word => {
      let best = word, min = Infinity;
      cleanPopular.forEach(c => {
        const d = levenshtein(word.toLowerCase(), c.toLowerCase());
        if (d < min) { min = d; best = c; }
      });
      return min <= 2 ? best : word;
    }).join(' ');
    onSearch?.(corrected);
    setIsExpanded(false);
    setIsExpanded(false);
  };

  return (
    <motion.div
      className="w-full max-w-2xl mx-auto"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, delay: 0.3 }}
    >
      {/* Ana Arama Barı */}
      <div className="relative">
        <div className="relative group">
          <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 h-5 w-5 text-orange-400 group-hover:text-orange-500 transition-colors" />
          <Input
            type="text"
            placeholder={placeholder}
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            onFocus={() => setIsExpanded(true)}
            onKeyDown={(e) => { if (e.key === 'Enter') { e.preventDefault(); handleSearch(); } }}
            className="w-full pl-12 pr-20 h-14 text-lg rounded-2xl border-2 border-orange-200 focus:border-orange-400 focus:ring-orange-200 bg-white/90 backdrop-blur-sm shadow-lg hover:shadow-xl transition-all duration-300"
          />
          <Button
            onClick={handleSearch}
            className="absolute right-2 top-2 h-10 px-6 bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 text-white rounded-xl font-semibold shadow-md hover:shadow-lg transition-all duration-300"
          >
            <ChefHat className="h-4 w-4 mr-2" />
            Ara
          </Button>
        </div>
      </div>

      {/* Seçili Malzemeler */}
      <AnimatePresence>
        {selectedIngredients.length > 0 && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="mt-4 p-4 bg-white/80 backdrop-blur-sm rounded-2xl border border-orange-100 shadow-md"
          >
            <h4 className="text-sm font-semibold text-gray-700 mb-3">Seçili Malzemeler:</h4>
            <div className="flex flex-wrap gap-2">
              {selectedIngredients.map((ingredient, index) => (
                <motion.div
                  key={ingredient}
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.8 }}
                >
                  <Badge
                    className="bg-gradient-to-r from-orange-500 to-orange-600 text-white px-3 py-1 rounded-full shadow-sm hover:shadow-md transition-all duration-200 cursor-pointer"
                    onClick={() => handleIngredientRemove(ingredient)}
                  >
                    {ingredient}
                    <X className="h-3 w-3 ml-2" />
                  </Badge>
                </motion.div>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Popüler Malzemeler */}
      <AnimatePresence>
        {isExpanded && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="mt-4 p-6 bg-white/80 backdrop-blur-sm rounded-2xl border border-orange-100 shadow-lg"
          >
            <h4 className="text-sm font-semibold text-gray-700 mb-4 flex items-center gap-2">
              <span className="text-orange-500">🔥</span>
              Popüler Malzemeler
            </h4>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
              {popularIngredients.map((ingredient, index) => (
                <motion.div
                  key={ingredient}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                >
                  <Badge
                    variant="outline"
                    className="w-full justify-center py-2 cursor-pointer hover:bg-orange-50 hover:border-orange-300 hover:text-orange-600 transition-all duration-200"
                    onClick={() => handleIngredientSelect(ingredient)}
                  >
                    {ingredient}
                  </Badge>
                </motion.div>
              ))}
            </div>
            <div className="mt-4 text-center">
              <button
                onClick={() => setIsExpanded(false)}
                className="text-sm text-gray-500 hover:text-gray-700 transition-colors"
              >
                Gizle
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
};

export default SearchBar;
