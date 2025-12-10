// src/pages/IndexWithSupabase.tsx
import React, { useCallback, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";

import { DashboardHeader } from "@/components/components/dashboard/DashboardHeader";
import { ProgressCircle } from "@/components/components/dashboard/ProgressCircle";
import { StatusPipeline } from "@/components/components/dashboard/StatusPipeline";
import { HighlightCard } from "@/components/components/dashboard/HighlightCard";
import { RiskIndicator } from "@/components/components/dashboard/RiskIndicator";
import { SummarySection } from "@/components/components/dashboard/SummarySection";
import { ActivityLog } from "@/components/components/dashboard/ActivityLog";
import { BarChart } from "@/components/components/dashboard/BarChart";
import { WorkloadBar } from "@/components/components/dashboard/WorkloadBar";
import { TestResultBadge } from "@/components/components/dashboard/TestResultBadge";
import { LiveChart } from "@/components/components/dashboard/LiveChart";
import { TripCurveChart } from "@/components/components/dashboard/TripCurveChart";
import { OpeningEventChart } from "@/components/components/dashboard/OpeningEventChart";

import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/components/ui/select";
import { toast } from "@/hooks/use-toast";
import { Play, Zap, Calendar, ArrowLeft } from "lucide-react";
import { createClient, SupabaseClient } from "@supabase/supabase-js";


type TestResultLocal = {
  id: string;
  type: string;
  result: "pass" | "fail";
  peakCurrent: number;
  timestamp: string;
  duration?: number;
};

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL as string;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY as string;
if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error("Missing VITE_SUPABASE_URL or VITE_SUPABASE_ANON_KEY in .env");
}
const supabase: SupabaseClient = createClient(supabaseUrl, supabaseAnonKey);

