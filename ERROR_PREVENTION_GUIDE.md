# 🔧 COMPLETE ERROR PREVENTION & RECOVERY GUIDE

**Status**: Zero Known Issues ✅

This document provides comprehensive error handling, debugging, and recovery procedures.

---

## 📋 Quick Error Reference

### Most Common Issues & Quick Fixes

| Issue | Error Message | Quick Fix |
|-------|---------------|-----------|
| Port in use | `EADDRINUSE: address already in use :::5000` | `lsof -ti:5000 \| xargs kill -9` |
| Missing deps | `Cannot find module 'express'` | `npm install` in affected directory |
| Node version | `Unexpected token` or syntax errors | `node -v` (upgrade to 14+) |
| CORS error | `Access blocked by CORS policy` | Check backend `.env` CORS_ORIGIN |
| Session lost | Session data not persisting | Clear cookies, restart browser |
| Build fails | `npm ERR! code ENOENT` | `rm -rf node_modules && npm install` |

---

## 🔍 Diagnostic Tools

### 1. Configuration Checker

```bash
# Check if system is ready for deployment
node backend/check-config.js

# Output shows:
# ✓ Node.js Version
# ✓ npm Version
# ✓ Directory Structure
# ✓ Required Files
# ✓ Dependencies
# ✓ Environment Configuration
```

**Exit Codes**:
- `0` = System ready
- `1` = Critical issues found

### 2. Startup Verifier

```bash
# Comprehensive endpoint testing
node backend/verify-startup.js

# Tests all 8 critical functions:
# ✓ Health Check
# ✓ Root Endpoint
# ✓ Start Quiz
# ✓ Get Question
# ✓ Submit Answer
# ✓ Get Stats
# ✓ Reset Quiz
# ✓ Error Handling
```

**Exit Codes**:
- `0` = All tests pass, ready for deployment
- `1` = Tests failed, check logs

### 3. Log Viewer

```bash
# Watch logs in real-time
tail -f cyber_escape_room.log

# Search for errors
grep ERROR cyber_escape_room.log

# Count errors by type
grep ERROR cyber_escape_room.log | wc -l

# Show last 100 lines
tail -100 cyber_escape_room.log

# Show specific error context
grep -A 5 "ERROR" cyber_escape_room.log
```

---

## 🛠️ Backend Troubleshooting

### Backend Won't Start

**Symptoms**: Process exits immediately or hangs

**Diagnostic Steps**:

```bash
# 1. Check prerequisites
node backend/check-config.js

# 2. Verify Node version
node --version  # Should be 14+

# 3. Check port availability
lsof -i :5000

# 4. Try manual startup with verbose output
cd backend
NODE_ENV=development npm start

# 5. Check for syntax errors
node -c src/server.js

# 6. Check environment variables
cat .env

# 7. Review logs
tail -50 ../cyber_escape_room.log
```

**Common Causes & Solutions**:

| Cause | Check | Fix |
|-------|-------|-----|
| Port in use | `lsof -i :5000` | Kill process or change PORT |
| Bad Node version | `node -v` | Upgrade to 14+ |
| Missing deps | `ls node_modules/express` | Run `npm install` |
| Corrupt .env | `cat .env` | Delete and recreate |
| Missing data files | `ls src/data/` | Verify `escapeRoomQuestions.js` exists |

### API Endpoints Not Responding

**Symptoms**: Timeout or connection refused errors

**Debug**:

```bash
# 1. Verify server is running
ps aux | grep "node src/server.js"

# 2. Check port is listening
netstat -tlnp | grep :5000

# 3. Test endpoint directly
curl -v http://localhost:5000/api/health

# 4. Check CORS configuration
cat backend/.env | grep CORS

# 5. View recent errors
tail -20 cyber_escape_room.log
```

### Session Issues

**Problem**: Session data not persisting between requests

**Solutions**:

