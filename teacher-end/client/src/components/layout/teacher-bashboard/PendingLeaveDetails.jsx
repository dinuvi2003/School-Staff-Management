'use client'

import SectionTitle from '@/components/ui/Titles/SectionTitle'
import React, { useEffect, useState } from 'react'
import Popup from '@/components/layout/popup/Popup'
import PrimaryButton from '@/components/ui/Button/PrimaryButton'
import { jsPDF } from 'jspdf'
import autoTable from 'jspdf-autotable'
import { MdDownload } from 'react-icons/md'

const PendingLeaveDetails = ({ pendingLeaves = [] }) => {
    const [isLoading, setIsLoading] = useState(false);
    const [localLeaves, setLocalLeaves] = useState(pendingLeaves || []);
    const [selectedLeave, setSelectedLeave] = useState(null);
    const [isPopupOpen, setIsPopupOpen] = useState(false);
    const [actionLoading, setActionLoading] = useState(false);
    const [actionError, setActionError] = useState(null);

    useEffect(() => {
        setLocalLeaves(pendingLeaves || []);
    }, [pendingLeaves]);

    const openDetails = (leave) => {
        setSelectedLeave(leave);
        setActionError(null);
        setIsPopupOpen(true);
    };

    const closeDetails = () => {
        setIsPopupOpen(false);
        setSelectedLeave(null);
    };

    const handleCancel = async (leaveId) => {
        if (!leaveId) return;
        setActionLoading(true);
        setActionError(null);

        try {
            const base = process.env.NEXT_PUBLIC_API_BASE || '';
            const res = await fetch(`${base}/api/leave/${leaveId}/cancel`, {
                method: 'PATCH',
                headers: { 'Content-Type': 'application/json' },
                credentials: 'include'
            });

            if (!res.ok) {
                const text = await res.text();
                throw new Error(`Cancel failed: ${res.status} ${text}`);
            }

            // optimistic update: remove canceled leave from list
            setLocalLeaves(prev => prev.filter(l => l.leave_id !== leaveId));
            closeDetails();
        } catch (err) {
            console.error(err);
            setActionError(err.message || 'Failed to cancel leave');
        } finally {
            setActionLoading(false);
        }
    };

    const generatePdf = (leave) => {
        try {
            const doc = new jsPDF({ unit: 'pt', format: 'a4' })
            const title = `${leave.leave_type} Leave Details`
            doc.setFontSize(18)
            doc.text(title, 40, 70)

            const rows = [
                ['Leave ID', leave.leave_id],
                ['Teacher ID', leave.teacher_id],
                ['Type', leave.leave_type],
                ['From', leave.leave_date],
                ['To', leave.arrival_date],
                ['Days', String(leave.leave_day_count)],
                ['Status', leave.leave_status],
                ['Applied Date', leave.leave_apply_date],
                ['Applied Time', leave.leave_applied_time || '']
            ]

            autoTable(doc, {
                startY: 100,
                head: [['Field', 'Value']],
                body: rows,
                styles: { fontSize: 11 },
                headStyles: { fillColor: [22, 78, 99] },
                theme: 'grid'
            })

            // footer
            const footerText = 'Generated from School Staff Management'
            doc.setFontSize(10)
            doc.text(footerText, 40, doc.internal.pageSize.getHeight() - 40)

            doc.save(`${leave.leave_type}_leave_${leave.leave_id}.pdf`)
        } catch (err) {
            console.error('PDF generation failed', err)
            setActionError('Failed to generate PDF')
        }
    }

    return (
        <div className='mt-8'>
            <SectionTitle title="Pending Leave Requests" />

            {isLoading ? (
                <p>Loading pending leaves...</p>
            ) : (
                <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mt-4'>
                    {localLeaves.length === 0 ? (
                        <p className='text-sm text-gray-600'>No pending leave requests.</p>
                    ) : (
                        localLeaves.slice(0, 10).map((leave) => (
                            <button
                                key={leave.leave_id}
                                onClick={() => openDetails(leave)}
                                className='text-left p-4 mb-2 border border-gray-200/30 rounded shadow-sm flex justify-between items-center hover:bg-gray-50'
                            >
                                <div>
                                    <h1 className='font-semibold'>{leave.leave_type}</h1>
                                    <p className='text-[14px]'>{leave.leave_date} to {leave.arrival_date}</p>
                                </div>
                                <div className='flex flex-col gap-2 items-end'>
                                    <p className='text-sm text-gray-600'><span className='font-medium bg-orange-50 px-3 py-1 rounded-2xl text-orange-500'>{leave.leave_status}</span></p>
                                    <p className='text-[12px]'>{leave.leave_apply_date}</p>
                                </div>
                            </button>
                        ))
                    )}
                </div>
            )}

            <Popup isOpen={isPopupOpen} onClose={closeDetails}>
                {selectedLeave && (
                    <div>
                        {/* Header: 100px height with title and download icon */}
                        <div className='flex items-center justify-between bg-blue-50 border-dashed border-[1px] border-blue-300 rounded-3xl p-6'>
                            <div>
                                <h3 className='text-2xl font-semibold'>{selectedLeave.leave_type} Leave</h3>

                                <div className='flex flex-col gap-2'>
                                    <p className='text-sm text-gray-500 mt-2'>Leave ID: {selectedLeave.leave_id}</p>
                                    <p className='text-sm text-gray-600'>Applied: {selectedLeave.leave_apply_date} at {selectedLeave.leave_applied_time}</p>
                                </div>
                            </div>

                            <div className='flex items-center gap-2'>
                                <button
                                    onClick={() => generatePdf(selectedLeave)}
                                    className='p-2 rounded hover:bg-gray-100'
                                    aria-label='Download PDF'
                                >
                                    <div className='bg-blue-600 p-3 rounded-xl cursor-pointer'>
                                        <MdDownload className='text-2xl text-white' />
                                    </div>
                                </button>
                            </div>
                        </div>

                        <div className='p-6'>
                            <div className='overflow-x-auto'>
                                <table className='min-w-full table-auto border-collapse'>
                                    <tbody>
                                        <tr className='bg-white'>
                                            <th className='text-left py-3 px-4 w-1/3 text-sm text-gray-600'>Leave ID</th>
                                            <td className='py-3 px-4 text-sm'>{selectedLeave.leave_id}</td>
                                        </tr>
                                        <tr className='bg-gray-50'>
                                            <th className='text-left py-3 px-4 text-sm text-gray-600'>Type</th>
                                            <td className='py-3 px-4 text-sm'>{selectedLeave.leave_type}</td>
                                        </tr>
                                        <tr className='bg-white'>
                                            <th className='text-left py-3 px-4 text-sm text-gray-600'>From</th>
                                            <td className='py-3 px-4 text-sm'>{selectedLeave.leave_date}</td>
                                        </tr>
                                        <tr className='bg-gray-50'>
                                            <th className='text-left py-3 px-4 text-sm text-gray-600'>To</th>
                                            <td className='py-3 px-4 text-sm'>{selectedLeave.arrival_date}</td>
                                        </tr>
                                        <tr className='bg-white'>
                                            <th className='text-left py-3 px-4 text-sm text-gray-600'>Days</th>
                                            <td className='py-3 px-4 text-sm'>{selectedLeave.leave_day_count}</td>
                                        </tr>
                                        <tr className='bg-gray-50'>
                                            <th className='text-left py-3 px-4 text-sm text-gray-600'>Status</th>
                                            <td className='py-3 px-4 text-sm'>{selectedLeave.leave_status}</td>
                                        </tr>
                                        <tr className='bg-white'>
                                            <th className='text-left py-3 px-4 text-sm text-gray-600'>Teacher ID</th>
                                            <td className='py-3 px-4 text-sm'>{selectedLeave.teacher_id}</td>
                                        </tr>
                                        <tr className='bg-gray-50'>
                                            <th className='text-left py-3 px-4 text-sm text-gray-600'>Applied Date</th>
                                            <td className='py-3 px-4 text-sm'>{selectedLeave.leave_apply_date}</td>
                                        </tr>
                                        <tr className='bg-white'>
                                            <th className='text-left py-3 px-4 text-sm text-gray-600'>Applied Time</th>
                                            <td className='py-3 px-4 text-sm'>{selectedLeave.leave_applied_time || '-'}</td>
                                        </tr>
                                    </tbody>
                                </table>
                            </div>

                            {actionError && <p className='text-red-600 mb-2'>{actionError}</p>}

                            <div className='mt-8 flex gap-3'>
                                <button
                                    onClick={() => handleCancel(selectedLeave.leave_id)}
                                    className='px-4 py-1 bg-red-600 text-sm text-white rounded cursor-pointer'
                                    disabled={actionLoading}
                                >
                                    {actionLoading ? 'Cancelling...' : 'Cancel Leave'}
                                </button>

                                <PrimaryButton content="Close" action={closeDetails} />
                            </div>
                        </div>
                    </div>
                )}
            </Popup>
        </div>
    )
}

export default PendingLeaveDetails