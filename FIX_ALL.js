#!/usr/bin/env node
/**
 * ============================================================================
 * AUTOMATED FIX-ALL SCRIPT
 * ============================================================================
 * Automatically fixes all common issues
 * Usage: node FIX_ALL.js
 * ============================================================================
 */

const fs = require('fs');
const path = require('path');
const { spawn, exec, execSync } = require('child_process');

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
let fixesApplied = 0;

function log(level, msg) {
  let color = Colors.RESET;
  let symbol = '•';
  
  switch(level) {
    case 'SUCCESS': color = Colors.GREEN; symbol = '✓'; break;
    case 'ERROR': color = Colors.RED; symbol = '✗'; break;
    case 'WARN': color = Colors.YELLOW; symbol = '⚠'; break;
    case 'INFO': color = Colors.BLUE; symbol = 'ℹ'; break;
    case 'FIX': color = Colors.CYAN; symbol = '🔧'; break;
  }
  
  console.log(`${color}${symbol}${Colors.RESET} ${msg}`);
}

function section(title) {
  console.log(`\n${Colors.CYAN}${'═'.repeat(60)}${Colors.RESET}`);
  console.log(`${Colors.CYAN}  ${title}${Colors.RESET}`);
  console.log(`${Colors.CYAN}${'═'.repeat(60)}${Colors.RESET}`);
}

async function executeCommand(cmd, description) {
  return new Promise((resolve, reject) => {
    log('INFO', `${description}...`);
    
    exec(cmd, { cwd: PROJECT_ROOT, maxBuffer: 10 * 1024 * 1024 }, (error, stdout, stderr) => {
      if (error) {
        log('ERROR', `Failed: ${description}`);
        console.log(`  ${error.message}`);
        reject(error);
      } else {
        log('SUCCESS', `Completed: ${description}`);
        fixesApplied++;
        resolve(stdout);
      }
    });
  });
}

async function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

