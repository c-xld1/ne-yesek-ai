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
      <div className="max-w-6xl mx-auto px-4 py-8">
        <h1 className="text-2xl font-bold text-gray-900 mb-6">Ödeme</h1>

        <div className="grid lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 space-y-6">
            {/* Delivery Type */}
            <Card>
              <CardHeader><CardTitle className="flex items-center gap-2"><Clock className="h-5 w-5" />Teslimat Tipi</CardTitle></CardHeader>
              <CardContent>
                <RadioGroup value={deliveryType} onValueChange={setDeliveryType}>
                  <div className="flex items-center space-x-2 p-4 border rounded-lg cursor-pointer hover:bg-gray-50">
                    <RadioGroupItem value="instant" id="instant" />
                    <Label htmlFor="instant" className="flex-1 cursor-pointer">
                      <p className="font-medium">Hızlı Teslimat</p>
                      <p className="text-sm text-gray-500">45-60 dakika içinde</p>
                    </Label>
                  </div>
                  <div className="flex items-center space-x-2 p-4 border rounded-lg cursor-pointer hover:bg-gray-50 mt-3">
                    <RadioGroupItem value="scheduled" id="scheduled" />
                    <Label htmlFor="scheduled" className="flex-1 cursor-pointer">
                      <p className="font-medium">Randevulu Teslimat</p>
                      <p className="text-sm text-gray-500">İstediğiniz saatte</p>
                    </Label>
                  </div>
                </RadioGroup>
              </CardContent>
            </Card>

            {/* Delivery Address */}
            <Card>
              <CardHeader><CardTitle className="flex items-center gap-2"><MapPin className="h-5 w-5" />Teslimat Adresi</CardTitle></CardHeader>
              <CardContent className="space-y-4">
                <div className="grid md:grid-cols-2 gap-4">
                  <div><Label htmlFor="fullName">Ad Soyad</Label><Input id="fullName" value={addressForm.fullName} onChange={(e) => setAddressForm({ ...addressForm, fullName: e.target.value })} placeholder="Ad Soyad" /></div>
                  <div><Label htmlFor="phone">Telefon</Label><Input id="phone" value={addressForm.phone} onChange={(e) => setAddressForm({ ...addressForm, phone: e.target.value })} placeholder="+90 5XX XXX XX XX" /></div>
                </div>
                <div className="grid md:grid-cols-2 gap-4">
                  <div><Label htmlFor="city">İl</Label><Input id="city" value={addressForm.city} onChange={(e) => setAddressForm({ ...addressForm, city: e.target.value })} /></div>
                  <div><Label htmlFor="district">İlçe</Label><Input id="district" value={addressForm.district} onChange={(e) => setAddressForm({ ...addressForm, district: e.target.value })} placeholder="İlçe" /></div>
                </div>
                <div><Label htmlFor="address">Adres</Label><Textarea id="address" value={addressForm.address} onChange={(e) => setAddressForm({ ...addressForm, address: e.target.value })} placeholder="Mahalle, sokak, bina no, daire no" rows={3} /></div>
                <div><Label htmlFor="notes">Sipariş Notu (Opsiyonel)</Label><Textarea id="notes" value={addressForm.notes} onChange={(e) => setAddressForm({ ...addressForm, notes: e.target.value })} placeholder="Kurye için not" rows={2} /></div>
              </CardContent>
            </Card>

            {/* Payment Method */}
            <Card>
              <CardHeader><CardTitle className="flex items-center gap-2"><CreditCard className="h-5 w-5" />Ödeme Yöntemi</CardTitle></CardHeader>
              <CardContent>
                <RadioGroup value={paymentMethod} onValueChange={setPaymentMethod}>
                  <div className="flex items-center space-x-2 p-4 border rounded-lg cursor-pointer hover:bg-gray-50">
                    <RadioGroupItem value="card" id="card" />
                    <Label htmlFor="card" className="flex-1 cursor-pointer flex items-center gap-2"><CreditCard className="h-4 w-4" /><span className="font-medium">Kredi/Banka Kartı</span></Label>
                  </div>
                  <div className="flex items-center space-x-2 p-4 border rounded-lg cursor-pointer hover:bg-gray-50 mt-3">
                    <RadioGroupItem value="cash" id="cash" />
                    <Label htmlFor="cash" className="flex-1 cursor-pointer flex items-center gap-2"><Wallet className="h-4 w-4" /><span className="font-medium">Kapıda Ödeme</span></Label>
                  </div>
                </RadioGroup>
              </CardContent>
            </Card>
          </div>

          {/* Order Summary */}
          <div className="lg:col-span-1">
            <Card className="sticky top-4">
              <CardHeader><CardTitle>Sipariş Özeti</CardTitle></CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-3">
                  {cart.map((item) => (
                    <div key={item.id} className="flex justify-between text-sm">
                      <span className="text-gray-600">{item.quantity}x {item.name}</span>
                      <span className="font-medium">{(item.price * item.quantity).toFixed(2)} ₺</span>
                    </div>
                  ))}
                </div>
                <Separator />
                <div className="space-y-2">
                  <div className="flex justify-between text-sm"><span className="text-gray-600">Ara Toplam</span><span className="font-medium">{getCartTotal().toFixed(2)} ₺</span></div>
                  <div className="flex justify-between text-sm"><span className="text-gray-600">Teslimat</span><span className="font-medium">{getDeliveryFee().toFixed(2)} ₺</span></div>
                </div>
                <Separator />
                <div className="flex justify-between"><span className="text-lg font-bold">Toplam</span><span className="text-lg font-bold text-orange-600">{(getCartTotal() + getDeliveryFee()).toFixed(2)} ₺</span></div>
                <Button onClick={handlePlaceOrder} disabled={loading} className="w-full bg-orange-500 hover:bg-orange-600 h-12">
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
