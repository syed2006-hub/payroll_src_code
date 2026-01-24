const express = require("express");
const { authenticate, authorize } = require("../middleware/auth");

const User = require("../models/Usermodel");

const router = express.Router();

router.get(
  "/dashboardsummary",
  authenticate,
  authorize("Super Admin"),
  async (req, res) => {
    try {
      if (!req.user?.organizationId) {
        return res.status(401).json({ message: "Unauthorized" });
      }

      const orgId = req.user.organizationId;

      const [
        totalUsers,
        activeUsers
      ] = await Promise.all([
        User.countDocuments({ organizationId: orgId }),
        User.countDocuments({
          organizationId: orgId,
          status: "Active"
        })
      ]);

      res.json({
        totalUsers,
        activeUsers,
        organizationName: req.user.organizationName
      });
    } catch (err) {
      console.error("Dashboard summary error:", err);
      res.status(500).json({
        message: "Failed to load dashboard"
      });
    }
  }
);

module.exports = router;
