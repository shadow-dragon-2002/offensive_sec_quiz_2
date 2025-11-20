# Installation Verification Checklist

## Pre-Installation Requirements

- [ ] Node.js 14+ installed: `node --version` should show v14.0.0 or higher
- [ ] npm 6+ installed: `npm --version` should show 6.0.0 or higher
- [ ] Git installed (optional but recommended): `git --version`
- [ ] Ports 5000 and 3000 are available
- [ ] At least 500MB free disk space
- [ ] Internet connection (for npm package downloads)

## Installation Steps

### Backend Setup
- [ ] Navigate to backend directory: `cd backend`
- [ ] Create .env file: `cp .env.example .env`
- [ ] Install dependencies: `npm install`
- [ ] Verify installation: `npm list` (should show all packages)
- [ ] Check for errors: No red error messages should appear

### Frontend Setup
- [ ] Navigate to frontend directory: `cd frontend`
- [ ] Install dependencies: `npm install`
- [ ] Verify installation: `npm list` (should show all packages)
- [ ] Check for errors: No red error messages should appear

## Pre-Launch Verification

### Backend Verification
- [ ] Backend .env exists: `ls -la backend/.env`
- [ ] Backend has all files:
  - [ ] `backend/src/server.js` exists
  - [ ] `backend/src/routes/quiz.js` exists
  - [ ] `backend/src/models/Session.js` exists
  - [ ] `backend/src/data/questions.js` exists
- [ ] Questions file has 30 questions: `grep -c '"id":' backend/src/data/questions.js`
- [ ] Node modules installed: `ls backend/node_modules | grep express`

### Frontend Verification
- [ ] Frontend has all files:
  - [ ] `frontend/public/index.html` exists
  - [ ] `frontend/src/App.js` exists
  - [ ] `frontend/src/index.js` exists
  - [ ] All components exist in `frontend/src/components/`
- [ ] CSS files present: `ls frontend/src/components/*.css`
- [ ] Node modules installed: `ls frontend/node_modules | grep react`

## Launch Verification

### Backend Launch
- [ ] Run: `cd backend && npm start`
- [ ] Should see: "✓ Offensive Security Quiz API Server is running"
- [ ] Should display port: 5000
- [ ] Health check works: `curl http://localhost:5000/api/health`
- [ ] Response contains: `{"status":"ok",...}`

### Frontend Launch
- [ ] Run in new terminal: `cd frontend && npm start`
- [ ] Should see: Development server started or similar message
- [ ] Browser should open automatically to: `http://localhost:3000`
- [ ] Page should load: "OFFENSIVE SECURITY" title visible
- [ ] "INITIATE CHALLENGE" button should be visible

## Functional Testing

### Quiz Initialization
- [ ] Click "INITIATE CHALLENGE" button
- [ ] Should not show errors
- [ ] Question should load
- [ ] All 4 answer options should be visible
- [ ] Timer should start counting down from 30:00

### Quiz Interaction
- [ ] Select an answer option
- [ ] Option should highlight
- [ ] "SUBMIT ANSWER" button should be enabled
- [ ] Click submit
- [ ] Should receive feedback (correct/incorrect)
- [ ] If correct, should move to next question
- [ ] Score should update
- [ ] Level should increment

### Session Persistence
- [ ] Start quiz and answer a few questions
- [ ] Refresh the browser (F5)
- [ ] Session data should persist
- [ ] Should continue from same level
- [ ] Score should be preserved

### Error Handling
- [ ] Answer a question incorrectly
- [ ] Session should lock immediately
- [ ] Error message should appear
- [ ] Should be able to restart quiz
- [ ] New session should start fresh

## Performance Checks

- [ ] Backend server uses less than 100MB RAM
- [ ] Frontend loads in under 5 seconds
- [ ] Quiz questions load within 1 second
- [ ] Answer submission responds within 2 seconds
- [ ] No console errors (F12 DevTools)

## Security Checks

