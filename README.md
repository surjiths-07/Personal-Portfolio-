# Full-Stack Personal Portfolio Website

A complete, database-driven personal portfolio built with **React.js**, **Tailwind CSS**, **Node.js**, **Express.js**, and **PostgreSQL / Supabase**.

## Architecture

```
├── api/                  # Vercel Serverless Function entrypoint wrapping Express app
├── backend/              # Express.js REST API, JWT Auth, Multer Uploads, pg Pool
├── database/             # PostgreSQL schema.sql & seed.sql initialization scripts
├── frontend/             # React.js (Vite) dark-minimal UI, Project Details & Admin CMS
└── vercel.json           # Root Vercel config (frontend build + /api serverless routing)
```

## Key Features

- **Hero, About & Tech Marquee**: `dark-minimal` aesthetic with `LetterGlitch` canvas, infinite SVG marquee, availability badge, dynamic PDF resume download (`/api/profile/resume`), and GitHub/LinkedIn links.
- **Categorized Skills**: Frontend, Backend, Database, and AI & Development Tools loaded from PostgreSQL without fake percentage bars.
- **Flagship Project Showcase (`CodeGen`) & Reusable Project Cards**: Dedicated `/projects/:slug` case-study page with problem statement, proposed solution, objectives, features, tech stack, screenshot lightbox, and future enhancements.
- **Experience, Education, Certifications & Achievements**: Filterable timeline backed by PostgreSQL `timeline_items`.
- **Contact Form**: Validated, honeypot-protected, and rate-limited Express endpoint storing messages in PostgreSQL `contact_messages`.
- **Protected Admin Dashboard (`/admin`)**: Bcrypt-hashed authentication, JWT sessions, full CRUD for projects, skills, timeline entries, profile settings, image uploads, and contact inbox management.

## Deployment Guide: Vercel + Supabase (Recommended)

1. **Create a Supabase Project** at [supabase.com](https://supabase.com):
   - Go to **Connect** (or **Project Settings → Database**) and copy the **Transaction pooler** (or **Session pooler**) PostgreSQL URI:
     `postgresql://postgres.<project-ref>:<password>@aws-0-<region>.pooler.supabase.com:6543/postgres`
2. **Import this repository in Vercel** with **Root Directory** blank (`.`). `vercel.json` handles:
   - Installing `frontend/` and `backend/` dependencies
   - Building `frontend/dist` (`npm run build`)
   - Routing `/api/*` to `api/index.js` (Express serverless handler)
   - SPA fallback rewrites for React Router pages
3. **Configure Vercel Environment Variables** (*Project → Settings → Environment Variables*):
   - `DATABASE_URL` = your Supabase PostgreSQL Pooler URI
   - `AUTO_INIT_DB` = `true` *(automatically creates tables, seed data, and the initial admin account on first request)*
   - `JWT_SECRET` = *(long random 64+ character string)*
   - `ADMIN_USERNAME` = `admin`
   - `ADMIN_EMAIL` = `your-email@example.com`
   - `ADMIN_PASSWORD` = *(your strong admin password)*
   - **Leave `VITE_API_URL` unset** so frontend requests target `/api/...` on the same Vercel domain.
4. **Redeploy & Verify**:
   - `https://<your-site>.vercel.app/api/health` → `database: "connected"`
   - `https://<your-site>.vercel.app/api/projects` → returns JSON project list

## Local Setup & Commands

1. Configure `backend/.env` with your `DATABASE_URL` (Supabase URI or local PostgreSQL).
2. Initialize tables & seed data:
   ```bash
   npm run db:init
   ```
3. Run both frontend and backend together:
   ```bash
   npm install --prefix frontend
   npm run dev
   ```
   - Frontend: `http://localhost:5173`
   - Backend: `http://localhost:5000`
