// src/payroll_component/components/Header.jsx
import React from "react";

export default function Header({ title }) {
  return (
    <header className="w-full border-b bg-white p-4 shadow-sm flex items-center">
      <h1 className="text-2xl font-semibold text-gray-700">{title}</h1>
    </header>
  );
}
