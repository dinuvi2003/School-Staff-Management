// Direct calls to your backend (no Next.js /api route)
import axios from "axios";

const API_BASE =
  process.env.NEXT_PUBLIC_API_BASE || "http://localhost:4000"; // change if needed
  const token = 12345677;

// JSON version (no file upload)
export async function addTeacher(payload) {
  try {
    const { data } = await axios.post(`${API_BASE}/api/teacher/add-new`, payload, {
      headers: { 
        "Content-Type": "application/json",
        "Authorization": `Bearer ${token}`
     },
      timeout: 15000,
      withCredentials: false, // set true if your backend uses cookies
    });
    return { success: true, data };
  } catch (err) {
    const message = err?.response?.data?.message || err.message || "Unexpected error";
    return { success: false, message };
  }
}

// Multipart version (when you actually want to upload the image file)
export async function addTeacherMultipart(payloadObj, file) {
  try {
    const fd = new FormData();
    Object.entries(payloadObj).forEach(([k, v]) => fd.append(k, v ?? ""));
    if (file) fd.append("profileImage", file); // backend field name

    const { data } = await axios.post(`${API_BASE}/api/teachers`, fd, {
      // DO NOT set Content-Type; Axios will set the correct boundary for FormData
      timeout: 15000,
      withCredentials: false,
    });
    return { success: true, data };
  } catch (err) {
    const message = err?.response?.data?.message || err.message || "Unexpected error";
    return { success: false, message };
  }
}
