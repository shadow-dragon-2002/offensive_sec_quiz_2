# Vercel Deployment Guide

This guide will help you deploy your Offensive Security Quiz application to Vercel.

## Prerequisites

- A GitHub account
- A Vercel account (sign up at https://vercel.com)
- Git installed on your machine
- Node.js and npm/pnpm installed

## Deployment Steps

### Option 1: Deploy via Vercel Dashboard (Recommended for First-Time)

1. **Push your code to GitHub**
   ```bash
   git init
   git add .
   git commit -m "Prepare for Vercel deployment"
   git branch -M main
   git remote add origin https://github.com/YOUR_USERNAME/YOUR_REPO_NAME.git
   git push -u origin main
   ```

2. **Connect to Vercel**
   - Go to https://vercel.com/new
   - Sign in with your GitHub account
   - Click "Import Project"
   - Select your repository

3. **Configure Build Settings**
   - **Framework Preset**: Other
   - **Root Directory**: `./` (leave as default)
   - **Build Command**: `cd frontend && npm install && npm run build`
   - **Output Directory**: `frontend/build`
   - **Install Command**: `npm install`

4. **Set Environment Variables**
   Click "Environment Variables" and add:
   - `NODE_ENV` = `production`
   - `SESSION_SECRET` = `[generate a secure random string]`
   - `REACT_APP_API_URL` = `/api`
   - `FRONTEND_URL` = `https://your-project-name.vercel.app` (update after first deploy)

5. **Deploy**
   - Click "Deploy"
   - Wait for deployment to complete (usually 2-5 minutes)
   - Your app will be live at `https://your-project-name.vercel.app`

6. **Update FRONTEND_URL**
   - After first deployment, go to Settings > Environment Variables
   - Update `FRONTEND_URL` with your actual Vercel URL
   - Redeploy (Deployments > ... > Redeploy)

### Option 2: Deploy via Vercel CLI

1. **Install Vercel CLI**
   ```bash
   npm install -g vercel
   ```

2. **Login to Vercel**
   ```bash
   vercel login
   ```

3. **Deploy**
   ```bash
   vercel
   ```
   - Follow the prompts
   - Link to existing project or create new one
   - Confirm settings

4. **Set Environment Variables**
   ```bash
   vercel env add NODE_ENV production
   vercel env add SESSION_SECRET <your-secret>
   vercel env add REACT_APP_API_URL /api
   ```

5. **Deploy to Production**
   ```bash
   vercel --prod
   ```

## Configuration Files Created

- **vercel.json**: Main Vercel configuration
- **.vercelignore**: Files to exclude from deployment
- **api/index.js**: Serverless function entry point for backend
- **.env.example**: Template for environment variables

## How It Works

1. **Frontend**: React app is built as static files and served from CDN
2. **Backend**: Express server runs as serverless functions under `/api/*` routes
3. **Routing**: All API requests go to `/api/*`, frontend handles all other routes
4. **Environment**: Production environment variables are managed in Vercel dashboard

## Important Notes

- **Sessions**: In serverless environment, sessions are stateless by default
- **Database**: If you add a database later, use Vercel KV, Postgres, or external service
- **Cold Starts**: First request may be slow (serverless function warming up)
- **Logs**: View logs in Vercel dashboard under Deployments > Function Logs

## Post-Deployment

1. **Test your application**
   - Visit your Vercel URL
   - Test all quiz functionality
   - Check browser console for errors

2. **Monitor performance**
   - Use Vercel Analytics (Settings > Analytics)
   - Monitor function execution time
   - Check error rates

3. **Custom Domain (Optional)**
   - Go to Settings > Domains
   - Add your custom domain
   - Configure DNS records as instructed

## Troubleshooting

### Build Fails
- Check build logs in Vercel dashboard
- Ensure all dependencies are in package.json
- Verify Node.js version compatibility

### API Routes Don't Work
- Check environment variables are set correctly
- Verify CORS settings in backend/src/server.js
- Check function logs for errors

### Frontend Loads But Can't Connect to Backend
- Verify REACT_APP_API_URL is set to `/api`
- Check browser network tab for failed requests
- Ensure API routes start with `/api`

## Updating Your Deployment

Every push to your main branch will trigger automatic deployment:
```bash
git add .
git commit -m "Your update message"
git push origin main
```

Or manually redeploy from Vercel dashboard.

## Resources

- Vercel Documentation: https://vercel.com/docs
- Vercel CLI Reference: https://vercel.com/docs/cli
- Serverless Functions: https://vercel.com/docs/functions

## Support

For issues with deployment, check:
1. Vercel deployment logs
2. Function logs in Vercel dashboard
3. Browser console for frontend errors
