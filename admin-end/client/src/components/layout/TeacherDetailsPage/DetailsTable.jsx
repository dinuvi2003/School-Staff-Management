'use client';
import React, { useEffect, useState } from 'react';
import { api } from '@/lib/apiClient';
import { useRouter } from 'next/navigation';

export default function DetailsTable () {

  const [rows, setRows] = useState([]);
  const [loading, setLoading] = useState(true);
  const [err, setErr] = useState('');
  const router = useRouter();

  useEffect(() => {
    const fetchTeachers = async () => {
      try {
        const res = await api.get('/api/teachers'); 
        setRows(res.data?.data || []);
      } catch (e) {
        setErr(e?.response?.data?.message || 'Failed to fetch teacher details');
      } finally {
        setLoading(false);
      }
    };
    fetchTeachers();
  }, []);

  const handleDelete = async (id) => {
    if (!confirm('Are you sure you want to delete this teacher?')) return;

    try {
      await api.delete(`/api/teachers/${id}`);
      setRows((prev) => prev.filter((row) => row.id !== id));
    } catch (e) {
      alert(e?.response?.data?.message || 'Failed to delete teacher');
    }
  };

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
        {loading ? (
          <p className="p-6 text-center">Loading...</p>
        ) : err ? (
          <p className="p-6 text-center text-red-600">{err}</p>
        ) : (
        <table className="min-w-full text-sm">
          <thead className="bg-indigo-50/60 text-gray-700">
            <tr>
              <Th>Teacher Name</Th>
              <Th>NIC</Th>
              <Th>Service Type</Th>
              <Th>Grade</Th>
              <Th center>Actions</Th>
            </tr>
          </thead>

          <tbody>
            {rows.length > 0 ? (
              rows.map((r, idx) => (
                <tr key={r.id ?? idx} className={idx % 2 ? "bg-white" : "bg-gray-50/30"}>
                  <Td>{r.name}</Td>
                  <Td>{r.nic}</Td>
                  <Td>{r.serviceType}</Td>
                  <Td>{r.grade}</Td>
                  <Td center>
                    <div className="flex items-center justify-center gap-2">
                      <GhostIcon title="View" onClick={() => router.push(`/TeacherDetails/${r.id}`)}>👁️</GhostIcon>
                      <GhostIcon title="Edit">✏️</GhostIcon>
                      <GhostIcon title="Delete" onClick={() => handleDelete(r.id)}>🗑️</GhostIcon>
                    </div>
                  </Td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={5} className="p-8 text-center text-gray-500">
                  No data yet.
                </td>
              </tr>
            )}
          </tbody>
        </table>
        )}
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
  
