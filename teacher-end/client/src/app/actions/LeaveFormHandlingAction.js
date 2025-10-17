'use server'

export const LeaveFormHandlingAction = async (initialState, formData) => {
    console.log("Leave Form Data: ", formData);
    
    const formDataObj = {};
    for (const [key, value] of formData.entries()) {
        formDataObj[key] = value;
    }

    // check date validation
    const today = new Date();
    const leaveDate = new Date(formDataObj.leave_date);
    const arrivalDate = new Date(formDataObj.arrival_date);
    if (arrivalDate <= leaveDate) {
        return {
            success: false,
            message: "Arrival date must be after leave date.",
            error: { arrival_date: "Arrival date must be after leave date." }
        };
    }

    if (leaveDate < today) {
        return {
            success: false,
            message: "Leave date must be today or in the future.",
            error: { leave_date: "Leave date must be today or in the future." }
        };
    }

    // check the day count
    const timeDiff = arrivalDate.getTime() - leaveDate.getTime();
    const dayDiff = leaveDate.getTime() - today.getTime();
    const dayDiffenrenceCount = Math.ceil(dayDiff / (1000 * 3600 * 24));
    const dayCount = Math.ceil(timeDiff / (1000 * 3600 * 24));

    if(dayDiffenrenceCount < 0) {
        return {
            success: false,
            message: "Leave date must be today or in the future.",
            error: { form_error: "Leave date must be today or in the future." }
        };
    }
    else if (dayDiffenrenceCount > 30) {
        return {
            success: false,
            message: "Leave date cannot be more than 30 days in the future.",
            error: { form_error: "Leave date cannot be more than 30 days in the future." }
        };
    }

    if (dayCount> 4) {
        return {
            success: false,
            message: "Leave duration cannot exceed 4 days.",
            error: { form_error: "Leave duration cannot exceed 4 days."}
        }
    }


    // update the form object with the calculated day count
    formDataObj.days_count = dayCount;
    console.log("Processed Leave Form Data: ", formDataObj);

    // send the data to the backend
    const response = await fetch(`${process.env.API_BASE}/api/leave/new-leave`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(formDataObj)
    });

    console.log("Leave Form Action Response: ", response);
    
    if (!response.ok) {
        return {
            success: false,
            message: "Failed to submit leave request.",
            error: { form_error: "Failed to submit leave request." }
        };
    }

    const result = await response.json();
    console.log("Leave Form Action Result: ", result);

    return {
        success: true,
        message: result.message,
    }
}