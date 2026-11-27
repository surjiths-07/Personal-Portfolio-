# Full-Stack Personal Portfolio Website

A complete, database-driven personal portfolio built with **React.js**, **Node.js**, **Express.js**, and **MySQL**.

## Architecture

```
├── backend/              # Express.js REST API, JWT Auth, Multer Image Uploads, MySQL Pool
├── database/             # MySQL schema.sql & seed.sql initialization scripts
└── frontend/             # React.js (Vite) dark-theme UI, Project Details & Admin CMS
```

## Key Features

- **Hero & About Sections**: Editable personal introduction, availability badge, dynamic PDF resume download (`/api/profile/resume`), GitHub & LinkedIn links.
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

### 2. Start Backend Server
```bash
cd backend
npm run dev
```
Backend runs on `http://localhost:5000`.

### 3. Start Frontend Dev Server
```bash
cd frontend
npm install
npm run dev
```
Frontend runs on `http://localhost:5173`.

## Deployment Guide

- **MySQL Database**: Provision a hosted MySQL database (e.g., Railway MySQL, Aiven, or AWS RDS) and import `database/schema.sql` and `database/seed.sql` (or run `npm run db:init` with production env vars).
- **Backend (Render / Railway)**: Deploy `backend/` with start command `npm start`, setting `PORT`, `DB_HOST`, `DB_PORT`, `DB_USER`, `DB_PASSWORD`, `DB_NAME`, `DB_SSL`, `JWT_SECRET`, and `CORS_ORIGIN`.
- **Frontend (Vercel / Netlify)**: Deploy `frontend/` (`npm run build`, output `dist/`) with `VITE_API_URL` pointing to your deployed backend URL. `vercel.json` and `netlify.toml` handle SPA route rewrites automatically.
