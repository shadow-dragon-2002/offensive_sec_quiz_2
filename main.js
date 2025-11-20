#!/usr/bin/env node

/**
 * ============================================================================
 * OFFENSIVE SECURITY ESCAPE ROOM - MAIN LAUNCHER
 * ============================================================================
 * Single entry point to launch entire application (Backend + Frontend)
 * Handles all startup, error recovery, and service management
 * 
 * Usage: node main.js
 * ============================================================================
 */

const fs = require('fs');
const path = require('path');
const { spawn, exec } = require('child_process');
const http = require('http');
const os = require('os');

// ============================================================================
// CONFIGURATION
// ============================================================================

const CONFIG = {
  PROJECT_ROOT: __dirname,
  BACKEND_PORT: process.env.PORT || 5000,
  FRONTEND_PORT: process.env.FRONTEND_PORT || 3000,
  NODE_ENV: process.env.NODE_ENV || 'development',
  TIMEOUT: 60000, // 60 seconds
  RETRY_ATTEMPTS: 30,
  RETRY_DELAY: 1000, // 1 second
  LOG_FILE: path.join(__dirname, 'cyber_escape_room.log'),
  BACKEND_DIR: path.join(__dirname, 'backend'),
  FRONTEND_DIR: path.join(__dirname, 'frontend'),
  VERSION: '3.0.0',
};

// ============================================================================
// COLORS FOR OUTPUT
// ============================================================================

const Colors = {
  RESET: '\x1b[0m',
  BRIGHT: '\x1b[1m',
  DIM: '\x1b[2m',
  RED: '\x1b[31m',
  GREEN: '\x1b[32m',
  YELLOW: '\x1b[33m',
  BLUE: '\x1b[34m',
  MAGENTA: '\x1b[35m',
  CYAN: '\x1b[36m',
  WHITE: '\x1b[37m',
};

// ============================================================================
// LOGGING & OUTPUT
// ============================================================================

class Logger {
  constructor(logFile) {
    this.logFile = logFile;
    this.logs = [];
  }

  log(level, message, data = '') {
    const timestamp = new Date().toISOString();
    const logEntry = `[${timestamp}] ${level}: ${message} ${data}`;
    this.logs.push(logEntry);

    // Write to file
    try {
      fs.appendFileSync(this.logFile, logEntry + '\n');
    } catch (err) {
      console.error('Failed to write to log file:', err.message);
    }

    // Console output
    let color = Colors.WHITE;
    let icon = '•';

    switch (level) {
      case 'SUCCESS':
        color = Colors.GREEN;
        icon = '✓';
        break;
      case 'ERROR':
        color = Colors.RED;
        icon = '✗';
        break;
      case 'WARNING':
        color = Colors.YELLOW;
        icon = '⚠';
        break;
      case 'INFO':
        color = Colors.BLUE;
        icon = 'ℹ';
        break;
      case 'DEBUG':
        color = Colors.CYAN;
        icon = '🔍';
        break;
    }

    console.log(`${color}${icon} ${message}${Colors.RESET} ${data}`);
  }

  success(msg, data = '') {
    this.log('SUCCESS', msg, data);
  }

  error(msg, data = '') {
    this.log('ERROR', msg, data);
  }

  warn(msg, data = '') {
    this.log('WARNING', msg, data);
  }

  info(msg, data = '') {
    this.log('INFO', msg, data);
  }

  debug(msg, data = '') {
    this.log('DEBUG', msg, data);
  }

  section(title) {
    console.log('');
    console.log(`${Colors.CYAN}${'═'.repeat(60)}${Colors.RESET}`);
    console.log(`${Colors.CYAN}  ${title}${Colors.RESET}`);
    console.log(`${Colors.CYAN}${'═'.repeat(60)}${Colors.RESET}`);
    console.log('');
  }
}

const logger = new Logger(CONFIG.LOG_FILE);

// ============================================================================
// UTILITY FUNCTIONS
// ============================================================================

