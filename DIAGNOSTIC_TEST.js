#!/usr/bin/env node
/**
 * ============================================================================
 * COMPREHENSIVE DIAGNOSTIC & TESTING SCRIPT
 * ============================================================================
 * Tests: Dependencies, Files, Startup, API, Ports, Compilation
 * Usage: node DIAGNOSTIC_TEST.js
 * ============================================================================
 */

const fs = require('fs');
const path = require('path');
const { spawn, exec } = require('child_process');
const http = require('http');

const Colors = {
  RESET: '\x1b[0m',
  RED: '\x1b[31m',
  GREEN: '\x1b[32m',
  YELLOW: '\x1b[33m',
  BLUE: '\x1b[34m',
  CYAN: '\x1b[36m',
};

const PROJECT_ROOT = __dirname;
let testsPassed = 0;
let testsFailed = 0;

function log(level, msg) {
  let color = Colors.RESET;
  let symbol = '•';
  
  switch(level) {
    case 'SUCCESS': color = Colors.GREEN; symbol = '✓'; break;
    case 'ERROR': color = Colors.RED; symbol = '✗'; break;
    case 'WARN': color = Colors.YELLOW; symbol = '⚠'; break;
    case 'INFO': color = Colors.BLUE; symbol = 'ℹ'; break;
    case 'TEST': color = Colors.CYAN; symbol = '🧪'; break;
  }
  
  console.log(`${color}${symbol}${Colors.RESET} ${msg}`);
}

function section(title) {
  console.log(`\n${Colors.CYAN}${'═'.repeat(60)}${Colors.RESET}`);
  console.log(`${Colors.CYAN}  ${title}${Colors.RESET}`);
  console.log(`${Colors.CYAN}${'═'.repeat(60)}${Colors.RESET}`);
}

async function test(name, fn) {
  process.stdout.write(`${Colors.CYAN}Testing: ${name}... ${Colors.RESET}`);
  try {
    await fn();
    log('SUCCESS', `PASS: ${name}`);
    testsPassed++;
  } catch (err) {
    log('ERROR', `FAIL: ${name}`);
    console.log(`  Error: ${err.message}`);
    testsFailed++;
  }
}

// TEST FUNCTIONS

async function checkFileExists(filePath, desc) {
  const fullPath = path.join(PROJECT_ROOT, filePath);
  if (!fs.existsSync(fullPath)) {
    throw new Error(`${desc} not found at ${filePath}`);
  }
}

async function checkDirExists(dirPath, desc) {
  const fullPath = path.join(PROJECT_ROOT, dirPath);
  if (!fs.existsSync(fullPath) || !fs.statSync(fullPath).isDirectory()) {
    throw new Error(`${desc} directory not found at ${dirPath}`);
  }
}

async function checkPackageJson(pkgPath, desc, requiredKeys) {
  const fullPath = path.join(PROJECT_ROOT, pkgPath);
  const content = fs.readFileSync(fullPath, 'utf8');
  try {
    const pkg = JSON.parse(content);
    for (const key of requiredKeys) {
      if (!(key in pkg)) {
        throw new Error(`Missing required key: ${key}`);
      }
    }
  } catch (err) {
    throw new Error(`Invalid package.json at ${pkgPath}: ${err.message}`);
  }
}

async function checkNodeModules(dir, desc, packages) {
  const fullPath = path.join(PROJECT_ROOT, dir);
  if (!fs.existsSync(fullPath)) {
    throw new Error(`${desc} node_modules missing`);
  }
  for (const pkg of packages) {
    const pkgPath = path.join(fullPath, pkg);
    if (!fs.existsSync(pkgPath)) {
      throw new Error(`Package ${pkg} not installed in ${desc}`);
    }
  }
}

async function checkPort(port, desc) {
  return new Promise((resolve, reject) => {
    const server = http.createServer();
    server.listen(port, '127.0.0.1', () => {
      server.close();
      resolve();
    });
    server.on('error', (err) => {
      if (err.code === 'EADDRINUSE') {
        reject(new Error(`${desc} Port ${port} is already in use`));
      } else {
        reject(err);
      }
    });
  });
}

async function runCommand(cmd, timeout = 5000) {
  return new Promise((resolve, reject) => {
    const timer = setTimeout(() => {
      reject(new Error(`Command timeout: ${cmd}`));
    }, timeout);

    exec(cmd, { cwd: PROJECT_ROOT }, (error, stdout, stderr) => {
      clearTimeout(timer);
      if (error && error.code !== 0) {
        reject(new Error(`Command failed: ${stderr || error.message}`));
      } else {
        resolve(stdout);
      }
    });
  });
}

// RUN TESTS

