import {
  FiSettings,
  FiBell,
  FiLock,
  FiLogOut,
  FiMail,
} from 'react-icons/fi';
import { useContext } from 'react';
import { AuthContext } from '../../../context/AuthContext';

export default function Settings() {
  const { user } = useContext(AuthContext);

  // Backend-provided user data (safe fallback)
  const account = {
    name: user?.name ?? '—',
    email: user?.email ?? '—',
    role: user?.role ?? '—',
  };

  const notificationSettings = {
    payslip: true,
    tax: true,
    announcements: false,
  };

  const security = {
    twoFactorEnabled: false,
  };

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div>
        <h2 className="flex items-center gap-2 text-xl font-semibold text-text-primary">
          <FiSettings />
          Settings
        </h2>
        <p className="text-sm text-text-secondary mt-1">
          Manage your account preferences and notifications
        </p>
      </div>

      {/* ================= ACCOUNT ================= */}
      <div className="bg-white border rounded-xl p-6 space-y-4">
        <h3 className="font-semibold flex items-center gap-2">
          <FiMail />
          Account
        </h3>

        <SettingRow
          title="Name"
          description={account.name}
          action="Read only"
        />

        <SettingRow
          title="Email Address"
          description={account.email}
          action="Read only"
        />

        <SettingRow
          title="Role"
          description={account.role}
          action="Managed by HR"
        />
      </div>

      {/* ================= NOTIFICATIONS ================= */}
      <div className="bg-white border rounded-xl p-6 space-y-4">
        <h3 className="font-semibold flex items-center gap-2">
          <FiBell />
          Notifications
        </h3>

        <ToggleRow
          title="Payslip Notifications"
          description="Get notified when your payslip is generated"
          defaultChecked={notificationSettings.payslip}
        />

        <ToggleRow
          title="Tax Reminders"
          description="Receive reminders for tax declarations"
          defaultChecked={notificationSettings.tax}
        />

        <ToggleRow
          title="General Announcements"
          description="Company-wide payroll updates"
          defaultChecked={notificationSettings.announcements}
        />
      </div>

      {/* ================= SECURITY ================= */}
      <div className="bg-white border rounded-xl p-6 space-y-4">
        <h3 className="font-semibold flex items-center gap-2">
          <FiLock />
          Security
        </h3>

        <SettingRow
          title="Change Password"
          description="Update your login password"
          action="Change"
          clickable
        />

        <SettingRow
          title="Two-Factor Authentication"
          description="Extra security for your account"
          action={security.twoFactorEnabled ? 'Enabled' : 'Not enabled'}
        />
      </div>
    </div>
  );
}


/* ================= REUSABLE ROWS ================= */

function SettingRow({ title, description, action, clickable }) {
  return (
    <div className="flex items-center justify-between text-sm">
      <div>
        <p className="font-medium">{title}</p>
        <p className="text-text-secondary text-xs">{description}</p>
      </div>

      <span
        className={
          clickable
            ? 'text-primary cursor-pointer hover:underline'
            : 'text-text-muted'
        }
      >
        {action}
      </span>
    </div>
  );
}

function ToggleRow({ title, description, defaultChecked }) {
  return (
    <div className="flex items-center justify-between text-sm">
      <div>
        <p className="font-medium">{title}</p>
        <p className="text-text-secondary text-xs">{description}</p>
      </div>

      <input
        type="checkbox"
        defaultChecked={defaultChecked}
        className="w-4 h-4 accent-primary"
      />
    </div>
  );
}
