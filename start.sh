#!/bin/bash

# Offensive Security Quiz - Development Server Starter
# Starts both backend and frontend servers

set -e

# Colors for output
GREEN='\033[0;32m'
BLUE='\033[0;34m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

echo -e "${BLUE}"
echo "╔══════════════════════════════════════════════════════╗"
echo "║   Offensive Security Quiz - Development Server       ║"
echo "╚══════════════════════════════════════════════════════╝"
echo -e "${NC}"

# Check if node_modules exist
if [ ! -d "backend/node_modules" ] || [ ! -d "frontend/node_modules" ]; then
  echo -e "${YELLOW}Dependencies not installed. Running npm install...${NC}"
  bash setup.sh
fi

# Check if .env exists in backend
if [ ! -f "backend/.env" ]; then
  echo -e "${YELLOW}Creating backend/.env from .env.example...${NC}"
  cp backend/.env.example backend/.env
fi

echo -e "${GREEN}✓ Setup verified${NC}"
echo ""

# Function to handle cleanup on exit
cleanup() {
  echo ""
  echo -e "${YELLOW}Shutting down servers...${NC}"
  pkill -f "node src/server.js" || true
  pkill -f "react-scripts start" || true
  echo -e "${GREEN}✓ Shutdown complete${NC}"
  exit 0
}

# Trap SIGINT and SIGTERM
trap cleanup SIGINT SIGTERM

# Start backend
echo -e "${BLUE}Starting Backend Server...${NC}"
cd backend
npm start &
BACKEND_PID=$!
echo -e "${GREEN}✓ Backend server started (PID: $BACKEND_PID)${NC}"
cd ..

# Wait a moment for backend to start
sleep 2

# Verify backend is running
echo -e "${BLUE}Verifying backend health...${NC}"
if timeout 5 bash -c 'while ! curl -s http://localhost:5000/api/health > /dev/null; do sleep 0.1; done' 2>/dev/null; then
  echo -e "${GREEN}✓ Backend is ready${NC}"
else
  echo -e "${YELLOW}Backend may still be starting, continuing...${NC}"
fi

echo ""

# Start frontend
echo -e "${BLUE}Starting Frontend Server...${NC}"
cd frontend
npm start &
FRONTEND_PID=$!
echo -e "${GREEN}✓ Frontend server started (PID: $FRONTEND_PID)${NC}"
cd ..

echo ""
echo -e "${GREEN}════════════════════════════════════════════════════════${NC}"
echo -e "${GREEN}✓ All servers running!${NC}"
echo ""
echo -e "  Frontend: ${BLUE}http://localhost:3000${NC}"
echo -e "  Backend:  ${BLUE}http://localhost:5000${NC}"
echo ""
echo -e "${YELLOW}Press Ctrl+C to stop all servers${NC}"
echo -e "${GREEN}════════════════════════════════════════════════════════${NC}"
echo ""

# Wait for both processes
wait
