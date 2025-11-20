#!/usr/bin/env node

/**
 * Error Recovery & Diagnostics Script
 * Helps fix common startup issues
 */

const fs = require('fs');
const path = require('path');
const { exec, execSync } = require('child_process');

const Colors = {
  RESET: '\x1b[0m',
  RED: '\x1b[31m',
  GREEN: '\x1b[32m',
  YELLOW: '\x1b[33m',
  BLUE: '\x1b[34m',
  CYAN: '\x1b[36m',
};

function log(color, message) {
  console.log(`${color}${message}${Colors.RESET}`);
}

function executeSync(command, errorMsg) {
  try {
    const result = execSync(command, { encoding: 'utf-8' });
    return { success: true, output: result };
  } catch (err) {
    return { success: false, error: errorMsg || err.message };
  }
}

console.log(`
${Colors.CYAN}╔═════════════════════════════════════════════╗${Colors.RESET}
${Colors.CYAN}║   ERROR RECOVERY & DIAGNOSTICS TOOL        ║${Colors.RESET}
${Colors.CYAN}╚═════════════════════════════════════════════╝${Colors.RESET}
`);

// Menu
console.log(`\n${Colors.BLUE}Options:${Colors.RESET}`);
console.log('1. Check all dependencies');
console.log('2. Clear and reinstall all dependencies');
console.log('3. Kill processes using ports 3000/5000');
console.log('4. Run diagnostics');
console.log('5. Reset environment completely');
console.log('6. Show system information');

const option = process.argv[2] || '1';

