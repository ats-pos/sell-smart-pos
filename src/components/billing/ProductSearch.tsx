import { useState, useEffect } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { 
  Search, 
  Plus, 
  ScanLine,
  Bluetooth,
  Filter,
  X
} from "lucide-react";
import { useGraphQLQuery } from "@/hooks/useGraphQL";
import { GET_PRODUCTS, SEARCH_PRODUCTS } from "@/lib/graphql/queries";
import { Product } from "@/lib/graphql/types";

interface ProductSearchProps {
  onProductSelect: (product: Product) => void;
  onAddManualItem: () => void;
}

export const ProductSearch = ({ onProductSelect, onAddManualItem }: ProductSearchProps) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [searchCriteria, setSearchCriteria] = useState("all");
  const [showAdvancedSearch, setShowAdvancedSearch] = useState(false);
  const [showSearchResults, setShowSearchResults] = useState(false);
  const [advancedFilters, setAdvancedFilters] = useState({
    category: "",
    brand: "",
    priceMin: "",
    priceMax: "",
    stockMin: ""
  });

  const { data: productsData, loading: productsLoading } = useGraphQLQuery<{
    products: Product[];
  }>(GET_PRODUCTS, {
    variables: { limit: 50 }
  });

  const { data: searchData, loading: searchLoading } = useGraphQLQuery<{
    searchProducts: Product[];
  }>(SEARCH_PRODUCTS, {
    variables: { query: searchTerm },
    skip: !searchTerm || searchTerm.length < 2
  });

  useEffect(() => {
    if (searchTerm.length >= 2) {
      setShowSearchResults(true);
    } else {
      setShowSearchResults(false);
    }
  }, [searchTerm]);

  const getFilteredProducts = () => {
    if (!searchTerm || searchTerm.length < 2) return [];
    
    const searchResults = searchData?.searchProducts || [];
    const allProducts = productsData?.products || [];
    
    let products = searchResults.length > 0 ? searchResults : allProducts;
    
    // Apply search criteria filter
    if (searchCriteria !== "all") {
      products = products.filter(product => {
        switch (searchCriteria) {
          case "name":
            return product.name.toLowerCase().includes(searchTerm.toLowerCase());
          case "barcode":
            return product.barcode.includes(searchTerm);
          case "brand":
            return product.brand.toLowerCase().includes(searchTerm.toLowerCase());
          case "category":
            return product.category.toLowerCase().includes(searchTerm.toLowerCase());
          default:
            return true;
        }
      });
    } else {
      products = products.filter(product =>
        product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        product.barcode.includes(searchTerm) ||
        product.brand.toLowerCase().includes(searchTerm.toLowerCase()) ||
        product.category.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Apply advanced filters
    if (advancedFilters.category && advancedFilters.category !== "any") {
      products = products.filter(p => p.category === advancedFilters.category);
    }
    if (advancedFilters.brand) {
      products = products.filter(p => p.brand === advancedFilters.brand);
    }
    if (advancedFilters.priceMin) {
      products = products.filter(p => p.price >= parseFloat(advancedFilters.priceMin));
    }
    if (advancedFilters.priceMax) {
      products = products.filter(p => p.price <= parseFloat(advancedFilters.priceMax));
    }
    if (advancedFilters.stockMin) {
      products = products.filter(p => p.stock >= parseInt(advancedFilters.stockMin));
    }

    return products.slice(0, 20);
  };

  const filteredProducts = getFilteredProducts();
  const loading = searchTerm.length >= 2 ? searchLoading : productsLoading;

  const handleProductSelect = (product: Product) => {
    onProductSelect(product);
    setSearchTerm("");
    setShowSearchResults(false);
  };

  const clearAdvancedFilters = () => {
    setAdvancedFilters({
      category: "",
      brand: "",
      priceMin: "",
      priceMax: "",
      stockMin: ""
    });
  };

  return (
    <>
      <Card className="glass border-white/20">
        <CardContent className="p-4">
          <div className="space-y-4">
            {/* Main Search Bar */}
            <div className="flex gap-2">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                <Input
                  placeholder="Search products..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10 bg-white/10 border-white/20 text-white placeholder:text-blue-200"
                />
                <Button 
                  variant="outline" 
                  size="icon" 
                  className="absolute right-2 top-1 h-8 w-8 bg-white/10 border-white/20 text-white hover:bg-white/20"
                >
                  <ScanLine className="h-4 w-4" />
                </Button>
              </div>
              <Button 
                variant="outline" 
                size="icon" 
                className="bg-white/10 border-white/20 text-white hover:bg-white/20"
                onClick={() => setShowAdvancedSearch(true)}
              >
                <Filter className="h-4 w-4" />
              </Button>
            </div>
            
            {/* Search Criteria Selector */}
            <div className="flex gap-2">
              <Select value={searchCriteria} onValueChange={setSearchCriteria}>
                <SelectTrigger className="w-40 bg-white/10 border-white/20 text-white">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Fields</SelectItem>
                  <SelectItem value="name">Name</SelectItem>
                  <SelectItem value="barcode">Barcode</SelectItem>
                  <SelectItem value="brand">Brand</SelectItem>
                  <SelectItem value="category">Category</SelectItem>
                </SelectContent>
              </Select>
              
              <Button 
                variant="outline" 
                className="flex-1 bg-white/10 border-white/20 text-white hover:bg-white/20"
                onClick={onAddManualItem}
              >
                <Plus className="h-4 w-4 mr-2" />
                Add Manual Item
              </Button>
              
              <Button 
                variant="outline" 
                size="icon" 
                className="bg-white/10 border-white/20 text-white hover:bg-white/20"
              >
                <Bluetooth className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Search Results Overlay */}
      {showSearchResults && searchTerm.length >= 2 && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-start justify-center pt-20 p-4">
          <Card className="w-full max-w-4xl max-h-[70vh] glass border-white/20">
            <CardContent className="p-6">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-lg font-semibold text-white flex items-center gap-2">
                  <Search className="h-5 w-5" />
                  Search Results for "{searchTerm}"
                </h3>
                <Button 
                  variant="ghost" 
                  size="sm" 
                  onClick={() => {
                    setSearchTerm("");
                    setShowSearchResults(false);
                  }}
                  className="text-white hover:bg-white/10"
                >
                  <X className="h-4 w-4" />
                </Button>
              </div>

              {loading ? (
                <div className="text-center py-12 text-blue-200">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500 mx-auto mb-4"></div>
                  <p>Searching products...</p>
                </div>
              ) : filteredProducts.length === 0 ? (
                <div className="text-center py-12 text-blue-200">
                  <Search className="h-12 w-12 mx-auto mb-4 text-blue-300 opacity-50" />
                  <p className="text-lg font-medium mb-2">No products found</p>
                  <p className="text-sm">Try searching with different keywords or adjust filters</p>
                </div>
              ) : (
                <div className="grid gap-3 max-h-96 overflow-y-auto">
                  {filteredProducts.map((product) => (
                    <div
                      key={product.id}
                      className="flex items-center justify-between p-4 bg-white/5 rounded-lg hover:bg-white/10 cursor-pointer transition-all duration-200 border border-white/10 hover:border-white/20"
                      onClick={() => handleProductSelect(product)}
                    >
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-2">
                          <h4 className="font-medium text-white">{product.name}</h4>
                          <span className="text-xs px-2 py-1 bg-blue-500/20 text-blue-300 rounded-full">
                            {product.category}
                          </span>
                          {product.stock <= product.minStock && (
                            <span className="text-xs px-2 py-1 bg-red-500/20 text-red-300 rounded-full">
                              Low Stock
                            </span>
                          )}
                        </div>
                        <div className="flex items-center gap-4 text-sm text-blue-200">
                          <span className="font-semibold">₹{product.price}</span>
                          <span>Stock: {product.stock}</span>
                          <span>Brand: {product.brand}</span>
                          <span className="font-mono text-xs">{product.barcode}</span>
                        </div>
                      </div>
                      <Button 
                        size="sm" 
                        className="bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600 text-white shadow-lg"
                      >
                        <Plus className="h-4 w-4 mr-1" />
                        Add
                      </Button>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      )}

      {/* Advanced Search Dialog */}
      <Dialog open={showAdvancedSearch} onOpenChange={setShowAdvancedSearch}>
        <DialogContent className="glass border-white/20 max-w-md">
          <DialogHeader>
            <DialogTitle className="text-white">Advanced Search</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="text-sm text-white mb-2 block">Category</label>
                <Select value={advancedFilters.category} onValueChange={(value) => setAdvancedFilters({...advancedFilters, category: value})}>
                  <SelectTrigger className="bg-white/10 border-white/20 text-white">
                    <SelectValue placeholder="Any" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="any">Any Category</SelectItem>
                    <SelectItem value="Electronics">Electronics</SelectItem>
                    <SelectItem value="Accessories">Accessories</SelectItem>
                    <SelectItem value="Clothing">Clothing</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <div>
                <label className="text-sm text-white mb-2 block">Brand</label>
                <Input
                  placeholder="Any brand"
                  value={advancedFilters.brand}
                  onChange={(e) => setAdvancedFilters({...advancedFilters, brand: e.target.value})}
                  className="bg-white/10 border-white/20 text-white placeholder:text-blue-200"
                />
              </div>
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="text-sm text-white mb-2 block">Min Price</label>
                <Input
                  type="number"
                  placeholder="0"
                  value={advancedFilters.priceMin}
                  onChange={(e) => setAdvancedFilters({...advancedFilters, priceMin: e.target.value})}
                  className="bg-white/10 border-white/20 text-white placeholder:text-blue-200"
                />
              </div>
              
              <div>
                <label className="text-sm text-white mb-2 block">Max Price</label>
                <Input
                  type="number"
                  placeholder="∞"
                  value={advancedFilters.priceMax}
                  onChange={(e) => setAdvancedFilters({...advancedFilters, priceMax: e.target.value})}
                  className="bg-white/10 border-white/20 text-white placeholder:text-blue-200"
                />
              </div>
            </div>
            
            <div>
              <label className="text-sm text-white mb-2 block">Min Stock</label>
              <Input
                type="number"
                placeholder="0"
                value={advancedFilters.stockMin}
                onChange={(e) => setAdvancedFilters({...advancedFilters, stockMin: e.target.value})}
                className="bg-white/10 border-white/20 text-white placeholder:text-blue-200"
              />
            </div>
            
            <div className="flex gap-2 pt-4">
              <Button 
                variant="outline" 
                className="flex-1 bg-white/10 border-white/20 text-white hover:bg-white/20"
                onClick={clearAdvancedFilters}
              >
                Clear Filters
              </Button>
              <Button 
                className="flex-1 bg-gradient-to-r from-blue-500 to-purple-500"
                onClick={() => setShowAdvancedSearch(false)}
              >
                Apply Filters
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
};