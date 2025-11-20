#!/bin/bash

##############################################################################
# CYBER ESCAPE ROOM - UNIFIED LAUNCHER
# Single entry point for the entire application
# Handles startup, health checks, error recovery, and graceful shutdown
##############################################################################

set -o pipefail

# ============ CONFIGURATION ============
export SCRIPT_VERSION="2.0.77"
export SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
export LOG_FILE="${SCRIPT_DIR}/cyber_escape_room.log"
export BACKEND_PORT="${BACKEND_PORT:-5000}"
export FRONTEND_PORT="${FRONTEND_PORT:-3000}"
export NODE_ENV="${NODE_ENV:-development}"
export START_TIME=$(date +%s)
export PIDS_TO_KILL=()

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
CYAN='\033[0;36m'
MAGENTA='\033[0;35m'
GRAY='\033[0;37m'
NC='\033[0m'

# ============ UTILITY FUNCTIONS ============

log_message() {
    local level="$1"
    local message="$2"
    local timestamp=$(date '+%Y-%m-%d %H:%M:%S')
    local color=""
    
    case "$level" in
        "ERROR")   color="$RED"; prefix="❌ ERROR" ;;
        "SUCCESS") color="$GREEN"; prefix="✓ SUCCESS" ;;
        "WARNING") color="$YELLOW"; prefix="⚠ WARNING" ;;
        "INFO")    color="$BLUE"; prefix="ℹ INFO" ;;
        "DEBUG")   color="$GRAY"; prefix="🔍 DEBUG" ;;
        *)         color="$CYAN"; prefix="◆ $level" ;;
    esac
    
    echo -e "${color}[${timestamp}] ${prefix}: ${message}${NC}" | tee -a "$LOG_FILE"
}

log_section() {
    echo "" | tee -a "$LOG_FILE"
    echo -e "${CYAN}════════════════════════════════════════${NC}" | tee -a "$LOG_FILE"
    echo -e "${CYAN}  $1${NC}" | tee -a "$LOG_FILE"
    echo -e "${CYAN}════════════════════════════════════════${NC}" | tee -a "$LOG_FILE"
    echo "" | tee -a "$LOG_FILE"
}

command_exists() {
    command -v "$1" >/dev/null 2>&1
}

check_port() {
    local port=$1
    if command_exists lsof; then
        lsof -Pi :$port -sTCP:LISTEN -t >/dev/null 2>&1
        return $?
    elif command_exists netstat; then
        netstat -tuln 2>/dev/null | grep -q ":$port "
        return $?
    else
        return 2 # Unable to check
    fi
}

kill_process_on_port() {
    local port=$1
    if command_exists lsof; then
        local pid=$(lsof -ti:$port 2>/dev/null)
        if [ ! -z "$pid" ]; then
            kill -9 $pid 2>/dev/null || true
            log_message "INFO" "Killed process on port $port (PID: $pid)"
            return 0
        fi
    fi
    return 1
}

wait_for_service() {
    local url="$1"
    local max_attempts="${2:-30}"
    local attempt=1
    
    while [ $attempt -le $max_attempts ]; do
        if curl -s --connect-timeout 2 "$url" >/dev/null 2>&1; then
            return 0
        fi
        echo -n "."
        sleep 1
        ((attempt++))
    done
    
    echo ""
    return 1
}

cleanup() {
    local exit_code=$?
    
    log_section "Shutting Down"
    
    # Kill all tracked processes
    for pid in "${PIDS_TO_KILL[@]}"; do
        if kill -0 $pid 2>/dev/null; then
            log_message "INFO" "Terminating process $pid..."
            kill -TERM $pid 2>/dev/null || true
            sleep 1
            kill -9 $pid 2>/dev/null || true
        fi
    done
    
    log_message "SUCCESS" "Cyber Escape Room terminated gracefully"
    log_message "INFO" "Logs saved to: $LOG_FILE"
    
    exit $exit_code
}

handle_error() {
    local line_number=$1
    local error_code=$2
    log_message "ERROR" "Script failed at line $line_number with exit code $error_code"
    log_message "ERROR" "Run: tail -f $LOG_FILE for details"
    cleanup
}

