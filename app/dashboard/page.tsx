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
    return <div>Loading...</div>
  }

  if (!session) {
    return null
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white shadow">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-6">
            <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
            <div className="flex items-center space-x-4">
              <span>Welcome, {session.user?.name}</span>
              <button
                onClick={() => router.push("/auth/signin")}
                className="text-indigo-600 hover:text-indigo-900"
              >
                Sign out
              </button>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        <div className="px-4 py-6 sm:px-0">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Projects */}
            <div className="bg-white overflow-hidden shadow rounded-lg">
              <div className="p-5">
                <div className="flex items-center justify-between">
                  <h3 className="text-lg leading-6 font-medium text-gray-900">Projects</h3>
                  <Link
                    href="/projects/new"
                    className="bg-indigo-600 text-white px-3 py-1 rounded text-sm hover:bg-indigo-700"
                  >
                    New Project
                  </Link>
                </div>
                <div className="mt-5">
                  {projects.length === 0 ? (
                    <p className="text-gray-500">No projects yet.</p>
                  ) : (
                    <ul className="divide-y divide-gray-200">
                      {projects.map((project) => (
                        <li key={project.id} className="py-4">
                          <div className="flex items-center justify-between">
                            <div>
                              <p className="text-sm font-medium text-gray-900">{project.name}</p>
                              <p className="text-sm text-gray-500">{project._count.tasks} tasks</p>
                            </div>
                            <Link
                              href={`/projects/${project.id}`}
                              className="text-indigo-600 hover:text-indigo-900"
                            >
                              View
                            </Link>
                          </div>
                        </li>
                      ))}
                    </ul>
                  )}
                </div>
              </div>
            </div>

            {/* Tasks */}
            <div className="bg-white overflow-hidden shadow rounded-lg">
              <div className="p-5">
                <h3 className="text-lg leading-6 font-medium text-gray-900">My Tasks</h3>
                <div className="mt-5">
                  {tasks.length === 0 ? (
                    <p className="text-gray-500">No tasks assigned.</p>
                  ) : (
                    <ul className="divide-y divide-gray-200">
                      {tasks.slice(0, 5).map((task) => (
                        <li key={task.id} className="py-4">
                          <div className="flex items-center justify-between">
                            <div>
                              <p className="text-sm font-medium text-gray-900">{task.title}</p>
                              <p className="text-sm text-gray-500">{task.project.name}</p>
                              <p className="text-xs text-gray-400">{task.status}</p>
                            </div>
                            {task.dueDate && (
                              <span className={`text-xs ${new Date(task.dueDate) < new Date() ? 'text-red-500' : 'text-gray-500'}`}>
                                Due: {new Date(task.dueDate).toLocaleDateString()}
                              </span>
                            )}
                          </div>
                        </li>
                      ))}
                    </ul>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Overdue Tasks */}
          {overdueTasks.length > 0 && (
            <div className="mt-8 bg-red-50 border border-red-200 rounded-lg p-4">
              <h3 className="text-lg font-medium text-red-800">Overdue Tasks</h3>
              <ul className="mt-2">
                {overdueTasks.map((task) => (
                  <li key={task.id} className="text-sm text-red-700">
                    {task.title} - Due: {new Date(task.dueDate!).toLocaleDateString()}
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
      </main>
    </div>
  )
}