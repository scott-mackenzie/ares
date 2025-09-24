import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import ReportModal from "./report-modal";
import { FileText, Eye, Edit, Download, Filter, Plus } from "lucide-react";
import type { Report, Client, User } from "@shared/schema";

type ReportWithRelations = Report & { 
  client: Client | null; 
  createdByUser: User | null;
};

export default function ReportsTable() {
  const [searchTerm, setSearchTerm] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);

  const { data: reports, isLoading } = useQuery<ReportWithRelations[]>({
    queryKey: ["/api/reports"],
  });

  const filteredReports = reports?.filter((report) =>
    report.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    report.client?.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    report.assessmentType.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const getSeverityBadge = (severity: string) => {
    const variants = {
      critical: "severity-critical",
      high: "severity-high", 
      medium: "severity-medium",
      low: "severity-low",
    };
    return variants[severity as keyof typeof variants] || variants.medium;
  };

  const getStatusBadge = (status: string) => {
    const variants = {
      draft: "status-draft",
      in_progress: "status-in_progress",
      completed: "status-completed", 
      delivered: "status-delivered",
    };
    return variants[status as keyof typeof variants] || variants.draft;
  };

  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Recent Reports</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="animate-pulse space-y-4">
            {[...Array(5)].map((_, i) => (
              <div key={i} className="h-16 bg-gray-200 rounded"></div>
            ))}
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <>
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle>Recent Reports</CardTitle>
            <div className="flex items-center space-x-3">
              <Input
                type="text"
                placeholder="Search reports..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-64"
              />
              <Button variant="outline" size="sm">
                <Filter className="h-4 w-4" />
              </Button>
              <Button onClick={() => setIsModalOpen(true)}>
                <Plus className="h-4 w-4 mr-2" />
                New Report
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Report</TableHead>
                <TableHead>Client</TableHead>
                <TableHead>Severity</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Date</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredReports?.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={6} className="text-center py-8">
                    <div className="flex flex-col items-center">
                      <FileText className="h-12 w-12 text-gray-400 mb-4" />
                      <h3 className="text-lg font-medium text-gray-900 mb-2">No reports found</h3>
                      <p className="text-gray-600 mb-4">
                        {searchTerm ? "No reports match your search criteria." : "Get started by creating your first report."}
                      </p>
                      {!searchTerm && (
                        <Button onClick={() => setIsModalOpen(true)}>
                          <Plus className="h-4 w-4 mr-2" />
                          Create Report
                        </Button>
                      )}
                    </div>
                  </TableCell>
                </TableRow>
              ) : (
                filteredReports?.map((report) => (
                  <TableRow key={report.id} className="hover:bg-gray-50">
                    <TableCell>
                      <div className="flex items-center">
                        <FileText className="h-5 w-5 text-gray-400 mr-3" />
                        <div>
                          <div className="font-medium text-gray-900">{report.title}</div>
                          <div className="text-sm text-gray-500">{report.assessmentType}</div>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="text-sm text-gray-900">
                        {report.client?.name || "No client assigned"}
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge 
                        variant="outline" 
                        className={getSeverityBadge(report.severity || "medium")}
                      >
                        {(report.severity || "medium").toUpperCase()}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <Badge className={getStatusBadge(report.status)}>
                        {report.status.replace('_', ' ').toUpperCase()}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-sm text-gray-600">
                      {report.createdAt ? new Date(report.createdAt).toLocaleDateString() : ""}
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center space-x-2">
                        <Button variant="ghost" size="sm">
                          <Eye className="h-4 w-4" />
                        </Button>
                        <Button variant="ghost" size="sm">
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button variant="ghost" size="sm">
                          <Download className="h-4 w-4" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      <ReportModal open={isModalOpen} onOpenChange={setIsModalOpen} />
    </>
  );
}
