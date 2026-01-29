import mongoose from 'mongoose';

const orgSchema = new mongoose.Schema(
  {
    companyName: { type: String, required: true },
    industry: { type: String, required: true },

    financialYear: {
      startMonth: { type: String, required: true },
      endMonth: { type: String, required: true },
    },
    roles: { 
    type: [String], 
    default: ["Employee", "Hr Admin"] // Default values
    },
    departments: { 
      type: [String], 
      default: ["Engineering", "HR"] // Default values
    },

    location: { 
      type: [String], 
      default: ["Head Office-Chennai", "Head Office-Madurai"] // Default values
    },
    roleBasedAccess: {
        type: Map,
        of: String, // Stores { "HR": "USER_MGMT", "Manager": "VIEW_EXPORT" }
        default: {}
    },
    statutoryConfig: {
      pf: {
        enabled: { type: Boolean, default: false },
        employeeContribution: { type: Number, default: 12 },
        employerContribution: { type: Number, default: 12 },
      },
      esi: {
        enabled: { type: Boolean, default: false },
        employeeContribution: { type: Number, default: 0.75 },
        employerContribution: { type: Number, default: 3.25 },
        wageLimit: { type: Number, default: 21000 },
      },
      hra: {
        enabled: { type: Boolean, default: false },
        percentageOfBasic: { type: Number, default: 40 }, 
        taxExempt: { type: Boolean, default: false },
      },
      professionalTax: {
        enabled: { type: Boolean, default: false },
        state: { type: String },
      },
    },

    accessLevels: {
      payrollAdmin: {
        canProcessPayroll: { type: Boolean, default: true },
        canApprovePayroll: { type: Boolean, default: true },
      },
      hrAdmin: {
        canManageEmployees: { type: Boolean, default: true },
        canManageSalaryStructure: { type: Boolean, default: true },
      },
      finance: {
        canViewReports: { type: Boolean, default: true },
        canExportData: { type: Boolean, default: true },
      },
    },
    
    setupCompleted: { type: Boolean, default: false },
    createdBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  },
  { timestamps: true }
);

export default mongoose.model('Organization', orgSchema);
