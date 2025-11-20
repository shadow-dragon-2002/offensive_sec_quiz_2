# 🎮 COMPREHENSIVE SETUP & LAUNCH GUIDE

## Executive Summary

The **Offensive Security Escape Room** is a complete, production-ready application that launches with a single command:

```bash
node main.js
```

This guide covers everything you need to know.

---

## 🚀 Quick Start (Recommended)

```bash
# Navigate to project directory
cd /workspaces/offensive_sec_quiz_2

# Launch the application
node main.js

# Wait for "CYBER ESCAPE ROOM IS READY" banner
# Then open browser to: http://localhost:3000
```

**Total Time**: 2-4 minutes on first run, 1-2 minutes thereafter

---

## What Gets Automated

The `main.js` launcher automatically handles:

✅ **Environment Validation**
- Checks Node.js version (requires 14+)
- Verifies npm is installed
- Confirms project structure

✅ **Configuration Setup**
- Creates .env files with proper settings
- Sets environment variables
- Configures session management

✅ **Dependency Management**
- Installs backend npm packages
- Installs frontend npm packages
- Uses npm caching for speed

✅ **Port Management**
- Checks if ports 3000 & 5000 are available
- Automatically kills processes using these ports
- Manages port configuration

✅ **Server Startup**
- Starts Express.js backend API server
- Starts React frontend development server
- Monitors process health

✅ **Health Verification**
- Checks backend API responsiveness
- Verifies frontend accessibility
- Provides startup status feedback

✅ **Error Recovery**
- Automatically retries failed operations
- Handles timeouts gracefully
- Logs all issues for debugging

---

## Detailed Startup Process

### Phase 1: Environment Validation (10-20 seconds)
```
✓ Checking Node.js version
✓ Verifying npm installed
✓ Confirming project directories
✓ Validating required files
```

### Phase 2: Environment Setup (5 seconds)
```
✓ Creating backend .env file
✓ Creating frontend .env file
✓ Setting up session configuration
✓ Preparing logs
```

### Phase 3: Dependency Installation (30-120 seconds, first run only)
```
✓ Installing backend dependencies
✓ Installing frontend dependencies
✓ Setting up npm packages
```

### Phase 4: Port Management (5 seconds)
```
✓ Port 5000 (backend) - Available
✓ Port 3000 (frontend) - Available
OR
✓ Freeing ports from existing processes
```

### Phase 5: Server Startup (10-20 seconds)
```
✓ Backend API server started on port 5000
✓ Frontend React server started on port 3000
```

### Phase 6: Health Checks (10-45 seconds)
```
✓ Backend health check passed
✓ Frontend health check passed
✓ All systems operational
```

### Phase 7: Ready! (Display Success Banner)
```
🎉 CYBER ESCAPE ROOM IS READY 🎉
All Systems Operational ✅
```

---

## After Launch

### Access the Application
```
Browser: http://localhost:3000
```

### Game Start Screen Shows:
- Mission briefing
- Challenge statistics
- Game rules
- "INITIATE CHALLENGE" button

### Click "INITIATE CHALLENGE" to Begin
You'll then see:
- Question counter (1/30, 2/30, etc.)
- 25-minute countdown timer
- Current score (starting at 1000)
- Cyberpunk-themed interface

---

## File Structure & Components

```
offensive_sec_quiz_2/
├── 📄 main.js ........................ Main launcher (START HERE!)
├── 📄 verify-startup.js ............ Verification script
├── 📄 error-recovery.js ............ Troubleshooting tools
├── 📄 package.json ................. Root dependencies
│
├── 📁 backend/ ...................... Express.js API Server
│   ├── src/
│   │   ├── server.js .............. API server & middleware
│   │   ├── routes/
│   │   │   └── quiz.js ........... Game endpoints
│   │   ├── models/
│   │   │   └── Session.js ........ Session management
│   │   ├── data/
│   │   │   └── escapeRoomQuestions.js ... 30 puzzles
│   │   └── middleware/
│   │       └── errorHandler.js .. Error handling
│   ├── .env ........................ Configuration (auto-created)
│   └── package.json .............. Backend dependencies
│
├── 📁 frontend/ .................... React.js Web App
│   ├── src/
│   │   ├── App.js ............... Main React component
│   │   ├── components/
│   │   │   ├── StartScreen.js ... Mission briefing
│   │   │   ├── QuizScreen.js .... Game interface
│   │   │   ├── ResultScreen.js .. Final results
│   │   │   └── Timer.js ......... 25-min countdown
│   │   ├── utils/
│   │   │   ├── api.js .......... API client with retry
│   │   │   └── audioManager.js . Sound effects
│   │   ├── *.css .............. Cyberpunk styling
│   │   └── index.js ........... React entry point
│   ├── public/
│   │   └── index.html ......... HTML template
│   ├── .env ................... Configuration (auto-created)
│   └── package.json .......... Frontend dependencies
│
└── 📁 docs/
    ├── LAUNCH_INSTRUCTIONS.md ... Quick start
    ├── STARTUP_GUIDE.md ........ Detailed guide
    └── COMPREHENSIVE_SETUP.md .. This file
```

