
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Upload } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { ProductEntry } from "./PurchaseEntryScreen";

interface BulkProductAddProps {
  onAdd: (product: Omit<ProductEntry, 'id'>) => void;
}

export const BulkProductAdd = ({ onAdd }: BulkProductAddProps) => {
  const { toast } = useToast();
  const [csvData, setCsvData] = useState<any[]>([]);
  const [isProcessing, setIsProcessing] = useState(false);

  const handleCSVUpload = (file: File) => {
    if (!file.name.endsWith('.csv')) {
      toast({
        title: "Invalid File",
        description: "Please upload a CSV file",
        variant: "destructive"
      });
      return;
    }

    const reader = new FileReader();
    reader.onload = (e) => {
      const csv = e.target?.result as string;
      const lines = csv.split('\n');
      const headers = lines[0].split(',');
      
      const data = lines.slice(1).map(line => {
        const values = line.split(',');
        const obj: any = {};
        headers.forEach((header, index) => {
          obj[header.trim()] = values[index]?.trim() || '';
        });
        return obj;
      }).filter(row => row['Item Name']); // Filter out empty rows

      setCsvData(data);
      toast({
        title: "CSV Uploaded",
        description: `${data.length} products found in CSV`,
      });
    };
    
    reader.readAsText(file);
  };

  const processCSVData = async () => {
    setIsProcessing(true);
    
    try {
      for (const row of csvData) {
        const product = {
          name: row['Item Name'] || '',
          category: row['Category'] || 'General',
          brand: row['Brand'] || '',
          sku: row['SKU'] || '',
          barcode: row['Barcode'] || '',
          quantity: parseInt(row['Quantity']) || 1,
          unit: row['Unit'] || 'pcs',
          costPrice: parseFloat(row['Cost Price']) || 0,
          sellingPrice: parseFloat(row['Selling Price']) || 0,
          gst: parseFloat(row['GST %']) || 18,
          gstInclusive: false,
          minStock: parseInt(row['Min Stock']) || 5,
          generateBarcode: !row['Barcode'] // Generate if not provided
        };

        if (product.name && product.costPrice > 0) {
          onAdd(product);
        }
      }

      toast({
        title: "Products Added",
        description: `${csvData.length} products added successfully`,
      });

      setCsvData([]);
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to process CSV data",
        variant: "destructive"
      });
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className="space-y-4">
      {/* CSV Upload */}
      <Card className="p-6">
        <div className="text-center space-y-4">
          <div className="border-2 border-dashed border-gray-300 rounded-lg p-6">
            <Upload className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <p className="text-lg font-medium">Upload CSV File</p>
            <p className="text-sm text-gray-600 mb-4">
              Upload a CSV file with product details for bulk entry
            </p>
            <Button onClick={() => document.getElementById('csv-input')?.click()}>
              Choose CSV File
            </Button>
          </div>
          
          <input
            id="csv-input"
            type="file"
            accept=".csv"
            className="hidden"
            onChange={(e) => {
              const file = e.target.files?.[0];
              if (file) handleCSVUpload(file);
            }}
          />
        </div>
      </Card>

      {/* CSV Preview */}
      {csvData.length > 0 && (
        <Card className="p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold">CSV Preview ({csvData.length} products)</h3>
            <Button onClick={processCSVData} disabled={isProcessing}>
              {isProcessing ? "Processing..." : "Import All Products"}
            </Button>
          </div>
          
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b">
                  <th className="text-left p-2">Item Name</th>
                  <th className="text-left p-2">Category</th>
                  <th className="text-left p-2">Quantity</th>
                  <th className="text-left p-2">Cost Price</th>
                  <th className="text-left p-2">Status</th>
                </tr>
              </thead>
              <tbody>
                {csvData.slice(0, 5).map((row, index) => (
                  <tr key={index} className="border-b">
                    <td className="p-2">{row['Item Name']}</td>
                    <td className="p-2">{row['Category']}</td>
                    <td className="p-2">{row['Quantity']}</td>
                    <td className="p-2">₹{row['Cost Price']}</td>
                    <td className="p-2">
                      <span className={`px-2 py-1 rounded text-xs ${
                        row['Item Name'] && row['Cost Price'] 
                          ? 'bg-green-100 text-green-800' 
                          : 'bg-red-100 text-red-800'
                      }`}>
                        {row['Item Name'] && row['Cost Price'] ? 'Valid' : 'Invalid'}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            {csvData.length > 5 && (
              <p className="text-sm text-gray-600 mt-2">
                ... and {csvData.length - 5} more rows
              </p>
            )}
          </div>
        </Card>
      )}
    </div>
  );
};
