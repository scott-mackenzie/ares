import { useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/queryClient";
import { Badge } from "@/components/ui/badge";
import { User, Shield, Building } from "lucide-react";

interface RoleSwitcherProps {
  currentRole: string;
}

export default function RoleSwitcher({ currentRole }: RoleSwitcherProps) {
  const [selectedRole, setSelectedRole] = useState(currentRole);
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const updateRoleMutation = useMutation({
    mutationFn: async (role: string) => {
      const response = await fetch('/api/auth/role', {
        method: "PATCH",
        body: JSON.stringify({ role }),
        headers: { "Content-Type": "application/json" },
      });
      if (!response.ok) {
        throw new Error('Failed to update role');
      }
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/auth/user"] });
      toast({
        title: "Role Updated",
        description: `Successfully switched to ${selectedRole} role`,
      });
      // Reload the page to update the UI
      window.location.reload();
    },
    onError: () => {
      toast({
        title: "Error",
        description: "Failed to update role",
        variant: "destructive",
      });
    },
  });

  const getRoleIcon = (role: string) => {
    switch (role) {
      case "admin":
        return <Shield className="h-4 w-4" />;
      case "partner":
        return <Building className="h-4 w-4" />;
      case "client":
        return <User className="h-4 w-4" />;
      default:
        return <User className="h-4 w-4" />;
    }
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

  return (
    <div className="flex items-center gap-3 p-4 bg-gradient-to-r from-purple-600 to-slate-800 rounded-lg border border-purple-400/30 shadow-lg">
      <div className="flex items-center gap-2">
        <span className="text-sm font-medium text-white">Current Role:</span>
        <Badge variant={getRoleBadgeVariant(currentRole)} className="flex items-center gap-1 bg-white/20 text-white border-white/30">
          {getRoleIcon(currentRole)}
          {currentRole.charAt(0).toUpperCase() + currentRole.slice(1)}
        </Badge>
      </div>
      
      <div className="flex items-center gap-2">
        <span className="text-sm font-medium text-white">Switch to:</span>
        <Select value={selectedRole} onValueChange={setSelectedRole}>
          <SelectTrigger className="w-32 bg-white/20 border-white/30 text-white hover:bg-white/30">
            <SelectValue />
          </SelectTrigger>
          <SelectContent className="bg-slate-800 border-purple-400/30">
            <SelectItem value="admin" className="text-white hover:bg-purple-600/50">Admin</SelectItem>
            <SelectItem value="partner" className="text-white hover:bg-purple-600/50">Partner</SelectItem>
            <SelectItem value="client" className="text-white hover:bg-purple-600/50">Client</SelectItem>
          </SelectContent>
        </Select>
        
        <Button
          onClick={() => updateRoleMutation.mutate(selectedRole)}
          disabled={selectedRole === currentRole || updateRoleMutation.isPending}
          size="sm"
          className="bg-purple-500 hover:bg-purple-600 text-white border-0 disabled:opacity-50"
        >
          {updateRoleMutation.isPending ? "Updating..." : "Switch"}
        </Button>
      </div>
    </div>
  );
}