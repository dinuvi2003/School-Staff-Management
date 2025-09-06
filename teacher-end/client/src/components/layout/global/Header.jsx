
import React from 'react';

const Header = () => {
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
                <span className="font-semibold text-base text-gray-900 leading-tight">Jayantha Chandrasiri</span>
                <span className="text-sm text-blue-700 font-medium">School Teacher</span>
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