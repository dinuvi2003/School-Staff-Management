'use client';
import React from 'react'

export default function AdminNav ({ active = "teachers", onChange }) {
    const tabs = [
    { key: "teachers", label: "Teacher Details" },
    { key: "leave", label: "Leave Requests" },
    { key: "transfers", label: "Transfers & Promotions" },
  ];
  return (
    <nav className="w-full border-b bg-indigo-50/50">
      <div className="mx-auto max-w-6xl px-4">
        <ul className="flex gap-6">
          {tabs.map((t) => {
            const isActive = active === t.key;
            return (
              <li key={t.key}>
                <button
                  className={`relative -mb-px border-b-2 px-2 py-3 text-sm ${
                    isActive
                      ? "border-indigo-500 font-medium text-indigo-700"
                      : "border-transparent text-gray-600 hover:text-gray-800"
                  }`}
                  onClick={() => onChange?.(t.key)}
                >
                  {t.label}
                </button>
              </li>
            );
          })}
        </ul>
      </div>
    </nav>
  )
}
