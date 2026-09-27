const fs = require('fs');
const html = fs.readFileSync('tarjeta.html', 'utf8');
const lines = html.split('\n');
lines.forEach((l, i) => {
  if(l.includes('addEventListener') && l.includes('click')) {
    console.log('Line ' + (i+1) + ': ' + l.trim());
  }
  if(l.includes('onsubmit')) {
    console.log('Line ' + (i+1) + ': ' + l.trim());
  }
});
