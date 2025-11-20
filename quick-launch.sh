#!/bin/bash

# 🎮 CYBER ESCAPE ROOM - QUICK LAUNCHER
# Purpose: Simple wrapper to start main.js with color output
# Usage: ./quick-launch.sh [optional-port]

set -e

# Color codes
GREEN='\033[0;32m'
CYAN='\033[0;36m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m' # No Color

# Banner
echo ""
echo -e "${CYAN}═════════════════════════════════════════════════════════════${NC}"
echo -e "${CYAN}  🎮  OFFENSIVE SECURITY ESCAPE ROOM - QUICK LAUNCHER  🎮${NC}"
echo -e "${CYAN}═════════════════════════════════════════════════════════════${NC}"
echo ""

# Check if Node.js is installed
if ! command -v node &> /dev/null; then
    echo -e "${RED}✗ Error: Node.js is not installed${NC}"
    echo "  Please install Node.js v14 or higher from https://nodejs.org"
    exit 1
fi

# Display Node version
NODE_VERSION=$(node -v)
echo -e "${GREEN}✓ Node.js ${NODE_VERSION} detected${NC}"

# Check if main.js exists
if [ ! -f "main.js" ]; then
    echo -e "${RED}✗ Error: main.js not found in current directory${NC}"
    echo "  Please ensure you are in the project root directory"
    exit 1
fi

echo -e "${GREEN}✓ main.js found${NC}"

# Optional: Custom port
if [ ! -z "$1" ]; then
    echo -e "${CYAN}ℹ Setting custom port: $1${NC}"
    export PORT=$1
fi

# Make main.js executable
chmod +x main.js

echo ""
echo -e "${CYAN}Starting application...${NC}"
echo ""

# Run main.js
node main.js

# If we reach here, the app was stopped
echo ""
echo -e "${YELLOW}Application stopped${NC}"
echo -e "${CYAN}═════════════════════════════════════════════════════════════${NC}"
