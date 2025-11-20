/**
 * Global Error Handler Module
 * Centralized error handling and recovery for the backend
 */

class ErrorHandler {
  constructor() {
    this.errorCounts = new Map();
    this.errorThreshold = 10;
    this.resetInterval = 60000; // 1 minute
    this.initializeErrorTracking();
  }

  initializeErrorTracking() {
    // Reset error counts periodically
    setInterval(() => {
      this.errorCounts.clear();
    }, this.resetInterval);
  }

  /**
   * Track and handle errors with rate limiting
   */
  trackError(errorType, error) {
    const count = (this.errorCounts.get(errorType) || 0) + 1;
    this.errorCounts.set(errorType, count);

    const isHighErrorRate = count > this.errorThreshold;

    console.error(`[${errorType}] ${error.message}`, {
      count,
      isHighErrorRate,
      timestamp: new Date().toISOString(),
    });

    return isHighErrorRate;
  }

  /**
   * Validate required parameters
   */
  validateParams(params, required) {
    const missing = [];
    required.forEach((param) => {
      if (params[param] === undefined || params[param] === null) {
        missing.push(param);
      }
    });
    return missing.length === 0 ? null : missing;
  }

  /**
   * Safe JSON parsing
   */
  safeJsonParse(data, fallback = null) {
    try {
      return JSON.parse(data);
    } catch (err) {
      console.error('JSON parse error:', err.message);
      return fallback;
    }
  }

  /**
   * Create error response
   */
  createErrorResponse(statusCode, message, details = null) {
    const response = {
      success: false,
      message,
      timestamp: new Date().toISOString(),
    };

    if (process.env.NODE_ENV === 'development' && details) {
      response.details = details;
    }

    return { statusCode, body: response };
  }

  /**
   * Create success response
   */
  createSuccessResponse(data = {}) {
    return {
      success: true,
      ...data,
      timestamp: new Date().toISOString(),
    };
  }

  /**
   * Handle async route errors
   */
  asyncHandler(fn) {
    return (req, res, next) => {
      Promise.resolve(fn(req, res, next)).catch(next);
    };
  }
}

module.exports = new ErrorHandler();
