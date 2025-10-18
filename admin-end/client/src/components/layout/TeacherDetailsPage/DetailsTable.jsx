'use client';
import React, { useEffect, useMemo, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

function norm(v) {                                   
  return String(v ?? '').trim().toLowerCase();      
}                                                    
function normNic(v) {                                
  return norm(v).replace(/[^a-z0-9]/g, '');          
}                                                    
 
export default function DetailsTable() {
  const [rows, setRows] = useState([]);
  const [loading, setLoading] = useState(true);
  const [err, setErr] = useState('');
  const [serviceType, setServiceType] = useState('');
  const [grade, setGrade] = useState('');   
  const [search, setSearch] = useState('');
  const [searchDeb, setSearchDeb] = useState('');
  const [deletingId, setDeletingId] = useState(null); 
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

  const tokens = useMemo(() => norm(searchDeb).split(/\s+/).filter(Boolean), [searchDeb]);

  // const filteredRows = useMemo(() => {
  //   const s = norm(search);
  //   const st = norm(serviceType);
  //   const gr = norm(grade);

  //   return rows.filter((r) => {
  //     const rService = norm(r.service_type);
  //     const rGrade = norm(r.teacher_grade);

  //     const matchService = st ? rService.includes(st) : true;
  //     const matchGrade = gr ? rGrade.includes(gr) : true;
  //     const matchSearch = s
  //       ? [
  //           r.teacher_full_name,
  //           r.teacher_nic,
  //           r.service_type,
  //           r.teacher_grade,
  //         ]
  //           .filter(Boolean)
  //           .some((v) => norm(v).includes(s))
  //       : true;
  //     return matchService && matchGrade && matchSearch;
  //   });
  // }, [rows, serviceType, grade, search]);

  // function clearFilters() {
  //   setServiceType('');
  //   setGrade('');
  //   setSearch('');
  // }

  const filteredRows = useMemo(() => {
    const st = norm(serviceType);
    const gr = norm(grade);

    return rows.filter((r) => {
      const rName = norm(r.teacher_full_name);
      const rNic  = normNic(r.teacher_nic);
      const rSvc  = norm(r.service_type);
      const rGrd  = norm(r.teacher_grade);

      const matchService = st ? rSvc.includes(st) : true;
      const matchGrade   = gr ? rGrd.includes(gr) : true;

      // 🆕 all tokens must appear somewhere (AND across tokens, OR across fields)
      const matchTokens = tokens.length
        ? tokens.every((t) => rName.includes(t) || rSvc.includes(t) || rGrd.includes(t) || rNic.includes(t))
        : true;

      return matchService && matchGrade && matchTokens;
    });
  }, [rows, serviceType, grade, tokens]); // 🟩

  function clearFilters() {
    setServiceType('');
    setGrade('');
    setSearch('');
  }

  async function handleDelete(idOrNic) {
    const idToSend = idOrNic;
    if (!idToSend) {
      alert('Missing teacher identifier.');
      return;
    }
    const teacher = rows.find(r => (r.user_id ?? r.teacher_nic) === idToSend);
    const nameForConfirm = teacher?.teacher_full_name || idToSend;

    if (!confirm(`Delete ${nameForConfirm}? This cannot be undone.`)) return;

    try {
      setDeletingId(idToSend);
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_BASE}/api/teacher/${encodeURIComponent(idToSend)}`,
        { method: 'DELETE', credentials: 'include' }
      );
      const json = await res.json().catch(() => ({}));
      if (!res.ok) {
        throw new Error(json?.message || json?.error || 'Failed to delete teacher');
      }

      setRows(prev => prev.filter(r => (r.user_id ?? r.teacher_nic) !== idToSend));
    } catch (e) {
      alert(e.message || 'Failed to delete teacher');
    } finally {
      setDeletingId(null);
    }
  }

  return (
    <section className="mx-auto max-w-6xl px-4">
      <div className="flex flex-wrap items-center gap-3 py-4">
        {/* Service Type */}
        <div className="relative">
          <select
            className="w-56 rounded-md border border-gray-300 bg-white px-3 py-2 text-sm"
            aria-label="Service Type"
            value={serviceType}
            onChange={(e) => setServiceType(e.target.value)}
          >
            <option value="">Service Type</option>
            <option value="Principal">Principal</option>
            <option value="Teacher">Teacher</option>
          </select>
        </div>

        {/* Grade */}
        <div className="relative">
          <select
            className="w-40 rounded-md border border-gray-300 bg-white px-3 py-2 text-sm"
            aria-label="Grade"
            value={grade}
            onChange={(e) => setGrade(e.target.value)}
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
            value={search} 
            onChange={(e) => setSearch(e.target.value)}
          />
          <span className="pointer-events-none absolute left-2 top-1/2 -translate-y-1/2 text-gray-400">
            🔍
          </span>
          {search && (
            <button
              type="button"
              aria-label="Clear search"
              onClick={() => setSearch('')} 
              className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
            >
              ✕
            </button>
          )}
        </div>

        <button
          type="button"
          onClick={clearFilters}
          className="rounded-md border border-gray-300 bg-white px-3 py-2 text-sm text-gray-700 hover:bg-gray-50"
        >
          Clear
        </button>

        <span className="text-sm text-gray-500">
          Showing {filteredRows.length} / {rows.length}
        </span>
      
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
function GhostIcon({ children, title, onClick, disabled }) {
  return (
    <button
      type="button"
      title={title}
      onClick={onClick}
      disabled={disabled}
      className={`inline-flex h-8 w-8 items-center justify-center rounded-md border border-transparent text-gray-600 
                  ${disabled ? 'opacity-50 cursor-not-allowed' : 'hover:bg-gray-100'}`}
    >
      {children}
    </button>
  );
}

