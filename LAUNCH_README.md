# 🎮 Cyber Escape Room - Quick Launch Guide

## 🚀 Single Command Launch

To start the entire Cyber Escape Room application with one command:

```bash
./launch.sh
```

This will automatically:
- ✅ Check all prerequisites (Node.js, npm)
- ✅ Install missing dependencies
- ✅ Create configuration files
- ✅ Start backend server (Port 5000)
- ✅ Start frontend server (Port 3000)
- ✅ Monitor both processes
- ✅ Open application in browser

## 📋 Prerequisites

- **Node.js**: Version 14 or higher
- **npm**: Version 6 or higher
- **Ports**: 3000 and 5000 must be available

## 🎯 First Time Setup

If `launch.sh` is not executable, run:

```bash
chmod +x launch.sh
./launch.sh
```

The launcher will automatically install all dependencies on first run.

## 🌐 Access Points

Once launched, access the application at:

- **Frontend (Play Game)**: http://localhost:3000
- **Backend API**: http://localhost:5000
- **Health Check**: http://localhost:5000/health

## 🛑 Stopping the Application

Press `Ctrl+C` in the terminal where `launch.sh` is running. This will gracefully shut down both servers.

## 📊 Game Features

### ⚡ Cyberpunk Theme
- Dark backgrounds with neon accents (electric blue, hot pink, ultraviolet purple)
- Glitch effects and flickering animations
- Scanline and grid overlays
- Terminal-style interface

### 🎯 Gameplay Mechanics
- **30 Stages**: Progressive offensive security challenges
- **25 Minute Timer**: Strict time limit
- **Score System**: Start with 1000 points
- **Penalties**: -50 points per wrong answer
- **No Lockouts**: Continue regardless of score
- **Confusing Options**: Each question has 4 similar choices (a, b, c, d)
- **No Hints**: Pure skill-based challenge

### 🎨 Visual Effects
- Framer Motion animations
- Glitch text effects
- Pulsing neon borders
- Animated backgrounds
- Smooth transitions
- Dynamic progress bars

## 🔧 Manual Setup (Alternative)

If you prefer manual setup:

### Backend

```bash
cd backend
npm install
npm start
```

### Frontend (in a new terminal)

```bash
cd frontend
npm install
npm start
```

## 🐛 Troubleshooting

### Port Already in Use

If ports 3000 or 5000 are occupied:

```bash
# Kill process on port 3000
lsof -ti:3000 | xargs kill -9

# Kill process on port 5000
lsof -ti:5000 | xargs kill -9
```

### Dependencies Issue

```bash
# Clean install backend
cd backend
rm -rf node_modules package-lock.json
npm install

# Clean install frontend
cd frontend
rm -rf node_modules package-lock.json
npm install
```

### Backend Not Responding

Check backend logs:
```bash
curl http://localhost:5000/health
```

Should return:
```json
{"status":"ok","timestamp":"..."}
```

## 📝 Logs

All application logs are written to `cyber_escape_room.log` in the root directory.

## 🔐 Environment Variables

Backend uses these variables (auto-created):
- `PORT=5000`
- `NODE_ENV=development`
- `SESSION_SECRET=cyber-escape-room-secret-key-2024`

## 🎮 How to Play

1. **Launch**: Run `./launch.sh`
2. **Open**: Navigate to http://localhost:3000
3. **Start Mission**: Click "INITIATE MISSION"
4. **Solve Challenges**: Answer 30 offensive security questions
5. **Beat the Clock**: Complete within 25 minutes
6. **Score High**: Minimize wrong answers to maximize score

## 🏆 Scoring

- **Starting Points**: 1000
- **Correct Answer**: Progress to next level
- **Wrong Answer**: -50 points (can retry same question)
- **No Lockouts**: Complete all 30 regardless of score
- **Time Limit**: 25:00 minutes

## 🎨 Theme Colors

- **Cyber Blue**: `#00f3ff`
- **Cyber Pink**: `#ff006e`
- **Cyber Purple**: `#8b5cf6`
- **Cyber Green**: `#00ff41`
- **Background Dark**: `#0a0a0f`

## 📦 Technologies

### Backend
- Node.js + Express
- Express-session for state management
- In-memory session store
- RESTful API

### Frontend
- React 18
- Framer Motion for animations
- CSS3 with cyberpunk styling
- Axios for API calls

## 🎯 Question Categories

- Network Infiltration
- Web Exploitation
- Memory Corruption
- Wireless Security
- Active Directory
- Cryptography
- Cloud Security
- Container Security
- API Security
- Post-Exploitation
- Mobile Security
- Binary Exploitation
- Forensics
- Social Engineering
- Privilege Escalation
- Malware Analysis
- OSINT
- Password Cracking
- Network Protocols
- Steganography
- IoT Hacking
- SSRF Exploitation
- Blockchain Security
- Zero-Day Research
- Rootkit Development
- Red Team Operations
- Supply Chain Attacks
- Advanced Evasion
- Threat Hunting
- Final Challenge

## 🔄 Restarting a Session

The game automatically manages sessions. To start a new challenge:
1. Complete current game or wait for timeout
2. Click "START NEW MISSION" on results screen
3. Or refresh the page to return to start screen

## ⚠️ Important Notes

- **Session Persistence**: Sessions are stored in memory (lost on restart)
- **One Session**: Only one active session at a time
- **No Saving**: Cannot save progress mid-game
- **Fair Play**: No hints, no answer reveals on wrong attempts
- **Challenge Mode**: Designed for experienced security professionals

## 🎓 Educational Purpose

This application is designed for:
- Cybersecurity education
- Offensive security training
- Penetration testing practice
- Security awareness
- CTF preparation

## 📞 Support

Check logs at `cyber_escape_room.log` for detailed error messages.

## 🎉 Enjoy the Challenge!

Good luck, operative. The systems are waiting to be infiltrated.

---

**Version**: 2.0.77  
**Status**: ✅ Production Ready  
**Last Updated**: 2024
