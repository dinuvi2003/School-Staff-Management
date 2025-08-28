'use client';
import React from 'react';

export default function DetailsTable ({ rows = [] }) {
  return (
    <section className="mx-auto max-w-6xl px-4">
      <div className="flex flex-wrap items-center gap-3 py-4">
        {/* Service Type */}
        <div className="relative">
          <select
            className="w-56 rounded-md border border-gray-300 bg-white px-3 py-2 text-sm"
            defaultValue=""
            aria-label="Service Type"
          >
            <option value="">Service Type</option>
            <option value="Principal Service">Principal Service</option>
            <option value="Teacher Service">Teacher Service</option>
          </select>
        </div>

        {/* Grade */}
        <div className="relative">
          <select
            className="w-40 rounded-md border border-gray-300 bg-white px-3 py-2 text-sm"
            defaultValue=""
            aria-label="Grade"
          >
            <option value="">Grade</option>
            <option value="3iA">3iA</option>
            <option value="2ii">2ii</option>
            <option value="2i">2i</option>
            <option value="i">i</option>
            <option value="ii">ii</option>
            <option value="iii">iii</option>
          </select>
        </div>

        {/* Search */}
        <div className="ml-auto relative">
          <input
            placeholder="Search"
            className="w-56 rounded-md border border-gray-300 bg-white pl-9 pr-3 py-2 text-sm"
            aria-label="Search"
          />
          <span className="pointer-events-none absolute left-2 top-1/2 -translate-y-1/2 text-gray-400">
            🔍
          </span>
        </div>
      </div>

      {/* Table */}
      <div className="overflow-x-auto rounded-lg border bg-white">
        <table className="min-w-full text-sm">
          <thead className="bg-indigo-50/60 text-gray-700">
            <tr>
              <Th>Teacher Name</Th>
              <Th>NIC</Th>
              <Th>Grade</Th>
              <Th center>View</Th>
              <Th center>Edit</Th>
              <Th center>Delete</Th>
            </tr>
          </thead>

          <tbody>
            {rows.length > 0 ? (
              rows.map((r, idx) => (
                <tr key={r.id ?? idx} className={idx % 2 ? "bg-white" : "bg-gray-50/30"}>
                  <Td>{r.name}</Td>
                  <Td>{r.nic}</Td>
                  <Td>{r.grade}</Td>
                  <Td center>
                    <GhostIcon>👁️</GhostIcon>
                  </Td>
                  <Td center>
                    <GhostIcon>✏️</GhostIcon>
                  </Td>
                  <Td center>
                    <GhostIcon>🗑️</GhostIcon>
                  </Td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={6} className="p-8 text-center text-gray-500">
                  No data yet.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      
    </section>
  );
}

function Th({ children, center = false }) {
  return (
    <th className={`px-4 py-3 font-semibold ${center ? "text-center" : "text-left"}`}>{children}</th>
  );
}
function Td({ children, center = false }) {
  return (
    <td className={`px-4 py-3 ${center ? "text-center" : "text-left"} text-gray-700`}>{children}</td>
  );
}
function GhostIcon({ children }) {
  return (
    <span className="inline-flex h-8 w-8 items-center justify-center rounded-md border border-transparent text-gray-600">
      {children}
    </span>
  );
}
  
