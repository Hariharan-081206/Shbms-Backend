import express from 'express';
import {
  getAllBloodUnits,
  addBloodUnit,
  useBloodUnit,
  updateBloodUnit,
  deleteBloodUnit,
  getBloodBankSummary
} from '../controllers/bloodbankcontroller.js';

const router = express.Router();

router.get('/', getAllBloodUnits);
router.post('/add', addBloodUnit);

router.post('/use', useBloodUnit);
router.get("/summary", getBloodBankSummary);
router.put('/:id', updateBloodUnit);
router.delete('/:id', deleteBloodUnit);

export default router;
