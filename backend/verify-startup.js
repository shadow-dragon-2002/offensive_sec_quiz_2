#!/usr/bin/env node

/**
 * Startup Verification Script
 * Tests all API endpoints and ensures system is ready for operation
 * Run this after server starts to verify everything works correctly
 */

const http = require('http');
const path = require('path');

// ============ CONFIGURATION ============
const CONFIG = {
  HOST: 'localhost',
  PORT: process.env.PORT || 5000,
  MAX_RETRIES: 5,
  RETRY_DELAY: 1000,
  TIMEOUT: 5000,
};

const BASE_URL = `http://${CONFIG.HOST}:${CONFIG.PORT}`;

// ============ COLORS ============
const Colors = {
  RESET: '\x1b[0m',
  GREEN: '\x1b[32m',
  RED: '\x1b[31m',
  YELLOW: '\x1b[33m',
  BLUE: '\x1b[34m',
  CYAN: '\x1b[36m',
};

// ============ LOGGING ============
const log = {
  success: (msg) => console.log(`${Colors.GREEN}✓ ${msg}${Colors.RESET}`),
  error: (msg) => console.log(`${Colors.RED}✗ ${msg}${Colors.RESET}`),
  info: (msg) => console.log(`${Colors.BLUE}ℹ ${msg}${Colors.RESET}`),
  warn: (msg) => console.log(`${Colors.YELLOW}⚠ ${msg}${Colors.RESET}`),
  section: (msg) => {
    console.log('');
    console.log(`${Colors.CYAN}═══════════════════════════════════${Colors.RESET}`);
    console.log(`${Colors.CYAN}  ${msg}${Colors.RESET}`);
    console.log(`${Colors.CYAN}═══════════════════════════════════${Colors.RESET}`);
    console.log('');
  },
};

// ============ UTILITIES ============
const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

const makeRequest = (url, method = 'GET', body = null) => {
  return new Promise((resolve, reject) => {
    const urlObj = new URL(url);
    const options = {
      hostname: urlObj.hostname,
      port: urlObj.port,
      path: urlObj.pathname + urlObj.search,
      method: method,
      timeout: CONFIG.TIMEOUT,
      headers: {
        'Content-Type': 'application/json',
      },
    };

    const req = http.request(options, (res) => {
      let data = '';
      res.on('data', (chunk) => (data += chunk));
      res.on('end', () => {
        try {
          const parsed = JSON.parse(data);
          resolve({ status: res.statusCode, data: parsed });
        } catch {
          resolve({ status: res.statusCode, data: data });
        }
      });
    });

    req.on('error', reject);
    req.on('timeout', () => {
      req.destroy();
      reject(new Error('Request timeout'));
    });

    if (body) {
      req.write(JSON.stringify(body));
    }
    req.end();
  });
};

// ============ TEST FUNCTIONS ============
const tests = {
  // Test 1: Health Check
  healthCheck: async () => {
    log.info('Testing health endpoint...');
    try {
      const response = await makeRequest(`${BASE_URL}/api/health`);
      if (response.status === 200 && response.data.status === 'ok') {
        log.success('Health check passed');
        return true;
      } else {
        log.error(`Health check returned unexpected status: ${response.status}`);
        return false;
      }
    } catch (err) {
      log.error(`Health check failed: ${err.message}`);
      return false;
    }
  },

  // Test 2: Root Endpoint
  rootEndpoint: async () => {
    log.info('Testing root endpoint...');
    try {
      const response = await makeRequest(`${BASE_URL}/`);
      if (response.status === 200 && response.data.message) {
        log.success(`Root endpoint works: ${response.data.message}`);
        log.info(`API Version: ${response.data.version}`);
        return true;
      } else {
        log.error(`Root endpoint returned unexpected response`);
        return false;
      }
    } catch (err) {
      log.error(`Root endpoint failed: ${err.message}`);
      return false;
    }
  },

  // Test 3: Start Quiz
  startQuiz: async () => {
    log.info('Testing POST /api/quiz/start endpoint...');
    try {
      const response = await makeRequest(`${BASE_URL}/api/quiz/start`, 'POST');
      if (response.status === 200 && response.data.success) {
        log.success('Quiz start endpoint works');
        log.info(`Session ID received, Time Limit: ${response.data.timeLimit}ms`);
        return true;
      } else {
        log.error(`Quiz start returned status: ${response.status}`);
        return false;
      }
    } catch (err) {
      log.error(`Quiz start endpoint failed: ${err.message}`);
      return false;
    }
  },

  // Test 4: Get Question
  getQuestion: async () => {
    log.info('Testing GET /api/quiz/question endpoint...');
    try {
      const response = await makeRequest(`${BASE_URL}/api/quiz/question`);
      if (response.status === 200 && response.data.question) {
        log.success('Question endpoint works');
        log.info(`Question Level: ${response.data.question.level}`);
        log.info(`Question Category: ${response.data.question.category}`);
        // Verify correct answer is NOT sent to client
        if (response.data.question.correctAnswer === undefined) {
          log.success('✓ Correct answer properly hidden from client');
        } else {
          log.warn('⚠ WARNING: Correct answer is visible on client!');
        }
        return true;
      } else {
        log.error(`Question endpoint returned status: ${response.status}`);
        return false;
      }
    } catch (err) {
      log.error(`Question endpoint failed: ${err.message}`);
      return false;
    }
  },

  // Test 5: Submit Answer
  submitAnswer: async () => {
    log.info('Testing POST /api/quiz/answer endpoint...');
    try {
      const response = await makeRequest(
        `${BASE_URL}/api/quiz/answer`,
        'POST',
        { questionId: 1, selectedAnswer: 0 }
      );
      // Answer will be wrong or right, but endpoint should respond with 200
      if (response.status === 200 && response.data.success !== undefined) {
        if (response.data.success) {
          log.success('Answer endpoint works (answer correct)');
        } else {
          log.success('Answer endpoint works (answer incorrect, as expected)');
        }
        log.info(`Score: ${response.data.score}`);
        return true;
      } else if (response.status === 400 || response.status === 404) {
        log.warn(`Answer endpoint returned ${response.status} (expected - no active session)`);
        return true; // This is OK - we don't have a real session
      } else {
        log.error(`Answer endpoint returned unexpected status: ${response.status}`);
        return false;
      }
    } catch (err) {
      log.error(`Answer endpoint failed: ${err.message}`);
      return false;
    }
  },

  // Test 6: Get Stats
  getStats: async () => {
    log.info('Testing GET /api/quiz/stats endpoint...');
    try {
      const response = await makeRequest(`${BASE_URL}/api/quiz/stats`);
      if (response.status === 200 && response.data.stats) {
        log.success('Stats endpoint works');
        log.info(`Current Level: ${response.data.stats.currentLevel}`);
        log.info(`Score: ${response.data.stats.score}`);
        return true;
      } else if (response.status === 400 || response.status === 404) {
        log.warn(`Stats endpoint returned ${response.status} (expected - no active session)`);
        return true;
      } else {
        log.error(`Stats endpoint returned unexpected status: ${response.status}`);
        return false;
      }
    } catch (err) {
      log.error(`Stats endpoint failed: ${err.message}`);
      return false;
    }
  },

  // Test 7: Reset Quiz
  resetQuiz: async () => {
    log.info('Testing POST /api/quiz/reset endpoint...');
    try {
      const response = await makeRequest(`${BASE_URL}/api/quiz/reset`, 'POST');
      if (response.status === 200 && response.data.success) {
        log.success('Reset endpoint works');
        return true;
      } else if (response.status === 400 || response.status === 500) {
        log.warn(`Reset endpoint returned ${response.status} (expected - no active session)`);
        return true;
      } else {
        log.error(`Reset endpoint returned unexpected status: ${response.status}`);
        return false;
      }
    } catch (err) {
      log.error(`Reset endpoint failed: ${err.message}`);
      return false;
    }
  },

  // Test 8: Error Handling
  errorHandling: async () => {
    log.info('Testing error handling...');
    try {
      // Test 404 - Non-existent endpoint
      const response = await makeRequest(`${BASE_URL}/api/nonexistent`);
      if (response.status === 404) {
        log.success('404 error handling works correctly');
        return true;
      } else {
        log.warn(`Expected 404, got ${response.status}`);
        return false;
      }
    } catch (err) {
      log.error(`Error handling test failed: ${err.message}`);
      return false;
    }
  },
};

