# Quick Start Guide - Offensive Security Quiz

## ⚡ 5-Minute Setup

### Step 1: Prerequisites Check
Ensure you have:
- Node.js 14 or higher: `node --version`
- npm 6 or higher: `npm --version`

### Step 2: Install Dependencies

**Backend:**
```bash
cd backend
npm install
```

**Frontend:**
```bash
cd frontend
npm install
```

### Step 3: Setup Environment

```bash
cd backend
cp .env.example .env
```

The `.env` file is already configured with default values. For production, update the `SESSION_SECRET`.

### Step 4: Start the Application

**Terminal 1 - Backend Server:**
```bash
cd backend
npm start
```
Wait for: `✓ Offensive Security Quiz API Server is running`

**Terminal 2 - Frontend Application:**
```bash
cd frontend
npm start
```
Wait for: Browser opens automatically at `http://localhost:3000`

### Step 5: Play the Quiz!
- Click "INITIATE CHALLENGE"
- Answer the 30 progressive security questions
- Complete all questions within 30 minutes
- One wrong answer locks your session permanently!

---

## 🚀 Automated Setup (Optional)

### Using Setup Script
```bash
chmod +x setup.sh
./setup.sh
```

### Using Start Script
```bash
chmod +x start.sh
./start.sh
```

### Using Validation Script
```bash
chmod +x validate.sh
./validate.sh
```

---

## 🐳 Docker Quick Start

### Prerequisites
- Docker and Docker Compose installed

### One Command Startup
```bash
docker-compose up --build
```

Then open `http://localhost:3000` in your browser.

### Stop Services
```bash
docker-compose down
```

---

## 🔧 Troubleshooting Quick Fixes

| Issue | Fix |
|-------|-----|
| "Port 5000 already in use" | `lsof -i :5000` then `kill -9 <PID>` OR change PORT in `.env` |
| "Cannot connect to backend" | Ensure backend is running: `curl http://localhost:5000/api/health` |
| "Dependencies not found" | Run `npm install` in both backend and frontend directories |
| "React app won't start" | Clear cache: `rm -rf frontend/node_modules && npm install` |
| "Quiz doesn't load" | Check browser console (F12) for errors |

---

## 📋 Project Structure

```
offensive_sec_quiz_2/
├── backend/
│   ├── src/
│   │   ├── server.js          # Express server
│   │   ├── routes/quiz.js     # API routes
│   │   ├── models/Session.js  # Session management
│   │   └── data/questions.js  # 30 quiz questions
│   ├── .env                   # Environment config
│   └── package.json
├── frontend/
│   ├── src/
│   │   ├── App.js             # Main component
│   │   ├── components/        # React components
│   │   └── utils/api.js       # API client
│   ├── public/index.html      # HTML template
│   └── package.json
├── setup.sh                   # Automated setup
├── start.sh                   # Start both servers
└── validate.sh                # Verify setup
```

---

## 🎯 API Endpoints

| Method | URL | Purpose |
|--------|-----|---------|
| POST | `/api/quiz/start` | Start new quiz session |
| GET | `/api/quiz/question` | Get current question |
| POST | `/api/quiz/answer` | Submit answer |
| GET | `/api/quiz/stats` | Get statistics |
| POST | `/api/quiz/reset` | Reset quiz |
| GET | `/api/health` | Health check |

### Example API Call
```bash
# Start quiz
curl -X POST http://localhost:5000/api/quiz/start \
  -H "Content-Type: application/json" \
  --cookie-jar cookies.txt

# Get question
curl http://localhost:5000/api/quiz/question \
  -b cookies.txt

# Submit answer
curl -X POST http://localhost:5000/api/quiz/answer \
  -H "Content-Type: application/json" \
  -b cookies.txt \
  -d '{"questionId": 1, "selectedAnswer": 0}'
```

---

## 📊 Quiz Details

- **Total Questions**: 30 progressive security challenges
- **Categories**: Reconnaissance, Web Exploitation, Exploitation, Post-Exploitation, Privilege Escalation, Advanced
- **Time Limit**: 30 minutes
- **Difficulty**: Easy to Expert
- **Points**: 10-30 per question
- **Progression**: One wrong answer locks your session permanently
- **Scoring**: Server-side validation and scoring

---

## 🎨 Theme & Interface

- **Color Scheme**: Cyberpunk (neon green, cyan)
- **Design**: Terminal-style interface
- **Responsive**: Works on desktop, tablet, mobile
- **Animations**: Smooth transitions and glitch effects

---

## 💡 Features

✅ Session-locked gameplay (one strike and you're out)
✅ Real-time server-side scoring
✅ 30-minute countdown timer
✅ Secure session management
✅ Progressive difficulty levels
✅ Terminal-style cyberpunk UI
✅ Achievement ranks (Beginner to Elite Hacker)
✅ Responsive design

---

## 📚 Documentation

- **README.md**: Full project overview
- **ARCHITECTURE.md**: Technical architecture details
- **DEPLOYMENT.md**: Production deployment guide
- **TROUBLESHOOTING.md**: Common issues and solutions
- **TESTING.md**: Testing and debugging guide
- **CONTRIBUTING.md**: Contribution guidelines

---

## 🔒 Security Features

- Server-side answer validation
- Secure cookie-based sessions
- CORS protection
- No client-side answer exposure
- HTTP-only cookies
- Session expiration
- SQL injection prevention (backend ready)

---

## 🆘 Need Help?

1. **Check logs**: Look at terminal output for error messages
2. **Verify ports**: Ensure 5000 and 3000 are available
3. **Test API**: `curl http://localhost:5000/api/health`
4. **Browser DevTools**: Press F12 and check Console tab
5. **Read documentation**: Check TROUBLESHOOTING.md for detailed solutions

---

## 🎓 Educational Purpose

This quiz game is designed for educational purposes to teach offensive security concepts. All content should be used ethically and legally. Perfect for:
- Cybersecurity training
- Penetration testing preparation
- Security awareness
- CTF (Capture The Flag) practice
- Team competitions

---

## 📝 Version Info

- Node.js: 14+ (tested on 18)
- React: 18.2.0
- Express: 4.18.2
- npm: 6+

---

## 🎉 Ready to Start?

```bash
# Quick setup in 3 commands:
cd backend && npm install
cd ../frontend && npm install
cd ..

# Then in Terminal 1:
cd backend && npm start

# And Terminal 2:
cd frontend && npm start

# Open browser to: http://localhost:3000
```

Good luck! 🎮🔐

---

**Last Updated**: November 2024
**Maintainer**: Security Team
**License**: Educational Use Only
