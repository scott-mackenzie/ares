import { useEffect, useState } from "react";
import { useAuth } from "@/hooks/useAuth";
import { useToast } from "@/hooks/use-toast";
import Sidebar from "@/components/sidebar";
import MetricsCards from "@/components/metrics-cards";
import ReportsTable from "@/components/reports-table";
import AdminClients from "@/components/admin-clients";
import AdminFindings from "@/components/admin-findings";
import AdminAPI from "@/components/admin-api";
import AdminDatabase from "@/components/admin-database";
import RoleSwitcher from "@/components/role-switcher";
import UserProfileDropdown from "@/components/user-profile-dropdown";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { 
  AlertTriangle, 
  Bug, 
  Shield, 
  ShieldCheck, 
  Calendar,
  Library,
  Puzzle,
  BarChart3,
  FileCheck,
  Eye,
  Webhook,
  Flag,
  Workflow,
  BookOpen,
  Bot
} from "lucide-react";

export default function AdminDashboard() {
  const { toast } = useToast();
  const { isAuthenticated, isLoading } = useAuth();
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

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
      </div>
    );
  }

  const { user } = useAuth();

  return (
    <div className="flex h-screen bg-slate-50">
      <Sidebar activeView={activeView} setActiveView={setActiveView} />
      
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Header */}
        <header className="bg-white border-b border-gray-200 px-6 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Admin Dashboard</h1>
              <p className="text-gray-600">Manage penetration testing reports and security assessments</p>
            </div>
            <UserProfileDropdown />
          </div>
        </header>



        {/* Main Content */}
        <main className="flex-1 overflow-y-auto p-6">
          {activeView === "dashboard" && (
            <>
              <MetricsCards />
              <ReportsTable />
            </>
          )}
          {activeView === "reports" && <ReportsTable />}
          {activeView === "clients" && <AdminClients />}
          {activeView === "findings" && <AdminFindings />}
          {/* Red Team Function Views */}
          {activeView === "red-scheduler" && (
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-3xl font-bold text-gray-900">Red Team Scheduler</h2>
                  <p className="text-gray-600">Plan and schedule offensive security operations</p>
                </div>
                <Button>
                  <Calendar className="w-4 h-4 mr-2" />
                  New Schedule
                </Button>
              </div>
              <Card>
                <CardHeader>
                  <CardTitle>Upcoming Red Team Operations</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-center py-8 text-gray-500">
                    <Calendar className="w-12 h-12 mx-auto mb-4 opacity-50" />
                    <p>No scheduled operations. Create your first security engagement.</p>
                  </div>
                </CardContent>
              </Card>
            </div>
          )}
          
          {activeView === "red-content" && (
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-3xl font-bold text-gray-900">Red Team Content Library</h2>
                  <p className="text-gray-600">Access security tools, scripts, and resources</p>
                </div>
                <Button>
                  <Library className="w-4 h-4 mr-2" />
                  Add Content
                </Button>
              </div>
              <Card>
                <CardHeader>
                  <CardTitle>Security Tools & Resources</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-center py-8 text-gray-500">
                    <Library className="w-12 h-12 mx-auto mb-4 opacity-50" />
                    <p>Content library is empty. Add your first security tool or script.</p>
                  </div>
                </CardContent>
              </Card>
            </div>
          )}
          
          {activeView === "red-analytics" && (
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-3xl font-bold text-gray-900">Red Team Analytics</h2>
                  <p className="text-gray-600">Offensive security metrics and insights</p>
                </div>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <Card>
                  <CardHeader>
                    <CardTitle className="text-sm">Attack Success Rate</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">73%</div>
                    <p className="text-xs text-gray-600">Last 30 days</p>
                  </CardContent>
                </Card>
                <Card>
                  <CardHeader>
                    <CardTitle className="text-sm">Vulnerabilities Found</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">142</div>
                    <p className="text-xs text-gray-600">This quarter</p>
                  </CardContent>
                </Card>
                <Card>
                  <CardHeader>
                    <CardTitle className="text-sm">Average Time to Exploit</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">2.3h</div>
                    <p className="text-xs text-gray-600">Median time</p>
                  </CardContent>
                </Card>
                <Card>
                  <CardHeader>
                    <CardTitle className="text-sm">Active Campaigns</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">5</div>
                    <p className="text-xs text-gray-600">Currently running</p>
                  </CardContent>
                </Card>
              </div>
            </div>
          )}
          
          {activeView === "red-ai" && (
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-3xl font-bold text-gray-900">ARES.AI - Red Team</h2>
                  <p className="text-gray-600">AI-powered offensive security assistance</p>
                </div>
              </div>
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <Bot className="w-5 h-5 mr-2" />
                    AI Security Assistant
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-center py-8 text-gray-500">
                    <Bot className="w-12 h-12 mx-auto mb-4 opacity-50" />
                    <p>ARES.AI is ready to assist with offensive security operations.</p>
                    <Button className="mt-4">Start AI Session</Button>
                  </div>
                </CardContent>
              </Card>
            </div>
          )}
          
          {/* Blue Team Function Views */}
          {activeView === "blue-scheduler" && (
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-3xl font-bold text-gray-900">Blue Team Scheduler</h2>
                  <p className="text-gray-600">Plan and schedule defensive security operations</p>
                </div>
                <Button>
                  <Calendar className="w-4 h-4 mr-2" />
                  New Schedule
                </Button>
              </div>
              <Card>
                <CardHeader>
                  <CardTitle>Upcoming Blue Team Operations</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-center py-8 text-gray-500">
                    <Calendar className="w-12 h-12 mx-auto mb-4 opacity-50" />
                    <p>No scheduled operations. Create your first monitoring task.</p>
                  </div>
                </CardContent>
              </Card>
            </div>
          )}
          
          {activeView === "blue-analytics" && (
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-3xl font-bold text-gray-900">Blue Team Analytics</h2>
                  <p className="text-gray-600">Defensive security metrics and insights</p>
                </div>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <Card>
                  <CardHeader>
                    <CardTitle className="text-sm">Threat Detection Rate</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">94%</div>
                    <p className="text-xs text-gray-600">Last 30 days</p>
                  </CardContent>
                </Card>
                <Card>
                  <CardHeader>
                    <CardTitle className="text-sm">Incidents Resolved</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">67</div>
                    <p className="text-xs text-gray-600">This month</p>
                  </CardContent>
                </Card>
                <Card>
                  <CardHeader>
                    <CardTitle className="text-sm">Average Response Time</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">4.2m</div>
                    <p className="text-xs text-gray-600">Median time</p>
                  </CardContent>
                </Card>
                <Card>
                  <CardHeader>
                    <CardTitle className="text-sm">Active Monitors</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">28</div>
                    <p className="text-xs text-gray-600">Currently active</p>
                  </CardContent>
                </Card>
              </div>
            </div>
          )}
          {activeView === "api" && <AdminAPI />}
          {activeView === "database" && <AdminDatabase />}
        </main>
      </div>
    </div>
  );
}
