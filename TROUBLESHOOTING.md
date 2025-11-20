# Troubleshooting and Deployment Guide

## Quick Start

### Prerequisites
- Node.js 14+ 
- npm 6+
- Modern web browser
- Port 5000 and 3000 available

### Installation

1. **Clone or navigate to project**
```bash
cd offensive_sec_quiz_2
```

2. **Run setup script**
```bash
chmod +x setup.sh
./setup.sh
```

Or manually:

**Backend Setup:**
```bash
cd backend
cp .env.example .env
npm install
```

**Frontend Setup:**
```bash
cd frontend
npm install
```

### Running the Application

**Terminal 1 - Backend:**
```bash
cd backend
npm start
# Server will run on http://localhost:5000
```

**Terminal 2 - Frontend:**
```bash
cd frontend
npm start
# Frontend will run on http://localhost:3000
```

Then open http://localhost:3000 in your browser.

---

## Common Issues & Solutions

### 1. Backend Port Already in Use

**Error:** `EADDRINUSE: address already in use :::5000`

**Solutions:**
```bash
# Find process using port 5000
lsof -i :5000

# Kill the process
kill -9 <PID>

# Or change the port in .env
echo "PORT=5001" >> backend/.env
```

### 2. Frontend Port Already in Use

**Error:** `Something is already running on port 3000`

**Solutions:**
```bash
# Find and kill process
lsof -i :3000
kill -9 <PID>

# Or use a different port
PORT=3001 npm start
```

### 3. "Cannot find module" Errors

**Error:** `Error: Cannot find module 'express'`

**Solutions:**
```bash
# Clear node_modules and reinstall
rm -rf node_modules package-lock.json
npm install

# If using npm 7+, ensure legacy peer deps are handled
npm install --legacy-peer-deps
```

### 4. CORS Errors

**Error:** `Access to XMLHttpRequest has been blocked by CORS policy`

**Solutions:**
- Ensure backend is running on http://localhost:5000
- Check FRONTEND_URL in backend/.env matches your frontend URL
- Verify frontend proxy setting in package.json: `"proxy": "http://localhost:5000"`

### 5. Session Not Persisting

**Error:** Session data lost on page refresh

**Solutions:**
- Ensure cookies are enabled in browser
- Check browser console for cookie errors
- Verify SESSION_SECRET in backend/.env is set
- Clear browser cookies and restart

### 6. Quiz Starts But No Questions Load

**Error:** Loading spinner shows indefinitely

**Solutions:**
```bash
# Check backend logs for errors
# Verify API endpoint: curl http://localhost:5000/api/health

# Check frontend network tab for failed requests
# Verify backend is actually running
curl http://localhost:5000/api/quiz/start -X POST

# Check for JavaScript errors in browser console
```

### 7. Timer Not Displaying or Working

**Error:** Timer component missing or not counting down

**Solutions:**
- Ensure Timer.js and Timer.css are present
- Check browser console for component errors
- Clear browser cache and reload
- Verify timeLimit prop is being passed correctly

### 8. Styling Issues (Colors Not Showing)

**Error:** Page appears unstyled or broken layout

**Solutions:**
```bash
# Clear build cache and reinstall
rm -rf frontend/build node_modules
npm install
npm start

# Check CSS files exist:
ls -la frontend/src/*.css
ls -la frontend/src/components/*.css
```

---

## Docker Deployment

### Prerequisites
- Docker
- Docker Compose

### Using Docker Compose

```bash
# Build images
docker-compose build

# Start services
docker-compose up -d

# View logs
docker-compose logs -f

# Stop services
docker-compose down

# Access application
# Frontend: http://localhost:3000
# Backend: http://localhost:5000
```

### Manual Docker Build

**Backend:**
```bash
cd backend
docker build -t offensive-sec-quiz-backend .
docker run -p 5000:5000 \
  -e NODE_ENV=production \
  -e SESSION_SECRET=your-secret-key \
  offensive-sec-quiz-backend
```

**Frontend:**
```bash
cd frontend
docker build -t offensive-sec-quiz-frontend .
docker run -p 3000:3000 \
  -e REACT_APP_API_URL=http://localhost:5000/api \
  offensive-sec-quiz-frontend
```

---

## Production Deployment

### Environment Setup

Create `backend/.env` with:
```env
PORT=5000
NODE_ENV=production
SESSION_SECRET=your-very-secure-random-key-min-32-chars
FRONTEND_URL=https://yourdomain.com
```

### Security Checklist

- [ ] Change SESSION_SECRET to a strong random string
- [ ] Set NODE_ENV=production
- [ ] Use HTTPS in production
- [ ] Update CORS origin to your domain
- [ ] Use environment variables for all secrets
- [ ] Enable rate limiting (optional enhancement)
- [ ] Set up monitoring and logging
- [ ] Regular backups if using persistent storage

### Deployment Options

#### AWS EC2 / Ubuntu Server
```bash
# Install Node.js
curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
sudo apt-get install -y nodejs

# Clone and setup
git clone <repo-url>
cd offensive_sec_quiz_2
./setup.sh

# Use PM2 for process management
sudo npm install -g pm2
pm2 start backend/src/server.js --name "quiz-backend"
pm2 start "npm --prefix frontend start" --name "quiz-frontend"
pm2 startup
pm2 save
```

#### Heroku
```bash
# Install Heroku CLI and login
heroku login

# Create app
heroku create offensive-sec-quiz

# Set environment variables
heroku config:set SESSION_SECRET=your-key
heroku config:set NODE_ENV=production

# Deploy
git push heroku main
```

#### Docker on Any Server
```bash
docker-compose -f docker-compose.yml up -d
```

---

## Performance Optimization

### Backend Optimization
- Use clustering for multi-core CPU usage
- Implement caching for questions
- Use connection pooling if adding database
- Monitor memory usage
- Set up proper error logging

### Frontend Optimization
- Build for production: `npm run build`
- Use lazy loading for components
- Implement service workers for caching
- Monitor bundle size with `npm run build -- --analyze`
- Use CDN for static assets

---

## Monitoring & Debugging

### Check Backend Health
```bash
curl http://localhost:5000/api/health
```

### View Backend Logs
```bash
# If running with npm
# Logs appear directly in terminal

# If running with PM2
pm2 logs quiz-backend
```

### Frontend Debugging
- Open DevTools (F12)
- Check Console tab for errors
- Check Network tab for failed API calls
- Check Application tab for cookies/sessions
- Use React DevTools extension

### Database Queries (if added later)
```bash
# Monitor active connections
lsof -i :5000

# Check system resource usage
top
```

---

## Version Information

- **Node.js**: 14+ (tested on 18)
- **React**: 18.2.0
- **Express.js**: 4.18.2
- **Express-session**: 1.17.3

---

## Support & Further Help

1. Check the README.md for features and architecture
2. Review the CONTRIBUTING.md for development guidelines
3. Check browser console (F12) for specific error messages
4. Verify all environment variables are correctly set
5. Ensure ports 3000 and 5000 are not blocked by firewall

---

## Performance Tuning

### For Development
- Enable hot reload: included by default
- Use `npm run dev` in backend for nodemon
- Check memory usage: `watch -n1 'ps aux | grep node'`

### For Production
- Enable compression middleware
- Use CDN for static files
- Implement database for session storage
- Set up horizontal scaling with load balancer
- Monitor with application monitoring tools

---

Last Updated: November 2024
