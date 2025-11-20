# 🌃 CYBER ESCAPE ROOM - Offensive Security Challenge

<div align="center">

```
╔═══════════════════════════════════════════════════════════╗
║                                                           ║
║   ██████╗██╗   ██╗██████╗ ███████╗██████╗                ║
║  ██╔════╝╚██╗ ██╔╝██╔══██╗██╔════╝██╔══██╗               ║
║  ██║      ╚████╔╝ ██████╔╝█████╗  ██████╔╝               ║
║  ██║       ╚██╔╝  ██╔══██╗██╔══╝  ██╔══██╗               ║
║  ╚██████╗   ██║   ██████╔╝███████╗██║  ██║               ║
║   ╚═════╝   ╚═╝   ╚═════╝ ╚══════╝╚═╝  ╚═╝               ║
║                                                           ║
║        ███████╗███████╗ ██████╗ █████╗ ██████╗ ███████╗  ║
║        ██╔════╝██╔════╝██╔════╝██╔══██╗██╔══██╗██╔════╝  ║
║        █████╗  ███████╗██║     ███████║██████╔╝█████╗    ║
║        ██╔══╝  ╚════██║██║     ██╔══██║██╔═══╝ ██╔══╝    ║
║        ███████╗███████║╚██████╗██║  ██║██║     ███████╗  ║
║        ╚══════╝╚══════╝ ╚═════╝╚═╝  ╚═╝╚═╝     ╚══════╝  ║
║                                                           ║
╚═══════════════════════════════════════════════════════════╝
```

