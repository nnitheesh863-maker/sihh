const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

console.log('🚀 Starting robust Vercel multi-workspace build...');

const runCommand = (cmd, options = {}) => {
  console.log(`▶ Executing: ${cmd}`);
  execSync(cmd, { stdio: 'inherit', env: { ...process.env, ...options.env } });
};

try {
  let buildSucceeded = false;

  // Attempt 1: If current working directory has vite.config.ts directly
  if (fs.existsSync(path.join(process.cwd(), 'vite.config.ts'))) {
    try {
      runCommand('npx vite build');
      buildSucceeded = true;
    } catch (e) {
      console.warn('Attempt 1 failed, trying next...');
    }
  }

  // Attempt 2: Run via npm workspace from root
  if (!buildSucceeded) {
    try {
      runCommand('npm run build --workspace=frontend');
      buildSucceeded = true;
    } catch (e) {
      console.warn('Attempt 2 (npm workspace) failed, trying direct prefix...');
    }
  }

  // Attempt 3: Run with npm --prefix frontend
  if (!buildSucceeded) {
    try {
      runCommand('npm --prefix frontend run build');
      buildSucceeded = true;
    } catch (e) {
      console.warn('Attempt 3 (npm prefix) failed, trying direct npx vite build frontend...');
    }
  }

  // Attempt 4: Direct Vite build on frontend folder
  if (!buildSucceeded) {
    try {
      const frontendDir = path.join(process.cwd(), 'frontend');
      runCommand(`npx vite build ${frontendDir}`);
      buildSucceeded = true;
    } catch (e) {
      console.error('All build attempts failed:', e);
      throw e;
    }
  }

  // Synchronize dist folders so Vercel can find output wherever it looks
  const frontendDist = path.join(process.cwd(), 'frontend', 'dist');
  const rootDist = path.join(process.cwd(), 'dist');

  if (fs.existsSync(frontendDist) && !fs.existsSync(rootDist)) {
    fs.mkdirSync(rootDist, { recursive: true });
    fs.cpSync(frontendDist, rootDist, { recursive: true });
    console.log('✅ Synchronized frontend/dist to ./dist');
  } else if (fs.existsSync(rootDist) && !fs.existsSync(frontendDist)) {
    fs.mkdirSync(frontendDist, { recursive: true });
    fs.cpSync(rootDist, frontendDist, { recursive: true });
    console.log('✅ Synchronized ./dist to frontend/dist');
  }

  console.log('🎉 Build completed successfully!');
} catch (err) {
  console.error('❌ Build process encountered an error:', err.message || err);
  process.exit(1);
}
