import React, { useState, useCallback, useEffect } from "react";

import { useNavigate } from "react-router-dom";
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
import { Button } from "@/components/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/components/ui/select";
import { toast } from "@/hooks/use-toast";
import { Play, Zap, Calendar, RefreshCw,ArrowLeft } from "lucide-react";
import { supabase, TestResult as SupabaseTestResult, ActivityLog as SupabaseActivityLog } from "@/lib/supabase";
import { seedDummyData } from "@/lib/seed-data";

interface TestResult {
  id: string;
  type: string;
  result: "pass" | "fail";
  peakCurrent: number;
  timestamp: string;
  duration?: number;
}



const Index = () => {
  const navigate = useNavigate();
  const [mcbType, setMcbType] = useState<string>("B");           
  const [voltage, setVoltage] = useState<string>("240");    // mcb_type (text)
  const [faultCurrent, setFaultCurrent] = useState<string>("6");    // fault_current (real) kept as string for input; parseFloat when sending
  const [inputPowerFactor, setInputPowerFactor] = useState<string>("0.85"); // power_factor (real)
  const [mcbRating, setMcbRating] = useState<number>(63);           // mcb_rating (integer)
  
  const [isRunning, setIsRunning] = useState(false);
  const [status, setStatus] = useState<"idle" | "running" | "pass" | "fail">("idle");
  const [testProgress, setTestProgress] = useState(0);
  const [passRate, setPassRate] = useState(75);
  const [recentTests, setRecentTests] = useState<TestResult[]>([]);
  const [activityLogs, setActivityLogs] = useState<{ type: "success" | "warning" | "comment"; title: string; description: string; time: string; link?: string }[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // Live chart data state
  const [currentData, setCurrentData] = useState<{ time: number; value: number }[]>([]);
  const [openingEventData, setOpeningEventData] = useState<{ time: number; voltage: number; current: number }[]>([]);
  const [tripCurveData, setTripCurveData] = useState<{ current: number; time: number }[]>([]);
  const [peakCurrent, setPeakCurrent] = useState(0);
  const [powerFactor, setPowerFactor] = useState(0.95);
  const [lastUpdateTime, setLastUpdateTime] = useState("--");
  
  // Add this to your Index.tsx - Replace the existing reportData useMemo

const reportData = React.useMemo(() => {
  // Map recentTests to tripRows
  const tripRows = recentTests.slice(0, 10).map((t, idx) => ({
    sNo: String(idx + 1),
    type: t.type ?? mcbType ?? "B",
    poles: "2", // default; change if you have actual value
    rating: String(t.peakCurrent ? Math.round(t.peakCurrent) : 63),
    expectedTripTime: t.duration ? `${(t.duration * 0.9).toFixed(2)}s` : "",
    actualTripTime: t.duration ? `${t.duration.toFixed(2)}s` : "",
    tripTimeInCurve: t.duration ? (t.duration < 1 ? "Fast" : "Normal") : "",
    catalogueNo: t.id ?? "",
  }));

  // Header with current and voltage
  const header = {
    date: new Date().toLocaleDateString(),
    currentA: String(Math.round(peakCurrent ?? Number(faultCurrent) ?? 0)),
    voltage: openingEventData[0]?.voltage ? String(Math.round(openingEventData[0].voltage)) : "230",
    title: "MCB TRIP TEST REPORT",
  };

  // Metrics data
  const metrics = {
    testStatus: status === "pass" ? "PASS" : status === "fail" ? "FAIL" : status === "running" ? "RUNNING" : "IDLE",
    riskAnalysis: `${100 - passRate}%`,
    failedTests: String(recentTests.filter(t => t.result === "fail").length),
    totalTests: String(recentTests.length),
    peakCurrent: `${Math.round(peakCurrent)}A`,
  };

  // Failed tests details
  const failedTests = recentTests
    .filter(t => t.result === "fail")
    .slice(0, 3)
    .map(t => ({
      testId: t.id,
      mcbType: t.type,
      peakCurrent: `${Math.round(t.peakCurrent)}A`,
      status: "FAIL",
    }));

  // Recent tests details
  const recentTestsData = recentTests.slice(0, 3).map(t => ({
    testId: t.id,
    status: t.result.toUpperCase(),
    peakCurrent: `${Math.round(t.peakCurrent)}A`,
  }));

  return {
    header,
    tripRows,
    metrics,
    failedTests,
    recentTests: recentTestsData,
  };
}, [recentTests, peakCurrent, openingEventData, mcbType, faultCurrent, status, passRate]);
  
  
  // Fetch data from Supabase
  const fetchTestResults = async () => {
    const { data, error } = await supabase
      .from('test_results')
      .select('*')
      .order('created_at', { ascending: false })
      .limit(10);

    if (error) {
      console.error('Error fetching test results:', error);
      return;
    }

    if (data) {
      const mapped: TestResult[] = data.map((t: SupabaseTestResult) => ({
        id: `T-${t.id.slice(0, 3).toUpperCase()}`,
        type: t.mcb_type,
        result: t.result,
        peakCurrent: t.trip_time * 3 + 100,
        timestamp: new Date(t.created_at).toLocaleTimeString(),
        duration: t.trip_time / 10,
      }));
      setRecentTests(mapped);

      const passed = data.filter(t => t.result === 'pass').length;
      setPassRate(Math.round((passed / data.length) * 100) || 0);
    }
  };

  const fetchActivityLogs = async () => {
    const { data, error } = await supabase
      .from('activity_logs')
      .select('*')
      .order('created_at', { ascending: false })
      .limit(5);

    if (error) {
      console.error('Error fetching activity logs:', error);
      return;
    }

    if (data) {
      const mapped = data.map((log: SupabaseActivityLog) => ({
        type: log.action.toLowerCase().includes('fail') ? 'warning' as const :
              log.action.toLowerCase().includes('completed') || log.action.toLowerCase().includes('pass') ? 'success' as const : 'comment' as const,
        title: log.action,
        description: log.details,
        time: getRelativeTime(new Date(log.created_at)),
        link: log.action.includes('Test') ? 'View report' : undefined,
      }));
      setActivityLogs(mapped);
    }
  };

  const getRelativeTime = (date: Date) => {
    const diff = Date.now() - date.getTime();
    const mins = Math.floor(diff / 60000);
    if (mins < 1) return 'just now';
    if (mins < 60) return `${mins} min`;
    return `${Math.floor(mins / 60)} hr`;
  };

  // Initialize and set up real-time subscriptions
  useEffect(() => {
    const init = async () => {
      setIsLoading(true);
      await seedDummyData();
      await fetchTestResults();
      await fetchActivityLogs();
      setIsLoading(false);
    };
    init();

    // Real-time subscription for test results
    const testChannel = supabase
      .channel('test-results-changes')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'test_results' }, () => {
        fetchTestResults();
      })
      .subscribe();

    // Real-time subscription for activity logs
    const activityChannel = supabase
      .channel('activity-logs-changes')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'activity_logs' }, () => {
        fetchActivityLogs();
      })
      .subscribe();

    return () => {
      supabase.removeChannel(testChannel);
      supabase.removeChannel(activityChannel);
    };
  }, []);

  // Generate initial chart data
  useEffect(() => {
    const generateCurrentData = () => Array.from({ length: 50 }, (_, i) => ({
      time: i * 20,
      value: Math.sin(i * 0.3) * 80 + 100 + Math.random() * 20,
    }));

    const generateOpeningData = () => Array.from({ length: 30 }, (_, i) => ({
      time: i * 2,
      voltage: 230 * Math.exp(-i * 0.1) * (1 + Math.random() * 0.1),
      current: 500 * Math.exp(-i * 0.15) * (1 + Math.random() * 0.15),
    }));

    const generateTripData = () => [
      { current: 3, time: 0.5 },
      { current: 5, time: 0.1 },
      { current: 10, time: 0.02 },
    ];

    setCurrentData(generateCurrentData());
    setOpeningEventData(generateOpeningData());
    setTripCurveData(generateTripData());
    setPeakCurrent(145.2);
    setLastUpdateTime(new Date().toLocaleTimeString());
  }, []);

  // Update charts during test
  useEffect(() => {
    if (!isRunning) return;
    const interval = setInterval(() => {
      setCurrentData(prev => {
        const newPoint = { time: (prev[prev.length - 1]?.time || 0) + 20, value: Math.sin(Date.now() * 0.005) * 100 + 150 + Math.random() * 30 };
        return [...prev.slice(-49), newPoint];
      });
      setPeakCurrent(prev => Math.max(prev, 100 + Math.random() * 150));
      setPowerFactor(0.85 + Math.random() * 0.1);
      setLastUpdateTime(new Date().toLocaleTimeString());
    }, 200);
    return () => clearInterval(interval);
  }, [isRunning]);

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
    if (type === "failCount") return recentTests.filter(t => t.result === "fail").length > 1 ? "high" : "medium";
    return "low";
  };

  const riskItems = [
    { value: `${100 - passRate}%`, label: "Test Failure Rate", severity: getSeverity("failRate") },
    { value: recentTests.filter(t => t.result === "fail").length, label: "Failed tests (recent)", severity: getSeverity("failCount") },
    { value: recentTests.length, label: "Total tests today", severity: "low" as const },
  ];

  const testDurationData = recentTests.slice(0, 5).map(t => ({
    name: t.id.replace("T-", ""),
    value: t.duration || 3,
    color: t.result === "pass" ? "hsl(var(--success))" : "hsl(var(--destructive))",
  }));

  const upcomingTests = [
    { type: "B", description: "Standard load test", deadline: "Today", workload: 14 },
    { type: "C", description: "High inrush test", deadline: "Tomorrow", workload: 50 },
    { type: "D", description: "Motor starting test", deadline: "Dec 10", workload: 30 },
  ];

  const runTest = useCallback(async () => {
    setIsRunning(true);
    setStatus("running");
    setTestProgress(0);

    toast({ title: "Test Started", description: `Running MCB Type ${mcbType} test at ${faultCurrent} kA, PF: ${inputPowerFactor}` });

    // Save test configuration to Supabase
    await supabase.from('test_configurations').insert({
      voltage : parseFloat(voltage),
      fault_current: parseFloat(faultCurrent),
      power_factor: parseFloat(inputPowerFactor),
      mcb_rating: mcbRating, // new
    });
    


    // Log activity
    await supabase.from('activity_logs').insert({
      action: 'Test Started',
      details: `MCB Type ${mcbType} at ${faultCurrent}kA, PF: ${inputPowerFactor}`,
    });

    const progressInterval = setInterval(() => {
      setTestProgress(prev => Math.min(prev + 15, 95));
    }, 400);

    setTimeout(async () => {
      clearInterval(progressInterval);
      setTestProgress(100);
      setIsRunning(false);

      const result: "pass" | "fail" = Math.random() > 0.3 ? "pass" : "fail";
      setStatus(result);

      const tripTime = Math.round(Math.random() * 30 + 30);

      // Save to Supabase
      await supabase.from('test_results').insert({
        mcb_type: mcbType,
        fault_current: parseInt(faultCurrent),
        power_factor: parseFloat(inputPowerFactor),
        mcb_rating: mcbRating, // optional
        trip_time: tripTime,
        result,
      });
      
      // Log activity
      await supabase.from('activity_logs').insert({
        action: result === 'pass' ? 'Test Completed' : 'Test Failed',
        details: `Result: ${result.toUpperCase()} - Trip time ${tripTime}ms`,
      });

      toast({
        title: result === "pass" ? "✓ Test Passed" : "✗ Test Failed",
        description: `Trip time: ${tripTime}ms`,
        variant: result === "pass" ? "default" : "destructive",
      });
    }, 3000);
  }, [mcbType, faultCurrent, inputPowerFactor]);

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

  const handleRefresh = async () => {
    setIsLoading(true);
    await fetchTestResults();
    await fetchActivityLogs();
    setIsLoading(false);
    toast({ title: "Data Refreshed", description: "Latest data loaded from database" });
  };



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
        </div>
      <div className="max-w-7xl mx-auto">
      <DashboardHeader reportData={reportData} />
        
        {/* Top Row */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 mb-5">
          <div className="lg:col-span-2 bg-card rounded-2xl border border-border p-5 flex flex-col items-center justify-center">
            <p className="text-sm font-medium text-muted-foreground mb-3">Overall Progress</p>
            <ProgressCircle value={passRate} size={100} />
          </div>
          <div className="lg:col-span-7"><StatusPipeline steps={pipelineSteps} /></div>
          <div className="lg:col-span-3">
            <HighlightCard title="Next Scheduled Test" value="Today" subtitle={`MCB Type ${mcbType}`} variant="success" icon={<Calendar className="h-8 w-8" />} />
          </div>
        </div>

        {/* Second Row */}
        <div className="grid grid-cols-1 xl:grid-cols-3 gap-5">
        <div className="bg-card rounded-2xl border border-border p-5">
  <h3 className="text-sm font-semibold text-foreground mb-5">Test Configuration</h3>
  <div className="space-y-4">
  <div>
      <label className="block text-xs text-muted-foreground mb-2">Voltge</label>
      <input
        type="number"
        step="10"
        value={voltage}
        onChange={(e) => setVoltage(e.target.value)}
        placeholder="e.g. 240"
        className="w-full h-10 px-3 rounded-md bg-muted/50 border border-border text-sm"
      />
    </div>

    <div>
      <label className="block text-xs text-muted-foreground mb-2">Fault Current (fault_current, kA)</label>
      <input
        type="number"
        step="0.01"
        value={faultCurrent}
        onChange={(e) => setFaultCurrent(e.target.value)}
        placeholder="e.g. 6"
        className="w-full h-10 px-3 rounded-md bg-muted/50 border border-border text-sm"
      />
    </div>

    <div>
      <label className="block text-xs text-muted-foreground mb-2">Power Factor (power_factor)</label>
      <input
        type="number"
        step="0.01"
        min="0"
        max="1.0"
        value={inputPowerFactor}
        onChange={(e) => setInputPowerFactor(e.target.value)}
        placeholder="e.g. 0.85"
        className="w-full h-10 px-3 rounded-md bg-muted/50 border border-border text-sm"
      />
    </div>

    <div>
      <label className="block text-xs text-muted-foreground mb-2">MCB Rating (mcb_rating)</label>
      <input
        type="number"
        step="1"
        min="0"
        value={mcbRating}
        onChange={(e) => {
          const v = parseInt(e.target.value, 10);
          setMcbRating(Number.isNaN(v) ? 0 : v);
        }}
        placeholder="e.g. 63"
        className="w-full h-10 px-3 rounded-md bg-muted/50 border border-border text-sm"
      />
    </div>

    <Button className="w-full bg-green-500 text-white hover:bg-green-400 mt-2" onClick={runTest} disabled={isRunning}>
      {isRunning ? <><Zap className="animate-pulse mr-2" /> Running...</> : <><Play className="mr-2" /> Run Test</>}
    </Button>
  </div>
</div>

          <LiveChart
            title="Real-time Current"
            subtitle="Real-time current measurement"
            data={currentData}
            color="hsl(var(--primary))"
            gradientId="currentGradient"
            status={status}
            peakValue={peakCurrent}
            powerFactor={powerFactor}
            lastTime={lastUpdateTime}
          />
          <TripCurveChart data={tripCurveData} mcbType={mcbType} />
          </div>

          {/* Third Row */}
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-5 mb-5 mt-5">
          <OpeningEventChart data={openingEventData} tripInfo={`Last trip: ${lastUpdateTime}`} />
          <RiskIndicator title="Risk Analysis" items={riskItems} />
          <BarChart title="Test Duration (seconds)" data={testDurationData} />
          <div className="bg-card rounded-2xl border border-border overflow-hidden">
            <div className="bg-green-500 text-white px-4 py-2"><h3 className="text-sm font-semibold">Recent Tests</h3></div>
            <table className="w-full text-sm">
              <thead><tr className="bg-muted/50 border-b border-border"><th className="px-3 py-2 text-left text-muted-foreground">ID</th><th className="px-3 py-2 text-left text-muted-foreground">Result</th><th className="px-3 py-2 text-right text-muted-foreground">Peak</th></tr></thead>
              <tbody>{recentTests.slice(0, 6).map(t => <tr key={t.id} className="border-b border-border/50"><td className="px-3 py-2">{t.id}</td><td className="px-3 py-2"><TestResultBadge result={t.result} size="sm" /></td><td className="px-3 py-2 text-right">{t.peakCurrent}A</td></tr>)}</tbody>
            </table>
          </div>
          </div>
        
        {/* Fourth Row - Charts */}
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-5 mb-5">
          
          
        
          <div className="bg-card rounded-2xl border border-border overflow-hidden">
            <div className="bg-destructive text-destructive-foreground px-4 py-2"><h3 className="text-sm font-semibold">Failed Tests</h3></div>
            <table className="w-full text-sm">
              <thead><tr className="bg-muted/50 border-b border-border"><th className="px-3 py-2 text-left text-muted-foreground">ID</th><th className="px-3 py-2 text-left text-muted-foreground">Type</th><th className="px-3 py-2 text-right text-muted-foreground">Peak</th></tr></thead>
              <tbody>{recentTests.filter(t => t.result === "fail").slice(0, 5).map(t => <tr key={t.id} className="border-b border-border/50"><td className="px-3 py-2">{t.id}</td><td className="px-3 py-2">{t.type}</td><td className="px-3 py-2 text-right">{t.peakCurrent}A</td></tr>)}</tbody>
            </table>
          </div>
          <ActivityLog title="Test Log" entries={activityLogs.length > 0 ? activityLogs : [{ type: 'comment', title: 'No activity yet', description: 'Run a test to see logs', time: 'now' }]} />
          <div className="bg-card rounded-2xl border border-border overflow-hidden">
            <div className="bg-amber-500 text-white px-4 py-2"><h3 className="text-sm font-semibold">Upcoming Tests</h3></div>
            <table className="w-full text-sm">
              <thead><tr className="bg-muted/50 border-b border-border"><th className="px-3 py-2 text-left text-muted-foreground">Type</th><th className="px-3 py-2 text-left text-muted-foreground">Date</th><th className="px-3 py-2 text-right text-muted-foreground">Priority</th></tr></thead>
              <tbody>{upcomingTests.map((t, i) => <tr key={i} className="border-b border-border/50"><td className="px-3 py-2 font-medium">{t.type}</td><td className="px-3 py-2">{t.deadline}</td><td className="px-3 py-2"><WorkloadBar value={t.workload} /></td></tr>)}</tbody>
            </table>
          </div>
          <SummarySection title="Test Summary" items={[{ label: "Date", value: new Date().toLocaleDateString() }, { label: "MCB Type", value: `Type ${mcbType}` }, { label: "Fault Current", value: `${faultCurrent} kA` }, { label: "Status", value: status === "idle" ? "Ready" : status.charAt(0).toUpperCase() + status.slice(1) }]} highlightLast />
          
        </div>

        
       

        
        
      </div>
    </div>
  );
};

export default Index;
