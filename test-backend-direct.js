#!/usr/bin/env node

/**
 * Test backend startup directly
 */

const path = require('path');
const { spawn } = require('child_process');

console.log('Testing backend startup directly...\n');

const backendDir = path.join(__dirname, 'backend');
const backendScript = path.join(backendDir, 'src', 'server.js');

console.log('Backend directory:', backendDir);
console.log('Backend script:', backendScript);
console.log('');

const backend = spawn('node', [backendScript], {
  cwd: backendDir,
  env: {
    ...process.env,
    PORT: 5000,
    NODE_ENV: 'development',
    FRONTEND_URL: 'http://localhost:3000',
    CORS_ORIGIN: 'http://localhost:3000',
    NODE_PATH: path.join(backendDir, 'node_modules'),
  },
  stdio: ['pipe', 'inherit', 'inherit'],
});

console.log('Backend process spawned with PID:', backend.pid);
console.log('');

backend.on('error', (err) => {
  console.error('Backend spawn error:', err.message);
  process.exit(1);
});

backend.on('exit', (code, signal) => {
  console.log('Backend exited with code:', code, 'signal:', signal);
  process.exit(code);
});

// Stop after 5 seconds
setTimeout(() => {
  console.log('\nStopping backend...');
  backend.kill();
  process.exit(0);
}, 5000);
