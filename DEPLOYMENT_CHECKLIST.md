# Vercel Deployment Checklist

## ✅ Pre-Deployment Checklist

- [ ] All code committed to Git
- [ ] Repository pushed to GitHub
- [ ] Dependencies installed locally and tested
- [ ] Environment variables documented in `.env.example`
- [ ] Application tested locally
- [ ] Build command works: `cd frontend && npm install && npm run build`

## ✅ Vercel Setup Checklist

- [ ] Vercel account created/logged in
- [ ] Repository imported to Vercel
- [ ] Build settings configured:
  - Framework: Other
  - Build Command: `cd frontend && npm install && npm run build`
  - Output Directory: `frontend/build`
  - Install Command: `npm install`

## ✅ Environment Variables to Set in Vercel

Required variables:
- [ ] `NODE_ENV` = `production`
- [ ] `SESSION_SECRET` = (generate a secure random string)
- [ ] `REACT_APP_API_URL` = `/api`

Post-deployment (update after first deploy):
- [ ] `FRONTEND_URL` = `https://your-actual-domain.vercel.app`

## ✅ Post-Deployment Checklist

- [ ] Application deployed successfully
- [ ] Visit the deployed URL
- [ ] Test quiz functionality:
  - [ ] Start screen loads
  - [ ] Quiz questions load
  - [ ] Timer works
  - [ ] Answers can be submitted
  - [ ] Results screen displays
  - [ ] Restart quiz works
- [ ] Check browser console for errors
- [ ] Check Vercel function logs for backend errors
- [ ] Update `FRONTEND_URL` environment variable with actual URL
- [ ] Redeploy after updating `FRONTEND_URL`

## ✅ Optional Enhancements

- [ ] Custom domain configured
- [ ] Enable Vercel Analytics
- [ ] Set up continuous deployment
- [ ] Configure preview deployments for branches
- [ ] Add status badge to README

## 🚀 Quick Deploy Commands

```bash
# Install Vercel CLI
npm install -g vercel

# Login
vercel login

# Deploy preview
vercel

# Deploy production
vercel --prod
```

## 📝 Notes

- Keep your `SESSION_SECRET` secure and never commit it to Git
- Monitor your first deployment carefully
- Serverless functions may take 1-2 seconds to warm up on first request
- All API routes must start with `/api/` prefix

## 🔗 Useful Links

- Vercel Dashboard: https://vercel.com/dashboard
- Deployment Logs: Check in your project's Deployments tab
- Function Logs: Check in Deployments > Function tab
