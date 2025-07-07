import mongoose from 'mongoose';

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
  guardian: { type: String },
  contactNumber: { type: String, required: true },
  address: { type: String },
  ward: { type: String, required: true },
  admissionDate: { type: Date, required: true },
  status: {
    type: String,
    enum: ['admitted', 'discharged'],
    default: 'admitted',
    required: true
  },

  reasonForAdmitting: { type: String },
  consultingDoctor: { type: String }
}, { timestamps: true });

const Patient = mongoose.model('Patient', patientSchema);

export default Patient;
