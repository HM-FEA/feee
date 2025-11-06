# Deployment Guide - Nexus-Alpha Web

## 🚀 Quick Deploy to Vercel

### Prerequisites

1. Vercel account: https://vercel.com/signup
2. GitHub repository connected to Vercel
3. Backend service deployed (Market Data API)

### Step 1: Install Dependencies

```bash
cd apps/web
npm install
# or
pnpm install
```

### Step 2: Set Environment Variables

Create `.env.local`:

```bash
NEXT_PUBLIC_API_URL=https://your-market-data-api.com
QUANT_ENGINE_URL=https://your-market-data-api.com
```

### Step 3: Test Locally

```bash
npm run dev
# or
pnpm dev
```

Visit http://localhost:3000

### Step 4: Deploy to Vercel

#### Option A: Vercel CLI

```bash
# Install Vercel CLI
npm i -g vercel

# Login
vercel login

# Deploy
cd apps/web
vercel

# Production deployment
vercel --prod
```

#### Option B: GitHub Integration

1. Push code to GitHub
2. Go to https://vercel.com/new
3. Import your repository
4. Configure:
   - **Root Directory**: `apps/web`
   - **Framework Preset**: Next.js
   - **Build Command**: `pnpm build`
   - **Output Directory**: `.next`

5. Add environment variables in Vercel dashboard:
   - `NEXT_PUBLIC_API_URL`
   - `QUANT_ENGINE_URL`

6. Click "Deploy"

---

## 🐳 Backend Deployment (Market Data API)

### Option 1: Railway

```bash
# Install Railway CLI
npm i -g @railway/cli

# Login
railway login

# Navigate to service
cd services/market-data-api

# Initialize
railway init

# Deploy
railway up

# Get URL
railway domain
```

Add the Railway URL to Vercel environment variables.

### Option 2: Render

1. Go to https://render.com
2. Create new Web Service
3. Connect GitHub repository
4. Configure:
   - **Root Directory**: `services/market-data-api`
   - **Build Command**: `pip install -r requirements.txt`
   - **Start Command**: `uvicorn app.main:app --host 0.0.0.0 --port $PORT`

5. Add environment variables (optional)
6. Deploy

### Option 3: Fly.io

```bash
# Install flyctl
curl -L https://fly.io/install.sh | sh

# Login
flyctl auth login

# Navigate to service
cd services/market-data-api

# Launch
flyctl launch

# Deploy
flyctl deploy
```

---

## 📋 Environment Variables

### Frontend (Vercel)

```env
NEXT_PUBLIC_API_URL=https://market-data-api.railway.app
QUANT_ENGINE_URL=https://market-data-api.railway.app
TRADING_AGENTS_URL=https://trading-agents.railway.app
```

### Backend (Railway/Render/Fly)

```env
PORT=8000
HOST=0.0.0.0
CORS_ORIGINS=https://nexus-alpha.vercel.app,http://localhost:3000
LOG_LEVEL=INFO
```

---

## 🔧 Production Checklist

### Frontend

- [ ] Environment variables configured
- [ ] API URLs point to production backend
- [ ] CORS configured correctly
- [ ] Analytics enabled (optional)
- [ ] Error tracking set up (Sentry)
- [ ] Performance monitoring enabled

### Backend

- [ ] Production database configured
- [ ] Redis caching enabled
- [ ] Rate limiting implemented
- [ ] API authentication added
- [ ] CORS origins restricted
- [ ] Logging configured
- [ ] Health check endpoint working

---

## 🧪 Testing Production

```bash
# Test frontend
curl https://nexus-alpha.vercel.app

# Test backend
curl https://market-data-api.railway.app/health

# Test stock API
curl https://market-data-api.railway.app/api/stocks/VNQ
```

---

## 📊 Monitoring

### Frontend (Vercel Analytics)

Vercel provides built-in analytics:
- https://vercel.com/dashboard/analytics

### Backend

Add monitoring service:
- Sentry for error tracking
- DataDog for APM
- LogRocket for session replay

---

## 🔄 CI/CD Pipeline

Vercel automatically deploys on git push:

```yaml
# Automatic deployments
main branch -> Production
develop branch -> Preview
feature/* -> Preview
```

---

## 🚨 Rollback

### Vercel

```bash
# List deployments
vercel list

# Rollback to specific deployment
vercel rollback [deployment-url]
```

Or use Vercel dashboard:
1. Go to Deployments
2. Find previous deployment
3. Click "Promote to Production"

---

## 🔐 Security

### Environment Secrets

Never commit:
- `.env.local`
- `.env.production`
- API keys
- Database credentials

### CORS Configuration

Update `next.config.js`:

```js
async headers() {
  return [
    {
      source: '/api/:path*',
      headers: [
        { key: 'Access-Control-Allow-Origin', value: 'https://nexus-alpha.vercel.app' },
      ],
    },
  ];
}
```

---

## 📱 Custom Domain

### Vercel

1. Go to Project Settings -> Domains
2. Add your domain
3. Update DNS records:
   - A record: `76.76.21.21`
   - CNAME: `cname.vercel-dns.com`

4. Wait for SSL certificate

---

## 🎉 Post-Deployment

1. Test all features
2. Monitor error rates
3. Check performance metrics
4. Set up alerts
5. Document any issues

---

## 📚 Resources

- Vercel Docs: https://vercel.com/docs
- Next.js Deployment: https://nextjs.org/docs/deployment
- Railway Docs: https://docs.railway.app
- Render Docs: https://render.com/docs

---

**Last Updated:** 2025-11-01
