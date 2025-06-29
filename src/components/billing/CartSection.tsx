
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Minus, Plus } from "lucide-react";
import { SaleItem } from "@/lib/graphql/types";

interface CartSectionProps {
  cart: SaleItem[];
  onUpdateQuantity: (id: string, change: number) => void;
  onUpdateDiscount: (id: string, discount: number) => void;
  onRemoveItem: (id: string) => void;
  calculateItemTotal: (item: SaleItem) => number;
}

export const CartSection = ({ 
  cart, 
  onUpdateQuantity, 
  onUpdateDiscount, 
  onRemoveItem,
  calculateItemTotal 
}: CartSectionProps) => {
  const subtotal = cart.reduce((sum, item) => sum + calculateItemTotal(item), 0);

  return (
    <div className="bg-white border-r border-gray-200 flex-1 flex flex-col">
      <div className="p-4 border-b border-gray-200">
        <div className="grid grid-cols-4 gap-4 text-sm font-medium text-gray-600 pb-2">
          <span>Item</span>
          <span>Qty</span>
          <span>Price</span>
          <span>Total</span>
        </div>
      </div>
      
      <div className="flex-1 overflow-y-auto">
        {cart.length === 0 ? (
          <div className="flex items-center justify-center h-32 text-gray-500">
            No items in cart
          </div>
        ) : (
          <div className="space-y-1">
            {cart.map((item) => (
              <div key={item.id} className="border-b border-gray-100 p-4">
                <div className="grid grid-cols-4 gap-4 items-center">
                  <div>
                    <p className="font-medium text-sm">{item.productName}</p>
                    <p className="text-xs text-gray-500">₹{item.price} each</p>
                  </div>
                  
                  <div className="flex items-center gap-1">
                    <Button 
                      size="sm" 
                      variant="outline" 
                      onClick={() => onUpdateQuantity(item.id, -1)}
                      className="h-8 w-8 p-0"
                    >
                      <Minus className="h-3 w-3" />
                    </Button>
                    <span className="w-8 text-center text-sm">{item.quantity}</span>
                    <Button 
                      size="sm" 
                      variant="outline" 
                      onClick={() => onUpdateQuantity(item.id, 1)}
                      className="h-8 w-8 p-0"
                    >
                      <Plus className="h-3 w-3" />
                    </Button>
                  </div>
                  
                  <div className="flex items-center gap-1">
                    <span className="text-sm">₹{item.price}</span>
                    <Input
                      type="number"
                      placeholder="0%"
                      value={item.discount || ''}
                      onChange={(e) => onUpdateDiscount(item.id, Number(e.target.value))}
                      className="w-12 h-6 text-xs"
                      min="0"
                      max="100"
                    />
                  </div>
                  
                  <div className="text-right">
                    <span className="font-medium">₹{calculateItemTotal(item).toFixed(2)}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
      
      <div className="p-4 border-t border-gray-200">
        <div className="flex justify-between items-center">
          <span className="font-bold">Total: ₹{subtotal.toFixed(2)}</span>
          <div className="text-sm text-gray-500">₹{subtotal.toFixed(2)}</div>
        </div>
        <div className="flex gap-2 mt-2">
          <Button variant="outline" className="flex-1">
            Hold Bill
          </Button>
          <Button variant="outline" className="flex-1">
            Clear Cart
          </Button>
        </div>
      </div>
    </div>
  );
};
