import mongoose from 'mongoose';

const validWards = [
  'General', 'ICU', 'Emergency', 'Pediatric', 'Maternity',
  'Surgical', 'Cardiac', 'Neurology', 'Orthopedics',
  'Pulmonology', 'Oncology', 'Burn/Plastic Surgery', 'Nephrology'
];

const bedSchema = new mongoose.Schema({
  ward: { type: String, required: true, enum: validWards },
  bedNumber: { type: String, required: true },
  isOccupied: { type: Boolean, default: false },
  oxygenSupport: { type: Boolean, default: false },
  monitoringEquipment: { type: Boolean, default: false },
  status: { type: String, enum: ['available', 'occupied', 'maintenance'], default: 'available' },
  assignedTo: { type: mongoose.Schema.Types.ObjectId, ref: 'Patient', default: null },
  
}, { timestamps: true });

bedSchema.index({ ward: 1, bedNumber: 1 }, { unique: true });

export default mongoose.model('Bed', bedSchema);
