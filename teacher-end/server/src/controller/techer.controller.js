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

// POST /api/teacher/add-new
exports.addNewTeacher = async (req, res) => {
  try {
    const {
      fullName,
      nic,
      phone,
      email,
      address,
      dob,        // optional, string (YYYY-MM-DD)
      gender,
      service,
      grader,
      joinDate    // string (YYYY-MM-DD)
    } = req.body || {};

    // --- minimal validation to mirror your frontend rules ---
    const errors = {};
    if (!fullName || !fullName.trim()) errors.fullName = "Full name is required";
    if (!nic || !nic.trim()) errors.nic = "NIC is required";
    if (!phone || !/^(0\d{9}|(\+94)\d{9})$/.test(phone)) errors.phone = "Invalid Sri Lankan phone";
    if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) errors.email = "Invalid email";
    if (!address || !address.trim()) errors.address = "Address is required";
    if (!gender) errors.gender = "Gender is required";
    if (!service) errors.service = "Service is required";
    if (!grader) errors.grader = "Grader is required";
    if (!joinDate) errors.joinDate = "Join date is required";

    if (Object.keys(errors).length) {
      return res.status(400).json({ ok: false, message: "Validation failed", errors });
    }

    // --- duplicate NIC check ---
    const { data: existing, error: findErr } = await supabase_client
      .from('teacher')
      .select('teacher_nic')
      .eq('teacher_nic', nic)
      .limit(1);

    if (findErr) {
      return res.status(500).json({ ok: false, message: `Lookup failed: ${findErr.message || findErr}` });
    }
    if (existing && existing.length > 0) {
      return res.status(409).json({ ok: false, message: "NIC already exists" });
    }
    
    const row = {
      teacher_full_name: fullName,
      teacher_nic: nic,
      teacher_phone: phone,
      teacher_email: (email || "").toLowerCase(),
      teacher_address: address,
      teacher_dob: dob || null,
      teacher_gender: gender,
      teacher_service: service,
      teacher_grader: grader,
      teacher_join_date: joinDate,
      profile_image_url: null, // add storage later if needed
      created_at: new Date().toISOString()
    };

    const { data, error } = await supabase_client
      .from('teacher')
      .insert([row])
      .select('*')
      .single();

    if (error) {
      // Postgres unique violation code (for safety if NIC has a unique constraint)
      if (error.code === '23505') {
        return res.status(409).json({ ok: false, message: "NIC already exists" });
      }
      return res.status(500).json({ ok: false, message: error.message || "Insert failed" });
    }

    // Your frontend just checks { success: true } from axios util, but we’ll return a nice shape:
    return res.status(201).json({
      ok: true,
      message: "Teacher created successfully",
      teacher: data
    });
  } catch (err) {
    return res.status(500).json({ ok: false, message: err.message || "Server error" });
  }
};
