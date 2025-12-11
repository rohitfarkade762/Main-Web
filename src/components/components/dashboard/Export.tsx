// TripTestReport.tsx
import React, { useMemo } from "react";
import {
  Page,
  Text,
  View,
  Document,
  StyleSheet,
  PDFDownloadLink,
} from "@react-pdf/renderer";
import { Loader2, FileDown } from "lucide-react";

const styles = StyleSheet.create({
  page: {
    fontSize: 10,
    paddingTop: 30,
    paddingHorizontal: 30,
    paddingBottom: 30,
    fontFamily: "Helvetica",
    lineHeight: 1.3,
  },
  title: {
    fontSize: 18,
    textAlign: "center",
    fontWeight: 700,
    marginBottom: 20,
    textDecoration: "underline",
  },

  // Main Trip Test Table
  table: {
    borderWidth: 1,
    borderColor: "#000",
    marginBottom: 15,
  },
  tableHeader: {
    flexDirection: "row",
    backgroundColor: "#e0e0e0",
    borderBottomWidth: 1,
    borderColor: "#000",
    fontWeight: 700,
  },
  tableRow: {
    flexDirection: "row",
    borderBottomWidth: 1,
    borderColor: "#000",
    minHeight: 25,
  },
  cell: {
    padding: 5,
    borderRightWidth: 1,
    borderColor: "#000",
    justifyContent: "center",
    fontSize: 9,
  },
  w8: { width: "8%" },
  w10: { width: "10%" },
  w12: { width: "12%" },
  w15: { width: "15%" },
  w20: { width: "20%" },
  w25: { width: "25%" },
  w30: { width: "30%" },
  w50: { width: "50%" },
  w70: { width: "70%" },
  w100: { width: "100%" },

  // Metrics Section
  metricsSection: {
    marginBottom: 15,
  },
  metricsGrid: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 10,
  },
  metricBox: {
    width: "48%",
    borderWidth: 1,
    borderColor: "#000",
    padding: 8,
  },
  metricLabel: {
    fontSize: 9,
    fontWeight: 700,
    marginBottom: 3,
  },
  metricValue: {
    fontSize: 10,
    color: "#333",
  },

  // Additional data tables
  dataTable: {
    borderWidth: 1,
    borderColor: "#000",
    marginBottom: 15,
  },
  dataTableHeader: {
    backgroundColor: "#e0e0e0",
    padding: 6,
    borderBottomWidth: 1,
    borderColor: "#000",
    fontWeight: 700,
    fontSize: 10,
  },

  sectionTitle: {
    fontSize: 11,
    fontWeight: 700,
    marginTop: 10,
    marginBottom: 5,
  },

  bold: { fontWeight: 700 },
  center: { textAlign: "center" },
});

type TripRow = {
  sNo?: string;
  type?: string;
  poles?: string;
  rating?: string;
  expectedTripTime?: string;
  actualTripTime?: string;
  tripTimeInCurve?: string;
  catalogueNo?: string;
};

type MetricsData = {
  testStatus?: string;
  riskAnalysis?: string;
  failedTests?: string;
  totalTests?: string;
  peakCurrent?: string;
};

type TestDetail = {
  testId?: string;
  mcbType?: string;
  peakCurrent?: string;
  status?: string;
};

