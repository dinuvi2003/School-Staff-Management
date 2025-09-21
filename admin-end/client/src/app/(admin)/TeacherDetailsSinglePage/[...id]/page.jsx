import React from 'react'
import AdminHeader from '@/components/layout/TeacherDetailsPage/AdminHeader'
import AdminNav from '@/components/layout/TeacherDetailsPage/AdminNav'
import Details from '@/components/layout/TeacherDetailsSinglePage/Details'

export default function page() {
  return (
    <main className="min-h-screen bg-gray-100">
      <AdminHeader />
      <AdminNav active="teachers" />
      <div className='p-10'>
        <Details />
      </div >
    </main>
  )
}