---

## System Requirements

| Component | Requirement |
|-----------|-------------|
| **Node.js** | Version 14.0.0 or higher |
| **npm** | Version 6.0.0 or higher |
| **Port 5000** | Must be available for backend |
| **Port 3000** | Must be available for frontend |
| **RAM** | 2 GB minimum (4GB recommended) |
| **Disk Space** | 500 MB free space |
| **Browser** | Modern browser (Chrome, Firefox, Safari, Edge) |
| **Internet** | Required for npm install only |

### Check Your System
```bash
# Check Node.js version
node --version          # Should show v14+

# Check npm version
npm --version          # Should show 6+

# Check available ports
netstat -tulpn | grep 3000    # Port 3000
netstat -tulpn | grep 5000    # Port 5000

# Check free disk space
df -h .                # Look for Avail column
```

---

## API Endpoints

The backend provides these REST API endpoints:

```
POST   /api/quiz/start      Start a new game session
GET    /api/quiz/question   Get current question
POST   /api/quiz/answer     Submit an answer
GET    /api/quiz/stats      Get session statistics
POST   /api/quiz/reset      Reset the game
GET    /api/health          Health check
GET    /                    API information
```

### Example Requests

```bash
# Check backend health
curl http://localhost:5000/api/health

# Start a quiz session
curl -X POST http://localhost:5000/api/quiz/start

# Get current question
curl http://localhost:5000/api/quiz/question

# Submit an answer
curl -X POST http://localhost:5000/api/quiz/answer \
  -H "Content-Type: application/json" \
  -d '{"questionId": 1, "selectedAnswer": 2}'
```

---

## Game Features

### 🎯 Core Gameplay
- **30 Puzzles**: Intermediate to hard offensive security questions
- **25-Minute Timer**: Strict time limit for entire challenge
- **Score System**: Start with 1000 points, -50 penalty per wrong answer
- **Full Progression**: Continue through all 30 stages even at 0 points
- **One-Time Playthrough**: No resets or cheating allowed

### 🎨 Cyberpunk Theme
- **Dark Backgrounds**: Deep blacks and dark grays
- **Neon Colors**: Electric blue, hot pink, ultraviolet purple
- **Glitch Effects**: Text glitching animations
- **Flickering**: Neon button flickering effects
- **HUD Interface**: Terminal-style interface
- **Holographic Elements**: Glowing neon outlines

### 🎵 Audio & Effects
- **Synth Sounds**: Futuristic background ambiance
- **Laser Swooshes**: UI interaction sounds
- **Digital Hums**: Computer-like audio elements
- **Success Sounds**: Audio feedback for correct answers
- **Error Sounds**: Audio feedback for wrong answers

### 🎬 Animations
- **Smooth Transitions**: Framer Motion powered
- **Screen Transitions**: Fade and slide effects
- **Button Animations**: Hover and click effects
- **Progress Indicators**: Animated progress bars
- **Score Updates**: Animated score changes

### 🔒 Security Features
- **Session Tracking**: Unique session per playthrough
- **Server-Side Validation**: Answers verified on backend
- **Score Protection**: Cannot manipulate points
- **One-Time Lock**: Session cannot be reset
- **Secure Cookies**: Session stored securely

---

## Environment Variables

Automatically configured, but you can customize:

### Backend .env
```bash
NODE_ENV=development          # Environment mode
PORT=5000                     # Backend port
FRONTEND_URL=http://localhost:3000  # Frontend location
CORS_ORIGIN=http://localhost:3000   # CORS settings
SESSION_SECRET=<auto>         # Session encryption key
LOG_LEVEL=info               # Logging level
SESSION_TIMEOUT=1500000      # Session timeout (ms)
```

### Frontend .env
```bash
REACT_APP_API_URL=http://localhost:5000/api
REACT_APP_API_BASE=http://localhost:5000
BROWSER=none                 # Don't auto-open browser
```

---

## Helpful Commands

```bash
# STARTUP
npm start              # Run main.js
node main.js          # Same as npm start
npm run play          # Alias for npm start
npm run launch        # Alias for npm start

# VERIFICATION & DIAGNOSTICS
npm run verify        # Verify setup
npm run diagnose      # Run diagnostics
npm run fix           # Fix dependencies
npm run kill-ports    # Clear stuck ports
npm run reset         # Complete reset

# MANUAL STARTUP
npm run start:backend # Start just backend
npm run start:frontend # Start just frontend
npm run install:all   # Install all dependencies

# MAINTENANCE
npm run clean         # Remove node_modules
npm run setup         # Full setup

# DIRECT COMMANDS
node verify-startup.js              # Verify setup
node error-recovery.js 1            # Check deps
node error-recovery.js 2            # Reinstall deps
node error-recovery.js 3            # Kill ports
node error-recovery.js 4            # Diagnostics
node error-recovery.js 5 confirm    # Full reset
```

