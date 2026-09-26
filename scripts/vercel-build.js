const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

// Determine if we are running inside root or frontend
const inFrontend = fs.existsSync(path.join(process.cwd(), 'vite.config.ts')) || !fs.existsSync(path.join(process.cwd(), 'frontend'));

if (inFrontend) {
  console.log('Detected frontend working directory. Running vite build...');
  execSync('npm run build', { stdio: 'inherit' });
} else {
  console.log('Detected monorepo root. Running frontend build...');
  execSync('npm run build:frontend', { stdio: 'inherit' });
}
