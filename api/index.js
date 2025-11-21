// Vercel Serverless Function Entry Point
const path = require('path');

// Set up path resolution for backend modules
process.env.NODE_PATH = path.join(__dirname, '../backend/node_modules');
require('module').Module._initPaths();

const app = require('../backend/src/server');

// Export for Vercel serverless function
module.exports = app;
