import express from "express";
import { authenticate, authorize } from "../middleware/auth.js";
import Organization from "../models/Organization.js"; 
// import User from '../models/Usermodel.js'; // Not needed if req.user contains organizationId

const router = express.Router();

// ==========================================
// 1. GET Roles and Departments
// ==========================================
// Also, update your GET /settings route to include this new field
router.get("/settings", authenticate, async (req, res) => {
  try {
    const org = await Organization.findById(req.user.organizationId);
    if (!org) return res.status(404).json({ message: "Organization not found" });
    console.log(org.location)
    res.json({
      roles: org.roles || [],
      departments: org.departments || [],
      roleBasedAccess: org.roleBasedAccess || {},
      statutoryConfig: org.statutoryConfig || {},   // <-- Add this
      locations:org.location ||[]
      
      
    });
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
});

// ==========================================
// 2. ADD Role
// ==========================================
router.put("/add-role", authenticate, authorize("Super Admin"), async (req, res) => {
  try {
    const { role } = req.body;

    if (!role) return res.status(400).json({ message: "Role is required" });

    // --- RESTRICTION: Prevent adding 'Super Admin' role ---
    if (role.trim().toLowerCase() === "super admin") {
      return res.status(403).json({ message: "Cannot create a role named 'Super Admin'" });
    }

    await Organization.findByIdAndUpdate(req.user.organizationId, {
      $addToSet: { roles: role } // $addToSet prevents duplicates
    });
    
    res.json({ message: "Role added successfully" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
});

// ==========================================
// 3. ADD Department
// ==========================================
router.put("/add-department", authenticate, authorize("Super Admin"), async (req, res) => {
  try {
    const { department } = req.body;

    if (!department) return res.status(400).json({ message: "Department is required" });

    await Organization.findByIdAndUpdate(req.user.organizationId, {
      $addToSet: { departments: department } 
    });

    res.json({ message: "Department added successfully" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
});

// ==========================================
// 4. DELETE Role
// ==========================================
router.delete('/delete-role', authenticate, authorize("Super Admin"), async (req, res) => {
  try {
    const { role } = req.body;

    if (!role) {
      return res.status(400).json({ success: false, error: "Role is required" });
    }

    // --- RESTRICTION: Prevent deleting 'Super Admin' ---
    if (role.trim().toLowerCase() === 'super admin') {
      return res.status(403).json({ success: false, error: "Cannot delete Super Admin role" });
    }

    // Direct update using req.user.organizationId (Removed extra User DB call)
    const result = await Organization.findOneAndUpdate(
      { _id: req.user.organizationId }, 
      { $pull: { roles: role } },
      { new: true } 
    );

    if (!result) {
      return res.status(404).json({ success: false, error: "Organization not found" });
    }

    return res.status(200).json({ 
      success: true, 
      message: "Role deleted successfully", 
      roles: result.roles 
    });

  } catch (error) {
    console.error("Delete Role Error:", error);
    return res.status(500).json({ success: false, error: "Server Error" });
  }
});

// ==========================================
// 5. DELETE Department
// ==========================================
router.delete('/delete-department', authenticate, authorize("Super Admin"), async (req, res) => {
  try {
    const { department } = req.body;

    if (!department) {
      return res.status(400).json({ success: false, error: "Department is required" });
    }

    const result = await Organization.findOneAndUpdate(
      { _id: req.user.organizationId }, 
      { $pull: { departments: department } },
      { new: true }
    );

    if (!result) {
      return res.status(404).json({ success: false, error: "Organization not found" });
    }

    return res.status(200).json({ 
      success: true, 
      message: "Department deleted successfully", 
      departments: result.departments 
    });

  } catch (error) {
    console.error("Delete Department Error:", error);
    return res.status(500).json({ success: false, error: "Server Error" });
  }
});
router.put("/update-permissions", authenticate, authorize("Super Admin"), async (req, res) => {
  try {
    const { roleBasedAccess } = req.body;

    // Validation (Optional but recommended)
    if (!roleBasedAccess || typeof roleBasedAccess !== 'object') {
         return res.status(400).json({ message: "Invalid data format" });
    }

    await Organization.findByIdAndUpdate(req.user.organizationId, {
      $set: { roleBasedAccess: roleBasedAccess }
    });

    res.json({ message: "Permissions updated successfully" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
});


export default router;