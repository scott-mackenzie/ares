import { useState } from "react";
import { useAuth } from "@/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { 
  Shield, 
  BarChart3, 
  FileText, 
  Users, 
  Bug, 
  Code, 
  Database, 
  ShieldX, 
  User, 
  Handshake,
  LogOut,
  ChevronDown,
  ChevronRight,
  AlertTriangle,
  ShieldCheck,
  Calendar,
  Library,
  Puzzle,
  FileCheck,
  Eye,
  Webhook,
  Flag,
  Workflow,
  BookOpen,
  Bot
} from "lucide-react";

interface SidebarProps {
  activeView: string;
  setActiveView: (view: string) => void;
}

export default function Sidebar({ activeView, setActiveView }: SidebarProps) {
  const { user } = useAuth();
  const [purpleTeamExpanded, setPurpleTeamExpanded] = useState(false);
  const [redTeamExpanded, setRedTeamExpanded] = useState(false);
  const [blueTeamExpanded, setBlueTeamExpanded] = useState(false);

  const handleLogout = () => {
    window.location.href = "/api/logout";
  };

  const navigationItems = [
    { id: "dashboard", label: "Dashboard", icon: BarChart3 },
    { id: "reports", label: "Reports", icon: FileText },
    { id: "clients", label: "Clients", icon: Users },
    { id: "findings", label: "Findings", icon: Bug },
    { 
      id: "purple-team", 
      label: "Purple Team", 
      icon: Shield,
      hasSubItems: true,
      subItems: [
        { 
          id: "red-team", 
          label: "Red Team", 
          icon: AlertTriangle,
          hasSubItems: true,
          subItems: [
            { id: "red-scheduler", label: "Scheduler", icon: Calendar },
            { id: "red-content", label: "Content Library", icon: Library },
            { id: "red-integrations", label: "Core Integrations", icon: Puzzle },
            { id: "red-analytics", label: "Analytics", icon: BarChart3 },
            { id: "red-assessments", label: "Assessments", icon: FileCheck },
            { id: "red-exposure", label: "Exposure Management", icon: Eye },
            { id: "red-webhooks", label: "Webhooks", icon: Webhook },
            { id: "red-priorities", label: "Priorities", icon: Flag },
            { id: "red-workflow", label: "Workflow Automation", icon: Workflow },
            { id: "red-runbooks", label: "Procedures & Runbooks", icon: BookOpen },
            { id: "red-ai", label: "ARES.AI", icon: Bot }
          ]
        },
        { 
          id: "blue-team", 
          label: "Blue Team", 
          icon: ShieldCheck,
          hasSubItems: true,
          subItems: [
            { id: "blue-scheduler", label: "Scheduler", icon: Calendar },
            { id: "blue-content", label: "Content Library", icon: Library },
            { id: "blue-integrations", label: "Core Integrations", icon: Puzzle },
            { id: "blue-analytics", label: "Analytics", icon: BarChart3 },
            { id: "blue-assessments", label: "Assessments", icon: FileCheck },
            { id: "blue-exposure", label: "Exposure Management", icon: Eye },
            { id: "blue-webhooks", label: "Webhooks", icon: Webhook },
            { id: "blue-priorities", label: "Priorities", icon: Flag },
            { id: "blue-workflow", label: "Workflow Automation", icon: Workflow },
            { id: "blue-runbooks", label: "Procedures & Runbooks", icon: BookOpen },
            { id: "blue-ai", label: "ARES.AI", icon: Bot }
          ]
        }
      ]
    },
    { id: "api", label: "API", icon: Code },
    { id: "database", label: "Database", icon: Database },
  ];

  const portals = [
    { id: "admin", label: "Admin Portal", icon: ShieldX },
    { id: "client", label: "Client Portal", icon: User },
    { id: "partner", label: "Partner Portal", icon: Handshake },
  ];

  return (
    <div className="w-64 bg-black text-white flex flex-col">
      {/* Logo */}
      <div className="p-6 border-b border-purple-800">
        <div className="flex items-center space-x-2">
          <Shield className="h-8 w-8 text-primary" />
          <span className="text-xl font-bold">ARES</span>
        </div>
      </div>

      {/* Navigation Menu */}
      <nav className="flex-1 mt-6">
        <div className="px-4 space-y-2">
          {navigationItems.map((item) => {
            const Icon = item.icon;
            
            if (item.hasSubItems && item.id === "purple-team") {
              return (
                <div key={item.id}>
                  <button
                    onClick={() => setPurpleTeamExpanded(!purpleTeamExpanded)}
                    className={`sidebar-nav-item w-full ${
                      activeView.startsWith("red-") || activeView.startsWith("blue-") || activeView === "red-team" || activeView === "blue-team" ? "active" : ""
                    }`}
                  >
                    <Icon className="w-5 h-5 mr-3" />
                    {item.label}
                    {purpleTeamExpanded ? (
                      <ChevronDown className="w-4 h-4 ml-auto" />
                    ) : (
                      <ChevronRight className="w-4 h-4 ml-auto" />
                    )}
                  </button>
                  
                  {purpleTeamExpanded && (
                    <div className="ml-6 mt-2 space-y-1">
                      {item.subItems?.map((subItem) => {
                        const SubIcon = subItem.icon;
                        
                        if (subItem.hasSubItems) {
                          const isRedTeam = subItem.id === "red-team";
                          const isExpanded = isRedTeam ? redTeamExpanded : blueTeamExpanded;
                          const setExpanded = isRedTeam ? setRedTeamExpanded : setBlueTeamExpanded;
                          
                          return (
                            <div key={subItem.id}>
                              <button
                                onClick={() => setExpanded(!isExpanded)}
                                className={`sidebar-nav-item w-full text-sm ${
                                  activeView.startsWith(subItem.id.replace("-team", "-")) ? "active" : ""
                                }`}
                              >
                                <SubIcon className="w-4 h-4 mr-3" />
                                {subItem.label}
                                {isExpanded ? (
                                  <ChevronDown className="w-3 h-3 ml-auto" />
                                ) : (
                                  <ChevronRight className="w-3 h-3 ml-auto" />
                                )}
                              </button>
                              
                              {isExpanded && (
                                <div className="ml-6 mt-1 space-y-1">
                                  {subItem.subItems?.map((funcItem) => {
                                    const FuncIcon = funcItem.icon;
                                    return (
                                      <button
                                        key={funcItem.id}
                                        onClick={() => setActiveView(funcItem.id)}
                                        className={`sidebar-nav-item w-full text-xs ${
                                          activeView === funcItem.id ? "active" : ""
                                        }`}
                                      >
                                        <FuncIcon className="w-3 h-3 mr-2" />
                                        {funcItem.label}
                                      </button>
                                    );
                                  })}
                                </div>
                              )}
                            </div>
                          );
                        }
                        
                        return (
                          <button
                            key={subItem.id}
                            onClick={() => setActiveView(subItem.id)}
                            className={`sidebar-nav-item w-full text-sm ${
                              activeView === subItem.id ? "active" : ""
                            }`}
                          >
                            <SubIcon className="w-4 h-4 mr-3" />
                            {subItem.label}
                          </button>
                        );
                      })}
                    </div>
                  )}
                </div>
              );
            }
            
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
                    // Use role switcher to change roles and trigger portal switch
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
