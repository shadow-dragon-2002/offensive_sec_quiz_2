# Testing Guide

## Manual API Testing

### Prerequisites
Ensure the backend is running:
```bash
cd backend
npm start
```

### Test Endpoints with curl

#### 1. Health Check
```bash
curl http://localhost:5000/api/health
```
Expected response:
```json
{
  "status": "ok",
  "message": "Offensive Security Quiz API is running",
  "timestamp": "2024-11-20T10:30:00.000Z"
}
```

#### 2. Start Quiz
```bash
curl -X POST http://localhost:5000/api/quiz/start \
  -H "Content-Type: application/json" \
  -c cookies.txt
```
Expected response:
```json
{
  "success": true,
  "sessionId": "...",
  "message": "Quiz session started",
  "timeLimit": 1800000,
  "totalQuestions": 30
}
```

#### 3. Get Question
```bash
curl http://localhost:5000/api/quiz/question \
  -b cookies.txt
```
Expected response:
```json
{
  "success": true,
  "question": {
    "id": 1,
    "level": 1,
    "category": "Reconnaissance",
    "question": "What does OSINT stand for in cybersecurity?",
    "options": ["..."],
    "difficulty": "easy",
    "points": 10
  },
  "currentLevel": 1,
  "totalQuestions": 30
}
```

#### 4. Submit Answer (Correct)
```bash
curl -X POST http://localhost:5000/api/quiz/answer \
  -H "Content-Type: application/json" \
  -b cookies.txt \
  -d '{"questionId": 1, "selectedAnswer": 0}'
```

#### 5. Submit Answer (Incorrect)
```bash
curl -X POST http://localhost:5000/api/quiz/answer \
  -H "Content-Type: application/json" \
  -b cookies.txt \
  -d '{"questionId": 1, "selectedAnswer": 3}'
```

#### 6. Get Stats
```bash
curl http://localhost:5000/api/quiz/stats \
  -b cookies.txt
```

#### 7. Reset Quiz
```bash
curl -X POST http://localhost:5000/api/quiz/reset \
  -b cookies.txt
```

---

## User Flow Testing

### Test Scenario 1: Complete Quiz Successfully

1. Start the application at http://localhost:3000
2. Click "INITIATE CHALLENGE"
3. Read through all 30 questions
4. Answer all questions correctly
5. Verify final score screen shows all questions completed
6. Verify rank is "ELITE HACKER"

### Test Scenario 2: Wrong Answer Locks Session

1. Start a new quiz
2. Answer first question correctly
3. Answer second question incorrectly
4. Verify session locks immediately
5. Verify error message appears
6. Verify can restart with new challenge

### Test Scenario 3: Session Persistence

1. Start quiz and answer 5 questions correctly
2. Refresh the browser (F5)
3. Verify session data persists
4. Verify current level and score remain the same
5. Continue answering questions

### Test Scenario 4: Timer Functionality

1. Start quiz
2. Observe timer counting down from 30:00
3. Verify timer changes color when time < 25% remaining
4. Wait for timer to expire (or mock time if needed)
5. Verify session locks on timeout

### Test Scenario 5: Mobile Responsiveness

1. Open DevTools (F12)
2. Toggle device toolbar
3. Test on mobile sizes (375px, 768px, 1024px)
4. Verify layout adjusts properly
5. Verify buttons are clickable
6. Verify text is readable

---

## Automated Testing Setup

### Unit Tests (Backend)

Create `backend/test/models.test.js`:
```javascript
const SessionManager = require('../src/models/Session');

describe('SessionManager', () => {
  test('createSession creates valid session', () => {
    const session = SessionManager.createSession('test-id');
    expect(session.id).toBe('test-id');
    expect(session.currentLevel).toBe(1);
    expect(session.score).toBe(0);
  });

  test('submitAnswer marks correct answers', () => {
    const sessionId = 'test-id';
    SessionManager.createSession(sessionId);
    const result = SessionManager.submitAnswer(
      sessionId,
      1,
      0,
      0,
      10
    );
    expect(result.isCorrect).toBe(true);
    expect(result.score).toBe(10);
  });

  test('submitAnswer locks on wrong answer', () => {
    const sessionId = 'test-id-2';
    SessionManager.createSession(sessionId);
    const result = SessionManager.submitAnswer(
      sessionId,
      1,
      0,
      1,
      10
    );
    expect(result.isCorrect).toBe(false);
    expect(result.isLocked).toBe(true);
  });
});
```

Install testing dependencies:
```bash
cd backend
npm install --save-dev jest
```

Add to `backend/package.json`:
```json
"scripts": {
  "test": "jest"
}
```

Run tests:
```bash
npm test
```

### React Component Tests (Frontend)

