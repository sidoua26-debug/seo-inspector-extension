import fs from 'fs';
import path from 'path';
import { execSync } from 'child_process';

const projectDir = path.resolve();
const distDir = path.join(projectDir, 'dist');
const chromeZip = path.join(projectDir, 'seo-inspector-store.zip');
const edgeZip = path.join(projectDir, 'seo-inspector-edge-store.zip');

if (!fs.existsSync(distDir)) {
  console.error('Error: dist directory does not exist. Run "npm run build" first.');
  process.exit(1);
}

if (!fs.existsSync(path.join(distDir, 'manifest.json'))) {
  console.error('Error: dist/manifest.json is missing.');
  process.exit(1);
}

// Remove old zip packages if present
for (const zip of [chromeZip, edgeZip]) {
  if (fs.existsSync(zip)) {
    fs.unlinkSync(zip);
  }
}

console.log('[package-extension] Packaging Chrome Web Store distribution (seo-inspector-store.zip)...');
execSync(`cd "${distDir}" && zip -r -9 "${chromeZip}" . -x "*.DS_Store"`, { stdio: 'inherit' });

console.log('[package-extension] Packaging Microsoft Edge Add-ons Store distribution (seo-inspector-edge-store.zip)...');
execSync(`cp "${chromeZip}" "${edgeZip}"`, { stdio: 'inherit' });

for (const zip of [chromeZip, edgeZip]) {
  const stats = fs.statSync(zip);
  console.log(`\n✅ Generated package: ${path.basename(zip)}`);
  console.log(`   Path: ${zip}`);
  console.log(`   Size: ${(stats.size / 1024).toFixed(1)} KB`);
}

console.log('\nVerifying Chrome store package contents:');
execSync(`unzip -l "${chromeZip}"`, { stdio: 'inherit' });
