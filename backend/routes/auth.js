import express from 'express';
import jwt from 'jsonwebtoken';
import passport from 'passport';
import User from '../models/Usermodel.js';
import Organization from '../models/Organization.js';

const router = express.Router();

// ==================== SUPER ADMIN REGISTRATION ====================
router.post('/register-super-admin', async (req, res) => {
  console.log('📝 Registration request received');
  console.log('📦 Request body:', req.body);
  
  try {
    const { name, email, password, companyName } = req.body;

    // Validation
    if (!name || !email || !password || !companyName) {
      console.log('❌ Validation failed: Missing fields');
      return res.status(400).json({ message: 'All fields are required' });
    }

    console.log('✅ Validation passed');
    console.log('🔍 Checking if email exists...');

    // Check if email already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      console.log('❌ Email already exists');
      return res.status(400).json({ message: 'Email already registered' });
    }

    console.log('✅ Email is unique');

    // Password strength validation
    if (password.length < 8) {
      console.log('❌ Password too short');
      return res.status(400).json({ message: 'Password must be at least 8 characters' });
    }

    console.log('✅ Password validation passed');
    console.log('🏢 Creating organization...');

    // Create organization
    const organization = await Organization.create({
      companyName,
      industry: 'Pending',
      financialYear: { startMonth: 'April', endMonth: 'March' },
      setupCompleted: false
    });

    console.log('✅ Organization created:', organization._id);
    console.log('👤 Creating Super Admin user...');

    // Create Super Admin
    const superAdmin = await User.create({
      name,
      email,
      password,
      role: 'Super Admin',
      organizationId: organization._id,
      onboardingCompleted: false
    });

    console.log('✅ Super Admin created:', superAdmin._id);
    console.log('🔗 Updating organization with creator...');

    // Update organization with creator
    organization.createdBy = superAdmin._id;
    await organization.save();

    console.log('✅ Organization updated');
    console.log('🔐 Generating JWT token...');

    // Generate JWT
    const token = jwt.sign(
      { 
        userId: superAdmin._id, 
        role: superAdmin.role, 
        organizationId: organization._id,
        onboardingCompleted: false
      },
      process.env.JWT_SECRET,
      { expiresIn: '7d' }
    );

    console.log('✅ Token generated');
    console.log('📤 Sending success response');

    res.status(201).json({
      token,
      user: {
        id: superAdmin._id,
        name: superAdmin.name,
        email: superAdmin.email,
        role: superAdmin.role,
        organizationId: organization._id,
        onboardingCompleted: false
      },
      message: 'Registration successful'
    });

    console.log('✅ Registration completed successfully!');

  } catch (err) {
    console.error('❌❌❌ REGISTRATION ERROR ❌❌❌');
    console.error('Error name:', err.name);
    console.error('Error message:', err.message);
    console.error('Error stack:', err.stack);
    res.status(500).json({ message: 'Server error', error: err.message });
  }
});

// ==================== LOGIN ====================
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ message: 'Email and password required' });
    }

    const user = await User.findOne({ email });
    if (!user) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    let requiresOnboarding = false;
    if (user.role === 'Super Admin' && user.organizationId) {
      const org = await Organization.findById(user.organizationId);
      requiresOnboarding = !org?.setupCompleted;
    }

    const token = jwt.sign(
      {
        userId: user._id,
        role: user.role,
        organizationId: user.organizationId,
        onboardingCompleted: user.onboardingCompleted
      },
      process.env.JWT_SECRET,
      { expiresIn: '7d' }
    );

    res.json({
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        profileImage: user.profileImage,
        organizationId: user.organizationId,
        onboardingCompleted: user.onboardingCompleted
      },
      requiresOnboarding
    });
  } catch (err) {
    console.error('Login error:', err);
    res.status(500).json({ message: 'Server error' });
  }
});


// ==================== LOGOUT ====================
router.post('/logout', (req, res) => {
  res.json({ message: 'Logged out successfully' });
});

// ==================== GOOGLE OAUTH ====================

// Google OAuth - Initiate
router.get('/google',
  passport.authenticate('google', { 
    scope: ['profile', 'email'],
    session: false
  })
);

// Google OAuth - Callback
router.get('/google/callback', async (req, res, next) => {
  passport.authenticate('google', { session: false }, async (err, user, info) => {
    try {
      console.log('🔵 Google callback handler triggered');
      
      if (err) {
        console.error('❌ Authentication error:', err);
        return res.redirect(`${process.env.FRONTEND_URL || 'http://localhost:5173'}/login?error=server_error`);
      }

      if (!user) {
        console.log('❌ No user found');
        return res.redirect(`${process.env.FRONTEND_URL || 'http://localhost:5173'}/login?error=no_account`);
      }

      console.log('✅ User authenticated:', user.email, '| Role:', user.role);

      // Check onboarding status
      let requiresOnboarding = false;
      if (user.role === 'Super Admin' && !user.onboardingCompleted) {
        const org = await Organization.findById(user.organizationId);
        requiresOnboarding = !org?.setupCompleted;
        console.log('🔍 Onboarding required:', requiresOnboarding);
      }

      // Generate JWT
      const token = jwt.sign(
        { 
          userId: user._id, 
          role: user.role, 
          organizationId: user.organizationId,
          onboardingCompleted: user.onboardingCompleted
        },
        process.env.JWT_SECRET,
        { expiresIn: '7d' }
      );

      console.log('🔐 Token generated');

      // Prepare user data
      const userData = encodeURIComponent(JSON.stringify({
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        organizationId: user.organizationId,
        onboardingCompleted: user.onboardingCompleted,
        profileImage: user.profileImage
      }));

      const redirectUrl = `${process.env.FRONTEND_URL || 'http://localhost:5173'}/login?token=${token}&user=${userData}`;
      
      console.log('✅ Redirecting to:', redirectUrl.substring(0, 80) + '...');
      
      return res.redirect(redirectUrl);

    } catch (error) {
      console.error('❌ Callback error:', error);
      return res.redirect(`${process.env.FRONTEND_URL || 'http://localhost:5173'}/login?error=server_error`);
    }
  })(req, res, next);
});

export default router;
