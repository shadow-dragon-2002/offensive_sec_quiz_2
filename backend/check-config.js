#!/usr/bin/env node

/**
 * Environment and Configuration Validator
 * Verifies all environment variables, configurations, and system requirements
 */

const fs = require('fs');
const path = require('path');

// Colors for output
const Colors = {
  RESET: '\x1b[0m',
  GREEN: '\x1b[32m',
  RED: '\x1b[31m',
  YELLOW: '\x1b[33m',
  BLUE: '\x1b[34m',
  CYAN: '\x1b[36m',
};

const log = {
  success: (msg) => console.log(`${Colors.GREEN}✓ ${msg}${Colors.RESET}`),
  error: (msg) => console.log(`${Colors.RED}✗ ${msg}${Colors.RESET}`),
  warn: (msg) => console.log(`${Colors.YELLOW}⚠ ${msg}${Colors.RESET}`),
  info: (msg) => console.log(`${Colors.BLUE}ℹ ${msg}${Colors.RESET}`),
  section: (msg) => {
    console.log('');
    console.log(`${Colors.CYAN}════════════════════════════════════${Colors.RESET}`);
    console.log(`${Colors.CYAN}  ${msg}${Colors.RESET}`);
    console.log(`${Colors.CYAN}════════════════════════════════════${Colors.RESET}`);
    console.log('');
  },
};

const checks = {
  // Check Node.js version
  nodeVersion: () => {
    log.info('Checking Node.js version...');
    const version = process.version;
    const majorVersion = parseInt(version.split('.')[0].substring(1));
    
    if (majorVersion >= 14) {
      log.success(`Node.js ${version} (>= 14 required)`);
      return true;
    } else {
      log.error(`Node.js ${version} detected. Version 14+ is required`);
      return false;
    }
  },

  // Check npm version
  npmVersion: () => {
    log.info('Checking npm version...');
    const { execSync } = require('child_process');
    try {
      const version = execSync('npm -v', { encoding: 'utf-8' }).trim();
      const majorVersion = parseInt(version.split('.')[0]);
      
      if (majorVersion >= 6) {
        log.success(`npm ${version} (>= 6 required)`);
        return true;
      } else {
        log.error(`npm ${version} detected. Version 6+ is required`);
        return false;
      }
    } catch (err) {
      log.error('npm not found');
      return false;
    }
  },

  // Check directory structure
  directoryStructure: () => {
    log.info('Checking directory structure...');
    const requiredDirs = ['backend', 'frontend'];
    const projectRoot = path.resolve(__dirname, '..');
    let allPresent = true;

    for (const dir of requiredDirs) {
      const dirPath = path.join(projectRoot, dir);
      if (fs.existsSync(dirPath)) {
        log.success(`${dir}/ directory exists`);
      } else {
        log.error(`${dir}/ directory missing`);
        allPresent = false;
      }
    }

    return allPresent;
  },

  // Check required files
  requiredFiles: () => {
    log.info('Checking required files...');
    const projectRoot = path.resolve(__dirname, '..');
    const requiredFiles = [
      'backend/package.json',
      'backend/src/server.js',
      'backend/src/routes/quiz.js',
      'backend/src/models/Session.js',
      'frontend/package.json',
      'frontend/src/App.js',
      'frontend/src/index.js',
    ];

    let allPresent = true;
    for (const file of requiredFiles) {
      const filePath = path.join(projectRoot, file);
      if (fs.existsSync(filePath)) {
        log.success(`${file} exists`);
      } else {
        log.error(`${file} missing`);
        allPresent = false;
      }
    }

    return allPresent;
  },

  // Check dependencies
  dependencies: () => {
    log.info('Checking dependencies...');
    const projectRoot = path.resolve(__dirname, '..');
    const backendModules = path.join(projectRoot, 'backend/node_modules');
    const frontendModules = path.join(projectRoot, 'frontend/node_modules');

    let allPresent = true;

    if (fs.existsSync(backendModules)) {
      log.success('Backend dependencies installed');
    } else {
      log.warn('Backend dependencies not installed. Run: cd backend && npm install');
      allPresent = false;
    }

    if (fs.existsSync(frontendModules)) {
      log.success('Frontend dependencies installed');
    } else {
      log.warn('Frontend dependencies not installed. Run: cd frontend && npm install');
      allPresent = false;
    }

    return allPresent;
  },

  // Check environment file
  environmentFile: () => {
    log.info('Checking environment configuration...');
    const projectRoot = path.resolve(__dirname, '..');
    const envFile = path.join(projectRoot, 'backend/.env');

    if (fs.existsSync(envFile)) {
      log.success('.env file exists');
      
      // Verify required variables
      const envContent = fs.readFileSync(envFile, 'utf-8');
      const required = ['PORT', 'NODE_ENV'];
      let allPresent = true;

      for (const variable of required) {
        if (envContent.includes(variable)) {
          log.success(`  ${variable} configured`);
        } else {
          log.warn(`  ${variable} not configured`);
          allPresent = false;
        }
      }

      return allPresent;
    } else {
      log.warn('.env file not found. This will be created at startup.');
      return true; // Not critical - will be auto-created
    }
  },

  // Check port availability
  portAvailability: () => {
    log.info('Checking port availability...');
    const net = require('net');
    const ports = { 5000: 'Backend', 3000: 'Frontend' };
    let available = true;

    Object.entries(ports).forEach(([port, name]) => {
      const server = net.createServer();
      server.once('error', (err) => {
        if (err.code === 'EADDRINUSE') {
          log.warn(`Port ${port} (${name}) is already in use`);
          available = false;
        } else {
          throw err;
        }
      });
      server.once('listening', () => {
        server.close();
        log.success(`Port ${port} (${name}) is available`);
      });
      server.listen(port);
    });

    return available;
  },

  // Check data files
  dataFiles: () => {
    log.info('Checking data files...');
    const projectRoot = path.resolve(__dirname, '..');
    const dataFiles = [
      'backend/src/data/questions.js',
      'backend/src/data/escapeRoomQuestions.js',
    ];

    let allPresent = true;
    for (const file of dataFiles) {
      const filePath = path.join(projectRoot, file);
      if (fs.existsSync(filePath)) {
        log.success(`${path.basename(file)} exists`);
      } else {
        log.warn(`${file} missing`);
        allPresent = false;
      }
    }

    return allPresent;
  },
};

