import { FiBell } from 'react-icons/fi';

export default function Notifications() {
  // ✅ Inline UI data (remove when backend is ready)
  const notifications = [
    {
      id: 1,
      title: 'April 2024 Payslip Generated',
      message: 'Your payslip for April 2024 is now available.',
      date: '02 May 2024',
      unread: true,
    },
    {
      id: 2,
      title: 'Tax Declaration Reminder',
      message: 'Please submit your tax declarations for FY 2024–25.',
      date: '25 April 2024',
      unread: false,
    },
    {
      id: 3,
      title: 'Profile Update Required',
      message: 'Update your bank details to avoid salary delays.',
      date: '10 April 2024',
      unread: false,
    },
  ];

  return (
    <div className="space-y-4">
      {/* Header */}
      <h2 className="flex items-center gap-2 text-xl font-semibold">
        <FiBell />
        Notifications
      </h2>

      {/* Empty state */}
      {notifications.length === 0 ? (
        <div className="bg-white border rounded-lg p-6 text-sm text-text-muted text-center">
          No notifications yet.
        </div>
      ) : (
        notifications.map((n) => (
          <div
            key={n.id}
            className={`bg-white border rounded-lg p-4 text-sm transition
              ${n.unread ? 'border-primary/40 bg-primary/5' : ''}`}
          >
            <div className="flex items-start justify-between gap-4">
              <div>
                <p className="font-medium">
                  {n.title}
                </p>
                <p className="text-text-muted mt-1">
                  {n.message}
                </p>
              </div>

              <span className="text-xs text-text-muted whitespace-nowrap">
                {n.date}
              </span>
            </div>
          </div>
        ))
      )}
    </div>
  );
}
