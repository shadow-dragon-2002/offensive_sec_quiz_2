#!/bin/bash

# Offensive Security Quiz - Complete Setup Script
# This script installs all dependencies and validates the setup

echo "🚀 Starting Offensive Security Quiz Setup..."
echo ""

# Colors for output
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m' # No Color

# Function to print colored output
print_status() {
  echo -e "${GREEN}[✓]${NC} $1"
}

print_error() {
  echo -e "${RED}[✗]${NC} $1"
}

print_info() {
  echo -e "${YELLOW}[i]${NC} $1"
}

# Check Node.js installation
print_info "Checking Node.js and npm installation..."
if ! command -v node &> /dev/null; then
  print_error "Node.js is not installed. Please install Node.js 14 or higher."
  exit 1
fi
print_status "Node.js version: $(node --version)"
print_status "npm version: $(npm --version)"
echo ""

# Backend setup
print_info "Setting up backend..."
cd backend

if [ ! -f ".env" ]; then
  print_info "Creating .env file from .env.example..."
  cp .env.example .env
  print_status ".env file created"
fi

print_info "Installing backend dependencies..."
npm install
if [ $? -eq 0 ]; then
  print_status "Backend dependencies installed successfully"
else
  print_error "Failed to install backend dependencies"
  exit 1
fi
echo ""

# Frontend setup
print_info "Setting up frontend..."
cd ../frontend

print_info "Installing frontend dependencies..."
npm install
if [ $? -eq 0 ]; then
  print_status "Frontend dependencies installed successfully"
else
  print_error "Failed to install frontend dependencies"
  exit 1
fi
echo ""

# Validate structure
print_info "Validating project structure..."
cd ..

# Check backend files
backend_files=("backend/package.json" "backend/src/server.js" "backend/src/routes/quiz.js" "backend/src/models/Session.js" "backend/src/data/questions.js" "backend/.env")
for file in "${backend_files[@]}"; do
  if [ -f "$file" ]; then
    print_status "$file exists"
  else
    print_error "$file is missing"
  fi
done
echo ""

# Check frontend files
frontend_files=("frontend/package.json" "frontend/src/App.js" "frontend/src/index.js" "frontend/public/index.html" "frontend/src/components/QuizScreen.js" "frontend/src/components/ResultScreen.js" "frontend/src/components/StartScreen.js" "frontend/src/components/Timer.js")
for file in "${frontend_files[@]}"; do
  if [ -f "$file" ]; then
    print_status "$file exists"
  else
    print_error "$file is missing"
  fi
done
echo ""

print_status "Setup complete! 🎉"
echo ""
echo "📝 Next steps:"
echo "1. Start the backend server: cd backend && npm start"
echo "2. In another terminal, start the frontend: cd frontend && npm start"
echo "3. Open your browser and navigate to http://localhost:3000"
echo ""
echo "⚙️ Environment variables:"
grep -E "^[A-Z_]+" backend/.env | while read line; do
  echo "   $line"
done
