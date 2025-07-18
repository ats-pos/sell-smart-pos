
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { ProductEntry } from "./PurchaseEntryScreen";

interface BarcodeOptionsProps {
  options: {
    printAll: boolean;
    selectedItems: string[];
    labelSize: string;
    includePrice: boolean;
    includeName: boolean;
  };
  products: ProductEntry[];
  onOptionsChange: (options: any) => void;
}

export const BarcodeOptions = ({ options, products, onOptionsChange }: BarcodeOptionsProps) => {
  const labelSizes = [
    { value: "2x1", label: "2\" x 1\"" },
    { value: "3x1", label: "3\" x 1\"" },
    { value: "4x2", label: "4\" x 2\"" }
  ];

  const handleChange = (field: string, value: any) => {
    onOptionsChange({ ...options, [field]: value });
  };

  const toggleProductSelection = (productId: string, checked: boolean) => {
    const selectedItems = checked
      ? [...options.selectedItems, productId]
      : options.selectedItems.filter(id => id !== productId);
    
    onOptionsChange({ ...options, selectedItems });
  };

  return (
    <div className="space-y-6">
      {/* Print Options */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <Label htmlFor="printAll">Print All New Items</Label>
            <p className="text-sm text-gray-600">Generate barcodes for all added products</p>
          </div>
          <Switch
            id="printAll"
            checked={options.printAll}
            onCheckedChange={(checked) => handleChange('printAll', checked)}
          />
        </div>

        {/* Individual Product Selection */}
        {!options.printAll && products.length > 0 && (
          <div className="space-y-2">
            <Label>Select Items to Print:</Label>
            <div className="space-y-2 max-h-40 overflow-y-auto">
              {products.map((product) => (
                <div key={product.id} className="flex items-center space-x-2">
                  <Checkbox
                    id={product.id}
                    checked={options.selectedItems.includes(product.id)}
                    onCheckedChange={(checked) => toggleProductSelection(product.id, !!checked)}
                  />
                  <Label htmlFor={product.id} className="text-sm">
                    {product.name} ({product.quantity} {product.unit})
                  </Label>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Label Configuration */}
      <div className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="labelSize">Label Size</Label>
          <Select value={options.labelSize} onValueChange={(value) => handleChange('labelSize', value)}>
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {labelSizes.map(size => (
                <SelectItem key={size.value} value={size.value}>{size.label}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-3">
          <Label>Include on Label:</Label>
          
          <div className="flex items-center justify-between">
            <Label htmlFor="includeName">Product Name</Label>
            <Switch
              id="includeName"
              checked={options.includeName}
              onCheckedChange={(checked) => handleChange('includeName', checked)}
            />
          </div>

          <div className="flex items-center justify-between">
            <Label htmlFor="includePrice">Price</Label>
            <Switch
              id="includePrice"
              checked={options.includePrice}
              onCheckedChange={(checked) => handleChange('includePrice', checked)}
            />
          </div>
        </div>
      </div>

      {/* Preview */}
      <div className="border rounded-lg p-4 bg-gray-50">
        <Label>Label Preview:</Label>
        <div className="mt-2 border-2 border-dashed border-gray-300 rounded p-4 text-center text-sm">
          <div className="space-y-1">
            {options.includeName && <div className="font-medium">Sample Product Name</div>}
            <div className="font-mono text-xs">||||| |||| |||||</div>
            <div className="text-xs">1234567890123</div>
            {options.includePrice && <div className="font-bold">₹299.00</div>}
          </div>
        </div>
      </div>
    </div>
  );
};
