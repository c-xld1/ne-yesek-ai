import { useState, useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { Plus, X, Save, Eye, Sparkles, Loader2, ImagePlus } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { useCategories } from "@/hooks/useCategories";

interface RecipeFormData {
  title: string;
  description: string;
  ingredients: Array<{ name: string; amount: string }>;
  instructions: Array<{ step: number; description: string }>;
  category_id: string;
  prep_time: number;
  cook_time: number;
  servings: number;
  difficulty: string;
  image_url: string;
}

const ShareRecipe = () => {
  const [searchParams] = useSearchParams();
  const recipeId = searchParams.get('edit');
  const { user } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();
  const { data: categoriesData } = useCategories();
  const categories = categoriesData || [];
  const [isLoading, setIsLoading] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [isAILoading, setIsAILoading] = useState(false);
  const [showPreview, setShowPreview] = useState(false);
  
  const [formData, setFormData] = useState<RecipeFormData>({
    title: "",
    description: "",
    ingredients: [{ name: "", amount: "" }],
    instructions: [{ step: 1, description: "" }],
    category_id: "",
    prep_time: 0,
    cook_time: 0,
    servings: 1,
    difficulty: "Kolay",
    image_url: ""
  });

  useEffect(() => {
    if (!user) {
      toast({
        variant: "destructive",
        title: "Giriş Gerekli",
        description: "Tarif paylaşmak için giriş yapmalısınız.",
      });
      navigate("/giris-yap");
      return;
    }

    if (recipeId) {
      loadRecipe(recipeId);
    }
  }, [user, recipeId]);

  const loadRecipe = async (id: string) => {
    setIsLoading(true);
    try {
      const { data, error } = await supabase
        .from('recipes')
        .select('*')
        .eq('id', id)
        .single();

      if (error) throw error;

      if (data.user_id !== user?.id) {
        toast({
          variant: "destructive",
          title: "Yetki Hatası",
          description: "Bu tarifi düzenleyemezsiniz.",
        });
        navigate("/tarif-paylas");
        return;
      }

      const ingredients = Array.isArray(data.ingredients) 
        ? data.ingredients as Array<{ name: string; amount: string }>
        : [{ name: "", amount: "" }];
      
      const instructions = Array.isArray(data.instructions)
        ? data.instructions as Array<{ step: number; description: string }>
        : [{ step: 1, description: "" }];

      setFormData({
        title: data.title || "",
        description: data.description || "",
        ingredients,
        instructions,
        category_id: data.category_id || "",
        prep_time: data.prep_time || 0,
        cook_time: data.cook_time || 0,
        servings: data.servings || 1,
        difficulty: data.difficulty || "Kolay",
        image_url: data.image_url || ""
      });
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Hata",
        description: "Tarif yüklenemedi.",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const addIngredient = () => {
    setFormData({
      ...formData,
      ingredients: [...formData.ingredients, { name: "", amount: "" }]
    });
  };

  const removeIngredient = (index: number) => {
    setFormData({
      ...formData,
      ingredients: formData.ingredients.filter((_, i) => i !== index)
    });
  };

  const updateIngredient = (index: number, field: 'name' | 'amount', value: string) => {
    const updated = [...formData.ingredients];
    updated[index][field] = value;
    setFormData({ ...formData, ingredients: updated });
  };

  const addInstruction = () => {
    setFormData({
      ...formData,
      instructions: [...formData.instructions, { step: formData.instructions.length + 1, description: "" }]
    });
  };

  const removeInstruction = (index: number) => {
    const updated = formData.instructions
      .filter((_, i) => i !== index)
      .map((inst, i) => ({ ...inst, step: i + 1 }));
    setFormData({ ...formData, instructions: updated });
  };

  const updateInstruction = (index: number, value: string) => {
    const updated = [...formData.instructions];
    updated[index].description = value;
    setFormData({ ...formData, instructions: updated });
  };

  const callAI = async (action: string, data: any) => {
    setIsAILoading(true);
    try {
      const { data: result, error } = await supabase.functions.invoke('ai-recipe-assistant', {
        body: { action, data }
      });

      if (error) throw error;
      return result.suggestion;
    } catch (error) {
      toast({
        variant: "destructive",
        title: "AI Hatası",
        description: "AI önerisi alınamadı.",
      });
      return null;
    } finally {
      setIsAILoading(false);
    }
  };

  const handleAIImprove = async () => {
    const suggestion = await callAI('improve_recipe', {
      title: formData.title,
      ingredients: formData.ingredients.map(i => `${i.amount} ${i.name}`).join(', '),
      instructions: formData.instructions.map(i => i.description).join('\n')
    });

    if (suggestion) {
      toast({
        title: "AI Önerisi",
        description: suggestion,
      });
    }
  };

  const handleAISuggestIngredients = async () => {
    if (!formData.title) {
      toast({
        variant: "destructive",
        title: "Başlık Gerekli",
        description: "Önce tarif başlığı girin.",
      });
      return;
    }

    const suggestion = await callAI('suggest_ingredients', { title: formData.title });
    if (suggestion) {
      toast({
        title: "Malzeme Önerisi",
        description: suggestion,
      });
    }
  };

  const handleAIGenerateInstructions = async () => {
    if (formData.ingredients.length === 0 || !formData.title) {
      toast({
        variant: "destructive",
        title: "Eksik Bilgi",
        description: "Başlık ve malzemeleri girin.",
      });
      return;
    }

    const suggestion = await callAI('generate_instructions', {
      title: formData.title,
      ingredients: formData.ingredients.map(i => `${i.amount} ${i.name}`).join('\n')
    });

    if (suggestion) {
      toast({
        title: "Talimat Önerisi",
        description: suggestion,
      });
    }
  };

  const saveDraft = async () => {
    if (!user) return;
    
    setIsSaving(true);
    try {
      const recipeData = {
        ...formData,
        user_id: user.id,
        is_draft: true
      };

      if (recipeId) {
        const { error } = await supabase
          .from('recipes')
          .update(recipeData)
          .eq('id', recipeId);

        if (error) throw error;
        toast({ title: "Taslak kaydedildi!" });
      } else {
        const { data, error } = await supabase
          .from('recipes')
          .insert([recipeData])
          .select()
          .single();

        if (error) throw error;
        navigate(`/tarif-paylas?edit=${data.id}`);
        toast({ title: "Taslak oluşturuldu!" });
      }
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Hata",
        description: "Taslak kaydedilemedi.",
      });
    } finally {
      setIsSaving(false);
    }
  };

  const publishRecipe = async () => {
    if (!user) return;

    if (!formData.title || !formData.description || formData.ingredients.length === 0 || formData.instructions.length === 0) {
      toast({
        variant: "destructive",
        title: "Eksik Bilgi",
        description: "Lütfen tüm gerekli alanları doldurun.",
      });
      return;
    }

    setIsSaving(true);
    try {
      const recipeData = {
        ...formData,
        user_id: user.id,
        is_draft: false
      };

      if (recipeId) {
        const { error } = await supabase
          .from('recipes')
          .update(recipeData)
          .eq('id', recipeId);

        if (error) throw error;
      } else {
        const { data, error } = await supabase
          .from('recipes')
          .insert([recipeData])
          .select()
          .single();

        if (error) throw error;
        navigate(`/tarif/${data.id}`);
        toast({ title: "Tarif yayınlandı!" });
        return;
      }

      navigate(`/tarif/${recipeId}`);
      toast({ title: "Tarif güncellendi!" });
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Hata",
        description: "Tarif kaydedilemedi.",
      });
    } finally {
      setIsSaving(false);
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 via-white to-orange-50">
      <Navbar />

      <div className="max-w-4xl mx-auto px-4 py-8">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-3xl font-bold">
            {recipeId ? 'Tarifi Düzenle' : 'Yeni Tarif Paylaş'}
          </h1>
          <div className="flex gap-2">
            <Button
              variant="outline"
              onClick={() => setShowPreview(!showPreview)}
            >
              <Eye className="h-4 w-4 mr-2" />
              {showPreview ? 'Düzenle' : 'Önizle'}
            </Button>
            <Button
              variant="outline"
              onClick={saveDraft}
              disabled={isSaving}
            >
              <Save className="h-4 w-4 mr-2" />
              Taslak Kaydet
            </Button>
            <Button
              onClick={publishRecipe}
              disabled={isSaving}
              className="bg-gradient-to-r from-orange-500 to-red-500"
            >
              {isSaving ? <Loader2 className="h-4 w-4 animate-spin" /> : 'Yayınla'}
            </Button>
          </div>
        </div>

        {showPreview ? (
          <Card>
            <CardContent className="p-6">
              {formData.image_url && (
                <img src={formData.image_url} alt={formData.title} className="w-full h-64 object-cover rounded-lg mb-4" />
              )}
              <h2 className="text-2xl font-bold mb-2">{formData.title || 'Tarif Başlığı'}</h2>
              <p className="text-gray-600 mb-4">{formData.description || 'Tarif açıklaması'}</p>
              
              <div className="grid grid-cols-4 gap-4 mb-6">
                <div className="text-center">
                  <p className="text-sm text-gray-500">Hazırlık</p>
                  <p className="font-semibold">{formData.prep_time} dk</p>
                </div>
                <div className="text-center">
                  <p className="text-sm text-gray-500">Pişirme</p>
                  <p className="font-semibold">{formData.cook_time} dk</p>
                </div>
                <div className="text-center">
                  <p className="text-sm text-gray-500">Porsiyon</p>
                  <p className="font-semibold">{formData.servings}</p>
                </div>
                <div className="text-center">
                  <p className="text-sm text-gray-500">Zorluk</p>
                  <p className="font-semibold">{formData.difficulty}</p>
                </div>
              </div>

              <h3 className="text-xl font-semibold mb-3">Malzemeler</h3>
              <ul className="list-disc list-inside mb-6">
                {formData.ingredients.map((ing, i) => (
                  <li key={i}>{ing.amount} {ing.name}</li>
                ))}
              </ul>

              <h3 className="text-xl font-semibold mb-3">Yapılışı</h3>
              <ol className="list-decimal list-inside space-y-2">
                {formData.instructions.map((inst, i) => (
                  <li key={i}>{inst.description}</li>
                ))}
              </ol>
            </CardContent>
          </Card>
        ) : (
          <Card>
            <CardContent className="p-6">
              <Tabs defaultValue="basic" className="w-full">
                <TabsList className="grid w-full grid-cols-3">
                  <TabsTrigger value="basic">Temel Bilgiler</TabsTrigger>
                  <TabsTrigger value="ingredients">Malzemeler</TabsTrigger>
                  <TabsTrigger value="instructions">Yapılışı</TabsTrigger>
                </TabsList>

                <TabsContent value="basic" className="space-y-4">
                  <div>
                    <Label>Tarif Başlığı</Label>
                    <Input
                      value={formData.title}
                      onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                      placeholder="Lezzetli tarifin adı..."
                    />
                  </div>

                  <div>
                    <Label>Açıklama</Label>
                    <Textarea
                      value={formData.description}
                      onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                      placeholder="Tarifinizi kısaca tanıtın..."
                      rows={3}
                    />
                  </div>

                  <div>
                    <Label>Görsel URL</Label>
                    <Input
                      value={formData.image_url}
                      onChange={(e) => setFormData({ ...formData, image_url: e.target.value })}
                      placeholder="https://..."
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label>Kategori</Label>
                      <Select value={formData.category_id} onValueChange={(value) => setFormData({ ...formData, category_id: value })}>
                        <SelectTrigger>
                          <SelectValue placeholder="Kategori seçin" />
                        </SelectTrigger>
                        <SelectContent>
                          {categories.map((cat) => (
                            <SelectItem key={cat.id} value={cat.id}>
                              {cat.icon} {cat.name}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>

                    <div>
                      <Label>Zorluk</Label>
                      <Select value={formData.difficulty} onValueChange={(value) => setFormData({ ...formData, difficulty: value })}>
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="Kolay">Kolay</SelectItem>
                          <SelectItem value="Orta">Orta</SelectItem>
                          <SelectItem value="Zor">Zor</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>

                  <div className="grid grid-cols-3 gap-4">
                    <div>
                      <Label>Hazırlık (dk)</Label>
                      <Input
                        type="number"
                        value={formData.prep_time}
                        onChange={(e) => setFormData({ ...formData, prep_time: parseInt(e.target.value) || 0 })}
                      />
                    </div>
                    <div>
                      <Label>Pişirme (dk)</Label>
                      <Input
                        type="number"
                        value={formData.cook_time}
                        onChange={(e) => setFormData({ ...formData, cook_time: parseInt(e.target.value) || 0 })}
                      />
                    </div>
                    <div>
                      <Label>Porsiyon</Label>
                      <Input
                        type="number"
                        value={formData.servings}
                        onChange={(e) => setFormData({ ...formData, servings: parseInt(e.target.value) || 1 })}
                      />
                    </div>
                  </div>
                </TabsContent>

                <TabsContent value="ingredients" className="space-y-4">
                  <div className="flex justify-between items-center">
                    <Label>Malzemeler</Label>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={handleAISuggestIngredients}
                      disabled={isAILoading}
                    >
                      <Sparkles className="h-4 w-4 mr-2" />
                      AI Öner
                    </Button>
                  </div>

                  {formData.ingredients.map((ing, index) => (
                    <div key={index} className="flex gap-2">
                      <Input
                        placeholder="Miktar"
                        value={ing.amount}
                        onChange={(e) => updateIngredient(index, 'amount', e.target.value)}
                        className="w-1/3"
                      />
                      <Input
                        placeholder="Malzeme adı"
                        value={ing.name}
                        onChange={(e) => updateIngredient(index, 'name', e.target.value)}
                        className="flex-1"
                      />
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => removeIngredient(index)}
                      >
                        <X className="h-4 w-4" />
                      </Button>
                    </div>
                  ))}

                  <Button variant="outline" onClick={addIngredient} className="w-full">
                    <Plus className="h-4 w-4 mr-2" />
                    Malzeme Ekle
                  </Button>
                </TabsContent>

                <TabsContent value="instructions" className="space-y-4">
                  <div className="flex justify-between items-center">
                    <Label>Yapılış Adımları</Label>
                    <div className="flex gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={handleAIGenerateInstructions}
                        disabled={isAILoading}
                      >
                        <Sparkles className="h-4 w-4 mr-2" />
                        AI Oluştur
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={handleAIImprove}
                        disabled={isAILoading}
                      >
                        <Sparkles className="h-4 w-4 mr-2" />
                        AI İyileştir
                      </Button>
                    </div>
                  </div>

                  {formData.instructions.map((inst, index) => (
                    <div key={index} className="flex gap-2">
                      <div className="flex items-center justify-center w-8 h-10 bg-primary/10 rounded font-semibold text-primary">
                        {inst.step}
                      </div>
                      <Textarea
                        placeholder="Adım açıklaması..."
                        value={inst.description}
                        onChange={(e) => updateInstruction(index, e.target.value)}
                        rows={2}
                        className="flex-1"
                      />
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => removeInstruction(index)}
                      >
                        <X className="h-4 w-4" />
                      </Button>
                    </div>
                  ))}

                  <Button variant="outline" onClick={addInstruction} className="w-full">
                    <Plus className="h-4 w-4 mr-2" />
                    Adım Ekle
                  </Button>
                </TabsContent>
              </Tabs>
            </CardContent>
          </Card>
        )}
      </div>

      <Footer />
    </div>
  );
};

export default ShareRecipe;