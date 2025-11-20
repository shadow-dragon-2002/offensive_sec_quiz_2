#!/usr/bin/env node
/**
 * ============================================================================
 * MASTER FIX SCRIPT - ONE COMMAND TO FIX EVERYTHING
 * ============================================================================
 * Automatically fixes all issues and starts the application
 * Usage: node MASTER_FIX.js
 * ============================================================================
 */

const fs = require('fs');
const path = require('path');
const { spawn, exec, execSync } = require('child_process');
const http = require('http');

const Colors = {
  RESET: '\x1b[0m',
  RED: '\x1b[31m',
  GREEN: '\x1b[32m',
  YELLOW: '\x1b[33m',
  BLUE: '\x1b[34m',
  CYAN: '\x1b[36m',
  BRIGHT: '\x1b[1m',
};

const PROJECT_ROOT = __dirname;

function log(level, msg) {
  let color = Colors.RESET, symbol = '•';
  
  switch(level) {
    case 'SUCCESS': color = Colors.GREEN; symbol = '✓'; break;
    case 'ERROR': color = Colors.RED; symbol = '✗'; break;
    case 'WARN': color = Colors.YELLOW; symbol = '⚠'; break;
    case 'INFO': color = Colors.BLUE; symbol = 'ℹ'; break;
    case 'FIX': color = Colors.CYAN; symbol = '🔧'; break;
    case 'START': color = Colors.GREEN; symbol = '🚀'; break;
  }
  
  console.log(`${color}${symbol}${Colors.RESET} ${msg}`);
}

function section(title) {
  console.log(`\n${Colors.CYAN}${'═'.repeat(65)}${Colors.RESET}`);
  console.log(`${Colors.CYAN}  ${title}${Colors.RESET}`);
  console.log(`${Colors.CYAN}${'═'.repeat(65)}${Colors.RESET}`);
}

async function sleep(ms) {
  return new Promise(r => setTimeout(r, ms));
}

async function runCommand(cmd, cwd = PROJECT_ROOT, desc = 'Running command') {
  return new Promise((resolve, reject) => {
    exec(cmd, { cwd, maxBuffer: 10 * 1024 * 1024, timeout: 120000 }, (error, stdout, stderr) => {
      if (error && error.code !== 0) {
        reject(new Error(`${desc} failed: ${stderr || error.message}`));
      } else {
        resolve(stdout);
      }
    });
  });
}

