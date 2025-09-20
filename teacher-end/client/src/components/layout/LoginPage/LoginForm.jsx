'use client';

import { useState } from 'react';

const API_BASE = process.env.NEXT_PUBLIC_API_BASE || 'http://localhost:5000';
const LANDING = process.env.NEXT_PUBLIC_LANDING_URL || 'http://localhost:5000/api/auth/landing';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPw, setShowPw] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  async function handleSubmit(e) {
    e.preventDefault();
    setError('');
    setLoading(true);
    console.log(email, password)
    try {
      const res = await fetch(`${API_BASE}/api/auth/login`, {
        method: 'POST',
        credentials: 'include',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: email.trim(), password })
      });
      const json = await res.json();
      if (!res.ok || !json?.ok) {
        throw new Error(json?.errors?.message || 'Login failed');
      }

      // Let the server redirect based on role (ADMIN -> 3001, TEACHER -> 3000)
      window.location.href = LANDING;
    } catch (err) {
      setError(err?.message || 'Login failed');
      setLoading(false);
    }
  }

  return (
    <section className="mx-auto mt-10 w-full max-w-[400px] rounded-2xl bg-white p-8 shadow min-h-[300px]">
      {error ? (
        <div className="mb-4 rounded-md border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700">
          {error}
        </div>
      ) : null}
      <h2 className="mb-6 text-center text-lg font-semibold">Staff Login</h2>

      <form className="space-y-6">
        <div>
          <label htmlFor="email" className="mb-1 block text-sm font-medium text-gray-700">
            Email
          </label>
          <input
            id="email"
            name="email"
            type="email"
            inputMode='email'
            autoComplete='email'
            placeholder="Enter your email"
            className="w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm outline-none focus:border-gray-400"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
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
              type={showPw ? "text" : "password"}
              placeholder="Enter your password"
              className="w-full rounded-md border border-gray-300 bg-white px-3 py-2 pr-10 text-sm outline-none focus:border-gray-400"
              autoComplete="current-password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
            <button
              type="button"
              onClick={() => setShowPw((v) => !v)}
              className="absolute inset-y-0 right-0 flex items-center px-3 text-gray-500 hover:text-gray-700"
              aria-label={showPw ? "Hide password" : "Show password"}
              title={showPw ? 'Hide password' : 'Show password'}
            >
              {showPw ? (
                // eye-off
                <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="1.7">
                  <path d="M3 3l18 18" />
                  <path d="M10 6.5C11.2 6.17 12.56 6 14 6c6.5 0 10 6 10 6a18.4 18.4 0 01-6.1 6.1" />
                  <path d="M10.6 10.6a3 3 0 004.24 4.24" />
                  <path d="M3.9 9A18.4 18.4 0 0110 6.5" />
                </svg>
              ) : (
                // eye
                <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="1.7">
                  <path d="M2 12s3.5-7 10-7 10 7 10 7-3.5 7-10 7S2 12 2 12z" />
                  <circle cx="12" cy="12" r="3" />
                </svg>
              )}
            </button>
          </div>
        </div>

        <button
          type="button"
          disabled={loading}
          onClick={handleSubmit}
          className="w-full rounded-md bg-[#1E56C5] px-4 py-2 text-sm font-semibold text-white disabled:opacity-60"
        >
          {loading ? 'Signing in…' : 'Login'}
        </button>
      </form>
    </section>
  )
}