import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
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
  Database, 
  Server, 
  HardDrive, 
  Activity,
  Play,
  Download,
  RefreshCw,
  AlertTriangle
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";

export default function AdminDatabase() {
  const [sqlQuery, setSqlQuery] = useState("SELECT COUNT(*) FROM reports;");
  const [queryResult, setQueryResult] = useState("");
  const [isExecuting, setIsExecuting] = useState(false);
  const { toast } = useToast();

  const executeSQLQuery = async () => {
    setIsExecuting(true);
    try {
      const response = await fetch("/api/database/query", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ query: sqlQuery }),
      });
      const data = await response.json();
      setQueryResult(JSON.stringify(data, null, 2));
      toast({ title: "Success", description: "Query executed successfully" });
    } catch (error) {
      setQueryResult(`Error: ${error instanceof Error ? error.message : 'Unknown error'}`);
      toast({ title: "Error", description: "Query execution failed", variant: "destructive" });
    } finally {
      setIsExecuting(false);
    }
  };

  const tables = [
    { name: "users", rows: 15, size: "2.1 MB", lastModified: "2024-01-15 14:30" },
    { name: "clients", rows: 8, size: "1.5 MB", lastModified: "2024-01-15 12:15" },
    { name: "reports", rows: 23, size: "12.3 MB", lastModified: "2024-01-15 16:45" },
    { name: "findings", rows: 67, size: "8.7 MB", lastModified: "2024-01-15 15:20" },
    { name: "uploads", rows: 45, size: "156.8 MB", lastModified: "2024-01-15 13:10" },
    { name: "client_access", rows: 12, size: "0.8 MB", lastModified: "2024-01-15 11:30" },
    { name: "sessions", rows: 142, size: "3.2 MB", lastModified: "2024-01-15 16:55" },
  ];

  const recentQueries = [
    { query: "SELECT * FROM reports WHERE status = 'completed'", time: "14:30", duration: "45ms", status: "success" },
    { query: "UPDATE findings SET status = 'resolved' WHERE id = 123", time: "14:25", duration: "12ms", status: "success" },
    { query: "SELECT COUNT(*) FROM clients", time: "14:20", duration: "8ms", status: "success" },
    { query: "INSERT INTO reports (title, client_id) VALUES (...)", time: "14:15", duration: "23ms", status: "success" },
    { query: "DELETE FROM uploads WHERE created_at < '2023-01-01'", time: "14:10", duration: "156ms", status: "success" },
  ];

  const backupHistory = [
    { date: "2024-01-15", time: "02:00", size: "245.7 MB", type: "Full", status: "success" },
    { date: "2024-01-14", time: "02:00", size: "243.2 MB", type: "Full", status: "success" },
    { date: "2024-01-13", time: "02:00", size: "241.8 MB", type: "Full", status: "success" },
    { date: "2024-01-12", time: "02:00", size: "240.1 MB", type: "Full", status: "success" },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-gray-900">Database Management</h2>
        <p className="text-gray-600">Monitor database performance and execute queries</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Database Size</CardTitle>
            <HardDrive className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">245.7 MB</div>
            <p className="text-xs text-muted-foreground">+2.3% from last week</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active Connections</CardTitle>
            <Server className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">12</div>
            <p className="text-xs text-muted-foreground">Peak: 23 today</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Query Performance</CardTitle>
            <Activity className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">23ms</div>
            <p className="text-xs text-muted-foreground">Avg response time</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Last Backup</CardTitle>
            <Database className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">2h ago</div>
            <p className="text-xs text-muted-foreground">Automated daily backup</p>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Play className="h-5 w-5" />
              SQL Query Console
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-3">
              <div className="flex items-center gap-2">
                <AlertTriangle className="h-4 w-4 text-yellow-600" />
                <span className="text-sm font-medium text-yellow-800">Warning</span>
              </div>
              <p className="text-sm text-yellow-700 mt-1">
                Be careful when executing queries. Always backup before making changes.
              </p>
            </div>
            <Textarea
              value={sqlQuery}
              onChange={(e) => setSqlQuery(e.target.value)}
              placeholder="Enter your SQL query..."
              rows={6}
              className="font-mono text-sm"
            />
            <Button 
              onClick={executeSQLQuery}
              disabled={isExecuting}
              className="w-full bg-purple-600 hover:bg-purple-700"
            >
              {isExecuting ? (
                <>
                  <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
                  Executing...
                </>
              ) : (
                <>
                  <Play className="h-4 w-4 mr-2" />
                  Execute Query
                </>
              )}
            </Button>
            {queryResult && (
              <div>
                <label className="text-sm font-medium">Result:</label>
                <Textarea
                  value={queryResult}
                  readOnly
                  rows={8}
                  className="font-mono text-sm mt-1"
                />
              </div>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Database className="h-5 w-5" />
              Database Tables
            </CardTitle>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Table</TableHead>
                  <TableHead>Rows</TableHead>
                  <TableHead>Size</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {tables.map((table) => (
                  <TableRow key={table.name}>
                    <TableCell className="font-mono text-sm">{table.name}</TableCell>
                    <TableCell>{table.rows.toLocaleString()}</TableCell>
                    <TableCell>{table.size}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Activity className="h-5 w-5" />
              Recent Queries
            </CardTitle>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Query</TableHead>
                  <TableHead>Time</TableHead>
                  <TableHead>Duration</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {recentQueries.map((query, index) => (
                  <TableRow key={index}>
                    <TableCell className="font-mono text-sm max-w-xs truncate">
                      {query.query}
                    </TableCell>
                    <TableCell className="text-sm">{query.time}</TableCell>
                    <TableCell>
                      <Badge variant="secondary">{query.duration}</Badge>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Download className="h-5 w-5" />
                Backup History
              </div>
              <Button size="sm" className="bg-purple-600 hover:bg-purple-700">
                Create Backup
              </Button>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Date</TableHead>
                  <TableHead>Type</TableHead>
                  <TableHead>Size</TableHead>
                  <TableHead>Status</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {backupHistory.map((backup, index) => (
                  <TableRow key={index}>
                    <TableCell className="text-sm">
                      {backup.date} {backup.time}
                    </TableCell>
                    <TableCell>
                      <Badge variant="outline">{backup.type}</Badge>
                    </TableCell>
                    <TableCell>{backup.size}</TableCell>
                    <TableCell>
                      <Badge variant="secondary">Success</Badge>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}