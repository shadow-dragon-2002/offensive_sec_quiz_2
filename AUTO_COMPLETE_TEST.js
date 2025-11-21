#!/usr/bin/env node

/**
 * ============================================================================
 * AUTO COMPLETE TEST - INSTANT END SCREEN FOR TESTING
 * ============================================================================
 * Automatically answers all 30 quiz questions correctly to reach the end screen
 * Perfect for testing leaderboard, result screen, and grade calculations
 * 
 * Usage: node AUTO_COMPLETE_TEST.js
 * ============================================================================
 */

const http = require('http');

// ============================================================================
// CONFIGURATION
// ============================================================================

const API_HOST = 'localhost';
const API_PORT = 5000;
const DELAY_BETWEEN_ANSWERS = 500; // ms delay between submissions

// ============================================================================
// COLORS & UTILITIES
// ============================================================================

const Colors = {
  RESET: '\x1b[0m',
  BRIGHT: '\x1b[1m',
  GREEN: '\x1b[32m',
  YELLOW: '\x1b[33m',
  CYAN: '\x1b[36m',
  RED: '\x1b[31m',
  MAGENTA: '\x1b[35m',
};

function log(msg, type = 'info') {
  const colors = {
    'success': Colors.GREEN,
    'error': Colors.RED,
    'warn': Colors.YELLOW,
    'info': Colors.CYAN,
    'test': Colors.MAGENTA,
  };
  const time = new Date().toLocaleTimeString();
  console.log(`${colors[type] || Colors.CYAN}[${time}]${Colors.RESET} ${msg}`);
}

function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

// ============================================================================
// HTTP REQUEST HELPER WITH COOKIE MANAGEMENT
// ============================================================================

let cookies = '';

function makeRequest(method, path, body = null) {
  return new Promise((resolve, reject) => {
    const options = {
      hostname: API_HOST,
      port: API_PORT,
      path: path,
      method: method,
      headers: {
        'Content-Type': 'application/json',
      },
      timeout: 15000,
    };

    // Add cookies to request if they exist
    if (cookies) {
      options.headers['Cookie'] = cookies;
    }

    const req = http.request(options, (res) => {
      let data = '';
      
      // Capture Set-Cookie headers
      if (res.headers['set-cookie']) {
        const setCookies = Array.isArray(res.headers['set-cookie']) 
          ? res.headers['set-cookie'] 
          : [res.headers['set-cookie']];
        
        setCookies.forEach(cookie => {
          const cookiePart = cookie.split(';')[0];
          if (cookiePart) {
            cookies = cookiePart;
          }
        });
      }
      
      res.on('data', (chunk) => {
        data += chunk;
      });
      
      res.on('end', () => {
        try {
          const json = JSON.parse(data);
          resolve({ data: json, status: res.statusCode });
        } catch (e) {
          reject(new Error(`Invalid JSON response: ${data}`));
        }
      });
    });

    req.on('error', (error) => {
      reject(error);
    });

    req.on('timeout', () => {
      req.destroy();
      reject(new Error('Request timeout'));
    });

    if (body) {
      req.write(JSON.stringify(body));
    }

    req.end();
  });
}

// ============================================================================
// MAIN TEST FUNCTION
// ============================================================================

