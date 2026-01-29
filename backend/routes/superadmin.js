import express from "express";
import mongoose from "mongoose";
import { authenticate, authorize } from "../middleware/auth.js";
import User from "../models/Usermodel.js";
import Organization from "../models/Organization.js";

const router = express.Router();

const superadmin = "Super Admin";
const hradmin = "HR Admin";
const payrolladmin = "Payroll Admin";
const finance = "Finance";

// ---------------- HELPER FUNCTIONS ----------------
const num = (v) => (isNaN(Number(v)) ? 0 : Number(v));

// Tamil Nadu Professional Tax Slab (Monthly)
const getProfessionalTax = (monthlySalary) => {
  if (monthlySalary <= 21000) return 0;
  if (monthlySalary <= 30000) return 135;
  return 200;
};

// ---------------- DASHBOARD SUMMARY ----------------
router.get(
  "/dashboardsummary",
  authenticate,
  authorize(superadmin, hradmin, payrolladmin, finance),
  async (req, res) => {
    try {
      if (!req.user?.organizationId) {
        return res.status(401).json({ message: "Unauthorized" });
      }

      const orgId = new mongoose.Types.ObjectId(req.user.organizationId);

      // ===============================
      // A. FETCH ORGANIZATION
      // ===============================
      const org = await Organization.findById(orgId);
      if (!org) {
        return res.status(404).json({ message: "Organization not found" });
      }

      const statutory = org.statutoryConfig || {};

      // ===============================
      // B. PAYROLL TREND (LAST 6 MONTHS)
      // ===============================
      const trendData = [];
      const today = new Date();

      for (let i = 5; i >= 0; i--) {
        const dateIterator = new Date(
          today.getFullYear(),
          today.getMonth() - i,
          1
        );

        const monthName = dateIterator.toLocaleString("default", {
          month: "short",
        });

        const endOfMonth = new Date(
          dateIterator.getFullYear(),
          dateIterator.getMonth() + 1,
          0
        );

        const endOfMonthString = endOfMonth.toISOString().split("T")[0];

        const monthlyStats = await User.aggregate([
          {
            $match: {
              organizationId: orgId,
              status: "Active",
              "employeeDetails.basic.doj": { $lte: endOfMonthString },
            },
          },
          {
            $group: {
              _id: null,
              monthlyPayroll: {
                $sum: { $divide: ["$employeeDetails.salary.ctc", 12] },
              },
            },
          },
        ]);

        trendData.push({
          month: monthName,
          payroll: Math.round(monthlyStats[0]?.monthlyPayroll || 0),
        });
      }

      // ===============================
      // C. CURRENT EMPLOYEE STATS
      // ===============================
      const employees = await User.find({
        organizationId: orgId,
        status: "Active",
      });

      const totalEmployees = employees.length;

      let totalPayroll = 0;
      let totalDeductions = 0;

      employees.forEach((emp) => {
        const ctc = num(emp?.employeeDetails?.salary?.ctc);
        if (!ctc) return;

        const monthlySalary = ctc / 12;
        totalPayroll += monthlySalary;

        let empDeduction = 0;

        // PF (Employee Contribution)
        if (statutory.pf?.enabled) {
          empDeduction +=
            (monthlySalary * num(statutory.pf.employeeContribution)) / 100;
        }

        // ESI (Only if salary <= wage limit)
        if (
          statutory.esi?.enabled &&
          monthlySalary <= num(statutory.esi.wageLimit)
        ) {
          empDeduction +=
            (monthlySalary * num(statutory.esi.employeeContribution)) / 100;
        }

        // Professional Tax (State based)
        if (statutory.professionalTax?.enabled) {
          empDeduction += getProfessionalTax(monthlySalary);
        }

        totalDeductions += empDeduction;
      });

      totalPayroll = Math.round(num(totalPayroll));
      totalDeductions = Math.round(num(totalDeductions));

      const avgSalary =
        totalEmployees > 0
          ? Math.round(totalPayroll / totalEmployees)
          : 0;

      // ===============================
      // D. DEPARTMENT DISTRIBUTION
      // ===============================
      const departmentStats = await User.aggregate([
        {
          $match: {
            organizationId: orgId,
            status: "Active",
          },
        },
        {
          $group: {
            _id: "$employeeDetails.basic.department",
            count: { $sum: 1 },
          },
        },
      ]);

      // ===============================
      // E. RESPONSE
      // ===============================
      res.json({
        overview: {
          totalEmployees,
          totalPayroll,
          totalDeductions,
          avgSalary,
        },
        departmentStats: departmentStats.map((d) => ({
          name: d._id || "Unassigned",
          value: d.count,
        })),
        payrollTrend: trendData,
      });
    } catch (err) {
      console.error("Dashboard error:", err);
      res.status(500).json({
        message: "Server Error",
        error: err.message,
      });
    }
  }
);

export default router;
