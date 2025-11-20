# 🎮 OFFENSIVE SECURITY ESCAPE ROOM - UPDATED LAUNCHER GUIDE

**⚡ TL;DR: Run this single command to start everything:**

```bash
node main.js
```

Then open: **http://localhost:3000** 🚀

---

## 📋 Available Launch Methods

### ✨ Recommended: main.js (NEW - Best Option)
```bash
# Method 1: Direct execution
node main.js

# Method 2: npm script
npm start

# Method 3: npm explicit
npm run main

# Method 4: Using bash wrapper
./quick-launch.sh
```

**Advantages:**
- ✅ Single command launches EVERYTHING
- ✅ Zero manual coordination
- ✅ Automatic dependency installation
- ✅ Port conflict auto-resolution
- ✅ Comprehensive error handling
- ✅ Process monitoring
- ✅ Full logging to `cyber_escape_room.log`

---

### Alternative: start.sh (Legacy)
```bash
./start.sh
```

---

### Alternative: Docker
```bash
docker-compose up --build
```

---

## 🎯 What Happens When You Run `node main.js`

The main.js file automatically:

1. ✅ **Validates Environment**
   - Checks Node.js version (14+ required)
   - Verifies npm is installed
   - Confirms project structure exists
   - Validates all required files

2. ✅ **Sets Up System**
   - Creates `.env` configuration file if missing
   - Initializes log file (`cyber_escape_room.log`)
   - Creates necessary directories

3. ✅ **Installs Dependencies**
   - Checks if backend/node_modules exists
   - Checks if frontend/node_modules exists
   - Auto-installs any missing dependencies
   - Validates module availability

4. ✅ **Manages Ports**
   - Checks if port 5000 is available (backend)
   - Checks if port 3000 is available (frontend)
   - Auto-kills conflicting processes
   - Handles port conflicts gracefully

5. ✅ **Starts Services**
   - Starts backend Express.js server on port 5000
   - Starts frontend React app on port 3000
   - Passes correct environment variables
   - Spawns both as child processes

6. ✅ **Health Checks**
   - Waits for backend to respond
   - Validates API endpoints are working
   - Confirms frontend is responsive
   - Verifies services are operational

7. ✅ **Displays Success Banner**
   - Shows access URLs
   - Displays service status
   - Provides next steps
   - Shows log file location

8. ✅ **Continuous Monitoring**
   - Watches both processes every 10 seconds
   - Logs process health
   - Detects failures
   - Provides real-time status

9. ✅ **Error Handling**
   - Catches uncaught exceptions
   - Handles unhandled rejections
   - Logs all errors
   - Graceful shutdown on Ctrl+C

---

## 📊 Success Output Example

```
═════════════════════════════════════════════════════════════
    🎮  OFFENSIVE SECURITY ESCAPE ROOM - MAIN LAUNCHER  🎮
              Version 3.0.0 - Production Ready
═════════════════════════════════════════════════════════════

✓ Node.js v18.16.0 detected
✓ npm is available
✓ Backend directory exists
✓ Frontend directory exists
✓ All required files present
✓ .env file already exists
✓ Port 5000 is available
✓ Port 3000 is available
✓ Backend dependencies already installed
✓ Frontend dependencies already installed
✓ Backend started (PID: 12345)
✓ Backend is ready
✓ Frontend started (PID: 12346)
✓ Frontend is ready

═════════════════════════════════════════════════════════════
                 🎉  CYBER ESCAPE ROOM IS READY  🎉
              All Systems Operational ✅
═════════════════════════════════════════════════════════════

📊 Service Status:
   ✓ Backend API:  http://localhost:5000
   ✓ Frontend:     http://localhost:3000
   ✓ Health Check: http://localhost:5000/api/health

🎮 Access Instructions:
   1. Open your browser
   2. Navigate to: http://localhost:3000
   3. Click "INITIATE CHALLENGE"
   4. Start playing the offensive security quiz!

⏹️  To Stop: Press Ctrl+C
📋 Logs: /workspaces/offensive_sec_quiz_2/cyber_escape_room.log

═════════════════════════════════════════════════════════════
✓ Application is READY for use!
═════════════════════════════════════════════════════════════
```

---

## 🔧 Configuration & Custom Ports

### Use Custom Ports
```bash
# Custom backend port
PORT=5001 node main.js

# Custom frontend port
FRONTEND_PORT=3001 node main.js

# Custom both ports
PORT=5001 FRONTEND_PORT=3001 node main.js
```

### View Real-Time Logs
```bash
tail -f cyber_escape_room.log
```

### Check Logs for Errors
```bash
grep ERROR cyber_escape_room.log
```

---

## 🆘 Troubleshooting

### Issue: Port Already in Use
```bash
# main.js will auto-resolve this
# If it fails, manually kill processes:
lsof -ti:5000 | xargs kill -9
lsof -ti:3000 | xargs kill -9

# Then restart:
node main.js
```

