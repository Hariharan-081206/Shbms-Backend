import express from "express";
import { exportBedsExcel, exportBedsPDF } from "../controllers/bedExportController.js";

const router = express.Router();

// Matches frontend: /api/bedsexport/export/pdf
router.get("/export/pdf", exportBedsPDF);
router.get("/export/excel", exportBedsExcel);

export default router;
