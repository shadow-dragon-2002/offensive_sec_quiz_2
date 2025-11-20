# Deployment Guide

This guide covers deploying the Offensive Security Quiz Game to various platforms.

## Prerequisites

- Node.js 14+ and npm
- Git
- Production environment (server, cloud platform, etc.)

## Environment Variables

### Backend Environment Variables

Create a `.env` file in the `backend/` directory:

```env
PORT=5000
NODE_ENV=production
SESSION_SECRET=your-strong-secret-key-here-minimum-32-characters
FRONTEND_URL=https://your-frontend-domain.com
```

**Important**: Generate a strong session secret using:
```bash
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
```

### Frontend Environment Variables

Create a `.env.production` file in the `frontend/` directory:

```env
REACT_APP_API_URL=https://your-backend-domain.com/api
```

## Deployment Options

### Option 1: Traditional Server (VPS/Dedicated)

#### Backend Deployment

1. **Prepare the server**
```bash
# Install Node.js
curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
sudo apt-get install -y nodejs

# Install PM2 for process management
sudo npm install -g pm2
```

2. **Deploy the backend**
```bash
# Clone repository
git clone https://github.com/shadow-dragon-2002/offensive_sec_quiz_2.git
cd offensive_sec_quiz_2/backend

# Install dependencies
npm install --production

# Configure environment
cp .env.example .env
nano .env  # Edit with your values

# Start with PM2
pm2 start src/server.js --name quiz-backend
pm2 save
pm2 startup
```

3. **Configure reverse proxy (Nginx)**
```nginx
server {
    listen 80;
    server_name api.yourdomain.com;

    location / {
        proxy_pass http://localhost:5000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
    }
}
```

4. **Enable HTTPS with Let's Encrypt**
```bash
sudo apt-get install certbot python3-certbot-nginx
sudo certbot --nginx -d api.yourdomain.com
```

#### Frontend Deployment

1. **Build the frontend**
```bash
cd ../frontend
npm install
npm run build
```

2. **Deploy with Nginx**
```nginx
server {
    listen 80;
    server_name yourdomain.com;
    root /var/www/quiz-frontend/build;
    index index.html;

    location / {
        try_files $uri $uri/ /index.html;
    }
}
```

3. **Copy build files**
```bash
sudo mkdir -p /var/www/quiz-frontend
sudo cp -r build/* /var/www/quiz-frontend/
```

### Option 2: Heroku

#### Backend on Heroku

1. **Create Heroku app**
```bash
heroku create your-quiz-backend
```

2. **Set environment variables**
```bash
heroku config:set NODE_ENV=production
heroku config:set SESSION_SECRET=$(node -e "console.log(require('crypto').randomBytes(32).toString('hex'))")
heroku config:set FRONTEND_URL=https://your-frontend.netlify.app
```

3. **Create Procfile in backend directory**
```
web: node src/server.js
```

4. **Deploy**
```bash
cd backend
git init
git add .
git commit -m "Initial commit"
heroku git:remote -a your-quiz-backend
git push heroku main
```

#### Frontend on Netlify

1. **Install Netlify CLI**
```bash
npm install -g netlify-cli
```

2. **Build and deploy**
```bash
cd frontend
npm run build
netlify deploy --prod --dir=build
```

3. **Or connect to GitHub**
- Go to https://netlify.com
- Click "New site from Git"
- Connect your repository
- Set build command: `cd frontend && npm run build`
- Set publish directory: `frontend/build`

### Option 3: Vercel + Railway

#### Backend on Railway

1. **Go to https://railway.app**
2. **Create new project**
3. **Connect GitHub repository**
4. **Configure**
   - Root directory: `backend`
   - Build command: `npm install`
   - Start command: `node src/server.js`
5. **Set environment variables** in Railway dashboard
6. **Deploy**

#### Frontend on Vercel

1. **Install Vercel CLI**
```bash
npm install -g vercel
```

2. **Deploy**
```bash
cd frontend
vercel --prod
```

3. **Or deploy via dashboard**
- Go to https://vercel.com
- Import your repository
- Set root directory: `frontend`
- Framework preset: Create React App
- Override commands:
  - Build: `npm run build`
  - Output: `build`

### Option 4: Docker Deployment

#### Create Dockerfiles

