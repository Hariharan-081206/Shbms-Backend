import express from "express";
import { exportAnalyticsExcel, exportAnalyticsPDF } from "../controllers/analyticsExportController.js";

const router = express.Router();

// Matches frontend: /api/analyticsexport/export/pdf?dateRange=...&includeCharts=...
router.get("/export/pdf", exportAnalyticsPDF);
router.get("/export/excel", exportAnalyticsExcel);

export default router;
