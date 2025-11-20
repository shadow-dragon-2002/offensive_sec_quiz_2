#!/bin/bash

# Offensive Security Quiz - Health Check & Validation Script

echo "🔍 Offensive Security Quiz - Health Check & Validation"
echo "======================================================"
echo ""

# Colors
GREEN='\033[0;32m'
RED='\033[0;31m'
YELLOW='\033[1;33m'
NC='\033[0m'

ERRORS=0
WARNINGS=0

# Check function
check_item() {
  local label=$1
  local condition=$2
  
  if eval "$condition" > /dev/null 2>&1; then
    echo -e "${GREEN}✓${NC} $label"
  else
    echo -e "${RED}✗${NC} $label"
    ((ERRORS++))
  fi
}

warn_item() {
  local label=$1
  local condition=$2
  
  if ! eval "$condition" > /dev/null 2>&1; then
    echo -e "${YELLOW}!${NC} $label (Warning)"
    ((WARNINGS++))
  fi
}

echo "📋 System Requirements:"
check_item "Node.js installed" "command -v node"
check_item "npm installed" "command -v npm"
check_item "Git installed" "command -v git"

echo ""
echo "📁 Project Structure:"
check_item "Backend directory exists" "[ -d 'backend' ]"
check_item "Frontend directory exists" "[ -d 'frontend' ]"
check_item "Backend package.json" "[ -f 'backend/package.json' ]"
check_item "Frontend package.json" "[ -f 'frontend/package.json' ]"

echo ""
echo "🔧 Backend Configuration:"
check_item "Backend .env exists" "[ -f 'backend/.env' ]"
check_item "Backend src/server.js exists" "[ -f 'backend/src/server.js' ]"
check_item "Backend src/routes/quiz.js exists" "[ -f 'backend/src/routes/quiz.js' ]"
check_item "Backend src/models/Session.js exists" "[ -f 'backend/src/models/Session.js' ]"
check_item "Backend src/data/questions.js exists" "[ -f 'backend/src/data/questions.js' ]"

echo ""
echo "🎨 Frontend Configuration:"
check_item "Frontend public/index.html exists" "[ -f 'frontend/public/index.html' ]"
check_item "Frontend src/App.js exists" "[ -f 'frontend/src/App.js' ]"
check_item "Frontend src/index.js exists" "[ -f 'frontend/src/index.js' ]"
check_item "Frontend src/utils/api.js exists" "[ -f 'frontend/src/utils/api.js' ]"

echo ""
echo "📦 Dependencies:"
check_item "Backend node_modules exists" "[ -d 'backend/node_modules' ]"
check_item "Frontend node_modules exists" "[ -d 'frontend/node_modules' ]"

echo ""
echo "🎯 Components:"
check_item "QuizScreen.js exists" "[ -f 'frontend/src/components/QuizScreen.js' ]"
check_item "ResultScreen.js exists" "[ -f 'frontend/src/components/ResultScreen.js' ]"
check_item "StartScreen.js exists" "[ -f 'frontend/src/components/StartScreen.js' ]"
check_item "Timer.js exists" "[ -f 'frontend/src/components/Timer.js' ]"

echo ""
echo "🎨 Styling:"
check_item "App.css exists" "[ -f 'frontend/src/App.css' ]"
check_item "QuizScreen.css exists" "[ -f 'frontend/src/components/QuizScreen.css' ]"
check_item "ResultScreen.css exists" "[ -f 'frontend/src/components/ResultScreen.css' ]"
check_item "StartScreen.css exists" "[ -f 'frontend/src/components/StartScreen.css' ]"
check_item "Timer.css exists" "[ -f 'frontend/src/components/Timer.css' ]"

echo ""
echo "🚀 Server Status:"
warn_item "Backend running on port 5000" "curl -s http://localhost:5000/api/health > /dev/null"
warn_item "Frontend running on port 3000" "curl -s http://localhost:3000 > /dev/null"

echo ""
echo "======================================================"
if [ $ERRORS -eq 0 ]; then
  echo -e "${GREEN}✓ All checks passed!${NC}"
else
  echo -e "${RED}✗ $ERRORS error(s) found${NC}"
fi

if [ $WARNINGS -gt 0 ]; then
  echo -e "${YELLOW}! $WARNINGS warning(s) - servers may not be running${NC}"
fi

echo ""
if [ $ERRORS -gt 0 ]; then
  echo "🔧 Recommended actions:"
  [ ! -d 'backend/node_modules' ] && echo "  1. Run: cd backend && npm install"
  [ ! -d 'frontend/node_modules' ] && echo "  2. Run: cd frontend && npm install"
  [ ! -f 'backend/.env' ] && echo "  3. Run: cp backend/.env.example backend/.env"
  exit 1
else
  echo "✅ Ready to start development!"
  echo "Run: bash start.sh"
  exit 0
fi
