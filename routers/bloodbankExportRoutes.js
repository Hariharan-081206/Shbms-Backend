import express from "express";
import { exportBloodExcel, exportBloodPDF } from "../controllers/bloodbankExportController.js";

const router = express.Router();

// Matches frontend: /api/bloodbankexport/export/pdf
router.get("/export/pdf", exportBloodPDF);
router.get("/export/excel", exportBloodExcel);

export default router;
