# 🎮 MAIN.JS - UNIFIED APPLICATION LAUNCHER

**Version**: 3.0.0  
**Status**: ✅ Production Ready  
**Purpose**: Single entry point to launch entire Offensive Security Escape Room

---

## 📖 Quick Start

### Method 1: Direct Node (Recommended)
```bash
node main.js
```

### Method 2: npm script
```bash
npm start
# or
npm run main
```

### Method 3: Executable (Linux/Mac)
```bash
chmod +x main.js
./main.js
```

---

## 🎯 What main.js Does

The `main.js` file is a comprehensive launcher that:

✅ **Validates Environment**
- Checks Node.js version (14+ required)
- Verifies npm installation
- Validates project structure
- Confirms all required files exist

✅ **Sets Up System**
- Creates `.env` configuration automatically
- Initializes log file
- Creates necessary directories

✅ **Installs Dependencies**
- Checks if backend dependencies are installed
- Checks if frontend dependencies are installed
- Installs missing dependencies automatically

✅ **Manages Ports**
- Checks port availability (3000, 5000)
- Automatically frees ports if needed
- Handles port conflicts gracefully

✅ **Starts Services**
- Starts backend server on port 5000
- Starts frontend server on port 3000
- Manages both processes together
- Monitors process health

✅ **Health Checks**
- Waits for backend to be ready
- Waits for frontend to respond
- Validates API endpoints
- Confirms services are operational

✅ **Error Handling**
- Comprehensive error logging
- Graceful error recovery
- Process monitoring
- Safe shutdown handling

✅ **Service Integration**
- Backend and frontend start automatically
- Services communicate seamlessly
- Session persistence maintained
- No manual coordination needed

---

## 🔧 How It Works

### Startup Sequence

```
1. Environment Validation
   ✓ Node.js version check
   ✓ npm availability check
   ✓ Directory structure check
   ✓ Required files check

2. System Setup
   ✓ .env file creation
   ✓ Log file initialization
   ✓ Configuration defaults

3. Dependency Management
   ✓ Backend npm install (if needed)
   ✓ Frontend npm install (if needed)
   ✓ Module availability check

4. Port Management
   ✓ Port 5000 availability check
   ✓ Port 3000 availability check
   ✓ Auto-kill conflicting processes

5. Service Startup
   ✓ Backend npm start
   ✓ Frontend npm start
   ✓ Process monitoring begins

6. Health Verification
   ✓ Backend health check
   ✓ Frontend responsiveness check
   ✓ API endpoint validation

7. Display Success Banner
   ✓ Show access URLs
   ✓ Display status information
   ✓ Show logs location

8. Continuous Monitoring
   ✓ Process health checks
   ✓ Error recovery
   ✓ Graceful shutdown handling
```

---

## 🎨 Output Examples

### Successful Startup
```
═════════════════════════════════════════════════════════════
    🎮  OFFENSIVE SECURITY ESCAPE ROOM - MAIN LAUNCHER  🎮

              Version 3.0.0 - Production Ready

═════════════════════════════════════════════════════════════

✓ Node.js v18.x.x detected
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

═══════════════════════════════════════════════════════════════
                 🎉  CYBER ESCAPE ROOM IS READY  🎉

              All Systems Operational ✅

═══════════════════════════════════════════════════════════════

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
📋 Logs: /path/to/cyber_escape_room.log

═════════════════════════════════════════════════════════════
✓ Application is READY for use!
═════════════════════════════════════════════════════════════
```

---

## 📊 Process Management

### Automatic Monitoring
- Checks process health every 10 seconds
- Logs process state changes
- Provides error notifications
- Maintains service continuity

### Graceful Shutdown
```bash
# Press Ctrl+C to gracefully stop
# Processes will:
# 1. Receive SIGTERM signal
# 2. Perform cleanup (sessions, connections)
# 3. Close gracefully
# 4. Exit cleanly
```

---

## 🔐 Error Handling

### Handled Errors
✅ Port already in use → Auto-kill existing process  
✅ Missing dependencies → Auto-install  
✅ Missing .env file → Auto-create with defaults  
✅ Process crashes → Logged and monitored  
✅ Startup timeouts → Continue with warning  
✅ Health check failures → Retry with exponential backoff  

### Logging
All events logged to:
```
cyber_escape_room.log
```

View logs in real-time:
```bash
tail -f cyber_escape_room.log
```

---

## 🌐 Service Details

### Backend Service
- **Port**: 5000 (configurable via PORT env var)
- **Start Command**: `npm start`
- **Location**: `./backend`
- **Entry Point**: `./backend/src/server.js`
- **Features**: API endpoints, session management, scoring

