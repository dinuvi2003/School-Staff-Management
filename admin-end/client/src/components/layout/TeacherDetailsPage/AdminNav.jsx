'use client';
import Link from 'next/link';
import React from 'react'

export default function AdminNav({ active = "teachers", onChange }) {
  const tabs = [
    { key: "teachers", label: "Teacher Details", url: "/admin-dashboard" },
    { key: "leave", label: "Leave Requests", url: "#" },
    { key: "transfers", label: "Transfers & Promotions", url: "#" },
    { key: "new-teacher", label: "Add Teacher", url: "/AddTeacher" },
  ];
  return (
    <nav className="w-full border-b bg-indigo-50/50">
      <div className="mx-auto max-w-6xl px-4">
        <ul className="flex gap-6">
          {tabs.map((t, index) => {
            const isActive = active === t.key;
            return (
              <Link href={t.url} key={index}>
                <li id={t.id}>
                  <button
                    className={`relative -mb-px border-b-2 px-2 py-3 text-sm ${isActive
                      ? "border-indigo-500 font-medium text-indigo-700"
                      : "border-transparent text-gray-600 hover:text-gray-800"
                      }`}
                    onClick={() => onChange?.(t.id)}
                  >
                    {t.label}
                  </button>
                </li>
              </Link>
            );
          })}
        </ul>
      </div>
    </nav>
  )
}