const runValidation = () => {
  log.section('SYSTEM CONFIGURATION VALIDATOR');

  const results = {
    critical: [],
    warnings: [],
  };

  // Run critical checks
  log.section('CRITICAL CHECKS');
  const criticalChecks = [
    { name: 'Node.js Version', check: checks.nodeVersion },
    { name: 'npm Version', check: checks.npmVersion },
    { name: 'Directory Structure', check: checks.directoryStructure },
    { name: 'Required Files', check: checks.requiredFiles },
  ];

  for (const test of criticalChecks) {
    try {
      const passed = test.check();
      results.critical.push({ name: test.name, passed });
    } catch (err) {
      log.error(`${test.name} check failed: ${err.message}`);
      results.critical.push({ name: test.name, passed: false });
    }
  }

  // Run warning checks
  log.section('OPTIONAL CHECKS');
  const warningChecks = [
    { name: 'Dependencies', check: checks.dependencies },
    { name: 'Environment Configuration', check: checks.environmentFile },
    { name: 'Data Files', check: checks.dataFiles },
  ];

  for (const test of warningChecks) {
    try {
      const passed = test.check();
      results.warnings.push({ name: test.name, passed });
    } catch (err) {
      log.warn(`${test.name} check failed: ${err.message}`);
      results.warnings.push({ name: test.name, passed: false });
    }
  }

  // Print summary
  log.section('VALIDATION SUMMARY');

  const criticalPassed = results.critical.filter((r) => r.passed).length;
  const criticalTotal = results.critical.length;
  const warningPassed = results.warnings.filter((r) => r.passed).length;
  const warningTotal = results.warnings.length;

  log.info(`Critical: ${criticalPassed}/${criticalTotal} passed`);
  log.info(`Optional: ${warningPassed}/${warningTotal} passed`);

  if (criticalPassed === criticalTotal) {
    log.success('✓ System is ready for operation');
    return 0;
  } else {
    log.error(`✗ ${criticalTotal - criticalPassed} critical checks failed`);
    return 1;
  }
};

const exitCode = runValidation();
process.exit(exitCode);
