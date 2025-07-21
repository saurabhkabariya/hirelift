import mongoose from 'mongoose';

const hrContactSchema = new mongoose.Schema({
  name: { type: String, required: true },
  position: { type: String, required: true },
  email: { type: String, required: true },
  linkedIn: { type: String },
}, { _id: false });

const companySchema = new mongoose.Schema({
  companyName: { type: String, required: true },
  industry: { type: String, required: true },
  location: { type: String, required: true },
  hiringRoles: [{ type: String }],
  jobMode: { type: String, required: true },
  experience: { type: String, required: true },
  status: { type: String, enum: ['pending', 'approved', 'rejected'], default: 'pending' },
  lastUpdated: { type: Date, default: Date.now },
  hrContacts: [hrContactSchema],
}, {
  timestamps: true
});

export default mongoose.models.Company || mongoose.model('Company', companySchema); 