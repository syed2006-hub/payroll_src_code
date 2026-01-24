const express = require('express');
const { authenticate, authorize } = require('../middleware/auth');
const User = require('../models/Usermodel');

const router = express.Router();

/**
 * GET ALL USERS (Super Admin + HR Admin)
 */
router.get(
  '/',
  authenticate,
  authorize('Super Admin', 'HR Admin'),
  async (req, res) => {
    try {
      const users = await User.find({
        organizationId: req.user.organizationId,
        role: { $ne: 'Super Admin' } // hide super admin from list
      })
        .select('-password')
        .sort({ createdAt: -1 });

      res.status(200).json({
        success: true,
        message: 'Users fetched successfully',
        data: users
      });
    } catch (err) {
      console.error('Get users error:', err);
      res.status(500).json({
        success: false,
        message: 'Failed to fetch users'
      });
    }
  }
);

/**
 * ADD USER (Super Admin only)
 */ 
router.get("/check-existence", authenticate, authorize("Super Admin", "HR Admin"), async (req, res) => {
  const { email, employeeId } = req.query;

  const exists = await User.findOne({
    $or: [
      email ? { email } : null,
      employeeId ? { employeeId } : null
    ].filter(Boolean)
  });

  res.json({ exists: !!exists });
});
router.post(
  '/',
  authenticate,
  authorize('Super Admin'),
  async (req, res) => {
    try {
      const { basic } = req.body;   
      
      // Validation
      if (!basic.firstName || !basic.password || !basic.email || !basic.department ) {
        return res.status(400).json({
          success: false,
          message: 'First name, email, department (role) are required'
        });
      }

      // Combine names
      const fullName = [basic.firstName, basic.middleName, basic.lastName].filter(Boolean).join(' ');

      // Check if email or employeeId already exists
      const existingUser = await User.findOne({
        $or: [
          { email: basic.email },
          { 'employeeDetails.basic.employeeId': basic.employeeId }
        ]
      });
      if (existingUser) {
        return res.status(409).json({
          success: false,
          message: 'Email or Employee ID already exists'
        });
      }

      // Create user
      const user = await User.create({
        name: fullName,
        email: basic.email,
        password: basic.password,
        role: basic.department, // mapping department as role
        profileImage:'',
        organizationId: req.user.organizationId,
        onboardingCompleted: true,
        employeeDetails: req.body
      });

      res.status(201).json({
        success: true,
        message: 'Employee created successfully',
        data: user
      });
    } catch (err) {
      console.error('Add employee error:', err);
      res.status(500).json({
        success: false,
        message:`${err.message}` +' Failed to create employee'
      });
    }
  }
);


/**
 * UPDATE USER
 */
router.put(
  '/:userId',
  authenticate,
  authorize('Super Admin'),
  async (req, res) => {
    try {
      const { userId } = req.params;

      const user = await User.findOne({
        _id: userId,
        organizationId: req.user.organizationId
      });

      if (!user) {
        return res.status(404).json({
          success: false,
          message: 'User not found'
        });
      }

      if (user.role === 'Super Admin') {
        return res.status(403).json({
          success: false,
          message: 'Cannot modify Super Admin'
        });
      }

      Object.assign(user, req.body);
      await user.save();

      res.status(200).json({
        success: true,
        message: 'User updated successfully',
        data: user
      });
    } catch (err) {
      console.error('Update user error:', err);
      res.status(500).json({
        success: false,
        message: 'Failed to update user'
      });
    }
  }
);

/**
 * DELETE USER
 */
router.delete(
  '/:userId',
  authenticate,
  authorize('Super Admin'),
  async (req, res) => {
    try {
      const { userId } = req.params;

      const user = await User.findOne({
        _id: userId,
        organizationId: req.user.organizationId
      });

      if (!user) {
        return res.status(404).json({
          success: false,
          message: 'User not found'
        });
      }

      if (user.role === 'Super Admin') {
        return res.status(403).json({
          success: false,
          message: 'Cannot delete Super Admin'
        });
      }

      await user.deleteOne();

      res.status(200).json({
        success: true,
        message: 'User deleted successfully'
      });
    } catch (err) {
      console.error('Delete user error:', err);
      res.status(500).json({
        success: false,
        message: 'Failed to delete user'
      });
    }
  }
);

module.exports = router;
