"use client"

import { useUser } from '@/hooks/useUser';
import React from 'react';

const Header = () => {

  const {user, loading} = useUser()
  
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
                <span className="font-semibold text-base text-gray-900 leading-tight">{
                  loading ? (
                    <div className="h-4 w-30 bg-gray-300 rounded animate-pulse"></div>
                  ) : (
                    user?.name
                  )
                }</span>
                <span className="text-sm text-blue-700 font-medium">{
                  loading ? (
                    <div className="h-3 w-20 bg-gray-300 rounded animate-pulse"></div>
                  ) : (
                    user?.role == 'TEACHER' ? 'Teacher' : user?.role == 'ADMIN' ? 'Administrator' : 'Student'
                  ) 
                }</span>
                
                </div>
                {/* Profile Picture */}
                <img
                src="https://ui-avatars.com/api/?name=Jayantha+Chandrasiri&background=0D8ABC&color=fff&size=48"
                alt="Profile"
                className="w-12 h-12 rounded-full object-cover border-2 border-blue-500 shadow"
                />
            </div>
        </div>


    </header>
  );
};

export default Header;