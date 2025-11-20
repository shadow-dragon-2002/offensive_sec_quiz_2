# 🚀 Getting Started with Offensive Security Escape Room

## Quick Start (30 seconds)

```bash
# Clone the repository
git clone https://github.com/shadow-dragon-2002/offensive_sec_quiz_2.git
cd offensive_sec_quiz_2

# Run the application (one command)
node main.js
```

The application will automatically:
1. ✅ Check and install all dependencies
2. ✅ Build the React frontend
3. ✅ Start the Express server on port 3000
4. ✅ Open your browser to http://localhost:3000

**That's it!** You're ready to play.

---

## What You'll Experience

### 🎮 Welcome Screen
- Mission briefing with challenge details
- 6 attack phases overview (RECONNAISSANCE → EXFILTRATION)
- Neural protocol constraints
- "INITIATE OPERATION" button to begin

### ⚡ Game Screen
- **Timer**: 25-minute countdown with color-coded status
  - 🟢 STABLE (>10 min)
  - 🟡 WARNING (5-10 min)
  - 🔴 CRITICAL (<5 min)
- **Score Display**: Starts at 100 points
- **Progress Bar**: Visual infiltration depth (1-30 nodes)
- **Stage Card**: Question with 4 answer options
  - Click to select (glowing hot-pink border)
  - "⚡ INJECT PAYLOAD" to submit
  - Correct ✓ (green) or Wrong ✗ (red) feedback

### 🏆 Completion Screen
- Final score and rank display
  - 🥇 GOLD (85-100): Elite Operator
  - 🥈 SILVER (70-84): Skilled Operative
  - 🥉 BRONZE (50-69): Competent Hacker
  - ✅ COMPLETE (0-49): Persistent Learner
- Statistics: Score, stages completed, time elapsed
- Name input for leaderboard submission
- "VIEW LEADERBOARD" button

### 📊 Leaderboard
- Top 10 global rankings
- Player names, scores, times, ranks
- Your position highlighted in cyan

---

## Game Rules

### ⚙️ Mechanics
1. **Start**: Begin with 100 points
2. **Answer**: Select one of 4 options
3. **Scoring**:
   - ✅ Correct: Keep your score
   - ❌ Wrong: Lose 10 points
4. **Progression**: Move to next stage regardless of answer
5. **Timer**: Complete all 30 stages within 25 minutes
6. **One Shot**: Can't restart once you begin (session-locked)

### 🎯 Strategy Tips
- **Read Carefully**: All options are plausible
- **Think Like a Pentester**: Use real-world security knowledge
- **Manage Time**: 50 seconds per question on average
- **Don't Rush**: Wrong answers cost 10 points each
- **Progressive Difficulty**: Later stages are harder

---

## Educational Content

### 📚 6 Attack Phases (30 Questions)

#### Phase 1: RECONNAISSANCE (Stages 1-6)
- Port scanning techniques
- OSINT and information gathering
- Wireless network reconnaissance
- SSL/TLS certificate analysis
- Physical security testing

#### Phase 2: SCANNING (Stages 7-11)
- Vulnerability scanner usage
- API security testing
- Service enumeration
- NoSQL injection basics
- Network topology mapping

#### Phase 3: EXPLOITATION (Stages 12-18)
- SQL injection (authentication & data extraction)
- Cross-Site Scripting (XSS)
- Remote Code Execution (RCE)
- Server-Side Request Forgery (SSRF)
- JWT token manipulation
- Insecure deserialization

#### Phase 4: PRIVILEGE ESCALATION (Stages 19-23)
- Linux privilege escalation
- SUID binary exploitation
- Sudo misconfigurations
- Windows token impersonation
- Kernel exploits

#### Phase 5: LATERAL MOVEMENT (Stages 24-27)
- Lateral movement fundamentals
- Kerberoasting attacks
- Pass-the-Hash techniques
- SMB and PsExec exploitation

#### Phase 6: EXFILTRATION (Stages 28-30)
- Data exfiltration techniques
- Steganography
- Advanced covert channels (DNS, blockchain)

---

## Technical Details

### 🏗️ Architecture
- **Backend**: Express.js on port 3000
- **Frontend**: React 18 + Vite 5
- **Styling**: Tailwind CSS 3.4 + custom cyberpunk theme
- **Animations**: Framer Motion 11
- **Audio**: Web Audio API (procedural generation)

### 🔊 Sound Effects
- ✓ **Correct Answer**: Ascending arpeggio
- ✗ **Wrong Answer**: Descending buzz
- → **Stage Transition**: Laser swoosh
- 🎉 **Completion**: Victory fanfare
- 🔘 **Button Click**: Short beep
- 🖱️ **Hover**: Soft blip

### 🎨 Visual Effects
- Holographic gradient text
- Glitch animations
- CRT scan lines
- Neon glow effects
- Animated progress bars
- Pulsing status indicators

---

## Troubleshooting

### Server Won't Start

**Problem**: Port 3000 already in use

**Solution**:
```bash
# Option 1: Use a different port
PORT=8000 node main.js

# Option 2: Find and kill process using port 3000
lsof -i :3000
kill -9 <PID>
```

### Build Fails

**Problem**: Module not found or build errors

**Solution**:
```bash
# Clear everything and reinstall
cd client
rm -rf node_modules package-lock.json dist
npm install
npm run build

cd ../server
rm -rf node_modules package-lock.json
npm install
```

### Session Issues

**Problem**: Can't start game or session not found

**Solution**:
1. Clear browser cookies for localhost:3000
2. Clear browser localStorage
3. Try in incognito/private window
4. Refresh the page

### No Sound

**Problem**: Audio not playing

**Solution**:
1. Check volume is not muted (system and browser)
2. Click the 🔊 icon in top-right to toggle mute
3. Try interacting with the page first (browser audio policy)

---

## Advanced Usage

### Custom Port
```bash
PORT=8080 node main.js
```

### Custom Session Secret
```bash
# Create .env file in server directory
echo "SESSION_SECRET=your-secret-key-here" > server/.env
node main.js
```

### Development Mode

**Backend (with auto-reload)**:
```bash
cd server
npm run dev
```

**Frontend (with hot module replacement)**:
```bash
cd client
npm run dev
```

Then visit http://localhost:5173 for frontend dev server.

---

## Learn More

- **Full Documentation**: See `README_NEW.md`
- **Implementation Details**: See `IMPLEMENTATION_COMPLETE.md`
- **API Reference**: See `README_NEW.md` § API Reference
- **Customization Guide**: See `README_NEW.md` § Customization

---

## Support

If you encounter issues:

1. **Check Logs**: Terminal output shows errors
2. **Browser Console**: F12 → Console tab for client errors
3. **GitHub Issues**: Report bugs on the repository
4. **Documentation**: Comprehensive guides in README files

---

## License & Disclaimer

**Educational Purpose Only**: This quiz game is designed for educational purposes to teach offensive security concepts. All content should be used ethically and legally. Never perform security testing on systems you don't own or have explicit permission to test.

---

🎮 **Ready to Play?** Run `node main.js` and start your infiltration mission!

⚡ **Good luck, Agent!** ⚡
