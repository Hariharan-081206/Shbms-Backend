import Patient from '../models/patientdetails.js';
import Bed from '../models/bedmodel.js';
import Counter from '../models/countermodule.js';

export const createPatient = async (req, res) => {
  try {
    const { ward } = req.body;

    // 🔍 Step 1: Check for available bed in the ward
    const freeBed = await Bed.findOne({ ward, isOccupied: false });

    if (!freeBed) {
      return res.status(400).json({ error: `No available beds in ${ward}` });
    }

    // 🆕 Step 2: Generate admission number in format WARDYYYYXXXX
    const upperWard = ward.toUpperCase();
    const currentYear = new Date().getFullYear();
    const counterKey = `${upperWard}${currentYear}`;

    const counter = await Counter.findOneAndUpdate(
      { key: counterKey },
      { $inc: { count: 1 } },
      { new: true, upsert: true }
    );

    const paddedNumber = counter.count.toString().padStart(4, '0');
    const admissionNumber = `${upperWard}${currentYear}${paddedNumber}`;

    // ✅ Step 3: Create patient with admissionNumber and bed reference
    const patient = new Patient({
      ...req.body,
      admissionNumber,
      status: 'admitted',
      bed: freeBed._id // ✅ Link the bed to the patient
    });

    const savedPatient = await patient.save();

    // 🛏️ Step 4: Update the bed to mark it occupied and assign patient ID
    freeBed.isOccupied = true;
    freeBed.assignedTo = savedPatient._id;
    await freeBed.save();

    // ✅ Step 5: Return response
    res.status(201).json({
      patient: savedPatient,
      bedAssigned: freeBed.bedNumber,
      admissionNumber: savedPatient.admissionNumber
    });

  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};


export const getAllPatients = async (req, res) => {
  try {
    const patients = await Patient.find().populate('bed');
    res.json(patients);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

export const getPatientById = async (req, res) => {
  try {
    const patient = await Patient.findById(req.params.id);
    if (!patient) return res.status(404).json({ error: 'Patient not found' });
    res.json(patient);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

export const updatePatient = async (req, res) => {
  try {
    const updated = await Patient.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!updated) return res.status(404).json({ error: 'Patient not found' });
    res.json(updated);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

export const deletePatient = async (req, res) => {
  try {
    const patient = await Patient.findById(req.params.id);
    if (!patient) return res.status(404).json({ error: 'Patient not found' });

    await Bed.findOneAndUpdate(
      { assignedTo: patient._id },
      { isOccupied: false, assignedTo: null }
    );

    await patient.remove();
    res.json({ message: 'Patient deleted and bed freed' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

export const searchPatients = async (req, res) => {
  try {
    const { ward, admissionDate, age, dob, admissionNumber, status} = req.query;
    const filters = {};

    if (ward) filters.ward = ward;
    if (admissionDate) filters.admissionDate = new Date(admissionDate);
    if (admissionNumber) filters.admissionNumber = admissionNumber.toUpperCase();
    if (status) filters.status = status.toLowerCase(); // 'admitted' or 'discharged'
    if (age) filters.age = Number(age);
    if (dob) filters.dob = new Date(dob);

    const patients = await Patient.find(filters);
    res.json(patients);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

export const dischargePatient = async (req, res) => {
  try {
    const { id } = req.params;

    const patient = await Patient.findById(id);
    if (!patient) {
      return res.status(404).json({ message: 'Patient not found' });
    }

    if (patient.status === 'discharged') {
      return res.status(400).json({ message: 'Patient is already discharged' });
    }

    patient.status = 'discharged';
    await patient.save();

    res.status(200).json({
      message: 'Patient discharged successfully',
      patient
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

