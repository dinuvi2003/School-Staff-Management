'use client'; // This makes it a Client Component for interactivity

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import AdminHeader from '@/components/layout/TeacherDetailsPage/AdminHeader';
import AdminNav from '@/components/layout/TeacherDetailsPage/AdminNav';
import { ArrowLeft } from 'lucide-react';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';

export default function LeaveDetails() {
    const [leave, setLeave] = useState(null); // Current leave details
    const [pastLeaves, setPastLeaves] = useState(null); // Past leave history
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [modalOpen, setModalOpen] = useState(false); // For PDF preview modal
    const [pdfUrl, setPdfUrl] = useState(null); // Blob URL for PDF preview
    const params = useParams();
    const { leaveid, uid } = params;
    const router = useRouter();

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
        try {
            await fetch(`${process.env.NEXT_PUBLIC_API_BASE}/api/leave/${leaveid}/approve`, {
                method: 'PATCH',
                credentials: 'include',
            });
            router.refresh();
        } catch (err) {
            console.error('Approve error:', err);
        }
        alert('Approved!'); // Temp feedback
    };

    const handleReject = async () => {
        try {
            await fetch(`${process.env.NEXT_PUBLIC_API_BASE}/api/leave/${leaveid}/reject`, {
                method: 'PATCH',
                credentials: 'include',
            });
            router.refresh();
        } catch (err) {
            console.error('Reject error:', err);
        }
        alert('Rejected!'); // Temp feedback
    };

    const generatePDF = () => {
        const doc = new jsPDF();

        // Professional Header
        doc.setFontSize(18);
        doc.setFont('helvetica', 'bold');
        doc.text(`Leave Details for ${leave.teacher_full_name}`, 20, 20);

        // Teacher Information Section
        doc.setFontSize(14);
        doc.setFont('helvetica', 'bold');
        doc.text('Teacher Information', 20, 40);
        doc.setFontSize(12);
        doc.setFont('helvetica', 'normal');
        doc.text(`Name: ${leave.teacher_full_name}`, 20, 50);
        doc.text(`NIC: ${leave.teacher_nic}`, 20, 60);
        doc.text(`Email: ${leave.teacher_email}`, 20, 70);
        doc.text(`Contact No: ${leave.teacher_contact_number}`, 20, 80);

        // Current Leave Details Section
        doc.setFontSize(14);
        doc.setFont('helvetica', 'bold');
        doc.text('Current Leave Details', 20, 100);
        doc.setFontSize(12);
        doc.setFont('helvetica', 'normal');
        doc.text(`Type: ${leave.leave_type}`, 20, 110);
        doc.text(`Applied Date: ${leave.leave_apply_date}`, 20, 120);
        doc.text(`Arrival Date: ${leave.arrival_date}`, 20, 130);
        doc.text(`Day Count: ${leave.leave_day_count}`, 20, 140);
        doc.text(`Status: ${leave.leave_status}`, 20, 150);

        // Leave History Summary Section
        doc.setFontSize(14);
        doc.setFont('helvetica', 'bold');
        doc.text('Leave History Summary', 20, 170);
        doc.setFontSize(12);
        doc.setFont('helvetica', 'normal');
        doc.text(`Total Leaves: ${pastLeaves.total_leaves}`, 20, 180);
        doc.text(`Rejected: ${pastLeaves.rejected_leaves}`, 20, 190);
        doc.text(`Approved: ${pastLeaves.approved_leaves}`, 20, 200);
        doc.text(`Cancelled: ${pastLeaves.cancelled_leaves}`, 20, 210);
        doc.text(`Active: ${pastLeaves.active_leaves}`, 20, 220);

        // Past Leave History Table
        doc.setFontSize(14);
        doc.setFont('helvetica', 'bold');
        doc.text('Past Leave History', 20, 240);

        // Use autoTable with correct data (assuming past_leaves is an array)
        if (pastLeaves.past_leaves && Array.isArray(pastLeaves.past_leaves)) {
            doc.autoTable({
                startY: 250,
                head: [['Type', 'Applied Date', 'Arrival Date', 'Day Count', 'Status']],
                body: pastLeaves.past_leaves.map(l => [
                    l.leave_type || 'N/A',
                    l.leave_apply_date || 'N/A',
                    l.arrival_date || 'N/A',
                    l.leave_day_count || 'N/A',
                    l.leave_status || 'N/A',
                ]),
                theme: 'grid',
                headStyles: { fillColor: [59, 130, 246] }, // Blue header
                styles: { fontSize: 10, cellPadding: 5 },
            });
        } else {
            doc.text('No past leave history available.', 20, 250);
        }

        // Return PDF as Blob for preview and download
        return doc.output('blob');
    };

    const handlePreviewAndDownload = () => {
        if (!leave || !pastLeaves) return;
        const pdfBlob = generatePDF();
        const url = URL.createObjectURL(pdfBlob);
        setPdfUrl(url);
        setModalOpen(true);
    };

    const handleDownloadPDF = () => {
        if (!leave || !pastLeaves) return;
        const pdfBlob = generatePDF();
        const downloadUrl = URL.createObjectURL(pdfBlob);
        const a = document.createElement('a');
        a.href = downloadUrl;
        a.download = `leave_details_${leave.teacher_full_name}_${new Date().toISOString().split('T')[0]}.pdf`;
        a.click();
        URL.revokeObjectURL(downloadUrl);
        setModalOpen(false); // Close modal after download
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
        <div className="min-h-screen bg-gray-100">
            <AdminHeader />
            <AdminNav active="leave" />

            <div className="min-h-screen bg-blue-50 p-8">
                <button onClick={() => router.back()}>
                    <span className="text-black">
                        <ArrowLeft size={18} color="black" />
                        Back
                    </span>
                </button>
                <h1 className="text-3xl font-bold text-blue-600 mb-6">Leave Details for {leave.teacher_full_name}</h1>

                {/* Section 1: General Teacher and Current Leave Details */}
                <div className="bg-white p-6 rounded-lg shadow mb-8">
                    <h2 className="text-2xl font-semibold text-blue-600 mb-4">Teacher Information</h2>
                    <div className="grid grid-cols-2 gap-4">
                        <p className="text-black"><strong>Name:</strong> {leave.teacher_full_name}</p>
                        <p className="text-black"><strong>NIC:</strong> {leave.teacher_nic}</p>
                        <p className="text-black"><strong>Email:</strong> {leave.teacher_email}</p>
                        <p className="text-black"><strong>Contact No:</strong> {leave.teacher_contact_number}</p>
                    </div>

                    <h2 className="text-2xl font-semibold text-blue-600 mt-6 mb-4">Current Leave Details</h2>
                    <div className="grid grid-cols-2 gap-4">
                        <p className="text-black"><strong>Type:</strong> {leave.leave_type}</p>
                        <p className="text-black"><strong>Applied Date:</strong> {leave.leave_apply_date}</p>
                        <p className="text-black"><strong>Arrival Date:</strong> {leave.arrival_date}</p>
                        <p className="text-black"><strong>Day Count:</strong> {leave.leave_day_count}</p>
                    </div>

                    {/* Status Badge and Actions for Current Leave */}
                    <div className="mt-4 flex items-center space-x-4">
                        <span
                            className={`px-3 py-1 rounded-full text-sm font-medium ${leave.leave_status === 'PENDING'
                                ? 'bg-yellow-200 text-yellow-800'
                                : leave.leave_status === 'APPROVED'
                                    ? 'bg-green-200 text-green-800'
                                    : leave.leave_status === 'REJECTED'
                                        ? 'bg-red-200 text-red-800'
                                        : leave.leave_status === 'CANCELLED'
                                            ? 'bg-gray-200 text-black'
                                            : leave.leave_status === 'ACTIVE'
                                                ? 'bg-blue-200 text-blue-800'
                                                : 'bg-gray-200 text-black'
                                }`}
                        >
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
                            <p className="text-lg font-bold text-black">{pastLeaves.approved_leaves}</p>
                            <p className="text-sm text-black">Approved</p>
                        </div>
                        <div className="bg-gray-100 p-4 rounded-md text-center w-32">
                            <p className="text-lg font-bold text-black">{pastLeaves.cancelled_leaves}</p>
                            <p className="text-sm text-black">Cancelled</p>
                        </div>
                        <div className="bg-blue-100 p-4 rounded-md text-center w-32">
                            <p className="text-lg font-bold text-black">{pastLeaves.active_leaves}</p>
                            <p className="text-sm text-black">Active</p>
                        </div>
                    </div>
                    <button onClick={handlePreviewAndDownload} className="mt-4 bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600">
                        Download History
                    </button>
                </div>

                {/* PDF Preview Modal */}
                {modalOpen && (
                    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                        <div className="bg-white p-4 rounded-lg w-3/4 h-3/4 relative">
                            <button onClick={() => { setModalOpen(false); URL.revokeObjectURL(pdfUrl); }} className="absolute top-2 right-2 text-gray-600 hover:text-gray-800">
                                Close
                            </button>
                            <iframe src={pdfUrl} className="w-full h-4/5" title="PDF Preview" />
                            <button onClick={handleDownloadPDF} className="mt-4 bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600">
                                Download PDF
                            </button>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}