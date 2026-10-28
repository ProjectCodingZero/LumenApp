const fs = require('fs');
const path = require('path');

function walk(dir) {
  const files = fs.readdirSync(dir);
  for (const f of files) {
    const full = path.join(dir, f);
    try {
      const stat = fs.statSync(full);
      if (stat.isDirectory()) {
        walk(full);
      } else if (f.endsWith('.tsx') || f.endsWith('.ts')) {
        const c = fs.readFileSync(full, 'utf8');
        if (c.includes('StyleSheet.create')) {
          console.log(full);
        }
      }
    } catch (e) {}
  }
}
walk(path.join(__dirname, '..', 'src'));
console.log('---DONE---');
