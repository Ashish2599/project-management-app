"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { useSession } from "next-auth/react"
import Link from "next/link"

export default function NewProject() {
  const router = useRouter()
  const { data: session, status } = useSession()
  const [name, setName] = useState("")
  const [description, setDescription] = useState("")
  const [error, setError] = useState("")
  const [loading, setLoading] = useState(false)

  if (status === "loading") return <div>Loading...</div>
  if (!session) {
    router.push("/auth/signin")
    return null
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError("")
    setLoading(true)

    try {
      const res = await fetch("/api/projects", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, description }),
      })

      if (res.ok) {
        router.push("/dashboard")
      } else {
        setError("Failed to create project")
      }
    } catch (err) {
      setError("Something went wrong")
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-slate-950 text-white">
      <div className="absolute inset-x-0 top-0 h-72 bg-gradient-to-r from-cyan-500 via-slate-900 to-slate-950 opacity-80 blur-3xl" />
      <div className="relative mx-auto max-w-4xl px-6 py-16 lg:px-8">
        <div className="rounded-[2rem] border border-white/10 bg-slate-900/90 p-8 shadow-2xl shadow-slate-950/20 backdrop-blur-xl">
          <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
            <div>
              <p className="text-sm font-semibold uppercase tracking-[0.24em] text-cyan-300/80">New project</p>
              <h1 className="mt-3 text-4xl font-semibold tracking-tight text-white">Create your next project</h1>
              <p className="mt-2 text-sm text-slate-300">Add new workspaces and organize tasks with your team.</p>
            </div>
            <Link href="/dashboard" className="rounded-full border border-slate-700 bg-slate-950/80 px-5 py-2.5 text-sm font-semibold text-slate-100 transition hover:bg-slate-800/90">
              Back to dashboard
            </Link>
          </div>

          <div className="mt-10 rounded-3xl border border-white/10 bg-slate-100/95 p-8 text-slate-950 shadow-lg shadow-slate-950/10">
            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-slate-700">Project Name</label>
                <input
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="input-field"
                  placeholder="Enter project name"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700">Description</label>
                <textarea
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  className="input-field min-h-[140px] resize-none"
                  placeholder="Describe the project goals"
                  rows={4}
                />
              </div>
              {error && <p className="text-sm text-red-500">{error}</p>}
              <button type="submit" disabled={loading} className="btn-primary w-full">
                {loading ? "Creating..." : "Create Project"}
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  )
}