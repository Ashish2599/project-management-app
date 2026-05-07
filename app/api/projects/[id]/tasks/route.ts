import { NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { PrismaClient } from "@prisma/client"
import { authOptions } from "@/lib/auth"
import { z } from "zod"

const prisma = new PrismaClient()

const createTaskSchema = z.object({
  title: z.string().min(1),
  description: z.string().optional(),
  dueDate: z.string().optional(),
  assignedToId: z.string().optional(),
})

const updateTaskSchema = z.object({
  status: z.enum(["TODO", "IN_PROGRESS", "DONE"]).optional(),
  assignedToId: z.string().optional().nullable(),
})

export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    const session = await getServerSession(authOptions)
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    // Verify user has access to project
    const project = await prisma.project.findUnique({
      where: { id },
      select: {
        ownerId: true,
        members: { select: { userId: true } }
      }
    })

    if (!project) {
      return NextResponse.json({ error: "Project not found" }, { status: 404 })
    }

    const isMember = project.members.some(m => m.userId === session.user.id) || project.ownerId === session.user.id
    if (!isMember) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 })
    }

    const tasks = await prisma.task.findMany({
      where: { projectId: id },
      include: {
        assignedTo: {
          select: { id: true, name: true, email: true }
        }
      },
      orderBy: { createdAt: "desc" }
    })

    return NextResponse.json(tasks)
  } catch (error) {
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}

export async function POST(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    const session = await getServerSession(authOptions)
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    // Verify user has access to project
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
    const { title, description, dueDate, assignedToId } = createTaskSchema.parse(body)

    if (assignedToId) {
      const validAssignee = project.ownerId === assignedToId || project.members.some(m => m.userId === assignedToId)
      if (!validAssignee) {
        return NextResponse.json({ error: "Assignee must be a project member" }, { status: 400 })
      }
    }

    const task = await prisma.task.create({
      data: {
        title,
        description,
        dueDate: dueDate ? new Date(dueDate) : undefined,
        projectId: id,
        assignedToId: assignedToId || undefined,
      },
      include: {
        assignedTo: {
          select: { id: true, name: true, email: true }
        }
      }
    })

    return NextResponse.json(task)
  } catch (error) {
    return NextResponse.json({ error: "Invalid request" }, { status: 400 })
  }
}

