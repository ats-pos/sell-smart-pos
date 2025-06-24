import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { 
  Printer, 
  Plus, 
  Download, 
  Edit,
  Trash2
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useApi, useApiMutation } from "@/hooks/useApi";
import apiClient, { BarcodeData } from "@/lib/api";

const BarcodeGenerator = () => {
  const { toast } = useToast();
  
  const [newBarcode, setNewBarcode] = useState({
    productName: "",
    sku: "",
    price: "",
    barcode: "",
    barcodeType: "EAN-13",
    brand: ""
  });

  // API hooks
  const { data: barcodes, loading: barcodesLoading, refetch: refetchBarcodes } = useApi(
    () => apiClient.getBarcodes(),
    []
  );

  const { mutate: createBarcodeMutation, loading: createLoading } = useApiMutation<BarcodeData>();
  const { mutate: deleteBarcodeMutation } = useApiMutation<void>();

  const barcodeTypes = ["EAN-13", "EAN-8", "UPC-A", "Code 128", "Code 39"];
  const barcodeList = barcodes || [];

  const generateBarcode = () => {
    // Generate a random barcode based on type
    let generatedBarcode = "";
    switch (newBarcode.barcodeType) {
      case "EAN-13":
        generatedBarcode = Math.random().toString().slice(2, 15);
        break;
      case "EAN-8":
        generatedBarcode = Math.random().toString().slice(2, 10);
        break;
      case "UPC-A":
        generatedBarcode = Math.random().toString().slice(2, 14);
        break;
      default:
        generatedBarcode = Math.random().toString(36).substring(2, 15).toUpperCase();
    }
    
    setNewBarcode({...newBarcode, barcode: generatedBarcode});
  };

  const addBarcode = async () => {
    if (newBarcode.productName && newBarcode.sku && newBarcode.price && newBarcode.barcode) {
      const barcodeData: Omit<BarcodeData, 'id'> = {
        productName: newBarcode.productName,
        sku: newBarcode.sku,
        price: parseFloat(newBarcode.price),
        barcode: newBarcode.barcode,
        barcodeType: newBarcode.barcodeType,
        brand: newBarcode.brand || "Generic"
      };
      
      const result = await createBarcodeMutation(apiClient.createBarcode)(barcodeData);
      
      if (result) {
        setNewBarcode({
          productName: "",
          sku: "",
          price: "",
          barcode: "",
          barcodeType: "EAN-13",
          brand: ""
        });
        refetchBarcodes();
        toast({
          title: "Barcode Generated",
          description: "New barcode created successfully."
        });
      } else {
        toast({
          title: "Error",
          description: "Failed to create barcode. Please try again.",
          variant: "destructive"
        });
      }
    } else {
      toast({
        title: "Error",
        description: "Please fill in all required fields.",
        variant: "destructive"
      });
    }
  };

  const printBarcode = (barcode: BarcodeData) => {
    console.log("Printing barcode:", barcode);
    toast({
      title: "Barcode Printed",
      description: `Barcode label for ${barcode.productName} sent to label printer.`
    });
  };

  const printBatch = () => {
    console.log("Batch printing barcodes:", barcodeList);
    toast({
      title: "Batch Print Started",
      description: `Printing ${barcodeList.length} barcode labels.`
    });
  };

  const deleteBarcode = async (id: number) => {
    const result = await deleteBarcodeMutation(apiClient.deleteBarcode)(id);
    
    if (result !== null) {
      refetchBarcodes();
      toast({
        title: "Barcode Deleted",
        description: "Barcode removed successfully."
      });
    } else {
      toast({
        title: "Error",
        description: "Failed to delete barcode. Please try again.",
        variant: "destructive"
      });
    }
  };

  return (
    <div className="space-y-6">
      {/* Header Actions */}
      <Card>
        <CardContent className="flex items-center justify-between p-4">
          <div>
            <h3 className="text-lg font-semibold">Barcode Management</h3>
            <p className="text-sm text-gray-500">Generate and print product barcodes</p>
          </div>
          <div className="flex items-center gap-2">
            <Button variant="outline" onClick={printBatch} disabled={barcodeList.length === 0}>
              <Printer className="h-4 w-4 mr-2" />
              Batch Print ({barcodeList.length})
            </Button>
            <Dialog>
              <DialogTrigger asChild>
                <Button className="bg-blue-600 hover:bg-blue-700">
                  <Plus className="h-4 w-4 mr-2" />
                  Generate Barcode
                </Button>
              </DialogTrigger>
              <DialogContent className="max-w-md">
                <DialogHeader>
                  <DialogTitle>Generate New Barcode</DialogTitle>
                </DialogHeader>
                <div className="space-y-4">
                  <div>
                    <Label htmlFor="productName">Product Name</Label>
                    <Input
                      id="productName"
                      value={newBarcode.productName}
                      onChange={(e) => setNewBarcode({...newBarcode, productName: e.target.value})}
                      placeholder="Enter product name"
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="sku">SKU</Label>
                      <Input
                        id="sku"
                        value={newBarcode.sku}
                        onChange={(e) => setNewBarcode({...newBarcode, sku: e.target.value})}
                        placeholder="SKU001"
                      />
                    </div>
                    <div>
                      <Label htmlFor="price">Price (₹)</Label>
                      <Input
                        id="price"
                        type="number"
                        value={newBarcode.price}
                        onChange={(e) => setNewBarcode({...newBarcode, price: e.target.value})}
                        placeholder="0"
                      />
                    </div>
                  </div>
                  <div>
                    <Label htmlFor="brand">Brand</Label>
                    <Input
                      id="brand"
                      value={newBarcode.brand}
                      onChange={(e) => setNewBarcode({...newBarcode, brand: e.target.value})}
                      placeholder="Brand name"
                    />
                  </div>
                  <div>
                    <Label htmlFor="barcodeType">Barcode Type</Label>
                    <Select 
                      value={newBarcode.barcodeType} 
                      onValueChange={(value) => setNewBarcode({...newBarcode, barcodeType: value})}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select barcode type" />
                      </SelectTrigger>
                      <SelectContent>
                        {barcodeTypes.map(type => (
                          <SelectItem key={type} value={type}>{type}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <Label htmlFor="barcode">Barcode</Label>
                    <div className="flex gap-2">
                      <Input
                        id="barcode"
                        value={newBarcode.barcode}
                        onChange={(e) => setNewBarcode({...newBarcode, barcode: e.target.value})}
                        placeholder="Enter or generate barcode"
                      />
                      <Button variant="outline" onClick={generateBarcode}>
                        Generate
                      </Button>
                    </div>
                  </div>
                  <Button 
                    onClick={addBarcode} 
                    className="w-full"
                    disabled={createLoading}
                  >
                    {createLoading ? "Creating..." : "Create Barcode"}
                  </Button>
                </div>
              </DialogContent>
            </Dialog>
          </div>
        </CardContent>
      </Card>

      {/* Barcode List */}
      <Card>
        <CardHeader>
          <CardTitle>Generated Barcodes ({barcodeList.length})</CardTitle>
        </CardHeader>
        <CardContent>
          {barcodesLoading ? (
            <div className="text-center py-8">Loading barcodes...</div>
          ) : barcodeList.length === 0 ? (
            <div className="text-center py-8 text-gray-500">No barcodes generated yet</div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {barcodeList.map((barcode) => (
                <div key={barcode.id} className="border rounded-lg p-4 space-y-3">
                  <div className="flex items-center justify-between">
                    <Badge variant="outline">{barcode.barcodeType}</Badge>
                    <div className="flex items-center gap-1">
                      <Button size="sm" variant="outline">
                        <Edit className="h-3 w-3" />
                      </Button>
                      <Button 
                        size="sm" 
                        variant="destructive" 
                        onClick={() => deleteBarcode(barcode.id)}
                      >
                        <Trash2 className="h-3 w-3" />
                      </Button>
                    </div>
                  </div>
                  
                  <div>
                    <h4 className="font-medium">{barcode.productName}</h4>
                    <p className="text-sm text-gray-500">{barcode.brand}</p>
                    <p className="text-sm">SKU: {barcode.sku}</p>
                    <p className="text-sm font-medium">₹{barcode.price}</p>
                  </div>
                  
                  {/* Barcode visualization (placeholder) */}
                  <div className="bg-gray-100 p-3 rounded text-center">
                    <div className="bg-black text-white text-xs py-1 px-2 inline-block mb-2">
                      BARCODE
                    </div>
                    <p className="font-mono text-xs">{barcode.barcode}</p>
                  </div>
                  
                  <div className="flex gap-2">
                    <Button size="sm" className="flex-1" onClick={() => printBarcode(barcode)}>
                      <Printer className="h-3 w-3 mr-1" />
                      Print
                    </Button>
                    <Button size="sm" variant="outline">
                      <Download className="h-3 w-3" />
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default BarcodeGenerator;