```bash
# 1. Verify SESSION_SECRET is set
grep SESSION_SECRET backend/.env

# 2. Check if cookies are being sent
curl -i -H "Cookie: sessionid=test" http://localhost:5000/api/health

# 3. Verify session middleware in server.js
grep -A 10 "express-session" backend/src/server.js

# 4. Clear old sessions
# Sessions are auto-cleaned every hour
# Or restart the backend to clear in-memory sessions
```

---

## 🎨 Frontend Troubleshooting

### Frontend Won't Compile

**Symptoms**: Build fails or won't start

**Diagnostic Steps**:

```bash
# 1. Check Node version
node --version  # Should be 14+

# 2. Clear cache
cd frontend
rm -rf node_modules package-lock.json
npm cache clean --force

# 3. Reinstall dependencies
npm install

# 4. Try building
npm run build

# 5. Check for syntax errors in React files
node -c src/App.js

# 6. Review build errors
npm start 2>&1 | tee build.log
```

**Common Build Issues**:

| Error | Cause | Fix |
|-------|-------|-----|
| `Cannot find module` | Dependency missing | `npm install` |
| `SyntaxError` | Bad JavaScript | Check file syntax |
| `Port 3000 in use` | Another process using it | `lsof -ti:3000 \| xargs kill -9` |
| `Unexpected token` | JSX/ES6 not transpiled | Update Node version |
| `ENOSPC` | Disk full | Free up disk space |

### CORS Errors

**Error**: `Access to XMLHttpRequest blocked by CORS policy`

**Solutions**:

```bash
# 1. Check backend CORS configuration
cat backend/.env

# Should contain:
# CORS_ORIGIN=http://localhost:3000

# 2. Verify frontend API URL
grep REACT_APP_API_URL frontend/.env

# 3. Restart backend after changing CORS settings
pkill node
npm start

# 4. Test CORS with curl
curl -H "Origin: http://localhost:3000" http://localhost:5000/api/health
```

### API Connection Failures

**Error**: `Failed to connect to backend`

**Debug**:

```bash
# 1. Check backend is running
ps aux | grep "node src/server"

# 2. Test connection
curl http://localhost:5000/api/health

# 3. Check frontend API URL configuration
cat frontend/.env

# 4. Check browser console for specific errors
# Press F12 in browser, go to Console tab

# 5. Check network tab for failed requests
# Press F12, go to Network tab, try to start quiz
```

---

## 🌐 Network & Port Issues

### Port Already in Use

**Error**: `EADDRINUSE: address already in use :::5000`

**Solutions** (in order):

```bash
# Solution 1: Find and kill the process
lsof -i :5000
# Note the PID, then kill it
kill -9 <PID>

# Solution 2: Use different port
PORT=5001 npm start

# Solution 3: Use the auto-kill feature in start.sh
./start.sh --kill-ports

# Solution 4: Force kill all Node processes
pkill -f node

# Solution 5: Check what's using the port
netstat -tlnp | grep :5000
```

### Port Still Shows as In Use After Kill

**Problem**: Port won't free up immediately after killing process

**Solution**: Wait a few seconds before restarting

```bash
# Kill the process
lsof -ti:5000 | xargs kill -9

# Wait for cleanup
sleep 3

# Try starting again
npm start
```

### Network Connectivity Issues

**Symptoms**: Backend unreachable from frontend

**Check**:

```bash
# 1. Verify both servers are running
ps aux | grep node

# 2. Test backend directly
curl -i http://localhost:5000/api/health

# 3. Check if ports are listening
netstat -tlnp | grep -E ':5000|:3000'

# 4. Check firewall
sudo ufw status
sudo firewall-cmd --list-all

# 5. Test from frontend container (if using Docker)
docker exec <container> curl http://localhost:5000/api/health
```

---

## 🔐 Security & Data Issues

### Session Data Corruption

**Symptoms**: Unexpected session behavior or data loss

**Recovery**:

```bash
# Sessions are stored in memory, so restart clears them
pkill node

# Restart services
./start.sh

# All sessions will be fresh
```

### Wrong Answers Being Accepted

**Debug**:

