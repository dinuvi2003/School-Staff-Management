'use client';
import React from 'react'

export default function LoginForm() {
  return (
    <section className="mx-auto mt-10 w-full max-w-md rounded-2xl bg-white p-8 shadow min-h-[300px]">
      <h2 className="mb-6 text-center text-lg font-semibold">Admin Login</h2>

      <form className="space-y-6">
        <div>
          <label htmlFor="nic" className="mb-1 block text-sm font-medium text-gray-700">
            NIC
          </label>
          <input
            id="nic"
            name="nic"
            type="text"
            placeholder="Enter your NIC"
            className="w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm outline-none focus:border-gray-400"
            autoComplete="username"
            required
          />
        </div>

        <div>
          <label htmlFor="password" className="mb-1 block text-sm font-medium text-gray-700">
            Password
          </label>
          <div className="relative">
            <input
              id="password"
              name="password"
              // type={passwordVisible ? "text" : "password"}
              placeholder="Enter your password"
              className="w-full rounded-md border border-gray-300 bg-white px-3 py-2 pr-10 text-sm outline-none focus:border-gray-400"
              autoComplete="current-password"
              required
            />
            <button
              type="button"
              // onClick={() => setPasswordVisible((v) => !v)}
              className="absolute inset-y-0 right-0 flex items-center px-3 text-gray-500 hover:text-gray-700"
              // aria-label={passwordVisible ? "Hide password" : "Show password"}
            >
              {/* {passwordVisible ? (
                
                <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="1.7">
                  <path d="M3 3l18 18" />
                  <path d="M9.9 4.3A10.6 10.6 0 0121 12c-1.2 2.6-3.4 4.9-6.2 6.2M3 12a10.6 10.6 0 016.2-6.2" />
                  <path d="M10.6 10.6a3 3 0 004.24 4.24" />
                </svg>
              ) : ( */}
                
                <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="1.7">
                  <path d="M2 12s3.5-7 10-7 10 7 10 7-3.5 7-10 7S2 12 2 12z" />
                  <circle cx="12" cy="12" r="3" />
                </svg>
              {/* )} */}
            </button>
          </div>
        </div>

        <button
          type="submit"
          // disabled={submitting}
          className="w-full rounded-md bg-[#1E56C5] px-4 py-2 text-sm font-semibold text-white disabled:opacity-60"
        >
          Login
        </button>
      </form>
    </section>
  )
}

