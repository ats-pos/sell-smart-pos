
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { RefreshCw, Plus } from "lucide-react";
import { ProductEntry } from "./PurchaseEntryScreen";
import { generateBarcode } from "@/lib/utils/helpers";

interface SingleProductAddProps {
  onAdd: (product: Omit<ProductEntry, 'id'>) => void;
}

export const SingleProductAdd = ({ onAdd }: SingleProductAddProps) => {
  const [product, setProduct] = useState({
    name: '',
    category: '',
    brand: '',
    sku: '',
    barcode: '',
    quantity: 1,
    unit: 'pcs',
    costPrice: 0,
    sellingPrice: 0,
    gst: 18,
    gstInclusive: false,
    minStock: 5,
    generateBarcode: true
  });

  const categories = ["Electronics", "Accessories", "Clothing", "Home & Garden", "Sports", "Books", "General"];
  const units = ["pcs", "set", "kg", "liter", "meter", "box", "pair"];

  const handleChange = (field: string, value: any) => {
    setProduct(prev => {
      const updated = { ...prev, [field]: value };
      
      // Auto-generate barcode when name changes and auto-generation is enabled
      if (field === 'name' && updated.generateBarcode && value) {
        updated.barcode = generateBarcode('EAN-13');
      }
      
      return updated;
    });
  };

  const regenerateBarcode = () => {
    setProduct(prev => ({ ...prev, barcode: generateBarcode('EAN-13') }));
  };

  const handleAdd = () => {
    if (!product.name || !product.costPrice) return;
    
    onAdd(product);
    
    // Reset form
    setProduct({
      name: '',
      category: '',
      brand: '',
      sku: '',
      barcode: '',
      quantity: 1,
      unit: 'pcs',
      costPrice: 0,
      sellingPrice: 0,
      gst: 18,
      gstInclusive: false,
      minStock: 5,
      generateBarcode: true
    });
  };

  return (
    <Card className="p-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="name">Product Name *</Label>
          <Input
            id="name"
            value={product.name}
            onChange={(e) => handleChange('name', e.target.value)}
            placeholder="Enter product name"
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="category">Category</Label>
          <Select value={product.category} onValueChange={(value) => handleChange('category', value)}>
            <SelectTrigger>
              <SelectValue placeholder="Select category" />
            </SelectTrigger>
            <SelectContent>
              {categories.map(cat => (
                <SelectItem key={cat} value={cat}>{cat}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <Label htmlFor="brand">Brand</Label>
          <Input
            id="brand"
            value={product.brand}
            onChange={(e) => handleChange('brand', e.target.value)}
            placeholder="Enter brand name"
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="sku">SKU</Label>
          <Input
            id="sku"
            value={product.sku}
            onChange={(e) => handleChange('sku', e.target.value)}
            placeholder="Enter SKU (optional)"
          />
        </div>

        <div className="md:col-span-2 space-y-4">
          <div className="flex items-center justify-between">
            <Label htmlFor="barcode">Barcode</Label>
            <div className="flex items-center gap-2">
              <span className="text-sm text-gray-600">Auto-generate</span>
              <Switch
                checked={product.generateBarcode}
                onCheckedChange={(checked) => handleChange('generateBarcode', checked)}
              />
              {product.generateBarcode && (
                <Button variant="outline" size="sm" onClick={regenerateBarcode}>
                  <RefreshCw className="h-3 w-3" />
                </Button>
              )}
            </div>
          </div>
          <Input
            id="barcode"
            value={product.barcode}
            onChange={(e) => handleChange('barcode', e.target.value)}
            placeholder="Barcode will be auto-generated"
            disabled={product.generateBarcode}
          />
          {product.barcode && (
            <div className="flex items-center gap-2">
              <Badge variant="outline">{product.barcode}</Badge>
              <span className="text-xs text-gray-500">Barcode Preview</span>
            </div>
          )}
        </div>

        <div className="space-y-2">
          <Label htmlFor="quantity">Quantity *</Label>
          <Input
            id="quantity"
            type="number"
            value={product.quantity}
            onChange={(e) => handleChange('quantity', Number(e.target.value))}
            min="1"
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="unit">Unit</Label>
          <Select value={product.unit} onValueChange={(value) => handleChange('unit', value)}>
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {units.map(unit => (
                <SelectItem key={unit} value={unit}>{unit}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <Label htmlFor="costPrice">Cost Price (₹) *</Label>
          <Input
            id="costPrice"
            type="number"
            value={product.costPrice}
            onChange={(e) => handleChange('costPrice', Number(e.target.value))}
            placeholder="0"
            min="0"
            step="0.01"
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="sellingPrice">Selling Price (₹)</Label>
          <Input
            id="sellingPrice"
            type="number"
            value={product.sellingPrice}
            onChange={(e) => handleChange('sellingPrice', Number(e.target.value))}
            placeholder="0"
            min="0"
            step="0.01"
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="gst">GST (%)</Label>
          <div className="flex items-center gap-2">
            <Input
              id="gst"
              type="number"
              value={product.gst}
              onChange={(e) => handleChange('gst', Number(e.target.value))}
              placeholder="18"
              min="0"
              max="100"
              className="flex-1"
            />
            <div className="flex items-center gap-2">
              <span className="text-sm">Inclusive</span>
              <Switch
                checked={product.gstInclusive}
                onCheckedChange={(checked) => handleChange('gstInclusive', checked)}
              />
            </div>
          </div>
        </div>

        <div className="space-y-2">
          <Label htmlFor="minStock">Min Stock Alert</Label>
          <Input
            id="minStock"
            type="number"
            value={product.minStock}
            onChange={(e) => handleChange('minStock', Number(e.target.value))}
            placeholder="5"
            min="0"
          />
        </div>
      </div>

      <div className="mt-6 flex justify-end">
        <Button onClick={handleAdd} disabled={!product.name || !product.costPrice}>
          <Plus className="h-4 w-4 mr-2" />
          Add Product
        </Button>
      </div>
    </Card>
  );
};