- [ ] Browser's Developer Tools shows HTTPS ready (for production)
- [ ] Cookies are marked as HttpOnly in Application tab
- [ ] No sensitive data in localStorage
- [ ] API responses don't expose correct answers prematurely

## Browser Compatibility

- [ ] Chrome/Chromium: Works ✓
- [ ] Firefox: Works ✓
- [ ] Safari: Works ✓
- [ ] Edge: Works ✓
- [ ] Mobile browsers: Responsive ✓

## Documentation Verification

- [ ] README.md exists and is readable
- [ ] QUICK_START.md exists and is complete
- [ ] TROUBLESHOOTING.md exists with solutions
- [ ] TESTING.md exists with test procedures
- [ ] DEPLOYMENT.md exists for production setup
- [ ] CONTRIBUTING.md exists for developers

## Docker Verification (Optional)

- [ ] Docker installed: `docker --version`
- [ ] Docker Compose installed: `docker-compose --version`
- [ ] Dockerfile exists in backend
- [ ] Dockerfile exists in frontend
- [ ] docker-compose.yml exists in root
- [ ] Can build images: `docker-compose build`
- [ ] Can start services: `docker-compose up -d`
- [ ] Health check passes: API responds

## Final Verification

- [ ] Both servers running without errors
- [ ] No warning messages in console
- [ ] Quiz loads all 30 questions successfully
- [ ] Can complete a full quiz session
- [ ] Session locking works on wrong answer
- [ ] Timer countdown functions properly
- [ ] Results screen displays correctly
- [ ] Can restart a new quiz

## Post-Installation Recommendations

### Recommended Next Steps
1. [ ] Read QUICK_START.md for quick reference
2. [ ] Review ARCHITECTURE.md for system design
3. [ ] Explore code in src directories
4. [ ] Test all API endpoints with curl
5. [ ] Try running tests: `npm test` (in backend)
6. [ ] Customize questions if needed
7. [ ] Adjust theme colors in CSS files
8. [ ] Set up monitoring for production deployment

### Optional Enhancements
- [ ] Add database support (MongoDB/PostgreSQL)
- [ ] Implement user authentication
- [ ] Add leaderboard functionality
- [ ] Implement hint system
- [ ] Add multiple quiz topics
- [ ] Create admin dashboard
- [ ] Add social sharing features

## Troubleshooting Checklist

If any step fails:

1. **Dependency Issues**
   - [ ] Clear cache: `npm cache clean --force`
   - [ ] Delete node_modules: `rm -rf node_modules`
   - [ ] Reinstall: `npm install`

2. **Port Conflicts**
   - [ ] Check: `lsof -i :5000` (backend)
   - [ ] Check: `lsof -i :3000` (frontend)
   - [ ] Kill: `kill -9 <PID>`

3. **API Connection**
   - [ ] Verify backend running: `curl http://localhost:5000/api/health`
   - [ ] Check CORS settings in backend
   - [ ] Verify proxy in frontend package.json

4. **CSS/Styling Issues**
   - [ ] Clear browser cache (Ctrl+Shift+Delete)
   - [ ] Rebuild frontend: `npm run build`
   - [ ] Check CSS file paths

5. **Session Issues**
   - [ ] Clear browser cookies
   - [ ] Check browser cookie settings
   - [ ] Verify SESSION_SECRET in .env

## Support Resources

- **Error Messages**: Check browser console (F12) and terminal output
- **Documentation**: Review TROUBLESHOOTING.md
- **Testing Guide**: See TESTING.md for detailed procedures
- **API Examples**: Use curl commands from QUICK_START.md

---

## Checklist Summary

- **Total Items**: 100+
- **Critical Items** (must complete):
  - [ ] Node.js and npm installed
  - [ ] Dependencies installed in both directories
  - [ ] Backend server starts without errors
  - [ ] Frontend server starts without errors
  - [ ] Quiz loads and functions properly

✅ If all critical items are checked, your installation is successful!

---

**Last Updated**: November 2024
**Version**: 1.0.0
