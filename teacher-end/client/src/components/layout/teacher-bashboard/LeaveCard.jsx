import React from 'react';

export const LeaveCard = ({ title, value, unit, icon }) => {
    return (
        <section className="border border-gray-200 rounded-lg p-4 flex items-center gap-4 bg-white">
            <div>

                <div className='flex gap-2 items-center'>
                    <div className='bg-blue-100 p-2 rounded-lg'>
                        {icon && <span className="text-2xl">{icon}</span>}
                    </div>
                    <h3 className="m-0 text-md font-semibold">{title}</h3>
                </div>
                <div className="text-[40px] font-bold mt-4 flex items-baseline justify-center">
                    {value} <span className="text-gray-500 text-sm font-normal ">{unit}</span>
                </div>
            </div>
        </section>
    );
};
    