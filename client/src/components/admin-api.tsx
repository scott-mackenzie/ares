import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { 
  Code, 
  Key, 
  Activity, 
  Globe, 
  Copy, 
  RefreshCw,
  ExternalLink,
  CheckCircle,
  XCircle 
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";

export default function AdminAPI() {
  const [apiKey, setApiKey] = useState("ares_sk_live_1234567890abcdef");
  const [testEndpoint, setTestEndpoint] = useState("/api/reports");
  const [testResult, setTestResult] = useState("");
  const { toast } = useToast();

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    toast({ title: "Copied", description: "API key copied to clipboard" });
  };

  const testAPICall = async () => {
    try {
      const response = await fetch(testEndpoint, {
        headers: {
          'Authorization': `Bearer ${apiKey}`,
          'Content-Type': 'application/json'
        }
      });
      const data = await response.json();
      setTestResult(JSON.stringify(data, null, 2));
      toast({ title: "Success", description: "API call successful" });
    } catch (error) {
      setTestResult(`Error: ${error instanceof Error ? error.message : 'Unknown error'}`);
      toast({ title: "Error", description: "API call failed", variant: "destructive" });
    }
  };

  const apiEndpoints = [
    { method: "GET", endpoint: "/api/reports", description: "Retrieve all reports", auth: true },
    { method: "POST", endpoint: "/api/reports", description: "Create new report", auth: true },
    { method: "GET", endpoint: "/api/reports/{id}", description: "Get specific report", auth: true },
    { method: "PATCH", endpoint: "/api/reports/{id}", description: "Update report", auth: true },
    { method: "DELETE", endpoint: "/api/reports/{id}", description: "Delete report", auth: true },
    { method: "GET", endpoint: "/api/clients", description: "Retrieve all clients", auth: true },
    { method: "POST", endpoint: "/api/clients", description: "Create new client", auth: true },
    { method: "GET", endpoint: "/api/findings", description: "Retrieve all findings", auth: true },
    { method: "POST", endpoint: "/api/findings", description: "Create new finding", auth: true },
    { method: "GET", endpoint: "/api/dashboard/metrics", description: "Get dashboard metrics", auth: true },
  ];

  const recentActivity = [
    { timestamp: "2024-01-15 14:30", method: "GET", endpoint: "/api/reports", status: 200, ip: "192.168.1.100" },
    { timestamp: "2024-01-15 14:25", method: "POST", endpoint: "/api/findings", status: 201, ip: "192.168.1.101" },
    { timestamp: "2024-01-15 14:20", method: "GET", endpoint: "/api/clients", status: 200, ip: "192.168.1.100" },
    { timestamp: "2024-01-15 14:15", method: "PATCH", endpoint: "/api/reports/123", status: 200, ip: "192.168.1.102" },
    { timestamp: "2024-01-15 14:10", method: "DELETE", endpoint: "/api/findings/456", status: 204, ip: "192.168.1.100" },
  ];

  const getMethodBadge = (method: string) => {
    const variants = {
      GET: "secondary",
      POST: "default",
      PATCH: "outline",
      DELETE: "destructive",
    } as const;
    return variants[method as keyof typeof variants] || "outline";
  };

  const getStatusBadge = (status: number) => {
    if (status >= 200 && status < 300) return "secondary";
    if (status >= 400 && status < 500) return "destructive";
    if (status >= 500) return "destructive";
    return "outline";
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-gray-900">API Management</h2>
        <p className="text-gray-600">Manage API keys, endpoints, and monitor usage</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">API Calls Today</CardTitle>
            <Activity className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">1,247</div>
            <p className="text-xs text-muted-foreground">+12% from yesterday</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active Keys</CardTitle>
            <Key className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">3</div>
            <p className="text-xs text-muted-foreground">2 production, 1 test</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Success Rate</CardTitle>
            <CheckCircle className="h-4 w-4 text-green-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">99.2%</div>
            <p className="text-xs text-muted-foreground">Last 24 hours</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Rate Limit</CardTitle>
            <Globe className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">1000/hr</div>
            <p className="text-xs text-muted-foreground">Per API key</p>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Key className="h-5 w-5" />
              API Keys
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
              <div>
                <div className="font-medium">Production Key</div>
                <div className="text-sm text-gray-500 font-mono">{apiKey}</div>
              </div>
              <div className="flex gap-2">
                <Button size="sm" variant="outline" onClick={() => copyToClipboard(apiKey)}>
                  <Copy className="h-3 w-3" />
                </Button>
                <Button size="sm" variant="outline">
                  <RefreshCw className="h-3 w-3" />
                </Button>
              </div>
            </div>
            <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
              <div>
                <div className="font-medium">Test Key</div>
                <div className="text-sm text-gray-500 font-mono">ares_sk_test_9876543210fedcba</div>
              </div>
              <div className="flex gap-2">
                <Button size="sm" variant="outline" onClick={() => copyToClipboard("ares_sk_test_9876543210fedcba")}>
                  <Copy className="h-3 w-3" />
                </Button>
                <Button size="sm" variant="outline">
                  <RefreshCw className="h-3 w-3" />
                </Button>
              </div>
            </div>
            <Button className="w-full bg-purple-600 hover:bg-purple-700">
              Generate New Key
            </Button>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Code className="h-5 w-5" />
              API Testing
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label htmlFor="endpoint">Test Endpoint</Label>
              <Input
                id="endpoint"
                value={testEndpoint}
                onChange={(e) => setTestEndpoint(e.target.value)}
                placeholder="/api/reports"
              />
            </div>
            <Button onClick={testAPICall} className="w-full bg-purple-600 hover:bg-purple-700">
              Test API Call
            </Button>
            {testResult && (
              <div>
                <Label>Response</Label>
                <Textarea
                  value={testResult}
                  readOnly
                  rows={6}
                  className="font-mono text-sm"
                />
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Globe className="h-5 w-5" />
            Available Endpoints
          </CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Method</TableHead>
                <TableHead>Endpoint</TableHead>
                <TableHead>Description</TableHead>
                <TableHead>Auth Required</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {apiEndpoints.map((endpoint, index) => (
                <TableRow key={index}>
                  <TableCell>
                    <Badge variant={getMethodBadge(endpoint.method)}>
                      {endpoint.method}
                    </Badge>
                  </TableCell>
                  <TableCell className="font-mono text-sm">{endpoint.endpoint}</TableCell>
                  <TableCell>{endpoint.description}</TableCell>
                  <TableCell>
                    {endpoint.auth ? (
                      <CheckCircle className="h-4 w-4 text-green-600" />
                    ) : (
                      <XCircle className="h-4 w-4 text-gray-400" />
                    )}
                  </TableCell>
                  <TableCell>
                    <Button size="sm" variant="outline">
                      <ExternalLink className="h-3 w-3" />
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Activity className="h-5 w-5" />
            Recent API Activity
          </CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Timestamp</TableHead>
                <TableHead>Method</TableHead>
                <TableHead>Endpoint</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>IP Address</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {recentActivity.map((activity, index) => (
                <TableRow key={index}>
                  <TableCell className="font-mono text-sm">{activity.timestamp}</TableCell>
                  <TableCell>
                    <Badge variant={getMethodBadge(activity.method)}>
                      {activity.method}
                    </Badge>
                  </TableCell>
                  <TableCell className="font-mono text-sm">{activity.endpoint}</TableCell>
                  <TableCell>
                    <Badge variant={getStatusBadge(activity.status)}>
                      {activity.status}
                    </Badge>
                  </TableCell>
                  <TableCell className="font-mono text-sm">{activity.ip}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}