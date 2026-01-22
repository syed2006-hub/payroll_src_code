export default function Header({ title }) {
  return (
    <header className="h-16 bg-white border-b flex items-center justify-between px-6 shadow-sm">
      <h1 className="text-xl font-semibold">{title}</h1>

      <div className="flex items-center gap-4">
        <div className="text-right">
          <p className="text-sm font-medium">John Doe</p>
          <p className="text-xs text-gray-500">Software Engineer</p>
        </div>

        <div className="h-10 w-10 rounded-full bg-blue-500 text-white flex items-center justify-center font-bold">
          JD
        </div>
      </div>
    </header>
  );
}
