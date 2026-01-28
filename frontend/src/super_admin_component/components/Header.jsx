import { useNavigate, useSearchParams } from "react-router-dom";

export default function Header({ title }) {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  const operation = searchParams.get("operation") || "view";
  const section = searchParams.get("section") || "default";
  const showAddButton = section === "users" && ["list", "view"].includes(operation);

  const goToAdd = (section = "users") => {
    navigate(`/superadmin?section=${section}&operation=add`);
  };

  return (
    <header className="h-16 bg-white border-b flex items-center justify-between px-6 shadow-sm">
      
      {/* LEFT: Title */}
      <h1 className="text-xl font-semibold">{title}</h1>

      {/* RIGHT: Add Button + Notification */}
      <div className="flex items-center gap-4 ml-auto">
        {showAddButton && (
          <button
            onClick={() => goToAdd("users")}
            className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md text-sm font-medium flex items-center gap-2 shadow-sm transition-all"
          >
            <span className="text-lg leading-none">+</span> Add Employee
          </button>
        )}

        {/* Notification Button */}
        <button className="relative bg-gray-100 hover:bg-gray-200 p-2 rounded-full flex items-center justify-center transition-all">
          <svg
            className="w-5 h-5 text-gray-600"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6 6 0 10-12 0v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9"
            />
          </svg>
          {/* Optional badge */}
          <span className="absolute top-0 right-0 inline-flex items-center justify-center w-2 h-2 bg-red-600 rounded-full" />
        </button>
      </div> 
    </header>
  );
}
