'use client'; // This makes it a Client Component for interactivity

import { useState, useEffect, useMemo } from 'react';
import Link from 'next/link';

export default function PendingLeaveRequests() {
    const [leaves, setLeaves] = useState([]);
    const [error, setError] = useState(null);
    const [loading, setLoading] = useState(true);
    const [currentPage, setCurrentPage] = useState(1);
    const rowPerPage = 10;
    const [searchTerm, setSearchTerm] = useState(''); // Search state
    const [filterType, setFilterType] = useState('All'); // Filter by leave type
    const [filterStatus, setFilterStatus] = useState('All'); // Filter by leave status
    const [sortBy, setSortBy] = useState('date-desc'); // Sort state

    // Fetch data
    useEffect(() => {
        const fetchAllLeaves = async () => {
            try {
                setLoading(true);
                const response = await fetch(`${process.env.NEXT_PUBLIC_API_BASE}/api/leave`, {
                    method: 'GET',
                    credentials: 'include',
                });

                const data = await response.json();
                console.log('all details', data);
                if (!data.ok && !data?.data?.leaves) {
                    throw new Error('Failed to fetch leave requests');
                }
                setLeaves(data.data.leaves);
                setLoading(false);
            } catch (error) {
                setLeaves([]);
                setError(error);
                setLoading(false);
                console.error('Error fetching leave requests:', error);
            }
        };
        fetchAllLeaves();
    }, []);

    // Reset page on search, filter, or sort change
    useEffect(() => {
        setCurrentPage(1);
    }, [searchTerm, filterType, filterStatus, sortBy]);

    // Filtering logic with useMemo
    const filteredLeaves = useMemo(() => {
        return leaves.filter(leave => {
            const matchesSearch = (
                leave.teacher_full_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                leave.teacher_nic.toLowerCase().includes(searchTerm.toLowerCase()) ||
                leave.leave_type.toLowerCase().includes(searchTerm.toLowerCase()) ||
                (leave.teacher_email && leave.teacher_email.toLowerCase().includes(searchTerm.toLowerCase()))
            );
            const matchesType = filterType === 'All' || leave.leave_type === filterType;
            const matchesStatus = filterStatus === 'All' || leave.leave_status === filterStatus;
            return matchesSearch && matchesType && matchesStatus;
        });
    }, [leaves, searchTerm, filterType, filterStatus]);

    // Sorting logic with useMemo
    const sortedLeaves = useMemo(() => {
        let sorted = [...filteredLeaves];
        if (sortBy === 'date-desc') {
            sorted.sort((a, b) => new Date(b.leave_apply_date) - new Date(a.leave_apply_date));
        } else if (sortBy === 'date-asc') {
            sorted.sort((a, b) => new Date(a.leave_apply_date) - new Date(b.leave_apply_date));
        } else if (sortBy === 'count-desc') {
            sorted.sort((a, b) => b.leave_day_count - a.leave_day_count);
        } else if (sortBy === 'count-asc') {
            sorted.sort((a, b) => a.leave_day_count - b.leave_day_count);
        }
        return sorted;
    }, [filteredLeaves, sortBy]);

    // Pagination logic
    const indexOfLastRow = currentPage * rowPerPage;
    const indexOfFirstRow = indexOfLastRow - rowPerPage;
    const paginatedLeaves = sortedLeaves.slice(indexOfFirstRow, indexOfLastRow);
    const totalPages = Math.ceil(sortedLeaves.length / rowPerPage);

    // Render
    if (loading) {
        return (
            <div className="min-h-screen bg-blue-50 p-8 flex items-center justify-center">
                <p className="text-blue-600 text-lg">Loading leave requests...</p>
            </div>
        );
    }

    if (error) {
        return (
            <div className="min-h-screen bg-blue-50 p-8 flex items-center justify-center">
                <div className="text-red-600 text-center">
                    <p className="text-lg font-semibold">{error.message}</p>
                    <button
                        onClick={() => window.location.reload()}
                        className="mt-4 bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600"
                    >
                        Try Again
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-blue-50 p-8">
            <h1 className="text-3xl font-bold text-blue-600 mb-6">Pending Leave Requests</h1>
            <div className="mb-4 flex space-x-4">
                <input
                    type="text"
                    placeholder="Search by name, NIC, type, or email..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="p-2 border border-gray-300 text-black rounded-md w-64"
                />
                <select
                    value={filterType}
                    onChange={(e) => setFilterType(e.target.value)}
                    className="p-2 border border-gray-300 text-black rounded-md"
                >
                    <option value="All">All Leave Types</option>
                    <option value="CASUAL">Casual</option>
                    <option value="SICK">Sick</option>
                    <option value="ANNUAL">Annual</option>
                    {/* Add more types as per your API data */}
                </select>
                <select
                    value={filterStatus}
                    onChange={(e) => setFilterStatus(e.target.value)}
                    className="p-2 border border-gray-300 text-black rounded-md"
                >
                    <option value="All">All Statuses</option>
                    <option value="PENDING">Pending</option>
                    <option value="APPROVED">Approved</option>
                    <option value="REJECTED">Rejected</option>
                    {/* Add more statuses as per your API data */}
                </select>
                <select
                    value={sortBy}
                    onChange={(e) => setSortBy(e.target.value)}
                    className="p-2 border border-gray-300 text-black rounded-md"
                >
                    <option value="date-desc">Newest Applied First</option>
                    <option value="date-asc">Oldest Applied First</option>
                    <option value="count-desc">Most Days First</option>
                    <option value="count-asc">Fewest Days First</option>
                </select>
            </div>
            <div className="overflow-x-auto">
                <table className="min-w-full bg-white border border-gray-200 rounded-lg shadow">
                    <thead className="bg-blue-100">
                        <tr>
                            <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">Teacher Name</th>
                            <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">NIC</th>
                            <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">Leave Type</th>
                            <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">Day Count</th>
                            <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">Arrival Date</th>
                            <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">Applied Date</th>
                            <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">Leave Status</th>
                            <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">Action</th>
                        </tr>
                    </thead>
                    <tbody>
                        {paginatedLeaves.length === 0 ? (
                            <tr>
                                <td colSpan="7" className="px-6 py-4 text-center text-gray-500">
                                    {sortedLeaves.length === 0 && leaves.length > 0 ? 'No matching requests.' : 'No pending leave requests.'}
                                </td>
                            </tr>
                        ) : (
                            paginatedLeaves.map((leave) => (
                                <tr key={leave.leave_id} className="border-t">
                                    <td className="px-6 py-4 text-sm text-gray-900">{leave.teacher_full_name}</td>
                                    <td className="px-6 py-4 text-sm text-gray-900">{leave.teacher_nic}</td>
                                    <td className="px-6 py-4 text-sm text-gray-900">{leave.leave_type}</td>
                                    <td className="px-6 py-4 text-sm text-gray-900">{leave.leave_day_count}</td>
                                    <td className="px-6 py-4 text-sm text-gray-900">{leave.arrival_date}</td>
                                    <td className="px-6 py-4 text-sm text-gray-900">{leave.leave_apply_date}</td>
                                    <td className="px-6 py-4 text-sm text-gray-900">{leave.leave_status}</td>
                                    <td className="px-6 py-4">
                                        <Link href={`/all-leaves/${leave.leave_id}/${leave.teacher_user_id}`}>
                                            <button className="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600">
                                                View Details
                                            </button>
                                        </Link>
                                    </td>
                                </tr>
                            ))
                        )}
                    </tbody>
                </table>

                <div className="flex justify-center mt-4">
                    <button
                        onClick={() => setCurrentPage(currentPage - 1)}
                        disabled={currentPage === 1}
                        className="bg-blue-500 text-white px-4 py-2 rounded-md mr-2 hover:bg-blue-600 disabled:bg-gray-400 disabled:cursor-not-allowed"
                    >
                        Previous
                    </button>

                    {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                        <button
                            key={page}
                            onClick={() => setCurrentPage(page)}
                            className={`px-3 py-1 rounded-md mx-1 ${currentPage === page ? 'bg-blue-600 text-white' : 'bg-gray-200 text-gray-700'}`}
                        >
                            {page}
                        </button>
                    ))}

                    <button
                        onClick={() => setCurrentPage(currentPage + 1)}
                        disabled={currentPage === totalPages}
                        className="bg-blue-500 text-white px-4 py-2 rounded-md ml-2 hover:bg-blue-600 disabled:bg-gray-400 disabled:cursor-not-allowed"
                    >
                        Next
                    </button>
                </div>
            </div>
        </div>
    );
}