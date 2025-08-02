#!/usr/bin/env node

/**
 * API Testing Script for TaskSaver
 * Tests all API endpoints to ensure they're working correctly
 */

const https = require('https');
const http = require('http');

// Configuration
const BASE_URL = process.env.TEST_URL || 'http://localhost:3000';
const isHttps = BASE_URL.startsWith('https');

console.log(`🧪 Testing API endpoints at: ${BASE_URL}`);
console.log('=' .repeat(50));

// Helper function to make HTTP requests
function makeRequest(path, options = {}) {
  return new Promise((resolve, reject) => {
    const url = new URL(path, BASE_URL);
    const requestModule = isHttps ? https : http;
    
    const requestOptions = {
      hostname: url.hostname,
      port: url.port || (isHttps ? 443 : 80),
      path: url.pathname + url.search,
      method: options.method || 'GET',
      headers: {
        'Content-Type': 'application/json',
        ...options.headers
      }
    };

    const req = requestModule.request(requestOptions, (res) => {
      let data = '';
      res.on('data', chunk => data += chunk);
      res.on('end', () => {
        try {
          const jsonData = JSON.parse(data);
          resolve({ status: res.statusCode, data: jsonData, headers: res.headers });
        } catch (e) {
          resolve({ status: res.statusCode, data: data, headers: res.headers });
        }
      });
    });

    req.on('error', reject);
    
    if (options.body) {
      req.write(JSON.stringify(options.body));
    }
    
    req.end();
  });
}

// Test functions
async function testHealthCheck() {
  console.log('🔍 Testing health check...');
  try {
    const response = await makeRequest('/api/health');
    
    if (response.status === 200) {
      console.log('✅ Health check passed');
      console.log(`   Database: ${response.data.database?.status || 'unknown'}`);
      console.log(`   Status: ${response.data.status}`);
      return true;
    } else {
      console.log('❌ Health check failed');
      console.log(`   Status: ${response.status}`);
      console.log(`   Response: ${JSON.stringify(response.data, null, 2)}`);
      return false;
    }
  } catch (error) {
    console.log('❌ Health check error:', error.message);
    return false;
  }
}

async function testAuthEndpoints() {
  console.log('🔐 Testing auth endpoints...');
  
  // Test registration endpoint
  try {
    const registerResponse = await makeRequest('/api/auth/register', {
      method: 'POST',
      body: {
        name: 'Test User',
        email: `test-${Date.now()}@example.com`,
        password: 'testpassword123'
      }
    });
    
    if (registerResponse.status === 201 || registerResponse.status === 409) {
      console.log('✅ Registration endpoint accessible');
    } else {
      console.log('⚠️  Registration endpoint returned:', registerResponse.status);
    }
  } catch (error) {
    console.log('❌ Registration endpoint error:', error.message);
  }
  
  // Test login endpoint structure
  try {
    const loginResponse = await makeRequest('/api/auth/login', {
      method: 'POST',
      body: {
        email: 'nonexistent@example.com',
        password: 'wrongpassword'
      }
    });
    
    if (loginResponse.status === 401) {
      console.log('✅ Login endpoint accessible (correctly rejected invalid credentials)');
    } else {
      console.log('⚠️  Login endpoint returned:', loginResponse.status);
    }
  } catch (error) {
    console.log('❌ Login endpoint error:', error.message);
  }
}

async function testProtectedEndpoints() {
  console.log('🔒 Testing protected endpoints (should return 401)...');
  
  const endpoints = ['/api/tasks', '/api/events', '/api/messages', '/api/profile'];
  
  for (const endpoint of endpoints) {
    try {
      const response = await makeRequest(endpoint);
      
      if (response.status === 401) {
        console.log(`✅ ${endpoint} correctly requires authentication`);
      } else {
        console.log(`⚠️  ${endpoint} returned status: ${response.status}`);
      }
    } catch (error) {
      console.log(`❌ ${endpoint} error:`, error.message);
    }
  }
}

async function testCORS() {
  console.log('🌐 Testing CORS headers...');
  
  try {
    const response = await makeRequest('/api/health', {
      headers: {
        'Origin': 'https://example.com'
      }
    });
    
    const corsHeaders = response.headers['access-control-allow-origin'];
    if (corsHeaders) {
      console.log('✅ CORS headers present');
      console.log(`   Access-Control-Allow-Origin: ${corsHeaders}`);
    } else {
      console.log('⚠️  CORS headers not found');
    }
  } catch (error) {
    console.log('❌ CORS test error:', error.message);
  }
}

// Main test runner
async function runTests() {
  console.log('🚀 Starting API tests...\n');
  
  const results = {
    health: await testHealthCheck(),
    auth: true, // Auth tests don't return boolean
    protected: true, // Protected endpoint tests don't return boolean
    cors: true // CORS tests don't return boolean
  };
  
  console.log('');
  await testAuthEndpoints();
  console.log('');
  await testProtectedEndpoints();
  console.log('');
  await testCORS();
  
  console.log('\n' + '=' .repeat(50));
  console.log('📊 Test Summary:');
  console.log(`   Health Check: ${results.health ? '✅ PASS' : '❌ FAIL'}`);
  console.log(`   Auth Endpoints: ✅ TESTED`);
  console.log(`   Protected Endpoints: ✅ TESTED`);
  console.log(`   CORS Configuration: ✅ TESTED`);
  
  if (!results.health) {
    console.log('\n⚠️  Critical issues found. Check your deployment configuration.');
    process.exit(1);
  } else {
    console.log('\n🎉 Basic API functionality verified!');
    process.exit(0);
  }
}

// Run tests
runTests().catch(error => {
  console.error('❌ Test runner failed:', error);
  process.exit(1);
});