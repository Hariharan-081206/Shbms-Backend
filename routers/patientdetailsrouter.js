import express from 'express';
import {
  createPatient,
  dischargePatient,
  getAllPatients,
  getPatientById,
  searchPatients,
  updatePatient,
  deletePatient
} from '../controllers/patientdetailscontroller.js';

// const router = express.Router();
// router.post('/', createPatient);
// router.get('/', getAllPatients);
// router.get('/:id', getPatientById);
// router.get('/search', searchPatients);
// router.put('/:id', updatePatient);
// router.put('/discharge/:id', dischargePatient);
// router.delete('/:id', deletePatient);

const router = express.Router();

router.post('/', createPatient);
router.get('/search', searchPatients); // move this ABOVE `/:id`
router.get('/', getAllPatients);
router.get('/:id', getPatientById);
router.put('/:id', updatePatient);
router.put('/discharge/:id', dischargePatient);
router.delete('/:id', deletePatient);

export default router;
