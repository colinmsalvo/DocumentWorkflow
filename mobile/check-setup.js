#!/usr/bin/env node

/**
 * Quick Setup Checker for StaffPortal Mobile
 * Run this to verify everything is ready for mobile development
 */

const fs = require('fs');
const path = require('path');

console.log('🔍 StaffPortal Mobile Setup Checker');
console.log('=====================================\n');

let allGood = true;

// Check if we're in the mobile directory
function checkMobileDirectory() {
  if (!fs.existsSync('app.json')) {
    console.log('❌ Run this from the mobile directory: cd mobile');
    return false;
  }
  console.log('✅ In mobile directory');
  return true;
}

// Check if dependencies are installed
function checkDependencies() {
  if (!fs.existsSync('node_modules')) {
    console.log('❌ Dependencies not installed. Run: npm install');
    return false;
  }
  console.log('✅ Dependencies installed');
  return true;
}

// Check key files exist
function checkKeyFiles() {
  const requiredFiles = [
    'app.json',
    'package.json',
    'src/App.tsx',
    'src/screens/DashboardScreen.tsx',
    'src/contexts/AuthContext.tsx'
  ];

  let filesOk = true;
  requiredFiles.forEach(file => {
    if (fs.existsSync(file)) {
      console.log(`✅ ${file} exists`);
    } else {
      console.log(`❌ Missing: ${file}`);
      filesOk = false;
    }
  });
  return filesOk;
}

// Check app.json configuration
function checkAppConfig() {
  try {
    const appJson = JSON.parse(fs.readFileSync('app.json', 'utf8'));
    console.log(`✅ App name: ${appJson.expo.name}`);
    console.log(`✅ App slug: ${appJson.expo.slug}`);
    
    if (appJson.expo.owner && appJson.expo.owner !== 'your-expo-username') {
      console.log(`✅ Owner set: ${appJson.expo.owner}`);
    } else {
      console.log('⚠️  Owner not set - update "owner" in app.json with your Expo username');
    }
    return true;
  } catch (error) {
    console.log('❌ Invalid app.json file');
    return false;
  }
}

// Main checker
async function runChecks() {
  console.log('Checking mobile app setup...\n');
  
  allGood &= checkMobileDirectory();
  allGood &= checkDependencies();
  allGood &= checkKeyFiles();
  allGood &= checkAppConfig();
  
  console.log('\n=====================================');
  
  if (allGood) {
    console.log('🎉 Everything looks good!');
    console.log('\nNext steps:');
    console.log('1. Create Expo account at expo.dev');
    console.log('2. Install Expo Go on your phone');
    console.log('3. Run: npx expo start');
    console.log('4. Scan QR code with Expo Go app');
  } else {
    console.log('❌ Some issues need fixing');
    console.log('Fix the issues above and run this check again');
  }
}

runChecks();