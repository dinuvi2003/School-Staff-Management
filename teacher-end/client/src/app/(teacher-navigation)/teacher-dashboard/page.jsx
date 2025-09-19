import LeaveSection from '@/components/layout/teacher-bashboard/LeaveSection'
import WelcomeSection from '@/components/layout/teacher-bashboard/WelcomeSection'
import React from 'react'

const page = () => {
  return (
    <div className='mt-8'>
      <WelcomeSection />
      <LeaveSection />
    </div>
  )
}

export default page