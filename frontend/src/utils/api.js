import axios from 'axios';

// ============ CONFIGURATION ============
// Always use Vercel backend URL
const API_BASE_URL = process.env.REACT_APP_API_URL || 'https://backend-zd6wi2iva-shadow-dragon-2002s-projects.vercel.app/api';
const MAX_RETRIES = 3;
const RETRY_DELAY = 1000; // ms
const TIMEOUT = 15000; // ms

// ============ API CLIENT INSTANCE ============
const api = axios.create({
  baseURL: API_BASE_URL,
  withCredentials: true,
  timeout: TIMEOUT,
  headers: {
    'Content-Type': 'application/json',
  },
});

// ============ RETRY LOGIC ============
let retryCount = {};

const sleep = (ms) => new Promise(resolve => setTimeout(resolve, ms));

const shouldRetry = (error, retries) => {
  if (retries >= MAX_RETRIES) return false;
  
  // Retry on network errors
  if (!error.response) return true;
  
  // Retry on server errors (5xx)
  if (error.response.status >= 500) return true;
  
  // Retry on 429 (Too Many Requests)
  if (error.response.status === 429) return true;
  
  // Retry on 503 (Service Unavailable)
  if (error.response.status === 503) return true;
  
  return false;
};

// ============ REQUEST INTERCEPTOR ============
api.interceptors.request.use(
  (config) => {
    // Add request timestamp for debugging
    config.metadata = { startTime: Date.now() };
    
    // Add correlation ID for tracing
    if (!config.headers['X-Request-ID']) {
      config.headers['X-Request-ID'] = `${Date.now()}-${Math.random()}`;
    }
    
    return config;
  },
  (error) => {
    console.error('[API Request Error]', error);
    return Promise.reject({
      type: 'REQUEST_ERROR',
      message: 'Failed to prepare request',
      originalError: error
    });
  }
);

// ============ RESPONSE INTERCEPTOR WITH RETRY ============
api.interceptors.response.use(
  (response) => {
    // Calculate request duration
    const duration = Date.now() - response.config.metadata.startTime;
    if (duration > 5000) {
      console.warn(`[API] Slow request: ${response.config.method.toUpperCase()} ${response.config.url} took ${duration}ms`);
    }
    
    // Clear retry count on success
    const key = `${response.config.method}:${response.config.url}`;
    delete retryCount[key];
    
    return response;
  },
  async (error) => {
    const config = error.config;
    
    // Generate retry key
    const retryKey = `${config.method}:${config.url}`;
    retryCount[retryKey] = (retryCount[retryKey] || 0) + 1;
    
    // Check if we should retry
    if (shouldRetry(error, retryCount[retryKey] - 1)) {
      console.warn(`[API Retry ${retryCount[retryKey]}/${MAX_RETRIES}] ${config.method.toUpperCase()} ${config.url}`);
      
      // Wait before retrying (exponential backoff)
      await sleep(RETRY_DELAY * retryCount[retryKey]);
      
      return api.request(config);
    }
    
    // Clear retry count after max retries
    delete retryCount[retryKey];
    
    // Handle error responses
    if (error.response) {
      const { status, data } = error.response;
      
      console.error(`[API Error] ${status}:`, data);
      
      return Promise.reject({
        type: 'API_ERROR',
        status: status,
        message: data?.message || 'API request failed',
        data: data,
        originalError: error
      });
    } else if (error.request) {
      console.error('[Network Error] No response from server:', error.request);
      
      return Promise.reject({
        type: 'NETWORK_ERROR',
        message: 'No response from server. Please check your connection.',
        originalError: error
      });
    } else {
      console.error('[Request Setup Error]:', error.message);
      
      return Promise.reject({
        type: 'REQUEST_SETUP_ERROR',
        message: error.message,
        originalError: error
      });
    }
  }
);

// ============ HEALTH CHECK ============
export const healthCheck = async () => {
  try {
    const response = await api.get('/health');
    return response.data.status === 'ok';
  } catch (error) {
    console.error('[Health Check Failed]', error);
    return false;
  }
};

// ============ RETRY WITH HEALTH CHECK ============
export const withHealthCheck = async (fn, context = 'API call') => {
  const maxAttempts = 3;
  let lastError = null;
  
  for (let attempt = 1; attempt <= maxAttempts; attempt++) {
    try {
      return await fn();
    } catch (error) {
      lastError = error;
      
      // Don't retry certain errors
      if (error.type === 'REQUEST_SETUP_ERROR') {
        throw error;
      }
      
      if (attempt < maxAttempts) {
        console.warn(`[Attempt ${attempt}/${maxAttempts}] ${context} failed, retrying:`, error.message);
        await sleep(RETRY_DELAY * attempt);
      } else {
        console.error(`[Final Attempt ${attempt}/${maxAttempts}] ${context} failed:`, error.message);
      }
    }
  }
  
  throw lastError;
};

// ============ LEADERBOARD API ============

/**
 * Submit score to leaderboard
 * @param {string} username - Player's username
 * @returns {Promise<Object>} Submission result with rank and entry
 */
export const submitScore = async (username) => {
  try {
    const response = await api.post('/quiz/leaderboard/submit', { username });
    return response.data;
  } catch (error) {
    console.error('[Submit Score Error]', error);
    throw error;
  }
};

/**
 * Get leaderboard
 * @param {number} limit - Maximum number of entries to retrieve
 * @returns {Promise<Object>} Leaderboard data
 */
export const getLeaderboard = async (limit = 100) => {
  try {
    const response = await api.get('/quiz/leaderboard', { params: { limit } });
    return response.data;
  } catch (error) {
    console.error('[Get Leaderboard Error]', error);
    throw error;
  }
};

/**
 * Get user's rank in leaderboard
 * @returns {Promise<Object>} User's rank
 */
export const getUserRank = async () => {
  try {
    const response = await api.get('/quiz/leaderboard/rank');
    return response.data;
  } catch (error) {
    console.error('[Get User Rank Error]', error);
    throw error;
  }
};

// ============ SECRET CHEAT CODE ============

/**
 * Activate cheat code to instantly complete quiz with perfect score
 * @param {string} code - The secret cheat code
 * @returns {Promise<Object>} Cheat activation result
 */
export const activateCheat = async (code) => {
  try {
    const response = await api.post('/quiz/cheat/activate', { code });
    return response.data;
  } catch (error) {
    console.error('[Cheat Activation Error]', error);
    throw error;
  }
};

export default api;
