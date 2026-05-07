"use client"

import { useState, useEffect } from "react"
import { useRouter, useParams } from "next/navigation"
import { useSession } from "next-auth/react"
import Link from "next/link"

interface Task {
  id: string
  title: string
  description?: string
  status: string
  dueDate?: string
  assignedTo?: {
    name: string
    email: string
  }
}

interface Project {
  id: string
  name: string
  description?: string
  owner: {
    name: string
    email: string
  }
  members: Array<{
    user: {
      id: string
      name: string
      email: string
    }
    role: string
  }>
}

export default function ProjectDetails() {
  const router = useRouter()
  const params = useParams()
  const { data: session, status } = useSession()
  const projectId = params.id as string
  
  const [project, setProject] = useState<Project | null>(null)
  const [tasks, setTasks] = useState<Task[]>([])
  const [loading, setLoading] = useState(true)
  const [showTaskForm, setShowTaskForm] = useState(false)
  const [taskTitle, setTaskTitle] = useState("")
  const [taskDescription, setTaskDescription] = useState("")
  const [taskDueDate, setTaskDueDate] = useState("")

  if (status === "loading") return <div>Loading...</div>
  if (!session) {
    router.push("/auth/signin")
    return null
  }

  useEffect(() => {
    fetchProject()
    fetchTasks()
  }, [projectId])

  const fetchProject = async () => {
    try {
      const res = await fetch(`/api/projects/${projectId}`)
      if (res.ok) {
        const data = await res.json()
        setProject(data)
      } else {
        console.error("Error fetching project:", res.status, await res.text())
      }
    } catch (err) {
      console.error("Fetch error:", err)
    }
    setLoading(false)
  }

  const fetchTasks = async () => {
    try {
      const res = await fetch(`/api/projects/${projectId}/tasks`)
      if (res.ok) {
        const data = await res.json()
        setTasks(data)
      }
    } catch (err) {
      console.error("Error fetching tasks:", err)
    }
  }

  const handleCreateTask = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!taskTitle) return

    const res = await fetch(`/api/projects/${projectId}/tasks`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        title: taskTitle,
        description: taskDescription,
        dueDate: taskDueDate || undefined,
      }),
    })

    if (res.ok) {
      setTaskTitle("")
      setTaskDescription("")
      setTaskDueDate("")
      setShowTaskForm(false)
      fetchTasks()
    }
  }

  if (loading) return <div className="p-8">Loading...</div>
  if (!project) return <div className="p-8">Project not found</div>

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white shadow">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <Link href="/dashboard" className="text-indigo-600 hover:text-indigo-900 mb-4">
            ← Back to Dashboard
          </Link>
          <h1 className="text-3xl font-bold text-gray-900">{project.name}</h1>
          {project.description && <p className="text-gray-600 mt-2">{project.description}</p>}
        </div>
      </header>

      <main className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="bg-white overflow-hidden shadow rounded-lg p-4">
            <p className="text-gray-500 text-sm">Owner</p>
            <p className="text-lg font-semibold">{project.owner.name}</p>
          </div>
          <div className="bg-white overflow-hidden shadow rounded-lg p-4">
            <p className="text-gray-500 text-sm">Members</p>
            <p className="text-lg font-semibold">{project.members.length}</p>
          </div>
          <div className="bg-white overflow-hidden shadow rounded-lg p-4">
            <p className="text-gray-500 text-sm">Total Tasks</p>
            <p className="text-lg font-semibold">{tasks.length}</p>
          </div>
          <div className="bg-white overflow-hidden shadow rounded-lg p-4">
            <p className="text-gray-500 text-sm">Overdue</p>
            <p className="text-lg font-semibold">
              {tasks.filter(t => t.dueDate && new Date(t.dueDate) < new Date()).length}
            </p>
          </div>
        </div>

        <div className="bg-white shadow rounded-lg">
          <div className="p-6 border-b border-gray-200">
            <div className="flex justify-between items-center">
              <h2 className="text-xl font-bold text-gray-900">Tasks</h2>
              <button
                onClick={() => setShowTaskForm(!showTaskForm)}
                className="bg-indigo-600 text-white px-4 py-2 rounded hover:bg-indigo-700"
              >
                {showTaskForm ? "Cancel" : "+ New Task"}
              </button>
            </div>
          </div>

          {showTaskForm && (
            <div className="p-6 border-b border-gray-200">
              <form onSubmit={handleCreateTask} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700">Task Title</label>
                  <input
                    type="text"
                    required
                    value={taskTitle}
                    onChange={(e) => setTaskTitle(e.target.value)}
                    className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                    placeholder="Enter task title"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Description</label>
                  <textarea
                    value={taskDescription}
                    onChange={(e) => setTaskDescription(e.target.value)}
                    className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                    placeholder="Enter task description"
                    rows={2}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Due Date</label>
                  <input
                    type="datetime-local"
                    value={taskDueDate}
                    onChange={(e) => setTaskDueDate(e.target.value)}
                    className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                  />
                </div>
                <button
                  type="submit"
                  className="bg-indigo-600 text-white px-4 py-2 rounded hover:bg-indigo-700"
                >
                  Create Task
                </button>
              </form>
            </div>
          )}

          <div className="divide-y divide-gray-200">
            {tasks.length === 0 ? (
              <p className="p-6 text-gray-500 text-center">No tasks yet. Create one to get started.</p>
            ) : (
              tasks.map((task) => (
                <div key={task.id} className="p-6 hover:bg-gray-50">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <h3 className="text-lg font-medium text-gray-900">{task.title}</h3>
                      {task.description && <p className="text-gray-600 mt-1">{task.description}</p>}
                      <div className="mt-2 flex items-center gap-4 text-sm text-gray-500">
                        <span>Status: <span className="font-medium">{task.status}</span></span>
                        {task.dueDate && (
                          <span className={new Date(task.dueDate) < new Date() ? "text-red-600" : ""}>
                            Due: {new Date(task.dueDate).toLocaleDateString()}
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </main>
    </div>
  )
}