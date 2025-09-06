'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '../../../context/AuthContext';

export default function LoginForm() {

  const router = useRouter();
  const { login } = useAuth();

  const [nic, setNic] = useState('');
  const [password, setPassword] = useState('');
  const [passwordVisible, setPasswordVisible] = useState(false);
  const [loading, setLoading] = useState(false);
  const [err, setErr] = useState('');


  // temporaty handle
  const handleLoginButtonTemp = () => {
    router.replace('/teacher-dashboard');
  }

  async function onSubmit(e) {
    e.preventDefault();
    setErr('');
    setLoading(true);
    try {
      const res = await login({ nic, password });
      if (!res?.ok) {
        setErr(res?.error || 'Login failed');
        return;
      }
      router.replace('/');
    } catch (e) {
      setErr(e?.message || 'Login failed');
    } finally {
      setLoading(false);
    }
  }

  return (
    <section className="mx-auto mt-10 w-full max-w-[400px] rounded-2xl bg-white p-8 shadow min-h-[300px]">
      <h2 className="mb-6 text-center text-lg font-semibold">Staff Login</h2>

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
            value={nic}
            onChange={(e) => setNic(e.target.value)}
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
              type={passwordVisible ? "text" : "password"}
              placeholder="Enter your password"
              className="w-full rounded-md border border-gray-300 bg-white px-3 py-2 pr-10 text-sm outline-none focus:border-gray-400"
              autoComplete="current-password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
            <button
              type="button"
              onClick={() => setPasswordVisible((v) => !v)}
              className="absolute inset-y-0 right-0 flex items-center px-3 text-gray-500 hover:text-gray-700"
              aria-label={passwordVisible ? "Hide password" : "Show password"}
              title={passwordVisible ? 'Hide password' : 'Show password'}
            >
              {passwordVisible ? (
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
          onClick={handleLoginButtonTemp}
          disabled={loading}
          className="w-full rounded-md bg-[#1E56C5] px-4 py-2 text-sm font-semibold text-white disabled:opacity-60"
        >
          {loading ? 'Signing in…' : 'Login'}
        </button>
      </form>
    </section>
  )
}
