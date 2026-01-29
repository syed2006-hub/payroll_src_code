import { AuthContext } from "../../context/AuthContext"; 
import { useContext } from "react";
import { FiHome } from 'react-icons/fi';

export default function Header({ title }) {
const { user } = useContext(AuthContext);

  return (
    <header className="h-16 bg-white border-b border-gray-200 flex items-center justify-between px-6">
      <h1 className="flex items-center gap-2 text-lg font-semibold text-primary">
        <FiHome size={18} />
        {title}
      </h1>

      <div className="flex items-center gap-4">
        <div className="text-right">
          <p className="text-xs text-gray-500">{user?.role}</p>
        </div>
      </div>
    </header>
  );
}
