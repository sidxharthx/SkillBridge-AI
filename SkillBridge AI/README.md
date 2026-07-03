# 🎯 SkillBridge AI

**AI-Powered Career Guidance & Skill Gap Analyzer**

SkillBridge AI is a full-stack web application that helps job seekers analyze their resumes against job descriptions, identify skill gaps, and generate personalized AI-powered career roadmaps. Built with the MERN stack (MongoDB, Express.js, React, Node.js) and integrated with OpenRouter AI APIs.

---

## 📑 Table of Contents

- [Features](#-features)
- [Tech Stack](#-tech-stack)
- [Architecture Overview](#-architecture-overview)
- [Prerequisites](#-prerequisites)
- [Installation & Setup](#-installation--setup)
  - [1. Clone the Repository](#1-clone-the-repository)
  - [2. Backend Setup](#2-backend-setup)
  - [3. Frontend Setup](#3-frontend-setup)
  - [4. MongoDB Setup](#4-mongodb-setup)
  - [5. OpenRouter API Key](#5-openrouter-api-key)
- [Running the Application](#-running-the-application)
  - [Development Mode](#development-mode)
  - [Production Build](#production-build)
- [Project Structure](#-project-structure)
- [API Reference](#-api-reference)
- [Environment Variables](#-environment-variables)
- [User Guide](#-user-guide)
- [Troubleshooting](#-troubleshooting)
- [License](#-license)

---

## ✨ Features

| Feature | Description |
|---|---|
| **📄 Resume Upload & Parsing** | Upload PDF resumes and automatically extract skills, education, experience, projects, and certifications |
| **🔍 Skill Gap Analysis** | Compare your resume against any job description to identify matched, missing, and partially matched skills |
| **📊 Match Scoring** | Get a detailed match score with breakdown (core skills, secondary skills, project bonus, missing penalty) |
| **🗺️ AI Career Roadmap** | Generate personalized multi-phase career roadmaps with learning resources, projects, and milestones |
| **🤖 AI-Powered Insights** | Get intelligent summaries, recommendations, and skill gap explanations powered by LLMs via OpenRouter |
| **💼 Role Recommendations** | Receive AI-suggested job roles based on your current skillset |
| **📈 Dashboard** | View your career progress at a glance — latest resume, analysis scores, and roadmap status |
| **📜 History Tracking** | Access all past analyses and roadmaps in one place |
| **🔐 Authentication** | Secure JWT-based user registration and login with password hashing (bcrypt) |
| **👤 User Profiles** | Manage your profile and set a target career role |

---

## 🛠 Tech Stack

### Frontend
| Technology | Purpose |
|---|---|
| **React 19** | UI library |
| **Vite 8** | Build tool & dev server |
| **React Router v7** | Client-side routing |
| **Axios** | HTTP client |
| **Vanilla CSS** | Styling (Inter + JetBrains Mono fonts) |

### Backend
| Technology | Purpose |
|---|---|
| **Node.js** | Runtime environment |
| **Express 5** | Web framework |
| **MongoDB + Mongoose 9** | Database & ODM |
| **JSON Web Token (JWT)** | Authentication |
| **bcryptjs** | Password hashing |
| **Multer** | File upload handling |
| **pdf-parse** | PDF text extraction |
| **OpenRouter API** | AI/LLM integration |

---

## 🏗 Architecture Overview

```
┌─────────────────────────────────────────────────────────────┐
│                      FRONTEND (React + Vite)                │
│                   http://localhost:5173                      │
│                                                             │
│  Landing ─► Register/Login ─► Dashboard                     │
│                                  │                          │
│                    ┌─────────────┼─────────────┐            │
│                    ▼             ▼             ▼            │
│                 Upload       Analyze       Roadmap          │
│                (Resume)    (Skill Gap)   (AI Career)        │
│                    │             │             │            │
│                    └─────────────┼─────────────┘            │
│                                  │                          │
│                           History / Profile                 │
└──────────────────────────────────┼──────────────────────────┘
                                   │  Axios (REST API)
                                   ▼
┌─────────────────────────────────────────────────────────────┐
│                    BACKEND (Express.js)                      │
│                   http://localhost:5000                      │
│                                                             │
│  Routes: /api/auth  /api/resumes  /api/analysis  /api/roadmap│
│            │             │              │             │      │
│            ▼             ▼              ▼             ▼      │
│       Controllers ─── Services ─── Middleware               │
│            │             │              │                    │
│            │      ┌──────┴──────┐       │                    │
│            │      │  AI Service │       │                    │
│            │      │  (OpenRouter)│      │                    │
│            │      │  Resume     │       │                    │
│            │      │  Parser     │       │                    │
│            │      │  Skill      │       │                    │
│            │      │  Matcher    │       │                    │
│            │      └─────────────┘       │                    │
│            ▼                            ▼                    │
│       MongoDB (Mongoose)          JWT Auth Middleware        │
└─────────────────────────────────────────────────────────────┘
                    │
                    ▼
        ┌───────────────────┐         ┌──────────────────────┐
        │   MongoDB Server  │         │   OpenRouter API     │
        │ localhost:27017   │         │ (Qwen / GPT models)  │
        └───────────────────┘         └──────────────────────┘
```

---

## 📋 Prerequisites

Before installing, make sure you have the following software installed on your system:

| Software | Minimum Version | Download Link |
|---|---|---|
| **Node.js** | v18.0 or higher | [https://nodejs.org](https://nodejs.org) |
| **npm** | v9.0 or higher | Comes with Node.js |
| **MongoDB** | v6.0 or higher | [https://www.mongodb.com/try/download/community](https://www.mongodb.com/try/download/community) |
| **Git** | Any recent version | [https://git-scm.com](https://git-scm.com) |

### Verify installations

Open a terminal/command prompt and run:

```bash
node --version     # Should print v18.x.x or higher
npm --version      # Should print 9.x.x or higher
mongod --version   # Should print v6.x.x or higher (if installed as service, check MongoDB Compass)
git --version      # Should print git version 2.x.x
```

---

## 🚀 Installation & Setup

### 1. Clone the Repository

```bash
git clone https://github.com/your-username/skillbridge-ai.git
cd skillbridge-ai
```

Or if you already have the project folder:

```bash
cd "SkillBridge AI"
```

---

### 2. Backend Setup

```bash
# Navigate to backend directory
cd backend

# Install dependencies
npm install
```

This installs the following packages:
- `express` — Web framework
- `mongoose` — MongoDB ODM
- `cors` — Cross-origin resource sharing
- `dotenv` — Environment variable management
- `bcryptjs` — Password hashing
- `jsonwebtoken` — JWT authentication
- `multer` — File upload middleware
- `pdf-parse` — PDF text extraction
- `express-validator` — Input validation

#### Configure Environment Variables

```bash
# Copy the example environment file
copy .env.example .env        # Windows
# cp .env.example .env        # macOS / Linux
```

Open the `.env` file and update the values:

```env
PORT=5000
MONGO_URI=mongodb://localhost:27017/skillbridge
JWT_SECRET=your_jwt_secret_key_here_change_in_production
JWT_EXPIRES_IN=7d
OPENROUTER_API_KEY=your_openrouter_api_key_here
OPENROUTER_MODEL=qwen/qwen3-235b-a22b:free
OPENROUTER_FALLBACK_MODEL=deepseek/deepseek-r1-0528:free
MAX_FILE_SIZE=5242880
FRONTEND_URL=http://localhost:5173
```

> **⚠️ Important:** Replace `your_jwt_secret_key_here_change_in_production` with a strong, random secret string. Replace `your_openrouter_api_key_here` with your actual OpenRouter API key (see [Section 5](#5-openrouter-api-key)).

---

### 3. Frontend Setup

```bash
# Navigate to frontend directory (from project root)
cd frontend

# Install dependencies
npm install
```

This installs the following packages:
- `react` & `react-dom` — UI framework
- `react-router-dom` — Client-side routing
- `axios` — HTTP request library
- `vite` — Build tool (dev dependency)
- `@vitejs/plugin-react` — Vite React plugin (dev dependency)

#### Frontend Environment (Optional)

If your backend runs on a different URL, create a `.env` file in the `frontend/` directory:

```env
VITE_API_URL=http://localhost:5000/api
```

> By default, the frontend connects to `http://localhost:5000/api`, so this step is only needed if you change the backend port.

---

### 4. MongoDB Setup

#### Option A: Local MongoDB Installation

1. **Download & install** MongoDB Community Server from [mongodb.com](https://www.mongodb.com/try/download/community)

2. **Start the MongoDB service:**

   **Windows:**
   ```bash
   # MongoDB usually runs as a Windows service after installation
   # If not, start it manually:
   net start MongoDB

   # Or run mongod directly:
   mongod --dbpath "C:\data\db"
   ```

   **macOS (Homebrew):**
   ```bash
   brew services start mongodb-community
   ```

   **Linux (systemd):**
   ```bash
   sudo systemctl start mongod
   sudo systemctl enable mongod    # Start on boot
   ```

3. **Verify MongoDB is running:**
   ```bash
   # Connect via mongosh
   mongosh
   # You should see a connection message. Type 'exit' to quit.
   ```

4. The database `skillbridge` will be created automatically when the application first connects.

#### Option B: MongoDB Atlas (Cloud)

1. Create a free account at [MongoDB Atlas](https://www.mongodb.com/atlas)
2. Create a new cluster (free tier M0 is sufficient)
3. Click **"Connect"** → **"Connect your application"**
4. Copy the connection string and update your `.env`:

```env
MONGO_URI=mongodb+srv://username:password@cluster0.xxxxx.mongodb.net/skillbridge?retryWrites=true&w=majority
```

> Replace `username`, `password`, and the cluster URL with your actual Atlas credentials.

---

### 5. OpenRouter API Key

SkillBridge AI uses [OpenRouter](https://openrouter.ai) to access AI/LLM models for generating career roadmaps, skill gap explanations, resume summaries, and role recommendations.

1. Go to [https://openrouter.ai](https://openrouter.ai)
2. **Sign up** for a free account
3. Navigate to **Dashboard** → **API Keys**
4. Click **"Create Key"** and copy the generated key
5. Paste it into your `.env` file:

```env
OPENROUTER_API_KEY=sk-or-v1-your_actual_key_here
```

#### Free Models Used

The application is configured to use **free** models by default:

| Variable | Default Model | Purpose |
|---|---|---|
| `OPENROUTER_MODEL` | `qwen/qwen3-235b-a22b:free` | Primary AI model |
| `OPENROUTER_FALLBACK_MODEL` | `deepseek/deepseek-r1-0528:free` | Fallback if primary fails |

> You can change these to any model available on OpenRouter. Browse models at [https://openrouter.ai/models](https://openrouter.ai/models).

---

## ▶️ Running the Application

### Development Mode

You need **two terminal windows** — one for the backend, one for the frontend.

#### Terminal 1 — Start the Backend

```bash
cd backend
npm run dev
```

Expected output:
```
Server running on port 5000
MongoDB connected: localhost
```

#### Terminal 2 — Start the Frontend

```bash
cd frontend
npm run dev
```

Expected output:
```
  VITE v8.x.x  ready in Xms

  ➜  Local:   http://localhost:5173/
  ➜  Network: http://192.168.x.x:5173/
```

#### Open the Application

Open your browser and navigate to:

```
http://localhost:5173
```

---

### Production Build

To create an optimized production build of the frontend:

```bash
cd frontend
npm run build
```

The compiled output will be in `frontend/dist/`. You can serve it with any static file server:

```bash
npm run preview    # Preview the production build locally
```

For the backend in production:

```bash
cd backend
npm start          # Runs: node server.js
```

---

## 📁 Project Structure

```
SkillBridge AI/
│
├── backend/                        # Express.js Backend
│   ├── config/
│   │   ├── db.js                   # MongoDB connection setup
│   │   └── multer.js               # File upload configuration (PDF only, 5MB limit)
│   │
│   ├── controllers/
│   │   ├── authController.js       # Register, login, profile CRUD
│   │   ├── resumeController.js     # Upload, parse, list, delete resumes
│   │   ├── analysisController.js   # Job description analysis & skill matching
│   │   └── roadmapController.js    # AI roadmap generation & dashboard data
│   │
│   ├── middleware/
│   │   ├── auth.js                 # JWT authentication middleware
│   │   └── errorHandler.js         # Centralized error handling
│   │
│   ├── models/
│   │   ├── User.js                 # User schema (name, email, password, targetRole)
│   │   ├── Resume.js               # Resume schema (parsed text, skills, education, etc.)
│   │   ├── JobAnalysis.js          # Analysis schema (matched/missing skills, scores)
│   │   └── Roadmap.js              # Roadmap schema (phases, resources, milestones)
│   │
│   ├── routes/
│   │   ├── auth.js                 # Authentication routes
│   │   ├── resume.js               # Resume CRUD routes
│   │   ├── analysis.js             # Analysis routes
│   │   └── roadmap.js              # Roadmap & recommendation routes
│   │
│   ├── services/
│   │   ├── aiService.js            # OpenRouter API integration (roadmaps, summaries, etc.)
│   │   ├── resumeParser.js         # PDF text extraction & section parsing
│   │   └── skillMatcher.js         # Skill matching & scoring engine
│   │
│   ├── utils/
│   │   └── skillDictionary.js      # Categorized skill database for matching
│   │
│   ├── uploads/                    # Uploaded PDF files (auto-created)
│   ├── .env                        # Environment variables (DO NOT commit)
│   ├── .env.example                # Environment template
│   ├── package.json                # Backend dependencies
│   └── server.js                   # Express app entry point
│
├── frontend/                       # React + Vite Frontend
│   ├── public/                     # Static assets
│   ├── src/
│   │   ├── components/
│   │   │   ├── Navbar.jsx          # Navigation bar with auth-aware links
│   │   │   ├── Navbar.css          # Navbar styles
│   │   │   ├── ProtectedRoute.jsx  # Route guard for authenticated pages
│   │   │   ├── Loader.jsx          # Loading spinner component
│   │   │   ├── Loader.css          # Loader styles
│   │   │   ├── ScoreRing.jsx       # Circular score visualization
│   │   │   └── SkillTags.jsx       # Skill tag pills/badges
│   │   │
│   │   ├── contexts/
│   │   │   └── AuthContext.jsx     # Global auth state (login, register, logout)
│   │   │
│   │   ├── pages/
│   │   │   ├── Landing.jsx/.css    # Public landing/hero page
│   │   │   ├── Login.jsx           # Login form
│   │   │   ├── Register.jsx        # Registration form
│   │   │   ├── Dashboard.jsx/.css  # User dashboard with stats & overview
│   │   │   ├── Upload.jsx/.css     # Resume upload page (drag & drop)
│   │   │   ├── Analyze.jsx/.css    # Job description analysis page
│   │   │   ├── Roadmap.jsx/.css    # AI career roadmap viewer
│   │   │   ├── History.jsx/.css    # Past analyses & roadmaps
│   │   │   └── Profile.jsx/.css    # User profile management
│   │   │
│   │   ├── services/
│   │   │   └── api.js              # Axios API client with JWT interceptors
│   │   │
│   │   ├── hooks/                  # Custom React hooks (reserved)
│   │   ├── layouts/                # Layout components (reserved)
│   │   ├── assets/                 # Images & static assets
│   │   ├── App.jsx                 # Root component with routes
│   │   ├── main.jsx                # React DOM entry point
│   │   └── index.css               # Global styles
│   │
│   ├── index.html                  # HTML template
│   ├── vite.config.js              # Vite configuration
│   └── package.json                # Frontend dependencies
│
└── README.md                       # This documentation file
```

---

## 📡 API Reference

All API endpoints are prefixed with `/api`. Protected routes require a `Bearer` token in the `Authorization` header.

### Authentication

| Method | Endpoint | Auth | Description |
|---|---|---|---|
| `POST` | `/api/auth/register` | ❌ | Register a new user |
| `POST` | `/api/auth/login` | ❌ | Login and receive JWT token |
| `GET` | `/api/auth/profile` | ✅ | Get current user profile |
| `PUT` | `/api/auth/profile` | ✅ | Update user profile (name, targetRole) |

**Register — Request Body:**
```json
{
  "name": "John Doe",
  "email": "john@example.com",
  "password": "secret123"
}
```

**Login — Request Body:**
```json
{
  "email": "john@example.com",
  "password": "secret123"
}
```

**Response (Register/Login):**
```json
{
  "token": "eyJhbGciOiJIUzI1NiIs...",
  "user": {
    "id": "665f...",
    "name": "John Doe",
    "email": "john@example.com",
    "targetRole": ""
  }
}
```

---

### Resume Management

| Method | Endpoint | Auth | Description |
|---|---|---|---|
| `POST` | `/api/resumes/upload` | ✅ | Upload a PDF resume (multipart form) |
| `GET` | `/api/resumes` | ✅ | Get all resumes for current user |
| `GET` | `/api/resumes/:id` | ✅ | Get a specific resume by ID |
| `DELETE` | `/api/resumes/:id` | ✅ | Delete a resume |

**Upload — Form Data:**
- Key: `resume`
- Value: PDF file (max 5MB)

**Response:**
```json
{
  "message": "Resume uploaded and parsed successfully",
  "resume": {
    "id": "665f...",
    "fileName": "resume.pdf",
    "extractedSkills": {
      "frontend": ["React", "HTML", "CSS"],
      "backend": ["Node.js", "Express"],
      "database": ["MongoDB"],
      "tools": ["Git", "Docker"],
      "cloud": ["AWS"],
      "languages": ["JavaScript", "Python"],
      "softSkills": ["Leadership"]
    },
    "education": [...],
    "experience": [...],
    "projects": [...],
    "certifications": [...],
    "summary": "AI-generated summary...",
    "createdAt": "2026-04-03T..."
  }
}
```

---

### Skill Gap Analysis

| Method | Endpoint | Auth | Description |
|---|---|---|---|
| `POST` | `/api/analysis/analyze` | ✅ | Analyze resume against a job description |
| `GET` | `/api/analysis` | ✅ | Get all analyses for current user |
| `GET` | `/api/analysis/:id` | ✅ | Get a specific analysis by ID |

**Analyze — Request Body:**
```json
{
  "resumeId": "665f...",
  "jdText": "We are looking for a Full Stack Developer with experience in React, Node.js, PostgreSQL, Docker...",
  "jobTitle": "Full Stack Developer"
}
```

**Response:**
```json
{
  "message": "Analysis complete",
  "analysis": {
    "matchedSkills": ["React", "Node.js"],
    "missingSkills": ["PostgreSQL", "Docker"],
    "partialMatches": [
      { "resumeSkill": "MongoDB", "jdSkill": "PostgreSQL", "similarity": 0.6 }
    ],
    "matchScore": 72,
    "scoreBreakdown": {
      "coreSkillsScore": 45,
      "secondarySkillsScore": 20,
      "missingPenalty": -8,
      "projectBonus": 15,
      "totalScore": 72
    },
    "aiSummary": "Detailed AI analysis...",
    "recommendations": ["Learn PostgreSQL...", "Get Docker certified..."]
  }
}
```

---

### Career Roadmap

| Method | Endpoint | Auth | Description |
|---|---|---|---|
| `POST` | `/api/roadmap/generate` | ✅ | Generate AI career roadmap |
| `GET` | `/api/roadmap` | ✅ | Get all roadmaps for current user |
| `GET` | `/api/roadmap/dashboard` | ✅ | Get dashboard overview data |
| `GET` | `/api/roadmap/recommendations/:resumeId` | ✅ | Get AI role recommendations |
| `GET` | `/api/roadmap/:id` | ✅ | Get a specific roadmap by ID |

**Generate — Request Body:**
```json
{
  "resumeId": "665f...",
  "analysisId": "665f...",
  "targetRole": "Senior Full Stack Developer"
}
```

**Response (shortened):**
```json
{
  "message": "Career roadmap generated",
  "roadmap": {
    "targetRole": "Senior Full Stack Developer",
    "estimatedTimeline": "6 months",
    "summary": "A structured path from...",
    "phases": [
      {
        "phaseNumber": 1,
        "title": "Foundation Strengthening",
        "duration": "4 weeks",
        "description": "Focus on...",
        "skills": ["PostgreSQL", "TypeScript"],
        "projects": [{ "name": "...", "description": "..." }],
        "resources": [{ "title": "...", "type": "course", "url": "..." }],
        "certifications": ["AWS Cloud Practitioner"],
        "milestones": ["Complete PostgreSQL course"]
      }
    ],
    "interviewPrep": {
      "topics": ["System Design", "Data Structures"],
      "tips": ["Practice on LeetCode..."]
    }
  }
}
```

---

### Health Check

| Method | Endpoint | Auth | Description |
|---|---|---|---|
| `GET` | `/api/health` | ❌ | Server health check |

**Response:**
```json
{
  "status": "ok",
  "timestamp": "2026-04-03T09:30:00.000Z"
}
```

---

## ⚙️ Environment Variables

### Backend (`backend/.env`)

| Variable | Required | Default | Description |
|---|---|---|---|
| `PORT` | No | `5000` | Backend server port |
| `MONGO_URI` | **Yes** | `mongodb://localhost:27017/skillbridge` | MongoDB connection string |
| `JWT_SECRET` | **Yes** | — | Secret key for JWT signing (use a strong random string) |
| `JWT_EXPIRES_IN` | No | `7d` | JWT token expiration duration |
| `OPENROUTER_API_KEY` | **Yes** | — | Your OpenRouter API key for AI features |
| `OPENROUTER_MODEL` | No | `qwen/qwen3-235b-a22b:free` | Primary AI model on OpenRouter |
| `OPENROUTER_FALLBACK_MODEL` | No | `deepseek/deepseek-r1-0528:free` | Fallback AI model |
| `MAX_FILE_SIZE` | No | `5242880` (5MB) | Maximum upload file size in bytes |
| `FRONTEND_URL` | No | `http://localhost:5173` | Frontend URL for CORS configuration |

### Frontend (`frontend/.env` — Optional)

| Variable | Required | Default | Description |
|---|---|---|---|
| `VITE_API_URL` | No | `http://localhost:5000/api` | Backend API base URL |

---

## 📖 User Guide

### Step 1: Register & Login

1. Open `http://localhost:5173` in your browser
2. Click **"Get Started"** or **"Register"**
3. Fill in your name, email, and password (min 6 characters)
4. You'll be automatically logged in and redirected to the Dashboard

### Step 2: Upload Your Resume

1. Navigate to **Upload** from the navbar
2. Drag & drop your PDF resume or click to browse files
3. The system will automatically:
   - Extract text from the PDF
   - Parse education, experience, projects, and certifications
   - Categorize your skills (frontend, backend, database, tools, cloud, languages, soft skills)
   - Generate an AI-powered resume summary
4. Review the parsed results on screen

### Step 3: Analyze Against a Job Description

1. Navigate to **Analyze** from the navbar
2. Select one of your uploaded resumes
3. Paste the full job description text into the text area
4. Optionally enter the job title
5. Click **"Analyze"**
6. Review your results:
   - **Match Score** — Overall compatibility percentage
   - **Matched Skills** — Skills you already have
   - **Missing Skills** — Skills you need to acquire
   - **Partial Matches** — Related skills that partially qualify
   - **AI Recommendations** — Actionable next steps

### Step 4: Generate a Career Roadmap

1. Navigate to **Roadmap** from the navbar
2. Select a resume and (optionally) a previous analysis
3. Enter your target role (e.g., "Senior Full Stack Developer")
4. Click **"Generate Roadmap"**
5. Explore your personalized roadmap:
   - **Multiple phases** with specific skills and duration
   - **Project suggestions** to build your portfolio
   - **Learning resources** (courses, books, tutorials)
   - **Certifications** to pursue
   - **Milestones** to track progress
   - **Interview preparation** topics and tips

### Step 5: Track Your Progress

- **Dashboard** — See your latest stats, resume, analysis score, and roadmap
- **History** — Access all past analyses and roadmaps
- **Profile** — Update your name and target career role

---

## 🔧 Troubleshooting

### Common Issues

#### ❌ `MongoDB connection error`
- **Cause:** MongoDB is not running or the connection string is incorrect
- **Fix:**
  ```bash
  # Check if MongoDB is running
  mongosh                              # Try connecting
  # Windows: net start MongoDB
  # macOS: brew services start mongodb-community
  # Linux: sudo systemctl start mongod
  ```
- If using Atlas, verify your connection string and that your IP is whitelisted

#### ❌ `OPENROUTER_API_KEY is not configured`
- **Cause:** Missing or invalid API key
- **Fix:** Ensure `OPENROUTER_API_KEY` is set in `backend/.env` and starts with `sk-or-v1-`

#### ❌ `Only PDF files are allowed`
- **Cause:** Uploaded file is not a valid PDF
- **Fix:** Ensure the file has a `.pdf` extension and is a genuine PDF document

#### ❌ `File too large. Maximum 5MB allowed.`
- **Cause:** PDF exceeds the size limit
- **Fix:** Compress the PDF or increase `MAX_FILE_SIZE` in `.env` (in bytes)

#### ❌ `Could not extract text from the PDF`
- **Cause:** The PDF is scanned/image-based without selectable text
- **Fix:** Use a PDF with actual text content (not a scanned image). Use OCR tools to convert scanned PDFs first.

#### ❌ Frontend shows blank page / Cannot connect to backend
- **Cause:** Backend is not running or CORS is misconfigured
- **Fix:**
  1. Ensure the backend is running on port 5000: `npm run dev` in the `backend/` folder
  2. Verify `FRONTEND_URL` in `backend/.env` matches the frontend URL
  3. Check browser console (F12) for specific error messages

#### ❌ `AI service is temporarily unavailable`
- **Cause:** Both primary and fallback AI models failed on OpenRouter
- **Fix:**
  1. Check your OpenRouter API key is valid and has credits
  2. Try different model names in `.env`
  3. Check [OpenRouter status](https://openrouter.ai) for outages

#### ❌ `Not authorized, no token`
- **Cause:** JWT token missing or expired
- **Fix:** Log out and log back in to get a fresh token

---

## 📜 License

This project is licensed under the **ISC License**.

---

## 🙌 Contributing

1. Fork the repository
2. Create a feature branch: `git checkout -b feature/your-feature`
3. Commit your changes: `git commit -m "Add your feature"`
4. Push to the branch: `git push origin feature/your-feature`
5. Open a Pull Request

---

<p align="center">
  Built with ❤️ using the MERN Stack + AI
</p>