# ============ TRAP HANDLERS ============
trap cleanup SIGINT SIGTERM EXIT
trap 'handle_error ${LINENO} $?' ERR

# ============ BANNER ============
display_banner() {
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
}

# ============ INITIALIZATION ============
initialize() {
    log_section "System Initialization"
    
    # Clear old log file
    > "$LOG_FILE"
    log_message "INFO" "Cyber Escape Room Launcher v${SCRIPT_VERSION}"
    log_message "INFO" "Working directory: $SCRIPT_DIR"
    log_message "INFO" "Node environment: $NODE_ENV"
    log_message "INFO" "Backend port: $BACKEND_PORT"
    log_message "INFO" "Frontend port: $FRONTEND_PORT"
}

# ============ PREREQUISITES CHECK ============
check_prerequisites() {
    log_section "Checking Prerequisites"
    
    # Check Node.js
    if ! command_exists node; then
        log_message "ERROR" "Node.js is not installed"
        log_message "INFO" "Download from: https://nodejs.org (v14+)"
        exit 1
    fi
    
    local node_version=$(node -v 2>/dev/null)
    log_message "SUCCESS" "Node.js $node_version detected"
    
    # Check npm
    if ! command_exists npm; then
        log_message "ERROR" "npm is not installed"
        exit 1
    fi
    
    local npm_version=$(npm -v 2>/dev/null)
    log_message "SUCCESS" "npm v$npm_version detected"
    
    # Check curl
    if ! command_exists curl; then
        log_message "WARNING" "curl not found, health checks may be limited"
    fi
}

# ============ DIRECTORY VALIDATION ============
validate_directories() {
    log_section "Validating Project Structure"
    
    local required_dirs=("backend" "frontend")
    
    for dir in "${required_dirs[@]}"; do
        if [ ! -d "$SCRIPT_DIR/$dir" ]; then
            log_message "ERROR" "Missing directory: $dir"
            exit 1
        fi
        log_message "SUCCESS" "✓ $dir directory found"
    done
    
    # Check for key files
    if [ ! -f "$SCRIPT_DIR/backend/package.json" ]; then
        log_message "ERROR" "Missing: backend/package.json"
        exit 1
    fi
    
    if [ ! -f "$SCRIPT_DIR/frontend/package.json" ]; then
        log_message "ERROR" "Missing: frontend/package.json"
        exit 1
    fi
    
    log_message "SUCCESS" "All required directories and files present"
}

# ============ DEPENDENCIES INSTALLATION ============
install_dependencies() {
    log_section "Installing Dependencies"
    
    # Backend dependencies
    if [ ! -d "$SCRIPT_DIR/backend/node_modules" ]; then
        log_message "INFO" "Installing backend dependencies (this may take 1-2 minutes)..."
        cd "$SCRIPT_DIR/backend"
        if npm install >> "$LOG_FILE" 2>&1; then
            log_message "SUCCESS" "Backend dependencies installed"
        else
            log_message "ERROR" "Failed to install backend dependencies"
            cat "$LOG_FILE" | tail -20
            exit 1
        fi
        cd "$SCRIPT_DIR"
    else
        log_message "INFO" "Backend dependencies already installed"
    fi
    
    # Frontend dependencies
    if [ ! -d "$SCRIPT_DIR/frontend/node_modules" ]; then
        log_message "INFO" "Installing frontend dependencies (this may take 2-3 minutes)..."
        cd "$SCRIPT_DIR/frontend"
        if npm install >> "$LOG_FILE" 2>&1; then
            log_message "SUCCESS" "Frontend dependencies installed"
        else
            log_message "ERROR" "Failed to install frontend dependencies"
            cat "$LOG_FILE" | tail -20
            exit 1
        fi
        cd "$SCRIPT_DIR"
    else
        log_message "INFO" "Frontend dependencies already installed"
    fi
}

