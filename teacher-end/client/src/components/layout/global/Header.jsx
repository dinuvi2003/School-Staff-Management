
'use client';
import { useUser } from '@/hooks/useUser';
import React, { useState } from 'react';
import { useRouter } from 'next/navigation';

const Header = () => {
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
    <header className="w-full bg-white shadow-sm px-6 h-[80px]">

      <div className='flex items-center justify-between h-full'>
        {/* Logo */}
        <div className="font-bold text-2xl text-blue-900 tracking-wide select-none">
          School Manager
        </div>

        {/* Account Holder Details */}
        <div className="flex items-center gap-4 px-4 py-2">
          <div className="flex flex-col items-end">
            <span className="font-semibold text-base text-gray-900 leading-tight">{user?.name || 'Guest'}</span>
            <span className="text-sm text-blue-700 font-medium">School Teacher</span>
          </div>
          {/* Profile Picture */}
          <img
            src="/teacher.png"
            alt="Profile"
            className="w-12 h-12 rounded-full object-cover border-2 border-blue-500 shadow"
          />
        </div>
      </div>
    </header>
  );
};

export default Header;