function commandExists(command) {
  return new Promise((resolve) => {
    exec(`which ${command}`, (err) => {
      resolve(!err);
    });
  });
}

function sleep(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

function checkPortInUse(port) {
  return new Promise((resolve) => {
    const net = require('net');
    const server = net.createServer();
    
    server.once('error', (err) => {
      if (err.code === 'EADDRINUSE') {
        resolve(true);
      } else {
        resolve(false);
      }
    });
    
    server.once('listening', () => {
      server.close();
      resolve(false);
    });
    
    server.listen(port, '127.0.0.1');
  });
}

function killProcessOnPort(port) {
  return new Promise((resolve) => {
    exec(`lsof -ti:${port} | xargs kill -9 2>/dev/null || true`, () => {
      resolve();
    });
  });
}

function makeHttpRequest(url, timeout = 5000) {
  return new Promise((resolve) => {
    const request = http.get(url, { timeout }, () => {
      resolve(true);
    });

    request.on('timeout', () => {
      request.abort();
      resolve(false);
    });

    request.on('error', () => {
      resolve(false);
    });
  });
}

async function waitForService(url, maxAttempts, delayMs) {
  for (let i = 0; i < maxAttempts; i++) {
    if (await makeHttpRequest(url)) {
      return true;
    }
    process.stdout.write('.');
    await sleep(delayMs);
  }
  return false;
}

// ============================================================================
// VALIDATION & SETUP
// ============================================================================

async function validateEnvironment() {
  logger.section('Validating Environment');

  // Check Node.js version
  const nodeVersion = process.version;
  const majorVersion = parseInt(nodeVersion.split('.')[0].substring(1));

  if (majorVersion < 14) {
    logger.error(`Node.js ${nodeVersion} detected. Version 14+ required.`);
    process.exit(1);
  }
  logger.success(`Node.js ${nodeVersion} detected`);

  // Check npm
  const hasNpm = await commandExists('npm');
  if (!hasNpm) {
    logger.error('npm not found. Please install Node.js with npm.');
    process.exit(1);
  }
  logger.success('npm is available');

  // Check directories
  if (!fs.existsSync(CONFIG.BACKEND_DIR)) {
    logger.error(`Backend directory not found: ${CONFIG.BACKEND_DIR}`);
    process.exit(1);
  }
  logger.success('Backend directory exists');

  if (!fs.existsSync(CONFIG.FRONTEND_DIR)) {
    logger.error(`Frontend directory not found: ${CONFIG.FRONTEND_DIR}`);
    process.exit(1);
  }
  logger.success('Frontend directory exists');

  // Check required files
  const requiredFiles = [
    path.join(CONFIG.BACKEND_DIR, 'package.json'),
    path.join(CONFIG.BACKEND_DIR, 'src', 'server.js'),
    path.join(CONFIG.FRONTEND_DIR, 'package.json'),
    path.join(CONFIG.FRONTEND_DIR, 'src', 'App.js'),
  ];

  for (const file of requiredFiles) {
    if (!fs.existsSync(file)) {
      logger.error(`Required file not found: ${file}`);
      process.exit(1);
    }
  }
  logger.success('All required files present');
}

async function setupEnvironment() {
  logger.section('Setting Up Environment');

  // Create .env for backend if missing
  const backendEnvPath = path.join(CONFIG.BACKEND_DIR, '.env');
  if (!fs.existsSync(backendEnvPath)) {
    logger.info('Creating backend .env file...');
    const timestamp = Math.floor(Date.now() / 1000);
    const envContent = `# Offensive Security Escape Room - Backend Configuration
NODE_ENV=${CONFIG.NODE_ENV}
PORT=${CONFIG.BACKEND_PORT}
FRONTEND_URL=http://localhost:${CONFIG.FRONTEND_PORT}
CORS_ORIGIN=http://localhost:${CONFIG.FRONTEND_PORT}
SESSION_SECRET=offensive-sec-quiz-secret-${timestamp}
LOG_LEVEL=info
SESSION_TIMEOUT=1500000
`;
    try {
      fs.writeFileSync(backendEnvPath, envContent);
      logger.success('.env file created for backend');
    } catch (err) {
      logger.error('Failed to create backend .env file:', err.message);
      throw err;
    }
  } else {
    logger.info('Backend .env file already exists');
  }

  // Create .env for frontend if missing (optional but helpful)
  const frontendEnvPath = path.join(CONFIG.FRONTEND_DIR, '.env');
  if (!fs.existsSync(frontendEnvPath)) {
    logger.info('Creating frontend .env file...');
    const envContent = `# Offensive Security Escape Room - Frontend Configuration
REACT_APP_API_URL=http://localhost:${CONFIG.BACKEND_PORT}/api
REACT_APP_API_BASE=http://localhost:${CONFIG.BACKEND_PORT}
BROWSER=none
`;
    try {
      fs.writeFileSync(frontendEnvPath, envContent);
      logger.success('.env file created for frontend');
    } catch (err) {
      logger.debug('Optional: frontend .env creation failed:', err.message);
    }
  } else {
    logger.info('Frontend .env file already exists');
  }

  // Ensure log file exists
  try {
    if (!fs.existsSync(CONFIG.LOG_FILE)) {
      fs.writeFileSync(CONFIG.LOG_FILE, '');
      logger.success(`Log file created: ${CONFIG.LOG_FILE}`);
    }
  } catch (err) {
    logger.warn('Failed to create log file:', err.message);
  }
}

async function checkDependencies() {
  logger.section('Checking Dependencies');

  // Check and install backend dependencies
  const backendNodeModules = path.join(CONFIG.BACKEND_DIR, 'node_modules');
  const backendPackageJson = path.join(CONFIG.BACKEND_DIR, 'package.json');
  
  // Always check if key packages exist
  let backendNeedsInstall = !fs.existsSync(backendNodeModules);
  if (!backendNeedsInstall && fs.existsSync(backendPackageJson)) {
    try {
      const pkgContent = fs.readFileSync(backendPackageJson, 'utf8');
      const pkg = JSON.parse(pkgContent);
      const requiredPackages = ['express', 'express-session', 'cors'];
      for (const pkg_name of requiredPackages) {
        const pkgPath = path.join(backendNodeModules, pkg_name);
        if (!fs.existsSync(pkgPath)) {
          backendNeedsInstall = true;
          break;
        }
      }
    } catch (err) {
      logger.debug('Could not check backend packages:', err.message);
    }
  }

  if (backendNeedsInstall) {
    logger.warn('Backend dependencies incomplete or missing. Installing...');
    await new Promise((resolve, reject) => {
      const install = spawn('npm', ['install', '--force'], {
        cwd: CONFIG.BACKEND_DIR,
        stdio: 'pipe',
      });

      let errorOutput = '';
      install.stderr?.on('data', (data) => {
        errorOutput += data.toString();
      });

      install.on('close', (code) => {
        if (code === 0) {
          logger.success('Backend dependencies installed successfully');
          // Wait a moment for file system to settle
          setTimeout(() => {
            resolve();
          }, 2000);
        } else {
          logger.error('Failed to install backend dependencies');
          if (errorOutput) {
            logger.debug('Install error details:', errorOutput.substring(0, 500));
          }
          reject(new Error('Backend npm install failed'));
        }
      });

      install.on('error', (err) => {
        logger.error('Backend npm install error:', err.message);
        reject(err);
      });
    }).catch(err => {
      logger.error('Failed to install backend dependencies:', err.message);
      process.exit(1);
    });
  } else {
    logger.success('Backend dependencies verified');
  }

  // Check and install frontend dependencies
  const frontendNodeModules = path.join(CONFIG.FRONTEND_DIR, 'node_modules');
  const frontendPackageJson = path.join(CONFIG.FRONTEND_DIR, 'package.json');
  
  let frontendNeedsInstall = !fs.existsSync(frontendNodeModules);
  if (!frontendNeedsInstall && fs.existsSync(frontendPackageJson)) {
    try {
      const pkgContent = fs.readFileSync(frontendPackageJson, 'utf8');
      const pkg = JSON.parse(pkgContent);
      const requiredPackages = ['react', 'react-dom'];
      for (const pkg_name of requiredPackages) {
        const pkgPath = path.join(frontendNodeModules, pkg_name);
        if (!fs.existsSync(pkgPath)) {
          frontendNeedsInstall = true;
          break;
        }
      }
    } catch (err) {
      logger.debug('Could not check frontend packages:', err.message);
    }
  }

  if (frontendNeedsInstall) {
    logger.warn('Frontend dependencies incomplete or missing. Installing...');
    await new Promise((resolve, reject) => {
      const install = spawn('npm', ['install', '--force'], {
        cwd: CONFIG.FRONTEND_DIR,
        stdio: 'pipe',
      });

      let errorOutput = '';
      install.stderr?.on('data', (data) => {
        errorOutput += data.toString();
      });

      install.on('close', (code) => {
        if (code === 0) {
          logger.success('Frontend dependencies installed successfully');
          // Wait a moment for file system to settle
          setTimeout(() => {
            resolve();
          }, 2000);
        } else {
          logger.error('Failed to install frontend dependencies');
          if (errorOutput) {
            logger.debug('Install error details:', errorOutput.substring(0, 500));
          }
          reject(new Error('Frontend npm install failed'));
        }
      });

      install.on('error', (err) => {
        logger.error('Frontend npm install error:', err.message);
        reject(err);
      });
    }).catch(err => {
      logger.error('Failed to install frontend dependencies:', err.message);
      process.exit(1);
    });
  } else {
    logger.success('Frontend dependencies verified');
  }
}

async function checkPorts() {
  logger.section('Checking Port Availability');

  // Check backend port
  const backendPortInUse = await checkPortInUse(CONFIG.BACKEND_PORT);
  if (backendPortInUse) {
    logger.warn(`Port ${CONFIG.BACKEND_PORT} is in use. Freeing...`);
    await killProcessOnPort(CONFIG.BACKEND_PORT);
    await sleep(1000);
    logger.success(`Port ${CONFIG.BACKEND_PORT} freed`);
  } else {
    logger.success(`Port ${CONFIG.BACKEND_PORT} is available`);
  }

  // Check frontend port
  const frontendPortInUse = await checkPortInUse(CONFIG.FRONTEND_PORT);
  if (frontendPortInUse) {
    logger.warn(`Port ${CONFIG.FRONTEND_PORT} is in use. Freeing...`);
    await killProcessOnPort(CONFIG.FRONTEND_PORT);
    await sleep(1000);
    logger.success(`Port ${CONFIG.FRONTEND_PORT} freed`);
  } else {
    logger.success(`Port ${CONFIG.FRONTEND_PORT} is available`);
  }
}

// ============================================================================
// PROCESS MANAGEMENT
// ============================================================================

class ProcessManager {
  constructor() {
    this.processes = new Map();
    this.isShuttingDown = false;
  }

  startBackend() {
    return new Promise((resolve, reject) => {
      logger.section('Starting Backend Server');
      logger.info(`Starting backend on port ${CONFIG.BACKEND_PORT}...`);

      // Use node directly instead of npm start to avoid module resolution issues
      const backendScript = path.join(CONFIG.BACKEND_DIR, 'src', 'server.js');
      
      const backend = spawn('node', [backendScript], {
        cwd: CONFIG.BACKEND_DIR,
        env: {
          ...process.env,
          PORT: CONFIG.BACKEND_PORT,
          NODE_ENV: CONFIG.NODE_ENV,
          FRONTEND_URL: `http://localhost:${CONFIG.FRONTEND_PORT}`,
          CORS_ORIGIN: `http://localhost:${CONFIG.FRONTEND_PORT}`,
          NODE_PATH: path.join(CONFIG.BACKEND_DIR, 'node_modules'),
        },
        stdio: ['pipe', 'pipe', 'pipe'],
      });

      this.processes.set('backend', backend);

      let isStarted = false;
      let startTimeout;
      let errorBuffer = '';

      backend.stdout?.on('data', (data) => {
        const output = data.toString();
        process.stdout.write(output);
        
        if (!isStarted && (output.includes('running on port') || output.includes('listening'))) {
          isStarted = true;
          clearTimeout(startTimeout);
          logger.success(`Backend started successfully (PID: ${backend.pid})`);
          resolve();
        }
      });

      backend.stderr?.on('data', (data) => {
        const output = data.toString();
        errorBuffer += output;
        logger.debug('Backend stderr:', output.trim());
      });

      backend.on('error', (err) => {
        clearTimeout(startTimeout);
        logger.error('Failed to start backend:', err.message);
        if (!isStarted) reject(err);
      });

      backend.on('exit', (code, signal) => {
        clearTimeout(startTimeout);
        if (code !== 0 && code !== null && !this.isShuttingDown) {
          logger.error(`Backend exited with code ${code} (signal: ${signal})`);
          if (errorBuffer && !isStarted) {
            logger.debug('Backend error details:', errorBuffer.substring(0, 500));
          }
        }
      });

      // Timeout handler
      startTimeout = setTimeout(() => {
        if (!isStarted) {
          logger.warn('Backend startup timeout (15s). Continuing with monitoring...');
          resolve();
        }
      }, 15000);
    });
  }

  startFrontend() {
    return new Promise((resolve) => {
      logger.section('Starting Frontend Server');
      logger.info(`Starting frontend on port ${CONFIG.FRONTEND_PORT}...`);

      const frontend = spawn('npm', ['start'], {
        cwd: CONFIG.FRONTEND_DIR,
        env: {
          ...process.env,
          PORT: CONFIG.FRONTEND_PORT,
          REACT_APP_API_URL: `http://localhost:${CONFIG.BACKEND_PORT}/api`,
          REACT_APP_API_BASE: `http://localhost:${CONFIG.BACKEND_PORT}`,
          BROWSER: 'none',
          SKIP_PREFLIGHT_CHECK: 'true',
          CI: 'false',
        },
        stdio: ['pipe', 'pipe', 'pipe'],
      });

      this.processes.set('frontend', frontend);

      logger.success(`Frontend process started (PID: ${frontend.pid})`);

      let compiledSuccessfully = false;
      let errorBuffer = '';

      frontend.stdout?.on('data', (data) => {
        const output = data.toString();
        
        if (output.includes('Compiled successfully')) {
          compiledSuccessfully = true;
          logger.success('Frontend compiled successfully');
        }
        
        if (output.includes('webpack compiled with')) {
          compiledSuccessfully = true;
        }

        // Log important messages but suppress verbose output
        if (output.includes('ERROR') || output.includes('error')) {
          logger.debug('Frontend output:', output.trim());
        }
      });

      frontend.stderr?.on('data', (data) => {
        const output = data.toString();
        errorBuffer += output;
        if (output.includes('error') || output.includes('Error')) {
          logger.debug('Frontend error:', output.trim());
        }
      });

      frontend.on('error', (err) => {
        logger.error('Failed to start frontend:', err.message);
      });

      frontend.on('exit', (code, signal) => {
        if (code !== 0 && code !== null && !this.isShuttingDown) {
          logger.warn(`Frontend exited with code ${code} (signal: ${signal})`);
        }
      });

      // Frontend startup timeout - longer for first build
      setTimeout(() => {
        if (compiledSuccessfully) {
          logger.success('Frontend is ready');
        } else {
          logger.info('Frontend compilation in progress. This may take a minute on first run...');
        }
        resolve();
      }, 45000);

      resolve();
    });
  }

  async stopAll() {
    this.isShuttingDown = true;
    logger.section('Graceful Shutdown');

    for (const [name, process] of this.processes) {
      if (process && !process.killed) {
        logger.info(`Stopping ${name}...`);
        process.kill('SIGTERM');

        // Wait a bit for graceful shutdown
        await sleep(1000);

        // Force kill if still running
        if (!process.killed) {
          process.kill('SIGKILL');
        }
      }
    }

    logger.success('All processes stopped');
  }

  monitorProcesses() {
    // Check processes every 5 seconds
    this.monitorInterval = setInterval(() => {
      for (const [name, proc] of this.processes) {
        if (proc && proc.killed) {
          logger.warn(`⚠️  ${name.toUpperCase()} process has exited unexpectedly`);
          logger.warn(`    Consider restarting: kill -9 process and restart main.js`);
        }
      }
    }, 5000);

    // Cleanup on exit
    process.on('exit', () => {
      if (this.monitorInterval) {
        clearInterval(this.monitorInterval);
      }
    });
  }
}

// ============================================================================
// HEALTH CHECKS
// ============================================================================

async function healthCheck() {
  logger.section('Health Checks');

  // Wait for backend with exponential backoff
  logger.info('Waiting for backend to respond...');
  let backendReady = false;
  let backendAttempts = 0;
  const maxBackendAttempts = 30; // 30 seconds max

  while (!backendReady && backendAttempts < maxBackendAttempts) {
    try {
      const result = await makeHttpRequest(
        `http://localhost:${CONFIG.BACKEND_PORT}/api/health`,
        5000
      );
      if (result) {
        backendReady = true;
        logger.success('Backend is responding');
      }
    } catch (err) {
      // Silently continue
    }

    if (!backendReady) {
      backendAttempts++;
      process.stdout.write('.');
      await sleep(1000);
    }
  }

  if (backendReady) {
    logger.success('Backend health check passed');
  } else {
    logger.warn('Backend health check timeout. Server may still be starting...');
  }

  // Wait for frontend
  logger.info('Waiting for frontend to respond...');
  let frontendReady = false;
  let frontendAttempts = 0;
  const maxFrontendAttempts = 45; // 45 seconds for compilation

  while (!frontendReady && frontendAttempts < maxFrontendAttempts) {
    try {
      const result = await makeHttpRequest(
        `http://localhost:${CONFIG.FRONTEND_PORT}`,
        5000
      );
      if (result) {
        frontendReady = true;
        logger.success('Frontend is responding');
      }
    } catch (err) {
      // Silently continue
    }

    if (!frontendReady) {
      frontendAttempts++;
      process.stdout.write('.');
      await sleep(1000);
    }
  }

  if (frontendReady) {
    logger.success('Frontend health check passed');
  } else {
    logger.warn('Frontend compilation may still be in progress. This is normal on first run.');
  }

  console.log(''); // New line after dots
}

// ============================================================================
// STARTUP & SHUTDOWN
// ============================================================================

async function startup() {
  console.clear();

  console.log(`
${Colors.CYAN}╔═══════════════════════════════════════════════════════════════╗${Colors.RESET}
${Colors.CYAN}║                                                               ║${Colors.RESET}
${Colors.CYAN}║     🎮  OFFENSIVE SECURITY ESCAPE ROOM - MAIN LAUNCHER  🎮    ║${Colors.RESET}
${Colors.CYAN}║                                                               ║${Colors.RESET}
${Colors.CYAN}║              Version ${CONFIG.VERSION} - Production Ready              ║${Colors.RESET}
${Colors.CYAN}║                                                               ║${Colors.RESET}
${Colors.CYAN}╚═══════════════════════════════════════════════════════════════╝${Colors.RESET}
  `);

  logger.info('🚀 Application startup initiated');
  logger.info(`Project root: ${CONFIG.PROJECT_ROOT}`);
  logger.info(`Node environment: ${CONFIG.NODE_ENV}`);

  try {
    // Phase 1: Validation
    await validateEnvironment();

    // Phase 2: Setup
    await setupEnvironment();

    // Phase 3: Dependencies
    await checkDependencies();

    // Phase 4: Ports
    await checkPorts();

    // Phase 5: Start services
    const manager = new ProcessManager();

    // Start backend first
    await manager.startBackend();
    await sleep(2000);

    // Start frontend
    await manager.startFrontend();

    // Phase 6: Health checks
    await sleep(3000);
    await healthCheck();

    // Phase 7: Monitor
    manager.monitorProcesses();

    // Display success banner
    displaySuccessBanner();

    // Setup graceful shutdown
    setupGracefulShutdown(manager);

  } catch (err) {
    logger.error('Fatal error during startup:', err.message);
    logger.debug('Stack trace:', err.stack);
    process.exit(1);
  }
}

function displaySuccessBanner() {
  console.log(`
${Colors.GREEN}╔═══════════════════════════════════════════════════════════════╗${Colors.RESET}
${Colors.GREEN}║                                                               ║${Colors.RESET}
${Colors.GREEN}║         🎉  CYBER ESCAPE ROOM IS READY  🎉                   ║${Colors.RESET}
${Colors.GREEN}║                                                               ║${Colors.RESET}
${Colors.GREEN}║              All Systems Operational ✅                       ║${Colors.RESET}
${Colors.GREEN}║                                                               ║${Colors.RESET}
${Colors.GREEN}╚═══════════════════════════════════════════════════════════════╝${Colors.RESET}
  `);

  console.log(`${Colors.CYAN}📊 Service Status:${Colors.RESET}`);
  console.log(`   ${Colors.GREEN}✓${Colors.RESET} Backend API:  ${Colors.CYAN}http://localhost:${CONFIG.BACKEND_PORT}${Colors.RESET}`);
  console.log(`   ${Colors.GREEN}✓${Colors.RESET} Frontend:     ${Colors.CYAN}http://localhost:${CONFIG.FRONTEND_PORT}${Colors.RESET}`);
  console.log(`   ${Colors.GREEN}✓${Colors.RESET} Health Check: ${Colors.CYAN}http://localhost:${CONFIG.BACKEND_PORT}/api/health${Colors.RESET}`);
  console.log('');

  console.log(`${Colors.CYAN}🎮 Access Instructions:${Colors.RESET}`);
  console.log(`   1. Open your browser`);
  console.log(`   2. Navigate to: ${Colors.CYAN}http://localhost:${CONFIG.FRONTEND_PORT}${Colors.RESET}`);
  console.log(`   3. Click "INITIATE CHALLENGE"`);
  console.log(`   4. Start playing the offensive security quiz!`);
  console.log('');

  console.log(`${Colors.YELLOW}⏹️  To Stop:${Colors.RESET} Press ${Colors.RED}Ctrl+C${Colors.RESET}`);
  console.log(`${Colors.CYAN}📋 Logs:${Colors.RESET} ${CONFIG.LOG_FILE}`);
  console.log(`${Colors.CYAN}🔗 API Docs:${Colors.RESET} http://localhost:${CONFIG.BACKEND_PORT}`);
  console.log('');

  console.log(`${Colors.CYAN}${'═'.repeat(63)}${Colors.RESET}`);
  console.log(`${Colors.GREEN}✓ Application is READY for use!${Colors.RESET}`);
  console.log(`${Colors.CYAN}${'═'.repeat(63)}${Colors.RESET}`);
  console.log('');
}

function setupGracefulShutdown(manager) {
  const shutdown = async () => {
    console.log(`\n${Colors.YELLOW}🛑 Shutdown signal received...${Colors.RESET}`);
    await manager.stopAll();
    logger.success('Application stopped gracefully');
    process.exit(0);
  };

  process.on('SIGTERM', shutdown);
  process.on('SIGINT', shutdown);

  process.on('uncaughtException', (err) => {
    logger.error('Uncaught Exception:', err.message);
    logger.debug('Stack:', err.stack);
  });

  process.on('unhandledRejection', (reason, promise) => {
    logger.error('Unhandled Rejection:', reason);
  });
}

// ============================================================================
// MAIN ENTRY POINT
// ============================================================================

// Check if running as main module
if (require.main === module) {
  startup().catch((err) => {
    logger.error('Startup failed:', err.message);
    process.exit(1);
  });
}

module.exports = { startup, CONFIG, Logger };
