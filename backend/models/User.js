const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const userSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  profileImage: { type: String, default: '' },
  role: { 
    type: String, 
    enum: ['Super Admin', 'Payroll Admin', 'HR Admin', 'Employee', 'Finance'],
    required: true 
  },
  organizationId: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'Organization'
  },
  onboardingCompleted: { 
    type: Boolean, 
    default: false 
  }
}, { timestamps: true });

// ✅ FIXED: Changed from callback to async function
userSchema.pre('save', async function() {
  if (!this.isModified('password')  || !this.password) return;
  this.password = await bcrypt.hash(this.password, 10);
});

userSchema.methods.comparePassword = async function(candidatePassword) {
  if (!this.password) return false;
  return await bcrypt.compare(candidatePassword, this.password);
};

module.exports = mongoose.model('User', userSchema);