// TripTestReport.tsx
import React, { useMemo } from "react";
import {
  Page,
  Text,
  View,
  Document,
  StyleSheet,
  PDFDownloadLink,
  Font,
} from "@react-pdf/renderer";
import { Loader2, FileDown } from "lucide-react";


/**
 * Optional: register a font file (adjust path to your public/fonts folder)
 * If you don't register a font, the renderer will use built-in fallback fonts.
 */
// Font.register({ family: "HelveticaNeue", src: "/fonts/HelveticaNeue.ttf" });

const styles = StyleSheet.create({
  page: {
    fontSize: 10,
    paddingTop: 18,
    paddingHorizontal: 18,
    paddingBottom: 22,
    fontFamily: "Helvetica",
    lineHeight: 1.15,
  },
  title: {
    fontSize: 16,
    textAlign: "center",
    fontWeight: 700,
    marginBottom: 6,
  },
  subtitleRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 8,
  },
  smallText: { fontSize: 9, color: "#333" },

  // table-like appearance
  table: { borderWidth: 1, borderColor: "#333", marginBottom: 8 },
  row: { flexDirection: "row", borderBottomWidth: 1, borderColor: "#333" },
  cell: { padding: 6, borderRightWidth: 1, borderColor: "#333" },
  // widths for columns (percentage-based)
  w10: { width: "10%" },
  w15: { width: "15%" },
  w20: { width: "20%" },
  w25: { width: "25%" },
  w30: { width: "30%" },
  w100: { width: "100%" },

  // section headers
  sectionHeader: {
    backgroundColor: "#f2f4f7",
    padding: 6,
    fontWeight: 700,
    borderWidth: 1,
    borderColor: "#333",
    marginBottom: 6,
  },

  // multi-column blocks
  twoCols: { flexDirection: "row", justifyContent: "space-between", marginBottom: 6 },
  colLeft: { width: "48%" },
  colRight: { width: "48%" },

  // mechanic inspection table specifics
  inspectTable: { borderWidth: 1, borderColor: "#333", marginTop: 4 },
  inspectRow: { flexDirection: "row", borderBottomWidth: 1, borderColor: "#333" },
  inspectCols: {
    width: "33%",
    padding: 6,
    borderRightWidth: 1,
    borderColor: "#333",
  },

  // footer block
  footer: {
    marginTop: 10,
    borderTopWidth: 1,
    borderColor: "#333",
    paddingTop: 8,
    flexDirection: "row",
    justifyContent: "space-between",
  },

  // helper
  center: { textAlign: "center" },
  bold: { fontWeight: 700 },
  spacer: { marginTop: 4 },
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
  currentA?: string;
  time?: string;
  voltageV?: string;
  openingEvent?: string;
  voltageAndCurrent?: string;
  multiplesOfIn?: string;
  trippingCharacteristic?: string;
};

type ProductSpec = {
  ref?: string;
  serialNo?: string;
  modelNo?: string;
  noOfPoles?: string;
  type?: string;
  ratedCurrent?: string;
  ratedVoltage?: string;
  ratedFrequency?: string;
  ratedShortCircuitBreakingCapacity?: string;
  magneticReleaseSetting?: string;
  ratedInsulationVoltage?: string;
  ratedImpulseVoltage?: string;
  electricalMechanicalEndurance?: string;
  ambientWorkingTemperature?: string;
  terminalCapacity?: string;
  vibration?: string;
  shockResistance?: string;
  protectionClass?: string;
  installationPosition?: string;
  mounting?: string;
  caseAndCover?: string;
  auxiliaryContacts?: string;
  shuntTrip?: string;
};

type InspectItem = {
  description?: string;
  status?: string;
  remarks?: string;
};

