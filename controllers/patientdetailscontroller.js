import Patient from '../models/patientdetails.js';
import Bed from '../models/bedmodel.js';
import Counter from '../models/countermodule.js';

// export const createPatient = async (req, res) => {
//   try {
//     const { ward } = req.body;

//     // 🔍 Step 1: Check for available bed in the ward
//     const freeBed = await Bed.findOne({ ward, isOccupied: false });

    
//     if (!freeBed) {
//       return res.status(400).json({ error: `No available beds in ${ward}` });
//     }

//     // 🆕 Step 2: Generate admission number in format WARDYYYYXXXX
//     const upperWard = ward.toUpperCase();
//     const currentYear = new Date().getFullYear();
//     const counterKey = `${upperWard}${currentYear}`;

//     const counter = await Counter.findOneAndUpdate(
//       { key: counterKey },
//       { $inc: { count: 1 } },
//       { new: true, upsert: true }
//     );

//     const paddedNumber = counter.count.toString().padStart(4, '0');
//     const admissionNumber = `${upperWard}${currentYear}${paddedNumber}`;

//     // ✅ Step 3: Create patient with admissionNumber and bed reference
//     const patient = new Patient({
//       ...req.body,
//       admissionNumber,
//       status: 'admitted',
//       bed: freeBed._id // ✅ Link the bed to the patient
//     });

//     const savedPatient = await patient.save();

//     // 🛏️ Step 4: Update the bed to mark it occupied and assign patient ID
//     freeBed.isOccupied = true;
//     freeBed.status = 'occupied'; 
//     freeBed.assignedTo = savedPatient._id;
//     await freeBed.save();

//     // ✅ Step 5: Return response
//     res.status(201).json({
//       patient: savedPatient,
//       bedAssigned: freeBed.bedNumber,
//       admissionNumber: savedPatient.admissionNumber
//     });

//   } catch (err) {
//     res.status(400).json({ error: err.message });
//   }
// };



// export const createPatient = async (req, res) => {
//   try {
//     const { ward } = req.body;

//     if (!ward) return res.status(400).json({ error: 'Ward is required' });

//     // 1️⃣ Find a truly free bed and mark it as occupied atomically
//     const freeBed = await Bed.findOneAndUpdate(
//       { ward, isOccupied: false, status: 'available' },
//       { isOccupied: true, status: 'occupied' },
//       { new: true }
//     );

//     if (!freeBed) {
//       return res.status(400).json({ error: `No available beds in ${ward}` });
//     }

//     // 2️⃣ Generate admission number
//     const upperWard = ward.toUpperCase();
//     const currentYear = new Date().getFullYear();
//     const counterKey = `${upperWard}${currentYear}`;

//     const counter = await Counter.findOneAndUpdate(
//       { key: counterKey },
//       { $inc: { count: 1 } },
//       { new: true, upsert: true }
//     );

//     const paddedNumber = counter.count.toString().padStart(4, '0');
//     const admissionNumber = `${upperWard}${currentYear}${paddedNumber}`;

//     // 3️⃣ Create the patient
//     const patient = new Patient({
//       ...req.body,
//       admissionNumber,
//       status: 'admitted',
//       bed: freeBed._id
//     });

//     const savedPatient = await patient.save();

//     // 4️⃣ Link bed to patient
//     freeBed.assignedTo = savedPatient._id;
//     await freeBed.save();

//     res.status(201).json({
//       patient: savedPatient,
//       bedAssigned: freeBed.bedNumber,
//       admissionNumber: savedPatient.admissionNumber
//     });
//   } catch (error) {
//     console.error('Error creating patient:', error);
//     res.status(500).json({ error: error.message });
//   }
// };

export const createPatient = async (req, res) => {
  try {
    const { ward, bedId } = req.body;

    if (!ward) return res.status(400).json({ error: "Ward is required" });

    let assignedBed;

    if (bedId) {
      // ✅ Case 1: Specific bed assignment
      assignedBed = await Bed.findOneAndUpdate(
        { _id: bedId, ward, isOccupied: false, status: "available" },
        { isOccupied: true, status: "occupied" },
        { new: true }
      );

      if (!assignedBed) {
        return res
          .status(400)
          .json({ error: "Selected bed is not available anymore" });
      }
    } else {
      // ✅ Case 2: Random allocation
      assignedBed = await Bed.findOneAndUpdate(
        { ward, isOccupied: false, status: "available" },
        { isOccupied: true, status: "occupied" },
        { new: true }
      );

      if (!assignedBed) {
        return res.status(400).json({ error: `No available beds in ${ward}` });
      }
    }

    // 🔹 Generate admission number
    const upperWard = ward.toUpperCase();
    const currentYear = new Date().getFullYear();
    const counterKey = `${upperWard}${currentYear}`;

    const counter = await Counter.findOneAndUpdate(
      { key: counterKey },
      { $inc: { count: 1 } },
      { new: true, upsert: true }
    );

    const paddedNumber = counter.count.toString().padStart(4, "0");
    const admissionNumber = `${upperWard}${currentYear}${paddedNumber}`;

    // 🔹 Create the patient
    const patient = new Patient({
      ...req.body,
      admissionNumber,
      status: "admitted",
      bed: assignedBed._id,
    });

    const savedPatient = await patient.save();

    // 🔹 Link bed to patient
    assignedBed.assignedTo = savedPatient._id;
    await assignedBed.save();

    res.status(201).json({
      patient: savedPatient,
      bedAssigned: assignedBed.bedNumber,
      admissionNumber: savedPatient.admissionNumber,
    });
  } catch (error) {
    console.error("Error creating patient:", error);
    res.status(500).json({ error: error.message });
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
    const { id } = req.params;  // ✅ Destructure id from params
    const patient = await Patient.findById(id).populate("bed"); // ✅ populate bed details

    if (!patient) {
      return res.status(404).json({ error: "Patient not found" });
    }

    res.status(200).json(patient);
  } catch (error) {
    res.status(500).json({ error: error.message });
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
    const { ward, admissionDate, age, dob, admissionNumber, status } = req.query;
    const filters = {};

    if (ward) filters.ward = ward;
    if (admissionDate) filters.admissionDate = new Date(admissionDate);
    if (admissionNumber) filters.admissionNumber = admissionNumber.toUpperCase();
    if (status) filters.status = status.toLowerCase(); // e.g., 'admitted'
    if (age) filters.age = Number(age);

    // ✅ Fix: Match DOB by full day, not exact time
    if (dob) {
      const start = new Date(dob);
      const end = new Date(dob);
      end.setDate(end.getDate() + 1);
      filters.dob = { $gte: start, $lt: end };
    }

    console.log("Search Filters:", filters); // helpful for debugging

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

    // Mark patient as discharged
    patient.status = 'discharged';
    patient.dischargedAt = new Date(); // optional timestamp
    await patient.save();

    // Free up the assigned bed
    if (patient.bed) {
      const bed = await Bed.findById(patient.bed);
      if (bed) {
        bed.isOccupied = false;
        bed.status = 'available';
        bed.assignedTo = null;
        await bed.save();
      }
    }

    res.status(200).json({
      message: 'Patient discharged successfully and bed freed',
      patient
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
