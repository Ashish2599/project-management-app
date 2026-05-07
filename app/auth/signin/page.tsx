"use client"

import { useState } from "react"
import { signIn } from "next-auth/react"
import { useRouter } from "next/navigation"
import Link from "next/link"

export default function SignIn() {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [error, setError] = useState("")
  const router = useRouter()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    const result = await signIn("credentials", {
      email,
      password,
      redirect: false,
    })
    if (result?.error) {
      setError("Invalid credentials")
    } else {
      router.push("/dashboard")
    }
  }

  return (
    <div className="min-h-screen bg-slate-950 text-white">
      <div className="absolute inset-x-0 top-0 h-72 bg-gradient-to-r from-indigo-500 via-slate-900 to-slate-950 opacity-80 blur-3xl" />
      <div className="relative mx-auto flex min-h-screen max-w-4xl items-center justify-center px-6 py-16 lg:px-8">
        <div className="grid w-full gap-10 rounded-[2rem] border border-white/10 bg-white/10 p-8 shadow-2xl shadow-slate-950/20 backdrop-blur-xl lg:grid-cols-[1.1fr_0.9fr]">
          <div className="space-y-6">
            <div className="space-y-3">
              <p className="text-sm font-semibold uppercase tracking-[0.24em] text-indigo-300/80">Secure login</p>
              <h1 className="text-4xl font-semibold tracking-tight text-white sm:text-5xl">Welcome back</h1>
              <p className="max-w-xl text-sm leading-6 text-slate-300">
                Sign in to manage your projects, assign tasks, and stay on top of team progress.
              </p>
            </div>
            <div className="rounded-3xl border border-slate-200/10 bg-slate-950/80 p-6">
              <p className="text-sm uppercase tracking-[0.24em] text-slate-400">Benefits</p>
              <ul className="mt-4 space-y-3 text-sm text-slate-300">
                <li>• Clean project dashboards</li>
                <li>• Role-based access control</li>
                <li>• Overdue task alerts</li>
              </ul>
            </div>
          </div>
          <div className="rounded-[2rem] border border-white/10 bg-slate-100/95 p-8 shadow-lg shadow-slate-950/10 text-slate-950">
            <h2 className="text-2xl font-semibold">Sign in</h2>
            <p className="mt-2 text-sm text-slate-500">Use your email and password to access the workspace.</p>
            <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
              <div className="space-y-4">
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
                    placeholder="Enter your password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                  />
                </div>
              </div>
              {error && <p className="text-sm text-red-500">{error}</p>}
              <button type="submit" className="btn-primary w-full">Sign in</button>
              <p className="text-center text-sm text-slate-500">
                Don’t have an account?{' '}
                <Link href="/auth/signup" className="font-semibold text-indigo-600 hover:text-indigo-500">
                  Sign up
                </Link>
              </p>
            </form>
          </div>
        </div>
      </div>
    </div>
  )
}