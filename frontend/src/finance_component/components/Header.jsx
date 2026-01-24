import { AuthContext } from "../../context/AuthContext"; 
import { useContext } from "react";
export default function Header({ title }) {
const { user } = useContext(AuthContext);

  return (
    <header className="h-16 bg-white border-b flex items-center justify-between px-6 shadow-sm">
      <h1 className="text-xl font-semibold">{title}</h1>

      <div className="flex items-center gap-4">
        <div className="text-right">
          <p className="text-sm font-medium">{user?.name}</p>
          <p className="text-xs text-gray-500">{user?.role}</p>
        </div>

        <div className="h-10 w-10 rounded-full bg-blue-500 text-white flex items-center justify-center font-bold">
          {user?.name
            ?.split(' ')
            .map(word => word[0].toUpperCase())
            .join('')
          }
        </div>
      </div>
    </header>
  );
}
