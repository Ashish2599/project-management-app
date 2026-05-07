# 🚀 Railway Deployment Guide

## Prerequisites
- GitHub account
- Railway account (sign up at https://railway.app)

## Step 1: Create GitHub Repository

1. Go to https://github.com/new
2. Create a new repository named `project-management-app`
3. Do NOT initialize with README (we already have one)
4. Copy the repository URL (HTTPS or SSH)

## Step 2: Push Code to GitHub

Run these commands in your project directory:

```bash
git remote add origin https://github.com/YOUR_USERNAME/project-management-app.git
git branch -M main
git push -u origin main
```

Replace `YOUR_USERNAME` with your GitHub username.

## Step 3: Deploy to Railway

### Option A: Using Railway Dashboard (Recommended for Beginners)

1. Go to https://railway.app and sign in with GitHub
2. Click **New Project** → **Deploy from GitHub repo**
3. Select your `project-management-app` repository
4. Railway will automatically detect it's a Next.js project
5. Click **Deploy** and wait for the build to complete

### Option B: Using Railway CLI

```bash
# Install Railway CLI (if not already installed)
npm i -g @railway/cli

# Login to Railway
railway login

# Link project
railway link

# Deploy
railway up
```

## Step 4: Configure Environment Variables on Railway

After deployment starts, add these environment variables in Railway Dashboard:

1. Go to your project → **Variables**
2. Add the following:

```
NEXTAUTH_SECRET=use_openssl_rand_hex_32_to_generate
NEXTAUTH_URL=https://your-railway-url.railway.app
DATABASE_URL=file:./dev.db
NODE_ENV=production
```

**Generate NEXTAUTH_SECRET:**
```bash
openssl rand -hex 32
```

Or use a secure random string generator online.

## Step 5: Set Up PostgreSQL (Optional but Recommended)

For production, use PostgreSQL instead of SQLite:

1. In Railway Dashboard, click **+ New** → **Database** → **PostgreSQL**
2. Railway will automatically add `DATABASE_URL` to your variables
3. Update `prisma/schema.prisma`:
   ```prisma
   datasource db {
     provider = "postgresql"
     url      = env("DATABASE_URL")
   }
   ```
4. Redeploy: `git push origin main`

## Step 6: Run Prisma Migrations

After deployment:

1. In Railway Dashboard, go to your project
2. Click the **Deployments** tab
3. Open the latest deployment logs
4. Check if migrations ran automatically

If not, manually run:
```bash
npx prisma db push
```

## Step 7: Access Your Live App

- Your Railway domain will be displayed in the Railway Dashboard
- Format: `https://your-project-name.railway.app`
- Access at that URL in your browser

## Common Issues & Solutions

### Issue: Database connection error
**Solution:** Make sure DATABASE_URL is set correctly in Railway variables

### Issue: NextAuth errors
**Solution:** 
- Regenerate NEXTAUTH_SECRET: `openssl rand -hex 32`
- Update NEXTAUTH_URL to match your Railway domain

### Issue: Build fails
**Solution:** Check build logs in Railway Dashboard for specific errors

## Post-Deployment

1. **Test Authentication:**
   - Go to your live URL
   - Create a new account
   - Sign in and verify dashboard loads

2. **Test Core Features:**
   - Create a new project
   - View project details
   - Create a task

3. **Share Your App:**
   - Live URL: `https://your-railway-url.railway.app`
   - GitHub Repo: `https://github.com/YOUR_USERNAME/project-management-app`
   - README.md: In repository root

## Troubleshooting

### See logs in Railway:
1. Dashboard → Deployments → View Logs
2. Check for error messages

### Redeploy after fixes:
```bash
git push origin main  # Changes automatically trigger redeploy
```

### Reset database (warning: deletes all data):
```bash
npx prisma migrate reset
npx prisma db push
```

---

For more help, visit:
- Railway Docs: https://docs.railway.app
- NextAuth Docs: https://next-auth.js.org
- Prisma Docs: https://www.prisma.io/docs