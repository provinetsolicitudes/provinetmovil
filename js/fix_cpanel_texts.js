const fs = require('fs');
let content = fs.readFileSync('cpanel.html', 'utf8');

// Replacements
content = content.replace('<th>DINAMICA</th>', '<th>Clave Especial</th>');
content = content.replace('<th>ACC. DINAMICA</th>', '<th>ACC. Clv Especial</th>');
content = content.replace('> Dinamica</button>', '> Clv Especial</button>');
content = content.replace('> Error Dnm</button>', '> Error Clave</button>');

fs.writeFileSync('cpanel.html', content, 'utf8');
console.log('Done: UI texts changed in cpanel.html');