export function TripTestReportDocument({
  header = {},
  tripRows = [] as TripRow[],
  inspections = [] as InspectItem[],
  productSpec = {} as ProductSpec,
  testedBy = { name: "", date: "", reviewedBy: "", result: "" },
}: {
  header?: { currentA?: string; voltage?: string; date?: string; title?: string };
  tripRows?: TripRow[];
  inspections?: InspectItem[];
  productSpec?: ProductSpec;
  testedBy?: { name?: string; date?: string; reviewedBy?: string; result?: string };
}) {
  const today = header.date ?? new Date().toLocaleDateString();
  return (
    <Document>
      <Page size="A4" style={styles.page}>
        {/* Header */}
        <Text style={styles.title}>{header.title ?? "MCB TRIP TEST REPORT"}</Text>

        <View style={styles.subtitleRow}>
          <Text style={styles.smallText}>Date: {today}</Text>
          <Text style={styles.smallText}>Current (A): {header.currentA ?? ""}</Text>
          <Text style={styles.smallText}>Voltage (V): {header.voltage ?? ""}</Text>
        </View>

        {/* Trip Test Table header */}
        <View style={[styles.table]}>
          <View style={[styles.row, { backgroundColor: "#e9eef7" }]}>
            <Text style={[styles.cell, styles.w10, styles.bold]}>S.No</Text>
            <Text style={[styles.cell, styles.w15, styles.bold]}>Type</Text>
            <Text style={[styles.cell, styles.w10, styles.bold]}>No. of Poles</Text>
            <Text style={[styles.cell, styles.w10, styles.bold]}>Rating (A)</Text>
            <Text style={[styles.cell, styles.w10, styles.bold]}>Expected Trip Time</Text>
            <Text style={[styles.cell, styles.w10, styles.bold]}>Actual Trip Time</Text>
            <Text style={[styles.cell, styles.w15, styles.bold]}>Trip Time in Curve</Text>
            <Text style={[styles.cell, styles.w20, styles.bold]}>Catalogue No.</Text>
          </View>

          {/* Trip rows (map) */}
          {tripRows.length === 0 ? (
            <View style={styles.row}>
              <Text style={[styles.cell, styles.w100]}>No trip rows provided</Text>
            </View>
          ) : (
            tripRows.map((r, i) => (
              <View key={r.sNo ?? i} style={styles.row}>
                <Text style={[styles.cell, styles.w10]}>{r.sNo ?? ""}</Text>
                <Text style={[styles.cell, styles.w15]}>{r.type ?? ""}</Text>
                <Text style={[styles.cell, styles.w10]}>{r.poles ?? ""}</Text>
                <Text style={[styles.cell, styles.w10]}>{r.rating ?? ""}</Text>
                <Text style={[styles.cell, styles.w10]}>{r.expectedTripTime ?? ""}</Text>
                <Text style={[styles.cell, styles.w10]}>{r.actualTripTime ?? ""}</Text>
                <Text style={[styles.cell, styles.w15]}>{r.tripTimeInCurve ?? ""}</Text>
                <Text style={[styles.cell, styles.w20]}>{r.catalogueNo ?? ""}</Text>
              </View>
            ))
          )}
        </View>

        {/* Detail block: Currents / Voltages / Time / Opening event */}
        <View style={styles.twoCols}>
          <View style={styles.colLeft}>
            <Text style={styles.sectionHeader}>Measurement Details</Text>
            <View style={styles.table}>
              <View style={styles.row}>
                <Text style={[styles.cell, styles.w25, styles.bold]}>Current (A)</Text>
                <Text style={[styles.cell, styles.w25]}>{header.currentA ?? ""}</Text>
                <Text style={[styles.cell, styles.w25, styles.bold]}>Voltage (V)</Text>
                <Text style={[styles.cell, styles.w25]}>{header.voltage ?? ""}</Text>
              </View>
              <View style={styles.row}>
                <Text style={[styles.cell, styles.w25, styles.bold]}>Time</Text>
                <Text style={[styles.cell, styles.w25]}>{/* placeholder */}</Text>
                <Text style={[styles.cell, styles.w25, styles.bold]}>Opening Event</Text>
                <Text style={[styles.cell, styles.w25]}>{/* placeholder */}</Text>
              </View>
            </View>
          </View>

          <View style={styles.colRight}>
            <Text style={styles.sectionHeader}>Curve & Characteristic</Text>
            <View style={styles.table}>
              <View style={styles.row}>
                <Text style={[styles.cell, styles.w50, styles.bold]}>Multiples of In</Text>
                <Text style={[styles.cell, styles.w50]}>{/* placeholder */}</Text>
              </View>
              <View style={styles.row}>
                <Text style={[styles.cell, styles.w50, styles.bold]}>Tripping Characteristic</Text>
                <Text style={[styles.cell, styles.w50]}>{/* placeholder */}</Text>
              </View>
            </View>
          </View>
        </View>

        {/* Mechanical and visual inspection */}
        <Text style={[styles.sectionHeader, styles.spacer]}>Mechanical and visual inspection:</Text>
        <View style={styles.inspectTable}>
          {/* Table head */}
          <View style={[styles.inspectRow, { backgroundColor: "#e9eef7" }]}>
            <Text style={[styles.inspectCols, styles.bold]}>S No.</Text>
            <Text style={[styles.inspectCols, styles.bold]}>Description</Text>
            <Text style={[styles.inspectCols, styles.bold]}>Status / Remarks</Text>
          </View>

          {/* Render a fixed number of rows (as in the DOCX) or from inspections array */}
          {inspections.length === 0
            ? // render four blank rows if none provided
              [1, 2, 3, 4].map((n) => (
                <View style={styles.inspectRow} key={n}>
                  <Text style={styles.inspectCols}>{n}</Text>
                  <Text style={styles.inspectCols}></Text>
                  <Text style={styles.inspectCols}></Text>
                </View>
              ))
            : inspections.map((it, idx) => (
                <View style={styles.inspectRow} key={idx}>
                  <Text style={styles.inspectCols}>{idx + 1}</Text>
                  <Text style={styles.inspectCols}>{it.description ?? ""}</Text>
                  <Text style={styles.inspectCols}>{(it.status ?? "") + (it.remarks ? " / " + it.remarks : "")}</Text>
                </View>
              ))}
        </View>

        {/* MCB type & dimension (multi-line placeholders) */}
        <Text style={[styles.sectionHeader, styles.spacer]}>MCB type and Dimension:</Text>
        <View style={[styles.table, { padding: 6 }]}>
          <Text style={styles.smallText}>
            {`(Provide Type, Dimension details here — leave fields blank if not available)`}
          </Text>

          {/* leave space / repeatable lines */}
          {Array.from({ length: 5 }).map((_, i) => (
            <View key={i} style={{ borderBottomWidth: 1, borderColor: "#ddd", paddingVertical: 6 }}>
              <Text>{""}</Text>
            </View>
          ))}
        </View>

        {/* Product specification block */}
        <Text style={[styles.sectionHeader, styles.spacer]}>Product specification</Text>
        <View style={styles.table}>
          {/* two-column spec layout */}
          <View style={styles.row}>
            <Text style={[styles.cell, styles.w30, styles.bold]}>Ref.</Text>
            <Text style={[styles.cell, styles.w70]}>{productSpec.ref ?? ""}</Text>
          </View>

          <View style={styles.row}>
            <Text style={[styles.cell, styles.w30, styles.bold]}>Serial no.</Text>
            <Text style={[styles.cell, styles.w70]}>{productSpec.serialNo ?? ""}</Text>
          </View>

          <View style={styles.row}>
            <Text style={[styles.cell, styles.w30, styles.bold]}>Model no.</Text>
            <Text style={[styles.cell, styles.w70]}>{productSpec.modelNo ?? ""}</Text>
          </View>

          {/* Add additional spec rows two-per-line */}
          <View style={styles.row}>
            <Text style={[styles.cell, styles.w30, styles.bold]}>No of poles</Text>
            <Text style={[styles.cell, styles.w20]}>{productSpec.noOfPoles ?? ""}</Text>

            <Text style={[styles.cell, styles.w30, styles.bold]}>Type</Text>
            <Text style={[styles.cell, styles.w20]}>{productSpec.type ?? ""}</Text>
          </View>

          <View style={styles.row}>
            <Text style={[styles.cell, styles.w30, styles.bold]}>Rated current</Text>
            <Text style={[styles.cell, styles.w20]}>{productSpec.ratedCurrent ?? ""}</Text>

            <Text style={[styles.cell, styles.w30, styles.bold]}>Rated voltage</Text>
            <Text style={[styles.cell, styles.w20]}>{productSpec.ratedVoltage ?? ""}</Text>
          </View>

          {/* You can continue to list all fields from the DOCX in similar fashion */}
          <View style={styles.row}>
            <Text style={[styles.cell, styles.w30, styles.bold]}>Rated frequency</Text>
            <Text style={[styles.cell, styles.w20]}>{productSpec.ratedFrequency ?? ""}</Text>

            <Text style={[styles.cell, styles.w30, styles.bold]}>Rated short circuit breaking capacity</Text>
            <Text style={[styles.cell, styles.w20]}>{productSpec.ratedShortCircuitBreakingCapacity ?? ""}</Text>
          </View>

          <View style={styles.row}>
            <Text style={[styles.cell, styles.w30, styles.bold]}>Magnetic release setting</Text>
            <Text style={[styles.cell, styles.w70]}>{productSpec.magneticReleaseSetting ?? ""}</Text>
          </View>

          {/* continue for the remaining fields */}
          <View style={styles.row}>
            <Text style={[styles.cell, styles.w30, styles.bold]}>Rated insulation voltage (Ui)</Text>
            <Text style={[styles.cell, styles.w70]}>{productSpec.ratedInsulationVoltage ?? ""}</Text>
          </View>

          <View style={styles.row}>
            <Text style={[styles.cell, styles.w30, styles.bold]}>Rated impulse voltage (Uimp)</Text>
            <Text style={[styles.cell, styles.w70]}>{productSpec.ratedImpulseVoltage ?? ""}</Text>
          </View>

          <View style={styles.row}>
            <Text style={[styles.cell, styles.w30, styles.bold]}>Electrical/ Mechanical endurance</Text>
            <Text style={[styles.cell, styles.w70]}>{productSpec.electricalMechanicalEndurance ?? ""}</Text>
          </View>

          <View style={styles.row}>
            <Text style={[styles.cell, styles.w30, styles.bold]}>Ambient working temperature</Text>
            <Text style={[styles.cell, styles.w70]}>{productSpec.ambientWorkingTemperature ?? ""}</Text>
          </View>

          <View style={styles.row}>
            <Text style={[styles.cell, styles.w30, styles.bold]}>Terminal capacity (max)</Text>
            <Text style={[styles.cell, styles.w70]}>{productSpec.terminalCapacity ?? ""}</Text>
          </View>

          <View style={styles.row}>
            <Text style={[styles.cell, styles.w30, styles.bold]}>Vibration</Text>
            <Text style={[styles.cell, styles.w70]}>{productSpec.vibration ?? ""}</Text>
          </View>

          <View style={styles.row}>
            <Text style={[styles.cell, styles.w30, styles.bold]}>Shock resistance</Text>
            <Text style={[styles.cell, styles.w70]}>{productSpec.shockResistance ?? ""}</Text>
          </View>

          <View style={styles.row}>
            <Text style={[styles.cell, styles.w30, styles.bold]}>Protection class</Text>
            <Text style={[styles.cell, styles.w70]}>{productSpec.protectionClass ?? ""}</Text>
          </View>

          <View style={styles.row}>
            <Text style={[styles.cell, styles.w30, styles.bold]}>Installation position</Text>
            <Text style={[styles.cell, styles.w70]}>{productSpec.installationPosition ?? ""}</Text>
          </View>

          <View style={styles.row}>
            <Text style={[styles.cell, styles.w30, styles.bold]}>Mounting</Text>
            <Text style={[styles.cell, styles.w70]}>{productSpec.mounting ?? ""}</Text>
          </View>

          <View style={styles.row}>
            <Text style={[styles.cell, styles.w30, styles.bold]}>Case and cover</Text>
            <Text style={[styles.cell, styles.w70]}>{productSpec.caseAndCover ?? ""}</Text>
          </View>

          <View style={styles.row}>
            <Text style={[styles.cell, styles.w30, styles.bold]}>Auxiliary contacts</Text>
            <Text style={[styles.cell, styles.w70]}>{productSpec.auxiliaryContacts ?? ""}</Text>
          </View>

          <View style={styles.row}>
            <Text style={[styles.cell, styles.w30, styles.bold]}>Shunt trip</Text>
            <Text style={[styles.cell, styles.w70]}>{productSpec.shuntTrip ?? ""}</Text>
          </View>
        </View>

        {/* Tested by / Reviewed / Result */}
        <View style={styles.footer}>
          <View style={{ width: "48%" }}>
            <Text style={styles.smallText}>Tested by</Text>
            <Text style={styles.bold}>{testedBy.name ?? ""}</Text>
            <Text style={styles.smallText}>Date: {testedBy.date ?? ""}</Text>
          </View>

          <View style={{ width: "48%", textAlign: "right" }}>
            <Text style={styles.smallText}>Reviewed</Text>
            <Text style={styles.bold}>{testedBy.reviewedBy ?? ""}</Text>
            <Text style={styles.smallText}>Result: {testedBy.result ?? ""}</Text>
          </View>
        </View>
      </Page>
    </Document>
  );
}

