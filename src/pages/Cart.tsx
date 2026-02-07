import { useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { useCart } from "@/contexts/CartContext";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { ShoppingCart, Trash2, Plus, Minus, ArrowRight, AlertCircle } from "lucide-react";

const Cart = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const { cart, removeFromCart, updateQuantity, clearCart, getCartTotal, getDeliveryFee } = useCart();

  const handleCheckout = () => {
    if (!user) {
      navigate("/giris-yap");
      return;
    }
    navigate("/neyesem/odeme");
  };

  if (cart.length === 0) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Navbar />
        <div className="max-w-4xl mx-auto px-4 py-16">
          <Card className="text-center py-16">
            <CardContent>
              <ShoppingCart className="h-24 w-24 mx-auto text-gray-300 mb-4" />
              <h2 className="text-2xl font-semibold text-gray-900 mb-2">Sepetiniz Boş</h2>
              <p className="text-gray-500 mb-6">Lezzetli yemekler eklemek için şefleri keşfedin</p>
              <Button onClick={() => navigate("/neyesem")} className="bg-orange-500 hover:bg-orange-600">
                Alışverişe Başla
              </Button>
            </CardContent>
          </Card>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      
      <div className="max-w-6xl mx-auto px-4 py-6 md:py-8 pb-24 md:pb-8">
        <div className="mb-4 md:mb-6">
          <h1 className="text-xl md:text-2xl font-bold text-gray-900 mb-1 md:mb-2">Sepetim</h1>
          <p className="text-sm md:text-base text-gray-600">{cart.length} ürün</p>
        </div>

        <div className="grid lg:grid-cols-3 gap-4 md:gap-6">
          <div className="lg:col-span-2 space-y-3 md:space-y-4">
            {cart.map((item) => (
              <Card key={item.id} className="overflow-hidden">
                <CardContent className="p-3 md:p-4">
                  <div className="flex gap-3 md:gap-4">
                    <div className="w-20 h-20 md:w-24 md:h-24 rounded-lg overflow-hidden bg-gray-100 flex-shrink-0">
                      {item.image_url ? (
                        <img src={item.image_url} alt={item.name} className="w-full h-full object-cover" />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center text-2xl md:text-3xl">🍽️</div>
                      )}
                    </div>

                    <div className="flex-1 min-w-0">
                      <h3 className="font-semibold text-gray-900 mb-0.5 md:mb-1 text-sm md:text-base truncate">{item.name}</h3>
                      <p className="text-xs md:text-sm text-gray-500 mb-1 md:mb-2 truncate">{item.chef_name}</p>
                      {item.prep_time && <p className="text-xs text-gray-400 hidden sm:block">Hazırlık: {item.prep_time} dk</p>}
                      
                      {/* Mobile price and quantity */}
                      <div className="flex items-center justify-between mt-2 md:hidden">
                        <p className="text-base font-bold text-gray-900">{(item.price * item.quantity).toFixed(2)} ₺</p>
                        <div className="flex items-center gap-1 bg-gray-50 rounded-lg p-0.5">
                          <button onClick={() => updateQuantity(item.id, item.quantity - 1)} className="w-7 h-7 flex items-center justify-center rounded hover:bg-gray-200">
                            <Minus className="h-3 w-3" />
                          </button>
                          <span className="w-6 text-center font-medium text-sm">{item.quantity}</span>
                          <button onClick={() => updateQuantity(item.id, item.quantity + 1)} className="w-7 h-7 flex items-center justify-center rounded hover:bg-gray-200">
                            <Plus className="h-3 w-3" />
                          </button>
                        </div>
                      </div>
                    </div>

                    {/* Desktop controls */}
                    <div className="hidden md:flex flex-col items-end justify-between">
                      <button onClick={() => removeFromCart(item.id)} className="text-gray-400 hover:text-red-500 transition-colors">
                        <Trash2 className="h-4 w-4" />
                      </button>

                      <div className="text-right">
                        <p className="text-lg font-bold text-gray-900 mb-2">{(item.price * item.quantity).toFixed(2)} ₺</p>
                        <div className="flex items-center gap-2 bg-gray-50 rounded-lg p-1">
                          <button onClick={() => updateQuantity(item.id, item.quantity - 1)} className="w-7 h-7 flex items-center justify-center rounded hover:bg-gray-200">
                            <Minus className="h-4 w-4" />
                          </button>
                          <span className="w-8 text-center font-medium">{item.quantity}</span>
                          <button onClick={() => updateQuantity(item.id, item.quantity + 1)} className="w-7 h-7 flex items-center justify-center rounded hover:bg-gray-200">
                            <Plus className="h-4 w-4" />
                          </button>
                        </div>
                      </div>
                    </div>
                    
                    {/* Mobile delete button */}
                    <button onClick={() => removeFromCart(item.id)} className="md:hidden text-gray-400 hover:text-red-500 transition-colors self-start">
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                </CardContent>
              </Card>
            ))}

            <Button variant="outline" onClick={clearCart} className="w-full">
              <Trash2 className="h-4 w-4 mr-2" />
              Sepeti Temizle
            </Button>
          </div>

          <div className="lg:col-span-1">
            <Card className="sticky top-4">
              <CardContent className="p-6">
                <h2 className="text-lg font-bold text-gray-900 mb-4">Sipariş Özeti</h2>
                <div className="space-y-3 mb-4">
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Ara Toplam</span>
                    <span className="font-medium">{getCartTotal().toFixed(2)} ₺</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Teslimat</span>
                    <span className="font-medium">{getDeliveryFee().toFixed(2)} ₺</span>
                  </div>
                </div>
                <Separator className="my-4" />
                <div className="flex justify-between mb-6">
                  <span className="text-lg font-bold">Toplam</span>
                  <span className="text-lg font-bold text-orange-600">{(getCartTotal() + getDeliveryFee()).toFixed(2)} ₺</span>
                </div>
                <Button onClick={handleCheckout} className="w-full bg-orange-500 hover:bg-orange-600 h-12">
                  Ödemeye Geç <ArrowRight className="h-4 w-4 ml-2" />
                </Button>
                <div className="mt-4 p-3 bg-blue-50 rounded-lg flex gap-2">
                  <AlertCircle className="h-5 w-5 text-blue-600 flex-shrink-0 mt-0.5" />
                  <p className="text-xs text-blue-900">Minimum sipariş tutarı 50 ₺'dir</p>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default Cart;
