import { motion } from "framer-motion";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Area, AreaChart } from "recharts";

const DataVisualization = () => {
  // Sample test data
  const currentData = [
    { time: "0ms", current: 0, voltage: 400 },
    { time: "1ms", current: 2500, voltage: 395 },
    { time: "2ms", current: 5800, voltage: 380 },
    { time: "3ms", current: 8200, voltage: 360 },
    { time: "4ms", current: 9500, voltage: 340 },
    { time: "5ms", current: 9800, voltage: 320 },
    { time: "6ms", current: 8000, voltage: 350 },
    { time: "7ms", current: 4500, voltage: 375 },
    { time: "8ms", current: 1200, voltage: 395 },
    { time: "9ms", current: 0, voltage: 400 },
  ];

  const testResults = [
    { name: "Type B", passed: 98.5, failed: 1.5 },
    { name: "Type C", passed: 97.2, failed: 2.8 },
    { name: "Type D", passed: 96.8, failed: 3.2 },
  ];

  return (
    <section className="py-24 bg-muted/30">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <span className="inline-block px-4 py-1.5 rounded-full bg-electric/10 text-electric text-sm font-medium mb-4">
            Real-Time Analytics
          </span>
          <h2 className="text-3xl sm:text-4xl font-bold text-foreground mb-4">
            Live Test Data Visualization
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Monitor and analyze short-circuit test parameters in real-time
          </p>
        </motion.div>

        <div className="grid lg:grid-cols-3 gap-6">
          {/* Main Chart */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="lg:col-span-2 bg-card rounded-2xl p-6 border border-border shadow-card"
          >
            <div className="flex items-center justify-between mb-6">
              <div>
                <h3 className="text-lg font-bold text-foreground">Short-Circuit Waveform</h3>
                <p className="text-sm text-muted-foreground">Current vs Time Analysis</p>
              </div>
              <div className="flex items-center gap-4">
                <div className="flex items-center gap-2">
                  <span className="w-3 h-3 rounded-full bg-electric" />
                  <span className="text-sm text-muted-foreground">Current (A)</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="w-3 h-3 rounded-full bg-primary" />
                  <span className="text-sm text-muted-foreground">Voltage (V)</span>
                </div>
              </div>
            </div>
            <div className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={currentData}>
                  <defs>
                    <linearGradient id="colorCurrent" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="hsl(187, 100%, 42%)" stopOpacity={0.3} />
                      <stop offset="95%" stopColor="hsl(187, 100%, 42%)" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="hsl(214, 32%, 91%)" />
                  <XAxis 
                    dataKey="time" 
                    stroke="hsl(215, 16%, 47%)" 
                    fontSize={12}
                    tickLine={false}
                  />
                  <YAxis 
                    stroke="hsl(215, 16%, 47%)" 
                    fontSize={12}
                    tickLine={false}
                    tickFormatter={(value) => `${value / 1000}k`}
                  />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: "hsl(0, 0%, 100%)",
                      border: "1px solid hsl(214, 32%, 91%)",
                      borderRadius: "8px",
                      boxShadow: "0 4px 24px -4px hsl(217, 91%, 20%, 0.08)",
                    }}
                    labelStyle={{ color: "hsl(222, 47%, 11%)", fontWeight: 600 }}
                  />
                  <Area
                    type="monotone"
                    dataKey="current"
                    stroke="hsl(187, 100%, 42%)"
                    strokeWidth={3}
                    fill="url(#colorCurrent)"
                  />
                  <Line
                    type="monotone"
                    dataKey="voltage"
                    stroke="hsl(217, 91%, 20%)"
                    strokeWidth={2}
                    dot={false}
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </motion.div>

          {/* Side Stats */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="space-y-6"
          >
            {/* Live Metrics */}
            <div className="bg-card rounded-2xl p-6 border border-border shadow-card">
              <h3 className="text-lg font-bold text-foreground mb-4">Live Metrics</h3>
              <div className="space-y-4">
                {[
                  { label: "Peak Current", value: "9,847 A", status: "normal" },
                  { label: "Trip Time", value: "4.2 ms", status: "normal" },
                  { label: "Arc Energy", value: "12.4 kJ", status: "warning" },
                  { label: "Power Factor", value: "0.45", status: "normal" },
                ].map((metric) => (
                  <div key={metric.label} className="flex items-center justify-between p-3 rounded-lg bg-muted/50">
                    <span className="text-sm text-muted-foreground">{metric.label}</span>
                    <div className="flex items-center gap-2">
                      <span className="font-mono font-semibold text-foreground">{metric.value}</span>
                      <span className={`w-2 h-2 rounded-full ${metric.status === 'normal' ? 'bg-green-500' : 'bg-yellow-500'}`} />
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Test Pass Rate */}
            <div className="bg-card rounded-2xl p-6 border border-border shadow-card">
              <h3 className="text-lg font-bold text-foreground mb-4">Pass Rate by Type</h3>
              <div className="space-y-4">
                {testResults.map((result) => (
                  <div key={result.name}>
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm font-medium text-foreground">{result.name}</span>
                      <span className="font-mono text-sm text-electric">{result.passed}%</span>
                    </div>
                    <div className="h-2 bg-muted rounded-full overflow-hidden">
                      <motion.div
                        initial={{ width: 0 }}
                        whileInView={{ width: `${result.passed}%` }}
                        viewport={{ once: true }}
                        transition={{ duration: 1, delay: 0.3 }}
                        className="h-full bg-gradient-electric rounded-full"
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default DataVisualization;