/**
 * Download button wrapper (example)
 * Pass a data object shaped like the types above.
 */
export default function DownloadTripTestReport({ data }: { data: any }) {
  // recommend memoizing to avoid re-rendering/regen
  const doc = useMemo(
    () =>
      <TripTestReportDocument
        header={data.header}
        tripRows={data.tripRows}
        inspections={data.inspections}
        productSpec={data.productSpec}
        testedBy={data.testedBy}
      />,
    [data]
  );

  const filename = `mcb_trip_test_report_${new Date().toISOString().slice(0,10)}.pdf`;

  return (
    <PDFDownloadLink document={doc} fileName={filename}>
  {({ loading }) => (
    <button
      disabled={loading}
      className={`
        px-5 py-2.5 rounded-lg font-medium text-sm
        flex items-center gap-2 transition-all duration-300
        border border-white/10 shadow-md
        ${loading 
          ? "bg-gray-300 text-gray-600 cursor-wait" 
          : "bg-gradient-to-r from-primary to-primary/80 text-white hover:scale-105 hover:shadow-lg"
        }
      `}
      style={{
        boxShadow: loading
          ? "0 0 10px rgba(0,0,0,0.1)"
          : "0 4px 16px rgba(59,130,246,0.35)" // matches your dashboard glow
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
