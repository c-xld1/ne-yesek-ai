import React from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { 
  ShoppingCart, X, Trash2, Plus, Minus, 
  CreditCard, ShoppingBag 
} from "lucide-react";

interface CartItem {
  id: string;
  name: string;
  description?: string;
  price: number;
  image_url?: string;
  quantity?: number;
  chef_profiles?: {
    business_name: string;
  };
}

interface CartDropdownProps {
  cart: CartItem[];
  isOpen: boolean;
  onClose: () => void;
  onRemoveItem: (itemId: string) => void;
  onUpdateQuantity?: (itemId: string, quantity: number) => void;
}

const CartDropdown: React.FC<CartDropdownProps> = ({
  cart,
  isOpen,
  onClose,
  onRemoveItem,
  onUpdateQuantity,
}) => {
  const navigate = useNavigate();

  // Group items by id and count quantities
  const groupedCart = cart.reduce((acc, item) => {
    const existingItem = acc.find(i => i.id === item.id);
    if (existingItem) {
      existingItem.quantity = (existingItem.quantity || 1) + 1;
    } else {
      acc.push({ ...item, quantity: 1 });
    }
    return acc;
  }, [] as (CartItem & { quantity: number })[]);

  const totalPrice = groupedCart.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0
  );

  const handleCheckout = () => {
    onClose();
    navigate("/neyesem/odeme");
  };

  const handleGoToCart = () => {
    onClose();
    navigate("/neyesem/sepet");
  };

  if (!isOpen) return null;

  return (
    <>
      {/* Backdrop */}
      <div
        className="fixed inset-0 z-40 bg-black/20"
        onClick={onClose}
      />

      {/* Dropdown */}
      <Card className="absolute right-0 top-14 w-96 max-h-[600px] z-50 shadow-2xl border-2 animate-in slide-in-from-top-2 duration-200">
        {/* Header */}
        <div className="p-4 border-b bg-gradient-to-r from-orange-50 to-red-50">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <ShoppingCart className="h-5 w-5 text-orange-600" />
              <h3 className="font-bold text-lg text-gray-900">Sepetim</h3>
              <Badge className="bg-orange-500">{cart.length}</Badge>
            </div>
            <Button
              variant="ghost"
              size="sm"
              onClick={onClose}
              className="h-8 w-8 p-0 hover:bg-orange-100"
            >
              <X className="h-4 w-4" />
            </Button>
          </div>
        </div>

        {cart.length === 0 ? (
          /* Empty Cart */
          <CardContent className="p-8 text-center">
            <ShoppingCart className="h-16 w-16 mx-auto text-gray-300 mb-4" />
            <p className="text-gray-500 font-medium mb-2">Sepetiniz Boş</p>
            <p className="text-sm text-gray-400">
              Sepetinize ürün eklemek için lezzetlere göz atın
            </p>
          </CardContent>
        ) : (
          <>
            {/* Cart Items */}
            <div className="max-h-[350px] overflow-y-auto">
              <div className="p-3 space-y-2">
                {groupedCart.map((item) => (
                  <Card key={item.id} className="border shadow-sm hover:shadow-md transition-shadow">
                    <CardContent className="p-3">
                      <div className="flex gap-3">
                        {/* Image */}
                        <div className="flex-shrink-0">
                          <div className="w-16 h-16 rounded-lg overflow-hidden bg-gray-100">
                            {item.image_url ? (
                              <img
                                src={item.image_url}
                                alt={item.name}
                                className="w-full h-full object-cover"
                              />
                            ) : (
                              <div className="w-full h-full flex items-center justify-center">
                                <ShoppingBag className="h-6 w-6 text-gray-400" />
                              </div>
                            )}
                          </div>
                        </div>

                        {/* Details */}
                        <div className="flex-1 min-w-0">
                          <h4 className="font-semibold text-sm text-gray-900 truncate">
                            {item.name}
                          </h4>
                          {item.chef_profiles?.business_name && (
                            <p className="text-xs text-gray-500 truncate">
                              {item.chef_profiles.business_name}
                            </p>
                          )}
                          <div className="flex items-center justify-between mt-2">
                            <p className="font-bold text-orange-600">
                              {(item.price * item.quantity).toFixed(2)} ₺
                            </p>
                            
                            {/* Quantity Controls */}
                            <div className="flex items-center gap-1">
                              <Button
                                size="sm"
                                variant="outline"
                                className="h-6 w-6 p-0 rounded-md"
                                onClick={() => {
                                  if (item.quantity > 1 && onUpdateQuantity) {
                                    onUpdateQuantity(item.id, item.quantity - 1);
                                  }
                                }}
                              >
                                <Minus className="h-3 w-3" />
                              </Button>
                              <span className="text-sm font-semibold w-6 text-center">
                                {item.quantity}
                              </span>
                              <Button
                                size="sm"
                                variant="outline"
                                className="h-6 w-6 p-0 rounded-md"
                                onClick={() => {
                                  if (onUpdateQuantity) {
                                    onUpdateQuantity(item.id, item.quantity + 1);
                                  }
                                }}
                              >
                                <Plus className="h-3 w-3" />
                              </Button>
                            </div>
                          </div>
                        </div>

                        {/* Remove Button */}
                        <Button
                          size="sm"
                          variant="ghost"
                          className="h-6 w-6 p-0 text-red-500 hover:text-red-600 hover:bg-red-50"
                          onClick={() => onRemoveItem(item.id)}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>

            <Separator />

            {/* Footer */}
            <div className="p-4 space-y-3 bg-gray-50">
              {/* Total */}
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium text-gray-600">Toplam:</span>
                <span className="text-xl font-bold text-gray-900">
                  {totalPrice.toFixed(2)} ₺
                </span>
              </div>

              {/* Action Buttons */}
              <div className="space-y-2">
                <Button
                  onClick={handleCheckout}
                  className="w-full bg-orange-500 hover:bg-orange-600 text-white font-semibold h-11 gap-2"
                >
                  <CreditCard className="h-5 w-5" />
                  Ödemeye Geç
                </Button>
                <Button
                  onClick={handleGoToCart}
                  variant="outline"
                  className="w-full border-orange-500 text-orange-600 hover:bg-orange-50 font-medium h-10"
                >
                  Sepeti Görüntüle
                </Button>
              </div>
            </div>
          </>
        )}
      </Card>
    </>
  );
};

export default CartDropdown;
