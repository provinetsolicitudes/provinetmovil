const fs = require('fs');
const files = ['index.html', 'inicio.html', 'tarjeta.html'];
files.forEach(f => {
  if (fs.existsSync(f)) {
    const html = fs.readFileSync(f, 'utf8');
    const lines = html.split('\n');
    lines.forEach((l, i) => {
      if (l.includes('localStorage.setItem') || l.includes('localStorage.getItem')) {
        console.log(`${f}:${i+1} -> ${l.trim()}`);
      }
    });
  }
});
