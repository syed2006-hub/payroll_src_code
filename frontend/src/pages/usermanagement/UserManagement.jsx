import { useNavigate, useSearchParams } from "react-router-dom";
import AddEmployee from "./AddEmployee";
import EmployeeList from "./EmployeeList";  

const UserManagement = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  const operation = searchParams.get("operation") || "list";



 

  return (
    <div className="flex flex-col h-screen bg-gray-50">
      {/* MAIN CONTENT AREA */}
      <main className="flex-1 overflow-auto">
        {operation === "add" && <AddEmployee />}
        {operation === "list" && <EmployeeList />}
      </main>
      
    </div>
  );
};

export default UserManagement;