export default function IndexWithSupabase(): JSX.Element {
  // UI configuration
  const [mcbType, setMcbType] = useState<"B" | "C" | "D">("B");
  const [faultCurrent, setFaultCurrent] = useState<string>("6");
  const [isRunning, setIsRunning] = useState(false);
  const [status, setStatus] = useState<"idle" | "running" | "pass" | "fail">("idle");
  const [testProgress, setTestProgress] = useState<number>(0);
  const [passRate, setPassRate] = useState<number>(75);
  const navigate = useNavigate();

  // Data
  const [recentTests, setRecentTests] = useState<TestResultLocal[]>([]);
  const [upcomingTests, setUpcomingTests] = useState<any[]>([]);
  const [activityLogs, setActivityLogs] = useState<any[]>([]);
  const [currentData, setCurrentData] = useState<{ time: number; value: number }[]>([]);
  const [openingEventData, setOpeningEventData] = useState<{ time: number; voltage: number; current: number }[]>([]);
  const [tripCurveData, setTripCurveData] = useState<{ current: number; time: number }[]>([]);
  const [peakCurrent, setPeakCurrent] = useState<number>(0);
  const [powerFactor, setPowerFactor] = useState<number>(0.95);
  const [lastUpdateTime, setLastUpdateTime] = useState<string>("--");
  const [loading, setLoading] = useState<boolean>(true);

  // Helper: generate sample UI data (fallback)
  const generateFallbacks = () => {
    setCurrentData(Array.from({ length: 50 }, (_, i) => ({ time: i * 20, value: Math.sin(i * 0.3) * 80 + 100 + Math.random() * 20 })));
    setOpeningEventData(Array.from({ length: 30 }, (_, i) => ({ time: i * 2, voltage: 230 * Math.exp(-i * 0.1) * (1 + Math.random() * 0.1), current: 500 * Math.exp(-i * 0.15) * (1 + Math.random() * 0.15) })));
    setTripCurveData([{ current: 3, time: 0.5 }, { current: 5, time: 0.1 }, { current: 10, time: 0.02 }]);
    setPeakCurrent(145.2);
    setLastUpdateTime(new Date().toLocaleTimeString());
  };
  const reportData = React.useMemo(() => {
    // Map recentTests -> tripRows
    const tripRows = recentTests.slice(0, 10).map((t, idx) => ({
      sNo: String(idx + 1),
      type: t.type ?? mcbType ?? "B",
      poles: "2", // default; change if you have actual value
      rating: String(t.peakCurrent ? Math.round(t.peakCurrent) : 63),
      expectedTripTime: t.duration ? `${(t.duration * 0.9).toFixed(2)}s` : "", // heuristic expected value
      actualTripTime: t.duration ? `${t.duration}s` : "",
      tripTimeInCurve: t.duration ? (t.duration < 1 ? "Fast" : "Normal") : "",
      catalogueNo: t.id ?? "",
      currentA: String(Math.round(t.peakCurrent ?? 0)),
      time: t.timestamp ?? "",
    }));
  
    // Map activityLogs -> inspections (use first 6, fallback to placeholders)
    const inspections = (activityLogs.length ? activityLogs : []).slice(0, 6).map((l: any, i: number) => ({
      description: l.message ?? l.title ?? `Log ${i + 1}`,
      status: l.log_type === "error" || l.type === "warning" ? "Fail" : "OK",
      remarks: l.details ?? l.description ?? "",
    }));
  
    // Product spec: prefer upcomingTests[0], else fallback to simple productSpec
    const next = upcomingTests[0] ?? {};
    const productSpec = {
      ref: next.id ?? "",
      serialNo: next.serial_no ?? next.serialNo ?? "",
      modelNo: next.model_no ?? next.modelNo ?? "",
      noOfPoles: next.no_of_poles ?? next.noOfPoles ?? "2",
      type: next.mcb_type ?? mcbType ?? "MCB",
      ratedCurrent: next.rated_current ?? `${faultCurrent}`,
      ratedVoltage: next.rated_voltage ?? "230",
      ratedFrequency: next.rated_frequency ?? "50Hz",
      ratedShortCircuitBreakingCapacity: next.rated_sc_breaking_capacity ?? "",
      magneticReleaseSetting: next.magnetic_release_setting ?? "",
      ratedInsulationVoltage: next.rated_insulation_voltage ?? "",
      ratedImpulseVoltage: next.rated_impulse_voltage ?? "",
      electricalMechanicalEndurance: next.endurance ?? "",
      ambientWorkingTemperature: next.ambient_temp ?? "",
      terminalCapacity: next.terminal_capacity ?? "",
      vibration: next.vibration ?? "",
      shockResistance: next.shock ?? "",
      protectionClass: next.protection_class ?? "",
      installationPosition: next.installation_position ?? "",
      mounting: next.mounting ?? "",
      caseAndCover: next.case_cover ?? "",
      auxiliaryContacts: next.aux_contacts ?? "",
      shuntTrip: next.shunt_trip ?? "",
    };
  
    // header: include latest telemetry-derived values where available
    const header = {
      date: new Date().toLocaleDateString(),
      currentA: String(Math.round(peakCurrent ?? Number(faultCurrent) ?? 0)),
      voltage: openingEventData[0]?.voltage ? String(Math.round(openingEventData[0].voltage)) : "230",
      title: "MCB TRIP TEST REPORT",
    };
  
    // testedBy: best-effort from recentTests first item, else generic
    const testedBy = {
      name: recentTests[0]?.id ? `Operator (${recentTests[0].id})` : "Automated System",
      date: new Date().toLocaleDateString(),
      reviewedBy: "QA Team",
      result: status === "pass" ? "Pass" : status === "fail" ? "Fail" : "In Progress",
    };
  
    return {
      header,
      tripRows,
      inspections: inspections.length ? inspections : [
        { description: "Physical condition", status: "OK", remarks: "" },
        { description: "Connections tightness", status: "OK", remarks: "" },
        { description: "Markings / labels", status: "OK", remarks: "" },
        { description: "Accessories", status: "OK", remarks: "" },
      ],
      productSpec,
      testedBy,
    };
  }, [recentTests, activityLogs, upcomingTests, peakCurrent, openingEventData, mcbType, faultCurrent, status]);
  
  // ... then later in JSX replace <Export data ={ exampleData }/> with:

  
  
  // Fetch initial data from Supabase
  useEffect(() => {
    let mounted = true;
    const fetchInitial = async () => {
      try {
        // recent tests
        const { data: tests, error: testsErr } = await supabase
          .from("test_runs")
          .select("id, mcb_type, fault_current, peak_current, power_factor, result, status, duration_seconds, created_at")
          .order("created_at", { ascending: false })
          .limit(10);

        if (testsErr) throw testsErr;
        if (mounted && tests) {
          const mapped: TestResultLocal[] = tests.map((t: any) => ({
            id: t.id,
            type: t.mcb_type,
            result: (t.result ?? "").toUpperCase() === "PASS" ? "pass" : "fail",
            peakCurrent: Number(t.peak_current ?? 0),
            timestamp: t.created_at ? new Date(t.created_at).toLocaleTimeString() : "--",
            duration: t.duration_seconds ? Number(t.duration_seconds) : undefined,
          }));
          setRecentTests(mapped);
          const passed = mapped.filter((r) => r.result === "pass").length;
          setPassRate(Math.round((passed / Math.max(1, mapped.length)) * 100));
        }

        // upcoming schedule
        const { data: schedule, error: scheduleErr } = await supabase
          .from("test_schedule")
          .select("id, mcb_type, scheduled_date, priority, status")
          .order("scheduled_date", { ascending: true })
          .limit(10);
        if (scheduleErr) throw scheduleErr;
        if (mounted && schedule) setUpcomingTests(schedule);

        // logs
        const { data: logs, error: logsErr } = await supabase
          .from("system_logs")
          .select("id, message, log_type, created_at")
          .order("created_at", { ascending: false })
          .limit(20);
        if (logsErr) throw logsErr;
        if (mounted && logs) setActivityLogs(logs);

        // telemetry
        const { data: telemetryRows, error: telErr } = await supabase
          .from("telemetry")
          .select("test_id, time_offset_ms, voltage, current, created_at")
          .order("created_at", { ascending: true })
          .limit(500);
        if (telErr) throw telErr;
        if (mounted && telemetryRows && telemetryRows.length) {
          setCurrentData(telemetryRows.map((r: any, i: number) => ({ time: Number(r.time_offset_ms ?? i * 20), value: Number(r.current ?? 0) })));
          setOpeningEventData(telemetryRows.map((r: any) => ({ time: Number(r.time_offset_ms ?? 0), voltage: Number(r.voltage ?? 0), current: Number(r.current ?? 0) })));
        } else {
          // fallback sample data if telemetry empty
          generateFallbacks();
        }

        setLoading(false);
      } catch (err) {
        console.error("Supabase initial fetch error:", err);
        generateFallbacks();
        setLoading(false);
      }
    };

    fetchInitial();
    return () => { mounted = false; };
  }, []);

  // Realtime subscriptions
  useEffect(() => {
    // tests channel
    const testsChannel = supabase
      .channel("realtime:test_runs")
      .on("postgres_changes", { event: "INSERT", schema: "public", table: "test_runs" }, (payload) => {
        const n = payload.new;
        if (!n) return;
        const newTest: TestResultLocal = {
          id: n.id,
          type: n.mcb_type,
          result: (n.result ?? "").toUpperCase() === "PASS" ? "pass" : "fail",
          peakCurrent: Number(n.peak_current ?? 0),
          timestamp: n.created_at ? new Date(n.created_at).toLocaleTimeString() : new Date().toLocaleTimeString(),
          duration: n.duration_seconds ? Number(n.duration_seconds) : undefined,
        };
        setRecentTests((prev) => [newTest, ...prev].slice(0, 10));
        setPassRate((prev) => {
          const local = ([newTest, ...recentTests].filter((t) => t.result === "pass")).length;
          return Math.round((local / Math.max(1, recentTests.length + 1)) * 100);
        });
      })
      .subscribe();

    // telemetry channel
    const telemetryChannel = supabase
      .channel("realtime:telemetry")
      .on("postgres_changes", { event: "INSERT", schema: "public", table: "telemetry" }, (payload) => {
        const n = payload.new;
        if (!n) return;
        const p = { time: Number(n.time_offset_ms ?? 0), value: Number(n.current ?? 0) };
        setCurrentData((prev) => {
          const next = [...prev.slice(-199), p];
          return next;
        });
        setOpeningEventData((prev) => [...prev, { time: Number(n.time_offset_ms ?? 0), voltage: Number(n.voltage ?? 0), current: Number(n.current ?? 0) }]);
        setLastUpdateTime(new Date().toLocaleTimeString());
      })
      .subscribe();

    // system_logs channel (optional)
    const logsChannel = supabase
      .channel("realtime:system_logs")
      .on("postgres_changes", { event: "INSERT", schema: "public", table: "system_logs" }, (payload) => {
        const n = payload.new;
        if (!n) return;
        setActivityLogs((prev) => [{ id: n.id, message: n.message, log_type: n.log_type, created_at: n.created_at }, ...prev].slice(0, 50));
      })
      .subscribe();

    // cleanup
    return () => {
      supabase.removeChannel(testsChannel);
      supabase.removeChannel(telemetryChannel);
      supabase.removeChannel(logsChannel);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Update simulated live chart while running (local animation)
  useEffect(() => {
    if (!isRunning) return;
    const interval = setInterval(() => {
      setCurrentData((prev) => {
        const newPoint = { time: (prev[prev.length - 1]?.time || 0) + 20, value: Math.sin(Date.now() * 0.005) * 100 + 150 + Math.random() * 30 };
        return [...prev.slice(-49), newPoint];
      });
      setPeakCurrent((prev) => Math.max(prev, 100 + Math.random() * 150));
      setPowerFactor(0.85 + Math.random() * 0.1);
      setLastUpdateTime(new Date().toLocaleTimeString());
    }, 200);
    return () => clearInterval(interval);
  }, [isRunning]);

  // runTest: optimistic UI + DB writes
  const runTest = useCallback(async () => {
    setIsRunning(true);
    setStatus("running");
    setTestProgress(0);

    toast({ title: "Test Started", description: `Running MCB Type ${mcbType} test at ${faultCurrent} kA` });

    const progressInterval = setInterval(() => { setTestProgress((p) => Math.min(p + 15, 95)); }, 400);

    setTimeout(async () => {
      clearInterval(progressInterval);
      setTestProgress(100);
      setIsRunning(false);

      const pass = Math.random() > 0.3;
      const resultStr = pass ? "PASS" : "FAIL";
      setStatus(pass ? "pass" : "fail");

      const peak = Math.random() * 200 + 100;
      const duration = Math.random() * 3 + 2;
      const timeStr = new Date().toLocaleTimeString();

      const newId = `T-${String(Math.floor(Math.random() * 900) + 100)}`;

      const newResult: TestResultLocal = {
        id: newId,
        type: mcbType,
        result: pass ? "pass" : "fail",
        peakCurrent: Math.round(peak * 10) / 10,
        timestamp: timeStr,
        duration: Math.round(duration * 10) / 10,
      };

      // optimistic UI update
      setRecentTests((prev) => [newResult, ...prev].slice(0, 10));

      // insert row into test_runs
      try {
        await supabase.from("test_runs").insert([{
          id: newId,
          mcb_type: mcbType,
          fault_current: Number(faultCurrent) || null,
          peak_current: Math.round(peak * 10) / 10,
          power_factor: powerFactor,
          result: resultStr,
          status: "Completed",
          duration_seconds: Math.round(duration * 10) / 10,
        }]);
      } catch (err) {
        console.error("Insert test_runs failed:", err);
        toast({ title: "DB insert failed", description: "Could not save test result to Supabase", variant: "destructive" } as any);
      }

      // insert example telemetry rows
      try {
        const telemetryRows = Array.from({ length: 10 }, (_, i) => ({
          test_id: newId,
          time_offset_ms: i * 50,
          voltage: Math.round((230 * Math.exp(-i * 0.05) * (1 + Math.random() * 0.03)) * 100) / 100,
          current: Math.round(((peak / (i + 1)) * (1 + Math.random() * 0.05)) * 100) / 100,
        }));
        await supabase.from("telemetry").insert(telemetryRows);
      } catch (err) {
        console.error("Insert telemetry failed:", err);
      }

      // insert a system log entry
      try {
        await supabase.from("system_logs").insert([{
          message: `Test ${newId} completed with result ${resultStr}`,
          log_type: pass ? "success" : "error",
        }]);
      } catch (err) {
        console.error("Insert system_logs failed:", err);
      }

      // recompute pass rate from local data
      setPassRate(() => {
        const local = ([newResult, ...recentTests].filter((r) => r.result === "pass")).length;
        return Math.round((local / Math.max(1, recentTests.length + 1)) * 100);
      });

      toast({
        title: pass ? "✓ Test Passed" : "✗ Test Failed",
        description: `Peak current: ${peak.toFixed(1)} A`,
        variant: pass ? "default" : "destructive",
      });
    }, 3000);
  }, [mcbType, faultCurrent, recentTests, powerFactor]);

  const handleExportCSV = () => {
    const csvContent = [
      ["ID", "Type", "Result", "Peak Current (A)", "Timestamp", "Duration (s)"].join(","),
      ...recentTests.map((t) => [t.id, t.type, t.result, t.peakCurrent, t.timestamp, t.duration].join(",")),
    ].join("\n");
    const blob = new Blob([csvContent], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "mcb_test_results.csv";
    a.click();
    URL.revokeObjectURL(url);
    toast({ title: "Export Complete", description: "CSV file downloaded successfully" });
  };

  // UI small helpers
  const getPipelineStatus = (step: string): "completed" | "in-progress" | "waiting" => {
    if (step === "Setup") return status === "idle" ? "waiting" : "completed";
    if (step === "Running") return status === "running" ? "in-progress" : (status === "idle" ? "waiting" : "completed");
    if (step === "Analysis") return status === "running" ? "waiting" : (status === "idle" ? "waiting" : "completed");
    if (step === "Complete") return status === "pass" || status === "fail" ? "completed" : "waiting";
    return "waiting";
  };

  const pipelineSteps = [
    { label: "Setup", status: getPipelineStatus("Setup") },
    { label: "Running", status: getPipelineStatus("Running"), percentage: isRunning ? testProgress : undefined },
    { label: "Analysis", status: getPipelineStatus("Analysis") },
    { label: "Complete", status: getPipelineStatus("Complete") },
  ];

  const getSeverity = (type: string): "high" | "medium" | "low" => {
    if (type === "failRate") return passRate < 80 ? "medium" : "low";
    if (type === "failCount") return recentTests.filter((t) => t.result === "fail").length > 1 ? "high" : "medium";
    return "low";
  };

  const riskItems = [
    { value: `${100 - passRate}%`, label: "Test Failure Rate", severity: getSeverity("failRate") },
    { value: recentTests.filter((t) => t.result === "fail").length, label: "Failed tests (recent)", severity: getSeverity("failCount") },
    { value: recentTests.length, label: "Total tests today", severity: "low" as const },
  ];

  const testDurationData = recentTests.slice(0, 5).map((t) => ({ name: t.id.replace("T-", ""), value: t.duration || 3, color: t.result === "pass" ? "hsl(var(--success))" : "hsl(var(--destructive))" }));

  // Activity log fallback mapping if system_logs not used
  const activityLogEntries = activityLogs.length ? activityLogs.map((l: any) => ({ type: l.log_type === "error" ? "warning" : "success", title: l.message, description: "", time: new Date(l.created_at).toLocaleTimeString() })) : [
    { type: "success" as const, title: "Test T-001 completed", description: "MCB Type B passed at 145.2A", time: "5 min", link: "View report" },
    { type: "warning" as const, title: "Test T-002 failed", description: "MCB Type C exceeded threshold", time: "12 min", link: "View details" },
  ];

  return (
    <div className="min-h-screen bg-background p-4 md:p-6">
      
      <div className="max-w-7xl mx-auto">
      <Button
            variant="ghost"
            onClick={() => navigate(-1)}
            className="mb-4 text-muted-foreground hover:text-foreground"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back 
          </Button>
      <DashboardHeader reportData={reportData} /> 
       
        
        
        {/* Top Row */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 mb-5 mt-6">
          <div className="lg:col-span-2 bg-card rounded-2xl border border-border p-5 flex flex-col items-center justify-center">
            <p className="text-sm font-medium text-muted-foreground mb-3">Overall Progress</p>
            <ProgressCircle value={passRate} size={100} />
          </div>

          <div className="lg:col-span-7"><StatusPipeline steps={pipelineSteps} /></div>
          <div className="lg:col-span-3">
            <HighlightCard title="Next Scheduled Test" value={upcomingTests[0]?.scheduled_date ?? "Today"} subtitle={`MCB Type ${mcbType}`} variant="success" icon={<Calendar className="h-8 w-8" />} />
          </div>
          
        </div>

        {/* Second Row */}
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-5 mb-5">
          <RiskIndicator title="Risk Analysis" items={riskItems} />
          <div className="bg-card rounded-2xl border border-border p-5">
            <h3 className="text-sm font-semibold text-foreground mb-4">Test Configuration</h3>
            <div className="space-y-4">
              <div>
                <label className="block text-xs text-muted-foreground mb-1.5">MCB Type</label>
                <Select value={mcbType} onValueChange={(v: any) => setMcbType(v)}>
                  <SelectTrigger className="h-10 bg-muted/50"><SelectValue /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="B">Type B</SelectItem>
                    <SelectItem value="C">Type C</SelectItem>
                    <SelectItem value="D">Type D</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <label className="block text-xs text-muted-foreground mb-1.5">Fault Current</label>
                <Select value={faultCurrent} onValueChange={(v: any) => setFaultCurrent(v)}>
                  <SelectTrigger className="h-10 bg-muted/50"><SelectValue /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="6">6 kA</SelectItem>
                    <SelectItem value="10">10 kA</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <Button variant="success" className="w-full bg-green-600 text-white px-4 py-2" onClick={runTest} disabled={isRunning}>
                {isRunning ? <><Zap className="animate-pulse" /> Running...</> : <><Play /> Run Test</>}
              </Button>
            </div>
          </div>

          <div className="bg-card rounded-2xl border border-border overflow-hidden">
            <div className="bg-destructive text-destructive-foreground px-4 py-2"><h3 className="text-sm font-semibold">Failed Tests</h3></div>
            <table className="w-full text-sm">
              <thead><tr className="bg-muted/50 border-b border-border"><th className="px-3 py-2 text-left text-muted-foreground">ID</th><th className="px-3 py-2 text-left text-muted-foreground">Type</th><th className="px-3 py-2 text-right text-muted-foreground">Peak</th></tr></thead>
              <tbody>{recentTests.filter(t => t.result === "fail").map(t => <tr key={t.id} className="border-b border-border/50"><td className="px-3 py-2">{t.id}</td><td className="px-3 py-2">{t.type}</td><td className="px-3 py-2 text-right">{t.peakCurrent}A</td></tr>)}</tbody>
            </table>
          </div>

          <ActivityLog 
  title="Test Log" 
  entries={activityLogEntries.slice(0, 3)}
  onViewAll={() => navigate('/logs')}
/>
        </div>

        {/* Third Row */}
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-5 mb-5">
          <SummarySection title="Test Summary" items={[{ label: "Date", value: new Date().toLocaleDateString() }, { label: "MCB Type", value: `Type ${mcbType}` }, { label: "Fault Current", value: `${faultCurrent} kA` }, { label: "Status", value: status === "idle" ? "Ready" : status.charAt(0).toUpperCase() + status.slice(1) }]} highlightLast />
          <BarChart title="Test Duration (seconds)" data={testDurationData} />
          <div className="bg-card rounded-2xl border border-border overflow-hidden">
          <div className="bg-green-600 text-white px-4 py-2">
  <h3 className="text-sm font-semibold">Recent Tests</h3>
</div>
            <table className="w-full text-sm">
              <thead><tr className="bg-muted/50 border-b border-border"><th className="px-3 py-2 text-left text-muted-foreground">ID</th><th className="px-3 py-2 text-left text-muted-foreground">Result</th><th className="px-3 py-2 text-right text-muted-foreground">Peak</th></tr></thead>
              <tbody>{recentTests.slice(0, 4).map(t => <tr key={t.id} className={t.result === "pass" ? "bg-success/5" : "bg-destructive/5"}><td className="px-3 py-2">{t.id}</td><td className="px-3 py-2"><TestResultBadge result={t.result} size="sm" /></td><td className="px-3 py-2 text-right font-mono">{t.peakCurrent}A</td></tr>)}</tbody>
            </table>
          </div>

          <div className="bg-card rounded-2xl border border-border overflow-hidden">
          <div className="bg-orange-400 text-white px-4 py-2 rounded-t-xl">
  <h3 className="text-sm font-semibold">Upcoming Tests</h3>
</div>
            <table className="w-full text-sm">
              <thead><tr className="bg-muted/50 border-b border-border"><th className="px-3 py-2 text-left text-muted-foreground">Type</th><th className="px-3 py-2 text-left text-muted-foreground">Date</th><th className="px-3 py-2 text-left text-muted-foreground">Priority</th></tr></thead>
              <tbody>{upcomingTests.map((t: any, i: number) => <tr key={i} className="border-b border-border/50"><td className="px-3 py-2">{t.mcb_type}</td><td className="px-3 py-2">{t.scheduled_date}</td><td className="px-3 py-2"><WorkloadBar value={t.priority ?? 0} /></td></tr>)}</tbody>
            </table>
          </div>
        </div>

        {/* Fourth Row - Charts */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
          <LiveChart title="Live Current" subtitle="Real-time current measurement" data={currentData} color="hsl(var(--primary))" gradientId="currentGradient" status={status} peakValue={peakCurrent} powerFactor={powerFactor} lastTime={lastUpdateTime} unit="A" />
          <TripCurveChart data={tripCurveData} mcbType={mcbType} />
          <OpeningEventChart data={openingEventData} tripInfo={`Last trip: ${lastUpdateTime}`} />
        </div>
      </div>
    </div>
  );
}
