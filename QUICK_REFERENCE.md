# ⚡ QUICK REFERENCE CARD

## 🚀 START THE GAME (< 30 seconds)

```bash
cd /workspaces/offensive_sec_quiz_2
./start.sh
```

Then open: http://localhost:3000

**That's it!** Everything else is automatic.

---

## 🎮 HOW TO PLAY

1. Click "BEGIN MISSION"
2. Answer 30 cybersecurity questions
3. Avoid wrong answers (session locks permanently!)
4. Watch your score and timer
5. See final results

**Scoring**: 1000 starting points, -50 per wrong answer

---

## 🔴 SOMETHING'S WRONG?

### Backend won't start
```bash
# Check if something is using port 5000
lsof -i :5000

# Or just run start.sh again (auto-resolves)
./start.sh
```

### Frontend won't load
```bash
# Hard refresh browser
Ctrl+Shift+R

# Or clear cache and refresh
Ctrl+Shift+Delete
```

### Quiz won't start
- Check footer: Is it showing "BACKEND ONLINE"?
- If not, wait 5 seconds for health check
- If still offline, restart: `./start.sh`

### Network timeout errors
- **Auto-handled!** System retries 3 times automatically
- Just wait, it will recover
- If keeps failing, check internet

---

## 📊 WHAT YOU'LL SEE

```
✓ Prerequisites verified
✓ Dependencies installed
✓ Backend started (http://localhost:5000)
✓ Frontend started (http://localhost:3000)
✓ All systems online

🎮 Access the game at: http://localhost:3000
```

✅ You're ready to play!

---

## 📋 CUSTOMIZATION

### Change backend port
Edit `.env`:
```env
PORT=5000  # Change to your port
```

### Change log level
Edit `.env`:
```env
LOG_LEVEL=debug  # More details
LOG_LEVEL=error  # Only errors
```

### View activity logs
```bash
tail -f cyber_escape_room.log
```

---

## 🛑 STOP THE GAME

```bash
Ctrl+C
```

Gracefully shuts down everything and cleans up.

---

## 🎯 KEY FILES

| File | Purpose |
|------|---------|
| `./start.sh` | **USE THIS** - Main launcher |
| `http://localhost:3000` | Game website |
| `http://localhost:5000/api/health` | Backend health check |
| `cyber_escape_room.log` | All activity logs |
| `.env` | Configuration (auto-created) |

---

## ✅ QUICK CHECKLIST

Before you start:
- [ ] Node.js installed? (`node --version`)
- [ ] npm installed? (`npm --version`)
- [ ] In correct directory? (`pwd`)
- [ ] start.sh executable? (`ls -la start.sh`)

Then:
```bash
./start.sh
```

Done! ✅

---

## 🆘 NEED HELP?

- **How to play**: See [PRODUCTION_MASTER_GUIDE.md](./PRODUCTION_MASTER_GUIDE.md)
- **Something broken**: See [TROUBLESHOOTING.md](./TROUBLESHOOTING.md)
- **Technical details**: See [FINAL_IMPROVEMENTS.md](./FINAL_IMPROVEMENTS.md)
- **All docs**: See [DOCUMENTATION_INDEX.md](./DOCUMENTATION_INDEX.md)

---

## 🟢 STATUS INDICATOR

Bottom-right of screen shows:
- 🟢 **BACKEND ONLINE** → Go play!
- 🟡 **CHECKING...** → Wait a moment
- 🔴 **BACKEND OFFLINE** → Restart with `./start.sh`

---

## 💡 PRO TIPS

1. **Network acting up?** It auto-retries 3 times - just wait
2. **Want to try again?** Hit "Restart Mission" on results page
3. **Check progress?** Your score is always visible
4. **Close terminal?** Use `Ctrl+C` - don't just close it
5. **Port conflict?** start.sh auto-resolves - run it again

---

## 🎓 GAME STATS

- **Questions**: 30
- **Time Limit**: 25 minutes
- **Starting Points**: 1000
- **Wrong Answer Penalty**: -50 points
- **Session Lock**: On first wrong answer
- **Difficulty**: Easy → Expert

---

## 📞 QUICK ANSWERS

**Q: How do I start?**
A: `./start.sh` then open http://localhost:3000

**Q: Can I run this on Windows?**
A: Yes! Use Git Bash or WSL2

**Q: Why is the backend offline?**
A: It might still be starting. Wait 10 seconds and refresh.

**Q: Can I change questions?**
A: Yes, edit `backend/src/data/escapeRoomQuestions.js` and restart

**Q: Where are the logs?**
A: `cyber_escape_room.log` - check with `tail -f cyber_escape_room.log`

**Q: How do I stop it?**
A: Press `Ctrl+C` - it shuts down gracefully

**Q: Can I run on a different port?**
A: Edit `.env` and set `PORT=yourport` before starting

**Q: What if port is already in use?**
A: start.sh auto-kills the process - just run it again

---

## 🚀 ONE COMMAND TO RULE THEM ALL

```bash
./start.sh
```

✅ Everything automatic from here!

---

**Version**: 2.0.77
**Status**: Production Ready ✅
**Last Updated**: November 2024
