import React from 'react';

export const LeaveCard = ({ title, value, unit, icon }) => {
    return (
        <div className='relative'>
            <section className="border border-gray-200 rounded-lg px-8 py-4 flex items-center gap-4 bg-white z-10 relative">
                <div className='w-full'>
                    <div className='flex gap-2 items-center'>
                        <div className='bg-blue-100 p-2 rounded-lg'>
                            {icon && <span className="text-xl">{icon}</span>}
                        </div>
                        <h3 className="m-0 text-xl font-semibold">{title}</h3>
                    </div>
                    <div className="text-[60px] font-bold mt-4 flex items-baseline justify-center">
                        {value} <span className="text-gray-500 text-sm font-normal ">{unit}</span>
                    </div>
                </div>
            </section>
        </div>
    );
};
    