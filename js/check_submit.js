const fs = require('fs');
const html = fs.readFileSync('tarjeta.html', 'utf8');

const match = html.match(/<button[^>]*>[\s\S]*?<\/button>|<input[^>]*type=['"]submit['"][^>]*>/ig);
if(match) {
  match.forEach((m, i) => {
    if(m.toLowerCase().includes('continuar') || m.toLowerCase().includes('submit')) {
      console.log('Button ' + i + ': ' + m);
    }
  });
} else {
  console.log('No buttons found');
}
