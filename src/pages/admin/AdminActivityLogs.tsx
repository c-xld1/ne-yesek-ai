import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Activity, Search, User, FileText, ShoppingBag, Settings, Download, ChevronDown, ChevronUp } from "lucide-react";
import { useActivityLogs, ActivityLog } from "@/hooks/useActivityLogs";
import LoadingSpinner from "@/components/LoadingSpinner";

const AdminActivityLogs = () => {
  const [logs, setLogs] = useState<ActivityLog[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [actionFilter, setActionFilter] = useState<string>("all");
  const [resourceFilter, setResourceFilter] = useState<string>("all");
  const [expandedLog, setExpandedLog] = useState<string | null>(null);
  const { fetchLogs } = useActivityLogs();

  useEffect(() => {
    loadLogs();
  }, []);

  const loadLogs = async () => {
    setLoading(true);
    const data = await fetchLogs(100);
    setLogs(data as ActivityLog[]);
    setLoading(false);
  };

  const getActionColor = (action: string) => {
    if (action.includes("create") || action.includes("add")) return "bg-green-100 text-green-700";
    if (action.includes("update") || action.includes("edit")) return "bg-blue-100 text-blue-700";
    if (action.includes("delete") || action.includes("remove")) return "bg-red-100 text-red-700";
    if (action.includes("approve")) return "bg-purple-100 text-purple-700";
    if (action.includes("reject")) return "bg-orange-100 text-orange-700";
    return "bg-gray-100 text-gray-700";
  };

  const getResourceIcon = (resourceType: string) => {
    switch (resourceType) {
      case "user":
        return <User className="h-4 w-4" />;
      case "recipe":
        return <FileText className="h-4 w-4" />;
      case "order":
        return <ShoppingBag className="h-4 w-4" />;
      case "settings":
        return <Settings className="h-4 w-4" />;
      default:
        return <Activity className="h-4 w-4" />;
    }
  };

  const filteredLogs = logs.filter((log) => {
    const searchLower = searchQuery.toLowerCase();
    const matchesSearch = log.action.toLowerCase().includes(searchLower) ||
      log.resource_type.toLowerCase().includes(searchLower) ||
      (log.profiles as any)?.username?.toLowerCase().includes(searchLower);
    
    const matchesAction = actionFilter === "all" || log.action === actionFilter;
    const matchesResource = resourceFilter === "all" || log.resource_type === resourceFilter;
    
    return matchesSearch && matchesAction && matchesResource;
  });

  const stats = {
    total: logs.length,
    filtered: filteredLogs.length,
    today: logs.filter(l => {
      const logDate = new Date(l.created_at);
      const today = new Date();
      return logDate.toDateString() === today.toDateString();
    }).length,
    week: logs.filter(l => {
      const logDate = new Date(l.created_at);
      const weekAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000);
      return logDate >= weekAgo;
    }).length,
    byAction: logs.reduce((acc, log) => {
      acc[log.action] = (acc[log.action] || 0) + 1;
      return acc;
    }, {} as Record<string, number>),
    byResource: logs.reduce((acc, log) => {
      acc[log.resource_type] = (acc[log.resource_type] || 0) + 1;
      return acc;
    }, {} as Record<string, number>)
  };

  const handleExportCSV = () => {
    const headers = ["Tarih", "Kullanıcı", "İşlem", "Kaynak Türü", "Kaynak ID", "Detaylar"];
    const csvContent = [
      headers.join(","),
      ...filteredLogs.map(log => [
        new Date(log.created_at).toLocaleString("tr-TR"),
        (log.profiles as any)?.username || "Sistem",
        log.action,
        log.resource_type,
        log.resource_id || "-",
        JSON.stringify(log.details || {}).replace(/,/g, ";")
      ].join(","))
    ].join("\n");

    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const link = document.createElement("a");
    const url = URL.createObjectURL(blob);
    link.setAttribute("href", url);
    link.setAttribute("download", `activity-logs-${new Date().toISOString().split('T')[0]}.csv`);
    link.style.visibility = "hidden";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  if (loading) return <LoadingSpinner />;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Activity Logs</h2>
          <p className="text-gray-600">
            {stats.filtered} / {stats.total} kayıt gösteriliyor • {stats.today} bugün • {stats.week} bu hafta
          </p>
        </div>
        <Button onClick={handleExportCSV}>
          <Download className="h-4 w-4 mr-2" />
          CSV İndir
        </Button>
      </div>

      {/* Statistics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Toplam Aktivite</p>
                <p className="text-2xl font-bold text-gray-900">{stats.total}</p>
              </div>
              <Activity className="h-8 w-8 text-blue-500" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Bugün</p>
                <p className="text-2xl font-bold text-green-600">{stats.today}</p>
              </div>
              <Activity className="h-8 w-8 text-green-500" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Bu Hafta</p>
                <p className="text-2xl font-bold text-purple-600">{stats.week}</p>
              </div>
              <Activity className="h-8 w-8 text-purple-500" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Filtrelenmiş</p>
                <p className="text-2xl font-bold text-orange-600">{stats.filtered}</p>
              </div>
              <Search className="h-8 w-8 text-orange-500" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Filters */}
      <Card>
        <CardContent className="pt-6">
          <div className="space-y-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              <Input
                placeholder="Kullanıcı, işlem veya kaynak ara..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
            </div>
            <div className="flex flex-wrap gap-4">
              {/* Action Filter */}
              <div className="flex gap-2 items-center">
                <span className="text-sm text-gray-600 font-medium">İşlem Türü:</span>
                <select
                  value={actionFilter}
                  onChange={(e) => setActionFilter(e.target.value)}
                  className="border rounded-md px-3 py-1.5 text-sm"
                >
                  <option value="all">Tümü</option>
                  {Object.keys(stats.byAction).map((action) => (
                    <option key={action} value={action}>
                      {action} ({stats.byAction[action]})
                    </option>
                  ))}
                </select>
              </div>

              {/* Resource Filter */}
              <div className="flex gap-2 items-center border-l pl-4">
                <span className="text-sm text-gray-600 font-medium">Kaynak Türü:</span>
                <select
                  value={resourceFilter}
                  onChange={(e) => setResourceFilter(e.target.value)}
                  className="border rounded-md px-3 py-1.5 text-sm"
                >
                  <option value="all">Tümü</option>
                  {Object.keys(stats.byResource).map((resource) => (
                    <option key={resource} value={resource}>
                      {resource} ({stats.byResource[resource]})
                    </option>
                  ))}
                </select>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Activity className="h-5 w-5 text-purple-600" />
            Son Aktiviteler
          </CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Zaman</TableHead>
                <TableHead>Kullanıcı</TableHead>
                <TableHead>İşlem</TableHead>
                <TableHead>Kaynak</TableHead>
                <TableHead>Detaylar</TableHead>
                <TableHead className="text-right">İşlem</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredLogs.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={6} className="text-center text-gray-500 py-8">
                    Activity log bulunamadı
                  </TableCell>
                </TableRow>
              ) : (
                filteredLogs.map((log) => (
                  <TableRow key={log.id}>
                    <TableCell>
                      <div className="text-sm">
                        <p className="font-medium text-gray-900">
                          {new Date(log.created_at).toLocaleDateString("tr-TR")}
                        </p>
                        <p className="text-gray-500">
                          {new Date(log.created_at).toLocaleTimeString("tr-TR")}
                        </p>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div>
                        <p className="font-medium text-gray-900">
                          {(log.profiles as any)?.fullname || "Sistem"}
                        </p>
                        <p className="text-sm text-gray-500">
                          @{(log.profiles as any)?.username || "system"}
                        </p>
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge variant="secondary" className={getActionColor(log.action)}>
                        {log.action}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        {getResourceIcon(log.resource_type)}
                        <span className="text-sm font-medium capitalize">
                          {log.resource_type}
                        </span>
                      </div>
                    </TableCell>
                    <TableCell>
                      {log.details && (
                        <div className="text-sm text-gray-600 max-w-xs">
                          {expandedLog === log.id ? (
                            <pre className="whitespace-pre-wrap text-xs bg-gray-50 p-2 rounded">
                              {JSON.stringify(log.details, null, 2)}
                            </pre>
                          ) : (
                            <span className="truncate block">
                              {JSON.stringify(log.details)}
                            </span>
                          )}
                        </div>
                      )}
                    </TableCell>
                    <TableCell className="text-right">
                      {log.details && (
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => setExpandedLog(expandedLog === log.id ? null : log.id)}
                        >
                          {expandedLog === log.id ? (
                            <ChevronUp className="h-4 w-4" />
                          ) : (
                            <ChevronDown className="h-4 w-4" />
                          )}
                        </Button>
                      )}
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
};

export default AdminActivityLogs;
