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
  Settings as SettingsIcon,
  ArrowLeft,
  TestTube,
  Database,
  Sparkles,
  Save,
  Trash2,
  Mail,
  Shield
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

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
      {/* Animated background elements */}
      <div className="fixed inset-0 opacity-10 pointer-events-none">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-blue-400 rounded-full mix-blend-multiply filter blur-xl animate-float"></div>
        <div className="absolute top-3/4 right-1/4 w-96 h-96 bg-purple-400 rounded-full mix-blend-multiply filter blur-xl animate-float delay-1000"></div>
      </div>

      {/* Modern Header */}
      <header className="nav-modern">
        <div className="responsive-container">
          <div className="flex items-center justify-between h-20">
            <div className="flex items-center space-x-4">
              <Button 
                variant="ghost" 
                size="icon"
                onClick={() => navigate('/admin')}
              >
                <ArrowLeft className="h-5 w-5" />
              </Button>
              <div className="bg-gradient-to-r from-blue-500 to-purple-500 p-3 rounded-2xl shadow-modern-lg">
                <SettingsIcon className="h-8 w-8 text-white" />
              </div>
              <div>
                <h1 className="text-heading-3 gradient-text">Settings</h1>
                <p className="text-body-sm flex items-center gap-1">
                  <Sparkles className="h-3 w-3" />
                  Configure your SPM-POS system
                </p>
              </div>
            </div>
            
            {/* API Mode Toggle */}
            <div className="flex items-center gap-4">
              <ApiStatusIndicator />
              <Button
                size="sm"
                variant="outline"
                onClick={handleModeToggle}
                className="hidden sm:flex items-center gap-2"
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
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="responsive-container py-8 lg:py-12 relative z-10">
        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-lg">
          {/* Modern Tab Navigation */}
          <div className="glass-strong p-3 rounded-2xl border border-white/20 animate-slide-up">
            <TabsList className="grid w-full grid-cols-3 lg:grid-cols-6 gap-2">
              <TabsTrigger
                value="store"
                className="flex flex-col sm:flex-row items-center gap-2 text-sm font-semibold"
              >
                <Store className="h-5 w-5" />
                <span className="hidden sm:inline">Store</span>
              </TabsTrigger>
              <TabsTrigger
                value="printer"
                className="flex flex-col sm:flex-row items-center gap-2 text-sm font-semibold"
              >
                <Printer className="h-5 w-5" />
                <span className="hidden sm:inline">Printer</span>
              </TabsTrigger>
              <TabsTrigger
                value="billing"
                className="flex flex-col sm:flex-row items-center gap-2 text-sm font-semibold"
              >
                <Receipt className="h-5 w-5" />
                <span className="hidden sm:inline">Billing</span>
              </TabsTrigger>
              <TabsTrigger
                value="inventory"
                className="flex flex-col sm:flex-row items-center gap-2 text-sm font-semibold"
              >
                <Package className="h-5 w-5" />
                <span className="hidden sm:inline">Inventory</span>
              </TabsTrigger>
              <TabsTrigger
                value="notifications"
                className="flex flex-col sm:flex-row items-center gap-2 text-sm font-semibold"
              >
                <Bell className="h-5 w-5" />
                <span className="hidden sm:inline">Alerts</span>
              </TabsTrigger>
              <TabsTrigger
                value="info"
                className="flex flex-col sm:flex-row items-center gap-2 text-sm font-semibold"
              >
                <Info className="h-5 w-5" />
                <span className="hidden sm:inline">Info</span>
              </TabsTrigger>
            </TabsList>
          </div>

          {/* Store Profile Tab */}
          <TabsContent value="store" className="animate-fade-in">
            <Card className="card-modern">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Store className="h-5 w-5" />
                  Store Profile
                </CardTitle>
              </CardHeader>
              <CardContent className="space-md">
                {profileLoading ? (
                  <div className="text-center py-8 text-blue-200">Loading store profile...</div>
                ) : (
                  <>
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                      <div className="space-y-2">
                        <Label htmlFor="storeName" className="text-white">Store Name</Label>
                        <Input
                          id="storeName"
                          value={storeProfile.name}
                          onChange={(e) => setStoreProfile({...storeProfile, name: e.target.value})}
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="phone" className="text-white">Phone Number</Label>
                        <Input
                          id="phone"
                          value={storeProfile.phone}
                          onChange={(e) => setStoreProfile({...storeProfile, phone: e.target.value})}
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="email" className="text-white">Email</Label>
                        <Input
                          id="email"
                          type="email"
                          value={storeProfile.email}
                          onChange={(e) => setStoreProfile({...storeProfile, email: e.target.value})}
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="gstin" className="text-white">GSTIN</Label>
                        <Input
                          id="gstin"
                          value={storeProfile.gstin}
                          onChange={(e) => setStoreProfile({...storeProfile, gstin: e.target.value})}
                        />
                      </div>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="address" className="text-white">Address</Label>
                      <Textarea
                        id="address"
                        value={storeProfile.address}
                        onChange={(e) => setStoreProfile({...storeProfile, address: e.target.value})}
                        className="input-modern min-h-[100px]"
                      />
                    </div>
                    <div className="flex items-center space-x-2">
                      <Switch
                        id="showOnReceipt"
                        checked={storeProfile.showOnReceipt}
                        onCheckedChange={(checked) => setStoreProfile({...storeProfile, showOnReceipt: checked})}
                      />
                      <Label htmlFor="showOnReceipt" className="text-white">Show store info on receipts</Label>
                    </div>
                    <Button 
                      onClick={saveStoreProfile}
                      disabled={updateLoading}
                      className="w-full sm:w-auto"
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
          <TabsContent value="printer" className="animate-fade-in">
            <div className="space-lg">
              <Card className="card-modern">
                <CardHeader>
                  <CardTitle>Receipt Printer Setup</CardTitle>
                </CardHeader>
                <CardContent className="space-md">
                  <div className="space-y-2">
                    <Label className="text-white">Connected Printer</Label>
                    <div className="flex gap-2">
                      <Input 
                        placeholder="No printer connected" 
                        value={printerSettings.receiptPrinter} 
                        readOnly 
                      />
                      <Button 
                        variant="outline" 
                        onClick={() => connectPrinter('receipt')}
                      >
                        Connect
                      </Button>
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label className="text-white">Paper Size</Label>
                    <RadioGroup 
                      value={printerSettings.receiptPaperSize} 
                      onValueChange={(value) => setPrinterSettings({...printerSettings, receiptPaperSize: value})}
                    >
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="58mm" id="58mm" />
                        <Label htmlFor="58mm" className="text-white">58mm</Label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="80mm" id="80mm" />
                        <Label htmlFor="80mm" className="text-white">80mm</Label>
                      </div>
                    </RadioGroup>
                  </div>
                  <Button 
                    className="flex items-center gap-2"
                    onClick={testPrint}
                  >
                    <TestTube className="h-4 w-4" />
                    Test Print
                  </Button>
                </CardContent>
              </Card>

              <Card className="card-modern">
                <CardHeader>
                  <CardTitle>Barcode Printer Setup</CardTitle>
                </CardHeader>
                <CardContent className="space-md">
                  <div className="space-y-2">
                    <Label className="text-white">Connected Label Printer</Label>
                    <div className="flex gap-2">
                      <Input 
                        placeholder="No printer connected" 
                        value={printerSettings.barcodePrinter} 
                        readOnly 
                      />
                      <Button 
                        variant="outline" 
                        onClick={() => connectPrinter('barcode')}
                      >
                        Connect
                      </Button>
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label className="text-white">Label Size</Label>
                    <RadioGroup 
                      value={printerSettings.labelSize} 
                      onValueChange={(value) => setPrinterSettings({...printerSettings, labelSize: value})}
                    >
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="40x30mm" id="40x30mm" />
                        <Label htmlFor="40x30mm" className="text-white">40x30mm</Label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="50x30mm" id="50x30mm" />
                        <Label htmlFor="50x30mm" className="text-white">50x30mm</Label>
                      </div>
                    </RadioGroup>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* Billing Preferences Tab */}
          <TabsContent value="billing" className="animate-fade-in">
            <Card className="card-modern">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Receipt className="h-5 w-5" />
                  Billing Preferences
                </CardTitle>
              </CardHeader>
              <CardContent className="space-md">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <Label htmlFor="taxRate" className="text-white">Default Tax Rate (%)</Label>
                    <Input
                      id="taxRate"
                      type="number"
                      value={billingPrefs.defaultTaxRate}
                      onChange={(e) => setBillingPrefs({...billingPrefs, defaultTaxRate: parseInt(e.target.value)})}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label className="text-white">Rounding Method</Label>
                    <RadioGroup 
                      value={billingPrefs.roundingMethod} 
                      onValueChange={(value) => setBillingPrefs({...billingPrefs, roundingMethod: value})}
                    >
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="nearest" id="nearest" />
                        <Label htmlFor="nearest" className="text-white">Nearest</Label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="up" id="up" />
                        <Label htmlFor="up" className="text-white">Round Up</Label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="down" id="down" />
                        <Label htmlFor="down" className="text-white">Round Down</Label>
                      </div>
                    </RadioGroup>
                  </div>
                </div>
                
                <div className="space-md">
                  <div className="flex items-center space-x-2">
                    <Switch
                      id="enableDiscounts"
                      checked={billingPrefs.enableDiscounts}
                      onCheckedChange={(checked) => setBillingPrefs({...billingPrefs, enableDiscounts: checked})}
                    />
                    <Label htmlFor="enableDiscounts" className="text-white">Enable discount entry</Label>
                  </div>
                  
                  <div className="flex items-center space-x-2">
                    <Switch
                      id="autoPrintBilling"
                      checked={billingPrefs.autoPrint}
                      onCheckedChange={(checked) => setBillingPrefs({...billingPrefs, autoPrint: checked})}
                    />
                    <Label htmlFor="autoPrintBilling" className="text-white">Auto print receipt after billing</Label>
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="thankYouNote" className="text-white">Thank You Note</Label>
                  <Textarea
                    id="thankYouNote"
                    value={billingPrefs.thankYouNote}
                    onChange={(e) => setBillingPrefs({...billingPrefs, thankYouNote: e.target.value})}
                    className="input-modern min-h-[80px]"
                  />
                </div>

                <Button 
                  onClick={saveBillingPreferences}
                  className="w-full sm:w-auto"
                >
                  <Save className="h-4 w-4 mr-2" />
                  Save Billing Preferences
                </Button>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Inventory Settings Tab */}
          <TabsContent value="inventory" className="animate-fade-in">
            <Card className="card-modern">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Package className="h-5 w-5" />
                  Inventory Settings
                </CardTitle>
              </CardHeader>
              <CardContent className="space-md">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <Label htmlFor="stockThreshold" className="text-white">Stock Threshold Alert</Label>
                    <Input
                      id="stockThreshold"
                      type="number"
                      value={inventorySettings.stockThreshold}
                      onChange={(e) => setInventorySettings({...inventorySettings, stockThreshold: parseInt(e.target.value)})}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label className="text-white">Default Unit of Measure</Label>
                    <RadioGroup 
                      value={inventorySettings.defaultUnit} 
                      onValueChange={(value) => setInventorySettings({...inventorySettings, defaultUnit: value})}
                    >
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="pcs" id="pcs" />
                        <Label htmlFor="pcs" className="text-white">Pieces</Label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="kg" id="kg" />
                        <Label htmlFor="kg" className="text-white">Kilograms</Label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="liter" id="liter" />
                        <Label htmlFor="liter" className="text-white">Liters</Label>
                      </div>
                    </RadioGroup>
                  </div>
                </div>
                
                <div className="flex items-center space-x-2">
                  <Switch
                    id="autoBarcode"
                    checked={inventorySettings.autoBarcode}
                    onCheckedChange={(checked) => setInventorySettings({...inventorySettings, autoBarcode: checked})}
                  />
                  <Label htmlFor="autoBarcode" className="text-white">Enable barcode auto-generation for new products</Label>
                </div>

                <Button 
                  onClick={saveInventorySettings}
                  className="w-full sm:w-auto"
                >
                  <Save className="h-4 w-4 mr-2" />
                  Save Inventory Settings
                </Button>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Notifications Tab */}
          <TabsContent value="notifications" className="animate-fade-in">
            <Card className="card-modern">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Bell className="h-5 w-5" />
                  Notifications & Alerts
                </CardTitle>
              </CardHeader>
              <CardContent className="space-md">
                <div className="space-md">
                  <div className="flex items-center justify-between">
                    <div>
                      <Label htmlFor="dailySummary" className="text-white">Daily Sales Summary</Label>
                      <p className="text-body-sm text-blue-200">Receive daily sales reports via email</p>
                    </div>
                    <Switch
                      id="dailySummary"
                      checked={notifications.dailySummary}
                      onCheckedChange={(checked) => setNotifications({...notifications, dailySummary: checked})}
                    />
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <div>
                      <Label htmlFor="stockReorder" className="text-white">Stock Reorder Alerts</Label>
                      <p className="text-body-sm text-blue-200">Get notified when items are low in stock</p>
                    </div>
                    <Switch
                      id="stockReorder"
                      checked={notifications.stockReorder}
                      onCheckedChange={(checked) => setNotifications({...notifications, stockReorder: checked})}
                    />
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <div>
                      <Label htmlFor="printerDisconnect" className="text-white">Printer Disconnect Alerts</Label>
                      <p className="text-body-sm text-blue-200">Alert when printers are disconnected</p>
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
                >
                  <Save className="h-4 w-4 mr-2" />
                  Save Notification Settings
                </Button>
              </CardContent>
            </Card>
          </TabsContent>

          {/* App Info Tab */}
          <TabsContent value="info" className="animate-fade-in">
            <Card className="card-modern">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Info className="h-5 w-5" />
                  App Info & Support
                </CardTitle>
              </CardHeader>
              <CardContent className="space-md">
                <div className="space-md">
                  <div className="flex justify-between items-center">
                    <span className="font-medium text-white">App Version</span>
                    <span className="text-blue-200">{APP_CONFIG.version}</span>
                  </div>
                  
                  <div className="flex justify-between items-center">
                    <span className="font-medium text-white">Last Updated</span>
                    <span className="text-blue-200">{APP_CONFIG.lastUpdated}</span>
                  </div>
                  
                  <div className="flex justify-between items-center">
                    <span className="font-medium text-white">API Mode</span>
                    <ApiStatusIndicator />
                  </div>
                  
                  <div className="flex justify-between items-center">
                    <span className="font-medium text-white">System Status</span>
                    <Badge variant="default" className="bg-green-500/20 text-green-300 border-green-500/30">
                      Operational
                    </Badge>
                  </div>
                </div>
                
                <div className="space-sm">
                  <Button 
                    variant="outline" 
                    className="w-full justify-start"
                    onClick={openTermsOfService}
                  >
                    <Shield className="h-4 w-4 mr-2" />
                    Terms of Service
                  </Button>
                  <Button 
                    variant="outline" 
                    className="w-full justify-start"
                    onClick={openPrivacyPolicy}
                  >
                    <Shield className="h-4 w-4 mr-2" />
                    Privacy Policy
                  </Button>
                  <Button 
                    variant="outline" 
                    className="w-full justify-start"
                    onClick={contactSupport}
                  >
                    <Mail className="h-4 w-4 mr-2" />
                    Contact Support
                  </Button>
                </div>
                
                <div className="pt-6 border-t border-white/20">
                  <Button 
                    variant="destructive" 
                    className="w-full"
                    onClick={clearAllData}
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