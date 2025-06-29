
import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Save, Printer, Upload } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { SupplierPurchaseInfo } from "./SupplierPurchaseInfo";
import { BillUploadSection } from "./BillUploadSection";
import { ProductEntryPanel } from "./ProductEntryPanel";
import { BarcodeOptions } from "./BarcodeOptions";
import { PurchaseSummary } from "./PurchaseSummary";

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

const PurchaseEntryScreen = () => {
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

  const updatePurchaseData = (updates: Partial<PurchaseData>) => {
    setPurchaseData(prev => ({ ...prev, ...updates }));
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

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-4">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Button variant="outline" size="icon">
              <ArrowLeft className="h-4 w-4" />
            </Button>
            <div>
              <h1 className="text-2xl font-bold text-gray-900">New Purchase Entry</h1>
              <p className="text-gray-600">Record new stock from suppliers</p>
            </div>
          </div>
          <div className="flex gap-2">
            <Button variant="outline" onClick={() => handleSave(false)}>
              <Save className="h-4 w-4 mr-2" />
              Save Only
            </Button>
            <Button onClick={() => handleSave(true)}>
              <Printer className="h-4 w-4 mr-2" />
              Save & Print Barcodes
            </Button>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left Column - Main Entry */}
          <div className="lg:col-span-2 space-y-6">
            {/* Supplier & Purchase Info */}
            <Card>
              <CardHeader>
                <CardTitle>Supplier & Purchase Information</CardTitle>
              </CardHeader>
              <CardContent>
                <SupplierPurchaseInfo 
                  data={purchaseData}
                  onChange={updatePurchaseData}
                />
              </CardContent>
            </Card>

            {/* Bill Upload */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Upload className="h-5 w-5" />
                  Upload Supplier Bill
                </CardTitle>
              </CardHeader>
              <CardContent>
                <BillUploadSection
                  files={purchaseData.billFiles}
                  onFilesChange={(files) => updatePurchaseData({ billFiles: files })}
                />
              </CardContent>
            </Card>

            {/* Product Entry */}
            <Card>
              <CardHeader>
                <CardTitle>Product Entry</CardTitle>
              </CardHeader>
              <CardContent>
                <ProductEntryPanel
                  products={purchaseData.products}
                  onProductsChange={(products) => updatePurchaseData({ products })}
                />
              </CardContent>
            </Card>
          </div>

          {/* Right Column - Summary & Options */}
          <div className="space-y-6">
            {/* Barcode Options */}
            <Card>
              <CardHeader>
                <CardTitle>Barcode Printing Options</CardTitle>
              </CardHeader>
              <CardContent>
                <BarcodeOptions
                  options={purchaseData.barcodeOptions}
                  products={purchaseData.products}
                  onOptionsChange={(options) => updatePurchaseData({ barcodeOptions: options })}
                />
              </CardContent>
            </Card>

            {/* Purchase Summary */}
            <Card>
              <CardHeader>
                <CardTitle>Purchase Summary</CardTitle>
              </CardHeader>
              <CardContent>
                <PurchaseSummary
                  totals={calculateTotals()}
                  paymentType={purchaseData.paymentType}
                />
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PurchaseEntryScreen;
