
import { useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Plus, Upload, Download } from "lucide-react";
import { ProductEntry } from "./PurchaseEntryScreen";
import { SingleProductAdd } from "./SingleProductAdd";
import { BulkProductAdd } from "./BulkProductAdd";

interface ProductEntryPanelProps {
  products: ProductEntry[];
  onProductsChange: (products: ProductEntry[]) => void;
}

export const ProductEntryPanel = ({ products, onProductsChange }: ProductEntryPanelProps) => {
  const [activeTab, setActiveTab] = useState("single");

  const addProduct = (product: Omit<ProductEntry, 'id'>) => {
    const newProduct: ProductEntry = {
      ...product,
      id: Date.now().toString()
    };
    onProductsChange([...products, newProduct]);
  };

  const updateProduct = (id: string, updates: Partial<ProductEntry>) => {
    const updatedProducts = products.map(product =>
      product.id === id ? { ...product, ...updates } : product
    );
    onProductsChange(updatedProducts);
  };

  const removeProduct = (id: string) => {
    const filteredProducts = products.filter(product => product.id !== id);
    onProductsChange(filteredProducts);
  };

  const downloadTemplate = () => {
    const csvContent = "Item Name,Category,Brand,SKU,Quantity,Unit,Cost Price,Selling Price,GST %,Min Stock\n";
    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'product_template.csv';
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="space-y-4">
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid grid-cols-2 w-full">
          <TabsTrigger value="single" className="flex items-center gap-2">
            <Plus className="h-4 w-4" />
            Single Product
          </TabsTrigger>
          <TabsTrigger value="bulk" className="flex items-center gap-2">
            <Upload className="h-4 w-4" />
            Bulk Entry
          </TabsTrigger>
        </TabsList>

        <TabsContent value="single" className="space-y-4">
          <SingleProductAdd onAdd={addProduct} />
        </TabsContent>

        <TabsContent value="bulk" className="space-y-4">
          <div className="flex justify-between items-center">
            <h3 className="text-lg font-semibold">Bulk Product Entry</h3>
            <Button variant="outline" onClick={downloadTemplate}>
              <Download className="h-4 w-4 mr-2" />
              Download Template
            </Button>
          </div>
          <BulkProductAdd onAdd={addProduct} />
        </TabsContent>
      </Tabs>

      {/* Product List */}
      {products.length > 0 && (
        <div className="mt-6">
          <h3 className="text-lg font-semibold mb-4">Added Products ({products.length})</h3>
          <div className="space-y-2">
            {products.map((product) => (
              <div key={product.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <div className="flex-1">
                  <div className="flex items-center gap-4">
                    <div>
                      <p className="font-medium">{product.name}</p>
                      <p className="text-sm text-gray-600">{product.brand} • {product.category}</p>
                    </div>
                    <div className="text-sm">
                      <span className="font-medium">Qty: {product.quantity}</span>
                      <span className="mx-2">•</span>
                      <span>₹{product.costPrice}</span>
                    </div>
                  </div>
                </div>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => removeProduct(product.id)}
                >
                  Remove
                </Button>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