async function runAutoCompleteTest() {
  console.clear();
  console.log(`
${Colors.CYAN}${Colors.BRIGHT}╔════════════════════════════════════════════════════════════╗${Colors.RESET}
${Colors.CYAN}${Colors.BRIGHT}║                                                            ║${Colors.RESET}
${Colors.CYAN}${Colors.BRIGHT}║        🚀  AUTO COMPLETE TEST - INSTANT END SCREEN  🚀       ║${Colors.RESET}
${Colors.CYAN}${Colors.BRIGHT}║                                                            ║${Colors.RESET}
${Colors.CYAN}${Colors.BRIGHT}║     Automatically completes all 30 questions correctly      ║${Colors.RESET}
${Colors.CYAN}${Colors.BRIGHT}║         Perfect for testing leaderboard & grades!          ║${Colors.RESET}
${Colors.CYAN}${Colors.BRIGHT}║                                                            ║${Colors.RESET}
${Colors.CYAN}${Colors.BRIGHT}╚════════════════════════════════════════════════════════════╝${Colors.RESET}
  `);

  try {
    // Step 1: Start Quiz Session
    log('Step 1: Starting quiz session...', 'test');
    const startResponse = await makeRequest('POST', '/api/quiz/start');
    
    if (!startResponse.data.success) {
      throw new Error('Failed to start quiz session');
    }
    
    const sessionId = startResponse.data.sessionId;
    log(`✓ Quiz session started: ${sessionId}`, 'success');
    log(`✓ Total questions: ${startResponse.data.totalQuestions}`, 'success');
    log(`✓ Time limit: ${startResponse.data.timeLimit / 60000} minutes`, 'success');

    // Step 2: Answer All Questions
    log(`\nStep 2: Answering all 30 questions...`, 'test');
    let correctAnswered = 0;
    let score = 0;
    let wrongAttempts = 0;

    for (let questionNum = 1; questionNum <= 30; questionNum++) {
      try {
        // Fetch question
        const questionResponse = await makeRequest('GET', '/api/quiz/question');
        
        if (questionResponse.data.isCompleted) {
          // Quiz completed!
          correctAnswered = questionResponse.data.correctAnswers;
          score = questionResponse.data.finalScore;
          wrongAttempts = 0;
          log(`✓ Quiz auto-completed at question ${questionNum}!`, 'success');
          break;
        }

        const question = questionResponse.data.question;
        const currentLevel = questionResponse.data.currentLevel;
        
        if (!question || !question.id) {
          log(`✗ Invalid question data received`, 'error');
          break;
        }
        
        // Try each answer until we get it right
        let answerFound = false;
        let answerResponse = null;

        for (let answerIndex = 0; answerIndex < 4; answerIndex++) {
          answerResponse = await makeRequest('POST', '/api/quiz/answer', {
            questionId: question.id,
            selectedAnswer: answerIndex,
          });

          if (answerResponse.data && answerResponse.data.isCorrect) {
            correctAnswered++;
            score = answerResponse.data.score || 0;
            log(`[Q${questionNum}] ✓ Correct (Answer: ${answerIndex})! Score: ${score} | Level: ${currentLevel}/30`, 'success');
            answerFound = true;
            break;
          }
        }

        if (!answerFound && answerResponse.data) {
          wrongAttempts = (answerResponse.data && answerResponse.data.wrongAttempts) || 0;
          log(`[Q${questionNum}] ✗ Could not find correct answer (Wrong attempts: ${wrongAttempts})`, 'warn');
        }

        if (answerResponse && answerResponse.data && answerResponse.data.isCompleted) {
          correctAnswered = currentLevel;
          score = answerResponse.data.score || 0;
          wrongAttempts = answerResponse.data.wrongAttempts || 0;
          log(`✓ Quiz completed at question ${questionNum}!`, 'success');
          break;
        }

        // Delay between questions for realism
        await sleep(DELAY_BETWEEN_ANSWERS);

      } catch (error) {
        log(`✗ Error on question ${questionNum}: ${error.message}`, 'error');
        break;
      }
    }

    // Step 3: Fetch Final Stats
    log(`\nStep 3: Fetching final statistics...`, 'test');
    const statsResponse = await makeRequest('GET', '/api/quiz/stats');
    const stats = statsResponse.data.stats || statsResponse.data;

    if (!stats || !stats.score) {
      throw new Error('Invalid stats response received');
    }

    log(`✓ Final Score: ${stats.score}`, 'success');
    log(`✓ Correct Answers: ${stats.correctAnswers || correctAnswered}/30`, 'success');
    log(`✓ Wrong Attempts: ${stats.wrongAttempts || wrongAttempts || 0}`, 'success');
    
    const correctCount = stats.correctAnswers || correctAnswered || 0;
    const wrongCount = stats.wrongAttempts || wrongAttempts || 0;
    const totalAttempts = correctCount + wrongCount;
    const accuracy = totalAttempts > 0 ? ((correctCount / totalAttempts) * 100).toFixed(1) : 0;
    log(`✓ Accuracy Rate: ${accuracy}%`, 'success');
    
    const timeRemaining = Math.max(0, stats.remainingTime || 0);
    log(`✓ Time Remaining: ${(timeRemaining / 60000).toFixed(1)} minutes`, 'success');

    // Step 4: Display End Screen Data
    log(`\nStep 4: End Screen Data Ready for Testing`, 'test');
    console.log(`
${Colors.BRIGHT}${Colors.GREEN}╔════════════════════════════════════════════════════════════╗${Colors.RESET}
${Colors.BRIGHT}${Colors.GREEN}║                    RESULT SCREEN DATA                       ║${Colors.RESET}
${Colors.BRIGHT}${Colors.GREEN}╚════════════════════════════════════════════════════════════╝${Colors.RESET}

${Colors.YELLOW}Final Stats:${Colors.RESET}
  • Score: ${Colors.BRIGHT}${stats.score}${Colors.RESET}
  • Correct Answers: ${Colors.BRIGHT}${stats.correctAnswers}/30${Colors.RESET}
  • Wrong Attempts: ${Colors.BRIGHT}${stats.wrongAttempts || 0}${Colors.RESET}
  • Accuracy Rate: ${Colors.BRIGHT}${accuracy}%${Colors.RESET}
  • Time Remaining: ${Colors.BRIGHT}${(timeRemaining / 60000).toFixed(1)}m${Colors.RESET}
  • Status: ${Colors.BRIGHT}${stats.isCompleted ? 'COMPLETED ✓' : 'IN PROGRESS'}${Colors.RESET}

${Colors.YELLOW}Grade Calculation Inputs:${Colors.RESET}
  • Composite Score Elements:
    - Score: ${stats.score} / ~4000 = ${((stats.score / 4000) * 100).toFixed(1)}%
    - Accuracy: ${accuracy}%
    - Time Bonus: ${Math.min((timeRemaining / (60000)) * 2, 100).toFixed(1)} points

${Colors.YELLOW}Expected Grades:${Colors.RESET}
  • Grade S (85%+ composite, 90%+ accuracy, 5m+ remaining): Check if qualifies
  • Grade A (70%+ composite, 80%+ accuracy, 3m+ remaining): Check if qualifies
  • Grade B (55%+ composite, 65%+ accuracy): Check if qualifies
  • Grade C: Default grade for all others

${Colors.CYAN}Next Steps:${Colors.RESET}
  1. Open http://localhost:3000 in your browser (if not already)
  2. You should now see the result screen
  3. Enter a username to submit your score to the leaderboard
  4. Verify your grade displays correctly
  5. Check the leaderboard updates with your entry
    `);

    log(`\n✓ Auto-complete test finished successfully!`, 'success');
    log(`Ready for frontend testing of leaderboard and result screen`, 'success');

  } catch (error) {
    log(`✗ Error during auto-complete test: ${error.message}`, 'error');
    if (error.response?.data) {
      log(`Response: ${JSON.stringify(error.response.data, null, 2)}`, 'error');
    }
    process.exit(1);
  }
}

// ============================================================================
// RUN TEST
// ============================================================================

runAutoCompleteTest().catch(error => {
  log(`✗ Fatal error: ${error.message}`, 'error');
  process.exit(1);
});
