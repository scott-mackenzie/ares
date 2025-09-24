import { useAuth } from "@/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { 
  Shield, 
  BarChart3, 
  FileText, 
  Users, 
  Bug, 
  User, 
  Handshake,
  LogOut
} from "lucide-react";

interface PartnerSidebarProps {
  activeView: string;
  setActiveView: (view: string) => void;
}

export default function PartnerSidebar({ activeView, setActiveView }: PartnerSidebarProps) {
  const { user } = useAuth();

  const handleLogout = () => {
    window.location.href = "/api/logout";
  };

  const navigationItems = [
    { id: "dashboard", label: "Dashboard", icon: BarChart3 },
    { id: "assessments", label: "Assessments", icon: FileText },
    { id: "clients", label: "Client Management", icon: Users },
    { id: "findings", label: "Security Findings", icon: Bug },
  ];

  const portals = [
    { id: "partner", label: "Partner Portal", icon: Handshake },
    { id: "admin", label: "Admin Portal", icon: Shield },
    { id: "client", label: "Client Portal", icon: User },
  ];

  return (
    <div className="w-64 bg-black text-white flex flex-col">
      {/* Logo */}
      <div className="p-6 border-b border-purple-800">
        <div className="flex items-center space-x-2">
          <Shield className="h-8 w-8 text-primary" />
          <span className="text-xl font-bold">ARES</span>
        </div>
        <div className="text-sm text-purple-300 mt-1">Partner Portal</div>
      </div>

      {/* Navigation Menu */}
      <nav className="flex-1 mt-6">
        <div className="px-4 space-y-2">
          {navigationItems.map((item) => {
            const Icon = item.icon;
            return (
              <button
                key={item.id}
                onClick={() => setActiveView(item.id)}
                className={`sidebar-nav-item w-full ${
                  activeView === item.id ? "active" : ""
                }`}
              >
                <Icon className="w-5 h-5 mr-3" />
                {item.label}
              </button>
            );
          })}
        </div>

        {/* Portal Switcher */}
        <div className="px-4 mt-8">
          <div className="text-xs font-semibold text-slate-400 uppercase tracking-wide mb-3">
            Switch Portal
          </div>
          <div className="space-y-2">
            {portals.map((portal) => {
              const Icon = portal.icon;
              return (
                <button
                  key={portal.id}
                  onClick={() => {
                    const roleMap = {
                      admin: 'admin',
                      client: 'client', 
                      partner: 'partner'
                    };
                    const targetRole = roleMap[portal.id as keyof typeof roleMap];
                    if (targetRole) {
                      fetch('/api/auth/role', {
                        method: 'PATCH',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify({ role: targetRole })
                      }).then(() => {
                        window.location.reload();
                      });
                    }
                  }}
                  className="flex items-center px-4 py-2 text-slate-400 hover:bg-slate-700 hover:text-white rounded transition-colors w-full text-left"
                >
                  <Icon className="w-4 h-4 mr-3" />
                  {portal.label}
                </button>
              );
            })}
          </div>
        </div>
      </nav>
    </div>
  );
}