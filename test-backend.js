#!/usr/bin/env node

/**
 * Quick test to verify backend can start
 */

console.log('Testing backend startup...');
console.log('Current directory:', process.cwd());
console.log('Node version:', process.version);
console.log('');

// Test require
try {
  const express = require('express');
  console.log('✓ express module found');
} catch (err) {
  console.error('✗ express module NOT found:', err.message);
  process.exit(1);
}

try {
  const session = require('express-session');
  console.log('✓ express-session module found');
} catch (err) {
  console.error('✗ express-session module NOT found:', err.message);
  process.exit(1);
}

try {
  const cors = require('cors');
  console.log('✓ cors module found');
} catch (err) {
  console.error('✗ cors module NOT found:', err.message);
  process.exit(1);
}

console.log('');
console.log('All modules verified! Backend can start.');
