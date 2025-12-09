// ReportPdf.tsx
import React from "react";
import { Page, Text, View, Document, StyleSheet, PDFDownloadLink } from "@react-pdf/renderer";

const styles = StyleSheet.create({
  page: { fontFamily: "Helvetica", fontSize: 12, padding: 20 },
  header: { marginBottom: 10, fontSize: 16, fontWeight: 700 },
  tableRow: { flexDirection: "row", borderBottomWidth: 1, padding: 6 },
  col: { flex: 1 }
});

export function ReportDocument({ data }: { data: any }) {
  return (
    <Document>
      <Page size="A4" style={styles.page}>
        <Text style={styles.header}>Test Report</Text>
        <View>
          {data.map((row: any, i: number) => (
            <View key={i} style={styles.tableRow}>
              <Text style={styles.col}>{row.id}</Text>
              <Text style={styles.col}>{row.type}</Text>
              <Text style={styles.col}>{row.result}</Text>
              <Text style={styles.col}>{row.Voltage}</Text>
            </View>
          ))}
        </View>
      </Page>
    </Document>
  );
}

// Usage in component
export default function DownloadReport({ data }: { data: any[] }) {
  return (
    <PDFDownloadLink document={<ReportDocument data={data} />} fileName="report.pdf">
      {({ blob, url, loading, error }) => (loading ? "Preparing..." : "Download PDF")}
    </PDFDownloadLink>
  );
}
