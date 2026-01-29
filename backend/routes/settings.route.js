// routes/settings.routes.js
import express from 'express';
import { authenticate, authorize } from '../middleware/auth.js';
import Organization from '../models/Organization.js';
import User from '../models/Usermodel.js';

const router = express.Router();

// ----------------- COMPANY PROFILE -----------------
router.post(
  "/company-profile",
  authenticate,
  authorize("Super Admin"),
  async (req, res) => {
    try {
      const { companyName, industry, financialYear, location } = req.body;

      // -------- VALIDATION --------
      if (
        !companyName ||
        !industry ||
        !financialYear?.startMonth ||
        !financialYear?.endMonth
      ) {
        return res.status(400).json({
          message: "Company name, industry and financial year are required"
        });
      }

      // -------- FETCH ORG --------
      const org = await Organization.findById(req.user.organizationId);
      if (!org) {
        return res.status(404).json({ message: "Organization not found" });
      }

      // -------- UPDATE COMPANY PROFILE --------
      org.companyName = companyName;
      org.industry = industry;

      org.financialYear = {
        startMonth: financialYear.startMonth,
        endMonth: financialYear.endMonth
      };

      // -------- LOCATION (OPTIONAL) --------
      if (Array.isArray(location)) {
        org.location = location;
      }

      await org.save();

      res.status(200).json({
        message: "Company profile updated successfully",
        organization: org
      });
    } catch (err) {
      console.error("Company profile error:", err);
      res.status(500).json({
        message: "Server error",
        error: err.message
      });
    }
  }
);


// ----------------- STATUTORY SETUP -----------------
router.post('/statutory-setup', authenticate, authorize('Super Admin'), async (req, res) => {
  try {
    const { pf, esi, professionalTax } = req.body;

    const org = await Organization.findById(req.user.organizationId);
    if (!org) return res.status(404).json({ message: 'Organization not found' });

    org.statutoryConfig = org.statutoryConfig || {};
    if (pf !== undefined) org.statutoryConfig.pf = pf;
    if (esi !== undefined) org.statutoryConfig.esi = esi;
    if (professionalTax !== undefined) org.statutoryConfig.professionalTax = professionalTax;

    await org.save();
    res.json({ message: 'Statutory setup updated', organization: org });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error', error: err.message });
  }
});

// ----------------- ACCESS LEVELS -----------------
router.post('/access-levels', authenticate, authorize('Super Admin'), async (req, res) => {
  try {
    const { payrollAdmin, hrAdmin, finance } = req.body;

    const org = await Organization.findById(req.user.organizationId);
    if (!org) return res.status(404).json({ message: 'Organization not found' });

    org.accessLevels = org.accessLevels || {};
    if (payrollAdmin !== undefined) org.accessLevels.payrollAdmin = payrollAdmin;
    if (hrAdmin !== undefined) org.accessLevels.hrAdmin = hrAdmin;
    if (finance !== undefined) org.accessLevels.finance = finance;

    org.setupCompleted = true;
    await org.save();

    // Optionally mark onboarding complete for this user
    await User.findByIdAndUpdate(req.user.userId, { onboardingCompleted: true });

    res.json({ message: 'Access levels updated', organization: org });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error', error: err.message });
  }
});

// ----------------- GET STATUS -----------------
router.get('/status', authenticate, authorize('Super Admin'), async (req, res) => {
  try {
    const org = await Organization.findById(req.user.organizationId);
    const user = await User.findById(req.user.userId);

    if (!org) return res.status(404).json({ message: 'Organization not found' });

    res.json({
      setupCompleted: org.setupCompleted,
      onboardingCompleted: user.onboardingCompleted,
      organization: org,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error', error: err.message });
  }
});

export default router;
