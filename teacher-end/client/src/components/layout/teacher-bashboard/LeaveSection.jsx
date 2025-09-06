'use client'

import SectionTitle from '@/components/ui/Titles/SectionTitle'
import React, { useEffect, useState } from 'react'
import { LeaveCard } from './LeaveCard'
import PrimaryButton from '@/components/ui/Button/PrimaryButton'
import Popup from '@/components/layout/popup/Popup'
import LeaveRequestForm from '@/components/layout/popup/LeaveRequestForm'
import PendingLeaveDetails from './PendingLeaveDetails'

const LeaveSection = () => {
  const [isPopupOpen, setIsPopupOpen] = useState(false);
  const [totalLeavesRequests, setTotalLeavesRequests] = useState(0);
  const [pendingLeaveRequests, setPendingLeaveRequests] = useState(0);

  const [isPending, setIsPending] = useState(true);

  // hard coded teacher nic
  const teacher_nic = "NIC123456V";
  
  useEffect(() => {

    const fetchLeaveData = async () => {
      const teacherAllLeavesResponse = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/leave/teacher/${teacher_nic}`)
      const teacherAllLeavesData = await teacherAllLeavesResponse.json();

      const pendingLeaveResponse = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/leave/teacher/${teacher_nic}/pending`)
      const pendingLeaveData = await pendingLeaveResponse.json();

      setTotalLeavesRequests(teacherAllLeavesData.leaves);
      setPendingLeaveRequests(pendingLeaveData.leaves);
    }

    fetchLeaveData();
  }, [teacher_nic]);

  const newLeaveRequest = () => {
    setIsPopupOpen(true);
  };

  const closePopup = () => {
    setIsPopupOpen(false);
  };


  return (

    <div>
      <div className="px-6 bg-blue-50/70 py-4 rounded-lg border-[1px] border-blue-200">
        <div className="flex items-center justify-between mb-4">
          <SectionTitle title="Leave Section" />
          <PrimaryButton content="Apply for Leave" action={newLeaveRequest} />
        </div>

        {/* leave analytics designs */}
        <div className="grid grid-cols-3 gap-2">
          <LeaveCard title="Total Leaves Requested" value={totalLeavesRequests.length} unit="days" icon="🌴" />
          <LeaveCard title="Pending Leaves" value={pendingLeaveRequests.length} unit="days" icon="🌴" />
          <LeaveCard title="Available Leaves" value={process.env.TOTAL_LEAVES | 30 - totalLeavesRequests.length} unit="days" icon="🌴" />
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