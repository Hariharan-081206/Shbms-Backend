import express from 'express';
import { createBed,
        getAllBeds, 
        getBedByNumber, 
        updateBedStatus, 
        getBedById, 
        getWardSummary } 
        from '../controllers/bedDashboardController.js';

const router = express.Router();
router.post('/',createBed);
router.get('/', getAllBeds);
router.get("/ward-summary", getWardSummary);  
router.get("/id/:id", getBedById);
router.get("/:bedNumber", getBedByNumber);
router.put('/:bedNumber/status', updateBedStatus);


export default router;