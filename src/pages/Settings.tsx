import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Textarea } from "@/components/ui/textarea";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Badge } from "@/components/ui/badge";
import { 
  Store, 
  Printer, 
  Receipt, 
  Package, 
  Bell, 
  Info,
  TestTube,
  Database,
  Save,
  Trash2,
  Mail,
  Shield,
  ArrowLeft
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useGraphQLQuery, useGraphQLMutation } from "@/hooks/useGraphQL";
import { GET_STORE_PROFILE } from "@/lib/graphql/queries";
import { UPDATE_STORE_PROFILE } from "@/lib/graphql/mutations";
import { StoreProfile, StoreProfileInput } from "@/lib/graphql/types";
import { useToast } from "@/hooks/use-toast";
import { isMockMode, toggleMockMode } from "@/lib/config";
import { ApiStatusIndicator } from "@/components/common/MockModeIndicator";
import { APP_CONFIG } from "@/lib/utils/constants";
import { DefaultHeader } from "@/components/common/DefaultHeader";

const Settings = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [activeTab, setActiveTab] = useState("store");

  // Store Profile State
  const [storeProfile, setStoreProfile] = useState<StoreProfileInput>({
    name: "",
    address: "",
    phone: "",
    email: "",
    gstin: "",
    showOnReceipt: true
  });

  // GraphQL hooks
  const { data: profileData, loading: profileLoading } = useGraphQLQuery<{
    storeProfile: StoreProfile;
  }>(GET_STORE_PROFILE);

  const { mutate: updateProfile, loading: updateLoading } = useGraphQLMutation<{
    updateStoreProfile: StoreProfile;
  }, { input: StoreProfileInput }>(UPDATE_STORE_PROFILE, {
    onCompleted: () => {
      toast({
        title: "Success",
        description: "Store profile updated successfully."
      });
    }
  });

  // Load profile data when available
  useEffect(() => {
    if (profileData?.storeProfile) {
      const profile = profileData.storeProfile;
      setStoreProfile({
        name: profile.name,
        address: profile.address,
        phone: profile.phone,
        email: profile.email,
        gstin: profile.gstin,
        showOnReceipt: profile.showOnReceipt
      });
    }
  }, [profileData]);

  // Other settings state
  const [printerSettings, setPrinterSettings] = useState({
    receiptPrinter: "",
    receiptPaperSize: "80mm",
    barcodePrinter: "",
    labelSize: "40x30mm",
    autoPrint: true
  });

  const [billingPrefs, setBillingPrefs] = useState({
    defaultTaxRate: 18,
    enableDiscounts: true,
    taxMethod: "bill-wise",
    roundingMethod: "nearest",
    autoPrint: true,
    thankYouNote: "Thank you for your business!"
  });

  const [inventorySettings, setInventorySettings] = useState({
    stockThreshold: 10,
    autoBarcode: true,
    defaultUnit: "pcs"
  });

  const [notifications, setNotifications] = useState({
    dailySummary: true,
    stockReorder: true,
    printerDisconnect: true
  });

  const saveStoreProfile = async () => {
    try {
      await updateProfile({ input: storeProfile });
    } catch (error) {
      console.error("Error updating store profile:", error);
      toast({
        title: "Error",
        description: "Failed to update store profile. Please try again.",
        variant: "destructive"
      });
    }
  };

  const saveBillingPreferences = () => {
    toast({
      title: "Settings Saved",
      description: "Billing preferences have been updated successfully."
    });
  };

  const saveInventorySettings = () => {
    toast({
      title: "Settings Saved", 
      description: "Inventory settings have been updated successfully."
    });
  };

  const saveNotificationSettings = () => {
    toast({
      title: "Settings Saved",
      description: "Notification preferences have been updated successfully."
    });
  };

  const connectPrinter = (type: 'receipt' | 'barcode') => {
    toast({
      title: "Printer Connection",
      description: `Searching for ${type} printers...`
    });
    
    // Simulate printer connection
    setTimeout(() => {
      if (type === 'receipt') {
        setPrinterSettings(prev => ({ ...prev, receiptPrinter: "Epson TM-T20III" }));
      } else {
        setPrinterSettings(prev => ({ ...prev, barcodePrinter: "Zebra ZD220" }));
      }
      
      toast({
        title: "Printer Connected",
        description: `${type === 'receipt' ? 'Receipt' : 'Barcode'} printer connected successfully.`
      });
    }, 2000);
  };

  const testPrint = () => {
    toast({
      title: "Test Print",
      description: "Sending test print to receipt printer..."
    });
  };

  const clearAllData = () => {
    toast({
      title: "Data Cleared",
      description: "All application data has been cleared.",
      variant: "destructive"
    });
  };

  const openTermsOfService = () => {
    window.open('https://spmpos.com/terms', '_blank');
  };

  const openPrivacyPolicy = () => {
    window.open('https://spmpos.com/privacy', '_blank');
  };

  const contactSupport = () => {
    window.open('mailto:support@spmpos.com?subject=SPM-POS Support Request', '_blank');
  };

  const handleModeToggle = () => {
    toggleMockMode();
    toast({
      title: "API Mode Changed",
      description: `Switched to ${isMockMode() ? 'Live' : 'Mock'} mode. Page will reload.`
    });
  };

  const customActions = (
    <div className="flex items-center gap-2">
      <ApiStatusIndicator />
      <Button
        size="sm"
        variant="outline"
        onClick={handleModeToggle}
        className="hidden sm:flex items-center gap-2 bg-white/10 border-white/20 text-white hover:bg-white/20"
      >
        {isMockMode() ? (
          <>
            <Database className="h-3 w-3" />
            Switch to Live
          </>
        ) : (
          <>
            <TestTube className="h-3 w-3" />
            Switch to Mock
          </>
        )}
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
        title="Settings"
        subtitle="Configure your SPM-POS system"
        showUserInfo={false}
        showSettings={false}
        showLogout={true}
        customActions={customActions}
      />

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8 py-4 sm:py-6 lg:py-8 relative z-10">
        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-4 sm:space-y-6 lg:space-y-8">
          {/* Mobile-Optimized Tab Navigation */}
          <div className="glass p-2 rounded-2xl border border-white/20 animate-slide-up">
            <TabsList className="grid w-full grid-cols-3 sm:grid-cols-6 h-auto bg-transparent gap-1 sm:gap-2 overflow-x-auto">
              <TabsTrigger
                value="store"
                className="flex flex-col items-center gap-1 text-xs p-2 sm:p-3 rounded-xl 
                data-[state=active]:bg-gradient-to-r data-[state=active]:from-blue-500/30 data-[state=active]:to-purple-500/30 
                data-[state=active]:text-white data-[state=active]:font-semibold data-[state=active]:shadow-lg
                text-blue-100 hover:bg-white/10 hover:text-white transition-all duration-200 min-h-[52px] sm:min-h-[48px]"
              >
                <Store className="h-4 w-4" />
                <span className="text-[10px] sm:text-xs">Store</span>
              </TabsTrigger>
              <TabsTrigger
                value="printer"
                className="flex flex-col items-center gap-1 text-xs p-2 sm:p-3 rounded-xl 
                data-[state=active]:bg-gradient-to-r data-[state=active]:from-blue-500/30 data-[state=active]:to-purple-500/30 
                data-[state=active]:text-white data-[state=active]:font-semibold data-[state=active]:shadow-lg
                text-blue-100 hover:bg-white/10 hover:text-white transition-all duration-200 min-h-[52px] sm:min-h-[48px]"
              >
                <Printer className="h-4 w-4" />
                <span className="text-[10px] sm:text-xs">Print</span>
              </TabsTrigger>
              <TabsTrigger
                value="billing"
                className="flex flex-col items-center gap-1 text-xs p-2 sm:p-3 rounded-xl 
                data-[state=active]:bg-gradient-to-r data-[state=active]:from-blue-500/30 data-[state=active]:to-purple-500/30 
                data-[state=active]:text-white data-[state=active]:font-semibold data-[state=active]:shadow-lg
                text-blue-100 hover:bg-white/10 hover:text-white transition-all duration-200 min-h-[52px] sm:min-h-[48px]"
              >
                <Receipt className="h-4 w-4" />
                <span className="text-[10px] sm:text-xs">Bill</span>
              </TabsTrigger>
              <TabsTrigger
                value="inventory"
                className="flex flex-col items-center gap-1 text-xs p-2 sm:p-3 rounded-xl 
                data-[state=active]:bg-gradient-to-r data-[state=active]:from-blue-500/30 data-[state=active]:to-purple-500/30 
                data-[state=active]:text-white data-[state=active]:font-semibold data-[state=active]:shadow-lg
                text-blue-100 hover:bg-white/10 hover:text-white transition-all duration-200 min-h-[52px] sm:min-h-[48px]"
              >
                <Package className="h-4 w-4" />
                <span className="text-[10px] sm:text-xs">Stock</span>
              </TabsTrigger>
              <TabsTrigger
                value="notifications"
                className="flex flex-col items-center gap-1 text-xs p-2 sm:p-3 rounded-xl 
                data-[state=active]:bg-gradient-to-r data-[state=active]:from-blue-500/30 data-[state=active]:to-purple-500/30 
                data-[state=active]:text-white data-[state=active]:font-semibold data-[state=active]:shadow-lg
                text-blue-100 hover:bg-white/10 hover:text-white transition-all duration-200 min-h-[52px] sm:min-h-[48px]"
              >
                <Bell className="h-4 w-4" />
                <span className="text-[10px] sm:text-xs">Alert</span>
              </TabsTrigger>
              <TabsTrigger
                value="info"
                className="flex flex-col items-center gap-1 text-xs p-2 sm:p-3 rounded-xl 
                data-[state=active]:bg-gradient-to-r data-[state=active]:from-blue-500/30 data-[state=active]:to-purple-500/30 
                data-[state=active]:text-white data-[state=active]:font-semibold data-[state=active]:shadow-lg
                text-blue-100 hover:bg-white/10 hover:text-white transition-all duration-200 min-h-[52px] sm:min-h-[48px]"
              >
                <Info className="h-4 w-4" />
                <span className="text-[10px] sm:text-xs">Info</span>
              </TabsTrigger>
            </TabsList>
          </div>

          {/* Store Profile Tab */}
          <TabsContent value="store" className="animate-slide-up delay-200">
            <Card className="glass border-white/20">
              <CardHeader className="pb-3 sm:pb-4">
                <CardTitle className="flex items-center gap-2 text-white text-lg sm:text-xl">
                  <Store className="h-5 w-5" />
                  Store Profile
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4 sm:space-y-6 p-4 sm:p-6">
                {profileLoading ? (
                  <div className="text-center py-8 text-blue-200">Loading store profile...</div>
                ) : (
                  <>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="storeName" className="text-white text-sm sm:text-base">Store Name</Label>
                        <Input
                          id="storeName"
                          value={storeProfile.name}
                          onChange={(e) => setStoreProfile({...storeProfile, name: e.target.value})}
                          className="text-sm sm:text-base"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="phone" className="text-white text-sm sm:text-base">Phone Number</Label>
                        <Input
                          id="phone"
                          value={storeProfile.phone}
                          onChange={(e) => setStoreProfile({...storeProfile, phone: e.target.value})}
                          className="text-sm sm:text-base"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="email" className="text-white text-sm sm:text-base">Email</Label>
                        <Input
                          id="email"
                          type="email"
                          value={storeProfile.email}
                          onChange={(e) => setStoreProfile({...storeProfile, email: e.target.value})}
                          className="text-sm sm:text-base"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="gstin" className="text-white text-sm sm:text-base">GSTIN</Label>
                        <Input
                          id="gstin"
                          value={storeProfile.gstin}
                          onChange={(e) => setStoreProfile({...storeProfile, gstin: e.target.value})}
                          className="text-sm sm:text-base"
                        />
                      </div>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="address" className="text-white text-sm sm:text-base">Address</Label>
                      <Textarea
                        id="address"
                        value={storeProfile.address}
                        onChange={(e) => setStoreProfile({...storeProfile, address: e.target.value})}
                        className="bg-white/10 border-white/20 text-white placeholder:text-blue-200 min-h-[80px] text-sm sm:text-base"
                      />
                    </div>
                    <div className="flex items-center space-x-3 py-2">
                      <Switch
                        id="showOnReceipt"
                        checked={storeProfile.showOnReceipt}
                        onCheckedChange={(checked) => setStoreProfile({...storeProfile, showOnReceipt: checked})}
                      />
                      <Label htmlFor="showOnReceipt" className="text-white text-sm sm:text-base">Show store info on receipts</Label>
                    </div>
                    <Button 
                      onClick={saveStoreProfile}
                      disabled={updateLoading}
                      className="w-full sm:w-auto"
                      size="lg"
                    >
                      <Save className="h-4 w-4 mr-2" />
                      {updateLoading ? "Saving..." : "Save Store Profile"}
                    </Button>
                  </>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          {/* Printer Settings Tab */}
          <TabsContent value="printer" className="animate-slide-up delay-200">
            <div className="space-y-4 sm:space-y-6">
              <Card className="glass border-white/20">
                <CardHeader className="pb-3 sm:pb-4">
                  <CardTitle className="text-white text-lg sm:text-xl">Receipt Printer Setup</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4 p-4 sm:p-6">
                  <div className="space-y-2">
                    <Label className="text-white text-sm sm:text-base">Connected Printer</Label>
                    <div className="flex flex-col sm:flex-row gap-2">
                      <Input 
                        placeholder="No printer connected" 
                        value={printerSettings.receiptPrinter} 
                        readOnly 
                        className="flex-1"
                      />
                      <Button 
                        variant="outline" 
                        onClick={() => connectPrinter('receipt')}
                        className="w-full sm:w-auto"
                      >
                        Connect
                      </Button>
                    </div>
                  </div>
                  <div className="space-y-3">
                    <Label className="text-white text-sm sm:text-base">Paper Size</Label>
                    <RadioGroup 
                      value={printerSettings.receiptPaperSize} 
                      onValueChange={(value) => setPrinterSettings({...printerSettings, receiptPaperSize: value})}
                    >
                      <div className="flex items-center space-x-3 py-1">
                        <RadioGroupItem value="58mm" id="58mm" />
                        <Label htmlFor="58mm" className="text-white text-sm sm:text-base">58mm</Label>
                      </div>
                      <div className="flex items-center space-x-3 py-1">
                        <RadioGroupItem value="80mm" id="80mm" />
                        <Label htmlFor="80mm" className="text-white text-sm sm:text-base">80mm</Label>
                      </div>
                    </RadioGroup>
                  </div>
                  <Button 
                    className="w-full sm:w-auto"
                    onClick={testPrint}
                    size="lg"
                  >
                    <TestTube className="h-4 w-4 mr-2" />
                    Test Print
                  </Button>
                </CardContent>
              </Card>

              <Card className="glass border-white/20">
                <CardHeader className="pb-3 sm:pb-4">
                  <CardTitle className="text-white text-lg sm:text-xl">Barcode Printer Setup</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4 p-4 sm:p-6">
                  <div className="space-y-2">
                    <Label className="text-white text-sm sm:text-base">Connected Label Printer</Label>
                    <div className="flex flex-col sm:flex-row gap-2">
                      <Input 
                        placeholder="No printer connected" 
                        value={printerSettings.barcodePrinter} 
                        readOnly 
                        className="flex-1"
                      />
                      <Button 
                        variant="outline" 
                        onClick={() => connectPrinter('barcode')}
                        className="w-full sm:w-auto"
                      >
                        Connect
                      </Button>
                    </div>
                  </div>
                  <div className="space-y-3">
                    <Label className="text-white text-sm sm:text-base">Label Size</Label>
                    <RadioGroup 
                      value={printerSettings.labelSize} 
                      onValueChange={(value) => setPrinterSettings({...printerSettings, labelSize: value})}
                    >
                      <div className="flex items-center space-x-3 py-1">
                        <RadioGroupItem value="40x30mm" id="40x30mm" />
                        <Label htmlFor="40x30mm" className="text-white text-sm sm:text-base">40x30mm</Label>
                      </div>
                      <div className="flex items-center space-x-3 py-1">
                        <RadioGroupItem value="50x30mm" id="50x30mm" />
                        <Label htmlFor="50x30mm" className="text-white text-sm sm:text-base">50x30mm</Label>
                      </div>
                    </RadioGroup>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* Billing Preferences Tab */}
          <TabsContent value="billing" className="animate-slide-up delay-200">
            <Card className="glass border-white/20">
              <CardHeader className="pb-3 sm:pb-4">
                <CardTitle className="flex items-center gap-2 text-white text-lg sm:text-xl">
                  <Receipt className="h-5 w-5" />
                  Billing Preferences
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4 sm:space-y-6 p-4 sm:p-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="taxRate" className="text-white text-sm sm:text-base">Default Tax Rate (%)</Label>
                    <Input
                      id="taxRate"
                      type="number"
                      value={billingPrefs.defaultTaxRate}
                      onChange={(e) => setBillingPrefs({...billingPrefs, defaultTaxRate: parseInt(e.target.value)})}
                    />
                  </div>
                  <div className="space-y-3">
                    <Label className="text-white text-sm sm:text-base">Rounding Method</Label>
                    <RadioGroup 
                      value={billingPrefs.roundingMethod} 
                      onValueChange={(value) => setBillingPrefs({...billingPrefs, roundingMethod: value})}
                    >
                      <div className="flex items-center space-x-3 py-1">
                        <RadioGroupItem value="nearest" id="nearest" />
                        <Label htmlFor="nearest" className="text-white text-sm sm:text-base">Nearest</Label>
                      </div>
                      <div className="flex items-center space-x-3 py-1">
                        <RadioGroupItem value="up" id="up" />
                        <Label htmlFor="up" className="text-white text-sm sm:text-base">Round Up</Label>
                      </div>
                      <div className="flex items-center space-x-3 py-1">
                        <RadioGroupItem value="down" id="down" />
                        <Label htmlFor="down" className="text-white text-sm sm:text-base">Round Down</Label>
                      </div>
                    </RadioGroup>
                  </div>
                </div>
                
                <div className="space-y-4">
                  <div className="flex items-center justify-between py-2">
                    <div className="flex-1 pr-4">
                      <Label htmlFor="enableDiscounts" className="text-white text-sm sm:text-base">Enable discount entry</Label>
                      <p className="text-xs sm:text-sm text-blue-200 mt-1">Allow discounts on individual items and bills</p>
                    </div>
                    <Switch
                      id="enableDiscounts"
                      checked={billingPrefs.enableDiscounts}
                      onCheckedChange={(checked) => setBillingPrefs({...billingPrefs, enableDiscounts: checked})}
                    />
                  </div>
                  
                  <div className="flex items-center justify-between py-2">
                    <div className="flex-1 pr-4">
                      <Label htmlFor="autoPrintBilling" className="text-white text-sm sm:text-base">Auto print receipt</Label>
                      <p className="text-xs sm:text-sm text-blue-200 mt-1">Automatically print receipt after billing</p>
                    </div>
                    <Switch
                      id="autoPrintBilling"
                      checked={billingPrefs.autoPrint}
                      onCheckedChange={(checked) => setBillingPrefs({...billingPrefs, autoPrint: checked})}
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="thankYouNote" className="text-white text-sm sm:text-base">Thank You Note</Label>
                  <Textarea
                    id="thankYouNote"
                    value={billingPrefs.thankYouNote}
                    onChange={(e) => setBillingPrefs({...billingPrefs, thankYouNote: e.target.value})}
                    className="bg-white/10 border-white/20 text-white placeholder:text-blue-200 min-h-[80px]"
                  />
                </div>

                <Button 
                  onClick={saveBillingPreferences}
                  className="w-full sm:w-auto"
                  size="lg"
                >
                  <Save className="h-4 w-4 mr-2" />
                  Save Billing Preferences
                </Button>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Inventory Settings Tab */}
          <TabsContent value="inventory" className="animate-slide-up delay-200">
            <Card className="glass border-white/20">
              <CardHeader className="pb-3 sm:pb-4">
                <CardTitle className="flex items-center gap-2 text-white text-lg sm:text-xl">
                  <Package className="h-5 w-5" />
                  Inventory Settings
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4 sm:space-y-6 p-4 sm:p-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="stockThreshold" className="text-white text-sm sm:text-base">Stock Threshold Alert</Label>
                    <Input
                      id="stockThreshold"
                      type="number"
                      value={inventorySettings.stockThreshold}
                      onChange={(e) => setInventorySettings({...inventorySettings, stockThreshold: parseInt(e.target.value)})}
                    />
                  </div>
                  <div className="space-y-3">
                    <Label className="text-white text-sm sm:text-base">Default Unit of Measure</Label>
                    <RadioGroup 
                      value={inventorySettings.defaultUnit} 
                      onValueChange={(value) => setInventorySettings({...inventorySettings, defaultUnit: value})}
                    >
                      <div className="flex items-center space-x-3 py-1">
                        <RadioGroupItem value="pcs" id="pcs" />
                        <Label htmlFor="pcs" className="text-white text-sm sm:text-base">Pieces</Label>
                      </div>
                      <div className="flex items-center space-x-3 py-1">
                        <RadioGroupItem value="kg" id="kg" />
                        <Label htmlFor="kg" className="text-white text-sm sm:text-base">Kilograms</Label>
                      </div>
                      <div className="flex items-center space-x-3 py-1">
                        <RadioGroupItem value="liter" id="liter" />
                        <Label htmlFor="liter" className="text-white text-sm sm:text-base">Liters</Label>
                      </div>
                    </RadioGroup>
                  </div>
                </div>
                
                <div className="flex items-center justify-between py-2">
                  <div className="flex-1 pr-4">
                    <Label htmlFor="autoBarcode" className="text-white text-sm sm:text-base">Auto-generate barcodes</Label>
                    <p className="text-xs sm:text-sm text-blue-200 mt-1">Automatically generate barcodes for new products</p>
                  </div>
                  <Switch
                    id="autoBarcode"
                    checked={inventorySettings.autoBarcode}
                    onCheckedChange={(checked) => setInventorySettings({...inventorySettings, autoBarcode: checked})}
                  />
                </div>

                <Button 
                  onClick={saveInventorySettings}
                  className="w-full sm:w-auto"
                  size="lg"
                >
                  <Save className="h-4 w-4 mr-2" />
                  Save Inventory Settings
                </Button>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Notifications Tab */}
          <TabsContent value="notifications" className="animate-slide-up delay-200">
            <Card className="glass border-white/20">
              <CardHeader className="pb-3 sm:pb-4">
                <CardTitle className="flex items-center gap-2 text-white text-lg sm:text-xl">
                  <Bell className="h-5 w-5" />
                  Notifications & Alerts
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4 sm:space-y-6 p-4 sm:p-6">
                <div className="space-y-4">
                  <div className="flex items-center justify-between py-2">
                    <div className="flex-1 pr-4">
                      <Label htmlFor="dailySummary" className="text-white text-sm sm:text-base">Daily Sales Summary</Label>
                      <p className="text-xs sm:text-sm text-blue-200 mt-1">Receive daily sales reports via email</p>
                    </div>
                    <Switch
                      id="dailySummary"
                      checked={notifications.dailySummary}
                      onCheckedChange={(checked) => setNotifications({...notifications, dailySummary: checked})}
                    />
                  </div>
                  
                  <div className="flex items-center justify-between py-2">
                    <div className="flex-1 pr-4">
                      <Label htmlFor="stockReorder" className="text-white text-sm sm:text-base">Stock Reorder Alerts</Label>
                      <p className="text-xs sm:text-sm text-blue-200 mt-1">Get notified when items are low in stock</p>
                    </div>
                    <Switch
                      id="stockReorder"
                      checked={notifications.stockReorder}
                      onCheckedChange={(checked) => setNotifications({...notifications, stockReorder: checked})}
                    />
                  </div>
                  
                  <div className="flex items-center justify-between py-2">
                    <div className="flex-1 pr-4">
                      <Label htmlFor="printerDisconnect" className="text-white text-sm sm:text-base">Printer Disconnect Alerts</Label>
                      <p className="text-xs sm:text-sm text-blue-200 mt-1">Alert when printers are disconnected</p>
                    </div>
                    <Switch
                      id="printerDisconnect"
                      checked={notifications.printerDisconnect}
                      onCheckedChange={(checked) => setNotifications({...notifications, printerDisconnect: checked})}
                    />
                  </div>
                </div>

                <Button 
                  onClick={saveNotificationSettings}
                  className="w-full sm:w-auto"
                  size="lg"
                >
                  <Save className="h-4 w-4 mr-2" />
                  Save Notification Settings
                </Button>
              </CardContent>
            </Card>
          </TabsContent>

          {/* App Info Tab */}
          <TabsContent value="info" className="animate-slide-up delay-200">
            <Card className="glass border-white/20">
              <CardHeader className="pb-3 sm:pb-4">
                <CardTitle className="flex items-center gap-2 text-white text-lg sm:text-xl">
                  <Info className="h-5 w-5" />
                  App Info & Support
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4 sm:space-y-6 p-4 sm:p-6">
                <div className="space-y-4">
                  <div className="flex justify-between items-center py-2">
                    <span className="font-medium text-white text-sm sm:text-base">App Version</span>
                    <span className="text-blue-200 text-sm sm:text-base">{APP_CONFIG.version}</span>
                  </div>
                  
                  <div className="flex justify-between items-center py-2">
                    <span className="font-medium text-white text-sm sm:text-base">Last Updated</span>
                    <span className="text-blue-200 text-sm sm:text-base">{APP_CONFIG.lastUpdated}</span>
                  </div>
                  
                  <div className="flex justify-between items-center py-2">
                    <span className="font-medium text-white text-sm sm:text-base">API Mode</span>
                    <ApiStatusIndicator />
                  </div>
                  
                  <div className="flex justify-between items-center py-2">
                    <span className="font-medium text-white text-sm sm:text-base">System Status</span>
                    <Badge variant="default" className="bg-green-500/20 text-green-300 border-green-500/30">
                      Operational
                    </Badge>
                  </div>
                </div>
                
                <div className="space-y-3">
                  <Button 
                    variant="outline" 
                    className="w-full"
                    onClick={openTermsOfService}
                    size="lg"
                  >
                    <Shield className="h-4 w-4 mr-2" />
                    Terms of Service
                  </Button>
                  <Button 
                    variant="outline" 
                    className="w-full"
                    onClick={openPrivacyPolicy}
                    size="lg"
                  >
                    <Shield className="h-4 w-4 mr-2" />
                    Privacy Policy
                  </Button>
                  <Button 
                    variant="outline" 
                    className="w-full"
                    onClick={contactSupport}
                    size="lg"
                  >
                    <Mail className="h-4 w-4 mr-2" />
                    Contact Support
                  </Button>
                </div>
                
                <div className="pt-4 border-t border-white/20">
                  <Button 
                    variant="destructive" 
                    className="w-full"
                    onClick={clearAllData}
                    size="lg"
                  >
                    <Trash2 className="h-4 w-4 mr-2" />
                    Clear All Data
                  </Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </main>
    </div>
  );
};

export default Settings;
