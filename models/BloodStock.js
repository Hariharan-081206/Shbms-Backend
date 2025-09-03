import mongoose from "mongoose";

const BloodStockSchema = new mongoose.Schema({
  bloodType: { type: String, required: true },        // "O+", "A-", etc
  units: { type: Number, default: 0 },
  status: { type: String, default: "normal" },        // normal | low | critical | expired
  lastUpdated: { type: Date, default: () => Date.now() }
});

const BloodStock = mongoose.models.BloodStock || mongoose.model("BloodStock", BloodStockSchema);

export default BloodStock;
