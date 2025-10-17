'use client'

import SectionTitle from '@/components/ui/Titles/SectionTitle'
import React, { useEffect, useState } from 'react'
import { LeaveCard } from './LeaveCard'
import PrimaryButton from '@/components/ui/Button/PrimaryButton'
import Popup from '@/components/layout/popup/Popup'
import LeaveRequestForm from '@/components/layout/popup/LeaveRequestForm'
import PendingLeaveDetails from './PendingLeaveDetails'
import { MdOutlinePendingActions } from "react-icons/md";
import { IoCalendarOutline } from "react-icons/io5";
import { TbCalendarCancel } from "react-icons/tb";
import { MdOutlineEventAvailable } from "react-icons/md";
import { useUser } from '@/app/hooks/useUser'
import { computeAvailableNormalLeaves } from '@/lib/leaveUtils'
import { jsPDF } from 'jspdf'
import autoTable from 'jspdf-autotable'
import { MdDownload } from 'react-icons/md'


const LeaveSection = () => {
  const [isPopupOpen, setIsPopupOpen] = useState(false);
  const [leaves, setLeaves] = useState([]);
  const [isLoadingLeaves, setIsLoadingLeaves] = useState(true);
  const [leavesError, setLeavesError] = useState(null);

  const newLeaveRequest = () => setIsPopupOpen(true);
  const closePopup = () => setIsPopupOpen(false);

  const {user: currentUser, loading} = useUser()
  const currentUserId = currentUser ? currentUser.uid : null;
  
  useEffect(() => {
    // only fetch when we know the current user id and user-loading has finished
    if (loading) return;
    if (!currentUserId) {
      setIsLoadingLeaves(false);
      return;
    }

    const fetchTeacherLeaveData = async () => {
      setIsLoadingLeaves(true);
      setLeavesError(null);

      try {
        const base = process.env.NEXT_PUBLIC_API_BASE || '';
        const res = await fetch(`${base}/api/leave/teacher/${currentUserId}`);

        if (!res.ok) {
          const text = await res.text();
          throw new Error(`Failed to fetch teacher leave data: ${res.status} ${text}`);
        }

        const json = await res.json();
        // Expecting shape: { ok: true, message: 'OK', data: { leaves: [...] } }
        const fetchedLeaves = (json && json.data && Array.isArray(json.data.leaves)) ? json.data.leaves : [];
        setLeaves(fetchedLeaves);
        console.log('Teacher Leave Data:', fetchedLeaves);
      } catch (err) {
        console.error(err);
        setLeavesError(err.message || 'Failed to load leaves');
      } finally {
        setIsLoadingLeaves(false);
      }
    };

    fetchTeacherLeaveData();
  }, [currentUserId, loading]);

  // compute analytics values so cards are always rendered
  const totalRequested = leaves.length;
  const pendingCount = leaves.filter(l => l.leave_status === 'PENDING').length;
  const rejectedCount = leaves.filter(l => l.leave_status === 'REJECTED' || l.leave_status === 'DENIED').length;
  const computedAvailable = computeAvailableNormalLeaves(leaves, 16);
  const availableLeaves = currentUser && currentUser.availableLeaves != null ? currentUser.availableLeaves : computedAvailable;

  return (
    <div>
      <div className="px-6 bg-blue-50/70 py-4 rounded-lg border-[1px] border-blue-200">
        <div className="flex items-center justify-between mb-4">
          <SectionTitle title="Leave Section" />
          <div className='flex items-center gap-2'>
            <button
              onClick={() => {
                // generate analysis PDF
                try {
                  const doc = new jsPDF({ unit: 'pt', format: 'a4' })
                  doc.setFontSize(18)
                  doc.text('Leave Analysis Report', 40, 60)

                  // analytics
                  const analytics = [
                    ['Total Leaves Requested', String(totalRequested)],
                    ['Pending Leaves', String(pendingCount)],
                    ['Rejected Leaves', String(rejectedCount)],
                    ['Available Leaves', String(availableLeaves)]
                  ]

                  autoTable(doc, {
                    startY: 90,
                    head: [['Metric', 'Value']],
                    body: analytics,
                    theme: 'grid',
                    headStyles: { fillColor: [22, 78, 99] }
                  })

                  // leave details table
                  const startY = doc.lastAutoTable ? doc.lastAutoTable.finalY + 20 : 170
                  const rows = leaves.map(l => ([
                    l.leave_id,
                    l.leave_type,
                    l.leave_date,
                    l.arrival_date,
                    String(l.leave_day_count),
                    l.leave_status
                  ]))

                  autoTable(doc, {
                    startY,
                    head: [['ID', 'Type', 'From', 'To', 'Days', 'Status']],
                    body: rows,
                    styles: { fontSize: 9 },
                    headStyles: { fillColor: [22, 78, 99] },
                    theme: 'striped'
                  })

                  doc.save(`leave_analysis_${new Date().toISOString().slice(0,10)}.pdf`)
                } catch (err) {
                  console.error('PDF generation failed', err)
                }
              }}
              aria-label='Download analysis PDF'
            >
              <div className='bg-blue-600/20 p-3 rounded-xl cursor-pointer'>
                <MdDownload className='text-2xl text-blue-600' />
              </div>
            </button>
            <PrimaryButton content="Apply for Leave" action={newLeaveRequest} />
          </div>
        </div>

        {/* leave analytics designs */}
        {leavesError && (
          <div className="mb-3 text-red-600">{leavesError}</div>
        )}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-2">
          <LeaveCard title="Total Leaves Requested" value={isLoadingLeaves ? '—' : totalRequested} unit="" icon={<MdOutlineEventAvailable />} />
          <LeaveCard title="Pending Leaves" value={isLoadingLeaves ? '—' : pendingCount} unit="" icon={<MdOutlinePendingActions />} />
          <LeaveCard title="Rejected Leaves" value={isLoadingLeaves ? '—' : rejectedCount} unit="" icon={<TbCalendarCancel />} />
          <LeaveCard title="Available Leaves" value={isLoadingLeaves ? '—' : availableLeaves} unit="days" icon={<IoCalendarOutline />} />
        </div>

        <Popup isOpen={isPopupOpen} onClose={closePopup}>
          <LeaveRequestForm action={closePopup} />
        </Popup>
      </div>

  {/* pending leave request details */}
  <PendingLeaveDetails pendingLeaves={leaves.filter(l => l.leave_status === 'PENDING')} />

    </div>
  );
}

export default LeaveSection