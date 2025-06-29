import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { 
  ShoppingCart,
  Plus, 
  Minus, 
  Trash2, 
  Percent
} from "lucide-react";
import { SaleItem } from "@/lib/graphql/types";

interface CartItemsProps {
  cart: SaleItem[];
  onUpdateQuantity: (id: string, change: number) => void;
  onUpdateDiscount: (id: string, discount: number) => void;
  onRemoveItem: (id: string) => void;
  onHoldBill: () => void;
  onClearCart: () => void;
}

export const CartItems = ({ 
  cart, 
  onUpdateQuantity, 
  onUpdateDiscount, 
  onRemoveItem, 
  onHoldBill, 
  onClearCart 
}: CartItemsProps) => {
  const calculateItemTotal = (item: SaleItem) => {
    const itemTotal = item.price * item.quantity;
    return itemTotal - (itemTotal * item.discount / 100);
  };

  const totalAmount = cart.reduce((sum, item) => sum + calculateItemTotal(item), 0);

  return (
    <Card className="glass border-white/20 flex-1">
      <CardHeader className="pb-3">
        <div className="flex justify-between items-center">
          <CardTitle className="text-white flex items-center gap-2">
            <ShoppingCart className="h-5 w-5" />
            Cart Items ({cart.length})
          </CardTitle>
          <div className="text-sm text-blue-200">
            Total: ₹{totalAmount.toFixed(2)}
          </div>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        {cart.length === 0 ? (
          <div className="text-center py-12 text-blue-200">
            <ShoppingCart className="h-16 w-16 mx-auto mb-4 text-blue-300 opacity-50" />
            <p className="text-lg font-medium mb-2">No items in cart</p>
            <p className="text-sm">Search and add products to get started</p>
          </div>
        ) : (
          <>
            {/* Mobile View */}
            <div className="block md:hidden space-y-3 max-h-80 overflow-y-auto">
              {cart.map((item) => (
                <div key={item.id} className="p-3 bg-white/5 rounded-lg border border-white/10">
                  <div className="flex justify-between items-start mb-3">
                    <div className="flex-1">
                      <h4 className="text-white font-medium text-sm">{item.productName}</h4>
                      <p className="text-xs text-blue-200">₹{item.price} each</p>
                      {item.discount > 0 && (
                        <p className="text-xs text-green-300">{item.discount}% off</p>
                      )}
                    </div>
                    <Button 
                      size="sm" 
                      variant="destructive" 
                      className="h-7 w-7 p-0"
                      onClick={() => onRemoveItem(item.id)}
                    >
                      <Trash2 className="h-3 w-3" />
                    </Button>
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Button 
                        size="sm" 
                        variant="outline" 
                        className="h-7 w-7 p-0 bg-white/10 border-white/20 text-white hover:bg-white/20"
                        onClick={() => onUpdateQuantity(item.id, -1)}
                      >
                        <Minus className="h-3 w-3" />
                      </Button>
                      <span className="w-8 text-center text-white text-sm font-medium">{item.quantity}</span>
                      <Button 
                        size="sm" 
                        variant="outline" 
                        className="h-7 w-7 p-0 bg-white/10 border-white/20 text-white hover:bg-white/20"
                        onClick={() => onUpdateQuantity(item.id, 1)}
                      >
                        <Plus className="h-3 w-3" />
                      </Button>
                    </div>
                    
                    <div className="flex items-center gap-2">
                      <div className="flex items-center gap-1">
                        <Input
                          type="number"
                          placeholder="0"
                          value={item.discount}
                          onChange={(e) => onUpdateDiscount(item.id, Number(e.target.value))}
                          className="h-7 w-12 text-xs bg-white/10 border-white/20 text-white"
                          min="0"
                          max="100"
                        />
                        <Percent className="h-3 w-3 text-gray-400" />
                      </div>
                      <div className="text-white text-sm font-medium">
                        ₹{calculateItemTotal(item).toFixed(2)}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Desktop View */}
            <div className="hidden md:block">
              <div className="grid grid-cols-12 gap-2 text-sm font-medium text-blue-200 pb-2 border-b border-white/20">
                <div className="col-span-4">Item</div>
                <div className="col-span-2 text-center">Qty</div>
                <div className="col-span-2 text-center">Price</div>
                <div className="col-span-2 text-center">Total</div>
                <div className="col-span-2 text-center">Actions</div>
              </div>

              <div className="space-y-2 max-h-80 overflow-y-auto">
                {cart.map((item) => (
                  <div key={item.id} className="grid grid-cols-12 gap-2 items-center py-3 px-2 bg-white/5 rounded-lg border border-white/10">
                    <div className="col-span-4">
                      <div className="text-white font-medium text-sm">{item.productName}</div>
                      <div className="text-xs text-blue-200">₹{item.price} each</div>
                      {item.discount > 0 && (
                        <div className="text-xs text-green-300">{item.discount}% off</div>
                      )}
                    </div>
                    
                    <div className="col-span-2 flex items-center justify-center gap-1">
                      <Button 
                        size="sm" 
                        variant="outline" 
                        className="h-7 w-7 p-0 bg-white/10 border-white/20 text-white hover:bg-white/20"
                        onClick={() => onUpdateQuantity(item.id, -1)}
                      >
                        <Minus className="h-3 w-3" />
                      </Button>
                      <span className="w-8 text-center text-white text-sm font-medium">{item.quantity}</span>
                      <Button 
                        size="sm" 
                        variant="outline" 
                        className="h-7 w-7 p-0 bg-white/10 border-white/20 text-white hover:bg-white/20"
                        onClick={() => onUpdateQuantity(item.id, 1)}
                      >
                        <Plus className="h-3 w-3" />
                      </Button>
                    </div>
                    
                    <div className="col-span-2 text-center text-white text-sm">
                      ₹{item.price}
                    </div>
                    
                    <div className="col-span-2 text-center text-white text-sm font-medium">
                      ₹{calculateItemTotal(item).toFixed(2)}
                    </div>
                    
                    <div className="col-span-2 flex items-center justify-center gap-1">
                      <div className="flex items-center gap-1">
                        <Input
                          type="number"
                          placeholder="0"
                          value={item.discount}
                          onChange={(e) => onUpdateDiscount(item.id, Number(e.target.value))}
                          className="h-7 w-12 text-xs bg-white/10 border-white/20 text-white"
                          min="0"
                          max="100"
                        />
                        <Percent className="h-3 w-3 text-gray-400" />
                      </div>
                      <Button 
                        size="sm" 
                        variant="destructive" 
                        className="h-7 w-7 p-0"
                        onClick={() => onRemoveItem(item.id)}
                      >
                        <Trash2 className="h-3 w-3" />
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Cart Actions */}
            <div className="flex gap-2 pt-4 border-t border-white/20">
              <Button 
                variant="outline" 
                className="flex-1 bg-white/10 border-white/20 text-white hover:bg-white/20"
                onClick={onHoldBill}
              >
                Hold Bill
              </Button>
              <Button 
                variant="outline" 
                className="flex-1 bg-white/10 border-white/20 text-white hover:bg-white/20"
                onClick={onClearCart}
              >
                Clear Cart
              </Button>
            </div>
          </>
        )}
      </CardContent>
    </Card>
  );
};