
import { useState } from "react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Plus, X, Upload } from "lucide-react";

const ShareRecipe = () => {
  const [ingredients, setIngredients] = useState(["", ""]);
  const [instructions, setInstructions] = useState(["", ""]);

  const addIngredient = () => {
    setIngredients([...ingredients, ""]);
  };

  const removeIngredient = (index: number) => {
    setIngredients(ingredients.filter((_, i) => i !== index));
  };

  const updateIngredient = (index: number, value: string) => {
    const updated = [...ingredients];
    updated[index] = value;
    setIngredients(updated);
  };

  const addInstruction = () => {
    setInstructions([...instructions, ""]);
  };

  const removeInstruction = (index: number) => {
    setInstructions(instructions.filter((_, i) => i !== index));
  };

  const updateInstruction = (index: number, value: string) => {
    const updated = [...instructions];
    updated[index] = value;
    setInstructions(updated);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      
      <div className="max-w-4xl mx-auto px-4 py-8">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-4">
            🍳 Tarif Paylaş
          </h1>
          <p className="text-gray-600 max-w-2xl mx-auto">
            Lezzetli tariflerinizi toplulukla paylaşın ve diğer kullanıcıların beğenisini kazanın!
          </p>
        </div>

        <form className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Temel Bilgiler</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-2">Tarif Adı</label>
                <Input placeholder="Tarifinizin adını yazın..." />
              </div>
              
              <div>
                <label className="block text-sm font-medium mb-2">Açıklama</label>
                <textarea
                  className="w-full p-3 border border-gray-200 rounded-lg resize-none h-24"
                  placeholder="Tarifiniz hakkında kısa bir açıklama yazın..."
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-2">Pişirme Süresi</label>
                  <Input placeholder="25 dk" />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">Kaç Kişilik</label>
                  <Input placeholder="4 kişi" />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">Zorluk</label>
                  <select className="w-full p-2 border border-gray-200 rounded-lg">
                    <option>Kolay</option>
                    <option>Orta</option>
                    <option>Zor</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">Kategori</label>
                <select className="w-full p-2 border border-gray-200 rounded-lg">
                  <option>Ana Yemek</option>
                  <option>Çorba</option>
                  <option>Tatlı</option>
                  <option>Kahvaltı</option>
                  <option>15 Dakikada</option>
                  <option>Vegan</option>
                </select>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Fotoğraf ve Video</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-2">Tarif Fotoğrafı</label>
                <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center">
                  <Upload className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                  <p className="text-gray-600">Fotoğraf yüklemek için tıklayın</p>
                  <input type="file" className="hidden" accept="image/*" />
                </div>
              </div>
              
              <div>
                <label className="block text-sm font-medium mb-2">Video URL (Opsiyonel)</label>
                <Input placeholder="YouTube veya TikTok video linki..." />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Malzemeler</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {ingredients.map((ingredient, index) => (
                <div key={index} className="flex gap-2">
                  <Input
                    value={ingredient}
                    onChange={(e) => updateIngredient(index, e.target.value)}
                    placeholder={`${index + 1}. malzeme...`}
                    className="flex-1"
                  />
                  <Button
                    type="button"
                    variant="outline"
                    size="icon"
                    onClick={() => removeIngredient(index)}
                    className="flex-shrink-0"
                  >
                    <X className="h-4 w-4" />
                  </Button>
                </div>
              ))}
              <Button
                type="button"
                variant="outline"
                onClick={addIngredient}
                className="w-full"
              >
                <Plus className="h-4 w-4 mr-2" />
                Malzeme Ekle
              </Button>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Yapılışı</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {instructions.map((instruction, index) => (
                <div key={index} className="flex gap-2">
                  <span className="bg-food-500 text-white w-8 h-8 rounded-full flex items-center justify-center text-sm font-semibold flex-shrink-0 mt-1">
                    {index + 1}
                  </span>
                  <textarea
                    value={instruction}
                    onChange={(e) => updateInstruction(index, e.target.value)}
                    placeholder={`${index + 1}. adımı yazın...`}
                    className="flex-1 p-2 border border-gray-200 rounded-lg resize-none h-20"
                  />
                  <Button
                    type="button"
                    variant="outline"
                    size="icon"
                    onClick={() => removeInstruction(index)}
                    className="flex-shrink-0 mt-1"
                  >
                    <X className="h-4 w-4" />
                  </Button>
                </div>
              ))}
              <Button
                type="button"
                variant="outline"
                onClick={addInstruction}
                className="w-full"
              >
                <Plus className="h-4 w-4 mr-2" />
                Adım Ekle
              </Button>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Püf Noktaları</CardTitle>
            </CardHeader>
            <CardContent>
              <textarea
                className="w-full p-3 border border-gray-200 rounded-lg resize-none h-24"
                placeholder="Tarifiniz için ipuçları ve püf noktaları yazın..."
              />
            </CardContent>
          </Card>

          <div className="flex gap-4">
            <Button type="submit" className="gradient-primary text-white flex-1">
              Tarifi Paylaş
            </Button>
            <Button type="button" variant="outline">
              Taslak Kaydet
            </Button>
          </div>
        </form>
      </div>

      <Footer />
    </div>
  );
};

export default ShareRecipe;
