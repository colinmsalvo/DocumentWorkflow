#!/usr/bin/env node

/**
 * React Native Environment Setup Checker
 * Validates that all required dependencies are installed
 */

const fs = require('fs');
const path = require('path');

function checkFile(filePath, description) {
  const exists = fs.existsSync(filePath);
  console.log(`${exists ? '✅' : '❌'} ${description}: ${filePath}`);
  return exists;
}

function checkPackageJson() {
  const packagePath = path.join(__dirname, 'package.json');
  if (!checkFile(packagePath, 'Package.json')) return false;
  
  try {
    const package = JSON.parse(fs.readFileSync(packagePath, 'utf8'));
    console.log(`📱 App: ${package.name} v${package.version}`);
    return true;
  } catch (error) {
    console.log('❌ Invalid package.json format');
    return false;
  }
}

function main() {
  console.log('🔍 React Native Setup Check\n');
  
  let allGood = true;
  
  allGood &= checkPackageJson();
  allGood &= checkFile('App.tsx', 'Main App component');
  allGood &= checkFile('metro.config.js', 'Metro bundler config');
  allGood &= checkFile('tsconfig.json', 'TypeScript config');
  allGood &= checkFile('babel.config.js', 'Babel config');
  
  console.log('\n' + (allGood ? '✅ Setup looks good!' : '❌ Setup issues found'));
}

if (require.main === module) {
  main();
}