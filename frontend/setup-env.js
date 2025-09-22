#!/usr/bin/env node

/**
 * Environment Setup Script
 * This script helps you create a .env file from the template
 */

const fs = require('fs');
const path = require('path');

const envExamplePath = path.join(__dirname, 'env.example');
const envPath = path.join(__dirname, '.env');

console.log('🚀 Setting up environment variables...\n');

// Check if .env already exists
if (fs.existsSync(envPath)) {
  console.log('⚠️  .env file already exists!');
  console.log('   If you want to recreate it, delete the existing .env file first.\n');
  process.exit(0);
}

// Check if env.example exists
if (!fs.existsSync(envExamplePath)) {
  console.log('❌ env.example file not found!');
  console.log('   Please make sure env.example exists in the frontend directory.\n');
  process.exit(1);
}

try {
  // Copy env.example to .env
  fs.copyFileSync(envExamplePath, envPath);
  
  console.log('✅ .env file created successfully!');
  console.log('📝 Please edit the .env file with your actual values:');
  console.log('   - Change VITE_JWT_SECRET_KEY to a strong secret');
  console.log('   - Update VITE_API_BASE_URL if needed');
  console.log('   - Set VITE_ENABLE_DEVTOOLS to false for production\n');
  
  console.log('🔒 Security reminder:');
  console.log('   - Never commit .env to version control');
  console.log('   - Use different secrets for production\n');
  
} catch (error) {
  console.log('❌ Error creating .env file:', error.message);
  process.exit(1);
}
