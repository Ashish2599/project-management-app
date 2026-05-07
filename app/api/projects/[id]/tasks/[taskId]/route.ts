import { NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { PrismaClient } from "@prisma/client"
import { authOptions } from "@/lib/auth"
import { z } from "zod"

const prisma = new PrismaClient()

const updateTaskSchema = z.object({
  status: z.enum(["TODO", "IN_PROGRESS", "DONE"]).optional(),
  assignedToId: z.string().optional().nullable(),
})

export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ id: string; taskId: string }> }
) {
  try {
    const { id, taskId } = await params
    const session = await getServerSession(authOptions)
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const project = await prisma.project.findUnique({
      where: { id },
      select: {
        ownerId: true,
        members: { select: { userId: true, role: true } }
      }
    })

    if (!project) {
      return NextResponse.json({ error: "Project not found" }, { status: 404 })
    }

    const isMember = project.members.some(m => m.userId === session.user.id) || project.ownerId === session.user.id
    if (!isMember) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 })
    }

    const body = await request.json()
    const { status, assignedToId } = updateTaskSchema.parse(body)

    if (status === undefined && assignedToId === undefined) {
      return NextResponse.json({ error: "Nothing to update" }, { status: 400 })
    }

    const task = await prisma.task.findUnique({ where: { id: taskId } })
    if (!task || task.projectId !== id) {
      return NextResponse.json({ error: "Task not found" }, { status: 404 })
    }

    const canUpdateAssignee = project.ownerId === session.user.id || project.members.some(m => m.userId === session.user.id && m.role === "ADMIN")
    let updateData: any = {}

    if (status !== undefined) {
      updateData.status = status
    }

    if (assignedToId !== undefined) {
      if (!canUpdateAssignee) {
        return NextResponse.json({ error: "Forbidden" }, { status: 403 })
      }

      if (assignedToId === null || assignedToId === "") {
        updateData.assignedToId = null
      } else {
        const validAssignee = project.ownerId === assignedToId || project.members.some(m => m.userId === assignedToId)
        if (!validAssignee) {
          return NextResponse.json({ error: "Assignee must be a project member" }, { status: 400 })
        }
        updateData.assignedToId = assignedToId
      }
    }

    const updatedTask = await prisma.task.update({
      where: { id: taskId },
      data: updateData,
      include: {
        assignedTo: {
          select: { id: true, name: true, email: true }
        }
      }
    })

    return NextResponse.json(updatedTask)
  } catch (error) {
    return NextResponse.json({ error: "Invalid request" }, { status: 400 })
  }
}
