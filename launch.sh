#!/bin/bash

# Cyber Escape Room Launcher
# Single command to launch the entire application

set -e

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
CYAN='\033[0;36m'
MAGENTA='\033[0;35m'
NC='\033[0m' # No Color

# ASCII Art Banner
echo -e "${CYAN}"
cat << "EOF"
╔═══════════════════════════════════════════════════════════╗
║                                                           ║
║   ██████╗██╗   ██╗██████╗ ███████╗██████╗                ║
║  ██╔════╝╚██╗ ██╔╝██╔══██╗██╔════╝██╔══██╗               ║
║  ██║      ╚████╔╝ ██████╔╝█████╗  ██████╔╝               ║
║  ██║       ╚██╔╝  ██╔══██╗██╔══╝  ██╔══██╗               ║
║  ╚██████╗   ██║   ██████╔╝███████╗██║  ██║               ║
║   ╚═════╝   ╚═╝   ╚═════╝ ╚══════╝╚═╝  ╚═╝               ║
║                                                           ║
║        ███████╗███████╗ ██████╗ █████╗ ██████╗ ███████╗  ║
║        ██╔════╝██╔════╝██╔════╝██╔══██╗██╔══██╗██╔════╝  ║
║        █████╗  ███████╗██║     ███████║██████╔╝█████╗    ║
║        ██╔══╝  ╚════██║██║     ██╔══██║██╔═══╝ ██╔══╝    ║
║        ███████╗███████║╚██████╗██║  ██║██║     ███████╗  ║
║        ╚══════╝╚══════╝ ╚═════╝╚═╝  ╚═╝╚═╝     ╚══════╝  ║
║                                                           ║
║              OFFENSIVE SECURITY CHALLENGE                ║
║                   Version 2.0.77                         ║
║                                                           ║
╚═══════════════════════════════════════════════════════════╝
EOF
echo -e "${NC}"

# Log file
LOG_FILE="./cyber_escape_room.log"
> "$LOG_FILE"

log_message() {
    echo -e "$1" | tee -a "$LOG_FILE"
}

# Function to check if a command exists
command_exists() {
    command -v "$1" >/dev/null 2>&1
}

# Function to kill processes on exit
cleanup() {
    log_message "${YELLOW}[⚠] Shutting down services...${NC}"
    if [ ! -z "$BACKEND_PID" ]; then
        kill $BACKEND_PID 2>/dev/null || true
        log_message "${GREEN}[✓] Backend stopped${NC}"
    fi
    if [ ! -z "$FRONTEND_PID" ]; then
        kill $FRONTEND_PID 2>/dev/null || true
        log_message "${GREEN}[✓] Frontend stopped${NC}"
    fi
    log_message "${MAGENTA}[◆] Cyber Escape Room terminated${NC}"
    exit 0
}

trap cleanup SIGINT SIGTERM EXIT

# Check prerequisites
log_message "${BLUE}[◆] Checking prerequisites...${NC}"

if ! command_exists node; then
    log_message "${RED}[✗] ERROR: Node.js is not installed${NC}"
    log_message "${YELLOW}[i] Please install Node.js 14+ from https://nodejs.org/${NC}"
    exit 1
fi

if ! command_exists npm; then
    log_message "${RED}[✗] ERROR: npm is not installed${NC}"
    exit 1
fi

NODE_VERSION=$(node --version | cut -d'v' -f2 | cut -d'.' -f1)
if [ "$NODE_VERSION" -lt 14 ]; then
    log_message "${RED}[✗] ERROR: Node.js version must be 14 or higher${NC}"
    log_message "${YELLOW}[i] Current version: $(node --version)${NC}"
    exit 1
fi

log_message "${GREEN}[✓] Node.js $(node --version) detected${NC}"
log_message "${GREEN}[✓] npm $(npm --version) detected${NC}"

# Check if dependencies are installed
log_message "${BLUE}[◆] Checking dependencies...${NC}"

if [ ! -d "backend/node_modules" ]; then
    log_message "${YELLOW}[!] Backend dependencies not found. Installing...${NC}"
    cd backend
    npm install >> "$LOG_FILE" 2>&1
    cd ..
    log_message "${GREEN}[✓] Backend dependencies installed${NC}"
else
    log_message "${GREEN}[✓] Backend dependencies found${NC}"
fi

