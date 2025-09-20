// Direct calls to your backend (no Next.js /api route)
import axios from "axios";

// utils/addTeacher.js
const API_BASE = process.env.NEXT_PUBLIC_API_BASE || "http://localhost:5000";

export async function addTeacher(payload) {
  const res = await fetch(`${API_BASE}/api/teacher/add-new`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    credentials: "include",              // <-- send cookies
    body: JSON.stringify(payload),
  });

  const json = await res.json().catch(() => ({}));
  if (!res.ok) {
    throw new Error(json?.errors?.message || json?.message || "Failed to add teacher");
  }
  return { success: true, data: json?.data };
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
