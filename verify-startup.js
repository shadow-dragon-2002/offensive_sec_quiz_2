#!/usr/bin/env node

/**
 * Startup Verification Script
 * Validates that all components are properly configured before launching
 */

const fs = require('fs');
const path = require('path');

const Colors = {
  RESET: '\x1b[0m',
  RED: '\x1b[31m',
  GREEN: '\x1b[32m',
  YELLOW: '\x1b[33m',
  BLUE: '\x1b[34m',
  CYAN: '\x1b[36m',
};

function checkFile(filePath, name) {
  if (fs.existsSync(filePath)) {
    console.log(`${Colors.GREEN}✓${Colors.RESET} ${name}`);
    return true;
  } else {
    console.log(`${Colors.RED}✗${Colors.RESET} ${name} - NOT FOUND: ${filePath}`);
    return false;
  }
}

function checkDirectory(dirPath, name) {
  if (fs.existsSync(dirPath) && fs.statSync(dirPath).isDirectory()) {
    console.log(`${Colors.GREEN}✓${Colors.RESET} ${name}`);
    return true;
  } else {
    console.log(`${Colors.RED}✗${Colors.RESET} ${name} - NOT FOUND: ${dirPath}`);
    return false;
  }
}

function readJsonSafe(filePath) {
  try {
    return JSON.parse(fs.readFileSync(filePath, 'utf8'));
  } catch (err) {
    return null;
  }
}

console.log(`
${Colors.CYAN}╔════════════════════════════════════════════╗${Colors.RESET}
${Colors.CYAN}║   CYBER ESCAPE ROOM - STARTUP VERIFICATION   ║${Colors.RESET}
${Colors.CYAN}╚════════════════════════════════════════════╝${Colors.RESET}
`);

let allGood = true;

// Check root files
console.log(`\n${Colors.CYAN}Root Configuration:${Colors.RESET}`);
allGood &= checkFile(path.join(__dirname, 'main.js'), 'Main launcher (main.js)');
allGood &= checkFile(path.join(__dirname, 'package.json'), 'Root package.json');

// Check backend
console.log(`\n${Colors.CYAN}Backend Setup:${Colors.RESET}`);
allGood &= checkDirectory(path.join(__dirname, 'backend'), 'Backend directory');
allGood &= checkFile(path.join(__dirname, 'backend', 'package.json'), 'Backend package.json');
allGood &= checkFile(path.join(__dirname, 'backend', 'src', 'server.js'), 'Backend server.js');
allGood &= checkFile(path.join(__dirname, 'backend', 'src', 'routes', 'quiz.js'), 'Quiz routes');
allGood &= checkFile(path.join(__dirname, 'backend', 'src', 'models', 'Session.js'), 'Session model');
allGood &= checkFile(path.join(__dirname, 'backend', 'src', 'data', 'escapeRoomQuestions.js'), 'Quiz questions');

// Check frontend
console.log(`\n${Colors.CYAN}Frontend Setup:${Colors.RESET}`);
allGood &= checkDirectory(path.join(__dirname, 'frontend'), 'Frontend directory');
allGood &= checkFile(path.join(__dirname, 'frontend', 'package.json'), 'Frontend package.json');
allGood &= checkFile(path.join(__dirname, 'frontend', 'public', 'index.html'), 'Frontend index.html');
allGood &= checkFile(path.join(__dirname, 'frontend', 'src', 'App.js'), 'Frontend App.js');
allGood &= checkFile(path.join(__dirname, 'frontend', 'src', 'utils', 'api.js'), 'API utilities');

// Check dependencies
console.log(`\n${Colors.CYAN}Dependencies:${Colors.RESET}`);
const backendPackage = readJsonSafe(path.join(__dirname, 'backend', 'package.json'));
const frontendPackage = readJsonSafe(path.join(__dirname, 'frontend', 'package.json'));
const rootPackage = readJsonSafe(path.join(__dirname, 'package.json'));

if (backendPackage && backendPackage.dependencies) {
  console.log(`${Colors.GREEN}✓${Colors.RESET} Backend has ${Object.keys(backendPackage.dependencies).length} dependencies`);
} else {
  console.log(`${Colors.RED}✗${Colors.RESET} Backend package.json invalid`);
  allGood = false;
}

if (frontendPackage && frontendPackage.dependencies) {
  console.log(`${Colors.GREEN}✓${Colors.RESET} Frontend has ${Object.keys(frontendPackage.dependencies).length} dependencies`);
} else {
  console.log(`${Colors.RED}✗${Colors.RESET} Frontend package.json invalid`);
  allGood = false;
}

// Summary
console.log(`\n${Colors.CYAN}Verification Result:${Colors.RESET}`);
if (allGood) {
  console.log(`\n${Colors.GREEN}✓ All checks passed! Ready to launch.${Colors.RESET}`);
  console.log(`${Colors.BLUE}Run: node main.js${Colors.RESET}\n`);
  process.exit(0);
} else {
  console.log(`\n${Colors.RED}✗ Some checks failed. Please review the errors above.${Colors.RESET}\n`);
  process.exit(1);
}
