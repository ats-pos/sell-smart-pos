import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { 
  ArrowLeft, 
  Save, 
  Printer, 
  Upload,
  Plus,
  Trash2,
  Edit,
  Download,
  RefreshCw,
  Package
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";
import { DefaultHeader } from "@/components/common/DefaultHeader";
import { generateBarcode } from "@/lib/utils/helpers";

export interface ProductEntry {
  id: string;
  name: string;
  category: string;
  brand: string;
  sku: string;
  barcode: string;
  quantity: number;
  unit: string;
  costPrice: number;
  sellingPrice: number;
  gst: number;
  gstInclusive: boolean;
  minStock: number;
  generateBarcode: boolean;
}

export interface PurchaseData {
  supplier: {
    name: string;
    id?: string;
  };
  invoiceNumber: string;
  purchaseDate: string;
  paymentType: 'cash' | 'upi' | 'bank' | 'credit';
  notes: string;
  billFiles: File[];
  products: ProductEntry[];
  barcodeOptions: {
    printAll: boolean;
    selectedItems: string[];
    labelSize: string;
    includePrice: boolean;
    includeName: boolean;
  };
}

const PurchaseEntryScreen = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  
  const [purchaseData, setPurchaseData] = useState<PurchaseData>({
    supplier: { name: '' },
    invoiceNumber: '',
    purchaseDate: new Date().toISOString().split('T')[0],
    paymentType: 'cash',
    notes: '',
    billFiles: [],
    products: [],
    barcodeOptions: {
      printAll: false,
      selectedItems: [],
      labelSize: '2x1',
      includePrice: true,
      includeName: true
    }
  });

  const [newProduct, setNewProduct] = useState({
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

  const [editingProduct, setEditingProduct] = useState<string | null>(null);

  const categories = ["Electronics", "Accessories", "Clothing", "Home & Garden", "Sports", "Books", "General"];
  const units = ["pcs", "set", "kg", "liter", "meter", "box", "pair"];
  const suppliers = [
    "ABC Electronics Pvt. Ltd.",
    "XYZ Trading Company", 
    "Global Suppliers Inc.",
    "Local Wholesale Market"
  ];

  const updatePurchaseData = (updates: Partial<PurchaseData>) => {
    setPurchaseData(prev => ({ ...prev, ...updates }));
  };

  const handleProductChange = (field: string, value: any) => {
    setNewProduct(prev => {
      const updated = { ...prev, [field]: value };
      
      // Auto-generate barcode when name changes and auto-generation is enabled
      if (field === 'name' && updated.generateBarcode && value) {
        updated.barcode = generateBarcode('EAN-13');
      }
      
      return updated;
    });
  };

  const addProduct = () => {
    if (!newProduct.name || !newProduct.costPrice) {
      toast({
        title: "Validation Error",
        description: "Please fill in product name and cost price",
        variant: "destructive"
      });
      return;
    }

    const productEntry: ProductEntry = {
      ...newProduct,
      id: Date.now().toString()
    };

    setPurchaseData(prev => ({
      ...prev,
      products: [...prev.products, productEntry]
    }));

    // Reset form
    setNewProduct({
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

    toast({
      title: "Product Added",
      description: "Product has been added to the purchase order"
    });
  };

  const removeProduct = (id: string) => {
    setPurchaseData(prev => ({
      ...prev,
      products: prev.products.filter(p => p.id !== id)
    }));
  };

  const editProduct = (id: string) => {
    const product = purchaseData.products.find(p => p.id === id);
    if (product) {
      setNewProduct(product);
      setEditingProduct(id);
    }
  };

  const updateProduct = () => {
    if (!newProduct.name || !newProduct.costPrice) {
      toast({
        title: "Validation Error",
        description: "Please fill in product name and cost price",
        variant: "destructive"
      });
      return;
    }

    setPurchaseData(prev => ({
      ...prev,
      products: prev.products.map(p => 
        p.id === editingProduct ? { ...newProduct, id: editingProduct } : p
      )
    }));

    // Reset form
    setNewProduct({
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
    setEditingProduct(null);

    toast({
      title: "Product Updated",
      description: "Product has been updated successfully"
    });
  };

  const cancelEdit = () => {
    setNewProduct({
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
    setEditingProduct(null);
  };

  const regenerateBarcode = () => {
    setNewProduct(prev => ({ ...prev, barcode: generateBarcode('EAN-13') }));
  };

  const calculateTotals = () => {
    const subtotal = purchaseData.products.reduce((sum, product) => 
      sum + (product.costPrice * product.quantity), 0
    );
    
    const gstTotal = purchaseData.products.reduce((sum, product) => {
      const itemTotal = product.costPrice * product.quantity;
      const gstAmount = product.gstInclusive 
        ? itemTotal - (itemTotal / (1 + product.gst / 100))
        : itemTotal * (product.gst / 100);
      return sum + gstAmount;
    }, 0);

    const grandTotal = purchaseData.products.reduce((sum, product) => {
      const itemTotal = product.costPrice * product.quantity;
      return sum + (product.gstInclusive ? itemTotal : itemTotal * (1 + product.gst / 100));
    }, 0);

    return { subtotal, gstTotal, grandTotal };
  };

  const handleSave = async (printBarcodes = false) => {
    try {
      // Validate required fields
      if (!purchaseData.supplier.name || !purchaseData.invoiceNumber) {
        toast({
          title: "Validation Error",
          description: "Please fill in supplier name and invoice number",
          variant: "destructive"
        });
        return;
      }

      if (purchaseData.products.length === 0) {
        toast({
          title: "Validation Error", 
          description: "Please add at least one product",
          variant: "destructive"
        });
        return;
      }

      // Here you would typically save to your backend/database
      console.log('Saving purchase data:', purchaseData);

      toast({
        title: "Purchase Saved",
        description: `Purchase entry saved successfully${printBarcodes ? ' and barcodes queued for printing' : ''}`,
      });

      if (printBarcodes) {
        // Handle barcode printing
        console.log('Printing barcodes for:', purchaseData.barcodeOptions);
      }

    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to save purchase entry",
        variant: "destructive"
      });
    }
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

  const totals = calculateTotals();

  const customActions = (
    <div className="flex items-center gap-2">
      <Button 
        variant="outline" 
        onClick={() => handleSave(false)}
        className="bg-white/10 border-white/20 text-white hover:bg-white/20 h-8 px-3 text-xs"
      >
        <Save className="h-3 w-3 mr-1" />
        Save
      </Button>
      <Button 
        onClick={() => handleSave(true)}
        className="bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600 h-8 px-3 text-xs"
      >
        <Printer className="h-3 w-3 mr-1" />
        Save & Print
      </Button>
      <Button 
        variant="ghost" 
        size="sm"
        onClick={() => navigate('/admin')}
        className="p-2 text-white hover:bg-white/10"
      >
        <ArrowLeft className="h-5 w-5" />
      </Button>
    </div>
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
      {/* Animated background elements */}
      <div className="fixed inset-0 opacity-10 pointer-events-none">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-blue-400 rounded-full mix-blend-multiply filter blur-xl animate-float"></div>
        <div className="absolute top-3/4 right-1/4 w-96 h-96 bg-purple-400 rounded-full mix-blend-multiply filter blur-xl animate-float delay-1000"></div>
      </div>

      {/* Default Header */}
      <DefaultHeader 
        title="Purchase Entry"
        subtitle="Record new stock from suppliers"
        showUserInfo={false}
        showSettings={false}
        showLogout={true}
        customActions={customActions}
      />

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left Column - Main Entry */}
          <div className="lg:col-span-2 space-y-6">
            {/* Supplier & Purchase Info */}
            <Card className="glass border-white/20">
              <CardHeader>
                <CardTitle className="text-white">Supplier & Purchase Information</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="supplier" className="text-white">Supplier Name *</Label>
                    <div className="flex gap-2">
                      <Select 
                        value={purchaseData.supplier.name} 
                        onValueChange={(value) => updatePurchaseData({ supplier: { name: value } })}
                      >
                        <SelectTrigger className="flex-1 bg-white/10 border-white/20 text-white">
                          <SelectValue placeholder="Select supplier" />
                        </SelectTrigger>
                        <SelectContent>
                          {suppliers.map(supplier => (
                            <SelectItem key={supplier} value={supplier}>{supplier}</SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <Button variant="outline" size="icon" className="bg-white/10 border-white/20 text-white hover:bg-white/20">
                        <Plus className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="invoiceNumber" className="text-white">Purchase Invoice Number *</Label>
                    <Input
                      id="invoiceNumber"
                      value={purchaseData.invoiceNumber}
                      onChange={(e) => updatePurchaseData({ invoiceNumber: e.target.value })}
                      placeholder="Enter invoice/bill number"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="purchaseDate" className="text-white">Purchase Date</Label>
                    <Input
                      id="purchaseDate"
                      type="date"
                      value={purchaseData.purchaseDate}
                      onChange={(e) => updatePurchaseData({ purchaseDate: e.target.value })}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="paymentType" className="text-white">Payment Type</Label>
                    <Select 
                      value={purchaseData.paymentType} 
                      onValueChange={(value: any) => updatePurchaseData({ paymentType: value })}
                    >
                      <SelectTrigger className="bg-white/10 border-white/20 text-white">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="cash">Cash</SelectItem>
                        <SelectItem value="upi">UPI</SelectItem>
                        <SelectItem value="bank">Bank Transfer</SelectItem>
                        <SelectItem value="credit">Credit</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="notes" className="text-white">Notes (Optional)</Label>
                  <Textarea
                    id="notes"
                    value={purchaseData.notes}
                    onChange={(e) => updatePurchaseData({ notes: e.target.value })}
                    placeholder="Any additional remarks or notes"
                    rows={3}
                    className="bg-white/10 border-white/20 text-white placeholder:text-blue-200"
                  />
                </div>
              </CardContent>
            </Card>

            {/* Product Entry Form */}
            <Card className="glass border-white/20">
              <CardHeader>
                <div className="flex justify-between items-center">
                  <CardTitle className="text-white">
                    {editingProduct ? 'Edit Product' : 'Add Product'}
                  </CardTitle>
                  <Button variant="outline" onClick={downloadTemplate} className="bg-white/10 border-white/20 text-white hover:bg-white/20">
                    <Download className="h-4 w-4 mr-2" />
                    CSV Template
                  </Button>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
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
                    <Select value={newProduct.category} onValueChange={(value) => handleProductChange('category', value)}>
                      <SelectTrigger className="bg-white/10 border-white/20 text-white">
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
                    <Label htmlFor="brand" className="text-white">Brand</Label>
                    <Input
                      id="brand"
                      value={newProduct.brand}
                      onChange={(e) => handleProductChange('brand', e.target.value)}
                      placeholder="Enter brand name"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="sku" className="text-white">SKU / Code</Label>
                    <Input
                      id="sku"
                      value={newProduct.sku}
                      onChange={(e) => handleProductChange('sku', e.target.value)}
                      placeholder="Enter SKU (optional)"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="quantity" className="text-white">Qty Purchased *</Label>
                    <Input
                      id="quantity"
                      type="number"
                      value={newProduct.quantity}
                      onChange={(e) => handleProductChange('quantity', Number(e.target.value))}
                      min="1"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="unit" className="text-white">Unit</Label>
                    <Select value={newProduct.unit} onValueChange={(value) => handleProductChange('unit', value)}>
                      <SelectTrigger className="bg-white/10 border-white/20 text-white">
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
                    <Label htmlFor="costPrice" className="text-white">Unit Cost (₹) *</Label>
                    <Input
                      id="costPrice"
                      type="number"
                      value={newProduct.costPrice}
                      onChange={(e) => handleProductChange('costPrice', Number(e.target.value))}
                      placeholder="0"
                      min="0"
                      step="0.01"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="sellingPrice" className="text-white">Selling Price (₹)</Label>
                    <Input
                      id="sellingPrice"
                      type="number"
                      value={newProduct.sellingPrice}
                      onChange={(e) => handleProductChange('sellingPrice', Number(e.target.value))}
                      placeholder="0"
                      min="0"
                      step="0.01"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="gst" className="text-white">Tax (%)</Label>
                    <div className="flex items-center gap-2">
                      <Select value={newProduct.gst.toString()} onValueChange={(value) => handleProductChange('gst', Number(value))}>
                        <SelectTrigger className="flex-1 bg-white/10 border-white/20 text-white">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="0">0% (Exempt)</SelectItem>
                          <SelectItem value="5">5% (Essential)</SelectItem>
                          <SelectItem value="12">12% (Standard)</SelectItem>
                          <SelectItem value="18">18% (Standard)</SelectItem>
                          <SelectItem value="28">28% (Luxury)</SelectItem>
                        </SelectContent>
                      </Select>
                      <div className="flex items-center gap-2">
                        <span className="text-sm text-white">Inclusive</span>
                        <Switch
                          checked={newProduct.gstInclusive}
                          onCheckedChange={(checked) => handleProductChange('gstInclusive', checked)}
                        />
                      </div>
                    </div>
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

                {/* Barcode Section */}
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <Label htmlFor="barcode" className="text-white">Barcode</Label>
                    <div className="flex items-center gap-2">
                      <span className="text-sm text-white">Auto-generate</span>
                      <Switch
                        checked={newProduct.generateBarcode}
                        onCheckedChange={(checked) => handleProductChange('generateBarcode', checked)}
                      />
                      {newProduct.generateBarcode && (
                        <Button variant="outline" size="sm" onClick={regenerateBarcode} className="bg-white/10 border-white/20 text-white hover:bg-white/20">
                          <RefreshCw className="h-3 w-3" />
                        </Button>
                      )}
                    </div>
                  </div>
                  <Input
                    id="barcode"
                    value={newProduct.barcode}
                    onChange={(e) => handleProductChange('barcode', e.target.value)}
                    placeholder="Barcode will be auto-generated"
                    disabled={newProduct.generateBarcode}
                  />
                  {newProduct.barcode && (
                    <div className="flex items-center gap-2">
                      <Badge variant="outline" className="text-white border-white/30">{newProduct.barcode}</Badge>
                      <span className="text-xs text-blue-200">Barcode Preview</span>
                    </div>
                  )}
                </div>

                <div className="flex gap-3 pt-4">
                  {editingProduct && (
                    <Button 
                      variant="outline" 
                      onClick={cancelEdit}
                      className="flex-1 bg-white/10 border-white/20 text-white hover:bg-white/20"
                    >
                      Cancel
                    </Button>
                  )}
                  <Button 
                    onClick={editingProduct ? updateProduct : addProduct} 
                    className="flex-1 bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600"
                    disabled={!newProduct.name || !newProduct.costPrice}
                  >
                    <Plus className="h-4 w-4 mr-2" />
                    {editingProduct ? 'Update Product' : 'Add Product'}
                  </Button>
                </div>
              </CardContent>
            </Card>

            {/* Product List Table */}
            {purchaseData.products.length > 0 && (
              <Card className="glass border-white/20">
                <CardHeader>
                  <CardTitle className="text-white">Added Products ({purchaseData.products.length})</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="overflow-x-auto">
                    <table className="w-full">
                      <thead>
                        <tr className="border-b border-white/20">
                          <th className="text-left p-3 text-blue-200">Item Name</th>
                          <th className="text-left p-3 text-blue-200">SKU</th>
                          <th className="text-left p-3 text-blue-200">Category</th>
                          <th className="text-left p-3 text-blue-200">Qty</th>
                          <th className="text-left p-3 text-blue-200">Unit Cost</th>
                          <th className="text-left p-3 text-blue-200">Selling Price</th>
                          <th className="text-left p-3 text-blue-200">Tax</th>
                          <th className="text-left p-3 text-blue-200">Total</th>
                          <th className="text-left p-3 text-blue-200">Actions</th>
                        </tr>
                      </thead>
                      <tbody>
                        {purchaseData.products.map((product) => {
                          const itemTotal = product.costPrice * product.quantity;
                          const gstAmount = product.gstInclusive 
                            ? itemTotal - (itemTotal / (1 + product.gst / 100))
                            : itemTotal * (product.gst / 100);
                          const total = product.gstInclusive ? itemTotal : itemTotal + gstAmount;

                          return (
                            <tr key={product.id} className="border-b border-white/10 hover:bg-white/5">
                              <td className="p-3">
                                <div>
                                  <p className="font-medium text-white">{product.name}</p>
                                  <p className="text-sm text-blue-200">{product.brand}</p>
                                </div>
                              </td>
                              <td className="p-3 text-sm text-blue-200">{product.sku || '-'}</td>
                              <td className="p-3 text-sm text-blue-200">{product.category}</td>
                              <td className="p-3 text-white">{product.quantity} {product.unit}</td>
                              <td className="p-3 text-white">₹{product.costPrice}</td>
                              <td className="p-3 text-white">₹{product.sellingPrice || '-'}</td>
                              <td className="p-3 text-white">{product.gst}%</td>
                              <td className="p-3 font-medium text-white">₹{total.toFixed(2)}</td>
                              <td className="p-3">
                                <div className="flex items-center gap-2">
                                  <Button 
                                    size="sm" 
                                    variant="outline" 
                                    onClick={() => editProduct(product.id)}
                                    className="bg-white/10 border-white/20 text-white hover:bg-white/20"
                                  >
                                    <Edit className="h-3 w-3" />
                                  </Button>
                                  <Button 
                                    size="sm" 
                                    variant="destructive"
                                    onClick={() => removeProduct(product.id)}
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
                </CardContent>
              </Card>
            )}
          </div>

          {/* Right Column - Summary */}
          <div className="space-y-6">
            {/* Purchase Summary */}
            <Card className="glass border-white/20">
              <CardHeader>
                <CardTitle className="text-white">Purchase Summary</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-3">
                  <div className="flex justify-between">
                    <span className="text-blue-200">Subtotal:</span>
                    <span className="font-medium text-white">₹{totals.subtotal.toFixed(2)}</span>
                  </div>
                  
                  <div className="flex justify-between">
                    <span className="text-blue-200">GST Total:</span>
                    <span className="font-medium text-white">₹{totals.gstTotal.toFixed(2)}</span>
                  </div>
                  
                  <div className="border-t border-white/20 pt-3">
                    <div className="flex justify-between text-lg font-bold">
                      <span className="text-white">Grand Total:</span>
                      <span className="text-white">₹{totals.grandTotal.toFixed(2)}</span>
                    </div>
                  </div>
                </div>

                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <Label className="text-white">Payment Type:</Label>
                    <Badge variant="outline" className="capitalize text-white border-white/30">{purchaseData.paymentType}</Badge>
                  </div>

                  {purchaseData.paymentType === 'credit' && (
                    <>
                      <div className="space-y-2">
                        <Label htmlFor="paidAmount" className="text-white">Paid Amount (₹)</Label>
                        <Input
                          id="paidAmount"
                          type="number"
                          placeholder="0"
                          min="0"
                          step="0.01"
                        />
                      </div>
                      
                      <div className="flex justify-between text-sm">
                        <span className="text-blue-200">Due Amount:</span>
                        <span className="font-medium text-red-300">₹{totals.grandTotal.toFixed(2)}</span>
                      </div>
                    </>
                  )}
                </div>

                <div className="mt-6 p-4 bg-blue-50/10 rounded-lg border border-blue-200/20">
                  <h4 className="font-medium text-white mb-2">Purchase Summary</h4>
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div>
                      <span className="text-blue-200">Total Items:</span>
                      <div className="font-medium text-white">{purchaseData.products.length}</div>
                    </div>
                    <div>
                      <span className="text-blue-200">Avg. Cost:</span>
                      <div className="font-medium text-white">
                        ₹{purchaseData.products.length > 0 ? (totals.subtotal / purchaseData.products.reduce((sum, p) => sum + p.quantity, 0)).toFixed(2) : '0'}
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Barcode Options */}
            <Card className="glass border-white/20">
              <CardHeader>
                <CardTitle className="text-white">Barcode Printing Options</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <Label htmlFor="printAll" className="text-white">Print All New Items</Label>
                    <p className="text-sm text-blue-200">Generate barcodes for all added products</p>
                  </div>
                  <Switch
                    id="printAll"
                    checked={purchaseData.barcodeOptions.printAll}
                    onCheckedChange={(checked) => updatePurchaseData({ 
                      barcodeOptions: { ...purchaseData.barcodeOptions, printAll: checked }
                    })}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="labelSize" className="text-white">Label Size</Label>
                  <Select 
                    value={purchaseData.barcodeOptions.labelSize} 
                    onValueChange={(value) => updatePurchaseData({ 
                      barcodeOptions: { ...purchaseData.barcodeOptions, labelSize: value }
                    })}
                  >
                    <SelectTrigger className="bg-white/10 border-white/20 text-white">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="2x1">2" x 1"</SelectItem>
                      <SelectItem value="3x1">3" x 1"</SelectItem>
                      <SelectItem value="4x2">4" x 2"</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-3">
                  <Label className="text-white">Include on Label:</Label>
                  
                  <div className="flex items-center justify-between">
                    <Label htmlFor="includeName" className="text-white">Product Name</Label>
                    <Switch
                      id="includeName"
                      checked={purchaseData.barcodeOptions.includeName}
                      onCheckedChange={(checked) => updatePurchaseData({ 
                        barcodeOptions: { ...purchaseData.barcodeOptions, includeName: checked }
                      })}
                    />
                  </div>

                  <div className="flex items-center justify-between">
                    <Label htmlFor="includePrice" className="text-white">Price</Label>
                    <Switch
                      id="includePrice"
                      checked={purchaseData.barcodeOptions.includePrice}
                      onCheckedChange={(checked) => updatePurchaseData({ 
                        barcodeOptions: { ...purchaseData.barcodeOptions, includePrice: checked }
                      })}
                    />
                  </div>
                </div>

                {/* Preview */}
                <div className="border rounded-lg p-4 bg-white/5 border-white/20">
                  <Label className="text-white">Label Preview:</Label>
                  <div className="mt-2 border-2 border-dashed border-white/30 rounded p-4 text-center text-sm">
                    <div className="space-y-1">
                      {purchaseData.barcodeOptions.includeName && <div className="font-medium text-white">Sample Product Name</div>}
                      <div className="font-mono text-xs text-blue-200">||||| |||| |||||</div>
                      <div className="text-xs text-blue-200">1234567890123</div>
                      {purchaseData.barcodeOptions.includePrice && <div className="font-bold text-white">₹299.00</div>}
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </main>
    </div>
  );
};

export default PurchaseEntryScreen;