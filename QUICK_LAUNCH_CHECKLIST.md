# 🚀 QUICK LAUNCH CHECKLIST

**Get your Offensive Security Quiz running in seconds with zero issues!**

---

## ⚡ 30-Second Quick Start

```bash
# 1. Navigate to project
cd offensive_sec_quiz_2

# 2. Run the launcher
./start.sh

# 3. Open in browser
# http://localhost:3000
```

**Done!** 🎉 Your quiz is running!

---

## ✅ Pre-Launch Checklist (2 minutes)

Before running `./start.sh`, verify:

### System Requirements
- [ ] Node.js installed: `node --version` (14+)
- [ ] npm installed: `npm --version` (6+)
- [ ] curl installed: `curl --version`
- [ ] At least 500 MB disk space: `df -h`
- [ ] Ports 3000 & 5000 available: `lsof -i :3000; lsof -i :5000`

### Project Structure
- [ ] `backend/` directory exists
- [ ] `frontend/` directory exists
- [ ] `start.sh` file exists and is executable
- [ ] `backend/src/server.js` exists
- [ ] `frontend/src/App.js` exists

### Configuration
- [ ] `backend/package.json` is valid
- [ ] `frontend/package.json` is valid
- [ ] No proxy conflicts in environment

**Quick Check**:
```bash
# Run automatic validation
node backend/check-config.js

# Should show all ✓ (green checks)
```

---

## 🎯 Launch Steps

### Step 1: Run Launcher
```bash
./start.sh
```

**Expected Output**:
```
╔════════════════════════════════════════════╗
║  🚀 Offensive Security Quiz API Server    ║
║  Server running on port: 5000              ║
╚════════════════════════════════════════════╝
```

### Step 2: Wait for Startup
- ⏳ Dependencies check: 5 seconds
- ⏳ Backend startup: 10 seconds
- ⏳ Frontend compilation: 30 seconds (first run)
- ⏳ Verification: 10 seconds

**Total Time**: ~45 seconds (first run)

### Step 3: Verify Success
Look for this message:
```
🎮 CYBER ESCAPE ROOM IS RUNNING

Backend API:  http://localhost:5000
Frontend App: http://localhost:3000

🎮 Open your browser and navigate to:
    ➜ http://localhost:3000
```

### Step 4: Open in Browser
```
http://localhost:3000
```

---

## 🟢 Success Indicators

### Backend Ready ✓
```bash
curl http://localhost:5000/api/health
# Returns: {"status":"ok",...}
```

### Frontend Ready ✓
```bash
curl http://localhost:3000
# Returns: HTML page content
```

### Verification Complete ✓
```
✓ Health Check
✓ Root Endpoint
✓ Start Quiz
✓ Get Question
✓ Submit Answer
✓ Get Stats
✓ Reset Quiz
✓ Error Handling

✓ ALL TESTS PASSED - System is ready!
```

---

## ⚠️ Common Startup Issues & Quick Fixes

### Issue: Port 5000 Already in Use
```bash
# Quick Fix: Kill the process
lsof -ti:5000 | xargs kill -9

# Or use a different port
PORT=5001 npm start  # in backend directory
```

### Issue: Module Not Found
```bash
# Quick Fix: Reinstall dependencies
cd backend && npm install && cd ..
cd frontend && npm install && cd ..
```

### Issue: Node Version Too Old
```bash
# Check: node --version (should be 14+)
# Fix: Update Node.js at https://nodejs.org
```

### Issue: Frontend Not Compiling
```bash
# Quick Fix: Clear and reinstall
cd frontend
rm -rf node_modules package-lock.json
npm install
npm start
```

### Issue: CORS Error in Browser
```bash
# Verify backend .env has correct CORS_ORIGIN
grep CORS_ORIGIN backend/.env
# Should be: CORS_ORIGIN=http://localhost:3000
```

---

## 🔍 Verification Commands

Run these after seeing the success banner:

```bash
# Test 1: Health Check
curl http://localhost:5000/api/health

# Test 2: API Info
curl http://localhost:5000/

# Test 3: Start Quiz
curl -X POST http://localhost:5000/api/quiz/start \
  --cookie-jar cookies.txt

# Test 4: Get Question
curl http://localhost:5000/api/quiz/question \
  --cookie cookies.txt

# Test 5: Verify Frontend
curl http://localhost:3000 | head -20
```

**Expected**: All commands return without errors and 200 status codes.

---

## 📊 Resource Usage

### Typical Startup Resource Requirements
- **CPU**: 2-3% per process (4-6% total)
- **Memory**: 80-120 MB per process (160-240 MB total)
- **Disk**: ~300 MB (node_modules)
- **Network**: < 100 Kbps during startup

### If System Runs Slow
```bash
# Check available resources
free -h
ps aux | grep node

# Option 1: Increase available RAM
# Close other applications

# Option 2: Use different port (less congestion)
PORT=5002 npm start

# Option 3: Restart for cleanup
pkill node && sleep 2 && ./start.sh
```

---

