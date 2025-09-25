import { useQuery } from "@tanstack/react-query";
import { Card, CardContent } from "@/components/ui/card";
import { AlertTriangle, AlertCircle, FileText, CheckCircle } from "lucide-react";

interface DashboardMetrics {
  critical: number;
  high: number;
  reports: number;
  remediated: number;
}

export default function MetricsCards() {
  const { data: metrics, isLoading } = useQuery<DashboardMetrics>({
    queryKey: ["/api/dashboard/metrics"],
    refetchInterval: 30000, // Refetch every 30 seconds
  });

  if (isLoading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {[...Array(4)].map((_, i) => (
          <Card key={i}>
            <CardContent className="p-6">
              <div className="animate-pulse">
                <div className="flex items-center">
                  <div className="w-10 h-10 bg-gray-200 rounded-lg"></div>
                  <div className="ml-4">
                    <div className="h-4 bg-gray-200 rounded w-20 mb-2"></div>
                    <div className="h-6 bg-gray-200 rounded w-12"></div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    );
  }

  const cards = [
    {
      title: "Critical Findings",
      value: metrics?.critical || 0,
      icon: AlertTriangle,
      iconBg: "bg-red-50",
      iconColor: "text-red-600",
    },
    {
      title: "High Findings", 
      value: metrics?.high || 0,
      icon: AlertCircle,
      iconBg: "bg-orange-50",
      iconColor: "text-orange-600",
    },
    {
      title: "Active Reports",
      value: metrics?.reports || 0,
      icon: FileText,
      iconBg: "bg-blue-50", 
      iconColor: "text-blue-600",
    },
    {
      title: "Remediated",
      value: metrics?.remediated || 0,
      icon: CheckCircle,
      iconBg: "bg-green-50",
      iconColor: "text-green-600",
    },
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
      {cards.map((card) => {
        const Icon = card.icon;
        return (
          <Card key={card.title} className="hover:shadow-lg transition-shadow">
            <CardContent className="p-6">
              <div className="flex items-center">
                <div className={`p-2 ${card.iconBg} rounded-lg`}>
                  <Icon className={`${card.iconColor} h-6 w-6`} />
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">{card.title}</p>
                  <p className="text-2xl font-bold text-gray-900">{card.value}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
}
