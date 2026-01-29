import express from "express";
import mongoose from "mongoose";
import { authenticate, authorize } from "../middleware/auth.js";
import User from "../models/Usermodel.js";

const router = express.Router();

router.get(
  "/dashboardsummary",
  authenticate,
  authorize("Super Admin"),
  async (req, res) => {
    try {
      // 1. Authorization Check
      if (!req.user?.organizationId) {
        return res.status(401).json({ message: "Unauthorized" });
      }

      const orgId = new mongoose.Types.ObjectId(req.user.organizationId);

      // --- A. CALCULATE HISTORICAL TREND (Last 6 Months) ---
      const trendData = [];
      const today = new Date();

      // Loop backwards for the last 5 months + current month (total 6)
      for (let i = 5; i >= 0; i--) {
        const dateIterator = new Date(today.getFullYear(), today.getMonth() - i, 1);
        const monthName = dateIterator.toLocaleString('default', { month: 'short' }); // e.g., "Aug"
        
        // Calculate the last day of that specific month
        const endOfMonth = new Date(dateIterator.getFullYear(), dateIterator.getMonth() + 1, 0);
        
        // Format as YYYY-MM-DD to match string format in DB (or Date object if stored as Date)
        // If your DB stores dates as strings like "2024-02-10", we use string comparison.
        const endOfMonthString = endOfMonth.toISOString().split('T')[0];

        // Aggregate Sum of Salaries for employees who joined ON or BEFORE this month
        const monthlyStats = await User.aggregate([
          {
            $match: {
              organizationId: orgId,
              status: "Active", // Only include currently active employees
              "employeeDetails.basic.doj": { $lte: endOfMonthString } // Joined before month end
            }
          },
          {
            $group: {
              _id: null,
              // Calculate Monthly Salary: CTC / 12
              monthlyPayroll: { $sum: { $divide: ["$employeeDetails.salary.ctc", 12] } }
            }
          }
        ]);

        trendData.push({
          month: monthName,
          payroll: monthlyStats[0]?.monthlyPayroll ? Math.round(monthlyStats[0].monthlyPayroll) : 0
        });
      }

      // --- B. CURRENT REAL-TIME OVERVIEW ---
      
      // 1. Total Employees & Current Payroll
      const currentStats = await User.aggregate([
        { 
          $match: { 
            organizationId: orgId,
            status: "Active" 
          } 
        },
        {
          $group: {
            _id: null,
            totalEmployees: { $sum: 1 },
            totalMonthlyPayroll: { $sum: { $divide: ["$employeeDetails.salary.ctc", 12] } }
          }
        }
      ]);

      const stats = currentStats[0] || { totalEmployees: 0, totalMonthlyPayroll: 0 };
      const totalEmployees = stats.totalEmployees;
      const totalPayroll = Math.round(stats.totalMonthlyPayroll);
      const avgSalary = totalEmployees > 0 ? Math.round(totalPayroll / totalEmployees) : 0;

      // 2. Department Distribution
      const departmentStats = await User.aggregate([
        { 
          $match: { 
            organizationId: orgId,
            status: "Active" 
          } 
        },
        {
          $group: {
            _id: "$employeeDetails.basic.department",
            count: { $sum: 1 }
          }
        }
      ]);

      // 3. Pending Approvals
      const pendingApprovals = await User.countDocuments({
        organizationId: orgId,
        $or: [{ status: "Pending" }, { onboardingCompleted: false }]
      });

      // --- C. SEND RESPONSE ---
      res.json({
        overview: {
          totalEmployees,
          totalPayroll,
          pendingApprovals,
          avgSalary
        },
        // Handle case where department is undefined/null
        departmentStats: departmentStats.map(d => ({ 
          name: d._id || "Unassigned", 
          value: d.count 
        })),
        payrollTrend: trendData
      });

    } catch (err) {
      console.error("Dashboard error:", err);
      res.status(500).json({ message: "Server Error", error: err.message });
    }
  }
);

export default router;