#!/usr/bin/env node

/**
 * ============================================================================
 * AUTOMATED STARTUP & DEPENDENCY FIX
 * ============================================================================
 * This script ensures all dependencies are properly installed and then
 * starts the application
 * ============================================================================
 */

const fs = require('fs');
const path = require('path');
const { execSync, spawn } = require('child_process');

const PROJECT_ROOT = __dirname;
const BACKEND_DIR = path.join(PROJECT_ROOT, 'backend');
const FRONTEND_DIR = path.join(PROJECT_ROOT, 'frontend');

console.log('\n╔════════════════════════════════════════════════════╗');
console.log('║  🚀 STARTING OFFENSIVE SECURITY ESCAPE ROOM        ║');
console.log('║  Automated Startup & Dependency Fix                ║');
console.log('╚════════════════════════════════════════════════════╝\n');

// ============================================================================
// STEP 1: VERIFY BACKEND DEPENDENCIES
// ============================================================================

console.log('📦 Step 1: Verifying Backend Dependencies');
console.log('─'.repeat(50));

const requiredBackendPackages = ['express', 'express-session', 'cors', 'dotenv', 'uuid'];
const backendNodeModules = path.join(BACKEND_DIR, 'node_modules');

let backendNeedsInstall = !fs.existsSync(backendNodeModules);

if (!backendNeedsInstall) {
  for (const pkg of requiredBackendPackages) {
    const pkgPath = path.join(backendNodeModules, pkg);
    if (!fs.existsSync(pkgPath)) {
      console.log(`⚠ Missing package: ${pkg}`);
      backendNeedsInstall = true;
      break;
    }
  }
}

if (backendNeedsInstall) {
  console.log('⚡ Installing backend dependencies...');
  try {
    execSync('npm install --force', {
      cwd: BACKEND_DIR,
      stdio: 'inherit',
      timeout: 120000,
    });
    console.log('✓ Backend dependencies installed\n');
  } catch (err) {
    console.error('✗ Failed to install backend dependencies');
    console.error('Error:', err.message);
    process.exit(1);
  }
} else {
  console.log('✓ Backend dependencies verified\n');
}

// ============================================================================
// STEP 2: VERIFY FRONTEND DEPENDENCIES
// ============================================================================

console.log('📦 Step 2: Verifying Frontend Dependencies');
console.log('─'.repeat(50));

const requiredFrontendPackages = ['react', 'react-dom'];
const frontendNodeModules = path.join(FRONTEND_DIR, 'node_modules');

let frontendNeedsInstall = !fs.existsSync(frontendNodeModules);

if (!frontendNeedsInstall) {
  for (const pkg of requiredFrontendPackages) {
    const pkgPath = path.join(frontendNodeModules, pkg);
    if (!fs.existsSync(pkgPath)) {
      console.log(`⚠ Missing package: ${pkg}`);
      frontendNeedsInstall = true;
      break;
    }
  }
}

if (frontendNeedsInstall) {
  console.log('⚡ Installing frontend dependencies...');
  try {
    execSync('npm install --force', {
      cwd: FRONTEND_DIR,
      stdio: 'inherit',
      timeout: 180000,
    });
    console.log('✓ Frontend dependencies installed\n');
  } catch (err) {
    console.error('✗ Failed to install frontend dependencies');
    console.error('Error:', err.message);
    process.exit(1);
  }
} else {
  console.log('✓ Frontend dependencies verified\n');
}

// ============================================================================
// STEP 3: VERIFY ENVIRONMENT FILES
// ============================================================================

console.log('⚙️  Step 3: Verifying Environment Files');
console.log('─'.repeat(50));

const backendEnvPath = path.join(BACKEND_DIR, '.env');
if (!fs.existsSync(backendEnvPath)) {
  const timestamp = Math.floor(Date.now() / 1000);
  const envContent = `# Offensive Security Escape Room - Backend Configuration
NODE_ENV=development
PORT=5000
FRONTEND_URL=http://localhost:3000
CORS_ORIGIN=http://localhost:3000
SESSION_SECRET=offensive-sec-quiz-secret-${timestamp}
LOG_LEVEL=info
SESSION_TIMEOUT=1500000
`;
  fs.writeFileSync(backendEnvPath, envContent);
  console.log('✓ Backend .env created');
} else {
  console.log('✓ Backend .env exists');
}

const frontendEnvPath = path.join(FRONTEND_DIR, '.env');
if (!fs.existsSync(frontendEnvPath)) {
  const envContent = `# Offensive Security Escape Room - Frontend Configuration
REACT_APP_API_URL=http://localhost:5000/api
REACT_APP_API_BASE=http://localhost:5000
BROWSER=none
`;
  fs.writeFileSync(frontendEnvPath, envContent);
  console.log('✓ Frontend .env created');
} else {
  console.log('✓ Frontend .env exists');
}
console.log('');

// ============================================================================
// STEP 4: START APPLICATION WITH main.js
// ============================================================================

console.log('🚀 Step 4: Starting Application');
console.log('─'.repeat(50));
console.log('');

const mainScript = path.join(PROJECT_ROOT, 'main.js');
const mainProcess = spawn('node', [mainScript], {
  cwd: PROJECT_ROOT,
  stdio: 'inherit',
  env: {
    ...process.env,
  },
});

mainProcess.on('error', (err) => {
  console.error('Failed to start application:', err.message);
  process.exit(1);
});

mainProcess.on('exit', (code) => {
  process.exit(code);
});

// Handle Ctrl+C
process.on('SIGINT', () => {
  console.log('\n\nShutting down...');
  mainProcess.kill();
  process.exit(0);
});
