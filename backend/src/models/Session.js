const { v4: uuidv4 } = require('uuid');

class SessionManager {
  constructor() {
    this.sessions = new Map();
    this.leaderboard = []; // Array to store leaderboard entries
  }

  createSession(sessionId) {
    const session = {
      id: sessionId,
      currentLevel: 1,
      score: 1000, // Start with 1000 points
      answers: [],
      startTime: Date.now(),
      endTime: null,
      isCompleted: false,
      isLocked: false,
      correctAnswers: 0,
      totalQuestions: 30,
      timeLimit: 25 * 60 * 1000, // 25 minutes for escape room
      wrongAttempts: 0,
      canProgress: true, // Always allow progression
      username: null,
    };
    
    this.sessions.set(sessionId, session);
    return session;
  }

  getSession(sessionId) {
    return this.sessions.get(sessionId);
  }

  updateSession(sessionId, updates) {
    const session = this.sessions.get(sessionId);
    if (session) {
      Object.assign(session, updates);
      this.sessions.set(sessionId, session);
      return session;
    }
    return null;
  }

  lockSession(sessionId) {
    const session = this.sessions.get(sessionId);
    if (session) {
      session.isLocked = true;
      this.sessions.set(sessionId, session);
      return true;
    }
    return false;
  }

  isSessionExpired(sessionId) {
    const session = this.sessions.get(sessionId);
    if (!session) return true;
    
    const elapsed = Date.now() - session.startTime;
    return elapsed > session.timeLimit;
  }

  submitAnswer(sessionId, questionId, selectedAnswer, correctAnswer, points) {
    const session = this.sessions.get(sessionId);
    if (!session) {
      return { success: false, message: 'Session not found' };
    }

    if (session.isCompleted) {
      return { 
        success: true, 
        message: 'Quiz already completed',
        isCompleted: true,
        isCorrect: false,
        currentLevel: session.currentLevel,
        score: session.score
      };
    }

    if (this.isSessionExpired(sessionId)) {
      session.isCompleted = true;
      session.endTime = Date.now();
      this.sessions.set(sessionId, session);
      return { 
        success: false, 
        message: 'Time expired', 
        timeExpired: true,
        isLocked: true,
        isCompleted: true
      };
    }

    // Validate inputs
    if (selectedAnswer === undefined || selectedAnswer === null) {
      return { success: false, message: 'Invalid answer provided' };
    }

    const isCorrect = selectedAnswer === correctAnswer;
    const penalty = isCorrect ? 0 : 50; // 50 point penalty for wrong answer
    const reward = isCorrect ? (points || 100) : 0; // Add points for correct answer
    
    const answer = {
      questionId,
      selectedAnswer,
      isCorrect,
      penalty: penalty,
      reward: reward,
      timestamp: Date.now()
    };

    session.answers.push(answer);
    
    if (isCorrect) {
      // Correct answer - add reward points and move to next level
      session.score = session.score + reward;
      session.correctAnswers += 1;
      session.currentLevel += 1;
    } else {
      // Wrong answer - apply penalty but allow progression
      session.score = Math.max(0, session.score - penalty);
      session.wrongAttempts += 1;
      // DO NOT lock session - allow continuation
      // DO NOT advance level - must answer correctly
    }

    // Check if completed all questions (30 total)
    if (session.currentLevel > 30) {
      session.isCompleted = true;
      session.endTime = Date.now();
    }

    this.sessions.set(sessionId, session);

    return {
      success: true,
      isCorrect,
      currentLevel: session.currentLevel,
      score: session.score,
      isLocked: false, // Never lock in escape room mode
      isCompleted: session.isCompleted,
      penalty: penalty,
      reward: reward,
      wrongAttempts: session.wrongAttempts
    };
  }

  getSessionStats(sessionId) {
    const session = this.sessions.get(sessionId);
    if (!session) return null;

    const elapsed = Date.now() - session.startTime;
    const remainingTime = Math.max(0, session.timeLimit - elapsed);

    return {
      currentLevel: session.currentLevel,
      score: session.score,
      correctAnswers: session.correctAnswers,
      totalQuestions: session.totalQuestions,
      isCompleted: session.isCompleted,
      isLocked: session.isLocked,
      elapsedTime: elapsed,
      remainingTime: remainingTime,
      timeLimit: session.timeLimit,
      startTime: session.startTime,
      endTime: session.endTime
    };
  }

  deleteSession(sessionId) {
    return this.sessions.delete(sessionId);
  }

  cleanupOldSessions(maxAge = 60 * 60 * 1000) {
    const now = Date.now();
    for (const [sessionId, session] of this.sessions.entries()) {
      const age = now - session.startTime;
      if (age > maxAge) {
        this.sessions.delete(sessionId);
      }
    }
  }