switch (option) {
  case '1':
    log(Colors.CYAN, '\n📦 Checking Dependencies...\n');
    
    const backend = fs.existsSync(path.join(__dirname, 'backend/node_modules'));
    const frontend = fs.existsSync(path.join(__dirname, 'frontend/node_modules'));
    const root = fs.existsSync(path.join(__dirname, 'node_modules'));
    
    log(backend ? Colors.GREEN : Colors.RED, `${backend ? '✓' : '✗'} Backend dependencies: ${backend ? 'INSTALLED' : 'MISSING'}`);
    log(frontend ? Colors.GREEN : Colors.RED, `${frontend ? '✓' : '✗'} Frontend dependencies: ${frontend ? 'INSTALLED' : 'MISSING'}`);
    log(root ? Colors.GREEN : Colors.RED, `${root ? '✓' : '✗'} Root dependencies: ${root ? 'INSTALLED' : 'MISSING'}`);
    
    if (!backend || !frontend || !root) {
      log(Colors.YELLOW, '\n⚠️  Missing dependencies. Run: npm run install:all');
    } else {
      log(Colors.GREEN, '\n✓ All dependencies installed');
    }
    break;

  case '2':
    log(Colors.YELLOW, '\n🔄 Clearing and reinstalling dependencies...\n');
    
    log(Colors.BLUE, 'Removing node_modules...');
    executeSync('rm -rf node_modules backend/node_modules frontend/node_modules', 'Failed to remove');
    executeSync('rm -f package-lock.json', 'Failed to remove package-lock.json');
    
    log(Colors.BLUE, 'Installing root dependencies...');
    executeSync('npm install --prefer-offline --no-audit', 'Failed to install root');
    
    log(Colors.BLUE, 'Installing backend dependencies...');
    executeSync('cd backend && npm install --prefer-offline --no-audit', 'Failed to install backend');
    
    log(Colors.BLUE, 'Installing frontend dependencies...');
    executeSync('cd frontend && npm install --prefer-offline --no-audit', 'Failed to install frontend');
    
    log(Colors.GREEN, '\n✓ Dependencies reinstalled successfully');
    break;

  case '3':
    log(Colors.YELLOW, '\n🔌 Killing processes on ports 3000 and 5000...\n');
    
    const kill3000 = executeSync('lsof -ti:3000 | xargs kill -9 2>/dev/null || true', null);
    const kill5000 = executeSync('lsof -ti:5000 | xargs kill -9 2>/dev/null || true', null);
    
    log(Colors.GREEN, '✓ Port 3000 cleared');
    log(Colors.GREEN, '✓ Port 5000 cleared');
    log(Colors.BLUE, '\nPorts are now available. Run: node main.js');
    break;

  case '4':
    log(Colors.CYAN, '\n🔍 Running Diagnostics...\n');
    
    log(Colors.BLUE, 'Node.js Version:');
    const nodeVersion = executeSync('node --version', 'Failed to get Node version');
    log(Colors.CYAN, `  ${nodeVersion.success ? nodeVersion.output.trim() : 'ERROR'}`);
    
    log(Colors.BLUE, 'npm Version:');
    const npmVersion = executeSync('npm --version', 'Failed to get npm version');
    log(Colors.CYAN, `  ${npmVersion.success ? npmVersion.output.trim() : 'ERROR'}`);
    
    log(Colors.BLUE, 'Port 3000 Status:');
    const port3000 = executeSync('lsof -ti:3000', null);
    log(port3000.success ? Colors.RED : Colors.GREEN, `  ${port3000.success ? 'IN USE - PID: ' + port3000.output.trim() : 'Available'}`);
    
    log(Colors.BLUE, 'Port 5000 Status:');
    const port5000 = executeSync('lsof -ti:5000', null);
    log(port5000.success ? Colors.RED : Colors.GREEN, `  ${port5000.success ? 'IN USE - PID: ' + port5000.output.trim() : 'Available'}`);
    
    log(Colors.BLUE, 'Disk Space:');
    const diskSpace = executeSync('df -h . | tail -1 | awk \'{print $4}\'', 'Failed');
    log(Colors.CYAN, `  Free space: ${diskSpace.success ? diskSpace.output.trim() : 'Unknown'}`);
    
    log(Colors.BLUE, 'Git Status:');
    const gitStatus = executeSync('git status --short', null);
    log(Colors.CYAN, `  ${gitStatus.success ? 'Repository healthy' : 'Not a git repo'}`);
    
    break;

  case '5':
    log(Colors.RED, '\n⚠️  WARNING: This will completely reset the environment\n');
    log(Colors.YELLOW, 'This will:');
    log(Colors.YELLOW, '  - Remove all node_modules');
    log(Colors.YELLOW, '  - Remove .env files');
    log(Colors.YELLOW, '  - Clear the log file');
    log(Colors.YELLOW, '  - Kill any running processes');
    log(Colors.YELLOW, '\nTo proceed, run: node error-recovery.js 5 confirm\n');
    
    if (process.argv[3] === 'confirm') {
      log(Colors.YELLOW, 'Resetting...\n');
      
      executeSync('rm -rf node_modules backend/node_modules frontend/node_modules', null);
      executeSync('rm -f backend/.env frontend/.env .env', null);
      executeSync('rm -f cyber_escape_room.log', null);
      executeSync('lsof -ti:3000 | xargs kill -9 2>/dev/null || true', null);
      executeSync('lsof -ti:5000 | xargs kill -9 2>/dev/null || true', null);
      
      log(Colors.GREEN, '✓ Environment reset complete');
      log(Colors.BLUE, 'Next: node main.js\n');
    }
    break;

  case '6':
    log(Colors.CYAN, '\n💻 System Information\n');
    
    const uname = executeSync('uname -a', 'Failed');
    log(Colors.BLUE, 'System:');
    log(Colors.CYAN, `  ${uname.success ? uname.output.trim() : 'Unknown'}`);
    
    const memory = executeSync('free -h | grep Mem | awk \'{print $2}\'', 'Failed');
    log(Colors.BLUE, 'Memory:');
    log(Colors.CYAN, `  ${memory.success ? memory.output.trim() : 'Unknown'}`);
    
    const cpu = executeSync('nproc', 'Failed');
    log(Colors.BLUE, 'CPU Cores:');
    log(Colors.CYAN, `  ${cpu.success ? cpu.output.trim() : 'Unknown'}`);
    
    const pwd = process.cwd();
    log(Colors.BLUE, 'Working Directory:');
    log(Colors.CYAN, `  ${pwd}`);
    break;

  default:
    log(Colors.RED, 'Invalid option');
}

console.log('');