export function TripTestReportDocument({
  header = {},
  tripRows = [] as TripRow[],
  metrics = {} as MetricsData,
  failedTests = [] as TestDetail[],
  recentTests = [] as TestDetail[],
}: {
  header?: { currentA?: string; voltage?: string; date?: string; title?: string };
  tripRows?: TripRow[];
  metrics?: MetricsData;
  failedTests?: TestDetail[];
  recentTests?: TestDetail[];
}) {
  const today = header.date ?? new Date().toLocaleDateString();

  return (
    <Document>
      <Page size="A4" style={styles.page}>
        {/* Title */}
        <Text style={styles.title}>
          {header.title ?? "MCB TRIP TEST REPORT"}
        </Text>

        {/* Main Trip Test Table */}
        <View style={styles.table}>
          <View style={styles.tableHeader}>
            <Text style={[styles.cell, styles.w8, styles.bold]}>S.No</Text>
            <Text style={[styles.cell, styles.w10, styles.bold]}>Type</Text>
            <Text style={[styles.cell, styles.w12, styles.bold]}>Number of poles</Text>
            <Text style={[styles.cell, styles.w10, styles.bold]}>Rating (A)</Text>
            <Text style={[styles.cell, styles.w15, styles.bold]}>Expected Trip time</Text>
            <Text style={[styles.cell, styles.w15, styles.bold]}>Actual trip time</Text>
            <Text style={[styles.cell, styles.w15, styles.bold]}>Trip Time in curve</Text>
            <Text style={[styles.cell, styles.w15, styles.bold]}>catalogue number</Text>
          </View>

          {tripRows.length === 0 ? (
            <View style={styles.tableRow}>
              <Text style={[styles.cell, styles.w100, styles.center]}>No test data available</Text>
            </View>
          ) : (
            tripRows.map((row, i) => (
              <View key={i} style={styles.tableRow}>
                <Text style={[styles.cell, styles.w8]}>{row.sNo ?? ""}</Text>
                <Text style={[styles.cell, styles.w10]}>{row.type ?? ""}</Text>
                <Text style={[styles.cell, styles.w12]}>{row.poles ?? ""}</Text>
                <Text style={[styles.cell, styles.w10]}>{row.rating ?? ""}</Text>
                <Text style={[styles.cell, styles.w15]}>{row.expectedTripTime ?? ""}</Text>
                <Text style={[styles.cell, styles.w15]}>{row.actualTripTime ?? ""}</Text>
                <Text style={[styles.cell, styles.w15]}>{row.tripTimeInCurve ?? ""}</Text>
                <Text style={[styles.cell, styles.w15]}>{row.catalogueNo ?? ""}</Text>
              </View>
            ))
          )}
        </View>

        {/* Current & Voltage */}
        <View style={styles.metricsGrid}>
          <View style={styles.metricBox}>
            <Text style={styles.metricLabel}>Current (A):</Text>
            <Text style={styles.metricValue}>{header.currentA ?? ""}</Text>
          </View>
          <View style={styles.metricBox}>
            <Text style={styles.metricLabel}>Voltage (V):</Text>
            <Text style={styles.metricValue}>{header.voltage ?? ""}</Text>
          </View>
        </View>

        {/* Metrics Table */}
        <View style={styles.dataTable}>
          <Text style={styles.dataTableHeader}>Test Metrics</Text>
          <View style={styles.tableRow}>
            <Text style={[styles.cell, styles.w30, styles.bold]}>Metric</Text>
            <Text style={[styles.cell, styles.w30, styles.bold]}>Value</Text>
            <Text style={[styles.cell, styles.w40, styles.bold]}>Interpretation</Text>
          </View>
          
          <View style={styles.tableRow}>
            <Text style={[styles.cell, styles.w30]}>Test Status (Latest)</Text>
            <Text style={[styles.cell, styles.w30]}>{metrics.testStatus ?? ""}</Text>
            <Text style={[styles.cell, styles.w40]}>{""}</Text>
          </View>
          
          <View style={styles.tableRow}>
            <Text style={[styles.cell, styles.w30]}>Risk Analysis (Failure Rate)</Text>
            <Text style={[styles.cell, styles.w30]}>{metrics.riskAnalysis ?? ""}</Text>
            <Text style={[styles.cell, styles.w40]}>{""}</Text>
          </View>
          
          <View style={styles.tableRow}>
            <Text style={[styles.cell, styles.w30]}>Failed Tests (Recent)</Text>
            <Text style={[styles.cell, styles.w30]}>{metrics.failedTests ?? ""}</Text>
            <Text style={[styles.cell, styles.w40]}>{""}</Text>
          </View>
          
          <View style={styles.tableRow}>
            <Text style={[styles.cell, styles.w30]}>Total Tests Today</Text>
            <Text style={[styles.cell, styles.w30]}>{metrics.totalTests ?? ""}</Text>
            <Text style={[styles.cell, styles.w40]}>{""}</Text>
          </View>
          
          <View style={styles.tableRow}>
            <Text style={[styles.cell, styles.w30]}>Real-time Peak Current</Text>
            <Text style={[styles.cell, styles.w30]}>{metrics.peakCurrent ?? ""}</Text>
            <Text style={[styles.cell, styles.w40]}>{""}</Text>
          </View>
        </View>

        {/* Failed Tests Table */}
        <View style={styles.dataTable}>
          <Text style={styles.dataTableHeader}>Failed Tests</Text>
          <View style={styles.tableRow}>
            <Text style={[styles.cell, styles.w30, styles.bold]}>Test ID</Text>
            <Text style={[styles.cell, styles.w30, styles.bold]}>MCB Type</Text>
            <Text style={[styles.cell, styles.w20, styles.bold]}>Peak Current</Text>
            <Text style={[styles.cell, styles.w20, styles.bold]}>Status (Source)</Text>
          </View>
          
          {failedTests.length === 0 ? (
            <View style={styles.tableRow}>
              <Text style={[styles.cell, styles.w100, styles.center]}>No failed tests</Text>
            </View>
          ) : (
            failedTests.slice(0, 3).map((test, i) => (
              <View key={i} style={styles.tableRow}>
                <Text style={[styles.cell, styles.w30]}>{test.testId ?? ""}</Text>
                <Text style={[styles.cell, styles.w30]}>{test.mcbType ?? ""}</Text>
                <Text style={[styles.cell, styles.w20]}>{test.peakCurrent ?? ""}</Text>
                <Text style={[styles.cell, styles.w20]}>{test.status ?? ""}</Text>
              </View>
            ))
          )}
        </View>

        {/* Recent Tests Table */}
        <View style={styles.dataTable}>
          <Text style={styles.dataTableHeader}>Recent Tests</Text>
          <View style={styles.tableRow}>
            <Text style={[styles.cell, styles.w30, styles.bold]}>Test ID</Text>
            <Text style={[styles.cell, styles.w30, styles.bold]}>Result</Text>
            <Text style={[styles.cell, styles.w40, styles.bold]}>Peak Current</Text>
          </View>
          
          {recentTests.length === 0 ? (
            <View style={styles.tableRow}>
              <Text style={[styles.cell, styles.w100, styles.center]}>No recent tests</Text>
            </View>
          ) : (
            recentTests.slice(0, 3).map((test, i) => (
              <View key={i} style={styles.tableRow}>
                <Text style={[styles.cell, styles.w30]}>{test.testId ?? ""}</Text>
                <Text style={[styles.cell, styles.w30]}>{test.status ?? ""}</Text>
                <Text style={[styles.cell, styles.w40]}>{test.peakCurrent ?? ""}</Text>
              </View>
            ))
          )}
        </View>

        {/* Footer */}
        <View style={{ marginTop: 20, flexDirection: "row", justifyContent: "space-between" }}>
          <Text style={styles.metricLabel}>Date: {today}</Text>
          <Text style={styles.metricLabel}>Page 1 of 1</Text>
        </View>
      </Page>
    </Document>
  );
}

