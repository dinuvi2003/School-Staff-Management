'use client';

import { useEffect, useMemo, useState } from "react";
import { User, Phone, GraduationCap, Upload, X } from "lucide-react";
import { addTeacher } from "../../../utils/addTeacher";
import { SERVICE_OPTIONS, getAvailableGraders } from "../../../utils/formUtils";

/* ---------------- Helper components (hoisted: prevents blur) ---------------- */
function SectionTitle({ icon: Icon, title }) {
  return (
    <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
      <span className="inline-flex items-center justify-center w-7 h-7 rounded-full bg-indigo-50 ring-1 ring-indigo-100">
        <Icon className="w-4 h-4 text-indigo-600" />
      </span>
      {title}
    </h3>
  );
}

function InputWithIcon({ label, name, type = "text", required, placeholder, icon: Icon, value, onChange, error }) {
  return (
    <div className="space-y-1.5">
      <label htmlFor={name} className="block text-sm font-medium text-gray-700">
        {label}{required && <span className="text-red-500 ml-1">*</span>}
      </label>
      <div className="relative">
        {Icon && (
          <span className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
            <Icon className="h-5 w-5 text-gray-400" aria-hidden="true" />
          </span>
        )}
        <input
          id={name}
          name={name}
          type={type}
          value={value}
          onChange={onChange}
          placeholder={placeholder}
          className={`h-12 w-full ${Icon ? "pl-12" : "pl-4"} pr-4 rounded-xl border bg-white
          placeholder-gray-400 text-gray-900 transition focus:outline-none
          focus:ring-2 focus:ring-indigo-100
          ${error ? "border-red-300 bg-red-50 focus:border-red-500" : "border-gray-300 hover:border-gray-400 focus:border-indigo-500"}`}
        />
      </div>
      {error && (
        <p className="mt-0.5 text-xs text-red-600 flex items-center gap-1">
          <span className="w-4 h-4 rounded-full bg-red-100 flex items-center justify-center text-[10px] leading-none">!</span>
          {error}
        </p>
      )}
    </div>
  );
}

function SelectWithIcon({ label, name, required, children, icon: Icon, disabled = false, value, onChange, error }) {
  return (
    <div className="space-y-1.5">
      <label htmlFor={name} className="block text-sm font-medium text-gray-700">
        {label}{required && <span className="text-red-500 ml-1">*</span>}
      </label>
      <div className="relative">
        {Icon && (
          <span className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
            <Icon className="h-5 w-5 text-gray-400" aria-hidden="true" />
          </span>
        )}
        <select
          id={name}
          name={name}
          value={value}
          onChange={onChange}
          disabled={disabled}
          className={`h-12 w-full ${Icon ? "pl-12" : "pl-4"} pr-10 rounded-xl border bg-white text-gray-900
          appearance-none transition focus:outline-none focus:ring-2 focus:ring-indigo-100
          ${error ? "border-red-300 bg-red-50 focus:border-red-500"
              : disabled ? "border-gray-300 bg-gray-100 text-gray-400 cursor-not-allowed"
                : "border-gray-300 hover:border-gray-400 focus:border-indigo-500"}`}
        >
          {children}
        </select>
        <span className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-3">
          <svg className="h-5 w-5 text-gray-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" aria-hidden="true">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
          </svg>
        </span>
      </div>
      {error && (
        <p className="mt-0.5 text-xs text-red-600 flex items-center gap-1">
          <span className="w-4 h-4 rounded-full bg-red-100 flex items-center justify-center text-[10px] leading-none">!</span>
          {error}
        </p>
      )}
    </div>
  );
}
/* ------------------------------------------------------------------------- */

