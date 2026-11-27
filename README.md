# Full-Stack Personal Portfolio Website

A complete, database-driven personal portfolio built with **React.js**, **Tailwind CSS**, **Node.js**, **Express.js**, and **MySQL**.

## Architecture

```
├── api/                  # Vercel Serverless Function entrypoint wrapping Express app
├── backend/              # Express.js REST API, JWT Auth, Multer Uploads, MySQL Pool
├── database/             # MySQL schema.sql & seed.sql initialization scripts
├── frontend/             # React.js (Vite) dark-minimal UI, Project Details & Admin CMS
└── vercel.json           # Root Vercel config (frontend build + /api serverless routing)
```

## Key Features

- **Hero, About & Tech Marquee**: `dark-minimal` aesthetic with `LetterGlitch` canvas, infinite SVG marquee, availability badge, dynamic PDF resume download (`/api/profile/resume`), and GitHub/LinkedIn links.
- **Categorized Skills**: Frontend, Backend, Database, and AI & Development Tools loaded from MySQL without fake percentage bars.
- **Flagship Project Showcase (`CodeGen`) & Reusable Project Cards**: Dedicated `/projects/:slug` case-study page with problem statement, proposed solution, objectives, features, tech stack, screenshot lightbox, and future enhancements.
- **Experience, Education, Certifications & Achievements**: Filterable timeline backed by MySQL `timeline_items`.
- **Contact Form**: Validated, honeypot-protected, and rate-limited Express endpoint storing messages in MySQL `contact_messages`.
- **Protected Admin Dashboard (`/admin`)**: Bcrypt-hashed authentication, JWT sessions, full CRUD for projects, skills, timeline entries, profile settings, image uploads, and contact inbox management.

## Local Setup & Commands

### 1. Start MySQL & Initialize Database
Ensure MySQL (or MariaDB via XAMPP) is running on port `3306`.
Configure `backend/.env` (see `backend/.env.example`), then run:

```bash
cd backend
npm install
npm run db:init
```

### 2. Run Both Frontend & Backend Together
```bash
npm install --prefix frontend
npm run dev
```
- Frontend: `http://localhost:5173`
- Backend: `http://localhost:5000` (`GET /api/health`)

*(Or run them separately with `npm --prefix backend run dev` and `npm --prefix frontend run dev`.)*

## Deployment Guide

### Option 1: Full-Stack Deployment on Vercel + Cloud MySQL (Recommended)
1. **Provision a Cloud MySQL Database** (e.g., Railway MySQL, Aiven, TiDB Cloud, or AWS RDS).
2. **Import this repository in Vercel** with **Root Directory** left at the repo root (`.`). `vercel.json` handles:
   - Installing `frontend/` and `backend/` dependencies
   - Building `frontend/dist` (`npm run build`)
   - Routing `/api/*` to `api/index.js` (Express serverless handler)
   - SPA fallback rewrites for React Router pages
3. **Configure Vercel Environment Variables** (*Project → Settings → Environment Variables*):
   - `DATABASE_URL` = `mysql://<user>:<password>@<host>:<port>/<db>?ssl-mode=REQUIRED` *(or set `DB_HOST`, `DB_PORT`, `DB_USER`, `DB_PASSWORD`, `DB_NAME`, `DB_SSL=true`)*
   - `AUTO_INIT_DB` = `true` *(initializes tables, seed data, and initial admin user on first cold start if empty)*
   - `JWT_SECRET` = *(long random 64+ character string)*
   - `ADMIN_USERNAME` = `admin`
   - `ADMIN_EMAIL` = `your-email@example.com`
   - `ADMIN_PASSWORD` = *(strong admin password)*
   - **Leave `VITE_API_URL` unset** so frontend requests target `/api/...` on the same Vercel domain.
4. **Verify after deploy**:
   - `https://<your-site>.vercel.app/api/health` → `database: "connected"`
   - `https://<your-site>.vercel.app/api/projects` → returns JSON project list

### Option 2: Split Hosting (Vercel/Netlify Frontend + Render/Railway Backend)
- **Backend (Render / Railway)**: Deploy `backend/` with start command `npm start`, setting `PORT`, `DATABASE_URL` (or `DB_*`), `JWT_SECRET`, and `CORS_ORIGIN`.
- **Frontend (Vercel / Netlify)**: Deploy `frontend/` with `VITE_API_URL` pointing to your deployed backend URL.
