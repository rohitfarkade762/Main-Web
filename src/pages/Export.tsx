import React, { useState } from "react";
import { Page, Text, View, Document, StyleSheet, PDFDownloadLink } from "@react-pdf/renderer";
import { FileDown, Loader2, CheckCircle2, FileText } from "lucide-react";

const styles = StyleSheet.create({
  page: { 
    fontFamily: "Helvetica", 
    fontSize: 12, 
    padding: 30,
    backgroundColor: "#ffffff"
  },
  header: { 
    marginBottom: 20, 
    fontSize: 24, 
    fontWeight: 700,
    color: "#1e293b",
    textAlign: "center",
    borderBottomWidth: 2,
    borderBottomColor: "#3b82f6",
    paddingBottom: 10
  },
  subHeader: {
    fontSize: 10,
    color: "#64748b",
    textAlign: "center",
    marginBottom: 20
  },
  tableHeader: {
    flexDirection: "row",
    backgroundColor: "#f1f5f9",
    borderBottomWidth: 2,
    borderBottomColor: "#3b82f6",
    padding: 10,
    fontWeight: 700
  },
  tableRow: { 
    flexDirection: "row", 
    borderBottomWidth: 1, 
    borderBottomColor: "#e2e8f0",
    padding: 10,
    backgroundColor: "#ffffff"
  },
  tableRowAlt: {
    flexDirection: "row", 
    borderBottomWidth: 1, 
    borderBottomColor: "#e2e8f0",
    padding: 10,
    backgroundColor: "#f8fafc"
  },
  col: { 
    flex: 1,
    fontSize: 11
  },
  colHeader: {
    flex: 1,
    fontSize: 12,
    fontWeight: 700,
    color: "#1e293b"
  },
  footer: {
    position: "absolute",
    bottom: 30,
    left: 30,
    right: 30,
    textAlign: "center",
    fontSize: 10,
    color: "#94a3b8",
    borderTopWidth: 1,
    borderTopColor: "#e2e8f0",
    paddingTop: 10
  }
});

export function ReportDocument({ data }: { data: any[] }) {
  const currentDate = new Date().toLocaleDateString('en-US', { 
    year: 'numeric', 
    month: 'long', 
    day: 'numeric' 
  });

  return (
    <Document>
      <Page size="A4" style={styles.page}>
        <Text style={styles.header}>MCB Test Report</Text>
        <Text style={styles.subHeader}>Generated on {currentDate}</Text>
        
        {/* Table Header */}
        <View style={styles.tableHeader}>
          <Text style={styles.colHeader}>Test ID</Text>
          <Text style={styles.colHeader}>Type</Text>
          <Text style={styles.colHeader}>Result</Text>
          <Text style={styles.colHeader}>Voltage (V)</Text>
        </View>

        {/* Table Rows */}
        {data.map((row: any, i: number) => (
          <View key={i} style={i % 2 === 0 ? styles.tableRow : styles.tableRowAlt}>
            <Text style={styles.col}>{row.id || 'N/A'}</Text>
            <Text style={styles.col}>{row.type || 'N/A'}</Text>
            <Text style={styles.col}>{row.result || 'N/A'}</Text>
            <Text style={styles.col}>{row.Voltage || 'N/A'}</Text>
          </View>
        ))}

        {/* Footer */}
        <Text style={styles.footer}>
          MCB Testing Dashboard • Total Records: {data.length} • Confidential
        </Text>
      </Page>
    </Document>
  );
}

// Main Download Button Component
export default function DownloadReport({ data }: { data: any[] }) {
  const [isHovered, setIsHovered] = useState(false);
  const [downloaded, setDownloaded] = useState(false);

  const handleDownloadComplete = () => {
    setDownloaded(true);
    setTimeout(() => setDownloaded(false), 2000);
  };

  return (
    <PDFDownloadLink 
      document={<ReportDocument data={data} />} 
      fileName={`mcb_test_report_${new Date().toISOString().split('T')[0]}.pdf`}
      className="inline-block"
      onClick={handleDownloadComplete}
    >
      {({ blob, url, loading, error }) => (
        <button
          onMouseEnter={() => setIsHovered(true)}
          onMouseLeave={() => setIsHovered(false)}
          disabled={loading}
          className={`
            btn-shine group relative overflow-hidden
            px-6 py-3 rounded-xl
            font-semibold text-sm font-display
            transition-all duration-300
            ${downloaded 
              ? 'bg-success text-success-foreground' 
              : 'bg-gradient-to-r from-destructive to-destructive/90 text-white'
            }
            ${loading ? 'cursor-wait scale-95' : 'cursor-pointer hover:scale-105'}
            shadow-xl hover:shadow-2xl
            disabled:opacity-70
            flex items-center gap-2.5
            border border-white/10
            animate-fade-in stagger-2
            
          `}
          style={{
            boxShadow: downloaded 
              ? '0 0 30px hsl(var(--success) / 0.4)' 
              : '0 10px 40px -10px hsl(var(--destructive) / 0.5)'
          }}
        >
          {/* Animated glow effect */}
          {!downloaded && !loading && (
            <div className="absolute inset-0 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity duration-500">
              <div className="absolute inset-0 rounded-xl" 
                style={{
                  boxShadow: '0 0 20px hsl(var(--destructive) / 0.5)',
                  animation: 'pulse 2s ease-in-out infinite'
                }}
              />
            </div>
          )}

          {/* Button content */}
          <span className="relative z-10 flex items-center gap-2.5 ">
            {loading ? (
              <>
                <Loader2 className="w-5 h-5 animate-spin" />
                <span>Preparing PDF...</span>
              </>
            ) : downloaded ? (
              <>
                <CheckCircle2 className="w-5 h-5 animate-scale-in" />
                <span>Downloaded!</span>
              </>
            ) : (
              <>
                <FileDown className="w-5 h-5 transition-transform group-hover:translate-y-1 duration-300" />
                <span>Download Report</span>
              </>
            )}
          </span>

          {/* Decorative elements */}
          {!loading && !downloaded && (
            <>
              <span className="absolute top-2 right-2 w-2 h-2 bg-white/40 rounded-full animate-pulse" />
              <div className="absolute -right-1 -top-1 w-6 h-6 bg-white/10 rounded-full blur-md" />
            </>
          )}
        </button>
      )}
    </PDFDownloadLink>
  );
}