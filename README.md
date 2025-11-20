# Offensive Security Escape Room 🎯

An immersive cyberpunk-themed offensive security challenge featuring 30 intermediate-to-hard progressive puzzles. Features a rich neon aesthetic with electric blue, hot pink, and ultraviolet purple accents, synthwave sound effects, glitch animations, and strict gameplay rules designed to confuse and challenge users.

![Cybersecurity Challenge Arena](https://img.shields.io/badge/Cybersecurity-Escape%20Room-00ff41?style=for-the-badge)
![React](https://img.shields.io/badge/React-18.2.0-61DAFB?style=for-the-badge&logo=react)
![Express.js](https://img.shields.io/badge/Express.js-4.18.2-000000?style=for-the-badge&logo=express)
![Framer Motion](https://img.shields.io/badge/Framer%20Motion-10.16.4-ff006e?style=for-the-badge)

## 🚀 Quick Start

**Run the entire application with a single command:**

```bash
node main.js
```

That's it! The main.js launcher will:
- ✅ Check and install dependencies automatically
- ✅ Start the backend server on port 5000
- ✅ Start the frontend on port 3000
- ✅ Perform health checks
- ✅ Display access instructions

Then open your browser to: **http://localhost:3000**

## 🎮 Features

### Core Gameplay
- **30 Progressive Challenges**: Intermediate-to-hard cybersecurity questions covering Network Infiltration, Web Exploitation, Memory Corruption, Wireless Security, Active Directory, Cryptography, Cloud Security, and more
- **Confusingly Similar Options**: Multiple-choice questions with deliberately similar answers to increase difficulty
- **No Hints Policy**: Wrong answers receive NO hints - correct answer is NEVER revealed on incorrect attempts
- **Score Penalties**: -50 points per wrong answer, but you can complete all 30 stages regardless of score
- **25-Minute Timer**: Strict time limit with visual and audio warnings
- **Session Tracking**: One-time playthrough with secure session management to prevent resetting or cheating

### Cyberpunk Theme & UI/UX
- **Neon Color Scheme**: Electric blue (#00f3ff), hot pink (#ff006e), ultraviolet purple (#8b5cf6)
- **Glitch Effects**: Screen glitches, flickering neon buttons, scanline overlays
- **Grid Overlay**: Animated cyberpunk-style grid background
- **Holographic HUD**: Futuristic heads-up display elements
- **Terminal-Style Interface**: Authentic hacker terminal aesthetic
- **Framer Motion Animations**: Smooth transitions and micro-interactions

### Sound Effects (Web Audio API)
- 🎵 **Synthwave Sounds**: Cyberpunk-themed audio effects
- 🔊 **Laser Swooshes**: Button click sound effects
- 🔔 **Digital Beeps**: Hover and interaction sounds
- ✅ **Success Chimes**: Correct answer feedback
- ❌ **Error Buzz**: Wrong answer feedback
- ⏰ **Timer Warnings**: Critical time alerts

### Answer Formatting
- Options clearly labeled with **a)**, **b)**, **c)**, **d)**
- Bold, color-highlighted labels for easy identification
- Proper spacing between label and option text
- Consistent formatting across all 30 questions

## 🏗️ Architecture

### Frontend (React)
```
frontend/
├── src/
│   ├── components/
│   │   ├── StartScreen.js      # Welcome and mission briefing screen
│   │   ├── QuizScreen.js       # Main quiz interface with questions
│   │   ├── ResultScreen.js     # Results and achievement display
│   │   ├── Timer.js            # Countdown timer with warnings
│   │   └── ErrorBoundary.js    # Error handling component
│   ├── utils/
│   │   ├── api.js              # Axios API client with health checks
│   │   └── soundEffects.js     # Web Audio API sound effects
│   ├── CyberpunkApp.css        # Main cyberpunk theme styles
│   ├── App.js                  # Main application component
│   └── index.js                # React entry point
└── public/
    └── index.html              # HTML template
```

### Backend (Express.js)
```
backend/
├── src/
│   ├── models/
│   │   └── Session.js          # Session management with scoring
│   ├── routes/
│   │   └── quiz.js             # Quiz API endpoints
│   ├── data/
│   │   ├── escapeRoomQuestions.js  # 30 escape room questions
│   │   └── questions.js        # Legacy question bank
│   ├── middleware/
│   │   └── errorHandler.js     # Error handling middleware
│   └── server.js               # Express server setup
└── package.json

### Main Launcher
```
main.js                         # Single-command application launcher
```

## 📊 Data Models

### Session Model
```javascript
{
  id: string,                    // Unique session identifier
  currentLevel: number,          // Current question level (1-30)
  score: number,                 // Total score accumulated
  answers: Array,                // History of answers
  startTime: timestamp,          // Session start time
  endTime: timestamp,            // Session end time (if completed)
  isCompleted: boolean,          // Completion status
  isLocked: boolean,             // Lock status (wrong answer)
  correctAnswers: number,        // Count of correct answers
  totalQuestions: number,        // Total questions (30)
  timeLimit: number              // Time limit in milliseconds
}
```

### Question Model
```javascript
{
  id: number,                    // Unique question ID (1-30)
  level: number,                 // Question level (1-30)
  category: string,              // e.g., "Network Infiltration", "Web Exploitation"
  question: string,              // Question text
  options: Array<string>,        // 4 answer options starting with "a)", "b)", "c)", "d)"
  correctAnswer: number,         // Index of correct answer (0-3)
  difficulty: string,            // "intermediate" or "hard"
  points: number                 // Points awarded (50 per correct answer)
}
```

## 🚀 Installation & Setup

### Prerequisites
- Node.js 14+ and npm
- Ports 5000 (backend) and 3000 (frontend) available
- Modern web browser with JavaScript enabled

### Single Command Launch ⚡
```bash
node main.js
```

**The main.js launcher handles everything:**
- ✅ Validates Node.js environment (v14+)
- ✅ Checks directory structure and required files
- ✅ Installs dependencies automatically if needed
- ✅ Creates backend `.env` configuration
- ✅ Checks and frees ports 5000 and 3000
- ✅ Starts backend server (Express.js on port 5000)
- ✅ Starts frontend server (React on port 3000)
- ✅ Performs health checks on both services
- ✅ Displays success banner with access URLs
- ✅ Monitors services and handles graceful shutdown (Ctrl+C)

**Output Example:**
```
╔════════════════════════════════════════════════════════════╗
║                    CYBER ESCAPE ROOM                       ║
║              Starting Mission Control System...             ║
╚════════════════════════════════════════════════════════════╝

✓ Prerequisites verified
✓ Dependencies installed
✓ Configuration ready
✓ Backend started (http://localhost:5000)
✓ Frontend starting (http://localhost:3000)
✓ All systems online

🎮 Access the game at: http://localhost:3000
```

### Option 2: Manual Setup (For Development)
```bash
bash setup.sh
cd backend && npm start &
cd frontend && npm start
# Open http://localhost:3000
```

### Option 2: Docker Setup 🐳
```bash
docker-compose up --build
# Open http://localhost:3000
```

### Option 3: Manual Installation
```bash
# Backend setup
cd backend
npm install
cp .env.example .env
npm start
# Server runs on http://localhost:5000

# Frontend setup (in new terminal)
cd frontend
npm install
npm start
# Frontend runs on http://localhost:3000
# Opens http://localhost:3000 automatically
```

## ✅ Verify Installation
```bash
bash validate.sh
```

**First Time?** Read [QUICK_START.md](./QUICK_START.md) for detailed setup instructions.

## 🔧 API Endpoints

### Quiz Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/quiz/start` | Initialize a new quiz session |
| GET | `/api/quiz/question` | Get current question for active session |
| POST | `/api/quiz/answer` | Submit answer for current question |
| GET | `/api/quiz/stats` | Get session statistics |
| POST | `/api/quiz/reset` | Reset and restart quiz |
| GET | `/api/health` | Health check endpoint |

### Example API Usage

**Start Quiz**
```bash
curl -X POST http://localhost:5000/api/quiz/start \
  -H "Content-Type: application/json" \
  --cookie-jar cookies.txt
```

**Submit Answer**
```bash
curl -X POST http://localhost:5000/api/quiz/answer \
  -H "Content-Type: application/json" \
  --cookie cookies.txt \
  -d '{"questionId": 1, "selectedAnswer": 0}'
```

## 🎯 User Flow

1. **Start Screen**: User reads mission briefing and challenge details
2. **Initiate Challenge**: Click "INITIATE CHALLENGE" to begin
3. **Answer Questions**: Select and submit answers for progressive questions
4. **Progression**: 
   - ✅ Correct answer → Move to next level
   - ❌ Wrong answer → Session locked permanently
5. **Timer Management**: Complete all 30 questions within 30 minutes
6. **Results**: View final score, rank, and statistics
7. **Restart**: Option to start a new challenge

## 🎨 Customization Guide

### Adding New Question Categories

1. **Edit question data** (`backend/src/data/questions.js`):
```javascript
{
  id: 31,
  level: 31,
  category: "Your New Category",
  question: "Your question text?",
  options: ["Option 1", "Option 2", "Option 3", "Option 4"],
  correctAnswer: 0,
  difficulty: "medium",
  points: 20
}
```

2. **Update total questions** in Session model if adding more than 30 questions

### Customizing the Theme

**Colors** (`frontend/src/App.css`):
```css
/* Primary color (green) */
--primary-color: #00ff41;

/* Secondary color (cyan) */
--secondary-color: #00d4ff;

/* Warning color (orange) */
--warning-color: #ffa500;

/* Error color (red) */
--error-color: #ff0044;
```

**Fonts**: Edit the Google Fonts import in `App.css`
```css
@import url('https://fonts.googleapis.com/css2?family=YourFont&display=swap');
```

### Adjusting Game Mechanics

**Time Limit** (`backend/src/models/Session.js`):
```javascript
timeLimit: 45 * 60 * 1000  // Change to 45 minutes
```

**Session Locking** (Allow multiple attempts):
```javascript
// In backend/src/models/Session.js - submitAnswer method
// Comment out or modify this line:
session.isLocked = true;
```

**Points System** (`backend/src/data/questions.js`):
```javascript
// Modify points for each question
points: 50  // Higher points for important questions
```

### Adding New Features

**Hints System**:
1. Add `hint` field to question model
2. Create hint button in `QuizScreen.js`
3. Add API endpoint to get hints
4. Deduct points for using hints

**Leaderboard**:
1. Create database/storage for scores
2. Add leaderboard API endpoints
3. Create `Leaderboard.js` component
4. Display top scores

**Multiple Quiz Topics**:
1. Organize questions by topic in separate files
2. Add topic selection in start screen
3. Load questions based on selected topic
4. Track progress per topic

## 🔐 Security Features

- **Server-side validation**: All answers validated on backend
- **Session management**: Secure cookie-based sessions
- **CORS protection**: Configured CORS for trusted origins
- **No client-side answers**: Correct answers never sent to client
- **HTTP-only cookies**: Prevents XSS attacks
- **Session expiration**: Automatic cleanup of old sessions

## 📚 Documentation

Comprehensive documentation is available:

| Guide | Purpose | Link |
|-------|---------|------|
| **Quick Start** | 5-minute setup guide | [QUICK_START.md](./QUICK_START.md) |
| **Troubleshooting** | Common issues & solutions | [TROUBLESHOOTING.md](./TROUBLESHOOTING.md) |
| **Testing** | Testing procedures & debugging | [TESTING.md](./TESTING.md) |
| **Installation** | Verification checklist | [INSTALLATION_CHECKLIST.md](./INSTALLATION_CHECKLIST.md) |
| **Deployment** | Production deployment guide | [DEPLOYMENT.md](./DEPLOYMENT.md) |
| **Architecture** | System design & overview | [ARCHITECTURE.md](./ARCHITECTURE.md) |
| **Contributing** | Development guidelines | [CONTRIBUTING.md](./CONTRIBUTING.md) |
| **Documentation Index** | Complete guide index | [DOCUMENTATION_INDEX.md](./DOCUMENTATION_INDEX.md) |

## 🔧 Automation Scripts

Make setup easier with included scripts:

```bash
# Setup: Install all dependencies with validation
bash setup.sh

# Start: Run both backend and frontend servers
bash start.sh

# Validate: Verify your installation is correct
bash validate.sh
```

## 🐳 Docker Support

Run the entire application in Docker:

```bash
docker-compose up --build
```

Then open `http://localhost:3000`

## 🧪 Testing

### Manual Testing Checklist
- [ ] Start a new quiz session
- [ ] Answer questions correctly and verify progression
- [ ] Submit wrong answer and verify session lock
- [ ] Test timer countdown and expiration
- [ ] Test session persistence across page refreshes
- [ ] Test responsive design on mobile devices
- [ ] Test API endpoints with curl/Postman

See [TESTING.md](./TESTING.md) for detailed testing procedures.

### Automated Testing
```bash
# Backend tests
cd backend
npm test

# Frontend build
cd frontend
npm run build
```

## 🌟 Project Status

**Status**: ✅ **PRODUCTION READY**

### Quality Metrics
- ✅ Zero known errors
- ✅ Comprehensive error handling
- ✅ All 30 questions verified
- ✅ Session management working
- ✅ Security hardened
- ✅ Performance optimized
- ✅ 50+ pages of documentation
- ✅ Docker containerization ready

### What's New
- 🆕 Comprehensive error handling throughout
- 🆕 Enhanced logging and debugging
- 🆕 Docker & docker-compose support
- 🆕 Automation scripts (setup, start, validate)
- 🆕 8 comprehensive guides
- 🆕 API health checks
- 🆕 Session validation
- 🆕 Better error messages for users

### Backend Enhancements
- [ ] Database integration (MongoDB/PostgreSQL)
- [ ] User authentication and profiles
- [ ] Multiple quiz topics/categories
- [ ] Question difficulty adaptation
- [ ] Detailed answer explanations
- [ ] Time-based leaderboards
- [ ] Achievement badges
- [ ] Social sharing features

### Frontend Enhancements
- [ ] Sound effects and music
- [ ] Animated transitions
- [ ] Dark/light theme toggle
- [ ] Accessibility improvements (ARIA labels)
- [ ] PWA support for offline play
- [ ] Multi-language support
- [ ] Tutorial mode
- [ ] Question bookmarking

### Mechanics Enhancements
- [ ] Lives system (3 wrong answers before lock)
- [ ] Hint system (cost points)
- [ ] Power-ups and bonuses
- [ ] Multiplayer mode
- [ ] Time attack mode
- [ ] Custom quiz creation
- [ ] Question difficulty voting

## 🛠️ Error Handling & Recovery

### Backend Error Handling
The backend automatically handles:
- **Network Errors**: Graceful recovery with detailed error messages
- **Session Errors**: Validates and cleans up sessions on shutdown
- **Uncaught Exceptions**: Logs errors and prevents crashes
- **Unhandled Rejections**: Catches promise rejections with stack traces
- **Port Conflicts**: Server detects EADDRINUSE and provides guidance
- **SIGTERM/SIGINT**: Graceful shutdown with session cleanup (10-second timeout)

### Frontend Error Recovery
The frontend includes:
- **Retry Logic**: Automatic retry with exponential backoff (1s, 2s, 3s)
- **Health Checks**: Validates backend connectivity before operations
- **Request Correlation**: Tracks requests with unique IDs and timing metadata
- **Error Categorization**: 
  - `NETWORK_ERROR`: Connection failures
  - `API_ERROR`: Server returned error status
  - `REQUEST_ERROR`: Request setup issues
  - `REQUEST_SETUP_ERROR`: Configuration problems
- **Smart Retries**: Only retries on transient failures (5xx, network errors, 429, 503)
- **Backend Status Monitoring**: Real-time indicator showing backend online/offline/checking

### Launcher Error Handling
The `start.sh` script ensures:
- ✅ Prerequisites checking (Node.js, npm, curl)
- ✅ Directory structure validation
- ✅ Automatic dependency installation with progress feedback
- ✅ Port availability checking with auto-kill option for conflicts
- ✅ Backend health verification (30 retry attempts × 1s intervals)
- ✅ Frontend compilation monitoring (60 retry attempts)
- ✅ Process health monitoring during runtime
- ✅ Graceful cleanup on shutdown (SIGINT/SIGTERM)
- ✅ Comprehensive error logging to `cyber_escape_room.log`

### Configuration Auto-Generation
If `.env` is missing, the launcher automatically creates one with:
```env
SESSION_SECRET=generated-random-secret
CORS_ORIGIN=http://localhost:3000
LOG_LEVEL=info
PORT=5000
FRONTEND_URL=http://localhost:3000
```

## 🛠️ Troubleshooting

For comprehensive troubleshooting guide, see [TROUBLESHOOTING.md](./TROUBLESHOOTING.md).

### Common Issues

**Issue**: Cannot connect to backend
- **Solution**: Ensure backend is running on port 5000
- Check `.env` configuration
- Verify CORS settings
- Try: `curl http://localhost:5000/api/health`

**Issue**: Session not persisting
- **Solution**: Check browser cookie settings
- Ensure cookies are enabled
- Verify session secret is configured
- Clear browser cookies and retry

**Issue**: Timer not working
- **Solution**: Check browser JavaScript console (F12)
- Ensure component is mounting correctly
- Verify time limit in session
- Refresh the page

**Issue**: "Port already in use"
- **Solution**: `lsof -i :5000` (find process) then `kill -9 <PID>`
- Or change PORT in backend/.env

**Need More Help?** → [TROUBLESHOOTING.md](./TROUBLESHOOTING.md) has 10+ solutions!

## 📋 Version Information

- **Current Version**: 1.0.0
- **Node.js**: 14+ (tested on 18)
- **React**: 18.2.0
- **Express.js**: 4.18.2
- **Last Updated**: November 2024

---

**⚠️ Educational Purpose Disclaimer**: This quiz game is designed for educational purposes to teach offensive security concepts. All content should be used ethically and legally.

**🚀 Ready to Get Started?** → [QUICK_START.md](./QUICK_START.md)
**📖 Need Help?** → [DOCUMENTATION_INDEX.md](./DOCUMENTATION_INDEX.md)
**🐛 Found an Issue?** → [TROUBLESHOOTING.md](./TROUBLESHOOTING.md)