### Issue: Dependencies Missing
```bash
# main.js will auto-install
# If it fails, manually install:
npm install
cd backend && npm install
cd ../frontend && npm install
```

### Issue: Backend Won't Start
```bash
# Check backend logs
tail cyber_escape_room.log | grep Backend

# Run system check
npm run check

# Try manual start
cd backend && npm start
```

### Issue: Frontend Won't Compile
```bash
# This may take 30-60 seconds on first run
# Wait for "Compiled successfully" message

# Or manually check:
cd frontend && npm start

# Force rebuild:
rm -rf frontend/node_modules
npm install
```

---

## 📚 Diagnostic Commands

### Verify Installation
```bash
npm run check
# Checks: Node.js, npm, directories, files, ports
```

### Verify API Endpoints
```bash
npm run verify
# Tests all 7 API endpoints
```

### View Full Configuration
```bash
cat .env
```

### Test API Manually
```bash
# Health check
curl http://localhost:5000/api/health

# Start quiz session
curl -X POST http://localhost:5000/api/quiz/start

# Get current question
curl http://localhost:5000/api/quiz/question
```

---

## 🚀 Common Workflows

### First Time Setup
```bash
# Run main.js - it handles everything
node main.js

# Wait for "READY" message
# Open browser to http://localhost:3000
# Click "INITIATE CHALLENGE"
# Start playing!
```

### Development with Auto-Restart
```bash
# Use nodemon for auto-restart on file changes
npm install -g nodemon

# Run with auto-restart
nodemon main.js
```

### Multiple Instances (Different Ports)
```bash
# Terminal 1 - Default ports
node main.js

# Terminal 2 - Custom ports
PORT=5001 FRONTEND_PORT=3001 node main.js
```

### Docker (Alternative)
```bash
# Build and run all services
docker-compose up --build

# Run in background
docker-compose up -d

# View logs
docker-compose logs -f

# Stop services
docker-compose down
```

---

## 📋 File Structure

```
offensive_sec_quiz_2/
├── main.js                    ← NEW: Universal launcher (650+ lines)
├── MAIN_JS_README.md         ← NEW: Detailed main.js documentation
├── quick-launch.sh           ← NEW: Bash wrapper for main.js
├── package.json              ← UPDATED: Contains main.js scripts
├── start.sh                  ← Alternative: Bash launcher
├── setup.sh                  ← Setup utilities
├── validate.sh               ← Validation script
│
├── backend/
│   ├── src/
│   │   ├── server.js         ← Express entry point
│   │   ├── routes/quiz.js    ← API endpoints
│   │   ├── models/Session.js ← Session management
│   │   └── middleware/errorHandler.js ← Error handling
│   ├── verify-startup.js     ← API verification
│   ├── check-config.js       ← System validation
│   └── package.json
│
├── frontend/
│   ├── src/
│   │   ├── App.js            ← Main React component
│   │   ├── components/       ← UI components
│   │   └── utils/api.js      ← API client
│   ├── package.json
│   └── public/index.html     ← HTML template
│
├── docker-compose.yml        ← Docker orchestration
├── .env                      ← Auto-created config
└── cyber_escape_room.log     ← Auto-created logs
```

---

## 🎯 Entry Point Comparison

| Method | Command | Time | Ease | Features |
|--------|---------|------|------|----------|
| **main.js** ⭐ | `node main.js` | 15s | ⭐⭐⭐ | Auto-everything |
| **npm start** ⭐ | `npm start` | 15s | ⭐⭐⭐ | Same as main.js |
| **start.sh** | `./start.sh` | 15s | ⭐⭐⭐ | Alternative bash |
| **Docker** | `docker-compose up` | 30s | ⭐⭐ | Containerized |
| **Manual** | `cd backend && npm start` | 30s+ | ⭐ | Full control |

---

## ✅ Pre-Launch Checklist

Before running `node main.js`, ensure:

- ✅ Node.js 14+ installed (`node --version`)
- ✅ npm installed (`npm --version`)
- ✅ Ports 3000 and 5000 are free (or pass custom ports)
- ✅ Working internet connection (for npm install)
- ✅ Modern browser (Chrome, Firefox, Safari, Edge)
- ✅ Sufficient disk space (~300 MB for node_modules)

---

## 📞 Support Resources

- **main.js Details**: See `MAIN_JS_README.md`
- **Quick Start**: See `QUICK_START.md`
- **API Reference**: See `API_DOCUMENTATION.md`
- **Deployment**: See `DEPLOYMENT_GUIDE.md`
- **Troubleshooting**: See `TROUBLESHOOTING.md`

---

## 🎉 Summary

**The easiest way to start the entire application:**

```bash
node main.js
```

That's it! Everything else is automatic. 🚀

---

**Version**: 3.0.0  
**Status**: ✅ Production Ready  
**Recommended Launcher**: main.js
