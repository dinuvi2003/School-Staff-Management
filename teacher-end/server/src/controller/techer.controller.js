const supabase_client = require('../config/supabase')

exports.getAllTeachers = async(req,res) => {

    let { data: teacher, error } = await supabase_client
        .from('teacher')
        .select('*')
    
    if(!error) {
        const data_size = teacher.length
        
        if(data_size > 1) {
            return res.status(200).json({
                teacher : teacher
            })
        }

        return res.status(404).json({
            message : "There is no any valid data about teachers.."
        })

    }

    return res.status(400).json({
        error : `Something went wrong in teacher data accessing process . ${error}`
    })
} 



exports.getSingleTeacherDetails = async(req, res) => {

    const teacher_id = req.params.id
    
    let { data: teacher, error } = await supabase_client
            .from('teacher')
            .select("*")
            .eq('teacher_nic', teacher_id)

    if(!error) {
        
        if(teacher.length > 0) {
            return res.status(200).json({
                teacher : teacher
            })
        }

        return res.status(404).json({
            message : "There is no valid teacher to realated to NIC number."
        })
        
    } 
    
    return res.status(400).json({
        message : `Something went wrong in teacher data processing ${error}`
    })
    
}