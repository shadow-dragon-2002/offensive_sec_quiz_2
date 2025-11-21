#!/usr/bin/env node

/**
 * Generate a secure random session secret for production use
 * Run: node generate-secret.js
 */

const crypto = require('crypto');

function generateSecret(length = 64) {
  return crypto.randomBytes(length).toString('hex');
}

console.log('\n🔐 Secure Session Secret Generator\n');
console.log('Copy one of these secrets to use in your Vercel environment variables:\n');
console.log('SESSION_SECRET Option 1:');
console.log(generateSecret());
console.log('\nSESSION_SECRET Option 2:');
console.log(generateSecret());
console.log('\nSESSION_SECRET Option 3:');
console.log(generateSecret());
console.log('\n⚠️  Keep these secrets secure and never commit them to Git!\n');
