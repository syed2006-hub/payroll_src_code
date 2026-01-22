const express = require('express');
const { authenticate, authorize } = require('../middleware/auth');
const Organization = require('../models/Organization');
const User = require('../models/User');

const router = express.Router();

router.post('/company-profile', authenticate, authorize('Super Admin'), async (req, res) => {
  try {
    const { companyName, industry, financialYearStart, financialYearEnd } = req.body;

    if (!companyName || !industry || !financialYearStart || !financialYearEnd) {
      return res.status(400).json({ message: 'All fields are required' });
    }

    const org = await Organization.findById(req.user.organizationId);
    if (!org) {
      return res.status(404).json({ message: 'Organization not found' });
    }

    org.companyName = companyName;
    org.industry = industry;
    org.financialYear = {
      startMonth: financialYearStart,
      endMonth: financialYearEnd
    };

    await org.save();
    res.json({ message: 'Company profile updated', organization: org });
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
});

router.post('/statutory-setup', authenticate, authorize('Super Admin'), async (req, res) => {
  try {
    const { pf, esi, professionalTax } = req.body;

    const org = await Organization.findById(req.user.organizationId);
    if (!org) {
      return res.status(404).json({ message: 'Organization not found' });
    }

    if (pf) org.statutoryConfig.pf = pf;
    if (esi) org.statutoryConfig.esi = esi;
    if (professionalTax) org.statutoryConfig.professionalTax = professionalTax;

    await org.save();
    res.json({ message: 'Statutory setup updated', organization: org });
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
});

router.post('/access-levels', authenticate, authorize('Super Admin'), async (req, res) => {
  try {
    const { payrollAdmin, hrAdmin, finance } = req.body;

    const org = await Organization.findById(req.user.organizationId);
    if (!org) {
      return res.status(404).json({ message: 'Organization not found' });
    }

    if (payrollAdmin) org.accessLevels.payrollAdmin = payrollAdmin;
    if (hrAdmin) org.accessLevels.hrAdmin = hrAdmin;
    if (finance) org.accessLevels.finance = finance;

    org.setupCompleted = true;
    await org.save();

    await User.findByIdAndUpdate(req.user.userId, { onboardingCompleted: true });

    res.json({ message: 'Onboarding completed', organization: org });
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
});

router.get('/status', authenticate, authorize('Super Admin'), async (req, res) => {
  try {
    const org = await Organization.findById(req.user.organizationId);
    const user = await User.findById(req.user.userId);
    
    res.json({
      setupCompleted: org.setupCompleted,
      onboardingCompleted: user.onboardingCompleted,
      organization: org
    });
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
});

module.exports = router;