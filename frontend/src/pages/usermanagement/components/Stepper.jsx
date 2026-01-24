const steps = ["Basic", "Salary", "Personal", "Payment"];

const Stepper = ({ currentStep }) => (
  <div className="flex justify-between mb-8">
    {steps.map((label, i) => (
      <div key={i} className="flex items-center gap-2">
        <div
          className={`w-8 h-8 rounded-full flex items-center justify-center text-sm
          ${i <= currentStep ? "bg-blue-600 text-white" : "bg-gray-300"}`}
        >
          {i + 1}
        </div>
        <span className="text-sm">{label}</span>
      </div>
    ))}
  </div>
);

export default Stepper;
