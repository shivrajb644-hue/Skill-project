const fs = require('fs');
const path = require('path');

function copyFolderSync(from, to) {
  if (!fs.existsSync(from)) return;
  if (!fs.existsSync(to)) fs.mkdirSync(to, { recursive: true });
  fs.readdirSync(from).forEach(element => {
    const stat = fs.lstatSync(path.join(from, element));
    if (stat.isFile()) {
      fs.copyFileSync(path.join(from, element), path.join(to, element));
    } else if (stat.isDirectory()) {
      copyFolderSync(path.join(from, element), path.join(to, element));
    }
  });
}

console.log('[Build] Preparing standalone assets for packaging...');
const root = path.resolve(__dirname, '..');
const standaloneNext = path.join(root, '.next', 'standalone', '.next');
const staticSrc = path.join(root, '.next', 'static');
const staticDest = path.join(standaloneNext, 'static');

const publicSrc = path.join(root, 'public');
const publicDest = path.join(root, '.next', 'standalone', 'public');

copyFolderSync(staticSrc, staticDest);
copyFolderSync(publicSrc, publicDest);

// Also copy .env.local if exists
if (fs.existsSync(path.join(root, '.env.local'))) {
  fs.copyFileSync(path.join(root, '.env.local'), path.join(root, '.next', 'standalone', '.env.local'));
}

console.log('[Build] Standalone assets prepared successfully.');
