# 🎮 CYBER ESCAPE ROOM - Offensive Security Escape Room

> **An immersive cyberpunk-themed offensive security quiz with 30 challenging puzzles, session-based security, and an unforgiving one-strike-and-you're-out gameplay mechanic.**

## 🚀 Quick Start (Recommended)

```bash
# One command to start everything!
node main.js
```

That's it! The application will automatically:
- ✅ Install dependencies
- ✅ Configure environment
- ✅ Start backend API (port 5000)
- ✅ Start frontend app (port 3000)
- ✅ Run health checks
- ✅ Display access instructions

**Total time**: 2-4 minutes first run, 1-2 minutes thereafter

Then open your browser to: **http://localhost:3000**

---

## 📚 Documentation

| Guide | Purpose |
|-------|---------|
| **[LAUNCH_INSTRUCTIONS.md](LAUNCH_INSTRUCTIONS.md)** | Quick reference for common commands |
| **[STARTUP_GUIDE.md](STARTUP_GUIDE.md)** | Detailed startup process and troubleshooting |
| **[COMPREHENSIVE_SETUP.md](COMPREHENSIVE_SETUP.md)** | Complete setup, architecture, and configuration guide |

---

## 🎯 Game Features

### Core Experience
- **30 Intermediate-to-Hard Puzzles**: Offensive security themed questions
- **25-Minute Timer**: Countdown clock for the entire challenge
- **Confusing Answer Options**: Similar answers designed to trap players
- **No Hints or Reveals**: Wrong answers give no feedback
- **Score System**: Start with 1000 points, -50 penalty per wrong answer
- **Full Progression**: Continue through all 30 levels even at 0 points

### Cyberpunk Atmosphere
- **Dark Backgrounds**: Deep blacks and dark grays
- **Neon Colors**: Electric blue, hot pink, ultraviolet purple
- **Glitch Effects**: Animated text glitches and flickers
- **Terminal UI**: Authentic hacker interface
- **Audio Effects**: Synth soundscapes and digital effects

### Security Features
- **Session Tracking**: One-time playthrough per session
- **Server-Side Validation**: Answers verified on backend
- **Score Protection**: Cannot manipulate points
- **Anti-Cheating**: No resets or session manipulation

---

## 🛠️ Tech Stack

- **Frontend**: React 18, Framer Motion, Axios
- **Backend**: Express.js, Express-Session, Node.js
- **Styling**: Cyberpunk CSS with neon effects
- **Audio**: Custom audio manager with synth sounds

---

## 📋 System Requirements

- **Node.js**: 14.0.0 or higher
- **npm**: 6.0.0 or higher
- **Ports**: 3000 (frontend) and 5000 (backend) must be available
- **RAM**: 2GB minimum (4GB recommended)
- **Disk Space**: 500MB free space
- **Browser**: Modern browser (Chrome, Firefox, Safari, Edge)

---

## 🎮 How to Play

1. **Start the application**: `node main.js`
2. **Open browser**: `http://localhost:3000`
3. **Click "INITIATE CHALLENGE"** on the start screen
4. **Answer 30 questions** in 25 minutes
5. **Select the correct answer** to advance
6. **Wrong answers** deduct 50 points
7. **Continue through all 30 levels** regardless of score
8. **See your final score** and performance ranking

---

## 📊 Game Statistics

| Metric | Value |
|--------|-------|
| Total Puzzles | 30 |
| Time Limit | 25 minutes |
| Starting Score | 1000 points |
| Wrong Answer Penalty | -50 points |
| Answer Choices | 4 per question |
| Difficulty | Intermediate to Hard |
| Theme | Cyberpunk/Hacker |

---

## 🔧 Helpful Commands

```bash
# Start the application (recommended)
node main.js

# Verify setup is correct
npm run verify

# Run diagnostics if something goes wrong
npm run diagnose

# Fix dependency issues
npm run fix

# Clear stuck ports
npm run kill-ports

# Complete reset (if all else fails)
npm run reset

# View logs
tail -f cyber_escape_room.log
```

---

## 🐛 Troubleshooting

### Port Already in Use
```bash
# main.js handles this automatically, or:
npm run kill-ports
node main.js
```

### Dependencies Won't Install
```bash
npm cache clean --force
npm run fix
node main.js
```

### Frontend Not Compiling
```bash
# First run takes 1-2 minutes. If stuck:
npm run reset
node main.js
```

### Backend Not Responding
```bash
# Check backend health
curl http://localhost:5000/api/health

# Restart
npm run kill-ports
node main.js
```

For more troubleshooting, see **[STARTUP_GUIDE.md](STARTUP_GUIDE.md)**.

---

## 📁 Project Structure

```
offensive_sec_quiz_2/
├── main.js                    ← START HERE!
├── verify-startup.js          ← Verification tool
├── error-recovery.js          ← Troubleshooting tool
├── LAUNCH_INSTRUCTIONS.md     ← Quick reference
├── STARTUP_GUIDE.md          ← Detailed guide
├── COMPREHENSIVE_SETUP.md    ← Complete guide
│
├── backend/
│   ├── src/
│   │   ├── server.js         ← API server
│   │   ├── routes/quiz.js    ← Game endpoints
│   │   ├── models/           ← Data models
│   │   └── data/             ← 30 puzzles
│   └── package.json
│
├── frontend/
│   ├── src/
│   │   ├── App.js            ← Main app
│   │   ├── components/       ← Game screens
│   │   └── utils/            ← API client
│   └── package.json
│
└── package.json
```

---

## 🔒 Security Notes

- **Server-Side Validation**: All answers verified on backend
- **Session Management**: Each session is unique and tamper-proof
- **Score Protection**: Scores calculated and stored server-side
- **CORS Protection**: Cross-origin requests validated
- **Input Validation**: All inputs sanitized before processing

---

## 🎓 Learning Outcomes

Playing this escape room will test your knowledge of:

- **Network Security**: MITM attacks, protocol analysis
- **Web Security**: SQL injection, XSS, CSRF
- **Exploitation**: Buffer overflows, privilege escalation
- **Post-Exploitation**: Lateral movement, persistence
- **Cryptography**: Encryption, key management
- **Cloud Security**: AWS IAM, Azure security
- **And much more!**

---

## 📞 Support

- **Quick Start**: See [LAUNCH_INSTRUCTIONS.md](LAUNCH_INSTRUCTIONS.md)
- **Setup Help**: See [STARTUP_GUIDE.md](STARTUP_GUIDE.md)
- **Full Details**: See [COMPREHENSIVE_SETUP.md](COMPREHENSIVE_SETUP.md)
- **Diagnostics**: Run `npm run diagnose`

---

## 📝 Version

- **Version**: 3.0.0
- **Status**: Production Ready ✅
- **Last Updated**: November 2024

---

## 🎉 Ready to Play?

```bash
# Start the game
node main.js

# Then open: http://localhost:3000
```

Enjoy the Cyber Escape Room! 🎮🔐

---

**Made with ❤️ for cybersecurity enthusiasts**
