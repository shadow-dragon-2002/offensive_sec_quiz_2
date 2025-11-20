# 🎮 CYBER ESCAPE ROOM - STARTUP GUIDE

## Quick Start (Recommended)

```bash
# Navigate to project root
cd /workspaces/offensive_sec_quiz_2

# Run the main launcher
node main.js
```

That's it! The application will:
- ✅ Verify all dependencies
- ✅ Install missing packages
- ✅ Configure environment variables
- ✅ Start the backend API server (port 5000)
- ✅ Start the frontend React app (port 3000)
- ✅ Perform health checks
- ✅ Display access instructions

## What Happens During Startup

### Phase 1: Environment Validation (10-20 seconds)
- Checks Node.js version (requires 14+)
- Verifies npm is installed
- Confirms all project directories exist
- Validates required files are present

### Phase 2: Setup (5-30 seconds)
- Creates `.env` files with proper configuration
- Sets up session management
- Prepares database if needed

### Phase 3: Dependency Installation (30-120 seconds on first run)
- Installs backend dependencies
- Installs frontend dependencies
- Uses npm caching for faster subsequent runs

### Phase 4: Port Management (5 seconds)
- Checks if ports 5000 (backend) and 3000 (frontend) are available
- Automatically kills processes using these ports if needed
- Configures proper port bindings

### Phase 5: Server Startup (10-20 seconds)
- Starts backend Express.js server on port 5000
- Starts frontend React development server on port 3000
- Displays startup confirmation messages

### Phase 6: Health Checks (10-45 seconds)
- Verifies backend API is responding
- Verifies frontend is accessible
- Provides status feedback

### Phase 7: Application Ready (Total: 2-4 minutes)
- Displays access URLs
- Shows game instructions
- Logs location for reference

## After Startup

Once you see the success banner, open your browser and go to:

```
http://localhost:3000
```

You'll see the CYBER ESCAPE ROOM start screen. Click "INITIATE CHALLENGE" to begin!

## Game Features

### ✅ What's Included
- **30 Challenging Puzzles**: Intermediate to hard offensive security questions
- **Cyberpunk UI**: Dark background, neon blue/pink/purple glowing effects
- **25-Minute Timer**: Strict time limit for the entire challenge
- **Score System**: Start with 1000 points, -50 penalty per wrong answer
- **Session Security**: One-time playthrough, no resets or cheating
- **Full Progression**: Continue through all 30 stages even with 0 points
- **Glitch Effects**: Animated glitch text, flickering buttons
- **Immersive Audio**: Synth sounds, laser effects, digital hums
- **Rich Animations**: Framer Motion powered transitions

### Game Rules
1. **No Hints**: Wrong answers don't reveal the correct answer
2. **Multiple Choice**: Answer options are intentionally similar/confusing
3. **Must Be Exact**: Only the exact correct answer advances to the next level
4. **Balanced Options**: Answer choices vary in length to prevent guessing by length
5. **Score Penalties**: Each wrong attempt costs 50 points
6. **Ambiguous Feedback**: Wrong answers show generic "ACCESS DENIED" message
7. **Full Completion**: You can complete all 30 stages regardless of score

## Troubleshooting

### Port Already in Use
If you get "Port already in use" error:
```bash
# main.js will handle this automatically, OR manually:
lsof -ti:5000 | xargs kill -9   # Kill backend
lsof -ti:3000 | xargs kill -9   # Kill frontend
node main.js                      # Restart
```

### Slow Startup on First Run
The frontend React build can take 1-2 minutes on first startup. This is normal. You'll see "Frontend compilation in progress" message. Wait for completion.

### Backend Not Responding
If backend shows offline:
1. Check port 5000 is available
2. Verify backend/package.json exists
3. Check backend/src/server.js exists
4. Ensure Node.js version is 14+

### Frontend Not Loading
If frontend shows offline:
1. Check port 3000 is available
2. Verify frontend/package.json exists
3. Check console browser dev tools for errors
4. Ensure REACT_APP_API_URL is correctly set

### Dependencies Installation Fails
```bash
# Clear and reinstall
rm -rf node_modules backend/node_modules frontend/node_modules package-lock.json
npm install
cd backend && npm install && cd ..
cd frontend && npm install && cd ..
```

## Performance Optimization

### First Run
- **Backend**: ~30-60 seconds (npm install)
- **Frontend**: ~1-2 minutes (React build + npm install)
- **Total**: ~2-4 minutes

### Subsequent Runs
- **Backend**: 10-15 seconds
- **Frontend**: 30-60 seconds
- **Total**: ~1-2 minutes

### Logs
All startup logs are saved to:
```
cyber_escape_room.log
```

View them with:
```bash
tail -f cyber_escape_room.log
```

## Stopping the Application

### Graceful Shutdown
Press `Ctrl+C` in the terminal running `node main.js`

The application will:
- Close all connections
- Clean up sessions
- Close both servers
- Exit cleanly

### Force Stop (if needed)
```bash
pkill -f "node main.js"
# OR
pkill -f "npm start"
```

## Architecture Overview

```
offensive_sec_quiz_2/
├── main.js                 # Main launcher (start here!)
├── backend/
│   ├── src/
│   │   ├── server.js      # Express API
│   │   ├── routes/quiz.js # Game endpoints
│   │   ├── models/        # Data models
│   │   ├── data/          # Questions database
│   │   └── middleware/    # Error handling
│   └── package.json
├── frontend/
│   ├── src/
│   │   ├── App.js         # Main React app
│   │   ├── components/    # Game screens
│   │   └── utils/         # API client, audio
│   └── package.json
└── package.json           # Root dependencies
```

## API Endpoints

The backend provides these endpoints:

```
POST   /api/quiz/start     → Start a new game session
GET    /api/quiz/question  → Get current question
POST   /api/quiz/answer    → Submit answer (level progression)
GET    /api/quiz/stats     → Get session statistics
POST   /api/quiz/reset     → Reset/restart game
GET    /api/health         → Health check endpoint
```

## Environment Variables

Automatically configured by `main.js`, but if you need to customize:

**Backend (.env)**
```
NODE_ENV=development
PORT=5000
FRONTEND_URL=http://localhost:3000
CORS_ORIGIN=http://localhost:3000
SESSION_SECRET=<auto-generated>
LOG_LEVEL=info
```

**Frontend (.env)**
```
REACT_APP_API_URL=http://localhost:5000/api
REACT_APP_API_BASE=http://localhost:5000
BROWSER=none
```

## Advanced: Manual Startup

If you prefer to start services manually:

```bash
# Terminal 1 - Backend
cd backend
npm install
npm start

# Terminal 2 - Frontend (in different terminal)
cd frontend
npm install
npm start

# Then open: http://localhost:3000
```

## Support & Debugging

### Enable Debug Mode
```bash
NODE_ENV=development node main.js
```

### View Detailed Logs
```bash
tail -f cyber_escape_room.log
```

### Check Backend Health
```bash
curl http://localhost:5000/api/health
```

### Check Session Status
```bash
curl http://localhost:5000/api/quiz/stats -b "your-session-cookie"
```

## Notes

- **Single Playthrough**: Each session is one-time only. No resets allowed.
- **Session Persistence**: Sessions are tracked server-side with unique IDs
- **Score Safety**: Score and progress are secure from manipulation
- **Leaderboard Ready**: Infrastructure supports secure leaderboard integration
- **Browser Compatibility**: Works with modern browsers (Chrome, Firefox, Safari, Edge)
- **Offline Mode**: Requires internet connection for initial setup, runs locally after

---

**Version**: 3.0.0  
**Last Updated**: 2024  
**Status**: Production Ready ✅
