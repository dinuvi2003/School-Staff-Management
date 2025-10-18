'use client';
import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';


export default function DetailsTable() {
  const [rows, setRows] = useState([]);
  const [loading, setLoading] = useState(true);
  const [err, setErr] = useState('');
  const router = useRouter();
  const [currentPage, setCurrentPage] = useState(1);
  const rowPerPage = 10;

  const indexOfLastRow = currentPage * rowPerPage;
  const indexOfFirstRow = indexOfLastRow - rowPerPage;
  const PaginationRow = rows.slice(indexOfFirstRow, indexOfLastRow);
  const totalpage = Math.ceil(rows.length / rowPerPage);

  useEffect(() => {

    console.log("pagination", PaginationRow);
    (async () => {
      try {
        const res = await fetch(
          `${process.env.NEXT_PUBLIC_API_BASE}/api/teacher`,
          { method: 'GET', credentials: 'include' }
        );
        const json = await res.json();
        if (!res.ok) {
          throw new Error(json?.errors?.message || 'Failed to fetch teacher details');
        }

        console.log("teacher", json?.data?.teachers)
        // API shape: { ok, message, data: { teachers: [...] } }
        setRows(json?.data?.teachers || []);
      } catch (e) {
        setErr(e?.message || 'Failed to fetch teacher details');
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  async function handleDelete(user_id) {
    if (!confirm('Are you sure you want to delete this teacher?')) return;
    try {
      // TODO: replace with your real delete endpoint
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_BASE}/api/teacher/${encodeURIComponent(user_id)}`,
        { method: 'DELETE', credentials: 'include' }
      );
      if (!res.ok) {
        const j = await res.json().catch(() => ({}));
        throw new Error(j?.errors?.message || 'Failed to delete teacher');
      }
      setRows(prev => prev.filter(r => r.user_id !== user_id));
    } catch (e) {
      alert(e.message || 'Failed to delete teacher');
    }
  }

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
      <div className="overflow-x-auto" >
        <div className=" rounded-lg border bg-white">
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
                {PaginationRow.length > 0 ? (
                  PaginationRow.map((r, idx) => (
                    <tr key={r.id ?? idx} className={idx % 2 ? "bg-white" : "bg-gray-50/30"}>
                      <Td>{r.teacher_full_name}</Td>
                      <Td>{r.teacher_nic}</Td>
                      <Td>{r.service_type}</Td>
                      <Td>{r.teacher_grade}</Td>
                      <Td center>
                        <div className="flex items-center justify-center gap-2">
                          <Link href={`TeacherDetailsSinglePage/${r.teacher_nic}`}><GhostIcon title="View" >👁️</GhostIcon></Link>
                          <GhostIcon title="Edit">✏️</GhostIcon>
                          <GhostIcon title="Delete" onClick={() => handleDelete(r.techer_nic)}>🗑️</GhostIcon>
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

        {loading || err ? null : PaginationRow.length > 0 && (
          <div className="flex justify-center mt-4">
            <button
              onClick={() => setCurrentPage(currentPage - 1)}
              disabled={currentPage === 1}
              className="bg-blue-500 text-white px-4 py-2 rounded-md mr-2 hover:bg-blue-600 disabled:bg-gray-400 disabled:cursor-not-allowed"
            >
              Previous
            </button>

            {Array.from({ length: totalpage }, (_, i) => i + 1).map(page => (
              <button
                key={page}
                onClick={() => setCurrentPage(page)}
                className={`px-3 py-1 rounded-md mx-1 ${currentPage === page ? ' bg-blue-600  text-white' : ' bg-gray-200  text-gray-700'}`}
              >
                {page}
              </button>
            ))}

            <button
              onClick={() => setCurrentPage(currentPage + 1)}
              disabled={currentPage === totalpage}
              className="bg-blue-500 text-white px-4 py-2 rounded-md ml-2 hover:bg-blue-600 disabled:bg-gray-400 disabled:cursor-not-allowed"
            >
              Next
            </button>
          </div>
        )}

      </div>
    </section >
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
