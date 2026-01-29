import {
  FiTrendingUp,
  FiDollarSign,
  FiMinusCircle,
  FiFileText,
} from 'react-icons/fi';

const ICONS = {
  green: <FiTrendingUp className="text-success" />,
  primary: <FiDollarSign className="text-primary" />,
  red: <FiMinusCircle className="text-danger" />,
  orange: <FiFileText className="text-warning" />,
};

const accentStyles = {
  green: 'border-l-success',
  red: 'border-l-danger',
  primary: 'border-l-primary',
  orange: 'border-l-warning',
};

export default function KpiCard({ title, value, subtitle, accent }) {
  return (
    <div className="bg-white border border-gray-200 rounded-xl p-5 shadow-sm hover:shadow-md transition-shadow">
      <div className={`flex items-start gap-4 border-l-4 pl-4 ${accentStyles[accent]}`}>
        <div className="text-xl mt-1">
          {ICONS[accent]}
        </div>

        <div>
          <p className="text-sm text-text-secondary">{title}</p>
          <p className="text-2xl font-semibold text-text-primary mt-1">
            {value}
          </p>
          {subtitle && (
            <p className="text-xs text-text-muted mt-1">{subtitle}</p>
          )}
        </div>
      </div>
    </div>
  );
}
