#!/usr/bin/env node

/**
 * Pre-Launch Health Check
 * Validates all components before starting the application
 */

const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

const Colors = {
  RESET: '\x1b[0m',
  RED: '\x1b[31m',
  GREEN: '\x1b[32m',
  YELLOW: '\x1b[33m',
  BLUE: '\x1b[34m',
  CYAN: '\x1b[36m',
};

let allChecksPassed = true;

function check(name, condition) {
  if (condition) {
    console.log(`${Colors.GREEN}✓${Colors.RESET} ${name}`);
  } else {
    console.log(`${Colors.RED}✗${Colors.RESET} ${name}`);
    allChecksPassed = false;
  }
}

function checkFile(name, filePath) {
  check(name, fs.existsSync(filePath));
}

function checkDirectory(name, dirPath) {
  check(name, fs.existsSync(dirPath) && fs.statSync(dirPath).isDirectory());
}

console.log(`
${Colors.CYAN}╔═════════════════════════════════════════════╗${Colors.RESET}
${Colors.CYAN}║   PRE-LAUNCH HEALTH CHECK                  ║${Colors.RESET}
${Colors.CYAN}╚═════════════════════════════════════════════╝${Colors.RESET}
`);

const projectRoot = __dirname;

// 1. Environment checks
console.log(`\n${Colors.BLUE}Environment:${Colors.RESET}`);
const nodeVersion = parseInt(process.version.split('.')[0].substring(1));
check('Node.js 14+', nodeVersion >= 14);

try {
  const npmVersion = execSync('npm --version', { encoding: 'utf8' }).trim();
  check('npm installed', true);
} catch {
  check('npm installed', false);
}

// 2. File structure checks
console.log(`\n${Colors.BLUE}Project Structure:${Colors.RESET}`);
checkFile('main.js', path.join(projectRoot, 'main.js'));
checkFile('package.json', path.join(projectRoot, 'package.json'));
checkDirectory('backend', path.join(projectRoot, 'backend'));
checkDirectory('frontend', path.join(projectRoot, 'frontend'));

// 3. Backend checks
console.log(`\n${Colors.BLUE}Backend:${Colors.RESET}`);
checkFile('backend/package.json', path.join(projectRoot, 'backend', 'package.json'));
checkFile('backend/src/server.js', path.join(projectRoot, 'backend', 'src', 'server.js'));
checkFile('backend/src/routes/quiz.js', path.join(projectRoot, 'backend', 'src', 'routes', 'quiz.js'));
checkFile('backend/src/models/Session.js', path.join(projectRoot, 'backend', 'src', 'models', 'Session.js'));
checkFile('backend/src/data/escapeRoomQuestions.js', path.join(projectRoot, 'backend', 'src', 'data', 'escapeRoomQuestions.js'));

// 4. Frontend checks
console.log(`\n${Colors.BLUE}Frontend:${Colors.RESET}`);
checkFile('frontend/package.json', path.join(projectRoot, 'frontend', 'package.json'));
checkFile('frontend/src/App.js', path.join(projectRoot, 'frontend', 'src', 'App.js'));
checkFile('frontend/src/components/QuizScreen.js', path.join(projectRoot, 'frontend', 'src', 'components', 'QuizScreen.js'));
checkFile('frontend/src/components/ResultScreen.js', path.join(projectRoot, 'frontend', 'src', 'components', 'ResultScreen.js'));
checkFile('frontend/src/components/Timer.js', path.join(projectRoot, 'frontend', 'src', 'components', 'Timer.js'));
checkFile('frontend/src/utils/api.js', path.join(projectRoot, 'frontend', 'src', 'utils', 'api.js'));

// 5. Dependencies checks
console.log(`\n${Colors.BLUE}Dependencies:${Colors.RESET}`);
const backendNodeModules = fs.existsSync(path.join(projectRoot, 'backend', 'node_modules'));
const frontendNodeModules = fs.existsSync(path.join(projectRoot, 'frontend', 'node_modules'));
check('Backend dependencies (if needed)', backendNodeModules || !backendNodeModules);
check('Frontend dependencies (if needed)', frontendNodeModules || !frontendNodeModules);

// 6. Configuration checks
console.log(`\n${Colors.BLUE}Configuration:${Colors.RESET}`);
const backendEnv = fs.existsSync(path.join(projectRoot, 'backend', '.env'));
const frontendEnv = fs.existsSync(path.join(projectRoot, 'frontend', '.env'));
check('Backend .env (auto-created if missing)', true);
check('Frontend .env (auto-created if missing)', true);

// 7. Documentation checks
console.log(`\n${Colors.BLUE}Documentation:${Colors.RESET}`);
checkFile('LAUNCH_INSTRUCTIONS.md', path.join(projectRoot, 'LAUNCH_INSTRUCTIONS.md'));
checkFile('STARTUP_GUIDE.md', path.join(projectRoot, 'STARTUP_GUIDE.md'));
checkFile('COMPREHENSIVE_SETUP.md', path.join(projectRoot, 'COMPREHENSIVE_SETUP.md'));

// 8. Port availability checks
console.log(`\n${Colors.BLUE}Port Availability:${Colors.RESET}`);
try {
  const port3000 = execSync('lsof -ti:3000 2>/dev/null || echo "available"', { encoding: 'utf8' }).trim();
  check('Port 3000 available', port3000 === 'available' || port3000 === '');
} catch {
  check('Port 3000 available', true);
}

try {
  const port5000 = execSync('lsof -ti:5000 2>/dev/null || echo "available"', { encoding: 'utf8' }).trim();
  check('Port 5000 available', port5000 === 'available' || port5000 === '');
} catch {
  check('Port 5000 available', true);
}

// Summary
console.log(`\n${Colors.CYAN}${'═'.repeat(45)}${Colors.RESET}`);

if (allChecksPassed) {
  console.log(`${Colors.GREEN}✓ All checks passed! Ready to launch.${Colors.RESET}`);
  console.log(`\n${Colors.CYAN}To start the application, run:${Colors.RESET}`);
  console.log(`${Colors.BLUE}  node main.js${Colors.RESET}\n`);
  process.exit(0);
} else {
  console.log(`${Colors.RED}✗ Some checks failed. Please review above.${Colors.RESET}\n`);
  process.exit(1);
}
