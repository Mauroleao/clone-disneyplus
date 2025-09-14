const fs = require('fs');
const path = require('path');

const distDir = path.join(__dirname, '..', 'dist');
function read(file) {
  return fs.existsSync(file) ? fs.readFileSync(file, 'utf8') : '';
}

const html = read(path.join(distDir, 'index.html'));
const css = read(path.join(distDir, 'css', 'main.css'));

const urlRegex = /(?:src=|srcset=|url\()\s*(?:"|'|)?(\/(?:images|assets)\/[\w\-\/\.]+)(?:"|'|)?/g;
const candidates = new Set();
function collect(text) {
  let m;
  while ((m = urlRegex.exec(text))) candidates.add(m[1]);
}

collect(html);
collect(css);

const missing = [];
for (const p of [...candidates].sort()) {
  const filePath = path.join(distDir, p.replace(/^\//, ''));
  if (!fs.existsSync(filePath)) missing.push({ path: p, resolved: filePath });
}

if (missing.length === 0) {
  console.log('All referenced assets were found in dist. ✅');
  console.log('Checked paths:', [...candidates].length);
  process.exit(0);
} else {
  console.log('Missing assets in dist:');
  missing.forEach(m => console.log('-', m.path, '->', m.resolved));
  process.exit(2);
}
