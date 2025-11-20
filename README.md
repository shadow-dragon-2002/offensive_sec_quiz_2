# 🚀 Offensive Security Escape Room - Red Team Ops

An immersive, timed cybersecurity educational quiz game simulating a hacker's infiltration mission through 30 progressive offensive security challenges.

## ✨ Features

### 🎮 Core Gameplay
- **30 Progressive Stages**: Navigate through 6 attack phases (Reconnaissance → Exfiltration)
- **25-Minute Timer**: Race against the clock with real-time countdown
- **One-Time Playthrough**: Session-locked gameplay - no restarts or checkpoints
- **Scoring System**: Start at 100 points, -10 per wrong answer
- **Complete All Stages**: Progress regardless of score

### 🎨 Cyberpunk UI/UX
- **Holographic Animations**: Multi-color glowing text with smooth transitions
- **Neon Color Palette**: Cyan, pink, purple, and green cyberpunk theme
- **CRT Effects**: Scan lines and glitch animations for retro-futuristic feel
- **Phase-Specific Colors**: Visual indicators for 6 attack phases
- **Interactive Feedback**: 
  - Hot-pink selection highlighting with glow effects
  - Green gradient for correct answers with checkmark
  - Red gradient for wrong answers with X icon
  - Animated progress bar with scan line effect

### 🔊 Audio System
- **Procedural Sound Generation**: Web Audio API (no external files)
- **8 Sound Effects**: correct, wrong, transition, celebrate, beep, hover, glitch, laser
- **Mute Toggle**: Control audio playback

### 📊 Leaderboard
- **Global Rankings**: Top 10 scores displayed
- **Rank Tiers**: GOLD (85+), SILVER (70-84), BRONZE (50-69), COMPLETE (0-49)
- **Session Protection**: Prevents duplicate submissions

### 🔒 Security
- **Server-Side Validation**: All answer checking done on backend
- **Session Management**: One playthrough per browser session
- **Rate Limiting**: Prevents API abuse
- **Input Sanitization**: Validates all user inputs

## 🎓 Educational Content

### 6 Attack Phases (30 Questions Total)

1. **RECONNAISSANCE** (Stages 1-6)
   - Port scanning, network enumeration, OSINT, wireless security, SSL/TLS analysis

2. **SCANNING** (Stages 7-11)
   - Vulnerability scanning, API testing, service enumeration, NoSQL injection

3. **EXPLOITATION** (Stages 12-18)
   - SQL injection, XSS, RCE, SSRF, JWT attacks, deserialization, XXE

4. **PRIVILEGE_ESCALATION** (Stages 19-23)
   - Linux/Windows privilege escalation, SUID binaries, sudo misconfigs, kernel exploits

5. **LATERAL_MOVEMENT** (Stages 24-27)
   - Kerberoasting, Pass-the-Hash, SMB relay attacks

6. **EXFILTRATION** (Stages 28-30)
   - Data exfiltration techniques, DNS tunneling, steganography

## 🚀 Quick Start

### Prerequisites
- Node.js 16+ and npm

### Installation & Running

```bash
# Clone the repository
git clone https://github.com/shadow-dragon-2002/offensive_sec_quiz_2.git
cd offensive_sec_quiz_2

# Run the application (handles all setup automatically)
npm start
```

The application will:
1. Install dependencies (root & client)
2. Build the React frontend
3. Start the Express server on port 3000
4. Open your browser automatically

Access the application at: **http://localhost:3000**

### Custom Port

```bash
PORT=8000 npm start
```

## 📁 Project Structure

```
offensive_sec_quiz_2/
├── main.js                    # Orchestration script
├── package.json              # Root dependencies
├── server/
│   ├── index.js             # Express server
│   ├── routes/
│   │   ├── session.js       # Session management API
│   │   ├── stages.js        # Question delivery & validation
│   │   └── leaderboard.js   # Score tracking
│   └── models/
│       └── stages.js        # 30 offensive security questions
└── client/
    ├── vite.config.js       # Build configuration
    ├── tailwind.config.js   # Theme & animations
    ├── src/
    │   ├── App.jsx          # Main application component
    │   ├── soundManager.js  # Procedural audio generation
    │   ├── index.css        # Cyberpunk CSS effects
    │   └── components/      # React components
    └── dist/                # Production build (generated)
```

## 🛠️ Technology Stack

### Backend
- **Node.js + Express.js**: REST API server
- **express-session**: Session management
- **express-rate-limit**: API rate limiting
- **CORS**: Cross-origin resource sharing

### Frontend
- **React 18**: Component-based UI
- **Vite 5**: Fast build tool
- **Tailwind CSS 3**: Utility-first styling
- **Framer Motion 10**: Smooth animations
- **Axios**: HTTP client

## 🎯 Gameplay Rules

1. **Start Game**: Click "INITIATE OPERATION" on welcome screen
2. **Answer Questions**: Select one of 4 options for each stage
3. **Submit Answer**: Click "INJECT PAYLOAD" to validate
4. **Progress**: Advance through all 30 stages linearly
5. **Complete**: Finish all stages or run out of time
6. **Submit Score**: Enter name to join the leaderboard

### Scoring
- Starting score: **100 points**
- Wrong answer penalty: **-10 points**
- Minimum score: **0 points**
- You can complete all stages regardless of score

### Time Limits
- Total time: **25 minutes (1500 seconds)**
- Timer states:
  - ✓ STABLE: >10 minutes remaining (cyan)
  - ⚡ WARNING: 5-10 minutes remaining (yellow)
  - ⚠ CRITICAL: <5 minutes remaining (red, pulsing)

## 📝 API Endpoints

### Session Management
- `POST /api/session/start` - Initialize new game
- `GET /api/session/status` - Get current progress
- `POST /api/session/progress` - Advance to next stage
- `POST /api/session/complete` - Finalize game

### Stages
- `GET /api/stages` - List all stages (no answers)
- `GET /api/stages/:id` - Get specific stage
- `POST /api/stages/:id/answer` - Submit answer

### Leaderboard
- `GET /api/leaderboard` - Get top 10 scores
- `POST /api/leaderboard` - Submit score
- `GET /api/leaderboard/rank/:score` - Calculate rank

## 🧪 Development

### Run in Development Mode

```bash
# Terminal 1: Start backend server
npm run dev

# Terminal 2: Start frontend dev server
cd client && npm run dev
```

Frontend will be available at `http://localhost:5173` with hot reload.

### Build for Production

```bash
# Build client
cd client && npm run build

# Start production server
cd .. && node server/index.js
```

## 🎨 Customization

### Modify Questions
Edit `server/models/stages.js` to add/modify security questions

### Change Theme
Edit `client/tailwind.config.js` for color palette and animations

### Adjust Time Limit
Modify `timeRemaining: 1500` in `server/routes/session.js`

### Update Scoring
Change penalty values in `server/routes/stages.js`

## 📄 License

MIT License - feel free to use for educational purposes

## 🤝 Contributing

Contributions welcome! Please feel free to submit a Pull Request.

## 🎓 Educational Use

This quiz is designed for:
- Cybersecurity students
- Penetration testing practitioners
- CTF competitors
- Security professionals
- Anyone learning offensive security concepts

**Note**: All content is for educational purposes only. Use knowledge responsibly and ethically.

---

**Made with ⚡ by the cybersecurity community**