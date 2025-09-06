'use client';
import React from 'react'
import Image from "next/image";
import { useAuth } from '@/context/AuthContext';

export default function AdminHeader ({
  logoSrc = "/government-logo.png",
  org = "Sri Lanka School",
  product = "Staff Management",
}) {
  const { user } = useAuth();

  return (
    <header className="w-full border-b bg-white">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-3">
        <div className="flex items-center gap-3">
          <Image src={logoSrc} alt="Logo" width={36} height={36} priority />
          <div className="leading-tight">
            <p className="text-xs font-medium">{org}</p>
            <p className="text-sm font-semibold">{product}</p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          {user ? (
            <>
              <div className="text-right leading-tight">
                <p className="text-sm font-semibold">{user.name}</p>
              </div>
              <Image
                src={user.avatar || '/avatar.png'}
                alt={user.name || 'User avatar'}
                width={36}
                height={36}
                className="rounded-full object-cover"
              />
            </>
          ) : (
            <p className="text-sm text-gray-500">Not logged in</p>
          )}
        </div>
      </div>
    </header>
  )
}
