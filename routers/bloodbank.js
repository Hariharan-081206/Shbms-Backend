import express from 'express';
import {
  getAllBloodUnits,
  addBloodUnit,
  updateBloodUnit,
  deleteBloodUnit,
} from '../controllers/bloodbankcontroller.js';

const router = express.Router();

router.get('/', getAllBloodUnits);
router.post('/', addBloodUnit);
router.put('/:id', updateBloodUnit);
router.delete('/:id', deleteBloodUnit);

export default router;