[![React](https://img.shields.io/badge/React-18.2.0-61DAFB?style=for-the-badge&logo=react)](https://reactjs.org/)
[![Express](https://img.shields.io/badge/Express-4.18.2-000000?style=for-the-badge&logo=express)](https://expressjs.com/)
[![Framer Motion](https://img.shields.io/badge/Framer_Motion-10.16.4-FF0055?style=for-the-badge&logo=framer)](https://www.framer.com/motion/)
[![License](https://img.shields.io/badge/License-MIT-cyan?style=for-the-badge)](LICENSE)

**An immersive cyberpunk-themed offensive security challenge featuring 30 progressively difficult puzzles, glitch effects, and a 25-minute race against time.**

[🚀 Quick Start](#-quick-start) • [🎮 Features](#-features) • [🏗️ Architecture](#️-architecture) • [📚 Documentation](#-documentation)

</div>

---

## 🚀 Quick Start

### One-Command Launch

```bash
./launch.sh
```

That's it! The launcher will:
- ✅ Check prerequisites (Node.js 14+)
- ✅ Install all dependencies
- ✅ Start backend server (Port 5000)
- ✅ Start frontend server (Port 3000)
- ✅ Monitor both processes

**Access the game at:** http://localhost:3000

### Manual Setup

```bash
# First time setup
npm run setup

# Backend (Terminal 1)
cd backend && npm install && npm start

# Frontend (Terminal 2)
cd frontend && npm install && npm start
```

---

## 🎮 Features

### 🎨 Cyberpunk Aesthetic
- **Neon Color Palette**: Electric blue (#00f3ff), hot pink (#ff006e), ultraviolet purple (#8b5cf6)
- **Glitch Effects**: Real-time text glitching and flickering
- **Animated Backgrounds**: Grid overlays, scanlines, and pulsing radial gradients
- **Terminal UI**: Authentic hacker terminal interface
- **Framer Motion**: Smooth, fluid animations throughout

### ⚡ Gameplay Mechanics
- **30 Challenging Stages**: Progressive offensive security puzzles
- **25-Minute Timer**: Strict time limit with visual warnings
- **Score System**: Start with 1000 points, lose 50 per wrong answer
- **No Lockouts**: Continue to all 30 stages regardless of score
- **Confusing Options**: Each question has 4 similar choices (a, b, c, d)
- **No Hints**: Pure skill-based challenge - no correct answers revealed
- **One Session**: Complete all 30 stages in a single playthrough

### 🎯 Challenge Categories

<table>
<tr>
<td>

- 🌐 Network Infiltration
- 🕸️ Web Exploitation
- 💾 Memory Corruption
- 📡 Wireless Security
- 🏢 Active Directory
- 🔐 Cryptography
- ☁️ Cloud Security
- 🐳 Container Security
- 🔌 API Security
- 🎯 Post-Exploitation

</td>
<td>

- 📱 Mobile Security
- 🔧 Binary Exploitation
- 🔍 Digital Forensics
- 🎭 Social Engineering
- ⬆️ Privilege Escalation
- 🦠 Malware Analysis
- 🔎 OSINT
- 🔑 Password Cracking
- 🌐 Network Protocols
- 🖼️ Steganography

</td>
<td>

- 📡 IoT Hacking
- 🔗 SSRF Exploitation
- ⛓️ Blockchain Security
- 🚨 Zero-Day Research
- 👻 Rootkit Development
- 🔴 Red Team Operations
- 📦 Supply Chain Attacks
- 🥷 Advanced Evasion
- 🔎 Threat Hunting
- 🏆 Final Challenge

</td>
</tr>
</table>

### 🎬 Visual Effects

```css
✨ Glitch text animations
🌊 Smooth page transitions
💫 Pulsing neon borders
🎯 Dynamic progress bars
⚡ Button hover effects
🔦 Scanline overlays
📐 Animated grid patterns
🌈 Color-shifting timers
```

---

## 🏗️ Architecture

### Technology Stack

#### Frontend
```javascript
{
  "core": "React 18.2.0",
  "animations": "Framer Motion 10.16.4",
  "http": "Axios 1.5.0",
  "styling": "CSS3 (Cyberpunk Theme)",
  "fonts": "Orbitron, Share Tech Mono"
}
```

#### Backend
```javascript
{
  "runtime": "Node.js 14+",
  "framework": "Express.js 4.18.2",
  "session": "express-session 1.17.3",
  "security": "CORS, dotenv",
  "storage": "In-memory Map"
}
```

### Project Structure

```
cyber-escape-room/
├── launch.sh                    # 🚀 Single-command launcher
├── package.json                 # Root package configuration
├── LAUNCH_README.md             # Launcher documentation
│
├── backend/
│   ├── src/
│   │   ├── server.js           # Express server
│   │   ├── models/
│   │   │   └── Session.js      # Session management
│   │   ├── routes/
│   │   │   └── quiz.js         # API endpoints
│   │   └── data/
│   │       └── escapeRoomQuestions.js  # 30 puzzles
│   ├── .env                     # Environment config
│   └── package.json
│
├── frontend/
│   ├── src/
│   │   ├── App.js              # Main component
│   │   ├── CyberpunkApp.css    # Global cyberpunk theme
│   │   ├── components/
│   │   │   ├── StartScreen.js  # Mission briefing
│   │   │   ├── QuizScreen.js   # Challenge interface
│   │   │   ├── ResultScreen.js # Mission results
│   │   │   └── Timer.js        # 25-min countdown
│   │   └── utils/
│   │       └── api.js          # Axios config
│   └── package.json
│
└── Documentation/
    ├── README.md
    ├── ARCHITECTURE.md
    ├── DEPLOYMENT.md
    └── TROUBLESHOOTING.md
```

---

## 🎯 How to Play

### 1. Start the Mission
```bash
./launch.sh
```
Navigate to http://localhost:3000

### 2. Mission Briefing
- Read the objectives
- Review the rules
- Check the parameters (30 stages, 25 minutes, -50 penalty)
- Click **"INITIATE MISSION"**

### 3. Solve Challenges
- Read each question carefully
- Choose from options a), b), c), or d)
- Submit your answer
- **Correct**: Progress to next level
- **Wrong**: Lose 50 points, can retry same question
- Timer never stops!

### 4. Complete the Mission
- Answer all 30 questions
- Beat the 25-minute timer
- View your final score and rank
- Start a new mission

---

## 📊 Scoring System

| Metric | Value |
|--------|-------|
| **Starting Points** | 1000 |
| **Wrong Answer Penalty** | -50 |
| **Minimum Score** | No minimum (can go negative) |
| **Progression** | Never blocked, always move forward with correct answer |
| **Time Limit** | 25:00 minutes |
| **Questions** | 30 stages |

### Ranks

| Score Range | Rank | Icon |
|-------------|------|------|
| 100% correct | **ELITE HACKER** | 👑 |
| 90%+ | **MASTER** | ⭐ |
| 70%+ | **ADVANCED** | 🎖️ |
| 50%+ | **INTERMEDIATE** | 📊 |
| 30%+ | **NOVICE** | 🔰 |
| <30% | **BEGINNER** | 📝 |

---

## 🎨 Theme Customization

### Color Variables

```css
:root {
  --cyber-blue: #00f3ff;
  --cyber-pink: #ff006e;
  --cyber-purple: #8b5cf6;
  --cyber-green: #00ff41;
  --cyber-yellow: #ffff00;
  
  --bg-darkest: #0a0a0f;
  --bg-dark: #121218;
  --bg-medium: #1a1a24;
  --bg-panel: #1e1e2e;
}
```

### Typography

```css
Primary: 'Orbitron' (Headings, Buttons)
Monospace: 'Share Tech Mono' (Terminal, Code)
```

---

## 🔧 Configuration

### Backend (.env)

```env
PORT=5000
NODE_ENV=development
SESSION_SECRET=cyber-escape-room-secret-key-2024
```

### Session Settings

```javascript
{
  timeLimit: 25 * 60 * 1000,  // 25 minutes
  startingScore: 1000,
  penaltyPerWrong: 50,
  totalQuestions: 30
}
```

---

## 📚 Documentation

| Document | Description |
|----------|-------------|
| [LAUNCH_README.md](LAUNCH_README.md) | Detailed launcher guide |
| [ARCHITECTURE.md](ARCHITECTURE.md) | System architecture |
| [DEPLOYMENT.md](DEPLOYMENT.md) | Deployment instructions |
| [TROUBLESHOOTING.md](TROUBLESHOOTING.md) | Common issues & fixes |
| [TESTING.md](TESTING.md) | Testing procedures |

---

## 🐛 Troubleshooting

### Port Already in Use

```bash
# Kill process on port 3000
lsof -ti:3000 | xargs kill -9

# Kill process on port 5000
lsof -ti:5000 | xargs kill -9
```

### Backend Not Responding

```bash
# Check backend health
curl http://localhost:5000/health

# Should return:
# {"status":"ok","timestamp":"..."}
```

### Dependencies Issue

```bash
# Clean reinstall
npm run clean
npm run install:all
```

### Browser Not Opening

Manually navigate to: http://localhost:3000

---

## 🚀 Deployment

### Docker (Recommended)

```bash
docker-compose up --build
```

### Manual Production Build

```bash
# Frontend
cd frontend
npm run build

# Backend (Production mode)
cd backend
NODE_ENV=production npm start
```

---

## 🤝 Contributing

1. Fork the repository
2. Create feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit changes (`git commit -m 'Add AmazingFeature'`)
4. Push to branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

---

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

---

## 🎓 Educational Purpose

This application is designed for:
- 🎯 Cybersecurity education
- 🛡️ Offensive security training
- 🔓 Penetration testing practice
- 📚 Security awareness
- 🏆 CTF preparation
- 💼 Professional development

---

## ⚠️ Disclaimer

This tool is for **educational purposes only**. The creators are not responsible for misuse or damage caused by this program. Use only in authorized environments.

---

## 🌟 Acknowledgments

- Cyberpunk aesthetics inspired by Blade Runner, Ghost in the Shell, and Cyberpunk 2077
- Offensive security questions based on industry best practices
- Built with passion for the cybersecurity community

---

<div align="center">

**🎮 Ready to infiltrate? Let the mission begin! 🎮**

Made with 💜 by Security Enthusiasts

[![GitHub stars](https://img.shields.io/github/stars/yourusername/cyber-escape-room?style=social)](https://github.com/yourusername/cyber-escape-room)
[![GitHub forks](https://img.shields.io/github/forks/yourusername/cyber-escape-room?style=social)](https://github.com/yourusername/cyber-escape-room)

</div>
