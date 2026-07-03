# ⚡ SkillBridge AI — Quick Start Setup Guide

A step-by-step checklist to get the application running on your local machine in under 10 minutes.

---

## ✅ Pre-Installation Checklist

Check each item before proceeding:

- [ ] **Node.js ≥ v18** installed → [Download](https://nodejs.org)
- [ ] **MongoDB ≥ v6** installed & running → [Download](https://www.mongodb.com/try/download/community)
- [ ] **Git** installed → [Download](https://git-scm.com)
- [ ] **OpenRouter account** created → [Sign up](https://openrouter.ai)

---

## 🚀 Setup in 5 Steps

### Step 1 — Clone & Enter Project

```bash
git clone https://github.com/your-username/skillbridge-ai.git
cd "SkillBridge AI"
```

---

### Step 2 — Setup Backend

```bash
cd backend
npm install
```

Create the environment file:

```bash
copy .env.example .env       # Windows
# cp .env.example .env       # macOS/Linux
```

Edit `backend/.env` and set these **required** values:

```env
MONGO_URI=mongodb://localhost:27017/skillbridge
JWT_SECRET=replace_with_a_long_random_string_here
OPENROUTER_API_KEY=sk-or-v1-paste_your_key_here
```

> 💡 **Get your OpenRouter API key:** Go to [openrouter.ai](https://openrouter.ai) → Dashboard → API Keys → Create Key

---

### Step 3 — Setup Frontend

```bash
cd ../frontend
npm install
```

No additional configuration is needed for the frontend.

---

### Step 4 — Start MongoDB

Make sure MongoDB is running:

**Windows:**
```bash
net start MongoDB
```

**macOS:**
```bash
brew services start mongodb-community
```

**Linux:**
```bash
sudo systemctl start mongod
```

---

### Step 5 — Start the Application

Open **two separate terminals**:

**Terminal 1 — Backend:**
```bash
cd backend
npm run dev
```
✅ You should see:
```
Server running on port 5000
MongoDB connected: localhost
```

**Terminal 2 — Frontend:**
```bash
cd frontend
npm run dev
```
✅ You should see:
```
VITE v8.x.x ready
➜ Local: http://localhost:5173/
```

---

## 🎉 You're Done!

Open your browser and go to:

### 👉 [http://localhost:5173](http://localhost:5173)

1. **Register** a new account
2. **Upload** your resume (PDF)
3. **Analyze** it against a job description
4. **Generate** your AI career roadmap

---

## 🔍 Quick Verification

Test that everything is working:

| Check | URL | Expected |
|---|---|---|
| Backend running | http://localhost:5000/api/health | `{"status":"ok","timestamp":"..."}` |
| Frontend running | http://localhost:5173 | Landing page loads |
| MongoDB connected | Backend terminal output | `MongoDB connected: localhost` |

---

## ⚠️ Common Quick Fixes

| Problem | Fix |
|---|---|
| `npm install` fails | Delete `node_modules` folder and `package-lock.json`, then run `npm install` again |
| MongoDB not connecting | Ensure MongoDB service is running. Check `MONGO_URI` in `.env` |
| Blank page on frontend | Make sure backend is running on port 5000 |
| AI features not working | Verify `OPENROUTER_API_KEY` in `backend/.env` is correct |
| Port 5000 already in use | Change `PORT` in `backend/.env` to another port (e.g., `5001`) |

---

## 📚 Full Documentation

For the complete documentation including API reference, architecture details, and more, see the main [README.md](./README.md).
