import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowLeft, Check, AlertTriangle, MessageCircle, Filter } from "lucide-react";
import { Button } from "@/components/ui/button";
import { supabase } from "@/integrations/supabase/client";

interface LogEntry {
  type: "success" | "warning" | "comment";
  title: string;
  description: string;
  time: string;
  link?: string;
}

export default function AllLogs() {
  const navigate = useNavigate();
  const [activityLogs, setActivityLogs] = useState<any[]>([]);
  const [filter, setFilter] = useState<"all" | "success" | "warning" | "comment">("all");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchLogs();
  }, []);

  const fetchLogs = async () => {
    try {
      const { data: logs, error } = await supabase
        .from("system_logs")
        .select("id, message, log_type, created_at")
        .order("created_at", { ascending: false });

      if (error) throw error;
      if (logs) setActivityLogs(logs);
    } catch (err) {
      console.error("Error fetching logs:", err);
    } finally {
      setLoading(false);
    }
  };

  const activityLogEntries: LogEntry[] = activityLogs.map((l: any) => ({
    type: l.log_type === "error" ? "warning" : l.log_type === "success" ? "success" : "comment",
    title: l.message,
    description: "",
    time: new Date(l.created_at).toLocaleTimeString(),
  }));

  const filteredEntries = filter === "all" 
    ? activityLogEntries 
    : activityLogEntries.filter(entry => entry.type === filter);

  const getIconComponent = (type: string) => {
    switch(type) {
      case "success": return <Check className="h-4 w-4" />;
      case "warning": return <AlertTriangle className="h-4 w-4" />;
      case "comment": return <MessageCircle className="h-4 w-4" />;
      default: return <MessageCircle className="h-4 w-4" />;
    }
  };

  const getColorClasses = (type: string) => {
    switch(type) {
      case "success": return "bg-success/10 text-success border-success/20";
      case "warning": return "bg-destructive/10 text-destructive border-destructive/20";
      case "comment": return "bg-primary/10 text-primary border-primary/20";
      default: return "bg-muted text-muted-foreground border-border";
    }
  };

  return (
    <div className="min-h-screen bg-background p-4 md:p-6">
      <div className="max-w-5xl mx-auto">
        {/* Header */}
        <div className="mb-6 animate-fade-in">
          <Button
            variant="ghost"
            onClick={() => navigate(-1)}
            className="mb-4 text-muted-foreground hover:text-foreground"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Dashboard
          </Button>

          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold font-display text-foreground">
                Activity Logs
              </h1>
              <p className="text-sm text-muted-foreground mt-1">
                Complete system activity history
              </p>
            </div>
            <div className="text-right">
              <p className="text-2xl font-bold text-primary">{filteredEntries.length}</p>
              <p className="text-xs text-muted-foreground">Total Logs</p>
            </div>
          </div>
        </div>

        {/* Filters */}
        <div className="glass-card rounded-2xl border border-border/50 p-4 mb-6 animate-slide-up">
          <div className="flex items-center gap-2 flex-wrap">
            <Filter className="w-4 h-4 text-muted-foreground" />
            <span className="text-sm font-medium text-muted-foreground mr-2">Filter:</span>
            <div className="flex gap-2 flex-wrap">
              {[
                { value: "all", label: "All", count: activityLogEntries.length },
                { value: "success", label: "Success", count: activityLogEntries.filter(e => e.type === "success").length },
                { value: "warning", label: "Warning", count: activityLogEntries.filter(e => e.type === "warning").length },
                { value: "comment", label: "Comments", count: activityLogEntries.filter(e => e.type === "comment").length },
              ].map((item) => (
                <button
                  key={item.value}
                  onClick={() => setFilter(item.value as any)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all duration-200
                    ${filter === item.value 
                      ? 'bg-primary text-primary-foreground shadow-md scale-105' 
                      : 'bg-card hover:bg-muted text-muted-foreground hover:text-foreground'
                    }`}
                >
                  {item.label} ({item.count})
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Logs List */}
        <div className="space-y-3">
          {loading ? (
            <div className="text-center py-12">
              <p className="text-muted-foreground">Loading logs...</p>
            </div>
          ) : filteredEntries.length === 0 ? (
            <div className="glass-card rounded-2xl p-12 text-center">
              <MessageCircle className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
              <p className="text-muted-foreground">No {filter} logs found</p>
            </div>
          ) : (
            filteredEntries.map((entry, index) => (
              <div
                key={index}
                className="glass-card rounded-xl border border-border/50 p-4 
                         hover:bg-muted/30 transition-all duration-200
                         hover:border-primary/30 hover:shadow-md group
                         animate-fade-in"
                style={{ animationDelay: `${index * 0.02}s` }}
              >
                <div className="flex gap-4">
                  {/* Icon */}
                  <div className={`w-10 h-10 rounded-xl flex items-center justify-center 
                                 flex-shrink-0 border transition-all duration-200
                                 group-hover:scale-110 ${getColorClasses(entry.type)}`}>
                    {getIconComponent(entry.type)}
                  </div>

                  {/* Content */}
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-semibold text-foreground mb-1">
                      {entry.title}
                    </p>
                    {entry.description && (
                      <p className="text-xs text-muted-foreground mb-2">
                        {entry.description}
                      </p>
                    )}
                    {entry.link && (
                      <a 
                        href="#" 
                        className="text-xs text-primary hover:underline inline-flex items-center gap-1"
                        onClick={(e) => e.preventDefault()}
                      >
                        {entry.link} →
                      </a>
                    )}
                  </div>

                  {/* Time */}
                  <div className="flex-shrink-0 text-right">
                    <span className="text-xs font-mono text-muted-foreground 
                                   px-2 py-1 rounded-md bg-muted/50">
                      {entry.time}
                    </span>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}