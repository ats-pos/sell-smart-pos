import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Textarea } from "@/components/ui/textarea";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { 
  Store, 
  Printer, 
  Receipt, 
  Package, 
  Users, 
  Cloud, 
  Globe, 
  Bell, 
  Share,
  Info,
  Settings as SettingsIcon,
  ArrowLeft,
  TestTube
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useGraphQLQuery, useGraphQLMutation } from "@/hooks/useGraphQL";
import { GET_STORE_PROFILE } from "@/lib/graphql/queries";
import { UPDATE_STORE_PROFILE } from "@/lib/graphql/mutations";
import { StoreProfile, StoreProfileInput } from "@/lib/graphql/types";
import { useToast } from "@/hooks/use-toast";
import { Badge } from "@/components/ui/badge";

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

  // Other settings state (these would also be connected to GraphQL in a real app)
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

  const [regionalSettings, setRegionalSettings] = useState({
    language: "english",
    currency: "INR",
    dateFormat: "DD/MM/YYYY",
    taxCountry: "india"
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

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-14 sm:h-16">
            <div className="flex items-center space-x-3">
              <Button 
                variant="ghost" 
                size="sm"
                onClick={() => navigate('/admin')}
                className="p-2"
              >
                <ArrowLeft className="h-5 w-5" />
              </Button>
              <div className="bg-blue-600 p-1.5 sm:p-2 rounded-lg">
                <SettingsIcon className="h-5 w-5 sm:h-6 sm:w-6 text-white" />
              </div>
              <div>
                <h1 className="text-lg sm:text-xl font-bold text-gray-900">Settings</h1>
                <p className="text-xs text-gray-500 hidden sm:block">Configure your SPMPOS system</p>
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 sm:py-6">
        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          {/* Mobile-Optimized Tab Navigation */}
          <div className="overflow-x-auto">
            <TabsList className="grid grid-cols-5 lg:grid-cols-10 h-12 sm:h-10 w-full min-w-[600px] lg:min-w-full">
              <TabsTrigger value="store" className="flex flex-col sm:flex-row items-center gap-1 text-xs p-2">
                <Store className="h-4 w-4" />
                <span className="hidden xs:inline">Store</span>
              </TabsTrigger>
              <TabsTrigger value="printer" className="flex flex-col sm:flex-row items-center gap-1 text-xs p-2">
                <Printer className="h-4 w-4" />
                <span className="hidden xs:inline">Printer</span>
              </TabsTrigger>
              <TabsTrigger value="billing" className="flex flex-col sm:flex-row items-center gap-1 text-xs p-2">
                <Receipt className="h-4 w-4" />
                <span className="hidden xs:inline">Billing</span>
              </TabsTrigger>
              <TabsTrigger value="inventory" className="flex flex-col sm:flex-row items-center gap-1 text-xs p-2">
                <Package className="h-4 w-4" />
                <span className="hidden xs:inline">Inventory</span>
              </TabsTrigger>
              <TabsTrigger value="users" className="flex flex-col sm:flex-row items-center gap-1 text-xs p-2">
                <Users className="h-4 w-4" />
                <span className="hidden xs:inline">Users</span>
              </TabsTrigger>
              <TabsTrigger value="backup" className="flex flex-col sm:flex-row items-center gap-1 text-xs p-2">
                <Cloud className="h-4 w-4" />
                <span className="hidden xs:inline">Backup</span>
              </TabsTrigger>
              <TabsTrigger value="regional" className="flex flex-col sm:flex-row items-center gap-1 text-xs p-2">
                <Globe className="h-4 w-4" />
                <span className="hidden xs:inline">Regional</span>
              </TabsTrigger>
              <TabsTrigger value="notifications" className="flex flex-col sm:flex-row items-center gap-1 text-xs p-2">
                <Bell className="h-4 w-4" />
                <span className="hidden xs:inline">Alerts</span>
              </TabsTrigger>
              <TabsTrigger value="sharing" className="flex flex-col sm:flex-row items-center gap-1 text-xs p-2">
                <Share className="h-4 w-4" />
                <span className="hidden xs:inline">Export</span>
              </TabsTrigger>
              <TabsTrigger value="info" className="flex flex-col sm:flex-row items-center gap-1 text-xs p-2">
                <Info className="h-4 w-4" />
                <span className="hidden xs:inline">Info</span>
              </TabsTrigger>
            </TabsList>
          </div>

          {/* Store Profile Tab */}
          <TabsContent value="store">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Store className="h-5 w-5" />
                  Store Profile
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                {profileLoading ? (
                  <div className="text-center py-8">Loading store profile...</div>
                ) : (
                  <>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="storeName">Store Name</Label>
                        <Input
                          id="storeName"
                          value={storeProfile.name}
                          onChange={(e) => setStoreProfile({...storeProfile, name: e.target.value})}
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="phone">Phone Number</Label>
                        <Input
                          id="phone"
                          value={storeProfile.phone}
                          onChange={(e) => setStoreProfile({...storeProfile, phone: e.target.value})}
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="email">Email</Label>
                        <Input
                          id="email"
                          type="email"
                          value={storeProfile.email}
                          onChange={(e) => setStoreProfile({...storeProfile, email: e.target.value})}
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="gstin">GSTIN</Label>
                        <Input
                          id="gstin"
                          value={storeProfile.gstin}
                          onChange={(e) => setStoreProfile({...storeProfile, gstin: e.target.value})}
                        />
                      </div>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="address">Address</Label>
                      <Textarea
                        id="address"
                        value={storeProfile.address}
                        onChange={(e) => setStoreProfile({...storeProfile, address: e.target.value})}
                      />
                    </div>
                    <div className="flex items-center space-x-2">
                      <Switch
                        id="showOnReceipt"
                        checked={storeProfile.showOnReceipt}
                        onCheckedChange={(checked) => setStoreProfile({...storeProfile, showOnReceipt: checked})}
                      />
                      <Label htmlFor="showOnReceipt">Show store info on receipts</Label>
                    </div>
                    <Button 
                      onClick={saveStoreProfile}
                      disabled={updateLoading}
                    >
                      {updateLoading ? "Saving..." : "Save Store Profile"}
                    </Button>
                  </>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          {/* Printer Settings Tab */}
          <TabsContent value="printer">
            <div className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>Receipt Printer Setup</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <Label>Connected Printer</Label>
                    <div className="flex gap-2">
                      <Input placeholder="No printer connected" value={printerSettings.receiptPrinter} readOnly />
                      <Button variant="outline">Connect</Button>
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label>Paper Size</Label>
                    <RadioGroup value={printerSettings.receiptPaperSize} onValueChange={(value) => setPrinterSettings({...printerSettings, receiptPaperSize: value})}>
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="58mm" id="58mm" />
                        <Label htmlFor="58mm">58mm</Label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="80mm" id="80mm" />
                        <Label htmlFor="80mm">80mm</Label>
                      </div>
                    </RadioGroup>
                  </div>
                  <Button className="flex items-center gap-2">
                    <TestTube className="h-4 w-4" />
                    Test Print
                  </Button>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Barcode Printer Setup</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <Label>Connected Label Printer</Label>
                    <div className="flex gap-2">
                      <Input placeholder="No printer connected" value={printerSettings.barcodePrinter} readOnly />
                      <Button variant="outline">Connect</Button>
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label>Label Size</Label>
                    <RadioGroup value={printerSettings.labelSize} onValueChange={(value) => setPrinterSettings({...printerSettings, labelSize: value})}>
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="40x30mm" id="40x30mm" />
                        <Label htmlFor="40x30mm">40x30mm</Label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="50x30mm" id="50x30mm" />
                        <Label htmlFor="50x30mm">50x30mm</Label>
                      </div>
                    </RadioGroup>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* Billing Preferences Tab */}
          <TabsContent value="billing">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Receipt className="h-5 w-5" />
                  Billing Preferences
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="taxRate">Default Tax Rate (%)</Label>
                    <Input
                      id="taxRate"
                      type="number"
                      value={billingPrefs.defaultTaxRate}
                      onChange={(e) => setBillingPrefs({...billingPrefs, defaultTaxRate: parseInt(e.target.value)})}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>Rounding Method</Label>
                    <RadioGroup value={billingPrefs.roundingMethod} onValueChange={(value) => setBillingPrefs({...billingPrefs, roundingMethod: value})}>
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="nearest" id="nearest" />
                        <Label htmlFor="nearest">Nearest</Label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="up" id="up" />
                        <Label htmlFor="up">Round Up</Label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="down" id="down" />
                        <Label htmlFor="down">Round Down</Label>
                      </div>
                    </RadioGroup>
                  </div>
                </div>
                
                <div className="space-y-4">
                  <div className="flex items-center space-x-2">
                    <Switch
                      id="enableDiscounts"
                      checked={billingPrefs.enableDiscounts}
                      onCheckedChange={(checked) => setBillingPrefs({...billingPrefs, enableDiscounts: checked})}
                    />
                    <Label htmlFor="enableDiscounts">Enable discount entry</Label>
                  </div>
                  
                  <div className="flex items-center space-x-2">
                    <Switch
                      id="autoPrintBilling"
                      checked={billingPrefs.autoPrint}
                      onCheckedChange={(checked) => setBillingPrefs({...billingPrefs, autoPrint: checked})}
                    />
                    <Label htmlFor="autoPrintBilling">Auto print receipt after billing</Label>
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="thankYouNote">Thank You Note</Label>
                  <Textarea
                    id="thankYouNote"
                    value={billingPrefs.thankYouNote}
                    onChange={(e) => setBillingPrefs({...billingPrefs, thankYouNote: e.target.value})}
                  />
                </div>

                <Button>Save Billing Preferences</Button>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Inventory Settings Tab */}
          <TabsContent value="inventory">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Package className="h-5 w-5" />
                  Inventory Settings
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="stockThreshold">Stock Threshold Alert</Label>
                    <Input
                      id="stockThreshold"
                      type="number"
                      value={inventorySettings.stockThreshold}
                      onChange={(e) => setInventorySettings({...inventorySettings, stockThreshold: parseInt(e.target.value)})}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>Default Unit of Measure</Label>
                    <RadioGroup value={inventorySettings.defaultUnit} onValueChange={(value) => setInventorySettings({...inventorySettings, defaultUnit: value})}>
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="pcs" id="pcs" />
                        <Label htmlFor="pcs">Pieces</Label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="kg" id="kg" />
                        <Label htmlFor="kg">Kilograms</Label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="liter" id="liter" />
                        <Label htmlFor="liter">Liters</Label>
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
                  <Label htmlFor="autoBarcode">Enable barcode auto-generation for new products</Label>
                </div>

                <Button>Save Inventory Settings</Button>
              </CardContent>
            </Card>
          </TabsContent>

          {/* User Management Tab */}
          <TabsContent value="users">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Users className="h-5 w-5" />
                  User Management
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-center py-8 text-gray-500">User management features coming soon...</p>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Backup & Sync Tab */}
          <TabsContent value="backup">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Cloud className="h-5 w-5" />
                  Backup & Sync
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-center py-8 text-gray-500">Backup and sync features coming soon...</p>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Regional Settings Tab */}
          <TabsContent value="regional">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Globe className="h-5 w-5" />
                  Regional Settings
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-center py-8 text-gray-500">Regional settings coming soon...</p>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Notifications Tab */}
          <TabsContent value="notifications">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Bell className="h-5 w-5" />
                  Notifications & Alerts
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-center py-8 text-gray-500">Notification settings coming soon...</p>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Sharing & Export Tab */}
          <TabsContent value="sharing">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Share className="h-5 w-5" />
                  Sharing & Export
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-center py-8 text-gray-500">Sharing and export features coming soon...</p>
              </CardContent>
            </Card>
          </TabsContent>

          {/* App Info Tab */}
          <TabsContent value="info">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Info className="h-5 w-5" />
                  App Info & Support
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-4">
                  <div className="flex justify-between items-center">
                    <span className="font-medium">App Version</span>
                    <span className="text-gray-500">1.0.0</span>
                  </div>
                  
                  <div className="flex justify-between items-center">
                    <span className="font-medium">Last Updated</span>
                    <span className="text-gray-500">Dec 24, 2024</span>
                  </div>
                  
                  <div className="flex justify-between items-center">
                    <span className="font-medium">GraphQL Status</span>
                    <Badge variant="default">Connected</Badge>
                  </div>
                </div>
                
                <div className="space-y-2">
                  <Button variant="outline" className="w-full">Terms of Service</Button>
                  <Button variant="outline" className="w-full">Privacy Policy</Button>
                  <Button variant="outline" className="w-full">Contact Support</Button>
                </div>
                
                <div className="pt-4 border-t">
                  <Button variant="destructive" className="w-full">Clear All Data</Button>
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