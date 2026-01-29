import { FiFolder, FiFileText, FiEye, FiDownload } from 'react-icons/fi';

export default function Documents() {
  // ✅ Inline UI data (backend will replace this)
  const documents = [
    {
      id: 'DOC-001',
      name: 'Offer Letter',
      type: 'PDF',
      uploadedOn: '15 Jan 2023',
      status: 'Available',
    },
    {
      id: 'DOC-002',
      name: 'Appointment Letter',
      type: 'PDF',
      uploadedOn: '20 Jan 2023',
      status: 'Available',
    },
    {
      id: 'DOC-003',
      name: 'PAN Card',
      type: 'Image',
      uploadedOn: '05 Feb 2023',
      status: 'Pending Verification',
    },
    {
      id: 'DOC-004',
      name: 'Aadhaar Card',
      type: 'Image',
      uploadedOn: '—',
      status: 'Not Uploaded',
    },
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h2 className="flex items-center gap-2 text-xl font-semibold">
          <FiFolder />
          Documents
        </h2>
        <p className="text-sm text-text-secondary mt-1">
          View and manage your employment-related documents
        </p>
      </div>

      {/* Empty State */}
      {documents.length === 0 ? (
        <div className="bg-white border rounded-xl p-6 text-sm text-text-muted text-center">
          No documents available.
        </div>
      ) : (
        <div className="bg-white border rounded-xl overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-muted text-text-secondary">
              <tr>
                <th className="px-6 py-3 text-left">Document</th>
                <th className="px-6 py-3 text-left">Type</th>
                <th className="px-6 py-3 text-left">Uploaded On</th>
                <th className="px-6 py-3 text-left">Status</th>
                <th className="px-6 py-3 text-right">Actions</th>
              </tr>
            </thead>

            <tbody>
              {documents.map((doc) => (
                <tr
                  key={doc.id}
                  className="border-t hover:bg-gray-50 transition-colors"
                >
                  <td className="px-6 py-4 flex items-center gap-2">
                    <FiFileText className="text-text-muted" />
                    <div>
                      <p className="font-medium">{doc.name}</p>
                      <p className="text-xs text-text-muted">
                        ID: {doc.id}
                      </p>
                    </div>
                  </td>

                  <td className="px-6 py-4">
                    {doc.type}
                  </td>

                  <td className="px-6 py-4">
                    {doc.uploadedOn}
                  </td>

                  <td className="px-6 py-4">
                    <StatusBadge status={doc.status} />
                  </td>

                  <td className="px-6 py-4 text-right">
                    <div className="flex justify-end gap-3">
                      <button
                        className="flex items-center gap-1 text-primary hover:underline text-sm font-medium"
                        disabled={doc.status !== 'Available'}
                      >
                        <FiEye size={16} />
                        View
                      </button>

                      <button
                        className="flex items-center gap-1 text-text-muted cursor-not-allowed text-sm font-medium"
                        disabled
                      >
                        <FiDownload size={16} />
                        Download
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

/* ================= Helper ================= */

function StatusBadge({ status }) {
  const base =
    'inline-block px-2 py-0.5 rounded-full text-xs font-medium';

  if (status === 'Available') {
    return (
      <span className={`${base} bg-success/10 text-success`}>
        Available
      </span>
    );
  }

  if (status === 'Pending Verification') {
    return (
      <span className={`${base} bg-warning/10 text-warning`}>
        Pending
      </span>
    );
  }

  return (
    <span className={`${base} bg-gray-200 text-gray-600`}>
      Not Uploaded
    </span>
  );
}
