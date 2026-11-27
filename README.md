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

### Vercel multi-service deployment (same domain)

This repository is configured as a Vercel project with two services in the root `vercel.json`:

- **backend**: root `backend/`, Express, install command `npm ci`, entrypoint `src/server.js`.
- **frontend**: root `frontend/`, Vite, install command `npm ci`, build command `npm run build`, output directory `dist`.

Keep the Vercel project's **Root Directory** at the repository root. The root rewrites send `/api` and `/api/*` to the backend, `/uploads` and `/uploads/*` to the backend, and all remaining paths to the frontend. The frontend uses relative `/api` requests, so leave `VITE_API_URL` unset for this same-domain deployment. The frontend's `frontend/vercel.json` is a legacy SPA fallback for standalone frontend hosting; the root services configuration controls the multi-service deployment.

### Required Vercel environment variables

Set these in **Vercel → Project Settings → Environment Variables** and make sure they are available to the backend service for Production and any Preview deployments you use:

**MySQL (choose one configuration):**

- `DATABASE_URL`: hosted MySQL connection string, e.g. `mysql://USER:PASSWORD@HOST:3306/DATABASE?ssl-mode=REQUIRED`; or
- `DB_HOST`, `DB_PORT` (usually `3306`), `DB_USER`, `DB_PASSWORD`, `DB_NAME`, and `DB_SSL=true` when the provider requires TLS.

Use a managed/cloud MySQL database reachable from Vercel. XAMPP's local MySQL on your laptop is only for local development and is not a production database.

**Admin and initialization:**

- `JWT_SECRET`: a strong, unique random secret.
- `ADMIN_USERNAME`, `ADMIN_EMAIL`, `ADMIN_PASSWORD`: set the initial admin credentials securely; do not use the example values.
- `AUTO_INIT_DB=true`: optional database/schema/seed initialization. Prefer running `npm run db:init` against the hosted database as a controlled one-time setup if you can; if enabling automatic initialization, understand it may run during serverless cold starts.

**Persistent image uploads (required for uploads on Vercel):**

- `CLOUDINARY_CLOUD_NAME`
- `CLOUDINARY_API_KEY`
- `CLOUDINARY_API_SECRET`
- `CLOUDINARY_UPLOAD_FOLDER` (optional; defaults to `portfolio`)

Create these credentials in Cloudinary and add them as backend environment variables in Vercel. The backend uploads image bytes to Cloudinary and stores/returns the secure hosted image URL. Do not place Cloudinary secrets in any `VITE_*` frontend variable. In local development, when Cloudinary is not configured, the existing local disk upload path `/uploads/*` remains available.

The backend keeps `/uploads/*` routed for compatibility with existing local/legacy assets, but local filesystem files are not durable or guaranteed to exist in Vercel serverless runtime. Migrate any previously uploaded files and update their stored image references to hosted Cloudinary URLs. New uploads require Cloudinary credentials in Vercel.

### Verify after deployment

- `GET https://<your-domain>/api/health` should report `database: "connected"`.
- `GET https://<your-domain>/api/projects` should return the project JSON.
- Sign in to the admin dashboard and upload a small image; confirm the returned image URL is a Cloudinary HTTPS URL and remains accessible after a new deployment.

### Local development

Run XAMPP/MySQL locally, configure `backend/.env` using `backend/.env.example`, and initialize the schema with `npm run db:init` from the repository root. Start the app with `npm run dev`. Local uploads are stored under `backend/uploads/` when Cloudinary is not configured.
