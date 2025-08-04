import mongoose from 'mongoose';
const validWards = [
  'General', 'ICU', 'Emergency', 'Pediatric', 'Maternity',
  'Surgical', 'Cardiac', 'Neurology', 'Orthopedics',
  'Pulmonology', 'Oncology', 'Burn/Plastic Surgery', 'Nephrology'
];
const patientSchema = new mongoose.Schema({
  admissionNumber: {
      type: String,
      required: true,
      unique: true
  },
  name: { type: String, required: true },
  age: { type: Number, required: true },
  dob: { type: Date, required: true },
  bloodGroup: { type: String, required: true },
  gender: { type: String, enum: ['Male', 'Female', 'Other'], required: true },
  primarymedicalcondititon: { type: String },
  department:{ type: String, required: true, enum: validWards },
  admissiontype: { type: String, enum: ['Planned', 'Transfer', 'Emergency','Outpatient'], required: true },
  emergencyContact: { type: String, required: true },
  address: { type: String },
  admissionDate: { type: Date, required: true },
  status: {
    type: String,
    enum: ['admitted', 'discharged'],
    default: 'admitted',
    required: true
  },

  reasonForAdmitting: { type: String },
  doctor: { type: String },
  bed: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Bed',
    default: null
  }
}, { timestamps: true });

const Patient = mongoose.model('Patient', patientSchema);

export default Patient;
