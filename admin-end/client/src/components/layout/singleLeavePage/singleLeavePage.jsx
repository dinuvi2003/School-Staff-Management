'use client'; // This makes it a Client Component for interactivity

import { useState, useEffect, use } from 'react';
import { useParams } from 'next/navigation';

export default function LeaveDetails() {
    const [leave, setLeave] = useState(null); // Current leave details
    const [pastLeaves, setPastLeaves] = useState(null); // Past leave history
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const params = useParams();
    const { leaveid, uid } = params;

    useEffect(() => {
        const fetchLeaveDetails = async () => {
            try {
                setLoading(true);

                if (leaveid) {
                    const leaveDetails = await fetch(`${process.env.NEXT_PUBLIC_API_BASE}/api/leave/with-teacher/${leaveid}`, {
                        method: 'GET',
                        credentials: 'include',
                    });
                    const data = await leaveDetails.json();
                    setLeave(data.data.leave);
                }


                if (uid) {
                    const pastResponse = await fetch(`${process.env.NEXT_PUBLIC_API_BASE}/api/leave/leave-history/${uid}`, {
                        method: 'GET',
                        credentials: 'include',
                    });
                    const pastData = await pastResponse.json();
                    setPastLeaves(pastData.data);
                }

                setLoading(false);
            } catch (err) {
                setError(err.message || 'Failed to load details');
                setLoading(false);
            }
        };
        fetchLeaveDetails();
    }, [params]);

    const handleApprove = async () => {
        // Placeholder: Backend call to approve
        // try {
        //   await fetch(`${process.env.NEXT_PUBLIC_API_BASE}/api/leave/${leaveId}/approve`, {
        //     method: 'POST',
        //     credentials: 'include',
        //   });
        //   // Update UI or redirect
        // } catch (err) {
        //   console.error('Approve error:', err);
        // }
        alert('Approved!'); // Temp feedback
    };

    const handleReject = async () => {
        // Placeholder: Backend call to reject
        // try {
        //   await fetch(`${process.env.NEXT_PUBLIC_API_BASE}/api/leave/${leaveId}/reject`, {
        //     method: 'POST',
        //     credentials: 'include',
        //   });
        //   // Update UI or redirect
        // } catch (err) {
        //   console.error('Reject error:', err);
        // }
        alert('Rejected!'); // Temp feedback
    };

    const handleDownload = async () => {
        // Placeholder: Backend call or client-side download
        // e.g., Generate PDF or CSV of history
        alert('Downloading history...'); // Temp feedback
    };

    if (loading) {
        return <div className="min-h-screen bg-blue-50 p-8 flex items-center justify-center"><p className="text-blue-600 text-lg">Loading details...</p></div>;
    }

    if (error) {
        return <div className="min-h-screen bg-blue-50 p-8 flex items-center justify-center"><div className="text-red-600 text-center"><p className="text-lg font-semibold">{error}</p></div></div>;
    }

    if (!leave || !pastLeaves) {
        return <div className="min-h-screen bg-blue-50 p-8 flex items-center justify-center"><p className="text-gray-600 text-lg">No data found.</p></div>;
    }

    return (
        <div className="min-h-screen bg-blue-50 p-8">
            <h1 className="text-3xl font-bold text-blue-600 mb-6">Leave Details for {leave.teacher_full_name}</h1>

            {/* Section 1: General Teacher and Current Leave Details */}
            <div className="bg-white p-6 rounded-lg shadow mb-8">
                <h2 className="text-2xl font-semibold text-blue-600 mb-4">Teacher Information</h2>
                <div className="grid grid-cols-2 gap-4">
                    <p className='text-black'><strong>Name:</strong> {leave.teacher_full_name}</p>
                    <p className='text-black'><strong>NIC:</strong> {leave.teacher_nic}</p>
                    <p className='text-black'><strong>Email:</strong> {leave.teacher_email}</p>
                    <p className='text-black'><strong>Contact No:</strong> {leave.teacher_contact_number}</p>
                </div>

                <h2 className="text-2xl font-semibold text-blue-600 mt-6 mb-4">Current Leave Details</h2>
                <div className="grid grid-cols-2 gap-4">
                    <p className='text-black'><strong>Type:</strong> {leave.leave_type}</p>
                    <p className='text-black'><strong>Applied Date:</strong> {leave.leave_apply_date}</p>
                    <p className='text-black'><strong>Arrival Date:</strong> {leave.arrival_date}</p>
                    <p className='text-black'><strong>Day Count:</strong> {leave.leave_day_count}</p>
                </div>

                {/* Status Badge and Actions for Current Leave */}
                <div className="mt-4 flex items-center space-x-4">
                    <span className={`px-3 py-1 rounded-full text-sm font-medium ${leave.leave_status === 'PENDING' ? 'bg-yellow-200 text-yellow-800' :
                        leave.leave_status === 'APPROVED' ? 'bg-green-200 text-green-800' :
                            leave.leave_status === 'REJECTED' ? 'bg-red-200 text-red-800' :
                                leave.leave_status === 'CANCELLED' ? 'bg-gray-200 text-black' :
                                    leave.leave_status === 'ACTIVE' ? 'bg-blue-200 text-blue-800' : 'bg-gray-200 text-black'
                        }`}>
                        {leave.leave_status}
                    </span>
                    {leave.leave_status === 'PENDING' && (
                        <div className="flex space-x-2">
                            <button onClick={handleApprove} className="bg-green-500 text-white px-4 py-2 rounded-md hover:bg-green-600">
                                Approve
                            </button>
                            <button onClick={handleReject} className="bg-red-500 text-white px-4 py-2 rounded-md hover:bg-red-600">
                                Reject
                            </button>
                        </div>
                    )}
                </div>
            </div>

            {/* Section 2: Leave History Stats (Flexed) */}
            <div className="bg-white p-6 rounded-lg shadow mb-8">
                <h2 className="text-2xl font-semibold text-blue-600 mb-4">Leave History Summary</h2>
                <div className="flex flex-wrap justify-around gap-4">
                    <div className="bg-blue-100 p-4 rounded-md text-center w-32">
                        <p className="text-lg font-bold text-black">{pastLeaves.total_leaves}</p>
                        <p className="text-sm text-black">Total Leaves</p>
                    </div>
                    <div className="bg-red-100 p-4 rounded-md text-center w-32">
                        <p className="text-lg font-bold text-black">{pastLeaves.rejected_leaves}</p>
                        <p className="text-sm text-black">Rejected</p>
                    </div>
                    <div className="bg-green-100 p-4 rounded-md text-center w-32">
                        <p className="text-lg font-bold text-black">{pastLeaves.active_leaves}</p>
                        <p className="text-sm text-black">Approved</p>
                    </div>
                    <div className="bg-gray-100 p-4 rounded-md text-center w-32">
                        <p className="text-lg font-bold">{pastLeaves.cancelled_leaves}</p>
                        <p className="text-sm text-black">Cancelled</p>
                    </div>
                    <div className="bg-blue-100 p-4 rounded-md text-center w-32">
                        <p className="text-lg font-bold text-black">{pastLeaves.active_leaves}</p>
                        <p className="text-sm text-gray-700">Active</p>
                    </div>
                </div>
                <button onClick={handleDownload} className="mt-4 bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600">
                    Download History
                </button>
            </div>

        </div>
    );
}