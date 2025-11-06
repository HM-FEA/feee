# 🚀 Quick Start Guide - Nexus-Alpha

**Get the Real Estate Stocks simulation running in 5 minutes**

---

## Prerequisites

- Node.js 18+ (for frontend)
- Python 3.11+ (for backend)
- pnpm or npm

---

## Step 1: Clone and Install

```bash
# Clone repository
cd /Users/jeonhyeonmin/Simulation/nexus-alpha

# Install frontend dependencies
cd apps/web
pnpm install

# Install backend dependencies (in another terminal)
cd ../../services/market-data-api
python -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate
pip install -r requirements.txt
```

---

## Step 2: Start Backend (Market Data API)

```bash
cd services/market-data-api
source venv/bin/activate

# Run the server
uvicorn app.main:app --reload --port 8000
```

You should see:
```
INFO:     Uvicorn running on http://127.0.0.1:8000
INFO:     Application startup complete.
```

Test it:
```bash
curl http://localhost:8000/health
# Should return: {"status":"healthy"}

# Test stock API
curl http://localhost:8000/api/stocks/VNQ
```

---

## Step 3: Start Frontend (Next.js)

In a new terminal:

```bash
cd apps/web

# Create environment file
cp .env.example .env.local

# Edit .env.local to point to local backend
echo "NEXT_PUBLIC_API_URL=http://localhost:8000" > .env.local
echo "QUANT_ENGINE_URL=http://localhost:8000" >> .env.local

# Start development server
pnpm dev
```

You should see:
```
- Local:        http://localhost:3000
- Ready in 2.5s
```

---

## Step 4: Open the App

1. Open browser: http://localhost:3000
2. Click on "Real Estate" sector
3. You should see:
   - Stock charts with real-time data
   - Interest rate slider
   - News feed at the bottom

---

## Step 5: Run a Simulation

1. Move the "Interest Rate" slider
2. Adjust "Time Horizon"
3. Click "Run Simulation"
4. Watch the charts update!

---

## Troubleshooting

### Port Already in Use

```bash
# Kill process on port 8000
lsof -ti:8000 | xargs kill -9

# Kill process on port 3000
lsof -ti:3000 | xargs kill -9
```

### Backend Not Responding

```bash
# Check if backend is running
curl http://localhost:8000/health

# Restart backend
cd services/market-data-api
uvicorn app.main:app --reload --port 8000
```

### Frontend Build Errors

```bash
# Clear Next.js cache
cd apps/web
rm -rf .next
pnpm dev
```

### Missing Dependencies

```bash
# Frontend
cd apps/web
pnpm install

# Backend
cd services/market-data-api
pip install -r requirements.txt
```

---

## What's Next?

1. **Explore the codebase:**
   - Frontend: `apps/web/src/`
   - Backend: `services/market-data-api/app/`

2. **Read the docs:**
   - [Architecture](./docs/ARCHITECTURE.md)
   - [Development Process](./DEVELOPMENT_PROCESS.md)
   - [Core Layout System](./docs/implementation/CORE_LAYOUT_SYSTEM.md)

3. **Add features:**
   - Integrate TradingAgents for analyst reports
   - Add more stock tickers
   - Implement caching with Redis

4. **Deploy:**
   - [Deployment Guide](./apps/web/DEPLOYMENT.md)

---

## Project Structure

```
nexus-alpha/
├── apps/
│   └── web/                    # Next.js frontend
│       ├── src/
│       │   ├── app/            # App Router pages
│       │   ├── components/     # React components
│       │   │   ├── core/       # Reusable layout
│       │   │   └── sectors/    # Sector-specific
│       │   └── lib/            # Utilities
│       └── package.json
│
├── services/
│   └── market-data-api/        # Python FastAPI backend
│       ├── app/
│       │   └── main.py         # Main API
│       └── requirements.txt
│
└── docs/                       # Documentation
```

---

## Available Services

### Frontend (Port 3000)
- http://localhost:3000 - Main app
- http://localhost:3000/sectors/real-estate - Real Estate page

### Backend (Port 8000)
- http://localhost:8000 - API root
- http://localhost:8000/docs - Swagger UI
- http://localhost:8000/api/stocks/{ticker} - Get stock data

---

## Key Technologies

- **Frontend:** Next.js 14, React, TypeScript, Tailwind CSS
- **Backend:** FastAPI, yfinance, Python 3.11
- **Charts:** Recharts, D3.js
- **State:** Zustand
- **Deployment:** Vercel (frontend), Railway (backend)

---

## Next Steps for Development

1. ✅ Core layout implemented
2. ✅ Real estate stocks with Yahoo Finance
3. 🏗️ Add TradingAgents integration
4. 🏗️ Implement analyst report display
5. 📅 Add more sectors (Manufacturing, Crypto)

---

## Getting Help

- Check [GETTING_STARTED.md](./GETTING_STARTED.md) for detailed setup
- Read [DEVELOPMENT_BOARD.md](./DEVELOPMENT_BOARD.md) for current tasks
- Review [ARCHITECTURE.md](./docs/ARCHITECTURE.md) for system design

---

**Happy Coding! 🚀**

Last Updated: 2025-11-01
