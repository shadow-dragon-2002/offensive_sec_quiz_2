# 🚀 HOW TO LAUNCH THE CYBER ESCAPE ROOM

## The Absolute Simplest Way

```bash
node main.js
```

That's it. Run this ONE command and everything will work.

---

## What You'll See

1. **Initial Banner** - Welcome screen with version info
2. **Validation Phase** - Checking environment and dependencies (⏱️ 10-20 sec)
3. **Setup Phase** - Creating configuration files (⏱️ 5 sec)
4. **Installation Phase** - Installing npm packages if needed (⏱️ 30-120 sec first time only)
5. **Port Checking** - Ensuring ports 3000 & 5000 are available (⏱️ 5 sec)
6. **Backend Startup** - Express API server starting (⏱️ 10-15 sec)
7. **Frontend Startup** - React app starting (⏱️ 30-60 sec)
8. **Health Checks** - Verifying both services online (⏱️ 10-45 sec)
9. **Success Banner** - All systems online, ready to play!

---

## After Startup (What to Do Next)

Once you see the green success banner showing:
```
🎉 CYBER ESCAPE ROOM IS READY 🎉
All Systems Operational ✅
```

1. **Open your browser**
2. **Go to**: `http://localhost:3000`
3. **Click**: "INITIATE CHALLENGE"
4. **Start playing!**

---

## Total Time to Play

- **First Run**: 2-4 minutes (includes npm installs)
- **Subsequent Runs**: 1-2 minutes (cached dependencies)

---

## If Something Goes Wrong

### Port Already in Use
**Error**: "Port 3000/5000 already in use"
**Solution**: `main.js` handles this automatically. If not:
```bash
node error-recovery.js 3
```

### Dependencies Installation Fails
**Error**: "npm ERR! code..."
**Solution**: Clear and reinstall
```bash
node error-recovery.js 2
```

### Backend Won't Start
**Error**: "Backend exited with code..."
**Solution**: Run diagnostics
```bash
node error-recovery.js 4
```

### Complete Reset Needed
**Solution**: Full environment reset
```bash
node error-recovery.js 5 confirm
```

---

## Alternative: Manual Start (If You Prefer)

### Terminal 1 - Backend
```bash
cd backend
npm install
npm start
# You'll see: ✓ Server running on port: 5000
```

### Terminal 2 - Frontend (new terminal)
```bash
cd frontend
npm install
npm start
# You'll see: ✓ Frontend compiled successfully
```

### Browser
Open: `http://localhost:3000`

---

## System Requirements

✅ **Node.js**: Version 14 or higher
✅ **npm**: Version 6 or higher
✅ **Ports**: 3000 and 5000 available
✅ **RAM**: 2GB minimum recommended
✅ **Storage**: 500MB free space
✅ **Browser**: Any modern browser (Chrome, Firefox, Safari, Edge)

---

## Game Details

**📋 What's Included:**
- 30 progressively difficult cybersecurity puzzles
- 25-minute time limit
- Cyberpunk UI with neon effects
- Immersive glitch animations
- Synth soundscapes and audio effects
- Session-based security
- Score tracking (start: 1000 points, -50 per error)
- Full progression even with zero points

**🎮 How to Play:**
1. Answer 30 offensive security questions
2. Each question has 4 similar answer options
3. Select the correct answer to advance
4. Wrong answers deduct 50 points
5. No hints or answer reveals
6. Continue through all 30 levels
7. Final score shown at completion

---

## Troubleshooting Guide

### Issue: "Backend server is offline"
```bash
# Check backend is running
curl http://localhost:5000/api/health

# If offline, restart
node main.js
```

### Issue: "Frontend won't compile"
```bash
# This is normal on first run (1-2 minutes)
# Wait for "Frontend compiled successfully" message

# If stuck longer than 3 minutes:
node error-recovery.js 2  # Reinstall dependencies
node main.js               # Try again
```

### Issue: "Port X is in use"
```bash
# Automatic in main.js, but to manually clear:
node error-recovery.js 3

# Or manually:
lsof -ti:3000 | xargs kill -9   # Kill frontend
lsof -ti:5000 | xargs kill -9   # Kill backend
```

### Issue: "npm install fails"
```bash
# Clear cache and retry
npm cache clean --force
node error-recovery.js 2
```

---

## Common Commands Reference

```bash
# Standard start (RECOMMENDED)
node main.js

# Verify everything is set up correctly
node verify-startup.js

# Run diagnostics and fix errors
node error-recovery.js 1    # Check dependencies
node error-recovery.js 2    # Reinstall dependencies
node error-recovery.js 3    # Kill stuck processes
node error-recovery.js 4    # Run diagnostics
node error-recovery.js 5 confirm  # Full reset

# View logs
tail -f cyber_escape_room.log

# Manually start backend
cd backend && npm start

# Manually start frontend
cd frontend && npm start

# Stop everything gracefully
# Press Ctrl+C in the terminal running main.js

# Force stop
pkill -f "node main.js"
```

---

## Performance Tips

### Speed Up First Run
- Close other applications to free up RAM
- Ensure good internet connection for npm installs
- Be patient during frontend compilation (normal 1-2 min)

### Speed Up Subsequent Runs
- Already cached! Runs in 1-2 minutes
- Dependencies only installed once

### Monitor Performance
```bash
# View real-time logs
tail -f cyber_escape_room.log

# Check port status
lsof -ti:3000  # Frontend port
lsof -ti:5000  # Backend port
```

---

## File Structure

```
offensive_sec_quiz_2/
├── main.js                 ← START HERE!
├── verify-startup.js       ← Check setup
├── error-recovery.js       ← Fix errors
├── STARTUP_GUIDE.md        ← Detailed guide
│
├── backend/
│   ├── src/
│   │   ├── server.js      ← API
│   │   ├── routes/quiz.js ← Game logic
│   │   ├── data/          ← Questions
│   │   └── models/        ← Session management
│   └── package.json
│
├── frontend/
│   ├── src/
│   │   ├── App.js         ← Main app
│   │   ├── components/    ← Screens
│   │   └── utils/         ← API client
│   └── package.json
│
└── package.json
```

---

## Support

### Check Status
```bash
# Backend health
curl http://localhost:5000/api/health

# Frontend accessible
curl http://localhost:3000

# View logs
cat cyber_escape_room.log
```

### Clear Cache & Reinstall
```bash
rm -rf node_modules backend/node_modules frontend/node_modules
npm install
cd backend && npm install && cd ..
cd frontend && npm install && cd ..
```

---

## 🎉 You're Ready!

Simply run:
```bash
node main.js
```

Then open: `http://localhost:3000`

Enjoy the Cyber Escape Room! 🎮