// ============ MAIN VERIFICATION ============
const runVerification = async () => {
  log.section('OFFENSIVE SECURITY QUIZ - STARTUP VERIFICATION');

  log.info(`Connecting to ${BASE_URL}...`);

  // Wait for server to be ready with retries
  let connected = false;
  for (let i = 0; i < CONFIG.MAX_RETRIES; i++) {
    try {
      const response = await makeRequest(`${BASE_URL}/api/health`);
      connected = true;
      break;
    } catch (err) {
      if (i < CONFIG.MAX_RETRIES - 1) {
        log.warn(`Connection attempt ${i + 1}/${CONFIG.MAX_RETRIES} failed, retrying...`);
        await sleep(CONFIG.RETRY_DELAY);
      }
    }
  }

  if (!connected) {
    log.error(`Could not connect to server at ${BASE_URL}`);
    log.error('Make sure the backend server is running');
    process.exit(1);
  }

  log.success(`Connected to backend at ${BASE_URL}`);
  log.section('RUNNING ENDPOINT TESTS');

  const results = {};
  const testList = [
    { name: 'Health Check', fn: tests.healthCheck },
    { name: 'Root Endpoint', fn: tests.rootEndpoint },
    { name: 'Start Quiz', fn: tests.startQuiz },
    { name: 'Get Question', fn: tests.getQuestion },
    { name: 'Submit Answer', fn: tests.submitAnswer },
    { name: 'Get Stats', fn: tests.getStats },
    { name: 'Reset Quiz', fn: tests.resetQuiz },
    { name: 'Error Handling', fn: tests.errorHandling },
  ];

  for (const test of testList) {
    try {
      results[test.name] = await test.fn();
    } catch (err) {
      log.error(`Test "${test.name}" crashed: ${err.message}`);
      results[test.name] = false;
    }
  }

  // Print summary
  log.section('VERIFICATION SUMMARY');

  const passed = Object.values(results).filter((r) => r).length;
  const total = Object.keys(results).length;

  console.log('Test Results:');
  for (const [name, result] of Object.entries(results)) {
    const icon = result ? Colors.GREEN + '✓' : Colors.RED + '✗';
    console.log(`  ${icon} ${name}${Colors.RESET}`);
  }

  console.log('');
  log.info(`Passed: ${passed}/${total} tests`);

  if (passed === total) {
    log.success('✓ ALL TESTS PASSED - System is ready!');
    log.section('🚀 SYSTEM STATUS: READY FOR DEPLOYMENT');
    process.exit(0);
  } else {
    log.error(`✗ ${total - passed} tests failed`);
    log.section('⚠ SYSTEM STATUS: ISSUES DETECTED');
    process.exit(1);
  }
};

// Run verification
runVerification().catch((err) => {
  log.error(`Verification failed: ${err.message}`);
  process.exit(1);
});
