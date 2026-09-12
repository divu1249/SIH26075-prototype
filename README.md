# Capacity Connect (SIH-26075 Prototype)

> **Decentralized Capacity Building & Verifiable Skill Accreditation Platform**  
> An end-to-end full-stack educational system featuring strict three-tier Role-Based Access Control (RBAC), interactive curriculum playback, automated server-side evaluation, and cryptographic certificate minting.

---

## Architecture Overview

The repository is structured as an isolated sibling workspace:

```text
CCPROJECT/
├── backend/                  # FastAPI & SQLAlchemy Persistence Engine
│   ├── main.py               # REST Endpoints, OAuth2 JWT & Grading Logic
│   ├── seed.py               # Deterministic environment reset & demo persona seeder
│   └── requirements.txt      # Python dependencies
├── frontend/                 # Vite + React (TypeScript) + Tailwind CSS
│   ├── src/
│   │   ├── components/       # Modals (Auth, Viewer, Quiz, Admin, Analytics)
│   │   ├── context/          # Scoped AuthContext & RBAC Session State
│   │   ├── lib/              # API Client (Fetch with Bearer injection)
│   │   └── pages/Index.tsx   # Master App Dashboard & Orchestration
│   └── package.json          # Node dependencies
└── start_dev.bat             # 1-Click concurrent development boot script
```
# Quickstart Guide for Team Members
1. Prerequisites
   Node.js (v18 or higher)
   Python (v3.10 to v3.12 recommended)
2. Backend Setup
      Open a terminal in ./backend:
   ```
   Bash
   # Optional: create virtualenv
   python -m venv venv
   venv\Scripts\activate      # Windows
   # source venv/bin/activate # macOS/Linux

   # Install dependencies
   pip install -r requirements.txt

   # Reset & Seed Presentation Personas
   python seed.py

   # Start the FastAPI Server
   python -m uvicorn main:app --reload --port 8000
   ```
Swagger Documentation: http://localhost:8000/docs
ReDoc: http://localhost:8000/redoc3. 

# Frontend Setup
Open a second terminal in ./frontend:
   ```
   Bash
   # Install dependencies
   npm install

   # Start Vite Development Server
    npm run dev
   ```
Live Local App: http://localhost:51731-

# Click Launch (Windows)
Double-click start_dev.bat from the root directory to automatically launch both the backend and frontend in separate terminals.
Presentation Demo Accounts & Personas
Database state resets automatically with python backend/seed.py:
Role  |  Email / Identifier |  Password Access Scope  
Trainee | aisha@connect.edu | password123 | Interactive course reader, competency telemetry, certificate viewer
Trainer | aarav@connect.edu | password123 | Curriculum builder, checkpoint authoring, cohort analytics Central 
Admin | admin.root@capacityconnect.gov | adminsecret2026 | Institutional educator queue, cryptographic audit logs

Note on Admin Access: Open the Sign-In modal and select "Admin Console Gateway" at the bottom footer to switch to the restricted governance interface.

# Core System Capabilities
1. Strict Mutual Exclusivity (RBAC):
   Stateless OAuth2 JWT tokens sign the user's role and institutional metadata. Trainees cannot publish curricula, and trainers cannot self-certify.
2. Server-Side Grading & Tamper Resistance:
   Submissions sent to /assessments/{id}/submit are graded server-side against protected answer keys. Passing scores generate a deterministic SHA-256 HMAC hash linking the user ID, timestamp, and score.
3. Instant Reset Utility:
   Running python seed.py clears transient demo submissions, ensuring a clean state before live presentations.

# Deployment Target
1. Backend: Render (Python Web Service running main:app)
2. Frontend: Vercel (Vite SPA framework preset with /frontend root directory)

---
Commit and Push to GitHub

Once the file is saved, run these commands in PowerShell from `D:\CCPROJECT`:

```powershell
git add README.md
git commit -m "docs: add comprehensive team onboarding & pitch guide"
git push origin main
