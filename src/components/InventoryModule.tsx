import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import { 
  Plus, 
  Search, 
  Edit, 
  Trash2, 
  Package,
  AlertTriangle,
  Filter,
  Download,
  Settings,
  RefreshCw,
  Wand2,
  ShoppingCart
} from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import { useNavigate } from "react-router-dom";
import { useGraphQLQuery, useGraphQLMutation } from "@/hooks/useGraphQL";
import { GET_PRODUCTS, SEARCH_PRODUCTS } from "@/lib/graphql/queries";
import { CREATE_PRODUCT, UPDATE_PRODUCT, DELETE_PRODUCT } from "@/lib/graphql/mutations";
import { Product, ProductInput } from "@/lib/graphql/types";
import { useToast } from "@/hooks/use-toast";
import { BARCODE_TYPES } from "@/lib/utils/constants";
import { generateBarcode } from "@/lib/utils/helpers";
import { useLocalStorage } from "@/hooks/useLocalStorage";

interface BarcodeSettings {
  autoGenerate: boolean;
  defaultType: string;
  prefix: string;
  includeCategory: boolean;
  includeBrand: boolean;
}

const InventoryModule = () => {
  const { toast } = useToast();
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState("");
  const [showBarcodeSettings, setShowBarcodeSettings] = useState(false);
  
  // Barcode settings stored in localStorage
  const [barcodeSettings, setBarcodeSettings] = useLocalStorage<BarcodeSettings>('barcode-settings', {
    autoGenerate: true,
    defaultType: 'EAN-13',
    prefix: '',
    includeCategory: false,
    includeBrand: false
  });

  const [newProduct, setNewProduct] = useState<ProductInput>({
    name: "",
    barcode: "",
    price: 0,
    stock: 0,
    minStock: 5,
    category: "",
    brand: "",
    supplier: ""
  });

  // GraphQL hooks
  const { data: productsData, loading: productsLoading, refetch: refetchProducts } = useGraphQLQuery<{
    products: Product[];
  }>(GET_PRODUCTS, {
    variables: { limit: 100 }
  });

  const { data: searchData, loading: searchLoading } = useGraphQLQuery<{
    searchProducts: Product[];
  }>(SEARCH_PRODUCTS, {
    variables: { query: searchTerm },
    skip: !searchTerm || searchTerm.length < 2
  });

  const { mutate: createProduct, loading: createLoading } = useGraphQLMutation<{
    createProduct: Product;
  }, { input: ProductInput }>(CREATE_PRODUCT, {
    onCompleted: () => {
      toast({
        title: "Product Added",
        description: "Product has been added successfully with auto-generated barcode."
      });
      refetchProducts();
      resetForm();
    }
  });

  const { mutate: updateProduct } = useGraphQLMutation<{
    updateProduct: Product;
  }, { id: string; input: ProductInput }>(UPDATE_PRODUCT, {
    onCompleted: () => {
      toast({
        title: "Product Updated",
        description: "Product has been updated successfully."
      });
      refetchProducts();
    }
  });

  const { mutate: deleteProduct } = useGraphQLMutation<{
    deleteProduct: { success: boolean; message: string };
  }, { id: string }>(DELETE_PRODUCT, {
    onCompleted: () => {
      toast({
        title: "Product Deleted",
        description: "Product has been deleted successfully."
      });
      refetchProducts();
    }
  });

  const products = searchTerm.length >= 2 
    ? (searchData?.searchProducts || [])
    : (productsData?.products || []);

  const loading = searchTerm.length >= 2 ? searchLoading : productsLoading;
  const lowStockProducts = products.filter(product => product.stock <= product.minStock);

  const getStockStatus = (stock: number, minStock: number) => {
    if (stock === 0) return { label: "Out of Stock", color: "destructive" };
    if (stock <= minStock) return { label: "Low Stock", color: "secondary" };
    return { label: "In Stock", color: "default" };
  };

  const generateProductBarcode = (productData: ProductInput): string => {
    if (!barcodeSettings.autoGenerate) {
      return productData.barcode || '';
    }

    let barcode = generateBarcode(barcodeSettings.defaultType);
    
    // Add prefix if specified
    if (barcodeSettings.prefix) {
      barcode = barcodeSettings.prefix + barcode.slice(barcodeSettings.prefix.length);
    }

    // Modify barcode based on category/brand settings
    if (barcodeSettings.includeCategory && productData.category) {
      const categoryCode = productData.category.substring(0, 2).toUpperCase();
      barcode = categoryCode + barcode.slice(2);
    }

    if (barcodeSettings.includeBrand && productData.brand) {
      const brandCode = productData.brand.substring(0, 2).toUpperCase();
      barcode = barcode.slice(0, -2) + brandCode;
    }

    return barcode;
  };

  const handleProductChange = (field: keyof ProductInput, value: string | number) => {
    const updatedProduct = { ...newProduct, [field]: value };
    
    // Auto-generate barcode when name, category, or brand changes
    if (barcodeSettings.autoGenerate && (field === 'name' || field === 'category' || field === 'brand')) {
      if (updatedProduct.name) { // Only generate if product has a name
        updatedProduct.barcode = generateProductBarcode(updatedProduct);
      }
    }
    
    setNewProduct(updatedProduct);
  };

  const regenerateBarcode = () => {
    if (newProduct.name) {
      const newBarcode = generateProductBarcode(newProduct);
      setNewProduct({ ...newProduct, barcode: newBarcode });
      toast({
        title: "Barcode Regenerated",
        description: "A new barcode has been generated for this product."
      });
    }
  };

  const resetForm = () => {
    setNewProduct({
      name: "",
      barcode: "",
      price: 0,
      stock: 0,
      minStock: 5,
      category: "",
      brand: "",
      supplier: ""
    });
  };

  const addProduct = async () => {
    if (newProduct.name && newProduct.price) {
      try {
        // Ensure barcode is generated if auto-generation is enabled
        let finalProduct = { ...newProduct };
        if (barcodeSettings.autoGenerate && !finalProduct.barcode) {
          finalProduct.barcode = generateProductBarcode(finalProduct);
        }

        await createProduct({
          input: {
            ...finalProduct,
            price: Number(finalProduct.price),
            stock: Number(finalProduct.stock),
            minStock: Number(finalProduct.minStock),
            category: finalProduct.category || "General",
            brand: finalProduct.brand || "Generic",
            supplier: finalProduct.supplier || "Unknown"
          }
        });
      } catch (error) {
        console.error("Error adding product:", error);
      }
    } else {
      toast({
        title: "Error",
        description: "Please fill in product name and price.",
        variant: "destructive"
      });
    }
  };

  const handleDeleteProduct = async (id: string) => {
    try {
      await deleteProduct({ id });
    } catch (error) {
      console.error("Error deleting product:", error);
    }
  };

  const updateBarcodeSettings = (settings: Partial<BarcodeSettings>) => {
    const newSettings = { ...barcodeSettings, ...settings };
    setBarcodeSettings(newSettings);
    
    // If auto-generation is enabled and we have a product name, regenerate barcode
    if (newSettings.autoGenerate && newProduct.name) {
      const newBarcode = generateProductBarcode(newProduct);
      setNewProduct({ ...newProduct, barcode: newBarcode });
    }
  };

  const handleNewPurchaseOrder = () => {
    navigate('/purchase');
  };

  return (
    <div className="space-y-6">
      {/* Header Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="glass border-white/20">
          <CardContent className="flex items-center p-4">
            <Package className="h-8 w-8 text-blue-500 mr-3" />
            <div>
              <p className="text-2xl font-bold text-white">{loading ? "..." : products.length}</p>
              <p className="text-sm text-blue-200">Total Products</p>
            </div>
          </CardContent>
        </Card>
        <Card className="glass border-white/20">
          <CardContent className="flex items-center p-4">
            <AlertTriangle className="h-8 w-8 text-amber-500 mr-3" />
            <div>
              <p className="text-2xl font-bold text-white">{loading ? "..." : lowStockProducts.length}</p>
              <p className="text-sm text-blue-200">Low Stock Items</p>
            </div>
          </CardContent>
        </Card>
        <Card className="glass border-white/20">
          <CardContent className="flex items-center p-4">
            <Package className="h-8 w-8 text-green-500 mr-3" />
            <div>
              <p className="text-2xl font-bold text-white">
                {loading ? "..." : products.reduce((sum, p) => sum + p.stock, 0)}
              </p>
              <p className="text-sm text-blue-200">Total Stock</p>
            </div>
          </CardContent>
        </Card>
        <Card className="glass border-white/20">
          <CardContent className="flex items-center p-4">
            <Package className="h-8 w-8 text-purple-500 mr-3" />
            <div>
              <p className="text-2xl font-bold text-white">
                ₹{loading ? "..." : products.reduce((sum, p) => sum + (p.price * p.stock), 0).toLocaleString()}
              </p>
              <p className="text-sm text-blue-200">Stock Value</p>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Actions Bar */}
      <Card className="glass border-white/20">
        <CardContent className="flex flex-wrap items-center justify-between gap-4 p-4">
          <div className="flex items-center gap-4 flex-1">
            <div className="relative flex-1 max-w-sm">
              <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
              <Input
                placeholder="Search products..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
            <Button variant="outline" className="bg-white/10 border-white/20 text-white hover:bg-white/20">
              <Filter className="h-4 w-4 mr-2" />
              Filter
            </Button>
          </div>
          <div className="flex items-center gap-2">
            <Button 
              onClick={handleNewPurchaseOrder}
              className="bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600 text-white shadow-lg"
            >
              <ShoppingCart className="h-4 w-4 mr-2" />
              New Purchase Order
            </Button>
            <Button 
              variant="outline"
              onClick={() => setShowBarcodeSettings(true)}
              className="bg-white/10 border-white/20 text-white hover:bg-white/20"
            >
              <Settings className="h-4 w-4 mr-2" />
              Barcode Settings
            </Button>
            <Button variant="outline" className="bg-white/10 border-white/20 text-white hover:bg-white/20">
              <Download className="h-4 w-4 mr-2" />
              Export
            </Button>
            <Dialog>
              <DialogTrigger asChild>
                <Button className="bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600">
                  <Plus className="h-4 w-4 mr-2" />
                  Add Product
                </Button>
              </DialogTrigger>
              <DialogContent className="glass border-white/20 max-w-2xl max-h-[90vh] overflow-y-auto">
                <DialogHeader>
                  <DialogTitle className="text-white">Add New Product</DialogTitle>
                </DialogHeader>
                <div className="space-y-6">
                  {/* Barcode Settings Info */}
                  {barcodeSettings.autoGenerate && (
                    <div className="bg-blue-50/10 p-3 rounded-lg border border-blue-200/20">
                      <div className="flex items-center gap-2 text-blue-300 mb-2">
                        <Wand2 className="h-4 w-4" />
                        <span className="font-medium">Auto-Barcode Generation Enabled</span>
                      </div>
                      <p className="text-sm text-blue-200">
                        Barcodes will be automatically generated using {barcodeSettings.defaultType} format
                        {barcodeSettings.prefix && ` with prefix "${barcodeSettings.prefix}"`}.
                      </p>
                    </div>
                  )}

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="name" className="text-white">Product Name *</Label>
                      <Input
                        id="name"
                        value={newProduct.name}
                        onChange={(e) => handleProductChange('name', e.target.value)}
                        placeholder="Enter product name"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="category" className="text-white">Category</Label>
                      <Select onValueChange={(value) => handleProductChange('category', value)}>
                        <SelectTrigger className="bg-white/10 border-white/20 text-white">
                          <SelectValue placeholder="Select category" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="Electronics">Electronics</SelectItem>
                          <SelectItem value="Accessories">Accessories</SelectItem>
                          <SelectItem value="Clothing">Clothing</SelectItem>
                          <SelectItem value="Home & Garden">Home & Garden</SelectItem>
                          <SelectItem value="Sports">Sports</SelectItem>
                          <SelectItem value="Books">Books</SelectItem>
                          <SelectItem value="General">General</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="brand" className="text-white">Brand</Label>
                      <Input
                        id="brand"
                        value={newProduct.brand}
                        onChange={(e) => handleProductChange('brand', e.target.value)}
                        placeholder="Enter brand name"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="supplier" className="text-white">Supplier</Label>
                      <Input
                        id="supplier"
                        value={newProduct.supplier}
                        onChange={(e) => handleProductChange('supplier', e.target.value)}
                        placeholder="Enter supplier name"
                      />
                    </div>
                  </div>

                  <Separator className="bg-white/20" />

                  {/* Barcode Section */}
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <Label htmlFor="barcode" className="text-white">Barcode</Label>
                      {barcodeSettings.autoGenerate && newProduct.name && (
                        <Button
                          type="button"
                          variant="outline"
                          size="sm"
                          onClick={regenerateBarcode}
                          className="bg-white/10 border-white/20 text-white hover:bg-white/20"
                        >
                          <RefreshCw className="h-3 w-3 mr-1" />
                          Regenerate
                        </Button>
                      )}
                    </div>
                    <Input
                      id="barcode"
                      value={newProduct.barcode}
                      onChange={(e) => handleProductChange('barcode', e.target.value)}
                      placeholder={barcodeSettings.autoGenerate ? "Auto-generated" : "Enter or scan barcode"}
                      disabled={barcodeSettings.autoGenerate}
                    />
                    {barcodeSettings.autoGenerate && (
                      <p className="text-xs text-blue-200">
                        Barcode is automatically generated based on your settings. 
                        You can regenerate it or disable auto-generation in settings.
                      </p>
                    )}
                  </div>

                  <Separator className="bg-white/20" />

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="price" className="text-white">Price (₹) *</Label>
                      <Input
                        id="price"
                        type="number"
                        value={newProduct.price}
                        onChange={(e) => handleProductChange('price', Number(e.target.value))}
                        placeholder="0"
                        min="0"
                        step="0.01"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="stock" className="text-white">Stock Quantity</Label>
                      <Input
                        id="stock"
                        type="number"
                        value={newProduct.stock}
                        onChange={(e) => handleProductChange('stock', Number(e.target.value))}
                        placeholder="0"
                        min="0"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="minStock" className="text-white">Min Stock Alert</Label>
                      <Input
                        id="minStock"
                        type="number"
                        value={newProduct.minStock}
                        onChange={(e) => handleProductChange('minStock', Number(e.target.value))}
                        placeholder="5"
                        min="0"
                      />
                    </div>
                  </div>

                  <div className="flex gap-3 pt-4">
                    <Button 
                      type="button" 
                      variant="outline" 
                      onClick={resetForm}
                      className="flex-1 bg-white/10 border-white/20 text-white hover:bg-white/20"
                    >
                      Reset
                    </Button>
                    <Button 
                      onClick={addProduct} 
                      className="flex-1 bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600"
                      disabled={createLoading}
                    >
                      {createLoading ? "Adding..." : "Add Product"}
                    </Button>
                  </div>
                </div>
              </DialogContent>
            </Dialog>
          </div>
        </CardContent>
      </Card>

      {/* Products Table */}
      <Card className="glass border-white/20">
        <CardHeader>
          <CardTitle className="text-white">Products ({products.length})</CardTitle>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="text-center py-8 text-blue-200">Loading products...</div>
          ) : products.length === 0 ? (
            <div className="text-center py-8 text-blue-200">
              {searchTerm.length >= 2 ? "No products found" : "No products available"}
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-white/20">
                    <th className="text-left p-3 text-blue-200">Product</th>
                    <th className="text-left p-3 text-blue-200">Barcode</th>
                    <th className="text-left p-3 text-blue-200">Price</th>
                    <th className="text-left p-3 text-blue-200">Stock</th>
                    <th className="text-left p-3 text-blue-200">Status</th>
                    <th className="text-left p-3 text-blue-200">Category</th>
                    <th className="text-left p-3 text-blue-200">Supplier</th>
                    <th className="text-left p-3 text-blue-200">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {products.map((product) => {
                    const status = getStockStatus(product.stock, product.minStock);
                    return (
                      <tr key={product.id} className="border-b border-white/10 hover:bg-white/5">
                        <td className="p-3">
                          <div>
                            <p className="font-medium text-white">{product.name}</p>
                            <p className="text-sm text-blue-200">{product.brand}</p>
                          </div>
                        </td>
                        <td className="p-3 text-sm font-mono text-blue-200">{product.barcode}</td>
                        <td className="p-3 font-medium text-white">₹{product.price}</td>
                        <td className="p-3">
                          <span className={`font-medium ${product.stock <= product.minStock ? 'text-red-300' : 'text-white'}`}>
                            {product.stock}
                          </span>
                          <span className="text-blue-200 text-sm"> / {product.minStock}</span>
                        </td>
                        <td className="p-3">
                          <Badge variant={status.color as any}>{status.label}</Badge>
                        </td>
                        <td className="p-3 text-sm text-blue-200">{product.category}</td>
                        <td className="p-3 text-sm text-blue-200">{product.supplier}</td>
                        <td className="p-3">
                          <div className="flex items-center gap-2">
                            <Button size="sm" variant="outline" className="bg-white/10 border-white/20 text-white hover:bg-white/20">
                              <Edit className="h-3 w-3" />
                            </Button>
                            <Button 
                              size="sm" 
                              variant="destructive"
                              onClick={() => handleDeleteProduct(product.id)}
                            >
                              <Trash2 className="h-3 w-3" />
                            </Button>
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Barcode Settings Dialog */}
      <Dialog open={showBarcodeSettings} onOpenChange={setShowBarcodeSettings}>
        <DialogContent className="glass border-white/20 max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2 text-white">
              <Settings className="h-5 w-5" />
              Barcode Generation Settings
            </DialogTitle>
          </DialogHeader>
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <Label htmlFor="autoGenerate" className="text-white">Auto-Generate Barcodes</Label>
                <p className="text-sm text-blue-200">Automatically create barcodes for new products</p>
              </div>
              <Switch
                id="autoGenerate"
                checked={barcodeSettings.autoGenerate}
                onCheckedChange={(checked) => updateBarcodeSettings({ autoGenerate: checked })}
              />
            </div>

            {barcodeSettings.autoGenerate && (
              <>
                <Separator className="bg-white/20" />
                
                <div className="space-y-2">
                  <Label className="text-white">Default Barcode Type</Label>
                  <Select 
                    value={barcodeSettings.defaultType} 
                    onValueChange={(value) => updateBarcodeSettings({ defaultType: value })}
                  >
                    <SelectTrigger className="bg-white/10 border-white/20 text-white">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {BARCODE_TYPES.map(type => (
                        <SelectItem key={type} value={type}>{type}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="prefix" className="text-white">Barcode Prefix (Optional)</Label>
                  <Input
                    id="prefix"
                    value={barcodeSettings.prefix}
                    onChange={(e) => updateBarcodeSettings({ prefix: e.target.value })}
                    placeholder="e.g., STORE"
                    maxLength={4}
                  />
                  <p className="text-xs text-blue-200">Add a custom prefix to all generated barcodes</p>
                </div>

                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <Label htmlFor="includeCategory" className="text-white">Include Category Code</Label>
                      <p className="text-sm text-blue-200">Use first 2 letters of category in barcode</p>
                    </div>
                    <Switch
                      id="includeCategory"
                      checked={barcodeSettings.includeCategory}
                      onCheckedChange={(checked) => updateBarcodeSettings({ includeCategory: checked })}
                    />
                  </div>

                  <div className="flex items-center justify-between">
                    <div>
                      <Label htmlFor="includeBrand" className="text-white">Include Brand Code</Label>
                      <p className="text-sm text-blue-200">Use first 2 letters of brand in barcode</p>
                    </div>
                    <Switch
                      id="includeBrand"
                      checked={barcodeSettings.includeBrand}
                      onCheckedChange={(checked) => updateBarcodeSettings({ includeBrand: checked })}
                    />
                  </div>
                </div>
              </>
            )}

            <div className="flex gap-3 pt-4">
              <Button 
                variant="outline" 
                onClick={() => setShowBarcodeSettings(false)}
                className="flex-1 bg-white/10 border-white/20 text-white hover:bg-white/20"
              >
                Cancel
              </Button>
              <Button 
                onClick={() => {
                  setShowBarcodeSettings(false);
                  toast({
                    title: "Settings Saved",
                    description: "Barcode generation settings have been updated."
                  });
                }}
                className="flex-1 bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600"
              >
                Save Settings
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default InventoryModule;