# ============ CONFIGURATION SETUP ============
setup_configuration() {
    log_section "Setting Up Configuration"
    
    # Create .env for backend if needed
    if [ ! -f "$SCRIPT_DIR/backend/.env" ]; then
        log_message "INFO" "Creating backend .env file..."
        cat > "$SCRIPT_DIR/backend/.env" << EOF
PORT=$BACKEND_PORT
NODE_ENV=$NODE_ENV
SESSION_SECRET=cyber-escape-room-secret-key-$(date +%s)
FRONTEND_URL=http://localhost:$FRONTEND_PORT
CORS_ORIGIN=http://localhost:$FRONTEND_PORT
LOG_LEVEL=debug
EOF
        log_message "SUCCESS" ".env file created"
    else
        log_message "INFO" ".env file already exists"
    fi
}

# ============ PORT AVAILABILITY CHECK ============
check_ports() {
    log_section "Checking Port Availability"
    
    # Check backend port
    if check_port $BACKEND_PORT; then
        log_message "WARNING" "Port $BACKEND_PORT is already in use"
        if [ "$1" == "kill" ]; then
            log_message "INFO" "Attempting to free port $BACKEND_PORT..."
            if kill_process_on_port $BACKEND_PORT; then
                sleep 2
                log_message "SUCCESS" "Port $BACKEND_PORT freed"
            else
                log_message "ERROR" "Could not free port $BACKEND_PORT"
                exit 1
            fi
        else
            log_message "ERROR" "Port $BACKEND_PORT already in use. Use: lsof -ti:$BACKEND_PORT | xargs kill -9"
            exit 1
        fi
    else
        log_message "SUCCESS" "Port $BACKEND_PORT is available"
    fi
    
    # Check frontend port
    if check_port $FRONTEND_PORT; then
        log_message "WARNING" "Port $FRONTEND_PORT is already in use"
        if [ "$1" == "kill" ]; then
            log_message "INFO" "Attempting to free port $FRONTEND_PORT..."
            if kill_process_on_port $FRONTEND_PORT; then
                sleep 2
                log_message "SUCCESS" "Port $FRONTEND_PORT freed"
            else
                log_message "ERROR" "Could not free port $FRONTEND_PORT"
                exit 1
            fi
        else
            log_message "ERROR" "Port $FRONTEND_PORT already in use. Use: lsof -ti:$FRONTEND_PORT | xargs kill -9"
            exit 1
        fi
    else
        log_message "SUCCESS" "Port $FRONTEND_PORT is available"
    fi
}

# ============ START BACKEND ============
start_backend() {
    log_section "Starting Backend Server"
    
    log_message "INFO" "Starting backend on port $BACKEND_PORT..."
    
    cd "$SCRIPT_DIR/backend"
    
    # Start backend in background
    npm start >> "$LOG_FILE" 2>&1 &
    local backend_pid=$!
    PIDS_TO_KILL+=($backend_pid)
    
    log_message "INFO" "Backend process started (PID: $backend_pid)"
    
    # Wait for backend to be ready
    log_message "INFO" "Waiting for backend to respond..."
    if wait_for_service "http://localhost:$BACKEND_PORT/api/health" 30; then
        log_message "SUCCESS" "Backend server is ready"
        return 0
    else
        log_message "ERROR" "Backend failed to start within 30 seconds"
        log_message "DEBUG" "Last 20 lines of log:"
        tail -20 "$LOG_FILE" | tee -a "$LOG_FILE"
        return 1
    fi
}

# ============ START FRONTEND ============
start_frontend() {
    log_section "Starting Frontend Server"
    
    log_message "INFO" "Starting frontend on port $FRONTEND_PORT..."
    
    cd "$SCRIPT_DIR/frontend"
    
    # Set environment variable for React
    export REACT_APP_API_URL="http://localhost:$BACKEND_PORT/api"
    export BROWSER=none # Don't auto-open browser in development
    
    # Start frontend in background
    npm start >> "$LOG_FILE" 2>&1 &
    local frontend_pid=$!
    PIDS_TO_KILL+=($frontend_pid)
    
    log_message "INFO" "Frontend process started (PID: $frontend_pid)"
    
    # Wait for frontend to be ready
    log_message "INFO" "Waiting for frontend to respond..."
    if wait_for_service "http://localhost:$FRONTEND_PORT" 60; then
        log_message "SUCCESS" "Frontend server is ready"
        return 0
    else
        log_message "WARNING" "Frontend may still be compiling (this is normal on first run)"
        log_message "INFO" "You can manually check: http://localhost:$FRONTEND_PORT"
        return 0  # Don't fail, frontend takes longer to build
    fi
}

