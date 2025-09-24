import { useState } from "react";
import { useAuth } from "@/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { 
  User, 
  Settings, 
  Key, 
  Upload, 
  Shield, 
  LogOut,
  ChevronDown
} from "lucide-react";

export default function UserProfileDropdown() {
  const { user } = useAuth();
  const [profileDialog, setProfileDialog] = useState(false);
  const [settingsDialog, setSettingsDialog] = useState(false);
  const [passwordDialog, setPasswordDialog] = useState(false);

  const handleLogout = () => {
    window.location.href = "/api/logout";
  };

  const getRoleBadgeVariant = (role: string) => {
    switch (role) {
      case "admin":
        return "destructive";
      case "partner":
        return "secondary";
      case "client":
        return "outline";
      default:
        return "outline";
    }
  };

  if (!user) return null;

  return (
    <>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" className="flex items-center gap-2 hover:bg-gray-100">
            <Avatar className="h-8 w-8">
              <AvatarImage src={user.profileImageUrl || ""} />
              <AvatarFallback>
                {user.firstName?.[0]}{user.lastName?.[0] || user.email?.[0]}
              </AvatarFallback>
            </Avatar>
            <div className="hidden md:flex items-center gap-2">
              <div className="text-left">
                <div className="text-sm font-medium">
                  {user.firstName} {user.lastName || user.email}
                </div>
                <Badge variant={getRoleBadgeVariant(user.role || "client")} className="text-xs">
                  {(user.role || "client").charAt(0).toUpperCase() + (user.role || "client").slice(1)}
                </Badge>
              </div>
              <ChevronDown className="h-4 w-4" />
            </div>
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="w-56">
          <DropdownMenuLabel>
            <div className="flex flex-col space-y-1">
              <p className="text-sm font-medium leading-none">
                {user.firstName} {user.lastName}
              </p>
              <p className="text-xs leading-none text-muted-foreground">
                {user.email}
              </p>
            </div>
          </DropdownMenuLabel>
          <DropdownMenuSeparator />
          
          <DropdownMenuItem onClick={() => setProfileDialog(true)}>
            <User className="mr-2 h-4 w-4" />
            <span>Profile</span>
          </DropdownMenuItem>
          
          <DropdownMenuItem onClick={() => setSettingsDialog(true)}>
            <Settings className="mr-2 h-4 w-4" />
            <span>Settings</span>
          </DropdownMenuItem>
          
          <DropdownMenuItem onClick={() => setPasswordDialog(true)}>
            <Key className="mr-2 h-4 w-4" />
            <span>Change Password</span>
          </DropdownMenuItem>
          
          <DropdownMenuItem>
            <Shield className="mr-2 h-4 w-4" />
            <span>Permissions</span>
          </DropdownMenuItem>
          
          <DropdownMenuSeparator />
          
          <DropdownMenuItem onClick={handleLogout} className="text-red-600">
            <LogOut className="mr-2 h-4 w-4" />
            <span>Sign Out</span>
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>

      {/* Profile Dialog */}
      <Dialog open={profileDialog} onOpenChange={setProfileDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>User Profile</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div className="flex items-center space-x-4">
              <Avatar className="h-20 w-20">
                <AvatarImage src={user.profileImageUrl || ""} />
                <AvatarFallback className="text-lg">
                  {user.firstName?.[0]}{user.lastName?.[0] || user.email?.[0]}
                </AvatarFallback>
              </Avatar>
              <div>
                <Button variant="outline" size="sm">
                  <Upload className="h-4 w-4 mr-2" />
                  Upload Photo
                </Button>
                <p className="text-xs text-muted-foreground mt-1">
                  JPG, PNG up to 5MB
                </p>
              </div>
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="firstName">First Name</Label>
                <Input id="firstName" defaultValue={user.firstName || ""} />
              </div>
              <div>
                <Label htmlFor="lastName">Last Name</Label>
                <Input id="lastName" defaultValue={user.lastName || ""} />
              </div>
            </div>
            
            <div>
              <Label htmlFor="email">Email</Label>
              <Input id="email" defaultValue={user.email || ""} disabled />
            </div>
            
            <div>
              <Label>Role</Label>
              <div className="mt-1">
                <Badge variant={getRoleBadgeVariant(user.role || "client")}>
                  {(user.role || "client").charAt(0).toUpperCase() + (user.role || "client").slice(1)}
                </Badge>
              </div>
            </div>
            
            <div className="flex justify-end space-x-2">
              <Button variant="outline" onClick={() => setProfileDialog(false)}>
                Cancel
              </Button>
              <Button>Save Changes</Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Settings Dialog */}
      <Dialog open={settingsDialog} onOpenChange={setSettingsDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Settings</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <Label>Email Notifications</Label>
              <div className="space-y-2 mt-2">
                <label className="flex items-center space-x-2">
                  <input type="checkbox" defaultChecked />
                  <span className="text-sm">New report notifications</span>
                </label>
                <label className="flex items-center space-x-2">
                  <input type="checkbox" defaultChecked />
                  <span className="text-sm">Security alerts</span>
                </label>
                <label className="flex items-center space-x-2">
                  <input type="checkbox" />
                  <span className="text-sm">Weekly summaries</span>
                </label>
              </div>
            </div>
            
            <div>
              <Label>Theme Preference</Label>
              <div className="space-y-2 mt-2">
                <label className="flex items-center space-x-2">
                  <input type="radio" name="theme" defaultChecked />
                  <span className="text-sm">Light mode</span>
                </label>
                <label className="flex items-center space-x-2">
                  <input type="radio" name="theme" />
                  <span className="text-sm">Dark mode</span>
                </label>
                <label className="flex items-center space-x-2">
                  <input type="radio" name="theme" />
                  <span className="text-sm">System default</span>
                </label>
              </div>
            </div>
            
            <div className="flex justify-end space-x-2">
              <Button variant="outline" onClick={() => setSettingsDialog(false)}>
                Cancel
              </Button>
              <Button>Save Settings</Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Change Password Dialog */}
      <Dialog open={passwordDialog} onOpenChange={setPasswordDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Change Password</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <Label htmlFor="currentPassword">Current Password</Label>
              <Input id="currentPassword" type="password" />
            </div>
            
            <div>
              <Label htmlFor="newPassword">New Password</Label>
              <Input id="newPassword" type="password" />
            </div>
            
            <div>
              <Label htmlFor="confirmPassword">Confirm New Password</Label>
              <Input id="confirmPassword" type="password" />
            </div>
            
            <div className="flex justify-end space-x-2">
              <Button variant="outline" onClick={() => setPasswordDialog(false)}>
                Cancel
              </Button>
              <Button>Update Password</Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}