#!/bin/bash

# Quick Setup Script for Cyber Escape Room
# Run this first if you encounter any issues

set -e

echo "🚀 Cyber Escape Room - Quick Setup"
echo "===================================="
echo ""

# Make launch script executable
echo "Making launch.sh executable..."
chmod +x launch.sh
echo "✅ launch.sh is now executable"
echo ""

# Install root dependencies (if package.json exists)
if [ -f "package.json" ]; then
    echo "Installing root dependencies..."
    npm install
    echo "✅ Root dependencies installed"
    echo ""
fi

# Install backend dependencies
if [ -d "backend" ]; then
    echo "Installing backend dependencies..."
    cd backend
    npm install
    cd ..
    echo "✅ Backend dependencies installed"
    echo ""
fi

# Install frontend dependencies
if [ -d "frontend" ]; then
    echo "Installing frontend dependencies..."
    cd frontend
    npm install
    cd ..
    echo "✅ Frontend dependencies installed"
    echo ""
fi

# Create .env file for backend if it doesn't exist
if [ ! -f "backend/.env" ]; then
    echo "Creating backend .env file..."
    cat > backend/.env << 'EOF'
PORT=5000
NODE_ENV=development
SESSION_SECRET=cyber-escape-room-secret-key-2024
EOF
    echo "✅ Backend .env created"
    echo ""
fi

echo "✅ Setup Complete!"
echo ""
echo "Now you can run:"
echo "  ./launch.sh"
echo ""
echo "This will start both backend and frontend servers."
echo "Then open: http://localhost:3000"
echo ""
