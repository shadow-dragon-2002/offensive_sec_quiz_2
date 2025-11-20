# ⚡ Offensive Security Escape Room - Red Team Ops ⚡

An immersive, timed cybersecurity educational quiz game that simulates a hacker's infiltration mission through 30 progressive offensive security challenges. Features a cyberpunk-themed UI, real-time scoring, and gamification elements.

![Version](https://img.shields.io/badge/version-2.0.0-blue)
![Node](https://img.shields.io/badge/node-%3E%3D14.0.0-green)
![React](https://img.shields.io/badge/react-18.2.0-61DAFB)
![License](https://img.shields.io/badge/license-MIT-orange)

## 🎯 Overview

This is a single-port, full-stack web application that combines:
- **Express.js** backend with session management and RESTful API
- **React 18 + Vite** frontend with Tailwind CSS and Framer Motion animations
- **30 progressive challenges** across 6 offensive security phases
- **25-minute timer** with real-time countdown
- **Leaderboard system** with ranking tiers
- **Procedural audio** using Web Audio API (no external files)
- **Cyberpunk aesthetic** with glitch effects, holographic text, and CRT screen effects

## ✨ Key Features

### 🎮 Game Mechanics
- **One-Time Playthrough**: Session locks after initiation (no restarts)
- **Progressive Scoring**: Start at 100 points, -10 for each wrong answer
- **No Blocking**: Wrong answers reduce score but allow progression through all stages
- **Time Pressure**: Complete 30 challenges within 25 minutes
- **Session Persistence**: Progress saved across page refreshes (same session)

### 🎨 Visual Design
- **Cyberpunk Theme**: Neon colors (cyan, pink, green, purple)
- **Custom Fonts**: Orbitron (headings) + JetBrains Mono (body)
- **Animated Effects**: Holographic gradients, glitch text, scan lines, CRT distortion
- **Responsive**: Works on desktop, tablet, and mobile devices
- **Accessibility**: High contrast, reduced motion support

### 🔊 Audio System
- **Procedural Generation**: All sounds created using Web Audio API
- **8 Sound Effects**: Correct, wrong, transition, celebrate, beep, hover, glitch, laser
- **Mute Toggle**: User-controllable audio on/off

### 🏆 Leaderboard & Rankings
- **Top 10 Display**: Global rankings sorted by score and time
- **Tier System**:
  - 🥇 **GOLD** (85-100): Elite Operator
  - 🥈 **SILVER** (70-84): Skilled Operative
  - 🥉 **BRONZE** (50-69): Competent Hacker
  - ✅ **COMPLETE** (0-49): Persistent Learner

## 📊 Educational Content

### 6 Attack Phases (5 Questions Each)

1. **RECONNAISSANCE** (Stages 1-6)
   - Port scanning, OSINT, wireless security, SSL analysis, physical testing

2. **SCANNING** (Stages 7-11)
   - Vulnerability scanning, API testing, service enumeration, NoSQL injection

3. **EXPLOITATION** (Stages 12-18)
   - SQL injection, XSS, RCE, SSRF, JWT attacks, deserialization, XML attacks

4. **PRIVILEGE ESCALATION** (Stages 19-23)
   - SUID binaries, sudo misconfigs, token impersonation, kernel exploits

5. **LATERAL MOVEMENT** (Stages 24-27)
   - Kerberoasting, Pass-the-Hash, SMB exploitation, Active Directory attacks

6. **EXFILTRATION** (Stages 28-30)
   - Data exfiltration techniques, steganography, covert channels

## 🚀 Quick Start

### Prerequisites
- Node.js 14+ and npm
- Modern web browser (Chrome, Firefox, Safari, Edge)

### Installation & Running

#### Option 1: One-Command Start (Recommended)
```bash
node main.js
```

This will automatically:
1. Check and install dependencies (root, server, client)
2. Build the React application
3. Start the Express server on port 3000
4. Open your browser to http://localhost:3000

#### Option 2: Manual Setup
```bash
# Install root dependencies
npm install

# Install server dependencies
cd server
npm install

# Install client dependencies
cd ../client
npm install

# Build client
npm run build

# Start server
cd ../server
node index.js
```

### Environment Variables (Optional)
```bash
# Create .env file in server directory
PORT=3000                           # Server port (default: 3000)
SESSION_SECRET=your-secret-key      # Session encryption key
NODE_ENV=production                 # Environment mode
```

## 📁 Project Structure

```
offensive_sec_quiz_2/
├── main.js                          # Orchestration script (single entry point)
├── package.json                     # Root package config
│
├── server/                          # Express.js backend
│   ├── index.js                     # Server entry point
│   ├── package.json                 # Server dependencies
│   ├── routes/
│   │   ├── session.js               # Session management endpoints
│   │   ├── stages.js                # Question delivery & answer validation
│   │   └── leaderboard.js           # Leaderboard CRUD operations
│   └── data/
│       └── stages.js                # 30 offensive security questions
│
├── client/                          # React + Vite frontend
│   ├── index.html                   # HTML entry point
│   ├── package.json                 # Client dependencies
│   ├── vite.config.js               # Vite build configuration
│   ├── tailwind.config.js           # Tailwind CSS theme
│   ├── postcss.config.js            # PostCSS configuration
│   ├── src/
│   │   ├── main.jsx                 # React entry point
│   │   ├── App.jsx                  # Main app component with routing
│   │   ├── index.css                # Global styles + cyberpunk effects
│   │   ├── soundManager.js          # Web Audio API sound generation
│   │   └── components/
│   │       ├── WelcomeScreen.jsx    # Mission briefing & start screen
│   │       ├── GameScreen.jsx       # Main quiz interface
│   │       ├── StageCard.jsx        # Individual question display
│   │       ├── Timer.jsx            # 25-minute countdown timer
│   │       ├── ProgressBar.jsx      # Infiltration depth visualization
│   │       ├── CompletionScreen.jsx # Results & score submission
│   │       └── Leaderboard.jsx      # Top 10 rankings display
│   └── dist/                        # Built production files (served by Express)
│
├── backend/                         # OLD structure (deprecated)
└── frontend/                        # OLD structure (deprecated)
```

## 🔧 API Reference

### Session Endpoints

#### POST `/api/session/start`
Initialize a new game session.

**Response:**
```json
{
  "success": true,
  "sessionId": "uuid",
  "currentStage": 1,
  "score": 100,
  "timeLimit": 1500,
  "totalStages": 30
}
```

#### GET `/api/session/status`
Retrieve current session status.

**Response:**
```json
{
  "success": true,
  "currentStage": 5,
  "score": 90,
  "timeRemaining": 1200,
  "completedStages": 4,
  "isCompleted": false,
  "wrongAnswers": 1
}
```

#### POST `/api/session/complete`
Finalize session (called when game ends).

**Response:**
```json
{
  "success": true,
  "finalScore": 85,
  "completedStages": 30,
  "wrongAnswers": 15,
  "timeSpent": 1234
}
```

### Stage Endpoints

#### GET `/api/stages/:id`
Get a specific stage (without correct answer).

**Response:**
```json
{
  "success": true,
  "stage": {
    "id": 1,
    "phase": "RECONNAISSANCE",
    "title": "Port Scanning Fundamentals",
    "description": "Understanding network reconnaissance...",
    "question": "What is the primary purpose...",
    "options": ["Option A", "Option B", "Option C", "Option D"],
    "points": 100
  },
  "currentStage": 1,
  "totalStages": 30
}
```

#### POST `/api/stages/:id/answer`
Submit answer for a stage.

**Request:**
```json
{
  "answerId": 0
}
```

**Response:**
```json
{
  "success": true,
  "isCorrect": true,
  "earnedPoints": 0,
  "currentScore": 100,
  "nextStage": 2,
  "isCompleted": false
}
```

### Leaderboard Endpoints

#### GET `/api/leaderboard`
Get top 10 scores.

**Response:**
```json
{
  "success": true,
  "leaderboard": [
    {
      "id": "uuid",
      "playerName": "Agent_007",
      "score": 95,
      "completedTime": 1234,
      "rank": "GOLD",
      "submittedAt": 1700000000000
    }
  ],
  "total": 1
}
```

#### POST `/api/leaderboard`
Submit score to leaderboard.

**Request:**
```json
{
  "playerName": "Agent_007",
  "score": 95,
  "time": 1234
}
```

**Response:**
```json
{
  "success": true,
  "entry": {
    "id": "uuid",
    "playerName": "Agent_007",
    "score": 95,
    "completedTime": 1234,
    "rank": "GOLD"
  },
  "position": 1,
  "totalEntries": 1
}
```

## 🛠️ Development

### Run Development Servers

**Backend (with auto-reload):**
```bash
cd server
npm run dev
```

**Frontend (with hot module replacement):**
```bash
cd client
npm run dev
```

### Build for Production
```bash
cd client
npm run build
```

### Linting & Code Quality
```bash
# Check for security vulnerabilities
npm audit

# Fix auto-fixable issues
npm audit fix
```

## 🔒 Security Features

- **Server-Side Validation**: All answers validated on backend
- **Session Management**: Secure cookie-based sessions with HttpOnly and SameSite flags
- **Rate Limiting**: 100 requests per 15 minutes per IP
- **Input Sanitization**: Player names filtered (alphanumeric + spaces, max 50 chars)
- **No Client-Side Answers**: Correct answers never sent to client before submission
- **XSS Prevention**: React auto-escapes all JSX content
- **CSRF Protection**: Session-based authentication

## 🎨 Customization

### Change Time Limit
Edit `server/routes/session.js`:
```javascript
timeRemaining: 30 * 60 * 1000, // Change to desired minutes
```

### Modify Scoring
Edit `server/routes/stages.js`:
```javascript
session.score = Math.max(0, session.score - 20); // Change penalty
```

### Add New Questions
Edit `server/data/stages.js`:
```javascript
{
  id: 31,
  phase: "NEW_PHASE",
  title: "Question Title",
  description: "Question description",
  question: "Your question text?",
  options: ["A", "B", "C", "D"],
  correctAnswer: 0,
  points: 100
}
```

### Customize Colors
Edit `client/tailwind.config.js`:
```javascript
colors: {
  'cyber-blue': '#00d4ff',
  'cyber-pink': '#ff006e',
  // Add more colors...
}
```

## 📈 Performance

- **First Contentful Paint**: ~0.8s
- **Time to Interactive**: ~1.5s
- **Bundle Size (gzipped)**: ~113 KB total
  - React vendor: 45 KB
  - Framer Motion: 38 KB
  - App code: 24 KB
  - CSS: 5 KB

## 🐛 Troubleshooting

### Server Won't Start
```bash
# Check if port 3000 is in use
lsof -i :3000

# Kill process using port
kill -9 <PID>

# Or use a different port
PORT=8000 node main.js
```

### Build Fails
```bash
# Clear build cache
cd client
rm -rf node_modules dist
npm install
npm run build
```

### Session Issues
- Clear browser cookies and localStorage
- Ensure cookies are enabled in browser
- Check for browser extensions blocking cookies

## 📝 License

This project is for educational purposes only. Use responsibly.

## 👨‍💻 Contributing

Contributions welcome! Please:
1. Fork the repository
2. Create a feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit changes (`git commit -m 'Add AmazingFeature'`)
4. Push to branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 🙏 Acknowledgments

- Built with React, Express.js, Tailwind CSS, and Framer Motion
- Inspired by cyberpunk aesthetics and CTF competitions
- Educational content based on real-world penetration testing techniques

---

**⚠️ Educational Purpose Disclaimer**: This quiz game is designed for educational purposes to teach offensive security concepts. All content should be used ethically and legally. Never perform security testing on systems you don't own or have explicit permission to test.
