import ExcelJS from "exceljs";
import PDFDocument from "pdfkit";

/**
 * Export Beds as Excel
 */
export const exportBedsExcel = async (req, res) => {
  try {
    // Replace this with DB fetch
    const beds = [
      { id: "1", ward: "Ward A", bedNumber: "101", floor: "1", type: "ICU", status: "available" },
      { id: "2", ward: "Ward A", bedNumber: "102", floor: "1", type: "ICU", status: "occupied" },
    ];

    const workbook = new ExcelJS.Workbook();
    const sheet = workbook.addWorksheet("Beds Report");

    sheet.columns = [
      { header: "ID", key: "id", width: 10 },
      { header: "Ward", key: "ward", width: 20 },
      { header: "Bed Number", key: "bedNumber", width: 15 },
      { header: "Floor", key: "floor", width: 10 },
      { header: "Type", key: "type", width: 15 },
      { header: "Status", key: "status", width: 15 },
    ];

    beds.forEach((bed) => sheet.addRow(bed));

    res.setHeader("Content-Type", "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet");
    res.setHeader("Content-Disposition", "attachment; filename=beds-report.xlsx");

    await workbook.xlsx.write(res);
    res.end();
  } catch (err) {
    console.error("Excel export error:", err);
    res.status(500).send("Error generating Excel");
  }
};

/**
 * Export Beds as PDF
 */
export const exportBedsPDF = async (req, res) => {
  try {
    const beds = [
      { id: "1", ward: "Ward A", bedNumber: "101", floor: "1", type: "ICU", status: "available" },
      { id: "2", ward: "Ward A", bedNumber: "102", floor: "1", type: "ICU", status: "occupied" },
    ];

    const doc = new PDFDocument();
    res.setHeader("Content-Type", "application/pdf");
    res.setHeader("Content-Disposition", "attachment; filename=beds-report.pdf");
    doc.pipe(res);

    doc.fontSize(18).text("Beds Report", { align: "center" }).moveDown();

    beds.forEach((bed) => {
      doc.fontSize(12).text(
        `Bed ${bed.bedNumber} - ${bed.type} (${bed.status}) | Ward: ${bed.ward}, Floor: ${bed.floor}`
      );
    });

    doc.end();
  } catch (err) {
    console.error("PDF export error:", err);
    res.status(500).send("Error generating PDF");
  }
};