async function master() {
  console.clear();
  console.log(`
${Colors.CYAN}╔═══════════════════════════════════════════════════════════════╗${Colors.RESET}
${Colors.CYAN}║                                                               ║${Colors.RESET}
${Colors.CYAN}║         🚀  MASTER FIX & STARTUP SCRIPT  🚀                  ║${Colors.RESET}
${Colors.CYAN}║                                                               ║${Colors.RESET}
${Colors.CYAN}║  This script will:                                           ║${Colors.RESET}
${Colors.CYAN}║  1. Fix all dependency and port issues                       ║${Colors.RESET}
${Colors.CYAN}║  2. Validate all files and packages                          ║${Colors.RESET}
${Colors.CYAN}║  3. Start the application                                    ║${Colors.RESET}
${Colors.CYAN}║                                                               ║${Colors.RESET}
${Colors.CYAN}╚═══════════════════════════════════════════════════════════════╝${Colors.RESET}
  `);

  try {
    // PHASE 1: CLEANUP
    section('PHASE 1: CLEANUP & PORT CLEARING');

    try {
      execSync('lsof -ti:5000 | xargs kill -9 2>/dev/null || true', { stdio: 'pipe' });
      log('SUCCESS', 'Cleared port 5000');
    } catch (e) {
      log('INFO', 'Port 5000 was already clear');
    }

    try {
      execSync('lsof -ti:3000 | xargs kill -9 2>/dev/null || true', { stdio: 'pipe' });
      log('SUCCESS', 'Cleared port 3000');
    } catch (e) {
      log('INFO', 'Port 3000 was already clear');
    }

    await sleep(1000);

    // PHASE 2: BACKEND DEPENDENCY FIX
    section('PHASE 2: BACKEND DEPENDENCY INSTALLATION');

    const backendPath = path.join(PROJECT_ROOT, 'backend');
    
    try {
      execSync('rm -rf node_modules package-lock.json', { 
        cwd: backendPath,
        stdio: 'pipe'
      });
      log('INFO', 'Removed old backend node_modules');
    } catch (e) {
      log('INFO', 'Backend node_modules was clean');
    }

    log('INFO', 'Installing backend dependencies (this may take a minute)...');
    try {
      execSync('npm install --force', { 
        cwd: backendPath,
        stdio: 'pipe',
        timeout: 120000
      });
      log('SUCCESS', 'Backend dependencies installed');
    } catch (err) {
      log('ERROR', `Backend install failed: ${err.message}`);
      process.exit(1);
    }
    
    await sleep(2000);

    // PHASE 3: FRONTEND DEPENDENCY FIX
    section('PHASE 3: FRONTEND DEPENDENCY INSTALLATION');

    const frontendPath = path.join(PROJECT_ROOT, 'frontend');

    try {
      execSync('rm -rf node_modules package-lock.json', { 
        cwd: frontendPath,
        stdio: 'pipe'
      });
      log('INFO', 'Removed old frontend node_modules');
    } catch (e) {
      log('INFO', 'Frontend node_modules was clean');
    }

    log('INFO', 'Installing frontend dependencies (this may take 2-3 minutes)...');
    try {
      execSync('npm install --force', { 
        cwd: frontendPath,
        stdio: 'pipe',
        timeout: 180000
      });
      log('SUCCESS', 'Frontend dependencies installed');
    } catch (err) {
      log('ERROR', `Frontend install failed: ${err.message}`);
      process.exit(1);
    }

    await sleep(2000);

    // PHASE 4: CONFIGURATION
    section('PHASE 4: ENVIRONMENT CONFIGURATION');

    const backendEnv = `NODE_ENV=development
PORT=5000
FRONTEND_URL=http://localhost:3000
CORS_ORIGIN=http://localhost:3000
SESSION_SECRET=offensive-sec-quiz-secret-${Math.floor(Date.now() / 1000)}
LOG_LEVEL=info
SESSION_TIMEOUT=1500000
`;

    const frontendEnv = `REACT_APP_API_URL=http://localhost:5000/api
REACT_APP_PORT=3000
`;

    fs.writeFileSync(path.join(backendPath, '.env'), backendEnv);
    log('SUCCESS', 'Backend .env configured');

    fs.writeFileSync(path.join(frontendPath, '.env'), frontendEnv);
    log('SUCCESS', 'Frontend .env configured');

    // PHASE 5: VALIDATION
    section('PHASE 5: VALIDATION');

    let validationPassed = true;

    // Check backend packages
    const backendRequired = ['express', 'cors', 'dotenv', 'uuid'];
    for (const pkg of backendRequired) {
      if (!fs.existsSync(path.join(backendPath, 'node_modules', pkg))) {
        log('ERROR', `Missing backend package: ${pkg}`);
        validationPassed = false;
      }
    }
    if (validationPassed) log('SUCCESS', 'All backend packages verified');

    // Check frontend packages  
    const frontendRequired = ['react', 'react-dom', 'axios'];
    for (const pkg of frontendRequired) {
      if (!fs.existsSync(path.join(frontendPath, 'node_modules', pkg))) {
        log('ERROR', `Missing frontend package: ${pkg}`);
        validationPassed = false;
      }
    }
    if (validationPassed) log('SUCCESS', 'All frontend packages verified');

    // Check key files
    const requiredFiles = [
      'backend/src/server.js',
      'frontend/src/App.js',
      'main.js'
    ];
    for (const file of requiredFiles) {
      if (!fs.existsSync(path.join(PROJECT_ROOT, file))) {
        log('ERROR', `Missing file: ${file}`);
        validationPassed = false;
      }
    }
    if (validationPassed) log('SUCCESS', 'All required files present');

    if (!validationPassed) {
      log('ERROR', 'Validation failed');
      process.exit(1);
    }

    // PHASE 6: STARTUP
    section('PHASE 6: STARTING APPLICATION');

    log('START', 'Launching main.js...');
    await sleep(1000);

    console.log('');
    const main = spawn('node', ['main.js'], {
      cwd: PROJECT_ROOT,
      stdio: 'inherit'
    });

    main.on('error', (err) => {
      log('ERROR', `Failed to start: ${err.message}`);
      process.exit(1);
    });

    main.on('exit', (code) => {
      if (code !== 0 && code !== 130) {
        log('ERROR', `Application exited with code ${code}`);
        process.exit(code);
      }
    });

    process.on('SIGINT', () => {
      log('INFO', 'Shutting down gracefully...');
      main.kill();
      process.exit(0);
    });

  } catch (err) {
    log('ERROR', `Fatal error: ${err.message}`);
    console.log(err.stack);
    process.exit(1);
  }
}

master();
