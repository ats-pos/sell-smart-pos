import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  Plus, 
  Search, 
  Edit, 
  Trash2, 
  Package,
  AlertTriangle,
  Filter,
  Download,
  Barcode
} from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import BarcodeGenerator from "./BarcodeGenerator";
import { useGraphQLQuery, useGraphQLMutation } from "@/hooks/useGraphQL";
import { GET_PRODUCTS, SEARCH_PRODUCTS } from "@/lib/graphql/queries";
import { CREATE_PRODUCT, UPDATE_PRODUCT, DELETE_PRODUCT } from "@/lib/graphql/mutations";
import { Product, ProductInput } from "@/lib/graphql/types";
import { useToast } from "@/hooks/use-toast";

const InventoryModule = () => {
  const { toast } = useToast();
  const [searchTerm, setSearchTerm] = useState("");
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
        description: "Product has been added successfully."
      });
      refetchProducts();
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

  const addProduct = async () => {
    if (newProduct.name && newProduct.barcode && newProduct.price) {
      try {
        await createProduct({
          input: {
            ...newProduct,
            price: Number(newProduct.price),
            stock: Number(newProduct.stock),
            minStock: Number(newProduct.minStock),
            category: newProduct.category || "General",
            brand: newProduct.brand || "Generic",
            supplier: newProduct.supplier || "Unknown"
          }
        });
        
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
      } catch (error) {
        console.error("Error adding product:", error);
      }
    } else {
      toast({
        title: "Error",
        description: "Please fill in all required fields.",
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

  return (
    <div className="space-y-6">
      <Tabs defaultValue="inventory" className="space-y-6">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="inventory" className="flex items-center gap-2">
            <Package className="h-4 w-4" />
            Inventory Management
          </TabsTrigger>
          <TabsTrigger value="barcodes" className="flex items-center gap-2">
            <Barcode className="h-4 w-4" />
            Barcode Generator
          </TabsTrigger>
        </TabsList>

        <TabsContent value="inventory" className="space-y-6">
          {/* Header Stats */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <Card>
              <CardContent className="flex items-center p-4">
                <Package className="h-8 w-8 text-blue-500 mr-3" />
                <div>
                  <p className="text-2xl font-bold">{loading ? "..." : products.length}</p>
                  <p className="text-sm text-gray-500">Total Products</p>
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="flex items-center p-4">
                <AlertTriangle className="h-8 w-8 text-amber-500 mr-3" />
                <div>
                  <p className="text-2xl font-bold">{loading ? "..." : lowStockProducts.length}</p>
                  <p className="text-sm text-gray-500">Low Stock Items</p>
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="flex items-center p-4">
                <Package className="h-8 w-8 text-green-500 mr-3" />
                <div>
                  <p className="text-2xl font-bold">
                    {loading ? "..." : products.reduce((sum, p) => sum + p.stock, 0)}
                  </p>
                  <p className="text-sm text-gray-500">Total Stock</p>
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="flex items-center p-4">
                <Package className="h-8 w-8 text-purple-500 mr-3" />
                <div>
                  <p className="text-2xl font-bold">
                    ₹{loading ? "..." : products.reduce((sum, p) => sum + (p.price * p.stock), 0).toLocaleString()}
                  </p>
                  <p className="text-sm text-gray-500">Stock Value</p>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Actions Bar */}
          <Card>
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
                <Button variant="outline">
                  <Filter className="h-4 w-4 mr-2" />
                  Filter
                </Button>
              </div>
              <div className="flex items-center gap-2">
                <Button variant="outline">
                  <Download className="h-4 w-4 mr-2" />
                  Export
                </Button>
                <Dialog>
                  <DialogTrigger asChild>
                    <Button className="bg-blue-600 hover:bg-blue-700">
                      <Plus className="h-4 w-4 mr-2" />
                      Add Product
                    </Button>
                  </DialogTrigger>
                  <DialogContent className="max-w-md">
                    <DialogHeader>
                      <DialogTitle>Add New Product</DialogTitle>
                    </DialogHeader>
                    <div className="space-y-4">
                      <div>
                        <Label htmlFor="name">Product Name</Label>
                        <Input
                          id="name"
                          value={newProduct.name}
                          onChange={(e) => setNewProduct({...newProduct, name: e.target.value})}
                          placeholder="Enter product name"
                        />
                      </div>
                      <div>
                        <Label htmlFor="barcode">Barcode</Label>
                        <Input
                          id="barcode"
                          value={newProduct.barcode}
                          onChange={(e) => setNewProduct({...newProduct, barcode: e.target.value})}
                          placeholder="Enter barcode"
                        />
                      </div>
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <Label htmlFor="price">Price (₹)</Label>
                          <Input
                            id="price"
                            type="number"
                            value={newProduct.price}
                            onChange={(e) => setNewProduct({...newProduct, price: Number(e.target.value)})}
                            placeholder="0"
                          />
                        </div>
                        <div>
                          <Label htmlFor="stock">Stock</Label>
                          <Input
                            id="stock"
                            type="number"
                            value={newProduct.stock}
                            onChange={(e) => setNewProduct({...newProduct, stock: Number(e.target.value)})}
                            placeholder="0"
                          />
                        </div>
                      </div>
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <Label htmlFor="minStock">Min Stock</Label>
                          <Input
                            id="minStock"
                            type="number"
                            value={newProduct.minStock}
                            onChange={(e) => setNewProduct({...newProduct, minStock: Number(e.target.value)})}
                            placeholder="5"
                          />
                        </div>
                        <div>
                          <Label htmlFor="category">Category</Label>
                          <Select onValueChange={(value) => setNewProduct({...newProduct, category: value})}>
                            <SelectTrigger>
                              <SelectValue placeholder="Select category" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="Electronics">Electronics</SelectItem>
                              <SelectItem value="Accessories">Accessories</SelectItem>
                              <SelectItem value="Clothing">Clothing</SelectItem>
                              <SelectItem value="General">General</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                      </div>
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <Label htmlFor="brand">Brand</Label>
                          <Input
                            id="brand"
                            value={newProduct.brand}
                            onChange={(e) => setNewProduct({...newProduct, brand: e.target.value})}
                            placeholder="Enter brand name"
                          />
                        </div>
                        <div>
                          <Label htmlFor="supplier">Supplier</Label>
                          <Input
                            id="supplier"
                            value={newProduct.supplier}
                            onChange={(e) => setNewProduct({...newProduct, supplier: e.target.value})}
                            placeholder="Enter supplier name"
                          />
                        </div>
                      </div>
                      <Button 
                        onClick={addProduct} 
                        className="w-full"
                        disabled={createLoading}
                      >
                        {createLoading ? "Adding..." : "Add Product"}
                      </Button>
                    </div>
                  </DialogContent>
                </Dialog>
              </div>
            </CardContent>
          </Card>

          {/* Products Table */}
          <Card>
            <CardHeader>
              <CardTitle>Products ({products.length})</CardTitle>
            </CardHeader>
            <CardContent>
              {loading ? (
                <div className="text-center py-8">Loading products...</div>
              ) : products.length === 0 ? (
                <div className="text-center py-8 text-gray-500">
                  {searchTerm.length >= 2 ? "No products found" : "No products available"}
                </div>
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="border-b">
                        <th className="text-left p-3">Product</th>
                        <th className="text-left p-3">Barcode</th>
                        <th className="text-left p-3">Price</th>
                        <th className="text-left p-3">Stock</th>
                        <th className="text-left p-3">Status</th>
                        <th className="text-left p-3">Category</th>
                        <th className="text-left p-3">Supplier</th>
                        <th className="text-left p-3">Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {products.map((product) => {
                        const status = getStockStatus(product.stock, product.minStock);
                        return (
                          <tr key={product.id} className="border-b hover:bg-gray-50">
                            <td className="p-3">
                              <div>
                                <p className="font-medium">{product.name}</p>
                                <p className="text-sm text-gray-500">{product.brand}</p>
                              </div>
                            </td>
                            <td className="p-3 text-sm font-mono">{product.barcode}</td>
                            <td className="p-3 font-medium">₹{product.price}</td>
                            <td className="p-3">
                              <span className={`font-medium ${product.stock <= product.minStock ? 'text-red-600' : 'text-gray-900'}`}>
                                {product.stock}
                              </span>
                              <span className="text-gray-500 text-sm"> / {product.minStock}</span>
                            </td>
                            <td className="p-3">
                              <Badge variant={status.color as any}>{status.label}</Badge>
                            </td>
                            <td className="p-3 text-sm">{product.category}</td>
                            <td className="p-3 text-sm">{product.supplier}</td>
                            <td className="p-3">
                              <div className="flex items-center gap-2">
                                <Button size="sm" variant="outline">
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
        </TabsContent>

        <TabsContent value="barcodes">
          <BarcodeGenerator />
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default InventoryModule;