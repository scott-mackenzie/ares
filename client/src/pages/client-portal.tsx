import { useEffect, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { useAuth } from "@/hooks/useAuth";
import { useToast } from "@/hooks/use-toast";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Download, Eye, Calendar, AlertTriangle, FileText, Shield } from "lucide-react";
import RoleSwitcher from "@/components/role-switcher";
import ClientSidebar from "@/components/client-sidebar";
import UserProfileDropdown from "@/components/user-profile-dropdown";
import ClientMessages from "@/components/client-messages";
import ClientDownloads from "@/components/client-downloads";
import type { Report } from "@shared/schema";

export default function ClientPortal() {
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

  const { data: reports = [], isLoading: reportsLoading } = useQuery({
    queryKey: ["/api/reports"],
    enabled: isAuthenticated,
  });

  if (isLoading || reportsLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
      </div>
    );
  }

  return (
    <div className="flex h-screen bg-slate-50">
      <ClientSidebar activeView={activeView} setActiveView={setActiveView} />
      
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Header */}
        <header className="bg-white border-b border-gray-200 px-6 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Client Portal</h1>
              <p className="text-gray-600">Access your security reports and communicate with your team</p>
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
                    <CardTitle className="text-sm font-medium">Total Reports</CardTitle>
                    <FileText className="h-4 w-4 text-muted-foreground" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">{reports.length}</div>
                    <p className="text-xs text-muted-foreground">Available for download</p>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">Critical Issues</CardTitle>
                    <AlertTriangle className="h-4 w-4 text-red-500" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold text-red-600">2</div>
                    <p className="text-xs text-muted-foreground">Requiring attention</p>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">Last Updated</CardTitle>
                    <Calendar className="h-4 w-4 text-muted-foreground" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">3d</div>
                    <p className="text-xs text-muted-foreground">Days ago</p>
                  </CardContent>
                </Card>
              </div>
            </>
          )}
          
          {activeView === "reports" && (
            <div className="space-y-6">
              <h2 className="text-2xl font-bold text-gray-900">My Reports</h2>
              {reports.length === 0 ? (
                <Card>
                  <CardContent className="flex flex-col items-center justify-center py-12">
                    <Shield className="h-12 w-12 text-gray-400 mb-4" />
                    <h3 className="text-lg font-semibold text-gray-900 mb-2">No Reports Available</h3>
                    <p className="text-gray-600 text-center">
                      Your security reports will appear here once they are completed.
                    </p>
                  </CardContent>
                </Card>
              ) : (
                <div className="grid gap-6">
                  {reports.map((report: any) => (
                    <Card key={report.id}>
                      <CardContent className="p-6">
                        <div className="flex items-center justify-between">
                          <div>
                            <h3 className="text-lg font-semibold">{report.title}</h3>
                            <p className="text-sm text-gray-600">
                              Created: {new Date(report.createdAt).toLocaleDateString()}
                            </p>
                          </div>
                          <div className="flex gap-2">
                            <Button variant="outline" size="sm">
                              <Eye className="h-4 w-4 mr-2" />
                              Preview
                            </Button>
                            <Button size="sm">
                              <Download className="h-4 w-4 mr-2" />
                              Download
                            </Button>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              )}
            </div>
          )}
          
          {activeView === "downloads" && <ClientDownloads />}
          {activeView === "messages" && <ClientMessages />}
        </main>
      </div>
    </div>
  );
}