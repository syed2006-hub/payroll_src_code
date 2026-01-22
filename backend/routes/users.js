const express = require('express');
const { authenticate, authorize } = require('../middleware/auth');
const User = require('../models/User');
const router = express.Router();

// Get all users in the organization (Super Admin only)
router.get('/', authenticate, authorize('Super Admin'), async (req, res) => {
  try {
    const users = await User.find({ organizationId: req.user.organizationId })
      .select('-password')
      .sort({ createdAt: -1 });
    
    res.json({ users });
  } catch (err) {
    console.error('Get users error:', err);
    res.status(500).json({ message: 'Server error', error: err.message });
  }
});

// Add new user (Super Admin only)
router.post('/add', authenticate, authorize('Super Admin'), async (req, res) => {
  console.log('📝 Add user request received');
  console.log('📦 Request body:', req.body);

  try {
    const { name, email, password, role, profileImage } = req.body;

    // Validation
    if (!name || !email || !password || !role) {
      return res.status(400).json({ message: 'Name, email, password, and role are required' });
    }

    // Validate role
    const validRoles = ['Payroll Admin', 'HR Admin', 'Employee', 'Finance'];
    if (!validRoles.includes(role)) {
      return res.status(400).json({ message: 'Invalid role. Must be Payroll Admin, HR Admin, Employee, or Finance' });
    }

    // Check if email already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: 'Email already registered' });
    }

    // Password validation
    if (password.length < 8) {
      return res.status(400).json({ message: 'Password must be at least 8 characters' });
    }

    console.log('✅ Validation passed, creating user...');

    // Create new user
    const newUser = await User.create({
      name,
      email,
      password,
      role,
      profileImage: profileImage || '',
      organizationId: req.user.organizationId,
      onboardingCompleted: true // Other roles don't need onboarding
    });

    console.log('✅ User created successfully:', newUser._id);

    res.status(201).json({
      message: 'User created successfully',
      user: {
        id: newUser._id,
        name: newUser.name,
        email: newUser.email,
        role: newUser.role,
        profileImage: newUser.profileImage
      }
    });
  } catch (err) {
    console.error('❌ Add user error:', err);
    res.status(500).json({ message: 'Server error', error: err.message });
  }
});

// Update user (Super Admin only)
router.put('/:userId', authenticate, authorize('Super Admin'), async (req, res) => {
  try {
    const { name, email, role, profileImage } = req.body;
    const { userId } = req.params;

    const user = await User.findOne({ 
      _id: userId, 
      organizationId: req.user.organizationId 
    });

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Don't allow changing Super Admin role
    if (user.role === 'Super Admin') {
      return res.status(403).json({ message: 'Cannot modify Super Admin' });
    }

    // Update fields
    if (name) user.name = name;
    if (email) user.email = email;
    if (role) user.role = role;
    if (profileImage !== undefined) user.profileImage = profileImage;

    await user.save();

    res.json({
      message: 'User updated successfully',
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        profileImage: user.profileImage
      }
    });
  } catch (err) {
    console.error('Update user error:', err);
    res.status(500).json({ message: 'Server error', error: err.message });
  }
});

// Add new user with optional Google linking
router.post('/add', authenticate, authorize('Super Admin'), async (req, res) => {
  try {
    const { name, email, password, role, profileImage, allowGoogleLogin } = req.body;

    if (!name || !email || !role) {
      return res.status(400).json({ message: 'Name, email, and role are required' });
    }

    // If not allowing Google login, password is required
    if (!allowGoogleLogin && !password) {
      return res.status(400).json({ message: 'Password is required' });
    }

    const validRoles = ['Payroll Admin', 'HR Admin', 'Employee', 'Finance'];
    if (!validRoles.includes(role)) {
      return res.status(400).json({ message: 'Invalid role' });
    }

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: 'Email already registered' });
    }

    if (password && password.length < 8) {
      return res.status(400).json({ message: 'Password must be at least 8 characters' });
    }

    const newUser = await User.create({
      name,
      email,
      password: password || undefined, // Don't set password if allowing Google
      role,
      profileImage: profileImage || '',
      organizationId: req.user.organizationId,
      onboardingCompleted: true
    });

    res.status(201).json({
      message: 'User created successfully',
      user: {
        id: newUser._id,
        name: newUser.name,
        email: newUser.email,
        role: newUser.role
      }
    });
  } catch (err) {
    console.error('Add user error:', err);
    res.status(500).json({ message: 'Server error', error: err.message });
  }
});

// Delete user (Super Admin only)
router.delete('/:userId', authenticate, authorize('Super Admin'), async (req, res) => {
  try {
    const { userId } = req.params;

    const user = await User.findOne({ 
      _id: userId, 
      organizationId: req.user.organizationId 
    });

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Don't allow deleting Super Admin
    if (user.role === 'Super Admin') {
      return res.status(403).json({ message: 'Cannot delete Super Admin' });
    }

    await User.findByIdAndDelete(userId);

    res.json({ message: 'User deleted successfully' });
  } catch (err) {
    console.error('Delete user error:', err);
    res.status(500).json({ message: 'Server error', error: err.message });
  }
});

module.exports = router;