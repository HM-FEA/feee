#!/bin/bash

# Nexus-Alpha Development Runner
# This script starts both frontend and backend services

set -e

echo "🚀 Starting Nexus-Alpha Development Environment..."
echo ""

# Colors
GREEN='\033[0;32m'
BLUE='\033[0;34m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Check if running from project root
if [ ! -d "apps/web" ]; then
    echo "❌ Error: Please run this script from the project root directory"
    exit 1
fi

# Function to start backend
start_backend() {
    echo -e "${BLUE}Starting Market Data API (Backend)...${NC}"
    cd services/market-data-api

    # Check if venv exists
    if [ ! -d "venv" ]; then
        echo -e "${YELLOW}Creating virtual environment...${NC}"
        python3 -m venv venv
        source venv/bin/activate
        pip install -r requirements.txt
    else
        source venv/bin/activate
    fi

    # Start backend in background
    echo -e "${GREEN}✓ Backend starting on http://localhost:8000${NC}"
    uvicorn app.main:app --reload --port 8000 &
    BACKEND_PID=$!
    cd ../..
}

# Function to start frontend
start_frontend() {
    echo -e "${BLUE}Starting Next.js Frontend...${NC}"
    cd apps/web

    # Check if node_modules exists
    if [ ! -d "node_modules" ]; then
        echo -e "${YELLOW}Installing dependencies...${NC}"
        pnpm install
    fi

    # Create .env.local if it doesn't exist
    if [ ! -f ".env.local" ]; then
        echo -e "${YELLOW}Creating .env.local...${NC}"
        cat > .env.local << EOF
NEXT_PUBLIC_API_URL=http://localhost:8000
QUANT_ENGINE_URL=http://localhost:8000
EOF
    fi

    # Start frontend
    echo -e "${GREEN}✓ Frontend starting on http://localhost:3000${NC}"
    pnpm dev &
    FRONTEND_PID=$!
    cd ../..
}

# Cleanup function
cleanup() {
    echo ""
    echo -e "${YELLOW}Shutting down services...${NC}"

    if [ ! -z "$BACKEND_PID" ]; then
        kill $BACKEND_PID 2>/dev/null || true
    fi

    if [ ! -z "$FRONTEND_PID" ]; then
        kill $FRONTEND_PID 2>/dev/null || true
    fi

    # Kill any remaining processes
    pkill -f "uvicorn app.main:app" 2>/dev/null || true
    pkill -f "next dev" 2>/dev/null || true

    echo -e "${GREEN}✓ All services stopped${NC}"
    exit 0
}

# Trap Ctrl+C
trap cleanup INT TERM

# Start services
start_backend
sleep 2
start_frontend

echo ""
echo -e "${GREEN}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
echo -e "${GREEN}✓ Nexus-Alpha is running!${NC}"
echo -e "${GREEN}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
echo ""
echo -e "  Frontend:  ${BLUE}http://localhost:3000${NC}"
echo -e "  Backend:   ${BLUE}http://localhost:8000${NC}"
echo -e "  API Docs:  ${BLUE}http://localhost:8000/docs${NC}"
echo ""
echo -e "${YELLOW}Press Ctrl+C to stop all services${NC}"
echo ""

# Wait for processes
wait