**Backend Dockerfile** (`backend/Dockerfile`):
```dockerfile
FROM node:18-alpine

WORKDIR /app

COPY package*.json ./
RUN npm ci --only=production

COPY . .

EXPOSE 5000

CMD ["node", "src/server.js"]
```

**Frontend Dockerfile** (`frontend/Dockerfile`):
```dockerfile
FROM node:18-alpine as build

WORKDIR /app

COPY package*.json ./
RUN npm ci

COPY . .
RUN npm run build

FROM nginx:alpine
COPY --from=build /app/build /usr/share/nginx/html
COPY nginx.conf /etc/nginx/conf.d/default.conf
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
```

**Frontend nginx.conf**:
```nginx
server {
    listen 80;
    location / {
        root /usr/share/nginx/html;
        index index.html;
        try_files $uri $uri/ /index.html;
    }
}
```

#### Docker Compose

**docker-compose.yml**:
```yaml
version: '3.8'

services:
  backend:
    build: ./backend
    ports:
      - "5000:5000"
    environment:
      - NODE_ENV=production
      - SESSION_SECRET=${SESSION_SECRET}
      - FRONTEND_URL=http://localhost:3000
    restart: unless-stopped

  frontend:
    build: ./frontend
    ports:
      - "3000:80"
    depends_on:
      - backend
    restart: unless-stopped
```

**Deploy with Docker Compose**:
```bash
# Create .env file with SESSION_SECRET
docker-compose up -d
```

## Post-Deployment

### Health Checks

1. **Backend health**
```bash
curl https://your-backend-domain.com/api/health
```

2. **Frontend access**
```bash
curl https://your-frontend-domain.com
```

### Monitoring

1. **Set up logging**
   - Backend: PM2 logs, or cloud platform logs
   - Frontend: Browser console monitoring

2. **Set up uptime monitoring**
   - UptimeRobot
   - Pingdom
   - StatusCake

3. **Error tracking**
   - Sentry
   - LogRocket
   - Rollbar

### Performance Optimization

1. **Enable gzip compression** (Nginx)
```nginx
gzip on;
gzip_types text/plain text/css application/json application/javascript;
```

2. **Add caching headers**
```nginx
location ~* \.(jpg|jpeg|png|gif|ico|css|js)$ {
    expires 1y;
    add_header Cache-Control "public, immutable";
}
```

3. **CDN setup**
   - Cloudflare
   - AWS CloudFront
   - Fastly

### Security Checklist

- [ ] HTTPS enabled for both frontend and backend
- [ ] Strong SESSION_SECRET set
- [ ] CORS properly configured
- [ ] Rate limiting enabled (if high traffic)
- [ ] Security headers configured
- [ ] Regular dependency updates
- [ ] Firewall rules configured
- [ ] Database backups (when implemented)

### Scaling Considerations

1. **Horizontal scaling**
   - Use Redis for session storage
   - Load balancer for multiple backend instances

2. **Vertical scaling**
   - Increase server resources as needed

3. **Database**
   - When adding database, use managed services
   - MongoDB Atlas, PostgreSQL on RDS, etc.

## Troubleshooting

### Backend won't start
- Check environment variables
- Verify Node.js version
- Check logs: `pm2 logs` or `heroku logs --tail`

### Frontend shows connection error
- Verify REACT_APP_API_URL is correct
- Check CORS settings in backend
- Verify backend is accessible

### Session issues
- Check SESSION_SECRET is set
- Verify cookie settings (secure flag in production)
- Check CORS credentials setting

## Rollback

### PM2
```bash
pm2 stop quiz-backend
git checkout previous-commit
npm install
pm2 restart quiz-backend
```

### Heroku
```bash
heroku releases
heroku rollback v123  # Replace with version number
```

### Vercel/Netlify
Use their dashboard to rollback to previous deployment

## Maintenance

### Update dependencies
```bash
# Backend
cd backend
npm update
npm audit fix

# Frontend
cd frontend
npm update
npm audit fix
```

### Backup (when database is added)
```bash
# MongoDB
mongodump --uri="mongodb://..." --out=/backup/$(date +%Y%m%d)

# PostgreSQL
pg_dump dbname > backup_$(date +%Y%m%d).sql
```

## Support

For deployment issues, check:
1. Server/platform logs
2. Browser console (frontend)
3. Network tab (API calls)
4. Environment variables

For help, open an issue on GitHub.
