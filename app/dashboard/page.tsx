"use client"

import { useSession } from "next-auth/react"
import { useRouter } from "next/navigation"
import { useEffect, useState } from "react"
import Link from "next/link"

interface Project {
  id: string
  name: string
  description?: string
  _count: { tasks: number }
}

interface Task {
  id: string
  title: string
  status: string
  dueDate?: string
  project: { name: string }
}

export default function Dashboard() {
  const { data: session, status } = useSession()
  const router = useRouter()
  const [projects, setProjects] = useState<Project[]>([])
  const [tasks, setTasks] = useState<Task[]>([])

  useEffect(() => {
    if (status === "loading") return
    if (!session) {
      router.push("/auth/signin")
      return
    }

    fetchProjects()
    fetchTasks()
  }, [session, status, router])

  const fetchProjects = async () => {
    const res = await fetch("/api/projects")
    if (res.ok) {
      const data = await res.json()
      setProjects(data)
    }
  }

  const fetchTasks = async () => {
    const res = await fetch("/api/tasks")
    if (res.ok) {
      const data = await res.json()
      setTasks(data)
    }
  }

  const overdueTasks = tasks.filter(task => task.dueDate && new Date(task.dueDate) < new Date())

  if (status === "loading") {
    return <div className="min-h-screen flex items-center justify-center">Loading...</div>
  }

  if (!session) {
    return null
  }

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100">
      <div className="absolute inset-x-0 top-0 h-72 bg-gradient-to-r from-indigo-600 via-slate-900 to-slate-950 opacity-80 blur-3xl" />
      <div className="relative mx-auto max-w-7xl px-6 py-8 lg:px-8">
        <header className="mb-8 rounded-[2rem] border border-white/10 bg-slate-900/80 p-6 shadow-2xl shadow-slate-950/20 backdrop-blur-xl">
          <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
            <div>
              <p className="text-sm font-semibold uppercase tracking-[0.24em] text-indigo-300/80">Dashboard</p>
              <h1 className="mt-3 text-3xl font-semibold tracking-tight text-white sm:text-4xl">Your workspace overview</h1>
              <p className="mt-2 max-w-2xl text-sm text-slate-300 sm:text-base">
                Track active projects, assigned tasks, and overdue priorities from one beautiful control center.
              </p>
            </div>
            <div className="flex flex-col gap-3 sm:flex-row">
              <Link href="/projects/new" className="btn-primary">
                New Project
              </Link>
              <button
                onClick={() => router.push("/auth/signin")}
                className="rounded-full border border-slate-700 bg-slate-900/90 px-5 py-2.5 text-sm font-semibold text-slate-100 transition hover:bg-slate-800/90"
              >
                Sign out
              </button>
            </div>
          </div>
        </header>

        <div className="grid gap-6 xl:grid-cols-[1.3fr_0.9fr]">
          <section className="space-y-6">
            <div className="card-soft p-6">
              <div className="flex items-center justify-between gap-4">
                <div>
                  <p className="text-sm text-slate-400">Active projects</p>
                  <h2 className="mt-2 text-3xl font-semibold text-white">{projects.length}</h2>
                </div>
                <div className="rounded-3xl bg-indigo-600/10 px-4 py-3 text-indigo-100">
                  Latest updates
                </div>
              </div>
            </div>
            <div className="grid gap-6 md:grid-cols-2">
              <div className="card-soft p-6">
                <p className="text-sm text-slate-400">Assigned tasks</p>
                <p className="mt-3 text-3xl font-semibold text-white">{tasks.length}</p>
              </div>
              <div className="card-soft p-6">
                <p className="text-sm text-slate-400">Overdue</p>
                <p className="mt-3 text-3xl font-semibold text-rose-300">{overdueTasks.length}</p>
              </div>
            </div>
            <div className="card-soft p-6">
              <div className="flex items-center justify-between gap-4">
                <div>
                  <h3 className="text-lg font-semibold text-white">Recent projects</h3>
                  <p className="mt-1 text-sm text-slate-400">Quick access to your open workspaces.</p>
                </div>
              </div>
              <div className="mt-6 space-y-4">
                {projects.length === 0 ? (
                  <p className="text-slate-400">No projects yet. Create one to get started.</p>
                ) : (
                  projects.map((project) => (
                    <Link
                      key={project.id}
                      href={`/projects/${project.id}`}
                      className="group block rounded-3xl border border-slate-200/5 bg-slate-950/70 p-5 transition hover:border-indigo-400/30 hover:bg-slate-900"
                    >
                      <div className="flex items-center justify-between gap-4">
                        <div>
                          <p className="text-base font-semibold text-white">{project.name}</p>
                          <p className="mt-1 text-sm text-slate-400">{project._count.tasks} tasks</p>
                        </div>
                        <span className="rounded-full bg-indigo-500/15 px-3 py-1 text-xs font-semibold uppercase tracking-[0.2em] text-indigo-200">
                          View
                        </span>
                      </div>
                    </Link>
                  ))
                )}
              </div>
            </div>
          </section>

          <aside className="space-y-6">
            <div className="card-soft p-6">
              <h3 className="text-lg font-semibold text-white">My Tasks</h3>
              <p className="mt-1 text-sm text-slate-400">Recent assignments and due dates.</p>
              <div className="mt-6 space-y-4">
                {tasks.length === 0 ? (
                  <p className="text-slate-400">No tasks assigned yet.</p>
                ) : (
                  tasks.slice(0, 5).map((task) => (
                    <div key={task.id} className="rounded-3xl border border-slate-200/5 bg-slate-900/70 p-4">
                      <div className="flex items-start justify-between gap-4">
                        <div>
                          <p className="text-sm font-semibold text-white">{task.title}</p>
                          <p className="mt-1 text-xs text-slate-500">{task.project.name}</p>
                        </div>
                        <span className="rounded-full bg-slate-800 px-3 py-1 text-xs text-slate-300">{task.status}</span>
                      </div>
                      {task.dueDate && (
                        <p className="mt-3 text-sm text-slate-400">Due {new Date(task.dueDate).toLocaleDateString()}</p>
                      )}
                    </div>
                  ))
                )}
              </div>
            </div>
            {overdueTasks.length > 0 && (
              <div className="card-soft p-6 border-l-4 border-rose-400/80 bg-rose-500/5">
                <h3 className="text-lg font-semibold text-white">Overdue Alerts</h3>
                <p className="mt-2 text-sm text-slate-300">You have tasks that need immediate attention.</p>
                <ul className="mt-4 space-y-2 text-sm text-rose-200">
                  {overdueTasks.map((task) => (
                    <li key={task.id}>• {task.title} — due {new Date(task.dueDate!).toLocaleDateString()}</li>
                  ))}
                </ul>
              </div>
            )}
          </aside>
        </div>
      </div>
    </div>
  )
}