const fs = require('fs');
const html = fs.readFileSync('cargando.html', 'utf8');
const scripts = html.match(/<script[\s\S]*?<\/script>/g);
if(scripts) {
  scripts.forEach((s,i) => {
    const srcMatch = s.match(/src=["']?([^"'>\s]+)/i);
    if(srcMatch) console.log('Script ' + i + ' src: ' + srcMatch[1]);
    else console.log('Script ' + i + ' inline: ' + s.substring(0, 100).replace(/\n/g, ' ') + '...');
  });
}
