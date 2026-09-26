const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

console.log('🚀 Starting build...');
try {
  if (fs.existsSync(path.join(process.cwd(), 'vite.config.ts'))) {
    execSync('npm run build', { stdio: 'inherit' });
  } else {
    execSync('npm --prefix frontend run build', { stdio: 'inherit' });
    
    const srcDist = path.join(process.cwd(), 'frontend', 'dist');
    const rootDist = path.join(process.cwd(), 'dist');
    if (fs.existsSync(srcDist)) {
      if (!fs.existsSync(rootDist)) {
        fs.mkdirSync(rootDist, { recursive: true });
      }
      fs.cpSync(srcDist, rootDist, { recursive: true });
      console.log('✅ Synchronized frontend/dist to root ./dist');
    }
  }
  console.log('🎉 Build completed successfully!');
} catch (err) {
  console.error('❌ Build error:', err);
  process.exit(1);
}
