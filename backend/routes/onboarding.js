import express from 'express';
import { authenticate, authorize } from '../middleware/auth.js';
import Organization from '../models/Organization.js';
import User from '../models/Usermodel.js';

const router = express.Router();

/**
 * FINAL ONBOARDING SUBMIT
 * POST /api/onboarding/complete
 */
router.post(
  '/complete',
  authenticate,
  authorize('Super Admin'),
  async (req, res) => {
    try {
      const {
        companyName,
        industry,
        financialYear,
        statutoryConfig,
        accessLevels,
        location
      } = req.body;

      if (
        !companyName ||
        !industry ||
        !financialYear?.startMonth ||
        !financialYear?.endMonth
      ) {
        return res.status(400).json({ message: 'Company profile details are missing' });
      }
           // -------- FETCH ORG --------
        const org = await Organization.findById(req.user.organizationId);
        if (!org) {
          return res.status(404).json({ message: 'Organization not found' });
        }

        org.companyName = companyName;
        org.industry = industry;
        org.financialYear = {
          startMonth: financialYear.startMonth,
          endMonth: financialYear.endMonth
        };


 

      // -------- STATUTORY CONFIG --------
      if (statutoryConfig) {
        org.statutoryConfig = {
          pf: statutoryConfig.pf || { enabled: false },
          esi: statutoryConfig.esi || { enabled: false },
          professionalTax: statutoryConfig.professionalTax || { enabled: false }
        };
      }

      // -------- ACCESS LEVELS --------
      if (accessLevels) {
        org.accessLevels = {
          payrollAdmin: accessLevels.payrollAdmin || {},
          hrAdmin: accessLevels.hrAdmin || {},
          finance: accessLevels.finance || {}
        };
      }

      // -------- FLAGS --------
      org.setupCompleted = true;

      await org.save();

      // -------- UPDATE USER --------
      await User.findByIdAndUpdate(req.user.userId, {
        onboardingCompleted: true
      });

      res.status(200).json({
        message: 'Onboarding completed successfully',
        organizationId: org._id
      });
    } catch (err) {
      console.error('Onboarding error:', err);
      res.status(500).json({
        message: 'Server error during onboarding',
        error: err.message
      });
    }
  }
);

export default router;