  cleanupAllSessions() {
    const count = this.sessions.size;
    this.sessions.clear();
    return count;
  }

  getActiveSessionCount() {
    return this.sessions.size;
  }

  validateSession(sessionId) {
    if (!sessionId || typeof sessionId !== 'string') {
      return false;
    }
    return this.sessions.has(sessionId);
  }

  getSessionHealth() {
    return {
      activeSessions: this.sessions.size,
      totalSessions: this.sessions.size,
      timestamp: new Date().toISOString()
    };
  }

  // Calculate grade based on score, time remaining, and accuracy
  calculateGrade(score, timeRemaining, correctAnswers, wrongAttempts) {
    const totalAttempts = correctAnswers + wrongAttempts;
    const accuracyRate = totalAttempts > 0 ? (correctAnswers / totalAttempts) * 100 : 0;
    const scorePercentage = (score / 4000) * 100; // Max possible score is ~4000
    const timeRemainingMinutes = timeRemaining / (60 * 1000);
    const timeBonus = Math.min(timeRemainingMinutes * 2, 100); // Max 100 points for time

    // Composite score calculation
    const compositeScore = (scorePercentage * 0.5) + (accuracyRate * 0.35) + (timeBonus * 0.15);

    // Grade thresholds (harder to achieve higher grades)
    if (compositeScore >= 85 && accuracyRate >= 90 && timeRemainingMinutes >= 5) {
      return {
        grade: 'S',
        title: 'LEGENDARY ELITE',
        color: '#FFD700',
        icon: '👑',
        description: 'Perfect execution with exceptional speed'
      };
    } else if (compositeScore >= 70 && accuracyRate >= 80 && timeRemainingMinutes >= 3) {
      return {
        grade: 'A',
        title: 'MASTER HACKER',
        color: '#00FF41',
        icon: '⭐',
        description: 'Outstanding performance with high accuracy'
      };
    } else if (compositeScore >= 55 && accuracyRate >= 65) {
      return {
        grade: 'B',
        title: 'SKILLED OPERATOR',
        color: '#00D4FF',
        icon: '🎖️',
        description: 'Solid performance with good accuracy'
      };
    } else {
      return {
        grade: 'C',
        title: 'ASPIRING HACKER',
        color: '#FF6B6B',
        icon: '📊',
        description: 'Good effort, room for improvement'
      };
    }
  }

  // Submit score to leaderboard
  submitToLeaderboard(sessionId, username) {
    const session = this.sessions.get(sessionId);
    if (!session || !session.isCompleted) {
      return { success: false, message: 'Session not found or not completed' };
    }

    if (!username || username.trim().length === 0) {
      return { success: false, message: 'Username is required' };
    }

    const timeRemaining = session.endTime 
      ? Math.max(0, session.timeLimit - (session.endTime - session.startTime))
      : 0;
    
    const totalAttempts = session.correctAnswers + session.wrongAttempts;
    const accuracyRate = totalAttempts > 0 ? (session.correctAnswers / totalAttempts) * 100 : 0;
    
    const gradeInfo = this.calculateGrade(
      session.score,
      timeRemaining,
      session.correctAnswers,
      session.wrongAttempts
    );

    const entry = {
      username: username.trim(),
      score: session.score,
      correctAnswers: session.correctAnswers,
      wrongAttempts: session.wrongAttempts,
      accuracyRate: Math.round(accuracyRate * 10) / 10,
      timeRemaining: timeRemaining,
      timeTaken: session.endTime - session.startTime,
      grade: gradeInfo.grade,
      gradeTitle: gradeInfo.title,
      gradeColor: gradeInfo.color,
      gradeIcon: gradeInfo.icon,
      gradeDescription: gradeInfo.description,
      timestamp: session.endTime || Date.now(),
      sessionId: sessionId
    };

    // Add to leaderboard
    this.leaderboard.push(entry);

    // Sort leaderboard by score (desc), then by time remaining (desc), then by accuracy (desc)
    this.leaderboard.sort((a, b) => {
      if (b.score !== a.score) return b.score - a.score;
      if (b.timeRemaining !== a.timeRemaining) return b.timeRemaining - a.timeRemaining;
      return b.accuracyRate - a.accuracyRate;
    });

    // Update session with username
    session.username = username.trim();
    this.sessions.set(sessionId, session);

    return {
      success: true,
      entry: entry,
      rank: this.leaderboard.findIndex(e => e.sessionId === sessionId) + 1
    };
  }

  // Get leaderboard
  getLeaderboard(limit = 100) {
    return this.leaderboard.slice(0, limit);
  }

  // Get user's rank
  getUserRank(sessionId) {
    const rank = this.leaderboard.findIndex(e => e.sessionId === sessionId);
    return rank >= 0 ? rank + 1 : null;
  }
}

module.exports = new SessionManager();