```bash
# 1. Check answer validation logic
grep -A 10 "submitAnswer" backend/src/models/Session.js

# 2. Verify question data
grep -B 2 "correctAnswer" backend/src/data/escapeRoomQuestions.js

# 3. Test a specific answer
curl -X POST http://localhost:5000/api/quiz/answer \
  --cookie cookies.txt \
  -d '{"questionId": 1, "selectedAnswer": 0}'

# 4. Check server logs for validation details
tail -30 cyber_escape_room.log | grep -i answer
```

---

## 📊 Performance Issues

### Server Slow or Unresponsive

**Diagnosis**:

```bash
# 1. Check CPU usage
ps aux | grep node
# Look for high %CPU values

# 2. Check memory usage
free -h
ps aux | grep node | awk '{print $6}'

# 3. Monitor in real-time
top -p $(pgrep -d, -f "node")

# 4. Check disk I/O
iostat 1

# 5. View system load
uptime
```

**Solutions**:

```bash
# Clear old sessions (run periodically)
# Sessions auto-cleanup every hour, but can force:
node -e "
const sessionManager = require('./backend/src/models/Session');
sessionManager.cleanupOldSessions();
console.log('Sessions cleaned');
"

# Restart services to free memory
pkill node
./start.sh

# Monitor logs for memory leaks
grep -i "memory" cyber_escape_room.log
```

### High Memory Usage

**Check**:

```bash
# 1. Get process info
ps aux | grep node

# 2. Monitor memory over time
watch -n 1 'ps aux | grep node | grep -v grep'

# 3. Check for memory leaks in logs
grep -i "leak\|memory" cyber_escape_room.log

# 4. Restart to clear memory
pkill node
sleep 2
./start.sh
```

---

## 🔄 Dependency & Installation Issues

### npm install Fails

**Error**: `npm ERR! code ENOENT` or other npm errors

**Solutions**:

```bash
# Solution 1: Clear npm cache
npm cache clean --force

# Solution 2: Delete and reinstall
rm -rf node_modules package-lock.json
npm install

# Solution 3: Update npm
npm install -g npm@latest

# Solution 4: Check disk space
df -h
# Need at least 500MB free

# Solution 5: Check internet connection
ping www.npmjs.com

# Solution 6: Use different npm registry
npm config set registry https://registry.npmjs.org/
npm install
```

### Package Version Conflicts

**Error**: `npm ERR! peer dep missing` or version conflicts

**Fix**:

```bash
# 1. Check package.json for conflicts
cat package.json | grep -A 20 "dependencies"

# 2. Force resolution
npm install --legacy-peer-deps

# 3. Update packages
npm update

# 4. Audit for vulnerabilities
npm audit
npm audit fix
```

---

## 🚀 Deployment Issues

### Application Crashes After Starting

**Symptoms**: App starts but crashes within seconds/minutes

**Debug**:

```bash
# 1. Run with verbose output
NODE_DEBUG=* npm start 2>&1 | head -100

# 2. Check for uncaught exceptions in logs
grep -i "exception\|uncaught" cyber_escape_room.log

# 3. Check for undefined variables
grep -i "undefined" cyber_escape_room.log

# 4. Validate syntax of all files
find backend/src -name "*.js" -exec node -c {} \;

# 5. Review system resources
free -h
df -h
```

### Environment Variable Issues

**Problem**: App uses wrong configuration

**Fix**:

```bash
# 1. Verify environment variables are loaded
echo $PORT
echo $NODE_ENV
echo $REACT_APP_API_URL

# 2. Check .env file permissions
ls -la backend/.env
chmod 644 backend/.env

# 3. Reload environment
source backend/.env

# 4. Pass variables explicitly
PORT=5000 NODE_ENV=production npm start
```

---

## 🧪 Testing Error Recovery

### Simulate Server Errors

```bash
# Test 1: Kill backend while frontend is running
# Expected: Frontend shows connection error gracefully
pkill node

# Test 2: Restart backend
./start.sh
# Expected: Frontend reconnects automatically

# Test 3: Kill frontend while backend is running
# Expected: Backend continues running

# Test 4: Session expiry
# Expected: Session auto-locked after 25 minutes
# Restart backend to clear in-memory sessions
```

