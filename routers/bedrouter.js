import express from 'express';
import { getBedSummary } from '../controllers/bedDashboardController.js';

const router = express.Router();

router.get('/summary', getBedSummary);

export default router;