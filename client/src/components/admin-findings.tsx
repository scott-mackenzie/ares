import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Plus, Bug, AlertTriangle, Shield, Target, Trash2, Edit } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import type { Finding } from "@shared/schema";

export default function AdminFindings() {
  const [newFindingDialog, setNewFindingDialog] = useState(false);
  const [findingForm, setFindingForm] = useState({
    title: "",
    description: "",
    severity: "medium" as "critical" | "high" | "medium" | "low" | "info",
    status: "open" as "open" | "in_progress" | "resolved" | "false_positive",
    category: "",
    remediation: "",
    reportId: "",
  });
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const { data: findings = [], isLoading } = useQuery({
    queryKey: ["/api/findings"],
  });

  const { data: reports = [] } = useQuery({
    queryKey: ["/api/reports"],
  });

  const createFindingMutation = useMutation({
    mutationFn: async (findingData: typeof findingForm) => {
      const response = await fetch("/api/findings", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...findingData,
          reportId: parseInt(findingData.reportId),
        }),
      });
      if (!response.ok) throw new Error("Failed to create finding");
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/findings"] });
      setNewFindingDialog(false);
      setFindingForm({
        title: "",
        description: "",
        severity: "medium",
        status: "open",
        category: "",
        remediation: "",
        reportId: "",
      });
      toast({ title: "Success", description: "Finding created successfully" });
    },
    onError: () => {
      toast({ title: "Error", description: "Failed to create finding", variant: "destructive" });
    },
  });

  const getSeverityBadge = (severity: string) => {
    const variants = {
      critical: "destructive",
      high: "destructive",
      medium: "default",
      low: "secondary",
      info: "outline",
    } as const;
    return variants[severity as keyof typeof variants] || "outline";
  };

  const getSeverityIcon = (severity: string) => {
    switch (severity) {
      case "critical":
        return <AlertTriangle className="h-3 w-3" />;
      case "high":
        return <AlertTriangle className="h-3 w-3" />;
      case "medium":
        return <Shield className="h-3 w-3" />;
      case "low":
        return <Target className="h-3 w-3" />;
      default:
        return <Bug className="h-3 w-3" />;
    }
  };

  const getStatusBadge = (status: string) => {
    const variants = {
      open: "destructive",
      in_progress: "default",
      resolved: "secondary",
      false_positive: "outline",
    } as const;
    return variants[status as keyof typeof variants] || "outline";
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  const severityCounts = findings.reduce((acc: Record<string, number>, finding: Finding) => {
    acc[finding.severity] = (acc[finding.severity] || 0) + 1;
    return acc;
  }, {});

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Security Findings</h2>
          <p className="text-gray-600">Manage vulnerabilities and security issues</p>
        </div>
        <Dialog open={newFindingDialog} onOpenChange={setNewFindingDialog}>
          <DialogTrigger asChild>
            <Button className="bg-purple-600 hover:bg-purple-700">
              <Plus className="h-4 w-4 mr-2" />
              Add Finding
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>Add New Security Finding</DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="title">Finding Title</Label>
                  <Input
                    id="title"
                    value={findingForm.title}
                    onChange={(e) => setFindingForm({ ...findingForm, title: e.target.value })}
                    placeholder="SQL Injection Vulnerability"
                  />
                </div>
                <div>
                  <Label htmlFor="category">Category</Label>
                  <Input
                    id="category"
                    value={findingForm.category}
                    onChange={(e) => setFindingForm({ ...findingForm, category: e.target.value })}
                    placeholder="Web Application Security"
                  />
                </div>
              </div>
              <div className="grid grid-cols-3 gap-4">
                <div>
                  <Label htmlFor="severity">Severity</Label>
                  <Select value={findingForm.severity} onValueChange={(value) => setFindingForm({ ...findingForm, severity: value as any })}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="critical">Critical</SelectItem>
                      <SelectItem value="high">High</SelectItem>
                      <SelectItem value="medium">Medium</SelectItem>
                      <SelectItem value="low">Low</SelectItem>
                      <SelectItem value="info">Info</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label htmlFor="status">Status</Label>
                  <Select value={findingForm.status} onValueChange={(value) => setFindingForm({ ...findingForm, status: value as any })}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="open">Open</SelectItem>
                      <SelectItem value="in_progress">In Progress</SelectItem>
                      <SelectItem value="resolved">Resolved</SelectItem>
                      <SelectItem value="false_positive">False Positive</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label htmlFor="report">Report</Label>
                  <Select value={findingForm.reportId} onValueChange={(value) => setFindingForm({ ...findingForm, reportId: value })}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select report" />
                    </SelectTrigger>
                    <SelectContent>
                      {reports.map((report: any) => (
                        <SelectItem key={report.id} value={report.id.toString()}>
                          {report.title}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <div>
                <Label htmlFor="description">Description</Label>
                <Textarea
                  id="description"
                  value={findingForm.description}
                  onChange={(e) => setFindingForm({ ...findingForm, description: e.target.value })}
                  placeholder="Detailed description of the security finding..."
                  rows={3}
                />
              </div>
              <div>
                <Label htmlFor="remediation">Remediation</Label>
                <Textarea
                  id="remediation"
                  value={findingForm.remediation}
                  onChange={(e) => setFindingForm({ ...findingForm, remediation: e.target.value })}
                  placeholder="Steps to remediate this vulnerability..."
                  rows={3}
                />
              </div>
              <Button
                onClick={() => createFindingMutation.mutate(findingForm)}
                disabled={!findingForm.title || !findingForm.description || createFindingMutation.isPending}
                className="w-full bg-purple-600 hover:bg-purple-700"
              >
                {createFindingMutation.isPending ? "Creating..." : "Create Finding"}
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-5 gap-4 mb-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Critical</CardTitle>
            <AlertTriangle className="h-4 w-4 text-red-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-red-600">{severityCounts.critical || 0}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">High</CardTitle>
            <AlertTriangle className="h-4 w-4 text-orange-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-orange-600">{severityCounts.high || 0}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Medium</CardTitle>
            <Shield className="h-4 w-4 text-yellow-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-yellow-600">{severityCounts.medium || 0}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Low</CardTitle>
            <Target className="h-4 w-4 text-blue-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-blue-600">{severityCounts.low || 0}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Info</CardTitle>
            <Bug className="h-4 w-4 text-gray-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-gray-600">{severityCounts.info || 0}</div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>All Security Findings</CardTitle>
        </CardHeader>
        <CardContent>
          {findings.length === 0 ? (
            <div className="text-center py-8 text-gray-500">
              <Bug className="h-12 w-12 mx-auto mb-4 text-gray-300" />
              <p>No security findings found. Add your first finding to get started.</p>
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Finding</TableHead>
                  <TableHead>Severity</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Category</TableHead>
                  <TableHead>Report</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {findings.map((finding: Finding) => (
                  <TableRow key={finding.id}>
                    <TableCell>
                      <div>
                        <div className="font-medium">{finding.title}</div>
                        <div className="text-sm text-gray-500 truncate max-w-xs">
                          {finding.description}
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge variant={getSeverityBadge(finding.severity)} className="flex items-center gap-1 w-fit">
                        {getSeverityIcon(finding.severity)}
                        {finding.severity.charAt(0).toUpperCase() + finding.severity.slice(1)}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <Badge variant={getStatusBadge(finding.status)}>
                        {finding.status.replace('_', ' ')}
                      </Badge>
                    </TableCell>
                    <TableCell>{finding.category}</TableCell>
                    <TableCell>
                      <Badge variant="outline">Report #{finding.reportId}</Badge>
                    </TableCell>
                    <TableCell>
                      <div className="flex gap-2">
                        <Button size="sm" variant="outline">
                          <Edit className="h-3 w-3" />
                        </Button>
                        <Button size="sm" variant="outline">
                          <Trash2 className="h-3 w-3" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>
    </div>
  );
}