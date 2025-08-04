import mongoose from 'mongoose';

const userSchema = new mongoose.Schema({
  googleId: { type: String },
  name: { type: String },
  email: { type: String, required: true, unique: true },
  role: { type: String, enum: ['receptionist', 'admin'], required: true }
}, { timestamps: true });

const User = mongoose.model('User', userSchema);
export default User;
    