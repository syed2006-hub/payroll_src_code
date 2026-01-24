import { useNavigate, useSearchParams } from "react-router-dom";
import AddEmployee from "./AddEmployee";
import EmployeeList from "./EmployeeList"; 

const UserManagement = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  const operation = searchParams.get("operation") || "list";
  const id = searchParams.get("id");

  const goToAdd = () => {
    navigate("/superadmin?section=users&operation=add");
  };

  const goToList = () => {
    navigate("/superadmin?section=users&operation=list");
  };

  return (
    <div className="p-8">
      {/* HEADER */}
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Employees</h1>

        {operation === "list" && (
          <button
            onClick={goToAdd}
            className="bg-blue-600 text-white px-5 py-2 rounded"
          >
            + Add Employee
          </button>
        )}
      </div>

      {/* CONTENT SWITCH */}
      {operation === "add" && <AddEmployee onCancel={goToList} />}
 

      {operation === "list" && <EmployeeList />}
    </div>
  );
};

export default UserManagement;
