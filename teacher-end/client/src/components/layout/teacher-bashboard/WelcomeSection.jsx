import Date from '@/components/ui/Date'
import Time from '@/components/ui/Time'
import Title from '@/components/ui/Titles/Title'
import React from 'react'

const WelcomeSection = () => {
  return (
    <div className='grid grid-cols-1 md:grid-cols-3 gap-4 my-8'>
      <div className='md:col-span-2'>
        <Title>
          Welcome Back,<br /> <span className='text-primary'>Jayantha Chandrasiry</span>
        </Title>
      </div>

      <div className='flex flex-col items-start md:items-end justify-center space-y-1'>
        <Date />
        <Time />
      </div>
      
    </div>
  )
}

export default WelcomeSection