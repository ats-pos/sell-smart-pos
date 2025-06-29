
import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Search, Plus, QrCode } from "lucide-react";
import { Product } from "@/lib/graphql/types";

interface ProductSearchProps {
  searchTerm: string;
  onSearchChange: (term: string) => void;
  products: Product[];
  loading: boolean;
  onAddToCart: (product: Product) => void;
  onAddManualItem: () => void;
}

export const ProductSearch = ({ 
  searchTerm, 
  onSearchChange, 
  products, 
  loading, 
  onAddToCart,
  onAddManualItem 
}: ProductSearchProps) => {
  return (
    <div className="bg-white border-b border-gray-200 p-4">
      <div className="flex gap-2 mb-4">
        <div className="flex-1 relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
          <Input
            placeholder="Enter product name or scan barcode"
            value={searchTerm}
            onChange={(e) => onSearchChange(e.target.value)}
            className="pl-10 border-gray-300 focus:border-blue-500"
          />
        </div>
        <Button variant="outline" size="icon" className="border-gray-300">
          <QrCode className="h-4 w-4" />
        </Button>
      </div>
      
      <Button 
        variant="outline" 
        onClick={onAddManualItem}
        className="w-full text-left justify-start border-gray-300 text-gray-600"
      >
        <Plus className="h-4 w-4 mr-2" />
        Add Manual Item
      </Button>
      
      {searchTerm.length >= 2 && (
        <div className="mt-4 max-h-48 overflow-y-auto">
          {loading ? (
            <div className="text-center py-4 text-gray-500">Searching...</div>
          ) : products.length === 0 ? (
            <div className="text-center py-4 text-gray-500">No products found</div>
          ) : (
            <div className="space-y-2">
              {products.map((product) => (
                <div
                  key={product.id}
                  className="flex items-center justify-between p-2 hover:bg-gray-50 rounded cursor-pointer"
                  onClick={() => onAddToCart(product)}
                >
                  <div>
                    <p className="font-medium text-sm">{product.name}</p>
                    <p className="text-xs text-gray-500">₹{product.price}</p>
                  </div>
                  <Button size="sm" variant="outline">
                    <Plus className="h-3 w-3" />
                  </Button>
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
};