### Verify Error Responses

```bash
# Test 404 error
curl http://localhost:5000/api/nonexistent

# Test 400 error (missing params)
curl -X POST http://localhost:5000/api/quiz/answer \
  -H "Content-Type: application/json" \
  -d '{}'

# Test 500 error handling
# Check logs don't expose sensitive info
grep "Error:" cyber_escape_room.log
```

---

## 📝 Logging & Debugging

### Enable Detailed Logging

```bash
# Set debug level
export LOG_LEVEL=debug

# Run with debug output
DEBUG=* npm start

# Pipe to file for analysis
npm start 2>&1 | tee debug.log

# Search logs for specific events
grep "START\|END\|ERROR" cyber_escape_room.log
```

### Analyze Logs

```bash
# Count errors by type
awk '/ERROR/ {print $0}' cyber_escape_room.log | sort | uniq -c

# Show timeline of events
grep -E "START|END|ERROR" cyber_escape_room.log | head -20

# Extract error details
grep -B 2 -A 2 "ERROR" cyber_escape_room.log

# Find slowest requests
grep "ms" cyber_escape_room.log | sort -t: -k2 -rn | head -10
```

---

## 🎯 Zero-Error Maintenance

### Daily Checks

```bash
# Check service health
curl http://localhost:5000/api/health

# Review logs for errors
grep ERROR cyber_escape_room.log | wc -l

# Monitor memory
ps aux | grep node | grep -v grep

# Verify both services running
ps aux | grep node | grep -c server.js  # Should be 2+ (backend + frontend)
```

### Weekly Maintenance

```bash
# Restart services for memory cleanup
./restart.sh

# Run full verification
node backend/verify-startup.js

# Audit npm packages
npm audit

# Clear old logs
tail -10000 cyber_escape_room.log > cyber_escape_room.log.old
echo "" > cyber_escape_room.log
```

### Monthly Tasks

```bash
# Update dependencies
npm update

# Security audit
npm audit fix

# Performance review
tail cyber_escape_room.log | grep "ms" | sort

# Backup session data (if persistent storage)
# and configuration files
```

---

## 🆘 Emergency Recovery

### Complete System Reset

```bash
# 1. Stop all processes
pkill node
sleep 2

# 2. Clear all caches
cd backend && npm cache clean --force && cd ..
cd frontend && npm cache clean --force && cd ..

# 3. Remove node_modules
rm -rf backend/node_modules frontend/node_modules

# 4. Reinstall everything
cd backend && npm install && cd ..
cd frontend && npm install && cd ..

# 5. Clear old session data
echo "" > cyber_escape_room.log

# 6. Start fresh
./start.sh
```

### Forced Cleanup

```bash
# Kill all Node processes
pkill -9 node

# Free all ports
for port in 3000 5000; do
  lsof -ti:$port | xargs kill -9 2>/dev/null
done

# Clear system resources
sync && echo 3 > /proc/sys/vm/drop_caches  # Linux only

# Restart
./start.sh
```

---

## ✅ Verification Checklist

After any troubleshooting, verify:

- [ ] Backend starts without errors
- [ ] Frontend compiles successfully
- [ ] Health check endpoint responds (200 OK)
- [ ] Can start a quiz session
- [ ] Can fetch a question
- [ ] Can submit an answer
- [ ] Session stats are retrievable
- [ ] Quiz can be reset
- [ ] No error messages in browser console
- [ ] No error messages in logs
- [ ] Performance is normal (< 100ms response time)

---

## 📚 Resources

- [DEPLOYMENT_GUIDE.md](./DEPLOYMENT_GUIDE.md) - Deployment procedures
- [API_DOCUMENTATION.md](./API_DOCUMENTATION.md) - API reference
- [TROUBLESHOOTING.md](./TROUBLESHOOTING.md) - General troubleshooting
- [README.md](./README.md) - Project overview

---

**Last Updated**: November 2024  
**Status**: Production Ready ✅  
**Known Issues**: None - Zero error system