if [ ! -d "frontend/node_modules" ]; then
    log_message "${YELLOW}[!] Frontend dependencies not found. Installing...${NC}"
    cd frontend
    npm install >> "$LOG_FILE" 2>&1
    cd ..
    log_message "${GREEN}[✓] Frontend dependencies installed${NC}"
else
    log_message "${GREEN}[✓] Frontend dependencies found${NC}"
fi

# Create .env file if it doesn't exist
if [ ! -f "backend/.env" ]; then
    log_message "${YELLOW}[!] Creating backend .env file...${NC}"
    cat > backend/.env << 'ENVEOF'
PORT=5000
NODE_ENV=development
SESSION_SECRET=cyber-escape-room-secret-key-2024
ENVEOF
    log_message "${GREEN}[✓] Backend .env created${NC}"
fi

# Start Backend
log_message "${BLUE}[◆] Starting backend server...${NC}"
cd backend
npm start >> "../$LOG_FILE" 2>&1 &
BACKEND_PID=$!
cd ..
log_message "${GREEN}[✓] Backend server starting (PID: $BACKEND_PID)${NC}"

# Wait for backend to be ready
log_message "${BLUE}[◆] Waiting for backend to initialize...${NC}"
BACKEND_READY=false
for i in {1..30}; do
    if curl -s http://localhost:5000/health > /dev/null 2>&1; then
        BACKEND_READY=true
        break
    fi
    sleep 1
    echo -n "."
done
echo ""

if [ "$BACKEND_READY" = false ]; then
    log_message "${RED}[✗] ERROR: Backend failed to start${NC}"
    log_message "${YELLOW}[i] Check $LOG_FILE for details${NC}"
    exit 1
fi

log_message "${GREEN}[✓] Backend server ready at http://localhost:5000${NC}"

# Start Frontend
log_message "${BLUE}[◆] Starting frontend development server...${NC}"
cd frontend
npm start >> "../$LOG_FILE" 2>&1 &
FRONTEND_PID=$!
cd ..
log_message "${GREEN}[✓] Frontend server starting (PID: $FRONTEND_PID)${NC}"

# Wait for frontend to be ready
log_message "${BLUE}[◆] Waiting for frontend to initialize...${NC}"
FRONTEND_READY=false
for i in {1..60}; do
    if curl -s http://localhost:3000 > /dev/null 2>&1; then
        FRONTEND_READY=true
        break
    fi
    sleep 1
    echo -n "."
done
echo ""

if [ "$FRONTEND_READY" = false ]; then
    log_message "${YELLOW}[!] Frontend is taking longer than expected to start${NC}"
    log_message "${YELLOW}[i] It may still be compiling. Check http://localhost:3000 in a moment${NC}"
fi

# Display success message
echo ""
log_message "${GREEN}╔═══════════════════════════════════════════════════════════╗${NC}"
log_message "${GREEN}║                                                           ║${NC}"
log_message "${GREEN}║           🎮  CYBER ESCAPE ROOM IS RUNNING  🎮            ║${NC}"
log_message "${GREEN}║                                                           ║${NC}"
log_message "${GREEN}╚═══════════════════════════════════════════════════════════╝${NC}"
echo ""
log_message "${CYAN}[◆] Backend:  ${NC}http://localhost:5000"
log_message "${CYAN}[◆] Frontend: ${NC}http://localhost:3000"
echo ""
log_message "${MAGENTA}[◆] Application URLs:${NC}"
log_message "    ${CYAN}➜${NC} Play Game:    http://localhost:3000"
log_message "    ${CYAN}➜${NC} Health Check: http://localhost:5000/health"
echo ""
log_message "${YELLOW}[i] Press ${RED}Ctrl+C${YELLOW} to stop all services${NC}"
log_message "${YELLOW}[i] Logs are being written to: ${LOG_FILE}${NC}"
echo ""
log_message "${GREEN}[✓] All systems operational. Mission ready to begin!${NC}"
echo ""

# Keep the script running and monitor processes
while true; do
    # Check if processes are still running
    if ! kill -0 $BACKEND_PID 2>/dev/null; then
        log_message "${RED}[✗] Backend process died unexpectedly${NC}"
        exit 1
    fi
    
    if ! kill -0 $FRONTEND_PID 2>/dev/null; then
        log_message "${RED}[✗] Frontend process died unexpectedly${NC}"
        exit 1
    fi
    
    sleep 5
done
