"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"

export default function SignUp() {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [name, setName] = useState("")
  const [error, setError] = useState("")
  const [success, setSuccess] = useState("")
  const router = useRouter()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError("")
    setSuccess("")

    const res = await fetch("/api/auth/register", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ email, password, name }),
    })

    if (res.ok) {
      setSuccess("Account created successfully! Please sign in.")
      setTimeout(() => router.push("/auth/signin"), 2000)
    } else {
      const data = await res.json()
      setError(data.error || "Something went wrong")
    }
  }

  return (
    <div className="min-h-screen bg-slate-950 text-white">
      <div className="absolute inset-x-0 top-0 h-72 bg-gradient-to-r from-fuchsia-500 via-slate-900 to-slate-950 opacity-80 blur-3xl" />
      <div className="relative mx-auto flex min-h-screen max-w-4xl items-center justify-center px-6 py-16 lg:px-8">
        <div className="grid w-full gap-10 rounded-[2rem] border border-white/10 bg-white/10 p-8 shadow-2xl shadow-slate-950/20 backdrop-blur-xl lg:grid-cols-[1.1fr_0.9fr]">
          <div className="space-y-6">
            <div className="space-y-3">
              <p className="text-sm font-semibold uppercase tracking-[0.24em] text-fuchsia-300/80">Create account</p>
              <h1 className="text-4xl font-semibold tracking-tight text-white sm:text-5xl">Join your team workspace</h1>
              <p className="max-w-xl text-sm leading-6 text-slate-300">
                Sign up for the project and task manager built for collaboration, deadlines, and role control.
              </p>
            </div>
            <div className="rounded-3xl border border-slate-200/10 bg-slate-950/80 p-6">
              <p className="text-sm uppercase tracking-[0.24em] text-slate-400">Why join?</p>
              <ul className="mt-4 space-y-3 text-sm text-slate-300">
                <li>• Keep projects and tasks organized</li>
                <li>• Manage teams and roles</li>
                <li>• Stay ahead of overdue items</li>
              </ul>
            </div>
          </div>
          <div className="rounded-[2rem] border border-white/10 bg-slate-100/95 p-8 shadow-lg shadow-slate-950/10 text-slate-950">
            <h2 className="text-2xl font-semibold">Sign up</h2>
            <p className="mt-2 text-sm text-slate-500">Create your account to start managing projects.</p>
            <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
              <div className="space-y-4">
                <div>
                  <label htmlFor="name" className="block text-sm font-medium text-slate-700">Full name</label>
                  <input
                    id="name"
                    name="name"
                    type="text"
                    required
                    className="input-field"
                    placeholder="Jane Doe"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                  />
                </div>
                <div>
                  <label htmlFor="email" className="block text-sm font-medium text-slate-700">Email address</label>
                  <input
                    id="email"
                    name="email"
                    type="email"
                    required
                    className="input-field"
                    placeholder="you@example.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                  />
                </div>
                <div>
                  <label htmlFor="password" className="block text-sm font-medium text-slate-700">Password</label>
                  <input
                    id="password"
                    name="password"
                    type="password"
                    required
                    className="input-field"
                    placeholder="Create a password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                  />
                </div>
              </div>
              {error && <p className="text-sm text-red-500">{error}</p>}
              {success && <p className="text-sm text-emerald-500">{success}</p>}
              <button type="submit" className="btn-primary w-full">Sign up</button>
              <p className="text-center text-sm text-slate-500">
                Already have an account?{' '}
                <Link href="/auth/signin" className="font-semibold text-indigo-600 hover:text-indigo-500">
                  Sign in
                </Link>
              </p>
            </form>
          </div>
        </div>
      </div>
    </div>
  )
}