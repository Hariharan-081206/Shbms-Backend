import express from 'express';
import { getBedSummary,createBed } from '../controllers/bedDashboardController.js';

const router = express.Router();
router.get('/summary', getBedSummary);
router.post('/',createBed);
export default router;