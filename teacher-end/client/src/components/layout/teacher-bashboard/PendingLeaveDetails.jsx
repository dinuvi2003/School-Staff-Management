'use client'

import { useUser } from '@/hooks/useUser'
import SectionTitle from '@/components/ui/Titles/SectionTitle'
import React, { useEffect, useState } from 'react'

const PendingLeaveDetails = () => {
    const { user, loading } = useUser()
    const [isLoading, setIsLoading] = useState(true);
    const [pendingLeaves, setPendingLeaves] = useState([]);

    const teacher_nic = user?.nic;

    useEffect(() => {
        const fetchPendingLeaves = async () => {
            try {
                const response = await fetch(`${process.env.NEXT_PUBLIC_API_BASE}/api/leave/teacher/${teacher_nic}/pending`, {
                    method: 'GET',
                    credentials: 'include',
                    headers: { 'Content-Type': 'application/json' }
                });
                const data = await response.json();
                setPendingLeaves(data.leaves || []);
            } catch (error) {
                console.error("Error fetching pending leaves:", error);
            } finally {
                setIsLoading(false);
            }
        }

        fetchPendingLeaves();
    }, []);

    console.log(pendingLeaves);

    return (
        <div className='mt-8'>
            <SectionTitle title="Pending Leave Requests" />
            {
                isLoading ? (
                    <p>Loading pending leaves...</p>
                ) : (
                    <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mt-4'>
                        {pendingLeaves.slice(0, 5).map((leave, index) => (
                            <div key={index} className='p-4 mb-2 border border-gray-200/30 rounded shadow-sm flex justify-between items-center'>
                                <div>
                                    <h1 className='font-semibold'>{leave.leave_type}</h1>
                                    <p className='text-[14px]'>{leave.leave_date} to {leave.arrival_date}</p>
                                </div>
                                <div className='flex flex-col gap-2'>
                                    <p className='text-sm text-gray-600'><span className='font-medium bg-orange-50 px-3 py-1 rounded-2xl text-orange-500'>{leave.leave_status}</span></p>
                                    <p className='text-[12px]'>{leave.leave_apply_date}</p>
                                </div>
                            </div>
                        ))}
                    </div>
                )
            }
        </div>
    )
}

export default PendingLeaveDetails