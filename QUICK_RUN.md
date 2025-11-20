# ⚡ QUICK REFERENCE - HOW TO RUN YOUR PROJECT

## 🚀 THE EASIEST WAY (ONE COMMAND)

```bash
node main.js
```

Then open browser: **http://localhost:3000** 🎮

---

## 📝 ALTERNATIVE COMMANDS

```bash
npm start              # Same as: node main.js
npm run main           # Same as: node main.js  
./quick-launch.sh      # Bash wrapper with colors
```

---

## 🔧 CUSTOM PORTS

```bash
PORT=5001 node main.js
FRONTEND_PORT=3001 node main.js
PORT=5001 FRONTEND_PORT=3001 node main.js
```

---

## 📊 WHAT GETS LAUNCHED

✅ **Backend** (Express.js) on **port 5000**  
✅ **Frontend** (React) on **port 3000**  
✅ **Both automatically** with single command  

---

## 📋 WHAT HAPPENS AUTOMATICALLY

1. ✓ Validates Node.js and npm
2. ✓ Installs dependencies if needed
3. ✓ Checks ports (auto-fixes conflicts)
4. ✓ Starts backend with health check
5. ✓ Starts frontend with React config
6. ✓ Shows green "READY" banner
7. ✓ Monitors both services continuously
8. ✓ Logs everything to `cyber_escape_room.log`

---

## 🛑 TO STOP

Press **Ctrl+C** (graceful shutdown)

---

## 📋 VERIFICATION

```bash
# Check system is ready
npm run check

# Test all API endpoints
npm run verify

# View logs
tail -f cyber_escape_room.log
```

---

## 🆘 QUICK TROUBLESHOOTING

| Problem | Solution |
|---------|----------|
| Port in use | `node main.js` auto-fixes it |
| Dependencies missing | `node main.js` auto-installs |
| Blank screen | Wait 30 seconds for React compile |
| Backend error | Check: `tail cyber_escape_room.log` |
| Frontend error | Open: DevTools (F12) Console tab |

---

## 📚 DOCUMENTATION

| File | Purpose |
|------|---------|
| **MAIN_LAUNCHER_GUIDE.md** | Complete launcher guide |
| **MAIN_JS_README.md** | Detailed main.js docs |
| **QUICK_START.md** | Project quickstart |
| **API_DOCUMENTATION.md** | API reference |

---

## ✅ YOU'RE ALL SET!

Just run:
```bash
node main.js
```

Everything else is automatic! 🚀
