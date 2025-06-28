import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Store, ArrowLeft } from "lucide-react";
import { StoreRegistrationInput } from "@/lib/graphql/auth-types";

interface StoreRegistrationProps {
  onRegister: (data: StoreRegistrationInput) => void;
  onBack: () => void;
  loading?: boolean;
}

const StoreRegistration = ({ onRegister, onBack, loading }: StoreRegistrationProps) => {
  const [formData, setFormData] = useState<StoreRegistrationInput>({
    name: "",
    type: "",
    ownerName: "",
    ownerEmail: "",
    ownerPhone: "",
    gstin: "",
    address: "",
    city: "",
    state: "",
    pincode: "",
    deviceId: ""
  });

  const [errors, setErrors] = useState<Record<string, string>>({});

  const storeTypes = [
    "Retail Store",
    "Grocery Store", 
    "Electronics Store",
    "Clothing Store",
    "Restaurant",
    "Pharmacy",
    "Hardware Store",
    "Book Store",
    "Jewelry Store",
    "Other"
  ];

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.name.trim()) newErrors.name = "Store name is required";
    if (!formData.type) newErrors.type = "Store type is required";
    if (!formData.ownerName.trim()) newErrors.ownerName = "Owner name is required";
    if (!formData.ownerEmail.trim()) newErrors.ownerEmail = "Owner email is required";
    if (!formData.ownerPhone.trim()) newErrors.ownerPhone = "Owner phone is required";
    if (!formData.address.trim()) newErrors.address = "Address is required";
    if (!formData.city.trim()) newErrors.city = "City is required";
    if (!formData.state.trim()) newErrors.state = "State is required";
    if (!formData.pincode.trim()) newErrors.pincode = "Pincode is required";

    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (formData.ownerEmail && !emailRegex.test(formData.ownerEmail)) {
      newErrors.ownerEmail = "Invalid email format";
    }

    // Phone validation
    const phoneRegex = /^[6-9]\d{9}$/;
    if (formData.ownerPhone && !phoneRegex.test(formData.ownerPhone)) {
      newErrors.ownerPhone = "Invalid phone number";
    }

    // GSTIN validation (optional but if provided should be valid)
    if (formData.gstin) {
      const gstinRegex = /^[0-9]{2}[A-Z]{5}[0-9]{4}[A-Z]{1}[1-9A-Z]{1}Z[0-9A-Z]{1}$/;
      if (!gstinRegex.test(formData.gstin)) {
        newErrors.gstin = "Invalid GSTIN format";
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (validateForm()) {
      onRegister(formData);
    }
  };

  const handleInputChange = (field: keyof StoreRegistrationInput, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    
    // Clear error when user starts typing
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: "" }));
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3 mb-6">
        <Button variant="ghost" size="sm" onClick={onBack}>
          <ArrowLeft className="h-4 w-4" />
        </Button>
        <div className="bg-blue-600 p-2 rounded-lg">
          <Store className="h-6 w-6 text-white" />
        </div>
        <div>
          <h2 className="text-xl font-semibold">Store Registration</h2>
          <p className="text-sm text-gray-600">Set up your store profile</p>
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Store Information</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="storeName">Store Name *</Label>
                <Input
                  id="storeName"
                  value={formData.name}
                  onChange={(e) => handleInputChange('name', e.target.value)}
                  placeholder="Enter store name"
                  className={errors.name ? 'border-red-500' : ''}
                />
                {errors.name && <p className="text-sm text-red-500">{errors.name}</p>}
              </div>

              <div className="space-y-2">
                <Label htmlFor="storeType">Store Type *</Label>
                <Select value={formData.type} onValueChange={(value) => handleInputChange('type', value)}>
                  <SelectTrigger className={errors.type ? 'border-red-500' : ''}>
                    <SelectValue placeholder="Select store type" />
                  </SelectTrigger>
                  <SelectContent>
                    {storeTypes.map((type) => (
                      <SelectItem key={type} value={type}>{type}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                {errors.type && <p className="text-sm text-red-500">{errors.type}</p>}
              </div>

              <div className="space-y-2">
                <Label htmlFor="ownerName">Owner Name *</Label>
                <Input
                  id="ownerName"
                  value={formData.ownerName}
                  onChange={(e) => handleInputChange('ownerName', e.target.value)}
                  placeholder="Enter owner name"
                  className={errors.ownerName ? 'border-red-500' : ''}
                />
                {errors.ownerName && <p className="text-sm text-red-500">{errors.ownerName}</p>}
              </div>

              <div className="space-y-2">
                <Label htmlFor="ownerEmail">Owner Email *</Label>
                <Input
                  id="ownerEmail"
                  type="email"
                  value={formData.ownerEmail}
                  onChange={(e) => handleInputChange('ownerEmail', e.target.value)}
                  placeholder="Enter owner email"
                  className={errors.ownerEmail ? 'border-red-500' : ''}
                />
                {errors.ownerEmail && <p className="text-sm text-red-500">{errors.ownerEmail}</p>}
              </div>

              <div className="space-y-2">
                <Label htmlFor="ownerPhone">Owner Phone *</Label>
                <Input
                  id="ownerPhone"
                  value={formData.ownerPhone}
                  onChange={(e) => handleInputChange('ownerPhone', e.target.value)}
                  placeholder="Enter 10-digit phone number"
                  className={errors.ownerPhone ? 'border-red-500' : ''}
                />
                {errors.ownerPhone && <p className="text-sm text-red-500">{errors.ownerPhone}</p>}
              </div>

              <div className="space-y-2">
                <Label htmlFor="gstin">GSTIN (Optional)</Label>
                <Input
                  id="gstin"
                  value={formData.gstin}
                  onChange={(e) => handleInputChange('gstin', e.target.value.toUpperCase())}
                  placeholder="Enter GSTIN"
                  className={errors.gstin ? 'border-red-500' : ''}
                />
                {errors.gstin && <p className="text-sm text-red-500">{errors.gstin}</p>}
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="address">Address *</Label>
              <Textarea
                id="address"
                value={formData.address}
                onChange={(e) => handleInputChange('address', e.target.value)}
                placeholder="Enter complete address"
                className={errors.address ? 'border-red-500' : ''}
              />
              {errors.address && <p className="text-sm text-red-500">{errors.address}</p>}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="space-y-2">
                <Label htmlFor="city">City *</Label>
                <Input
                  id="city"
                  value={formData.city}
                  onChange={(e) => handleInputChange('city', e.target.value)}
                  placeholder="Enter city"
                  className={errors.city ? 'border-red-500' : ''}
                />
                {errors.city && <p className="text-sm text-red-500">{errors.city}</p>}
              </div>

              <div className="space-y-2">
                <Label htmlFor="state">State *</Label>
                <Input
                  id="state"
                  value={formData.state}
                  onChange={(e) => handleInputChange('state', e.target.value)}
                  placeholder="Enter state"
                  className={errors.state ? 'border-red-500' : ''}
                />
                {errors.state && <p className="text-sm text-red-500">{errors.state}</p>}
              </div>

              <div className="space-y-2">
                <Label htmlFor="pincode">Pincode *</Label>
                <Input
                  id="pincode"
                  value={formData.pincode}
                  onChange={(e) => handleInputChange('pincode', e.target.value)}
                  placeholder="Enter pincode"
                  className={errors.pincode ? 'border-red-500' : ''}
                />
                {errors.pincode && <p className="text-sm text-red-500">{errors.pincode}</p>}
              </div>
            </div>

            <div className="flex gap-3 pt-4">
              <Button type="button" variant="outline" onClick={onBack} className="flex-1">
                Back
              </Button>
              <Button 
                type="submit" 
                className="flex-1 bg-blue-600 hover:bg-blue-700"
                disabled={loading}
              >
                {loading ? "Registering..." : "Register Store"}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};

export default StoreRegistration;