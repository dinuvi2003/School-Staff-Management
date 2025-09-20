import React from 'react';
import AdminHeader from '@/components/layout/TeacherDetailsPage/AdminHeader'
import AdminNav from '@/components/layout/TeacherDetailsPage/AdminNav'
import AddTeacherForm from '@/components/layout/AddTeacherPage/AddTeacherForm';

export default function page () {
  return (
    <main className="min-h-screen bg-gray-100">
      <AdminHeader />
      <AdminNav active="new-teacher" />
      <AddTeacherForm /> 
    </main>
  )
}