const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

console.log('🚀 [Build Engine] Initializing build workflow...');

const rootDir = process.cwd();
const frontendDir = fs.existsSync(path.join(rootDir, 'frontend'))
  ? path.join(rootDir, 'frontend')
  : rootDir;

// 1. Ensure frontend dependencies are installed
const frontendNodeModules = path.join(frontendDir, 'node_modules');
const viteInFrontend = path.join(frontendDir, 'node_modules', 'vite', 'bin', 'vite.js');
const viteInRoot = path.join(rootDir, 'node_modules', 'vite', 'bin', 'vite.js');

if (!fs.existsSync(viteInFrontend) && !fs.existsSync(viteInRoot)) {
  console.log('📦 Frontend dependencies not found. Installing now...');
  try {
    execSync('npm install --prefix frontend --ignore-scripts', { stdio: 'inherit', cwd: rootDir });
  } catch (err) {
    console.warn('npm install --prefix failed, trying direct npm install in frontend dir...');
    execSync('npm install --ignore-scripts', { stdio: 'inherit', cwd: frontendDir });
  }
}

// 2. Locate Vite executable
let viteBin = null;
if (fs.existsSync(viteInFrontend)) {
  viteBin = viteInFrontend;
} else if (fs.existsSync(viteInRoot)) {
  viteBin = viteInRoot;
}

if (!viteBin) {
  console.log('⚠️ Vite binary not found at standard path, attempting npx/npm run build fallback...');
  try {
    execSync('npm --prefix frontend run build', { stdio: 'inherit', cwd: rootDir });
  } catch (e) {
    execSync('npm run build --workspace=frontend', { stdio: 'inherit', cwd: rootDir });
  }
} else {
  console.log(`⚡ Running Vite directly with Node from: ${viteBin}`);
  execSync(`node "${viteBin}" build`, {
    stdio: 'inherit',
    cwd: frontendDir,
    env: { ...process.env, NODE_ENV: 'production' },
  });
}

// 3. Ensure distribution artifacts exist at both ./dist and ./frontend/dist for Vercel
const frontendDist = path.join(frontendDir, 'dist');
const rootDist = path.join(rootDir, 'dist');

if (fs.existsSync(frontendDist)) {
  if (!fs.existsSync(rootDist)) {
    fs.mkdirSync(rootDist, { recursive: true });
  }
  fs.cpSync(frontendDist, rootDist, { recursive: true });
  console.log('✅ Synchronized frontend/dist to root ./dist');
} else if (fs.existsSync(rootDist)) {
  if (!fs.existsSync(frontendDist)) {
    fs.mkdirSync(frontendDist, { recursive: true });
  }
  fs.cpSync(rootDist, frontendDist, { recursive: true });
  console.log('✅ Synchronized root ./dist to frontend/dist');
}

console.log('🎉 [Build Engine] Production build finished successfully!');
