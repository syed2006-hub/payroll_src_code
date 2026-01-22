const mongoose = require('mongoose');

const orgSchema = new mongoose.Schema({
  companyName: { type: String, required: true },
  industry: { type: String, required: true },
  financialYear: { 
    startMonth: { type: String, required: true },
    endMonth: { type: String, required: true }
  },
  statutoryConfig: {
    pf: {
      enabled: { type: Boolean, default: false },
      employeeContribution: { type: Number, default: 12 },
      employerContribution: { type: Number, default: 12 }
    },
    esi: {
      enabled: { type: Boolean, default: false },
      employeeContribution: { type: Number, default: 0.75 },
      employerContribution: { type: Number, default: 3.25 },
      wageLimit: { type: Number, default: 21000 }
    },
    professionalTax: {
      enabled: { type: Boolean, default: false },
      state: { type: String }
    }
  },
  accessLevels: {
    payrollAdmin: {
      canProcessPayroll: { type: Boolean, default: true },
      canApprovePayroll: { type: Boolean, default: true }
    },
    hrAdmin: {
      canManageEmployees: { type: Boolean, default: true },
      canManageSalaryStructure: { type: Boolean, default: true }
    },
    finance: {
      canViewReports: { type: Boolean, default: true },
      canExportData: { type: Boolean, default: true }
    }
  },
  setupCompleted: { type: Boolean, default: false },
  createdBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' }
}, { timestamps: true });

module.exports = mongoose.model('Organization', orgSchema);