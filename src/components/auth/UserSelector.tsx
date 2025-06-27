import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { 
  User, 
  Shield, 
  UserCheck, 
  Clock,
  Plus,
  ArrowLeft
} from "lucide-react";
import { DeviceUser } from "@/lib/graphql/auth-types";

interface UserSelectorProps {
  users: DeviceUser[];
  onUserSelect: (user: DeviceUser) => void;
  onAddNewUser: () => void;
  onBack: () => void;
  loading?: boolean;
}

const UserSelector = ({ users, onUserSelect, onAddNewUser, onBack, loading }: UserSelectorProps) => {
  const [selectedUser, setSelectedUser] = useState<DeviceUser | null>(null);

  const getRoleIcon = (role: string) => {
    switch (role) {
      case 'admin':
        return <Shield className="h-4 w-4 text-red-500" />;
      case 'manager':
        return <UserCheck className="h-4 w-4 text-blue-500" />;
      case 'cashier':
        return <User className="h-4 w-4 text-green-500" />;
      default:
        return <User className="h-4 w-4 text-gray-500" />;
    }
  };

  const getRoleBadgeColor = (role: string) => {
    switch (role) {
      case 'admin':
        return 'destructive';
      case 'manager':
        return 'default';
      case 'cashier':
        return 'secondary';
      default:
        return 'outline';
    }
  };

  const formatLastLogin = (lastLogin?: string) => {
    if (!lastLogin) return 'Never';
    
    const date = new Date(lastLogin);
    const now = new Date();
    const diffInHours = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60));
    
    if (diffInHours < 1) return 'Just now';
    if (diffInHours < 24) return `${diffInHours}h ago`;
    if (diffInHours < 168) return `${Math.floor(diffInHours / 24)}d ago`;
    return date.toLocaleDateString();
  };

  if (loading) {
    return (
      <div className="space-y-4">
        <div className="flex items-center gap-3 mb-6">
          <Button variant="ghost" size="sm" onClick={onBack}>
            <ArrowLeft className="h-4 w-4" />
          </Button>
          <h2 className="text-xl font-semibold">Select User</h2>
        </div>
        <div className="text-center py-8">Loading users...</div>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-3 mb-6">
        <Button variant="ghost" size="sm" onClick={onBack}>
          <ArrowLeft className="h-4 w-4" />
        </Button>
        <h2 className="text-xl font-semibold">Select User</h2>
      </div>

      <div className="grid gap-3">
        {users.map((user) => (
          <Card 
            key={user.id} 
            className={`cursor-pointer transition-all hover:shadow-md ${
              selectedUser?.id === user.id ? 'ring-2 ring-blue-500' : ''
            } ${!user.isActive ? 'opacity-60' : ''}`}
            onClick={() => {
              setSelectedUser(user);
              onUserSelect(user);
            }}
          >
            <CardContent className="p-4">
              <div className="flex items-center gap-4">
                <Avatar className="h-12 w-12">
                  <AvatarImage src={user.avatar} />
                  <AvatarFallback className="bg-blue-100 text-blue-600">
                    {user.name.split(' ').map(n => n[0]).join('').toUpperCase()}
                  </AvatarFallback>
                </Avatar>
                
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <h3 className="font-medium truncate">{user.name}</h3>
                    {getRoleIcon(user.role)}
                    <Badge variant={getRoleBadgeColor(user.role) as any} className="text-xs">
                      {user.role.charAt(0).toUpperCase() + user.role.slice(1)}
                    </Badge>
                  </div>
                  
                  <div className="text-sm text-gray-500 space-y-1">
                    {user.email && (
                      <p className="truncate">{user.email}</p>
                    )}
                    {user.phone && (
                      <p>{user.phone}</p>
                    )}
                    <div className="flex items-center gap-1">
                      <Clock className="h-3 w-3" />
                      <span>Last login: {formatLastLogin(user.lastLogin)}</span>
                    </div>
                  </div>
                </div>

                {!user.isActive && (
                  <Badge variant="outline" className="text-xs">
                    Inactive
                  </Badge>
                )}
              </div>
            </CardContent>
          </Card>
        ))}

        {/* Add New User Option */}
        <Card 
          className="cursor-pointer transition-all hover:shadow-md border-dashed border-2 border-gray-300 hover:border-blue-400"
          onClick={onAddNewUser}
        >
          <CardContent className="p-4">
            <div className="flex items-center justify-center gap-3 text-gray-500 hover:text-blue-600">
              <Plus className="h-6 w-6" />
              <span className="font-medium">Add New User</span>
            </div>
          </CardContent>
        </Card>
      </div>

      {users.length === 0 && (
        <div className="text-center py-8 text-gray-500">
          <User className="h-12 w-12 mx-auto mb-4 text-gray-300" />
          <p className="text-lg font-medium mb-2">No users found</p>
          <p className="text-sm mb-4">Add the first user to get started</p>
          <Button onClick={onAddNewUser} className="bg-blue-600 hover:bg-blue-700">
            <Plus className="h-4 w-4 mr-2" />
            Add First User
          </Button>
        </div>
      )}
    </div>
  );
};

export default UserSelector;