export default function AddTeacherForm() {
  const [form, setForm] = useState({
    fullName: "",
    nic: "",
    phone: "",
    email: "",
    address: "",
    dob: "",
    gender: "",
    service: "",
    grader: "",
    joinDate: ""
  });

  // Image picker (local only for now; we won’t send it)
  const [profileFile, setProfileFile] = useState(null);
  const [profilePreview, setProfilePreview] = useState(null);

  const [errors, setErrors] = useState({});
  const [submitting, setSubmitting] = useState(false);
  const [serverMsg, setServerMsg] = useState(null);

  // cleanup preview URL
  useEffect(() => {
    return () => { if (profilePreview) URL.revokeObjectURL(profilePreview); };
  }, [profilePreview]);

  const onImageChange = (e) => {
    const file = e.target.files?.[0];

    // reset current
    setProfileFile(null);
    if (profilePreview) URL.revokeObjectURL(profilePreview);
    setProfilePreview(null);

    if (!file) return;
    if (!file.type.startsWith("image/")) {
      setErrors((prev) => ({ ...prev, profileImage: "Please select an image file" }));
      return;
    }
    const MAX = 2 * 1024 * 1024; // 2MB
    if (file.size > MAX) {
      setErrors((prev) => ({ ...prev, profileImage: "Image is too large (max 2MB)" }));
      return;
    }

    setErrors((prev) => ({ ...prev, profileImage: undefined }));
    setProfileFile(file);
    setProfilePreview(URL.createObjectURL(file)); // local preview
  };

  const removeImage = () => {
    setProfileFile(null);
    if (profilePreview) URL.revokeObjectURL(profilePreview);
    setProfilePreview(null);
    setErrors((prev) => ({ ...prev, profileImage: undefined }));
  };

  const onChange = (e) => {
    const { name, value } = e.target;
    setForm((f) => (name === "service" ? { ...f, service: value, grader: "" } : { ...f, [name]: value }));
    setErrors((prev) => (prev?.[name] ? { ...prev, [name]: undefined } : prev));
  };

  const availableGraders = useMemo(() => getAvailableGraders(form.service), [form.service]);

  const validate = () => {
    const e = {};
    if (!form.fullName.trim()) e.fullName = "Required";
    if (!form.nic.trim()) e.nic = "Required";
    if (!form.phone.trim()) e.phone = "Required";
    if (!/^0\d{9}$/.test(form.phone)) e.phone = "Use Sri Lankan 10-digit number (e.g., 0712345678)";
    if (!form.email.trim()) e.email = "Required";
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) e.email = "Invalid email";
    if (!form.address.trim()) e.address = "Required";
    if (!form.gender) e.gender = "Required";
    if (form.dob && new Date(form.dob) > new Date()) e.dob = "DOB cannot be in the future";
    if (!form.service) e.service = "Required";
    if (!form.grader) e.grader = "Required";
    if (!form.joinDate) e.joinDate = "Required";
    return e;
  };

  const onSubmit = async (e) => {
    e.preventDefault();
    setServerMsg(null);
    const v = validate();
    setErrors(v);
    if (Object.keys(v).length) return;

    try {
      setSubmitting(true);

      // We are NOT uploading the image yet. Send null for now.
      const payload = {
        fullName: form.fullName,
        nic: form.nic,
        phone: form.phone,
        email: form.email,
        address: form.address,
        dob: form.dob || null,
        gender: form.gender,
        service: form.service,
        grader: form.grader,
        joinDate: form.joinDate,
        profileImageUrl: null, // <— IMPORTANT: backend will store null for now
      };

      const res = await addTeacher(payload);
      if (!res.success) throw new Error(res.message);

      setServerMsg({ type: "success", text: "Teacher added successfully" });

      // reset form + preview
      setForm({
        fullName: "",
        nic: "",
        phone: "",
        email: "",
        address: "",
        dob: "",
        gender: "",
        service: "",
        grader: "",
        joinDate: ""
      });
      setProfileFile(null);
      if (profilePreview) URL.revokeObjectURL(profilePreview);
      setProfilePreview(null);
    } catch (err) {
      setServerMsg({ type: "error", text: err.message || "Failed to add teacher" });
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 py-10 px-4">
      <div className="max-w-5xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-indigo-100 rounded-2xl mb-4 ring-1 ring-indigo-200">
            <GraduationCap className="w-8 h-8 text-indigo-600" />
          </div>
          <h1 className="text-3xl font-bold text-gray-900 mb-1">
            Add New <span className="text-indigo-600">Teacher</span>
          </h1>
          <p className="text-gray-600 text-sm">Fill in the details to register a new teacher</p>
        </div>

        {/* Alerts */}
        {serverMsg && (
          <div
            role="alert"
            className={`mb-6 rounded-xl p-4 border-l-4 ${serverMsg.type === "success"
              ? "bg-green-50 border-green-400 text-green-800"
              : "bg-red-50 border-red-400 text-red-800"
              }`}
          >
            <div className="flex items-center">
              <div
                className={`flex-shrink-0 w-5 h-5 rounded-full ${serverMsg.type === "success" ? "bg-green-100" : "bg-red-100"
                  } flex items-center justify-center mr-3 text-xs`}
                aria-hidden="true"
              >
                {serverMsg.type === "success" ? "✓" : "!"}
              </div>
              <span>{serverMsg.text}</span>
            </div>
          </div>
        )}

        {/* Card */}
        <div className="bg-white rounded-2xl shadow-xl border border-gray-100">
          <form onSubmit={onSubmit} noValidate className="p-8">
            {/* Profile Image (local only) */}
            <div className="mb-8">
              <SectionTitle icon={User} title="Profile Picture" />
              <div className="flex flex-col items-center gap-4 sm:flex-row sm:items-center sm:gap-6">
                <div className="relative">
                  <div
                    className={`w-28 h-28 sm:w-32 sm:h-32 rounded-xl border-2 border-dashed overflow-hidden
                    flex items-center justify-center transition ring-2
                    ${profilePreview ? "border-indigo-300 bg-indigo-50 ring-indigo-50" : "border-gray-300 bg-gray-50 hover:border-indigo-300 hover:bg-indigo-50 ring-transparent"}`}
                  >
                    {profilePreview ? (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img
                        src={profilePreview}
                        alt="Profile preview"
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <User className="w-10 h-10 text-gray-400" />
                    )}
                  </div>

                  {profilePreview && (
                    <button
                      type="button"
                      onClick={removeImage}
                      className="absolute -top-2 -right-2 w-8 h-8 bg-red-500 text-white rounded-full flex items-center justify-center hover:bg-red-600 transition-colors duration-200 shadow-lg"
                      aria-label="Remove selected image"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  )}
                </div>

                {/* Hidden file input + label trigger */}
                <div className="relative">
                  <input
                    type="file"
                    accept="image/*"
                    onChange={onImageChange}
                    id="profile-upload"
                    className="hidden"
                  />
                  <label
                    htmlFor="profile-upload"
                    className="inline-flex items-center gap-2 px-4 py-2 bg-indigo-50 text-indigo-700 rounded-lg border border-indigo-200 hover:bg-indigo-100 cursor-pointer transition"
                  >
                    <Upload className="w-4 h-4" />
                    Choose Image
                  </label>
                </div>
              </div>
              {errors.profileImage && (
                <p className="text-red-600 text-xs flex items-center gap-1 mt-2">
                  <span className="w-4 h-4 rounded-full bg-red-100 flex items-center justify-center text-[10px] leading-none">!</span>
                  {errors.profileImage}
                </p>
              )}
            </div>

            {/* Personal */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <div className="lg:col-span-2">
                <SectionTitle icon={User} title="Personal Information" />
              </div>

              <div className="lg:col-span-2">
                <InputWithIcon
                  label="Full Name"
                  name="fullName"
                  required
                  placeholder="K.D.M. Paranagama"
                  value={form.fullName}
                  onChange={onChange}
                  error={errors.fullName}
                />
              </div>

              <div className="lg:col-span-2">
                <InputWithIcon
                  label="National Identity Card Number"
                  name="nic"
                  required
                  placeholder="1997XXXXXXXX"
                  value={form.nic}
                  onChange={onChange}
                  error={errors.nic}
                />
              </div>

              <InputWithIcon
                label="Date of Birth"
                name="dob"
                type="date"
                value={form.dob}
                onChange={onChange}
                error={errors.dob}
              />

              <SelectWithIcon
                label="Gender"
                name="gender"
                required
                value={form.gender}
                onChange={onChange}
                error={errors.gender}
              >
                <option value="">Select...</option>
                <option value="Male">Male</option>
                <option value="Female">Female</option>
                <option value="Other">Other</option>
              </SelectWithIcon>

              {/* Contact */}
              <div className="lg:col-span-2 mt-2">
                <SectionTitle icon={Phone} title="Contact Information" />
              </div>

              <InputWithIcon
                label="Contact Number"
                name="phone"
                required
                placeholder="07XXXXXXXX"
                value={form.phone}
                onChange={onChange}
                error={errors.phone}
              />

              <InputWithIcon
                label="Email Address"
                name="email"
                type="email"
                required
                placeholder="sample@gmail.com"
                value={form.email}
                onChange={onChange}
                error={errors.email}
              />

              <div className="lg:col-span-2">
                <InputWithIcon
                  label="Address"
                  name="address"
                  required
                  placeholder="177/1 B, Vihara Mawatha, Malabe"
                  value={form.address}
                  onChange={onChange}
                  error={errors.address}
                />
              </div>

              {/* Professional */}
              <div className="lg:col-span-2 mt-2">
                <SectionTitle icon={GraduationCap} title="Professional Information" />
              </div>

              <SelectWithIcon
                label="Service"
                name="service"
                required
                value={form.service}
                onChange={onChange}
                error={errors.service}
              >
                <option value="">Select service...</option>
                {SERVICE_OPTIONS.map((opt) => (
                  <option key={opt.value} value={opt.value}>
                    {opt.label}
                  </option>
                ))}
              </SelectWithIcon>

              <SelectWithIcon
                label="Grader"
                name="grader"
                required
                disabled={!form.service}
                value={form.grader}
                onChange={onChange}
                error={errors.grader}
              >
                <option value="">{form.service ? "Select grader..." : "Select service first"}</option>
                {availableGraders.map((opt) => (
                  <option key={opt.value} value={opt.value}>
                    {opt.label}
                  </option>
                ))}
              </SelectWithIcon>

              <div className="lg:col-span-2">
                <InputWithIcon
                  label="First Appointment Date"
                  name="joinDate"
                  type="date"
                  required
                  value={form.joinDate}
                  onChange={onChange}
                  error={errors.joinDate}
                />
              </div>
            </div>

            {/* Submit */}
            <div className="mt-10 flex justify-center">
              <button
                type="submit"
                disabled={submitting}
                className={`inline-flex items-center gap-3 px-8 py-3 rounded-xl font-semibold text-base transition-all duration-200 shadow-lg ${submitting
                  ? "bg-gray-400 text-gray-100 cursor-not-allowed"
                  : "bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white hover:shadow-xl hover:-translate-y-0.5"
                  }`}
              >
                {submitting ? (
                  <>
                    <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" aria-hidden="true"></div>
                    Saving...
                  </>
                ) : (
                  <>
                    <User className="w-5 h-5" />
                    Add Teacher
                  </>
                )}
              </button>
            </div>
          </form>
        </div>

        <p className="text-center text-xs text-gray-500 mt-4">
          Tip: Ensure NIC and phone follow Sri Lankan formats before submission.
        </p>
      </div>
    </div>
  );
}
