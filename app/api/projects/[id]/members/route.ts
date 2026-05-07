import { NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { PrismaClient } from "@prisma/client"
import { authOptions } from "@/lib/auth"
import { z } from "zod"

const prisma = new PrismaClient()

const createMemberSchema = z.object({
  email: z.string().email(),
  role: z.enum(["MEMBER", "ADMIN"]),
})

const updateMemberSchema = z.object({
  userId: z.string(),
  role: z.enum(["MEMBER", "ADMIN"]),
})

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

    const project = await prisma.project.findUnique({
      where: { id },
      include: { members: true }
    })

    if (!project) {
      return NextResponse.json({ error: "Project not found" }, { status: 404 })
    }

    const isAdminOrOwner = project.ownerId === session.user.id || project.members.some(m => m.userId === session.user.id && m.role === "ADMIN")
    if (!isAdminOrOwner) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 })
    }

    const body = await request.json()
    const { email, role } = createMemberSchema.parse(body)

    const user = await prisma.user.findUnique({ where: { email } })
    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 })
    }

    if (user.id === project.ownerId || project.members.some(m => m.userId === user.id)) {
      return NextResponse.json({ error: "User is already part of this project" }, { status: 400 })
    }

    const member = await prisma.projectMember.create({
      data: {
        projectId: id,
        userId: user.id,
        role,
      }
    })

    return NextResponse.json(member)
  } catch (error) {
    return NextResponse.json({ error: "Invalid request" }, { status: 400 })
  }
}

export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    const session = await getServerSession(authOptions)
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const project = await prisma.project.findUnique({
      where: { id },
      include: { members: true }
    })

    if (!project) {
      return NextResponse.json({ error: "Project not found" }, { status: 404 })
    }

    const isAdminOrOwner = project.ownerId === session.user.id || project.members.some(m => m.userId === session.user.id && m.role === "ADMIN")
    if (!isAdminOrOwner) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 })
    }

    const body = await request.json()
    const { userId, role } = updateMemberSchema.parse(body)

    if (userId === project.ownerId) {
      return NextResponse.json({ error: "Cannot change owner role" }, { status: 400 })
    }

    const existingMember = await prisma.projectMember.findUnique({
      where: {
        userId_projectId: {
          userId,
          projectId: id,
        }
      }
    })

    if (!existingMember) {
      return NextResponse.json({ error: "Member not found" }, { status: 404 })
    }

    const updatedMember = await prisma.projectMember.update({
      where: {
        userId_projectId: {
          userId,
          projectId: id,
        }
      },
      data: { role }
    })

    return NextResponse.json(updatedMember)
  } catch (error) {
    return NextResponse.json({ error: "Invalid request" }, { status: 400 })
  }
}