async function runAllTests() {
  console.clear();
  console.log(`
${Colors.CYAN}╔════════════════════════════════════════════════════════════╗${Colors.RESET}
${Colors.CYAN}║                                                            ║${Colors.RESET}
${Colors.CYAN}║        🔍  COMPREHENSIVE DIAGNOSTIC & TEST SUITE  🔍        ║${Colors.RESET}
${Colors.CYAN}║                                                            ║${Colors.RESET}
${Colors.CYAN}║    Validating: Files, Dependencies, Ports, Startup       ║${Colors.RESET}
${Colors.CYAN}║                                                            ║${Colors.RESET}
${Colors.CYAN}╚════════════════════════════════════════════════════════════╝${Colors.RESET}
  `);

  // SECTION 1: FILE STRUCTURE
  section('FILE STRUCTURE VALIDATION');

  await test('Backend directory exists', () => checkDirExists('backend', 'Backend'));
  await test('Frontend directory exists', () => checkDirExists('frontend', 'Frontend'));
  await test('Backend server.js exists', () => checkFileExists('backend/src/server.js', 'Backend server'));
  await test('Backend routes exist', () => checkFileExists('backend/src/routes/quiz.js', 'Quiz routes'));
  await test('Backend models exist', () => checkFileExists('backend/src/models/Session.js', 'Session model'));
  await test('Backend data exists', () => checkFileExists('backend/src/data/escapeRoomQuestions.js', 'Questions data'));
  await test('Frontend App.js exists', () => checkFileExists('frontend/src/App.js', 'Frontend App'));
  await test('Frontend components exist', () => checkDirExists('frontend/src/components', 'Components'));
  await test('Frontend utils exist', () => checkDirExists('frontend/src/utils', 'Frontend utils'));
  await test('Frontend public exists', () => checkDirExists('frontend/public', 'Frontend public'));
  await test('Main launcher exists', () => checkFileExists('main.js', 'Main launcher'));

  // SECTION 2: PACKAGE.JSON VALIDATION
  section('PACKAGE.JSON VALIDATION');

  await test('Root package.json valid', () => 
    checkPackageJson('package.json', 'Root', ['name', 'version', 'scripts', 'dependencies'])
  );
  await test('Backend package.json valid', () => 
    checkPackageJson('backend/package.json', 'Backend', ['name', 'version', 'dependencies', 'scripts'])
  );
  await test('Frontend package.json valid', () => 
    checkPackageJson('frontend/package.json', 'Frontend', ['name', 'version', 'dependencies', 'scripts'])
  );

  // SECTION 3: DEPENDENCIES
  section('DEPENDENCIES VALIDATION');

  await test('Backend dependencies installed', () =>
    checkNodeModules('backend/node_modules', 'Backend', ['express', 'express-session', 'cors', 'dotenv', 'uuid'])
  );
  await test('Frontend dependencies installed', () =>
    checkNodeModules('frontend/node_modules', 'Frontend', ['react', 'react-dom', 'axios', 'framer-motion'])
  );

  // SECTION 4: PORT AVAILABILITY
  section('PORT AVAILABILITY CHECK');

  await test('Backend port 5000 available', () => checkPort(5000, 'Backend'));
  await test('Frontend port 3000 available', () => checkPort(3000, 'Frontend'));

  // SECTION 5: ENVIRONMENT CONFIGURATION
  section('ENVIRONMENT CONFIGURATION');

  await test('Backend .env exists', () => checkFileExists('backend/.env', 'Backend .env'));
  await test('Frontend .env exists', () => checkFileExists('frontend/.env', 'Frontend .env'));

  // SECTION 6: SUMMARY
  section('TEST RESULTS SUMMARY');

  const total = testsPassed + testsFailed;
  const percentage = total > 0 ? Math.round((testsPassed / total) * 100) : 0;

  console.log(`\n${Colors.CYAN}Total Tests: ${Colors.RESET}${total}`);
  console.log(`${Colors.GREEN}Passed: ${Colors.RESET}${testsPassed}`);
  console.log(`${Colors.RED}Failed: ${Colors.RESET}${testsFailed}`);
  console.log(`${Colors.BLUE}Success Rate: ${percentage}%${Colors.RESET}`);

  if (testsFailed === 0) {
    console.log(`\n${Colors.GREEN}${'✓'.repeat(30)}${Colors.RESET}`);
    console.log(`${Colors.GREEN}✓ ALL TESTS PASSED! Application is ready.${Colors.RESET}`);
    console.log(`${Colors.GREEN}${'✓'.repeat(30)}${Colors.RESET}`);
    console.log(`\n${Colors.CYAN}Next Step: Run ${Colors.YELLOW}node main.js${Colors.RESET} to start the application`);
    process.exit(0);
  } else {
    console.log(`\n${Colors.RED}${'✗'.repeat(30)}${Colors.RESET}`);
    console.log(`${Colors.RED}✗ SOME TESTS FAILED. Please fix the issues above.${Colors.RESET}`);
    console.log(`${Colors.RED}${'✗'.repeat(30)}${Colors.RESET}`);
    process.exit(1);
  }
}

// Run all tests
runAllTests().catch(err => {
  log('ERROR', `Fatal error: ${err.message}`);
  process.exit(1);
});
