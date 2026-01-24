import { createContext, useContext, useState } from "react";

const EmployeeFormContext = createContext();

export const EmployeeFormProvider = ({ children }) => {
  const [employee, setEmployee] = useState({
    basic: {},
    salary: {},
    personal: {},
    payment: {}
  });

  const update = (section, data) => {
    setEmployee(prev => ({
      ...prev,
      [section]: { ...prev[section], ...data }
    }));
  };

  return (
    <EmployeeFormContext.Provider value={{ employee, update }}>
      {children}
    </EmployeeFormContext.Provider>
  );
};

export const useEmployeeForm = () => useContext(EmployeeFormContext);
