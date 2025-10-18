'use client'

import SectionTitle from '@/components/ui/Titles/SectionTitle'
import React, { use, useEffect, useState } from 'react'
import { LeaveCard } from './LeaveCard'
import PrimaryButton from '@/components/ui/Button/PrimaryButton'
import Popup from '@/components/layout/popup/Popup'
import LeaveRequestForm from '@/components/layout/popup/LeaveRequestForm'
import PendingLeaveDetails from './PendingLeaveDetails'
import { useUser } from '@/hooks/useUser'
import { MdOutlinePendingActions } from "react-icons/md";
import { IoCalendarOutline } from "react-icons/io5";
import { TbCalendarCancel } from "react-icons/tb";
import { MdOutlineEventAvailable } from "react-icons/md";


const LeaveSection = () => {
  const { user, loading } = useUser();
  const [isPopupOpen, setIsPopupOpen] = useState(false);
  const [totalLeavesRequests, setTotalLeavesRequests] = useState(0);
  const [pendingLeaveRequests, setPendingLeaveRequests] = useState(0);
  const [rejectedLeaveRequests, setRejectedLeaveRequests] = useState(0);
  const [isPending, setIsPending] = useState(true);

  useEffect(() => {

    if (!user?.uid) return;
    console.log("Teacher ID", user?.uid);

    const fetchLeaveData = async () => {

      const teacherAllLeavesResponse = await fetch(`${process.env.NEXT_PUBLIC_API_BASE}/api/leave/teacher/${user?.uid}`, {
        method: 'GET',
        credentials: 'include',
        headers: { 'Content-Type': 'application/json' }
      })
      const teacherAllLeavesData = await teacherAllLeavesResponse.json();


      const pendingLeaveResponse = await fetch(`${process.env.NEXT_PUBLIC_API_BASE}/api/leave/teacher/${user?.uid}/pending`, {
        method: 'GET',
        credentials: 'include',
        headers: { 'Content-Type': 'application/json' }
      })

      if (user?.uid !== undefined) {
        const pendingLeaveData = await pendingLeaveResponse.json();
        setPendingLeaveRequests(pendingLeaveData.leaves);
      }


      const rejectedLeaveResponse = await fetch(`${process.env.NEXT_PUBLIC_API_BASE}/api/leave/teacher/${user?.uid}/rejected`, {
        method: 'GET',
        credentials: 'include',
        headers: { 'Content-Type': 'application/json' }
      })

      if (user?.uid !== undefined) {
        const rejectedLeaveData = await rejectedLeaveResponse.json();
        setRejectedLeaveRequests(rejectedLeaveData.leaves);

      }

      setTotalLeavesRequests(teacherAllLeavesData.leaves);

    }


    fetchLeaveData();

  }, [user?.uid]);

  const newLeaveRequest = () => {
    setIsPopupOpen(true);
  };

  const closePopup = () => {
    setIsPopupOpen(false);
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-100">
        <div className="p-6 bg-white rounded shadow text-center">
          <p className="text-gray-700">loading...</p>
        </div>
      </div>
    )
  }


  return (

    <div>
      <div className="px-6 bg-blue-50/70 py-4 rounded-lg border-[1px] border-blue-200">
        <div className="flex items-center justify-between mb-4">
          <SectionTitle title="Leave Section" />
          <PrimaryButton content="Apply for Leave" action={newLeaveRequest} />
        </div>

        {/* leave analytics designs */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-2">
          <LeaveCard title="Total Leaves Requested" value={totalLeavesRequests.length} unit="days" icon={<MdOutlineEventAvailable />} />
          <LeaveCard title="Pending Leaves" value={pendingLeaveRequests.length} unit="days" icon={<MdOutlinePendingActions />} />
          <LeaveCard title="Rejected Leaves" value={rejectedLeaveRequests.length} unit="days" icon={<TbCalendarCancel />} />
          <LeaveCard title="Available Leaves" value={process.env.TOTAL_LEAVES | 30 - totalLeavesRequests.length} unit="days" icon={<IoCalendarOutline />} />
        </div>

        {/* Popup for leave request */}
        <Popup isOpen={isPopupOpen} onClose={closePopup}>
          <LeaveRequestForm action={closePopup} />
        </Popup>
      </div>

      {/* pending leave request details */}
      <PendingLeaveDetails />

    </div>
  );
}

export default LeaveSection