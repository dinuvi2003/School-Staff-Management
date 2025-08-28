'use client';
import React from 'react'
import Image from "next/image";

export default function AdminHeader ({
  logoSrc = "/government-logo.png",
  org = "Sri Lanka School",
  product = "Staff Management",
  user = { name: "Nadeemali Gamage", avatar: "/avatar.png" },
}) {
  return (
    <header className="w-full border-b bg-white">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-3">
        <div className="flex items-center gap-3">
          <Image src={logoSrc} alt="Logo" width={36} height={36} priority />
          <div className="leading-tight">
            <p className="text-xs font-medium">{org}</p>
            <p className="text-sm font-semibold">{product}</p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <div className="text-right leading-tight">
            <p className="text-sm font-semibold">{user.name}</p>
          </div>
          <Image src={user.avatar} alt={user.name} width={36} height={36} className="rounded-full" />
        </div>
      </div>
    </header>
  )
}
