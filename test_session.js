// Test script to verify session persistence
const axios = require('axios');

const BASE_URL = 'https://offensive-sec-quiz-2.vercel.app/api';

async function testQuizFlow() {
  console.log('Testing Quiz Session Flow...\n');
  
  // Create axios instance with cookie jar
  const client = axios.create({
    baseURL: BASE_URL,
    withCredentials: true,
    headers: {
      'Content-Type': 'application/json'
    }
  });
  
  let cookieJar = '';
  
  // Intercept responses to capture cookies
  client.interceptors.response.use(response => {
    const setCookie = response.headers['set-cookie'];
    console.log('Raw Set-Cookie header:', setCookie);
    if (setCookie) {
      cookieJar = setCookie[0].split(';')[0];
      console.log('Received Cookie:', cookieJar);
    }
    return response;
  });
  
  // Intercept requests to send cookies
  client.interceptors.request.use(config => {
    if (cookieJar) {
      config.headers['Cookie'] = cookieJar;
      console.log('Sending Cookie:', cookieJar);
    }
    return config;
  });
  
  try {
    // Test 1: Health check
    console.log('1. Testing health endpoint...');
    const health = await client.get('/health');
    console.log('✓ Health:', health.data);
    console.log('');
    
    // Test 2: Start quiz
    console.log('2. Starting quiz...');
    const start = await client.post('/quiz/start');
    console.log('✓ Start Response:', start.data);
    console.log('');
    
    // Wait a moment
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    // Test 3: Check stats
    console.log('3. Checking quiz stats...');
    const stats = await client.get('/quiz/stats');
    console.log('✓ Stats Response:', stats.data);
    console.log('');
    
    // Test 4: Get first question
    console.log('4. Getting first question...');
    const question = await client.get('/quiz/question');
    console.log('✓ Question Response:', {
      success: question.data.success,
      level: question.data.currentLevel,
      questionText: question.data.question?.question?.substring(0, 50) + '...'
    });
    console.log('');
    
    console.log('All tests passed! ✅');
    
  } catch (error) {
    console.error('❌ Test failed:', error.response?.data || error.message);
  }
}

testQuizFlow();
