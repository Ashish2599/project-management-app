# Project Management Web App

A full-stack web application for managing projects and tasks with role-based access control.

## Features

- **Authentication**: User registration and login
- **Project Management**: Create and manage projects
- **Task Management**: Assign tasks, track status, and due dates
- **Role-Based Access**: Admin and Member roles per project
- **Dashboard**: Overview of projects, tasks, and overdue items

## Tech Stack

- **Frontend**: Next.js 16, React 19, Tailwind CSS
- **Backend**: Next.js API Routes
- **Database**: SQLite with Prisma ORM
- **Authentication**: NextAuth.js
- **Validation**: Zod

## Getting Started

1. Install dependencies:
   ```bash
   npm install
   ```

2. Set up the database:
   ```bash
   npx prisma generate
   npx prisma db push
   ```

3. Run the development server:
   ```bash
   npm run dev
   ```

4. Open [http://localhost:3000](http://localhost:3000) in your browser.

## Environment Variables

Create a `.env.local` file with:
```
NEXTAUTH_SECRET=your-secret-key
NEXTAUTH_URL=http://localhost:3000
```

## Database Schema

The application uses the following models:
- User: User accounts
- Project: Projects owned by users
- ProjectMember: Membership with roles (Admin/Member)
- Task: Tasks assigned to users within projects

## API Routes

- `POST /api/auth/register`: Register a new user
- `GET /api/projects`: Get user's projects
- `POST /api/projects`: Create a new project
- `GET /api/tasks`: Get user's assigned tasks

## Deployment

This app can be deployed to Vercel, Netlify, or any platform supporting Next.js.
