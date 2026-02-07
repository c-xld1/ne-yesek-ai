import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { useCart } from "@/contexts/CartContext";
import { supabase } from "@/integrations/supabase/client";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Separator } from "@/components/ui/separator";
import { MapPin, CreditCard, Wallet, CheckCircle, Clock } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

const Checkout = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();
  const { cart, clearCart, getCartTotal, getDeliveryFee } = useCart();
  const [loading, setLoading] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState("card");
  const [deliveryType, setDeliveryType] = useState("instant");
  
  const [addressForm, setAddressForm] = useState({
    fullName: "",
    phone: "",
    address: "",
    city: "İstanbul",
    district: "",
    notes: "",
  });

  useEffect(() => {
    if (!user) {
      navigate("/giris-yap");
      return;
    }
    if (cart.length === 0) {
      navigate("/neyesem/sepet");
    }
  }, [user, cart.length, navigate]);

  const handlePlaceOrder = async () => {
    if (!addressForm.fullName || !addressForm.phone || !addressForm.address || !addressForm.district) {
      toast({ title: "Eksik Bilgi", description: "Lütfen tüm teslimat bilgilerini doldurun", variant: "destructive" });
      return;
    }

    setLoading(true);

    try {
      // Group items by chef
      const chefGroups = cart.reduce((acc, item) => {
        if (!acc[item.chef_id]) acc[item.chef_id] = [];
        acc[item.chef_id].push(item);
        return acc;
      }, {} as Record<string, typeof cart>);

      // Create orders for each chef
      for (const [chefId, items] of Object.entries(chefGroups)) {
        const orderTotal = items.reduce((sum, item) => sum + (item.price * item.quantity), 0) + getDeliveryFee();
        const fullAddress = `${addressForm.fullName}, ${addressForm.phone}\n${addressForm.address}, ${addressForm.district}/${addressForm.city}\n${addressForm.notes}`;

        const { data: order, error: orderError } = await supabase
          .from("orders")
          .insert([{
            customer_id: user?.id,
            chef_id: chefId,
            total_amount: orderTotal,
            delivery_type: deliveryType === "instant" ? "delivery" : "scheduled",
            status: "pending",
            delivery_address: fullAddress,
            notes: `Ödeme: ${paymentMethod === "card" ? "Kredi Kartı" : "Kapıda Ödeme"}`,
          }])
          .select()
          .single();

        if (orderError) throw orderError;

        // Add order items
        const orderItems = items.map(item => ({
          order_id: order.id,
          meal_id: item.id,
          quantity: item.quantity,
          price: item.price,
        }));

        const { error: itemsError } = await supabase.from("order_items").insert(orderItems);
        if (itemsError) throw itemsError;
      }

      clearCart();
      toast({ title: "Sipariş Alındı! 🎉", description: "Siparişiniz başarıyla oluşturuldu" });
      navigate("/profil");
    } catch (error) {
      console.error("Order error:", error);
      toast({ title: "Hata", description: "Sipariş oluşturulamadı, lütfen tekrar deneyin", variant: "destructive" });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      <div className="max-w-6xl mx-auto px-4 py-6 md:py-8 pb-24 md:pb-8">
        <h1 className="text-xl md:text-2xl font-bold text-gray-900 mb-4 md:mb-6">Ödeme</h1>

        <div className="grid lg:grid-cols-3 gap-4 md:gap-6">
          <div className="lg:col-span-2 space-y-4 md:space-y-6">
            {/* Delivery Type */}
            <Card>
              <CardHeader className="pb-3 md:pb-4">
                <CardTitle className="flex items-center gap-2 text-base md:text-lg">
                  <Clock className="h-4 w-4 md:h-5 md:w-5" />Teslimat Tipi
                </CardTitle>
              </CardHeader>
              <CardContent className="pt-0">
                <RadioGroup value={deliveryType} onValueChange={setDeliveryType} className="space-y-2 md:space-y-3">
                  <div className="flex items-center space-x-2 p-3 md:p-4 border rounded-lg cursor-pointer hover:bg-gray-50">
                    <RadioGroupItem value="instant" id="instant" />
                    <Label htmlFor="instant" className="flex-1 cursor-pointer">
                      <p className="font-medium text-sm md:text-base">Hızlı Teslimat</p>
                      <p className="text-xs md:text-sm text-gray-500">45-60 dakika içinde</p>
                    </Label>
                  </div>
                  <div className="flex items-center space-x-2 p-3 md:p-4 border rounded-lg cursor-pointer hover:bg-gray-50">
                    <RadioGroupItem value="scheduled" id="scheduled" />
                    <Label htmlFor="scheduled" className="flex-1 cursor-pointer">
                      <p className="font-medium text-sm md:text-base">Randevulu Teslimat</p>
                      <p className="text-xs md:text-sm text-gray-500">İstediğiniz saatte</p>
                    </Label>
                  </div>
                </RadioGroup>
              </CardContent>
            </Card>

            {/* Delivery Address */}
            <Card>
              <CardHeader className="pb-3 md:pb-4">
                <CardTitle className="flex items-center gap-2 text-base md:text-lg">
                  <MapPin className="h-4 w-4 md:h-5 md:w-5" />Teslimat Adresi
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3 md:space-y-4 pt-0">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3 md:gap-4">
                  <div>
                    <Label htmlFor="fullName" className="text-xs md:text-sm">Ad Soyad</Label>
                    <Input id="fullName" value={addressForm.fullName} onChange={(e) => setAddressForm({ ...addressForm, fullName: e.target.value })} placeholder="Ad Soyad" className="mt-1 h-9 md:h-10 text-sm md:text-base" />
                  </div>
                  <div>
                    <Label htmlFor="phone" className="text-xs md:text-sm">Telefon</Label>
                    <Input id="phone" value={addressForm.phone} onChange={(e) => setAddressForm({ ...addressForm, phone: e.target.value })} placeholder="+90 5XX XXX XX XX" className="mt-1 h-9 md:h-10 text-sm md:text-base" />
                  </div>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3 md:gap-4">
                  <div>
                    <Label htmlFor="city" className="text-xs md:text-sm">İl</Label>
                    <Input id="city" value={addressForm.city} onChange={(e) => setAddressForm({ ...addressForm, city: e.target.value })} className="mt-1 h-9 md:h-10 text-sm md:text-base" />
                  </div>
                  <div>
                    <Label htmlFor="district" className="text-xs md:text-sm">İlçe</Label>
                    <Input id="district" value={addressForm.district} onChange={(e) => setAddressForm({ ...addressForm, district: e.target.value })} placeholder="İlçe" className="mt-1 h-9 md:h-10 text-sm md:text-base" />
                  </div>
                </div>
                <div>
                  <Label htmlFor="address" className="text-xs md:text-sm">Adres</Label>
                  <Textarea id="address" value={addressForm.address} onChange={(e) => setAddressForm({ ...addressForm, address: e.target.value })} placeholder="Mahalle, sokak, bina no, daire no" rows={3} className="mt-1 text-sm md:text-base" />
                </div>
                <div>
                  <Label htmlFor="notes" className="text-xs md:text-sm">Sipariş Notu (Opsiyonel)</Label>
                  <Textarea id="notes" value={addressForm.notes} onChange={(e) => setAddressForm({ ...addressForm, notes: e.target.value })} placeholder="Kurye için not" rows={2} className="mt-1 text-sm md:text-base" />
                </div>
              </CardContent>
            </Card>

            {/* Payment Method */}
            <Card>
              <CardHeader className="pb-3 md:pb-4">
                <CardTitle className="flex items-center gap-2 text-base md:text-lg">
                  <CreditCard className="h-4 w-4 md:h-5 md:w-5" />Ödeme Yöntemi
                </CardTitle>
              </CardHeader>
              <CardContent className="pt-0">
                <RadioGroup value={paymentMethod} onValueChange={setPaymentMethod} className="space-y-2 md:space-y-3">
                  <div className="flex items-center space-x-2 p-3 md:p-4 border rounded-lg cursor-pointer hover:bg-gray-50">
                    <RadioGroupItem value="card" id="card" />
                    <Label htmlFor="card" className="flex-1 cursor-pointer flex items-center gap-2">
                      <CreditCard className="h-4 w-4" />
                      <span className="font-medium text-sm md:text-base">Kredi/Banka Kartı</span>
                    </Label>
                  </div>
                  <div className="flex items-center space-x-2 p-3 md:p-4 border rounded-lg cursor-pointer hover:bg-gray-50">
                    <RadioGroupItem value="cash" id="cash" />
                    <Label htmlFor="cash" className="flex-1 cursor-pointer flex items-center gap-2">
                      <Wallet className="h-4 w-4" />
                      <span className="font-medium text-sm md:text-base">Kapıda Ödeme</span>
                    </Label>
                  </div>
                </RadioGroup>
              </CardContent>
            </Card>
          </div>

          {/* Order Summary */}
          <div className="lg:col-span-1">
            <Card className="sticky top-4">
              <CardHeader className="pb-3 md:pb-4">
                <CardTitle className="text-base md:text-lg">Sipariş Özeti</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3 md:space-y-4 pt-0">
                <div className="space-y-2 md:space-y-3">
                  {cart.map((item) => (
                    <div key={item.id} className="flex justify-between text-xs md:text-sm">
                      <span className="text-gray-600 truncate max-w-[60%]">{item.quantity}x {item.name}</span>
                      <span className="font-medium">{(item.price * item.quantity).toFixed(2)} ₺</span>
                    </div>
                  ))}
                </div>
                <Separator />
                <div className="space-y-2">
                  <div className="flex justify-between text-xs md:text-sm"><span className="text-gray-600">Ara Toplam</span><span className="font-medium">{getCartTotal().toFixed(2)} ₺</span></div>
                  <div className="flex justify-between text-xs md:text-sm"><span className="text-gray-600">Teslimat</span><span className="font-medium">{getDeliveryFee().toFixed(2)} ₺</span></div>
                </div>
                <Separator />
                <div className="flex justify-between"><span className="text-base md:text-lg font-bold">Toplam</span><span className="text-base md:text-lg font-bold text-orange-600">{(getCartTotal() + getDeliveryFee()).toFixed(2)} ₺</span></div>
                <Button onClick={handlePlaceOrder} disabled={loading} className="w-full bg-orange-500 hover:bg-orange-600 h-10 md:h-12 text-sm md:text-base">
                  {loading ? "İşleniyor..." : <><CheckCircle className="h-4 w-4 mr-2" />Siparişi Tamamla</>}
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default Checkout;
