import { useEmployeeForm } from "../context/EmployeeFormContext";
const PersonalDetails = ({ onNext, onBack }) => {
  const { update } = useEmployeeForm();

  return (
    <div className="space-y-6 max-w-4xl mx-auto p-6">
      <div className="grid grid-cols-2 gap-4">
        <div className="flex flex-col"><label className="text-sm">Date of Birth*</label>
          <input type="date" className="border p-2 rounded" onChange={e => update("personal", { dob: e.target.value })} /></div>
        <div className="flex flex-col"><label className="text-sm">Age</label>
          <input disabled className="border p-2 rounded bg-gray-50" /></div>
        <div className="flex flex-col"><label className="text-sm">Father's Name*</label>
          <input className="border p-2 rounded" onChange={e => update("personal", { fatherName: e.target.value })} /></div>
        <div className="flex flex-col"><label className="text-sm">PAN</label>
          <input className="border p-2 rounded" placeholder="AAAAA0000A" onChange={e => update("personal", { pan: e.target.value })} /></div>
      </div>

      <div className="space-y-2">
        <label className="text-sm font-bold">Residential Address</label>
        <input className="border p-2 w-full rounded" placeholder="Address Line 1" onChange={e => update("personal", { addr1: e.target.value })} />
        <input className="border p-2 w-full rounded" placeholder="Address Line 2" />
        <div className="grid grid-cols-3 gap-4">
          <input className="border p-2 rounded" placeholder="City" />
          <select className="border p-2 rounded"><option>State</option></select>
          <input className="border p-2 rounded" placeholder="PIN Code" />
        </div>
      </div>

      <div className="flex gap-4">
        <button onClick={onBack} className="border px-6 py-2 rounded">Back</button>
        <button onClick={onNext} className="bg-blue-600 text-white px-6 py-2 rounded">Save and Continue</button>
      </div>
    </div>
  );
};

export default PersonalDetails;
