import mongoose from "mongoose";

const bloodBankSchema = new mongoose.Schema({
  bloodType: {
    type: String,
    required: true,
    enum: ['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'],
  },
  units: {
    type: Number,
    required: true,
    min: 0,
  },
  lastUpdated: {
    type: Date,
    default: Date.now,
  },
  location: {
    type: String,
    default: 'Main Blood Bank',
  },
});

const BloodBank = mongoose.model('BloodBank', bloodBankSchema);
export default BloodBank;



