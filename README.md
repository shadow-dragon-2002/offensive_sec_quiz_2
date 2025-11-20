# Offensive Security Quiz Game 🎯

A full-stack React and Express.js quiz game focused on offensive security with 30 session-locked, progressive challenges. Features a cyberpunk-themed UI, real-time server-side scoring, timed playthrough, and secure session management.

![Cybersecurity Challenge Arena](https://img.shields.io/badge/Cybersecurity-Challenge-00ff41?style=for-the-badge)
![React](https://img.shields.io/badge/React-18.2.0-61DAFB?style=for-the-badge&logo=react)
![Express.js](https://img.shields.io/badge/Express.js-4.18.2-000000?style=for-the-badge&logo=express)

## 🎮 Features

### Core Functionality
- **30 Progressive Challenges**: Questions covering Reconnaissance, Web Exploitation, Exploitation Techniques, Post-Exploitation, Privilege Escalation, and Advanced Persistent Threats
- **Session-Locked Gameplay**: One wrong answer locks your session permanently - no retries!
- **Real-Time Scoring**: Server-side score calculation with immediate feedback
- **Timed Playthrough**: 30-minute countdown timer with visual alerts
- **Secure Session Management**: Express-session with secure cookie handling
- **Progressive Difficulty**: Questions range from easy (10 pts) to expert (30 pts)

### UI/UX Features
- **Cyberpunk Theme**: Neon-green aesthetics with glitch effects
- **Terminal-Style Interface**: Authentic hacker experience
- **Animated Feedback**: Visual and textual feedback for correct/incorrect answers
- **Responsive Design**: Works on desktop, tablet, and mobile devices
- **Achievement System**: Rank-based results (Beginner to Elite Hacker)
- **Progress Tracking**: Real-time level and score display

## 🏗️ Architecture

### Frontend (React)
```
frontend/
├── src/
│   ├── components/
│   │   ├── StartScreen.js      # Welcome and briefing screen
│   │   ├── QuizScreen.js       # Main quiz interface
│   │   ├── ResultScreen.js     # Results and statistics
│   │   └── Timer.js            # Countdown timer component
│   ├── utils/
│   │   └── api.js              # Axios API client
│   ├── styles/                 # Component CSS files
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
│   │   └── Session.js          # Session management logic
│   ├── routes/
│   │   └── quiz.js             # Quiz API endpoints
│   ├── data/
│   │   └── questions.js        # Question bank (30 questions)
│   └── server.js               # Express server setup
└── package.json
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
  id: number,                    // Unique question ID
  level: number,                 // Question level (1-30)
  category: string,              // Question category
  question: string,              // Question text
  options: Array<string>,        // Answer options (4 choices)
  correctAnswer: number,         // Index of correct answer
  difficulty: string,            // easy, medium, hard
  points: number                 // Points awarded (10-30)
}
```

## 🚀 Quick Start (5 Minutes)

### Prerequisites
- Node.js 14+ and npm (or Docker)
- Ports 5000 and 3000 available
- Modern web browser

### Option 1: Fastest Setup 🚀
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