---

## Troubleshooting

### Issue: "Port 3000/5000 already in use"
```bash
# Automatic fix by main.js, or manually:
npm run kill-ports
node main.js
```

### Issue: "npm ERR! ERR!..."
```bash
# Clear cache and reinstall
npm cache clean --force
npm run fix
node main.js
```

### Issue: "Cannot find module..."
```bash
# Reinstall dependencies
npm run install:all
node main.js
```

### Issue: "Frontend not compiling"
```bash
# Normal on first run (1-2 min). If stuck longer:
npm run reset
node main.js
```

### Issue: "Backend won't start"
```bash
# Check diagnostics
npm run diagnose

# Check port usage
lsof -i :5000

# Kill and retry
npm run kill-ports
node main.js
```

### Issue: "Can't connect to backend"
```bash
# Check backend is running
curl http://localhost:5000/api/health

# Check firewall/ports
netstat -tulpn | grep 5000

# Restart everything
npm run kill-ports
node main.js
```

### Complete Reset (Last Resort)
```bash
# This will completely reset everything
npm run reset
node main.js

# Or manually:
rm -rf node_modules backend/node_modules frontend/node_modules
rm -f backend/.env frontend/.env .env
npm install
cd backend && npm install && cd ..
cd frontend && npm install && cd ..
node main.js
```

---

## Logs & Debugging

### View Real-Time Logs
```bash
# Watch the log file
tail -f cyber_escape_room.log

# Search for errors
grep ERROR cyber_escape_room.log

# Monitor startup
grep -i "startup\|ready\|error" cyber_escape_room.log
```

### Check Browser Console
1. Open browser to http://localhost:3000
2. Press F12 or Cmd+Opt+I
3. Go to Console tab
4. Look for any red errors

### Check Backend Logs
```bash
# Backend logs are in the console running main.js
# Look for:
# - ✓ Server running on port 5000
# - ✓ Backend started successfully
# - Any ERROR messages
```

---

## Performance Optimization

### First Run (3-4 minutes)
- npm installs all dependencies
- React builds for development
- Frontend compiles

### Subsequent Runs (1-2 minutes)
- Dependencies cached
- Faster startup

### Optimization Tips
- Close other applications
- Ensure good internet (first run)
- Use SSD for faster builds
- 4GB+ RAM recommended

---

## Security Considerations

✅ **Session Security**
- Sessions tracked server-side only
- Unique session ID per playthrough
- Cannot manipulate scores

✅ **Data Protection**
- Answers verified on backend
- Score calculated server-side
- Timestamps recorded

✅ **CORS Protection**
- Frontend must come from configured origin
- API accepts requests only from approved domains
- Credentials required for requests

✅ **Input Validation**
- All inputs validated
- SQL injection prevention
- Error messages don't leak information

---

## Project Statistics

| Metric | Value |
|--------|-------|
| **Total Files** | 50+ |
| **Backend Routes** | 6 endpoints |
| **Frontend Components** | 4 main screens |
| **Quiz Questions** | 30 puzzles |
| **Time Limit** | 25 minutes |
| **Difficulty** | Intermediate-Hard |
| **Answer Choices** | 4 per question |
| **Starting Score** | 1000 points |
| **Wrong Answer Penalty** | -50 points |

---

## Next Steps

1. **Run main.js**
   ```bash
   node main.js
   ```

2. **Wait for success banner**
   - Shows when all systems online

3. **Open browser**
   ```
   http://localhost:3000
   ```

4. **Click "INITIATE CHALLENGE"**
   - Game starts immediately

5. **Answer 30 questions**
   - 25-minute timer running
   - Score updates live

6. **See final results**
   - Final score displayed
   - Performance ranking shown

---

## Support & Resources

- **Quick Start**: LAUNCH_INSTRUCTIONS.md
- **Detailed Guide**: STARTUP_GUIDE.md
- **This Document**: COMPREHENSIVE_SETUP.md
- **Backend Docs**: backend/README.md (if present)
- **Frontend Docs**: frontend/README.md (if present)

---

## Version Information

- **Project**: Offensive Security Escape Room
- **Version**: 3.0.0
- **Status**: Production Ready ✅
- **Last Updated**: November 2024

---

## Final Checklist Before Running

- [ ] Node.js 14+ installed: `node --version`
- [ ] npm installed: `npm --version`
- [ ] Ports 3000 & 5000 available: `lsof -i :3000` / `lsof -i :5000`
- [ ] Project directory accessible
- [ ] 500MB+ disk space available
- [ ] 2GB+ RAM available
- [ ] Internet connection (for npm installs)

## Ready to Launch! 🚀

```bash
node main.js
```

Open browser to `http://localhost:3000` and enjoy the Cyber Escape Room!

---

**Questions?** Check LAUNCH_INSTRUCTIONS.md or run `npm run diagnose`
