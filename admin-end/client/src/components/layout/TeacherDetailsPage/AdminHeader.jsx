'use client';
import React, { useState } from 'react';
import Image from "next/image";
import { useRouter } from 'next/navigation';
import { useUser } from '@/hooks/useUser';

const API_BASE = process.env.NEXT_PUBLIC_API_BASE || 'http://localhost:5000';

export default function AdminHeader({
  logoSrc = "/government-logo.png",
  org = "Sri Lanka School",
  product = "Staff Management",
}) {
  const { user } = useUser();
  const router = useRouter();
  const [loggingOut, setLoggingOut] = useState(false);

  async function handleLogout() {
    try {
      setLoggingOut(true);
      const res = await fetch(`${API_BASE}/api/auth/logout`, {
        method: 'POST',
        credentials: 'include', // send cookies; server will clear them
      });
      // even if not ok, we send them to login to be safe
    } catch (_) {
      // ignore; we'll still redirect
    } finally {
      setLoggingOut(false);
      router.replace('http://localhost:3000/login'); // go to login (teacher app on port 3000)
    }
  }

  return (
    <header className="w-full border-b bg-white">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-3">
        <div className="flex items-center gap-3">
          <Image src={logoSrc} alt="Logo" width={36} height={36} priority />
          <div className="leading-tight">
            <p className="text-xs font-medium text-blue-950">{org}</p>
            <p className="text-sm font-semibold text-blue-950">{product}</p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          {user ? (
            <>
              <div className="text-right leading-tight">
                <p className="text-sm font-semibold text-blue-950">{user.name}</p>
              </div>
              <Image
                src={'/teacher.png'}
                alt={user.name || 'User avatar'}
                width={36}
                height={36}
                className="rounded-full object-cover"
                unoptimized
              />

              <button
                onClick={handleLogout}
                disabled={loggingOut}
                className="ml-3 rounded-md border border-gray-300 px-3 py-1.5 text-sm font-medium text-gray-700 hover:bg-gray-50 disabled:opacity-60"
                title="Sign out"
              >
                {loggingOut ? 'Signing out…' : 'Logout'}
              </button>
            </>
          ) : (
            <p className="text-sm text-gray-500">Not logged in</p>
          )}
        </div>
      </div>
    </header>
  );
}
