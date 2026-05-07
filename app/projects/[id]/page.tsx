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
    id: string
    name: string
    email: string
  }
}

interface ProjectMember {
  user: {
    id: string
    name: string
    email: string
  }
  role: string
}

interface Project {
  id: string
  name: string
  description?: string
  owner: {
    id: string
    name: string
    email: string
  }
  members: ProjectMember[]
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
  const [taskAssignedTo, setTaskAssignedTo] = useState("")
  const [memberEmail, setMemberEmail] = useState("")
  const [memberRole, setMemberRole] = useState("MEMBER")
  const [memberMessage, setMemberMessage] = useState("")
  const [memberError, setMemberError] = useState("")

  useEffect(() => {
    if (status === "loading") return
    if (!session) {
      router.push("/auth/signin")
      return
    }
    fetchProject()
    fetchTasks()
  }, [projectId, status, session, router])

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
        assignedToId: taskAssignedTo || undefined,
      }),
    })

    if (res.ok) {
      setTaskTitle("")
      setTaskDescription("")
      setTaskDueDate("")
      setTaskAssignedTo("")
      setShowTaskForm(false)
      fetchTasks()
    }
  }

  const handleUpdateTask = async (taskId: string, updates: { status?: string; assignedToId?: string }) => {
    const res = await fetch(`/api/projects/${projectId}/tasks/${taskId}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(updates),
    })

    if (res.ok) {
      fetchTasks()
    }
  }

  const handleAddMember = async (e: React.FormEvent) => {
    e.preventDefault()
    setMemberMessage("")
    setMemberError("")

    const res = await fetch(`/api/projects/${projectId}/members`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email: memberEmail, role: memberRole }),
    })

    if (res.ok) {
      setMemberMessage("Member added successfully.")
      setMemberEmail("")
      setMemberRole("MEMBER")
      fetchProject()
    } else {
      const data = await res.json()
      setMemberError(data.error || "Unable to add member")
    }
  }

  const handleUpdateMemberRole = async (userId: string, role: string) => {
    const res = await fetch(`/api/projects/${projectId}/members`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ userId, role }),
    })

    if (res.ok) {
      fetchProject()
    }
  }

  const isProjectAdmin = project
    ? project.owner.id === session?.user?.id || project.members.some(m => m.user.id === session?.user?.id && m.role === "ADMIN")
    : false

  const assigneeOptions = project
    ? [{ id: project.owner.id, label: `${project.owner.name} (Owner)` }, ...project.members.map(member => ({ id: member.user.id, label: `${member.user.name} (${member.role})` }))]
    : []

  if (status === "loading") return <div className="min-h-screen flex items-center justify-center text-white">Loading...</div>
  if (!session) return <div className="min-h-screen flex items-center justify-center text-white">Redirecting...</div>

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100">
      {loading ? (
        <div className="flex items-center justify-center p-8 text-white">Loading...</div>
      ) : !project ? (
        <div className="flex items-center justify-center p-8 text-white">Project not found</div>
      ) : (
        <>
          <div className="absolute inset-x-0 top-0 h-72 bg-gradient-to-r from-sky-600 via-slate-900 to-slate-950 opacity-75 blur-3xl" />
      <div className="relative mx-auto max-w-7xl px-6 py-12 lg:px-8">
        <div className="rounded-[2rem] border border-white/10 bg-slate-900/90 p-8 shadow-2xl shadow-slate-950/30 backdrop-blur-xl">
          <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
            <div>
              <p className="text-sm uppercase tracking-[0.24em] text-sky-300/80">Project details</p>
              <h1 className="mt-3 text-4xl font-semibold tracking-tight text-white">{project.name}</h1>
              {project.description && <p className="mt-3 max-w-3xl text-sm leading-7 text-slate-300">{project.description}</p>}
            </div>
            <Link href="/dashboard" className="rounded-full border border-slate-700 bg-slate-950/90 px-5 py-2.5 text-sm font-semibold text-slate-100 transition hover:bg-slate-800/90">
              Back to dashboard
            </Link>
          </div>

          <div className="mt-8 grid gap-6 lg:grid-cols-4">
            <div className="rounded-3xl border border-slate-800 bg-slate-950/80 p-6">
              <p className="text-sm text-slate-400">Owner</p>
              <p className="mt-3 text-xl font-semibold text-white">{project.owner.name}</p>
              <p className="mt-1 text-sm text-slate-400">{project.owner.email}</p>
            </div>
            <div className="rounded-3xl border border-slate-800 bg-slate-950/80 p-6">
              <p className="text-sm text-slate-400">Members</p>
              <p className="mt-3 text-3xl font-semibold text-white">{project.members.length}</p>
            </div>
            <div className="rounded-3xl border border-slate-800 bg-slate-950/80 p-6">
              <p className="text-sm text-slate-400">Total tasks</p>
              <p className="mt-3 text-3xl font-semibold text-white">{tasks.length}</p>
            </div>
            <div className="rounded-3xl border border-slate-800 bg-slate-950/80 p-6">
              <p className="text-sm text-slate-400">Overdue</p>
              <p className="mt-3 text-3xl font-semibold text-rose-300">{tasks.filter(t => t.dueDate && new Date(t.dueDate) < new Date()).length}</p>
            </div>
          </div>

          <div className="mt-10 rounded-[2rem] border border-slate-800 bg-slate-950/90 p-6">
            <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
              <div>
                <h2 className="text-xl font-semibold text-white">Tasks</h2>
                <p className="text-sm text-slate-400">Manage tasks and keep deadlines on track.</p>
              </div>
              <button
                onClick={() => setShowTaskForm(!showTaskForm)}
                className="inline-flex items-center rounded-full bg-sky-500 px-4 py-2 text-sm font-semibold text-white shadow-lg shadow-sky-500/20 transition hover:bg-sky-400"
              >
                {showTaskForm ? "Cancel" : "+ New Task"}
              </button>
            </div>

            {showTaskForm && (
              <div className="mt-6 rounded-3xl border border-slate-700 bg-slate-950/80 p-6">
                <form onSubmit={handleCreateTask} className="space-y-5">
                  <div>
                    <label className="block text-sm font-medium text-slate-300">Task Title</label>
                    <input
                      type="text"
                      required
                      value={taskTitle}
                      onChange={(e) => setTaskTitle(e.target.value)}
                      className="input-field"
                      placeholder="Enter task title"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-slate-300">Description</label>
                    <textarea
                      value={taskDescription}
                      onChange={(e) => setTaskDescription(e.target.value)}
                      className="input-field min-h-[140px] resize-none"
                      placeholder="Enter task description"
                      rows={4}
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-slate-300">Due Date</label>
                    <input
                      type="datetime-local"
                      value={taskDueDate}
                      onChange={(e) => setTaskDueDate(e.target.value)}
                      className="input-field"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-slate-300">Assign to</label>
                    <select
                      value={taskAssignedTo}
                      onChange={(e) => setTaskAssignedTo(e.target.value)}
                      className="mt-2 block w-full rounded-3xl border border-slate-300 bg-white/95 px-4 py-3 text-slate-950"
                    >
                      <option value="">Unassigned</option>
                      {assigneeOptions.map((option) => (
                        <option key={option.id} value={option.id}>
                          {option.label}
                        </option>
                      ))}
                    </select>
                  </div>
                  <button type="submit" className="btn-primary w-full">Create Task</button>
                </form>
              </div>
            )}

            <div className="mt-6 space-y-4">
              {tasks.length === 0 ? (
                <div className="rounded-3xl border border-slate-700 bg-slate-950/70 p-6 text-center text-slate-400">
                  No tasks yet. Add one to keep the project moving.
                </div>
              ) : (
                tasks.map((task) => {
                  const assignedName = task.assignedTo?.name || "Unassigned"
                  return (
                    <div key={task.id} className="rounded-3xl border border-slate-700 bg-slate-950/70 p-6 transition hover:border-sky-500/30 hover:bg-slate-900/80">
                      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
                        <div>
                          <h3 className="text-lg font-semibold text-white">{task.title}</h3>
                          {task.description && <p className="mt-2 text-sm text-slate-400">{task.description}</p>}
                          <p className="mt-3 text-sm text-slate-400">Assigned to: <span className="text-slate-200">{assignedName}</span></p>
                        </div>
                        <div className="grid gap-3 sm:grid-cols-2">
                          <div>
                            <label className="block text-xs font-medium uppercase tracking-[0.22em] text-slate-500">Status</label>
                            <select
                              value={task.status}
                              onChange={(e) => handleUpdateTask(task.id, { status: e.target.value })}
                              className="mt-2 w-full rounded-3xl border border-slate-700 bg-slate-900 px-4 py-3 text-sm text-slate-100"
                            >
                              <option value="TODO">TODO</option>
                              <option value="IN_PROGRESS">IN PROGRESS</option>
                              <option value="DONE">DONE</option>
                            </select>
                          </div>
                          <div>
                            <label className="block text-xs font-medium uppercase tracking-[0.22em] text-slate-500">Assignee</label>
                            <select
                              value={task.assignedTo?.id ?? ""}
                              onChange={(e) => handleUpdateTask(task.id, { assignedToId: e.target.value || undefined })}
                              className="mt-2 w-full rounded-3xl border border-slate-700 bg-slate-900 px-4 py-3 text-sm text-slate-100"
                            >
                              <option value="">Unassigned</option>
                              {assigneeOptions.map((option) => (
                                <option key={option.id} value={option.id}>
                                  {option.label}
                                </option>
                              ))}
                            </select>
                          </div>
                        </div>
                      </div>
                      {task.dueDate && (
                        <p className={new Date(task.dueDate) < new Date() ? "mt-4 text-sm text-rose-300" : "mt-4 text-sm text-slate-400"}>
                          Due {new Date(task.dueDate).toLocaleDateString()}
                        </p>
                      )}
                    </div>
                  )
                })
              )}
            </div>

            <div className="mt-10 rounded-[2rem] border border-slate-800 bg-slate-950/90 p-6">
              <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
                <div>
                  <h2 className="text-xl font-semibold text-white">Team</h2>
                  <p className="text-sm text-slate-400">Project members and permissions.</p>
                </div>
                {isProjectAdmin && (
                  <span className="inline-flex items-center rounded-full bg-emerald-500/15 px-3 py-1 text-xs font-semibold uppercase tracking-[0.24em] text-emerald-300">
                    Admin access
                  </span>
                )}
              </div>

              <div className="mt-6 grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                <div className="rounded-3xl border border-slate-700 bg-slate-950/80 p-5">
                  <p className="text-sm text-slate-400">Owner</p>
                  <p className="mt-3 text-lg font-semibold text-white">{project.owner.name}</p>
                  <p className="mt-1 text-sm text-slate-400">{project.owner.email}</p>
                  <p className="mt-3 rounded-full bg-slate-800 px-3 py-1 text-xs uppercase tracking-[0.2em] text-sky-300">Owner</p>
                </div>
                {project.members.map((member) => (
                  <div key={member.user.id} className="rounded-3xl border border-slate-700 bg-slate-950/80 p-5">
                    <p className="text-sm text-slate-400">Member</p>
                    <p className="mt-3 text-lg font-semibold text-white">{member.user.name}</p>
                    <p className="mt-1 text-sm text-slate-400">{member.user.email}</p>
                    <div className="mt-3">
                      {isProjectAdmin ? (
                        <select
                          value={member.role}
                          onChange={(e) => handleUpdateMemberRole(member.user.id, e.target.value)}
                          className="w-full rounded-3xl border border-slate-700 bg-slate-900 px-4 py-3 text-sm text-slate-100"
                        >
                          <option value="MEMBER">Member</option>
                          <option value="ADMIN">Admin</option>
                        </select>
                      ) : (
                        <p className="mt-3 rounded-full bg-slate-800 px-3 py-1 text-xs uppercase tracking-[0.2em] text-slate-300">{member.role}</p>
                      )}
                    </div>
                  </div>
                ))}
              </div>

              {isProjectAdmin && (
                <form onSubmit={handleAddMember} className="mt-8 space-y-4 rounded-3xl border border-slate-700 bg-slate-950/80 p-6">
                  <div>
                    <label className="block text-sm font-medium text-slate-300">Invite member by email</label>
                    <input
                      type="email"
                      required
                      value={memberEmail}
                      onChange={(e) => setMemberEmail(e.target.value)}
                      className="input-field"
                      placeholder="team@example.com"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-slate-300">Role</label>
                    <select
                      value={memberRole}
                      onChange={(e) => setMemberRole(e.target.value)}
                      className="mt-2 block w-full rounded-3xl border border-slate-300 bg-white/95 px-4 py-3 text-slate-950"
                    >
                      <option value="MEMBER">Member</option>
                      <option value="ADMIN">Admin</option>
                    </select>
                  </div>
                  {memberMessage && <p className="text-sm text-emerald-300">{memberMessage}</p>}
                  {memberError && <p className="text-sm text-rose-300">{memberError}</p>}
                  <button type="submit" className="btn-primary w-full">Add member</button>
                </form>
              )}
            </div>
          </div>
        </div>
      </div>
        </>
      )}
    </div>
  )
}