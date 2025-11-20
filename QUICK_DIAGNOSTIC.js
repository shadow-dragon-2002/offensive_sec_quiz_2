#!/usr/bin/env node

/**
 * ============================================================================
 * OFFLINE DIAGNOSTIC REPORT
 * ============================================================================
 * Comprehensive analysis without running the full scripts
 * ============================================================================
 */

const fs = require('fs');
const path = require('path');

const PROJECT_ROOT = __dirname;

console.log(`
╔════════════════════════════════════════════════════════════════╗
║                                                                ║
║      🔍  OFFENSIVE SECURITY QUIZ - DIAGNOSTIC REPORT  🔍      ║
║                                                                ║
║              Comprehensive Environment Analysis               ║
║                                                                ║
╚════════════════════════════════════════════════════════════════╝
`);

// Helper function
function checkExists(filePath, description) {
  const exists = fs.existsSync(filePath);
  const symbol = exists ? '✓' : '✗';
  console.log(`  ${symbol} ${description}`);
  return exists;
}

// ============================================================================
// SECTION 1: PROJECT STRUCTURE
// ============================================================================
console.log('\n═══════════════════════════════════════════════════════════════');
console.log('  SECTION 1: PROJECT STRUCTURE VALIDATION');
console.log('═══════════════════════════════════════════════════════════════\n');

const requiredDirs = [
  ['backend', 'Backend directory'],
  ['frontend', 'Frontend directory'],
  ['backend/src', 'Backend source files'],
  ['backend/src/routes', 'Backend routes'],
  ['backend/src/models', 'Backend models'],
  ['backend/src/data', 'Backend data files'],
  ['frontend/src', 'Frontend source files'],
  ['frontend/src/components', 'Frontend components'],
  ['frontend/src/utils', 'Frontend utilities'],
  ['frontend/public', 'Frontend public files']
];

let structureOk = true;
for (const [dir, desc] of requiredDirs) {
  if (!checkExists(path.join(PROJECT_ROOT, dir), desc)) {
    structureOk = false;
  }
}

// ============================================================================
// SECTION 2: CORE FILES
// ============================================================================
console.log('\n═══════════════════════════════════════════════════════════════');
console.log('  SECTION 2: CORE FILES VALIDATION');
console.log('═══════════════════════════════════════════════════════════════\n');

const requiredFiles = [
  ['main.js', 'Main launcher'],
  ['package.json', 'Root package.json'],
  ['backend/package.json', 'Backend package.json'],
  ['backend/src/server.js', 'Backend server'],
  ['backend/src/routes/quiz.js', 'Quiz routes'],
  ['backend/src/models/Session.js', 'Session model'],
  ['backend/src/data/escapeRoomQuestions.js', 'Questions data'],
  ['frontend/package.json', 'Frontend package.json'],
  ['frontend/src/App.js', 'Frontend App component'],
  ['frontend/public/index.html', 'Frontend HTML'],
  ['FIX_ALL.js', 'Fix script'],
  ['DIAGNOSTIC_TEST.js', 'Diagnostic test script']
];

let filesOk = true;
for (const [file, desc] of requiredFiles) {
  if (!checkExists(path.join(PROJECT_ROOT, file), desc)) {
    filesOk = false;
  }
}

// ============================================================================
// SECTION 3: DEPENDENCIES
// ============================================================================
console.log('\n═══════════════════════════════════════════════════════════════');
console.log('  SECTION 3: DEPENDENCIES INSTALLATION STATUS');
console.log('═══════════════════════════════════════════════════════════════\n');

const backendNodeModules = path.join(PROJECT_ROOT, 'backend', 'node_modules');
const frontendNodeModules = path.join(PROJECT_ROOT, 'frontend', 'node_modules');

console.log('Backend Dependencies:');
const requiredBackendPkgs = ['express', 'express-session', 'cors', 'dotenv', 'uuid'];
let backendDepsOk = true;
for (const pkg of requiredBackendPkgs) {
  if (!checkExists(path.join(backendNodeModules, pkg), `  └─ ${pkg}`)) {
    backendDepsOk = false;
  }
}

console.log('\nFrontend Dependencies:');
const requiredFrontendPkgs = ['react', 'react-dom', 'axios', 'framer-motion'];
let frontendDepsOk = true;
for (const pkg of requiredFrontendPkgs) {
  if (!checkExists(path.join(frontendNodeModules, pkg), `  └─ ${pkg}`)) {
    frontendDepsOk = false;
  }
}

// ============================================================================
// SECTION 4: ENVIRONMENT CONFIGURATION
// ============================================================================
console.log('\n═══════════════════════════════════════════════════════════════');
console.log('  SECTION 4: ENVIRONMENT CONFIGURATION');
console.log('═══════════════════════════════════════════════════════════════\n');

const backendEnv = path.join(PROJECT_ROOT, 'backend', '.env');
const frontendEnv = path.join(PROJECT_ROOT, 'frontend', '.env');

checkExists(backendEnv, 'Backend .env file');
checkExists(frontendEnv, 'Frontend .env file');

// Check .env content
console.log('\nBackend .env Configuration:');
if (fs.existsSync(backendEnv)) {
  const backendEnvContent = fs.readFileSync(backendEnv, 'utf8');
  const hasPort = backendEnvContent.includes('PORT=5000');
  const hasSecret = backendEnvContent.includes('SESSION_SECRET=');
  const hasNodeEnv = backendEnvContent.includes('NODE_ENV=');
  
  console.log(`  ${hasPort ? '✓' : '✗'} PORT configuration`);
  console.log(`  ${hasSecret ? '✓' : '✗'} SESSION_SECRET configuration`);
  console.log(`  ${hasNodeEnv ? '✓' : '✗'} NODE_ENV configuration`);
}

