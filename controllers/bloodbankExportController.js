import ExcelJS from "exceljs";
import PDFDocument from "pdfkit";
import BloodStock from "../models/BloodStock.js";
import BloodBank from "../models/bloodbank.js";


// Excel Export
export const exportBloodExcel = async (req, res) => {
  try {
    const rows = await BloodBank.find().lean();
    console.log("Rows fetched for Excel:", rows); // check data

    const workbook = new ExcelJS.Workbook();
    const sheet = workbook.addWorksheet("Blood Stock");

    sheet.columns = [
      { header: "Blood Type", key: "bloodType", width: 12 },
      { header: "Units", key: "units", width: 10 },
      { header: "Last Updated", key: "lastUpdated", width: 20 },
      { header: "Location", key: "location", width: 20 }
    ];

    rows.forEach(item => {
      sheet.addRow({
        bloodType: item.bloodType,
        units: item.units,
        lastUpdated: item.lastUpdated ? new Date(item.lastUpdated).toLocaleString() : "",
        location: item.location
      });
    });

    res.setHeader(
      "Content-Type",
      "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
    );
    res.setHeader("Content-Disposition", 'attachment; filename="blood_stock.xlsx"');

    await workbook.xlsx.write(res);
    res.end();
  } catch (err) {
    console.error("Excel export error:", err);
    res.status(500).json({ error: "Failed to export Excel" });
  }
};

// PDF Export


// export const exportBloodPDF = async (req, res) => {
//   try {
//     const stocks = await BloodBank.find().lean();
//     console.log("Rows fetched for PDF:", stocks); // check data

//     const doc = new PDFDocument();
//     res.setHeader("Content-Type", "application/pdf");
//     res.setHeader("Content-Disposition", "attachment; filename=blood-report.pdf");
//     doc.pipe(res);

//     // Title
//     doc.fontSize(18).text("Blood Bank Stock Report", { align: "center" });
//     doc.moveDown();

//     // Table header
//     doc.fontSize(12).text("Blood Type   Units   Last Updated   Location");
//     doc.moveDown();

//     // Table rows
//     stocks.forEach(stock => {
//       doc.text(
//         `${stock.bloodType}   ${stock.units}   ${new Date(stock.lastUpdated).toLocaleString()}   ${stock.location}`
//       );
//     });

//     doc.end();
//   } catch (err) {
//     console.error("Error generating PDF:", err);
//     res.status(500).send("Error generating PDF");
//   }
// };

export const exportBloodPDF = async (req, res) => {
  try {
    const stocks = await BloodBank.find().lean();

    const doc = new PDFDocument({ margin: 30, size: 'A4' });
    res.setHeader("Content-Type", "application/pdf");
    res.setHeader("Content-Disposition", "attachment; filename=blood-report.pdf");
    doc.pipe(res);

    // Title
    doc.fontSize(18).text("Blood Bank Stock Report", { align: "center" });
    doc.moveDown(1.5);

    // Table headers
    const tableTop = 100;
    const itemX = {
      bloodType: 50,
      units: 150,
      lastUpdated: 220,
      location: 350
    };

    doc.fontSize(12).text("Blood Type", itemX.bloodType, tableTop, { bold: true });
    doc.text("Units", itemX.units, tableTop);
    doc.text("Last Updated", itemX.lastUpdated, tableTop);
    doc.text("Location", itemX.location, tableTop);

    let rowY = tableTop + 25;

    // Table rows
    stocks.forEach(stock => {
      doc.text(stock.bloodType, itemX.bloodType, rowY);
      doc.text(stock.units.toString(), itemX.units, rowY);
      doc.text(new Date(stock.lastUpdated).toLocaleString(), itemX.lastUpdated, rowY);
      doc.text(stock.location, itemX.location, rowY);

      rowY += 25; // row height
    });

    doc.end();
  } catch (err) {
    console.error("Error generating PDF:", err);
    res.status(500).send("Error generating PDF");
  }
};