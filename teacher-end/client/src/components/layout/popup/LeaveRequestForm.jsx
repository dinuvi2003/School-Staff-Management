import React, { useState, useEffect } from 'react';
import PrimaryButton from '@/components/ui/Button/PrimaryButton';
import SectionTitle from '@/components/ui/Titles/SectionTitle';

const LeaveRequestForm = ({ onClose }) => {
  const [formData, setFormData] = useState({
    leave_type: '',
    leave_date: '',
    arrival_date: '',
    leave_day_count: 0
  });

  // Calculate leave day count in real-time
  useEffect(() => {
    if (formData.leave_date && formData.arrival_date) {
      const leaveDate = new Date(formData.leave_date);
      const arrivalDate = new Date(formData.arrival_date);
      
      if (arrivalDate > leaveDate) {
        const timeDiff = arrivalDate.getTime() - leaveDate.getTime();
        const dayCount = Math.ceil(timeDiff / (1000 * 3600 * 24));
        setFormData(prev => ({ ...prev, leave_day_count: dayCount }));
      } else {
        setFormData(prev => ({ ...prev, leave_day_count: 0 }));
      }
    }
  }, [formData.leave_date, formData.arrival_date]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log('Leave Request Data:', formData);
    // Here you would typically send the data to your API
    alert('Leave request submitted successfully!');
    onClose();
  };

  return (
    <div className="w-full max-w-md mx-auto">
        <SectionTitle title="Apply for Leave" />
      
      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Leave Type */}
        <div>
          <label className="block text-sm font-medium text-gray-700">
            Leave Type
          </label>
          <select
            name="leave_type"
            value={formData.leave_type}
            onChange={handleInputChange}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            required
          >
            <option value="">Select leave type</option>
            <option value="sick">Sick Leave</option>
            <option value="casual">Casual Leave</option>
            <option value="annual">Annual Leave</option>
            <option value="maternity">Maternity Leave</option>
            <option value="emergency">Emergency Leave</option>
          </select>
        </div>


        {/* double input section */}
        <div className='flex items-center gap-3 w-full'>
            {/* Leave Date */}
            <div>
                <label className="block text-sm font-medium text-gray-700">
                    Leave Date
                </label>
                <input
                    type="date"
                    name="leave_date"
                    value={formData.leave_date}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    required
                />
            </div>

            {/* Arrival Date */}
            <div>
                <label className="block text-sm font-medium text-gray-700">
                    Arrival Date
                </label>
                <input
                    type="date"
                    name="arrival_date"
                    value={formData.arrival_date}
                    onChange={handleInputChange}
                    min={formData.leave_date}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    required
                />
            </div>
        </div>

        {/* Leave Day Count (Calculated) */}
        <div>
          <label className="block text-sm font-medium text-gray-700">
            Leave Day Count
          </label>
          <input
            type="number"
            name="leave_day_count"
            value={formData.leave_day_count}
            className="w-full px-3 py-2 border border-gray-300 rounded-md bg-gray-100 cursor-not-allowed"
            disabled
            readOnly
          />
          <p className="text-xs text-gray-500 mt-1">
            Automatically calculated based on leave and arrival dates
          </p>
        </div>

        {/* Submit Buttons */}
        <div className="flex gap-3 pt-4">
          <PrimaryButton content="Submit Request" onClick={() => {}} />
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50 transition"
          >
            Cancel
          </button>
        </div>
      </form>
    </div>
  );
};

export default LeaveRequestForm;