Create `frontend/src/components/__tests__/QuizScreen.test.js`:
```javascript
import { render, screen, fireEvent } from '@testing-library/react';
import QuizScreen from '../QuizScreen';

describe('QuizScreen', () => {
  test('renders loading state', () => {
    render(<QuizScreen />);
    expect(screen.getByText(/loading/i)).toBeInTheDocument();
  });

  test('renders question when loaded', async () => {
    // Mock implementation
  });

  test('disables submit button when no answer selected', () => {
    // Mock implementation
  });
});
```

Install testing dependencies:
```bash
cd frontend
npm install --save-dev @testing-library/react @testing-library/jest-dom
```

Run tests:
```bash
npm test
```

---

## Performance Testing

### Load Testing with Artillery

Install:
```bash
npm install -g artillery
```

Create `load-test.yml`:
```yaml
config:
  target: "http://localhost:5000"
  phases:
    - duration: 60
      arrivalRate: 10

scenarios:
  - name: "Quiz Flow"
    flow:
      - post:
          url: "/api/quiz/start"
      - get:
          url: "/api/quiz/question"
      - post:
          url: "/api/quiz/answer"
          json:
            questionId: 1
            selectedAnswer: 0
      - get:
          url: "/api/quiz/stats"
```

Run load test:
```bash
artillery run load-test.yml
```

### Memory Profiling

```bash
# Start backend with profiling
node --expose-gc src/server.js

# Monitor memory usage
watch -n1 'ps aux | grep node'
```

---

## Browser Testing

### Chrome/Chromium
- Open DevTools (F12)
- Check Console for errors
- Check Network tab for failed requests
- Check Application tab for cookies/storage

### Firefox
- Open DevTools (F12)
- Storage tab shows cookies
- Network tab for request monitoring

### Safari
- Enable Developer Menu (Cmd+Option+U)
- Check console and network tabs

---

## Common Test Cases

| Test | Expected | Actual | Status |
|------|----------|--------|--------|
| Quiz starts successfully | No errors | | |
| Question loads | Question visible | | |
| Select answer | Answer highlights | | |
| Submit correct answer | Score increases | | |
| Submit wrong answer | Session locks | | |
| Timer counts down | Timer updates each second | | |
| Timer expires | Session ends | | |
| Session persists on refresh | Data preserved | | |
| Reset quiz | New session starts | | |

---

## Debugging Tips

### Backend Debugging
```bash
# Enable verbose logging
DEBUG=* npm start

# Use Node debugger
node --inspect src/server.js

# Connect Chrome DevTools to chrome://inspect
```

### Frontend Debugging
```bash
# React DevTools browser extension
# Redux DevTools extension (if added)
# Console.log for debugging
console.log('Variable:', variable);

# Debugger statement in code
debugger; // pauses execution in DevTools
```

### Network Debugging
```bash
# Monitor all network traffic
tcpdump -i lo -n 'tcp port 5000 or tcp port 3000'

# Check open connections
netstat -an | grep LISTEN
```

---

## End-to-End Testing with Cypress

Install:
```bash
cd frontend
npm install --save-dev cypress
npx cypress open
```

Create `cypress/e2e/quiz.cy.js`:
```javascript
describe('Offensive Security Quiz', () => {
  beforeEach(() => {
    cy.visit('http://localhost:3000');
  });

  it('completes the entire quiz flow', () => {
    cy.contains('INITIATE CHALLENGE').click();
    cy.get('.question-text').should('exist');
    
    // Answer question
    cy.get('.answer-option').first().click();
    cy.contains('SUBMIT ANSWER').click();
    
    cy.wait(2000);
    cy.get('.feedback.correct').should('exist');
  });

  it('locks session on wrong answer', () => {
    cy.contains('INITIATE CHALLENGE').click();
    cy.get('.answer-option').eq(3).click();
    cy.contains('SUBMIT ANSWER').click();
    
    cy.get('.feedback.incorrect').should('exist');
  });
});
```

Run tests:
```bash
npx cypress run
```

---

## CI/CD Testing

### GitHub Actions Example

Create `.github/workflows/test.yml`:
```yaml
name: Tests

on: [push, pull_request]

jobs:
  test:
    runs-on: ubuntu-latest
    
    steps:
      - uses: actions/checkout@v2
      - uses: actions/setup-node@v2
        with:
          node-version: '18'
      
      - name: Install backend dependencies
        run: cd backend && npm install
      
      - name: Install frontend dependencies
        run: cd frontend && npm install
      
      - name: Run backend tests
        run: cd backend && npm test
      
      - name: Build frontend
        run: cd frontend && npm run build
```

---

## Reporting Issues

When reporting test failures, include:
1. Environment (Node version, OS, browser)
2. Steps to reproduce
3. Expected vs actual behavior
4. Console errors/logs
5. Network requests (if API-related)
6. Browser version
7. Screenshots/recordings if helpful
