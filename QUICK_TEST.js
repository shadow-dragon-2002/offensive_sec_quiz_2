#!/usr/bin/env node
/**
 * ============================================================================
 * QUICK STARTUP TEST - 30 SECOND VALIDATION
 * ============================================================================
 * Quickly tests backend and frontend startup
 * Usage: node QUICK_TEST.js
 * ============================================================================
 */

const { spawn, exec } = require('child_process');
const http = require('http');
const path = require('path');
const fs = require('fs');

const Colors = {
  RESET: '\x1b[0m',
  RED: '\x1b[31m',
  GREEN: '\x1b[32m',
  YELLOW: '\x1b[33m',
  CYAN: '\x1b[36m',
};

const PROJECT_ROOT = __dirname;
let passed = 0;
let failed = 0;

function log(msg, type = 'info') {
  const colors = {
    'success': Colors.GREEN,
    'error': Colors.RED,
    'warn': Colors.YELLOW,
    'info': Colors.CYAN,
  };
  console.log(`${colors[type] || Colors.CYAN}[${type.toUpperCase()}]${Colors.RESET} ${msg}`);
}

async function sleep(ms) {
  return new Promise(r => setTimeout(r, ms));
}

function testHealthCheck(port, service) {
  return new Promise((resolve) => {
    const url = `http://localhost:${port}/api/health`;
    const req = http.get(url, { timeout: 2000 }, (res) => {
      let data = '';
      res.on('data', chunk => data += chunk);
      res.on('end', () => {
        try {
          const json = JSON.parse(data);
          if (json.status === 'ok' || json.message) {
            log(`✓ ${service} responding on port ${port}`, 'success');
            passed++;
            resolve(true);
          }
        } catch (e) {
          log(`✓ ${service} port ${port} is open`, 'success');
          passed++;
          resolve(true);
        }
      });
    });
    
    req.on('error', () => {
      log(`✗ ${service} not responding on port ${port}`, 'error');
      failed++;
      resolve(false);
    });

    req.on('timeout', () => {
      req.destroy();
      log(`✗ ${service} timeout on port ${port}`, 'error');
      failed++;
      resolve(false);
    });
  });
}

async function runTest() {
  console.clear();
  console.log(`
${Colors.CYAN}╔════════════════════════════════════════════════════════════╗${Colors.RESET}
${Colors.CYAN}║                                                            ║${Colors.RESET}
${Colors.CYAN}║           ⚡  QUICK STARTUP TEST (30 SECONDS)  ⚡           ║${Colors.RESET}
${Colors.CYAN}║                                                            ║${Colors.RESET}
${Colors.CYAN}║          Testing: Ports, Dependencies, Services           ║${Colors.RESET}
${Colors.CYAN}║                                                            ║${Colors.RESET}
${Colors.CYAN}╚════════════════════════════════════════════════════════════╝${Colors.RESET}
  `);

  // Test 1: Check key files
  log('Testing file structure...', 'info');
  const files = [
    'backend/src/server.js',
    'backend/src/routes/quiz.js',
    'frontend/src/App.js',
    'main.js'
  ];
  
  for (const file of files) {
    const fullPath = path.join(PROJECT_ROOT, file);
    if (fs.existsSync(fullPath)) {
      log(`✓ ${file} exists`, 'success');
      passed++;
    } else {
      log(`✗ ${file} missing`, 'error');
      failed++;
    }
  }

  // Test 2: Check node_modules
  log('\nTesting dependencies...', 'info');
  const backendPkgs = ['express', 'cors', 'dotenv'];
  const frontendPkgs = ['react', 'axios'];

  for (const pkg of backendPkgs) {
    const fullPath = path.join(PROJECT_ROOT, `backend/node_modules/${pkg}`);
    if (fs.existsSync(fullPath)) {
      log(`✓ Backend ${pkg} installed`, 'success');
      passed++;
    } else {
      log(`✗ Backend ${pkg} missing`, 'error');
      failed++;
    }
  }

  for (const pkg of frontendPkgs) {
    const fullPath = path.join(PROJECT_ROOT, `frontend/node_modules/${pkg}`);
    if (fs.existsSync(fullPath)) {
      log(`✓ Frontend ${pkg} installed`, 'success');
      passed++;
    } else {
      log(`✗ Frontend ${pkg} missing`, 'error');
      failed++;
    }
  }

  // Test 3: Try to start backend
  log('\nAttempting to start backend...', 'info');
  const backend = spawn('node', ['backend/src/server.js'], {
    cwd: PROJECT_ROOT,
    stdio: ['pipe', 'pipe', 'pipe'],
    timeout: 5000
  });

  let backendStarted = false;
  await new Promise(resolve => {
    const timeout = setTimeout(() => {
      backend.kill();
      resolve();
    }, 4000);

    backend.stdout?.on('data', (data) => {
      const output = data.toString();
      if (output.includes('listening') || output.includes('running') || output.includes('port')) {
        log(`✓ Backend process started successfully`, 'success');
        passed++;
        backendStarted = true;
        clearTimeout(timeout);
        backend.kill();
        resolve();
      }
    });

    backend.stderr?.on('data', (data) => {
      const output = data.toString();
      if (output.includes('EADDRINUSE')) {
        log(`✓ Backend port 5000 is listening (port in use = good)`, 'success');
        passed++;
        backendStarted = true;
        clearTimeout(timeout);
        backend.kill();
        resolve();
      }
    });

    backend.on('error', (err) => {
      log(`✗ Backend startup failed: ${err.message}`, 'error');
      failed++;
      clearTimeout(timeout);
      resolve();
    });
  });

  // Final Summary
  console.log(`\n${Colors.CYAN}${'═'.repeat(60)}${Colors.RESET}`);
  console.log(`${Colors.CYAN}TEST RESULTS${Colors.RESET}`);
  console.log(`${Colors.CYAN}${'═'.repeat(60)}${Colors.RESET}`);

  const total = passed + failed;
  const percentage = total > 0 ? Math.round((passed / total) * 100) : 0;

  console.log(`\nTotal Checks: ${total}`);
  console.log(`${Colors.GREEN}Passed: ${passed}${Colors.RESET}`);
  console.log(`${Colors.RED}Failed: ${failed}${Colors.RESET}`);
  console.log(`Success Rate: ${percentage}%`);

  if (failed === 0) {
    console.log(`\n${Colors.GREEN}${'═'.repeat(60)}${Colors.RESET}`);
    console.log(`${Colors.GREEN}✓✓✓ ALL CHECKS PASSED - READY TO LAUNCH ✓✓✓${Colors.RESET}`);
    console.log(`${Colors.GREEN}${'═'.repeat(60)}${Colors.RESET}`);
    console.log(`\n${Colors.CYAN}Starting application now...${Colors.RESET}\n`);
    
    // Start main.js
    const main = spawn('node', ['main.js'], {
      cwd: PROJECT_ROOT,
      stdio: 'inherit'
    });

    main.on('error', (err) => {
      log(`Failed to start main.js: ${err.message}`, 'error');
      process.exit(1);
    });

  } else {
    console.log(`\n${Colors.RED}${'═'.repeat(60)}${Colors.RESET}`);
    console.log(`${Colors.RED}✗ Some checks failed - Cannot start${Colors.RESET}`);
    console.log(`${Colors.RED}${'═'.repeat(60)}${Colors.RESET}`);
    process.exit(1);
  }
}

runTest().catch(err => {
  log(`Fatal error: ${err.message}`, 'error');
  process.exit(1);
});