### Frontend Service
- **Port**: 3000 (configurable via FRONTEND_PORT env var)
- **Start Command**: `npm start`
- **Location**: `./frontend`
- **Entry Point**: `./frontend/src/index.js`
- **Features**: React UI, real-time updates, error recovery

### Integration Points
- Frontend connects to backend via: `http://localhost:5000/api`
- Session management: Secure cookies
- Communication: HTTP/REST API
- Data persistence: In-memory sessions

---

## 🔧 Configuration

### Environment Variables

```env
# Backend port (default: 5000)
PORT=5000

# Frontend port (default: 3000)
FRONTEND_PORT=3000

# Node environment (development/production)
NODE_ENV=development

# Session secret (auto-generated if missing)
SESSION_SECRET=your-secret-key

# CORS origin (auto-set to frontend URL)
CORS_ORIGIN=http://localhost:3000

# Frontend URL
FRONTEND_URL=http://localhost:3000

# Log level
LOG_LEVEL=info
```

### Customize Ports

```bash
# Change backend port
PORT=5001 node main.js

# Change frontend port
FRONTEND_PORT=3001 node main.js

# Change both
PORT=5001 FRONTEND_PORT=3001 node main.js
```

---

## 🧪 Testing

### Verify Backend
```bash
curl http://localhost:5000/api/health
# Response: {"status":"ok",...}
```

### Verify Frontend
```bash
curl http://localhost:3000
# Response: HTML content
```

### Check Logs
```bash
# View last 50 lines
tail -50 cyber_escape_room.log

# Search for errors
grep ERROR cyber_escape_room.log

# Monitor in real-time
tail -f cyber_escape_room.log
```

---

## 📈 Performance

### Startup Times
- **First Run**: ~45 seconds (includes npm install)
- **Subsequent Runs**: ~15 seconds
- **Total Components**: 2 (Backend + Frontend)
- **Services Running**: 2 Node.js processes

### Resource Usage
- **Memory**: 160-240 MB total
- **CPU**: 2-6% average
- **Disk**: ~300 MB (node_modules)

---

## 🆘 Troubleshooting

### Problem: "Port already in use"
```bash
# main.js will try to auto-kill the process
# If that fails, manually kill:
lsof -ti:5000 | xargs kill -9  # For port 5000
lsof -ti:3000 | xargs kill -9  # For port 3000

# Then retry:
node main.js
```

### Problem: "Module not found"
```bash
# main.js should auto-install dependencies
# If it fails, manually install:
npm install
cd backend && npm install
cd ../frontend && npm install
```

### Problem: "Backend won't start"
```bash
# Check logs
tail cyber_escape_room.log

# Verify configuration
node backend/check-config.js

# Try manual start
cd backend && npm start
```

### Problem: "Frontend won't compile"
```bash
# This is normal on first run (React compilation takes time)
# Wait 30-60 seconds and refresh browser

# Or manually check:
cd frontend && npm start
```

---

## 📚 Related Files

- **start.sh** - Alternative bash launcher
- **setup.sh** - Setup script
- **verify-startup.js** - API endpoint verification
- **check-config.js** - System configuration checker
- **cyber_escape_room.log** - Application logs

---

## 🎯 Use Cases

### Development
```bash
node main.js
# Best for: Testing, debugging, local development
```

### Production Staging
```bash
NODE_ENV=production node main.js
# Best for: Pre-production testing
```

### Custom Ports
```bash
PORT=8000 FRONTEND_PORT=8080 node main.js
# Best for: Running multiple instances
```

---

## ✅ Features

✅ **Zero Configuration** - Works out of the box  
✅ **Automatic Dependency Management** - Installs missing packages  
✅ **Graceful Error Handling** - Recovers from failures  
✅ **Process Monitoring** - Watches for crashes  
✅ **Port Conflict Resolution** - Auto-handles port issues  
✅ **Health Verification** - Confirms services are ready  
✅ **Comprehensive Logging** - Full audit trail  
✅ **Safe Shutdown** - Graceful termination with Ctrl+C  

---

## 🎉 Summary

The `main.js` file is your **single entry point** to launch the entire Offensive Security Escape Room application. It handles all coordination, setup, and management automatically.

**Just run:**
```bash
node main.js
```

**Then open:**
```
http://localhost:3000
```

**And start playing!** 🎮

---

**Version**: 3.0.0  
**Status**: Production Ready ✅  
**Last Updated**: November 2025
