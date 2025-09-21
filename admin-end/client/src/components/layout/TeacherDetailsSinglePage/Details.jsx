"use client";
import React, { useEffect, useState } from 'react';
import Image from 'next/image';
import { useParams, useRouter } from "next/navigation";

export default function Details() {
  const [teacher, setTeacher] = useState({
    name: "",
    nic: "",
    address: "",
    contactNumber: "",
    email: "",
    birthDate: "",
    grade: "",
    serviceType: "",
    firstAppointmentDate: "",
    photo: "/teacher.png",
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const router = useRouter();
  const { id } = useParams();

  useEffect(() => {

    if (!id) return;

    const fetchTeacherDetails = async () => {
      try {
        const response = await fetch(`${process.env.NEXT_PUBLIC_API_BASE}/api/teacher/${encodeURIComponent(id)}`,
          { method: 'GET', credentials: 'include' }
        );
        const json = await response.json();

        console.log("teacher", json)

        if (!response.ok) {
          throw new Error(json?.errors?.message || 'Failed to fetch teacher details');
        }

        // Map the API response to the teacher state
        setTeacher({
          name: json.data.teacher[0].teacher_full_name,
          nic: json.data.teacher[0].teacher_nic,
          address: json.data.teacher[0].teacher_address,
          contactNumber: json.data.teacher[0].teacher_contact_number,
          email: json.data.teacher[0].email,
          birthDate: json.data.teacher[0].teacher_bd,
          grade: json.data.teacher[0].teacher_grade,
          serviceType: json.data.teacher[0].service_type,
          firstAppointmentDate: json.data.teacher[0].teacher_first_appointment_date,
          photo: json.data.teacher[0].photo_url || "/teacher.png",
        });
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      fetchTeacherDetails();
    }
  }, [id]);

  const Row = ({ label, value }) => (
    <div className="grid grid-cols-[170px_12px_1fr] items-start gap-2 py-2">
      <span className="font-medium text-gray-800">{label}</span>
      <span className="text-indigo-900">:</span>
      <span className="text-gray-700">{value}</span>
    </div>
  );

  if (loading) {
    return <div className="text-center py-8">Loading...</div>;
  }

  if (error) {
    return (
      <div className="text-center py-8 text-red-600">
        Error: {error}
      </div>
    );
  }

  // ...existing code...
  return (
    <section className="mx-auto max-w-4xl px-4 py-8">
      <div className="mb-6 flex items-center gap-3">
        <button
          type="button"
          onClick={() => router.back()}
          className="inline-flex h-9 w-9 items-center justify-center rounded-full text-indigo-700 hover:bg-indigo-50"
          aria-label="Back"
          title="Back"
        >
          ←
        </button>
        <h1 className="text-2xl font-semibold text-indigo-900">{teacher.name}</h1>
      </div>

      {/* Photo */}
      <div className="mb-8 flex justify-center">
        <div className="rounded-lg border border-gray-200 p-2">
          <Image
            src={teacher.photo || '/file.svg'}
            alt={teacher.name || 'Teacher'}
            width={180}
            height={180}
            className="rounded-md object-cover"
            priority
          />
        </div>
      </div>

      <div className="mx-auto max-w-3xl">
        <Row label="Full Name" value={teacher.name} />
        <Row label="NIC" value={teacher.nic} />
        <Row label="Address" value={teacher.address} />
        <Row label="Contact Number" value={teacher.contactNumber} />
        <Row label="Email" value={teacher.email} />
        <Row label="Birth Date" value={teacher.birthDate} />
        <Row label="Grade" value={teacher.grade} />
        <Row label="Service Type" value={teacher.serviceType} />
        <Row label="First Appointment Date" value={teacher.firstAppointmentDate} />
      </div>

      <div className="mt-10">
        <button
          type="button"
          className="rounded-md bg-[#2C64CF] px-5 py-2.5 text-white font-medium hover:opacity-95"
        >
          Download
        </button>
      </div>
    </section>
  );
}