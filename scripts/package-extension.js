import fs from 'fs';
import path from 'path';
import { execSync } from 'child_process';

const projectDir = path.resolve();
const distDir = path.join(projectDir, 'dist');
const zipFile = path.join(projectDir, 'seo-inspector-store.zip');

if (!fs.existsSync(distDir)) {
  console.error('Error: dist directory does not exist. Run "npm run build" first.');
  process.exit(1);
}

if (!fs.existsSync(path.join(distDir, 'manifest.json'))) {
  console.error('Error: dist/manifest.json is missing.');
  process.exit(1);
}

// Remove old zip if present
if (fs.existsSync(zipFile)) {
  fs.unlinkSync(zipFile);
}

console.log('Packaging extension into seo-inspector-store.zip...');

// Using zip command from within dist so files are at zip root
execSync(`cd "${distDir}" && zip -r -9 "${zipFile}" . -x "*.DS_Store"`, { stdio: 'inherit' });

if (fs.existsSync(zipFile)) {
  const stats = fs.statSync(zipFile);
  console.log(`\n✅ Successfully generated seo-inspector-store.zip!`);
  console.log(`   Path: ${zipFile}`);
  console.log(`   Size: ${(stats.size / 1024).toFixed(1)} KB`);

  console.log('\nZip Archive Contents:');
  execSync(`unzip -l "${zipFile}"`, { stdio: 'inherit' });
} else {
  console.error('Error: Failed to create zip package.');
  process.exit(1);
}
