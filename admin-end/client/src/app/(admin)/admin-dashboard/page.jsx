import React from 'react'
import AdminHeader from '@/components/layout/TeacherDetailsPage/AdminHeader'
import AdminNav from '@/components/layout/TeacherDetailsPage/AdminNav'
import DetailsTable from '@/components/layout/TeacherDetailsPage/DetailsTable'

export default function page () {
  return (
    <main className="min-h-screen bg-gray-100">
      <AdminHeader />
      <AdminNav active="teachers" />
      <DetailsTable />
    </main>
  )
}
