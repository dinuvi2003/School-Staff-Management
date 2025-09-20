"use client";

import { useSearchParams } from "next/navigation";
import { useMemo, useState, useEffect } from "react";

function setCookie(name, value, minutes) {
    const d = new Date();
    d.setTime(d.getTime() + minutes * 60 * 1000);
    document.cookie = `${name} = ${value}; expires=${d.toUTCString()}; path=/; SameSite=Lax`;
}

function clearCookie(name) {
    document.cookie = `${name}=; Max-Age=0; path=/; SameSite=Lax`;
}

export default function ActivatePage() {

    const API_BASE = process.env.NEXT_PUBLIC_API_BASE || "http://localhost:5000";

    console.log("Api base ", API_BASE);

    const params = useSearchParams();
    const token = params.get('token');
    const uid = params.get('uid');

    console.log("Token and UID from params:", token, uid);

    const [pw, setPw] = useState("");
    const [confirmPw, setConfirmPw] = useState("");
    const [error, setError] = useState("");
    const [success, setSuccess] = useState("");
    const [loading, setLoading] = useState(false);
    const [validating, setValidating] = useState(true);
    const [submitting, setSubmitting] = useState(false);

    const validForm = useMemo(() => pw && pw.length >= 10 && pw === confirmPw, [pw, confirmPw]);

    useEffect(() => {
        setCookie('activation_lock', '1', 60);

        console.log("Validating token and uid:", token, uid);

        const entoken = encodeURIComponent(token);
        const enuid = encodeURIComponent(uid);

        console.log("Validating token and uid:", entoken, enuid);

        async function validate() {
            setValidating(true); setError('');
            try {
                const res = await fetch(`${API_BASE}/api/invite/validate?user_id=${encodeURIComponent(uid)}&token=${encodeURIComponent(token)}`, {
                    method: 'POST',
                    credentials: 'include'
                });
                const data = await res.json();
                if (!res.ok || !data?.ok) throw new Error(data?.errors?.message || 'Link is invalid or expired');
                console.log("Validation success:", data);
                setSuccess('Link validated! You can now set your password.');
            } catch (e) {
                setError(e?.message || 'Link is invalid or expired');
            } finally {
                setValidating(false);
            }
        }

        if (!token || !uid) {
            setError('Missing token or user ID');
            setValidating(false);
        }

        validate();

    }, [token, uid]);


    async function handleActivate(e) {
        e.preventDefault();
        if (!validForm) return;

        setSubmitting(true);
        setError('');
        setSuccess('');

        try {
            const res = await fetch(`${API_BASE}/api/invite/activate`, {
                method: 'POST',
                credentials: 'include',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    token: token,
                    user_id: uid,
                    password: pw
                })
            });

            const data = await res.json();
            if (!res.ok || !data?.ok) throw new Error(data?.errors?.message || 'Activation failed');
            setSuccess('Password set successfully! You can now log in.');
            clearCookie('activate_token');

            window.location.href = 'http://localhost:3000/login'

        } catch (e) {
            setError(e?.message || 'Activation failed');
        } finally {
            setSubmitting(false);
        }
    }

    if (validating) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gray-100">
                <div className="p-6 bg-white rounded shadow text-center">
                    <p className="text-gray-700">Validating link...</p>
                </div>
            </div>
        )
    }

    if (error && !validating && !success) {
        return (
            <section className="mx-auto mt-10 w-full max-w-[480px] rounded-2xl bg-white p-8 shadow">
                <h2 className="mb-3 text-lg font-semibold">Activation Problem</h2>
                <p className="mb-4 text-sm text-red-600">{error}</p>
                <p className="text-sm text-gray-600">Ask your admin to resend the invite and try again.</p>
            </section>
        )
    }

    return (
        <section className="mx-auto mt-10 w-full max-w-[480px] rounded-2xl bg-white p-8 shadow">
            <h2 className="mb-2 text-lg font-semibold">Set your password</h2>
            <p className="mb-6 text-sm text-gray-600">Choose a strong password (min 10 characters).</p>

            <form onSubmit={handleActivate} className="space-y-5">
                <div>
                    <label className="mb-1 block text-sm font-medium">New password</label>
                    <input
                        type="password"
                        className="w-full rounded-md border px-3 py-2 text-sm"
                        value={pw}
                        onChange={(e) => setPw(e.target.value)}
                        minLength={10}
                        required
                    />
                </div>
                <div>
                    <label className="mb-1 block text-sm font-medium">Confirm password</label>
                    <input
                        type="password"
                        className="w-full rounded-md border px-3 py-2 text-sm"
                        value={confirmPw}
                        onChange={(e) => setConfirmPw(e.target.value)}
                        minLength={10}
                        required
                    />
                </div>

                <button
                    type="submit"
                    disabled={!validForm || submitting}
                    className="w-full rounded-md bg-[#1E56C5] px-4 py-2 text-sm font-semibold text-white disabled:opacity-60"
                >
                    {submitting ? 'Saving…' : 'Set Password'}
                </button>

                {success ? <p className="mt-4 text-sm text-green-600">{success}</p> : null}
            </form>
        </section>
    )
}

