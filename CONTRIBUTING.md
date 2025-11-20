# Contributing to Offensive Security Quiz Game

Thank you for considering contributing to the Offensive Security Quiz Game! We welcome contributions from the community.

## Table of Contents
- [Code of Conduct](#code-of-conduct)
- [How Can I Contribute?](#how-can-i-contribute)
- [Development Setup](#development-setup)
- [Coding Standards](#coding-standards)
- [Commit Guidelines](#commit-guidelines)
- [Pull Request Process](#pull-request-process)
- [Adding New Features](#adding-new-features)

## Code of Conduct

- Be respectful and inclusive
- Provide constructive feedback
- Focus on the code, not the person
- Use welcoming and professional language
- Accept constructive criticism gracefully

## How Can I Contribute?

### Reporting Bugs

Before creating bug reports, please check existing issues. When creating a bug report, include:

- **Clear title and description**
- **Steps to reproduce**
- **Expected behavior**
- **Actual behavior**
- **Screenshots** (if applicable)
- **Environment details** (OS, browser, Node version)

Example:
```markdown
**Bug**: Timer doesn't stop after session lock

**Steps to Reproduce**:
1. Start a new quiz
2. Answer first question incorrectly
3. Observe that timer continues running

**Expected**: Timer should stop when session is locked
**Actual**: Timer continues counting down

**Environment**: 
- Browser: Chrome 120.0
- OS: Windows 11
- Node: 18.17.0
```

### Suggesting Enhancements

Enhancement suggestions are tracked as GitHub issues. Include:

- **Clear title and description**
- **Use case** - why is this needed?
- **Proposed solution**
- **Alternatives considered**
- **Additional context**

### Adding Questions

To add new security questions:

1. Edit `backend/src/data/questions.js`
2. Follow the existing format:
```javascript
{
  id: 31,  // Next sequential ID
  level: 31,  // Next level
  category: "Your Category",
  question: "Your question text?",
  options: [
    "Option A",
    "Option B",
    "Option C",
    "Option D"
  ],
  correctAnswer: 0,  // Index of correct option (0-3)
  difficulty: "medium",  // easy, medium, or hard
  points: 20  // Points awarded (10, 15, 20, 25, or 30)
}
```
3. Ensure questions are:
   - Technically accurate
   - Clear and unambiguous
   - Educational
   - Appropriate difficulty level

### Improving UI/UX

For UI improvements:
- Follow the existing cyberpunk theme
- Maintain responsive design
- Ensure accessibility
- Test on multiple devices/browsers

## Development Setup

1. **Fork and clone the repository**
```bash
git clone https://github.com/YOUR-USERNAME/offensive_sec_quiz_2.git
cd offensive_sec_quiz_2
```

2. **Create a new branch**
```bash
git checkout -b feature/your-feature-name
# or
git checkout -b fix/bug-description
```

3. **Install dependencies**
```bash
# Backend
cd backend
npm install

# Frontend
cd ../frontend
npm install
```

4. **Start development servers**
```bash
# Terminal 1 - Backend
cd backend
npm start

# Terminal 2 - Frontend
cd frontend
npm start
```

5. **Make your changes**

6. **Test your changes**
```bash
# Test backend endpoints
curl http://localhost:5000/api/health

# Test frontend
# Open http://localhost:3000 in browser
```

## Coding Standards

### JavaScript/React

- Use ES6+ syntax
- Use functional components with hooks
- Follow existing code style
- Use meaningful variable names
- Add comments for complex logic
- Keep functions small and focused

### File Organization

```
backend/
  src/
    models/        # Business logic
    routes/        # API endpoints
    data/          # Static data
    middleware/    # Custom middleware

frontend/
  src/
    components/    # React components
    utils/         # Utility functions
    styles/        # CSS files (co-located with components)
```

### Naming Conventions

- **Files**: PascalCase for components, camelCase for utilities
  - `QuizScreen.js`, `api.js`
- **Components**: PascalCase
  - `QuizScreen`, `Timer`
- **Functions**: camelCase
  - `handleSubmit`, `fetchQuestion`
- **Constants**: UPPER_SNAKE_CASE
  - `MAX_QUESTIONS`, `TIME_LIMIT`

### CSS

- Use BEM-like naming for classes
- Keep specificity low
- Mobile-first responsive design
- Maintain cyberpunk theme colors

## Commit Guidelines

### Commit Message Format

```
<type>(<scope>): <subject>

<body>

<footer>
```

### Types

- **feat**: New feature
- **fix**: Bug fix
- **docs**: Documentation changes
- **style**: Code style changes (formatting, etc.)
- **refactor**: Code refactoring
- **test**: Adding or updating tests
- **chore**: Maintenance tasks

### Examples

```bash
feat(quiz): add hint system for questions

- Add hint field to question model
- Create hint button component
- Implement hint API endpoint
- Deduct points when hint is used

Closes #123
```

```bash
fix(timer): stop timer when session locks

Timer was continuing to run after incorrect answer.
Now properly stops when isLocked is true.

Fixes #456
```

## Pull Request Process

1. **Update your fork**
```bash
git remote add upstream https://github.com/shadow-dragon-2002/offensive_sec_quiz_2.git
git fetch upstream
git rebase upstream/main
```

2. **Ensure code quality**
   - Code builds without errors
   - All new code has appropriate documentation
   - Follows coding standards
   - No console.log statements in production code

3. **Create Pull Request**
   - Use a clear, descriptive title
   - Reference related issues
   - Describe what changed and why
   - Include screenshots for UI changes
   - List any breaking changes

### PR Template

```markdown
## Description
Brief description of changes

## Type of Change
- [ ] Bug fix
- [ ] New feature
- [ ] Breaking change
- [ ] Documentation update

## Changes Made
- Change 1
- Change 2

## Testing
How was this tested?

## Screenshots (if applicable)
Add screenshots here

## Checklist
- [ ] Code follows style guidelines
- [ ] Self-reviewed code
- [ ] Commented complex code
- [ ] Documentation updated
- [ ] No new warnings
- [ ] Tested locally
```

4. **Review Process**
   - Maintainer will review your PR
   - Address any feedback
   - Once approved, PR will be merged

## Adding New Features

### Planning

1. **Check existing issues** - feature might already be planned
2. **Open an issue** - discuss your feature idea
3. **Get feedback** - ensure alignment with project goals
4. **Create design doc** - for complex features

### Implementation

1. **Start small** - break feature into smaller PRs if needed
2. **Follow architecture** - maintain separation of concerns
3. **Add tests** - for critical functionality
4. **Update docs** - README, API docs, etc.

### Feature Examples

#### Adding Leaderboard

1. Backend changes:
   - Create leaderboard data model
   - Add API endpoints (GET /api/leaderboard)
   - Store top scores (consider database)

2. Frontend changes:
   - Create Leaderboard component
   - Add navigation to leaderboard
   - Style to match theme

3. Documentation:
   - Update README with new feature
   - Add API documentation
   - Update architecture docs

#### Adding Sound Effects

1. Prepare assets:
   - Add sound files to frontend/public/sounds/
   - Use free/licensed sounds only

2. Implementation:
   - Create sound utility (src/utils/sound.js)
   - Add sound toggle option
   - Play sounds on events (correct, wrong, complete)

3. Accessibility:
   - Add option to disable sounds
   - Don't rely on sound for critical feedback

## Testing

### Manual Testing

- Test all user flows
- Test edge cases
- Test on different browsers
- Test on mobile devices
- Test with slow network

### Future: Automated Testing

When adding tests:
- Use Jest for unit tests
- Use React Testing Library for components
- Use Cypress for E2E tests

## Documentation

When making changes, update:

- **README.md** - if adding features or changing setup
- **ARCHITECTURE.md** - if changing architecture
- **DEPLOYMENT.md** - if affecting deployment
- **Code comments** - for complex logic

## Questions?

- Open an issue for questions
- Tag with 'question' label
- Community will help answer

## Recognition

Contributors will be:
- Listed in README
- Mentioned in release notes
- Appreciated and thanked! 🎉

## Resources

### Learning Offensive Security
- [OWASP Top 10](https://owasp.org/www-project-top-ten/)
- [HackTheBox](https://www.hackthebox.com/)
- [TryHackMe](https://tryhackme.com/)

### React Resources
- [React Documentation](https://react.dev/)
- [React Hooks](https://react.dev/reference/react)

### Express.js Resources
- [Express.js Documentation](https://expressjs.com/)
- [MDN Web Docs](https://developer.mozilla.org/)

Thank you for contributing! 🚀
