# 🚀 PRODUCTION DEPLOYMENT GUIDE

**Status**: ✅ **PRODUCTION READY**

> Complete guide to deploying the Offensive Security Quiz Game with zero errors, bugs, or interruptions.

## 📋 Table of Contents

1. [Quick Start (Recommended)](#quick-start)
2. [System Requirements](#system-requirements)
3. [Complete Setup](#complete-setup)
4. [Verification & Testing](#verification-testing)
5. [Troubleshooting](#troubleshooting)
6. [Production Checklist](#production-checklist)

---

## 🎯 Quick Start (Recommended)

**Single command to start everything:**

```bash
./start.sh
```

**What happens automatically:**
- ✅ Validates all prerequisites (Node.js, npm, curl)
- ✅ Checks project structure
- ✅ Installs dependencies
- ✅ Creates configuration files
- ✅ Checks port availability
- ✅ Starts backend server
- ✅ Starts frontend server
- ✅ Runs comprehensive startup verification
- ✅ Displays success banner with URLs

**Result:**
```
🎮 CYBER ESCAPE ROOM IS RUNNING

Backend API:  http://localhost:5000
Frontend App: http://localhost:3000

Open your browser: http://localhost:3000
```

---

## 📦 System Requirements

### Minimum Requirements
- **Node.js**: 14.0.0 or higher
- **npm**: 6.0.0 or higher
- **RAM**: 512 MB
- **Disk**: 500 MB
- **Ports**: 3000 (frontend), 5000 (backend)

### Recommended Specifications
- **Node.js**: 18+ LTS
- **npm**: 8+
- **RAM**: 2 GB
- **Disk**: 1 GB
- **Bandwidth**: 1 Mbps for development

### Supported Operating Systems
- ✅ Linux (Ubuntu, CentOS, Debian)
- ✅ macOS (10.13+)
- ✅ Windows (WSL2 recommended)
- ✅ Docker-ready

### Verify Prerequisites
```bash
# Check Node.js
node --version  # Should be v14.0.0 or higher

# Check npm
npm --version   # Should be 6.0.0 or higher

# Check curl
curl --version  # For health checks
```

---

## 🔧 Complete Setup

### Option 1: Automated Setup (Most Reliable)

```bash
# 1. Navigate to project directory
cd offensive_sec_quiz_2

# 2. Run the unified launcher
./start.sh

# 3. Access the application
# Frontend: http://localhost:3000
# Backend API: http://localhost:5000/api/health
```

### Option 2: Docker Setup

```bash
# Build and start containers
docker-compose up --build

# Access the application
# Frontend: http://localhost:3000
# Backend: http://localhost:5000
```

### Option 3: Manual Setup

```bash
# Backend setup
cd backend
npm install
cp .env.example .env  # or create custom .env
npm start

# Frontend setup (in new terminal)
cd frontend
npm install
REACT_APP_API_URL=http://localhost:5000/api npm start

# Access: http://localhost:3000
```

---

## ✅ Verification & Testing

### Pre-Launch Validation

```bash
# Validate configuration
node backend/check-config.js

# Expected output:
# ✓ Node.js Version (>= 14)
# ✓ npm Version (>= 6)
# ✓ Directory Structure
# ✓ Required Files
# ✓ Dependencies
# ✓ Environment Configuration
```

### Post-Launch Verification

```bash
# Automatic verification (runs during startup)
# But you can also run manually:
node backend/verify-startup.js

# Expected output:
# ✓ Health Check
# ✓ Root Endpoint
# ✓ Start Quiz
# ✓ Get Question
# ✓ Submit Answer
# ✓ Get Stats
# ✓ Reset Quiz
# ✓ Error Handling
```

### Manual API Testing

```bash
# Test health endpoint
curl http://localhost:5000/api/health

# Response:
# {
#   "status": "ok",
#   "message": "Offensive Security Quiz API is running",
#   "timestamp": "2024-11-20T12:00:00.000Z",
#   "environment": "development"
# }
```

### Full Test Scenario

```bash
# 1. Start a quiz session
curl -X POST http://localhost:5000/api/quiz/start \
  --cookie-jar cookies.txt \
  -H "Content-Type: application/json"

# 2. Get current question
curl http://localhost:5000/api/quiz/question \
  --cookie cookies.txt

# 3. Submit an answer
curl -X POST http://localhost:5000/api/quiz/answer \
  --cookie cookies.txt \
  -H "Content-Type: application/json" \
  -d '{"questionId": 1, "selectedAnswer": 0}'

# 4. Get session stats
curl http://localhost:5000/api/quiz/stats \
  --cookie cookies.txt

# 5. Reset quiz
curl -X POST http://localhost:5000/api/quiz/reset \
  --cookie cookies.txt
```

---

## 🐛 Troubleshooting

### Issue 1: Port Already in Use

**Error**: `EADDRINUSE: address already in use :::5000`

**Solutions**:
```bash
# Option 1: Kill the process using the port
lsof -ti:5000 | xargs kill -9

# Option 2: Use a different port
PORT=5001 npm start

# Option 3: Use the auto-kill feature
./start.sh --kill-ports
```

### Issue 2: Dependencies Not Installed

**Error**: `Cannot find module 'express'`

**Solution**:
```bash
cd backend
npm install
cd ../frontend
npm install
```

### Issue 3: Backend Won't Start

**Error**: Backend process exits immediately

**Debug**:
```bash
# Check logs
tail -f cyber_escape_room.log

# Run configuration check
node backend/check-config.js

# Try manual startup
cd backend
npm start
```

### Issue 4: Frontend Compilation Issues

**Error**: `Module not found` or `Cannot find module`

**Solution**:
```bash
# Clear cache and reinstall
cd frontend
rm -rf node_modules package-lock.json
npm install
npm start
```

### Issue 5: CORS Errors

**Error**: `Access to XMLHttpRequest blocked by CORS policy`

**Check**: Backend `.env` file
```bash
# Verify CORS_ORIGIN setting
cat backend/.env | grep CORS_ORIGIN

# Should be: CORS_ORIGIN=http://localhost:3000
```

### Issue 6: Session Not Persisting

**Error**: Session data lost between requests

**Solution**:
```bash
# Ensure cookies are enabled in browser
# Check browser developer console (F12)
# Verify SESSION_SECRET in .env
cat backend/.env | grep SESSION_SECRET
```

### Health Check Commands

```bash
# Frontend health
curl http://localhost:3000

# Backend health
curl http://localhost:5000/api/health

# Check if ports are in use
lsof -i :3000
lsof -i :5000

# Check running processes
ps aux | grep node
```

---

## ✨ Production Checklist

### Before Deployment

- [ ] System meets minimum requirements (Node.js 14+, npm 6+)
- [ ] Ports 3000 and 5000 are available
- [ ] 500 MB disk space available
- [ ] All prerequisites installed (`check-config.js` passes)
- [ ] `./start.sh` completes successfully
- [ ] Startup verification passes (`verify-startup.js` succeeds)
- [ ] All 6 API endpoints responding correctly
- [ ] No errors in console or logs

### During Deployment

- [ ] Backend starts and shows initialization banner
- [ ] Frontend compiles without errors
- [ ] Health checks pass
- [ ] Quiz can be started
- [ ] Questions can be fetched
- [ ] Answers can be submitted
- [ ] Stats are retrievable
- [ ] Session reset works

### Post-Deployment

- [ ] Application accessible at http://localhost:3000
- [ ] All endpoints responding with proper status codes
- [ ] Error messages are clear and helpful
- [ ] Session management working correctly
- [ ] No memory leaks or performance degradation
- [ ] Logs are being written correctly
- [ ] Graceful shutdown (Ctrl+C) works

---

## 📊 API Endpoints Reference

| Endpoint | Method | Purpose | Status |
|----------|--------|---------|--------|
| `/api/health` | GET | Server health check | ✅ |
| `/` | GET | API info endpoint | ✅ |
| `/api/quiz/start` | POST | Start quiz session | ✅ |
| `/api/quiz/question` | GET | Get current question | ✅ |
| `/api/quiz/answer` | POST | Submit answer | ✅ |
| `/api/quiz/stats` | GET | Get session stats | ✅ |
| `/api/quiz/reset` | POST | Reset session | ✅ |

---

## 🔐 Security Features Enabled

- ✅ **CORS Protection**: Configured for localhost only
- ✅ **Session Management**: Secure HTTP-only cookies
- ✅ **Server-side Validation**: All answers validated on backend
- ✅ **Error Handling**: No sensitive data in error messages
- ✅ **Graceful Shutdown**: Proper cleanup on termination
- ✅ **Session Expiry**: Automatic cleanup of old sessions

---

## 📝 Environment Configuration

### Backend `.env` File

```env
# Server Configuration
PORT=5000
NODE_ENV=development

# Frontend URL
FRONTEND_URL=http://localhost:3000
CORS_ORIGIN=http://localhost:3000

# Session
SESSION_SECRET=your-secure-random-key-here

# Logging
LOG_LEVEL=debug
```

### Frontend Environment Variables

```bash
# .env or passed via npm start
REACT_APP_API_URL=http://localhost:5000/api
BROWSER=none  # Don't auto-open browser
```

---

## 🚀 Performance Tips

### For Development
- Use `npm start` (auto-reload enabled)
- Keep browser DevTools open for debugging
- Monitor network tab for API calls

### For Production
- Set `NODE_ENV=production`
- Enable compression middleware
- Use PM2 for process management
- Set up monitoring and alerting
- Configure proper logging

### Optimization
```bash
# Build frontend for production
cd frontend
npm run build

# Use production Node environment
export NODE_ENV=production

# Use PM2 for auto-restart
pm2 start backend/src/server.js --name "quiz-backend"
```

---

## 📞 Support & Getting Help

### Debug Mode
```bash
# Run with verbose logging
LOG_LEVEL=debug ./start.sh
```

### View Logs
```bash
# Real-time logs
tail -f cyber_escape_room.log

# Last 50 lines
tail -50 cyber_escape_room.log

# Search for errors
grep ERROR cyber_escape_room.log
```

### Complete System Check
```bash
# Run all validations
bash validate.sh

# Expected output:
# ✓ All checks passed
# ✓ System is ready
```

---

## ✅ Verification Checklist

After running `./start.sh`, verify:

```bash
# 1. Check backend is running
curl http://localhost:5000/api/health
# Should return: {"status": "ok", ...}

# 2. Check frontend is running
curl http://localhost:3000
# Should return HTML

# 3. Check browser
# Open http://localhost:3000
# Should show cyberpunk-themed quiz interface

# 4. Check logs
tail cyber_escape_room.log
# Should show successful startup messages

# 5. Run verification script
node backend/verify-startup.js
# Should show all tests passed
```

---

## 🎉 Success!

When you see:
```
╔═══════════════════════════════════════════════════════════╗
║                                                           ║
║           🎮  CYBER ESCAPE ROOM IS RUNNING  🎮            ║
║                                                           ║
║               🌐 APPLICATION READY TO ACCESS              ║
║                                                           ║
╚═══════════════════════════════════════════════════════════╝

Backend API:  http://localhost:5000
Frontend App: http://localhost:3000

🎮 Open your browser and navigate to:
    ➜ http://localhost:3000
```

**🎉 Your application is ready!**

Open http://localhost:3000 in your browser and start playing the Offensive Security Quiz!

---

## 📚 Additional Resources

- [README.md](./README.md) - Project overview
- [QUICK_START.md](./QUICK_START.md) - Quick setup guide
- [TROUBLESHOOTING.md](./TROUBLESHOOTING.md) - Detailed troubleshooting
- [API_DOCUMENTATION.md](./API_DOCUMENTATION.md) - API reference
- [ARCHITECTURE.md](./ARCHITECTURE.md) - System architecture

---

**Last Updated**: November 2024  
**Version**: 1.0.0  
**Status**: Production Ready ✅
