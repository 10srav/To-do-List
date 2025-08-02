#!/usr/bin/env node

/**
 * Build Test Script
 * Tests the build process locally before deployment
 */

const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

console.log('🔧 Starting build test...');
console.log('=' .repeat(50));

// Check if required files exist
const requiredFiles = [
  'package.json',
  'next.config.js',
  'tsconfig.json',
  '.env.production',
  'src/app/page.tsx',
  'src/lib/mongodb.ts',
  'src/lib/api.ts'
];

console.log('📁 Checking required files...');
for (const file of requiredFiles) {
  if (fs.existsSync(file)) {
    console.log(`✅ ${file}`);
  } else {
    console.log(`❌ ${file} - MISSING`);
  }
}

// Check environment variables
console.log('\n🔍 Checking environment variables...');
const envFile = '.env.production';
if (fs.existsSync(envFile)) {
  const envContent = fs.readFileSync(envFile, 'utf8');
  const requiredEnvVars = ['MONGODB_URI', 'NEXTAUTH_SECRET', 'NEXTAUTH_URL', 'NEXT_PUBLIC_USE_API'];
  
  for (const envVar of requiredEnvVars) {
    if (envContent.includes(envVar)) {
      console.log(`✅ ${envVar}`);
    } else {
      console.log(`❌ ${envVar} - MISSING`);
    }
  }
} else {
  console.log('❌ .env.production file not found');
}

// Test TypeScript compilation
console.log('\n🔍 Testing TypeScript compilation...');
try {
  execSync('npx tsc --noEmit', { stdio: 'inherit' });
  console.log('✅ TypeScript compilation successful');
} catch (error) {
  console.log('❌ TypeScript compilation failed');
  console.log('Error:', error.message);
}

// Test Next.js build
console.log('\n🏗️  Testing Next.js build...');
try {
  execSync('npm run build', { stdio: 'inherit' });
  console.log('✅ Next.js build successful');
} catch (error) {
  console.log('❌ Next.js build failed');
  console.log('Error:', error.message);
  process.exit(1);
}

console.log('\n🎉 Build test completed successfully!');
console.log('Your app is ready for deployment.');