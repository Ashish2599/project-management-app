"use client"

import { useSession } from "next-auth/react"
import { useRouter } from "next/navigation"
import { useEffect } from "react"
import Link from "next/link"

export default function Home() {
  const { data: session, status } = useSession()
  const router = useRouter()

  useEffect(() => {
    if (status === "loading") return
    if (session) {
      router.push("/dashboard")
    }
  }, [session, status, router])

  if (status === "loading") {
    return <div className="min-h-screen flex items-center justify-center">Loading...</div>
  }

  if (session) {
    return null
  }

  return (
    <div className="min-h-screen bg-slate-950 text-white overflow-hidden">
      <div className="absolute inset-x-0 top-0 h-72 bg-indigo-600/30 blur-3xl" />
      <div className="relative mx-auto flex min-h-screen max-w-6xl flex-col justify-center px-6 py-24 lg:px-8">
        <div className="grid gap-10 lg:grid-cols-[1.2fr_0.8fr] lg:items-center">
          <div className="space-y-8">
            <div className="inline-flex items-center gap-2 rounded-full bg-white/10 px-4 py-1 text-sm text-white/80 ring-1 ring-white/10">
              Live project tracker
            </div>
            <div className="space-y-4">
              <h1 className="text-5xl font-semibold tracking-tight text-white sm:text-6xl">
                Build better teams and ship projects faster.
              </h1>
              <p className="max-w-xl text-lg leading-8 text-slate-200">
                Secure project boards, role-based collaboration, task tracking, and overdue alerts—all in one elegant app.
              </p>
            </div>
            <div className="flex flex-col gap-4 sm:flex-row">
              <Link href="/auth/signup" className="btn-primary">
                Get started
              </Link>
              <Link href="/auth/signin" className="inline-flex items-center justify-center rounded-full border border-white/15 bg-white/10 px-5 py-2.5 text-sm font-semibold text-white transition hover:border-white/40 hover:bg-white/15">
                Sign in
              </Link>
            </div>
          </div>
          <div className="rounded-[2rem] border border-white/10 bg-white/10 p-8 shadow-[0_40px_120px_-40px_rgba(15,23,42,0.8)] backdrop-blur-xl">
            <div className="rounded-3xl bg-slate-950/80 p-6 text-slate-100 ring-1 ring-white/10">
              <div className="flex items-center justify-between gap-4">
                <div>
                  <p className="text-xs uppercase tracking-[0.28em] text-indigo-300">Project</p>
                  <h2 className="mt-2 text-2xl font-semibold">Team Launch</h2>
                </div>
                <span className="rounded-full bg-indigo-500/20 px-3 py-1 text-xs font-semibold text-indigo-100">In progress</span>
              </div>
              <div className="mt-6 space-y-4">
                <div className="rounded-3xl bg-slate-900/80 p-4">
                  <p className="text-sm text-slate-400">Tasks completed</p>
                  <p className="mt-2 text-xl font-semibold">18 / 27</p>
                </div>
                <div className="grid gap-3 sm:grid-cols-2">
                  <div className="rounded-3xl bg-slate-900/80 p-4">
                    <p className="text-sm text-slate-400">Overdue</p>
                    <p className="mt-2 text-xl font-semibold text-rose-300">3</p>
                  </div>
                  <div className="rounded-3xl bg-slate-900/80 p-4">
                    <p className="text-sm text-slate-400">Team members</p>
                    <p className="mt-2 text-xl font-semibold text-emerald-300">7</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
