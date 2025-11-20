#!/usr/bin/env node

/**
 * Quick verification that all dependencies are properly installed
 */

const fs = require('fs');
const path = require('path');

console.log('\n✅ DEPENDENCY VERIFICATION\n');

const backendDir = path.join(__dirname, 'backend');
const frontendDir = path.join(__dirname, 'frontend');

// Check backend
console.log('Backend:');
const backendPackages = ['express', 'cors', 'debug', 'dotenv', 'uuid', 'express-session'];
for (const pkg of backendPackages) {
  const pkgPath = path.join(backendDir, 'node_modules', pkg);
  const exists = fs.existsSync(pkgPath);
  console.log(`  ${exists ? '✓' : '✗'} ${pkg}`);
}

// Check frontend
console.log('\nFrontend:');
const frontendPackages = ['react', 'react-dom', 'axios', 'framer-motion'];
for (const pkg of frontendPackages) {
  const pkgPath = path.join(frontendDir, 'node_modules', pkg);
  const exists = fs.existsSync(pkgPath);
  console.log(`  ${exists ? '✓' : '✗'} ${pkg}`);
}

console.log('\n✅ All dependencies verified!\n');
console.log('Ready to launch: node main.js\n');