## 🛑 Stopping the Application

### Graceful Shutdown
```bash
# Press Ctrl+C in the terminal running ./start.sh
# Or in background:
pkill node
```

**Expected Output**:
```
🛑 Graceful shutdown initiated...
✓ HTTP server closed
✓ All sessions cleaned up
```

---

## 📱 Accessing the Application

### From Same Machine
- **Frontend**: http://localhost:3000
- **Backend**: http://localhost:5000/api/health

### From Another Machine (Local Network)
```bash
# Find your machine IP
hostname -I
# Example output: 192.168.1.100

# Access from other machine:
# http://192.168.1.100:3000
```

### Production Deployment
- See [DEPLOYMENT_GUIDE.md](./DEPLOYMENT_GUIDE.md)
- See [PRODUCTION_MASTER_GUIDE.md](./PRODUCTION_MASTER_GUIDE.md)

---

## 🎮 First Game Session

### What to Expect
1. **Start Screen** appears with cyberpunk theme
2. Click "INITIATE CHALLENGE"
3. **Timer** starts (25 minutes)
4. **Questions** appear (30 total)
5. Select answer and submit
6. **Feedback** given immediately
7. Progress tracked in real-time
8. **Results** shown after completion

### Scoring
- **Start Score**: 1000 points
- **Wrong Answer**: -50 points penalty
- **Correct Answer**: +10-30 points (depends on difficulty)
- **Time Bonus**: Faster completions get bonus points

### Tips
- Read questions carefully
- Submit answers you're confident about
- Wrong answers don't lock the session (can retry)
- Watch the timer for time management

---

## 📝 After Startup

### Monitor the Application
```bash
# Watch logs in real-time
tail -f cyber_escape_room.log

# Check for errors
grep ERROR cyber_escape_room.log

# Check performance
grep "ms" cyber_escape_room.log | head -20
```

### Regular Maintenance
```bash
# Daily: Check health
curl http://localhost:5000/api/health

# Weekly: Restart services
pkill node && sleep 2 && ./start.sh

# Monthly: Update dependencies
npm update
```

---

## 🆘 When Something Goes Wrong

### Quick Diagnostic
```bash
# 1. Check what's running
ps aux | grep node

# 2. Check ports
lsof -i :3000
lsof -i :5000

# 3. Check logs
tail -50 cyber_escape_room.log

# 4. Test backend
curl -v http://localhost:5000/api/health

# 5. Run full check
node backend/check-config.js
```

### Emergency Reset
```bash
# Kill everything and restart fresh
pkill node
sleep 3
rm -rf backend/node_modules frontend/node_modules
npm install --prefix backend
npm install --prefix frontend
./start.sh
```

---

## 📚 Documentation

For more information:

| Document | Purpose |
|----------|---------|
| [DEPLOYMENT_GUIDE.md](./DEPLOYMENT_GUIDE.md) | Complete deployment guide |
| [ERROR_PREVENTION_GUIDE.md](./ERROR_PREVENTION_GUIDE.md) | Troubleshooting & error recovery |
| [API_DOCUMENTATION.md](./API_DOCUMENTATION.md) | API reference |
| [README.md](./README.md) | Project overview |
| [QUICK_START.md](./QUICK_START.md) | Detailed quick start |

---

## ✨ Features Enabled on Startup

✅ **Backend**
- Session management with secure cookies
- CORS protection configured
- Error handling with detailed logging
- Graceful shutdown on Ctrl+C
- Automatic session cleanup (every hour)

✅ **Frontend**
- Real-time API health checks
- Automatic retry logic with backoff
- Error boundary for React components
- Responsive design (mobile-friendly)
- Performance monitoring

✅ **Security**
- Server-side answer validation
- HTTP-only cookies
- Session timeout (25 minutes)
- CORS restrictions
- Error messages don't expose internals

---

## 🎯 Quick Reference

```bash
# Start
./start.sh

# Stop
Ctrl+C

# Restart
pkill node && sleep 2 && ./start.sh

# Check health
curl http://localhost:5000/api/health

# View logs
tail -f cyber_escape_room.log

# Verify installation
node backend/check-config.js

# Full startup test
node backend/verify-startup.js
```

---

## ✅ Final Checklist

Before declaring "Ready":

- [ ] Backend shows initialization banner
- [ ] Frontend compiles without errors
- [ ] Both health checks pass
- [ ] Browser displays quiz interface
- [ ] Can start a quiz session
- [ ] Can submit an answer
- [ ] Logs show no errors
- [ ] Startup verification passes

---

## 🎉 You're All Set!

Your Offensive Security Quiz is now running and ready to use!

```
🎮 Open: http://localhost:3000
🔗 API: http://localhost:5000/api
📊 Status: All Systems Operational ✅
⏱️ Timer: 25 minutes per session
📈 Questions: 30 total difficulty levels
🎯 Scoring: Real-time feedback system
```

**Happy Gaming!** 🚀

---

**Last Updated**: November 2024  
**Version**: 1.0.0  
**Status**: Production Ready ✅
