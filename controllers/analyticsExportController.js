import ExcelJS from "exceljs";
import PDFDocument from "pdfkit";

/**
 * Export Analytics as Excel
 */
export const exportAnalyticsExcel = async (req, res) => {
  try {
    const { dateRange, includeCharts, includeStats } = req.query;

    // Mock analytics data
    const analytics = {
      bedsAvailable: 20,
      bedsOccupied: 30,
      bloodUnits: 120,
      criticalStock: 5,
      reportRange: dateRange || "last_30_days",
    };

    const workbook = new ExcelJS.Workbook();
    const sheet = workbook.addWorksheet("Analytics Report");

    sheet.addRow(["Analytics Report"]);
    sheet.addRow([`Date Range: ${analytics.reportRange}`]);
    sheet.addRow([]);
    sheet.addRow(["Metric", "Value"]);
    sheet.addRow(["Available Beds", analytics.bedsAvailable]);
    sheet.addRow(["Occupied Beds", analytics.bedsOccupied]);
    sheet.addRow(["Blood Units", analytics.bloodUnits]);
    sheet.addRow(["Critical Stock Items", analytics.criticalStock]);

    if (includeStats === "true") {
      sheet.addRow([]);
      sheet.addRow(["Statistical Summary", "Example values..."]);
    }

    res.setHeader("Content-Type", "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet");
    res.setHeader("Content-Disposition", "attachment; filename=analytics-report.xlsx");

    await workbook.xlsx.write(res);
    res.end();
  } catch (err) {
    console.error("Excel export error:", err);
    res.status(500).send("Error generating Analytics Excel");
  }
};

/**
 * Export Analytics as PDF
 */
export const exportAnalyticsPDF = async (req, res) => {
  try {
    const { dateRange, includeCharts, includeStats } = req.query;

    const analytics = {
      bedsAvailable: 20,
      bedsOccupied: 30,
      bloodUnits: 120,
      criticalStock: 5,
      reportRange: dateRange || "last_30_days",
    };

    const doc = new PDFDocument();
    res.setHeader("Content-Type", "application/pdf");
    res.setHeader("Content-Disposition", "attachment; filename=analytics-report.pdf");
    doc.pipe(res);

    doc.fontSize(18).text("Analytics Report", { align: "center" }).moveDown();
    doc.fontSize(12).text(`Date Range: ${analytics.reportRange}`).moveDown();

    doc.text(`Available Beds: ${analytics.bedsAvailable}`);
    doc.text(`Occupied Beds: ${analytics.bedsOccupied}`);
    doc.text(`Blood Units: ${analytics.bloodUnits}`);
    doc.text(`Critical Stock: ${analytics.criticalStock}`);

    if (includeStats === "true") {
      doc.moveDown().fontSize(14).text("Statistical Summary");
      doc.fontSize(12).text("Example stats go here...");
    }

    if (includeCharts === "true") {
      doc.moveDown().text("[Charts would be inserted here]");
    }

    doc.end();
  } catch (err) {
    console.error("PDF export error:", err);
    res.status(500).send("Error generating Analytics PDF");
  }
};