/**
 * Download button wrapper
 */
export default function DownloadTripTestReport({ data }: { data: any }) {
  const doc = useMemo(
    () => (
      <TripTestReportDocument
        header={data.header}
        tripRows={data.tripRows}
        metrics={data.metrics}
        failedTests={data.failedTests}
        recentTests={data.recentTests}
      />
    ),
    [data]
  );

  const filename = `mcb_trip_test_report_${new Date().toISOString().slice(0, 10)}.pdf`;

  return (
    <PDFDownloadLink document={doc} fileName={filename}>
      {({ loading }) => (
        <button
          disabled={loading}
          className={`
            px-5 py-2.5 rounded-lg font-medium text-sm
            flex items-center gap-2 transition-all duration-300
            border border-white/10 shadow-md
            ${
              loading
                ? "bg-gray-300 text-gray-600 cursor-wait"
                : "bg-gradient-to-r from-primary to-primary/80 text-white hover:scale-105 hover:shadow-lg"
            }
          `}
          style={{
            boxShadow: loading
              ? "0 0 10px rgba(0,0,0,0.1)"
              : "0 4px 16px rgba(59,130,246,0.35)",
          }}
        >
          {loading ? (
            <>
              <Loader2 className="w-4 h-4 animate-spin" />
              Preparing PDF...
            </>
          ) : (
            <>
              <FileDown className="w-4 h-4" />
              Download Trip Test Report
            </>
          )}
        </button>
      )}
    </PDFDownloadLink>
  );
}