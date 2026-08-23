# CBIT Activity Points (MAR) Automation & Intelligence System

A full-stack **Web + Mobile Progressive Web App (PWA)** built for **Chaitanya Bharathi Institute of Technology (CBIT Autonomous), Hyderabad** to automate student Mandatory Additional Requirements (MAR) activity points tracking, AI certificate extraction, mentor verification, and official report generation.

---

## Key Features

1. **AI Document Intelligence (Google Gemini 2.0 Flash)**:
   * Upload certificates in JPG, PNG, PDF, or HEIC format.
   * Direct mobile camera scanning support.
   * Auto-extracts course/event title, issuing body, completion date, and automatically matches to the **24 CBIT MAR categories** with suggested activity points.
   * **Full Student Editability**: Students can review and edit every AI-extracted field before final submission.

2. **5 Multi-Role Academic Portals (Role-Based Access Control)**:
   * **Student**: Real-time progress bar toward 60 points (50 for Lateral Entry), category caps monitor, semester I–VIII breakdown, submission logs, and official CBIT MAR sheet PDF generator.
   * **Faculty Mentor**: Side-by-side certificate previewer, 1-click Approve, Reject with student feedback remarks, and point adjustment.
   * **Class Teacher / Coordinator**: Section analytics, at-risk student monitoring (<30 points), and batch reports.
   * **Head of Department (HoD)**: Department compliance rates and graduation batch digital MAR signoff.
   * **Administrator**: Dynamic MAR rulebook editor (custom point values & caps without touching code), target point settings, and mentor allocation.

3. **100% Free-Tier Architecture**:
   * **Frontend**: Next.js 15 (App Router), React 19, Tailwind CSS, Lucide Icons, jsPDF.
   * **Backend & Database**: Supabase (PostgreSQL, Supabase Auth with Google OAuth, Supabase Storage).
   * **AI Engine**: Google Gemini 2.0 Flash (Free API key from Google AI Studio).
   * **Cross-Platform**: Mobile-First PWA (Installable on Android, iOS, Windows, Mac).

---

## 24 Official CBIT MAR Categories Included

1. MOOCs (SWAYAM / NPTEL / COURSERA / equivalent)
2. Tech Fest / R&D Day / Freshers Workshop / Conference / Hackathons
3. Rural Reporting
4. Harithaharam / Plantation
5. Participation in Relief camps
6. Participation in Debate / Group Discussion / Technical Quiz
7. Publication in Newspaper / Magazines at institution level
8. Publication in Newspaper, Magazine & Blogs
9. Research Publication (per publication)
10. Innovation Projects (other than course requirements)
11. Blood donation / NSS or NCC participation
12. Blood donation / NSS camp organization
13. Participation in Sports / Games (College, Univ, Region, State, National)
14. Cultural Programme (Dance, Drama, Elocution, Music, etc.)
15. Member of Professional Society (IEEE, CSI, IETE, ACM, etc.)
16. Student Chapter / Clubs
17. Relevant Industry Visit & Report
18. Photography activities in different Clubs
19. Participation in Yoga camp
20. Self-Entrepreneurship Program
21. Adventure sports with Certification
22. Training to underprivileged / Physically challenged
23. Community Service & Allied Activities
24. Class Representative

---

## Quick Start & Setup Guide

### 1. Install Dependencies
```bash
npm install
```

### 2. Configure Environment Variables
Copy `.env.example` to `.env.local`:
```bash
cp .env.example .env.local
```

Fill in your free API keys:
* **Google Gemini API Key**: Get free forever at [Google AI Studio](https://aistudio.google.com/app/apikey).
* **Supabase Keys**: Create a free project at [Supabase](https://supabase.com) and copy Project URL & Anon Key from **Project Settings -> API**.

### 3. Setup Supabase Database
Run the SQL migration script located in `supabase/schema.sql` inside the **Supabase SQL Editor**. This creates all tables, triggers, policies, and seeds all 24 CBIT categories automatically!

### 4. Run Development Server
```bash
npm run dev
```
Open [http://localhost:3000](http://localhost:3000) in your browser.

---

## Pushing to your GitHub Repository

To push this codebase to your own GitHub repository:
```bash
git add .
git commit -m "feat: complete CBIT MAR Activity Points automation system with AI document intelligence"
git branch -M main
git remote add origin https://github.com/YOUR_USERNAME/YOUR_REPOSITORY.git
git push -u origin main
```
