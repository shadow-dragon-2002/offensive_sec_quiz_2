# Architecture Documentation

## System Overview

The Offensive Security Quiz Game is built using a modern full-stack architecture with clear separation between frontend and backend concerns.

## Technology Stack

### Frontend
- **React 18.2.0**: UI component library
- **Axios**: HTTP client for API communication
- **CSS3**: Custom cyberpunk-themed styling
- **Create React App**: Build tooling and development server

### Backend
- **Express.js 4.18.2**: Web application framework
- **Express-session**: Session management middleware
- **CORS**: Cross-origin resource sharing
- **Node.js**: Runtime environment

## Architecture Patterns

### Frontend Architecture

#### Component Hierarchy
```
App (Root)
├── StartScreen
├── QuizScreen
│   └── Timer (displayed conditionally)
└── ResultScreen
```

#### State Management
- **Local Component State**: Using React hooks (useState, useEffect)
- **Prop Drilling**: Parent-to-child communication via props
- **Callback Functions**: Child-to-parent communication

#### Data Flow
1. User interaction triggers event handlers
2. Event handlers call API via axios
3. API responses update local component state
4. React re-renders affected components
5. UI reflects updated state

### Backend Architecture

#### Layered Architecture
```
┌─────────────────────────────┐
│   HTTP Layer (Express)      │
├─────────────────────────────┤
│   Routes Layer              │
│   - Quiz endpoints          │
├─────────────────────────────┤
│   Business Logic Layer      │
│   - Session Manager         │
├─────────────────────────────┤
│   Data Layer                │
│   - Questions (static)      │
│   - Sessions (in-memory)    │
└─────────────────────────────┘
```

#### Session Management
- In-memory session storage using JavaScript Map
- Session data includes:
  - Current progress
  - Score and statistics
  - Timing information
  - Lock state

#### API Design
- RESTful endpoints
- JSON request/response format
- Cookie-based session identification
- Server-side validation

## Security Architecture

### Session Security
1. **Session ID Generation**: Using UUID v4 for unique identifiers
2. **Cookie Security**:
   - HTTP-only cookies (prevent XSS)
   - Secure flag in production (HTTPS only)
   - SameSite policy
3. **Session Expiration**: Automatic cleanup of old sessions

### Data Security
1. **Answer Validation**: Server-side only, never exposed to client
2. **No Client-side Answers**: Correct answers removed before sending questions
3. **CORS Configuration**: Restricted to specific origins

## Data Flow Diagrams

### Quiz Start Flow
```
User -> Frontend: Click "Start"
Frontend -> Backend: POST /api/quiz/start
Backend: Create session
Backend -> Frontend: Return session data
Frontend: Transition to quiz screen
```

### Question Answer Flow
```
User -> Frontend: Select answer
Frontend -> Backend: POST /api/quiz/answer
Backend: Validate answer
Backend: Update session
Backend -> Frontend: Return result (correct/incorrect)
Frontend: Show feedback
Frontend: Load next question OR lock session
```

### Timer Expiration Flow
```
Timer Component: Countdown reaches 0
Timer Component -> App: Call onTimeout callback
App -> Backend: Session marked as expired
Backend: Lock session
Frontend: Show results screen
```

## Scalability Considerations

### Current Limitations
- **In-memory storage**: Sessions lost on server restart
- **Single server**: No horizontal scaling
- **No database**: Limited persistence

### Scaling Strategies

#### Horizontal Scaling
1. **Add Database**: Replace in-memory storage with Redis/MongoDB
2. **Session Store**: Use connect-redis or connect-mongo
3. **Load Balancer**: Distribute requests across multiple servers
4. **Sticky Sessions**: Or shared session store

#### Vertical Scaling
1. **Increase Memory**: For more concurrent sessions
2. **Optimize Algorithms**: Reduce computational overhead
3. **Caching**: Cache frequently accessed data

## Performance Optimization

### Frontend Optimizations
- **Code Splitting**: Lazy load components
- **Memoization**: React.memo for expensive components
- **Asset Optimization**: Minify CSS/JS, optimize images
- **CDN**: Serve static assets from CDN

### Backend Optimizations
- **Connection Pooling**: If database added
- **Compression**: Gzip responses
- **Caching Headers**: Cache static responses
- **Rate Limiting**: Prevent abuse

## Monitoring & Observability

### Recommended Additions
1. **Logging**: Winston or Bunyan for structured logging
2. **Metrics**: Prometheus for monitoring
3. **Tracing**: OpenTelemetry for distributed tracing
4. **Error Tracking**: Sentry for error monitoring
5. **Analytics**: Track user behavior and engagement

## Deployment Architecture

### Development Environment
```
localhost:3000 (Frontend)
    ↓
localhost:5000 (Backend)
```

### Production Environment
```
Domain (e.g., quiz.example.com)
    ↓
Reverse Proxy (Nginx/Apache)
    ↓
Frontend (Static hosting)
Backend (Node.js server)
```

### Recommended Infrastructure
1. **Frontend**: Vercel, Netlify, or S3 + CloudFront
2. **Backend**: Heroku, DigitalOcean, AWS EC2, or Railway
3. **Database** (future): MongoDB Atlas, AWS RDS
4. **Cache** (future): Redis Cloud, AWS ElastiCache

## API Communication

### Request/Response Format

#### Request Example
```json
POST /api/quiz/answer
Content-Type: application/json
Cookie: connect.sid=...

{
  "questionId": 1,
  "selectedAnswer": 0
}
```

#### Response Example
```json
{
  "success": true,
  "isCorrect": true,
  "correctAnswer": 0,
  "currentLevel": 2,
  "score": 10,
  "isLocked": false,
  "isCompleted": false,
  "message": "Correct! Moving to next level."
}
```

## Error Handling

### Frontend Error Handling
- Try-catch blocks around API calls
- Display user-friendly error messages
- Console logging for debugging
- Fallback UI for error states

### Backend Error Handling
- Error middleware for catching uncaught errors
- Structured error responses
- Status codes (400, 404, 500, etc.)
- Development vs production error messages

## Testing Strategy

### Unit Testing
- Backend: Session management logic
- Frontend: Component rendering and interactions

### Integration Testing
- API endpoint testing
- Database operations (when added)

### End-to-End Testing
- User flows (start, answer, complete)
- Timer functionality
- Session persistence

### Tools
- Jest: Unit and integration testing
- React Testing Library: Component testing
- Cypress or Playwright: E2E testing

## Future Architecture Improvements

1. **Microservices**: Split into multiple services
   - Question Service
   - Session Service
   - Analytics Service

2. **Event-Driven**: Use message queues
   - RabbitMQ or Apache Kafka
   - Async processing

3. **GraphQL**: Replace REST with GraphQL
   - Flexible queries
   - Real-time subscriptions

4. **WebSockets**: Real-time updates
   - Live leaderboards
   - Multiplayer features

5. **Containerization**: Docker and Kubernetes
   - Consistent environments
   - Easy scaling
   - Orchestration
