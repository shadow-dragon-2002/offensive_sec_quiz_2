# 🚀 QUICK START GUIDE - OFFENSIVE SECURITY ESCAPE ROOM

## One Command to Fix Everything & Start

```bash
node MASTER_FIX.js
```

This will:
1. ✓ Kill any processes on ports 3000 & 5000
2. ✓ Clean and rebuild all dependencies
3. ✓ Validate all files and packages
4. ✓ Start the application automatically
5. ✓ Open your browser

---

## Alternative: Step-by-Step

### Step 1: Fix All Issues
```bash
node FIX_ALL.js
```
Fixes: Dependencies, ports, environment, configuration

### Step 2: Run Diagnostics
```bash
node DIAGNOSTIC_TEST.js
```
Tests: Files, packages, ports, configuration

### Step 3: Start Application
```bash
node main.js
```

### Step 4: Open Browser
```
http://localhost:3000
```

---

## Troubleshooting

### Port Already in Use
```bash
# Kill process on port 5000
lsof -ti:5000 | xargs kill -9

# Kill process on port 3000
lsof -ti:3000 | xargs kill -9
```

### Dependencies Not Installing
```bash
# Backend
cd backend && rm -rf node_modules package-lock.json && npm install --force && cd ..

# Frontend
cd frontend && rm -rf node_modules package-lock.json && npm install --force && cd ..
```

### Backend Won't Start
```bash
# Test backend directly
cd backend
node src/server.js

# Should see: "listening on port 5000"
```

### Frontend Not Building
```bash
# Test frontend build
cd frontend
npm run build

# Should create build/ directory
```

---

## Application Features

🎮 **30 Challenging Puzzles**
- Network Infiltration
- Web Exploitation  
- Memory Corruption
- Cryptography
- And more!

⏱️ **25-Minute Challenge**
- Real-time countdown timer
- Progressive difficulty levels
- Point-based scoring system

🎨 **Cyberpunk UI**
- Neon colors & animations
- Smooth transitions
- Responsive design

🔐 **Secure Backend**
- Session-based authentication
- CORS protection
- Tamper-proof scoring

---

## Ports & URLs

| Service | Port | URL |
|---------|------|-----|
| Backend API | 5000 | http://localhost:5000 |
| Frontend | 3000 | http://localhost:3000 |
| Health Check | 5000 | http://localhost:5000/api/health |

---

## Logs & Debugging

### Application Logs
- File: `cyber_escape_room.log`
- Console: Real-time output when running

### Debug Mode
The application automatically runs in development mode with detailed logging

### Check Backend Health
```bash
curl http://localhost:5000/api/health
```

Should return:
```json
{
  "status": "ok",
  "message": "Offensive Security Quiz API is running",
  "timestamp": "2024-11-20T...",
  "environment": "development"
}
```

---

## Stopping the Application

Press `Ctrl+C` to stop gracefully

---

## System Requirements

- Node.js 14+ (you have 22.21.1 ✓)
- npm 6+ (installed ✓)
- Ports 3000 & 5000 available
- 500MB free disk space

---

## All Set! 🎉

Run this command to start:
```bash
node MASTER_FIX.js
```

Then open: **http://localhost:3000**

Good luck! 🚀