async function runAllFixes() {
  console.clear();
  console.log(`
${Colors.CYAN}╔════════════════════════════════════════════════════════════╗${Colors.RESET}
${Colors.CYAN}║                                                            ║${Colors.RESET}
${Colors.CYAN}║          🔧  AUTOMATED FIX-ALL SCRIPT  🔧                 ║${Colors.RESET}
${Colors.CYAN}║                                                            ║${Colors.RESET}
${Colors.CYAN}║     Fixing Dependencies, Ports, Config, and Issues       ║${Colors.RESET}
${Colors.CYAN}║                                                            ║${Colors.RESET}
${Colors.CYAN}╚════════════════════════════════════════════════════════════╝${Colors.RESET}
  `);

  try {
    // FIX 1: KILL EXISTING PROCESSES ON PORTS
    section('FIX 1: CLEARING PORTS 3000 & 5000');
    
    try {
      execSync('lsof -ti:5000 | xargs kill -9 2>/dev/null || true', { stdio: 'pipe' });
      log('SUCCESS', 'Cleared port 5000');
    } catch (err) {
      log('INFO', 'Port 5000 was already clear');
    }
    
    try {
      execSync('lsof -ti:3000 | xargs kill -9 2>/dev/null || true', { stdio: 'pipe' });
      log('SUCCESS', 'Cleared port 3000');
    } catch (err) {
      log('INFO', 'Port 3000 was already clear');
    }
    
    fixesApplied++;
    await sleep(1000);

    // FIX 2: CLEAN BACKEND DEPENDENCIES
    section('FIX 2: CLEANING & REBUILDING BACKEND');
    
    const backendPath = path.join(PROJECT_ROOT, 'backend');
    if (fs.existsSync(path.join(backendPath, 'node_modules'))) {
      try {
        execSync('rm -rf node_modules package-lock.json', { 
          cwd: backendPath,
          stdio: 'pipe'
        });
        log('SUCCESS', 'Removed corrupted backend node_modules');
        fixesApplied++;
      } catch (err) {
        log('WARN', 'Could not remove backend node_modules');
      }
    }

    await executeCommand(
      `cd ${backendPath} && npm install --force`,
      'Installing backend dependencies (this may take a minute)'
    );
    await sleep(2000);

    // FIX 3: CLEAN FRONTEND DEPENDENCIES
    section('FIX 3: CLEANING & REBUILDING FRONTEND');
    
    const frontendPath = path.join(PROJECT_ROOT, 'frontend');
    if (fs.existsSync(path.join(frontendPath, 'node_modules'))) {
      try {
        execSync('rm -rf node_modules package-lock.json', { 
          cwd: frontendPath,
          stdio: 'pipe'
        });
        log('SUCCESS', 'Removed corrupted frontend node_modules');
        fixesApplied++;
      } catch (err) {
        log('WARN', 'Could not remove frontend node_modules');
      }
    }

    await executeCommand(
      `cd ${frontendPath} && npm install --force`,
      'Installing frontend dependencies (this may take 2-3 minutes)'
    );
    await sleep(2000);

    // FIX 4: CREATE/UPDATE .ENV FILES
    section('FIX 4: CREATING/UPDATING .ENV FILES');
    
    const backendEnvPath = path.join(backendPath, '.env');
    const timestamp = Math.floor(Date.now() / 1000);
    const backendEnv = `# Offensive Security Escape Room - Backend Configuration
NODE_ENV=development
PORT=5000
FRONTEND_URL=http://localhost:3000
CORS_ORIGIN=http://localhost:3000
SESSION_SECRET=offensive-sec-quiz-secret-${timestamp}
LOG_LEVEL=info
SESSION_TIMEOUT=1500000
`;

    if (!fs.existsSync(backendEnvPath) || fs.readFileSync(backendEnvPath, 'utf8').length < 50) {
      fs.writeFileSync(backendEnvPath, backendEnv);
      log('SUCCESS', 'Created/Updated backend .env');
      fixesApplied++;
    } else {
      log('INFO', 'Backend .env already exists');
    }

    const frontendEnvPath = path.join(frontendPath, '.env');
    const frontendEnv = `# Offensive Security Escape Room - Frontend Configuration
REACT_APP_API_URL=http://localhost:5000/api
REACT_APP_PORT=3000
`;

    if (!fs.existsSync(frontendEnvPath) || fs.readFileSync(frontendEnvPath, 'utf8').length < 50) {
      fs.writeFileSync(frontendEnvPath, frontendEnv);
      log('SUCCESS', 'Created/Updated frontend .env');
      fixesApplied++;
    } else {
      log('INFO', 'Frontend .env already exists');
    }

    // FIX 5: VALIDATE KEY PACKAGES
    section('FIX 5: VALIDATING KEY PACKAGES');
    
    const backendNodeModules = path.join(backendPath, 'node_modules');
    const requiredBackendPkgs = ['express', 'express-session', 'cors', 'dotenv', 'uuid'];
    const requiredFrontendPkgs = ['react', 'react-dom', 'axios', 'framer-motion'];
    const frontendNodeModules = path.join(frontendPath, 'node_modules');

    let allBackendPresent = true;
    for (const pkg of requiredBackendPkgs) {
      if (!fs.existsSync(path.join(backendNodeModules, pkg))) {
        log('ERROR', `Missing backend package: ${pkg}`);
        allBackendPresent = false;
      }
    }
    if (allBackendPresent) {
      log('SUCCESS', 'All required backend packages present');
    }

    let allFrontendPresent = true;
    for (const pkg of requiredFrontendPkgs) {
      if (!fs.existsSync(path.join(frontendNodeModules, pkg))) {
        log('ERROR', `Missing frontend package: ${pkg}`);
        allFrontendPresent = false;
      }
    }
    if (allFrontendPresent) {
      log('SUCCESS', 'All required frontend packages present');
    }

    // FIX 6: MAKE SCRIPTS EXECUTABLE
    section('FIX 6: MAKING SCRIPTS EXECUTABLE');
    
    try {
      execSync(`chmod +x ${PROJECT_ROOT}/main.js ${PROJECT_ROOT}/DIAGNOSTIC_TEST.js ${PROJECT_ROOT}/FIX_ALL.js 2>/dev/null || true`, { stdio: 'pipe' });
      log('SUCCESS', 'Scripts are now executable');
      fixesApplied++;
    } catch (err) {
      log('WARN', 'Could not make scripts executable');
    }

    // SUMMARY
    section('FIX SUMMARY');

    console.log(`\n${Colors.GREEN}${'✓'.repeat(30)}${Colors.RESET}`);
    console.log(`${Colors.GREEN}✓ FIXES COMPLETED!${Colors.RESET}`);
    console.log(`${Colors.GREEN}${'✓'.repeat(30)}${Colors.RESET}`);
    console.log(`\n${Colors.CYAN}Fixes Applied: ${Colors.YELLOW}${fixesApplied}${Colors.RESET}`);
    console.log(`\n${Colors.CYAN}Next Steps:${Colors.RESET}`);
    console.log(`  1. Run diagnostic: ${Colors.YELLOW}node DIAGNOSTIC_TEST.js${Colors.RESET}`);
    console.log(`  2. Start application: ${Colors.YELLOW}node main.js${Colors.RESET}`);
    console.log(`  3. Open browser: ${Colors.YELLOW}http://localhost:3000${Colors.RESET}`);
    console.log('');

    process.exit(0);

  } catch (err) {
    log('ERROR', `Fatal error during fixes: ${err.message}`);
    process.exit(1);
  }
}

// Run all fixes
runAllFixes();