# ============ HEALTH CHECK ============
health_check() {
    log_section "System Health Check"
    
    # Check backend
    if curl -s --connect-timeout 2 "http://localhost:$BACKEND_PORT/api/health" >/dev/null 2>&1; then
        log_message "SUCCESS" "Backend health: ✓ OK"
    else
        log_message "ERROR" "Backend health: ✗ FAILED"
        return 1
    fi
    
    # Check frontend
    if curl -s --connect-timeout 2 "http://localhost:$FRONTEND_PORT" >/dev/null 2>&1; then
        log_message "SUCCESS" "Frontend health: ✓ OK"
    else
        log_message "WARNING" "Frontend health: ⏳ Still loading (this is normal)"
    fi
    
    return 0
}

# ============ DISPLAY SUCCESS MESSAGE ============
display_success() {
    log_section "Cyber Escape Room Ready"
    
    echo -e "${GREEN}"
    cat << "EOF"
╔═══════════════════════════════════════════════════════════╗
║                                                           ║
║           🎮  CYBER ESCAPE ROOM IS RUNNING  🎮            ║
║                                                           ║
║               🌐 APPLICATION READY TO ACCESS              ║
║                                                           ║
╚═══════════════════════════════════════════════════════════╝
EOF
    echo -e "${NC}"
    
    echo ""
    log_message "SUCCESS" "All services started successfully!"
    echo ""
    log_message "INFO" "Backend API:  ${CYAN}http://localhost:$BACKEND_PORT${NC}"
    log_message "INFO" "Frontend App: ${CYAN}http://localhost:$FRONTEND_PORT${NC}"
    echo ""
    log_message "INFO" "🎮 Open your browser and navigate to:"
    echo -e "    ${CYAN}➜ http://localhost:$FRONTEND_PORT${NC}"
    echo ""
    log_message "INFO" "Press ${RED}Ctrl+C${NC} to stop all services gracefully"
    log_message "INFO" "Logs are being written to: ${CYAN}$LOG_FILE${NC}"
    echo ""
}

# ============ MONITOR PROCESSES ============
monitor_processes() {
    log_section "Process Monitoring Active"
    
    local check_interval=5
    local error_count=0
    local max_errors=3
    
    while true; do
        sleep $check_interval
        
        # Check if processes are still running
        local all_alive=true
        for pid in "${PIDS_TO_KILL[@]}"; do
            if ! kill -0 $pid 2>/dev/null; then
                log_message "ERROR" "Process $pid is no longer running!"
                all_alive=false
                ((error_count++))
            fi
        done
        
        if [ "$all_alive" = false ]; then
            if [ $error_count -ge $max_errors ]; then
                log_message "ERROR" "Too many process failures detected"
                exit 1
            fi
        else
            error_count=0
        fi
    done
}

# ============ MAIN EXECUTION ============
main() {
    display_banner
    initialize
    check_prerequisites
    validate_directories
    install_dependencies
    setup_configuration
    check_ports "kill"
    
    if ! start_backend; then
        log_message "ERROR" "Failed to start backend"
        exit 1
    fi
    
    if ! start_frontend; then
        log_message "ERROR" "Failed to start frontend"
        exit 1
    fi
    
    if ! health_check; then
        log_message "WARNING" "Some health checks failed, but continuing..."
    fi
    
    display_success
    
    log_section "Running Startup Verification"
    log_message "INFO" "Waiting a moment for all services to stabilize..."
    sleep 2
    
    # Run the verification script
    if [ -f "$SCRIPT_DIR/backend/verify-startup.js" ]; then
        log_message "INFO" "Running comprehensive startup verification..."
        cd "$SCRIPT_DIR/backend"
        if node verify-startup.js 2>&1 | tee -a "$LOG_FILE"; then
            log_message "SUCCESS" "Startup verification passed!"
        else
            log_message "WARNING" "Startup verification had issues, but services are running"
        fi
        cd "$SCRIPT_DIR"
    fi
    
    log_message "INFO" "All systems operational. Starting process monitoring..."
    monitor_processes
}

# ============ ENTRY POINT ============
main "$@"
