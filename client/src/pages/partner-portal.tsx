import { useAuth } from "@/hooks/useAuth";
import { useEffect, useState } from "react";
import { useToast } from "@/hooks/use-toast";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Building, FileText, Users, AlertTriangle, LogOut } from "lucide-react";
import RoleSwitcher from "@/components/role-switcher";
import PartnerSidebar from "@/components/partner-sidebar";
import UserProfileDropdown from "@/components/user-profile-dropdown";
import AdminClients from "@/components/admin-clients";
import ReportsTable from "@/components/reports-table";
import AdminFindings from "@/components/admin-findings";

export default function PartnerPortal() {
  const { toast } = useToast();
  const { isAuthenticated, isLoading, user } = useAuth();
  const [activeView, setActiveView] = useState("dashboard");

  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      toast({
        title: "Unauthorized",
        description: "You are logged out. Logging in again...",
        variant: "destructive",
      });
      setTimeout(() => {
        window.location.href = "/api/login";
      }, 500);
      return;
    }
  }, [isAuthenticated, isLoading, toast]);

  if (!user) return null;

  return (
    <div className="flex h-screen bg-slate-50">
      <PartnerSidebar activeView={activeView} setActiveView={setActiveView} />
      
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Header */}
        <header className="bg-white border-b border-gray-200 px-6 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Partner Portal</h1>
              <p className="text-gray-600">Manage client assessments and security projects</p>
            </div>
            <UserProfileDropdown />
          </div>
        </header>



        {/* Main Content */}
        <main className="flex-1 overflow-y-auto p-6">
          {activeView === "dashboard" && (
            <>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                <Card>
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">Partner Reports</CardTitle>
                    <FileText className="h-4 w-4 text-purple-400" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">12</div>
                    <p className="text-xs text-muted-foreground">Active assessments</p>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">Client Organizations</CardTitle>
                    <Users className="h-4 w-4 text-purple-400" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">8</div>
                    <p className="text-xs text-muted-foreground">Under management</p>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">Critical Findings</CardTitle>
                    <AlertTriangle className="h-4 w-4 text-red-400" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">3</div>
                    <p className="text-xs text-muted-foreground">Requiring attention</p>
                  </CardContent>
                </Card>
              </div>
            </>
          )}
          
          {activeView === "assessments" && <ReportsTable />}
          {activeView === "clients" && <AdminClients />}
          {activeView === "findings" && <AdminFindings />}
        </main>
      </div>
    </div>
  );
}