import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Plus } from "lucide-react";
import { SaleItem } from "@/lib/graphql/types";

interface ManualItemDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onAddItem: (item: SaleItem) => void;
}

export const ManualItemDialog = ({ open, onOpenChange, onAddItem }: ManualItemDialogProps) => {
  const [itemData, setItemData] = useState({
    name: "",
    price: "",
    quantity: "1",
    category: "",
    taxRate: "18"
  });

  const handleAddItem = () => {
    if (!itemData.name || !itemData.price) return;

    const newItem: SaleItem = {
      id: `manual-${Date.now()}`,
      productId: `manual-${Date.now()}`,
      productName: itemData.name,
      price: parseFloat(itemData.price),
      quantity: parseInt(itemData.quantity),
      discount: 0,
      total: parseFloat(itemData.price) * parseInt(itemData.quantity)
    };

    onAddItem(newItem);
    setItemData({
      name: "",
      price: "",
      quantity: "1",
      category: "",
      taxRate: "18"
    });
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="glass border-white/20 max-w-md">
        <DialogHeader>
          <DialogTitle className="text-white">Add Manual Item</DialogTitle>
        </DialogHeader>
        <div className="space-y-4">
          <div>
            <Label className="text-white">Item Name *</Label>
            <Input
              placeholder="Enter item name"
              value={itemData.name}
              onChange={(e) => setItemData({...itemData, name: e.target.value})}
              className="bg-white/10 border-white/20 text-white placeholder:text-blue-200"
            />
          </div>
          
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label className="text-white">Price *</Label>
              <Input
                type="number"
                placeholder="0.00"
                value={itemData.price}
                onChange={(e) => setItemData({...itemData, price: e.target.value})}
                className="bg-white/10 border-white/20 text-white placeholder:text-blue-200"
              />
            </div>
            
            <div>
              <Label className="text-white">Quantity</Label>
              <Input
                type="number"
                placeholder="1"
                value={itemData.quantity}
                onChange={(e) => setItemData({...itemData, quantity: e.target.value})}
                className="bg-white/10 border-white/20 text-white placeholder:text-blue-200"
              />
            </div>
          </div>
          
          <div>
            <Label className="text-white">Category</Label>
            <Select value={itemData.category} onValueChange={(value) => setItemData({...itemData, category: value})}>
              <SelectTrigger className="bg-white/10 border-white/20 text-white">
                <SelectValue placeholder="Select category" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="general">General</SelectItem>
                <SelectItem value="electronics">Electronics</SelectItem>
                <SelectItem value="accessories">Accessories</SelectItem>
                <SelectItem value="clothing">Clothing</SelectItem>
                <SelectItem value="food">Food & Beverages</SelectItem>
              </SelectContent>
            </Select>
          </div>
          
          <div>
            <Label className="text-white">Tax Rate (%)</Label>
            <Select value={itemData.taxRate} onValueChange={(value) => setItemData({...itemData, taxRate: value})}>
              <SelectTrigger className="bg-white/10 border-white/20 text-white">
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
          </div>
          
          <div className="flex gap-2 pt-4">
            <Button 
              variant="outline" 
              className="flex-1 bg-white/10 border-white/20 text-white hover:bg-white/20"
              onClick={() => onOpenChange(false)}
            >
              Cancel
            </Button>
            <Button 
              className="flex-1 bg-gradient-to-r from-blue-500 to-purple-500"
              onClick={handleAddItem}
              disabled={!itemData.name || !itemData.price}
            >
              <Plus className="h-4 w-4 mr-2" />
              Add Item
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};