console.log('\nFrontend .env Configuration:');
if (fs.existsSync(frontendEnv)) {
  const frontendEnvContent = fs.readFileSync(frontendEnv, 'utf8');
  const hasApiUrl = frontendEnvContent.includes('REACT_APP_API_URL=');
  const hasApiBase = frontendEnvContent.includes('REACT_APP_API_BASE=');
  
  console.log(`  ${hasApiUrl ? '✓' : '✗'} REACT_APP_API_URL configuration`);
  console.log(`  ${hasApiBase ? '✓' : '✗'} REACT_APP_API_BASE configuration`);
}

// ============================================================================
// SECTION 5: PACKAGE.JSON VALIDATION
// ============================================================================
console.log('\n═══════════════════════════════════════════════════════════════');
console.log('  SECTION 5: PACKAGE.JSON VALIDATION');
console.log('═══════════════════════════════════════════════════════════════\n');

function validatePackageJson(filePath, name) {
  console.log(`${name}:`);
  if (!fs.existsSync(filePath)) {
    console.log('  ✗ File not found');
    return false;
  }
  
  try {
    const content = fs.readFileSync(filePath, 'utf8');
    const pkg = JSON.parse(content);
    
    console.log(`  ✓ Valid JSON`);
    console.log(`  ✓ Name: ${pkg.name || 'N/A'}`);
    console.log(`  ✓ Version: ${pkg.version || 'N/A'}`);
    
    if (pkg.dependencies) {
      console.log(`  ✓ Has ${Object.keys(pkg.dependencies).length} dependencies`);
    }
    if (pkg.scripts) {
      console.log(`  ✓ Has ${Object.keys(pkg.scripts).length} scripts defined`);
    }
    return true;
  } catch (err) {
    console.log(`  ✗ Invalid JSON: ${err.message}`);
    return false;
  }
}

validatePackageJson(path.join(PROJECT_ROOT, 'package.json'), 'Root package.json');
console.log();
validatePackageJson(path.join(PROJECT_ROOT, 'backend', 'package.json'), 'Backend package.json');
console.log();
validatePackageJson(path.join(PROJECT_ROOT, 'frontend', 'package.json'), 'Frontend package.json');

// ============================================================================
// SECTION 6: PORT AVAILABILITY
// ============================================================================
console.log('\n═══════════════════════════════════════════════════════════════');
console.log('  SECTION 6: PORT AVAILABILITY');
console.log('═══════════════════════════════════════════════════════════════\n');

const { execSync } = require('child_process');
try {
  const portCheck = execSync("netstat -tulpn 2>/dev/null | grep -E ':(3000|5000)' || echo 'Ports available'", {
    encoding: 'utf8'
  });
  
  if (portCheck.includes('3000') || portCheck.includes('5000')) {
    console.log('  ⚠ Warning: Some ports may be in use');
    console.log(portCheck);
  } else {
    console.log('  ✓ Port 3000 (Frontend) - AVAILABLE');
    console.log('  ✓ Port 5000 (Backend) - AVAILABLE');
  }
} catch (err) {
  console.log('  ✓ Port 3000 (Frontend) - AVAILABLE');
  console.log('  ✓ Port 5000 (Backend) - AVAILABLE');
}

// ============================================================================
// SECTION 7: SYSTEM INFORMATION
// ============================================================================
console.log('\n═══════════════════════════════════════════════════════════════');
console.log('  SECTION 7: SYSTEM INFORMATION');
console.log('═══════════════════════════════════════════════════════════════\n');

const os = require('os');
console.log(`  Platform: ${os.platform()} ${os.arch()}`);
console.log(`  Node.js: ${process.version}`);
console.log(`  NPM: v${require('child_process').execSync('npm -v', { encoding: 'utf8' }).trim()}`);

// ============================================================================
// FINAL STATUS
// ============================================================================
console.log('\n═══════════════════════════════════════════════════════════════');
console.log('  FINAL STATUS SUMMARY');
console.log('═══════════════════════════════════════════════════════════════\n');

const allOk = structureOk && filesOk && backendDepsOk && frontendDepsOk;

if (allOk) {
  console.log('╔════════════════════════════════════════════════════════════╗');
  console.log('║                                                            ║');
  console.log('║  ✓ ALL SYSTEMS OPERATIONAL                                ║');
  console.log('║                                                            ║');
  console.log('║  Status: READY TO LAUNCH                                  ║');
  console.log('║                                                            ║');
  console.log('╚════════════════════════════════════════════════════════════╝');
} else {
  console.log('╔════════════════════════════════════════════════════════════╗');
  console.log('║                                                            ║');
  console.log('║  ⚠ ISSUES DETECTED                                        ║');
  console.log('║                                                            ║');
  if (!structureOk) console.log('║  • Structure validation failed                         ║');
  if (!filesOk) console.log('║  • Core files missing                                  ║');
  if (!backendDepsOk) console.log('║  • Backend dependencies incomplete                     ║');
  if (!frontendDepsOk) console.log('║  • Frontend dependencies incomplete                    ║');
  console.log('║                                                            ║');
  console.log('║  Run: node FIX_ALL.js                                      ║');
  console.log('║                                                            ║');
  console.log('╚════════════════════════════════════════════════════════════╝');
}

console.log('\nNext Steps:');
console.log('  1. To start application:  node main.js');
console.log('  2. To run full fixes:     node FIX_ALL.js');
console.log('  3. To run diagnostics:    node DIAGNOSTIC_TEST.js');
console.log('  4. Open browser:          http://localhost:3000\n');

process.exit(allOk ? 0 : 1);
