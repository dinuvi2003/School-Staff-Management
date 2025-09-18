import { supabase_client } from '../config/supabase.js'
const BACKEND_URL = process.env.BACKEND_URL

export async function getAllLeaves(req, res) {
    let { data: leave, error } = await supabase_client
        .from('leave')
        .select('*')

    if (!error) {

        const data_size = leave.length

        if (data_size > 0) {
            return res.status(200).json({
                leaves: leave
            })
        }

        return res.status(404).json({
            message: "There is no any valid data about leaves."
        })

    }

    res.json({
        error: `Something went wrong in leave data acessing process ${error}`
    }), 400
}


export async function getSingleLeaveDetails(req, res) {

    const leaveId = req.params.id

    let { data: leave, error } = await supabase_client
        .from('leave')
        .select('*')
        .eq("leave_id", leaveId)

    if (!error) {

        const data_size = leave.length

        if (data_size > 0) {
            return res.status(200).json({
                leave: leave
            })
        }

        return res.status(404).status({
            message: "There is no any valid leave related to this id."
        })

    }

    return res.status(400).json({
        error: `Something went wrong in single leave data accessing process... ${error}`
    })
}


export async function approveLeaveStatus(req, res) {

    const leave_id = req.params.id

    try {
        const leave_res = await fetch(`${BACKEND_URL}/api/leave/${leave_id}`)
        const leave_data = await leave_res.json()
        const leave_status = leave_data.leave[0].leave_status

        if (!leave_res.ok) {
            throw new Error("There something went wrong in leave data accessing process.")
        }

        if (leave_status == "PENDING") {
            const { data, error } = await supabase_client
                .from('leave')
                .update({ leave_status: 'APPROVED' })
                .eq('leave_id', leave_id)
                .select()

            if (!error) {
                return res.status(201).json(data)
            }

            return res.status(400).json({
                message: "Something went wrong in leave status approve process.    "
            })
        }
    }
    catch (err) {
        return res.status(400).json({
            message: `Something went wrong in leave approve update processs.. ${err}`
        })
    }
}


export async function rejectLeaveStatus(req, res) {

    const leave_id = req.params.id

    try {
        const leave_res = await fetch(`${BACKEND_URL}/api/leave/${leave_id}`)
        const leave_data = await leave_res.json()
        const leave_status = leave_data.leave[0].leave_status

        if (!leave_res.ok) {
            throw new Error("There something went wrong in leave data accessing process.")
        }

        if (leave_status == "PENDING") {
            const { data, error } = await supabase_client
                .from('leave')
                .update({ leave_status: 'REJECTED' })
                .eq('leave_id', leave_id)
                .select()

            if (!error) {
                return res.status(201).json(data)
            }

            return res.status(400).json({
                message: "Something went wrong in leave status approve process.    "
            })
        }
    }
    catch (err) {
        return res.status(400).json({
            message: `Something went wrong in leave approve update processs.. ${err}`
        })
    }
}


export async function cancleLeaveStatus(req, res) {

    const leave_id = req.params.id

    try {
        const leave_res = await fetch(`${BACKEND_URL}/api/leave/${leave_id}`)
        const leave_data = await leave_res.json()
        const leave_status = leave_data.leave[0].leave_status

        if (!leave_res.ok) {
            throw new Error("There something went wrong in leave data accessing process.")
        }

        if (leave_status == "PENDING") {
            const { data, error } = await supabase_client
                .from('leave')
                .update({ leave_status: 'CANCELLED' })
                .eq('leave_id', leave_id)
                .select()

            if (!error) {
                return res.status(201).json(data)
            }

            return res.status(400).json({
                message: "Something went wrong in leave status approve process.    "
            })
        }
    }
    catch (err) {
        return res.status(400).json({
            message: `Something went wrong in leave approve update processs.. ${err}`
        })
    }
}


exports.getLeavesByTeacherId = async(req, res) => {

    const teeacher_nic = req.params.id

   let { data: leave, error } = await supabase_client
            .from('leave')
            .select('*')
            .eq('teacher_nic' , teeacher_nic)
    
    if(!error) {

        const data_size = leave.length

        if(data_size > 0) {
            return res.status(200).json({
                leaves : leave
            })
        }

        return res.status(404).json({
            message : "There is no any valid data about leaves." 
        })
        
    }

    res.json({
        error : `Something went wrong in leave data acessing process ${error}`
    }),400
}


exports.getPendingLeavesByTeacherId = async(req, res) => {

    const teacher_nic = req.params.id

   let { data: leave, error } = await supabase_client
            .from('leave')
            .select('*')
            .eq('teacher_nic' , teacher_nic)
            .eq('leave_status', 'PENDING')

    if(!error) {

        const data_size = leave.length

        if(data_size > 0) {
            return res.status(200).json({
                leaves : leave
            })
        }

        return res.status(404).json({
            message : "There is no any valid data about leaves." 
        })

    }

    res.json({
        error : `Something went wrong in leave data acessing process ${error}`
    }),400
}


exports.getRejectLeavesByTeacherId = async(req, res) => {

    const teacher_nic = req.params.id

   let { data: leave, error } = await supabase_client
            .from('leave')
            .select('*')
            .eq('teacher_nic' , teacher_nic)
            .eq('leave_status', 'REJECTED')

    if(!error) {

        const data_size = leave.length

        if(data_size > 0) {
            return res.status(200).json({
                leaves : leave
            })
        }

        return res.status(404).json({
            message : "There is no any valid data about leaves." 
        })

    }

    res.json({
        error : `Something went wrong in leave data acessing process ${error}`
    }),400
}

