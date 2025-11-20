#!/usr/bin/env node

/**
 * Main Orchestrator for Offensive Security Escape Room
 * Handles installation, building, and running of the single-port application
 */

const { spawn, execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

const PORT = process.env.PORT || 3000;
const ROOT_DIR = __dirname;
const CLIENT_DIR = path.join(ROOT_DIR, 'client');
const SERVER_DIR = path.join(ROOT_DIR, 'server');

console.log('🎮 Offensive Security Escape Room - Red Team Ops');
console.log('================================================\n');

/**
 * Check if dependencies are installed
 */
function checkDependencies(dir) {
  const nodeModulesPath = path.join(dir, 'node_modules');
  return fs.existsSync(nodeModulesPath);
}

/**
 * Install dependencies
 */
function installDependencies(dir, label) {
  console.log(`📦 Installing ${label} dependencies...`);
  try {
    execSync('npm install', { cwd: dir, stdio: 'inherit' });
    console.log(`✅ ${label} dependencies installed\n`);
  } catch (error) {
    console.error(`❌ Failed to install ${label} dependencies`);
    process.exit(1);
  }
}

/**
 * Build React application
 */
function buildClient() {
  console.log('🔨 Building React application with Vite...');
  try {
    execSync('npm run build', { cwd: CLIENT_DIR, stdio: 'inherit' });
    console.log('✅ React build complete\n');
  } catch (error) {
    console.error('❌ Failed to build React application');
    process.exit(1);
  }
}

/**
 * Start Express server
 */
function startServer() {
  console.log('🚀 Starting Express server...');
  console.log(`📡 Server will run on http://localhost:${PORT}\n`);
  
  const serverProcess = spawn('node', [path.join(SERVER_DIR, 'index.js')], {
    cwd: SERVER_DIR,
    stdio: 'inherit',
    env: { ...process.env, PORT }
  });

  serverProcess.on('error', (error) => {
    console.error('❌ Failed to start server:', error);
    process.exit(1);
  });

  serverProcess.on('exit', (code) => {
    if (code !== 0) {
      console.error(`❌ Server exited with code ${code}`);
      process.exit(code);
    }
  });

  // Handle graceful shutdown
  process.on('SIGINT', () => {
    console.log('\n\n⚡ Shutting down gracefully...');
    serverProcess.kill('SIGINT');
    process.exit(0);
  });

  process.on('SIGTERM', () => {
    console.log('\n\n⚡ Shutting down gracefully...');
    serverProcess.kill('SIGTERM');
    process.exit(0);
  });
}

/**
 * Open browser automatically
 */
function openBrowser() {
  const url = `http://localhost:${PORT}`;
  const start = process.platform === 'darwin' ? 'open' :
                process.platform === 'win32' ? 'start' : 'xdg-open';
  
  setTimeout(() => {
    try {
      execSync(`${start} ${url}`, { stdio: 'ignore' });
      console.log(`🌐 Opening browser at ${url}\n`);
    } catch (error) {
      console.log(`🌐 Please open your browser at ${url}\n`);
    }
  }, 2000);
}

/**
 * Main orchestration function
 */
async function main() {
  try {
    // Check and install root dependencies
    if (!checkDependencies(ROOT_DIR)) {
      console.log('⚠️  Root dependencies not found');
      installDependencies(ROOT_DIR, 'root');
    } else {
      console.log('✅ Root dependencies found\n');
    }

    // Check and install server dependencies
    if (!checkDependencies(SERVER_DIR)) {
      console.log('⚠️  Server dependencies not found');
      installDependencies(SERVER_DIR, 'server');
    } else {
      console.log('✅ Server dependencies found\n');
    }

    // Check and install client dependencies
    if (!checkDependencies(CLIENT_DIR)) {
      console.log('⚠️  Client dependencies not found');
      installDependencies(CLIENT_DIR, 'client');
    } else {
      console.log('✅ Client dependencies found\n');
    }

    // Build client if dist doesn't exist
    const distPath = path.join(CLIENT_DIR, 'dist');
    if (!fs.existsSync(distPath)) {
      console.log('⚠️  Client build not found');
      buildClient();
    } else {
      console.log('✅ Client build found\n');
    }

    // Start server
    startServer();
    
    // Open browser
    openBrowser();

  } catch (error) {
    console.error('❌ Fatal error:', error);
    process.exit(1);
  }
}

// Run main function
main();
