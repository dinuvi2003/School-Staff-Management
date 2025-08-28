import React from 'react';
import LoginHeader from "@/components/layout/LoginPage/LoginHeader"
import LoginForm from "@/components/layout/LoginPage/LoginForm";

export default function page () {
  return (
    <main className="flex min-h-screen items-center justify-center bg-gray-100">
      <div className="mx-4 w-full max-w-5xl">
        <LoginHeader />
        <LoginForm />
      </div>
    </main>
  )
}