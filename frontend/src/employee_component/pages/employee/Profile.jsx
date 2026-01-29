import { useContext, useEffect, useState } from 'react';
import {
  FiUser,
  FiMail,
  FiBriefcase,
  FiCalendar,
  FiCreditCard,
  FiHash,
} from 'react-icons/fi';

import { AuthContext } from '../../../context/AuthContext';
import { API_URL } from '../../../config/api';

export default function Profile() {
  const { user, token } = useContext(AuthContext);

  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!token) return;

    const fetchProfile = async () => {
      try {
        // ⛔ API PLACEHOLDER (backend can be wired later)
        // const res = await fetch(`${API_URL}/api/employee/profile`, {
        //   headers: {
        //     Authorization: `Bearer ${token}`,
        //   },
        // });
        // const data = await res.json();
        // setProfile(data);

        setProfile(null); // temporary: backend not connected
      } catch (err) {
        console.error('Profile fetch failed:', err);
        setProfile(null);
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, [token]);

  if (loading) {
    return (
      <div className="text-sm text-text-secondary">
        Loading profile...
      </div>
    );
  }

  // Prefer backend profile → fallback to auth user
  const displayName = profile?.name ?? user?.name ?? '—';
  const role = profile?.role ?? user?.role ?? '—';
  const department = profile?.department ?? '—';

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div>
        <h2 className="flex items-center gap-2 text-xl font-semibold text-text-primary">
          <FiUser />
          Profile
        </h2>
        <p className="text-sm text-text-secondary mt-1">
          View your personal and payroll-related information
        </p>
      </div>

      {/* ===== BASIC PROFILE CARD ===== */}
      <div className="bg-white border rounded-xl p-6 flex items-center gap-6">
        <div className="w-20 h-20 rounded-full border-2 border-primary flex items-center justify-center text-xl font-semibold text-primary bg-gray-100">
          {displayName !== '—'
            ? displayName
                .split(' ')
                .map(w => w[0])
                .join('')
            : '?'}
        </div>

        <div>
          <p className="text-lg font-semibold">{displayName}</p>
          <p className="text-sm text-text-secondary">{role}</p>
          <p className="text-sm text-text-muted">{department}</p>
        </div>
      </div>

      {/* ===== DETAILS GRID ===== */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* PERSONAL DETAILS */}
        <div className="bg-white border rounded-xl p-6 space-y-4">
          <h3 className="font-semibold text-text-primary">
            Personal Details
          </h3>

          <DetailItem
            icon={FiHash}
            label="Employee ID"
            value={profile?.id ?? '—'}
          />
          <DetailItem
            icon={FiMail}
            label="Email"
            value={profile?.email ?? user?.email ?? '—'}
          />
          <DetailItem
            icon={FiBriefcase}
            label="Role"
            value={role}
          />
          <DetailItem
            icon={FiCalendar}
            label="Joining Date"
            value={profile?.joiningDate ?? '—'}
          />
        </div>

        {/* BANK & TAX DETAILS */}
        <div className="bg-white border rounded-xl p-6 space-y-4">
          <h3 className="font-semibold text-text-primary">
            Bank & Tax Information
          </h3>

          <DetailItem
            icon={FiCreditCard}
            label="Bank Account"
            value={profile?.bank?.accountNumber ?? '—'}
          />
          <DetailItem
            icon={FiHash}
            label="IFSC Code"
            value={profile?.bank?.ifsc ?? '—'}
          />
          <DetailItem
            icon={FiHash}
            label="PAN Number"
            value={profile?.tax?.pan ?? '—'}
          />
          <DetailItem
            icon={FiHash}
            label="Aadhaar"
            value={profile?.tax?.aadhaar ?? '—'}
          />
        </div>
      </div>
    </div>
  );
}

/* ===== REUSABLE DETAIL ROW ===== */
function DetailItem({ icon, label, value }) {
  const Icon = icon;

  return (
    <div className="flex items-start gap-3 text-sm">
      <Icon className="text-text-muted mt-0.5" />
      <div>
        <p className="text-text-secondary">{label}</p>
        <p className="font-medium">
          {value ?? '—'}
        </p>
      </div>
    </div>
  );
}
